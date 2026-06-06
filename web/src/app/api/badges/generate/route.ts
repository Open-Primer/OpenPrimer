import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/authHelper';
import { callVertexAI, isVertexConfigured } from '@/lib/vertex-client';

export async function POST(request: Request) {
  try {
    const user = await verifySession(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing or invalid token.' }, { status: 401 });
    }

    const { name, description, seed } = await request.json();
    if (!name || !description) {
      return NextResponse.json({ success: false, error: 'Name and description are required.' }, { status: 400 });
    }

    let expandedPrompt = `a premium stylized flat vector achievement badge medallion for "${name}" - ${description}, glassmorphism, 3d render, dark neon backdrop, high resolution, clean icons, centered, no text, no words`;

    if (isVertexConfigured()) {
      try {
        console.log(`[BADGE-GEN] Expanding prompt with Vertex AI (gemini-2.0-flash-lite) for badge: "${name}"...`);
        const geminiPrompt = `Create a single, highly detailed, professional image generation prompt for a modern, stylized achievement badge medallion.
The achievement name is: "${name}"
The description is: "${description}"

Style guidelines:
- Flat 3D modern vector icon medallion style
- Premium glowing glassmorphism accents, bright neon highlights
- Perfectly centered, dark futuristic academic background
- NO letters, NO words, NO text whatsoever inside the image.

Output ONLY the expanded English image prompt in a single sentence or short paragraph. Do not include any explanations or surrounding text.`;

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
          }
        }
      } catch (vertexErr) {
        console.warn(`[BADGE-GEN WARNING] Prompt expansion failed, using fallback template.`, vertexErr);
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
