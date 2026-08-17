import { describe, it, expect } from 'vitest';
import { LocalContentProvider } from '../src/local-content-provider';
import { sampleLessons } from './fixtures';

describe('LocalContentProvider', () => {
  const provider = new LocalContentProvider(sampleLessons);

  describe('getLesson', () => {
    it('returns a lesson by ID', () => {
      const lesson = provider.getLesson('lesson-physics-forces');
      expect(lesson).toBeDefined();
      expect(lesson!.metadata.conceptId).toBe('newtons-second-law');
    });

    it('returns undefined for unknown ID', () => {
      expect(provider.getLesson('nonexistent')).toBeUndefined();
    });
  });

  describe('getLessons', () => {
    it('returns all lessons when filter is empty', () => {
      expect(provider.getLessons()).toHaveLength(3);
    });

    it('filters by subject (case-insensitive)', () => {
      const physics = provider.getLessons({ subject: 'PHYSICS' });
      expect(physics).toHaveLength(1);
      expect(physics[0]!.metadata.subject).toBe('physics');
    });

    it('filters by grade level', () => {
      const grade9 = provider.getLessons({ grade: 9 });
      expect(grade9).toHaveLength(3);
      const grade8 = provider.getLessons({ grade: 8 });
      expect(grade8).toHaveLength(1);
    });

    it('filters by conceptId', () => {
      const result = provider.getLessons({ conceptId: 'ph-scale' });
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('lesson-chemistry-acids');
    });

    it('filters by prerequisite', () => {
      const result = provider.getLessons({ requiresConcept: 'force' });
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('lesson-physics-forces');
    });

    it('filters by tag', () => {
      const result = provider.getLessons({ tag: 'geometry' });
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('lesson-math-pythagoras');
    });

    it('combines filters (AND)', () => {
      const result = provider.getLessons({ subject: 'physics', grade: 9 });
      expect(result).toHaveLength(1);
    });
  });

  describe('getBySubject', () => {
    it('returns lessons for a subject', () => {
      expect(provider.getBySubject('chemistry')).toHaveLength(1);
      expect(provider.getBySubject('nonexistent')).toHaveLength(0);
    });
  });

  describe('getByGrade', () => {
    it('returns lessons targeting a grade', () => {
      expect(provider.getByGrade(10)).toHaveLength(3);
      expect(provider.getByGrade(8)).toHaveLength(1);
    });
  });

  describe('getByConcept', () => {
    it('returns lessons teaching a concept', () => {
      const result = provider.getByConcept('pythagorean-theorem');
      expect(result).toHaveLength(1);
    });
  });

  describe('providerName', () => {
    it('reports as local', () => {
      expect(provider.providerName).toBe('local');
    });
  });
});
