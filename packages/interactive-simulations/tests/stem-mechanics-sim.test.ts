import { describe, it, expect } from 'vitest';
import '../src/stem-mechanics-sim';

describe('StemMechanicsSim', () => {
  it('can be instantiated', () => {
    const el = document.createElement('stem-mechanics-sim');
    expect(el).toBeInstanceOf(HTMLElement);
  });

  it('is a defined custom element', () => {
    expect(customElements.get('stem-mechanics-sim')).toBeDefined();
  });
});
