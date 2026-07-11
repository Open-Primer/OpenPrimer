import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Summative Evaluation Gating and Warnings', () => {

  test.beforeEach(async ({ page, context }) => {
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

  test('should display the single-attempt warning checklist on the start screen for a summative quiz/essay', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/l7/geographie_physique_et_climatologie/evaluation-terminale`);

    const evaluationHeading = page.locator('h3:has-text("Évaluation sommative")').first();
    await expect(evaluationHeading).toBeVisible({ timeout: 10000 });
    await evaluationHeading.scrollIntoViewIfNeeded();

    const warningText = page.locator("text=Tentative unique").or(page.locator("text=Une seule tentative")).first();
    await expect(warningText).toBeVisible();

    const prepAdvice = page.locator("text=Assurez-vous d'avoir bien révisé").first();
    await expect(prepAdvice).toBeVisible();
  });

  test('start screen shows evaluation mode info card with format, time, and retry policy', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/l7/geographie_physique_et_climatologie/evaluation-terminale`);

    // The mode info card should show evaluation format label
    const modeLabel = page.locator("text=Format de l'évaluation").first();
    await expect(modeLabel).toBeVisible({ timeout: 10000 });

    // Single-attempt retry policy should be visible for a summative (isFinal) evaluation
    const retryPolicy = page.locator('text=tentative').or(page.locator('text=tentative unique')).or(page.locator('text=une seule tentative')).first();
    await expect(retryPolicy).toBeVisible();
  });

  test('offline-blocked: shows service unavailable screen and no grade when AI returns 503', async ({ page, context }) => {
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

    await page.goto(`${BASE_URL}/fr/l1/test_widgets/evaluations_quiz`);

    // Click Start
    const startButton = page.locator('button:has-text("Commencer"), button:has-text("Démarrer"), button:has-text("Start")').first();
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
    const pendingMsg = page.locator("text=Le tuteur IA est temporairement hors ligne")
      .or(page.locator("text=Le service du Tuteur IA est temporairement hors-ligne"))
      .first();
    await expect(pendingMsg).toBeVisible();

    // A retry button should be present
    const retryBtn = page.locator("button:has-text(\"Réessayer la soumission\")");
    await expect(retryBtn).toBeVisible();
  });
});
