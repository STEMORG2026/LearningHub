/**
 * Learning path generator — assembles curriculum mapping + canonical content
 * into a progressive learning sequence.
 *
 * Per CONSTITUTION.md §7: "STEM-TUITION owns curriculum selection, grade selection,
 * learner-facing sequencing, curriculum-to-canonical-topic mapping."
 */

import type { LessonContent } from '@stem-tuition/content-provider';
import {
  getCurriculumMapping,
  CURRICULUMS,
  type CurriculumId,
} from '../data/curriculum-mappings';

export interface LearningStep {
  sequence: number;
  canonicalId: string;
  curriculumRef: string;
  depth: 'core' | 'extended' | 'optional';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  lesson?: LessonContent;
}

export interface LearningPath {
  curriculum: CurriculumId;
  curriculumName: string;
  grade: number;
  subject: string;
  steps: LearningStep[];
  totalSteps: number;
  completedSteps: number;
}

/**
 * Generate a learning path for a given curriculum and grade.
 *
 * Looks up the curriculum mapping, resolves each canonical ID against
 * the provided lesson content, and returns a sequenced learning path.
 */
export function generateLearningPath(
  curriculum: CurriculumId,
  grade: number,
  lessons: LessonContent[],
): LearningPath {
  const mapping = getCurriculumMapping(curriculum, grade);
  const curriculumInfo = CURRICULUMS[curriculum];

  if (!mapping) {
    return {
      curriculum,
      curriculumName: curriculumInfo.name,
      grade,
      subject: 'physics',
      steps: [],
      totalSteps: 0,
      completedSteps: 0,
    };
  }

  const lessonMap = new Map(lessons.map((l) => [l.metadata.conceptId, l]));

  const steps: LearningStep[] = mapping.topics.map((topic) => {
    const lesson = lessonMap.get(topic.canonicalId);
    const step: LearningStep = {
      sequence: topic.sequence,
      canonicalId: topic.canonicalId,
      curriculumRef: topic.curriculumRef,
      depth: topic.depth,
      status: topic.sequence === 1 ? 'available' : 'locked',
    };
    if (lesson) {
      step.lesson = lesson;
    }
    return step;
  });

  return {
    curriculum,
    curriculumName: curriculumInfo.name,
    grade,
    subject: mapping.subject,
    steps,
    totalSteps: steps.length,
    completedSteps: 0,
  };
}

/**
 * Mark a step as completed and unlock the next step.
 */
export function completeStep(path: LearningPath, sequence: number): LearningPath {
  const newSteps = path.steps.map((step) => {
    if (step.sequence === sequence && step.status === 'in_progress') {
      return { ...step, status: 'completed' as const };
    }
    if (step.sequence === sequence + 1 && step.status === 'locked') {
      return { ...step, status: 'available' as const };
    }
    return step;
  });

  return {
    ...path,
    steps: newSteps,
    completedSteps: newSteps.filter((s) => s.status === 'completed').length,
  };
}

/**
 * Start a step (mark as in_progress).
 */
export function startStep(path: LearningPath, sequence: number): LearningPath {
  const newSteps = path.steps.map((step) => {
    if (step.sequence === sequence && step.status === 'available') {
      return { ...step, status: 'in_progress' as const };
    }
    return step;
  });

  return { ...path, steps: newSteps };
}
