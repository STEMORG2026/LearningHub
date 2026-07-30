export type SpanStatus = 'running' | 'completed' | 'errored';

export interface Span {
  spanId: string;
  parentSpanId: string | null;
  traceId: string;
  name: string;
  startTime: number;
  endTime: number | null;
  duration: number | null;
  status: SpanStatus;
  metadata: Record<string, unknown>;
}

export interface TracerConfig {
  enabled?: boolean;
  maxSpans?: number;
}

export interface StartSpanOptions {
  parentSpanId?: string;
  metadata?: Record<string, unknown>;
}

export interface TracerEvent {
  type: 'span-start' | 'span-end';
  span: Span;
}

export type TracerListener = (event: TracerEvent) => void;
