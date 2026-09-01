import { describe, it, expect } from 'vitest';
import { composeNarrativeLesson } from '../src/narrative';
import type { LhsEntity } from '../src/lhs-adapter';

const forceEntity: LhsEntity = {
  id: 'lhs:phys.force',
  type: 'concept',
  name: 'Force',
  domain: 'physics',
  status: 'draft',
  definition: 'An influence that can change the motion of a body.',
  symbol: 'F',
  equation: 'F = m·a',
  common_misconceptions: ['A constant net force produces constant speed.'],
  learning_objectives: ['Relate force, mass, and acceleration.'],
  real_world_applications: ['Vehicle braking.', 'Rocket propulsion.'],
  provenance: { ai_drafted: true },
  relationships: [
    { type: 'logically_requires', target: 'lhs:phys.mass' },
    { type: 'related_to', target: 'lhs:phys.momentum' },
  ],
};

describe('composeNarrativeLesson', () => {
  const narrative = {
    conceptId: 'lhs:phys.force',
    hook: 'Every push you have ever given is a force.',
    history: 'Aristotle thought force keeps things moving; Newton overturned it in 1687.',
    whatCameBefore: 'You met mass, acceleration, and vectors earlier.',
    connections: ['Newton’s three laws', 'Momentum'],
    applications: ['Braking systems.', 'Spacecraft propulsion.'],
    workedExamples: ['A 5 kg box pushed with 20 N accelerates at 4 m/s².'],
    analogies: ['A force is like a boot kicking a football.'],
    misconceptions: ['More force does not mean more constant speed.'],
    tryThis: 'Press a book and feel it push back.',
    funFacts: ['The newton is about the weight of an apple.'],
    estimatedTimeMinutes: 14,
  };

  it('does not require a narrative to produce a lesson', () => {
    const lesson = composeNarrativeLesson(forceEntity, { conceptId: 'lhs:phys.force' });
    expect(lesson.sections.length).toBeGreaterThan(0);
    expect(lesson.metadata.conceptId).toBe('lhs:phys.force');
  });

  it('weaves narrative and canonical facts into a progressive story', () => {
    const lesson = composeNarrativeLesson(forceEntity, narrative);
    const kinds = lesson.sections.map((s) => s.kind);

    // Opening story, then history/context, then the canonical narrative/equation.
    expect(kinds[0]).toBe('story');
    expect(kinds[1]).toBe('context');
    expect(kinds).toContain('equation');
    expect(kinds).toContain('analogy');
    expect(kinds).toContain('example');
    expect(kinds).toContain('application');
    expect(kinds).toContain('misconception');
    expect(kinds).toContain('try-this');
    expect(kinds).toContain('fun-fact');

    // Canonical definition is preserved as the narrative body.
    const canonical = lesson.sections.find((s) => s.kind === 'narrative');
    expect(canonical?.body).toBe('An influence that can change the motion of a body.');
  });

  it('derives prerequisites from logically/mathematically requires relationships', () => {
    const lesson = composeNarrativeLesson(forceEntity, narrative);
    expect(lesson.metadata.prerequisites).toContain('lhs:phys.mass');
  });

  it('surfaces learning objectives and real-world applications in metadata', () => {
    const lesson = composeNarrativeLesson(forceEntity, narrative);
    expect(lesson.metadata.learningObjectives).toContain('Relate force, mass, and acceleration.');
    expect(lesson.metadata.realWorldApplications).toContain('Braking systems.');
  });

  it('uses narrative applications when provided, else falls back to canonical', () => {
    const withCanonical = composeNarrativeLesson(forceEntity, { conceptId: 'lhs:phys.force' });
    expect(withCanonical.metadata.realWorldApplications).toContain('Vehicle braking.');
    expect(withCanonical.sections.some((s) => s.kind === 'application')).toBe(true);
  });

  it('does not leak LHS internal schema into the lesson model', () => {
    const lesson = composeNarrativeLesson(forceEntity, narrative);
    expect((lesson as unknown as Record<string, unknown>).provenance).toBeUndefined();
    expect((lesson as unknown as Record<string, unknown>).relationships).toBeUndefined();
  });
});