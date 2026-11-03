import { healWikidataEntities } from './wikidataEntityHealer';
import { detectLanguageLeakage, translateText } from './languageLeakageDetector';
import { resolveImageFromSources, compileFinalLabel } from '@/lib/media-resolver';
import { callVertexAI } from '@/lib/vertex-client';

const FORMULA_SUFFIX_MAP: Record<string, string> = {
  FR: ' (formule)',
  EN: ' (formula)',
  ES: ' (fórmula)',
  DE: ' (Formel)',
  ZH: ' (公式)',
  PT: ' (fórmula)',
  AR: ' (صيغة)',
  HI: ' (सूत्र)',
  UR: ' (فارمولا)'
};

const UNKNOWN_AUTHOR_MAP: Record<string, string> = {
  FR: 'Auteur inconnu',
  EN: 'Unknown Author',
  ES: 'Autor desconocido',
  DE: 'Unbekannter Autor',
  ZH: '未知作者',
  PT: 'Autor desconhecido',
  AR: 'مؤلف مجهول',
  HI: 'अज्ञात लेखक',
  UR: 'نامعلوم مصنف'
};

const SEARCH_LANG_MAP: Record<string, string> = {
  FR: 'français',
  EN: 'english',
  ES: 'español',
  DE: 'deutsch',
  ZH: '中文',
  PT: 'português',
  AR: 'العربية',
  HI: 'हिन्दी',
  UR: 'اردو'
};

export async function healInteractiveComponents(
  interactiveComponents: any[],
  targetLang: string,
  discipline?: string
): Promise<any[]> {
  if (!Array.isArray(interactiveComponents)) return interactiveComponents;

  let healedComponents = [...interactiveComponents];

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


      // Heal entities (dates, formulas, SMILES) via Wikidata
      const entityHealed = await healWikidataEntities(comp, targetLang);
      comp = entityHealed;
      props = comp.props || {};

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
            const searchQuery = `${queryName} cours education ${SEARCH_LANG_MAP[targetLang.toUpperCase()] || 'english'}`;
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


  return healedComponents;
}
