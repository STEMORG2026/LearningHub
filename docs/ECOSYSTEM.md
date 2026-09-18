---
status: CANONICAL
canonical: true
owner: Architecture / Governance
last_updated: 2026-09-18
---

# STEM Ecosystem Architecture & STEMXIS Infrastructure Layer

**Version:** 3.0.0
**Status:** Active (Canonical)

> **Canonical Architectural Reference for STEM Ecosystem Relationships and Shared Infrastructure.**

---

## 1. Operating Context — STEMXIS TECHNOLOGY PVT. LTD.

The STEM ecosystem operates under the umbrella of **STEMXIS TECHNOLOGY PVT. LTD.**

The overall architecture is designed as an **ecosystem of interoperable, loosely-coupled systems**, rather than a single monolithic codebase. Each project within the ecosystem maintains strict boundaries, clear ownership, independent versioning, and well-defined contracts.

---

## 2. Comprehensive Ecosystem Hierarchy

```text
                        STEMXIS TECHNOLOGY PVT. LTD.
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
     STEM Ecosystem                                        JARVIS
  (Educational Domain)                              (Personal AI OS)
           │                                                   │
  ┌────────┴────────┬──────────────┬──────────────┐            │
  ▼                 ▼              ▼              ▼            │
LearningHub     STEM Tuition    STEM Lab      STEM Game        │
(Canonical      (Commercial     (Practical    (Gamified        │
Foundation)      Tutoring)      Experiment)   Learning)        │
  │                 │              │              │            │
  └───► Knowledge ──┴──────────────┴──────────────┘            │
            │                                                  │
            ▼                                                  │
       PROFESSOR-J ◄── Shared Infrastructure Primitives ───────┘
   (Ecosystem AI OS)

  ┌─────────────────────────────────────────────────────────────┐
  │                    ORCHESTRATION PLANE                       │
  │  LearningHub ACP Server  │  Subagent Manager  │  Agent Router│
  │         ▲                │       ▲            │      ▲       │
  │         │                │       │            │      │       │
  └─────────┼────────────────┼───────┼────────────┼──────┼───────┘
            │                │       │            │      │
       ┌────┴────┐      ┌────┴────┐  │       ┌────┴────┐ │
       │  dsh    │      │ Hermes  │  │       │ OpenCode│ │
       │  (ACP)  │      │  (ACP)  │  │       │  (ACP)  │ │
       └─────────┘      └─────────┘  │       └─────────┘ │
                                     │                     │
                                ┌────┴────┐                │
                                │  AGY    │                │
                                │  (CLI)  │                │
                                └─────────┘                │
```

---

## 3. Product & System Roster

| Project | Primary Role | Domain Boundary | Canonical Relationship |
|---------|--------------|-----------------|------------------------|
| **`LearningHub`** | Canonical Educational Foundation + **Information Head** | Knowledge schemas, simulation engines, quiz runtimes, Web Components, **integration contracts**, governance, content | Independent ecosystem foundation; governs ecosystem; delegates AI execution to PROFESSOR-J |
| **`STEM Tuition`** | Commercial Tutoring Product | 1:1, cohort, and guided tutoring services for students | Primary commercial consumer of LearningHub content |
| **`STEM Lab`** | Practical STEM Environment | Virtual laboratories, advanced experiments, hardware simulation | Future practical consumer of LearningHub simulation core |
| **`STEM Game`** | Gamified Learning Product | Educational game loops, progress quests, interactive challenges | Future interactive consumer of LearningHub quiz & physics engines |
| **`PROFESSOR-J`** | Ecosystem AI & Intelligence Layer | Socratic tutoring, agentic orchestration, AI-driven assessment | Major intelligence component; grounds AI in LearningHub/STEMMA |
| **`JARVIS`** | Personal AI OS | User-owned, general-purpose personal assistant & automation | Independent system; shares platform infrastructure with PROFESSOR-J |

---

## 4. PROFESSOR-J Architecture & Integration

**PROFESSOR-J** is the central intelligence and agentic orchestration layer for the STEM ecosystem.

```text
                             LearningHub
                                  │
                                  ▼
                 Canonical Knowledge & Content Primitives
                                  │
                                  ▼
                             PROFESSOR-J
                 (Socratic Engine & Agentic Intelligence)
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
    STEM Tuition               STEM Lab                STEM Game
 (Personalized Tutor)     (Guided Experimentation)    (Interactive NPC)
```

### Key Architectural Guidelines for PROFESSOR-J:
1. **Separation of Concerns:** LearningHub provides structured data, Web Components, and static lesson models. PROFESSOR-J provides dynamic LLM orchestration, evaluation, and adaptive dialogue.
2. **Knowledge Grounding:** PROFESSOR-J grounds all educational responses in STEMMA canonical knowledge exports (`lhs:*`) imported through LearningHub adapters.
3. **Multi-Product Orchestration:** PROFESSOR-J acts as the agentic backend for STEM Tuition, STEM Lab, and STEM Game, ensuring unified educational methodology across all downstream experiences.

---

## 5. JARVIS & Shared Infrastructure Architecture

**JARVIS** is an independent Personal AI OS. It is explicitly separated from LearningHub and the STEM ecosystem so that personal AI capabilities remain uncoupled from educational product requirements.

However, to prevent duplicated engineering across STEMXIS projects, **Shared Infrastructure** is established at the enterprise layer.

### STEMXIS Infrastructure Matrix

```text
                      STEMXIS Infrastructure Layer
                                   │
 ┌─────────────────┬───────────────┼───────────────┬─────────────────┐
 ▼                 ▼               ▼               ▼                 ▼
Identity / Auth  Observability   AI Provider     Tooling & MCP     Deployment
& Security       & Tracing       Routing         Primitives        & CI/CD
```

| Infrastructure Area | Scope & Responsibility | Shared Consumers | Isolation Boundary |
|---------------------|------------------------|------------------|--------------------|
| **Identity & Auth** | OAuth2, session validation, user tokens | `STEM Tuition`, `JARVIS`, `PROFESSOR-J` | Shared auth protocols; product user databases remain isolated |
| **Observability** | Structural tracing, performance metrics | `LearningHub` (`@learninghub/tracer`), `PROFESSOR-J`, `JARVIS` | Unified trace schema; isolated log outputs |
| **Model Provider Infra** | LLM gateway, fallback routing, cost tracking | `PROFESSOR-J`, `JARVIS` | Shared gateway; independent prompt templates and memories |
| **Agent / MCP Tooling** | Standardized tool call schemas, sandbox execution | `PROFESSOR-J`, `JARVIS`, `LearningHub` (orchestration plane) | Common tool protocol; product-specific tool registries |
| **Deployment & CI/CD** | Cloudflare Pages, GitHub Actions reusable workflows | `LearningHub`, `STEM Tuition`, `PROFESSOR-J`, `JARVIS` | Shared workflow actions (`.github/actions/`); separate deploy pipelines |
| **Shared Libraries** | Utility libraries, UI design tokens, lint rules | All projects | Shared npm/pnpm packages or templates; zero direct cross-repo imports |

---

## 6. Integration Architecture — PROFESSOR-J as Worker

**LearningHub** is the **information head**. **PROFESSOR-J** is the **worker**.

LH defines integration contracts; P-J executes AI tasks. LH frontend calls P-J backend at `/api/v1/chat` for AI execution.

### 6.1 Integration Pattern

```
┌─────────────────────────────────────────┐
│         LearningHub (Info Head)          │
│  - Knowledge schemas & content          │
│  - Governance & policies                │
│  - User features (auth, progress, etc.) │
│  - Web frontend (apps/shell)            │
│         │                               │
│         │ HTTP /api/v1/chat             │
│         ▼                               │
│  ┌─────────────────────────────────┐    │
│  │     PROFESSOR-J (Worker)        │    │
│  │  - Model routing & selection    │    │
│  │  - Subagent spawning/control    │    │
│  │  - Task classification          │    │
│  │  - Memory, tools, sessions      │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### 6.2 Integration Contract

| Concern | LearningHub | PROFESSOR-J |
|---------|-------------|-------------|
| API surface | `/api/v1/chat` consumer | `/api/v1/chat` provider |
| Auth | Session-based | API key / token |
| Events | EventBus (internal) | EventBus + ACP |
| Knowledge | STEMMA/LHS schemas | Consumes via content-provider |

### 6.3 Architectural Rules for Integration

1. **LH governs, P-J executes** — LH sets policy; P-J follows
2. **API-first integration** — All communication via documented endpoints
3. **Fallback to local** — If P-J unavailable, LH uses grounded local responses
4. **No code duplication** — Model clients, memory, tools live in P-J only

See ADR-022 for full architecture.

---

## 7. Architectural Rules for Infrastructure Sharing

1. **No Monolithic Merging:** Sharing infrastructure MUST NOT mean merging codebases or creating a single database monorepo.
2. **Explicit Interfaces & Adapters:** Projects interact with shared infrastructure solely through documented APIs, SDK adapters, or exported contracts.
3. **Product Independence:** If shared infrastructure fails or is unavailable, individual products must degrade gracefully or remain operationally isolated.
4. **No Unjustified Abstractions:** Infrastructure is shared only when there is clear engineering overlap and economic justification. Speculative platform layers MUST NOT be built prematurely.
