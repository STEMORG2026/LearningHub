import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HOVER_STYLES } from '@stem-tuition/hover-engine';
import { initHoverEffects } from '../src/lib/hover-effects';

function setFixture(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="card" id="c1"></div>
    <div class="card" id="c2"></div>
    <div class="card" id="c3"></div>
  `;
  document.body.appendChild(container);
  return container;
}

describe('initHoverEffects', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('applies a valid hover style class on mouseenter', () => {
    setFixture();
    initHoverEffects();
    const el = document.getElementById('c1')!;
    el.dispatchEvent(new MouseEvent('mouseenter'));
    const applied = Array.from(el.classList).find((c) => HOVER_STYLES.includes(c as (typeof HOVER_STYLES)[number]));
    expect(applied).toBeDefined();
  });

  it('removes the hover style on mouseleave', () => {
    setFixture();
    initHoverEffects();
    const el = document.getElementById('c1')!;
    el.dispatchEvent(new MouseEvent('mouseenter'));
    el.dispatchEvent(new MouseEvent('mouseleave'));
    expect(Array.from(el.classList).some((c) => HOVER_STYLES.includes(c as (typeof HOVER_STYLES)[number]))).toBe(false);
  });

  it('never repeats a style on consecutive hovers', () => {
    setFixture();
    initHoverEffects();
    const prev: string[] = [];
    for (const id of ['c1', 'c2', 'c3']) {
      const el = document.getElementById(id)!;
      el.dispatchEvent(new MouseEvent('mouseenter'));
      const applied = Array.from(el.classList).find((c) => HOVER_STYLES.includes(c as (typeof HOVER_STYLES)[number]))!;
      expect(applied).not.toBe(prev[prev.length - 1]);
      prev.push(applied);
    }
  });

  it('ignores elements that are not hover targets', () => {
    document.body.innerHTML = '<div id="plain"></div>';
    initHoverEffects();
    const el = document.getElementById('plain')!;
    el.dispatchEvent(new MouseEvent('mouseenter'));
    expect(el.className).toBe('');
  });
});
