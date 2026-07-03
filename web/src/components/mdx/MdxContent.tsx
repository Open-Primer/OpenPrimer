"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, ZoomIn, ZoomOut, X, RotateCcw } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Quiz, Question, Option } from './Quiz';
import { Glossary } from './Glossary';
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
import { BiophysicsSimulator } from './BiophysicsSimulator';
import { LogicGateSimulator } from './LogicGateSimulator';
import { CardSort } from './CardSort';
import { SocraticInput } from './SocraticInput';
import { Timeline } from './Timeline';
import { Biography } from './Biography';
import { MatchingEvaluation } from './MatchingEvaluation';
import { ReorderEvaluation } from './ReorderEvaluation';

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
import { EquationManipulator } from './EquationManipulator';
import { ChemicalStoichiometry } from './ChemicalStoichiometry';
import { BasicMathExplorer } from './BasicMathExplorer';
import { GeneticsPedigreeLab } from './GeneticsPedigreeLab';
import { OrbitalMechanicsSim } from './OrbitalMechanicsSim';
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
import { MdxStatusProvider, useMdxStatus } from './MdxStatusContext';
const DEGRADED_STRINGS = {
  EN: {
    bannerTitle: "Degraded Mode Active",
    bannerDesc: "Some multimedia elements or interactive widgets could not be loaded or were restricted for pedagogical integrity. The lesson remains fully readable.",
    unavailableElementsLabel: "Unavailable elements:",
    assets: {
      image: "illustrations / figures",
      video: "videos",
      audio: "audio tracks",
      quiz: "interactive quizzes",
      widget: "interactive tools",
      entity: "encyclopedic links / overlays",
    }
  },
  FR: {
    bannerTitle: "Mode Dégradé Actif",
    bannerDesc: "Certains éléments multimédias ou widgets interactifs n'ont pas pu être chargés ou ont été restreints par intégrité pédagogique. La leçon reste entièrement lisible.",
    unavailableElementsLabel: "Éléments absents :",
    assets: {
      image: "illustrations / schémas",
      video: "vidéos",
      audio: "pistes audio",
      quiz: "quiz interactifs",
      widget: "outils interactifs",
      entity: "liens encyclopédiques",
    }
  },
  ES: {
    bannerTitle: "Modo Degradado Activo",
    bannerDesc: "Algunos elementos multimedia o widgets interactivos no se pudieron cargar o fueron restringidos por integridad pedagógica. La lección sigue siendo completamente legible.",
    unavailableElementsLabel: "Elementos omitidos :",
    assets: {
      image: "ilustraciones / figuras",
      video: "videos",
      audio: "pistas de audio",
      quiz: "cuestionarios interactivos",
      widget: "herramientas interactivas",
      entity: "enlaces enciclopédicos",
    }
  },
  DE: {
    bannerTitle: "Eingeschränkter Modus aktiv",
    bannerDesc: "Einige Multimedia-Elemente oder interaktive Widgets konnten nicht geladen werden oder wurden aus Gründen der pädagogischen Integrität eingeschränkt. Die Lektion bleibt vollständig lesbar.",
    unavailableElementsLabel: "Fehlende Elemente:",
    assets: {
      image: "Illustrationen / Grafiken",
      video: "Videos",
      audio: "Audiotracks",
      quiz: "Interaktive Quizzes",
      widget: "Interaktive Tools",
      entity: "Enzyklopädische Links / Overlays",
    }
  },
  ZH: {
    bannerTitle: "服务降级模式已激活",
    bannerDesc: "某些多媒体元素或交互式小部件无法加载，或因保证教学完整性而被限制。本课程仍可完全正常阅读。",
    unavailableElementsLabel: "缺失元素：",
    assets: {
      image: "插图 / 图表",
      video: "视频",
      audio: "音频轨道",
      quiz: "交互式测验",
      widget: "交互式工具",
      entity: "百科链接 / 悬浮窗",
    }
  },
  PT: {
    bannerTitle: "Modo Degradado Ativo",
    bannerDesc: "Alguns elementos multimédia ou widgets interativos não puderam ser carregados ou foram restringidos por integridade pedagógica. A lição permanece completamente legível.",
    unavailableElementsLabel: "Elementos em falta:",
    assets: {
      image: "ilustrações / figuras",
      video: "vídeos",
      audio: "faixas de áudio",
      quiz: "questionários interativos",
      widget: "ferramentas interativas",
      entity: "ligações enciclopédicas / popups",
    }
  },
  AR: {
    bannerTitle: "وضع التشغيل المتراجع نشط",
    bannerDesc: "تعذر تحميل بعض العناصر متعددة الوسائط أو الأدوات التفاعلية أو تم تقييدها حفاظًا على السلامة التعليمية. تظل الحصة قابلة للقراءة بالكامل.",
    unavailableElementsLabel: "العناصر غير المتوفرة:",
    assets: {
      image: "الرسوم التوضيحية / الأشكال",
      video: "الفيديوهات",
      audio: "المقاطع الصوتية",
      quiz: "الاختبارات التفاعلية",
      widget: "الأدوات التفاعلية",
      entity: "روابط موسوعية / نوافذ منبثقة",
    }
  },
  HI: {
    bannerTitle: "सीमित मोड सक्रिय",
    bannerDesc: "कुछ मल्टीमीडिया तत्व या इंटरैक्टिव विजेट लोड नहीं किए जा सके या शैक्षणिक अखंडता के लिए प्रतिबंधित कर दिए गए। पाठ पूरी तरह से पढ़ने योग्य है।",
    unavailableElementsLabel: "अनुपलब्ध तत्व:",
    assets: {
      image: "चित्र / रेखांकन",
      video: "वीडियो",
      audio: "ऑडियो ट्रैक",
      quiz: "इंटरैक्टिव प्रश्नोत्तरी",
      widget: "इंटरैक्टिव उपकरण",
      entity: "ज्ञानकोश लिंक / ओवरले",
    }
  },
  UR: {
    bannerTitle: "محدود موڈ فعال ہے",
    bannerDesc: "کچھ ملٹی میڈیا عناصر یا انٹرایکٹو ویجٹ لوڈ نہیں کیے جا سکے یا تدریسی سالمیت کی وجہ سے محدود کر دیے گئے۔ سبق مکمل طور پر پڑھنے کے قابل ہے۔",
    unavailableElementsLabel: "غیر دستیاب عناصر:",
    assets: {
      image: "تصاویر / خاکے",
      video: "ویڈیوز",
      audio: "آڈیو ٹریکس",
      quiz: "انٹرایکٹو کوئز",
      widget: "انٹرایکٹو ٹولز",
      entity: "انسائیکلوپیڈیا لنکس",
    }
  }
};

function DegradedModeBanner() {
  const { isDegraded, degradedReasons } = useMdxStatus();
  const { language } = useLanguage();
  
  if (!isDegraded) return null;
  
  const langKey = language?.toUpperCase() || 'EN';
  const strings = DEGRADED_STRINGS[langKey as keyof typeof DEGRADED_STRINGS] || DEGRADED_STRINGS.EN;
  
  const formattedReasons = Array.from(degradedReasons)
    .map(r => strings.assets[r as keyof typeof strings.assets] || r)
    .join(', ');
    
  return (
    <div className="mb-6 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md text-amber-800 dark:text-amber-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">
            {strings.bannerTitle}
          </h4>
          <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
            {strings.bannerDesc}
          </p>
          {formattedReasons && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">
                {strings.unavailableElementsLabel}
              </span>
              {Array.from(degradedReasons).map(reason => {
                const label = strings.assets[reason as keyof typeof strings.assets] || reason;
                return (
                  <span key={reason} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 uppercase tracking-wide">
                    {label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
    ZH: "提示",
    PT: "Nota",
    AR: "ملاحظة",
    HI: "नोट",
    UR: "نوٹ"
  },
  warning: {
    EN: "Warning",
    FR: "Avertissement",
    ES: "Advertencia",
    DE: "Warnung",
    ZH: "警告",
    PT: "Aviso",
    AR: "تحذير",
    HI: "चेतावनी",
    UR: "انتباہ"
  },
  info: {
    EN: "Info",
    FR: "Info",
    ES: "Información",
    DE: "Info",
    ZH: "信息",
    PT: "Informação",
    AR: "معلومات",
    HI: "जानकारी",
    UR: "معلومات"
  },
  important: {
    EN: "Important",
    FR: "Important",
    ES: "Importante",
    DE: "Importante",
    ZH: "重要",
    PT: "Importante",
    AR: "هام",
    HI: "महत्वपूर्ण",
    UR: "اہم"
  },
  tip: {
    EN: "Tip",
    FR: "Conseil",
    ES: "Consejo",
    DE: "Tipp",
    ZH: "建议",
    PT: "Dica",
    AR: "نصيحة",
    HI: "सुझाव",
    UR: "مشورہ"
  },
  caution: {
    EN: "Caution",
    FR: "Attention",
    ES: "Precaución",
    DE: "Achtung",
    ZH: "注意",
    PT: "Atenção",
    AR: "تنبيه",
    HI: "सावधानी",
    UR: "احتیاط"
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

const FIGURE_STRINGS: Record<string, string> = {
  EN: "Figure",
  FR: "Figure",
  ES: "Figura",
  DE: "Abbildung",
  ZH: "图",
  PT: "Figura",
  AR: "الشكل",
  HI: "चित्र",
  UR: "خاکہ"
};

const ZoomableImage = ({ 
  src, 
  alt, 
  className, 
  onError, 
  ...props 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  onError?: () => void;
  [key: string]: any;
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const { language } = useLanguage();

  const dragStart = React.useRef({ x: 0, y: 0 });
  const dragMoveAmount = React.useRef(0);

  React.useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsFullscreen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isFullscreen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isFullscreen) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    dragMoveAmount.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isFullscreen) return;
    if (isDragging) {
      const dx = (e.clientX - offset.x) - dragStart.current.x;
      const dy = (e.clientY - offset.y) - dragStart.current.y;
      dragMoveAmount.current += Math.sqrt(dx * dx + dy * dy);
      setOffset({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isFullscreen) return;
    e.preventDefault();
    
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    const zoomFactor = 1.15;
    const nextScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    const boundedScale = Math.max(0.1, Math.min(10, nextScale));
    
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    const nextOffsetX = offset.x + (clientX - cx - offset.x) * (1 - boundedScale / scale);
    const nextOffsetY = offset.y + (clientY - cy - offset.y) * (1 - boundedScale / scale);
    
    setScale(boundedScale);
    setOffset({ x: nextOffsetX, y: nextOffsetY });
  };

  const resetPanZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isFullscreen) return;
    if (dragMoveAmount.current >= 5) return;
    
    const target = e.target as HTMLElement;
    const isCanvasBg = target.classList.contains('canvas-bg') || target === e.currentTarget;
    if (isCanvasBg) {
      setIsFullscreen(false);
    }
  };

  const langKey = (language?.toUpperCase() || 'EN') as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR';
  const modalT = {
    EN: {
      close: "Close (Esc)",
      zoom_fig: "Figure Zoom",
      drag_pan: "Drag to Pan • Scroll to Zoom",
      zoom_in: "Zoom In",
      zoom_out: "Zoom Out",
      reset: "Reset View",
      maximize: "Maximize image"
    },
    FR: {
      close: "Fermer (Échap)",
      zoom_fig: "Zoom Figure",
      drag_pan: "Glisser pour déplacer • Molette pour zoomer",
      zoom_in: "Zoomer",
      zoom_out: "Dézoomer",
      reset: "Réinitialiser",
      maximize: "Agrandir l'image"
    },
    ES: {
      close: "Cerrar (Esc)",
      zoom_fig: "Zoom de Figura",
      drag_pan: "Arrastrar para desplazar • Rueda para hacer zoom",
      zoom_in: "Acercar",
      zoom_out: "Alejar",
      reset: "Restablecer",
      maximize: "Maximizar imagen"
    },
    DE: {
      close: "Schließen (Esc)",
      zoom_fig: "Bild-Zoom",
      drag_pan: "Ziehen zum Verschieben • Scrollen zum Zoomen",
      zoom_in: "Vergrößern",
      zoom_out: "Verkleinern",
      reset: "Ansicht zurücksetzen",
      maximize: "Bild maximieren"
    },
    ZH: {
      close: "关闭 (Esc)",
      zoom_fig: "图片缩放",
      drag_pan: "拖拽以平移 • 滚轮以缩放",
      zoom_in: "放大",
      zoom_out: "缩小",
      reset: "重置视图",
      maximize: "放大图片"
    },
    PT: {
      close: "Fechar (Esc)",
      zoom_fig: "Zoom da Imagem",
      drag_pan: "Arraste para mover • Roda para aproximar",
      zoom_in: "Aproximar",
      zoom_out: "Afastar",
      reset: "Repor Vista",
      maximize: "Maximizar imagem"
    },
    AR: {
      close: "إغلاق (Esc)",
      zoom_fig: "تكبير الصورة",
      drag_pan: "السحب للتحريك • التمرير للتكبير",
      zoom_in: "تكبير",
      zoom_out: "تصغير",
      reset: "إعادة ضبط",
      maximize: "تكبير الصورة"
    },
    HI: {
      close: "बंद करें (Esc)",
      zoom_fig: "चित्र ज़ूम",
      drag_pan: "स्थानांतरित करने के लिए खींचें • ज़ूम करने के लिए स्क्रॉल करें",
      zoom_in: "ज़ूम इन",
      zoom_out: "ज़ूम आउट",
      reset: "दृश्य रीसेट करें",
      maximize: "चित्र बड़ा करें"
    },
    UR: {
      close: "بند کریں (Esc)",
      zoom_fig: "تصویر زوم",
      drag_pan: "پین کرنے کے لیے گھسیٹیں • زوم کرنے کے لیے اسکرول کریں",
      zoom_in: "زوم ان",
      zoom_out: "زوم آؤٹ",
      reset: "ری سیٹ کریں",
      maximize: "تصویر بڑی کریں"
    }
  };
  const t = modalT[langKey] || modalT.EN;

  const modalPortal = isFullscreen && typeof document !== 'undefined' && createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center select-none"
      onWheel={handleWheel}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFullscreen(false);
        }}
        className="absolute top-6 right-6 p-3 rounded-full bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-30 shadow-2xl cursor-pointer"
        title={t.close}
      >
        <X className="w-5 h-5" />
      </button>
 
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-slate-900/90 border border-slate-800/85 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-5 z-20 select-none"
      >
        <div className="flex flex-col text-left border-r border-slate-800/80 pr-5">
          <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest">
            {t.zoom_fig}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            {t.drag_pan}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.min(10, prev * 1.25));
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-350 hover:text-white rounded-full transition-all cursor-pointer border border-slate-750"
            title={t.zoom_in}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.max(0.1, prev / 1.25));
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-350 hover:text-white rounded-full transition-all cursor-pointer border border-slate-750"
            title={t.zoom_out}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetPanZoom();
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-350 hover:text-white rounded-full transition-all cursor-pointer border border-slate-750"
            title={t.reset}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        className={`w-full h-full flex items-center justify-center overflow-hidden canvas-bg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        <img 
          src={src} 
          alt={alt}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            willChange: 'transform'
          }}
          className="max-w-[95vw] max-h-[90vh] object-contain pointer-events-auto shadow-2xl rounded-xl"
        />
      </div>
    </div>,
    document.body
  );

  return (
    <div className="relative group/zoomable w-full flex items-center justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFullscreen(true);
        }}
        className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-10 cursor-pointer shadow-md opacity-0 group-hover/zoomable:opacity-100 focus/zoomable:opacity-100 duration-200"
        title={t.maximize}
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      <img 
        src={src} 
        alt={alt} 
        className={className}
        onError={onError}
        onClick={() => setIsFullscreen(true)}
        style={{ cursor: 'zoom-in' }}
        {...props}
      />
      {modalPortal}
    </div>
  );
};

const renderCaptionWithLinks = (captionText: string, fallbackUrl?: string) => {
  const parts = captionText.split(/(\bSource\s*[:：]\s*)/i);
  if (parts.length < 3) {
    return <span className="select-text">{captionText}</span>;
  }
  const mainText = parts.slice(0, parts.length - 2).join('');
  const sourcePrefix = parts[parts.length - 2];
  const sourceName = parts[parts.length - 1].trim();
  
  if (sourceName.includes('[') && sourceName.includes('](')) {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    
    while ((match = regex.exec(sourceName)) !== null) {
      const plainText = sourceName.slice(lastIndex, match.index);
      if (plainText) {
        elements.push(plainText);
      }
      const linkText = match[1];
      const linkUrl = match[2];
      elements.push(
        <a
          key={linkUrl + '-' + lastIndex}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors cursor-pointer"
        >
          {linkText}
        </a>
      );
      lastIndex = regex.lastIndex;
    }
    
    const remainingText = sourceName.slice(lastIndex);
    if (remainingText) {
      elements.push(remainingText);
    }
    
    return (
      <span className="select-text">
        {mainText}
        {sourcePrefix}
        {elements}
      </span>
    );
  }

  let url = fallbackUrl || '';
  if (!url) {
    if (/wikimedia/i.test(sourceName)) {
      url = 'https://commons.wikimedia.org';
    } else if (/wikipedia/i.test(sourceName)) {
      url = 'https://www.wikipedia.org';
    }
  }

  const isLinkable = url && !/ai-generated|generated|pollinations|tuteur/i.test(sourceName);
  
  return (
    <span className="select-text">
      {mainText}
      {sourcePrefix}
      {isLinkable ? (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors cursor-pointer"
        >
          {sourceName}
        </a>
      ) : (
        sourceName
      )}
    </span>
  );
};

const CustomFigure = ({ src, alt, caption, fallbackText, fallbackUrl, unresolved, isIllustration }: { src: string; alt: string; caption: string; fallbackText?: string; fallbackUrl?: string; unresolved?: boolean; isIllustration?: boolean }) => {
  const [failed, setFailed] = React.useState(false);
  const { markDegraded, registerFigure, unregisterFigure, registeredFigures } = useMdxStatus();
  const { language } = useLanguage();

  const idRef = React.useRef<string | null>(null);
  if (!idRef.current) {
    idRef.current = Math.random().toString(36).substr(2, 9);
  }
  const id = idRef.current;
  
  const isBlocked = src && src.includes('pollinations.ai') && isExistingArtwork(src, alt || caption || '');

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  const isVisible = !unresolved && !isBlocked && !failed && !!src;

  React.useEffect(() => {
    // Illustrations are decorative — never register for figure numbering
    if (isVisible && !isIllustration) {
      console.log(`[MDX-FIGURE-REGISTRY] Registering Figure ID: ${id} (Caption: "${caption}")`);
      registerFigure(id);
    } else {
      console.log(`[MDX-FIGURE-REGISTRY] Unregistering Figure ID: ${id} (isVisible: ${isVisible}, isIllustration: ${isIllustration})`);
      unregisterFigure(id);
    }
    return () => {
      console.log(`[MDX-FIGURE-REGISTRY] Cleanup: Unregistering Figure ID: ${id}`);
      unregisterFigure(id);
    };
  }, [id, isVisible, isIllustration, registerFigure, unregisterFigure]);

  React.useEffect(() => {
    if (unresolved || isBlocked || failed) {
      markDegraded('image');
    }
  }, [unresolved, isBlocked, failed, markDegraded]);

  if (unresolved || isBlocked || failed) {
    return null;
  }

  // ── Illustration mode (Unsplash/decorative) ─────────────────────────────
  // No "Figure N:" label, no numbering, aria-hidden so TTS skips it entirely.
  // Only a minimal attribution line is shown beneath the image.
  if (isIllustration) {
    return (
      <div
        className="my-6 flex flex-col items-center justify-center gap-1.5 custom-illustration transition-opacity duration-300"
        aria-hidden="true"
        role="presentation"
      >
        <img
          src={src}
          alt=""
          className="rounded-2xl max-w-full h-auto max-h-[360px] object-contain opacity-90"
          onError={() => setFailed(true)}
        />
        {caption && (
          <p className="text-center text-[10px] text-slate-600 dark:text-slate-500 mt-1 max-w-xl px-4 leading-relaxed">
            {renderCaptionWithLinks(caption, fallbackUrl)}
          </p>
        )}
      </div>
    );
  }

  // ── Standard figure mode (factual, numbered) ─────────────────────────────
  const langKey = (language || 'EN').toUpperCase();
  const figureLabel = FIGURE_STRINGS[langKey] || FIGURE_STRINGS.EN;

  const figureIndex = registeredFigures.indexOf(id);
  const figureNumber = figureIndex !== -1 ? figureIndex + 1 : null;
  console.log(`[MDX-FIGURE-REGISTRY] Figure ID: ${id} has index: ${figureIndex} -> Figure Number: ${figureNumber}`);

  const cleanCaption = caption ? caption.replace(/^(?:Figure|Abbildung|Figura|图|الشكل|चित्र|خاکہ)\s*\d*\s*[:\-\u2013\u2014]?\s*/i, '') : '';
  const finalCaption = figureNumber !== null ? `${figureLabel} ${figureNumber}: ${cleanCaption}` : caption;

  return (
    <div 
      id={figureNumber !== null ? `figure-${figureNumber}` : undefined}
      className="my-8 flex flex-col items-center justify-center gap-2 custom-figure transition-opacity duration-300 scroll-mt-24"
    >
      <ZoomableImage 
        src={src} 
        alt={alt} 
        className="rounded-2xl max-w-full h-auto max-h-[450px] object-contain shadow-md border border-slate-900/10 dark:border-slate-800/50" 
        onError={() => setFailed(true)} 
      />
      {finalCaption && (
        <p className="text-center text-xs md:text-sm text-slate-500 dark:text-slate-400 italic mt-2 max-w-2xl px-4">
          {renderCaptionWithLinks(finalCaption, fallbackUrl)}
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

Knowledge.displayName = 'Knowledge';
(Knowledge as any).isKnowledge = true;

Skills.displayName = 'Skills';
(Skills as any).isSkills = true;

Attitudes.displayName = 'Attitudes';
(Attitudes as any).isAttitudes = true;

const Objectives = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase() as keyof typeof STATIC_UI_STRINGS;
  const t = STATIC_UI_STRINGS[langKey] || STATIC_UI_STRINGS.EN;

  const isStructuredBox = (child: any): boolean => {
    if (!React.isValidElement(child)) return false;
    const type = child.type;
    if (!type) return false;
    if (type === Knowledge || type === Skills || type === Attitudes) return true;
    if (type === 'Knowledge' || type === 'Skills' || type === 'Attitudes') return true;
    if ((type as any).mdxType === 'Knowledge' || (type as any).mdxType === 'Skills' || (type as any).mdxType === 'Attitudes') return true;
    if ((child.props as any)?.mdxType === 'Knowledge' || (child.props as any)?.mdxType === 'Skills' || (child.props as any)?.mdxType === 'Attitudes') return true;
    if (typeof type === 'function') {
      if (type.name === 'Knowledge' || type.name === 'Skills' || type.name === 'Attitudes') return true;
      if ((type as any).isKnowledge || (type as any).isSkills || (type as any).isAttitudes) return true;
      if ((type as any).displayName === 'Knowledge' || (type as any).displayName === 'Skills' || (type as any).displayName === 'Attitudes') return true;
    }
    return false;
  };

  const childrenArray = React.Children.toArray(children);
  const hasStructuredBoxes = childrenArray.some(isStructuredBox);

  let renderedContent: React.ReactNode;

  if (hasStructuredBoxes) {
    // Ensure at least one structured box has visible, non-empty children
    const hasAnyContent = childrenArray.some(child => {
      if (React.isValidElement(child)) {
        if (isStructuredBox(child)) {
          return !isChildrenEmpty((child.props as any)?.children);
        }
        return !isChildrenEmpty(child);
      }
      return !isChildrenEmpty(child);
    });
    if (!hasAnyContent) return null;
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
    if (items.length === 0) return null;

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
    <div className="objectives-container my-8 p-6 md:p-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl">
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

interface SummativeTranslation {
  select_subject: string;
  prerequisites: string;
  prep_advice: string;
  focus_advice: string;
  start: string;
  time_limit: string;
  time_remaining: string;
  time_expired: string;
  placeholder: string;
  words: string;
  words_target: string;
  submit: string;
  evaluating: string;
  grade: string;
  feedback_title: string;
  retry: string;
  saved_local: string;
  guest_alert: string;
  summative_eval: string;
  module_validation: string;
  selected_prompt: string;
  structured_resp: string;
  locked: string;
  min_words: string;
  conn_err: string;
  retry_confirm: string;
  no_prompts: string;
  assignment: string;
  deadline: string;
  submission_instructions: string;
  evaluation_criteria: string;
  final_project: string;
  format: string;
  instructions: string;
  final_quiz: string;
  formative_quiz: string;
}

const SUMMATIVE_STRINGS: Record<'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR', SummativeTranslation> = {
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
    guest_alert: "💡 In guest mode, your grade is saved temporarily in this browser session. Create an account to save it permanently!",
    summative_eval: "Summative Evaluation",
    module_validation: "Module Validation",
    selected_prompt: "Selected Prompt",
    structured_resp: "The evaluation requires a structured written response.",
    locked: "Locked",
    min_words: "Your answer must contain at least 10 words.",
    conn_err: "Failed to connect to the AI tutor.",
    retry_confirm: "Are you sure you want to restart this evaluation? Your current grade will be erased.",
    no_prompts: "No evaluation prompts detected.",
    assignment: "Assignment",
    deadline: "Deadline:",
    submission_instructions: "Submission Instructions",
    evaluation_criteria: "Evaluation Criteria",
    final_project: "Final Project",
    format: "Format:",
    instructions: "Instructions:",
    final_quiz: "Final Assessment Quiz",
    formative_quiz: "Self-Assessment / Formative Quiz"
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
    guest_alert: "💡 En mode invité, votre note est temporaire. Créez un compte pour la sauvegarder de manière permanente !",
    summative_eval: "Évaluation sommative",
    module_validation: "Validation du module",
    selected_prompt: "Sujet choisi",
    structured_resp: "L'évaluation se fait sous forme de rédaction structurée.",
    locked: "Verrouillé",
    min_words: "Votre réponse doit contenir au moins 10 mots.",
    conn_err: "Erreur de connexion avec le tuteur IA.",
    retry_confirm: "Voulez-vous recommencer cette évaluation ? Votre note actuelle sera effacée.",
    no_prompts: "Aucun sujet d'évaluation détecté.",
    assignment: "Travail à rendre",
    deadline: "Date limite :",
    submission_instructions: "Instructions de soumission",
    evaluation_criteria: "Critères d'évaluation",
    final_project: "Projet final",
    format: "Format :",
    instructions: "Instructions :",
    final_quiz: "Quiz final d'évaluation",
    formative_quiz: "Auto-évaluation / Quiz formatif"
  },
  ES: {
    select_subject: "Elija un tema para validar el módulo",
    prerequisites: "Prerrequisitos y consejos",
    prep_advice: "Antes de comenzar, asegúrese de haber revisés el material. Tómese un momento para organizar sus ideas.",
    focus_advice: "Asegúrese de tener unos 15 minutos de enfoque ininterrumpido para redactar.",
    start: "Iniciar Validación",
    time_limit: "Tiempo recomendado: 15 minutos",
    time_remaining: "Tiempo restante:",
    time_expired: "¡Tiempo agotado! Aún puede revisar y enviar su trabalho.",
    placeholder: "Escriba su ensayo aquí...",
    words: "palabras",
    words_target: "Recomendado: 100 a 300 palabras",
    submit: "Enviar para validación del tutor",
    evaluating: "El tutor está calificando...",
    grade: "Calificación",
    feedback_title: "Comentarios del Tutor de IA",
    retry: "Intentar otra respuesta",
    saved_local: "Validado y guardado localmente",
    guest_alert: "💡 En modo invitado, su calificación es temporal. ¡Cree una cuenta para guardarla permanentemente!",
    summative_eval: "Evaluación sumativa",
    module_validation: "Validación del módulo",
    selected_prompt: "Tema seleccionado",
    structured_resp: "La evaluación requiere una respuesta escrita estructurada.",
    locked: "Bloqueado",
    min_words: "Su respuesta debe contener al menos 10 palabras.",
    conn_err: "Error de conexão com o tutor IA.", // wait, let's keep exact ES: "Error de conexión con el tutor IA."
    retry_confirm: "¿Está seguro de que desea reiniciar esta evaluación? Se borrará su calificación actual.",
    no_prompts: "No se detectaron temas de evaluación.",
    assignment: "Tarea a entregar",
    deadline: "Fecha límite:",
    submission_instructions: "Instrucciones de entrega",
    evaluation_criteria: "Criterios de evaluación",
    final_project: "Proyecto final",
    format: "Formato:",
    instructions: "Instrucciones:",
    final_quiz: "Cuestionario de evaluación final",
    formative_quiz: "Autoevaluación / Cuestionario formativo"
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
    guest_alert: "💡 Im Gastmodus ist Ihre Note vorübergehend. Registrieren Sie sich, um sie dauerhaft zu speichern!",
    summative_eval: "Summative Bewertung",
    module_validation: "Modulvalidierung",
    selected_prompt: "Ausgewähltes Thema",
    structured_resp: "Die Bewertung erfordert eine strukturierte schriftliche Antwort.",
    locked: "Gesperrt",
    min_words: "Ihre Antwort muss mindestens 10 Wörter enthalten.",
    conn_err: "Verbindung zum KI-Tutor fehlgeschlagen.",
    retry_confirm: "Sind Sie sicher, dass Sie diese Bewertung neu starten möchten? Ihre aktuelle Note wird gelöscht.",
    no_prompts: "Keine Bewertungsthemen erkannt.",
    assignment: "Hausaufgabe",
    deadline: "Abgabefrist:",
    submission_instructions: "Richtlinien für die Einreichung",
    evaluation_criteria: "Bewertungskriterien",
    final_project: "Abschlussprojekt",
    format: "Format:",
    instructions: "Anweisungen:",
    final_quiz: "Abschlusstest",
    formative_quiz: "Selbstbewertung / Formatives Quiz"
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
    guest_alert: "💡 在游客模式下，您的成绩是暂时的。注册账户以永久保存您的学习记录！",
    summative_eval: "终结性评估",
    module_validation: "模块验证",
    selected_prompt: "已选主题",
    structured_resp: "评估需要结构化的书面回答。",
    locked: "已锁定",
    min_words: "您的回答必须包含至少 10 个字。",
    conn_err: "连接 AI 导师失败。",
    retry_confirm: "您确定要重新开始此评估吗？您当前的成绩将被清除。",
    no_prompts: "未检测到评估主题。",
    assignment: "待交作业",
    deadline: "截止日期：",
    submission_instructions: "提交说明",
    evaluation_criteria: "评估标准",
    final_project: "期末项目",
    format: "格式：",
    instructions: "指示：",
    final_quiz: "期末评估测试",
    formative_quiz: "自我评估 / 形成性测验"
  },
  PT: {
    select_subject: "Escolha um tema para validar",
    prerequisites: "Pré-requisitos e Conselhos",
    prep_advice: "Antes de começar, garanta que revisou o material do curso. Tire um momento para organizar seus pensamentos.",
    focus_advice: "Garanta cerca de 15 minutos de foco ininterrupto para escrever sua resposta.",
    start: "Iniciar Validação do Módulo",
    time_limit: "Tempo recomendado: 15 minutos",
    time_remaining: "Tempo restante:",
    time_expired: "Tempo esgotado! Você ainda pode revisar e enviar seu trabalho.",
    placeholder: "Digite sua resposta de redação aqui...",
    words: "palavras",
    words_target: "Recomendado: 100 a 300 palavras",
    submit: "Enviar para Validação do Tutor",
    evaluating: "O tutor está avaliando seu trabalho...",
    grade: "Nota",
    feedback_title: "Feedback do Tutor IA",
    retry: "Tentar outra resposta",
    saved_local: "Validado e salvo localmente",
    guest_alert: "💡 No modo convidado, sua nota é salva temporariamente neste navegador. Crie uma conta para salvar permanentemente!",
    summative_eval: "Avaliação Somativa",
    module_validation: "Validação do Módulo",
    selected_prompt: "Tema Selecionado",
    structured_resp: "A avaliação exige uma resposta escrita estruturada.",
    locked: "Bloqueado",
    min_words: "Sua resposta deve conter pelo menos 10 palavras.",
    conn_err: "Falha ao conectar com o tutor IA.",
    retry_confirm: "Tem certeza de que deseja reiniciar esta avaliação? Sua nota atual será apagada.",
    no_prompts: "Nenhum tema de avaliação detectado.",
    assignment: "Trabalho a entregar",
    deadline: "Prazo limite:",
    submission_instructions: "Instruções de envio",
    evaluation_criteria: "Critérios de avaliação",
    final_project: "Projeto final",
    format: "Formato:",
    instructions: "Instruções:",
    final_quiz: "Questionário de avaliação final",
    formative_quiz: "Autoavaliação / Questionário formativo"
  },
  AR: {
    select_subject: "اختر موضوعًا للمصادقة",
    prerequisites: "الشروط المسبقة والنصائح",
    prep_advice: "قبل البدء، تأكد من مراجعة مواد الدورة التدريبية. خذ لحظة لتنظيم أفكارك.",
    focus_advice: "تأكد من حصولك على حوالي 15 دقيقة من التركيز دون انقطاع لكتابة إجابتك.",
    start: "بدء التحقق من صحة الوحدة",
    time_limit: "الوقت الموصى به: 15 دقيقة",
    time_remaining: "الوقت المتبقي:",
    time_expired: "انتهى الوقت! لا يزال بإمكانك مراجعة عملك وتقديمه.",
    placeholder: "اكتب إجابتك الإنشائية هنا...",
    words: "كلمة",
    words_target: "الموصى به: 100 إلى 300 كلمة",
    submit: "إرسال للمصادقة من قبل المعلم",
    evaluating: "يقوم المعلم بتقييم عملك...",
    grade: "الدرجة",
    feedback_title: "ملاحظات المعلم الآلي",
    retry: "محاولة إجابة أخرى",
    saved_local: "تم التحقق منه وحفظه محليًا",
    guest_alert: "💡 في وضع الضيف، يتم حفظ درجتك مؤقتًا في متصفحك. أنشئ حسابًا لحفظها بشكل دائم!",
    summative_eval: "التقييم الإجمالي",
    module_validation: "التحقق من صحة الوحدة",
    selected_prompt: "الموضوع المختار",
    structured_resp: "يتطلب التقييم استجابة مكتوبة منظمة.",
    locked: "مغلق",
    min_words: "يجب أن تحتوي إجابتك على 10 كلمات على الأقل.",
    conn_err: "فشل الاتصال بالمعلم الآلي.",
    no_prompts: "لم يتم اكتشاف أي مواضيع للتقييم.",
    assignment: "المهمة الدراسية",
    deadline: "الموعد النهائي:",
    submission_instructions: "تعليمات التقديم",
    evaluation_criteria: "معايير التقييم",
    final_project: "المشروع النهائي",
    format: "التنسيق:",
    instructions: "التعليمات:",
    final_quiz: "الاختبار النهائي للتقييم",
    formative_quiz: "التقييم الذاتي / الاختبار التكويني",
    retry_confirm: "هل أنت متأكد أنك تريد إعادة تشغيل هذا التقييم؟ ستُحذف درجتك الحالية."
  },
  HI: {
    select_subject: "सत्यापित करने के लिए एक विषय चुनें",
    prerequisites: "पूर्वापेक्षाएँ और सलाह",
    prep_advice: "शुरू करने से पहले, सुनिश्चित करें कि आपने पाठ्यक्रम सामग्री की समीक्षा कर ली है। अपने विचारों को व्यवस्थित करने के लिए कुछ समय लें।",
    focus_advice: "सुनिश्चित करें कि आपके पास अपनी प्रतिक्रिया लिखने के लिए लगभग 15 मिनट का निर्बाध ध्यान है।",
    start: "मॉड्यूल सत्यापन प्रारंभ करें",
    time_limit: "अनुशंसित समय सीमा: 15 मिनट",
    time_remaining: "समय शेष:",
    time_expired: "समय समाप्त! आप अभी भी अपने काम की समीक्षा और सबमिट कर सकते हैं।",
    placeholder: "अपनी प्रतिक्रिया यहाँ टाइप करें...",
    words: "शब्द",
    words_target: "अनुशंसित: 100 से 300 शब्द",
    submit: "ट्यूटर सत्यापन के लिए सबमिट करें",
    evaluating: "ट्यूटर आपके काम का मूल्यांकन कर रहा है...",
    grade: "ग्रेड",
    feedback_title: "एआई ट्यूटर प्रतिक्रिया",
    retry: "दूसरा प्रयास करें",
    saved_local: "सत्यापित और स्थानीय रूप से सहेजा गया",
    guest_alert: "💡 अतिथि मोड में, आपका ग्रेड इस ब्राउज़र सत्र में अस्थायी रूप से सहेजा जाता है। इसे स्थायी रूप से सहेजने के लिए एक खाता बनाएं!",
    summative_eval: "योगात्मक मूल्यांकन",
    module_validation: "मॉड्यूल सत्यापन",
    selected_prompt: "चयनित संकेत",
    structured_resp: "मूल्यांकन के लिए एक संरचित लिखित प्रतिक्रिया की आवश्यकता होती है।",
    locked: "लॉक किया गया",
    min_words: "आपका उत्तर कम से कम 10 शब्दों का होना चाहिए।",
    conn_err: "एआई ट्यूटर से कनेक्ट करने में विफल।",
    no_prompts: "कोई मूल्यांकन संकेत नहीं मिला।",
    assignment: "सौंपा गया कार्य",
    deadline: "अंतिम तिथि:",
    submission_instructions: "जमा करने के निर्देश",
    evaluation_criteria: "मूल्यांकन मानदंड",
    final_project: "अंतिम परियोजना",
    format: "प्रारूप:",
    instructions: "निर्देश:",
    final_quiz: "अंतिम मूल्यांकन प्रश्नोत्तरी",
    formative_quiz: "आत्म-मूल्यांकन / रचनात्मक प्रश्नोत्तरी",
    retry_confirm: "क्या आप वाकई इस मूल्यांकन को पुनः आरंभ करना चाहते हैं? आपका वर्तमान ग्रेड मिट जाएगा।"
  },
  UR: {
    select_subject: "توثیق کے لیے एक موضوع منتخب کریں",
    prerequisites: "پہلے سے درکار شرائط اور مشورہ",
    prep_advice: "کورس کے مواد کا جائزہ لے لیا ہے۔ اپنے خیالات کو ترتیب دینے کے لیے کچھ وقت نکالیں۔",
    focus_advice: "یقینی بنائیں کہ آپ کے پاس جواب لکھنے کے لیے تقریباً 15 منٹ کا بلا تعطل وقت ہے۔",
    start: "ماڈیول کی توثیق شروع کریں",
    time_limit: "تجویز کردہ وقت کی حد: 15 منٹ",
    time_remaining: "باقی وقت:",
    time_expired: "وقت ختم ہو گیا! آپ اب بھی اپنے کام کا جائزہ لے کر جمع کروا سکتے ہیں۔",
    placeholder: "اپنا مضمون کا جواب یہاں لکھیں...",
    words: "الفاظ",
    words_target: "تجویز کردہ: 100 سے 305 الفاظ",
    submit: "ٹیوٹر کی توثیق کے لیے جمع کروائیں",
    evaluating: "ٹیوٹر آپ کے کام کا جائزہ لے رہا ہے...",
    grade: "گریڈ",
    feedback_title: "اے آئی ٹیوٹر کا تبصرہ",
    retry: "دوسرا جواب آزمائیں",
    saved_local: "تصدیق شدہ اور مقامی طور پر محفوظ شدہ",
    guest_alert: "💡 مہمان موڈ میں، آپ کا گریڈ اس براؤزر سیشن میں عارضی طور پر محفوظ ہوتا ہے۔ اسے مستقل طور پر محفوظ کرنے کے لیے اکاؤنٹ بنائیں!",
    summative_eval: "خلاصہ تشخیص",
    module_validation: "ماڈیول کی توثیق",
    selected_prompt: "منتخب کردہ پرامپٹ",
    structured_resp: "تشخیص کے لیے ایک منظم تحریری جواب درکار ہے۔",
    locked: "مقفل",
    min_words: "آپ کا جواب کم از کم 10 الفاظ پر مشتمل ہونا چاہیے۔",
    conn_err: "اے آئی ٹیوٹر سے رابطہ کرنے میں ناکام۔",
    no_prompts: "کوئی تشخیصی پرامپٹ نہیں ملا۔",
    assignment: "کام جو جمع کرانا ہے",
    deadline: "آخری تاریخ:",
    submission_instructions: "جمع کرانے کی ہدایات",
    evaluation_criteria: "تشخیصی معیار",
    final_project: "آخری پروجیکٹ",
    format: "فارمیٹ:",
    instructions: "ہدایات:",
    final_quiz: "آخری تشخیصی کوئز",
    formative_quiz: "ذاتی تشخیص / تکوینی کوئز",
    retry_confirm: "کیا آپ واقعی اس تشخیص کو دوبارہ شروع کرنا چاہتے ہیں؟ آپ کا موجودہ گریڈ ختم ہو جائے گا۔"
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

  const [extendTime, setExtendTime] = React.useState(false);

  React.useEffect(() => {
    const handlePrefsChange = () => {
      const savedProfile = localStorage.getItem('op_user_profile');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          setExtendTime(!!p.extendAssessmentTime);
        } catch {}
      }
    };
    handlePrefsChange();
    window.addEventListener('op_accessibility_preferences_changed', handlePrefsChange);
    return () => window.removeEventListener('op_accessibility_preferences_changed', handlePrefsChange);
  }, []);

  const actualDurationLimit = durationLimit ? (extendTime ? Math.round(durationLimit * 1.25) : durationLimit) : undefined;

  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [isStarted, setIsStarted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(actualDurationLimit || durationLimit);
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
      let hasDraft = false;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswer(parsed.answer || '');
          setGrade(parsed.grade || null);
          setFeedback(parsed.feedback || null);
          const draftMode = !!parsed.isDraft;
          setIsReadOnly(draftMode ? false : true);
          setIsStarted(true);
          hasDraft = draftMode;
        } catch (e) {
          // ignore
        }
      } else {
        setAnswer('');
        setGrade(null);
        setFeedback(null);
        setIsReadOnly(false);
        setIsStarted(false);
        setTimeLeft(actualDurationLimit || durationLimit);
      }

      if (actualDurationLimit) {
        const startTimeKey = `op_summative_start_time_${storageKey}`;
        const savedStartTime = localStorage.getItem(startTimeKey);
        if (savedStartTime) {
          const elapsedSeconds = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
          const remaining = actualDurationLimit - elapsedSeconds;
          if (remaining <= 0) {
            setTimeLeft(0);
            setIsReadOnly(true);
          } else {
            setTimeLeft(remaining);
          }
          setIsStarted(true);
        } else if (hasDraft) {
          localStorage.setItem(startTimeKey, Date.now().toString());
        }
      }
    }
  }, [storageKey, durationLimit, actualDurationLimit]);

  // Autosave draft to local storage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && isStarted && !grade && !isReadOnly) {
      localStorage.setItem(storageKey, JSON.stringify({
        answer,
        isDraft: true
      }));
    }
  }, [answer, isStarted, grade, isReadOnly, storageKey]);

  React.useEffect(() => {
    if (!isStarted && actualDurationLimit) {
      setTimeLeft(actualDurationLimit);
    }
  }, [actualDurationLimit, isStarted]);

  React.useEffect(() => {
    if (!isStarted || isReadOnly || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted, isReadOnly, timeLeft]);

  // Warn user before reloading or navigating away
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isStarted && !grade && !isReadOnly && actualDurationLimit) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isStarted, grade, isReadOnly, actualDurationLimit]);

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
    if (typeof window !== 'undefined' && actualDurationLimit) {
      localStorage.setItem(`op_summative_start_time_${storageKey}`, Date.now().toString());
    }
  };

  const handleSubmit = async () => {
    if (wordCount < 10) {
      setError(t.min_words);
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
        throw new Error(errorData.error || t.conn_err);
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
    if (confirm(t.retry_confirm)) {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`op_summative_start_time_${storageKey}`);
      setAnswer('');
      setGrade(null);
      setFeedback(null);
      setIsReadOnly(false);
      setIsStarted(false);
      setTimeLeft(actualDurationLimit || durationLimit);
      setError(null);
    }
  };

  if (prompts.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 text-xs">
        {t.no_prompts}
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
              {t.summative_eval}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              {t.module_validation}
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
            {t.selected_prompt}
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
                <span>{t.structured_resp}</span>
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
                <span>{t.locked}</span>
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
  
  // Check if children contain any structured evaluation component
  const hasStructuredComponent = childrenArray.some(
    child => React.isValidElement(child) && (
      child.type === Quiz || (child.type as any)?.name === 'Quiz' ||
      child.type === EssayEvaluation || (child.type as any)?.name === 'EssayEvaluation' ||
      child.type === OralEvaluation || (child.type as any)?.name === 'OralEvaluation' || (child.type as any)?.name === 'EvaluationOrale'
    )
  );

  const finalChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      const type = child.type;
      const typeName = typeof type === 'string' ? type : (type as any)?.name;
      if (
        type === Quiz || typeName === 'Quiz' || 
        type === EssayEvaluation || typeName === 'EssayEvaluation' ||
        type === OralEvaluation || typeName === 'OralEvaluation' || typeName === 'EvaluationOrale'
      ) {
        return React.cloneElement(child, { isFinal: true } as any);
      }
    }
    return child;
  });

  if (hasStructuredComponent) {
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
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl">
      <div className="flex items-center gap-2 text-amber-400 mb-2 select-none">
        <FileText className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.assignment}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const Deadline = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold my-2 select-none">
      <Calendar className="w-3.5 h-3.5" />
      <span>{t.deadline} {children}</span>
    </div>
  );
};

const Submission = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-4 bg-slate-950/20 border border-dashed border-slate-800/80 rounded-2xl my-4">
      <div className="flex items-center gap-2 text-slate-400 mb-2 select-none">
        <Send className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.submission_instructions}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const Evaluation = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-4 bg-slate-950/20 border border-slate-800 rounded-2xl my-4">
      <div className="flex items-center gap-2 text-blue-400 mb-2 select-none">
        <Award className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.evaluation_criteria}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const FinalProject = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-5 bg-slate-950/50 border border-blue-500/25 rounded-2xl my-6">
      <div className="flex items-center gap-2 text-blue-400 mb-3 select-none">
        <Award className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.final_project}</span>
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
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="text-xs text-slate-400 border-l-2 border-slate-700 pl-3 my-2">
      <strong className="text-slate-300">{t.format} </strong>{children}
    </div>
  );
};

const Instructions = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="space-y-2 my-3">
      <span className="text-xs font-bold text-slate-400 select-none">{t.instructions}</span>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const FinalQuiz = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-5 bg-slate-950/30 border border-slate-850 rounded-2xl my-6">
      <div className="flex items-center gap-2 text-violet-400 mb-3 select-none">
        <HelpCircle className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.final_quiz}</span>
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
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-5 bg-slate-950/30 border border-slate-850 rounded-2xl my-6">
      <div className="flex items-center gap-2 text-emerald-400 mb-3 select-none">
        <HelpCircle className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.formative_quiz}</span>
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

const components = {
  Alert,
  Biography,
  CustomFigure,
  Quiz,
  Question,
  Option,
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
  EssayEvaluation,
  OralEvaluation,
  EvaluationOrale: OralEvaluation,
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
  CardSort,
  AssociationPaires: CardSort,
  MatchingEvaluation,
  AssociationCorrespondance: MatchingEvaluation,
  ReorderEvaluation,
  ReordonnerItems: ReorderEvaluation,
  SocraticInput,
  AnalyseSocratique: SocraticInput,
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
  componentStack?: string | null;
}

const COMPATIBILITY_TRANSLATIONS: Record<string, {
  singular: { prefix: string; suffix: string };
  plural: { prefix: string; suffix: string };
  categories: {
    singular: Record<string, string>;
    plural: Record<string, string>;
  };
}> = {
  EN: {
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
  const title = language === 'FR' ? "Mode de compatibilité activé" :
                language === 'ES' ? "Modo de compatibilidad activado" :
                language === 'DE' ? "Kompatibilitätsmodus aktiviert" :
                language === 'ZH' ? "兼容模式已启用" : "Compatibility Mode Enabled";

  const failedKeys = detectComponentsFromError(error, componentStack, rawMdx);

  if (failedKeys.length === 0) {
    const fallbackText = language === 'FR' ? "Ce chapitre s'affiche en version allégée en raison d'une anomalie dans le format des composants interactifs de la leçon. Cet incident peut être transitoire en raison de l'utilisation de sources externes. L'incident a été signalé à l'administration." :
                         language === 'ES' ? "Este capítulo se muestra en una versión simplificada debido a una anomalía en el formato de los componentes interactivos de la lección. Este incidente puede ser transitorio debido al uso de fuentes externas. El incidente ha sido reportado a la administración." :
                         language === 'DE' ? "Dieses Kapitel wird aufgrund einer Anomalie im Format interaktiver Komponenten der Lektion in einer vereinfachten Version angezeigt. Dieser Vorfall kann aufgrund der Verwendung externer Quellen vorübergehend sein. Der Vorfall wurde der Verwaltung gemeldet." :
                         language === 'ZH' ? "本章因课程的互动组件格式异常而以精简版显示。由于使用了外部来源，此问题可能是暂时的。该事件已报告给管理部门。" :
                         "This chapter is displayed in a simplified version due to an anomaly in the format of the interactive components of the lesson. This incident may be temporary due to the use of external sources. The incident has been reported to the administration.";
    return { title, text: fallbackText };
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
  clean = clean.replace(/<(?:RealPerson|HistoricalPerson|Event|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|FictionalCharacter|Location|Place|WebsiteLink|ProjectLink|SiteWeb|ProjetLien|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)\b[^>]*?>([\s\S]*?)<\/(?:RealPerson|HistoricalPerson|Event|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|FictionalCharacter|Location|Place|WebsiteLink|ProjectLink|SiteWeb|ProjetLien|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)>/gi, '**$1**');
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
    <MdxStatusProvider>
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

    return {
      ...components,
      FillInBlanks: wrapper,
      'FillInBlanks.Input': wrapper.Input,
    };
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
