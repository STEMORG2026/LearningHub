# Task Playbooks

**Version:** 3.0.0
**Status:** Active
**Owner:** Architecture + Product (content checklist), Dev (code gates)
**Applies To:** recurring STEM-TUITION work — content, verification, review, tests, explained deep-dives
**Related:** `docs/CONSTITUTION.md`, `docs/RULES.md`, `docs/guides/QUICKSTART.md`, `docs/testing/education-platform-checklist.md`, `AGENTS.md`

---

## Purpose

These playbooks make the repetitive work of this project **repeatable, correct, and
verifiable** — one playbook per recurring task type, each with a clear lifecycle gate,
a concrete checklist, and an *evidence-to-claim* rule (you may only claim a step done
when you can point at the evidence).

They are **consumer-owned pedagogy / engineering practice** (STEM-TUITION), not the
canonical knowledge base. Facts that live in LearningHubSTEM stay there (§35); these
playbooks govern how we *work with* them here.

## The recurring work

| Playbook | When to open it | Gate |
|----------|------------------|------|
| [`add-content.md`](add-content.md) | Adding a new concept/lesson | Local → PR |
| [`verify.md`](verify.md) | Before trusting any change (the verification loop) | Local → Merge |
| [`review.md`](review.md) | Before a PR is ready / merged | PR → Merge |
| [`tests.md`](tests.md) | Writing tests for a new section/feature | Local → PR |
| [`explained.md`](explained.md) | Authoring an "Explained" deep-dive (Curious→Nerd) | Local → PR |
| [`narration/`](narration/README.md) | Multi-agent narration pipeline (research → write → review → master-review) | Local → Merge |

Every playbook shares three primitives, defined in `common.md`:
**gates**, **evidence**, and the **language of "done"**.

## How to use

1. **Open the playbook** for the work you are starting.
2. **Work the checklist in order.** The playbook is a sequence, not a menu — later
   steps assume earlier ones.
3. **Tick a box only with evidence.** Each tick names the artefact that proves it
   (a command output, a test name, a diff). "I believe it works" is not evidence.
4. **Respect the gate.** Do not move work to a later gate (Local → PR → Merge)
   with open `[ ]` items at the current gate.
5. **Stay inside your scope.** The playbooks do not expand scope; they make the
   in-scope work correct. `NOW / SEAM / LATER / OUT OF SCOPE` classification happens
   *before* you open a playbook.

## Scope discipline reminder

> From `AGENTS.md`: classify every task NOW / SEAM / LATER / OUT OF SCOPE before
> writing code. Do not silently expand scope.

---

## Shared components

- [`common.md`](common.md) — gates, evidence, and the definition of "done"
- [`templates/`](templates/) — reusable checklists (copy for a new task)

## Maintenance

These playbooks are human-authored and maintainer-reviewed (per `docs/DOCS.md`).
When a pattern changes (a new verification command, a new section kind), update the
affected playbook and bump its version in its header.