export { register, login, logout, validateSession, getAuthState, requireRole, tracedLogin } from './internal/auth';
export { hasRole } from './types';
export type { User, Session, AuthState, LoginRequest, RegisterRequest, UserRole } from './types';
