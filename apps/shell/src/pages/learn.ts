/**
 * Learn page entry point — dedicated interactive learning experience.
 *
 * Wires together:
 * - Curriculum selector (choose curriculum + grade)
 * - Learning path generator (personalized sequence)
 * - Lesson renderer (<stem-lesson>)
 * - Interactive simulations (<stem-mechanics-sim>, <stem-circuit-sim>)
 * - Progress tracking
 */

import '../styles/main.css';
import '../components/index';
import { initEngines } from '../lib/engine-init';
import { initScrollReveal, initScrollProgress } from '../lib/scroll';
import { initHoverEffects } from '../lib/hover-effects';
import { initCosmicBackground } from '../lib/cosmic-background';
import { initEnrollTriggers } from '../lib/enroll';

// Import custom elements (registers them)
import '@stem-tuition/lesson-renderer';
import '@stem-tuition/interactive-simulations';
import '@stem-tuition/quiz-engine';

// Import learning components
import { initCurriculumSelector } from '../lib/curriculum-selector';
import { initLearningPath } from '../lib/learning-path-ui';

initEngines('learn');
initEnrollTriggers();
initScrollReveal();
initScrollProgress();
initHoverEffects();
initCosmicBackground();
initCurriculumSelector();
initLearningPath();
