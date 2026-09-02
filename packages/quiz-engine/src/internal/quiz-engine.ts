import { getDefaultEventBus } from '@learninghub/core';
import { traced } from '@learninghub/tracer';
import type { SubjectKey, QuizQuestion, QuizState, QuizAnswer, QuizResult } from '../types';
import { getResultMetadata } from '../types';
import { getQuestionsBySubject } from '../data';

export function createQuizState(subject: SubjectKey): QuizState {
  return {
    subject,
    currentIndex: 0,
    score: 0,
    answered: false,
    questions: getQuestionsBySubject(subject),
  };
}

export function validateAnswer(
  state: QuizState,
  selectedIndex: number,
): { updatedState: QuizState; answer: QuizAnswer } {
  if (state.answered) {
    return { updatedState: state, answer: createEmptyAnswer(state, selectedIndex) };
  }

  const question = state.questions[state.currentIndex];
  if (!question) {
    return { updatedState: state, answer: createEmptyAnswer(state, selectedIndex) };
  }

  const isCorrect = selectedIndex === question.correct;
  const newScore = isCorrect ? state.score + 10 : state.score;

  const answer: QuizAnswer = {
    questionId: question.id,
    selectedIndex,
    correctIndex: question.correct,
    isCorrect,
  };

  const updatedState: QuizState = {
    ...state,
    score: newScore,
    answered: true,
  };

  return { updatedState, answer };
}

export const tracedValidateAnswer = traced('quiz:validate-answer', validateAnswer);

export function advanceQuestion(
  state: QuizState,
): { updatedState: QuizState; isComplete: boolean; result: QuizResult | null } {
  const nextIndex = state.currentIndex + 1;
  const isComplete = nextIndex >= state.questions.length;

  if (isComplete) {
    const maxScore = state.questions.length * 10;
    const percentage = Math.round((state.score / maxScore) * 100);
    const result = getResultMetadata(percentage, state.score, maxScore);

    getDefaultEventBus().publish('quiz:completed', {
      data: {
        quizId: state.subject,
        conceptId: state.questions.map((q) => q.conceptId).join(',') || state.subject,
        score: state.score,
        total: maxScore,
        percentage,
        timeSpentMs: 0,
        misconceptionsIdentified: 0,
      },
      timestamp: new Date().toISOString(),
      schemaVersion: '1.0',
    });

    return {
      updatedState: { ...state, currentIndex: nextIndex },
      isComplete: true,
      result,
    };
  }

  return {
    updatedState: {
      ...state,
      currentIndex: nextIndex,
      answered: false,
    },
    isComplete: false,
    result: null,
  };
}

export const tracedAdvanceQuestion = traced('quiz:advance-question', advanceQuestion);

export function resetQuiz(subject: SubjectKey): QuizState {
  return createQuizState(subject);
}

export function getCurrentQuestion(state: QuizState): QuizQuestion | null {
  if (state.currentIndex >= state.questions.length) return null;
  return state.questions[state.currentIndex] ?? null;
}

function createEmptyAnswer(state: QuizState, selectedIndex: number): QuizAnswer {
  return {
    questionId: state.questions[state.currentIndex]?.id ?? 'unknown',
    selectedIndex,
    correctIndex: state.questions[state.currentIndex]?.correct ?? -1,
    isCorrect: false,
  };
}
