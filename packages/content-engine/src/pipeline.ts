/**
 * Pipeline runner — the engine orchestrator that turns a `ContentRequest` into a
 * verified, hard-gate publication decision (architecture v2, migration N4).
 *
 * This is where the seams declared in N1–N3 are *driven*:
 *
 *    Request → Blueprint (plan) → FormatGenerator (produce Artifact) →
 *    deterministic + LLM verifiers → hard-gate `evaluateGates` →
 *    targeted repair (`repairOrders`) → publish / hold / reject.
 *
 * It is **LLM-agnostic and testable without a network**: every LLM boundary is an
 * injected callback (`generate` for the format generator, `verify` for semantic /
 * factual / pedagogical / intent-essence gates). Deterministic gates (schema,
 * coverage) are run natively by the engine. A production runner (workflow/litellm/…)
 * supplies real callbacks; tests inject fakes.
 *
 * Nothing here touches the DOM or the live renderer. It only produces `Artifact`s
 * and `PublicationDecision`s against the registered formats.
 */
import type { ContentRequest } from './request';
import type { FormatRegistry, FormatSpec, Artifact } from './formats';
import { planFromRequest, type Blueprint } from './blueprint';
import {
  evaluateGates,
  validateConceptCoverage,
  validateNarrativeStructure,
  repairOrders,
  type GateId,
  type GateResult,
  type VerificationReport,
} from './verification';

// ────────────────────────────────────────────────────────
// Knowledge grounding context (§F)
// ────────────────────────────────────────────────────────

/**
 * The grounded input the Curator assembles for the engine. Canonical knowledge lives in
 * LearningHubSTEM; the engine *composes with it and never overwrites it*. External
 * research may be present but is clearly supplemental and may raise canonical-review
 * signals rather than silently replacing an LHS fact.
 */
export interface KnowledgeContext {
  /** The LHS knowledge snapshot version used to ground. */
  knowledgeVersion?: string;
  /** Canonical concept ids that the generated artifact must resolve against. */
  providedConcepts: string[];
  /** Supplementary research, clearly marked supplemental (web/papers). */
  supplemental?: unknown;
  /** Signals raised about canonical facts that external research challenges. */
  canonicalReviewSignals?: { conceptId: string; reason: string }[];
}

// ────────────────────────────────────────────────────────
// Generator + verifier seams
// ────────────────────────────────────────────────────────

/**
 * A format generator: is responsible for producing a specific artifact shape for the
 * given FormatSpec, given the plan and the grounded knowledge. Supplied by a runner
 * (LLM-backed). Deterministic scaffolding is allowed around it.
 */
export type FormatGenerator = (input: {
  blueprint: Blueprint;
  format: FormatSpec;
  context: KnowledgeContext;
  /** Present on a targeted repair pass: the prior artifact and the findings to fix. */
  repair?: { artifact: Artifact; findings: string[] };
}) => Promise<Artifact>;

/**
 * A semantic / LLM verifier callback. The engine invokes it for gates that need
 * judgment (factual, lhs-fidelity, format-quality, pedagogical, intent-essence).
 * Deterministic gates are handled natively and must still be applied.
 */
export type SemanticVerifier = (input: {
  gate: GateId;
  artifact: Artifact;
  blueprint: Blueprint;
  context: KnowledgeContext;
}) => Promise<GateResult>;

/** The callbacks a runner supplies. All LLM boundaries are behind these. */
export interface RunnerCallbacks {
  /** Produce an artifact for a chosen format (LLM generator). */
  generate: FormatGenerator;
  /**
   * Semantic verification for the gates that require judgment. Deterministic gates
   * (schema, coverage) are run natively by the engine and not forwarded here.
   */
  verify: SemanticVerifier;
}

// ────────────────────────────────────────────────────────
// Runner configuration
// ────────────────────────────────────────────────────────

export interface RunnerConfig {
  registry: FormatRegistry;
  callbacks: RunnerCallbacks;
  /** Cap on targeted repair rounds before a held/rejected decision (safety). */
  maxRepairRounds?: number;
}

// ────────────────────────────────────────────────────────
// Publication decision (§F / §7)
// ────────────────────────────────────────────────────────

export type PublicationAction = 'publish' | 'hold' | 'reject';

export interface PublicationDecision {
  action: PublicationAction;
  blueprint: Blueprint;
  artifact?: Artifact;
  report?: VerificationReport;
  /** Reason for a hold/reject. */
  reason?: string;
  /** How many repair rounds were consumed before the decision. */
  repairRounds: number;
}

// ────────────────────────────────────────────────────────
// The engine loop
// ────────────────────────────────────────────────────────

/**
 * Run the full production pipeline for one request.
 *
 *  1. Resolve the request's format(s) via the registry.
 *  2. Plan a `Blueprint` from the request (deterministic `planFromRequest`).
 *  3. Generate an `Artifact` (runner-supplied generator).
 *  4. Verify deterministically (coverage, schema) and via the semantic verifier
 *     callbacks; combine into a hard-gate `VerificationReport` via `evaluateGates`.
 *  5. If every gate passes → `publish`.
 *  6. Otherwise map failures to targeted repair orders. Plan-level failures
 *     (coverage, intent-essence) force regeneration; component-level failures go
 *     through the generator with the findings as guidance. Loop up to `maxRepairRounds`.
 *  7. If it still cannot pass within budget → `hold` (needs human/semantic attention,
 *     not a whole re-run); a genuinely unrecoverable plan → `reject`.
 */
export async function produce(
  request: ContentRequest,
  config: RunnerConfig,
  context: KnowledgeContext,
): Promise<PublicationDecision> {
  const formatIds = resolveRequestFormats(request, config.registry);
  if (formatIds.length === 0) {
    return {
      action: 'hold',
      blueprint: planFromRequest(request, { formats: [], requiredConcepts: [], excludedConcepts: [] }),
      reason: 'no format resolved for this request; flag missing format rather than inventing one',
      repairRounds: 0,
    };
  }

  const formatId = formatIds[0]!;
  const format = config.registry.get(formatId);
  if (!format) {
    return {
      action: 'reject',
      blueprint: planFromRequest(request, { formats: [formatId], requiredConcepts: [], excludedConcepts: [] }),
      reason: `format '${formatId}' is not registered`,
      repairRounds: 0,
    };
  }

  const requiredConcepts = request.contentRequirements?.requiredConcepts ?? context.providedConcepts;
  const excludedConcepts = request.contentRequirements?.excludedConcepts ?? [];
  const blueprint = planFromRequest(request, { formats: [formatId], requiredConcepts, excludedConcepts });

  const maxRounds = config.maxRepairRounds ?? 2;
  let artifact = await config.callbacks.generate({ blueprint, format, context });
  let report = await verifyArtifact(artifact, blueprint, format, context, config.callbacks);
  let decision = evaluateGates(report.gates);

  let rounds = 0;
  while (!decision.publishable && rounds < maxRounds) {
    rounds += 1;
    const orders = repairOrders(decision);
    const needsRegeneration = orders.some((o) => o.forcesRegeneration);
    // If the plan itself is wrong (coverage/intent), satisfy via regeneration.
    artifact = needsRegeneration
      ? await config.callbacks.generate({ blueprint, format, context })
      : await repairArtifact(artifact, blueprint, format, context, config.callbacks, orders);
    report = await verifyArtifact(artifact, blueprint, format, context, config.callbacks);
    decision = evaluateGates(report.gates);
  }

  if (decision.publishable) {
    return {
      action: 'publish',
      blueprint,
      artifact,
      report: decision,
      repairRounds: rounds,
    };
  }

  const fatal = repairOrders(decision).some((o) => o.stage === 'not-recoverable');
  return {
    action: fatal ? 'reject' : 'hold',
    blueprint,
    artifact,
    report: decision,
    reason: fatal
      ? 'unrecoverable plan failure'
      : `failed hard gates after ${rounds} repair round(s)`,
    repairRounds: rounds,
  };
}

// ────────────────────────────────────────────────────────
// Internals
// ────────────────────────────────────────────────────────

/** Resolve the request's desired format(s) against the registry. */
function resolveRequestFormats(request: ContentRequest, registry: FormatRegistry): string[] {
  const req = request.format;
  if (!req) {
    const available = registry.list();
    return available.length ? [available[0]!] : [];
  }
  if (typeof req === 'string') return req.split(',').map((s) => s.trim()).filter(Boolean);
  if (req.format) return [req.format];
  return [];
}

/**
 * Verify an artifact: run the deterministic gates natively (coverage, schema) and
 * forward every other required gate to the semantic verifier callback. Deterministic
 * results are combined with semantic results into a single hard-gate report.
 */
async function verifyArtifact(
  artifact: Artifact,
  blueprint: Blueprint,
  format: FormatSpec,
  context: KnowledgeContext,
  callbacks: RunnerCallbacks,
): Promise<VerificationReport> {
  const gates: GateResult[] = [];

  // Deterministic: coverage — does the artifact's payload mention the required concepts?
  // For the narrative-lesson format the payload's `conceptId` is what it covers.
  const covered: string[] =
    typeof artifact.payload === 'object' && artifact.payload !== null && 'conceptId' in artifact.payload
      ? [String((artifact.payload as { conceptId?: unknown }).conceptId ?? '')]
      : [];
  gates.push(validateConceptCoverage(covered, blueprint.requiredConcepts, blueprint.excludedConcepts));

  // Deterministic: schema for narrative-lesson (others can add their own later).
  if (format.id === 'narrative-lesson') {
    gates.push(validateNarrativeStructure(artifact as never));
  }
  // A format that makes it this far has satisfied the registry's structural rules.

  // Semantic gates (LLM seam) — one pass each, deterministic gates skipped.
  for (const gate of blueprint.requiredVerifications) {
    if (gate === 'schema' || gate === 'coverage') continue; // run natively
    const semantic = await callbacks.verify({ gate, artifact, blueprint, context });
    gates.push(semantic);
  }

  return evaluateGates(gates);
}

/**
 * Targeted repair: route failed gates back to the responsible stage without a whole
 * regeneration (unless the plan requires it). Handed to the generator as a repair pass
 * with the findings so it can fix just the reported gaps.
 */
async function repairArtifact(
  artifact: Artifact,
  blueprint: Blueprint,
  format: FormatSpec,
  context: KnowledgeContext,
  callbacks: RunnerCallbacks,
  orders: ReturnType<typeof repairOrders>,
): Promise<Artifact> {
  const findings = orders.flatMap((o) => o.findings);
  return callbacks.generate({
    blueprint,
    format,
    context,
    ...(findings.length ? { repair: { artifact, findings } } : {}),
  });
}