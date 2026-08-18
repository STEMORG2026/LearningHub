/**
 * LearningHubSTEM adapter.
 *
 * Transforms LearningHubSTEM entities (from exports/knowledge.json) into
 * LessonContent[]. This is the bridge between the canonical knowledge base and
 * the STEM Tuition application model.
 *
 * Per CONSTITUTION.md §11: the application must not expose LearningHubSTEM's
 * internal schema throughout the product.
 */

import type { LessonContent, LessonSection, SimulationConfig } from './types';

// ─────────────────────────────────────────────────────
// LHS entity shapes (from exports/knowledge.json)
// ─────────────────────────────────────────────────────

export interface LhsRelationship {
  type: string;
  target: string;
  note?: string;
}

export interface LhsEntity {
  id: string;
  type: string;
  name: string;
  domain: string;
  status: string;
  definition: string;
  symbol?: string | null;
  unit?: string | null;
  equation?: string | null;
  common_misconceptions?: string[];
  provenance?: {
    ai_drafted: boolean;
    source_kind?: string;
    source?: string;
    reviewer?: string;
    reviewed_at?: string;
  };
  relationships?: LhsRelationship[];
}

function entityToSections(entity: LhsEntity): LessonSection[] {
  const sections: LessonSection[] = [];
  let sectionIdx = 0;

  // Opening narrative — a hook that makes the concept feel relevant
  sections.push({
    id: `${entity.id}-narrative-${sectionIdx}`,
    kind: 'narrative',
    body: entity.definition,
    heading: 'What It Means',
  });
  sectionIdx++;

  // Equation as equation section (if present)
  if (entity.equation) {
    const section: LessonSection = {
      id: `${entity.id}-equation-${sectionIdx}`,
      kind: 'equation',
      body: entity.equation,
      heading: 'The Formula',
    };
    if (entity.symbol) {
      section.symbol = entity.symbol;
    }
    sections.push(section);
    sectionIdx++;
  }

  // Unit as a fun fact
  if (entity.unit) {
    sections.push({
      id: `${entity.id}-unit-${sectionIdx}`,
      kind: 'fun-fact',
      body: `Measured in ${entity.unit}. That's the unit you'll see this quantity labeled with in problems and real-world measurements.`,
      heading: 'The Unit',
    });
    sectionIdx++;
  }

  // Misconceptions as misconception sections
  if (entity.common_misconceptions && entity.common_misconceptions.length > 0) {
    for (const miscon of entity.common_misconceptions) {
      sections.push({
        id: `${entity.id}-miscon-${sectionIdx}`,
        kind: 'misconception',
        body: miscon,
        heading: 'Common Trap',
      });
      sectionIdx++;
    }
  }

  return sections;
}

function entityToSimulations(entity: LhsEntity): SimulationConfig[] {
  // Laws and quantities can have associated simulations
  if (entity.type === 'law' && entity.domain === 'physics') {
    return [
      {
        type: `${entity.domain}-simulation`,
        title: `${entity.name} — Interactive`,
        params: {
          conceptId: entity.id,
          symbol: entity.symbol ?? '',
          equation: entity.equation ?? '',
        },
      },
    ];
  }
  return [];
}

/**
 * Map a single LHS entity to a LessonContent.
 *
 * The lesson is structured around the entity's definition, formula, and
 * misconceptions. Prerequisites are derived from relationships.
 */
export function mapLhsEntityToLesson(entity: LhsEntity): LessonContent {
  const sections = entityToSections(entity);
  const simulations = entityToSimulations(entity);

  // Derive prerequisites from relationships
  const prerequisites: string[] = [];
  if (entity.relationships) {
    for (const rel of entity.relationships) {
      if (rel.type === 'logically_requires' || rel.type === 'mathematically_requires') {
        prerequisites.push(rel.target);
      }
    }
  }

  // Tags: domain + type + relationship types
  const tags = [entity.domain, entity.type];
  if (entity.relationships) {
    tags.push(...entity.relationships.map((r) => r.type));
  }

  return {
    id: `lesson-${entity.id.replace(':', '-')}`,
    version: '1.0.0',
    metadata: {
      conceptId: entity.id,
      displayName: entity.name,
      subject: entity.domain,
      gradeLevels: [], // Curriculum-agnostic — no grade info in LHS entities
      prerequisites,
      estimatedTimeMinutes: 10,
      commonMisconceptions: entity.common_misconceptions ?? [],
      tags: [...new Set(tags)],
    },
    sections,
    questions: [], // LHS doesn't own questions — that's quiz-engine's domain
    simulations,
  };
}

/**
 * Map multiple LHS entities to LessonContent[].
 * Filters out deprecated/superseded entities.
 */
export function mapLhsEntitiesToLessons(entities: LhsEntity[]): LessonContent[] {
  return entities
    .filter((e) => e.status !== 'deprecated' && e.status !== 'superseded')
    .map(mapLhsEntityToLesson);
}
