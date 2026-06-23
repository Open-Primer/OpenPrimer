import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('OpenPrimer Secure Password Update Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.setItem('op_allow_sandbox', 'true');
      localStorage.setItem('openprimer_lang', 'EN');
      localStorage.setItem('op_session', 'true');
      localStorage.setItem('op_user_profile', JSON.stringify({
        id: 'user_test_123',
        email: 'silvere@openprimer.app',
        firstName: 'Silvere',
        lastName: 'OpenPrimer'
      }));
    });
    
    // Seed the mock user database
    await page.evaluate(() => {
      const defaultHash = window.dbService.hashPassword('OriginalPassword123!');
      const users = [
        {
          id: 'user_test_123',
          name: 'Silvere OpenPrimer',
          email: 'silvere@openprimer.app',
          password: defaultHash,
          role: 'student',
          level: 1,
          kp: 0,
          isEmailVerified: true,
          isBlocked: false,
          joinedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('openprimer_users', JSON.stringify(users));
    });

    await page.goto(`${BASE_URL}/profile/settings`);
  });

  test('should show validation error for incorrect current password', async ({ page }) => {
    await page.fill('#current-password-input', 'WrongPassword123!');
    await page.fill('#new-password-input', 'NewPassword123!');
    await page.fill('#confirm-password-input', 'NewPassword123!');

    await page.click('#update-password-btn');

    // Assert error message for current password mismatch is visible
    await expect(page.locator('text=Current password verification failed.')).toBeVisible();
  });

  test('should show validation error for weak new password complexity', async ({ page }) => {
    await page.fill('#current-password-input', 'OriginalPassword123!');
    await page.fill('#new-password-input', 'weakpwd');
    await page.fill('#confirm-password-input', 'weakpwd');

    await page.click('#update-password-btn');

    // Assert complexity error is visible
    await expect(page.locator('text=Password must be at least 12 characters long')).toBeVisible();
  });

  test('should show validation error when new passwords do not match', async ({ page }) => {
    await page.fill('#current-password-input', 'OriginalPassword123!');
    await page.fill('#new-password-input', 'NewPassword123!');
    await page.fill('#confirm-password-input', 'MismatchPassword123!');

    await page.click('#update-password-btn');

    // Assert mismatch error is visible
    await expect(page.locator('text=New passwords do not match.')).toBeVisible();
  });

  test('should update password successfully and sync with local storage', async ({ page }) => {
    await page.fill('#current-password-input', 'OriginalPassword123!');
    await page.fill('#new-password-input', 'NewPassword123!');
    await page.fill('#confirm-password-input', 'NewPassword123!');

    await page.click('#update-password-btn');

    // Assert success message is visible
    await expect(page.locator('text=Password updated successfully!')).toBeVisible();

    // Verify localStorage has the new password hash
    const isUpdated = await page.evaluate(() => {
      const users = JSON.parse(localStorage.getItem('openprimer_users') || '[]');
      const user = users.find((u: any) => u.email === 'silvere@openprimer.app');
      const expectedHash = window.dbService.hashPassword('NewPassword123!');
      return user && user.password === expectedHash;
    });

    expect(isUpdated).toBe(true);
  });
});
