import { describe, it, expect } from 'vitest';
import { AuditLog, globalAuditLog } from '../src/audit';

describe('pj-audit', () => {
  it('logs an entry with auto-generated id and timestamp', () => {
    const entry = globalAuditLog.log({
      type: 'task:started',
      sessionId: 'sess-1',
      userId: 'user-1',
      details: { task: 'test' },
    });
    expect(entry.id).toBeDefined();
    expect(entry.timestamp).toBeGreaterThan(0);
    expect(entry.type).toBe('task:started');
  });

  it('queries by session id', () => {
    const log = new AuditLog();
    log.log({ type: 'task:started', sessionId: 's1', userId: 'u1', details: {} });
    log.log({ type: 'task:completed', sessionId: 's1', userId: 'u1', details: {} });
    log.log({ type: 'task:started', sessionId: 's2', userId: 'u2', details: {} });

    const results = log.query({ sessionId: 's1' });
    expect(results.length).toBe(2);
  });

  it('queries by event type', () => {
    const log = new AuditLog();
    log.log({ type: 'task:started', sessionId: 's1', userId: 'u1', details: {} });
    log.log({ type: 'task:completed', sessionId: 's1', userId: 'u1', details: {} });
    log.log({ type: 'error', sessionId: 's2', userId: 'u2', details: {} });

    const errors = log.query({ type: 'error' });
    expect(errors.length).toBe(1);
    expect(errors[0].type).toBe('error');
  });

  it('queries by user id', () => {
    const log = new AuditLog();
    log.log({ type: 'task:started', sessionId: 's1', userId: 'alice', details: {} });
    log.log({ type: 'task:started', sessionId: 's2', userId: 'bob', details: {} });

    const aliceActivity = log.getUserActivity('alice');
    expect(aliceActivity.length).toBe(1);
    expect(aliceActivity[0].userId).toBe('alice');
  });

  it('queries by time range', () => {
    const log = new AuditLog();
    const now = Date.now();
    log.log({ type: 'task:started', sessionId: 's1', userId: 'u1', details: {} });

    const recent = log.query({ since: now - 1000 });
    expect(recent.length).toBe(1);

    const future = log.query({ since: now + 100000 });
    expect(future.length).toBe(0);
  });

  it('limits query results', () => {
    const log = new AuditLog();
    for (let i = 0; i < 10; i++) {
      log.log({ type: 'task:started', sessionId: `s${i}`, userId: 'u1', details: {} });
    }
    const results = log.query({ limit: 5 });
    expect(results.length).toBe(5);
  });

  it('gets session trace sorted by time descending', () => {
    const log = new AuditLog();
    log.log({ type: 'task:started', sessionId: 's1', userId: 'u1', details: { step: 1 } });
    log.log({ type: 'task:completed', sessionId: 's1', userId: 'u1', details: { step: 2 } });

    const trace = log.getSessionTrace('s1');
    expect(trace.length).toBe(2);
    expect(trace[0].timestamp).toBeGreaterThanOrEqual(trace[1].timestamp);
  });

  it('clears all entries', () => {
    const log = new AuditLog();
    log.log({ type: 'task:started', sessionId: 's1', userId: 'u1', details: {} });
    expect(log.size).toBe(1);
    log.clear();
    expect(log.size).toBe(0);
  });
});
