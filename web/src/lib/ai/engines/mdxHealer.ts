import { callVertexAI } from '../vertex-client';
import { searchYouTubeVideo } from '../../media-resolver';

const QUERY_SUFFIX_MAP: Record<string, string> = {
  FR: 'explication cours',
  EN: 'educational explanation',
  ES: 'explicación del curso',
  DE: 'Kurs Erklärung',
  ZH: '课程讲解',
  PT: 'explicação do curso',
  AR: 'شرح الدرس',
  HI: 'पाठ व्याख्या',
  UR: 'سبق کی وضاحت'
};

async function findAlternativeVideo(title: string, lang: string): Promise<{ id?: string; url?: string; provider?: string } | null> {
  console.log(`[ALTERNATIVE SEARCH] Searching alternative video for title: "${title}" (${lang})...`);
  const suffix = QUERY_SUFFIX_MAP[lang.toUpperCase()] || QUERY_SUFFIX_MAP.EN;
  const query = `${title} ${suffix}`;
  const videoId = await searchYouTubeVideo(query);
  if (videoId) {
    return { id: videoId, provider: 'youtube' };
  }
  return null;
}

async function findAlternativeVideoWithFallback(title: string, targetLang: string): Promise<{ id?: string; url?: string; provider?: string } | null> {
  const localVideo = await findAlternativeVideo(title, targetLang);
  if (localVideo) {
    return localVideo;
  }
  if (targetLang.toUpperCase() !== 'EN') {
    console.log(`[ALTERNATIVE VIDEO FALLBACK] Falling back to English for video title: "${title}"`);
    return await findAlternativeVideo(title, 'en');
  }
  return null;
}

export async function healMdxWithAI(content: string, mdxError: string, targetLang: string = 'fr', stats?: any): Promise<string> {
  // [FIX H1] Truncate large MDX content to ~120 lines around the error to reduce context size.
  const mdxLines = content.split('\n');
  const healerContent = mdxLines.length > 120 ? mdxLines.slice(0, 120).join('\n') + '\n... [content truncated for context efficiency]' : content;
  const promptHealer = `You are a Self-Healing MDX Compiler Agent (Agent B).
Your task is to fix syntax errors or invalid tags in MDX content so it compiles successfully.
Below is the compilation error message and the faulty MDX content.

COMPILATION ERROR:
${mdxError}

FAULTY MDX CONTENT:
---
${healerContent}
---

INSTRUCTIONS:
1. Fix the tags that are unclosed, incorrectly nested, or contain invalid syntax.
2. For unclosed JSX/HTML tags, either close them properly or wrap the content correctly. For example, if it says "Expected a closing tag for <a>", make sure all <a> tags are closed with </a>.
3. Make sure custom components like <Quiz>, <Question>, <Glossary>, <HistoricalPerson>, <Epistemology>, <SpeciesLink>, <ChemicalLink>, <CelestialLink>, etc. are well-formed and closed.
4. Do NOT change the learning objectives, pedagogical content, or text substance. Just repair the MDX structure so that Acorn or the MDX parser doesn't crash.
5. Return ONLY the repaired MDX content. Do NOT wrap the response in markdown code blocks (\`\`\`).
6. Do NOT add any conversational explanation before or after the code. Just output the clean, fixed MDX.`;

  let repairedMdx = '';
  let success = false;

  if (isVertexConfigured()) {
    console.log(`[SELF-HEALING] Healing MDX content via Vertex AI (gemini-3.5-flash-lite)...`);
    try {
      const res = await callVertexAI({
        task: 'course_generation',
        contents: [{ role: 'user', parts: [{ text: promptHealer }] }],
        generationConfig: { temperature: 0.1 }
      });
      if (res && res.ok) {
        const jsonRes = await res.json();
        repairedMdx = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (repairedMdx) {
          success = true;
          if (stats) {
            const usage = jsonRes.usageMetadata || {};
            stats.tokenMetrics.promptTokens += usage.promptTokenCount || 0;
            stats.tokenMetrics.candidatesTokens += usage.candidatesTokenCount || usage.candidateTokenCount || 0;
          }
        }
      }
    } catch (err) {
      console.warn(`[SELF-HEALING] Vertex AI healer exception:`, err);
    }
  }

  if (!success && apiKey) {
    console.log(`[SELF-HEALING] Healing MDX content via AI Studio fallback (gemini-3.5-flash-lite)...`);
    try {
      const startTime = Date.now();
      const compressedHealer = compressPromptText(promptHealer);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: compressedHealer }] }]
        })
      });
      if (res.ok) {
        const jsonRes = await res.json();
        repairedMdx = jsonRes?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (repairedMdx) {
          success = true;
          const durationMs = Date.now() - startTime;
          const usage = jsonRes.usageMetadata || {};
          const promptTokens = usage.promptTokenCount || 0;
          const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
          if (stats) {
            stats.tokenMetrics.promptTokens += promptTokens;
            stats.tokenMetrics.candidatesTokens += candidatesTokens;
          }
          await recordMetrics('course_generation', 'gemini-3.5-flash-lite', durationMs, promptTokens, candidatesTokens, compressedHealer);
        } else {
          console.warn("[SELF-HEALING] AI Studio healer returned empty content");
        }
      } else {
        const errText = await res.text();
        console.warn(`[SELF-HEALING] AI Studio healer failed (${res.status}): ${errText}`);
      }
    } catch (err) {
      console.error(`[SELF-HEALING] AI Studio healer exception:`, err);
    }
  }

  if (!repairedMdx) {
    console.warn("[SELF-HEALING] Healer failed to produce content, returning original.");
    return content;
  }

  // [FIX H3] Run preprocessMdx on healed output to catch any new formatting issues
  // introduced by the LLM during healing (e.g. bare <br> tags, mismatched quotes).
  try { repairedMdx = preprocessMdx(repairedMdx, targetLang); } catch (_) {}
  return repairedMdx;
}

// searchYouTubeVideo is imported from './media-resolver' to ensure single source of truth resolution.


export { findAlternativeVideo, findAlternativeVideoWithFallback };
