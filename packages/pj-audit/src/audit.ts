export type AuditEventType =
  | 'task:started'
  | 'task:completed'
  | 'task:failed'
  | 'chat:message'
  | 'chat:response'
  | 'error';

export interface AuditEntry {
  id: string;
  timestamp: number;
  type: AuditEventType;
  sessionId: string;
  userId: string;
  details: Record<string, unknown>;
  metadata?: {
    model?: string;
    agent?: string;
    durationMs?: number;
    tokenCount?: number;
  };
}

export interface AuditQuery {
  sessionId?: string;
  userId?: string;
  type?: AuditEventType;
  since?: number;
  until?: number;
  limit?: number;
}

export class AuditLog {
  private entries: AuditEntry[] = [];

  log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): AuditEntry {
    const full: AuditEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    this.entries.push(full);
    return full;
  }

  query(filter: AuditQuery = {}): AuditEntry[] {
    let results = [...this.entries];

    if (filter.sessionId) {
      results = results.filter((e) => e.sessionId === filter.sessionId);
    }
    if (filter.userId) {
      results = results.filter((e) => e.userId === filter.userId);
    }
    if (filter.type) {
      results = results.filter((e) => e.type === filter.type);
    }
    if (filter.since) {
      results = results.filter((e) => e.timestamp >= filter.since!);
    }
    if (filter.until) {
      results = results.filter((e) => e.timestamp <= filter.until!);
    }

    results.sort((a, b) => b.timestamp - a.timestamp);

    if (filter.limit) {
      results = results.slice(0, filter.limit);
    }

    return results;
  }

  getSessionTrace(sessionId: string): AuditEntry[] {
    return this.query({ sessionId, limit: 1000 });
  }

  getUserActivity(userId: string, limit = 50): AuditEntry[] {
    return this.query({ userId, limit });
  }

  getErrors(limit = 20): AuditEntry[] {
    return this.query({ type: 'error', limit });
  }

  clear(): void {
    this.entries = [];
  }

  get size(): number {
    return this.entries.length;
  }
}

export const globalAuditLog = new AuditLog();
