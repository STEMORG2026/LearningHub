# 09_NEXT_STEP_DECISION.md — LearningHub Audit

> **Audit date:** 2026-09-30 · **Mode:** FULL · **Branch:** `main` · **Commit:** `2d4b20974b2c312c75a44d520adb7d42f8388eee` · **Worktree:** CLEAN
> Valid only for the recorded commit and worktree state. Review all changes since this commit before relying on these conclusions.

**Routing:** **10A (internal)** — justified in `06_REQUIREMENTS_AND_GAP_ANALYSIS.md` §Phase 9. Confidence **High**.

---

## 1. Priority-tier placement

Per Phase 10A, a lower tier never overrides an unresolved higher tier:

| Tier | Description | Populated? |
|---|---|---|
| 1 | Active security / privacy / data-loss risk | **No** — none found (no P0) |
| 2 | **Broken build, startup, deploy, or critical user path** | **YES** — `REL-001` (typecheck red), `REL-002` (tests red, one suite won't load), `DX-001` (CI disabled) |
| 3 | Data integrity / migration correctness | Partially — `DATA-001` (empty corpus) is data-availability rather than integrity |
| 4 | Work blocking all other development | **YES** — a red `verify-governance` blocks every agent following `AGENTS.md` |
| 5 | Partially implemented committed functionality | YES — Phases 7/8 open; 7 orphan packages |
| 6 | Failing/missing tests for critical behavior | YES — `TEST-001` |
| 7 | Next incomplete roadmap item | Blocked by tier 2 |
| 8 | Reliability / operational gaps | YES — `REL-003` |
| 9 | High-impact technical debt | YES — `ARCH-001`, `DX-002` |
| 10 | Product improvements | n/a |

**Tier 2 is the top non-empty tier.** Candidates are drawn from it, with `DATA-001` (tier 3) attached because its root cause is shared with tier 2.

---

## 2. Candidate scoring

Weights per spec: User/business impact 25 · Unblocks other work 20 · Risk if delayed 20 · Architecture & roadmap alignment 15 · Effort efficiency/feasibility 10 · Evidence confidence 10. Each criterion scored 0–5, then × weight / 5.

| # | Candidate | Impact (25) | Unblocks (20) | Risk-if-delayed (20) | Align (15) | Feasible (10) | Evidence (10) | **Total /500** |
|---|---|---|---|---|---|---|---|---|
| **A** | **Restore the verification gate + STEMMA seam** (T1–T7) | 5 (125) | 5 (100) | 5 (100) | 5 (75) | 4 (40) | 5 (50) | **490** |
| B | Re-author/recover narrative content (8,494 lines) | 4 (100) | 2 (40) | 2 (40) | 4 (60) | 2 (20) | 4 (40) | **300** |
| C | Consolidate the duplicated STEMMA adapter into `content-provider` | 3 (75) | 3 (60) | 3 (60) | 5 (75) | 3 (30) | 4 (40) | **340** |
| D | Re-enable CI only (no code fix) | 2 (50) | 3 (60) | 2 (40) | 4 (60) | 5 (50) | 5 (50) | **310** |
| E | Single-source the TS/vitest toolchain (`DX-002`) | 2 (50) | 3 (60) | 2 (40) | 3 (45) | 2 (20) | 4 (40) | **255** |
| F | Build the ACP orchestration plane | 2 (50) | 2 (40) | 1 (20) | 1 (15) | 1 (10) | 3 (30) | **165** |
| G | Instrument Phase 8 packages with tracer/EventBus | 3 (75) | 2 (40) | 2 (40) | 4 (60) | 3 (30) | 4 (40) | **285** |
| H | Test `tracer/dashboard.ts` (0% → meaningful) | 1 (25) | 1 (20) | 2 (40) | 3 (45) | 3 (30) | 5 (50) | **210** |
| I | Rewrite `SECURITY.md` scope (`SEC-001`) | 2 (50) | 1 (20) | 3 (60) | 4 (60) | 5 (50) | 5 (50) | **290** |

### Tie-breakers applied (in order)
A wins outright, so no tie-break was needed. Ordering check against the specified tie-breakers: A unblocks the most (every other candidate is gated on a green gate), has the strongest evidence (direct command output, not inference), is the smallest safe vertical slice (all changes are git-reversible text files, no irreversible step), is the most clearly verifiable (`pnpm verify-governance; echo $?`), and reduces the most uncertainty (it converts the repo from "unknown state" to "known state").

---

## 3. Selection

### Primary work package (exactly one)
**Restore the verification gate and re-establish the STEMMA knowledge seam.**
Full plan: `10_IMPLEMENTATION_PLAN.md`. Tickets T1–T7 (MUST) + T8–T10 (SHOULD).

**Smallest high-leverage vertical slice:** PR #1 (a 2-line doc header that greens the `core` suite) through PR #3 (`pnpm typecheck` → exit 0). That three-PR slice alone converts the repo from "no one can verify anything" to "the type-checker and 23 of 24 test suites are trustworthy."

**Why now:**
- The damage is **one commit old and fully understood**. `518615f` → `2d4b209` is a 23-minute window. The diff is enumerated; the fix is mechanical; nothing has landed on top.
- **Zero irreversible steps.** Every file involved is git-tracked text. `git revert` fully reverses everything. This is the cheapest this work will ever be.
- **Every other candidate is gated on it.** Candidate B (content) needs the corpus (T5). C, E, G need green tests. I documents a system whose shape T1 changes. D alone would just make CI red honestly.
- **The 3 open decisions are all answerable in one conversation** (Phase 0, effort XS).

**Evidence:** REL-001, REL-002, DX-001, DATA-001, DOC-001, COR-001, TEST-001, DOC-003 (all in `07_FINDINGS_AND_RISKS.md`).

**What it unlocks:**
1. A trustworthy gate — the precondition for every subsequent change.
2. A working STEMMA seam — the precondition for any content-facing work.
3. A **correct `.phase.json`** so the release pipeline's bump guard (`scripts/release/release-version.mjs`, which reads it) can function.
4. Coverage measurement for 20 currently-unmeasured packages.
5. CI regains the ability to catch the *next* `518615f`.

**Risk reduced:** The dominant risk in this repository today is **silent regression** — a change that breaks the build, ships, and is discovered months later. That risk is currently unmitigated (CI off, tests red, nobody looking). This package closes it.

**Why competing candidates wait:**
- **B (narrative content)** — restoring 8,494 lines into a system whose data source is empty is backwards; corpus first. Also a product decision, not an engineering one.
- **C (adapter consolidation)** — correct, but rewriting 3 test files on top of a red suite means never knowing which failure is new. Do it on a green base.
- **D (CI only)** — would make the pipeline fail visibly. Honest, but it converts a hidden problem into a noisy one without fixing anything.
- **E (toolchain)** — churning TS 5→7 and vitest 3→4 while the gate is red is how you lose the ability to bisect.
- **F (ACP plane)** — violates `ECOSYSTEM.md:188` and `ADR-022`; no consumer exists.
- **G (tracer instrumentation)** — the long-standing roadmap gap, but it's a *feature* addition on an unverifiable base.
- **H (`dashboard.ts` coverage)** — a real gap, but low impact and not blocking.
- **I (`SECURITY.md`)** — should be rewritten *after* T1, because T1 changes the integration surface the policy must describe.

**Definition of done:**
`pnpm verify-governance` exits **0** on `main`; `pnpm typecheck` and `pnpm test` are 48/48; the STEMMA adapter loads a non-empty corpus (or fails loudly with an actionable message); `.github/workflows/ci.yml` is active; `.phase.json` matches `git log`; coverage is measured for all 24 packages.

---

## 4. Follow-ups (max 3)

| # | Follow-up | Why it follows | Ticket |
|---|---|---|---|
| 1 | **Consolidate the duplicated STEMMA seam into `packages/content-provider`** | Permanently removes the root cause of DOC-001 and ARCH-001 (two adapters, two `LhsEntity` shapes, one of them with 0% coverage). Needs a green base. | T-C |
| 2 | **Measure + ratchet real coverage; address `tracer/dashboard.ts` at 0%** | `AGENTS.md` claims a ≥95% core-logic bar that is enforced nowhere. Cannot be measured until tests are green. | T10 |
| 3 | **Single-source the toolchain (`DX-002`)** | 24 packages declare vitest ranges the resolver overrides. Only safe to change with CI watching. | T-E |

---

## 5. Deferred (with reasons)

| Deferred | Reason |
|---|---|
| Recover/author narrative content | Gated on T5 + a product decision; large scope |
| ACP / JSON-RPC orchestration plane | Contradicts `ADR-022`; no consumer; `ECOSYSTEM.md:188` forbids premature platform work |
| Any work on the 7 orphan `pj-*` / ecosystem packages | Zero consumers (grep-verified) |
| Product-agnosticism remediation (`C1`) | Product decision, needs an ADR, would break `e2e/critical-path.spec.ts` |
| `SEC-001` (`SECURITY.md` rewrite) | Must follow T1, which changes the surface to be documented |
| Restoring `legacy/` handling docs (`ARCH-002`) | Documentation-only; ADR-004 is already `SUPERSEDED` — needs a documentation pass, not engineering |
| Deleting the 6 stale local branches | Housekeeping; requires owner confirmation that the work is truly abandoned |

---

## 6. "Do not do yet" list
See `10_IMPLEMENTATION_PLAN.md` §11.8 NOT-TO-BUILD. Summary: no ACP plane, no orphan-package features, no in-repo model client, no `VITE_OPENROUTER_API_KEY` wiring, no mobile app, no tuition-estimator removal, no toolchain migration, no narrative restore. Each has a specific, cited reason.

---

## 7. Pre-mortem — "It failed six months after shipping. Why?"

This work package is a *repair*. Its failure mode is regression: the gate goes green, then drifts red again unnoticed. Five ways that happens:

| # | Failure mode | Early warning signal | Prevention | Mitigation | Exit/rollback |
|---|---|---|---|---|---|
| 1 | **CI re-enabled, then disabled again** for an unrelated flake | A commit with `ci:` and `disable` in the subject; `.github/workflows/` emptying | Make T7 a PR that a reviewer must approve; add a `verify-governance`-runs-locally requirement to `CONTRIBUTING`/`AGENTS.md`; add a note in `ci.yml` explaining why it must stay on | Renew a short-lived "CI is required" reminder; document the re-enable date in `DEVLOG.md` | `git mv` back — but institutional memory is the real loss |
| 2 | **The corpus empties again** and someone syncs it silently | `entity_count: 0` in `knowledge.json` on a diff | T4's empty-corpus guard + `--allow-empty` explicitness; surface `entity_count` in `REPOSITORY_HEALTH.md` | Guard already fails loudly; re-run with a real `LHS_ROOT` | `git checkout apps/shell/src/data/knowledge.json` |
| 3 | **The adapter drifts from the export schema again** — a v2.2 export lands and nobody updates the types | A sync commit touching `export_version` without a matching `lhs-types.ts` change | T1's contract test asserting the *vendored* file parses through the adapter — this fails the moment they diverge | The contract test localises it to one file | Revert the adapter change independently of the export |
| 4 | **The restored `curriculum-mappings.ts` is wrong** — the pre-`518615f` implementation is resurrected but was itself already stale | `learning-path.test.ts` passes but real curricula render empty | 15 existing tests act as the specification; run them explicitly in T2's acceptance criteria | Restore from a different commit (`git log --all` for the file) or retire `learning-path.ts` per D2 | Delete the file; `git checkout` |
| 5 | **Phases 7/8 are "closed" cosmetically** without the work, re-creating the DOC-003 class of drift | A `.phase.json` edit with no corresponding code or ticket | T8 requires naming the remaining item for any phase not genuinely closed; `docs-sync.mjs:126 assertNoUnregisteredPackages` already guards the inverse case | `strict-doc-governance.mjs` [5/10] checks ROADMAP phase tables — extend it to cross-check `git log` | Revert the `.phase.json` commit |

**Structural pre-mortem insight:** all five failures are *detection* failures, not *implementation* failures. The single highest-value mitigation is therefore #1 — a working CI pipeline. Everything else is a secondary net. This is why T7, despite being MoSCoW `SHOULD`, is the item with the longest half-life.

---

## 8. Fallback and validation-first option

**Fallback (if a key assumption fails):**
If `[ASSUMPTION]` 1 fails — i.e. the empty STEMMA corpus is **intentional and permanent** — then Phase 2 is invalid. Fall back to: **"Restore the gate" only** (T1 with `--allow-empty` documented, T2, T3, T6, T7, T8) and **re-route the content question to 10B**. Under that branch, the project's core thesis ("canonical knowledge infrastructure", `VISION.md:19`) requires re-evaluation, because there is no knowledge to serve.

**Validation-first option (minimal experiment, if uncertainty is high):**
The validation question has **already been answered** by git archaeology (see below), so a spike is **not required**. The evidence is conclusive:

**Root-cause chain, fully established:**
| Commit | Date | What it did | Consequence |
|---|---|---|---|
| `306a013` | 2026-08-18 | Created `sync-lhs-knowledge.mjs`; vendored `knowledge.json` early; tweaked `lhs-adapter.ts` (+5/-5) | Establishes the 0.2 seam |
| `518615f^` (state) | before 2026-09-20 | Vendored export was **`export_version: "0.2"`, 224 entities, `generated_at: 2026-09-05T20:43:16+00:00`** | The adapter's `'0.2'` pin and required `generated_at` were **both correct** |
| `518615f` | 2026-09-20 21:53 | Bumped `sync-lhs-knowledge.mjs` to `'2.1.0'`; synced an empty 2.1.0 export; deleted all 8 narrative batches; stubbed `curriculum-mappings.ts`; **did not touch `lhs-adapter.ts` or `lhs-types.ts`** | The adapter was left pinned to a contract its data no longer satisfies |
| `2d4b209` | 2026-09-20 22:16 | Disabled all GitHub Actions | Nothing detected the break |

- **`git show --stat 518615f`** lists exactly 13 files — all under `apps/shell/src/data/`, `apps/shell/src/lib/curriculum-selector.ts`, and `scripts/generate/sync-lhs-knowledge.mjs`. **`apps/shell/src/lib/lhs-adapter.ts` and `lhs-types.ts` are not among them.** `[FACT]`
- **`git log -S"2.1.0"`** confirms `2.1.0` first entered `sync-lhs-knowledge.mjs` in `518615f` — the same commit that emptied the corpus. `[FACT]`
- Therefore **DOC-001 is a single-commit omission, not a long-standing drift.** My earlier `[INFERENCE]` that the adapter "has been broken against a 2.1.0 corpus since long before that commit" was **WRONG** and is retracted: the adapter was correct for a 0.2 corpus with 224 entities, and the version bump + entity deletion happened together in one commit. This **lowers** the risk of T1: the fix is a version-constant change plus an optionality change plus restoring the corpus, with no hidden history to untangle.

**Verification of the validation step (do this in Phase 0, it is now cheap):**
```bash
git show 518615f^:apps/shell/src/data/knowledge.json | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);console.log(j.export_version, (j.entities||[]).length, j.generated_at);})"
# expect: 0.2 224 2026-09-05T20:43:16+00:00   ← proves the adapter pin was correct pre-518615f
git show --stat 518615f | grep -c 'lhs-adapter.ts\|lhs-types.ts'
# expect: 0  ← proves the adapter was untouched by the breaking commit
```
**Conclusion:** proceed with the full work package. Uncertainty is low; no spike needed. Confidence raised from Medium to **High** for T1/T2.
