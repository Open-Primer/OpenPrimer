import { isFactualMedia } from './factualMediaValidator';

export function compileFinalLabel(sourceLabel: string, sourceUrl?: string | null): string {
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

// TransientNetworkError & StructuralJsonError imported from ./errors

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
      const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'OpenPrimer/1.0 (https://openprimer.org; contact@openprimer.org)' } }, 1200);
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
  if (l === 'es' || l === 'pt') return 'Figura';
  if (l === 'de') return 'Abbildung';
  if (l === 'zh') return '图';
  if (l === 'ar') return 'الشكل';
  if (l === 'hi') return 'चित्र';
  if (l === 'ur') return 'خاکہ';
  return 'Figure';
}

export function renumberFigures(mdx: string, lang: string = 'en'): string {
  const prefix = getFigurePrefix(lang);
  let figureCount = 1;
  
  // Sortable match items to handle replacements in one single pass in order of occurrence
  const matches: { index: number; length: number; replace: () => string }[] = [];
  
  // 1. Match JSX Figures: <CustomFigure ... /> or <Image ... />
  const jsxRegex = /<(CustomFigure|Image)\s+([^>]*?)\/>/gi;
  let match;
  while ((match = jsxRegex.exec(mdx)) !== null) {
    const fullMatch = match[0];
    const tagName = match[1];
    const attrsStr = match[2];
    const currentIndex = match.index;
    
    matches.push({
      index: currentIndex,
      length: fullMatch.length,
      replace: () => {
        if (/\bunresolved(?:={true})?\b/.test(attrsStr)) {
          return fullMatch;
        }
        if (/\bisIllustration(={true})?\b/.test(attrsStr)) {
          return fullMatch;
        }
        
        const srcMatch = attrsStr.match(/\bsrc=(["'])(.*?)\1/);
        const hasSrc = srcMatch && srcMatch[2].trim().length > 0;
        
        const captionMatch = attrsStr.match(/\bcaption=(["'])([\s\S]*?)\1/);
        const hasCaption = captionMatch && captionMatch[2].trim().length > 0;

        if (!hasSrc && !hasCaption) {
          if (attrsStr.includes('unresolved')) {
            return fullMatch;
          }
          const trimmedAttrs = attrsStr.trim();
          const separator = trimmedAttrs ? ' ' : '';
          return `<${tagName} ${trimmedAttrs}${separator}unresolved={true}/>`;
        }

        const currentCount = figureCount++;
        
        if (!captionMatch) {
          const newCaption = `${prefix} ${currentCount}`;
          const updatedAttrs = attrsStr.trim() + ` caption="${newCaption}"`;
          return `<${tagName} ${updatedAttrs}/>`;
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
        const newCaption = `${prefix} ${currentCount}: ${escapedCleanCaption}`;
        
        const updatedAttrs = attrsStr.replace(/caption=(["'])([\s\S]*?)\1/, `caption=$1${newCaption}$1`);
        return `<${tagName} ${updatedAttrs}/>`;
      }
    });
  }
  
  // 2. Match Markdown Figure Captions: *Figure ... : ...*
  const mdCaptionRegex = /\*\s*(Figure|Figura|Abbildung|Illustration|Sch\u00e9ma|Schema|Diagramme|Diagram|Graphique|Graph|\u56fe)\s*(?:\d+(?:\.\d+)*[a-z]?|\d*)?\s*[:\-\u2013\u2014][^\n*]*\*/gi;
  while ((match = mdCaptionRegex.exec(mdx)) !== null) {
    const fullMatch = match[0];
    const currentIndex = match.index;
    
    matches.push({
      index: currentIndex,
      length: fullMatch.length,
      replace: () => {
        const currentCount = figureCount++;
        const innerText = fullMatch.slice(1, -1).trim(); // remove outer '*'
        const prefixesPattern = /^(?:Figure|Figura|Abbildung|Illustration|Sch\u00e9ma|Schema|Diagramme|Diagram|Graphique|Graph|\u56fe)(?:\s+\d+(?:\.\d+)*[a-z]?\s*[:\-\u2013\u2014]?|\s*[:\-\u2013\u2014])\s*/gi;
        let cleanText = innerText;
        let previousText = '';
        while (cleanText !== previousText) {
          previousText = cleanText;
          cleanText = cleanText.replace(prefixesPattern, '').trim();
        }
        return `*${prefix} ${currentCount}: ${cleanText}*`;
      }
    });
  }
  
  if (matches.length === 0) return mdx;
  
  // Sort matches by index ascending
  matches.sort((a, b) => a.index - b.index);
  
  let result = '';
  let lastIndex = 0;
  for (const m of matches) {
    if (m.index < lastIndex) continue;
    
    result += mdx.slice(lastIndex, m.index);
    result += m.replace();
    lastIndex = m.index + m.length;
  }
  result += mdx.slice(lastIndex);
  
  return result;
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

