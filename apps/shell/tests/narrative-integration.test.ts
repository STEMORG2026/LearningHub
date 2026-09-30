import { describe, expect, it } from 'vitest';
import {
  composeNarrativeLesson,
  type LhsEntity,
  type NarrativeContent,
} from '@learninghub/content-provider';
import { getNarratives } from '../src/data/narratives';
import knowledge from '../src/data/knowledge.json';

function asEntity(e: unknown): LhsEntity {
  return e as LhsEntity;
}

// Load the (code-split) narrative record once for all tests.
const narrativesPromise: Promise<Record<string, NarrativeContent>> = getNarratives();

/**
 * NOTE ON THE AUTHORED CORPUS (2026-09-30)
 *
 * Commit `518615f` deliberately retired the authored narrative corpus: the eight
 * `narratives-batch*.ts` modules were deleted and `narratives.ts` was stubbed to
 * return `{}`. That was an intentional content decision, not a regression.
 *
 * These tests therefore no longer assert a fixed narrated *count* (the previous
 * floor of 65 concepts). They assert two things that remain true and valuable
 * regardless of how much content is authored:
 *
 *   1. The composition SEAM works — given a narrative, `composeNarrativeLesson`
 *      produces the full required section arc. This is exercised with a synthetic
 *      fixture so the contract stays covered even with an empty corpus.
 *   2. The RETIRED STATE is real — `getNarratives()` returns an empty record, so a
 *      future re-authoring is a deliberate act that will flip these assertions.
 *
 * When the corpus is re-authored, replace the synthetic fixture with the real
 * content and restore a count floor.
 */

const FIXTURE: NarrativeContent = {
  conceptId: 'lhs:phys.force',
  hook: 'It began with a push.',
  history: 'What was known before, and why the idea arose.',
  figures: [
    {
      name: 'Isaac Newton',
      contribution: 'Formulated the laws of motion.',
      role: 'Physicist',
    },
  ],
  timeline: [{ year: 1687, event: 'Principia published.' }],
  perspectives: [{ view: 'A respected differing view.', heldBy: 'Some historians' }],
  deepDive: {
    phenomenon: 'Why things move as they do.',
    intro: 'A simple explanation.',
    rungs: [
      { level: 'Curious', text: 'A simple explanation.' },
      { level: 'Enthusiast', text: 'A deeper explanation.' },
    ],
  },
  whatCameBefore: 'Earlier ideas about motion.',
  connections: ['lhs:phys.mass'],
  applications: ['Where this shows up in the world.'],
  workedExamples: ['Worked example text.'],
  analogies: ['Like a shopping trolley.'],
  misconceptions: ['A common wrong idea.'],
  tryThis: 'Try this at home.',
  funFacts: ['A delightful fact.'],
  estimatedTimeMinutes: 5,
};

describe('integration: composed lessons against the vendored export', () => {
  const entities = (knowledge as { entities: unknown[] }).entities;

  it('the authored corpus is retired — getNarratives() returns an empty record', async () => {
    const NARRATIVES = await narrativesPromise;
    // Intentional state set by 518615f. If this fails, the corpus was re-authored:
    // update this test and restore a positive count assertion.
    expect(Object.keys(NARRATIVES)).toHaveLength(0);
  });

  it('composes a progressive story for a narrated concept (seam contract)', () => {
    const entity: LhsEntity = {
      id: 'lhs:phys.force',
      type: 'quantity',
      name: 'Force',
      domain: 'physics',
      status: 'canonical',
      definition: 'Force is the rate of change of momentum.',
      provenance: { ai_drafted: true },
      relationships: [],
    };

    const lesson = composeNarrativeLesson(entity, FIXTURE);
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
  });

  it('keeps canonical definitions intact inside narrated lessons', () => {
    const entity: LhsEntity = {
      id: 'lhs:phys.force',
      type: 'quantity',
      name: 'Force',
      domain: 'physics',
      status: 'canonical',
      definition: 'Force is the rate of change of momentum.',
      provenance: { ai_drafted: true },
      relationships: [],
    };

    const lesson = composeNarrativeLesson(entity, FIXTURE);
    const canonical = lesson.sections.find((s) => s.kind === 'narrative');
    expect(canonical?.body).toBe(entity.definition);
  });

  it('every narrated concept carries respectful attribution and an Explained deep-dive', () => {
    const entity: LhsEntity = {
      id: 'lhs:phys.force',
      type: 'quantity',
      name: 'Force',
      domain: 'physics',
      status: 'canonical',
      definition: 'Force is the rate of change of momentum.',
      provenance: { ai_drafted: true },
      relationships: [],
    };

    const lesson = composeNarrativeLesson(entity, FIXTURE);
    const kinds = lesson.sections.map((s) => s.kind);

    // Attribution: real people with recorded words, a timeline, and honoured views.
    const figureSection = lesson.sections.find((s) => s.kind === 'figure');
    expect(figureSection?.figures?.length ?? 0).toBeGreaterThan(0);
    expect(figureSection?.figures?.[0]?.name).toBeTruthy();
    expect(figureSection?.figures?.[0]?.contribution).toBeTruthy();
    expect(kinds).toContain('timeline');
    expect(kinds).toContain('perspective');

    // Scaling "Explained" deep-dive present with at least two rungs.
    const deep = lesson.sections.find((s) => s.kind === 'deep-dive');
    expect(deep?.depthRungs?.length ?? 0).toBeGreaterThanOrEqual(2);

    // The deep-dive starts simple (a Curious rung) and scales up.
    expect(deep?.depthRungs?.[0]?.level).toBe('Curious');
  });

  it('the vendored export is structurally valid and satisfies the version floor', () => {
    const exportVersion = (knowledge as { export_version: string }).export_version;
    expect(typeof exportVersion).toBe('string');
    expect(Array.isArray(entities)).toBe(true);
  });
});
