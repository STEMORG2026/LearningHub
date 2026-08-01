import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      // Coverage ratchet — thresholds normally only increase (see docs/RULES.md
      // → Testing Requirements → Coverage Ratchet).
      thresholds: {
        lines: 87,
        branches: 85,
        functions: 78,
        statements: 87,
      },
    },
  },
});
