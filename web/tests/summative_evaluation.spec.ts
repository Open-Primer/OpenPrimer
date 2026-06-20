import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Summative Evaluation Gating and Warnings', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([{
      name: 'openprimer_lang',
      value: 'FR',
      url: BASE_URL
    }]);
    await page.addInitScript(() => {
      window.localStorage.setItem('openprimer_lang', 'FR');
      window.localStorage.setItem('op_allow_sandbox', 'true');
    });
  });

  test('should display the single-attempt warning checklist on the start screen for a summative quiz/essay', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/l1/histoire_de_l_art/apprendre-a-voir-analyse-oeuvre`);

    const evaluationHeading = page.locator('h3:has-text("Évaluation sommative")');
    await expect(evaluationHeading).toBeVisible();
    await evaluationHeading.scrollIntoViewIfNeeded();

    const warningText = page.locator("text=Tentative unique : Il s'agit de l'évaluation finale");
    await expect(warningText).toBeVisible();

    const prepAdvice = page.locator("text=Assurez-vous d'avoir bien révisé");
    await expect(prepAdvice).toBeVisible();
  });

  test('start screen shows evaluation mode info card with format, time, and retry policy', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/l1/histoire_de_l_art/apprendre-a-voir-analyse-oeuvre`);

    // The mode info card should show evaluation format label
    const modeLabel = page.locator("text=Format de l'évaluation");
    await expect(modeLabel).toBeVisible();

    // Single-attempt retry policy should be visible for a summative (isFinal) evaluation
    const retryPolicy = page.locator('text=Tentative unique — évaluation terminale');
    await expect(retryPolicy).toBeVisible();
  });

  test('offline-blocked: shows service unavailable screen and no grade when AI returns 503', async ({ page }) => {
    // Intercept the evaluate API and return an offline 503 response
    await page.route('**/api/tutor/evaluate', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          offline: true,
          error: 'The AI evaluation service is currently unavailable.'
        })
      });
    });

    await page.goto(`${BASE_URL}/secondary_2/Histoire/Revolution_francaise/directoire-consulat-nouvel-ordre`);

    // Click Start
    const startButton = page.locator("button:has-text(\"Démarrer\")").first();
    await startButton.click();

    // Write a minimum-length response
    const textarea = page.locator('textarea').first();
    await textarea.fill("Voici ma réponse à l'évaluation de test pour déclencher la soumission.");

    // Submit
    const submitButton = page.locator('button:has-text("Soumettre")').first();
    await submitButton.click();

    // Expect the offline-blocked screen with pending message — no grade shown
    const blockedTitle = page.locator("text=Évaluation en attente");
    await expect(blockedTitle).toBeVisible({ timeout: 10000 });

    // Ensure no grade is displayed (e.g. "14/20")
    const gradeElement = page.locator('text=/\\d+\\/20/');
    await expect(gradeElement).not.toBeVisible();

    // Offline pending description instructions must be present
    const pendingMsg = page.locator("text=Le service du Tuteur IA est temporairement hors-ligne");
    await expect(pendingMsg).toBeVisible();

    // A retry button should be present
    const retryBtn = page.locator("button:has-text(\"Réessayer la soumission\")");
    await expect(retryBtn).toBeVisible();
  });
});
