/**
 * ContentProvider — the seam.
 *
 * Per CONSTITUTION.md §11:
 *
 *   LearningHubSTEM
 *         │
 *         ▼
 *   ContentProvider
 *         │
 *         ▼
 *   ContentProvider (LocalContentProvider | CachedContentProvider | LearningHubStemProvider)
 *
 * This interface is the boundary. It is NOT frozen yet — it's a planned seam
 * being implemented now for the first time. Once validated, it should be
 * registered in the interface registry and frozen via ADR.
 */

import type { LessonContent, ContentFilter } from './types';

export interface ContentProvider {
  /**
   * Return a single lesson by ID, or undefined if not found.
   */
  getLesson(id: string): LessonContent | undefined;

  /**
   * List all lessons matching the given filter.
   * An empty filter returns all lessons.
   */
  getLessons(filter?: ContentFilter): LessonContent[];

  /**
   * Return lessons that teach a specific concept.
   */
  getByConcept(conceptId: string): LessonContent[];

  /**
   * Return lessons targeting a specific grade level.
   */
  getByGrade(grade: number): LessonContent[];

  /**
   * Return lessons for a specific subject.
   */
  getBySubject(subject: string): LessonContent[];

  /**
   * Provider identifier (for debugging / tracer).
   */
  readonly providerName: string;
}
