import { ModelId, TASK_MODELS, MODEL_PRICING, TASK_TOKEN_ESTIMATES } from './ai-config';
export { TASK_MODELS };
export type { ModelId };
import {
  userCountryStorage,
  customCredentialsStorage,
  ServiceAccountCredentials,
  VertexAccount,
  ProjectRegionState,
  accounts,
  unsupportedModelRegions,
  initializeAccounts,
  optimizeAccountQuotasInBackground,
  getAccessTokenForAccount,
} from './vertex/vertex-accounts';
import {
  estimateRequestTokens,
  acquireEndpointAndRateLimitSlot,
  removeRequestFromEndpoint,
  handleSuccessfulEndpointRequest,
  handleEndpointRateLimitError,
} from './vertex/vertex-rate-limiter';

export {
  userCountryStorage,
  customCredentialsStorage,
  initializeAccounts,
  optimizeAccountQuotasInBackground,
  getAccessTokenForAccount,
};
export type {
  ServiceAccountCredentials,
  VertexAccount,
  ProjectRegionState,
};

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
  disableCompression?: boolean; // Optional flag to disable automatic prompt compression
}

/**
 * Strips the common leading indentation from all lines of a multi-line string.
 * This is crucial for removing the template-literal indentation in TypeScript files.
 */
export function stripCommonIndent(text: string): string {
  const lines = text.split('\n');
  
  // Find the minimum indentation of non-empty lines
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim() === '') continue;
    const match = line.match(/^(\s*)/);
    if (match) {
      const indent = match[1].length;
      if (indent < minIndent) {
        minIndent = indent;
      }
    }
  }
  
  if (minIndent === Infinity || minIndent === 0) {
    return text;
  }
  
  return lines.map(line => {
    if (line.trim() === '') return '';
    return line.slice(minIndent);
  }).join('\n');
}

/**
 * Compresses prompt text by removing excess whitespace, collapsing consecutive newlines,
 * and minifying inline JSON code blocks, while preserving relative indentation for lists
 * and formatting of other code blocks.
 */
export function compressPromptText(text: string): string {
  if (!text) return text;
  
  // First, strip common indentation so relative formatting is clean
  const strippedText = stripCommonIndent(text);
  
  const lines = strippedText.split('\n');
  let inCodeBlock = false;
  let inJsonBlock = false;
  let jsonBuffer: string[] = [];
  let consecutiveEmptyLines = 0;
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Handle markdown code block boundaries
    if (trimmedLine.startsWith('```')) {
      if (inCodeBlock) {
        // Exiting code block
        if (inJsonBlock) {
          try {
            const jsonContent = jsonBuffer.join('\n').trim();
            const minified = JSON.stringify(JSON.parse(jsonContent));
            processedLines.push(minified);
          } catch (e) {
            // Fallback if parsing fails (e.g. contains placeholders or templates)
            processedLines.push(...jsonBuffer.map(l => l.trim()));
          }
          inJsonBlock = false;
          jsonBuffer = [];
        }
        processedLines.push(trimmedLine);
        inCodeBlock = false;
      } else {
        // Entering code block
        processedLines.push(trimmedLine);
        inCodeBlock = true;
        if (trimmedLine.toLowerCase().startsWith('```json')) {
          inJsonBlock = true;
          jsonBuffer = [];
        }
      }
      consecutiveEmptyLines = 0;
      continue;
    }
    
    if (inCodeBlock) {
      if (inJsonBlock) {
        jsonBuffer.push(line);
      } else {
        // For non-JSON code blocks (like mdx, html, typescript), trim end to save tokens
        processedLines.push(line.trimEnd());
      }
      continue;
    }
    
    // Outside code blocks
    if (trimmedLine === '') {
      consecutiveEmptyLines++;
      if (consecutiveEmptyLines <= 1) {
        processedLines.push('');
      }
      continue;
    }
    
    consecutiveEmptyLines = 0;
    
    // Preserve any relative leading indentation
    const matchIndent = line.match(/^(\s*)/);
    const indent = matchIndent ? matchIndent[1] : '';
    processedLines.push(indent + trimmedLine.replace(/[ \t]+/g, ' '));
  }
  
  return processedLines.join('\n').trim();
}

/**
 * Make a generateContent or streamGenerateContent call to Vertex AI.
 * Returns the raw fetch Response so callers can handle streaming or JSON.
 */
export async function callVertexAI(req: VertexRequest): Promise<Response | null> {
  // Compress contents and systemInstruction if not disabled
  const compressedReq = { ...req };
  if (!req.disableCompression) {
    compressedReq.contents = req.contents.map(c => ({
      ...c,
      parts: c.parts.map(p => {
        if ('text' in p && typeof p.text === 'string') {
          return { ...p, text: compressPromptText(p.text) };
        }
        return p;
      })
    }));
    if (req.systemInstruction) {
      compressedReq.systemInstruction = compressPromptText(req.systemInstruction);
    }
  }

  const estimatedTokens = estimateRequestTokens(compressedReq);

  const configuredModel = TASK_MODELS[compressedReq.task] || 'gemini-3.5-flash-lite';

  // Initialize and check pool
  await initializeAccounts();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const useAiStudioDirect = Boolean(
    (process.env.VERTEX_USE_AI_STUDIO === 'true' || process.env.AI_ENGINE === 'aistudio') &&
    apiKey &&
    (apiKey.startsWith('AIzaSy') || accounts.length === 0)
  );

  if (useAiStudioDirect && apiKey) {
    const candidateModels = [configuredModel];

    const body: Record<string, unknown> = { contents: compressedReq.contents };
    if (compressedReq.systemInstruction) {
      body.systemInstruction = { parts: [{ text: compressedReq.systemInstruction }] };
    }
    if (compressedReq.generationConfig) {
      const sanitizedGenConfig = { ...compressedReq.generationConfig } as any;
      delete sanitizedGenConfig.frequencyPenalty;
      delete sanitizedGenConfig.presencePenalty;
      body.generationConfig = sanitizedGenConfig;
    }
    if (compressedReq.safetySettings) {
      body.safetySettings = compressedReq.safetySettings;
    }

    for (const model of candidateModels) {
      for (let attempt = 1; attempt <= 5; attempt++) {
        console.log(`[AI-STUDIO-DIRECT] Calling Google AI Studio (${model}, attempt ${attempt}/5)...`);
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey
            },
            body: JSON.stringify(body)
          });
          if (res.ok) {
            return res;
          }
          const errStatus = res.status;
          const errText = await res.text();
          console.warn(`[AI-STUDIO-DIRECT] Model "${model}" returned HTTP ${errStatus}: ${errText.slice(0, 200)}`);
          if (errStatus === 503 || errStatus === 429) {
            if (attempt < 5) {
              const backoff = errStatus === 429 ? (10000 * attempt) : (3000 * attempt);
              console.log(`[AI-STUDIO-DIRECT] Rate limit / demand spike (${errStatus}). Retrying in ${backoff / 1000}s...`);
              await new Promise(r => setTimeout(r, backoff));
              continue;
            }
          } else {
            break;
          }
        } catch (e) {
          console.warn(`[AI-STUDIO-DIRECT] Network error for model "${model}":`, e);
          if (attempt < 5) {
            await new Promise(r => setTimeout(r, 4000));
            continue;
          }
        }
      }
    }
    return null;
  }

  if (accounts.length === 0 && !apiKey) {
    console.warn('[VERTEX-POOL] Cannot make Vertex AI call: no service accounts configured and no GEMINI_API_KEY.');
    return null;
  }
  
  // Decide candidate models to try (strictly gemini-3.5-flash-lite, zero fallback)
  const modelsToTry: string[] = [configuredModel];

  const method = compressedReq.stream ? 'streamGenerateContent?alt=sse' : 'generateContent';
  let response: Response | null = null;
  let lastError = '';

  for (const model of modelsToTry) {
    const body: Record<string, unknown> = { contents: compressedReq.contents };
    if (compressedReq.systemInstruction) {
      body.systemInstruction = { parts: [{ text: compressedReq.systemInstruction }] };
    }
    if (compressedReq.generationConfig) {
      const sanitizedGenConfig = { ...compressedReq.generationConfig } as any;
      delete sanitizedGenConfig.frequencyPenalty;
      delete sanitizedGenConfig.presencePenalty;
      body.generationConfig = sanitizedGenConfig;
    }
    if (compressedReq.safetySettings) {
      body.safetySettings = compressedReq.safetySettings;
    }

    const maxRetries = 10;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      let selected;
      try {
        selected = await acquireEndpointAndRateLimitSlot(estimatedTokens, compressedReq.userCountry, model);
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
      const host = currentLocation === 'global' ? 'aiplatform.googleapis.com' : `${currentLocation}-aiplatform.googleapis.com`;
      const url = `https://${host}/v1beta1/projects/${currentProjectId}/locations/${currentLocation}/publishers/google/models/${model}:${method}`;

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

              const firstPart = compressedReq.contents?.[0]?.parts?.[0];
              const promptText = (firstPart && 'text' in firstPart) ? firstPart.text : '';
              await recordMetrics(compressedReq.task, model, durationMs, promptTokens, candidatesTokens, promptText);
            } catch (e) {
              console.warn('[VERTEX-POOL] Failed to parse usage metadata from response clone:', e);
              // Fallback: estimate tokens if parsing failed
              const est = TASK_TOKEN_ESTIMATES[compressedReq.task] || { inputTokens: 1000, outputTokens: 500 };
              handleSuccessfulEndpointRequest(endpoint, est.inputTokens + est.outputTokens);

              const firstPart = compressedReq.contents?.[0]?.parts?.[0];
              const promptText = (firstPart && 'text' in firstPart) ? firstPart.text : '';
              await recordMetrics(compressedReq.task, model, durationMs, est.inputTokens, est.outputTokens, promptText);
            }
          })();

          return response;
        } else if (response.status === 429) {
          handleEndpointRateLimitError(endpoint);
          removeRequestFromEndpoint(endpoint);

          const errText = await response.text();
          lastError = `[VERTEX-POOL] Model "${model}" failed on project "${currentProjectId}" in region "${currentLocation}" (429 RESOURCE_EXHAUSTED). ${errText.slice(0, 300)}`;
          
          if (attempt < maxRetries) {
            // True exponential backoff with jitter
            // Base delay of 1.5s, scaling up by factor of 2, capped at 30s. Adding up to 1s random jitter.
            const backoffDelay = Math.min(30000, 1500 * Math.pow(2, attempt - 1)) + Math.floor(Math.random() * 1000);
            console.warn(`${lastError}. Implementing exponential backoff of ${backoffDelay}ms before retry ${attempt + 1}/${maxRetries}...`);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            continue;
          }
        } else if (response.status === 401) {
          // Token expired or invalid! Invalidate cache immediately.
          console.warn(`[VERTEX-POOL] ⚠️ Received 401 Unauthorized on project "${currentProjectId}". Invalidating cached token...`);
          account.cachedToken = null;
          account.tokenExpiry = 0;
          account.tokenPromise = undefined;
          removeRequestFromEndpoint(endpoint);
          
          const errText = await response.text();
          lastError = `[VERTEX-POOL] Model "${model}" failed on project "${currentProjectId}" in region "${currentLocation}" (401 Unauthorized). ${errText.slice(0, 300)}`;

          if (attempt < maxRetries) {
            const jitterDelay = Math.floor(Math.random() * 1000);
            console.warn(`Retrying with a fresh token in ${jitterDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, jitterDelay));
            continue;
          }
        } else if (response.status === 404) {
          removeRequestFromEndpoint(endpoint);
          unsupportedModelRegions.add(`${model}::${currentLocation}`);
          const errText = await response.text();
          lastError = `[VERTEX-POOL] Model "${model}" not found (404) in region "${currentLocation}" for project "${currentProjectId}". Excluded region from pool.`;
          console.warn(lastError);
          
          if (attempt < maxRetries) {
            // Try another region for this model
            continue;
          }
          break; // Try next model candidate (e.g. gemini-3.5-flash)
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
      const lowerPrompt = (promptTextForClassifier || '').toLowerCase();
      if (lowerPrompt.includes('agent 3b - widgets architect') || lowerPrompt.includes('agent 4b - widgets critic') || lowerPrompt.includes('json syntax repair assistant')) {
        metricId = 'widgets';
      } else if (promptTextForClassifier.includes('Verifier/Critic Agent') || promptTextForClassifier.includes('Agent 4')) {
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

/** Returns true if Vertex AI credentials or Google AI Studio key are configured */
export function isVertexConfigured(): boolean {
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
    return true;
  }
  if (process.env.VERTEX_SERVICE_ACCOUNT_BASE64 || process.env.VERTEX_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
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

