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

import { ModelId, TASK_MODELS, MODEL_PRICING, TASK_TOKEN_ESTIMATES } from './ai-config';

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

  const configuredModel = TASK_MODELS[req.task];
  
  // Decide candidate models to try (from cheapest to fallback)
  let modelsToTry: string[] = [configuredModel];
  if (configuredModel === 'gemini-2.5-pro') {
    modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-pro'];
  } else if (configuredModel === 'gemini-2.0-flash-lite') {
    modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-pro'];
  } else {
    modelsToTry = [configuredModel, 'gemini-2.5-pro'];
  }

  const method = req.stream ? 'streamGenerateContent?alt=sse' : 'generateContent';
  let response: Response | null = null;
  let lastError = '';

  for (const model of modelsToTry) {
    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model}:${method}`;

    const body: Record<string, unknown> = { contents: req.contents };
    if (req.systemInstruction) {
      body.systemInstruction = { parts: [{ text: req.systemInstruction }] };
    }
    if (req.generationConfig) {
      body.generationConfig = req.generationConfig;
    }

    try {
      console.log(`[VERTEX] Attempting call with model "${model}"...`);
      const startTime = Date.now();
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        console.log(`[VERTEX] ✅ Call succeeded with model "${model}".`);
        
        const durationMs = Date.now() - startTime;
        const clonedResponse = response.clone();
        
        // Track stats asynchronously in the background
        (async () => {
          try {
            const json = await clonedResponse.json();
            const usage = json.usageMetadata || {};
            const promptTokens = usage.promptTokenCount || 0;
            const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
            const promptText = req.contents?.[0]?.parts?.[0]?.text || '';
            
            await recordMetrics(req.task, model, durationMs, promptTokens, candidatesTokens, promptText);
          } catch (e) {
            console.warn('[VERTEX] Failed to parse usage metadata from response clone:', e);
            // Fallback: estimate tokens if parsing failed
            const est = TASK_TOKEN_ESTIMATES[req.task] || { inputTokens: 1000, outputTokens: 500 };
            const promptText = req.contents?.[0]?.parts?.[0]?.text || '';
            await recordMetrics(req.task, model, durationMs, est.inputTokens, est.outputTokens, promptText);
          }
        })();

        return response;
      } else {
        const errText = await response.text();
        lastError = `[VERTEX] Model "${model}" failed (${response.status}): ${errText.slice(0, 300)}`;
        console.warn(lastError);
      }
    } catch (e) {
      lastError = `[VERTEX] Model "${model}" exception: ${e}`;
      console.warn(lastError);
    }
  }

  console.error(`[VERTEX] All model candidates failed. Last error: ${lastError}`);
  return response;
}

/**
 * Record metrics for a generation task in the database.
 */
export async function recordMetrics(
  task: keyof typeof TASK_MODELS | string,
  model: string,
  durationMs: number,
  promptTokens: number,
  candidatesTokens: number,
  promptTextForClassifier: string = ''
) {
  try {
    // 1. Calculate cost using MODEL_PRICING
    const pricing = MODEL_PRICING[model as ModelId];
    let cost = 0;
    if (pricing) {
      cost = (promptTokens / 1_000_000) * pricing.inputPer1M 
           + (candidatesTokens / 1_000_000) * pricing.outputPer1M;
    } else {
      // Default fallback cost estimation if model not in pricing (e.g., fallback default)
      cost = (promptTokens / 1_000_000) * 0.075 + (candidatesTokens / 1_000_000) * 0.30;
    }

    // 2. Map task to metric ID:
    let metricId = 'tutor';
    if (task === 'course_generation') {
      // Classify whether it is Agent 4 review or Agent 1-3 creation
      if (promptTextForClassifier.includes('Verifier/Critic Agent') || promptTextForClassifier.includes('Agent 4')) {
        metricId = 'revision';
      } else {
        metricId = 'generation';
      }
    } else if (task === 'course_translation' || task === 'jit_translate' || task === 'batch_translate') {
      metricId = 'translation';
    } else if (task === 'analytics' || task === 'revision') {
      metricId = 'revision';
    } else if (task === 'tutor_chat') {
      metricId = 'tutor';
    }

    console.log(`[METRICS] Recording task "${task}" -> agent "${metricId}". Model: "${model}". Prompt tokens: ${promptTokens}, Candidates tokens: ${candidatesTokens}. Duration: ${durationMs}ms. Cost: $${cost.toFixed(6)}`);

    const { dbService } = await import('./db');
    await dbService.updateAgentMetrics(metricId, cost, durationMs);
  } catch (e) {
    console.warn('[METRICS] Failed to record metrics:', e);
  }
}

/** Returns true if Vertex AI credentials are configured */
export function isVertexConfigured(): boolean {
  return !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
}
