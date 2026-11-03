import fs from 'fs';
import path from 'path';
import { dbService } from '../../db';
import { resolveAndPersistMedia } from '../../media-resolver';
import { stitchLessonContent } from '../stitcher';
import { validateAndFixWidgets } from '../widget-healer';
import { validateAndFixExternalResources } from '../resource-validator';
import { healMdxWithAI } from './mdxHealer';
import { validateMdxContent } from './mdxValidator';
import { saveDraftRevision } from './coreUtils';

export async function persistRevisedLesson(
  lesson: any,
  currentMdx: string,
  targetLang: string = 'fr',
  courseSlug: string,
  lessonIdx: number,
  lessonsListLength: number,
  approved: boolean,
  critique: any
): Promise<string> {
    // Run verification/validation and self-healing loop
    let validatedMdx = await validateAndFixBibliography(revisedMdx, targetLang.toLowerCase());
    validatedMdx = await validateAndFixExternalResources(validatedMdx, targetLang.toLowerCase());

    // Pre-validate MDX compilation
    let mdxCheck = await validateMdxContent(validatedMdx, targetLang.toLowerCase());
    if (!mdxCheck.success) {
      console.warn(`[REVISION AGENT - MDX ERROR] Revised content for "${lesson.title}" failed MDX validation: ${mdxCheck.error}. Initiating Self-Healing MDX loop...`);
      let healedResult = validatedMdx;
      let healAttempt = 0;
      const maxHealAttempts = 3;
      while (!mdxCheck.success && healAttempt < maxHealAttempts) {
        healAttempt++;
        console.log(`[SELF-HEALING-REVISION] Attempt ${healAttempt}/${maxHealAttempts} to heal MDX compilation error: ${mdxCheck.error}`);
        healedResult = await healMdxWithAI(healedResult, mdxCheck.error || 'Unknown MDX compilation error', targetLang.toLowerCase());
        mdxCheck = await validateMdxContent(healedResult, targetLang.toLowerCase());
      }

      if (mdxCheck.success) {
        console.log(`[SELF-HEALING-REVISION] Successfully healed MDX content on attempt ${healAttempt}!`);
        validatedMdx = healedResult;
      } else {
        console.error(`[SELF-HEALING-REVISION] Self-healing failed after ${maxHealAttempts} attempts. Rejecting revision.`);
        try {
          await dbService.submitReport(
            courseSlug,
            `${courseSlug}/${slug}`,
            `[REVISION MDX FAILURE] Self-healing failed: ${mdxCheck.error}`
          );
        } catch (reportErr) {
          console.error("Failed to auto-submit revision error report:", reportErr);
        }
        throw new Error(`[MDX REVISION CRITICAL ERROR] Lesson "${lesson.title}" failed compilation and self-healing: ${mdxCheck.error}`);
      }
    }

    // Preprocess and heal MDX before writing to DB
    // [FIX H2] Pass slug and lesson.order so preprocessMdx applies lesson-specific rules.
    const healedMdx = preprocessMdx(validatedMdx, targetLang.toLowerCase(), false, slug, lesson.order);
    const resolvedMdx = await resolveAndPersistMedia(healedMdx, targetLang.toLowerCase());

    // Save back to DB
    await dbService.saveLesson({
      course_slug: courseSlug,
      lesson_slug: slug,
      lang: targetLang.toLowerCase(),
      title: lesson.title.length > 130 ? lesson.title.substring(0, 130).trim() : lesson.title,
      content: resolvedMdx,
      order: lesson.order
    });

    console.log(`[REVISION AGENT] Successfully revised and saved lesson: "${lesson.title}" (${slug})`);
    return validatedMdx;
  }

export async function runSystemicRevisionAudit(
  feedbackText: string,
  affectedSlugs: string[]
): Promise<{
  revisedSlugs: string[];
  isSystemic: boolean;
  systemicReason: string;
}> {
  let isSystemic = false;
  let systemicReason = "Defaulting to non-systemic (language-specific) unless identified as conceptual or structural.";

  const promptSystemic = `You are a Pedagogical Auditor.
Analyze the following course revision feedback/motive:
"${feedbackText}"

Determine if this feedback relates to a systemic issue that should be propagated to all other language versions of the course (e.g., conceptual error, scientific/mathematical formula error, incorrect tags, empty examples, structural formatting issue).
If it is a local language-specific issue (e.g., translation correction, spelling mistake, grammar typo specific to the language "${targetLang}"), it should NOT be propagated.

Return a valid JSON object with the following fields:
{
  "isSystemic": true or false,
  "reason": "A brief explanation of why this affects or does not affect other languages"
}
Return ONLY the raw JSON object. Do not wrap it in markdown blockticks (\`\`\`).`;

  let analysisRaw = '{"isSystemic":false,"reason":""}';
  let analysisSuccess = false;

  if (isVertexConfigured()) {
    try {
      const res = await callVertexAI({
        task: 'course_generation',
        contents: [{ role: 'user', parts: [{ text: promptSystemic }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: systemicAnalysisSchema
        }
      });
      if (res && res.ok) {
        const jsonRes = await res.json();
        analysisRaw = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{"isSystemic":false,"reason":""}';
        analysisSuccess = true;
      }
    } catch (e) {
      console.warn(`[REVISION AGENT] Vertex AI systemic analysis failed:`, e);
    }
  }

  if (!analysisSuccess && apiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: compressPromptText(promptSystemic) }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: systemicAnalysisSchema
          }
        })
      });
      if (res.ok) {
        const jsonRes = await res.json();
        analysisRaw = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{"isSystemic":false,"reason":""}';
        analysisSuccess = true;
      }
    } catch (e) {
      console.error(`[REVISION AGENT] AI Studio systemic analysis failed:`, e);
    }
  }

  try {
    const cleanedAnalysis = analysisRaw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedAnalysis);
    isSystemic = !!parsed.isSystemic;
    systemicReason = parsed.reason || "";
  } catch (e) {
    console.error(`[REVISION AGENT] Failed to parse systemic analysis JSON: "${analysisRaw}"`, e);
  }

  console.log(`[REVISION AGENT] Systemic audit results: isSystemic = ${isSystemic}, Reason = "${systemicReason}"`);

  return {
    revisedSlugs: affectedSlugs,
    isSystemic,
    systemicReason
  };
}
