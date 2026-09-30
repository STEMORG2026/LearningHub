# @learninghub/cross-repo-visibility

**Status:** `incubating` · **Version:** 1.0.0 · **Visibility:** internal (`private: true`)

Shared metrics and observability primitives for the LearningHub (LH) + PROFESSOR-J (P-J)
ecosystem. Provides an in-process, zero-dependency time-series registry so that multiple
workspaces can record and query the same operational metrics without importing each other.

---

## Why this package exists

The LH + P-J ecosystem spans several independently deployed surfaces (the LH shell app, the
P-J worker HTTP API, and the adapters in between). Without a common metric vocabulary each
surface invents its own counters, and no one can answer "how long did `/api/v1/chat` take
across the whole ecosystem?".

This package is the shared answer: a **registry of named metric series**, each with a unit and
a description, that any workspace can write to and any workspace can read from. It is
deliberately small — an in-memory store, not a metrics backend. Durability, aggregation across
processes, and dashboards belong to `@learninghub/ecosystem-dashboard` (the consumer of this
package) and to whatever external sink you export to.

## Public API

All symbols are exported from the package root (`src/index.ts` → `src/metrics.ts`).

### Types

| Symbol | Description |
| --- | --- |
| `MetricPoint` | One observation: `{ timestamp: number; value: number; labels?: Record<string, string> }`. `timestamp` is epoch milliseconds. |
| `MetricSeries` | A named metric: `{ name: string; description: string; unit: string; points: MetricPoint[] }`. |
| `VisibilityQuery` | A read filter: `{ metric: string; since?: number; until?: number; labels?: Record<string, string>; limit?: number }`. |
| `AggregationResult` | Summary statistics: `{ count: number; sum: number; avg: number; min: number; max: number }`. |

### `MetricsRegistry`

The core class. One instance holds many series.

| Method | Signature | Behaviour |
| --- | --- | --- |
| `register` | `(name: string, description: string, unit: string) => void` | Idempotent. Registering an existing name is a no-op — the first registration wins, so re-registering can never clobber accumulated data. |
| `record` | `(name: string, value: number, labels?: Record<string, string>) => void` | Appends a point stamped with `Date.now()`. **Silent no-op if `name` was never registered** — see *Known sharp edges* below. |
| `query` | `(q: VisibilityQuery) => MetricPoint[]` | Filters by `since` (`>=`), `until` (`<=`), and label equality (all supplied labels must match). `limit` returns the **most recent** N points (`slice(-limit)`), not the first N. Unknown metric → `[]`. |
| `aggregate` | `(q: VisibilityQuery) => AggregationResult` | Convenience wrapper over `query`. An empty result set yields all-zero stats rather than `NaN` — `count: 0, sum: 0, avg: 0, min: 0, max: 0`. |
| `listMetrics` | `() => string[]` | All registered metric names, in insertion order. |
| `getSeries` | `(name: string) => MetricSeries \| null` | The full series (including every point), or `null` if unregistered. |

### `globalMetrics`

```ts
export const globalMetrics = new MetricsRegistry();
```

A module-scoped singleton, provided so that unrelated workspaces can share one registry without
wiring a dependency through their constructors. Prefer constructing your own `MetricsRegistry`
and passing it explicitly in library code; reserve `globalMetrics` for app-level entry points
and tests.

### Usage

```ts
import { MetricsRegistry, globalMetrics } from '@learninghub/cross-repo-visibility';

const registry = new MetricsRegistry();

// 1. Declare the metric before writing to it.
registry.register('pj.chat.latency_ms', 'P-J /api/v1/chat round-trip latency', 'ms');

// 2. Record observations. Labels are optional but recommended for slicing.
registry.record('pj.chat.latency_ms', 412, { route: '/api/v1/chat', outcome: 'ok' });
registry.record('pj.chat.latency_ms', 1880, { route: '/api/v1/chat', outcome: 'ok' });

// 3. Query the last 100 points for one label set.
const recent = registry.query({
  metric: 'pj.chat.latency_ms',
  labels: { route: '/api/v1/chat' },
  limit: 100,
});

// 4. Summarise.
const stats = registry.aggregate({ metric: 'pj.chat.latency_ms', labels: { outcome: 'ok' } });
// → { count: 2, sum: 2292, avg: 1146, min: 412, max: 1880 }
```

## Known sharp edges

These are real characteristics of the current implementation, documented so consumers are not
surprised by them. They are candidates for the next revision of this package.

1. **`record()` silently drops writes for unregistered metrics.** If you `record()` before you
   `register()`, nothing happens and nothing warns. The observation is lost. Always register
   first, or check `listMetrics()`.
2. **No bound on series growth.** `points` is an unbounded array. A long-lived process that
   records a high-frequency metric will grow without limit. Periodic trimming is the caller's
   responsibility today.
3. **`limit` is a tail slice.** `limit: 10` returns the 10 *newest* points. There is no
   `offset`/pagination and no "first N" mode.
4. **Single-process only.** The registry is a plain `Map`. Two processes recording the same
   metric name do not see each other's points. Cross-process visibility requires exporting
   points to a shared sink.
5. **`query()` returns the live array** when no filters narrow it, so mutating the return value
   of `getSeries(name)?.points` mutates the registry's own storage.

## Design boundaries

- **In scope:** metric declaration, observation recording, filtered querying, descriptive
  aggregation.
- **Out of scope:** persistence, cross-process aggregation, alerting, histograms/percentiles,
  labeling cardinality limits. Percentiles in particular are *not* derivable from
  `AggregationResult` — you would need the raw points.

## Dependencies

- **Runtime:** `@learninghub/pj-types` (`workspace:*`) — shared chat/type contracts, used to keep
  metric naming aligned with the P-J integration surface.
- **Dev:** `vitest`, `typescript`, `jsdom`.

## Governance

- Conforms to the repository's coverage ratchet policy (`docs/RULES.md`) — thresholds move only
  upward.
- Covered by the doc-coverage gate (`scripts/checks/verify-doc-coverage.mjs`), which asserts that
  the symbols listed under *Public API* above remain documented here.

## Related

- `@learninghub/ecosystem-dashboard` — consumes health/stat data and renders status.
- `docs/adr/022-professor-j-integration.md` — the LH ↔ P-J integration this package observes.
