/**
 * @stem-tuition/content-provider
 *
 * Content access boundary for STEM-TUITION.
 *
 * Consumes content from different sources (local data, LearningHubSTEM)
 * and provides a unified LessonContent application model.
 */

// Types
export type {
  LessonContent,
  LessonMetadata,
  LessonSection,
  SectionKind,
  Question,
  SimulationConfig,
  ChallengeConfig,
  ContentFilter,
} from './types';

// LHS types
export type { LhsEntity, LhsRelationship } from './lhs-adapter';

// ContentProvider interface
export type { ContentProvider } from './content-provider';

// Implementations
export { LocalContentProvider } from './local-content-provider';

// Mappers
export { mapQuizQuestionsToLessons } from './quiz-mapper';
export type { QuizQuestionLike } from './quiz-mapper';

export { mapLhsEntityToLesson, mapLhsEntitiesToLessons } from './lhs-adapter';
