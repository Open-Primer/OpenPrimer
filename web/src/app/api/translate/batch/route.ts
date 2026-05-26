import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { fields, targetLangs } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!fields || !targetLangs || !Array.isArray(targetLangs)) {
      return NextResponse.json({ success: false, error: 'Fields and targetLangs array are required.' }, { status: 400 });
    }

    if (targetLangs.length === 0) {
      return NextResponse.json({ success: true, translations: {} });
    }

    if (apiKey) {
      console.log(`[BATCH-TRANSLATE] Translating fields to [${targetLangs.join(', ')}] using Gemini...`);
      
      const geminiPrompt = `You are an elite academic translator and expert localizer.
Translate the following key-value text fields into these target languages: ${targetLangs.map(l => l.toUpperCase()).join(', ')}.

FIELDS TO TRANSLATE:
${JSON.stringify(fields, null, 2)}

CRITICAL RULES:
1. Return strictly valid JSON. Do NOT wrap the output in markdown code blocks (\`\`\`json) or include any conversational preamble. Return ONLY the JSON object.
2. The output must be a single JSON object where each key is the uppercase language code (e.g., "FR", "ES", "DE", "ZH", "IT") and the value is a translated copy of the input fields object.
3. Preserve all technical terminology, mathematical terms, physical constants, and tone of the original fields.

Format the response exactly like this:
{
  "FR": ${JSON.stringify(fields, null, 2)}
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }],
          generationConfig: { 
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          try {
            const parsed = JSON.parse(jsonText.trim());
            console.log(`[BATCH-TRANSLATE SUCCESS] Batch translation successfully compiled.`);
            return NextResponse.json({ success: true, translations: parsed });
          } catch (jsonErr) {
            console.error("[BATCH-TRANSLATE] Failed to parse JSON response from Gemini.", jsonText, jsonErr);
          }
        }
      } else {
        const errText = await res.text();
        console.warn(`[BATCH-TRANSLATE] Gemini API returned error: ${errText}`);
      }
    }

    // Graceful offline mock fallback
    console.warn('[BATCH-TRANSLATE WARNING] GEMINI_API_KEY is not configured or API call failed. Falling back to structured prefix translations.');
    const mockTranslations: Record<string, any> = {};
    targetLangs.forEach(lang => {
      const codeUpper = lang.toUpperCase();
      const translatedFields: Record<string, string> = {};
      Object.keys(fields).forEach(key => {
        translatedFields[key] = `[${codeUpper}] ${fields[key]}`;
      });
      mockTranslations[codeUpper] = translatedFields;
    });

    return NextResponse.json({ success: true, translations: mockTranslations });
  } catch (err: any) {
    console.error(`[BATCH-TRANSLATE ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
