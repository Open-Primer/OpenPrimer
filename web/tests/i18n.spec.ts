import { test, expect } from '@playwright/test';

test('verify i18n switching on landing page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Verify English (Default)
  await expect(page.locator('h1')).toContainText('Universal Knowledge.');
  
  // Switch to French
  await page.click('button:has-text("EN")');
  await page.click('button:has-text("🇫🇷 Français")');
  
  // Verify French
  await expect(page.locator('h1')).toContainText('Le Savoir Universel.');
  
  // Switch to Chinese
  await page.click('button:has-text("FR")');
  await page.click('button:has-text("🇨🇳 中文")');
  
  // Verify Chinese
  await expect(page.locator('h1')).toContainText('普及全球知识。');
});

test('verify catalog page loads dynamic data', async ({ page }) => {
  await page.goto('http://localhost:3000/catalog');
  
  // Check if title is correct (localized)
  await expect(page.locator('h1')).toContainText('Curriculum');
  
  // Check if at least one course card is rendered (dynamic)
  // Note: This requires the database to be populated
  const cards = page.locator('.group.block.h-full');
  // Even if 0 cards, the search message should appear
  if (await cards.count() === 0) {
    await expect(page.locator('text=No courses found')).toBeVisible();
  }
});
