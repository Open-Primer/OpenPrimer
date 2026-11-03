import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '../../supabase';
import { cleanPathSegment, normalizeLevel } from '../../translations';
import { correctCourseTitle } from './titleCorrection';
import {
  saveDraftRevision,
  safeJsonParse,
  validateSchema,
  getDescriptiveLevelForPrompt,
  initializeConstraints
} from './coreUtils';
import { syllabusSchema } from './aiSchemas';

export async function runSyllabusGeneration(
  courseName: string,
  levelInput: string,
  targetLang: string = 'en',
  taskId?: string,
  appendTaskLog?: (msg: string) => Promise<void>,
  callAIEngine?: any
): Promise<{
  correctedCourseName: string;
  discipline: string;
  syllabus: any;
  level: string;
}> {
  const log = appendTaskLog || (async (m) => console.log(m));

  const correctedCourseName = await correctCourseTitle(courseName, targetLang, true);
  await log(`[TITLE CORRECTION] Corrected course title from "${courseName}" to "${correctedCourseName}"`);

  const normalizeLevel = (lvl: string): string => {
    if (!lvl) return 'beginner';
    const clean = lvl.trim().toLowerCase();
    if (clean === 'l1') return 'L1';
    if (clean === 'l2') return 'L2';
    if (clean === 'l3') return 'L3';
    if (clean === 'm1') return 'M1';
    if (clean === 'm2') return 'M2';
    const standards = ['foundation_1', 'foundation_2', 'secondary_1', 'secondary_2', 'preuni_1', 'preuni_2', 'preuni_3', 'beginner', 'intermediate', 'advanced', 'expert'];
    const found = standards.find(s => s === clean);
    if (found) return found;
    return clean;
  };
  const level = normalizeLevel(levelInput);

  await initializeConstraints();
  await log(`[CONSTRAINTS] Loaded academic level constraints from database.`);

  let extra: any = {};
  if (taskId) {
    try {
      const { data: taskData, error: taskError } = await supabaseAdmin
        .from('task_queue')
        .select('description')
        .eq('id', taskId)
        .single();
      if (!taskError && taskData?.description) {
        extra = JSON.parse(taskData.description || '{}');
      }
    } catch (err) {
      console.warn(`[AI GENERATOR WARNING] Failed to retrieve task description in pre-prompt load:`, err);
    }
  }

  const discipline = extra.subject || 'General';
  const volume = extra.volume || '15h';

  const constraintKey = getConstraintKeyForLevel(levelInput);
  const constraint = loadedConstraints[constraintKey] || DEFAULT_LEVEL_CONSTRAINTS[constraintKey] || DEFAULT_LEVEL_CONSTRAINTS.university_undergrad;

  const disciplineGuidelines = getDisciplinePedagogicalGuidelines(correctedCourseName, discipline);

  let syllabusRefsMin = 5;
  let syllabusRefsMax = 8;
  if (constraintKey === 'university_grad') {
    syllabusRefsMin = 15;
    syllabusRefsMax = 20;
  } else if (constraintKey === 'university_undergrad') {
    syllabusRefsMin = 10;
    syllabusRefsMax = 15;
  }

  // 1. Generate syllabus (lesson titles and slugs)
  const promptSyllabus = `You are the Primary Pedagogical Architect Agent (Agent 1 & 2).
Your mission is to design the structure, lesson titles, and cognitive strategy of the course titled "${correctedCourseName}" for the level "${getDescriptiveLevelForPrompt(level)}". You do not write the course content; you construct its pure, highly-adapted computational and educational backbone.

An anatomy course is not structured like an algebraic topology or political philosophy course. You MUST adapt the skeleton of the course to the epistemological DNA of the discipline, the target audience's age (from Primary School to Bachelor/University Year 3), and the course's hourly volume.

---

# STEP 1: PARAMETERS AND COGNITIVE DNA
The following parameters are fixed *a priori* and must guide your architecture:
- **Course Title:** "${correctedCourseName}"
- **Target Level:** "${getDescriptiveLevelForPrompt(level)}"
- **Discipline:** "${discipline}"
- **Discipline Category Profile:** "${disciplineGuidelines.category}"
- **Hourly Volume:** "${volume}"
- **Target Language:** "${targetLang}"

${disciplineGuidelines.pedagogicalStylePrompt}

Before generating any chapters, classify the target discipline according to its style of validation, evidence, and knowledge transmission. Select and apply the dominant matrix from the following options:

1. **Deductive / Formal Sciences (Mathematics, Logic, Theoretical Physics):**
   * Focus: Absolute rigor, seamless causal chain.
   * Obligatory components: Lemma ➔ Theorem ➔ Proof ➔ Corollary. Every block must flow logically from the previous one.

2. **Empirical / Experimental Sciences (Biology, Experimental Physics, Chemistry):**
   * Focus: Real-world observation, visual dual-coding.
   * Obligatory components: Hypothesis ➔ Experimental Protocol ➔ Observation/Data ➔ Interpretation/Modeling. Pervasive use of labeled diagrams, structural schemas, or anatomical atlases.

3. **Humanities and Discursive Sciences (Philosophy, History, Literature):**
   * Focus: Rhetoric, problematization, dialectic.
   * Obligatory components: Thesis ➔ Antithesis ➔ Synthesis (or genealogical/conceptual approach). Fine text analysis, socio-historical contextualization, doctrinal controversies.

4. **Applied Sciences / Engineering (Computer Science, Systems Architecture, Electronics):**
   * Focus: Problem-solving, design patterns, constructivism.
   * Obligatory components: Requirements gathering ➔ Technical constraints ➔ Architecture specifications ➔ Implementation/Code ➔ Validation tests.

---

# STEP 2: AUDIENCE AND VOLUME ADAPTATION (COGNITIVE GRADATION AND STRUCTURE)
The quantity, granularity, and depth of the chapters must be strictly proportional to the target level and the hourly volume of "${volume}":

1. **Primary, Middle, and High School (K-12: from foundation_1 to preuni):**
   * **Real-world Curricular Realism:** In schools, learning does not happen through isolated, hyper-specific courses. If the requested course represents a general annual program, the syllabus must propose a realistic and balanced thematic division covering the main official pillars.
   * **Spiral Learning Progression:** Core concepts are revisited year after year with increasing levels of abstraction. Structure the lessons progressively, explicitly building upon knowledge acquired in previous school years.
   * **Grade-Level Tailoring Matrix for Interactive Sandboxes:**
     Interactive simulator/visualizer suggestions and cognitive artifacts must align to the target grade:
     - Middle School (Primary/Maternelle): Focus on high visual emphasis, gamified challenges, simplified sliders, zero complex algebra symbols. Use visual metaphors (e.g., sharing pizza slices for fractions, balancing scales for basic equations, coloring elements).
     - High School: Balanced representation of equations alongside visual models. Interactive variables mapping to standard physics/math formulas. Use presets aligned with official curricula (e.g., cell division phases, basic Cartesian graphs, ideal gas law, Nernst potentials).
     - University: Full scientific controls, rigorous mathematical formulas, multiple overlays, analytical grids, data export (JSON/CSV). Use sandbox exploration of full wave functions, GHK multi-ion equations, multi-variable simulations, derivative/integral solvers.
   * **Scope & Length Rules:**
     * *Primary School (foundation_1 & foundation_2):* Proportional to low hourly volume (e.g. 1h-3h). Narrative, metaphorical, and inductive approach. Maximum of 3 short items in total (including the Implicit Introduction and Terminal Evaluation).
     * *Middle & High School (secondary_1 & secondary_2):* Proportional to medium hourly volume (e.g. 5h-10h). Gradual transition to formalization, increasing rigor. 4 to 6 distinct items in total.

2. **Higher Education / University (L1 to M2 / from beginner to expert):**
   * Proportional to high hourly volume (e.g. 15h-30h or more).
   * **Grade-Level Tailoring Matrix for Interactive Sandboxes:**
     Propose high-fidelity, research-grade sandbox controls, rigorous mathematical formulas, analytical grids, and multi-variable simulations (e.g., Schrödinger equation laboratory, Hodgkin-Huxley membrane dynamics, multi-function comparison plotters).
   * *First Year (L1 / Bachelor 1st):* Courses must be broad, foundational, and introductory to establish key concepts, universal terminology, and global methodology. EXACTLY 12 distinct content/teaching lessons/chapters, followed by exactly 1 terminal evaluation chapter (total 13 items in the lessons list).
   * *Second & Third Year (L2-L3):* Transition to formal modeling, proofs, and precise sub-branches with strict academic formalism and critical evaluation of model limits. EXACTLY 12 distinct content/teaching lessons/chapters, followed by exactly 1 terminal evaluation chapter (total 13 items in the lessons list).
   * *Master's & Expert Levels (M1-M2 / advanced & expert):* Focus entirely on highly specialized, cutting-edge research topics. Do not include general or introductory courses. EXACTLY 12 distinct content/teaching lessons/chapters, followed by exactly 1 terminal evaluation chapter (total 13 items in the lessons list).

---

# STEP 3: SPECIFIC PEDAGOGICAL STRUCTURE (IMPLICIT INTRODUCTION, DETACHED EVALUATION)
You must follow these strict structural guidelines:

1. **First Lesson (Implicit Introduction - Context & History):**
   * The very first item in the 'lessons' array represents the start of the course. It must **NOT** be forced to use the word "Introduction" or "Introduction to [Subject]" in its title. Be creative and academic!
   * This lesson is naturally introductory. It must present stronger historical, conceptual, or contextual elements explaining *why* there is a subject to treat, its origin, and why it is critical. It must contain real, high-quality academic content, not just generic welcoming text.

2. **Last Lesson (Content with General Conclusion):**
   * The penultimate item in the 'lessons' array (the last core teaching lesson) must be a core content lesson, but its technical depth/description must specify that it also integrates a complete **general conclusion** for the entire course, synthesizing all main lessons and concepts.

3. **Terminal Evaluation (Detached Evaluation Chapter):**
   * The ultimate item in the 'lessons' array must be the Terminal Evaluation (title: "Évaluation Terminale" or "Final Evaluation" or equivalent in the target language "${targetLang}", slug: "evaluation-finale" or "final-evaluation" or "evaluation-terminale").
   * This chapter is **not** a standard lesson. It must contain **only** the assessment/questions/summative validation itself (with no new lesson content, no narrative text, and no core textbook content).

---

# STEP 4: EXPECTED OUTPUT FORMAT
You must output ONLY a valid JSON object structuring the course. The chapter list must be exhaustive and detailed with NO vague placeholders. Each lesson must specify its "cognitiveArtifact" and "technicalDepth".
**CRITICAL LANGUAGE REQUIREMENT**: Instructions are given in English, but you must imperatively generate the actual JSON output values (titles, descriptions, strategies, etc.) in the requested target language: "${targetLang}". Ensure the values of all fields are translated and formatted in "${targetLang}".
Do NOT return markdown code block backticks (\`\`\`). Output only the raw JSON object.


{
  "courseContext": {
    "discipline": "[Input discipline: '${discipline}', translated to ${targetLang.toUpperCase()}]",
    "description": "[Detailed, engaging 2-3 sentence course description, detailing general objectives and target skills, in ${targetLang.toUpperCase()}]",
    "epistemologicalMatrix": "[Deductive / Empirical / Discursive / Engineering, translated to ${targetLang.toUpperCase()}]",
    "targetLevel": "${level}",
    "pedagogicalStrategy": "[Explanation of the strategy adopted for this specific audience, discipline, and hourly volume of ${volume}, in ${targetLang.toUpperCase()}]"
  },
  "lessons": [
{
"title": "[Explicit, engaging title of the lesson/chapter, in ${targetLang.toUpperCase()}]",
"slug": "[URL-friendly ASCII slug]",
"cognitiveArtifact": "[Specify: Lemma Proof / Labeled Anatomical Schema / Text Analysis / Sandbox Code Block, translated to ${targetLang.toUpperCase()}]",
"technicalDepth": "[Expected level of detail to guide the writing agent Agent 3, in ${targetLang.toUpperCase()}]"
}
],
"references": [
"[Authoritative reference 1: Books, landmark papers, or journal articles in standard citation format (Dalloz, APA, MLA, Chicago, etc. depending on discipline), with no asterisks for italics (use quotes or guillemets)]",
"[Authoritative reference 2...]"
]
}

---

# QUALITY CONTROL & STRICT PROHIBITIONS
* **No Generic Outlines or Fillers:** A syllabus outline that uses generic academic blocks (e.g., I. Introduction, II. History, III. Conclusion) is strictly prohibited. The syllabus must be **complete, specific, and highly authentic**, matching a real-world curriculum you would find in actual academic or professional training, without being overly eccentric.
* **Exhaustiveness of Chapters:** You must specify the exact number of distinct lessons appropriate for the level and volume (maximum of 3 for Primary level, 4 to 6 for Middle/High school, and EXACTLY 12 distinct content/teaching lessons plus 1 terminal evaluation chapter for University levels). The writing agent (Agent 3) must have clear, actionable guidelines with zero need for outline extrapolation.
* **Detached Evaluation Content:** Under no circumstances should the Terminal Evaluation contain instructional content. It must focus purely on testing.
* **Mandatory Reference Registry:** You MUST generate a list of EXACTLY ${syllabusRefsMin} to ${syllabusRefsMax} authoritative academic references in the \`references\` array. These must represent the absolute canon of the course's discipline. Do NOT use placeholder references or list generic URLs. They must be formatted strictly according to the citation style of the discipline, but without markdown bold/italics symbols (no asterisks).`;

  try {
    let parsedSyllabus: any = null;
    let lessonsList: { title: string; slug: string; cognitiveArtifact?: string; technicalDepth?: string }[] = [];
    let courseContext: any = {};
    let originalSyllabusLessonsLength = 0;

    const courseSlugForSyllabus = cleanPathSegment(correctedCourseName);
    const localSyllabusPath = path.join(process.cwd(), 'drafts_revisions', `final_stage0_syllabus_${courseSlugForSyllabus}.json`);
    const localDraftSyllabusPath = path.join(process.cwd(), 'drafts_revisions', `draft_stage0_syllabus_${courseSlugForSyllabus}.json`);
    if (fs.existsSync(localSyllabusPath)) {
      await log(`[AI GENERATOR] Found local syllabus file ${localSyllabusPath}. Reusing to preserve customized structure.`);
      parsedSyllabus = JSON.parse(fs.readFileSync(localSyllabusPath, 'utf8'));
    } else if (fs.existsSync(localDraftSyllabusPath)) {
      await log(`[AI GENERATOR] Found local draft syllabus file ${localDraftSyllabusPath}. Reusing to preserve customized structure.`);
      parsedSyllabus = JSON.parse(fs.readFileSync(localDraftSyllabusPath, 'utf8'));
    } else if (taskId && extra && extra.syllabus) {
      await log(`[AI GENERATOR] Found cached syllabus in task description. Reusing to prevent duplicate chapters.`);
      parsedSyllabus = extra.syllabus;
    }

  // If we have a lessonOffset > 0, but no cached syllabus, we have a mismatch hazard!
  // In this case, we reset lessonOffset to 0 and start from scratch to guarantee course consistency.
  if (lessonOffset > 0 && !parsedSyllabus) {
    await log(`[AI GENERATOR WARNING] lessonOffset is ${lessonOffset} but no cached syllabus was found. Resetting offset to 0 to avoid duplicates.`);
    lessonOffset = 0;
  }

  // If lessonOffset is 0, clear any existing lessons for this course and language to avoid duplicates from previous failed runs.
  if (lessonOffset === 0 && !process.env.REGENERATE_CHAPTER_1_ONLY && process.env.ONLY_SECOND_LESSON !== 'true') {
    const cleanSlug = cleanPathSegment(correctedCourseName);
    await log(`[AI GENERATOR] lessonOffset is 0. Clearing existing lessons for course "${cleanSlug}" and language "${targetLang.toLowerCase()}" to prevent duplicate chapters.`);
    try {
      const { error: deleteError } = await supabaseAdmin
        .from('lessons')
        .delete()
        .eq('course_slug', cleanSlug)
        .eq('lang', targetLang.toLowerCase());
      if (deleteError) {
        console.warn(`[AI GENERATOR WARNING] Failed to clear existing lessons: ${deleteError.message}`);
      }
    } catch (err) {
      console.warn(`[AI GENERATOR WARNING] Exception clearing existing lessons:`, err);
    }
  }

  let syllabusRejections = 0;
  let syllabusAttempts = 1;
  if (parsedSyllabus) {
    lessonsList = Array.isArray(parsedSyllabus) ? parsedSyllabus : (parsedSyllabus.lessons || []);
    courseContext = Array.isArray(parsedSyllabus) ? {} : (parsedSyllabus.courseContext || {});
  } else {
    try {
      let rawJson = '';
      let success = false;
      let syllabusApproved = false;
      let syllabusIteration = 0;
      const maxSyllabusIterations = 3;
      let currentSyllabusPrompt = promptSyllabus;

      while (!syllabusApproved && syllabusIteration < maxSyllabusIterations) {
        syllabusIteration++;
        syllabusAttempts = syllabusIteration;
        await log(`[AI GENERATOR] Syllabus generation iteration #${syllabusIteration}...`);
        
        let attemptJson = '';
        let attemptSuccess = false;

        if (isVertexConfigured()) {
          console.log(`[AI GENERATOR] Generating syllabus iteration #${syllabusIteration} for "${courseName}" via Vertex AI (${TASK_MODELS['course_generation']})...`);
          try {
            const res = await callVertexAI({
              task: 'course_generation',
              contents: [{ role: 'user', parts: [{ text: currentSyllabusPrompt }] }],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json"
              }
            });

            if (res && res.ok) {
              const jsonRes = await safeResponseJson(res, 'Vertex course syllabus generation');
              attemptJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
              attemptSuccess = true;
            } else if (res) {
              const errBody = await res.text();
              console.warn(`[AI GENERATOR] Vertex AI syllabus returned status ${res.status}: ${errBody.substring(0, 300)}`);
            }
          } catch (err) {
            console.warn(`[AI GENERATOR] Vertex AI syllabus generation exception.`, err);
          }
        }

        if (!attemptSuccess && apiKey) {
          console.log(`[AI GENERATOR] Generating syllabus iteration #${syllabusIteration} for "${courseName}" via AI Studio fallback (gemini-3.5-flash-lite)...`);
          const startTime = Date.now();
          try {
            const compressedSyllabus = compressPromptText(currentSyllabusPrompt);
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: compressedSyllabus }] }],
                generationConfig: {
                  temperature: 0.1,
                  responseMimeType: "application/json"
                }
              })
            });
            if (res.ok) {
              const jsonRes = await safeResponseJson(res, 'AI Studio syllabus generation fallback');
              attemptJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
              attemptSuccess = true;

              const durationMs = Date.now() - startTime;
              const usage = jsonRes.usageMetadata || {};
              const promptTokens = usage.promptTokenCount || 0;
              const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
              await recordMetrics('course_generation', 'gemini-3.5-flash-lite', durationMs, promptTokens, candidatesTokens, compressedSyllabus);
            } else {
              const errText = await res.text();
              console.error(`[AI GENERATOR] AI Studio syllabus call failed (${res.status}):`, errText);
            }
          } catch (err) {
            console.error(`[AI GENERATOR] AI Studio fetch exception:`, err);
          }
        }

        if (!attemptSuccess || !attemptJson) {
          throw new Error(`[AI GENERATOR CRITICAL ERROR] AI model failed to generate syllabus for course "${correctedCourseName}". Syllabus raw JSON is empty.`);
        }

        const cleanedJson = attemptJson.replace(/```json/g, '').replace(/```/g, '').trim();
        let currentParsedSyllabus = null;
        try {
          currentParsedSyllabus = safeJsonParse(cleanedJson, 'generateCourseContent (Syllabus)');
        } catch (e) {
          await log(`[AI GENERATOR] Syllabus JSON syntax invalid: ${String(e)}. Retrying...`);
          continue;
        }

        // Run syllabus critique
        await log(`[AI GENERATOR] Running Critique on generated syllabus (Iteration #${syllabusIteration})...`);
        const syllabusCriticPrompt = `You are the Syllabus Critique Agent (Agent 1). Your job is to review the syllabus generated by the Pedagogical Architect.
Verify that:
1. The syllabus is completely aligned with the course name: "${correctedCourseName}" and level: "${getDescriptiveLevelForPrompt(level)}".
2. There are no redundant lessons or generic filler lessons.
3. The progression is logical and pedagogically sound.
4. The output matches the syllabusSchema structure.
5. For university-level courses (L1, L2, L3, M1, M2), the syllabus must contain EXACTLY 12 content/teaching chapters/lessons (representing the curriculum) plus exactly 1 terminal evaluation chapter (slug: 'evaluation-terminale' or 'final-evaluation', title: 'Évaluation Terminale' or 'Final Evaluation'), which makes exactly 13 items in total. Reject any syllabus that does not have exactly 13 items (12 teaching + 1 evaluation) for university courses.
6. The title of each lesson MUST NOT exceed 130 characters (to prevent UI truncation and layout instability). Reject any syllabus containing a lesson title longer than 130 characters.

### GENERATED SYLLABUS:
${JSON.stringify(currentParsedSyllabus, null, 2)}

You must return ONLY a valid JSON object matching this schema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
\`\`\`
[REJECT-ONLY REPORTING MANDATE]
If the syllabus is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the syllabus is approved.`;

        let critiqueJsonStr = '';
        let critiqueSuccess = false;

        if (isVertexConfigured()) {
          try {
            const res = await callVertexAI({
              task: 'course_generation',
              contents: [{ role: 'user', parts: [{ text: syllabusCriticPrompt }] }],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
                responseSchema: syllabusAuditSchema
              }
            });
            if (res && res.ok) {
              const jsonRes = await safeResponseJson(res, 'Vertex syllabus critique');
              critiqueJsonStr = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
              critiqueSuccess = true;
            }
          } catch (err) {
            console.warn(`[AI GENERATOR] Vertex AI syllabus critique exception.`, err);
          }
        }

        if (!critiqueSuccess && apiKey) {
          try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: compressPromptText(syllabusCriticPrompt) }] }],
                generationConfig: {
                  temperature: 0.1,
                  responseMimeType: "application/json",
                  responseSchema: syllabusAuditSchema
                }
              })
            });
            if (res.ok) {
              const jsonRes = await safeResponseJson(res, 'AI Studio syllabus critique');
              critiqueJsonStr = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
              critiqueSuccess = true;
            }
          } catch (err) {
            console.error(`[AI GENERATOR] AI Studio critique fetch exception:`, err);
          }
        }

        if (process.env.DEBUG === 'true') { // [FIX G4/G5]
          saveDraftRevision(`prompt_stage0_syllabus_critique_${courseSlugForSyllabus}_iter${syllabusIteration}.md`, syllabusCriticPrompt);
          if (critiqueSuccess && critiqueJsonStr) {
            saveDraftRevision(`critique_stage0_syllabus_${courseSlugForSyllabus}_iter${syllabusIteration}.json`, critiqueJsonStr);
          }
        }

        let critiqueObj = { approved: true, critique: '' };
        if (critiqueSuccess && critiqueJsonStr) {
          try {
            critiqueObj = safeJsonParse(critiqueJsonStr.replace(/```json/g, '').replace(/```/g, '').trim(), 'Syllabus Critique Parsing');
          } catch (e) {
            console.warn(`[AI GENERATOR] Failed to parse syllabus critique JSON:`, e);
          }
        }

        if (critiqueObj.approved) {
          const lessonsToCheck = Array.isArray(currentParsedSyllabus)
            ? currentParsedSyllabus
            : (currentParsedSyllabus?.lessons || []);
          const longTitleLesson = lessonsToCheck.find((l: any) => l.title && l.title.length > 130);
          if (longTitleLesson) {
            critiqueObj.approved = false;
            critiqueObj.critique = `The lesson "${longTitleLesson.title}" has a title of length ${longTitleLesson.title.length}, which exceeds the 130-character limit. Please shorten all lesson titles to be at most 130 characters.`;
          }
        }

        if (critiqueObj.approved) {
          await log(`[AI GENERATOR] Syllabus approved by Critique Agent on iteration #${syllabusIteration}!`);
          rawJson = attemptJson;
          parsedSyllabus = currentParsedSyllabus;
          syllabusApproved = true;
        } else {
          syllabusRejections++;
          await log(`[AI GENERATOR WARNING] Syllabus REJECTED by Critique Agent (rejection #${syllabusRejections}/${maxSyllabusIterations}). Critique: "${critiqueObj.critique}". Retrying generation...`);
          // [FIX G2] Unified cap: break when rejection count reaches the iteration limit.
          if (syllabusRejections >= maxSyllabusIterations) { break; }
          currentSyllabusPrompt = `${promptSyllabus}
          
=============================================================================
🚨 SYLLABUS CRITIQUE FROM PREVIOUS ATTEMPT 🚨
Your previous syllabus draft was REJECTED by the Critique Agent. You MUST correct the following issues in this new generation:
"${critiqueObj.critique}"
=============================================================================`;
        }
      }

      if (!parsedSyllabus) {
        throw new Error(`[AI GENERATOR CRITICAL ERROR] Syllabus failed critique validation after ${maxSyllabusIterations} iterations.`);
      }

      lessonsList = Array.isArray(parsedSyllabus)
        ? parsedSyllabus
        : (parsedSyllabus.lessons || []);
      courseContext = Array.isArray(parsedSyllabus) ? {} : (parsedSyllabus.courseContext || {});

      // Export syllabus prompt, schema, and outputs
      const courseSlug = cleanPathSegment(correctedCourseName);
      if (process.env.DEBUG === 'true') { // [FIX G4/G5]
        saveDraftRevision(`prompt_stage0_syllabus_${courseSlug}.md`, promptSyllabus);
        saveDraftRevision(`agent1_2_syllabus_schema.json`, JSON.stringify(syllabusSchema, null, 2));
        if (rawJson) {
          saveDraftRevision(`draft_stage0_syllabus_${courseSlug}.json`, rawJson);
        }
      }
      if (parsedSyllabus) {
        saveDraftRevision(`final_stage0_syllabus_${courseSlug}.json`, JSON.stringify(parsedSyllabus, null, 2));
      }

      // Save the syllabus to the task description to ensure durability on retries
      if (taskId) {
        try {
          const { data: taskData, error: fetchError } = await supabaseAdmin
            .from('task_queue')
            .select('description')
            .eq('id', taskId)
            .single();
          if (!fetchError && taskData) {
            const extra = JSON.parse(taskData.description || '{}');
            extra.syllabus = parsedSyllabus;
            
            const { error: updateError } = await supabaseAdmin
              .from('task_queue')
              .update({ description: JSON.stringify(extra) })
              .eq('id', taskId);
            if (updateError) {
              console.error(`[AI GENERATOR] Failed to save syllabus to task description:`, updateError.message);
            } else {
              await log(`[AI GENERATOR] Successfully persisted generated syllabus to task description.`);
            }
          }
        } catch (err) {
          console.warn(`[AI GENERATOR WARNING] Failed to persist syllabus to task description:`, err);
        }
      }
    } catch (err) {
      await log(`[AI GENERATOR ERROR] Syllabus generation failed: ${err}`);
      throw err;
    }
    return {
      correctedCourseName,
      discipline,
      syllabus,
      level
    };
  }
}
}
