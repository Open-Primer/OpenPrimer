"use client";

import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Quiz, Question, Option } from './Quiz';
import { Glossary } from './Glossary';
import { Video } from './Video';
import { FillInBlanks, MetaNote, ExternalSandbox } from './Interactive';
import { SolvedProblem, Summary, SelfEval, SelfAssessment } from './AdvancedLearning';
import { HistoricalPerson, FictionalCharacter, Location, EntityLink, HistoricalEvent, Artwork, HistoricalFact } from './HistoricalPerson';
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
import { GestaltInteractive } from './GestaltInteractive';
import { DataChart } from './DataChart';
import { StructureViewer3D } from './StructureViewer3D';
import { DynamicSimulation } from './DynamicSimulation';
import { GoingFurther, GoingFurtherItem } from './GoingFurther';
import { FunctionManipulator } from './FunctionManipulator';
import { EquationManipulator } from './EquationManipulator';
import { ChemicalStoichiometry } from './ChemicalStoichiometry';
import { BasicMathExplorer } from './BasicMathExplorer';
import { AlertTriangle, Info, ShieldAlert, CheckCircle2, AlertOctagon, Target, BookOpen, Key, Compass, Award, FileText, Calendar, Send, HelpCircle, PenTool, RefreshCw, Play, Timer, Lock, ClipboardCheck } from 'lucide-react';
import { CriticalThinking } from './CriticalThinking';
import { DidYouKnow } from './DidYouKnow';
import { HistoricalAnecdote } from './HistoricalAnecdote';

import { ScientificMethod } from './ScientificMethod';
import { WhatsNext } from './WhatsNext';
import { PointOfView } from './PointOfView';
import { IdeeBrillante } from './IdeeBrillante';
import { DynamicTableChart } from './DynamicTableChart';
import { Geometry2D } from './Geometry2D';
import { OpenQuestion } from './OpenQuestion';
import { ScientificDebate } from './ScientificDebate';

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
      <div className="text-[13px] leading-relaxed font-medium text-slate-200 alert-content">
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

const SUMMATIVE_STRINGS = {
  EN: {
    select_subject: "Choose a subject to validate",
    prerequisites: "Prerequisites & Advice",
    prep_advice: "Before starting, ensure you have reviewed the course material. Take a moment to organize your thoughts.",
    focus_advice: "Ensure you have about 15 minutes of uninterrupted focus to write your response.",
    start: "Start Module Validation",
    time_limit: "Recommended time limit: 15 minutes",
    time_remaining: "Time remaining:",
    time_expired: "Time's up! You can still review and submit your work.",
    placeholder: "Type your essay response here...",
    words: "words",
    words_target: "Recommended: 100 to 300 words",
    submit: "Submit for Tutor Validation",
    evaluating: "Tutor is grading your work...",
    grade: "Grade",
    feedback_title: "AI Tutor Feedback",
    retry: "Try another response",
    saved_local: "Validated and saved locally",
    guest_alert: "💡 In guest mode, your grade is saved temporarily in this browser session. Create an account to save it permanently!"
  },
  FR: {
    select_subject: "Choisissez un sujet pour valider le module",
    prerequisites: "Prérequis & Conseils",
    prep_advice: "Avant de commencer, utilisez vos notes et assurez-vous d'avoir bien assimilé le cours. Prenez un moment pour organiser vos idées.",
    focus_advice: "Assurez-vous de disposer de 15 minutes de concentration ininterrompue pour rédiger votre devoir.",
    start: "Démarrer la Validation",
    time_limit: "Temps conseillé : 15 minutes",
    time_remaining: "Temps restant :",
    time_expired: "Temps écoulé ! Vous pouvez toujours finaliser et soumettre votre copie.",
    placeholder: "Saisissez votre rédaction ici...",
    words: "mots",
    words_target: "Conseillé : 100 à 300 mots",
    submit: "Soumettre pour validation tuteur",
    evaluating: "Le tuteur évalue votre copie...",
    grade: "Note",
    feedback_title: "Commentaire du Tuteur IA",
    retry: "Recommencer la validation",
    saved_local: "Validé & enregistré localement",
    guest_alert: "💡 En mode invité, votre note est temporaire. Créez un compte pour la sauvegarder de manière permanente !"
  },
  ES: {
    select_subject: "Elija un tema para validar el módulo",
    prerequisites: "Prerrequisitos y consejos",
    prep_advice: "Antes de comenzar, asegúrese de haber revisés el material. Tómese un momento para organizar sus ideas.",
    focus_advice: "Asegúrese de tener unos 15 minutos de enfoque ininterrumpido para redactar.",
    start: "Iniciar Validación",
    time_limit: "Tiempo recomendado: 15 minutos",
    time_remaining: "Tiempo restante:",
    time_expired: "¡Tiempo agotado! Aún puede revisar y enviar su trabajo.",
    placeholder: "Escriba su ensayo aquí...",
    words: "palabras",
    words_target: "Recomendado: 100 a 300 palabras",
    submit: "Enviar para validación del tutor",
    evaluating: "El tutor está calificando...",
    grade: "Calificación",
    feedback_title: "Comentarios del Tutor de IA",
    retry: "Intentar otra respuesta",
    saved_local: "Validado y guardado localmente",
    guest_alert: "💡 En modo invitado, su calificación es temporal. ¡Cree una cuenta para guardarla permanentemente!"
  },
  DE: {
    select_subject: "Wählen Sie ein Thema zur Validierung",
    prerequisites: "Voraussetzungen & Ratschläge",
    prep_advice: "Stellen Sie vor dem Start sicher, dass Sie den Stoff wiederholt haben. Nehmen Sie sich Zeit, um Ihre Gedanken zu ordnen.",
    focus_advice: "Stellen Sie sicher, dass Sie 15 Minuten ungestörte Konzentration haben.",
    start: "Validierung starten",
    time_limit: "Empfohlene Zeit: 15 Minuten",
    time_remaining: "Verbleibende Zeit:",
    time_expired: "Zeit abgelaufen! Sie können Ihre Arbeit trotzdem überprüfen und einreichen.",
    placeholder: "Schreiben Sie Ihren Aufsatz hier...",
    words: "Wörter",
    words_target: "Empfohlen: 100 bis 300 Wörter",
    submit: "Zur Validierung einreichen",
    evaluating: "Tutor bewertet Ihre Arbeit...",
    grade: "Note",
    feedback_title: "Feedback des KI-Tutors",
    retry: "Erneut versuchen",
    saved_local: "Validiert & lokal gespeichert",
    guest_alert: "💡 Im Gastmodus ist Ihre Note vorübergehend. Registrieren Sie sich, um sie dauerhaft zu speichern!"
  },
  ZH: {
    select_subject: "选择一个主题进行模块验证",
    prerequisites: "准备工作与建议",
    prep_advice: "在开始之前，请确保您已复习好课程材料。花点时间整理您的思路。",
    focus_advice: "确保您有大约15分钟无打扰的专注时间来进行撰写。",
    start: "开始验证评估",
    time_limit: "推荐限时：15分钟",
    time_remaining: "剩余时间：",
    time_expired: "时间到！您仍可以修改并提交您的答案。",
    placeholder: "在此输入您的答案...",
    words: "字",
    words_target: "建议字数：100 至 300 字",
    submit: "提交导师验证",
    evaluating: "导师正在评估您的作品...",
    grade: "评分",
    feedback_title: "AI导师评估反馈",
    retry: "重新进行验证",
    saved_local: "已验证并保存在本地",
    guest_alert: "💡 在游客模式下，您的成绩是暂时的。注册账户以永久保存您的学习记录！"
  }
};

const extractPrompts = (nodes: React.ReactNode[]): string[] => {
  const prompts: string[] = [];
  const getTextFromNode = (node: React.ReactNode): string => {
    if (!node) return '';
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node);
    }
    if (Array.isArray(node)) {
      return node.map(getTextFromNode).join('');
    }
    if (React.isValidElement(node)) {
      const props = node.props as any;
      if (props && 'children' in props) {
        return getTextFromNode(props.children);
      }
    }
    return '';
  };
  
  const traverse = (node: React.ReactNode) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(traverse);
      return;
    }
    if (React.isValidElement(node)) {
      const type = node.type;
      const props = node.props as any;
      
      if (type === Quiz || (typeof type === 'function' && type.name === 'Quiz')) {
        return;
      }
      
      if (type === 'p' || type === 'li' || type === 'div') {
        const text = getTextFromNode(node);
        if (text.trim() && text.length > 15) {
          prompts.push(text.trim());
        }
      } else if (props && 'children' in props) {
        React.Children.toArray(props.children).forEach(traverse);
      }
    } else if (typeof node === 'string' || typeof node === 'number') {
      const text = String(node).trim();
      if (text && text.length > 15) {
        prompts.push(text);
      }
    }
  };

  nodes.forEach(traverse);
  return prompts;
};

const SummativeEssayPortal = ({ childrenArray, durationLimit = 900 }: { childrenArray: React.ReactNode[]; durationLimit?: number }) => {
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase() as keyof typeof SUMMATIVE_STRINGS;
  const t = SUMMATIVE_STRINGS[langKey] || SUMMATIVE_STRINGS.EN;

  const prompts = React.useMemo(() => extractPrompts(childrenArray), [childrenArray]);

  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [isStarted, setIsStarted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(durationLimit);
  const [answer, setAnswer] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [grade, setGrade] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = React.useState(false);

  const activePrompt = prompts[selectedIdx] || '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const storageKey = React.useMemo(() => {
    return `op_summative_${pathname}_${encodeURIComponent(activePrompt.slice(0, 30))}`;
  }, [pathname, activePrompt]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswer(parsed.answer || '');
          setGrade(parsed.grade || null);
          setFeedback(parsed.feedback || null);
          setIsReadOnly(true);
          setIsStarted(true);
        } catch (e) {
          // ignore
        }
      } else {
        setAnswer('');
        setGrade(null);
        setFeedback(null);
        setIsReadOnly(false);
        setIsStarted(false);
        setTimeLeft(durationLimit);
      }
    }
  }, [storageKey, durationLimit]);

  React.useEffect(() => {
    if (!isStarted || isReadOnly || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted, isReadOnly, timeLeft]);

  const wordCount = React.useMemo(() => {
    return answer.trim().split(/\s+/).filter(Boolean).length;
  }, [answer]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsStarted(true);
    setError(null);
  };

  const handleSubmit = async () => {
    if (wordCount < 10) {
      setError(language === 'FR' ? 'Votre réponse doit contenir au moins 10 mots.' : 'Your answer must contain at least 10 words.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: activePrompt,
          answer,
          gradingSystem: '0/20',
          subject: pathname.split('/')[2] || 'Pedagogy',
          level: 'L1'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || (language === 'FR' ? 'Erreur de connexion avec le tuteur IA.' : 'Failed to connect to the AI tutor.'));
      }

      const data = await response.json();
      if (data.success) {
        setGrade(data.grade);
        setFeedback(data.feedback);
        setIsReadOnly(true);

        localStorage.setItem(storageKey, JSON.stringify({
          answer,
          grade: data.grade,
          feedback: data.feedback
        }));

        window.dispatchEvent(new Event('op_progress_updated'));
      } else {
        throw new Error(data.error || 'Evaluation failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (confirm(language === 'FR' ? "Voulez-vous recommencer cette évaluation ? Votre note actuelle sera effacée." : "Are you sure you want to restart this evaluation? Your current grade will be erased.")) {
      localStorage.removeItem(storageKey);
      setAnswer('');
      setGrade(null);
      setFeedback(null);
      setIsReadOnly(false);
      setIsStarted(false);
      setTimeLeft(durationLimit);
      setError(null);
    }
  };

  if (prompts.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 text-xs">
        {language === 'FR' ? "Aucun sujet d'évaluation détecté." : "No evaluation prompts detected."}
      </div>
    );
  }

  return (
    <div className="my-10 p-6 md:p-8 bg-slate-900/40 border border-amber-500/20 rounded-[40px] backdrop-blur-md relative overflow-hidden shadow-xl shadow-amber-500/2">
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 select-none border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-black text-white leading-tight">
              {language === 'FR' ? "Évaluation sommative" : "Summative Evaluation"}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              {language === 'FR' ? "Validation du module" : "Module Validation"}
            </p>
          </div>
        </div>

        {isStarted && !isReadOnly && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black border transition-all ${
              timeLeft < 180 
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 animate-pulse' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}>
              <Timer className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:inline">
              {t.time_limit}
            </span>
          </div>
        )}
      </div>

      {prompts.length > 1 && !isStarted && (
        <div className="mb-6 text-left">
          <label className="text-slate-400 text-xs font-bold block mb-3 uppercase tracking-wider">
            {t.select_subject}
          </label>
          <div className="grid grid-cols-1 gap-3">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`p-4 rounded-2xl text-left text-sm transition-all border cursor-pointer ${
                  selectedIdx === idx
                    ? 'bg-amber-500/10 border-amber-500/50 text-white font-bold'
                    : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                }`}
              >
                <div className="flex gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    selectedIdx === idx ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{p}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {(isStarted || prompts.length === 1) && (
        <div className="mb-6 p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-left">
          <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block mb-1">
            {language === 'FR' ? `Sujet choisi` : `Selected Prompt`}
          </span>
          <p className="text-slate-200 text-sm leading-relaxed font-semibold">
            {activePrompt}
          </p>
        </div>
      )}

      {!isStarted ? (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950/20 border border-slate-900 text-left">
            <h4 className="text-slate-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 mb-3">
              <ClipboardCheck className="w-4 h-4 text-amber-400" />
              {t.prerequisites}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{t.prep_advice}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{t.focus_advice}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{language === 'FR' ? "L'évaluation se fait sous forme de rédaction structurée." : "The evaluation requires a structured written response."}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all cursor-pointer transform active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t.start}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={isReadOnly}
              placeholder={t.placeholder}
              className={`w-full min-h-[220px] p-5 bg-slate-950/40 border rounded-2xl text-slate-200 text-sm leading-relaxed placeholder-slate-600 focus:outline-none transition-all ${
                isReadOnly 
                  ? 'border-slate-800/80 cursor-default opacity-85' 
                  : 'border-slate-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20'
              }`}
            />
            {isReadOnly && (
              <div className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 select-none bg-slate-950 px-2 py-1 rounded-lg border border-slate-900">
                <Lock className="w-3 h-3" />
                <span>{language === 'FR' ? "Verrouillé" : "Locked"}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs select-none">
            <span className={`font-semibold ${wordCount < 100 ? 'text-slate-500' : 'text-slate-400'}`}>
              {wordCount} {t.words} <span className="text-slate-600 font-normal">({t.words_target})</span>
            </span>

            {timeLeft <= 0 && !isReadOnly && (
              <span className="text-rose-400 font-bold">
                ⚠️ {t.time_expired}
              </span>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 text-left">
              <span className="shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {!isReadOnly ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isLoading
                  ? 'bg-slate-800 text-slate-500 border border-slate-700/50'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/10'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.evaluating}</span>
                </>
              ) : (
                <>
                  <PenTool className="w-4 h-4" />
                  <span>{t.submit}</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 rounded-3xl bg-slate-950/60 border border-emerald-500/20 flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex flex-col items-center justify-center shrink-0 mx-auto md:mx-0 shadow-inner">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
                    {t.grade}
                  </span>
                  <span className="text-xl font-black text-white leading-none font-mono">
                    {grade}
                  </span>
                </div>

                <div className="flex-1 text-left">
                  <h4 className="text-slate-200 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t.feedback_title}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {feedback}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-2xl text-[11px] text-slate-500 text-left font-medium leading-relaxed">
                {t.guest_alert}
              </div>

              <button
                onClick={handleRetry}
                className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white rounded-2xl border border-slate-800/80 hover:border-slate-700/80 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.retry}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SummativeEvaluation = ({ children, durationLimit }: { children: React.ReactNode; durationLimit?: number }) => {
  if (isChildrenEmpty(children)) return null;

  const childrenArray = React.Children.toArray(children);
  
  // Check if children contain a Quiz component
  const hasQuiz = childrenArray.some(
    child => React.isValidElement(child) && (child.type === Quiz || (child.type as any)?.name === 'Quiz')
  );

  if (hasQuiz) {
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
  }

  return <SummativeEssayPortal childrenArray={childrenArray} durationLimit={durationLimit} />;
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

const Shape = () => null;

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
  Explanation,
  Solution,
  KeyConcept,
  Instruction,
  Shape,
  FillInBlanks,
  'FillInBlanks.Input': (props: any) => {
    const Impl = (FillInBlanks as any).Input;
    if (Impl) return <Impl {...props} />;
    return <input type="text" className="inline-block mx-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-sm w-28" placeholder="..." {...props} />;
  },
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
  GestaltInteractive,
  GestaltLab: GestaltInteractive, // Alias
  DataChart,
  StructureViewer3D,
  DynamicSimulation,
  GoingFurther,
  GoingFurtherItem,
  FunctionManipulator,
  ManipulateurFonction: FunctionManipulator,
  ExplorateurFonctions: FunctionManipulator,
  EquationManipulator,
  ManipulateurEquation: EquationManipulator,
  ExplorateurEquations: EquationManipulator,
  ChemicalStoichiometry,
  EquilibrageChimique: ChemicalStoichiometry,
  StoichiometrieChimique: ChemicalStoichiometry,
  BasicMathExplorer,
  ExplorateurMathsBase: BasicMathExplorer,
  pre: PreCodeInterceptor,

  // New Custom Pedagogical Blocks
  CriticalThinking,
  EspritCritique: CriticalThinking,
  DidYouKnow,
  LeSaviezVous: DidYouKnow,
  HistoricalAnecdote,
  AnecdoteHistorique: HistoricalAnecdote,
  HistoricalFact,
  FaitHistorique: HistoricalFact,
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
  OpenQuestion,
  ScientificDebate,

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

  // Fallback safety components to prevent runtime crashes on unmapped tags
  Feedback: () => null,
  DiagramItem: () => null,
  Hotspot: () => null,
  Content: () => null,
};

interface MdxContentProps {
  source: MDXRemoteSerializeResult;
}

export function MdxContent({ source }: MdxContentProps) {
  return <MDXRemote {...source} components={components as any} />;
}
