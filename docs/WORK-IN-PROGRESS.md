---
title: "Work In Progress"
status: CANONICAL
owner: Architecture / Governance
last_updated: 2026-09-30
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
| `docs/mandatory-branching-and-work-record` | review | main | agent | Make branching mandatory for all new work and require every branch to be recorded in `main` via this file; add sub-branch policy and a falsifiable work-record guard | `docs/RULES.md`, `AGENTS.md`, `docs/WORK-IN-PROGRESS.md`, `package.json`, `scripts/checks` | 2026-09-30 |

## Recently Merged

Rows here are cleared 30 days after merge; git history is the permanent record.

| Branch | Status | Parent | Owner | Intent | Touches | Last updated |
|---|---|---|---|---|---|---|
| `chore/remove-redundant-overrides` | merged | main | agent | Remove the 3 bare pnpm overrides so manifests match what installs; add the drift guard; repair coverage by adding real tests (PR #73) | `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `packages/admin`, `packages/tracer`, `packages/lesson-renderer`, `packages/quiz-engine`, `packages/audio-synth`, `packages/progress`, `apps/shell`, `scripts/checks`, `docs/adr` | 2026-09-30 |

## Abandoned

Rows record work that was started and deliberately dropped, with the reason.

| Branch | Status | Parent | Owner | Intent | Touches | Last updated |
|---|---|---|---|---|---|---|
| — | — | — | — | None. | — | — |
