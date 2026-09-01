# Narration Pipeline Playbook

**Version:** 3.0.0
**Scope classification:** `NOW` — implements the multi-agent narrative production pipeline
for STEM-TUITION narrated lessons.
**Owner:** STEM-TUITION content/pedagogy team (consumer-owned, CONSTITUTION.md §35).

This playbook defines the **multi-agent narration assembly line** that produces
`NarrativeContent` for physics (and, later, other-domain) concepts. It breaks one
concept into a series of independently-run stages so that **several topics can be
in flight at once** — while one topic is being written, another is being reviewed
and a third is being researched.

---

## The problem this solves

The first 17 narrated lessons were written by a single authorial pass. That works,
but it does not scale to the full curriculum (~79 physics concepts, then bio / chem /
earth / eng), and it binds research, writing, review and readability into one step.
This pipeline separates those concerns into dedicated agents so each can go deep,
and so the queue never stalls on one slow stage.

## The five roles

| Role | Stage | What it does | Input | Output |
|---|---|---|---|---|
| **Researcher** | `research` | Gathers authoritative, sourced material: real people + recorded words, dated milestones, respected/differing views, applications, prerequisites, misconceptions, deep-dive ladder content. Merges the canonical entity with external, citable sources. | a canonical `LhsEntity` | a structured **research dossier** (JSON) |
| **Writer** | `write` | Turns the dossier + canonical fact into the full `NarrativeContent` lesson, in genuine textbook prose — a story, not bullet points. | dossier + entity | a **draft** narrative (TS module) |
| **Reviewer** | `review` | Checks **factual accuracy**: every figure, date, statement and source is real; no hallucinated quotes; canonical facts intact; all required sections present. | draft | structured **findings** (pass / specific edits) |
| **Master Reviewer** | `master-review` | Reads for **readability and pedagogy**: textbook-like, fully story-shaped (history → current → applications → misconceptions), interactive/animation-ready, engaging for a real student. Approves or returns refinement requests. | reviewed draft | **gate verdict** + refinement list |
| **Animator** (advisory) | `animate` (optional) | Advises on the interactive / animation / figure / "try this" elements a lesson should carry so the rendered `stem-lesson` sections live rather than sit. | approved draft | **animation/interactivity notes** |

The **Researcher, Writer, Reviewer and Master Reviewer** are the core assembly line.
The Animator role is advisory and produces guidance the writer can fold in.

## Assembly-line execution

These stages run on **different topics in parallel** — a production queue:

```
Topic A:  research → write → review → master-review → approved
Topic B:            research → write → review → master-review → …
Topic C:                      research → write → review → …
```

A topic advances to the next stage the moment its current stage completes; the head
of the pipeline is never blocked by the tail. In practice this is implemented with
the orchestration script in `scripts/narrate/` (see `.assembly-line.mjs`), which runs
the pipeline over a batch of topic ids with a bounded number of workers per stage.

**Retry rule.** The Reviewer and Master Reviewer can send a draft back. Up to `N`
(usually 2) refinement rounds are allowed per stage before the topic is marked
`rejected` and deferred, rather than approving a weak lesson.

## When to run

- Adding a **new narrated lesson** for a concept that is canonically present in
  `apps/shell/src/data/knowledge.json` but missing from the `NARRATIVES` record.
- **Rewriting / mastering** an existing lesson whose master-review score is low.
- Expanding lesson quality (interactive/animation elements) on already-approved topics.

## Inputs

- **Canonical entities**: `apps/shell/src/data/knowledge.json` (the vendored
  LearningHubSTEM export). Every concept carries `definition`, `symbol`, `unit`,
  `equation`, `common_misconceptions`, `learning_objectives`,
  `real_world_applications` and `relationships` — the researcher starts from these
  and augments, never contradicts, them.
- **Target interface**: `packages/content-provider/src/types.ts`
  (`NarrativeContent`, plus `LessonFigure`, `TimelineEntry`, `LessonPerspective`,
  `LessonDepthRung`).
- **Existing lessons**: `apps/shell/src/data/narratives.ts`,
  `apps/shell/src/data/narratives-batch2.ts` (tone + format reference).

## Outputs

- **Per-topic draft + approved lesson** written to
  `apps/shell/src/data/narratives/_batchNN_/` one file per topic, then merged into a
  committed `narratives-batchNN.ts`.
- **Decisions** recorded as `docs/adr/` entries when the pipeline's contract changes.
- The lesson is **verified by the integration floor** in
  `apps/shell/tests/narrative-integration.test.ts` before it is merged and deployed.

## Quality bar (summary)

The full rubric is in [QUALITY-RUBRIC.md](./QUALITY-RUBRIC.md). At minimum a lesson
must pass the Master Reviewer's **story, correctness, and readability** gates, and
the automated integration floor (figures with recorded words + sources, a timeline,
honoured perspectives, and a scaling deep-dive that starts at "Curious").

## Role contracts

- [Researcher](./ROLE-RESEARCHER.md)
- [Writer](./ROLE-WRITER.md)
- [Reviewer](./ROLE-REVIEWER.md)
- [Master Reviewer](./ROLE-MASTER-REVIEWER.md)
- [Animator](./ROLE-ANIMATOR.md)
- [I/O contract](./I-O-CONTRACT.md) (exact shapes)
- [Quality rubric](./QUALITY-RUBRIC.md)

## Governance

- **Consumer-owned**: narratives are authored in STEM-TUITION (CONSTITUTION.md §35);
  canonical facts live in LearningHubSTEM and are never rewritten here. The pipeline
  composes with the canonical entity via `composeNarrativeLesson`.
- **Attribution honesty**: every human named is a real person; recorded words are
  quoted with a source; differing/respected views are given due weight, never
  flattened or mocked.
- **Verification**: each merged batch must pass `pnpm typecheck`, `pnpm test`, and
  `pnpm verify-governance` (see `docs/guides/task-playbooks/verify.md`).

## Domain & grade scope

The pipeline is **domain-agnostic** — the research + writer + reviewer roles operate on
any canonically-present concept, not just physics. Current and planned coverage:

| Domain | Concept-ids | Note |
|---|---|---|
| Physics | `lhs:phys.*` | Authoring active (79 concepts; 23 narrated+). |
| Chemistry | `lhs:chem.*` | e.g. atom, element, bond, reaction. |
| Biology | `lhs:bio.*` | e.g. cell, photosynthesis, DNA, gene. |
| Earth & Space | `lhs:earth.*` | e.g. plate tectonics, seasons. |
| Engineering | `lhs:eng.*` | e.g. engineering design process. |
| Mathematics | `lhs:math.*` (planned) | Number, algebra, geometry, calculus… |
| Computer Science | `lhs:cs.*` (planned) | Programming, data, algorithms… |

Curriculum reach is **up to Grade 12** (senior secondary / NEB + A-Level equivalents):
the `curriculum-mappings.ts` module exposes grades 8–12 in the selector, and each
curriculum gets a dedicated grade mapping; until a grade-11/12 mapping is authored the
path falls back to the nearest available syllabus with a visible notice (see
`apps/shell/src/lib/learning-path.ts`).

Add concepts to LearningHubSTEM (canonical) first, then narrate them here. The narrator
never writes canonical facts — it composes with them.