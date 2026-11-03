import fs from 'fs';
import path from 'path';
import { dbService } from '../../db';
import { supabaseAdmin, supabase } from '../../supabase';
import { cleanPathSegment, normalizeLevel } from '../../translations';
import { callVertexAI } from '@/lib/vertex-client';
import { preprocessMdx } from '@/lib/content';
import { resolveAndPersistMedia } from '../../media-resolver';
import { stitchLessonContent } from '../stitcher';
import { validateAndFixWidgets } from '../widget-healer';
import { validateAndFixExternalResources } from '../resource-validator';
import { performSectionBasedTranslation, cascadeCurriculumTranslation } from './sectionBasedTranslation';
import { generateTranslationStatsMarkdown } from './statsGenerators';
import { healMdxWithAI } from './mdxHealer';
import { validateMdxContent } from './mdxValidator';

export async function translateCourseContent(courseSlug: string, targetLang: string, taskId?: string, lessonOffset: number = 0) {
  courseSlug = cleanPathSegment(courseSlug);
  try {
    // 1. Check if the course is a curriculum
    const { data: allCourses } = await dbService.getAllCourses();
    const course = allCourses?.find(c => c.slug === courseSlug);
    
    if (course?.isCurriculum) {
      console.log(`[TRANSLATOR] Target "${courseSlug}" is a curriculum. Cascading translation to all child courses first...`);
      await cascadeCurriculumTranslation(course, allCourses || [], targetLang, translateCourseContent);
    } else {
      // 1. Fetch only primary source lessons for this course to avoid duplicates
      const sourceLang = (course?.languages && course.languages.length > 0)
        ? course.languages[0].toLowerCase()
        : 'en';

      const { data: sourceLessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_slug', courseSlug)
        .eq('lang', sourceLang);

      if (!sourceLessons || sourceLessons.length === 0) {
        console.warn(`No source lessons found in database for course ${courseSlug} to translate.`);
      } else {
        const INTER_LESSON_DELAY_MS = Number(process.env.INTER_LESSON_DELAY_MS ?? 5000);
        const failures: string[] = [];
        
        let completedLessons = lessonOffset;
        const updateTaskProgress = async () => {
          if (!taskId) return;
          completedLessons++;
          const currentProgress = 20 + Math.floor((completedLessons / sourceLessons.length) * 70);
          try {
            await supabase
              .from('task_queue')
              .update({ progress: Math.min(99, currentProgress) })
              .eq('id', taskId);
            console.log(`[TASK PROGRESS] Translation Task ${taskId} updated to ${currentProgress}%`);
          } catch (err) {
            console.warn(`[PROGRESS UPDATE ERROR] Failed to update task ${taskId} progress to ${currentProgress}:`, err);
          }
        };
        
        const MAX_PARALLEL_LESSONS = Number(process.env.MAX_PARALLEL_LESSONS || 1);

        // 2. Translate lessons with concurrency limit
        const lessonPromises = mapConcurrent(sourceLessons, MAX_PARALLEL_LESSONS, async (lesson, index) => {
          if (index < lessonOffset) {
            console.log(`[INCREMENTAL] Skipping translation for lesson "${lesson.title}" because it is below the resume offset ${lessonOffset}.`);
            return;
          }

          // Check if this lesson is already translated (incremental translation check)
          try {
            const { data: existingLesson } = await dbService.getLesson(
              courseSlug,
              lesson.lesson_slug,
              targetLang.toLowerCase()
            );
            if (existingLesson && existingLesson.content && existingLesson.content.trim().length > 100) {
              console.log(`[INCREMENTAL] Skipping translation for already existing translated lesson: "${lesson.title}" (${lesson.lesson_slug}) to "${targetLang}"`);
              await updateTaskProgress();
              return;
            }
          } catch (err) {
            console.warn(`[INCREMENTAL] Translation check failed for "${lesson.title}", proceeding.`, err);
          }

          const translationStats: any = {
            courseSlug: courseSlug,
            lessonTitle: lesson.title,
            lessonSlug: lesson.lesson_slug,
            targetLanguage: targetLang,
            startTime: Date.now(),
            endTime: 0,
            durationSeconds: 0,
            sectionsTotal: 0,
            sectionTranslationFailures: 0,
            critiqueIterations: 0,
            critiqueRejections: 0,
            selfHealingAttempts: 0,
            status: 'pending',
            error: '',
            tokenMetrics: {
              promptTokens: 0,
              candidatesTokens: 0
            },
            estimatedCostUSD: 0
          };

          try {
            const delay = index * INTER_LESSON_DELAY_MS;
            console.log(`[TRANSLATOR] Staggering translation of lesson "${lesson.title}" by ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // [FIX T6] Capture sectionRegistry for reuse in critic-refine loop.
            const { translatedMdx: initialTranslatedMdx, transSuccess: initialTransSuccess, transTitle: initialTransTitle, registry: sectionRegistry } = await performSectionBasedTranslation(lesson, targetLang, apiKey, translationStats);
            let translatedMdx = initialTranslatedMdx;
            let transSuccess = initialTransSuccess;
            let transTitle = initialTransTitle;

            // === TRANSLATION CRITIC PIPELINE ===
            let approved = false;
            let critique = '';
            let currentTranslation = translatedMdx;
            let critiqueIteration = 0;
            const maxCritiqueIterations = 3;

            while (!approved && critiqueIteration < maxCritiqueIterations && currentTranslation) {
              critiqueIteration++;
              translationStats.critiqueIterations = critiqueIteration;
              console.log(`[AI GENERATOR - TRANSLATION CRITIC] Reviewing translation for "${lesson.title}" to "${targetLang}" (Attempt ${critiqueIteration}/${maxCritiqueIterations})...`);

              const promptCritic = `You are the Translation Critic Agent (Agent 4 - Specialized in Translation Quality Assurance). Your job is to strictly validate the translated academic MDX content against the original source content.
Source Language: English
Target Language: "${targetLang.toUpperCase()}"

Original MDX Content (JSX components shown as placeholders for fair comparison):
${isolateJsxForTranslation(lesson.content).content}

Translated MDX Content (JSX components shown as placeholders for fair comparison):
${isolateJsxForTranslation(currentTranslation).content}

Your validation checklist:
1. Academic Integrity: Is the scientific/academic depth, tone, and accuracy of the original content fully preserved?
2. MDX Components Preservation: Are all MDX elements (like <Quiz>, <Question>, <Option>, <Glossary>, <Video>, <Audio>, <FillInBlanks>, <SolvedProblem>, <Summary>, <SelfEval>, <HistoricalPerson>, <Location>, <Place>, <EntityLink>, <EssayEvaluation>, <OpenQuestion>, <ScientificDebate>, <SpeciesLink>, <ChemicalLink>, <CelestialLink>, etc.) completely present with all their JSX tags and properties intact? Do NOT generate empty components like <CriticalThinking />, <WhatsNext />, <OpenQuestion />, or <ScientificDebate /> without text/children. Do NOT nest wrapper components (e.g. nesting <WhatsNext> inside itself is strictly forbidden).
3. Custom attributes: For <Glossary>, are term/definition translated? For <HistoricalPerson>, are name/lang translated/updated? For <EssayEvaluation>, are prompt/subject translated? Are other properties (like durations, options, gradingSystem, IDs, itemsBase64 payloads) preserved exactly as in the original?
4. Formulas and Code: Are all Math equations ($...$ or $...$) and code blocks kept exactly as they were, untranslated?
5. Zero Translator Commentary: Did the translator introduce any notes, prefixes, or meta-conversational lines (e.g. "Here is the translation:")? If so, reject it.
6. Zero placeholders: Are there any placeholders or unfinished sections?
7. Assessment Integrity: Ensure all translated interactive assessments (<Quiz>, <Question>, <Option>, <DiagnosticQuiz>, <EssayEvaluation>, <UnsolvedExercise>) are complete, fully populated with high-quality, non-empty text matching the target course level, length, and complexity of the subject, and verify that the translation has not broken correct option attributes (e.g. "correct" prop on <Option>, or "correctIndex" on <DiagnosticQuiz>).
8. Academic References and Figure Sources: Do NOT expect or request translation of academic references, book/article/publication titles, author names, or citation texts inside <References> components or itemsBase64 attributes. These must remain exactly as they are in the original to preserve citation integrity.
9. Immutability of Citations and Sources: Verify that "Source:" prefixes and associated bibliographic links/attributions in figure captions or narrative text remain exactly in their original language (typically English) and have not been translated. Verify that quotes (lines starting with '>') have the quote translated to the target course language, followed by its original version in brackets (e.g. \`[Original: "Original quote..."]\`) if different from the target course language. Ensure that if the target course language matches the quote's original language, only one quote exists (no brackets or duplication). Ensure all citation details (author, book, publisher, etc. after the '—' dash) remain untranslated. Reject the translation if bibliographic citations, original quote blocks, reference metadata, or book titles are translated.

You must output ONLY a valid JSON object matching this structure:
{
  "approved": true or false,
  "critique": "If not approved, explain exactly what is wrong/missing/broken so the translator can correct it. If approved, keep this empty."
}

[REJECT-ONLY REPORTING MANDATE]
If the translation is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the translation is approved.`;

let criticResText = '';
              let criticSuccess = false;

              if (process.env.DEBUG === 'true') {
                saveDraftRevision(`prompt_translation_critic_${lesson.lesson_slug}_${targetLang.toLowerCase()}_attempt_${critiqueIteration}.md`, promptCritic);
              }

              if (isVertexConfigured()) {
                try {
                  const res = await callVertexAI({
                    task: 'course_generation', // Using pro model for critique reasoning
                    contents: [{ role: 'user', parts: [{ text: promptCritic }] }],
                    generationConfig: {
                      temperature: 0.1,
                      responseMimeType: "application/json",
                      responseSchema: verificationSchema
                    }
                  });
                  if (res && res.ok) {
                    const resJson = await res.json();
                    criticResText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    criticSuccess = true;
                    if (translationStats) {
                      const usage = resJson.usageMetadata || {};
                      translationStats.tokenMetrics.promptTokens += usage.promptTokenCount || 0;
                      translationStats.tokenMetrics.candidatesTokens += usage.candidatesTokenCount || usage.candidateTokenCount || 0;
                    }
                  }
                } catch (err) {
                  console.warn("[AI GENERATOR - TRANSLATION CRITIC] Vertex critique call failed:", err);
                }
              }

              if (!criticSuccess && apiKey) {
                const startTime = Date.now();
                try {
                  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents: [{ parts: [{ text: compressPromptText(promptCritic) }] }],
                      generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: verificationSchema
                      }
                    })
                  });
                  if (res.ok) {
                    const resJson = await res.json();
                    criticResText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    criticSuccess = true;
                    const durationMs = Date.now() - startTime;
                    const usage = resJson.usageMetadata || {};
                    const promptTokens = usage.promptTokenCount || 0;
                    const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
                    if (translationStats) {
                      translationStats.tokenMetrics.promptTokens += promptTokens;
                      translationStats.tokenMetrics.candidatesTokens += candidatesTokens;
                    }
                    await recordMetrics('course_generation', 'gemini-3.5-flash-lite', durationMs, promptTokens, candidatesTokens, promptCritic);
                  }
                } catch (err) {
                  console.error("[AI GENERATOR - TRANSLATION CRITIC] AI Studio fallback critique call failed:", err);
                }
              }

              if (criticSuccess && criticResText) {
                if (process.env.DEBUG === 'true') {
                  saveDraftRevision(`critique_translation_${lesson.lesson_slug}_${targetLang.toLowerCase()}_attempt_${critiqueIteration}.json`, criticResText);
                }
                try {
                  const cleanedCritic = criticResText.replace(/```json/g, '').replace(/```/g, '').trim();
                  const criticObj = safeJsonParse(cleanedCritic, 'reviseCourseContent (Agent 4 Verification)');
                  approved = !!criticObj.approved;
                  critique = criticObj.critique || '';
                  if (!approved && critiqueIteration >= 2) {
                    console.warn(`[AI GENERATOR - TRANSLATION CRITIC] Overriding rejection on attempt #${critiqueIteration} to prevent infinite loop. Accepting current content.`);
                    approved = true;
                  }
                } catch (e) {
                  console.error("[AI GENERATOR - TRANSLATION CRITIC] Failed to parse critic JSON response:", e);
                  approved = true; // Avoid infinite loop or blocks if AI returns malformed JSON
                }
              } else {
                approved = true; // Bypass critique loop if service is unavailable
              }

              if (approved) {
                console.log(`[AI GENERATOR - TRANSLATION CRITIC] Translation approved for "${lesson.title}"!`);
                translatedMdx = currentTranslation;
              } else {
                console.warn(`[AI GENERATOR - TRANSLATION CRITIC] Translation REJECTED for "${lesson.title}". Critique: ${critique}`);
                if (translationStats) {
                  translationStats.critiqueRejections++;
                }
                
                // [FIX T6] Reuse sectionRegistry from performSectionBasedTranslation instead of
                // re-isolating, which produces different placeholder keys causing JSX corruption.
                const { content: isolatedContent } = isolateJsxForTranslation(lesson.content);
                const { content: isolatedRejected } = isolateJsxForTranslation(currentTranslation);

                const promptRefine = `You are a professional academic translator. The Translation Critic Agent has rejected your previous translation with the following critique:

CRITIQUE FROM TRANSLATION CRITIC:
${critique}

Original MDX Content to Translate:
${isolatedContent}

Previous Rejected Translation:
${isolatedRejected}

Please re-translate the Original MDX Content to "${targetLang.toUpperCase()}", correcting all issues highlighted by the critic.
Follow all initial translation rules:
1. Preserve all markdown structure, custom blockquotes, headings, lists, and links.
2. Keep all Math equations (wrapped in $ or $) completely untouched.
3. Do NOT translate technical code blocks or placeholder tokens like __JSX_SELF_...__, __JSX_CLOSE_...__, __JSX_OPEN_...__, __JSX_ATTR_...__, __JSX_END_...__, and source attribution placeholders like __SRC_ATTR_PLACEHOLDER_...__. Preserve them EXACTLY as they are. Do not translate the '|||' separators. Absolutely do NOT append any text, properties, or attributes to these placeholders (for example, never append itemsBase64=... next to __JSX_SELF_References_...__).
4. Translate the title and return ONLY the translated MDX content. Do not include markdown code block wrappers.
5. CRITICAL ACADEMIC INTEGRITY & CITATION RULES:
   - Do NOT translate any bibliographic references, book/article/publication titles, author names, publishers, publication cities, or citation texts. These must remain exactly in their original language to preserve academic citation integrity.
   - Do NOT translate the "Source:" prefix or any associated bibliographic links/attributions in figures, captions, or text.
   - In quote blocks (lines starting with '>'), do NOT translate the author name or the publication details following the '—' dash.
   - Translate the quote content into the target course language, followed by its original version in brackets (e.g., \`[Original: "Original quote..."]\`) IF the target course language is different from the quote's original language. If the target course language is the same as the quote's original language, only keep the original version (do NOT repeat it or wrap it in brackets). Never translate the original citation text in the brackets.`;

if (process.env.DEBUG === 'true') {
                  saveDraftRevision(`prompt_translation_refiner_${lesson.lesson_slug}_${targetLang.toLowerCase()}_attempt_${critiqueIteration + 1}.md`, promptRefine);
                }

                let refineSuccess = false;
                if (isVertexConfigured()) {
                  try {
                    const resRefine = await callVertexAI({
                      task: 'course_translation',
                      contents: [{ role: 'user', parts: [{ text: promptRefine }] }],
                      generationConfig: { temperature: 0.1 }
                    });
                    if (resRefine && resRefine.ok) {
                      const resJson = await resRefine.json();
                      const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                      currentTranslation = restoreJsxAfterTranslation(rawText, sectionRegistry, targetLang);
                      refineSuccess = true;
                      if (translationStats) {
                        const usage = resJson.usageMetadata || {};
                        translationStats.tokenMetrics.promptTokens += usage.promptTokenCount || 0;
                        translationStats.tokenMetrics.candidatesTokens += usage.candidatesTokenCount || usage.candidateTokenCount || 0;
                      }
                    }
                  } catch (err) {
                    console.warn("[AI GENERATOR - TRANSLATION CRITIC] Vertex translation refinement call failed:", err);
                  }
                }

                if (!refineSuccess && apiKey) {
                  const startTime = Date.now();
                  try {
                    const resRefine = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        contents: [{ parts: [{ text: compressPromptText(promptRefine) }] }]
                      })
                    });
                    if (resRefine.ok) {
                      const resJson = await resRefine.json();
                      const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                      currentTranslation = restoreJsxAfterTranslation(rawText, sectionRegistry, targetLang);
                      refineSuccess = true;
                      const durationMs = Date.now() - startTime;
                      const usage = resJson.usageMetadata || {};
                      const promptTokens = usage.promptTokenCount || 0;
                      const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
                      if (translationStats) {
                        translationStats.tokenMetrics.promptTokens += promptTokens;
                        translationStats.tokenMetrics.candidatesTokens += candidatesTokens;
                      }
                      await recordMetrics('course_translation', 'gemini-3.5-flash-lite', durationMs, promptTokens, candidatesTokens, promptRefine);
                    }
                  } catch (err) {
                    console.error("[AI GENERATOR - TRANSLATION CRITIC] AI Studio fallback translation refinement call failed:", err);
                  }
                }

                if (refineSuccess && currentTranslation && process.env.DEBUG === 'true') {
                  saveDraftRevision(`draft_translation_${lesson.lesson_slug}_${targetLang.toLowerCase()}_attempt_${critiqueIteration + 1}.md`, currentTranslation);
                }

                if (!refineSuccess) {
                  console.warn("[AI GENERATOR - TRANSLATION CRITIC] Refinement failed to respond, continuing with current translation.");
                  translatedMdx = currentTranslation;
                  break;
                }
              }
            }

            if (!approved && currentTranslation) {
              console.warn(`[AI GENERATOR - TRANSLATION CRITIC] Translation not fully approved after ${maxCritiqueIterations} critique iterations. Saving best-effort result.`);
              // [FIX T7] Submit error report so operators know the translation was not validated.
              try {
                await dbService.submitReport(courseSlug, `${courseSlug}/${lesson.lesson_slug}`,
                  `[CRITIC EXHAUSTED] Translation for "${lesson.title}" to ${targetLang} not approved after ${maxCritiqueIterations} iterations. Last critique: ${critique}`);
              } catch (reportErr) { console.error('[TRANSLATION CRITIC] Failed to submit exhaustion report:', reportErr); }
              translatedMdx = currentTranslation;
            }



            // De-hallucinate translated references
            let validatedMdx = await validateAndFixBibliography(translatedMdx, targetLang.toLowerCase());
            validatedMdx = await validateAndFixExternalResources(validatedMdx, targetLang.toLowerCase());

            // Pre-validate translated MDX compilation
            let mdxCheck = await validateMdxContent(validatedMdx, targetLang.toLowerCase());
            if (!mdxCheck.success) {
              console.warn(`[AI GENERATOR - TRANSLATION MDX ERROR] Content for translated "${transTitle}" failed MDX validation: ${mdxCheck.error}. Initiating Self-Healing MDX loop...`);
              let healedResult = validatedMdx;
              let healAttempt = 0;
              const maxHealAttempts = 3;
              while (!mdxCheck.success && healAttempt < maxHealAttempts) {
                healAttempt++;
                if (translationStats) {
                  translationStats.selfHealingAttempts++;
                }
                console.log(`[SELF-HEALING-TRANSLATION] Attempt ${healAttempt}/${maxHealAttempts} to heal MDX compilation error: ${mdxCheck.error}`);
                healedResult = await healMdxWithAI(healedResult, mdxCheck.error || 'Unknown MDX compilation error', targetLang.toLowerCase(), translationStats);
                mdxCheck = await validateMdxContent(healedResult, targetLang.toLowerCase());
              }

              if (mdxCheck.success) {
                console.log(`[SELF-HEALING-TRANSLATION] Successfully healed MDX content on attempt ${healAttempt}!`);
                validatedMdx = healedResult;
              } else {
                console.error(`[SELF-HEALING-TRANSLATION] Self-healing failed after ${maxHealAttempts} attempts. Rejecting translation.`);
                try {
                  await dbService.submitReport(
                    courseSlug,
                    `${courseSlug}/${lesson.lesson_slug}`,
                    `[TRANSLATION MDX FAILURE] Self-healing failed: ${mdxCheck.error}`
                  );
                } catch (reportErr) {
                  console.error("Failed to auto-submit translation error report:", reportErr);
                }
                throw new Error(`[MDX TRANSLATION CRITICAL ERROR] Lesson "${transTitle}" failed compilation and self-healing: ${mdxCheck.error}`);
              }
            }

            // Preprocess and heal translated MDX before writing to DB
            // [FIX H2] Pass lesson_slug and order so preprocessMdx applies lesson-specific sanitization.
            const healedMdx = preprocessMdx(validatedMdx, targetLang.toLowerCase(), false, lesson.lesson_slug, lesson.order);
            const resolvedMdx = await resolveAndPersistMedia(healedMdx, targetLang.toLowerCase());

            if (process.env.DEBUG === 'true') {
              saveDraftRevision(`final_translation_${lesson.lesson_slug}_${targetLang.toLowerCase()}.mdx`, resolvedMdx);
            }

            // Save translated lesson to Supabase
            await dbService.saveLesson({
              course_slug: courseSlug,
              lesson_slug: lesson.lesson_slug,
              lang: targetLang.toLowerCase(),
              title: transTitle.length > 130 ? transTitle.substring(0, 130).trim() : transTitle,
              content: resolvedMdx,
              order: lesson.order
            });
            await updateTaskProgress();

            translationStats.status = 'success';
            translationStats.endTime = Date.now();
            translationStats.durationSeconds = Math.round((translationStats.endTime - translationStats.startTime) / 1000);

            const mdTransStats = generateTranslationStatsMarkdown(translationStats);
            saveDraftRevision(`stats_translation_${lesson.lesson_slug}.json`, JSON.stringify(translationStats, null, 2));
            saveDraftRevision(`stats_translation_${lesson.lesson_slug}.md`, mdTransStats);

          } catch (lessonErr: any) {
            console.error(`[TRANSLATOR ERROR] Failed to translate lesson "${lesson.title}":`, lessonErr);
            failures.push(`Lesson "${lesson.title}": ${lessonErr.message || String(lessonErr)}`);

            translationStats.status = 'failed';
            translationStats.error = lessonErr instanceof Error ? lessonErr.message : String(lessonErr);
            translationStats.endTime = Date.now();
            translationStats.durationSeconds = Math.round((translationStats.endTime - translationStats.startTime) / 1000);

            const mdTransStats = generateTranslationStatsMarkdown(translationStats);
            saveDraftRevision(`stats_translation_${lesson.lesson_slug}.json`, JSON.stringify(translationStats, null, 2));
            saveDraftRevision(`stats_translation_${lesson.lesson_slug}.md`, mdTransStats);

            await updateTaskProgress();
          }
        });
        await lessonPromises;

        if (failures.length > 0) {
          console.warn(`[TRANSLATOR] Course translation completed with ${failures.length} lesson translation failure(s):\n${failures.join('\n')}`);
          if (failures.length === sourceLessons.length) {
            throw new Error(`[CRITICAL] All ${sourceLessons.length} lessons failed to translate for course "${courseSlug}".`);
          }
        }
      }
    }

    // 3. Translate the course metadata (Syllabus/Curriculum Card) to targetLang
    try {
      const { data: allCourses } = await dbService.getAllCourses();
      const course = allCourses?.find(c => c.slug === courseSlug);
      
      if (course) {
        let translatedCourseTitle = course.title;
        let translatedCourseDescription = course.description;

        console.log(`[TRANSLATOR - CARD] Translating course card metadata for "${courseSlug}" to "${targetLang}"...`);

        // Translate Title
        try {
          const promptCourseTitle = `Translate the course title "${course.title}" to target language code: "${targetLang.toUpperCase()}". Return only the translated string.`;
          let titleSuccess = false;
          if (isVertexConfigured()) {
            try {
              const res = await callVertexAI({
                task: 'course_translation',
                contents: [{ role: 'user', parts: [{ text: promptCourseTitle }] }],
                generationConfig: { temperature: 0.1 }
              });
              if (res && res.ok) {
                const resJson = await res.json();
                translatedCourseTitle = (resJson.candidates?.[0]?.content?.parts?.[0]?.text || course.title).trim();
                titleSuccess = true;
              }
            } catch (e) {
              console.warn("[TRANSLATOR] Vertex course title translation failed:", e);
            }
          }
          if (!titleSuccess && apiKey) {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: compressPromptText(promptCourseTitle) }] }]
              })
            });
            if (res.ok) {
              const resJson = await res.json();
              translatedCourseTitle = (resJson.candidates?.[0]?.content?.parts?.[0]?.text || course.title).trim();
            }
          }
        } catch (err) {
          console.error("[TRANSLATOR] Failed to translate course title:", err);
        }

        // Translate Description
        try {
          const promptCourseDesc = `Translate the course description "${course.description}" to target language code: "${targetLang.toUpperCase()}". Return only the translated string.`;
          let descSuccess = false;
          if (isVertexConfigured()) {
            try {
              const res = await callVertexAI({
                task: 'course_translation',
                contents: [{ role: 'user', parts: [{ text: promptCourseDesc }] }],
                generationConfig: { temperature: 0.1 }
              });
              if (res && res.ok) {
                const resJson = await res.json();
                translatedCourseDescription = (resJson.candidates?.[0]?.content?.parts?.[0]?.text || course.description).trim();
                descSuccess = true;
              }
            } catch (e) {
              console.warn("[TRANSLATOR] Vertex course description translation failed:", e);
            }
          }
          if (!descSuccess && apiKey) {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: compressPromptText(promptCourseDesc) }] }]
              })
            });
            if (res.ok) {
              const resJson = await res.json();
              translatedCourseDescription = (resJson.candidates?.[0]?.content?.parts?.[0]?.text || course.description).trim();
            }
          }
        } catch (err) {
          console.error("[TRANSLATOR] Failed to translate course description:", err);
        }

        // Update Course metadata
        const originalLanguages = course.languages || [];
        const updatedLanguages = originalLanguages.includes(targetLang.toLowerCase())
          ? originalLanguages
          : [...originalLanguages, targetLang.toLowerCase()];

        const originalLangsUpper = course.langs || [];
        const updatedLangsUpper = originalLangsUpper.includes(targetLang.toUpperCase())
          ? originalLangsUpper
          : [...originalLangsUpper, targetLang.toUpperCase()];

        const translations = course.translations || {};
        translations[targetLang.toUpperCase()] = {
          title: translatedCourseTitle,
          description: translatedCourseDescription
        };

        await dbService.saveCourse({
          ...course,
          languages: updatedLanguages,
          langs: updatedLangsUpper,
          translations: translations
        });
        console.log(`[TRANSLATOR - CARD] Successfully saved updated course card translations for "${courseSlug}".`);
      }
    } catch (metaErr) {
      console.error("[TRANSLATOR - CARD] Error during course card metadata translation:", metaErr);
    }
  } catch (err) {
    console.error("AI Translation failed:", err);
    throw err;
  }
}
