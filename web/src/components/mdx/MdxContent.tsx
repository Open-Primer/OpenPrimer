"use client";

import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Quiz, Question, Option } from './Quiz';
import { Glossary } from './Glossary';
import { Video } from './Video';
import { FillInBlanks, MetaNote, ExternalSandbox } from './Interactive';
import { SolvedProblem, Summary, SelfEval, SelfAssessment } from './AdvancedLearning';
import { HistoricalPerson, FictionalCharacter, Location, EntityLink, HistoricalEvent, Artwork } from './HistoricalPerson';
import { EssayEvaluation } from './EssayEvaluation';
import { Prerequisites } from './Prerequisites';
import { Epistemology } from './Epistemology';
import { DiagnosticQuiz } from './DiagnosticQuiz';
import { AudioPlayer } from './AudioPlayer';
import { References } from './References';

// New Visual and Interactive Components
import { Mermaid } from './Mermaid';
import { FunctionPlotter } from './FunctionPlotter';
import { InteractiveDiagram } from './InteractiveDiagram';
import { ComparisonSlider } from './ComparisonSlider';
import { CodeSandbox } from './CodeSandbox';
import { SolvedExercise, UnsolvedExercise } from './InteractiveExercises';
import { DataChart } from './DataChart';
import { StructureViewer3D } from './StructureViewer3D';
import { DynamicSimulation } from './DynamicSimulation';
import { GoingFurther, GoingFurtherItem } from './GoingFurther';
import { FunctionManipulator } from './FunctionManipulator';
import { EquationManipulator } from './EquationManipulator';
import { AlertTriangle, Info, ShieldAlert, CheckCircle2, AlertOctagon, Target, BookOpen, Key, Compass, Award, FileText, Calendar, Send, HelpCircle } from 'lucide-react';
import { CriticalThinking } from './CriticalThinking';
import { DidYouKnow } from './DidYouKnow';
import { HistoricalAnecdote } from './HistoricalAnecdote';
import { ScientificMethod } from './ScientificMethod';
import { WhatsNext } from './WhatsNext';
import { PointOfView } from './PointOfView';
import { IdeeBrillante } from './IdeeBrillante';
import { DynamicTableChart } from './DynamicTableChart';
import { Geometry2D } from './Geometry2D';

import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';

const isChildrenEmpty = (children: React.ReactNode): boolean => {
  if (children === null || children === undefined) {
    return true;
  }
  if (typeof children === 'string') {
    return children.trim() === '';
  }
  if (typeof children === 'number') {
    return false;
  }
  if (Array.isArray(children)) {
    if (children.length === 0) return true;
    return children.every(child => isChildrenEmpty(child));
  }
  if (React.isValidElement(children)) {
    const props = children.props as any;
    if (props && 'children' in props) {
      return isChildrenEmpty(props.children);
    }
    return false;
  }
  return false;
};



const ALERT_TITLES: Record<string, Record<string, string>> = {
  note: {
    EN: "Note",
    FR: "Note",
    ES: "Nota",
    DE: "Hinweis",
    ZH: "提示"
  },
  warning: {
    EN: "Warning",
    FR: "Avertissement",
    ES: "Advertencia",
    DE: "Warnung",
    ZH: "警告"
  },
  info: {
    EN: "Info",
    FR: "Info",
    ES: "Información",
    DE: "Info",
    ZH: "信息"
  },
  important: {
    EN: "Important",
    FR: "Important",
    ES: "Importante",
    DE: "Importante",
    ZH: "重要"
  },
  tip: {
    EN: "Tip",
    FR: "Conseil",
    ES: "Consejo",
    DE: "Tipp",
    ZH: "建议"
  },
  caution: {
    EN: "Caution",
    FR: "Attention",
    ES: "Precaución",
    DE: "Achtung",
    ZH: "注意"
  }
};

const Alert = ({ type, children }: { type: string; children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase();
  const t = (type || 'note').toLowerCase();
  
  let icon = <Info className="w-4 h-4 text-blue-400" />;
  let titleKey = "note";
  let borderClass = "border-l-blue-500 bg-blue-500/5 dark:bg-blue-500/[0.04] border-blue-500/20";
  let titleColor = "text-blue-500 dark:text-blue-400";

  if (t === 'warning') {
    icon = <AlertTriangle className="w-4 h-4 text-amber-500" />;
    titleKey = "warning";
    borderClass = "border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/[0.04] border-amber-500/20";
    titleColor = "text-amber-500 dark:text-amber-400";
  } else if (t === 'info') {
    icon = <Info className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
    titleKey = "info";
    borderClass = "border-l-blue-500 bg-blue-500/5 dark:bg-blue-500/[0.04] border-blue-500/20";
    titleColor = "text-blue-500 dark:text-blue-400";
  } else if (t === 'important') {
    icon = <ShieldAlert className="w-4 h-4 text-rose-500" />;
    titleKey = "important";
    borderClass = "border-l-rose-500 bg-rose-500/5 dark:bg-rose-500/[0.04] border-rose-500/20";
    titleColor = "text-rose-500 dark:text-rose-400";
  } else if (t === 'tip') {
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    titleKey = "tip";
    borderClass = "border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/[0.04] border-emerald-500/20";
    titleColor = "text-emerald-500 dark:text-emerald-400";
  } else if (t === 'caution') {
    icon = <AlertOctagon className="w-4 h-4 text-red-500" />;
    titleKey = "caution";
    borderClass = "border-l-red-500 bg-red-500/5 dark:bg-red-500/[0.04] border-red-500/20";
    titleColor = "text-red-500 dark:text-red-400";
  }

  const title = (ALERT_TITLES[titleKey] && ALERT_TITLES[titleKey][langKey]) || ALERT_TITLES[titleKey]?.EN || "Note";


  return (
    <div className={`my-6 p-5 rounded-2xl border-l-4 ${borderClass} shadow-sm custom-alert alert-${t} transition-all duration-300`}>
      <div className="flex items-center gap-2 mb-2 select-none">
        <div className="flex items-center justify-center">
          {icon}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${titleColor}`}>
          {title}
        </span>
      </div>
      <div className="text-[13px] leading-relaxed font-medium text-slate-800 dark:text-slate-200 alert-content">
        {children}
      </div>
    </div>
  );
};

const PreCodeInterceptor = (props: any) => {
  const children = props.children;
  if (
    children &&
    React.isValidElement(children) &&
    (children.props as any).className === 'language-mermaid'
  ) {
    const codeContent = (children.props as any).children || '';
    return <Mermaid chart={String(codeContent).trim()} />;
  }
  return <pre {...props} />;
};

const CustomFigure = ({ src, alt, caption, fallbackText, fallbackUrl }: { src: string; alt: string; caption: string; fallbackText?: string; fallbackUrl?: string }) => {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onerror = () => setFailed(true);
    img.src = src;
  }, [src]);
  if (failed) return null;
  return (
    <div className="my-8 flex flex-col items-center justify-center gap-2 custom-figure transition-opacity duration-300">
      <img 
        src={src} 
        alt={alt} 
        className="rounded-2xl max-w-full h-auto shadow-md border border-slate-900/10 dark:border-slate-800/50" 
        onError={() => setFailed(true)} 
      />
      {caption && <p className="text-center text-xs md:text-sm text-slate-500 dark:text-slate-400 italic mt-2 max-w-2xl px-4 select-none">{caption}</p>}
      {fallbackText && fallbackUrl && (
        <p className="text-center text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors select-none">
          <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">{fallbackText}</a>
        </p>
      )}
    </div>
  );
};

const Objective = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="text-slate-300 font-medium text-sm leading-relaxed">{children}</div>;
};

const Knowledge = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase() as keyof typeof STATIC_UI_STRINGS;
  const t = STATIC_UI_STRINGS[langKey] || STATIC_UI_STRINGS.EN;

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-950/30 border border-slate-850/50 rounded-2xl">
      <div className="flex items-center gap-2 text-blue-400 mb-1 select-none">
        <BookOpen className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.obj_knowledge}</span>
      </div>
      <div className="text-slate-300 text-xs leading-relaxed prose-li:my-1 prose-ul:pl-4 prose-ul:list-disc">
        {children}
      </div>
    </div>
  );
};

const Skills = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase() as keyof typeof STATIC_UI_STRINGS;
  const t = STATIC_UI_STRINGS[langKey] || STATIC_UI_STRINGS.EN;

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-950/30 border border-slate-850/50 rounded-2xl">
      <div className="flex items-center gap-2 text-emerald-400 mb-1 select-none">
        <Key className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.obj_skills}</span>
      </div>
      <div className="text-slate-300 text-xs leading-relaxed prose-li:my-1 prose-ul:pl-4 prose-ul:list-disc">
        {children}
      </div>
    </div>
  );
};

const Attitudes = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase() as keyof typeof STATIC_UI_STRINGS;
  const t = STATIC_UI_STRINGS[langKey] || STATIC_UI_STRINGS.EN;

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-950/30 border border-slate-850/50 rounded-2xl">
      <div className="flex items-center gap-2 text-violet-400 mb-1 select-none">
        <Compass className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.obj_attitudes}</span>
      </div>
      <div className="text-slate-300 text-xs leading-relaxed prose-li:my-1 prose-ul:pl-4 prose-ul:list-disc">
        {children}
      </div>
    </div>
  );
};

const Objectives = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase() as keyof typeof STATIC_UI_STRINGS;
  const t = STATIC_UI_STRINGS[langKey] || STATIC_UI_STRINGS.EN;

  const childrenArray = React.Children.toArray(children);
  const hasStructuredBoxes = childrenArray.some(
    child => React.isValidElement(child) && (child.type === Knowledge || child.type === Skills || child.type === Attitudes)
  );

  let renderedContent: React.ReactNode;

  if (hasStructuredBoxes) {
    renderedContent = children;
  } else {
    // Distribute linear children into Knowledge, Skills, Attitudes boxes
    const extractLinearItems = (node: React.ReactNode): React.ReactNode[] => {
      if (!node) return [];
      if (Array.isArray(node)) {
        return node.flatMap(n => extractLinearItems(n));
      }
      if (React.isValidElement(node)) {
        const props = node.props as any;
        if (node.type === 'ul' || node.type === 'ol' || node.type === React.Fragment) {
          return extractLinearItems(props.children);
        }
        if (node.type === 'li' || node.type === 'p' || node.type === Objective) {
          return [node];
        }
        if (props && 'children' in props) {
          const subItems = extractLinearItems(props.children);
          if (subItems.length > 0) return subItems;
        }
      }
      if (typeof node === 'string' || typeof node === 'number') {
        return [node];
      }
      return [node];
    };

    const items = extractLinearItems(children).filter(item => !isChildrenEmpty(item));

    const knowledgeItems: React.ReactNode[] = [];
    const skillsItems: React.ReactNode[] = [];
    const attitudesItems: React.ReactNode[] = [];

    items.forEach((item, index) => {
      if (index % 3 === 0) {
        knowledgeItems.push(item);
      } else if (index % 3 === 1) {
        skillsItems.push(item);
      } else {
        attitudesItems.push(item);
      }
    });

    const getItemContent = (item: React.ReactNode): React.ReactNode => {
      if (React.isValidElement(item)) {
        const props = item.props as any;
        if ((item.type === 'li' || item.type === 'p' || item.type === Objective) && props && 'children' in props) {
          return props.children;
        }
      }
      return item;
    };

    renderedContent = (
      <>
        {knowledgeItems.length > 0 && (
          <Knowledge>
            <ul className="list-disc pl-4 space-y-1">
              {knowledgeItems.map((item, idx) => (
                <li key={idx}>{getItemContent(item)}</li>
              ))}
            </ul>
          </Knowledge>
        )}
        {skillsItems.length > 0 && (
          <Skills>
            <ul className="list-disc pl-4 space-y-1">
              {skillsItems.map((item, idx) => (
                <li key={idx}>{getItemContent(item)}</li>
              ))}
            </ul>
          </Skills>
        )}
        {attitudesItems.length > 0 && (
          <Attitudes>
            <ul className="list-disc pl-4 space-y-1">
              {attitudesItems.map((item, idx) => (
                <li key={idx}>{getItemContent(item)}</li>
              ))}
            </ul>
          </Attitudes>
        )}
      </>
    );
  }

  return (
    <div className="my-8 p-6 md:p-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-600/5 rounded-full blur-[40px] pointer-events-none" />
      <div className="flex items-center gap-3 mb-6 select-none border-b border-slate-800/50 pb-4">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white leading-tight">{t.obj_title}</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{t.obj_subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderedContent}
      </div>
    </div>
  );
};

const SummativeEvaluation = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="my-10 p-6 md:p-8 bg-slate-900/40 border border-amber-500/20 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />
      <div className="flex items-center gap-3 mb-6 select-none border-b border-slate-800/50 pb-4">
        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white leading-tight">Évaluation sommative</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Validation du module</p>
        </div>
      </div>
      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};

const EvaluationSection = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="space-y-4 border-t border-slate-800/30 pt-4 first:border-0 first:pt-0">{children}</div>;
};

const Assignment = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl">
      <div className="flex items-center gap-2 text-amber-400 mb-2 select-none">
        <FileText className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">Travail à rendre</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const Deadline = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold my-2 select-none">
      <Calendar className="w-3.5 h-3.5" />
      <span>Date limite : {children}</span>
    </div>
  );
};

const Submission = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-4 bg-slate-950/20 border border-dashed border-slate-800/80 rounded-2xl my-4">
      <div className="flex items-center gap-2 text-slate-400 mb-2 select-none">
        <Send className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">Instructions de soumission</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const Evaluation = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-4 bg-slate-950/20 border border-slate-800 rounded-2xl my-4">
      <div className="flex items-center gap-2 text-blue-400 mb-2 select-none">
        <Award className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">Critères d'évaluation</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const FinalProject = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-5 bg-slate-950/50 border border-blue-500/25 rounded-2xl my-6">
      <div className="flex items-center gap-2 text-blue-400 mb-3 select-none">
        <Award className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">Projet final</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const FinalWork = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="space-y-4">{children}</div>;
};

const Format = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="text-xs text-slate-400 border-l-2 border-slate-700 pl-3 my-2">
      <strong className="text-slate-300">Format : </strong>{children}
    </div>
  );
};

const Instructions = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="space-y-2 my-3">
      <span className="text-xs font-bold text-slate-400 select-none">Instructions :</span>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const FinalQuiz = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-5 bg-slate-950/30 border border-slate-850 rounded-2xl my-6">
      <div className="flex items-center gap-2 text-violet-400 mb-3 select-none">
        <HelpCircle className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">Quiz final d'évaluation</span>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

const QuizQuestion = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="font-semibold text-slate-200 text-sm leading-relaxed mb-2">{children}</div>;
};

const Answer = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="text-slate-300 text-xs pl-4 my-1">• {children}</div>;
};

const Description = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="text-slate-400 text-xs mb-3 italic">{children}</div>;
};

const Title = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <h4 className="text-sm font-black text-white uppercase tracking-wider mb-2">{children}</h4>;
};

const FormativeQuiz = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-5 bg-slate-950/30 border border-slate-850 rounded-2xl my-6">
      <div className="flex items-center gap-2 text-emerald-400 mb-3 select-none">
        <HelpCircle className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">Auto-évaluation / Quiz formatif</span>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

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

const components = {
  Alert,
  CustomFigure,
  Quiz,
  Question,
  Option,
  Glossary,
  Video,
  AudioPlayer,
  Audio: AudioPlayer,
  FillInBlanks,
  MetaNote,
  SolvedProblem,
  Summary,
  SelfEval,
  SelfAssessment,
  HistoricalPerson,
  FictionalCharacter,
  Location,
  Place: Location, // alias for Place
  HistoricalEvent,
  EvenementHistorique: HistoricalEvent,
  EntityLink,
  Artwork,
  EssayEvaluation,
  Prerequisites,
  Epistemology,
  DiagnosticQuiz,
  ExternalSandbox,
  
  // Registering New Interactivity Widgets
  References,
  Mermaid,
  FunctionPlotter,
  InteractiveDiagram,
  ComparisonSlider,
  CodeSandbox,
  SolvedExercise,
  UnsolvedExercise,
  DataChart,
  StructureViewer3D,
  DynamicSimulation,
  GoingFurther,
  GoingFurtherItem,
  FunctionManipulator,
  EquationManipulator,
  pre: PreCodeInterceptor,

  // New Custom Pedagogical Blocks
  CriticalThinking,
  EspritCritique: CriticalThinking,
  DidYouKnow,
  LeSaviezVous: DidYouKnow,
  HistoricalAnecdote,
  AnecdoteHistorique: HistoricalAnecdote,
  ScientificMethod,
  MethodeScientifique: ScientificMethod,
  WhatsNext,
  EtApres: WhatsNext,
  PointOfView,
  PointDeVue: PointOfView,
  Geometry2D,
  Geometrie2D: Geometry2D,
  IdeeBrillante,
  BrilliantIdea: IdeeBrillante,

  // Overriding standard table to render dynamic graphs on toggle
  table: DynamicTableChart,



  // Learning Objectives
  Objectives,
  Objective,
  Knowledge,
  Skills,
  Attitudes,

  // Evaluation & Assignments
  SummativeEvaluation,
  EvaluationSection,
  Assignment,
  Deadline,
  Submission,
  Evaluation,
  FinalProject,
  FinalWork,
  Format,
  Instructions,
  FinalQuiz,
  QuizQuestion,
  Answer,
  Description,
  Title,
  FormativeQuiz,

  // Callouts & Media aliases
  Callout,
  CalloutContainer,
  Image: ImageAlias,
};

interface MdxContentProps {
  source: MDXRemoteSerializeResult;
}

export function MdxContent({ source }: MdxContentProps) {
  return <MDXRemote {...source} components={components as any} />;
}
