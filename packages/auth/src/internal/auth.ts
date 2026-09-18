import { getDefaultEventBus } from '@learninghub/core';
import { traced } from '@learninghub/tracer';
import type { User, Session, AuthState, LoginRequest, RegisterRequest, UserRole } from '../types';
import { hasRole } from '../types';

// In-memory user store (replace with persistent storage in production)
const users = new Map<string, User>();
const sessions = new Map<string, Session>();

export function register(request: RegisterRequest): User {
  if (users.has(request.email)) {
    throw new Error('User already exists');
  }
  const user: User = {
    id: crypto.randomUUID(),
    email: request.email,
    name: request.name,
    role: 'student',
    createdAt: Date.now(),
    lastLoginAt: null,
  };
  users.set(request.email, user);
  return user;
}

export function login(request: LoginRequest): Session {
  const user = users.get(request.email);
  if (!user) {
    throw new Error('User not found');
  }
  user.lastLoginAt = Date.now();
  const session: Session = {
    token: crypto.randomUUID(),
    userId: user.id,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    createdAt: Date.now(),
  };
  sessions.set(session.token, session);
  getDefaultEventBus().publish('auth:login', {
    data: { userId: user.id },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return session;
}

export function logout(token: string): boolean {
  return sessions.delete(token);
}

export function validateSession(token: string): User | null {
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    return null;
  }
  const user = Array.from(users.values()).find((u) => u.id === session.userId);
  return user ?? null;
}

export function getAuthState(token: string | null): AuthState {
  if (!token) {
    return { user: null, session: null, isAuthenticated: false };
  }
  const user = validateSession(token);
  const session = sessions.get(token) ?? null;
  return { user, session, isAuthenticated: !!user };
}

export function requireRole(user: User | null, role: UserRole): boolean {
  return hasRole(user, role);
}

export const tracedLogin = traced('auth:login', login);
