import { detectLanguageLeakage, translateText } from './languageLeakageDetector';

export async function validateAndFixDiagnosticQuiz(diagnosticQuiz: any, targetLang: string): Promise<any> {
  if (!diagnosticQuiz || typeof diagnosticQuiz !== 'object') return null;

  const isPlStr = (s: string) => {
    if (!s) return true;
    const trimS = String(s).trim();
    return /placeholder|dummy|todo|tbd|tbc|lorem|ipsum|option/i.test(trimS) || /^[\[\(].*[\]\)]$/.test(trimS);
  };

  if (
    !diagnosticQuiz.question ||
    isPlStr(diagnosticQuiz.question) ||
    !diagnosticQuiz.sectionTitle ||
    isPlStr(diagnosticQuiz.sectionTitle) ||
    !Array.isArray(diagnosticQuiz.options) ||
    diagnosticQuiz.options.length < 2 ||
    diagnosticQuiz.options.some((o: any) => isPlStr(o))
  ) {
    return null;
  }

  const options = diagnosticQuiz.options.filter((o: any) => o && String(o).trim().length > 0);
  if (options.length < 2) {
    return null;
  }

  if (
    typeof diagnosticQuiz.correctIndex !== 'number' ||
    diagnosticQuiz.correctIndex < 0 ||
    diagnosticQuiz.correctIndex >= options.length
  ) {
    console.warn("[validateAndFixWidgets] diagnosticQuiz.correctIndex out of range — dropping quiz.");
    return null;
  }

  const result = { ...diagnosticQuiz, options };

  if (detectLanguageLeakage(result.question, targetLang)) {
    result.question = await translateText(result.question, targetLang);
  }
  if (detectLanguageLeakage(result.sectionTitle, targetLang)) {
    result.sectionTitle = await translateText(result.sectionTitle, targetLang);
  }
  for (let i = 0; i < result.options.length; i++) {
    if (detectLanguageLeakage(result.options[i], targetLang)) {
      result.options[i] = await translateText(result.options[i], targetLang);
    }
  }

  return result;
}
