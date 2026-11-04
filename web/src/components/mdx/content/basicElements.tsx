import { BasicMathExplorer } from '../BasicMathExplorer';
import { useMdxStatus } from '../MdxStatusContext';
import { ZoomableImage, renderCaptionWithLinks } from '../elements/CustomFigure';
import { useLanguage } from '@/context/LanguageContext';
const isExistingArtwork = (src: string, alt: string) => false;
// renderCaptionWithLinks imported from CustomFigure
import React from 'react';
import { isChildrenEmpty } from '../elements/Alert';
import { Alert } from '../elements/Alert';
import { CustomFigure } from '../elements/CustomFigure';
import { FillInBlanks } from '../Interactive';
import { EquationManipulator } from '../EquationManipulator';
import { ChemicalStoichiometry } from '../ChemicalStoichiometry';

const Callout = ({ type, children }: { type?: string; children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <Alert type={type || 'info'}>{children}</Alert>;
};

const CalloutContainer = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="my-4">{children}</div>;
};

const ImageAlias = (props: any) => {
  return <CustomFigure {...props} />;
};

const Explanation = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="text-slate-400 text-xs italic pl-4 my-1 select-text">• {children}</div>;
};

const Solution = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl my-2 text-xs">
      <div className="text-emerald-400 font-bold mb-1 select-none">Solution :</div>
      <div className="text-slate-300">{children}</div>
    </div>
  );
};
(Solution as any).isSolution = true;
Solution.displayName = 'Solution';

const KeyConcept = ({ title, children }: { title?: string; children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-xl my-4 text-xs font-semibold">
      {title && <div className="text-blue-400 font-bold mb-1">{title}</div>}
      <div className="text-slate-300">{children}</div>
    </div>
  );
};

const Instruction = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="text-slate-400 text-xs italic my-1 select-text">{children}</div>;
};
(Instruction as any).isInstruction = true;
Instruction.displayName = 'Instruction';

const Shape = () => null;

const FillInBlanksWrapper = (props: any) => {
  return <FillInBlanks {...props} />;
};
FillInBlanksWrapper.Input = (props: any) => {
  const Impl = (FillInBlanks as any).Input;
  if (Impl) return <Impl {...props} />;
  return <input type="text" className="inline-block mx-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-sm w-28" placeholder="..." {...props} />;
};

const SmartEquationManipulator = (props: any) => {
  // Check if it's a chemical reaction
  const isChemical = props && (
    props.reaction ||
    (props.equation && (
      props.equation.includes('->') ||
      props.equation.includes('➔') ||
      props.equation.includes('→') ||
      props.equation.includes('-->') ||
      /\b(H[₂2]|O[₂2]|N[₂2]|C|CO[₂2]|H[₂2]O|NH[₃3]|CH[₄4]|C[₆6]H[₁₁12]O[₆6])\b/i.test(props.equation)
    ))
  );

  if (isChemical) {
    return <ChemicalStoichiometry {...props} />;
  }

  // If the props imply basic arithmetic (addition, subtraction, multiplication, division),
  // we render BasicMathExplorer configured with the appropriate initial values.
  const isBasicMath = props && (
    props.variables ||
    props.result ||
    (props.equation && (props.equation.includes('a') || props.equation.includes('b') || props.equation.includes('c')))
  );

  if (isBasicMath) {
    let initialTab: 'add-sub' | 'mul-div' | 'fractions' | 'parentheses' = 'add-sub';
    let initialMode: 'add' | 'sub' | 'mul' | 'div' = 'sub';
    let initialNumA = 8;
    let initialNumB = 3;

    if (props.equation) {
      const eq = props.equation.toLowerCase();
      if (eq.includes('+')) {
        initialTab = 'add-sub';
        initialMode = 'add';
      } else if (eq.includes('-')) {
        initialTab = 'add-sub';
        initialMode = 'sub';
      } else if (eq.includes('*') || eq.includes('x') || eq.includes('times')) {
        initialTab = 'mul-div';
        initialMode = 'mul';
      } else if (eq.includes('/') || eq.includes('div') || eq.includes(':')) {
        initialTab = 'mul-div';
        initialMode = 'div';
      }
    }

    if (Array.isArray(props.variables)) {
      if (props.variables[0] && typeof props.variables[0].initialValue === 'number') {
        initialNumA = props.variables[0].initialValue;
      }
      if (props.variables[1] && typeof props.variables[1].initialValue === 'number') {
        initialNumB = props.variables[1].initialValue;
      }
    }

    return (
      <BasicMathExplorer
        initialTab={initialTab}
        initialMode={initialMode}
        initialNumA={initialNumA}
        initialNumB={initialNumB}
      />
    );
  }

  return <EquationManipulator {...props} />;
};

export const MdxImage = (props: any) => {
  const src = props.src || '';
  const alt = props.alt || '';
  const [failed, setFailed] = React.useState(false);
  const { markDegraded } = useMdxStatus();
  
  const isBlocked = src && src.includes('pollinations.ai') && isExistingArtwork(src, alt);

  React.useEffect(() => {
    if (isBlocked || failed) {
      markDegraded('image');
    }
  }, [isBlocked, failed, markDegraded]);

  if (isBlocked || failed) {
    return null;
  }

  return (
    <ZoomableImage 
      className="rounded-2xl max-w-full h-auto shadow-md border border-slate-900/10 dark:border-slate-800/50 my-8" 
      onError={() => setFailed(true)}
      {...props} 
    />
  );
};

const INTERACTIVE_PEDAGOGICAL_KEYS = new Set([
  'table', 'mermaid', 'functionplotter', 'interactivediagram', 'comparisonslider', 'codesandbox', 
  'gestaltinteractive', 'gestaltlab', 'datachart', 'structureviewer3d', 'quantumorbitalexplorer', 
  'explorateurbonlesquantiques', 'explorateurorbitalesquantiques', 'dynamicsimulation', 'functionmanipulator', 
  'manipulateurfonction', 'explorateurfonctions', 'equationmanipulator', 'manipulateurequation', 
  'explorateurequations', 'chemicalstoichiometry', 'equilibragechimique', 'stoichiometriechimique', 
  'basicmathexplorer', 'explorateurmathsbase', 'biophysicssimulator', 'simulateurbiophysique', 
  'logicgatesimulator', 'simulateurportelogique', 'simulateurporteslogiques', 'geneticspedigreelab', 
  'labgenetiquepedigree', 'carreepunnett', 'orbitalmechanicssim', 'simulateurorbitemecanique', 
  'simulateurorbital', 'periodictable', 'tableauperiodique', 'solarsystemorrery', 'systemesolaire', 
  'financialchart', 'graphiquefinancier', 'waveinterferencesim', 'simulateurondes', 'acousticpianosynth', 
  'synthetiseurpiano', 'sankeydiagram', 'diagrammesankey', 'climateimpactmap', 'climate_impact_map', 
  'carteimpactclimatique', 'geomapexplorer', 'geo_map_explorer', 'explorateurgeographique', 
  'cardsort', 'associationpaires', 'timeline', 'frisechronologique',
  'biography', 'matchingevaluation', 'associationcorrespondance', 'reorderevaluation', 'reordonneritems', 'socraticinput', 'analysesocratique'
]);

const getLocalizedComponentLegend = (componentName: string, lang: string): string => {
  const translations: Record<string, Record<string, string>> = {
    EN: {
      default: "Interactive Widget",
      table: "Interactive Data Table",
      mermaid: "Conceptual Diagram",
      diagram: "Conceptual Diagram",
      simulation: "Interactive Simulation",
    },
    FR: {
      default: "Widget interactif",
      table: "Tableau de données interactif",
      mermaid: "Schéma conceptuel",
      diagram: "Schéma conceptuel",
      simulation: "Simulation interactive",
    },
    ES: {
      default: "Widget interactivo",
      table: "Tabla de datos interactiva",
      mermaid: "Diagrama conceptual",
      diagram: "Diagrama conceptual",
      simulation: "Simulación interactiva",
    },
    DE: {
      default: "Interaktives Widget",
      table: "Interaktive Datentabelle",
      mermaid: "Konzeptionelles Diagramm",
      diagram: "Konzeptionelles Diagramm",
      simulation: "Interaktive Simulation",
    },
    ZH: {
      default: "互动组件",
      table: "互动数据表",
      mermaid: "概念图",
      diagram: "概念图",
      simulation: "互动模拟",
    },
    PT: {
      default: "Widget interativo",
      table: "Tabela de datos interativa",
      mermaid: "Diagrama conceitual",
      diagram: "Diagrama conceitual",
      simulation: "Simulação interativa",
    },
    AR: {
      default: "أداة تفاعلية",
      table: "جدول بيانات تفاعلي",
      mermaid: "مخطط مفاهيمي",
      diagram: "مخطط مفاهيمي",
      simulation: "محاكاة تفاعلية",
    },
    HI: {
      default: "इंटरैक्टिव विजेट",
      table: "इंटरैक्टिव डेटा तालिका",
      mermaid: "वैचारिक आरेख",
      diagram: "वैचारिक आरेख",
      simulation: "इंटरैक्टिव सिमुलेशन",
    },
    UR: {
      default: "انٹرایکٹو وزٹ",
      table: "انٹرایکٹو ڈیٹا ٹیبل",
      mermaid: "تصوراتی خاکہ",
      diagram: "تصوراتی خاکہ",
      simulation: "انٹرایکٹو تخروپن",
    }
  };

  const l = lang.toUpperCase();
  const t = translations[l] || translations.EN;
  const nameLower = componentName.toLowerCase();
  
  if (nameLower.includes('table')) return t.table;
  if (nameLower.includes('mermaid') || nameLower.includes('diagram') || nameLower.includes('timeline') || nameLower.includes('sankey')) return t.mermaid;
  if (nameLower.includes('sim') || nameLower.includes('explorer') || nameLower.includes('simulation') || nameLower.includes('lab') || nameLower.includes('sandbox')) return t.simulation;
  
  return t.default;
};

const withPedagogicalLegend = (WrappedComponent: React.ComponentType<any>, componentName: string) => {
  const ComponentWithLegend = (props: any) => {
    const { language } = useLanguage();
    const legendText = props.caption || props.description || props.legend || props.alt;
    const resolvedLegend = legendText ? String(legendText).trim() : '';

    const cleanName = componentName.replace(/([A-Z])/g, ' $1').trim();
    const finalLegend = resolvedLegend || `${getLocalizedComponentLegend(componentName, language)}: ${cleanName}`;

    return (
      <div className="flex flex-col items-center my-6 w-full">
        <WrappedComponent {...props} caption="" description="" alt="" />
        {finalLegend && (
          <p className="text-center text-xs md:text-sm text-slate-500 dark:text-slate-400 italic mt-3 max-w-2xl px-4 select-text">
            {renderCaptionWithLinks(finalLegend, props.fallbackUrl)}
          </p>
        )}
      </div>
    );
  };
  
  ComponentWithLegend.displayName = `WithPedagogicalLegend(${componentName})`;
  return ComponentWithLegend;
};


export {
  Callout, CalloutContainer, ImageAlias, Explanation, Solution, KeyConcept, Instruction, Shape,
  FillInBlanksWrapper, SmartEquationManipulator
};
