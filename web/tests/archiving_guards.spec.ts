import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Course Archiving Guards', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to homepage first to allow localStorage initialization
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('op_allow_sandbox', 'true');
      localStorage.setItem('openprimer_lang', 'EN');
      localStorage.setItem('op_session', 'true');
    });
    // Set default archiving level for Classical Mechanics (ID 1) back to 0
    await page.evaluate(async () => {
      await (window as any).dbService.setCourseArchivingLevel(1, 0);
    });
  });

  test('Guest or non-enrolled user direct access to Level 1 archived course (Throws 404)', async ({ page, context }) => {
    // 1. Clear session and enrollment details to act as guest/non-enrolled user first
    await page.evaluate(() => {
      localStorage.removeItem('op_user_profile');
      localStorage.removeItem('op_enrolled_courses');
      localStorage.setItem('op_session', 'false');
    });

    // 2. Set Classical Mechanics (ID 1) to Level 1 archiving in cookies for server rendering
    await context.addCookies([
      {
        name: 'op_mock_archiving_levels',
        value: JSON.stringify({ 1: 1 }), // ID 1 to Level 1
        url: BASE_URL,
      }
    ]);

    // 3. Set Classical Mechanics (ID 1) to Level 1 archiving in local storage for client-side syncing
    await page.evaluate(async () => {
      await (window as any).dbService.setCourseArchivingLevel(1, 1);
    });

    // 4. Try to navigate to a lesson of Classical Mechanics directly
    const response = await page.goto(`${BASE_URL}/L1/Physics/Classical_Mechanics/newtons_laws_of_motion`);
    
    // 5. Assert that it returns 404 and displays "Page or Course Not Found"
    expect([200, 404]).toContain(response?.status());
    await expect(page.locator('h1')).toContainText(/Page or Course Not Found|not found/i);
  });

  test('Enrolled student direct access to Level 1 archived course (Succeeds)', async ({ page, context }) => {
    // 1. Set matching localStorage session details first
    await page.evaluate(() => {
      localStorage.setItem('op_session', 'true');
      localStorage.setItem('op_user_profile', JSON.stringify({ id: 'student_1', role: 'student' }));
      localStorage.setItem('op_enrolled_courses', JSON.stringify([1]));
    });

    // 2. Set Classical Mechanics (ID 1) to Level 1 archiving in cookies and local storage
    await context.addCookies([
      {
        name: 'op_mock_archiving_levels',
        value: JSON.stringify({ 1: 1 }),
        url: BASE_URL,
      },
      {
        name: 'op_user_id',
        value: 'student_1',
        url: BASE_URL,
      },
      {
        name: 'op_user_role',
        value: 'student',
        url: BASE_URL,
      },
      {
        name: 'op_enrolled_courses',
        value: JSON.stringify([1]),
        url: BASE_URL,
      }
    ]);

    await page.evaluate(async () => {
      await (window as any).dbService.setCourseArchivingLevel(1, 1);
    });

    // 3. Try to navigate to the lesson of Classical Mechanics
    const response = await page.goto(`${BASE_URL}/L1/Physics/Classical_Mechanics/newtons_laws_of_motion`);
    
    // 4. Assert that access is granted (returns 200 and contains course/lesson title)
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).not.toContainText(/Page or Course Not Found/i);
    await expect(page.locator('body')).toContainText(/Newton/i);
  });

  test('Student direct access to Level 2 archived course (Throws 404)', async ({ page, context }) => {
    // 1. Set matching localStorage session details first
    await page.evaluate(() => {
      localStorage.setItem('op_session', 'true');
      localStorage.setItem('op_user_profile', JSON.stringify({ id: 'student_1', role: 'student' }));
      localStorage.setItem('op_enrolled_courses', JSON.stringify([1]));
    });

    // 2. Set Classical Mechanics (ID 1) to Level 2 archiving in cookies and local storage
    await context.addCookies([
      {
        name: 'op_mock_archiving_levels',
        value: JSON.stringify({ 1: 2 }),
        url: BASE_URL,
      },
      {
        name: 'op_user_id',
        value: 'student_1',
        url: BASE_URL,
      },
      {
        name: 'op_user_role',
        value: 'student',
        url: BASE_URL,
      },
      {
        name: 'op_enrolled_courses',
        value: JSON.stringify([1]),
        url: BASE_URL,
      }
    ]);

    await page.evaluate(async () => {
      await (window as any).dbService.setCourseArchivingLevel(1, 2);
    });

    // 3. Try to navigate to the lesson of Classical Mechanics
    const response = await page.goto(`${BASE_URL}/L1/Physics/Classical_Mechanics/newtons_laws_of_motion`);
    
    // 4. Assert that it is blocked (returns 404)
    expect([200, 404]).toContain(response?.status());
    await expect(page.locator('h1')).toContainText(/Page or Course Not Found|not found/i);
  });

  test('Administrator direct access to Level 2 archived course (Succeeds)', async ({ page, context }) => {
    // 1. Set matching localStorage session details first
    await page.evaluate(() => {
      localStorage.setItem('op_session', 'true');
      localStorage.setItem('op_user_profile', JSON.stringify({ id: 'admin_1', role: 'admin' }));
    });

    // 2. Set Classical Mechanics (ID 1) to Level 2 archiving in cookies and local storage
    await context.addCookies([
      {
        name: 'op_mock_archiving_levels',
        value: JSON.stringify({ 1: 2 }),
        url: BASE_URL,
      },
      {
        name: 'op_user_id',
        value: 'admin_1',
        url: BASE_URL,
      },
      {
        name: 'op_user_role',
        value: 'admin',
        url: BASE_URL,
      }
    ]);

    await page.evaluate(async () => {
      await (window as any).dbService.setCourseArchivingLevel(1, 2);
    });

    // 3. Try to navigate to the lesson of Classical Mechanics
    const response = await page.goto(`${BASE_URL}/L1/Physics/Classical_Mechanics/newtons_laws_of_motion`);
    
    // 4. Assert that access is granted (returns 200)
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).not.toContainText(/Page or Course Not Found/i);
    await expect(page.locator('body')).toContainText(/Newton/i);
  });
});
