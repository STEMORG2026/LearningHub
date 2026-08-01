import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '../../..');
const LEGACY_DIR = join(ROOT, 'legacy');
const DOCS_DIR = join(ROOT, 'docs');
const PACKAGES_DIR = join(ROOT, 'packages');
const APPS_DIR = join(ROOT, 'apps');
const SCRIPTS_DIR = join(ROOT, 'scripts');

// ── Helpers ──────────────────────────────────────────────────────
const read = (p: string) => readFileSync(p, 'utf8');
const exists = (p: string) => existsSync(p);
const isFile = (p: string) => exists(p) && statSync(p).isFile();

// ────────────────────────────────────────────────────────────────
// SUITE 1: ROOT STRUCTURE
// ────────────────────────────────────────────────────────────────
describe('Root monorepo structure', () => {
  it('root package.json exists with correct metadata', () => {
    const pkg = JSON.parse(read(join(ROOT, 'package.json')));
    expect(pkg.name).toBe('stem-tuition');
    expect(pkg.version).toBe('3.0.0');
    expect(pkg.private).toBe(true);
    expect(pkg.scripts).toHaveProperty('build');
    expect(pkg.scripts).toHaveProperty('test');
    expect(pkg.scripts).toHaveProperty('typecheck');
    expect(pkg.scripts).toHaveProperty('verify-governance');
    expect(pkg.scripts).toHaveProperty('changeset:version');
    expect(pkg.scripts).toHaveProperty('sync-versions');
  });

  it('pnpm-workspace.yaml exists and lists all package patterns', () => {
    const content = read(join(ROOT, 'pnpm-workspace.yaml'));
    expect(content).toContain('packages/*');
    expect(content).toContain('apps/*');
    expect(content).toContain('allowBuilds');
  });

  it('root tsconfig.json enforces strict mode and experimental decorators', () => {
    const cfg = JSON.parse(read(join(ROOT, 'tsconfig.json')));
    expect(cfg.compilerOptions.strict).toBe(true);
    expect(cfg.compilerOptions.noImplicitAny).toBe(true);
    expect(cfg.compilerOptions.noUnusedLocals).toBe(true);
    expect(cfg.compilerOptions.noUnusedParameters).toBe(true);
    expect(cfg.compilerOptions.experimentalDecorators).toBe(true);
    expect(cfg.compilerOptions.moduleResolution).toBe('bundler');
    expect(cfg.compilerOptions.module).toBe('ESNext');
    expect(cfg.compilerOptions.target).toBe('ES2022');
    expect(cfg.compilerOptions.lib).toContain('DOM');
    expect(cfg.compilerOptions.verbatimModuleSyntax).toBe(true);
    expect(cfg.exclude).toContain('legacy');
    expect(cfg.exclude).toContain('dist');
  });

  it('turbo.json defines build pipeline', () => {
    const cfg = JSON.parse(read(join(ROOT, 'turbo.json')));
    expect(cfg.pipeline).toHaveProperty('build');
    expect(cfg.pipeline).toHaveProperty('test');
    expect(cfg.pipeline).toHaveProperty('typecheck');
    expect(cfg.pipeline.build.dependsOn).toContain('^build');
    expect(cfg.pipeline.test.dependsOn).toContain('build');
  });

  it('.gitignore exists', () => {
    expect(isFile(join(ROOT, '.gitignore'))).toBe(true);
  });

  it('pnpm-lock.yaml exists', () => {
    expect(isFile(join(ROOT, 'pnpm-lock.yaml'))).toBe(true);
  });
});

// ────────────────────────────────────────────────────────────────
// SUITE 2: CHANGESETS
// ────────────────────────────────────────────────────────────────
describe('Changesets configuration', () => {
  it('.changeset/config.json exists with correct settings', () => {
    const cfg = JSON.parse(read(join(ROOT, '.changeset/config.json')));
    expect(cfg.baseBranch).toBe('main');
    expect(cfg.access).toBe('restricted');
    expect(cfg.commit).toBe(false);
    expect(cfg.$schema).toContain('@changesets/config');
  });

  it('.changeset/README.md exists', () => {
    expect(isFile(join(ROOT, '.changeset/README.md'))).toBe(true);
  });
});

// ────────────────────────────────────────────────────────────────
// SUITE 3: PACKAGE SCAFFOLDS
// ────────────────────────────────────────────────────────────────
describe('Package scaffolds exist with correct structure', () => {
  const expectedPackages = [
    'core',
    'tracer',
    'acl',
    'audio-synth',
    'quiz-engine',
    'hover-engine',
    'simulation-core',
  ];

  const expectedScripts = ['build', 'dev', 'test', 'test:coverage', 'typecheck'];

  expectedPackages.forEach((pkgName) => {
    describe(`packages/${pkgName}`, () => {
      const pkgDir = join(PACKAGES_DIR, pkgName);

      it('directory exists', () => {
        expect(existsSync(pkgDir)).toBe(true);
      });

      it('package.json has valid name, version, scripts', () => {
        const pkg = JSON.parse(read(join(pkgDir, 'package.json')));
        expect(pkg.name).toBe(`@stem-tuition/${pkgName}`);
        expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
        expect(pkg.private).toBe(true);
        expect(pkg.type).toBe('module');
        expectedScripts.forEach((s) => {
          expect(pkg.scripts).toHaveProperty(s);
        });
      });

      it('tsconfig.json extends root config', () => {
        const cfg = JSON.parse(read(join(pkgDir, 'tsconfig.json')));
        expect(cfg.extends).toBe('../../tsconfig.json');
      });

      it('src/ directory with index.ts exists', () => {
        expect(isFile(join(pkgDir, 'src/index.ts'))).toBe(true);
      });

      it('tests/ directory exists', () => {
        expect(existsSync(join(pkgDir, 'tests'))).toBe(true);
      });
    });
  });
});

// ────────────────────────────────────────────────────────────────
// SUITE 4: APP SCAFFOLDS
// ────────────────────────────────────────────────────────────────
describe('App scaffolds exist', () => {
  it('apps/shell directory exists', () => {
    expect(existsSync(join(APPS_DIR, 'shell'))).toBe(true);
  });

  it('apps/shell/package.json exists with vite config', () => {
    const pkg = JSON.parse(read(join(APPS_DIR, 'shell/package.json')));
    expect(pkg.name).toBe('@stem-tuition/shell');
    expect(pkg.scripts).toHaveProperty('dev');
    expect(pkg.scripts).toHaveProperty('build');
    expect(pkg.devDependencies).toHaveProperty('vite');
  });

  it('apps/shell/tsconfig.json exists', () => {
    expect(isFile(join(APPS_DIR, 'shell/tsconfig.json'))).toBe(true);
  });

  it('apps/shell/vite.config.ts exists', () => {
    expect(isFile(join(APPS_DIR, 'shell/vite.config.ts'))).toBe(true);
  });

  it('apps/shell/index.html exists', () => {
    expect(isFile(join(APPS_DIR, 'shell/index.html'))).toBe(true);
  });

  it('apps/shell/src/index.ts exists', () => {
    expect(isFile(join(APPS_DIR, 'shell/src/index.ts'))).toBe(true);
  });

  it('apps/shell/public/ directory exists', () => {
    expect(existsSync(join(APPS_DIR, 'shell/public'))).toBe(true);
  });
});

// ────────────────────────────────────────────────────────────────
// SUITE 5: ROOT INDEX.HTML DEPRECATION
// ────────────────────────────────────────────────────────────────
describe('Root index.html deprecation notice', () => {
  it('root index.html is a deprecation notice pointing at apps/shell', () => {
    const html = read(join(ROOT, 'index.html'));
    expect(html).toContain('This entry point is deprecated');
    expect(html).toContain('apps/shell/');
    expect(html).toContain('removed in v4');
  });
});

// ────────────────────────────────────────────────────────────────
// SUITE 6: LEGACY FROZEN ZONE
// ────────────────────────────────────────────────────────────────
describe('Legacy frozen zone', () => {
  it('legacy/index.html exists', () => {
    expect(isFile(join(LEGACY_DIR, 'index.html'))).toBe(true);
  });

  it('legacy HTML pages exist', () => {
    const pages = ['stem-tuition.html', 'classes.html', 'contact.html', 'videos.html'];
    pages.forEach((p) => {
      expect(isFile(join(LEGACY_DIR, p))).toBe(true);
    });
  });

  it('legacy CSS files exist', () => {
    expect(isFile(join(LEGACY_DIR, 'css/main.css'))).toBe(true);
    expect(isFile(join(LEGACY_DIR, 'css/stem-theme.css'))).toBe(true);
  });

  it('legacy JS files exist', () => {
    const files = ['main.js', 'stem-effects.js', 'stem-pioneers.js', 'stem-quiz.js'];
    files.forEach((f) => {
      expect(isFile(join(LEGACY_DIR, 'js', f))).toBe(true);
    });
  });

  it('legacy test files exist', () => {
    const tests = ['verify-canvas-bodies-and-controls.js', 'verify-background_animation.js', 'verify-stem-platform.js'];
    tests.forEach((t) => {
      expect(isFile(join(LEGACY_DIR, 'tests', t))).toBe(true);
    });
  });

  it('legacy docs exist', () => {
    const docs = ['CURRICULUM_GUIDE.md', 'DEVELOPMENT.md', 'RULES_LEGACY_v1.md', 'TUITION_OPERATIONS.md'];
    docs.forEach((d) => {
      expect(isFile(join(LEGACY_DIR, 'docs', d))).toBe(true);
    });
  });

  it('legacy ADR exists', () => {
    expect(isFile(join(LEGACY_DIR, 'docs/adr/001-architecture-charter.md'))).toBe(true);
  });

  it('legacy architecture decision docs exist', () => {
    const adFiles = [
      'ARCHITECTURE_CHARTER.md',
      'ARCHITECTURE_FITNESS_REPORT.md',
      'ARCHITECTURE_MIGRATION_STRATEGY.md',
      'ARCHITECT_MISSION_ACCEPTANCE.md',
      'UPGRADE_GUIDE.md',
      'VERSION_FREEZE.md',
    ];
    adFiles.forEach((f) => {
      expect(isFile(join(LEGACY_DIR, f))).toBe(true);
    });
  });
});

// ────────────────────────────────────────────────────────────────
// SUITE 7: DOCUMENTATION
// ────────────────────────────────────────────────────────────────
describe('Documentation completeness', () => {
  const requiredDocs = [
    'ARCHITECTURE/README.md',
    'RULES.md',
    'policies/API_CONTRACT.md',
    'policies/EVENT_BUS_CONTRACT.md',
    'policies/VERSIONING.md',
    'policies/DEPENDENCY_POLICY.md',
    'policies/RELIABILITY.md',
    'policies/OBSERVABILITY.md',
    'policies/PACKAGE_LIFECYCLE.md',
    'policies/PACKAGE_METADATA.md',
    'policies/SECURITY.md',
    'policies/ACCESSIBILITY.md',
    'policies/PERFORMANCE.md',
    'policies/HUMAN_INVOLVEMENT.md',
    'guides/QUICKSTART.md',
    'guides/DEBUGGING.md',
    'guides/COMPONENT_STANDARDS.md',
    'guides/FLOWCHARTS.md',
    'guides/GLOSSARY.md',
    'guides/DEPLOYMENT.md',
    'ROADMAP.md',
    'CHANGELOG.md',
    'DEVLOG.md',
  ];

  requiredDocs.forEach((doc) => {
    it(`docs/${doc} exists`, () => {
      expect(isFile(join(DOCS_DIR, doc))).toBe(true);
    });
  });

  it('all docs have Version header', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory()
          ? walk(join(dir, e.name))
          : e.name.endsWith('.md')
            ? [join(dir, e.name)]
            : [],
      );
    walk(DOCS_DIR).forEach((f) => {
      expect(read(f)).toMatch(/\*\*Version:\*\*/);
    });
  });

  it('ADRs 001-009 exist', () => {
    const files = readdirSync(join(DOCS_DIR, 'adr'));
    for (let i = 1; i <= 9; i++) {
      const n = String(i).padStart(3, '0');
      expect(files.some((f) => f.startsWith(n))).toBe(true);
    }
  });

  it('component registry files exist', () => {
    const regFiles = ['index.md', 'RENDERING.md', 'STATE.md', 'NETWORKING.md', 'EDUCATIONAL.md', 'TESTING.md', 'TRACE.md'];
    regFiles.forEach((f) => {
      expect(isFile(join(DOCS_DIR, 'component-registry', f))).toBe(true);
    });
  });

  it('FLOWCHARTS.md contains Mermaid diagrams', () => {
    const content = read(join(DOCS_DIR, 'guides/FLOWCHARTS.md'));
    expect(content).toContain('```mermaid');
    expect(content.match(/```mermaid/g)!.length).toBeGreaterThanOrEqual(3);
  });
});

// ────────────────────────────────────────────────────────────────
// SUITE 8: SCRIPTS
// ────────────────────────────────────────────────────────────────
describe('Scripts', () => {
  it('scripts/generate/sync-versions.mjs exists', () => {
    expect(isFile(join(SCRIPTS_DIR, 'generate/sync-versions.mjs'))).toBe(true);
  });

  it('sync-versions.mjs has valid syntax', () => {
    const content = read(join(SCRIPTS_DIR, 'generate/sync-versions.mjs'));
    expect(content).toContain('VERSION');
    expect(content).toContain('**Version:**');
    expect(content).toContain('writeFileSync');
  });
});

// ────────────────────────────────────────────────────────────────
// SUITE 9: PHASE 1 TRACER VERIFICATION
// ────────────────────────────────────────────────────────────────
describe('Phase 1 — Tracer package integrity', () => {
  const tracerDir = join(PACKAGES_DIR, 'tracer');

  it('has core source files', () => {
    const srcFiles = ['tracer.ts', 'types.ts', 'decorator.ts', 'dashboard.ts', 'index.ts'];
    srcFiles.forEach((f) => {
      expect(isFile(join(tracerDir, 'src', f))).toBe(true);
    });
  });

  it('has tests', () => {
    expect(isFile(join(tracerDir, 'tests', 'tracer.test.ts'))).toBe(true);
  });

  it('has vitest config', () => {
    expect(isFile(join(tracerDir, 'vitest.config.ts'))).toBe(true);
  });

  it('tracer.ts exports Tracer class with required methods', () => {
    const content = read(join(tracerDir, 'src/tracer.ts'));
    expect(content).toContain('class Tracer');
    expect(content).toContain('startSpan');
    expect(content).toContain('endSpan');
    expect(content).toContain('getCurrentTraceId');
    expect(content).toContain('getSpanTree');
  });

  it('dashboard.ts defines a Web Component', () => {
    const content = read(join(tracerDir, 'src/dashboard.ts'));
    expect(content).toContain('class TracerDashboard');
    expect(content).toContain('extends HTMLElement');
    expect(content).toContain('customElements.define');
  });

  it('decorator.ts exports traced() and @traceDecorator()', () => {
    const content = read(join(tracerDir, 'src/decorator.ts'));
    expect(content).toContain('export function traced');
    expect(content).toContain('export function traceDecorator');
  });

  it('index.ts exports public API and initTracer()', () => {
    const content = read(join(tracerDir, 'src/index.ts'));
    expect(content).toContain('export function initTracer');
    expect(content).toContain('export { Tracer }');
    expect(content).toContain('export { traced');
    expect(content).toContain('traceDecorator');
    expect(content).toContain('showDashboard');
    expect(content).toContain('debug_events');
  });
});

// ────────────────────────────────────────────────────────────────
// SUITE 10: ROOT tsconfig INCLUDES CRITICAL SETTINGS
// ────────────────────────────────────────────────────────────────
describe('Root tsconfig — critical development settings', () => {
  const cfg = JSON.parse(read(join(ROOT, 'tsconfig.json')));

  it('enables declaration files', () => {
    expect(cfg.compilerOptions.declaration).toBe(true);
  });

  it('enables source maps', () => {
    expect(cfg.compilerOptions.sourceMap).toBe(true);
  });

  it('enables declaration maps', () => {
    expect(cfg.compilerOptions.declarationMap).toBe(true);
  });

  it('excludes node_modules, legacy, dist', () => {
    expect(cfg.exclude).toContain('node_modules');
    expect(cfg.exclude).toContain('legacy');
    expect(cfg.exclude).toContain('dist');
  });
});
