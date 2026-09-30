import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HOVER_STYLES } from '@learninghub/hover-engine';
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

  it('is a no-op when the same element leaves twice', () => {
    setFixture();
    initHoverEffects();
    const el = document.getElementById('c1')!;

    el.dispatchEvent(new MouseEvent('mouseenter'));
    el.dispatchEvent(new MouseEvent('mouseleave'));
    // Second leave: `applied` no longer holds an entry, so the guard must skip
    // the removal and leave the element's class list untouched.
    const afterFirst = el.className;
    el.dispatchEvent(new MouseEvent('mouseleave'));
    expect(el.className).toBe(afterFirst);
  });

  it('leaves without hovering first does not throw', () => {
    setFixture();
    initHoverEffects();
    const el = document.getElementById('c2')!;
    // No preceding mouseenter, so there is no style to remove.
    expect(() => el.dispatchEvent(new MouseEvent('mouseleave'))).not.toThrow();
    expect(el.className).toBe('card');
  });

  it('replaces the previous style rather than stacking classes', () => {
    setFixture();
    initHoverEffects();
    const el = document.getElementById('c1')!;

    el.dispatchEvent(new MouseEvent('mouseenter'));
    el.dispatchEvent(new MouseEvent('mouseenter'));

    const hoverClasses = Array.from(el.classList).filter((c) =>
      HOVER_STYLES.includes(c as (typeof HOVER_STYLES)[number]),
    );
    expect(hoverClasses).toHaveLength(1);
  });

  it('re-hover after a leave works and applies exactly one style', () => {
    setFixture();
    initHoverEffects();
    const el = document.getElementById('c3')!;

    el.dispatchEvent(new MouseEvent('mouseenter'));
    el.dispatchEvent(new MouseEvent('mouseleave'));
    el.dispatchEvent(new MouseEvent('mouseenter'));

    const hoverClasses = Array.from(el.classList).filter((c) =>
      HOVER_STYLES.includes(c as (typeof HOVER_STYLES)[number]),
    );
    expect(hoverClasses).toHaveLength(1);
  });

  it('handles several targets independently', () => {
    setFixture();
    initHoverEffects();

    const c1 = document.getElementById('c1')!;
    const c2 = document.getElementById('c2')!;
    c1.dispatchEvent(new MouseEvent('mouseenter'));
    c2.dispatchEvent(new MouseEvent('mouseenter'));
    c1.dispatchEvent(new MouseEvent('mouseleave'));

    const styleOf = (el: HTMLElement): string[] =>
      Array.from(el.classList).filter((c) => HOVER_STYLES.includes(c as (typeof HOVER_STYLES)[number]));

    expect(styleOf(c1)).toHaveLength(0);
    expect(styleOf(c2)).toHaveLength(1);
  });
});
