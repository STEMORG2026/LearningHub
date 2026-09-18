import '../styles/main.css';
import '../components/index';
import '@learninghub/quiz-engine';
import { initScrollReveal, initScrollProgress } from '../lib/scroll';
import { initCosmicBackground } from '../lib/cosmic-background';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initScrollProgress();
  initCosmicBackground();
});
