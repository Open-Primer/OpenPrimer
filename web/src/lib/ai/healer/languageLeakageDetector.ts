import { callVertexAI } from '../vertex-client';

export function detectLanguageLeakage(text: string, targetLang: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const clean = text.toLowerCase().trim();
  if (clean.length < 8) return false;

  const normLang = (targetLang || 'fr').toLowerCase().split('-')[0];

  // [FIX A4] For EN-target courses, detect French leakage (most common bleed-through language).
  if (normLang === 'en') {
    const frenchStopwords = /\b(le|la|les|un|une|des|du|en|et|ou|est|sont|dans|pour|par|sur|avec|qui|que|ce|cette|ces|aussi|donc|mais|car)\b/i;
    return clean.length > 15 && frenchStopwords.test(clean);
  }

  const englishIndicators = [
    /\bthe\s+(?:study|theory|concept|process|method|system|model|structure|function|example|role|importance|nature|effect|development|history|origin|application|analysis|definition|classification|principles|elements|components|features|characteristics)\b/i,
    /\bis\s+a\b/i,
    /\is\s+the\b/i,
    /\brefers\s+to\b/i,
    /\bdefined\s+as\b/i,
    /\bcan\s+be\b/i,
    /\bwhich\s+is\b/i,
    /\bthere\s+are\b/i,
    /\bwith\s+the\b/i,
    /\bof\s+the\b/i,
    /\band\s+the\b/i,
    /\bfor\s+example\b/i,
    /\bthis\s+means\b/i
  ];

  let matches = 0;
  for (const regex of englishIndicators) {
    if (regex.test(clean)) {
      matches++;
    }
  }

  if (matches >= 1) return true;

  if (normLang === 'fr') {
    const frenchIndicators = [
      /\b(le|la|les|un|une|des|du|de|en|et|ou|est|sont|dans|pour|par|sur|avec|qui|que|ce|cette|ces|se|dans|pour)\b/i
    ];
    if (clean.length > 20 && !frenchIndicators[0].test(clean)) {
      return true;
    }
  }

  // [FIX A5] DE/ES/ZH — detect English leakage via double-fire (EN indicators + non-EN target).
  if (normLang === 'de' || normLang === 'es' || normLang === 'zh') {
    if (matches >= 1) return true; // English indicators fired in a non-English target
    // ZH: flag if long text has no CJK characters at all
    if (normLang === 'zh' && clean.length > 20) {
      const hasCjk = /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(text);
      if (!hasCjk) return true;
    }
  }

  return false;
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  const prompt = `You are a precise translator. Translate the following text into ${targetLang.toUpperCase()}. Keep all technical/academic/literary terms accurate. Do NOT add any explanations, introductory text, or markdown formatting. Return ONLY the translated text.

TEXT TO TRANSLATE:
${text}`;
  try {
    const res = await callVertexAI({
      task: 'course_generation',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 }
    });
    if (res && res.ok) {
      const resJson = await res.json();
      const resultText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanRes = resultText.replace(/```[a-z]*/g, '').replace(/```/g, '').trim();
      // [FIX A6] Sanity check: reject translation if output is suspiciously short (e.g. model hallucinated empty/punctuation).
      if (cleanRes.length < text.length * 0.2) {
        console.warn(`[TRANSLATE] Output suspiciously short (${cleanRes.length} vs source ${text.length}), returning original.`);
        return text;
      }
      return cleanRes;
    }
    return text;
  } catch (err) {
    console.error(`[TRANSLATE] Failed to translate:`, err);
    console.warn('[TRANSLATE] Returning original text (possibly untranslated) — check quota/network.');
    return text;
  }
}

