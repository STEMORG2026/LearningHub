# Networking Registry

**Version:** 3.0.0

**Purpose:** Every API call, Event Bus subscription, external connection, and network boundary.

---

## Event Bus — Implementation

| Component | Type | Location | Status |
|-----------|------|----------|--------|
| `EventBus` class | Core | `packages/core/src/event-bus.ts:8` | 🟢 Active |
| `publish()` | Method | `packages/core/src/event-bus.ts:35` | 🟢 Active |
| `subscribe()` | Method | `packages/core/src/event-bus.ts:49` | 🟢 Active |
| Wildcard `*` / `domain:*` | Pattern | `packages/core/src/event-bus.ts:3` | 🟢 Active |
| `BroadcastChannel` cross-tab | Integration | `packages/core/src/event-bus.ts:20` | 🟢 Active |
| `?debug_events=true` | Debug mode | `packages/core/src/event-bus.ts:86` | 🟢 Active |

## Event Bus Publishers (Phase 3)

| Publisher | Publishes | Handler location | Payload |
|-----------|----------|-----------------|---------|
| Quiz Engine (`<stem-quiz>`) | `quiz:answer-submitted` | `packages/quiz-engine/src/internal/web-component.ts:132` | `{quizId, questionId, answer, timeSpentMs, hintUsed}` |
| Quiz Engine (engine) | `quiz:completed` | `packages/quiz-engine/src/internal/quiz-engine.ts:62` | `{quizId, conceptId, score, total, percentage}` |

> `quiz:started` is defined in the Event Bus contract but not yet published by any module.

## Planned Subscriptions (Future Phases)

| Subscriber | Subscribes to | Handler location | Notes |
|-----------|---------------|-----------------|-------|
| Audio Synth | `quiz:answer-submitted` | `packages/audio-synth/src/synth.ts` | Plays correct/incorrect sound (Phase 4) |
| Audio Synth | `quiz:completed` | `packages/audio-synth/src/synth.ts` | Plays completion jingle (Phase 4) |
| Tracer | `*` (all) | `packages/tracer/src/tracer.ts` | Records all event timing (Phase 4) |
| Hover Engine | `ui:card-hovered` | `packages/hover-engine/src/hover-state.ts` | Triggers style selection (Phase 5) |

## API Endpoints (Future — VPS Migration)

| Method | Route | Purpose | Status |
|--------|-------|---------|--------|
| POST | `/api/enroll` | Student enrollment | Future |
| POST | `/api/contact` | Contact form submission | Future |
| GET | `/api/quizzes` | Quiz data API | Future |
| POST | `/api/auth/login` | Student login | Future |

## External Connections

| Connection | Purpose | Location | Status |
|-----------|---------|----------|--------|
| WhatsApp API | Enrollment booking | `apps/shell/src/data/site.ts` | Active (app shell) |
| Google Fonts | Typography | `apps/shell/index.html:9` | Active (app shell) |
| YouTube embeds | Video lessons | `apps/shell/src/data/videos.ts` | Active (app shell) |
| Google Drive links | Study notes | `apps/shell/src/data/videos.ts` | Active (app shell) |
