# 08_VALIDATION_RESULTS.md — LearningHub Audit

> **Audit date:** 2026-09-30 · **Mode:** FULL · **Branch:** `main` · **Commit:** `2d4b20974b2c312c75a44d520adb7d42f8388eee` · **Worktree:** CLEAN at start
> **Environment:** Linux · node `v24.21.0` · pnpm `11.18.0` · deps pre-installed (`node_modules/` present, `.bin/tsc`, `.bin/turbo`, `.bin/vitest`, `.bin/eslint`, `.bin/playwright` all present)
> **Safety:** No repo script was executed before reading its source. No destructive operation was performed. `git checkout -- tree.txt` was used once to restore a file that `pnpm docs:sync` regenerated, returning the worktree to its as-found state.
> Valid only for the recorded commit and worktree state. Review all changes since this commit before relying on these conclusions.

---

## 1. Commands RUN — results

| # | Command | CWD | Safety assessment | Exit | Result |
|---|---|---|---|---|---|
| 1 | `turbo build` | repo root | Writes `dist/` only; no network | 0 | ✅ **PASS** — 24/24 tasks. Shell built in 335 ms; largest asset `cosmic-background-uZXUM9z1.js` 66.58 kB (gzip 23.58 kB) |
| 2 | `turbo typecheck` | repo root | Read-only (`tsc --noEmit`) | **1** | ❌ **FAIL** — 47/48 tasks. `@learninghub/shell#typecheck` fails with 3 errors |
| 3 | `pnpm run typecheck` (in `apps/shell`) | `apps/shell` | Read-only | **1** | ❌ Reproduced in isolation: `learning-path.ts(11,3) TS2305`, `learning-path.ts(67,53) TS7006`, `lhs-adapter.ts(24,16) TS2352` |
| 4 | `turbo test` | repo root | Runs vitest; no network | **1** | ❌ **FAIL** — 41/48 tasks |
| 5 | `turbo test --force` | repo root | Same, cache bypassed | **1** | ❌ Confirmed not a stale-cache artifact |
| 6 | `vitest run` (per package, all 24) | each `packages/*` | Read-only | mixed | 21 PASS / 3 FAIL — see §2 |
| 7 | `vitest run` (in `apps/shell`) | `apps/shell` | Read-only | **1** | ❌ 18 failed of 44 |
| 8 | `pnpm run lint:arch` | repo root | Read-only (`dependency-cruiser`) | 0 | ✅ **PASS** — "no dependency violations found (376 modules, 645 dependencies cruised)" |
| 9 | `pnpm run lint:circular` | repo root | Read-only (`madge`) | 0 | ✅ **PASS** — "Processed 199 files … No circular dependency found!" |
| 10 | `pnpm run lint:state` | repo root | Read-only (eslint) | 0 | ✅ **PASS** — no output (clean) |
| 11 | `pnpm run lint:dom` | repo root | Read-only (eslint) | 0 | ✅ **PASS** — no output (clean) |
| 12 | `pnpm run lint:size` | repo root | Read-only (reads `dist/`) | 0 | ✅ **PASS** — 16 assets checked, all ≤150 kB gzip |
| 13 | `pnpm run lint:registry` | repo root | Read-only | 0 | ⚠️ **PASS w/ 3 warnings** — 3 phantom e2e spec refs (TEST-002) |
| 14 | `pnpm run lint:docs` | repo root | Read-only | 0 | ✅ **PASS** — all canonical/archival metadata + AGENTS.md hygiene verified |
| 15 | `pnpm run lint:doc-governance` | repo root | Read-only | 0 | ✅ **PASS** — 10/10 checks |
| 16 | `pnpm run validate:edu` | repo root | Read-only | 0 | ✅ **PASS** — 20 questions validated, 20 concepts cross-referenced |
| 17 | `pnpm run test:a11y` | repo root | Starts `vite preview` on :4173; local only | 0 | ✅ **PASS** — **32/32** Playwright chromium tests in 15.4 s |
| 18 | `pnpm run docs:sync` | repo root | **WRITES** managed docs + `tree.txt` | 0 | ✅ Idempotent for AUTO regions ("already in sync" ×5) but ⚠️ **modified `tree.txt`** (see §3) |
| 19 | JSON parse of `apps/shell/src/data/knowledge.json` | repo root | Read-only | 0 | ⚠️ `entity_count: 0`, `entities: []`, `export_version: "2.1.0"`, `generated_at: undefined` |
| 20 | `git show 518615f^:.../knowledge.json` + parse | repo root | Read-only | 0 | ✅ Proved pre-break state: `0.2`, **224 entities**, `generated_at: 2026-09-05T20:43:16+00:00` |

## 2. Per-package test results (authoritative)

| Package | Test Files | Tests | Verdict |
|---|---|---|---|
| `acl` | 1 | 19 passed | ✅ |
| `admin` | 1 | 7 passed | ✅ |
| `audio-synth` | 1 | 14 passed | ✅ |
| `auth` | 1 | 13 passed | ✅ |
| **`content-engine`** | **1 failed to load / 2 passed** | 48 passed | ❌ **FAIL** (suite error) |
| `content-provider` | 4 | 40 passed | ✅ |
| **`core`** | 1 failed / 1 passed | **1 failed** / 107 passed | ❌ **FAIL** |
| `cross-repo-visibility` | 1 | 10 passed | ✅ |
| `ecosystem-dashboard` | 1 | 13 passed | ✅ |
| `hover-engine` | 1 | 12 passed | ✅ |
| `interactive-simulations` | 2 | 19 passed | ✅ |
| `lesson-renderer` | 1 | 56 passed | ✅ |
| `payments` | 1 | 10 passed | ✅ |
| `pj-audit` | 1 | 8 passed | ✅ |
| `pj-auth` | 1 | 11 passed | ✅ |
| `pj-client` | 1 | 7 passed | ✅ |
| `pj-policy` | 1 | 11 passed | ✅ |
| `pj-types` | 1 | 4 passed | ✅ |
| `progress` | 1 | 7 passed | ✅ |
| `quiz-engine` | 2 | 16 passed | ✅ |
| `simulation-core` | 1 | 65 passed | ✅ |
| `tracer` | 1 | 24 passed | ✅ |
| `video` | 1 | 12 passed | ✅ |
| **`apps/shell`** | **4 of 8 failed** | **18 failed** / 26 passed | ❌ **FAIL** |

**Totals: 355 tests passing across `packages/*`; 18 failing in `apps/shell`; 1 failing + 1 suite unloadable.**

### `content-engine` — suite load failure (exact output)
```
FAIL  tests/engine-gate-batch8.test.ts [ tests/engine-gate-batch8.test.ts ]
Error: Cannot find module '../../../apps/shell/src/data/narratives-batch8'
  imported from '/home/sajan/Projects/LearningHub/packages/content-engine/tests/engine-gate-batch8.test.ts'
 ❯ tests/engine-gate-batch8.test.ts:17:1
Caused by: Error: Failed to load url ../../../apps/shell/src/data/narratives-batch8
```
**Root cause:** the module was deleted in `518615f` (`git show --stat 518615f` → `apps/shell/src/data/narratives-batch8.ts | 1006 -`). The test was not updated.
**Note this suite ALSO crosses the app/package boundary** — a package test importing from `apps/`. Flagged as an architectural smell in `10_IMPLEMENTATION_PLAN.md` Phase 3.

### `core` — single doc-header failure (exact output)
```
FAIL  tests/foundation.test.ts > Documentation completeness > all docs have Version header (ADRs use Status/Date template)
AssertionError: expected '---\nstatus: CANONICAL\nowner: Audit …' to match /\*\*Version:\*\*/
 ❯ tests/foundation.test.ts:291:23
    291|       expect(read(f)).toMatch(/\*\*Version:\*\*/);
 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 107 passed (108)
```
**Offending file identified by exhaustive enumeration** (walked every `docs/**/*.md` excluding `docs/adr/` and `docs/archive/`, per the test's own skip logic at `:283`): **`docs/audit/2026-09-17-forensic-audit.md`** is the ONLY doc lacking a `**Version:**` header.

### `apps/shell` — 18 failures by suite
| Suite | Fails | Representative error |
|---|---|---|
| `tests/lhs-adapter.test.ts` | 6 / 8 | `Unsupported STEMMA export version '2.1.0'; supported: '0.2'.` |
| `tests/lhs-demo.test.ts` | 1 / 1 | same version error |
| `tests/learning-path.test.ts` | 9 / 15 | `(0 , getCurriculumMapping) is not a function` |
| `tests/narrative-integration.test.ts` | 2 / 3 | `expected 0 to be greater than 0`; `Cannot read properties of undefined (reading 'relationships')` |

## 3. `docs:sync` side-effect — `tree.txt` drift
`pnpm docs:sync` reported "already in sync" for all 5 managed AUTO regions, then regenerated `tree.txt` (via `scripts/generate/generate-tree.mjs`), producing a 19-insert/10-delete diff. It also stamped the tree with a **new** HEAD sha.

**Pre-existing drift confirmed:** the committed `tree.txt` is stamped `STEM-TUITION/  4904c3f` while HEAD is `2d4b209` — **3 commits stale** (`git rev-list --count 4904c3f..HEAD` = 3).
**Implication:** `.github/workflows-disabled/ci.yml`'s `docs-sync` job runs `pnpm docs:sync` then `git diff --exit-code -- . ':(exclude)tree.txt'` plus a tree.txt tolerance check requiring ≤2 changed lines. A stale `tree.txt` does not itself fail that check (it only allows the SHA line to differ, tolerating ≤2 lines) — but **the job also asserts `git ls-files --others --exclude-standard` is empty**, which the `.agent/` audit directory would break unless it is gitignored or committed. Recorded as a Phase 4 task in the implementation plan.
**Action taken:** `git checkout -- tree.txt` to restore the worktree to its as-found state. The drift is recorded, not silently accepted.

## 4. Commands DISCOVERED but NOT RUN

| Command | Reason not run |
|---|---|
| `pnpm verify-governance` (full chain) | Guaranteed to fail at stage 2 (`typecheck`); each constituent stage was run individually instead so the audit reports the true per-stage state rather than a single early exit |
| `pnpm test:coverage` (all packages) | Blocked — `turbo` aborts on the first failing `test` task, and `test:coverage` `dependsOn: ["build"]` chained after a red suite. Per-package `--coverage` was run where the suite passes |
| `pnpm lint:commit` | Would lint only the last commit; low value for an audit |
| `pnpm release:*` (5 scripts) | **Intentionally not run.** These mutate versions, create tokens, and rewrite changelogs. Audit rule A4 forbids it |
| `pnpm generate:graph` | Requires Graphviz `dot` on PATH (absence not verified); produces `docs/dependency-graph.svg`. Low value — `lint:arch` already proved 0 violations |
| `scripts/checks/audit-deps.cjs` (`pnpm audit`) | **Requires network** — registry advisory feed. Not run to respect the offline/no-network default; the CI job that would run it is disabled anyway |
| `pnpm sync:lhs` | **Declined deliberately** — `LHS_ROOT` defaults to `../STEMMA`, and the script does not guard against an empty corpus. Running it could re-vendor an empty file and mutate the repo (the exact failure under investigation). Its source was read in full (`sync-lhs-knowledge.mjs`) and the guard-absence finding is based on that reading |
| `pnpm setup-hooks` | Mutates local git config (`core.hooksPath`). Audit rule A4 |
| Lighthouse CI (`lhci collect/assert`) | Requires a browser install + a preview server; `lighthouserc.json` asserts a11y ≥0.95. The 32-test Playwright a11y suite was run instead as a stronger, already-installed signal |
| Visual-regression Playwright specs (`--grep visual-regression`) | Excluded by `test:a11y`'s own `--grep-invert`; baselines are 7 git-tracked PNGs. Not run to avoid generating comparison artifacts |
| `docker build` | No Docker daemon assumed; `Dockerfile` + `.dockerignore` read only |

## 5. Explicit answers required by Phase 7

| Question | Answer | Evidence |
|---|---|---|
| **Can it build?** | ✅ **YES** | `turbo build` → 24/24, exit 0 |
| **Can it run?** | ✅ **YES** | `pnpm test:a11y` boots `vite preview` on :4173 and 32/32 tests pass against it |
| **Do tests pass?** | ❌ **NO** | 18 fail in `apps/shell`, 1 in `core`, 1 suite in `content-engine` cannot load. `pnpm test` exits 1 |
| **Can it deploy (evidence)?** | ⚠️ **UNVERIFIED** | `wrangler.toml` + `vercel.json` + `Dockerfile` exist; `.github/workflows-disabled/deploy.yml` is the deploy path and is **disabled**. `git log` shows `test: trigger Cloudflare deploy` and `fix: add _redirects for Cloudflare Pages routing` — deployment was being attempted at the point of the last commits. No network deploy was attempted during this audit |
| **What works end to end right now?** | The shell builds and serves; all 6 routes render; a11y clean; the fee estimator, unit converter, quiz, filters and contact form all work (32 e2e tests). 21 of 24 packages' unit suites are green. Architecture lint is clean. | §1 rows 1, 8–12, 17 |
| **What is broken right now?** | (1) `pnpm typecheck` — 3 TS errors. (2) `pnpm test` — 3 packages. (3) The STEMMA knowledge seam throws on every call. (4) `generateLearningPath()` cannot run. (5) `content-engine`'s batch-8 gate suite cannot load. (6) `pnpm verify-governance` cannot pass. (7) CI disabled. (8) `.phase.json` falsified. | §1 rows 2, 4–7, 19; findings REL-001/002, DOC-001/003, COR-001, DATA-001, DX-001 |

## 6. Coverage observations (where measurable)

`test:coverage` could not be run repo-wide. Per-package `--coverage` results:

| Package | Lines | Branches | Funcs | Floor (lines) | Verdict |
|---|---|---|---|---|---|
| `simulation-core` | **99.14** | 95.55 | 93.75 | 87 | ✅ Best in repo |
| `content-provider` | **93.91** | 86.59 | 100 | 80 | ✅ |
| `hover-engine` | **93.54** | 88.88 | 80 | 85 | ✅ |
| `quiz-engine` | **69.96** | 72.41 | 52.94 | 66 | ✅ (just above floor) |
| `tracer` | **44.11** | 88.4 | 86.2 | 34 | ⚠️ PASSES but `dashboard.ts` = **0%** (437 lines), `index.ts` = 0%, `types.ts` = 0% |
| `core` | not measurable | — | — | 84 | UNKNOWN (run aborts on test failure) |
| `content-engine` | not measurable | — | — | 80 | UNKNOWN (suite cannot load) |
| other 17 packages | not measured | — | — | 70–85 | UNKNOWN |

**`tracer` is the standout anomaly:** the package's headline deliverable — `<stem-tracer-dashboard>`, 437 lines (`packages/tracer/src/dashboard.ts:1-437`) — has **zero coverage**, and the floor was ratcheted down to 34% (from where `ROADMAP.md` Phase 1's "24 tests passing" framing implies it should be far higher). The 24 passing tracer tests cover `tracer.ts` (92.16%) and `decorator.ts` (95%), not the dashboard.

## 7. Environment/limitations

- **No network was used.** All external-dependency claims are limited to what is on disk. `pnpm audit` (advisory feed) was not run.
- **`../STEMMA` exists on disk** (dated 2026-09-27) and contains `adapters/` and `.agent-rules.md`. Its `exports/knowledge.json` was **not** read — that is the sibling repo, outside this repository's scope, and reading it was not necessary to establish the finding. `[UNKNOWN]` whether it currently holds a corpus. **This is the single highest-value unresolved question** and Phase 0 of the plan resolves it.
- **6 local branches were not checked out** (audit rule: no destructive branch switching). Their 1–2 unmerged commits were counted via `git log main..<branch>` but their contents were not diffed. Phase 0 of the plan diffs them.
- Only `chromium` (the sole configured Playwright project) was exercised for e2e.
- The `.git` object store was inspected via commands only, never line-read.
