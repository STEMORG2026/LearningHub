import { describe, it, expect } from 'vitest';
import { mapQuizQuestionsToLessons } from '../src/quiz-mapper';
import type { QuizQuestionLike } from '../src/quiz-mapper';

describe('mapQuizQuestionsToLessons', () => {
  const quizQuestions: QuizQuestionLike[] = [
    {
      id: 'physics-1',
      subject: 'physics',
      question: "Which of Newton's Laws states action-reaction?",
      options: ['First', 'Second', 'Third', 'Fourth'],
      correct: 2,
      explanation: "Newton's Third Law involves action-reaction pairs.",
      conceptId: 'newtons-third-law',
      displayName: "Newton's Third Law",
      prerequisites: ['force', 'interaction'],
      gradeLevels: [9, 10],
      estimatedTimeMinutes: 2,
      commonMisconceptions: ['action-reaction-cancel'],
      tags: ['physics', 'mechanics'],
    },
    {
      id: 'physics-2',
      subject: 'physics',
      question: 'What is the speed of light?',
      options: ['3×10⁸ m/s', '3×10⁶ m/s', '1.5×10⁸ m/s', '300,000 m/s'],
      correct: 0,
      explanation: 'Light travels at 3×10⁸ m/s in vacuum.',
      conceptId: 'speed-of-light',
      displayName: 'Speed of Light',
      prerequisites: ['waves'],
      gradeLevels: [10, 11],
      estimatedTimeMinutes: 2,
      commonMisconceptions: ['light-instantaneous'],
      tags: ['physics', 'optics'],
    },
    {
      id: 'chemistry-1',
      subject: 'chemistry',
      question: 'What is the pH of pure water?',
      options: ['0', '7', '14', '5.5'],
      correct: 1,
      explanation: 'Pure water has pH 7.',
      conceptId: 'ph-scale',
      displayName: 'pH Scale',
      prerequisites: ['acids', 'bases'],
      gradeLevels: [9, 10, 11],
      estimatedTimeMinutes: 2,
      commonMisconceptions: ['water-is-acidic'],
      tags: ['chemistry', 'acids-bases'],
    },
  ];

  it('groups questions by subject', () => {
    const lessons = mapQuizQuestionsToLessons(quizQuestions);
    expect(lessons).toHaveLength(2); // physics + chemistry
  });

  it('merges tags across questions in same subject', () => {
    const lessons = mapQuizQuestionsToLessons(quizQuestions);
    const physics = lessons.find((l) => l.metadata.subject === 'physics');
    expect(physics!.metadata.tags).toContain('mechanics');
    expect(physics!.metadata.tags).toContain('optics');
  });

  it('merges grade levels across questions', () => {
    const lessons = mapQuizQuestionsToLessons(quizQuestions);
    const physics = lessons.find((l) => l.metadata.subject === 'physics');
    expect(physics!.metadata.gradeLevels).toEqual([9, 10, 11]);
  });

  it('sums estimated time', () => {
    const lessons = mapQuizQuestionsToLessons(quizQuestions);
    const physics = lessons.find((l) => l.metadata.subject === 'physics');
    expect(physics!.metadata.estimatedTimeMinutes).toBe(4); // 2 + 2
  });

  it('maps quiz questions to Question[]', () => {
    const lessons = mapQuizQuestionsToLessons(quizQuestions);
    const physics = lessons.find((l) => l.metadata.subject === 'physics');
    expect(physics!.questions).toHaveLength(2);
    expect(physics!.questions[0]!.prompt).toBe("Which of Newton's Laws states action-reaction?");
    expect(physics!.questions[0]!.correctIndex).toBe(2);
    expect(physics!.questions[0]!.explanation).toBe("Newton's Third Law involves action-reaction pairs.");
  });

  it('creates lesson sections from questions', () => {
    const lessons = mapQuizQuestionsToLessons(quizQuestions);
    const chemistry = lessons.find((l) => l.metadata.subject === 'chemistry');
    // One question = text section + callout section
    expect(chemistry!.sections).toHaveLength(2);
    expect(chemistry!.sections[0]!.kind).toBe('text');
    expect(chemistry!.sections[1]!.kind).toBe('callout');
  });

  it('produces stable lesson IDs', () => {
    const lessons = mapQuizQuestionsToLessons(quizQuestions);
    const ids = lessons.map((l) => l.id);
    expect(ids).toContain('lesson-physics');
    expect(ids).toContain('lesson-chemistry');
  });

  it('handles single question', () => {
    const single = mapQuizQuestionsToLessons([quizQuestions[0]!]);
    expect(single).toHaveLength(1);
    expect(single[0]!.questions).toHaveLength(1);
  });

  it('handles empty array', () => {
    expect(mapQuizQuestionsToLessons([])).toHaveLength(0);
  });
});
