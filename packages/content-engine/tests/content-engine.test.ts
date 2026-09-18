import { describe, expect, it } from 'vitest';
import {
  planFromRequest,
  resolveFormats,
  FormatRegistry,
  NARRATIVE_LESSON_FORMAT,
  QUIZ_FORMAT,
  narrativeArtifact,
  evaluateGates,
  failGate,
  passGate,
  validateConceptCoverage,
  validateNarrativeStructure,
  routeRepair,
  repairOrders,
  produce,
  INTENT_ESSENCE_VERIFIER,
  type ContentRequest,
  type GateResult,
} from '../src/index';

function makeRequest(over: Partial<ContentRequest> = {}): ContentRequest {
  return {
    id: { project: 'learninghub', requestUid: 'r1', createdAt: '2025-01-01' },
    summary: 'Explain a concept',
    topic: 'some-topic',
    intent: 'explain',
    ...over,
  };
}

describe('content-engine seam (architecture v2, N1–N3)', () => {
  describe('ContentRequest — optional-heavy, no hardcoded assumptions', () => {
    it('accepts a request with only topic + intent (no grade/subject/format)', () => {
      const req = makeRequest();
      expect(req.topic).toBe('some-topic');
      expect(req.intent).toBe('explain');
      expect(req.educationalContext?.grade).toBeUndefined();
      expect(req.audience).toBeUndefined();
    });

    it('adapts to any grade (9, 12, university) as request data, not architecture', () => {
      const g9 = makeRequest({ educationalContext: { grade: 9 } });
      const g12 = makeRequest({ educationalContext: { grade: 12 } });
      const univ = makeRequest({ educationalContext: { level: 'undergraduate' } });
      expect(g9.educationalContext?.grade).toBe(9);
      expect(g12.educationalContext?.grade).toBe(12);
      expect(univ.educationalContext?.level).toBe('undergraduate');
    });

    it('supports a brand-new format described inline, not hardcoded', () => {
      const req = makeRequest({ format: { format: 'hologram-experience', description: 'a future format' } });
      expect(req.format).toBeDefined();
      expect(typeof req.format).not.toBe('string');
      if (req.format && typeof req.format !== 'string') {
        expect(req.format.format).toBe('hologram-experience');
      }
    });
  });

  describe('FormatSpec / registry — single extension point for new formats (N1)', () => {
    it('registers narrative-lesson by default', () => {
      const reg = new FormatRegistry();
      expect(reg.has('narrative-lesson')).toBe(true);
      expect(reg.get('narrative-lesson')?.outputSchema).toBe('NarrativeContent');
    });

    it('rejects duplicate registration', () => {
      const reg = new FormatRegistry();
      expect(() => reg.register(NARRATIVE_LESSON_FORMAT)).toThrow(/already registered/);
    });

    it('adapts to a new format additively without touching core', () => {
      const reg = new FormatRegistry();
      reg.register({
        id: 'lab-script',
        name: 'Laboratory activity',
        description: 'A hands-on lab script.',
        components: [{ id: 'aim', kind: 'text', required: true }],
        validation: { rules: ['components.aim must be non-empty'] },
        outputSchema: 'LabScript',
      });
      expect(reg.list()).toContain('lab-script');
    });

    it('wraps an existing NarrativeContent as a narrative-lesson artifact', () => {
      const art = narrativeArtifact(
        { conceptId: 'lhs:phys.wave' },
        makeRequest().id.requestUid,
        'knowledge-1.0',
      );
      expect(art.format).toBe('narrative-lesson');
      expect(art.payload.conceptId).toBe('lhs:phys.wave');
      expect(art.provenance.requestId).toBe('r1');
    });
  });

  describe('Blueprint — plan wiring (N2)', () => {
    it('flags missing educational context rather than inventing one', () => {
      const bp = planFromRequest(makeRequest(), {
        formats: ['narrative-lesson'],
        requiredConcepts: [],
        excludedConcepts: [],
      });
      const missing = bp.decisions.find((d) => d.field === 'educational-context');
      expect(missing?.source).toBe('flagged-missing');
      expect(bp.educationalContext).toBeUndefined();
    });

    it('carries request decisions through as from-request', () => {
      const req = makeRequest({
        educationalContext: { grade: 11, curriculum: 'neb_nepal' },
        language: 'ne',
        contentRequirements: { requiredConcepts: ['lhs:phys.wave'] },
      });
      const bp = planFromRequest(req, {
        formats: ['narrative-lesson'],
        requiredConcepts: ['lhs:phys.wave'],
        excludedConcepts: [],
      });
      expect(bp.educationalContext?.curriculum).toBe('neb_nepal');
      expect(bp.language).toBe('ne');
      expect(bp.requiredConcepts).toEqual(['lhs:phys.wave']);
      expect(bp.requiredVerifications).toContain(INTENT_ESSENCE_VERIFIER);
    });
  });

  describe('Hard-gate verification — no average score (N3)', () => {
    it('publishable only when every gate passes', () => {
      const allPass = evaluateGates([passGate('schema'), passGate('factual')]);
      expect(allPass.publishable).toBe(true);
    });

    it('a single failure blocks publication regardless of other passes', () => {
      const mixed = evaluateGates([passGate('schema'), failGate('factual', ['wrong equation']), passGate('pedagogical')]);
      expect(mixed.publishable).toBe(false);
      // No averaging can mask a FAIL.
      expect(mixed.hardGatePassed).toBe(false);
    });
  });

  describe('Deterministic validators (N3)', () => {
    it('coverage gate catches missing required and present excluded concepts', () => {
      const present = ['a', 'b'];
      const ok = validateConceptCoverage(present, ['a'], []);
      expect(ok.verdict).toBe('pass');

      const missingReq = validateConceptCoverage(present, ['a', 'z'], []);
      expect(missingReq.verdict).toBe('fail');
      expect(missingReq.findings.join()).toContain('z');

      const hasExcluded = validateConceptCoverage(present, [], ['b']);
      expect(hasExcluded.verdict).toBe('fail');
    });

    it('narrative structure gate requires figures/timeline/perspectives/deep-dive', () => {
      const good = {
        payload: {
          conceptId: 'lhs:phys.wave',
          figures: [{ name: 'x' }],
          timeline: [{ period: '1900' }],
          perspectives: [{ figure: 'y' }],
          deepDive: { rungs: [{ level: 'Curious' }, { level: 'Nerd' }] },
        },
      };
      expect(validateNarrativeStructure(good as never).verdict).toBe('pass');

      const bad = { payload: { conceptId: 'lhs:phys.wave' } };
      const result = validateNarrativeStructure(bad as never);
      expect(result.verdict).toBe('fail');
      expect(result.findings.length).toBeGreaterThan(0);
    });
  });

  describe('Repair routing — targeted, not whole-artifact (N3 / §13)', () => {
    it('routes each failed gate to the responsible stage', () => {
      expect(routeRepair('factual')).toBe('curation');
      expect(routeRepair('coverage')).toBe('blueprint');
      expect(routeRepair('format')).toBe('format-repair');
      expect(routeRepair('pedagogical')).toBe('blueprint');
      expect(routeRepair(INTENT_ESSENCE_VERIFIER)).toBe('blueprint');
    });

    it('only forces full regeneration when the plan itself is wrong', () => {
      const orders = repairOrders(
        evaluateGates([failGate('schema', ['missing field']), failGate('intent-essence', ['wrong kind of artifact'])]),
      );
      const schema = orders.find((o) => o.gate === 'schema');
      const intent = orders.find((o) => o.gate === 'intent-essence');
      expect(schema?.forcesRegeneration).toBe(false); // targeted format repair
      expect(intent?.forcesRegeneration).toBe(true); // plan wrong → regenerate
    });
  });

  describe('resolveFormats — no default format assumption', () => {
    it('returns an empty list when no format is requested and none available', () => {
      expect(resolveFormats(undefined, [])).toEqual([]);
    });
    it('resolves an explicit format name', () => {
      expect(resolveFormats('narrative-lesson', [])).toEqual(['narrative-lesson']);
    });
  });

  describe('Quiz format — second, non-narrative FormatSpec (N5)', () => {
    it('registers by default alongside narrative-lesson', () => {
      const reg = new FormatRegistry();
      expect(reg.has('narrative-lesson')).toBe(true);
      expect(reg.has('quiz')).toBe(true);
      expect(reg.get('quiz')?.outputSchema).toBe('QuizSet');
    });

    it('is fully declarative — no core change needed to support it', () => {
      const reg = new FormatRegistry([QUIZ_FORMAT]);
      expect(reg.list()).toContain('quiz');
      expect(reg.get('quiz')?.validation.rules.some((r) => r.includes('questions must be non-empty'))).toBe(true);
    });
  });

  describe('Pipeline runner — Blueprint → generate → verify → repair → publish (N4)', () => {
    const context = { knowledgeVersion: 'knowledge-1.0', providedConcepts: ['lhs:phys.wave'] };

    function goodNarrative(conceptId: string) {
      return {
        conceptId,
        hook: 'h',
        history: 'st',
        figures: [{ name: 'n', role: 'r', contribution: 'c' }],
        timeline: [{ period: '1900', event: 'e' }],
        perspectives: [{ figure: 'f', view: 'v', standing: 's' }],
        deepDive: { phenomenon: 'p', intro: 'i', rungs: [{ level: 'Curious', audience: 'a', body: 'b' }, { level: 'Nerd', audience: 'a', body: 'b' }] },
        misconceptions: ['m'],
      };
    }

    function passSemantic(): Promise<GateResult> {
      return Promise.resolve({ gate: 'schema', verdict: 'pass', findings: [] });
    }

    it('publishes when every hard gate passes', async () => {
      const reg = new FormatRegistry();
      const decision = await produce(
        makeRequest({ format: 'narrative-lesson', contentRequirements: { requiredConcepts: ['lhs:phys.wave'] } }),
        {
          registry: reg,
          callbacks: {
            generate: async () => ({ format: 'narrative-lesson', payload: goodNarrative('lhs:phys.wave'), provenance: { requestId: 'r1', stages: [{ component: 'generator', action: 'produce' }] } }),
            verify: passSemantic,
          },
          maxRepairRounds: 2,
        },
        context,
      );
      expect(decision.action).toBe('publish');
      expect(decision.artifact?.payload.conceptId).toBe('lhs:phys.wave');
    });

    it('does targeted repair when a semantic gate fails, then publishes', async () => {
      const reg = new FormatRegistry();
      let calls = 0;
      const decision = await produce(
        makeRequest({ format: 'narrative-lesson' }),
        {
          registry: reg,
          callbacks: {
            generate: async () => {
              calls += 1;
              return { format: 'narrative-lesson', payload: goodNarrative('lhs:phys.wave'), provenance: { requestId: 'r1', stages: [{ component: 'generator', action: 'produce' }] } };
            },
            // First pass fails factual; repair pass passes → engine should rerun verify.
            verify: async (input) => {
              if (calls === 1) return Promise.resolve({ gate: 'factual', verdict: 'fail', findings: ['equation wrong'] });
              return Promise.resolve({ gate: 'factual', verdict: 'pass', findings: [] });
            },
          },
          maxRepairRounds: 2,
        },
        context,
      );
      // The generator is called at least twice (initial + repair), and the decision is a publish.
      expect(calls).toBeGreaterThanOrEqual(2);
      expect(decision.action).toBe('publish');
    });

    it('holds when it cannot pass within the repair budget', async () => {
      const reg = new FormatRegistry();
      const decision = await produce(
        makeRequest({ format: 'narrative-lesson' }),
        {
          registry: reg,
          callbacks: {
            generate: async () => ({ format: 'narrative-lesson', payload: goodNarrative('lhs:phys.wave'), provenance: { requestId: 'r1', stages: [{ component: 'generator', action: 'produce' }] } }),
            verify: async () => Promise.resolve({ gate: 'factual', verdict: 'fail', findings: ['still wrong'] }),
          },
          maxRepairRounds: 1,
        },
        context,
      );
      expect(decision.action).toBe('hold');
      expect(decision.repairRounds).toBe(1);
    });

    it('rejects when the requested format is not registered', async () => {
      const reg = new FormatRegistry();
      const decision = await produce(
        makeRequest({ format: 'does-not-exist' }),
        {
          registry: reg,
          callbacks: { generate: async () => ({ format: 'x', payload: {}, provenance: { requestId: 'r1', stages: [] } }), verify: passSemantic },
          maxRepairRounds: 2,
        },
        context,
      );
      expect(decision.action).toBe('reject');
      expect(decision.reason).toContain('does-not-exist');
    });
  });
});