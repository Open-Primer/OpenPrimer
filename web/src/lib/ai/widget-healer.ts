/**
 * OpenPrimer Widget Healer
 * Modular validation and healing pipeline (< 600 LOC per submodule)
 * 100% backward compatibility
 */

import { getDisciplineFallbackSentence } from './healer/disciplineFallbacks';
import { detectLanguageLeakage, translateText } from './healer/languageLeakageDetector';
import { validateAndFixDiagnosticQuiz } from './healer/quizValidator';
import { healInteractiveComponents } from './healer/interactiveComponentHealer';
import { healCompanionWidgets } from './healer/companionWidgetsHealer';

export * from './healer/disciplineFallbacks';
export * from './healer/languageLeakageDetector';
export * from './healer/quizValidator';
export * from './healer/interactiveComponentHealer';
export * from './healer/wikidataEntityHealer';
export * from './healer/companionWidgetsHealer';

export async function validateAndFixWidgets(
  widgets: any,
  discipline?: string,
  targetLang: string = 'fr'
): Promise<any> {
  if (!widgets || typeof widgets !== 'object') {
    return widgets;
  }

  let healed = { ...widgets };

  // 1. Validate / Fix diagnostic quiz
  if (healed.diagnosticQuiz) {
    healed.diagnosticQuiz = await validateAndFixDiagnosticQuiz(healed.diagnosticQuiz, targetLang);
  }

  // 2. Validate / Fix interactive components
  if (Array.isArray(healed.interactiveComponents)) {
    healed.interactiveComponents = await healInteractiveComponents(healed.interactiveComponents, targetLang, discipline);
  }

  // 3. Validate / Fix companion widgets (whatsNext, realWorldApplication, historicalContext, deepDive)
  healed = await healCompanionWidgets(healed, targetLang);

  return healed;
}
