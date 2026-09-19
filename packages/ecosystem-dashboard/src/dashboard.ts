export interface DashboardStats {
  totalServices: number;
  healthyServices: number;
  degradedServices: number;
  lastUpdated: number;
}

export interface ServiceHealth {
  serviceId: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTimeMs: number;
  lastChecked: number;
  details?: string;
}

export interface DashboardConfig {
  refreshIntervalMs: number;
  alertThresholds: {
    responseTimeMs: number;
    errorRate: number;
  };
}

const DEFAULT_CONFIG: DashboardConfig = {
  refreshIntervalMs: 30000,
  alertThresholds: { responseTimeMs: 2000, errorRate: 0.05 },
};

export class EcosystemDashboard {
  private config: DashboardConfig;
  private services: Map<string, ServiceHealth> = new Map();

  constructor(config: Partial<DashboardConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  registerService(id: string, name: string): void {
    this.services.set(id, {
      serviceId: id,
      name,
      status: 'down',
      responseTimeMs: 0,
      lastChecked: 0,
    });
  }

  updateHealth(serviceId: string, health: Partial<ServiceHealth>): void {
    const existing = this.services.get(serviceId);
    if (existing) {
      this.services.set(serviceId, { ...existing, ...health, lastChecked: Date.now() });
    }
  }

  getServiceHealth(serviceId: string): ServiceHealth | null {
    return this.services.get(serviceId) ?? null;
  }

  getAllServices(): ServiceHealth[] {
    return Array.from(this.services.values());
  }

  getStats(): DashboardStats {
    const services = this.getAllServices();
    return {
      totalServices: services.length,
      healthyServices: services.filter((s) => s.status === 'healthy').length,
      degradedServices: services.filter((s) => s.status === 'degraded').length,
      lastUpdated: Date.now(),
    };
  }

  getAlerts(): ServiceHealth[] {
    return this.getAllServices().filter(
      (s) =>
        s.status === 'down' ||
        s.responseTimeMs > this.config.alertThresholds.responseTimeMs
    );
  }

  getSystemHealth(): 'healthy' | 'degraded' | 'down' {
    const stats = this.getStats();
    if (stats.totalServices === 0) return 'down';
    if (stats.degradedServices > 0 || stats.healthyServices < stats.totalServices) return 'degraded';
    return 'healthy';
  }
}

export function formatHealthStatus(status: string): string {
  switch (status) {
    case 'healthy': return '🟢 Healthy';
    case 'degraded': return '🟡 Degraded';
    case 'down': return '🔴 Down';
    default: return '⚪ Unknown';
  }
}
