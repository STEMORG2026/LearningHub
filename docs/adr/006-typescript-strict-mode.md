---
title: "ADR-006: TypeScript Strict Mode"
status: ACCEPTED
date: 2026-07-30
last_updated: 2026-07-30
canonical: true
---

# ADR-006: TypeScript Strict Mode

## Status
Accepted

## Date
2026-07-30

## Context
The legacy codebase is vanilla JavaScript with no type checking. This causes:
- Runtime errors that could be caught at compile time
- Poor IDE support (no autocomplete, no inline documentation)
- Difficult to understand what values functions expect and return
- Refactoring is risky because you don't know what depends on what

## Decision
All new packages use **TypeScript 5.4+ in strict mode**.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Rationale:**
- Catches entire classes of bugs at compile time
- Self-documenting code — types serve as documentation
- Better IDE support (autocomplete, refactoring, inline docs)
- Educational value — learning TypeScript is a transferable skill
- Strict mode eliminates entire categories of bugs (`null`, `undefined`, `any`)

## Alternatives Considered
- **JavaScript + JSDoc:** Type hints in comments — not enforced at compile time
- **JavaScript (no types):** Current approach — causes the problems we want to solve
- **TypeScript with loose mode:** Catches some errors but allows `any` — defeats the purpose

## Consequences
### Positive
- Far fewer runtime errors
- Code is self-documenting
- Refactoring is safer (compiler tells you what else needs to change)

### Negative
- Learning curve for TypeScript syntax
- Strict mode can be frustrating initially (compiler rejects subtle patterns)

### Neutral
- Legacy JavaScript files remain unchanged (in `legacy/`)
- TypeScript is only for new packages
- Migration path: extract JavaScript → rewrite as TypeScript
