# @learninghub/content-provider

Content access boundary for LearningHub. Consumes content from different sources
(local data, STEMMA exports) and provides a unified LessonContent application model.

## Purpose

This package implements the `ContentProvider` seam described in
`docs/CONSTITUTION.md` §11. It decouples the product from the source of its
knowledge content, allowing:

- `LocalContentProvider` — in-memory lessons (current implementation)
- `CachedContentProvider` — offline cache (future)
- `LearningHubStemProvider` — direct from STEMMA export API (future)

All implementations conform to the same `ContentProvider` interface.

## Owns

- Application consumption model (`LessonContent`, `LessonMetadata`, `LessonSection`, etc.)
- Content provider interface and local implementation
- Adapters that map external data into the application model

## Does not own

- Rendering of lessons (that's the shell / lesson runtime)
- Canonical STEM knowledge (that's LearningHubSTEM)
- Quiz logic (that's quiz-engine)
- Simulation engines (that's simulation-core)

## Public API

```typescript
import {
  ContentProvider,
  LocalContentProvider,
  mapQuizQuestionsToLessons,
  mapLhsEntitiesToLessons,
} from '@learninghub/content-provider';
```

### Provider contract

- **`ContentProvider`** — the interface every provider implements. Consumers depend on this, never
  on a concrete provider.
- **`LocalContentProvider`** — the default implementation, backed by the vendored content corpus.

### Lesson model

| Symbol | Description |
| --- | --- |
| `LessonContent` | A complete lesson: metadata, ordered sections, and associated questions/simulations. |
| `LessonMetadata` | Identity and classification for a lesson (id, title, subject, grade band, tags). |
| `LessonSection` | One ordered block of lesson body content. |
| `Question` | A single assessable item attached to a lesson. |

### Simulation / challenge configuration

| Symbol | Description |
| --- | --- |
| `SimulationConfig` | Declarative description of an interactive simulation attachment — which simulation type and its initial parameters. Rendered by `@learninghub/interactive-simulations`; this package only carries the data. |
| `ChallengeConfig` | Declarative description of a challenge/problem set attachment, including its expected outcome and grading hints. |

### Query / filtering

| Symbol | Description |
| --- | --- |
| `ContentFilter` | Criteria for narrowing a content query — used by provider `getLessons`-style calls to select a subset by subject, grade, tag, or id. |

### STEMMA/LHS bridge types

These two interfaces describe the *inbound* shape of the canonical STEMMA knowledge export. They
are declared in `src/lhs-adapter.ts` and intentionally **mirror the external schema** so the
adapter can be validated against it.

| Symbol | Description |
| --- | --- |
| `LhsEntity` | One knowledge-graph entity as it arrives from the STEMMA export: `id`, `type`, `name`, `domain`, `status`, `definition`, optional `symbol`/`unit`/`equation`, optional list fields (`examples`, `key_experiments`, `common_misconceptions`, `learning_objectives`, `real_world_applications`), and `provenance`. |
| `LhsRelationship` | A directed edge in the knowledge graph: `{ type: string; target: string; note?: string }`. |

> **Note on schema drift.** The modern STEMMA export (≥ 2.x) publishes relationships as a
> **top-level `connections[]` array** with `{ source, relation, value }` rather than as a nested
> `relationships[]` per entity, and carries the expression in `symbol` rather than `equation`.
> `LhsRelationship` above still models the **legacy nested shape**. Treat the bridge types as a
> known-incomplete mapping of the current external contract; see the STEMMA seam notes in
> `docs/adr/023-restore-verification-gate-and-stemma-seam.md`.

### Mappers

- **`mapQuizQuestionsToLessons`** — folds flat quiz questions into their parent lessons.
- **`mapLhsEntitiesToLessons`** — converts LHS/STEMMA entities into the provider-agnostic
  `LessonContent` model, per `CONSTITUTION.md §11` (downstream layers must not expose STEMMA's
  internal schema).


## Dependencies

- `@learninghub/core` — EventBus
- `@learninghub/tracer` — observability

## Usage

```typescript
import { LocalContentProvider, mapQuizQuestionsToLessons } from '@learninghub/content-provider';
import { QUIZ_QUESTIONS } from '@learninghub/quiz-engine';

// Map existing quiz data into lesson format
const lessons = mapQuizQuestionsToLessons(QUIZ_QUESTIONS);
const provider = new LocalContentProvider(lessons);

// Filter by grade
const grade9Lessons = provider.getByGrade(9);

// Filter by subject
const physicsLessons = provider.getBySubject('physics');
```

## Data Flow

```
LearningHubSTEM (exports/knowledge.json)
        │
        ▼
   mapLhsEntitiesToLessons()  ← adapter
        │
        ▼
   LessonContent[]            ← application model
        │
        ▼
   LocalContentProvider       ← seam interface
        │
        ▼
   STEM Tuition runtime       ← consumer
```

## Testing

```bash
pnpm test --filter="@learninghub/content-provider"
```

32 tests covering LocalContentProvider, quiz mapper, and LHS adapter.

## Debugging

```typescript
// Provider name is logged via tracer
console.log(provider.providerName); // 'local'
```

## Known Limitations

- `LocalContentProvider` is in-memory only — no persistence
- `LearningHubStemProvider` is not yet implemented
- No offline caching layer yet

## Future Extension Points

- `CachedContentProvider` with IndexedDB persistence
- `LearningHubStemProvider` with fetch + schema validation
- Content versioning and incremental updates
