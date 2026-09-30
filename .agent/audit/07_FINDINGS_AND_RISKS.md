# 07_FINDINGS_AND_RISKS.md — LearningHub Audit

> **Audit date:** 2026-09-30 · **Mode:** FULL · **Branch:** `main` · **Commit:** `2d4b20974b2c312c75a44d520adb7d42f8388eee`
> **Worktree:** CLEAN (0 uncommitted changes)
> Valid only for the recorded commit and worktree state. Review all changes since this commit before relying on these conclusions.

Confirmed defects are listed separately from possible risks. Every finding cites `file:line` or command output.

---

## P0 — Critical

**None found.** No active compromise, active data loss, unrecoverable corruption, or total failure. The deployed static site builds and its 32 e2e tests pass. All failures are in the governance/test/lint gate layer and in code paths that are already dead (empty corpus).

---

## P1 — High (release blockers)

### REL-001 — `pnpm typecheck` fails on `main` (3 TypeScript errors)
- **Evidence:** `turbo typecheck` → 47/48 tasks OK, `@learninghub/shell#typecheck` exits 1. Reproduced standalone:
  - `apps/shell/src/lib/learning-path.ts:11` — `Module '"../data/curriculum-mappings"' has no exported member 'getCurriculumMapping'`
  - `apps/shell/src/lib/learning-path.ts:67` — `Parameter 'topic' implicitly has an 'any' type` (cascading from the missing import)
  - `apps/shell/src/lib/lhs-adapter.ts:24` — cast to `LhsKnowledgeExport` invalid: `Property 'generated_at' is missing`
- **Affected components:** `apps/shell`, and by contract `packages/content-provider`'s schema expectations
- **Impact:** The repo's own governance gate cannot pass. `pnpm verify-governance` (the CI entry point, `.github/workflows-disabled/ci.yml:41`) begins with `pnpm typecheck`, so **the entire gate is red at HEAD**. Any agent following `AGENTS.md` ("`pnpm typecheck` — 16 tasks, must all pass") is immediately blocked. `examples` in docs cannot be trusted.
- **Reproduction:** `cd apps/shell && pnpm run typecheck`
- **Likely root cause:** Commit `518615f` ("chore: sync with empty STEMMA corpus") replaced `apps/shell/src/data/curriculum-mappings.ts` with a 18-line stub that dropped `getCurriculumMapping()` and `CurriculumMapping`, but `apps/shell/src/lib/learning-path.ts` was not updated. The same commit changed the export to `export_version: 2.1.0` while `apps/shell/src/lib/lhs-adapter.ts:22` still pins `SUPPORTED_EXPORT_VERSION = '0.2'`.
- **Recommended direction:** Restore the `getCurriculumMapping` contract in `curriculum-mappings.ts` (or remove the importer), reconcile `lhs-types.ts`/`lhs-adapter.ts` with the 2.1.0 schema (add `generated_at` handling, bump `SUPPORTED_EXPORT_VERSION`).
- **Blocks next step?** **Y**
- **Confidence:** **High** (direct command output)

### REL-002 — `pnpm test` fails in 3 packages; 3 test suites do not even load
- **Evidence:** `turbo test` → 41/48 tasks OK. Per-package confirmed failures:
  | Package | Failure | Evidence |
  |---|---|---|
  | `packages/core` | 1 failed / 107 passed — "all docs have Version header" | `packages/core/tests/foundation.test.ts:291` — asserts `/\*\*Version:\*\*/` on every `docs/**/*.md` |
  | `packages/content-engine` | suite fails to load | `packages/content-engine/tests/engine-gate-batch8.test.ts:17` imports `../../../apps/shell/src/data/narratives-batch8` — **file does not exist** |
  | `apps/shell` | 18 failed — lhs-adapter (6), lhs-demo (1), learning-path (9), narrative-integration (2) | `Unsupported STEMMA export version '2.1.0'; supported: '0.2'`, `(0, getCurriculumMapping) is not a function`, `expected 0 to be greater than 0` |
- **Affected components:** `core`, `content-engine`, `apps/shell`
- **Impact:** 488+ tests are not a green gate. `pnpm verify-governance` cannot complete. Coverage ratchets (`test:coverage`) never run end-to-end because `turbo` aborts on the first failing task, so **the ≥95% core-logic coverage claim is unverified for every package**.
- **Reproduction:** `pnpm --filter @learninghub/core test`; `pnpm --filter @learninghub/content-engine test`; `cd apps/shell && pnpm test`
- **Specific sub-findings:**
  - **`docs/audit/2026-09-17-forensic-audit.md`** is the single doc lacking a `**Version:**` header → breaks `core`'s doc-completeness assertion. (`foundation.test.ts:290-291` walks all of `docs/`, skipping only `adr/` and `archive/`.)
  - **`narratives-batch8` deletion:** commit `518615f` deleted `narratives-batch1..8.ts` (−8,494 lines) as its commit message states, but `engine-gate-batch8.test.ts` was left behind referencing the deleted module. **The test was never updated.** [FACT, from `git show --stat 518615f`]
  - **STEMMA version-drift:** three sources disagree — see `DOC-001`.
- **Likely root cause:** A single commit (`518615f`, 2026-09-20 21:53) deleted the STEMMA corpus and the narrative batches and stubbed the curriculum mappings, but did not update the six dependent files (adapter version pin, LHS types, learning-path importer, and 3 test suites). The very next commit `2d4b209` disabled CI, so nothing caught it.
- **Blocks next step?** **Y**
- **Confidence:** **High** (direct command output + git evidence)

### DX-001 — CI is disabled; the red gate shipped undetected
- **Evidence:** `.github/workflows-disabled/` contains 10 workflows (`ci.yml`, `deploy.yml`, `security.yml`, `nightly.yml`, `release.yml`, `smoke.yml`, `preview.yml`, `monitor.yml`, `jules-conflict-resolver.yml`, `update-visual-baselines.yml`). HEAD commit `2d4b209` is literally `ci: disable GitHub Actions — run CI locally only`. `.github/` contains NO `workflows/` directory.
- **Impact — this is the meta-finding:** REL-001/DOC-001 are *mechanically undetectable* at the point of merge. A 4-workflow pipeline (`verify` → `pnpm verify-governance`, `docs-sync`, `changeset-check`, `commitlint`, `audit`, `lighthouse`) exists and is well-written (`ci.yml:41` runs the full gate) but is inert. Commit `2d4b209` is dated 2026-09-20 22:16, **23 minutes after** the corpus-sync commit that broke the build (`518615f`, 21:53). The disabling commit is the terminal commit on `main`; nothing has been pushed since.
- **⚠️ CORRECTED CLAIM:** An earlier draft of this finding asserted "zero CI workflow files exist". That is **FALSE**. `ls .github` → `CODEOWNERS`, `PULL_REQUEST_TEMPLATE.md`, `SECURITY.md`, `dependabot.yml`, `workflows-disabled/`. Dependabot config is live and active (`dependabot.yml` has no `enabled: false`); `git shortlog -sn --all` shows **12 commits from `dependabot[bot]`**. So dependency-update automation *is* running; only the *pull-request gate* is off.
- **Recommended direction:** Move `workflows-disabled/*` back to `.github/workflows/` (at minimum `ci.yml`) before or as part of the REL-001 fix. Local-only CI is not sufficient for a repo with an external `origin` at `https://github.com/Er-Sajan-PLG/LearningHub.git`.
- **Blocks next step?** Y (indirectly — it is *why* the P1s persist)
- **Confidence:** **High**

---

## P2 — Medium

### DATA-001 — STEMMA knowledge corpus is empty (0 entities) — the platform's core data source is a no-op
- **Evidence:** `apps/shell/src/data/knowledge.json` → `entity_count: 0`, `entities: []`, `connections: []`, `sources: []`, `export_version: "2.1.0"`, `generated_at: undefined` (verified by direct JSON parse). `source` field reads `content/ + connections/ + sources/ (canonical)`.
- **Context:** Commit `518615f` synced a knowledge.json that is **43,331 lines smaller** (`git show --stat 518615f`: `43331 +---...` pure deletions). The sibling repo `../STEMMA` exists on disk (dated 2026-09-27) and contains `adapters/`.
- **Affected components:** `apps/shell`, `packages/content-provider` (all consumers of the STEMMA seam)
- **Impact:** Every "canonical knowledge" claim in `VISION.md:65`, `ECOSYSTEM.md:102`, and `README.md` is currently unsatisfiable — there is no knowledge to ground on. `lhs-demo.test.ts`, `narrative-integration.test.ts`, and `learning-path.test.ts` assert against real content and fail because there is none. **`[CONTRADICTION]`** — `VISION.md:65` states LH "ingest[s] structured STEM facts from STEMMA exports (`lhs:*`)"; the vendored export has zero facts.
- **Why this matters strategically:** This is not a bug to patch — it is a **data-availability dependency**. Two possibilities: (a) the STEMMA corpus genuinely emptied (content moved/deleted upstream), or (b) the sync ran against the wrong path/ref. `scripts/generate/sync-lhs-knowledge.mjs:18-20` resolves `LHS_ROOT` → `../STEMMA` and requires `exports/knowledge.json`; it *validates the version* (line ~33) but **does not guard against an empty corpus** — it happily copies 0 entities.
- **Recommended direction:** (1) Immediately add an entity-count guard to `sync-lhs-knowledge.mjs` that fails loudly on `entity_count === 0` unless an explicit `--allow-empty` flag is passed. (2) Determine from the STEMMA repo whether the corpus moved. (3) Decide whether narrative content (authored, deleted in `518615f`) should be restored from git history.
- **Blocks next step?** **Y** — this gates any content-facing work
- **Confidence:** **High** for the empty corpus; **Medium** for the cause (upstream vs. script path)

### DOC-001 — Four-way contradiction on the STEMMA export version / schema
- **Evidence — all four must be reconciled:**
  | Source | Says | Line |
  |---|---|---|
  | `apps/shell/src/lib/lhs-adapter.ts` | `SUPPORTED_EXPORT_VERSION = '0.2'` | :22 |
  | `apps/shell/src/lib/lhs-types.ts` | requires `generated_at: string` (non-optional) | :46 |
  | `scripts/generate/sync-lhs-knowledge.mjs` | `SUPPORTED_EXPORT_VERSION = '2.1.0'` | :28 |
  | `apps/shell/src/data/knowledge.json` | `export_version: "2.1.0"`, **no `generated_at`** | (data) |
- **Impact:** The adapter rejects the data it is shipped with. `loadKnowledge()` throws `LhsUnsupportedVersionError` before any lookup, so all 6 `lhs-adapter.test.ts` cases + `lhs-demo.test.ts` fail. The cast `knowledge as LhsKnowledgeExport` (`lhs-adapter.ts:24`) is unsound and TSC rejects it. **The official schema comment in `lhs-types.ts:5` claims "mirror the canonical entity shape defined by STEMMA … + export contract v0.1"** while the actual data is 2.1.0 — so the type file is also stale.

#### Definitive root-cause chain (git archaeology, all `[FACT]`)
| Step | Commit | Date | Action | Effect |
|---|---|---|---|---|
| 1 | `306a013` | 2026-08-18 | Created `sync-lhs-knowledge.mjs`; tweaked `lhs-adapter.ts` (+5/−5) | Establishes the 0.2 seam |
| 2 | `518615f^` state | (pre 2026-09-20) | Vendored export = **`export_version: "0.2"`, `entity_count: 224`, `generated_at: 2026-09-05T20:43:16+00:00`** | The adapter's `'0.2'` pin **and** its required `generated_at` were **both correct** |
| 3 | `518615f` | 2026-09-20 21:53 | Bumped `sync-lhs-knowledge.mjs` → `'2.1.0'`; vendored an **empty** 2.1.0 export; deleted `narratives-batch1..8.ts`; stubbed `curriculum-mappings.ts` | Adapter now rejects its own data. `git show --stat 518615f` lists 13 files — **`lhs-adapter.ts` and `lhs-types.ts` are NOT among them** |
| 4 | `2d4b209` | 2026-09-20 22:16 | Disabled all GitHub Actions | Regression ships undetected |

- **Verification commands:**
  - `git show 518615f^:apps/shell/src/data/knowledge.json` → `0.2`, 224 entities, `generated_at` present.
  - `git log -S"2.1.0" -- apps/shell/src/lib/lhs-adapter.ts scripts/generate/sync-lhs-knowledge.mjs` → only `518615f`.
  - `git show --stat 518615f | grep -c 'lhs-adapter\|lhs-types'` → `0`.
- **Which one does the code follow?** The *data* is 2.1.0 and the *sync script* was deliberately updated to 2.1.0 (its own commit message says so). The **adapter and types are the stale artifacts** — stale by exactly one commit's omission, not by long drift. This materially **lowers** the fix risk.
- **Recommended direction:** Make `lhs-types.ts` + `lhs-adapter.ts` 2.1.0-aware: bump `SUPPORTED_EXPORT_VERSION`, make `generated_at` optional (the 2.1.0 export omits it) or source it from the new metadata fields (`kernel_version`, `relation_registry_version`, `content_hash`), and update the doc comment. Add a contract test asserting the vendored `knowledge.json` parses without throwing.
- **Blocks next step?** Y
- **Confidence:** **High**

### TEST-001 — Coverage ratchet is unverified end-to-end; `test:coverage` cannot run
- **Evidence:** `turbo.json` declares `test:coverage` with `"dependsOn": ["build"]`. Because `turbo test` fails, and `pnpm verify-governance` chains `pnpm test:coverage` after `pnpm test`, the ratchet is never evaluated in CI. Manually observed floors vs. actuals where measurable:
  | Package | Floor (vitest.config) | Observed | Verdict |
  |---|---|---|---|
  | `tracer` | lines 34 | **44.11** lines | PASS, but `dashboard.ts` is **0%** (437 lines, `dashboard.ts:1-437` uncovered) |
  | `quiz-engine` | lines 66 | **69.96** lines | PASS |
  | `simulation-core` | lines 87 | **99.14** lines | PASS |
  | `hover-engine` | lines 85 | **93.54** lines | PASS |
  | `content-provider` | lines 80 | **93.91** lines | PASS |
  | `core`, `content-engine` | 84 / 80 | **not measurable** (run aborts on test failure) | UNKNOWN |
- **Impact:** The headline rule in `AGENTS.md` ("Core logic (new modules): ≥95% line coverage") is **not enforced anywhere**. `tracer`'s `dashboard.ts` (the entire visual dashboard, 437 lines) has 0% coverage but passes its gate because the floor was ratcheted down to 34%. **`[CONTRADICTION]`** — `docs/ROADMAP.md` Phase 1 acceptance criteria claim the dashboard is delivered; it is delivered but entirely untested.
- **Recommended direction:** Restore green tests first, then run `pnpm test:coverage` and record real numbers. Introduce per-file floors for `tracer/dashboard.ts`.
- **Blocks next step?** N (but must follow immediately)
- **Confidence:** **High**

### ARCH-001 — `apps/shell` (60 files, 5,113 lines) is the largest and least-governed component
- **Evidence:** `apps/shell` contains 92 tracked files / 5,113 TS lines — **more than any package** (next largest is `content-engine` at 1,863). `REPOSITORY_HEALTH.md:21` lists `apps/shell` as the only component with `experimental | incubating` and a **80% coverage floor** with no measured coverage. It holds business logic (`src/lib/learning-path.ts`, `src/lib/professor-j-client.ts`, `src/lib/lhs-adapter.ts`) that `ARCHITECTURE/README.md` says should live in `packages/`.
- **Impact:** The component that broke the build is the component with the weakest governance. `lhs-adapter.ts` **duplicates** the STEMMA seam already owned by `packages/content-provider/src/lhs-adapter.ts` (205 lines) — two adapters, two `LhsEntity` interfaces, divergent schemas. `[INFERENCE]` This duplication is the root enabler of DOC-001: changing one does not change the other.
- **Recommended direction:** Consolidate the STEMMA seam into `packages/content-provider` (the package that already owns it and has `content-provider` at 93.91% coverage), and have `apps/shell` consume it. Add a coverage ratchet for `apps/shell` before further features land there.
- **Blocks next step?** N
- **Confidence:** **Medium-High**

### DX-002 — Dependency version split: TypeScript and vitest are declared incompatibly, and the lock overrides contradict the manifests
- **Evidence:**
  - **TypeScript:** 17 packages declare `"typescript": "^7.0.2"`; 7 declare `"^5.8.0"`. Root declares `^5.9.3`. Lockfile resolves **both `typescript@5.9.3` and `typescript@7.0.2`** (`pnpm-lock.yaml:3933,3938`). Installed at root: **5.9.3**.
  - **vitest:** 17 declare `^4.1.11`, 7 declare `^4.1.8`. Root declares `^4.1.11` **and** `@vitest/coverage-v8: ^4.1.11`. But `pnpm-workspace.yaml` `overrides` forces `vitest: ^3.2.6` and `@vitest/coverage-v8: ^3.2.6`. Lockfile resolves **`vitest@3.2.7`** (`pnpm-lock.yaml:4029`). Observed runtime: `RUN v3.2.7`.
- **Impact:** **`[CONTRADICTION]`** Every one of the 24 packages declares a vitest range that the resolver deliberately overrides. The declared `^4.1.11`/`^4.1.8` ranges are **unsatisfiable** by the installed 3.2.7 — this is exactly the class of drift `dependabot` would normally surface via PR, but the PRs would fail the (disabled) gate. TypeScript v7 (`^7.0.2` does not exist on the public registry as a stable release at this commit's date) vs v5.9.3 is a second split. Note `packages/core/package.json` also declares `"typescript": "^7.0.2"` yet compiles with 5.9.3.
- **Recommended direction:** Single-source the toolchain: put `typescript` and `vitest` in the root `devDependencies` only, remove the 24 per-package declarations (or align them all to one range), and delete the `overrides` entries so the manifest and the lock agree. Then re-run the gate.
- **Blocks next step?** N (but is a trap for any dependency work)
- **Confidence:** **High**

### SEC-001 — `docs/policies/SECURITY.md` is materially stale and describes the pre-migration monolith
- **Evidence:** `docs/policies/SECURITY.md:13` — "**STEM-TUITION** handles" (the pre-rename product name). `:14-18` scope lists "contact forms … WhatsApp integration … Future: authentication, progress tracking, payments" — but `packages/auth`, `payments`, `progress`, `admin`, `video` **are already implemented** (per `docs/ROADMAP.md` Phase 7 table and `REPOSITORY_HEALTH.md:23-44`). The policy is marked `Status: ENFORCED` (`:4`).
- **Impact:** The security policy's own scope statement is false, so its risk table (`:22-28`, "Dependency vulnerabilities ✅ None", "Information disclosure ✅ Low") is assessed against a codebase shape that no longer exists. **`[CONTRADICTION]`** An ENFORCED normative policy that misstates what it governs provides false assurance.
- **Recommended direction:** Rewrite scope for the current topology (browser-only shell, no server, P-J as the only outbound integration). Reclassify from `ENFORCED` to `STALE` until re-audited. Add `VITE_PROFESSOR_J_URL` and the P-J `/api/v1/chat` call path (`apps/shell/src/lib/professor-j-client.ts:62`) to the threat model.
- **Blocks next step?** N
- **Confidence:** **High**

### DOC-002 — `.env.example` is missing a variable that the code reads
- **Evidence:** `.env.example` header states it is "the committed contract listing **every variable** the apps read". It documents `VITE_OPENROUTER_API_KEY`, `GITHUB_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. But `apps/shell/src/lib/professor-j-client.ts:112` reads **`import.meta.env.VITE_PROFESSOR_J_URL`** and `packages/pj-client/dist/client.js:6` reads `import.meta.env?.VITE_PROFESSOR_J_URL`. Also, `VITE_OPENROUTER_API_KEY` is documented but **no source file reads it** (`grep` over `packages/ apps/ scripts/` for `OPENROUTER` returns only the P-J client's comment).
- **Impact:** `[CONTRADICTION]` — the documented "contract" is both incomplete (missing `VITE_PROFESSOR_J_URL`) and inaccurate (documents an unread var). A developer copying `.env.example` has no way to point the shell at a P-J backend, so the integration silently falls back to `generateLocalGroundedResponse()` (`professor-j-client.ts:84`) and no one notices the backend was never reached.
- **Recommended direction:** Add `VITE_PROFESSOR_J_URL`; verify and either wire up or delete `VITE_OPENROUTER_API_KEY`; add a test asserting every `import.meta.env.*` in `apps/shell/src` appears in `.env.example`.
- **Blocks next step?** N
- **Confidence:** **High**

### REL-003 — Governance "passes" are misleading: `verify-governance` is red, but 7 of its stages pass independently
- **Evidence:** Run individually: `lint:arch` ✅ (376 modules, 0 violations), `lint:circular` ✅ (0 cycles), `lint:state` ✅, `lint:dom` ✅, `lint:size` ✅, `lint:registry` ✅ w/ 3 warnings, `lint:docs` ✅, `lint:doc-governance` ✅ (10/10), `validate:edu` ✅, `test:a11y` ✅ (32/32), `build` ✅. Only `typecheck` ❌ and `test` ❌ fail.
- **Impact:** This is a **positively misleading** state: the pipeline looks healthy in every dimension except the two that matter most. The README/AGENTS "verify-governance passes all checks" framing (`README.md` Quickstart) plus `ROADMAP.md` Phase 6's "`pnpm verify-governance` — 7/7 stages pass" is stale. `scripts/checks/verify-registry.js` prints "✅ … pass" while emitting 3 warnings for e2e specs that don't exist (`packages/quiz-engine/tests/e2e/quiz-flow.spec.ts`, `packages/audio-synth/tests/e2e/audio.spec.ts`, `packages/simulation-core/tests/e2e/simulation.spec.ts`) — registry entries for phantom files.
- **Recommended direction:** Treat `verify-governance` as the single source of truth; do not quote per-stage results. Make `verify-registry.js` exit non-zero on "referenced but missing", or explicitly mark such entries as `PLANNED` in the registry so the warning is intentional.
- **Blocks next step?** N
- **Confidence:** **High**

### REL-004 — `EventBus.dispatchToLocal()` has no error isolation; one bad subscriber silently kills the rest
- **Evidence — empirically reproduced** (2026-09-30, against the built `packages/core/dist/event-bus.js`):
  ```
  $ node /tmp/ebtest.mjs
  publish threw: subscriber 1 boom
  subscriber 2 reached? NO — dispatch aborted by subscriber 1
  ```
  Test: two subscribers on `a:*`; the first throws, the second records. **The second never ran, and the exception propagated out of `publish()`.**
- **Source:** `packages/core/src/event-bus.ts:72-78` — a bare `for…of` loop calling `entry.handler(payload)` with no `try`/`catch`.
- **Affected components:** `packages/core`; transitively **every** package, since `AGENTS.md` mandates "All cross-module calls go through `EventBus.publish()`/`subscribe()`". That makes the EventBus the ecosystem's single point of failure for inter-module communication.
- **Impact — compounding:** This is materially worse than a plain bug because of three interacting facts: (1) it is the *mandated* IPC mechanism; (2) `packages/core`'s own test suite is currently **red**, so the coverage ratchet that might have caught this is unmeasured (`TEST-001`); (3) the `try/catch` blocks that *do* exist in `publish()` (`:36-39`) protect only the `BroadcastChannel` post, giving a false impression of defensive coding. A single throwing subscriber silently disables every downstream subscriber in registration order — including tracer spans, quiz telemetry, and progress tracking.
- **Reproduction:** the 8-line script above; no repo state needed beyond `packages/core/dist/`.
- **Likely root cause:** the dispatch loop was written for the happy path during the Phase 3 extraction and never hardened. The package's `FUNCTIONAL_NOT_HARDENED`-adjacent state (its tests are red) means this was never verified.
- **Recommended direction:** wrap each handler invocation in `try`/`catch`; route caught errors to the existing `ErrorData` type (`packages/core/src/types.ts:47-54`, which already has `module`, `code`, `message`, `recoverable`, `timestamp`) and, if debug mode is on, `console.error` it. Add a regression test asserting subscriber 2 still runs when subscriber 1 throws. **Also decide explicitly whether `publish()` should throw at all** — swallowing per-handler errors is the safer default for a pub/sub bus, but it must be a documented decision.
- **Blocks next step?** N — but it is a **strong SHOULD** to fold into the same work package, since the file is 98 lines and the fix is ~5 lines. Recommended as a bonus ticket after PR #1 (PR #1 is doc-only and independent).
- **Confidence:** **High** (empirically reproduced, not inferred)

---

## P3 — Low / debt

### DOC-003 — `.phase.json` contradicts `git log`, `ROADMAP.md`, and `AGENTS.md`
- **Evidence:** `.phase.json` marks Phases 9/10/11 as **`"status": "planned"`** with the note that root bumps require a newly-completed phase. Yet `git log` shows all three shipped:
  - `10d1957 feat(phase9): pj-types, pj-client, pj-auth packages — 18 tests`
  - `5ab4557 feat(phase10): pj-audit + pj-policy — 15 tests`
  - `580a8a5 feat(phase11): ecosystem-dashboard + cross-repo-visibility — 22 tests`
  - and all 7 corresponding packages exist on disk and **pass their tests** (`pj-types` 4, `pj-client` 7, `pj-auth` 11, `pj-audit` 8, `pj-policy` 11, `ecosystem-dashboard` 13, `cross-repo-visibility` 10).
  `docs/ROADMAP.md:305-370` agrees with `.phase.json` ("Phase 9 … 🔵 Not started", `packages/pj-client/` "PLANNED"), as does `AGENTS.md`'s "Future Package Map (Phases 9–11)". **All three are wrong**; the auto-generated `ROADMAP` block (`<!-- AUTO:phase-9-status -->🔵 Not started`) is rendered from `.phase.json`, so the generator faithfully propagates the error.
- **Impact:** The single machine-readable source of phase truth is falsified. `scripts/release/release-version.mjs` *reads* `.phase.json` for its bump guard, so any release attempt is gated on stale data. An agent following the canonical precedence chain (`VISION > ECOSYSTEM > CONSTITUTION > RULES > ARCHITECTURE > AGENTS`) would conclude 7 existing, tested packages are unbuilt.
- **Recommended direction:** Update `.phase.json` to mark 9/10/11 completed with the correct versions/dates, then run `pnpm docs:sync` to regenerate the ROADMAP/AGENTS blocks. Investigate why `release-version.mjs` did not already catch the mismatch.
- **Blocks next step?** N
- **Confidence:** **High** (verified both sides)

### DOC-004 — `README.md` repository tree omits 9 of the 24 packages
- **Evidence:** `README.md` "Repository Structure" lists 11 packages ending at `interactive-simulations`. Missing: `auth`, `progress`, `admin`, `payments`, `video` (Phase 7) and `pj-types`, `pj-client`, `pj-auth`, `pj-audit`, `pj-policy`, `ecosystem-dashboard`, `cross-repo-visibility` (Phases 9–11). `AGENTS.md`'s `<!-- AUTO:package-map -->` block *does* list all of them.
- **Impact:** The first document a newcomer reads presents a third of the repository as nonexistent. Note this is a **hand-written** section (not inside an `AUTO:` region), so `docs:sync` does not fix it.
- **Blocks next step?** N · **Confidence:** **High**

### COR-001 — `apps/shell/src/data/curriculum-mappings.ts` is a hard stub presented as a module
- **Evidence:** The file is 18 lines, its header comment reads `* Stub: no curriculum data available.`, `CURRICULUMS = {}`, and `getAvailableCurricula()` returns `[]`. It replaced a 547-line implementation in `518615f`. Its consumer `learning-path.ts` still expects `getCurriculumMapping(curriculum, grade)`, `CURRICULUMS[curriculum]`, and a `mapping.topics[]` shape — none of which exist.
- **Impact:** `generateLearningPath()` is dead code at runtime (it cannot compile). `learning-path.test.ts` (15 tests, 9 failing) documents the intended contract precisely — including "generates a dedicated NEB Grade 11 senior-secondary path" and "falls back to nearest syllabus" — so the **tests are the de-facto specification** for the deleted implementation.
- **Recommended direction:** Recover the pre-`518615f` implementation from git (it is retrievable: `git show 518615f^:apps/shell/src/data/curriculum-mappings.ts`) and restore it, or formally retire `learning-path.ts` + its tests and record the decision. Do not leave a stub that the type-checker rejects.
- **Blocks next step?** Y (it is half of REL-001)
- **Confidence:** **High**

### PLAN-001 — Roadmap phase numbering has drifted from reality; Phase 7/8 never closed
- **Evidence:** `docs/ROADMAP.md:258-262` admits the drift in its own text: *"These packages were built ahead of Phase 7's feature work — the roadmap originally predicted auth/progress/admin would come next, but content delivery was prioritised instead. Phase 8 records what was actually built."* `.phase.json` marks Phase 7 and 8 `in-progress` with `completedVersion: null`. ROADMAP's "Remaining before this phase can be marked complete" (`:277-282`) names **3 unresolved items**, one of which is the exact tracer-instrumentation gap: *"packages declare core/tracer (and simulation-core) but import none of them"*.
- **Impact:** Phases 7 and 8 are **stuck open** with work that has since been *reverted* by `518615f` (the narratives were the Phase 8 content). Two "in-progress" phases with no owner and no burn-down is the classic stall signal.
- **Blocks next step?** N (but informs Phase 9 routing)
- **Confidence:** **High**

### ARCH-002 — `docs/ARCHITECTURE/README.md` C4 set describes a v1.0.0 codebase that no longer exists
- **Evidence:** `docs/ARCHITECTURE/README.md:58` — "Current State (**v1.0.0 Frozen**) … a vanilla HTML/CSS/JS monolith". Its directory tree (`:66-80`) lists `STEM-TUITION/` with `legacy/` at the root. **There is no `legacy/` directory in the repository** (`ls` at root: no `legacy`). The doc is marked `status: CANONICAL`, `last_updated: 2026-09-04`, and is ranked **#5** in the AGENTS.md precedence hierarchy — above `AGENTS.md` itself.
- **Impact:** A canonical, high-precedence architecture document points at a directory that does not exist and describes a migration whose "frozen zone" has been removed. Any agent following the "Legacy Isolation" rule in `AGENTS.md` ("❌ No direct imports from `legacy/`") is guarding a door with no wall behind it. `ADR-004` (legacy-frozen-zone) and `ADR-012` (legacy-removal-acl-role) need to be checked for whether removal was the plan.
- **Blocks next step?** N · **Confidence:** **High** (absence of `legacy/` verified)

### TEST-002 — `packages/*/tests/e2e/*.spec.ts` referenced by the component registry do not exist
- **Evidence:** `verify-registry.js` output — 3 warnings: `packages/quiz-engine/tests/e2e/quiz-flow.spec.ts`, `packages/audio-synth/tests/e2e/audio.spec.ts`, `packages/simulation-core/tests/e2e/simulation.spec.ts` are "referenced but missing from the codebase". Recalls commit `ce2139c test: remove broken e2e spec files with wrong import paths` — files were deleted but the registry entries were not.
- **Impact:** The component registry — a governance artifact asserted by `verify-registry.js` ("✅ 7 registry file(s) pass; 37 file reference(s) verified") — contains dangling references. The check warns but exits 0, so it can never fail.
- **Blocks next step?** N · **Confidence:** **High**

### DX-003 — RESOLVED, no finding
**Verified 2026-09-30:** `scripts/checks/audit-deps.cjs` **does exist** (2,530 bytes). All 12 script paths referenced from root `package.json` and `ci.yml` resolve on disk:
`verify-registry.js`, `verify-doc-governance.mjs`, `strict-doc-governance.mjs`, `size-check.cjs`, `validate-educational-metadata.js`, `docs-sync.mjs`, `sync-versions.mjs`, `generate-health.mjs`, `generate-tree.mjs`, `verify.py`, `verify_export_contract.py`, `verify_git_safety.py`, `audit-deps.cjs` — **all OK, zero missing**.
This item was raised as Low-confidence and is now **dismissed**. Recorded here as evidence the citation spot-check was performed.

### DX-004 — `scripts/narrate/assembly-line.mjs` is dead code superseded by ADR-016
- **Evidence:** `scripts/narrate/assembly-line.mjs:2` — `* DEPRECATED (ADR-016 N6). Superseded by the request-driven content engine.`
- **Impact:** Minor. This is the only explicit `DEPRECATED` marker in the repository (the only TODO/FIXME/HACK-family annotation found across `packages/ apps/ scripts/ e2e/`). It coexists with 4 prompt templates in `scripts/narrate/prompts/` and the `docs/guides/task-playbooks/narration/` role docs (ROLE-WRITER, ROLE-RESEARCHER, ROLE-REVIEWER, ROLE-ANIMATOR, ROLE-MASTER-REVIEWER). **`[UNKNOWN]`** whether the narration playbook docs still describe the deprecated assembly line or the superseding engine — the playbooks were not read line-by-line. Resolving this requires reading the 6 files under `docs/guides/task-playbooks/narration/`.
- **Note:** Absence of TODO/FIXME across the source tree is itself a finding — it means there is **no in-code backlog**, so the roadmap is the only source of intent. That raises the stakes on DOC-003 (roadmap is falsified).
- **Blocks next step?** N · **Confidence:** Medium for the docs question; High for the deprecation marker.

---

## P4 — Information / observations

### OBS-001 — Genuinely strong engineering in the extracted packages
`simulation-core` (99.14% lines, 65 tests, pure functions, zero DOM), `hover-engine` (93.54%, 100% functions), `content-provider` (93.91%) and `core` (arch+circular clean) are textbook Strangler-Fig extractions with real test coverage. The `EventBus` (`packages/core/src/event-bus.ts`, 98 lines) is a clean, dependency-free pub/sub with wildcard support via `patternToRegex()` and optional `BroadcastChannel` cross-tab fan-out. **The architecture is sound; the breakage is confined to the shell integration layer.**

### OBS-002 — Exception-swallowing in EventBus is deliberate but undocumented
`packages/core/src/event-bus.ts:25-26`, `:38-39` use empty `catch {}` blocks for `BroadcastChannel` construction and `postMessage`. Reasonable for cross-tab best-effort messaging, and the no-op is intentional (the busy bus must not throw). But it is not documented, and it means a `DataCloneError` from a non-serializable payload fails silently — a real debugging hazard for `?debug_events=true` users.

### OBS-003 — `metadata`/`index` module-level singleton in the shell adapter
`apps/shell/src/lib/lhs-adapter.ts:49-50` — `let index: Map<...> | null` and `let metadata` at module scope. `AGENTS.md` forbids "`let`/`var` at module scope (except module-level singletons with guards)". This has a guard (`ensureLoaded()`), so it complies, but `loadKnowledge(source)` reassigning the shared `index` means two callers with different sources silently clobber each other.

### OBS-004 — Repository is small, clean, and well-documented for its maturity
502 tracked files, 18,639 TS lines, 54,649 text lines, 200 commits over ~5 months (2026-04-22 → 2026-09-20). 136 markdown files to 130 source files — a documentation-to-code ratio of roughly 1:1, backed by 12 working governance scripts. This is unusually disciplined. The risk is not neglect; it is **drift between the documentation and a rapidly-changing reality** (see DOC-001/003/004, ARCH-002).

### OBS-005 — `E2E` harness is healthy
`pnpm test:a11y` → **32/32 passed** in 15.4s on chromium, covering axe scans on 6 routes, landmarks, keyboard-focusable scrollers, the fee estimator, unit converter, quiz flow, and filters. `playwright.config.ts` runs `vite preview` on :4173 with correct `reuseExistingServer` local behaviour. Visual-regression snapshots (7 baselines) exist and are git-tracked. **This is real, working verification** — notable given everything else is red.

### OBS-006 — 6 stale local branches, none merged
`chore/scope-a7-package-rename` (1), `docs/implementation-plan-post-rename` (2), `feat/physics-grade10-completion` (1), `refactor/rename-to-learninghub` (1) are ahead of `main`; `chore/cloudflare-learninghub-migration` and `fix/ui-polish` are 0 ahead (fully merged/rebased away). No branches deleted. `docs/implementation-plan-post-rename` in particular may hold the authoritative post-rename plan that supersedes `docs/IMPLEMENTATION-PLAN.md`.
