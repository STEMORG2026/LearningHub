import { describe, expect, it } from 'vitest';
import { initLhsDemo } from '../src/lib/lhs-demo';

describe('lhs-demo — Newton’s Second Law vertical slice', () => {
  it('renders knowledge from the export and pedagogy from STEM-TUITION', () => {
    document.body.innerHTML = '<div id="lhsDemoMount"></div>';
    initLhsDemo();
    const html = document.getElementById('lhsDemoMount')!.innerHTML;

    expect(html).toContain("Newton's Second Law");
    expect(html).toContain('F = dp/dt');
    expect(html).toContain('KNOWLEDGE');
    expect(html).toContain('LearningHubSTEM');
    expect(html).toContain('lhs:phys.newtons-second-law');

    expect(html).toContain('LEARNING');
    expect(html).toContain('Worked example');

    expect(html).toContain('export_version 0.1');
    expect(html).toContain('entities');
  });
});
