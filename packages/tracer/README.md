# @stem-tuition/tracer

## Purpose

Built-in observability: span-based function timing, nesting, error tracking, and a live dashboard. No external service required.

## Public API

- `Tracer` (singleton via `Tracer.getInstance`) — `startSpan`/`endSpan`/`getCurrentTraceId`/`getSpanTree`
- `traced(fn)` — wrap a function to record a span
- `traceDecorator` / `trace` — decorator/function forms
- `initTracer({ enabled })` — reads `?trace=true` and `?debug_events=true` from the URL
- Dashboard: `TracerDashboard`, `registerDashboard`, `showDashboard`, `hideDashboard`

## Inputs

- `traced(fn, { name?, ... })` — any async or sync function

## Outputs

- Span tree (see `docs/DEBUGGING.md`); console output prefixed with `[ts] [TRACE:<id>] [method]`

## Public Contracts

- Contract classes: `api`, `event`

## Dependencies

- `@stem-tuition/core`

## Extension Points

- Add a new listener via `Tracer.addListener(...)` to consume span events (e.g., analytics sink)
- `?debug_events=true` enables the debug console — extend `setupDebugConsole` for custom sinks

## Examples

```ts
import { traced } from '@stem-tuition/tracer';

const loadQuestions = traced(async () => {
  // ...
});
```
