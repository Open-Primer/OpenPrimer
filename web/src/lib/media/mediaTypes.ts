import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface CacheEntry {
  url: string;
  sourceLabel: string;
  sourceUrl?: string;
  description?: string;
  timestamp: number;
}

export const LANGUAGE_NAMES_MAP: Record<string, string> = {
  FR: 'français',
  EN: 'english',
  ES: 'español',
  DE: 'deutsch',
  ZH: '中文',
  PT: 'português',
  AR: 'العربية',
  HI: 'हिन्दी',
  UR: 'اردو'
};

export function getLanguageSearchTerm(lang: string = 'en'): string {
  const upper = (lang || 'EN').toUpperCase();
  return LANGUAGE_NAMES_MAP[upper] || 'english';
}

const CACHE_FILE_PATH = path.join(process.cwd(), '.media-cache.json');
let persistentMediaCache: Record<string, CacheEntry> = {};

export function loadPersistentCache(): void {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const content = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      persistentMediaCache = JSON.parse(content);
      console.log(`[MEDIA-CACHE] Loaded ${Object.keys(persistentMediaCache).length} cached media entries from ${CACHE_FILE_PATH}`);
    }
  } catch (err) {
    console.warn('[MEDIA-CACHE] Failed to load persistent cache:', err);
    persistentMediaCache = {};
  }
}

export function savePersistentCache(): void {
  try {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(persistentMediaCache, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[MEDIA-CACHE] Failed to save persistent cache:', err);
  }
}

// Automatically load on module initialization
loadPersistentCache();

export function getCachedMedia(query: string, lang: string): CacheEntry | null {
  const cacheKey = crypto.createHash('sha256').update(`${lang.toLowerCase()}:${query.toLowerCase().trim()}`).digest('hex');
  return persistentMediaCache[cacheKey] || null;
}

export function setCachedMedia(query: string, lang: string, entry: Omit<CacheEntry, 'timestamp'>): void {
  const cacheKey = crypto.createHash('sha256').update(`${lang.toLowerCase()}:${query.toLowerCase().trim()}`).digest('hex');
  persistentMediaCache[cacheKey] = {
    ...entry,
    timestamp: Date.now()
  };
  savePersistentCache();
}
