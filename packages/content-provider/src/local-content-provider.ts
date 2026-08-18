/**
 * LocalContentProvider — in-memory content provider.
 *
 * Wraps a static array of LessonContent. This is the first concrete
 * implementation of the ContentProvider seam. It allows the product to work
 * without any external dependency on LearningHubSTEM.
 *
 * Per CONSTITUTION.md §11: "The current implementation may use LocalContentProvider."
 */

import type { LessonContent, ContentFilter } from './types';
import type { ContentProvider } from './content-provider';

export class LocalContentProvider implements ContentProvider {
  readonly providerName = 'local';

  private lessons: Map<string, LessonContent>;

  constructor(lessons: LessonContent[]) {
    this.lessons = new Map(lessons.map((l) => [l.id, l]));
  }

  getLesson(id: string): LessonContent | undefined {
    return this.lessons.get(id);
  }

  getLessons(filter: ContentFilter = {}): LessonContent[] {
    let results = Array.from(this.lessons.values());

    if (filter.subject) {
      const subjectLower = filter.subject.toLowerCase();
      results = results.filter((l) => l.metadata.subject.toLowerCase() === subjectLower);
    }

    if (filter.grade !== undefined) {
      results = results.filter((l) => l.metadata.gradeLevels.includes(filter.grade!));
    }

    if (filter.conceptId) {
      results = results.filter((l) => l.metadata.conceptId === filter.conceptId);
    }

    if (filter.requiresConcept) {
      results = results.filter((l) =>
        l.metadata.prerequisites.includes(filter.requiresConcept!),
      );
    }

    if (filter.tag) {
      const tagLower = filter.tag.toLowerCase();
      results = results.filter((l) =>
        l.metadata.tags.some((t) => t.toLowerCase() === tagLower),
      );
    }

    return results;
  }

  getByConcept(conceptId: string): LessonContent[] {
    return this.getLessons({ conceptId });
  }

  getByGrade(grade: number): LessonContent[] {
    return this.getLessons({ grade });
  }

  getBySubject(subject: string): LessonContent[] {
    return this.getLessons({ subject });
  }
}
