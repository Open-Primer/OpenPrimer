import { test, expect } from '@playwright/test';

 

const BASE_URL = 'http://localhost:3000';

 

test.describe('OpenPrimer Curriculum Autonomy and Governance Suite', () => {

  

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.setItem('openprimer_lang', 'EN');
      localStorage.setItem('op_session', 'true');
      localStorage.setItem('op_user_profile', JSON.stringify({ email: 'admin@openprimer.org', role: 'admin' }));
    });
    await page.reload();
  });

 

  test('Identity Management CRUD: should create, block, and delete student accounts', async ({ page }) => {
    await page.evaluate(() => {
      const users = JSON.parse(localStorage.getItem('openprimer_users') || '[]');
      const filtered = users.filter((u: any) => u.name !== 'Test Student E2E');
      localStorage.setItem('openprimer_users', JSON.stringify(filtered));
    });

    // 1. Navigate to admin users cockpit

    await page.goto(`${BASE_URL}/admin/users`);

    await expect(page.locator('h1')).toContainText(/Identity Control|Contrôle d'Identité/);

 

    // 2. Click Add Student button

    const addBtn = page.locator('#add-student-btn');

    await expect(addBtn).toBeVisible();

    await addBtn.click();

 

    // 3. Fill in user details

    await page.fill('#student-name-input', 'Test Student E2E');

    await page.fill('#student-email-input', 'e2e.test.student@openprimer.org');

    

    // Choose administrator role to test role updating, then submit

    await page.selectOption('#student-role-select', 'admin');

    await page.click('#submit-student-btn');

 

    // 4. Assert new account appears in table

    const rowLocator = page.locator('tr:has-text("Test Student E2E")');

    await expect(rowLocator).toBeVisible();

    await expect(rowLocator.locator('text=/Admin/')).toBeVisible({ timeout: 15000 });

 

    // 5. Block the student account

    const blockToggle = rowLocator.locator('.block-user-toggle');

    await blockToggle.click();

    

    // Verify status updates to Blocked

    await expect(rowLocator.locator('text=/Blocked|Bloqué/')).toBeVisible({ timeout: 15000 });

 

    // 6. Unblock the student account

    await blockToggle.click();

    await expect(rowLocator.locator('text=/Active|Actif/')).toBeVisible({ timeout: 15000 });

 

    // 7. Delete student account with double-safeguard modal

    const deleteBtn = rowLocator.locator('.delete-user-btn');

    await deleteBtn.click();

 

    // Execute deletion from the confirmation modal

    await page.click('#confirm-execute-btn');

 

    // 8. Assert account has been purged

    await expect(page.locator('text=Test Student E2E')).not.toBeVisible();

  });

 

  test('Autonomy Engine: search failure trigger auto-promotes course to queue', async ({ page }) => {

    test.slow();

    // 1. Visit page and pre-seed search history failures in DB

    await page.evaluate(() => {

      // Clear past entries for Quantum Electro-Dynamics for stability

      const hist = JSON.parse(localStorage.getItem('openprimer_search_history') || '[]');

      const filtered = hist.filter((h: any) => !h.query.toLowerCase().includes('electro-dynamics'));

      localStorage.setItem('openprimer_search_history', JSON.stringify(filtered));

    });

 

    await page.goto(`${BASE_URL}/admin/curriculum`);

    await expect(page.locator('h1')).toContainText(/Curriculum Control Center|Centre de Contrôle/);

 

    // Ensure we are on Generation Engine tab

    await page.click('button:has-text("Generation Engine"), button:has-text("Génération")');

 

    // Seed 5 failed searches in background

    await page.evaluate(async () => {

      for (let i = 0; i < 5; i++) {

        await window.dbService.addSearchHistoryEntry({

          id: 'test_s_' + i + '_' + Date.now(),

          query: 'Quantum Electro-Dynamics',

          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),

          wasSuccessful: false,

          userLanguage: 'EN'

        });

      }

    });

 

    // Reload database state to render proposals

    await page.reload();

    await page.click('button:has-text("Generation Engine"), button:has-text("Génération")');

 

    // Ensure we see Quantum Electro-Dynamics in active proposals

    await expect(page.locator('h3:has-text("Quantum Electro-Dynamics")').first()).toBeVisible({ timeout: 15000 });

 

    // Toggle "Auto-Approve Generation" to True in UI

    const autoApproveToggle = page.locator('div.rounded-3xl', { has: page.locator('span:has-text("Auto-Approve Generation")') }).locator('button.rounded-full').first();

    await autoApproveToggle.click();
    await expect(page.locator('div.rounded-3xl', { has: page.locator('span:has-text("Auto-Approve Generation")') }).locator('span.text-xs:has-text("ON")')).toBeVisible({ timeout: 15000 });

 

    // Set numeric threshold input box to 3 searches

    const thresholdInput = page.locator('input[type="number"]').first();

    await thresholdInput.fill('3');

    await thresholdInput.dispatchEvent('change');

 

    // Click "Re-evaluate & Accept" or let the reactive effect trigger

    // Because toggle and threshold changed, the Autonomy Agent useEffect immediately auto-promotes the course!

    await page.click('button:has-text("Pipeline Queue"), button:has-text("File d\'Attente")');

    await expect(page.locator('text=Quantum Electro-Dynamics').first()).toBeVisible({ timeout: 15000 });

 

    // Cancel the task from the queue to verify queue deletion CRUD

    // Turn Auto-Approve Generation toggle OFF first to prevent the autonomy engine from immediately re-promoting it
    await page.click('button:has-text("Generation Engine"), button:has-text("Génération")');
    await autoApproveToggle.click();
    await expect(page.locator('div.rounded-3xl', { has: page.locator('span:has-text("Auto-Approve Generation")') }).locator('span.text-xs:has-text("OFF")')).toBeVisible({ timeout: 15000 });
    await page.click('button:has-text("Pipeline Queue"), button:has-text("File d\'Attente")');

    const taskRow = page.locator('tr:has-text("Quantum Electro-Dynamics")').first();
    await expect(taskRow).toBeVisible({ timeout: 10000 });
    // Execute cancel sequence
    await taskRow.locator('button:has-text("Cancel"), button:has-text("Annuler")').first().click();
    const confirmCancelBtn = page.locator('div.p-10 button.bg-red-600').first();
    await expect(confirmCancelBtn).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500);
    await confirmCancelBtn.click();
    await expect(confirmCancelBtn).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator('tr:has-text("Quantum Electro-Dynamics")')).not.toBeVisible({ timeout: 15000 });


  });

 

  test('Refused Backlog Safeguard: course suggestion rejected, moved to backlog and resuggested', async ({ page }) => {

    // 1. Visit curriculum page

    await page.goto(`${BASE_URL}/admin/curriculum`);

    await page.click('button:has-text("Generation Engine"), button:has-text("Génération")');

 

    // 2. Seed a failed search

    await page.evaluate(async () => {

      await window.dbService.addSearchHistoryEntry({

        id: 'refuse_test_' + Date.now(),

        query: 'Stellar Astrophysics',

        timestamp: new Date().toISOString(),

        wasSuccessful: false,

        userLanguage: 'EN'

      });

    });

 

    await page.reload();

    await page.click('button:has-text("Generation Engine"), button:has-text("Génération")');

 

    // 3. Locate the card container for Stellar Astrophysics to avoid strict-mode violations

    const courseCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3', { hasText: 'Stellar Astrophysics' }) }).first();

    await expect(courseCard).toBeVisible();

    

    // Click the Refuse button inside this specific card

    await courseCard.locator('button[title*="Refuse"], button[title*="Backlog"]').first().click();

 

    // 4. Assert it moves to the Refused Backlog section at the bottom of Tab 1

    const backlogHeader = page.locator('h3:has-text("Refused Backlog"), h3:has-text("Backlog des Refusés")');

    await expect(backlogHeader).toBeVisible();

    

    const backlogCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h4', { hasText: 'Stellar Astrophysics' }) }).first();

    await expect(backlogCard).toBeVisible();

  });

 

  test('AI Badge Icon Agent: enforces strict parameter validation, real-time translations, and badge creation', async ({ page }) => {

    test.slow();

    // 1. Go to curriculum cockpit and switch to Achievements tab

    await page.goto(`${BASE_URL}/admin/curriculum`);

    await page.click('button:has-text("Achievements Grid"), button:has-text("Grille de Badges")');

 

    // 2. Click Create Badge trigger button

    await page.click('button:has-text("Create New Achievement Badge"), button:has-text("Créer un Badge")');

 

    // 3. Attempt submission with empty values to verify strict check

    await page.click('button[type="submit"]');

    // Expect warning alert (using stable native getByText regex matching)

    await expect(page.getByText(/Strict Parameter Error|Erreur Paramètre Strict/)).toBeVisible({ timeout: 15000 });

 

    // 4. Fill name and description

    // Name containing keyword "streak" should trigger "Zap / Flame / Clock" suggestions!

    await page.fill('input[placeholder*="Fast Learner"]', 'Streaker Master');

    await page.fill('input[placeholder*="record time"]', 'Achieve a 10 day streak of learning'); // using description input

    

    // 5. Fill negative threshold value to test validation rejection

    await page.fill('input[placeholder*="3 days"]', '-10');

    await page.click('button[type="submit"]');

    await expect(page.getByText(/Strict Validation Reject|Rejet de Validation Stricte/)).toBeVisible({ timeout: 15000 });

 

    // 6. Fix threshold value

    await page.fill('input[placeholder*="3 days"]', '10');    // 7. Select the first available badge from the standard library catalog grid

    const libraryBadge = page.locator('button.library-badge-btn').first();

    await expect(libraryBadge).toBeVisible();

    await libraryBadge.click();



    // 8. Verify the input field contains the title

    await expect(page.locator('input[placeholder*="Fast Learner"]')).toHaveValue('Streaker Master');

 

    // 9. Submit creation and assert badge appears in grid

    await page.locator('form button[type="submit"]:has-text("Create Achievement Badge"), form button[type="submit"]:has-text("Créer un Badge")').click();

    await expect(page.locator('h3').filter({ hasText: /Streaker Master|Ma.tre des S.ries/ })).toBeVisible({ timeout: 15000 });

 

    // 10. Edit badge details

    const streakerMasterCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3').filter({ hasText: /Streaker Master|Ma.tre des S.ries/ }) }).first();

    await streakerMasterCard.locator('button[title*="Edit"]').first().click();

    await page.locator('div.space-y-2', { hasText: 'Achievement Name' }).locator('input').fill('Streaker Expert');

    await page.click('button:has-text("Update Achievement Badge"), button:has-text("Enregistrer")');

    await expect(page.locator('h3').filter({ hasText: /Streaker Expert|Expert des S.ries/ })).toBeVisible({ timeout: 15000 });

 

    // 11. Force Purge badge to clean database

    const streakerExpertCard = page.locator('div.bg-slate-900\\/40', { has: page.locator('h3').filter({ hasText: /Streaker Expert|Expert des S.ries/ }) }).first();

    await streakerExpertCard.locator('button[title*="Purg"]').first().click();

    // Simple confirm � - no name typing required after refactor

     const confirmPurgeBtn = page.locator('div.p-10 button.bg-red-600').first();
     await expect(confirmPurgeBtn).toBeVisible({ timeout: 5000 });
     await confirmPurgeBtn.click();

    await expect(page.locator('h3').filter({ hasText: /Streaker Expert|Expert des S.ries/ })).not.toBeVisible({ timeout: 15000 });

  });

 

  test('Dashboard Mathematics: overview metrics matches database totals', async ({ page }) => {

    // 1. Navigate to Project Overview

    await page.goto(`${BASE_URL}/admin`);

    await expect(page.locator('h1')).toContainText(/Project Overview|Aperçu du Projet/);

 

    // Fetch total counts using window.dbService evaluation

    const stats = await page.evaluate(async () => {

      const { data: usersList } = await window.dbService.getUsers();

      const { data: coursesList } = await window.dbService.getAllCourses();

      return {

        studentsCount: usersList.length,

        coursesCount: coursesList.length

      };

    });

 

    // 2. Validate dashboard texts reflect actual numbers

    const totalStudentsText = page.locator('div:has-text("Total Students"), div:has-text("Total Étudiants")').locator('p.text-3xl').first();

    await expect(totalStudentsText).toContainText(stats.studentsCount.toString());

  });

 

});

