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
  | 'application'
  | 'figure'
  | 'timeline'
  | 'perspective'
  | 'deep-dive';

/**
 * A historically important person, honoured and respected: who they truly were,
 * what they established, and — wherever we can — their own words with a source.
 */
export interface LessonFigure {
  /** Full name, as history records it. */
  name: string;
  /** Life span, e.g. "1643–1727". */
  lifespan?: string;
  /** Their role: who they truly were (mathematician, natural philosopher, …). */
  role: string;
  /** What they actually established for this concept, stated respectfully. */
  contribution: string;
  /** Their recorded words/statement, with source. */
  statement?: string;
  /** Source of the statement, e.g. "Principia, 1687 (trans. Motte)". */
  statementSource?: string;
}

/** One entry on a historical timeline for the concept. */
export interface TimelineEntry {
  /** When, e.g. "1687" or "c. 350 BCE". */
  period: string;
  /** What happened. */
  event: string;
  /** Who was behind it, if tied to a specific person. */
  figure?: string;
  /** Optional short why-it-matters note. */
  note?: string;
}

/**
 * A viewpoint about or towards the concept — honoured on its own terms even when
 * it differs from the modern understanding. Gives each respected / differing view
 * its due weight rather than flattening history.
 */
export interface LessonPerspective {
  /** Whose view this is. */
  figure: string;
  /** The view itself, stated as they held it. */
  view: string;
  /** How it is regarded today: e.g. "later refined", "superseded but influential". */
  standing: string;
  /** Optional note on the relationship to the modern view. */
  note?: string;
}

/** A single rung of the progressively-scaling "Explained" deep-dive. */
export interface LessonDepthRung {
  /** Audience label: e.g. "Curious", "Enthusiast", "Professional", "Nerd". */
  level: string;
  /** Short tagline for who this rung serves. */
  audience: string;
  /** The explanation at this depth. Starts simple, scales up. */
  body: string;
}

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
  /** Structured people — used when kind === 'figure'. */
  figures?: LessonFigure[];
  /** Structured timeline — used when kind === 'timeline'. */
  timeline?: TimelineEntry[];
  /** Structured respected/differing views — used when kind === 'perspective'. */
  perspectives?: LessonPerspective[];
  /** Structured explaining rungs — used when kind === 'deep-dive'. */
  depthRungs?: LessonDepthRung[];
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
