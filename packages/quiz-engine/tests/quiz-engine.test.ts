import { describe, it, expect } from 'vitest';
import { createQuizState, validateAnswer, advanceQuestion, resetQuiz, getCurrentQuestion } from '../src/internal/quiz-engine';
import { getResultMetadata } from '../src/types';
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

  // Added 2026-09-30 (mutation gap Q2). The pre-existing test answers `q.correct`
  // and then `0`. If the question's correct index happens to be 0, that second
  // answer is ALSO correct, so the assertion only passes because the guard
  // happened to hold — and removing the guard entirely still left it green.
  // This pins the integrity property directly: a correct answer submitted twice
  // must award points exactly once, regardless of which index is correct.
  it('awards points at most once per question, even when re-answered correctly', () => {
    SUBJECTS.forEach((subject) => {
      const state = createQuizState(subject);
      const q = state.questions[state.currentIndex]!;

      const first = validateAnswer(state, q.correct);
      expect(first.updatedState.score).toBe(10);
      expect(first.answer.isCorrect).toBe(true);

      // Submit the SAME correct answer again. Score must not move.
      const second = validateAnswer(first.updatedState, q.correct);
      expect(second.updatedState.score).toBe(10);
      expect(second.updatedState).toBe(first.updatedState); // returned unchanged
      expect(second.answer.isCorrect).toBe(false); // no credit recorded
    });
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

// ---------------------------------------------------------------------------
// getResultMetadata — scoring boundaries
//
// Added 2026-09-30 (mutation gaps Q5, Q6, Q7). The pre-existing completion test
// answers every question correctly, so it only ever exercised percentage === 100.
// That left three whole behaviours unverified: the rounding mode, the >= 70
// Scholar boundary, and the derivation of totalQuestions. Each is a real
// learner-visible outcome, so each now has an explicit test.
// ---------------------------------------------------------------------------
describe('getResultMetadata', () => {
  it('derives totalQuestions from maxScore at 10 points per question', () => {
    const result = getResultMetadata(50, 20, 40);
    expect(result.totalQuestions).toBe(4);
    expect(result.score).toBe(20);
    expect(result.total).toBe(40);
  });

  it('rounds a fractional percentage to the nearest integer', () => {
    // IMPORTANT: the percentage must be computed BY THE SOURCE, not by the test.
    // Passing a pre-rounded value in (e.g. Math.round(66.6)) would make the
    // source's rounding mode unobservable — which is exactly why the earlier
    // version of this test could not detect a switch to Math.floor.
    //
    // Driving advanceQuestion with a synthetic 3-question state gives 2/3 =
    // 66.66..., where round -> 67 but floor -> 66. currentIndex must be the
    // LAST index (2) for advanceQuestion to treat the quiz as complete.
    const state = createQuizState('physics');
    const synthetic = {
      ...state,
      questions: state.questions.slice(0, 3),
      currentIndex: 2,
      score: 20, // 2 correct out of 3
    };
    const { result } = advanceQuestion(synthetic);

    expect(result).not.toBeNull();
    expect(result!.percentage).toBe(67); // floor would yield 66
  });

  it('treats exactly 70% as Scholar, not as a bare attempt', () => {
    // Boundary: >= 70 must be inclusive. Shifting the threshold to 90 would
    // silently demote a proficient learner.
    const result = getResultMetadata(70, 70, 100);
    expect(result.title).toContain('Scholar');
  });

  it('treats 69% as below the Scholar boundary', () => {
    const result = getResultMetadata(69, 69, 100);
    expect(result.title).not.toContain('Scholar');
  });

  it('awards the top title only at exactly 100%', () => {
    expect(getResultMetadata(100, 100, 100).title).toContain('Genius');
    expect(getResultMetadata(99, 99, 100).title).not.toContain('Genius');
  });
});
