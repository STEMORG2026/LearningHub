import tseslintParser from '@typescript-eslint/parser';

const SRC_GLOBS = ['packages/**/src/**/*.ts', 'apps/**/src/**/*.ts'];

const PURE_LOGIC_GLOBS = [
  'packages/core/src/**/*.ts',
  'packages/hover-engine/src/**/*.ts',
  'packages/simulation-core/src/**/*.ts',
  'packages/quiz-engine/src/**/*.ts',
  'packages/audio-synth/src/**/*.ts',
];

const PURE_LOGIC_EXCLUDES = [
  'packages/quiz-engine/src/internal/**',
  'packages/core/src/event-bus.ts',
  'packages/audio-synth/src/engine.ts',
];

export function createLintConfig({ state, dom }) {
  const rules = {};

  if (state) {
    rules['no-restricted-globals'] = [
      'error',
      {
        name: 'window',
        message: 'Global mutable state (window) is forbidden in pure logic — use ACL adapters.',
      },
      {
        name: 'globalThis',
        message: 'Global mutable state (globalThis) is forbidden in pure logic — use ACL adapters.',
      },
    ];
  }

  if (dom) {
    rules['no-restricted-properties'] = [
      'error',
      {
        object: 'document',
        property: 'getElementById',
        message: 'DOM access is forbidden in pure logic — use ACL adapters.',
      },
      {
        object: 'document',
        property: 'querySelector',
        message: 'DOM access is forbidden in pure logic — use ACL adapters.',
      },
    ];
  }

  return [
    {
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/legacy/**',
        '**/*.js',
        '**/*.cjs',
        '**/*.mjs',
        '**/*.css',
        '**/*.json',
      ],
    },
    {
      files: ['**/*.ts'],
      languageOptions: {
        parser: tseslintParser,
      },
    },
    {
      files: PURE_LOGIC_GLOBS,
      ignores: PURE_LOGIC_EXCLUDES,
      rules,
    },
  ];
}

export { SRC_GLOBS };
