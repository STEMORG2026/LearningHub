# @learninghub/video

All notable changes to this package will be documented in this file.

## 1.0.0 — 2026-09-19

### Added
- Initial release: createSession, startSession, endSession, joinSession, leaveSession
- Session queries: getSession, getSessionParticipants, getLiveSessions
- Participant counting and session status helpers
- EventBus integration (video:session-created, video:session-started, video:session-ended, video:participant-joined, video:participant-left)
- Tracer instrumentation via tracedCreateSession, tracedStartSession, tracedJoinSession
- 11 unit tests
