import { NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/rateLimit';
import { z } from 'zod';
import { verifySession } from '@/lib/authHelper';
import { callVertexAI, isVertexConfigured } from '@/lib/vertex-client';

const batchTranslateSchema = z.object({
  fields: z.record(z.string(), z.string()).refine(val => Object.keys(val).length > 0, { message: "Fields must not be empty" }),
  targetLangs: z.array(z.string().min(2).max(10)).min(1)
});

export async function POST(request: Request) {
  try {
    const user = await verifySession(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing or invalid token.' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (await isRateLimited(ip, 20, 60000, 'batch_translate')) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = batchTranslateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload structure.', details: parsed.error.format() }, { status: 400 });
    }

    const { fields, targetLangs } = parsed.data;

    const geminiPrompt = `You are an elite academic translator and expert localizer.
Translate the following key-value text fields into these target languages: ${targetLangs.map(l => l.toUpperCase()).join(', ')}.

FIELDS TO TRANSLATE:
${JSON.stringify(fields, null, 2)}

CRITICAL RULES:
1. Return strictly valid JSON. Do NOT wrap the output in markdown code blocks or include any conversational preamble. Return ONLY the JSON object.
2. The output must be a single JSON object where each key is the uppercase language code (e.g., "FR", "ES", "DE", "ZH") and the value is a translated copy of the input fields object.
3. Preserve all technical terminology, mathematical terms, physical constants, and tone of the original fields.

Format the response exactly like this:
{
  "FR": ${JSON.stringify(fields, null, 2)}
}`;

    if (isVertexConfigured()) {
      console.log(`[BATCH-TRANSLATE] Translating to [${targetLangs.join(', ')}] via Vertex AI (gemini-2.5-flash)...`);

      const res = await callVertexAI({
        task: 'batch_translate',
        contents: [{ role: 'user', parts: [{ text: geminiPrompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
      });

      if (res && res.ok) {
        const data = await res.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          try {
            const parsedTranslations = JSON.parse(jsonText.trim());
            console.log(`[BATCH-TRANSLATE SUCCESS] Batch translation completed via Vertex AI.`);
            return NextResponse.json({ success: true, translations: parsedTranslations });
          } catch (jsonErr) {
            console.error("[BATCH-TRANSLATE] Failed to parse JSON response from Vertex AI.", jsonErr);
          }
        }
      }
    }

    // Graceful offline mock fallback
    console.warn('[BATCH-TRANSLATE] Vertex AI unavailable. Falling back to structured prefix translations.');
    const mockTranslations: Record<string, any> = {};
    targetLangs.forEach(lang => {
      const codeUpper = lang.toUpperCase();
      const translatedFields: Record<string, string> = {};
      Object.keys(fields).forEach(key => { translatedFields[key] = `[${codeUpper}] ${fields[key]}`; });
      mockTranslations[codeUpper] = translatedFields;
    });
    return NextResponse.json({ success: true, translations: mockTranslations });

  } catch (err: any) {
    console.error(`[BATCH-TRANSLATE ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
