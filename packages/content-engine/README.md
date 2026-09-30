# @learninghub/content-engine

**Version:** 1.0.0 · **Status:** `experimental` · **Maturity:** `incubating`

Content production engine — the request → blueprint → generate → verify → repair → publish
pipeline, built around a declarative format contract and hard-gate verification.

Nothing in this package touches the DOM or the live renderer. It is LLM-agnostic: every semantic
boundary is an injected callback, so the whole pipeline runs deterministically and testably
without a network.

---

## Architecture in one paragraph

A `ContentRequest` states what to produce. `planFromRequest` turns it into a `Blueprint` (a
deterministic plan: chosen formats, learning objectives, pedagogical posture). A runner-supplied
`FormatGenerator` produces an `Artifact` conforming to a `FormatSpec` registered in the
`FormatRegistry`. Deterministic validators and runner-supplied `SemanticVerifier` callbacks then
produce `GateResult`s, which `evaluateGates` folds into a `VerificationReport` under a **hard-gate
rule**: every gate must pass, and scores never average away a failure. Failed gates are routed by
`routeRepair` to the stage actually responsible, which emits targeted `RepairOrder`s; the loop
retries up to `maxRepairRounds` and then returns `publish` / `hold` / `reject`.

## Public API

All symbols are re-exported from the package root, which aggregates `request.ts`, `formats.ts`,
`blueprint.ts`, `verification.ts`, and `pipeline.ts`.

### Request model (`request.ts`)

| Symbol | Description |
| --- | --- |
| `ContentRequest` | The generic production request. Only `topic` and `intent` are required; every other field is optional by design. Carries `id` for traceability (`project`, `requestUid`, `createdAt`), `summary`, optional `domain`, `audience`, `educationalContext`, `learningObjectives`, and `contentRequirements`. |
| `ContentIntent` | What the requester broadly wants — `'explain' \| 'narrate' \| 'derive' \| 'quiz' \| 'simulate' \| 'experiment' \| 'assess' \| 'animate' \| 'revise' \| 'teach'`, plus `(string & {})` so future intents are not a breaking change. Deliberately open-ended, **not** an enum gate. |
| `Audience` | Who the content is for: optional `kind` (`'learner' \| 'teacher' \| 'researcher' \| 'general'` + open string), free-form `ageRange`, `description`. |
| `EducationalContext` | Optional context: `level`, `grade` (positive integer), `curriculum` (e.g. `neb_nepal`, `alevel`, `cbse`), `prerequisites[]`. |
| `Extent` | Time/depth expression: `targetWords` (advisory only — never a gate) and `depth` (`'intro' \| 'standard' \| 'deep'` + open string). |
| `FormatRequest` | Desired format(s): either a known format name (string) **or** an inline `{ format?, description? }` for a brand-new format not yet in the registry. |
| `PedagogicalRequirements` | Steering: `approach` (free-form), `examples`, `analogies`, `interactivity` (e.g. `progressive`, `socratic`, `discovery`). |
| `RequestConstraints` | `excludedConcepts[]` (claims that must not appear) and `maxScope` (hard limit). |

### Format contract (`formats.ts`)

| Symbol | Description |
| --- | --- |
| `FormatSpec` | The declarative contract for one output format: identity, component list, and validation rules. Adding a format means adding a `FormatSpec` — **zero core change**. |
| `FormatComponentSpec` | One component a format requires (its kind and role within the artifact). |
| `FormatValidationSpec` | The machine-checkable rules a produced artifact must satisfy for this format. |
| `FormatComponentKind` | Component-kind alias (string-typed intentionally, so new kinds are additive). |
| `FormatRegistry` | Holds the available formats and resolves a `FormatRequest` to concrete format ids. |
| `NARRATIVE_LESSON_FORMAT` | The built-in narrative-lesson `FormatSpec`. |
| `QUIZ_FORMAT` | The built-in quiz `FormatSpec`. |
| `Artifact<TPayload = unknown>` | A produced artifact: the format it conforms to plus its payload. Generic so each format carries its own shape. |
| `narrativeArtifact` | Constructor/helper for a narrative-lesson artifact payload. |

### Blueprint / planning (`blueprint.ts`)

| Symbol | Description |
| --- | --- |
| `Blueprint` | The deterministic plan derived from a request: resolved formats, learning objectives, and the decisions taken. |
| `LearningObjective` | One objective the produced content must satisfy. |
| `planFromRequest` | `(request, registry) => Blueprint` — the deterministic planner. |
| `resolveFormats` | `(format: FormatRequest \| undefined, available: string[]) => string[]` — resolves a possibly-inline format request against the registry's available formats. |

### Verification (`verification.ts`)

| Symbol | Description |
| --- | --- |
| `GateId` | The seven hard gates: `'schema' \| 'coverage' \| 'lhs-fidelity' \| 'factual' \| 'format' \| 'pedagogical' \| 'intent-essence'`. |
| `GateResult` | One gate's outcome: `{ gate, verdict, findings, score? }`. `score` is diagnostic for ranking only and **never** overrides `verdict`. |
| `VerificationReport` | `{ gates, publishable, hardGatePassed }` — `publishable` is true only when **every** gate passed. No arithmetic averaging. |
| `evaluateGates` | `(gates: GateResult[]) => VerificationReport`. Any `fail` ⇒ not publishable; also reports `failedGates`. |
| `passGate` | `(gate: GateId) => GateResult` — a passing result with no findings. |
| `failGate` | `(gate: GateId, findings: string[]) => GateResult` — a failing result carrying the reasons. |
| `validateConceptCoverage` | Deterministic gate: asserts `requiredConcepts` are present and `excludedConcepts` absent. Emits one finding per violation. |
| `validateNarrativeStructure` | Deterministic gate: validates a narrative artifact's required structure. |
| `INTENT_ESSENCE_VERIFIER` | The `GateId` constant `'intent-essence'` — the "did it accomplish the intended *experience*?" check, conceptually independent of factual correctness. |
| `IntentEssenceRunner` | `(input: IntentEssenceInput) => Promise<GateResult>` — the signature an LLM runner implements for the intent/essence gate. |
| `routeRepair` | `(gate: GateId) => RepairStage` — deterministic mapping from a failed gate to the stage responsible. Unmapped gates fall back to `'not-recoverable'`. |
| `repairOrders` | `(report: VerificationReport) => RepairOrder[]` — turns a failed report into targeted repair instructions. **Never** a whole-artifact regeneration unless the plan itself is wrong. |

Gate → repair-stage routing (`GATE_TO_STAGE`):

| Failed gate | Repair stage |
| --- | --- |
| `lhs-fidelity`, `factual` | `curation` |
| `coverage` | `blueprint` |
| `pedagogical`, `intent-essence` | `blueprint` |
| `schema`, `format` | `format-repair` |
| *(unmapped)* | `not-recoverable` |

### Pipeline (`pipeline.ts`)

| Symbol | Description |
| --- | --- |
| `KnowledgeContext` | The grounding input: `providedConcepts[]` (canonical concept ids the artifact must resolve against), optional `knowledgeVersion` (the LHS snapshot version), `supplemental` research (clearly marked supplemental), and `canonicalReviewSignals[]` for cases where external research challenges a canonical fact. |
| `FormatGenerator` | `(input: { blueprint, format, context, repair? }) => Promise<Artifact>` — produces a specific artifact shape. On a repair pass, `repair` carries the prior artifact and the findings to fix. Supplied by an LLM-backed runner. |
| `SemanticVerifier` | `(input: { gate, artifact, blueprint, context }) => Promise<GateResult>` — the callback for gates needing judgment. Deterministic gates (`schema`, `coverage`) run natively and are **not** forwarded here. |
| `RunnerCallbacks` | `{ generate: FormatGenerator; verify: SemanticVerifier }` — every LLM boundary sits behind these two functions. |
| `RunnerConfig` | `{ registry, callbacks, maxRepairRounds? }` — the safety cap on repair rounds before a hold/reject. |
| `PublicationDecision` | `{ action, blueprint, artifact?, report?, reason?, repairRounds }` — the pipeline's final answer. |
| `produce` | `(request: ContentRequest, config: RunnerConfig, context: KnowledgeContext) => Promise<PublicationDecision>` — runs the full loop: resolve formats → plan → generate → verify (deterministic + semantic) → repair → publish/hold/reject. |

## Usage

The engine is deliberately callback-driven, so it can be exercised without any LLM:

```ts
import {
  FormatRegistry,
  NARRATIVE_LESSON_FORMAT,
  produce,
  type ContentRequest,
  type RunnerCallbacks,
} from '@learninghub/content-engine';

const registry = new FormatRegistry();
registry.register(NARRATIVE_LESSON_FORMAT);

const request: ContentRequest = {
  id: { project: 'lh', requestUid: 'req-001', createdAt: new Date().toISOString() },
  summary: "Explain Newton's second law for secondary learners",
  topic: "Newton's second law",
  intent: 'narrate',
  audience: { kind: 'learner', ageRange: '13-16' },
};

const callbacks: RunnerCallbacks = {
  generate: async ({ blueprint, format }) => /* LLM or stub */ makeArtifact(blueprint, format),
  verify: async ({ gate, artifact }) => /* LLM or stub */ verifyGate(gate, artifact),
};

const decision = await produce(request, { registry, callbacks, maxRepairRounds: 2 }, {
  providedConcepts: ['law.newton.second'],
});

// decision.action === 'publish' | 'hold' | 'reject'
```

Because `generate` and `verify` are plain functions, tests substitute deterministic stubs and
assert on `decision.action`, `decision.report?.gates`, and `decision.repairRounds` without
touching a network.

## Dependencies

- `@learninghub/content-provider` — supplies content/knowledge shapes the engine grounds against.

## Governance

- `ARCHITECTURE.toml` declares `contracts = ["api", "interface", "schema"]`, `maturity =
  "incubating"`, `status = "experimental"`, and `adrs = ["016"]`.
- Covered by the doc-coverage gate (`scripts/checks/verify-doc-coverage.mjs`), which asserts that
  every symbol in `publicApi` appears in this README.
