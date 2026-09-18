---
title: "ADR-017: Product-Agnostic Ecosystem Foundation & Architectural Realignment"
status: ACCEPTED
date: 2026-09-18
last_updated: 2026-09-18
canonical: true
---

# ADR-017: Product-Agnostic Ecosystem Foundation & Architectural Realignment

---
status: ACCEPTED
canonical: true
date: 2026-09-04
supersedes: N/A (updates product identity across repository)
related: docs/VISION.md, docs/ECOSYSTEM.md, docs/CONSTITUTION.md, docs/RULES.md
---

## Status
Accepted

## Context
LearningHub originally evolved around STEM Tuition as a single local tuition platform. As the project matured, this historical coupling became restrictive. The repository retained legacy Pokhara tuition marketing prose, single-product assumptions, and stale roadmaps that implied LearningHub existed solely to serve STEM Tuition.

With the expansion of the broader STEM ecosystem (including STEM Tuition, STEM Lab, STEM Game, PROFESSOR-J, and JARVIS under STEMXIS TECHNOLOGY PVT. LTD.), LearningHub required a formal vision reset to establish its canonical identity as an independent, product-agnostic educational foundation.

## Decision
1. **Decouple LearningHub from STEM Tuition:** LearningHub is re-established as an independent, product-agnostic STEM learning platform, knowledge infrastructure, and educational foundation.
2. **Recognize Downstream Consumers:** LearningHub core packages (`packages/*`) and app primitives (`apps/*`) will serve multiple consumers: STEM Tuition, STEM Lab, STEM Game, PROFESSOR-J, and open-source external applications.
3. **Establish Clear Ecosystem Boundaries:**
   - **LearningHub:** Provides canonical knowledge interfaces (grounded in STEMMA), pure simulation/quiz engines, Web Components, EventBus primitives, and tracing.
   - **PROFESSOR-J:** Serves as the major AI/agentic intelligence layer, providing Socratic tutoring, automated assessment, and multi-product orchestration.
   - **JARVIS:** Operates as an independent Personal AI OS, sharing STEMXIS platform infrastructure (auth, tracing, model routes) with PROFESSOR-J without direct product coupling.
4. **Establish Archival Governance:** Implement machine-readable metadata tags (`status: CANONICAL | SUPERSEDED | HISTORICAL | FUTURE_PROPOSAL | ARCHIVED`) and a dedicated `docs/archive/` structure to preserve project memory without context contamination for human developers or AI coding agents.

## Consequences

### Positive
* Enables multi-product reusability across the STEM ecosystem.
* Cleans up legacy product assumptions and Pokhara tuition marketing from framework code.
* Provides AI coding agents with a single, unambiguous canonical truth.
* Preserves historical decision records and migration plans cleanly in `docs/archive/`.

### Negative
* Requires updating documentation, headers, metadata, and test assertions across the repository.

### Neutral
* Downstream products (such as STEM Tuition) consume LearningHub via explicitly versioned adapters.
