# Migration

**Version:** 3.0.0
**Status:** Enforced
**Owner:** Architecture
**Applies To:** All packages and apps
**Related:** `ARCHITECTURE.md`, `ROADMAP.md`, `docs/RULES.md`, `docs/adr/001-strangler-fig-migration.md`, `docs/ARCHITECTURE/overview.md`

---

## Strangler Fig Progress

The project migrates the frozen legacy monolith into `packages/*` phase by phase.
The canonical phase state lives in `.phase.json` (see `docs/RULES.md` → Release &
Versioning Governance).

```mermaid
gantt
    title Strangler Fig Migration
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Phase 0
    Foundation Setup           :done, p0, 2026-07-30, 7d

    section Phase 1
    Observability (tracer)     :p1, after p0, 7d

    section Phase 2
    Audio Synth Extraction     :p2, after p1, 7d

    section Phase 3
    Event Bus + ACL            :p3, after p2, 7d

    section Phase 4
    Quiz Engine Migration      :p4, after p3, 14d

    section Phase 5
    Hover Engine Migration     :p5, after p4, 14d

    section Phase 6
    Physics Core Migration     :p6, after p5, 21d
```

**Rules of migration:**

- New functionality MUST be created in `packages/` or `apps/`, never in `legacy/`
- `legacy/` is frozen — MAY only be modified for critical security patches
- Every migration MUST have a documented rollback plan
- See `docs/RULES.md` → Migration Protocols

## Deployment Evolution

```mermaid
flowchart LR
    subgraph NOW["Current Deployment (Static)"]
        STATIC[GitHub Pages / Any Static Host]
        STATIC -->|serves| FILES[index.html + css + js]
    end

    subgraph MID["Mid-term (With Backend)"]
        NGINX[Nginx Proxy]
        STATIC2[Static files from CDN]
        API[Fastify/Node API on port 8085]
        DB[(SQLite/Postgres)]
        NGINX --> STATIC2
        NGINX --> API
        API --> DB
    end

    subgraph FUTURE["Future (Full Platform)"]
        NGINX2[Nginx]
        SHELL2[Application Shell]
        AUTH[Auth Service]
        PROGRESS[Progress Tracking]
        QUIZ2[Quiz Engine v2]
        SIM[Simulation Engine]
        SHELL2 --> NGINX2
        AUTH --> SHELL2
        PROGRESS --> SHELL2
        QUIZ2 --> SHELL2
        SIM --> SHELL2
    end

    NOW --> MID --> FUTURE
```
