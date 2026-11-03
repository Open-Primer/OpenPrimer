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

async function searchMediaImageCascade(
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


