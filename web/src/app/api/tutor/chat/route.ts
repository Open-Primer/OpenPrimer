import { NextResponse } from 'next/server';
import { dbService } from '../../../../lib/db';
import { isRateLimited } from '@/lib/rateLimit';
import { z } from 'zod';
import { verifySession } from '@/lib/authHelper';

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
    // 1. Server-Side Authentication JWT check
    const user = await verifySession(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing or invalid token.' }, { status: 401 });
    }

    // 2. IP-Based Rate Limiting (20 requests per minute)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip, 20, 60000)) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
    }

    // 2. Strict Input Schema Validation using Zod
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload structure.', details: parsed.error.format() }, { status: 400 });
    }

    const { messages, persona, pageContext, language } = parsed.data;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const langUpper = (language || 'EN').toUpperCase();

    // 3. Fetch the active system prompt for this persona from database
    let systemPrompt = "You are a helpful academic tutor.";
    try {
      const { data: personalities } = await dbService.getTutorPersonalities();
      const matching = personalities?.find((p: any) => p.name === persona || p.id === persona);
      if (matching) {
        if (matching.translations?.[langUpper]?.prompt) {
          systemPrompt = matching.translations[langUpper].prompt;
        } else if (matching.prompt) {
          systemPrompt = matching.prompt;
        }
      }
    } catch (e) {
      console.warn('[TUTOR CHAT] Failed to query tutor personality from database, using defaults.', e);
    }

    // 4. Resolve the language name dynamically from the Supabase 'languages' table
    let langName = 'English';
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: langData } = await supabase
        .from('languages')
        .select('label')
        .eq('code', langUpper)
        .single();
      if (langData?.label) {
        langName = langData.label;
      } else {
        // Safe mapping fallbacks
        const fallbacks: Record<string, string> = {
          FR: 'Français', EN: 'English', ES: 'Español', DE: 'Deutsch', ZH: '中文'
        };
        langName = fallbacks[langUpper] || langUpper;
      }
    } catch (e) {
      console.warn('[TUTOR CHAT] Error dynamically retrieving language name from database:', e);
    }

    // 5. Fetch the user's profile to retrieve their first name for personalized tone
    let firstName = '';
    try {
      const { supabase: clientSupabase } = await import('@/lib/supabase');
      if (user.id === 'mock-offline-user-id') {
        firstName = 'Dev';
      } else {
        const { data: profile } = await clientSupabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        if (profile?.name) {
          const parts = profile.name.trim().split(/\s+/);
          firstName = parts[0] || '';
        }
      }
    } catch (e) {
      console.warn('[TUTOR CHAT] Error retrieving user profile for personalization:', e);
    }

    const contextInstruction = pageContext 
      ? (langUpper === 'FR' ? `Contexte de la page étudiée par l'élève :\n---\n${pageContext}\n---\n` : `Context of the studied page by the student:\n---\n${pageContext}\n---\n`)
      : "";

    // Dynamically localized final instruction directive in the dynamic course language retrieved from Supabase
    let directive = `Veuillez toujours répondre de manière concise et rigoureuse dans la langue du cours (${langName}). N'utilisez aucun méta-commentaire ou préambule de politesse. Répondez strictement en ${langName}.`;
    if (langUpper !== 'FR') {
      directive = `Please always respond concisely and rigorously in the course language: ${langName} (Language Code: ${langUpper}). Do not use any meta-comments or polite conversational preamble. Respond strictly in ${langName}.`;
    }

    // Personalization directive based on first name presence
    let personalizationDirective = "";
    if (firstName && firstName !== 'Dev') {
      if (langUpper === 'FR') {
        personalizationDirective = `L'élève s'appelle ${firstName}. Veuillez vous adresser à lui/elle de manière personnalisée en utilisant son prénom (${firstName}) de temps en temps, de façon naturelle et chaleureuse.`;
      } else if (langUpper === 'ES') {
        personalizationDirective = `El estudiante se llama ${firstName}. Dirígete a él/ella de manera personalizada usando su nombre (${firstName}) de vez en cuando, de forma natural y cálida.`;
      } else if (langUpper === 'DE') {
        personalizationDirective = `Der Name des Schülers ist ${firstName}. Sprechen Sie ihn/sie von Zeit zu Zeit persönlich mit dem Vornamen (${firstName}) an, auf eine natürliche und freundliche Weise.`;
      } else if (langUpper === 'ZH') {
        personalizationDirective = `学生的名字是 ${firstName}。请在交流中不时自然地使用其名字 (${firstName}) 称呼，保持亲切和鼓励的态度。`;
      } else {
        personalizationDirective = `The student's name is ${firstName}. Address them personally using their first name (${firstName}) from time to time, in a natural and warm manner.`;
      }
    } else {
      if (langUpper === 'FR') {
        personalizationDirective = `Le prénom de l'élève n'est pas renseigné. Veuillez vous adresser à lui de manière plus neutre, respectueuse et professionnelle, en utilisant impérativement le vouvoiement ("vous") en français.`;
      } else if (langUpper === 'ES') {
        personalizationDirective = `El nombre del estudiante no está disponible. Dirígete a él/ella de manera neutral, respetuosa y profesional (utilizando "usted" en español).`;
      } else if (langUpper === 'DE') {
        personalizationDirective = `Der Name des Schülers ist nicht angegeben. Sprechen Sie ihn/sie in einem professionellen, neutralen und respektvollen Ton an (unter Verwendung von "Sie" im Deutschen).`;
      } else if (langUpper === 'ZH') {
        personalizationDirective = `学生姓名未提供。请使用中立、专业和尊重的语气（在合适时使用“您”）。`;
      } else {
        personalizationDirective = `The student's name is not provided. Address them using a professional, neutral, and respectful tone.`;
      }
    }

    const systemInstruction = `${systemPrompt}\n\n${contextInstruction}${directive}\n\n${personalizationDirective}`;

    // 3. Format history for Gemini API
    // Map roles: 'assistant' -> 'model', 'user' -> 'user'
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    if (apiKey) {
      console.log(`[TUTOR CHAT] Dispatching streaming SSE query to Gemini for persona "${persona}"...`);
      
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.7
          }
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini Stream Error: ${errorText}`);
      }

      // Return a standard SSE Response stream directly
      const stream = new ReadableStream({
        async start(controller) {
          const reader = res.body?.getReader();
          const decoder = new TextDecoder('utf-8');
          if (!reader) {
            controller.close();
            return;
          }

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
                    if (chunkText) {
                      // Send formatted SSE chunk to client
                      controller.enqueue(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
                    }
                  } catch (err) {
                    // skip parsing errors on malformed lines
                  }
                }
              }
            }
          } catch (err: any) {
            controller.error(err);
          } finally {
            controller.close();
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    } else {
      console.warn('[TUTOR CHAT WARNING] GEMINI_API_KEY is not configured. Streaming simulated mock answer...');
      
      // SSE simulator for graceful offline development
      const mockResponses: Record<string, string> = {
        FR: "Bonjour ! C'est une excellente question. En tant que tuteur OpenPrimer, je vous invite à explorer la rigueur du raisonnement scientifique lié à ce sujet.",
        EN: "Hello! That is a fascinating question. As your OpenPrimer tutor, I encourage you to deeply analyze the mathematical formulation behind this concept.",
        ES: "¡Hola! Es una pregunta excelente. Como tu tutor de OpenPrimer, te sugiero que explores la formulación matemática de este concepto.",
        DE: "Hallo! Das ist eine hervorragende Frage. Als Ihr OpenPrimer-Tutor empfehle ich Ihnen, die mathematische Herleitung dieses Konzepts im Detail zu betrachten.",
        ZH: "你好！这是一个非常棒的问题。作为您的 OpenPrimer 导师，我建议您深入分析此概念背後の数学原理。"
      };

      const responseText = `[${persona}] ${mockResponses[language.toUpperCase()] || mockResponses.EN}`;
      const words = responseText.split(' ');

      const stream = new ReadableStream({
        async start(controller) {
          for (let i = 0; i < words.length; i++) {
            const chunk = (i === 0 ? '' : ' ') + words[i];
            controller.enqueue(`data: ${JSON.stringify({ text: chunk })}\n\n`);
            await new Promise(r => setTimeout(r, 60)); // Simulate realistic typing speed
          }
          controller.close();
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    }
  } catch (err: any) {
    console.error(`[TUTOR CHAT ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
