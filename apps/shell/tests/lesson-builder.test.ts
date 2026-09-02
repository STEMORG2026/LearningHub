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

describe('lesson-builder (consumer narrative seam)', () => {
  it('composes a narrated lesson for a concept that has a narrative', async () => {
    const narratives: Record<string, NarrativeContent> = await getNarratives();
    const narrated = makeEntity('lhs:phys.force');
    const lessons = buildLessons([narrated], narratives);
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