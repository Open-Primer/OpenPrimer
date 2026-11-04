import { validateAndFixBibliography } from '@/lib/ai/validator/citationValidator';
import { preprocessMdx } from '@/lib/content';
import { extractCustomFigures } from '@/lib/ai/engines/deduplicationHelpers';
import { areMediaSimilar } from './deduplicationHelpers';
import fs from 'fs';
import path from 'path';
import { dbService } from '../../db';
import { supabaseAdmin } from '../../supabase';
import { cleanPathSegment, formatCourseLevel } from '../../translations';
import { resolveAndPersistMedia } from '../../media-resolver';
import { stitchLessonContent } from '../stitcher';
import { validateAndFixWidgets } from '../widget-healer';
import { validateAndFixExternalResources } from '../resource-validator';
import { deduplicateLessonWidgetsAndReferences } from './deduplicationHelpers';
import { validateMdxContent } from './mdxValidator';
import { healMdxWithAI } from './mdxHealer';
import { saveDraftRevision } from './coreUtils';
import { generateStatsMarkdown } from './statsGenerators';

export async function persistLesson(
  item: any,
  lessonIdx: number,
  lessonsList: any[],
  courseName: string,
  correctedCourseName: string,
  level: string,
  discipline: string,
  targetLang: string,
  parsedWidgets: any,
  approvedNarrativeText: string,
  isTerminalEvaluation: boolean,
  courseReferences: any[],
  prunedCatalog: Record<string, any>,
  stats: any,
  lessonDbWidgetIds: Set<string>,
  taskId?: string,
  appendTaskLog?: (msg: string) => Promise<void>
): Promise<void> {
  const log = appendTaskLog || (async (m) => console.log(m));
  let globalDbWidgetCount = 0;
  const courseContext: any = { discipline };
  const realIndex = item.originalIndex !== undefined ? item.originalIndex : lessonIdx;
  const originalSyllabusLessonsLength = lessonsList.length;
  const sharedCourseInteractiveComponents: any[] = [];
  const usedMediaRegistry: Array<{ type: string; description: string; title?: string; caption?: string }> = [];

  const updateTaskProgress = async (lessonTitle: string) => {
    const currentProgress = 20 + Math.floor(((lessonIdx + 1) / (lessonsList.length || 1)) * 70);
    await log(`[AI GENERATOR] Finished lesson "${lessonTitle}" (${lessonIdx + 1}/${lessonsList.length}). Progress: ${currentProgress}%.`);
    if (!taskId) return;
    try {
      await supabaseAdmin
        .from('task_queue')
        .update({ progress: Math.min(99, currentProgress) })
        .eq('id', taskId);
    } catch (err) {
      console.warn(`[PROGRESS UPDATE ERROR] Failed to update task ${taskId} progress:`, err);
    }
  };
  const lessonStats: any = {
    lessonIndex: lessonIdx + 1,
    title: item.title,
    slug: item.slug,
    tokenMetrics: { promptTokens: 0, candidateTokens: 0, totalTokens: 0 },
    externalCalls: { youtubeSearches: 0, wikimediaAudio: 0, wikidataQueries: 0, webSearches: 0 },
    selfHealingAttempts: 0,
    mediaResolved: { figures: 0, youtubeVideos: 0, wikimediaAudios: 0 },
    finalEvaluationQuestions: 0
  };
  try {
      // --- Programmatic Curation-First budget & normalization ---
      const dbCatalogKeys = Object.keys(prunedCatalog);
      if (parsedWidgets && Array.isArray(parsedWidgets.interactiveComponents)) {
        let databaseWidgetsInThisLesson = 0;
        parsedWidgets.interactiveComponents = parsedWidgets.interactiveComponents.filter((comp: any) => {
          if (!comp || !comp.componentType) return false;

          const matchedKey = dbCatalogKeys.find(
            key => key.toLowerCase() === comp.componentType.toLowerCase() || key.toLowerCase() === comp.id?.toLowerCase()
          );

          if (matchedKey) {
            const noPropsWidgets = new Set(['StructureViewer3D', 'QuantumOrbitalExplorer', 'DynamicSimulation', 'ChemicalStoichiometry', 'BasicMathExplorer']);
            const isDatabaseCurated = noPropsWidgets.has(matchedKey);

            const isDuplicate = lessonDbWidgetIds.has(matchedKey);
            const isOverBudget = (globalDbWidgetCount + databaseWidgetsInThisLesson) >= 2;

            if (isDatabaseCurated && (isDuplicate || isOverBudget)) {
              console.log(`[WIDGET CURATION] Filtered out database widget "${matchedKey}" (Duplicate: ${isDuplicate}, OverBudget: ${isOverBudget})`);
              return false;
            }

            comp.componentType = matchedKey;
            if (isDatabaseCurated) {
              comp.id = matchedKey;
              comp.props = {};
              databaseWidgetsInThisLesson++;
              lessonDbWidgetIds.add(matchedKey);
              globalDbWidgetCount++; // [FIX G12] cross-lesson atomic counter
            }
            log(`[WIDGET CURATION] Selected and approved widget: "${matchedKey}" (Database Curated: ${isDatabaseCurated})`);
            return true;
          }

          return true;
        });
      }

      parsedWidgets = await validateAndFixWidgets(parsedWidgets, courseContext.discipline || correctedCourseName, targetLang);

      const { widgets: dedupedWidgets, narrativeMdx: dedupedMdx } = await deduplicateLessonWidgetsAndReferences(
        cleanPathSegment(correctedCourseName),
        item.slug,
        parsedWidgets,
        approvedNarrativeText,
        targetLang,
        sharedCourseInteractiveComponents
      );
      parsedWidgets = dedupedWidgets;
      approvedNarrativeText = dedupedMdx;

      // [STAGE 3] DETERMINISTIC STITCHING ENGINE
      // ───────────────────────────────────────────────────────────────
      await log(`[AI GENERATOR - INVERTED] [STAGE 3] Stitching narrative and widgets programmatically...`);
      const isLastLesson = realIndex === originalSyllabusLessonsLength - 1;
      let currentMdx = stitchLessonContent(approvedNarrativeText, parsedWidgets, isTerminalEvaluation);

      // De-hallucinate bibliography links against Crossref / Google Books
      let validatedMdx = await validateAndFixBibliography(currentMdx, targetLang.toLowerCase());
      validatedMdx = await validateAndFixExternalResources(validatedMdx, targetLang.toLowerCase());

      let mdxWithFrontmatter = `---
title: "${item.title}"
subject: "${correctedCourseName}"
level: "${level}"
module: "${item.title}"
order: ${realIndex + 1}${isLastLesson ? '\nsummative: true' : ''}
---

${validatedMdx}`;


      // Apply preprocessMdx BEFORE validation so common AI-generation issues
      // (bare & in JSX attrs, unescaped braces, etc.) are fixed deterministically
      mdxWithFrontmatter = preprocessMdx(mdxWithFrontmatter, targetLang.toLowerCase(), false, item.slug);

      // Pre-validate MDX compilation to avoid 404 or compilation crashes
      let mdxCheck = await validateMdxContent(mdxWithFrontmatter, targetLang.toLowerCase());
      if (!mdxCheck.success) {
        try {
          const fs = require('fs');
          const path = require('path');
          fs.writeFileSync(path.resolve(process.cwd(), `failed_mdx_${item.slug}.md`), mdxWithFrontmatter, 'utf8');
          console.log(`[DEBUG] Wrote failed MDX to failed_mdx_${item.slug}.md`);
        } catch (debugErr) {
          console.error("Failed to write debug MDX file:", debugErr);
        }
        console.warn(`[AI GENERATOR - MDX VALIDATION ERROR] Content for "${item.title}" failed MDX validation: ${mdxCheck.error}. Initiating Self-Healing MDX loop...`);
        let healedResult = mdxWithFrontmatter;
        let healAttempt = 0;
        const maxHealAttempts = 3;
        while (!mdxCheck.success && healAttempt < maxHealAttempts) {
          healAttempt++;
          lessonStats.selfHealingAttempts++;
          console.log(`[SELF-HEALING] Attempt ${healAttempt}/${maxHealAttempts} to heal MDX compilation error: ${mdxCheck.error}`);
          healedResult = await healMdxWithAI(healedResult, mdxCheck.error || 'Unknown MDX compilation error', targetLang.toLowerCase(), lessonStats);
          mdxCheck = await validateMdxContent(healedResult, targetLang.toLowerCase());
        }

        if (mdxCheck.success) {
          console.log(`[SELF-HEALING] Successfully healed MDX content on attempt ${healAttempt}!`);
          mdxWithFrontmatter = healedResult;
        } else {
          console.error(`[SELF-HEALING] Self-healing failed after ${maxHealAttempts} attempts. Rejecting lesson generation to avoid fallback/broken rendering.`);
          try {
            const fs = require('fs');
            const path = require('path');
            fs.writeFileSync(path.resolve(process.cwd(), `failed_mdx_final_${item.slug}.md`), healedResult, 'utf8');
            console.log(`[DEBUG] Wrote final failed MDX to failed_mdx_final_${item.slug}.md`);
          } catch (debugErr) {
            console.error("Failed to write debug MDX file:", debugErr);
          }
          try {
            const cleanCrsSlug = cleanPathSegment(correctedCourseName);
            await dbService.submitReport(
              cleanCrsSlug,
              `${cleanCrsSlug}/${item.slug}`,
              `[GENERATION MDX FAILURE] Self-healing failed: ${mdxCheck.error}`
            );
          } catch (reportErr) {
            console.error("Failed to auto-submit generation error report:", reportErr);
          }
          throw new Error(`[MDX COMPILATION CRITICAL ERROR] Lesson "${item.title}" failed MDX compilation and self-healing: ${mdxCheck.error}`);
        }
      }

      // Re-run preprocessMdx on the (potentially AI-healed) final content to ensure
      // any content regenerated by the self-healing loop is also fully sanitized.
      const healedMdx = preprocessMdx(mdxWithFrontmatter, targetLang.toLowerCase(), false, item.slug);
      const resolvedMdx = await resolveAndPersistMedia(healedMdx, targetLang.toLowerCase());

      // Parse custom figures and add to global registry for deduplication
      try {
        const figures = extractCustomFigures(resolvedMdx);
        for (const fig of figures) {
          const isDup = usedMediaRegistry.some(existing => areMediaSimilar(existing, fig));
          if (!isDup) {
            usedMediaRegistry.push(fig);
          }
        }
      } catch (err) {
        console.warn(`[MEDIA DEDUPLICATION] Failed to parse and register figures for lesson "${item.title}":`, err);
      }

      // Save to Supabase
      await dbService.saveLesson({
        course_slug: cleanPathSegment(correctedCourseName),
        lesson_slug: item.slug,
        lang: targetLang.toLowerCase(),
        title: item.title.length > 130 ? item.title.substring(0, 130).trim() : item.title,
        content: resolvedMdx,
        order: realIndex + 1
      });
      await updateTaskProgress(item.title);

      // Record success status & final saves
      lessonStats.status = 'success';
      lessonStats.endTime = Date.now();
      lessonStats.durationSeconds = Math.round((lessonStats.endTime - lessonStats.startTime) / 1000);

      saveDraftRevision(`final_stage1_narrative_${item.slug}.md`, approvedNarrativeText);
      saveDraftRevision(`final_stage2_widgets_${item.slug}.json`, JSON.stringify(parsedWidgets, null, 2));
      saveDraftRevision(`final_stage3_stitched_${item.slug}.mdx`, resolvedMdx);

      const mdStats = generateStatsMarkdown(lessonStats);
      saveDraftRevision(`stats_${item.slug}.json`, JSON.stringify(lessonStats, null, 2));
      saveDraftRevision(`stats_${item.slug}.md`, mdStats);

    } catch (err: any) {
      lessonStats.status = 'failed';
      lessonStats.error = err instanceof Error ? err.message : String(err);
      lessonStats.endTime = Date.now();
      lessonStats.durationSeconds = Math.round((lessonStats.endTime - lessonStats.startTime) / 1000);

      // Save stats on failure
      const mdStats = generateStatsMarkdown(lessonStats);
      saveDraftRevision(`stats_${item.slug}.json`, JSON.stringify(lessonStats, null, 2));
      saveDraftRevision(`stats_${item.slug}.md`, mdStats);

      throw err;
    }

}

export async function persistCourseCard(
  courseName: string,
  correctedCourseName: string,
  level: string,
  discipline: string,
  targetLang: string,
  lessonsList: any[]
): Promise<{ title: string; slug: string }> {
  const courseSlug = cleanPathSegment(correctedCourseName);
  try {
    const { data: allCourses } = await dbService.getAllCourses();
    const existingCourse = allCourses?.find((c: any) => c.slug === courseSlug);
    
    const courseDescription = `A comprehensive course on ${correctedCourseName} dynamically generated at ${level} level.`;
    const ectsCount = lessonsList.length || 4;
    
    let courseId = existingCourse ? existingCourse.id : undefined;
    if (!courseId && allCourses && allCourses.length > 0) {
      const maxId = Math.max(...allCourses.map((c: any) => typeof c.id === 'number' ? c.id : parseInt(c.id) || 0));
      courseId = maxId + 1;
    } else if (!courseId) {
      courseId = Math.floor(Math.random() * 1000) + 20;
    }

    const updatedLanguages = existingCourse
      ? (existingCourse.languages?.includes(targetLang.toLowerCase()) ? existingCourse.languages : [...(existingCourse.languages || []), targetLang.toLowerCase()])
      : [targetLang.toLowerCase()];

    const updatedLangsUpper = existingCourse
      ? (existingCourse.langs?.includes(targetLang.toUpperCase()) ? existingCourse.langs : [...(existingCourse.langs || []), targetLang.toUpperCase()])
      : [targetLang.toUpperCase()];

    const translations = existingCourse?.translations || {};
    translations[targetLang.toUpperCase()] = {
      title: correctedCourseName,
      description: courseDescription
    };

    await dbService.saveCourse({
      id: courseId,
      title: correctedCourseName,
      slug: courseSlug,
      subject: discipline || "General",
      description: courseDescription,
      level: level,
      archivingLevel: 0,
      ects: ectsCount,
      is_active: true,
      languages: updatedLanguages,
      langs: updatedLangsUpper,
      isCurriculum: false,
      childCourses: [],
      translations: translations
    });
    console.log(`[AI GENERATOR] Saved/Updated course card for "${correctedCourseName}" (ID: ${courseId}, ECTS: ${ectsCount}, Languages: ${updatedLanguages.join(', ')})`);
  } catch (saveErr) {
    console.error("[AI GENERATOR] Failed to save/update course card:", saveErr);
  }
  return { title: correctedCourseName, slug: courseSlug };
}
