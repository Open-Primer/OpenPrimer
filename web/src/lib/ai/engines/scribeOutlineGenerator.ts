import { getDescriptiveLevelForPrompt } from '@/lib/ai/engines/coreUtils';
import { saveDraftRevision, safeJsonParse } from './coreUtils';
import { lessonOutlineSchema, outlineAuditSchema } from './aiSchemas';

export async function generateLessonOutlineStep(
  item: any,
  courseName: string,
  correctedCourseName: string,
  level: string,
  discipline: string,
  targetLang: string,
  callAIEngine: any,
  log: (msg: string) => Promise<void>
): Promise<any> {
  const levelInput = level;
  const courseContext = { discipline, courseName, correctedCourseName, level };
        // --- 1. JIT Lesson Outline Generation & Critique ---
        await log(`[AI GENERATOR - INVERTED] [STAGE 1-A] Generating JIT outline plan for lesson "${item.title}"...`);
        const outlinePrompt = `You are the Lesson Planner Agent. Your job is to design the chapter outline/plan for the lesson:
Course: "${correctedCourseName}"
Level: "${getDescriptiveLevelForPrompt(levelInput)}"
Lesson Title: "${item.title}"
Lesson Description/Technical Depth: "${item.technicalDepth || 'N/A'}"
Discipline: "${courseContext.discipline || 'General'}"
Target Language: "${targetLang.toUpperCase()}"

Generate a list of 4 to 6 logical chapters/sections for this lesson, including an Introduction and a Conclusion.
For each section, provide a clear heading title (starting with "## ") and a short explanation of what Scribe should write in that section.
Do NOT write the content of the lesson, only the plan/structure.

You must return ONLY a valid JSON object matching the lessonOutlineSchema schema:
\`\`\`json
{
  "sections": [
    {
      "heading": "## Title of the Section",
      "description": "Pedagogical guidelines for this section"
    }
  ]
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.`;

        let lessonOutlineObj: any = null;
        let outlineApproved = false;
        let outlineIteration = 0;
        const maxOutlineIterations = 3;
        let currentOutlinePrompt = outlinePrompt;

        while (!outlineApproved && outlineIteration < maxOutlineIterations) {
          outlineIteration++;
          let outlineRaw = await callAIEngine(currentOutlinePrompt, lessonOutlineSchema, 0.1);
          let cleanOutline = outlineRaw.replace(/```json/gi, '').replace(/```/gi, '').trim();
          let parsedOutline: any = null;
          try {
            parsedOutline = safeJsonParse(cleanOutline, 'JIT Lesson Outline Parsing');
          } catch (e) {
            await log(`[AI GENERATOR] JIT Outline JSON parsing failed: ${String(e)}. Retrying...`);
            continue;
          }

          // Critique the outline
          await log(`[AI GENERATOR] Critiquing outline for lesson "${item.title}" (Attempt #${outlineIteration})...`);
          const outlineCriticPrompt = `You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
${JSON.stringify(parsedOutline, null, 2)}

Ensure:
1. The progression is pedagogically sound for the level "${getDescriptiveLevelForPrompt(levelInput)}".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "${item.technicalDepth || 'N/A'}".

Return ONLY a valid JSON object matching the outlineAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
\`\`\`
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.`;

          if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage1_outline_${item.slug}_iter${outlineIteration}.md`, currentOutlinePrompt); // [FIX G4/G5]
          if (process.env.DEBUG === 'true') saveDraftRevision(`draft_stage1_outline_${item.slug}_iter${outlineIteration}.json`, outlineRaw); // [FIX G4/G5]
          if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage1_outline_critique${item.slug}_iter${outlineIteration}.md`, outlineCriticPrompt); // [FIX G4/G5]

          let outlineCritiqueStr = await callAIEngine(outlineCriticPrompt, outlineAuditSchema, 0.1);
          // [FIX G6] Warn when critic call returns empty (both AI services unavailable).
          if (!outlineCritiqueStr || !outlineCritiqueStr.trim()) {
            console.warn(`[AI GENERATOR WARNING] Outline critic call returned empty for "${item.title}" iter #${outlineIteration}. Quality check skipped.`);
          }
          if (process.env.DEBUG === 'true') saveDraftRevision(`critique_stage1_outline${item.slug}_iter${outlineIteration}.json`, outlineCritiqueStr); // [FIX G4/G5]
          let cleanCritique = outlineCritiqueStr.replace(/```json/gi, '').replace(/```/gi, '').trim();
          let outlineCritique = { approved: true, critique: '' };
          try {
            outlineCritique = safeJsonParse(cleanCritique, 'Outline Critique Parsing');
          } catch (e) {
            console.warn(`[AI GENERATOR] Failed to parse outline critique JSON:`, e);
          }

          if (outlineCritique.approved) {
            await log(`[AI GENERATOR] Outline plan approved by Critique Agent on iteration #${outlineIteration}!`);
            lessonOutlineObj = parsedOutline;
            outlineApproved = true;
          } else {
            await log(`[AI GENERATOR WARNING] Outline REJECTED. Critique: "${outlineCritique.critique}". Retrying outline generation...`);
            currentOutlinePrompt = `${outlinePrompt}
            
=============================================================================
🚨 OUTLINE CRITIQUE FROM PREVIOUS ATTEMPT 🚨
"${outlineCritique.critique}"
=============================================================================`;
          }
        }

        if (!lessonOutlineObj || !lessonOutlineObj.sections) {
          await log(`[AI GENERATOR WARNING] Outline plan failed critique validation. Fallback to default outline.`);
          lessonOutlineObj = {
            sections: [
              { heading: "## Introduction", description: "Introduction to the topic" },
              { heading: "## Core Concepts", description: "First core concept explanations" },
              { heading: "## Advanced Mechanism", description: "Deep dive mechanics and models" },
              { heading: "## Conclusion", description: "Summary and conclusion of the lesson" }
            ]
          };
        }

        // Export outline
        saveDraftRevision(`jit_outline_${item.slug}.json`, JSON.stringify(lessonOutlineObj, null, 2));


  return lessonOutlineObj;
}
