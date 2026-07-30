export interface EventPayload<T = Record<string, unknown>> {
  data: T;
  timestamp: string;
  schemaVersion: string;
  traceId?: string;
}

export type EventHandler<T = Record<string, unknown>> = (payload: EventPayload<T>) => void;

export interface SubscriptionEntry {
  pattern: string;
  regex: RegExp;
  handler: EventHandler;
}

export interface QuizStartedData {
  quizId: string;
  conceptId: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAnswerSubmittedData {
  quizId: string;
  questionId: string;
  answer: string;
  timeSpentMs: number;
  hintUsed: boolean;
}

export interface QuizCompletedData {
  quizId: string;
  conceptId: string;
  score: number;
  total: number;
  percentage: number;
  timeSpentMs: number;
  misconceptionsIdentified: number;
}

export interface AudioPlaySoundData {
  sound: string;
  volume: number;
  loop: boolean;
}

export interface ErrorData {
  module: string;
  code: string;
  message: string;
  recoverable: boolean;
  timestamp: string;
  traceId?: string;
}
