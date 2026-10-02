---
title: "Pending Class-2 Decisions — Evidence Addendum"
status: ACTIVE
date: 2026-10-03
canonical: false
branch: ci/verification-architecture
base_commit: 97e6cf58e4beb6dd35b96ee003fb3afdc90af586
purpose: >-
  Resolve the "info needed" column of REPORT.md §5 with read-only evidence.
  Nothing here is applied; every item remains an owner decision.
---

# Pending Class-2 Decisions — Evidence Addendum

Companion to [`REPORT.md`](./REPORT.md) §5. This document answers the open question behind
each pending decision so the owner can decide from evidence instead of assumption.

**Read-only.** No workflow, branch-protection setting, permission, or file was modified to
produce this. Two of the original recommendations are **overturned** by the evidence — see
[Corrections](#corrections-to-reportmd-5).

Environment: `gh` authenticated as `Er-Sajan-PLG`, repo `STEMORG2026/LearningHub`, branch base
`97e6cf5`.

---

## Summary

| # | Decision | Original rec. | Verdict after evidence |
|---|---|---|---|
| P1 | Collapse the 3× dependency audit | (a) | **Correct, but atomic** — must edit branch protection in the same change |
| P2 | De-duplicate the E2E core suite | (a) | **⚠ Overturned** — (a) as written breaks the deploy gate. Safe only if `deploy.yml` is changed too |
| P3 | Remove unused `issues: write` | (a) | **Confirmed** — the permission is provably unused |
| P4 | Enforce review / CODEOWNERS | (a) | **⚠ Overturned** — (a) would deadlock the repo permanently. Do not apply |
| P5 | Restore production monitoring | (a) or (b) | **Correct, but the alerting path is broken** — one prerequisite first |
| P6 | Remove the vacuous `signed-tags` job | (a) | **Confirmed** — vacuous *and* redundant |
| P7 | Remove the inert `turbo.json` `lint` task | (a) | **Confirmed** — structurally dead |

---

## P1 — Collapse the 3× dependency audit

**Open question:** *Confirm which context names branch protection must keep.*

**Evidence.** `gh api repos/STEMORG2026/LearningHub/branches/main/protection` returns **13
required contexts**, and all three places the audit runs are among them:

| Where the audit runs | Context name | Required? |
|---|---|---|
| `ci.yml` → `verify` → `verify-governance` → `audit:deps` | `Verify governance` | **yes** |
| `ci.yml` → `audit` job | `Dependency audit` | **yes** |
| `security.yml` → `audit` job | `Dependency audit (security)` | **yes** |

The full required set: `Verify governance`, `Documentation freshness`, `Commit messages`,
`Changeset requirement check`, `Dependency audit`, `Dependency audit (security)`,
`Secret scanning (gitleaks)`, `Trivy source scan`, `Workflow lint`, `Lighthouse CI`,
`E2E core (shard 1/2)`, `E2E core (shard 2/2)`, `E2E visual regression`. `strict: true`,
`enforce_admins: true`.

**Verdict.** The recommendation **(a)** — drop the `ci.yml` `audit` job — is right on
assurance grounds: the three jobs run the *identical* command
(`node scripts/checks/audit-deps.cjs`) on the identical trust boundary, so two of them add
nothing.

**But the context names are load-bearing.** Removing a job whose context is required does not
remove the requirement — GitHub keeps waiting for a check that will never report, and **every
PR blocks forever**. So this decision is a **two-part atomic change**:

1. Remove the `ci.yml` `audit` job.
2. Remove `Dependency audit` from required status checks in branch protection.

Either alone breaks the repository. Step 2 requires admin API access, which is why this stays
an owner decision.

---

## P2 — De-duplicate the E2E core suite

**Open question:** *Confirm nothing consumes the `Verify governance` job for E2E specifically.*

**Answer: something does — materially. The original recommendation is unsafe as written.**

**Evidence — the duplication is real.**

```
test:a11y     = playwright test --config=playwright.config.ts --grep-invert 'visual-regression'
smoke.yml     = playwright test --config=playwright.config.ts --shard=${{matrix.shard}}/2 \
                                  --grep-invert "visual-regression"
```

Same config, same filter, same suite — the only difference is that `smoke.yml` shards it 2 ways.
`test:a11y` runs unsharded inside `verify-governance`, which is the `Verify governance` context.

**Evidence — the deploy gate depends on it.** The only `workflow_run` consumer in the repository
is `deploy.yml`, and it watches **one** workflow:

```yaml
on:
  workflow_run:
    workflows: [CI]          # <-- CI only
    types: [completed]
if: github.event.workflow_run.conclusion == 'success' && head_branch == 'main'
```

`deploy.yml`'s own comment documents the dependency:

> The CI workflow is the authoritative gate: its "Verify governance" job runs the full suite
> (typecheck, unit coverage, build, and **the entire Playwright suite via test:a11y** …).
> Deploy only when it completes green on main.

`smoke.yml` is named **"E2E Smoke Tests"** — a *separate* workflow. Nothing watches it:

```
$ grep -rn "E2E Smoke Tests" .github/
.github/workflows/smoke.yml:1:name: E2E Smoke Tests      # only its own declaration
```

**Verdict — ⚠ overturned.** Dropping `test:a11y` from `verify-governance` (option a) removes the
**only** E2E coverage inside the `CI` workflow. `deploy.yml` would then gate production deploys
on a green CI run that executed **no E2E at all**. The E2E suite would still run on PRs, but the
deploy gate would no longer wait for it — a silent loss of production assurance.

Option (a) is safe **only** if `deploy.yml` is changed in the same commit:

```yaml
    workflows: [CI, E2E Smoke Tests]
```

If that is not wanted, take **(c) leave as-is** — the duplication costs CI minutes, but it is
buying a real property: E2E-green-before-deploy.

**Also note.** `AGENTS.md:410`, `docs/RULES.md:1163`, and three task-playbooks describe
`Verify governance` as the gate that "runs the full suite". Dropping `test:a11y` makes those
statements false and they would need updating in the same change.

---

## P3 — Remove unused `issues: write`

**Open question:** *Confirm no planned issue-creating step.*

**Evidence.** `security.yml` declares, at top level:

```yaml
permissions:
  contents: read
  issues: write
```

Its three jobs are `gitleaks` (a `docker run` of the gitleaks image), `audit` (a `node` script),
and `trivy-source` (the `aquasecurity/trivy-action`). Scanning all three: no issue API call, no
`actions/github-script`, no issue-creating action, no `gh issue`. The only issue-creating code in
the repository is in the **parked** `monitor.yml`, which declares its own `issues: write`.

**Verdict — confirmed.** `issues: write` is unused; `contents: read` is sufficient. Removal is
zero-risk and tightens least privilege.

---

## P4 — Enforce review / CODEOWNERS

**Open question:** *Solo-maintainer workflow tolerance.*

**Evidence — it is not a preference. It is a hard deadlock.**

```
$ gh api repos/STEMORG2026/LearningHub/collaborators
count: 1
  - Er-Sajan-PLG   admin

$ cat .github/CODEOWNERS
# every one of the 25 entries is:
AGENTS.md @Er-Sajan-PLG
docs/CONSTITUTION.md @Er-Sajan-PLG
... (all @Er-Sajan-PLG)
```

**One collaborator. One code owner.**

**Verdict — ⚠ overturned. Do not apply (a).** Setting
`required_approving_review_count: 1` together with `require_code_owner_reviews: true` would make
**every PR unmergeable**: GitHub never counts the PR author's own approval, and with a single
code owner there is no second person who can supply one. The repository would be permanently
blocked, bypassable only by an admin override — which defeats the purpose of the setting.

Note `dismiss_stale_reviews: true` is already enabled.

**What actually protects `main` today:** `strict: true` + `enforce_admins: true` + 13 required
checks. That is a meaningful gate; the approval count is the only missing layer, and it cannot
be added without a second human.

**Path forward if review enforcement is wanted:** add a trusted second collaborator *first*, then
enable (a). Option **(b) require signed commits** is independent of reviewer count and *is*
viable for a solo maintainer — consider it on its own merits.

---

## P5 — Restore production monitoring

**Open question:** *`SITE_URL` secret; whether the alerting path still exists.*

**Evidence 1 — the secret is optional.** `gh secret list` shows `CF_ACCOUNT_ID`, `CF_API_TOKEN`,
`JULES_API_KEY`. **No `SITE_URL`.** But `monitor.yml` defaults it:

```yaml
SITE_URL="${{ secrets.SITE_URL || 'https://learning-hub-2026.pages.dev' }}"
```

So the workflow runs without the secret.

**Evidence 2 — the target works.** Live check of the endpoint the monitor polls:

```
$ curl -s -o /dev/null -w "%{http_code}" https://learning-hub-2026.pages.dev/health.json
200          (0.33s)
```

Body: `{"status": "ok", "name": "learninghub", ...}`. The monitor's success condition
(`status == "ok"`) is satisfiable.

**Evidence 3 — ⚠ the alerting path is broken.** The `report` job files downtime as:

```yaml
gh issue create --title "🚨 Site Down — ..." --label "downtime" --body-file ...
```

But **no `downtime` label exists** in the repository. `gh label list` returns only the nine
GitHub defaults (`bug`, `documentation`, `duplicate`, `enhancement`, `good first issue`,
`help wanted`, `invalid`, `question`, `wontfix`). `gh issue create --label downtime` fails with
*"could not add label: 'downtime' not found"*.

**Verdict — recommendation stands, with a prerequisite.** Re-enabling `monitor.yml` as-is yields
a monitor that correctly *detects* downtime and then **fails to alert**. Required order:

1. Create the label: `gh label create downtime --color B60205 --description "Production downtime alert"`
2. Move `.github/workflows-disabled/monitor.yml` back to `.github/workflows/`.
3. Optionally set `SITE_URL` (not required — the fallback is correct).

**Bonus observation (new — not in the original findings).** `apps/shell/public/health.json`
ships with **literal unsubstituted placeholders**:

```json
"buildTime": "__BUILD_TIME__",
"commitSha": "__COMMIT_SHA__",
"environment": "__ENVIRONMENT__"
```

No substitution step exists anywhere — `deploy.yml` contains no `sed`/`envsubst`/`BUILD_TIME`
handling — and live production serves the literal placeholders. The `status` field is hardcoded
and correct, so the *monitor* works; but the endpoint's build metadata is permanently dead, so it
cannot be used to confirm which revision is live. Worth fixing alongside P5.

---

## P6 — Remove the vacuous `signed-tags` job

**Open question:** *No external consumer of the `Verify signed tags` context.*

**Evidence 1 — it is vacuous.** `ci.yml` triggers:

```yaml
on:
  pull_request:
  push:
    branches: [main]        # <-- no `tags:` key
```

The job body:

```yaml
if [ "${{ github.ref_type }}" = "tag" ]; then
  ... git verify-tag ...
else
  echo "Skipping — not a tag push"
fi
```

Because the workflow never runs on a tag, `github.ref_type` is never `tag`; the job **always**
takes the `else` branch and exits 0. Consistent with observation: it "passed" in **6 s** on every
PR #88 run.

**Evidence 2 — it is redundant.** `release.yml` *is* tag-triggered (`on: push: tags:`) and does
the real check in its `Release gate (signed tag + CI-green)` job:

```yaml
- name: Verify tag is GPG-signed
  run: |
    if ! git verify-tag "${{ github.ref_name }}"; then
```

So the protection already exists where it can actually fire.

**Evidence 3 — no consumer.** `Verify signed tags` is **not** among the 13 required contexts. The
sole `workflow_run` watcher (`deploy.yml`) watches `[CI]` as a whole — and since the job always
passes, removing it cannot change that workflow's conclusion. No badges, no `needs:`, no docs
reference it.

**Verdict — confirmed.** Remove it from `ci.yml`. Nothing is lost.

---

## P7 — Remove the inert `turbo.json` `lint` task

**Open question:** *None.*

**Evidence.** `turbo.json` still declares the task, but it can never match anything:

```
turbo.json tasks.lint = { "outputs": [] }
workspaces defining a `lint` script: 0
anything invoking `turbo lint`: none
```

`c5959c6` repointed `pnpm lint` at the four real lint stages, so `turbo lint` has no caller —
and even if something called it, **zero workspaces implement `lint`**, which is precisely why it
was vacuous (turbo prints *"No tasks were executed as part of this run"* and exits 0).

**Verdict — confirmed.** The task is structurally dead. Safe to delete.

---

## Corrections to REPORT.md §5

The investigation changes two recommendations. `REPORT.md` §5 carries the original text; this
table is authoritative where they differ.

| # | Original recommendation | Corrected |
|---|---|---|
| P2 | "(a) — keeps the sharded, faster, required E2E core checks" | (a) is safe **only if** `deploy.yml` also watches `E2E Smoke Tests`. Otherwise (c) leave as-is — (a) alone removes E2E from the deploy gate |
| P4 | "(a) — CODEOWNERS is declared but unenforced today" | **Do not apply.** A single collaborator + single code owner makes (a) a permanent deadlock. Add a second collaborator first, or keep count at 0 and consider (b) signed commits |
| P1 | (a) | Unchanged in direction, but must be executed **atomically** with the branch-protection edit |
| P5 | (a) or (b) | Unchanged, but create the `downtime` label **before** re-enabling, or the alert cannot be filed |

---

## What was not done

No workflow file, branch-protection setting, permission, label, or secret was created, modified,
or removed. No branch was merged. Every item above remains an owner decision.
