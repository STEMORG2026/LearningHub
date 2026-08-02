import { test, expect, type Page } from '@playwright/test';

const QUIET_CSS = `
  .reveal-on-scroll, .reveal-on-scroll.is-visible { opacity: 1 !important; transform: none !important; }
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    font-family: sans-serif !important;
  }
`;

async function stabilize(page: Page, keepDyk = false): Promise<void> {
  await page.addStyleTag({ content: QUIET_CSS });
  await page.evaluate(async (keep) => {
    document.getElementById('stemBackgroundCanvas')?.remove();
    if (!keep) document.querySelector('.dyk-widget')?.remove();
    await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 300));
  }, keepDyk);
}

const PAGES: Array<{ path: string; slug: string }> = [
  { path: '/', slug: 'home' },
  { path: '/classes.html', slug: 'classes' },
  { path: '/videos.html', slug: 'videos' },
  { path: '/contact.html', slug: 'contact' },
  { path: '/about.html', slug: 'about' },
];

for (const { path, slug } of PAGES) {
  test(`visual baseline for ${slug}`, async ({ page }) => {
    await page.goto(path);
    await stabilize(page);
    await expect(page).toHaveScreenshot(`${slug}.png`, { fullPage: true, animations: 'disabled' });
  });
}

test('visual baseline for enroll modal open', async ({ page }) => {
  await page.goto('/');
  await stabilize(page);
  await page.evaluate(() => {
    document.dispatchEvent(new CustomEvent('open-enroll', { detail: { title: 'Foundation STEM' } }));
  });
  await expect(page.locator('dialog.modal-card')).toBeVisible();
  await expect(page).toHaveScreenshot('enroll-modal-open.png', { animations: 'disabled', maxDiffPixelRatio: 0.05 });
});
test('visual baseline for did-you-know expanded', async ({ page }) => {
  await page.goto('/');
  await stabilize(page, true);
  await page.evaluate(() => {
    document.querySelector('.dyk-widget')?.classList.remove('minimized');
    const set = (sel: string, text: string) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = text;
    };
    set('[data-name]', 'Albert Einstein');
    set('[data-era]', '1879 – 1955');
    set('[data-field]', 'Physics');
    set('[data-fact]', 'E = mc², the most famous equation in physics.');
  });
  await expect(page).toHaveScreenshot('dyk-expanded.png', {
    animations: 'disabled',
    mask: [page.locator('.dyk-avatar')],
  });
});
