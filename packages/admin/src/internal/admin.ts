import { getDefaultEventBus } from '@learninghub/core';
import { traced } from '@learninghub/tracer';
import type { AdminUser, SystemStats, UserFilters, PagedResult } from '../types';

// In-memory user store (shared with auth package in production)
const adminUsers = new Map<string, AdminUser>();

export function getSystemStats(): SystemStats {
  const users = Array.from(adminUsers.values());
  const activeUsers = users.filter((u) => u.isActive).length;
  return {
    totalUsers: users.length,
    activeUsers,
    totalLessons: 0,
    totalQuizzes: 0,
    averageScore: 0,
    uptime: Date.now(),
  };
}

export function listUsers(filters?: UserFilters, page = 1, pageSize = 20): PagedResult<AdminUser> {
  let users = Array.from(adminUsers.values());
  if (filters?.role) {
    users = users.filter((u) => u.role === filters.role);
  }
  if (filters?.isActive !== undefined) {
    users = users.filter((u) => u.isActive === filters.isActive);
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    users = users.filter((u) => u.email.includes(s) || u.name.toLowerCase().includes(s));
  }
  const start = (page - 1) * pageSize;
  return {
    items: users.slice(start, start + pageSize),
    total: users.length,
    page,
    pageSize,
  };
}

export function updateUser(userId: string, updates: Partial<AdminUser>): AdminUser | null {
  const user = adminUsers.get(userId);
  if (!user) return null;
  const updated = { ...user, ...updates };
  adminUsers.set(userId, updated);
  getDefaultEventBus().publish('admin:user-updated', {
    data: { userId },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return updated;
}

export function deactivateUser(userId: string): boolean {
  return updateUser(userId, { isActive: false }) !== null;
}

export const tracedGetSystemStats = traced('admin:stats', getSystemStats);
export const tracedListUsers = traced('admin:list-users', listUsers);
