import { AsyncLocalStorage } from 'async_hooks';

export const userCountryStorage = new AsyncLocalStorage<string>();
export const customCredentialsStorage = new AsyncLocalStorage<string>();

const PROJECT_ID = process.env.VERTEX_PROJECT_ID || 'openprimer-free';

// Configurable regional pool of endpoints to support regional routing and failover
const configuredRegionsStr = process.env.VERTEX_REGIONS_POOL;
const REGIONS_POOL = configuredRegionsStr 
  ? configuredRegionsStr.split(',').map(r => r.trim()).filter(Boolean)
  : [
      'global',
      process.env.VERTEX_LOCATION || 'us-central1',
      'europe-west1',
      'us-east4',
      'us-west1',
      'europe-west3',          // Frankfurt
      'europe-west4',          // Netherlands
      'us-east1',              // South Carolina
      'asia-northeast1',       // Tokyo
      'us-south1',             // Dallas
      'northamerica-northeast1', // Montreal
      'europe-west2',          // London
      'europe-southwest1',     // Madrid
    ];

// Plafonds maximums configurables ou valeurs par défaut conservatrices
export const MAX_RPM_CEILING = Number(process.env.VERTEX_MAX_RPM || 80);
export const MAX_TPM_CEILING = Number(process.env.VERTEX_MAX_TPM || 2000000);

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
  tokenPromise?: Promise<string | null>;
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

export let accounts: VertexAccount[] = [];
export let endpointStates: ProjectRegionState[] = [];
let isInitialized = false;
export const unsupportedModelRegions = new Set<string>();

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
  const directSA = process.env.VERTEX_SERVICE_ACCOUNT_JSON || process.env.VERTEX_SERVICE_ACCOUNT_BASE64;
  if (directSA) {
    try {
      let raw = directSA.trim();
      if (!raw.startsWith('{') && !raw.startsWith('[')) {
        raw = Buffer.from(raw, 'base64').toString('utf8');
      }
      const parsed = JSON.parse(raw);
      const effectiveProjectId = process.env.VERTEX_PROJECT_ID || parsed.project_id;
      if (parsed.project_id && !registeredProjectIds.has(effectiveProjectId)) {
        parsed.project_id = effectiveProjectId;
        loadedAccounts.push({
          projectId: effectiveProjectId,
          credentials: parsed as ServiceAccountCredentials,
          cachedToken: null,
          tokenExpiry: 0
        });
        registeredProjectIds.add(effectiveProjectId);
        console.log(`[VERTEX-POOL] Loaded project from VERTEX_SERVICE_ACCOUNT_JSON/BASE64 env (Project: ${effectiveProjectId})`);
      }
    } catch (e) {
      console.warn('[VERTEX-POOL] Failed to parse VERTEX_SERVICE_ACCOUNT_JSON/BASE64:', e);
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

  // If still no project but we have VERTEX_PROJECT_ID or NEXT_PUBLIC_GCP_PROJECT_ID, create gcloud_adc fallback
  if (loadedAccounts.length === 0) {
    const fallbackProjectId = process.env.VERTEX_PROJECT_ID || process.env.NEXT_PUBLIC_GCP_PROJECT_ID;
    if (fallbackProjectId) {
      loadedAccounts.push({
        projectId: fallbackProjectId,
        credentials: {
          type: 'gcloud_adc',
          project_id: fallbackProjectId,
          private_key_id: '',
          private_key: '',
          client_email: '',
          token_uri: ''
        },
        cachedToken: null,
        tokenExpiry: 0
      });
      registeredProjectIds.add(fallbackProjectId);
      console.log(`[VERTEX-POOL] Loaded project using gcloud ADC / OAuth token fallback (Project: ${fallbackProjectId})`);
    }
  }

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

  // Trigger background self-optimization of quotas for each account
  if (typeof window === 'undefined') {
    accounts.forEach(account => {
      optimizeAccountQuotasInBackground(account).catch(err => {
        console.warn(`[VERTEX-QUOTAS] Background optimization failed for project ${account.projectId}:`, err);
      });
    });
  }

  return accounts;
}

/**
 * Automatically fetch real-world GCP limits and request upgrades if they fall below desired values.
 * Grabs the GCP Cloud Quotas API, adjusts the rate-limiter, and registers automatic preference upgrades.
 */
export async function optimizeAccountQuotasInBackground(account: VertexAccount) {
  if (typeof window !== 'undefined') return;

  const projectId = account.projectId;
  const token = await getAccessTokenForAccount(account);
  if (!token) {
    console.warn(`[VERTEX-QUOTAS] Could not acquire OAuth token to optimize quotas for project: ${projectId}`);
    return;
  }

  // We optimize quotas for standard regional pools (us-central1, europe-west1)
  const regionsToCheck = ['us-central1', 'europe-west1'];
  const targetRpm = 120;

  for (const region of regionsToCheck) {
    try {
      // 1. Fetch current quota info via Google Cloud Quotas API
      const targetQuotaId = 'GenerateContentRequestsPerMinutePerProjectPerRegionPerBaseModel';
      const quotaUrl = `https://cloudquotas.googleapis.com/v1/projects/${projectId}/locations/global/services/aiplatform.googleapis.com/quotaInfos/${targetQuotaId}`;
      
      const res = await fetch(quotaUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(6000)
      });

      if (!res.ok) {
        // Log API missing / permission issues cleanly to console logs without disrupting services
        console.log(`[VERTEX-QUOTAS] Cloud Quotas API unavailable or permissions missing for project ${projectId} in ${region} (${res.status}). Using local fallback thresholds.`);
        continue;
      }

      const quotaData = await res.json() as any;
      let currentLimit = MAX_RPM_CEILING;

      // Extract limit safely from API structure
      if (quotaData.dimensionsInfos && Array.isArray(quotaData.dimensionsInfos)) {
        // Find dimensions matching our target region
        const regionalDims = quotaData.dimensionsInfos.filter((di: any) => {
          const dims = di.dimensions || {};
          return dims.region === region;
        });

        // 1. Try to find precise match for gemini-3.5-flash-lite
        let matchingDim = regionalDims.find((di: any) => di.dimensions?.base_model === 'gemini-3.5-flash-lite');

        // 2. Fallback to gemini-3.5-flash
        if (!matchingDim) {
          matchingDim = regionalDims.find((di: any) => di.dimensions?.base_model === 'gemini-3.5-flash');
        }

        // 3. Fallback to any regional dimension
        if (!matchingDim && regionalDims.length > 0) {
          matchingDim = regionalDims[0];
        }

        if (matchingDim) {
          const val = matchingDim.details?.value || 
                      matchingDim.applicableConfigs?.defaultLimit?.value || 
                      matchingDim.applicableConfigs?.grantedLimit?.value;
          if (val) {
            currentLimit = Number(val);
          }
        }
      } else if (quotaData.containerThresholds && Array.isArray(quotaData.containerThresholds)) {
        currentLimit = Number(quotaData.containerThresholds[0]?.value || MAX_RPM_CEILING);
      }

      console.log(`[VERTEX-QUOTAS] Project ${projectId} has current GCP quota of ${currentLimit} RPM for Gemini on ${region}`);

      // 2. Dynamic Local Limit Adaptation
      const matchingState = endpointStates.find(es => es.projectId === projectId && es.regionName === region);
      if (matchingState) {
        matchingState.rpmCapacity = currentLimit;
        console.log(`[VERTEX-QUOTAS] Dynamically adjusted local rate limiter for ${projectId}::${region} to ${currentLimit} RPM`);
      }

      // 3. Automated Remote Quota Upgrade Request
      if (currentLimit < targetRpm) {
        console.log(`[VERTEX-QUOTAS] Requesting automated quota upgrade to ${targetRpm} RPM for project ${projectId} in ${region}...`);
        
        const preferenceId = `op_gemini_rpm_${region}_${projectId.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
        const prefUrl = `https://cloudquotas.googleapis.com/v1/projects/${projectId}/locations/global/quotaPreferences?quotaPreferenceId=${preferenceId}`;

        const body = {
          quotaConfig: {
            preferredValue: targetRpm.toString()
          },
          service: "aiplatform.googleapis.com",
          quotaId: targetQuotaId,
          dimensions: {
            region: region,
            base_model: "gemini-3.5-flash"
          },
          justification: "Automated real-time scaling for OpenPrimer educational platform."
        };

        const postRes = await fetch(prefUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(6000)
        });

        if (postRes.ok) {
          const postData = await postRes.json();
          console.log(`[VERTEX-QUOTAS] Successfully submitted automatic quota preference for project ${projectId} in ${region} to raise limit to ${targetRpm} RPM. Status: ${postData.reconciling ? 'reconciling (pending)' : 'active (approved!)'}`);
          
          if (matchingState && !postData.reconciling) {
            matchingState.rpmCapacity = targetRpm;
          }
        } else {
          const postErr = await postRes.text();
          let isAlreadyExists = false;
          try {
            const errJson = JSON.parse(postErr);
            const statusStr = (errJson.error?.status || '').toUpperCase();
            const messageStr = (errJson.error?.message || '').toLowerCase();
            if (statusStr === 'ALREADY_EXISTS' || messageStr.includes('already exist') || messageStr.includes('already exists')) {
              isAlreadyExists = true;
            }
          } catch (_) {
            if (postErr.toLowerCase().includes('already exist') || postErr.toLowerCase().includes('already exists')) {
              isAlreadyExists = true;
            }
          }

          if (isAlreadyExists) {
            console.log(`[VERTEX-QUOTAS] Quota upgrade preference already submitted for project ${projectId} in ${region} (target: ${targetRpm} RPM).`);
          } else {
            console.warn(`[VERTEX-QUOTAS] Failed to auto-submit quota upgrade preference for project ${projectId} (${postRes.status}): ${postErr}`);
          }
        }
      }
    } catch (e: any) {
      console.warn(`[VERTEX-QUOTAS] Graceful fallback. Failed to process automatic quota detection for project ${projectId} in region ${region}: ${e?.message}`);
    }
  }
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

  if (account.tokenPromise) {
    return account.tokenPromise;
  }

  account.tokenPromise = (async () => {
    try {
      // 1. If explicit Service Account credentials with private key are provided, ALWAYS use JWT exchange
      if (account.credentials && account.credentials.private_key && account.credentials.client_email) {
        const jwt = await createJWT(account.credentials);
        const res = await fetch(account.credentials.token_uri || 'https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt
          })
        });

        if (res.ok) {
          const data = await res.json() as any;
          if (data.access_token) {
            account.cachedToken = data.access_token;
            account.tokenExpiry = Date.now() + ((data.expires_in || 3600) - 60) * 1000;
            console.log(`[VERTEX-POOL] ✅ OAuth2 token acquired via Service Account JWT for project "${account.projectId}".`);
            return account.cachedToken;
          }
        } else {
          const err = await res.text();
          console.warn(`[VERTEX-POOL] Failed to exchange JWT for token on project ${account.projectId}:`, err);
        }
      }

      // 2. Try GCP Instance Metadata Server (Cloud Run / GCP Serverless environment)
      try {
        const metaRes = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
          headers: { 'Metadata-Flavor': 'Google' },
          signal: AbortSignal.timeout(2000)
        });
        if (metaRes.ok) {
          const metaData = await metaRes.json() as any;
          if (metaData.access_token) {
            account.cachedToken = metaData.access_token;
            account.tokenExpiry = Date.now() + ((metaData.expires_in || 3600) - 60) * 1000;
            console.log(`[VERTEX-POOL] ✅ OAuth2 token acquired via GCP Metadata Server for project "${account.projectId}".`);
            return account.cachedToken;
          }
        }
      } catch (_) {
        // Not running on GCP Instance Metadata Server, proceed to gcloud CLI
      }

      if (account.credentials.type === 'gcloud_adc' || !account.credentials.private_key) {
        if (typeof window === 'undefined') {
          try {
            const { execSync } = await import('child_process');
            const token = execSync(`gcloud auth print-access-token --project=${account.projectId}`).toString().trim();
            if (token && token.startsWith('ya29.')) {
              account.cachedToken = token;
              account.tokenExpiry = Date.now() + (45 * 60 * 1000);
              console.log(`[VERTEX-POOL] ✅ OAuth2 token acquired via gcloud CLI for project "${account.projectId}".`);
              return account.cachedToken;
            }
          } catch (e) {
            console.warn(`[VERTEX-POOL] Failed to acquire gcloud CLI access token for project "${account.projectId}":`, e);
          }
        }
        return null;
      }

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

        // Fallback to gcloud CLI token if available
        if (typeof window === 'undefined') {
          try {
            const { execSync } = await import('child_process');
            const token = execSync(`gcloud auth print-access-token --project=${account.projectId}`).toString().trim();
            if (token && token.startsWith('ya29.')) {
              account.cachedToken = token;
              account.tokenExpiry = Date.now() + (45 * 60 * 1000);
              console.log(`[VERTEX-POOL] ✅ Fallback OAuth2 token acquired via gcloud CLI for project "${account.projectId}".`);
              return account.cachedToken;
            }
          } catch (_) {}
        }
        return null;
      }

      const data = await res.json();
      account.cachedToken = data.access_token;
      const expiresIn = data.expires_in || 3600;
      account.tokenExpiry = Date.now() + (expiresIn - 60) * 1000;
      console.log(`[VERTEX-POOL] ✅ OAuth2 token acquired successfully for project "${account.projectId}".`);
      return account.cachedToken;
    } catch (e) {
      console.error(`[VERTEX-POOL] Exception during token acquisition for project "${account.projectId}":`, e);
      return null;
    } finally {
      account.tokenPromise = undefined;
    }
  })();

  return account.tokenPromise;
}

