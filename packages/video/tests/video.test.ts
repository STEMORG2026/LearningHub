import { describe, it, expect } from 'vitest';
import { createSession, startSession, endSession, joinSession, leaveSession, getSession, getSessionParticipants, getLiveSessions } from '../src/internal/video';
import { isSessionLive, getParticipantCount } from '../src/types';

describe('video', () => {
  it('creates a session', () => {
    const s = createSession('host-1', 'Physics Lesson');
    expect(s.title).toBe('Physics Lesson');
    expect(s.status).toBe('scheduled');
    expect(s.hostId).toBe('host-1');
  });

  it('starts a session', () => {
    const s = createSession('host-2', 'Math');
    const live = startSession(s.id);
    expect(live!.status).toBe('live');
    expect(live!.startedAt).toBeGreaterThan(0);
  });

  it('ends a session', () => {
    const s = createSession('host-3', 'Chemistry');
    startSession(s.id);
    const ended = endSession(s.id);
    expect(ended!.status).toBe('ended');
  });

  it('joins a live session', () => {
    const s = createSession('host-4', 'Biology');
    startSession(s.id);
    const p = joinSession(s.id, 'student-1');
    expect(p).not.toBeNull();
    expect(p!.joinedAt).toBeGreaterThan(0);
  });

  it('does not join a non-live session', () => {
    const s = createSession('host-5', 'History');
    const p = joinSession(s.id, 'student-1');
    expect(p).toBeNull();
  });

  it('leaves a session', () => {
    const s = createSession('host-6', 'English');
    startSession(s.id);
    joinSession(s.id, 'student-1');
    expect(leaveSession(s.id, 'student-1')).toBe(true);
  });

  it('returns false leaving nonexistent session', () => {
    expect(leaveSession('nope', 'x')).toBe(false);
  });

  it('gets session participants', () => {
    const s = createSession('host-7', 'Geography');
    startSession(s.id);
    joinSession(s.id, 'a');
    joinSession(s.id, 'b');
    const list = getSessionParticipants(s.id);
    expect(list.length).toBe(2);
  });

  it('gets live sessions', () => {
    const s = createSession('host-8', 'Music');
    startSession(s.id);
    const live = getLiveSessions();
    expect(live.some((l) => l.id === s.id)).toBe(true);
  });

  describe('helpers', () => {
    it('isSessionLive returns true for live', () => {
      const s = createSession('host-9', 'Art');
      startSession(s.id);
      expect(isSessionLive(s)).toBe(true);
    });

    it('isSessionLive returns false for null', () => {
      expect(isSessionLive(null)).toBe(false);
    });

    it('getParticipantCount counts active', () => {
      const s = createSession('host-10', 'PE');
      startSession(s.id);
      joinSession(s.id, 'x');
      joinSession(s.id, 'y');
      leaveSession(s.id, 'x');
      const participants = getSessionParticipants(s.id);
      expect(getParticipantCount(participants)).toBe(1);
    });
  });
});
