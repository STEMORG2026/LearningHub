import { describe, expect, it } from 'vitest';
import { composeNarrativeLesson, type LhsEntity } from '@stem-tuition/content-provider';
import { NARRATIVES } from '../src/data/narratives';
import knowledge from '../src/data/knowledge.json';

function asEntity(e: unknown): LhsEntity {
  return e as LhsEntity;
}

describe('integration: composed lessons against the vendored export', () => {
  const entities = (knowledge as { entities: unknown[] }).entities;

  it('composes a progressive story for every narrated concept in the real export', () => {
    const narrated = entities.filter((e) => NARRATIVES[asEntity(e).id]);
    expect(narrated.length).toBeGreaterThan(0);
    for (const raw of narrated) {
      const entity = asEntity(raw);
      const lesson = composeNarrativeLesson(entity, NARRATIVES[entity.id]!);
      const kinds = lesson.sections.map((s) => s.kind);
      // Every narrated lesson must lead with a story hook and cover the arc.
      expect(kinds[0]).toBe('story');
      expect(kinds).toContain('context');
      expect(kinds).toContain('analogy');
      expect(kinds).toContain('example');
      expect(kinds).toContain('application');
      expect(kinds).toContain('misconception');
      expect(kinds).toContain('try-this');
      expect(kinds).toContain('fun-fact');
      expect(lesson.metadata.conceptId).toBe(entity.id);
    }
  });

  it('keeps canonical definitions intact inside narrated lessons', () => {
    const force = asEntity(entities.find((e) => asEntity(e).id === 'lhs:phys.force')!);
    const lesson = composeNarrativeLesson(force, NARRATIVES['lhs:phys.force']!);
    const canonical = lesson.sections.find((s) => s.kind === 'narrative');
    expect(canonical?.body).toBe(force.definition);
  });
});