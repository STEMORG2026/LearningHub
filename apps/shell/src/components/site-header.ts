import { NAV_LINKS } from '../data/site';

export function openEnrollModal(title: string): void {
  document.dispatchEvent(
    new CustomEvent('open-enroll', { bubbles: true, composed: true, detail: { title } }),
  );
}

export class SiteHeader extends HTMLElement {
  #navLinks: HTMLUListElement | null = null;
  #hamburger: HTMLButtonElement | null = null;

  connectedCallback(): void {
    const active = this.getAttribute('active') ?? '';
    const modalMode = this.hasAttribute('modal');

    this.innerHTML = `
      <nav>
        <a href="index.html" class="nav-logo"><icon-bolt name="bolt"></icon-bolt> LearningHub</a>
        <ul class="nav-links">
          ${NAV_LINKS.map(
            (link) =>
              `<li><a href="${link.href}"${link.key === active ? ' class="active"' : ''}>${link.label}</a></li>`,
          ).join('')}
        </ul>
        <div style="display:flex;align-items:center;gap:0.8rem;">
          <button type="button" class="hamburger" aria-label="Toggle navigation">
            <span></span><span></span><span></span>
          </button>
          ${
            modalMode
              ? `<button type="button" class="nav-cta" data-cta>Enroll Now</button>`
              : `<a href="contact.html" class="nav-cta">Enroll Now</a>`
          }
        </div>
      </nav>
    `;

    this.#navLinks = this.querySelector('.nav-links');
    this.#hamburger = this.querySelector('.hamburger');
    const cta = this.querySelector('[data-cta]') as HTMLButtonElement | null;

    this.#hamburger?.addEventListener('click', () => {
      this.#navLinks?.classList.toggle('open');
    });

    cta?.addEventListener('click', () => {
      openEnrollModal('Quick Enroll');
    });
  }
}
