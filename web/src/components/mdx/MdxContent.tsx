"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, ZoomIn, ZoomOut, X, RotateCcw } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Quiz, Question, Option } from './Quiz';
import { Glossary } from './Glossary';
import { GlossaryBlock } from './GlossaryBlock';
import { Video } from './Video';
import { FillInBlanks, MetaNote, ExternalSandbox, FillInBlanksQuestion } from './Interactive';
import { SolvedProblem, Summary, SelfEval, SelfAssessment } from './AdvancedLearning';
import { RealPerson, HistoricalPerson, FictionalCharacter, Location, EntityLink, EventLink, HistoricalEventLink, EvenementHistorique, Artwork, WebsiteLink, ProjectLink, ConceptLink, TheoremLink, InstitutionLink, SpeciesLink, SpeciesLien, EspeceLien, EspèceLien, OrganismeLien, ChemicalLink, ChemicalLien, MoleculesLien, MoleculeLien, ChimieLien, CelestialLink, CelestialLien, CorpsCeleste, CorpsCéleste, AstroLien } from './HistoricalPerson';
import { EssayEvaluation } from './EssayEvaluation';
import { OralEvaluation } from './OralEvaluation';
import { Prerequisites } from './Prerequisites';
import { Epistemology } from './Epistemology';
import { DiagnosticQuiz } from './DiagnosticQuiz';
import { AudioPlayer } from './AudioPlayer';
import { PronunciationSandbox } from './PronunciationSandbox';
import { References } from './References';
import { Reference } from './Reference';
import { BiophysicsSimulator } from './BiophysicsSimulator';
import { LogicGateSimulator } from './LogicGateSimulator';
import { CardSort } from './CardSort';
import { SocraticInput } from './SocraticInput';
import { Timeline } from './Timeline';
import { Biography } from './Biography';
import { MatchingEvaluation } from './MatchingEvaluation';
import { ReorderEvaluation } from './ReorderEvaluation';
import { LawLink } from './LawLink';
import { NestingContext } from './CitationContext';

// New Visual and Interactive Components
import { Mermaid } from './Mermaid';
import { FunctionPlotter } from './FunctionPlotter';
import { InteractiveDiagram } from './InteractiveDiagram';
import { ComparisonSlider } from './ComparisonSlider';
import { CodeSandbox } from './CodeSandbox';
import { SolvedExercise, UnsolvedExercise } from './InteractiveExercises';
import { GestaltInteractive } from './GestaltInteractive';
import { DataChart } from './DataChart';
import { StructureViewer3D } from './StructureViewer3D';
import { QuantumOrbitalExplorer } from './QuantumOrbitalExplorer';
import { DynamicSimulation } from './DynamicSimulation';
import { GoingFurther, GoingFurtherItem } from './GoingFurther';
import { Citation, QuoteBlock, InteractiveQuote } from './Citation';
import { FunctionManipulator } from './FunctionManipulator';
import { ClimateImpactMap } from './ClimateImpactMap';
import { GeoMapExplorer } from './GeoMapExplorer';
import { EquationManipulator } from './EquationManipulator';
import { ChemicalStoichiometry } from './ChemicalStoichiometry';
import { BasicMathExplorer } from './BasicMathExplorer';
import { GeneticsPedigreeLab } from './GeneticsPedigreeLab';
import { OrbitalMechanicsSim } from './OrbitalMechanicsSim';
import { PeriodicTable } from './PeriodicTable';
import { SolarSystemOrrery } from './SolarSystemOrrery';
import { FinancialChart } from './FinancialChart';
import { WaveInterferenceSim } from './WaveInterferenceSim';
import { AcousticPianoSynth } from './AcousticPianoSynth';
import { SankeyDiagram } from './SankeyDiagram';
import { AlertTriangle, Info, ShieldAlert, CheckCircle2, AlertOctagon, Target, BookOpen, Key, Compass, Award, FileText, Calendar, Send, HelpCircle, PenTool, RefreshCw, Play, Timer, Lock, ClipboardCheck } from 'lucide-react';
import { CriticalThinking } from './CriticalThinking';
import { DidYouKnow } from './DidYouKnow';
import { HistoricalAnecdote } from './HistoricalAnecdote';
import { HistoricalEvent as HistoricalFactBlock, HistoricalFact } from './HistoricalFact';

import { ScientificMethod } from './ScientificMethod';
import { WhatsNext } from './WhatsNext';
import { PointOfView } from './PointOfView';
import { DivergingViews } from './DivergingViews';
import { BrilliantIdea, IdeeBrillante } from './BrilliantIdea';
import { DynamicTableChart } from './DynamicTableChart';
import { Geometry2D } from './Geometry2D';
import { OpenQuestion } from './OpenQuestion';
import { ScientificDebate } from './ScientificDebate';
import { PreviousLessonSummary } from './PreviousLessonSummary';
import { CareerProfile } from './CareerProfile';
import { ResearchFocus } from './ResearchFocus';
import { RecentNewsBridge } from './RecentNewsBridge';

import { useLanguage } from '@/context/LanguageContext';

function withDisabledOverlays<T extends React.ComponentType<any>>(Component: T): T {
  const WrappedComponent = (props: any) => (
    <NestingContext.Provider value={{ disableOverlays: true }}>
      <Component {...props} />
    </NestingContext.Provider>
  );
  WrappedComponent.displayName = `WithDisabledOverlays(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent as unknown as T;
}

import { STATIC_UI_STRINGS } from '@/lib/translations';
import { dbService } from '@/lib/db';
import { MdxStatusProvider, useMdxStatus } from './MdxStatusContext';
// DegradedModeBanner extracted to ./elements/DegradedModeBanner
import { DegradedModeBanner } from './elements/DegradedModeBanner';

import { Alert, isChildrenEmpty, ALERT_TITLES } from './elements/Alert';
// PreCodeInterceptor extracted to ./elements/PreCodeInterceptor
import { PreCodeInterceptor } from './elements/PreCodeInterceptor';


// CustomFigure and ZoomableImage extracted to ./elements/CustomFigure
import { CustomFigure, ZoomableImage, isExistingArtwork, FIGURE_STRINGS } from './elements/CustomFigure';

// ClimateImpactMap is now imported modularly from './ClimateImpactMap'

// Objectives components extracted to ./elements/Objectives
import { Objectives, Objective, Knowledge, Skills, Attitudes } from './elements/Objectives';

// Evaluations components extracted to ./elements/Evaluations
import {
  SummativeEvaluation, FormativeEvaluation, SummativeEssayPortal,
  EvaluationSection, Assignment, Deadline, Submission, Evaluation,
  FinalProject, FinalWork, Format, Instructions, FinalQuiz,
  QuizQuestion, Answer, Description, Title, FormativeQuiz,
  SUMMATIVE_STRINGS, extractPrompts
} from './elements/Evaluations';

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

const MdxImage = (props: any) => {
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

const components = {
  Alert,
  Biography,
  CustomFigure,
  Visual: CustomFigure,
  VisualMedia: CustomFigure,
  Image: CustomFigure,
  Quiz: withDisabledOverlays(Quiz),
  Question: withDisabledOverlays(Question),
  Option: withDisabledOverlays(Option),
  Glossary,
  Video,
  AudioPlayer,
  Audio: AudioPlayer,
  PronunciationSandbox,
  SandboxPrononciation: PronunciationSandbox,
  Explanation,
  Solution,
  KeyConcept,
  Instruction,
  Shape,
  FillInBlanks: FillInBlanksWrapper,
  'FillInBlanks.Input': FillInBlanksWrapper.Input,
  FillInBlanksQuestion,
  MetaNote,
  SolvedProblem: withDisabledOverlays(SolvedProblem),
  Summary,
  SelfEval: withDisabledOverlays(SelfEval),
  SelfAssessment: withDisabledOverlays(SelfAssessment),
  // ─── Entity Overlays (inline hover cards) ────────────────────────────────
  LawLink,
  LienLoi: LawLink,
  LienJuridique: LawLink,
  RealPerson,                            // Canonical: real/existing person
  HistoricalPerson,                      // Backward-compat alias for RealPerson
  PersonnageHistorique: RealPerson,      // French alias
  FictionalCharacter,                    // Fictional/mythological character
  PersonnageFictif: FictionalCharacter,  // French alias
  Location,
  Place: Location,
  ConceptLink,
  ConceptLien: ConceptLink,
  TheoremLink,
  TheoremeLien: TheoremLink,
  ThéorèmeLien: TheoremLink,
  InstitutionLink,
  InstitutionLien: InstitutionLink,
  Event: EventLink,                      // Canonical: event entity overlay
  HistoricalEventLink,                   // Backward-compat alias
  EvenementHistorique,                   // French alias
  ÉvénementHistorique: EvenementHistorique,
  EntityLink,
  Artwork,
  WebsiteLink,
  ProjectLink,
  SiteWeb: WebsiteLink,
  ProjetLien: WebsiteLink,
  SpeciesLink,
  SpeciesLien,
  EspeceLien,
  EspèceLien,
  OrganismeLien,
  ChemicalLink,
  ChemicalLien,
  MoleculesLien,
  MoleculeLien,
  ChimieLien,
  CelestialLink,
  CelestialLien,
  CorpsCeleste,
  CorpsCéleste,
  AstroLien,
  EssayEvaluation: withDisabledOverlays(EssayEvaluation),
  OralEvaluation: withDisabledOverlays(OralEvaluation),
  EvaluationOrale: withDisabledOverlays(OralEvaluation),
  Prerequisites,
  Epistemology,
  DiagnosticQuiz: withDisabledOverlays(DiagnosticQuiz),
  ExternalSandbox,
  
  // Registering New Interactivity Widgets
  References,
  Reference,
  GlossaryBlock,
  Mermaid,
  FunctionPlotter,
  InteractiveDiagram,
  ComparisonSlider,
  CodeSandbox,
  SolvedExercise,
  UnsolvedExercise,
  GestaltInteractive,
  GestaltLab: GestaltInteractive, // Alias
  DataChart,
  StructureViewer3D,
  QuantumOrbitalExplorer,
  ExplorateurOrbitalesQuantiques: QuantumOrbitalExplorer,
  DynamicSimulation,
  GoingFurther,
  GoingFurtherItem,
  FunctionManipulator,
  ManipulateurFonction: FunctionManipulator,
  ExplorateurFonctions: FunctionManipulator,
  EquationManipulator: SmartEquationManipulator,
  ManipulateurEquation: SmartEquationManipulator,
  ExplorateurEquations: SmartEquationManipulator,
  ChemicalStoichiometry,
  EquilibrageChimique: ChemicalStoichiometry,
  StoichiometrieChimique: ChemicalStoichiometry,
  BasicMathExplorer,
  ExplorateurMathsBase: BasicMathExplorer,
  BiophysicsSimulator,
  SimulateurBiophysique: BiophysicsSimulator,
  LogicGateSimulator,
  SimulateurPorteLogique: LogicGateSimulator,
  SimulateurPortesLogiques: LogicGateSimulator,
  GeneticsPedigreeLab,
  LabGenetiquePedigree: GeneticsPedigreeLab,
  CarreePunnett: GeneticsPedigreeLab,
  OrbitalMechanicsSim,
  SimulateurOrbiteMecanique: OrbitalMechanicsSim,
  SimulateurOrbital: OrbitalMechanicsSim,
  PeriodicTable,
  TableauPeriodique: PeriodicTable,
  SolarSystemOrrery,
  SystemeSolaire: SolarSystemOrrery,
  FinancialChart,
  GraphiqueFinancier: FinancialChart,
  WaveInterferenceSim,
  SimulateurOndes: WaveInterferenceSim,
  AcousticPianoSynth,
  SynthetiseurPiano: AcousticPianoSynth,
  SankeyDiagram,
  DiagrammeSankey: SankeyDiagram,
  ClimateImpactMap,
  climate_impact_map: ClimateImpactMap,
  CarteImpactClimatique: ClimateImpactMap,
  GeoMapExplorer,
  geo_map_explorer: GeoMapExplorer,
  ExplorateurGeographique: GeoMapExplorer,
  CardSort,
  AssociationPaires: CardSort,
  MatchingEvaluation: withDisabledOverlays(MatchingEvaluation),
  AssociationCorrespondance: withDisabledOverlays(MatchingEvaluation),
  ReorderEvaluation: withDisabledOverlays(ReorderEvaluation),
  ReordonnerItems: withDisabledOverlays(ReorderEvaluation),
  SocraticInput: withDisabledOverlays(SocraticInput),
  AnalyseSocratique: withDisabledOverlays(SocraticInput),
  Timeline,
  FriseChronologique: Timeline,
  pre: PreCodeInterceptor,

  // New Custom Pedagogical Blocks
  CriticalThinking,
  EspritCritique: CriticalThinking,
  DidYouKnow,
  LeSaviezVous: DidYouKnow,
  HistoricalAnecdote,
  AnecdoteHistorique: HistoricalAnecdote,
  // ─── Pedagogical Block Components ─────────────────────────────────────────
  HistoricalEvent: HistoricalFactBlock,  // Canonical: historical event block callout
  HistoricalFact,                        // Backward-compat alias
  FaitHistorique: HistoricalFactBlock,   // French alias
  ScientificMethod,
  MethodeScientifique: ScientificMethod,
  WhatsNext,
  EtApres: WhatsNext,
  PointOfView,
  PointDeVue: PointOfView,
  Geometry2D,
  Geometrie2D: Geometry2D,
  BrilliantIdea,
  IdeeBrillante: BrilliantIdea,
  OpenQuestion,
  ScientificDebate,
  Citation,
  Quote: Citation,
  PreviousLessonSummary,
  ResumeLeconPrecedente: PreviousLessonSummary,
  CareerProfile,
  FicheMetier: CareerProfile,
  FocalisationMetier: CareerProfile,
  ResearchFocus,
  QuestionRecherche: ResearchFocus,
  RecentNewsBridge,
  LienActualite: RecentNewsBridge,
  QuoteBlock,
  InteractiveQuote,

  // Opposing theories side-by-side
  DivergingViews: withDisabledOverlays(DivergingViews),
  DivergingView: withDisabledOverlays(DivergingViews),
  VisionsOpposees: withDisabledOverlays(DivergingViews),
  VisionsOpposées: withDisabledOverlays(DivergingViews),

  // Custom standard tag overrides
  a: (props: any) => {
    const href = props.href;
    const isExternal = href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'));
    
    let children = props.children;
    if (typeof children === 'string') {
      const trimmed = children.trim();
      if (trimmed.toLowerCase() === 'read more on wikipedia') {
        children = 'Wikipedia';
      }
    }

    if (isExternal) {
      return (
        <a
          {...props}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return <a {...props}>{children}</a>;
  },

  img: MdxImage,

  // Overriding standard table to render dynamic graphs on toggle
  table: DynamicTableChart,



  // Learning Objectives
  Objectives,
  Objective,
  Knowledge,
  Skills,
  Attitudes,

  // Evaluation & Assignments
  SummativeEvaluation: withDisabledOverlays(SummativeEvaluation),
  TerminalEvaluation: withDisabledOverlays(SummativeEvaluation),
  FormativeEvaluation: withDisabledOverlays(FormativeEvaluation),
  EvaluationSection: withDisabledOverlays(EvaluationSection),
  Assignment,
  Deadline,
  Submission,
  Evaluation: withDisabledOverlays(Evaluation),
  FinalProject,
  FinalWork,
  Format,
  Instructions,
  FinalQuiz: withDisabledOverlays(FinalQuiz),
  QuizQuestion: withDisabledOverlays(QuizQuestion),
  Answer,
  Description,
  Title,
  FormativeQuiz: withDisabledOverlays(FormativeQuiz),

  // Callouts & Media aliases
  Callout,
  CalloutContainer,


  // Fallback safety components to prevent runtime crashes on unmapped tags
  Feedback: () => null,
  DiagramItem: () => null,
  Hotspot: () => null,
  Content: () => null,
};

const UnregisteredComponentFallback = ({ componentName }: { componentName: string }) => {
  const { markDegraded } = useMdxStatus();
  
  React.useEffect(() => {
    console.warn(`[MDX Fallback] Unregistered component encountered: <${componentName} />. Triggering degradation.`);
    markDegraded('widget');
  }, [componentName, markDegraded]);

  return (
    <div className="my-6 p-6 rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-md text-left">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/25">
          ⚠️
        </div>
        <div>
          <h4 className="text-red-400 text-xs font-black uppercase tracking-widest">
            Composant indisponible / Component unavailable
          </h4>
          <p className="text-[10px] text-red-500/70 font-semibold tracking-wide">
            {componentName}
          </p>
        </div>
      </div>
    </div>
  );
};

// MdxErrorBoundary, props and compatibility handlers extracted to ./MdxErrorBoundary
import { MdxErrorBoundary, type MdxErrorBoundaryProps, type MdxErrorBoundaryState } from './MdxErrorBoundary';

function stripJsxAndRender(rawMdx: string) {
  // Clean raw MDX content from JSX tags to prevent rendering errors
  let clean = rawMdx;
  
  // Strip code frontmatter if present
  clean = clean.replace(/^---[\s\S]*?---/, '');
  
  // 1. Flatten Quiz / Auto-Evaluation into instructional text
  clean = clean.replace(/<Quiz[\s\S]*?>([\s\S]*?)<\/Quiz>/gi, (quizBlock, innerContent) => {
    const questionRegex = /<Question\b([^>]*?)>([\s\S]*?)<\/Question>/gi;
    let questionsText = '\n\n### 📝 Auto-Évaluation / Quiz :\n';
    let match;
    let qCount = 0;
    while ((match = questionRegex.exec(innerContent)) !== null) {
      qCount++;
      const attrsStr = match[1];
      const optionsBlock = match[2];
      
      const qMatch = attrsStr.match(/\bq="([^"]*)"/i) || attrsStr.match(/\bq='([^']*)'/i) ||
                     attrsStr.match(/\btext="([^"]*)"/i) || attrsStr.match(/\btext='([^']*)'/i) ||
                     attrsStr.match(/\bquestion="([^"]*)"/i) || attrsStr.match(/\bquestion='([^']*)'/i);
      const questionText = qMatch ? qMatch[1] : 'Question';
      
      questionsText += `\n**Question ${qCount} : ${questionText}**\n`;
      
      const optionRegex = /<Option\b([^>]*?)(?:>([\s\S]*?)<\/Option>|\/>)/gi;
      let optMatch;
      while ((optMatch = optionRegex.exec(optionsBlock)) !== null) {
        const optAttrsStr = optMatch[1];
        const optBody = optMatch[2] || '';
        
        const optTextMatch = optAttrsStr.match(/\btext="([^"]*)"/i) || optAttrsStr.match(/\btext='([^']*)'/i);
        const optionText = optTextMatch ? optTextMatch[1] : optBody.trim();
        
        const isCorrect = optAttrsStr.includes('correct={true}') || optAttrsStr.includes('correct="true"') || optAttrsStr.includes('correct=true');
        questionsText += `${isCorrect ? '✅' : '⬜'} ${optionText}${isCorrect ? ' *(Réponse attendue)*' : ''}\n`;
      }
    }
    if (qCount === 0) {
      return '\n\n*(Quiz interactif non disponible)*\n\n';
    }
    return questionsText + '\n';
  });

  // 2. Flatten CodeSandbox blocks
  clean = clean.replace(/<CodeSandbox([^>]*?)>([\s\S]*?)<\/CodeSandbox>/gi, (m, attrs, content) => {
    const titleMatch = attrs.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Exercice de programmation';
    return `\n\n💻 **[Activité pratique de code : ${title}]**\n${content}\n`;
  });

  // 3. Flatten ExternalSandbox
  clean = clean.replace(/<ExternalSandbox([^>]*?)\/>/gi, (m, attrs) => {
    const titleMatch = attrs.match(/title="([^"]+)"/);
    const urlMatch = attrs.match(/url="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Laboratoire de simulation';
    const url = urlMatch ? urlMatch[1] : '';
    return `\n\n🔗 **[Simulation interactive : ${title}]** *(Disponible en version complète à l'adresse : ${url || 'lien'})*\n`;
  });

  // 4. Flatten InteractiveDiagram
  clean = clean.replace(/<InteractiveDiagram([^>]*?)\/>/gi, (m, attrs) => {
    const titleMatch = attrs.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Schéma explicatif';
    return `\n\n📊 **[Schéma interactif : ${title}]** *(Version dynamique non disponible)*\n`;
  });

  // 5. Flatten ComparisonSlider
  clean = clean.replace(/<ComparisonSlider([^>]*?)\/>/gi, (m, attrs) => {
    const leftMatch = attrs.match(/leftTitle="([^"]+)"/);
    const rightMatch = attrs.match(/rightTitle="([^"]+)"/);
    const left = leftMatch ? leftMatch[1] : 'Avant';
    const right = rightMatch ? rightMatch[1] : 'Après';
    return `\n\n🔄 **[Comparatif : ${left} vs ${right}]** *(Version interactive non disponible)*\n`;
  });

  // Helper to extract attributes from JSX tags
  const getAttr = (attrs: string, name: string): string => {
    let match = attrs.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'));
    if (match) return match[1];
    match = attrs.match(new RegExp(`\\b${name}='([^']*)'`, 'i'));
    if (match) return match[1];
    match = attrs.match(new RegExp(`\\b${name}=\\{([^}]*)\\}`, 'i'));
    if (match) return match[1];
    return '';
  };

  // 6. Flatten SolvedExercise & UnsolvedExercise
  clean = clean.replace(/<SolvedExercise([\s\S]*?)(?:\/>|>([\s\S]*?)<\/SolvedExercise>)/gi, (m, attrs, content) => {
    const title = getAttr(attrs, 'title') || "Exercice d'application";
    const solution = getAttr(attrs, 'solution');
    const mainContent = (content || '').trim();
    
    let result = `\n\n✏️ **[Exercice résolu : ${title}]**\n`;
    if (mainContent) {
      result += `${mainContent}\n`;
    }
    if (solution) {
      result += `**Solution :** ${solution}\n`;
    }
    return result;
  });
  clean = clean.replace(/<UnsolvedExercise([\s\S]*?)(?:\/>|>([\s\S]*?)<\/UnsolvedExercise>)/gi, (m, attrs, content) => {
    const title = getAttr(attrs, 'title') || 'Exercice à résoudre';
    const question = getAttr(attrs, 'question');
    const hint = getAttr(attrs, 'hint');
    const solution = getAttr(attrs, 'solution');
    const mainContent = (content || '').trim();
    
    let result = `\n\n✏️ **[Exercice pratique : ${title}]**\n`;
    const body = question || mainContent;
    if (body) {
      result += `${body}\n`;
    }
    if (hint) {
      result += `*Indice :* ${hint}\n`;
    }
    if (solution) {
      result += `*Solution :* ${solution}\n`;
    }
    return result;
  });

  // 7. Flatten mathematical/science utility manipulators
  clean = clean.replace(/<FunctionPlotter([^>]*?)\/>/gi, (m, attrs) => {
    const formulaMatch = attrs.match(/formula="([^"]+)"/);
    const formula = formulaMatch ? formulaMatch[1] : '';
    return `\n\n📈 **[Visualiseur de courbe]**\n${formula ? `Équation : \`y = ${formula}\`` : ''}\n`;
  });
  clean = clean.replace(/<FunctionManipulator([^>]*?)\/>/gi, (m, attrs) => {
    const formulaMatch = attrs.match(/formula="([^"]+)"/);
    const formula = formulaMatch ? formulaMatch[1] : '';
    return `\n\n📈 **[Explorateur de fonction]**\n${formula ? `Équation interactive : \`y = ${formula}\`` : ''}\n`;
  });

  // 8. Flatten Mermaid diagrams
  clean = clean.replace(/<Mermaid([^>]*?)>([\s\S]*?)<\/Mermaid>/gi, (m, attrs, content) => {
    return `\n\n📋 **[Diagramme structurel Mermaid]**\n\`\`\`mermaid\n${content.trim()}\n\`\`\`\n`;
  });

  // 9. Clean up FillInBlanks dot notations and wrappers
  clean = clean.replace(/<FillInBlanks\.Input[^>]*?answer="([^"]+)"[^>]*?\/>/gi, ' **[ $1 ]** ');
  clean = clean.replace(/<FillInBlanks\.Input[^>]*?\/>/gi, ' **[ _______ ]** ');
  clean = clean.replace(/<FillInBlanksQuestion\b[^>]*?q="([^"]+)"[^>]*?\/>/gi, (m, qVal) => {
    return `\n\n📖 **[Exercice à trous]**\n${qVal}\n`;
  });
  clean = clean.replace(/<FillInBlanks[\s\S]*?>([\s\S]*?)<\/FillInBlanks>/gi, (m, content) => {
    return `\n\n📖 **[Exercice à trous]**\n${content.replace(/<[^>]+>/g, '')}\n`;
  });

  // 10. Replace inline named components with text formatting
  clean = clean.replace(/<(?:RealPerson|HistoricalPerson|Event|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|FictionalCharacter|Location|Place|WebsiteLink|ProjectLink|SiteWeb|ProjetLien|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien|LawLink|LienLoi|LienJuridique)\b[^>]*?>([\s\S]*?)<\/(?:RealPerson|HistoricalPerson|Event|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|FictionalCharacter|Location|Place|WebsiteLink|ProjectLink|SiteWeb|ProjetLien|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien|LawLink|LienLoi|LienJuridique)>/gi, '**$1**');
  clean = clean.replace(/<Artwork\b[^>]*?>([\s\S]*?)<\/Artwork>/gi, '*$1*');
  
  // Strip remaining custom tag structures but preserve their content
  clean = clean.replace(/<[A-Za-z0-9_.-]+[^>]*>/g, '');
  clean = clean.replace(/<\/[A-Za-z0-9_.-]+>/g, '');
  
  const lines = clean.split('\n');
  return (
    <div className="space-y-6 select-text opacity-95 leading-relaxed text-slate-300">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} className="text-xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">{trimmed.substring(3)}</h2>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="text-lg font-bold text-white mt-6 mb-3">{trimmed.substring(4)}</h3>;
        }
        if (trimmed.startsWith('#### ')) {
          return <h4 key={idx} className="text-base font-bold text-white mt-4 mb-2">{trimmed.substring(5)}</h4>;
        }
        
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return <li key={idx} className="ml-6 list-disc my-1">{trimmed.substring(2)}</li>;
        }
        if (/^\d+\.\s+/.test(trimmed)) {
          const content = trimmed.replace(/^\d+\.\s+/, '');
          return <li key={idx} className="ml-6 list-decimal my-1">{content}</li>;
        }
        
        if (trimmed.startsWith('> ')) {
          return <blockquote key={idx} className="border-l-4 border-slate-700 pl-4 py-1 italic my-4 text-slate-400">{trimmed.substring(2)}</blockquote>;
        }
        
        return <p key={idx} className="my-4">{trimmed}</p>;
      })}
    </div>
  );
}

interface MdxContentProps {
  source: MDXRemoteSerializeResult;
  rawMdx?: string;
  courseSlug?: string;
  lessonSlug?: string;
}

export function MdxContent(props: MdxContentProps) {
  return (
    <MdxStatusProvider courseSlug={props.courseSlug} lessonSlug={props.lessonSlug}>
      <MdxContentInner {...props} />
    </MdxStatusProvider>
  );
}

function MdxContentInner({ source, rawMdx, courseSlug, lessonSlug }: MdxContentProps) {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const container = containerRef.current;
    
    // Select elements we want to track (excluding components wrappers that might double count)
    // We observe headers, paragraphs, and list items, plus major widgets
    const elementsToObserve = container.querySelectorAll(
      'p, h1, h2, h3, h4, h5, h6, blockquote, li, pre, .custom-alert'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const textSnippet = el.textContent?.trim().slice(0, 150) || '';
          const index = Array.from(elementsToObserve).indexOf(el);
          const total = elementsToObserve.length;

          // Dispatch a custom event to notify other components (e.g. AITutorOverlay)
          const progressEvent = new CustomEvent('op_reading_progress', {
            detail: {
              textSnippet,
              index,
              total,
              tagName: el.tagName.toLowerCase(),
              courseSlug,
              lessonSlug
            }
          });
          window.dispatchEvent(progressEvent);
        }
      });
    }, {
      root: null, // viewport
      rootMargin: '-10% 0px -65% 0px', // Focused reading zone in the upper middle
      threshold: 0.1
    });

    elementsToObserve.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [source, rawMdx, courseSlug, lessonSlug]);

  const runtimeComponents = React.useMemo(() => {
    // Create a client-side wrapper function component
    const wrapper = (props: any) => {
      return React.createElement(FillInBlanks, props);
    };

    // Attach the Input component to the wrapper function component
    wrapper.Input = (props: any) => {
      const Impl = (FillInBlanks as any).Input;
      if (Impl) {
        return React.createElement(Impl, props);
      }
      return React.createElement('input', {
        type: 'text',
        className: 'inline-block mx-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-sm w-28',
        placeholder: '...',
        ...props
      });
    };

    const baseComponents: Record<string, any> = {
      ...components,
      FillInBlanks: wrapper,
      'FillInBlanks.Input': wrapper.Input,
    };

    for (const key of Object.keys(baseComponents)) {
      if (INTERACTIVE_PEDAGOGICAL_KEYS.has(key.toLowerCase()) && baseComponents[key]) {
        baseComponents[key] = withPedagogicalLegend(baseComponents[key], key);
      }
    }

    return new Proxy(baseComponents, {
      get(target, prop, receiver) {
        if (typeof prop === 'string') {
          // If it starts with a lowercase letter, it's a standard HTML element, do not intercept
          if (prop[0] === prop[0].toLowerCase() || prop.startsWith('_') || prop.startsWith('$$')) {
            return Reflect.get(target, prop, receiver);
          }
          
          if (prop in target) {
            return Reflect.get(target, prop, receiver);
          }

          // Case-insensitive fallback check
          const keys = Object.keys(target);
          const matchedKey = keys.find(k => k.toLowerCase() === prop.toLowerCase());
          if (matchedKey) {
            return target[matchedKey as keyof typeof target];
          }

          // Return a functional component that logs and returns a warning
          return (props: any) => <UnregisteredComponentFallback componentName={prop} {...props} />;
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="mdx-content-container">
      <DegradedModeBanner />
      <MdxErrorBoundary 
        fallback={rawMdx ? stripJsxAndRender(rawMdx) : undefined}
        courseSlug={courseSlug}
        lessonSlug={lessonSlug}
        language={language}
        rawMdx={rawMdx}
      >
        <MDXRemote {...source} components={runtimeComponents as any} />
      </MdxErrorBoundary>
    </div>
  );
}
