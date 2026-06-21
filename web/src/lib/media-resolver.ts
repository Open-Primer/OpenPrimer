import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { supabaseAdmin } from './supabase';

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


async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => {
    try { controller.abort(); } catch {}
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
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

// Wikipedia Image Fetcher
async function fetchWikipediaImage(title: string, lang: string = 'fr'): Promise<string | null> {
  try {
    const cleanTitle = title.trim().replace(/\s+/g, '_');
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=original&titles=${encodeURIComponent(cleanTitle)}&format=json&origin=*`;
    const res = await fetchWithTimeout(url, {}, 4000);
    if (!res.ok) return null;
    
    const json = await safeResponseJson(res, 'Wikipedia image fetch');
    const pages = json.query?.pages;
    if (!pages) return null;
    
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1') {
      // If language specific search failed, fallback to English wiki
      if (lang !== 'en') {
        return fetchWikipediaImage(title, 'en');
      }
      return null;
    }
    
    return pages[pageId]?.original?.source || pages[pageId]?.thumbnail?.source || null;
  } catch (err) {
    console.warn(`[MEDIA-RESOLVER] Failed to fetch Wikipedia image for ${title}:`, err);
    return null;
  }
}

// YouTube search scraper (no key needed)
async function searchYouTubeVideo(query: string): Promise<string | null> {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetchWithTimeout(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    }, 5000);
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/"videoId"\s*:\s*"([\w-]{11})"/);
    if (match && match[1]) {
      return match[1];
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

// Wikimedia Commons Audio Fetcher
async function fetchWikimediaAudio(title: string): Promise<string | null> {
  try {
    const cleanTitle = title.trim();
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

/**
 * Parses and replaces media links in MDX Content:
 * - Resolves Pollinations/placeholder images with official Wikipedia/Wikimedia Commons images when applicable.
 * - Downloads and uploads images to Supabase Storage.
 * - Resolves missing/dummy YouTube video links with actual search results.
 * - Generates actual audio voiceovers using Google Cloud TTS and uploads them.
 */
export async function resolveAndPersistMedia(mdxContent: string, targetLang: string = 'fr'): Promise<string> {
  let updatedContent = mdxContent;

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

      // Step B: Lyria music generation — the AI audio equivalent of Imagen/Pollinations.
      // Triggered when no real CC file was found on Wikimedia Commons.
      // Best suited for: musical clips, nature sounds, atmospheric audio, instrument notes.
      const durationHint = attrsStr.match(/duration="([^"]+)"/)?.[1] || '30s';
      if (!audioBuffer) {
        const lyriaPrompt = buildLyriaPrompt(title);
        audioBuffer = await generateLyriaAudio(lyriaPrompt, durationHint);
        if (audioBuffer) mimeType = 'audio/mpeg';
      }

      // Step C: Fallback to Text-to-Speech synthesis (always available via GCP SA).
      // Best suited for: spoken language phrases, pronunciation examples, lecture narration.
      if (!audioBuffer && (customText || title)) {
        const textToSynthesize = customText || title;
        audioBuffer = await synthesizeSpeech(textToSynthesize, targetLang);
        mimeType = 'audio/mpeg';
      }


      // Step D: Upload whichever buffer we have to Supabase Storage and replace URL
      if (audioBuffer) {
        const hash = crypto.createHash('md5').update(customText || title).digest('hex');
        const ext = mimeType.split('/')[1] || 'mp3';
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

    if (originalUrl) {
      console.log(`[MEDIA-RESOLVER] Processing Markdown image: ${altText} (${originalUrl})`);
      let sourceUrl = originalUrl;

      // Check if we should find a real Wikipedia image instead of Pollinations/placeholder
      // We look if altText represents a concrete artwork or historical person
      const queryName = altText.trim().replace(/_/g, ' ');
      const wikiImage = await fetchWikipediaImage(queryName, targetLang);
      if (wikiImage) {
        console.log(`[MEDIA-RESOLVER] Found real historical image on Wikipedia for "${queryName}": ${wikiImage}`);
        sourceUrl = wikiImage;
      }

      // Enforce strict restriction against generating existing historical artworks, sculptures, monuments, photographs
      if (sourceUrl.includes('pollinations.ai') && isExistingArtwork(sourceUrl, altText)) {
        console.warn(`[MEDIA-RESOLVER] Blocked AI generation of existing artwork: "${altText}"`);
        updatedContent = updatedContent.replace(fullMatch, `\n\n> ⚠️ *La génération par IA de l'œuvre d'art "${altText}" (peinture, sculpture, monument ou photographie historique) a été bloquée pour préserver l'intégrité pédagogique de l'apprentissage.* \n\n`);
        continue;
      }

      // Download and upload to Supabase Storage
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

        if (buffer) {
          const hash = crypto.createHash('md5').update(sourceUrl).digest('hex');
          const ext = contentType.split('/')[1] || 'jpg';
          const fileName = `img_${hash}.${ext}`;
          
          const publicUrl = await uploadToSupabaseStorage(fileName, buffer, contentType);
          if (publicUrl) {
            updatedContent = updatedContent.replace(fullMatch, `![${altText}](${publicUrl})`);
          }
        }
      } catch (err) {
        console.warn(`[MEDIA-RESOLVER] Failed to download or upload image ${sourceUrl}:`, err);
      }
    }
  }

  // Process JSX Figures: <CustomFigure src="..." />
  const figRegex = /<CustomFigure\s+([^>]*)\/>/g;
  let figMatch;
  while ((figMatch = figRegex.exec(mdxContent)) !== null) {
    const fullTag = figMatch[0];
    const attrsStr = figMatch[1];

    const srcMatch = attrsStr.match(/src="([^"]+)"/);
    const altMatch = attrsStr.match(/alt="([^"]+)"/);
    const captionMatch = attrsStr.match(/caption="([^"]+)"/);

    const originalSrc = srcMatch ? srcMatch[1] : '';
    const altText = altMatch ? altMatch[1] : '';
    const caption = captionMatch ? captionMatch[1] : '';

    if (originalSrc) {
      console.log(`[MEDIA-RESOLVER] Processing JSX Figure: ${altText} (${originalSrc})`);
      let sourceUrl = originalSrc;

      const queryName = (altText || caption || '').trim().replace(/_/g, ' ');
      if (queryName) {
        const wikiImage = await fetchWikipediaImage(queryName, targetLang);
        if (wikiImage) {
          console.log(`[MEDIA-RESOLVER] Found real Wikipedia image for Figure "${queryName}": ${wikiImage}`);
          sourceUrl = wikiImage;
        }
      }

      // Enforce strict restriction against generating existing historical artworks, sculptures, monuments, photographs
      if (sourceUrl.includes('pollinations.ai') && isExistingArtwork(sourceUrl, altText || caption)) {
        console.warn(`[MEDIA-RESOLVER] Blocked AI generation of existing artwork Figure: "${altText || caption}"`);
        updatedContent = updatedContent.replace(fullTag, `\n\n> ⚠️ *La génération par IA de l'œuvre d'art "${altText || caption}" (peinture, sculpture, monument ou photographie historique) a été bloquée pour préserver l'intégrité pédagogique de l'apprentissage.* \n\n`);
        continue;
      }

      // Download and upload to Supabase Storage
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

        if (buffer) {
          const hash = crypto.createHash('md5').update(sourceUrl).digest('hex');
          const ext = contentType.split('/')[1] || 'jpg';
          const fileName = `img_${hash}.${ext}`;
          
          const publicUrl = await uploadToSupabaseStorage(fileName, buffer, contentType);
          if (publicUrl) {
            const updatedAttrs = attrsStr.replace(/src="[^"]*"/, `src="${publicUrl}"`);
            updatedContent = updatedContent.replace(fullTag, `<CustomFigure ${updatedAttrs}/>`);
          }
        }
      } catch (err) {
        console.warn(`[MEDIA-RESOLVER] Failed to download or upload JSX image ${sourceUrl}:`, err);
      }
    }
  }

  return updatedContent;
}

export async function validateMediaUrl(url: string): Promise<boolean> {
  if (!url || url.includes('example.com') || url.includes('placeholder') || url.startsWith('placeholder')) {
    return false;
  }
  // Local/public assets
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//')) {
    try {
      const localPath = path.join(process.cwd(), 'public', url.startsWith('/') ? url : `/${url}`);
      return fs.existsSync(localPath);
    } catch {
      return false;
    }
  }
  try {
    const res = await fetchWithTimeout(url, { method: 'HEAD' }, 2000);
    if (res.status === 404) {
      return false;
    }
    return true;
  } catch (err) {
    // Timeout/network issue: assume true to avoid false positive overrides
    return true;
  }
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

  const targetLangLower = targetLang.toLowerCase();

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
        
        updatedContent = updatedContent.replace(fullTag, `<Video ${updatedAttrs}/>`);
        console.log(`[RESTITUTION-REPAIR] Successfully repaired video "${title}" to ID: ${realId}`);
      } else {
        console.log(`[RESTITUTION-REPAIR] Could not resolve alternative video for "${title}". Removing broken <Video> tag.`);
        updatedContent = updatedContent.replace(fullTag, '');
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

      if (!audioBuffer) {
        const lyriaPrompt = buildLyriaPrompt(title);
        audioBuffer = await generateLyriaAudio(lyriaPrompt, durationHint);
        if (audioBuffer) mimeType = 'audio/mpeg';
      }

      if (!audioBuffer && (customText || title)) {
        audioBuffer = await synthesizeSpeech(customText || title, targetLangLower);
        mimeType = 'audio/mpeg';
      }

      if (audioBuffer) {
        const hash = crypto.createHash('md5').update(customText || title).digest('hex');
        const ext = mimeType.split('/')[1] || 'mp3';
        const fileName = `audio_${hash}.${ext}`;
        const publicUrl = await uploadToSupabaseStorage(fileName, audioBuffer, mimeType);
        
        if (publicUrl) {
          let updatedAttrs = attrsStr;
          if (attrsStr.includes('url=')) {
            updatedAttrs = updatedAttrs.replace(/url="[^"]*"/, `url="${publicUrl}"`);
          } else {
            updatedAttrs += ` url="${publicUrl}"`;
          }
          updatedContent = updatedContent.replace(fullTag, `<${tagName} ${updatedAttrs}/>`);
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
      
      let sourceUrl = await fetchWikipediaImage(queryName, targetLangLower);
      if (!sourceUrl && queryName) {
        sourceUrl = await searchWikimediaCommonsImage(queryName);
      }

      if (sourceUrl) {
        try {
          const imageRes = await fetchWithTimeout(sourceUrl, {}, 10000);
          if (imageRes.ok) {
            const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
            const buffer = Buffer.from(await imageRes.arrayBuffer());
            const hash = crypto.createHash('md5').update(sourceUrl).digest('hex');
            const ext = contentType.split('/')[1] || 'jpg';
            const fileName = `img_${hash}.${ext}`;
            
            const publicUrl = await uploadToSupabaseStorage(fileName, buffer, contentType);
            if (publicUrl) {
              updatedContent = updatedContent.replace(fullMatch, `![${altText}](${publicUrl})`);
              console.log(`[RESTITUTION-REPAIR] Successfully repaired markdown image to: ${publicUrl}`);
            }
          }
        } catch (err) {
          console.warn(`[RESTITUTION-REPAIR] Failed to repair markdown image from ${sourceUrl}:`, err);
        }
      }
    }
  }

  // 4. Validate & Repair CustomFigures
  const figRegex = /<CustomFigure\s+([^>]*?)\/>/g;
  let figMatch;
  const figuresToProcess: { fullTag: string; attrsStr: string }[] = [];
  while ((figMatch = figRegex.exec(mdxContent)) !== null) {
    figuresToProcess.push({ fullTag: figMatch[0], attrsStr: figMatch[1] });
  }

  for (const { fullTag, attrsStr } of figuresToProcess) {
    if (checkCount >= MAX_CHECKS || repairCount >= MAX_REPAIRS) break;

    const srcMatch = attrsStr.match(/src="([^"]+)"/);
    const altMatch = attrsStr.match(/alt="([^"]+)"/);
    const captionMatch = attrsStr.match(/caption="([^"]+)"/);

    const originalSrc = srcMatch ? srcMatch[1] : '';
    const altText = altMatch ? altMatch[1] : '';
    const caption = captionMatch ? captionMatch[1] : '';

    const hasDummyUrl = !originalSrc || originalSrc.includes('example.com') || originalSrc.includes('placeholder') || originalSrc === '';

    let needsResolution = hasDummyUrl;
    if (!needsResolution && originalSrc) {
      checkCount++;
      const exists = await validateMediaUrl(originalSrc);
      if (!exists) {
        console.log(`[RESTITUTION-REPAIR] CustomFigure source ${originalSrc} is broken (404). Triggering repair.`);
        needsResolution = true;
      }
    }

    if (needsResolution) {
      repairCount++;
      console.log(`[RESTITUTION-REPAIR] Repairing CustomFigure: "${altText || caption}"`);
      const queryName = (altText || caption || '').trim().replace(/_/g, ' ');
      
      let sourceUrl = await fetchWikipediaImage(queryName, targetLangLower);
      if (!sourceUrl && queryName) {
        sourceUrl = await searchWikimediaCommonsImage(queryName);
      }

      if (sourceUrl) {
        try {
          const imageRes = await fetchWithTimeout(sourceUrl, {}, 10000);
          if (imageRes.ok) {
            const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
            const buffer = Buffer.from(await imageRes.arrayBuffer());
            const hash = crypto.createHash('md5').update(sourceUrl).digest('hex');
            const ext = contentType.split('/')[1] || 'jpg';
            const fileName = `img_${hash}.${ext}`;
            
            const publicUrl = await uploadToSupabaseStorage(fileName, buffer, contentType);
            if (publicUrl) {
              let updatedAttrs = attrsStr;
              if (attrsStr.includes('src=')) {
                updatedAttrs = updatedAttrs.replace(/src="[^"]*"/, `src="${publicUrl}"`);
              } else {
                updatedAttrs += ` src="${publicUrl}"`;
              }
              updatedContent = updatedContent.replace(fullTag, `<CustomFigure ${updatedAttrs}/>`);
              console.log(`[RESTITUTION-REPAIR] Successfully repaired CustomFigure to: ${publicUrl}`);
            }
          }
        } catch (err) {
          console.warn(`[RESTITUTION-REPAIR] Failed to repair CustomFigure image from ${sourceUrl}:`, err);
        }
      }
    }
  }

  return updatedContent;
}

