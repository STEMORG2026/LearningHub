# @learninghub/auth

**Version:** 1.0.0

User authentication — login, register, session management, role-based access control.

## Public API

- `register(request)` — Create a new user account
- `login(request)` — Authenticate and create a session
- `logout(token)` — Invalidate a session
- `validateSession(token)` — Check if a session is valid
- `getAuthState(token)` — Get current authentication state
- `requireRole(user, role)` — Check if user has required role
- `hasRole(user, role)` — Role hierarchy check
- `tracedLogin` — Traced login wrapper

## Events

- `auth:login` — Published when a user logs in

## Dependencies

- `@learninghub/core` (EventBus)
- `@learninghub/tracer` (instrumentation)
