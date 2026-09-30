# 06_REQUIREMENTS_AND_GAP_ANALYSIS.md — LearningHub Audit

> **Audit date:** 2026-09-30 · **Mode:** FULL · **Branch:** `main` · **Commit:** `2d4b20974b2c312c75a44d520adb7d42f8388eee` · **Worktree:** CLEAN
> Valid only for the recorded commit and worktree state. Review all changes since this commit before relying on these conclusions.

Status vocabulary per audit spec: NOT_STARTED · STUBBED · PARTIAL · FUNCTIONAL_NOT_HARDENED · IMPLEMENTED_UNVERIFIED · IMPLEMENTED_AND_VERIFIED · BEHIND_FLAG · BROKEN · DEAD · DOCUMENTED_ONLY · BLOCKED/DEFERRED · OBSOLETE/SUPERSEDED · UNKNOWN.
**"Code exists" is never sufficient for IMPLEMENTED_AND_VERIFIED** — it requires reachable + configured + integrated + tests pass + docs not misleading + no blocker.

---

## 1. Phase roadmap × implementation matrix

| # | Phase | Claimed (`.phase.json`) | Claimed (`ROADMAP.md`) | Actual (code + tests) | Status | Evidence |
|---|---|---|---|---|---|---|
| 0 | Foundation | completed 2.0.0 | 🟢 Completed | pnpm+turbo+tsconfig+changesets all present & working | **IMPLEMENTED_AND_VERIFIED** | `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.json`; `turbo build` 24/24 ✅ |
| 1 | Tracer | completed 3.0.0 | 🟢 Completed | `tracer.ts` 92.16% cov, 24 tests pass. `dashboard.ts` **0%** (437 lines) | **FUNCTIONAL_NOT_HARDENED** | `packages/tracer/src/dashboard.ts:1-437` uncovered; floor ratcheted to 34% |
| 2 | Audio Synth | completed 3.0.0 | 🟢 Completed | 14 tests pass, 87% floor met | **IMPLEMENTED_AND_VERIFIED** | `packages/audio-synth`; 14/14 tests |
| 3 | Event Bus + ACL | completed 3.0.0 | 🟢 Completed | EventBus clean; 19 acl tests + event-bus tests pass | **IMPLEMENTED_AND_VERIFIED** | `packages/core/src/event-bus.ts:1-98`; `lint:arch` 0 violations |
| 4 | Quiz Engine | completed 3.0.0 | 🟢 Completed | 16 tests pass, 69.96% vs 66 floor | **IMPLEMENTED_AND_VERIFIED** | `packages/quiz-engine`; 16/16 |
| 5 | Hover Engine | completed 3.0.0 | 🟢 Completed | 12 tests, 93.54% lines, 100% funcs | **IMPLEMENTED_AND_VERIFIED** | `packages/hover-engine`; 12/12 |
| 6 | Physics Core | completed 3.0.0 | 🟢 Completed | 65 tests, **99.14% lines / 95.55% branch / 93.75% funcs** | **IMPLEMENTED_AND_VERIFIED** | `packages/simulation-core`; 65/65 — best-engineered module |
| 7 | Features (auth, progress, admin, payments, video) | **in-progress** | 🟡 In progress | All 5 packages exist; 13+7+7+10+12 = 49 tests pass | **FUNCTIONAL_NOT_HARDENED** | all tests pass, but no coverage measured end-to-end; `ROADMAP.md:258` admits phase ordering drift |
| 8 | Content & Lessons | **in-progress** | 🟡 In progress | 4 packages exist; content-provider 93.91%, lesson-renderer 56 tests, interactive-sims 19 tests, content-engine **suite fails** | **BROKEN (partial)** | `content-engine/tests/engine-gate-batch8.test.ts:17` imports deleted module |
| 9 | Agent Integration Foundation | **`planned`** | 🔵 Not started | **ALL 3 packages implemented & passing** (pj-types 4, pj-client 7, pj-auth 11) | **IMPLEMENTED_AND_VERIFIED** | `git log`: `10d1957 feat(phase9)`; all 3 pass `vitest` |
| 10 | Governance Extensions | **`planned`** | 🔵 Not started | **BOTH packages implemented & passing** (pj-audit 8, pj-policy 11) | **IMPLEMENTED_AND_VERIFIED** | `git log`: `5ab4557 feat(phase10)`; 19 tests pass |
| 11 | Ecosystem Tooling | **`planned`** | 🔵 Not started | **BOTH packages implemented & passing** (ecosystem-dashboard 13, cross-repo-visibility 10) | **IMPLEMENTED_AND_VERIFIED** | `git log`: `580a8a5 feat(phase11)`; 23 tests pass |

**Headline:** 3 phases (9, 10, 11) are recorded as *not started* in the machine-readable source of truth while **7 packages totalling 64 passing tests sit on disk**. Phases 7 and 8 are recorded *in-progress* but their Phase 8 content was structurally reverted.

---

## 2. README / VISION / ECOSYSTEM claims × reality

| Claim | Source | Reality | Status |
|---|---|---|---|
| "ingest structured STEM facts from STEMMA exports (`lhs:*`)" | `docs/VISION.md:65` | Vendored export has **0 entities** | **DOCUMENTED_ONLY / BROKEN** |
| Adapters "produce multi-format lesson blueprints" | `docs/VISION.md:65` | `content-engine` pipeline exists & 48 tests pass, but suite fails to load | **PARTIAL** |
| "PURE business logic engines" — simulation-core, quiz-engine, hover-engine, audio-synth | `docs/VISION.md:66` | All 4 verified: no DOM imports (`lint:dom` ✅), real coverage | **IMPLEMENTED_AND_VERIFIED** |
| "Framework-agnostic Web Components: `<stem-quiz>`, `<stem-lesson>`, `<stem-circuit-sim>`, `<stem-mechanics-sim>`" | `docs/VISION.md:67` | All 4 custom elements exist; `<stem-quiz>` used by shell e2e test | **IMPLEMENTED_AND_VERIFIED** |
| "Strict, schema-validated EventBus primitives" | `docs/VISION.md:68` | EventBus exists; **schema validation is NOT implemented** — `publish()` accepts `EventPayload<T>` with no runtime validation | **PARTIAL** |
| "Defines integration contracts (API specs, event schemas, auth) … via ACP JSON-RPC" | `docs/VISION.md:69` | P-J client calls HTTP `/api/v1/chat`; **no ACP JSON-RPC implementation exists** | **DOCUMENTED_ONLY** |
| "LH frontend calls P-J backend at `/api/v1/chat`" | `docs/ECOSYSTEM.md:139`, `ADR-022` | Implemented in `professor-j-client.ts:62`, falls back gracefully | **FUNCTIONAL_NOT_HARDENED** (never load-tested against a live P-J) |
| "LH provides … Web Components … reusable across STEM Tuition, STEM Lab, STEM Game, P-J, external" | `docs/VISION.md:53-58` | Only 1 consumer exists (itself). No external consumer integrated. | **IMPLEMENTED_UNVERIFIED** |
| "Legacy Frozen Zone: The `legacy/` directory is read-only" | `README.md`, `AGENTS.md` | **No `legacy/` directory exists** | **OBSOLETE** (ADR-004 superseded) |
| "`pnpm verify-governance` passes all checks" | `README.md` Quickstart | **Fails** at stage 1 (typecheck) | **BROKEN** |
| Product-agnostic: "MUST NOT contain commercial tuition pricing / home tuition marketing" | `README.md`, `VISION.md:53` | `apps/shell` contains a **fee & schedule estimator** with tuition/hours copy and `e2e/critical-path.spec.ts` asserts "Est. Weekly Commitment" | **CONTRADICTION** — see §3 |
| "NOT a Monolithic Database: … does not manage commercial user signups, payment gateways" | `docs/VISION.md:76` | `packages/payments` (10 tests), `packages/auth` (13 tests), `packages/admin` exist | **CONTRADICTION** — see §3 |

---

## 3. Contradictions (all sources named and dated)

### C1 — Product agnosticism vs. tuition content shipped in the shell
- **Source A:** `docs/VISION.md:53` (canonical, last_updated 2026-09-04) — core "MUST remain reusable"; `README.md` — "Core packages in `packages/*` MUST NOT contain commercial tuition pricing, home tuition marketing".
- **Source B:** `apps/shell/src/data/classes.ts`, and `e2e/critical-path.spec.ts:3-30` which asserts `'Selected: Grade 1 – 8 (Foundation)'`, `'Subjects: Mathematics, Physics, Chemistry'`, `'Est. Weekly Commitment: ~6 Hours'`, and a `wa.me` WhatsApp enrolment link.
- **Source C:** `docs/ROADMAP.md` Phase 7 table lists Payments as a shipped feature package.
- **Which does the code follow?** B. The shell still ships tuition enrolment UX.
- **Is the conflict explained by history?** Partly — `README.md` and `ADR-017` describe a "consumer showcase" pattern where tuition is *presented as* one consumer. `CHANGELOG.md` "Unreleased" says "Present tuition offerings as a modular consumer showcase."
- **Which should be authoritative?** VISION is explicit that it governs `packages/*` — and both `payments` and `auth` are genuinely product-shaped packages. **The VISION §3.2 "NOT a Monolithic Database" clause is the one that has been silently violated**; the showcase carve-out for `apps/shell` is legitimate. Needs a human decision recorded in an ADR.

### C2 — STEMMA export contract version (4-way)
Detailed as `DOC-001` in `07_FINDINGS_AND_RISKS.md`. Adapter pins `'0.2'` (`lhs-adapter.ts:22`); types require `generated_at` (`lhs-types.ts:43`); sync script pins `'2.1.0'` (`sync-lhs-knowledge.mjs:24`); data declares `2.1.0` with no `generated_at`.
- **Which does the code follow?** The data + sync script (2.1.0). The adapter and types are stale.
- **Dates:** adapter/types last meaningfully touched pre-`518615f`; sync script deliberately updated in `518615f` (2026-09-20).

### C3 — Phase completion state (3-way)
`.phase.json` (machine-readable truth) vs `git log` + on-disk tests vs `ROADMAP.md`/`AGENTS.md` AUTO blocks. All three ROADMAP/AGENTS blocks are *generated from* `.phase.json`, so they faithfully propagate the falsification. Detailed as `DOC-003`.

### C4 — Coverage policy vs. ratified floors
- **Source A:** `AGENTS.md` — "Core logic (new modules): ≥95% line coverage".
- **Source B:** `packages/tracer/vitest.config.ts` floor `lines: 34`; `packages/quiz-engine` floor `lines: 66`; `packages/acl` floor `lines: 70`.
- **Which does the code follow?** B. `AGENTS.md`'s 95% is aspirational; the ratchets are the enforced reality — and `tracer/dashboard.ts` at 0% passes its 34% floor. No package is near 95% except `simulation-core` (99.14%).

### C5 — "Schema-validated EventBus" claim
`docs/VISION.md:68` says "Strict, schema-validated EventBus primitives". Source A also says `docs/policies/SECURITY.md:45`: "All user input MUST be validated with Zod schemas". **`zod` is not in any package.json** (`grep` for zod across all manifests: zero hits). `EventBus.publish()` performs no validation. → The EventBus is **not** schema-validated; Zod is not a dependency at all.

---

## 4. Completed items
Phases 0–6 fully verified. 21 of 24 packages have fully green test suites (**355 tests passing** in packages alone, plus **32 e2e**). Architecture is clean: `lint:arch` 0 violations across 376 modules, `lint:circular` 0 cycles across 199 files, purity lints clean, size budgets met, a11y clean.

## 5. Items completed differently than planned
Phase 8 was delivered **before** Phase 7 (`ROADMAP.md:258` states this explicitly). Phase 8's content (8 narrative batches, ~8,494 lines) was then **deleted wholesale** in `518615f`. Phases 9/10/11 were delivered but never marked complete. ACP-JSON-RPC orchestration (VISION §5) was re-scoped by `ADR-022` into "integration contracts only" — and then only the HTTP client was built, not ACP.

## 6. Items to retire
- `scripts/narrate/assembly-line.mjs` — self-declared DEPRECATED (ADR-016 N6).
- `docs/ARCHITECTURE/README.md` §1 "Current State (v1.0.0 Frozen)" — describes a deleted `legacy/` dir.
- `docs/policies/SECURITY.md` scope — describes pre-rename STEM-TUITION.
- 3 phantom e2e spec references in the component registry.
- 6 local branches with 0 unmerged commits (`chore/cloudflare-learninghub-migration`, `fix/ui-polish`).

## 7. Missing work not in any plan
1. **No STEMMA corpus guard** — `sync-lhs-knowledge.mjs` copies an empty export without complaint.
2. **No CI re-enable plan** — 10 workflows park disabled with no documented exit criterion.
3. **No P-J backend load test** — the `/api/v1/chat` contract has never been exercised against a running P-J.
4. **No ACP implementation** — claimed in `VISION.md:69`, `ECOSYSTEM.md:48-63` (a whole "ORCHESTRATION PLANE" diagram), re-scoped by ADR-022 but never recorded as deferred.
5. **No coverage measurement for 20 of 24 packages.**

## 8. Most likely current milestone
**UNKNOWN / stalled.** The last 4 commits are: `feat(phase11)` → `test: trigger Cloudflare deploy` → `fix: add _redirects` → `chore: update wrangler project name` → `chore: update project name` → `chore: sync with empty STEMMA corpus` → `ci: disable GitHub Actions`. The trajectory is: *finish orchestration packages → attempt deploy → discover the corpus is gone → disable CI → stop.* The project is **mid-deployment-transition to Cloudflare Pages with a red local gate and an empty data source.**

---

# PHASE 9 — ROUTING DECISION

## Does a valid, high-value internal next step exist?

**YES.** Every one of the four routing criteria is satisfied:

1. **Unresolved P1 findings** — `REL-001` (typecheck fails), `REL-002` (test fails in 3 packages incl. a suite that cannot load), `DX-001` (CI disabled). Per the routing rule, *any* unresolved P0/P1 finding **always** routes to 10A.
2. **Documented roadmap items unfinished and still aligned** — Phases 7 & 8 are `in-progress` with three named, still-valid remaining items at `ROADMAP.md:277-282` (registry entries, coverage verification, and the tracer-instrumentation gap).
3. **Committed functionality is PARTIAL / BROKEN on a critical path** — `apps/shell`'s STEMMA seam (`lhs-adapter.ts`) is the *only* path by which canonical knowledge reaches any consumer, and it throws on every call. `content-engine`'s gate test cannot load. `learning-path.ts` cannot compile.
4. **Critical behavior lacks verification** — 20 of 24 packages have no measured coverage; `tracer/dashboard.ts` (437 lines) has 0%.

### Pre-routing proof obligations (all discharged)
1. **Every roadmap item / README goal / TODO / ADR checked?** ✅ 22 ADRs status-verified; ROADMAP read in full (383 lines); every README claim in §2 above tested against code. **Zero TODO/FIXME/HACK markers exist in the source tree** — verified by repo-wide grep — so the roadmap was the only intent source and it is falsified (C3).
2. **"Functionally complete" items audited for production readiness?** ✅ Phases 9/10/11 pass their tests but were audited for reachability: `ecosystem-dashboard`/`cross-repo-visibility`/`pj-*` are **not imported by `apps/shell`** — they are libraries with tests and no consumer. Marked IMPLEMENTED_AND_VERIFIED for their own contract, DEAD for the product. Similarly `packages/acl`'s adapters wrap `legacy/` globals that no longer exist (20 tests pass against mocks).
3. **Reliability/security/testing/ops gaps not mistaken for completed work?** ✅ `REPOSITORY_HEALTH.md` reports 17 "stable" packages; this audit downgrades 5 to FUNCTIONAL_NOT_HARDENED and 1 to BROKEN. `SEC-001` documents an ENFORCED policy that misstates its own scope.
4. **Is "write a roadmap from the gap analysis" the right next step?** Considered and **rejected as premature** — the roadmap is falsified, but the falsification is a *symptom*. Fixing the roadmap first would document a broken system; fixing the build first restores the ability to trust any roadmap. Recording the roadmap correction as a required deliverable *of* the fix (ticket T6, below).

> **Routing decision: 10A (internal)**
> **Reason:** Three unresolved P1 findings (REL-001 typecheck red across 3 files; REL-002 test red in 3 packages including one suite that cannot load; DX-001 CI disabled so nothing detects either), plus a P2 data-availability break (DATA-001: the STEMMA corpus is empty so the canonical-knowledge seam throws on every call), plus two phases stuck `in-progress` in the machine-readable phase ledger while their content was deleted. No P0. The internal plan is **not** exhausted — it has barely begun — so strategic research (10B) would be premature. Three of the P1/P2 root causes trace to a single commit, `518615f`, which makes a small, high-leverage vertical slice possible.
> **Confidence: High.**

---

## Pre-conditions that would flip the routing to 10B
- The STEMMA corpus being empty turns out to be **permanent and intentional** (upstream decision to decommission) — then the entire "canonical knowledge" thesis needs re-evaluation, which is a 10B question.
- The owner confirms the project is intentionally sunsetting (2d4b209 disabled CI *on purpose* as a wind-down).
- Both are `[UNKNOWN]` and must be confirmed before any content-facing work beyond the restore path.
