export { StemQuiz } from './internal/web-component';
export {
  createQuizState,
  validateAnswer,
  advanceQuestion,
  resetQuiz,
  getCurrentQuestion,
} from './internal/quiz-engine';
export { renderQuestion, renderResult } from './internal/template';
export { QUIZ_QUESTIONS, getQuestionsBySubject, getQuestionById } from './data';
export { getResultMetadata } from './types';
export type {
  SubjectKey,
  QuizQuestionData,
  QuizQuestion,
  QuizState,
  QuizResult,
  QuizAnswer,
} from './types';
