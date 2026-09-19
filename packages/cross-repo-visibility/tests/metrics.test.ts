import { describe, it, expect } from 'vitest';
import { MetricsRegistry, globalMetrics } from '../src/metrics';

describe('cross-repo-visibility', () => {
  describe('MetricsRegistry', () => {
    it('registers a metric series', () => {
      const reg = new MetricsRegistry();
      reg.register('inference.latency', 'Inference latency', 'ms');
      expect(reg.listMetrics()).toContain('inference.latency');
    });

    it('does not duplicate registrations', () => {
      const reg = new MetricsRegistry();
      reg.register('test.metric', 'Test', 'count');
      reg.register('test.metric', 'Test', 'count');
      expect(reg.listMetrics().length).toBe(1);
    });

    it('records data points', () => {
      const reg = new MetricsRegistry();
      reg.register('test.metric', 'Test', 'count');
      reg.record('test.metric', 100);
      reg.record('test.metric', 200);
      expect(reg.getSeries('test.metric')?.points.length).toBe(2);
    });

    it('queries by time range', () => {
      const reg = new MetricsRegistry();
      reg.register('test.metric', 'Test', 'count');
      const now = Date.now();
      reg.record('test.metric', 100);
      const results = reg.query({ metric: 'test.metric', since: now - 1000 });
      expect(results.length).toBe(1);
    });

    it('queries by labels', () => {
      const reg = new MetricsRegistry();
      reg.register('test.metric', 'Test', 'count');
      reg.record('test.metric', 100, { service: 'pj' });
      reg.record('test.metric', 200, { service: 'lh' });

      const results = reg.query({ metric: 'test.metric', labels: { service: 'pj' } });
      expect(results.length).toBe(1);
      expect(results[0].value).toBe(100);
    });

    it('limits query results', () => {
      const reg = new MetricsRegistry();
      reg.register('test.metric', 'Test', 'count');
      for (let i = 0; i < 10; i++) {
        reg.record('test.metric', i);
      }
      const results = reg.query({ metric: 'test.metric', limit: 3 });
      expect(results.length).toBe(3);
    });

    it('aggregates data', () => {
      const reg = new MetricsRegistry();
      reg.register('test.metric', 'Test', 'count');
      reg.record('test.metric', 100);
      reg.record('test.metric', 200);
      reg.record('test.metric', 300);

      const agg = reg.aggregate({ metric: 'test.metric' });
      expect(agg.count).toBe(3);
      expect(agg.sum).toBe(600);
      expect(agg.avg).toBe(200);
      expect(agg.min).toBe(100);
      expect(agg.max).toBe(300);
    });

    it('returns empty aggregation for missing metric', () => {
      const reg = new MetricsRegistry();
      const agg = reg.aggregate({ metric: 'nonexistent' });
      expect(agg.count).toBe(0);
    });

    it('returns null for missing series', () => {
      const reg = new MetricsRegistry();
      expect(reg.getSeries('nonexistent')).toBeNull();
    });
  });

  describe('globalMetrics', () => {
    it('is a singleton instance', () => {
      expect(globalMetrics).toBeDefined();
      expect(globalMetrics.listMetrics()).toBeDefined();
    });
  });
});
