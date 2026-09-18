---
title: "ADR-002: Web Components as Default Component Architecture"
status: ACCEPTED
date: 2026-07-30
last_updated: 2026-07-30
canonical: true
---

# ADR-002: Web Components as Default Component Architecture

## Status
Accepted

## Date
2026-07-30

## Context
New UI elements need to be created as modular, reusable components. Options:
1. **Web Components** — native browser technology, no framework required
2. **React** — requires build step, JSX, virtual DOM
3. **Vue** — similar to React, different syntax
4. **No components** — continue with inline HTML (current approach — not scalable)

## Decision
We use **Web Components** (Custom Elements + Shadow DOM) as the default component architecture.

The outer shell of every component is a Web Component. The inner implementation MAY use a framework if complexity justifies it (via TDR).

**Rationale:**
- Zero build step required — works in all modern browsers
- Framework-agnostic — the public API is HTML elements
- Can wrap React/Vue components inside a Web Component shell if needed later
- No lock-in — we can change the inner implementation without changing the component API
- Educational value — learning native browser APIs is more transferable than learning a framework

## Alternatives Considered
- **React:** Requires JSX build step, larger bundle, more concepts to learn
- **Vue:** Same concerns as React
- **Inline HTML:** Current approach — not scalable, not reusable

## Consequences
### Positive
- Components work in any framework or no framework
- Shadow DOM provides style isolation for free
- No build step required for basic components
- Easy to test (standard DOM APIs)

### Negative
- Web Components have less ecosystem support than React/Vue
- Complex state management requires additional patterns (Event Bus)

### Neutral
- Some patterns (form handling, complex animations) may still benefit from React later
- Decision can be revisited per-component via TDR
