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

async function checkSupabase(): Promise<ServiceResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

async function checkResend(): Promise<ServiceResult> {
  const key = process.env.RESEND_API_KEY;
  const url = 'https://api.resend.com';
  const checkedAt = new Date().toISOString();

  if (!key || key.includes('your-')) {
    return { id: 'email', nameKey: 'health_email', url, status: 'offline', latencyMs: null, checkedAt, errorMessage: 'RESEND_API_KEY not configured' };
  }

  const start = Date.now();
  try {
    // Ping the domains endpoint — lightweight, authenticated
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

async function checkGemini(): Promise<ServiceResult> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const url = 'https://generativelanguage.googleapis.com';
  const checkedAt = new Date().toISOString();

  if (!key) {
    return { id: 'ai', nameKey: 'health_ai', url, status: 'offline', latencyMs: null, checkedAt, errorMessage: 'GEMINI_API_KEY not configured' };
  }

  const start = Date.now();
  try {
    // Lightweight models list probe
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

export async function GET() {
  const [db, email, ai, images] = await Promise.all([
    checkSupabase(),
    checkResend(),
    checkGemini(),
    checkPollinations()
  ]);

  return NextResponse.json([db, email, ai, images]);
}
