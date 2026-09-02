/**
 * Quiz-to-Lesson mapper.
 *
 * Transforms quiz question data (from @learninghub/quiz-engine) into
 * LessonContent format. This is the first step toward unifying content:
 * existing quiz data becomes consumable lessons.
 *
 * Each subject's quiz questions become a single LessonContent with sections
 * derived from question explanations.
 */

import type { LessonContent, LessonSection, Question } from './types';

export interface QuizQuestionLike {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  conceptId: string;
  displayName: string;
  prerequisites: string[];
  gradeLevels: number[];
  estimatedTimeMinutes: number;
  commonMisconceptions: string[];
  tags: string[];
}

function quizToQuestion(q: QuizQuestionLike, idx: number): Question {
  return {
    id: q.id,
    prompt: q.question,
    options: q.options,
    correctIndex: q.correct,
    explanation: q.explanation,
    conceptId: q.conceptId,
    difficulty: idx === 0 ? 'easy' : idx === 1 ? 'medium' : 'hard',
  };
}

function quizToSections(q: QuizQuestionLike): LessonSection[] {
  const sections: LessonSection[] = [];

  sections.push({
    id: `${q.id}-question`,
    kind: 'text',
    body: q.question,
  });

  if (q.explanation) {
    sections.push({
      id: `${q.id}-explanation`,
      kind: 'callout',
      body: q.explanation,
    });
  }

  return sections;
}

/**
 * Map quiz questions grouped by subject into LessonContent[].
 * Each subject produces one LessonContent aggregating its questions.
 */
export function mapQuizQuestionsToLessons(questions: QuizQuestionLike[]): LessonContent[] {
  const bySubject = new Map<string, QuizQuestionLike[]>();

  for (const q of questions) {
    const existing = bySubject.get(q.subject) ?? [];
    existing.push(q);
    bySubject.set(q.subject, existing);
  }

  const lessons: LessonContent[] = [];

  for (const [subject, qs] of bySubject) {
    const totalTime = qs.reduce((sum, q) => sum + q.estimatedTimeMinutes, 0);

    // Merge tags and misconceptions across all questions in this subject
    const allTags = [...new Set(qs.flatMap((q) => q.tags))];
    const allMisconceptions = [...new Set(qs.flatMap((q) => q.commonMisconceptions))];
    const allPrereqs = [...new Set(qs.flatMap((q) => q.prerequisites))];
    const gradeLevels = [...new Set(qs.flatMap((q) => q.gradeLevels))].sort((a, b) => a - b);

    const sections: LessonSection[] = [];
    for (const q of qs) {
      sections.push(...quizToSections(q));
    }

    const quizQuestions: Question[] = qs.map((q, idx) => quizToQuestion(q, idx));

    lessons.push({
      id: `lesson-${subject}`,
      version: '1.0.0',
      metadata: {
        conceptId: `${subject}-overview`,
        displayName: subject.charAt(0).toUpperCase() + subject.slice(1),
        subject,
        gradeLevels,
        prerequisites: allPrereqs,
        estimatedTimeMinutes: totalTime,
        commonMisconceptions: allMisconceptions,
        tags: allTags,
      },
      sections,
      questions: quizQuestions,
      simulations: [],
    });
  }

  return lessons;
}
