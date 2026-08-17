import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StemMechanicsSim } from '../src/stem-mechanics-sim';

describe('StemMechanicsSim', () => {
  let el: StemMechanicsSim;

  beforeEach(() => {
    el = document.createElement('stem-mechanics-sim') as StemMechanicsSim;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('can be instantiated', () => {
    expect(el).toBeInstanceOf(HTMLElement);
  });

  it('is a defined custom element', () => {
    expect(customElements.get('stem-mechanics-sim')).toBeDefined();
  });

  it('renders the simulation title', () => {
    const shadow = el.shadowRoot;
    expect(shadow?.innerHTML).toContain('Force, Mass, and Acceleration');
  });

  it('renders prediction options', () => {
    const shadow = el.shadowRoot;
    const options = shadow?.querySelectorAll('.predict-btn');
    expect(options).toHaveLength(4);
  });

  it('renders force and mass sliders', () => {
    const shadow = el.shadowRoot;
    expect(shadow?.querySelector('#forceInput')).toBeTruthy();
    expect(shadow?.querySelector('#massInput')).toBeTruthy();
  });

  it('updates force value display on input', () => {
    const shadow = el.shadowRoot;
    const forceInput = shadow?.querySelector('#forceInput') as HTMLInputElement;
    const forceValue = shadow?.querySelector('#forceValue');
    forceInput.value = '75';
    forceInput.dispatchEvent(new Event('input'));
    expect(forceValue?.textContent).toBe('75');
  });

  it('updates mass value display and object label on input', () => {
    const shadow = el.shadowRoot;
    const massInput = shadow?.querySelector('#massInput') as HTMLInputElement;
    const massValue = shadow?.querySelector('#massValue');
    const simObject = shadow?.querySelector('#simObject');
    massInput.value = '25';
    massInput.dispatchEvent(new Event('input'));
    expect(massValue?.textContent).toBe('25');
    expect(simObject?.textContent).toBe('m=25');
  });

  it('runs simulation and shows results', () => {
    const shadow = el.shadowRoot;
    const runBtn = shadow?.querySelector('#runBtn') as HTMLButtonElement;
    runBtn.click();
    const results = shadow?.querySelector('#results');
    expect(results?.classList.contains('visible')).toBe(true);
  });

  it('dispatches simulation:complete event', () => {
    const handler = vi.fn();
    el.addEventListener('simulation:complete', handler);
    const shadow = el.shadowRoot;
    const runBtn = shadow?.querySelector('#runBtn') as HTMLButtonElement;
    runBtn.click();
    expect(handler).toHaveBeenCalled();
    const detail = handler.mock.calls[0][0].detail;
    expect(detail).toHaveProperty('force');
    expect(detail).toHaveProperty('mass');
    expect(detail).toHaveProperty('acceleration');
    expect(detail).toHaveProperty('predictionCorrect');
  });
});
