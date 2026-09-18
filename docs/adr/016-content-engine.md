---
title: "ADR-016: General-Purpose Content-Engine Seam (architecture v2)"
status: ACCEPTED
date: 2026-09-02
last_updated: 2026-09-02
canonical: true
---

# ADR-016: General-Purpose Content-Engine Seam (architecture v2)

**Status:** Accepted
**Date:** 2026-09-02
**Owner:** Architecture
**Related:** `ADR-013` (Content Provider), `ADR-014` (Lesson Renderer),
`docs/architecture/content-production-engine-v2.md`

---

## Context

STEM-TUITION produces narrated lessons for canonically-present concepts via a manual
authoring loop (the 47 authored `NarrativeContent` entries) and a documented v1
"narration pipeline" (`docs/guides/task-playbooks/narration/` + `scripts/narrate/`). The
review in `docs/architecture/content-production-engine-v2.md` found that v1 is a
**single-content-type, single-format** design with five unjustified agents, a single
average-score publication gate, no request model, no planning artifact, no intent/essence
verification, and whole-artifact revision — all of which would break the moment STEM-TUITION
must produce any other content type (quiz, simulation, textbook chapter, lab script, a
future format) for an arbitrary grade/system/level.

A general-purpose **content-production engine** is needed that is driven by a request and
declarative format specifications, not by hardcoded product assumptions.

## Decision

Introduce a **`packages/content-engine/`** package that establishes the engine **seam**
(architecture v2, increments N1–N3). It is pure types + deterministic functions — it does
**not** change the live renderer, does not remove or rewrite the 47 published narratives,
and does not yet wire in any LLM runner. It only defines the contracts the real pipeline
will plug into.

Three things are landed:

1. **A declarative format contract (`FormatSpec` + `FormatRegistry`)** — the single
   extension point for new content types. The existing `narrative-lesson` shape is
   registered as the first concrete spec; its output schema is the established
   `NarrativeContent` interface. New formats are added to the registry, never coded as
   `if format …` branches in the core.

2. **A generic, optional-heavy `ContentRequest` + `Blueprint`** — the request model and the
   planning artifact. Only `topic` + `intent` are required; grade, subject, curriculum,
   language, format, length, level are all optional request data and are never invented by
   the engine. The `Blueprint` is where requirements become explicit and traceable
   (decisions tagged from-request / inferred / flagged-missing).

3. **Hard-gate verification + repair routing** — publication is decided by per-gate
   PASS/FAIL (`evaluateGates`), never a single average score. Deterministic validators
   (`validateConceptCoverage`, `validateNarrativeStructure`) are LLM-free. An
   LLM-agnostic verifier seam is declared for factual / LHS-fidelity / pedagogical /
   format, plus the critical **intent/essence** verifier (`INTENT_ESSENCE_VERIFIER`) that
   asks "did the artifact accomplish what was intended as an experience?" — independent of
   factual checks. `routeRepair` / `repairOrders` map a failed gate to the stage that caused
   it (targeted revision, not whole-artifact regeneration).

### Boundary (LHS / STEM-TUITION)

The engine composes with canonical LHS knowledge and never overwrites it. External research
may raise a `canonical-review-signal` but cannot silently replace an LHS fact. The current
generation always composes with LHS as the source of truth.

## Alternatives Considered

**1. Keep extending the v1 narration pipeline.** Rejected — v1 produces exactly one
`NarrativeContent` shape via a fixed five-role line. Extending it would cement the
single-format, whole-artifact, average-score architecture the review rejected.

**2. A full engine with LLM runners wired now.** Rejected for this increment — the review
contract (§24) and the migration plan (N1–N3 first) stage this. The seam is defined first so
a runner (workflow/litellm/…) can be attached later without redesign. Building pure
contracts now also keeps the package testable without network/tooling.

**3. One agent per v1 role (Researcher/Writer/Reviewer/Master-Reviewer/Animator).**
Rejected — the review's §5 need-test dissolves these into verifiers and format generators;
an agent is only justified where it gives a clean reasoning boundary.

## Consequences

### Positive
- New content types are **additive** (`FormatSpec` registration) — no core rewrite, no
  `if story / if textbook` branches.
- Grade / subject / curriculum / format are **request data**, not architecture — §16 / §17
  / §18 hold.
- Publication is **hard-gated** — no average score can mask a critical failure.
- `intent/essence` verification exists as a first-class, separate gate — §6.
- Targeted repair (`routeRepair`) instead of whole-artifact regeneration — §13.
- The 47 live narratives and the renderer are untouched.

### Negative
- The engine is a **seam** only: no LLM runner yet, so it does not autonomously produce
  content until a runner attaches.
- Two packages now express "content": `content-provider` (the application model) and
  `content-engine` (production contracts). They are deliberately separate: the former is the
  runtime model, the latter the production pipeline. The boundary is documented here.
- `narrative-lesson` as the first FormatSpec means `NarrativeContent` is now both a runtime
  model and a format output schema — acceptable because it is the same shape, but noted.

### Neutral
- `packages/content-engine/` is `private: true`, registered under Phase 8 (Content & Lessons).
- `ARCHITECTURE.toml` records its contracts and lifecycle (experimental / incubating).

## Follow-up (migration plan N4–N6)

Status: **N4–N6 landed 2026-09-02.**

1. ✅ **Wire an LLM runner** (`packages/content-engine/src/pipeline.ts`): `produce()` drives
   `Blueprint → Generation → verification → repair → publish/hold/reject`, producing
   `Artifact`s for the `narrative-lesson` format first. It is LLM-agnostic — semantic
   boundaries are injected callbacks (`FormatGenerator`, `SemanticVerifier`), so it runs
   testably without a network and a real runner (workflow/litellm/…) supplies those callbacks.
2. ✅ **Add a second non-narrative `FormatSpec`** (`quiz`) to the registry — the additive
   extension point with zero core change (`FormatRegistry` now defaults to
   narrative-lesson + quiz).
3. ✅ **Demote the v1 narration playbook** to a reference for the `narrative-lesson` format
   (deprecation banner + v1→engine responsibility mapping in
   `docs/guides/task-playbooks/narration/README.md`); `scripts/narrate/` is deprecated.
4. ⏳ Evolve `content-engine` from `experimental`/`incubating` per `PACKAGE_LIFECYCLE.md` once
   a production runner is deployed (currently the seam + pipeline runner are verified and
   land the generated `Artifact`s; a live litellm/workflow attachment is the next step).

## Files

- `packages/content-engine/src/request.ts` — `ContentRequest` model
- `packages/content-engine/src/formats.ts` — `FormatSpec`, `FormatRegistry`, `narrative-lesson` + `quiz` specs
- `packages/content-engine/src/blueprint.ts` — `Blueprint`, `planFromRequest`, `resolveFormats`
- `packages/content-engine/src/verification.ts` — hard-gate verification + repair routing
- `packages/content-engine/src/pipeline.ts` — `produce()` pipeline runner (Request → generate → verify → repair → publish)
- `packages/content-engine/src/index.ts` — public surface
- `packages/content-engine/tests/` — 23 tests, all passing
- `docs/architecture/content-production-engine-v2.md` — the full architecture review (supersedes the v1 narration-pipeline as the general engine)