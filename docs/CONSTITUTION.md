# STEM ECOSYSTEM — DEVELOPMENT ARCHITECTURE, STANDARDS & GOVERNANCE

**Version:** 3.0.0
**Status:** Active
**Owner:** Architecture
**Applies To:** All packages, apps, and the root workspace
**Related:** `RULES.md`, `docs/ARCHITECTURE/README.md`, `docs/governance/interface-registry.md`, `docs/governance/human-checkpoints.md`, `docs/governance/architecture-exceptions.md`, `docs/adr/README.md`

**Document Type:** Governing Development Specification
**Current Product:** STEM-TUITION
**Architecture Scope:** STEM Ecosystem
**Status:** Active

---

# 0. PURPOSE

This document is the **development constitution**. It defines how the STEM
ecosystem is to be designed, implemented, documented, tested, debugged, governed,
and evolved.

It exists so that:

* the human developer,
* current AI coding agents,
* future AI coding agents,
* future human developers,
* and future maintainers

can understand not only **what the system does**, but also:

* why it is structured this way,
* where responsibilities belong,
* what decisions have already been made,
* what may be changed freely,
* what requires approval,
* what is intentionally deferred,
* how to inspect the system,
* how to debug it,
* and how to extend it without creating architectural drift.

This document is therefore a **development constitution**, not merely a technical
design document.

---

# 0.1 ADOPTION NOTE

This constitution is adopted into the STEM-TUITION repository and reconciled with
the existing documentation taxonomy (`docs/DOCS.md`). The mappings below are
canonical and replace the literal directory names used elsewhere in this document:

| Constitution concept | Repository location |
|----------------------|---------------------|
| `docs/CONSTITUTION.md` (this file) | Development constitution — vision, operating principles, governance overview |
| `docs/RULES.md` | **Normative enforcement entry point** — principles, mandatory rules, enforcement (kept separate; never merged or duplicated with this constitution) |
| `docs/ARCHITECTURE/README.md` + `docs/ARCHITECTURE/` | Architecture charter + C4 diagram set |
| `governance/decisions/` | `docs/adr/` (decision log, one file per ADR) |
| `governance/change-log.md` | `docs/CHANGELOG.md` (release history; no duplicate copy is maintained) |
| `governance/interface-registry.md` | `docs/governance/interface-registry.md` |
| `governance/human-checkpoints.md` | `docs/governance/human-checkpoints.md` |
| `governance/ai-prompts/` | `docs/governance/ai-prompts/` |
| `governance/architecture-exceptions.md` | `docs/governance/architecture-exceptions.md` |

**Current Product.** The current implementation is **STEM-TUITION**, an
independent project (see `docs/ARCHITECTURE/README.md`). All ecosystem framing in
this document (LearningHubSTEM, STEM Lab, STEM Game, JARVIS) is **future vision
only** and does not authorize implementation now. Per §3, future products are not
current implementation scope unless explicitly activated by the human developer.

**Normative precedence.** When this constitution and `docs/RULES.md` are read
together: `docs/RULES.md` is the enforceable rules entry point; this constitution
is the governing development specification that frames how those rules are
designed, governed, and evolved. Neither duplicates the other — `RULES.md` owns
the rules, this document owns the development process and ecosystem direction.

Adoption recorded in `docs/adr/011-constitution-adoption.md`.

---

# 1. THE MOST IMPORTANT RULE

> **UNDERSTAND THE WHOLE VISION. BUILD ONLY THE CURRENT SCOPE.**

The agent must understand the long-term STEM ecosystem but must not attempt to
implement the entire ecosystem prematurely.

The architecture describes the destination.

The roadmap defines what is being built now.

The current task defines what the agent is allowed to change.

### Golden Rule

> **Architect for change. Implement for today.**

A future capability should influence a current architectural boundary only when
doing so is inexpensive, justified, and directly protects future extensibility.

A future capability must **not** cause speculative implementation.

---

# 2. THE FULL VISION

The long-term ecosystem may contain independent products including:

```text
LearningHubSTEM
STEM Tuition
STEM Lab
STEM Game
JARVIS
Future STEM products
```

These products are related but are **not features of one another**.

The long-term conceptual architecture is:

```text
                         STEM ECOSYSTEM
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       STEM Tuition        STEM Lab          STEM Game
        Learning          Experimentation    Simulation
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                             JARVIS
                         AI Assistant
                               │
                               ▼
                     Shared Platform Services
                               │
                               ▼
                       LearningHubSTEM
                    Knowledge Foundation
```

This is the **future vision only**.

It does not authorize implementation of these systems now.

---

# 3. CURRENT IMPLEMENTATION BOUNDARY

## 3.1 Current Product

The current implementation is:

> **STEM-TUITION**

The current product must remain independently useful.

It should be capable of eventually integrating with:

* LearningHubSTEM
* STEM Lab
* STEM Game
* JARVIS
* shared platform infrastructure

without requiring a fundamental rewrite.

However:

> **Future products are not current implementation scope unless explicitly activated by the human developer.**

---

# 4. NOW / SEAM / LATER / OUT OF SCOPE

Every significant implementation decision must be classified.

## NOW

Required by the current milestone.

**Implement.**

## SEAM

A small interface, adapter, contract, or boundary that protects the current
implementation from a known future change.

**Implement only when inexpensive and useful.**

## LATER

Described by the architecture but not required by the current milestone.

**Document if useful. Do not implement.**

## OUT OF SCOPE

Not relevant to the current product.

**Do not implement.**

---

# 5. SCOPE DISCIPLINE

Before writing code, the agent must answer:

```text
What is the current task?

What files are actually required?

Which architectural boundary does this affect?

Is this NOW, SEAM, LATER, or OUT OF SCOPE?

What is the smallest implementation that satisfies the requirement?
```

The agent must prefer:

```text
small working implementation
+
clean architectural boundary
+
tests
+
documentation
```

over:

```text
large generalized architecture
+
speculative infrastructure
+
unused abstractions
```

---

# 6. DO NOT BUILD THE FUTURE PREMATURELY

The agent must not create future infrastructure merely because it appears in this
document.

Do not prematurely implement:

* STEM Lab
* STEM Game
* JARVIS
* LearningHubSTEM production integration
* distributed microservices
* generalized platform services
* cloud simulation
* cross-product identity
* cross-product analytics
* generalized synchronization
* generalized AI orchestration

unless the current approved milestone explicitly requires them.

A future interface may be created when it directly protects the current
implementation.

A future system must not be implemented merely because its interface exists.

---

# 7. ROADMAP OVERRIDES VISION FOR IMPLEMENTATION

The repository must maintain:

```text
docs/ROADMAP.md
```

This file defines the current implementation scope.

Recommended structure:

```markdown
# NOW

Currently being built.

# NEXT

Approved upcoming work.

# LATER

Known future capabilities.

# VISION

Long-term ecosystem direction.
```

### Rule

> Architecture explains where the system can go. ROADMAP.md determines where it
> is allowed to go now.

An AI agent must not promote `LATER` work into `NOW` without human approval.

---

# 8. ARCHITECTURAL LAYERS

The long-term architecture is divided into four conceptual layers.

```text
┌──────────────────────────────────────────────┐
│                  PRODUCTS                    │
│                                              │
│ STEM Tuition │ STEM Lab │ STEM Game │ JARVIS │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│              DOMAIN CAPABILITIES              │
│                                              │
│ Learning │ Assessment │ Simulation │ AI       │
│ Experimentation │ Curriculum │ Knowledge      │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│             PLATFORM INFRASTRUCTURE           │
│                                              │
│ Identity │ Storage │ Events │ Search │ API    │
│ Analytics │ Notifications │ Sync │ Telemetry  │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│             KNOWLEDGE FOUNDATION              │
│                                              │
│                 LearningHubSTEM               │
└──────────────────────────────────────────────┘
```

This is a **target architecture**.

The current STEM-TUITION implementation may contain only a small subset.

---

# 9. LEARNINGHUBSTEM IS NOT STEM TUITION

LearningHubSTEM is intended to become the authoritative structured STEM knowledge
foundation.

It owns concepts, relationships, curriculum mappings, definitions, prerequisites,
and reusable STEM knowledge.

STEM Tuition is a learning application that consumes and presents knowledge.

Therefore:

> STEM Tuition must not become the authoritative owner of reusable STEM knowledge
> merely because it currently stores local content.

---

# 10. CONTENT VS KNOWLEDGE

These concepts must remain distinct.

### Knowledge

```text
Force
Mass
Acceleration
Velocity
Energy
```

and relationships:

```text
Force → related_to → Acceleration
Acceleration → depends_on → Velocity
Force → requires → Mass
```

### Curriculum

```text
Grade
 → Subject
 → Course
 → Unit
 → Chapter
 → Lesson
```

### Learning state

```text
Student
 → completed Lesson
 → mastered Concept
 → needs review Concept
```

These are different models and must not be collapsed into one structure.

---

# 11. LEARNINGHUBSTEM INTEGRATION

STEM Tuition must not depend directly on LearningHubSTEM's internal
implementation.

Use an adapter/provider boundary.

```text
LearningHubSTEM
       │
       ▼
LearningHubAdapter
       │
       ▼
ContentProvider
       │
       ├── LocalContentProvider
       ├── CachedContentProvider
       └── LearningHubStemProvider
```

The current implementation may use:

```text
LocalContentProvider
```

The remote provider may be implemented later.

> **Planned seam only.** `ContentProvider` is tracked as a planned seam in
> `docs/governance/interface-registry.md`. It is documented but **not**
> implemented as part of any current milestone unless explicitly approved.
> No LearningHubSTEM integration is implemented today.

---

# 12. PROVIDER PRINCIPLE

Where a dependency is expected to change, use an explicit provider boundary.

Examples:

```text
ContentProvider
ProgressProvider
SimulationEngine
Renderer
AIProvider
StorageProvider
```

However:

> Do not create an abstraction solely because something might theoretically change.

An abstraction is justified when it:

1. protects a current dependency,
2. has multiple real implementations,
3. is explicitly required by the current architecture,
4. or is a very low-cost seam protecting an approved future integration.

---

# 13. INTERFACES BEFORE IMPLEMENTATION

Major architectural boundaries require an explicit interface before implementation.

However:

> Interfaces are proposed before implementation, but are not automatically frozen
> before they have been validated.

Process:

```text
Proposal
   ↓
Review
   ↓
Small implementation / contract test
   ↓
Validation
   ↓
Human approval
   ↓
Freeze
```

A human may choose to freeze an interface earlier when necessary.

AI agents must never freeze their own interfaces.

---

# 14. FROZEN INTERFACES

A frozen interface is a human-approved architectural contract.

Changes require:

1. human approval,
2. ADR,
3. interface registry update,
4. contract-test review,
5. re-freezing after the change.

Frozen interfaces must not be casually modified to make implementation easier.

If an implementation cannot satisfy a frozen interface, first determine whether:

* the implementation is wrong,
* an adapter is needed,
* or the interface genuinely needs revision.

Frozen interfaces are recorded in `docs/governance/interface-registry.md`.

---

# 15. DOMAIN OWNERSHIP

Every package must explicitly document:

```text
Owns
Does not own
Consumes
Provides
```

A package must not silently acquire responsibilities belonging to another package.

Example:

```text
content
Owns:
  content providers and content mapping

Does not own:
  rendering
  physics
  quiz evaluation
  progress persistence
```

---

# 16. EVENT BUS VS DIRECT CALLS

The Event Bus is for **notifications and decoupled reactions**.

Interfaces/providers are for **commands and queries requiring a response**.

Use:

```ts
contentProvider.getLesson(id)
quizEngine.evaluate(answer)
progressProvider.save(progress)
```

for direct operations.

Use events for:

```text
lesson:completed
quiz:answer-submitted
simulation:step-complete
progress:sync-failed
```

Do not route every function call through the Event Bus.

The Event Bus must not become an invisible dependency graph.

---

# 17. DEBUGGABILITY IS A FIRST-CLASS REQUIREMENT

Every significant subsystem must be inspectable without modifying source code.

Debugging must allow the developer to determine:

```text
What happened?
When did it happen?
Why did it happen?
Which component caused it?
Which provider was active?
What data entered the component?
What data left it?
What error occurred?
What fallback was used?
```

No temporary `console.log` debugging should be necessary.

---

# 18. STRUCTURED LOGGING

Use a central structured logger.

```ts
logger.debug(...)
logger.info(...)
logger.warn(...)
logger.error(...)
```

Logs should contain meaningful contextual fields such as:

```text
traceId
lessonId
sectionId
provider
contentVersion
event
operation
errorCode
```

Never log secrets or unnecessary personal information.

---

# 19. DEBUG PANELS

Debug capabilities should be modular.

Examples:

```text
?debug=true
?debug_events=true
?debug_content=true
?debug_progress=true
?debug_simulation=true
?debug_performance=true
?debug_render=true
?debug_quiz=true
```

Each package owns its own diagnostic information.

The application shell may display registered diagnostics without knowing package
internals.

---

# 20. TRACEABILITY

Significant operations should be traceable across subsystem boundaries.

Where practical:

```text
User action
   ↓
Lesson runtime
   ↓
Provider
   ↓
Event
   ↓
Progress
```

should be connected through a `traceId`.

This allows future developers and AI agents to reconstruct system flow.

---

# 21. DOCUMENTATION IS PART OF THE SYSTEM

Documentation is not optional commentary.

It is part of the architecture.

Every important system decision must leave a durable explanation.

The code explains **how**.

The documentation explains:

```text
why
ownership
boundaries
constraints
decisions
history
future intent
```

---

# 22. REQUIRED DOCUMENTATION STRUCTURE

The repository maintains the taxonomy defined in `docs/DOCS.md`. The concepts
below map onto that taxonomy (see the Adoption Note in §0.1) — the literal
top-level `governance/` directory is not created; the repository keeps everything
under `docs/`:

```text
docs/
├── CONSTITUTION.md            ← this development constitution
├── RULES.md                   ← normative enforcement entry point
├── ARCHITECTURE/              ← charter + C4 diagram set
├── ROADMAP.md
├── DOCS.md                    ← docs taxonomy
├── CHANGELOG.md               ← release history (change-log)
├── adr/                       ← decision log (governance/decisions)
├── policies/                  ← normative governance policies
├── guides/                    ← standards, guides, how-tos
├── governance/
│   ├── interface-registry.md
│   ├── human-checkpoints.md
│   ├── ai-prompts/
│   └── architecture-exceptions.md
└── component-registry/
```

Not every file must be created immediately.

Create the minimum required documentation for the current milestone.

---

# 23. PACKAGE README STANDARD

Every package must have a README containing:

```text
Purpose
Owns
Does not own
Dependencies
Public API
Implementations
Data flow
Testing
Debugging
Known limitations
Future extension points
```

The README should allow a new AI agent to understand the package without reading
the entire repository.

---

# 24. ARCHITECTURE DECISION RECORDS

Significant decisions must be recorded as ADRs in `docs/adr/`.

Examples:

```text
ADR-001-monorepo-structure
ADR-002-event-bus-contract
ADR-003-content-provider
ADR-004-offline-content
ADR-005-simulation-engine
```

ADRs are never silently rewritten to erase history.

If a decision changes:

```text
Old ADR
   ↓
Superseded
   ↓
New ADR
```

The historical reasoning remains available.

---

# 25. HUMAN CHECKPOINTS

Maintain:

```text
docs/governance/human-checkpoints.md
```

Record:

```text
Date
Decision
Status
Reason
Affected systems
```

This allows future agents to know what has already been approved.

An AI agent must not repeatedly ask the human to re-decide an already-approved
architectural decision unless new information materially changes the situation.

---

# 26. AI SESSION PROTOCOL

Every AI coding session must begin by reading, when relevant:

```text
README.md
docs/ROADMAP.md
docs/ARCHITECTURE/README.md
docs/governance/human-checkpoints.md
docs/governance/interface-registry.md
relevant ADRs
relevant package README
```

The agent must then determine:

```text
Current task
Current scope
Relevant package
Relevant interfaces
Relevant ADRs
Files expected to change
Potential architectural risks
Human decisions required
```

Before coding, the agent must state a concise implementation plan.

---

# 27. AI SESSION SCOPE CHECK

Before implementing anything, the agent must explicitly classify the work:

```text
NOW:
...

SEAM:
...

LATER:
...

OUT OF SCOPE:
...
```

If the requested task appears to require substantial expansion beyond the current
roadmap:

> Stop and ask for human approval before expanding the scope.

---

# 28. AI MUST NOT EXPAND SCOPE SILENTLY

The AI must not decide:

> "While I'm here, I'll build the authentication platform."

or:

> "This would be better as a microservice."

or:

> "Since STEM Lab will eventually need this, I'll implement the Lab engine now."

Such changes require explicit approval.

The agent should instead record:

```text
Future consideration:
...

Why it may matter:
...

Current solution:
...

Deferred implementation:
...
```

---

# 29. AI DECISION AUTHORITY

### AI may generally decide:

* implementation details,
* variable names,
* internal function structure,
* test structure,
* small refactors,
* non-breaking documentation improvements,
* bug fixes within established boundaries.

### AI must propose and request approval for:

* interface changes,
* package boundary changes,
* architectural pattern changes,
* new external dependencies,
* authentication changes,
* security model changes,
* database schema changes,
* external service integration,
* changes to LearningHubSTEM contracts,
* major performance architecture changes.

---

# 30. DECISION ESCALATION FORMAT

When human input is required:

```text
⚠️ HUMAN DECISION REQUIRED

Context:
...

Decision:
...

Why it matters:
...

Options:
A) ...
B) ...

Recommendation:
...

Current implementation is blocked because:
...
```

Do not bury architectural decisions inside implementation commentary.

---

# 31. AI SESSION COMPLETION REPORT

Every significant AI session must finish with:

```text
## Session Summary

### Scope
What task was addressed?

### Implemented
Files created/modified and purpose.

### Decisions
Decisions made within AI authority.

### Human Decisions Required
Any unresolved decisions.

### Interfaces
Interfaces created, changed, or proposed.

### Tests
Tests added or modified.

### Validation
Commands executed and results.

### Known Limitations
Anything incomplete or intentionally deferred.

### Deferred Work
Future work discovered but not implemented.

### How to Verify
Exact commands or steps.

### Architectural Notes
Anything future agents should know.
```

This report is the handoff mechanism between AI agents.

---

# 32. AI PROMPT PRESERVATION

Significant prompts that create architectural or governance artifacts should be
preserved under:

```text
docs/governance/ai-prompts/
```

This allows future maintainers to understand:

```text
what the AI was instructed to do
why a design emerged
which constraints existed
```

Do not preserve every trivial coding prompt.

Preserve prompts that materially influence architecture, governance, schemas, or
major system design.

---

# 33. CODING STANDARD

TypeScript must use strict mode.

Prefer:

```text
strict
noUncheckedIndexedAccess
exactOptionalPropertyTypes
noImplicitReturns
noFallthroughCasesInSwitch
```

Avoid:

```text
any
@ts-ignore
unsafe casts
implicit global state
hidden side effects
magic numbers
hardcoded curriculum content
direct storage access outside its provider
direct external API access from UI
```

Any exception must be documented.

---

# 34. CONTENT IS DATA

Educational content must not be embedded in React components.

Prefer:

```text
content
   ↓
provider
   ↓
lesson runtime
   ↓
renderer
```

over:

```text
React component
   ↓
hardcoded lesson
```

However, canonical knowledge ownership must remain conceptually separate from the
application model.

STEM Tuition may maintain local content while LearningHubSTEM integration is
unavailable.

---

# 35. CONTENT FORMAT

The STEM Tuition runtime should consume a stable internal model.

Example:

```ts
interface LessonContent {
  id: string
  version: string
  metadata: LessonMetadata
  sections: LessonSection[]
  questions: Question[]
  simulations: SimulationConfig[]
  challenge: ChallengeConfig
}
```

The model is an **application consumption model**, not necessarily the universal
canonical representation of STEM knowledge.

---

# 36. FUTURE KNOWLEDGE INTEGRATION

When LearningHubSTEM becomes active:

```text
LearningHubSTEM
       ↓
adapter
       ↓
validated application model
       ↓
STEM Tuition runtime
```

The application must not expose LearningHubSTEM's internal schema throughout the
product.

This preserves independence.

---

# 37. SECURITY

Security-sensitive decisions require human review.

Never place secrets in frontend code.

Never expose:

```text
API keys
private tokens
database credentials
service secrets
```

through public client-side configuration.

External content must pass:

```text
schema validation
   ↓
sanitisation
   ↓
trusted application model
   ↓
rendering
```

Never execute content as code.

Never use:

```text
eval()
new Function()
unsafe HTML rendering
```

with untrusted input.

---

# 38. ERROR HANDLING

Use structured application errors.

Errors should contain:

```text
code
message
recoverable
context
```

Never silently swallow errors.

Every failure must have an intentional outcome:

```text
retry
fallback
continue without feature
reset
escalate
```

The user-facing error should be understandable.

The diagnostic error should contain enough information to debug the problem.

---

# 39. TESTING

Tests should validate behavior and contracts rather than merely increase coverage
numbers.

Priority:

```text
1. Core logic
2. Interface contract tests
3. Integration tests
4. Component tests
5. End-to-end tests
```

Every provider implementation should be tested against the same contract wherever
practical.

Example:

```text
LocalContentProvider
LearningHubStemProvider
CachedContentProvider
        │
        ▼
same ContentProvider contract tests
```

This protects provider interchangeability.

---

# 40. AUTOMATION

Automate repetitive verification.

The repository should eventually provide commands such as:

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm test:unit
pnpm test:integration
pnpm validate:content
pnpm check:architecture
pnpm check:no-secrets
pnpm check:interfaces
pnpm check:environment
pnpm build
```

Automation should enforce architecture rather than merely document it.

---

# 41. ARCHITECTURE ENFORCEMENT

Where practical, architecture rules must be machine-enforced.

Examples:

```text
forbidden imports
naming rules
TypeScript strictness
secret detection
content validation
interface contracts
event namespace registration
formatting
tests
```

A rule that can be reliably automated should not depend solely on human memory.

---

# 42. DEPENDENCY POLICY

New dependencies require justification.

The agent must explain:

```text
What problem does this solve?
Why existing dependencies are insufficient?
Runtime impact
Maintenance health
Security implications
License
Alternatives
```

Human approval is required for significant new dependencies.

Do not introduce dependencies merely for convenience.

---

# 43. SHARED PLATFORM RULE

Future shared infrastructure must be extracted only when genuinely shared.

Good candidates:

```text
identity
storage
events
AI gateway
search
telemetry
configuration
notifications
```

Product/domain capabilities such as:

```text
lesson rendering
quiz evaluation
physics
experimentation
adaptive learning
```

should not automatically become platform infrastructure.

Avoid creating a giant "shared" package.

---

# 44. PRODUCT INDEPENDENCE

Future products must remain independently understandable.

For example:

```text
STEM Tuition
STEM Lab
STEM Game
JARVIS
```

may consume shared services, but one product must not become the implementation
owner of another product.

Integration should happen through explicit contracts.

Example:

```text
STEM Tuition
      │
      │ ExperimentRequest
      ▼
STEM Lab
      │
      │ ExperimentResult
      ▼
STEM Tuition
```

rather than embedding the entire STEM Lab implementation inside STEM Tuition.

---

# 45. "BUILD SMALL" ARCHITECTURAL TEST

Before adding a major abstraction, ask:

```text
Does the current product actually need this?

Does it protect an already-known boundary?

Can the same outcome be achieved more simply?

Will this create maintenance work before it creates value?

Is this architecture or premature infrastructure?
```

If the answer indicates premature infrastructure:

> Do not implement it.

Document the future possibility instead.

---

# 46. DEBUG → DOCUMENT → FIX → VERIFY

The standard development loop is:

```text
Observe
   ↓
Reproduce
   ↓
Trace
   ↓
Understand
   ↓
Document cause
   ↓
Fix
   ↓
Test
   ↓
Verify
   ↓
Record important lesson
```

Do not patch symptoms repeatedly without understanding the underlying boundary.

---

# 47. ARCHITECTURAL EXCEPTIONS

If a rule must be violated, do not silently violate it.

Record:

```text
docs/governance/architecture-exceptions.md
```

with:

```text
Rule violated
Reason
Affected files
Risk
Temporary or permanent
Human approval
Review date
```

Exceptions must be visible to future AI agents.

---

# 48. CHANGE CONTROL

Changes should be classified as:

### Patch

Internal implementation correction without contract change.

### Minor architectural change

New capability within an existing boundary.

### Major architectural change

Changes:

* interfaces,
* package ownership,
* event contracts,
* security boundaries,
* external integrations,
* data models,
* or system architecture.

Major changes require:

```text
ADR
human review
implementation
tests
documentation update
```

---

# 49. SOURCE OF TRUTH HIERARCHY

When documents disagree, use this order:

```text
1. Human-approved current decision
2. Current ADR
3. Frozen interface registry
4. Current architecture specification
5. ROADMAP.md
6. Package README
7. Implementation
8. AI assumptions
```

If two authoritative documents conflict:

> Do not silently choose.

Flag the conflict for human review.

---

# 50. FUTURE-AGENT COMPATIBILITY

Every significant architectural choice should be understandable by an AI agent
that has never seen the project before.

Therefore:

* do not rely on tribal knowledge,
* do not hide architectural assumptions in code,
* do not use unexplained magic,
* document non-obvious decisions,
* preserve historical decisions,
* make package boundaries explicit,
* provide reproducible verification commands.

The repository itself must contain enough information for a new agent to become
productive without reconstructing the entire history from conversation logs.

---

# 51. MINIMUM CONTEXT FOR A NEW AI AGENT

A new AI agent should be able to orient itself by reading:

```text
README.md
docs/ROADMAP.md
docs/ARCHITECTURE/README.md
docs/governance/human-checkpoints.md
docs/governance/interface-registry.md
relevant package README
relevant ADRs
```

This should provide:

```text
Where am I?
What am I building?
Why is it structured this way?
What is currently in scope?
What must not change?
What has already been decided?
What can I safely modify?
What requires human approval?
How do I verify my work?
```

---

# 52. DEFINITION OF A GOOD IMPLEMENTATION

A good implementation is NOT the implementation containing the most abstraction.

A good implementation is:

```text
Small
Clear
Tested
Documented
Observable
Secure
Within scope
Architecturally replaceable where justified
Easy for another human or AI to understand
```

The system should grow through **small verified increments**.

---

# 53. DEVELOPMENT PHILOSOPHY

The ecosystem should evolve approximately like this:

```text
                     FUTURE VISION
                          │
                          │
                    Architecture
                          │
                          │
                       Roadmap
                          │
                          │
                    Current Task
                          │
                          ▼
                  Smallest Useful
                    Implementation
                          │
                    ┌─────┴─────┐
                    ▼           ▼
                  Tests     Documentation
                    │           │
                    └─────┬─────┘
                          ▼
                       Verify
                          │
                          ▼
                     Human Review
                          │
                          ▼
                       Commit
                          │
                          ▼
                      Next Slice
```

Never reverse this process by building the entire architecture first and
searching for a product afterward.

---

# 54. FINAL COMMANDMENT TO AI AGENTS

When uncertain, remember:

> **You are not responsible for building the entire vision today.**

> **You are responsible for leaving today's system better structured, better
> documented, better tested, and easier to extend tomorrow.**

> **Do not confuse architectural awareness with implementation scope.**

> **Do not silently expand scope.**

> **Do not hide decisions.**

> **Do not destroy boundaries for convenience.**

> **Do not create complexity without present value.**

> **Build the smallest correct thing, preserve the important seams, document the
> reasoning, test the result, and leave a clear trail for the next human or AI.**

---

# 55. THE OPERATING PRINCIPLE

## Understand the whole system.

## Respect the current boundary.

## Build one vertical slice.

## Make the behavior observable.

## Make the decision traceable.

## Make the implementation replaceable where justified.

## Document what matters.

## Test what matters.

## Ask the human when architecture changes.

## Leave the system ready for the next slice.

**Architect for change. Implement for today.**
