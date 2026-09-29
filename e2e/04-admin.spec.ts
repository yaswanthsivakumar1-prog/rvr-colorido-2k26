import { test, expect } from '@playwright/test';

test.describe('Admin Authentication & Security', () => {
  test('Unauthenticated user is redirected to /admin/login when accessing protected routes', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto('/admin/colleges');
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto('/admin/registrations');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('Admin login page loads successfully with login form', async ({ page }) => {
    await page.goto('/admin/login');

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('Invalid login credentials are rejected with an error message', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('input[type="email"]', 'wrong-admin@rvrjc.ac.in');
    await page.fill('input[type="password"]', 'incorrectpassword');
    await page.getByRole('button', { name: /Sign In/i }).click();

    // Verify error notification or message
    await expect(
      page.locator('text=/Invalid|failed|error|Invalid login credentials/i').first()
    ).toBeVisible({ timeout: 10000 });
  });
});
