export interface MetricPoint {
  timestamp: number;
  value: number;
  labels?: Record<string, string>;
}

export interface MetricSeries {
  name: string;
  description: string;
  unit: string;
  points: MetricPoint[];
}

export interface VisibilityQuery {
  metric: string;
  since?: number;
  until?: number;
  labels?: Record<string, string>;
  limit?: number;
}

export interface AggregationResult {
  count: number;
  sum: number;
  avg: number;
  min: number;
  max: number;
}

export class MetricsRegistry {
  private series = new Map<string, MetricSeries>();

  register(name: string, description: string, unit: string): void {
    if (!this.series.has(name)) {
      this.series.set(name, { name, description, unit, points: [] });
    }
  }

  record(name: string, value: number, labels?: Record<string, string>): void {
    const series = this.series.get(name);
    if (series) {
      series.points.push({ timestamp: Date.now(), value, ...(labels ? { labels } : {}) });
    }
  }

  query(q: VisibilityQuery): MetricPoint[] {
    const series = this.series.get(q.metric);
    if (!series) return [];

    let results = series.points;
    if (q.since) results = results.filter((p) => p.timestamp >= q.since!);
    if (q.until) results = results.filter((p) => p.timestamp <= q.until!);
    if (q.labels) {
      results = results.filter((p) =>
        Object.entries(q.labels!).every(([k, v]) => p.labels?.[k] === v)
      );
    }
    if (q.limit) results = results.slice(-q.limit);

    return results;
  }

  aggregate(q: VisibilityQuery): AggregationResult {
    const points = this.query(q);
    if (points.length === 0) {
      return { count: 0, sum: 0, avg: 0, min: 0, max: 0 };
    }
    const values = points.map((p) => p.value);
    return {
      count: values.length,
      sum: values.reduce((a, b) => a + b, 0),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  listMetrics(): string[] {
    return Array.from(this.series.keys());
  }

  getSeries(name: string): MetricSeries | null {
    return this.series.get(name) ?? null;
  }
}

export const globalMetrics = new MetricsRegistry();
