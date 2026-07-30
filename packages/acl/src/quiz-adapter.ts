import { getDefaultEventBus } from '@stem-tuition/core';

export interface LegacyQuizState {
  currentSubject: string;
  currentIndex: number;
  score: number;
  totalQuestions: number;
  isCompleted: boolean;
}

export interface QuestionData {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

type QuizDataMap = Record<string, QuestionData[]>;

function getLegacyQuizApp(): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  const app = (window as unknown as Record<string, unknown>).stemQuizApp;
  return (app && typeof app === 'object') ? (app as Record<string, unknown>) : null;
}

function getQuizData(): QuizDataMap | null {
  if (typeof window === 'undefined') return null;
  const data = (window as unknown as Record<string, unknown>).STEM_QUIZ_DATA;
  return data ? (data as QuizDataMap) : null;
}

export function getQuizState(): LegacyQuizState | null {
  const app = getLegacyQuizApp();
  if (!app) return null;
  const data = getQuizData();
  const currentSubject = app.currentSubject as string;
  const questions = data?.[currentSubject];
  return {
    currentSubject,
    currentIndex: app.currentIndex as number,
    score: app.score as number,
    totalQuestions: questions?.length ?? 0,
    isCompleted: (app.currentIndex as number) >= (questions?.length ?? 0),
  };
}

export function getSubjectQuestions(subject: string): QuestionData[] | null {
  const data = getQuizData();
  return data?.[subject] ?? null;
}

export function getAvailableSubjects(): string[] {
  const data = getQuizData();
  return data ? Object.keys(data) : [];
}

export function setQuizSubject(subject: string): void {
  const app = getLegacyQuizApp();
  if (app && typeof app.setSubject === 'function') {
    app.setSubject(subject);
  }
}

export function publishQuizStarted(quizId: string, conceptId: string): void {
  const state = getQuizState();
  if (!state) return;
  getDefaultEventBus().publish('quiz:started', {
    data: {
      quizId,
      conceptId,
      questionCount: state.totalQuestions,
      difficulty: 'medium',
    },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
}

export function publishQuizAnswerSubmitted(
  quizId: string,
  questionId: string,
  answer: string,
  timeSpentMs: number,
  hintUsed: boolean,
): void {
  getDefaultEventBus().publish('quiz:answer-submitted', {
    data: { quizId, questionId, answer, timeSpentMs, hintUsed },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
}

export function publishQuizCompleted(quizId: string, conceptId: string): void {
  const state = getQuizState();
  if (!state) return;
  const percentage = state.totalQuestions > 0
    ? Math.round((state.score / (state.totalQuestions * 10)) * 100)
    : 0;
  getDefaultEventBus().publish('quiz:completed', {
    data: {
      quizId,
      conceptId,
      score: state.score,
      total: state.totalQuestions * 10,
      percentage,
      timeSpentMs: 0,
      misconceptionsIdentified: 0,
    },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
}
