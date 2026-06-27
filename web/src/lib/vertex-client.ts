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

import { AsyncLocalStorage } from 'async_hooks';
import { ModelId, TASK_MODELS, MODEL_PRICING, TASK_TOKEN_ESTIMATES } from './ai-config';

export const userCountryStorage = new AsyncLocalStorage<string>();


const PROJECT_ID = process.env.VERTEX_PROJECT_ID || 'openprimer-free';

// Configurable regional pool of endpoints to support regional routing and failover
const configuredRegionsStr = process.env.VERTEX_REGIONS_POOL;
const REGIONS_POOL = configuredRegionsStr 
  ? configuredRegionsStr.split(',').map(r => r.trim()).filter(Boolean)
  : [
      process.env.VERTEX_LOCATION || 'us-central1',
      'europe-west1',
      'us-east4',
      'us-west1',
      'europe-west3', // Frankfurt
      'europe-west4', // Netherlands
      'us-east1',     // South Carolina
      'asia-northeast1' // Tokyo
    ];

// ─────────────────────────────────────────────────────────────────
// ADAPTIVE RATE LIMITER — Per-Region Token Bucket with RPM + TPM Support
// ─────────────────────────────────────────────────────────────────
// Monitors and regulates both Requests Per Minute (RPM) and
// Tokens Per Minute (TPM) locally for each region to prevent hitting GCP 429s.
// Adapts dynamically (congestion control) on a per-region basis when a 429 is encountered.

export interface RegionState {
  name: string;
  rpmCapacity: number;
  tpmCapacity: number;
  requestHistory: { timestamp: number; tokens: number }[];
  last429Time: number;
}

// Plafonds maximums configurables ou valeurs par défaut conservatrices
const MAX_RPM_CEILING = Number(process.env.VERTEX_MAX_RPM || 60);
const MAX_TPM_CEILING = Number(process.env.VERTEX_MAX_TPM || 1000000);

const regionStates: RegionState[] = REGIONS_POOL.map(name => ({
  name,
  rpmCapacity: MAX_RPM_CEILING,
  tpmCapacity: MAX_TPM_CEILING,
  requestHistory: [],
  last429Time: 0
}));

function cleanRegionHistory(region: RegionState, now: number) {
  const cutoff = now - 60000;
  while (region.requestHistory.length > 0 && region.requestHistory[0].timestamp < cutoff) {
    region.requestHistory.shift();
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

const EU_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH', 'NO', 'IS', 'LI'
]);

/**
 * Acquire regional slot before making a Vertex AI call.
 * Uses an adaptive smart load balancer (random choice among available healthy regions).
 * Blocks if all regions are temporarily busy, waiting for the soonest available slot.
 * Supports optional userCountry for Geo-IP based data residency routing.
 */
async function acquireRegionAndRateLimitSlot(estimatedTokens: number, userCountry?: string): Promise<RegionState> {
  const COOLDOWN_MS = 15000; // 15s cooldown on 429 errors

  while (true) {
    const now = Date.now();
    const candidates: RegionState[] = [];
    const waitTimes: { region: RegionState; waitMs: number }[] = [];

    // Filter regions based on user's geographic location (Geo-IP)
    let filteredRegions = regionStates;
    
    // Resolve user country through the triple fallback strategy
    const contextCountry = userCountryStorage.getStore();
    let requestCountry: string | undefined = undefined;
    try {
      const headersFn = require('next/headers').headers;
      if (headersFn) {
        const reqHeaders = headersFn();
        requestCountry = reqHeaders.get('x-vercel-ip-country') || reqHeaders.get('cf-ipcountry') || undefined;
      }
    } catch {
      // Graceful fallback outside Next.js request context (e.g. CLI, async cron task runner)
    }
    
    const resolvedCountry = userCountry || contextCountry || requestCountry;

    if (resolvedCountry) {
      const upperCountry = resolvedCountry.trim().toUpperCase();
      if (EU_COUNTRIES.has(upperCountry)) {
        filteredRegions = regionStates.filter(r => r.name.startsWith('europe-'));
      } else if (['US', 'CA', 'MX'].includes(upperCountry)) {
        filteredRegions = regionStates.filter(r => r.name.startsWith('us-'));
      } else if (['CN', 'JP', 'KR', 'SG', 'HK', 'TW', 'IN'].includes(upperCountry)) {
        filteredRegions = regionStates.filter(r => r.name.startsWith('asia-') || r.name.startsWith('australia-'));
      }
      
      // Fallback: if our filtered pool is empty (e.g. no europe- region in pool), fallback to full pool
      if (filteredRegions.length === 0) {
        filteredRegions = regionStates;
      }
    }

    for (const region of filteredRegions) {
      cleanRegionHistory(region, now);

      const isCoolingDown = (now - region.last429Time) < COOLDOWN_MS;
      const currentRPM = region.requestHistory.length;
      const currentTPM = region.requestHistory.reduce((sum, r) => sum + r.tokens, 0);

      const hasRPMCapacity = (currentRPM + 1) <= region.rpmCapacity;
      const hasTPMCapacity = (currentTPM + estimatedTokens) <= region.tpmCapacity;

      if (!isCoolingDown && hasRPMCapacity && hasTPMCapacity) {
        candidates.push(region);
      } else {
        // Calculate the wait time for this region to recover capacity
        let waitMs = 0;
        if (isCoolingDown) {
          waitMs = Math.max(waitMs, region.last429Time + COOLDOWN_MS - now);
        }
        if (!hasRPMCapacity && region.requestHistory.length > 0) {
          const oldest = region.requestHistory[0];
          waitMs = Math.max(waitMs, oldest.timestamp + 60000 - now);
        }
        if (!hasTPMCapacity && region.requestHistory.length > 0) {
          let cumulativeReleased = 0;
          let tpmWait = 1000;
          for (const record of region.requestHistory) {
            cumulativeReleased += record.tokens;
            if (currentTPM - cumulativeReleased + estimatedTokens <= region.tpmCapacity) {
              tpmWait = record.timestamp + 60000 - now;
              break;
            }
          }
          waitMs = Math.max(waitMs, tpmWait);
        }
        waitTimes.push({ region, waitMs });
      }
    }

    if (candidates.length > 0) {
      // Pick one AT RANDOM among available healthy candidates to avoid concurrency locksteps
      const selectedIndex = Math.floor(Math.random() * candidates.length);
      const selectedRegion = candidates[selectedIndex];

      // Reserve slot
      selectedRegion.requestHistory.push({
        timestamp: Date.now(),
        tokens: estimatedTokens
      });

      return selectedRegion;
    }

    // No regions are fully available, wait for the one that becomes available first
    if (waitTimes.length > 0) {
      waitTimes.sort((a, b) => a.waitMs - b.waitMs);
      const bestWait = waitTimes[0];
      const waitMs = Math.max(1000, bestWait.waitMs); // Floor to at least 1s

      console.log(`[RATE LIMITER] All Vertex regions busy. Throttling for ${Math.ceil(waitMs / 1000)}s (waiting for ${bestWait.region.name})...`);
      await new Promise(resolve => setTimeout(resolve, waitMs));
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Remove request reservation from regional history if the call fails.
 */
function removeRequestFromRegion(region: RegionState) {
  if (region.requestHistory.length > 0) {
    region.requestHistory.pop();
  }
}

/**
 * Success handler: Updates estimate with actual token count and slowly
 * increases capacity ceilings for that specific region (AIMD - Additive Increase).
 */
function handleSuccessfulRequest(region: RegionState, actualTokens: number) {
  if (region.requestHistory.length > 0) {
    region.requestHistory[region.requestHistory.length - 1].tokens = actualTokens;
  }
  region.rpmCapacity = Math.min(MAX_RPM_CEILING, region.rpmCapacity + 1);
  region.tpmCapacity = Math.min(MAX_TPM_CEILING, region.tpmCapacity + 10000);
}

/**
 * 429 Rate Limit handler: Shrinks specific region capacity by 20% (AIMD - Multiplicative Decrease) and cools it down.
 */
function handleRateLimitError(region: RegionState) {
  region.last429Time = Date.now();
  region.rpmCapacity = Math.min(MAX_RPM_CEILING, Math.max(1, Math.floor(region.rpmCapacity * 0.8)));
  region.tpmCapacity = Math.min(MAX_TPM_CEILING, Math.max(10000, Math.floor(region.tpmCapacity * 0.8)));
  console.warn(`[RATE LIMITER] ⚠️ 429 Resource Exhausted on region "${region.name}". Initiating 15s cooldown and adapting limits to: RPM ${region.rpmCapacity}, TPM ${region.tpmCapacity}`);
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
  userCountry?: string; // Optional user country for geo-IP based regional routing
}

/**
 * Make a generateContent or streamGenerateContent call to Vertex AI.
 * Returns the raw fetch Response so callers can handle streaming or JSON.
 */
export async function callVertexAI(req: VertexRequest): Promise<Response | null> {
  const estimatedTokens = estimateRequestTokens(req);

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
      // 1. Acquire slot for a healthy region
      const region = await acquireRegionAndRateLimitSlot(estimatedTokens, req.userCountry);
      const currentLocation = region.name;
      const url = `https://${currentLocation}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${currentLocation}/publishers/google/models/${model}:${method}`;

      try {
        console.log(`[VERTEX] Attempting call with model "${model}" in region "${currentLocation}" (attempt ${attempt}/${maxRetries})...`);
        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.warn(`[VERTEX] ⚠️ Request timed out in region "${currentLocation}" after 180s. Aborting...`);
          controller.abort();
        }, 180000);

        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

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
              handleSuccessfulRequest(region, actualTokens);

              const firstPart = req.contents?.[0]?.parts?.[0];
              const promptText = (firstPart && 'text' in firstPart) ? firstPart.text : '';
              await recordMetrics(req.task, model, durationMs, promptTokens, candidatesTokens, promptText);
            } catch (e) {
              console.warn('[VERTEX] Failed to parse usage metadata from response clone:', e);
              // Fallback: estimate tokens if parsing failed
              const est = TASK_TOKEN_ESTIMATES[req.task] || { inputTokens: 1000, outputTokens: 500 };
              handleSuccessfulRequest(region, est.inputTokens + est.outputTokens);

              const firstPart = req.contents?.[0]?.parts?.[0];
              const promptText = (firstPart && 'text' in firstPart) ? firstPart.text : '';
              await recordMetrics(req.task, model, durationMs, est.inputTokens, est.outputTokens, promptText);
            }
          })();

          return response;
        } else if (response.status === 429) {
          handleRateLimitError(region);
          removeRequestFromRegion(region); // Free reservation

          const errText = await response.text();
          lastError = `[VERTEX] Model "${model}" failed in region "${currentLocation}" (429 RESOURCE_EXHAUSTED). ${errText.slice(0, 300)}`;
          
          if (attempt < maxRetries) {
            // Add a short randomized jitter before retrying on a different region
            const jitterDelay = Math.floor(Math.random() * 2000); // 0-2 seconds jitter
            console.warn(`${lastError}. Failing over immediately. Jitter delay: ${jitterDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, jitterDelay));
            continue;
          }
        } else {
          removeRequestFromRegion(region); // Free reservation
          const errText = await response.text();
          lastError = `[VERTEX] Model "${model}" failed (${response.status}) in region "${currentLocation}": ${errText.slice(0, 300)}`;
          console.warn(lastError);
          break; // Fatal error on this model, try next model candidate if any
        }
      } catch (e) {
        removeRequestFromRegion(region); // Free reservation
        lastError = `[VERTEX] Model "${model}" exception in region "${currentLocation}": ${e}`;
        console.warn(lastError);
        if (attempt < maxRetries) {
          const jitterDelay = Math.floor(Math.random() * 2000);
          console.warn(`[VERTEX] Retrying after exception. Jitter delay: ${jitterDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, jitterDelay));
          continue;
        }
        break; // Exception, try next model candidate if any
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
