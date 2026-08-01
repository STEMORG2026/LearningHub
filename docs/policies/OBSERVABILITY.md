# Observability Standards

**Version:** 3.0.0
**Status:** Enforced
**Owner:** Architecture
**Applies To:** All packages and apps
**Related:** `RULES.md`, `EVENT_BUS_CONTRACT.md`, `docs/component-registry/TRACE.md`, `docs/adr/008-built-in-observability-tracer.md`

---

## Purpose

This document defines the **project-wide observability conventions**. It states
*what* to emit and *how to name it* — never *which* implementation to use. The
`@stem-tuition/tracer` package is the current implementation; a different backend
may be swapped in later without changing these conventions.

`RULES.md` merely mandates that observability follows "the project naming
convention" — the convention itself is defined here.

---

## 1. Naming Convention (all signals)

**Events, trace spans, and log categories share one naming scheme:**

```
domain:action
```

- `domain` — the owning package/area (`quiz`, `audio`, `physics`, `nav`, `event-bus`, …)
- `action` — past-tense verb (`answer-submitted`, `page-changed`, `play-correct-sound`)

Examples: `quiz:answer-submitted`, `nav:page-changed`, `audio:play-correct-sound`,
`physics:tick`.

This single convention keeps events (`EVENT_BUS_CONTRACT.md`), trace spans
(`TRACE.md` registry), and structured logs greppable and correlatable.

## 2. Trace Spans

- Span names MUST follow `domain:action` (see above).
- Every user-facing interaction MUST be wrapped in a span with the owning domain.
- Spans MUST be correlated by a `traceId` shared across the whole interaction.
- Parent/child relationships MUST be explicit (`parent` span name on the child).
- Timing is captured automatically by the tracer; spans must not embed timing
  values in names.

## 3. Structured Logging

| Level | Meaning | Example |
|-------|---------|---------|
| `debug` | Implementation detail, off by default | parsing payload X |
| `info` | Notable lifecycle event | module initialized |
| `warn` | Recoverable anomaly | fallback path taken |
| `error` | Operation failed, handled | request failed after retries |

- Log entries MUST be structured (key/value fields), never free-text only.
- The `domain:action` identifier MUST be the log's category.
- **No PII** (personally identifiable information) in any log field or message —
  student names, emails, and identifiers are forbidden.

## 4. Metrics

- Metrics MUST follow the project naming convention (defined in this document;
  format is a convention choice that may evolve).
- Metrics MUST be unit-declared and documented in the codebase when introduced.
- **No PII** in metric labels or names.

## 5. Diagnostics & Debug Flags

- Debug flags MUST follow the existing convention (`?debug_events=true`,
  `?trace=true`) — `?<area>=true`.
- Debug output MUST be off by default and never ship in production paths.
- The Tracer Dashboard is the debugging surface; diagnostic output MUST be
  visually separated from real user content.

## 6. Events

Event naming, payloads, and versioning are governed by
`docs/policies/EVENT_BUS_CONTRACT.md` — this document is the naming-convention source, the
contract doc is the payload/versioning source.

---

## Enforcement

- Naming-convention compliance is a code-review checklist item (see
  `docs/RULES.md` → Decision Matrix).
- Trace span names are verified against `docs/component-registry/TRACE.md` by the
  component-registry review process.
