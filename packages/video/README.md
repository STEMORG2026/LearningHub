# @learninghub/video

**Version:** 1.0.0

Video/Zoom integration — session management, participant tracking, recording.

## Public API

- `createSession(hostId, title, maxParticipants?)` — Create a video session
- `startSession(sessionId)` — Start a session (go live)
- `endSession(sessionId)` — End a session
- `joinSession(sessionId, userId, role?)` — Join a live session
- `leaveSession(sessionId, userId)` — Leave a session
- `getSession(sessionId)` — Get session details
- `getSessionParticipants(sessionId)` — List session participants
- `getLiveSessions()` — List all live sessions
- `isSessionLive(session)` — Check if session is live
- `getParticipantCount(participants)` — Count active participants
- `tracedCreateSession`, `tracedStartSession`, `tracedJoinSession` — Traced wrappers

## Events

- `video:session-created` — Published when session is created
- `video:session-started` — Published when session goes live
- `video:session-ended` — Published when session ends
- `video:participant-joined` — Published when participant joins
- `video:participant-left` — Published when participant leaves

## Dependencies

- `@learninghub/core` (EventBus)
- `@learninghub/tracer` (instrumentation)
