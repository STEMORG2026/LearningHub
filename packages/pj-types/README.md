# @learninghub/pj-types

**Version:** 1.0.0

Shared type declarations for the LearningHub ↔ PROFESSOR-J integration seam.

This package is **type-declaration only** — it exports interfaces and type aliases and
emits no runtime code. It exists so both sides of the integration agree on the shape of
the chat protocol and the ecosystem topology without either importing the other.

See ADR-022 (Ecosystem Architecture — LearningHub as Information Head, PROFESSOR-J as
Worker).

## Public API

All exports are types (erased at compile time):

- `ChatMessage` — a single message in a conversation turn
- `ChatMessageRole` — the role union (`user` | `assistant` | `system`)
- `ChatRequest` — an outbound request to the PROFESSOR-J chat endpoint
- `ChatResponse` — the response returned by PROFESSOR-J
- `EcosystemInfo` — the ecosystem topology description served by PROFESSOR-J
- `ServiceInfo` — metadata for one service in the ecosystem
- `ProfessorJOptions` — client configuration options

## Consumers

- `@learninghub/pj-client` — the HTTP client that implements the protocol
- `@learninghub/pj-audit`, `@learninghub/pj-policy`, `@learninghub/cross-repo-visibility`

## Dependencies

None. This package is a leaf so any consumer can depend on it freely.

## Coverage note

Because every export is a type, this package emits no executable statements and its
coverage floor is documented as `0%` in `vitest.config.ts`. See the justification there
and `docs/RULES.md` → Coverage Ratchet.
