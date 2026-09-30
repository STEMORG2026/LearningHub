---
title: "ADR-023: Restore the Verification Gate and the STEMMA Seam"
status: PROPOSED
date: 2026-09-30
canonical: true
---

# ADR-023: Restore the Verification Gate and the STEMMA Seam

## Status

PROPOSED — produced by the master audit of commit `2d4b209`. Requires human ratification of decisions D1, D2, D3 in `03_PROJECT_BIBLE.md` §13 before implementation.

## Context

`[FACT]` As of commit `2d4b20974b2c312c75a44d520adb7d42f8388eee`, `main` is red:

- `turbo typecheck` fails (47/48 tasks). `apps/shell` exits 1 with three errors:
  `learning-path.ts(11,3) TS2305` (missing `getCurriculumMapping`),
  `learning-path.ts(67,53) TS7006` (implicit `any`),
  `lhs-adapter.ts(24,16) TS2352` (missing `generated_at`).
- `turbo test` fails (41/48 tasks). Three packages fail: `core` (a doc missing a `**Version:**` header), `content-engine` (suite cannot load — imports deleted `narratives-batch8`), `apps/shell` (18 failures).
- All 10 GitHub Actions workflows were moved into `.github/workflows-disabled/`, so no automated signal exists to report any of the above.

`[FACT]` All of this originates in two commits made 23 minutes apart on 2026-09-20:

1. **`518615f`** — "chore: sync with empty STEMMA corpus and update sync script." It bumped the **sync script's** `SUPPORTED_EXPORT_VERSION` from `0.2` → `2.1.0`, vendored a corpus with **0 entities** (previously 224), deleted all 8 `narratives-batch1..8.ts` files (~8,494 lines), and stubbed `curriculum-mappings.ts` from 547 → 19 lines. It **did not touch** `apps/shell/src/lib/lhs-adapter.ts` or `lhs-types.ts` — verified: `git show --stat 518615f | grep -c 'lhs-adapter\|lhs-types'` → `0`.
2. **`2d4b209`** — "ci: disable GitHub Actions — run CI locally only."

`[FACT]` The producer and consumer of the STEMMA seam were updated out of step: the script now emits `2.1.0` while the adapter still pins `'0.2'`, and the adapter performs an unvalidated cast (`as LhsKnowledgeExport`) so the mismatch is never caught at runtime — only at typecheck, which is now disabled in CI.

`[FACT]` A **second, healthy implementation of the same seam exists** at `packages/content-provider/src/lhs-adapter.ts` (205 lines) + `types.ts` (210 lines). It is version-tolerant and passes its tests. The codebase therefore already contains the correct pattern to converge on.

`[FACT]` The project's own governance is strong: `lint:arch` reports 645 dependencies and **0 layer violations**, `lint:circular` is clean, 21 of 23 packages' tests pass, and the Playwright E2E suite passes 32/32. The damage is concentrated and shallow, not structural.

`[INFERENCE]` The red state is **treatable**, not architectural. Every defect is 1–2 commits old and mechanically reversible. The single largest risk is not the defects themselves but the **loss of the ability to detect defects** — a red tree with a disabled gate silently degrades, because nothing tells anyone when a new break is introduced.

Alternatives considered (§Alternatives) were rejected because they either leave the detection capability missing, or destroy recoverable data.

## Decision

**Restore the verification gate first, then repair the STEMMA seam, then decide the fate of the disabled workflows.**

Sequenced as three phases, deliberately ordered so that capability is restored before content is repaired:

### Phase 1 — Restore the ability to verify (do this first)

Make `pnpm verify-governance` executable end-to-end again. This means resolving the typecheck and test failures that block it — minimally and reversibly.

### Phase 2 — Repair the STEMMA seam on the shell path

1. **Add an empty-corpus guard** to `scripts/generate/sync-lhs-knowledge.mjs`: if the export contains zero entities, **fail loudly** and write nothing. An empty sync must never be a silent success.
2. **Make `apps/shell/src/lib/lhs-adapter.ts` version-tolerant** in the same manner as the healthy `content-provider` adapter, instead of pinning `'0.2'`.
3. **Replace the unvalidated cast** at `lhs-adapter.ts:24` with a runtime shape check so a mismatched payload is rejected explicitly rather than silently coerced.
4. **Loosen `generated_at`** in `lhs-types.ts` to optional, or make the adapter synthesize it — the field is absent from valid empty/partial exports.
5. **Restore `curriculum-mappings.ts`** from git history (`518615f^`) and re-export `getCurriculumMapping` — subject to decision **D2** (restore vs retire).

### Phase 3 — Re-enable automated verification (subject to decision D3)

Move the workflows back from `.github/workflows-disabled/` **only after Phase 1 is green and the human confirms the disabling was not deliberate and permanent.** Until then, document the local-only invocation prominently in `AGENT_BOOTSTRAP.md`.

### Explicitly out of scope

- No new features.
- No refactor beyond the four seam fixes.
- No deletion of `legacy/`, no change to the frozen zone.
- No re-implementation of `content-provider`'s adapter — converge shell *toward* it, do not merge or duplicate further.

## Alternatives Considered

| Option | Why rejected |
|---|---|
| **A. Fix the tests only, leave CI disabled** | Restores green locally but keeps the detection gap. The next break goes unnoticed again. Rejected: capability-before-content ordering is the core insight here. |
| **B. Delete `learning-path.ts` and its consumers** | Discards recoverable, working code to avoid a 547-line restore. Rejected as destructive when the data is one `git show` away. |
| **C. Bump the shell adapter to `'2.1.0'` and re-pin** | Reproduces the exact failure mode that caused this incident: a hard pin that silently desynchronises when the producer moves. Rejected in favour of version tolerance. |
| **D. Re-run the sync against the live STEMMA repo first** | Cannot be validated until U1 (`../STEMMA/exports/knowledge.json` contents) is known, and would not prevent the same silent-empty outcome recurring. Deferred to Phase 1 of the plan, after the guard exists. |
| **E. Full Strangler Fig continuation (extract more packages)** | Expands surface while the gate is down. Rejected on risk grounds. |

## Consequences

**Positive**

- `pnpm verify-governance` becomes runnable again — the project regains the ability to detect regressions.
- The STEMMA seam stops failing silently in two of four independent ways.
- The shell adapter converges on the pattern already proven in `content-provider`, reducing divergence between the two implementations.
- Deleting the empty-corpus failure mode means a bad sync can never again be committed as routine.

**Negative / accepted costs**

- Requires touching a file (`lhs-adapter.ts`) that has been stable and which the audit forbade modifying during the audit itself.
- Version tolerance trades compile-time strictness for runtime validation — accepted, because the strict pin demonstrably failed.
- If decision **D3** is "keep CI disabled", the gate remains a human-discipline obligation rather than an enforced one. This is an accepted residual risk, recorded in `07_FINDINGS_AND_RISKS.md`.

**Follow-ups created by this decision**

- **REL-004** — `EventBus.dispatchToLocal` has no error isolation (`packages/core/src/event-bus.ts:72-78`). One throwing subscriber aborts delivery to all later subscribers. Empirically reproduced during this audit. Small, adjacent, and in the same critical path — recommended as the first ticket *after* the gate is green.
- **DOC-001** — `VISION.md` still claims ACP, which ADR-022 re-scoped away. Requires a `SUPERSEDED` header or an amendment.
- Doc-governance header fix for the one failing `packages/core` test.
- `tree.txt` regeneration (currently stamped `4904c3f`, 3 commits stale vs `2d4b209`).

## Related

- ADR-001: Strangler Fig Migration
- ADR-003: Event Bus Communication (the primitive whose error isolation is REL-004)
- ADR-004: Legacy Frozen Zone
- ADR-013: Content Provider (owns the healthy duplicate STEMMA seam)
- ADR-022: Ecosystem Architecture (source of the superseded ACP claim)
- `07_FINDINGS_AND_RISKS.md` — REL-001, REL-002, REL-003, REL-004, ARCH-001, DOC-001
- `09_NEXT_STEP_DECISION.md` — Candidate A, score 490/500, Confidence High
- `10_IMPLEMENTATION_PLAN.md` — Phases 0–5, tickets T1–T11, First 5 PRs
