import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { supabaseAdmin } from './supabase';
import { compressPromptText, callVertexAI } from './vertex-client';

// ─── PERSISTENT MEDIA RESOLUTION CACHE ──────────────────────────────────────
const CACHE_FILE_PATH = path.join(process.cwd(), '.media-cache.json');

interface CacheEntry {
  url: string;
  sourceLabel: string;
  sourceUrl?: string;
  description?: string;
  timestamp: number;
}

let persistentMediaCache: Record<string, CacheEntry> = {};

function loadPersistentCache(): void {
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

function savePersistentCache(): void {
  try {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(persistentMediaCache, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[MEDIA-CACHE] Failed to save persistent cache:', err);
  }
}

// Automatically load on module initialization
loadPersistentCache();

function getCachedMedia(query: string, lang: string): CacheEntry | null {
  const cacheKey = crypto.createHash('sha256').update(`${lang.toLowerCase()}:${query.toLowerCase().trim()}`).digest('hex');
  return persistentMediaCache[cacheKey] || null;
}

function setCachedMedia(query: string, lang: string, entry: Omit<CacheEntry, 'timestamp'>): void {
  const cacheKey = crypto.createHash('sha256').update(`${lang.toLowerCase()}:${query.toLowerCase().trim()}`).digest('hex');
  persistentMediaCache[cacheKey] = {
    ...entry,
    timestamp: Date.now()
  };
  savePersistentCache();
}

function compileFinalLabel(sourceLabel: string, sourceUrl?: string | null): string {
  if (!sourceLabel) return '';
  const isAlreadyFormatted = sourceLabel.includes('[') || sourceLabel.includes('](');
  if (sourceUrl && !isAlreadyFormatted) {
    return `[${sourceLabel}](${sourceUrl})`;
  }
  return sourceLabel;
}

async function validateImageSoftWithGemini(imageUrl: string, entityName: string): Promise<boolean> {
  try {
    const resImg = await fetchWithTimeout(imageUrl, {}, 8000);
    if (!resImg.ok) return false;
    const contentType = resImg.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await resImg.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const promptText = `L'image fournie en pièce jointe représente-t-elle de manière authentique, digne et de haute qualité l'entité historique ou scientifique suivante : "${entityName}" (par exemple : un portrait de ce personnage, un monument historique le concernant, une œuvre d'art originale le représentant, un manuscrit historique de sa main, ou une photo de l'objet) ?
Réponds uniquement par OUI ou NON.`;

    const res = await callVertexAI({
      task: 'course_generation',
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: contentType.split(';')[0],
              data: base64Data
            }
          },
          {
            text: compressPromptText(promptText)
          }
        ]
      }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.1
      }
    });

    if (res && res.ok) {
      const json = await res.json();
      const answer = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toUpperCase() || '';
      console.log(`[MEDIA-RESOLVER] Soft validation answer for "${entityName}": "${answer}"`);
      return answer.includes('OUI');
    }
  } catch (err) {
    console.warn('[MEDIA-RESOLVER] Error in soft validation with Gemini:', err);
  }
  return false;
}

async function generateQueryRelaxationsWithGemini(specificQuery: string, lang: string = 'en'): Promise<string[]> {
  try {
    const promptText = `Tu es un assistant de recherche documentaire d'élite.
Considère la description de média spécifique suivante : "${specificQuery}".
Génère une liste ordonnée de 3 requêtes de recherche de spécificité décroissante (du plus précis au plus général) pour trouver cette entité ou son contexte sur Wikipédia, Wikidata ou des banques d'images.
Règles :
1. La première requête doit être l'entité canonique ultra-spécifique (ex: "Philosophiae Naturalis Principia Mathematica").
2. La deuxième requête doit être une version légèrement simplifiée ou l'œuvre liée (ex: "Principia Mathematica").
3. La troisième requête doit être le personnage historique ou le concept majeur associé (ex: "Isaac Newton").
4. Réponds UNIQUEMENT avec ces 3 requêtes sous forme de lignes distinctes, sans numérotation, sans guillemets, sans puces et sans autre texte explicatif.`;

    const res = await callVertexAI({
      task: 'course_generation',
      contents: [{ role: 'user', parts: [{ text: compressPromptText(promptText) }] }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.1
      }
    });

    if (res && res.ok) {
      const resJson = await res.json();
      const text = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const lines = text.split('\n')
          .map((l: string) => l.trim().replace(/["']/g, ''))
          .filter((l: string) => l.length > 0);
        if (lines.length > 0) {
          console.log(`[MEDIA-RESOLVER] Generated query relaxations for "${specificQuery}":`, lines);
          return lines;
        }
      }
    }
  } catch (err) {
    console.warn(`[MEDIA-RESOLVER] generateQueryRelaxationsWithGemini failed for "${specificQuery}":`, err);
  }
  return [specificQuery];
}

class TransientNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransientNetworkError';
  }
}

class StructuralJsonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StructuralJsonError';
  }
}

async function safeResponseJson(res: Response, contextName: string = 'unknown'): Promise<any> {
  const contentType = res.headers.get('Content-Type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new TransientNetworkError(`[HTTP NON-JSON RESPONSE] Expected JSON response, but received Content-Type "${contentType}" with status ${res.status}. Context: "${contextName}". Body: "${text.slice(0, 300)}"`);
  }
  try {
    return await res.json();
  } catch (e: any) {
    const text = await res.clone().text().catch(() => '');
    throw new StructuralJsonError(`[JSON PARSE ERROR] Failed to parse JSON response. Context: "${contextName}". Error: ${e.message}. Snippet: "${text.slice(0, 200)}"`);
  }
}

function getSafeExtension(contentType: string, defaultExt: string = 'jpg'): string {
  if (!contentType) return defaultExt;
  const mainType = contentType.split(';')[0].trim();
  const parts = mainType.split('/');
  let ext = parts[parts.length - 1] || defaultExt;
  ext = ext.replace(/[^a-zA-Z0-9]/g, '');
  if (ext === 'jpeg') return 'jpeg';
  if (ext === 'png') return 'png';
  if (ext === 'gif') return 'gif';
  if (ext === 'svgxml' || ext === 'svg') return 'svg';
  if (ext === 'webp') return 'webp';
  if (ext === 'mpeg' || ext === 'mp3') return 'mp3';
  if (ext === 'wav') return 'wav';
  if (ext === 'ogg') return 'ogg';
  return ext || defaultExt;
}


async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => {
    try { controller.abort(); } catch {}
  }, timeoutMs);

  try {
    const mergedHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      ...options.headers
    };
    const response = await fetch(url, {
      ...options,
      headers: mergedHeaders,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 8000): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

const saPath = 'c:\\Silvere\\Encours\\Developpement\\OpenPrimer\\web\\secrets\\openprimer-free-a9fb82581e59.json';

// Helper to encode JWT components
function base64UrlEncode(buf: Buffer): string {
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Generate Google Cloud Access Token from service account
async function getGoogleAccessToken(): Promise<string | null> {
  try {
    if (!fs.existsSync(saPath)) {
      console.warn('[MEDIA-RESOLVER] Service account JSON not found');
      return null;
    }
    const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: sa.token_uri || 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    const headerEncoded = base64UrlEncode(Buffer.from(JSON.stringify(header)));
    const payloadEncoded = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
    const stringToSign = `${headerEncoded}.${payloadEncoded}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(stringToSign);
    const signature = sign.sign(sa.private_key);
    const signatureEncoded = base64UrlEncode(signature);

    const jwt = `${stringToSign}.${signatureEncoded}`;

    const tokenRes = await fetchWithTimeout(sa.token_uri || 'https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    }, 6000);

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('[MEDIA-RESOLVER] Token exchange error:', err);
      return null;
    }

    const data = await safeResponseJson(tokenRes, 'Google access token exchange');
    return data.access_token || null;
  } catch (err) {
    console.error('[MEDIA-RESOLVER] Failed to generate access token:', err);
    return null;
  }
}

// Ensure the Supabase Storage bucket exists
async function ensureBucketExists() {
  try {
    const { data: buckets, error: listError } = await withTimeout(supabaseAdmin.storage.listBuckets(), 8000);
    if (listError) throw listError;

    const exists = buckets?.some(b => b.name === 'course-media');
    if (!exists) {
      console.log('[MEDIA-RESOLVER] Creating Supabase Storage bucket "course-media"...');
      const { error: createError } = await withTimeout(supabaseAdmin.storage.createBucket('course-media', {
        public: true,
        fileSizeLimit: 20 * 1024 * 1024 // 20MB
      }), 8000);
      if (createError) throw createError;
    }
  } catch (err) {
    console.error('[MEDIA-RESOLVER] Failed to ensure storage bucket exists:', err);
  }
}

// Upload a buffer to Supabase Storage and return its public URL
async function uploadToSupabaseStorage(fileName: string, buffer: Buffer, mimeType: string): Promise<string | null> {
  try {
    await ensureBucketExists();

    const { error } = await withTimeout(
      supabaseAdmin.storage
        .from('course-media')
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: true
        }),
      15000
    );

    if (error) {
      console.error(`[MEDIA-RESOLVER] Failed to upload ${fileName} to storage:`, error);
      return null;
    }

    const { data } = supabaseAdmin.storage
      .from('course-media')
      .getPublicUrl(fileName);

    return data?.publicUrl || null;
  } catch (err) {
    console.error(`[MEDIA-RESOLVER] Exception during upload of ${fileName}:`, err);
    return null;
  }
}

export async function searchYouTubeVideo(query: string): Promise<string | null> {
  try {
    const rawQuery = query.trim();
    const cleanQuery = await optimizeQueryWithGemini(rawQuery);
    if (cleanQuery !== rawQuery) {
      console.log(`[MEDIA-RESOLVER] Optimized YouTube search query from "${rawQuery}" to "${cleanQuery}"`);
    }
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`;
    const res = await fetchWithTimeout(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    }, 5000);
    if (!res.ok) return null;
    const html = await res.text();
    
    // Extract ytInitialData
    let ytInitialData: any = null;
    const jsonMatch = html.match(/ytInitialData\s*=\s*({[\s\S]+?});/);
    if (jsonMatch) {
      try {
        ytInitialData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        // Fallback brace matching if parsing failed
        const startIdx = html.indexOf('ytInitialData = {');
        if (startIdx !== -1) {
          const start = html.indexOf('{', startIdx);
          let braceCount = 1;
          let i = start + 1;
          while (i < html.length && braceCount > 0) {
            if (html[i] === '{') braceCount++;
            else if (html[i] === '}') braceCount--;
            i++;
          }
          if (braceCount === 0) {
            try {
              ytInitialData = JSON.parse(html.substring(start, i));
            } catch {}
          }
        }
      }
    }

    const videos: { videoId: string; title: string; viewCount: number; duration: string }[] = [];

    if (ytInitialData) {
      // Helper function to recursively find all videoRenderers
      const findRenderers = (obj: any) => {
        if (!obj || typeof obj !== 'object') return;
        if (obj.videoRenderer) {
          const vr = obj.videoRenderer;
          const videoId = vr.videoId;
          let title = '';
          if (vr.title?.runs?.[0]?.text) title = vr.title.runs[0].text;
          else if (vr.title?.simpleText) title = vr.title.simpleText;

          let viewStr = '';
          if (vr.viewCountText?.simpleText) viewStr = vr.viewCountText.simpleText;
          else if (vr.shortViewCountText?.simpleText) viewStr = vr.shortViewCountText.simpleText;

          let durationStr = '';
          if (vr.lengthText?.simpleText) durationStr = vr.lengthText.simpleText;

          if (videoId && videoId.length === 11) {
            // Parse approximate view count
            let multiplier = 1;
            const cleanStr = viewStr.toLowerCase().replace(/[^0-9kmy\s.,]/g, '').trim();
            if (cleanStr.includes('k')) multiplier = 1000;
            else if (cleanStr.includes('m')) multiplier = 1000000;
            else if (cleanStr.includes('b') || cleanStr.includes('g')) multiplier = 1000000000;
            else if (cleanStr.includes('mille')) multiplier = 1000;
            else if (cleanStr.includes('million')) multiplier = 1000000;

            const valMatch = cleanStr.match(/([0-9]+(?:[.,][0-9]+)?)/);
            const viewCount = valMatch ? parseFloat(valMatch[1].replace(',', '.')) * multiplier : 0;

            videos.push({ videoId, title, viewCount, duration: durationStr });
          }
          return;
        }
        for (const key of Object.keys(obj)) {
          findRenderers(obj[key]);
        }
      };

      findRenderers(ytInitialData);
    }

    if (videos.length > 0) {
      // Sort by popularity viewCount descending as instructed
      const topCandidates = videos.slice(0, 5);
      topCandidates.sort((a, b) => b.viewCount - a.viewCount);
      console.log(`[YOUTUBE-SCRAPER] Sorted top candidates by viewCount:`, topCandidates.map(v => `${v.videoId} (${v.viewCount} views): "${v.title}"`));
      return topCandidates[0].videoId;
    }

    // Ultrafallback regex match if JSON parsing failed completely
    const fallbackMatch = html.match(/"videoId"\s*:\s*"([\w-]{11})"/);
    if (fallbackMatch && fallbackMatch[1]) {
      return fallbackMatch[1];
    }
    return null;
  } catch (err) {
    console.warn(`[MEDIA-RESOLVER] YouTube search failed for query "${query}":`, err);
    return null;
  }
}

async function validateYouTubeVideo(videoId: string): Promise<boolean> {
  if (!videoId || videoId.length !== 11 || videoId.startsWith('placeholder') || videoId.includes('example')) {
    return false;
  }
  try {
    const res = await fetchWithTimeout(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}`, { method: 'HEAD' }, 4000);
    if (res.status === 404) return false;
    return true; // Assume exists for other statuses (e.g. 429, 403) to prevent false-negative repairs
  } catch (err) {
    return true; // Network/rate limit: assume OK
  }
}

// Classifier to differentiate factual/scientific visual assets from general illustrative ones
export function isFactualMedia(alt: string, caption: string = ''): boolean {
  const text = `${alt} ${caption}`.toLowerCase();
  
  // Terms representing general, contextual illustrations (as defined by user)
  const generalContexts = [
    'discutent', 'discuter', 'travail', 'bureau', 'office', 'street', 'rue', 'passant', 'gens dans la rue', 'people talking',
    'étudiant', 'etudiant', 'salle de classe', 'classroom', 'bibliothèque', 'library', 'study', 'étudier', 'etudier'
  ];
  
  const isDecorative = generalContexts.some(term => text.includes(term));
  if (isDecorative) {
    // Check if it also contains highly specific factual terms that override decorative status
    const overrides = ['chapelle', 'molécule', 'molecule', 'structure', 'carte', 'bataille', 'battle', 'portrait', 'einstein', 'peinture', 'painting'];
    const hasOverride = overrides.some(term => text.includes(term));
    if (!hasOverride) {
      return false; 
    }
  }
  
  const factualTerms = [
    'molécule', 'molecule', 'structure', 'atome', 'chimique', 'reaction', 'réaction', 'formule',
    'chapelle', 'monument', 'sculpture', 'tableau', 'peinture', 'painting', 'fresque', 'fresco',
    'portrait', 'photographie historique', 'historical photo', 'carte', 'map', 'géographie', 'geography',
    'bataille', 'guerre', 'battle', 'war', 'empire', 'dynastie', 'dynasty',
    'physique', 'physics', 'mathématique', 'mathematics', 'géométrie', 'geometry', 'fonction', 'plot', 'courbe', 'curve',
    'graphe', 'graph', 'diagramme', 'diagram', 'schéma', 'schema',
    'neuro', 'neurone', 'synapse', 'cerveau', 'brain', 'cellule', 'cell', 'adn', 'dna', 'protéine', 'protein',
    'einstein', 'bach', 'beethoven', 'mozart', 'gogh', 'picasso', 'da vinci', 'rembrandt', 'aristote', 'platon', 'aristotle', 'plato', 'descartes', 'kant', 'marx'
  ];
  
  return factualTerms.some(term => text.includes(term)) || text.length < 3;
}

// ─── Wikidata P18 — canonical image for a named entity ─────────────────────
// Queries Wikidata for the P18 (image) property of an entity matching the title.
// Returns a direct Wikimedia Commons file URL (Special:FilePath redirect).
async function fetchWikidataImage(title: string, lang: string = 'en'): Promise<string | null> {
  try {
    const clean = title.trim().replace(/_/g, ' ');
    // Search Wikidata in parallel using target language, English, and Latin (key for historical sciences)
    const searchLanguages = Array.from(new Set([lang, 'en', 'la'])).filter(Boolean);
    const searchPromises = searchLanguages.map(async (l) => {
      const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(clean)}&language=${l}&limit=3&format=json&origin=*`;
      try {
        const res = await fetchWithTimeout(url, {}, 4000);
        if (res.ok) {
          const json = await safeResponseJson(res, `Wikidata search ${l}`);
          return json?.search ?? [];
        }
      } catch (e) {
        // Ignore individual language search failures
      }
      return [];
    });

    const results = await Promise.all(searchPromises);
    const entitiesMap = new Map<string, any>();
    for (const list of results) {
      for (const item of list) {
        if (item && item.id) {
          entitiesMap.set(item.id, item);
        }
      }
    }
    const entities = Array.from(entitiesMap.values());

    if (entities.length === 0) return null;

    // 2. For candidates, try to get P18 (image)
    for (const entity of entities.slice(0, 5)) {
      const entityId = entity.id;
      const claimsUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims&format=json&origin=*`;
      const claimsRes = await fetchWithTimeout(claimsUrl, {}, 4000);
      if (!claimsRes.ok) continue;
      const claimsJson = await safeResponseJson(claimsRes, 'Wikidata claims fetch');
      const p18 = claimsJson?.entities?.[entityId]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
      if (p18) {
        // Construct Commons direct URL via Special:FilePath
        const encodedFilename = encodeURIComponent(p18.replace(/ /g, '_'));
        const fileUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodedFilename}`;
        console.log(`[WIKIDATA] Found P18 image for "${clean}" (${entityId}): ${fileUrl}`);
        return fileUrl;
      }
    }
    return null;
  } catch (err) {
    console.warn(`[WIKIDATA] fetchWikidataImage failed for "${title}":`, err);
    return null;
  }
}

// ─── NASA Images and Video Library ─────────────────────────────────────────
// Free, no API key required. Great for space, astronomy, physics, engineering.
async function fetchNASAImage(query: string): Promise<string | null> {
  try {
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=5`;
    const res = await fetchWithTimeout(url, {}, 5000);
    if (!res.ok) return null;
    const json = await safeResponseJson(res, 'NASA Images search');
    const items: any[] = json?.collection?.items ?? [];
    for (const item of items) {
      const links: any[] = item.links ?? [];
      const imgLink = links.find((l: any) => l.rel === 'preview' && l.href?.match(/\.(jpg|jpeg|png|webp)$/i));
      if (imgLink?.href) {
        console.log(`[NASA] Found image for "${query}": ${imgLink.href}`);
        return imgLink.href;
      }
    }
    return null;
  } catch (err) {
    console.warn(`[NASA] fetchNASAImage failed for "${query}":`, err);
    return null;
  }
}

// ─── The Metropolitan Museum of Art Open Access API ────────────────────────
// Free, no API key. Excellent for art history, archaeology, classical cultures.
async function fetchMetMuseumImage(query: string): Promise<string | null> {
  try {
    const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(query)}&hasImages=true&isPublicDomain=true`;
    const searchRes = await fetchWithTimeout(searchUrl, {}, 5000);
    if (!searchRes.ok) return null;
    const searchJson = await safeResponseJson(searchRes, 'Met Museum search');
    const objectIds: number[] = searchJson?.objectIDs ?? [];
    if (objectIds.length === 0) return null;

    // Fetch first result's image
    const objRes = await fetchWithTimeout(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectIds[0]}`, {}, 4000);
    if (!objRes.ok) return null;
    const objJson = await safeResponseJson(objRes, 'Met Museum object fetch');
    const imgUrl = objJson?.primaryImage || objJson?.primaryImageSmall;
    if (imgUrl) {
      console.log(`[MET] Found image for "${query}": ${imgUrl}`);
      return imgUrl;
    }
    return null;
  } catch (err) {
    console.warn(`[MET] fetchMetMuseumImage failed for "${query}":`, err);
    return null;
  }
}

// ─── Smithsonian Open Access ────────────────────────────────────────────────
// Free API key (env var SMITHSONIAN_API_KEY). Covers natural history, science, culture.

async function getSystemParameter(key: string): Promise<string | null> {
  try {
    const { data } = await supabaseAdmin
      .from('system_parameters')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (data?.value) return data.value;
  } catch (err) {
    console.warn(`[getSystemParameter] Failed to load key "${key}" from database:`, err);
  }
  const envKey = key === 'smithsonianApiKey' ? 'SMITHSONIAN_API_KEY' : 
                 key === 'unsplashApiKey' ? 'UNSPLASH_API_KEY' : key;
  return process.env[envKey] || null;
}

async function fetchUnsplashImage(query: string): Promise<{ url: string; sourceLabel: string } | null> {
  const apiKey = await getSystemParameter('unsplashApiKey');
  if (!apiKey) return null;
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3`;
    const res = await fetchWithTimeout(url, {
      headers: {
        'Authorization': `Client-ID ${apiKey}`
      }
    }, 5000);
    if (!res.ok) return null;
    const json = await safeResponseJson(res, 'Unsplash search');
    const results = json?.results ?? [];
    if (results.length > 0 && results[0]?.urls?.regular) {
      const imgUrl = results[0].urls.regular;
      const photo = results[0];
      
      // Trigger download tracking as required by Unsplash API Guidelines
      const downloadLocation = photo.links?.download_location;
      if (downloadLocation) {
        const downloadUrl = downloadLocation.includes('?') 
          ? `${downloadLocation}&client_id=${apiKey}`
          : `${downloadLocation}?client_id=${apiKey}`;
        
        fetchWithTimeout(downloadUrl, {
          headers: {
            'Authorization': `Client-ID ${apiKey}`
          }
        }, 3000).catch(e => console.warn('[UNSPLASH] Failed to trigger download endpoint:', e));
      }

      // Build proper photographer attribution and links as required by Unsplash guidelines:
      // "Photo by Annie Spratt on Unsplash" with referral UTM parameters
      const photographerName = photo.user?.name || photo.user?.username || 'Unknown Photographer';
      const photographerUsername = photo.user?.username;
      const photographerProfileUrl = photographerUsername 
        ? `https://unsplash.com/@${photographerUsername}?utm_source=OpenPrimer&utm_medium=referral`
        : `https://unsplash.com/?utm_source=OpenPrimer&utm_medium=referral`;
      const unsplashHomeUrl = `https://unsplash.com/?utm_source=OpenPrimer&utm_medium=referral`;

      const sourceLabel = `Photo by [${photographerName}](${photographerProfileUrl}) on [Unsplash](${unsplashHomeUrl})`;

      console.log(`[UNSPLASH] Found image for "${query}": ${imgUrl} | Attribution: ${sourceLabel}`);
      return { url: imgUrl, sourceLabel };
    }
    return null;
  } catch (err) {
    console.warn(`[UNSPLASH] fetchUnsplashImage failed for "${query}":`, err);
    return null;
  }
}

async function fetchSmithsonianImage(query: string): Promise<string | null> {
  const apiKey = await getSystemParameter('smithsonianApiKey');
  if (!apiKey) return null; // Skip silently if key not configured
  try {
    const url = `https://api.si.edu/openaccess/api/v1.0/search?q=${encodeURIComponent(query)}&api_key=${apiKey}&rows=3&media_type=Images`;
    const res = await fetchWithTimeout(url, {}, 5000);
    if (!res.ok) return null;
    const json = await safeResponseJson(res, 'Smithsonian search');
    const rows: any[] = json?.response?.rows ?? [];
    for (const row of rows) {
      const media: any[] = row?.content?.descriptiveNonRepeating?.online_media?.media ?? [];
      const img = media.find((m: any) => m.type === 'Images' && m.content);
      if (img?.content) {
        console.log(`[SMITHSONIAN] Found image for "${query}": ${img.content}`);
        return img.content;
      }
    }
    return null;
  } catch (err) {
    console.warn(`[SMITHSONIAN] fetchSmithsonianImage failed for "${query}":`, err);
    return null;
  }
}

// ─── Bibliothèque nationale de France (Gallica SRU API) ───────────────────
// Queries Gallica for public domain manuscripts and old books.
async function fetchGallicaImage(query: string): Promise<string | null> {
  try {
    const cleanQuery = query.trim();
    // Query Gallica SRU, filtering for public domain
    const sruUrl = `https://gallica.bnf.fr/SRU?operation=searchRetrieve&version=1.2&query=text%20all%20"${encodeURIComponent(cleanQuery)}"%20and%20(dc.rights%20all%20"domaine%20public"%20or%20dc.rights%20all%20"libre%20de%20droits")&maximumRecords=3`;
    
    const res = await fetchWithTimeout(sruUrl, {}, 5000);
    if (!res.ok) return null;
    const xmlText = await res.text();

    const identifierMatch = xmlText.match(/<dc:identifier>([^<]+ark:[^<]+)<\/dc:identifier>/i);
    if (identifierMatch && identifierMatch[1]) {
      const arkUrl = identifierMatch[1].trim();
      const arkPathMatch = arkUrl.match(/(ark:\/\d+\/\w+)/);
      if (arkPathMatch) {
        const directUrl = `https://gallica.bnf.fr/${arkPathMatch[1]}/f1.highres`;
        console.log(`[GALLICA] Found public domain document for "${cleanQuery}": ${directUrl}`);
        return directUrl;
      }
    }
    return null;
  } catch (err) {
    console.warn(`[GALLICA] fetchGallicaImage failed for "${query}":`, err);
    return null;
  }
}

// ─── Wellcome Collection (Catalogue API + IIIF) ────────────────────────────
// Free, no API key. Exceptional for anatomy, surgery, pathology, history of medicine.
// License: mostly Public Domain Mark (PDM) or CC-BY (verified via accessConditions).
async function fetchWellcomeCollectionImage(query: string): Promise<{ url: string; sourceLabel: string; sourceUrl: string } | null> {
  try {
    const cleanQuery = query.trim();
    const apiUrl = `https://api.wellcomecollection.org/catalogue/v2/images?query=${encodeURIComponent(cleanQuery)}&pageSize=5`;
    const res = await fetchWithTimeout(apiUrl, {}, 6000);
    if (!res.ok) return null;
    const json = await safeResponseJson(res, 'Wellcome Collection images search');
    const results: any[] = json?.results ?? [];
    for (const img of results) {
      // Verify image is openly accessible (status: open)
      const loc = img?.locations?.[0];
      const isOpen = loc?.accessConditions?.some((a: any) => a?.status?.id === 'open');
      if (!isOpen) continue;
      // Build IIIF image URL from the IIIF info.json URL: replace /info.json with /full/800,/0/default.jpg
      const iiifInfoUrl: string = loc?.url || '';
      if (!iiifInfoUrl.includes('iiif.wellcomecollection.org')) continue;
      const imageId = iiifInfoUrl.split('/image/')[1]?.split('/')[0];
      if (!imageId) continue;
      const imageUrl = `https://iiif.wellcomecollection.org/image/${imageId}/full/800,/0/default.jpg`;
      const licenseLabel = loc?.license?.label || 'Public Domain';
      const workTitle = img?.source?.title || cleanQuery;
      const sourceLabel = `Wellcome Collection — "${workTitle}" (${licenseLabel})`;
      const sourceUrl = `https://wellcomecollection.org/works/${img?.source?.id || ''}`;
      console.log(`[WELLCOME] Found image for "${cleanQuery}": ${imageUrl}`);
      return { url: imageUrl, sourceLabel, sourceUrl };
    }
    return null;
  } catch (err) {
    console.warn(`[WELLCOME] fetchWellcomeCollectionImage failed for "${query}":`, err);
    return null;
  }
}

// ─── NLM Digital Collections (National Library of Medicine / NIH) ────────────
// Free, no API key. ~70,000 historical images from the History of Medicine.
// Best for: anatomical illustrations, portraits of physicians, surgical instruments.
async function fetchNLMDigitalCollectionImage(query: string): Promise<{ url: string; sourceLabel: string; sourceUrl: string } | null> {
  try {
    const cleanQuery = query.trim();
    const apiUrl = `https://collections.nlm.nih.gov/api/search?query=${encodeURIComponent(cleanQuery)}&schema=imageSearch&from=0&size=5`;
    const res = await fetchWithTimeout(apiUrl, {}, 6000);
    if (!res.ok) return null;
    const json = await safeResponseJson(res, 'NLM Digital Collections search');
    const items: any[] = json?.results?.items ?? [];
    for (const item of items) {
      // NLM returns a thumbnail URL in the localId field and full image via IIIF
      const localId: string = item?.localId || '';
      if (!localId) continue;
      // Build the thumbnail / display image URL
      const imageUrl = `https://collections.nlm.nih.gov/api/iiif/${encodeURIComponent(localId)}/full/800,/0/default.jpg`;
      const title = item?.title || cleanQuery;
      const sourceUrl = `https://collections.nlm.nih.gov/catalog/${localId}`;
      const sourceLabel = `NLM Digital Collections / National Library of Medicine — "${title}" (Public Domain)`;
      console.log(`[NLM] Found image for "${cleanQuery}": ${imageUrl}`);
      return { url: imageUrl, sourceLabel, sourceUrl };
    }
    return null;
  } catch (err) {
    console.warn(`[NLM] fetchNLMDigitalCollectionImage failed for "${query}":`, err);
    return null;
  }
}

// ─── OpenStax / Gray's Anatomy Wikimedia Commons Booster ─────────────────────
// Searches Wikimedia Commons with source-specific suffixes to surface
// OpenStax (CC-BY 4.0) and Gray's Anatomy 1918 (Public Domain) illustrations.
async function fetchMedicalBookImage(
  query: string,
  source: 'grays' | 'openstax'
): Promise<{ url: string; sourceLabel: string; sourceUrl?: string } | null> {
  try {
    const suffix = source === 'grays' ? 'Gray anatomy' : 'OpenStax';
    const searchTerm = `${query} ${suffix}`;
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrnamespace=6&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*&gsrlimit=5`;
    const res = await fetchWithTimeout(url, {}, 5000);
    if (!res.ok) return null;
    const json = await safeResponseJson(res, `Wikimedia ${source} search`);
    const pages = json?.query?.pages;
    if (!pages) return null;
    for (const key of Object.keys(pages)) {
      const imgInfo = pages[key]?.imageinfo?.[0];
      const fileUrl: string = imgInfo?.url || '';
      if (!fileUrl.match(/\.(jpg|jpeg|png|svg|webp)$/i)) continue;
      if (source === 'grays') {
        const license: string = (imgInfo?.extmetadata?.LicenseShortName?.value || '').toLowerCase();
        // Gray's 1918 should be public domain
        if (license && !license.includes('public domain') && !license.includes('pd') && !license.includes('cc')) continue;
        console.log(`[GRAYS-ANATOMY] Found PD image for "${query}": ${fileUrl}`);
        return {
          url: fileUrl,
          sourceLabel: "Gray's Anatomy (Henry Gray, 1918) — Wikimedia Commons (Public Domain)",
          sourceUrl: imgInfo?.descriptionurl
        };
      } else {
        console.log(`[OPENSTAX] Found CC-BY image for "${query}": ${fileUrl}`);
        return {
          url: fileUrl,
          sourceLabel: 'OpenStax / Rice University — Wikimedia Commons (CC BY 4.0)',
          sourceUrl: imgInfo?.descriptionurl
        };
      }
    }
    return null;
  } catch (err) {
    console.warn(`[MEDICAL-BOOK] fetchMedicalBookImage (${source}) failed for "${query}":`, err);
    return null;
  }
}

// ─── Internet Archive (Archive.org API) ───────────────────────────────────
// Resolves royalty-free media (images, audio, or videos) from Archive.org.
async function fetchArchiveOrgMedia(
  query: string,
  mediaType: 'image' | 'audio' | 'video'
): Promise<{ url: string; sourceLabel: string } | null> {
  try {
    const cleanQuery = query.trim().replace(/"/g, '');
    const typeFilter = mediaType === 'image' ? 'image' : mediaType === 'audio' ? 'audio' : 'movies';
    
    // Construct search query with strict royalty-free license checking
    const searchUrl = `https://archive.org/advancedsearch.php?q=(${encodeURIComponent(
      `title:(${cleanQuery}) OR description:(${cleanQuery})`
    )}) AND mediatype:${typeFilter} AND (licenseurl:*creative* OR licenseurl:*publicdomain* OR usage_terms:*public* OR usage_terms:*domain*) AND -mediatype:collection&fl[]=identifier&fl[]=title&fl[]=licenseurl&rows=3&output=json`;

    const res = await fetchWithTimeout(searchUrl, {}, 5000);
    if (!res.ok) return null;
    const searchJson = await safeResponseJson(res, 'Archive.org search');
    const docs = searchJson?.response?.docs ?? [];
    if (docs.length === 0) return null;

    const identifier = docs[0].identifier;
    const itemTitle = docs[0].title || cleanQuery;
    const license = docs[0].licenseurl || 'Public Domain / CC';

    const metaUrl = `https://archive.org/metadata/${identifier}`;
    const metaRes = await fetchWithTimeout(metaUrl, {}, 4000);
    if (!metaRes.ok) return null;
    const metaJson = await safeResponseJson(metaRes, 'Archive.org metadata');
    const files: any[] = metaJson?.files ?? [];

    let targetFile = null;
    if (mediaType === 'image') {
      targetFile = files.find(f => f.name.match(/\.(jpg|jpeg|png|webp)$/i) && !f.name.includes('_thumb'));
    } else if (mediaType === 'audio') {
      targetFile = files.find(f => f.name.match(/\.(mp3|wav|ogg|oga)$/i));
    } else if (mediaType === 'video') {
      targetFile = files.find(f => f.name.match(/\.(mp4|webm|ogv)$/i));
    }

    if (targetFile?.name) {
      const directUrl = `https://archive.org/download/${identifier}/${encodeURIComponent(targetFile.name)}`;
      const sourceLabel = `Internet Archive: "${itemTitle}" (${license.includes('creativecommons.org') ? 'CC License' : 'Public Domain'})`;
      console.log(`[ARCHIVE.ORG] Resolved ${mediaType} for "${cleanQuery}": ${directUrl}`);
      return { url: directUrl, sourceLabel };
    }

    return null;
  } catch (err) {
    console.warn(`[ARCHIVE.ORG] fetchArchiveOrgMedia failed for "${query}":`, err);
    return null;
  }
}

export function getWikimediaPageUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes('commons.wikimedia.org/wiki/File:')) {
    return url;
  }
  if (url.includes('commons.wikimedia.org/wiki/Special:FilePath/')) {
    const parts = url.split('Special:FilePath/');
    if (parts[1]) {
      return `https://commons.wikimedia.org/wiki/File:${parts[1]}`;
    }
  }
  if (url.includes('upload.wikimedia.org/wikipedia/commons/')) {
    let cleanUrl = url;
    if (url.includes('/thumb/')) {
      cleanUrl = url.replace('/thumb/', '/');
      const lastSlashIdx = cleanUrl.lastIndexOf('/');
      if (lastSlashIdx !== -1) {
        cleanUrl = cleanUrl.substring(0, lastSlashIdx);
      }
    }
    const parts = cleanUrl.split('/commons/');
    if (parts[1]) {
      const fileParts = parts[1].split('/');
      const fileName = fileParts[fileParts.length - 1];
      if (fileName) {
        return `https://commons.wikimedia.org/wiki/File:${fileName}`;
      }
    }
  }
  return null;
}

export function getConciseQuery(description: string, alt: string, caption: string): string {
  const cleanAlt = (alt || '').trim().replace(/_/g, ' ');
  if (cleanAlt && cleanAlt.length > 3 && cleanAlt.length < 100 && !/placeholder|img|image|figure/i.test(cleanAlt)) {
    return cleanAlt;
  }

  const cleanCaption = (caption || '')
    .trim()
    .replace(/_/g, ' ')
    .replace(/^(?:Figure|Abbildung|Figura|图|الشكل|चित्र|خاکہ)\s*\d*\s*[:\-\u2013\u2014]?\s*/i, '')
    .split(/\s*[-—–]\s*Source\s*:/i)[0]
    .split(/\s*Source\s*:/i)[0]
    .trim();

  if (cleanCaption && cleanCaption.length > 3 && cleanCaption.length < 120) {
    return cleanCaption;
  }

  const desc = (description || '').trim().replace(/_/g, ' ');
  if (desc) {
    const sentences = desc.split(/[.;!?]/);
    const firstSentence = (sentences[0] || '').trim();
    if (firstSentence && firstSentence.length > 3 && firstSentence.length < 100) {
      return firstSentence;
    }
    if (firstSentence && firstSentence.length >= 100) {
      const truncated = firstSentence.slice(0, 80);
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 30) {
        return truncated.slice(0, lastSpace).trim();
      }
      return truncated.trim();
    }
  }

  return (cleanAlt || cleanCaption || desc || '').trim();
}

async function optimizeQueryWithGemini(rawQuery: string, lang: string = 'en', forceEnglish: boolean = false): Promise<string> {
  const trimmed = rawQuery.trim();
  const words = trimmed.split(/\s+/);
  // If it's already short (e.g. 3 words or less), just return it
  if (words.length <= 3 && !forceEnglish) {
    return trimmed;
  }

  try {
    let promptText = '';
    if (forceEnglish) {
      promptText = `Tu es un assistant de recherche documentaire d'élite.
Considère la description de média suivante : "${trimmed}".
Ta tâche consiste à identifier l'entité canonique principale (personnage historique, livre célèbre, œuvre d'art, monument, concept scientifique, espèce biologique) qui fait l'objet de cette description, afin de pouvoir la rechercher sur Wikidata et Wikipédia.

Règles critiques d'optimisation :
1. Extrais le nom propre ou le terme scientifique canonique de l'entité principale en ANGLAIS.
2. ÉLIMINE complètement les actions, les descriptions physiques et les modalités d'image (ex: "Portrait de", "Statue de", "Dessin de", "Croquis de", "Schéma de", "Frontispice de", "Photo de", "observant le ciel", "tenant un livre").
3. Exemples :
   - "Portrait en buste de René Descartes" -> "René Descartes"
   - "Frontispice des Principia Mathematica de Newton" -> "Philosophiae Naturalis Principia Mathematica"
   - "Croquis des lunes de Jupiter dessiné par Galilée" -> "Sidereus Nuncius" ou "Galileo Galilei"
   - "Schéma fonctionnel de l'effet Doppler avec les ondes" -> "Doppler effect"
   - "Photo d'un lion rugissant dans la savane africaine" -> "Panthera leo" ou "Lion"
4. Réponds UNIQUEMENT avec ce nom d'entité canonique sur une seule ligne, sans guillemets, sans ponctuation et sans aucun autre commentaire.`;
    } else {
      promptText = `Tu es un assistant de recherche documentaire d'élite.
Considère la description de média suivante : "${trimmed}".
Ta tâche consiste à identifier l'entité canonique principale (personnage historique, livre célèbre, œuvre d'art, monument, concept scientifique, espèce biologique) qui fait l'objet de cette description, afin de pouvoir la rechercher sur Wikidata et Wikipédia.

Règles critiques d'optimisation :
1. Extrais le nom propre ou le terme scientifique canonique de l'entité principale (en français ou en langue d'origine).
2. ÉLIMINE complètement les actions, les descriptions physiques et les modalités d'image (ex: "Portrait de", "Statue de", "Dessin de", "Croquis de", "Schéma de", "Frontispice de", "Photo de", "observant le ciel", "tenant un livre").
3. Exemples :
   - "Portrait en buste de René Descartes" -> "René Descartes"
   - "Frontispice des Principia Mathematica de Newton" -> "Philosophiae Naturalis Principia Mathematica"
   - "Croquis des lunes de Jupiter dessiné par Galilée" -> "Sidereus Nuncius" ou "Galileo Galilei"
   - "Schéma fonctionnel de l'effet Doppler avec les ondes" -> "Effet Doppler"
   - "Photo d'un lion rugissant dans la savane africaine" -> "Panthera leo" ou "Lion"
4. Réponds UNIQUEMENT avec ce nom d'entité canonique sur une seule ligne, sans guillemets, sans ponctuation et sans aucun autre commentaire.`;
    }

    const res = await callVertexAI({
      task: 'course_generation',
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.1
      }
    });

    if (res && res.ok) {
      const resJson = await res.json();
      const text = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const optimized = text.trim().replace(/["']/g, '');
        if (optimized && optimized.length > 0) {
          return optimized;
        }
      }
    }
  } catch (err) {
    console.warn(`[MEDIA-RESOLVER] optimizeQueryWithGemini failed for "${trimmed}":`, err);
  }

  return trimmed;
}

async function generateGenericQueryWithGemini(specificQuery: string, lang: string = 'en'): Promise<string> {
  try {
    const promptText = `Tu es un assistant de recherche documentaire d'élite.
Considère la description de média spécifique suivante : "${specificQuery}".
Cette description est trop rare ou spécifique pour trouver une image exacte dans les banques de données (ex: "le bouton de la veste d'Einstein" ou "la tasse de chocolat de Louis XIV").
Propose un concept, une entité, un objet ou un personnage historique beaucoup plus simple, basique et générique lié à cette description, qui a de fortes chances d'exister en image libre de droits (ex: pour "le bouton de la veste d'Einstein", propose "Albert Einstein" ; pour "la tasse de chocolat de Louis XIV", propose "Louis XIV" ou "Château de Versailles" ; pour "la vibration de l'atome d'hydrogène", propose "atome hydrogène").
Réponds UNIQUEMENT avec ce terme générique simplifié (1 à 3 mots), en français ou en anglais, sans guillemets, sans ponctuation finale et sans autre texte explicatif.`;

    const res = await callVertexAI({
      task: 'course_generation',
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.1
      }
    });

    if (res && res.ok) {
      const resJson = await res.json();
      const text = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const generic = text.trim().replace(/["']/g, '');
        if (generic && generic.length > 0) {
          console.log(`[MEDIA-RESOLVER] Generated generic query from "${specificQuery}": "${generic}"`);
          return generic;
        }
      }
    }
  } catch (err) {
    console.warn(`[MEDIA-RESOLVER] generateGenericQueryWithGemini failed for "${specificQuery}":`, err);
  }
  return specificQuery;
}

async function describeImageWithGemini(imageUrl: string, lang: string = 'fr'): Promise<string | null> {
  try {
    const resImg = await fetchWithTimeout(imageUrl, {}, 10000);
    if (!resImg.ok) {
      console.warn(`[MEDIA-RESOLVER] Failed to download image for description: ${imageUrl}`);
      return null;
    }
    const contentType = resImg.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await resImg.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const targetLangName = lang.toLowerCase() === 'fr' ? 'français' :
                           lang.toLowerCase() === 'es' ? 'espagnol' :
                           lang.toLowerCase() === 'de' ? 'allemand' :
                           lang.toLowerCase() === 'zh' ? 'chinois' : 'anglais';

    const promptText = `Analyse cette image.
Rédige une description concise, neutre, informative et factuelle (1 phrase, environ 10 à 25 mots) de ce qui est visible dans cette image, adaptée pour servir de légende (caption) et de texte alternatif (alt) pour des étudiants dans un cours pédagogique.
Génère la description en ${targetLangName}.
Réponds UNIQUEMENT avec la description générée, sans introduire de texte explicatif, sans guillemets, et sans préambule du type "Cette image montre...".`;

    const res = await callVertexAI({
      task: 'course_generation',
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: contentType.split(';')[0],
              data: base64Data
            }
          },
          {
            text: compressPromptText(promptText)
          }
        ]
      }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.2
      }
    });

    if (res && res.ok) {
      const json = await res.json();
      const desc = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (desc) {
        console.log(`[MEDIA-RESOLVER] Gemini generated new description in ${targetLangName}: "${desc}"`);
        return desc;
      }
    }
  } catch (err) {
    console.warn('[MEDIA-RESOLVER] Error describing image with Gemini:', err);
  }
  return null;
}

async function searchCascade(
  query: string,
  queryEnglish: string,
  lang: string,
  discipline?: string,
  validationDesc?: string,
  allowUnsplash: boolean = true
): Promise<{ url: string; sourceLabel: string; sourceUrl?: string; isSoftValidated?: boolean; description?: string } | null> {
  // Helper to run hard validation first, and if it fails, run soft validation
  const validateWithSoftFallback = async (imgUrl: string, originalDesc: string, fallbackEntity: string): Promise<{ valid: boolean; soft: boolean }> => {
    const hardValid = await validateImageWithGemini(imgUrl, originalDesc);
    if (hardValid) {
      return { valid: true, soft: false };
    }
    console.log(`[MEDIA-RESOLVER] Hard validation failed for "${originalDesc}". Running soft fallback validation against "${fallbackEntity}"...`);
    const softValid = await validateImageSoftWithGemini(imgUrl, fallbackEntity);
    return { valid: softValid, soft: softValid };
  };

  // 1. Wikidata P18 — canonical, most reliable for named entities
  const wdImage = await fetchWikidataImage(query, lang);
  if (wdImage) {
    const { valid, soft } = await validateWithSoftFallback(wdImage, validationDesc || query, query);
    if (valid) {
      return { 
         url: wdImage, 
         sourceLabel: 'Wikimedia Commons',
         sourceUrl: getWikimediaPageUrl(wdImage) || undefined,
         isSoftValidated: soft ? true : undefined
      };
    }
  }

  // 2. Wikipedia/Wikimedia Commons search
  const wikiImageResult = await fetchWikipediaImage(query, lang);
  if (wikiImageResult) {
    const wikiImage = wikiImageResult.url;
    const { valid, soft } = await validateWithSoftFallback(wikiImage, validationDesc || query, query);
    if (valid) {
      return { 
         url: wikiImage, 
         sourceLabel: 'Wikimedia Commons',
         sourceUrl: wikiImageResult.fallbackUrl || getWikimediaPageUrl(wikiImage) || undefined,
         isSoftValidated: soft ? true : undefined
      };
    }
  }

  // 3. Gallica BNF — for old books, French manuscripts, historical texts
  const disc = (discipline || '').toLowerCase();
  const isHistoryOrLit = disc.includes('hist') || disc.includes('liter') || disc.includes('class') || lang === 'fr';
  if (isHistoryOrLit) {
    const gallicaImage = await fetchGallicaImage(query);
    if (gallicaImage) {
      const { valid, soft } = await validateWithSoftFallback(gallicaImage, validationDesc || query, query);
      if (valid) {
        return { 
          url: gallicaImage, 
          sourceLabel: 'Gallica / Bibliothèque nationale de France (Domaine Public)',
          sourceUrl: gallicaImage,
          isSoftValidated: soft ? true : undefined
        };
      }
    }
  }

  // 3b. Medical/Anatomy specialist sources — highest-quality institutional imagery
  const isMedical = disc.includes('anat') || disc.includes('medic') || disc.includes('physiol') ||
    disc.includes('biolog') || disc.includes('chirur') || disc.includes('pathol') ||
    disc.includes('surg') || disc.includes('histol') || disc.includes('embry') ||
    disc.includes('neuros') || disc.includes('cardio') || disc.includes('ophtalm') ||
    disc.includes('dent') || disc.includes('pharma') || disc.includes('santé') ||
    disc.includes('health') || disc.includes('cliniq') || disc.includes('clinic');
  if (isMedical) {
    // Gray's Anatomy 1918 (Public Domain) — highest priority for anatomy illustrations
    const graysResult = await fetchMedicalBookImage(queryEnglish, 'grays');
    if (graysResult) {
      const { valid, soft } = await validateWithSoftFallback(graysResult.url, validationDesc || queryEnglish, queryEnglish);
      if (valid) {
        return {
          url: graysResult.url,
          sourceLabel: graysResult.sourceLabel,
          sourceUrl: graysResult.sourceUrl,
          isSoftValidated: soft ? true : undefined
        };
      }
    }
    // Wellcome Collection — exceptional for history of medicine, surgical illustrations, pathology
    const wellcomeResult = await fetchWellcomeCollectionImage(queryEnglish);
    if (wellcomeResult) {
      const { valid, soft } = await validateWithSoftFallback(wellcomeResult.url, validationDesc || queryEnglish, queryEnglish);
      if (valid) {
        return {
          url: wellcomeResult.url,
          sourceLabel: wellcomeResult.sourceLabel,
          sourceUrl: wellcomeResult.sourceUrl,
          isSoftValidated: soft ? true : undefined
        };
      }
    }
    // OpenStax (CC-BY 4.0) — modern, high-quality anatomy & biology diagrams
    const openstaxResult = await fetchMedicalBookImage(queryEnglish, 'openstax');
    if (openstaxResult) {
      const { valid, soft } = await validateWithSoftFallback(openstaxResult.url, validationDesc || queryEnglish, queryEnglish);
      if (valid) {
        return {
          url: openstaxResult.url,
          sourceLabel: openstaxResult.sourceLabel,
          sourceUrl: openstaxResult.sourceUrl,
          isSoftValidated: soft ? true : undefined
        };
      }
    }
    // NLM Digital Collections — ~70,000 images from the History of Medicine
    const nlmResult = await fetchNLMDigitalCollectionImage(queryEnglish);
    if (nlmResult) {
      const { valid, soft } = await validateWithSoftFallback(nlmResult.url, validationDesc || queryEnglish, queryEnglish);
      if (valid) {
        return {
          url: nlmResult.url,
          sourceLabel: nlmResult.sourceLabel,
          sourceUrl: nlmResult.sourceUrl,
          isSoftValidated: soft ? true : undefined
        };
      }
    }
  }

  // 4. NASA — prioritise for science/space disciplines
  const isScience = disc.includes('astro') || disc.includes('physi') || disc.includes('spac') ||
    disc.includes('cosmo') || disc.includes('bio') || disc.includes('chem') || disc.includes('geo');
  if (isScience) {
    const nasaImage = await fetchNASAImage(queryEnglish);
    if (nasaImage) {
      const { valid, soft } = await validateWithSoftFallback(nasaImage, validationDesc || queryEnglish, queryEnglish);
      if (valid) {
        return { 
          url: nasaImage, 
          sourceLabel: 'NASA Images (Public Domain)',
          isSoftValidated: soft ? true : undefined
        };
      }
    }
  }

  // 5. Met Museum — for art, history, archaeology, classical studies
  const isArtHistory = disc.includes('art') || disc.includes('archae') || disc.includes('philosoph');
  if (isArtHistory) {
    const metImage = await fetchMetMuseumImage(queryEnglish);
    if (metImage) {
      const { valid, soft } = await validateWithSoftFallback(metImage, validationDesc || queryEnglish, queryEnglish);
      if (valid) {
        return { 
          url: metImage, 
          sourceLabel: 'The Metropolitan Museum of Art (CC0)',
          isSoftValidated: soft ? true : undefined
        };
      }
    }
  }

  // 6. Archive.org Fallback for Images
  const archiveImage = await fetchArchiveOrgMedia(queryEnglish, 'image');
  if (archiveImage?.url) {
    const { valid, soft } = await validateWithSoftFallback(archiveImage.url, validationDesc || queryEnglish, queryEnglish);
    if (valid) {
      return {
        url: archiveImage.url,
        sourceLabel: archiveImage.sourceLabel,
        sourceUrl: archiveImage.url,
        isSoftValidated: soft ? true : undefined
      };
    }
  }

  // 7. Smithsonian — broad fallback for natural history, science, culture
  const smithsonianImage = await fetchSmithsonianImage(queryEnglish);
  if (smithsonianImage) {
    const { valid, soft } = await validateWithSoftFallback(smithsonianImage, validationDesc || queryEnglish, queryEnglish);
    if (valid) {
      return { 
        url: smithsonianImage, 
        sourceLabel: 'Smithsonian Open Access (CC0)',
        isSoftValidated: soft ? true : undefined
      };
    }
  }

  // 8. NASA as universal last resort (very broad image library)
  if (!isScience) {
    const nasaFallback = await fetchNASAImage(queryEnglish);
    if (nasaFallback) {
      const { valid, soft } = await validateWithSoftFallback(nasaFallback, validationDesc || queryEnglish, queryEnglish);
      if (valid) {
        return { 
          url: nasaFallback, 
          sourceLabel: 'NASA Images (Public Domain)',
          isSoftValidated: soft ? true : undefined
        };
      }
    }
  }

  // 9. Unsplash fallback
  if (allowUnsplash) {
    const unsplashResult = await fetchUnsplashImage(queryEnglish);
    if (unsplashResult) {
      return {
        url: unsplashResult.url,
        sourceLabel: unsplashResult.sourceLabel,
        sourceUrl: unsplashResult.url
      };
    }
  }

  return null;
}

export async function resolveImageFromSources(
  title: string,
  lang: string = 'en',
  discipline?: string,
  validationPrompt?: string
): Promise<{ url: string; sourceLabel: string; sourceUrl?: string; description?: string } | null> {
  const originalQuery = title.trim().replace(/_/g, ' ');
  const validationDesc = validationPrompt ? validationPrompt : originalQuery;

  // 1. Check Persistent Disk Cache
  const cached = getCachedMedia(originalQuery, lang);
  if (cached) {
    console.log(`[MEDIA-CACHE] Cache HIT for "${originalQuery}" [${lang}]:`, cached);
    return cached;
  }

  // Optimize query with Gemini for DB search
  const query = await optimizeQueryWithGemini(originalQuery, lang);
  console.log(`[MEDIA-RESOLVER] Original query: "${originalQuery}" | Base Optimized query: "${query}"`);

  // 2. Generate progressive query relaxation levels
  const relaxations = await generateQueryRelaxationsWithGemini(query, lang);
  
  // Try each relaxation level in cascade
  for (const relQuery of relaxations) {
    console.log(`[MEDIA-RESOLVER] Trying relaxation level: "${relQuery}"`);
    const relQueryEnglish = lang.startsWith('en') ? relQuery : await optimizeQueryWithGemini(relQuery, lang, true);
    
    // Try specific search on this relaxed term — skip Unsplash here
    let result = await searchCascade(relQuery, relQueryEnglish, lang, discipline, validationDesc, false);
    if (result) {
      // Handle alignment if soft-validated
      if (result.isSoftValidated) {
        console.log(`[MEDIA-RESOLVER] Image accepted via soft validation. Realigning description for ${result.url}...`);
        const realignedDesc = await describeImageWithGemini(result.url, lang);
        if (realignedDesc) {
          result.description = realignedDesc;
        }
      }
      
      const finalResult = {
        url: result.url,
        sourceLabel: result.sourceLabel,
        sourceUrl: result.sourceUrl,
        description: result.description
      };
      
      // Save to cache
      setCachedMedia(originalQuery, lang, finalResult);
      return finalResult;
    }
  }

  // 3. Relaxation levels failed, let's try a simplified/generic query fallback
  console.log(`[MEDIA-RESOLVER] All relaxed searches failed for "${originalQuery}". Attempting generic fallback...`);
  const genericQuery = await generateGenericQueryWithGemini(originalQuery, lang);
  if (genericQuery && genericQuery !== originalQuery) {
    const genericOptimized = await optimizeQueryWithGemini(genericQuery, lang);
    const genericEnglish = lang.startsWith('en') ? genericOptimized : await optimizeQueryWithGemini(genericQuery, lang, true);
    console.log(`[MEDIA-RESOLVER] Generic query generated: "${genericQuery}" | Optimized: "${genericOptimized}" | English: "${genericEnglish}"`);
    
    const genericResult = await searchCascade(genericOptimized, genericEnglish, lang, discipline, genericQuery, true);
    if (genericResult) {
      console.log(`[MEDIA-RESOLVER] Generic fallback succeeded. Generating description to align content: ${genericResult.url}`);
      const newDescription = await describeImageWithGemini(genericResult.url, lang);
      
      const finalResult = {
        url: genericResult.url,
        sourceLabel: genericResult.sourceLabel,
        sourceUrl: genericResult.sourceUrl,
        description: newDescription || undefined
      };
      
      setCachedMedia(originalQuery, lang, finalResult);
      return finalResult;
    }
  }

  // 4. Last-resort Unsplash fallback
  const finalUnsplashQuery = genericQuery || originalQuery;
  if (finalUnsplashQuery) {
    const finalUnsplashOptimized = await optimizeQueryWithGemini(finalUnsplashQuery, lang, true);
    console.log(`[MEDIA-RESOLVER] Ultimate fallback to Unsplash for: "${finalUnsplashOptimized}"`);
    const unsplashResult = await fetchUnsplashImage(finalUnsplashOptimized);
    if (unsplashResult) {
      console.log(`[MEDIA-RESOLVER] Unsplash ultimate fallback succeeded. Generating description to align content: ${unsplashResult.url}`);
      const newDescription = await describeImageWithGemini(unsplashResult.url, lang);
      
      const finalResult = {
        url: unsplashResult.url,
        sourceLabel: unsplashResult.sourceLabel,
        sourceUrl: unsplashResult.url,
        description: newDescription || undefined
      };
      
      setCachedMedia(originalQuery, lang, finalResult);
      return finalResult;
    }
  }

  return null;
}

// Media-specific search prioritising Wikimedia Commons search first, and Wikipedia Search API second with English fallback
async function fetchWikipediaImage(title: string, lang: string = 'fr'): Promise<{ url: string; fallbackUrl: string; pageTitle: string } | null> {
  try {
    const cleanTitle = title.trim();
    
    // Step A: Search Wikimedia Commons API (media repository) first
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanTitle)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*`;
    try {
       const commRes = await fetchWithTimeout(commonsUrl, {}, 4000);
       if (commRes.ok) {
         const commJson = await commRes.json();
         const pages = commJson.query?.pages;
         if (pages) {
           for (const key of Object.keys(pages)) {
             const imgInfo = pages[key]?.imageinfo?.[0];
             const fileUrl = imgInfo?.url;
             if (fileUrl && (
               fileUrl.endsWith('.jpg') || 
               fileUrl.endsWith('.jpeg') || 
               fileUrl.endsWith('.png') || 
               fileUrl.endsWith('.svg') || 
               fileUrl.endsWith('.webp')
             )) {
               console.log(`[WIKIMEDIA-SEARCH] Found direct media URL for "${cleanTitle}": ${fileUrl}`);
               const pageUrl = getWikimediaPageUrl(fileUrl) || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileUrl.substring(fileUrl.lastIndexOf('/') + 1))}`;
               return {
                 url: fileUrl,
                 fallbackUrl: pageUrl,
                 pageTitle: cleanTitle
               };
             }
           }
         }
       }
    } catch (err) {
      console.warn(`[WIKIMEDIA-SEARCH] Direct Commons search failed for "${cleanTitle}":`, err);
    }

    // Step B: Fallback to Wikipedia Search API (fuzzy page query)
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanTitle)}&format=json&origin=*`;
    const searchRes = await fetchWithTimeout(searchUrl, {}, 4000);
    if (!searchRes.ok) return null;
    const searchJson = await safeResponseJson(searchRes, 'Wikipedia page search');
    const searchResults = searchJson.query?.search;
    
    if (!searchResults || searchResults.length === 0) {
      // Try English search as final fallback
      if (lang !== 'en') {
        return fetchWikipediaImage(title, 'en');
      }
      return null;
    }
    
    const pageTitle = searchResults[0].title;
    console.log(`[WIKIPEDIA-SEARCH] Found matching article page: "${pageTitle}" for query "${cleanTitle}"`);
    
    // Step C: Retrieve original image from page title
    const pageImgUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=original&titles=${encodeURIComponent(pageTitle)}&format=json&origin=*`;
    const imgRes = await fetchWithTimeout(pageImgUrl, {}, 4000);
    if (!imgRes.ok) return null;
    const imgJson = await safeResponseJson(imgRes, 'Wikipedia pageimage fetch');
    const pages = imgJson.query?.pages;
    if (!pages) return null;
    
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1') return null;
    
    const sourceUrl = pages[pageId]?.original?.source || pages[pageId]?.thumbnail?.source;
    if (!sourceUrl) return null;
    const fallbackUrl = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replace(/\s/g, '_'))}`;
    return {
      url: sourceUrl,
      fallbackUrl: fallbackUrl,
      pageTitle: pageTitle
    };
  } catch (err) {
    console.warn(`[MEDIA-RESOLVER] fetchWikipediaImage failed for "${title}":`, err);
    return null;
  }
}

// Wikimedia Commons Audio Fetcher
export async function fetchWikimediaAudio(title: string): Promise<string | null> {
  try {
    const rawTitle = title.trim();
    const cleanTitle = await optimizeQueryWithGemini(rawTitle);
    if (cleanTitle !== rawTitle) {
      console.log(`[MEDIA-RESOLVER] Optimized audio search query from "${rawTitle}" to "${cleanTitle}"`);
    }
    // Search Wikimedia Commons in Namespace 6 (File) with audio formats
    const searchQuery = `${cleanTitle} (filetype:ogg OR filetype:wav OR filetype:mp3 OR filetype:oga)`;
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchQuery)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*`;
    
    const res = await fetchWithTimeout(url, {}, 4000);
    if (!res.ok) return null;
    const json = await safeResponseJson(res, 'Wikimedia audio search');
    const pages = json.query?.pages;
    if (!pages) return null;
    
    for (const key of Object.keys(pages)) {
      const imgInfo = pages[key]?.imageinfo?.[0];
      const fileUrl = imgInfo?.url;
      if (fileUrl && (
        fileUrl.endsWith('.ogg') || 
        fileUrl.endsWith('.mp3') || 
        fileUrl.endsWith('.wav') || 
        fileUrl.endsWith('.oga')
      )) {
        console.log(`[MEDIA-RESOLVER] Found real Wikimedia Commons audio for "${title}": ${fileUrl}`);
        return fileUrl;
      }
    }
    return null;
  } catch (err) {
    console.warn(`[MEDIA-RESOLVER] Wikimedia audio search failed for "${title}":`, err);
    return null;
  }
}


// Google Lyria Music Generation (via Gemini API)
// Generates a short musical/audio clip from a text prompt — the audio equivalent of Imagen.
// Tier 2 fallback: used when Wikimedia Commons has no CC file for the requested sound.
async function generateLyriaAudio(prompt: string, durationHint: string = '30s'): Promise<Buffer | null> {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn('[MEDIA-RESOLVER] No GEMINI_API_KEY — skipping Lyria generation.');
      return null;
    }

    // Use lyria-3-clip-preview for short clips (≤30s), lyria-3-pro-preview for longer ones
    const usePro = durationHint.includes('min') || parseInt(durationHint) > 30;
    const model = usePro ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

    const lyriaUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    console.log(`[MEDIA-RESOLVER] Generating audio via Lyria (${model}) for: "${prompt.substring(0, 60)}..."`);

    const res = await fetchWithTimeout(lyriaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: 'audio/mpeg' }
      })
    }, 12000);

    if (!res.ok) {
      const err = await res.text();
      console.warn(`[MEDIA-RESOLVER] Lyria API error (${res.status}): ${err.substring(0, 200)}`);
      return null;
    }

    // Response may be JSON with base64 audio, or raw binary
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await safeResponseJson(res, 'Lyria audio generation');
      // Try to extract base64 audio from candidates
      const audioData = json?.candidates?.[0]?.content?.parts?.find(
        (p: any) => p.inlineData?.mimeType?.startsWith('audio/')
      )?.inlineData?.data;
      if (audioData) {
        console.log(`[MEDIA-RESOLVER] Lyria generated audio (base64 inline) for: "${prompt.substring(0, 40)}"`);
        return Buffer.from(audioData, 'base64');
      }
      console.warn('[MEDIA-RESOLVER] Lyria returned JSON but no audio inline data found.');
      return null;
    }

    // Raw binary audio response
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length > 1000) {
      console.log(`[MEDIA-RESOLVER] Lyria generated raw audio (${buffer.length} bytes) for: "${prompt.substring(0, 40)}"`);
      return buffer;
    }

    return null;
  } catch (err) {
    console.warn('[MEDIA-RESOLVER] Lyria generation exception:', err);
    return null;
  }
}

// Build a Lyria prompt from an audio title — adapts style based on content type
function buildLyriaPrompt(title: string): string {
  const t = title.toLowerCase();

  // Music notation / instruments
  if (t.includes('note') || t.includes('scale') || t.includes('chord') || t.includes('piano') || t.includes('guitar') || t.includes('violin') || t.includes('bach') || t.includes('beethoven') || t.includes('mozart') || t.includes('prelude') || t.includes('symphony')) {
    return `Generate a short, high-fidelity musical audio clip: ${title}. Use acoustic instruments, clean studio quality, no vocals.`;
  }

  // Nature sounds
  if (t.includes('bird') || t.includes('rain') || t.includes('thunder') || t.includes('wolf') || t.includes('ocean') || t.includes('wind') || t.includes('forest') || t.includes('nightingale') || t.includes('song') || t.includes('sound')) {
    return `Generate a realistic ambient nature sound: ${title}. High fidelity, no music, no voice.`;
  }

  // Heartbeat / medical / science sounds
  if (t.includes('heartbeat') || t.includes('heart') || t.includes('pulse') || t.includes('sinus') || t.includes('rhythm')) {
    return `Generate a realistic medical auscultation sound: ${title}. Clinical quality, clear rhythm.`;
  }

  // Default: atmospheric/contextual music
  return `Generate a short, atmospheric audio clip suitable for an educational course. Subject: ${title}. Calm, focused, no lyrics.`;
}

// Check if the audio title or customText is intended to be spoken speech
function isSpeechAudio(title: string, customText: string): boolean {
  const t = title.toLowerCase().trim();
  const c = (customText || '').toLowerCase().trim();

  // 1. Explicitly block any non-speech sounds (music, nature, animals, etc.)
  const nonSpeechKeywords = [
    'song', 'chant', 'bird', 'oiseau', 'barking', 'meow', 'cri', 'sound', 'bruit', 
    'noise', 'music', 'musique', 'symphony', 'orchestra', 'instrument', 'piano', 
    'violin', 'guitar', 'drum', 'flute', 'wind', 'vent', 'rain', 'pluie', 'thunder', 
    'tonnerre', 'storm', 'tempête', 'wave', 'vague', 'explosion', 'siren', 'sirène', 
    'beep', 'bip', 'effect', 'effet', 'ambient', 'ambiance', 'heartbeat', 'heart', 
    'pulse', 'sinus', 'rhythm', 'note', 'scale', 'chord', 'bach', 'beethoven', 'mozart', 
    'prelude', 'sinusoid', 'frequency', 'fréquence', 'signal', 'tone'
  ];

  if (nonSpeechKeywords.some(kw => t.includes(kw) || c.includes(kw))) {
    return false;
  }

  // 2. Explicitly block historical speeches, addresses, conferences, talks, interviews
  // because they require authentic audio, not synthesized text.
  const historicalOrEventKeywords = [
    'speech', 'discours', 'adresse', 'allocution', 'conférence', 'lecture', 'talk', 
    'interview', 'debate', 'débat', 'declaration', 'déclaration', 'proclamation'
  ];

  if (historicalOrEventKeywords.some(kw => t.includes(kw))) {
    return false;
  }

  // 3. Only synthesize if it is a pronunciation guide, language word learning, phonetics, or vocabulary practice.
  const pronunciationKeywords = [
    'prononciation', 'pronunciation', 'prononcer', 'pronounce', 'phonème', 'phoneme', 
    'diphthong', 'diphthongue', 'voyelle', 'vowel', 'consonne', 'consonant', 'digraphe', 
    'digraph', 'syllable', 'syllabe', 'word', 'vocabulaire', 'vocabulary', 'mot', 'parler', 
    'speak', 'langue', 'language', 'accent'
  ];

  if (pronunciationKeywords.some(kw => t.includes(kw) || c.includes(kw))) {
    return true;
  }

  // 4. Default: If customText is provided and it is short (representing a word/phrase to learn), allow it.
  if (c !== '') {
    const words = c.split(/\s+/);
    if (words.length <= 5) {
      return true;
    }
  }

  // Otherwise, default to false. Do not generate TTS for general/historical content.
  return false;
}

// Google Cloud Text-to-Speech API caller
async function synthesizeSpeech(text: string, lang: string = 'fr'): Promise<Buffer | null> {
  try {
    const token = await getGoogleAccessToken();
    if (!token) return null;

    const langCode = lang.toLowerCase() === 'fr' ? 'fr-FR' : 
                     lang.toLowerCase() === 'es' ? 'es-ES' :
                     lang.toLowerCase() === 'de' ? 'de-DE' :
                     lang.toLowerCase() === 'zh' ? 'zh-CN' : 'en-US';

    const voiceName = langCode === 'fr-FR' ? 'fr-FR-Standard-A' :
                      langCode === 'en-US' ? 'en-US-Standard-A' :
                      langCode === 'es-ES' ? 'es-ES-Standard-A' :
                      langCode === 'de-DE' ? 'de-DE-Standard-A' : 'zh-CN-Standard-A';

    const ttsUrl = 'https://texttospeech.googleapis.com/v1/text:synthesize';
    const body = {
      input: { text },
      voice: { languageCode: langCode, name: voiceName },
      audioConfig: { audioEncoding: 'MP3' }
    };

    console.log(`[MEDIA-RESOLVER] Synthesizing speech for: "${text.substring(0, 40)}..." in ${langCode}`);
    const res = await fetchWithTimeout(ttsUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    }, 8000);

    if (!res.ok) {
      const err = await res.text();
      console.error('[MEDIA-RESOLVER] TTS Synthesis failed:', err);
      return null;
    }

    const data = await safeResponseJson(res, 'Google TTS synthesis');
    if (data.audioContent) {
      return Buffer.from(data.audioContent, 'base64');
    }
    return null;
  } catch (err) {
    console.error('[MEDIA-RESOLVER] Exception during speech synthesis:', err);
    return null;
  }
}

export function isExistingArtwork(src: string, label: string): boolean {
  const text = `${src} ${label}`.toLowerCase();
  const decoded = decodeURIComponent(text);
  
  const keywords = [
    'peinture', 'painting', 'tableau', 'fresco', 'fresque', 'oil on canvas', 'huile sur toile', 'watercolor', 'aquarelle',
    'sculpture', 'statue', 'bust', 'buste', 'marble', 'marbre', 'bronze',
    'photo', 'photograph', 'photographie', 'daguerreotype',
    'mona lisa', 'joconde', 'starry night', 'nuit étoilée', 'nuit etoilee', 'ménines', 'menines', 'guernica', 
    'last supper', 'cène', 'cene', 'david', 'venus de milo', 'penseur', 'thinker', 'laocoon', 'nefertiti', 'scream', 'cri',
    'birth of venus', 'naissance de vénus', 'naissance de venus', 'girl with a pearl earring', 'jeune fille à la perle',
    'liberté guidant le peuple', 'liberty leading the people', 'le baiser', 'the kiss',
    'da vinci', 'leonardo da vinci', 'vincent van gogh', 'van gogh', 'michelangelo', 'michel-ange', 'picasso', 
    'velázquez', 'velazquez', 'rembrandt', 'vermeer', 'claude monet', 'monet', 'edouard manet', 'manet', 
    'auguste renoir', 'renoir', 'edgar degas', 'degas', 'salvador dali', 'dali', 'rene magritte', 'magritte', 
    'gustav klimt', 'klimt', 'edvard munch', 'munch', 'auguste rodin', 'rodin', 'botticelli'
  ];
  
  return keywords.some(kw => decoded.includes(kw));
}



const wikipediaValidationCache = new Map<string, boolean>();

async function validateWikipediaPage(term: string, lang: string): Promise<boolean> {
  const cleanTerm = term.trim();
  if (!cleanTerm) return false;
  
  const lookupTerm = cleanTerm.replace(/_/g, ' ');
  const cacheKey = `${lang.toLowerCase()}:${lookupTerm.toLowerCase()}`;
  
  if (wikipediaValidationCache.has(cacheKey)) {
    return wikipediaValidationCache.get(cacheKey)!;
  }
  
  let isNetworkError = false;

  const checkLang = async (currentLang: string): Promise<{ found: boolean; error?: any; status?: number }> => {
    const url = `https://${currentLang.toLowerCase()}.wikipedia.org/w/api.php?action=query&format=json&redirects=1&titles=${encodeURIComponent(lookupTerm)}`;
    try {
      const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'OpenPrimer/1.0 (https://openprimer.org; contact@openprimer.org)' } }, 4000);
      if (res.ok) {
        const data = await safeResponseJson(res, `Wikipedia validation in ${currentLang}`);
        const pages = data.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pageId && pageId !== '-1') {
            return { found: true };
          }
        }
        return { found: false };
      } else {
        console.warn(`[MEDIA-RESOLVER] Wikipedia API returned non-OK status ${res.status} for "${lookupTerm}" in ${currentLang}`);
        return { found: false, status: res.status };
      }
    } catch (e) {
      console.warn(`[MEDIA-RESOLVER] Wikipedia API fetch failed for "${lookupTerm}" in ${currentLang}:`, e);
      return { found: false, error: e };
    }
  };

  // 1. Try target language first
  const targetResult = await checkLang(lang);
  if (targetResult.found) {
    wikipediaValidationCache.set(cacheKey, true);
    return true;
  }
  
  if (targetResult.error || (targetResult.status && targetResult.status !== 404)) {
    isNetworkError = true;
  }

  // 2. Try English fallback if target lang is not English
  if (lang.toLowerCase() !== 'en') {
    const fallbackResult = await checkLang('en');
    if (fallbackResult.found) {
      wikipediaValidationCache.set(cacheKey, true);
      return true;
    }
    if (fallbackResult.error || (fallbackResult.status && fallbackResult.status !== 404)) {
      isNetworkError = true;
    }
  }

  // If both failed but it was due to a network/rate-limit error (not a clean 404/not found),
  // we assume it is valid (return true) to avoid erroneously setting unresolved={true} on valid entities.
  if (isNetworkError) {
    console.log(`[MEDIA-RESOLVER] Assuming "${lookupTerm}" is valid due to Wikipedia network/status error to prevent false unresolved flags.`);
    wikipediaValidationCache.set(cacheKey, true);
    return true;
  }

  wikipediaValidationCache.set(cacheKey, false);
  return false;
}


function getFigurePrefix(lang: string): string {
  const l = lang.toLowerCase().split('-')[0];
  if (l === 'fr') return 'Figure';
  if (l === 'es') return 'Figura';
  if (l === 'de') return 'Abbildung';
  if (l === 'zh') return '图';
  return 'Figure';
}

export function renumberFigures(mdx: string, lang: string = 'en'): string {
  const prefix = getFigurePrefix(lang);
  let figureCount = 1;
  
  // Find all <CustomFigure ... /> or <Image ... /> components
  const customFigureRegex = /<(CustomFigure|Image)\s+([^>]*?)\/>/g;
  
  return mdx.replace(customFigureRegex, (match, tagName, attrsStr) => {
    if (/\bunresolved(?:={true})?\b/.test(attrsStr)) {
      return match;
    }
    // Skip decorative illustrations — never numbered
    if (/\bisIllustration(={true})?\b/.test(attrsStr)) {
      return match;
    }
    const captionMatch = attrsStr.match(/caption=(["'])([\s\S]*?)\1/);
    if (!captionMatch) {
      const newCaption = `${prefix} ${figureCount}`;
      figureCount++;
      const updatedAttrs = attrsStr.trim() + ` caption="${newCaption}"`;
      return `<Image ${updatedAttrs}/>`;
    }
    
    const fullCaption = captionMatch[2];
    const prefixesPattern = /^(?:Figure|Figura|Abbildung|Illustration|Sch\u00e9ma|Schema|Diagramme|Diagram|Graphique|Graph|\u56fe)(?:\s+\d+(?:\.\d+)*[a-z]?\s*[:\-\u2013\u2014]?|\s*[:\-\u2013\u2014])\s*/gi;
    let cleanCaption = fullCaption;
    let previousCaption = '';
    while (cleanCaption !== previousCaption) {
      previousCaption = cleanCaption;
      cleanCaption = cleanCaption.replace(prefixesPattern, '').trim();
    }
    const escapedCleanCaption = cleanCaption.replace(/&quot;/g, '"').replace(/"/g, '&quot;');
    const newCaption = `${prefix} ${figureCount}: ${escapedCleanCaption}`;
    figureCount++;
    
    const updatedAttrs = attrsStr.replace(/caption=(["'])([\s\S]*?)\1/, `caption=$1${newCaption}$1`);
    return `<Image ${updatedAttrs}/>`;
  });
}

export function parseAttributesRobustly(attrsStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrNames = ['type', 'description', 'desc', 'alt', 'caption', 'title', 'src', 'fallbackUrl', 'unresolved', 'isIllustration', 'searchQuery', 'searchquery'];
  
  for (const name of attrNames) {
    const curlyMatch = attrsStr.match(new RegExp(`${name}\\s*=\\s*\\{\\s*["']?([^"'}]*)["']?\\s*\\}`, 'i'));
    if (curlyMatch) {
      attrs[name] = curlyMatch[1].trim();
      continue;
    }

    const regex = new RegExp(`${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i');
    const match = attrsStr.match(regex);
    if (match) {
      attrs[name] = match[2].trim();
    }
  }
  return attrs;
}

export function rebuildCustomFigure(attrs: Record<string, string>, tagName: string = 'Image'): string {
  const parts: string[] = [];
  if (attrs.type) parts.push(`type="${attrs.type.replace(/"/g, '&quot;')}"`);
  if (attrs.description) parts.push(`description="${attrs.description.replace(/"/g, '&quot;')}"`);
  if (attrs.desc && !attrs.description) parts.push(`description="${attrs.desc.replace(/"/g, '&quot;')}"`);
  if (attrs.alt) parts.push(`alt="${attrs.alt.replace(/"/g, '&quot;')}"`);
  if (attrs.caption) parts.push(`caption="${attrs.caption.replace(/"/g, '&quot;')}"`);
  if (attrs.title) parts.push(`title="${attrs.title.replace(/"/g, '&quot;')}"`);
  
  const queryVal = attrs.searchQuery || attrs.searchquery;
  if (queryVal) parts.push(`searchQuery="${queryVal.replace(/"/g, '&quot;')}"`);

  if (attrs.src) parts.push(`src="${attrs.src.replace(/"/g, '&quot;')}"`);
  if (attrs.fallbackUrl) parts.push(`fallbackUrl="${attrs.fallbackUrl.replace(/"/g, '&quot;')}"`);
  if (attrs.unresolved) {
    const val = attrs.unresolved === 'true' || attrs.unresolved === '{true}' ? 'true' : attrs.unresolved;
    parts.push(`unresolved={${val}}`);
  }
  if (attrs.isIllustration) {
    const val = attrs.isIllustration === 'true' || attrs.isIllustration === '{true}' ? 'true' : attrs.isIllustration;
    parts.push(`isIllustration={${val}}`);
  }
  return `<${tagName} ${parts.join(' ')} />`;
}

/**
 * Parses and replaces media links in MDX Content:
 * - Resolves Pollinations/placeholder images with official Wikipedia/Wikimedia Commons images when applicable.
 * - Downloads and uploads images to Supabase Storage.
 * - Resolves missing/dummy YouTube video links with actual search results.
 * - Generates actual audio voiceovers using Google Cloud TTS and uploads them.
 */
export async function resolveAndPersistMedia(
  mdxContent: string,
  targetLang: string = 'fr',
  discipline?: string
): Promise<string> {
  let updatedContent = mdxContent;

  // 0. Do not strip media, figures, video, audio, biography, or highlight tags before resolving.

  // 1. Process Video players: find dummy URLs/IDs and search YouTube
  // Matches: <Video ... /> tag structure
  const videoRegex = /<Video\s+([^>]*)\/>/g;
  let videoMatch;
  while ((videoMatch = videoRegex.exec(mdxContent)) !== null) {
    const fullTag = videoMatch[0];
    const attrsStr = videoMatch[1];
    
    // Parse attributes
    const titleMatch = attrsStr.match(/title="([^"]+)"/);
    const urlMatch = attrsStr.match(/url="([^"]+)"/);
    const idMatch = attrsStr.match(/id="([^"]+)"/);
    
    const title = titleMatch ? titleMatch[1] : '';
    const originalUrl = urlMatch ? urlMatch[1] : '';
    const originalId = idMatch ? idMatch[1] : '';
    
    const hasDummyUrl = !originalUrl || originalUrl.includes('example.com') || originalUrl.includes('placeholder');
    const hasDummyId = !originalId || originalId.startsWith('placeholder') || originalId.length !== 11;
    
    let needsResolution = hasDummyUrl || hasDummyId;
    if (!needsResolution && originalId) {
      const exists = await validateYouTubeVideo(originalId);
      if (!exists) {
        console.log(`[MEDIA-RESOLVER] YouTube video ${originalId} does not exist. Triggering repair.`);
        needsResolution = true;
      }
    }
    
    if (title && needsResolution) {
      const searchQuery = `${title} cours education ${targetLang === 'fr' ? 'français' : 'english'}`;
      const realId = await searchYouTubeVideo(searchQuery);
      
      if (realId) {
        const newUrl = `https://www.youtube.com/watch?v=${realId}`;
        let updatedAttrs = attrsStr;
        if (attrsStr.includes('id=')) {
          updatedAttrs = updatedAttrs.replace(/id="[^"]*"/, `id="${realId}"`);
        } else {
          updatedAttrs += ` id="${realId}"`;
        }
        if (attrsStr.includes('url=')) {
          updatedAttrs = updatedAttrs.replace(/url="[^"]*"/, `url="${newUrl}"`);
        } else {
          updatedAttrs += ` url="${newUrl}"`;
        }
        
        updatedContent = updatedContent.replace(fullTag, `<Video ${updatedAttrs}/>`);
      } else {
        console.log(`[MEDIA-RESOLVER] Could not resolve video ID for "${title}". Setting unresolved={true}.`);
        let updatedAttrs = attrsStr;
        if (!attrsStr.includes('unresolved=')) {
          updatedAttrs += ' unresolved={true}';
        }
        updatedContent = updatedContent.replace(fullTag, `<Video ${updatedAttrs}/>`);
      }
    }
  }

  // 2. Process Audio Players: search Wikimedia Commons or fallback to TTS speech synthesis
  // Matches: <Audio ... /> or <AudioPlayer ... />
  const audioRegex = /<(AudioPlayer|Audio)\s+([^>]*)\/>/g;
  let audioMatch;
  while ((audioMatch = audioRegex.exec(mdxContent)) !== null) {
    const fullTag = audioMatch[0];
    const tagName = audioMatch[1];
    const attrsStr = audioMatch[2];

    const titleMatch = attrsStr.match(/title="([^"]+)"/);
    const urlMatch = attrsStr.match(/url="([^"]+)"/);
    const textMatch = attrsStr.match(/text="([^"]+)"/);

    const title = titleMatch ? titleMatch[1] : 'Audio Track';
    const originalUrl = urlMatch ? urlMatch[1] : '';
    const customText = textMatch ? textMatch[1] : '';

    const hasDummyUrl = !originalUrl || originalUrl.includes('example.com') || originalUrl.includes('placeholder') || originalUrl === '';

    let needsResolution = hasDummyUrl;
    if (!needsResolution && originalUrl) {
      const exists = await validateMediaUrl(originalUrl);
      if (!exists) {
        console.log(`[MEDIA-RESOLVER] Audio URL ${originalUrl} is broken (404). Triggering repair.`);
        needsResolution = true;
      }
    }

    if (needsResolution) {
      console.log(`[MEDIA-RESOLVER] Resolving audio track for: "${title}"`);
      
      // Step A: Search for real audio file on Wikimedia Commons first
      let resolvedUrl = await fetchWikimediaAudio(title);
      let audioBuffer: Buffer | null = null;
      let mimeType = 'audio/mpeg';

      if (resolvedUrl) {
        try {
          const dlRes = await fetchWithTimeout(resolvedUrl, {}, 6000);
          if (dlRes.ok) {
            audioBuffer = Buffer.from(await dlRes.arrayBuffer());
            const contentType = dlRes.headers.get('content-type') || '';
            if (contentType.includes('ogg') || resolvedUrl.endsWith('.ogg')) mimeType = 'audio/ogg';
            else if (contentType.includes('wav') || resolvedUrl.endsWith('.wav')) mimeType = 'audio/wav';
            else if (contentType.includes('audio/ogg') || resolvedUrl.endsWith('.oga')) mimeType = 'audio/ogg';
          }
        } catch (err) {
          console.warn(`[MEDIA-RESOLVER] Failed to download real audio file from ${resolvedUrl}:`, err);
        }
      }

      // Step A2: Search for real audio file on Archive.org
      if (!audioBuffer) {
        const archiveAudio = await fetchArchiveOrgMedia(title, 'audio');
        if (archiveAudio?.url) {
          resolvedUrl = archiveAudio.url;
          try {
            const dlRes = await fetchWithTimeout(resolvedUrl, {}, 6000);
            if (dlRes.ok) {
              audioBuffer = Buffer.from(await dlRes.arrayBuffer());
              const contentType = dlRes.headers.get('content-type') || '';
              if (contentType.includes('ogg') || resolvedUrl.endsWith('.ogg')) mimeType = 'audio/ogg';
              else if (contentType.includes('wav') || resolvedUrl.endsWith('.wav')) mimeType = 'audio/wav';
              else if (contentType.includes('audio/ogg') || resolvedUrl.endsWith('.oga')) mimeType = 'audio/ogg';
            }
          } catch (err) {
            console.warn(`[MEDIA-RESOLVER] Failed to download audio file from archive.org (${resolvedUrl}):`, err);
          }
        }
      }

      // Step B: Lyria music generation — the AI audio equivalent of Imagen/Pollinations.
      const durationHint = attrsStr.match(/duration="([^"]+)"/)?.[1] || '30s';
      if (!audioBuffer) {
        const lyriaPrompt = buildLyriaPrompt(title);
        audioBuffer = await generateLyriaAudio(lyriaPrompt, durationHint);
        if (audioBuffer) mimeType = 'audio/mpeg';
      }

      // Step C: Fallback to Text-to-Speech synthesis (always available via GCP SA).
      if (!audioBuffer && (customText || title) && isSpeechAudio(title, customText)) {
        const textToSynthesize = customText || title;
        audioBuffer = await synthesizeSpeech(textToSynthesize, targetLang);
        mimeType = 'audio/mpeg';
      }

      // Step D: Upload buffer to Supabase Storage and replace URL
      if (audioBuffer) {
        const hash = crypto.createHash('md5').update(customText || title).digest('hex');
        const ext = getSafeExtension(mimeType, 'mp3');
        const fileName = `audio_${hash}.${ext}`;
        
        console.log(`[MEDIA-RESOLVER] Uploading resolved audio to Supabase Storage: ${fileName}`);
        const publicUrl = await uploadToSupabaseStorage(fileName, audioBuffer, mimeType);
        
        if (publicUrl) {
          let updatedAttrs = attrsStr.replace(/url="[^"]*"/, `url="${publicUrl}"`);
          if (!attrsStr.includes('url=')) {
            updatedAttrs += ` url="${publicUrl}"`;
          }
          updatedContent = updatedContent.replace(fullTag, `<${tagName} ${updatedAttrs}/>`);
        }
      } else {
        console.log(`[MEDIA-RESOLVER] Audio resolving failed for "${title}". Setting unresolved={true}.`);
        let updatedAttrs = attrsStr;
        if (!attrsStr.includes('unresolved=')) {
          updatedAttrs += ' unresolved={true}';
        }
        updatedContent = updatedContent.replace(fullTag, `<${tagName} ${updatedAttrs}/>`);
      }
    }
  }

  // 3. Process Images: Markdown images ![Alt](url) and CustomFigure / Image components
  // Matches markdown images: !\[(.*?)\]\((.*?)\)
  const mdImgRegex = /!\[(.*?)\]\((.*?)\)/g;
  let mdMatch;
  while ((mdMatch = mdImgRegex.exec(mdxContent)) !== null) {
    const fullMatch = mdMatch[0];
    const altText = mdMatch[1];
    const originalUrl = mdMatch[2];

    if (originalUrl !== undefined && (originalUrl || altText)) {
      console.log(`[MEDIA-RESOLVER] Processing Markdown image: ${altText} (${originalUrl})`);
      let sourceUrl = originalUrl;
      let resolvedSuccess = false;

      // Resolve via multi-source cascade: Wikidata P18 → Wikipedia → NASA → Met → Smithsonian
      const queryName = altText.trim().replace(/_/g, ' ');
      const resolved = await resolveImageFromSources(queryName, targetLang, discipline);
      if (resolved) {
        console.log(`[MEDIA-RESOLVER] Resolved image for "${queryName}" via ${resolved.sourceLabel}: ${resolved.url}`);
        const finalAltText = resolved.description || altText;
        // Replace image URL and Alt text
        updatedContent = updatedContent.replace(fullMatch, `![${finalAltText}](${resolved.url})`);
        // Inject source attribution into the *Figure: ...* caption that follows (within ~400 chars)
        const afterImg = updatedContent.indexOf(`![${finalAltText}](${resolved.url})`);
        if (afterImg !== -1) {
          const snippet = updatedContent.slice(afterImg, afterImg + 400);
          const captionMatch = snippet.match(/(\*Figure\s*:[^\n*]+)(\*)/);
          if (captionMatch) {
            const originalCaption = captionMatch[0];
            if (!originalCaption.includes('Source\u00a0:') && !originalCaption.includes('Source:')) {
              const finalLabel = compileFinalLabel(resolved.sourceLabel, resolved.sourceUrl);
              
              const figNumMatch = originalCaption.match(/^\*Figure\s*(\d*)\s*:\s*/i);
              const figNumPrefix = figNumMatch ? `Figure ${figNumMatch[1]}: ` : '';
              
              let baseCaption = originalCaption
                .replace(/^\*Figure\s*\d*\s*:\s*/i, '')
                .replace(/\*$/, '')
                .trim();
              baseCaption = baseCaption.split(/\s*(?:—|--|-)?\s*Source\s*:/i)[0].trim();
              
              let updatedCaption = '';
              if (baseCaption) {
                if (!baseCaption.endsWith('.')) baseCaption += '.';
                updatedCaption = `*${figNumPrefix}${baseCaption} Source\u00a0: ${finalLabel}*`;
              } else {
                updatedCaption = `*${figNumPrefix}Source\u00a0: ${finalLabel}*`;
              }

              updatedContent = updatedContent.slice(0, afterImg) +
                updatedContent.slice(afterImg).replace(originalCaption, updatedCaption);
            }
          }
        }
        resolvedSuccess = true;
        continue;
      }

      // If no source found and URL is Pollinations/placeholder — strip the image entirely
      if (sourceUrl.includes('pollinations.ai') || sourceUrl === '' || sourceUrl === 'placeholder') {
        console.warn(`[MEDIA-RESOLVER] No source found and URL is placeholder — stripping image: "${altText}"`);
        // Find if a figure caption is immediately following this image to avoid orphaned captions
        const imgIndex = updatedContent.indexOf(fullMatch);
        if (imgIndex !== -1) {
          const afterImgText = updatedContent.slice(imgIndex + fullMatch.length, imgIndex + fullMatch.length + 300);
          const captionRegex = /^\s*[\r\n]+\s*\*\s*Figure\s*(?:\d*|[\w\-]+)?\s*[:\-\u2013\u2014]?[\s\S]*?\*/i;
          const captionMatch = afterImgText.match(captionRegex);
          if (captionMatch) {
            const fullMatchWithCaption = updatedContent.slice(imgIndex, imgIndex + fullMatch.length + captionMatch[0].length);
            updatedContent = updatedContent.replace(fullMatchWithCaption, '');
          } else {
            updatedContent = updatedContent.replace(fullMatch, '');
          }
        } else {
          updatedContent = updatedContent.replace(fullMatch, '');
        }
        resolvedSuccess = true;
        continue;
      }

      // Download and upload to Supabase Storage (Only for generated or other custom external images)
      try {
        let buffer: Buffer | null = null;
        let contentType = 'image/jpeg';
        const isLocal = !sourceUrl.startsWith('http://') && !sourceUrl.startsWith('https://') && !sourceUrl.startsWith('//');

        if (isLocal) {
          const localPath = path.join(process.cwd(), 'public', sourceUrl);
          if (fs.existsSync(localPath)) {
            try {
              buffer = fs.readFileSync(localPath);
              const ext = path.extname(localPath).toLowerCase();
              if (ext === '.png') contentType = 'image/png';
              else if (ext === '.gif') contentType = 'image/gif';
              else if (ext === '.svg') contentType = 'image/svg+xml';
              else if (ext === '.webp') contentType = 'image/webp';
            } catch (err) {
              console.warn(`[MEDIA-RESOLVER] Failed to read local image ${localPath}:`, err);
            }
          } else {
            console.warn(`[MEDIA-RESOLVER] Local image path ${localPath} does not exist.`);
          }
        } else {
          const imageRes = await fetchWithTimeout(sourceUrl, {}, 20000);
          if (imageRes.ok) {
            contentType = imageRes.headers.get('content-type') || 'image/jpeg';
            buffer = Buffer.from(await imageRes.arrayBuffer());
          }
        }

        if (buffer && !contentType.toLowerCase().includes('text/html')) {
          const hash = crypto.createHash('md5').update(sourceUrl).digest('hex');
          const ext = getSafeExtension(contentType, 'jpg');
          const fileName = `img_${hash}.${ext}`;
          
          const publicUrl = await uploadToSupabaseStorage(fileName, buffer, contentType);
          if (publicUrl) {
            updatedContent = updatedContent.replace(fullMatch, `![${altText}](${publicUrl})`);
            resolvedSuccess = true;
          }
        }
      } catch (err) {
        console.warn(`[MEDIA-RESOLVER] Failed to download or upload image ${sourceUrl}:`, err);
      }

      if (!resolvedSuccess) {
        console.log(`[MEDIA-RESOLVER] Stripping unresolvable Markdown image: "${altText}"`);
        updatedContent = updatedContent.replace(fullMatch, "");
      }
    }
  }

  // Process JSX Figures: <CustomFigure src="..." /> or <Image src="..." /> or <ClimateImpactMap src="..." />
  const figRegex = /<(CustomFigure|Image|ClimateImpactMap|climate_impact_map)\s+([^>]*?)\/>/g;
  let figMatch;
  while ((figMatch = figRegex.exec(mdxContent)) !== null) {
    const fullTag = figMatch[0];
    const tagName = figMatch[1];
    const attrsStr = figMatch[2];

    const getAttr = (name: string) => {
      const curlyMatch = attrsStr.match(new RegExp(`${name}\\s*=\\s*\\{\\s*["']?([^"'}]*)["']?\\s*\\}`, 'i'));
      if (curlyMatch) return curlyMatch[1].trim();
      const quoteMatch = attrsStr.match(new RegExp(`${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
      if (quoteMatch) return quoteMatch[2].trim();
      const unquotedMatch = attrsStr.match(new RegExp(`${name}\\s*=\\s*([^\\s/>]+)`, 'i'));
      if (unquotedMatch) return unquotedMatch[1].trim();
      return '';
    };

    const typeText = getAttr('type').toLowerCase() || 'image';
    const originalSrc = getAttr('src');
    const altText = getAttr('alt');
    const caption = getAttr('caption');
    const title = getAttr('title');
    const description = getAttr('description') || getAttr('desc');
    const searchQuery = getAttr('searchQuery') || getAttr('searchquery');

    if (typeText === 'audio') {
      console.log(`[MEDIA-RESOLVER] Resolving CustomFigure type="audio": "${searchQuery || description || title}"`);
      const queryName = (searchQuery || description || title || caption || '').trim();
      let resolvedUrl = await fetchWikimediaAudio(queryName);
      let audioBuffer: Buffer | null = null;
      let mimeType = 'audio/mpeg';

      if (resolvedUrl) {
        try {
          const dlRes = await fetchWithTimeout(resolvedUrl, {}, 6000);
          if (dlRes.ok) {
            audioBuffer = Buffer.from(await dlRes.arrayBuffer());
            const contentType = dlRes.headers.get('content-type') || '';
            if (contentType.includes('ogg') || resolvedUrl.endsWith('.ogg')) mimeType = 'audio/ogg';
            else if (contentType.includes('wav') || resolvedUrl.endsWith('.wav')) mimeType = 'audio/wav';
            else if (contentType.includes('audio/ogg') || resolvedUrl.endsWith('.oga')) mimeType = 'audio/ogg';
          }
        } catch (err) {
          console.warn(`[MEDIA-RESOLVER] Failed to download audio for CustomFigure from ${resolvedUrl}:`, err);
        }
      }

      if (!audioBuffer) {
        const archiveAudio = await fetchArchiveOrgMedia(queryName, 'audio');
        if (archiveAudio?.url) {
          resolvedUrl = archiveAudio.url;
          try {
            const dlRes = await fetchWithTimeout(resolvedUrl, {}, 6000);
            if (dlRes.ok) {
              audioBuffer = Buffer.from(await dlRes.arrayBuffer());
              const contentType = dlRes.headers.get('content-type') || '';
              if (contentType.includes('ogg') || resolvedUrl.endsWith('.ogg')) mimeType = 'audio/ogg';
              else if (contentType.includes('wav') || resolvedUrl.endsWith('.wav')) mimeType = 'audio/wav';
              else if (contentType.includes('audio/ogg') || resolvedUrl.endsWith('.oga')) mimeType = 'audio/ogg';
            }
          } catch (err) {
            console.warn(`[MEDIA-RESOLVER] Failed to download audio from archive.org (${resolvedUrl}):`, err);
          }
        }
      }

      const durationHint = attrsStr.match(/duration="([^"]+)"/)?.[1] || '30s';
      if (!audioBuffer) {
        const lyriaPrompt = buildLyriaPrompt(queryName);
        audioBuffer = await generateLyriaAudio(lyriaPrompt, durationHint);
        if (audioBuffer) mimeType = 'audio/mpeg';
      }

      if (!audioBuffer && queryName) {
        audioBuffer = await synthesizeSpeech(queryName, targetLang);
        mimeType = 'audio/mpeg';
      }

      if (audioBuffer) {
        const hash = crypto.createHash('md5').update(queryName).digest('hex');
        const ext = getSafeExtension(mimeType, 'mp3');
        const fileName = `audio_${hash}.${ext}`;
        const publicUrl = await uploadToSupabaseStorage(fileName, audioBuffer, mimeType);
        if (publicUrl) {
          const finalTitle = (title || queryName).replace(/"/g, '&quot;');
          const finalText = description.replace(/"/g, '&quot;');
          updatedContent = updatedContent.replace(
            fullTag,
            `<Audio url="${publicUrl}" title="${finalTitle}" text="${finalText}" />`
          );
          continue;
        }
      }
      
      // Fallback if audio fails to resolve
      console.log(`[MEDIA-RESOLVER] Audio CustomFigure resolving failed. Setting unresolved={true}.`);
      updatedContent = updatedContent.replace(
        fullTag,
        `<Audio title="${(title || queryName).replace(/"/g, '&quot;')}" unresolved={true} />`
      );
      continue;
    }

    if (typeText === 'video') {
      console.log(`[MEDIA-RESOLVER] Resolving CustomFigure type="video": "${searchQuery || description || title}"`);
      const queryName = (searchQuery || description || title || caption || '').trim();
      if (queryName) {
        const searchQuery = `${queryName} cours education ${targetLang === 'fr' ? 'français' : 'english'}`;
        const realId = await searchYouTubeVideo(searchQuery);
        if (realId) {
          const newUrl = `https://www.youtube.com/watch?v=${realId}`;
          const finalTitle = (title || queryName).replace(/"/g, '&quot;');
          updatedContent = updatedContent.replace(
            fullTag,
            `<Video id="${realId}" url="${newUrl}" title="${finalTitle}" />`
          );
          continue;
        }
      }
      console.log(`[MEDIA-RESOLVER] Video CustomFigure resolving failed. Setting unresolved={true}.`);
      updatedContent = updatedContent.replace(
        fullTag,
        `<Video title="${(title || queryName).replace(/"/g, '&quot;')}" unresolved={true} />`
      );
      continue;
    }

    // Default/Image
    if (originalSrc || altText || caption || description) {
      console.log(`[MEDIA-RESOLVER] Processing JSX Figure: ${altText || description} (${originalSrc})`);
      let sourceUrl = originalSrc;
      let resolvedSuccess = false;

      const currentAttrs = parseAttributesRobustly(attrsStr);
      const detailedDesc = (description || altText || caption || '').trim();
      const queryName = searchQuery ? searchQuery.trim() : getConciseQuery(description, altText, caption);
      if (queryName) {
        const resolved = await resolveImageFromSources(queryName, targetLang, discipline, detailedDesc);
        const wikiImage = resolved ? resolved.url : null;
        if (resolved && wikiImage) {
          console.log(`[MEDIA-RESOLVER] Found real Wikipedia image for Figure "${queryName}": ${wikiImage}`);
          
          currentAttrs.src = wikiImage;
          
          // Delete unresolved flag since it has been resolved successfully!
          delete currentAttrs.unresolved;
          
          const finalLabel = compileFinalLabel(resolved.sourceLabel, resolved.sourceUrl);
          
          if (resolved.description) {
            currentAttrs.alt = resolved.description;
          } else {
            currentAttrs.alt = altText || description || caption || '';
          }
          
          // Always keep original caption/legend explaining academic relevance and append source
          const rawCap = (caption || description || altText || '').trim();
          const cleanCap = rawCap.split(/\s*(?:—|--|-)?\s*Source\s*:/i)[0].trim();
          if (cleanCap) {
            let capText = cleanCap;
            if (!capText.endsWith('.')) capText += '.';
            currentAttrs.caption = `${capText} Source: ${finalLabel}`;
          } else {
            currentAttrs.caption = `Source: ${finalLabel}`;
          }
          
          if (resolved.sourceUrl) {
            currentAttrs.fallbackUrl = resolved.sourceUrl;
          }
          if (resolved.sourceLabel && resolved.sourceLabel.includes('Unsplash')) {
            currentAttrs.isIllustration = 'true';
          } else {
            // Delete isIllustration if it was resolved to a real historical/academic image and not Unsplash
            if (!attrsStr.includes('isIllustration')) {
              delete currentAttrs.isIllustration;
            }
          }
          
          const newTag = rebuildCustomFigure(currentAttrs, tagName);
          updatedContent = updatedContent.replace(fullTag, newTag);
          resolvedSuccess = true;
          continue;
        }
      }

      // Enforce strict restriction against generating existing historical artworks, sculptures, monuments, photographs, and scientific/factual diagrams
      if (sourceUrl && sourceUrl.includes('pollinations.ai') && (tagName === 'ClimateImpactMap' || tagName === 'climate_impact_map' || isExistingArtwork(sourceUrl, altText || caption || description) || isFactualMedia(altText || caption || description))) {
        if (tagName === 'ClimateImpactMap' || tagName === 'climate_impact_map') {
          console.warn(`[MEDIA-RESOLVER] Blocked AI generation for ClimateImpactMap: "${altText || caption || description}". Keeping interactive widget and stripping src.`);
          delete currentAttrs.src;
          currentAttrs.unresolved = 'true';
          const newTag = rebuildCustomFigure(currentAttrs, tagName);
          updatedContent = updatedContent.replace(fullTag, newTag);
          resolvedSuccess = true;
          continue;
        } else {
          console.warn(`[MEDIA-RESOLVER] Blocked AI generation of existing artwork or factual asset Figure: "${altText || caption || description}"`);
          updatedContent = updatedContent.replace(fullTag, "");
          resolvedSuccess = true;
          continue;
        }
      }

      // If no source found and it is ClimateImpactMap with a pollinations or empty/placeholder URL, strip src immediately to prevent download and keep interactive widget
      if ((!sourceUrl || sourceUrl.includes('pollinations.ai') || sourceUrl === 'placeholder') && (tagName === 'ClimateImpactMap' || tagName === 'climate_impact_map')) {
        delete currentAttrs.src;
        currentAttrs.unresolved = 'true';
        const newTag = rebuildCustomFigure(currentAttrs, tagName);
        updatedContent = updatedContent.replace(fullTag, newTag);
        resolvedSuccess = true;
        continue;
      }

      // Download and upload to Supabase Storage (Only for generated or other custom external images)
      if (sourceUrl) {
        try {
          let buffer: Buffer | null = null;
          let contentType = 'image/jpeg';
          const isLocal = !sourceUrl.startsWith('http://') && !sourceUrl.startsWith('https://') && !sourceUrl.startsWith('//');

          if (isLocal) {
            const localPath = path.join(process.cwd(), 'public', sourceUrl);
            if (fs.existsSync(localPath)) {
              try {
                buffer = fs.readFileSync(localPath);
                const ext = path.extname(localPath).toLowerCase();
                if (ext === '.png') contentType = 'image/png';
                else if (ext === '.gif') contentType = 'image/gif';
                else if (ext === '.svg') contentType = 'image/svg+xml';
                else if (ext === '.webp') contentType = 'image/webp';
              } catch (err) {
                console.warn(`[MEDIA-RESOLVER] Failed to read local image ${localPath}:`, err);
              }
            } else {
              console.warn(`[MEDIA-RESOLVER] Local image path ${localPath} does not exist.`);
            }
          } else {
            const imageRes = await fetchWithTimeout(sourceUrl, {}, 20000);
            if (imageRes.ok) {
              contentType = imageRes.headers.get('content-type') || 'image/jpeg';
              buffer = Buffer.from(await imageRes.arrayBuffer());
            }
          }

          if (buffer && !contentType.toLowerCase().includes('text/html')) {
            const hash = crypto.createHash('md5').update(sourceUrl).digest('hex');
            const ext = getSafeExtension(contentType, 'jpg');
            const fileName = `img_${hash}.${ext}`;
            
            const publicUrl = await uploadToSupabaseStorage(fileName, buffer, contentType);
            if (publicUrl) {
              currentAttrs.src = publicUrl;
              const newTag = rebuildCustomFigure(currentAttrs, tagName);
              updatedContent = updatedContent.replace(fullTag, newTag);
              resolvedSuccess = true;
              continue;
            }
          }
        } catch (err) {
          console.warn(`[MEDIA-RESOLVER] Failed to download or upload JSX image ${sourceUrl}:`, err);
        }
      }

      if (!resolvedSuccess) {
        console.log(`[MEDIA-RESOLVER] Stripping unresolvable Figure/CustomFigure: "${altText || caption || description || searchQuery}"`);
        updatedContent = updatedContent.replace(fullTag, '');
      } else {
        const newTag = rebuildCustomFigure(currentAttrs, tagName);
        updatedContent = updatedContent.replace(fullTag, newTag);
      }
    }
  }

  // 4. Validate and strip custom highlight tags if unresolvable
  const highlightTags = [
    'RealPerson', 'HistoricalPerson', 'FictionalCharacter', 'Location', 'EntityLink', 'EventLink', 
    'HistoricalEventLink', 'EvenementHistorique', 'ÉvénementHistorique', 'Artwork', 'WebsiteLink', 'ProjectLink', 
    'ConceptLink', 'TheoremLink', 'InstitutionLink', 'SpeciesLink', 'SpeciesLien', 'EspeceLien', 
    'EspèceLien', 'OrganismeLien', 'ChemicalLink', 'ChemicalLien', 'MoleculesLien', 'MoleculeLien', 
    'ChimieLien', 'CelestialLink', 'CelestialLien', 'CorpsCeleste', 'CorpsCéleste', 'AstroLien'
  ];

  const tagPattern = new RegExp(`<(${highlightTags.join('|')})\\s+([^>]*?)>([\\s\\S]*?)<\\/\\1>`, 'g');
  
  // Extract all unique lookup names first
  const lookupNames = new Set<string>();
  let tagMatch;
  tagPattern.lastIndex = 0;
  while ((tagMatch = tagPattern.exec(updatedContent)) !== null) {
    const attrsStr = tagMatch[2];
    const innerText = tagMatch[3];
    const termMatch = attrsStr.match(/(?:name|term)="([^"]+)"/);
    const lookupName = termMatch ? termMatch[1] : innerText.trim();
    if (lookupName) {
      lookupNames.add(lookupName);
    }
  }

  // Validate all unique lookup names in parallel (using resilient validation with cache)
  const validationResults = new Map<string, boolean>();
  await Promise.all(
    Array.from(lookupNames).map(async (name) => {
      const isValid = await validateWikipediaPage(name, targetLang);
      validationResults.set(name, isValid);
    })
  );

  // Synchronously replace all highlight tags using the validation results map to avoid index desynchronization
  updatedContent = updatedContent.replace(tagPattern, (fullTag, tagName, attrsStr, innerText) => {
    const termMatch = attrsStr.match(/(?:name|term)="([^"]+)"/);
    const lookupName = termMatch ? termMatch[1] : innerText.trim();
    if (lookupName) {
      const isValid = validationResults.get(lookupName);
      if (isValid === false) {
        console.log(`[MEDIA-RESOLVER] Flagging unresolved highlight tag <${tagName}> for "${lookupName}"`);
        let updatedAttrs = attrsStr;
        if (!attrsStr.includes('unresolved=')) {
          updatedAttrs += ' unresolved={true}';
        }
        return `<${tagName} ${updatedAttrs}>${innerText}</${tagName}>`;
      }
    }
    return fullTag;
  });

  // 5. Renumber figures sequentially to guarantee continuous numbering after deletions
  updatedContent = renumberFigures(updatedContent, targetLang);

  return updatedContent;
}

const mediaValidationCache = new Map<string, boolean>();

export async function validateMediaUrl(url: string): Promise<boolean> {
  if (!url || url.includes('example.com') || url.includes('placeholder') || url.startsWith('placeholder')) {
    return false;
  }
  if (mediaValidationCache.has(url)) {
    return mediaValidationCache.get(url)!;
  }
  // Local/public assets
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//')) {
    try {
      const localPath = path.join(process.cwd(), 'public', url.startsWith('/') ? url : `/${url}`);
      const exists = fs.existsSync(localPath);
      mediaValidationCache.set(url, exists);
      return exists;
    } catch {
      return false;
    }
  }
  try {
    const res = await fetchWithTimeout(url, { method: 'HEAD' }, 2000);
    const exists = res.status !== 404;
    mediaValidationCache.set(url, exists);
    return exists;
  } catch (err) {
    // Timeout/network issue: assume true to avoid false positive overrides
    mediaValidationCache.set(url, true);
    return true;
  }
}

export async function searchWikidataImage(query: string, lang: string = 'fr'): Promise<{ url: string | null; fallbackUrl: string | null }> {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) return { url: null, fallbackUrl: null };

    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(cleanQuery)}&language=${lang}&format=json&origin=*`;
    const searchRes = await fetchWithTimeout(searchUrl, {}, 4000);
    if (!searchRes.ok) return { url: null, fallbackUrl: null };
    const searchJson = await safeResponseJson(searchRes, 'Wikidata search');
    const results = searchJson.search;
    if (!results || results.length === 0) {
      if (lang !== 'en') {
        return searchWikidataImage(query, 'en');
      }
      return { url: null, fallbackUrl: null };
    }

    const entityId = results[0].id;

    const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims|sitelinks&format=json&origin=*`;
    const entityRes = await fetchWithTimeout(entityUrl, {}, 4000);
    if (!entityRes.ok) return { url: null, fallbackUrl: null };
    const entityJson = await safeResponseJson(entityRes, 'Wikidata entity details');
    const entity = entityJson.entities?.[entityId];
    if (!entity) return { url: null, fallbackUrl: null };

    const imageClaim = entity.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
    
    let wikiTitle = entity.sitelinks?.[`${lang}wiki`]?.title || entity.sitelinks?.enwiki?.title;
    let fallbackUrl: string | null = null;
    if (wikiTitle) {
      const siteLang = entity.sitelinks?.[`${lang}wiki`] ? lang : 'en';
      fallbackUrl = `https://${siteLang}.wikipedia.org/wiki/${encodeURIComponent(wikiTitle.replace(/\s/g, '_'))}`;
    }

    if (!imageClaim) {
      return { url: null, fallbackUrl };
    }

    const fileTitle = `File:${imageClaim}`;
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
    const commonsRes = await fetchWithTimeout(commonsUrl, {}, 4000);
    if (!commonsRes.ok) return { url: null, fallbackUrl };
    const commonsJson = await safeResponseJson(commonsRes, 'Wikimedia file details');
    const pages = commonsJson.query?.pages;
    if (pages) {
      const pageKey = Object.keys(pages)[0];
      const fileUrl = pages[pageKey]?.imageinfo?.[0]?.url;
      if (fileUrl) {
        console.log(`[WIKIDATA-SEARCH] Found Wikidata verified image for "${cleanQuery}" (QID: ${entityId}): ${fileUrl}`);
        return { url: fileUrl, fallbackUrl };
      }
    }

    return { url: null, fallbackUrl };
  } catch (err) {
    console.warn(`[WIKIDATA-SEARCH] Failed for query "${query}":`, err);
    return { url: null, fallbackUrl: null };
  }
}

async function validateImageWithGemini(imageUrl: string, description: string): Promise<boolean> {
  try {
    const resImg = await fetchWithTimeout(imageUrl, {}, 8000);
    if (!resImg.ok) {
      console.warn(`[MEDIA-RESOLVER] Failed to download image for validation: ${imageUrl}`);
      return false;
    }
    const contentType = resImg.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await resImg.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const promptText = `Analyze the attached image and determine if it directly and accurately depicts the following subject: "${description}".
    
CRITICAL VALIDATION RULES:
1. The image must be a direct visual representation of the subject.
2. Reject the image (answer NO) if it shows a different concept, mathematical diagram, or object, even if it is historically, contextually, or biographically related to the subject (e.g., showing a geometric right-triangle diagram for a "monochord" or "monocorde" is a failure and MUST be rejected; showing a map of Greece for "Pythagoras" is a failure and MUST be rejected).
3. If the subject is a specific instrument, tool, or object, the image must show that object.
4. If the subject is a person, the image must show a portrait, bust, statue, or painting of that person.
5. If the image is unrelated, generic, or incorrect, reject it.

Does the image directly represent the subject? Respond with exactly one word: YES or NO.`;

    const res = await callVertexAI({
      task: 'course_generation',
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: contentType.split(';')[0],
              data: base64Data
            }
          },
          {
            text: compressPromptText(promptText)
          }
        ]
      }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.1
      }
    });

    if (res && res.ok) {
      const json = await res.json();
      const answer = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toUpperCase() || '';
      console.log(`[MEDIA-RESOLVER] Gemini validation answer for "${description}" against image: "${answer}"`);
      if (answer.includes('NON') || answer.includes('NO')) {
        console.warn(`[MEDIA-RESOLVER] Gemini REJECTED image for description "${description}": ${imageUrl}`);
        return false;
      }
      return true;
    }
  } catch (err) {
    console.warn('[MEDIA-RESOLVER] Error validating image with Gemini:', err);
  }
  return true;
}

async function searchMediaImageCascade(
  queryName: string,
  lang: string
): Promise<{ url: string | null; fallbackUrl: string | null; sourceLabel?: string }> {
  const wikidataResult = await searchWikidataImage(queryName, lang);
  if (wikidataResult.url) {
    const isValid = await validateImageWithGemini(wikidataResult.url, queryName);
    if (isValid) {
      return { ...wikidataResult, sourceLabel: 'Wikimedia Commons' };
    } else {
      console.log(`[MEDIA-RESOLVER] Wikidata image rejected by Gemini for query "${queryName}". Trying fallback...`);
    }
  }

  const wikiImageResult = await fetchWikipediaImage(queryName, lang);
  if (wikiImageResult) {
    const wikiUrl = wikiImageResult.url;
    const isValid = await validateImageWithGemini(wikiUrl, queryName);
    if (isValid) {
      const fallbackUrl = wikiImageResult.fallbackUrl;
      return { url: wikiUrl, fallbackUrl, sourceLabel: 'Wikimedia Commons' };
    } else {
      console.log(`[MEDIA-RESOLVER] Wikipedia page image rejected by Gemini for query "${queryName}". Trying fallback...`);
    }
  }

  const gallicaUrl = await fetchGallicaImage(queryName);
  if (gallicaUrl) {
    const isValid = await validateImageWithGemini(gallicaUrl, queryName);
    if (isValid) {
      return { url: gallicaUrl, fallbackUrl: wikidataResult.fallbackUrl || null, sourceLabel: 'Gallica / BNF' };
    } else {
      console.log(`[MEDIA-RESOLVER] Gallica image rejected by Gemini for query "${queryName}". Trying fallback...`);
    }
  }

  const commonsUrl = await searchWikimediaCommonsImage(queryName);
  if (commonsUrl) {
    const isValid = await validateImageWithGemini(commonsUrl, queryName);
    if (isValid) {
      return { url: commonsUrl, fallbackUrl: wikidataResult.fallbackUrl || null, sourceLabel: 'Wikimedia Commons' };
    } else {
      console.log(`[MEDIA-RESOLVER] Wikimedia Commons image rejected by Gemini for query "${queryName}".`);
    }
  }

  const queryEnglish = lang.startsWith('en') ? queryName : await optimizeQueryWithGemini(queryName, lang, true);
  const archiveResult = await fetchArchiveOrgMedia(queryEnglish, 'image');
  if (archiveResult?.url) {
    const isValid = await validateImageWithGemini(archiveResult.url, queryName);
    if (isValid) {
      return { url: archiveResult.url, fallbackUrl: wikidataResult.fallbackUrl || null, sourceLabel: archiveResult.sourceLabel };
    } else {
      console.log(`[MEDIA-RESOLVER] Archive.org image rejected by Gemini for query "${queryName}".`);
    }
  }

  return { url: null, fallbackUrl: wikidataResult.fallbackUrl || null };
}

export async function resolveMediaImage(
  queryName: string,
  lang: string
): Promise<{ url: string | null; fallbackUrl: string | null; description?: string | null; sourceLabel?: string }> {
  const originalQuery = queryName.trim().replace(/_/g, ' ');
  
  // Try specific search first
  let result = await searchMediaImageCascade(originalQuery, lang);
  if (result.url) {
    return result;
  }

  // Try generic fallback
  console.log(`[RESTITUTION-REPAIR] Specific search failed for "${originalQuery}". Attempting generic fallback...`);
  const genericQuery = await generateGenericQueryWithGemini(originalQuery, lang);
  if (genericQuery && genericQuery !== originalQuery) {
    console.log(`[RESTITUTION-REPAIR] Generic query generated: "${genericQuery}"`);
    let genericResult = await searchMediaImageCascade(genericQuery, lang);
    if (genericResult.url) {
      console.log(`[RESTITUTION-REPAIR] Generic fallback succeeded. Generating description for image: ${genericResult.url}`);
      const newDescription = await describeImageWithGemini(genericResult.url, lang);
      return {
        ...genericResult,
        description: newDescription
      };
    }
  }

  return { url: null, fallbackUrl: null };
}

export async function searchWikimediaCommonsImage(query: string): Promise<string | null> {
  try {
    const cleanQuery = query.trim();
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanQuery)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*`;
    const res = await fetchWithTimeout(url, {}, 4000);
    if (!res.ok) return null;
    const json = await safeResponseJson(res, 'Wikimedia image search');
    const pages = json.query?.pages;
    if (!pages) return null;
    
    for (const key of Object.keys(pages)) {
      const imgInfo = pages[key]?.imageinfo?.[0];
      const fileUrl = imgInfo?.url;
      if (fileUrl && (
        fileUrl.endsWith('.jpg') || 
        fileUrl.endsWith('.jpeg') || 
        fileUrl.endsWith('.png') || 
        fileUrl.endsWith('.svg') || 
        fileUrl.endsWith('.webp')
      )) {
        return fileUrl;
      }
    }
    return null;
  } catch (err) {
    console.warn(`[MEDIA-RESOLVER] Wikimedia image search failed for "${query}":`, err);
    return null;
  }
}

/**
 * Validates and repairs all media links (videos, audios, images) on the fly during course page rendering.
 * Performs checking with HEAD requests up to MAX_CHECKS and repairs up to MAX_REPAIRS.
 */
export async function repairMediaOnRestitution(mdxContent: string, targetLang: string = 'fr'): Promise<string> {
  let updatedContent = mdxContent;
  let checkCount = 0;
  let repairCount = 0;
  const MAX_CHECKS = 6;
  const MAX_REPAIRS = 3;

  const targetLangLower = (targetLang || 'fr').toLowerCase();

  // 1. Validate & Repair YouTube Videos
  const videoRegex = /<Video\s+([^>]*?)\/>/g;
  let videoMatch;
  const videosToProcess: { fullTag: string; attrsStr: string }[] = [];
  while ((videoMatch = videoRegex.exec(mdxContent)) !== null) {
    videosToProcess.push({ fullTag: videoMatch[0], attrsStr: videoMatch[1] });
  }

  for (const { fullTag, attrsStr } of videosToProcess) {
    if (checkCount >= MAX_CHECKS || repairCount >= MAX_REPAIRS) break;

    const titleMatch = attrsStr.match(/title="([^"]+)"/);
    const urlMatch = attrsStr.match(/url="([^"]+)"/);
    const idMatch = attrsStr.match(/id="([^"]+)"/);
    
    const title = titleMatch ? titleMatch[1] : '';
    const originalUrl = urlMatch ? urlMatch[1] : '';
    const originalId = idMatch ? idMatch[1] : '';
    
    const hasDummyUrl = !originalUrl || originalUrl.includes('example.com') || originalUrl.includes('placeholder');
    const hasDummyId = !originalId || originalId.startsWith('placeholder') || originalId.length !== 11;
    
    let needsResolution = hasDummyUrl || hasDummyId;
    if (!needsResolution && originalId) {
      checkCount++;
      const exists = await validateYouTubeVideo(originalId);
      if (!exists) {
        console.log(`[RESTITUTION-REPAIR] YouTube video ID ${originalId} is invalid/404. Triggering repair.`);
        needsResolution = true;
      }
    }

    if (needsResolution && title) {
      repairCount++;
      const searchQuery = `${title} cours education ${targetLangLower === 'fr' ? 'français' : 'english'}`;
      const realId = await searchYouTubeVideo(searchQuery);
      
      if (realId) {
        const newUrl = `https://www.youtube.com/watch?v=${realId}`;
        let updatedAttrs = attrsStr;
        if (attrsStr.includes('id=')) {
          updatedAttrs = updatedAttrs.replace(/id="[^"]*"/, `id="${realId}"`);
        } else {
          updatedAttrs += ` id="${realId}"`;
        }
        if (attrsStr.includes('url=')) {
          updatedAttrs = updatedAttrs.replace(/url="[^"]*"/, `url="${newUrl}"`);
        } else {
          updatedAttrs += ` url="${newUrl}"`;
        }
        
        updatedContent = updatedContent.replaceAll(fullTag, `<Video ${updatedAttrs}/>`);
        console.log(`[RESTITUTION-REPAIR] Successfully repaired video "${title}" to ID: ${realId}`);
      } else {
        console.log(`[RESTITUTION-REPAIR] Could not resolve alternative video for "${title}". Setting unresolved={true}.`);
        let updatedAttrs = attrsStr;
        if (!attrsStr.includes('unresolved=')) {
          updatedAttrs += ' unresolved={true}';
        }
        updatedContent = updatedContent.replaceAll(fullTag, `<Video ${updatedAttrs}/>`);
      }
    }
  }

  // 2. Validate & Repair Audio Players
  const audioRegex = /<(AudioPlayer|Audio)\s+([^>]*?)\/>/g;
  let audioMatch;
  const audiosToProcess: { fullTag: string; tagName: string; attrsStr: string }[] = [];
  while ((audioMatch = audioRegex.exec(mdxContent)) !== null) {
    audiosToProcess.push({ fullTag: audioMatch[0], tagName: audioMatch[1], attrsStr: audioMatch[2] });
  }

  for (const { fullTag, tagName, attrsStr } of audiosToProcess) {
    if (checkCount >= MAX_CHECKS || repairCount >= MAX_REPAIRS) break;

    const titleMatch = attrsStr.match(/title="([^"]+)"/);
    const urlMatch = attrsStr.match(/url="([^"]+)"/);
    const textMatch = attrsStr.match(/text="([^"]+)"/);
    const durationMatch = attrsStr.match(/duration="([^"]+)"/);

    const title = titleMatch ? titleMatch[1] : 'Audio Track';
    const originalUrl = urlMatch ? urlMatch[1] : '';
    const customText = textMatch ? textMatch[1] : '';
    const durationHint = durationMatch ? durationMatch[1] : '30s';

    const hasDummyUrl = !originalUrl || originalUrl.includes('example.com') || originalUrl.includes('placeholder') || originalUrl === '';

    let needsResolution = hasDummyUrl;
    if (!needsResolution && originalUrl) {
      checkCount++;
      const exists = await validateMediaUrl(originalUrl);
      if (!exists) {
        console.log(`[RESTITUTION-REPAIR] Audio URL ${originalUrl} is broken (404). Triggering repair.`);
        needsResolution = true;
      }
    }

    if (needsResolution) {
      repairCount++;
      console.log(`[RESTITUTION-REPAIR] Resolving audio track for: "${title}"`);
      
      let resolvedUrl = await fetchWikimediaAudio(title);
      let audioBuffer: Buffer | null = null;
      let mimeType = 'audio/mpeg';

      if (resolvedUrl) {
        try {
          const dlRes = await fetchWithTimeout(resolvedUrl, {}, 6000);
          if (dlRes.ok) {
            audioBuffer = Buffer.from(await dlRes.arrayBuffer());
            const contentType = dlRes.headers.get('content-type') || '';
            if (contentType.includes('ogg') || resolvedUrl.endsWith('.ogg')) mimeType = 'audio/ogg';
            else if (contentType.includes('wav') || resolvedUrl.endsWith('.wav')) mimeType = 'audio/wav';
            else if (contentType.includes('audio/ogg') || resolvedUrl.endsWith('.oga')) mimeType = 'audio/ogg';
          }
        } catch (err) {
          console.warn(`[RESTITUTION-REPAIR] Failed to download audio from ${resolvedUrl}:`, err);
        }
      }

      // Step A2: Search for real audio file on Archive.org
      if (!audioBuffer) {
        const archiveAudio = await fetchArchiveOrgMedia(title, 'audio');
        if (archiveAudio?.url) {
          resolvedUrl = archiveAudio.url;
          try {
            const dlRes = await fetchWithTimeout(resolvedUrl, {}, 6000);
            if (dlRes.ok) {
              audioBuffer = Buffer.from(await dlRes.arrayBuffer());
              const contentType = dlRes.headers.get('content-type') || '';
              if (contentType.includes('ogg') || resolvedUrl.endsWith('.ogg')) mimeType = 'audio/ogg';
              else if (contentType.includes('wav') || resolvedUrl.endsWith('.wav')) mimeType = 'audio/wav';
              else if (contentType.includes('audio/ogg') || resolvedUrl.endsWith('.oga')) mimeType = 'audio/ogg';
            }
          } catch (err) {
            console.warn(`[RESTITUTION-REPAIR] Failed to download audio file from archive.org (${resolvedUrl}):`, err);
          }
        }
      }

      if (!audioBuffer) {
        const lyriaPrompt = buildLyriaPrompt(title);
        audioBuffer = await generateLyriaAudio(lyriaPrompt, durationHint);
        if (audioBuffer) mimeType = 'audio/mpeg';
      }

      if (!audioBuffer && (customText || title) && isSpeechAudio(title, customText)) {
        audioBuffer = await synthesizeSpeech(customText || title, targetLangLower);
        mimeType = 'audio/mpeg';
      }

      if (audioBuffer) {
        const hash = crypto.createHash('md5').update(customText || title).digest('hex');
        const ext = getSafeExtension(mimeType, 'mp3');
        const fileName = `audio_${hash}.${ext}`;
        const publicUrl = await uploadToSupabaseStorage(fileName, audioBuffer, mimeType);
        
        if (publicUrl) {
          let updatedAttrs = attrsStr;
          if (attrsStr.includes('url=')) {
            updatedAttrs = updatedAttrs.replace(/url="[^"]*"/, `url="${publicUrl}"`);
          } else {
            updatedAttrs += ` url="${publicUrl}"`;
          }
          updatedContent = updatedContent.replaceAll(fullTag, `<Audio ${updatedAttrs}/>`);
          console.log(`[RESTITUTION-REPAIR] Successfully repaired audio to: ${publicUrl}`);
        }
      }
    }
  }

  // 3. Validate & Repair Markdown Images
  const mdImgRegex = /!\[(.*?)\]\((.*?)\)/g;
  let mdMatch;
  const mdImagesToProcess: { fullMatch: string; altText: string; originalUrl: string }[] = [];
  while ((mdMatch = mdImgRegex.exec(mdxContent)) !== null) {
    mdImagesToProcess.push({ fullMatch: mdMatch[0], altText: mdMatch[1], originalUrl: mdMatch[2] });
  }

  for (const { fullMatch, altText, originalUrl } of mdImagesToProcess) {
    if (checkCount >= MAX_CHECKS || repairCount >= MAX_REPAIRS) break;

    const hasDummyUrl = !originalUrl || originalUrl.includes('example.com') || originalUrl.includes('placeholder') || originalUrl === '';

    let needsResolution = hasDummyUrl;
    if (!needsResolution && originalUrl) {
      checkCount++;
      const exists = await validateMediaUrl(originalUrl);
      if (!exists) {
        console.log(`[RESTITUTION-REPAIR] Markdown image ${originalUrl} is broken (404). Triggering repair.`);
        needsResolution = true;
      }
    }

    if (needsResolution) {
      repairCount++;
      console.log(`[RESTITUTION-REPAIR] Repairing markdown image: "${altText}"`);
      const queryName = altText.trim().replace(/_/g, ' ');
      
      const resolution = await resolveMediaImage(queryName, targetLangLower);
      let sourceUrl = resolution.url;

      let success = false;
      if (sourceUrl) {
        try {
          const imageRes = await fetchWithTimeout(sourceUrl, {}, 10000);
          if (imageRes.ok) {
            const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
            if (!contentType.toLowerCase().includes('text/html')) {
              const buffer = Buffer.from(await imageRes.arrayBuffer());
              const hash = crypto.createHash('md5').update(sourceUrl).digest('hex');
              const ext = getSafeExtension(contentType, 'jpg');
              const fileName = `img_${hash}.${ext}`;
              
              const publicUrl = await uploadToSupabaseStorage(fileName, buffer, contentType);
              if (publicUrl) {
                const finalAltText = resolution.description || altText;
                updatedContent = updatedContent.replaceAll(fullMatch, `![${finalAltText}](${publicUrl})`);
                
                const afterImg = updatedContent.indexOf(`![${finalAltText}](${publicUrl})`);
                if (afterImg !== -1) {
                  const snippet = updatedContent.slice(afterImg, afterImg + 400);
                  const captionMatch = snippet.match(/(\*Figure\s*:[^\n*]+)(\*)/);
                  if (captionMatch) {
                    const originalCaption = captionMatch[0];
                    if (!originalCaption.includes('Source\u00a0:') && !originalCaption.includes('Source:')) {
                      const figNumMatch = originalCaption.match(/^\*Figure\s*(\d*)\s*:\s*/i);
                      const figNumPrefix = figNumMatch ? `Figure ${figNumMatch[1]}: ` : '';
                      
                      let baseCaption = originalCaption
                        .replace(/^\*Figure\s*\d*\s*:\s*/i, '')
                        .replace(/\*$/, '')
                        .trim();
                      baseCaption = baseCaption.split(/\s*(?:—|--|-)?\s*Source\s*:/i)[0].trim();
                      
                      const sourceLabel = resolution.sourceLabel || 'Wikimedia Commons';
                      const finalLabel = compileFinalLabel(sourceLabel, resolution.fallbackUrl);
                      
                      let updatedCaption = '';
                      if (baseCaption) {
                        if (!baseCaption.endsWith('.')) baseCaption += '.';
                        updatedCaption = `*${figNumPrefix}${baseCaption} Source\u00a0: ${finalLabel}*`;
                      } else {
                        updatedCaption = `*${figNumPrefix}Source\u00a0: ${finalLabel}*`;
                      }
                      
                      updatedContent = updatedContent.slice(0, afterImg) +
                        updatedContent.slice(afterImg).replace(originalCaption, updatedCaption);
                    }
                  }
                }
                
                console.log(`[RESTITUTION-REPAIR] Successfully repaired markdown image to: ${publicUrl}`);
                success = true;
              }
            }
          }
        } catch (err) {
          console.warn(`[RESTITUTION-REPAIR] Failed to repair markdown image from ${sourceUrl}:`, err);
        }
      }

      if (!success) {
        // If repair failed, remove the image tag completely as per "Strict No AI Fallbacks for Factual Assets" / "Omit broken images"
        updatedContent = updatedContent.replaceAll(fullMatch, '');
        console.log(`[RESTITUTION-REPAIR] Removed broken/unresolved markdown image: "${altText}"`);
      }
    }
  }

  // 4. Validate & Repair CustomFigures / Images
  const figRegex = /<(CustomFigure|Image)\s+([^>]*?)\/>/g;
  let figMatch;
  const figuresToProcess: { fullTag: string; attrsStr: string }[] = [];
  while ((figMatch = figRegex.exec(mdxContent)) !== null) {
    figuresToProcess.push({ fullTag: figMatch[0], attrsStr: figMatch[2] });
  }

  for (const { fullTag, attrsStr } of figuresToProcess) {
    const currentAttrs = parseAttributesRobustly(attrsStr);
    const originalSrc = currentAttrs.src || '';
    const altText = currentAttrs.alt || '';
    const caption = currentAttrs.caption || '';
    const searchQuery = currentAttrs.searchQuery || currentAttrs.searchquery || '';

    const hasDummyUrl = !originalSrc || originalSrc.includes('example.com') || originalSrc.includes('placeholder') || originalSrc === '';

    let needsResolution = hasDummyUrl;
    if (!needsResolution && originalSrc) {
      if (checkCount < MAX_CHECKS) {
        checkCount++;
        const exists = await validateMediaUrl(originalSrc);
        if (!exists) {
          console.log(`[RESTITUTION-REPAIR] CustomFigure source ${originalSrc} is broken (404). Triggering repair.`);
          needsResolution = true;
        }
      }
    }

    if (needsResolution) {
      let success = false;
      if (repairCount < MAX_REPAIRS) {
        repairCount++;
        console.log(`[RESTITUTION-REPAIR] Repairing CustomFigure: "${searchQuery || altText || caption}"`);
        const queryName = (searchQuery || altText || caption || '').trim().replace(/_/g, ' ');
        
        const resolution = await resolveMediaImage(queryName, targetLangLower);
        let sourceUrl = resolution.url;
        const wikidataFallbackUrl = resolution.fallbackUrl;

        if (sourceUrl) {
          try {
            const imageRes = await fetchWithTimeout(sourceUrl, {}, 10000);
            if (imageRes.ok) {
              const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
              if (!contentType.toLowerCase().includes('text/html')) {
                const buffer = Buffer.from(await imageRes.arrayBuffer());
                const hash = crypto.createHash('md5').update(sourceUrl).digest('hex');
                const ext = getSafeExtension(contentType, 'jpg');
                const fileName = `img_${hash}.${ext}`;
                
                const publicUrl = await uploadToSupabaseStorage(fileName, buffer, contentType);
                if (publicUrl) {
                  currentAttrs.src = publicUrl;
                  if (wikidataFallbackUrl) {
                    currentAttrs.fallbackUrl = wikidataFallbackUrl;
                  }
                  if (resolution.description) {
                    currentAttrs.alt = resolution.description;
                  } else {
                    currentAttrs.alt = altText || caption || searchQuery || '';
                  }
                  
                  const sourceLabel = resolution.sourceLabel || 'Wikimedia Commons';
                  const finalLabel = compileFinalLabel(sourceLabel, resolution.fallbackUrl);
                  
                  const rawCap = (caption || altText || searchQuery || '').trim();
                  const cleanCap = rawCap.split(/\s*(?:—|--|-)?\s*Source\s*:/i)[0].trim();
                  if (cleanCap) {
                    let capText = cleanCap;
                    if (!capText.endsWith('.')) capText += '.';
                    currentAttrs.caption = `${capText} Source: ${finalLabel}`;
                  } else {
                    currentAttrs.caption = `Source: ${finalLabel}`;
                  }
                  console.log(`[RESTITUTION-REPAIR] Successfully repaired CustomFigure to: ${publicUrl}`);
                  success = true;
                }
              }
            }
          } catch (err) {
            console.warn(`[RESTITUTION-REPAIR] Failed to repair CustomFigure image from ${sourceUrl}:`, err);
          }
        }
      } else {
        console.warn(`[RESTITUTION-REPAIR] Repair limit reached, stripping CustomFigure: "${searchQuery || altText || caption}"`);
      }

      if (!success) {
        console.log(`[RESTITUTION-REPAIR] Stripping broken/unresolved CustomFigure: "${altText || caption || searchQuery}"`);
        updatedContent = updatedContent.replaceAll(fullTag, '');
        continue;
      }
    }

    const newTag = rebuildCustomFigure(currentAttrs);
    updatedContent = updatedContent.replaceAll(fullTag, newTag);
  }

  // 5. Renumber figures sequentially to guarantee continuous numbering after client-side deletions/repairs
  updatedContent = renumberFigures(updatedContent, targetLangLower);

  return updatedContent;
}

