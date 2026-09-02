import {
  initCooldownState,
  pickHoverStyle,
  updateCooldown,
  type CooldownState,
} from '@learninghub/hover-engine';

const TARGETS = [
  '.card',
  '.class-card',
  '.why-card',
  '.timing-card',
  '.contact-card',
  '.step',
  '.resource-card',
  '.video-card',
  '.review-card',
  '.quiz-container',
  '.faq-item',
  '.info-panel',
  '.form-container',
  '.social-panel',
  '.grade-selector-card',
  '.subject-card',
  '.curriculum-card',
  '.resource-item',
  '.stat',
  '.detail-block',
  '.class-resources',
  '.hero-banner-card',
  '.section-header-card',
  '.soft-card',
  '.calc-card',
  '.stem-widget',
  '.dyk-widget',
  '.modal-card',
].join(', ');

export function initHoverEffects(): void {
  let cooldown: CooldownState = initCooldownState();
  const applied = new WeakMap<HTMLElement, string>();

  function apply(el: HTMLElement): void {
    const prev = applied.get(el);
    if (prev) el.classList.remove(prev);
    const style = pickHoverStyle(cooldown);
    cooldown = updateCooldown(cooldown, style);
    el.classList.add(style);
    applied.set(el, style);
  }

  function clear(el: HTMLElement): void {
    const prev = applied.get(el);
    if (prev) {
      el.classList.remove(prev);
      applied.delete(el);
    }
  }

  document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
    el.addEventListener('mouseenter', () => apply(el));
    el.addEventListener('mouseleave', () => clear(el));
  });
}
