import { describe, it, expect } from 'vitest';
import { register, login, logout, validateSession, getAuthState, requireRole } from '../src/internal/auth';
import { hasRole } from '../src/types';
import type { User, UserRole } from '../src/types';

describe('auth', () => {
  it('registers a new user', () => {
    const user = register({ email: 'test@stem.com', password: 'pass123', name: 'Test User' });
    expect(user.email).toBe('test@stem.com');
    expect(user.role).toBe('student');
    expect(user.id).toBeDefined();
  });

  it('rejects duplicate registration', () => {
    register({ email: 'dup@stem.com', password: 'pass', name: 'Dup' });
    expect(() => register({ email: 'dup@stem.com', password: 'pass', name: 'Dup 2' })).toThrow('User already exists');
  });

  it('logs in with valid credentials', () => {
    register({ email: 'login@stem.com', password: 'pass', name: 'Login' });
    const session = login({ email: 'login@stem.com', password: 'pass' });
    expect(session.token).toBeDefined();
    expect(session.userId).toBeDefined();
  });

  it('throws on invalid login', () => {
    expect(() => login({ email: 'none@stem.com', password: 'x' })).toThrow('User not found');
  });

  it('validates a session', () => {
    const { email } = register({ email: 'valid@stem.com', password: 'pass', name: 'Valid' });
    const session = login({ email, password: 'pass' });
    const user = validateSession(session.token);
    expect(user).not.toBeNull();
    expect(user!.email).toBe(email);
  });

  it('returns null for invalid session', () => {
    expect(validateSession('invalid-token')).toBeNull();
  });

  it('logs out a session', () => {
    register({ email: 'logout@stem.com', password: 'pass', name: 'Logout' });
    const session = login({ email: 'logout@stem.com', password: 'pass' });
    expect(logout(session.token)).toBe(true);
    expect(validateSession(session.token)).toBeNull();
  });

  describe('getAuthState', () => {
    it('returns unauthenticated for null token', () => {
      const state = getAuthState(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it('returns authenticated for valid token', () => {
      register({ email: 'state@stem.com', password: 'pass', name: 'State' });
      const session = login({ email: 'state@stem.com', password: 'pass' });
      const state = getAuthState(session.token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).not.toBeNull();
    });
  });

  describe('roles', () => {
    it('hasRole returns true for sufficient role', () => {
      const user: User = {
        id: '1',
        email: 'a@b.com',
        name: 'A',
        role: 'admin',
        createdAt: 0,
        lastLoginAt: null,
      };
      expect(hasRole(user, 'student')).toBe(true);
      expect(hasRole(user, 'teacher')).toBe(true);
      expect(hasRole(user, 'admin')).toBe(true);
    });

    it('hasRole returns false for insufficient role', () => {
      const user: User = {
        id: '1',
        email: 'a@b.com',
        name: 'A',
        role: 'student',
        createdAt: 0,
        lastLoginAt: null,
      };
      expect(hasRole(user, 'admin')).toBe(false);
    });

    it('hasRole returns false for null user', () => {
      expect(hasRole(null, 'student')).toBe(false);
    });
  });

  it('requireRole works with valid role', () => {
    const user: User = {
      id: '1',
      email: 'a@b.com',
      name: 'A',
      role: 'teacher',
      createdAt: 0,
      lastLoginAt: null,
    };
    expect(requireRole(user, 'student')).toBe(true);
    expect(requireRole(user, 'admin')).toBe(false);
  });
});
