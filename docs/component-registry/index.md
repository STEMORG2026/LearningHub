# Component Registry

**Version:** 2.0.0
**Purpose:** Living index of every component, module, and data store in STEM-TUITION. Updated on every change.

---

## Purpose

When debugging, you see a problem (e.g., "score shows 0 when it should be 8") and need to find the code immediately. The Component Registry tells you the exact file and line number for every piece of functionality.

**Every component, every store, every API endpoint, every test — mapped to its source location.**

---

## Registry Files

| File | What it maps |
|------|-------------|
| `RENDERING.md` | Every Web Component, HTML template, and CSS file → file:line |
| `STATE.md` | Every stateful module, store, and reactive value → file:line |
| `NETWORKING.md` | Every API call, event bus subscription, and external connection → file:line |
| `EDUCATIONAL.md` | Every learning module and its educational metadata → file:line |
| `TESTING.md` | Every test file and what it covers → file:line |
| `TRACE.md` | Every traced function, its parent span, and child spans → file:line |

---

## Update Rule

Every time you add, move, or change a component's file location, you MUST update the corresponding registry entry.

**Enforcement:** `pnpm lint:registry` verifies that the registry is up to date. Failure blocks merge.

---

## Current Status

| File | Entries | Last Updated | Status |
|------|---------|-------------|--------|
| `RENDERING.md` | 6 | 2026-07-30 | ✅ Up to date |
| `STATE.md` | 6 | 2026-07-30 | ✅ Up to date |
| `NETWORKING.md` | 4 | 2026-07-30 | ✅ Up to date |
| `EDUCATIONAL.md` | 2 | 2026-07-30 | ✅ Up to date |
| `TESTING.md` | 4 | 2026-07-30 | ✅ Up to date |
| `TRACE.md` | 2 | 2026-07-30 | ✅ Up to date |

---

## Quick Find Table

| Feature | Package | Key File | Line |
|---------|---------|----------|------|
| Event Bus | `packages/core/` | `src/event-bus.ts` | See RENDERING.md |
| Shared Types | `packages/core/` | `src/types.ts` | See RENDERING.md |
| Tracer | `packages/tracer/` | `src/tracer.ts` | See RENDERING.md |
| Audio Synth | `packages/audio-synth/` | `src/synth.ts` | See RENDERING.md |
| Quiz ACL Adapter | `packages/acl/` | `src/quiz-adapter.ts` | See NETWORKING.md |
| Canvas ACL Adapter | `packages/acl/` | `src/canvas-adapter.ts` | See RENDERING.md |
| Quiz Engine | `packages/quiz-engine/` | `src/internal/quiz-engine.ts` | See RENDERING.md |
| <stem-quiz> | `packages/quiz-engine/` | `src/internal/web-component.ts` | See RENDERING.md |
| Hover Engine | `packages/hover-engine/` | `src/hover-state.ts` | See RENDERING.md |
| Physics Core | `packages/simulation-core/` | `src/gravity.ts` | See RENDERING.md |
