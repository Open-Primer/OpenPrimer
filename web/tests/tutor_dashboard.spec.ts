import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('OpenPrimer AI Tutor Personalities CRUD & Cost Analytics Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.setItem('op_allow_sandbox', 'true');
      localStorage.setItem('openprimer_lang', 'EN');
      localStorage.setItem('op_session', 'true');
      localStorage.setItem('op_user_profile', JSON.stringify({ email: 'admin@openprimer.org', role: 'admin' }));
    });
    await page.reload();
  });

  test.afterEach(async ({ page }) => {
    // Clean up any personality added during the test to prevent DB pollution
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      try {
        const personalities = JSON.parse(localStorage.getItem('openprimer_tutor_personalities') || '[]');
        const cleaned = personalities.filter((p: any) => p.name !== 'Philosophical Stoic');
        // Ensure at least one default remains
        if (cleaned.length > 0 && !cleaned.find((p: any) => p.isDefault)) {
          cleaned[0].isDefault = true;
        }
        localStorage.setItem('openprimer_tutor_personalities', JSON.stringify(cleaned));
      } catch (e) {
        // ignore cleanup errors
      }
    });
  });

  test('Overview & Financial Breakdown: should display agent statistics and token counts', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.locator('h1')).toContainText(/Project Overview|Aperçu du Projet/);

    // Verify AI Agent Financial Analytics table exists and has rows
    await expect(page.locator('text=AI Agent Financial & Operational Analytics')).toBeVisible();
    await expect(page.locator('text=Course Generation Agent')).toBeVisible();
    await expect(page.locator('text=Translation Agent')).toBeVisible();
    await expect(page.locator('text=Pedagogical Revision Agent')).toBeVisible();
    await expect(page.locator('text=AI Tutor Agent & Personalities')).toBeVisible();

    // Verify Token Consumption block is present
    await expect(page.locator('text=Token Consumption & Cache Savings')).toBeVisible();
    await expect(page.locator('text=Context Cache Hit Rate')).toBeVisible();

    // Verify tutor active personality distribution
    await expect(page.locator('text=Active Tutor Personality Distribution')).toBeVisible();
    await expect(page.locator('text=Socratic Coach')).toBeVisible();
  });

  test('Personalities CRUD: should manage custom tutor personalities with dynamic safeguard fallback', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/curriculum`);
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("AI Tutor Personalities"), button:has-text("Personnalités")');

    // Assert Socratic Coach (Default) is visible in personalities grid
    await expect(page.locator('h3:has-text("Socratic Coach")')).toBeVisible();
    
    // Level-3 archiving button for default persona should be disabled
    const socraticCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Socratic Coach' }) }).first();
    const socraticDeleteBtn = socraticCard.locator('button').filter({ hasText: /^3$/ });
    await expect(socraticDeleteBtn).toBeDisabled();

    // Open "Create Custom Persona" modal (trigger button on the tab bar)
    await page.click('button:has-text("Create Custom Persona"), button:has-text("Créer un personnage personnalisé")');
    await expect(page.locator('h3:has-text("Create Custom Persona")')).toBeVisible({ timeout: 5000 });

    // Input placeholder is "Stoic Advisor"; textarea placeholder contains "Stoic advisor"
    await page.fill('input[placeholder*="Stoic Advisor"]', 'Philosophical Stoic');
    await page.fill('textarea[placeholder*="Stoic advisor"]', 'Guide using Seneca quotes and Marcus Aurelius meditations.');
    // Submit button text is "Add New Personality"
    await page.click('button:has-text("Add New Personality"), button:has-text("Créer une Personnalité")');

    // Assert Philosophical Stoic is now visible in the grid
    await expect(page.locator('h3:has-text("Philosophical Stoic")')).toBeVisible({ timeout: 10000 });

    // Set Philosophical Stoic as Default
    const stoicCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Philosophical Stoic' }) }).first();
    await stoicCard.locator('button:has-text("Set as Default")').click();

    // Now delete Socratic Coach cleanly — click the level 3 archiving button
    const newSocraticCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Socratic Coach' }) }).first();
    await newSocraticCard.locator('button').filter({ hasText: /^3$/ }).click();
    
    // Accept custom double-safeguard modal
    const confirmBtn = page.locator('button:has-text("Confirm Delete"), button:has-text("Confirmer la suppression")').first();
    await expect(confirmBtn).toBeVisible({ timeout: 5000 });
    await confirmBtn.click();
    await expect(page.locator('h3:has-text("Socratic Coach")')).not.toBeVisible({ timeout: 10000 });

    // Philosophical Stoic is now default — its level-3 button should be disabled
    const updatedStoicCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Philosophical Stoic' }) }).first();
    await expect(updatedStoicCard.locator('button').filter({ hasText: /^3$/ })).toBeDisabled();
  });

});
