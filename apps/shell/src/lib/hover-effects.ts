import {
  initCooldownState,
  pickHoverStyle,
  updateCooldown,
  type CooldownState,
} from '@stem-tuition/hover-engine';

const TARGETS = '.soft-card, .class-detail-card, .timing-card, .video-card, .note-card, .why-card';

export function initHoverEffects(): void {
  const cooldown: CooldownState = initCooldownState();
  document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
    if (el.closest('.quiz-container, .stem-widget, .calc-card')) return;
    const style = pickHoverStyle(cooldown);
    updateCooldown(cooldown, style);
    el.classList.add(style);
  });
}
