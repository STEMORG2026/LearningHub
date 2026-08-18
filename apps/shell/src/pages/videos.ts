import '../styles/main.css';
import '../components/index';
import { initEngines } from '../lib/engine-init';
import { initScrollReveal, initMouseWheelScroll, initScrollProgress } from '../lib/scroll';
import { initVideoLessons, initNoteResources } from '../lib/render';
import { initEnrollTriggers } from '../lib/enroll';
import { initHoverEffects } from '../lib/hover-effects';
import { initCosmicBackground } from '../lib/cosmic-background';

initEngines('videos');
initEnrollTriggers();
initScrollReveal();
initMouseWheelScroll();
initScrollProgress();
initVideoLessons();
initNoteResources();
initHoverEffects();
initCosmicBackground();
