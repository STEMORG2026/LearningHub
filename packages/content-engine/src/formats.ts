/**
 * FormatSpec — a declarative description of a *content format* (architecture v2, §11).
 *
 * This is the single extension point for new content types: a new format is declared
 * here (required structure, output schema, required/optional components, validation
 * rules, generation guidance) plus a FormatGenerator and FormatValidator. The core
 * engine is never rewritten to add a format — there is no `if story → … if textbook → …`
 * binary anywhere in the engine.
 *
 * The existing `narrative-lesson` format is registered below as the first concrete
 * spec: its output schema is the established `NarrativeContent` shape. This keeps the
 * 47 published narratives as valid artifacts of that format with no rendering change.
 */
import type { NarrativeContent } from '@stem-tuition/content-provider';

/** The kind of an output component/section, open-ended so new formats can extend. */
export type FormatComponentKind = string;

/** Declaration of one structural component a format requires or permits. */
export interface FormatComponentSpec {
  /** Stable id for the component within this format. */
  id: string;
  /** Required to be present, or optional. */
  required: boolean;
  /** What it is, for generators and validators. */
  kind: FormatComponentKind;
  /** Optional human-readable guidance for generators. */
  guidance?: string;
}

/**
 * Declarative validation rules for a format. Deterministic checks live here as
 * `rules`; semantic validations are referenced by name and run by LLM verifiers.
 */
export interface FormatValidationSpec {
  /** Deterministic, function-free declarative rules (e.g. "figures must be non-empty"). */
  rules?: string[];
  /** Names of semantic criteria an LLM verifier should apply. */
  semanticCriteria?: string[];
}

/** Declarative specification of one content format. */
export interface FormatSpec {
  /** Stable format id, e.g. "narrative-lesson". */
  id: string;
  /** A short, human-readable name. */
  name: string;
  /** What the format produces, e.g. "A story-shaped concept lesson." */
  description: string;
  /** Declared required/optional components. */
  components: FormatComponentSpec[];
  /** Deterministic + semantic validation rules for this format. */
  validation: FormatValidationSpec;
  /** The TypeScript type name this format emits (documentation/typing aid). */
  outputSchema?: string;
  /** Free-form generation guidance (never hardcoded counts or product assumptions). */
  generationGuidance?: string[];
}

/**
 * The narrative-lesson format spec — the first registered format. Its output schema is
 * the existing `NarrativeContent` interface; the 47 published batch narratives are
 * artifacts of this format.
 */
export const NARRATIVE_LESSON_FORMAT: FormatSpec = {
  id: 'narrative-lesson',
  name: 'Progressive narrative lesson',
  description:
    'A story-shaped concept lesson that honours real people and their histories, respects differing views, and scales an "Explained" deep-dive from curious to advanced.',
  components: [
    { id: 'hook', kind: 'text', required: true, guidance: 'Open the lesson and make it feel relevant.' },
    { id: 'history', kind: 'text', required: true, guidance: 'The backstory in prose — what was known before and how the idea arose.' },
    { id: 'figures', kind: 'people', required: true, guidance: 'Real people honoured with name, role, contribution, and their own words when available.' },
    { id: 'timeline', kind: 'timeline', required: true, guidance: 'Dated milestones with the who and the why-it-matters.' },
    { id: 'perspectives', kind: 'perspectives', required: true, guidance: 'Respected/differing views each given due weight.' },
    { id: 'deep-dive', kind: 'deep-dive', required: true, guidance: 'Starts simple and scales (e.g. curious → enthusiast → professional → advanced).' },
    { id: 'what-came-before', kind: 'text', required: true, guidance: 'Prerequisites in plain language.' },
    { id: 'connections', kind: 'list', required: true, guidance: 'Topics this concept connects forward to.' },
    { id: 'applications', kind: 'list', required: true, guidance: 'Real settings as small stories.' },
    { id: 'worked-examples', kind: 'list', required: false, guidance: 'Step-by-step with numbers where applicable.' },
    { id: 'analogies', kind: 'list', required: true, guidance: 'Concrete everyday parallels.' },
    { id: 'misconceptions', kind: 'list', required: true, guidance: 'Common wrong ideas, addressed as teaching stories.' },
    { id: 'try-this', kind: 'text', required: true, guidance: 'A safe real-world activity.' },
    { id: 'fun-facts', kind: 'list', required: false, guidance: 'Curiosities that invite wonder.' },
    { id: 'estimated-time', kind: 'scalar', required: false, guidance: 'Minutes to complete, advisory.' },
  ],
  validation: {
    rules: [
      'components.hook must be a non-empty string',
      'components.figures must contain at least one entry with a truthy name and contribution',
      'components.timeline must be non-empty',
      'components.perspectives must be non-empty',
      'components.deep-dive must contain at least two rungs and start at a beginner level',
      'components.misconceptions must be non-empty',
    ],
    semanticCriteria: [
      'historically-honest-attribution',
      'respected-differing-views',
      'scale-from-simple',
      'pedagogically-appropriate',
    ],
  },
  outputSchema: 'NarrativeContent',
  generationGuidance: [
    'Compose with the canonical LHS fact; never rewrite canonical knowledge.',
    'Honour real people by name with their true roles and recorded words (sourced).',
    'Give respected/differing views their due weight rather than flattening history.',
  ],
};

/**
 * The quiz format spec — a second, non-narrative format (migration N5) that proves the
 * extension point is genuinely generic: registering it changes no core engine code, and
 * the engine drives it through the same Blueprint → generator → verification → repair
 * pipeline because formats are declarative.
 */
export const QUIZ_FORMAT: FormatSpec = {
  id: 'quiz',
  name: 'Assessment question set',
  description:
    'A coherent set of assessment questions (with answers, distractors, explanations and an objective link) that exercises a concept set.',
  components: [
    { id: 'questions', kind: 'list', required: true, guidance: 'At least one question; each has a prompt, correct answer, distractors, and an explanation.' },
    { id: 'objective', kind: 'text', required: true, guidance: 'What the set assesses, traceable to a learning objective.' },
    { id: 'difficulty', kind: 'scalar', required: false, guidance: 'Advisory difficulty (e.g. easy/medium/hard), never a gate.' },
    { id: 'hint', kind: 'text', required: false, guidance: 'Optional per-question scaffolding hint.' },
  ],
  validation: {
    rules: [
      'components.questions must be non-empty',
      'each question must have a non-empty prompt and at least two options (one correct)',
      'each question must have a non-empty explanation',
      'components.objective must be a non-empty string',
    ],
    semanticCriteria: [
      'concept-aligned-questions',
      'distractor-quality',
      'progressive-difficulty',
    ],
  },
  outputSchema: 'QuizSet',
  generationGuidance: [
    'Compose questions against the canonical LHS facts for the required concepts.',
    'Provide plausible distractors that reflect common misconceptions (never misleading-by-accident).',
    'Give a short explanation of the correct answer for each question.',
  ],
};

/**
 * The format registry — resolves a `FormatSpec` by id. New formats register here,
 * additively. This is the single place the engine learns about a new content type.
 */
export class FormatRegistry {
  private readonly specs = new Map<string, FormatSpec>();

  constructor(initial: FormatSpec[] = [NARRATIVE_LESSON_FORMAT, QUIZ_FORMAT]) {
    for (const spec of initial) this.register(spec);
  }

  register(spec: FormatSpec): void {
    if (this.specs.has(spec.id)) {
      throw new Error(`FormatRegistry: format '${spec.id}' is already registered.`);
    }
    this.specs.set(spec.id, spec);
  }

  get(id: string): FormatSpec | undefined {
    return this.specs.get(id);
  }

  has(id: string): boolean {
    return this.specs.has(id);
  }

  list(): string[] {
    return [...this.specs.keys()];
  }
}

/** A generated artifact of a given format. Typed loose so new formats need no core change. */
export interface Artifact<TPayload = unknown> {
  /** The format id this artifact conforms to. */
  format: string;
  /** The payload in that format's output schema. */
  payload: TPayload;
  provenance: {
    requestId: string;
    knowledgeVersion?: string;
    stages: { component: string; action: string; ts?: string }[];
  };
}

/** Converts an existing NarrativeContent into a registered narrative-lesson Artifact. */
export function narrativeArtifact(
  narrative: NarrativeContent,
  requestId: string,
  knowledgeVersion?: string,
): Artifact<NarrativeContent> {
  return {
    format: 'narrative-lesson',
    payload: narrative,
    provenance: {
      requestId,
      ...(knowledgeVersion ? { knowledgeVersion } : {}),
      stages: [{ component: 'narrative-lesson:generator', action: 'produce' }],
    },
  };
}