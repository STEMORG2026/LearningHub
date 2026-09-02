import { test, expect } from '@playwright/test';

const PAGES: Array<{ path: string; title: string }> = [
  { path: '/', title: 'LearningHub – Pokhara | Interactive STEM Hub' },
  { path: '/classes.html', title: 'Classes – LearningHub Pokhara' },
  { path: '/videos.html', title: 'Videos & Notes – LearningHub Pokhara' },
  { path: '/contact.html', title: 'Contact – LearningHub Pokhara' },
  { path: '/about.html', title: 'About – LearningHub Pokhara' },
];

for (const page of PAGES) {
  test(`${page.path} loads with header, footer, and title`, async ({ page: p }) => {
    await p.goto(page.path);
    await expect(p.locator('body')).toBeAttached();
    await expect(p).toHaveTitle(page.title);
    await expect(p.locator('site-header')).toBeAttached();
    await expect(p.locator('site-footer')).toBeAttached();
  });
}

test('home page renders interactive class carousel', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#classesGridContainer .soft-card')).toHaveCount(4);
});

test('home page renders pioneers wall', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#pioneerGrid .pioneer-card')).toHaveCount(20);
});

test('quiz web component is present on home', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('stem-quiz')).toBeAttached();
});

test('classes page renders detail and timing tracks', async ({ page }) => {
  await page.goto('/classes.html');
  await expect(page.locator('#classDetailsTrack .class-detail-card')).toHaveCount(4);
  await expect(page.locator('#batchTimingsTrack .timing-card')).toHaveCount(3);
});

test('contact form submits and clears', async ({ page }) => {
  await page.goto('/contact.html');
  page.once('dialog', (dialog) => dialog.accept());
  await page.fill('#cName', 'Test Student');
  await page.fill('#cPhone', '+977 9800000000');
  await page.locator('#contactForm button[type="submit"]').click();
  await expect(page.locator('#cName')).toHaveValue('');
});
