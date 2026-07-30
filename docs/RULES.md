# 📐 STEM-TUITION: Technical Rules & Coding Standards

> **Version:** 2.0.0 (Modular Edition)  
> **Status:** 🔒 ENFORCED  
> **Applies To:** All developers, AI agents, and contributors  
> **Effective Date:** 2026-07-30  
> **Current Date:** 2026-07-30

---

## 🎯 Purpose

This document defines the **strict technical regulations** that govern all code written in the STEM-TUITION project. These rules are non-negotiable and must be followed to maintain architectural integrity, educational quality, and long-term maintainability.

**Violation of these rules will result in automatic PR rejection.**

---

## 🏛️ ARCHITECTURAL RULES

### Rule 1: Legacy Isolation (CRITICAL)
```typescript
// ❌ FORBIDDEN: Direct import from legacy
import { legacyFunction } from '../legacy/js/stem-effects.js';

// ✅ REQUIRED: Use Anti-Corruption Layer
import { PhysicsAdapter } from '@stem-tuition/physics-adapter';
```

**Rationale:** Prevents legacy coupling from spreading into new modules.  
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
**Enforcement:** ESLint rule `no-dom-in-logic`.

### Rule 3: No Global Mutable State
```typescript
// ❌ FORBIDDEN: Global variables
let currentGrade = 10;
window.userProgress = {};

// ✅ REQUIRED: Encapsulated state with signals/store
import { signal } from '@preact/signals-core';
const currentGrade = signal(10);
```

**Rationale:** Prevents race conditions, enables time-travel debugging.  
**Enforcement:** ESLint rule `no-global-mutable-state`.

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
**Enforcement:** Code review checklist.

### Rule 5: Strangler Fig Compliance
- New functionality MUST be created in `packages/` or `apps/`
- Legacy code MAY ONLY be modified for critical security patches
- Every migration MUST have a rollback plan documented in the PR

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

**Maximum file size:** 500 lines (excluding tests and comments)  
**Enforcement:** `pnpm lint:size`

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

---

## 🧪 TESTING REQUIREMENTS

### Coverage Thresholds (ENFORCED)
| Module Type | Line Coverage | Branch Coverage | Action on Fail |
|-------------|---------------|-----------------|----------------|
| Core Logic | ≥95% | ≥90% | Block merge |
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

> **Full standard:** `docs/ACCESSIBILITY.md` — WCAG 2.2 AA, component-specific requirements, audit process.

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

> **Full policy:** `docs/SECURITY.md` — secrets management, dependency auditing, vulnerability reporting.

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
  const { PhysicsEngine } = await import('@stem-tuition/simulation-core');
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

> **Full guide:** `docs/PERFORMANCE.md` — optimization rules, monitoring, pre-release checklist.

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

## 📋 ENFORCEMENT MECHANISMS

### Automated Checks (CI/CD Pipeline)
```yaml
# .github/workflows/governance.yml
name: Architecture Governance

on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Architecture Lint
        run: pnpm lint:arch
        continue-on-error: false
      
      - name: Test Coverage
        run: pnpm test:coverage
        continue-on-error: false
      
      - name: Bundle Size Check
        run: pnpm build:size
        continue-on-error: false
      
      - name: Educational Metadata
        run: pnpm validate:edu
        continue-on-error: false
      
      - name: Accessibility Audit
        run: pnpm a11y:audit
        continue-on-error: false
      
      - name: Type Check
        run: pnpm typecheck
        continue-on-error: false
```

### Git Hooks (Husky)
```bash
#!/bin/sh
# .husky/pre-commit

pnpm lint-staged
pnpm test -- --changedSince HEAD~1
```

### Manual Review Requirements
- All ADRs (Architecture Decision Records) require architect approval
- Any package >50KB requires performance justification
- New interfaces require ecosystem impact assessment
- Educational content requires pedagogy review

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

### Core Documents
- [Architecture Charter](../README.md)
- [ADR Index](./adr/)
- [Educational Guidelines](./EDUCATIONAL_GUIDELINES.md)
- [Migration Strategy](./MIGRATION_STRATEGY.md)

### External Standards
- [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Dev Guidelines](https://web.dev/learn/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 📝 CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2026-07-30 | Rebrand to STEM-TUITION (independent project), replace all `@learninghub` → `@stem-tuition` |
| 1.0.0 | 2024-01-15 | Initial static site rules (archived) |

---

*Last Updated: 2026-07-30*  
*Approved by: Chief Software Architect*  
*Status: 🔒 ENFORCED*  
*Next Review: 2026-10-30*
