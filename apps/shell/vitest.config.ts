import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: [
        'src/components/did-you-know.ts',
        'src/components/enroll-modal.ts',
        'src/components/faq-list.ts',
        'src/lib/hover-effects.ts',
        'src/lib/render.ts',
      ],
      thresholds: {
        lines: 80,
        branches: 65,
        functions: 75,
        statements: 80,
      },
    },
  },
});
