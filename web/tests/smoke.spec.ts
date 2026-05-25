import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('OpenPrimer Smoke Tests', () => {
  
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([{
      name: 'openprimer_lang',
      value: 'EN',
      url: BASE_URL
    }]);
    await page.addInitScript(() => {
      window.localStorage.setItem('openprimer_lang', 'EN');
    });
  });
  
  test('should load the home page and show the brand', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('nav').locator('text=OPENPRIMER').first()).toBeVisible();
  });

  test('should navigate to the catalog', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('a[href="/catalog"]').first().click();
    await expect(page).toHaveURL(/.*catalog/);
    await expect(page.locator('h1')).toContainText(/Browse Catalog|Parcourir/);
  });

  test('should render a course page with interactive components', async ({ page }) => {
    await page.goto(`${BASE_URL}/catalog`);
    const demoLink = page.locator('a[href*="/L1/"]').first();
    if (await demoLink.count() > 0) {
      await demoLink.click();
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('should switch language in the TopNav', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('button').filter({ hasText: /EN/ }).first().click();
    const frOption = page.locator('button:has-text("Français")');
    await expect(frOption).toBeVisible();
    await frOption.click();
  });
});
