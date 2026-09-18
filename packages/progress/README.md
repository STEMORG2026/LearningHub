# @learninghub/progress

**Version:** 1.0.0

Student progress tracking — lessons, scores, streaks, and user progress summaries.

## Public API

- `startLesson(userId, lessonId)` — Mark a lesson as started
- `completeLesson(userId, lessonId, score)` — Mark a lesson as completed
- `getLessonProgress(userId, lessonId)` — Get progress for a specific lesson
- `getUserProgress(userId)` — Get overall progress summary
- `getStreak(userId)` — Get streak info for a user
- `tracedStartLesson`, `tracedCompleteLesson` — Traced wrappers

## Events

- `progress:lesson-started` — Published when a lesson begins
- `progress:lesson-completed` — Published when a lesson completes

## Dependencies

- `@learninghub/core` (EventBus)
- `@learninghub/tracer` (instrumentation)
