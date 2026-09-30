import { describe, it, expect, vi } from 'vitest';
import { EventBus, initEventBus } from '../src/event-bus';
import type { EventPayload } from '../src/types';

const makePayload = <T>(data: T, overrides?: Partial<EventPayload<T>>): EventPayload<T> => ({
  data,
  timestamp: new Date().toISOString(),
  schemaVersion: '1.0',
  ...overrides,
});

describe('EventBus', () => {
  it('publishes and receives an event', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.subscribe('quiz:answer-submitted', handler);
    const payload = makePayload({ answer: 'F=ma' });
    bus.publish('quiz:answer-submitted', payload);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(payload);
  });

  it('does not call subscriber for non-matching event', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.subscribe('quiz:completed', handler);
    bus.publish('quiz:answer-submitted', makePayload({ answer: '42' }));
    expect(handler).not.toHaveBeenCalled();
  });

  it('supports wildcard subscription with *', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.subscribe('*', handler);
    bus.publish('quiz:started', makePayload({ quizId: 'q1', conceptId: 'c1', questionCount: 5, difficulty: 'easy' }));
    bus.publish('audio:play-sound', makePayload({ sound: 'correct', volume: 0.8, loop: false }));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('supports domain wildcard subscription (quiz:*)', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.subscribe('quiz:*', handler);
    bus.publish('quiz:started', makePayload({ quizId: 'q1', conceptId: 'c1', questionCount: 5, difficulty: 'easy' }));
    bus.publish('quiz:completed', makePayload({ quizId: 'q1', conceptId: 'c1', score: 8, total: 10, percentage: 80, timeSpentMs: 5000, misconceptionsIdentified: 1 }));
    bus.publish('audio:play-sound', makePayload({ sound: 'correct', volume: 0.8, loop: false }));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  // ─────────────────────────────────────────────────────────
  // patternToRegex — anchoring & escaping
  //
  // These two properties were previously untested: removing the regex
  // anchors, or removing the escape of regex metacharacters, left the
  // entire suite green (verified by mutation testing, 2026-09-30).
  // ─────────────────────────────────────────────────────────

  it('anchors an exact pattern so suffix variants do not match', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.subscribe('lesson:quiz', handler);

    bus.publish('lesson:quiz', makePayload({ ok: true }));
    bus.publish('lesson:quiz:extra', makePayload({ ok: false }));
    bus.publish('lesson:quiz-suffix', makePayload({ ok: false }));
    bus.publish('prefix:lesson:quiz', makePayload({ ok: false }));

    // Only the exact event is delivered — no prefix/suffix leakage.
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('treats regex metacharacters in a pattern as literals', () => {
    const bus = new EventBus();
    const dot = vi.fn();
    const plus = vi.fn();
    bus.subscribe('a.b', dot);
    bus.subscribe('a+b', plus);

    // With correct escaping these must NOT match: `.` is not "any char",
    // and `+` is not a quantifier.
    bus.publish('axb', makePayload({}));
    bus.publish('aab', makePayload({}));
    expect(dot).not.toHaveBeenCalled();
    expect(plus).not.toHaveBeenCalled();

    // But the literal forms do match.
    bus.publish('a.b', makePayload({}));
    bus.publish('a+b', makePayload({}));
    expect(dot).toHaveBeenCalledTimes(1);
    expect(plus).toHaveBeenCalledTimes(1);
  });

  it('still matches a trailing wildcard across suffixes', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.subscribe('lesson:*', handler);
    bus.publish('lesson:start', makePayload({}));
    bus.publish('lesson:end:detail', makePayload({}));
    bus.publish('other:start', makePayload({}));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('unsubscribe removes specific handler', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.subscribe('test:event', handler);
    bus.unsubscribe('test:event', handler);
    bus.publish('test:event', makePayload({}));
    expect(handler).not.toHaveBeenCalled();
  });

  it('subscribe returns an unsubscribe function', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const unsub = bus.subscribe('test:event', handler);
    unsub();
    bus.publish('test:event', makePayload({}));
    expect(handler).not.toHaveBeenCalled();
  });

  it('clear removes all subscribers', () => {
    const bus = new EventBus();
    const h1 = vi.fn();
    const h2 = vi.fn();
    bus.subscribe('a:*', h1);
    bus.subscribe('b:*', h2);
    bus.clear();
    bus.publish('a:event', makePayload({}));
    bus.publish('b:event', makePayload({}));
    expect(h1).not.toHaveBeenCalled();
    expect(h2).not.toHaveBeenCalled();
    expect(bus.getSubscriberCount()).toBe(0);
  });

  it('getSubscriberCount returns correct count', () => {
    const bus = new EventBus();
    expect(bus.getSubscriberCount()).toBe(0);
    bus.subscribe('a:x', vi.fn());
    bus.subscribe('b:y', vi.fn());
    expect(bus.getSubscriberCount()).toBe(2);
  });

  it('handles multiple subscribers for same event', () => {
    const bus = new EventBus();
    const h1 = vi.fn();
    const h2 = vi.fn();
    bus.subscribe('test:event', h1);
    bus.subscribe('test:event', h2);
    const payload = makePayload({ value: 42 });
    bus.publish('test:event', payload);
    expect(h1).toHaveBeenCalledWith(payload);
    expect(h2).toHaveBeenCalledWith(payload);
  });

  it('passes correct payload structure', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.subscribe('quiz:completed', handler);
    const payload = makePayload(
      { score: 8, total: 10, percentage: 80, timeSpentMs: 5000, misconceptionsIdentified: 1 },
      { schemaVersion: '1.0' },
    );
    bus.publish('quiz:completed', payload);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ score: 8, total: 10 }),
        schemaVersion: '1.0',
        timestamp: expect.any(String),
      }),
    );
  });

  it('setDebugMode controls debug logging', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const bus = new EventBus({ debug: true });
    bus.publish('test:event', makePayload({}));
    expect(consoleSpy).toHaveBeenCalledWith('[EVENT BUS] test:event', expect.any(Object));
    bus.setDebugMode(false);
    bus.publish('test:event-2', makePayload({}));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  it('initializes with debug mode from initEventBus query param', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const originalLocation = (globalThis as Record<string, unknown>).location;
    (globalThis as Record<string, unknown>).location = { search: '?debug_events=true' } as Location;
    const bus = initEventBus();
    bus.publish('test:event', makePayload({}));
    expect(consoleSpy).toHaveBeenCalledWith('[EVENT BUS] test:event', expect.any(Object));
    consoleSpy.mockRestore();
    (globalThis as Record<string, unknown>).location = originalLocation;
  });

  describe('error isolation (REL-004 regression)', () => {
    it('delivers to later subscribers even when an earlier one throws', () => {
      // Guards against the defect where one throwing subscriber aborted dispatch
      // and silently muted every subscriber registered after it.
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const bus = new EventBus();
      const reached: string[] = [];

      bus.subscribe('a:*', () => {
        reached.push('first');
        throw new Error('subscriber 1 boom');
      });
      bus.subscribe('a:*', () => {
        reached.push('second');
      });

      expect(() => bus.publish('a:test', makePayload({}))).not.toThrow();
      expect(reached).toEqual(['first', 'second']);
      errorSpy.mockRestore();
    });

    it('keeps delivering to remaining subscribers across multiple failures', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const bus = new EventBus();
      const reached: string[] = [];

      bus.subscribe('a:*', () => { reached.push('one'); throw new Error('boom 1'); });
      bus.subscribe('a:*', () => { reached.push('two'); throw new Error('boom 2'); });
      bus.subscribe('a:*', () => { reached.push('three'); });

      bus.publish('a:test', makePayload({}));
      expect(reached).toEqual(['one', 'two', 'three']);
      errorSpy.mockRestore();
    });

    it('does not throw out of publish() when a subscriber fails', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const bus = new EventBus();
      bus.subscribe('b:*', () => { throw new Error('boom'); });
      expect(() => bus.publish('b:test', makePayload({}))).not.toThrow();
      errorSpy.mockRestore();
    });

    it('reports the failing pattern via onSubscriberError', () => {
      const bus = new EventBus();
      const seen: { type: string; pattern: string }[] = [];
      (bus as unknown as {
        onSubscriberError: (type: string, pattern: string, error: unknown) => void;
      }).onSubscriberError = (type, pattern) => { seen.push({ type, pattern }); };

      bus.subscribe('c:*', () => { throw new Error('boom'); });
      bus.publish('c:test', makePayload({}));
      expect(seen).toEqual([{ type: 'c:test', pattern: 'c:*' }]);
    });
  });
});
