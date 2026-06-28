/**
 * OpenPrimer — Service Status Monitor
 * Tracks liveness of all external dependencies.
 * Used by both the admin Health page and the global ServiceToast banner.
 */

import { useState, useEffect, useCallback } from 'react';

export type ServiceStatus = 'ok' | 'degraded' | 'offline' | 'unknown' | 'unauthorized';

export interface ServiceHealth {
  id: string;
  nameKey: string;       // i18n key for the service name
  url: string;           // public endpoint URL (display only)
  status: ServiceStatus;
  latencyMs: number | null;
  checkedAt: string | null;
  errorMessage?: string;
}

export const SERVICES_CONFIG = [
  {
    id: 'db',
    nameKey: 'health_db',
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://supabase.io',
    probeKey: 'db'
  },
  {
    id: 'email',
    nameKey: 'health_email',
    url: 'https://api.resend.com',
    probeKey: 'email'
  },
  {
    id: 'ai',
    nameKey: 'health_ai',
    url: 'https://generativelanguage.googleapis.com',
    probeKey: 'ai'
  },
  {
    id: 'images',
    nameKey: 'health_images',
    url: 'https://image.pollinations.ai',
    probeKey: 'images'
  },
  {
    id: 'smithsonian',
    nameKey: 'health_smithsonian',
    url: 'https://api.si.edu/openaccess/api/v1.0/search',
    probeKey: 'smithsonian'
  },
  {
    id: 'unsplash',
    nameKey: 'health_unsplash',
    url: 'https://api.unsplash.com/search/photos',
    probeKey: 'unsplash'
  }
];

export interface ServiceHealthMap {
  db: ServiceHealth;
  email: ServiceHealth;
  ai: ServiceHealth;
  images: ServiceHealth;
  smithsonian: ServiceHealth;
  unsplash: ServiceHealth;
  [key: string]: ServiceHealth;
}

const defaultHealth = (id: string, nameKey: string, url: string): ServiceHealth => ({
  id,
  nameKey,
  url,
  status: 'unknown',
  latencyMs: null,
  checkedAt: null
});

/**
 * Hook: polls /api/health every `intervalMs` ms (default 30s).
 * Returns a map of service ID → ServiceHealth.
 */
export function useServiceStatus(intervalMs = 30_000) {
  const [health, setHealth] = useState<ServiceHealthMap>(() => {
    const map: any = {};
    SERVICES_CONFIG.forEach(s => { map[s.id] = defaultHealth(s.id, s.nameKey, s.url); });
    return map as ServiceHealthMap;
  });
  const [isChecking, setIsChecking] = useState(false);

  const check = useCallback(async () => {
    setIsChecking(true);
    try {
      const customSupabaseUrl = typeof window !== 'undefined' ? localStorage.getItem('op_supabase_url') || '' : '';
      const customSupabaseKey = typeof window !== 'undefined' ? localStorage.getItem('op_supabase_anon_key') || '' : '';
      const customResendKey = typeof window !== 'undefined' ? localStorage.getItem('op_resend_api_key') || '' : '';
      const customGeminiKey = typeof window !== 'undefined' ? localStorage.getItem('op_gemini_api_key') || '' : '';
      const customSmithsonianKey = typeof window !== 'undefined' ? localStorage.getItem('op_smithsonian_api_key') || '' : '';
      const customUnsplashKey = typeof window !== 'undefined' ? localStorage.getItem('op_unsplash_api_key') || '' : '';
      const adminSession = typeof window !== 'undefined' ? localStorage.getItem('op_session') || '' : '';

      const headers: Record<string, string> = {};
      if (customSupabaseUrl) headers['x-supabase-url'] = customSupabaseUrl;
      if (customSupabaseKey) headers['x-supabase-anon-key'] = customSupabaseKey;
      if (customResendKey) headers['x-resend-api-key'] = customResendKey;
      if (customGeminiKey) headers['x-gemini-api-key'] = customGeminiKey;
      if (customSmithsonianKey) headers['x-smithsonian-api-key'] = customSmithsonianKey;
      if (customUnsplashKey) headers['x-unsplash-api-key'] = customUnsplashKey;
      if (adminSession === 'true') headers['x-admin-session'] = 'true';

      const res = await fetch('/api/health', { 
        method: 'GET', 
        headers,
        cache: 'no-store' 
      });
      if (res.ok) {
        const country = res.headers.get('x-user-country') || 'FR';
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('op_user_country', country);
        }
        const results: ServiceHealth[] = await res.json();
        const map: any = {};
        results.forEach(r => { map[r.id] = r; });
        setHealth(map as ServiceHealthMap);
      }
    } catch {
      // Network failure or API not reachable — silently keep previous state (unknown)
      // Do NOT flip to 'offline' or log to console; this is expected in dev/sandbox.
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    check(); // immediate first check
    const interval = setInterval(check, intervalMs);
    return () => clearInterval(interval);
  }, [check, intervalMs]);

  return { health, isChecking, refresh: check };
}

/** 
 * Returns true if ANY service is degraded or offline.
 * Used to show the global toast banner.
 */
export function hasAnyDegradedService(health: ServiceHealthMap): boolean {
  return Object.values(health).some(s => s.status === 'degraded' || s.status === 'offline');
}

export function getDegradedServices(health: ServiceHealthMap): ServiceHealth[] {
  return Object.values(health).filter(s => s.status === 'degraded' || s.status === 'offline');
}
