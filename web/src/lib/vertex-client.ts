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

// Pool of high-capacity regional endpoints to support dynamic failover on 429 errors
const REGIONS_POOL = [
  process.env.VERTEX_LOCATION || 'us-central1',
  'europe-west1',
  'us-east4',
  'asia-east1',
  'us-west1'
];
let currentRegionIndex = 0;

// ─────────────────────────────────────────────────────────────────
// ADAPTIVE RATE LIMITER — Token Bucket with RPM + TPM Support
// ─────────────────────────────────────────────────────────────────
// Monitors and regulates both Requests Per Minute (RPM) and
// Tokens Per Minute (TPM) locally to prevent hitting GCP 429s.
// Adapts dynamically (congestion control) if a 429 is encountered.

interface RequestRecord {
  timestamp: number;
  tokens: number;
}

const requestHistory: RequestRecord[] = [];

// Plafonds maximums configurables ou valeurs par défaut conservatrices
const MAX_RPM_CEILING = Number(process.env.VERTEX_MAX_RPM || 60);
const MAX_TPM_CEILING = Number(process.env.VERTEX_MAX_TPM || 1000000);

let _rpmCapacity = MAX_RPM_CEILING;
let _tpmCapacity = MAX_TPM_CEILING;

function cleanOldHistory(now: number) {
  const cutoff = now - 60000;
  while (requestHistory.length > 0 && requestHistory[0].timestamp < cutoff) {
    requestHistory.shift();
  }
}

/**
 * Heuristic estimation of the token size of a VertexRequest.
 * Roughly 3.5 characters per token to remain conservative.
 */
function estimateRequestTokens(req: VertexRequest): number {
  let textLength = 0;
  req.contents.forEach(c => {
    c.parts.forEach(p => {
      if ('text' in p) {
        textLength += p.text.length;
      }
    });
  });
  if (req.systemInstruction) {
    textLength += req.systemInstruction.length;
  }
  return Math.max(1000, Math.ceil(textLength / 3.5));
}

/**
 * Acquire rate-limit spacing before making a Vertex AI call.
 * Blocks if we would exceed active RPM or estimated TPM ceilings.
 */
async function acquireRateLimitToken(estimatedTokens: number): Promise<void> {
  let isWaiting = true;
  while (isWaiting) {
    const now = Date.now();
    cleanOldHistory(now);

    const currentRPM = requestHistory.length;
    const currentTPM = requestHistory.reduce((sum, r) => sum + r.tokens, 0);

    if (currentRPM + 1 > _rpmCapacity) {
      const oldestRecord = requestHistory[0];
      const waitMs = oldestRecord.timestamp + 60000 - now;
      console.log(`[RATE LIMITER] RPM limit reached (${currentRPM}/${_rpmCapacity} req). Throttling for ${Math.ceil(waitMs / 1000)}s...`);
      await new Promise(resolve => setTimeout(resolve, Math.max(1000, waitMs)));
    } else if (currentTPM + estimatedTokens > _tpmCapacity) {
      let cumulativeReleased = 0;
      let waitMs = 1000;
      for (const record of requestHistory) {
        cumulativeReleased += record.tokens;
        if (currentTPM - cumulativeReleased + estimatedTokens <= _tpmCapacity) {
          waitMs = record.timestamp + 60000 - now;
          break;
        }
      }
      console.log(`[RATE LIMITER] TPM limit reached (Current: ${currentTPM} + Est: ${estimatedTokens} > Cap: ${_tpmCapacity}). Throttling for ${Math.ceil(waitMs / 1000)}s...`);
      await new Promise(resolve => setTimeout(resolve, Math.max(1000, waitMs)));
    } else {
      isWaiting = false;
    }
  }

  // Record the start of this request
  requestHistory.push({
    timestamp: Date.now(),
    tokens: estimatedTokens
  });
}

/**
 * Success handler: Updates estimate with actual token count and slowly
 * increases capacity ceilings (AIMD - Additive Increase).
 */
function handleSuccessfulRequest(actualTokens: number) {
  if (requestHistory.length > 0) {
    requestHistory[requestHistory.length - 1].tokens = actualTokens;
  }
  _rpmCapacity = Math.min(MAX_RPM_CEILING, _rpmCapacity + 1);
  _tpmCapacity = Math.min(MAX_TPM_CEILING, _tpmCapacity + 10000);
}

/**
 * 429 Rate Limit handler: Shrinks capacities by 20% (AIMD - Multiplicative Decrease).
 */
function handleRateLimitError() {
  _rpmCapacity = Math.min(MAX_RPM_CEILING, Math.max(1, Math.floor(_rpmCapacity * 0.8)));
  _tpmCapacity = Math.min(MAX_TPM_CEILING, Math.max(10000, Math.floor(_tpmCapacity * 0.8)));
  console.warn(`[RATE LIMITER] ⚠️ 429 Resource Exhausted detected. Adapting local ceilings down to: RPM ${_rpmCapacity}, TPM ${_tpmCapacity}`);
}

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
 * Load service account credentials from the VERTEX_SERVICE_ACCOUNT_JSON env variable,
 * or fallback to the JSON file path specified in GOOGLE_APPLICATION_CREDENTIALS.
 */
async function loadCredentials(): Promise<ServiceAccountCredentials | null> {
  // 1. Try loading from direct JSON environment variable first
  const directJson = process.env.VERTEX_SERVICE_ACCOUNT_JSON;
  if (directJson && (directJson.trim().startsWith('{') || directJson.trim().startsWith('['))) {
    try {
      return JSON.parse(directJson) as ServiceAccountCredentials;
    } catch (e) {
      console.warn('[VERTEX] Failed to parse VERTEX_SERVICE_ACCOUNT_JSON:', e);
    }
  }

  // 2. Fallback to GOOGLE_APPLICATION_CREDENTIALS env var
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath) return null;

  // Support GOOGLE_APPLICATION_CREDENTIALS directly containing the JSON string
  if (credPath.trim().startsWith('{') || credPath.trim().startsWith('[')) {
    try {
      return JSON.parse(credPath) as ServiceAccountCredentials;
    } catch (e) {
      console.warn('[VERTEX] Failed to parse GOOGLE_APPLICATION_CREDENTIALS as JSON:', e);
    }
  }

  // Otherwise, load from the file path
  try {
    const fs = await import('fs');
    if (fs.existsSync(credPath)) {
      const raw = fs.readFileSync(credPath, 'utf8');
      return JSON.parse(raw) as ServiceAccountCredentials;
    } else {
      console.warn(`[VERTEX] GOOGLE_APPLICATION_CREDENTIALS file path does not exist: ${credPath}`);
    }
  } catch (e) {
    console.warn('[VERTEX] Failed to load service account credentials from file path:', e);
  }
  return null;
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
    console.warn('[VERTEX] No Vertex AI credentials configured — Vertex AI unavailable.');
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
  contents: { 
    role: string; 
    parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[]; 
  }[];
  systemInstruction?: string;
  generationConfig?: Record<string, unknown>;
  safetySettings?: {
    category: string;
    threshold: string;
  }[];
  stream?: boolean;
}

/**
 * Make a generateContent or streamGenerateContent call to Vertex AI.
 * Returns the raw fetch Response so callers can handle streaming or JSON.
 */
export async function callVertexAI(req: VertexRequest): Promise<Response | null> {
  // Estimate tokens and acquire rate-limit slot
  const estimatedTokens = estimateRequestTokens(req);
  await acquireRateLimitToken(estimatedTokens);

  const token = await getAccessToken();
  if (!token) return null;

  const configuredModel = TASK_MODELS[req.task];
  
  // Decide candidate models to try (from cheapest to fallback)
  let modelsToTry: string[] = [configuredModel];
  if (configuredModel === 'gemini-2.5-pro') {
    modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-pro'];
  } else if (configuredModel === 'gemini-2.0-flash-lite') {
    modelsToTry = ['gemini-2.0-flash-lite', 'gemini-2.5-flash'];
  } else {
    // Rely strictly on configuredModel (typically gemini-2.5-flash) and retries rather than falling back to pro
    modelsToTry = [configuredModel];
  }

  const method = req.stream ? 'streamGenerateContent?alt=sse' : 'generateContent';
  let response: Response | null = null;
  let lastError = '';

  for (const model of modelsToTry) {
    const body: Record<string, unknown> = { contents: req.contents };
    if (req.systemInstruction) {
      body.systemInstruction = { parts: [{ text: req.systemInstruction }] };
    }
    if (req.generationConfig) {
      body.generationConfig = req.generationConfig;
    }
    if (req.safetySettings) {
      body.safetySettings = req.safetySettings;
    }

    const maxRetries = 10;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const currentLocation = REGIONS_POOL[currentRegionIndex];
      const url = `https://${currentLocation}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${currentLocation}/publishers/google/models/${model}:${method}`;
      try {
        console.log(`[VERTEX] Attempting call with model "${model}" in region "${currentLocation}" (attempt ${attempt}/${maxRetries})...`);
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
          console.log(`[VERTEX] ✅ Call succeeded with model "${model}" in region "${currentLocation}".`);
          
          const durationMs = Date.now() - startTime;
          const clonedResponse = response.clone();
          
          // Track stats asynchronously in the background
          (async () => {
            try {
              const json = await clonedResponse.json();
              const usage = json.usageMetadata || {};
              const promptTokens = usage.promptTokenCount || 0;
              const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
              const actualTokens = promptTokens + candidatesTokens;
              
              // Report actual token usage back to the Token-Bucket
              handleSuccessfulRequest(actualTokens);

              const firstPart = req.contents?.[0]?.parts?.[0];
              const promptText = (firstPart && 'text' in firstPart) ? firstPart.text : '';
              await recordMetrics(req.task, model, durationMs, promptTokens, candidatesTokens, promptText);
            } catch (e) {
              console.warn('[VERTEX] Failed to parse usage metadata from response clone:', e);
              // Fallback: estimate tokens if parsing failed
              const est = TASK_TOKEN_ESTIMATES[req.task] || { inputTokens: 1000, outputTokens: 500 };
              handleSuccessfulRequest(est.inputTokens + est.outputTokens);

              const firstPart = req.contents?.[0]?.parts?.[0];
              const promptText = (firstPart && 'text' in firstPart) ? firstPart.text : '';
              await recordMetrics(req.task, model, durationMs, est.inputTokens, est.outputTokens, promptText);
            }
          })();

          return response;
        } else if (response.status === 429) {
          handleRateLimitError();
          const errText = await response.text();
          const oldRegion = REGIONS_POOL[currentRegionIndex];
          
          // Dynamic Regional Failover: Rotate region circular pool to bypass regional exhaustion
          currentRegionIndex = (currentRegionIndex + 1) % REGIONS_POOL.length;
          const newRegion = REGIONS_POOL[currentRegionIndex];
          
          lastError = `[VERTEX] Model "${model}" failed in region "${oldRegion}" (429 RESOURCE_EXHAUSTED). Rotating to region "${newRegion}". ${errText.slice(0, 300)}`;
          
          if (attempt < maxRetries) {
            // Apply Decorrelated Jitter: wait_time = random(0, min(cap, base * 2^attempt))
            const cap = 120000; // Max 120s
            const base = 4000;
            const temp = Math.min(cap, base * Math.pow(2, attempt));
            const jitterDelay = Math.floor(Math.random() * temp);

            console.warn(`${lastError}. Retrying in ${Math.ceil(jitterDelay / 1000)}s with Jitter...`);
            await new Promise(resolve => setTimeout(resolve, jitterDelay));
            continue;
          }
        } else {
          const errText = await response.text();
          lastError = `[VERTEX] Model "${model}" failed (${response.status}): ${errText.slice(0, 300)}`;
          console.warn(lastError);
          break;
        }
      } catch (e) {
        lastError = `[VERTEX] Model "${model}" exception: ${e}`;
        console.warn(lastError);
        if (attempt < maxRetries) {
          const cap = 120000;
          const base = 4000;
          const temp = Math.min(cap, base * Math.pow(2, attempt));
          const jitterDelay = Math.floor(Math.random() * temp);
          
          console.warn(`[VERTEX] Retrying in ${Math.ceil(jitterDelay / 1000)}s with Jitter after exception...`);
          await new Promise(resolve => setTimeout(resolve, jitterDelay));
          continue;
        }
        break;
      }
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
    } else if (task === 'course_translation' || task === 'batch_translate') {
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
  return !!(process.env.VERTEX_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS);
}
