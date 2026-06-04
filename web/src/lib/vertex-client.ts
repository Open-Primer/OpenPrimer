/**
 * Vertex AI Client — OpenPrimer
 * 
 * Handles OAuth2 token acquisition from the service account JSON
 * and provides a unified callVertexAI() helper used by all API routes.
 * 
 * Authentication: Service Account JSON → Google OAuth2 token
 * Endpoint: us-central1-aiplatform.googleapis.com
 * Billing: Charged against GCP project free trial credits (€238)
 */

import { ModelId, TASK_MODELS } from './ai-config';

const PROJECT_ID = process.env.VERTEX_PROJECT_ID || 'openprimer-free';
const LOCATION   = process.env.VERTEX_LOCATION   || 'us-central1';

interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  token_uri: string;
}

let _cachedToken: string | null = null;
let _tokenExpiry = 0;

/**
 * Load service account credentials from the JSON file path
 * specified in GOOGLE_APPLICATION_CREDENTIALS env variable.
 */
async function loadCredentials(): Promise<ServiceAccountCredentials | null> {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath) return null;
  try {
    const fs = await import('fs');
    const raw = fs.readFileSync(credPath, 'utf8');
    return JSON.parse(raw) as ServiceAccountCredentials;
  } catch (e) {
    console.warn('[VERTEX] Failed to load service account credentials:', e);
    return null;
  }
}

/**
 * Create a signed JWT for Google OAuth2 service account authentication.
 * Uses Node.js built-in crypto — no external dependencies.
 */
async function createJWT(creds: ServiceAccountCredentials): Promise<string> {
  const crypto = await import('crypto');
  
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    iss: creds.client_email,
    sub: creds.client_email,
    aud: creds.token_uri,
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/cloud-platform'
  })).toString('base64url');

  const signingInput = `${header}.${payload}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(creds.private_key, 'base64url');

  return `${signingInput}.${signature}`;
}

/**
 * Obtain a short-lived OAuth2 access token from Google.
 * Cached for up to 50 minutes to avoid excessive token requests.
 */
async function getAccessToken(): Promise<string | null> {
  if (_cachedToken && Date.now() < _tokenExpiry) {
    return _cachedToken;
  }

  const creds = await loadCredentials();
  if (!creds) {
    console.warn('[VERTEX] No GOOGLE_APPLICATION_CREDENTIALS configured — Vertex AI unavailable.');
    return null;
  }

  try {
    const jwt = await createJWT(creds);
    const res = await fetch(creds.token_uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[VERTEX] Token exchange failed:', err);
      return null;
    }

    const data = await res.json();
    _cachedToken = data.access_token;
    _tokenExpiry = Date.now() + 50 * 60 * 1000; // Cache for 50 min
    console.log('[VERTEX] ✅ OAuth2 token acquired successfully.');
    return _cachedToken;
  } catch (e) {
    console.error('[VERTEX] Exception during token acquisition:', e);
    return null;
  }
}

export interface VertexRequest {
  task: keyof typeof TASK_MODELS;
  contents: { role: string; parts: { text: string }[] }[];
  systemInstruction?: string;
  generationConfig?: Record<string, unknown>;
  stream?: boolean;
}

/**
 * Make a generateContent or streamGenerateContent call to Vertex AI.
 * Returns the raw fetch Response so callers can handle streaming or JSON.
 */
export async function callVertexAI(req: VertexRequest): Promise<Response | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const model = TASK_MODELS[req.task];
  const method = req.stream ? 'streamGenerateContent?alt=sse' : 'generateContent';
  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model}:${method}`;

  const body: Record<string, unknown> = { contents: req.contents };
  if (req.systemInstruction) {
    body.systemInstruction = { parts: [{ text: req.systemInstruction }] };
  }
  if (req.generationConfig) {
    body.generationConfig = req.generationConfig;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok && !req.stream) {
    const errText = await response.text();
    console.error(`[VERTEX] ${model} call failed (${response.status}):`, errText.slice(0, 200));
  }

  return response;
}

/** Returns true if Vertex AI credentials are configured */
export function isVertexConfigured(): boolean {
  return !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
}
