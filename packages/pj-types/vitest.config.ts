import { defineConfig } from 'vitest/config';

/**
 * Coverage exception — type-declaration-only package.
 *
 * `@learninghub/pj-types` publishes interfaces and type aliases ONLY (see
 * ARCHITECTURE.toml → publicApi: ChatMessage, ChatRequest, EcosystemInfo, …).
 * TypeScript types erase at compile time, so this package emits no executable
 * statements and v8 can never report line/statement coverage for it.
 *
 * Per docs/RULES.md → Coverage Ratchet, a threshold may be lowered with a
 * documented justification. This is that justification: a 0% floor is the
 * correct, honest value for a package whose entire surface is erased at runtime —
 * not a lowered bar for testable code. The package's runtime guarantee (that the
 * exported types compile and are importable) is covered by tests/types.test.ts.
 *
 * If runtime code is ever added to this package, restore the standard floor.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      // Type-only package: no executable statements exist to cover.
      // See the justification above and docs/REPOSITORY_HEALTH.md.
      thresholds: {
        lines: 0,
        branches: 0,
        functions: 0,
        statements: 0,
      },
    },
  },
});
