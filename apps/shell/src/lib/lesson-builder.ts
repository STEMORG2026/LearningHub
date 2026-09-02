/**
 * Lesson builder for the shell — a consumer seam.
 *
 * Maps canonical STEMMA entities into LessonContent, then enriches
 * concepts that have an authored narrative with their progressive story via
 * `composeNarrativeLesson`. Concepts without a narrative still get a complete,
 * enriched lesson from the base adapter.
 *
 * This is consumer-owned composition (CONSTITUTION.md §35): the narrative layer
 * lives here, never in STEMMA.
 *
 * The function is pure (narratives passed in) so it stays unit-testable independent
 * of how the (large) narrative data is loaded.
 */
import {
  composeNarrativeLesson,
  mapLhsEntitiesToLessons,
  type LhsEntity,
  type LessonContent,
} from '@learninghub/content-provider';
import type { NarrativeContent } from '@learninghub/content-provider';

/**
 * Build the full lesson set, applying authored narratives where present.
 *
 * @param entities canonical STEMMA entities from the vendored export
 * @param narratives authored narrative content keyed by canonical concept id
 */
export function buildLessons(
  entities: LhsEntity[],
  narratives: Record<string, NarrativeContent>,
): LessonContent[] {
  return entities.map((entity) => {
    const narrative = narratives[entity.id];
    if (narrative) {
      return composeNarrativeLesson(entity, narrative);
    }
    // Fall back to the enriched base adapter for non-narrated concepts.
    const base = mapLhsEntitiesToLessons([entity])[0];
    if (!base) {
      throw new Error(`LessonBuilder: no lesson produced for entity '${entity.id}'.`);
    }
    return base;
  });
}