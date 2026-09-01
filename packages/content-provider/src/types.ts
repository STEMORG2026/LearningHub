/**
 * Application consumption model for lesson content.
 *
 * This is the runtime model that STEM Tuition consumes. It is NOT the canonical
 * representation of STEM knowledge — that lives in LearningHubSTEM. This model
 * is shaped by what the product needs to render: sections, questions, simulations.
 *
 * Per CONSTITUTION.md §35: "The model is an application consumption model, not
 * necessarily the universal canonical representation of STEM knowledge."
 */

// ─────────────────────────────────────────────────────
// LessonSection — one block of lesson content
// ─────────────────────────────────────────────────────

export type SectionKind =
  | 'text'
  | 'equation'
  | 'example'
  | 'misconception'
  | 'callout'
  | 'story'
  | 'narrative'
  | 'analogy'
  | 'fun-fact'
  | 'try-this'
  | 'context'
  | 'application';

export interface LessonSection {
  /** Unique within the lesson. */
  id: string;
  kind: SectionKind;
  /** Plain text or markdown fragment. */
  body: string;
  /** Optional heading. */
  heading?: string;
  /** Optional symbol/equation rendered alongside (e.g. "F = m·a"). */
  symbol?: string;
}

// ─────────────────────────────────────────────────────
// Question — embedded assessment
// ─────────────────────────────────────────────────────

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  /** Concept this question assesses. */
  conceptId: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// ─────────────────────────────────────────────────────
// SimulationConfig — embeddable interactive sim
// ─────────────────────────────────────────────────────

export interface SimulationConfig {
  /** Simulation type identifier (e.g. "newtonian-gravity", "ohms-law"). */
  type: string;
  /** Human-readable title. */
  title: string;
  /** Parameter seed for the simulation engine. */
  params: Record<string, number | string | boolean>;
}

// ─────────────────────────────────────────────────────
// ChallengeConfig — end-of-lesson challenge
// ─────────────────────────────────────────────────────

export interface ChallengeConfig {
  prompt: string;
  expectedAnswer: string;
  hint: string;
  conceptId: string;
}

// ─────────────────────────────────────────────────────
// LessonMetadata — educational metadata
// ─────────────────────────────────────────────────────

export interface LessonMetadata {
  /** Canonical concept ID (e.g. "newtons-second-law", "lhs:phys.newtons-second-law"). */
  conceptId: string;
  /** Display name. */
  displayName: string;
  /** Subject area. */
  subject: string;
  /** Grade levels this lesson targets (e.g. [9, 10, 11, 12]). */
  gradeLevels: number[];
  /** Concept IDs that should be learned before this lesson. */
  prerequisites: string[];
  /** Estimated time to complete, in minutes. */
  estimatedTimeMinutes: number;
  /** Common misconceptions this lesson addresses. */
  commonMisconceptions: string[];
  /** What a learner should be able to do after the lesson. */
  learningObjectives?: string[];
  /** Real-world contexts where this concept shows up (rendered as application sections). */
  realWorldApplications?: string[];
  /** Concept IDs that this lesson connects forward to (beyond prerequisites). */
  connections?: string[];
  /** Search/filter tags. */
  tags: string[];
}

// ─────────────────────────────────────────────────────
// LessonContent — the top-level application model
// ─────────────────────────────────────────────────────

export interface LessonContent {
  /** Stable lesson ID. */
  id: string;
  /** Content version (semver). */
  version: string;
  metadata: LessonMetadata;
  sections: LessonSection[];
  questions: Question[];
  simulations: SimulationConfig[];
  challenge?: ChallengeConfig;
}

// ─────────────────────────────────────────────────────
// ContentFilter — query parameters for listing/filtering
// ─────────────────────────────────────────────────────

export interface ContentFilter {
  /** Filter by subject (e.g. "physics"). */
  subject?: string;
  /** Filter by grade level (returns lessons targeting this grade). */
  grade?: number;
  /** Filter by concept ID. */
  conceptId?: string;
  /** Filter by prerequisite concept (returns lessons that require it). */
  requiresConcept?: string;
  /** Filter by tag. */
  tag?: string;
}
