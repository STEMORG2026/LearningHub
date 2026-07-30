import type { Span, TracerConfig, StartSpanOptions, TracerListener, TracerEvent } from './types';

function generateId(): string {
  return crypto.randomUUID();
}

const DEFAULT_CONFIG: Required<TracerConfig> = {
  enabled: true,
  maxSpans: 10_000,
};

export class Tracer {
  private static instance: Tracer | null = null;

  private spans: Map<string, Span> = new Map();
  private activeStack: string[] = [];
  private traceId: string;
  private config: Required<TracerConfig>;
  private listeners: Set<TracerListener> = new Set();

  constructor(config?: TracerConfig) {
    this.traceId = generateId();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  static getInstance(config?: TracerConfig): Tracer {
    if (!Tracer.instance) {
      Tracer.instance = new Tracer(config);
    }
    return Tracer.instance;
  }

  static setInstance(tracer: Tracer): void {
    Tracer.instance = tracer;
  }

  static resetInstance(): void {
    Tracer.instance = null;
  }

  startSpan(name: string, options?: StartSpanOptions): Span {
    if (!this.config.enabled) {
      return this.noopSpan(name);
    }

    if (this.spans.size >= this.config.maxSpans) {
      return this.noopSpan(name);
    }

    const parentSpanId = options?.parentSpanId ?? this.activeSpanId();

    const span: Span = {
      spanId: generateId(),
      parentSpanId: parentSpanId ?? null,
      traceId: this.traceId,
      name,
      startTime: performance.now(),
      endTime: null,
      duration: null,
      status: 'running',
      metadata: { ...options?.metadata },
    };

    this.spans.set(span.spanId, span);
    this.activeStack.push(span.spanId);

    this.dispatch({ type: 'span-start', span });

    return span;
  }

  endSpan(span: Span, metadata?: Record<string, unknown>): void {
    if (span.status !== 'running') return;

    span.endTime = performance.now();
    span.duration = span.endTime - span.startTime;
    span.status = 'completed';

    if (metadata) {
      Object.assign(span.metadata, metadata);
    }

    this.popStack(span.spanId);
    this.dispatch({ type: 'span-end', span });
  }

  errorSpan(span: Span, error: Error): void {
    if (span.status !== 'running') return;

    span.endTime = performance.now();
    span.duration = span.endTime - span.startTime;
    span.status = 'errored';
    span.metadata.errorName = error.name;
    span.metadata.errorMessage = error.message;

    this.popStack(span.spanId);
    this.dispatch({ type: 'span-end', span });
  }

  getCurrentTraceId(): string | null {
    return this.config.enabled ? this.traceId : null;
  }

  getActiveSpan(): Span | null {
    const id = this.activeSpanId();
    return id ? (this.spans.get(id) ?? null) : null;
  }

  getTrace(traceId: string): Span[] {
    const result: Span[] = [];
    for (const span of this.spans.values()) {
      if (span.traceId === traceId) {
        result.push(span);
      }
    }
    return result;
  }

  getAllSpans(): Span[] {
    return Array.from(this.spans.values());
  }

  getSpanTree(): Span[] {
    const roots: Span[] = [];
    const childrenMap = new Map<string, Span[]>();

    for (const span of this.spans.values()) {
      const parentId = span.parentSpanId;
      if (parentId === null) {
        roots.push(span);
      } else {
        const children = childrenMap.get(parentId) ?? [];
        children.push(span);
        childrenMap.set(parentId, children);
      }
    }

    const attachChildren = (spans: Span[]): Span[] => {
      return spans.map((span) => {
        const spanWithChildren = span as Span & { children: Span[] };
        const childSpans = childrenMap.get(span.spanId);
        if (childSpans && childSpans.length > 0) {
          spanWithChildren.children = attachChildren(childSpans);
        } else {
          spanWithChildren.children = [];
        }
        return spanWithChildren;
      });
    };

    return attachChildren(roots);
  }

  reset(): void {
    this.spans.clear();
    this.activeStack = [];
    this.traceId = generateId();
  }

  on(listener: TracerListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  destroy(): void {
    this.listeners.clear();
    this.reset();
  }

  private dispatch(event: TracerEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  private activeSpanId(): string | undefined {
    return this.activeStack.length > 0
      ? this.activeStack[this.activeStack.length - 1]
      : undefined;
  }

  private popStack(spanId: string): void {
    const idx = this.activeStack.lastIndexOf(spanId);
    if (idx !== -1) {
      this.activeStack.splice(idx, 1);
    }
  }

  private noopSpan(name: string): Span {
    return {
      spanId: '',
      parentSpanId: null,
      traceId: this.traceId,
      name,
      startTime: 0,
      endTime: 0,
      duration: 0,
      status: 'completed',
      metadata: {},
    };
  }
}
