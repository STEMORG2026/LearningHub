---
status: CANONICAL
canonical: true
owner: Architecture / Governance
last_updated: 2026-09-04
---

# LearningHub — Ecosystem Vision, Purpose & Architectural Boundaries

**Version:** 3.0.0
**Status:** Active (Canonical)

> **Canonical Source of Truth for LearningHub Identity, Vision, and Scope.**

---

## 1. Executive Summary & Core Identity

**LearningHub** is an independent, product-agnostic, ecosystem-level **open STEM learning platform, knowledge infrastructure, and educational foundation**.

Historically, LearningHub evolved out of early work around STEM Tuition. Under this vision reset, **LearningHub is completely decoupled from any single commercial product**.

LearningHub provides canonical knowledge interfaces, interactive simulation engines, quiz runtimes, lesson rendering systems, content schemas, event-driven communication primitives, and observability tooling designed to power a wide spectrum of educational experiences across the broader STEM ecosystem.

```text
                        STEMXIS TECHNOLOGY PVT. LTD.
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
          STEM Ecosystem                             JARVIS
                 │                            (Independent Personal AI OS)
  ┌──────────────┼──────────────┬──────────────┐         │
  ▼              ▼              ▼              ▼         │
LearningHub  STEM Tuition    STEM Lab      STEM Game    │
(Canonical   (Commercial     (Practical    (Gamified    │
Foundation)   Tutoring)      Simulations)   Learning)   │
  │              │              │              │        │
  └──────────────┴───────┬──────┴──────────────┘        │
                         ▼                              │
                    PROFESSOR-J ◄───────────────────────┘
            (Ecosystem AI / Agent Layer)     (Shared Infrastructure)
```

---

## 2. Strategic Strategic Alignment

### 2.1 The Paradigm Shift
* **Historical Assumption (Superseded):** "LearningHub exists primarily to serve STEM Tuition."
* **Canonical Architecture (Current Truth):** "LearningHub provides canonical knowledge, educational foundations, content infrastructure, and standards that are consumed by multiple STEM products."

### 2.2 Product Agnosticism
LearningHub core must avoid embedding product-specific business logic, tuition fee schedules, local regional marketing, or single-app assumptions. Core packages in `packages/*` and app shells in `apps/*` MUST remain reusable across:
1. **STEM Tuition** — Commercial 1:1, cohort, and guided tutoring product.
2. **STEM Lab** — Practical experimental STEM simulation environment.
3. **STEM Game** — Interactive and gamified learning environment.
4. **PROFESSOR-J** — The major AI/agentic intelligence and orchestration layer of the STEM ecosystem.
5. **External / Open-Source Consumers** — Third-party educational platforms and research tools.

---

## 3. Canonical Scope & Architectural Boundaries

### 3.1 What LearningHub IS
* **Canonical Knowledge & Content Primitives:** Standards-compliant adapters (`@learninghub/content-provider`, `@learninghub/content-engine`) that ingest structured STEM facts from STEMMA exports (`lhs:*`) and produce multi-format lesson blueprints.
* **Pure Business Logic Engines:** Independent, uncoupled TypeScript libraries for physics simulation (`@learninghub/simulation-core`), quiz evaluation (`@learninghub/quiz-engine`), hover state handling (`@learninghub/hover-engine`), and Web Audio synthesis (`@learninghub/audio-synth`).
* **Framework-Agnostic Web Components:** Standard custom elements (`<stem-quiz>`, `<stem-lesson>`, `<stem-circuit-sim>`, `<stem-mechanics-sim>`) that render rich educational experiences natively in web environments.
* **Event-Driven Communication & Observability:** Strict, schema-validated EventBus primitives (`@learninghub/core`) and built-in execution tracing (`@learninghub/tracer`).
* **Agentic Orchestration Plane:** ACP server, subagent manager, and agent router that coordinate external SOTA harnesses (DeepSeek Harness, Hermes Agent, OpenCode, AGY CLI). LearningHub is the **ecosystem orchestrator** — classifying tasks and routing to the most capable subagent.

### 3.2 What LearningHub IS NOT
* **NOT a Single Tuition Website:** LearningHub is not restricted to any local tutoring center, region, or commercial fee model.
* **NOT an AI Agent Itself:** LearningHub coordinates AI agents (PROFESSOR-J, dsh, Hermes, OpenCode) but does not replace them. Socratic dialogue, LLM orchestration, and personal assistant tasks belong to **PROFESSOR-J** and other agents.
* **NOT a Personal AI OS:** LearningHub is distinct from **JARVIS**. It does not own personal user OS tasks, local system automation, or non-educational tools.
* **NOT a Monolithic Database:** LearningHub does not manage commercial user signups, payment gateways, or tutor billing. Downstream products own their commercial state.
* **NOT a Package-Level Coupling to External Agents:** LearningHub never imports from dsh/Hermes/OpenCode directly. All integration via ACP JSON-RPC.

---

## 4. Role in the STEM Ecosystem

### 4.1 Relationship to PROFESSOR-J
**PROFESSOR-J** is the major AI/agentic intelligence layer of the STEM ecosystem.
* LearningHub supplies PROFESSOR-J with canonical knowledge interfaces, lesson structures, interactive Web Components, and evaluation metrics.
* PROFESSOR-J consumes LearningHub knowledge to provide intelligent tutoring, Socratic dialogue, automated student assessment, and dynamic curriculum orchestration.
* **Boundary:** LearningHub remains pure educational infrastructure; PROFESSOR-J owns agentic intelligence.

### 4.2 Relationship to JARVIS
**JARVIS** is an independent Personal AI OS.
* JARVIS is NOT a STEM product and is developed independently.
* LearningHub MUST NOT depend on JARVIS.
* Shared infrastructure (under STEMXIS TECHNOLOGY PVT. LTD.) provides standardized identity, model provider routing, and observability primitives that both JARVIS and PROFESSOR-J utilize, maintaining clear product separation.

---

## 5. Orchestration & External Agent Integration

LearningHub operates within an ecosystem of SOTA agent harnesses. The orchestration plane coordinates these agents via the **Agent Client Protocol (ACP)**.

### 5.1 Reference Systems

| System | Architecture | Orchestration Model | Integration |
|--------|-------------|---------------------|-------------|
| **DeepSeek Harness (dsh)** | Cordis plugin framework, 50+ capability packages | In-process subagent spawning + ACP server + hooks | ACP server → `dsh --profile headless` |
| **Hermes Agent** | AIAgent class + tool registry + plugin system | `delegate_tool` + subagent lifecycle + ACP adapter | ACP client → Hermes gateway |
| **OpenCode** | TUI + headless server + web | ACP server, `serve`, session fork/import/export | ACP server → `opencode serve` |
| **AGY CLI** | Google AI agent CLI | `--print` single-shot, `--continue` session, `--sandbox` | CLI subprocess |

### 5.2 Capability Gap & Adoption Plan

| Capability | dsh | Hermes | OpenCode | AGY | LH Status | Phase |
|------------|-----|--------|----------|-----|-----------|-------|
| **ACP server** | ✅ | ✅ | ✅ | ❌ | PLANNED | 9 |
| **Subagent spawning** | ✅ | ✅ | ❌ | ❌ | PLANNED | 9 |
| **Plugin registry** | ✅ | ✅ | ❌ | ❌ | PLANNED | 9 |
| **Hooks system** | ✅ | ❌ | ❌ | ❌ | PLANNED | 9 |
| **Server entry point** | ❌ | ❌ | ❌ | ❌ | PLANNED | 9 |
| **Agent router** | ❌ | ❌ | ❌ | ❌ | PLANNED | 9 |
| **Session manager** | ✅ | ❌ | ✅ | ❌ | PLANNED | 10 |
| **Tool search** | ✅ | ✅ | ❌ | ❌ | PLANNED | 10 |
| **Sandboxed execution** | ✅ | ✅ | ❌ | ✅ | PLANNED | 10 |
| **Todo/Plan/Goal** | ✅ | ✅ | ❌ | ❌ | PLANNED | 10 |
| **Scheduling** | ✅ | ✅ | ❌ | ❌ | PLANNED | 10 |
| **Model provider clients** | ❌ | ✅ | ❌ | ❌ | FUTURE | 11 |
| **Memory system** | ❌ | ✅ | ❌ | ❌ | FUTURE | 11 |
| **Web search/fetch** | ✅ | ✅ | ✅ | ✅ | FUTURE | 11 |
| **Browser control** | ❌ | ✅ | ❌ | ❌ | FUTURE | 11 |
| **Computer use** | ❌ | ✅ | ❌ | ❌ | FUTURE | 11 |

### 5.3 Architectural Rules for Orchestration

1. **ACP-first** — Agent Client Protocol is the lingua franca for agent-to-agent communication
2. **No package-level coupling** — LearningHub never imports from dsh/Hermes/OpenCode directly
3. **Subagent delegation** — Complex tasks are classified and routed to the most capable subagent
4. **Graceful degradation** — If no subagent is available, fall back to local execution
5. **Sandboxed by default** — All child agent execution runs through bubblewrap/E2B
6. **Status honesty** — Distinguish existing / planned / possible capabilities

1. **Strict Decoupling:** Packages in `packages/*` MUST NOT import each other directly (except shared primitives in `core` and `tracer`). Communication occurs strictly via `EventBus.publish()` and `EventBus.subscribe()`.
2. **Business Logic Purity:** Business logic must consist of pure TypeScript functions without direct DOM or browser global dependencies (`window`, `document`).
3. **Educational Fitness Functions:** Every feature must explicitly target learning impact, misconception correction, or conceptual clarity.
4. **Machine-Readable Governance:** All documentation must adhere to machine-readable status headers (`status: CANONICAL | SUPERSEDED | HISTORICAL | FUTURE_PROPOSAL | ARCHIVED`) to ensure safety and prevent AI agent context contamination.
