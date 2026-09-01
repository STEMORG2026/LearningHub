# Playbook: Tests

**Version:** 3.0.0
**Gate:** Local → PR
**Applies To:** writing tests for a new section kind, narrative feature, or renderer behaviour

---

## Purpose

Tests are the evidence that a change works. This playbook makes "write a test" a
deterministic, single-intent action.

## What to test and where

| Change surface | Test file | What to assert |
|---|---|---|
| `NarrativeContent` composer (`composeNarrativeLesson`) | `packages/content-provider/tests/narrative.test.ts` | Section ordering, fallback when fields missing, metadata derivation (prerequisites, objectives, apps), no LHS internal schema leaks, structured payloads (figures/timeline/perspectives/depthRungs) land on their sections. |
| New section kind rendering | `packages/lesson-renderer/tests/stem-lesson.test.ts` | The kind renders into `.section-<kind>`, badges/structure appear, benign kinds are absent when data missing. |
| Content wiring end-to-end | `apps/shell/tests/narrative-integration.test.ts` | Real export + authored narrative compose into a progressive story; every narrated concept carries attribution + a scaling deep-dive; canonical definition preserved. |
| `lesson-builder` | `apps/shell/tests/lesson-builder.test.ts` | Narrated vs fallback routing; mixed input keeps every lesson. |

## How to write one

1. **[ ] One test, one intent.**
   A test asserts a single behaviour. If a test would need two "because" clauses,
   split it.
2. **[ ] Name it as a claim.**
   Use `should`/`it('...')` that restates the behaviour: `it('renders a figure
   section honouring the person and their words')`. The name is the record of intent.
3. **[ ] Set up the minimal fixture.**
   A `LessonFigure` needs `name`, `role`, `contribution` (contribution is not optional
   in the model); provide the others only where asserted. Do not copy a big narrative
   when a small one suffices.
4. **[ ] Assert the *behaviour*, not the plumbing.**
   Prefer asserting on rendered DOM / public output (`querySelector('.figure-name')`
   text, section `body`) over internal `#private` methods.
5. **[ ] Include a negative case** where meaningful: *absence* when data is missing
   (e.g. no `figure` section when the narrative provides none) — this guards the
   fallback path.
6. **[ ] `exactOptionalPropertyTypes` discipline.**
   In *test fixtures*, omit optional fields rather than setting them to `undefined`
   where the model forbids it, so the fixture typechecks under strict typing.

## Coverage expectation

- New pure-logic modules: **≥95% lines** (current `narrative.ts` is 100%).
- New renderer branches: covered by at least one rendering assertion each.
- Content additions: at least one integration assertion (see `add-content.md` step 11).

## Definition of done

- [ ] At least one test per new behaviour, named as a claim.
- [ ] A negative/fallback case where a meaningful one exists.
- [ ] The owning suite passes: `pnpm test` (and targeted suites).
- [ ] No `[ ]` left because "I didn't know what to assert" — assert the intent.