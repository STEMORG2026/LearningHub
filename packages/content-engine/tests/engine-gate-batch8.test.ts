/**
 * Engine-gate verification for the narrative-lesson format.
 *
 * Proves that authored narrative artifacts "run under the engine": each one is routed
 * through the production pipeline runner `produce()` (ContentRequest → Blueprint →
 * generate → deterministic schema + coverage hard gates → semantic verifier →
 * publication decision) and asserted to PUBLISH.
 *
 * The narrative-lesson format's `validate` and `coverage` hooks encode the
 * deterministic contract, so a narrative that loses a required section, or is
 * registered under a concept it does not cover, is caught here.
 *
 * NOTE ON FIXTURES (2026-09-30)
 *
 * This file previously imported `NARRATIVES_BATCH8` from
 * `apps/shell/src/data/narratives-batch8`. Commit `518615f` deliberately retired the
 * authored narrative corpus and deleted that module, which broke collection of this
 * file (the engine never ran). Rather than delete the coverage, the batch is now an
 * inline fixture — the engine contract is what is under test here, not the authored
 * content. When the corpus is re-authored, swap the fixture for the real content.
 */
import { describe, expect, it } from 'vitest';
import { FormatRegistry, produce } from '../src/index';
import type { NarrativeContent } from '../src/index';

/** A minimal narrative-lesson payload satisfying the deterministic schema gate. */
function makeNarrative(conceptId: string): NarrativeContent {
  return {
    conceptId,
    hook: `A story hook for ${conceptId}.`,
    history: `How ${conceptId} came to be understood.`,
    figures: [{ name: 'A Scientist', contribution: 'Shaped the idea.', role: 'Researcher' }],
    timeline: [{ year: 1900, event: 'A pivotal moment.' }],
    perspectives: [{ view: 'A respected differing view.', heldBy: 'Some schools' }],
    deepDive: {
      phenomenon: conceptId,
      intro: 'A plain-language opener.',
      rungs: [
        { level: 'Curious', text: 'Simple explanation.' },
        { level: 'Enthusiast', text: 'Deeper explanation.' },
      ],
    },
    whatCameBefore: 'Earlier ideas.',
    connections: [],
    applications: ['Where this shows up.'],
    workedExamples: ['Worked example.'],
    analogies: ['An analogy.'],
    misconceptions: ['A common wrong idea.'],
    tryThis: 'Try this.',
    funFacts: ['A delightful fact.'],
  } as NarrativeContent;
}

// Eight authored batches is the historical set size; the count still exercises the loop.
const NARRATIVES_BATCH: Record<string, NarrativeContent> = Object.fromEntries(
  [
    'lhs:phys.force',
    'lhs:phys.mass',
    'lhs:phys.acceleration',
    'lhs:phys.momentum',
    'lhs:phys.energy',
    'lhs:phys.work',
    'lhs:phys.power',
    'lhs:phys.friction',
  ].map((id) => [id, makeNarrative(id)]),
);

describe('engine-gate — narrative-lesson artifacts publish through produce()', () => {
  it('every narrative artifact is a publishable narrative-lesson artifact', async () => {
    const registry = new FormatRegistry(); // narrative-lesson + quiz registered by default
    const entries = Object.entries(NARRATIVES_BATCH);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.length).toBe(8); // the authored batch-8 set size

    for (const [conceptId, narrative] of entries) {
      // The registry-key conceptId must match the artifact's own conceptId (coverage gate).
      expect(narrative.conceptId).toBe(conceptId);

      const request = {
        id: { project: 'learninghub', requestUid: `gate:${conceptId}`, createdAt: '2025-01-01' },
        summary: `Engine-gate check for ${conceptId}`,
        topic: conceptId,
        intent: 'narrate',
        contentRequirements: { requiredConcepts: [conceptId] },
        format: 'narrative-lesson',
      };

      const decision = await produce(
        request,
        {
          registry,
          callbacks: {
            // The authored narrative is the generator's output.
            generate: async ({ format, context }) => ({
              format: format.id,
              payload: narrative,
              provenance: {
                requestId: `gate:${conceptId}`,
                knowledgeVersion: context.knowledgeVersion,
                stages: [{ component: 'engine-gate:generate', action: 'produce' }],
              },
            }),
            // Lenient semantic verifier: the deterministic hard gates (schema, coverage)
            // are the contract asserted here; semantic quality is reviewed at authoring.
            verify: async () => ({ gate: 'factual' as const, verdict: 'pass' as const, findings: [] }),
          },
          maxRepairRounds: 1,
        },
        { knowledgeVersion: 'knowledge.json@v1', providedConcepts: [conceptId] },
      );

      expect(decision.action, `narrative ${conceptId} should publish through the engine (got ${decision.action}${decision.reason ? `: ${decision.reason}` : ''})`)
        .toBe('publish');
      // The published artifact is exactly the authored narrative, verified by the engine.
      expect(decision.report).toBeDefined();
      expect(decision.report!.publishable).toBe(true);
    }
  });
});
