import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Essay Evaluation Upload & Grading Test', () => {
  
  test.beforeEach(async ({ page, context }) => {
    page.on('pageerror', (err) => {
      console.log('🔴 BROWSER PAGE ERROR:', err.message, err.stack);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('🔴 BROWSER CONSOLE ERROR:', msg.text());
      }
    });

    await context.addCookies([
      {
        name: 'openprimer_lang',
        value: 'FR',
        url: BASE_URL
      },
      {
        name: 'op_allow_sandbox',
        value: 'true',
        url: BASE_URL
      }
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('openprimer_lang', 'FR');
      window.localStorage.setItem('op_allow_sandbox', 'true');
    });
  });

  test('should allow switching to file upload tab, dropping a file, and submitting for grading', async ({ page }) => {
    // Intercept evaluate API to return mock grade
    await page.route('**/api/tutor/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          grade: '16/20',
          feedback: 'Excellent travail. Les concepts clés sont bien compris et illustrés par le schéma.'
        })
      });
    });

    // Navigate directly to the final lesson of droit_des_entreprises
    await page.goto(`${BASE_URL}/fr/l1/droit_des_entreprises/difficultes-procedures-collectives`);
    
    // Scroll down to the essay evaluation section
    const essayHeading = page.locator('h3:has-text("Évaluation de la rédaction")');
    await expect(essayHeading).toBeVisible();
    await essayHeading.scrollIntoViewIfNeeded();

    // Check if evaluation is not started yet and click "Démarrer l'Évaluation"
    const startButton = page.locator('button:has-text("Démarrer l\'Évaluation")');
    await startButton.click();

    // Verify Tab buttons are present
    const writeTab = page.locator('button:has-text("Rédiger")');
    const uploadTab = page.locator('button:has-text("Déposer")');
    await expect(writeTab).toBeVisible();
    await expect(uploadTab).toBeVisible();

    // Switch to Upload Tab
    await uploadTab.click();

    // Verify file dropzone is visible
    const dropzoneText = page.locator('text=Glissez et déposez votre fichier ici');
    await expect(dropzoneText).toBeVisible();

    // Simulate selecting/uploading a file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'concept_map.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5CYII=', 'base64')
    });

    // Verify file details are displayed after selection
    await expect(page.locator('text=concept_map.png')).toBeVisible();

    // Add accompanying notes
    const notesTextarea = page.locator('textarea[placeholder*="Décrivez brièvement"]');
    await expect(notesTextarea).toBeVisible();
    await notesTextarea.fill('Voici le schéma conceptuel représentant le traitement des difficultés des entreprises.');

    // Click submit button
    const submitButton = page.locator('button:has-text("Soumettre ma rédaction")');
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Wait for the grading results to render
    const feedbackTitle = page.locator('h4:has-text("Évaluation du Tuteur IA")');
    await expect(feedbackTitle).toBeVisible({ timeout: 20000 });

    // Verify the grade circle and its content exist
    const gradeCircle = page.locator('.rounded-full:has-text("Note")');
    await expect(gradeCircle).toBeVisible();

    const gradeLabel = gradeCircle.locator('span').first();
    await expect(gradeLabel).toHaveText("Note");

    const gradeText = gradeCircle.locator('span').nth(1);
    await expect(gradeText).toBeVisible();
    
    // Verify that file info is persisted in read-only view
    await expect(page.locator('p.text-slate-100:has-text("concept_map.png")')).toBeVisible();
    await expect(page.locator('p.italic:has-text("Voici le schéma conceptuel")')).toBeVisible();
  });
});
