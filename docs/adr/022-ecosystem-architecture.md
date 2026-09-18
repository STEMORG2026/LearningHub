---
title: "ADR-022: Ecosystem Architecture — LearningHub as Information Head, PROFESSOR-J as Worker"
status: ACCEPTED
date: 2026-09-19
---

# ADR-022: Ecosystem Architecture — LH=head, P-J=worker

## Status

ACCEPTED

## Context

The STEM ecosystem has two primary repos:

- **LearningHub** — the canonical foundation, governance, knowledge schemas, content, pedagogy
- **PROFESSOR-J** — AI OS, orchestration plane, model routing, task execution

Previously both repos were building overlapping orchestration capabilities (model clients, memory, sessions, tools). This is redundant and creates maintenance burden.

## Decision

**LearningHub is the INFORMATION HEAD. PROFESSOR-J is the WORKER.**

### Responsibilities

| Concern | LearningHub (Head) | PROFESSOR-J (Worker) |
|---------|-------------------|---------------------|
| Knowledge schemas | ✅ Owns STEMMA/LHS entity model | ✅ Consumes via content-provider |
| Governance | ✅ CONSTITUTION, RULES, policies | ✅ Executes within governance |
| Content & Lessons | ✅ content-provider, content-engine, lesson-renderer | ❌ |
| Pedagogy | ✅ Socratic method, quiz engine, simulations | ✅ Executes tutoring tasks |
| User features | ✅ auth, progress, admin, payments, video | ❌ |
| Web frontend | ✅ apps/shell | ❌ (can have own UI later) |
| AI execution | ❌ | ✅ Model routing, LLM calls |
| Orchestration | ❌ | ✅ Subagent spawning, task routing |
| Sessions | ❌ | ✅ Fork, resume, export |
| Memory | ❌ | ✅ Hybrid BM25+Chroma |
| Tools | ❌ | ✅ Web, browser, computer-use |

### Integration Contract

```
LearningHub (frontend/apps/shell)
        │
        │ HTTP /api/v1/chat
        ▼
PROFESSOR-J (backend/app/main.py)
        │
        ├── /api/v1/chat → chat router
        ├── /api/v1/lh/ecosystem-info → LH integration
        └── /api/v1/acp → Agent Client Protocol
```

- **LH frontend** calls **P-J backend** at `/api/v1/chat`
- **P-J** routes through its orchestration plane (model selection, task routing, execution)
- **P-J** returns response to **LH** for display
- **LH** can call `/api/v1/lh/ecosystem-info` to discover topology

### Phase 9-11 in LearningHub

LH Phases 9-11 are **NOT** about building duplicate orchestration code. They are about:

- **Phase 9**: Integration contracts (API specs, event schemas, auth)
- **Phase 10**: Governance extensions (P-J task audit, content policy enforcement)
- **Phase 11**: Ecosystem tooling (monitoring, dashboards, cross-repo visibility)

## Consequences

- No duplicate model clients, memory, or orchestration code in LH
- LH focuses on knowledge, content, pedagogy, governance
- P-J focuses on AI execution, model routing, task orchestration
- Single source of truth for each concern
- Easier maintenance, clearer boundaries

## Related

- ADR-019: Agentic Orchestration Capability (Phase 9+10+11)
- ADR-020: Phase 7 Feature Packages
- ADR-021: Phase 8 Documentation & Governance Completion
- ECOSYSTEM.md §6 Orchestration Plane
