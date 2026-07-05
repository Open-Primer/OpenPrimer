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
export const customCredentialsStorage = new AsyncLocalStorage<string>();

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

// Plafonds maximums configurables ou valeurs par défaut conservatrices
const MAX_RPM_CEILING = Number(process.env.VERTEX_MAX_RPM || 60);
const MAX_TPM_CEILING = Number(process.env.VERTEX_MAX_TPM || 1000000);

export interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  token_uri: string;
}

export interface VertexAccount {
  projectId: string;
  credentials: ServiceAccountCredentials;
  cachedToken: string | null;
  tokenExpiry: number;
}

export interface ProjectRegionState {
  projectId: string;
  regionName: string;
  rpmCapacity: number;
  tpmCapacity: number;
  requestHistory: { timestamp: number; tokens: number }[];
  last429Time: number;
}

// ─────────────────────────────────────────────────────────────────
// MULTI-PROJECT POOL INITIALIZATION & AUTO-DISCOVERY
// ─────────────────────────────────────────────────────────────────

let accounts: VertexAccount[] = [];
let endpointStates: ProjectRegionState[] = [];
let isInitialized = false;

/**
 * Initialize/discover GCP Service Accounts from local secrets folder and environment variables.
 * Automatically de-duplicates by project_id.
 */
export async function initializeAccounts(forceReload = false): Promise<VertexAccount[]> {
  if (isInitialized && !forceReload) {
    return accounts;
  }

  const loadedAccounts: VertexAccount[] = [];
  const registeredProjectIds = new Set<string>();

  // 1. Check if there are request-scoped custom hot-swap credentials in the AsyncLocalStorage
  const customCredsStr = customCredentialsStorage.getStore();
  if (customCredsStr && customCredsStr.trim()) {
    try {
      const trimmed = customCredsStr.trim();
      if (trimmed.startsWith('[')) {
        const parsedList = JSON.parse(trimmed) as any[];
        parsedList.forEach((parsed, index) => {
          if (parsed.project_id && parsed.client_email && parsed.private_key) {
            if (!registeredProjectIds.has(parsed.project_id)) {
              loadedAccounts.push({
                projectId: parsed.project_id,
                credentials: parsed as ServiceAccountCredentials,
                cachedToken: null,
                tokenExpiry: 0
              });
              registeredProjectIds.add(parsed.project_id);
            }
          }
        });
      } else if (trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        if (parsed.project_id && parsed.client_email && parsed.private_key) {
          if (!registeredProjectIds.has(parsed.project_id)) {
            loadedAccounts.push({
              projectId: parsed.project_id,
              credentials: parsed as ServiceAccountCredentials,
              cachedToken: null,
              tokenExpiry: 0
            });
            registeredProjectIds.add(parsed.project_id);
          }
        }
      }
    } catch (e) {
      console.warn('[VERTEX-POOL] Failed to parse custom context credentials:', e);
    }
  }

  // 2. Scan secrets directory for service account JSON files
  if (typeof window === 'undefined') {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const secretsDir = path.resolve(process.cwd(), 'secrets');
      if (fs.existsSync(secretsDir)) {
        const files = fs.readdirSync(secretsDir);
        for (const file of files) {
          if (file.endsWith('.json') && !file.startsWith('github')) {
            const filePath = path.join(secretsDir, file);
            try {
              const content = fs.readFileSync(filePath, 'utf8');
              const parsed = JSON.parse(content);
              if (parsed.project_id && parsed.client_email && parsed.private_key) {
                if (!registeredProjectIds.has(parsed.project_id)) {
                  loadedAccounts.push({
                    projectId: parsed.project_id,
                    credentials: parsed as ServiceAccountCredentials,
                    cachedToken: null,
                    tokenExpiry: 0
                  });
                  registeredProjectIds.add(parsed.project_id);
                  console.log(`[VERTEX-POOL] Auto-discovered key: ${file} (Project: ${parsed.project_id})`);
                }
              }
            } catch (e) {
              // Ignore non-SA json files
            }
          }
        }
      }
    } catch (err) {
      console.warn('[VERTEX-POOL] Error scanning secrets directory:', err);
    }
  }

  // 3. Fallback/Append from direct environment variables
  const directSA = process.env.VERTEX_SERVICE_ACCOUNT_JSON;
  if (directSA) {
    try {
      const parsed = JSON.parse(directSA);
      if (parsed.project_id && !registeredProjectIds.has(parsed.project_id)) {
        loadedAccounts.push({
          projectId: parsed.project_id,
          credentials: parsed as ServiceAccountCredentials,
          cachedToken: null,
          tokenExpiry: 0
        });
        registeredProjectIds.add(parsed.project_id);
        console.log(`[VERTEX-POOL] Loaded project from VERTEX_SERVICE_ACCOUNT_JSON env (Project: ${parsed.project_id})`);
      }
    } catch (e) {
      console.warn('[VERTEX-POOL] Failed to parse VERTEX_SERVICE_ACCOUNT_JSON:', e);
    }
  }

  const googleAppCredsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (googleAppCredsPath) {
    try {
      let parsedSA: ServiceAccountCredentials | null = null;
      if (googleAppCredsPath.trim().startsWith('{') || googleAppCredsPath.trim().startsWith('[')) {
        parsedSA = JSON.parse(googleAppCredsPath) as ServiceAccountCredentials;
      } else if (typeof window === 'undefined') {
        const fs = await import('fs');
        if (fs.existsSync(googleAppCredsPath)) {
          const raw = fs.readFileSync(googleAppCredsPath, 'utf8');
          parsedSA = JSON.parse(raw) as ServiceAccountCredentials;
        }
      }
      if (parsedSA && parsedSA.project_id && !registeredProjectIds.has(parsedSA.project_id)) {
        loadedAccounts.push({
          projectId: parsedSA.project_id,
          credentials: parsedSA,
          cachedToken: null,
          tokenExpiry: 0
        });
        registeredProjectIds.add(parsedSA.project_id);
        console.log(`[VERTEX-POOL] Loaded project from GOOGLE_APPLICATION_CREDENTIALS (Project: ${parsedSA.project_id})`);
      }
    } catch (e) {
      console.warn('[VERTEX-POOL] Failed to parse GOOGLE_APPLICATION_CREDENTIALS:', e);
    }
  }

  // If still no project but we have VERTEX_PROJECT_ID, create a pseudo-credentials or warning
  accounts = loadedAccounts;

  // Re-build ProjectRegionState endpointStates
  // Keep previous states to preserve request history & cooldowns if reload is forced
  const oldStatesMap = new Map<string, ProjectRegionState>();
  endpointStates.forEach(es => {
    oldStatesMap.set(`${es.projectId}::${es.regionName}`, es);
  });

  const newStates: ProjectRegionState[] = [];
  accounts.forEach(account => {
    REGIONS_POOL.forEach(regionName => {
      const key = `${account.projectId}::${regionName}`;
      const existing = oldStatesMap.get(key);
      if (existing) {
        newStates.push(existing);
      } else {
        newStates.push({
          projectId: account.projectId,
          regionName,
          rpmCapacity: MAX_RPM_CEILING,
          tpmCapacity: MAX_TPM_CEILING,
          requestHistory: [],
          last429Time: 0
        });
      }
    });
  });

  endpointStates = newStates;
  isInitialized = true;

  return accounts;
}

// ─────────────────────────────────────────────────────────────────
// ADAPTIVE RATE LIMITER — Per-Project-Per-Region Token Bucket
// ─────────────────────────────────────────────────────────────────

function cleanEndpointHistory(endpoint: ProjectRegionState, now: number) {
  const cutoff = now - 60000;
  while (endpoint.requestHistory.length > 0 && endpoint.requestHistory[0].timestamp < cutoff) {
    endpoint.requestHistory.shift();
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
 * Acquire a healthy Project + Region endpoint before making an API call.
 * Uses smart load balancing across all configured accounts and locations.
 */
async function acquireEndpointAndRateLimitSlot(estimatedTokens: number, userCountry?: string): Promise<{ account: VertexAccount; endpoint: ProjectRegionState }> {
  const COOLDOWN_MS = 15000; // 15s cooldown on 429 errors

  await initializeAccounts();

  if (accounts.length === 0) {
    throw new Error('[VERTEX-POOL] No active service accounts configured.');
  }

  while (true) {
    const now = Date.now();
    const candidates: { account: VertexAccount; endpoint: ProjectRegionState }[] = [];
    const waitTimes: { endpoint: ProjectRegionState; waitMs: number }[] = [];

    // Filter endpoints based on Geo-IP
    let filteredEndpoints = endpointStates;
    
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
      // Graceful fallback outside Next.js request context
    }
    
    const resolvedCountry = userCountry || contextCountry || requestCountry;

    if (resolvedCountry) {
      const upperCountry = resolvedCountry.trim().toUpperCase();
      if (EU_COUNTRIES.has(upperCountry)) {
        filteredEndpoints = endpointStates.filter(e => e.regionName.startsWith('europe-'));
      } else if (['US', 'CA', 'MX'].includes(upperCountry)) {
        filteredEndpoints = endpointStates.filter(e => e.regionName.startsWith('us-'));
      } else if (['CN', 'JP', 'KR', 'SG', 'HK', 'TW', 'IN'].includes(upperCountry)) {
        filteredEndpoints = endpointStates.filter(e => e.regionName.startsWith('asia-') || e.regionName.startsWith('australia-'));
      }
      
      // Fallback: if our filtered pool is empty, fallback to full pool
      if (filteredEndpoints.length === 0) {
        filteredEndpoints = endpointStates;
      }
    }

    for (const endpoint of filteredEndpoints) {
      cleanEndpointHistory(endpoint, now);

      const isCoolingDown = (now - endpoint.last429Time) < COOLDOWN_MS;
      const currentRPM = endpoint.requestHistory.length;
      const currentTPM = endpoint.requestHistory.reduce((sum, r) => sum + r.tokens, 0);

      const hasRPMCapacity = (currentRPM + 1) <= endpoint.rpmCapacity;
      const hasTPMCapacity = (currentTPM + estimatedTokens) <= endpoint.tpmCapacity;

      // Find the corresponding account object
      const account = accounts.find(a => a.projectId === endpoint.projectId);
      if (!account) continue;

      if (!isCoolingDown && hasRPMCapacity && hasTPMCapacity) {
        candidates.push({ account, endpoint });
      } else {
        // Calculate the wait time for this endpoint to recover capacity
        let waitMs = 0;
        if (isCoolingDown) {
          waitMs = Math.max(waitMs, endpoint.last429Time + COOLDOWN_MS - now);
        }
        if (!hasRPMCapacity && endpoint.requestHistory.length > 0) {
          const oldest = endpoint.requestHistory[0];
          waitMs = Math.max(waitMs, oldest.timestamp + 60000 - now);
        }
        if (!hasTPMCapacity && endpoint.requestHistory.length > 0) {
          let cumulativeReleased = 0;
          let tpmWait = 1000;
          for (const record of endpoint.requestHistory) {
            cumulativeReleased += record.tokens;
            if (currentTPM - cumulativeReleased + estimatedTokens <= endpoint.tpmCapacity) {
              tpmWait = record.timestamp + 60000 - now;
              break;
            }
          }
          waitMs = Math.max(waitMs, tpmWait);
        }
        waitTimes.push({ endpoint, waitMs });
      }
    }

    if (candidates.length > 0) {
      // Pick one AT RANDOM among available healthy candidates to avoid concurrency locksteps
      const selectedIndex = Math.floor(Math.random() * candidates.length);
      const selected = candidates[selectedIndex];

      // Reserve slot
      selected.endpoint.requestHistory.push({
        timestamp: Date.now(),
        tokens: estimatedTokens
      });

      return selected;
    }

    // No endpoints are fully available, wait for the one that becomes available first
    if (waitTimes.length > 0) {
      waitTimes.sort((a, b) => a.waitMs - b.waitMs);
      const bestWait = waitTimes[0];
      const waitMs = Math.max(1000, bestWait.waitMs); // Floor to at least 1s

      console.log(`[RATE LIMITER] All Vertex endpoints busy. Throttling for ${Math.ceil(waitMs / 1000)}s (waiting for project: "${bestWait.endpoint.projectId}", region: "${bestWait.endpoint.regionName}")...`);
      await new Promise(resolve => setTimeout(resolve, waitMs));
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

function removeRequestFromEndpoint(endpoint: ProjectRegionState) {
  if (endpoint.requestHistory.length > 0) {
    endpoint.requestHistory.pop();
  }
}

function handleSuccessfulEndpointRequest(endpoint: ProjectRegionState, actualTokens: number) {
  if (endpoint.requestHistory.length > 0) {
    endpoint.requestHistory[endpoint.requestHistory.length - 1].tokens = actualTokens;
  }
  endpoint.rpmCapacity = Math.min(MAX_RPM_CEILING, endpoint.rpmCapacity + 1);
  endpoint.tpmCapacity = Math.min(MAX_TPM_CEILING, endpoint.tpmCapacity + 10000);
}

function handleEndpointRateLimitError(endpoint: ProjectRegionState) {
  endpoint.last429Time = Date.now();
  endpoint.rpmCapacity = Math.min(MAX_RPM_CEILING, Math.max(1, Math.floor(endpoint.rpmCapacity * 0.8)));
  endpoint.tpmCapacity = Math.min(MAX_TPM_CEILING, Math.max(10000, Math.floor(endpoint.tpmCapacity * 0.8)));
  console.warn(`[RATE LIMITER] ⚠️ 429 Resource Exhausted on project "${endpoint.projectId}" in region "${endpoint.regionName}". Initiating 15s cooldown and adapting limits to: RPM ${endpoint.rpmCapacity}, TPM ${endpoint.tpmCapacity}`);
}

// ─────────────────────────────────────────────────────────────────
// JWT & OAUTH2 GOOGLE AUTHENTICATION
// ─────────────────────────────────────────────────────────────────

async function createJWT(creds: ServiceAccountCredentials): Promise<string> {
  const crypto = await import('crypto');
  
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    iss: creds.client_email,
    sub: creds.client_email,
    aud: creds.token_uri || 'https://oauth2.googleapis.com/token',
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
 * Obtain a short-lived OAuth2 access token for a specific GCP Service Account.
 */
export async function getAccessTokenForAccount(account: VertexAccount): Promise<string | null> {
  if (account.cachedToken && Date.now() < account.tokenExpiry) {
    return account.cachedToken;
  }

  try {
    const jwt = await createJWT(account.credentials);
    const res = await fetch(account.credentials.token_uri || 'https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[VERTEX-POOL] Token exchange failed for project "${account.projectId}":`, err);
      return null;
    }

    const data = await res.json();
    account.cachedToken = data.access_token;
    account.tokenExpiry = Date.now() + 50 * 60 * 1000; // Cache for 50 minutes
    console.log(`[VERTEX-POOL] ✅ OAuth2 token acquired successfully for project "${account.projectId}".`);
    return account.cachedToken;
  } catch (e) {
    console.error(`[VERTEX-POOL] Exception during token acquisition for project "${account.projectId}":`, e);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────
// UNIFIED VERTEX AI CALL ROUTER
// ─────────────────────────────────────────────────────────────────

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

  // Initialize and check pool
  await initializeAccounts();
  if (accounts.length === 0) {
    console.warn('[VERTEX-POOL] Cannot make Vertex AI call: no service accounts configured.');
    return null;
  }

  const configuredModel = TASK_MODELS[req.task];
  
  // Decide candidate models to try
  let modelsToTry: string[] = [configuredModel];
  if (configuredModel === 'gemini-2.5-pro') {
    modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-pro'];
  } else if (configuredModel === 'gemini-2.0-flash-lite') {
    modelsToTry = ['gemini-2.0-flash-lite', 'gemini-2.5-flash'];
  } else {
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
      let selected;
      try {
        selected = await acquireEndpointAndRateLimitSlot(estimatedTokens, req.userCountry);
      } catch (e) {
        console.error('[VERTEX-POOL] Failed to acquire endpoint:', e);
        return null;
      }
      
      const { account, endpoint } = selected;
      const token = await getAccessTokenForAccount(account);
      if (!token) {
        removeRequestFromEndpoint(endpoint);
        continue;
      }

      const currentLocation = endpoint.regionName;
      const currentProjectId = account.projectId;
      const url = `https://${currentLocation}-aiplatform.googleapis.com/v1/projects/${currentProjectId}/locations/${currentLocation}/publishers/google/models/${model}:${method}`;

      try {
        console.log(`[VERTEX-POOL] Attempting call with model "${model}" in region "${currentLocation}" using project "${currentProjectId}" (attempt ${attempt}/${maxRetries})...`);
        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.warn(`[VERTEX-POOL] ⚠️ Request timed out on project "${currentProjectId}", region "${currentLocation}" after 180s. Aborting...`);
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
          console.log(`[VERTEX-POOL] ✅ Call succeeded with model "${model}" in region "${currentLocation}" using project "${currentProjectId}".`);
          
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
              handleSuccessfulEndpointRequest(endpoint, actualTokens);

              const firstPart = req.contents?.[0]?.parts?.[0];
              const promptText = (firstPart && 'text' in firstPart) ? firstPart.text : '';
              await recordMetrics(req.task, model, durationMs, promptTokens, candidatesTokens, promptText);
            } catch (e) {
              console.warn('[VERTEX-POOL] Failed to parse usage metadata from response clone:', e);
              // Fallback: estimate tokens if parsing failed
              const est = TASK_TOKEN_ESTIMATES[req.task] || { inputTokens: 1000, outputTokens: 500 };
              handleSuccessfulEndpointRequest(endpoint, est.inputTokens + est.outputTokens);

              const firstPart = req.contents?.[0]?.parts?.[0];
              const promptText = (firstPart && 'text' in firstPart) ? firstPart.text : '';
              await recordMetrics(req.task, model, durationMs, est.inputTokens, est.outputTokens, promptText);
            }
          })();

          return response;
        } else if (response.status === 429) {
          handleEndpointRateLimitError(endpoint);
          removeRequestFromEndpoint(endpoint);

          const errText = await response.text();
          lastError = `[VERTEX-POOL] Model "${model}" failed on project "${currentProjectId}" in region "${currentLocation}" (429 RESOURCE_EXHAUSTED). ${errText.slice(0, 300)}`;
          
          if (attempt < maxRetries) {
            const jitterDelay = Math.floor(Math.random() * 2000);
            console.warn(`${lastError}. Failing over immediately. Jitter delay: ${jitterDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, jitterDelay));
            continue;
          }
        } else {
          removeRequestFromEndpoint(endpoint);
          const errText = await response.text();
          lastError = `[VERTEX-POOL] Model "${model}" failed (${response.status}) on project "${currentProjectId}" in region "${currentLocation}": ${errText.slice(0, 300)}`;
          console.warn(lastError);
          break; // Try next model candidate
        }
      } catch (e) {
        removeRequestFromEndpoint(endpoint);
        lastError = `[VERTEX-POOL] Model "${model}" exception on project "${currentProjectId}" in region "${currentLocation}": ${e}`;
        console.warn(lastError);
        if (attempt < maxRetries) {
          const jitterDelay = Math.floor(Math.random() * 2000);
          console.warn(`[VERTEX-POOL] Retrying after exception. Jitter delay: ${jitterDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, jitterDelay));
          continue;
        }
        break; // Try next model candidate
      }
    }
  }

  console.error(`[VERTEX-POOL] All model candidates failed. Last error: ${lastError}`);
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
    const pricing = MODEL_PRICING[model as ModelId];
    let cost = 0;
    if (pricing) {
      cost = (promptTokens / 1_000_000) * pricing.inputPer1M 
           + (candidatesTokens / 1_000_000) * pricing.outputPer1M;
    } else {
      cost = (promptTokens / 1_000_000) * 0.075 + (candidatesTokens / 1_000_000) * 0.30;
    }

    let metricId = 'tutor';
    if (task === 'course_generation') {
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
  if (process.env.VERTEX_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return true;
  }
  // Check if any json file exists in the secrets folder
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const secretsDir = path.resolve(process.cwd(), 'secrets');
      if (fs.existsSync(secretsDir)) {
        const files = fs.readdirSync(secretsDir);
        const hasSa = files.some((f: string) => f.endsWith('.json') && !f.startsWith('github'));
        if (hasSa) return true;
      }
    } catch {
      // Ignored
    }
  }
  return false;
}

