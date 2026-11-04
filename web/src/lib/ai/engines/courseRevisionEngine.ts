import { isVertexConfigured, compressPromptText } from '@/lib/vertex-client';
import { apiKey } from './revisionCriticStep';
import { supabaseAdmin, supabase } from '@/lib/supabase';
import { slugsArraySchema } from '@/lib/ai/schemas/systemicSchemas';
import { revisionQualificationSchema } from './aiSchemas';
import { parseMarkdownSections, MarkdownSection, reconstructMarkdown } from '@/lib/ai/engines/sectionBasedTranslation';
import { healNarrativeCitations } from '@/lib/ai/engines/deduplicationHelpers';
import fs from 'fs';
import path from 'path';
import { dbService } from '../../db';
import { cleanPathSegment } from '../../translations';
import { callVertexAI } from '@/lib/vertex-client';
import { preprocessMdx } from '@/lib/content';
import { safeJsonParse } from './coreUtils';
import { runRevisionCritic } from './revisionCriticStep';
import { persistRevisedLesson } from './revisionPersistenceStep';

export async function reviseCourseContent(courseSlug: string, revisionDetails: string, targetLang: string = 'en') {
  console.log(`[REVISION AGENT] Starting revision for course: "${courseSlug}" (Lang: ${targetLang})`);
  console.log(`[REVISION AGENT] Original Details: "${revisionDetails}"`);

  try {
  // [FIX A7] Revision engine — mirrors generation engine but logs metrics for dashboard analytics.
  let revisionPromptTokens = 0;
  let revisionOutputTokens = 0;
  const callAIEngine = async (
    promptText: string,
    schema?: any,
    temperature: number = 0.2,
    frequencyPenalty?: number,
    topP?: number,
    isJsonMode: boolean = false
  ): Promise<string> => {
    const generationConfig: any = { 
      temperature,
      maxOutputTokens: 8192
    };
    if (frequencyPenalty !== undefined) {
      generationConfig.frequencyPenalty = frequencyPenalty;
    }
    if (topP !== undefined) {
      generationConfig.topP = topP;
    }
    if (schema) {
      generationConfig.responseMimeType = "application/json";
      generationConfig.responseSchema = schema;
    } else if (isJsonMode || promptText.toLowerCase().includes('json') || promptText.toLowerCase().includes('schema')) {
      generationConfig.responseMimeType = "application/json";
    }

    if (isVertexConfigured()) {
      try {
        const res = await callVertexAI({
          task: 'course_generation',
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
          generationConfig
        });
        if (res && res.ok) {
          const resJson = await res.json();
          const revText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const revUsage = resJson.usageMetadata || {};
          revisionPromptTokens += revUsage.promptTokenCount || 0;
          revisionOutputTokens += revUsage.candidatesTokenCount || revUsage.candidateTokenCount || 0;
          return revText;
        }
      } catch (e) {
        console.warn(`[REVISION AGENT - VERTEX] Vertex AI call failed:`, e);
      }
    }

    if (apiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: compressPromptText(promptText) }] }],
            generationConfig
          })
        });
        if (res.ok) {
          const resJson = await res.json();
          return resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch (e) {
        console.error(`[REVISION AGENT - STUDIO] AI Studio call failed:`, e);
      }
    }

    return '';
  };

  // 1. Fetch untreated feedbacks for this course slug to compile and evaluate them
  let untreatedFeedbacks: any[] = [];
  try {
    const { data: fdb, error: fdbError } = await supabaseAdmin
      .from('course_feedbacks')
      .select('*')
      .eq('is_treated', false);
      
    if (!fdbError && fdb) {
      const targetCanonical = courseSlug.toLowerCase().replace(/_/g, '-');
      untreatedFeedbacks = fdb.filter((f: any) => {
        const fCanonical = (f.course_id || '').toLowerCase().replace(/_/g, '-');
        return fCanonical === targetCanonical;
      });
    }
  } catch (err) {
    console.warn("[REVISION AGENT] Failed to fetch untreated feedbacks:", err);
  }

  const feedbackText = untreatedFeedbacks.length > 0
    ? `Original Trigger: ${revisionDetails}\n\nAll Untreated Feedbacks to address:\n` + 
      untreatedFeedbacks.map((f, i) => `${i + 1}. [Rating: ${f.rating} stars] comment: "${f.comment}"`).join('\n')
    : revisionDetails;

  console.log(`[REVISION AGENT] Compiled feedback to address:\n${feedbackText}`);

  // 2. Clean up report clusters and mark course feedbacks as resolved immediately
  console.log(`[REVISION AGENT] Marking course feedbacks as resolved and cleaning up report clusters for course "${courseSlug}"...`);
  try {
    if (untreatedFeedbacks.length > 0) {
      const idsToUpdate = untreatedFeedbacks.map(f => f.id);
      const { error: updateFeedbacksErr } = await supabaseAdmin
        .from('course_feedbacks')
        .update({ is_treated: true })
        .in('id', idsToUpdate);
        
      if (updateFeedbacksErr) {
        console.warn(`[REVISION AGENT] Warning updating course_feedbacks status:`, updateFeedbacksErr.message);
      }
    } else {
      const { error: updateFeedbacksErr } = await supabaseAdmin
        .from('course_feedbacks')
        .update({ is_treated: true })
        .eq('course_id', courseSlug);
        
      if (updateFeedbacksErr) {
        console.warn(`[REVISION AGENT] Warning updating course_feedbacks status (fallback):`, updateFeedbacksErr.message);
      }
    }
    
    // Fetch and delete matching report clusters case-insensitively
    const { data: clusters, error: fetchErr } = await supabaseAdmin
      .from('report_clusters')
      .select('id, course');
      
    if (fetchErr) {
      console.warn(`[REVISION AGENT] Warning fetching report_clusters for deletion:`, fetchErr.message);
    } else if (clusters) {
      const targetSlugLower = courseSlug.toLowerCase();
      const targetTitleLower = courseSlug.replace(/_/g, ' ').toLowerCase();
      
      const idsToDelete = clusters
        .filter((c: any) => {
          if (!c.course) return false;
          const courseLower = c.course.toLowerCase();
          const courseSlugLower = cleanPathSegment(c.course).toLowerCase();
          return courseLower === targetTitleLower || 
                 courseSlugLower === targetSlugLower ||
                 courseLower === targetSlugLower;
        })
        .map((c: any) => c.id);
        
      if (idsToDelete.length > 0) {
        console.log(`[REVISION AGENT] Deleting report clusters with IDs:`, idsToDelete);
        const { error: deleteErr } = await supabaseAdmin
          .from('report_clusters')
          .delete()
          .in('id', idsToDelete);
          
        if (deleteErr) {
          console.warn(`[REVISION AGENT] Warning deleting report_clusters by ID:`, deleteErr.message);
        }
      }
    }
    console.log(`[REVISION AGENT] Cleaned up all report clusters and feedbacks for "${courseSlug}".`);
  } catch (cleanErr) {
    console.error(`[REVISION AGENT] Error cleaning up feedbacks/reports:`, cleanErr);
  }

  // 2. Fetch lessons for this course slug
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', courseSlug)
    .eq('lang', targetLang.toLowerCase());

  if (lessonsError) {
    console.error(`[REVISION AGENT] Failed to fetch lessons:`, lessonsError.message);
    throw lessonsError;
  }

  if (!lessons || lessons.length === 0) {
    console.warn(`[REVISION AGENT] No lessons found for course "${courseSlug}" in language "${targetLang}".`);
    return;
  }

  console.log(`[REVISION AGENT] Found ${lessons.length} lessons. Analyzing which lessons are affected...`);

  // 3. Ask AI to analyze which lessons are affected
  const promptIdentify = `You are a Pedagogical Architect/Revision Planner.
We have a course "${courseSlug}" with the following lessons:
${lessons.map(l => `- Slug: "${l.lesson_slug}", Title: "${l.title}"`).join('\n')}

Feedback / Bug report to address:
"${feedbackText}"

Please analyze which of these lessons need to be revised to fix this issue.
Return a valid JSON array of lesson slugs that should be revised. For example: ["lesson_slug_1", "lesson_slug_2"].
If the feedback is general or you are not sure, or if it applies to multiple lessons, return all affected lesson slugs.
If no lesson is affected, return an empty array [].
Return ONLY the raw JSON array. Do not wrap it in markdown blockticks (\`\`\`).`;

  let identifyRaw = '[]';
  let identifySuccess = false;

  if (isVertexConfigured()) {
    try {
      const res = await callVertexAI({
        task: 'course_generation',
        contents: [{ role: 'user', parts: [{ text: promptIdentify }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: slugsArraySchema
        }
      });
      if (res && res.ok) {
        const jsonRes = await res.json();
        identifyRaw = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        identifySuccess = true;
      }
    } catch (e) {
      console.warn(`[REVISION AGENT] Vertex AI identify failed:`, e);
    }
  }

  if (!identifySuccess && apiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: compressPromptText(promptIdentify) }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: slugsArraySchema
          }
        })
      });
      if (res.ok) {
        const jsonRes = await res.json();
        identifyRaw = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        identifySuccess = true;
      }
    } catch (e) {
      console.error(`[REVISION AGENT] AI Studio identify failed:`, e);
    }
  }

  let affectedSlugs: string[] = [];
  let parseFailed = false;
  try {
    const cleaned = identifyRaw.replace(/```json/g, '').replace(/```/g, '').trim();
    affectedSlugs = safeJsonParse(cleaned, 'translateCourseContent (Revision affected slugs)');
  } catch (e) {
    console.error(`[REVISION AGENT] Failed to parse affected slugs JSON: "${identifyRaw}". Defaulting to all lessons.`, e);
    affectedSlugs = lessons.map(l => l.lesson_slug);
    console.warn('[REVISION AGENT R2/A16] Parse failed — falling back to all-lesson revision. Slug validation skipped.');
    parseFailed = true;
  }

  if (!parseFailed) {
    // [FIX R2/A16] Only validate slugs when the parser succeeded (not on the all-lessons fallback).
    const validLessonSlugs = new Set(lessons.map(l => l.lesson_slug));
    const invalidSlugs = affectedSlugs.filter(s => !validLessonSlugs.has(s));
    if (invalidSlugs.length > 0) {
      console.warn(`[REVISION AGENT] Dropping ${invalidSlugs.length} unrecognized slug(s): ${invalidSlugs.join(', ')}`);
      affectedSlugs = affectedSlugs.filter(s => validLessonSlugs.has(s));
    }
  }

  const revisedSlugs = affectedSlugs;

  if (affectedSlugs.length === 0) {
    console.log(`[REVISION AGENT] No lessons identified for revision.`);
    return { revisedSlugs: [], isSystemic: false, systemicReason: 'No lessons affected.' };
  }

  console.log(`[REVISION AGENT] Lessons identified for revision: ${affectedSlugs.join(', ')}`);

  // 4. For each affected lesson, revise it
  const lessonsList = lessons;
  for (let lessonIdx = 0; lessonIdx < affectedSlugs.length; lessonIdx++) {
    const slug = affectedSlugs[lessonIdx];
    const lesson = lessons.find(l => l.lesson_slug === slug);
    if (!lesson) continue;
    const discipline = (lesson as any).discipline || '';
    const level = (lesson as any).level || '';
    const cleanTitle = (lesson as any).title || '';

    console.log(`[REVISION AGENT] Initiating revision sequence for lesson: "${lesson.title}" (${slug})...`);

    // STEP 1: Syntax Preprocessor (Auto-healing syntax before LLMs see it)
    console.log(`[REVISION AGENT] Running Syntax Preprocessor to sanitize source MDX...`);
    const cleanLessonContent = preprocessMdx(lesson.content, targetLang.toLowerCase(), false, lesson.lesson_slug, lesson.order);

    // STEP 2: Agent Qualificateur (Agent 5 - Diagnosing feedback & scoping revision)
    console.log(`[REVISION AGENT - AGENT 5] Qualifying lesson feedbacks and determining scope...`);
    const promptQualify = `You are a world-class educational curriculum architect and Qualifying Agent (Agent 5).
Your task is to analyze a lesson's current MDX content and the compilation of user feedbacks/comments to diagnose errors, moderate the feedback, and determine the exact scope and targets of revision.

COURSE SLUG: "${courseSlug}"
LESSON TITLE: "${lesson.title}"
FEEDBACKS / COMMENTS:
"${feedbackText}"

CURRENT MDX CONTENT:
---
${cleanLessonContent}
---

Your mission:
1. Moderate and verify the feedbacks: determine which comments are valid and which are not.
2. Formulate a summary pre-critique report detailing the exact changes that need to be made, and identify if there are any other latent issues to fix.
3. Classify the scope of revision:
   - "global": If the lesson has catastrophic issues, or the user gave a very poor rating pointing to global issues, or the feedback requests a complete structural, tone, or level adjustment across the entire lesson.
   - "local": If the feedback only targets specific sections (e.g. "Fix the Euler equation in section 2"), specific quizzes, or specific widgets.
4. Extract the precise targets that need modification. For each target, specify:
   - "type": "section", "quiz", or "widget".
   - "id": For a section, its exact markdown heading (e.g. "## Introduction"). For quizzes/widgets, their specific ID (e.g. "quiz_1", "biography_einstein").
   - "heading": The markdown heading of the section where this item resides.
   - "feedback": Specific local revision instructions for this item.

You must output ONLY a valid JSON object matching this schema:
{
  "scope": "global" | "local",
  "preCritique": "Detailed pre-critique and diagnosis guidelines...",
  "affectedItems": [
    {
      "type": "section" | "quiz" | "widget",
      "id": "item_id_or_heading",
      "heading": "heading_of_enclosing_section",
      "feedback": "specific instructions for this item"
    }
  ]
}
Return ONLY the raw JSON. Do NOT wrap it in markdown code blocks.`;

    const qualificationText = await callAIEngine(promptQualify, revisionQualificationSchema, 0.1);
    let qualification = { scope: 'local', preCritique: '', affectedItems: [] as any[] };
    try {
      const cleaned = qualificationText.replace(/```json/g, '').replace(/```/g, '').trim();
      qualification = safeJsonParse(cleaned, 'reviseCourseContent (Agent 5 qualification)');
    } catch (e) {
      console.error(`[REVISION AGENT] Failed to parse qualification JSON: "${qualificationText}". Defaulting to local scope.`, e);
      // [FIX R1] Include feedbackText so Agent 3 has actionable guidance even if Agent 5's JSON failed.
      qualification = {
        scope: 'global',
        preCritique: `Could not parse qualification from Agent 5. Applying global rewrite based on original feedback:\n\n${feedbackText}`,
        affectedItems: []
      };
    }

    console.log(`[REVISION AGENT] Qualified scope for "${lesson.title}": "${qualification.scope.toUpperCase()}"`);

    let revisedMdx = '';

    // STEP 3: Scoped Execution Strategies
    if (qualification.scope === 'global') {
      console.log(`[REVISION AGENT] Performing section-by-section global revision...`);
      const parsedSections = parseMarkdownSections(cleanLessonContent);
      const revisedSections: MarkdownSection[] = [];
      let precedingContext = 'None. This is the first section.';

      for (let sIdx = 0; sIdx < parsedSections.length; sIdx++) {
        const sec = parsedSections[sIdx];
        console.log(`[REVISION AGENT] Glob-revision of section ${sIdx + 1}/${parsedSections.length}: "${sec.heading || 'Header / Introduction'}"...`);

        const promptSectionRevise = `You are Scribe (Agent 3), a professional academic writer.
We are performing a global revision of the lesson "${lesson.title}". We are revising it section-by-section.

COURSE SLUG: "${courseSlug}"
LESSON TITLE: "${lesson.title}"
LANGUAGE: "${targetLang.toUpperCase()}"

GLOBAL DIAGNOSIS / PRE-CRITIQUE:
"${qualification.preCritique}"

CURRENT SECTION HEADING: "${sec.heading || 'Header / Introduction Block'}"
CURRENT SECTION CONTENT:
${sec.content}

CONTEXT (Preceding section generated text):
${precedingContext}

INSTRUCTIONS:
1. Revise the content of this section to fully address the global diagnosis/pre-critique.
2. Maintain high academic density, rigor, and the target language of the lesson.
3. If the heading is empty, this is the header/frontmatter block of the lesson. You must ONLY revise any prose or prerequisites/objectives text, and you must strictly preserve the "---" boundaries and YAML frontmatter at the very top.
4. ABSOLUTE PROHIBITION ON RAW INTERACTIVE OR CUSTOM JSX/HTML TAGS. Absolutely no custom JSX/HTML tags (such as <ConceptLink>, <RealPerson>, <Glossary>, etc.) are allowed inline in prose. Exclusively use [[WIDGET:id]] anchors. For references/citations, you MUST exclusively use [[WIDGET:Reference:num]] (e.g. [[WIDGET:Reference:1]]) instead of any HTML/JSX markup or brackets.
5. Preserve all existing [[WIDGET:id]] anchors exactly as they are in the current content.
6. Return ONLY the revised section content. Do NOT include markdown code block wrappers or conversational text outside.`;

        const revisedSecContent = await callAIEngine(promptSectionRevise, null, 0.35, 0.25, 0.85);
        revisedSections.push({
          heading: sec.heading,
          content: revisedSecContent.trim()
        });
        precedingContext = revisedSecContent.slice(-2000);
      }

      revisedMdx = reconstructMarkdown(revisedSections);
      revisedMdx = healNarrativeCitations(revisedMdx);
    } else {
      console.log(`[REVISION AGENT] Performing targeted local revision...`);
      const parsedSections = parseMarkdownSections(cleanLessonContent);

      for (const item of qualification.affectedItems) {
        const headingToFind = (item.heading || '').trim().toLowerCase();
        const secIndex = parsedSections.findIndex(s => {
          const sHeadingNorm = (s.heading || 'Header / Introduction Block').trim().toLowerCase();
          return sHeadingNorm === headingToFind || 
                 sHeadingNorm.replace(/^##\s+/, '') === headingToFind.replace(/^##\s+/, '');
        });

        if (secIndex === -1) {
          console.warn(`[REVISION AGENT] Section matching "${item.heading}" not found for item type "${item.type}". Skipping local item.`);
          continue;
        }

        const sec = parsedSections[secIndex];

        if (item.type === 'section') {
          console.log(`[REVISION AGENT] Revising section narrative: "${sec.heading || 'Header / Introduction'}"...`);
          const promptLocalSec = `You are Scribe (Agent 3), a professional academic writer.
We need to revise a specific section of the lesson "${lesson.title}" to resolve local feedback.

LESSON TITLE: "${lesson.title}"
HEADING: "${sec.heading || 'Header / Introduction Block'}"
LOCAL REVISION FEEDBACK:
"${item.feedback}"

CURRENT CONTENT of this section:
${sec.content}

INSTRUCTIONS:
1. Revise the content of this section to address the local feedback.
2. Maintain high academic density, rigor, and target language.
3. If the heading is empty, preserve the frontmatter.
4. ABSOLUTE PROHIBITION ON RAW INTERACTIVE OR CUSTOM JSX/HTML TAGS. Use [[WIDGET:id]] anchors and [[WIDGET:Reference:num]] for citations.
5. Return ONLY the revised section content.`;

          const revisedSecContent = await callAIEngine(promptLocalSec, null, 0.35, 0.25, 0.85);
          sec.content = revisedSecContent.trim();
        } else if (item.type === 'quiz') {
          console.log(`[REVISION AGENT] Isolating and revising quiz with ID "${item.id}"...`);
          const quizRegex = new RegExp(`<Quiz\\b[^>]*?id=["']${item.id}["'][^>]*?>[\\s\\S]*?<\\/Quiz>`, 'i');
          const quizMatch = sec.content.match(quizRegex);
          if (quizMatch) {
            const quizElement = quizMatch[0];
            const promptQuiz = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
We need to revise a quiz component in the lesson "${lesson.title}" to resolve specific feedback.

QUIZ TAG:
${quizElement}

FEEDBACK:
"${item.feedback}"

INSTRUCTIONS:
1. Edit the questions, options, explanations, or correct indices in the quiz props/options to resolve the feedback.
2. Return ONLY the revised JSX quiz tag (e.g. <Quiz ...>...</Quiz>). Do NOT wrap in markdown code blocks.`;

            const revisedQuiz = await callAIEngine(promptQuiz, null, 0.2);
            sec.content = sec.content.replace(quizElement, revisedQuiz.trim());
          } else {
            console.warn(`[REVISION AGENT] Quiz with ID "${item.id}" not found in section "${sec.heading}".`);
            // [FIX R4] Submit error report so operators know the quiz target was not located.
            try {
              await dbService.submitReport(courseSlug, `${courseSlug}/${slug}`,
                `[LOCAL REVISION] Quiz ID "${item.id}" not found in section "${sec.heading}" of lesson "${lesson.title}". Skipped.`);
            } catch (_) {}
          }
        } else if (item.type === 'widget') {
          console.log(`[REVISION AGENT] Isolating and revising widget with ID "${item.id}"...`);
          // [FIX R3] Escape item.id to prevent SyntaxError on IDs with metacharacters.
          const escapedWidgetId = String(item.id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const widgetRegex = new RegExp('<(\\w+)\\b[^>]*?id=["\']' + escapedWidgetId + '["\'][^>]*?/?>', 'i');
          const widgetMatch = sec.content.match(widgetRegex);
          if (widgetMatch) {
            const widgetElement = widgetMatch[0];
            const promptWidget = `You are a world-class educational curriculum architect (Agent 3B - Widgets Architect).
We need to revise a custom widget tag in the lesson "${lesson.title}" to resolve specific feedback.

WIDGET TAG:
${widgetElement}

FEEDBACK:
"${item.feedback}"

INSTRUCTIONS:
1. Adjust the props of the widget to address the feedback.
2. Return ONLY the revised JSX widget tag. Do NOT wrap in markdown code blocks.`;

            const revisedWidget = await callAIEngine(promptWidget, null, 0.2);
            sec.content = sec.content.replace(widgetElement, revisedWidget.trim());
          } else {
            console.warn(`[REVISION AGENT] Widget with ID "${item.id}" not found in section "${sec.heading}".`);
            // [FIX R4] Submit error report so operators know the widget target was not located.
            try {
              await dbService.submitReport(courseSlug, `${courseSlug}/${slug}`,
                `[LOCAL REVISION] Widget ID "${item.id}" not found in section "${sec.heading}" of lesson "${lesson.title}". Skipped.`);
            } catch (_) {}
          }
        }
      }

      revisedMdx = reconstructMarkdown(parsedSections);
      revisedMdx = healNarrativeCitations(revisedMdx);
    }

    if (!revisedMdx) {
      console.warn(`[REVISION AGENT] Could not revise lesson "${lesson.title}", skipping.`);
      continue;
    }


      // Run Revision Critic Step (Agent 4)
      const { currentMdx, approved, critique } = await runRevisionCritic(
        lesson,
        revisedMdx,
        feedbackText,
        targetLang,
        lessonIdx,
        lessonsList.length,
        discipline,
        level,
        cleanTitle
      );

      // Persist Revised Lesson
      await persistRevisedLesson(
        lesson,
        currentMdx,
        targetLang,
        courseSlug,
        lessonIdx,
        lessonsList.length,
        approved,
        critique
      );
    }
  } catch (err) {
    console.error("AI Revision failed:", err);
    throw err;
  }
}
