import { test, expect } from '@playwright/test';

test('legacy home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeAttached();
});
