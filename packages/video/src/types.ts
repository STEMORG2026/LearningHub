export interface VideoSession {
  id: string;
  hostId: string;
  title: string;
  status: 'scheduled' | 'live' | 'ended' | 'canceled';
  startedAt: number | null;
  endedAt: number | null;
  maxParticipants: number;
}

export interface VideoParticipant {
  sessionId: string;
  userId: string;
  role: 'host' | 'participant';
  joinedAt: number | null;
  leftAt: number | null;
}

export interface Recording {
  id: string;
  sessionId: string;
  url: string;
  duration: number;
  createdAt: number;
}

export function isSessionLive(session: VideoSession | null): boolean {
  if (!session) return false;
  return session.status === 'live' && session.startedAt !== null;
}

export function getParticipantCount(participants: VideoParticipant[]): number {
  return participants.filter((p) => p.leftAt === null && p.joinedAt !== null).length;
}
