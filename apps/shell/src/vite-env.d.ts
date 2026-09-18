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
   * Optional OpenRouter token for the PROFESSOR-J chat client. When unset the
   * client answers from its grounded local generator rather than calling out.
   */
  readonly VITE_OPENROUTER_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
