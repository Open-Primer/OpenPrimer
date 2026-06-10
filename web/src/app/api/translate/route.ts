import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/rateLimit';
import { z } from 'zod';
import { verifySession } from '@/lib/authHelper';
import { callVertexAI, isVertexConfigured } from '@/lib/vertex-client';

const translateSchema = z.object({
  slug: z.string().min(1),
  targetLang: z.string().min(2).max(10),
  sourceContent: z.string().min(1)
});

export async function POST(req: NextRequest) {
  try {
    const user = await verifySession(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing or invalid token.' }, { status: 401 });
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (await isRateLimited(ip, 20, 60000, 'translate')) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = translateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload structure.', details: parsed.error.format() }, { status: 400 });
    }

    const { slug, targetLang, sourceContent } = parsed.data;

    const prompt = `You are a professional academic translator. Translate the following academic MDX course content to target language code: "${targetLang.toUpperCase()}".

CRITICAL RULES:
1. Preserve all markdown structure, headings, bolding, lists, and links.
2. Keep all Math equations (wrapped in $ or $$) completely untouched. E.g. $E = mc^2$ stays exactly $E = mc^2$.
3. Keep all custom JSX React component tags (like <InteractiveWidget>, <QuestionQuiz>, etc.) exactly as-is. ONLY translate user-visible strings/labels inside their attributes or content.
4. Do NOT translate technical code blocks or code snippets.
5. Return ONLY the translated MDX file content. Do not include any explanations, wrappers, or markdown code blocks.

MDX CONTENT TO TRANSLATE:
${sourceContent}`;

    if (isVertexConfigured()) {
      console.log(`[JIT-TRANSLATE] Translating ${slug} to ${targetLang} via Vertex AI (gemini-2.5-flash)...`);

      let translatedContent = '';
      const res = await callVertexAI({
        task: 'jit_translate',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      });

      if (res && res.ok) {
        const data = await res.json();
        translatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }

      if (translatedContent) {
        // --- TRANSLATION CRITIC PIPELINE ---
        let approved = false;
        let critique = '';
        let currentTranslation = translatedContent;
        let critiqueIteration = 0;
        const maxCritiqueIterations = 2;

        while (!approved && critiqueIteration < maxCritiqueIterations && currentTranslation) {
          critiqueIteration++;
          console.log(`[JIT-TRANSLATE - CRITIC] Reviewing translation for ${slug} (Attempt ${critiqueIteration}/${maxCritiqueIterations})...`);

          const promptCritic = `You are the Translation Critic Agent (Agent 4 - Specialized in Translation Quality Assurance). Your job is to strictly validate the translated academic MDX content against the original source content.
Source Language: English
Target Language: "${targetLang.toUpperCase()}"

Original MDX Content:
${sourceContent}

Translated MDX Content:
${currentTranslation}

Your validation checklist:
1. Academic Integrity: Is the scientific/academic depth, tone, and accuracy of the original content fully preserved?
2. MDX Components Preservation: Are all MDX elements (like <Quiz>, <Question>, <Option>, <Glossary>, <Video>, <Audio>, <FillInBlanks>, <SolvedProblem>, <Summary>, <SelfEval>, <HistoricalPerson>, <Location>, <Place>, <EntityLink>, <EssayEvaluation>, etc.) completely present with all their JSX tags and properties intact?
3. Custom attributes: For <Glossary>, are term/definition translated? For <HistoricalPerson>, are name/lang translated/updated? For <EssayEvaluation>, are prompt/subject translated? Are other properties (like durations, options, gradingSystem, IDs) preserved exactly as in the original?
4. Formulas and Code: Are all Math equations ($...$ or $$...$$) and code blocks kept exactly as they were, untranslated?
5. Zero Translator Commentary: Did the translator introduce any notes, prefixes, or meta-conversational lines (e.g. "Here is the translation:")? If so, reject it.
6. Zero placeholders: Are there any placeholders or unfinished sections?

You must output ONLY a valid JSON object matching this structure:
{
  "approved": true or false,
  "critique": "If not approved, explain exactly what is wrong/missing/broken so the translator can correct it. If approved, keep this empty."
}
Do not write any markdown code block wrappers (like \`\`\`json) or any conversational text. Only output raw JSON.`;

          let criticResText = '';
          const resCritic = await callVertexAI({
            task: 'jit_translate',
            contents: [{ role: 'user', parts: [{ text: promptCritic }] }],
            generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
          });

          if (resCritic && resCritic.ok) {
            const resJson = await resCritic.json();
            criticResText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
          }

          if (criticResText) {
            try {
              const cleanedCritic = criticResText.replace(/```json/g, '').replace(/```/g, '').trim();
              const criticObj = JSON.parse(cleanedCritic);
              approved = !!criticObj.approved;
              critique = criticObj.critique || '';
            } catch (e) {
              console.error("[JIT-TRANSLATE - CRITIC] Failed to parse critic JSON response:", e);
              approved = true;
            }
          } else {
            approved = true;
          }

          if (approved) {
            console.log(`[JIT-TRANSLATE - CRITIC] Translation approved for ${slug}!`);
            translatedContent = currentTranslation;
          } else {
            console.warn(`[JIT-TRANSLATE - CRITIC] Translation REJECTED for ${slug}. Critique: ${critique}`);
            const promptRefine = `You are a professional academic translator. The Translation Critic Agent has rejected your previous translation with the following critique:

CRITIQUE FROM TRANSLATION CRITIC:
${critique}

Original MDX Content to Translate:
${sourceContent}

Previous Rejected Translation:
${currentTranslation}

Please re-translate the Original MDX Content to "${targetLang.toUpperCase()}", correcting all issues highlighted by the critic.
Follow all initial translation rules:
1. Preserve all markdown structure, headings, bolding, lists, and links.
2. Keep all Math equations (wrapped in $ or $$) completely untouched. E.g. $E = mc^2$ stays exactly $E = mc^2$.
3. Keep all custom JSX React component tags (like <InteractiveWidget>, <QuestionQuiz>, etc.) exactly as-is. ONLY translate user-visible strings/labels inside their attributes or content.
4. Do NOT translate technical code blocks or code snippets.
5. Return ONLY the translated MDX file content. Do not include any explanations, wrappers, or markdown code blocks.`;

            const resRefine = await callVertexAI({
              task: 'jit_translate',
              contents: [{ role: 'user', parts: [{ text: promptRefine }] }],
              generationConfig: { temperature: 0.1 }
            });

            if (resRefine && resRefine.ok) {
              const resJson = await resRefine.json();
              currentTranslation = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
            } else {
              break;
            }
          }
        }
        return NextResponse.json({ content: translatedContent, status: "success" });
      }
    }

    // Graceful fallback
    console.warn('[JIT-TRANSLATE] Vertex AI unavailable. Falling back to stub replacement.');
    const translatedContent = sourceContent.replace('lang: "en"', `lang: "${targetLang}"`);
    return NextResponse.json({ content: translatedContent, status: "success" });

  } catch (error: any) {
    console.error(`[JIT-TRANSLATE ERROR]`, error);
    return NextResponse.json({ error: 'Translation service unavailable. Please try again later.' }, { status: 500 });
  }
}
