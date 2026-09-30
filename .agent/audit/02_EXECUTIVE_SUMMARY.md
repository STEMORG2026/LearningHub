# 02 — EXECUTIVE SUMMARY

**Repository:** LearningHub · **Audit baseline:** `2d4b209` (`main`) · **Date:** 2026-09-30 · **Mode:** FULL audit

---

## What it is

LearningHub is a **pnpm + Turborepo TypeScript monorepo** — 23 packages, 1 app (`apps/shell`) — positioned as a **product-agnostic STEM learning foundation**: knowledge models grounded in STEMMA exports, framework-agnostic Web Components, pure simulation logic, an event bus (`@learninghub/core`), and execution tracing. Version `3.0.0`, private, Node `>=22.13`. It is meant to be consumed by sibling products (STEM Tuition, STEM Lab, STEM Game) and by **PROFESSOR-J**, the ecosystem's AI orchestration layer — under the split *"LearningHub is the Information Head; PROFESSOR-J is the Worker"* (ADR-022). ~13k lines of source, 45 test files, 136 docs, 29 MB, 200 commits over ~5 months. Quality of governance is genuinely high: a 13-stage verify gate, machine-readable doc status headers, per-package coverage ratchets, enforced architecture layering (ADR-001 Strangler Fig).

## The headline

**`main` is RED — and it is one bad day's work, not a broken product.**

Two commits 23 minutes apart on 2026-09-20 caused all of it:

- **`518615f`** synced an **empty** STEMMA corpus (0 entities, down from 224), bumped the *sync script* to `2.1.0`, deleted all 8 narrative batch files (~8,494 lines), and stubbed `curriculum-mappings.ts` from 547 → 18 lines — **without touching the consumer adapter**, which still pins `'0.2'`.
- **`2d4b209`** then moved all 10 GitHub Actions workflows into `.github/workflows-disabled/`.

The producer moved; the consumer didn't. The seam broke four independent ways at once, and then the alarm that would have reported it was switched off. The tree has been red and silent for 10 days.

## Health scorecard (all verified by execution, not inspection)

| Signal | Result |
|---|---|
| `turbo typecheck` | ❌ 47/48 tasks — 3 errors in `apps/shell` |
| `turbo test` | ❌ 41/48 tasks — `core`, `content-engine`, `apps/shell` |
| Playwright E2E | ✅ 32/32 |
| `lint:arch` | ✅ 645 deps, **0** layer violations |
| `lint:circular` | ✅ Clean |
| `pnpm verify-governance` | ⚠️ Cannot complete (includes `typecheck`) |
| CI | ❌ All workflows disabled |

**Severity: 0 × P0 · 3 × P1.** No data loss, no security exposure, no corrupted architecture. 21 of 23 packages pass their tests.

## The three P1s

1. **REL-001 — Typecheck fails.** Three errors: missing `getCurriculumMapping`, an implicit `any`, and `TS2352` from a non-optional `generated_at` absent in the empty corpus.
2. **REL-002 — Tests fail in three packages.** `content-engine`'s test **file** cannot be collected — `tests/engine-gate-batch8.test.ts:17` imports `../../../apps/shell/src/data/narratives-batch8`, deleted by `518615f`. (Its other 48 tests pass; only this one file fails to load.)
3. **REL-003 — No verification signal.** CI is disabled while dependabot is still live, so dependency PRs have been merged unverified.

Plus one **latent defect I promoted from hypothesis to verified** by reproducing it (**REL-004**): `EventBus.dispatchToLocal` (`packages/core/src/event-bus.ts:72-78`) has **no error isolation** — when one subscriber throws, all later subscribers are silently skipped. This is the *mandated* cross-package communication primitive, so a single bad handler can mute an entire topic. The fix is ~5 lines.

## The verdict on the roadmap

The 12-phase roadmap is **substantially genuine** — phases 1–9 have visible deliverables (branch names, ADR-001…022, extracted packages). Two documents are stale: `VISION.md` still claims ACP, which **ADR-022 explicitly re-scoped away**, and the README's "🟢 Active Evolution" badge contradicts 10 days of silence with CI off. Six packages (`pj-client`, `pj-auth`, `pj-audit`, `pj-policy`, `ecosystem-dashboard`, `cross-repo-visibility`) have **zero consumers** — integration surfaces built ahead of sibling repos that never arrived. That's deferred work, not rot.

## The decision

**Route 10A — internal repair.** Confidence **High**. The winning candidate scored **490/500**: *"Restore the verification gate and the STEMMA seam."*

The reasoning is a single insight: **restore the ability to detect problems before repairing the problems.** Fixing the code while leaving the gate down just re-creates the conditions for the next silent break. So:

1. **Phase 1 —** make `pnpm verify-governance` runnable again.
2. **Phase 2 —** repair the seam: add an **empty-corpus guard** to the sync script (zero entities must fail loudly), make the shell adapter **version-tolerant** by converging on the *already-healthy* `content-provider` adapter, replace the unsound cast with a runtime check, make `generated_at` optional, and restore `curriculum-mappings.ts` from git.
3. **Phase 3 —** re-enable workflows **only after the gate is green and a human confirms the disabling wasn't deliberate.**

Everything is 1–2 commits old and recoverable with `git show 518615f^:<path>`. Nearly all of it is git-reversible.

## Three decisions I will not make for you

| # | Decision | Recommendation |
|---|---|---|
| **D1** | Hard-pin the adapter to `2.1.0`, or make it version-tolerant? | **Version-tolerant** — hard pins are what caused this |
| **D2** | Restore `curriculum-mappings.ts` (547 lines), or retire `learning-path.ts` from it? | **Restore** — the data is one command away |
| **D3** | Was disabling CI a deliberate, permanent choice? | **Ask** — do not re-enable unilaterally |

## Honesty notes

During this audit I **self-corrected three claims** and recorded them rather than hiding them: (a) I wrongly asserted "zero CI workflow files exist" — they exist, just disabled; (b) I flagged a check script as possibly missing — it exists, all 12 do; (c) I inferred the shell adapter had been broken long before `518615f` — **git archaeology proved the opposite**, the `'0.2'` pin was *correct* until that commit. That retraction lives in `09_NEXT_STEP_DECISION.md`.

**Residual gaps, disclosed:** `CONSTITUTION.md` + `RULES.md` (~2,828 lines) and 6 narration-playbook docs were not read; coverage was complete at the file-manifest level (502 entries, 491 FULL_READ) with deep reads of every architecturally load-bearing file.

## The ask

Ratify D1–D3. Then execute `.agent/audit/10_IMPLEMENTATION_PLAN.md` — 6 phases, 11 tickets, and a defined First 5 PRs. **Full recovery is a small, sequenced, well-understood body of work.** The expensive part was finding out what was actually wrong, and that part is done.

---

*Read next:* `03_PROJECT_BIBLE.md` (complete context) · `07_FINDINGS_AND_RISKS.md` (defects) · `AGENT_BOOTSTRAP.md` (fast boot for any agent) · `docs/adr/023-restore-verification-gate-and-stemma-seam.md`
