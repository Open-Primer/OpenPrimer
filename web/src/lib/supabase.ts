import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Custom fetch wrapper with retry capability for transient network/DNS failures
const fetchWithRetry = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const maxRetries = 4;
  let delay = 300; // ms
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(input, init);
      // Retry on standard transient proxy/network HTTP status codes
      if (response.status === 502 || response.status === 503 || response.status === 504) {
        throw new Error(`Status ${response.status}`);
      }
      return response;
    } catch (err: any) {
      const errMsg = String(err?.message || err);
      const isTransient =
        errMsg.includes('ENOTFOUND') ||
        errMsg.includes('ECONNRESET') ||
        errMsg.includes('ETIMEDOUT') ||
        errMsg.includes('fetch failed') ||
        errMsg.includes('Status 502') ||
        errMsg.includes('Status 503') ||
        errMsg.includes('Status 504');

      if (isTransient && i < maxRetries - 1) {
        const jitter = Math.random() * 200;
        const totalDelay = delay + jitter;
        console.warn(`[Supabase Connection Retry] Attempt ${i + 1} failed (${errMsg}). Retrying in ${Math.round(totalDelay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, totalDelay));
        delay *= 2; // exponential backoff
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries exceeded");
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: fetchWithRetry
  }
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  global: {
    fetch: fetchWithRetry
  }
});
