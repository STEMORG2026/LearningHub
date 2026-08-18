import { getDefaultEventBus } from '@stem-tuition/core';

export class EnrollModal extends HTMLElement {
  #dialog: HTMLDialogElement | null = null;
  #title: HTMLElement | null = null;

  connectedCallback(): void {
    this.innerHTML = `
      <dialog class="modal-card">
        <button type="button" class="modal-close" data-close aria-label="Close">×</button>
        <h3 style="font-size:1.3rem;margin-bottom:0.3rem;" data-title>Enroll in STEM Tuition</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.2rem;">Submit your details for quick admission in Pokhara.</p>
        <form data-form>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" name="studentName" required class="form-input" placeholder="e.g. Aarav Sharma">
          </div>
          <div class="form-group">
            <label>Grade Level</label>
            <select name="studentGrade" class="form-input">
              <option value="Grade 1-8">Grade 1 – 8 (Foundation)</option>
              <option value="Grade 9-10 (SEE)">Grade 9 – 10 (SEE Board)</option>
              <option value="Grade 11-12 (NEB)">Grade 11 – 12 (NEB Science)</option>
              <option value="Cambridge A-Level">Cambridge A-Level</option>
            </select>
          </div>
          <div class="form-group">
            <label>Phone / WhatsApp</label>
            <input type="tel" name="studentPhone" required class="form-input" placeholder="e.g. 98XXXXXXXX">
          </div>
          <button type="submit" class="btn-primary" style="width:100%;justify-content:center;margin-top:0.5rem;">Submit Request <icon-rocket name="rocket"></icon-rocket></button>
        </form>
      </dialog>
    `;

    this.#dialog = this.querySelector('dialog');
    this.#title = this.querySelector('[data-title]');
    const form = this.querySelector('[data-form]') as HTMLFormElement | null;
    const closeBtn = this.querySelector('[data-close]') as HTMLButtonElement | null;

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = form.querySelector('input[name="studentName"]') as HTMLInputElement;
      const name = nameInput?.value ?? '';
      getDefaultEventBus().publish('enroll:submitted', {
        data: { source: this.#dialog?.dataset.source ?? 'modal' },
        timestamp: new Date().toISOString(),
        schemaVersion: '1.0',
      });
      this.#dialog?.close();
      window.alert(`Thank you ${name}! Your request has been logged. Our Pokhara coordinator will get in touch.`);
    });

    closeBtn?.addEventListener('click', () => this.#dialog?.close());

    document.addEventListener('open-enroll', this.#handleOpen);
  }

  disconnectedCallback(): void {
    document.removeEventListener('open-enroll', this.#handleOpen);
  }

  #handleOpen = (e: Event): void => {
    const detail = (e as CustomEvent<{ title?: string }>).detail;
    if (this.#title && detail?.title) {
      this.#title.textContent = `Inquiry: ${detail.title}`;
    }
    this.#dialog?.showModal();
  };
}
