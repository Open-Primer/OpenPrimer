interface RateLimitRecord {
  timestamps: number[];
}

const store = new Map<string, RateLimitRecord>();

/**
 * Robust in-memory rate limiter keyed by client IP address
 * Default: 20 requests per 1 minute (60,000ms)
 */
export function isRateLimited(ip: string, limit: number = 20, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = store.get(ip) || { timestamps: [] };
  
  // Filter timestamps outside the sliding window
  record.timestamps = record.timestamps.filter(t => now - t < windowMs);
  
  if (record.timestamps.length >= limit) {
    return true;
  }
  
  record.timestamps.push(now);
  store.set(ip, record);
  return false;
}

// Memory safety cleanup routine run every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of store.entries()) {
      record.timestamps = record.timestamps.filter(t => now - t < 60000);
      if (record.timestamps.length === 0) {
        store.delete(ip);
      }
    }
  }, 300000);
}
