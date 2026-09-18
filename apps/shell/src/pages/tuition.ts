import '../styles/main.css';
import '../components/index';
import { initEngines } from '../lib/engine-init';
import { initScrollReveal, initScrollProgress } from '../lib/scroll';
import { initEstimator } from '../lib/interactive';
import { initEnrollTriggers } from '../lib/enroll';
import { initHoverEffects } from '../lib/hover-effects';
import { initCosmicBackground } from '../lib/cosmic-background';

document.addEventListener('DOMContentLoaded', () => {
  initEngines('tuition');
  initEnrollTriggers();
  initScrollReveal();
  initScrollProgress();
  initEstimator();
  initHoverEffects();
  initCosmicBackground();
});
