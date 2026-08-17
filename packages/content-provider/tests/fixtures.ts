import type { LessonContent } from '../src/types';

export const sampleLessons: LessonContent[] = [
  {
    id: 'lesson-physics-forces',
    version: '1.0.0',
    metadata: {
      conceptId: 'newtons-second-law',
      displayName: "Newton's Second Law",
      subject: 'physics',
      gradeLevels: [9, 10, 11, 12],
      prerequisites: ['force', 'mass', 'acceleration'],
      estimatedTimeMinutes: 15,
      commonMisconceptions: ['force-is-property-of-object'],
      tags: ['physics', 'mechanics', 'forces'],
    },
    sections: [
      { id: 's1', kind: 'text', body: 'The net force equals rate of change of momentum.' },
      { id: 's2', kind: 'equation', body: 'F = m·a', symbol: 'F' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'What is Newton\'s second law?',
        options: ['F = m·a', 'E = mc²', 'V = IR', 'P = IV'],
        correctIndex: 0,
        explanation: 'Force equals mass times acceleration.',
        conceptId: 'newtons-second-law',
        difficulty: 'easy',
      },
    ],
    simulations: [],
  },
  {
    id: 'lesson-chemistry-acids',
    version: '1.0.0',
    metadata: {
      conceptId: 'ph-scale',
      displayName: 'The pH Scale',
      subject: 'chemistry',
      gradeLevels: [9, 10, 11],
      prerequisites: ['acids', 'bases'],
      estimatedTimeMinutes: 12,
      commonMisconceptions: ['ph-0-is-strongest'],
      tags: ['chemistry', 'acids-bases'],
    },
    sections: [
      { id: 's3', kind: 'text', body: 'pH measures acidity or basicity.' },
    ],
    questions: [],
    simulations: [],
  },
  {
    id: 'lesson-math-pythagoras',
    version: '1.0.0',
    metadata: {
      conceptId: 'pythagorean-theorem',
      displayName: 'Pythagorean Theorem',
      subject: 'mathematics',
      gradeLevels: [8, 9, 10],
      prerequisites: ['squares', 'square-roots'],
      estimatedTimeMinutes: 10,
      commonMisconceptions: ['hypotenuse-is-longest-leg'],
      tags: ['mathematics', 'geometry'],
    },
    sections: [],
    questions: [],
    simulations: [],
  },
];
