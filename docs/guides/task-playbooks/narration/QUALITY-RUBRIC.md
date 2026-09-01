# Narration Quality Rubric

**Version:** 3.0.0
**Part of:** [narration pipeline](../README.md)

The Master Reviewer scores each lesson and applies the discovery checklist. A lesson
should score **≥ 4/5** on every dimension to be approved; any dimension at **≤ 2/5**
triggers a refine.

## Dimensions (score 0–5)

### 1. Story (`story`)
- 5: a genuinely compelling arc — hook → people → history → build → applications →
  misconceptions — that reads as one narrative.
- 3: correct structure but reads like connected sections rather than a story.
- 1: bullet-point feel, no unifying voice.

### 2. Textbook readability (`readability`)
- 5: clear, warm, varied prose a high-school student enjoys and understands.
- 3: understandable but flat or jargon-heavy.
- 1: confusing or over-technical without scaffolding.

### 3. Deep-dive scaling (`deepDiveScale`)
- 5: starts simple, each rung teaches one clear thing, scales genuinely to
  professional/nerd depth.
- 3: rungs present but shallow or repetitive.
- 1: deep-dive missing or a single undifferentiated block.

### 4. Interactive / animation readiness (`interactiveReady`)
- 5: clear "try this", figures, analogies and variables an interactive/animating
  element can bring to life.
- 3: some texture, but no spark for simulation.
- 1: dry text with no observable/interactive hook.

### 5. Humanity and respect (`humanity`)
- 5: real people honoured with true names, roles, recorded words + sources; differing
  views given due weight.
- 3: names present but statements weak/missing, views flattened.
- 1: no people, or views reduced to "wrong vs right."

### 6. Accuracy (gate, binary, from Content Reviewer)
- `correctnessPassedByReviewer`: must be `true`. The Master Reviewer never ships a
  lesson with an unverified quote or a factual error.

## Discovery checklist (what roles commonly miss — Master Reviewer applies)

When reading a draft, actively hunt for these missed elements and send back for
enrichment when absent and valuable:

- [ ] **Prerequisite explicit** — the "what you need first" is stated and correct.
- [ ] **Connection graph** — ties to at least one earlier and one later topic.
- [ ] **A real worked example** with numbers, fully solved, with units.
- [ ] **An alternative / historical view** given due weight (not just the answer).
- [ ] **A misconception framed as a story**, not a list.
- [ ] **A "try this"** the learner can actually do safely.
- [ ] **At least one figure** with the person's own recorded words (sourced).
- [ ] **An etymology or naming story** ("why is it called that?") when it enriches.
- [ ] **Order-of-magnitude / real-world scale** so the numbers feel real (e.g.
  "about the weight of a small apple").
- [ ] **Names of the key pioneers** with honest roles (not "a physicist").
- [ ] **A hook that answers "why should I care?"** in the first line.
- [ ] **Current relevance** — where the idea matters today (engineering, medicine,
  space), so it never feels merely historical.

## Interaction with the integration floor

Beyond the rubric, the automated integration test
(`apps/shell/tests/narrative-integration.test.ts`) enforces a hard floor: story-first
lead, `context`, `analogy`, `example`, `application`, `misconception`, `try-this`,
`fun-fact` sections; every narrated concept has figures (with a named contribution),
a timeline, perspectives, and a scaling deep-dive starting at "Curious". The Master
Reviewer's gate is stricter and human-shaped; the automated floor is the non-negotiable
baseline.