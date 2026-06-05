import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/authHelper';
import { isRateLimited } from '@/lib/rateLimit';
import { z } from 'zod';
import { callVertexAI, isVertexConfigured } from '@/lib/vertex-client';
import { TASK_MODELS, MODEL_PRICING, TASK_TOKEN_ESTIMATES, estimateCost } from '@/lib/ai-config';

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1)
    })
  ).min(1),
  persona: z.string().min(1),
  pageContext: z.string().optional(),
  language: z.string().min(2).max(10)
});

export async function POST(request: Request) {
  try {
    const user = await verifySession(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing or invalid token.' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (await isRateLimited(ip, 20, 60000, 'tutor_chat')) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload structure.', details: parsed.error.format() }, { status: 400 });
    }

    const { messages, persona, pageContext, language } = parsed.data;
    const langUpper = (language || 'EN').toUpperCase();

    // Fetch persona system prompt from DB
    let systemPrompt = "You are a helpful academic tutor.";
    try {
      const { dbService } = await import('@/lib/db');
      const { data: personalities } = await dbService.getTutorPersonalities();
      const matching = personalities?.find((p: any) => p.name === persona || p.id === persona);
      if (matching) {
        systemPrompt = matching.translations?.[langUpper]?.prompt || matching.prompt || systemPrompt;
      }
    } catch (e) {
      console.warn('[TUTOR CHAT] Failed to query tutor personality from database, using defaults.', e);
    }

    // Resolve language name from Supabase
    let langName = 'English';
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: langData } = await supabase.from('languages').select('label').eq('code', langUpper).single();
      if (langData?.label) {
        langName = langData.label;
      } else {
        const fallbacks: Record<string, string> = { FR: 'Français', EN: 'English', ES: 'Español', DE: 'Deutsch', ZH: '中文' };
        langName = fallbacks[langUpper] || langUpper;
      }
    } catch (e) {
      console.warn('[TUTOR CHAT] Error retrieving language name:', e);
    }

    // Fetch user first name for personalization
    let firstName = '';
    try {
      const { supabase: clientSupabase } = await import('@/lib/supabase');
      if (user.id !== 'mock-offline-user-id') {
        const { data: profile } = await clientSupabase.from('profiles').select('name').eq('id', user.id).single();
        if (profile?.name) firstName = profile.name.trim().split(/\s+/)[0] || '';
      } else {
        firstName = 'Dev';
      }
    } catch (e) {}

    const contextInstruction = pageContext
      ? `Context of the studied page:\n---\n${pageContext}\n---\n`
      : "";

    const directive = `Always respond strictly in ${langName} (${langUpper}). Be concise and rigorous. No meta-comments or preamble.`;
    const personalizationDirective = firstName && firstName !== 'Dev'
      ? `The student's name is ${firstName}. Address them naturally and warmly using their first name occasionally.`
      : `The student's name is not provided. Use a professional, neutral tone.`;

    const systemInstruction = `${systemPrompt}\n\n${contextInstruction}${directive}\n\n${personalizationDirective}`;

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // === PRIMARY: Vertex AI ===
    if (isVertexConfigured()) {
      console.log(`[TUTOR CHAT] Dispatching to Vertex AI (${TASK_MODELS['tutor_chat']}) for persona "${persona}"...`);
      
      const res = await callVertexAI({
        task: 'tutor_chat',
        contents,
        systemInstruction,
        generationConfig: { temperature: 0.7 },
        stream: true
      });

      if (res && res.ok) {
        const stream = new ReadableStream({
          async start(controller) {
            const reader = res.body?.getReader();
            const decoder = new TextDecoder('utf-8');
            if (!reader) { controller.close(); return; }
            try {
              let buffer = '';
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                  if (line.startsWith('data:')) {
                    try {
                      const dataStr = line.slice(5).trim();
                      if (!dataStr) continue;
                      const parsed = JSON.parse(dataStr);
                      const chunkText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (chunkText) controller.enqueue(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
                    } catch {}
                  }
                }
              }
            } catch (err: any) { controller.error(err); }
            finally { controller.close(); }
          }
        });
        return new Response(stream, {
          headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
        });
      }
    }

    // === FALLBACK: Mock streaming response ===
    console.warn('[TUTOR CHAT] Vertex AI unavailable. Streaming simulated mock answer...');
    const mockResponses: Record<string, string> = {
      FR: `[${persona}] Bonjour ! C'est une excellente question. En tant que tuteur OpenPrimer, je vous invite à explorer la rigueur du raisonnement scientifique lié à ce sujet.`,
      EN: `[${persona}] Hello! That is a fascinating question. As your OpenPrimer tutor, I encourage you to deeply analyze the mathematical formulation behind this concept.`,
      ES: `[${persona}] ¡Hola! Es una pregunta excelente. Como tu tutor de OpenPrimer, te sugiero que explores la formulación matemática de este concepto.`,
      DE: `[${persona}] Hallo! Das ist eine hervorragende Frage. Als Ihr OpenPrimer-Tutor empfehle ich Ihnen, die mathematische Herleitung dieses Konzepts im Detail zu betrachten.`,
      ZH: `[${persona}] 你好！这是一个非常棒的问题。作为您的 OpenPrimer 导师，我建议您深入分析此概念背後の数学原理。`
    };
    const responseText = mockResponses[langUpper] || mockResponses.EN;
    const words = responseText.split(' ');
    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          controller.enqueue(`data: ${JSON.stringify({ text: (i === 0 ? '' : ' ') + words[i] })}\n\n`);
          await new Promise(r => setTimeout(r, 60));
        }
        controller.close();
      }
    });
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
    });

  } catch (err: any) {
    console.error(`[TUTOR CHAT ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
