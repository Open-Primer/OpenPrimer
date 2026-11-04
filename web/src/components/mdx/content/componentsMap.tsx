"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, ZoomIn, ZoomOut, X, RotateCcw } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Quiz, Question, Option } from '../Quiz';
import { Glossary } from '../Glossary';
import { GlossaryBlock } from '../GlossaryBlock';
import { Video } from '../Video';
import { FillInBlanks, MetaNote, ExternalSandbox, FillInBlanksQuestion } from '../Interactive';
import { SolvedProblem, Summary, SelfEval, SelfAssessment } from '../AdvancedLearning';
import { RealPerson, HistoricalPerson, FictionalCharacter, Location, EntityLink, EventLink, HistoricalEventLink, EvenementHistorique, Artwork, WebsiteLink, ProjectLink, ConceptLink, TheoremLink, InstitutionLink, SpeciesLink, SpeciesLien, EspeceLien, EspèceLien, OrganismeLien, ChemicalLink, ChemicalLien, MoleculesLien, MoleculeLien, ChimieLien, CelestialLink, CelestialLien, CorpsCeleste, CorpsCéleste, AstroLien } from '../HistoricalPerson';
import { EssayEvaluation } from '../EssayEvaluation';
import { OralEvaluation } from '../OralEvaluation';
import { Prerequisites } from '../Prerequisites';
import { Epistemology } from '../Epistemology';
import { DiagnosticQuiz } from '../DiagnosticQuiz';
import { AudioPlayer } from '../AudioPlayer';
import { PronunciationSandbox } from '../PronunciationSandbox';
import { References } from '../References';
import { Reference } from '../Reference';
import { BiophysicsSimulator } from '../BiophysicsSimulator';
import { LogicGateSimulator } from '../LogicGateSimulator';
import { CardSort } from '../CardSort';
import { SocraticInput } from '../SocraticInput';
import { Timeline } from '../Timeline';
import { Biography } from '../Biography';
import { MatchingEvaluation } from '../MatchingEvaluation';
import { ReorderEvaluation } from '../ReorderEvaluation';
import { LawLink } from '../LawLink';
import { NestingContext } from '../CitationContext';

// New Visual and Interactive Components
import { Mermaid } from '../Mermaid';
import { FunctionPlotter } from '../FunctionPlotter';
import { InteractiveDiagram } from '../InteractiveDiagram';
import { ComparisonSlider } from '../ComparisonSlider';
import { CodeSandbox } from '../CodeSandbox';
import { SolvedExercise, UnsolvedExercise } from '../InteractiveExercises';
import { GestaltInteractive } from '../GestaltInteractive';
import { DataChart } from '../DataChart';
import { StructureViewer3D } from '../StructureViewer3D';
import { QuantumOrbitalExplorer } from '../QuantumOrbitalExplorer';
import { DynamicSimulation } from '../DynamicSimulation';
import { GoingFurther, GoingFurtherItem } from '../GoingFurther';
import { Citation, QuoteBlock, InteractiveQuote } from '../Citation';
import { FunctionManipulator } from '../FunctionManipulator';
import { ClimateImpactMap } from '../ClimateImpactMap';
import { GeoMapExplorer } from '../GeoMapExplorer';
import { EquationManipulator } from '../EquationManipulator';
import { ChemicalStoichiometry } from '../ChemicalStoichiometry';
import { BasicMathExplorer } from '../BasicMathExplorer';
import { GeneticsPedigreeLab } from '../GeneticsPedigreeLab';
import { OrbitalMechanicsSim } from '../OrbitalMechanicsSim';
import { PeriodicTable } from '../PeriodicTable';
import { SolarSystemOrrery } from '../SolarSystemOrrery';
import { FinancialChart } from '../FinancialChart';
import { WaveInterferenceSim } from '../WaveInterferenceSim';
import { AcousticPianoSynth } from '../AcousticPianoSynth';
import { SankeyDiagram } from '../SankeyDiagram';
import { AlertTriangle, Info, ShieldAlert, CheckCircle2, AlertOctagon, Target, BookOpen, Key, Compass, Award, FileText, Calendar, Send, HelpCircle, PenTool, RefreshCw, Play, Timer, Lock, ClipboardCheck } from 'lucide-react';
import { CriticalThinking } from '../CriticalThinking';
import { DidYouKnow } from '../DidYouKnow';
import { HistoricalAnecdote } from '../HistoricalAnecdote';
import { HistoricalEvent as HistoricalFactBlock, HistoricalFact } from '../HistoricalFact';

import { ScientificMethod } from '../ScientificMethod';
import { WhatsNext } from '../WhatsNext';
import { PointOfView } from '../PointOfView';
import { DivergingViews } from '../DivergingViews';
import { BrilliantIdea, IdeeBrillante } from '../BrilliantIdea';
import { DynamicTableChart } from '../DynamicTableChart';
import { Geometry2D } from '../Geometry2D';
import { OpenQuestion } from '../OpenQuestion';
import { ScientificDebate } from '../ScientificDebate';
import { PreviousLessonSummary } from '../PreviousLessonSummary';
import { CareerProfile } from '../CareerProfile';
import { ResearchFocus } from '../ResearchFocus';
import { RecentNewsBridge } from '../RecentNewsBridge';

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
import { MdxStatusProvider, useMdxStatus } from '../MdxStatusContext';
// DegradedModeBanner extracted to ./elements/DegradedModeBanner
import { DegradedModeBanner } from '../elements/DegradedModeBanner';

import { Alert, isChildrenEmpty, ALERT_TITLES } from '../elements/Alert';
// PreCodeInterceptor extracted to ./elements/PreCodeInterceptor
import { PreCodeInterceptor } from '../elements/PreCodeInterceptor';


// CustomFigure and ZoomableImage extracted to ./elements/CustomFigure
import { CustomFigure, ZoomableImage, isExistingArtwork, FIGURE_STRINGS } from '../elements/CustomFigure';

// ClimateImpactMap is now imported modularly from '../ClimateImpactMap'

// Objectives components extracted to ./elements/Objectives
import { Objectives, Objective, Knowledge, Skills, Attitudes } from '../elements/Objectives';

// Evaluations components extracted to ./elements/Evaluations
import {
  SummativeEvaluation, FormativeEvaluation, SummativeEssayPortal,
  EvaluationSection, Assignment, Deadline, Submission, Evaluation,
  FinalProject, FinalWork, Format, Instructions, FinalQuiz,
  QuizQuestion, Answer, Description, Title, FormativeQuiz,
  SUMMATIVE_STRINGS, extractPrompts
} from '../elements/Evaluations';


import {
  Callout, CalloutContainer, ImageAlias, Explanation, Solution, KeyConcept, Instruction, Shape,
  FillInBlanksWrapper, SmartEquationManipulator
} from './basicElements';
import { MdxImage } from './basicElements';

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


export { components };
