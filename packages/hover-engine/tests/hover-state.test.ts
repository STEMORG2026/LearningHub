import { describe, it, expect } from 'vitest';
import {
  initCooldownState,
  pickHoverStyle,
  updateCooldown,
  isStyleInCooldown,
} from '../src/hover-state';
import { HOVER_STYLES, COOLDOWN_MAX, type HoverStyle, type CooldownState } from '../src/types';

describe('initCooldownState', () => {
  it('returns an empty queue', () => {
    const state = initCooldownState();
    expect(state.queue).toEqual([]);
  });
});

describe('pickHoverStyle', () => {
  it('returns a valid style from HOVER_STYLES', () => {
    const state = initCooldownState();
    const style = pickHoverStyle(state);
    expect(HOVER_STYLES).toContain(style);
  });

  it('can return every style over repeated calls', () => {
    const state = initCooldownState();
    const picked = new Set<string>();
    for (let i = 0; i < 100; i++) {
      picked.add(pickHoverStyle(state));
    }
    expect(picked.size).toBe(HOVER_STYLES.length);
  });

  it('skips styles currently in cooldown when alternatives exist', () => {
    const state: CooldownState = { queue: ['hover-effect-glow' as HoverStyle] };
    const picked = new Set<string>();
    for (let i = 0; i < 100; i++) {
      picked.add(pickHoverStyle(state));
    }
    expect(picked.has('hover-effect-glow')).toBe(false);
  });

  it('uses the full pool when all styles are in cooldown', () => {
    const state: CooldownState = { queue: [...HOVER_STYLES] };
    const style = pickHoverStyle(state);
    expect(HOVER_STYLES).toContain(style);
  });
});

describe('updateCooldown', () => {
  it('adds a style to the queue', () => {
    const state = initCooldownState();
    const next = updateCooldown(state, 'hover-effect-glow');
    expect(next.queue).toEqual(['hover-effect-glow']);
  });

  it('returns a new object (immutable)', () => {
    const state = initCooldownState();
    const next = updateCooldown(state, 'hover-effect-glow');
    expect(next).not.toBe(state);
  });

  it('maintains a maximum of COOLDOWN_MAX entries', () => {
    const styles: HoverStyle[] = ['hover-effect-glow', 'hover-effect-tint', 'hover-effect-electric', 'hover-effect-borderless', 'hover-effect-warp'];
    let state = initCooldownState();
    for (const s of styles) {
      state = updateCooldown(state, s);
    }
    expect(state.queue.length).toBeLessThanOrEqual(COOLDOWN_MAX);
  });

  it('shifts oldest entry when at capacity', () => {
    const styles: HoverStyle[] = ['hover-effect-glow', 'hover-effect-tint', 'hover-effect-electric', 'hover-effect-borderless', 'hover-effect-warp'];
    let state = initCooldownState();
    for (const s of styles) {
      state = updateCooldown(state, s);
    }
    expect(state.queue).not.toContain('hover-effect-glow');
    expect(state.queue).toContain('hover-effect-warp');
  });

  it('does not mutate the original state', () => {
    const state: CooldownState = { queue: ['hover-effect-glow'] };
    const saved = [...state.queue];
    updateCooldown(state, 'hover-effect-tint');
    expect(state.queue).toEqual(saved);
  });
});

describe('isStyleInCooldown', () => {
  it('returns true when style is in queue', () => {
    const state: CooldownState = { queue: ['hover-effect-glow'] };
    expect(isStyleInCooldown(state, 'hover-effect-glow')).toBe(true);
  });

  it('returns false when style is not in queue', () => {
    const state = initCooldownState();
    expect(isStyleInCooldown(state, 'hover-effect-glow')).toBe(false);
  });
});
