import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Fundamental Algorithms Lesson Smoke Test', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear any existing cookies & storage
    await context.clearCookies();
    
    // Catch browser console/page errors
    page.on('pageerror', (err) => {
      console.log('🔴 BROWSER PAGE ERROR:', err.message, err.stack);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('🔴 BROWSER CONSOLE ERROR:', msg.text());
      }
    });

    // Set ONLY the language cookie to French.
    // Do NOT set op_allow_sandbox, ensuring the database proxy uses Supabase provider.
    await context.addCookies([
      {
        name: 'openprimer_lang',
        value: 'fr',
        url: BASE_URL
      }
    ]);

    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem('openprimer_lang', 'fr');
    });
  });

  test('should load the French lesson on algorithms successfully from Supabase', async ({ page }) => {
    const lessonUrl = `${BASE_URL}/L1/Informatique/Algorithmique_fondamentale/art-resolution-problemes-genese-algorithmes`;
    console.log(`Navigating to: ${lessonUrl}`);
    
    const response = await page.goto(lessonUrl, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);

    // Verify main heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    const headingText = await heading.textContent();
    console.log(`Page Heading: "${headingText}"`);
    expect(headingText).toContain("L'art de la résolution de problèmes");

    // Check that historical persons (like Euclide or Al-Khwarizmi) are rendered.
    const euclideElement = page.locator('text=Euclide').first();
    await expect(euclideElement).toBeVisible();
    
    // Check for "Al-Khw" (which will match Al-Khwarizmi or Al-Khwârizmî)
    const khwarizmiText = page.locator('text=Al-Khw').first();
    await expect(khwarizmiText).toBeVisible();

    console.log('✅ RealPerson / HistoricalPerson elements found and visible in document!');
  });
});
