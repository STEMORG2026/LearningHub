import { getDefaultEventBus } from '@learninghub/core';
import type { SubjectKey, QuizState } from '../types';
import { getResultMetadata } from '../types';
import { createQuizState, validateAnswer, advanceQuestion, getCurrentQuestion } from './quiz-engine';
import { renderQuestion, renderResult } from './template';

const STYLES = `.quiz-container{font-family:'Segoe UI',system-ui,sans-serif;max-width:720px;margin:0 auto;color:#e0e0e0}
.quiz-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem}
.section-tag{background:rgba(0,255,255,0.12);color:#0ff;padding:.25rem .75rem;border-radius:20px;font-size:.75rem;font-weight:600;letter-spacing:.5px;display:inline-block}
.quiz-header h3{margin-top:.3rem;font-size:1.25rem;color:#fff}
.quiz-score-badge{background:rgba(0,255,255,0.08);padding:.4rem .8rem;border-radius:12px;font-size:.9rem;display:flex;align-items:center;gap:.4rem}
.quiz-score-value{font-size:1.2rem;color:#0f8;font-weight:700}
.quiz-subject-tabs{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem}
.quiz-tab-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#b0b0b0;padding:.4rem .9rem;border-radius:20px;cursor:pointer;font-size:.8rem;transition:all .2s}
.quiz-tab-btn:hover{background:rgba(0,255,255,0.1);color:#fff}
.quiz-tab-btn.active{background:rgba(0,255,255,0.15);border-color:#0ff;color:#0ff}
.quiz-progress-bar-bg{width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;margin-bottom:1.5rem;overflow:hidden}
.quiz-progress-bar-fill{height:100%;background:linear-gradient(90deg,#0ff,#0f8);border-radius:3px;transition:width .4s ease}
.quiz-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:1.5rem;margin-bottom:1rem}
.quiz-question-number{font-size:.8rem;color:#0ff;font-weight:600;margin-bottom:.5rem}
.quiz-question-title{font-size:1.1rem;color:#fff;line-height:1.5;margin-bottom:1.2rem;font-weight:500}
.quiz-options{display:flex;flex-direction:column;gap:.6rem}
.quiz-option-btn{display:flex;align-items:center;gap:.8rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:.8rem 1rem;color:#d0d0d0;cursor:pointer;font-size:.95rem;text-align:left;transition:all .2s;width:100%}
.quiz-option-btn:hover:not(:disabled){background:rgba(0,255,255,0.06);border-color:rgba(0,255,255,0.3)}
.quiz-option-btn:disabled{cursor:default;opacity:.6}
.quiz-option-btn.correct{background:rgba(0,255,136,0.12);border-color:#0f8;color:#0f8}
.quiz-option-btn.incorrect{background:rgba(255,68,68,0.12);border-color:#f44;color:#f44}
.quiz-option-prefix{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.06);font-size:.8rem;font-weight:700;flex-shrink:0}
.quiz-explanation-box{margin-top:1rem;padding:1rem;background:rgba(0,255,255,0.06);border:1px solid rgba(0,255,255,0.15);border-radius:10px;font-size:.9rem;line-height:1.5;color:#c0e0e0;display:none}
.quiz-explanation-box strong{color:#0ff}
.quiz-footer{display:flex;justify-content:space-between;align-items:center}
.quiz-footer-hint{font-size:.85rem;color:#666}
.quiz-next-btn{background:rgba(0,255,255,0.12);border:1px solid rgba(0,255,255,0.3);color:#0ff;padding:.5rem 1.2rem;border-radius:10px;cursor:pointer;font-size:.9rem;font-weight:600;transition:all .2s}
.quiz-next-btn:hover{background:rgba(0,255,255,0.2)}
.quiz-result-card{text-align:center;padding:2rem 1.5rem}
.quiz-result-emoji{font-size:3rem;margin-bottom:.5rem}
.quiz-result-title{font-size:1.8rem;margin-bottom:.4rem;color:#fff}
.quiz-result-message{color:#888;max-width:450px;margin:0 auto 1.5rem}
.quiz-result-score{font-size:3rem;font-weight:800;color:#0ff;margin-bottom:.5rem}
.quiz-result-total{font-size:1.1rem;color:#0ff;font-weight:600;margin-bottom:2rem}
.quiz-result-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.btn-primary{background:linear-gradient(135deg,rgba(0,255,255,0.2),rgba(0,255,136,0.2));border:1px solid rgba(0,255,255,0.4);color:#fff;padding:.6rem 1.5rem;border-radius:12px;cursor:pointer;font-size:.95rem;font-weight:600;transition:all .2s}
.btn-primary:hover{background:linear-gradient(135deg,rgba(0,255,255,0.3),rgba(0,255,136,0.3))}
.btn-secondary{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#d0d0d0;padding:.6rem 1.5rem;border-radius:12px;cursor:pointer;font-size:.95rem;font-weight:600;transition:all .2s}
.btn-secondary:hover{background:rgba(255,255,255,0.1)}`;

const template = document.createElement('template');
template.innerHTML = `<style>${STYLES}</style><div id="stem-quiz-root"></div>`;

export class StemQuiz extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['subject', 'use-legacy'];
  }

  #state: QuizState | null = null;
  #root: HTMLElement | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this.#root = shadow.getElementById('stem-quiz-root');
  }

  connectedCallback(): void {
    const subject = (this.getAttribute('subject') as SubjectKey) || 'physics';
    this.#state = createQuizState(subject);
    this.#render();
    this.#attachListeners();
  }

  disconnectedCallback(): void {
    this.#detachListeners();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    if (name === 'subject' && value) {
      this.#state = createQuizState(value as SubjectKey);
      this.#render();
    }
  }

  get quizState(): QuizState | null {
    return this.#state;
  }

  #render(): void {
    if (!this.#root || !this.#state) return;
    const currentQuestion = getCurrentQuestion(this.#state);

    if (!currentQuestion) {
      const maxScore = this.#state.questions.length * 10;
      const percentage = Math.round((this.#state.score / maxScore) * 100);
      const result = getResultMetadata(percentage, this.#state.score, maxScore);
      this.#root.innerHTML = renderResult(this.#state, result);
      return;
    }

    this.#root.innerHTML = renderQuestion(this.#state);
  }

  #attachListeners(): void {
    if (!this.#root) return;
    this.#root.addEventListener('click', this.#handleOptionClick);
    this.#root.addEventListener('click', this.#handleNextClick);
    this.#root.addEventListener('click', this.#handleTabClick);
    this.#root.addEventListener('click', this.#handleResultAction);
  }

  #detachListeners(): void {
    if (!this.#root) return;
    this.#root.removeEventListener('click', this.#handleOptionClick);
    this.#root.removeEventListener('click', this.#handleNextClick);
    this.#root.removeEventListener('click', this.#handleTabClick);
    this.#root.removeEventListener('click', this.#handleResultAction);
  }

  #handleOptionClick = (e: Event): void => {
    const btn = (e.target as HTMLElement).closest('.quiz-option-btn') as HTMLButtonElement | null;
    if (!btn || !this.#state) return;

    const index = parseInt(btn.dataset.optionIndex ?? '', 10);
    if (isNaN(index)) return;

    const state = this.#state;
    const { updatedState, answer } = validateAnswer(state, index);
    this.#state = updatedState;

    const question = state.questions[state.currentIndex];
    if (question) {
      const eventBus = getDefaultEventBus();
      eventBus.publish('quiz:answer-submitted', {
        data: {
          quizId: state.subject,
          questionId: question.id,
          answer: question.options[answer.selectedIndex] ?? '',
          timeSpentMs: 0,
          hintUsed: false,
        },
        timestamp: new Date().toISOString(),
        schemaVersion: '1.0',
      });
    }

    this.#applyVisualFeedback(answer.correctIndex, answer.selectedIndex);
  };

  #handleNextClick = (e: Event): void => {
    const btn = (e.target as HTMLElement).closest('.quiz-next-btn') as HTMLButtonElement | null;
    if (!btn || !this.#state) return;

    const { updatedState, isComplete, result } = advanceQuestion(this.#state);
    this.#state = updatedState;

    if (isComplete && result) {
      this.#root!.innerHTML = renderResult(this.#state, result);
    } else {
      this.#render();
    }
  };

  #handleTabClick = (e: Event): void => {
    const btn = (e.target as HTMLElement).closest('.quiz-tab-btn') as HTMLButtonElement | null;
    if (!btn) return;

    const subject = btn.dataset.subject as SubjectKey;
    if (subject) {
      this.#state = createQuizState(subject);
      this.#render();
    }
  };

  #handleResultAction = (e: Event): void => {
    const btn = (e.target as HTMLElement).closest('[data-action]') as HTMLButtonElement | null;
    if (!btn || !this.#state) return;

    const action = btn.dataset.action;

    if (action === 'retake') {
      this.#state = createQuizState(this.#state.subject);
      this.#render();
    } else if (action === 'change-subject') {
      const subjects: SubjectKey[] = ['physics', 'chemistry', 'math', 'computing', 'pioneers'];
      const currentIdx = subjects.indexOf(this.#state.subject);
      const nextSubject = subjects[(currentIdx + 1) % subjects.length]!;
      this.#state = createQuizState(nextSubject);
      this.#render();
    }
  };

  #applyVisualFeedback(correctIndex: number, selectedIndex: number): void {
    if (!this.#root) return;

    const selectedBtn = this.#root.querySelector(`[data-option-index="${selectedIndex}"]`) as HTMLButtonElement | null;
    const correctBtn = this.#root.querySelector(`[data-option-index="${correctIndex}"]`) as HTMLButtonElement | null;

    // Keep the header score in sync with state. Without this the badge stays
    // stale until the next question renders, so a student who answers correctly
    // sees no score change.
    if (this.#state) {
      const scoreEl = this.#root.querySelector('.quiz-score-value');
      if (scoreEl) scoreEl.textContent = String(this.#state.score);
    }

    if (selectedIndex === correctIndex) {
      selectedBtn?.classList.add('correct');
    } else {
      selectedBtn?.classList.add('incorrect');
      correctBtn?.classList.add('correct');
    }

    this.#root.querySelectorAll('.quiz-option-btn').forEach((btn) => {
      (btn as HTMLButtonElement).disabled = true;
    });

    const expBox = this.#root.querySelector('#quiz-explanation') as HTMLElement | null;
    if (expBox) {
      expBox.style.display = 'block';
    }

    const nextBtn = this.#root.querySelector('#quiz-next-btn') as HTMLElement | null;
    if (nextBtn) {
      nextBtn.style.display = 'block';
    }
  }
}

if (!customElements.get('stem-quiz')) {
  customElements.define('stem-quiz', StemQuiz);
}
