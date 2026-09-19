import { describe, it, expect, beforeEach } from 'vitest';
import { loadAuthState, saveAuthState, clearAuthState, getAuthToken, isAuthenticated, getUser } from '../src/token';
import type { AuthState } from '@learninghub/auth';

describe('pj-auth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadAuthState', () => {
    it('returns null when no state stored', () => {
      expect(loadAuthState()).toBeNull();
    });

    it('loads state from localStorage', () => {
      const state: AuthState = {
        user: { id: '1', email: 'test@stem.com', name: 'Test', role: 'student', createdAt: 0, lastLoginAt: null },
        session: { token: 'abc', userId: '1', expiresAt: Date.now() + 100000, createdAt: 0 },
        isAuthenticated: true,
      };
      localStorage.setItem('pj_auth_state', JSON.stringify(state));
      expect(loadAuthState()).toEqual(state);
    });
  });

  describe('saveAuthState', () => {
    it('saves state to localStorage', () => {
      const state: AuthState = {
        user: { id: '1', email: 'test@stem.com', name: 'Test', role: 'student', createdAt: 0, lastLoginAt: null },
        session: { token: 'abc', userId: '1', expiresAt: Date.now() + 100000, createdAt: 0 },
        isAuthenticated: true,
      };
      saveAuthState(state);
      const stored = JSON.parse(localStorage.getItem('pj_auth_state')!);
      expect(stored.isAuthenticated).toBe(true);
    });
  });

  describe('clearAuthState', () => {
    it('removes state from localStorage', () => {
      localStorage.setItem('pj_auth_state', JSON.stringify({ test: true }));
      clearAuthState();
      expect(localStorage.getItem('pj_auth_state')).toBeNull();
    });
  });

  describe('getAuthToken', () => {
    it('returns null when no session', () => {
      expect(getAuthToken()).toBeNull();
    });

    it('returns token for active session', () => {
      const state: AuthState = {
        user: { id: '1', email: 'test@stem.com', name: 'Test', role: 'student', createdAt: 0, lastLoginAt: null },
        session: { token: 'valid-token', userId: '1', expiresAt: Date.now() + 100000, createdAt: 0 },
        isAuthenticated: true,
      };
      saveAuthState(state);
      expect(getAuthToken()).toBe('valid-token');
    });

    it('returns null for expired session', () => {
      const state: AuthState = {
        user: { id: '1', email: 'test@stem.com', name: 'Test', role: 'student', createdAt: 0, lastLoginAt: null },
        session: { token: 'expired-token', userId: '1', expiresAt: Date.now() - 1000, createdAt: 0 },
        isAuthenticated: true,
      };
      saveAuthState(state);
      expect(getAuthToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no state', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true when authenticated', () => {
      const state: AuthState = {
        user: { id: '1', email: 'test@stem.com', name: 'Test', role: 'student', createdAt: 0, lastLoginAt: null },
        session: { token: 'abc', userId: '1', expiresAt: Date.now() + 100000, createdAt: 0 },
        isAuthenticated: true,
      };
      saveAuthState(state);
      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('getUser', () => {
    it('returns null when no user', () => {
      expect(getUser()).toBeNull();
    });

    it('returns user when authenticated', () => {
      const state: AuthState = {
        user: { id: '1', email: 'test@stem.com', name: 'Test', role: 'student', createdAt: 0, lastLoginAt: null },
        session: { token: 'abc', userId: '1', expiresAt: Date.now() + 100000, createdAt: 0 },
        isAuthenticated: true,
      };
      saveAuthState(state);
      expect(getUser()?.email).toBe('test@stem.com');
    });
  });
});
