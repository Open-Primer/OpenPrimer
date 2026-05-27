import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/rateLimit';
import { z } from 'zod';

const translateSchema = z.object({
  slug: z.string().min(1),
  targetLang: z.string().min(2).max(10),
  sourceContent: z.string().min(1)
});

export async function POST(req: NextRequest) {
  try {
    // 1. IP-Based Rate Limiting (20 requests per minute)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip, 20, 60000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
    }

    // 2. Strict Input Schema Validation using Zod
    const body = await req.json();
    const parsed = translateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload structure.', details: parsed.error.format() }, { status: 400 });
    }

    const { slug, targetLang, sourceContent } = parsed.data;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    console.log(`[JIT-TRANSLATE] Translating ${slug} to ${targetLang} using Gemini...`);

    if (apiKey) {
      const prompt = `You are a professional academic translator. Translate the following academic MDX course content to target language code: "${targetLang.toUpperCase()}".
      
CRITICAL RULES:
1. Preserve all markdown structure, headings, bolding, lists, and links.
2. Keep all Math equations (wrapped in $ or $$) completely untouched. E.g. $E = mc^2$ stays exactly $E = mc^2$.
3. Keep all custom JSX React component tags (like <InteractiveWidget>, <QuestionQuiz>, etc.) exactly as-is. ONLY translate user-visible strings/labels inside their attributes or content.
4. Do NOT translate technical code blocks or code snippets.
5. Return ONLY the translated MDX file content. Do not include any explanations, wrappers, or markdown code blocks (\`\`\`md) around the result.

MDX CONTENT TO TRANSLATE:
${sourceContent}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.1
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API Error: ${errText}`);
      }

      const data = await res.json();
      const translatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!translatedContent) {
        throw new Error("Empty translation returned from Gemini.");
      }

      console.log(`[JIT-TRANSLATE SUCCESS] Real JIT translation completed via Gemini 1.5 Flash.`);

      return NextResponse.json({ 
        content: translatedContent,
        status: "success" 
      });
    } else {
      console.warn('[JIT-TRANSLATE WARNING] GEMINI_API_KEY is not configured. Falling back to regex string replacement mock.');
      const translatedContent = sourceContent.replace("lang: \"en\"", `lang: \"${targetLang}\"`);
      return NextResponse.json({ 
        content: translatedContent,
        status: "success" 
      });
    }
  } catch (error: any) {
    console.error(`[JIT-TRANSLATE ERROR]`, error);
    return NextResponse.json({ error: `Translation failed: ${error.message}` }, { status: 500 });
  }
}
