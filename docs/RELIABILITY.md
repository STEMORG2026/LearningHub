# Reliability Standards

**Version:** 3.0.0
**Status:** Enforced
**Owner:** Architecture
**Applies To:** All packages and apps
**Related:** `RULES.md`, `API_CONTRACT.md`, `docs/DEBUGGING.md`

---

## Purpose

This document defines project-wide reliability expectations for asynchronous and
fallible code. It states *what behavior is required* — not *which library* to use.

---

## 1. Timeout Policy

- Every asynchronous I/O operation MUST have a bounded timeout (no unbounded waits).
- The timeout default and allowed override are decided by the owning package and
  documented at the call site.
- On timeout, the operation MUST fail with a typed, documented error — never hang.

## 2. Cancellation

- Long-running or cancellable operations MUST accept an `AbortSignal`.
- Consumers MUST be able to cancel work without leaking timers or listeners.
- After cancellation, no further callbacks/resolution MAY fire.

## 3. Retry Policy

- Retries are permitted ONLY for idempotent operations.
- Retries MUST be **bounded** (max attempts) and MUST use **backoff with jitter**.
- The final failure after exhausting retries MUST be a typed, documented error.
- Never retry on authorization/validation failures.

## 4. Graceful Degradation

- A feature MUST degrade gracefully rather than crash the whole page/module.
- Non-critical subsystems (e.g., audio) MUST fail independently of core flows.
- Degradation paths MUST log at `warn` (see `OBSERVABILITY.md`) and be visibly
  distinct from real failures.

## 5. Error Propagation

- Errors are **either handled or propagated** — never swallowed silently.
- Public APIs MUST throw typed, documented error types on failure
  (`API_CONTRACT.md`).
- Swallowing an error without logging or propagation is a violation.

## 6. Deterministic Failure Handling

- Failure behavior MUST be deterministic and predictable for a given input.
- Fail fast: detect and surface invalid state as early as possible.
- Error handling MUST not depend on timing, network order, or ambient state.

---

## Enforcement

- Reliability behavior is a code-review checklist item (`docs/RULES.md` →
  Decision Matrix).
- Timeout/cancellation/retry violations are surfaced in review and, where
  automatable, by static analysis.
