import { test, expect } from '@playwright/test';
import crypto from 'crypto';
import http from 'http';
import { supabaseAdmin } from '../src/lib/supabase';

const BASE_URL = 'http://localhost:3000';

test.describe('LTI 1.3 Integration Suite', () => {
  let mockServer: http.Server;
  let mockKeysetUrl = '';
  let privateKeyPem = '';
  let publicKeyJwk: any = null;
  const testIssuer = 'https://mock-lms.com';
  const testClientId = 'client_12345';
  const testPlatformId = crypto.randomUUID();

  test.beforeAll(async () => {
    // 1. Generate RSA Key Pair for JWT signatures
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    privateKeyPem = privateKey;
    publicKeyJwk = crypto.createPublicKey(publicKey).export({ format: 'jwk' });
    publicKeyJwk.kid = 'mock-key-1';
    publicKeyJwk.alg = 'RS256';
    publicKeyJwk.use = 'sig';

    // 2. Start dynamic local HTTP server for LMS JWKS keyset
    mockServer = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ keys: [publicKeyJwk] }));
    });

    await new Promise<void>((resolve) => {
      mockServer.listen(0, () => {
        const port = (mockServer.address() as any).port;
        mockKeysetUrl = `http://localhost:${port}/keys`;
        resolve();
      });
    });

    // 3. Register platform trust relationship in Supabase database
    await supabaseAdmin.from('lti_platforms').delete().eq('issuer', testIssuer);
    const { error: insertErr } = await supabaseAdmin.from('lti_platforms').insert({
      id: testPlatformId,
      issuer: testIssuer,
      client_id: testClientId,
      auth_login_url: 'https://mock-lms.com/oauth2/auth',
      auth_token_url: 'https://mock-lms.com/oauth2/token',
      key_set_url: mockKeysetUrl
    });

    if (insertErr) {
      console.error('Failed to pre-seed test platform in DB:', insertErr);
    }
  });

  test.afterAll(async () => {
    // Clean up
    await supabaseAdmin.from('lti_platforms').delete().eq('id', testPlatformId);
    await new Promise<void>((resolve) => mockServer.close(() => resolve()));
  });

  test('Keyset Exposer API: should return our public JWKS key set', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/lti/keys`);
    expect(response.status()).toBe(200);
    const jwks = await response.json();
    expect(jwks).toHaveProperty('keys');
    expect(Array.isArray(jwks.keys)).toBe(true);
    expect(jwks.keys.length).toBeGreaterThan(0);
    const key = jwks.keys[0];
    expect(key.kty).toBe('RSA');
    expect(key.alg).toBe('RS256');
    expect(key.kid).toBe('openprimer-lti-key-1');
  });

  test('OIDC Login: parameter verification and redirection', async ({ request }) => {
    // Missing parameter check
    const badRes = await request.get(`${BASE_URL}/api/lti/login`);
    expect(badRes.status()).toBe(400);

    // Valid platforms request
    const params = new URLSearchParams({
      iss: testIssuer,
      login_hint: 'user_998',
      target_link_uri: `${BASE_URL}/L1/Physics/Classical_Mechanics/newtons_laws_of_motion`,
      client_id: testClientId,
      lti_message_hint: 'msg_hint_abc'
    });

    const response = await request.get(`${BASE_URL}/api/lti/login?${params.toString()}`, {
      maxRedirects: 0 // Do not follow redirect
    });

    // Check redirect
    expect([302, 307]).toContain(response.status());
    const location = response.headers().location;
    expect(location).toContain('https://mock-lms.com/oauth2/auth');
    
    const redirectUrl = new URL(location);
    expect(redirectUrl.searchParams.get('client_id')).toBe(testClientId);
    expect(redirectUrl.searchParams.get('login_hint')).toBe('user_998');
    expect(redirectUrl.searchParams.get('lti_message_hint')).toBe('msg_hint_abc');
    expect(redirectUrl.searchParams.get('scope')).toBe('openid');
    expect(redirectUrl.searchParams.get('response_type')).toBe('id_token');
  });

  test('LTI Launch: RS256 signature verification and launcher injection page', async ({ request }) => {
    // Generate valid LTI 1.3 Launch Payload
    const header = {
      alg: 'RS256',
      kty: 'RSA',
      kid: 'mock-key-1'
    };

    const targetLinkUri = `${BASE_URL}/L1/Physics/Classical_Mechanics/newtons_laws_of_motion`;
    const payload = {
      iss: testIssuer,
      aud: testClientId,
      sub: 'student_lti_999',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000) - 60,
      nonce: 'nonce-12345',
      name: 'LTI Playwright Test Student',
      email: 'playwright.student@lti.openprimer.org',
      'https://purl.imsglobal.org/spec/lti/claim/roles': [
        'http://purl.imsglobal.org/vocab/lis/v2/membership#Learner'
      ],
      'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': targetLinkUri,
      'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
        id: 'resource-link-1',
        title: 'Newtons Laws'
      }
    };

    // Encode JWT components
    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const dataToSign = `${headerB64}.${payloadB64}`;

    // Sign using RS256 private key
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(dataToSign);
    signer.end();
    const signatureB64 = signer.sign(privateKeyPem).toString('base64url');

    const idToken = `${dataToSign}.${signatureB64}`;

    // Call Target Link Launch API
    const response = await request.post(`${BASE_URL}/api/lti/launch`, {
      form: {
        id_token: idToken,
        state: 'state-12345'
      }
    });

    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('OPENPRIMER LTI');
    expect(html).toContain('localStorage.setItem(\'op_session\', \'true\')');
    expect(html).toContain('playwright.student@lti.openprimer.org');
    expect(html).toContain('/L1/Physics/Classical_Mechanics/newtons_laws_of_motion');

    // Verify user profile is registered and linked in Supabase
    const { data: linkedLtiUser } = await supabaseAdmin
      .from('lti_users')
      .select('*')
      .eq('platform_id', testPlatformId)
      .eq('lti_sub', 'student_lti_999')
      .maybeSingle();

    expect(linkedLtiUser).not.toBeNull();
    expect(linkedLtiUser?.lti_sub).toBe('student_lti_999');

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', linkedLtiUser?.user_id)
      .maybeSingle();

    expect(profile).not.toBeNull();
    expect(profile?.email).toBe('playwright.student@lti.openprimer.org');
    expect(profile?.role).toBe('student');

    // Verify student is automatically enrolled in Classical Mechanics course
    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('slug', 'Classical_Mechanics')
      .maybeSingle();

    if (course) {
      const { data: progress } = await supabaseAdmin
        .from('progress')
        .select('*')
        .eq('user_id', profile?.id)
        .eq('course_id', course.id)
        .maybeSingle();
      
      expect(progress).not.toBeNull();
      
      // Clean up test progress and profile
      await supabaseAdmin.from('progress').delete().eq('user_id', profile?.id);
      await supabaseAdmin.from('lti_users').delete().eq('user_id', profile?.id);
      await supabaseAdmin.from('profiles').delete().eq('id', profile?.id);
    }
  });

  test.describe('UI Verification Group', () => {
    test.beforeEach(async ({ page, context }) => {
      await context.addCookies([{
        name: 'openprimer_lang',
        value: 'EN',
        url: BASE_URL
      }]);
      await page.addInitScript(() => {
        window.localStorage.setItem('openprimer_lang', 'EN');
        window.localStorage.setItem('op_allow_sandbox', 'true');
        window.localStorage.setItem('op_session', 'true');
      });
    });

    test('UI Verification: should render export button and display the premium modal with descriptions', async ({ page }) => {
      // Navigate directly to the seeded introductory microeconomics course page
      await page.goto(`${BASE_URL}/L1/Economics/introductory_microeconomics/introduction`);
      
      // Check if Export button exists and click it
      const exportBtn = page.locator('#export-menu-button');
      await expect(exportBtn).toBeVisible({ timeout: 15000 });
      await exportBtn.click();
      
      // Verify the premium modal is displayed with our updated text strings
      const modalTitle = page.locator('h3:has-text("Systèmes d\'Exportation de Cours"), h3:has-text("Course Export Systems")');
      await expect(modalTitle).toBeVisible();
      
      // Check for the LTI description text
      await expect(page.locator('text=Thin Common Cartridge').first()).toBeVisible();
      
      // Check for the Static Offline description text
      await expect(page.locator('text=Exports Statiques / Offline').first().or(page.locator('text=Static / Offline Exports').first())).toBeVisible();

      // Check for the Raw Structured Data description text
      await expect(page.locator('text=JSON + MDX').first()).toBeVisible();

      // Click close button
      const closeBtn = page.locator('button:has-text("Fermer"), button:has-text("Close")').first();
      await closeBtn.click();
      await expect(modalTitle).not.toBeVisible();
    });
  });
});

