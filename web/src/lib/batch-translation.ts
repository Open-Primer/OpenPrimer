import fs from 'fs';
import path from 'path';
import { dbService } from './db';
import { supabaseAdmin } from './supabase';
import { isolateJsxForTranslation, restoreJsxAfterTranslation } from './content';
import { callVertexAI, isVertexConfigured } from './vertex-client';
import { cleanPathSegment } from './translations';

export const GLOBAL_LANGUAGES = ['EN', 'FR', 'ES', 'DE', 'ZH', 'PT', 'AR', 'HI', 'UR'] as const;
export type GlobalLanguage = typeof GLOBAL_LANGUAGES[number];

export interface TranslationTask {
  lessonId: string;
  courseId: string;
  sourceLang: string;
  targetLang: string;
  title: string;
  content: string;
}

/**
 * Academic translation prompt generator preserving LaTeX, JSX markers, and university tone.
 */
export function buildAcademicTranslationPrompt(
  sourceText: string,
  sourceLang: string,
  targetLang: string,
  courseTitle: string,
  level: string
): string {
  return `You are a distinguished university professor and master academic translator.
Translate the following university-grade lesson from ${sourceLang.toUpperCase()} into ${targetLang.toUpperCase()}.

COURSE CONTEXT: "${courseTitle}" (Level: ${level})

CRITICAL ACADEMIC & TECHNICAL TRANSLATION RULES:
1. UNIVERSAL RIGOR: Maintain university/PhD-level vocabulary, rigorous mathematical formalisms, and accurate scientific terminology.
2. PRESERVE LATEX: Keep all mathematical and physical equations intact in LaTeX syntax (e.g. \\( ... \\), $$ ... $$, \\begin{equation} ... \\end{equation}). Do NOT translate mathematical variables or formulas.
3. PRESERVE JSX PLACEHOLDERS: All custom React interactive components are isolated with markers formatted like [[JSX_BLOCK_...]] or __JSX_CLOSE_...__ or __SRC_ATTR_...__. You MUST preserve these exact markers untouched without altering their numbering or syntax.
4. PRESERVE MARKDOWN: Maintain the exact Markdown heading hierarchy (#, ##, ###), bold/italic accents, bullet points, and table structures.
5. PURE TRANSLATION ONLY: Output ONLY the translated markdown text. Do NOT add conversational preambles, notes, or wrap the whole output in an outer code block.

SOURCE LESSON CONTENT TO TRANSLATE:
${sourceText}`;
}

/**
 * Translates a single lesson into a target language using Gemini 3.7 / 2.5 Flash.
 */
export async function translateSingleLesson(
  lessonContent: string,
  sourceLang: string,
  targetLang: string,
  courseTitle: string,
  level: string
): Promise<string> {
  const { content: isolatedText, registry } = isolateJsxForTranslation(lessonContent);
  const prompt = buildAcademicTranslationPrompt(isolatedText, sourceLang, targetLang, courseTitle, level);

  let rawTranslated = '';

  // 1. Try Vertex AI
  if (isVertexConfigured()) {
    try {
      const res = await callVertexAI({
        task: 'course_translation',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      });
      if (res && res.ok) {
        const jsonRes = await res.json();
        rawTranslated = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
    } catch (err) {
      console.warn('[BATCH-TRANSLATE] Vertex AI call failed, trying Google AI Studio...', err);
    }
  }

  // 2. Try Google AI Studio fallback
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!rawTranslated && apiKey) {
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 }
        })
      });
      if (res.ok) {
        const jsonRes = await res.json();
        rawTranslated = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else {
        const errBody = await res.text();
        console.warn(`[BATCH-TRANSLATE] AI Studio error ${res.status}:`, errBody.substring(0, 200));
      }
    } catch (e: any) {
      console.error('[BATCH-TRANSLATE] AI Studio API exception:', e.message);
    }
  }

  if (!rawTranslated || !rawTranslated.trim()) {
    throw new Error(`[BATCH-TRANSLATE] Translation to ${targetLang} produced empty response.`);
  }

  // Restore isolated JSX blocks
  const cleanMdx = rawTranslated.replace(/^```[a-z]*\r?\n/i, '').replace(/\r?\n```$/i, '').trim();
  const restoredMdx = restoreJsxAfterTranslation(cleanMdx, registry);
  return restoredMdx;
}

/**
 * Executes batch translation for an entire course across all remaining global languages.
 */
export async function runCourseBatchTranslation(
  courseId: string,
  targetLangs: GlobalLanguage[] = ['EN', 'FR', 'ES', 'DE', 'ZH', 'PT', 'AR', 'HI', 'UR']
): Promise<{ success: boolean; translatedCount: number; errors: string[] }> {
  const errors: string[] = [];
  let translatedCount = 0;

  console.log(`[BATCH-TRANSLATE] Starting batch translation for course ${courseId}...`);

  // 1. Fetch course metadata and base lessons from Supabase
  const { data: course, error: courseErr } = await supabaseAdmin
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (courseErr || !course) {
    return { success: false, translatedCount: 0, errors: [`Course ${courseId} not found.`] };
  }

  const { data: lessons, error: lessonsErr } = await supabaseAdmin
    .from('lessons')
    .select('*')
    .eq('course_id', courseId);

  if (lessonsErr || !lessons || lessons.length === 0) {
    return { success: false, translatedCount: 0, errors: [`No lessons found for course ${courseId}.`] };
  }

  const sourceLang = (course.source_lang || 'FR').toUpperCase() as GlobalLanguage;
  const languagesToProcess = targetLangs.filter(l => l.toUpperCase() !== sourceLang);

  console.log(`[BATCH-TRANSLATE] Course: "${course.title}" (${course.level}). Translating from ${sourceLang} into ${languagesToProcess.join(', ')}...`);

  // Group base lessons by lesson_slug
  const baseLessons = lessons.filter(l => (l.lang || 'fr').toUpperCase() === sourceLang);

  for (const lang of languagesToProcess) {
    console.log(`\n--- Batch translating into [${lang}] ---`);
    for (const baseLesson of baseLessons) {
      const targetLangLower = lang.toLowerCase();
      
      // Check if already translated
      const existing = lessons.find(l => l.lesson_slug === baseLesson.lesson_slug && l.lang?.toLowerCase() === targetLangLower);
      if (existing && existing.content && existing.content.length > 200) {
        console.log(`  ✓ Lesson "${baseLesson.title}" already translated in ${lang}. Skipping.`);
        continue;
      }

      try {
        console.log(`  ➔ Translating lesson "${baseLesson.title}" into ${lang}...`);
        const translatedContent = await translateSingleLesson(
          baseLesson.content,
          sourceLang,
          lang,
          course.title,
          course.level
        );

        // Upsert translated lesson into Supabase
        const { error: upsertErr } = await supabaseAdmin
          .from('lessons')
          .upsert({
            course_id: course.id,
            lesson_slug: baseLesson.lesson_slug,
            lang: targetLangLower,
            title: baseLesson.title,
            module: baseLesson.module,
            order_index: baseLesson.order_index,
            status: 'completed',
            content: translatedContent,
            updated_at: new Date().toISOString()
          }, { onConflict: 'course_id,lesson_slug,lang' });

        if (upsertErr) {
          console.warn(`    ! Database upsert warning for ${baseLesson.lesson_slug} (${lang}):`, upsertErr.message);
        } else {
          console.log(`    ✓ Saved translation to Supabase (${lang})`);
          translatedCount++;
        }

        // Dual persistence: Write offline MDX file
        try {
          const contentDir = path.join(
            process.cwd(),
            'web',
            'content',
            cleanPathSegment(course.level || 'L1'),
            cleanPathSegment(course.subject || 'General'),
            cleanPathSegment(course.slug || course.title)
          );
          fs.mkdirSync(contentDir, { recursive: true });
          const mdxFilePath = path.join(contentDir, `${cleanPathSegment(baseLesson.lesson_slug)}.${targetLangLower}.mdx`);
          fs.writeFileSync(mdxFilePath, translatedContent, 'utf-8');
          console.log(`    ✓ Written offline MDX: ${mdxFilePath}`);
        } catch (fsErr: any) {
          console.warn(`    ! Could not write offline MDX file:`, fsErr.message);
        }

      } catch (err: any) {
        console.error(`    ✗ Error translating "${baseLesson.title}" to ${lang}:`, err.message);
        errors.push(`[${lang}] ${baseLesson.title}: ${err.message}`);
      }
    }
  }

  console.log(`\n[BATCH-TRANSLATE COMPLETE] Translated ${translatedCount} lessons with ${errors.length} errors.`);
  return { success: errors.length === 0, translatedCount, errors };
}
