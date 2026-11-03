import { fetchWithTimeout } from './storageHelpers';
import { getCachedMedia, setCachedMedia } from './mediaTypes';
import { compileFinalLabel } from './figureFormatting';

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

    const TTS_CONFIG_MAP: Record<string, { langCode: string; voiceName: string }> = {
      FR: { langCode: 'fr-FR', voiceName: 'fr-FR-Standard-A' },
      EN: { langCode: 'en-US', voiceName: 'en-US-Standard-A' },
      ES: { langCode: 'es-ES', voiceName: 'es-ES-Standard-A' },
      DE: { langCode: 'de-DE', voiceName: 'de-DE-Standard-A' },
      ZH: { langCode: 'zh-CN', voiceName: 'zh-CN-Standard-A' },
      PT: { langCode: 'pt-BR', voiceName: 'pt-BR-Standard-A' },
      AR: { langCode: 'ar-XA', voiceName: 'ar-XA-Standard-A' },
      HI: { langCode: 'hi-IN', voiceName: 'hi-IN-Standard-A' },
      UR: { langCode: 'ur-PK', voiceName: 'ur-PK-Standard-A' }
    };
    const ttsConfig = TTS_CONFIG_MAP[lang.toUpperCase()] || TTS_CONFIG_MAP.EN;
    const langCode = ttsConfig.langCode;
    const voiceName = ttsConfig.voiceName;
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

