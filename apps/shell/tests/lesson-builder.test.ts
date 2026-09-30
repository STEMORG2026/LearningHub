import { describe, expect, it } from 'vitest';
import { buildLessons } from '../src/lib/lesson-builder';
import { getNarratives } from '../src/data/narratives';
import type { LhsEntity, NarrativeContent } from '@learninghub/content-provider';

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

/**
 * NOTE ON THE AUTHORED CORPUS (2026-09-30)
 *
 * `518615f` deliberately retired the authored narrative corpus, so `getNarratives()`
 * returns `{}`. The narrated-lesson test below therefore uses a synthetic fixture so the
 * composition contract stays covered. The non-narrated fallback tests still use the real
 * (empty) corpus.
 */
const NARRATIVE_FIXTURE: NarrativeContent = {
  conceptId: 'lhs:phys.force',
  hook: 'It began with a push.',
  history: 'What was known before.',
  figures: [{ name: 'Isaac Newton', contribution: 'Formulated the laws of motion.', role: 'Physicist' }],
  timeline: [{ year: 1687, event: 'Principia published.' }],
  perspectives: [{ view: 'A differing view.', heldBy: 'Historians' }],
  deepDive: {
    phenomenon: 'Motion',
    intro: 'Simple.',
    rungs: [
      { level: 'Curious', text: 'Simple.' },
      { level: 'Enthusiast', text: 'Deeper.' },
    ],
  },
  whatCameBefore: 'Earlier ideas.',
  connections: ['lhs:phys.mass'],
  applications: ['Real world.'],
  workedExamples: ['Worked example.'],
  analogies: ['Like a trolley.'],
  misconceptions: ['A wrong idea.'],
  tryThis: 'Try this.',
  funFacts: ['A fact.'],
};

describe('lesson-builder (consumer narrative seam)', () => {
  it('composes a narrated lesson for a concept that has a narrative', () => {
    const narrated = makeEntity('lhs:phys.force');
    const lessons = buildLessons([narrated], { 'lhs:phys.force': NARRATIVE_FIXTURE });
    expect(lessons).toHaveLength(1);
    const lesson = lessons[0]!;
    expect(lesson.metadata.conceptId).toBe('lhs:phys.force');
    // Narrated lessons lead with a story hook and carry the full narrative arc.
    expect(lesson.sections[0]!.kind).toBe('story');
    const kinds = lesson.sections.map((s) => s.kind);
    expect(kinds).toContain('context');
    expect(kinds).toContain('analogy');
    expect(kinds).toContain('example');
    expect(kinds).toContain('application');
    expect(kinds).toContain('try-this');
  });

  it('falls back to the enriched base adapter for non-narrated concepts', () => {
    const plain = makeEntity('lhs:chem.matter');
    const lessons = buildLessons([plain], {});
    expect(lessons).toHaveLength(1);
    const lesson = lessons[0]!;
    expect(lesson.metadata.conceptId).toBe('lhs:chem.matter');
    // Base adapter still produces a narrative definition + a coherent lesson.
    expect(lesson.sections.some((s) => s.kind === 'narrative')).toBe(true);
  });

  it('handles a mixed set without losing any lesson', async () => {
    const narratives: Record<string, NarrativeContent> = await getNarratives();
    const narratedForce = makeEntity('lhs:phys.force');
    const narratedWork = makeEntity('lhs:phys.work');
    const plainMatter = makeEntity('lhs:chem.matter');
    const plainCell = makeEntity('lhs:bio.cell');
    const lessons = buildLessons([narratedForce, plainMatter, narratedWork, plainCell], narratives);
    expect(lessons).toHaveLength(4);
    const ids = new Set(lessons.map((l) => l.metadata.conceptId));
    expect(ids).toEqual(
      new Set(['lhs:phys.force', 'lhs:chem.matter', 'lhs:phys.work', 'lhs:bio.cell']),
    );
  });
});