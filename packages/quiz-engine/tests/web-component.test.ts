// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import '../src/internal/web-component';

describe('<stem-quiz> Web Component', () => {
  it('component is defined', () => {
    expect(customElements.get('stem-quiz')).toBeDefined();
  });

  it('component has observedAttributes', () => {
    const ctor = customElements.get('stem-quiz');
    expect(ctor.observedAttributes).toContain('subject');
    expect(ctor.observedAttributes).toContain('use-legacy');
  });
});
