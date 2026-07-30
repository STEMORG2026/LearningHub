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
});
