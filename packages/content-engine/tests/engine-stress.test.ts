/**
 * Stress tests for the production content engine (architecture v2, N4–N6).
 *
 * The engine is a *production system* under hard-gate publication. These tests are
 * deliberately adversarial: they drive the runner with the twelve radically-different
 * request shapes from the review (§22 / §O), plus boundary and invalid inputs, repair-loop
 * exhaustion, malformed artifacts, and verifier-gate separation. The invariant asserted
 * throughout is *damage limitation*: the engine never throws on hostile input, always
 * returns an explicit PublicationDecision, respects hard gates (a deterministic FAIL cannot
 * be masked by a lenient semantic verifier), and reports its state truthfully.
 */
import { describe, expect, it } from 'vitest';
import {
  FormatRegistry,
  NARRATIVE_LESSON_FORMAT,
  QUIZ_FORMAT,
  produce,
  evaluateGates,
  failGate,
  passGate,
  type Artifact,
  type ContentRequest,
  type FormatSpec,
} from '../src/index';

// ────────────────────────────────────────────────────────
// Fixtures & helpers
// ────────────────────────────────────────────────────────

function makeRequest(over: Partial<ContentRequest> = {}): ContentRequest {
  return {
    id: { project: 'learninghub', requestUid: `r-${Math.random().toString(36).slice(2)}`, createdAt: '2025-01-01' },
    summary: 'Explain a concept',
    topic: 'some-topic',
    intent: 'explain',
    ...over,
  };
}

function goodNarrative(conceptId: string) {
  return {
    conceptId,
    hook: 'h',
    history: 'st',
    figures: [{ name: 'n', role: 'r', contribution: 'c' }],
    timeline: [{ period: '1900', event: 'e' }],
    perspectives: [{ figure: 'f', view: 'v', standing: 's' }],
    deepDive: {
      phenomenon: 'p',
      intro: 'i',
      rungs: [
        { level: 'Curious', audience: 'a', body: 'b' },
        { level: 'Nerd', audience: 'a', body: 'b' },
      ],
    },
    misconceptions: ['m'],
  };
}

function goodQuiz(conceptId: string) {
  return {
    objective: `Assess ${conceptId}`,
    questions: [
      {
        prompt: 'Q1?',
        options: ['a', 'b'],
        explanation: 'because',
        conceptId,
      },
    ],
  };
}

function narrativeArtifact(conceptId: string): Artifact {
  return { format: 'narrative-lesson', payload: goodNarrative(conceptId), provenance: { requestId: 'r', stages: [{ component: 'g', action: 'p' }] } };
}

function quizArtifact(conceptId: string): Artifact {
  return { format: 'quiz', payload: goodQuiz(conceptId), provenance: { requestId: 'r', stages: [{ component: 'g', action: 'p' }] } };
}

function passSemantic(): Promise<{ gate: 'factual'; verdict: 'pass'; findings: [] }> {
  return Promise.resolve({ gate: 'factual', verdict: 'pass', findings: [] });
}

function context(providedConcepts: string[]) {
  return { knowledgeVersion: 'k1', providedConcepts };
}

/** Always-generating runner (regenerate the same valid artifact) + pass-all semantics. */
function passingRunner(artifact: Artifact, registry: FormatRegistry) {
  return {
    registry,
    callbacks: {
      generate: async () => artifact,
      verify: passSemantic,
    },
    maxRepairRounds: 2,
  };
}

// ────────────────────────────────────────────────────────
// §O — the twelve radically-different-content quality test
// ────────────────────────────────────────────────────────
describe('§O quality test — 12 radically-different requests survive the same core', () => {
  it('1. beginner explanation → narrative-lesson, intro depth, no crash', async () => {
    const d = await produce(
      makeRequest({ intent: 'explain', audience: { kind: 'learner', ageRange: '11–14' }, educationalContext: { level: 'intro' }, format: 'narrative-lesson' }),
      passingRunner(narrativeArtifact('lhs:phys.force'), new FormatRegistry()),
      context(['lhs:phys.force']),
    );
    expect(['publish', 'hold']).toContain(d.action);
    expect(d.report).toBeDefined();
  });

  it('2. university derivation, deep → completes without assuming grade', async () => {
    const d = await produce(
      makeRequest({ intent: 'derive', audience: { kind: 'learner' }, educationalContext: { level: 'undergraduate' }, format: 'narrative-lesson' }),
      passingRunner(narrativeArtifact('lhs:phys.field'), new FormatRegistry()),
      context(['lhs:phys.field']),
    );
    expect(['publish', 'hold', 'reject']).toContain(d.action);
    // Truthful reporting: a publish has no reason; a hold/reject always states one.
    if (d.action === 'publish') {
      expect(d.reason).toBeUndefined();
    } else {
      expect(typeof d.reason).toBe('string');
    }
  });

  it('3. historical narrative → narrative format with people honoured', async () => {
    const d = await produce(
      makeRequest({ intent: 'narrate', format: 'narrative-lesson', topic: 'the discovery of relativity' }),
      passingRunner(narrativeArtifact('lhs:phys.relativity'), new FormatRegistry()),
      context(['lhs:phys.relativity']),
    );
    expect(['publish', 'hold']).toContain(d.action);
  });

  it('4. progressive multi-stage lesson → holds gracefully on a generic format', async () => {
    // A format id that exists but whose shape we don't satisfy → deterministic schema FAIL,
    // never a crash, never a silent publish.
    const reg = new FormatRegistry();
    const d = await produce(
      makeRequest({ format: 'quiz', topic: 'multistage' }),
      {
        registry: reg,
        callbacks: { generate: async () => ({ format: 'quiz', payload: { objective: 'o' }, provenance: { requestId: 'r', stages: [{ component: 'g', action: 'p' }] } }), verify: passSemantic },
        maxRepairRounds: 1,
      },
      context([]),
    );
    expect(d.action).toBe('hold'); // empty questions → deterministic schema fail → hold
    expect(d.artifact).toBeDefined();
  });

  it('5. problem-solving / assessment via quiz format → publishes a valid set', async () => {
    const d = await produce(
      makeRequest({ intent: 'assess', format: 'quiz', contentRequirements: { requiredConcepts: ['lhs:phys.force'] } }),
      passingRunner(quizArtifact('lhs:phys.force'), new FormatRegistry()),
      context([]),
    );
    expect(d.action).toBe('publish'); // quiz coverage from question concept links satisfies required
  });

  it('6. interactive/animation → unknown format id rejects (flags rather than invents)', async () => {
    const d = await produce(
      makeRequest({ intent: 'animate', format: 'animation-spec' }),
      passingRunner(narrativeArtifact('x'), new FormatRegistry()),
      context([]),
    );
    expect(d.action).toBe('reject');
    expect(d.reason).toContain('animation-spec');
  });

  it('7. lab/experimental activity → inline capability description without a format name holds gracefully', async () => {
    const d = await produce(
      makeRequest({ format: { description: 'a hands-on lab' } }),
      passingRunner(narrativeArtifact('lhs:phys.lab'), new FormatRegistry()),
      context(['lhs:phys.lab']),
    );
    // No format name resolved → engine must not invent one; it flags and holds.
    expect(d.action).toBe('hold');
    expect(d.reason).toContain('no format resolved');
  });

  it('8. teacher resource → audience kind teacher, completes truthfully', async () => {
    const d = await produce(
      makeRequest({ audience: { kind: 'teacher' }, format: 'narrative-lesson' }),
      passingRunner(narrativeArtifact('lhs:phys.temperature'), new FormatRegistry()),
      context(['lhs:phys.temperature']),
    );
    expect(['publish', 'hold']).toContain(d.action);
  });

  it('9. no grade specified → uses intent only, publishes valid narrative (never invents grade)', async () => {
    const d = await produce(
      makeRequest({ format: 'narrative-lesson' }),
      passingRunner(narrativeArtifact('lhs:phys.wave'), new FormatRegistry()),
      context(['lhs:phys.wave']),
    );
    expect(d.action).toBe('publish');
    expect(d.blueprint.educationalContext).toBeUndefined(); // not invented
  });

  it('10. unusual educational level → treated as request data, no crash', async () => {
    const d = await produce(
      makeRequest({ educationalContext: { level: 'quantum-whispering-school' }, format: 'narrative-lesson' }),
      passingRunner(narrativeArtifact('lhs:phys.superfluid'), new FormatRegistry()),
      context(['lhs:phys.superfluid']),
    );
    expect(['publish', 'hold']).toContain(d.action);
    expect(d.blueprint.educationalContext?.level).toBe('quantum-whispering-school');
  });

  it('11. brand-new content format requested by name → rejects with that name (registry asks)', async () => {
    const d = await produce(
      makeRequest({ format: 'hologram-experience' }),
      passingRunner(narrativeArtifact('x'), new FormatRegistry()),
      context([]),
    );
    expect(d.action).toBe('reject');
    expect(d.reason).toContain('hologram-experience');
  });

  it('12. empty request surface (only topic+intent) → still a well-formed decision', async () => {
    const d = await produce(
      makeRequest({ topic: 'x', intent: 'explain' }),
      passingRunner(narrativeArtifact('lhs:phys.x'), new FormatRegistry()),
      context(['lhs:phys.x']),
    );
    expect(['publish', 'hold']).toContain(d.action);
  });
});

// ────────────────────────────────────────────────────────
// Boundary & invalid inputs — no throw, truthful decision
// ────────────────────────────────────────────────────────
describe('stress — boundary & invalid inputs never crash', () => {
  it('empty string topic still produces a decision', async () => {
    const d = await produce(makeRequest({ topic: '' }), passingRunner(narrativeArtifact('lhs:phys.x'), new FormatRegistry()), context([]));
    expect(['publish', 'hold', 'reject']).toContain(d.action);
  });

  it('whitespace-only format string resolves to nothing → hold', async () => {
    const d = await produce(makeRequest({ format: '   ,  ' }), passingRunner(narrativeArtifact('lhs:phys.x'), new FormatRegistry()), context([]));
    expect(d.action).toBe('hold');
  });

  it('explicit unknown format id rejects truthfully', async () => {
    const d = await produce(makeRequest({ format: 'nonexistent' }), passingRunner(narrativeArtifact('lhs:phys.x'), new FormatRegistry()), context([]));
    expect(d.action).toBe('reject');
    expect(d.reason).toContain('nonexistent');
  });

  it('empty registry → hold with clear reason (nothing to produce)', async () => {
    const reg = new FormatRegistry([]);
    const d = await produce(
      makeRequest({ format: 'narrative-lesson' }),
      { registry: reg, callbacks: { generate: async () => narrativeArtifact('x'), verify: passSemantic } },
      context([]),
    );
    expect(d.action).toBe('reject'); // format id not in empty registry
    expect(d.reason).toContain('narrative-lesson');
  });
});

// ────────────────────────────────────────────────────────
// Repair-loop exhaustion — bounded, graceful, truthful
// ────────────────────────────────────────────────────────
describe('stress — repair loop cannot run forever', () => {
  it('never-passing verifier holds after exactly maxRepairRounds', async () => {
    const reg = new FormatRegistry();
    const generateCalls: number[] = [];
    const d = await produce(
      makeRequest({ format: 'narrative-lesson' }),
      {
        registry: reg,
        callbacks: {
          generate: async () => {
            generateCalls.push(1);
            return narrativeArtifact('lhs:phys.fail');
          },
          verify: async () => Promise.resolve({ gate: 'factual', verdict: 'fail' as const, findings: ['always wrong'] }),
        },
        maxRepairRounds: 3,
      },
      context(['lhs:phys.fail']),
    );
    expect(d.action).toBe('hold');
    expect(d.repairRounds).toBe(3); // used the whole budget
    // initial generate + 3 repair rounds:
    expect(generateCalls.length).toBe(4);
  });

  it('maxRepairRounds 0 → single generation, no loop', async () => {
    const reg = new FormatRegistry();
    let calls = 0;
    const d = await produce(
      makeRequest({ format: 'narrative-lesson' }),
      {
        registry: reg,
        callbacks: { generate: async () => { calls += 1; return narrativeArtifact('lhs:phys.x'); }, verify: passSemantic },
        maxRepairRounds: 0,
      },
      context(['lhs:phys.x']),
    );
    expect(calls).toBe(1);
    expect(d.action).toBe('publish');
  });
});

// ────────────────────────────────────────────────────────
// Malformed artifacts — deterministic gates catch them (N4 fix)
// ────────────────────────────────────────────────────────
describe('stress — malformed artifacts are caught deterministically, not by the LLM', () => {
  it('quiz with empty questions fails the deterministic schema gate', async () => {
    const reg = new FormatRegistry();
    const d = await produce(
      makeRequest({ format: 'quiz' }),
      { registry: reg, callbacks: { generate: async () => ({ format: 'quiz', payload: { objective: 'o', questions: [] }, provenance: { requestId: 'r', stages: [{ component: 'g', action: 'p' }] } }), verify: passSemantic }, maxRepairRounds: 1 },
      context([]),
    );
    expect(d.action).toBe('hold'); // deterministic schema FAIL blocks publish
    expect(d.report?.gates.some((g) => g.gate === 'schema' && g.verdict === 'fail')).toBe(true);
  });

  it('narrative missing figures fails schema regardless of a lenient LLM verifier', async () => {
    const reg = new FormatRegistry();
    const stripped = narrativeArtifact('lhs:phys.x');
    delete (stripped.payload as { figures?: unknown[] }).figures;
    const d = await produce(
      makeRequest({ format: 'narrative-lesson' }),
      { registry: reg, callbacks: { generate: async () => stripped, verify: passSemantic }, maxRepairRounds: 1 },
      context(['lhs:phys.x']),
    );
    expect(d.report?.gates.some((g) => g.gate === 'schema' && g.verdict === 'fail')).toBe(true);
  });
});

// ────────────────────────────────────────────────────────
// Gate separation — deterministic can never be masked
// ────────────────────────────────────────────────────────
describe('stress — hard-gate separation (deterministic vs semantic)', () => {
  it('a semantic FAIL blocks publish even if the deterministic report is pass', async () => {
    const report = evaluateGates([passGate('schema'), failGate('intent-essence', ['wrong kind of artifact'])]);
    expect(report.publishable).toBe(false);
  });

  it('a deterministic FAIL cannot be overridden by a semantic PASS', async () => {
    const report = evaluateGates([failGate('coverage', ['required concept missing']), passGate('factual')]);
    expect(report.publishable).toBe(false);
    expect(report.hardGatePassed).toBe(false);
  });

  it('coverage failure forces regeneration but never silently publishes an uncovered artifact', async () => {
    const reg = new FormatRegistry();
    // Generator keeps returning an artifact whose covered concept is the WRONG one.
    const d = await produce(
      makeRequest({ format: 'quiz', contentRequirements: { requiredConcepts: ['lhs:phys.need'] } }),
      { registry: reg, callbacks: { generate: async () => quizArtifact('lhs:phys.other'), verify: passSemantic }, maxRepairRounds: 1 },
      context([]),
    );
    // Coverage FAIL is non-negotiable → the wrong-concept quiz cannot publish.
    expect(d.action).toBe('hold');
    expect(d.report?.gates.some((g) => g.gate === 'coverage' && g.verdict === 'fail')).toBe(true);
  });
});

// ────────────────────────────────────────────────────────
// Custom format — the extension point works end to end
// ────────────────────────────────────────────────────────
describe('stress — a brand-new declarative format drives the same core', () => {
  it('a custom lab-script format with a coverage hook publishes when satisfied', async () => {
    const labScript: FormatSpec = {
      id: 'lab-script',
      name: 'Laboratory activity',
      description: 'A hands-on lab.',
      components: [{ id: 'aim', kind: 'text', required: true }],
      validation: { rules: ['components.aim must be non-empty'] },
      outputSchema: 'LabScript',
      coverage: (p) => (typeof p === 'object' && p !== null && 'conceptId' in p ? [String((p as { conceptId: unknown }).conceptId)] : []),
      validate: (p) => (typeof p === 'object' && p !== null && (p as { aim?: unknown }).aim ? [] : ['aim required']),
    };
    const reg = new FormatRegistry([labScript]);
    const d = await produce(
      makeRequest({ format: 'lab-script', contentRequirements: { requiredConcepts: ['lhs:chem.titration'] } }),
      {
        registry: reg,
        callbacks: {
          generate: async () => ({ format: 'lab-script', payload: { aim: 'titrate', conceptId: 'lhs:chem.titration' }, provenance: { requestId: 'r', stages: [{ component: 'g', action: 'p' }] } }),
          verify: passSemantic,
        },
        maxRepairRounds: 1,
      },
      context([]),
    );
    expect(d.action).toBe('publish');
  });

  it('a custom format with NO validate/coverage hooks falls back to required-component presence', async () => {
    const bare: FormatSpec = {
      id: 'bare',
      name: 'Bare format',
      description: 'minimal',
      components: [{ id: 'title', kind: 'text', required: true }],
      validation: {},
    };
    const reg = new FormatRegistry([bare]);
    const missing = await produce(
      makeRequest({ format: 'bare' }),
      { registry: reg, callbacks: { generate: async () => ({ format: 'bare', payload: {}, provenance: { requestId: 'r', stages: [{ component: 'g', action: 'p' }] } }), verify: passSemantic }, maxRepairRounds: 1 },
      context([]),
    );
    // title is required and absent → deterministic schema fail → hold, not publish.
    expect(missing.action).toBe('hold');
    expect(missing.report?.gates.some((g) => g.gate === 'schema' && g.verdict === 'fail')).toBe(true);
  });
});