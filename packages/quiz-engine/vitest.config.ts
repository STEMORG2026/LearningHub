import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      // Coverage ratchet — thresholds normally only increase (see docs/RULES.md
      // → Testing Requirements → Coverage Ratchet).
      thresholds: {
        lines: 66,
        branches: 72,
        functions: 52,
        statements: 66,
      },
    },
  },
});
