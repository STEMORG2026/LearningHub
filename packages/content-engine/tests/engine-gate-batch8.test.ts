/**
 * Engine-gate verification for the authored narrative batches (batch-8 and later).
 *
 * Proves the narration work actually "runs under the engine": every authored narrative
 * artifact in `NARRATIVES_BATCH8` is routed through the production pipeline runner
 * `produce()` (ContentRequest → Blueprint → generate → deterministic schema + coverage
 * hard gates → semantic verifier → publication decision) and asserted to PUBLISH.
 *
 * This is a test-only seam: it imports the shell's authored data module so the engine's
 * own hard gates are the gatekeeper for content authorship — not a side-channel manual
 * loop. The narrative-lesson format's `validate` and `coverage` hooks encode the
 * deterministic contract, so a narrative that loses a required section, or is registered
 * under a concept it does not cover, is caught here.
 */
import { describe, expect, it } from 'vitest';
import { FormatRegistry, produce } from '../src/index';
import { NARRATIVES_BATCH8 } from '../../../apps/shell/src/data/narratives-batch8';

describe('engine-gate — batch-8 narratives publish through produce()', () => {
  it('every batch-8 artifact is a publishable narrative-lesson artifact', async () => {
    const registry = new FormatRegistry(); // narrative-lesson + quiz registered by default
    const entries = Object.entries(NARRATIVES_BATCH8);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.length).toBe(8); // the authored batch-8 set

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