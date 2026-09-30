import { describe, it, expect } from 'vitest';
import { startLesson, completeLesson, getLessonProgress, getUserProgress, getStreak } from '../src/internal/progress';
import type { LessonProgress, UserProgress } from '../src/types';

describe('progress', () => {
  it('starts a lesson', () => {
    const p = startLesson('user-1', 'lesson-1');
    expect(p.status).toBe('in_progress');
    expect(p.userId).toBe('user-1');
    expect(p.lessonId).toBe('lesson-1');
    expect(p.startedAt).toBeGreaterThan(0);
  });

  it('completes a lesson', () => {
    startLesson('user-1', 'lesson-2');
    const p = completeLesson('user-1', 'lesson-2', 85);
    expect(p.status).toBe('completed');
    expect(p.score).toBe(85);
    expect(p.completedAt).toBeGreaterThan(0);
  });

  it('throws on completing unstarted lesson', () => {
    expect(() => completeLesson('user-1', 'lesson-99', 50)).toThrow('Lesson not started');
  });

  it('gets lesson progress', () => {
    startLesson('user-1', 'lesson-3');
    const p = getLessonProgress('user-1', 'lesson-3');
    expect(p).not.toBeNull();
    expect(p!.status).toBe('in_progress');
  });

  it('returns null for missing progress', () => {
    expect(getLessonProgress('user-99', 'lesson-1')).toBeNull();
  });

  it('gets user progress summary', () => {
    startLesson('user-2', 'lesson-a');
    completeLesson('user-2', 'lesson-a', 90);
    const summary = getUserProgress('user-2');
    expect(summary.userId).toBe('user-2');
    expect(summary.totalLessons).toBeGreaterThanOrEqual(1);
    expect(summary.completedLessons).toBeGreaterThanOrEqual(1);
  });

  it('gets streak info', () => {
    const streak = getStreak('user-1');
    expect(streak).toHaveProperty('current');
    expect(streak).toHaveProperty('longest');
  });
});

// ── getUserProgress: empty + averaging branches ─────────────────
// A distinct userId per test keeps these independent of the module-level Map.
describe('getUserProgress', () => {
  it('returns a zeroed summary for a user with no progress at all', () => {
    const summary = getUserProgress('user-empty-progress');
    expect(summary.totalLessons).toBe(0);
    expect(summary.completedLessons).toBe(0);
    expect(summary.averageScore).toBe(0);
    expect(summary.lastActivityAt).toBeNull();
    expect(summary.streak).toBe(0);
    expect(summary.totalQuizzes).toBe(0);
  });

  it('counts in-progress lessons but does not include them in the average', () => {
    startLesson('user-mixed', 'in-progress-only');
    const summary = getUserProgress('user-mixed');
    expect(summary.totalLessons).toBe(1);
    expect(summary.completedLessons).toBe(0);
    expect(summary.averageScore).toBe(0);
    expect(summary.lastActivityAt).toBeNull();
  });

  it('averages the scores of completed lessons', () => {
    startLesson('user-avg', 'a');
    completeLesson('user-avg', 'a', 80);
    startLesson('user-avg', 'b');
    completeLesson('user-avg', 'b', 100);

    const summary = getUserProgress('user-avg');
    expect(summary.completedLessons).toBe(2);
    expect(summary.averageScore).toBe(90);
  });

  it('treats a completed lesson scored 0 as 0 in the average', () => {
    startLesson('user-noscore', 'a');
    completeLesson('user-noscore', 'a', 0);

    const summary = getUserProgress('user-noscore');
    expect(summary.completedLessons).toBe(1);
    expect(summary.averageScore).toBe(0);
  });

  it('reports the latest completion time as lastActivityAt', () => {
    startLesson('user-latest', 'a');
    const first = completeLesson('user-latest', 'a', 50);
    startLesson('user-latest', 'b');
    const second = completeLesson('user-latest', 'b', 60);

    const summary = getUserProgress('user-latest');
    expect(summary.lastActivityAt).toBe(Math.max(first.completedAt!, second.completedAt!));
  });

  it('does not leak other users into the summary', () => {
    startLesson('user-isolated-x', 'a');
    completeLesson('user-isolated-x', 'a', 70);
    startLesson('user-isolated-y', 'a');
    completeLesson('user-isolated-y', 'a', 30);

    expect(getUserProgress('user-isolated-x').averageScore).toBe(70);
    expect(getUserProgress('user-isolated-y').averageScore).toBe(30);
  });
});

// ── getStreak: populated branch ─────────────────────────────────
describe('getStreak', () => {
  it('reports zero/null for a user with no completed lessons', () => {
    const streak = getStreak('user-no-streak');
    expect(streak.current).toBe(0);
    expect(streak.longest).toBe(0);
    expect(streak.lastActiveDate).toBeNull();
  });

  it('reports a current streak and lastActiveDate once lessons are completed', () => {
    startLesson('user-streak', 'a');
    completeLesson('user-streak', 'a', 90);

    const streak = getStreak('user-streak');
    expect(streak.current).toBeGreaterThanOrEqual(1);
    expect(streak.longest).toBeGreaterThanOrEqual(1);
    expect(streak.lastActiveDate).not.toBeNull();
  });

  it('ignores lessons that are only in progress', () => {
    startLesson('user-streak-inprogress', 'a');
    const streak = getStreak('user-streak-inprogress');
    expect(streak.current).toBe(0);
    expect(streak.lastActiveDate).toBeNull();
  });
});
