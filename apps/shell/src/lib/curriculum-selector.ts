/**
 * Curriculum selection and learning path display.
 *
 * Allows learners to select their curriculum and grade, then displays
 * a personalized learning path based on the curriculum mapping.
 *
 * Architecture:
 * 1. User sees curriculum/grade selector
 * 2. On submit, learning path is generated and displayed inline
 * 3. User clicks a topic → lesson renders with simulation (if available)
 */

import { generateLearningPath } from './learning-path';
import { mapLhsEntitiesToLessons, type LessonContent } from '@stem-tuition/content-provider';
import { loadKnowledge } from './lhs-adapter';
import { CURRICULUMS, getAvailableCurricula, type CurriculumId } from '../data/curriculum-mappings';
import knowledge from '../data/knowledge.json';

const MOUNT_ID = 'curriculumSelectorMount';

// Map canonical IDs to simulation types
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

export function initCurriculumSelector(): void {
  const mount = document.getElementById(MOUNT_ID);
  if (!mount) return;

  renderSelector(mount);
}

function renderSelector(mount: HTMLElement): void {
  const curricula = getAvailableCurricula();
  const curriculumOptions = curricula
    .map((c) => `<option value="${c.id}">${c.name} — ${c.region}</option>`)
    .join('');

  mount.innerHTML = `
    <div class="curriculum-selector">
      <div class="selector-inner">
        <h2>Choose Your Learning Path</h2>
        <p class="subtitle">Select your curriculum and grade to get a personalized physics learning experience.</p>
        <div class="selector-controls">
          <div class="control-group">
            <label for="curriculumSelect">Curriculum</label>
            <select id="curriculumSelect">
              <option value="">— Select —</option>
              ${curriculumOptions}
            </select>
          </div>
          <div class="control-group">
            <label for="gradeSelect">Grade</label>
            <select id="gradeSelect">
              <option value="10">Grade 10</option>
              <option value="9">Grade 9</option>
              <option value="8">Grade 8</option>
            </select>
          </div>
        </div>
        <button id="startPathBtn" class="btn-primary">Generate Learning Path</button>
      </div>
    </div>
    <div id="learningPathMount"></div>
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

    renderLearningPath(curriculum, grade);
  });
}

function renderLearningPath(curriculum: CurriculumId, grade: number): void {
  const mount = document.getElementById('learningPathMount');
  if (!mount) return;

  // Load LHS knowledge and map to lessons
  loadKnowledge();
  const lessons = mapLhsEntitiesToLessons(knowledge.entities);
  const path = generateLearningPath(curriculum, grade, lessons);
  const curriculumInfo = CURRICULUMS[curriculum];

  if (path.steps.length === 0) {
    mount.innerHTML = `<p class="no-path">No learning path available for this curriculum and grade yet.</p>`;
    return;
  }

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
        <div>
          <h3>${curriculumInfo.name} — Grade ${grade}</h3>
          <p class="path-progress" id="pathProgress">${path.totalSteps} topics</p>
        </div>
        <button id="backToSelector" class="btn-secondary">Change Curriculum</button>
      </div>
      <div class="path-layout">
        <div class="path-sidebar">
          <div class="steps-list">${stepsHtml}</div>
        </div>
        <div class="path-main" id="pathMain">
          <div class="lesson-placeholder">
            <div class="placeholder-icon">📚</div>
            <p>Select a topic from the sidebar to begin learning.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Back button handler
  document.getElementById('backToSelector')?.addEventListener('click', () => {
    const selectorMount = document.getElementById(MOUNT_ID);
    if (selectorMount) renderSelector(selectorMount);
  });

  // Step click handlers
  mount.querySelectorAll('.learning-step').forEach((stepEl) => {
    stepEl.addEventListener('click', () => {
      const canonicalId = stepEl.getAttribute('data-canonical-id');
      if (!canonicalId) return;

      const lesson = lessons.find((l) => l.metadata.conceptId === canonicalId);
      if (!lesson) return;

      const pathMain = document.getElementById('pathMain');
      if (!pathMain) return;

      renderLesson(pathMain, lesson);

      // Highlight active step
      mount.querySelectorAll('.learning-step').forEach(s => s.classList.remove('active-step'));
      stepEl.classList.add('active-step');
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

  // Set lesson data on the component
  const lessonComponent = document.getElementById('lessonComponent') as HTMLElement & { setLessonData: (l: LessonContent) => void };
  if (lessonComponent && typeof lessonComponent.setLessonData === 'function') {
    lessonComponent.setLessonData(lesson);
  }
}

function renderSimulation(type: string): string {
  if (type === 'mechanics') {
    return '<div class="sim-container"><h3 style="color:#0ff;margin-bottom:1rem;font-size:1.1rem;">Interactive Simulation</h3><stem-mechanics-sim></stem-mechanics-sim></div>';
  }
  if (type === 'circuit') {
    return '<div class="sim-container"><h3 style="color:#0ff;margin-bottom:1rem;font-size:1.1rem;">Interactive Simulation</h3><stem-circuit-sim></stem-circuit-sim></div>';
  }
  return '';
}
