import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // content-engine is pure logic — no DOM, so the node environment suffices.
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      thresholds: {
        lines: 96,
        branches: 79,
        functions: 97,
        statements: 93,
      },
    },
  },
});