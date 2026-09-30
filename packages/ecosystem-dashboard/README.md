# @learninghub/ecosystem-dashboard

**Status:** `incubating` · **Version:** 1.0.0 · **Visibility:** internal (`private: true`)

Health-and-status model for the LearningHub (LH) + PROFESSOR-J (P-J) ecosystem. This package
owns the *domain logic* of ecosystem health — service registration, status transitions, alert
selection, and system-level roll-up — and nothing about rendering.

---

## Why this package exists

When several surfaces make up one product, "is the ecosystem healthy?" is a question that needs
a single deterministic answer that the CLI, a status page, and a test can all agree on. This
package is that answer: a small model you feed service heartbeats into, and which then tells you
which services are down, which are degraded, what the aggregate stats are, and whether the system
as a whole should be reported as `healthy`, `degraded`, or `down`.

It holds **no timers, no network calls, no rendering**. Callers decide when to refresh
(`config.refreshIntervalMs` is carried as configuration, not acted upon here) and how to display
the result (`formatHealthStatus` returns a string, not markup).

## Public API

All symbols are exported from the package root (`src/index.ts` → `src/dashboard.ts`).

### Types

| Symbol | Description |
| --- | --- |
| `ServiceHealth` | One service's current state: `serviceId`, `name`, `status: 'healthy' \| 'degraded' \| 'down'`, `responseTimeMs`, `lastChecked`, optional `details`. |
| `DashboardStats` | Aggregate counts: `{ totalServices, healthyServices, degradedServices, lastUpdated }`. |
| `DashboardConfig` | `{ refreshIntervalMs: number; alertThresholds: { responseTimeMs: number; errorRate: number } }`. |

### `EcosystemDashboard`

| Method | Signature | Behaviour |
| --- | --- | --- |
| `constructor` | `(config?: Partial<DashboardConfig>)` | Shallow-merges over `DEFAULT_CONFIG`. **Note:** the merge is top-level only, so passing `{ alertThresholds: { responseTimeMs: 500 } }` *replaces* the whole `alertThresholds` object and drops `errorRate`. |
| `registerService` | `(id: string, name: string) => void` | Adds a service defaulted to `status: 'down'`, `responseTimeMs: 0`, `lastChecked: 0` — i.e. **registered-but-never-checked is reported as down**, the fail-safe default. |
| `updateHealth` | `(serviceId: string, health: Partial<ServiceHealth>) => void` | Merges a partial update and always re-stamps `lastChecked = Date.now()`. **Silent no-op for an unknown `serviceId`** — it does not auto-register. |
| `getServiceHealth` | `(serviceId: string) => ServiceHealth \| null` | One service, or `null`. |
| `getAllServices` | `() => ServiceHealth[]` | All services, in registration order. |
| `getStats` | `() => DashboardStats` | Counts by status. `lastUpdated` is stamped at call time. Note `downServices` is **not** a field — derive it as `total - healthy - degraded`. |
| `getAlerts` | `() => ServiceHealth[]` | Services that are `down` **or** whose `responseTimeMs` exceeds `alertThresholds.responseTimeMs`. (`errorRate` is currently **unused** by the alert logic.) |
| `getSystemHealth` | `() => 'healthy' \| 'degraded' \| 'down'` | Roll-up: `down` when there are zero services; `degraded` if any service is degraded *or* if any service is not healthy; otherwise `healthy`. |

### `formatHealthStatus`

```ts
export function formatHealthStatus(status: string): string
```

Maps a status string to a display label — `'healthy'` → `🟢 Healthy`, `'degraded'` → `🟡 Degraded`,
`'down'` → `🔴 Down`, anything else → `⚪ Unknown`. Takes a plain `string` (not the union type)
so unknown/unexpected values degrade gracefully instead of being a type error at the call site.

### Defaults

```ts
const DEFAULT_CONFIG: DashboardConfig = {
  refreshIntervalMs: 30000,
  alertThresholds: { responseTimeMs: 2000, errorRate: 0.05 },
};
```

### Usage

```ts
import { EcosystemDashboard, formatHealthStatus } from '@learninghub/ecosystem-dashboard';

const dashboard = new EcosystemDashboard({
  alertThresholds: { responseTimeMs: 2000, errorRate: 0.05 }, // pass the full object
});

dashboard.registerService('lh-shell', 'LearningHub Shell');
dashboard.registerService('pj-worker', 'PROFESSOR-J Worker');

dashboard.updateHealth('lh-shell', { status: 'healthy', responseTimeMs: 120 });
dashboard.updateHealth('pj-worker', { status: 'degraded', responseTimeMs: 3400 });

const alerts = dashboard.getAlerts();      // → [pj-worker]
const rollup = dashboard.getSystemHealth(); // → 'degraded'
console.log(formatHealthStatus(rollup));    // → '🟡 Degraded'
```

## Known sharp edges

Documented because they are genuine behaviours, not aspirations. They are candidates for the next
revision.

1. **`Partial<DashboardConfig>` is shallow.** Nested `alertThresholds` must be passed in full or
   `errorRate` silently disappears.
2. **`updateHealth()` on an unknown service is a silent no-op.** Combined with
   `registerService`'s `'down'` default, a typo in a service id produces a permanently-down
   phantom service rather than an error.
3. **`errorRate` is declared but unused.** `DashboardConfig.alertThresholds.errorRate` exists and
   defaults to `0.05`, but no method reads it. `ServiceHealth` carries no error-rate field either.
4. **`getStats().lastUpdated` is call-time, not data-time.** It reports when you asked, not when a
   service was last checked (that's the per-service `lastChecked`).
5. **`getSystemHealth()` treats `degraded` and `down` services identically** in its second branch —
   it can only ever return `'down'` via the zero-services case, never because a service is down.

## Design boundaries

- **In scope:** the health/status domain model (register, update, query, roll up, format).
- **Out of scope:** polling, HTTP health checks, persistence, rendering, notification delivery.
  This package never calls the network; `@learninghub/pj-client` does the talking and the caller
  feeds results in via `updateHealth`.

## Dependencies

- **Runtime:** `@learninghub/pj-client` (`workspace:*`) — the P-J HTTP client whose responses
  supply `ServiceHealth` inputs.
- **Dev:** `vitest`, `typescript`, `jsdom`.

## Governance

- Conforms to the repository's coverage ratchet policy (`docs/RULES.md`) — thresholds move only
  upward.
- Covered by the doc-coverage gate (`scripts/checks/verify-doc-coverage.mjs`), which asserts that
  the symbols listed under *Public API* above remain documented here.

## Related

- `@learninghub/cross-repo-visibility` — the metric registry this dashboard's health checks are
  typically derived from.
- `@learninghub/pj-client` — the transport that produces `ServiceHealth` observations.
- `docs/adr/022-professor-j-integration.md` — the LH ↔ P-J integration being monitored.
