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


