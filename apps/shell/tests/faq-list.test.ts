import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FaqList } from '../src/components/faq-list';
import { FAQ_ITEMS } from '../src/data/faqs';

function mount(): FaqList {
  const el = document.createElement('faq-list');
  document.body.appendChild(el);
  return el;
}

describe('<faq-list>', () => {
  beforeEach(() => {
    if (!customElements.get('faq-list')) {
      customElements.define('faq-list', FaqList);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('is registered as a custom element', () => {
    expect(customElements.get('faq-list')).toBe(FaqList);
  });

  it('renders every FAQ item', () => {
    const el = mount();
    expect(el.querySelectorAll('[data-faq]')).toHaveLength(FAQ_ITEMS.length);
  });

  it('toggles open state on click', () => {
    const el = mount();
    const first = el.querySelector('[data-faq]')!;
    (first as HTMLElement).click();
    expect(first.classList.contains('open')).toBe(true);
    (first as HTMLElement).click();
    expect(first.classList.contains('open')).toBe(false);
  });
});
