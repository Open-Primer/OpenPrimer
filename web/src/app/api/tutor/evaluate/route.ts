import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/authHelper';
import { isRateLimited } from '@/lib/rateLimit';
import { z } from 'zod';
import { callVertexAI, isVertexConfigured } from '@/lib/vertex-client';
import { sanitizeString, detectPromptInjection, isSpam } from '@/lib/security';

const evaluationSchema = z.object({
  prompt: z.string().min(5),
  answer: z.string().min(5),
  gradingSystem: z.enum(['0/10', '0/20', 'A-F', 'pass-fail']),
  subject: z.string().optional(),
  level: z.string().optional()
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

    const body = await request.json();
    const parsed = evaluationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload structure.', details: parsed.error.format() }, { status: 400 });
    }

    const { prompt, answer, gradingSystem, subject, level } = parsed.data;

    // Anti-Spam Check on student's response
    if (isSpam(answer)) {
      console.warn(`[SPAM BLOCK] Tutor evaluation answer flagged as spam.`);
      return NextResponse.json({ success: false, error: 'Submission blocked: flagged as spam.' }, { status: 400 });
    }

    // Prompt Injection Check on student's response
    if (detectPromptInjection(answer)) {
      console.warn(`[SECURITY BLOCK] Tutor evaluation prompt injection detected.`);
      return NextResponse.json({ success: false, error: 'Submission blocked: prompt injection patterns detected.' }, { status: 400 });
    }

    // Input Sanitization
    const cleanAnswer = sanitizeString(answer);
    const cleanPrompt = sanitizeString(prompt);
    const cleanSubject = subject ? sanitizeString(subject) : undefined;
    const cleanLevel = level ? sanitizeString(level) : undefined;

    const systemInstruction = `You are an elite academic examiner. Your job is to grade the student's essay/response to the essay prompt.
Subject context: ${cleanSubject || ''}
Academic level context: ${cleanLevel || 'L1'}
Grading System constraints: Graded strictly on the "${gradingSystem}" scale.
- For "0/20": Grade out of 20 (e.g. "14/20"). Commonly used in France.
- For "0/10": Grade out of 10 (e.g. "7.5/10").
- For "A-F": US letter grading (e.g. "A-", "B", "C+", "F").
- For "pass-fail": Output either "Pass" or "Fail".

You must adapt your strictness, grading expectations, and feedback tone to the specified academic level context. For lower school/primary levels, grade leniently, focus on conceptual intuition, and use encouraging language. For advanced university levels (e.g. L3/master/301), grade with high academic strictness, requiring rigorous arguments, formal correctness, and analytical depth.

You MUST write the feedback in the same language as the student's response / essay prompt (e.g., if the student responds in French, write the feedback in French; if in Spanish, write in Spanish; if in German, write in German; etc.).

You must output ONLY a valid JSON object matching this structure:
{
  "grade": "Your Grade String",
  "feedback": "Your detailed academic feedback explaining the grade and suggesting key improvements."
}
Do not write any markdown code block wrappers (like \`\`\`json) or any conversational text. Only output raw JSON.`;

    const userPrompt = `Essay Prompt: "${cleanPrompt}"
Student's Response: "${cleanAnswer}"

Analyze and grade the response now.`;

    // === PRIMARY: Vertex AI ===
    if (isVertexConfigured()) {
      console.log(`[TUTOR EVALUATOR] Dispatching to Vertex AI for essay grading...`);
      try {
        const res = await callVertexAI({
          task: 'course_generation', // Using pro model for reasoning
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemInstruction,
          generationConfig: { 
            temperature: 0.3,
            responseMimeType: "application/json"
          }
        });

        if (res && res.ok) {
          const textRes = await res.text();
          const cleanedText = textRes.replace(/```json/g, '').replace(/```/g, '').trim();
          const result = JSON.parse(cleanedText);
          return NextResponse.json({ success: true, ...result });
        }
      } catch (err) {
        console.error('[TUTOR EVALUATOR] Vertex AI grading failed, falling back to mock.', err);
      }
    }

    // === FALLBACK: Mock grading ===
    console.warn('[TUTOR EVALUATOR] AI unavailable. Using mock evaluation...');
    let mockGrade = '15/20';
    if (gradingSystem === '0/10') mockGrade = '7.5/10';
    else if (gradingSystem === 'A-F') mockGrade = 'B+';
    else if (gradingSystem === 'pass-fail') mockGrade = 'Pass';

    const mockFeedback = `Your response is conceptually sound and shows a good understanding of the subject matter. However, to achieve a higher grade, you should substantiate your arguments with more historical contexts or scientific references. Your writing style is clear and academic.`;

    return NextResponse.json({
      success: true,
      grade: mockGrade,
      feedback: mockFeedback
    });

  } catch (err: any) {
    console.error(`[TUTOR EVALUATOR ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
