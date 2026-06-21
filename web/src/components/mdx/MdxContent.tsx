"use client";

import React, { useEffect, useRef, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Quiz, Question, Option } from './Quiz';
import { Glossary } from './Glossary';
import { Video } from './Video';
import { FillInBlanks, MetaNote, ExternalSandbox, FillInBlanksQuestion } from './Interactive';
import { SolvedProblem, Summary, SelfEval, SelfAssessment } from './AdvancedLearning';
import { RealPerson, HistoricalPerson, FictionalCharacter, Location, EntityLink, EventLink, HistoricalEventLink, EvenementHistorique, Artwork } from './HistoricalPerson';
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
import { Citation, QuoteBlock, InteractiveQuote } from './Citation';
import { FunctionManipulator } from './FunctionManipulator';
import { EquationManipulator } from './EquationManipulator';
import { ChemicalStoichiometry } from './ChemicalStoichiometry';
import { BasicMathExplorer } from './BasicMathExplorer';
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

import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import { dbService } from '@/lib/db';

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
  },
  biography: {
    EN: "Mini-Biography",
    FR: "Mini-Biographie",
    ES: "Mini-Biografía",
    DE: "Mini-Biografie",
    ZH: "迷你传记"
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
  } else if (t === 'biography') {
    icon = <BookOpen className="w-4 h-4 text-violet-500 dark:text-violet-400" />;
    titleKey = "biography";
    borderClass = "border-l-violet-500 bg-violet-500/5 dark:bg-violet-500/[0.04] border-violet-500/20";
    titleColor = "text-violet-500 dark:text-violet-400";
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

const isExistingArtwork = (src: string, label: string): boolean => {
  const text = `${src} ${label}`.toLowerCase();
  const decoded = decodeURIComponent(text);
  
  const keywords = [
    'peinture', 'painting', 'tableau', 'fresco', 'fresque', 'oil on canvas', 'huile sur toile', 'watercolor', 'aquarelle',
    'sculpture', 'statue', 'bust', 'buste', 'marble', 'marbre', 'bronze',
    'photo', 'photograph', 'photographie', 'daguerreotype',
    'mona lisa', 'joconde', 'starry night', 'nuit étoilée', 'nuit etoilee', 'ménines', 'menines', 'guernica', 
    'last supper', 'cène', 'cene', 'david', 'venus de milo', 'penseur', 'thinker', 'laocoon', 'nefertiti', 'scream', 'cri',
    'birth of venus', 'naissance de vénus', 'naissance de venus', 'girl with a pearl earring', 'jeune fille à la perle',
    'liberté guidant le peuple', 'liberty leading the people', 'le baiser', 'the kiss',
    'da vinci', 'leonardo da vinci', 'vincent van gogh', 'van gogh', 'michelangelo', 'michel-ange', 'picasso', 
    'velázquez', 'velazquez', 'rembrandt', 'vermeer', 'claude monet', 'monet', 'edouard manet', 'manet', 
    'auguste renoir', 'renoir', 'edgar degas', 'degas', 'salvador dali', 'dali', 'rene magritte', 'magritte', 
    'gustav klimt', 'klimt', 'edvard munch', 'munch', 'auguste rodin', 'rodin', 'botticelli'
  ];
  
  return keywords.some(kw => decoded.includes(kw));
};

const CustomFigure = ({ src, alt, caption, fallbackText, fallbackUrl }: { src: string; alt: string; caption: string; fallbackText?: string; fallbackUrl?: string }) => {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) return null;

  if (src && src.includes('pollinations.ai') && isExistingArtwork(src, alt || caption || '')) {
    return (
      <div className="my-8 p-5 rounded-2xl border-l-4 border-l-amber-500 bg-amber-500/5 border-amber-500/20 text-slate-200">
        <div className="flex items-center gap-2 mb-2 select-none">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
            Intégrité Pédagogique
          </span>
        </div>
        <div className="text-[13px] leading-relaxed font-medium italic">
          La génération par IA de l'œuvre d'art "{alt || caption}" (peinture, sculpture, monument ou photographie historique) a été bloquée pour préserver l'intégrité pédagogique de l'apprentissage.
        </div>
      </div>
    );
  }

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
  const staticDict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const singleAttemptWarning = staticDict.summative_single_attempt_warning;

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
              <li className="flex items-start gap-2 text-red-400 font-bold border-t border-red-500/20 pt-2.5 mt-2.5">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{singleAttemptWarning}</span>
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

  const finalChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      const type = child.type;
      const typeName = typeof type === 'string' ? type : (type as any)?.name;
      if (type === Quiz || typeName === 'Quiz' || type === EssayEvaluation || typeName === 'EssayEvaluation') {
        return React.cloneElement(child, { isFinal: true } as any);
      }
    }
    return child;
  });

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
          {finalChildren}
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
  FillInBlanks: FillInBlanksWrapper,
  'FillInBlanks.Input': FillInBlanksWrapper.Input,
  FillInBlanksQuestion,
  MetaNote,
  SolvedProblem,
  Summary,
  SelfEval,
  SelfAssessment,
  // ─── Entity Overlays (inline hover cards) ────────────────────────────────
  RealPerson,                            // Canonical: real/existing person
  HistoricalPerson,                      // Backward-compat alias for RealPerson
  PersonnageHistorique: RealPerson,      // French alias
  FictionalCharacter,                    // Fictional/mythological character
  PersonnageFictif: FictionalCharacter,  // French alias
  Location,
  Place: Location,
  Event: EventLink,                      // Canonical: event entity overlay
  HistoricalEventLink,                   // Backward-compat alias
  EvenementHistorique,                   // French alias
  ÉvénementHistorique: EvenementHistorique,
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
  EquationManipulator: SmartEquationManipulator,
  ManipulateurEquation: SmartEquationManipulator,
  ExplorateurEquations: SmartEquationManipulator,
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
  QuoteBlock,
  InteractiveQuote,

  // Opposing theories side-by-side
  DivergingViews,
  DivergingView: DivergingViews,
  VisionsOpposees: DivergingViews,
  VisionsOpposées: DivergingViews,

  // Custom standard tag overrides
  a: (props: any) => {
    const href = props.href;
    const isExternal = href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'));
    if (isExternal) {
      return (
        <a
          {...props}
          target="_blank"
          rel="noopener noreferrer"
        />
      );
    }
    return <a {...props} />;
  },

  img: (props: any) => {
    const src = props.src || '';
    const alt = props.alt || '';
    if (src && src.includes('pollinations.ai') && isExistingArtwork(src, alt)) {
      return (
        <div className="my-8 p-5 rounded-2xl border-l-4 border-l-amber-500 bg-amber-500/5 border-amber-500/20 text-slate-200">
          <div className="flex items-center gap-2 mb-2 select-none">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
              Intégrité Pédagogique
            </span>
          </div>
          <div className="text-[13px] leading-relaxed font-medium italic">
            La génération par IA de l'œuvre d'art "{alt}" (peinture, sculpture, monument ou photographie historique) a été bloquée pour préserver l'intégrité pédagogique de l'apprentissage.
          </div>
        </div>
      );
    }
    return <img className="rounded-2xl max-w-full h-auto shadow-md border border-slate-900/10 dark:border-slate-800/50 my-8" {...props} />;
  },

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
}

const COMPATIBILITY_MESSAGES: Record<string, { title: string; prefix: string; suffix: string }> = {
  EN: {
    title: "Compatibility Mode Enabled",
    prefix: "This chapter is displayed in a simplified version due to an anomaly in the format of the ",
    suffix: " of the lesson. The incident has been reported to the administration."
  },
  FR: {
    title: "Mode de compatibilité activé",
    prefix: "Ce chapitre s'affiche en version allégée en raison d'une anomalie dans le format ",
    suffix: " de la leçon. L'incident a été signalé à l'administration."
  },
  ES: {
    title: "Modo de compatibilidad activado",
    prefix: "Este capítulo se muestra en una versión simplificada debido a una anomalía en el formato ",
    suffix: " de la lección. El incidente ha sido reportado a la administración."
  },
  DE: {
    title: "Kompatibilitätsmodus aktiviert",
    prefix: "Dieses Kapitel wird aufgrund einer Anomalie im Format ",
    suffix: " der Lektion in einer vereinfachten Version angezeigt. Der Vorfall wurde der Verwaltung gemeldet."
  },
  ZH: {
    title: "兼容模式已启用",
    prefix: "本章因课程的",
    suffix: "格式异常而以精简版显示。该事件已报告给管理部门。"
  }
};

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
  const isFr = language === 'FR';
  
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
  if (/<StructureViewer3D/i.test(rawMdx)) {
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

  if (uniqueDetected.length === 0) {
    if (isFr) return "des composants interactifs";
    if (language === 'ES') return "de los componentes interactivos";
    if (language === 'DE') return "der interaktiven Komponenten";
    if (language === 'ZH') return "互动组件";
    return "interactive components";
  }

  const items = uniqueDetected.map(key => translations[key]?.[language] || translations[key]?.EN || key);

  if (language === 'FR') {
    return `des composants interactifs (${items.join(', ')})`;
  } else if (language === 'ES') {
    return `de los componentes interactivos (${items.join(', ')})`;
  } else if (language === 'DE') {
    return `der interaktiven Komponenten (${items.join(', ')})`;
  } else if (language === 'ZH') {
    return `互动组件（${items.join('、')}）`;
  } else {
    return `interactive components (${items.join(', ')})`;
  }
}

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
    if (!this.state.reported) {
      this.setState({ reported: true });
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
    }
  }

  render() {
    if (this.state.hasError) {
      const langKey = (this.props.language || 'EN').toUpperCase();
      const msg = COMPATIBILITY_MESSAGES[langKey] || COMPATIBILITY_MESSAGES.EN;
      const crit = CRITICAL_ERROR_MESSAGES[langKey] || CRITICAL_ERROR_MESSAGES.EN;

      if (this.props.fallback) {
        const affectedStr = getAffectedComponentsList(this.props.rawMdx, langKey);
        return (
          <div className="w-full">
            <div className="p-5 border border-amber-900/30 bg-amber-950/10 rounded-3xl text-left my-8 select-none">
              <h3 className="text-amber-400 font-black text-sm tracking-wider uppercase mb-2">{msg.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {msg.prefix}{affectedStr}{msg.suffix}
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
      
      const qMatch = attrsStr.match(/\bq=["']([^"']+)["']/i) || attrsStr.match(/\btext=["']([^"']+)["']/i) || attrsStr.match(/\bquestion=["']([^"']+)["']/i);
      const questionText = qMatch ? qMatch[1] : 'Question';
      
      questionsText += `\n**Question ${qCount} : ${questionText}**\n`;
      
      const optionRegex = /<Option\b([^>]*?)(?:>([\s\S]*?)<\/Option>|\/>)/gi;
      let optMatch;
      while ((optMatch = optionRegex.exec(optionsBlock)) !== null) {
        const optAttrsStr = optMatch[1];
        const optBody = optMatch[2] || '';
        
        const optTextMatch = optAttrsStr.match(/\btext=["']([^"']+)["']/i);
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

  // 6. Flatten SolvedExercise & UnsolvedExercise
  clean = clean.replace(/<SolvedExercise([^>]*?)>([\s\S]*?)<\/SolvedExercise>/gi, (m, attrs, content) => {
    const titleMatch = attrs.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Exercice d\'application';
    return `\n\n✏️ **[Exercice résolu : ${title}]**\n${content}\n`;
  });
  clean = clean.replace(/<UnsolvedExercise([^>]*?)>([\s\S]*?)<\/UnsolvedExercise>/gi, (m, attrs, content) => {
    const titleMatch = attrs.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Exercice à résoudre';
    return `\n\n✏️ **[Exercice pratique : ${title}]**\n${content}\n`;
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
  clean = clean.replace(/<(?:RealPerson|HistoricalPerson|Event|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|FictionalCharacter|Location|Place)\b[^>]*?>([\s\S]*?)<\/\1>/gi, '**$1**');
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

export function MdxContent({ source, rawMdx, courseSlug, lessonSlug }: MdxContentProps) {
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

    return {
      ...components,
      FillInBlanks: wrapper,
      'FillInBlanks.Input': wrapper.Input,
    };
  }, []);

  return (
    <div ref={containerRef} className="mdx-content-container">
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
