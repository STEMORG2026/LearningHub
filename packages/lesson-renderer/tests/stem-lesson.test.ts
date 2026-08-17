import { describe, it, expect } from 'vitest';
import { StemLesson } from '../src/stem-lesson';
import type { LessonContent } from '@stem-tuition/content-provider';

const sampleLesson: LessonContent = {
  id: 'lesson-test',
  version: '1.0.0',
  metadata: {
    conceptId: 'test-concept',
    displayName: 'Test Concept',
    subject: 'physics',
    gradeLevels: [10],
    prerequisites: ['prereq1'],
    estimatedTimeMinutes: 10,
    commonMisconceptions: ['misconception1'],
    tags: ['test'],
  },
  sections: [
    { id: 's1', kind: 'text', body: 'Test body' },
    { id: 's2', kind: 'equation', body: 'F = ma', heading: 'Formula', symbol: 'F' },
  ],
  questions: [
    {
      id: 'q1',
      prompt: 'Test question?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      explanation: 'Explanation',
      conceptId: 'test-concept',
      difficulty: 'easy',
    },
  ],
  simulations: [],
};

describe('StemLesson', () => {
  it('defines observedAttributes', () => {
    expect(StemLesson.observedAttributes).toContain('lesson-id');
  });

  it('can be instantiated', () => {
    const el = document.createElement('stem-lesson') as StemLesson;
    expect(el).toBeInstanceOf(HTMLElement);
  });

  it('renders lesson data when set', () => {
    const el = document.createElement('stem-lesson') as StemLesson;
    document.body.appendChild(el);
    el.setLessonData(sampleLesson);
    const shadow = el.shadowRoot;
    expect(shadow?.innerHTML).toContain('Test Concept');
    document.body.removeChild(el);
  });
});
