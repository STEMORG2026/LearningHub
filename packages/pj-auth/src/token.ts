import type { User, AuthState } from '@learninghub/auth';

const STORAGE_KEY = 'pj_auth_state';

export function loadAuthState(): AuthState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AuthState;
  } catch {
    return null;
  }
}

export function saveAuthState(state: AuthState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearAuthState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAuthToken(): string | null {
  const state = loadAuthState();
  if (state?.session && state.session.expiresAt > Date.now()) {
    return state.session.token;
  }
  return null;
}

export function isAuthenticated(): boolean {
  const state = loadAuthState();
  return state?.isAuthenticated ?? false;
}

export function getUser(): User | null {
  return loadAuthState()?.user ?? null;
}
