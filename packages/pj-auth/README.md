# @learninghub/pj-auth

**Version:** 1.0.0

Token and session state for the PROFESSOR-J integration seam (ADR-022).

Persists the authentication state LearningHub needs in order to call the PROFESSOR-J
backend, layered on top of `@learninghub/auth`.

## Public API

- `loadAuthState()` — read the persisted `AuthState`, or `null` when absent/corrupt
- `saveAuthState(state)` — persist an `AuthState`
- `clearAuthState()` — remove persisted state (sign-out)
- `getAuthToken()` — the current bearer token, or `null`
- `isAuthenticated()` — `true` when a usable token is present
- `getUser()` — the current `User`, or `null`

## Storage

State is held in `localStorage` under a package-scoped key. All reads are defensive: a
malformed or missing entry yields `null` rather than throwing, so a stale browser state
cannot break the app.

## Status

`stable` / `incubating`. **This package currently has no consumer inside LearningHub** —
it is an integration surface awaiting the PROFESSOR-J wiring described in ADR-022.

## Dependencies

- `@learninghub/auth` (session model and role handling)
