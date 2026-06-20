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
    await page.goto(`${BASE_URL}/secondary_2/Histoire/Revolution_francaise/directoire-consulat-nouvel-ordre`);

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

  test('should verify alternative graphic descriptions and premium floating glassmorphic tooltips', async ({ page }) => {
    // Navigate directly to the lesson page
    await page.goto(`${BASE_URL}/secondary_2/Histoire/Revolution_francaise/directoire-consulat-nouvel-ordre`);

    // 1. Inject custom HTML inside the existing article to test hover states
    await page.evaluate(() => {
      const article = document.querySelector('article');
      if (article) {
        article.innerHTML = `
          <h1 id="test-title">Visual Element Testing Page</h1>
          <p id="test-p">This is an active sentence paragraph to test.</p>
          
          <!-- Standard Image with alt text -->
          <img id="test-img" src="/img.png" alt="A magnificent historic schematic of revolution" style="width: 100px; height: 100px; display: block; margin-bottom: 20px;" />
          
          <!-- Clickable nested image (exclusion) -->
          <a href="#" id="test-link">
            <img id="test-nested-img" src="/nested-img.png" alt="Clickable link image alt should be suppressed" style="width: 50px; height: 50px; display: block; margin-bottom: 20px;" />
          </a>
          
          <!-- Video Container with title -->
          <div id="test-video" class="video-container" title="Footage of history lecture" style="width: 100px; height: 100px; display: block; margin-bottom: 20px;">Video Content</div>
          
          <!-- Simulation iframe with title -->
          <iframe id="test-iframe" src="about:blank" title="Simulation of trajectory mapping" style="width: 100px; height: 100px; display: block; margin-bottom: 20px;"></iframe>
        `;
      }
    });

    // 2. Hover over the standard image and verify the premium glassmorphic tooltip
    const testImg = page.locator('#test-img');
    await testImg.hover();
    
    // Allow animation/mouseover cycle
    await page.waitForTimeout(100);

    const tooltip = page.locator('div.fixed.pointer-events-none[class*="z-[9999]"]');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('A magnificent historic schematic of revolution');
    await expect(tooltip).toContainText('Illustration');

    // 3. Hover over the nested image (nested inside <a>, so it must be excluded)
    const testNestedImg = page.locator('#test-nested-img');
    await testNestedImg.hover();
    await page.waitForTimeout(100);

    // Verify tooltip is not displayed (or is hidden)
    await expect(tooltip).not.toBeVisible();

    // 4. Hover over the video container
    const testVideo = page.locator('#test-video');
    await testVideo.hover();
    await page.waitForTimeout(100);

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Footage of history lecture');
    await expect(tooltip).toContainText('Video');

    // 5. Hover over the iframe simulation
    const testIframe = page.locator('#test-iframe');
    await testIframe.hover();
    await page.waitForTimeout(100);

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Simulation of trajectory mapping');
    await expect(tooltip).toContainText('Simulation');

    // 6. Move mouse out to non-graphic text and verify tooltip disappears
    const testTitle = page.locator('#test-title');
    await testTitle.hover();
    await page.waitForTimeout(100);
    await expect(tooltip).not.toBeVisible();
  });
});

