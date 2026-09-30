import { describe, expect, it } from 'vitest';
import { initLhsDemo } from '../src/lib/lhs-demo';

describe('lhs-demo — Newton’s Second Law vertical slice', () => {
  it('renders knowledge from the export and pedagogy from LearningHub', () => {
    document.body.innerHTML = '<div id="lhsDemoMount"></div>';
    initLhsDemo();
    const html = document.getElementById('lhsDemoMount')!.innerHTML;

    // KNOWLEDGE — rendered verbatim from the STEMMA export.
    expect(html).toContain("Newton's Second Law");
    expect(html).toContain('KNOWLEDGE');
    expect(html).toContain('STEMMA');
    expect(html).toContain('stemma:phys.newtons-second-law');
    // The modern 2.x export carries the expression in `symbol`.
    expect(html).toContain('F_net = m a');

    // LEARNING — authored pedagogy, clearly separated from imported knowledge.
    expect(html).toContain('LEARNING');
    expect(html).toContain('Worked example');

    // Export footer reflects the real vendored contract.
    expect(html).toContain('export_version 2.2.0');
    expect(html).toContain('entities');
  });

  it('degrades gracefully when related entities are absent from the export', () => {
    document.body.innerHTML = '<div id="lhsDemoMount"></div>';
    initLhsDemo();
    const html = document.getElementById('lhsDemoMount')!.innerHTML;
    // The modern 2.x contract has no per-entity `relationships[]`, so the related
    // grid renders its header with a count of 0 rather than throwing.
    expect(html).toContain('Related entities resolved from the export (0)');
  });
});
