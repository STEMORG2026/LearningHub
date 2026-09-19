import { describe, it, expect } from 'vitest';
import { EcosystemDashboard, formatHealthStatus } from '../src/dashboard';

describe('ecosystem-dashboard', () => {
  describe('EcosystemDashboard', () => {
    it('registers services', () => {
      const dash = new EcosystemDashboard();
      dash.registerService('pj', 'PROFESSOR-J');
      dash.registerService('lh', 'LearningHub');
      expect(dash.getAllServices().length).toBe(2);
    });

    it('updates service health', () => {
      const dash = new EcosystemDashboard();
      dash.registerService('pj', 'PROFESSOR-J');
      dash.updateHealth('pj', { status: 'healthy', responseTimeMs: 150 });
      const health = dash.getServiceHealth('pj');
      expect(health?.status).toBe('healthy');
      expect(health?.responseTimeMs).toBe(150);
    });

    it('returns null for unknown service', () => {
      const dash = new EcosystemDashboard();
      expect(dash.getServiceHealth('unknown')).toBeNull();
    });

    it('calculates stats correctly', () => {
      const dash = new EcosystemDashboard();
      dash.registerService('pj', 'PROFESSOR-J');
      dash.registerService('lh', 'LearningHub');
      dash.updateHealth('pj', { status: 'healthy', responseTimeMs: 100 });
      dash.updateHealth('lh', { status: 'degraded', responseTimeMs: 3000 });

      const stats = dash.getStats();
      expect(stats.totalServices).toBe(2);
      expect(stats.healthyServices).toBe(1);
      expect(stats.degradedServices).toBe(1);
    });

    it('detects alerts for slow services', () => {
      const dash = new EcosystemDashboard({ alertThresholds: { responseTimeMs: 1000, errorRate: 0.05 } });
      dash.registerService('pj', 'PROFESSOR-J');
      dash.updateHealth('pj', { status: 'healthy', responseTimeMs: 2500 });

      const alerts = dash.getAlerts();
      expect(alerts.length).toBe(1);
      expect(alerts[0].serviceId).toBe('pj');
    });

    it('detects alerts for down services', () => {
      const dash = new EcosystemDashboard();
      dash.registerService('pj', 'PROFESSOR-J');
      dash.updateHealth('pj', { status: 'down', responseTimeMs: 0 });

      const alerts = dash.getAlerts();
      expect(alerts.length).toBe(1);
    });

    it('returns healthy system when all services healthy', () => {
      const dash = new EcosystemDashboard();
      dash.registerService('pj', 'PROFESSOR-J');
      dash.updateHealth('pj', { status: 'healthy', responseTimeMs: 100 });

      expect(dash.getSystemHealth()).toBe('healthy');
    });

    it('returns degraded when any service degraded', () => {
      const dash = new EcosystemDashboard();
      dash.registerService('pj', 'PROFESSOR-J');
      dash.registerService('lh', 'LearningHub');
      dash.updateHealth('pj', { status: 'healthy', responseTimeMs: 100 });
      dash.updateHealth('lh', { status: 'degraded', responseTimeMs: 2000 });

      expect(dash.getSystemHealth()).toBe('degraded');
    });

    it('returns down when no services registered', () => {
      const dash = new EcosystemDashboard();
      expect(dash.getSystemHealth()).toBe('down');
    });
  });

  describe('formatHealthStatus', () => {
    it('formats healthy status', () => {
      expect(formatHealthStatus('healthy')).toBe('🟢 Healthy');
    });

    it('formats degraded status', () => {
      expect(formatHealthStatus('degraded')).toBe('🟡 Degraded');
    });

    it('formats down status', () => {
      expect(formatHealthStatus('down')).toBe('🔴 Down');
    });

    it('formats unknown status', () => {
      expect(formatHealthStatus('unknown')).toBe('⚪ Unknown');
    });
  });
});
