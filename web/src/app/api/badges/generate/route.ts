import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/authHelper';

export async function POST(request: Request) {
  try {
    // Server-Side Authentication JWT check
    const user = await verifySession(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing or invalid token.' }, { status: 401 });
    }

    const { name, description, seed } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!name || !description) {
      return NextResponse.json({ success: false, error: 'Name and description are required.' }, { status: 400 });
    }

    let expandedPrompt = `a premium stylized flat vector achievement badge medallion for "${name}" - ${description}, glassmorphism, 3d render, dark neon backdrop, high resolution, clean icons, centered, no text, no words`;

    if (apiKey) {
      try {
        console.log(`[BADGE-GEN] Expanding prompt with Gemini for badge: "${name}"...`);
        const geminiPrompt = `Create a single, highly detailed, professional image generation prompt for a modern, stylized achievement badge medallion.
The achievement name is: "${name}"
The description is: "${description}"

Style guidelines:
- Flat 3D modern vector icon medallion style
- Premium glowing glassmorphism accents, bright neon highlights
- Perfectly centered, dark futuristic academic background
- NO letters, NO words, NO text whatsoever inside the image.

Output ONLY the expanded English image prompt in a single sentence or short paragraph. Do not include any explanations or surrounding text.`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: geminiPrompt }] }],
            generationConfig: { temperature: 0.7 }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const expandedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (expandedText && expandedText.trim()) {
            expandedPrompt = expandedText.trim();
            console.log(`[BADGE-GEN SUCCESS] Expanded prompt: "${expandedPrompt}"`);
          }
        }
      } catch (geminiErr) {
        console.warn(`[BADGE-GEN WARNING] Prompt expansion failed, using fallback template.`, geminiErr);
      }
    }

    // Call Pollinations.ai image generator
    console.log(`[BADGE-GEN] Fetching image from Pollinations.ai...`);
    const imageSeed = seed !== undefined ? seed : Math.floor(Math.random() * 100000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(expandedPrompt)}?width=256&height=256&nologo=true&seed=${imageSeed}`;

    const res = await fetch(pollinationsUrl);
    if (!res.ok) {
      throw new Error(`Failed to generate image from Pollinations.ai: ${res.statusText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;

    console.log(`[BADGE-GEN SUCCESS] Badge image successfully generated via Pollinations.ai.`);
    return NextResponse.json({ success: true, dataUri });
  } catch (err: any) {
    console.error(`[BADGE-GEN ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
