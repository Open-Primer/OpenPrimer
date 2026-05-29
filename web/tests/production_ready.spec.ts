import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('OpenPrimer Production Readiness', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([{
      name: 'openprimer_lang',
      value: 'EN',
      url: BASE_URL
    }]);
    await page.addInitScript(() => {
      window.localStorage.setItem('op_allow_sandbox', 'true');
    });
  });

  test('Global i18n Switching', async ({ page }) => {
    test.slow();
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      window.localStorage.setItem('openprimer_lang', 'EN');
    });
    await page.reload();
    
    // Verify English (Default)
    await expect(page.locator('h1')).toContainText('Universal Knowledge');
    
    // Switch to French
    await page.locator('button').filter({ hasText: /EN/ }).first().hover();
    await page.click('button:has-text("Français")');
    await expect(page.locator('h1')).toContainText('Le Savoir Universel.');
    
    // Switch to Spanish
    await page.locator('button').filter({ hasText: /FR/ }).first().hover();
    await page.click('button:has-text("Español")');
    await expect(page.locator('h1')).toContainText('El Conocimiento Universal.');
  });

  test('Catalog Navigation and Dynamic Content', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      window.localStorage.setItem('openprimer_lang', 'EN');
      window.localStorage.setItem('op_session', 'true');
    });
    await page.reload();
    await page.click('a[href="/catalog"]');
    await expect(page).toHaveURL(/.*catalog/);
    await expect(page.locator('h1')).toContainText(/Browse Catalog|Parcourir/);
    
    // Verify at least one course category or search bar
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('User Profile and Curriculum Accessibility', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.setItem('op_enrolled_courses', JSON.stringify([1, 2]));
      localStorage.setItem('op_course_progress', JSON.stringify({ Classical_Mechanics: 45, Physique_Test_L2: 12 }));
    });
    await page.goto(`${BASE_URL}/profile/curriculum`);
    // Gatekeeper should handle auth or show access restricted if not local
    // For local dev tests, it should load
    await expect(page.locator('h1')).toContainText('Curriculum');
    await expect(page.locator('text=AI Pedagogical Summary')).toBeVisible();
  });

  test('Admin Console Protection', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.setItem('op_session', 'true');
      localStorage.setItem('op_user_profile', JSON.stringify({ email: 'admin@openprimer.org', role: 'admin' }));
    });
    await page.reload();
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.locator('text=Project Overview')).toBeVisible();
  });

});
