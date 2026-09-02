# Component Standards

**Version:** 3.0.0
**Status:** ENFORCED
**Owner:** Architecture
**Applies To:** All packages under `packages/*`
**Related:** `RULES.md`, `EVENT_BUS_CONTRACT.md`, `ACCESSIBILITY.md`, `docs/component-registry/`

---

## 1. Component Architecture

Every component in STEM-TUITION follows this architecture:

```
┌───────────────────────────────────────────┐
│          Web Component (shell)            │
│  <stem-quiz concept="..." difficulty="">   │
│                                           │
│  ┌─────────────────────────────────┐      │
│  │     Shadow DOM (isolated)       │      │
│  │  ┌───────────────────────────┐  │      │
│  │  │  HTML Template            │  │      │
│  │  ├───────────────────────────┤  │      │
│  │  │  CSS (scoped to this      │  │      │
│  │  │  component only)          │  │      │
│  │  ├───────────────────────────┤  │      │
│  │  │  Render Logic             │  │      │
│  │  └───────────────────────────┘  │      │
│  └─────────────────────────────────┘      │
│                                           │
│  ┌─────────────────────────────────┐      │
│  │  Pure Logic (no DOM access)     │      │
│  │  - Data validation             │      │
│  │  - Score calculation           │      │
│  │  - State machine               │      │
│  │  These are testable without    │      │
│  │  browser/DOM.                  │      │
│  └─────────────────────────────────┘      │
│                                           │
│  Communication:                           │
│  - Input:  observedAttributes             │
│  - Output: CustomEvent + Event Bus        │
└───────────────────────────────────────────┘
```

### Why this split?

- **Pure logic** → tested with Vitest (no browser needed)
- **DOM rendering** → tested with Playwright (browser automation)
- **Web Component shell** → the public API, framework-agnostic
- If you later decide to render with React/Vue, you keep the pure logic + Web Component shell and swap only the renderer

---

## 2. Component Template

Every component MUST follow this structure:

```
packages/<name>/
├── src/
│   ├── index.ts                  ← public API, re-exports
│   ├── types.ts                  ← interfaces, types
│   ├── internal/
│   │   ├── <name>.ts             ← pure business logic
│   │   ├── <name>.test.ts        ← unit tests for logic
│   │   ├── template.ts           ← HTML template string
│   │   ├── styles.css            ← scoped styles
│   │   └── web-component.ts      ← Web Component registration
│   └── adapters/                 ← ACL adapters (if wrapping legacy)
├── tests/
│   ├── web-component.test.ts     ← browser tests
│   └── e2e/                      ← Playwright tests (if applicable)
├── package.json
├── tsconfig.json
└── README.md                     ← component contract
```

### Contract Template (`README.md`)

```markdown
# @learninghub/<name>

## Purpose
One sentence describing what this component does.

## Attributes (Inputs)
| Attribute   | Type     | Default    | Description                     |
|-------------|----------|------------|---------------------------------|
| concept     | string   | required   | STEM concept identifier         |
| difficulty  | 'easy' | 'medium' | 'hard' | 'medium' | Controls hint frequency   |
| show-hints  | boolean  | true       | Show scaffolding hints           |

## Events (Outputs)
| Event               | Detail              | Description                |
|---------------------|---------------------|----------------------------|
| <name>:completed    | {score, total}      | User completed interaction |
| <name>:error        | {code, message}     | Error occurred             |

## Educational Metadata
- Concept: <concept-id>
- Prerequisites: <list>
- Grade levels: <range>
- Misconceptions addressed: <list>

## Dependencies
- @learninghub/core (Event Bus)
- @learninghub/tracer (observability)

## Usage
```html
<stem-<name> concept="newtons-law" difficulty="medium"></stem-<name>>
```
```

---

## 3. Web Component Lifecycle

```typescript
export class StemComponent extends HTMLElement {
  // 1. CONSTRUCTOR: Set up shadow DOM, bind methods
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Declare all bound methods here so they persist
    this.#handleClick = this.#handleClick.bind(this);
  }

  // 2. observedAttributes: Declare which HTML attributes to watch
  static get observedAttributes(): string[] {
    return ['concept', 'difficulty', 'show-hints'];
  }

  // 3. connectedCallback: Component added to DOM — set up listeners, render
  connectedCallback(): void {
    this.#render();
    this.shadowRoot?.addEventListener('click', this.#handleClick);
  }

  // 4. attributeChangedCallback: React to attribute changes
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      this.#updateState(name, newValue);
      this.#render();
    }
  }

  // 5. disconnectedCallback: Component removed from DOM — clean up
  disconnectedCallback(): void {
    this.shadowRoot?.removeEventListener('click', this.#handleClick);
    // Unsubscribe from Event Bus
    // Cancel any pending timers/animations
  }
}

customElements.define('stem-<name>', StemComponent);
```

### Lifecycle Diagram

```
Created (constructor)
     │
     ▼
Attached to DOM (connectedCallback)
     │
     ├── render() ← draws HTML template into Shadow DOM
     ├── addEventListeners()
     ├── subscribeToEventBus()
     └── startAnimation() (if applicable)
     │
     ▼
Attribute changes (attributeChangedCallback)
     │
     ├── updateState()
     └── render()
     │
     ▼
Detached from DOM (disconnectedCallback)
     │
     ├── removeEventListeners()
     ├── unsubscribeFromEventBus()
     ├── cancelAnimation()
     └── clearTimers()
```

---

## 4. Shadow DOM Rules

- **ALWAYS** use `attachShadow({ mode: 'open' })` for testability
- **NEVER** use `mode: 'closed'` — it breaks component inspector
- Styles inside Shadow DOM are **fully isolated** — no leakage in or out
- Use `<slot>` elements for content projection (allowing users to pass child content)

```typescript
// Good
this.attachShadow({ mode: 'open' });

// Good — slot for flexible content
this.shadowRoot.innerHTML = `
  <div class="card">
    <slot name="header"></slot>
    <div class="content">
      <slot></slot>
    </div>
  </div>
`;

// Bad — closed mode breaks debugging
this.attachShadow({ mode: 'closed' });
```

---

## 5. Event Pattern (Output)

Components communicate upward via two mechanisms:

### 5.1 CustomEvent (for parent-child)

```typescript
this.dispatchEvent(new CustomEvent('quiz-completed', {
  bubbles: true,       // allows parent to catch it
  composed: true,      // crosses Shadow DOM boundary
  detail: {            // payload
    score: 8,
    total: 10,
    conceptId: 'newtons-second-law'
  }
}));
```

### 5.2 Event Bus (for cross-module)

```typescript
import { eventBus } from '@learninghub/core';

// Publish to the entire system
eventBus.publish('quiz:completed', {
  score: 8,
  total: 10,
  conceptId: 'newtons-second-law',
  traceId: 'abc-123'   // propagated from tracer
});
```

---

## 6. Attribute Contract (Input)

Every observable attribute MUST:

1. Be declared in `observedAttributes`
2. Have a default value in the constructor
3. Be validated on change
4. Be documented in the README contract table

```typescript
class StemComponent extends HTMLElement {
  #concept = '';
  #difficulty = 'medium';
  #showHints = true;

  static get observedAttributes() {
    return ['concept', 'difficulty', 'show-hints'];
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal === newVal) return;
    switch (name) {
      case 'concept':
        this.#concept = newVal;
        break;
      case 'difficulty':
        if (['easy', 'medium', 'hard'].includes(newVal)) {
          this.#difficulty = newVal;
        }
        break;
      case 'show-hints':
        this.#showHints = newVal !== 'false';
        break;
    }
    this.#onStateChange();
  }
}
```

---

## 7. Pure Logic Separation

All business logic MUST be in separate files that do NOT import `document`, `window`, or any DOM API.

```typescript
// packages/quiz-engine/src/internal/scorer.ts
// ✅ CORRECT: Pure logic, no DOM

export function calculateScore(
  answers: Answer[],
  correctAnswers: Answer[]
): ScoreResult {
  const correct = answers.filter((a, i) => a === correctAnswers[i]);
  return {
    correct: correct.length,
    total: answers.length,
    percentage: (correct.length / answers.length) * 100
  };
}

export function identifyMisconceptions(
  answer: string,
  correctAnswer: string
): Misconception | null {
  // Pure logic — analyze the answer pattern
  if (answer === 'F = mv' && correctAnswer === 'F = ma') {
    return {
      type: 'confuses_momentum_force',
      suggestion: 'Remember: Force = mass × acceleration, not mass × velocity'
    };
  }
  return null;
}
```

```typescript
// ❌ WRONG: DOM in business logic
export function calculateScore(answers, correctAnswers) {
  document.querySelector('.score').innerText = 'Calculating...'; // VIOLATION
  // ... logic ...
}
```

---

## 8. Accessibility Requirements

Every component MUST:

1. **Keyboard navigable** — all interactive elements reachable via Tab
2. **ARIA attributes** — appropriate roles, labels, descriptions
3. **Focus indicators** — visible focus ring (use CSS `:focus-visible`)
4. **Reduced motion** — respect `prefers-reduced-motion`
5. **Color independence** — meaning not conveyed by color alone
6. **Screen reader friendly** — use `aria-live` for dynamic content

> **Full accessibility standard:** `docs/policies/ACCESSIBILITY.md` — WCAG 2.2 AA target, component-specific requirements (quiz, simulation, canvas), audit process, violation escalation matrix.

```typescript
connectedCallback() {
  // Accessibility baseline
  this.setAttribute('role', 'application');
  this.setAttribute('aria-label', `Quiz: ${this.#concept}`);

  // Respect reduced motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  this.#reducedMotion = motionQuery.matches;
  motionQuery.addEventListener('change', (e) => {
    this.#reducedMotion = e.matches;
    this.#render();
  });
}
```

```css
/* Focus indicator */
:host(:focus-visible) {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Testing Requirements

| Test type | What it covers | Tool | Required for merge |
|-----------|---------------|------|-------------------|
| Unit test | Pure logic functions | Vitest | ✅ Yes |
| Component test | Shadow DOM rendering | Vitest + jsdom | ✅ Yes |
| Accessibility test | ARIA, keyboard, color | Playwright + axe | ✅ Yes |
| Integration test | Event Bus communication | Vitest | ⚠️ Recommended |
| E2E test | Full user flow | Playwright | ⚠️ For new features |

---

## 10. Documented with Educational Metadata

Every component that teaches a concept MUST include:

```typescript
// File header metadata
/**
 * @component stem-quiz
 * @educationalConcept newtons-second-law
 * @prerequisites force, mass, acceleration
 * @gradeLevel 9,10,11,12
 * @misconceptions heavier-objects-fall-faster
 * @estimatedTime 15min
 */
```

This metadata powers:
- Component Registry (`docs/component-registry/EDUCATIONAL.md`)
- Trace dashboard (shows which concept is active)
- Future analytics (measure learning outcomes)
