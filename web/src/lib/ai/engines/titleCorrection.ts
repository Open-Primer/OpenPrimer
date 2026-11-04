import { isVertexConfigured, compressPromptText } from '@/lib/vertex-client';
import { safeResponseJson } from '@/lib/ai/engines/coreUtils';
import { callVertexAI } from '@/lib/vertex-client';

export async function correctCourseTitle(title: string, targetLang: string = 'en', translateToTargetLang = true): Promise<string> {
  const cleanTitle = title.trim();
  if (!cleanTitle || cleanTitle.length < 3) return title;

  const langLabel = targetLang.toUpperCase();
  // When translateToTargetLang is true (default for English targets), translate AND correct.
  // When false (used during non-English course generation), only correct in original language.
  const systemInstruction = translateToTargetLang
    ? `You are an elite academic copyeditor and translator. Produce a final, publication-ready course title in the target language: ${langLabel}.
Rules:
- Translate the title into the target language (${langLabel}) if it is in a different language.
- Apply standard, appropriate capitalization (Title Case or localized standard) and spacing for academic course titles in the target language (${langLabel}).
- Correct all spelling, grammar, and typing mistakes.
- Keep academic level prefixes if present (e.g. L1, L2, M1, M2).
- Respond with ONLY the corrected/translated title. No quotes, no markdown, no explanations.`
    : `You are an elite academic copyeditor. Correct the spelling, grammar, accentuation, and capitalization of the course title in the language '${langLabel}'.
Rules:
- Standardize the capitalization (use Title Case appropriate for academic subjects in the target language).
- Correct any obvious spelling errors, typos, and punctuation issues.
- Do NOT translate the title to another language. Correct it in its original language.
- Respond with ONLY the corrected title text. No quotes, markdown formatting, explanations, or introductory text.`;

  const userPrompt = `Course Title: "${cleanTitle}"`;

  try {
    if (isVertexConfigured()) {
      const res = await callVertexAI({
        task: 'course_generation',
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction,
        generationConfig: { temperature: 0.1 }
      });
      if (res && res.ok) {
        const json = await safeResponseJson(res, 'correctCourseTitle (Vertex AI)');
        const corrected = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (corrected) {
          const sanitized = corrected.replace(/^["'«“‘]|["'»”’]$/g, '').replace(/```/g, '').trim();
          if (sanitized && sanitized.length >= 3 && sanitized.length <= cleanTitle.length * 3 + 20 && !/sorry|error|apologize|cannot|unable/i.test(sanitized)) {
            return sanitized;
          }
        }
      }
    }
    
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (apiKey) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: compressPromptText(userPrompt) }] }],
          systemInstruction: { parts: [{ text: compressPromptText(systemInstruction) }] },
          generationConfig: { temperature: 0.1 }
        })
      });
      if (res.ok) {
        const json = await safeResponseJson(res, 'correctCourseTitle (API Fallback)');
        const corrected = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (corrected) {
          const sanitized = corrected.replace(/^["'«“‘]|["'»”’]$/g, '').replace(/```/g, '').trim();
          if (sanitized && sanitized.length >= 3 && sanitized.length <= cleanTitle.length * 3 + 20 && !/sorry|error|apologize|cannot|unable/i.test(sanitized)) {
            return sanitized;
          }
        }
      }
    }
  } catch (err) {
    console.warn(`[correctCourseTitle] Failed to correct title using AI:`, err);
  }

  // Basic fallback: Capitalize each word (Title Case) if AI fails
  return cleanTitle
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
