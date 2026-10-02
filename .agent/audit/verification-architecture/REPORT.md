---
title: "Verification-Architecture Audit — Report"
status: ACTIVE
date: 2026-10-03
canonical: false
branch: ci/verification-architecture
base_commit: 97e6cf58e4beb6dd35b96ee003fb3afdc90af586
terminal_state: COMPLETE-REMOTE-UNVERIFIED
mode: IMPLEMENT (additive Class-1 changes only)
---

# Verification-Architecture Audit — Report

Executed with the consolidated prompt in [`PROMPT.md`](./PROMPT.md).
Every claim below is tied to a commit SHA and a reproducible command.

---

## 0. Terminal state, mode, evidence ladder

**Terminal state: `COMPLETE`.**

| Field | Value |
|---|---|
| Mode | `IMPLEMENT` (default), additive Class-1 changes only |
| Base commit | `97e6cf5` (`main`) |
| Branch | `ci/verification-architecture` — **pushed**; PR **#88** (https://github.com/STEMORG2026/LearningHub/pull/88) |
| Commits | `a57c9fb`, `0fb9538`, `c5959c6`, `60c1276`, `45b5f79`, `85a5f78`, `3f542a3` |
| Evidence rung, `ci.yml` | **4** — PR #88, SHA `3f542a3` **and** the docs-only HEAD `3a37fba`: **15/15 checks `success`** |
| Evidence rung, `security.yml` | **4** — `success` on both (gitleaks, Trivy, dep audit) |
| Evidence rung, `smoke.yml` | **4** — `success` on both (E2E core ×2, visual regression) |
| Evidence rung, **the two new stages** | **4** — observed running *and passing* inside the PR #88 "Verify governance" job, on both SHAs |
| Evidence rung, `nightly.yml` | **4 (stale)** — last observed run 2026-09-20, `failure`; no run since the workflow set was restored |
| Evidence rung, `release.yml` | **1** — static only (tag-triggered; cannot be exercised without authorizing a release) |

> **Evidence stability.** The evidence applies to the **code under test** (all commits up to
> `3f542a3`). The remaining commits in this PR are documentation-only — they touch no script,
> workflow, or package manifest — so a green run at any of them certifies the same code.
> That is why this table may name a SHA one commit behind the branch HEAD without weakening
> the claim.

**Why `COMPLETE` now.** PR #88 supplied the observation this audit was missing. The
**Verify governance** job ran `pnpm verify-governance` — the full 30-stage chain — and passed
in 5 m 11 s, including:

- `test:script-targets` → `✓ every referenced script target exists.`
- `test:script-targets:prove` → `✓ all 3 scenario(s) passed` (planted dangling reference
  detected, valid references pass, real tree passes)
- `prove-gate-integrity` → `✓ mandatory stage present: test:script-targets` and
  `✓ mandatory stage present: test:script-targets:prove`
- `test:flakes:prove` → `✓ Detector is falsifiable … Probe removed; suite restored.` — the one
  stage the local sandbox could not execute (§2), now observed green on a real runner.

All **15/15** checks passed, including **Documentation freshness** (the check the `85a5f78`
fix repairs) and **Changeset requirement check**. The PR was **not merged** — the owner merges.

---

## 1. Repository discovered

| Item | Finding | Evidence |
|---|---|---|
| VCS / forge | Git; GitHub `STEMORG2026/LearningHub` (`origin`, HTTPS) | `git remote -v` |
| Languages | TypeScript (strict), CSS, HTML. **No Python in the build** (3 orphan `.py` scripts, §4 F11) | `git ls-files`, `package.json` |
| Frameworks | Vite 8 (`apps/shell`), Web Components, Playwright 1.62 | `playwright.config.ts`, `apps/shell` |
| Build / package | pnpm `11.18.0` workspaces + Turborepo `2.11.5`; vitest 4.1.11 (v8 coverage) | `package.json`, `pnpm -v`, `pnpm lint` output |
| Monorepo | 24 workspaces: 22 `packages/*` + `apps/shell` + `e2e` | `turbo lint` package list |
| **CI_SYSTEMS** | `[github-actions]` — 8 active workflows + **2 parked** in `.github/workflows-disabled/` | `ls .github/workflows*` |
| **Hook source of truth** | `core.hooksPath = scripts/git-hooks` (local git config, activated by `pnpm setup-hooks`). Tracked, hand-written `sh`: `commit-msg`, `pre-commit`, `pre-push`. Not auto-fixing (one `git add -u` after `docs:sync`) | `git config core.hooksPath`; `scripts/git-hooks/*` |
| Toolchain pins | `.nvmrc` = `22`; `engines.node >= 22.13`; `packageManager pnpm@11.18.0`; CI `node-version: 22`, `pnpm 11.18.0` — **aligned** | `.nvmrc`, `package.json`, `ci.yml` |
| **Local/CI divergence** | Local runtime here is **node v24.21.0**; CI pins 22. Nothing enforces the pin locally (no `.tool-versions`, no `mise`, no `engines-strict`) | `node -v` vs `ci.yml:27` |
| Governance | `AGENTS.md`, `docs/{VISION,ECOSYSTEM,CONSTITUTION,RULES,ARCHITECTURE}`, `.github/CODEOWNERS`, `.github/dependabot.yml`, `.changeset/`, `lighthouserc.json`, `bundlesize.config.json` | tree |
| **Not auditable** | Cloudflare Pages dashboard settings (build/branch control); org-level Actions policy; whether `nightly`/`preview` are enabled in the Actions UI; `workflow_run`-scoped token behaviour | `gh api` does not expose these |

---

## 2. Baseline

Environment: Linux, node `v24.21.0`, pnpm `11.18.0`, `actionlint` 1.7.7,
`shellcheck` present, `gh` authenticated (`Er-Sajan-PLG`), Playwright chromium cached.
Working tree clean at `97e6cf5`.

| Tier / stage | Command | Exit | Wall | Notes |
|---|---|---|---|---|
| pre-commit | `pnpm gate:precommit` | **0** | 7 s (warm) | 5 stages; 48 turbo tasks |
| pre-push | `pnpm gate:prepush` | **0** | 17 s (warm) | 24 stages |
| **CI tier** | `pnpm verify-governance` | **1** | 129 s | all stages green **except** `test:flakes:prove` |
| coverage | `pnpm test:coverage` | **0** | — | 24/24 packages |
| E2E + a11y | `pnpm test:a11y` | **0** | 15.9 s | **32 passed** |
| mutation | `pnpm test:mutation` | **0** | — | **52/52 killed = 100 %** (2 adjudicated equivalent) |
| registry | `pnpm lint:registry` | **0** | — | 3 **pre-existing warnings** (below) |
| dep audit | `pnpm audit:deps` | **0** | — | 2 allowlisted highs (`extract-zip`) |

**The one non-green stage is an environment artifact, not a repo defect.**
`scripts/checks/prove-flakes.mjs:117` calls `unlinkSync(PROBE)` in a `finally` block.
This sandbox intercepts Node's `fs` deletes and aborts at a 50-deletions-per-turn
threshold:

```
Error: [safe-delete][SAFE_DELETE_BULK_CONFIRM_REQUIRED] {"count":50,"threshold":50,"scope":"turn",
targets:["…/packages/core/tests/__flakeproof-probe.test.ts"]}
    at fileURLToPath/…/prove-flakes.mjs:117:5
```

The script's own cleanup logic is correct; the environment refused it. It left one
untracked probe file, which **I removed**; `git status` is clean. The stage is
otherwise unexecuted here → reported as *untestable in this environment*.

Pre-existing failures: none in the local tiers. Pre-existing warnings:

- `lint:registry` — 3 registry references to e2e specs that do not exist
  (`packages/quiz-engine/tests/e2e/quiz-flow.spec.ts`, `packages/audio-synth/tests/e2e/audio.spec.ts`,
  `packages/simulation-core/tests/e2e/simulation.spec.ts`). Warning-level; exit 0.
- `lint:circular` (madge) — "Processed 208 files (2 warnings)". Pre-existing; identical
  output from the same stage inside the gate. Surfaced more visibly now that
  `pnpm lint` actually runs (§4 F2).

Flakes observed: none. Unexecutable: `test:flakes:prove` (sandbox); Docker-based
`gitleaks` and `trivy` (no container runtime used); `deploy`/`release`/`preview`
(no authorization).

---

## 3. Unified matrix (baseline → final)

`B` blocking · `A` advisory · `C(cond)` conditional · `—` absent.
The **Δ** column records what my commits changed.

| Property | commit-msg | pre-commit | pre-push | local-full | remote-CI | merge-gate | scheduled | release | Δ |
|---|---|---|---|---|---|---|---|---|---|
| LINT_ARCH (dependency-cruiser) | — | B | B | B | B | B | B | — | unchanged |
| LINT_CIRCULAR (madge) | — | B | B | B | B | B | B | — | unchanged |
| LINT_ESLINT (state, dom) | — | B | B | B | B | B | B | — | unchanged |
| TYPE | — | B | B | B | B | B | B | — | unchanged |
| UNIT_TEST | — | — | B | B | B | B | B | — | unchanged |
| COVERAGE | — | — | — | B | B | B | B | — | unchanged |
| BUILD | — | — | B | B | B | B | B | B | unchanged |
| E2E_CORE + A11Y | — | — | — | B | B ×2 | B | B | — | unchanged |
| E2E_VISUAL | — | — | — | — | B | B | — | — | unchanged |
| **SCRIPT_TARGETS** | — | — | **B** | **B** | **B** | **B** | **B** | — | **added** |
| GENERATED_FILES (docs sync) | — | B | B | B | B | B | B | — | unchanged |
| GOVERNANCE_GUARDS (10 guards) | — | — | B | B | B | B | B | — | unchanged |
| DEP_AUDIT | — | — | B | B | B ×3 | B ×2 | B | — | unchanged |
| COMMIT_MSG (commitlint) | B | — | — | — | B | B | — | — | unchanged |
| CHANGESET | — | — | — | — | B | B | — | — | unchanged |
| SECRET_SCAN (gitleaks) | — | — | — | — | B | B | B | — | unchanged |
| VULN_SCAN (trivy) | — | — | — | — | B | B | — | B | unchanged |
| LIGHTHOUSE | — | — | — | — | B | B | B | — | unchanged |
| RELEASE integrity | — | — | — | — | — | — | — | B | unchanged |
| DEPLOY | — | — | — | — | — | — | C(CI green on main) | — | unchanged |
| PREVIEW | — | — | — | — | A (PR only) | — | — | — | unchanged |

Baseline evidence of execution: `pre-commit`/`pre-push` from the hook scripts and
`gate-stages.mjs` expansion; `remote-CI` from the workflow step lists and the
observed runs for `97e6cf5`; `merge-gate` from `gh api …/branches/main/protection`.

---

## 4. Findings, ranked by assurance gained ÷ (risk + effort)

### F1 — A declared entry point that cannot execute — **FIXED**
`ci:local:list` invoked `scripts/ci-local.mjs`, deleted when the gate ladder replaced
the old local-CI runner. `pnpm ci:local:list` → `MODULE_NOT_FOUND`. Nothing detected
it: `prove-gate-ladder` validates stage *names*, not stage *file targets*.
**Fix:** `0fb9538` — repointed to `gate-stages.mjs --list` (single source of truth).

### F2 — A governance-mandated command that verified nothing — **FIXED**
`docs/RULES.md:645` states *"All AI-generated code MUST pass: `pnpm lint` (no warnings)"*.
`pnpm lint` was `turbo lint`, and **no workspace defines a `lint` script**, so turbo
printed *"No tasks were executed as part of this run"* and exited **0**:

```
$ pnpm lint
 • Running lint in 24 packages
 WARNING  No tasks were executed as part of this run.
 Tasks:    0 successful, 0 total
[exit 0]
```

A mandatory verification command that executes zero tasks satisfies "no warnings"
vacuously. This is the clearest false-green in the repository.
**Fix:** `c5959c6` — `lint` now runs the four real lint stages (~7 s; 391 modules /
665 dependencies cruised, 208 files checked, both eslint configs clean).

### F3 — Unnecessary duplication: dependency audit runs 3× per PR, twice as a required check — **REPORTED**
Identical script `node scripts/checks/audit-deps.cjs`, same trust boundary
(GitHub-hosted `ubuntu-latest`), same inputs, same tool config:

| Where | Job name | Required? |
|---|---|---|
| `ci.yml` `verify` → `verify-governance` → `audit:deps` | "Verify governance" | **yes** |
| `ci.yml` `audit` | "Dependency audit" | **yes** |
| `security.yml` `audit` | "Dependency audit (security)" | **yes** |

Classification: **unnecessary duplication**. Two redundant required checks.
**Not applied** — collapsing them changes required-check names (Class 2). §5 P1.

### F4 — Unnecessary duplication: the non-visual Playwright suite runs twice per PR — **REPORTED**
- `ci.yml` `verify` → `verify-governance` → `test:a11y`
  = `playwright test --config=playwright.config.ts --grep-invert 'visual-regression'` — required as "Verify governance".
- `smoke.yml` `e2e-core` shards 1–2
  = `playwright test --config=playwright.config.ts --shard=N/2 --grep-invert "visual-regression"` — required as "E2E core (shard 1/2)" and "(shard 2/2)".

Identical test selection, same trust boundary. The sharded run is the faster signal;
the unsharded run adds no assurance. Classification: **unnecessary duplication**.
Incidental: `test:a11y` is misnamed — it runs the whole non-visual suite, not just a11y.
**Not applied** — Class 2 (required-check change). §5 P2.

### F5 — Vacuous job: `signed-tags` can never do work — **REPORTED (deferred removal)**
`ci.yml` triggers on `pull_request` and `push: branches [main]` only — never on tags —
so `signed-tags` always prints *"Skipping — not a tag push"* and passes. It is **not**
a required check, so it is harmless, but it is dead verification that inflates the job
list and dilutes signal. The real tag-signature check is `release.yml` `gate`.
Deferred to a follow-up: removal needs confirmation that no external consumer depends
on the `Verify signed tags` context. §5 P6.

### F6 — Least privilege: unused `issues: write` — **REPORTED**
`security.yml` grants `issues: write` at workflow level; no job writes issues
(gitleaks, `audit-deps.cjs`, trivy-fs). Over-broad. Class 2 (CI permissions). §5 P3.

### F7 — Scheduled tier is currently unverified, and its audit job disagrees with the gate — **REPORTED**
- `nightly.yml` last ran **2026-09-20** and **failed all three jobs** (`Dependency audit`,
  `Lighthouse CI`, `Full governance`). No nightly run since — consistent with the
  2026-09-20 disablement recorded in ADR-023 and a ~2026-10-02 restoration; the next
  cron (`0 2 * * *`) had not been reached at audit time. **Current health unknown.**
- `nightly.yml`'s audit job runs raw `pnpm audit --audit-level high`, while the PR gate
  runs `scripts/checks/audit-deps.cjs`, which carries a documented allowlist
  (`GHSA-jmr9-qjv8-65gv`, `GHSA-7pqw-9j4j-h8q3`). `pnpm audit` does not honour that
  allowlist, so nightly is structurally expected to stay red on advisories the gate has
  accepted. A permanently-red scheduled job trains people to ignore red.

### F8 — Playwright retries in CI can mask flakes — **REPORTED**
`playwright.config.ts`: `retries: process.env.CI ? 1 : 0`. The repository invests in a
dedicated flake detector (`test:flakes` / `test:flakes:prove`, vitest suites only), yet
the E2E gate auto-retries. A test that only passes on retry is not reported as flaky.
Recommendation: keep retries for infra noise but surface retried tests (or set
`retries: 0` and rely on the detector). Not applied — out of the gate's scope.

### F9 — Parked workflows are unlinted, and production uptime monitoring is off — **REPORTED**
`lint:workflows` scans only `.github/workflows/`; `.github/workflows-disabled/`
(2 files) is a blind spot by design. One of them is `monitor.yml` — a 5-minute
production uptime monitor. **Production uptime monitoring is currently disabled.**
Re-enabling is Class 2 (workflow trigger) and it reads `secrets.SITE_URL`. §5 P5.

### F10 — Merge gate: zero required approvals, CODEOWNERS not enforced — **REPORTED**
`gh api repos/…/branches/main/protection`:

```
required_status_checks: strict=true, 13 contexts
required_pull_request_reviews: dismiss_stale_reviews=true,
                               require_code_owner_reviews=false,
                               required_approving_review_count=0
required_signatures.enabled = false
enforce_admins.enabled = true
required_linear_history.enabled = false
allow_force_pushes.enabled = false   allow_deletions.enabled = false
required_conversation_resolution.enabled = true
(no merge queue)
```

`.github/CODEOWNERS` exists and `AGENTS.md` says *"Only the Owner Merges"*, but with
`required_approving_review_count: 0` and `require_code_owner_reviews: false` a PR can be
merged by its author with no review once checks pass. Mitigated by `enforce_admins: true`
and `strict: true`. The **integrity axis is satisfied** — checks are required and
non-bypassable — but the human-approval axis is not enforced by the platform. §5 P4.

### F11 — Dead verification scripts (purpose unknown) — **REPORTED**
`scripts/verify.py`, `scripts/verify_export_contract.py`, `scripts/verify_git_safety.py`
are referenced by no script, hook, workflow, or test — only by `docs/CHANGELOG.md`
(historical) and `.agent/audit/`. Preserved by default per the "purpose unknown" rule.
Recommend a follow-up decision: wire in, or retire with a deprecation note.

### F12 — Required-check name stability risk — **REPORTED**
Required contexts include matrix-derived names `E2E core (shard 1/2)` / `(shard 2/2)`.
Any edit to `smoke.yml`'s matrix or job name leaves those requirements permanently
pending (never "failed", so the PR simply cannot merge). `Changeset requirement check`
is also conditional (`if: github.event_name == 'pull_request'`); today it cannot skip on
a PR, but it is one condition away from a deadlock. Both are currently consistent —
this is a standing hazard to document, not a live defect.

### F13 — Supply chain notes — **REPORTED**
1. **Actions pinned to mutable major tags** (`actions/checkout@v7`, `pnpm/action-setup@v6`,
   `aquasecurity/trivy-action@v0.36.0`, `peter-evans/*`, `softprops/action-gh-release@v2`,
   `sigstore/cosign-installer@v3`, `docker/*`, `Ilshidur/action-discord@0.4.0`), not SHAs.
   Dependabot's `github-actions` ecosystem updates them weekly, so pins do not rot — but a
   compromised tag would be picked up automatically. Recommendation: SHA-pin third-party
   actions; `actions/*` is lower risk.
2. **Unpinned bootstrap script:** both `ci.yml` jobs install actionlint via
   `bash <(curl -sSf https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash)`.
   The *version* is pinned (1.7.7); the *installer* is fetched from `main` at run time.
   Recommendation: vendor it or verify a checksum.
3. **`github.ref_name` interpolated into shell** (`release.yml:31`, `ci.yml:159-161`).
   Double-quoted, but `$(…)` inside double quotes still executes, and git ref names permit
   `$` and `(`. Requires tag-creation rights → low severity. Recommendation: pass via
   `env:` and use `"$REF"`.
4. **`deploy.yml` `workflow_run` + secrets — reviewed, currently safe.** It runs only when
   `conclusion == 'success'` **and** `head_branch == 'main'`, and checks out the main SHA.
   The condition is the security boundary; do not relax it.
5. **No untrusted-PR-with-secrets path found.** `preview.yml` uses `pull_request`
   (not `pull_request_target`), and passes `github.head_ref` through `env:`, quoted.

### F14 — Inert `turbo.json` task — **REPORTED (deferred cleanup)**
`turbo.json` still declares `lint: { outputs: [] }`, but no workspace implements `lint`.
After `c5959c6`, `pnpm lint` no longer uses turbo, so the task is unreferenced. It is inert
config, not a protection — recorded as a deferred cleanup (§5 P7).

### F15 — Out-of-scope observations (for the owner; not acted on)
- `lint:registry`'s 3 missing e2e spec references (F2 §2) — registry-vs-tree drift.
- madge's 2 file-resolution warnings (pre-existing).
- `.github/workflows-disabled/monitor.yml` disabled ⇒ no production uptime alerting (F9).
- The local runtime is node 24 while CI pins 22 (§1) — a real local/CI divergence.

---

## 5. Pending Class-2 decisions

| # | Decision | Options | Recommendation | Info needed |
|---|---|---|---|---|
| **P1** | Collapse the 3× dependency audit to 1 (F3) | (a) drop the `ci.yml` `audit` job; (b) drop the `security.yml` `audit` job; (c) leave as-is | (a) — `security.yml` groups the security scans; `verify-governance` already runs the same script | Confirm which context names branch protection must keep |
| **P2** | De-duplicate the E2E core suite (F4) | (a) drop `test:a11y` from `verify-governance`; (b) drop `smoke.yml` `e2e-core`; (c) leave as-is | (a) — keeps the sharded, faster, required `E2E core` checks; rename `test:a11y` to `test:e2e` for honesty | Confirm nothing consumes the `Verify governance` job for E2E specifically |
| **P3** | Remove unused `issues: write` from `security.yml` (F6) | (a) remove; (b) keep | (a) | Confirm no planned issue-creating step |
| **P4** | Enforce review / CODEOWNERS (F10) | (a) set `required_approving_review_count: 1` + `require_code_owner_reviews: true`; (b) require signed commits; (c) leave | (a) — CODEOWNERS is declared but unenforced today | Solo-maintainer workflow tolerance |
| **P5** | Restore production monitoring (F9) | (a) re-enable `monitor.yml`; (b) replace with an external monitor; (c) accept the gap | (a) or (b) | `SITE_URL` secret; whether the alerting path still exists |
| **P6** | Remove the vacuous `signed-tags` job (F5) | (a) remove from `ci.yml`; (b) leave | (a) | No external consumer of the `Verify signed tags` context |
| **P7** | Remove the inert `turbo.json` `lint` task (F14) | (a) remove; (b) leave | (a) | None |

---

## 6. Final architecture (stages actually used)

```text
working tree
  → [commit-msg]        commitlint (hook)
  → pre-commit          gate:precommit  (5 stages, ~7 s warm)   + docs:sync + git add -u
  → pre-push            gate:prepush    (26 stages, ~17 s warm)
  → push → remote CI    pnpm verify-governance (30 stages)  + 5 sibling jobs
  → merge gate          GitHub required checks (13 contexts) + strict/up-to-date
  → protected branch    main
  → post-merge          deploy.yml (workflow_run, CI-green on main)
  → scheduled           nightly.yml (daily 02:00 UTC)  — currently unverified (F7)
  → release             release.yml (signed tag + CI-green + SBOM + container + npm)
```

Local-only vs CI-only differences, documented:

| Only local | Only CI |
|---|---|
| Hook-triggered `docs:sync` staging (`git add -u`) | OS/arch matrix (single OS today: `ubuntu-latest`) |
| Node 24 here vs 22 pinned in CI (F15) | Docker-based `gitleaks` |
| — | `trivy` fs scan |
| — | Lighthouse (needs built preview + Chrome) |
| — | Visual-regression baselines (pixel rendering is runner-specific by design) |
| — | Changeset PR check, preview deploy, production deploy, release |

---

## 7. Exact checks per stage

```bash
# commit-msg (hook)
npx --no -- commitlint --edit "$1"

# pre-commit (hook)  → gate:precommit, then docs:sync + git add -u
pnpm gate:precommit
#   = pnpm lint:arch && pnpm lint:circular && pnpm lint:state && pnpm lint:dom && pnpm typecheck

# pre-push (hook)
pnpm gate:prepush
#   = gate:precommit && build && test && lint:size && validate:edu && lint:registry
#     && lint:docs && lint:doc-governance && lint:doc-coverage && lint:workflows
#     && audit:docs-sync && audit:deps && test:deps:drift && test:integrity:rule
#     && test:branch:rule && test:gate-integrity && test:gate-ladder
#     && test:script-targets && test:script-targets:prove          # ← added by 0fb9538
#     && test:work-record && test:coverage:ratchet && test:mutation:validate

# local-full / CI (canonical)
pnpm verify-governance
#   = gate:prepush && test:coverage && test:a11y && test:mutation && test:flakes:prove

# inspect the ladder
pnpm ci:local:list        # ← repaired by 0fb9538
pnpm ci:local             # alias → verify-governance
pnpm ci:local:fast        # alias → gate:prepush
```

CI jobs beyond the canonical command: `docs-sync` (Documentation freshness),
`changeset-check`, `commitlint`, `signed-tags` (vacuous, F5), `audit`, `workflows`,
`lighthouse` (all in `ci.yml`); `gitleaks`, `audit`, `trivy-source` (`security.yml`);
`e2e-core` ×2, `e2e-visual` (`smoke.yml`).

---

## 8. Canonical verification contract

| Property | Intent | Local target | CI job(s) | Gate |
|---|---|---|---|---|
| LINT_ARCH | no layer violations between packages | `pnpm lint:arch` | Verify governance | B |
| LINT_CIRCULAR | no import cycles | `pnpm lint:circular` | Verify governance | B |
| LINT_ESLINT | state/dom lint rules hold | `pnpm lint:state`, `pnpm lint:dom` | Verify governance | B |
| TYPE | strict TS compiles | `pnpm typecheck` | Verify governance | B |
| UNIT_TEST | all unit tests pass | `pnpm test` | Verify governance | B |
| COVERAGE | per-package floors met | `pnpm test:coverage` | Verify governance | B |
| BUILD | every package builds | `pnpm build` | Verify governance | B |
| E2E_CORE + A11Y | user paths and a11y hold | `pnpm test:a11y` | Verify governance, E2E core ×2 | B |
| **SCRIPT_TARGETS** | every declared script target exists | `pnpm test:script-targets` | Verify governance | B |
| GENERATED_FILES | generated docs committed in sync | `pnpm audit:docs-sync` | Documentation freshness | B |
| GOVERNANCE | 10 structural guards hold | `pnpm test:*:rule` family | Verify governance | B |
| DEP_AUDIT | no unallowlisted high/critical | `pnpm audit:deps` | Verify governance, Dependency audit ×2 | B |
| COMMIT_MSG | conventional commits | commit-msg hook | Commit messages | B |
| E2E_VISUAL | pixel baselines hold | *(CI-only by design)* | E2E visual regression | B |
| SECRET_SCAN | no committed secrets | *(CI-only)* | Secret scanning (gitleaks) | B |
| VULN_SCAN | no CRITICAL/HIGH in tree/image | *(CI-only)* | Trivy source scan, release container | B |
| LIGHTHOUSE | perf/a11y budgets | *(CI-only)* | Lighthouse CI | B |
| CHANGESET | package changes declare release intent | *(CI-only)* | Changeset requirement check | B |

**Contract location:** there is no standalone `docs/verification.md`. The contract is
distributed across `AGENTS.md` ("Setup", "Non-Negotiable Rules"), `docs/RULES.md`
("Enforcement Mechanisms", lines ~865–890), and `docs/guides/task-playbooks/verify.md`.
**That is a documentation gap worth closing** (see §12 handoff) — the drift mechanism
below compensates, but a single table would be cheaper to keep true.

**Drift mechanism: Level 3 (command-equivalent), drift-resistant by construction.**
CI invokes the *same* canonical command (`pnpm verify-governance`) that a developer runs,
and the tiers nest by construction (`gate:prepush` literally calls `gate:precommit`;
`verify-governance` literally calls `gate:prepush`). Three guards defend that property:
`test:gate-ladder` (nesting + hook/CI wiring), `test:gate-integrity` (mandatory stages
cannot be removed), `test:script-targets` (every declared target exists). No separate
contract file needs to be kept in sync.

---

## 9. Equivalence report

**Core set** = properties that block merge in remote CI **and** can run locally:
LINT_*, TYPE, UNIT_TEST, COVERAGE, BUILD, E2E_CORE+A11Y, SCRIPT_TARGETS,
GENERATED_FILES, GOVERNANCE, DEP_AUDIT, COMMIT_MSG.

| Property | Local target | CI job(s) | Relationship | Core? | Mutation-tested locally? | In CI? |
|---|---|---|---|---|---|---|
| LINT_ARCH / CIRCULAR / ESLINT | `pnpm lint:arch` etc. | Verify governance | **same target** | yes | n/a (static) | yes |
| TYPE | `pnpm typecheck` | Verify governance | **same target** | yes | n/a (static) | yes |
| UNIT_TEST | `pnpm test` | Verify governance | **same target** | yes | yes (`test:mutation`, 52/52) | yes |
| COVERAGE | `pnpm test:coverage` | Verify governance | **same target** | yes | via mutation | yes |
| BUILD | `pnpm build` | Verify governance | **same target** | yes | n/a | yes |
| E2E_CORE + A11Y | `pnpm test:a11y` | Verify governance + E2E core ×2 | **same target** (duplicated, F4) | yes | not mutation-tested | yes |
| **SCRIPT_TARGETS** | `pnpm test:script-targets` | Verify governance | **same target** | yes | **yes — controlled failure A** | yes (not yet executed remotely) |
| GENERATED_FILES | `pnpm audit:docs-sync` | Documentation freshness | **same target** | yes | not mutation-tested | yes |
| GOVERNANCE | `pnpm test:gate-ladder` etc. | Verify governance | **same target** | yes | **yes — controlled failure B** | yes |
| DEP_AUDIT | `pnpm audit:deps` | Verify governance + Dependency audit ×2 | **same target** | yes | not mutation-testable (network) | yes |
| COMMIT_MSG | commit-msg hook | Commit messages | equivalent (same tool/config) | yes | no | yes |
| E2E_VISUAL | — | E2E visual regression | **CI-only** (runner-specific pixels) | no | — | yes |
| SECRET_SCAN | — | gitleaks | **CI-only** (Docker) | no | — | yes |
| VULN_SCAN | — | trivy | **CI-only** | no | — | yes |
| LIGHTHOUSE | — | Lighthouse CI | **CI-only** (preview + Chrome) | no | — | yes |
| CHANGESET | — | Changeset requirement check | **CI-only** (PR metadata) | no | — | yes |

**Overall level: Level 3 — command-equivalent.** The core set is produced by one command
(`pnpm verify-governance`), which CI invokes verbatim; every core property is addressable
as a sub-target for local reproduction. Evidence basis: the same SHA `97e6cf5` is
**green locally** (gate:prepush 0, coverage 24/24, a11y 32/32, mutation 52/52) and
**green remotely** (CI / Security Scan / E2E Smoke all `success` for `97e6cf5`,
2026-10-02T17:55Z), plus two controlled-failure observations showing the *new* property
fails when violated.

**Reproduction path for any CI failure:** *failed job → property in §8 → local target →
`pnpm <target>`*. CI-only properties are enumerated above with the reason they cannot be
reproduced locally.

---

## 10. Protection ledger

### 10a. Preserved (unchanged)
All 13 required checks; the three-tier nesting; the hook wiring; `strict: true`,
`enforce_admins: true`, `allow_force_pushes: false`, `required_conversation_resolution: true`;
the mutation/flake/coverage-ratchet guards; `release.yml`'s signed-tag + CI-green gate;
`deploy.yml`'s main-only `workflow_run` condition.

### 10b. Changed

| Change | Prev → New | Reason | Integrity axis | Feedback axis | Validation |
|---|---|---|---|---|---|
| `ci:local:list` (`0fb9538`) | `node scripts/ci-local.mjs --list` (broken) → `node scripts/checks/gate-stages.mjs --list` | declared entry point could not execute (F1) | **improved** — a broken command became a working one; no gate affected | none (not in any tier) | `pnpm ci:local:list` → exit 0, prints 5 → 26 → 30 stages |
| `lint` (`c5959c6`) | `turbo lint` (0 tasks, exit 0) → the four real lint stages | documented mandatory command verified nothing (F2) | **improved** — a vacuous pass became a real check | +7 s when a developer runs `pnpm lint` voluntarily; **not in any gate** | `pnpm lint` → exit 0; 665 deps cruised, 208 files, no violations |
| `gate:prepush` (`0fb9538`) | 24 stages → 26 | wire in the new guard + its proof | **improved** — new detection | +~1 s on push, +~1 s in CI | `pnpm gate:prepush` → exit 0, 17 s |
| `prove-gate-integrity` (`0fb9538`) | 16 → 18 mandatory stages | protect the new guard from silent removal | **improved** | none | controlled failure B |

### 10c. Removed
> **No existing protection was removed because equivalent protection could not be
> established.** Nothing was deleted, disabled, weakened, renamed, or made optional.

### 10d. New

| New | Failure mode caught | Enforcement | Promotion criteria |
|---|---|---|---|
| `test:script-targets` | a `package.json` script or active workflow invoking a file that does not exist | **blocking** (in `gate:prepush` ⇒ also in `verify-governance`) — passes on the current tree, so it blocks nothing that was previously green | already blocking; no baseline needed |
| `test:script-targets:prove` | the guard itself silently becoming non-falsifiable | **blocking** | already blocking |

Neither is a weakening of anything. Neither changes any workflow file, trigger, permission,
or required-check name.

### 10e. Deferred removals
| Candidate | Evidence still needed |
|---|---|
| `ci.yml` `signed-tags` job (F5) | confirmation that no external consumer depends on the `Verify signed tags` context |
| `turbo.json` `lint` task (F14) | none — inert |
| the 3 orphan `.py` verifiers (F11) | owner decision: wire in or retire |
| `audit-deps` duplicate jobs (F3) | branch-protection edit (Class 2, P1) |
| `smoke.yml` / `test:a11y` overlap (F4) | branch-protection edit (Class 2, P2) |

---

## 11. Duplication ledger

Every property running at more than one stage, with its class:

| Property | Stages | Class | Reason |
|---|---|---|---|
| LINT_ARCH, LINT_CIRCULAR, LINT_ESLINT, TYPE | pre-commit + pre-push + CI | **feedback optimization** | same boundary; earlier, cheaper signal (pre-commit ~7 s vs CI minutes) |
| UNIT_TEST, BUILD | pre-push + CI | **defense-in-depth** | different boundary (developer machine vs clean runner) and earlier signal |
| COVERAGE, E2E_CORE+A11Y, GOVERNANCE, SCRIPT_TARGETS | pre-push + CI | **defense-in-depth** | same |
| DEP_AUDIT | pre-push + CI (`verify`) | **defense-in-depth** | same |
| **DEP_AUDIT** | **`ci.yml` `audit` + `security.yml` `audit`** | **unnecessary duplication** | same boundary, same inputs, same tool config, no latency benefit → F3 |
| **E2E_CORE + A11Y** | **`verify` (unsharded) + `smoke.yml` shards** | **unnecessary duplication** | identical selection; the sharded run is strictly the faster signal → F4 |
| GENERATED_FILES | pre-commit hook + `audit:docs-sync` + `docs-sync` job | **environment necessity** | the hook commits the sync; CI must independently prove the committed tree is in sync |
| COMMIT_MSG | commit-msg hook + CI | **defense-in-depth** | a hook is bypassable (`--no-verify`); CI is not |
| SECRET_SCAN, VULN_SCAN, E2E_VISUAL, LIGHTHOUSE | CI + scheduled (`nightly`) | **feedback optimization** | scheduled re-runs catch environment/dependency drift; note nightly Lighthouse adds nothing over the per-push run (low priority) |

---

## 12. Validation results on the final SHA

Final SHA: **`c5959c6`** (tree clean).

### Static
| Check | Result |
|---|---|
| `actionlint` over 8 workflows (`pnpm lint:workflows`) | **pass** (shellcheck integration ON) |
| All referenced scripts/targets exist | **pass** — `pnpm test:script-targets`, 41 targets scanned |
| `prove-gate-ladder` | **pass** — `5 → 26 → 30`, strictly nested, hooks and CI wired |
| `prove-gate-integrity` | **pass** — 18 mandatory stages present |
| `prove-work-record` | **pass** — 4 rows, all columns well-formed |

### Dynamic
| Check | Result |
|---|---|
| `pnpm gate:precommit` | **pass**, exit 0, 7 s (warm) |
| `pnpm gate:prepush` | **pass**, exit 0, 17 s (warm) |
| `pnpm test:script-targets:prove` | **pass** — 3/3 scenarios |
| `pnpm ci:local:list` | **pass** — prints the ladder |
| `pnpm lint` | **pass**, exit 0, 7 s |
| `pnpm verify-governance` | **exit 1** — all stages green except `test:flakes:prove`, blocked by the sandbox bulk-delete guard (environment, not a defect) |

### Controlled failure (throwaway worktree `git worktree add --detach /tmp/vf-st HEAD`; removed after)

| # | Mutation | Stage under test | Observed | Expected |
|---|---|---|---|---|
| A | added `"planted:broken": "node scripts/__vf__/nope.mjs"` to `package.json` | `test:script-targets` | **exit 1**, reported `scripts/__vf__/nope.mjs ← package.json → planted:broken` | caught |
| B | removed `test:script-targets` and `test:script-targets:prove` from `gate:prepush` | `test:gate-integrity` | **exit 1**, reported `mandatory stage MISSING: test:script-targets` and `…:prove` | caught |

Post-worktree: `git worktree remove --force` succeeded, `git worktree list` shows only the
main tree, `git status` clean. No injected failure was committed or pushed.

Per-property mutation coverage: **SCRIPT_TARGETS — tested (A); GOVERNANCE guard set —
tested (B); UNIT_TEST — tested by the repo's own `test:mutation` (52/52)**. All other
properties: **not mutation-tested in this session** — reasons: `DEP_AUDIT` (network /
time-varying advisory DB), `SECRET_SCAN` / `VULN_SCAN` (Docker, CI-only), `E2E_VISUAL`
(runner-specific pixels), `LIGHTHOUSE` (CI-only), `COMMIT_MSG` / `CHANGESET` (hook and PR
metadata). Partial coverage is reported as partial; nothing is inferred.

### Remote
Baseline: `gh run list` for base SHA `97e6cf5` — CI `success`, Security Scan `success`,
E2E Smoke Tests `success` (2026-10-02T17:55Z).

**PR #88 — 15/15 checks `success` on both SHA `3f542a3` (2026-10-02T21:17Z) and the
docs-only HEAD `3a37fba` (2026-10-02T21:24Z):**

| Workflow | Run | Result |
|---|---|---|
| CI | `37065293214` | `success` — incl. **Verify governance** (5 m 11 s) and **Documentation freshness** |
| E2E Smoke Tests | `37065293091` | `success` — E2E core shard 1/2, shard 2/2, visual regression |
| Security Scan | `37065293128` | `success` — gitleaks, Trivy, dep audit (security) |
| PR Preview URL | `37065293109` | `success` — Post preview URL |

The two new stages were **observed running and passing** inside "Verify governance"
(`test:script-targets` → *every referenced script target exists*;
`test:script-targets:prove` → *all 3 scenario(s) passed*), and `prove-gate-integrity`
confirmed both are registered as mandatory stages. `test:flakes:prove` also passed on the
runner. This is rung **4** for the new stages.

---

## 13. Files changed

Branch `ci/verification-architecture`, base `97e6cf5`:

| Commit | Message | Files |
|---|---|---|
| `a57c9fb` | `docs(docs): add consolidated verification-architecture audit prompt` | **+** `.agent/audit/verification-architecture/PROMPT.md`; **M** `docs/WORK-IN-PROGRESS.md`, `tree.txt` |
| `0fb9538` | `ci(ci): repair ci:local:list and guard script targets` | **+** `scripts/checks/verify-script-targets.mjs`, `scripts/checks/prove-script-targets.mjs`; **M** `scripts/checks/gate-stages.mjs`, `scripts/checks/prove-gate-integrity.mjs`, `package.json`, `tree.txt` |
| `c5959c6` | `fix(ci): make \`pnpm lint\` run the linting it advertises` | **M** `package.json` |
| `60c1276` | `docs(docs): add verification-architecture audit report` | **+** `.agent/audit/verification-architecture/REPORT.md`; **M** `docs/WORK-IN-PROGRESS.md`, `tree.txt` |
| `45b5f79` | `docs(docs): add actionable appendix for the pending Class-2 decisions` | **M** `.agent/audit/verification-architecture/REPORT.md` |
| `85a5f78` | `fix(ci): keep local agent data out of the generated tree` | **M** `.gitignore`, `tree.txt` |
| `3f542a3` | `docs(docs): record PR #88 and the pushed branch in the audit report` | **M** `.agent/audit/verification-architecture/REPORT.md` |

**Deleted: none. Application code touched: none.** No lockfile, dependency, toolchain, or
workflow-file change. Diff audited for secrets, debug code, temp files, and unrelated
formatting — none found.

---

## 14. Known limitations and first-run handoff checklist

### Limitations
1. ~~`test:flakes:prove` could not execute here (sandbox bulk-delete guard).~~ **RESOLVED by
   PR #88** — it ran and passed on the CI runner (see §0). It remains unrunnable in *this*
   sandbox only.
2. ~~The two new stages have not run on a GitHub runner → rung 2.~~ **RESOLVED by PR #88** —
   both observed running and passing inside "Verify governance" → rung **4**.
3. Branch protection was read via `gh api` (rung: authoritative) but **not modified**.
4. Cloudflare Pages dashboard settings, org-level Actions policy, and the enabled/disabled
   state of `nightly`/`preview` are not visible from the repo → **not audited**.
5. `nightly.yml`'s current health is unknown (last run 2026-09-20, failed).
6. Local node is 24; CI pins 22 → a local pass is not a byte-for-byte CI prediction.
   (Moot for this change: the CI run above is the authoritative pass.)
7. `deploy` / `release` / `preview` were not exercised (would require authorization and
   would write to production or publish artifacts).

### First-run handoff checklist — **executed; PR #88 all green**
1. ✅ **Verify governance** confirmed `test:script-targets` and `test:script-targets:prove`
   present and passing (5 m 11 s, no new failure).
2. ✅ No other required context changed name or conclusion — all 15 checks `success`.
3. N/A — the guard did not fail on the runner.
4. Rollback remains available: `git revert 85a5f78 c5959c6 0fb9538` (each commit is
   independently revertible), or drop the branch.
5. Watch the next **nightly** run (02:00 UTC) — it is the first since the workflow set was
   restored, and its audit job is expected to disagree with the gate (F7).

### Push and PR — **performed**

```bash
git push -u origin ci/verification-architecture   # pre-push hook: gate:prepush green
gh pr create --base main --head ci/verification-architecture \
  --title "ci: repair ci:local:list, guard script targets, make pnpm lint real" \
  --body-file /tmp/pr-body.md
```

Result: PR **#88** → https://github.com/STEMORG2026/LearningHub/pull/88

**Authority note.** `AGENTS.md` mandates "push to a branch" and expects a PR, and the
executed prompt requires **explicit authorization for any push** and for network side
effects. The owner authorized the push and PR creation. **The PR was not merged** —
`AGENTS.md`: only the owner merges; `gh pr merge` is never run by an agent.

---

## 15. Performance

| Stage | Before | After | Δ |
|---|---|---|---|
| `pnpm gate:precommit` | 7 s warm / 5 stages | 7 s warm / 5 stages | 0 |
| `pnpm gate:prepush` | 17 s warm / 24 stages | 17 s warm / 26 stages | +~1 s |
| `pnpm verify-governance` | 129 s / 28 stages | ~131 s / 30 stages | +~2 s |
| `pnpm lint` | 0.02 s, **0 tasks** | 7 s, 665 deps + 208 files + 2 eslint runs | real work (was vacuous) |
| `pnpm ci:local:list` | crash (`MODULE_NOT_FOUND`) | 0.2 s | repaired |

The added cost is ~2 s per push and per CI run, against two newly detected defect classes
(dangling declared entry points; vacuous lint). No gate was slowed or weakened.

---

## Out-of-scope observations (for the owner; not acted on)

1. `lint:registry` reports 3 registry references to non-existent e2e spec files.
2. madge reports 2 file-resolution warnings (pre-existing, exit 0).
3. Production uptime monitoring is disabled (`.github/workflows-disabled/monitor.yml`).
4. `nightly.yml` was red on its last observed run and is expected to disagree with the
   PR gate because it uses `pnpm audit` without the gate's allowlist.
5. `playwright.config.ts` sets `retries: 1` in CI, which can mask E2E flakes.
6. `.github/workflows-disabled/` is not covered by `lint:workflows`.
7. `docs/RULES.md` and `docs/CONSTITUTION.md` reference verification commands; there is no
   single verification-contract table (see §8). Closing that would make drift detection
   cheaper to reason about, though the Level-3 mechanism already makes drift unlikely.

---

## Appendix — applying the pending Class-2 decisions

**Nothing below has been applied.** Each is an owner decision; the commands are given so
the change is one copy-paste rather than a re-derivation. Ordered by recommendation.

> Run the branch-protection commands **last**, and only after the corresponding file
> change has merged — removing a required context before the job is gone leaves the
> requirement satisfied by a check that no longer reports.

**P7 — drop the inert turbo `lint` task** (no protection involved)
```bash
node -e 'const f="turbo.json",t=require("./"+f);delete t.tasks.lint;
require("fs").writeFileSync(f,JSON.stringify(t,null,2)+"\n")'
pnpm test:gate-ladder && pnpm verify-governance
```

**P3 — remove unused `issues: write` from `security.yml`**
```yaml
# .github/workflows/security.yml
permissions:
  contents: read
  # issues: write   ← unused: no job writes issues
```
Then `pnpm lint:workflows`.

**P6 — remove the vacuous `signed-tags` job from `ci.yml`**
Delete the `signed-tags:` job (its trigger can never be a tag — `ci.yml` listens on
`pull_request` and `push: branches [main]`). `release.yml` already performs the real
check. Then `pnpm lint:workflows`. It is **not** a required context, so no API call.

**P5 — restore production uptime monitoring**
```bash
git mv .github/workflows-disabled/monitor.yml .github/workflows/monitor.yml
pnpm lint:workflows          # it was never covered while parked
gh secret list | grep -i site_url   # confirm the secret the workflow reads
```

**P2 — stop running the non-visual Playwright suite twice** (keeps required names intact)
```bash
# package.json
#   "verify-governance": drop the "pnpm test:a11y &&" term
#   "test:a11y": rename to "test:e2e" (it runs the whole non-visual suite, not just a11y)
pnpm test:gate-ladder && pnpm verify-governance
```
`E2E core (shard 1/2)`, `E2E core (shard 2/2)` and `E2E visual regression` remain the
required E2E contexts; only the redundant unsharded run is dropped.

**P1 — collapse the 3× dependency audit to one** (requires a branch-protection edit)
```bash
# 1. remove the `audit` job from .github/workflows/ci.yml (the `verify` job still runs
#    audit:deps via verify-governance, and security.yml groups the security scans)
# 2. only AFTER that merge, drop the now-dangling required context:
gh api -X DELETE \
  repos/STEMORG2026/LearningHub/branches/main/protection/required_status_checks/contexts \
  -f 'contexts[]=Dependency audit'
```

**P4 — enforce review / CODEOWNERS**
```bash
gh api -X PATCH \
  repos/STEMORG2026/LearningHub/branches/main/protection/required_pull_request_reviews \
  -F required_approving_review_count=1 \
  -F require_code_owner_reviews=true \
  -F dismiss_stale_reviews=true
```
Note: `enforce_admins: true` is already set, so this applies to admins too. If the
maintainer is currently solo, pair this with a written exception rather than leaving
`CODEOWNERS` advisory-by-accident.

**Verification after any of the above**
```bash
gh api repos/STEMORG2026/LearningHub/branches/main/protection \
  --jq '.required_status_checks.contexts'
pnpm ci:local:list          # ladder composition, from the single source of truth
pnpm verify-governance      # local full tier
```
Every one of these changes the **set** of gates, so each needs its own protection-ledger
entry (§10b) in the PR that lands it — the same discipline this audit applied to its own
three changes.
