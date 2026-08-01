# Glossary

**Version:** 3.0.0
**Purpose:** Every technical term used in STEM-TUITION, explained simply with project-specific examples.

---

## A

### ACL (Anti-Corruption Layer)
A translator that lets old code and new code work together without being tangled. The ACL wraps legacy functions so new modules can call them through a clean interface, without directly importing legacy files.

- **In STEM-TUITION:** `packages/acl/quiz-adapter.ts` wraps the old `window.STEMQuizApp` calls so the new `<stem-quiz>` component can use them.

### ADR (Architecture Decision Record)
A short document that records *why* a decision was made, *what* was rejected, and *what* the trade-offs are. ADRs are permanent records — you read them when you wonder "why did we do it this way?"

- **In STEM-TUITION:** `docs/adr/001-strangler-fig-migration.md` explains why we chose the Strangler Fig pattern over a full rewrite.

### Architecture
How the pieces of software are arranged and how they communicate. Good architecture means finding things quickly and changing one thing without breaking another.

### Attribute (Web Component)
An HTML attribute that serves as input to a Web Component. The component watches for changes via `attributeChangedCallback`.

- **Example:** `<stem-quiz concept="newtons-law" difficulty="medium">` — `concept` and `difficulty` are attributes.

---

## B

### BEM (Block Element Modifier)
A CSS naming convention that prevents style conflicts.

- **Pattern:** `.block__element--modifier`
- **Example:** `.quiz-card__question--highlighted`

### BroadcastChannel
A native browser API that lets different parts of a page (or even different tabs) send messages to each other. Used by the Event Bus for cross-module communication.

---

## C

### Changesets
A tool that automates version bumping and changelog generation. When you finish a change, you run `pnpm changeset` and describe the change. On release, all pending changesets are combined into versions and a changelog.

### CI/CD (Continuous Integration / Continuous Deployment)
Automated checks that run every time you push code. CI runs tests. CD deploys the result.

### Component
A reusable, self-contained piece of the user interface. A button is a component. A quiz card is a component. A navigation bar is a component.

- **Analogy:** LEGO bricks. Each brick has a standard connection. You snap them together rather than melting plastic and molding it.

### Component Registry
A living index of every component in the project, mapping each component to its exact file and line number. Updated on every change.

- **In STEM-TUITION:** `docs/component-registry/`

### CustomEvent
A native browser API for dispatching events from a Web Component to its parent. Events bubble up through the DOM tree.

---

## D

### Decorator
A TypeScript feature that wraps a function to add behavior (like timing, logging, or access control) without changing the function's code.

- **In STEM-TUITION:** `@trace` decorator automatically times every function call.

### Dependency
When package A needs package B to work, package A *depends* on package B. A *circular dependency* is when A depends on B and B depends on A — this is forbidden.

### Design Tokens
Named CSS custom properties that define the visual system: colors, spacing, fonts, animation durations. Using tokens instead of hardcoded values ensures consistency.

- **Example:** `--color-primary-500`, `--space-4`, `--font-size-base`

### DOM (Document Object Model)
The browser's representation of your HTML. JavaScript manipulates the DOM to change what the user sees. In this project, business logic NEVER touches the DOM directly.

---

## E

### Educational Fitness Function
A checklist every feature must pass before it ships. It ensures the feature has educational value, addresses misconceptions, and measures learning outcomes.

- **In STEM-TUITION:** `docs/RULES.md` Section EDU-1 through EDU-5

### Event
A message sent from one module to others through the Event Bus. Events follow the format `domain:action` and carry a typed payload.

- **Example:** `quiz:completed` with payload `{score: 8, total: 10}`

### Event Bus
A central communication channel where modules publish events and subscribe to events they care about. Modules never call each other directly.

- **Analogy:** A radio station. The DJ (publisher) broadcasts on a frequency. Anyone with a receiver (subscriber) tuned to that frequency can hear.

---

## F

### Feature Flag
A switch that turns a new feature on or off without deploying new code. Lets you test a new module with a subset of users, and roll back instantly if something breaks.

- **Example:** `?new_quiz=true` enables the new quiz engine. Remove it to instantly fall back to the old one.

### Frozen Zone
The `legacy/` directory. Files here are read-only. No new features. Only critical bug fixes. This prevents accidental changes to stable, tested code during the migration.

---

## G

### GitHub Actions
GitHub's built-in automation system. Runs tests, checks, and deployments when you push code.

---

## H

### HITL (Human In The Loop)
A system where the computer asks a human for approval before taking a destructive action. Used for safety in JARVIS. Not applicable to STEM-TUITION (educational, not destructive).

---

## I

### IIFE (Immediately Invoked Function Expression)
A JavaScript pattern where a function is defined and immediately executed. Used in legacy code to avoid polluting the global scope.

- **Pattern:** `(function() { 'use strict'; ... })();`

### Integration Test
A test that checks whether two or more modules work together correctly. For example, does the quiz engine correctly publish to the Event Bus, and does the audio module correctly subscribe and play a sound?

---

## L

### Legacy
Old code that still works but is no longer actively developed. In STEM-TUITION, legacy code is frozen in `legacy/` and never modified.

---

## M

### Migration
Moving functionality from the old system to the new system. The Strangler Fig pattern ensures migrations are gradual, reversible, and don't break the live site.

### Module
A self-contained unit of code with a single responsibility. Each package in `packages/` is a module.

- **Example:** `packages/audio-synth/` is the audio module. It only handles sound. Nothing else.

### Monorepo
A single repository containing multiple packages. Keeps everything in one place while maintaining separation between packages.

### Monolith
A codebase where all functionality is mixed together in one file or directory. The opposite of modular. STEM-TUITION started as a monolith (v1.0.0).

---

## O

### Observability
The ability to see what a system is doing internally by observing its outputs. In STEM-TUITION, the tracer package provides observability — you can see every function call, its duration, and the path it took.

---

## P

### Package
A directory containing related code with a single responsibility. Has a `package.json`, its own `tsconfig.json`, and follows a standard structure defined in `COMPONENT_STANDARDS.md`.

### pnpm
A fast, disk-efficient package manager for JavaScript. More strict than npm, which prevents dependency bugs.

### Pub/Sub (Publish/Subscribe)
A communication pattern where senders (publishers) don't send messages directly to receivers (subscribers). Instead, messages go through a central channel (Event Bus) that routes them to interested subscribers.

---

## R

### Router
Code that decides which page or module to load based on the URL. In STEM-TUITION, the router (in `apps/shell/`) decides whether to serve legacy pages or modern modules.

---

## S

### Seam
A logical boundary in the code where you can cut the monolith to extract a module. The place where one concern ends and another begins.

- **In STEM-TUITION:** The audio functions in `stem-effects.js` lines 28-86 are a seam — they have zero dependencies on the rest of the file and can be cleanly extracted.

### Shadow DOM
A browser feature that isolates a Web Component's DOM and CSS from the rest of the page. Styles inside Shadow DOM don't leak out, and styles outside don't leak in.

### Span
A single operation in a trace. Has a start time, end time, name, and optional parent. Multiple spans form a *waterfall* that shows the full path of a request.

### Strangler Fig Pattern
A migration strategy where you build new code alongside old code, gradually route traffic to the new code, and eventually remove the old code.

- **Analogy:** Building a new wing of a house while living in the old wing. Move room by room. Never homeless.

### Subscriber
A module that listens for specific events on the Event Bus. When a matching event is published, the subscriber's handler function is called.

---

## T

### TDR (Technology Decision Record)
A document that records why a specific technology (like React or vue) was chosen for a specific use case. Includes alternatives considered and trade-offs.

### Trace
A record of a request's journey through the system. Shows which functions were called, in what order, and how long each took.

### Tracer
The `packages/tracer/` module. Instruments all other packages to measure function execution times. Provides a live dashboard during development.

### Turborepo
A build system for monorepos. Caches build outputs so unchanged packages don't get rebuilt. Makes development faster.

---

## U

### Unit Test
A test that checks one function in isolation. Tests only the logic, not the UI. Fast to run (milliseconds).

---

## V

### Vite
A fast build tool for modern web projects. Used for building TypeScript packages in development (hot reload) and production (optimized bundles).

---

## W

### Web Component
A native browser technology for creating reusable components using standard HTML, CSS, and JavaScript. Uses Custom Elements, Shadow DOM, and HTML Templates.

- **In STEM-TUITION:** All new UI elements are Web Components (`<stem-quiz>`, `<stem-simulation>`, etc.)

### Wildcard Subscription
A subscription pattern where a subscriber listens to ALL events matching a pattern.

- **Example:** `eventBus.subscribe('quiz:*', handler)` — listens to every quiz event.
- `eventBus.subscribe('*', handler)` — listens to EVERY event (used for debugging).
