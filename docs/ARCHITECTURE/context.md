# System Context (C4 Level 1)

**Version:** 3.0.0
**Status:** Enforced
**Owner:** Architecture
**Applies To:** All packages and apps
**Related:** `ARCHITECTURE/README.md`, `RULES.md`, `docs/ARCHITECTURE/overview.md`

---

## Context

STEM-TUITION is a modular STEM education platform. Users access it through a
browser; the platform is served statically today and may gain a backend over time.

```mermaid
flowchart TB
    subgraph USER["User"]
        B[Browser]
    end

    subgraph SHELL["apps/shell/"]
        direction TB
        R[Router/index.html]
        R -->|legacy route| L
        R -->|modern route| M
    end

    subgraph LEGACY["legacy/ (Frozen v1.0.0)"]
        direction TB
        L[index.html]
        L --> CSS[css/main.css]
        L --> JS1[js/stem-effects.js]
        L --> JS2[js/stem-quiz.js]
        L --> JS3[js/stem-pioneers.js]
        L --> JS4[js/main.js]
    end

    subgraph ACL["packages/acl/"]
        direction TB
        A1[QuizAdapter]
        A2[CanvasAdapter]
    end

    subgraph MODERN["packages/ (New Modules)"]
        direction TB
        CORE[core/ EventBus]
        TR[tracer/ Observability]
        AS[audio-synth/]
        QE[quiz-engine/]
        HE[hover-engine/]
        SC[simulation-core/]
    end

    B -->|HTTP Request| SHELL
    L -.->|wrapped by| ACL
    ACL -->|talks via| CORE
    MODERN -->|publish/subscribe| CORE
    MODERN -->|instrumented by| TR
```

**External systems:** none required at runtime today. Static hosting (GitHub
Pages / any static host) serves the built assets. See `migration.md` for the
planned backend evolution.
