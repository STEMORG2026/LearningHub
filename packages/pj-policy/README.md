# @learninghub/pj-policy

**Version:** 1.0.0

Content policy enforcement for the PROFESSOR-J seam (ADR-022, Phase 10 — governance).

Evaluates content produced for or by the AI worker against a declarative rule set,
returning an `allow` / `flag` / `block` action. This keeps content policy on the
LearningHub side, where governance lives, rather than inside the execution plane.

## Public API

- `ContentPolicyEngine` — the evaluator
  - `evaluate(content, context?)` — run the rules and return a `PolicyCheckResult`
  - `getRules()` — the configured `PolicyRule[]`
- `defaultPolicy` — a ready-made `ContentPolicyEngine` with the default rule set
- `PolicyRule` — one rule (category, action, matcher)
- `PolicyCheckResult` — the outcome (`action`, `violations`)
- `PolicyViolation` — a single matched violation
- `ContentPolicyConfig` — engine configuration
- `PolicyAction` — `allow` | `flag` | `block`
- `ContentCategory` — the content-category union

## Design note

Policy is **declarative and data-driven**: rules are supplied as data, so policy can be
updated without changing the engine. The engine never performs I/O.

## Status

`stable` / `incubating`. **This package currently has no consumer inside LearningHub** —
it is an integration surface for the Phase 10 governance work described in ADR-019 and
ADR-022.

## Dependencies

- `@learninghub/pj-types` (protocol types)
