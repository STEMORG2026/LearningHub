import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StemOpticsSim } from '../src/stem-optics-sim';

describe('StemOpticsSim', () => {
  let el: StemOpticsSim;

  beforeEach(() => {
    el = document.createElement('stem-optics-sim') as StemOpticsSim;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('can be instantiated', () => {
    expect(el).toBeInstanceOf(HTMLElement);
  });

  it('is a defined custom element', () => {
    expect(customElements.get('stem-optics-sim')).toBeDefined();
  });

  it('renders the simulation title', () => {
    expect(el.shadowRoot?.innerHTML).toContain('Refraction, Lenses, and Images');
  });

  it('renders prediction options', () => {
    expect(el.shadowRoot?.querySelectorAll('.predict-btn')).toHaveLength(4);
  });

  it('renders all five control sliders', () => {
    const shadow = el.shadowRoot;
    for (const id of ['#n1Input', '#n2Input', '#angleInput', '#focalInput', '#objectInput']) {
      expect(shadow?.querySelector(id)).toBeTruthy();
    }
  });

  it('updates the displayed values on input', () => {
    const shadow = el.shadowRoot;
    const n1 = shadow?.querySelector('#n1Input') as HTMLInputElement;
    const n1Value = shadow?.querySelector('#n1Value');
    const angle = shadow?.querySelector('#angleInput') as HTMLInputElement;
    const angleValue = shadow?.querySelector('#angleValue');

    n1.value = '1.33';
    n1.dispatchEvent(new Event('input'));
    angle.value = '55';
    angle.dispatchEvent(new Event('input'));

    expect(n1Value?.textContent).toBe('1.33');
    expect(angleValue?.textContent).toBe('55');
  });

  it('runs the simulation and reveals the results panel', () => {
    const runBtn = el.shadowRoot?.querySelector('#runBtn') as HTMLButtonElement;
    runBtn.click();
    expect(el.shadowRoot?.querySelector('#results')?.classList.contains('visible')).toBe(true);
  });

  it('computes a real image for the default inputs (f=10, u=30)', () => {
    const runBtn = el.shadowRoot?.querySelector('#runBtn') as HTMLButtonElement;
    runBtn.click();
    const text = el.shadowRoot?.querySelector('#lensResult')?.textContent ?? '';
    expect(text).toContain('15.00');
    expect(text).toContain('real');
    expect(text).toContain('inverted');
  });

  it('reports total internal reflection when the angle exceeds the critical one', () => {
    const shadow = el.shadowRoot;
    const n1 = shadow?.querySelector('#n1Input') as HTMLInputElement;
    const n2 = shadow?.querySelector('#n2Input') as HTMLInputElement;
    const angle = shadow?.querySelector('#angleInput') as HTMLInputElement;

    // Glass -> air at 45°, past the ~41.8° critical angle.
    n1.value = '1.5';
    n2.value = '1';
    angle.value = '45';
    (shadow?.querySelector('#runBtn') as HTMLButtonElement).click();

    expect(shadow?.querySelector('#refractionResult')?.textContent).toContain('Total internal reflection');
    expect(shadow?.querySelector('#readout')?.textContent).toContain('TIR');
  });

  it('reports no image when the object sits at the focal point', () => {
    const shadow = el.shadowRoot;
    const focal = shadow?.querySelector('#focalInput') as HTMLInputElement;
    const object = shadow?.querySelector('#objectInput') as HTMLInputElement;
    focal.value = '10';
    object.value = '10';
    (shadow?.querySelector('#runBtn') as HTMLButtonElement).click();

    expect(shadow?.querySelector('#lensResult')?.textContent).toContain('No image');
  });

  it('dispatches a bubbling simulation:complete event with the optics payload', () => {
    const handler = vi.fn();
    el.addEventListener('simulation:complete', handler);
    (el.shadowRoot?.querySelector('#runBtn') as HTMLButtonElement).click();

    expect(handler).toHaveBeenCalledTimes(1);
    const detail = handler.mock.calls[0][0].detail;
    expect(detail.type).toBe('optics');
    expect(detail).toHaveProperty('n1');
    expect(detail).toHaveProperty('n2');
    expect(detail).toHaveProperty('angle');
    expect(detail).toHaveProperty('imageDistance');
    expect(detail).toHaveProperty('magnification');
    expect(detail).toHaveProperty('predictionCorrect');
    expect(detail).toHaveProperty('totalInternalReflection');
  });

  it('marks a correct prediction and rewards it', () => {
    const shadow = el.shadowRoot;
    const btns = shadow?.querySelectorAll('.predict-btn') as NodeListOf<HTMLButtonElement>;
    btns[0]?.click(); // "bends toward the normal" — the correct answer
    (shadow?.querySelector('#runBtn') as HTMLButtonElement).click();

    expect(btns[0]?.classList.contains('correct')).toBe(true);
    expect(shadow?.querySelector('#comparison')?.innerHTML).toContain('feedback-correct');
  });

  it('marks an incorrect prediction and reveals the correct option', () => {
    const shadow = el.shadowRoot;
    const btns = shadow?.querySelectorAll('.predict-btn') as NodeListOf<HTMLButtonElement>;
    btns[2]?.click(); // "continues straight through" — wrong
    (shadow?.querySelector('#runBtn') as HTMLButtonElement).click();

    expect(btns[2]?.classList.contains('incorrect')).toBe(true);
    expect(btns[0]?.classList.contains('correct')).toBe(true);
    expect(shadow?.querySelector('#comparison')?.innerHTML).toContain('feedback-incorrect');
  });

  it('locks the prediction once the simulation has run', () => {
    const shadow = el.shadowRoot;
    const btns = shadow?.querySelectorAll('.predict-btn') as NodeListOf<HTMLButtonElement>;
    btns[1]?.click();
    (shadow?.querySelector('#runBtn') as HTMLButtonElement).click();

    // Clicking a different option afterwards must not change the selection.
    btns[3]?.click();
    expect(btns[1]?.classList.contains('selected')).toBe(true);
    expect(btns[3]?.classList.contains('selected')).toBe(false);
  });

  it('exposes the pure lens computation for the current inputs', () => {
    // The component's arithmetic is delegating, not duplicating: this must
    // agree with the pure module for the same inputs.
    const result = el.computeLens();
    expect(result).not.toBeNull();
    expect(result === null ? 0 : result.imageDistance).toBeCloseTo(15, 6);
  });

  it('draws the refracted ray below the boundary for a normal case', () => {
    const shadow = el.shadowRoot;
    (shadow?.querySelector('#runBtn') as HTMLButtonElement).click();
    const ray = shadow?.querySelector('#refractedRay') as SVGLineElement;
    // Starts on the boundary (y=110) and descends into the second medium.
    expect(Number(ray.getAttribute('y1'))).toBe(110);
    expect(Number(ray.getAttribute('y2'))).toBeGreaterThan(110);
  });
});
