import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/authHelper';
import { isRateLimited } from '@/lib/rateLimit';
import { z } from 'zod';
import { callVertexAI, isVertexConfigured } from '@/lib/vertex-client';
import { sanitizeString, detectPromptInjection, isSpam } from '@/lib/security';

const evaluationSchema = z.object({
  prompt: z.string().min(5),
  answer: z.string().optional().default(''),
  fileAttachment: z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    base64: z.string().optional()
  }).optional(),
  gradingSystem: z.enum(['0/10', '0/20', 'A-F', 'pass-fail']),
  subject: z.string().optional(),
  level: z.string().optional(),
  submissionType: z.enum(['text', 'file', 'audio']).optional().default('text')
});

export async function POST(request: Request) {
  try {
    const user = await verifySession(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing or invalid token.' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (await isRateLimited(ip, 10, 60000, 'tutor_evaluate')) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
    }

    const bodyText = await request.text();
    console.log(`[TUTOR EVALUATOR] Received request body text length: ${bodyText.length}`);
    if (bodyText.length === 0) {
      console.warn(`[TUTOR EVALUATOR] Empty body text!`);
      return NextResponse.json({ success: false, error: 'Empty request body.' }, { status: 400 });
    }
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e: any) {
      console.error(`[TUTOR EVALUATOR] Failed to parse JSON body. Raw body snippet: ${bodyText.slice(0, 500)}`, e);
      return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
    }
    const parsed = evaluationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload structure.', details: parsed.error.format() }, { status: 400 });
    }

    const { prompt, answer, fileAttachment, gradingSystem, subject, level, submissionType } = parsed.data;

    // Anti-Spam Check on student's response if provided
    if (answer && isSpam(answer)) {
      console.warn(`[SPAM BLOCK] Tutor evaluation answer flagged as spam.`);
      return NextResponse.json({ success: false, error: 'Submission blocked: flagged as spam.' }, { status: 400 });
    }

    // Prompt Injection Check on student's response if provided
    if (answer && detectPromptInjection(answer)) {
      console.warn(`[SECURITY BLOCK] Tutor evaluation prompt injection detected.`);
      return NextResponse.json({ success: false, error: 'Submission blocked: prompt injection patterns detected.' }, { status: 400 });
    }

    // Input Sanitization
    const cleanAnswer = answer ? sanitizeString(answer) : '';
    const cleanPrompt = sanitizeString(prompt);
    const cleanSubject = subject ? sanitizeString(subject) : undefined;
    const cleanLevel = level ? sanitizeString(level) : undefined;

    const systemInstruction = `You are an elite academic examiner. Your job is to grade the student's submission (essay response, diagram, drawing, or file) to the assessment prompt.
Subject context: ${cleanSubject || ''}
Academic level context: ${cleanLevel || 'L1'}
Grading System constraints: Graded strictly on the "${gradingSystem}" scale.
- For "0/20": Grade out of 20 (e.g. "14/20"). Commonly used in France.
- For "0/10": Grade out of 10 (e.g. "7.5/10").
- For "A-F": US letter grading (e.g. "A-", "B", "C+", "F").
- For "pass-fail": Output either "Pass" or "Fail".

Strict constraints on tutor role & personality:
1. NO PERSONALITY OR ROLEPLAY: Do NOT use any personal persona, avatar, character, or roleplay personality. Keep the evaluation strictly objective, academic, neutral, professional, and direct. Do not say "I am your AI tutor" or refer to yourself as a person; just provide the grade and feedback directly.
2. OBJECTIVE EVALUATION & DETAILED COMMENTARY: The grading and comments must be purely objective, focusing on the factual accuracy, reasoning, structure, and quality of the student's submission. You must systematically comment on the submission, providing detailed feedback of appropriate length. For complex essays, diagrams, or drawings, provide comprehensive, structured comments analyzing specific strengths, weaknesses, and key suggestions for improvement. For shorter or simpler answers, keep it concise but constructive.
3. ADAPT TO STUDENT LEVEL: Adapt your strictness and grading expectations to the specified academic level context. For lower school/primary levels, grade leniently, focus on conceptual intuition, and use encouraging language. For advanced university levels (e.g. L3/master/301), grade with high academic strictness, requiring rigorous arguments, formal correctness, and analytical depth.

You MUST write the feedback in the same language as the student's response / essay prompt (e.g., if the student responds in French, write the feedback in French; if in Spanish, write in Spanish; if in German, write in German; etc.).

You must output ONLY a valid JSON object matching this structure:
{
  "grade": "Your Grade String",
  "feedback": "Your detailed academic feedback explaining the grade and suggesting key improvements."
}
Do not write any markdown code block wrappers (like \`\`\`json) or any conversational text. Only output raw JSON.`;

    let userPrompt = '';
    const parts: any[] = [];

    if ((submissionType === 'file' || submissionType === 'audio') && fileAttachment) {
      userPrompt = `Assessment Prompt: "${cleanPrompt}"
The student has submitted a ${submissionType === 'audio' ? 'recorded oral response' : 'file'} for this assessment.
File Name: "${fileAttachment.name}"
File Type: "${fileAttachment.type}"
File Size: ${fileAttachment.size} bytes

Student's Accompanying Notes/Answer: "${cleanAnswer || 'No accompanying notes.'}"`;

      if (fileAttachment.base64 && (fileAttachment.type.startsWith('image/') || fileAttachment.type.startsWith('audio/'))) {
        try {
          const base64Data = fileAttachment.base64.replace(/^data:\w+\/\w+;base64,/, '');
          parts.push({
            inlineData: {
              mimeType: fileAttachment.type,
              data: base64Data
            }
          });
        } catch (e) {
          console.warn("[TUTOR EVALUATOR] Failed to extract media data from base64:", e);
        }
      }
    } else {
      userPrompt = `Assessment Prompt: "${cleanPrompt}"
Student's Response: "${cleanAnswer}"`;
    }

    parts.push({ text: `${userPrompt}\n\nAnalyze, comment, and grade this submission now.` });

    // === PRIMARY: Vertex AI ===
    // POLICY: Offline/mock evaluation is strictly forbidden. If the AI is unavailable,
    // we return a 503 so the client can display a proper "evaluation unavailable" error
    // and instruct the student to contact administration or retry later.
    if (isVertexConfigured()) {
      console.log(`[TUTOR EVALUATOR] Dispatching to Vertex AI for essay/file grading...`);
      try {
        const res = await callVertexAI({
          task: 'course_generation', // Using pro model for reasoning
          contents: [{ role: 'user', parts }],
          systemInstruction,
          generationConfig: { 
            temperature: 0.3,
            responseMimeType: "application/json"
          }
        });

        if (res && res.ok) {
          const data = await res.json();
          let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const result = JSON.parse(cleanedText);
          return NextResponse.json({ success: true, ...result });
        }

        // AI responded but not OK — treat as service unavailable
        console.error(`[TUTOR EVALUATOR] Vertex AI returned non-OK status. Blocking evaluation.`);
      } catch (err) {
        console.error('[TUTOR EVALUATOR] Vertex AI grading failed. Blocking evaluation (no offline fallback allowed).', err);
      }
    } else {
      console.error('[TUTOR EVALUATOR] Vertex AI not configured. Blocking evaluation.');
    }

    // === NO FALLBACK — Offline evaluation is prohibited ===
    // Return 503 with a special flag so the client can show a proper error UI
    // and instruct the student to report the issue to administration.
    return NextResponse.json({
      success: false,
      offline: true,
      error: 'The AI evaluation service is currently unavailable. Offline grading is not permitted. Please contact your course administrator or try again later.'
    }, { status: 503 });

  } catch (err: any) {
    console.error(`[TUTOR EVALUATOR ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
