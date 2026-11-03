import { getCachedMedia, setCachedMedia } from './mediaTypes';
import { searchWikimediaCommonsImage, searchWikidataImage } from './wikimediaResolver';
import { validateImageWithGemini } from './geminiImageValidator';
import { getConciseQuery } from './conciseQueryBuilder';
import { isFactualMedia } from './factualMediaValidator';
import { compileFinalLabel } from './figureFormatting';

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
    
    // Step C: Retrieve lead image from page title
    const pageImgUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=original&titles=${encodeURIComponent(pageTitle)}&format=json&origin=*`;
    const imgRes = await fetchWithTimeout(pageImgUrl, {}, 4000);
    if (imgRes.ok) {
      const imgJson = await safeResponseJson(imgRes, 'Wikipedia pageimage fetch');
      const pages = imgJson.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId !== '-1') {
          const leadSourceUrl = pages[pageId]?.original?.source || pages[pageId]?.thumbnail?.source;
          // Filter out obvious icon/flag names
          const isGenericIcon = leadSourceUrl && /(?:flag_of|symbol_|crystal_clear|disambig|question_mark|wiki_letter|ambox)/i.test(leadSourceUrl);
          if (leadSourceUrl && !isGenericIcon) {
            const fallbackUrl = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replace(/\s/g, '_'))}`;
            return {
              url: leadSourceUrl,
              fallbackUrl: fallbackUrl,
              pageTitle: pageTitle
            };
          }
        }
      }
    }

    // Step D: If no valid lead image, scan article images from prop=images
    const articleImagesUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=images&imlimit=15&titles=${encodeURIComponent(pageTitle)}&format=json&origin=*`;
    const artRes = await fetchWithTimeout(articleImagesUrl, {}, 4000);
    if (artRes.ok) {
      const artJson = await safeResponseJson(artRes, 'Wikipedia article images fetch');
      const artPages = artJson.query?.pages;
      if (artPages) {
        const pId = Object.keys(artPages)[0];
        const imagesList = artPages[pId]?.images || [];
        for (const imgObj of imagesList) {
          const imgTitle = imgObj.title || '';
          if (/(?:flag_of|symbol_|crystal_clear|disambig|question_mark|wiki_letter|ambox|p_vip|portal-|stub|icon|logo)/i.test(imgTitle)) continue;
          if (!imgTitle.match(/\.(jpe?g|png|svg|webp)$/i)) continue;

          // Resolve direct URL of this commons file
          const commonsFileName = imgTitle.replace(/^File:/i, '').replace(/^Fichier:/i, '');
          const fileUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(commonsFileName.replace(/\s/g, '_'))}`;
          const fallbackUrl = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replace(/\s/g, '_'))}`;
          console.log(`[WIKIPEDIA-ARTICLE-MEDIA] Extracted article image "${imgTitle}" from page "${pageTitle}": ${fileUrl}`);
          return {
            url: fileUrl,
            fallbackUrl: fallbackUrl,
            pageTitle: pageTitle
          };
        }
      }
    }

    return null;
  } catch (err) {
    console.warn(`[MEDIA-RESOLVER] fetchWikipediaImage failed for "${title}":`, err);
    return null;
  }
}

// Wikimedia Commons Audio Fetcher


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


