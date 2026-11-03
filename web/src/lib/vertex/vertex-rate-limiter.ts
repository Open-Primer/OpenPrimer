import {
  userCountryStorage,
  MAX_RPM_CEILING,
  MAX_TPM_CEILING,
  VertexAccount,
  ProjectRegionState,
  accounts,
  endpointStates,
  unsupportedModelRegions,
  initializeAccounts,
} from './vertex-accounts';
import type { VertexRequest } from '../vertex-client';

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
export function estimateRequestTokens(req: VertexRequest): number {
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
export async function acquireEndpointAndRateLimitSlot(
  estimatedTokens: number,
  userCountry?: string,
  model?: string
): Promise<{ account: VertexAccount; endpoint: ProjectRegionState }> {
  const COOLDOWN_MS = 15000; // 15s cooldown on 429 errors

  await initializeAccounts();

  if (accounts.length === 0) {
    throw new Error('[VERTEX-POOL] No active service accounts configured.');
  }

  while (true) {
    const now = Date.now();
    const candidates: { account: VertexAccount; endpoint: ProjectRegionState }[] = [];
    const waitTimes: { endpoint: ProjectRegionState; waitMs: number }[] = [];

    // Filter endpoints based on model compatibility and Geo-IP
    let filteredEndpoints = endpointStates;

    // 1. Exclude dynamically discovered 404 regions for this model
    if (model) {
      filteredEndpoints = filteredEndpoints.filter(e => !unsupportedModelRegions.has(`${model}::${e.regionName}`));
      
      // 2. Vertex AI Deployments: gemini-3.5 models are globally deployed on 'global' endpoint
      if (model.includes('3.5') || model.includes('flash-lite')) {
        const globalEndpoints = filteredEndpoints.filter(e => e.regionName === 'global');
        if (globalEndpoints.length > 0) {
          filteredEndpoints = globalEndpoints;
        }
      }
    }
    
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

    if (resolvedCountry && (!model || (!model.includes('3.5') && !model.includes('flash-lite')))) {
      const upperCountry = resolvedCountry.trim().toUpperCase();
      if (EU_COUNTRIES.has(upperCountry)) {
        const regional = filteredEndpoints.filter(e => e.regionName.startsWith('europe-'));
        if (regional.length > 0) filteredEndpoints = regional;
      } else if (['US', 'CA', 'MX'].includes(upperCountry)) {
        const regional = filteredEndpoints.filter(e => e.regionName.startsWith('us-'));
        if (regional.length > 0) filteredEndpoints = regional;
      } else if (['CN', 'JP', 'KR', 'SG', 'HK', 'TW', 'IN'].includes(upperCountry)) {
        const regional = filteredEndpoints.filter(e => e.regionName.startsWith('asia-') || e.regionName.startsWith('australia-'));
        if (regional.length > 0) filteredEndpoints = regional;
      }
    }

    if (filteredEndpoints.length === 0) {
      filteredEndpoints = endpointStates;
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

export function removeRequestFromEndpoint(endpoint: ProjectRegionState) {
  if (endpoint.requestHistory.length > 0) {
    endpoint.requestHistory.pop();
  }
}

export function handleSuccessfulEndpointRequest(endpoint: ProjectRegionState, actualTokens: number) {
  if (endpoint.requestHistory.length > 0) {
    endpoint.requestHistory[endpoint.requestHistory.length - 1].tokens = actualTokens;
  }
  endpoint.rpmCapacity = Math.min(MAX_RPM_CEILING, endpoint.rpmCapacity + 1);
  endpoint.tpmCapacity = Math.min(MAX_TPM_CEILING, endpoint.tpmCapacity + 10000);
}

export function handleEndpointRateLimitError(endpoint: ProjectRegionState) {
  endpoint.last429Time = Date.now();
  endpoint.rpmCapacity = Math.min(MAX_RPM_CEILING, Math.max(1, Math.floor(endpoint.rpmCapacity * 0.8)));
  endpoint.tpmCapacity = Math.min(MAX_TPM_CEILING, Math.max(10000, Math.floor(endpoint.tpmCapacity * 0.8)));
  console.warn(`[RATE LIMITER] ⚠️ 429 Resource Exhausted on project "${endpoint.projectId}" in region "${endpoint.regionName}". Initiating 15s cooldown and adapting limits to: RPM ${endpoint.rpmCapacity}, TPM ${endpoint.tpmCapacity}`);
}

