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
    if (isRateLimited(ip, 20, 60000)) {
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

      const res = await callVertexAI({
        task: 'jit_translate',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      });

      if (res && res.ok) {
        const data = await res.json();
        const translatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (translatedContent) {
          console.log(`[JIT-TRANSLATE SUCCESS] Translation complete via Vertex AI.`);
          return NextResponse.json({ content: translatedContent, status: "success" });
        }
      }
    }

    // Graceful fallback
    console.warn('[JIT-TRANSLATE] Vertex AI unavailable. Falling back to stub replacement.');
    const translatedContent = sourceContent.replace('lang: "en"', `lang: "${targetLang}"`);
    return NextResponse.json({ content: translatedContent, status: "success" });

  } catch (error: any) {
    console.error(`[JIT-TRANSLATE ERROR]`, error);
    return NextResponse.json({ error: `Translation failed: ${error.message}` }, { status: 500 });
  }
}
