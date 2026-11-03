import { runSyllabusGeneration } from './syllabusGenerator';
import { runSyllabusScoping } from './syllabusScoping';

export async function generateSyllabusStep(
  courseName: string,
  levelInput: string,
  targetLang: string = 'en',
  taskId?: string,
  appendTaskLog?: (msg: string) => Promise<void>,
  callAIEngine?: any
): Promise<{
  correctedCourseName: string;
  discipline: string;
  lessonsList: any[];
  syllabus: any;
  level: string;
  isLanguageOrLinguistics: boolean;
  lawMandate: string;
  lawCriticMandate: string;
  pronunciationMandate: string;
  lessonDbWidgetIds: Set<string>;
}> {
  const { correctedCourseName, discipline, syllabus, level } = await runSyllabusGeneration(
    courseName,
    levelInput,
    targetLang,
    taskId,
    appendTaskLog,
    callAIEngine
  );

  const scopingResult = await runSyllabusScoping(
    syllabus,
    courseName,
    correctedCourseName,
    discipline,
    level,
    targetLang,
    taskId,
    appendTaskLog,
    callAIEngine
  );

  return {
    correctedCourseName,
    discipline,
    syllabus,
    level,
    ...scopingResult
  };
}
