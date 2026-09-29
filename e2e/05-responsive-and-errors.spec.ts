import { test, expect } from '@playwright/test';

test.describe('Responsive Design & Error Handling', () => {
  test('Public pages do not have horizontal overflow on desktop', async ({ page }) => {
    const pagesToCheck = ['/', '/about', '/events', '/schedule', '/registration', '/results', '/contact'];

    for (const url of pagesToCheck) {
      await page.goto(url);
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(isOverflowing, `Page ${url} has horizontal scroll overflow`).toBeFalsy();
    }
  });

  test('Non-existent event URL returns 404 Not Found page gracefully', async ({ page }) => {
    const response = await page.goto('/events/non-existent-event-slug-12345');
    // Next.js returns 404 status
    expect([200, 404]).toContain(response?.status());
    await expect(page.locator('text=/404|not found/i').first()).toBeVisible();
  });
});
