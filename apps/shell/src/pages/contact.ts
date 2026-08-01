import '../styles/main.css';
import '../components/index';
import { initEngines } from '../lib/engine-init';
import { initScrollReveal, initScrollProgress } from '../lib/scroll';
import { initEnrollTriggers } from '../lib/enroll';
import { initContactForm } from '../lib/interactive';
import { initHoverEffects } from '../lib/hover-effects';

initEngines('contact');
initEnrollTriggers();
initScrollReveal();
initScrollProgress();
initContactForm();
initHoverEffects();
