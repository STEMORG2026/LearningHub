---
"@stem-tuition/content-engine": minor
---

feat(content-engine): complete the production pipeline runner and additive formats

- **`produce()` pipeline runner** (`src/pipeline.ts`): drives Request → Blueprint →
  FormatGenerator → deterministic + semantic verification → hard-gate `evaluateGates` →
  targeted repair → `publish`/`hold`/`reject`, emitting `Artifact`s for the
  `narrative-lesson` format first. It is LLM-agnostic — `FormatGenerator` and
  `SemanticVerifier` are injected callbacks, so it runs testably without a network and a
  real runner (workflow/litellm/…) supplies those callbacks.
- **`QUIZ_FORMAT`**: a second, non-narrative `FormatSpec` registered by default — proves
  the additive extension point (a new format needs zero core change).
- Deterministic gates (coverage, schema) run natively; semantic gates (factual,
  lhs-fidelity, pedagogical, format, intent-essence) run via the injected verifier, with
  failures routed to targeted repair (`repairOrders`).