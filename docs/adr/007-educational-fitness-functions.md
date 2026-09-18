---
title: "ADR-007: Educational Fitness Functions"
status: ACCEPTED
date: 2026-07-30
last_updated: 2026-07-30
canonical: true
---

# ADR-007: Educational Fitness Functions

## Status
Accepted

## Date
2026-07-30

## Context
STEM-TUITION is an educational platform. As features are added, there's a risk of adding functionality that:
- Looks impressive but doesn't teach anything
- Is technically interesting but distracts from learning
- Doesn't address student misconceptions
- Lacks assessment of whether learning occurred

## Decision
Every feature MUST pass the **Educational Fitness Function** before shipping:

1. **Concept taught:** What specific STEM concept does this teach?
2. **Prerequisites:** What prior knowledge is assumed?
3. **Visualization:** How is the concept represented visually?
4. **Interaction:** How does the student engage with it?
5. **Practice:** How does the student practice the concept?
6. **Measurement:** How is understanding assessed?
7. **Misconceptions:** What common errors does this address?
8. **AI role:** How does AI assist without replacing thinking?

This checklist is included in every PR description for features. Automated validation (`pnpm validate:edu`) checks that educational metadata tags exist.

## Alternatives Considered
- **No educational gate:** Technical features could ship without pedagogical value
- **Manual review only:** More subjective, may be inconsistent

## Consequences
### Positive
- Every feature serves the educational mission
- Clear documentation of what each feature teaches
- Helps prioritize — features that fail are deprioritized

### Negative
- Adds overhead to feature development

### Neutral
- Educational metadata feeds into the Component Registry and Tracer
- Enables future analytics ("which concepts are students engaging with?")
