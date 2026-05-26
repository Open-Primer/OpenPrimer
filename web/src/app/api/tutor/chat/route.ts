import { NextResponse } from 'next/server';
import { dbService } from '../../../../lib/db';

export async function POST(request: Request) {
  try {
    const { messages, persona, pageContext, language } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, error: 'Messages history is required.' }, { status: 400 });
    }

    // 1. Fetch the active system prompt for this persona from database
    let systemPrompt = "You are a helpful academic tutor.";
    try {
      const { data: personalities } = await dbService.getTutorPersonalities();
      const matching = personalities?.find((p: any) => p.name === persona || p.id === persona);
      if (matching) {
        const langUpper = (language || 'EN').toUpperCase();
        if (matching.translations?.[langUpper]?.prompt) {
          systemPrompt = matching.translations[langUpper].prompt;
        } else if (matching.prompt) {
          systemPrompt = matching.prompt;
        }
      }
    } catch (e) {
      console.warn('[TUTOR CHAT] Failed to query tutor personality from database, using defaults.', e);
    }

    // 2. Assemble context-aware instruction prompt
    const contextInstruction = pageContext 
      ? `Contexte de la page étudiée par l'élève :\n---\n${pageContext}\n---\n`
      : "";

    const systemInstruction = `${systemPrompt}\n\n${contextInstruction}Veuillez toujours répondre de manière concise dans la langue de l'utilisateur (${language.toUpperCase()}). N'utilisez pas de méta-commentaires.`;

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
