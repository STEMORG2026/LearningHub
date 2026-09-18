export type ProgressEvent =
  | 'lesson:started'
  | 'lesson:completed'
  | 'quiz:completed'
  | 'simulation:completed';

export interface LessonProgress {
  lessonId: string;
  userId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt: number | null;
  completedAt: number | null;
  score: number | null;
}

export interface UserProgress {
  userId: string;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  averageScore: number;
  streak: number;
  lastActivityAt: number | null;
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}
