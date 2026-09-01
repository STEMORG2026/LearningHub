# Common: gates, evidence, and "done"

**Version:** 3.0.0
**Status:** Active
**Applies To:** every task playbook in `docs/guides/task-playbooks/`

This is the shared vocabulary the playbooks rely on. Read it before any playbook.

---

## Lifecycle gates

Work moves through three gates. Nothing crosses a gate with open `[ ]` items.

| Gate | What it means | Who can pass it |
|------|---------------|-----------------|
| **Local** | The work is correct on your machine: typechecks, unit tests, no obvious governance violations. | The contributor |
| **PR** | The work is correct in review: governance checks pass, architecture is clean, reviewer approves. | Reviewer (human or agent) + CI |
| **Merge** | The work is safe on `main`: full CI gate green, no regressions, docs in sync. | CI + maintainer |

Rules:
- **Local → PR** requires: clean `pnpm typecheck`, clean `pnpm test`, and a completed
  `review.md` self-check.
- **PR → Merge** requires: CI's `Verify governance` green (or, when CI is infra-blocked,
  the *locally reproducible* equivalent documented in `verify.md`).

## Evidence-to-claim rule

> **A claim needs evidence; a tick needs an artefact.**

For every checklist item in every playbook, the "evidence" is the concrete thing that,
if lost, would force you to redo the step:

| Kind of claim | Acceptable evidence |
|----------------|---------------------|
| "Typechecks" | Exact command + its output (`pnpm typecheck` → `22 tasks, all pass`). |
| "Tests pass" | Exact command + pass count (`pnpm test` → `47 passed`); a named new test that exercises the change. |
| "Governance OK" | Exact command + exit 0 (`pnpm verify-governance`, `verify-all.py --gate pre-merge`). |
| "A feature works" | A test that exercises it *and* asserts the intent (not just "ran"). |
| "Content is accurate" | The canonical source cited (LearningHubSTEM entity id, a named text). |
| "No secrets" | A diff/source read showing no secret-bearing string; the relevant check run (gitleaks). |
| "History is right" | The person, their role, the sourced statement, and the year each present. |

If you cannot name the evidence for a `[ ]`, the item is **not done**.

## The language of "done"

A checklist item is described in a way that is **mechanically checkable**:

- Use **imperative, single-claim** lines: "Add a test that asserts X" (not
  "Make sure it's good").
- Each item names a **gate** and the **evidence** that closes it.
- Prefer checkboxes that can only be honestly ticked with proof.

## Terminology

| Term | Meaning |
|------|---------|
| **Canonical fact** | The definition/equation/misconceptions from LearningHubSTEM (the source of truth for *what is true*). |
| **Narrative** | The teaching story in STEM-TUITION (the *how we teach*), consumer-owned per §35. |
| **Section kind** | A `SectionKind` (story, figure, timeline, perspective, deep-dive, application, …). |
| **Deep-dive / Explained** | The scaling rung section: Curious → Enthusiast → Professional → Nerd. |
| **Pre-existing failure** | A check that fails identically on `main` with no change applied — not a regression, therefore not this task's blocker. |

## Distinguishing a regression from a pre-existing failure

When a gate fails, before fixing, decide *whose* failure it is (workspace rule: use the
failure classifier / `verify_all.py --gate pre-merge`):

1. **Reproduce on a clean checkout of the base** (branch → `main`). If it fails there
   too, it is pre-existing.
2. If **pre-existing**, record it (date, symptom, root cause if known) and decide with
   the maintainer whether it is in scope for this task. Do **not** silently rewrite a
   dependency/CI domain you do not own.
3. If **a regression** (your change caused it), stop and fix it before proceeding.

## Last-resort discipline

`--no-verify` on a commit is only acceptable when the pre-commit hook fails on a
**pre-existing, documented** infra break, the fix is out of scope, and the commit itself
is fully verified by the equivalent checks run by hand. The commit message must say why
`--no-verify` was used.