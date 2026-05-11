import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('OpenPrimer Smoke Tests', () => {
  
  test('should load the home page and show the brand', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('text=OPENPRIMER')).toBeVisible();
  });

  test('should navigate to the catalog', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Catalog');
    await expect(page).toHaveURL(/.*catalog/);
    await expect(page.locator('h1')).toContainText('Curriculum');
  });

  test('should render a course page with interactive components', async ({ page }) => {
    // On teste une section générée par le Feynman Engine
    await page.goto(`${BASE_URL}/L1/Physics/Classical_Mechanics/section_1.en`);
    
    // Vérification du titre et du versioning
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Version 1.4.0')).toBeVisible();

    // Vérification des composants interactifs
    await expect(page.locator('text=Knowledge Check')).toBeVisible();
    await expect(page.locator('text=FillInBlanks')).toBeVisible(); // Nom du composant ou texte associé
    await expect(page.locator('text=Points Clés à Retenir')).toBeVisible();
  });

  test('should switch language in the TopNav', async ({ page }) => {
    await page.goto(BASE_URL);
    const frBtn = page.locator('button:text("FR")');
    const enBtn = page.locator('button:text("EN")');
    
    await expect(frBtn).toBeVisible();
    await frBtn.click();
    // On pourrait vérifier un changement de texte ici
  });
});
