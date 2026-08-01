import { STEM_PIONEERS } from '../data/pioneers';

const STORAGE_KEY = 'stem_dyk_minimized';
const ROTATE_MS = 28000;

export class DidYouKnowWidget extends HTMLElement {
  #index = Math.floor(Math.random() * STEM_PIONEERS.length);
  #minimized = false;
  #root: HTMLElement | null = null;
  #name: HTMLElement | null = null;
  #field: HTMLElement | null = null;
  #fact: HTMLElement | null = null;
  #avatar: HTMLElement | null = null;
  #toggle: HTMLButtonElement | null = null;
  #interval: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    try {
      this.#minimized = localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      this.#minimized = false;
    }

    this.innerHTML = `
      <div class="dyk-widget${this.#minimized ? ' minimized' : ''}">
        <div class="dyk-header" data-header>
          <span class="dyk-tag"><icon-lightbulb name="lightbulb"></icon-lightbulb> STEM Did You Know?</span>
          <button type="button" class="dyk-toggle" data-toggle aria-expanded="${!this.#minimized}" aria-label="${this.#minimized ? 'Expand panel' : 'Collapse panel'}">
            <icon-chevronDown name="chevronDown" class="chev"></icon-chevronDown>
          </button>
        </div>
        <div class="dyk-pioneer" data-pioneer>
          <div class="dyk-avatar" data-avatar></div>
            <div class="dyk-info">
              <div class="dyk-name"><span data-name></span> <span class="dyk-era"></span></div>
              <div class="dyk-field" data-field></div>
              <div class="dyk-fact" data-fact></div>
            </div>
        </div>
        <div class="dyk-footer" data-footer>
          <button type="button" class="dyk-next-btn" data-next>
            <icon-dice name="dice"></icon-dice> Next Pioneer Fact
          </button>
          <span class="dyk-footnote">STEM Pioneer Spotlight</span>
        </div>
      </div>
    `;

    this.#root = this.querySelector('.dyk-widget');
    this.#name = this.querySelector('[data-name]');
    this.#field = this.querySelector('[data-field]');
    this.#fact = this.querySelector('[data-fact]');
    this.#avatar = this.querySelector('[data-avatar]');
    this.#toggle = this.querySelector('[data-toggle]');
    const next = this.querySelector('[data-next]') as HTMLButtonElement | null;

    this.#renderPioneer();

    this.addEventListener('click', this.#handleClick);
    next?.addEventListener('click', this.#handleNext);

    this.#startRotation();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.#handleClick);
    this.#stopRotation();
  }

  #handleClick = (e: Event): void => {
    const toggle = (e.target as HTMLElement).closest('[data-toggle]');
    if (toggle) {
      this.#toggleMinimized();
    }
  };

  #handleNext = (e: Event): void => {
    e.stopPropagation();
    let nextIdx = this.#index;
    while (nextIdx === this.#index && STEM_PIONEERS.length > 1) {
      nextIdx = Math.floor(Math.random() * STEM_PIONEERS.length);
    }
    this.#index = nextIdx;
    this.#renderPioneer();
  };

  #toggleMinimized(): void {
    this.#minimized = !this.#minimized;
    try {
      localStorage.setItem(STORAGE_KEY, String(this.#minimized));
    } catch {
      /* storage unavailable */
    }
    this.#root?.classList.toggle('minimized', this.#minimized);
    this.#toggle?.setAttribute('aria-expanded', String(!this.#minimized));
    this.#toggle?.setAttribute('aria-label', this.#minimized ? 'Expand panel' : 'Collapse panel');
  }

  #renderPioneer(): void {
    const pioneer = STEM_PIONEERS[this.#index];
    if (!pioneer) return;
    if (this.#avatar) {
      this.#avatar.innerHTML = `<icon-${pioneer.icon} name="${pioneer.icon}"></icon-${pioneer.icon}>`;
    }
    if (this.#name) {
      this.#name.textContent = pioneer.name;
    }
    const eraEl = this.#root?.querySelector('.dyk-era');
    if (eraEl) eraEl.textContent = `(${pioneer.era})`;
    if (this.#field) {
      this.#field.innerHTML = `<icon-book name="book"></icon-book> ${pioneer.field}`;
    }
    if (this.#fact) {
      this.#fact.textContent = pioneer.didYouKnow;
    }
  }

  #startRotation(): void {
    this.#stopRotation();
    this.#interval = setInterval(() => {
      if (!this.#minimized) {
        this.#handleNext(new Event('click'));
      }
    }, ROTATE_MS);
  }

  #stopRotation(): void {
    if (this.#interval !== null) {
      clearInterval(this.#interval);
      this.#interval = null;
    }
  }
}
