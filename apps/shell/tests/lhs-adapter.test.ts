import { describe, expect, it } from 'vitest';
import {
  LhsDanglingReferenceError,
  LhsEntityNotFoundError,
  LhsUnsupportedVersionError,
  SUPPORTED_EXPORT_VERSION,
  getEntity,
  getRelatedEntities,
  loadKnowledge,
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
    export_version: SUPPORTED_EXPORT_VERSION,
    schema_version: '0.1',
    generated_at: '2026-08-12T00:00:00+00:00',
    source: 'content/',
    entity_count: 1,
    entities: [makeEntity('lhs:phys.a')],
    ...overrides,
  };
}

describe('lhs-adapter — export metadata', () => {
  it('reads the generated export metadata', () => {
    const { metadata, entityCount } = loadKnowledge();
    expect(metadata.export_version).toBe('0.2');
    expect(metadata.schema_version).toBe('0.3');
    expect(entityCount).toBe(metadata.entity_count);
    expect(entityCount).toBeGreaterThanOrEqual(100);
  });
});

describe('lhs-adapter — version compatibility', () => {
  it('accepts the supported export version', () => {
    expect(() => loadKnowledge()).not.toThrow();
  });

  it('rejects an unsupported export version with a clear error', () => {
    const unsupported = makeExport({ export_version: '9.9' });
    expect(() => loadKnowledge(unsupported)).toThrow(LhsUnsupportedVersionError);
    try {
      loadKnowledge(unsupported);
    } catch (error) {
      expect(error).toBeInstanceOf(LhsUnsupportedVersionError);
      const message = (error as Error).message;
      expect(message).toContain('9.9');
      expect(message).toContain(SUPPORTED_EXPORT_VERSION);
    }
  });

  it('rejects before any entity lookup', () => {
    loadKnowledge(); // index primed with the real export
    expect(() => loadKnowledge(makeExport({ export_version: '9.9' }))).toThrow(
      LhsUnsupportedVersionError,
    );
  });
});

describe('lhs-adapter — entity retrieval', () => {
  it('retrieves lhs:phys.newtons-second-law correctly', () => {
    loadKnowledge();
    const law = getEntity('lhs:phys.newtons-second-law');
    expect(law.name).toBe("Newton's Second Law");
    expect(law.type).toBe('law');
    expect(law.equation).toContain('F = m·a');
    expect(law.status).toBe('draft');
  });

  it('throws a clear error for an unknown id', () => {
    loadKnowledge();
    expect(() => getEntity('lhs:phys.not-a-thing')).toThrow(LhsEntityNotFoundError);
  });
});

describe('lhs-adapter — related entities', () => {
  it('resolves all related entities of the law without silent dangling', () => {
    loadKnowledge();
    const related = getRelatedEntities('lhs:phys.newtons-second-law');
    const ids = related.map(({ entity }) => entity.id).sort();
    expect(ids).toEqual(
      ['lhs:phys.acceleration', 'lhs:phys.force', 'lhs:phys.mass', 'lhs:phys.momentum'].sort(),
    );
    for (const { entity, relationship } of related) {
      expect(entity.id).toBe(relationship.target);
      expect(entity.name).toBeTruthy();
    }
  });

  it('throws instead of silently dropping a dangling target', () => {
    const dangling = makeExport();
    dangling.entities[0]!.relationships = [{ type: 'related_to', target: 'lhs:phys.missing' }];
    loadKnowledge(dangling);
    expect(() => getRelatedEntities('lhs:phys.a')).toThrow(LhsDanglingReferenceError);
  });
});
