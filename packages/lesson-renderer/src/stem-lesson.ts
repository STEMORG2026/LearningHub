/**
 * stem-lesson Web Component — renders a LessonContent as an interactive lesson.
 *
 * Sections are rendered by kind (text, equation, example, misconception, callout).
 * Questions are rendered inline with immediate feedback.
 * Simulations and challenges are placeholders for their respective components.
 */

import type { LessonContent, LessonSection, Question } from '@stem-tuition/content-provider';

const STYLES = `:host{display:block;font-family:'Segoe UI',system-ui,sans-serif;color:#e0e0e0}
.lesson{max-width:800px;margin:0 auto;padding:1rem}
.lesson-header{margin-bottom:2rem;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:1rem}
.lesson-title{font-size:1.8rem;color:#fff;margin:0 0 .5rem}
.lesson-meta{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:.5rem;font-size:.85rem;color:#888}
.meta-pill{background:rgba(0,255,255,0.08);padding:.25rem .6rem;border-radius:12px}
.prereqs{display:flex;gap:.5rem;flex-wrap:wrap}
.prereq-tag{background:rgba(255,255,255,0.06);padding:.2rem .5rem;border-radius:8px;font-size:.8rem}
.section{margin-bottom:1.5rem;padding:1.2rem;border-radius:12px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06)}
.section-text{background:rgba(255,255,255,0.02)}
.section-equation{background:rgba(0,255,255,0.03);border-color:rgba(0,255,255,0.1)}
.section-example{background:rgba(0,255,136,0.03);border-color:rgba(0,255,136,0.1)}
.section-misconception{background:rgba(255,68,68,0.03);border-color:rgba(255,68,68,0.1)}
.section-callout{background:rgba(0,255,255,0.04);border-color:rgba(0,255,255,0.12)}
.section-story{background:linear-gradient(135deg,rgba(255,180,0,0.06),rgba(255,120,0,0.03));border-color:rgba(255,180,0,0.15);border-left:3px solid rgba(255,180,0,0.4)}
.section-narrative{background:rgba(160,120,255,0.04);border-color:rgba(160,120,255,0.12)}
.section-analogy{background:rgba(0,200,150,0.04);border-color:rgba(0,200,150,0.12);border-left:3px solid rgba(0,200,150,0.4)}
.section-fun-fact{background:rgba(255,220,0,0.04);border-color:rgba(255,220,0,0.12)}
.section-try-this{background:rgba(0,180,255,0.04);border-color:rgba(0,180,255,0.12);border-left:3px solid rgba(0,180,255,0.4)}
.section-context{background:rgba(180,180,180,0.03);border-color:rgba(180,180,180,0.08);font-style:italic}
.section-heading{font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;color:#0ff;margin-bottom:.5rem}
.section-heading-story{color:#ffb400}
.section-heading-narrative{color:#a078ff}
.section-heading-analogy{color:#00c896}
.section-heading-fun-fact{color:#ffdc00}
.section-heading-try-this{color:#00b4ff}
.section-heading-context{color:#888}
.section-body{line-height:1.6;font-size:1rem}
.section-body-story{font-size:1.05rem;line-height:1.7}
.section-body-analogy{font-size:1rem;line-height:1.65}
.section-body-narrative{font-size:1rem;line-height:1.65}
.section-body-try-this{font-size:1rem;line-height:1.6}
.section-body-fun-fact{font-size:1rem}
.section-body-context{font-size:.9rem}
.equation-display{font-size:1.3rem;text-align:center;padding:1rem;background:rgba(0,255,255,0.06);border-radius:8px;margin:.5rem 0;font-family:'Courier New',monospace;color:#0ff}
.symbol-display{font-size:.9rem;color:#0f8;text-align:center;margin-top:.3rem}
.misconception-badge{display:inline-block;background:rgba(255,68,68,0.15);color:#f44;padding:.15rem .5rem;border-radius:8px;font-size:.75rem;margin-bottom:.5rem}
.story-intro{display:inline-block;background:rgba(255,180,0,0.15);color:#ffb400;padding:.15rem .5rem;border-radius:8px;font-size:.75rem;margin-bottom:.5rem}
.analogy-badge{display:inline-block;background:rgba(0,200,150,0.15);color:#00c896;padding:.15rem .5rem;border-radius:8px;font-size:.75rem;margin-bottom:.5rem}
.try-this-badge{display:inline-block;background:rgba(0,180,255,0.15);color:#00b4ff;padding:.15rem .5rem;border-radius:8px;font-size:.75rem;margin-bottom:.5rem}
.fun-fact-badge{display:inline-block;background:rgba(255,220,0,0.15);color:#ffdc00;padding:.15rem .5rem;border-radius:8px;font-size:.75rem;margin-bottom:.5rem}
.section-number{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:rgba(0,255,255,0.1);font-size:.75rem;color:#0ff;margin-right:.5rem}
.qa-section{margin-top:2rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,0.1)}
.qa-title{font-size:1.2rem;color:#fff;margin-bottom:1rem}
.question-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1.2rem;margin-bottom:1rem}
.question-text{font-size:1rem;margin-bottom:1rem;line-height:1.5}
.options-list{display:flex;flex-direction:column;gap:.5rem}
.option-btn{display:flex;align-items:center;gap:.8rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:.7rem 1rem;color:#d0d0d0;cursor:pointer;font-size:.95rem;text-align:left;transition:all .2s;width:100%}
.option-btn:hover:not(:disabled){background:rgba(0,255,255,0.06);border-color:rgba(0,255,255,0.3)}
.option-btn:disabled{cursor:default}
.option-btn.correct{background:rgba(0,255,136,0.12);border-color:#0f8;color:#0f8}
.option-btn.incorrect{background:rgba(255,68,68,0.12);border-color:#f44;color:#f44}
.option-prefix{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.06);font-size:.8rem;font-weight:700;flex-shrink:0}
.explanation-box{margin-top:1rem;padding:1rem;background:rgba(0,255,255,0.06);border:1px solid rgba(0,255,255,0.15);border-radius:10px;font-size:.9rem;line-height:1.5;display:none}
.explanation-box.visible{display:block}
.feedback-msg{margin-top:.5rem;font-weight:600}
.feedback-msg.correct{color:#0f8}
.feedback-msg.incorrect{color:#f44}
.section-heading-row{display:flex;align-items:center;justify-content:space-between}
.badge-core{background:rgba(0,255,255,0.12);color:#0ff}
.badge-extended{background:rgba(255,255,136,0.12);color:#ff8}
.badge-optional{background:rgba(255,255,255,0.1);color:#888}
.badge{font-size:.7rem;padding:.2rem .5rem;border-radius:8px;text-transform:uppercase;letter-spacing:.5px}
.applications{margin-top:2rem;padding:1.2rem;background:rgba(0,255,136,0.03);border-radius:12px;border:1px solid rgba(0,255,136,0.1)}
.applications-title{font-size:.9rem;color:#0f8;margin-bottom:.8rem;text-transform:uppercase;letter-spacing:.5px}
.applications-list{display:flex;flex-direction:column;gap:.5rem}
.app-item{display:flex;align-items:center;gap:.6rem;font-size:.9rem}
.app-icon{color:#0f8}
.tags{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem}
.tag{background:rgba(255,255,255,0.06);padding:.2rem .5rem;border-radius:8px;font-size:.75rem;color:#888}`;

const template = document.createElement('template');
template.innerHTML = `<style>${STYLES}</style><div id="stem-lesson-root"></div>`;

export class StemLesson extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['lesson-id'];
  }

  #root: HTMLElement | null = null;
  #lesson: LessonContent | null = null;
  #answeredQuestions: Map<string, boolean> = new Map();

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this.#root = shadow.getElementById('stem-lesson-root');
  }

  connectedCallback(): void {
    this.#render();
  }

  setLessonData(lesson: LessonContent): void {
    this.#lesson = lesson;
    this.#answeredQuestions.clear();
    this.#render();
  }

  #render(): void {
    if (!this.#root) return;

    if (!this.#lesson) {
      this.#root.innerHTML = '<div class="lesson"><p style="color:#888;">Loading lesson...</p></div>';
      return;
    }

    const lesson = this.#lesson;
    const sectionsHtml = lesson.sections.map((s) => this.#renderSection(s)).join('');
    const questionsHtml = lesson.questions.length > 0 ? this.#renderQuestions(lesson.questions) : '';
    const applicationsHtml = this.#renderApplications();
    const tagsHtml = this.#renderTags();

    this.#root.innerHTML = `
      <div class="lesson">
        <div class="lesson-header">
          <h1 class="lesson-title">${lesson.metadata.displayName}</h1>
          <div class="lesson-meta">
            <span class="meta-pill">${lesson.metadata.subject}</span>
            <span class="meta-pill">${lesson.metadata.estimatedTimeMinutes} min</span>
            <span class="meta-pill">${lesson.metadata.gradeLevels.join(', ') ? 'Grades ' + lesson.metadata.gradeLevels.join(', ') : ''}</span>
          </div>
          ${lesson.metadata.prerequisites.length > 0 ? `
            <div class="prereqs">
              <span style="font-size:.8rem;color:#888;">Prerequisites:</span>
              ${lesson.metadata.prerequisites.map(p => `<span class="prereq-tag">${p}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        ${sectionsHtml}
        ${applicationsHtml}
        ${tagsHtml}
        ${questionsHtml}
      </div>
    `;

    this.#attachQuestionListeners();
  }

  #renderSection(section: LessonSection): string {
    const kindClass = `section-${section.kind}`;
    const headingClass = `section-heading-${section.kind}`;

    const heading = section.heading
      ? `<div class="section-heading ${headingClass}">${section.heading}</div>`
      : '';
    const symbol = section.symbol ? `<div class="symbol-display">${section.symbol}</div>` : '';

    if (section.kind === 'equation') {
      return `
        <div class="section ${kindClass}">
          <div class="section-heading-row">
            ${heading}
          </div>
          <div class="equation-display">${section.body}</div>
          ${symbol}
        </div>
      `;
    }

    if (section.kind === 'misconception') {
      return `
        <div class="section ${kindClass}">
          <span class="misconception-badge">Common Misconception</span>
          <div class="section-body">${section.body}</div>
        </div>
      `;
    }

    if (section.kind === 'story') {
      return `
        <div class="section ${kindClass}">
          <span class="story-intro">The Setup</span>
          ${heading}
          <div class="section-body section-body-story">${section.body}</div>
        </div>
      `;
    }

    if (section.kind === 'analogy') {
      return `
        <div class="section ${kindClass}">
          <span class="analogy-badge">Think of It This Way</span>
          ${heading}
          <div class="section-body section-body-analogy">${section.body}</div>
        </div>
      `;
    }

    if (section.kind === 'try-this') {
      return `
        <div class="section ${kindClass}">
          <span class="try-this-badge">Try This</span>
          ${heading}
          <div class="section-body section-body-try-this">${section.body}</div>
        </div>
      `;
    }

    if (section.kind === 'fun-fact') {
      return `
        <div class="section ${kindClass}">
          <span class="fun-fact-badge">Mind-Blowing Fact</span>
          ${heading}
          <div class="section-body section-body-fun-fact">${section.body}</div>
        </div>
      `;
    }

    if (section.kind === 'narrative') {
      return `
        <div class="section ${kindClass}">
          ${heading}
          <div class="section-body section-body-narrative">${section.body}</div>
        </div>
      `;
    }

    if (section.kind === 'context') {
      return `
        <div class="section ${kindClass}">
          ${heading}
          <div class="section-body section-body-context">${section.body}</div>
        </div>
      `;
    }

    return `
      <div class="section ${kindClass}">
        ${heading}
        <div class="section-body">${section.body}</div>
        ${symbol}
      </div>
    `;
  }

  #renderQuestions(questions: Question[]): string {
    const questionCards = questions.map((q, idx) => {
      const optionsHtml = q.options.map((opt, optIdx) => `
        <button class="option-btn" data-question-id="${q.id}" data-option-index="${optIdx}">
          <span class="option-prefix">${String.fromCharCode(65 + optIdx)}</span>
          <span>${opt}</span>
        </button>
      `).join('');

      return `
        <div class="question-card" data-question-id="${q.id}">
          <div class="question-text">
            <span class="section-number">${idx + 1}</span>
            ${q.prompt}
          </div>
          <div class="options-list">${optionsHtml}</div>
          <div class="explanation-box" id="explanation-${q.id}">
            <div class="feedback-msg" id="feedback-${q.id}"></div>
            <div>${q.explanation}</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="qa-section">
        <h2 class="qa-title">Check Your Understanding</h2>
        ${questionCards}
      </div>
    `;
  }

  #renderApplications(): string {
    const apps = this.#lesson?.metadata.commonMisconceptions;
    if (!apps || apps.length === 0) return '';

    const appsList = apps.map(a => `
      <div class="app-item">
        <span class="app-icon">⚠️</span>
        <span>${a}</span>
      </div>
    `).join('');

    return `
      <div class="applications">
        <div class="applications-title">Common Misconceptions</div>
        <div class="applications-list">${appsList}</div>
      </div>
    `;
  }

  #renderTags(): string {
    const tags = this.#lesson?.metadata.tags;
    if (!tags || tags.length === 0) return '';

    return `
      <div class="tags">
        ${tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    `;
  }

  #attachQuestionListeners(): void {
    if (!this.#root) return;

    const buttons = this.#root.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const questionId = target.dataset.questionId;
        const optionIndex = parseInt(target.dataset.optionIndex ?? '', 10);

        if (!questionId || isNaN(optionIndex)) return;

        const question = this.#lesson?.questions.find(q => q.id === questionId);
        if (!question) return;

        // Mark as answered
        if (this.#answeredQuestions.has(questionId)) return;
        this.#answeredQuestions.set(questionId, true);

        const isCorrect = optionIndex === question.correctIndex;
        const card = this.#root?.querySelector(`[data-question-id="${questionId}"]`);
        if (!card) return;

        // Disable all buttons in this card
        card.querySelectorAll('.option-btn').forEach(b => {
          (b as HTMLButtonElement).disabled = true;
        });

        // Highlight correct/incorrect
        const selectedBtn = card.querySelector(`[data-option-index="${optionIndex}"]`);
        const correctBtn = card.querySelector(`[data-option-index="${question.correctIndex}"]`);

        if (isCorrect) {
          selectedBtn?.classList.add('correct');
        } else {
          selectedBtn?.classList.add('incorrect');
          correctBtn?.classList.add('correct');
        }

        // Show explanation
        const explanationBox = card.querySelector(`#explanation-${questionId}`);
        const feedbackMsg = card.querySelector(`#feedback-${questionId}`);
        if (explanationBox) {
          explanationBox.classList.add('visible');
        }
        if (feedbackMsg) {
          feedbackMsg.textContent = isCorrect ? '✓ Correct!' : '✗ Incorrect. The correct answer is highlighted.';
          feedbackMsg.className = `feedback-msg ${isCorrect ? 'correct' : 'incorrect'}`;
        }

        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('lesson:question-answered', {
          detail: { questionId, isCorrect, selectedIndex: optionIndex },
          bubbles: true,
        }));
      });
    });
  }
}

if (!customElements.get('stem-lesson')) {
  customElements.define('stem-lesson', StemLesson);
}
