---
status: CANONICAL
canonical: true
owner: Architecture / Governance
last_updated: 2026-09-04
supersedes: docs/archive/historical-stem-tuition-plan.md
---

# LearningHub Ecosystem Foundation Implementation Plan (2026-Q3/Q4)

**Version:** 3.0.0
**Status:** Active (Canonical)

> **Canonical Implementation Plan for the Product-Agnostic Ecosystem Foundation.**

---

## 1. Executive Summary & Objectives

Following the strategic vision reset (`docs/VISION.md`, `docs/ECOSYSTEM.md`, `ADR-017`), this implementation plan sequences the technical work required to establish LearningHub as the canonical educational foundation for the STEM ecosystem.

### Core Objectives:
1. **Instrument Content & Simulation Engines:** Wire `@learninghub/core` EventBus and `@learninghub/tracer` observability into `@learninghub/lesson-renderer` and `@learninghub/interactive-simulations` to resolve open Phase 8 requirements.
2. **Harden Knowledge Export Contracts:** Validate `lhs-adapter` and `exports/knowledge.json` schemas for multi-consumer exports (`STEM Tuition`, `PROFESSOR-J`, `STEM Lab`, `STEM Game`).
3. **Product-Agnostic Web Shell Polish:** Ensure `apps/shell` cleanly separates platform foundation primitives from downstream consumer product showcases.
4. **Enforce Doc & Contract Governance:** Automate governance checks via `pnpm verify-governance` to prevent architectural drift or reliance on archived documents.

---

## 2. Workstreams & Priority Taxonomy

| Workstream | Scope Class | Target Package / Directory | Deliverable / Status |
|------------|-------------|----------------------------|----------------------|
| **W1: Observability & Eventing Instrumentation** | **NOW** | `@learninghub/lesson-renderer`, `@learninghub/interactive-simulations` | Instrument Web Components with Tracer spans & EventBus notifications (In Progress) |
| **W2: Knowledge Export & Adapter Hardening** | **NOW** | `packages/content-provider/`, `apps/shell/src/lib/lhs-adapter.ts` | Schema-validate export interfaces for multi-consumer use |
| **W3: Product-Agnostic Shell Realignment** | **NOW** | `apps/shell/` | Brand realignment, consumer showcase isolation |
| **W4: Automated Governance Verification** | **NOW** | `scripts/checks/verify-doc-governance.mjs` | Automated doc status & link integrity checks |

---

## 3. Workstream Execution Details

### Workstream 1: Observability & Eventing Instrumentation (NOW)
- **Target:** `packages/lesson-renderer/src/stem-lesson.ts`, `packages/interactive-simulations/src/stem-circuit-sim.ts`, `packages/interactive-simulations/src/stem-mechanics-sim.ts`
- **Actions:**
  1. Import `EventBus` from `@learninghub/core` and `Tracer` from `@learninghub/tracer`.
  2. Emit `lesson:section-rendered`, `lesson:question-answered` events on `EventBus`.
  3. Emit `simulation:step-computed`, `simulation:control-changed` events on `EventBus`.
  4. Create Tracer spans (`Tracer.startSpan()` / `Tracer.endSpan()`) during rendering and physics computations.
- **Verification:** Unit tests asserting EventBus message publishing and Tracer span generation.

### Workstream 2: Knowledge Export Seam Hardening (NOW)
- **Target:** `packages/content-provider/src/lhs-adapter.ts`, `packages/content-engine/`
- **Actions:**
  1. Verify `lhs:*` entity mapping against `STEMMA` schemas.
  2. Ensure export formats are consume-ready for `PROFESSOR-J` prompt context and `STEM Tuition` lesson views.
- **Verification:** `pnpm test --filter="@learninghub/content-provider"`.

### Workstream 3: Product-Agnostic Shell Realignment (NOW)
- **Target:** `apps/shell/`
- **Actions:**
  1. Realign app shell navigation, headers, footers, and meta tags to LearningHub identity.
  2. Present tuition offerings as a modular consumer showcase.
- **Verification:** `pnpm test:a11y` Playwright suite (32/32 tests passing).

### Workstream 4: Automated Governance & Pipeline Verification (NOW)
- **Target:** `scripts/checks/verify-doc-governance.mjs`, `package.json`
- **Actions:**
  1. Enforce machine-readable document status metadata.
  2. Run doc governance check as part of `pnpm verify-governance`.
- **Verification:** `pnpm verify-governance`.
