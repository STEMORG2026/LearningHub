/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-legacy-imports',
      severity: 'error',
      comment:
        'Direct imports from legacy/ are forbidden — use ACL adapters. See docs/ARCHITECTURE/README.md → Module Dependency Rules',
      from: { path: '^(packages|apps)' },
      to: { path: '^legacy' },
    },
    {
      name: 'legacy-no-modern-imports',
      severity: 'error',
      comment:
        'Legacy code cannot import from packages/. See docs/ARCHITECTURE/README.md → Module Dependency Rules',
      from: { path: '^legacy' },
      to: { path: '^(packages|apps)' },
    },
    /* GENERATED: per-package cross-package import rules.
       These forbid imports between application packages.
       core, tracer, and acl are shared infrastructure (always allowed). */
    ...(() => {
      const PKGS = [
        'audio-synth',
        'quiz-engine',
        'hover-engine',
        'simulation-core',
        'shell',
      ];
      const rules = [];
      for (const fromPkg of PKGS) {
        for (const toPkg of PKGS) {
          if (fromPkg !== toPkg) {
            rules.push({
              name: `no-import-${fromPkg}-to-${toPkg}`,
              severity: 'error',
              comment: `@stem-tuition/${fromPkg} cannot import from @stem-tuition/${toPkg} — use EventBus.`,
              from: { path: `^packages/${fromPkg}` },
              to: { path: `^packages/${toPkg}` },
            });
          }
        }
      }
      return rules;
    })(),
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
  },
};
