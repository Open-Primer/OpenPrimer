import { isFactualMedia } from './factualMediaValidator';

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

    const TARGET_LANG_NAME_MAP: Record<string, string> = {
      FR: 'français', EN: 'anglais', ES: 'espagnol', DE: 'allemand',
      ZH: 'chinois', PT: 'portugais', AR: 'arabe', HI: 'hindi', UR: 'ourdou'
    };
    const targetLangName = TARGET_LANG_NAME_MAP[lang.toUpperCase()] || 'anglais';

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
  const isHistoryOrLit = disc.includes('hist') || disc.includes('liter') || disc.includes('class') || ['fr', 'es', 'it'].includes((lang || '').toLowerCase());
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


