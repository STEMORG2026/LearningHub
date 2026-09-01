import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Import after mock
import { ProgressTracker } from '../src/lib/progress-tracker';
import { generateLearningPath } from '../src/lib/learning-path';
import { mapLhsEntitiesToLessons } from '@stem-tuition/content-provider';
import type { LhsEntity } from '@stem-tuition/content-provider';

const mockEntities: LhsEntity[] = [
  { id: 'lhs:phys.force', name: 'Force', type: 'concept', domain: 'physics', status: 'draft', definition: 'A force', provenance: { ai_drafted: true }, relationships: [] },
  { id: 'lhs:phys.energy', name: 'Energy', type: 'concept', domain: 'physics', status: 'draft', definition: 'Energy', provenance: { ai_drafted: true }, relationships: [] },
  { id: 'lhs:phys.ohms-law', name: "Ohm's Law", type: 'law', domain: 'physics', status: 'draft', definition: 'V=IR', provenance: { ai_drafted: true }, relationships: [] },
];

describe('ProgressTracker', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('initializes with no progress', () => {
    const tracker = new ProgressTracker();
    const progress = tracker.load();
    expect(progress.entries).toHaveLength(0);
  });

  it('initializes a new path', () => {
    const tracker = new ProgressTracker();
    tracker.initPath('nepal_see', 10);
    const progress = tracker.load();
    expect(progress.curriculum).toBe('nepal_see');
    expect(progress.grade).toBe(10);
  });

  it('starts a topic', () => {
    const tracker = new ProgressTracker();
    tracker.initPath('nepal_see', 10);
    tracker.startTopic('lhs:phys.force');
    const progress = tracker.load();
    expect(progress.entries).toHaveLength(1);
    expect(progress.entries[0]!.canonicalId).toBe('lhs:phys.force');
    expect(progress.entries[0]!.status).toBe('in_progress');
  });

  it('completes a topic with score', () => {
    const tracker = new ProgressTracker();
    tracker.initPath('nepal_see', 10);
    tracker.startTopic('lhs:phys.force');
    tracker.completeTopic('lhs:phys.force', 85);
    const progress = tracker.load();
    expect(progress.entries[0]!.status).toBe('completed');
    expect(progress.entries[0]!.score).toBe(85);
  });

  it('calculates completion percentage', () => {
    const tracker = new ProgressTracker();
    tracker.initPath('nepal_see', 10);
    tracker.completeTopic('lhs:phys.force', 100);
    tracker.completeTopic('lhs:phys.energy', 90);
    expect(tracker.getCompletionPercentage(10)).toBe(20);
  });

  it('resets progress', () => {
    const tracker = new ProgressTracker();
    tracker.initPath('nepal_see', 10);
    tracker.startTopic('lhs:phys.force');
    tracker.reset();
    const progress = tracker.load();
    expect(progress.entries).toHaveLength(0);
  });
});

describe('LearningPath', () => {
  const lessons = mapLhsEntitiesToLessons(mockEntities);

  it('generates a path for Nepal SEE Grade 10', () => {
    const path = generateLearningPath('nepal_see', 10, lessons);
    expect(path.curriculum).toBe('nepal_see');
    expect(path.grade).toBe(10);
    expect(path.steps.length).toBeGreaterThan(0);
    expect(path.totalSteps).toBe(path.steps.length);
  });

  it('generates a path for CBSE Grade 10', () => {
    const path = generateLearningPath('cbse', 10, lessons);
    expect(path.curriculum).toBe('cbse');
    expect(path.steps.length).toBeGreaterThan(0);
  });

  it('returns empty path for unknown curriculum', () => {
    const path = generateLearningPath('unknown' as never, 10, lessons);
    expect(path.steps.length).toBe(0);
  });

  it('first step is available', () => {
    const path = generateLearningPath('nepal_see', 10, lessons);
    expect(path.steps[0]!.status).toBe('available');
  });

  it('remaining steps are locked', () => {
    const path = generateLearningPath('nepal_see', 10, lessons);
    expect(path.steps[1]!.status).toBe('locked');
  });

  it('resolves lesson data for steps', () => {
    const path = generateLearningPath('nepal_see', 10, lessons);
    const stepWithLesson = path.steps.find(s => s.lesson !== undefined);
    expect(stepWithLesson).toBeDefined();
    expect(stepWithLesson!.lesson!.metadata.displayName).toBeTruthy();
  });

  it('generates a dedicated NEB Grade 11 senior-secondary path (exact match)', () => {
    const path = generateLearningPath('neb_nepal', 11, lessons);
    expect(path.curriculum).toBe('neb_nepal');
    expect(path.grade).toBe(11);
    expect(path.resolvedGrade).toBe(11);
    expect(path.subject).toBe('physics');
    expect(path.steps.length).toBeGreaterThan(0);
  });

  it('generates a dedicated NEB Grade 12 senior-secondary path (exact match)', () => {
    const path = generateLearningPath('neb_nepal', 12, lessons);
    expect(path.curriculum).toBe('neb_nepal');
    expect(path.grade).toBe(12);
    expect(path.resolvedGrade).toBe(12);
    expect(path.steps.length).toBeGreaterThan(0);
  });

  it('falls back to nearest syllabus for unauthored senior-secondary grades', () => {
    // A curriculum with only a Grade-10 mapping served for Grade 12 keeps working,
    // exposing resolvedGrade < grade so the UI can show a coverage notice.
    const path = generateLearningPath('cbse', 12, lessons);
    expect(path.steps.length).toBeGreaterThan(0);
    expect(path.resolvedGrade).toBeLessThan(path.grade);
  });
});
