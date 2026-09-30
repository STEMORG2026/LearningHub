import { describe, expect, it } from 'vitest';
import {
  LhsDanglingReferenceError,
  LhsEntityNotFoundError,
  LhsMalformedExportError,
  LhsUnsupportedVersionError,
  MIN_SUPPORTED_EXPORT_VERSION,
  compareExportVersions,
  getEntity,
  getRelatedEntities,
  loadKnowledge,
  parseKnowledgeExport,
} from '../src/lib/lhs-adapter';
import type { LhsEntity, LhsKnowledgeExport } from '../src/lib/lhs-types';

function makeEntity(id: string, type = 'concept'): LhsEntity {
  return {
    id,
    type,
    name: id,
    domain: 'physics',
    status: 'draft',
    definition: `Definition of ${id}`,
    provenance: { ai_drafted: true },
    relationships: [],
  };
}

function makeExport(overrides: Partial<LhsKnowledgeExport> = {}): LhsKnowledgeExport {
  return {
    export_version: '2.2.0',
    schema_version: '1.3.0',
    source: 'content/ + connections/ + sources/ (canonical)',
    entity_count: 1,
    entities: [makeEntity('lhs:phys.a')],
    ...overrides,
  };
}

describe('lhs-adapter — version policy (min-version floor)', () => {
  it('compares dotted versions numerically', () => {
    expect(compareExportVersions('2.2.0', '2.0.0')).toBeGreaterThan(0);
    expect(compareExportVersions('2.0.0', '2.2.0')).toBeLessThan(0);
    expect(compareExportVersions('2.0.0', '2.0.0')).toBe(0);
    expect(compareExportVersions('0.2', '2.0.0')).toBeLessThan(0);
    expect(compareExportVersions('10.0.0', '9.9.9')).toBeGreaterThan(0);
  });

  it('accepts any version at or above the floor', () => {
    expect(() => loadKnowledge(makeExport({ export_version: '2.0.0' }))).not.toThrow();
    expect(() => loadKnowledge(makeExport({ export_version: '2.2.0' }))).not.toThrow();
    expect(() => loadKnowledge(makeExport({ export_version: '3.0.0' }))).not.toThrow();
  });

  it('rejects a version below the floor with a clear error naming both values', () => {
    const tooOld = makeExport({ export_version: '0.2' });
    expect(() => loadKnowledge(tooOld)).toThrow(LhsUnsupportedVersionError);
    try {
      loadKnowledge(tooOld);
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain('0.2');
      expect(message).toContain(MIN_SUPPORTED_EXPORT_VERSION);
    }
  });

  it('rejects before any entity lookup', () => {
    loadKnowledge(); // index primed with the real export
    expect(() => loadKnowledge(makeExport({ export_version: '1.0.0' }))).toThrow(
      LhsUnsupportedVersionError,
    );
  });
});

describe('lhs-adapter — malformed export handling (no unchecked cast)', () => {
  it('rejects a non-object payload', () => {
    expect(() => parseKnowledgeExport(null)).toThrow(LhsMalformedExportError);
    expect(() => parseKnowledgeExport('nope')).toThrow(LhsMalformedExportError);
  });

  it('rejects a payload with no entities array', () => {
    expect(() => parseKnowledgeExport({ export_version: '2.2.0', schema_version: '1.3.0' })).toThrow(
      LhsMalformedExportError,
    );
  });

  it('rejects an entity missing required fields', () => {
    const bad = { export_version: '2.2.0', schema_version: '1.3.0', entities: [{ id: 'x' }] };
    expect(() => parseKnowledgeExport(bad)).toThrow(LhsMalformedExportError);
  });

  it('accepts a well-formed modern export and surfaces optional metadata', () => {
    const parsed = parseKnowledgeExport({
      export_version: '2.2.0',
      schema_version: '1.3.0',
      content_hash: 'sha256:abc',
      kernel_version: '3.0.0',
      entities: [makeEntity('lhs:phys.a')],
    });
    expect(parsed.export_version).toBe('2.2.0');
    expect(parsed.content_hash).toBe('sha256:abc');
    expect(parsed.kernel_version).toBe('3.0.0');
    // generated_at is absent from the modern contract and must not be required.
    expect(parsed.generated_at).toBeUndefined();
  });
});

describe('lhs-adapter — empty corpus is a valid state', () => {
  it('loads an empty export without throwing and reports zero entities', () => {
    const { entityCount, metadata } = loadKnowledge(
      makeExport({ entities: [], entity_count: 0 }),
    );
    expect(entityCount).toBe(0);
    expect(metadata.entity_count).toBe(0);
    expect(metadata.generated_at).toBeNull();
  });

  it('throws a clear not-found error when looking up in an empty corpus', () => {
    loadKnowledge(makeExport({ entities: [], entity_count: 0 }));
    expect(() => getEntity('lhs:phys.anything')).toThrow(LhsEntityNotFoundError);
  });
});

describe('lhs-adapter — generated_at is optional (2.x contract)', () => {
  it('surfaces generated_at as null when the export omits it', () => {
    const { metadata } = loadKnowledge(makeExport());
    expect(metadata.generated_at).toBeNull();
  });

  it('surfaces generated_at when an older export provides it', () => {
    const { metadata } = loadKnowledge(
      makeExport({ export_version: '2.0.0', generated_at: '2026-08-12T00:00:00+00:00' }),
    );
    expect(metadata.generated_at).toBe('2026-08-12T00:00:00+00:00');
  });
});

describe('lhs-adapter — entity retrieval', () => {
  it('retrieves a known entity by id', () => {
    loadKnowledge(makeExport({ entities: [makeEntity('lhs:phys.force', 'quantity')] }));
    const entity = getEntity('lhs:phys.force');
    expect(entity.id).toBe('lhs:phys.force');
    expect(entity.type).toBe('quantity');
  });

  it('resolves across the stemma: / lhs: prefix variance', () => {
    loadKnowledge(makeExport({ entities: [makeEntity('stemma:phys.force')] }));
    expect(getEntity('lhs:phys.force').id).toBe('stemma:phys.force');
    expect(getEntity('stemma:phys.force').id).toBe('stemma:phys.force');
  });

  it('throws a clear error for an unknown id', () => {
    loadKnowledge(makeExport());
    expect(() => getEntity('lhs:phys.not-a-thing')).toThrow(LhsEntityNotFoundError);
  });
});

describe('lhs-adapter — related entities', () => {
  it('resolves related entities without silent dangling', () => {
    const a = makeEntity('lhs:phys.a');
    a.relationships = [{ type: 'related_to', target: 'lhs:phys.b' }];
    loadKnowledge(makeExport({ entities: [a, makeEntity('lhs:phys.b')], entity_count: 2 }));

    const related = getRelatedEntities('lhs:phys.a');
    expect(related).toHaveLength(1);
    expect(related[0]!.entity.id).toBe('lhs:phys.b');
    expect(related[0]!.relationship.target).toBe('lhs:phys.b');
  });

  it('throws instead of silently dropping a dangling target', () => {
    const dangling = makeEntity('lhs:phys.a');
    dangling.relationships = [{ type: 'related_to', target: 'lhs:phys.missing' }];
    loadKnowledge(makeExport({ entities: [dangling] }));
    expect(() => getRelatedEntities('lhs:phys.a')).toThrow(LhsDanglingReferenceError);
  });
});

describe('lhs-adapter — real vendored export', () => {
  it('loads the vendored export without a version or shape error', () => {
    // The vendored export may be empty (content retired) but it must always be
    // structurally valid and satisfy the version floor.
    const { metadata } = loadKnowledge();
    expect(compareExportVersions(metadata.export_version, MIN_SUPPORTED_EXPORT_VERSION)).toBeGreaterThanOrEqual(0);
    expect(metadata.schema_version).toBeTruthy();
  });
});
