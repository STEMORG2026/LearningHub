---
title: "Unresolved Findings — Evidence Resolution"
status: ACTIVE
date: 2026-10-03
canonical: false
branch: ci/verification-architecture
purpose: >-
  Resolve the findings REPORT.md left as "unknown" or "unverified" (F7, F9, F11, F12)
  using read-only evidence. Nothing applied.
---

# Unresolved Findings — Evidence Resolution

`REPORT.md` recorded four findings as *unknown* or *unverified*. This document resolves them
with read-only evidence. It also records **one new systemic finding (S1)** that the original
audit missed and that changes the interpretation of two others.

Companion: [`PENDING-DECISIONS-EVIDENCE.md`](./PENDING-DECISIONS-EVIDENCE.md) (P1–P7).

**Read-only.** No workflow, file, setting, or label was modified.

---

## S1 — NEW: all scheduled automation stopped on 2026-09-20 (billing), and has not resumed

This is the most consequential finding in this document, and it was not in the original report.

```
$ gh run list --event schedule --limit 30
total: 30
  2026-09-20T13:47:00Z  failure  Auto-Resolve Jules PR Conflicts (CLI Version)
  2026-09-20T07:27:21Z  failure  Nightly
  2026-09-19T17:25:39Z  failure  Uptime Monitor
  ... (27 more, every one `failure`)
```

**Every one of the 30 most recent scheduled runs failed**, across three different workflows, and
**no scheduled run of any kind has fired since 2026-09-20T13:47Z** — roughly two weeks.

The Nightly run's annotation states the cause directly:

> *"The job was not started because recent account payments have failed or your spending limit
> needs to be increased. Please check the 'Billing & plans' section in your settings"*

— and the job metrics agree: all three Nightly jobs recorded **0 steps** and the whole run lasted
**40 s**. They did not fail a test; they never started.

**What is verified vs inferred:**

| Claim | Status |
|---|---|
| All 30 recent scheduled runs failed; none since 2026-09-20 | **Verified** |
| Nightly's failure cause was billing / spending limit | **Verified** (annotation) |
| The other two workflows failed for the same reason | **Inferred** — consistent (same window, same 0-step pattern), but their annotations have expired and could not be read |
| The workflows themselves are disabled | **Disproved** — `Nightly` reports `state=active` |

**Consequence.** The repository currently has **no working scheduled automation at all**. This is
an account-level condition, not a repo defect: it cannot be fixed by editing a workflow, and it
silently neutralises any cron-based control. Fix it in GitHub **Settings → Billing & plans**, then
confirm by triggering `Nightly` manually (it has `workflow_dispatch`).

---

## F7 — Nightly: the stated cause was wrong

**Original claim:** *"nightly is structurally expected to stay red on advisories the gate has
accepted … A permanently-red scheduled job trains people to ignore red."*

**Correction.** The `pnpm audit` allowlist disagreement was **never exercised** — the audit job
never ran. The red runs were a **billing failure** (S1). The allowlist hypothesis remains
**unverified**, not confirmed.

**What still holds:** `nightly.yml`'s audit job runs `pnpm audit --audit-level high` while the PR
gate runs `scripts/checks/audit-deps.cjs` with a documented allowlist (`GHSA-jmr9-qjv8-65gv`,
`GHSA-7pqw-9j4j-h8q3`). `pnpm audit` does not honour that allowlist, so **if and when nightly
runs, it is still expected to go red** on accepted advisories. That is a real latent defect — but
it is a prediction, not an observation.

**Recommended order:**
1. Resolve billing (S1).
2. Trigger `Nightly` manually via `workflow_dispatch` and observe.
3. Only then decide whether to align nightly's audit with the gate's allowlist.

Also note the Nightly job names changed since the last run: the file now declares
`Dependency audit (nightly)`, whereas the failed run reported `Dependency audit`. Any required
contexts keyed to the old name would need re-checking.

---

## F9 — Production monitoring: it stopped before it was parked

**Original claim:** monitoring is "off" because `monitor.yml` is parked in
`.github/workflows-disabled/`.

**Refinement.** `Uptime Monitor` appears in the **scheduled-run history** — it was live and firing
every 5 minutes during tuition hours, and **every observed run failed**. It was subsequently
parked. So monitoring did not simply get switched off; it **broke first (S1) and was then parked**,
which means the parked file may be blameless.

This directly affects **P5**: re-enabling `monitor.yml` will achieve nothing until billing is
resolved. See [`PENDING-DECISIONS-EVIDENCE.md`](./PENDING-DECISIONS-EVIDENCE.md) §P5 for the
separate `downtime`-label prerequisite.

The same applies to `jules-conflict-resolver.yml` (also parked, also failing).

---

## F11 — Dead verification scripts: purposes identified, one is genuinely useful

**Original claim:** three Python scripts, *"purpose unknown"*, preserved by default.

All three were read and, where possible, executed. They are **not** generic dead code — they are
ecosystem-aware tooling, and one of them works and enforces a documented rule.

| Script | Purpose (now known) | Status | Verdict |
|---|---|---|---|
| `scripts/verify.py` | Runs `cd LearningHub && pnpm typecheck && pnpm verify-governance` from the repo's **parent** dir. A cross-repo entry point for the STEMXIS layout (`/home/sajan/Projects/STEMMA` is a real sibling) | Redundant — `pnpm verify-governance` already includes typecheck via `gate:precommit` | **Retire** |
| `scripts/verify_git_safety.py` | Blocks destructive git ops: `git reset --hard`, `git clean -fd`, `git clean -fdx`, `git push --force`, `git push -f` | **Works.** Verified: `--check "git reset --hard"` → exit 1 + `FORBIDDEN: 'git reset --hard' found…`; `--check "git status"` → exit 0; bare run → exit 0 | **Wire in** |
| `scripts/verify_export_contract.py` | SHA-256 of `../STEMMA/exports/knowledge.json` vs a pinned digest in `authority/exports-manifest.yaml` — the STEMMA export-drift contract | Export exists (50 KB, 2026-10-02); PyYAML 6.0.3 present; script runs → **exit 1**: `manifest not found at authority/exports-manifest.yaml` | **Needs one-time `--record`** |

**The notable one: `verify_git_safety.py`.** It is the coded form of rules that `AGENTS.md` states
in prose (never `git reset --hard`, never force-push `main`) — and **nothing ever calls it**. A
safety control that exists but has no enforcement path is the same failure class as F2: a
protection that verifies nothing because nothing invokes it. It is currently inert *by omission*,
not by defect.

**`verify_export_contract.py`** can only work after a one-time `python3
scripts/verify_export_contract.py --record`, which **writes** `authority/exports-manifest.yaml`
(a directory that does not yet exist) and pins the current digest. That is an additive in-repo
change, but it pins an artifact owned by another repository, so it stays an owner decision.

---

## F12 — Required-check name stability: both hazards confirmed

**1. Matrix-derived required names.** `smoke.yml` declares:

```yaml
name: E2E core (shard ${{ matrix.shard }}/2)
strategy:
  matrix:
    shard: [1, 2]
```

`E2E core (shard 1/2)` and `E2E core (shard 2/2)` are **required contexts**. Changing the matrix
to, say, 3 shards renames them to `(shard 1/3)`… `(shard 3/3)`, and the two required contexts
would then **never report** — not "fail", just pending forever, so no PR could merge. **Confirmed
hazard.**

This is a live constraint on **P2**: option (b) (drop `smoke.yml` `e2e-core`) would remove those
two required contexts outright, and any shard-count change would orphan them. Either must be
paired with a branch-protection edit.

**2. Conditional required check.** `ci.yml`:

```yaml
  changeset-check:
    name: Changeset requirement check
    if: github.event_name == 'pull_request'
```

`Changeset requirement check` is a required context but is **skipped on non-PR events**. Today
that is safe, because required checks gate PRs. But it is exactly one condition away from a
deadlock — add `&& !github.event.pull_request.draft` and every draft PR would carry an
unsatisfiable required check. **Confirmed standing hazard**, as originally described.

---

## S2 — `lint:registry`: falsifiable ✅, but with a latent blind spot ⚠

The audit never checked whether `verify-registry` can fail. It was tested here using the
controlled-failure protocol in a throwaway worktree (`/tmp/reg-test`, removed afterwards; main
tree verified unchanged).

**Positive result — the gate is genuinely falsifiable.** Planting a missing reference written
repo-relative in a non-Planned section:

```
[verify-registry] ❌ 1 error(s):
  packages/core/tests/__planted_missing.test.ts — referenced but missing from the codebase
exit 1
```

So `lint:registry` is **not** a vacuous gate — it detects phantom entries when the reference is
in a form it can resolve.

**Latent blind spot.** `scripts/checks/verify-registry.js:87-95` resolves a token only if:

- it starts with `packages/`, `apps/` or `legacy/` (repo-relative), **or**
- it starts with `src/` (relative to the row's package), **or**
- it starts with `js/`, `css/` or `tests/` **and the package root ends with `legacy`**.

Anything else hits `return; // not resolvable deterministically — skip rather than guess`. So a
reference written as bare `tests/foo.test.ts` in a **non-legacy** package row is **silently
skipped**. Verified: planting `tests/__planted_missing.test.ts` in a `packages/core/` row produced
no error and left the report at "✅ 39 file reference(s) verified" — unchanged.

**Currently dormant, not a live false-green.** A scan of all registry files found **0** entries in
that form today: the main table uses `tests/*.test.ts`, which is filtered out earlier as a glob
(line 80) before reaching the resolve logic. So nothing is silently wrong right now.

**Why it is still worth recording.** The gate reports a reassuring count — "N file reference(s)
verified" — that does not represent every reference in the registry. Anyone who adds a concrete
`tests/foo.ts` row for a normal package gets **silently unverified coverage**, and the count will
not move. That is the same shape as F1: a declared thing that nothing actually checks.

**The `PLANNED` escape hatch is deliberate, not accidental.** `TESTING.md` documents it: *"these
specs are documented intent, not committed files … `verify-registry` reports them as warnings
rather than errors precisely because this section is marked Planned."* So the three missing e2e
specs are honestly labelled, and this is not a false-green. Two caveats remain: the trigger is the
substring `/future|planned/i` **anywhere** in the section heading or row text, so an unrelated
mention of the word downgrades an error to a warning; and three core packages (quiz-engine,
audio-synth, simulation-core) genuinely have **no e2e coverage** — only unit tests.

---

## Summary of corrections to REPORT.md

| Finding | Original | Corrected |
|---|---|---|
| **S1** *(new)* | not reported | All scheduled automation failed on billing and has not run since 2026-09-20 |
| **S2** *(new)* | not reported | `lint:registry` **is** falsifiable (✅ proven), but silently skips bare `tests/…` refs in non-legacy packages — **latent**, 0 affected today |
| F7 | Nightly red due to allowlist disagreement | Red due to **billing**; allowlist disagreement is **unverified** (never exercised) |
| F9 | Monitoring "off" because parked | It **broke first (billing), then was parked** |
| F11 | "Purpose unknown" — wire in or retire | Purposes identified: retire `verify.py`, **wire in `verify_git_safety.py`** (works, enforces AGENTS.md), `--record` once for `verify_export_contract.py` |
| F12 | Standing hazard | **Both hazards confirmed** (matrix names, conditional check) |

---

## What was not done

No file, workflow, permission, label, or setting was created, modified, or removed. No workflow
was manually triggered — that is a network side effect requiring authorization. Nothing was
merged. Resolving S1 requires action in GitHub **Billing & plans**, which is outside the
repository.
