import { openEnrollModal } from '../components/site-header';

export function initEnrollTriggers(): void {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest('[data-open-enroll]') as HTMLElement | null;
    if (!target) return;
    openEnrollModal(target.getAttribute('data-open-enroll') ?? 'Class');
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const target = (e.target as HTMLElement).closest('[data-open-enroll]') as HTMLElement | null;
    if (!target) return;
    e.preventDefault();
    openEnrollModal(target.getAttribute('data-open-enroll') ?? 'Class');
  });
}
