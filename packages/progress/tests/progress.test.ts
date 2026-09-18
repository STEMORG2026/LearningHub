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
