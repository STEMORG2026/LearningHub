import { initEventBus } from '@stem-tuition/core';
import { initTracer } from '@stem-tuition/tracer';
import '@stem-tuition/quiz-engine';

export function initEngines(page: string): void {
  initTracer();
  const bus = initEventBus();
  bus.publish('nav:page-changed', {
    data: { page },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
}
