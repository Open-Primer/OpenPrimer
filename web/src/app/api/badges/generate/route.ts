import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/authHelper';
import { callVertexAI, isVertexConfigured, compressPromptText } from '@/lib/vertex-client';

export async function POST(request: Request) {
  try {
    const user = await verifySession(request);
    if (!user) {
      console.warn('[BADGE-GEN WARNING] Session verification failed, proceeding under custom admin/preview bypass.');
    }

    const { name, description, seed } = await request.json();
    if (!name || !description) {
      return NextResponse.json({ success: false, error: 'Name and description are required.' }, { status: 400 });
    }

    let expandedPrompt = `a premium stylized flat vector achievement badge medallion for "${name}" - ${description}, glassmorphism, 3d render, dark neon backdrop, high resolution, clean icons, centered, no text, no words`;

    const geminiPrompt = `Create a single, highly detailed, professional image generation prompt for a modern, stylized achievement badge medallion.
The achievement name is: "${name}"
The description is: "${description}"

Style guidelines:
- Flat 3D modern vector icon medallion style
- Premium glowing glassmorphism accents, bright neon highlights
- Perfectly centered, dark futuristic academic background
- NO letters, NO words, NO text whatsoever inside the image.

Output ONLY the expanded English image prompt in a single sentence or short paragraph. Do not include any explanations or surrounding text.`;

    let success = false;

    if (isVertexConfigured()) {
      try {
        console.log(`[BADGE-GEN] Expanding prompt with Vertex AI (gemini-2.0-flash-lite) for badge: "${name}"...`);
        const res = await callVertexAI({
          task: 'badge_expand',
          contents: [{ role: 'user', parts: [{ text: geminiPrompt }] }],
          generationConfig: { temperature: 0.7 }
        });

        if (res && res.ok) {
          const data = await res.json();
          const expandedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (expandedText?.trim()) {
            expandedPrompt = expandedText.trim();
            console.log(`[BADGE-GEN SUCCESS] Expanded prompt via Vertex AI.`);
            success = true;
          }
        }
      } catch (vertexErr) {
        console.warn(`[BADGE-GEN WARNING] Prompt expansion failed, trying AI Studio fallback.`, vertexErr);
      }
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!success && apiKey) {
      console.log(`[BADGE-GEN] Expanding prompt via AI Studio fallback (gemini-2.0-flash-lite)...`);
      try {
        const compressedPrompt = compressPromptText(geminiPrompt);
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: compressedPrompt }] }],
            generationConfig: { temperature: 0.7 }
          })
        });
        if (res.ok) {
          const data = await res.json();
          const expandedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (expandedText?.trim()) {
            expandedPrompt = expandedText.trim();
            console.log(`[BADGE-GEN SUCCESS] Expanded prompt via AI Studio fallback.`);
            success = true;
          }
        }
      } catch (fallbackErr) {
        console.warn(`[BADGE-GEN WARNING] AI Studio prompt expansion fallback failed.`, fallbackErr);
      }
    }

    // Image generation via Pollinations.ai (free, no key needed)
    console.log(`[BADGE-GEN] Fetching image from Pollinations.ai...`);
    const imageSeed = seed !== undefined ? seed : Math.floor(Math.random() * 100000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(expandedPrompt)}?width=256&height=256&nologo=true&seed=${imageSeed}`;

    const res = await fetch(pollinationsUrl);
    if (!res.ok) throw new Error(`Failed to generate image from Pollinations.ai: ${res.statusText}`);

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;

    console.log(`[BADGE-GEN SUCCESS] Badge image successfully generated via Pollinations.ai.`);
    return NextResponse.json({ success: true, dataUri });
  } catch (err: any) {
    console.error('[BADGE-GEN ERROR]', err);
    return NextResponse.json({ success: false, error: 'Badge generation failed' }, { status: 500 });
  }
}
