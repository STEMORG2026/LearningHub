import '../styles/main.css';
import '../components/index';
import { getAllEntities, type LhsEntity } from '../lib/lhs-adapter';
import { initScrollReveal, initScrollProgress } from '../lib/scroll';
import { initCosmicBackground } from '../lib/cosmic-background';

function renderEntityCard(entity: LhsEntity): string {
  const equation = entity.equation ? `<div class="lhs-equation">${entity.equation}</div>` : '';
  const misconceptions = (entity.common_misconceptions ?? [])
    .map((m: string) => `<li style="color:#ff6b6b;font-size:0.85rem;margin-bottom:0.2rem;">${m}</li>`)
    .join('');

  return `
    <div class="soft-card lhs-card" data-domain="${entity.domain}" style="margin-bottom:1.2rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
        <span class="subject-pill">${entity.domain.toUpperCase()}</span>
        <span class="detail-pill highlight">${entity.status}</span>
      </div>
      <h3 style="font-size:1.3rem;color:#fff;margin-bottom:0.4rem;">${entity.name}</h3>
      <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:0.8rem;">${entity.definition}</p>
      ${equation}
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.6rem;">
        <span class="prereq-tag">ID: ${entity.id}</span>
        <span class="prereq-tag">Type: ${entity.type}</span>
        ${entity.unit ? `<span class="prereq-tag">Unit: ${entity.unit}</span>` : ''}
      </div>
      ${misconceptions ? `<div style="margin-top:0.8rem;font-size:0.85rem;font-weight:700;color:#ff6b6b;">Common Traps:</div><ul style="padding-left:1.2rem;margin-top:0.2rem;">${misconceptions}</ul>` : ''}
    </div>
  `;
}

function initStemmaExplorer(): void {
  const mount = document.getElementById('stemmaMount');
  const countEl = document.getElementById('entityCount');
  if (!mount) return;

  const entities = getAllEntities();
  if (countEl) countEl.textContent = `${entities.length} Canonical Entities`;

  const renderGrid = (filterDomain: string = 'all') => {
    const filtered = filterDomain === 'all'
      ? entities
      : entities.filter((e) => e.domain.toLowerCase() === filterDomain.toLowerCase());

    mount.innerHTML = filtered.map(renderEntityCard).join('');
  };

  renderGrid();

  document.querySelectorAll('.domain-filter-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.domain-filter-btn').forEach((b) => b.classList.remove('active'));
      const target = e.currentTarget as HTMLElement;
      target.classList.add('active');
      const domain = target.dataset.domain || 'all';
      renderGrid(domain);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStemmaExplorer();
  initScrollReveal();
  initScrollProgress();
  initCosmicBackground();
});
