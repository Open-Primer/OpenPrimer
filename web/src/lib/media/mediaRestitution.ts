import { validateMediaUrl } from './storageHelpers';
import { searchYouTubeVideo } from './youtubeResolver';
import { resolveImageFromSources } from './imageSourceResolver';
import { searchWikidataImage } from './wikimediaResolver';
import { isFactualMedia } from './factualMediaValidator';
import { getLanguageSearchTerm } from './mediaTypes';
import { parseAttributesRobustly, rebuildCustomFigure } from './figureFormatting';

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
      const SEARCH_LANG_NAME_MAP: Record<string, string> = {
        FR: 'français', EN: 'english', ES: 'español', DE: 'deutsch',
        ZH: '中文', PT: 'português', AR: 'عربي', HI: 'हिन्दी', UR: 'اردو'
      };
      const langDescriptor = SEARCH_LANG_NAME_MAP[targetLangLower.toUpperCase()] || 'english';
      const searchQuery = `${title} cours education ${langDescriptor}`;
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
                  const captionMatch = snippet.match(/(\*Figure\s*(?:\d*|[\w\-]+)?\s*:[^\n*]+)(\*)/);
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
          updatedContent = updatedContent.replaceAll(fullMatch, '');
        }
        console.log(`[RESTITUTION-REPAIR] Removed broken/unresolved markdown image and caption: "${altText}"`);
      }
    }
  }

  // 4. Validate & Repair CustomFigures / Images
  const figRegex = /<(CustomFigure|Image)\s+([^>]*?)\/>/g;
  let figMatch;
  const figuresToProcess: { fullTag: string; tagName: string; attrsStr: string }[] = [];
  while ((figMatch = figRegex.exec(mdxContent)) !== null) {
    figuresToProcess.push({ fullTag: figMatch[0], tagName: figMatch[1], attrsStr: figMatch[2] });
  }

  for (const { fullTag, tagName, attrsStr } of figuresToProcess) {
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

    const newTag = rebuildCustomFigure(currentAttrs, tagName);
    updatedContent = updatedContent.replaceAll(fullTag, newTag);
  }

  // 5. Renumber figures sequentially to guarantee continuous numbering after client-side deletions/repairs
  updatedContent = renumberFigures(updatedContent, targetLangLower);

  return updatedContent;
}


