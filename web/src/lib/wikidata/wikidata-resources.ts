import {
  loadCache,
  saveCache,
  cacheKey,
  fetchJson,
  WIKIDATA_SPARQL_URL,
} from './wikidata-sparql';

export interface ResolvedResource {
  title: string;
  author: string | null;
  year: string | null;
  url: string | null;
}

/**
 * Searches Wikidata for a book or scientific paper and extracts its sitelink (Wikipedia), DOI, or ISBN.
 */
async function resolveResourceViaWikidata(
  name: string,
  type: string,
  lang: string = 'en'
): Promise<ResolvedResource | null> {
  const targetLang = lang.toLowerCase().split('-')[0];
  const langs = targetLang === 'en' ? ['en'] : [targetLang, 'en'];

  let searchData = null;
  for (const l of langs) {
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=${l}&format=json&type=item&limit=5`;
    searchData = await fetchJson(searchUrl);
    if (searchData?.search?.length) break;
  }
  if (!searchData?.search?.length) return null;

  const entry = searchData.search[0];
  const qid = entry.id;
  if (!qid) return null;

  // SPARQL to get author, publication date, DOI, ISBN, and wikipedia link
  const sparqlQuery = `
    SELECT ?authorLabel ?pubDate ?doi ?isbn13 ?isbn10 ?sitelink WHERE {
      BIND(wd:${qid} AS ?item)
      OPTIONAL { ?item wdt:P577 ?pubDate . }
      OPTIONAL { ?item wdt:P356 ?doi . }
      OPTIONAL { ?item wdt:P212 ?isbn13 . }
      OPTIONAL { ?item wdt:P957 ?isbn10 . }
      OPTIONAL {
        ?sitelink schema:about ?item ;
                  schema:isPartOf <https://${targetLang}.wikipedia.org/> .
      }
      OPTIONAL { ?item wdt:P2093 ?authorLabel . }
    }
    LIMIT 5
  `;

  const sparqlUrl = `${WIKIDATA_SPARQL_URL}?query=${encodeURIComponent(sparqlQuery)}&format=json`;
  const sparqlData = await fetchJson(sparqlUrl);
  const bindings = sparqlData?.results?.bindings;

  let resolvedTitle = entry.label || name;
  let resolvedAuthor: string | null = null;
  let resolvedYear: string | null = null;
  let resolvedUrl: string | null = null;

  if (bindings && bindings.length > 0) {
    const authors = Array.from(new Set(bindings.map((b: any) => b.authorLabel?.value).filter(Boolean)));
    if (authors.length > 0) {
      resolvedAuthor = authors.join(', ');
    }

    const row = bindings[0];
    
    if (row.pubDate?.value) {
      const match = row.pubDate.value.match(/\d{4}/);
      if (match) resolvedYear = match[0];
    }

    if (row.sitelink?.value) {
      resolvedUrl = row.sitelink.value;
    } else if (row.doi?.value) {
      resolvedUrl = `https://doi.org/${row.doi.value}`;
    } else if (row.isbn13?.value) {
      resolvedUrl = `https://www.worldcat.org/search?q=isbn%3A${row.isbn13.value}`;
    } else if (row.isbn10?.value) {
      resolvedUrl = `https://www.worldcat.org/search?q=isbn%3A${row.isbn10.value}`;
    }
  }

  if (!resolvedUrl) {
    resolvedUrl = `https://${targetLang}.wikipedia.org/wiki/${encodeURIComponent(resolvedTitle.replace(/\s+/g, '_'))}`;
  }

  return {
    title: resolvedTitle,
    author: resolvedAuthor,
    year: resolvedYear,
    url: resolvedUrl
  };
}

/**
 * Resolves metadata and canonical links for external readings/books/articles in the goingFurther section.
 */
export async function resolveGoingFurtherResource(
  title: string,
  author: string | null,
  type: string,
  lang: string = 'en'
): Promise<ResolvedResource | null> {
  if (!title || title.trim().length === 0) return null;

  const cache = loadCache();
  const queryStr = `${title} ${author || ''}`.trim();
  const key = cacheKey(lang, 'resource', `res_${type}_${queryStr}`);

  if (cache[key]) {
    const entry = cache[key];
    if (!entry.url && !entry.dates) return null;
    return {
      title: entry.summary || title,
      author: entry.description || author,
      year: entry.dates || null,
      url: entry.url || null
    };
  }

  console.log(`[wikidata-resolver] Cache miss for resource: "${queryStr}" (type: ${type}). Resolving...`);

  let resolvedTitle = title;
  let resolvedAuthor = author;
  let resolvedYear: string | null = null;
  let resolvedUrl: string | null = null;

  try {
    const targetType = String(type).toLowerCase();
    if (targetType === 'book') {
      const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(queryStr)}&maxResults=1`;
      const data = await fetchJson(searchUrl);
      const volume = data?.items?.[0]?.volumeInfo;
      if (volume) {
        resolvedTitle = volume.title || title;
        if (volume.authors && volume.authors.length > 0) {
          resolvedAuthor = volume.authors.join(', ');
        }
        if (volume.publishedDate) {
          const match = volume.publishedDate.match(/\d{4}/);
          if (match) resolvedYear = match[0];
        }
        resolvedUrl = volume.infoLink || null;
      }
      
      // Wikidata fallback if Google Books failed or hit quota limits
      if (!resolvedUrl) {
        console.log(`[wikidata-resolver] Google Books failed for "${title}". Falling back to Wikidata...`);
        const wdRes = await resolveResourceViaWikidata(title, 'book', lang);
        if (wdRes) {
          resolvedTitle = wdRes.title;
          if (wdRes.author) resolvedAuthor = wdRes.author;
          if (wdRes.year) resolvedYear = wdRes.year;
          if (wdRes.url) resolvedUrl = wdRes.url;
        }
      }
    } else if (targetType === 'article' || targetType === 'research') {
      const searchUrl = `https://api.crossref.org/works?query=${encodeURIComponent(queryStr)}&rows=1`;
      const data = await fetchJson(searchUrl);
      const item = data?.message?.items?.[0];
      if (item) {
        resolvedTitle = item.title?.[0] || title;
        if (item.author && item.author.length > 0) {
          resolvedAuthor = item.author.map((a: any) => `${a.given || ''} ${a.family || ''}`.trim()).join(', ');
        }
        const createdParts = item.created?.['date-parts']?.[0];
        if (createdParts && createdParts[0]) {
          resolvedYear = String(createdParts[0]);
        } else if (item.published?.['date-parts']?.[0]) {
          resolvedYear = String(item.published['date-parts'][0][0]);
        }
        resolvedUrl = item.URL || null;
      }
      
      // Wikidata fallback if CrossRef failed
      if (!resolvedUrl) {
        console.log(`[wikidata-resolver] CrossRef failed for "${title}". Falling back to Wikidata...`);
        const wdRes = await resolveResourceViaWikidata(title, 'article', lang);
        if (wdRes) {
          resolvedTitle = wdRes.title;
          if (wdRes.author) resolvedAuthor = wdRes.author;
          if (wdRes.year) resolvedYear = wdRes.year;
          if (wdRes.url) resolvedUrl = wdRes.url;
        }
      }
    } else if (targetType === 'website') {
      const cleanLang = lang.toLowerCase().split('-')[0];
      const searchUrl = `https://${cleanLang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(title)}&srlimit=1`;
      const data = await fetchJson(searchUrl);
      const firstResult = data?.query?.search?.[0];
      if (firstResult) {
        resolvedTitle = firstResult.title;
        resolvedUrl = `https://${cleanLang}.wikipedia.org/wiki/${encodeURIComponent(firstResult.title)}`;
      }
    }
  } catch (err) {
    console.error(`[wikidata-resolver] Resource query failed for "${queryStr}":`, err);
  }

  if (resolvedUrl || resolvedYear) {
    cache[key] = {
      url: resolvedUrl,
      summary: resolvedTitle,
      description: resolvedAuthor,
      dates: resolvedYear,
      fetchedAt: Date.now()
    };
  } else {
    cache[key] = {
      url: null,
      summary: null,
      description: null,
      dates: null,
      fetchedAt: Date.now()
    };
  }

  saveCache(cache);

  if (!resolvedUrl && !resolvedYear) {
    return null;
  }

  return {
    title: resolvedTitle,
    author: resolvedAuthor,
    year: resolvedYear,
    url: resolvedUrl
  };
}



