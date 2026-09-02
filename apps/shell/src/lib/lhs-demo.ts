/**
 * lhs-demo — one vertical slice: Newton's Second Law.
 *
 * Scientific knowledge (name, statement, equation, related entities, misconceptions) is
 * rendered verbatim from the STEMMA export via `lhs-adapter`.
 * The worked example and question are authored HERE — that is STEM-TUITION's pedagogy,
 * clearly separated from the imported knowledge.
 */
import {
  getEntity,
  getExportMetadata,
  getRelatedEntities,
  loadKnowledge,
} from './lhs-adapter';
import type { LhsEntity, LhsRelatedEntity } from './lhs-types';

const LAW_ID = 'lhs:phys.newtons-second-law';

export function initLhsDemo(): void {
  const mount = document.getElementById('lhsDemoMount');
  if (!mount) return;

  const { metadata } = loadKnowledge();
  const law = getEntity(LAW_ID);
  const related = getRelatedEntities(LAW_ID);

  mount.innerHTML = [
    sectionHeader('KNOWLEDGE — imported from STEMMA'),
    lawCard(law),
    relatedEntities(related),
    sectionHeader('LEARNING — authored by STEM-TUITION'),
    pedagogy(),
    exportFooter(metadata),
  ].join('');
}

function sectionHeader(label: string): string {
  return `<div class="lhs-section-label">${label}</div>`;
}

function lawCard(law: LhsEntity): string {
  const equation = law.equation ? `<div class="lhs-equation">${law.equation}</div>` : '';
  const misconceptions = (law.common_misconceptions ?? [])
    .map((m) => `<li class="lhs-misconception">${m}</li>`)
    .join('');
  return `
    <div class="soft-card lhs-card">
      <div class="detail-pill highlight">${law.status}</div>
      <h3 class="class-title">${law.name}</h3>
      <p style="color:var(--text-muted);font-size:0.9rem;">${law.definition}</p>
      ${equation}
      <div class="lhs-meta">
        <span class="subject-pill">id: ${law.id}</span>
        <span class="subject-pill">type: ${law.type}</span>
        <span class="subject-pill">domain: ${law.domain}</span>
      </div>
      ${misconceptions ? `<div class="lhs-mis-title">Common misconceptions (knowledge layer)</div><ul>${misconceptions}</ul>` : ''}
    </div>
  `;
}

function relatedEntities(related: LhsRelatedEntity[]): string {
  const cards = related
    .map(({ entity, relationship }) => {
      const eq = entity.equation ? `<div class="lhs-equation">${entity.equation}</div>` : '';
      const unit = entity.unit ? `<span class="subject-pill">unit: ${entity.unit}</span>` : '';
      const symbol = entity.symbol ? `<span class="subject-pill">symbol: ${entity.symbol}</span>` : '';
      return `
        <div class="soft-card lhs-card lhs-related">
          <div class="lhs-related-name">${entity.name} <span class="lhs-rel-tag">${relationship.type}</span></div>
          ${eq}
          <div class="lhs-meta">${symbol}${unit}</div>
        </div>
      `;
    })
    .join('');
  return `
    <div class="lhs-related-grid">
      <div class="lhs-section-sub">Related entities resolved from the export (${related.length})</div>
      ${cards}
    </div>
  `;
}

function pedagogy(): string {
  return `
    <div class="lhs-grid-two">
      <div class="soft-card lhs-card">
        <div class="lhs-section-sub">Worked example</div>
        <p style="font-size:0.9rem;">A 3.0 kg box on a frictionless floor is pushed with a net
        horizontal force of <strong>12 N</strong>. Find its acceleration.</p>
        <div class="lhs-equation">a = F/m = 12 N / 3.0 kg = 4.0 m/s²</div>
      </div>
      <div class="soft-card lhs-card">
        <div class="lhs-section-sub">Check your understanding</div>
        <p style="font-size:0.9rem;">A 1500 kg car accelerates at <strong>2.0 m/s²</strong>. What is
        the net force acting on it?</p>
        <div class="lhs-equation">F = m·a = 1500 kg × 2.0 m/s² = 3000 N</div>
      </div>
    </div>
  `;
}

function exportFooter(metadata: ReturnType<typeof getExportMetadata>): string {
  if (!metadata) return '';
  return `
    <div class="lhs-footer">
      export_version ${metadata.export_version} · schema_version ${metadata.schema_version} ·
      ${metadata.entity_count} entities · generated ${metadata.generated_at} ·
      source ${metadata.source}
    </div>
  `;
}
