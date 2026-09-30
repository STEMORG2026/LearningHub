# ADDENDUM — Re-characterization of commit `518615f`

**Written:** 2026-09-30, during remediation (Phase 1)
**Supersedes the characterization in:** `07_FINDINGS_AND_RISKS.md` REL-002, `DATA-001`, `COR-001`
**Status:** `[FACT]` — verified by direct file comparison against `git show 518615f^:…`

---

## What the original audit said

The audit characterized `518615f` as an **accidental** break: the producer (sync script) was updated and the consumers were "not touched", producing three typecheck errors and three failing test packages. REL-002 described the `content-engine` failure as *"the test was never updated"* — implying an oversight.

## What is actually true

`[FACT]` `518615f` was a **coherent, deliberate content-retirement commit**, not an accident. Evidence:

| File | Before `518615f` | After `518615f` | Interpretation |
|---|---|---|---|
| `apps/shell/src/data/narratives.ts` | 53 lines — lazy `Promise.all([import('./narratives-batch1')…batch8])` loader | 14 lines — `Stub: no narrative data available` / `return {}` | **Deliberately stubbed** |
| `apps/shell/src/data/narratives-batch1..8.ts` | 8 files, ~8,494 lines | **all 8 deleted** | **Deliberately deleted** |
| `apps/shell/src/data/curriculum-mappings.ts` | 553 lines, 6 curricula, 7 grade mappings | 18 lines, `CURRICULUMS = {}` | **Deliberately stubbed** |
| `apps/shell/src/data/knowledge.json` | `0.2`, 224 entities, `generated_at` present | `2.1.0`, 0 entities | **Deliberately emptied** |

`[FACT]` Every content-bearing file was stubbed with the **same style of marker**:

- `curriculum-mappings.ts`: `* Stub: no curriculum data available.`
- `narratives.ts`: `* Stub: no narrative data available.`

`[FACT]` This is a **consistent, intentional sweep** — a deliberate decision to strip all consumer-owned authored content out of the repository. It was not a partial or accidental edit.

## What was *actually* accidental

`[FACT]` The commit **failed to update four consumers** that referenced the retired content:

| Consumer | Still references | Result |
|---|---|---|
| `apps/shell/src/lib/lhs-adapter.ts` | pins `'0.2'`, unsound cast, requires `generated_at` | 6 test failures |
| `apps/shell/src/lib/lhs-types.ts` | `generated_at: string` non-optional | TS2352 |
| `apps/shell/src/lib/learning-path.ts` | imports `getCurriculumMapping`, `CURRICULUMS`, `mapping.topics[]` | 9 test failures |
| `packages/content-engine/tests/engine-gate-batch8.test.ts` | imports deleted `narratives-batch8` | file cannot collect |

`[FACT]` Additionally, four test files still **assert against the retired content**:

- `narrative-integration.test.ts` — asserts `narrated.length >= 65` (was "57 canonically-narrated physics + batch-8's 8 mechanics")
- `lesson-builder.test.ts` — 1 test needs a concept that has a narrative
- `lhs-demo.test.ts` — 1 test renders knowledge from the export
- `lhs-adapter.test.ts` — 6 tests read the export

## Corrected failure inventory (verified, not estimated)

`[FACT]` Full shell test run: **18 failures across 5 files** — supersedes both the audit's "18 failures" (correct total, wrong attribution) and the early `00_AUDIT_STATE.md` "4 packages fail" note.

| File | Failed |
|---|---|
| `tests/learning-path.test.ts` | 9 |
| `tests/lhs-adapter.test.ts` | 6 |
| `tests/narrative-integration.test.ts` | 2 |
| `tests/lhs-demo.test.ts` | 1 |
| `tests/lesson-builder.test.ts` | 1 |
| **Total** | **18** |

`[FACT]` Plus `packages/core` (1 — fixed: missing `**Version:**` header) and `packages/content-engine` (1 file cannot collect).

## Why this matters for remediation

`[INFERENCE]` The distinction changes the *correct fix*:

- If the retirement was **intentional**, then the consumers and tests must be **updated to match the new, content-free reality** — not have the content resurrected. Restoring 8,494 lines of narratives against the author's explicit decision would be **overriding a deliberate product call**.
- The **only** unambiguous defects are the four consumers left dangling. Those must be reconciled.

`[CONTRADICTION — for human resolution]` **D2 is now sharper.** The audit recommended "restore `curriculum-mappings.ts` (the data is one `git show` away)." But the evidence shows it was **deliberately stubbed**, with the same marker style as `narratives.ts`. Restoring it would contradict the author's intent. **This requires a human decision — it cannot be inferred.**

`[UNKNOWN]` *Why* the content was retired (license? upstream move? re-authoring planned?) is not recorded in the commit message, which reads only `chore: sync with empty STEMMA corpus and update sync script`. `[RECOMMENDATION]` Ask the author before restoring anything.

## Consequence for ADR-023

ADR-023 Phase 2 step 5 ("Restore `curriculum-mappings.ts` from git history") is **suspended pending D2**. The rest of ADR-023 stands. Phase 1 (restore the gate) proceeds regardless, because a green gate is required either way.
