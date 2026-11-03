import { supabaseAdmin } from '../../supabase';
import { cleanPathSegment } from '../../translations';
import { callVertexAI } from '../vertex-client';
import { generateStatsMarkdown } from './statsGenerators';
import { generateSyllabusStep } from './syllabusArchitect';
import { runScribeStep } from './scribeGenerator';
import { runCraftsmanGenerator } from './craftsmanGenerator';
import { persistLesson, persistCourseCard } from './coursePersistence';
import { getFilteredWidgetsCatalog } from './widgetCatalogHelpers';

export async function generateCourseContent(
  courseName: string,
  levelInput: string,
  targetLang: string = 'en',
  taskId?: string,
  lessonOffset: number = 0
) {
  const appendTaskLog = async (msg: string) => {
    const timestampedMsg = `[${new Date().toISOString()}] ${msg}`;
    console.log(timestampedMsg);
    if (!taskId) return;
    try {
      const { data: currentTask } = await supabaseAdmin
        .from('task_queue')
        .select('logs')
        .eq('id', taskId)
        .single();
      const existingLogs = currentTask?.logs || [];
      await supabaseAdmin
        .from('task_queue')
        .update({ logs: [...existingLogs, timestampedMsg] })
        .eq('id', taskId);
    } catch (err) {
      console.warn(`[LOG UPDATE ERROR] Failed to append log for task ${taskId}:`, err);
    }
  };

  const callAIEngine = async (
    promptText: string,
    schema?: any,
    temperature: number = 0.2,
    frequencyPenalty?: number,
    topP?: number
  ): Promise<string> => {
    const generationConfig: any = { 
      temperature,
      maxOutputTokens: 8192
    };
    if (frequencyPenalty !== undefined) generationConfig.frequencyPenalty = frequencyPenalty;
    if (topP !== undefined) generationConfig.topP = topP;
    if (schema) {
      generationConfig.responseMimeType = 'application/json';
      generationConfig.responseSchema = schema;
    }

    const res = await callVertexAI({
      task: 'course_generation',
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      generationConfig
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`AI Engine call failed (${res.status}): ${errBody}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  };

  // Step 1: Syllabus Architect
  const {
    correctedCourseName,
    discipline,
    lessonsList,
    syllabus,
    level,
    isLanguageOrLinguistics,
    lawMandate,
    lawCriticMandate,
    pronunciationMandate,
    lessonDbWidgetIds
  } = await generateSyllabusStep(courseName, levelInput, targetLang, taskId, appendTaskLog, callAIEngine);

  const stats: any = {
    courseName: correctedCourseName,
    discipline,
    level,
    targetLang,
    totalLessons: lessonsList.length,
    lessons: []
  };

  const courseReferences: any[] = [];
  const prunedCatalog = getFilteredWidgetsCatalog(discipline);

  // Step 2: Iterate over lessons
  for (let lessonIdx = lessonOffset; lessonIdx < lessonsList.length; lessonIdx++) {
    const item = lessonsList[lessonIdx];
    const isTerminalEvaluation = lessonIdx === lessonsList.length - 1;

    await appendTaskLog(`[AI GENERATOR] Starting lesson ${lessonIdx + 1}/${lessonsList.length}: "${item.title}"`);

    // Scribe pass: Outline & Narrative draft
    const { approvedNarrativeText } = await runScribeStep(
      item,
      lessonIdx,
      courseName,
      correctedCourseName,
      level,
      discipline,
      targetLang,
      lawMandate,
      lawCriticMandate,
      pronunciationMandate,
      callAIEngine,
      appendTaskLog
    );

    // Craftsman pass: Blocks 1-5
    const parsedWidgets = await runCraftsmanGenerator(
      item,
      approvedNarrativeText,
      targetLang,
      discipline,
      level,
      isTerminalEvaluation,
      courseReferences,
      callAIEngine,
      appendTaskLog
    );

    // Persistence & validation
    await persistLesson(
      item,
      lessonIdx,
      lessonsList,
      courseName,
      correctedCourseName,
      level,
      discipline,
      targetLang,
      parsedWidgets,
      approvedNarrativeText,
      isTerminalEvaluation,
      courseReferences,
      prunedCatalog,
      stats,
      lessonDbWidgetIds,
      taskId,
      appendTaskLog
    );
  }

  // Step 3: Save / Update Course Card
  const result = await persistCourseCard(
    courseName,
    correctedCourseName,
    level,
    discipline,
    targetLang,
    lessonsList
  );

  await appendTaskLog(`[AI GENERATOR] Course "${correctedCourseName}" generation complete!`);
  return result;
}
