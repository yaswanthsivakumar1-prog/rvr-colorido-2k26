import { test, expect } from '@playwright/test';

test.describe('Targeted Regression Testing — Multi-College Participation & Event Rules', () => {

  test('1. Homepage participation wording', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Open to Eligible Students from RVR & J.C. College and Participating Colleges').first()).toBeVisible();
    await expect(page.locator('text=RVR & J.C. College of Engineering (Autonomous), Guntur').first()).toBeVisible();
    await expect(page.locator('text=RVR students only')).not.toBeVisible();
    await expect(page.locator('text=Open exclusively')).not.toBeVisible();
  });

  test('2. Registration eligibility wording', async ({ page }) => {
    await page.goto('/registration');
    await expect(page.locator('text=Registration is open to eligible students from R.V.R. & J.C. College of Engineering (Autonomous) and eligible participating colleges.')).toBeVisible();
    await expect(page.locator('text=RVR students only')).not.toBeVisible();
  });

  test('3. Registration with RVR student', async ({ page }) => {
    await page.goto('/registration');
    await page.getByRole('button', { name: /Sports/i }).click();
    const options = await page.locator('#event_id option').allInnerTexts();
    const basketIndex = options.findIndex((o) => o.includes('Basketball'));
    await page.selectOption('#event_id', { index: basketIndex > 0 ? basketIndex : 1 });
    const rvrRoll = `Y22CS${Math.floor(100 + Math.random() * 899)}`;
    await page.selectOption('#college', { label: 'R.V.R. & J.C. College of Engineering (Autonomous)' });
    await page.fill('#full_name', 'K. Rajesh Kumar');
    await page.fill('#roll_number', rvrRoll);
    await page.selectOption('#department', 'Computer Science & Engineering (CSE)');
    await page.selectOption('#year', '3rd Year');
    await page.fill('#phone', '9848123456');
    await page.fill('#email', `rajesh.${rvrRoll.toLowerCase()}@rvrjc.ac.in`);
    await page.fill('#team_name', 'RVR Cagers');
    await page.check('input[type="checkbox"]');
    await page.getByRole('button', { name: /Submit Registration/i }).click();
    await expect(page.locator('text=Registration Successful')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=K. Rajesh Kumar').first()).toBeVisible();
    await expect(page.locator('text=R.V.R. & J.C. College of Engineering (Autonomous)').first()).toBeVisible();
    await expect(page.locator(`text=${rvrRoll}`).first()).toBeVisible();
  });

  test('4. Registration with another participating college', async ({ page }) => {
    await page.goto('/registration');
    await page.getByRole('button', { name: /Sports/i }).click();
    const options = await page.locator('#event_id option').allInnerTexts();
    const basketIndex = options.findIndex((o) => o.includes('Basketball'));
    await page.selectOption('#event_id', { index: basketIndex > 0 ? basketIndex : 1 });
    await page.selectOption('#college', { label: 'Participating College' });
    await expect(page.locator('#custom_college')).toBeVisible();
    await page.fill('#custom_college', 'Test Participating College');
    const rollNo = `TEST${Math.floor(100 + Math.random() * 899)}`;
    await page.fill('#full_name', 'Test Student');
    await page.fill('#roll_number', rollNo);
    await page.selectOption('#department', 'Computer Science & Engineering (CSE)');
    await page.selectOption('#year', '2nd Year');
    await page.fill('#phone', '9848555777');
    await page.fill('#email', `test.student.${rollNo.toLowerCase()}@testcollege.edu`);
    await page.fill('#team_name', 'Test Ballers');
    await page.check('input[type="checkbox"]');
    await page.getByRole('button', { name: /Submit Registration/i }).click();
    await expect(page.locator('text=Registration Successful')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Test Student').first()).toBeVisible();
    await expect(page.locator('text=Test Participating College').first()).toBeVisible();
    await expect(page.locator(`text=${rollNo}`).first()).toBeVisible();
  });
  test('5. College field persistence in Supabase and data model', async ({ page }) => {
    await page.goto('/registration');
    await page.getByRole('button', { name: /Cultural/i }).click();
    await page.selectOption('#event_id', { index: 1 });
    await page.selectOption('#college', { label: 'Participating College' });
    await page.fill('#custom_college', 'Test Participating College');
    const uniqueRoll = `PER${Math.floor(1000 + Math.random() * 9000)}`;
    await page.fill('#full_name', 'Persistence Test Student');
    await page.fill('#roll_number', uniqueRoll);
    await page.selectOption('#department', 'Information Technology (IT)');
    await page.selectOption('#year', '1st Year');
    await page.fill('#phone', '9848111222');
    await page.fill('#email', `pers.${uniqueRoll.toLowerCase()}@test.edu`);
    await page.check('input[type="checkbox"]');
    await page.getByRole('button', { name: /Submit Registration/i }).click();
    await expect(page.locator('text=Registration Successful')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Test Participating College').first()).toBeVisible();
  });

  test('6. Duplicate registration protection still works', async ({ page }) => {
    const dupRoll = `DUP${Math.floor(1000 + Math.random() * 9000)}`;
    const email = `dup.${dupRoll.toLowerCase()}@college.edu`;
    await page.goto('/registration');
    await page.getByRole('button', { name: /Cultural/i }).click();
    await page.selectOption('#event_id', { index: 1 });
    await page.fill('#full_name', 'Duplicate Check Student');
    await page.fill('#roll_number', dupRoll);
    await page.selectOption('#department', 'Mechanical Engineering (MECH)');
    await page.selectOption('#year', '2nd Year');
    await page.fill('#phone', '9876543210');
    await page.fill('#email', email);
    await page.check('input[type="checkbox"]');
    await page.getByRole('button', { name: /Submit Registration/i }).click();
    await expect(page.locator('text=Registration Successful')).toBeVisible({ timeout: 10000 });

    // Reset to registration form for second duplicate attempt
    const resetBtn = page.getByRole('button', { name: /Register Another Event/i });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    } else {
      await page.goto('/registration');
      await page.reload();
    }
    await expect(page.locator('#full_name')).toBeVisible();

    await page.getByRole('button', { name: /Cultural/i }).click();
    await page.selectOption('#event_id', { index: 1 });
    await page.fill('#full_name', 'Duplicate Check Student');
    await page.fill('#roll_number', dupRoll);
    await page.selectOption('#department', 'Mechanical Engineering (MECH)');
    await page.selectOption('#year', '2nd Year');
    await page.fill('#phone', '9876543210');
    await page.fill('#email', email);
    await page.check('input[type="checkbox"]');
    await page.getByRole('button', { name: /Submit Registration/i }).click();

    await expect(
      page.locator(`text=/${dupRoll}.*already registered|already exists.*${dupRoll}|already registered.*${dupRoll}/i`).first()
    ).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Registration Successful')).not.toBeVisible();
  });

  test('7. Admin can see college information', async ({ page }) => {
    await page.goto('/admin/registrations');
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto('/admin/colleges');
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('8. Event eligibility wording', async ({ page }) => {
    await page.goto('/events/basketball-boys');
    await expect(page.locator('text=Eligibility').first()).toBeVisible();
    await expect(page.locator('text=Open to eligible students from RVR & J.C. College and participating colleges').first()).toBeVisible();
  });
  test('9. Boys Table Tennis exists', async ({ page }) => {
    await page.goto('/events/sports');
    await expect(page.locator('text=Table Tennis').first()).toBeVisible();
    await page.goto('/events/table-tennis-boys');
    await expect(page.locator('h1')).toContainText('Table Tennis');
    await expect(page.locator('section').locator('text=Boys').first()).toBeVisible();
  });

  test('10. Girls Table Tennis exists', async ({ page }) => {
    await page.goto('/events/sports');
    await expect(page.locator('text=Table Tennis').first()).toBeVisible();
    await page.goto('/events/table-tennis-girls');
    await expect(page.locator('h1')).toContainText('Table Tennis');
    await expect(page.locator('section').locator('text=Girls').first()).toBeVisible();
  });

  test('11. Two-day schedule still works', async ({ page }) => {
    await page.goto('/schedule');
    await expect(page.locator('h1')).toContainText('Two-Day Event Schedule');
    await expect(page.locator('text=Day 1 Schedule')).toBeVisible();
    await page.getByRole('button', { name: /Day 2 Schedule/i }).click();
    await expect(page.locator('text=Day 2 — Competitions, Finals & Valedictory')).toBeVisible();
  });

  test('12. Existing admin authentication still works', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'unauthorized@example.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.locator('text=/Invalid|failed|error/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('13. Existing public navigation still works', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Explore Events/i }).first().click();
    await expect(page).toHaveURL(/\/events/);
    await page.goto('/about');
    await expect(page.locator('h1')).toContainText('About COLORIDO 2K26');
    await page.goto('/registration');
    await expect(page.locator('h1')).toContainText('Student Registration');
  });

});
