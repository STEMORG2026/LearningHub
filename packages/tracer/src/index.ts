import { Tracer } from './tracer';
import { showDashboard } from './dashboard';

export { Tracer };
export type { Span, SpanStatus, TracerConfig, TracerEvent, TracerListener } from './types';
export { traced, traceDecorator, trace } from './decorator';
export { TracerDashboard, registerDashboard, showDashboard, hideDashboard } from './dashboard';

export function initTracer(config?: { enabled?: boolean }): void {
  const tracer = Tracer.getInstance({ enabled: config?.enabled ?? true });

  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const traceParam = params.get('trace');
  const debugParam = params.get('debug_events');

  if (traceParam === 'true' || traceParam === '1') {
    showDashboard();
  }

  if (debugParam === 'true' || debugParam === '1') {
    setupDebugConsole(tracer);
  }
}

function setupDebugConsole(tracer: Tracer): void {
  const originalLog = console.log.bind(console);
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);

  const prefix = (method: string): string => {
    const traceId = tracer.getCurrentTraceId();
    const ts = new Date().toISOString().slice(11, 23);
    return `[${ts}] [TRACE:${traceId?.slice(0, 8) ?? '---'}] [${method}]`;
  };

  console.log = (...args: unknown[]) => {
    originalLog(prefix('LOG'), ...args);
  };

  console.warn = (...args: unknown[]) => {
    originalWarn(prefix('WARN'), ...args);
  };

  console.error = (...args: unknown[]) => {
    originalError(prefix('ERROR'), ...args);
  };
}
