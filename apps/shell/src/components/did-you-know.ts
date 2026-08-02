import { STEM_PIONEERS } from '../data/pioneers';

const STORAGE_KEY = 'stem_dyk_minimized';
const ROTATE_MS = 28000;

function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? words[words.length - 1]![0] ?? '' : '';
  return `${first}${last}`.toUpperCase();
}

export class DidYouKnowWidget extends HTMLElement {
  #index = Math.floor(Math.random() * STEM_PIONEERS.length);
  #minimized = true;
  #root: HTMLElement | null = null;
  #avatar: HTMLElement | null = null;
  #name: HTMLElement | null = null;
  #era: HTMLElement | null = null;
  #field: HTMLElement | null = null;
  #fact: HTMLElement | null = null;
  #toggle: HTMLButtonElement | null = null;
  #interval: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    try {
      this.#minimized = localStorage.getItem(STORAGE_KEY) !== 'false';
    } catch {
      this.#minimized = true;
    }

    this.innerHTML = `
      <div class="dyk-widget${this.#minimized ? ' minimized' : ''}" role="complementary" aria-label="STEM Did You Know">
        <div class="dyk-bar" data-toggle>
          <div class="dyk-avatar" data-avatar></div>
          <div class="dyk-bar-name"><span data-name></span><span class="dyk-bar-era" data-era></span></div>
          <button type="button" class="dyk-toggle" data-toggle aria-expanded="${!this.#minimized}" aria-label="${this.#minimized ? 'Maximize panel' : 'Minimize panel'}">
            <icon-chevronDown name="chevronDown" class="chev"></icon-chevronDown>
          </button>
        </div>
        <div class="dyk-body">
          <div class="dyk-header">
            <span class="dyk-tag"><icon-lightbulb name="lightbulb"></icon-lightbulb> STEM Did You Know?</span>
          </div>
          <div class="dyk-field" data-field></div>
          <div class="dyk-fact" data-fact></div>
          <div class="dyk-footer">
            <button type="button" class="dyk-next-btn" data-next>
              <icon-dice name="dice"></icon-dice> Next Pioneer Fact
            </button>
            <span class="dyk-footnote">STEM Pioneer Spotlight</span>
          </div>
        </div>
      </div>
    `;

    this.#root = this.querySelector('.dyk-widget');
    this.#avatar = this.querySelector('[data-avatar]');
    this.#name = this.querySelector('[data-name]');
    this.#era = this.querySelector('[data-era]');
    this.#field = this.querySelector('[data-field]');
    this.#fact = this.querySelector('[data-fact]');
    this.#toggle = this.querySelector('[data-toggle]') as HTMLButtonElement | null;
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
    const bar = (e.target as HTMLElement).closest('[data-toggle]');
    if (bar) {
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
    this.#toggle?.setAttribute('aria-label', this.#minimized ? 'Maximize panel' : 'Minimize panel');
  }

  #renderPioneer(): void {
    const pioneer = STEM_PIONEERS[this.#index];
    if (!pioneer) return;
    if (this.#avatar) {
      this.#avatar.innerHTML = `
        <span class="dyk-monogram">${initialsOf(pioneer.name)}</span>
        <span class="dyk-avatar-icon"><icon-${pioneer.icon} name="${pioneer.icon}"></icon-${pioneer.icon}></span>
      `;
    }
    if (this.#name) {
      this.#name.textContent = pioneer.name;
    }
    if (this.#era) {
      this.#era.textContent = pioneer.era;
    }
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
