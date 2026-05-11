import { test, expect } from '@playwright/test';

test('navigation and page loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('h1')).toContainText('Command Center Insights');

  await page.click('text=Daily Ops');
  await expect(page.locator('h1')).toContainText('Daily Ops');

  await page.click('text=Inventory');
  await expect(page.locator('h1')).toContainText('Inventory');
});
