# Networking Registry

**Version:** 2.0.0

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
| Quiz ACL Adapter | `quiz:started` | `packages/acl/src/quiz-adapter.ts:72` | `{quizId, conceptId, questionCount, difficulty}` |
| Quiz ACL Adapter | `quiz:answer-submitted` | `packages/acl/src/quiz-adapter.ts:82` | `{quizId, questionId, answer, timeSpentMs, hintUsed}` |
| Quiz ACL Adapter | `quiz:completed` | `packages/acl/src/quiz-adapter.ts:92` | `{quizId, conceptId, score, total, percentage}` |

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
| WhatsApp API | Enrollment booking | `legacy/contact.html` | Legacy (frozen) |
| Google Fonts | Typography | `legacy/index.html:11` | Legacy (frozen) |
| YouTube embeds | Video lessons | `legacy/videos.html` | Legacy (frozen) |
| Google Drive links | Study notes | `legacy/videos.html` | Legacy (frozen) |
