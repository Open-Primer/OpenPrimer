import { supabaseAdmin } from '@/lib/supabase';
import { cleanPathSegment } from '../../translations';

const PRONUNCIATION_WIDGET_MAP: Record<string, string> = {
  FR: 'SandboxPrononciation',
  EN: 'SandboxPronunciation',
  ES: 'SandboxPronunciation',
  DE: 'SandboxPronunciation',
  ZH: 'SandboxPronunciation',
  PT: 'SandboxPronunciation',
  AR: 'SandboxPronunciation',
  HI: 'SandboxPronunciation',
  UR: 'SandboxPronunciation'
};

export function getLessonMandates(
  discipline: string,
  courseName: string,
  targetLang: string
): {
  isLanguageOrLinguistics: boolean;
  lawMandate: string;
  lawCriticMandate: string;
  pronunciationMandate: string;
} {
  let lawMandate = '';
  let lawCriticMandate = '';
  let pronunciationMandate = '';

  const d = (discipline || '').toLowerCase();
  const c = (courseName || '').toLowerCase();

  const isFrenchLaw = (d.includes('droit') || d.includes('law') || c.includes('droit') || c.includes('law')) &&
    (targetLang.toLowerCase() === 'fr' || c.includes('français') || c.includes('french'));

  if (isFrenchLaw) {
    lawMandate = `
=============================================================================
🏛️ MANDATORY LÉGIFRANCE SOURCE HYPERLINK MANDATE 🏛️
This course covers French Law. For every article of law (e.g. Code civil, Code pénal, Code du travail) or court ruling (Cour de cassation, Conseil d'État), you MUST include direct links to Legifrance.
=============================================================================
`;
    lawCriticMandate = `
7. Density of Légifrance links: This is a French Law course. Ensure that the text contains abundant direct markdown links pointing to Legifrance.
`;
  }

  const isLanguageOrLinguistics = d.includes('linguist') || d.includes('language') || d.includes('langue') ||
    c.includes('anglais') || c.includes('english') || c.includes('espagnol') || c.includes('spanish');

  if (isLanguageOrLinguistics) {
    const pWidget = PRONUNCIATION_WIDGET_MAP[targetLang.toUpperCase()] || 'PronunciationSandbox';
    pronunciationMandate = `
=============================================================================
🚨 MANDATORY PRONUNCIATION WIDGET REQUIREMENT 🚨
Since this lesson belongs to a Language or Linguistics course, you MUST insert the following bracketed widget:
[[WIDGET:${pWidget}:psb_id:word_to_pronounce]]
at least once (and ideally multiple times) directly in the pronunciation, phonetic, or practice sections of your narrative text.
=============================================================================
`;
  }

  return { isLanguageOrLinguistics, lawMandate, lawCriticMandate, pronunciationMandate };
}

export async function runSyllabusScoping(
  syllabus: any,
  courseName: string,
  correctedCourseName: string,
  discipline: string,
  level: string,
  targetLang: string,
  taskId?: string,
  appendTaskLog?: (msg: string) => Promise<void>,
  callAIEngine?: any
): Promise<{
  lessonsList: any[];
  isLanguageOrLinguistics: boolean;
  lawMandate: string;
  lawCriticMandate: string;
  pronunciationMandate: string;
  lessonDbWidgetIds: Set<string>;
}> {
  const log = appendTaskLog || (async (m) => console.log(m));
  const lessonDbWidgetIds = new Set<string>();

  let lessonsList = Array.isArray(syllabus?.lessons) ? [...syllabus.lessons] : [];
  if (!lessonsList || lessonsList.length === 0) {
    throw new Error(`[AI GENERATOR CRITICAL ERROR] Syllabus lessons list is empty or invalid for course "${correctedCourseName}".`);
  }

  lessonsList.forEach((les: any, idx: number) => {
    if (!les || typeof les !== 'object' || !les.title || !les.slug) {
      throw new Error(`[AI GENERATOR CRITICAL ERROR] Syllabus lesson at index ${idx} is missing a title or slug: ${JSON.stringify(les)}`);
    }
    les.originalIndex = idx;
  });

  const originalSyllabusLessonsLength = lessonsList.length;

  if (process.env.ONLY_FIRST_LESSON === 'true') {
    lessonsList = lessonsList.slice(0, 1);
    console.log(`[ONLY_FIRST_LESSON] Sliced lessons list to only generate the first lesson: "${lessonsList[0]?.title}"`);
  } else if (process.env.ONLY_SECOND_LESSON === 'true') {
    lessonsList = lessonsList.slice(1, 2);
    console.log(`[ONLY_SECOND_LESSON] Sliced lessons list to only generate the second lesson: "${lessonsList[0]?.title}"`);
  } else if (process.env.LIMIT_LESSONS) {
    const limit = parseInt(process.env.LIMIT_LESSONS, 10);
    if (!isNaN(limit) && limit > 0) {
      lessonsList = lessonsList.slice(0, limit);
      console.log(`[LIMIT_LESSONS] Sliced lessons list to generate only the first ${limit} lessons.`);
    }
  }

  const lessonOffset = 0;
  await log(`[AI GENERATOR] Syllabus loaded. Total lessons to generate: ${lessonsList.length}. Offset: ${lessonOffset}.`);

  let completedLessons = lessonOffset;
  const updateTaskProgress = async (lessonTitle: string) => {
    completedLessons++;
    const currentProgress = 20 + Math.floor((completedLessons / lessonsList.length) * 70);
    await log(`[AI GENERATOR] Finished lesson "${lessonTitle}" (${completedLessons}/${lessonsList.length}). Progress: ${currentProgress}%.`);
    if (!taskId) return;
    try {
      await supabaseAdmin
        .from('task_queue')
        .update({ progress: Math.min(99, currentProgress) })
        .eq('id', taskId);
    } catch (err) {
      console.warn(`[PROGRESS UPDATE ERROR] Failed to update task ${taskId} progress to ${currentProgress}:`, err);
    }
  };

    // ─────────────────────────────────────────────────────────────────
    // INTER-LESSON THROTTLE — prevents burst of Vertex AI calls within a run.
    // Tune via INTER_LESSON_DELAY_MS env var (default: 5000ms = 5 seconds).
    // Set to 0 to disable. Raise this value if you still hit 429 errors.
    const INTER_LESSON_DELAY_MS = Number(process.env.INTER_LESSON_DELAY_MS ?? 0);

    const MAX_PARALLEL_LESSONS = Number(process.env.MAX_PARALLEL_LESSONS || 1);

    // [FIX G12] Replaced per-lesson Set; cross-lesson budget tracked as atomic count.
    let globalDbWidgetCount = 0;
    const usedMediaRegistry: Array<{ type: string; description: string; title?: string; caption?: string }> = [];
    const sharedCourseInteractiveComponents: any[] = [];


  const mandates = getLessonMandates(discipline, correctedCourseName, targetLang);

  return {
    lessonsList,
    ...mandates,
    lessonDbWidgetIds
  };
}
