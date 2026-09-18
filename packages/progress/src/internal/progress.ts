import { getDefaultEventBus } from '@learninghub/core';
import { traced } from '@learninghub/tracer';
import type { LessonProgress, UserProgress, StreakInfo } from '../types';

const lessonProgress = new Map<string, LessonProgress>();

export function startLesson(userId: string, lessonId: string): LessonProgress {
  const key = `${userId}:${lessonId}`;
  const progress: LessonProgress = {
    userId,
    lessonId,
    status: 'in_progress',
    startedAt: Date.now(),
    completedAt: null,
    score: null,
  };
  lessonProgress.set(key, progress);
  getDefaultEventBus().publish('progress:lesson-started', {
    data: { userId, lessonId },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return progress;
}

export function completeLesson(userId: string, lessonId: string, score: number): LessonProgress {
  const key = `${userId}:${lessonId}`;
  const existing = lessonProgress.get(key);
  if (!existing) {
    throw new Error('Lesson not started');
  }
  existing.status = 'completed';
  existing.completedAt = Date.now();
  existing.score = score;
  lessonProgress.set(key, existing);
  getDefaultEventBus().publish('progress:lesson-completed', {
    data: { userId, lessonId, score },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return existing;
}

export function getLessonProgress(userId: string, lessonId: string): LessonProgress | null {
  const key = `${userId}:${lessonId}`;
  return lessonProgress.get(key) ?? null;
}

export function getUserProgress(userId: string): UserProgress {
  const lessons = Array.from(lessonProgress.values()).filter((l) => l.userId === userId);
  const completed = lessons.filter((l) => l.status === 'completed');
  const scores = completed.map((l) => l.score ?? 0);
  return {
    userId,
    totalLessons: lessons.length,
    completedLessons: completed.length,
    totalQuizzes: 0,
    averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
    streak: 0,
    lastActivityAt: completed.length > 0 ? Math.max(...completed.map((c) => c.completedAt ?? 0)) : null,
  };
}

export function getStreak(userId: string): StreakInfo {
  const completed = Array.from(lessonProgress.values()).filter((l) => l.userId === userId && l.completedAt);
  const dates = completed.map((c) => new Date(c.completedAt ?? 0).toDateString());
  const unique = [...new Set(dates)].sort();
  let current = 0;
  let longest = 0;
  let lastActiveDate: string | null = null;
  if (unique.length > 0) {
    lastActiveDate = unique[unique.length - 1]!;
    current = unique.length;
    longest = unique.length;
  }
  return { current, longest, lastActiveDate };
}

export const tracedStartLesson = traced('progress:lesson-started', startLesson);
export const tracedCompleteLesson = traced('progress:lesson-completed', completeLesson);
