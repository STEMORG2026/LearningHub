import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  initClassCarousel,
  initLearningModes,
  initPioneerWall,
  initClassDetails,
  initBatchTimings,
  initVideoLessons,
  initNoteResources,
} from '../src/lib/render';
import { CLASS_OFFERINGS, LEARNING_MODES, BATCH_TIMINGS, CLASS_DETAILS } from '../src/data/classes';
import { STEM_PIONEERS } from '../src/data/pioneers';
import { VIDEO_LESSONS, NOTE_RESOURCES } from '../src/data/videos';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

function filterPills(id: string, filters: string[]): void {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<section id="${id}"><div class="filter-pills">${filters
      .map((f) => `<button class="pill-btn ${f === 'all' ? 'active' : ''}" data-filter="${f}">${f}</button>`)
      .join('')}</div></section>`,
  );
}

describe('render templates', () => {
  it('initClassCarousel renders all offerings and filters', () => {
    filterPills('classes', ['all', 'foundation', 'see', 'neb', 'alevel']);
    document.body.insertAdjacentHTML('beforeend', '<div id="classesGridContainer"></div>');
    initClassCarousel();
    expect(document.querySelectorAll('#classesGridContainer .soft-card')).toHaveLength(CLASS_OFFERINGS.length);

    (document.querySelector('[data-filter="neb"]') as HTMLButtonElement).click();
    const shown = document.querySelectorAll('#classesGridContainer .soft-card');
    expect(shown).toHaveLength(CLASS_OFFERINGS.filter((c) => c.cat === 'neb').length);

    (document.querySelector('[data-filter="all"]') as HTMLButtonElement).click();
    expect(document.querySelectorAll('#classesGridContainer .soft-card')).toHaveLength(CLASS_OFFERINGS.length);
  });

  it('initLearningModes renders all modes with nav links', () => {
    document.body.insertAdjacentHTML('beforeend', '<div data-learning-modes></div>');
    initLearningModes();
    expect(document.querySelectorAll('[data-learning-modes] .soft-card')).toHaveLength(LEARNING_MODES.length);
  });

  it('initLearningModes navigates to the mode href on click', () => {
    document.body.insertAdjacentHTML('beforeend', '<div data-learning-modes></div>');
    initLearningModes();

    const nav = document.querySelector<HTMLElement>('[data-learning-modes] [data-nav]')!;
    const href = nav.getAttribute('data-nav')!;

    // jsdom forbids real navigation; capture the assignment instead.
    const original = Object.getOwnPropertyDescriptor(window, 'location');
    const assigned: string[] = [];
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        get href() {
          return '';
        },
        set href(v: string) {
          assigned.push(v);
        },
      },
    });

    try {
      nav.click();
    } finally {
      if (original) Object.defineProperty(window, 'location', original);
    }

    expect(assigned).toEqual([href]);
  });

  it('initLearningModes falls back to videos.html when data-nav is empty', () => {
    document.body.insertAdjacentHTML('beforeend', '<div data-learning-modes></div>');
    initLearningModes();

    // Simulate a malformed href, which is what the `?? 'videos.html'` guard
    // exists for: getAttribute returns null for a present-but-empty attribute
    // only when the attribute is truly absent, so remove it to force the null.
    const nav = document.querySelector<HTMLElement>('[data-learning-modes] [data-nav]')!;
    nav.removeAttribute('data-nav');

    const original = Object.getOwnPropertyDescriptor(window, 'location');
    const assigned: string[] = [];
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        get href() {
          return '';
        },
        set href(v: string) {
          assigned.push(v);
        },
      },
    });

    try {
      nav.click();
    } finally {
      if (original) Object.defineProperty(window, 'location', original);
    }

    expect(assigned).toEqual(['videos.html']);
  });

  it('initLearningModes is a no-op when the container is absent', () => {
    expect(() => initLearningModes()).not.toThrow();
  });

  it('initPioneerWall renders all pioneers and filters by field', () => {
    filterPills('pioneers', ['all', 'physics', 'math', 'computing']);
    document.body.insertAdjacentHTML('beforeend', '<div id="pioneerGrid"></div>');
    initPioneerWall();
    expect(document.querySelectorAll('#pioneerGrid .pioneer-card')).toHaveLength(STEM_PIONEERS.length);

    (document.querySelector('[data-filter="math"]') as HTMLButtonElement).click();
    const expected = STEM_PIONEERS.filter((p) => p.fieldKey === 'math').length;
    expect(document.querySelectorAll('#pioneerGrid .pioneer-card')).toHaveLength(expected);
  });

  it('initClassDetails renders detail cards', () => {
    document.body.insertAdjacentHTML('beforeend', '<div id="classDetailsTrack"></div>');
    initClassDetails();
    expect(document.querySelectorAll('#classDetailsTrack .class-detail-card')).toHaveLength(CLASS_DETAILS.length);
  });

  it('initBatchTimings renders timing cards', () => {
    document.body.insertAdjacentHTML('beforeend', '<div id="batchTimingsTrack"></div>');
    initBatchTimings();
    expect(document.querySelectorAll('#batchTimingsTrack .timing-card')).toHaveLength(BATCH_TIMINGS.length);
  });

  it('initVideoLessons renders video cards', () => {
    document.body.insertAdjacentHTML('beforeend', '<div id="videoLessonsTrack"></div>');
    initVideoLessons();
    expect(document.querySelectorAll('#videoLessonsTrack .video-card')).toHaveLength(VIDEO_LESSONS.length);
  });

  it('initNoteResources renders note cards', () => {
    document.body.insertAdjacentHTML('beforeend', '<div id="noteResourcesTrack"></div>');
    initNoteResources();
    expect(document.querySelectorAll('#noteResourcesTrack .note-card')).toHaveLength(NOTE_RESOURCES.length);
  });
});
