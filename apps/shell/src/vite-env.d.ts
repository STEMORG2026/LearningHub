/// <reference types="vite/client" />

// Side-effect CSS imports (e.g. `import './styles/main.css'`) are resolved by
// Vite at build time. These declarations keep strict tsc typechecking happy.
declare module '*.css';

/**
 * Build-time environment variables this shell reads.
 *
 * Vite inlines every `VITE_*` value into the served bundle, so anything listed
 * here is **public by construction** — it lands in `dist/` in plaintext. Never
 * put a value here that must stay private; use a server-side proxy instead.
 */
interface ImportMetaEnv {
  /**
   * Optional base URL of the PROFESSOR-J backend. When unset the client issues
   * same-origin requests. Resolved by `getBackendUrl()` in
   * `src/lib/professor-j-client.ts`.
   */
  readonly VITE_PROFESSOR_J_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
