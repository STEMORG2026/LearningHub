import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StemCircuitSim } from '../src/stem-circuit-sim';

describe('StemCircuitSim', () => {
  let el: StemCircuitSim;

  beforeEach(() => {
    el = document.createElement('stem-circuit-sim') as StemCircuitSim;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('can be instantiated', () => {
    expect(el).toBeInstanceOf(HTMLElement);
  });

  it('is a defined custom element', () => {
    expect(customElements.get('stem-circuit-sim')).toBeDefined();
  });

  it('renders the simulation title', () => {
    const shadow = el.shadowRoot;
    expect(shadow?.innerHTML).toContain("Ohm's Law Circuit");
  });

  it('renders voltage and resistance sliders', () => {
    const shadow = el.shadowRoot;
    expect(shadow?.querySelector('#voltageInput')).toBeTruthy();
    expect(shadow?.querySelector('#resistanceInput')).toBeTruthy();
  });

  it('updates voltage value display on input', () => {
    const shadow = el.shadowRoot;
    const voltageInput = shadow?.querySelector('#voltageInput') as HTMLInputElement;
    const voltageValue = shadow?.querySelector('#voltageValue');
    voltageInput.value = '18';
    voltageInput.dispatchEvent(new Event('input'));
    expect(voltageValue?.textContent).toBe('18 V');
  });

  it('runs simulation and shows current', () => {
    const shadow = el.shadowRoot;
    const runBtn = shadow?.querySelector('#runBtn') as HTMLButtonElement;
    runBtn.click();
    const ammeter = shadow?.querySelector('.meter-ammeter');
    expect(ammeter?.textContent).toContain('I =');
    expect(ammeter?.textContent).toContain('A');
  });

  it('dispatches simulation:complete event', () => {
    const handler = vi.fn();
    el.addEventListener('simulation:complete', handler);
    const shadow = el.shadowRoot;
    const runBtn = shadow?.querySelector('#runBtn') as HTMLButtonElement;
    runBtn.click();
    expect(handler).toHaveBeenCalled();
    const detail = handler.mock.calls[0][0].detail;
    expect(detail).toHaveProperty('voltage');
    expect(detail).toHaveProperty('resistance');
    expect(detail).toHaveProperty('current');
    expect(detail.current).toBeCloseTo(detail.voltage / detail.resistance, 5);
  });

  it('shows steady-current feedback and dim resistor for low current', () => {
    const shadow = el.shadowRoot;
    const voltageInput = shadow?.querySelector('#voltageInput') as HTMLInputElement;
    const resistanceInput = shadow?.querySelector('#resistanceInput') as HTMLInputElement;
    voltageInput.value = '5';
    voltageInput.dispatchEvent(new Event('input'));
    resistanceInput.value = '90';
    resistanceInput.dispatchEvent(new Event('input'));

    const runBtn = shadow?.querySelector('#runBtn') as HTMLButtonElement;
    runBtn.click();

    const ammeter = shadow?.querySelector('.meter-ammeter');
    expect(ammeter?.textContent).toContain('I = 0.06 A');
    const resistor = shadow?.querySelector('.resistor-box') as HTMLElement;
    expect(resistor?.style.opacity).toBe('0.5');
    const resultNote = shadow?.querySelector('.result-note');
    expect(resultNote?.textContent).toContain('Current flowing steadily.');
  });
});
