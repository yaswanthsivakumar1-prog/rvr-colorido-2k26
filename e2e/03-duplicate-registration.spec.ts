import { test, expect } from '@playwright/test';

test.describe('Duplicate Registration Business Logic', () => {
  test('Prevents the same student from registering multiple times for the same event', async ({ page }) => {
    const duplicateRoll = `Y23EC${Math.floor(200 + Math.random() * 700)}`;
    const studentName = 'P. Varun Teja';
    const email = `varun.${duplicateRoll.toLowerCase()}@rvrjc.ac.in`;

    // --- STEP 1: First Registration (Should Succeed) ---
    await page.goto('/registration');

    await page.getByRole('button', { name: /Sports/i }).click();
    await page.selectOption('#event_id', { index: 1 });

    await page.fill('#full_name', studentName);
    await page.fill('#roll_number', duplicateRoll);
    await page.selectOption('#department', 'Electronics & Communication Engineering (ECE)');
    await page.selectOption('#year', '2nd Year');
    await page.fill('#phone', '9876501234');
    await page.fill('#email', email);
    await page.check('input[type="checkbox"]');

    await page.getByRole('button', { name: /Submit Registration/i }).click();

    // Verify first registration was successful
    await expect(page.locator('text=Registration Successful')).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${duplicateRoll}`)).toBeVisible();

    // --- STEP 2: Second Registration with SAME Roll Number & SAME Event (Should Be Blocked) ---
    const resetBtn = page.getByRole('button', { name: /Register Another Event/i });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    } else {
      await page.goto('/registration');
      await page.reload();
    }
    await expect(page.locator('#full_name')).toBeVisible();

    await page.getByRole('button', { name: /Sports/i }).click();
    await page.selectOption('#event_id', { index: 1 });

    await page.fill('#full_name', studentName);
    await page.fill('#roll_number', duplicateRoll);
    await page.selectOption('#department', 'Electronics & Communication Engineering (ECE)');
    await page.selectOption('#year', '2nd Year');
    await page.fill('#phone', '9876501234');
    await page.fill('#email', email);
    await page.check('input[type="checkbox"]');

    await page.getByRole('button', { name: /Submit Registration/i }).click();

    // Check duplicate rejection message
    await expect(
      page.locator(`text=/${duplicateRoll}.*already registered|already exists.*${duplicateRoll}|already registered.*${duplicateRoll}/i`).first()
    ).toBeVisible({ timeout: 15000 });

    // Ensure success screen did NOT appear
    await expect(page.locator('text=Registration Successful')).not.toBeVisible();
  });
});
