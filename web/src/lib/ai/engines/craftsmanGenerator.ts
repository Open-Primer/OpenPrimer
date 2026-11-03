import { runCraftsmanBlocks1to2 } from './craftsmanBlocks1to2';
import { runCraftsmanBlocks3to4 } from './craftsmanBlocks3to4';
import { runCraftsmanBlock5 } from './craftsmanBlock5';

export async function runCraftsmanGenerator(
  item: any,
  approvedNarrativeText: string,
  targetLang: string,
  discipline: string,
  level: string,
  isTerminalEvaluation: boolean,
  courseReferences: any[],
  callAIEngine: any,
  log: (msg: string) => Promise<void>
): Promise<any> {
  const blocks12 = await runCraftsmanBlocks1to2(item, approvedNarrativeText, targetLang, discipline, callAIEngine, log);
  const blocks34 = await runCraftsmanBlocks3to4(item, approvedNarrativeText, targetLang, discipline, callAIEngine, log);
  const block5 = await runCraftsmanBlock5(
    item,
    approvedNarrativeText,
    targetLang,
    discipline,
    level,
    isTerminalEvaluation,
    courseReferences,
    callAIEngine,
    log
  );

  return {
    ...blocks12,
    ...blocks34,
    ...block5
  };
}
