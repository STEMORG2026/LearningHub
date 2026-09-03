import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QuizEngine, createQuizState, validateAnswer, advanceQuestion, resetQuiz, getCurrentQuestion } from '../src/internal/quiz-engine';
import { QuizQuestion, SubjectKey, DifficultyLevel } from '../src/types';

// E2E integration tests for the full quiz flow
describe('Quiz Engine E2E Flow', () => {
  let quizState: ReturnType<typeof createQuizState>;

  beforeEach(() => {
    // Create a fresh quiz state for each test
    quizState = createQuizState('physics', 4);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should load a quiz and get the first question', () => {
    const question = getCurrentQuestion(quizState);
    expect(question).toBeDefined();
    expect(question.subject).toBe('physics');
    expect(question.number).toBe(1);
  });

  it('should answer a question correctly and advance', () => {
    const question = getCurrentQuestion(quizState);
    const correctAnswer = question.correctAnswer;
    
    const result = validateAnswer(quizState, correctAnswer);
    expect(result.isCorrect).toBe(true);
    
    const nextState = advanceQuestion(quizState);
    expect(nextState.currentQuestionIndex).toBe(1);
  });

  it('should answer a question incorrectly and track it', () => {
    const question = getCurrentQuestion(quizState);
    const wrongAnswer = question.options.find(opt => opt !== question.correctAnswer) || 'Wrong';
    
    const result = validateAnswer(quizState, wrongAnswer);
    expect(result.isCorrect).toBe(false);
    
    const nextState = advanceQuestion(quizState);
    expect(nextState.currentQuestionIndex).toBe(1);
  });

  it('should complete all questions and show final score', () => {
    // Answer all questions correctly
    while (quizState.currentQuestionIndex < quizState.questions.length) {
      const question = getCurrentQuestion(quizState);
      validateAnswer(quizState, question.correctAnswer);
      quizState = advanceQuestion(quizState);
    }
    
    expect(quizState.currentQuestionIndex).toBe(quizState.questions.length);
    expect(quizState.score).toBe(quizState.questions.length);
  });

  it('should reset quiz state correctly', () => {
    // Answer one question
    const question = getCurrentQuestion(quizState);
    validateAnswer(quizState, question.correctAnswer);
    quizState = advanceQuestion(quizState);
    
    // Reset
    const resetState = resetQuiz(quizState);
    expect(resetState.currentQuestionIndex).toBe(0);
    expect(resetState.score).toBe(0);
    expect(resetState.answers).toEqual([]);
  });

  it('should handle all subjects', () => {
    const subjects: SubjectKey[] = ['physics', 'chemistry', 'biology', 'mathematics', 'computer-science'];
    
    for (const subject of subjects) {
      const state = createQuizState(subject, 3);
      const question = getCurrentQuestion(state);
      expect(question.subject).toBe(subject);
      expect(state.questions.length).toBe(3);
    }
  });

  it('should track answer history correctly', () => {
    const question = getCurrentQuestion(quizState);
    const correctAnswer = question.correctAnswer;
    
    validateAnswer(quizState, correctAnswer);
    quizState = advanceQuestion(quizState);
    
    expect(quizState.answers).toHaveLength(1);
    expect(quizState.answers[0]).toEqual({
      questionId: question.id,
      selectedAnswer: correctAnswer,
      isCorrect: true,
      subject: question.subject,
    });
  });

  it('should handle mixed correct/incorrect answers', () => {
    // Answer first correctly
    let question = getCurrentQuestion(quizState);
    validateAnswer(quizState, question.correctAnswer);
    quizState = advanceQuestion(quizState);
    
    // Answer second incorrectly
    question = getCurrentQuestion(quizState);
    const wrongAnswer = question.options.find(opt => opt !== question.correctAnswer) || 'Wrong';
    validateAnswer(quizState, wrongAnswer);
    quizState = advanceQuestion(quizState);
    
    expect(quizState.score).toBe(1);
    expect(quizState.answers).toHaveLength(2);
    expect(quizState.answers[0].isCorrect).toBe(true);
    expect(quizState.answers[1].isCorrect).toBe(false);
  });
});