---
status: CANONICAL
canonical: true
owner: Architecture / Governance
last_updated: 2026-09-04
---

# 📐 LearningHub: Technical Rules & Coding Standards

> **Version:** 3.0.0 (Governance Entry Point)
> **Status:** 🔒 ENFORCED
> **Owner:** Architecture
> **Applies To:** All developers, AI agents, and contributors
> **Related:** `VISION.md` · `ECOSYSTEM.md` · `CONSTITUTION.md` · `policies/API_CONTRACT.md` · `policies/OBSERVABILITY.md` · `policies/DEPENDENCY_POLICY.md` · `policies/RELIABILITY.md` · `policies/VERSIONING.md` · `policies/EVENT_BUS_CONTRACT.md` · `policies/PACKAGE_LIFECYCLE.md` · `policies/PACKAGE_METADATA.md` · `REPOSITORY_HEALTH.md` · `DOCS.md` · `docs/adr/README.md` · `docs/ARCHITECTURE/`

---

## 🎯 Purpose

This document is the **governance entry point** for LearningHub. It defines the
**principles**, the **mandatory rules**, and the **enforcement** of all code
written in the project. Detail policies live in dedicated documents (linked under
**Related** and in the References section); RULES.md summarizes them and points to
the source of truth — it never duplicates policy text.

These rules are non-negotiable and must be followed to maintain architectural
integrity, educational quality, and long-term maintainability.

**Violation of these rules will result in automatic PR rejection.**

### Governance Philosophy

This project is **open-source and contributor-friendly**. Governance is light and
deterministic:

- ❌ No enterprise frameworks (TOGAF, COBIT, ITIL)
- ❌ No Architecture Review Boards or heavyweight approval workflows
- ❌ No ceremony for ceremony's sake
- ✅ "Architect review" means **one named maintainer** approves the PR/ADR
- ✅ Rules are written to be **enforced automatically** wherever possible
- ✅ Policy detail lives in one document only — never duplicated

---

## 🏗️ ARCHITECTURE PRINCIPLES

Long-lived principles that all rules derive from. A rule MUST trace to at least
one principle (see the `**Principles:**` annotations on the Architectural Rules).

| Principle | Meaning |
|-----------|---------|
| **Interface First** | Define public contracts before implementation |
| **Explicit Dependencies** | Dependencies are declared, versioned, and deliberate |
| **Loose Coupling** | Modules communicate through contracts, not direct coupling |
| **Single Responsibility** | One clear responsibility per package/module/file |
| **Composition over Inheritance** | Build behavior by composing, not subclassing |
| **Deterministic Behaviour** | Same input ⇒ same output, everywhere, every time |
| **Fail Fast** | Detect and surface invalid state early |
| **Immutable Public Contracts** | Accepted contracts change by addition or deprecation, never in place |
| **Observability First** | New code is instrumentable from day one |
| **Progressive Migration** | Strangler Fig: migrate incrementally, reversibly |
| **Simplicity Before Cleverness** | Prefer the simplest correct solution |

---

## 🎯 QUALITY ATTRIBUTES

The primary architectural quality attributes. Each rule supports at least one
attribute (see the `**Quality:**` annotations on the Architectural Rules).

| Attribute | Meaning |
|-----------|---------|
| **Maintainability** | Easy to understand, modify, and extend |
| **Reliability** | Behave correctly under load, failure, and time |
| **Extensibility** | Add capabilities without altering existing contracts |
| **Testability** | Logic testable without a browser or network |
| **Performance** | Meets explicit budgets (`policies/PERFORMANCE.md`) |
| **Accessibility** | WCAG 2.2 AA (`policies/ACCESSIBILITY.md`) |
| **Educational Accuracy** | Content is pedagogically correct (`EDUCATIONAL` registry) |
| **Security** | Safe against common web threats (`policies/SECURITY.md`) |
| **Observability** | Instrumentable, diagnosable in production |
| **Portability** | Runs in any supported browser/runtime (`policies/VERSIONING.md` → Compatibility) |

---

## 🏛️ ARCHITECTURAL RULES

### Rule 1: Legacy Isolation (CRITICAL)
```typescript
// ❌ FORBIDDEN: Direct import from legacy
import { legacyFunction } from '../legacy/js/stem-effects.js';

// ✅ REQUIRED: Use Anti-Corruption Layer
import { PhysicsAdapter } from '@learninghub/acl';
```

**Rationale:** Prevents legacy coupling from spreading into new modules.  
**Principles:** Progressive Migration · Loose Coupling · Explicit Dependencies  
**Quality:** Maintainability · Reliability  
**Enforcement:** `pnpm lint:arch` blocks builds with violations.

### Rule 2: Business Logic Purity
```typescript
// ❌ FORBIDDEN: DOM manipulation in business logic
class QuizEngine {
  checkAnswer() {
    document.querySelector('.result').innerText = 'Correct!'; // VIOLATION
  }
}

// ✅ REQUIRED: Pure logic, return values only
class QuizEngine {
  checkAnswer(studentAnswer: string, correctAnswer: string): boolean {
    return studentAnswer === correctAnswer;
  }
}
```

**Rationale:** Enables testing without DOM, supports multiple UI frameworks.  
**Principles:** Interface First · Testability · Loose Coupling  
**Quality:** Testability · Maintainability · Portability  
**Enforcement:** `pnpm lint:dom` (ESLint `no-restricted-properties`, scoped to pure-logic packages) blocks violations.

### Rule 3: No Global Mutable State
```typescript
// ❌ FORBIDDEN: Global mutable state
let currentGrade = 10;
window.userProgress = {};

// ✅ REQUIRED: Encapsulated state (module-level singleton with guard)
let defaultInstance: EventBus | null = null;
export function getDefaultEventBus(): EventBus {
  if (!defaultInstance) {
    defaultInstance = new EventBus();
  }
  return defaultInstance;
}
```

**Rationale:** Prevents race conditions, enables deterministic behaviour.  
**Principles:** Deterministic Behaviour · Fail Fast  
**Quality:** Reliability · Testability  
**Enforcement:** `pnpm lint:state` (ESLint `no-restricted-globals: window/globalThis`, scoped to pure-logic packages) blocks violations.

### Rule 4: Interface-First Development
```typescript
// ✅ REQUIRED: Define interfaces before implementation
interface ISimulation {
  init(): void;
  update(deltaTime: number): void;
  render(): void;
  destroy(): void;
}

interface IQuizQuestion {
  id: string;
  concept: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  commonMisconceptions: string[];
}
```

**Rationale:** Ensures loose coupling, enables mock testing.  
**Principles:** Interface First · Immutable Public Contracts  
**Quality:** Maintainability · Extensibility · Testability  
**Enforcement:** Code review checklist + public-contract governance (`policies/API_CONTRACT.md`).

### Rule 5: Strangler Fig Compliance
- New functionality MUST be created in `packages/` or `apps/`
- Legacy code MAY ONLY be modified for critical security patches
- Every migration MUST have a rollback plan documented in the PR

**Principles:** Progressive Migration · Fail Fast  
**Quality:** Maintainability · Reliability  
**Enforcement:** Review checklist (`docs/RULES.md` → Migration Protocols).

---

## 💻 CODING STANDARDS

### TypeScript Configuration (STRICT MODE)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": false,
    "verbatimModuleSyntax": true
  }
}
```

### Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `quiz-engine.ts` |
| Classes | PascalCase | `QuizEngine` |
| Functions | camelCase | `calculateScore` |
| Constants | UPPER_SNAKE_CASE | `MAX_ATTEMPTS` |
| Interfaces | IPascalCase | `IQuizQuestion` |
| Types | PascalCase | `QuestionType` |
| Private members | `#` prefix | `#internalState` |
| Test files | `*.test.ts` | `quiz-engine.test.ts` |

### File Organization
```typescript
// ✅ CORRECT: Single responsibility per file
// packages/learning-engine/src/quiz-validator.ts
// packages/learning-engine/src/quiz-scorer.ts
// packages/learning-engine/src/quiz-analytics.ts

// ❌ WRONG: God files
// packages/learning-engine/src/quiz-everything.ts
```

**Maximum file size:** 500 lines (excluding tests and comments) — review-checklist
item (this is not automated; `pnpm lint:size` enforces bundle size, not file size).

### Documentation Requirements
```typescript
/**
 * Calculates gravitational force between two bodies
 * 
 * @param m1 - Mass of first body in kg
 * @param m2 - Mass of second body in kg
 * @param r - Distance between centers in meters
 * @returns Force in Newtons
 * 
 * @educationalConcept newtons-law-of-universal-gravitation
 * @prerequisites algebra,vectors
 * @misconceptions heavier-objects-fall-faster
 * @gradeLevel 9-12
 * 
 * @example
 * const force = calculateGravity(5.97e24, 70, 6.371e6);
 * console.log(force); // ~687 N
 * 
 * @see https://learninghub.stem/concepts/gravity
 */
export function calculateGravity(m1: number, m2: number, r: number): number {
  const G = 6.674e-11;
  return G * ((m1 * m2) / (r * r));
}
```

---

## 🎨 CSS & STYLING RULES

### Design Token Usage (MANDATORY)
```css
/* ❌ FORBIDDEN: Hardcoded values */
.card {
  padding: 16px;
  color: #3b82f6;
  border-radius: 8px;
}

/* ✅ REQUIRED: Use design tokens */
.card {
  padding: var(--space-4);
  color: var(--color-primary-500);
  border-radius: var(--radius-md);
}
```

### Required Design Tokens
All packages MUST use these token categories:
```css
:root {
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  /* ... */
  
  /* Colors */
  --color-primary-500: oklch(0.623 0.214 259.815);
  --color-success-500: oklch(0.723 0.219 149.579);
  /* ... */
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  /* ... */
  
  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  /* ... */
}
```

### Component Scoping
```css
/* ✅ REQUIRED: BEM or data attributes for scoping */
[data-component="quiz-card"] {
  /* styles */
}

.quiz-card__question {
  /* styles */
}

.quiz-card__answer--selected {
  /* styles */
}
```

### Modern CSS Features (Preferred)
- ✅ Container Queries (`@container`)
- ✅ `:has()` selector
- ✅ CSS Custom Properties
- ✅ `clamp()` for responsive sizing
- ✅ `oklch()` color space
- ✅ `@layer` for cascade management
- ❌ Preprocessor mixins (use native CSS instead)
- ❌ `!important` (except for utility classes)

### Accessibility in CSS
```css
/* ✅ REQUIRED: Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ✅ REQUIRED: Focus indicators */
button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

> Accessibility-in-CSS is one facet of `Rule EDU-4` / `policies/ACCESSIBILITY.md` — the two
> are complementary, not duplicates. Keep both in sync with `docs/policies/ACCESSIBILITY.md`.

---

## 🧪 TESTING REQUIREMENTS

### Coverage Thresholds (ENFORCED)

> **The enforceable gate is the per-package coverage ratchet, not the table below.**
> The table records the *target* for **new** core-logic modules; the machine-checked
> floor is each package's own `vitest.config.*.ts` `thresholds` (published in
> `docs/REPOSITORY_HEALTH.md`) and is enforced by `pnpm test:coverage`. Existing
> packages ratchet *upward* from their current baseline (e.g. `tracer` 34%,
> `quiz-engine` 66%) — they are never retroactively held to 95% in a single step.
> See **Coverage Ratchet** in the enforcement-chain table below.

| Module Type | Line Coverage | Branch Coverage | Action on Fail |
|-------------|---------------|-----------------|----------------|
| Core Logic (new modules) | ≥95% | ≥90% | Block merge |
| UI Components | ≥90% | ≥85% | Block merge |
| Adapters | ≥95% | ≥95% | Block merge |
| E2E Flows | Critical paths only | N/A | Warning |

### Test Structure
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('QuizEngine', () => {
  let engine: QuizEngine;

  beforeEach(() => {
    engine = new QuizEngine();
  });

  describe('checkAnswer()', () => {
    it('should return true for correct answer', () => {
      expect(engine.checkAnswer('42', '42')).toBe(true);
    });

    it('should handle case-insensitive matches', () => {
      expect(engine.checkAnswer('newton', 'Newton')).toBe(true);
    });

    it('should identify common misconceptions', () => {
      const result = engine.analyzeMisconception('F = mv');
      expect(result.type).toBe('confuses_momentum_force');
    });
    
    it('should not leak state between calls', () => {
      engine.checkAnswer('wrong', 'correct');
      const freshResult = engine.checkAnswer('right', 'right');
      expect(freshResult.isFirstAttempt).toBe(true);
    });
  });
});
```

### Educational Test Cases (MANDATORY)
Every learning module test MUST include:
1. ✅ Correct path validation
2. ✅ Common misconception detection
3. ✅ Edge case handling
4. ✅ Accessibility verification
5. ✅ State isolation verification

### E2E Testing with Playwright
```typescript
import { test, expect } from '@playwright/test';

test('student can complete quiz flow', async ({ page }) => {
  await page.goto('/quiz/newton-laws');
  
  // Verify accessibility
  await expect(page.locator('main')).toHaveAttribute('aria-label');
  
  // Complete quiz
  await page.click('[data-answer="a"]');
  await page.click('button:has-text("Submit")');
  
  // Verify feedback
  await expect(page.locator('[data-feedback]')).toBeVisible();
  
  // Verify analytics event
  const analyticsEvent = await page.waitForEvent('analytics');
  expect(analyticsEvent.type).toBe('quiz_completed');
});
```

---

## 🎓 EDUCATIONAL FITNESS RULES

### Rule EDU-1: Concept Clarity
Every interactive element MUST have structured metadata:
```html
<div 
  data-component="simulation"
  data-concept="newtons-law-of-gravitation"
  data-prerequisites="force,mass,distance"
  data-misconceptions="heavier-faster,gravity-needs-air"
  data-grade-level="9,10,11,12"
  data-estimated-time="5min">
</div>
```

### Rule EDU-2: Worked Examples First
Interactive simulations MUST provide:
1. **Static explanation** (What is this?)
2. **Worked example** (How does it work?)
3. **Guided practice** (Try with hints)
4. **Independent practice** (No hints)

### Rule EDU-3: Misconception Addressing
```typescript
interface ILearningModule {
  concept: string;
  commonMisconceptions: Array<{
    id: string;
    description: string;
    correctionStrategy: string;
    diagnosticQuestion: string;
  }>;
}
```

### Rule EDU-4: Accessibility First
- All interactive elements MUST be keyboard navigable
- All visual information MUST have text alternatives
- Color alone CANNOT convey meaning
- Animations MUST respect `prefers-reduced-motion`
- Reading level MUST be appropriate for target grade

> **Full standard:** `docs/policies/ACCESSIBILITY.md` — WCAG 2.2 AA, component-specific requirements, audit process.

### Rule EDU-5: AI Assistance Guidelines
- AI MUST NOT replace student thinking
- AI hints MUST be Socratic (guiding questions, not answers)
- AI explanations MUST cite sources
- AI MUST disclose uncertainty

---

## 🔒 SECURITY RULES

### Input Validation (MANDATORY)
```typescript
// ✅ REQUIRED: Validate all inputs with Zod
import { z } from 'zod';

const QuestionSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(10).max(500),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3)
});

// Never trust user input
function processAnswer(rawInput: unknown) {
  const validated = QuestionSchema.safeParse(rawInput);
  if (!validated.success) {
    throw new SecurityError('Invalid input structure');
  }
  return validated.data;
}
```

### XSS Prevention
```typescript
// ❌ FORBIDDEN: InnerHTML with user data
element.innerHTML = userInput;

// ✅ REQUIRED: TextContent or sanitized HTML
element.textContent = userInput;
// OR
element.innerHTML = DOMPurify.sanitize(userInput);
```

### CSP Headers (Production)
```nginx
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.learninghub.stem;
" always;
```

### Data Privacy
- ❌ No PII (Personally Identifiable Information) in localStorage
- ❌ No analytics events containing student names
- ✅ All data transmission MUST use HTTPS (enforced in production)
- ✅ Session tokens MUST expire after 30 minutes of inactivity

> **Full policy:** `docs/policies/SECURITY.md` — secrets management, dependency auditing, vulnerability reporting.

---

## ⚡ PERFORMANCE RULES

### Rendering Performance
```typescript
// ✅ REQUIRED: Use requestAnimationFrame for animations
function animate(timestamp: number) {
  // Update logic
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ✅ REQUIRED: Passive event listeners for scroll/touch
element.addEventListener('scroll', handler, { passive: true });

// ✅ REQUIRED: Virtual scrolling for long lists
import { useVirtualizer } from '@tanstack/virtual-core';
```

### Bundle Size Budgets
| Module Type | Max Size (gzipped) | Action on Exceed |
|-------------|-------------------|------------------|
| Core Package | 50 KB | Block merge |
| UI Component | 20 KB | Warning |
| Simulation | 100 KB | Requires justification |
| Full App | 300 KB | Performance review |

### Lazy Loading Pattern
```typescript
// ✅ REQUIRED: Dynamic imports for heavy modules
const loadSimulation = async () => {
  const { PhysicsEngine } = await import('@learninghub/simulation-core');
  return new PhysicsEngine();
};

// Usage
const simulation = await loadSimulation();
simulation.init();
```

### Core Web Vitals Targets
| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | <2.5s | p75 of users |
| FID | <100ms | p75 of users |
| CLS | <0.1 | p75 of users |
| INP | <200ms | p75 of users |

> **Full guide:** `docs/policies/PERFORMANCE.md` — optimization rules, monitoring, pre-release checklist.

---

## 🤖 AI AGENT SPECIFIC RULES

### Pre-Generation Checklist
Before generating ANY code, AI agents MUST:
1. ✅ Verify target directory (`packages/` vs `legacy/`)
2. ✅ Check for existing similar functionality
3. ✅ Identify required interfaces
4. ✅ Plan test coverage strategy
5. ✅ Consider educational impact
6. ✅ Review architectural constraints

### Code Generation Standards
```typescript
/**
 * AI-Generated Code Requirements:
 * 1. Include JSDoc with @educationalConcept tag
 * 2. Include @migrationPath for future refactoring
 * 3. Include @testStrategy for coverage planning
 * 4. Include @aiGenerated timestamp
 */

/**
 * Calculates gravitational force between two bodies
 * @educationalConcept newtons-law-of-universal-gravitation
 * @prerequisites algebra,vectors
 * @misconceptions heavier-objects-fall-faster
 * @migrationPath packages/simulation-core/v2
 * @testStrategy property-based-testing
 * @aiGenerated 2026-07-29T10:30:00Z
 */
export function calculateGravity(m1: number, m2: number, r: number): number {
  // Implementation
}
```

### Self-Correction Protocol
If AI detects a violation during generation:
1. 🛑 Stop immediately
2. 📝 Report the specific rule violation
3. 💡 Propose an alternative approach
4. ⏸️ Wait for confirmation before proceeding

### AI Output Verification
All AI-generated code MUST pass:
- `pnpm lint` (no warnings)
- `pnpm test` (all tests pass)
- `pnpm verify-governance` (all checks pass)
- Human code review

---

## 📋 GOVERNANCE POLICIES

This section is the **summary layer** of the governance graph. Each policy below is
a short summary — the normative detail lives in the linked document. Per the
governance philosophy, policy text is authored **once** in its owning document.

### Public Contract Governance

Public contracts are versioned and immutable once accepted. The eight contract
classes are **API, Interface, Event, Adapter, Schema, Configuration, CLI, and
Environment Variables**.

- Additive changes are always safe; breaking changes require a MAJOR + migration path
- Stable contracts are never edited in place — change by addition or deprecation
- Events require Event Bus review before use

> **Full policy:** `docs/policies/API_CONTRACT.md`

### ADR Governance

An ADR is mandatory for: new packages, public interfaces/contracts, Event Bus
changes, dependency introduction, architectural pattern changes, major refactors,
and phase-level decisions.

- Lifecycle: `Draft → Accepted → Superseded/Rejected`
- **Accepted ADRs are immutable** — change requires a new ADR
- Ownership: one named maintainer (architect) approves — no board

> **Full policy + index:** `docs/adr/README.md`

### Dependency Governance

Dependencies are introduced deliberately, evaluated against a fixed checklist, and
removed when possible. **Prefer removing a dependency over adding one.**

- Every new dependency requires an ADR + maintainer approval
- Workspace packages and devDependencies are preferred over runtime deps
- Bundle impact must fit `lint:size` budgets

> **Full policy:** `docs/policies/DEPENDENCY_POLICY.md`

### Bundle Budgets

Every package and app ships within a declared size budget (measured by
`pnpm lint:size` against `bundlesize.config.json`).

- Library packages (`packages/*/dist`) are measured as raw bytes, per-entrypoint
- Application bundles (`apps/shell` assets) are measured **gzipped**
- Raising a budget requires maintainer approval and is tracked as a change
- The `bundlesize` package is deprecated; the internal `scripts/checks/size-check.cjs`
  is the single size-check implementation

> **Full guidance:** `docs/policies/PERFORMANCE.md`

### Observability

All observability output MUST follow the project naming convention and MUST carry
no PII. Events, trace spans, and log categories share one `domain:action` scheme.

- Structured logs at `debug/info/warn/error`; spans correlated by `traceId`
- Metrics follow the project naming convention (defined in the owning doc)
- Debug flags follow `?<area>=true` and are off by default

> **Full policy (naming + conventions):** `docs/policies/OBSERVABILITY.md`

### Reliability

Asynchronous and fallible code follows project-wide expectations:

- Bounded timeouts; `AbortSignal` cancellation
- Bounded retries with backoff+jitter on idempotent operations only
- Graceful degradation; typed errors — never swallowed

> **Full policy:** `docs/policies/RELIABILITY.md`

### Compatibility

Officially supported minimums (floors). **Tested baseline is tracked in
CI/package.json, not in governance text** — governance must not change when a tool
version updates.

| Toolchain | Minimum supported |
|-----------|-------------------|
| Node.js | ≥ 18 (LTS) |
| pnpm | ≥ 9 |
| TypeScript | ≥ 5.4 |
| ECMAScript target | ES2022 |
| Browsers | modern evergreen (last 2 versions); no IE |
| Build tooling | `tsc` + `turbo` |

> **Full policy:** `docs/policies/VERSIONING.md` → Compatibility

### Deprecation

Contracts and packages follow the lifecycle
`Experimental → Stable → Deprecated → Removed`. **Deprecated APIs/events/interfaces
MUST remain fully tested until removal.**

- Deprecation is announced with a version + replacement and a migration path
- Removal happens only in a MAJOR release, after a deprecation cycle

> **Full policy:** `docs/policies/VERSIONING.md` → Deprecation

### Package Lifecycle

Packages (not APIs) move through
`Experimental → Incubating → Stable → Legacy → Deprecated → Archived`.

- New packages start at **Experimental**, never Stable
- State changes require an ADR; deprecated packages stay tested until archived

> **Full policy:** `docs/policies/PACKAGE_LIFECYCLE.md`

### Package Metadata (ARCHITECTURE.toml)

Every `packages/*` and `apps/*` MUST declare architecture metadata in its own
`ARCHITECTURE.toml` — owner, lifecycle status, maturity, contracts, public API,
dependencies, and referenced ADRs. This is the single source of truth that feeds
the health dashboard (`docs/REPOSITORY_HEALTH.md`).

- Enforced by `pnpm lint:registry` (parses the file, validates fields, cross-checks
  dependencies and ADR references)
- Metadata changes follow the package's own ADR process

> **Full standard:** `docs/policies/PACKAGE_METADATA.md`

### Plugin / Extension Governance — RESERVED

*Planned, not active.* Future student/teacher/third-party extensions will be
governed here: extension contract, plugin API, plugin versioning, sandboxing, and
compatibility guarantees. No plugin system exists today; this section is reserved
so the architecture keeps it in mind.

### Architecture Documentation

The project maintains a C4-style diagram set under `docs/ARCHITECTURE/`:

- `overview.md` (index), `context.md` (L1), `containers.md` (L2),
  `components.md` (L3), `dependencies.md` (import rules), `migration.md`
- A generated dependency graph (`pnpm generate:graph` → `docs/dependency-graph.svg`)
- A decision log (`docs/adr/README.md`)

**Update triggers:** any ADR-trigger change, package-topology change (regenerate
the graph), public-contract change, or phase completion MUST update the relevant
diagram.

> **Full guidance:** `docs/ARCHITECTURE/overview.md`

---

## ⚖️ DECISION MATRIX

Use this to decide what a change requires. `✅` = required, `◻` = as applicable,
`—` = not required. `verify-governance` runs on every change regardless.

| Change type | ADR | Architect | Event Bus | Performance | Educational | Security |
|-------------|-----|-----------|-----------|-------------|-------------|----------|
| New package | ✅ | ✅ | — | ◻ | ◻ if learning | ◻ if data |
| New public API / interface | ✅ | ✅ | — | ◻ | — | ◻ |
| **New Event / event change** | ✅ | ✅ | ✅ | — | — | — |
| New dependency | ✅ | ✅ | — | ✅ | — | ✅ |
| Major refactor | ✅ | ✅ | — | ◻ | ◻ | ◻ |
| Legacy migration | ◻ | ✅ | — | ◻ | ◻ | — |
| Security-sensitive change | — | ✅ | — | — | — | ✅ |
| Educational content / module | — | — | — | — | ✅ | — |
| Package >50KB (bundle) | — | — | — | ✅ | — | — |

Notes:
- "Architect review" = one named maintainer, not a board.
- "Event Bus review" = verify against `docs/policies/EVENT_BUS_CONTRACT.md` + ADR-003.
- When in doubt, prefer the stronger column.

---

## 📋 ENFORCEMENT MECHANISMS

### Automated Checks (Local — `pnpm verify-governance`)

All checks below run locally (and are the same suite the committed CI workflows
run). `pnpm verify-governance` fails on the first failing stage:

| Stage | Command | Enforces |
|-------|---------|----------|
| Architecture imports | `pnpm lint:arch` | No `legacy/` imports, no cross-package imports (dependency-cruiser) |
| Circular dependencies | `pnpm lint:circular` | No import cycles (madge) |
| Global mutable state | `pnpm lint:state` | No `window`/`globalThis` in pure-logic src (ESLint flat config) |
| DOM purity | `pnpm lint:dom` | No `document.getElementById`/`querySelector` in pure-logic src (ESLint flat config) |
| Build | `pnpm build` | All packages + `apps/shell` bundle successfully |
| Types | `pnpm typecheck` | Strict TypeScript across all workspaces |
| Test coverage | `pnpm test:coverage` | Per-package ratchet: ≥ the floor in each package's `vitest.config.*.ts`, only ever moving upward (see Coverage Ratchet below) |
| Accessibility | `pnpm test:a11y` | Playwright + axe-core audit |
| Bundle size | `pnpm lint:size` | Per-package size budgets (`bundlesize.config.json`, apps measured gzip) |
| Educational metadata | `pnpm validate:edu` | `data.ts` question schema + EDUCATIONAL.md cross-reference |
| Component registry | `pnpm lint:registry` | Registry header + file:line + web-component coverage + `ARCHITECTURE.toml` metadata (ADR-009) |

**Coverage ratchet.** Coverage thresholds are defined per package in
`vitest.config.*.ts` (`thresholds.lines`). They only ever move upward: a PR that
raises a threshold is approved; a PR that lowers one must justify it against
`docs/REPOSITORY_HEALTH.md`. The health dashboard is regenerated by `pnpm docs:sync`
(which the pre-commit hook runs) so the published thresholds never drift from code.

### Automated Checks (CI/CD Pipeline)

The repository ships committed GitHub Actions workflows that enforce the same gate
on every PR and push to `main`:

- `.github/workflows/ci.yml` — runs on push to `main` and on pull requests:
  - **Verify governance:** installs dependencies, installs Playwright browsers,
    then runs `pnpm verify-governance` (the full local gate).
  - **Dependency audit:** `pnpm audit --prod`.
  - **Lighthouse CI:** builds the shell preview, measures Lighthouse budgets
    (`lighthouserc.json`) against committed baselines.
- `.github/workflows/nightly.yml` — scheduled nightly (and manual dispatch) run of
  the full governance gate: `pnpm verify-governance`.

The workflows orchestrate the commands defined in the table above; they do not
introduce separate checks. Locally, the same suite runs via `pnpm verify-governance`.

### Git Hooks (Tracked — `core.hooksPath`)

Git hooks are **tracked in the repository** at `scripts/git-hooks/` and activated via
`core.hooksPath` (NOT Husky, NOT `.husky/`). Configure on clone:

```bash
pnpm setup-hooks   # → git config core.hooksPath scripts/git-hooks
```

The `pre-commit` hook runs the deterministic documentation synchronizer and stages
its output:

```sh
#!/bin/sh
# scripts/git-hooks/pre-commit
pnpm docs:sync
git add -u
```

- `pnpm docs:sync` = `scripts/generate/docs-sync.mjs` (regenerates `AUTO` sections from
  `.phase.json` + the filesystem) + `scripts/generate/sync-versions.mjs` (syncs `**Version:**`
  headers in `docs/`).
- It is **idempotent** — running it twice produces no further changes, so the
  `release:finalize` commit that re-triggers the hook is harmless.
- Do not hand-edit `<!-- AUTO:... -->` regions; they are overwritten by `docs:sync`.
- A fresh clone has no hooks until `pnpm setup-hooks` runs (`core.hooksPath` is a
  local git config and is not cloned).

### Release & Versioning Governance

The following release rules are **normative** (see `docs/policies/VERSIONING.md` and
`docs/policies/HUMAN_INVOLVEMENT.md` for details):

1. **`.phase.json` is the canonical phase-state source.** `currentPhase` is derived
   from it (first phase that is not `completed`). Do not hand-edit the phase/status
   markers in `ROADMAP.md` or `AGENTS.md` — they are regenerated by `docs:sync`.
2. **Phase completion is a human decision.** Mark `status: "completed"` in
   `.phase.json` and leave `completedVersion` / `completedDate` as `null`. The
   release pipeline fills those fields at release time.
3. **Normal commits are not releases.** Commits never bump versions or create tags.
4. **Changesets record release intent only** — they do not trigger a release.
5. **The four-stage pipeline is the only official release workflow:**
   `release:prepare → human approval → git add -A → release:validate → release:version → release:finalize`.
   Direct `pnpm changeset version` is disabled.
6. **Human approval is mandatory** between `release:prepare` and `release:validate`.
7. **`git add -A` establishes the validated baseline** that `release:validate`
   fingerprints with `git write-tree` (TOCTOU token).
8. `release:validate` refuses to run with a dirty tree or unresolved `[EDIT: ...]`
   markers; `release:finalize` enforces a strict mutation allowlist and supports
   **docs-only** releases (completed phase, zero changesets).

### Violation Escalation Matrix
| Level | Violation Type | Response |
|-------|---------------|----------|
| 1 | Minor lint warning | PR comment, auto-fix suggestion |
| 2 | Coverage below threshold | PR blocked, requires fix |
| 3 | Architecture violation | PR blocked, architect review |
| 4 | Security/privacy breach | Immediate revert, incident report |
| 5 | Repeated violations | Developer retraining required |

---

## 🔄 MIGRATION PROTOCOLS

### Strangler Fig Pattern Implementation
```typescript
// Step 1: Create adapter for legacy functionality
export class LegacyQuizAdapter implements IQuizService {
  async loadQuestions(): Promise<IQuizQuestion[]> {
    // Call legacy global function through ACL
    return window.legacyQuizEngine.getQuestions();
  }
}

// Step 2: Build new implementation alongside
export class ModernQuizService implements IQuizService {
  async loadQuestions(): Promise<IQuizQuestion[]> {
    // Fetch from new API
    const response = await fetch('/api/questions');
    return response.json();
  }
}

// Step 3: Feature flag controlled routing
export function getQuizService(): IQuizService {
  if (featureFlags.useModernQuiz) {
    return new ModernQuizService();
  }
  return new LegacyQuizAdapter();
}
```

### Rollback Procedures
Every migration PR MUST include:
1. Rollback trigger condition
2. Rollback execution steps
3. Data migration reversal (if applicable)
4. Communication plan

---

## 📚 REFERENCES

### Governance Entry Points (normative)
- [RULES.md](./RULES.md) — this file (principles, mandatory rules, enforcement)
- [Constitution](./CONSTITUTION.md) — development constitution: ecosystem vision, operating principles, governance overview, AI session protocol
- [API Contract](./policies/API_CONTRACT.md) — public contracts, semver, migration
- [Event Bus Contract](./policies/EVENT_BUS_CONTRACT.md) — event naming, payloads, versioning
- [Versioning](./policies/VERSIONING.md) — semver, compatibility, deprecation, release workflow
- [Dependency Policy](./policies/DEPENDENCY_POLICY.md) — dependency evaluation & approval
- [Reliability](./policies/RELIABILITY.md) — timeouts, cancellation, retries, errors
- [Observability](./policies/OBSERVABILITY.md) — naming conventions for logs/traces/metrics
- [Package Lifecycle](./policies/PACKAGE_LIFECYCLE.md) — package states and transitions
- [ADR Index & Governance](./adr/README.md) — decision log and ADR process
- [Architecture Diagrams](./ARCHITECTURE/overview.md) — C4 diagram set
- [Docs Taxonomy](./DOCS.md) — what lives where, who owns it, update rules

### Standards & Guides
- [Architecture Charter](./ARCHITECTURE/README.md) — module layout, import rules, data flow
- [Package Metadata](./policies/PACKAGE_METADATA.md) — `ARCHITECTURE.toml` standard
- [Health Dashboard](./REPOSITORY_HEALTH.md) — generated package health
- [Component Standards](./guides/COMPONENT_STANDARDS.md) — how to build a Web Component
- [Accessibility](./policies/ACCESSIBILITY.md) — WCAG 2.2 AA standards, audit checklist
- [Security](./policies/SECURITY.md) — input validation, CSP, data privacy, dependency audit
- [Performance](./policies/PERFORMANCE.md) — budgets, optimization rules, Core Web Vitals
- [Human Involvement](./policies/HUMAN_INVOLVEMENT.md) — human vs. automation contract
- [Quickstart](./guides/QUICKSTART.md) — setup and first contribution
- [Debugging](./guides/DEBUGGING.md) — troubleshooting with the tracer

### External Standards
- [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/)
- [Semantic Versioning 2.0](https://semver.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Dev Guidelines](https://web.dev/learn/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 📝 CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 2.5.0 | 2026-08-11 | Add `CONSTITUTION.md` as the development constitution (vision + operating principles + governance overview); `RULES.md` remains the normative enforcement entry point; register governance registries under `docs/governance/` (ADR-011) |
| 2.4.0 | 2026-08-01 | Docs/scripts reorganization: governance policies → `docs/policies/`, standards & guides → `docs/guides/`; scripts grouped under `scripts/checks/`, `scripts/generate/`, `scripts/release/`; added `pnpm quick`, `pnpm check`, `pnpm size` shortcuts; all references re-pointed to new paths |
| 2.3.0 | 2026-08-01 | Docs governance hardening: coverage ratchet policy (thresholds move only up, per `vitest.config.*.ts`), bundle-budget policy (raw bytes for libraries, gzip for apps, internal `size-check.cjs` replaces `bundlesize`), package-metadata policy (`ARCHITECTURE.toml`), build stage added to the enforcement chain, new docs registered (DOCS.md, REPOSITORY_HEALTH.md, policies/PACKAGE_METADATA.md); architecture charter moved to `docs/ARCHITECTURE/README.md` |
| 2.2.0 | 2026-08-01 | Restructured as governance **entry point**: added Architecture Principles, Quality Attributes, governance-policy summaries (public contracts, ADR, dependencies, observability, reliability, compatibility, deprecation, package lifecycle, reserved plugin section, architecture documentation), Decision Matrix, and Governance Philosophy. Detail moved to dedicated docs; fixed stale CI script names and broken references. |
| 2.1.0 | 2026-07-31 | Git hooks documented as `core.hooksPath` pre-commit (`docs:sync` + `git add -u`); CI marked as planned; added Release & Versioning Governance rules |
| 2.0.0 | 2026-07-30 | Rebrand to STEM-TUITION (independent project), replace all `@learninghub` → `@learninghub` |
| 1.0.0 | 2024-01-15 | Initial static site rules (archived) |

---

*Last Updated: 2026-08-01*  
*Approved by: Chief Software Architect*  
*Status: 🔒 ENFORCED*  
*Next Review: 2026-11-01*
