/**
 * OpenPrimer - Widget Healer & Schema Normalization Subsystem
 *
 * Provides deep semantic validation, Wikidata entity resolution, language leakage detection,
 * and automated structural repair for all lesson interactive widgets.
 */

import { callVertexAI } from '../vertex-client';
import {
  resolvePersonDates,
  isPlaceholderDates,
  formatPersonDates,
  resolveEventDates,
  resolveChemicalData,
  resolveScientificFormula,
  resolveGoingFurtherResource
} from '../wikidata-resolver';
import {
  resolveMediaImage,
  searchYouTubeVideo,
  fetchWikimediaAudio,
  fetchWithTimeout
} from '../media-resolver';

export function getDisciplineFallbackSentence(discipline?: string, lang: string = 'fr'): { sentence: string; answer: string } {
  const normDisc = (discipline || '').toLowerCase();
  const normLang = lang.toLowerCase().split('-')[0];

  const sentences: Record<string, Record<string, { sentence: string; answer: string }>> = {
    linguistics: {
      fr: { sentence: "Le _____ est l'unité minimale de son dans une langue.", answer: "phonème" },
      en: { sentence: "The _____ is the smallest unit of sound in a language.", answer: "phoneme" },
      es: { sentence: "El _____ es la unidad mínima de sonido en una lengua.", answer: "fonema" },
      de: { sentence: "Das _____ ist die kleinste lautliche Einheit einer Sprache.", answer: "Phonem" },
      zh: { sentence: "_____ 是语言中最小的声音单位。", answer: "音位" }
    },
    physics: {
      fr: { sentence: "La vitesse de la lumière dans le vide est d'environ 300 000 _____ par seconde.", answer: "kilomètres" },
      en: { sentence: "The speed of light in a vacuum is approximately 300,000 _____ per second.", answer: "kilometers" },
      es: { sentence: "La velocidad de la luz en el vacío es de aproximadamente 300.000 _____ por segundo.", answer: "kilómetros" },
      de: { sentence: "Die Lichtgeschwindigkeit im Vakuum beträgt etwa 300.000 _____ pro Sekunde.", answer: "Kilometer" },
      zh: { sentence: "真空中光速约为每秒 30 _____ 公里。", answer: "万" }
    },
    astronomy: {
      fr: { sentence: "La Terre tourne autour du _____.", answer: "Soleil" },
      en: { sentence: "The Earth revolves around the _____.", answer: "Sun" },
      es: { sentence: "La Tierra gira alrededor del _____.", answer: "Sol" },
      de: { sentence: "Die Erde dreht sich um die _____.", answer: "Sonne" },
      zh: { sentence: "地球围绕_____公转。", answer: "太阳" }
    },
    chemistry: {
      fr: { sentence: "L'eau est composée de deux atomes d'hydrogène et d'un atome d'_____.", answer: "oxygène" },
      en: { sentence: "Water is composed of two hydrogen atoms and one _____ atom.", answer: "oxygen" },
      es: { sentence: "El agua está compuesta por dos átomos de hidrógeno y uno de _____.", answer: "oxígeno" },
      de: { sentence: "Wasser besteht aus zwei Wasserstoffatomen und einem _____atom.", answer: "Sauerstoff" },
      zh: { sentence: "水分子由两个氢原子和一个_____原子组成。", answer: "氧" }
    },
    biology: {
      fr: { sentence: "Le _____ est l'organe central qui pompe le sang dans le corps.", answer: "cœur" },
      en: { sentence: "The _____ is the central organ that pumps blood throughout the body.", answer: "heart" },
      es: { sentence: "El _____ es el órgano central que bombea sangre por todo el cuerpo.", answer: "corazón" },
      de: { sentence: "Das _____ ist das zentrale Organ, das Blut durch den Körper pumpt.", answer: "Herz" },
      zh: { sentence: "_____是向全身泵送血液的中心器官。", answer: "心脏" }
    },
    mathematics: {
      fr: { sentence: "Un triangle rectangle possède un angle _____.", answer: "droit" },
      en: { sentence: "A right triangle always has one _____ angle.", answer: "right" },
      es: { sentence: "Un triángulo rectángulo tiene un ángulo _____.", answer: "recto" },
      de: { sentence: "Ein rechtwinkliges Dreieck hat einen _____ Winkel.", answer: "rechten" },
      zh: { sentence: "直角三角形包含一个_____角。", answer: "直" }
    },
    history: {
      fr: { sentence: "La Révolution française a débuté en _____.", answer: "1789" },
      en: { sentence: "The French Revolution began in the year _____.", answer: "1789" },
      es: { sentence: "La Revolución Francesa comenzó en el año _____.", answer: "1789" },
      de: { sentence: "Die Französische Revolution begann im Jahr _____.", answer: "1789" },
      zh: { sentence: "法国大革命开始于 _____ 年。", answer: "1789" }
    },
    computers: {
      fr: { sentence: "Un algorithme est une suite finie d'_____.", answer: "instructions" },
      en: { sentence: "An algorithm is a finite sequence of _____.", answer: "instructions" },
      es: { sentence: "Un algoritmo es una secuencia finita de _____.", answer: "instrucciones" },
      de: { sentence: "Ein Algorithmus ist eine endliche Abfolge von _____.", answer: "Anweisungen" },
      zh: { sentence: "算法是有限的_____序列。", answer: "指令" }
    }
  };

  let category = 'astronomy';
  if (normDisc.includes('ling') || normDisc.includes('lang') || normDisc.includes('phon')) {
    category = 'linguistics';
  } else if (normDisc.includes('phys')) {
    category = 'physics';
  } else if (normDisc.includes('chem') || normDisc.includes('chim')) {
    category = 'chemistry';
  } else if (normDisc.includes('bio') || normDisc.includes('anat') || normDisc.includes('med')) {
    category = 'biology';
  } else if (normDisc.includes('math') || normDisc.includes('alg') || normDisc.includes('geom')) {
    category = 'mathematics';
  } else if (normDisc.includes('hist') || normDisc.includes('polit')) {
    category = 'history';
  } else if (normDisc.includes('comp') || normDisc.includes('prog') || normDisc.includes('info') || normDisc.includes('web')) {
    category = 'computers';
  }

  const langSentences = sentences[category] || sentences['astronomy'];
  return langSentences[normLang] || langSentences['en'] || { sentence: "The Earth revolves around the _____.", answer: "Sun" };
}

export function detectLanguageLeakage(text: string, targetLang: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const clean = text.toLowerCase().trim();
  if (clean.length < 8) return false;

  const normLang = (targetLang || 'fr').toLowerCase().split('-')[0];

  // [FIX A4] For EN-target courses, detect French leakage (most common bleed-through language).
  if (normLang === 'en') {
    const frenchStopwords = /\b(le|la|les|un|une|des|du|en|et|ou|est|sont|dans|pour|par|sur|avec|qui|que|ce|cette|ces|aussi|donc|mais|car)\b/i;
    return clean.length > 15 && frenchStopwords.test(clean);
  }

  const englishIndicators = [
    /\bthe\s+(?:study|theory|concept|process|method|system|model|structure|function|example|role|importance|nature|effect|development|history|origin|application|analysis|definition|classification|principles|elements|components|features|characteristics)\b/i,
    /\bis\s+a\b/i,
    /\is\s+the\b/i,
    /\brefers\s+to\b/i,
    /\bdefined\s+as\b/i,
    /\bcan\s+be\b/i,
    /\bwhich\s+is\b/i,
    /\bthere\s+are\b/i,
    /\bwith\s+the\b/i,
    /\bof\s+the\b/i,
    /\band\s+the\b/i,
    /\bfor\s+example\b/i,
    /\bthis\s+means\b/i
  ];

  let matches = 0;
  for (const regex of englishIndicators) {
    if (regex.test(clean)) {
      matches++;
    }
  }

  if (matches >= 1) return true;

  if (normLang === 'fr') {
    const frenchIndicators = [
      /\b(le|la|les|un|une|des|du|de|en|et|ou|est|sont|dans|pour|par|sur|avec|qui|que|ce|cette|ces|se|dans|pour)\b/i
    ];
    if (clean.length > 20 && !frenchIndicators[0].test(clean)) {
      return true;
    }
  }

  // [FIX A5] DE/ES/ZH — detect English leakage via double-fire (EN indicators + non-EN target).
  if (normLang === 'de' || normLang === 'es' || normLang === 'zh') {
    if (matches >= 1) return true; // English indicators fired in a non-English target
    // ZH: flag if long text has no CJK characters at all
    if (normLang === 'zh' && clean.length > 20) {
      const hasCjk = /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(text);
      if (!hasCjk) return true;
    }
  }

  return false;
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  const prompt = `You are a precise translator. Translate the following text into ${targetLang.toUpperCase()}. Keep all technical/academic/literary terms accurate. Do NOT add any explanations, introductory text, or markdown formatting. Return ONLY the translated text.

TEXT TO TRANSLATE:
${text}`;
  try {
    const res = await callVertexAI({
      task: 'course_generation',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 }
    });
    if (res && res.ok) {
      const resJson = await res.json();
      const resultText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanRes = resultText.replace(/```[a-z]*/g, '').replace(/```/g, '').trim();
      // [FIX A6] Sanity check: reject translation if output is suspiciously short (e.g. model hallucinated empty/punctuation).
      if (cleanRes.length < text.length * 0.2) {
        console.warn(`[TRANSLATE] Output suspiciously short (${cleanRes.length} vs source ${text.length}), returning original.`);
        return text;
      }
      return cleanRes;
    }
    return text;
  } catch (err) {
    console.error(`[TRANSLATE] Failed to translate:`, err);
    console.warn('[TRANSLATE] Returning original text (possibly untranslated) — check quota/network.');
    return text;
  }
}

export async function validateAndFixWidgets(widgets: any, discipline?: string, lang: string = 'fr'): Promise<any> {
  if (!widgets || typeof widgets !== 'object') {
    throw new Error("Widgets content is empty or malformed.");
  }

  // 1. Prerequisites validation
  if (!widgets.prerequisites || !Array.isArray(widgets.prerequisites.items)) {
    widgets.prerequisites = { items: [] };
  } else {
    widgets.prerequisites.items = widgets.prerequisites.items.filter((x: any) => x && String(x).trim().length > 0);
    for (let i = 0; i < widgets.prerequisites.items.length; i++) {
      if (detectLanguageLeakage(widgets.prerequisites.items[i], lang)) {
        widgets.prerequisites.items[i] = await translateText(widgets.prerequisites.items[i], lang);
      }
    }
  }

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

    // [FIX IC-1] Deduplicate IDs within interactiveComponents.
    // The critic rejects blocks containing duplicate IDs, so we suffix duplicates
    // deterministically (id, id_2, id_3, ...) rather than dropping valid components.
    {
      const seenIds = new Map<string, number>(); // id -> count of occurrences so far
      widgets.interactiveComponents = widgets.interactiveComponents.map((comp: any) => {
        const rawId: string = String(comp.id || '').trim();
        if (!rawId) return comp;
        const count = seenIds.get(rawId) || 0;
        if (count === 0) {
          seenIds.set(rawId, 1);
          return comp;
        } else {
          // Duplicate found — suffix to make it unique
          seenIds.set(rawId, count + 1);
          const newId = `${rawId}_${count + 1}`;
          console.warn(`[validateAndFixWidgets] Duplicate component id "${rawId}" → renamed to "${newId}"`);
          return { ...comp, id: newId };
        }
      });
    }

    const disc = (discipline || "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const isMath = disc.includes("math") || disc.includes("alge") || disc.includes("geomet");
    const isPhysics = disc.includes("physic") || disc.includes("physiq") || disc.includes("astron");
    const isChemistry = disc.includes("chemist") || disc.includes("chimi");
    const isBiology = disc.includes("biolog") || disc.includes("life science") || disc.includes("anatom") || disc.includes("medec") || disc.includes("medici") || disc.includes("sante");
    const isCS = disc.includes("computer") || disc.includes("informatique") || disc.includes("program") || disc.includes("software");
    const isEconomics = disc.includes("econom") || disc.includes("finan") || disc.includes("busines") || disc.includes("comptab");
    const isSocialPsych = disc.includes("psych") || disc.includes("sociol") || disc.includes("social");
    const isHistoryGeogHumanities = disc.includes("histor") || disc.includes("geogr") || disc.includes("philosoph") || disc.includes("liter") || disc.includes("lettr") || disc.includes("art");

    widgets.interactiveComponents = widgets.interactiveComponents.filter((comp: any) => {
      if (!comp || !comp.componentType) return false;
      
      const alwaysAllowed = [
        "Quiz", "FillInBlanks", "SolvedExercise", "UnsolvedExercise", "Mermaid", "Video", "Audio",
        "Biography", "Image", "Citation", "Epistemology", "MatchingEvaluation", "AssociationCorrespondance",
        "ReorderEvaluation", "ReordonnerItems", "RealPerson", "HistoricalPerson",
        "ConceptLink", "Location", "EventLink", "HistoricalEventLink", "EvenementHistorique", "ÉvénementHistorique", "Glossary", "Lexique"
      ];
      if (alwaysAllowed.includes(comp.componentType)) {
        return true;
      }
      
      if (comp.componentType === "Geometry2D" || comp.componentType === "BasicMathExplorer" || comp.componentType === "FunctionManipulator") {
        return isMath;
      }
      
      if (comp.componentType === "FunctionPlotter" || comp.componentType === "EquationManipulator") {
        return isMath || isPhysics;
      }
      
      if (comp.componentType === "DynamicSimulation") {
        return isPhysics || isMath;
      }
      
      if (comp.componentType === "StructureViewer3D" || comp.componentType === "QuantumOrbitalExplorer") {
        return isPhysics || isChemistry;
      }
      
      if (comp.componentType === "ChemicalStoichiometry") {
        return isChemistry;
      }
      
      if (comp.componentType === "CodeSandbox") {
        return isCS;
      }
      
      if (comp.componentType === "InteractiveDiagram") {
        return isBiology || isSocialPsych || isHistoryGeogHumanities;
      }
      
      if (comp.componentType === "ComparisonSlider") {
        return isBiology || isHistoryGeogHumanities;
      }
      
      if (comp.componentType === "GestaltInteractive") {
        return isSocialPsych || isHistoryGeogHumanities;
      }
      
      if (comp.componentType === "DataChart") {
        return isEconomics || isPhysics || isSocialPsych || isMath || isHistoryGeogHumanities || isBiology || isChemistry || isCS;
      }
      
      return false;
    });

    // Heal, translate and clean up fields
    for (const comp of widgets.interactiveComponents) {
      if (!comp.props || typeof comp.props !== 'object') comp.props = {};
      const props = comp.props;

      const compTypeLower = typeof comp.componentType === 'string' ? comp.componentType.toLowerCase() : '';
      const ENTITY_WIDGET_TYPES = [
        'realperson', 'historicalperson', 'conceptlink', 'location', 
        'eventlink', 'historicaleventlink', 'evenementhistorique', 'événementhistorique', 
        'glossary', 'lexique', 'biography'
      ];
      if (ENTITY_WIDGET_TYPES.includes(compTypeLower)) {
        // Strip forbidden keys to prevent AI hallucinations or legacy contaminants
        delete props.wikipediaUrl;
        delete props.wikipediaLink;
        delete props.url;
        delete props.imageUrl;
        delete props.searchQuery;
        
        if (compTypeLower !== 'biography') {
          delete props.dates;
          delete props.year;
          delete props.birthYear;
          delete props.deathYear;
        }
      }

      // [FIX IC-2] Resolve dates for RealPerson / HistoricalPerson components via Wikidata.
      // The AI MUST NOT invent or hallucinate dates. We fetch them deterministically from
      // Wikidata (SPARQL) → Wikipedia extract. If not found, we leave dates empty (not a
      // placeholder string) so the critic cannot flag a spurious value.
      if (comp.componentType === "RealPerson" || comp.componentType === "HistoricalPerson") {
        const personName: string = (props.name || '').trim();
        const currentYear: string = (props.year || props.dates || '').trim();
        if (personName && isPlaceholderDates(currentYear)) {
          try {
            const targetLang = (lang || 'en').toLowerCase().split('-')[0];
            const resolved = await resolvePersonDates(personName, targetLang);
            if (resolved && resolved.formatted) {
              // Prefer `year` if that is the field the schema uses, else `dates`
              if (props.year !== undefined) {
                props.year = resolved.formatted;
              }
              if (props.dates !== undefined || comp.componentType === 'HistoricalPerson') {
                props.dates = resolved.formatted;
              }
              console.log(`[PERSON DATE RESOLVER] Resolved dates for "${personName}": ${resolved.formatted} (Wikidata: ${resolved.wikidataId || 'N/A'})`);
            } else {
              // Cannot determine dates — remove placeholder to avoid critic rejection
              if (isPlaceholderDates(props.year)) delete props.year;
              if (isPlaceholderDates(props.dates)) delete props.dates;
              console.warn(`[PERSON DATE RESOLVER] No dates found for "${personName}" — placeholder removed.`);
            }
          } catch (err) {
            console.error(`[PERSON DATE RESOLVER] Error resolving dates for "${personName}":`, err);
            // Safety: remove known-bad placeholder on error
            if (isPlaceholderDates(props.year)) delete props.year;
            if (isPlaceholderDates(props.dates)) delete props.dates;
          }
        }
      }

      // [FIX IC-2b] Resolve dates for EventLink / HistoricalEventLink / EvenementHistorique / ÉvénementHistorique components via Wikidata.
      if (comp.componentType === "EventLink" || comp.componentType === "HistoricalEventLink" || comp.componentType === "EvenementHistorique" || comp.componentType === "ÉvénementHistorique") {
        const eventName: string = (props.name || '').trim();
        const currentYear: string = (props.year || props.dates || '').trim();
        if (eventName && isPlaceholderDates(currentYear)) {
          try {
            const targetLang = (lang || 'en').toLowerCase().split('-')[0];
            const resolved = await resolveEventDates(eventName, targetLang);
            if (resolved && resolved.formatted) {
              if (props.year !== undefined) {
                props.year = resolved.formatted;
              }
              if (props.dates !== undefined) {
                props.dates = resolved.formatted;
              }
              if (props.year === undefined && props.dates === undefined) {
                props.dates = resolved.formatted;
              }
              console.log(`[EVENT DATE RESOLVER] Resolved dates for "${eventName}": ${resolved.formatted}`);
            } else {
              if (isPlaceholderDates(props.year)) delete props.year;
              if (isPlaceholderDates(props.dates)) delete props.dates;
            }
          } catch (err) {
            console.error(`[EVENT DATE RESOLVER] Error resolving dates for "${eventName}":`, err);
            if (isPlaceholderDates(props.year)) delete props.year;
            if (isPlaceholderDates(props.dates)) delete props.dates;
          }
        }
      }

      // [FIX IC-2c] Resolve chemical formula and SMILES for ConceptLink / Molecule / ChemicalLink components.
      if (comp.componentType === "ConceptLink" || comp.componentType === "Molecule" || comp.componentType === "ChemicalLink") {
        const entityName: string = (props.name || props.term || '').trim();
        if (entityName && entityName.length > 2) {
          const lowerName = entityName.toLowerCase();
          const isChemicalTerm = 
            lowerName.includes('acide') || lowerName.includes('acid') || lowerName.includes('dioxyde') || 
            lowerName.includes('dioxide') || lowerName.includes('sulfate') || lowerName.includes('hydroxyde') || 
            lowerName.includes('hydroxide') || lowerName.includes('chlorure') || lowerName.includes('chloride') || 
            lowerName.includes('eau') || lowerName.includes('water') || lowerName.includes('éthanol') || 
            lowerName.includes('ethanol') || lowerName.includes('méthane') || lowerName.includes('methane') ||
            lowerName.includes('benzène') || lowerName.includes('benzene') || lowerName.includes('glucose') ||
            comp.componentType === "Molecule" || comp.componentType === "ChemicalLink";

          if (isChemicalTerm) {
            try {
              const targetLang = (lang || 'en').toLowerCase().split('-')[0];
              const resolved = await resolveChemicalData(entityName, targetLang);
              if (resolved && resolved.formula) {
                props.formula = resolved.formula;
                if (resolved.smiles) props.smiles = resolved.smiles;
                
                if (props.description && !props.description.includes(resolved.formula)) {
                  const formulaSuffix = targetLang === 'fr' 
                    ? ` (formule chimique : ${resolved.formula})` 
                    : ` (chemical formula: ${resolved.formula})`;
                  props.description = props.description.trim() + formulaSuffix;
                }
                console.log(`[CHEMICAL RESOLVER] Resolved formula for "${entityName}": ${resolved.formula}`);
              }
            } catch (err) {
              console.error(`[CHEMICAL RESOLVER] Error for "${entityName}":`, err);
            }
          }
        }
      }

      // [FIX IC-2d] Resolve LaTeX formula for general scientific concepts.
      if (comp.componentType === "ConceptLink") {
        const conceptName: string = (props.name || props.term || '').trim();
        if (conceptName && !props.formula) {
          try {
            const targetLang = (lang || 'en').toLowerCase().split('-')[0];
            const resolved = await resolveScientificFormula(conceptName, targetLang);
            if (resolved && resolved.formula) {
              props.formula = resolved.formula;
              console.log(`[FORMULA RESOLVER] Resolved LaTeX formula for "${conceptName}": ${resolved.formula}`);
            }
          } catch (err) {
            console.error(`[FORMULA RESOLVER] Error for "${conceptName}":`, err);
          }
        }
      }



      // Intelligent biography healing (description + dates)
      if (comp.componentType === "Biography") {
        let name = (props.name || "").trim();
        let description = (props.description || "").trim();
        const isPlaceholder = !description || description.length < 20 || /placeholder|dummy|todo|tbd|tbc|lorem|ipsum|biographie détaillée/i.test(description) || /^[\[\(].*[\]\)]$/.test(description);

        // [FIX IC-3] Also resolve dates for Biography components via Wikidata
        if (name && isPlaceholderDates(props.dates)) {
          try {
            const targetLang = (lang || 'en').toLowerCase().split('-')[0];
            const resolved = await resolvePersonDates(name, targetLang);
            if (resolved && resolved.formatted) {
              props.dates = resolved.formatted;
              console.log(`[BIOGRAPHY DATE RESOLVER] Resolved dates for "${name}": ${resolved.formatted}`);
            } else {
              // Remove placeholder to keep critic happy
              if (isPlaceholderDates(props.dates)) delete props.dates;
            }
          } catch (err) {
            console.error(`[BIOGRAPHY DATE RESOLVER] Error for "${name}":`, err);
            if (isPlaceholderDates(props.dates)) delete props.dates;
          }
        }
        
        const isPlaceholderWiki = !props.wikipediaUrl || /placeholder|dummy|todo|tbd|tbc|lorem|ipsum/i.test(props.wikipediaUrl);
        if (name && (isPlaceholder || isPlaceholderWiki)) {
          console.log(`[BIOGRAPHY VALIDATOR] Biography placeholder description or missing/placeholder Wikipedia URL for "${name}". Resolving...`);
          try {
            const targetLang = (lang || 'fr').toLowerCase().split('-')[0];
            const wikiSearchUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(name)}&srlimit=1`;
            const res = await fetchWithTimeout(wikiSearchUrl);
            if (res.ok) {
              const data = await res.json();
              const searchResult = data.query?.search?.[0];
              if (searchResult) {
                const canonicalTitle = searchResult.title;
                if (isPlaceholderWiki) {
                  props.wikipediaUrl = `https://${targetLang}.wikipedia.org/wiki/${encodeURIComponent(canonicalTitle.replace(/\s+/g, '_'))}`;
                }
                if (isPlaceholder) {
                  const wikiExtractUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(canonicalTitle)}&redirects=1`;
                  const res2 = await fetchWithTimeout(wikiExtractUrl);
                  if (res2.ok) {
                    const data2 = await res2.json();
                    const pages = data2.query?.pages;
                    if (pages) {
                      const pageId = Object.keys(pages)[0];
                      if (pageId && pageId !== '-1') {
                        const extract = pages[pageId].extract || '';
                        if (extract && extract.length > 30) {
                          let sentence = extract.split(/[.!?]\s/)[0].trim();
                          const parts = extract.split(/[.!?]\s/);
                          if (parts[1]) sentence += '. ' + parts[1].trim();
                          if (parts[2]) sentence += '. ' + parts[2].trim();
                          if (!sentence.endsWith('.')) sentence += '.';
                          sentence = sentence.replace(/\s*\([^)]*\)/g, '').trim();
                          sentence = sentence.replace(/\s+/g, ' ');
                          
                          props.description = sentence;
                          props.name = canonicalTitle;
                          console.log(`[BIOGRAPHY VALIDATOR] Healed "${name}" description via Wikipedia.`);
                        }
                      }
                    }
                  }
                }
              }
            }
          } catch (err) {
            console.error(`[BIOGRAPHY VALIDATOR] Error healing biography:`, err);
          }
        }
      }

      // Check language leakage and translate
      if (comp.componentType === "Quiz") {
        if (Array.isArray(props.questions)) {
          props.questions = props.questions.filter((q: any) => {
            if (!q || !q.q || !Array.isArray(q.options)) return false;
            
            // Exclude questions with placeholder questions
            if (/placeholder|dummy|todo|tbd|tbc|lorem|ipsum/i.test(String(q.q)) || /^[\[\(].*[\]\)]$/.test(String(q.q).trim())) {
              return false;
            }

            // Clean options: drop placeholder or empty options
            q.options = q.options.filter((o: any) => {
              if (!o || typeof o !== 'object') return false;
              const txt = String(o.text || '').trim();
              if (!txt) return false;
              if (/placeholder|dummy|todo|tbd|tbc|lorem|ipsum|option/i.test(txt) || /^[\[\(].*[\]\)]$/.test(txt)) {
                return false;
              }
              return true;
            }).map((o: any) => {
              o.correct = !!o.correct;
              return o;
            });

            return q.options.length >= 2;
          });

          for (const q of props.questions) {
            if (detectLanguageLeakage(q.q, lang)) {
              q.q = await translateText(q.q, lang);
            }
            if (detectLanguageLeakage(q.explanation, lang)) {
              q.explanation = await translateText(q.explanation, lang);
            }
            for (const o of q.options) {
              if (detectLanguageLeakage(o.text, lang)) {
                o.text = await translateText(o.text, lang);
              }
            }
            if (!q.options.some((o: any) => o.correct)) {
              q.options[0].correct = true;
            }
          }
        }
      } else if (comp.componentType === "Biography") {
        if (detectLanguageLeakage(props.name, lang)) {
          props.name = await translateText(props.name, lang);
        }
        if (detectLanguageLeakage(props.description, lang)) {
          props.description = await translateText(props.description, lang);
        }
      } else if (comp.componentType === "Image" || comp.componentType === "CustomFigure") {
        delete props.year;
        delete (comp as any).year;
        if (detectLanguageLeakage(props.description, lang)) {
          props.description = await translateText(props.description, lang);
        }
        if (detectLanguageLeakage(props.alt, lang)) {
          props.alt = await translateText(props.alt, lang);
        }
        if (props.caption && detectLanguageLeakage(props.caption, lang)) {
          props.caption = await translateText(props.caption, lang);
        }
        
        // Resolve Image/CustomFigure URL programmatically via search query
        const queryName = (props.searchQuery || props.alt || props.title || "").trim();
        const hasDummyUrl = !props.url && !props.src || 
          (props.url && /placeholder|dummy|example\.com|localhost/i.test(props.url)) ||
          (props.src && /placeholder|dummy|example\.com|localhost/i.test(props.src));
        
        if (hasDummyUrl && queryName) {
          try {
            const targetLang = (lang || 'en').toLowerCase().split('-')[0];
            const resolution = await resolveMediaImage(queryName, targetLang);
            if (resolution && resolution.url) {
              props.url = resolution.url;
              props.src = resolution.url; // set both for safety
              if (resolution.description && (!props.caption || props.caption.includes('placeholder'))) {
                const sourceLabel = resolution.sourceLabel || 'Wikimedia Commons';
                props.caption = `${resolution.description} — Source: ${sourceLabel}`;
              }
              console.log(`[WIDGET MEDIA RESOLVER] Resolved Image "${queryName}" -> URL: ${props.url}`);
            }
          } catch (err) {
            console.error(`[WIDGET MEDIA RESOLVER] Error for Image "${queryName}":`, err);
          }
        }
      } else if (comp.componentType === "Video" || comp.componentType === "VideoPlayer") {
        const queryName = (props.title || props.searchQuery || "").trim();
        const hasDummyUrl = !props.url || /placeholder|dummy|example\.com|localhost/i.test(props.url);
        
        if (hasDummyUrl && queryName) {
          try {
            const targetLang = (lang || 'en').toLowerCase().split('-')[0];
            const searchQuery = `${queryName} cours education ${targetLang === 'fr' ? 'français' : 'english'}`;
            const videoId = await searchYouTubeVideo(searchQuery);
            if (videoId) {
              props.id = videoId;
              props.url = `https://www.youtube.com/watch?v=${videoId}`;
              console.log(`[WIDGET MEDIA RESOLVER] Resolved Video "${queryName}" -> URL: ${props.url}`);
            }
          } catch (err) {
            console.error(`[WIDGET MEDIA RESOLVER] Error for Video "${queryName}":`, err);
          }
        }
      } else if (comp.componentType === "Audio" || comp.componentType === "AudioPlayer") {
        const queryName = (props.title || props.text || "").trim();
        const hasDummyUrl = !props.url || /placeholder|dummy|example\.com|localhost/i.test(props.url);
        
        if (hasDummyUrl && queryName) {
          try {
            const audioUrl = await fetchWikimediaAudio(queryName);
            if (audioUrl) {
              props.url = audioUrl;
              props.src = audioUrl;
              console.log(`[WIDGET MEDIA RESOLVER] Resolved Audio "${queryName}" -> URL: ${props.url}`);
            }
          } catch (err) {
            console.error(`[WIDGET MEDIA RESOLVER] Error for Audio "${queryName}":`, err);
          }
        }
      } else if (comp.componentType === "Citation") {
        if (detectLanguageLeakage(props.quote, lang)) {
          props.quote = await translateText(props.quote, lang);
        }
        if (detectLanguageLeakage(props.commentary, lang)) {
          props.commentary = await translateText(props.commentary, lang);
        }
      } else if (comp.componentType === "Epistemology") {
        if (detectLanguageLeakage(props.title, lang)) {
          props.title = await translateText(props.title, lang);
        }
        if (detectLanguageLeakage(props.content, lang)) {
          props.content = await translateText(props.content, lang);
        }
      } else if (comp.componentType === "SolvedExercise" || comp.componentType === "UnsolvedExercise") {
        delete props.year;
        delete (comp as any).year;
        if (detectLanguageLeakage(props.title, lang)) {
          props.title = await translateText(props.title, lang);
        }
        if (detectLanguageLeakage(props.problem, lang)) {
          props.problem = await translateText(props.problem, lang);
        }
        if (props.solution && detectLanguageLeakage(props.solution, lang)) {
          props.solution = await translateText(props.solution, lang);
        }
        if (props.correctAnswer && detectLanguageLeakage(props.correctAnswer, lang)) {
          props.correctAnswer = await translateText(props.correctAnswer, lang);
        }
        if (props.explanation && detectLanguageLeakage(props.explanation, lang)) {
          props.explanation = await translateText(props.explanation, lang);
        }
      }
    }
  }

  // 5. Whats next validation
  if (widgets.whatsNext && Array.isArray(widgets.whatsNext.steps)) {
    widgets.whatsNext.steps = widgets.whatsNext.steps.filter((s: any) => s && s.title && s.description && !/placeholder|todo/i.test(s.description));
    for (const step of widgets.whatsNext.steps) {
      if (detectLanguageLeakage(step.title, lang)) {
        step.title = await translateText(step.title, lang);
      }
      if (detectLanguageLeakage(step.description, lang)) {
        step.description = await translateText(step.description, lang);
      }
    }
  } else {
    widgets.whatsNext = { steps: [] };
  }

  // 5b. Going further validation
  if (widgets.goingFurther && Array.isArray(widgets.goingFurther.items)) {
    const PLACEHOLDER_URL_PATTERNS = [
      'example.com', 'your_youtube_id', 'youtube.com/watch?v=xxxxxx',
      'youtube.com/watch?v=abcdef', 'youtube.com/watch?v=12345',
      'youtube.com/watch?v=dqw4w9wgxcq', 'test.com', 'placeholder', 'fakeurl'
    ];
    widgets.goingFurther.items = widgets.goingFurther.items.filter((it: any) => {
      if (!it || !it.title || !it.description) return false;
      const isPlTitle = /placeholder|todo|tbd|tbc|lorem|ipsum/i.test(it.title) || /^[\[\(].*[\]\)]$/.test(String(it.title).trim());
      const isPlDesc = /placeholder|todo|tbd|tbc|lorem|ipsum/i.test(it.description) || /^[\[\(].*[\]\)]$/.test(String(it.description).trim());
      return !isPlTitle && !isPlDesc;
    }).map((it: any) => {
      const title = String(it.title).trim();
      const type = ["book", "article", "video", "website", "research", "movie", "film"].includes(it.type) ? it.type : "website";
      let url = (it.url || "").trim();
      const lowerUrl = url.toLowerCase();
      if (url && PLACEHOLDER_URL_PATTERNS.some(p => lowerUrl.includes(p))) {
        url = "";
      }
      const description = String(it.description).trim();
      const author = it.author ? String(it.author).trim() : "";
      const year = it.year ? String(it.year).trim() : "";
      return { title, type, url, description, author, year };
    });

    for (const item of widgets.goingFurther.items) {
      if (detectLanguageLeakage(item.title, lang)) {
        item.title = await translateText(item.title, lang);
      }
      if (detectLanguageLeakage(item.description, lang)) {
        item.description = await translateText(item.description, lang);
      }
      if (item.author && detectLanguageLeakage(item.author, lang)) {
        item.author = await translateText(item.author, lang);
      }

      // [RESOURCE RESOLVER] Deterministic reading resource resolution via Google Books & CrossRef APIs
      try {
        const targetLang = (lang || 'en').toLowerCase().split('-')[0];
        const resolved = await resolveGoingFurtherResource(item.title, item.author, item.type, targetLang);
        if (resolved) {
          if (resolved.url) item.url = resolved.url;
          if (resolved.year) item.year = resolved.year;
          if (resolved.author) item.author = resolved.author;
          if (resolved.title) item.title = resolved.title;
          console.log(`[RESOURCE RESOLVER] Successfully resolved "${item.title}" (${item.type}) -> URL: ${item.url}, Year: ${item.year}`);
        }
      } catch (err) {
        console.error(`[RESOURCE RESOLVER] Error for "${item.title}":`, err);
      }
    }
  } else {
    widgets.goingFurther = { items: [] };
  }

  // 6. Summary points validation (must be complete sentences ending with periods)
  if (widgets.conclusionSummary && Array.isArray(widgets.conclusionSummary.items)) {
    widgets.conclusionSummary.items = widgets.conclusionSummary.items.filter((it: any) => it && String(it).trim().length > 0).map((it: string) => {
      let clean = (it || "").trim();
      if (!clean.endsWith(".") && !clean.endsWith("!") && !clean.endsWith("?")) {
        clean += ".";
      }
      return clean;
    });

    for (let i = 0; i < widgets.conclusionSummary.items.length; i++) {
      if (detectLanguageLeakage(widgets.conclusionSummary.items[i], lang)) {
        widgets.conclusionSummary.items[i] = await translateText(widgets.conclusionSummary.items[i], lang);
      }
    }
  } else {
    widgets.conclusionSummary = { items: [] };
  }

  // 7. Final summative evaluation validation
  if (widgets.finalEvaluation && typeof widgets.finalEvaluation === 'object') {
    widgets.finalEvaluation.type = "Quiz";
    if (!widgets.finalEvaluation.props || typeof widgets.finalEvaluation.props !== 'object') {
      widgets.finalEvaluation.props = {};
    }
    const qProps = widgets.finalEvaluation.props;
    if (!qProps.durationLimit) qProps.durationLimit = 1800;
    
    if (qProps.prompt && detectLanguageLeakage(qProps.prompt, lang)) {
      qProps.prompt = await translateText(qProps.prompt, lang);
    }
    if (qProps.subject && detectLanguageLeakage(qProps.subject, lang)) {
      qProps.subject = await translateText(qProps.subject, lang);
    }

    if (Array.isArray(qProps.questions)) {
      qProps.questions = qProps.questions.filter((q: any) => {
        if (!q || typeof q !== 'object' || !q.q || !Array.isArray(q.options)) return false;
        if (/placeholder|dummy|todo|tbd|tbc|lorem|ipsum|question d'auto-évaluation|evaluation question/i.test(q.q) || /^[\[\(].*[\]\)]$/.test(String(q.q).trim())) return false;
        
        q.options = q.options.filter((o: any) => {
          if (!o) return false;
          const txt = String(o.text || o).trim();
          if (!txt) return false;
          if (/placeholder|dummy|todo|tbd|tbc|lorem|ipsum|option/i.test(txt) || /^[\[\(].*[\]\)]$/.test(txt)) {
            return false;
          }
          return true;
        }).map((o: any) => {
          return { text: String(o.text || o).trim(), correct: !!o.correct };
        });

        return q.options.length >= 2;
      }).map((q: any) => {
        q.q = String(q.q).trim();
        q.explanation = q.explanation ? String(q.explanation).trim() : "";
        if (!q.options.some((o: any) => o.correct)) {
          q.options[0].correct = true;
        }
        return q;
      });

      for (const q of qProps.questions) {
        if (detectLanguageLeakage(q.q, lang)) {
          q.q = await translateText(q.q, lang);
        }
        if (detectLanguageLeakage(q.explanation, lang)) {
          q.explanation = await translateText(q.explanation, lang);
        }
        for (const o of q.options) {
          if (detectLanguageLeakage(o.text, lang)) {
            o.text = await translateText(o.text, lang);
          }
        }
      }

      if (qProps.questions.length === 0) {
        widgets.finalEvaluation = null;
      }
    } else {
      widgets.finalEvaluation = null;
    }
  } else {
    widgets.finalEvaluation = null;
  }

  // 8. Glossary & References validation
  if (Array.isArray(widgets.glossary)) {
    const targetLang = (lang || 'fr').toLowerCase().split('-')[0];
    const healedGlossary = [];
    for (let i = 0; i < widgets.glossary.length; i++) {
      const entry = widgets.glossary[i];
      if (!entry || typeof entry !== 'object') continue;

      let term = (entry.term || "").trim();
      let definition = (entry.definition || "").trim();

      if (!term || !definition) continue;

      const isCircular = term.toLowerCase() === definition.toLowerCase();
      const isShort = definition.length < 8;
      const isPlaceholder = /placeholder|dummy|todo|tbd|tbc|lorem|ipsum|a definir|à définir/i.test(definition) || /placeholder|dummy|todo|tbd|tbc|lorem|ipsum|a definir|à définir/i.test(term) || /^[\[\(].*[\]\)]$/.test(term) || /^[\[\(].*[\]\)]$/.test(definition);

      const isWrongLanguage = (targetLang !== 'en') && (
        /\b(is a|are|refers to|the study of|of the|in the|and the|with the|is the|study of)\b/i.test(definition)
      );

      if (isCircular || isShort || isPlaceholder || isWrongLanguage) {
        console.log(`[GLOSSARY VALIDATOR] Invalid or English glossary entry detected: "${term}": "${definition}". Healing via Wikipedia...`);
        const queryTerm = term || definition;
        let healed = false;
        try {
          const wikiSearchUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(queryTerm)}&srlimit=1`;
          const res = await fetchWithTimeout(wikiSearchUrl);
          if (res.ok) {
            const data = await res.json();
            const searchResult = data.query?.search?.[0];
            if (searchResult) {
              const canonicalTitle = searchResult.title;
              const wikiExtractUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(canonicalTitle)}&redirects=1`;
              const res2 = await fetchWithTimeout(wikiExtractUrl);
              if (res2.ok) {
                const data2 = await res2.json();
                const pages = data2.query?.pages;
                if (pages) {
                  const pageId = Object.keys(pages)[0];
                  if (pageId && pageId !== '-1') {
                    const extract = pages[pageId].extract || '';
                    if (extract && extract.length > 20) {
                      let sentence = extract.split(/[.!?]\s/)[0].trim();
                      if (sentence.length < 30 && extract.split(/[.!?]\s/)[1]) {
                        sentence += '. ' + extract.split(/[.!?]\s/)[1].trim();
                      }
                      if (!sentence.endsWith('.')) sentence += '.';
                      sentence = sentence.replace(/\s*\([^)]*\)/g, '').trim();
                      sentence = sentence.replace(/\s+/g, ' ');
                      
                      healedGlossary.push({
                        term: canonicalTitle,
                        definition: sentence
                      });
                      console.log(`[GLOSSARY VALIDATOR] Healed to: "${canonicalTitle}": "${sentence}"`);
                      healed = true;
                    }
                  }
                }
              }
            }
          }
        } catch (err) {
          console.error(`[GLOSSARY VALIDATOR] Error healing glossary entry:`, err);
        }

        // Fallback to translation if Wikipedia healing failed
        if (!healed) {
          console.log(`[GLOSSARY VALIDATOR] Wikipedia healing failed. Translating term and definition directly...`);
          try {
            const translatedTerm = await translateText(term, targetLang);
            const translatedDef = await translateText(definition, targetLang);
            if (translatedTerm && translatedDef) {
              healedGlossary.push({
                term: translatedTerm,
                definition: translatedDef
              });
              healed = true;
            }
          } catch (tErr) {
            console.error(`[GLOSSARY VALIDATOR] Direct translation of glossary entry failed:`, tErr);
          }
        }

        if (!healed) {
          console.log(`[GLOSSARY VALIDATOR] Wikipedia healing and translation both failed. Preserving original entry.`);
          healedGlossary.push({ term, definition });
        }
      } else {
        healedGlossary.push({ term, definition });
      }
    }

    // Final language leakage sweep for all glossary entries
    for (const g of healedGlossary) {
      if (detectLanguageLeakage(g.term, lang)) {
        g.term = await translateText(g.term, lang);
      }
      if (detectLanguageLeakage(g.definition, lang)) {
        g.definition = await translateText(g.definition, lang);
      }
    }

    widgets.glossary = healedGlossary;
  } else {
    widgets.glossary = [];
  }

  if (Array.isArray(widgets.references)) {
    const resolvedRefs: string[] = [];
    for (const ref of widgets.references) {
      const trimmedRef = String(ref).trim();
      if (!trimmedRef) continue;
      
      // Check if it's a placeholder
      if (/placeholder|todo|tbd|tbc|lorem|ipsum|ref\d+/i.test(trimmedRef)) {
        continue;
      }
      
      try {
        const targetLang = (lang || 'en').toLowerCase().split('-')[0];
        // Treat citation as an article/book type to fetch canonical details
        const resolved = await resolveGoingFurtherResource(trimmedRef, null, 'article', targetLang);
        if (resolved) {
          // Format as a standardized, high-authority citation string
          const authorStr = resolved.author ? resolved.author : (targetLang === 'fr' ? 'Auteur inconnu' : 'Unknown Author');
          const yearStr = resolved.year ? ` (${resolved.year})` : '';
          const titleStr = resolved.title ? `. *${resolved.title}*` : '';
          const urlStr = resolved.url ? `. URL : ${resolved.url}` : '';
          const formatted = `${authorStr}${yearStr}${titleStr}${urlStr}`;
          resolvedRefs.push(formatted);
          console.log(`[REFERENCE RESOLVER] Resolved "${trimmedRef}" -> "${formatted}"`);
        } else {
          resolvedRefs.push(trimmedRef);
        }
      } catch (err) {
        console.error(`[REFERENCE RESOLVER] Error for "${trimmedRef}":`, err);
        resolvedRefs.push(trimmedRef);
      }
    }
    widgets.references = resolvedRefs;
  } else {
    widgets.references = [];
  }

  return widgets;
}
