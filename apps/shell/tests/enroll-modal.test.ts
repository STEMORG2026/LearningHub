import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getDefaultEventBus } from '@learninghub/core';
import { EnrollModal } from '../src/components/enroll-modal';

type EnrollPayload = {
  data: { source: string };
  timestamp: string;
  schemaVersion: string;
};

function polyfillDialog(): void {
  if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    };
  }
}

describe('<enroll-modal>', () => {
  beforeEach(() => {
    polyfillDialog();
    if (!customElements.get('enroll-modal')) {
      customElements.define('enroll-modal', EnrollModal);
    }
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('is registered as a custom element', () => {
    expect(customElements.get('enroll-modal')).toBe(EnrollModal);
  });

  it('opens on the open-enroll document event', () => {
    const el = document.createElement('enroll-modal');
    document.body.appendChild(el);
    const dialog = el.querySelector('dialog') as HTMLDialogElement;
    document.dispatchEvent(new CustomEvent('open-enroll', { detail: { title: 'Grade 11-12' } }));
    expect(dialog.open).toBe(true);
    expect(el.querySelector('[data-title]')!.textContent).toBe('Inquiry: Grade 11-12');
  });

  it('closes via the close button', () => {
    const el = document.createElement('enroll-modal');
    document.body.appendChild(el);
    const dialog = el.querySelector('dialog') as HTMLDialogElement;
    document.dispatchEvent(new CustomEvent('open-enroll'));
    (el.querySelector('[data-close]') as HTMLButtonElement).click();
    expect(dialog.open).toBe(false);
  });

  it('publishes enroll:submitted and closes on valid submit', () => {
    let received: EnrollPayload | null = null;
    getDefaultEventBus().subscribe<EnrollPayload>('enroll:submitted', (p) => {
      received = p;
    });

    const el = document.createElement('enroll-modal');
    document.body.appendChild(el);
    const dialog = el.querySelector('dialog') as HTMLDialogElement;
    document.dispatchEvent(new CustomEvent('open-enroll'));

    const name = el.querySelector('input[name="studentName"]') as HTMLInputElement;
    name.value = 'Aarav Sharma';
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(received).not.toBeNull();
    expect(received!.data.source).toBe('modal');
    expect(dialog.open).toBe(false);
    expect(window.alert).toHaveBeenCalled();
  });
});
