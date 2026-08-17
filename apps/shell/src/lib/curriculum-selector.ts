/**
 * Curriculum selection and learning path display.
 *
 * Allows learners to select their curriculum and grade, then displays
 * a personalized learning path based on the curriculum mapping.
 */

import { generateLearningPath } from './learning-path';
import { mapLhsEntitiesToLessons } from '@stem-tuition/content-provider';
import { loadKnowledge } from './lhs-adapter';
import { getAvailableCurricula } from '../data/curriculum-mappings';
import type { CurriculumId } from '../data/curriculum-mappings';
import knowledge from '../../../../../LearningHubSTEM/exports/knowledge.json';

const MOUNT_ID = 'curriculumSelectorMount';

export function initCurriculumSelector(): void {
  const mount = document.getElementById(MOUNT_ID);
  if (!mount) return;

  const curricula = getAvailableCurricula();
  const curriculumOptions = curricula
    .map((c) => `<option value="${c.id}">${c.name} — ${c.region}</option>`)
    .join('');

  mount.innerHTML = `
    <div class="curriculum-selector">
      <h2>Choose Your Learning Path</h2>
      <p class="subtitle">Select your curriculum and grade to get a personalized physics learning sequence.</p>
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
        <button id="generatePathBtn" class="btn-primary">Generate Learning Path</button>
      </div>
      <div id="learningPathMount"></div>
    </div>
  `;

  const generateBtn = document.getElementById('generatePathBtn') as HTMLButtonElement | null;
  generateBtn?.addEventListener('click', () => {
    const curriculumSelect = document.getElementById('curriculumSelect') as HTMLSelectElement | null;
    const gradeSelect = document.getElementById('gradeSelect') as HTMLSelectElement | null;
    if (!curriculumSelect || !gradeSelect) return;

    const curriculum = curriculumSelect.value as CurriculumId;
    const grade = parseInt(gradeSelect.value, 10);

    if (!curriculum) {
      alert('Please select a curriculum.');
      return;
    }

    // Load LHS knowledge and map to lessons
    loadKnowledge();
    const lessons = mapLhsEntitiesToLessons(knowledge.entities);

    const path = generateLearningPath(curriculum, grade, lessons);
    renderLearningPath(path);
  });
}

function renderLearningPath(path: ReturnType<typeof generateLearningPath>): void {
  const mount = document.getElementById('learningPathMount');
  if (!mount) return;

  if (path.steps.length === 0) {
    mount.innerHTML = `<p class="no-path">No learning path available for this curriculum and grade yet.</p>`;
    return;
  }

  const stepsHtml = path.steps
    .map((step) => {
      const statusClass = `step-${step.status}`;
      const title = step.lesson?.metadata?.displayName || step.curriculumRef;
      return `
        <div class="learning-step ${statusClass}" data-sequence="${step.sequence}">
          <div class="step-number">${step.sequence}</div>
          <div class="step-content">
            <div class="step-title">${title}</div>
            <div class="step-meta">
              <span class="step-depth">${step.depth}</span>
              <span class="step-status">${step.status}</span>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  mount.innerHTML = `
    <div class="learning-path">
      <h3>${path.curriculumName} — Grade ${path.grade}</h3>
      <p class="path-progress">${path.completedSteps} / ${path.totalSteps} completed</p>
      <div class="steps-list">${stepsHtml}</div>
    </div>
  `;
}
