import { supabaseAdmin } from '../supabase';

export const mediaValidationCache = new Map<string, boolean>();

export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return res;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function uploadToSupabaseStorage(fileName: string, buffer: Buffer, contentType: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('media')
      .upload(`public/${fileName}`, buffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.warn(`[SUPABASE STORAGE] Upload failed for ${fileName}:`, error.message);
      return null;
    }

    const { data: publicData } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(`public/${fileName}`);

    return publicData.publicUrl;
  } catch (err) {
    console.warn(`[SUPABASE STORAGE] Error uploading ${fileName}:`, err);
    return null;
  }
}

export async function validateMediaUrl(url: string): Promise<boolean> {
  if (!url) return false;
  if (mediaValidationCache.has(url)) return mediaValidationCache.get(url)!;

  try {
    const res = await fetchWithTimeout(url, { method: 'HEAD' }, 5000);
    const valid = res.ok;
    mediaValidationCache.set(url, valid);
    return valid;
  } catch (e) {
    mediaValidationCache.set(url, false);
    return false;
  }
}

export { supabaseAdmin };

export async function safeResponseJson(res: Response, context?: string): Promise<any> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const saPath = path.join(process.cwd(), 'secrets', 'openprimer-free-a9fb82581e59.json');

function base64UrlEncode(buf: Buffer): string {
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function getGoogleAccessToken(): Promise<string | null> {
  try {
    if (!fs.existsSync(saPath)) {
      return null;
    }
    const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: sa.token_uri || 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    const headerEncoded = base64UrlEncode(Buffer.from(JSON.stringify(header)));
    const payloadEncoded = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
    const stringToSign = `${headerEncoded}.${payloadEncoded}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(stringToSign);
    const signature = sign.sign(sa.private_key);
    const signatureEncoded = base64UrlEncode(signature);

    const jwt = `${stringToSign}.${signatureEncoded}`;

    const tokenRes = await fetchWithTimeout(sa.token_uri || 'https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    }, 6000);

    if (!tokenRes.ok) return null;
    const data = await safeResponseJson(tokenRes);
    return data?.access_token || null;
  } catch {
    return null;
  }
}
