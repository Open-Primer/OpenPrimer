"use client";

import React from 'react';
import { dbService } from '@/lib/db';

/**
 * @file MdxErrorBoundary.tsx
 * @description React Error Boundary dedicated to trapping rendering or hydration errors
 * inside MDX courses, providing user-friendly fallback and logging to the backend.
 */

interface MdxErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  courseSlug?: string;
  lessonSlug?: string;
  language?: string;
  rawMdx?: string;
}

interface MdxErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  reported: boolean;
  componentStack?: string | null;
}

const COMPATIBILITY_TRANSLATIONS: Record<string, {
  title: string;
  fallbackText: string;
  singular: { prefix: string; suffix: string };
  plural: { prefix: string; suffix: string };
  categories: {
    singular: Record<string, string>;
    plural: Record<string, string>;
  };
}> = {
  EN: {
    title: "Compatibility Mode Enabled",
    fallbackText: "This chapter is displayed in a simplified version due to an anomaly in the format of the interactive components of the lesson. This incident may be temporary due to the use of external sources. The incident has been reported to the administration.",
    singular: {
      prefix: "This chapter is displayed in a simplified version due to an anomaly in the format of an interactive component (",
      suffix: ") of the lesson. This incident may be temporary due to the use of external sources. The incident has been reported to the administration."
    },
    plural: {
      prefix: "This chapter is displayed in a simplified version due to an anomaly in the format of interactive components (",
      suffix: ") of the lesson. This incident may be temporary due to the use of external sources. The incident has been reported to the administration."
    },
    categories: {
      singular: {
        quiz: "quiz",
        simulations: "simulation",
        diagrams: "diagram/graphic",
        exercises: "exercise",
        blanks: "fill-in-the-blanks",
        tables: "table",
        models3d: "3D model",
        video: "video"
      },
      plural: {
        quiz: "quizzes",
        simulations: "simulations",
        diagrams: "diagrams/graphics",
        exercises: "exercises",
        blanks: "fill-in-the-blanks",
        tables: "tables",
        models3d: "3D models",
        video: "videos"
      }
    }
  },
  FR: {
    title: "Mode de compatibilité activé",
    fallbackText: "Ce chapitre s'affiche en version allégée en raison d'une anomalie dans le format des composants interactifs de la leçon. Cet incident peut être transitoire en raison de l'utilisation de sources externes. L'incident a été signalé à l'administration.",
    singular: {
      prefix: "Ce chapitre s'affiche en version allégée en raison d'une anomalie dans le format d'un composant interactif (",
      suffix: ") de la leçon. Cet incident peut être transitoire en raison de l'utilisation de sources externes. L'incident a été signalé à l'administration."
    },
    plural: {
      prefix: "Ce chapitre s'affiche en version allégée en raison d'une anomalie dans le format de composants interactifs (",
      suffix: ") de la leçon. Cet incident peut être transitoire en raison de l'utilisation de sources externes. L'incident a été signalé à l'administration."
    },
    categories: {
      singular: {
        quiz: "quiz",
        simulations: "simulation",
        diagrams: "schéma/graphique",
        exercises: "exercice",
        blanks: "texte à trous",
        tables: "tableau",
        models3d: "modèle 3D",
        video: "vidéo"
      },
      plural: {
        quiz: "quiz",
        simulations: "simulations",
        diagrams: "schémas/graphiques",
        exercises: "exercices",
        blanks: "textes à trous",
        tables: "tableaux",
        models3d: "modèles 3D",
        video: "vidéos"
      }
    }
  },
  ES: {
    title: "Modo de compatibilidad activado",
    fallbackText: "Este capítulo se muestra en una versión simplificada debido a una anomalía en el formato de los componentes interactivos de la lección. Este incidente puede ser transitorio debido al uso de fuentes externas. El incidente ha sido reportado a la administración.",
    singular: {
      prefix: "Este capítulo se muestra en una versión simplificada debido a una anomalía en el formato de un componente interactivo (",
      suffix: ") de la lección. Este incidente puede ser transitorio debido al uso de fuentes externas. El incidente ha sido reportado a la administración."
    },
    plural: {
      prefix: "Este capítulo se muestra en una versión simplificada debido a una anomalía en el formato de componentes interactivos (",
      suffix: ") de la lección. Este incidente puede ser transitorio debido al uso de fuentes externas. El incidente ha sido reportado a la administración."
    },
    categories: {
      singular: {
        quiz: "cuestionario",
        simulations: "simulación",
        diagrams: "esquema/gráfico",
        exercises: "ejercicio",
        blanks: "ejercicio de rellenar huecos",
        tables: "tabla",
        models3d: "modelo 3D",
        video: "video"
      },
      plural: {
        quiz: "cuestionarios",
        simulations: "simulaciones",
        diagrams: "esquemas/gráficos",
        exercises: "ejercicios",
        blanks: "ejercicios de rellenar huecos",
        tables: "tablas",
        models3d: "modelos 3D",
        video: "videos"
      }
    }
  },
  DE: {
    title: "Kompatibilitätsmodus aktiviert",
    fallbackText: "Dieses Kapitel wird aufgrund einer Anomalie im Format interaktiver Komponenten der Lektion in einer vereinfachten Version angezeigt. Dieser Vorfall kann aufgrund der Verwendung externer Quellen vorübergehend sein. Der Vorfall wurde der Verwaltung gemeldet.",
    singular: {
      prefix: "Dieses Kapitel wird aufgrund einer Anomalie im Format einer interaktiven Komponente (",
      suffix: ") der Lektion in einer vereinfachten Version angezeigt. Dieser Vorfall kann aufgrund der Verwendung externer Quellen vorübergehend sein. Der Vorfall wurde der Verwaltung gemeldet."
    },
    plural: {
      prefix: "Dieses Kapitel wird aufgrund einer Anomalie im Format interaktiver Komponenten (",
      suffix: ") der Lektion in einer vereinfachten Version angezeigt. Dieser Vorfall kann aufgrund der Verwendung externer Quellen vorübergehend sein. Der Vorfall wurde der Verwaltung gemeldet."
    },
    categories: {
      singular: {
        quiz: "Quiz",
        simulations: "Simulation",
        diagrams: "Diagramm/Grafik",
        exercises: "Übung",
        blanks: "Lückentext",
        tables: "Tabelle",
        models3d: "3D-Modell",
        video: "Video"
      },
      plural: {
        quiz: "Quiz",
        simulations: "Simulationen",
        diagrams: "Diagramme/Grafiken",
        exercises: "Übungen",
        blanks: "Lückentexte",
        tables: "Tabellen",
        models3d: "3D-Modelle",
        video: "Videos"
      }
    }
  },
  ZH: {
    title: "兼容模式已启用",
    fallbackText: "本章因课程的互动组件格式异常而以精简版显示。由于使用了外部来源，此问题可能是暂时的。该事件已报告给管理部门。",
    singular: {
      prefix: "本章因课程的单个互动组件（",
      suffix: "）格式异常而以精简版显示。由于使用了外部来源，此问题可能是暂时的。该事件已报告给管理部门。"
    },
    plural: {
      prefix: "本章因课程的多个互动组件（",
      suffix: "）格式异常而以精简版显示。由于使用了外部来源，此问题可能是暂时的。该事件已报告给管理部门。"
    },
    categories: {
      singular: {
        quiz: "小测验",
        simulations: "模拟",
        diagrams: "图表/图形",
        exercises: "练习",
        blanks: "填空题",
        tables: "表格",
        models3d: "3D模型",
        video: "视频"
      },
      plural: {
        quiz: "小测验",
        simulations: "模拟",
        diagrams: "图表/图形",
        exercises: "练习",
        blanks: "填空题",
        tables: "表格",
        models3d: "3D模型",
        video: "视频"
      }
    }
  }
};

function detectComponentsFromError(
  error: Error | null,
  componentStack: string | null | undefined,
  rawMdx: string | undefined
): string[] {
  const detected: string[] = [];
  const errorText = [
    error?.message || '',
    error?.stack || '',
    componentStack || ''
  ].join('\n');

  // Scanning for component classes or tag signatures in stack/message
  if (/Quiz|Question/i.test(errorText)) {
    detected.push('quiz');
  }
  if (/CodeSandbox|ExternalSandbox|DynamicSimulation|ChemicalStoichiometry|BasicMathExplorer|LogicGateSimulator/i.test(errorText)) {
    detected.push('simulations');
  }
  if (/InteractiveDiagram|Mermaid|FunctionPlotter|FunctionManipulator|EquationManipulator|Geometry2D|ComparisonSlider|DataChart/i.test(errorText)) {
    detected.push('diagrams');
  }
  if (/SolvedExercise|UnsolvedExercise|SolvedProblem|SelfAssessment/i.test(errorText)) {
    detected.push('exercises');
  }
  if (/FillInBlanks/i.test(errorText)) {
    detected.push('blanks');
  }
  if (/DynamicTableChart/i.test(errorText)) {
    detected.push('tables');
  }
  if (/StructureViewer3D|QuantumOrbitalExplorer/i.test(errorText)) {
    detected.push('models3d');
  }
  if (/Video|YouTube|Vimeo|IframeVideo/i.test(errorText)) {
    detected.push('video');
  }

  // Fallback to checking the presence of components in raw MDX if nothing was found in the stack
  if (detected.length === 0 && rawMdx) {
    if (/<Quiz/i.test(rawMdx)) detected.push('quiz');
    if (/<(CodeSandbox|ExternalSandbox|DynamicSimulation|ChemicalStoichiometry|BasicMathExplorer)/i.test(rawMdx)) detected.push('simulations');
    if (/<(InteractiveDiagram|Mermaid|FunctionPlotter|FunctionManipulator|EquationManipulator|Geometry2D|ComparisonSlider|DataChart)/i.test(rawMdx)) detected.push('diagrams');
    if (/<(SolvedExercise|UnsolvedExercise|SolvedProblem|SelfAssessment)/i.test(rawMdx)) detected.push('exercises');
    if (/<FillInBlanks/i.test(rawMdx)) detected.push('blanks');
    if (/<DynamicTableChart/i.test(rawMdx)) detected.push('tables');
    if (/<(StructureViewer3D|QuantumOrbitalExplorer)/i.test(rawMdx)) detected.push('models3d');
    if (/<(Video|YouTube|Vimeo|IframeVideo)/i.test(rawMdx)) detected.push('video');
  }

  return Array.from(new Set(detected));
}

function getFormattedCompatibilityMessage(
  error: Error | null,
  componentStack: string | null | undefined,
  rawMdx: string | undefined,
  lang: string
): { title: string; text: string } {
  const language = (lang || 'EN').toUpperCase();
  const trans = COMPATIBILITY_TRANSLATIONS[language] || COMPATIBILITY_TRANSLATIONS.EN;
  const title = trans.title || "Compatibility Mode Enabled";

  const failedKeys = detectComponentsFromError(error, componentStack, rawMdx);

  if (failedKeys.length === 0) {
    return { title, text: trans.fallbackText || COMPATIBILITY_TRANSLATIONS.EN.fallbackText };
  }

  const isSingular = failedKeys.length === 1;
  const config = isSingular ? trans.singular : trans.plural;
  const categoryMap = isSingular ? trans.categories.singular : trans.categories.plural;

  const items = failedKeys.map(key => categoryMap[key] || COMPATIBILITY_TRANSLATIONS.EN.categories[isSingular ? 'singular' : 'plural'][key] || key);
  const separator = language === 'ZH' ? '、' : ', ';
  const listStr = items.join(separator);

  return {
    title,
    text: `${config.prefix}${listStr}${config.suffix}`
  };
}

const CRITICAL_ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  EN: {
    title: "Display Error",
    desc: "This chapter could not be loaded due to a technical display issue. Please proceed to the next step using the navigation or the menu."
  },
  FR: {
    title: "Erreur d'affichage",
    desc: "Ce chapitre n'a pas pu être chargé en raison d'un problème technique d'affichage. Veuillez passer à l'étape suivante à l'aide de la navigation ou du menu."
  },
  ES: {
    title: "Error de visualización",
    desc: "Este capítulo no se pudo cargar debido a un problema técnico de visualización. Continúe con el siguiente paso utilizando la navegación o el menú."
  },
  DE: {
    title: "Anzeigefehler",
    desc: "Dieses Kapitel konnte aufgrund eines technischen Anzeigeproblems nicht geladen werden. Bitte fahren Sie mit dem nächsten Schritt über die Navigation oder das Menü fort."
  },
  ZH: {
    title: "显示错误",
    desc: "由于技术显示问题，无法加载本章。请使用导航或菜单继续下一步。"
  }
};

function getAffectedComponentsList(rawMdx: string | undefined, lang: string): string {
  const language = (lang || 'EN').toUpperCase();
  
  if (!rawMdx) {
    if (isFr) return "des composants interactifs";
    if (language === 'ES') return "de los componentes interactivos";
    if (language === 'DE') return "der interaktiven Komponenten";
    if (language === 'ZH') return "互动组件";
    return "interactive components";
  }

  const detected: string[] = [];

  // Check for components
  if (/<Quiz/i.test(rawMdx)) {
    detected.push('quiz');
  }
  if (/<(CodeSandbox|ExternalSandbox|DynamicSimulation|ChemicalStoichiometry|BasicMathExplorer)/i.test(rawMdx)) {
    detected.push('simulations');
  }
  if (/<(InteractiveDiagram|Mermaid|FunctionPlotter|FunctionManipulator|EquationManipulator|Geometry2D)/i.test(rawMdx)) {
    detected.push('diagrams');
  }
  if (/<(ComparisonSlider|DataChart)/i.test(rawMdx)) {
    detected.push('diagrams'); // Treat DataChart/slider as graphical/diagram components
  }
  if (/<(SolvedExercise|UnsolvedExercise|SolvedProblem|SelfAssessment)/i.test(rawMdx)) {
    detected.push('exercises');
  }
  if (/<FillInBlanks/i.test(rawMdx)) {
    detected.push('blanks');
  }
  if (/<DynamicTableChart/i.test(rawMdx)) {
    detected.push('tables');
  }
  if (/<(StructureViewer3D|QuantumOrbitalExplorer)/i.test(rawMdx)) {
    detected.push('models3d');
  }

  const translations: Record<string, Record<string, string>> = {
    quiz: {
      EN: "quizzes",
      FR: "quiz",
      ES: "cuestionarios",
      DE: "Quiz",
      ZH: "小测验"
    },
    simulations: {
      EN: "simulations",
      FR: "simulations",
      ES: "simulaciones",
      DE: "Simulationen",
      ZH: "模拟"
    },
    diagrams: {
      EN: "diagrams/graphics",
      FR: "schémas/graphiques",
      ES: "esquemas/gráficos",
      DE: "Diagramme/Grafiken",
      ZH: "图表/图形"
    },
    exercises: {
      EN: "exercises",
      FR: "exercices",
      ES: "ejercicios",
      DE: "Übungen",
      ZH: "练习"
    },
    blanks: {
      EN: "fill-in-the-blanks",
      FR: "textes à trous",
      ES: "ejercicios de rellenar huecos",
      DE: "Lückentexte",
      ZH: "填空题"
    },
    tables: {
      EN: "tables",
      FR: "tableaux",
      ES: "tablas",
      DE: "Tabellen",
      ZH: "表格"
    },
    models3d: {
      EN: "3D models",
      FR: "modèles 3D",
      ES: "modelos 3D",
      DE: "3D-Modelle",
      ZH: "3D模型"
    }
  };

  const uniqueDetected = Array.from(new Set(detected));

  const DEFAULT_LABELS: Record<string, string> = {
    EN: "interactive components",
    FR: "des composants interactifs",
    ES: "de los componentes interactivos",
    DE: "der interaktiven Komponenten",
    ZH: "互动组件",
    PT: "de componentes interativos",
    AR: "مكونات تفاعلية",
    HI: "इंटरएक्टिव घटक",
    UR: "انٹرایکٹو اجزاء"
  };

  const baseLabel = DEFAULT_LABELS[language] || DEFAULT_LABELS.EN;
  if (uniqueDetected.length === 0) {
    return baseLabel;
  }

  const items = uniqueDetected.map(key => translations[key]?.[language] || translations[key]?.EN || key);
  const sep = language === 'ZH' ? '、' : ', ';
  return language === 'ZH' ? `${baseLabel}（${items.join(sep)}）` : `${baseLabel} (${items.join(sep)})`;
}

/**
 * React Error Boundary capturing MDX component runtime or hydration exceptions.
 * Automatically displays localized degraded UI fallbacks and logs reports to Supabase.
 */
class MdxErrorBoundary extends React.Component<MdxErrorBoundaryProps, MdxErrorBoundaryState> {
  constructor(props: MdxErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, reported: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, reported: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("MDX rendering / hydration error caught by custom boundary:", error, errorInfo);
    const componentStack = errorInfo.componentStack || null;
    if (!this.state.reported) {
      this.setState({ reported: true, componentStack });
      const course = this.props.courseSlug || 'general';
      const page = this.props.lessonSlug || 'unknown';
      const errorMessage = error?.stack || error?.message || String(error);
      const comment = `MDX_RENDERING_FAILURE: ${errorMessage}\nComponent Stack: ${errorInfo.componentStack || ''}`;
      
      dbService.submitReport(course, page, comment).then(({ error: submitErr }) => {
        if (submitErr) {
          console.error("Failed to submit MDX rendering report to db:", submitErr);
        } else {
          console.log("[ERROR Boundary] Logged MDX rendering failure successfully.");
        }
      }).catch(err => {
        console.error("Exception submitting MDX rendering report:", err);
      });
    } else {
      this.setState({ componentStack });
    }
  }

  render() {
    if (this.state.hasError) {
      const langKey = (this.props.language || 'EN').toUpperCase();
      const crit = CRITICAL_ERROR_MESSAGES[langKey] || CRITICAL_ERROR_MESSAGES.EN;

      if (this.props.fallback) {
        const diag = getFormattedCompatibilityMessage(
          this.state.error,
          this.state.componentStack,
          this.props.rawMdx,
          langKey
        );
        return (
          <div className="w-full">
            <div className="p-5 border border-amber-900/30 bg-amber-950/10 rounded-3xl text-left my-8 select-none shadow-lg animate-fade-in">
              <h3 className="text-amber-400 font-black text-sm tracking-wider uppercase mb-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                {diag.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {diag.text}
              </p>
            </div>
            {this.props.fallback}
          </div>
        );
      }
      return (
        <div className="p-8 border border-red-950/40 bg-red-950/10 rounded-[32px] text-left my-8 shadow-xl">
          <h3 className="text-red-400 font-black text-sm tracking-wider uppercase mb-2">{crit.title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            {crit.desc}
          </p>
          {this.state.error && (
            <pre className="text-[10px] text-red-300/60 overflow-auto max-h-32 mt-4 p-3 bg-black/40 rounded-xl font-mono leading-normal">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}



export { MdxErrorBoundary };
export type { MdxErrorBoundaryProps, MdxErrorBoundaryState };
