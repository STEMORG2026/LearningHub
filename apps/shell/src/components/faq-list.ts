import { FAQ_ITEMS } from '../data/faqs';

export class FaqList extends HTMLElement {
  connectedCallback(): void {
    this.innerHTML = `
      <h2 style="font-size:1.6rem;text-align:center;margin-bottom:1.5rem;">Frequently Asked Questions</h2>
      ${FAQ_ITEMS.map(
        (item, i) => `
        <div class="faq-item" data-faq="${i}">
          <div class="faq-q">
            <span>${item.q}</span>
            <span class="faq-chevron"><icon-chevronDown name="chevronDown"></icon-chevronDown></span>
          </div>
          <div class="faq-a">${item.a}</div>
        </div>
      `,
      ).join('')}
    `;

    this.querySelectorAll('[data-faq]').forEach((item) => {
      item.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    });
  }
}
