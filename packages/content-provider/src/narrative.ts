/**
 * Narrative-driven lesson composition.
 *
 * Per CONSTITUTION.md §35, the pedagogical narrative — the story, the history,
 * the "what came before", the worked examples, the analogies — is consumer-owned
 * by STEM-TUITION. Canonical *facts* (definitions, equations, misconceptions,
 * relationships) live in LearningHubSTEM and are consumed as `LhsEntity` data.
 *
 * This module composes a learners' lesson: it weaves the canonical fact with an
 * authored narrative into a progressive `LessonContent` that tells a story, rather
 * than presenting a flat list of facts.
 *
 * The composer is a pure function: no DOM, no global state.
 */
import type { LhsEntity } from './lhs-adapter';
import type { LessonContent, LessonMetadata, LessonSection } from './types';

// ─────────────────────────────────────────────────────
// NarrativeContent — authored, consumer-owned narrative
// ─────────────────────────────────────────────────────

/**
 * Authored narrative for a single concept. This is the "how we teach it" layer.
 * It supplements (never replaces) the canonical fact from LearningHubSTEM.
 *
 * All fields are optional: the composer falls back to the canonical fact when a
 * narrative part is missing, so every concept still renders a complete lesson.
 */
export interface NarrativeContent {
  /** Canonical concept ID this narrative augments (e.g. "lhs:phys.force"). */
  conceptId: string;
  /** One-line hook to open the lesson and make the concept feel relevant. */
  hook?: string;
  /** The backstory — what was known before, why the idea arose, who discovered it. */
  history?: string;
  /** How the idea connects to topics the learner has already seen. */
  whatCameBefore?: string;
  /** Connections forward to concepts this unlocks. */
  connections?: string[];
  /** Real-world settings where the concept shows up, written as tiny stories. */
  applications?: string[];
  /** One or more worked examples with real numbers. */
  workedExamples?: string[];
  /** Analogies that make the abstract idea concrete. */
  analogies?: string[];
  /** Misconceptions framed as a teaching story (additive to canonical ones). */
  misconceptions?: string[];
  /** A suggestion the learner can try in the real world. */
  tryThis?: string;
  /** Fun facts to break the pace. */
  funFacts?: string[];
  /** Estimated time in minutes for the narrated lesson. */
  estimatedTimeMinutes?: number;
}

// ─────────────────────────────────────────────────────
// Progressive section ordering
// ─────────────────────────────────────────────────────

/**
 * Build a progressive story: hook → history → what came before → the fact →
 * the formula → an analogy → worked examples → applications → misconceptions →
 * try this → fun fact.
 */
function narrativeSections(entity: LhsEntity, narrative: NarrativeContent): LessonSection[] {
  const sections: LessonSection[] = [];
  let idx = 0;

  // 1. Hook — a story opening that makes the concept feel alive
  if (narrative.hook) {
    sections.push({
      id: `${entity.id}-hook-${idx++}`,
      kind: 'story',
      heading: 'The Setup',
      body: narrative.hook,
    });
  }

  // 2. The backstory / history — who figured this out and why it matters
  if (narrative.history) {
    sections.push({
      id: `${entity.id}-history-${idx++}`,
      kind: 'context',
      heading: 'Where It Comes From',
      body: narrative.history,
    });
  }

  // 3. What came before — prerequisites told as continuity, not a dry list
  if (narrative.whatCameBefore) {
    sections.push({
      id: `${entity.id}-before-${idx++}`,
      kind: 'context',
      heading: 'What Came Before',
      body: narrative.whatCameBefore,
    });
  }

  // 4. The fact — the canonical definition
  sections.push({
    id: `${entity.id}-narrative-${idx++}`,
    kind: 'narrative',
    heading: 'What It Means',
    body: entity.definition,
  });

  // 5. The formula — the equation in its canonical form
  if (entity.equation) {
    const section: LessonSection = {
      id: `${entity.id}-equation-${idx}`,
      kind: 'equation',
      body: entity.equation,
      heading: 'The Formula',
    };
    if (entity.symbol) section.symbol = entity.symbol;
    sections.push(section);
    idx++;
  }

  // 6. An analogy — make the abstract concrete
  if (narrative.analogies && narrative.analogies.length > 0) {
    for (const analogy of narrative.analogies) {
      sections.push({
        id: `${entity.id}-analogy-${idx++}`,
        kind: 'analogy',
        heading: 'Think of It This Way',
        body: analogy,
      });
    }
  }

  // 7. Worked examples — real numbers, real steps
  if (narrative.workedExamples && narrative.workedExamples.length > 0) {
    for (const example of narrative.workedExamples) {
      sections.push({
        id: `${entity.id}-example-${idx++}`,
        kind: 'example',
        heading: 'Worked Example',
        body: example,
      });
    }
  }

  // 8. Applications — tiny stories of where the concept shows up.
  // Narrative applications win; otherwise fall back to the canonical ones.
  const applications = narrative.applications ?? entity.real_world_applications ?? [];
  if (applications.length > 0) {
    for (const app of applications) {
      sections.push({
        id: `${entity.id}-application-${idx++}`,
        kind: 'application',
        heading: 'Where You Meet It',
        body: app,
      });
    }
  }

  // 9. Connections — what this unlocks next
  if (narrative.connections && narrative.connections.length > 0) {
    sections.push({
      id: `${entity.id}-connections-${idx++}`,
      kind: 'context',
      heading: 'What This Unlocks',
      body: narrative.connections.join(' · '),
    });
  }

  // 10. Misconceptions — the traps, told so the reader recognises them
  const misconceptions = narrative.misconceptions ?? entity.common_misconceptions ?? [];
  for (const miscon of misconceptions) {
    sections.push({
      id: `${entity.id}-miscon-${idx++}`,
      kind: 'misconception',
      heading: 'Common Trap',
      body: miscon,
    });
  }

  // 11. Try this — a suggestion the learner can act on
  if (narrative.tryThis) {
    sections.push({
      id: `${entity.id}-try-this-${idx++}`,
      kind: 'try-this',
      heading: 'Try This',
      body: narrative.tryThis,
    });
  }

  // 12. Fun facts — a breather at the end
  if (narrative.funFacts && narrative.funFacts.length > 0) {
    for (const fact of narrative.funFacts) {
      sections.push({
        id: `${entity.id}-fun-fact-${idx++}`,
        kind: 'fun-fact',
        heading: 'Mind-Blowing Fact',
        body: fact,
      });
    }
  }

  return sections;
}

/**
 * Compose a narrative-driven LessonContent for a single concept.
 *
 * Canonical facts come from the `LhsEntity`; narrative parts come from the
 * authored `NarrativeContent`. Prerequisites are derived from the entity's
 * `logically_requires` / `mathematically_requires` relationships.
 */
export function composeNarrativeLesson(
  entity: LhsEntity,
  narrative: NarrativeContent,
): LessonContent {
  const prerequisites: string[] = [];
  if (entity.relationships) {
    for (const rel of entity.relationships) {
      if (rel.type === 'logically_requires' || rel.type === 'mathematically_requires') {
        prerequisites.push(rel.target);
      }
    }
  }

  const tags = [entity.domain, entity.type];

  const metadata: LessonMetadata = {
    conceptId: entity.id,
    displayName: entity.name,
    subject: entity.domain,
    gradeLevels: [],
    prerequisites,
    estimatedTimeMinutes: narrative.estimatedTimeMinutes ?? 12,
    commonMisconceptions: narrative.misconceptions ?? entity.common_misconceptions ?? [],
    tags: [...new Set(tags)],
  };

  if (entity.learning_objectives) metadata.learningObjectives = entity.learning_objectives;
  const realWorldApplications = narrative.applications ?? entity.real_world_applications;
  if (realWorldApplications) metadata.realWorldApplications = realWorldApplications;
  if (narrative.connections) metadata.connections = narrative.connections;

  return {
    id: `lesson-${entity.id.replace(/:/g, '-')}`,
    version: '1.1.0',
    metadata,
    sections: narrativeSections(entity, narrative),
    questions: [],
    simulations: [],
  };
}