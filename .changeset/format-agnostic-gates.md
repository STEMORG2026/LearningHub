---
"@stem-tuition/content-engine": patch
---

fix(content-engine): make deterministic coverage + schema validation format-agnostic

Stress review of the production engine found two genuine defects, both fixed so the
engine honours its own declarative format contract for *any* format, not just
narrative-lesson:

- **Coverage** was hardcoded to `payload.conceptId`, so a non-narrative format (quiz)
  either failed spurious coverage when `requiredConcepts` were set or passed vacuously.
  `FormatSpec` now takes an optional `coverage(payload)` hook; narrative-lesson returns its
  `conceptId`, quiz returns the union of its questions' concept links.
- **Deterministic schema** only ran `validateNarrativeStructure` for narrative-lesson, so a
  malformed quiz (e.g. empty questions) passed. `FormatSpec` now takes an optional
  `validate(payload)` hook; quiz validates required components + question shape, and any
  format without a hook falls back to a generic required-`components` presence check — a
  format can never be a free pass.

Adds an adversarial stress suite (`tests/engine-stress.test.ts`, 25 tests): the twelve
radically-different requests from the architecture review §O, boundary/invalid inputs,
repair-loop exhaustion, malformed artifacts, deterministic-vs-LLM gate separation, and
custom-format end-to-end. Coverage rises to ~98% lines; runtime behaviour for
narrative-lesson is unchanged.