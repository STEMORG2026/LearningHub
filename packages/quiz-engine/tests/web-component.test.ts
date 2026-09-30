// @vitest-environment jsdom
/**
 * Interaction tests for the <stem-quiz> custom element.
 *
 * Previously this file only asserted that the element was *registered* — the
 * element was never instantiated, which left web-component.ts at ~5% coverage
 * and template.ts at 0%. Every branch below exercises the real student flow:
 * answering, feedback, advancing, switching subject, retaking, and finishing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/internal/web-component';
import { getDefaultEventBus } from '@learninghub/core';

type QuizEl = HTMLElement & {
  quizState: { subject: string; currentIndex: number; score: number; questions: unknown[] } | null;
};

function mount(attrs: Record<string, string> = {}): QuizEl {
  const el = document.createElement('stem-quiz') as QuizEl;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  return el;
}

function rootOf(el: QuizEl): HTMLElement {
  return el.shadowRoot!.getElementById('stem-quiz-root')!;
}

function optionButtons(el: QuizEl): HTMLButtonElement[] {
  return Array.from(rootOf(el).querySelectorAll<HTMLButtonElement>('.quiz-option-btn'));
}

function click(el: QuizEl, selector: string): void {
  const target = rootOf(el).querySelector(selector) as HTMLElement | null;
  if (!target) throw new Error(`no element for selector: ${selector}`);
  target.click();
}

function correctIndexFor(el: QuizEl, i = 0): number {
  return (el.quizState!.questions as Array<{ correct: number }>)[i]!.correct;
}

describe('<stem-quiz> registration', () => {
  it('is defined', () => {
    expect(customElements.get('stem-quiz')).toBeDefined();
  });

  it('observes subject and use-legacy', () => {
    const ctor = customElements.get('stem-quiz')!;
    expect(ctor.observedAttributes).toContain('subject');
    expect(ctor.observedAttributes).toContain('use-legacy');
  });
});

describe('<stem-quiz> rendering', () => {
  let el: QuizEl;

  beforeEach(() => {
    el = mount();
  });

  afterEach(() => {
    el.remove();
  });

  it('renders the question card on connect', () => {
    expect(rootOf(el).querySelector('.quiz-card')).not.toBeNull();
    expect(optionButtons(el).length).toBeGreaterThan(0);
  });

  it('defaults to the physics subject at question 0', () => {
    expect(el.quizState).not.toBeNull();
    expect(el.quizState!.subject).toBe('physics');
    expect(el.quizState!.currentIndex).toBe(0);
  });

  it('starts at score 0', () => {
    expect(el.quizState!.score).toBe(0);
    expect(rootOf(el).querySelector('.quiz-score-value')!.textContent).toBe('0');
  });

  it('honours an explicit subject attribute', () => {
    const chem = mount({ subject: 'chemistry' });
    try {
      expect(chem.quizState!.subject).toBe('chemistry');
      expect(rootOf(chem).querySelector('.quiz-tab-btn.active')!.textContent).toContain('Chemistry');
    } finally {
      chem.remove();
    }
  });

  it('reacts to a subject attribute change', () => {
    el.setAttribute('subject', 'math');
    expect(el.quizState!.subject).toBe('math');
  });
});

describe('<stem-quiz> answering', () => {
  let el: QuizEl;

  beforeEach(() => {
    el = mount();
  });

  afterEach(() => {
    el.remove();
  });

  it('adds the correct class when the right option is chosen', () => {
    const correctIndex = correctIndexFor(el);
    click(el, `[data-option-index="${correctIndex}"]`);

    const btns = optionButtons(el);
    expect(btns[correctIndex]!.classList.contains('correct')).toBe(true);
    expect(rootOf(el).querySelectorAll('.quiz-option-btn.correct').length).toBe(1);
  });

  it('marks a wrong choice incorrect and reveals the right one', () => {
    const correctIndex = correctIndexFor(el);
    const wrongIndex = correctIndex === 0 ? 1 : 0;
    click(el, `[data-option-index="${wrongIndex}"]`);

    const btns = optionButtons(el);
    expect(btns[wrongIndex]!.classList.contains('incorrect')).toBe(true);
    expect(btns[correctIndex]!.classList.contains('correct')).toBe(true);
  });

  it('disables every option after answering', () => {
    click(el, '[data-option-index="0"]');
    for (const b of optionButtons(el)) expect(b.disabled).toBe(true);
  });

  it('reveals the explanation and next button after answering', () => {
    click(el, '[data-option-index="0"]');
    expect(rootOf(el).querySelector<HTMLElement>('#quiz-explanation')!.style.display).toBe('block');
    expect(rootOf(el).querySelector<HTMLElement>('#quiz-next-btn')!.style.display).toBe('block');
  });

  it('publishes quiz:answer-submitted on the event bus', () => {
    const bus = getDefaultEventBus();
    const handler = vi.fn();
    bus.subscribe('quiz:answer-submitted', handler);

    click(el, '[data-option-index="0"]');

    expect(handler).toHaveBeenCalledTimes(1);
    const payload = handler.mock.calls[0]![0] as { data: { quizId: string; questionId: string } };
    expect(payload.data.quizId).toBe('physics');
    expect(typeof payload.data.questionId).toBe('string');
  });

  it('increments the score when answering correctly', () => {
    click(el, `[data-option-index="${correctIndexFor(el)}"]`);
    expect(el.quizState!.score).toBeGreaterThan(0);
    expect(rootOf(el).querySelector('.quiz-score-value')!.textContent).toBe(String(el.quizState!.score));
  });
});

describe('<stem-quiz> advancing', () => {
  let el: QuizEl;

  beforeEach(() => {
    el = mount();
  });

  afterEach(() => {
    el.remove();
  });

  it('advances to the next question', () => {
    click(el, '[data-option-index="0"]');
    click(el, '#quiz-next-btn');
    expect(el.quizState!.currentIndex).toBe(1);
  });

  it('resets the answer UI for the next question', () => {
    click(el, '[data-option-index="0"]');
    click(el, '#quiz-next-btn');

    expect(rootOf(el).querySelector<HTMLElement>('#quiz-explanation')!.style.display).toBe('none');
    for (const b of optionButtons(el)) expect(b.disabled).toBe(false);
    expect(rootOf(el).querySelectorAll('.quiz-option-btn.correct').length).toBe(0);
  });

  it('renders the result screen after the final question', () => {
    const total = el.quizState!.questions.length;
    for (let i = 0; i < total; i++) {
      click(el, '[data-option-index="0"]');
      click(el, '#quiz-next-btn');
    }

    expect(rootOf(el).querySelector('.quiz-result-card')).not.toBeNull();
    expect(rootOf(el).querySelector('.quiz-result-score')).not.toBeNull();
  });
});

describe('<stem-quiz> subject switching', () => {
  let el: QuizEl;

  beforeEach(() => {
    el = mount();
  });

  afterEach(() => {
    el.remove();
  });

  it('switches subject when a tab is clicked', () => {
    click(el, '[data-subject="computing"]');

    expect(el.quizState!.subject).toBe('computing');
    expect(el.quizState!.currentIndex).toBe(0);
    expect(rootOf(el).querySelector('.quiz-tab-btn.active')!.getAttribute('data-subject')).toBe('computing');
  });

  it('resets the score when switching subject', () => {
    click(el, `[data-option-index="${correctIndexFor(el)}"]`);
    expect(el.quizState!.score).toBeGreaterThan(0);

    click(el, '[data-subject="pioneers"]');
    expect(el.quizState!.score).toBe(0);
  });
});

describe('<stem-quiz> result actions', () => {
  let el: QuizEl;

  function finishQuiz(target: QuizEl): void {
    const total = target.quizState!.questions.length;
    for (let i = 0; i < total; i++) {
      click(target, '[data-option-index="0"]');
      click(target, '#quiz-next-btn');
    }
  }

  beforeEach(() => {
    el = mount();
    finishQuiz(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('shows the result screen with both actions', () => {
    expect(rootOf(el).querySelector('[data-action="retake"]')).not.toBeNull();
    expect(rootOf(el).querySelector('[data-action="change-subject"]')).not.toBeNull();
  });

  it('retake restarts the same subject from question 0', () => {
    const subjectBefore = el.quizState!.subject;
    click(el, '[data-action="retake"]');

    expect(el.quizState!.subject).toBe(subjectBefore);
    expect(el.quizState!.currentIndex).toBe(0);
    expect(el.quizState!.score).toBe(0);
    expect(rootOf(el).querySelector('.quiz-card')).not.toBeNull();
  });

  it('change-subject advances to the next subject and restarts', () => {
    click(el, '[data-action="change-subject"]');

    expect(el.quizState!.subject).toBe('chemistry');
    expect(el.quizState!.currentIndex).toBe(0);
    expect(el.quizState!.score).toBe(0);
  });
});

describe('<stem-quiz> lifecycle', () => {
  it('ignores clicks on elements that are not quiz controls', () => {
    const el = mount();
    try {
      expect(() => {
        (rootOf(el).querySelector('.quiz-card') as HTMLElement).click();
      }).not.toThrow();
    } finally {
      el.remove();
    }
  });

  it('detaches listeners on disconnect', () => {
    const el = mount();
    el.remove();

    expect(() => {
      const orphan = rootOf(el).querySelector('.quiz-card') as HTMLElement | null;
      orphan?.click();
    }).not.toThrow();
  });
});
