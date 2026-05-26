import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ServiceResult {
  id: string;
  nameKey: string;
  url: string;
  status: 'ok' | 'degraded' | 'offline';
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
    return { id: 'db', nameKey: 'health_db', url: url || 'Not configured', status: 'offline', latencyMs: null, checkedAt, errorMessage: 'SUPABASE_URL not configured' };
  }

  const start = Date.now();
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key || '', Authorization: `Bearer ${key || ''}` },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store'
    });
    const latencyMs = Date.now() - start;
    if (res.ok || res.status === 400) { // 400 = no query params but server is alive
      return { id: 'db', nameKey: 'health_db', url, status: 'ok', latencyMs, checkedAt };
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
    return { id: 'email', nameKey: 'health_email', url, status: 'offline', latencyMs: null, checkedAt, errorMessage: 'RESEND_API_KEY not configured' };
  }

  const start = Date.now();
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store'
    });
    const latencyMs = Date.now() - start;
    if (res.ok) return { id: 'email', nameKey: 'health_email', url, status: 'ok', latencyMs, checkedAt };
    if (res.status === 401) return { id: 'email', nameKey: 'health_email', url, status: 'degraded', latencyMs, checkedAt, errorMessage: 'Invalid API key' };
    return { id: 'email', nameKey: 'health_email', url, status: 'degraded', latencyMs, checkedAt, errorMessage: `HTTP ${res.status}` };
  } catch (e: any) {
    return { id: 'email', nameKey: 'health_email', url, status: 'offline', latencyMs: Date.now() - start, checkedAt, errorMessage: e?.message };
  }
}

async function checkGemini(customKey?: string): Promise<ServiceResult> {
  const key = customKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const url = 'https://generativelanguage.googleapis.com';
  const checkedAt = new Date().toISOString();

  if (!key) {
    return { id: 'ai', nameKey: 'health_ai', url, status: 'offline', latencyMs: null, checkedAt, errorMessage: 'GEMINI_API_KEY not configured' };
  }

  const start = Date.now();
  try {
    const res = await fetch(`${url}/v1beta/models?key=${key}`, {
      signal: AbortSignal.timeout(6000),
      cache: 'no-store'
    });
    const latencyMs = Date.now() - start;
    if (res.ok) return { id: 'ai', nameKey: 'health_ai', url, status: 'ok', latencyMs, checkedAt };
    if (res.status === 400) return { id: 'ai', nameKey: 'health_ai', url, status: 'degraded', latencyMs, checkedAt, errorMessage: 'API reachable, check key permissions' };
    return { id: 'ai', nameKey: 'health_ai', url, status: 'degraded', latencyMs, checkedAt, errorMessage: `HTTP ${res.status}` };
  } catch (e: any) {
    return { id: 'ai', nameKey: 'health_ai', url, status: 'offline', latencyMs: Date.now() - start, checkedAt, errorMessage: e?.message };
  }
}

async function checkPollinations(): Promise<ServiceResult> {
  const url = 'https://image.pollinations.ai';
  const checkedAt = new Date().toISOString();
  const start = Date.now();
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000), cache: 'no-store' });
    const latencyMs = Date.now() - start;
    if (res.ok || res.status === 404 || res.status === 405) { // 404/405 = server alive but no root route
      return { id: 'images', nameKey: 'health_images', url, status: 'ok', latencyMs, checkedAt };
    }
    return { id: 'images', nameKey: 'health_images', url, status: 'degraded', latencyMs, checkedAt, errorMessage: `HTTP ${res.status}` };
  } catch (e: any) {
    return { id: 'images', nameKey: 'health_images', url, status: 'offline', latencyMs: Date.now() - start, checkedAt, errorMessage: e?.message };
  }
}

export async function GET(request: Request) {
  const adminSession = request.headers.get('x-admin-session');
  const adminToken = request.headers.get('x-admin-token');
  const host = request.headers.get('host') || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  // Enforce administrative authentication
  if (adminSession !== 'true' && adminToken !== 'OP-ADMIN-SECRET-2026' && !isLocal) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Administrative access required' }, { status: 401 });
  }

  const customSupabaseUrl = request.headers.get('x-supabase-url') || undefined;
  const customSupabaseKey = request.headers.get('x-supabase-anon-key') || undefined;
  const customResendKey = request.headers.get('x-resend-api-key') || undefined;
  const customGeminiKey = request.headers.get('x-gemini-api-key') || undefined;

  const [db, email, ai, images] = await Promise.all([
    checkSupabase(customSupabaseUrl, customSupabaseKey),
    checkResend(customResendKey),
    checkGemini(customGeminiKey),
    checkPollinations()
  ]);

  return NextResponse.json([db, email, ai, images]);
}
