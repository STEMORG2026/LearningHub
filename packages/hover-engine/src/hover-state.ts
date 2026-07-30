import { HOVER_STYLES, COOLDOWN_MAX, type HoverStyle, type CooldownState } from './types';

export function initCooldownState(): CooldownState {
  return { queue: [] };
}

export function pickHoverStyle(state: CooldownState): HoverStyle {
  const available = HOVER_STYLES.filter((s) => !state.queue.includes(s));
  const pool: HoverStyle[] = available.length > 0 ? available : [...HOVER_STYLES];
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx]!;
}

export function updateCooldown(state: CooldownState, style: HoverStyle): CooldownState {
  const queue = [...state.queue, style];
  if (queue.length > COOLDOWN_MAX) {
    queue.shift();
  }
  return { queue };
}

export function isStyleInCooldown(state: CooldownState, style: HoverStyle): boolean {
  return state.queue.includes(style);
}
