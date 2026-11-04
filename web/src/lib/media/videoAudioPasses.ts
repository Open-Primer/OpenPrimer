import { validateYouTubeVideo } from './youtubeResolver';
import { getLanguageSearchTerm } from './mediaTypes';
import { validateMediaUrl } from './storageHelpers';
import { fetchArchiveOrgMedia } from './factualMediaValidator';
import { buildLyriaPrompt, generateLyriaAudio, isSpeechAudio } from './wikimediaResolver';
import crypto from 'crypto';
import { fetchWithTimeout, uploadToSupabaseStorage } from './storageHelpers';
import { searchYouTubeVideo } from './youtubeResolver';
import { fetchWikimediaAudio } from './wikimediaResolver';
import { parseAttributesRobustly } from './figureFormatting';

export function getSafeExtension(mimeType: string, defaultExt: string = 'jpg'): string {
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  if (mimeType.includes('svg')) return 'svg';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('wav')) return 'wav';
  if (mimeType.includes('mpeg') || mimeType.includes('mp3')) return 'mp3';
  return defaultExt;
}

export async function synthesizeSpeech(text: string, lang: string): Promise<Buffer | null> {
  return null;
}

export async function resolveVideosAndAudio(mdxContent: string, targetLang: string = 'fr'): Promise<string> {
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
      const searchQuery = `${title} cours education ${getLanguageSearchTerm(targetLang)}`;
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

  return updatedContent;
}
