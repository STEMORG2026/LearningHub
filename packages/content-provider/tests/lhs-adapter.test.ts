import { describe, it, expect } from 'vitest';
import { mapLhsEntityToLesson, mapLhsEntitiesToLessons } from '../src/lhs-adapter';
import type { LhsEntity } from '../src/lhs-adapter';

describe('mapLhsEntityToLesson', () => {
  const forceEntity: LhsEntity = {
    id: 'lhs:phys.force',
    type: 'concept',
    name: 'Force',
    domain: 'physics',
    status: 'draft',
    definition: 'An influence that can change the motion of a body.',
    symbol: 'F',
    unit: 'newton (N)',
    equation: 'F = dp/dt',
    common_misconceptions: ['A constant net force produces constant speed.'],
    provenance: { ai_drafted: true },
    relationships: [
      { type: 'appears_in_law', target: 'lhs:phys.newtons-second-law' },
      { type: 'related_to', target: 'lhs:phys.momentum' },
    ],
  };

  it('maps definition to a text section', () => {
    const lesson = mapLhsEntityToLesson(forceEntity);
    expect(lesson.sections[0]!.kind).toBe('text');
    expect(lesson.sections[0]!.body).toBe('An influence that can change the motion of a body.');
  });

  it('maps equation to an equation section', () => {
    const lesson = mapLhsEntityToLesson(forceEntity);
    const eqSection = lesson.sections.find((s) => s.kind === 'equation');
    expect(eqSection).toBeDefined();
    expect(eqSection!.body).toBe('F = dp/dt');
    expect(eqSection!.symbol).toBe('F');
  });

  it('maps misconceptions to misconception sections', () => {
    const lesson = mapLhsEntityToLesson(forceEntity);
    const misconceptionSections = lesson.sections.filter((s) => s.kind === 'misconception');
    expect(misconceptionSections).toHaveLength(1);
    expect(misconceptionSections[0]!.body).toBe('A constant net force produces constant speed.');
  });

  it('sets metadata from entity', () => {
    const lesson = mapLhsEntityToLesson(forceEntity);
    expect(lesson.metadata.conceptId).toBe('lhs:phys.force');
    expect(lesson.metadata.displayName).toBe('Force');
    expect(lesson.metadata.subject).toBe('physics');
  });

  it('derives prerequisites from logically_requires relationships', () => {
    const entityWithPrereqs: LhsEntity = {
      ...forceEntity,
      relationships: [
        { type: 'logically_requires', target: 'lhs:phys.mass' },
        { type: 'mathematically_requires', target: 'lhs:phys.acceleration' },
        { type: 'related_to', target: 'lhs:phys.momentum' },
      ],
    };
    const lesson = mapLhsEntityToLesson(entityWithPrereqs);
    expect(lesson.metadata.prerequisites).toContain('lhs:phys.mass');
    expect(lesson.metadata.prerequisites).toContain('lhs:phys.acceleration');
    expect(lesson.metadata.prerequisites).not.toContain('lhs:phys.momentum');
  });

  it('does NOT expose LHS internal schema in the lesson model', () => {
    const lesson = mapLhsEntityToLesson(forceEntity);
    // The lesson ID should not contain the colon (which is LHS namespace convention)
    expect(lesson.id).toBe('lesson-lhs-phys.force');
    // The conceptId can reference LHS but the model itself is clean
    expect((lesson as Record<string, unknown>).provenance).toBeUndefined();
    expect((lesson as Record<string, unknown>).relationships).toBeUndefined();
  });

  it('generates stable lesson ID', () => {
    const lesson = mapLhsEntityToLesson(forceEntity);
    expect(lesson.id).toBe('lesson-lhs-phys.force');
  });
});

describe('mapLhsEntitiesToLessons', () => {
  const entities: LhsEntity[] = [
    {
      id: 'lhs:phys.force',
      type: 'concept',
      name: 'Force',
      domain: 'physics',
      status: 'draft',
      definition: 'An influence that can change motion.',
      symbol: 'F',
      unit: 'newton (N)',
      equation: 'F = dp/dt',
      common_misconceptions: [],
      provenance: { ai_drafted: true },
      relationships: [],
    },
    {
      id: 'lhs:phys.mass',
      type: 'quantity',
      name: 'Mass',
      domain: 'physics',
      status: 'draft',
      definition: 'Resistance to acceleration.',
      symbol: 'm',
      unit: 'kilogram (kg)',
      equation: null,
      common_misconceptions: [],
      provenance: { ai_drafted: true },
      relationships: [],
    },
    {
      id: 'lhs:phys.deprecated-concept',
      type: 'concept',
      name: 'Old Theory',
      domain: 'physics',
      status: 'deprecated',
      definition: 'This is outdated.',
      symbol: null,
      unit: null,
      equation: null,
      common_misconceptions: [],
      provenance: { ai_drafted: true },
      relationships: [],
    },
  ];

  it('maps all non-deprecated entities', () => {
    const lessons = mapLhsEntitiesToLessons(entities);
    expect(lessons).toHaveLength(2);
  });

  it('filters out deprecated entities', () => {
    const lessons = mapLhsEntitiesToLessons(entities);
    expect(lessons.every((l) => l.metadata.conceptId !== 'lhs:phys.deprecated-concept')).toBe(true);
  });

  it('filters out superseded entities', () => {
    const withSuperseded = [
      ...entities,
      {
        ...entities[0]!,
        id: 'lhs:phys.superseded',
        status: 'superseded',
      },
    ];
    const lessons = mapLhsEntitiesToLessons(withSuperseded);
    expect(lessons).toHaveLength(2);
  });
});
