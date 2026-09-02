# STEM-TUITION: General-Purpose Multi-Agent Content Production Engine

## Architecture Review & Refinement — v2

**Scope classification:** review + architecture (implementation deferred until this
is jointly accepted).

---

## §0. Why this document exists and what it decides

The previous design (v1: `docs/guides/task-playbooks/narration/` + `scripts/narrate/`)
was a working but **narrow** multi-agent narration pipeline: it produces exactly one
content type (`NarrativeContent` for a physics/biology/chemistry/… concept lesson) via
a fixed five-role assembly line. This review treats v1 as a **flawed first proposal**,
not something to defend, and critically redesigns it into the smallest general-purpose
content-production engine that satisfies:

- any subject, topic, learner level, grade/education system, curriculum, language,
  depth, content format, pedagogical approach — and future formats that do not exist yet;
- request-driven, declarative adaptation (never product assumptions baked into agents);
- the LHS boundary principle (LHS = canonical knowledge, STEM-TUITION = the knowledge→
  learning-experience layer);
- hard-gate publication (no single average score), intent/essence verification separate
  from factual verification, targeted revision, and a real execution DAG.

Per the review contract (§20-§24), this is **architecture first**: I have inspected the
actual repository (see §A) and I will **not** modify implementation code in this pass.
The file layout and types proposed here (`§C–§N`) are the target to build.

---

## A. Current Architecture Assessment (what exists now)

All of the following are real, read from the repository — not invented.

| Zone | What actually exists | How it works |
|---|---|---|
| **Canonical substrate (LHS)** | `apps/shell/src/data/knowledge.json` — a vendored export of **112 `LhsEntity`** objects | Each entity: `{ id: "lhs:<domain>.<name>", type, name, domain, status, definition, symbol, unit, equation, common_misconceptions[], learning_objectives[], real_world_applications[], provenance{...}, relationships[{type,target}] }`. LHS is the source of canonical facts; STEM-TUITION **consumes** it. |
| **Application model** | `packages/content-provider/src/types.ts` — `LessonContent`, `LessonSection` (`SectionKind` union of 16 kinds), `Question`, `SimulationConfig`, `ChallengeConfig`, `LessonMetadata`, `ContentFilter` | This is a **runtime rendering model** (per CONSTITUTION.md §35), not the canonical representation. It is the target of composition, not the source of truth. |
| **Narrative model** | `packages/content-provider/src/narrative.ts` — `NarrativeContent` (hook, history, figures[], timeline[], perspectives[], deepDive{...rungs}, whatCameBefore, connections, applications, workedExamples, analogies, misconceptions, tryThis, funFacts, estimatedTimeMinutes) | Consumer-owned pedagogical layer. Composer `composeNarrativeLesson(entity, narrative)` is a **pure function** that weaves canonical fact + narrative into a `LessonContent`. All narrative fields are optional; the composer falls back to the canonical fact. |
| **Lesson builder** | `apps/shell/src/lib/lesson-builder.ts` — `buildLessons(entities, narratives)` | Pure. Post-batch-6 refactor: takes entities **and** narratives; falls back to base adapter for non-narrated concepts. |
| **Data loading** | `apps/shell/src/data/narratives.ts` — `getNarratives()` dynamic-imports six batch modules; `narratives-batch1..6.ts` | Code-split so each batch is its own chunk (learn bundle ~15 kB gzip, max chunk ~36 kB). |
| **v1 pipeline (frac)** | `docs/guides/task-playbooks/narration/` (5 role playbooks + I/O contract + rubric) and `scripts/narrate/` (orchestration + role prompts) | A documented 5-role assembly line (Researcher → Writer → Reviewer → Master Reviewer ≈ Animator) that produces `NarrativeContent` for canonically-present concepts. Runs on topics in parallel. |

The **only content-production path today** is: hand-author `NarrativeContent` for a
concept (or drive the v1 pipeline), then `composeNarrativeLesson` renders it. Quizzes,
simulations and challenges exist as **types** but are authored/managed separately, not
produced by a content engine.

### LHS adapter
`packages/content-provider/src/lhs-adapter.ts` + `mapLhsEntitiesToLessons` adapt the
vendored export into the application model. The LHS fields are exactly
`definition / symbol / unit / equation / common_misconceptions / learning_objectives /
real_world_applications / relationships / provenance`. There is **no** LHS field for
source-of-truth figures/timeline/perspectives/deep-dive — those are consumer-owned today
by design (CONSTITUTION.md §35).

---

## B. Problems in the Current / Previous Proposal

### B1. v1 hardcodes "narrative lesson for a canonically-present concept" as the only product
`NarrativeContent` + `composeNarrativeLesson` is a real, good artifact — but it is **one
content format**, and the whole v1 pipeline exists solely to produce *that* shape. There is no
request model, no planning stage, no format dispatch, no other format (textbook chapter,
quiz, simulation, experiment, animation spec, teacher resource) reachable through the same
engine. This violates §3 / §17 / §18 / §21.

### B2. Role soup and no justification
Five roles (Researcher, Writer, Reviewer, Master Reviewer, Animator) exist because the
narrative content needs five kinds of work. The review's §5 test asks: *is an agent
justified, or is a deterministic validator / a shared capability better?* Under that test:
- **Reviewer** (factual) should be a **deterministic + targeted-LLM verifier**, not a full agent;
- **Master Reviewer**'s "readability/pedagogy" is a separate verifier, not another agent in line;
- **Animator** is advisory and should be folded into the format generator, not a role.

### B3. "9–10", "Grade 8–12", "physics", "79 concepts", narration-only are baked in
- The playbook says *"Curriculum reach is up to Grade 12 … grades 8–12 in the selector."*
  That is a **product scope note**, but it sits inside the pipeline doc as if it were the
  engine's contract.
- The `domain & grade scope` table, the `NarrativeContent` fixed fields, and a "2 rungs"
  deep-dive minimum are format-authoring detail, not engine rules.
- `curriculum-mappings.ts` has a fixed `CurriculumId` union (`neb_nepal`, …) — appropriate
  for the **product's curriculum selector**, but must not leak into the content engine as if
  NEB were "the" curriculum.

### B4. Verification is a single average score → violates §7
`MasterVerdict` carries `scores { story, correctness..., readability, deepDiveScale, ... }`
and the gate is an approval verdict. There is no hard-gate separation: a concept could pass
with a perfect story but a factual error masked by other scores. §7's hard-gate rule is not
met.

### B5. No intent/essence verification (§6)
v1 checks facts and style. Nothing checks "did the generated artifact actually do what the
requester wanted — as an experience, not just as a factually-correct document." A "story"
that arrives as a dry textbook paragraph passes v1.

### B6. Revision is whole-artifact
The retry rule sends a failed draft **back to the writer** to regenerate the whole lesson
(§13 violation). A single broken figure forces a full rewrite.

### B7. No request model, no planning artifact, no provenance beyond per-lesson
`NarrativeContent` is authored straight from a canonical entity. There is no
`ContentRequest`, no `Blueprint`, no knowledge snapshot pointer, no requirement traceability.
§9 / §12 / §15 are absent.

### B8. Not all examples are treated as examples (§2)
The I/O contract hardcodes one `deepDive` with `curve{curious,enthusiast,professional,nerd}`,
`2 rungs minimum`, `estimatedTimeMinutes`, etc. as if these are engine invariants. They are
**NarrativeContent-format** requirements (§3C), and even those are arguably over-fit.

---

## C. Final Proposed Architecture

The engine is a **request → planning → generation → verification → publication** pipeline
where every non-core concern is a **reusable, declarative capability**. It deliberately has
few hard-coded concepts: `ContentRequest`, `KnowledgePackage`, `Blueprint`, `Artifact`,
`Verifier`, `FormatSpec`, `PublicationDecision`.

```
                ┌─────────────────────────────────────────────────┐
                │            CONTENT REQUEST (user)              │
                │  high-level: topic / intent / audience / ask   │
                └───────────────────────┬─────────────────────────┘
                                        │  (any subset / any null)
                                        ▼
   ┌────────────────────────────  CONTENT ENGINE  ─────────────────────────────┐
   │  CURRICULUM/KNOWLEDGE PLAN:                                             │
   │   KnowledgePackage ← canonical LHS (snapshot) + external research        │
   │        (grounds everything; nothing overwrites LHS silently)             │
   └───────────────────────────────┬──────────────────────────────────────────┘
                                   ▼
   ┌────────────────────────────  BLUEPRINT  ────────────────────────────────┐
   │  decide: intent / audience / level / format(s) / learning objectives / │
   │          required+excluded concepts / length / style / verifier set     │
   │  (declarative — produces typed, traceable plan; the "what will we make")│
   └───────────────────────────────┬──────────────────────────────────────────┘
                                   ▼
   ┌────────────────────────  GENERATION LAYER  ────────────────────────────┐
   │  a FORMAT SPEC (declarative) selects a FORMAT GENERATOR:               │
   │     • narrative-lesson         • textbook chapter                      │
   │     • quiz/problem-set         • simulation                            │
   │     • experiment/lab script    • animation spec                        │
   │     • assessment/revision      • whatever a future spec declares       │
   └───────────────────────────────┬──────────────────────────────────────────┘
                                   ▼
   ┌────────────────────────  VERIFICATION LAYER  ──────────────────────────┐
   │  deterministic validators + LLM verifiers, run in PARALLEL:            │
   │   factual · LHS-fidelity · completeness · pedagogical · format ·       │
   │   intent/essence (final, on the combined result)                       │
   │  each hard gate → PASS / FAIL; no single average score                 │
   └───────────────────────────────┬──────────────────────────────────────────┘
                                   ▼
   ┌────────────────────────  REPAIR LOOP (targeted)  ──────────────────────┐
   │  a failed gate routes to the STAGE that caused it (knowledge/plan/     │
   │  generation/format), not back to a monolithic writer                   │
   └───────────────────────────────┬──────────────────────────────────────────┘
                                   ▼
                      ┌───────────────────────────┐
                      │  PUBLICATION GATE          │
                      │  all hard gates PASS + gov │
                      └───────────────────────────┘
```

**Ground rule (LHS/§4):** every step reads from a **knowledge snapshot** taken from the
vendored LHS export. External research never overwrites an LHS fact in-place; if research
indicates authoritative information may have moved on, that is recorded as a
`canonical-review-signal` on the LHS side, and STEM-TUITION composes with LHS unchanged for
the current generation.

---

## D. Responsibility Matrix

Components with real responsibilities, who/what performs them, and deterministic-vs-LLM.

| Component | Responsibility | Input | Output | Engine | Sync/Async | Reusable |
|---|---|---|---|---|---|---|
| **ContentRequest** | Capture *what is wanted* (never assumes) | user ask | typed request (`ContentRequest`) | — (schema) | sync | yes |
| **Curator** | Ground request in canonical LHS + external research; assemble `KnowledgePackage`; record canonical-review signals | request + LHS snapshot | `KnowledgePackage` | LLM (research) + deterministic assembly | async | yes |
| **Architect** | Turn request + package → `Blueprint`: intent, audience, level, format spects, objectives, required/excluded concepts, verifier set | request + `KnowledgePackage` | `Blueprint` | LLM | async | yes |
| **Format Registry** | Register/resolve a declarative `FormatSpec` → `FormatGenerator` + `FormatValidator` | format name/capability | chosen spec/generator/validator | deterministic | sync | yes |
| **Format Generators** | Produce a specific artifact shape (narrative, chapter, quiz, sim, lab, animation spec, …) per its `FormatSpec` | `Blueprint` + package | typed `Artifact` | LLM (+ a little deterministic scaffolding) | async | yes — one per format |
| **Deterministic Validators** | Schema/field/coverage/ID/version/link checks | `Artifact` | PASS/FAIL + gaps | **deterministic** | sync | yes |
| **LLM Verifiers** | Factual, LHS-fidelity, pedagogy, clarity, intent/essence (semantic judgment) | `Artifact` + requirements | PASS/FAIL + targeted findings | LLM | async | yes |
| **Repair Router** | Read failures → route to the responsible stage (targeted revision) | verification report | revision order | deterministic | sync | yes |
| **Publication Gate** | Require **all hard gates PASS** + governance + intent/essence PASS | verification reports | publish / hold | deterministic | sync | yes |

**Roles removed vs v1:** "Writer", "Reviewer", "Master Reviewer", "Animator" are dissolved.
"Writer" became **Format Generators**; "Reviewer/Master Reviewer" became **Verification**
components (deterministic + LLM). "Animator" became the **animation FormatSpec**. This
satisfies §5: a responsibility becomes a component only when it gives a clean boundary.

---

## E. Request Model (generic, optional fields)

```
ContentRequest
├── id: { project, request_uid, created_at }        // traceability
├── summary: string                                 // one-line intent
├── topic: string                                   // e.g. "Newton's second law"
├── domain?: string                                 // physics=chem=bio=math=cs=… any
├── audience?: { kind: "learner"|"teacher"|"researcher"|"general", age_range?, description? }
├── educational_context?: { level?, grade?, curriculum?, education_system?, prerequisites?[] }
├── intent: "explain"|"narrate"|"derive"|"quiz"|"simulate"|"experiment"|"assess"|"animate"|…
├── learning_objectives?: string[]                  // optional; inferred if absent, flagged if impossible
├── content_requirements?: { required_concepts?, excluded_concepts?, coverage? }
├── format?: FormatRequest                           // optional; if absent → the Architect suggests
├── pedagogical_requirements?: { approach?, examples?, analogies?, interactivity? }
├── language?: string                                // default = request language
├── accessibility?: { … }
├── length/?/depth?: { target_words?, depth: "intro"|"standard"|"deep" }
├── style?: { tone?, strictness? }
├── constraints?: { forbidden_claims?[], max_scope? }
└── output_preferences?: { format?, grade?, … }     // optional everything
```

- Every field **except `topic` + `intent` is optional**. The engine adapts to whatever the
  request supplies and **flags missing-but-important requirements** rather than inventing
  them (§9).
- `FormatRequest` is itself a spec reference (`format = "narrative-lesson"` **or** an inline
  capability description), so an entirely new format can be requested without touching core
  code (§18).

---

## F. Knowledge / Artifact Contracts

Typed, versioned intermediate artifacts with a clear purpose each.

| Artifact | Purpose | Why it exists (not bureaucracy) |
|---|---|---|
| `KnowledgePackage` | Grounding: canonical LHS snapshot (version, entity ids, definitions/equations/misconceptions) + supplementary researched material that is **clearly marked** `research:supplemental` vs `lhs:canonical` + `canonical-review-signals[]` | Traceable knowledge grounding; nothing silently overwrites LHS; a stable input for all later stages → reproducibility |
| `Blueprint` | The plan: intent restated, audience/level, chosen format specs, learning objectives, required/excluded concepts, verifier set, length/ghost targets, dependencies | Turns a request into an executable, verifiable plan; the place requirements are *made explicit*; drives generation + verifiers |
| `Artifact` | The generated content, typed per format (e.g. `NarrativeLesson`, `QuizSet`, `Simulation`, `LabScript`, `AnimationSpec`, …) | One uniform output token for verification/publication while remaining format-typed |
| `VerificationReport` | Per-gate PASS/FAIL + targeted findings (deterministic and LLM) | The only thing that decides publishability; drives targeted repair |
| `PublicationDecision` | Final: publish / hold(reason) / reject(reason) | Clean gate; auditable |

All carry `provenance { request_id, knowledge_version, stages:[{component, action, ts, artifact_hash}], gates_seen }`
so the system can answer §15's auditability questions.

---

## G. Verification Architecture (hard gates, no average score)

Every check is explicitly classified. Deterministic first where the answer is deterministic.

### Deterministic validators (LLM-free)
- **Schema/type validity** — artifact conforms to its `FormatSpec` output schema.
- **Structure** — required sections/components present; optional slots well-formed.
- **Required-concept coverage** — every `required_concepts` id appears; **excluded** ids absent (§8).
- **LHS version/datum resolution** — referenced LHS version exists; every concept id resolves; equations/symbols/definitions match the snapshot.
- **Format validity** — artifact matches the format spec structure + validator rules.
- **Citation/link integrity** — links/refs resolve; recorded-word source fields are non-empty strings.
- **Metadata/provenance** — required provenance present and self-consistent.

### LLM verifiers (semantic judgment required)
- **Factual** — statements true, consistent, current; no hallucinated figures/dates/quotes/sources.
- **LHS fidelity** — does not contradict the anchored LHS facts (definitions/equations/misconceptions).
- **Completeness (semantic)** — covers the request's learning objectives / required scope.
- **Pedagogical** — appropriate for target audience/level; objectives met; misconceptions handled; progressive where requested.
- **Clarity/quality** — readable, grade-appropriate vocabulary, coherent explanation.
- **Intent/Essence** (§6) — *did the artifact actually accomplish what the requester intended as an experience?* Compares Request → Declared Intent → Blueprint → Artifact. Independent of factual correctness.

**Hard-gate rule (§7):** publication requires every applicable gate = **PASS**. A single
FAIL (any gate) blocks publication regardless of others' scores. Scores are used only for
ranking/diagnostics/repair-priority — never to override a FAIL.

---

## H. Revision Routing (§13)

Failure → the stage that caused it:

| Failure | Routed to |
|---|---|
| LHS contradiction / stale LHS | **knowledge/curation** stage (record `canonical-review-signal`; do not silently fix in place) |
| Missing required knowledge | **curation** (retrieve) then re-plan if intrinsic |
| Wrong/missing fact | **research / LHS fidelity** verifier source |
| Missing required concept / bad scope | **Blueprint** stage |
| Pedagogical problem / wrong level | **Blueprint** (objectives/audience) + format generator |
| Poor explanation / clarity | **format generator** (regenerate that section) |
| Format violation | **format generator / format repair** |
| Weak interaction / not discoverable | **format generator** (interaction/experience sub-goal) |
| Failed user intent / wrong format | **Blueprint** + format generator (choose/repair) |

**Targeted repair:** a failed gate returns a **scoped edit request** (e.g. "replace
`figures[2].statementSource` with a verified source"), not a full regeneration. A full
regeneration only happens when the plan itself is wrong.

---

## I. Execution DAG (dependencies + parallelism)

```
request
   │
   ▼
knowledge/curation ──────────────►  (parallel, after grounding)
   │                                   ├─ research (external, when needed)
   ▼                                   ├─ misconception/pedagogy research
Blueprint                              ├─ format analysis / selection
   │                                   └─ (these feed generation, not each other)
   ▼
generation (one or more format generators, can fan out per format)
   │
   ▼
verification ─────────────────────────►  (parallel fan-out)
   ├─ deterministic validators (sync, all)     ├─ factual (LLM)
   ├─ LHS-fidelity (LLM)                       ├─ completeness (LLM)
   ├─ pedagogical (LLM)                        ├─ format (LLM)
   └─ …                                         
   │
   ▼
intent/essence (LLM, on COMBINED result — sequential after the parallel batch,
   because it judges the whole artifact) 
   │
   ▼
repair routing (if any FAIL) → back to the specific stage
   │
   ▼
publication gate (all PASS) → publish
```

**Parallel where dependencies allow:** research/pedagogy/format analysis after grounding;
the verifiers after generation. **Sequential where it must be:** grounding → blueprint is
ordered (plan needs grounded knowledge); intent/essence runs after the parallel verifiers
(it judges the combined whole).

---

## J. Extension Model (§17 / §18 / §3C)

Each "new thing" is added without rewriting core:

| To add | You add |
|---|---|
| New **subject/domain** | nothing structural — a `ContentRequest.domain` value + canonically-present LHS entities. Optional: a subject-specific capability (validator/notes) via the registry |
| New **grade/education system/curriculum** | a `FormatsSpec`/Education registry entry mapping the system; **no** schema change (grade is request data) |
| New **language** | translation capability; language is request data |
| New **pedagogical approach** | a pedagogical-requirement set + (optionally) a verifier criterion |
| New **content format** | declare a **FormatSpec** (`required structure, output schema, required/optional components, validation rules, rendering/interaction/accessibility requirements, generation guidance`) + a `FormatGenerator` + `FormatValidator`. Core engine untouched (§10-§11) |
| New **verifier** | a deterministic validator or LLM verifier implementing the `Verifier` interface; publish gate auto-includes it as a hard gate |

The **FormatSpec declaration** is the single extension point for new content types — exactly
the §11 direction, with no hardcoded `if story → …` anywhere in core.

---

## K. Governance & Publication Gates (§7 / §20K)

**Must all PASS before publication:**
1. canonical/factual integrity — PASS
2. required knowledge coverage — PASS
3. request requirements — PASS
4. learning objectives — PASS (where applicable)
5. audience/level suitability — PASS (where applicable)
6. format validity — PASS
7. pedagogical requirements — PASS (where applicable)
8. intent/essence — PASS
9. critical errors — NONE
10. governance checks — PASS (repo governance, conventional commits, docs:sync, code-split size budget)

There is **no** `average_score >= X` gate.

---

## L. Failure Modes

| Situation | Behaviour |
|---|---|
| LHS lacks required knowledge | `KnowledgePackage` flags the gap; plan either works around it or returns a `requirements-missing` outcome asking for the concept to be canonically added (LHS-first per workspace rule); **never** fabricates canonical content |
| External research contradicts LHS | LHS stays as the source of truth for the current generation; a `canonical-review-signal` is recorded for LHS; plan composes with LHS unchanged |
| Requirements ambiguous | `Blueprint` records the open question; if unresolvable, returns a **clarification request** (optionally with the most reasonable default proposed), never silently guesses |
| No suitable format exists | Format Registry returns no generator; engine asks for a different format or a new FormatSpec — it doesn't degrade to "write a lesson" by default |
| Content cannot satisfy constraints | Returns `unsatisfiable` with the specific conflicting constraint; no partial fabrication |
| Generation fails | Retry the generation stage with the error context (bounded); after N, mark failed and report |
| Verification fails | Targeted repair to the responsible stage (§H); bounded rounds, then held/rejected with a clear report |
| Revision repeatedly fails | After the bounded repair budget, the artifact is **held** (not force-published), with findings for a human/content owner |

---

## M. Testing Strategy

- **Unit** — each deterministic validator; each FormatSpec schema; Block/TypeScript types.
- **Schema** — every Artifact conforms to its FormatSpec; every ContentRequest parses.
- **Deterministic-validator tests** — required-coverage, excluded-absent, LHS-resolution,
  format-validity, link-integrity (all with good + bad fixtures).
- **Agent tests** — each LLM verifier with golden + adversarial prompts (does a subtle factual
  error get caught? does intent/essence distinguish a correct-but-wrong-experience doc?).
- **Integration** — a real request end-to-end through the DAG against the real vendored LHS.
- **E2E pipeline** — request → publish for a golden concept.
- **Regression / golden artifacts** — known-good outputs remain byte-identical for unchanged
  inputs (guards accidental drift).
- **Adversarial** — the §22 requests (university derivation, story, interactive, lab, no-grade,
  weird level, brand-new format) all must flow through the SAME core with no special-cases.
- **Provenance/version tests** — every artifact resolves its request, LHS version, and stage
  chain; publication gate cannot pass a missing-critical-gate.

---

## N. Migration Plan (evolve, don't rewrite)

v1 already gives the hardest parts: `NarrativeContent`, `composeNarrativeLesson`,
`buildLessons`, the code-split `getNarratives()`, and 47 working narratives.

1. **Treat existing narratives as the first FormatSpec** (`format = "narrative-lesson"`).
   Extract its shape into a declarative `FormatSpec`; keep the current types as the spec's
   output schema. Existing batch files become published `Artifacts` of that format.
2. **Introduce `ContentRequest` + `Blueprint` as thin types** at the pipeline head, mapping
   today's "author a narrative for `lhs:phys.wave`" into a request + a blueprint. No behavior
   change to rendering.
3. **Refactor verification**: split today's Reviewer/Master-Reviewer checks into the
   deterministic + LLM validator sets and add the **intent/essence** verifier. Replace the
   average-score `MasterVerdict` with hard-gate `VerificationReport`.
4. **Generalise `buildLessons`** already takes entities + narratives; extend the same seam to
   accept *any* format Artifact so future formats plug in.
5. **Land the Format Registry + first non-narrative spects** incrementally (e.g. `quiz` and
   `lab-script`) — each is an additive FormatSpec, core untouched.
6. **Deprecate `scripts/narrate/` + the five role playbooks** once the FormatSpec + verifier
   layer carries the same capability, keeping the playbook doc as a reference for the
   `narrative-lesson` format only.

No rewrite of the rendering pipeline; the 47 live narratives keep working throughout.

---

## O. Final Quality Test (§22) — the architecture survives radically different requests

Walked through the same core (no special-cases):
1. **Beginner explanation** → `intent:"explain"`, `audience.kind=="learner", level:"intro"` → narrative-lesson/explanation FormatSpec, depth intro. ✅
2. **University derivation** → `intent:"derive"`, `depth:"deep"`, `audience.kind=="learner", level:"undergraduate"` → derivation FormatSpec. ✅
3. **Historical narrative** → `intent:"narrate"` → narrative FormatSpec with people/timeline/perspectives honoured. ✅
4. **Progressive multi-stage lesson** → `format:"progressive-lesson"` → format spec declares staged structure. ✅
5. **Problem-solving sequence** → `intent:"derive"/"practice"` → problem-set/tutorial FormatSpec. ✅
6. **Interactive experience** → `format:"interactive"` → interactive FormatSpec (interaction defs). ✅
7. **Animation spec** → `format:"animation"` → animation FormatSpec (scenes/directions). ✅
8. **Lab/experimental activity** → `format:"lab"` → lab-script FormatSpec. ✅
9. **Teacher resource** → `audience.kind=="teacher"` → teacher-resource FormatSpec. ✅
10. **No grade specified** → generator uses only intent/audience; `depth` defaulted to a reasonable level and **reported**, never silently "Grade 9". ✅
11. **Unusual educational level** → treated as request data; pedagogically-appropriate verifier adapts. ✅
12. **Brand-new content format** → request references a FormatSpec; registry resolves or asks. ✅

All twelve run through the same `Engine`: Curator → Architect → FormatSpec/Generator →
validators → repair → hard-gate publish.

---

## P. What I will NOT do in this review

- I am **not** modifying code or writing implementation yet (per §24).
- I am **not** defending v1's five-role, physics-narrative-only pipeline.
- I am **not** inventing an LHS API — I designed against the real vendored 112-entity schema.
- I am **not** hardcoding "Grade 8–12", "physics", "NEB", "79 concepts", or the narrative
  format as engine rules — those remain product scope / request data / FormatSpec details.

If you accept this architecture, the natural first increment (N1–N3) is small and leaves the
47 live narratives untouched; subsequent increments add the first non-narrative FormatSpecs.