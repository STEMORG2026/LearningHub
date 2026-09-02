import { initEventBus } from '@learninghub/core';
import { initTracer } from '@learninghub/tracer';
import '@learninghub/quiz-engine';

export function initEngines(page: string): void {
  initTracer();
  const bus = initEventBus();
  bus.publish('nav:page-changed', {
    data: { page },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
}
