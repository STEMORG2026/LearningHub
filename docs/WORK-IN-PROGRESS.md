---
title: "Work In Progress"
status: CANONICAL
owner: Architecture / Governance
last_updated: 2026-10-21
canonical: true
---

# Work In Progress

**Version:** 3.0.0
**Status:** Active (Canonical)

**Purpose:** `main` must always be able to answer *what work is in flight, and why?* —
even when that work lives on a branch and has not merged.

**Policy:** see `docs/RULES.md` → *Git Workflow — Branching Is Mandatory for All New Work*.

## How to use this file

1. **Add a row when the branch is created** — not when it finishes. A branch that
   `main` cannot see is the exact failure this file exists to prevent.
2. **Update the row when status changes**, and re-stamp `Last updated`.
3. **Flush on merge** — set status to `merged`, then clear rows older than 30 days.
   `main`'s git history becomes the durable record at that point.
4. **Never leave a stale row.** A row claiming work is happening when it has
   stopped is worse than no row.

`pnpm test:work-record` validates every row against the schema below.

## Schema

| Column | Required | Meaning |
|---|---|---|
| Branch | yes | Exact branch name, e.g. `feat/lesson-progress` |
| Status | yes | One of `in-progress`, `blocked`, `review`, `merged`, `abandoned` |
| Parent | yes | Parent branch, or `main` for a top-level branch |
| Owner | yes | Who or which agent carries it |
| Intent | yes | One sentence: what it changes and why |
| Touches | yes | Packages/apps/doc areas it will modify |
| Last updated | yes | `YYYY-MM-DD` |

## Active Work

| Branch | Status | Parent | Owner | Intent | Touches | Last updated |
|---|---|---|---|---|---|---|
| `ci/preview-dependabot-secrets` | in-progress | main | agent | Skip the preview deploy step for dependabot-authored PRs (GitHub does not expose repo secrets to those pull_request workflows, so wrangler fails with a missing CLOUDFLARE_API_TOKEN on every dependabot PR); refresh the stale "no preview" comment text (open PR #115) | `.github/workflows/preview.yml`, `docs/WORK-IN-PROGRESS.md` | 2026-10-21 |

## Recently Merged

Rows here are cleared 30 days after merge; git history is the permanent record.

| Branch | Status | Parent | Owner | Intent | Touches | Last updated |
|---|---|---|---|---|---|---|
| `fix/shell-localstorage-vitest5` | merged | main | agent | Make `did-you-know.test.ts` compatible with vitest 5 / newer jsdom, where `localStorage` is a getter-only property and plain assignment throws — the failure that was blocking the testing-group bump (PR #105) in Verify governance (PR #112) | `apps/shell/tests/did-you-know.test.ts`, `docs/WORK-IN-PROGRESS.md` | 2026-10-21 |
| `ci/dependabot-commit-suffix` | merged | main | agent | Remove `include: "scope"` from dependabot.yml — the option that appends the `(deps-dev)` suffix after the configured prefix (observed producing `chore(deps-dev)(deps-dev):` after PR #108), so rebased dependabot PRs finally pass the Commit messages gate (PR #110) | `.github/dependabot.yml`, `docs/WORK-IN-PROGRESS.md` | 2026-10-21 |
| `test/visual-baselines` | merged | main | github-actions + agent | Refresh the home-page visual baseline in the CI environment after the ubuntu-latest fleet rolled 24.04 → 26.04; the regenerated PNG differs by 6 bytes / 76 pixels, and every PR opened after the roll failed E2E visual regression (PR #111) | `e2e/visual-regression.spec.ts-snapshots/home-chromium-linux.png` | 2026-10-21 |
| `ci/dependabot-commit-message` | merged | main | agent | Add `deps-dev` to the commitlint scope-enum and set `prefix-development: "chore(deps-dev)"` in dependabot.yml (PR #108) | `.commitlintrc.json`, `.github/dependabot.yml`, `docs/WORK-IN-PROGRESS.md` | 2026-10-21 |
| `ci/mandatory-stages` | merged | main | agent | Register the ten unprotected gate stages as mandatory required status checks so a stage cannot be deleted silently; keep local agent data out of the generated tree (PR #89) | `.github/workflows/ci.yml`, `scripts/checks/prove-gate-integrity.mjs`, `.gitignore`, `tree.txt` | 2026-10-21 |
| `fix/deps-advisory-floors` | merged | main | agent | Land advisory-scoped security floors for the seven unpatched high/critical dev-only advisories (source-map-js, proxy-addr, compression, sharp, shell-quote, vite, launch-editor) plus an `auditConfig.ignoreGhsas` entry for the two documented-unfixable extract-zip advisories, unblocking the pre-push gate, nightly audit, and security scan (PR #106) | `pnpm-workspace.yaml`, `apps/shell/package.json`, `pnpm-lock.yaml`, `docs/WORK-IN-PROGRESS.md`, `docs/DEVLOG.md` | 2026-10-21 |
| `ci/verification-architecture` | merged | main | agent | Audit the verification architecture (local gate ladder ↔ remote CI ↔ merge gate), consolidate the three supplied audit prompts into one, and apply additive, revertible Class-1 fixes: repair the dangling `ci:local:list` script, add a falsifiable guard against package.json/workflow scripts referencing non-existent files, and make the governance-documented `pnpm lint` actually lint instead of executing zero tasks (PR #88) | `package.json`, `scripts/checks/`, `.agent/audit/verification-architecture/`, `docs/WORK-IN-PROGRESS.md` | 2026-10-21 |
| `docs/audit/phase5-completion` | merged | main | agent | Execute the audit plan's remaining unblocked tickets: T8 (`.phase.json` phases 9–11 → completed), T11 (README tree + registry labels), T9 (`.env.example` ↔ source parity + falsifiable guard), and record the Phase 0→4 reconciliation (PR #79) | `.phase.json`, `README.md`, `.env.example`, `apps/shell/src/vite-env.d.ts`, `apps/shell/tests/env-contract.test.ts`, `docs/ROADMAP.md`, `docs/component-registry/TESTING.md`, `.agent/audit/00_AUDIT_STATE.md` | 2026-10-21 |
| `docs/mandatory-branching-and-work-record` | merged | main | agent | Make branching mandatory for all new work and require every branch to be recorded in `main` via this file; add sub-branch policy and a falsifiable work-record guard (PR #74) | `docs/RULES.md`, `AGENTS.md`, `docs/WORK-IN-PROGRESS.md`, `package.json`, `scripts/checks` | 2026-10-02 |
| `chore/remove-redundant-overrides` | merged | main | agent | Remove the 3 bare pnpm overrides so manifests match what installs; add the drift guard; repair coverage by adding real tests (PR #73) | `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `packages/admin`, `packages/tracer`, `packages/lesson-renderer`, `packages/quiz-engine`, `packages/audio-synth`, `packages/progress`, `apps/shell`, `scripts/checks`, `docs/adr` | 2026-09-30 |

## Abandoned

Rows record work that was started and deliberately dropped, with the reason.

| Branch | Status | Parent | Owner | Intent | Touches | Last updated |
|---|---|---|---|---|---|---|
| — | — | — | — | None. | — | — |
