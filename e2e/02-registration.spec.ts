import { test, expect } from '@playwright/test';

test.describe('Student Registration Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/registration');
  });

  test('Registration page displays official eligibility notice for RVR and participating colleges', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Student Registration');
    await expect(page.locator('text=Eligibility Notice: Open to RVR & JC and Participating Colleges')).toBeVisible();
    await expect(page.locator('text=Registration is open to students from R.V.R. & J.C. College of Engineering')).toBeVisible();
  });

  test('Required-field validation blocks empty form submission', async ({ page }) => {
    // Click submit without entering any information
    await page.getByRole('button', { name: /Submit Registration/i }).click();

    // Check validation error messages
    await expect(page.locator('text=Please select an event.')).toBeVisible();
    await expect(page.locator('text=Please enter your full name')).toBeVisible();
    await expect(page.locator('text=Please enter your valid Student Roll Number')).toBeVisible();
    await expect(page.locator('text=Please select your department.')).toBeVisible();
    await expect(page.locator('text=Please select your year of study.')).toBeVisible();
    await expect(page.locator('text=Please enter a valid 10-digit mobile number.')).toBeVisible();
    await expect(page.locator('text=Please enter a valid email address.')).toBeVisible();
    await expect(page.locator('text=You must confirm your student status and agree to rules')).toBeVisible();
  });

  test('Invalid email address is rejected', async ({ page }) => {
    await page.fill('#full_name', 'M. Karthik');
    await page.fill('#roll_number', 'Y22CS501');
    await page.selectOption('#department', { index: 1 });
    await page.selectOption('#year', { index: 1 });
    await page.fill('#phone', '9848011223');
    await page.fill('#email', 'invalid-email-address'); // Invalid
    await page.selectOption('#event_id', { index: 1 });
    await page.check('input[type="checkbox"]');

    await page.getByRole('button', { name: /Submit Registration/i }).click();

    await expect(page.locator('text=Please enter a valid email address.')).toBeVisible();
  });

  test('Invalid or incomplete phone number is rejected', async ({ page }) => {
    await page.fill('#full_name', 'M. Karthik');
    await page.fill('#roll_number', 'Y22CS502');
    await page.selectOption('#department', { index: 1 });
    await page.selectOption('#year', { index: 1 });
    await page.fill('#phone', '12345'); // Only 5 digits
    await page.fill('#email', 'karthik@rvrjc.ac.in');
    await page.selectOption('#event_id', { index: 1 });
    await page.check('input[type="checkbox"]');

    await page.getByRole('button', { name: /Submit Registration/i }).click();

    await expect(page.locator('text=Please enter a valid 10-digit mobile number.')).toBeVisible();
  });

  test('Valid student registration submits successfully and displays confirmation pass', async ({ page }) => {
    // Select category and event
    await page.getByRole('button', { name: /Cultural/i }).click();
    await page.selectOption('#event_id', { index: 1 });

    // Fill student details
    const testRoll = `Y22CS${Math.floor(100 + Math.random() * 899)}`;
    await page.fill('#full_name', 'B. Rajesh Kumar');
    await page.fill('#roll_number', testRoll);
    await page.selectOption('#department', 'Computer Science & Engineering (CSE)');
    await page.selectOption('#year', '3rd Year');
    await page.fill('#phone', '9848123456');
    await page.fill('#email', `rajesh.${testRoll.toLowerCase()}@rvrjc.ac.in`);

    // Check agreement
    await page.check('input[type="checkbox"]');

    // Submit
    await page.getByRole('button', { name: /Submit Registration/i }).click();

    // Verify Success Screen
    await expect(page.locator('text=Registration Successful')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Registration ID').first()).toBeVisible();

    // Verify Student Details on Confirmation
    await expect(page.locator('text=B. Rajesh Kumar').first()).toBeVisible();
    await expect(page.locator(`text=${testRoll}`).first()).toBeVisible();
    await expect(page.locator('text=Registered').first()).toBeVisible();

    // Verify Action Buttons
    await expect(page.getByRole('button', { name: /Print Confirmation/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Register Another Event/i })).toBeVisible();
  });

  test('Participant from a participating college can register with custom or selected college', async ({ page }) => {
    // Select category and event
    await page.getByRole('button', { name: /Cultural/i }).click();
    await page.selectOption('#event_id', { index: 1 });

    // Select Participating College option
    await page.selectOption('#college', { label: 'Participating College' });

    // Fill student details
    const extRoll = `EXT${Math.floor(1000 + Math.random() * 8999)}`;
    await page.fill('#full_name', 'S. Ananya');
    await page.fill('#roll_number', extRoll);
    await page.selectOption('#department', 'Computer Science & Engineering (CSE)');
    await page.selectOption('#year', '2nd Year');
    await page.fill('#phone', '9848555666');
    await page.fill('#email', `ananya.${extRoll.toLowerCase()}@college.edu`);

    // Check agreement
    await page.check('input[type="checkbox"]');

    // Submit
    await page.getByRole('button', { name: /Submit Registration/i }).click();

    // Verify Success Screen
    await expect(page.locator('text=Registration Successful')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Registration ID').first()).toBeVisible();
    await expect(page.locator('text=S. Ananya').first()).toBeVisible();
    await expect(page.locator('text=Participating College').first()).toBeVisible();
  });
});
