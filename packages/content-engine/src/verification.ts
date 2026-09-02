/**
 * Verification architecture (architecture v2, §7 / §8 / §13 / §G).
 *
 * Publication is decided by HARD GATES, never a single average score. Every applicable
 * verifier gate must be PASS before the artifact is publishable. Scores are permitted
 * only as diagnostic/ranking, and never override a FAIL.
 *
 * Two classes of verifier:
 *  - Deterministic validators (LLM-free): schema, required-coverage, excluded-absent,
 *    LHS resolution, format validity.
 *  - LLM verifiers: factual, LHS-fidelity (semantic), completeness, pedagogical,
 *    format quality, and intent/essence — which asks "did the artifact accomplish what
 *    the requester intended as an experience?" and is independent of factual checks.
 *
 * The seam is LLM-agnostic: LLM verifiers are declared as a callback interface so a
 * runner (workflow/litellm/other) can supply them; the repair router is deterministic
 * and maps a failed gate to the stage that caused it (§H).
 */

// ────────────────────────────────────────────────────────
// Hard-gate verification report
// ────────────────────────────────────────────────────────

export type GateId =
  | 'schema'
  | 'coverage'
  | 'lhs-fidelity'
  | 'factual'
  | 'format'
  | 'pedagogical'
  | 'intent-essence';

export type GateVerdict = 'pass' | 'fail';

export interface GateResult {
  gate: GateId;
  verdict: GateVerdict;
  /** Targeted findings; if empty the gate passed. */
  findings: string[];
  /** Optional diagnostic score (0–1) for ranking only — never overrides verdict. */
  score?: number;
}

export interface VerificationReport {
  gates: GateResult[];
  /** True only when EVERY gate is PASS (hard-gate rule). */
  publishable: boolean;
  /** The overall pass test — deterministic; no arithmetic averaging of scores. */
  readonly hardGatePassed: boolean;
}

/** Compute the hard-gate publication decision. Any FAIL → not publishable, with a reason. */
export function evaluateGates(gates: GateResult[]): VerificationReport {
  const publishable = gates.every((g) => g.verdict === 'pass');
  const failed = gates.filter((g) => g.verdict === 'fail');
  return {
    gates,
    publishable,
    hardGatePassed: publishable,
    ...(failed.length ? { failedGates: failed.map((f) => f.gate) } : {}),
  } as VerificationReport & { failedGates?: GateId[] };
}

// ────────────────────────────────────────────────────────
// Deterministic validators
// ────────────────────────────────────────────────────────

/** Deterministic gate result for a resolved check. */
export function passGate(gate: GateId): GateResult {
  return { gate, verdict: 'pass', findings: [] };
}

export function failGate(gate: GateId, findings: string[]): GateResult {
  return { gate, verdict: 'fail', findings };
}

/** Validate that `requiredConcepts` are present and `excludedConcepts` absent. */
export function validateConceptCoverage(
  conceptIds: Iterable<string>,
  required: string[],
  excluded: string[],
): GateResult {
  const present = new Set(conceptIds);
  const missingRequired = required.filter((c) => !present.has(c));
  const presentExcluded = excluded.filter((c) => present.has(c));
  if (missingRequired.length === 0 && presentExcluded.length === 0) return passGate('coverage');
  return failGate('coverage', [
    ...missingRequired.map((c) => `required concept missing: ${c}`),
    ...presentExcluded.map((c) => `excluded concept present: ${c}`),
  ]);
}

/** Validate a narrative-lesson artifact's required structure deterministically. */
export function validateNarrativeStructure(artifact: {
  payload: {
    conceptId?: string;
    figures?: unknown[];
    timeline?: unknown[];
    perspectives?: unknown[];
    deepDive?: { rungs?: unknown[] };
  };
}): GateResult {
  const p = artifact.payload;
  const problems: string[] = [];
  if (!p.conceptId) problems.push('missing conceptId');
  if (!(p.figures?.length)) problems.push('figures must be non-empty');
  if (!(p.timeline?.length)) problems.push('timeline must be non-empty');
  if (!(p.perspectives?.length)) problems.push('perspectives must be non-empty');
  if (!p.deepDive?.rungs?.length || (p.deepDive.rungs.length ?? 0) < 2) problems.push('deep-dive needs at least two rungs');
  return problems.length ? failGate('schema', problems) : passGate('schema');
}

// ────────────────────────────────────────────────────────
// LLM verifier seam
// ────────────────────────────────────────────────────────

/**
 * An LLM verifier callback. A runner supplies these (workflow/litellm/…); the engine
 * calls them with the artifact and requirements and respects their PASS/FAIL.
 */
export type LlmVerifier = (input: {
  gate: GateId;
  artifact: unknown;
  blueprint: unknown;
}) => Promise<GateResult>;

/**
 * The intent/essence verifier signature — the critical "did it accomplish what was
 * intended as an experience?" check, conceptually independent of factual correctness
 * (§6). Implemented by an LLM runner comparing Request → Blueprint → Artifact.
 */
export const INTENT_ESSENCE_VERIFIER: GateId = 'intent-essence';

export interface IntentEssenceInput {
  originalRequest: unknown;
  blueprint: unknown;
  artifact: unknown;
}

export type IntentEssenceRunner = (input: IntentEssenceInput) => Promise<GateResult>;

// ────────────────────────────────────────────────────────
// Repair routing (§H)
// ────────────────────────────────────────────────────────

export type RepairStage =
  | 'curation'
  | 'blueprint'
  | 'format-generator'
  | 'format-repair'
  | 'interaction-experience'
  | 'not-recoverable';

const GATE_TO_STAGE: Record<GateId, RepairStage> = {
  'lhs-fidelity': 'curation',
  factual: 'curation',
  coverage: 'blueprint',
  schema: 'format-repair',
  format: 'format-repair',
  pedagogical: 'blueprint',
  'intent-essence': 'blueprint',
};

/** Map a failed gate to the stage responsible (§13). Deterministic. */
export function routeRepair(gate: GateId): RepairStage {
  return GATE_TO_STAGE[gate] ?? 'not-recoverable';
}

/** One targeted repair instruction. Never a whole-artifact regeneration (§13). */
export interface RepairOrder {
  stage: RepairStage;
  gate: GateId;
  findings: string[];
  /** Whether a full regeneration is required (only when the plan itself is wrong). */
  forcesRegeneration?: boolean;
}

/** Build targeted repair orders from a report, one per failed gate. */
export function repairOrders(report: VerificationReport): RepairOrder[] {
  return report.gates
    .filter((g) => g.verdict === 'fail')
    .map((g) => ({
      stage: routeRepair(g.gate),
      gate: g.gate,
      findings: g.findings,
      forcesRegeneration: g.gate === 'coverage' || g.gate === 'intent-essence',
    }));
}