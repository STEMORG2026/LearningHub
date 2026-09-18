---
title: "ADR-013: Content Provider Implementation"
status: ACCEPTED
date: 2026-08-17
last_updated: 2026-08-17
canonical: true
---

# ADR-013: Content Provider Implementation

**Status:** Accepted
**Date:** 2026-08-17

## Context

The architecture (`CONSTITUTION.md` §11) specifies a `ContentProvider` seam to decouple the product from its knowledge source. This was a **planned seam only** — no implementation existed. To build the lesson experience (next phase), we needed a working content provider that consumes existing quiz data and LearningHubSTEM entities through a unified interface.

## Decision

Implement the `ContentProvider` interface with three layers:

1. **Application model** (`LessonContent`, `LessonMetadata`, `LessonSection`, `Question`, `SimulationConfig`, `ChallengeConfig`, `ContentFilter`) — the runtime model the product consumes, shaped by what needs rendering, not by the canonical knowledge schema.

2. **`ContentProvider` interface** — five methods: `getLesson`, `getLessons`, `getByConcept`, `getByGrade`, `getBySubject`. This is the boundary. It is NOT frozen yet — first implementation needs validation before freezing.

3. **`LocalContentProvider`** — in-memory implementation backed by `LessonContent[]`. Filters by subject, grade, concept, prerequisite, and tag. This is the first concrete implementation.

Plus two adapters:

- **`mapQuizQuestionsToLessons`** — transforms existing `@stem-tuition/quiz-engine` question data into `LessonContent[]`. Unifies quiz data with the new content model.
- **`mapLhsEntitiesToLessons`** — transforms LearningHubSTEM entities into `LessonContent[]`. This is the bridge between the canonical knowledge base and the product. LHS internal schema (provenance, relationships array) is NOT exposed in the application model.

## Consequences

- The product now has a content access boundary that can support multiple sources
- Quiz data is consumable as lessons (first content source bridged)
- LearningHubSTEM entities are consumable as lessons (second content source bridged)
- The `ContentProvider` interface needs validation before being frozen in the interface registry
- `LearningHubStemProvider` (direct API integration) remains future work

## Files

- `packages/content-provider/src/types.ts` — application model types
- `packages/content-provider/src/content-provider.ts` — interface
- `packages/content-provider/src/local-content-provider.ts` — implementation
- `packages/content-provider/src/quiz-mapper.ts` — quiz → lesson adapter
- `packages/content-provider/src/lhs-adapter.ts` — LHS → lesson adapter
- `packages/content-provider/tests/` — 32 tests, all passing
