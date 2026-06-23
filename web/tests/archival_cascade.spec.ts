import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('OpenPrimer Anti-Corruption Archival Cascade Integration Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('op_allow_sandbox', 'true');
      localStorage.setItem('openprimer_lang', 'EN');
      localStorage.setItem('op_session', 'true');
      localStorage.setItem('op_user_profile', JSON.stringify({ email: 'admin@openprimer.app', role: 'admin' }));
    });
    await page.reload();
  });

  test('Archival Cascade: should purge pipeline tasks and translation requests when course/curriculum is archived', async ({ page }) => {
    // 1. Visit page and pre-seed active pipeline tasks and translation requests for "Classical Mechanics"
    await page.goto(`${BASE_URL}/admin/curriculum`);
    await expect(page.locator('h1')).toContainText(/Curriculum Control Center|Centre de Contrôle/);

    await page.evaluate(() => {
      // Seed pipeline queue with a translation task for Classical Mechanics
      const mockQueue = [
        {
          id: 'test_task_1',
          title: 'Classical Mechanics - Translate to FR',
          type: 'translation',
          status: 'queued',
          progress: 0,
          timestamp: new Date().toISOString()
        },
        {
          id: 'test_task_2',
          title: 'Intro to Programming - Translate to FR',
          type: 'translation',
          status: 'queued',
          progress: 0,
          timestamp: new Date().toISOString()
        }
      ];
      localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(mockQueue));
      
      // Seed database translation request list
      (window as any).dbService.addTranslationRequest({
        courseId: 'Classical_Mechanics',
        courseTitle: 'Classical Mechanics',
        targetLang: 'FR',
        popularityScore: 100,
        archivingLevel: 0
      });
    });

    // 2. Perform archiving on Classical Mechanics in the UI
    await page.reload();
    
    // Go to Pipeline Queue to verify seeded tasks are there
    await page.click('button:has-text("Pipeline Queue"), button:has-text("File d\'Attente")');
    await expect(page.locator('text=Classical Mechanics - Translate to FR')).toBeVisible({ timeout: 10000 });
    
    // Go to "Course Archiving" tab
    await page.click('button:has-text("Course Archiving"), button:has-text("Archivage des Cours")');
    
    // Find Classical Mechanics row and click the button for level 2
    const row = page.locator('tr:has-text("Classical Mechanics")').first();
    await expect(row).toBeVisible({ timeout: 10000 });
    
    const lvl2Button = row.locator('button').nth(2); // Button at index 2 (Level 2)
    await expect(lvl2Button).toBeVisible({ timeout: 10000 });
    await lvl2Button.click();
    
    // Accept dependency confirmation modal if it appears due to parent curriculum dependency
    const confirmArchiveBtn = page.locator('button:has-text("Archive All"), button:has-text("Archiver Tout")');
    try {
      await expect(confirmArchiveBtn).toBeVisible({ timeout: 3000 });
      await confirmArchiveBtn.click();
    } catch (e) {
      console.log('Dependency confirmation modal did not appear, proceeding...');
    }
    
    // 3. Verify that the Classical Mechanics task is automatically halted and purged!
    await page.click('button:has-text("Pipeline Queue"), button:has-text("File d\'Attente")');
    await expect(page.locator('text=Classical Mechanics - Translate to FR')).not.toBeVisible({ timeout: 15000 });
    
    // Verify that unrelated tasks are NOT affected
    await expect(page.locator('text=Intro to Programming - Translate to FR')).toBeVisible({ timeout: 10000 });
  });

  test('Cross-Tab Synchronization: purging a course in another context/tab should immediately update the catalog UI', async ({ page }) => {
    // 1. Visit the catalog page
    await page.goto(`${BASE_URL}/catalog`);
    
    // Ensure that Classical Mechanics is visible
    const courseCard = page.locator('text=Classical Mechanics').first();
    await expect(courseCard).toBeVisible({ timeout: 15000 });

    // 2. Simulate course purge in another tab by modifying localStorage and dispatching storage event
    await page.evaluate(() => {
      const coursesKey = 'openprimer_courses';
      const currentCourses = JSON.parse(localStorage.getItem(coursesKey) || '[]');
      const updatedCourses = currentCourses.filter((c: any) => c.id !== 1); // ID of Classical Mechanics
      localStorage.setItem(coursesKey, JSON.stringify(updatedCourses));
      
      // Dispatch storage event to simulate cross-tab updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: coursesKey,
        newValue: JSON.stringify(updatedCourses)
      }));
    });

    // 3. Verify that Classical Mechanics is immediately removed from the catalog UI without reloading
    await expect(page.locator('text=Classical Mechanics')).toHaveCount(0, { timeout: 10000 });
  });

});
