import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('OpenPrimer Widgets Localization E2E Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.setItem('op_allow_sandbox', 'true');
      localStorage.setItem('openprimer_lang', 'EN');
      localStorage.setItem('op_session', 'true');
      localStorage.setItem('op_user_profile', JSON.stringify({ email: 'admin@openprimer.app', role: 'admin' }));
    });
    await page.reload();
  });

  test('should verify Widgets Tab visual layout and translations across EN/FR', async ({ page }) => {
    test.slow();

    // 1. Navigate to admin curriculum cockpit
    await page.goto(`${BASE_URL}/admin/curriculum`);
    await expect(page.locator('h1')).toContainText(/Curriculum Control Center|Centre de Contrôle/);

    // 2. Click Interactive Widgets tab
    const widgetsTabBtn = page.locator('button:has-text("Interactive Widgets"), button:has-text("Widgets Interactifs")').first();
    await expect(widgetsTabBtn).toBeVisible();
    await widgetsTabBtn.click();

    // 3. Verify widget workshop is active
    await expect(page.locator('h2:has-text("Pedagogical Widgets Workshop"), h2:has-text("Atelier des Widgets Pédagogiques")').first()).toBeVisible({ timeout: 15000 });

    // 4. Click language switcher to ensure it's English
    await page.locator('button').filter({ hasText: /English|FR|EN/i }).first().hover();
    const englishBtn = page.locator('button:has-text("English")');
    if (await englishBtn.isVisible()) {
      await englishBtn.click();
    }

    // 5. Select a widget card and simulate checking for localized items
    // First widget card in list (h4.text-xs)
    const widgetCard = page.locator('h4.text-xs').first();
    await expect(widgetCard).toBeVisible();
    await widgetCard.click();

    // 6. Test language switching to French and check UI response
    await page.locator('button').filter({ hasText: /English|EN/i }).first().hover();
    await page.click('button:has-text("Français")');

    // Confirm UI translated to French
    await expect(page.locator('h2:has-text("Atelier des Widgets Pédagogiques")').first()).toBeVisible({ timeout: 15000 });

    // Switch back to English
    await page.locator('button').filter({ hasText: /Français|FR/i }).first().hover();
    await page.click('button:has-text("English")');

    await expect(page.locator('h2:has-text("Pedagogical Widgets Workshop")').first()).toBeVisible({ timeout: 15000 });
  });

  test('should verify the create modal validation constraints and tooltips', async ({ page }) => {
    // 1. Navigate to admin curriculum cockpit
    await page.goto(`${BASE_URL}/admin/curriculum`);
    const widgetsTabBtn = page.locator('button:has-text("Interactive Widgets"), button:has-text("Widgets Interactifs")').first();
    await widgetsTabBtn.click();

    // 2. Open Create Widget Modal
    const createBtn = page.locator('button:has-text("Create Component"), button:has-text("Créer un composant"), button:has-text("Create Widget")').first();
    await expect(createBtn).toBeVisible();
    await createBtn.click();

    // 3. Verify tooltip helper and inputs
    const displayNameInput = page.locator('input[placeholder*="Light Optics Simulator"]');
    await expect(displayNameInput).toBeVisible();

    // Tooltip warning text check
    const tooltipText = page.locator('text=Display name must be between 3 and 50 characters.');
    await expect(tooltipText).toBeVisible();

    // Close modal
    const closeBtn = page.locator('button:has-text("Cancel"), button:has-text("Annuler")').first();
    await closeBtn.click();
  });
});
