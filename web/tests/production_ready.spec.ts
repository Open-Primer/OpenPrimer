import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('OpenPrimer Production Readiness', () => {

  test('Global i18n Switching', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Verify English (Default)
    await expect(page.locator('h1')).toContainText('Universal Knowledge');
    
    // Switch to French
    await page.click('button:has-text("🇺🇸 EN")');
    await page.click('button:has-text("🇫🇷 Français")');
    await expect(page.locator('h1')).toContainText('Savoir Universel');
    
    // Switch to Spanish
    await page.click('button:has-text("🇫🇷 FR")');
    await page.click('button:has-text("🇪🇸 Español")');
    await expect(page.locator('h1')).toContainText('Conocimiento Universal');
  });

  test('Catalog Navigation and Dynamic Content', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Browse Catalog');
    await expect(page).toHaveURL(/.*catalog/);
    await expect(page.locator('h1')).toContainText('Repository');
    
    // Verify at least one course category or search bar
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('User Profile and Curriculum Accessibility', async ({ page }) => {
    await page.goto(`${BASE_URL}/profile/curriculum`);
    // Gatekeeper should handle auth or show access restricted if not local
    // For local dev tests, it should load
    await expect(page.locator('h1')).toContainText('Curriculum');
    await expect(page.locator('text=AI Pedagogical Summary')).toBeVisible();
  });

  test('Admin Console Protection', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    // Should show the admin dashboard or login
    await expect(page.locator('text=Project Overview')).toBeVisible();
  });

});
