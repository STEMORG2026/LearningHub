/**
 * ContentRequest — a generic, optional-heavy description of *what is wanted*.
 *
 * This is the ARCHITECTURE-independent request model (architecture v2, §9 / §16–§18).
 * The principle: "Requests describe what is wanted. The architecture does not assume
 * what is wanted." Only `topic` and `intent` are ever required, and even those are
 * deliberately loose. Grade, subject, curriculum, language, format, length, etc. are
 * ALL optional request data — never hardcoded product assumptions.
 *
 * Consumer-owned by STEM-TUITION. Canonical knowledge still lives in LearningHubSTEM.
 */

/** Broadly what the requester wants to produce. Open-ended, not an enum gate. */
export type ContentIntent =
  | 'explain'
  | 'narrate'
  | 'derive'
  | 'quiz'
  | 'simulate'
  | 'experiment'
  | 'assess'
  | 'animate'
  | 'revise'
  | 'teach'
  | (string & {});

/** Who the content is for. `kind` is loose; all optional. */
export interface Audience {
  kind?: 'learner' | 'teacher' | 'researcher' | 'general' | (string & {});
  /** Free-form age range, e.g. "11–14". */
  ageRange?: string;
  /** Any clarifying description. */
  description?: string;
}

/** Optional educational context. Nothing here is mandatory or assumed. */
export interface EducationalContext {
  /** Free-form level, e.g. "undergraduate", "senior secondary", "intro". */
  level?: string;
  /** Positive integer grade. */
  grade?: number;
  /** Curriculum/education system, e.g. "neb_nepal", "alevel", "cbse". */
  curriculum?: string;
  /** Optional list of prerequisite concept/topic references. */
  prerequisites?: string[];
}

/**
 * Time/depth expression. `targetWords` is advisory, not a gate (no arbitrary counts
 * become architecture rules; it only helps a generator choose pacing).
 */
export interface Extent {
  targetWords?: number;
  depth?: 'intro' | 'standard' | 'deep' | (string & {});
}

/** Desired format(s). Either a known format name OR an inline capability description. */
export type FormatRequest =
  | string
  | {
      /** e.g. "narrative-lesson", "lab-script", or anything future. */
      format?: string;
      /** Free-form description for a brand-new format. */
      description?: string;
    };

/** Pedagogical steering. `approach` is free-form to allow future methods. */
export interface PedagogicalRequirements {
  approach?: string;
  examples?: boolean;
  analogies?: boolean;
  /** e.g. "progressive", "manipulative", "socratic", "discovery". */
  interactivity?: string;
}

/** Optional constraints the request sets. */
export interface RequestConstraints {
  /** Concepts/claims that must NOT appear. */
  excludedConcepts?: string[];
  /** Any hard limit on scope. */
  maxScope?: string;
}

/**
 * The generic request. Every field except `topic` and `intent` is optional.
 * The Curator/Architect stages flag important-but-missing requirements rather than
 * inventing them (§9).
 */
export interface ContentRequest {
  /** Traceability. */
  id: {
    project: string;
    requestUid: string;
    createdAt: string;
  };
  /** One-line summary of intent. */
  summary: string;
  /** The core subject matter, e.g. "Newton's second law", "cellular respiration". */
  topic: string;
  /** Any subject/domain, e.g. "physics", "chemistry", "cs", "math". */
  domain?: string;
  audience?: Audience;
  educationalContext?: EducationalContext;
  intent: ContentIntent;
  learningObjectives?: string[];
  contentRequirements?: {
    /** Concepts that must be present. */
    requiredConcepts?: string[];
    /** Concepts that must be absent. */
    excludedConcepts?: string[];
  };
  format?: FormatRequest;
  pedagogicalRequirements?: PedagogicalRequirements;
  language?: string;
  accessibility?: Record<string, string>;
  extent?: Extent;
  style?: {
    tone?: string;
    strictness?: string;
  };
  constraints?: RequestConstraints;
  outputPreferences?: Record<string, unknown>;
}