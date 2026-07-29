# 🧬 LearningHub STEM: Architecture Charter & Developer Constitution

> **Status:** 🟢 Active Evolution (Strangler Fig Pattern)  
> **Version:** 2.0.0 (Ecosystem Edition)  
> **Mission:** Transform STEM Tuition into the foundational bounded context of the LearningHub STEM ecosystem.  
> **Last Updated:** 2026-07-29  
> **Current Date:** 2026-07-29

---

## ⚠️ CRITICAL GOVERNANCE DIRECTIVES

**READ THIS BEFORE WRITING A SINGLE LINE OF CODE.**

This repository is no longer a static website. It is a **living modular monolith** evolving into a multi-app ecosystem. All contributions must adhere to the following **Non-Negotiable Regulations**.

### 🚫 The "Iron Law" of Legacy
1. **Legacy is Read-Only:** The `legacy/` directory contains the frozen v1.0.0 monolith. **NO DIRECT MODIFICATIONS** are permitted.
2. **Strangler Fig Only:** New functionality must be built in `packages/` or `apps/` and routed around legacy code.
3. **Reversibility:** Every migration step must be revertible within 15 minutes without data loss or downtime.
4. **Adapter Pattern:** Communication between Legacy and Modern modules MUST occur through defined Anti-Corruption Layers (ACLs). Direct imports from `legacy/` into `packages/` are **forbidden**.

### 🎓 Educational Integrity Mandate
Code is not just logic; it is pedagogy. Every feature must pass the **Educational Fitness Function**:
- Does this visualize a concept clearly?
- Does it address a specific student misconception?
- Is the interaction meaningful or just decorative?
- **If it doesn't improve learning, it doesn't ship.**

---

## 🏗️ Ecosystem Architecture

```mermaid
graph TD
    subgraph "LearningHub STEM Ecosystem"
        direction TB
        Shared[Shared Kernel Packages]
        App1[STEM Tuition (Active)]
        App2[STEM Notes (Future)]
        App3[STEM Sims (Future)]
        
        Shared -->|Consumes| App1
        Shared -->|Consumes| App2
        Shared -->|Consumes| App3
    end
    
    subgraph "Shared Kernel"
        UI[ui-core: Design Tokens & Components]
        Logic[learning-engine: Quiz & Progress]
        Sim[simulation-core: Physics & Math]
        Data[analytics-client: Event Schema]
        Auth[auth-adapter: Identity Interface]
    end
    
    subgraph "Legacy Zone (Frozen)"
        Mono[legacy/: v1.0.0 Monolith]
    end
    
    App1 -.->|Strangler Fig Pattern| Mono
```

### Directory Structure Regulations
```text
/
├── apps/
│   └── stem-tuition/          # The active application entry point
├── packages/                  # SHARED KERNEL (Framework Agnostic)
│   ├── ui-core/               # Design tokens, base components
│   ├── ui-stem/               # STEM-specific visualizations
│   ├── learning-engine/       # Pure TS logic for quizzes, spacing repetition
│   ├── simulation-core/       # Canvas/WebGL abstractions
│   ├── analytics-client/      # Typed event emitters
│   └── auth-adapter/          # Interface for future shared auth
├── legacy/                    # FROZEN ZONE (Read-Only)
│   ├── index.html
│   ├── js/stem-effects.js
│   └── css/styles.css
├── docs/
│   └── adr/                   # Architecture Decision Records
└── README.md                  # THIS FILE
```

---

## 🤖 AI AGENT & DEVELOPER PROTOCOLS

**All AI agents and human developers MUST execute this pre-flight checklist before generating code.**

### ✅ Phase 1: Architectural Compliance
- [ ] **Location Check:** Am I writing in `packages/` (new) or `legacy/` (forbidden)?
- [ ] **Dependency Check:** Does this introduce a circular dependency? (Run `pnpm lint:arch`)
- [ ] **Boundary Check:** Is business logic leaking into the DOM layer?
- [ ] **Interface Check:** If touching legacy, am I using an Adapter/ACL?

### ✅ Phase 2: Educational Fitness
- [ ] **Concept Clarity:** What specific STEM concept does this teach?
- [ ] **Prerequisites:** Are required prior knowledge states handled?
- [ ] **Misconceptions:** Does this actively prevent common student errors?
- [ ] **Accessibility:** Is this usable by screen readers and keyboard-only users? (WCAG 2.2 AA)

### ✅ Phase 3: Code Quality (SOTA Standards)
- [ ] **Type Safety:** Is TypeScript `strict` mode satisfied? (No `any`, no implicit `unknown`)
- [ ] **Immutability:** Are we avoiding global mutable state?
- [ ] **Performance:** Are we using passive listeners, RAF for animations, and memoization?
- [ ] **Test Coverage:** Are there unit tests covering >90% of logic branches?

---

## 🛠️ Technology Stack & Standards

We prioritize **stability, performance, and framework agnosticism** over hype.

| Domain | Technology | Rationale |
|--------|------------|-----------|
| **Package Manager** | `pnpm` + Workspaces | Strict dependency isolation, disk efficiency. |
| **Build Tool** | `Turborepo` | High-performance caching for modular monolith. |
| **Language** | `TypeScript 5.4+` (Strict) | Type safety as a fitness function. |
| **Styling** | Modern CSS + Tokens | Container queries, `:has()`, CSS variables. No CSS-in-JS runtime overhead. |
| **State Mgmt** | `Signals` / `Zustand` | Minimal reactivity, no heavy boilerplate. |
| **Testing** | `Vitest` + `Playwright` | Fast unit tests, reliable E2E browser automation. |
| **Graphics** | `WebGL 2.0` / `WebGPU` | Via `simulation-core` abstraction for future-proofing. |
| **Data Layer** | `JSON-LD` + `Zod` | Structured data for AI knowledge graphs; runtime schema validation. |
| **AI Interface** | Standardized Prompts | Decoupled LLM interface for future RAG integration. |

### 🚫 Forbidden Technologies
- **No jQuery:** Legacy only.
- **No Global CSS Files:** All styling must be scoped or token-based.
- **No `eval()` or `Function()`:** Security violation.
- **No Direct DOM Manipulation in Logic:** Business logic must be pure.

---

## 🧪 Automated Fitness Functions

These checks run on every commit. **Failure blocks merge.**

1. **`lint:arch`**: Detects circular dependencies and forbidden imports (e.g., `packages/*` importing `legacy/*`).
2. **`test:coverage`**: Enforces 90% line coverage on `packages/`.
3. **`build:size`**: Warns if any module exceeds 50KB (gzipped).
4. **`validate:edu`**: Scans for missing educational metadata in learning modules.
5. **`a11y:audit`**: Runs axe-core on all interactive elements.

```bash
# Run full governance check
pnpm run verify-governance
```

---

## 📝 Contribution Workflow

1. **Identify Seam:** Locate the Strangler Fig insertion point.
2. **Create Package/Module:** Build new logic in `packages/`.
3. **Develop Adapter:** Create an ACL if legacy interaction is needed.
4. **Write Tests:** Unit tests for logic, E2E for user flows.
5. **Run Governance:** Execute `pnpm run verify-governance`.
6. **Document:** Update `docs/adr/` if architecture changes.
7. **Submit:** PR with "Educational Impact" and "Architectural Strategy" sections.

---

## 📜 License & Ethics

- **License:** MIT (Code), CC-BY-NC-SA (Educational Content)
- **Ethics:** Student data privacy is paramount. No PII leaves the client without explicit encryption and consent. AI features must be "Human-in-the-Loop" by design.

---

## 🚀 Getting Started

```bash
# Install dependencies (strict lockfile)
pnpm install

# Start development server (Turborepo)
pnpm dev

# Run all fitness functions
pnpm verify-governance

# Initialize a new module (scaffold)
pnpm gen:module my-new-simulation
```

> **Remember:** We are not building a website. We are building the **operating system for STEM education**. Every line of code must reflect that ambition.

---

*Approved by: Chief Software Architect*  
*Date: 2026-07-29*  
*Status: ENFORCED*  
*Next Review: 2026-08-29 (Monthly Architecture Review)*
