import type { QuizQuestion, QuizResult, SubjectKey, QuizState } from '../types';
import { SUBJECT_LABELS, SUBJECT_ICONS } from '../types';

function subjectTabsHTML(currentSubject: SubjectKey, subjects: SubjectKey[]): string {
  return subjects
    .map(
      (s) => `
      <button class="quiz-tab-btn${s === currentSubject ? ' active' : ''}" data-subject="${s}">
        ${SUBJECT_ICONS[s]} ${SUBJECT_LABELS[s]}
      </button>`,
    )
    .join('');
}

function optionsHTML(q: QuizQuestion): string {
  return q.options
    .map(
      (opt, idx) => `
      <button class="quiz-option-btn" data-option-index="${idx}">
        <span class="quiz-option-prefix">${String.fromCharCode(65 + idx)}</span>
        <span>${opt}</span>
      </button>`,
    )
    .join('');
}

export function renderQuestion(state: QuizState): string {
  const q = state.questions[state.currentIndex];
  if (!q) return '';

  const progressPct = (state.currentIndex / state.questions.length) * 100;
  const subjects: SubjectKey[] = ['physics', 'chemistry', 'math', 'computing', 'pioneers'];

  return `
    <div class="quiz-container">
      <div class="quiz-header">
        <div>
          <span class="section-tag">⚡ Interactive STEM Quiz</span>
          <h3>Test Your STEM Knowledge</h3>
        </div>
        <div class="quiz-score-badge">
          <span>🏆 Score:</span>
          <span class="quiz-score-value">${state.score}</span>
        </div>
      </div>

      <div class="quiz-subject-tabs">
        ${subjectTabsHTML(state.subject, subjects)}
      </div>

      <div class="quiz-progress-bar-bg">
        <div class="quiz-progress-bar-fill" style="width: ${progressPct}%"></div>
      </div>

      <div class="quiz-card">
        <div class="quiz-question-number">
          QUESTION ${state.currentIndex + 1} OF ${state.questions.length}
        </div>
        <div class="quiz-question-title">${q.question}</div>
        <div class="quiz-options">
          ${optionsHTML(q)}
        </div>
        <div class="quiz-explanation-box" id="quiz-explanation" style="display:none;">
          <strong>💡 Explanation:</strong> <span id="quiz-explanation-text">${q.explanation}</span>
        </div>
      </div>

      <div class="quiz-footer">
        <span class="quiz-footer-hint">Select your answer above</span>
        <button class="quiz-next-btn" id="quiz-next-btn" style="display:none;">
          Next Question →
        </button>
      </div>
    </div>
  `;
}

export function renderResult(_state: QuizState, result: QuizResult): string {
  return `
    <div class="quiz-container">
      <div class="quiz-result-card">
        <div class="quiz-result-emoji">🎉</div>
        <h2 class="quiz-result-title">${result.title}</h2>
        <p class="quiz-result-message">${result.message}</p>
        <div class="quiz-result-score">${result.percentage}%</div>
        <p class="quiz-result-total">
          Total Score: ${result.score} / ${result.total}
        </p>
        <div class="quiz-result-actions">
          <button class="btn-primary" data-action="retake">
            🔄 Retake Quiz
          </button>
          <button class="btn-secondary" data-action="change-subject">
            🧬 Try Another Subject
          </button>
        </div>
      </div>
    </div>
  `;
}
