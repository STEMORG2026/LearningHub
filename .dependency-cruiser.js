/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
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
              comment: `@learninghub/${fromPkg} cannot import from @learninghub/${toPkg} — use EventBus.`,
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
