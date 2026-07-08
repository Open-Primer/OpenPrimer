import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { cleanPathSegment } from '@/lib/translations';

export async function POST(request: Request) {
  try {
    let idToken = '';
    let state = '';

    // LTI Launches are POST requests from LMS, usually application/x-www-form-urlencoded
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      idToken = (formData.get('id_token') as string) || '';
      state = (formData.get('state') as string) || '';
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      idToken = body.id_token || '';
      state = body.state || '';
    }

    if (!idToken) {
      return new Response('Missing id_token parameter', { status: 400 });
    }

    // 1. Decode JWT header and payload without verification first
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      return new Response('Invalid JWT format in id_token', { status: 400 });
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    let header: any;
    let payload: any;

    try {
      header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
      payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    } catch (err) {
      return new Response('Failed to parse JWT header or payload JSON', { status: 400 });
    }

    const kid = header.kid;
    const iss = payload.iss;
    const aud = Array.isArray(payload.aud) ? payload.aud[0] : payload.aud;

    if (!iss || !aud) {
      return new Response('Missing iss or aud claims in id_token', { status: 400 });
    }

    // 2. Lookup platform config to get key_set_url
    const { data: platform, error: platformErr } = await supabaseAdmin
      .from('lti_platforms')
      .select('*')
      .eq('issuer', iss)
      .eq('client_id', aud)
      .maybeSingle();

    if (platformErr || !platform) {
      console.error('[LTI-LAUNCH] Platform trust mapping not found for:', { iss, aud }, platformErr);
      return new Response(`LTI Trust relation not registered for issuer: ${iss} and client: ${aud}`, { status: 403 });
    }

    // 3. Fetch LMS public JWKS key set
    let jwks: any;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const jwksRes = await fetch(platform.key_set_url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!jwksRes.ok) {
        throw new Error(`Keyset URL returned status ${jwksRes.status}`);
      }
      jwks = await jwksRes.json();
    } catch (err: any) {
      console.error('[LTI-LAUNCH] Failed to fetch JWKS from LMS keyset URL:', platform.key_set_url, err);
      return new Response('Failed to retrieve LMS signature keyset for verification', { status: 502 });
    }

    // 4. Find the correct JWK matching the 'kid' header claim
    const jwk = jwks?.keys?.find((k: any) => k.kid === kid);
    if (!jwk) {
      console.error('[LTI-LAUNCH] JWK not found for kid:', kid);
      return new Response(`Public key verification credentials (kid: ${kid}) not found in keyset`, { status: 403 });
    }

    // 5. Verify the RS256 signature using crypto.verify
    let isSignatureValid = false;
    try {
      const publicKey = crypto.createPublicKey({
        key: jwk,
        format: 'jwk'
      });
      const dataToVerify = `${headerB64}.${payloadB64}`;
      const signatureBuffer = Buffer.from(signatureB64, 'base64url');

      isSignatureValid = crypto.verify(
        'RSA-SHA256',
        Buffer.from(dataToVerify),
        publicKey,
        signatureBuffer
      );
    } catch (err) {
      console.error('[LTI-LAUNCH] Exception verifying signature:', err);
    }

    if (!isSignatureValid) {
      return new Response('LTI JWT signature verification failed', { status: 403 });
    }

    // 6. Validate standard LTI claims (exp, nonce, state)
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSeconds - 60) {
      return new Response('LTI Launch token has expired', { status: 403 });
    }

    const cookieStore = await cookies();
    const savedNonce = cookieStore.get('lti_nonce')?.value;
    const savedState = cookieStore.get('lti_state')?.value;

    if (savedNonce && payload.nonce && savedNonce !== payload.nonce) {
      console.error('[LTI-LAUNCH] Nonce mismatch:', { savedNonce, tokenNonce: payload.nonce });
      return new Response('LTI Launch nonce validation failed', { status: 403 });
    }
    if (savedState && state && savedState !== state) {
      console.error('[LTI-LAUNCH] State mismatch:', { savedState, queryState: state });
      return new Response('LTI Launch state validation failed', { status: 403 });
    }

    // 7. Resolve LMS user profile and mapping
    const sub = payload.sub;
    const email = payload.email || `${sub}@lti.openprimer.ai`;
    const fullName = payload.name || payload.given_name || payload.family_name || `LMS User ${sub.substring(0, 6)}`;
    const roles = payload['https://purl.imsglobal.org/spec/lti/claim/roles'] || [];

    // Map role (check if they are instructor/admin in LMS)
    const isInstructor = roles.some((r: string) => 
      r.includes('Instructor') || 
      r.includes('Administrator') || 
      r.includes('ContentDeveloper')
    );
    const userRole = isInstructor ? 'admin' : 'student';

    // Query mapping
    const { data: ltiUser } = await supabaseAdmin
      .from('lti_users')
      .select('*')
      .eq('platform_id', platform.id)
      .eq('lti_sub', sub)
      .maybeSingle();

    let profile: any = null;

    if (ltiUser) {
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', ltiUser.user_id)
        .maybeSingle();
      profile = existingProfile;
    }

    if (!profile) {
      // Check if email already exists in profiles
      const { data: existingProfileByEmail } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (existingProfileByEmail) {
        profile = existingProfileByEmail;
      } else {
        // Create new profile
        const newUserId = `u_lti_${crypto.randomUUID()}`;
        const { data: newProfile, error: createProfileErr } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: newUserId,
            name: fullName,
            email: email,
            role: userRole,
            level: 1,
            kp: 0,
            is_email_verified: true,
            joined_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createProfileErr) {
          console.error('[LTI-LAUNCH] Failed to create new user profile:', createProfileErr);
          return new Response('Failed to initialize local user profile record', { status: 500 });
        }
        profile = newProfile;
      }

      // Link in lti_users mapping
      const { error: linkErr } = await supabaseAdmin
        .from('lti_users')
        .insert({
          user_id: profile.id,
          lti_sub: sub,
          platform_id: platform.id
        });

      if (linkErr) {
        console.error('[LTI-LAUNCH] Failed to link LTI mapping:', linkErr);
      }
    }

    // 8. Redirect target extraction & auto-enrollment
    const targetLinkUri = payload['https://purl.imsglobal.org/spec/lti/claim/target_link_uri'] || '';
    let redirectPath = '/';
    if (targetLinkUri) {
      try {
        const targetUrl = new URL(targetLinkUri);
        redirectPath = targetUrl.pathname + targetUrl.search;
      } catch (e) {
        console.error('[LTI-LAUNCH] Invalid target_link_uri:', targetLinkUri);
      }
    }

    // Auto-enroll checking
    const pathParts = redirectPath.split('/').filter(Boolean);
    if (pathParts.length >= 3) {
      const courseSlug = cleanPathSegment(pathParts[2]);
      const { data: course } = await supabaseAdmin
        .from('courses')
        .select('id, is_curriculum, child_courses')
        .eq('slug', courseSlug)
        .maybeSingle();

      if (course) {
        const { data: enrolledProgress } = await supabaseAdmin
          .from('progress')
          .select('id')
          .eq('user_id', profile.id)
          .eq('course_id', course.id)
          .maybeSingle();

        if (!enrolledProgress) {
          const rowsToInsert = [{
            user_id: profile.id,
            course_id: course.id,
            progress: 0,
            last_visited: new Date().toISOString()
          }];

          if (course.is_curriculum && course.child_courses) {
            course.child_courses.forEach((cid: number) => {
              rowsToInsert.push({
                user_id: profile.id,
                course_id: cid,
                progress: 0,
                last_visited: new Date().toISOString()
              });
            });
          }

          await supabaseAdmin
            .from('progress')
            .upsert(rowsToInsert, { onConflict: 'user_id,course_id' });
        }
      }
    }

    // Sync user session details to browser cookies immediately to ensure seamless route guard validation on direct redirect
    try {
      const { data: progressRecords } = await supabaseAdmin
        .from('progress')
        .select('course_id')
        .eq('user_id', profile.id);
      const enrolledIds = progressRecords ? progressRecords.map((r: any) => r.course_id) : [];

      cookieStore.set('op_user_id', profile.id, { path: '/', maxAge: 31536000, sameSite: 'lax' });
      cookieStore.set('op_user_role', profile.role || 'student', { path: '/', maxAge: 31536000, sameSite: 'lax' });
      cookieStore.set('op_enrolled_courses', JSON.stringify(enrolledIds), { path: '/', maxAge: 31536000, sameSite: 'lax' });
    } catch (cookieErr) {
      console.error('[LTI-LAUNCH] Failed to write session cookies during API launch:', cookieErr);
    }

    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    const isProd = process.env.NODE_ENV === 'production';
    if (!jwtSecret) {
      if (isProd) {
        console.error('[LTI-LAUNCH] CRITICAL: SUPABASE_JWT_SECRET environment variable is not defined in production. Aborting launch.');
        return new Response('Configuration error: Secure JWT key not configured', { status: 500 });
      }
      console.warn('[LTI-LAUNCH] WARNING: SUPABASE_JWT_SECRET environment variable is not defined. Using a temporary fallback signature. Authenticated client-side queries will fail signature validation in Supabase.');
    }
    const secretToUse = jwtSecret || 'super-secret-jwt-token-with-at-least-32-characters-long';

    const jwtHeader = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const jwtNowSeconds = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      aud: 'authenticated',
      exp: jwtNowSeconds + 3600 * 24, // 24 hours expiry
      sub: profile.id,
      email: profile.email,
      app_metadata: {
        provider: 'lti',
        providers: ['lti']
      },
      user_metadata: {
        name: profile.name
      },
      role: 'authenticated'
    };

    const jwtHeaderB64 = Buffer.from(JSON.stringify(jwtHeader)).toString('base64url');
    const jwtPayloadB64 = Buffer.from(JSON.stringify(jwtPayload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', secretToUse)
      .update(`${jwtHeaderB64}.${jwtPayloadB64}`)
      .digest('base64url');

    const signedJwt = `${jwtHeaderB64}.${jwtPayloadB64}.${signature}`;

    // 10. Generate high-fidelity HTML launcher response with Supabase setSession integration
    const profileToInject = {
      id: profile.id,
      firstName: profile.name.split(' ')[0],
      lastName: profile.name.split(' ').slice(1).join(' ') || '',
      email: profile.email,
      preferredLang: profile.preferred_lang || 'EN',
      role: profile.role,
      isVerified: profile.is_email_verified
    };

    const launcherHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Authenticating | OpenPrimer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;900&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #0b1329;
      color: #f8fafc;
      font-family: 'Outfit', sans-serif;
      margin: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .container {
      text-align: center;
      position: relative;
      z-index: 10;
    }
    .logo-container {
      position: relative;
      margin-bottom: 2rem;
    }
    .logo {
      width: 80px;
      height: 80px;
      fill: none;
      stroke: #3b82f6;
      stroke-width: 2.5;
    }
    .glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 100%);
      filter: blur(20px);
      animation: pulse 2s infinite ease-in-out;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: -0.025em;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(to right, #60a5fa, #a78bfa, #34d399);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      font-size: 0.875rem;
      margin: 0;
    }
    .loader-bar {
      width: 200px;
      height: 4px;
      background-color: #1e293b;
      border-radius: 2px;
      margin: 1.5rem auto 0 auto;
      overflow: hidden;
      position: relative;
    }
    .loader-progress {
      width: 40%;
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 2px;
      position: absolute;
      animation: loading 1.5s infinite ease-in-out;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.9); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
    }
    @keyframes loading {
      0% { left: -40%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }
  </style>
</head>
<body>
  <div class="glow"></div>
  <div class="container">
    <div class="logo-container">
      <svg class="logo" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    </div>
    <h1>OPENPRIMER LTI</h1>
    <p id="status">Connecting securely to your LMS...</p>
    <div class="loader-bar">
      <div class="loader-progress"></div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    async function initializeSession() {
      try {
        localStorage.setItem('op_session', 'true');
        localStorage.setItem('op_user_profile', JSON.stringify(${JSON.stringify(profileToInject)}));
        localStorage.setItem('op_logged_in_before', 'true');

        // Retrieve config passed from the server
        const supabaseUrl = ${JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL || '')};
        const supabaseAnonKey = ${JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')};
        const jwtToken = ${JSON.stringify(signedJwt)};

        if (supabaseUrl && supabaseAnonKey && jwtToken && window.supabase) {
          try {
            const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
            const { error } = await supabaseClient.auth.setSession({
              access_token: jwtToken,
              refresh_token: null
            });
            if (error) {
              console.error('Supabase setSession error:', error);
            } else {
              console.log('Supabase authenticated session established successfully.');
            }
          } catch (supErr) {
            console.error('Failed to initialize Supabase client:', supErr);
          }
        }

        if (window.opener) {
          window.opener.postMessage({ type: 'LTI_LOGIN_SUCCESS', profile: ${JSON.stringify(profileToInject)} }, '*');
        }

        document.getElementById('status').innerText = 'Session initialized. Redirecting to lesson...';
        
        setTimeout(() => {
          window.location.href = ${JSON.stringify(redirectPath)};
        }, 800);
      } catch (e) {
        console.error('Storage access error:', e);
        document.getElementById('status').innerText = 'Failed to write session. Please check browser settings.';
      }
    }

    initializeSession();
  </script>
</body>
</html>`;

    return new Response(launcherHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });

  } catch (err: any) {
    console.error('[LTI-LAUNCH EXCEPTION]', err);
    return new Response('An internal error occurred during LTI launch processing.', { status: 500 });
  }
}
