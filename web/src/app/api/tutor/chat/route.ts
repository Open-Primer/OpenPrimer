import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/authHelper';
import { isRateLimited } from '@/lib/rateLimit';
import { z } from 'zod';
import { callVertexAI, isVertexConfigured } from '@/lib/vertex-client';
import { TASK_MODELS, MODEL_PRICING, TASK_TOKEN_ESTIMATES, estimateCost } from '@/lib/ai-config';
import { sanitizeString, detectPromptInjection, isSpam } from '@/lib/security';

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1)
    })
  ).min(1),
  persona: z.string().min(1),
  pageContext: z.string().optional(),
  language: z.string().min(2).max(10),
  srsMastery: z.record(z.string(), z.string()).optional(),
  courseLevel: z.string().optional(),
  courseTitle: z.string().optional(),
  courseSubject: z.string().optional(),
  selfEvalPre: z.number().nullable().optional(),
  selfEvalPost: z.number().nullable().optional(),
  personalTutor: z.object({
    enabled: z.boolean(),
    provider: z.enum(['openai', 'anthropic', 'gemini']),
    apiKey: z.string().min(1),
    model: z.string().min(1)
  }).optional(),
  readingProgress: z.object({
    textSnippet: z.string(),
    index: z.number(),
    total: z.number(),
    tagName: z.string()
  }).optional()
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

    const { 
      messages, 
      persona, 
      pageContext, 
      language, 
      srsMastery,
      courseLevel,
      courseTitle,
      courseSubject,
      selfEvalPre,
      selfEvalPost,
      personalTutor,
      readingProgress
    } = parsed.data;
    const langUpper = (language || 'EN').toUpperCase();

    const lastMsgIndex = messages.length - 1;
    const userMessage = messages[lastMsgIndex]?.content || '';

    // Anti-Spam Check
    if (isSpam(userMessage)) {
      console.warn(`[SPAM BLOCK] Tutor chat message flagged as spam.`);
      return NextResponse.json({ success: false, error: 'Message blocked: flagged as spam.' }, { status: 400 });
    }

    // Prompt Injection Check
    if (detectPromptInjection(userMessage)) {
      console.warn(`[SECURITY BLOCK] Tutor chat prompt injection detected.`);
      return NextResponse.json({ success: false, error: 'Message blocked: prompt injection patterns detected.' }, { status: 400 });
    }

    // Input Sanitization
    messages[lastMsgIndex].content = sanitizeString(userMessage);

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

    // Build user reading progress context block if available
    let readingProgressContext = "";
    if (readingProgress) {
      readingProgressContext = `\n--- STUDENT ACTIVE VIEWPORT / READING PROGRESS ---\n`;
      readingProgressContext += `The student is currently viewing block #${readingProgress.index + 1} of ${readingProgress.total} in the lesson (element tag: <${readingProgress.tagName}>).\n`;
      readingProgressContext += `The passage they are looking at or have just scrolled past contains this text snippet:\n"${readingProgress.textSnippet}"\n`;
      readingProgressContext += `You can use this context to understand what part of the lesson they are reading, so that if they ask a context-dependent question like "What does this mean?" or "Explain this paragraph", you know exactly what they are referring to. Do not mention the paragraph numbers or index to the student unless they ask.\n---\n`;
    }

    // Build Spaced Repetition (SRS) cognitive context block if available
    let srsDirective = "";
    if (srsMastery && Object.keys(srsMastery).length > 0) {
      const conceptClean = (c: string) => c.trim().replace(/^["']|["']$/g, '');
      const hardConcepts = Object.entries(srsMastery)
        .filter(([_, level]) => level === 'hard')
        .map(([concept]) => concept);
      const mediumConcepts = Object.entries(srsMastery)
        .filter(([_, level]) => level === 'medium')
        .map(([concept]) => concept);
      const easyConcepts = Object.entries(srsMastery)
        .filter(([_, level]) => level === 'easy')
        .map(([concept]) => concept);

      srsDirective = "\n--- COGNITIVE PROFILE (STUDENT STRENGTHS & WEAKNESSES) ---\n";
      srsDirective += "The student has evaluated their mastery of specific concepts using Spaced Repetition flashcards:\n";
      if (hardConcepts.length > 0) {
        srsDirective += `- STRUGGLING / HARD CONCEPTS: ${hardConcepts.map(c => `"${conceptClean(c)}"`).join(', ')}. The student is struggling to understand or recall these topics. You MUST subtly focus on these, simplify their definitions, use clear analogies, and organically check for recall of these without ever mentioning that the student rated them as hard or mentioning the word 'flashcards'.\n`;
      }
      if (mediumConcepts.length > 0) {
        srsDirective += `- MEDIUM MASTERY CONCEPTS: ${mediumConcepts.map(c => `"${conceptClean(c)}"`).join(', ')}. The student has a basic grasp of these but could benefit from a bit of reinforcement.\n`;
      }
      if (easyConcepts.length > 0) {
        srsDirective += `- STRONG / EASY CONCEPTS: ${easyConcepts.map(c => `"${conceptClean(c)}"`).join(', ')}. The student has fully mastered these. Do not waste time explaining simple aspects of these unless requested.\n`;
      }
      srsDirective += "Subtly tailor your teaching strategy to this profile while keeping your role natural and immersive. Never break the fourth wall or explicitly say 'I see you rated X as hard'.\n---\n";
    }

    const directive = `Always respond strictly in ${langName} (${langUpper}). Be concise and rigorous. No meta-comments or preamble. You may use bold Markdown (**text**) and LaTeX formatting ($...$ for inline, $$...$$ for blocks) to structure your educational explanations and math/physics equations clearly, as these are rendered perfectly in the user interface. Use standard Markdown tables for structured data, comparisons, and structured text tables. Use Mermaid diagrams (written inside standard \`\`\`mermaid code blocks) to visually represent step-by-step processes, pathways, or system workflows, as they will be automatically rendered as high-fidelity visual charts in the user interface.`;
    
    // Build Pedagogical / Curriculum Level Adaptive Prompts
    let levelContext = "";
    if (courseSubject || courseTitle || courseLevel) {
      levelContext = "\n--- CURRICULUM & ADAPTIVE PEDAGOGICAL LEVEL CONTEXT ---\n";
      levelContext += `You are currently teaching a lesson on the subject of: "${courseSubject || 'Academic Study'}" for the specific page titled: "${courseTitle || 'Active Lesson'}".\n`;
      
      const levelUpper = (courseLevel || 'L1').toUpperCase();
      if (levelUpper.includes('L3') || levelUpper.includes('301') || levelUpper.includes('EXPERT')) {
        levelContext += `- ACADEMIC LEVEL (Advanced / L3 / 301): The student is studying at an advanced undergraduate/graduate level. Use rigorous scientific/mathematical formalism, precise mathematical notation, complete proofs where helpful, and avoid overly child-like or hand-waving analogies unless specifically requested. Address them as an aspiring expert.\n`;
      } else if (levelUpper.includes('L2') || levelUpper.includes('201') || levelUpper.includes('INTERMEDIATE')) {
        levelContext += `- ACADEMIC LEVEL (Intermediate / L2 / 201): The student is studying at an intermediate level. Balance conceptual explanations and logical physical analogies with clean mathematical formulations and step-by-step mathematical reasoning.\n`;
      } else {
        // Default to L1 / introductory
        levelContext += `- ACADEMIC LEVEL (Introductory / L1 / 101): The student is studying at an introductory level. Prioritize core conceptual understanding, foundational mechanics, vivid physical analogies, and strong visualization before showing formulas. Ensure any math or scientific derivation is fully explained step-by-step without skipping transitions.\n`;
      }

      // Incorporate student self-evaluation scores for active page
      if (selfEvalPost !== undefined && selfEvalPost !== null) {
        if (selfEvalPost <= 2) {
          levelContext += `- STUDENT CONFIDENCE (Low: ${selfEvalPost}/5): The student has evaluated their own understanding of this specific page's content as low or confusing. Be exceptionally encouraging, break down complex concepts into bite-sized logical steps, use multi-part illustrative analogies, and verify comprehension gently. Minimize assumed prior knowledge.\n`;
        } else if (selfEvalPost >= 4) {
          levelContext += `- STUDENT CONFIDENCE (High: ${selfEvalPost}/5): The student feels highly confident about this specific page's content. Skip basic or trivial definitions. Keep explanations highly efficient, introduce stimulating advanced edge cases, explore deeper intellectual connections, or challenge them with thought-provoking conceptual queries.\n`;
        } else {
          levelContext += `- STUDENT CONFIDENCE (Moderate: ${selfEvalPost}/5): The student has a moderate grasp. Provide structured reinforcing explanations that bridge their gaps.\n`;
        }
      } else if (selfEvalPre !== undefined && selfEvalPre !== null) {
        if (selfEvalPre <= 2) {
          levelContext += `- STUDENT PRE-CONFIDENCE (Low: ${selfEvalPre}/5): The student started this page feeling low in confidence. Check if they have cleared their early doubts, offer supportive foundational support, and prioritize clear conceptual breakdowns.\n`;
        } else if (selfEvalPre >= 4) {
          levelContext += `- STUDENT PRE-CONFIDENCE (High: ${selfEvalPre}/5): The student started with high confidence. Keep the pacing swift and mathematically/conceptually rich.\n`;
        }
      }
      levelContext += "Adjust your explanatory depth, technical vocabulary, and mathematical detail to match this academic level and student confidence rating perfectly and organically. Never break the fourth wall by mentioning the level or rating numbers to the student.\n---\n";
    }

    const personalizationDirective = firstName && firstName !== 'Dev'
      ? `The student's name is ${firstName}. Address them naturally and warmly using their first name occasionally.`
      : `The student's name is not provided. Use a professional, neutral tone.`;

    const systemInstruction = `${systemPrompt}\n\n${contextInstruction}${levelContext}${readingProgressContext}${srsDirective}${directive}\n\n${personalizationDirective}`;

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // === PRIVATE PROVIDER: OpenAI, Anthropic, Gemini AI Studio ===
    if (personalTutor && personalTutor.enabled && personalTutor.apiKey) {
      const { provider, apiKey, model } = personalTutor;
      console.log(`[TUTOR CHAT] Dispatching to Personal Provider "${provider}" (Model: "${model}") for persona "${persona}"...`);

      let url = '';
      let headers: Record<string, string> = { 'Content-Type': 'application/json' };
      let body: any = {};

      if (provider === 'openai') {
        url = 'https://api.openai.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = {
          model: model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemInstruction },
            ...messages.map((m: any) => ({ role: m.role, content: m.content }))
          ],
          stream: true
        };
      } else if (provider === 'anthropic') {
        url = 'https://api.anthropic.com/v1/messages';
        headers['x-api-key'] = apiKey;
        headers['anthropic-version'] = '2023-06-01';
        body = {
          model: model || 'claude-3-5-haiku-20241022',
          max_tokens: 1024,
          system: systemInstruction,
          messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
          stream: true
        };
      } else if (provider === 'gemini') {
        const geminiModel = model || 'gemini-2.5-flash';
        url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?alt=sse&key=${apiKey}`;
        body = {
          contents: messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          }
        };
      }

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error(`[TUTOR CHAT] Personal Provider "${provider}" failed:`, errText);
          return NextResponse.json({ success: false, error: `Personal provider error: ${errText.slice(0, 200)}` }, { status: res.status });
        }

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
                  const trimmed = line.trim();
                  if (trimmed.startsWith('data:')) {
                    const dataStr = trimmed.slice(5).trim();
                    if (!dataStr || dataStr === '[DONE]') continue;
                    try {
                      const parsed = JSON.parse(dataStr);
                      let chunkText = '';
                      if (provider === 'openai') {
                        chunkText = parsed.choices?.[0]?.delta?.content || '';
                      } else if (provider === 'anthropic') {
                        chunkText = parsed.delta?.text || '';
                      } else if (provider === 'gemini') {
                        chunkText = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
                      }
                      if (chunkText) {
                        controller.enqueue(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
                      }
                    } catch {}
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
          headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
        });

      } catch (err: any) {
        console.error(`[TUTOR CHAT] Personal Provider "${provider}" request exception:`, err);
        return NextResponse.json({ success: false, error: `Failed to call personal provider: ${err.message}` }, { status: 500 });
      }
    }

    // === PRIMARY: Vertex AI ===
    if (isVertexConfigured()) {
      console.log(`[TUTOR CHAT] Dispatching to Vertex AI (${TASK_MODELS['tutor_chat']}) for persona "${persona}"...`);
      
      const res = await callVertexAI({
        task: 'tutor_chat',
        contents,
        systemInstruction,
        generationConfig: { temperature: 0.7 },
        stream: true,
        userCountry: request.headers.get('x-vercel-ip-country') || undefined
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
