/**
 * Learning path UI — initializes the curriculum selector and learning path.
 *
 * This is the entry point for the interactive learning experience.
 * The curriculum selector handles the full flow: select curriculum → generate path → render lessons.
 */

import { initCurriculumSelector } from './curriculum-selector';

export function initLearningPath(): void {
  // The curriculum selector handles everything now
  initCurriculumSelector();
}
