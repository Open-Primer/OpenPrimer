import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('OpenPrimer AI Tutor Personalities CRUD & Cost Analytics Suite', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Force the English locale via localStorage for uniform testing
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.setItem('openprimer_lang', 'EN'));
    await page.reload();
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
    await page.click('button:has-text("AI Tutor Personalities"), button:has-text("Personnalités")');

    // Assert Socratic Coach (Default) is visible in personalities grid
    await expect(page.locator('h3:has-text("Socratic Coach")')).toBeVisible();
    
    // Delete button for default persona should be disabled
    const socraticCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Socratic Coach' }) }).first();
    const socraticDeleteBtn = socraticCard.locator('button:has-text("Delete")');
    await expect(socraticDeleteBtn).toBeDisabled();

    // Add New Personality
    await page.click('button:has-text("Add New Personality"), button:has-text("Créer une Personnalité")');
    await page.fill('input[placeholder*="Stoic Advisor"]', 'Philosophical Stoic');
    await page.fill('textarea[placeholder*="Seneca"]', 'Guide using Seneca quotes and Marcus Aurelius meditations.');
    await page.click('button:has-text("Create Custom Persona"), button:has-text("Créer")');

    // Assert Philosophical Stoic is visible in grid
    await expect(page.locator('h3:has-text("Philosophical Stoic")')).toBeVisible();

    // Verify student-facing tutor overlay dynamically lists the new persona
    await page.goto(`${BASE_URL}/L1/Physics/Classical_Mechanics/introduction`);
    
    // Locate the floating sparkles button to open overlay
    const overlayBtn = page.locator('button:has(svg.group-hover\\:rotate-12)').first();
    await overlayBtn.click();
    
    // Select persona dropdown
    const personaSelect = page.locator('select').first();
    await expect(personaSelect).toBeVisible();
    await expect(personaSelect).toContainText('Philosophical Stoic');

    // Set the Philosophical Stoic as active
    await personaSelect.selectOption({ label: 'Philosophical Stoic' });
    
    // Switch back to admin curriculum to perform deletion fallback test
    await page.goto(`${BASE_URL}/admin/curriculum`);
    await page.click('button:has-text("AI Tutor Personalities"), button:has-text("Personnalités")');

    // Set Philosophical Stoic as Default first!
    const stoicCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Philosophical Stoic' }) }).first();
    await stoicCard.locator('button:has-text("Set as Default")').click();

    // Now delete Socratic Coach cleanly
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    const newSocraticCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Socratic Coach' }) }).first();
    await newSocraticCard.locator('button:has-text("Delete")').click();
    await expect(page.locator('h3:has-text("Socratic Coach")')).not.toBeVisible();

    // Try deleting Philosophical Stoic, which is now default. It should fail since it's default!
    const updatedStoicCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Philosophical Stoic' }) }).first();
    await expect(updatedStoicCard.locator('button:has-text("Delete")')).toBeDisabled();
  });

});
