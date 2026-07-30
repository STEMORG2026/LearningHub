# ADR-008: Built-in Observability (Tracer Package)

## Status
Accepted

## Date
2026-07-30

## Context
Debugging is hard when you can't see what the system is doing. Existing solutions:
1. **External services (Langfuse, Datadog, Sentry):** Require accounts, API keys, network access, and may have costs
2. **console.log:** Manual, easy to leave in production, no structure
3. **Browser DevTools:** Not integrated with application code, no cross-module tracing

## Decision
We build `packages/tracer/` — an internal observability system that:
- Times every function call and creates span trees
- Shows a live floating dashboard when `?trace=true` is enabled
- Logs all Event Bus traffic when `?debug_events=true` is enabled
- Requires zero external services

**Why build vs buy:** STEM-TUITION is a learning project. Building the tracer teaches:
- How observability tools work internally (spans, traces, waterfalls)
- Decorator patterns in TypeScript
- Performance profiling and optimization
- The tracer is also useful for LearningHubSTEM and future projects

## Alternatives Considered
- **Langfuse:** External service, creates dependency, costs money at scale
- **Sentry:** Error-focused, not designed for performance tracing
- **console.log:** Manual, unstructured, easy to forget in production

## Consequences
### Positive
- Full visibility into the system at all times
- No external dependencies or API keys needed
- Educational — teaches how observability works
- Can be extended to send data to external services later if needed

### Negative
- Must build and maintain the tracer package
- Should NOT be used in production without performance testing (instrumentation adds overhead)

### Neutral
- Tracer is optional — enabled via URL parameters or feature flag
- Default state: tracer exists but inactive unless explicitly enabled
