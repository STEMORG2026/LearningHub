import '../styles/main.css';
import '../components/index';
import { initEngines } from '../lib/engine-init';
import { initScrollReveal, initMouseWheelScroll, initScrollProgress } from '../lib/scroll';
import { initClassDetails, initBatchTimings } from '../lib/render';
import { initEnrollTriggers } from '../lib/enroll';
import { initHoverEffects } from '../lib/hover-effects';

initEngines('classes');
initEnrollTriggers();
initScrollReveal();
initMouseWheelScroll();
initScrollProgress();
initClassDetails();
initBatchTimings();
initHoverEffects();
