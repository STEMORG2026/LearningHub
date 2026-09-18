import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const PAGES: Array<{ path: string; title: string }> = [
  { path: '/', title: 'LearningHub — Open STEM Learning Platform' },
  { path: '/classes.html', title: 'Classes & Programs | LearningHub' },
  { path: '/videos.html', title: 'Videos & Notes | LearningHub' },
  { path: '/contact.html', title: 'Contact & Connect | LearningHub' },
  { path: '/about.html', title: 'About | LearningHub' },
];

for (const { path } of PAGES) {
  test(`axe scan finds no violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(350);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('every page exposes a single main landmark', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toHaveCount(1);
  await page.goto('/contact.html');
  await expect(page.locator('main')).toHaveCount(1);
});

test('enroll modal traps focus and closes with Escape', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-open-enroll]').first().click();
  const dialog = page.locator('dialog.modal-card');
  await expect(dialog).toBeVisible();
  const activeTag = await page.evaluate(() => document.activeElement?.tagName);
  expect(activeTag).toBe('BUTTON');
  const insideDialog = await page.evaluate(() => document.activeElement?.closest('dialog') !== null);
  expect(insideDialog).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('horizontal scrollers are keyboard-focusable regions', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#pioneerGrid')).toHaveAttribute('tabindex', '0');
  await expect(page.locator('#pioneerGrid')).toHaveAttribute('role', 'region');
  await expect(page.locator('#pioneerGrid')).toHaveAttribute('aria-label', /.+/);
});
