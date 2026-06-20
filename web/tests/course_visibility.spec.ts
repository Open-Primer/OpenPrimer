import { test, expect } from '@playwright/test';

test.describe('Organic Chemistry visibility and language auto-switching', () => {
  test('should hide Organic Chemistry in French catalog, show in English catalog', async ({ page, context }) => {
    test.slow();
    // 1. Set language cookie
    await context.addCookies([{
      name: 'openprimer_lang',
      value: 'FR',
      url: 'http://localhost:3000'
    }]);
    
    // 2. Go to landing page first to initialize localStorage safely
    await page.goto('http://localhost:3000/');
    await page.evaluate(() => {
      window.localStorage.setItem('op_allow_sandbox', 'true');
      window.localStorage.setItem('openprimer_lang', 'FR');
    });

    // 3. Now navigate to catalog
    await page.goto('http://localhost:3000/catalog');
    await page.waitForLoadState('networkidle');

    // Check catalog is in French
    await expect(page.locator('h1')).toContainText(/Parcourir/i, { timeout: 15000 });

    // Verify Organic Chemistry is NOT visible
    // In French, its title would be "Chimie : Chimie Organique"
    await expect(page.locator('h3:has-text("Chimie Organique")')).not.toBeVisible();
    await expect(page.locator('h3:has-text("Organic Chemistry")')).not.toBeVisible();

    // 4. Load catalog in English
    await page.evaluate(() => {
      window.localStorage.setItem('openprimer_lang', 'EN');
    });
    await context.addCookies([{
      name: 'openprimer_lang',
      value: 'EN',
      url: 'http://localhost:3000'
    }]);
    await page.goto('http://localhost:3000/catalog');
    await page.waitForLoadState('networkidle');

    // Check catalog is in English
    await expect(page.locator('h1')).toContainText(/Browse Catalog/i, { timeout: 15000 });

    // Verify Organic Chemistry IS visible
    await expect(page.locator('h3:has-text("Organic Chemistry")')).toBeVisible();
  });

  test('should display Organic Chemistry in French curriculum page and auto-switch language on click', async ({ page, context }) => {
    test.slow();
    // 1. Setup mock user session enrolled in course 9 in French session
    await context.addCookies([{
      name: 'openprimer_lang',
      value: 'FR',
      url: 'http://localhost:3000'
    }]);
    await page.goto('http://localhost:3000/');
    await page.evaluate(() => {
      window.localStorage.setItem('op_allow_sandbox', 'true');
      window.localStorage.setItem('op_session', 'true');
      window.localStorage.setItem('op_user_profile', JSON.stringify({ id: 'u1', name: 'Test User' }));
      window.localStorage.setItem('op_enrolled_courses', JSON.stringify([9]));
      window.localStorage.setItem('openprimer_lang', 'FR');
    });
    
    // Navigate to curriculum page
    await page.goto('http://localhost:3000/profile/curriculum');
    await page.waitForLoadState('networkidle');

    // Verify curriculum page is in French
    await expect(page.locator('h1')).toContainText(/Mon Curriculum/i, { timeout: 15000 });

    // Verify Organic Chemistry is visible (it uses getLocalizedTitle which returns French translation if present,
    // which is "Chimie : Chimie Organique" or "Organic Chemistry")
    // Let's check for either title to be safe
    const chemistryCard = page.locator('h3:has-text("Chimie Organique"), h3:has-text("Organic Chemistry")');
    await expect(chemistryCard).toBeVisible();

    // Verify the "EN" badge is visible because the course is not available in the active language (FR)
    await expect(page.locator('span:has-text("EN")').first()).toBeVisible();

    // 2. Click on the Organic Chemistry course card
    await chemistryCard.click();

    // 3. Verify it auto-switches to English and redirects
    await expect(page).toHaveURL(/.*\/L1\/Chemistry\/organic-chemistry\/introduction/, { timeout: 15000 });
    
    // Check localStorage language switched to EN
    const currentLang = await page.evaluate(() => window.localStorage.getItem('openprimer_lang'));
    expect(currentLang).toBe('EN');
  });
});
