import { test, expect } from '@playwright/test';

test.describe('Organic Chemistry visibility and language auto-switching', () => {
  test('should hide Organic Chemistry in French catalog, show in English catalog', async ({ page, context }) => {
    test.slow();
    // 1. Set language and sandbox cookies
    await context.addCookies([
      {
        name: 'openprimer_lang',
        value: 'FR',
        url: 'http://localhost:3000'
      },
      {
        name: 'op_allow_sandbox',
        value: 'true',
        url: 'http://localhost:3000'
      }
    ]);
    
    await page.addInitScript(() => {
      window.localStorage.setItem('op_allow_sandbox', 'true');
      if (!window.localStorage.getItem('openprimer_lang')) {
        window.localStorage.setItem('openprimer_lang', 'FR');
      }
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
    // Forward browser console logs and instrument network lifecycle logging
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('request', req => console.log(`[TEST NETWORK REQ]: ${req.method()} ${req.url()}`));
    page.on('response', res => console.log(`[TEST NETWORK RES]: ${res.status()} ${res.url()}`));

    // 1. Setup mock user session enrolled in course 9 in French session
    await context.addCookies([
      {
        name: 'openprimer_lang',
        value: 'FR',
        url: 'http://localhost:3000'
      },
      {
        name: 'op_allow_sandbox',
        value: 'true',
        url: 'http://localhost:3000'
      }
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('op_allow_sandbox', 'true');
      window.localStorage.setItem('op_session', 'true');
      window.localStorage.setItem('op_user_profile', JSON.stringify({ id: 'u1', name: 'Test User' }));
      window.localStorage.setItem('op_enrolled_courses', JSON.stringify([9]));
      if (!window.localStorage.getItem('openprimer_lang')) {
        window.localStorage.setItem('openprimer_lang', 'FR');
      }
    });
    
    // Navigate to curriculum page
    await page.goto('http://localhost:3000/profile/curriculum');
    await page.waitForLoadState('networkidle');

    // Verify curriculum page is in French
    try {
      await expect(page.locator('h1')).toContainText(/Mon Curriculum/i, { timeout: 15000 });
    } catch (e) {
      console.log("PAGE CONTENT ON H1 FAILURE:", await page.content());
      throw e;
    }

    // Verify Organic Chemistry is visible (it uses getLocalizedTitle which returns French translation if present,
    // which is "Chimie : Chimie Organique" or "Organic Chemistry")
    // Let's check for either title to be safe
    const chemistryCard = page.locator('h3:has-text("Chimie Organique"), h3:has-text("Organic Chemistry")');
    await expect(chemistryCard).toBeVisible();

    // Verify the "EN" badge is visible because the course is not available in the active language (FR)
    await expect(page.locator('span:has-text("EN")').first()).toBeVisible();

    console.log("[TEST LOG] Clicking on the Organic Chemistry course card...");
    // 2. Click on the Organic Chemistry course card
    await chemistryCard.click();

    console.log("[TEST LOG] Clicked. Expecting redirect to organic chemistry introduction...");
    // 3. Verify it auto-switches to English and redirects
    await expect(page).toHaveURL(/.*\/(l1|101)\/chemistry\/organic-chemistry\/introduction/i, { timeout: 15000 });
    
    // Wait for the lesson title/header to be visible to ensure client-side hydration has completed
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });

    // Check localStorage language switched to EN
    const currentLang = await page.evaluate(() => window.localStorage.getItem('openprimer_lang'));
    console.log(`[TEST LOG] Current language in localStorage after redirect: ${currentLang}`);
    expect(currentLang).toBe('EN');
  });
});

