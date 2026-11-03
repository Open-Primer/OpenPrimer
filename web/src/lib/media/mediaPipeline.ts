import { resolveVideosAndAudio } from './videoAudioPasses';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fetchWithTimeout, uploadToSupabaseStorage } from './storageHelpers';
import { searchYouTubeVideo } from './youtubeResolver';
import { fetchWikimediaAudio, searchWikidataImage } from './wikimediaResolver';
import { resolveImageFromSources } from './imageSourceResolver';
import { isFactualMedia, getWikimediaPageUrl } from './factualMediaValidator';
import { isExistingArtwork, parseAttributesRobustly, rebuildCustomFigure } from './figureFormatting';
import { getLanguageSearchTerm } from './mediaTypes';

function getSafeExtension(mimeType: string, defaultExt: string = 'jpg'): string {
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  if (mimeType.includes('svg')) return 'svg';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('wav')) return 'wav';
  if (mimeType.includes('mpeg') || mimeType.includes('mp3')) return 'mp3';
  return defaultExt;
}

async function synthesizeSpeech(text: string, lang: string): Promise<Buffer | null> {
  return null;
}

export async function resolveAndPersistMedia(
  mdxContent: string,
  targetLang: string = 'fr',
  discipline?: string
): Promise<string> {
  let updatedContent = mdxContent;

  // 0. Do not strip media, figures, video, audio, biography, or highlight tags before resolving.


  // 1 & 2. Process Video & Audio players
  updatedContent = await resolveVideosAndAudio(updatedContent, targetLang);

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
          const captionMatch = snippet.match(/(\*Figure\s*(?:\d*|[\w\-]+)?\s*:[^\n*]+)(\*)/);
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
        const searchQuery = `${queryName} cours education ${getLanguageSearchTerm(targetLang)}`;
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
          
          // Use authentic image description if caption is missing or resembles a generation/search prompt
          const rawCap = (caption || description || altText || '').trim();
          const isPromptLike = /^(?:recherche|trouver|search|find|illustration\s*de|sch[eé]ma\s*de|portrait\s*de|photo\s*de|image\s*de|dessin\s*de|croquis\s*de|figure\s*montrant|un\s*sch[eé]ma|une\s*gravure)/i.test(rawCap);
          
          let cleanCap = '';
          if (resolved.description && (isPromptLike || !caption || caption.length < 5)) {
            cleanCap = resolved.description.trim();
          } else {
            cleanCap = rawCap.split(/\s*(?:—|--|-)?\s*Source\s*:/i)[0].trim();
          }

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



