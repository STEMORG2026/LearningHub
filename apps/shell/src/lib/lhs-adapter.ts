/**
 * lhs-adapter — the LearningHubSTEM consumer seam inside STEM-TUITION.
 *
 * Consumes the GENERATED export (`LearningHubSTEM/exports/knowledge.json`), never the
 * Markdown sources. The export is the only file this module reads across the seam.
 *
 * Contract: export version must equal SUPPORTED_EXPORT_VERSION; any other version is
 * rejected with a clear error. Dangling relationship targets are never silently dropped.
 *
 * This is a consumer proof, not a platform: it exposes three functions and stops.
 */
import type {
  LhsEntity,
  LhsExportMetadata,
  LhsKnowledgeExport,
  LhsRelatedEntity,
} from './lhs-types';
import knowledge from '../../../../../LearningHubSTEM/exports/knowledge.json';

export const SUPPORTED_EXPORT_VERSION = '0.1';

const EXPORT = knowledge as LhsKnowledgeExport;

export class LhsUnsupportedVersionError extends Error {
  constructor(readonly found: string) {
    super(
      `Unsupported LearningHubSTEM export version '${found}'; supported: '${SUPPORTED_EXPORT_VERSION}'.`,
    );
    this.name = 'LhsUnsupportedVersionError';
  }
}

export class LhsEntityNotFoundError extends Error {
  constructor(readonly id: string) {
    super(`LearningHubSTEM entity not found: '${id}'.`);
    this.name = 'LhsEntityNotFoundError';
  }
}

export class LhsDanglingReferenceError extends Error {
  constructor(readonly from: string, readonly target: string) {
    super(`LearningHubSTEM dangling relationship target '${target}' referenced by '${from}'.`);
    this.name = 'LhsDanglingReferenceError';
  }
}

let index: Map<string, LhsEntity> | null = null;
let metadata: LhsExportMetadata | null = null;

function assertExportShape(source: LhsKnowledgeExport): void {
  if (
    typeof source.export_version !== 'string' ||
    typeof source.schema_version !== 'string' ||
    !Array.isArray(source.entities)
  ) {
    throw new Error('Malformed LearningHubSTEM export: missing export metadata.');
  }
}

/**
 * Validate the export contract version and index the entities.
 * Rejects unsupported versions BEFORE any entity lookup.
 */
export function loadKnowledge(
  source: LhsKnowledgeExport = EXPORT,
): { metadata: LhsExportMetadata; entityCount: number } {
  assertExportShape(source);
  if (source.export_version !== SUPPORTED_EXPORT_VERSION) {
    throw new LhsUnsupportedVersionError(source.export_version);
  }
  index = new Map(source.entities.map((entity) => [entity.id, entity]));
  metadata = {
    export_version: source.export_version,
    schema_version: source.schema_version,
    generated_at: source.generated_at,
    source: source.source,
    entity_count: source.entity_count,
  };
  return { metadata, entityCount: index.size };
}

function ensureLoaded(): Map<string, LhsEntity> {
  if (index === null) loadKnowledge();
  return index as Map<string, LhsEntity>;
}

export function getEntity(id: string): LhsEntity {
  const entities = ensureLoaded();
  const entity = entities.get(id);
  if (!entity) throw new LhsEntityNotFoundError(id);
  return entity;
}

/**
 * Resolve an entity's outgoing relationships to their target entities.
 * Throws instead of silently skipping any target that is missing from the export.
 */
export function getRelatedEntities(id: string): LhsRelatedEntity[] {
  const entity = getEntity(id);
  const entities = ensureLoaded();
  return (entity.relationships ?? []).map((relationship) => {
    const target = entities.get(relationship.target);
    if (!target) throw new LhsDanglingReferenceError(id, relationship.target);
    return { relationship, entity: target };
  });
}

export function getExportMetadata(): LhsExportMetadata | null {
  if (metadata === null) loadKnowledge();
  return metadata;
}
