import { detectLanguageLeakage, translateText } from './languageLeakageDetector';

export async function validateAndFixDiagnosticQuiz(quiz: any, targetLang: string): Promise<any> {
  if (!quiz || typeof quiz !== 'object') return quiz;
  let fixedQuiz = { ...quiz };
  // 2. Diagnostic quiz validation
  if (widgets.diagnosticQuiz && typeof widgets.diagnosticQuiz === 'object') {
    const isPlStr = (s: string) => {
      if (!s) return true;
      const trimS = String(s).trim();
      return /placeholder|dummy|todo|tbd|tbc|lorem|ipsum|option/i.test(trimS) || /^[\[\(].*[\]\)]$/.test(trimS);
    };

    if (
      !widgets.diagnosticQuiz.question ||
      isPlStr(widgets.diagnosticQuiz.question) ||
      !widgets.diagnosticQuiz.sectionTitle ||
      isPlStr(widgets.diagnosticQuiz.sectionTitle) ||
      !Array.isArray(widgets.diagnosticQuiz.options) ||
      widgets.diagnosticQuiz.options.length < 2 ||
      widgets.diagnosticQuiz.options.some((o: any) => isPlStr(o))
    ) {
      widgets.diagnosticQuiz = null;
    } else {
      widgets.diagnosticQuiz.options = widgets.diagnosticQuiz.options.filter((o: any) => o && String(o).trim().length > 0);
      if (widgets.diagnosticQuiz.options.length < 2) {
        widgets.diagnosticQuiz = null;
      } else {
        if (typeof widgets.diagnosticQuiz.correctIndex !== 'number' || widgets.diagnosticQuiz.correctIndex < 0 || widgets.diagnosticQuiz.correctIndex >= widgets.diagnosticQuiz.options.length) {
          // [FIX A1] Corrupt correctIndex -> drop the quiz instead of silently forcing option 0 as correct.
          console.warn(`[validateAndFixWidgets] diagnosticQuiz.correctIndex out of range — dropping quiz.`);
          widgets.diagnosticQuiz = null;
        }
        
        if (widgets.diagnosticQuiz) {
          // Translate diagnosticQuiz fields if leaked
          if (detectLanguageLeakage(widgets.diagnosticQuiz.question, lang)) {
            widgets.diagnosticQuiz.question = await translateText(widgets.diagnosticQuiz.question, lang);
          }
          if (detectLanguageLeakage(widgets.diagnosticQuiz.sectionTitle, lang)) {
            widgets.diagnosticQuiz.sectionTitle = await translateText(widgets.diagnosticQuiz.sectionTitle, lang);
          }
          for (let i = 0; i < widgets.diagnosticQuiz.options.length; i++) {
            if (detectLanguageLeakage(widgets.diagnosticQuiz.options[i], lang)) {
              widgets.diagnosticQuiz.options[i] = await translateText(widgets.diagnosticQuiz.options[i], lang);
            }
          }
        }
      }
    }
  } else {
    widgets.diagnosticQuiz = null;
  }

  // 3. Objectives KSA validation
  if (widgets.learningObjectives && typeof widgets.learningObjectives === 'object') {
    const isPl = (x: any) => {
      const s = String(x || '').trim();
      return !s || /placeholder|dummy|todo|tbd|tbc|lorem|ipsum/i.test(s) || /^[\[\(].*[\]\)]$/.test(s);
    };
    widgets.learningObjectives.knowledge = Array.isArray(widgets.learningObjectives.knowledge)
      ? widgets.learningObjectives.knowledge.filter((x: any) => !isPl(x))
      : [];
    widgets.learningObjectives.skills = Array.isArray(widgets.learningObjectives.skills)
      ? widgets.learningObjectives.skills.filter((x: any) => !isPl(x))
      : [];
    widgets.learningObjectives.attitudes = Array.isArray(widgets.learningObjectives.attitudes)
      ? widgets.learningObjectives.attitudes.filter((x: any) => !isPl(x))
      : [];

    // Translate learningObjectives fields if leaked
    const categories = ['knowledge', 'skills', 'attitudes'];
    for (const cat of categories) {
      const items = widgets.learningObjectives[cat];
      for (let i = 0; i < items.length; i++) {
        if (detectLanguageLeakage(items[i], lang)) {
          items[i] = await translateText(items[i], lang);
        }
      }
    }

    if (widgets.learningObjectives.knowledge.length === 0 && widgets.learningObjectives.skills.length === 0 && widgets.learningObjectives.attitudes.length === 0) {
      widgets.learningObjectives = null;
    }
  } else {
    widgets.learningObjectives = null;
  }

  // 4. Formative interactiveComponents validation & sanitization
  if (!Array.isArray(widgets.interactiveComponents)) {
    widgets.interactiveComponents = [];
  } else {
    widgets.interactiveComponents = widgets.interactiveComponents.filter((comp: any) => {
      if (!comp || typeof comp !== 'object' || !comp.id || !comp.componentType) {
        return false;
      }
      const props = comp.props || {};
      if (comp.componentType === "Biography") {
        if (!props.name || /placeholder|dummy|todo|tbd|tbc|lorem|ipsum/i.test(props.name) || /^[\[\(].*[\]\)]$/.test(props.name.trim())) {
          return false;
        }
      }
      if (comp.componentType === "Image") {
        if (!props.description || /illustration|placeholder|dummy|todo|tbd|tbc|lorem|ipsum/i.test(props.description) || /^[\[\(].*[\]\)]$/.test(props.description.trim())) {
          return false;
        }
      }
      return true;
    });


  return fixedQuiz;
}
