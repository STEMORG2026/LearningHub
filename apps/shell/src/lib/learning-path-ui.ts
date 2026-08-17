/**
 * Learning path UI — wires the learning path to the lesson renderer and simulations.
 */

import { mapLhsEntitiesToLessons, type LessonContent } from '@stem-tuition/content-provider';
import { generateLearningPath } from './learning-path';
import { ProgressTracker } from './progress-tracker';
import { loadKnowledge } from './lhs-adapter';
import { CURRICULUMS, type CurriculumId } from '../data/curriculum-mappings';
import knowledge from '../../../../../LearningHubSTEM/exports/knowledge.json';

const MOUNT_ID = 'learningPathMount';

const SIMULATION_MAP: Record<string, string> = {
  'lhs:phys.newtons-second-law': 'mechanics',
  'lhs:phys.force': 'mechanics',
  'lhs:phys.ohms-law': 'circuit',
  'lhs:phys.voltage': 'circuit',
  'lhs:phys.current': 'circuit',
  'lhs:phys.resistance': 'circuit',
  'lhs:phys.free-fall': 'mechanics',
  'lhs:phys.projectile-motion': 'mechanics',
};

export function initLearningPath(): void {
  const mount = document.getElementById(MOUNT_ID);
  if (!mount) return;

  const tracker = new ProgressTracker();
  const progress = tracker.load();

  if (progress.curriculum && progress.grade > 0) {
    renderLearningPathUI(mount, progress.curriculum as CurriculumId, progress.grade);
  } else {
    renderPathSelector(mount);
  }
}

function renderPathSelector(mount: HTMLElement): void {
  const curricula = Object.values(CURRICULUMS);
  const curriculumOptions = curricula
    .map((c) => `<option value="${c.id}">${c.name} — ${c.region}</option>`)
    .join('');

  mount.innerHTML = `
    <div class="learning-path-selector">
      <h2>Start Learning Physics</h2>
      <p class="subtitle">Choose your curriculum and grade to get a personalized learning path.</p>
      <div class="selector-controls">
        <label>
          Curriculum:
          <select id="curriculumSelect">
            <option value="">— Select —</option>
            ${curriculumOptions}
          </select>
        </label>
        <label>
          Grade:
          <select id="gradeSelect">
            <option value="10">Grade 10</option>
            <option value="9">Grade 9</option>
            <option value="8">Grade 8</option>
          </select>
        </label>
        <button id="startPathBtn" class="btn-primary">Start Learning</button>
      </div>
    </div>
  `;

  const startBtn = document.getElementById('startPathBtn') as HTMLButtonElement | null;
  startBtn?.addEventListener('click', () => {
    const curriculumSelect = document.getElementById('curriculumSelect') as HTMLSelectElement | null;
    const gradeSelect = document.getElementById('gradeSelect') as HTMLSelectElement | null;
    if (!curriculumSelect || !gradeSelect) return;

    const curriculum = curriculumSelect.value as CurriculumId;
    const grade = parseInt(gradeSelect.value, 10);

    if (!curriculum) {
      alert('Please select a curriculum.');
      return;
    }

    const tracker = new ProgressTracker();
    tracker.initPath(curriculum, grade);

    renderLearningPathUI(mount, curriculum, grade);
  });
}

function renderLearningPathUI(mount: HTMLElement, curriculum: CurriculumId, grade: number): void {
  loadKnowledge();
  const lessons = mapLhsEntitiesToLessons(knowledge.entities);
  const path = generateLearningPath(curriculum, grade, lessons);
  const tracker = new ProgressTracker();
  const curriculumInfo = CURRICULUMS[curriculum];

  const stepsHtml = path.steps
    .map((step) => {
      const title = step.lesson?.metadata?.displayName || step.curriculumRef;
      const statusClass = `step-${step.status}`;
      const hasSim = SIMULATION_MAP[step.canonicalId] ? '<span class="sim-badge">Interactive</span>' : '';
      return `
        <div class="learning-step ${statusClass}" data-canonical-id="${step.canonicalId}" data-sequence="${step.sequence}">
          <div class="step-number">${step.sequence}</div>
          <div class="step-content">
            <div class="step-title">${title}</div>
            <div class="step-meta">
              <span class="step-depth">${step.depth}</span>
              <span class="step-status">${step.status}</span>
              ${hasSim}
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  mount.innerHTML = `
    <div class="learning-path-container">
      <div class="path-header">
        <h2>${curriculumInfo.name} — Grade ${grade} Physics</h2>
        <p class="path-progress" id="pathProgress">0 / ${path.totalSteps} completed</p>
      </div>
      <div class="path-layout">
        <div class="path-sidebar">
          <div class="steps-list">${stepsHtml}</div>
        </div>
        <div class="path-main" id="pathMain">
          <div class="lesson-placeholder">
            <p>Select a topic to begin learning.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  mount.querySelectorAll('.learning-step').forEach((stepEl) => {
    stepEl.addEventListener('click', () => {
      const canonicalId = stepEl.getAttribute('data-canonical-id');
      if (!canonicalId) return;

      const lesson = lessons.find((l) => l.metadata.conceptId === canonicalId);
      if (!lesson) return;

      const pathMain = document.getElementById('pathMain');
      if (!pathMain) return;

      renderLesson(pathMain, lesson);
      tracker.startTopic(canonicalId);
      updatePathProgress(mount, tracker, path.totalSteps);
    });
  });
}

function renderLesson(container: HTMLElement, lesson: LessonContent): void {
  const simType = SIMULATION_MAP[lesson.metadata.conceptId];
  const simHtml = simType ? renderSimulation(simType) : '';

  container.innerHTML = `
    <div class="lesson-view">
      <stem-lesson id="lessonComponent"></stem-lesson>
      ${simHtml}
    </div>
  `;

  const lessonComponent = document.getElementById('lessonComponent') as HTMLElement & { setLessonData: (l: LessonContent) => void };
  if (lessonComponent && typeof lessonComponent.setLessonData === 'function') {
    lessonComponent.setLessonData(lesson);
  }
}

function renderSimulation(type: string): string {
  if (type === 'mechanics') {
    return '<div class="sim-container"><stem-mechanics-sim></stem-mechanics-sim></div>';
  }
  if (type === 'circuit') {
    return '<div class="sim-container"><stem-circuit-sim></stem-circuit-sim></div>';
  }
  return '';
}

function updatePathProgress(mount: HTMLElement, tracker: ProgressTracker, totalSteps: number): void {
  const progressEl = mount.querySelector('#pathProgress');
  if (progressEl) {
    const pct = tracker.getCompletionPercentage(totalSteps);
    progressEl.textContent = `${pct}% completed`;
  }
}
