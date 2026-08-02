import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DidYouKnowWidget } from '../src/components/did-you-know';
import { STEM_PIONEERS } from '../src/data/pioneers';

function mockStorage(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, String(v));
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => {
      store.clear();
    },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

function mount(): DidYouKnowWidget {
  const el = document.createElement('did-you-know') as DidYouKnowWidget;
  document.body.appendChild(el);
  return el;
}

describe('<did-you-know>', () => {
  beforeEach(() => {
    globalThis.localStorage = mockStorage();
    if (!customElements.get('did-you-know')) {
      customElements.define('did-you-know', DidYouKnowWidget);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('is registered as a custom element', () => {
    expect(customElements.get('did-you-know')).toBe(DidYouKnowWidget);
  });

  it('renders a pioneer from the dataset', () => {
    const el = mount();
    const name = el.querySelector('[data-name]')!.textContent!;
    expect(STEM_PIONEERS.some((p) => p.name === name)).toBe(true);
    const fact = el.querySelector('[data-fact]')!.textContent!;
    expect(fact.length).toBeGreaterThan(0);
  });

  it('starts minimized', () => {
    const el = mount();
    expect(el.querySelector('.dyk-widget')!.classList.contains('minimized')).toBe(true);
    const toggle = el.querySelector('.dyk-toggle') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('expands and persists on toggle', () => {
    const el = mount();
    const toggle = el.querySelector('.dyk-toggle') as HTMLButtonElement;
    toggle.click();
    expect(el.querySelector('.dyk-widget')!.classList.contains('minimized')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(localStorage.getItem('stem_dyk_minimized')).toBe('false');
  });

  it('switches to a different pioneer on Next', () => {
    const el = mount();
    const before = el.querySelector('[data-name]')!.textContent;
    (el.querySelector('[data-next]') as HTMLButtonElement).click();
    const after = el.querySelector('[data-name]')!.textContent;
    expect(after).not.toBe(before);
  });
});
