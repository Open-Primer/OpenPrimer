import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('OpenPrimer TTS Enhancements', () => {
  
  test.beforeEach(async ({ page, context }) => {
    page.on('pageerror', (err) => {
      console.log('🔴 BROWSER PAGE ERROR:', err.message, err.stack);
    });

    await context.addCookies([{
      name: 'openprimer_lang',
      value: 'EN',
      url: BASE_URL
    }]);

    await page.addInitScript(() => {
      window.localStorage.setItem('openprimer_lang', 'EN');
      window.localStorage.setItem('op_allow_sandbox', 'true');
      
      // Seed a default user profile so the settings sync can proceed without errors
      window.localStorage.setItem('op_session', 'true');
      window.localStorage.setItem('op_user_profile', JSON.stringify({
        id: 'u1',
        name: 'Vanguard Mysterious',
        email: 'vanguard.mysterious@gmail.com',
        role: 'admin',
        level: 1,
        kp: 0,
        isEmailVerified: true
      }));
    });
  });

  test('should verify left speaker icon/wave is removed and checkboxes are present in settings', async ({ page }) => {
    // Navigate directly to the lesson page
    await page.goto(`${BASE_URL}/L1/History/revolution/introduction`);
    await page.waitForLoadState('networkidle');

    // 1. Verify TTS container is visible
    const ttsContainer = page.locator('div.fixed.bottom-6.left-6');
    await expect(ttsContainer).toBeVisible();

    // 2. Verify that the left w-8 speaker icon/visualizer container is NOT present in the player pill
    const leftSpeakerContainer = ttsContainer.locator('div.w-8');
    await expect(leftSpeakerContainer).not.toBeVisible();

    // 3. Open Speech Settings dropdown by clicking the cog icon
    const settingsButton = page.locator('button[aria-label="Speech settings"]');
    await expect(settingsButton).toBeVisible();
    await settingsButton.click();

    // 4. Verify checkboxes exist and are checked by default
    const readCourseCheckbox = page.locator('input[type="checkbox"]').first();
    const readTutorCheckbox = page.locator('input[type="checkbox"]').nth(1);

    await expect(readCourseCheckbox).toBeVisible();
    await expect(readTutorCheckbox).toBeVisible();

    await expect(readCourseCheckbox).toBeChecked();
    await expect(readTutorCheckbox).toBeChecked();

    // 5. Uncheck the "Read tutor answers" option
    await readTutorCheckbox.click();
    await expect(readTutorCheckbox).not.toBeChecked();

    // 6. Verify that it was successfully saved to localStorage
    const savedProfileStr = await page.evaluate(() => window.localStorage.getItem('op_user_profile'));
    expect(savedProfileStr).not.toBeNull();
    const savedProfile = JSON.parse(savedProfileStr!);
    expect(savedProfile.audioReadTutor).toBe(false);
    expect(savedProfile.audioReadCourse).toBe(true);
  });
});
