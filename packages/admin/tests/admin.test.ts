import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getDefaultEventBus } from '@learninghub/core';
import {
  getSystemStats,
  listUsers,
  createUser,
  updateUser,
  deactivateUser,
  tracedGetSystemStats,
  tracedListUsers,
} from '../src/internal/admin';
import type { AdminUser, UserFilters, PagedResult } from '../src/types';

// The store is module-private and process-wide, so every test uses distinct
// ids/emails to stay order-independent (same discipline as packages/progress).
let seq = 0;
function uniq(prefix: string): string {
  seq += 1;
  return `${prefix}-${seq}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeUser(over: Partial<AdminUser> = {}): AdminUser {
  const id = uniq('seed');
  return createUser({
    email: `${id}@example.com`,
    name: `User ${id}`,
    ...over,
  });
}

describe('admin', () => {
  beforeEach(() => {
    getDefaultEventBus().clear();
  });

  afterEach(() => {
    getDefaultEventBus().clear();
  });

  describe('createUser', () => {
    it('creates a user with sensible defaults', () => {
      const user = makeUser();

      expect(user.id).toBeTruthy();
      expect(user.role).toBe('student');
      expect(user.isActive).toBe(true);
      expect(user.lastLoginAt).toBeNull();
      expect(user.loginCount).toBe(0);
      expect(user.createdAt).toBeGreaterThan(0);
    });

    it('honours an explicit role and isActive', () => {
      const user = makeUser({ role: 'teacher', isActive: false });
      expect(user.role).toBe('teacher');
      expect(user.isActive).toBe(false);
    });

    it('assigns a unique id per user', () => {
      const a = makeUser();
      const b = makeUser();
      expect(a.id).not.toBe(b.id);
    });

    it('makes the new user visible to getSystemStats', () => {
      const before = getSystemStats().totalUsers;
      makeUser();
      expect(getSystemStats().totalUsers).toBe(before + 1);
    });

    it('counts only active users toward activeUsers', () => {
      const before = getSystemStats();
      makeUser({ isActive: false });
      const after = getSystemStats();

      expect(after.totalUsers).toBe(before.totalUsers + 1);
      expect(after.activeUsers).toBe(before.activeUsers);
    });

    it('publishes admin:user-created', () => {
      // The bus delivers the EventPayload, not a `{type, payload}` envelope, so
      // the topic is identified by which subscription fired.
      const events: Array<{ data: { userId?: string }; timestamp: string; schemaVersion: string }> = [];
      getDefaultEventBus().subscribe('admin:user-created', (payload) => {
        events.push(payload as unknown as (typeof events)[number]);
      });

      const user = makeUser();

      expect(events).toHaveLength(1);
      expect(events[0]?.data.userId).toBe(user.id);
      expect(events[0]?.schemaVersion).toBe('1.0');
      expect(events[0]?.timestamp).toBeTruthy();
    });
  });

  describe('getSystemStats', () => {
    it('returns the full stats shape with zeroed counters', () => {
      const stats = getSystemStats();
      expect(stats).toHaveProperty('totalUsers');
      expect(stats).toHaveProperty('activeUsers');
      expect(stats).toHaveProperty('totalLessons', 0);
      expect(stats).toHaveProperty('totalQuizzes', 0);
      expect(stats).toHaveProperty('averageScore', 0);
      expect(stats).toHaveProperty('uptime');
    });

    it('reports a live uptime timestamp', () => {
      const before = Date.now();
      const stats = getSystemStats();
      expect(stats.uptime).toBeGreaterThanOrEqual(before);
      expect(stats.uptime).toBeLessThanOrEqual(Date.now());
    });

    it('never reports more active users than total users', () => {
      makeUser();
      const stats = getSystemStats();
      expect(stats.activeUsers).toBeLessThanOrEqual(stats.totalUsers);
      expect(stats.totalLessons).toBe(0);
      expect(stats.totalQuizzes).toBe(0);
    });
  });

  describe('listUsers', () => {
    it('returns the documented page shape', () => {
      const result: PagedResult<AdminUser> = listUsers();
      expect(Array.isArray(result.items)).toBe(true);
      expect(typeof result.total).toBe('number');
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
    });

    it('defaults page size to 20 but honours an explicit page and size', () => {
      const result = listUsers(undefined, 3, 5);
      expect(result.page).toBe(3);
      expect(result.pageSize).toBe(5);
    });

    it('filters by role without leaking other roles', () => {
      makeUser({ role: 'student' });
      const result = listUsers({ role: 'student' });
      expect(result.items.every((u) => u.role === 'student')).toBe(true);
    });

    it('filters by inactive status', () => {
      makeUser({ isActive: false });
      const result = listUsers({ isActive: false });
      expect(result.items.every((u) => !u.isActive)).toBe(true);
    });

    it('filters by active status', () => {
      makeUser();
      const result = listUsers({ isActive: true });
      expect(result.items.every((u) => u.isActive)).toBe(true);
    });

    it('treats isActive:false as a real filter, not a falsy skip', () => {
      // Guards the `filters?.isActive !== undefined` check in the source.
      // A truthiness test would ignore `isActive: false` and return every user,
      // so the two filtered counts would not sum to the unfiltered total.
      makeUser({ isActive: false });
      makeUser({ isActive: true });

      const inactive = listUsers({ isActive: false });
      const active = listUsers({ isActive: true });
      expect(inactive.total + active.total).toBe(listUsers().total);
    });

    it('applies a case-insensitive search across email and name', () => {
      const id = uniq('findme');
      createUser({ email: `${id}@example.com`, name: `Nome ${id}` });

      expect(listUsers({ search: id.toUpperCase() }).total).toBeGreaterThan(0);
      expect(listUsers({ search: id.toLowerCase() }).total).toBeGreaterThan(0);
    });

    it('matches on name even when the email does not contain the term', () => {
      const id = uniq('namematch');
      createUser({ email: `plain-${uniq('e')}@example.com`, name: `Zelda ${id}` });

      const result = listUsers({ search: id.toLowerCase() });
      expect(result.total).toBeGreaterThan(0);
      expect(result.items.some((u) => u.name.includes(id))).toBe(true);
    });

    it('combines role and search filters conjunctively', () => {
      const id = uniq('combo');
      createUser({ email: `${id}@example.com`, name: id, role: 'admin' });

      expect(listUsers({ role: 'admin', search: id }).total).toBe(1);
      expect(listUsers({ role: 'student', search: id }).total).toBe(0);
    });

    it('returns an empty page when the offset is past the end', () => {
      const result = listUsers(undefined, 9999, 20);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(getSystemStats().totalUsers);
    });

    it('accepts an empty filter object as no filtering', () => {
      const filters: UserFilters = {};
      expect(listUsers(filters).total).toBe(listUsers().total);
    });

    it('never returns more items than the requested page size', () => {
      const result = listUsers(undefined, 1, 3);
      expect(result.items.length).toBeLessThanOrEqual(3);
    });

    it('paginates without dropping or duplicating users', () => {
      const pageSize = 2;
      const total = getSystemStats().totalUsers;
      const pages = Math.ceil(total / pageSize);

      const ids = new Set<string>();
      for (let p = 1; p <= pages; p += 1) {
        for (const u of listUsers(undefined, p, pageSize).items) ids.add(u.id);
      }
      expect(ids.size).toBe(total);
    });
  });

  describe('updateUser', () => {
    it('returns null for an unknown user', () => {
      expect(updateUser('nonexistent', { name: 'X' })).toBeNull();
    });

    it('returns null when the id is empty', () => {
      expect(updateUser('', { name: 'X' })).toBeNull();
    });

    it('merges the patch into the stored user', () => {
      const user = makeUser({ name: 'Original' });
      const updated = updateUser(user.id, { name: 'Renamed' });

      expect(updated).not.toBeNull();
      expect(updated?.name).toBe('Renamed');
      expect(updated?.id).toBe(user.id);
      expect(updated?.email).toBe(user.email);
    });

    it('persists the update so it survives a re-read', () => {
      const user = makeUser({ name: 'Before' });
      updateUser(user.id, { name: 'After' });

      const reread = listUsers({ search: 'After' });
      expect(reread.items.some((u) => u.id === user.id && u.name === 'After')).toBe(true);
    });

    it('publishes admin:user-updated with the userId', () => {
      const user = makeUser();
      const events: Array<{ data: { userId?: string } }> = [];
      getDefaultEventBus().subscribe('admin:user-updated', (payload) => {
        events.push(payload as unknown as (typeof events)[number]);
      });

      updateUser(user.id, { name: 'Notified' });

      expect(events).toHaveLength(1);
      expect(events[0]?.data.userId).toBe(user.id);
    });

    it('returns a copy rather than mutating the caller-visible store entry', () => {
      const user = makeUser({ name: 'Immutable-ish' });
      const updated = updateUser(user.id, { name: 'Changed' });

      // The merged object is a fresh reference; the original snapshot is not
      // rewritten in place under the caller's feet.
      expect(updated).not.toBe(user);
      expect(user.name).toBe('Immutable-ish');
    });

    it('applies a multi-field patch atomically', () => {
      const user = makeUser();
      const updated = updateUser(user.id, {
        role: 'admin',
        isActive: false,
        loginCount: 7,
      });

      expect(updated?.role).toBe('admin');
      expect(updated?.isActive).toBe(false);
      expect(updated?.loginCount).toBe(7);
    });

    it('does not publish an event when the user is unknown', () => {
      let calls = 0;
      getDefaultEventBus().subscribe('admin:user-updated', () => {
        calls += 1;
      });

      updateUser('nonexistent', { name: 'X' });

      expect(calls).toBe(0);
    });
  });

  describe('deactivateUser', () => {
    it('returns false for an unknown user', () => {
      expect(deactivateUser('nonexistent')).toBe(false);
    });

    it('returns false for an empty id', () => {
      expect(deactivateUser('')).toBe(false);
    });

    it('deactivates an existing user and returns true', () => {
      const user = makeUser({ isActive: true });
      expect(deactivateUser(user.id)).toBe(true);
    });

    it('flips isActive to false in the store', () => {
      const user = makeUser({ isActive: true });
      deactivateUser(user.id);

      const found = listUsers({ isActive: false }).items.find((u) => u.id === user.id);
      expect(found).toBeDefined();
      expect(found?.isActive).toBe(false);
    });

    it('is idempotent — a second call still succeeds', () => {
      const user = makeUser();
      expect(deactivateUser(user.id)).toBe(true);
      expect(deactivateUser(user.id)).toBe(true);
    });

    it('decrements activeUsers without changing totalUsers', () => {
      const user = makeUser({ isActive: true });
      const before = getSystemStats();
      deactivateUser(user.id);
      const after = getSystemStats();

      expect(after.totalUsers).toBe(before.totalUsers);
      expect(after.activeUsers).toBe(before.activeUsers - 1);
    });
  });

  describe('traced wrappers', () => {
    it('exposes a traced stats getter returning the same shape', () => {
      const stats = tracedGetSystemStats();
      expect(stats).toHaveProperty('totalUsers');
      expect(stats).toHaveProperty('uptime');
    });

    it('traced lister honours pagination', () => {
      const result = tracedListUsers(undefined, 2, 10);
      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(10);
    });

    it('traced lister agrees with the raw lister', () => {
      expect(tracedListUsers().total).toBe(listUsers().total);
    });
  });
});
