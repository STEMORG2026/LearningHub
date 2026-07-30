import { describe, it, expect } from 'vitest';
import { createQuizState, validateAnswer, advanceQuestion, resetQuiz, getCurrentQuestion } from '../src/internal/quiz-engine';
import type { SubjectKey } from '../types';

const SUBJECTS: SubjectKey[] = ['physics', 'chemistry', 'math', 'computing', 'pioneers'];

describe('createQuizState', () => {
  it('creates initial state for a subject', () => {
    const state = createQuizState('physics');
    expect(state.subject).toBe('physics');
    expect(state.currentIndex).toBe(0);
    expect(state.score).toBe(0);
    expect(state.answered).toBe(false);
    expect(state.questions.length).toBeGreaterThan(0);
  });

  it('all subjects have questions', () => {
    SUBJECTS.forEach((s) => {
      const state = createQuizState(s);
      expect(state.questions.length).toBe(4);
    });
  });
});

describe('validateAnswer', () => {
  it('returns correct for right answer', () => {
    const state = createQuizState('physics');
    const q = state.questions[0];
    const { updatedState, answer } = validateAnswer(state, q.correct);
    expect(answer.isCorrect).toBe(true);
    expect(updatedState.score).toBe(10);
    expect(updatedState.answered).toBe(true);
  });

  it('returns incorrect for wrong answer', () => {
    const state = createQuizState('physics');
    const q = state.questions[0];
    const wrongIndex = q.options.findIndex((_, i) => i !== q.correct);
    const { updatedState, answer } = validateAnswer(state, wrongIndex);
    expect(answer.isCorrect).toBe(false);
    expect(updatedState.score).toBe(0);
    expect(updatedState.answered).toBe(true);
  });

  it('does not change score when already answered', () => {
    const state = createQuizState('math');
    const q = state.questions[0];
    const state1 = validateAnswer(state, q.correct).updatedState;
    const state2 = validateAnswer(state1, 0).updatedState;
    expect(state2.score).toBe(10);
  });

  it('records correct index in answer', () => {
    const state = createQuizState('chemistry');
    const q = state.questions[0];
    const { answer } = validateAnswer(state, q.correct);
    expect(answer.correctIndex).toBe(q.correct);
    expect(answer.questionId).toBe(q.id);
  });

  it('handles each subject correctly', () => {
    SUBJECTS.forEach((s) => {
      const state = createQuizState(s);
      const q = state.questions[0];
      const { answer } = validateAnswer(state, q.correct);
      expect(answer.isCorrect).toBe(true);
    });
  });
});

describe('advanceQuestion', () => {
  it('advances to next question', () => {
    const state = createQuizState('physics');
    const { updatedState, isComplete } = advanceQuestion(state);
    expect(updatedState.currentIndex).toBe(1);
    expect(updatedState.answered).toBe(false);
    expect(isComplete).toBe(false);
  });

  it('marks completion on last question', () => {
    const state = createQuizState('physics');
    // Answer all questions
    let current = state;
    for (let i = 0; i < state.questions.length; i++) {
      const q = current.questions[current.currentIndex];
      current = validateAnswer(current, q.correct).updatedState;
      const result = advanceQuestion(current);
      current = result.updatedState;
      if (i === state.questions.length - 1) {
        expect(result.isComplete).toBe(true);
        expect(result.result).not.toBeNull();
        expect(result.result!.percentage).toBe(100);
      } else {
        expect(result.isComplete).toBe(false);
      }
    }
  });

  it('returns null result when not complete', () => {
    const state = createQuizState('physics');
    const { result } = advanceQuestion(state);
    expect(result).toBeNull();
  });

  it('resets answered flag after advance', () => {
    const state = createQuizState('physics');
    const q = state.questions[0];
    const answered = validateAnswer(state, q.correct).updatedState;
    expect(answered.answered).toBe(true);
    const advanced = advanceQuestion(answered).updatedState;
    expect(advanced.answered).toBe(false);
  });
});

describe('resetQuiz', () => {
  it('resets to fresh state for subject', () => {
    const state = createQuizState('computing');
    const q = state.questions[0];
    const answered = validateAnswer(state, q.correct).updatedState;
    const reset = resetQuiz(answered.subject);
    expect(reset.currentIndex).toBe(0);
    expect(reset.score).toBe(0);
    expect(reset.answered).toBe(false);
  });
});

describe('getCurrentQuestion', () => {
  it('returns question at current index', () => {
    const state = createQuizState('pioneers');
    const q = getCurrentQuestion(state);
    expect(q).not.toBeNull();
    expect(q!.subject).toBe('pioneers');
  });

  it('returns null when past end', () => {
    const state = createQuizState('physics');
    const pastEnd = { ...state, currentIndex: state.questions.length };
    expect(getCurrentQuestion(pastEnd)).toBeNull();
  });
});
