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

## Event Bus Publishers (Phase 7)

All payloads follow the event envelope contract: `{ data, timestamp, schemaVersion: '1.0' }`
(see `docs/policies/EVENT_BUS_CONTRACT.md`). Only the `data` fields are listed below.

| Publisher | Publishes | Handler location | Payload (`data`) |
|-----------|----------|-----------------|------------------|
| auth (`login()`) | `auth:login` | `packages/auth/src/internal/auth.ts:39` | `{userId}` |
| progress (`startLesson()`) | `progress:lesson-started` | `packages/progress/src/internal/progress.ts:18` | `{userId, lessonId}` |
| progress (`completeLesson()`) | `progress:lesson-completed` | `packages/progress/src/internal/progress.ts:36` | `{userId, lessonId, score}` |
| admin (`createUser()`) | `admin:user-created` | `packages/admin/src/internal/admin.ts:56` | `{userId}` |
| admin (`updateUser()`) | `admin:user-updated` | `packages/admin/src/internal/admin.ts:69` | `{userId}` |
| payments (`createTransaction()`) | `payments:transaction-created` | `packages/payments/src/internal/payments.ts:18` | `{transactionId, userId, amount, currency}` |
| payments (`completeTransaction()`) | `payments:transaction-completed` | `packages/payments/src/internal/payments.ts:31` | `{transactionId, userId}` |
| payments (`createSubscription()`) | `payments:subscription-created` | `packages/payments/src/internal/payments.ts:58` | `{subscriptionId, userId, tier}` |
| payments (`cancelSubscription()`) | `payments:subscription-canceled` | `packages/payments/src/internal/payments.ts:71` | `{subscriptionId}` |
| video (`createSession()`) | `video:session-created` | `packages/video/src/internal/video.ts:21` | `{sessionId, hostId, title}` |
| video (`joinSession()`) | `video:participant-joined` | `packages/video/src/internal/video.ts:35` | `{sessionId, userId, role}` |
| video (`leaveSession()`) | `video:participant-left` | `packages/video/src/internal/video.ts:49` | `{sessionId, userId}` |
| video (`startSession()`) | `video:session-started` | `packages/video/src/internal/video.ts:70` | `{sessionId}` |
| video (`endSession()`) | `video:session-ended` | `packages/video/src/internal/video.ts:84` | `{sessionId}` |

## Event Bus Publishers (Phase 8)

| Publisher | Publishes | Handler location | Payload (`data`) |
|-----------|----------|-----------------|------------------|
| `<stem-lesson>` (render) | `lesson:rendered` | `packages/lesson-renderer/src/stem-lesson.ts:227` | `{lessonId, title}` |
| `<stem-lesson>` (answer) | `lesson:question-answered` | `packages/lesson-renderer/src/stem-lesson.ts:520` | `{questionId, isCorrect, selectedIndex}` |
| `<stem-circuit-sim>` | `simulation:complete` | `packages/interactive-simulations/src/stem-circuit-sim.ts:159` | `{type: 'circuit', voltage, resistance, current}` |
| `<stem-mechanics-sim>` | `simulation:complete` | `packages/interactive-simulations/src/stem-mechanics-sim.ts:229` | `{type: 'mechanics', force, mass, acceleration, predictionCorrect}` |
| `<stem-optics-sim>` | `simulation:complete` | `packages/interactive-simulations/src/stem-optics-sim.ts:338` | `{type: 'optics', n1, n2, angle, angleOfRefraction, totalInternalReflection, criticalAngle, focal, objectDistance, imageDistance, magnification, predictionCorrect}` |

> `content-provider` and `content-engine` publish no EventBus events — they are
> consumed through their exported functions, not through the bus.

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
