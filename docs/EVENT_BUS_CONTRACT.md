# Event Bus Contract

**Version:** 3.0.0
**Status:** ENFORCED
**Applies to:** All cross-module communication in `packages/*`

---

## 1. Purpose

The Event Bus is the central communication channel for STEM-TUITION. It allows modules to send messages without knowing about each other — loose coupling.

This document defines:
- How events are named
- What payload each event carries
- How events are versioned
- How to add new events
- How to debug events

---

## 2. How It Works

```
Publisher                              Subscriber
(any module)                           (any module)
     │                                      │
     │  eventBus.publish('quiz:completed',   │
     │    { score: 8, total: 10 })           │
     │──────────────────────────────────────→│
     │                                       │
     │                            eventBus.subscribe(
     │                              'quiz:completed',
     │                              (payload) => { ... }
     │                            )
```

- Publishers do not know who is listening
- Subscribers do not know who published
- The Event Bus is the only bridge between packages

---

## 3. Event Naming Convention

Events follow the format: `{domain}:{action}`

### 3.1 Domain Namespace Registry

| Domain | Prefix | Examples | Owner package |
|--------|--------|----------|---------------|
| Quiz | `quiz:` | `quiz:started`, `quiz:answer-submitted`, `quiz:completed` | `quiz-engine` |
| Audio | `audio:` | `audio:play-sound`, `audio:volume-changed` | `audio-synth` |
| Hover | `hover:` | `hover:style-applied`, `hover:cooldown-update` | `hover-engine` |
| Physics | `physics:` | `physics:body-created`, `physics:collision-detected` | `simulation-core` |
| Canvas | `canvas:` | `canvas:render-start`, `canvas:render-end` | `simulation-core` |
| Navigation | `nav:` | `nav:page-changed`, `nav:route-requested` | `shell` |
| UI | `ui:` | `ui:toast-show`, `ui:modal-open`, `ui:theme-changed` | `shell` |
| Auth | `auth:` | `auth:login`, `auth:logout`, `auth:token-expired` | (future) |
| Progress | `progress:` | `progress:concept-mastered`, `progress:level-up` | (future) |
| Error | `error:` | `error:module-failed`, `error:network-unavailable` | `core` |
| Trace | `trace:` | `trace:span-started`, `trace:span-completed` | `tracer` |

### 3.2 Naming Rules

1. Domain MUST be one word, lowercase
2. Action MUST be past tense (completed, started, submitted) for completed events
3. Action MAY be present tense for commands (play-sound, show-toast)
4. Use hyphens for multi-word actions: `quiz:answer-submitted`
5. No underscores: ❌ `quiz:answer_submitted`
6. No uppercase: ❌ `Quiz:Completed`

```typescript
// ✅ Correct
eventBus.publish('quiz:answer-submitted', { questionId: 'q-42', answer: 'F=ma' });
eventBus.publish('audio:play-sound', { sound: 'correct-answer', volume: 0.8 });
eventBus.publish('error:module-failed', { module: 'quiz-engine', code: 'TIME_OUT' });

// ❌ Wrong
eventBus.publish('QuizCompleted', { ... });
eventBus.publish('quiz:answer_submitted', { ... });
eventBus.publish('did-a-thing', { ... });
```

---

## 4. Payload Schema

Every event payload MUST follow this structure:

```typescript
interface EventPayload {
  /** The data for this event */
  data: Record<string, unknown>;

  /** ISO 8601 timestamp of when the event was created */
  timestamp: string;

  /** Schema version for backward compatibility */
  schemaVersion: string;

  /** Trace ID for debugging — propagated from the tracer */
  traceId?: string;
}
```

### 4.1 Concrete Payload Definitions

```typescript
// ──── Quiz Domain ────

export interface QuizStartedData {
  quizId: string;
  conceptId: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAnswerSubmittedData {
  quizId: string;
  questionId: string;
  answer: string;
  timeSpentMs: number;
  hintUsed: boolean;
}

export interface QuizCompletedData {
  quizId: string;
  conceptId: string;
  score: number;
  total: number;
  percentage: number;
  timeSpentMs: number;
  misconceptionsIdentified: number;
}


// ──── Audio Domain ────

export interface AudioPlaySoundData {
  sound: string;
  volume: number;
  loop: boolean;
}


// ──── Error Domain ────

export interface ErrorData {
  module: string;
  code: string;
  message: string;
  recoverable: boolean;
  timestamp: string;
  traceId?: string;
}
```

### 4.2 Schema Versioning

`schemaVersion` follows `{major}.{minor}`:
- `major` bump = breaking change (payload structure changed, subscribers must update)
- `minor` bump = additive change (new optional fields)

```typescript
// Initial version
eventBus.publish('quiz:completed', {
  data: { score: 8, total: 10, percentage: 80 },
  timestamp: '2026-07-30T10:30:00Z',
  schemaVersion: '1.0'
});

// After adding optional hintCount field
eventBus.publish('quiz:completed', {
  data: { score: 8, total: 10, percentage: 80, hintCount: 3 },
  timestamp: '2026-07-30T10:30:00Z',
  schemaVersion: '1.1'  // minor bump — hintCount is optional
});
```

---

## 5. Adding a New Event

1. **Define the payload interface** in the source package's `types.ts`
2. **Register the event** in this document's Namespace Registry (above)
3. **Publish it** using `eventBus.publish(domain + ':' + action, data)`
4. **Subscribe to it** in consuming modules using `eventBus.subscribe(pattern, handler)`
5. **Test it** — write a test that publishes and verifies the subscriber receives it

```typescript
// Step 1: Define types
// packages/quiz-engine/src/types.ts
export interface QuizAnswerSubmittedData {
  questionId: string;
  answer: string;
}

// Step 2: Register in this doc (see section 3.1 — done)

// Step 3: Publish
// packages/quiz-engine/src/internal/quiz-engine.ts
eventBus.publish('quiz:answer-submitted', {
  data: { questionId: 'q-42', answer: 'F=ma' },
  timestamp: new Date().toISOString(),
  schemaVersion: '1.0',
  traceId: Tracer.getCurrentTraceId()
});

// Step 4: Subscribe
// packages/audio-synth/src/index.ts
eventBus.subscribe('quiz:answer-submitted', (payload) => {
  playSound(payload.answer === 'F=ma' ? 'correct' : 'incorrect');
});
```

---

## 6. Subscription Patterns

The Event Bus supports wildcard subscriptions for bulk handling:

```typescript
// Subscribe to ALL quiz events
eventBus.subscribe('quiz:*', (event) => {
  console.log(`Quiz event: ${event.type}`, event.data);
});

// Subscribe to ALL events (for debugging)
eventBus.subscribe('*', (event) => {
  console.log(`[EVENT BUS] ${event.type}`, event.data);
});
```

---

## 7. Debug Mode

Append `?debug_events=true` to any URL to enable live console logging of all events:

```
http://localhost:8085/?debug_events=true
```

Console output:

```
[EVENT BUS] quiz:answer-submitted { questionId: "q-42", answer: "F=ma", ... }
[EVENT BUS] quiz:completed { score: 8, total: 10, ... }
[EVENT BUS] audio:play-sound { sound: "correct-answer", volume: 0.8 }
```

This is the first thing to check when debugging — is the expected event being published?

---

## 8. Error Events

When a module fails, it MUST publish an error event:

```typescript
eventBus.publish('error:module-failed', {
  data: {
    module: 'quiz-engine',
    code: 'LOAD_FAILED',
    message: 'Could not load quiz data for concept: newtons-law',
    recoverable: true
  },
  timestamp: new Date().toISOString(),
  schemaVersion: '1.0',
  traceId: Tracer.getCurrentTraceId()
});
```

The `recoverable` field tells the UI:
- `true` → show "Retry" button
- `false` → show fallback content + "Report" link
