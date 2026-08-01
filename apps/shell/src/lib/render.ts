import { CLASS_OFFERINGS, LEARNING_MODES, BATCH_TIMINGS, CLASS_DETAILS, type ClassCategory } from '../data/classes';
import { STEM_PIONEERS, type PioneerFilterKey } from '../data/pioneers';
import { VIDEO_LESSONS, NOTE_RESOURCES } from '../data/videos';

function bindFilterPills(sectionId: string, onSelect: (key: string) => void): void {
  const section = document.getElementById(sectionId);
  const pills = section?.querySelectorAll<HTMLButtonElement>('.pill-btn');
  pills?.forEach((btn) => {
    btn.addEventListener('click', () => {
      pills.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      onSelect(btn.dataset.filter ?? 'all');
    });
  });
}

export function initClassCarousel(): void {
  const container = document.getElementById('classesGridContainer');
  if (!container) return;

  const render = (cat: string): void => {
    const list = cat === 'all' ? CLASS_OFFERINGS : CLASS_OFFERINGS.filter((c) => c.cat === (cat as ClassCategory));
    container.innerHTML = list
      .map(
        (c) => `
        <div class="h-scroll-item soft-card" data-open-enroll="${c.title}" role="button" tabindex="0">
          <span class="class-badge">${c.seats}</span>
          <div class="class-icon"><icon-${c.icon} name="${c.icon}"></icon-${c.icon}></div>
          <div class="class-grade">${c.grade}</div>
          <div class="class-title">${c.title}</div>
          <p style="color:var(--text-muted);font-size:0.85rem;">${c.desc}</p>
          <div class="class-subjects">
            ${c.subjects.map((s) => `<span class="subject-pill">${s}</span>`).join('')}
          </div>
        </div>
      `,
      )
      .join('');
  };

  render('all');
  bindFilterPills('classes', render);
}

export function initLearningModes(): void {
  const container = document.querySelector('[data-learning-modes]');
  if (!container) return;

  container.innerHTML = LEARNING_MODES.map((mode) => {
    const attrs = mode.href
      ? `data-nav="${mode.href}" role="link" tabindex="0"`
      : `data-open-enroll="${mode.title}" role="button" tabindex="0"`;
    return `
      <div class="h-scroll-item soft-card" ${attrs}>
        <div class="class-icon"><icon-${mode.icon} name="${mode.icon}"></icon-${mode.icon}></div>
        <div class="class-title">${mode.title}</div>
        <p style="color:var(--text-muted);font-size:0.85rem;">${mode.desc}</p>
      </div>
    `;
  }).join('');

  container.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', () => {
      window.location.href = el.getAttribute('data-nav') ?? 'videos.html';
    });
  });
}

export function initPioneerWall(): void {
  const container = document.getElementById('pioneerGrid');
  if (!container) return;

  const render = (filter: string): void => {
    const list = filter === 'all' ? STEM_PIONEERS : STEM_PIONEERS.filter((p) => p.fieldKey === (filter as PioneerFilterKey));
    container.innerHTML = list
      .map(
        (p) => `
        <div class="h-scroll-item soft-card pioneer-card">
          <div class="pioneer-header">
            <div class="pioneer-icon"><icon-${p.icon} name="${p.icon}"></icon-${p.icon}></div>
            <div>
              <div class="pioneer-title">${p.name}</div>
              <div class="pioneer-era">${p.era}</div>
            </div>
          </div>
          <span class="pioneer-field-badge"><icon-book name="book"></icon-book> ${p.field}</span>
          <div class="pioneer-famous-for"><strong>Famous for:</strong> ${p.famousFor}</div>
          <div class="pioneer-quote">&ldquo;${p.quote}&rdquo;</div>
        </div>
      `,
      )
      .join('');
  };

  render('all');
  bindFilterPills('pioneers', render);
}

export function initClassDetails(): void {
  const container = document.getElementById('classDetailsTrack');
  if (!container) return;

  container.innerHTML = CLASS_DETAILS.map(
    (d) => `
      <div class="class-detail-card soft-card">
        <div>
          <div class="class-icon"><icon-${d.icon} name="${d.icon}"></icon-${d.icon}></div>
          <span class="detail-pill highlight">${d.pill}</span>
          <h3 style="font-size:1.3rem;margin:0.4rem 0;">${d.title}</h3>
          <p style="color:var(--text-muted);font-size:0.88rem;margin-bottom:1rem;">${d.desc}</p>
          <div style="margin-bottom:1rem;">
            <div style="font-size:0.78rem;color:var(--cyan);font-weight:700;margin-bottom:0.3rem;">SUBJECTS</div>
            ${d.subjects.map((s) => `<span class="detail-pill">${s}</span>`).join('')}
          </div>
          <div>
            <div style="font-size:0.78rem;color:var(--green);font-weight:700;margin-bottom:0.3rem;">RESOURCES</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;font-size:0.8rem;">
              ${d.resources
                .map(
                  (r) =>
                    `<a href="${r.href}" target="${r.href.startsWith('http') ? '_blank' : '_self'}" rel="noopener" class="resource-link"><icon-arrowRight name="arrowRight"></icon-arrowRight> ${r.label}</a>`,
                )
                .join('')}
            </div>
          </div>
        </div>
        <button type="button" class="btn-primary" data-open-enroll="${d.pill}" style="margin-top:1.5rem;justify-content:center;text-align:center;">${d.enrollLabel}</button>
      </div>
    `,
  ).join('');
}

export function initBatchTimings(): void {
  const container = document.getElementById('batchTimingsTrack');
  if (!container) return;

  container.innerHTML = BATCH_TIMINGS.map(
    (t) => `
      <div class="timing-card soft-card">
        <div style="font-size:1.2rem;font-weight:700;color:var(--${t.color});">${t.time}</div>
        <div style="font-size:0.95rem;font-weight:700;margin:0.3rem 0;display:inline-flex;align-items:center;gap:0.4rem;"><icon-clock name="clock"></icon-clock> ${t.label}</div>
        <p style="color:var(--text-muted);font-size:0.85rem;">${t.desc}</p>
      </div>
    `,
  ).join('');
}

export function initVideoLessons(): void {
  const container = document.getElementById('videoLessonsTrack');
  if (!container) return;

  container.innerHTML = VIDEO_LESSONS.map(
    (v) => `
      <div class="video-card soft-card">
        <div class="video-thumb"><icon-${v.icon} name="${v.icon}"></icon-${v.icon}></div>
        <div style="font-size:0.75rem;color:var(--${v.subjectColor});font-weight:700;">${v.subject}</div>
        <div style="font-weight:700;font-size:1.1rem;margin:0.2rem 0 0.4rem;">${v.title}</div>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1rem;">${v.desc}</p>
        <a href="${v.href}" target="_blank" rel="noopener" class="btn-primary" style="padding:0.6rem 1.2rem;font-size:0.85rem;"><icon-play name="play"></icon-play> Watch on YouTube</a>
      </div>
    `,
  ).join('');
}

export function initNoteResources(): void {
  const container = document.getElementById('noteResourcesTrack');
  if (!container) return;

  container.innerHTML = NOTE_RESOURCES.map(
    (n) => `
      <div class="note-card soft-card">
        <div style="font-size:1.8rem;margin-bottom:0.5rem;"><icon-${n.icon} name="${n.icon}"></icon-${n.icon}></div>
        <div style="font-size:0.75rem;color:var(--${n.gradeColor});font-weight:700;">${n.grade}</div>
        <div style="font-size:1.1rem;font-weight:700;margin:0.2rem 0 0.4rem;">${n.title}</div>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1rem;">${n.desc}</p>
        <a href="${n.href}" class="resource-link" style="color:var(--${n.gradeColor});font-weight:700;font-size:0.85rem;"><icon-download name="download"></icon-download> Download Drive PDF</a>
      </div>
    `,
  ).join('');
}
