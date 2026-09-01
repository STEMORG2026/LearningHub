---
"@stem-tuition/content-provider": minor
"@stem-tuition/lesson-renderer": minor
"@stem-tuition/shell": minor
---

feat(content): narrative-driven progressive lessons

- Add `NarrativeContent` type + `composeNarrativeLesson` in content-provider: weaves an authored story (hook, history, what-came-before, analogies, worked examples, applications, connections, misconception traps, try-this, fun-facts) with the canonical LearningHubSTEM fact into a progressive `LessonContent`.
- Extend `LhsEntity` and the base adapter to surface learning objectives + real-world applications as sections and metadata (`application` section kind added).
- Shell: consumer-owned `data/narratives.ts` + `lesson-builder.ts` compose narratives where authored, fall back to the enriched base adapter otherwise.
- Renderer: render `application` sections, add scroll-reveal animation, and remove the mislabeled footer "applications" block (misconceptions were being double-rendered).
- Authored showcase narratives for Force, Newton's three laws, Work, Energy.
