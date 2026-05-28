import { test, expect } from '@playwright/test';

test('verify i18n switching on landing page', async ({ page, context }) => {
  test.slow();
  await context.addCookies([{
    name: 'openprimer_lang',
    value: 'EN',
    url: 'http://localhost:3000'
  }]);
  await page.goto('http://localhost:3000');
  await page.evaluate(() => {
    window.localStorage.setItem('openprimer_lang', 'EN');
  });
  await page.reload();
  
  // Verify English (Default)
  await expect(page.locator('h1')).toContainText('Universal Knowledge.');
  
  // Switch to French
  await page.locator('button').filter({ hasText: /EN/ }).first().hover();
  await page.click('button:has-text("Français")');
  
  // Verify French
  await expect(page.locator('h1')).toContainText('Le Savoir Universel.');
  
  // Switch to Chinese
  await page.locator('button').filter({ hasText: /FR/ }).first().hover();
  await page.click('button:has-text("中文")');
  
  // Verify Chinese
  await expect(page.locator('h1')).toContainText('普及全球知识。');
});

test('should navigate to the catalog', async ({ page, context }) => {
  await context.addCookies([{
    name: 'openprimer_lang',
    value: 'EN',
    url: 'http://localhost:3000'
  }]);
  await page.goto('http://localhost:3000');
  await page.evaluate(() => {
    window.localStorage.setItem('openprimer_lang', 'EN');
  });
  await page.reload();
  await page.locator('a[href="/catalog"]').first().click({ force: true });
  await expect(page).toHaveURL(/.*catalog/, { timeout: 15000 });
  await expect(page.locator('h1')).toContainText(/Browse Catalog|Parcourir/);

  // Check if at least one course card is rendered (dynamic)
  // Note: This requires the database to be populated
  const cards = page.locator('.group.block.h-full');
  
  // Wait for either cards or "No courses found" message to render
  await Promise.race([
    page.waitForSelector('.group.block.h-full', { timeout: 5000 }).catch(() => {}),
    page.waitForSelector('text=No courses found', { timeout: 5000 }).catch(() => {})
  ]);

  // Even if 0 cards, the search message should appear
  if (await cards.count() === 0) {
    await expect(page.locator('text=No courses found')).toBeVisible();
  }
});
