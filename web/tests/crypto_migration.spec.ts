import { test, expect } from '@playwright/test';
import { encryptApiKey, decryptApiKey } from '../src/lib/crypto';

const BASE_URL = 'http://localhost:3000';

test.describe('Client-Side Key Encryption & Migration Tests', () => {

  test.beforeEach(async ({ context }) => {
    // Seed cookie to enforce English UI language for element targeting
    await context.addCookies([{
      name: 'openprimer_lang',
      value: 'EN',
      url: BASE_URL
    }]);
  });

  // 1. Unit testing of crypto utility directly
  test('crypto utility should encrypt and decrypt values correctly', () => {
    const rawKey = 'mock-api-key-for-encryption-testing';
    
    // Encrypting should prefix with "__encrypted__:" and not match the raw key
    const encrypted = encryptApiKey(rawKey);
    expect(encrypted.startsWith('__encrypted__:')).toBe(true);
    expect(encrypted).not.toBe(rawKey);

    // Decrypting should return the exact raw key
    const decrypted = decryptApiKey(encrypted);
    expect(decrypted).toBe(rawKey);

    // Re-encrypting an already encrypted key should return it as-is without double-encrypting
    const reEncrypted = encryptApiKey(encrypted);
    expect(reEncrypted).toBe(encrypted);
  });

  test('crypto utility should transparently return legacy plain-text keys on decryption', () => {
    const legacyKey = 'legacy-plain-text-key-for-testing';
    const decrypted = decryptApiKey(legacyKey);
    // Should be returned unmodified
    expect(decrypted).toBe(legacyKey);
  });

  // 2. End-to-end integration with SettingsModal
  test('should migrate legacy plain-text key to encrypted on save', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Seed localStorage with a legacy plain-text API key inside op_user_profile
    await page.evaluate(() => {
      localStorage.setItem('op_allow_sandbox', 'true');
      localStorage.setItem('openprimer_lang', 'EN');
      localStorage.setItem('op_session', 'true');
      localStorage.setItem('op_user_profile', JSON.stringify({
        id: 'user_test_crypto',
        email: 'silvere@openprimer.app',
        firstName: 'Silvere',
        lastName: 'OpenPrimer',
        tutorType: 'personal', // This displays the custom/personal key configuration inputs
        personalTutorProvider: 'openai',
        personalTutorApiKey: 'legacy-plain-text-key-example-123', // Legacy PLAIN-TEXT key
        personalTutorModel: 'gpt-4o-mini'
      }));
    });

    // Navigate to homepage with settings=true query parameter to trigger SettingsModal
    await page.goto(`${BASE_URL}/?settings=true`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Verify SettingsModal is open
    await expect(page.locator('h2').filter({ hasText: /Configuration|Profile/i }).first()).toBeVisible();

    // Click on the "AI Tutor" or "AI Tutor Engine" tab to reveal the API key section
    const tutorTab = page.locator('button').filter({ hasText: /AI Tutor/i }).first();
    await expect(tutorTab).toBeVisible();
    await tutorTab.click();
    await page.waitForTimeout(500);

    // Verify the personal key field exists and contains the decrypted (plain-text) legacy key
    const apiKeyInput = page.locator('input[placeholder="Enter your personal API Key"]');
    await expect(apiKeyInput).toBeVisible();
    
    const inputValue = await apiKeyInput.inputValue();
    expect(inputValue).toBe('legacy-plain-text-key-example-123');

    // Enter a new API key to verify that it gets stored as encrypted via the automatic autosave hook
    await apiKeyInput.fill('newly-entered-key-example-abc');

    // Give it a moment to let the autosave useEffect run and update localStorage
    await page.waitForTimeout(1500);

    // Verify localStorage op_user_profile holds the encrypted key
    const storedProfileStr = await page.evaluate(() => localStorage.getItem('op_user_profile'));
    expect(storedProfileStr).not.toBeNull();
    
    const storedProfile = JSON.parse(storedProfileStr!);
    expect(storedProfile.personalTutorApiKey.startsWith('__encrypted__:')).toBe(true);
    expect(storedProfile.personalTutorApiKey).not.toContain('newly-entered-key-example-abc');

    // Verify decryption of the newly saved key returns the raw value
    const decryptedKey = decryptApiKey(storedProfile.personalTutorApiKey);
    expect(decryptedKey).toBe('newly-entered-key-example-abc');
  });
});
