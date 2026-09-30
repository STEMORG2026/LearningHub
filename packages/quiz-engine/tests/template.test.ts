/**
 * Tests for the quiz template layer (template.ts).
 *
 * This module had NO tests: it sat at 0% statement coverage while every other
 * file in the package was well covered. It is the code that produces the HTML
 * a student actually sees, so the gaps here were the most consequential in the
 * package. These tests pin the rendering contract rather than snapshotting the
 * whole string, so a deliberate markup change does not require a test rewrite
 * but an accidental one is still caught.
 */
import { describe, it, expect } from 'vitest';
import { renderQuestion, renderResult } from '../src/internal/template';
import type { QuizQuestion, QuizState, QuizResult } from '../src/types';

function makeQuestion(overrides: Partial<QuizQuestion> = {}): QuizQuestion {
  return {
    id: 'q-1',
    subject: 'physics',
    conceptId: 'concept-1',
    displayName: 'Newton\u2019s Second Law',
    prerequisites: [],
    gradeLevels: [9],
    estimatedTimeMinutes: 2,
    commonMisconceptions: [],
    tags: ['mechanics'],
    question: 'What is F = ma?',
    options: ['Force', 'Mass', 'Acceleration', 'Velocity'],
    correct: 0,
    explanation: 'Force equals mass times acceleration.',
    ...overrides,
  };
}

function makeState(overrides: Partial<QuizState> = {}): QuizState {
  return {
    subject: 'physics',
    currentIndex: 0,
    score: 0,
    answered: false,
    questions: [makeQuestion()],
    ...overrides,
  };
}

function makeResult(overrides: Partial<QuizResult> = {}): QuizResult {
  return {
    score: 3,
    total: 4,
    percentage: 75,
    totalQuestions: 4,
    title: 'Great work!',
    message: 'You are getting there.',
    ...overrides,
  };
}

describe('renderQuestion', () => {
  it('returns an empty string when there is no question at the current index', () => {
    expect(renderQuestion(makeState({ questions: [] }))).toBe('');
  });

  it('returns an empty string when currentIndex is past the end', () => {
    expect(renderQuestion(makeState({ currentIndex: 5 }))).toBe('');
  });

  it('renders the question text and explanation', () => {
    const html = renderQuestion(makeState());
    expect(html).toContain('What is F = ma?');
    expect(html).toContain('Force equals mass times acceleration.');
  });

  it('renders one option button per answer with letter prefixes', () => {
    const html = renderQuestion(makeState());
    expect(html).toContain('data-option-index="0"');
    expect(html).toContain('data-option-index="3"');
    expect(html).not.toContain('data-option-index="4"');
    expect(html).toContain('>A<');
    expect(html).toContain('>B<');
    expect(html).toContain('>C<');
    expect(html).toContain('>D<');
  });

  it('shows a 1-based question counter', () => {
    const html = renderQuestion(makeState({ currentIndex: 0, questions: [makeQuestion(), makeQuestion({ id: 'q-2' })] }));
    expect(html).toContain('QUESTION 1 OF 2');
  });

  it('advances the question counter with currentIndex', () => {
    const html = renderQuestion(
      makeState({
        currentIndex: 1,
        questions: [makeQuestion(), makeQuestion({ id: 'q-2', question: 'Second?' })],
      }),
    );
    expect(html).toContain('QUESTION 2 OF 2');
    expect(html).toContain('Second?');
  });

  it('computes progress as index over total, so the first question is 0%', () => {
    const html = renderQuestion(makeState({ currentIndex: 0, questions: [makeQuestion(), makeQuestion({ id: 'q-2' })] }));
    expect(html).toContain('width: 0%');
  });

  it('computes 50% progress at the second of four questions', () => {
    const questions = [1, 2, 3, 4].map((n) => makeQuestion({ id: `q-${n}` }));
    const html = renderQuestion(makeState({ currentIndex: 2, questions }));
    expect(html).toContain('width: 50%');
  });

  it('marks only the active subject tab', () => {
    const html = renderQuestion(makeState({ subject: 'chemistry' }));
    const activeMatches = html.match(/quiz-tab-btn active/g) ?? [];
    expect(activeMatches).toHaveLength(1);
    expect(html).toMatch(/class="quiz-tab-btn active" data-subject="chemistry"/);
  });

  it('renders a tab for every subject', () => {
    const html = renderQuestion(makeState());
    for (const s of ['physics', 'chemistry', 'math', 'computing', 'pioneers']) {
      expect(html).toContain(`data-subject="${s}"`);
    }
  });

  it('echoes the running score', () => {
    const html = renderQuestion(makeState({ score: 7 }));
    expect(html).toContain('quiz-score-value">7<');
  });

  it('hides the explanation and next button by default', () => {
    const html = renderQuestion(makeState());
    expect(html).toContain('id="quiz-explanation" style="display:none;"');
    expect(html).toContain('id="quiz-next-btn" style="display:none;"');
  });
});

describe('renderResult', () => {
  it('renders the title, message and percentage', () => {
    const html = renderResult(makeState(), makeResult());
    expect(html).toContain('Great work!');
    expect(html).toContain('You are getting there.');
    expect(html).toContain('75%');
  });

  it('renders the score out of the total', () => {
    const html = renderResult(makeState(), makeResult({ score: 3, total: 4 }));
    expect(html).toContain('Total Score: 3 / 4');
  });

  it('renders both result actions with their data-action hooks', () => {
    const html = renderResult(makeState(), makeResult());
    expect(html).toContain('data-action="retake"');
    expect(html).toContain('data-action="change-subject"');
  });

  it('renders a 0% result without special-casing', () => {
    const html = renderResult(makeState(), makeResult({ score: 0, percentage: 0 }));
    expect(html).toContain('0%');
    expect(html).toContain('Total Score: 0 / 4');
  });
});
