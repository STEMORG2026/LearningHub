import { describe, expect, it } from 'vitest';
import { composeNarrativeLesson, type LhsEntity, type NarrativeContent } from '@stem-tuition/content-provider';
import { getNarratives } from '../src/data/narratives';
import knowledge from '../src/data/knowledge.json';

function asEntity(e: unknown): LhsEntity {
  return e as LhsEntity;
}

// Load the (code-split) narrative record once for all tests.
const narrativesPromise: Promise<Record<string, NarrativeContent>> = getNarratives();

describe('integration: composed lessons against the vendored export', () => {
  const entities = (knowledge as { entities: unknown[] }).entities;

  it('composes a progressive story for every narrated concept in the real export', async () => {
    const NARRATIVES = await narrativesPromise;
    const narrated = entities.filter((e) => NARRATIVES[asEntity(e).id]);
    expect(narrated.length).toBeGreaterThan(0);
    // The narrated physics set grows as we author; assert a meaningful, current floor
    // so an accidental loss of a narrated concept is caught.
    expect(narrated.length).toBeGreaterThanOrEqual(57);
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

  it('keeps canonical definitions intact inside narrated lessons', async () => {
    const NARRATIVES = await narrativesPromise;
    const force = asEntity(entities.find((e) => asEntity(e).id === 'lhs:phys.force')!);
    const lesson = composeNarrativeLesson(force, NARRATIVES['lhs:phys.force']!);
    const canonical = lesson.sections.find((s) => s.kind === 'narrative');
    expect(canonical?.body).toBe(force.definition);
  });

  it('every narrated concept carries respectful attribution and an Explained deep-dive', async () => {
    const NARRATIVES = await narrativesPromise;
    const narrated = entities.filter((e) => NARRATIVES[asEntity(e).id]);
    for (const raw of narrated) {
      const entity = asEntity(raw);
      const lesson = composeNarrativeLesson(entity, NARRATIVES[entity.id]!);
      const kinds = lesson.sections.map((s) => s.kind);

      // Attribution: real people with recorded words, a timeline, and honoured views.
      const figureSection = lesson.sections.find((s) => s.kind === 'figure');
      expect(figureSection?.figures?.length ?? 0).toBeGreaterThan(0);
      expect(figureSection?.figures?.[0]?.name).toBeTruthy();
      expect(figureSection?.figures?.[0]?.contribution).toBeTruthy();
      expect(lesson.sections.some((s) => s.kind === 'timeline')).toBe(true);
      expect(lesson.sections.some((s) => s.kind === 'perspective')).toBe(true);

      // Scaling "Explained" deep-dive present with at least two rungs.
      const deep = lesson.sections.find((s) => s.kind === 'deep-dive');
      expect((deep?.depthRungs?.length ?? 0)).toBeGreaterThanOrEqual(2);

      // The deep-dive starts simple (a Curious rung) and scales up.
      expect(deep?.depthRungs?.[0]?.level).toBe('Curious');
    }
  });
});