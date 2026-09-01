# Playbook: Add Content

**Version:** 3.0.0
**Gate:** Local → PR
**Applies To:** adding a new concept/lesson (or enriching an existing one) to STEM-TUITION

---

## Before you start

1. **[ ] Classify scope** — `NOW` if this milestone needs it, `SEAM` if it protects a known
   future change, `LATER`/`OUT` if not. State it in one line. *(Evidence: a written
   NOW/SEAM/LATER/OUT line in the task.)*
2. **[ ] Confirm the canonical fact exists** — the concept must already be in
   LearningHubSTEM (an `lhs:*` entity) with `definition`, `equation?`, and
   `common_misconceptions`. If it is missing from the knowledge export, add it **there**
   first (LearningHubSTEM is the source of truth), then sync here with `pnpm sync:lhs`.
   *(Evidence: the entity id present in `apps/shell/src/data/knowledge.json`.)*
3. **[ ] Identify the authored narrative shape** — which of these the topic needs:
   hook, history, figures, timeline, perspectives, whatCameBefore, connections,
   applications, workedExamples, analogies, misconceptions, tryThis, funFacts,
   deepDive. Not every concept needs all of them; a *force* lesson does.

## Add the narrative (consumer-owned pedagogy)

4. **[ ] Add a `NarrativeContent` entry** in `apps/shell/src/data/narratives.ts` under the
   canonical id. *(Evidence: the `NARRATIVES[id]` entry.)*
5. **[ ] Honor the people** — if the concept has a human story, include `figures` with:
   `name`, `lifespan`, `role`, `contribution`, and (where verifiable) a `statement` +
   `statementSource`. Attribution must be accurate, respectful, and sourced.
   *(Evidence: each figure has a sourced statement or an honest absence.)*
6. **[ ] Add a `timeline`** — who did what and when, oldest first. Dates must be correct.
7. **[ ] Honor differing views** — if history holds respected / differing views, include a
   `perspectives` entry per view with a truthful `standing` (e.g. "Superseded but
   influential", "Established"). Give each its due weight; never flatten the disagreement.
8. **[ ] Add the "Explained" deep-dive** — see `explained.md`. If the topic warrants it,
   provide `phenomenon`, `intro`, and at least two `rungs` (Curious first, then scaling).
9. **[ ] Verify it composes** — the lesson must render a progressive story with the fact
   intact. Run the integration test:
   `pnpm --filter=@stem-tuition/shell test tests/narrative-integration.test.ts`
   and confirm your concept now appears in the narrated set.
10. **[ ] Keep canonical facts intact** — a narrated lesson must still carry the canonical
    `definition` as its `narrative` section. Do not edit LearningHubSTEM content here.

## Close-out

11. **[ ] Add a regression test** — extend `content-provider/tests/narrative.test.ts` with
    at least one assertion on the new content (e.g. contains a figure, has ≥2 rungs).
    *(Evidence: a named new test that passes.)*
12. **[ ] Typecheck + test the affected packages.**
    `pnpm --filter=@stem-tuition/content-provider test`
    `pnpm --filter=@stem-tuition/lesson-renderer test`
    `pnpm --filter=@stem-tuition/shell test`
13. **[ ] Update the changeset** if this changes package behaviour (`.changeset/*.md`,
    `minor` for new section kinds/features).
14. **[ ] Record the new concept** in the curriculum selector if it should appear in a
    learning path (see `review.md` step 3 if unsure).

## Definition of done

- [ ] One concept, one narrative entry, canonical facts intact.
- [ ] Figures/timeline/perspectives honored where the story warrants them.
- [ ] Deep-dive included where the topic benefits (see `explained.md`).
- [ ] A regression test proves the content composes.
- [ ] Evidence per tick (command output / named test).