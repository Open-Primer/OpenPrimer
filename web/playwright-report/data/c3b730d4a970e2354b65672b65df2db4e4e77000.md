# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tutor_dashboard.spec.ts >> OpenPrimer AI Tutor Personalities CRUD & Cost Analytics Suite >> Personalities CRUD: should manage custom tutor personalities with dynamic safeguard fallback
- Location: tests\tutor_dashboard.spec.ts:34:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h3:has-text("Socratic Coach")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h3:has-text("Socratic Coach")')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - img [ref=e4]
  - heading "This page couldn’t load" [level=1] [ref=e6]
  - paragraph [ref=e7]: Reload to try again, or go back.
  - generic [ref=e8]:
    - button "Reload" [ref=e10] [cursor=pointer]
    - button "Back" [ref=e11] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE_URL = 'http://localhost:3000';
  4  | 
  5  | test.describe('OpenPrimer AI Tutor Personalities CRUD & Cost Analytics Suite', () => {
  6  | 
  7  |   test.beforeEach(async ({ page }) => {
  8  |     // 1. Force the English locale via localStorage for uniform testing
  9  |     await page.goto(BASE_URL);
  10 |     await page.evaluate(() => localStorage.setItem('openprimer_lang', 'EN'));
  11 |     await page.reload();
  12 |   });
  13 | 
  14 |   test('Overview & Financial Breakdown: should display agent statistics and token counts', async ({ page }) => {
  15 |     await page.goto(`${BASE_URL}/admin`);
  16 |     await expect(page.locator('h1')).toContainText(/Project Overview|Aperçu du Projet/);
  17 | 
  18 |     // Verify AI Agent Financial Analytics table exists and has rows
  19 |     await expect(page.locator('text=AI Agent Financial & Operational Analytics')).toBeVisible();
  20 |     await expect(page.locator('text=Course Generation Agent')).toBeVisible();
  21 |     await expect(page.locator('text=Translation Agent')).toBeVisible();
  22 |     await expect(page.locator('text=Pedagogical Revision Agent')).toBeVisible();
  23 |     await expect(page.locator('text=AI Tutor Agent & Personalities')).toBeVisible();
  24 | 
  25 |     // Verify Token Consumption block is present
  26 |     await expect(page.locator('text=Token Consumption & Cache Savings')).toBeVisible();
  27 |     await expect(page.locator('text=Context Cache Hit Rate')).toBeVisible();
  28 | 
  29 |     // Verify tutor active personality distribution
  30 |     await expect(page.locator('text=Active Tutor Personality Distribution')).toBeVisible();
  31 |     await expect(page.locator('text=Socratic Coach')).toBeVisible();
  32 |   });
  33 | 
  34 |   test('Personalities CRUD: should manage custom tutor personalities with dynamic safeguard fallback', async ({ page }) => {
  35 |     await page.goto(`${BASE_URL}/admin/curriculum`);
  36 |     await page.click('button:has-text("AI Tutor Personalities"), button:has-text("Personnalités")');
  37 | 
  38 |     // Assert Socratic Coach (Default) is visible in personalities grid
> 39 |     await expect(page.locator('h3:has-text("Socratic Coach")')).toBeVisible();
     |                                                                 ^ Error: expect(locator).toBeVisible() failed
  40 |     
  41 |     // Delete button for default persona should be disabled
  42 |     const socraticCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Socratic Coach' }) }).first();
  43 |     const socraticDeleteBtn = socraticCard.locator('button[title*="Delete"]');
  44 |     await expect(socraticDeleteBtn).toBeDisabled();
  45 | 
  46 |     // Add New Personality
  47 |     await page.click('button:has-text("Add New Personality"), button:has-text("Créer une Personnalité")');
  48 |     await page.fill('input[placeholder*="Stoic Advisor"]', 'Philosophical Stoic');
  49 |     await page.fill('textarea[placeholder*="Seneca"]', 'Guide using Seneca quotes and Marcus Aurelius meditations.');
  50 |     await page.click('button:has-text("Create Custom Persona"), button:has-text("Créer")');
  51 | 
  52 |     // Assert Philosophical Stoic is visible in grid
  53 |     await expect(page.locator('h3:has-text("Philosophical Stoic")')).toBeVisible();
  54 | 
  55 |     // Verify student-facing tutor overlay dynamically lists the new persona
  56 |     await page.goto(`${BASE_URL}/L1/Physics/Classical_Mechanics/introduction`);
  57 |     
  58 |     // Locate the floating sparkles button to open overlay
  59 |     const overlayBtn = page.locator('button:has(svg.group-hover\\:rotate-12)').first();
  60 |     await overlayBtn.click();
  61 |     
  62 |     // Select persona dropdown
  63 |     const personaSelect = page.locator('select').first();
  64 |     await expect(personaSelect).toBeVisible();
  65 |     await expect(personaSelect).toContainText('Philosophical Stoic');
  66 | 
  67 |     // Set the Philosophical Stoic as active
  68 |     await personaSelect.selectOption({ label: 'Philosophical Stoic' });
  69 |     
  70 |     // Switch back to admin curriculum to perform deletion fallback test
  71 |     await page.goto(`${BASE_URL}/admin/curriculum`);
  72 |     await page.click('button:has-text("AI Tutor Personalities"), button:has-text("Personnalités")');
  73 | 
  74 |     // Set Philosophical Stoic as Default first!
  75 |     const stoicCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Philosophical Stoic' }) }).first();
  76 |     await stoicCard.locator('button:has-text("Set as Default")').click();
  77 | 
  78 |     // Now delete Socratic Coach cleanly
  79 |     page.once('dialog', async dialog => {
  80 |       await dialog.accept();
  81 |     });
  82 |     const newSocraticCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Socratic Coach' }) }).first();
  83 |     await newSocraticCard.locator('button[title*="Delete"]').click();
  84 |     await expect(page.locator('h3:has-text("Socratic Coach")')).not.toBeVisible();
  85 | 
  86 |     // Try deleting Philosophical Stoic, which is now default. It should fail since it's default!
  87 |     const updatedStoicCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Philosophical Stoic' }) }).first();
  88 |     await expect(updatedStoicCard.locator('button[title*="Delete"]')).toBeDisabled();
  89 |   });
  90 | 
  91 | });
  92 | 
```