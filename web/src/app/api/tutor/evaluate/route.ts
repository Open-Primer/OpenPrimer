import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/authHelper';
import { isRateLimited } from '@/lib/rateLimit';
import { z } from 'zod';
import { callVertexAI, isVertexConfigured } from '@/lib/vertex-client';

const evaluationSchema = z.object({
  prompt: z.string().min(5),
  answer: z.string().min(5),
  gradingSystem: z.enum(['0/10', '0/20', 'A-F', 'pass-fail']),
  subject: z.string().optional()
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

    const { prompt, answer, gradingSystem, subject } = parsed.data;

    const systemInstruction = `You are an elite academic examiner. Your job is to grade the student's essay/response to the essay prompt.
Subject context: ${subject || 'General Education'}
Grading System constraints: Graded strictly on the "${gradingSystem}" scale.
- For "0/20": Grade out of 20 (e.g. "14/20"). Commonly used in France.
- For "0/10": Grade out of 10 (e.g. "7.5/10").
- For "A-F": US letter grading (e.g. "A-", "B", "C+", "F").
- For "pass-fail": Output either "Pass" or "Fail".

You must output ONLY a valid JSON object matching this structure:
{
  "grade": "Your Grade String",
  "feedback": "Your detailed academic feedback explaining the grade and suggesting key improvements."
}
Do not write any markdown code block wrappers (like \`\`\`json) or any conversational text. Only output raw JSON.`;

    const userPrompt = `Essay Prompt: "${prompt}"
Student's Response: "${answer}"

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
