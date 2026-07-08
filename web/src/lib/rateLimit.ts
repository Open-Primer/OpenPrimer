import { supabaseAdmin } from './supabase';

interface RateLimitRecord {
  timestamps: number[];
}

const localStore = new Map<string, RateLimitRecord>();
const MAX_STORE_SIZE = 500;
let evictionCounter = 0;

/** L-1 FIX: Periodically sweep expired entries and cap store size. */
function evictStaleEntries(windowMs: number): void {
  const now = Date.now();
  for (const [key, record] of localStore.entries()) {
    record.timestamps = record.timestamps.filter(t => now - t < windowMs);
    if (record.timestamps.length === 0) {
      localStore.delete(key);
    }
  }
  // Hard cap: if still over limit, evict oldest entries
  if (localStore.size > MAX_STORE_SIZE) {
    const toDelete = localStore.size - MAX_STORE_SIZE;
    let deleted = 0;
    for (const key of localStore.keys()) {
      if (deleted >= toDelete) break;
      localStore.delete(key);
      deleted++;
    }
  }
}

function localRateLimit(ip: string, limit: number, windowMs: number): boolean {
  // Sweep every 100 calls to avoid unbounded growth in long-running dev servers
  if (++evictionCounter % 100 === 0) evictStaleEntries(windowMs);

  const now = Date.now();
  const record = localStore.get(ip) || { timestamps: [] };
  record.timestamps = record.timestamps.filter(t => now - t < windowMs);
  if (record.timestamps.length >= limit) {
    return true;
  }
  record.timestamps.push(now);
  localStore.set(ip, record);
  return false;
}

/**
 * Sliding window database-backed rate limiter for serverless environments.
 * Keyed by IP and action type. Cascades to memory-based limit in non-production.
 */
export async function isRateLimited(
  ip: string,
  limit: number = 20,
  windowMs: number = 60000,
  action: string = 'api_call'
): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    return localRateLimit(`${action}:${ip}`, limit, windowMs);
  }

  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);
    const signature = `rl:${action}:${ip}`;

    // Query current hit count within the sliding window
    const { count, error } = await supabaseAdmin
      .from('search_logs')
      .select('*', { count: 'exact', head: true })
      .eq('query', signature)
      .gt('timestamp', windowStart.toISOString());

    if (error) {
      console.warn('[RATE LIMIT] DB count query error, falling back to memory limit:', error);
      return localRateLimit(`${action}:${ip}`, limit, windowMs);
    }

    if (count !== null && count >= limit) {
      return true;
    }

    // Insert hit log to persist state across serverless instances
    const { error: insertError } = await supabaseAdmin
      .from('search_logs')
      .insert({
        query: signature,
        was_successful: true,
        timestamp: now.toISOString()
      });

    if (insertError) {
      console.warn('[RATE LIMIT] DB insertion error:', insertError);
    }

    return false;
  } catch (err) {
    console.error('[RATE LIMIT] Fatal exception, falling back to memory limit:', err);
    return localRateLimit(`${action}:${ip}`, limit, windowMs);
  }
}
