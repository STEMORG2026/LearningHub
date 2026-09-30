import { describe, it, expect, beforeEach } from 'vitest';
import { Tracer } from '../src/tracer';
import { traced, traceDecorator } from '../src/decorator';

describe('Tracer', () => {
  let tracer: Tracer;

  beforeEach(() => {
    Tracer.resetInstance();
    tracer = Tracer.getInstance();
    tracer.reset();
  });

  describe('startSpan / endSpan', () => {
    it('creates a span with given name', () => {
      const span = tracer.startSpan('test-span');
      expect(span.name).toBe('test-span');
      expect(span.status).toBe('running');
      expect(span.spanId).toBeTruthy();
      expect(span.parentSpanId).toBeNull();
      expect(span.startTime).toBeGreaterThan(0);
      expect(span.endTime).toBeNull();
      expect(span.duration).toBeNull();
    });

    it('sets endTime and duration on endSpan', () => {
      const span = tracer.startSpan('timed');
      tracer.endSpan(span);
      expect(span.endTime).toBeGreaterThan(0);
      expect(span.duration).not.toBeNull();
      expect(span.duration).toBeGreaterThanOrEqual(0);
      expect(span.status).toBe('completed');
    });

    it('merges metadata on endSpan', () => {
      const span = tracer.startSpan('meta', { metadata: { key: 'value' } });
      tracer.endSpan(span, { extra: 'data' });
      expect(span.metadata.key).toBe('value');
      expect(span.metadata.extra).toBe('data');
    });

    it('does not double-end a span', () => {
      const span = tracer.startSpan('once');
      tracer.endSpan(span);
      const d1 = span.duration;
      tracer.endSpan(span);
      expect(span.duration).toBe(d1);
    });
  });

  describe('span tree / nesting', () => {
    it('auto-nests spans via active stack', () => {
      const parent = tracer.startSpan('parent');
      const child = tracer.startSpan('child');
      const grandchild = tracer.startSpan('grandchild');

      expect(child.parentSpanId).toBe(parent.spanId);
      expect(grandchild.parentSpanId).toBe(child.spanId);

      tracer.endSpan(grandchild);
      tracer.endSpan(child);
      tracer.endSpan(parent);
    });

    it('explicit parentSpanId overrides automatic nesting', () => {
      const s1 = tracer.startSpan('s1');
      const s2 = tracer.startSpan('s2', { parentSpanId: s1.spanId });
      expect(s2.parentSpanId).toBe(s1.spanId);
      tracer.endSpan(s2);
      tracer.endSpan(s1);
    });

    it('getSpanTree returns root spans with children attached', () => {
      tracer.startSpan('root1');
      tracer.startSpan('child1');
      tracer.endSpan(tracer.getActiveSpan()!);
      tracer.endSpan(tracer.getActiveSpan()!);
      tracer.startSpan('root2');
      tracer.endSpan(tracer.getActiveSpan()!);

      const tree = tracer.getSpanTree();
      expect(tree).toHaveLength(2);
      const r1 = tree[0];
      expect(r1.name).toBe('root1');
      expect((r1 as typeof r1 & { children: typeof r1[] }).children).toHaveLength(1);
    });
  });

  describe('errorSpan', () => {
    it('marks span as errored and captures error info', () => {
      const span = tracer.startSpan('failing');
      const error = new Error('something broke');
      tracer.errorSpan(span, error);
      expect(span.status).toBe('errored');
      expect(span.metadata.errorName).toBe('Error');
      expect(span.metadata.errorMessage).toBe('something broke');
      expect(span.duration).not.toBeNull();
    });
  });

  describe('getCurrentTraceId', () => {
    it('returns a trace ID', () => {
      const id = tracer.getCurrentTraceId();
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });

    it('returns same trace ID for multiple calls before reset', () => {
      const id1 = tracer.getCurrentTraceId();
      const id2 = tracer.getCurrentTraceId();
      expect(id1).toBe(id2);
    });

    it('generates new trace ID after reset', () => {
      const id1 = tracer.getCurrentTraceId();
      tracer.reset();
      const id2 = tracer.getCurrentTraceId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('getActiveSpan', () => {
    it('returns the most recently started span', () => {
      tracer.startSpan('first');
      const second = tracer.startSpan('second');
      expect(tracer.getActiveSpan()?.spanId).toBe(second.spanId);
      tracer.endSpan(second);
      tracer.endSpan(tracer.getActiveSpan()!);
    });

    it('returns null when no span is active', () => {
      expect(tracer.getActiveSpan()).toBeNull();
    });
  });

  describe('getAllSpans', () => {
    it('returns all spans', () => {
      tracer.startSpan('a');
      tracer.startSpan('b');
      tracer.endSpan(tracer.getActiveSpan()!);
      tracer.endSpan(tracer.getActiveSpan()!);
      expect(tracer.getAllSpans()).toHaveLength(2);
    });
  });

  describe('event listeners', () => {
    it('notifies on span start and end', () => {
      const events: string[] = [];
      tracer.on((event) => events.push(event.type));

      const span = tracer.startSpan('notified');
      tracer.endSpan(span);

      expect(events).toEqual(['span-start', 'span-end']);
    });

    it('unsubscribe removes listener', () => {
      const events: string[] = [];
      const unsub = tracer.on((event) => events.push(event.type));
      unsub();

      tracer.startSpan('ghost');
      expect(events).toHaveLength(0);
    });
  });

  describe('disabled tracer', () => {
    it('returns noop spans when disabled', () => {
      Tracer.resetInstance();
      const disabled = new Tracer({ enabled: false });
      Tracer.setInstance(disabled);
      const span = disabled.startSpan('noop');
      expect(span.spanId).toBe('');
      expect(span.status).toBe('completed');
    });

    it('returns a noop span once maxSpans is reached', () => {
      Tracer.resetInstance();
      const capped = new Tracer({ maxSpans: 1 });
      const first = capped.startSpan('first');
      const second = capped.startSpan('second');

      expect(first.spanId).toBeTruthy();
      // Second span is dropped, so it never enters the store and is completed
      // immediately rather than left running.
      expect(second.spanId).toBe('');
      expect(second.status).toBe('completed');
      expect(capped.getAllSpans()).toHaveLength(1);
    });

    it('stops accepting spans exactly at the cap boundary', () => {
      Tracer.resetInstance();
      const capped = new Tracer({ maxSpans: 2 });
      capped.startSpan('a');
      capped.startSpan('b');
      const third = capped.startSpan('c');

      expect(third.spanId).toBe('');
      expect(capped.getAllSpans()).toHaveLength(2);
    });

    it('reports no current trace id when disabled', () => {
      Tracer.resetInstance();
      const disabled = new Tracer({ enabled: false });
      expect(disabled.getCurrentTraceId()).toBeNull();
    });
  });

  describe('getTrace', () => {
    it('returns every span belonging to the given trace id', () => {
      tracer.startSpan('a');
      tracer.startSpan('b');
      const traceId = tracer.getCurrentTraceId()!;

      const spans = tracer.getTrace(traceId);
      expect(spans).toHaveLength(2);
      expect(spans.every((s) => s.traceId === traceId)).toBe(true);
    });

    it('returns an empty array for a trace id that matches nothing', () => {
      tracer.startSpan('a');
      expect(tracer.getTrace('no-such-trace')).toEqual([]);
    });

    it('returns an empty array when no spans have been recorded', () => {
      expect(tracer.getTrace('anything')).toEqual([]);
    });

    it('does not leak spans from a previous trace after reset', () => {
      tracer.startSpan('old');
      const oldTrace = tracer.getCurrentTraceId()!;
      tracer.reset();
      tracer.startSpan('new');

      expect(tracer.getTrace(oldTrace)).toEqual([]);
    });
  });

  describe('destroy', () => {
    it('clears listeners so no further events are delivered', () => {
      const events: string[] = [];
      tracer.on((event) => events.push(event.type));

      tracer.destroy();
      tracer.startSpan('after-destroy');

      expect(events).toHaveLength(0);
    });

    it('clears recorded spans', () => {
      tracer.startSpan('doomed');
      tracer.destroy();
      expect(tracer.getAllSpans()).toEqual([]);
    });

    it('rotates the trace id', () => {
      const before = tracer.getCurrentTraceId();
      tracer.destroy();
      expect(tracer.getCurrentTraceId()).not.toBe(before);
    });

    it('leaves the tracer usable for new spans', () => {
      tracer.destroy();
      const span = tracer.startSpan('fresh');
      expect(span.spanId).toBeTruthy();
      expect(tracer.getAllSpans()).toHaveLength(1);
    });
  });

  describe('span stack bookkeeping', () => {
    it('restores the parent as active after a child ends', () => {
      const parent = tracer.startSpan('parent');
      const child = tracer.startSpan('child');
      expect(tracer.getActiveSpan()?.spanId).toBe(child.spanId);

      tracer.endSpan(child);
      expect(tracer.getActiveSpan()?.spanId).toBe(parent.spanId);
    });

    it('unwinds to no active span once every span ends', () => {
      const span = tracer.startSpan('solo');
      tracer.endSpan(span);
      expect(tracer.getActiveSpan()).toBeNull();
    });

    it('removes an errored span from the active stack', () => {
      const span = tracer.startSpan('fails');
      tracer.errorSpan(span, new Error('nope'));
      expect(tracer.getActiveSpan()).toBeNull();
    });

    it('does not double-error an already-ended span', () => {
      const span = tracer.startSpan('done');
      tracer.endSpan(span);
      tracer.errorSpan(span, new Error('late'));
      expect(span.status).toBe('completed');
    });

    it('ignores errorSpan on an already-errored span', () => {
      const span = tracer.startSpan('err');
      tracer.errorSpan(span, new Error('first'));
      const d1 = span.duration;
      tracer.errorSpan(span, new Error('second'));

      expect(span.metadata.errorMessage).toBe('first');
      expect(span.duration).toBe(d1);
    });
  });
});

describe('traced() wrapper', () => {
  let tracer: Tracer;

  beforeEach(() => {
    Tracer.resetInstance();
    tracer = Tracer.getInstance();
    tracer.reset();
  });

  it('traces a synchronous function', () => {
    const fn = traced('sync-fn', (x: number, y: number) => x + y);
    const result = fn(2, 3);
    expect(result).toBe(5);

    const spans = tracer.getAllSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0]?.name).toBe('sync-fn');
    expect(spans[0]?.status).toBe('completed');
  });

  it('traces a throwing function', () => {
    const fn = traced('throw-fn', (_x: number) => { throw new Error('boom'); });
    expect(() => fn(1)).toThrow('boom');

    const spans = tracer.getAllSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0]?.status).toBe('errored');
  });

  it('traces an async function', async () => {
    const fn = traced('async-fn', async (x: number) => {
      await Promise.resolve();
      return x * 2;
    });
    const result = await fn(5);
    expect(result).toBe(10);

    const spans = tracer.getAllSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0]?.name).toBe('async-fn');
    expect(spans[0]?.status).toBe('completed');
  });

  it('errors the span when an async function rejects', async () => {
    const fn = traced('async-reject', async () => {
      await Promise.resolve();
      throw new Error('async boom');
    });

    await expect(fn()).rejects.toThrow('async boom');

    const spans = tracer.getAllSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0]?.status).toBe('errored');
    expect(spans[0]?.metadata.errorMessage).toBe('async boom');
  });

  it('errors the span when a returned promise rejects later', async () => {
    const fn = traced('deferred-reject', () => Promise.reject(new Error('deferred')));

    await expect(fn()).rejects.toThrow('deferred');

    const spans = tracer.getAllSpans();
    expect(spans[0]?.status).toBe('errored');
    expect(spans[0]?.metadata.errorName).toBe('Error');
  });

  it('leaves the span running until the returned promise settles', async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });

    const fn = traced('slow', async () => {
      await gate;
      return 'ok';
    });

    const pending = fn();
    // The span is still open because the wrapped promise has not settled.
    expect(tracer.getAllSpans()[0]?.status).toBe('running');

    release();
    await pending;
    expect(tracer.getAllSpans()[0]?.status).toBe('completed');
  });
});

describe('@trace decorator', () => {
  let tracer: Tracer;

  beforeEach(() => {
    Tracer.resetInstance();
    tracer = Tracer.getInstance();
    tracer.reset();
  });

  it('traces a class method', () => {
    class MyService {
      @traceDecorator()
      greet(name: string): string {
        return `Hello, ${name}!`;
      }
    }
    const service = new MyService();
    const result = service.greet('World');
    expect(result).toBe('Hello, World!');

    const spans = tracer.getAllSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0]?.name).toBe('MyService.greet');
    expect(spans[0]?.status).toBe('completed');
  });

  it('uses custom span name when provided', () => {
    class MyService {
      @traceDecorator('custom-span')
      doStuff(): number {
        return 42;
      }
    }
    const service = new MyService();
    service.doStuff();

    const spans = tracer.getAllSpans();
    expect(spans[0]?.name).toBe('custom-span');
  });

  it('marks span as errored when method throws', () => {
    class Fragile {
      @traceDecorator()
      break(): never {
        throw new Error('crashed');
      }
    }
    const fragile = new Fragile();
    expect(() => fragile.break()).toThrow('crashed');

    const spans = tracer.getAllSpans();
    expect(spans[0]?.status).toBe('errored');
  });

  it('traces async class methods', async () => {
    class AsyncService {
      @traceDecorator()
      async fetch(): Promise<string> {
        await Promise.resolve();
        return 'data';
      }
    }
    const service = new AsyncService();
    const result = await service.fetch();
    expect(result).toBe('data');

    const spans = tracer.getAllSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0]?.status).toBe('completed');
  });

  it('marks the span errored when an async method rejects', async () => {
    class FlakyService {
      @traceDecorator()
      async fetch(): Promise<string> {
        await Promise.resolve();
        throw new Error('remote failed');
      }
    }
    const service = new FlakyService();

    await expect(service.fetch()).rejects.toThrow('remote failed');

    const spans = tracer.getAllSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0]?.status).toBe('errored');
    expect(spans[0]?.metadata.errorMessage).toBe('remote failed');
  });

  it('propagates the rejection to the caller rather than swallowing it', async () => {
    class FlakyService {
      @traceDecorator()
      async fetch(): Promise<never> {
        return Promise.reject(new Error('propagated'));
      }
    }

    await expect(new FlakyService().fetch()).rejects.toThrow('propagated');
  });

  it('keeps the span running until an async method settles', async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });

    class SlowService {
      @traceDecorator()
      async run(): Promise<string> {
        await gate;
        return 'done';
      }
    }

    const pending = new SlowService().run();
    expect(tracer.getAllSpans()[0]?.status).toBe('running');

    release();
    await pending;
    expect(tracer.getAllSpans()[0]?.status).toBe('completed');
  });

  it('derives the span name from the target class and method', () => {
    const decorator = traceDecorator();
    const descriptor: PropertyDescriptor = {
      value: function () { return 'v'; },
      writable: true,
      enumerable: false,
      configurable: true,
    };

    const applied = decorator({ constructor: { name: 'Anon' } }, 'method', descriptor);
    expect(applied).toBe(descriptor);

    applied.value.call({}, undefined);
    expect(tracer.getAllSpans()[0]?.name).toBe('Anon.method');
  });

  it('marks the span errored when the decorator wraps a throwing method', () => {
    class Boom {
      @traceDecorator('named-boom')
      go(): never {
        throw new Error('decorated boom');
      }
    }

    expect(() => new Boom().go()).toThrow('decorated boom');
    const spans = tracer.getAllSpans();
    expect(spans[0]?.name).toBe('named-boom');
    expect(spans[0]?.status).toBe('errored');
  });
});
