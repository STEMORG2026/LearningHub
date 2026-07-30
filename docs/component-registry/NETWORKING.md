# Networking Registry

**Version:** 2.0.0

**Purpose:** Every API call, Event Bus subscription, external connection, and network boundary.

---

## Event Bus Subscriptions

| Subscriber | Subscribes to | Handler location | Notes |
|-----------|---------------|-----------------|-------|
| Audio Synth | `quiz:answer-submitted` | `packages/audio-synth/src/synth.ts` | Plays correct/incorrect sound |
| Audio Synth | `quiz:completed` | `packages/audio-synth/src/synth.ts` | Plays completion jingle |
| Tracer | `*` (all) | `packages/tracer/src/tracer.ts` | Records all event timing |
| Hover Engine | `ui:card-hovered` | `packages/hover-engine/src/hover-state.ts` | Triggers style selection |

## Event Bus Publishers

| Publisher | Publishes | Handler location | Payload |
|-----------|----------|-----------------|---------|
| Quiz Engine | `quiz:answer-submitted` | `packages/quiz-engine/src/internal/quiz-engine.ts` | `{questionId, answer, timeSpentMs}` |
| Quiz Engine | `quiz:completed` | `packages/quiz-engine/src/internal/quiz-engine.ts` | `{score, total, percentage}` |
| Audio Synth | `audio:play-sound` | `packages/audio-synth/src/synth.ts` | `{sound, volume}` |

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
