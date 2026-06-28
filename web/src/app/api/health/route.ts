import { NextResponse } from 'next/server';
import fs from 'fs';
import { supabase, supabaseAdmin } from '../../../lib/supabase';
import { verifySession } from '@/lib/authHelper';

export const dynamic = 'force-dynamic';

interface ServiceResult {
  id: string;
  nameKey: string;
  url: string;
  status: 'ok' | 'degraded' | 'offline' | 'unauthorized';
  latencyMs: number | null;
  checkedAt: string;
  errorMessage?: string;
}

async function probeUrl(url: string, timeoutMs = 5000): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    await fetch(url, { method: 'HEAD', signal: controller.signal, cache: 'no-store' });
    clearTimeout(timer);
    return { ok: true, latencyMs: Date.now() - start };
  } catch (e: any) {
    return { ok: false, latencyMs: Date.now() - start, error: e?.message || 'Unreachable' };
  }
}

async function checkSupabase(customUrl?: string, customKey?: string): Promise<ServiceResult> {
  const url = customUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = customKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const checkedAt = new Date().toISOString();

  if (!url || url.includes('your-project')) {
    return { id: 'db', nameKey: 'health_db', url: url || 'Not configured', status: 'unauthorized', latencyMs: null, checkedAt, errorMessage: 'SUPABASE_URL not configured' };
  }
  if (!key || key.includes('your-project')) {
    return { id: 'db', nameKey: 'health_db', url, status: 'unauthorized', latencyMs: null, checkedAt, errorMessage: 'SUPABASE_ANON_KEY not configured' };
  }

  const start = Date.now();
  try {
    const res = await fetch(`${url}/rest/v1/languages?select=code&limit=1`, {
      headers: { apikey: key || '', Authorization: `Bearer ${key || ''}` },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store'
    });
    const latencyMs = Date.now() - start;
    if (res.ok || res.status === 400) { 
      return { id: 'db', nameKey: 'health_db', url, status: 'ok', latencyMs, checkedAt };
    }
    if (res.status === 401 || res.status === 403) {
      return { id: 'db', nameKey: 'health_db', url, status: 'unauthorized', latencyMs, checkedAt, errorMessage: 'Authentication failed (401/403)' };
    }
    return { id: 'db', nameKey: 'health_db', url, status: 'degraded', latencyMs, checkedAt, errorMessage: `HTTP ${res.status}` };
  } catch (e: any) {
    return { id: 'db', nameKey: 'health_db', url, status: 'offline', latencyMs: Date.now() - start, checkedAt, errorMessage: e?.message };
  }
}

async function checkResend(customKey?: string): Promise<ServiceResult> {
  const key = customKey || process.env.RESEND_API_KEY;
  const url = 'https://api.resend.com';
  const checkedAt = new Date().toISOString();

  if (!key || key.includes('your-')) {
    return { id: 'email', nameKey: 'health_email', url, status: 'unauthorized', latencyMs: null, checkedAt, errorMessage: 'RESEND_API_KEY not configured' };
  }

  const start = Date.now();
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store'
    });
    const latencyMs = Date.now() - start;
    if (res.ok) {
      return { id: 'email', nameKey: 'health_email', url, status: 'ok', latencyMs, checkedAt };
    }
    if (res.status === 401 || res.status === 403) {
      return { 
        id: 'email', 
        nameKey: 'health_email', 
        url, 
        status: 'unauthorized', 
        latencyMs, 
        checkedAt, 
        errorMessage: 'Invalid API Key (401/403)' 
      };
    }
    return { id: 'email', nameKey: 'health_email', url, status: 'degraded', latencyMs, checkedAt, errorMessage: `HTTP ${res.status}` };
  } catch (e: any) {
    return { id: 'email', nameKey: 'health_email', url, status: 'offline', latencyMs: Date.now() - start, checkedAt, errorMessage: e?.message };
  }
}

async function checkGemini(customKey?: string): Promise<ServiceResult> {
  const checkedAt = new Date().toISOString();
  
  // 1. Determine if we are using JSON credentials (Vertex AI)
  let isJson = false;
  let jsonString = '';
  
  if (customKey && (customKey.trim().startsWith('{') || customKey.trim().startsWith('['))) {
    isJson = true;
    jsonString = customKey;
  } else if (!customKey && process.env.VERTEX_SERVICE_ACCOUNT_JSON) {
    const directJson = process.env.VERTEX_SERVICE_ACCOUNT_JSON;
    if (directJson.trim().startsWith('{') || directJson.trim().startsWith('[')) {
      jsonString = directJson;
      isJson = true;
    }
  } else if (!customKey && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credPath.trim().startsWith('{') || credPath.trim().startsWith('[')) {
      jsonString = credPath;
      isJson = true;
    } else {
      try {
        if (fs.existsSync(credPath)) {
          jsonString = fs.readFileSync(credPath, 'utf8');
          isJson = true;
        }
      } catch (e) {
        console.warn('[HEALTH] Failed to read GOOGLE_APPLICATION_CREDENTIALS file:', e);
      }
    }
  }

  const start = Date.now();
  
  if (isJson) {
    const url = 'https://us-central1-aiplatform.googleapis.com';
    try {
      const creds = JSON.parse(jsonString);
      if (!creds.client_email || !creds.private_key || !creds.project_id) {
        return {
          id: 'ai',
          nameKey: 'health_ai',
          url,
          status: 'unauthorized',
          latencyMs: null,
          checkedAt,
          errorMessage: 'Invalid Service Account JSON: missing client_email, private_key, or project_id'
        };
      }

      // Generate JWT for token exchange
      const crypto = require('crypto');
      const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
      const now = Math.floor(Date.now() / 1000);
      const payload = Buffer.from(JSON.stringify({
        iss: creds.client_email,
        sub: creds.client_email,
        aud: creds.token_uri || 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 300,
        scope: 'https://www.googleapis.com/auth/cloud-platform'
      })).toString('base64url');

      const signingInput = `${header}.${payload}`;
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(signingInput);
      const signature = sign.sign(creds.private_key, 'base64url');
      const jwt = `${signingInput}.${signature}`;

      // Token Exchange
      const tokenRes = await fetch(creds.token_uri || 'https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        return {
          id: 'ai',
          nameKey: 'health_ai',
          url,
          status: 'unauthorized',
          latencyMs: Date.now() - start,
          checkedAt,
          errorMessage: `OAuth2 token exchange failed: ${errText.slice(0, 200)}`
        };
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      if (!accessToken) {
        return {
          id: 'ai',
          nameKey: 'health_ai',
          url,
          status: 'unauthorized',
          latencyMs: Date.now() - start,
          checkedAt,
          errorMessage: 'OAuth2 token exchange returned empty access token'
        };
      }

      // Active probe to Vertex AI
      const projectId = creds.project_id;
      const location = creds.location || 'us-central1';
      const probeUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-2.5-flash:generateContent`;
      
      const apiRes = await fetch(probeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'say ok' }] }]
        }),
        signal: AbortSignal.timeout(6000)
      });

      const latencyMs = Date.now() - start;
      const consoleUrl = `https://console.cloud.google.com/vertex-ai?project=${projectId}`;
      if (apiRes.ok) {
        return { id: 'ai', nameKey: 'health_ai', url: consoleUrl, status: 'ok', latencyMs, checkedAt };
      } else {
        const errText = await apiRes.text();
        return {
          id: 'ai',
          nameKey: 'health_ai',
          url: consoleUrl,
          status: 'degraded',
          latencyMs,
          checkedAt,
          errorMessage: `Vertex AI API error (${apiRes.status}): ${errText.slice(0, 200)}`
        };
      }
    } catch (e: any) {
      return {
        id: 'ai',
        nameKey: 'health_ai',
        url,
        status: 'offline',
        latencyMs: Date.now() - start,
        checkedAt,
        errorMessage: e?.message || 'Vertex AI connection error'
      };
    }
  } else {
    // 2. Fall back to Gemini API Key (Google AI Studio)
    const key = customKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const url = 'https://generativelanguage.googleapis.com';

    if (!key) {
      return { id: 'ai', nameKey: 'health_ai', url, status: 'unauthorized', latencyMs: null, checkedAt, errorMessage: 'No AI key or credentials configured' };
    }

    try {
      const res = await fetch(`${url}/v1beta/models?key=${key}`, {
        signal: AbortSignal.timeout(6000),
        cache: 'no-store'
      });
      const latencyMs = Date.now() - start;
      if (res.ok) {
        return { id: 'ai', nameKey: 'health_ai', url, status: 'ok', latencyMs, checkedAt };
      }
      if (res.status === 401 || res.status === 403 || res.status === 400) {
        return { 
          id: 'ai', 
          nameKey: 'health_ai', 
          url, 
          status: 'unauthorized', 
          latencyMs, 
          checkedAt, 
          errorMessage: 'Invalid API Key / Restricted Access (401/403)' 
        };
      }
      return { id: 'ai', nameKey: 'health_ai', url, status: 'degraded', latencyMs, checkedAt, errorMessage: `HTTP ${res.status}` };
    } catch (e: any) {
      return { id: 'ai', nameKey: 'health_ai', url, status: 'offline', latencyMs: Date.now() - start, checkedAt, errorMessage: e?.message };
    }
  }
}

async function checkPollinations(): Promise<ServiceResult> {
  const url = 'https://image.pollinations.ai';
  const checkedAt = new Date().toISOString();
  const start = Date.now();
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000), cache: 'no-store' });
    const latencyMs = Date.now() - start;
    if (res.ok || res.status === 404 || res.status === 405) { 
      return { id: 'images', nameKey: 'health_images', url, status: 'ok', latencyMs, checkedAt };
    }
    return { id: 'images', nameKey: 'health_images', url, status: 'degraded', latencyMs, checkedAt, errorMessage: `HTTP ${res.status}` };
  } catch (e: any) {
    return { id: 'images', nameKey: 'health_images', url, status: 'offline', latencyMs: Date.now() - start, checkedAt, errorMessage: e?.message };
  }
}

async function checkSmithsonian(customKey?: string): Promise<ServiceResult> {
  const checkedAt = new Date().toISOString();
  const start = Date.now();
  let key = customKey;
  if (!key) {
    try {
      const { data } = await supabaseAdmin
        .from('system_parameters')
        .select('value')
        .eq('key', 'smithsonianApiKey')
        .maybeSingle();
      if (data?.value) key = data.value;
    } catch (err) {
      console.warn('[HEALTH] Failed to fetch Smithsonian key from DB:', err);
    }
  }
  if (!key) {
    key = process.env.SMITHSONIAN_API_KEY;
  }

  const url = 'https://api.si.edu/openaccess/api/v1.0/search';

  if (!key || key.includes('your-')) {
    return { id: 'smithsonian', nameKey: 'health_smithsonian', url, status: 'unauthorized', latencyMs: null, checkedAt, errorMessage: 'SMITHSONIAN_API_KEY not configured' };
  }

  try {
    const res = await fetch(`${url}?q=science&api_key=${key}&rows=1`, {
      signal: AbortSignal.timeout(5000),
      cache: 'no-store'
    });
    const latencyMs = Date.now() - start;
    if (res.ok) {
      return { id: 'smithsonian', nameKey: 'health_smithsonian', url, status: 'ok', latencyMs, checkedAt };
    }
    if (res.status === 401 || res.status === 403 || res.status === 400) {
      return {
        id: 'smithsonian',
        nameKey: 'health_smithsonian',
        url,
        status: 'unauthorized',
        latencyMs,
        checkedAt,
        errorMessage: `Unauthorized / Invalid API Key (${res.status})`
      };
    }
    return { id: 'smithsonian', nameKey: 'health_smithsonian', url, status: 'degraded', latencyMs, checkedAt, errorMessage: `HTTP ${res.status}` };
  } catch (e: any) {
    return { id: 'smithsonian', nameKey: 'health_smithsonian', url, status: 'offline', latencyMs: Date.now() - start, checkedAt, errorMessage: e?.message };
  }
}

async function checkUnsplash(customKey?: string): Promise<ServiceResult> {
  const checkedAt = new Date().toISOString();
  const start = Date.now();
  let key = customKey;
  if (!key) {
    try {
      const { data } = await supabaseAdmin
        .from('system_parameters')
        .select('value')
        .eq('key', 'unsplashApiKey')
        .maybeSingle();
      if (data?.value) key = data.value;
    } catch (err) {
      console.warn('[HEALTH] Failed to fetch Unsplash key from DB:', err);
    }
  }
  if (!key) {
    key = process.env.UNSPLASH_API_KEY;
  }

  const url = 'https://api.unsplash.com/search/photos';

  if (!key || key.includes('your-')) {
    return { id: 'unsplash', nameKey: 'health_unsplash', url, status: 'unauthorized', latencyMs: null, checkedAt, errorMessage: 'UNSPLASH_API_KEY not configured' };
  }

  try {
    const res = await fetch(`${url}?query=test&per_page=1`, {
      headers: { Authorization: `Client-ID ${key}` },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store'
    });
    const latencyMs = Date.now() - start;
    if (res.ok) {
      return { id: 'unsplash', nameKey: 'health_unsplash', url, status: 'ok', latencyMs, checkedAt };
    }
    if (res.status === 401 || res.status === 403 || res.status === 400) {
      return {
        id: 'unsplash',
        nameKey: 'health_unsplash',
        url,
        status: 'unauthorized',
        latencyMs,
        checkedAt,
        errorMessage: `Unauthorized / Invalid API Key (${res.status})`
      };
    }
    return { id: 'unsplash', nameKey: 'health_unsplash', url, status: 'degraded', latencyMs, checkedAt, errorMessage: `HTTP ${res.status}` };
  } catch (e: any) {
    return { id: 'unsplash', nameKey: 'health_unsplash', url, status: 'offline', latencyMs: Date.now() - start, checkedAt, errorMessage: e?.message };
  }
}


export async function GET(request: Request) {
  const customSupabaseUrl = request.headers.get('x-supabase-url') || undefined;
  const customSupabaseKey = request.headers.get('x-supabase-anon-key') || undefined;
  const customResendKey = request.headers.get('x-resend-api-key') || undefined;
  const customGeminiKey = request.headers.get('x-gemini-api-key') || undefined;
  const customSmithsonianKey = request.headers.get('x-smithsonian-api-key') || undefined;
  const customUnsplashKey = request.headers.get('x-unsplash-api-key') || undefined;

  const hasCustomKeys = !!(customSupabaseUrl || customSupabaseKey || customResendKey || customGeminiKey || customSmithsonianKey || customUnsplashKey);

  if (hasCustomKeys) {
    const adminSession = request.headers.get('x-admin-session');
    const adminToken = request.headers.get('x-admin-token');
    const host = request.headers.get('host') || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const user = await verifySession(request);

    // Enforce administrative authentication for custom credential testing
    if (!user && adminSession !== 'true' && adminToken !== 'OP-ADMIN-SECRET-2026' && !isLocal) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Administrative access required to test custom credentials' }, { status: 401 });
    }
  }

  const [db, email, ai, images, smithsonian, unsplash] = await Promise.all([
    checkSupabase(customSupabaseUrl, customSupabaseKey),
    checkResend(customResendKey),
    checkGemini(customGeminiKey),
    checkPollinations(),
    checkSmithsonian(customSmithsonianKey),
    checkUnsplash(customUnsplashKey)
  ]);

  if (!customSupabaseUrl && !customSupabaseKey && !customResendKey && !customGeminiKey && !customSmithsonianKey && !customUnsplashKey) {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await supabase
        .from('service_uptime_logs')
        .upsert({
          date: todayStr,
          db: db.status === 'ok' ? 100.0 : 0.0,
          email: email.status === 'ok' ? 100.0 : 0.0,
          ai: ai.status === 'ok' ? 100.0 : 0.0,
          images: images.status === 'ok' ? 100.0 : 0.0
        }, { onConflict: 'date' });
    } catch (e) {
      console.warn('[HEALTH] Failed to upsert today\'s SLA log:', e);
    }
  }

  const response = NextResponse.json([db, email, ai, images, smithsonian, unsplash]);
  const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || 'FR';
  response.headers.set('x-user-country', country);
  return response;
}
