/**
 * Lesson builder for the shell — a consumer seam.
 *
 * Maps canonical LearningHubSTEM entities into LessonContent, then enriches
 * concepts that have an authored narrative with their progressive story via
 * `composeNarrativeLesson`. Concepts without a narrative still get a complete,
 * enriched lesson from the base adapter.
 *
 * This is consumer-owned composition (CONSTITUTION.md §35): the narrative layer
 * lives here, never in LearningHubSTEM.
 */
import {
  composeNarrativeLesson,
  mapLhsEntitiesToLessons,
  type LhsEntity,
  type LessonContent,
} from '@stem-tuition/content-provider';
import { NARRATIVES } from '../data/narratives';

/**
 * Build the full lesson set, applying authored narratives where present.
 *
 * @param entities canonical LearningHubSTEM entities from the vendored export
 */
export function buildLessons(entities: LhsEntity[]): LessonContent[] {
  return entities.map((entity) => {
    const narrative = NARRATIVES[entity.id];
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