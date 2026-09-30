# @learninghub/admin

**Version:** 1.0.0

Admin dashboard — user management, system stats, user search and filtering.

## Public API

- `getSystemStats()` — Get overall system statistics
- `listUsers(filters?, page?, pageSize?)` — List users with optional filtering
- `createUser({ email, name, role?, isActive? })` — Create a user
- `updateUser(userId, updates)` — Update user properties
- `deactivateUser(userId)` — Deactivate a user account
- `tracedGetSystemStats`, `tracedListUsers` — Traced wrappers

## Events

- `admin:user-created` — Published when a user is created
- `admin:user-updated` — Published when a user is updated

## Dependencies

- `@learninghub/core` (EventBus)
- `@learninghub/tracer` (instrumentation)
