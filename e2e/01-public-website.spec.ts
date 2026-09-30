import { test, expect } from '@playwright/test';

test.describe('Public Website Workflows', () => {
  test('Home page loads successfully with official RVR & JC identity and 2-day event scope', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');

    // Check Page Title
    await expect(page).toHaveTitle(/COLORIDO 2K26/i);

    // Verify College & Event Scope Branding
    await expect(page.locator('text=RVR & J.C. College of Engineering').first()).toBeVisible();
    await expect(page.locator('text=Two-Day Cultural & Sports Event').first()).toBeVisible();
    await expect(page.locator('text=Open to Eligible Students from RVR & J.C. College and Participating Colleges').first()).toBeVisible();

    // Verify Main Call-to-Actions
    const registerBtn = page.getByRole('link', { name: /Register Now/i }).first();
    await expect(registerBtn).toBeVisible();
    await expect(registerBtn).toHaveAttribute('href', '/registration');

    const exploreBtn = page.getByRole('link', { name: /Explore Events/i }).first();
    await expect(exploreBtn).toBeVisible();
    await expect(exploreBtn).toHaveAttribute('href', '/events');

    // Verify Cultural Section with 8 categories
    await expect(page.locator('text=Cultural Activities').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Fine Arts")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Music"), h3:has-text("Band"), h3:has-text("Singing")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Dance")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Choreoday")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Dramatics")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Fashion Show")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Tekraft")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Literary"), h3:has-text("Debate"), h3:has-text("Quiz")').first()).toBeVisible();

    // Verify Sports Section with Boys and Girls divisions
    await expect(page.locator('text=Boys Tournaments').first()).toBeVisible();
    await expect(page.locator('text=Girls Tournaments').first()).toBeVisible();

    // Verify Festival Highlights & Campus Helpdesk
    await expect(page.locator('text=Festival Moments').first()).toBeVisible();
    await expect(page.locator('text=COLORIDO Organizing Committee').first()).toBeVisible();

    // Verify no fatal JS crashes
    expect(consoleErrors.filter((e) => !e.includes('favicon'))).toHaveLength(0);
  });

  test('Navbar links navigate to respective pages', async ({ page, isMobile }) => {
    await page.goto('/');

    const navigateTo = async (name: string, url: string) => {
      if (isMobile) {
        // Open mobile drawer
        const menuBtn = page.locator('button[aria-label="Toggle Navigation Menu"]');
        await menuBtn.click();
        await page.waitForTimeout(300);
        await page.locator(`.glass-strong a[href="${url}"]`).first().click();
      } else {
        await page.getByRole('link', { name }).first().click();
      }
      await expect(page).toHaveURL(new RegExp(url));
    };

    // Navigate to About
    await navigateTo('About', '/about');
    await expect(page.locator('h1')).toContainText('About COLORIDO 2K26');

    // Navigate to Events / Cultural
    if (!isMobile) {
      await navigateTo('Events', '/events');
      await expect(page.locator('h1')).toContainText('Festival Events');
    } else {
      await navigateTo('Cultural Fest', '/events/cultural');
      await expect(page.locator('h1')).toContainText('Cultural');
    }

    // Navigate to Schedule
    await navigateTo('Schedule', '/schedule');
    await expect(page.locator('h1')).toContainText('Two-Day Event Schedule');

    // Navigate to Announcements
    await navigateTo('Announcements', '/announcements');
    await expect(page.locator('h1')).toContainText('Announcements');

    // Navigate to Results
    await navigateTo('Results', '/results');
    await expect(page.locator('h1')).toContainText('Results');

    // Navigate to Gallery
    await navigateTo('Gallery', '/gallery');
    await expect(page.locator('h1')).toContainText('Gallery');

    // Navigate to Contact
    await navigateTo('Contact', '/contact');
    await expect(page.locator('h1')).toContainText('Contact');
  });

  test('Cultural events page loads and displays categories', async ({ page }) => {
    await page.goto('/events/cultural');
    await expect(page.locator('h1')).toContainText('Cultural');
    await expect(page.locator('text=Fine Arts').first()).toBeVisible();
    await expect(page.locator('text=Dance').first()).toBeVisible();
    await expect(page.locator('text=Music').first()).toBeVisible();
  });

  test('Sports events page loads and displays boys and girls divisions', async ({ page }) => {
    await page.goto('/events/sports');
    await expect(page.locator('h1')).toContainText('Sports');
    await expect(page.locator('text=Basketball').first()).toBeVisible();
    await expect(page.locator('text=Volleyball').first()).toBeVisible();
    await expect(page.locator('text=Throwball').first()).toBeVisible();
    await expect(page.locator('text=TenniKoit').first()).toBeVisible();
    await expect(page.locator('text=Table Tennis').first()).toBeVisible();
  });

  test('Event directory filters work correctly', async ({ page }) => {
    await page.goto('/events');

    // Default: All 14 events
    await expect(page.getByRole('button', { name: /All Events/i })).toBeVisible();

    // Click Cultural filter
    await page.getByRole('button', { name: /Cultural/i }).click();
    await expect(page.locator('.grid h3:has-text("Fine Arts")').first()).toBeVisible();
    await expect(page.locator('.grid h3:has-text("Choreoday")').first()).toBeVisible();

    // Click Boys Sports filter
    await page.getByRole('button', { name: /Boys Sports/i }).click();
    await expect(page.locator('.grid h3:has-text("Basketball")').first()).toBeVisible();
    await expect(page.locator('.grid h3:has-text("Throwball")')).not.toBeVisible();

    // Click Girls Sports filter
    await page.getByRole('button', { name: /Girls Sports/i }).click();
    await expect(page.locator('.grid h3:has-text("Throwball")').first()).toBeVisible();
    await expect(page.locator('.grid h3:has-text("TenniKoit")').first()).toBeVisible();
    await expect(page.locator('.grid h3').filter({ hasText: /\b(Men|Boys)\b/ })).toHaveCount(0);
  });

  test('Event detail page loads with rules, venue, schedule, and register button', async ({ page }) => {
    await page.goto('/events/basketball-boys');

    await expect(page.locator('h1')).toContainText('Basketball');
    await expect(page.locator('section').locator('text=Sports').first()).toBeVisible();
    await expect(page.locator('section').locator('text=Boys').first()).toBeVisible();
    await expect(page.locator('section').locator('text=Day 1').first()).toBeVisible();
    await expect(page.locator('text=College Outdoor Basketball Court').first()).toBeVisible();
    await expect(page.locator('text=Event Rules & Guidelines')).toBeVisible();

    const registerLink = page.locator('a[href*="/registration?event="]').first();
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute('href', /\/registration\?event=/);
  });

  test('Schedule page allows toggling between Day 1 and Day 2', async ({ page }) => {
    await page.goto('/schedule');

    // Day 1 tab active by default
    await expect(page.locator('text=Day 1 Schedule')).toBeVisible();
    await expect(page.locator('text=Morning Session').first()).toBeVisible();

    // Toggle to Day 2
    await page.getByRole('button', { name: /Day 2 Schedule/i }).click();
    await expect(page.locator('text=Day 2 — Competitions, Finals & Valedictory')).toBeVisible();
  });
});
