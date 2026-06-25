# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: summative_evaluation.spec.ts >> Summative Evaluation Gating and Warnings >> start screen shows evaluation mode info card with format, time, and retry policy
- Location: tests\summative_evaluation.spec.ts:33:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Format de l\'évaluation')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Format de l\'évaluation')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - img [ref=e5]
    - heading "Page ou cours introuvable" [level=1] [ref=e8]
    - paragraph [ref=e9]: Le document ou la leçon que vous essayez de consulter n'existe pas ou a été déplacé. Il est possible que cette URL ait été utilisée auparavant pour un cours, mais que ce cours ait été supprimé pour différentes raisons, telles qu'un manque de qualité, une mise à jour de notre programme ou d'autres mesures d'amélioration académique.
    - generic [ref=e10]:
      - link "Parcourir le catalogue" [ref=e11] [cursor=pointer]:
        - /url: /catalog
        - img [ref=e12]
        - text: Parcourir le catalogue
        - img [ref=e15]
      - link "Retour à l'accueil" [ref=e17] [cursor=pointer]:
        - /url: /
  - alert [ref=e18]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE_URL = 'http://localhost:3000';
  4  | 
  5  | test.describe('Summative Evaluation Gating and Warnings', () => {
  6  | 
  7  |   test.beforeEach(async ({ page, context }) => {
  8  |     await context.addCookies([{
  9  |       name: 'openprimer_lang',
  10 |       value: 'FR',
  11 |       url: BASE_URL
  12 |     }]);
  13 |     await page.addInitScript(() => {
  14 |       window.localStorage.setItem('openprimer_lang', 'FR');
  15 |       window.localStorage.setItem('op_allow_sandbox', 'true');
  16 |     });
  17 |   });
  18 | 
  19 |   test('should display the single-attempt warning checklist on the start screen for a summative quiz/essay', async ({ page }) => {
  20 |     await page.goto(`${BASE_URL}/fr/l1/histoire_de_l_art/apprendre-a-voir-analyse-oeuvre`);
  21 | 
  22 |     const evaluationHeading = page.locator('h3:has-text("Évaluation sommative")');
  23 |     await expect(evaluationHeading).toBeVisible();
  24 |     await evaluationHeading.scrollIntoViewIfNeeded();
  25 | 
  26 |     const warningText = page.locator("text=Tentative unique : Il s'agit de l'évaluation finale");
  27 |     await expect(warningText).toBeVisible();
  28 | 
  29 |     const prepAdvice = page.locator("text=Assurez-vous d'avoir bien révisé");
  30 |     await expect(prepAdvice).toBeVisible();
  31 |   });
  32 | 
  33 |   test('start screen shows evaluation mode info card with format, time, and retry policy', async ({ page }) => {
  34 |     await page.goto(`${BASE_URL}/fr/l1/histoire_de_l_art/apprendre-a-voir-analyse-oeuvre`);
  35 | 
  36 |     // The mode info card should show evaluation format label
  37 |     const modeLabel = page.locator("text=Format de l'évaluation");
> 38 |     await expect(modeLabel).toBeVisible();
     |                             ^ Error: expect(locator).toBeVisible() failed
  39 | 
  40 |     // Single-attempt retry policy should be visible for a summative (isFinal) evaluation
  41 |     const retryPolicy = page.locator('text=Tentative unique — évaluation terminale');
  42 |     await expect(retryPolicy).toBeVisible();
  43 |   });
  44 | 
  45 |   test('offline-blocked: shows service unavailable screen and no grade when AI returns 503', async ({ page }) => {
  46 |     // Intercept the evaluate API and return an offline 503 response
  47 |     await page.route('**/api/tutor/evaluate', async (route) => {
  48 |       await route.fulfill({
  49 |         status: 503,
  50 |         contentType: 'application/json',
  51 |         body: JSON.stringify({
  52 |           success: false,
  53 |           offline: true,
  54 |           error: 'The AI evaluation service is currently unavailable.'
  55 |         })
  56 |       });
  57 |     });
  58 | 
  59 |     await page.goto(`${BASE_URL}/secondary_2/Histoire/Revolution_francaise/directoire-consulat-nouvel-ordre`);
  60 | 
  61 |     // Click Start
  62 |     const startButton = page.locator("button:has-text(\"Démarrer\")").first();
  63 |     await startButton.click();
  64 | 
  65 |     // Write a minimum-length response
  66 |     const textarea = page.locator('textarea').first();
  67 |     await textarea.fill("Voici ma réponse à l'évaluation de test pour déclencher la soumission.");
  68 | 
  69 |     // Submit
  70 |     const submitButton = page.locator('button:has-text("Soumettre")').first();
  71 |     await submitButton.click();
  72 | 
  73 |     // Expect the offline-blocked screen with pending message — no grade shown
  74 |     const blockedTitle = page.locator("text=Évaluation en attente");
  75 |     await expect(blockedTitle).toBeVisible({ timeout: 10000 });
  76 | 
  77 |     // Ensure no grade is displayed (e.g. "14/20")
  78 |     const gradeElement = page.locator('text=/\\d+\\/20/');
  79 |     await expect(gradeElement).not.toBeVisible();
  80 | 
  81 |     // Offline pending description instructions must be present
  82 |     const pendingMsg = page.locator("text=Le service du Tuteur IA est temporairement hors-ligne");
  83 |     await expect(pendingMsg).toBeVisible();
  84 | 
  85 |     // A retry button should be present
  86 |     const retryBtn = page.locator("button:has-text(\"Réessayer la soumission\")");
  87 |     await expect(retryBtn).toBeVisible();
  88 |   });
  89 | });
  90 | 
```