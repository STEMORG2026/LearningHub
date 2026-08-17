# @stem-tuition/content-provider

Content access boundary for STEM-TUITION. Consumes content from different sources
(local data, LearningHubSTEM) and provides a unified LessonContent application model.

## Purpose

This package implements the `ContentProvider` seam described in
`docs/CONSTITUTION.md` §11. It decouples the product from the source of its
knowledge content, allowing:

- `LocalContentProvider` — in-memory lessons (current implementation)
- `CachedContentProvider` — offline cache (future)
- `LearningHubStemProvider` — direct from LearningHubSTEM API (future)

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
} from '@stem-tuition/content-provider';
```

## Dependencies

- `@stem-tuition/core` — EventBus
- `@stem-tuition/tracer` — observability

## Usage

```typescript
import { LocalContentProvider, mapQuizQuestionsToLessons } from '@stem-tuition/content-provider';
import { QUIZ_QUESTIONS } from '@stem-tuition/quiz-engine';

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
pnpm test --filter="@stem-tuition/content-provider"
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
