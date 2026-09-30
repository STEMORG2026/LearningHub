/**
 * lhs-adapter — the STEMMA consumer seam inside LearningHub.
 *
 * Consumes the GENERATED export (`apps/shell/src/data/knowledge.json`, vendored from
 * `STEMMA/exports/knowledge.json` via `pnpm sync:lhs`), never the
 * Markdown sources. The export is the only file this module reads across the seam.
 *
 * Contract policy (ADR-023): the version check is a MINIMUM-VERSION FLOOR, not an
 * equality pin. A producer that moves ahead (0.2 → 2.1.0 → 2.2.0 → …) must not break
 * this consumer — that exact failure mode (a hard pin rejecting a valid corpus) is
 * what broke this repo before. We accept any version >= MIN_SUPPORTED_EXPORT_VERSION
 * and reject anything genuinely older, with a clear error.
 *
 * The payload is validated structurally before use — no unchecked `as` cast — so a
 * malformed or emptied export is reported explicitly rather than silently coerced.
 *
 * An empty corpus is a VALID state (the vendored export may legitimately contain zero
 * entities), so it is not an error: lookups simply find nothing and relationships
 * resolve to nothing.
 *
 * This is a consumer proof, not a platform: it exposes a small surface and stops.
 */
import type {
  LhsEntity,
  LhsExportMetadata,
  LhsKnowledgeExport,
  LhsRelatedEntity,
} from './lhs-types';
export type { LhsEntity, LhsExportMetadata, LhsKnowledgeExport, LhsRelatedEntity } from './lhs-types';
import knowledge from '../data/knowledge.json';

/**
 * Minimum export version this consumer understands.
 *
 * Any `export_version` >= this value is accepted (versions are compared
 * numerically, component by component). This is deliberately a floor rather than
 * an exact match: the export contract advances over time and a pinned consumer is
 * a fragile consumer.
 */
export const MIN_SUPPORTED_EXPORT_VERSION = '2.0.0';

/** Retained for callers that still import the old symbol name. */
export const SUPPORTED_EXPORT_VERSION = MIN_SUPPORTED_EXPORT_VERSION;

export class LhsUnsupportedVersionError extends Error {
  constructor(readonly found: string) {
    super(
      `Unsupported STEMMA export version '${found}'; expected >= '${MIN_SUPPORTED_EXPORT_VERSION}'.`,
    );
    this.name = 'LhsUnsupportedVersionError';
  }
}

export class LhsMalformedExportError extends Error {
  constructor(readonly detail: string) {
    super(`Malformed STEMMA export: ${detail}`);
    this.name = 'LhsMalformedExportError';
  }
}

export class LhsEntityNotFoundError extends Error {
  constructor(readonly id: string) {
    super(`STEMMA entity not found: '${id}'.`);
    this.name = 'LhsEntityNotFoundError';
  }
}

export class LhsDanglingReferenceError extends Error {
  constructor(readonly from: string, readonly target: string) {
    super(`STEMMA dangling relationship target '${target}' referenced by '${from}'.`);
    this.name = 'LhsDanglingReferenceError';
  }
}

let index: Map<string, LhsEntity> | null = null;
let metadata: LhsExportMetadata | null = null;

/**
 * Compare two dotted numeric version strings. Returns a negative number when
 * `a < b`, 0 when equal, positive when `a > b`. Non-numeric components compare
 * as 0 so a malformed version degrades to "too old" rather than throwing.
 */
export function compareExportVersions(a: string, b: string): number {
  const pa = a.split('.').map((n) => Number.parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => Number.parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function isEntity(value: unknown): value is LhsEntity {
  if (typeof value !== 'object' || value === null) return false;
  const e = value as Record<string, unknown>;
  return typeof e.id === 'string' && typeof e.type === 'string' && typeof e.name === 'string';
}

/**
 * Validate the export shape and coerce it into the typed envelope.
 * Throws `LhsMalformedExportError` (never a bare cast) when the payload is not
 * a usable export.
 */
export function parseKnowledgeExport(raw: unknown): LhsKnowledgeExport {
  if (typeof raw !== 'object' || raw === null) {
    throw new LhsMalformedExportError('not an object');
  }
  const source = raw as Record<string, unknown>;

  if (typeof source.export_version !== 'string') {
    throw new LhsMalformedExportError('missing string `export_version`');
  }
  if (typeof source.schema_version !== 'string') {
    throw new LhsMalformedExportError('missing string `schema_version`');
  }
  if (!Array.isArray(source.entities)) {
    throw new LhsMalformedExportError('missing `entities` array');
  }

  const entities = source.entities.filter(isEntity);
  if (entities.length !== source.entities.length) {
    throw new LhsMalformedExportError(
      `${source.entities.length - entities.length} entit(ies) missing required id/type/name`,
    );
  }

  return {
    export_version: source.export_version,
    schema_version: source.schema_version,
    ...(typeof source.generated_at === 'string' ? { generated_at: source.generated_at } : {}),
    ...(typeof source.source === 'string' ? { source: source.source } : {}),
    ...(typeof source.entity_count === 'number' ? { entity_count: source.entity_count } : {}),
    entities,
    ...(typeof source.content_hash === 'string' ? { content_hash: source.content_hash } : {}),
    ...(typeof source.kernel_version === 'string' ? { kernel_version: source.kernel_version } : {}),
    ...(typeof source.relation_registry_version === 'string'
      ? { relation_registry_version: source.relation_registry_version }
      : {}),
  };
}

/**
 * Validate the export contract version and index the entities.
 * Rejects unsupported (too old) versions BEFORE any entity lookup.
 * An empty corpus is accepted — it yields an empty index, not an error.
 */
export function loadKnowledge(
  source: unknown = knowledge,
): { metadata: LhsExportMetadata; entityCount: number } {
  const parsed = parseKnowledgeExport(source);

  if (compareExportVersions(parsed.export_version, MIN_SUPPORTED_EXPORT_VERSION) < 0) {
    throw new LhsUnsupportedVersionError(parsed.export_version);
  }

  index = new Map(parsed.entities.map((entity) => [entity.id, entity]));
  metadata = {
    export_version: parsed.export_version,
    schema_version: parsed.schema_version,
    generated_at: parsed.generated_at ?? null,
    source: parsed.source ?? '',
    entity_count: parsed.entity_count ?? parsed.entities.length,
    ...(parsed.content_hash !== undefined ? { content_hash: parsed.content_hash } : {}),
    ...(parsed.kernel_version !== undefined ? { kernel_version: parsed.kernel_version } : {}),
  };
  return { metadata, entityCount: index.size };
}

function ensureLoaded(): Map<string, LhsEntity> {
  if (index === null) loadKnowledge();
  return index as Map<string, LhsEntity>;
}

/** Look up an entity, tolerating the `stemma:` / `lhs:` prefix variance. */
function findEntity(entities: Map<string, LhsEntity>, id: string): LhsEntity | undefined {
  const direct = entities.get(id);
  if (direct) return direct;
  if (id.startsWith('stemma:')) return entities.get(id.replace('stemma:', 'lhs:'));
  if (id.startsWith('lhs:')) return entities.get(id.replace('lhs:', 'stemma:'));
  return undefined;
}

export function getEntity(id: string): LhsEntity {
  const entity = findEntity(ensureLoaded(), id);
  if (!entity) throw new LhsEntityNotFoundError(id);
  return entity;
}

export function getAllEntities(): LhsEntity[] {
  return Array.from(ensureLoaded().values());
}

/**
 * Resolve an entity's outgoing relationships to their target entities.
 * Throws instead of silently skipping any target that is missing from the export.
 */
export function getRelatedEntities(id: string): LhsRelatedEntity[] {
  const entity = getEntity(id);
  const entities = ensureLoaded();
  return (entity.relationships ?? []).map((relationship) => {
    const target = findEntity(entities, relationship.target);
    if (!target) throw new LhsDanglingReferenceError(id, relationship.target);
    return { relationship, entity: target };
  });
}

export function getExportMetadata(): LhsExportMetadata | null {
  if (metadata === null) loadKnowledge();
  return metadata;
}
