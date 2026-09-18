import { getDefaultEventBus } from '@learninghub/core';
import { traced } from '@learninghub/tracer';
import type { VideoSession, VideoParticipant } from '../types';
import { isSessionLive } from '../types';

const sessions = new Map<string, VideoSession>();
const participants = new Map<string, VideoParticipant[]>();

export function createSession(hostId: string, title: string, maxParticipants = 100): VideoSession {
  const session: VideoSession = {
    id: crypto.randomUUID(),
    hostId,
    title,
    status: 'scheduled',
    startedAt: null,
    endedAt: null,
    maxParticipants,
  };
  sessions.set(session.id, session);
  participants.set(session.id, []);
  getDefaultEventBus().publish('video:session-created', {
    data: { sessionId: session.id, hostId, title },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return session;
}

export function startSession(sessionId: string): VideoSession | null {
  const session = sessions.get(sessionId);
  if (!session) return null;
  session.status = 'live';
  session.startedAt = Date.now();
  sessions.set(sessionId, session);
  getDefaultEventBus().publish('video:session-started', {
    data: { sessionId },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return session;
}

export function endSession(sessionId: string): VideoSession | null {
  const session = sessions.get(sessionId);
  if (!session) return null;
  session.status = 'ended';
  session.endedAt = Date.now();
  sessions.set(sessionId, session);
  getDefaultEventBus().publish('video:session-ended', {
    data: { sessionId },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return session;
}

export function joinSession(sessionId: string, userId: string, role: 'host' | 'participant' = 'participant'): VideoParticipant | null {
  const session = sessions.get(sessionId);
  if (!session || !isSessionLive(session)) return null;
  const participant: VideoParticipant = {
    sessionId,
    userId,
    role,
    joinedAt: Date.now(),
    leftAt: null,
  };
  const list = participants.get(sessionId) ?? [];
  list.push(participant);
  participants.set(sessionId, list);
  getDefaultEventBus().publish('video:participant-joined', {
    data: { sessionId, userId, role },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return participant;
}

export function leaveSession(sessionId: string, userId: string): boolean {
  const list = participants.get(sessionId);
  if (!list) return false;
  const p = list.find((p) => p.userId === userId && p.leftAt === null);
  if (!p) return false;
  p.leftAt = Date.now();
  getDefaultEventBus().publish('video:participant-left', {
    data: { sessionId, userId },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return true;
}

export function getSession(sessionId: string): VideoSession | null {
  return sessions.get(sessionId) ?? null;
}

export function getSessionParticipants(sessionId: string): VideoParticipant[] {
  return participants.get(sessionId) ?? [];
}

export function getLiveSessions(): VideoSession[] {
  return Array.from(sessions.values()).filter((s) => isSessionLive(s));
}

export const tracedCreateSession = traced('video:session-created', createSession);
export const tracedStartSession = traced('video:session-started', startSession);
export const tracedJoinSession = traced('video:participant-joined', joinSession);
