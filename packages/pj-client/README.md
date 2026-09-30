# @learninghub/pj-client

**Version:** 1.0.0

HTTP client for the PROFESSOR-J backend API — the worker side of the ADR-022 seam.

LearningHub is the Information Head; PROFESSOR-J is the Worker. This package is the
typed transport through which LearningHub asks PROFESSOR-J to execute AI tasks
(model routing, orchestration) and discovers the ecosystem topology.

## Public API

- `chat(request, options?)` — send a `ChatRequest` and await a `ChatResponse`
- `getEcosystemInfo(options?)` — fetch the ecosystem topology description
- `healthCheck(options?)` — probe the PROFESSOR-J backend; resolves `true` when reachable

`options` accepts `ProfessorJOptions` (base URL, model, timeout, token).

## Configuration

The base URL is resolved from the environment; when unset, calls degrade gracefully
rather than firing a request that cannot succeed.

- `VITE_PROFESSOR_J_URL` — PROFESSOR-J backend base URL

> ⚠️ `VITE_*` variables are **public by construction** — they are inlined into the
> client bundle. Never place a secret in one. See the `.env.example` and the note in
> `apps/shell/src/vite-env.d.ts`.

## Protocol

Talks to the PROFESSOR-J HTTP surface documented in ADR-022:

```text
LearningHub ──▶ POST /api/v1/chat ──▶ PROFESSOR-J (orchestration plane)
                     /api/v1/lh/ecosystem-info
```

## Status

`stable` / `incubating`. **This package currently has no consumer inside LearningHub** —
it is an integration surface awaiting the PROFESSOR-J wiring described in ADR-022.

## Dependencies

- `@learninghub/pj-types` (protocol types)
