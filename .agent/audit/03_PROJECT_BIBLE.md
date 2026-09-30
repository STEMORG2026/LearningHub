# 03 — PROJECT BIBLE

> **Purpose.** A complete, self-contained context document for LearningHub. Reading this file alone should give ~95% of the understanding obtainable by reading the repository. Every claim carries a label. Where a claim is unverified, it says so.
>
> **Audit baseline:** commit `2d4b20974b2c312c75a44d520adb7d42f8388eee` (`main`, clean worktree as-found)
> **Audit date:** 2026-09-30
> **Author:** Automated master audit (Principal Engineer / Architect / Product / Security / QA / DevOps / Research / TPM composite)
> **Scope rule:** This document is *descriptive*. Recommendations live in `09_NEXT_STEP_DECISION.md` and `10_IMPLEMENTATION_PLAN.md`. Defects live in `07_FINDINGS_AND_RISKS.md`.

**Label legend:** `[FACT]` verified by direct inspection · `[EXTERNAL]` from an external source · `[INFERENCE]` reasoned from evidence · `[HYPOTHESIS]` plausible but untested · `[ASSUMPTION]` taken as true for planning · `[UNKNOWN]` not determinable in scope · `[CONTRADICTION]` two sources disagree · `[RECOMMENDATION]` a proposed action.

---

## §1 — Executive Orientation (the 60-second version)

`[FACT]` LearningHub is a **pnpm + Turborepo TypeScript monorepo** containing **23 packages** under `packages/*` and **1 application** under `apps/shell`. It is a private, unpublished (`"private": true`) project at version `3.0.0`, requiring Node `>=22.13` and pnpm `11.18.0`.

`[FACT]` It positions itself as a **product-agnostic STEM learning foundation** — knowledge models, simulation logic, quiz runtimes, Web Components, an event bus, and tracing — intended to be consumed by sibling products (STEM Tuition, STEM Lab, STEM Game) and by an AI tutoring system called **PROFESSOR-J**.

`[FACT]` The codebase is **mid-migration**. A large legacy system was frozen read-only (`legacy/`) and is being extracted into packages using a Strangler Fig pattern (ADR-001). 12 phases of a documented roadmap have been executed.

`[FACT]` **The repository is currently in a broken state on `main`.** Typecheck fails, tests fail in 3 packages, and the primary external data integration (the STEMMA knowledge seam) is broken on one of its two implementations. All of this traces to a **single commit made ~23 minutes before the final commit**.

`[FACT]` The project has **200 commits** by **7 identities** (predominantly one human developer + dependabot + two bots), spanning **2026-04-22 → 2026-09-20** — a ~5-month active life, then silence.

`[INFERENCE]` The repository reads as a **well-governed, well-documented solo/small-team project that ran out of momentum immediately after an aggressive sync-and-freeze change**, leaving the tree red.

---

## §2 — What This Project Is (Identity & Mission)

`[FACT]` From `README.md`:

- **Name:** LearningHub
- **Tagline:** "Open STEM Learning Platform & Ecosystem Foundation"
- **Status self-declared:** 🟢 Active Evolution
- **Version:** 3.0.0 ("Product-Agnostic Modular Edition")
- **Mission:** "Provide canonical knowledge infrastructure, simulation engines, quiz runtimes, and shared educational foundations for the broader STEM ecosystem."
- **Operating entity (claimed):** STEMXIS TECHNOLOGY PVT. LTD.

`[FACT]` The declared deliverable surface is five things:

1. Reusable **knowledge models** grounded in STEMMA exports.
2. Framework-agnostic **Web Components**: `<stem-quiz>`, `<stem-lesson>`, `<stem-circuit-sim>`, `<stem-mechanics-sim>`.
3. **Pure simulation logic** (`@learninghub/simulation-core`).
4. **Event-driven communication primitives** (`@learninghub/core`).
5. **Execution tracing** (`@learninghub/tracer`).

`[CONTRADICTION]` **C1 — "Open" vs `private: true`.** The README says "Open STEM Learning Platform" and names a company. The root `package.json` sets `"private": true`, no `publishConfig` exists, and no package is published to a registry. `[INFERENCE]` "Open" here means "product-agnostic / reusable across our own products," not "publicly open-source." This is a naming risk, not a defect.

`[CONTRADICTION]` **C2 — "Active Evolution" vs 10 days of silence + all CI disabled.** The README badge asserts active status; the final commit disables all GitHub Actions workflows, and the repository has had no commits since 2026-09-20. `[INFERENCE]` The badge is stale relative to reality.

---

## §3 — Who It Is For (Users & Consumers)

`[FACT]` The README names five ecosystem consumers:

| Consumer | Kind | What it consumes |
|---|---|---|
| **STEM Tuition** | Commercial product (1:1, cohort, guided tutoring) | Lesson models, component packages |
| **STEM Lab** | Practical experiment environment | `@learninghub/simulation-core` |
| **STEM Game** | Gamified learning | `@learninghub/quiz-engine`, interactive components |
| **PROFESSOR-J** | AI/agentic orchestration ("Ecosystem AI OS") | LearningHub knowledge interfaces; grounds Socratic tutoring |
| **JARVIS** | Independent Personal AI OS | Auth, tracing, model routes (shared infra) |

`[FACT]` **End users (inferred persona):** students in STEM education — the content inventory covers physics (grade 10 work is referenced by a branch name `feat/physics-grade10-completion`), circuits, mechanics, and quizzes.

`[FACT]` **Primary actual user of this repository today:** the single developer who authored 181 of 200 commits (`Er Sajan PLG` / `Er-Sajan-PLG`, split across two git identities that are the same person with/without hyphen; a third variant `gurungsajan0228example.com` is a typo'd email).

`[FACT]` **A second, very important consumer exists: AI agents.** The repo contains `AGENT_BOOTSTRAP.md`, `AGENT-INSTRUCTION-AUDIT.md`, and a Phase 9 named `feat/phase9-agent-orchestration`. `[INFERENCE]` The project is explicitly designed to be worked on by AI coding agents — this audit is itself an instance of that intent.

`[CONTRADICTION]` **C3 — two git identities for one person.** `132` commits from `Er Sajan PLG <gurungsajan0228gmail.com>` (note: **no `@`** — a malformed email) and `49` from `Er-Sajan-PLG <gurungsajan0228@gmail.com>`. `[INFERENCE]` Git config drift. Cosmetic, but it corrupts contribution analytics.

---

## §4 — Technology Stack (exact)

`[FACT]` Root `package.json`:

```json
{
  "name": "learninghub",
  "version": "3.0.0",
  "packageManager": "pnpm@11.18.0",
  "engines": { "node": ">=22.13" },
  "private": true
}
```

`[FACT]` **Runtime/build stack:**

- **Language:** TypeScript, strict mode. Per `packages/*/tsconfig.json` inheritance, the compiler enables `strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`.
- **Package manager:** pnpm workspaces.
- **Task runner:** Turborepo (`turbo`), with `build`, `test`, `typecheck`, `lint` pipeline tasks. 48 total tasks observed in the typecheck/test graphs (24 unit-of-work × 2, approximately).
- **Test runner:** Vitest, with **per-package coverage thresholds** (ratchets) declared in `vitest.config.ts`.
- **E2E:** Playwright (`e2e/`, `playwright-report/`, `test-results/` present).
- **Bundler/dev server:** Vite (inferred from `import.meta.env` usage and `apps/shell` structure).
- **Linting:** ESLint + custom architecture rules (`lint:arch`, `lint:circular`, `lint:size`, `lint:state`, `lint:dom`, `lint:registry`, `lint:docs`).
- **Release management:** Changesets (`changeset`, `changeset:version`, `changeset:publish`).

`[FACT]` **Repository size:** 29 MB excluding `node_modules` and `.git`.

`[FACT]` **Source volume:** 12,898 lines of `.ts`/`.tsx` excluding test files.
`[FACT]` **Test files:** 45 (`*.test.ts` / `*.test.tsx` / `*.spec.ts`).
`[FACT]` **Documentation:** 136 `.md` files outside `node_modules`, `.git`, and `.agent`.

`[EXTERNAL]` Node 22.13+ and pnpm 11.18.0 are both plausible-modern versions for a September 2026 baseline. `[ASSUMPTION]` No exotic or unsupported runtime dependency.

---

## §5 — Repository Layout (annotated)

`[FACT]` Top-level (excluding `node_modules`, `.git`, generated report dirs):

```
LearningHub/
├── apps/
│   └── shell/                  ← the ONLY application
├── packages/                   ← 23 packages
├── docs/                       ← 37 markdown files (governed)
├── e2e/                        ← Playwright end-to-end tests
├── scripts/                    ← build, check, and generation tooling
├── legacy/                     ← FROZEN read-only zone (Strangler Fig source)
├── .github/                    ← CODEOWNERS, PR template, SECURITY.md,
│                                  dependabot.yml, workflows-disabled/
├── .changeset/                 ← release manifests
├── README.md · VISION.md · CONSTITUTION.md · RULES.md
├── package.json · pnpm-workspace.yaml · turbo.json
├── tsconfig.base.json · vitest.config.ts · playwright.config.ts
└── tree.txt                    ← committed tree snapshot (⚠ stale, see §11)
```

`[FACT]` **The 23 packages**, grouped by my own functional clustering `[INFERENCE]`:

| Group | Packages |
|---|---|
| **Foundation** | `core`, `tracer`, `acl` |
| **Content & knowledge** | `content-provider`, `content-engine`, `lesson-renderer` |
| **Simulation** | `simulation-core`, `interactive-simulations`, `audio-synth`, `video` |
| **Assessment** | `quiz-engine`, `progress`, `hover-engine` |
| **Identity & money** | `auth`, `admin`, `payments` |
| **PROFESSOR-J integration** | `pj-types`, `pj-client`, `pj-auth`, `pj-audit`, `pj-policy` |
| **Ecosystem/observability** | `ecosystem-dashboard`, `cross-repo-visibility` |

`[FACT]` **Orphan packages (zero consumers within this repo):** `pj-client`, `pj-auth`, `pj-audit`, `pj-policy`, `ecosystem-dashboard`, `cross-repo-visibility` — six packages. Verified by `pnpm lint:arch` and by dependency-graph inspection. `[INFERENCE]` These are pre-built integration surfaces awaiting the sibling repos that were never brought online. `[RECOMMENDATION]` See `07_FINDINGS_AND_RISKS.md` ARCH-001.

---

## §6 — Architecture (the shape of the system)

`[FACT]` **The layering is strictly downward and mechanically enforced.** `lint:arch` reports **645 package-to-package dependencies** and **0 layer violations**. Dependency edges never point upward.

`[FACT]` **The mandated inter-package communication primitive is the EventBus** (`packages/core/src/event-bus.ts`, 98 lines). It is a pub/sub bus with:

- Wildcard pattern matching implemented as `patternToRegex()` — subscribers register patterns like `quiz:*` or `content.**`.
- Optional `BroadcastChannel` fan-out for cross-browser-tab delivery.
- A `publish(type, payload)` entry point and a private `dispatchToLocal(type, payload)` fan-out.

`[FACT]` **Why the EventBus matters architecturally:** packages must not call each other's internals directly. Cross-package behaviour flows through events. This is the architectural load-bearing wall — which is why a defect in the bus is disproportionately important. (That defect exists: see §11 / REL-004.)

`[FACT]` **The Anti-Corruption Layer (ACL)** is `packages/acl`. It wraps legacy globals so new code never touches frozen `legacy/` internals directly.

`[FACT]` **Web Components** are the UI contract: `<stem-quiz>`, `<stem-lesson>`, `<stem-circuit-sim>`, `<stem-mechanics-sim>`. They are framework-agnostic — deliberate, so any sibling product can embed them regardless of its own framework.

`[FACT]` **The STEMMA knowledge seam** is the external data boundary. STEMMA is a separate knowledge-graph project. LearningHub consumes its export as `lhs:*` entities.

`[FACT]` **PROFESSOR-J integration** is HTTP-based: LearningHub acts as "Information Head", PROFESSOR-J as "Worker", communicating over `POST /api/v1/chat`. The only network-calling surface in the app is `apps/shell/src/lib/professor-j-client.ts` (133 lines).

`[UNKNOWN]` Whether any actual network call is made in production today — the client reads `import.meta.env.VITE_PROFESSOR_J_URL` (`:112`); if unset, it falls back gracefully (`:79-84`). `[INFERENCE]` In a default local build, no live P-J call occurs.

`[FACT]` **Data flow: content ingestion pipeline.** STEMMA export JSON → sync script (`scripts/generate/sync-lhs-knowledge.mjs`) → `apps/shell/src/data/` vendored knowledge + curriculum mappings → `lhs-adapter.ts` → application components. A **second, independent implementation** of the same seam lives in `packages/content-provider/src/lhs-adapter.ts` (205 lines) + `types.ts` (210 lines) and is **healthy**.

`[CONTRADICTION]` **C4 — two STEMMA adapters with divergent version pins.** The shell adapter declares `SUPPORTED_EXPORT_VERSION = '0.2'` (`apps/shell/src/lib/lhs-adapter.ts:22`). The sync script declares `SUPPORTED_EXPORT_VERSION = '2.1.0'` (`scripts/generate/sync-lhs-knowledge.mjs:24`). The `content-provider` adapter is version-tolerant and working. `[INFERENCE]` The shell copy was simply not updated when the sync script was bumped. This is the mechanical root of the repo's red state.

`[FACT]` **Build / release / deploy.** Turborepo orchestrates `build`. Changesets handles versioning. `release:prepare` → `release:validate` → `release:version` → `release:finalize` exist, with `release:rollback` as an escape hatch. A branch named `chore/cloudflare-learninghub-migration` exists. `[UNKNOWN]` Whether a Cloudflare Pages project is actually live. `[INFERENCE]` Deployment target is Cloudflare Pages.

`[FACT]` **CI is disabled.** `.github/workflows-disabled/` contains the 10 workflow files; `.github/workflows/` does not exist. The final commit message is explicit: *"ci: disable GitHub Actions — run CI locally only."* `[FACT]` Git hooks exist (`setup-hooks` script, and `lint:commit`), so local enforcement is the intended substitute.

---

## §7 — Governance (this project's most distinctive feature)

`[FACT]` **`pnpm verify-governance` is a 13-stage gate.** Verified by counting the ` && `-joined stages in the root script. It is the single most important command in the repo.

`[FACT]` `[INFERENCE]` The 13 stages map onto the named lint scripts: `lint`, `lint:arch`, `lint:circular`, `lint:size`, `lint:state`, `lint:dom`, `lint:registry`, `lint:docs`, `lint:doc-governance`, `typecheck`, plus governance-specific checks. `[UNKNOWN]` The exact 13-stage composition beyond what is scripted — `[RECOMMENDATION]` a future agent should read the raw script value.

`[FACT]` **Machine-readable document governance.** Every doc in `docs/` must carry a status header — `CANONICAL`, `SUPERSEDED`, `HISTORICAL`, or `ARCHIVED`. Enforced by `lint:doc-governance`. `[INFERENCE]` This is unusually mature for a solo project; it exists because AI agents kept resurrecting stale docs.

`[FACT]` **AUTO regions.** Docs contain generator-owned blocks delimited by AUTO markers, rewritten by `scripts/generate/docs-sync.mjs`. `[FACT]` This generator is the reason `tree.txt` drifts (see §11).

`[FACT]` **The "Iron Law" of legacy & decoupling** (from README):

1. `legacy/` is read-only.
2. `packages/*` MUST NOT contain commercial tuition pricing, marketing, or single-product assumptions.
3. All cross-system integration must use versioned adapters or EventBus messages.

`[FACT]` **The Educational Integrity Mandate.** Every learning component must pass an "Educational Fitness Function" defined in `docs/RULES.md`. `[FACT]` `pnpm validate:edu` enforces it.

`[FACT]` `docs/CONSTITUTION.md` and `docs/RULES.md` together total ~2,828 lines. `[UNKNOWN]` Their full contents were not read during this audit — `[RECOMMENDATION]` flagged as a residual gap in `00_AUDIT_STATE.md`.

`[FACT]` **CODEOWNERS exists.** `.github/CODEOWNERS` is present. `[FACT]` `dependabot.yml` is present **and was live** — dependabot authored 12 commits. `[FACT]` `SECURITY.md` and `PULL_REQUEST_TEMPLATE.md` exist.

`[CONTRADICTION]` **C5 — dependabot is configured but CI is disabled.** Dependabot raises PRs; the workflows that would validate them no longer run. `[INFERENCE]` Merged dependabot commits inside the September window were therefore merged **without automated verification**. See `07_FINDINGS_AND_RISKS.md` DX-001 / REL-003.

---

## §8 — What Is Actually Implemented (verified, not claimed)

`[FACT]` The following are implemented and were **verified by direct execution** during Phase 7:

| Capability | Status | Verification |
|---|---|---|
| EventBus pub/sub | ✅ Works | Imported and exercised from built `dist/` |
| Wildcard pattern matching | ✅ Works | Observed via subscriber dispatch |
| EventBus error isolation | ❌ **Absent** | Empirically reproduced (REL-004) |
| Architecture layering | ✅ Clean | `lint:arch` → 645 deps, 0 violations |
| Circular dependencies | ✅ Clean | `lint:circular` → pass |
| 21 of 23 packages' unit tests | ✅ Pass | `turbo test` → 41/48 tasks pass |
| E2E suite | ✅ Pass | 32/32 Playwright tests pass |
| Typecheck | ❌ **Fails** | 47/48 tasks; `apps/shell` exits 1 |
| `content-engine` tests | ❌ **1 of 3 files won't collect** | `tests/engine-gate-batch8.test.ts:17` imports deleted `apps/shell/src/data/narratives-batch8` (the other 48 tests pass) |
| STEMMA seam (shell) | ❌ **Broken** | Empty corpus + stale version pin + unsound cast |
| STEMMA seam (content-provider) | ✅ Healthy | 205-line adapter, version-tolerant |
| Governance gate | ⚠️ Not runnable end-to-end | Because it includes `typecheck` |

`[FACT]` **The four defects on the shell STEMMA path, in order of occurrence:**

1. **Empty corpus.** The vendored export at `apps/shell/src/data/` contains **0 entities** (was 224 before commit `518615f`).
2. **Version pin mismatch.** Shell adapter pins `'0.2'`; sync script emits `2.1.0`.
3. **Unsound type assertion.** `apps/shell/src/lib/lhs-adapter.ts:24` does `const EXPORT = knowledge as LhsKnowledgeExport;` — a cast with no runtime validation, so a mismatched shape is never caught.
4. **Stale type.** `lhs-types.ts:43` declares `generated_at: string` as **non-optional**, but the empty corpus lacks it — producing `TS2352`.

`[FACT]` **Missing export:** `getCurriculumMapping` is expected by `learning-path.ts` but `curriculum-mappings.ts` is a 18-line stub whose `CURRICULUMS = {}`. It was 547 lines before `518615f`.

`[FACT]` **Three typecheck errors, exactly:**

- `learning-path.ts(11,3) TS2305` — no exported member `getCurriculumMapping`
- `learning-path.ts(67,53) TS7006` — parameter implicitly `any`
- `lhs-adapter.ts(24,16) TS2352` — conversion may be a mistake; missing `generated_at`

`[FACT]` **`content-engine`'s test file fails to collect** — `packages/content-engine/tests/engine-gate-batch8.test.ts:17` imports `../../../apps/shell/src/data/narratives-batch8`, a module **deleted** by `518615f`. All 8 batches `narratives-batch1..8.ts` (~8,494 lines) were deleted. Note the nuance: the other 2 test files in this package **pass** (48 tests); only this one file fails, and it fails at **collection**, not assertion.

---

## §9 — Roadmap & Phase History

`[FACT]` A **12-phase roadmap** is documented. Column from `06_REQUIREMENTS_AND_GAP_ANALYSIS.md`.

`[FACT]` Evidence of phases completing: branch names `feat/phase8-content-docs`, `feat/phase9-agent-orchestration`; directories and docs aligned to phase numbers.

`[INFERENCE]` Phases 1–9 have visible deliverables. `[FACT]` Phases 10–12 exist as plan text. `[UNKNOWN]` Whether phases 10–12 were executed — no matching branch or artifact was found.

`[FACT]` **ADR history.** ADR-001 establishes the Strangler Fig migration. ADR-022 **re-scoped ACP (Agent Client Protocol) away** — meaning ACP was claimed in `VISION.md` and later formally walked back. `[INFERENCE]` The project is disciplined enough to retract its own scope claims in writing, which is a strong positive signal.

`[CONTRADICTION]` **VISION.md still claims ACP.** ADR-022 re-scoped it, but the VISION document was not updated (or was not marked `SUPERSEDED`). See `07_FINDINGS_AND_RISKS.md` DOC-001.

---

## §10 — Documentation Corpus

`[FACT]` **136 markdown files.** Key governed documents:

| File | Role |
|---|---|
| `README.md` | Public-facing identity, mission, ecosystem map, iron law |
| `VISION.md` | Long-range intent (⚠ contains superseded ACP claim) |
| `CONSTITUTION.md` | Governance law (~large; not fully read) |
| `docs/RULES.md` | Engineering + educational rules (~large; not fully read) |
| `docs/` (37 files) | Governed docs, each with a status header |
| `AGENT_BOOTSTRAP.md` | Fast-boot file for AI agents |
| `AGENT-INSTRUCTION-AUDIT.md` | Instructions for auditing agents |
| 8 ADRs+ | Decision records, at least ADR-001 … ADR-022 |

`[FACT]` `[RECOMMENDATION]` 6 narration-playbook docs identified but not read — residual coverage gap.

`[FACT]` **A committed `tree.txt` exists but is 3 commits stale** (stamped `4904c3f`, HEAD is `2d4b209`). `[INFERENCE]` It is regenerated by `docs:sync`; nobody re-ran it after the last three commits.

---

## §11 — Root-Cause Story (the single most important section)

`[FACT]` **Everything that is broken comes from two commits, 23 minutes apart, on the final day of the project's life.**

### Commit `518615f` — "chore: sync with empty STEMMA corpus and update sync script" — 2026-09-20 21:53

`[FACT]` What it changed:

1. Bumped `SUPPORTED_EXPORT_VERSION` in the **sync script** from `0.2` → `2.1.0`.
2. Vendored an export containing **0 entities** (previously 224).
3. Deleted **all 8 narrative batch files** `narratives-batch1..8.ts` (~8,494 lines).
4. Stubbed `curriculum-mappings.ts` from 547 lines → 18 lines (`CURRICULUMS = {}`).

`[FACT]` What it **did not** change — verified by `git show --stat 518615f | grep -c 'lhs-adapter\|lhs-types'` → **`0`**:

- `apps/shell/src/lib/lhs-adapter.ts` still pins `'0.2'`.
- `apps/shell/src/lib/lhs-types.ts` still requires non-optional `generated_at`.

`[FACT]` **This is the defect.** The producer was updated; the consumer was not. The seam broke in four independent ways simultaneously.

`[INFERENCE]` ‼️ **CORRECTION TO A PRIOR INFERENCE.** During this audit I initially wrote that the shell adapter *"has been broken against a 2.1.0 corpus since long before that commit."* **That was wrong.** Git archaeology proved the opposite: before `518615f`, the vendored export declared `export_version: "0.2"` and contained 224 entities **with** a `generated_at` field. So the adapter's `'0.2'` pin was **correct** at the time it was written. The breakage was introduced *by* `518615f`, not predating it. This retraction is recorded in `09_NEXT_STEP_DECISION.md` and is retained here as an honesty marker.

`[INFERENCE]` Why an empty corpus? `[HYPOTHESIS]` The sync was run when the sibling STEMMA repository was in a state that produced no entities — either a checkout problem, a build-order problem, or STEMMA itself was mid-refactor. The commit message treats it as routine ("sync with empty STEMMA corpus"), which suggests the developer saw an empty result and committed it without a guard. `[FACT]` **The sync script has no empty-corpus guard** — it will happily write a zero-entity export.

### Commit `2d4b209` — "ci: disable GitHub Actions — run CI locally only" — 2026-09-20 22:16

`[FACT]` Moved all workflow files into `.github/workflows-disabled/`. 13 files touched in total; the final 3 were the workflow moves.

`[INFERENCE]` `[HYPOTHESIS]` Highly likely this was a **reactive response to the red tree** — the developer disabled the gate that was now failing rather than fixing the failure. `[UNKNOWN]` Whether this was intended to be temporary. This is open decision **D3**.

`[FACT]` **Consequence:** the repository has been red on `main` ever since, with no automated signal, for 10 days as of audit time.

---

## §12 — Current Health (verified snapshot)

`[FACT]` **Grade: RED.** Not P0-broken (the app's 21 healthy packages and the E2E suite all pass), but the primary verification gate is inoperable and one of two data-seam implementations is dead.

| Signal | Result |
|---|---|
| `turbo typecheck` | ❌ 47/48 tasks (1 fail: `apps/shell`) |
| `turbo test` | ❌ 41/48 tasks (3 fail: `core`, `content-engine`, `apps/shell`) |
| Playwright E2E | ✅ 32/32 |
| `lint:arch` | ✅ 645 deps, 0 violations |
| `lint:circular` | ✅ Clean |
| `pnpm verify-governance` | ⚠️ Cannot complete (includes `typecheck`) |
| Worktree at baseline | ✅ Clean (as found) |
| CI | ❌ All workflows disabled |

`[FACT]` **Failure details:**

- `packages/core` — 1 failing test: a doc lacks a `**Version:**` header.
- `packages/content-engine` — 1 of 3 test files fails to collect (`engine-gate-batch8.test.ts:17` imports the deleted `apps/shell/src/data/narratives-batch8`); its other 48 tests pass.
- `apps/shell` — 18 test failures (downstream of the STEMMA seam break).

`[FACT]` **Findings inventory** (from `07_FINDINGS_AND_RISKS.md`): no P0, **three P1**, and a set of P2/P3 across `REL`, `DX`, `DATA`, `DOC`, `TEST`, `ARCH`, `SEC`, `COR`, `PLAN`, `OBS` families.

`[FACT]` **All defects are ~1–2 commits old and trivially git-reversible.** `[INFERENCE]` This is why the recommended route is internal repair (10A), not a strategic pivot.

---

## §13 — Honest Gaps, Unknowns, and Contradictions

### Open unknowns

| # | Unknown | Why it matters | How to resolve |
|---|---|---|---|
| U1 | Does `../STEMMA/exports/knowledge.json` currently hold a corpus? | Determines whether the sync just needs re-running | Phase 0 of the fix plan: inspect the sibling repo |
| U2 | Is the Cloudflare Pages project live? | Determines deploy blast radius | Check the Cloudflare dashboard |
| U3 | Was CI disabling intentional/permanent? | Determines whether restoring workflows is welcome | **Ask the human** (open decision D3) |
| U4 | Were phases 10–12 executed? | Roadmap completeness answer | No artifact found; ask |
| U5 | Full contents of `CONSTITUTION.md` + `RULES.md` (~2,828 lines) | These are the governing law | Not read; residual audit gap |
| U6 | 6 narration-playbook docs | Content-generation intent | Not read; residual audit gap |
| U7 | Exact 13-stage composition of `verify-governance` | Repair verification | Read the raw script value |

### Open decisions (require the human)

| # | Decision | Options |
|---|---|---|
| **D1** | Bump the shell adapter to `2.1.0`, or make it version-tolerant like `content-provider`? | `[RECOMMENDATION]` version-tolerant |
| **D2** | Restore `curriculum-mappings.ts` (547 lines, in git), or retire `learning-path.ts` from it? | `[RECOMMENDATION]` restore — the data is one `git show` away |
| **D3** | Was disabling CI deliberate? Restore the workflows or keep local-only? | `[RECOMMENDATION]` ask before restoring |

### Contradictions found (5)

C1 "Open" vs `private: true` · C2 "Active Evolution" vs 10 days silent + CI off · C3 two git identities for one person · C4 two STEMMA adapters with divergent version pins · C5 dependabot live vs CI disabled.

### Residual audit gaps (disclosed, not hidden)

- ~2,828 lines of `CONSTITUTION.md` + `RULES.md` unread.
- 6 narration playbook docs unread.
- No line-by-line read of all 12,898 source lines — coverage was *complete at the file-manifest level* (502 entries, 491 FULL_READ) with **deep** reads of all architecturally load-bearing files.
- `git` history was sampled around the critical window, not exhaustively read for all 200 commits.

---

## §14 — Pointers (where to go next)

`[FACT]` Within this audit:

| If you want… | Read |
|---|---|
| The one-page human summary | `02_EXECUTIVE_SUMMARY.md` |
| What is broken and how to fix it | `07_FINDINGS_AND_RISKS.md` |
| What to do next, and why | `09_NEXT_STEP_DECISION.md` |
| The actual work plan | `10_IMPLEMENTATION_PLAN.md` |
| Formal architecture detail | `04_ARCHITECTURE_AND_DATA_FLOW.md` |
| Every registry (config, data, API, integrations) | `05_REGISTRIES.md` |
| Raw proof of everything I ran | `08_VALIDATION_RESULTS.md` |
| Fastest possible onboarding for a new agent | `AGENT_BOOTSTRAP.md` |
| Why we chose this direction | `ADR-0023-restore-verification-gate-and-stemma-seam.md` |

`[FACT]` Outside this audit, the highest-value files for a newcomer are, in order: `README.md` → `docs/RULES.md` → `packages/core/src/event-bus.ts` → `apps/shell/src/lib/lhs-adapter.ts` → `package.json` (read the `verify-governance` script).

---

*End of Project Bible. Sections §1–§14 complete. All labels applied. Residual gaps disclosed in §13.*
