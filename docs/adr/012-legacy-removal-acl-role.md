---
title: "ADR-012: Legacy Removal & Anti-Corruption Layer (ACL) Scope Realignment"
status: ACCEPTED
date: 2026-08-13
last_updated: 2026-08-13
canonical: true
---

# ADR-012: Legacy Removal & Anti-Corruption Layer (ACL) Scope Realignment

## Status
Accepted  
(Supersedes ADR-004)

## Date
2026-08-12

## Context
ADR-004 established a "Legacy Frozen Zone" in `legacy/` during the early phases of the Strangler Fig migration (ADR-001). `packages/acl` provided adapters (`quiz-adapter.ts`, `audio-adapter.ts`, `canvas-adapter.ts`) bridging v1.0.0 global window state (`window.stemQuizApp`, `window.STEM_QUIZ_DATA`, `window.isAudioMuted`) to modern TypeScript modules.

At commit `b407cc7`, the legacy codebase was fully superseded and removed from the repository in favor of `apps/shell`. A read-only governance audit revealed that:
1. `legacy/` no longer exists in the filesystem.
2. The `no-legacy-imports` and `legacy-no-modern-imports` rules in `.dependency-cruiser.js` were asserting constraints against a nonexistent directory.
3. `quiz-adapter.ts` and `audio-adapter.ts` were functionally dead code reading removed window globals.
4. `canvas-adapter.ts` remains active and necessary as a DOM bridge for background canvas manipulation in `apps/shell`.

A decision was required to formalize the retirement of legacy isolation rules and redefine the role of `packages/acl`.

## Decision
1. **Supersede ADR-004:** The legacy frozen zone is officially closed. No legacy v1.0.0 code remains.
2. **Retire Legacy ACL Adapters:** Delete `quiz-adapter.ts` and `audio-adapter.ts`. Do not preserve legacy/iframe/redirect architecture or mock window globals for hypothetical rollback.
3. **Retain Product-Driven Canvas Adapter:** Retain `canvas-adapter.ts` in `packages/acl` as a lightweight DOM bridge for background canvas operations required by `apps/shell`.
4. **Scope Realignment for ACL:** `packages/acl` is scoped strictly to DOM/browser environment bridges directly required by the active product. It is NOT redesigned into a general-purpose abstraction layer.
5. **Remove Obsolete Dependency-Cruiser Rules:** Remove `no-legacy-imports` and `legacy-no-modern-imports` from `.dependency-cruiser.js`.

## Alternatives Considered
- **Preserve legacy adapters for rollback:** Rejected. Rollback is managed via git history (`v1.0.0` tag) rather than dead code in master.
- **Redesign ACL into a generic abstraction/DI framework:** Rejected. Violates core mandates against premature abstraction and unnecessary framework complexity.
- **Archive `packages/acl` entirely:** Rejected. `canvas-adapter.ts` provides useful, tested DOM interaction logic for `apps/shell`.

## Consequences
### Positive
- Removes ~183 lines of dead adapter code and associated tests.
- Realigns architectural documentation and dependency-cruiser configuration with filesystem reality.
- Clarifies the minimal, current-product-driven role of `packages/acl`.

### Negative
- Breaks any hypothetical external caller relying on `getQuizState()` or `syncMutedState()` from `@stem-tuition/acl` (no such callers exist in the workspace).

### Neutral
- `packages/acl` package metadata (`ARCHITECTURE.toml`, `package.json`) is updated to reflect its trimmed dependencies and API surface.
