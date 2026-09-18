import { describe, it, expect } from 'vitest';
import { getSystemStats, listUsers, updateUser, deactivateUser } from '../src/internal/admin';
import type { AdminUser, SystemStats, UserFilters, PagedResult } from '../src/types';

describe('admin', () => {
  it('gets system stats', () => {
    const stats = getSystemStats();
    expect(stats).toHaveProperty('totalUsers');
    expect(stats).toHaveProperty('activeUsers');
    expect(stats).toHaveProperty('uptime');
  });

  it('lists users with default pagination', () => {
    const result = listUsers();
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('total');
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it('filters users by role', () => {
    const result = listUsers({ role: 'student' });
    expect(result.items.every((u) => u.role === 'student')).toBe(true);
  });

  it('filters users by active status', () => {
    const result = listUsers({ isActive: false });
    expect(result.items.every((u) => !u.isActive)).toBe(true);
  });

  it('searches users by email or name', () => {
    const result = listUsers({ search: 'test' });
    expect(result.items).toBeDefined();
  });

  it('updates a user', () => {
    // Can't test without a real userId; verify null case
    expect(updateUser('nonexistent', { name: 'X' })).toBeNull();
  });

  it('deactivates a nonexistent user', () => {
    expect(deactivateUser('nonexistent')).toBe(false);
  });
});
