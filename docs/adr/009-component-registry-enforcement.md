# ADR-009: Component Registry Enforcement

## Status
Accepted

## Date
2026-07-30

## Context
As the project grows, it becomes hard to find where code lives. When debugging, you need to know:
- Where is this component defined?
- Where is its template?
- Where is its test?
- Where is its state?

Existing approaches:
1. **Search the codebase:** Works for small projects, breaks as it grows
2. **Code comments:** Not enforced, goes out of date
3. **Automatic generation:** Requires complex tooling

## Decision
We maintain a **hand-curated Component Registry** at `docs/component-registry/` that maps every component to its exact file and line number.

The registry is split by concern:
- `RENDERING.md` — components, templates, CSS
- `STATE.md` — stateful modules, stores
- `NETWORKING.md` — API calls, Event Bus connections
- `EDUCATIONAL.md` — learning modules, concepts
- `TESTING.md` — tests by component
- `TRACE.md` — traced functions, spans

**Enforcement:** A script (`pnpm lint:registry`) checks that:
- Every component in the codebase has a registry entry
- The file:line references in the registry actually exist
- No component is listed in the registry but missing from the codebase

## Alternatives Considered
- **Search (grep):** Works but slow, no structure, relies on naming conventions
- **Auto-generated (typedoc, dependency-cruiser):** Good but adds tooling complexity and may not capture educational metadata
- **No registry:** Current approach — hard to find anything

## Consequences
### Positive
- Find any component's location in seconds
- Registry is a structured index, not a monolith
- Enforced by automation — won't go out of date
- Educational — seeing all components listed gives a sense of the whole system

### Negative
- Must update registry when moving/renaming files
- `pnpm lint:registry` adds one more check to the pipeline

### Neutral
- Registry doubles as a project map for new developers
- Easy to update — just edit a markdown table
