/**
 * Blueprint — the plan the Architect produces from a request + knowledge package
 * (architecture v2, §9 / §12 / §F).
 *
 * This is where requirements become *explicit and verifiable*: the intent restated,
 * the audience/level, chosen format specs, learning objectives, required/excluded
 * concepts, and the verifier set that will gate the result. The Blueprint drives both
 * generation and verification. It carries no hardcoded grade/subject/format assumptions —
 * it reflects the request plus the Architect's explicit decisions (which are themselves
 * traced).
 */
import type { ContentRequest, Extent, FormatRequest, Audience, EducationalContext } from './request';

/** What the learner should be able to do after the artifact. Traceable back to request intent. */
export interface LearningObjective {
  /** The objective, expressed in behaviour terms. */
  statement: string;
  /** Optional canonical concept reference it maps to. */
  conceptId?: string;
}

/** One explicit decision the Architect took (traceability). */
export interface BlueprintDecision {
  field: string;
  /** WYSIWYG short statement of what was chosen/inferred and why. */
  decision: string;
  /** Whether this was taken directly from the request or inferred (and must be reported). */
  source: 'from-request' | 'inferred' | 'flagged-missing';
}

export interface Blueprint {
  requestId: {
    project: string;
    requestUid: string;
    createdAt: string;
  };
  /** Restated intent, so intent/essence verification has an explicit target. */
  intent: string;
  /** The audience actually assumed, and the decisions leading there. */
  audience?: Audience;
  educationalContext?: EducationalContext;
  /** Chosen format spec id(s), resolved via the registry. */
  formats: string[];
  learningObjectives: LearningObjective[];
  /** Concepts that must be present (canonical ids) — verified deterministically. */
  requiredConcepts: string[];
  /** Concepts that must be absent — verified deterministically. */
  excludedConcepts: string[];
  /** Verifier gates that must PASS before publication. */
  requiredVerifications: ('schema' | 'coverage' | 'lhs-fidelity' | 'factual' | 'format' | 'pedagogical' | 'intent-essence')[];
  extent?: Extent;
  language?: string;
  /** Every decision, traced. */
  decisions: BlueprintDecision[];
}

/**
 * Build a Blueprint from a request. This is a deterministic wiring helper that:
 *  - flows the request's choices through directly when present;
 *  - otherwise leaves a field unset (never invents a grade/subject/format) or records
 *    the missing requirement as a `flagged-missing` decision for the human/Architect.
 *
 * It does NOT do the LLM reasoning the Architect role performs; it is a pure, testable
 * base that keeps the plan honest about what came from the request versus what needs
 * deciding.
 */
export function planFromRequest(
  request: ContentRequest,
  registerChoices: { formats: string[]; requiredConcepts: string[]; excludedConcepts: string[] },
): Blueprint {
  const decisions: BlueprintDecision[] = [
    { field: 'formats', decision: registerChoices.formats.join(', ') || 'none chosen', source: 'from-request' },
  ];

  if (request.audience) decisions.push({ field: 'audience', decision: JSON.stringify(request.audience), source: 'from-request' });
  else decisions.push({ field: 'audience', decision: 'not specified', source: 'flagged-missing' });

  if (request.educationalContext) {
    decisions.push({ field: 'educational-context', decision: JSON.stringify(request.educationalContext), source: 'from-request' });
  } else {
    decisions.push({ field: 'educational-context', decision: 'not specified (must not be invented)', source: 'flagged-missing' });
  }

  if (request.contentRequirements?.requiredConcepts?.length) {
    decisions.push({ field: 'required-concepts', decision: request.contentRequirements.requiredConcepts.join(', '), source: 'from-request' });
  }

  if (request.language) decisions.push({ field: 'language', decision: request.language, source: 'from-request' });

  const learningObjectives: LearningObjective[] = (request.learningObjectives ?? []).map((statement, i) => {
  const conceptId = request.contentRequirements?.requiredConcepts?.[i];
  return conceptId ? { statement, conceptId } : { statement };
});

  const verifierSet: Blueprint['requiredVerifications'] = [
    'schema',
    'coverage',
    'lhs-fidelity',
    'factual',
    'format',
    'pedagogical',
    'intent-essence',
  ];

  return {
    requestId: request.id,
    intent: request.summary,
    ...(request.audience ? { audience: request.audience } : {}),
    ...(request.educationalContext ? { educationalContext: request.educationalContext } : {}),
    formats: registerChoices.formats,
    learningObjectives,
    requiredConcepts: registerChoices.requiredConcepts,
    excludedConcepts: registerChoices.excludedConcepts,
    requiredVerifications: verifierSet,
    ...(request.extent ? { extent: request.extent } : {}),
    ...(request.language ? { language: request.language } : {}),
    decisions,
  };
}

/** Resolve a FormatRequest (string or inline description) to registry ids. Deterministic. */
export function resolveFormats(format: FormatRequest | undefined, available: string[]): string[] {
  if (!format) return available.length ? [available[0]!] : [];
  if (typeof format === 'string') return format.split(',').map((s) => s.trim()).filter(Boolean);
  return format.format ? [format.format] : [];
}