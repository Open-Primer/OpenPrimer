import { fetchWithTimeout } from './urlReachability';
import { fetchWikimediaAudio } from '../media-resolver';

/**
 * @file resource-validator.ts
 * @description External resources, bibliography citations, audio, video and image validators
 * with automated reachability checking, fallback discovery and MDX repair.
 */

import { dbService } from '../db';
import { callVertexAI, isVertexConfigured } from '../vertex-client';
import { searchYouTubeVideo, fetchWikimediaAudio } from '../media-resolver';
import { resolveGoingFurtherResource } from '../wikidata-resolver';

export async function findAlternativeAudio(title: string, lang: string): Promise<string | null> {
  console.log(`[ALTERNATIVE SEARCH] Searching alternative audio for title: "${title}" (${lang})...`);
  const queries = [
    title,
    `${title} podcast`,
    `${title} audio guide`
  ];
  for (let attempt = 0; attempt < 3; attempt++) {
    const query = queries[attempt];
    console.log(`[ALTERNATIVE SEARCH] Audio Search Attempt ${attempt + 1}/3 with query: "${query}"`);
    
    const prompt = `You are a Research Agent (Agent C).
Find a real, public, educational MP3 or audio URL about: "${query}".
The audio must be in language: "${lang}".
Output JSON only:
{
  "url": "https://example.com/real-audio-file.mp3"
}
If you cannot find any real audio, output: {}`;

    try {
      let rawJson = '';
      if (isVertexConfigured()) {
        const res = await callVertexAI({
          task: 'course_generation',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: audioSearchSchema
          }
        });
        if (res && res.ok) {
          const jsonRes = await res.json();
          rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        }
      } else if (apiKey) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: compressPromptText(prompt) }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: audioSearchSchema
            }
          })
        });
        if (res.ok) {
          const jsonRes = await res.json();
          rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        }
      }

      if (rawJson) {
        const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = safeJsonParse(cleaned, 'Audio Search Alternative');
        if (data.url) {
          const audioTag = `<Audio url="${data.url}" />`;
          const isReachable = await isAudioReachable(audioTag);
          if (isReachable) {
            console.log(`[ALTERNATIVE SEARCH] Found valid alternative audio: URL=${data.url}`);
            return data.url;
          }
        }
      }
    } catch (err) {
      console.warn(`[ALTERNATIVE SEARCH] Audio search exception on attempt ${attempt + 1}:`, err);
    }
  }
  return null;
}

export async function findAlternativeAudioWithFallback(title: string, targetLang: string): Promise<string | null> {
  // 1. Try local language
  const localAudio = await findAlternativeAudio(title, targetLang);
  if (localAudio) {
    return localAudio;
  }

  // 2. Try English if not already English
  if (targetLang.toLowerCase() !== 'en') {
    console.log(`[ALTERNATIVE AUDIO FALLBACK] Falling back to English for audio title: "${title}"`);
    return await findAlternativeAudio(title, 'en');
  }

  return null;
}


