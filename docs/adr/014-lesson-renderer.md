# ADR-014: Lesson Renderer Package

**Status:** Accepted
**Date:** 2026-08-19
**Owner:** Architecture
**Related:** `ADR-002` (Web Components as Default), `ADR-013` (Content Provider), `docs/policies/EVENT_BUS_CONTRACT.md`, `docs/guides/COMPONENT_STANDARDS.md`

---

## Context

ADR-013 established the `ContentProvider` seam and a `LessonContent` application
model, but nothing rendered it. The product needed a presentation layer that turns
a `LessonContent` object into a usable lesson view.

This ADR is written **retroactively**. The package shipped on 2026-08-17 in commit
`e27f907` without an ADR, which `docs/adr/README.md` §2.1 requires for any new
package. It went undocumented until the 2026-08-19 documentation audit, because the
docs generator derived its package list from `.phase.json` and the package was never
registered there. The omission is recorded here rather than quietly backfilled.

Options available at the time:

1. Render lessons inside `apps/shell` directly
2. Extend an existing package (e.g. `quiz-engine`) to render lessons
3. A dedicated `lesson-renderer` package exposing a Web Component

## Decision

Create `packages/lesson-renderer/` exposing a single Web Component, `StemLesson`,
registered as `<stem-lesson>`.

- **Custom element**, guarded registration:
  `if (!customElements.get('stem-lesson')) customElements.define(...)` — safe under
  repeated imports and HMR.
- **Shadow DOM**, `attachShadow({ mode: 'open' })` — style encapsulation per
  ADR-002 and `COMPONENT_STANDARDS.md`.
- **Consumes the ADR-013 model.** Depends on `@stem-tuition/content-provider` for
  `LessonContent` types; it does not define its own content model.
- **Emits a DOM `CustomEvent`**, `lesson:question-answered`, on answer submission
  (`src/stem-lesson.ts:361`).

### Deviation: DOM CustomEvent instead of EventBus

`AGENTS.md` states all cross-module calls go through
`EventBus.publish()`/`subscribe()`. This component uses `dispatchEvent` with a
`CustomEvent` instead. The rationale: the event is a **local UI notification from a
custom element to its parent DOM node**, not cross-module communication. DOM events
propagate naturally through the element tree and keep the component usable
standalone, without an EventBus instance.

The event name still follows the mandated `domain:action` convention.

`EVENT_BUS_CONTRACT.md` is silent on DOM `CustomEvent`s, and no lint rule enforces
the distinction — `pnpm lint:arch` (dependency-cruiser) checks import graphs, not
event mechanisms. **This deviation is therefore unenforced and undocumented
elsewhere; recording it here is the only trace.** If the boundary should be
EventBus, that is a follow-up decision requiring a superseding ADR.

## Alternatives Considered

**1. Render inside `apps/shell`.** Rejected — couples lesson presentation to the
shell app, making it untestable in isolation and unusable by any future surface
(mobile, embed).

**2. Extend `quiz-engine`.** Rejected — conflates question logic with lesson
presentation. `quiz-engine` is pure logic; adding DOM rendering to it would violate
the business-logic-purity rule in `docs/RULES.md`.

**3. EventBus instead of DOM events.** Deferred rather than rejected. Adds an
initialization requirement for a component whose only current consumer is its
immediate DOM parent. Revisit if a non-adjacent module needs to observe answers.

## Consequences

### Positive
- Lesson rendering is independently testable — **47 tests passing**
- Reusable across any surface that can host a custom element
- Content model stays owned by `content-provider` (ADR-013), not duplicated
- Shadow DOM prevents lesson styles leaking into host pages

### Negative
- The `CustomEvent` deviation from the stated EventBus rule is unenforced by
  tooling, so nothing prevents it from spreading by imitation
- Declares `@stem-tuition/core` and `@stem-tuition/tracer` as dependencies but
  **imports neither** — no EventBus use and no tracer instrumentation, despite
  `docs/policies/OBSERVABILITY.md` and the ROADMAP's "Tracer instrumentation from
  day one" expectation
- DOM-event consumers must attach listeners to the element rather than subscribing
  centrally

### Neutral
- Package is `private: true` — internal to the monorepo, not published
- Registered under Phase 8 (Content & Lessons) in `.phase.json`

## Follow-up

1. Remove the unused `core` / `tracer` dependencies, **or** add the tracer
   instrumentation they imply. Current state satisfies neither.
2. Decide whether `lesson:question-answered` should be an EventBus event; if so,
   supersede this ADR.
3. Add component registry entries (`docs/component-registry/`) for `<stem-lesson>`.

## Files

- `packages/lesson-renderer/src/stem-lesson.ts` — the `StemLesson` component
- `packages/lesson-renderer/src/index.ts` — public surface (`StemLesson` only)
- `packages/lesson-renderer/tests/` — 47 tests, all passing
