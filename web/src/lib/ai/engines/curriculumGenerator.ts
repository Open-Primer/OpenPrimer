import { callVertexAI } from '@/lib/vertex-client';
import { dbService } from '../../db';
import { curriculumSchema } from '../schemas';

export async function generateCurriculum(curriculumName: string, levelInput: string, targetLang: string = 'en') {
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

  const promptCurriculum = `You are a Curriculum Planner Agent (Agent 0). Your goal is to structure a full academic curriculum for "${curriculumName}" at the level "${getDescriptiveLevelForPrompt(level)}".
You must model this curriculum on real-world academic programs (curriculums and syllabus guidelines from schools and universities) for this specific discipline and level, ensuring they reflect natural and realistic educational paths:

1. **Primary, Middle, and High School Levels (K-12: foundation_1, foundation_2, secondary_1, secondary_2, preuni):**
   - **Integrated Grade-Level Curriculum:** At school levels, curricula are not divided into highly specialized, isolated courses. Instead, students follow a unified, comprehensive annual course (e.g., "Mathematics Grade 9", "Biology & Geology Grade 10") that covers multiple key branches.
   - **Balanced Subject Coverage:** Your curriculum should structure courses that represent the general annual subjects or clear progressive units of that grade level, covering topics in a logical, balanced sequence (e.g., alternating between algebra, geometry, and functions for a high school math curriculum).
   - **Spiral Progression:** Design the courses to respect spiral learning—revisiting core themes at increasing levels of depth, explicitly building upon what was learned in previous school years.
   - **Simplicity & Scope:** Keep the number of courses/modules modest (typically 1 to 5 main units or modules representing the annual program).

2. **Higher Education / University Levels (L1, L2, L3, M1, M2):**
   - **First Year (L1 / Bachelor 1):** Curricula must consist of **broad, introductory, and foundational courses** (e.g., "Introduction to Classical Mechanics", "Foundations of Organic Chemistry", "General Sociology") to establish core concepts, terminology, and historical context across the entire discipline. Avoid any premature narrow specialization.
   - **Gradual Specialization (L2, L3):** Curricula transition to focused sub-fields and formal methodology (e.g., "Thermodynamics", "Electromagnetism") with increased academic rigor, proofs, and critical model evaluation.
   - **Master's and Expert Levels (M1, M2):** Curricula must shift entirely to **highly specialized, advanced research-grade, or professional courses** focusing on narrow, cutting-edge topics (e.g., "Relativistic Quantum Electrodynamics", "Synaptic Plasticity & Memory Consolidation", "Phenomenology of Perception"). Do not include broad, general, or general-introduction courses at the Master's level.

Be flexible:
- Adjust the number of courses (typically between 1 and 5 for school levels, and between 5 and 15 courses for university levels) and credit/hour volumes based on the actual complexity and standard requirements of the level and discipline.
- Categorize courses as either "mandatory" or "optional" (use exactly these literal strings "mandatory" or "optional"). Note that some curricula may consist entirely of mandatory courses (0 optional courses) if that aligns with standard program progressions.

**CRITICAL LANGUAGE REQUIREMENT**: Although these instructions and guidelines are given in English, you must imperatively write all the text content of your JSON response (the curriculum 'description', the course 'title', 'subject', 'volume', and course 'description') in the requested target language: "${targetLang.toUpperCase()}". All generated descriptive text and labels must be fully written in "${targetLang.toUpperCase()}".

You must return a valid JSON object with the following keys:
1. "description": A comprehensive, high-quality, professional academic description of the entire curriculum (master-level description). Do not use generic placeholders.
2. "courses": A JSON array of course objects, where each object represents a constituent course/module and has the following keys:
   - "title": The title of the course.
   - "subject": The subject/discipline (e.g. "Biology", "Mathematics", "Philosophy").
   - "volume": The estimated volume or hours (e.g. "30 hours").
   - "type": Must be either "mandatory" or "optional".
   - "description": A detailed, course-level descriptive summary detailing the goals, scope, and key topics of this specific course.

Return ONLY a valid JSON object. Do not include markdown code block backticks around the JSON.`;

  let rawJson = '';
  try {
    if (isVertexConfigured()) {
      console.log(`[AI CURRICULUM] Generating curriculum for "${curriculumName}" via Vertex AI...`);
      const res = await callVertexAI({
        task: 'course_generation',
        contents: [{ role: 'user', parts: [{ text: promptCurriculum }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: curriculumSchema
        }
      });
      if (res && res.ok) {
        const jsonRes = await res.json();
        rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      }
    } else if (apiKey) {
      console.log(`[AI CURRICULUM] Generating curriculum for "${curriculumName}" via AI Studio fallback (gemini-3.5-flash-lite)...`);
      const startTime = Date.now();
      try {
        const compressedCurriculum = compressPromptText(promptCurriculum);
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: compressedCurriculum }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
              responseSchema: curriculumSchema
            }
          })
        });
        if (res.ok) {
          const jsonRes = await res.json();
          rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

          const durationMs = Date.now() - startTime;
          const usage = jsonRes.usageMetadata || {};
          const promptTokens = usage.promptTokenCount || 0;
          const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
          await recordMetrics('course_generation', 'gemini-3.5-flash-lite', durationMs, promptTokens, candidatesTokens, compressedCurriculum);
        }
      } catch (err) {
        console.error("[AI CURRICULUM] AI Studio curriculum generation fetch exception:", err);
      }
    }

    if (!rawJson) {
      console.warn("[AI CURRICULUM] AI model failed to generate curriculum. Generating mock curriculum.");
      rawJson = JSON.stringify({
        description: `Structured curriculum for "${curriculumName}". Constituent modules planned. Synthesized by Episteme.`,
        courses: [
          { title: `Introduction to ${curriculumName}`, subject: "General", volume: "15 hours", type: "mandatory", description: "Foundational concepts" },
          { title: `Core Methods in ${curriculumName}`, subject: "Core", volume: "30 hours", type: "mandatory", description: "Core methodological framework" },
          { title: `Advanced Topics in ${curriculumName}`, subject: "Advanced", volume: "30 hours", type: "optional", description: "Optional specialized topics" }
        ]
      });
    }

    const cleanedJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
    let parsedData: unknown;
    try {
      parsedData = safeJsonParse(cleanedJson, 'getStructuredLessonContext (Curriculum Structure)');
    } catch (e) {
      console.warn("Failed to parse AI curriculum JSON, trying to recover standard array...");
      throw e;
    }

    let masterDescription = `Structured curriculum for "${curriculumName}". Constituent modules planned. Synthesized by Episteme.`;
    let coursesList: { title: string; subject: string; volume: string; type: string; description: string }[] = [];

    if (Array.isArray(parsedData)) {
      coursesList = parsedData;
    } else if (parsedData && typeof parsedData === 'object') {
      const dataObj = parsedData as Record<string, unknown>;
      masterDescription = (dataObj.description as string) || masterDescription;
      coursesList = (dataObj.courses as { title: string; subject: string; volume: string; type: string; description: string }[]) || [];
    }

    const curriculumId = `cur_${(Date.now() % 1000000000) + Math.floor(Math.random() * 1000)}`;
    const curriculumSlug = curriculumName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s_-]/g, '')
      .trim()
      .replace(/\s+/g, '_');

    // Fetch current queue
    const { data: currentQueue } = await dbService.getPipelineQueue();
    const newTasks = coursesList.map((c, index) => {
      const taskUuid = `task_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 5)}`;
      return {
        id: taskUuid,
        title: c.title,
        type: 'generation',
        status: 'queued',
        progress: 0,
        priority: 'High',
        timestamp: new Date().toISOString(),
        details: `Course Generation from Curriculum (${c.type.toUpperCase()} - ${c.volume}): Level ${level}, Subject "${c.subject}", Language ${targetLang}`,
        targetLang: targetLang,
        level: level,
        subject: c.subject,
        parentCurriculumSlug: curriculumSlug,
        courseType: c.type,
        volume: c.volume,
        description: c.description || `Dynamic sovereign course on "${c.title}".`
      };
    });

    // Save tasks to queue
    await dbService.savePipelineQueue([...(currentQueue || []), ...newTasks]);

    // Save Curriculum entry
    await dbService.saveCourse({
      id: curriculumId,
      title: curriculumName,
      slug: curriculumSlug,
      subject: coursesList[0]?.subject || 'General',
      description: masterDescription,
      level: level,
      archivingLevel: 0,
      badge: 'badge_1',
      modulesCount: coursesList.length,
      lessonsCount: coursesList.length * 4,
      is_active: true,
      languages: [targetLang.toLowerCase()],
      langs: [targetLang.toUpperCase()],
      isCurriculum: true,
      childCourses: [],
      translations: {
        [targetLang.toUpperCase()]: {
          title: curriculumName,
          description: masterDescription
        }
      }
    });

  } catch (error) {
    console.error("[generateCurriculum] Error in Agent 0 execution:", error);
    throw error;
  }
}
