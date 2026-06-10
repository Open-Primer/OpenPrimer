import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/authHelper';
import { callVertexAI, isVertexConfigured } from '@/lib/vertex-client';

export async function POST(request: Request) {
  try {
    const user = await verifySession(request);
    if (!user) {
      console.warn('[BADGE-COMPILE WARNING] Session verification failed, running under custom admin/preview bypass.');
    }

    const { name, description, threshold } = await request.json();
    if (!name || !description) {
      return NextResponse.json({ success: false, error: 'Name and description are required.' }, { status: 400 });
    }

    if (!isVertexConfigured()) {
      console.warn('[BADGE-COMPILE] Vertex AI not configured, returning empty for fallback.');
      return NextResponse.json({ success: true, evaluationRule: null, translations: null });
    }

    console.log(`[BADGE-COMPILE] Calling Vertex AI to compile rule & translations for: "${name}"...`);

    const systemInstruction = `You are a high-fidelity academic rule compiler and localization engine for a student learning platform.
Your task is to analyze an achievement badge's name, description, and threshold, and:
1. Compile it into a deterministic, logical evaluation rule JSON.
2. Translate the badge name and description into English, French, Spanish, German, and Simplified Chinese.

Here are the 18 standard student telemetry indicators you must map standard criteria to:
- "enrolled_courses_count" (integer): Total number of courses the student has enrolled in.
- "completed_courses_count" (integer): Total number of courses completed by the student (progress = 100%).
- "learning_minutes" (integer): Total minutes the student spent learning.
- "tutor_question_count" (integer): Total number of questions asked to the AI tutor.
- "streak_days" (integer): Number of consecutive days of learning activity.
- "perfect_quiz_count" (integer): Number of quizzes completed with a perfect score (100% correct).
- "night_session_count" (integer): Number of learning sessions conducted during night hours (22:00 to 05:00).
- "morning_session_count" (integer): Number of learning sessions conducted during morning hours (05:00 to 08:00).
- "feedback_submitted" (boolean): Whether the user has submitted at least one feedback.
- "custom_syllabus_created" (boolean): Whether the user has created at least one custom curriculum / syllabus.
- "fast_learner" (boolean): Whether the user has completed at least one course within 3 days of enrollment.
- "completed_curriculums_count" (integer): Total number of completed curriculums / syllabuses (progress = 100%).
- "enrolled_curriculums_count" (integer): Total number of enrolled curriculums / syllabuses.
- "lessons_viewed_count" (integer): Total number of distinct lessons viewed/visited.
- "quiz_attempts_count" (integer): Total number of quizzes attempted by the student.
- "average_quiz_score" (integer): The student's average quiz accuracy percentage score (0 to 100).
- "visited_pages_count" (integer): Total number of distinct page views recorded.
- "curriculum_completion_rate" (integer): The percentage of enrolled curriculums that are completed (0 to 100).

--- ADVANCED COURSE, DISCIPLINE, & CURRICULUM TARGETING ---
If the badge targets a specific subject/discipline (e.g. Physics, Chemistry, Molecular Genetics, Biology), a specific course title/slug, or a specific curriculum, you must compile a dynamic prefix-based boolean condition (value: true):
1. For Specific Course Completion: "completed_course_[course_slug]" (operator: "===", value: true)
   - Example: "Complete the Classical Mechanics course" -> metric: "completed_course_classical_mechanics", operator: "===", value: true.
2. For Specific Course Enrollment: "enrolled_course_[course_slug]" (operator: "===", value: true)
   - Example: "Enroll in Organic Chemistry" -> metric: "enrolled_course_organic_chemistry", operator: "===", value: true.
3. For Specific Discipline Completion (at least one course): "completed_discipline_[subject_name]" (operator: "===", value: true)
   - Example: "Complete any Physics course" -> metric: "completed_discipline_physics", operator: "===", value: true.
4. For Specific Discipline Enrollment (at least one course): "enrolled_discipline_[subject_name]" (operator: "===", value: true)
   - Example: "Enroll in a Molecular Genetics course" -> metric: "enrolled_discipline_molecular_genetics", operator: "===", value: true.
5. For Specific Curriculum Completion: "completed_curriculum_[curriculum_slug]" (operator: "===", value: true)
   - Example: "Complete the Classical Mechanics curriculum" -> metric: "completed_curriculum_classical_mechanics", operator: "===", value: true.
6. For Specific Curriculum Enrollment: "enrolled_curriculum_[curriculum_slug]" (operator: "===", value: true)
   - Example: "Enroll in the Physics curriculum" -> metric: "enrolled_curriculum_classical_mechanics", operator: "===", value: true.

*Note: Clean subjects and course slugs by converting to lowercase and replacing non-alphanumeric characters with underscores (e.g., "Physics" -> "physics", "Molecular Genetics" -> "molecular_genetics", "classical-mechanics" -> "classical_mechanics").*

Your output must be a single, raw, valid JSON object containing exactly the following schema:
{
  "evaluationRule": {
    "logicalOperator": "and" | "or",
    "conditions": [
      {
        "metric": "enrolled_courses_count" | "completed_courses_count" | "learning_minutes" | ... | or a dynamic metric string listed above,
        "operator": ">=" | ">" | "===" | "<=" | "<" | "!=",
        "value": <number_or_boolean_matching_the_metric_type>
      }
    ]
  },
  "translations": {
    "EN": { "name": "English Name", "description": "English Description" },
    "FR": { "name": "French Name", "description": "French Description" },
    "ES": { "name": "Spanish Name", "description": "Spanish Description" },
    "DE": { "name": "German Name", "description": "German Description" },
    "ZH": { "name": "Chinese Name", "description": "Chinese Description" }
  }
}

Do NOT output any markdown fences, triple backticks, explanations, or introductory text. Return only the raw JSON string.`;

    const userPrompt = `Name: "${name}"
Description: "${description}"
Threshold: "${threshold || ''}"`;

    const res = await callVertexAI({
      task: 'badge_compile',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction,
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    });

    if (!res || !res.ok) {
      throw new Error(`Vertex AI request failed: ${res ? res.statusText : 'No response'}`);
    }

    const data = await res.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean code fences if any
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const result = JSON.parse(text);
    console.log('[BADGE-COMPILE SUCCESS] Rule & translations compiled successfully.');
    return NextResponse.json({
      success: true,
      evaluationRule: result.evaluationRule,
      translations: result.translations
    });

  } catch (err: any) {
    console.error('[BADGE-COMPILE ERROR]', err);
    return NextResponse.json({
      success: true,
      evaluationRule: null,
      translations: null,
      warning: 'Vertex AI compiler failed. Client will fallback to local compiler.'
    });
  }
}
