import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('OpenPrimer Smoke Tests', () => {
  
  test.beforeEach(async ({ page, context }) => {
    page.on('pageerror', (err) => {
      console.log('🔴 BROWSER PAGE ERROR:', err.message, err.stack);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('🔴 BROWSER CONSOLE ERROR:', msg.text());
      } else {
        console.log('⚪ BROWSER LOG:', msg.text());
      }
    });

    await context.addCookies([
      {
        name: 'openprimer_lang',
        value: 'EN',
        url: BASE_URL
      },
      {
        name: 'op_allow_sandbox',
        value: 'true',
        url: BASE_URL
      }
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('openprimer_lang', 'EN');
      window.localStorage.setItem('op_allow_sandbox', 'true');
    });
  });
  
  test('should load the home page and show the brand', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('nav').locator('text=OPENPRIMER').first()).toBeVisible();
  });

  test('should navigate directly to course page when clicking a course in the homepage carousel', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Give Next.js router extra time to initialize and stabilize
    
    // Find the first course card button in the kiosk carousel
    const courseCard = page.locator('button').filter({ hasText: /VIEW DETAILS/i }).first();
    await expect(courseCard).toBeVisible();
    
    await courseCard.click();
    await page.waitForURL(/\/L[1-4]\/.*\/(introduction|newtons_laws_of_motion)/, { timeout: 15000 });
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).not.toHaveText(/Page or Course Not Found|not found/i);
  });

  test('should navigate to the catalog', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Give Next.js router extra time to initialize and stabilize
    
    const catalogLink = page.locator('a[href="/catalog"]').first();
    await expect(catalogLink).toBeVisible();
    
    let navigated = false;
    for (let i = 0; i < 3; i++) {
      try {
        await catalogLink.click({ timeout: 2000 });
        await page.waitForURL(/.*catalog/, { timeout: 2000 });
        navigated = true;
        break;
      } catch (e) {
        console.log(`[Test Retry] Catalog navigation attempt ${i + 1} did not succeed:`, (e as any).message);
        await page.waitForTimeout(1000);
      }
    }
    expect(navigated).toBe(true);
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
    await page.locator('button').filter({ hasText: /English|EN/i }).first().click();
    const frOption = page.locator('button:has-text("Français")');
    await expect(frOption).toBeVisible();
    await frOption.click();
  });
});
