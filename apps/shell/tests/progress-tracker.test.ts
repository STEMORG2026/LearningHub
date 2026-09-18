import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressTracker, type StudentProgress } from '../src/lib/progress-tracker';

const LEGACY_KEY = 'stem-tuition-progress';
const NEW_KEY = 'learninghub-progress';

function seedProgress(): StudentProgress {
  return {
    studentId: 'anonymous',
    curriculum: 'SEE',
    grade: 10,
    entries: [],
    lastUpdated: new Date().toISOString(),
  };
}

describe('ProgressTracker storage migration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty progress for a fresh user (no keys present)', () => {
    const tracker = new ProgressTracker('student-1');
    const progress = tracker.load();
    expect(progress.studentId).toBe('student-1');
    expect(progress.entries).toEqual([]);
    expect(localStorage.getItem(NEW_KEY)).toBeNull();
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
  });

  it('loads progress stored under the current key directly', () => {
    const progress = seedProgress();
    progress.entries.push({
      canonicalId: 'newton-laws',
      status: 'completed',
      score: 90,
      lastAccessed: new Date().toISOString(),
      timeSpentSeconds: 120,
    });
    localStorage.setItem(NEW_KEY, JSON.stringify(progress));

    const tracker = new ProgressTracker();
    const loaded = tracker.load();
    expect(loaded.entries).toHaveLength(1);
    expect(loaded.entries[0]?.canonicalId).toBe('newton-laws');
  });

  it('adopts and migrates legacy-key progress on first read', () => {
    const progress = seedProgress();
    progress.entries.push({
      canonicalId: 'ohms-law',
      status: 'in_progress',
      score: 40,
      lastAccessed: new Date().toISOString(),
      timeSpentSeconds: 30,
    });
    localStorage.setItem(LEGACY_KEY, JSON.stringify(progress));

    const tracker = new ProgressTracker();
    const loaded = tracker.load();

    expect(loaded.entries).toHaveLength(1);
    expect(loaded.entries[0]?.canonicalId).toBe('ohms-law');
    // Legacy key is removed and content persisted under the new key.
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
    expect(localStorage.getItem(NEW_KEY)).not.toBeNull();
  });

  it('does not double-migrate once the new key exists', () => {
    const current = seedProgress();
    current.entries.push({
      canonicalId: 'current',
      status: 'completed',
      score: 100,
      lastAccessed: new Date().toISOString(),
      timeSpentSeconds: 60,
    });
    localStorage.setItem(NEW_KEY, JSON.stringify(current));

    const legacy = seedProgress();
    legacy.entries.push({
      canonicalId: 'stale-legacy',
      status: 'in_progress',
      score: 10,
      lastAccessed: new Date().toISOString(),
      timeSpentSeconds: 5,
    });
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacy));

    const tracker = new ProgressTracker();
    const loaded = tracker.load();

    expect(loaded.entries).toHaveLength(1);
    expect(loaded.entries[0]?.canonicalId).toBe('current');
    // Legacy key is left untouched when the new key already exists.
    expect(localStorage.getItem(LEGACY_KEY)).not.toBeNull();
  });
});