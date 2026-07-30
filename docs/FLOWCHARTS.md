# STEM-TUITION Flowcharts

**Version:** 3.0.0
**Purpose:** Visual diagrams of architecture, data flow, and module connections

---

## 1. System Architecture (High Level)

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

---

## 2. Module Dependency Graph

```mermaid
flowchart LR
    subgraph CORE["Shared Kernel"]
        EB[core/ EventBus]
        TR[tracer/]
    end

    subgraph ACL["Adapters"]
        QA[acl/ QuizAdapter]
        CA[acl/ CanvasAdapter]
    end

    subgraph MODULES["New Modules"]
        AS[audio-synth/]
        QE[quiz-engine/]
        HE[hover-engine/]
        SC[simulation-core/]
    end

    subgraph LEGACY2["Legacy Zone"]
        LQ[legacy quiz code]
        LC[legacy canvas code]
    end

    QA -->|wraps| LQ
    CA -->|wraps| LC
    QA <-->|events| EB
    CA <-->|events| EB
    AS <-->|events| EB
    QE <-->|events| EB
    HE <-->|events| EB
    SC <-->|events| EB

    QE -.->|depends| EB
    AS -.->|depends| EB
    HE -.->|depends| EB
    SC -.->|depends| EB

    TR -.->|instruments| QE
    TR -.->|instruments| AS
    TR -.->|instruments| HE
    TR -.->|instruments| SC
    TR -.->|instruments| QA
    TR -.->|instruments| CA
```

---

## 3. Strangler Fig Migration Progress

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

---

## 4. Data Flow: User Takes a Quiz

```mermaid
sequenceDiagram
    participant Browser
    participant Shell as apps/shell
    participant Quiz as packages/quiz-engine
    participant Audio as packages/audio-synth
    participant Tracer as packages/tracer
    participant EventBus as packages/core

    Browser->>Shell: Navigate to /quiz/newtons-law
    Shell->>Shell: Check feature flag
    Shell->>EventBus: publish nav:page-changed
    Shell->>Quiz: Load <stem-quiz> Web Component

    Quiz->>Tracer: startSpan('quiz:load')
    Quiz->>EventBus: publish quiz:started
    Quiz->>Quiz: Render questions

    Browser->>Quiz: Click answer "F = ma"
    Quiz->>Tracer: startSpan('quiz:check-answer')
    Quiz->>Quiz: validate answer
    Quiz->>Quiz: calculate score
    Quiz->>EventBus: publish quiz:answer-submitted
    Quiz->>Tracer: endSpan('quiz:check-answer') 8ms

    EventBus-->>Audio: quiz:answer-submitted
    Audio->>Tracer: startSpan('audio:play')
    Audio->>Audio: playCorrectSound()
    Audio->>Tracer: endSpan('audio:play') 25ms

    Quiz->>Quiz: Show result & feedback
    Quiz->>EventBus: publish quiz:completed
```

---

## 5. ACL Communication Pattern

```mermaid
flowchart TB
    subgraph Legacy["Legacy Code (stem-quiz.js)"]
        GF[Global Function:\nwindow.checkAnswer()]
        GM[Global State:\nwindow.currentScore]
    end

    subgraph Adapter["ACL Adapter (packages/acl/)"]
        WR[Wrapper:\nLegacyQuizAdapter]
        EV[Translator: convert\nlegacy format → modern format]
    end

    subgraph Modern["New Code (quiz-engine)"]
        WC[<stem-quiz> Web Component]
        EV2[TypeScript class:\nQuizEngine]
    end

    subgraph Bus["Event Bus"]
        EB[pub/sub]
    end

    WC -->|observedAttributes| EV2
    EV2 -->|CustomEvent + EB| EB
    EB -->|adapter subscribes| WR
    WR -->|calls| GF
    WR -->|reads| GM
    WR -->|translates result| EV
    WR -->|publishes via| EB
    EB -->|modern code receives| EV2
```

### 5.1 Step-by-step ACL flow

1. User clicks answer in the new `<stem-quiz>` component
2. New `QuizEngine` validates locally (pure logic)
3. If it needs legacy data (e.g., old quiz data format), it publishes an event
4. `LegacyQuizAdapter` (in `packages/acl/`) subscribes, calls the legacy global function
5. Adapter translates the legacy result into the modern format
6. Adapter publishes the result back through the Event Bus
7. Modern `QuizEngine` receives it, continues processing

---

## 6. Component Lifecycle

```mermaid
flowchart LR
    subgraph Browser["Browser"]
        HTML[HTML parsed]
        DEFINE[customElements.define]
    end

    subgraph Lifecycle["Component Lifecycle"]
        CON[constructor\nattachShadow]
        CONN[connectedCallback\nrender + listeners]
        ATT[attributeChangedCallback\nupdate + re-render]
        DIS[disconnectedCallback\ncleanup]
    end

    HTML -->|element found| DEFINE
    DEFINE -->|element in DOM| CON
    CON --> CONN
    CONN -->|attribute changes| ATT
    ATT -->|still in DOM| CONN
    CONN -->|removed from DOM| DIS
    DIS -->|element dead| END[Garbage Collected]
```

---

## 7. Trace Waterfall (Live Debugging View)

```
┌──────────────────────────────────────────────────────┐
│  TRACE: quiz:answer-submitted (45ms)                  │
│  ┌─ quiz-engine:validate-answer ............. 2ms     │
│  ├─ quiz-engine:check-answer ................ 8ms     │
│  ├─ quiz-engine:calculate-score ............. 3ms     │
│  ├─ event-bus:publish ....................... 1ms     │
│  ├─ audio-synth:play-correct-sound ......... 25ms    ◄── SLOW
│  └─ ═══════════════════════════════════════ 39ms     │
│                                                       │
│  SLOWEST: audio-synth:play-correct-sound (25ms)       │
│  Can we optimize? → Consider pre-loading audio        │
└──────────────────────────────────────────────────────┘
```

This is visible in the browser console when `?trace=true` is enabled, or in the floating Tracer Dashboard panel.

---

## 8. Deployment Evolution

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

---

## 9. CI/CD Pipeline

```mermaid
flowchart TB
    subgraph DEV["Developer pushes code"]
        GIT[git push origin main]
    end

    subgraph CI["GitHub Actions"]
        CHECKOUT[Checkout]
        SETUP[Setup pnpm + Node]
        INSTALL[pnpm install]
        LINT[pnpm lint:arch]
        TYPECHECK[pnpm typecheck]
        TEST[pnpm test:coverage]
        A11Y[pnpm a11y:audit]
        SIZE[pnpm build:size]
        EDU[pnpm validate:edu]
    end

    subgraph RESULT["Outcome"]
        PASS[All green ✅]
        FAIL[Block merge ❌]
    end

    GIT --> CHECKOUT
    CHECKOUT --> SETUP
    SETUP --> INSTALL
    INSTALL --> LINT
    LINT --> TYPECHECK
    TYPECHECK --> TEST
    TEST --> A11Y
    A11Y --> SIZE
    SIZE --> EDU
    EDU --> PASS
    EDU -.->|any failure| FAIL

    PASS --> CHANGESET[Auto-create version bump]
    CHANGESET --> PUBLISH[Create release tag]
```
