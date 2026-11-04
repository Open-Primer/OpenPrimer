import { compressPromptText } from '@/lib/vertex-client';
import { searchWikidataImage, searchWikimediaCommonsImage } from './wikimediaResolver';
import { fetchWikipediaImage } from './imageSourceResolver';
import { fetchGallicaImage, fetchArchiveOrgMedia } from './factualMediaValidator';
import { optimizeQueryWithGemini } from './conciseQueryBuilder';
import { callVertexAI } from '../vertex-client';
import { fetchWithTimeout } from './storageHelpers';

export async function validateImageWithGemini(imageUrl: string, description: string): Promise<boolean> {
  try {
    const resImg = await fetchWithTimeout(imageUrl, {}, 8000);
    if (!resImg.ok) {
      console.warn(`[MEDIA-RESOLVER] Failed to download image for validation: ${imageUrl}`);
      return false;
    }
    let contentType = resImg.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await resImg.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    if (contentType.toLowerCase().includes('svg') || imageUrl.toLowerCase().endsWith('.svg')) {
      try {
        const sharp = require('sharp');
        buffer = await sharp(buffer).png().toBuffer();
        contentType = 'image/png';
        console.log(`[MEDIA-RESOLVER] Successfully rasterized SVG image to PNG via sharp for Gemini validation.`);
      } catch (e) {
        console.warn(`[MEDIA-RESOLVER] Failed to convert SVG to PNG via sharp:`, e);
      }
    }
    const base64Data = buffer.toString('base64');

    const promptText = `Analyze the attached image and determine if it directly and accurately depicts or academically illustrates the following subject: "${description}".
    
CRITICAL VALIDATION RULES:
1. The image must be a direct visual representation or a highly relevant academic diagram (such as a geometric figure, mathematical plot, anatomical schema, map, or historical illustration) that directly explains the concept or subject.
2. Reject the image (answer NO) only if it is completely unrelated, generic decorative/filler (e.g. a random stock photo of a desk or a sunset), or shows an entirely different and irrelevant concept.
3. Accept relevant context: showing a geometric right-triangle diagram to illustrate "monochord" or "Pythagoras", showing a historical map of Greece for "Pythagoras", or showing a technical drawing or schematic of a physical/mathematical concept is highly acceptable and SHOULD be approved (YES).
4. If the subject is a specific instrument, tool, or object, the image must show that object or a schematic/diagram of it.
5. If the subject is a person, the image must show a portrait, bust, statue, painting, or a diagram of a discovery/concept highly associated with that person.

Does the image directly represent or academically illustrate the subject? Respond with exactly one word: YES or NO.`;

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
      console.log(`[MEDIA-RESOLVER] Gemini validation answer for "${description}" against image: "${answer}"`);
      if (answer.includes('NON') || answer.includes('NO')) {
        console.warn(`[MEDIA-RESOLVER] Gemini REJECTED image for description "${description}": ${imageUrl}`);
        return false;
      }
      return true;
    }
  } catch (err) {
    console.warn('[MEDIA-RESOLVER] Error validating image with Gemini:', err);
  }
  return true;
}

export async function searchMediaImageCascade(
  queryName: string,
  lang: string
): Promise<{ url: string | null; fallbackUrl: string | null; sourceLabel?: string }> {
  const wikidataResult = await searchWikidataImage(queryName, lang);
  if (wikidataResult.url) {
    const isValid = await validateImageWithGemini(wikidataResult.url, queryName);
    if (isValid) {
      return { ...wikidataResult, sourceLabel: 'Wikimedia Commons' };
    } else {
      console.log(`[MEDIA-RESOLVER] Wikidata image rejected by Gemini for query "${queryName}". Trying fallback...`);
    }
  }

  const wikiImageResult = await fetchWikipediaImage(queryName, lang);
  if (wikiImageResult) {
    const wikiUrl = wikiImageResult.url;
    const isValid = await validateImageWithGemini(wikiUrl, queryName);
    if (isValid) {
      const fallbackUrl = wikiImageResult.fallbackUrl;
      return { url: wikiUrl, fallbackUrl, sourceLabel: 'Wikimedia Commons' };
    } else {
      console.log(`[MEDIA-RESOLVER] Wikipedia page image rejected by Gemini for query "${queryName}". Trying fallback...`);
    }
  }

  const gallicaUrl = await fetchGallicaImage(queryName);
  if (gallicaUrl) {
    const isValid = await validateImageWithGemini(gallicaUrl, queryName);
    if (isValid) {
      return { url: gallicaUrl, fallbackUrl: wikidataResult.fallbackUrl || null, sourceLabel: 'Gallica / BNF' };
    } else {
      console.log(`[MEDIA-RESOLVER] Gallica image rejected by Gemini for query "${queryName}". Trying fallback...`);
    }
  }

  const commonsUrl = await searchWikimediaCommonsImage(queryName);
  if (commonsUrl) {
    const isValid = await validateImageWithGemini(commonsUrl, queryName);
    if (isValid) {
      return { url: commonsUrl, fallbackUrl: wikidataResult.fallbackUrl || null, sourceLabel: 'Wikimedia Commons' };
    } else {
      console.log(`[MEDIA-RESOLVER] Wikimedia Commons image rejected by Gemini for query "${queryName}".`);
    }
  }

  const queryEnglish = lang.startsWith('en') ? queryName : await optimizeQueryWithGemini(queryName, lang, true);
  const archiveResult = await fetchArchiveOrgMedia(queryEnglish, 'image');
  if (archiveResult?.url) {
    const isValid = await validateImageWithGemini(archiveResult.url, queryName);
    if (isValid) {
      return { url: archiveResult.url, fallbackUrl: wikidataResult.fallbackUrl || null, sourceLabel: archiveResult.sourceLabel };
    } else {
      console.log(`[MEDIA-RESOLVER] Archive.org image rejected by Gemini for query "${queryName}".`);
    }
  }

  return { url: null, fallbackUrl: wikidataResult.fallbackUrl || null };
}



export async function validateImageSoftWithGemini(imageUrl: string, entityName: string): Promise<boolean> {
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

export async function generateQueryRelaxationsWithGemini(specificQuery: string, lang: string = 'en'): Promise<string[]> {
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
