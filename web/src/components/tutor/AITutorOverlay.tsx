"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MathRenderer } from '../mdx/MathRenderer';
import { Mermaid } from '../mdx/Mermaid';
import Link from 'next/link';
import { 
  Send, Sparkles, User, Bot, X, MessageSquare, AlertTriangle, Share2, 
  Bookmark, Menu, ChevronLeft, ChevronRight, CheckCircle, ChevronDown, LogOut, Trash2, Globe, Settings, ShieldAlert, GraduationCap, Brain, Loader2, Lock, Mic, MicOff, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpenPrimerIcon } from '../OpenPrimerIcon';
import { EnrollmentModal } from '../modals/EnrollmentModal';
import { SettingsModal } from '../modals/SettingsModal';
import { useLanguage } from '@/context/LanguageContext';
import { dbService, TutorPersonality, isDatabaseConfigured, isSandboxFallbackAllowed } from '@/lib/db';
import { decryptApiKey } from '@/lib/crypto';

// --- INTERNATIONALIZATION DICTIONARY (UI ONLY) ---
import { STATIC_UI_STRINGS, cleanPathSegment, UI_STRINGS, getLocalizedLabel, getLocalizedLevelSlug, getCanonicalLevelFromSlug, getLocalizedSubjectSlug, getCanonicalSubjectFromSlug, getCoursePath } from '@/lib/translations';



import { usePathname } from 'next/navigation';

// --- UTILITY: LaTeX & Markdown Parsing ---
const renderInlineContent = (text: string): React.ReactNode[] => {
  const tokens: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Regex matches: block math ($$...$$), inline math ($...$), bold (**...**), and italic (*...*)
  const inlineRegex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\*\*[^*]+?\*\*|\*[^*]+?\*)/g;
  let match;
  
  while ((match = inlineRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const matchedStr = match[0];
    
    // Add text before the match
    if (matchIndex > currentIndex) {
      tokens.push(text.slice(currentIndex, matchIndex));
    }
    
    // Process the match
    if (matchedStr.startsWith('$$') && matchedStr.endsWith('$$')) {
      const math = matchedStr.slice(2, -2);
      tokens.push(<MathRenderer key={matchIndex} inline={false} content={math} />);
    } else if (matchedStr.startsWith('$') && matchedStr.endsWith('$')) {
      const math = matchedStr.slice(1, -1);
      tokens.push(<MathRenderer key={matchIndex} inline={true} content={math} />);
    } else if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      const boldText = matchedStr.slice(2, -2);
      tokens.push(<strong key={matchIndex} className="font-extrabold text-white">{boldText}</strong>);
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
      const italicText = matchedStr.slice(1, -1);
      tokens.push(<em key={matchIndex} className="italic text-slate-300">{italicText}</em>);
    }
    
    currentIndex = inlineRegex.lastIndex;
  }
  
  if (currentIndex < text.length) {
    tokens.push(text.slice(currentIndex));
  }
  
  return tokens.length > 0 ? tokens : [text];
};

interface TutorMessageContentProps {
  content: string;
}

const parseMarkdownTableRow = (row: string): string[] => {
  let s = row.trim();
  if (s.startsWith('|')) {
    s = s.slice(1);
  }
  if (s.endsWith('|')) {
    s = s.slice(0, -1);
  }
  return s.split('|').map(cell => cell.trim());
};

const TutorMessageContent = ({ content }: TutorMessageContentProps) => {
  if (!content) return null;
  if (content === '...') {
    return (
      <div className="flex items-center gap-1.5 py-1">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    );
  }

  const blocks: React.ReactNode[] = [];
  const lines = content.split('\n');
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // 1. Code Block start
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      let codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      
      if (lang.toLowerCase() === 'mermaid') {
        blocks.push(
          <div key={`mermaid-${i}`} className="w-full my-3">
            <Mermaid chart={codeLines.join('\n')} />
          </div>
        );
      } else {
        blocks.push(
          <pre key={`code-${i}`} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/85 font-mono text-xs overflow-x-auto text-slate-200 my-3">
            {lang && <div className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1">{lang}</div>}
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
      }
      continue;
    }
    
    // 2. Block Math start
    if (trimmed === '$$') {
      let mathLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '$$') {
        mathLines.push(lines[i]);
        i++;
      }
      i++; // skip closing $$
      const math = mathLines.join('\n');
      blocks.push(
        <div key={`mathblk-${i}`} className="my-4 overflow-x-auto py-2 px-4 bg-slate-950/30 rounded-2xl border border-slate-800/20">
          <MathRenderer inline={false} content={math} />
        </div>
      );
      continue;
    }
    
    // Inline block math on its own line
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      const math = trimmed.slice(2, -2);
      blocks.push(
        <div key={`mathblk-single-${i}`} className="my-4 overflow-x-auto py-2 px-4 bg-slate-950/30 rounded-2xl border border-slate-800/20">
          <MathRenderer inline={false} content={math} />
        </div>
      );
      i++;
      continue;
    }

    // 2b. Markdown Table
    if (trimmed.startsWith('|') && i + 1 < lines.length && lines[i+1].trim().startsWith('|')) {
      let tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      
      if (tableLines.length >= 2) {
        const headerRow = tableLines[0];
        const headers = parseMarkdownTableRow(headerRow);
        
        const secondRow = tableLines[1];
        const isDivider = /^\|?[\s-:\\|]+$/.test(secondRow);
        
        const startBodyIdx = isDivider ? 2 : 1;
        const bodyRows = tableLines.slice(startBodyIdx).map(row => {
          return parseMarkdownTableRow(row);
        });
        
        blocks.push(
          <div key={`table-${i}`} className="my-4 overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/20 shadow-lg">
            <table className="min-w-full text-xs text-left text-slate-300">
              {headers.length > 0 && (
                <thead className="bg-slate-950/60 font-black uppercase text-slate-400 border-b border-slate-800/80">
                  <tr>
                    {headers.map((h, idx) => (
                      <th key={idx} className="px-4 py-3 font-extrabold tracking-wider">{renderInlineContent(h)}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-slate-800/40">
                {bodyRows.map((cols, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-800/20 transition-colors">
                    {cols.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 font-medium">{renderInlineContent(col)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 3. Unordered List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      let listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="list-disc pl-6 space-y-1.5 my-3 text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {renderInlineContent(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }
    
    // 4. Ordered List
    if (/^\d+\.\s/.test(trimmed)) {
      let listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        const itemTrim = lines[i].trim();
        const match = itemTrim.match(/^(\d+)\.\s(.*)/);
        if (match) {
          listItems.push(match[2]);
        } else {
          listItems.push(itemTrim);
        }
        i++;
      }
      blocks.push(
        <ol key={`ol-${i}`} className="list-decimal pl-6 space-y-1.5 my-3 text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {renderInlineContent(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 5. Header tags
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const headingStyles = {
          1: "text-lg font-black text-white mt-4 mb-2",
          2: "text-base font-extrabold text-white mt-3 mb-1.5",
          3: "text-sm font-bold text-slate-200 mt-2.5 mb-1",
          4: "text-xs font-bold text-slate-300 mt-2 mb-1",
          5: "text-xs font-bold text-slate-400 mt-2 mb-1",
          6: "text-xs font-semibold text-slate-400 mt-2 mb-1",
        };
        const className = headingStyles[level as keyof typeof headingStyles] || headingStyles[3];
        blocks.push(
          <div key={`header-${i}`} className={className}>
            {renderInlineContent(text)}
          </div>
        );
        i++;
        continue;
      }
    }

    // 6. Plain paragraph
    if (trimmed === '') {
      i++;
      continue;
    }
    
    let paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && 
           !lines[i].trim().startsWith('```') && 
           !lines[i].trim().startsWith('- ') && 
           !lines[i].trim().startsWith('* ') && 
           !/^\d+\.\s/.test(lines[i].trim()) &&
           !lines[i].trim().startsWith('#') &&
           !lines[i].trim().startsWith('|') &&
           lines[i].trim() !== '$$') {
      paraLines.push(lines[i]);
      i++;
    }
    
    const paraText = paraLines.join('\n');
    blocks.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-slate-300 mb-3.5 last:mb-0">
        {renderInlineContent(paraText)}
      </p>
    );
  }
  
  return <div className="space-y-1">{blocks}</div>;
};

const AI_ACT_DISCLAIMERS = {
  EN: "AI Act Notice: You are interacting with an autonomous AI tutor. Responses are educational-only and do not replace certified educators. Verify key scientific facts.",
  FR: "Avis AI Act : Vous interagissez avec un tuteur autonome propulsé par IA. Les réponses sont fournies à titre indicatif et ne remplacent pas un enseignant certifié. Vérifiez les faits.",
  ES: "Aviso AI Act: Interactúa con un tutor autónomo de IA. Las respuestas son didácticas y no sustituyen a educadores certificados. Verifique los datos científicos clave.",
  DE: "KI-Gesetz-Hinweis: Sie interagieren mit einem autonomen KI-Tutor. Antworten dienen nur zu Lernzwecken und ersetzen keine zertifizierten Lehrkräfte. Überprüfen Sie wichtige Fakten.",
  ZH: "AI Act 提示：您正与自主人工智能导师互动。所有回答仅供学习参考，不能替代认证教师。请核实关键科学事实。",
  PT: "Aviso do AI Act: Você está interagindo com um tutor de IA autônomo. As respostas são apenas educativas e não substituem educadores certificados. Verifique fatos científicos.",
  AR: "إشعار قانون الذكاء الاصطناعي: أنت تتفاعل مع معلم ذكاء اصطناعي مستقل. الإجابات تعليمية فقط ولا تغني عن المعلمين المعتمدين. يرجى التحقق من الحقائق العلمية.",
  HI: "AI Act नोटिस: आप एक स्वायत्त AI ट्यूटर के साथ बातचीत कर रहे हैं। उत्तर केवल शैक्षिक हैं और प्रमाणित शिक्षकों का स्थान नहीं लेते हैं। कृपया महत्वपूर्ण वैज्ञानिक तथ्यों की पुष्टि करें।",
  UR: "AI Act نوٹس: آپ ایک خود مختار AI ٹیوٹر کے ساتھ بات چیت کر رہے ہیں۔ جوابات صرف تعلیمی ہیں اور تصدیق شدہ اساتذہ کا متبادل نہیں ہیں۔ براہ کرم اہم سائنسی حقائق کی تصدیق کریں۔"
};

interface AITutorOverlayProps {
  lang?: string;
  pageContext?: string;
  courseLevel?: string;
  courseTitle?: string;
  courseSubject?: string;
  isDashboardMode?: boolean;
}

// --- COMPONENT: AI TUTOR OVERLAY ---
const TUTOR_LOCAL_STRINGS: Record<string, { stopped: string; connErr: string; unlockDesc: string; stopTitle: string }> = {
  EN: {
    stopped: "Generation stopped.",
    connErr: "Sorry, I'm having trouble connecting. Please check your connection and try again.",
    unlockDesc: "A free account is available to let you follow the full curriculum, save your progress permanently, and benefit from the features of an exceptional personal AI tutor!",
    stopTitle: "Stop response"
  },
  FR: {
    stopped: "Génération interrompue.",
    connErr: "Désolé, je rencontre des difficultés pour me connecter. Veuillez vérifier votre connexion et réessayer.",
    unlockDesc: "Un compte gratuit est disponible pour vous permettre de suivre l'intégralité du cursus, enregistrer durablement votre progression et bénéficier des fonctionnalités d'un tuteur IA personnel d'exception !",
    stopTitle: "Arrêter la réflexion"
  },
  ES: {
    stopped: "Generación detenida.",
    connErr: "Lo siento, tengo problemas para conectarme. Verifique su conexión e inténtelo de nuevo.",
    unlockDesc: "¡Hay una cuenta gratuita disponible para seguir el plan de estudios completo, guardar su progreso y disfrutar de un tutor personal de IA excepcional!",
    stopTitle: "Detener respuesta"
  },
  DE: {
    stopped: "Generierung gestoppt.",
    connErr: "Entschuldigung, Verbindungsprobleme. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    unlockDesc: "Ein kostenloses Konto steht zur Verfügung, um den gesamten Lehrplan zu verfolgen, Ihren Fortschritt dauerhaft zu speichern und einen erstklassigen KI-Tutor zu nutzen!",
    stopTitle: "Antwort stoppen"
  },
  ZH: {
    stopped: "生成已停止。",
    connErr: "抱歉，连接遇到问题。请检查您的网络连接后重试。",
    unlockDesc: "免费账户现已开放，助您学习完整课程、永久保存学习进度，并尊享卓越的专属 AI 导师功能！",
    stopTitle: "停止回答"
  },
  PT: {
    stopped: "Geração interrompida.",
    connErr: "Desculpe, estou com problemas de conexão. Verifique a sua ligação e tente novamente.",
    unlockDesc: "Uma conta gratuita está disponível para acompanhar todo o currículo, guardar o seu progresso e beneficiar de um tutor de IA pessoal de excelência!",
    stopTitle: "Parar resposta"
  },
  AR: {
    stopped: "توقف التوليد.",
    connErr: "عذراً، أواجه صعوبة في الاتصال. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
    unlockDesc: "يتوفر حساب مجاني يتيح لك متابعة المنهج بالكامل، وحفظ تقدمك بشكل دائم، والاستفادة من ميزات معلم ذكي شخصي استثنائي!",
    stopTitle: "إيقاف الاستجابة"
  },
  HI: {
    stopped: "जनरेशन रोक दिया गया।",
    connErr: "क्षमा करें, मुझे कनेक्ट करने में समस्या हो रही है। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।",
    unlockDesc: "पूरे पाठ्यक्रम का पालन करने, अपनी प्रगति को स्थायी रूप से सहेजने और एक असाधारण व्यक्तिगत एआई ट्यूटर की सुविधाओं का लाभ उठाने के लिए एक निःशुल्क खाता उपलब्ध है!",
    stopTitle: "प्रतिक्रिया रोकें"
  },
  UR: {
    stopped: "جنریشن روک دی گئی۔",
    connErr: "معذرت، رابطے میں دشواری ہو رہی ہے۔ براہ کرم اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔",
    unlockDesc: "مکمل نصاب کی پیروی کرنے، اپنی پیشرفت کو مستقل طور پر محفوظ کرنے اور ایک بہترین ذاتی اے آئی ٹیوٹر کی خصوصیات سے فائدہ اٹھانے کے لیے ایک مفت اکاؤنٹ دستیاب ہے!",
    stopTitle: "جواب روکیں"
  }
};

export const AITutorOverlay = ({ 
  lang: propLang, 
  pageContext,
  courseLevel,
  courseTitle,
  courseSubject,
  isDashboardMode = false
}: AITutorOverlayProps = {}) => {
  const { language: contextLang } = useLanguage();
  const lang = propLang || contextLang;
  
  const [tutorAssistanceBlocked, setTutorAssistanceBlocked] = useState(false);

  useEffect(() => {
    const handleLockdown = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.disabled === 'boolean') {
        setTutorAssistanceBlocked(customEvent.detail.disabled);
      }
    };
    window.addEventListener('op_disable_tutor_assistance', handleLockdown);
    return () => {
      window.removeEventListener('op_disable_tutor_assistance', handleLockdown);
    };
  }, []);

  if (tutorAssistanceBlocked) return null;

  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [isOpen, setIsOpen] = useState(false);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: t.welcome }]);

  // Active Cognitive Bridge States
  const [isGlowing, setIsGlowing] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const glowTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTutorToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    
    if (nextOpen) {
      setIsGlowing(false);
      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current);
        glowTimeoutRef.current = null;
      }
      
      if (pendingPrompt) {
        setActiveTab('chat');
        setTimeout(() => {
          handleSend(pendingPrompt);
          setPendingPrompt(null);
        }, 150);
      }
    }
  };
  const [input, setInput] = useState('');
  const [readingProgress, setReadingProgress] = useState<{
    textSnippet: string;
    index: number;
    total: number;
    tagName: string;
  } | null>(null);

  useEffect(() => {
    const handleProgress = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setReadingProgress({
          textSnippet: customEvent.detail.textSnippet,
          index: customEvent.detail.index,
          total: customEvent.detail.total,
          tagName: customEvent.detail.tagName
        });
      }
    };
    window.addEventListener('op_reading_progress', handleProgress);
    return () => window.removeEventListener('op_reading_progress', handleProgress);
  }, []);
  const [persona, setPersona] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('op_active_tutor_personality') || 'socratic';
    }
    return 'socratic';
  });
  const [personalities, setPersonalities] = useState<TutorPersonality[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pathname = usePathname();
  
  const segments = pathname ? pathname.split('/').filter(Boolean) : [];
  const isCurriculumPage = segments.length >= 4 && 
    !['profile', 'admin', 'api', 'catalog', 'login', 'signup'].includes(segments[0]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [tutorEnabled, setTutorEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'flashcards'>('chat');
  const [flashcards, setFlashcards] = useState<{ term: string; definition: string }[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardMastery, setCardMastery] = useState<Record<string, string>>({});
  const [isCoachingDismissed, setIsCoachingDismissed] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const initialInputTextRef = useRef<string>('');

  const [micActivity, setMicIntensity] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  const [selfEvalPre, setSelfEvalPre] = useState<number | null>(null);
  const [selfEvalPost, setSelfEvalPost] = useState<number | null>(null);
  const [coachAdvice, setCoachAdvice] = useState<string>('');
  const [showCoachPopover, setShowCoachPopover] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchAdvice() {
      if (!isCurriculumPage || isDashboardMode) return;
      const savedProfile = localStorage.getItem('op_user_profile');
      const loggedIn = localStorage.getItem('op_session') === 'true';
      let userId = 'u1';
      if (loggedIn && savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          if (p.id) userId = p.id;
        } catch (e) {}
      }
      
      try {
        const currentCourseSlug = segments[2];
        const { data: progressData } = await dbService.getUserProgress(userId, lang, currentCourseSlug);
        if (progressData && progressData.aiSummary && active) {
          const rawAdvice = progressData.aiSummary.trim();
          
          // [FIX T1] Suppression guard: only show the popup if the advice is substantive
          // and pertains to the current lesson context. Generic, very short, or placeholder
          // summaries must not trigger a popup.
          const isSubstantive = rawAdvice.length >= 30;
          const isGenericPlaceholder = /^(bienvenue|welcome|bonjour|hello|salut|démarrez|start|commencez|let's start|bonne chance|good luck|continuez|continue)/i.test(rawAdvice);
          
          if (isSubstantive && !isGenericPlaceholder) {
            setCoachAdvice(rawAdvice);
            
            const dismissed = sessionStorage.getItem('op_dismiss_resumption_coach_advice');
            if (!dismissed) {
              const timer = setTimeout(() => {
                setShowCoachPopover(true);
              }, 1500);
              return () => clearTimeout(timer);
            }
          }
        }
      } catch (e) {
        console.error("Error fetching coach advice in overlay:", e);
      }
    }
    fetchAdvice();
    return () => {
      active = false;
    };
  }, [lang, isCurriculumPage, pathname]);

  const handleDismissCoachPopover = () => {
    setShowCoachPopover(false);
    sessionStorage.setItem('op_dismiss_resumption_coach_advice', 'true');
  };

  const handleOpenChatFromCoach = () => {
    setShowCoachPopover(false);
    sessionStorage.setItem('op_dismiss_resumption_coach_advice', 'true');
    setIsOpen(true);
  };

  // Sync self-evaluation scores when opening/closing or path changes
  useEffect(() => {
    if (isOpen && pathname) {
      const getSelfEvalScores = () => {
        if (typeof window === 'undefined') return { pre: null, post: null };
        const storages = [localStorage, sessionStorage];
        let preVal: number | null = null;
        let postVal: number | null = null;
        
        for (const storage of storages) {
          if (!storage) continue;
          const pre = storage.getItem(`op_selfeval_pre_${pathname}`);
          const post = storage.getItem(`op_selfeval_post_${pathname}`);
          if (pre && preVal === null) preVal = parseInt(pre, 10);
          if (post && postVal === null) postVal = parseInt(post, 10);
        }
        return { pre: preVal, post: postVal };
      };
      
      const scores = getSelfEvalScores();
      setSelfEvalPre(scores.pre);
      setSelfEvalPost(scores.post);
    }
  }, [isOpen, pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsCoachingDismissed(localStorage.getItem('op_dismiss_flashcard_coaching') === 'true');
    }
  }, []);

  useEffect(() => {
    if (!tutorEnabled) {
      setActiveTab('flashcards');
    }
  }, [tutorEnabled]);

  // Auto-resize textarea based on text content height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Clean up all voice streams and timers on unmount
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        if (audioContextRef.current.state !== 'closed') {
          try {
            audioContextRef.current.close();
          } catch (e) {}
        }
      }
      if (micStreamRef.current) {
        try {
          micStreamRef.current.getTracks().forEach(track => track.stop());
        } catch (e) {}
      }
    };
  }, []);

  // Real-time microphone amplitude/intensity tracking using Web Audio API
  useEffect(() => {
    const startVoiceAnalysis = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const audioContext = new AudioContextClass();
        audioContextRef.current = audioContext;
        
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const updateVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          
          let total = 0;
          for (let i = 0; i < bufferLength; i++) {
            total += dataArray[i];
          }
          const average = total / bufferLength;
          setMicIntensity(average);
          
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        };
        
        updateVolume();
      } catch (err) {
        console.warn("Could not start voice analysis:", err);
      }
    };

    const stopVoiceAnalysis = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (audioContextRef.current) {
        if (audioContextRef.current.state !== 'closed') {
          try {
            audioContextRef.current.close();
          } catch (e) {}
        }
        audioContextRef.current = null;
      }
      if (micStreamRef.current) {
        try {
          micStreamRef.current.getTracks().forEach(track => track.stop());
        } catch (e) {}
        micStreamRef.current = null;
      }
      setMicIntensity(0);
    };

    if (isListening) {
      startVoiceAnalysis();
    } else {
      stopVoiceAnalysis();
    }

    return () => {
      stopVoiceAnalysis();
    };
  }, [isListening]);

  // Speech Recognition setup with 4s silence detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = lang.toLowerCase() === 'fr' ? 'fr-FR' : 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        };

        rec.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript || interimTranscript) {
            const currentSpeech = (finalTranscript + interimTranscript).trim();
            setInput(prev => {
              const base = initialInputTextRef.current || '';
              return base ? (base + " " + currentSpeech).trim() : currentSpeech;
            });
          }

          // Reset silence timer to 4 seconds
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            try {
              rec.stop();
            } catch (e) {}
          }, 4000); // 4 seconds silence
        };

        rec.onerror = (e: any) => {
          console.error("Speech Recognition error:", e);
          setIsListening(false);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        };

        recognitionRef.current = rec;
      }
    }
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(t.voice_not_supported);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    } else {
      initialInputTextRef.current = input;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        try {
          if (recognitionRef.current) recognitionRef.current.stop();
        } catch (e) {}
      }, 5000); // 5s timeout if they start speaking and say nothing
      
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
  };

  const getPersonaName = (pId: string) => {
    const selected = personalities.find(p => p.id === pId || p.name === pId);
    if (selected) {
      const transName = selected.translations?.[lang.toUpperCase()]?.name || selected.translations?.[lang.toLowerCase()]?.name;
      if (transName) {
        return transName;
      }
      return selected.name;
    }
    return pId;
  };

  useEffect(() => {
    const updateAuth = () => {
      const session = localStorage.getItem('op_session');
      setIsLoggedIn(session === 'true');
    };
    updateAuth();
    window.addEventListener('storage', updateAuth);
    window.addEventListener('op_auth_state_changed', updateAuth);
    window.addEventListener('op_auth_state_change', updateAuth);
    return () => {
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('op_auth_state_changed', updateAuth);
      window.removeEventListener('op_auth_state_change', updateAuth);
    };
  }, []);

  useEffect(() => {
    const syncTutorEnabled = () => {
      const savedProfile = localStorage.getItem('op_user_profile');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          if (p.tutorEnabled !== undefined) {
            setTutorEnabled(p.tutorEnabled);
          } else if (p.tutor_enabled !== undefined) {
            setTutorEnabled(p.tutor_enabled);
          } else {
            setTutorEnabled(true);
          }
        } catch (e) {
          setTutorEnabled(true);
        }
      } else {
        setTutorEnabled(true);
      }
    };
    syncTutorEnabled();
    window.addEventListener('op_accessibility_preferences_changed', syncTutorEnabled);
    window.addEventListener('storage', syncTutorEnabled);
    return () => {
      window.removeEventListener('op_accessibility_preferences_changed', syncTutorEnabled);
      window.removeEventListener('storage', syncTutorEnabled);
    };
  }, []);

  // Automatically clean up any active generation stream on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Query Tutor Personalities & Safeguard Check on Mount/Open
  useEffect(() => {
    async function loadPersonalities() {
      const { data } = await dbService.getTutorPersonalities();
      if (data && data.length > 0) {
        setPersonalities(data);
        
        const syncActiveTutor = () => {
          const storedId = localStorage.getItem('op_active_tutor_personality') || 'socratic';
          const active = data.find(p => p.id === storedId);
          if (active) {
            setPersona(active.id);
          } else {
            const defaultPers = data.find(p => p.isDefault) || data[0];
            if (defaultPers) {
              setPersona(defaultPers.id);
              localStorage.setItem('op_active_tutor_personality', defaultPers.id);
            }
          }
        };

        syncActiveTutor();
        window.addEventListener('op_active_tutor_changed', syncActiveTutor);
        window.addEventListener('storage', syncActiveTutor);
        return () => {
          window.removeEventListener('op_active_tutor_changed', syncActiveTutor);
          window.removeEventListener('storage', syncActiveTutor);
        };
      }
    }
    loadPersonalities();
  }, []);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: mode }));
    }
  };

   const hasGlossaryInProp = pageContext && (
    /<Glossary\s+term=/i.test(pageContext) ||
    /##+\s*[^\p{L}\p{N}\s]*\s*(Glossaire|Glossary|Lexique|Glosario|Glossar|词汇表)/iu.test(pageContext)
  );

  const QUICK_ACTIONS = [
    { label: t.give_example, icon: <Sparkles className="w-3 h-3" />, prompt: t.give_example_prompt },
    { label: t.tell_story, icon: <Bookmark className="w-3 h-3" />, prompt: t.tell_story_prompt },
    { label: t.simplify, icon: <Globe className="w-3 h-3" />, prompt: t.simplify_prompt },
    { label: t.test_me, icon: <CheckCircle className="w-3 h-3" />, prompt: t.test_me_prompt }
  ];

  const DASHBOARD_QUICK_ACTIONS = lang.toUpperCase() === 'FR' ? [
    { 
      label: "Discuter de mon cursus", 
      icon: <GraduationCap className="w-3 h-3" />, 
      prompt: "Bonjour ! Je souhaiterais discuter de mon cursus actuel, de ma progression et de la pertinence des modules choisis." 
    },
    { 
      label: "Planifier ma progression", 
      icon: <Sparkles className="w-3 h-3" />, 
      prompt: "Pourrais-tu m'aider à planifier la suite de mon apprentissage et me conseiller sur le prochain module à aborder ?" 
    }
  ] : [
    { 
      label: "Discuss my curriculum", 
      icon: <GraduationCap className="w-3 h-3" />, 
      prompt: "Hello! I would like to discuss my current curriculum, my progress, and the relevance of the chosen modules." 
    },
    { 
      label: "Plan my progression", 
      icon: <Sparkles className="w-3 h-3" />, 
      prompt: "Could you help me plan the next steps of my learning journey and advise me on which module to tackle next?" 
    }
  ];

  // Persist history based on course slug instead of specific page pathname
  const courseSlug = isDashboardMode ? 'curriculum_dashboard' : (isCurriculumPage ? segments[2] : 'global');

  const welcomeMessage = isDashboardMode
    ? (lang.toUpperCase() === 'FR'
      ? "Bonjour ! Je suis ravi de vous retrouver sur votre tableau de bord. Comment puis-je vous aider aujourd'hui à faire le point sur votre cursus, analyser votre progression ou planifier les prochaines étapes de votre apprentissage ?"
      : "Hello! I am delighted to welcome you back to your dashboard. How can I help you today to review your curriculum, analyze your progress, or plan the next steps of your learning journey?")
    : t.welcome;

  useEffect(() => {
    const key = `op_tutor_hist_${courseSlug}_${lang.toUpperCase()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
    }
  }, [courseSlug, lang, welcomeMessage]);

  useEffect(() => {
    if (messages.length > 1) {
      const key = `op_tutor_hist_${courseSlug}_${lang.toUpperCase()}`;
      localStorage.setItem(key, JSON.stringify(messages.slice(-10))); // Keep last 10
    }
  }, [messages, courseSlug, lang]);

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  const handleSend = async (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;

    // Stop previous stream if any
    stopGeneration();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('op_stop_course_speech'));
    }
    
    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    if (!text) setInput('');

    // Append an assistant slot that we will stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);
    setIsGenerating(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      let token: string | undefined;
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token;
      } catch (err) {
        console.warn("[TUTOR CHAT] Failed to retrieve client auth session token:", err);
      }

      let personalTutorParam = undefined;
      const savedProfile = localStorage.getItem('op_user_profile');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          if (p.tutorEnabled && p.tutorType === 'personal' && p.personalTutorApiKey) {
            personalTutorParam = {
              enabled: true,
              provider: p.personalTutorProvider || 'openai',
              apiKey: decryptApiKey(p.personalTutorApiKey),
              model: p.personalTutorModel || 'gpt-4o-mini'
            };
          }
        } catch (e) {}
      }

      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        signal: controller.signal,
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          messages: newMessages,
          persona,
          pageContext: pageContext || '',
          language: lang,
          srsMastery: cardMastery,
          courseLevel,
          courseTitle,
          courseSubject,
          selfEvalPre,
          selfEvalPost,
          personalTutor: personalTutorParam,
          readingProgress: readingProgress || undefined
        })
      });

      if (!response.ok) {
        let errorMsg = t.tutor_error || "The tutor is temporarily unavailable due to connection issues. Please try again.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }

      if (!response.body) {
        throw new Error("No response stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const dataStr = line.slice(5).trim();
              if (!dataStr) continue;
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                if (firstChunk) {
                  accumulatedText = parsed.text;
                  firstChunk = false;
                } else {
                  accumulatedText += parsed.text;
                }
                setMessages(prev => {
                  const updated = [...prev];
                  if (updated.length > 0) {
                    updated[updated.length - 1] = { role: 'assistant', content: accumulatedText };
                  }
                  return updated;
                });
              }
            } catch (err) {}
          }
        }
      }
      if (accumulatedText && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('op_read_tutor_response', { 
          detail: { 
            text: accumulatedText,
            isOpen: isOpen
          } 
        }));
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("Tutor stream aborted by user.");
        // Clean up last message if it's still three dots
        setMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0 && updated[updated.length - 1].content === '...') {
            updated[updated.length - 1] = { role: 'assistant', content: tls.stopped };
          }
          return updated;
        });
      } else {
        console.error("Streaming error", err);
        const friendlyMsg = tls.connErr;
        setMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = { 
              role: 'assistant', 
              content: friendlyMsg
            };
          }
          return updated;
        });
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Flashcards extraction from pageContext
  useEffect(() => {
    const cleanGlossaryDefinition = (def: string): string => {
      if (!def) return '';
      // 1. Clean HTML tags
      let cleaned = def.replace(/<[^>]+>/g, '');
      // 2. Clean Wikipedia links (both markdown links and plain brackets)
      cleaned = cleaned.replace(/\[?\[?(Wikip[eé]dia|Wikipedia)\]?\]?\((https?:\/\/[^\s)]+)\)\]?/gi, '');
      cleaned = cleaned.replace(/\[\s*(Wikip[eé]dia|Wikipedia)\s*\]/gi, '');
      cleaned = cleaned.replace(/\(\s*(Wikip[eé]dia|Wikipedia)\s*\)/gi, '');
      // 3. Clean up formatting artifacts like duplicate dots or spaces
      cleaned = cleaned.trim();
      cleaned = cleaned.replace(/\s+/g, ' ');
      cleaned = cleaned.replace(/\s+\.$/, '.');
      cleaned = cleaned.replace(/\.{2,}/g, '.');

      const colonIndex = cleaned.indexOf(':');
      if (colonIndex !== -1) {
        const part1 = cleaned.substring(0, colonIndex).trim();
        const part2 = cleaned.substring(colonIndex + 1).trim();
        if (part2.startsWith(part1)) {
          return part2;
        }
      }
      return cleaned;
    };

    if (pageContext) {
      const cards: { term: string; definition: string }[] = [];
      const seen = new Set<string>();

      const addCard = (term: string, definition: string) => {
        const cleanedTerm = term.trim().charAt(0).toUpperCase() + term.trim().slice(1);
        const cleanedDef = cleanGlossaryDefinition(definition).trim();
        const key = cleanedTerm.toLowerCase();
        if (cleanedTerm && cleanedDef && !seen.has(key)) {
          seen.add(key);
          cards.push({ term: cleanedTerm, definition: cleanedDef });
        }
      };

      // 1. Extract from JSX tags
      const regex = /<Glossary\s+term=["']([^"']+)["']\s+definition=["']([^"']+)["']/g;
      let match;
      while ((match = regex.exec(pageContext)) !== null) {
        const term = match[1];
        const definition = match[2];
        addCard(term, definition);
      }

      // 2. Extract from static markdown glossary section
      const glossaryIndex = pageContext.search(/##+\s*[^\p{L}\p{N}\s]*\s*(Glossaire|Glossary|Lexique|Glosario|Glossar|词汇表)/iu);
      if (glossaryIndex !== -1) {
        let glossarySection = pageContext.slice(glossaryIndex);
        const nextHeadingIndex = glossarySection.slice(1).search(/\r?\n\s*##+\s+/);
        if (nextHeadingIndex !== -1) {
          glossarySection = glossarySection.slice(0, nextHeadingIndex + 1);
        }
        const lines = glossarySection.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          const itemMatch = trimmed.match(/^[-*]\s+(?:\*+|_*)?([^*_:]+)(?:\*+|_*)?\s*:\s*([\s\S]*)$/);
          if (itemMatch) {
            const term = itemMatch[1];
            const definition = itemMatch[2];
            addCard(term, definition);
          }
        }
      }

      setFlashcards(cards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  }, [pageContext]);

  // Load spaced repetition card mastery state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('op_srs_mastery');
      if (saved) {
        try {
          setCardMastery(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  const handleRateCard = (rating: 'easy' | 'medium' | 'hard') => {
    if (flashcards.length === 0) return;
    const currentCard = flashcards[currentCardIndex];
    const updatedMastery = { ...cardMastery, [currentCard.term]: rating };
    setCardMastery(updatedMastery);
    localStorage.setItem('op_srs_mastery', JSON.stringify(updatedMastery));

    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 200);
  };

  // Listen for floating Feynman Selector triggers
  useEffect(() => {
    const handleFeynmanTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setIsOpen(true);
        setActiveTab('chat');
        setTimeout(() => {
          handleSend(customEvent.detail);
        }, 150);
      }
    };
    window.addEventListener('op_trigger_tutor_feynman', handleFeynmanTrigger);
    return () => {
      window.removeEventListener('op_trigger_tutor_feynman', handleFeynmanTrigger);
    };
  }, [messages, persona, lang]);

  // Listen for active cognitive bridge exercise completion
  useEffect(() => {
    const handleExerciseCompleted = (e: Event) => {
      const customEvent = e as CustomEvent;
      const detail = customEvent.detail;
      if (!detail) return;

      const isFR = lang.toUpperCase() === 'FR';
      const promptHeader = detail.success
        ? (isFR ? "[CONTEXTE : EXERCICE RÉUSSI]\nL'étudiant a répondu correctement à l'exercice suivant :\n" : "[CONTEXT: EXERCISE COMPLETED SUCCESS]\nThe student successfully answered the following exercise:\n")
        : (isFR ? "[CONTEXTE : EXERCICE EN ERREUR]\nL'étudiant s'est trompé sur l'exercice suivant :\n" : "[CONTEXT: EXERCISE COMPLETED INCORRECT]\nThe student made a mistake in the following exercise:\n");

      const questionLabel = isFR ? "Question/Contexte : " : "Question/Context: ";
      const selectedLabel = isFR ? "Leur réponse : " : "Their answer: ";
      const correctLabel = isFR ? "Bonne réponse : " : "Correct answer: ";
      const explLabel = isFR ? "Explication/Indication : " : "Explanation: ";
      
      const instructions = detail.success
        ? (isFR
            ? "\nFournis un commentaire très court (1-2 phrases) et engageant pour les féliciter, expliquer brièvement pourquoi ce concept est important, et maintenir leur élan."
            : "\nProvide a very brief (1-2 sentences), engaging comment to congratulate them, briefly explain why this concept is important, and keep their momentum going.")
        : (isFR
            ? "\nAgis en tuteur socratique et bienveillant. Fournis une explication très courte (2-3 phrases), encourageante et sans jugement pour les aider à comprendre leur erreur ou leur donner le bon déclic intuitif."
            : "\nAct as an encouraging, supportive, and socratic tutor. Provide a very brief (2-3 sentences) explanation to help them understand their mistake or give them the right intuitive click without being judgmental.");

      const prompt = `${promptHeader}${questionLabel}"${detail.question}"\n${selectedLabel}"${detail.selectedAnswer}"\n${correctLabel}"${detail.correctAnswer}"\n${detail.explanation ? `${explLabel}"${detail.explanation}"\n` : ''}${instructions}`;

      if (isOpen) {
        // If tutor panel is open, send immediately
        setActiveTab('chat');
        handleSend(prompt);
      } else {
        // If tutor panel is closed, trigger elegant glow for 8 seconds and store pending prompt
        setIsGlowing(true);
        setPendingPrompt(prompt);

        if (glowTimeoutRef.current) clearTimeout(glowTimeoutRef.current);
        glowTimeoutRef.current = setTimeout(() => {
          setIsGlowing(false);
        }, 8000);
      }
    };

    window.addEventListener('op_exercise_completed', handleExerciseCompleted);
    return () => {
      window.removeEventListener('op_exercise_completed', handleExerciseCompleted);
      if (glowTimeoutRef.current) clearTimeout(glowTimeoutRef.current);
    };
  }, [messages, persona, lang, isOpen]);

  // Keyboard navigation for Spaced Repetition flashcards
  useEffect(() => {
    if (!isOpen || activeTab !== 'flashcards' || flashcards.length === 0) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        }, 150);
      } else if (e.key === 'ArrowRight') {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
        }, 150);
      } else if (e.key === ' ' || e.key === 'Enter') {
        const activeEl = document.activeElement;
        if (activeEl?.tagName === 'BUTTON' || activeEl?.tagName === 'INPUT') return;
        
        setIsFlipped(prev => !prev);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeTab, flashcards.length]);

  const handleSelectTutor = async (id: string) => {
    localStorage.setItem('op_active_tutor_personality', id);
    setPersona(id);
    
    // Sync with database if connected
    const savedProfile = localStorage.getItem('op_user_profile');
    const loggedIn = localStorage.getItem('op_session') === 'true';
    let userId = 'u1';
    
    if (loggedIn && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (e) {}
    }

    if (loggedIn && savedProfile) {
      try {
        const { supabase } = await import('@/lib/supabase');
        if (userId && userId !== 'u1') {
          await supabase
            .from('profiles')
            .update({ tutor_choice: id })
            .eq('id', userId);
          console.log(`Tutor choice updated in Supabase from lessons: ${id}`);
        }
      } catch (e) {
        console.error("Error updating tutor choice in Supabase from lessons:", e);
      }
    }
    
    // Notify all components of the active tutor change
    window.dispatchEvent(new Event('op_active_tutor_changed'));

    // Refresh the page to load the new tutor personality completely
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  if (!isDashboardMode && (!isCurriculumPage || (!tutorEnabled && !hasGlossaryInProp))) return null;
  if (isDashboardMode && !tutorEnabled) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 font-sans text-slate-100">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-[400px] h-[600px] rounded-[40px] bg-slate-900/95 border border-slate-800/50 shadow-2xl backdrop-blur-3xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{t.tutor}</p>
                   <button
                     onClick={() => setShowTutorModal(true)}
                     title={t.change_tutor}
                     className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-blue-300 transition-colors cursor-pointer group"
                   >
                     <span>{getPersonaName(persona)}</span>
                   </button>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {isLoggedIn && tutorEnabled && !isDashboardMode && (
              <div className="flex border-b border-slate-800/50 bg-slate-950/40 text-[9px] font-black uppercase tracking-widest text-slate-500 shrink-0 select-none">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-3 text-center transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'chat' ? 'text-blue-400 border-blue-500 bg-blue-500/5' : 'border-transparent hover:text-slate-300'}`}
                >
                  <span>{t.tutor_tab}</span>
                </button>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex-1 py-3 text-center transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'flashcards' ? 'text-blue-400 border-blue-500 bg-blue-500/5' : 'border-transparent hover:text-slate-300'}`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>{t.flashcards_tab} ({flashcards.length})</span>
                </button>
              </div>
            )}

            {!isLoggedIn ? (
              <div className="flex-1 flex flex-col justify-center items-center p-8 text-center space-y-6 bg-slate-950/20">
                <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 animate-bounce">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black tracking-tight text-white">
                    {t.tutor_unlock_title_prefix}{getPersonaName(persona)}{t.tutor_unlock_title_suffix}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-[320px]">
                    {tls.unlockDesc}
                  </p>
                </div>
                <div className="w-full space-y-2.5 pt-4">
                  <button 
                    onClick={() => handleAuthClick('signup')}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black uppercase tracking-widest text-[9px] rounded-2xl transition-all shadow-xl shadow-blue-600/20 cursor-pointer"
                  >
                    {t.signup_free}
                  </button>
                  <button 
                    onClick={() => handleAuthClick('login')}
                    className="w-full py-3.5 bg-slate-800 border border-slate-750 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl transition-all hover:text-white hover:border-slate-700 cursor-pointer"
                  >
                    {t.connect}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Connection loss indicator or notices can go here if needed, keeping it empty for clean lightweight UI */}

                {activeTab === 'chat' ? (
                  <>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-slate-800/50 text-slate-300 rounded-tl-none w-full' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 rounded-tr-none'}`}>
                            {msg.role === 'assistant' ? (
                              <TutorMessageContent content={msg.content} />
                            ) : (
                              msg.content
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={`px-6 py-4 grid ${isDashboardMode ? 'grid-cols-1' : 'grid-cols-2'} gap-2 bg-slate-950/20 border-t border-slate-800/50`}>
                       {(isDashboardMode ? DASHBOARD_QUICK_ACTIONS : QUICK_ACTIONS).map(qa => (
                         <button key={qa.label} disabled={isGenerating} onClick={() => handleSend(qa.prompt)} className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed">
                           {qa.icon} {qa.label}
                         </button>
                       ))}
                    </div>

                    <div className="p-6 bg-slate-950/50 border-t border-slate-800/50">
                      <div className="relative flex items-end">
                        <textarea 
                          ref={textareaRef}
                          disabled={isGenerating} 
                          value={input} 
                          onChange={(e) => setInput(e.target.value)} 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          rows={1}
                          placeholder={t.placeholder} 
                          className="w-full bg-slate-800/40 border border-slate-775 rounded-2xl py-3.5 pl-6 pr-28 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed resize-none min-h-[48px] max-h-32 custom-scrollbar" 
                        />
                        
                        <div className="absolute right-16 bottom-3 flex items-center justify-center">
                          {isListening && (
                            <>
                              {/* Dynamic Pulsing Outer Rings responding to Voice Intensity */}
                              <motion.div 
                                className="absolute inset-0 rounded-xl bg-blue-500/30 z-0"
                                style={{
                                  scale: 1 + (micActivity / 128) * 0.6,
                                  opacity: 0.3 + (micActivity / 255) * 0.7,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                              />
                              <motion.div 
                                className="absolute inset-0 rounded-xl bg-indigo-500/20 z-0"
                                style={{
                                  scale: 1 + (micActivity / 128) * 0.3,
                                  opacity: 0.2 + (micActivity / 255) * 0.5,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.05 }}
                              />
                            </>
                          )}
                          <button 
                            type="button"
                            disabled={isGenerating} 
                            onClick={toggleListening} 
                            className={`relative p-2 rounded-xl border transition-all z-10 ${
                              isListening 
                                ? 'bg-blue-600 text-white border-transparent shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
                                : 'bg-slate-800/40 text-slate-400 border-slate-775 hover:bg-slate-800 hover:text-white hover:border-slate-700'
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                            title={isListening ? t.voice_stop : t.voice_enable}
                            aria-label="Active voice coaching input"
                          >
                            <Mic className={`w-4 h-4 ${isListening ? 'text-white' : ''}`} />
                          </button>
                        </div>

                        {isGenerating ? (
                          <button 
                            type="button"
                            onClick={stopGeneration} 
                            className="absolute right-4 bottom-3 p-2 bg-red-650 rounded-xl text-white hover:bg-red-650 transition-all cursor-pointer flex items-center justify-center border border-red-500/30"
                            title={tls.stopTitle}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                          </button>
                        ) : (
                          <button 
                            disabled={isGenerating} 
                            onClick={() => handleSend()} 
                            className="absolute right-4 bottom-3 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all disabled:bg-blue-600/30 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="mt-3 text-[9px] text-slate-500/80 leading-normal text-center font-medium max-w-full">
                        {AI_ACT_DISCLAIMERS[lang.toUpperCase() as keyof typeof AI_ACT_DISCLAIMERS] || AI_ACT_DISCLAIMERS.EN}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col justify-between p-6 bg-slate-950/20 overflow-y-auto">
                    <style>{`
                      .perspective-1000 {
                        perspective: 1000px;
                      }
                      .preserve-3d {
                        transform-style: preserve-3d;
                      }
                      .backface-hidden {
                        backface-visibility: hidden;
                      }
                      .rotateY-180 {
                        transform: rotateY(180deg);
                      }
                    `}</style>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest select-none">
                        <span>{t.spaced_repetition}</span>
                        <span>
                          {flashcards.length > 0 ? `${currentCardIndex + 1} / ${flashcards.length}` : '0 / 0'}
                        </span>
                      </div>

                      {flashcards.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 text-xs italic">
                          {t.no_flashcards}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 my-6 select-none">
                          {/* Previous card button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFlipped(false);
                              setTimeout(() => {
                                setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
                              }, 150);
                            }}
                            className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all hover:bg-slate-800 focus:outline-none cursor-pointer shrink-0"
                            aria-label={t.prev_card}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <div className="perspective-1000 flex-1">
                            <motion.div
                              animate={{ rotateY: isFlipped ? 180 : 0 }}
                              transition={{ duration: 0.4 }}
                              onClick={() => setIsFlipped(!isFlipped)}
                              className="w-full min-h-[220px] rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-xl relative preserve-3d"
                            >
                              {/* Card Front */}
                              <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest mb-3">
                                  {t.card_concept}
                                </span>
                                <h3 className="text-base font-extrabold text-white leading-tight">
                                  {flashcards[currentCardIndex]?.term}
                                </h3>
                                {cardMastery[flashcards[currentCardIndex]?.term] && (
                                  <span className={`mt-4 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                                    cardMastery[flashcards[currentCardIndex]?.term] === 'easy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    cardMastery[flashcards[currentCardIndex]?.term] === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                    'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                  }`}>
                                    {cardMastery[flashcards[currentCardIndex]?.term]}
                                  </span>
                                )}
                                <p className="text-[9px] text-slate-500 mt-6 italic font-bold tracking-wider uppercase select-none">
                                  {t.click_to_flip}
                                </p>
                              </div>

                              {/* Card Back */}
                              <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden transform rotateY-180 ${!isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest mb-3">
                                  {t.card_definition}
                                </span>
                                <div className="overflow-y-auto max-h-[140px] px-2 custom-scrollbar my-2 text-center w-full">
                                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                                    {flashcards[currentCardIndex]?.definition}
                                  </p>
                                </div>
                                <p className="text-[9px] text-slate-500 mt-4 italic font-bold tracking-wider uppercase select-none">
                                  {t.click_to_flip}
                                </p>
                              </div>
                            </motion.div>
                          </div>

                          {/* Next card button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFlipped(false);
                              setTimeout(() => {
                                setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
                              }, 150);
                            }}
                            className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all hover:bg-slate-800 focus:outline-none cursor-pointer shrink-0"
                            aria-label={t.next_card}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {flashcards.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-slate-800/40 shrink-0">
                        {isFlipped ? (
                          <div className="space-y-3">
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest text-center select-none">
                              {t.rate_mastery}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => handleRateCard('hard')}
                                className="py-2 bg-rose-950/20 border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                              >
                                🔴 {t.mastery_hard}
                              </button>
                              <button
                                onClick={() => handleRateCard('medium')}
                                className="py-2 bg-amber-950/20 border border-amber-500/30 hover:bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                              >
                                🟡 {t.mastery_medium}
                              </button>
                              <button
                                onClick={() => handleRateCard('easy')}
                                className="py-2 bg-emerald-950/20 border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                              >
                                🟢 {t.mastery_easy}
                              </button>
                            </div>
                          </div>
                        ) : null}



                        {!isFlipped && !isCoachingDismissed && (
                          <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-left relative overflow-hidden">
                            <button
                              onClick={() => {
                                setIsCoachingDismissed(true);
                                localStorage.setItem('op_dismiss_flashcard_coaching', 'true');
                              }}
                              className="absolute top-3 right-3 w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white flex items-center justify-center border border-slate-700 transition-all cursor-pointer z-10"
                              title={t.coaching_dismiss}
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest flex items-center gap-1.5 mb-1.5 pr-8 select-none">
                              <Sparkles className="w-3 h-3 animate-pulse" />
                              {t.coaching_title}
                            </p>
                            <p className="text-[10px] text-slate-300 leading-relaxed font-medium pr-8">
                              {t.coaching_desc}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TUTOR SELECTOR MODAL */}
      <AnimatePresence>
        {showTutorModal && (
          <div onClick={() => setShowTutorModal(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xl cursor-pointer">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] cursor-default"
            >
              <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <Brain className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">
                      {t.select_ai_tutor}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {t.tutor_modal_desc}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTutorModal(false)}
                  className="p-3 text-slate-500 hover:text-white rounded-2xl hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-slate-900/50">
                {personalities.map(tOption => {
                  const code = (lang || 'EN').toUpperCase();
                  const translationsAny = tOption.translations as any;
                  const localizedName = translationsAny?.[code]?.name || tOption.name;
                  const localizedDesc = translationsAny?.[code]?.desc ||
                    translationsAny?.[code]?.prompt?.slice(0, 120) + '...' ||
                    tOption.prompt?.slice(0, 120) + '...';
                  const isSelected = tOption.id === persona;
                  // Emoji fallback map
                  const EMOJI_MAP: Record<string, string> = {
                    socratic: '💬', direct: '⚡', gamified: '🚀', historical: '📚',
                    feynman: '💡', proof: '📐', engineer: '🔧', debater: '🗣️',
                    analogy_alchemist: '🧪', cognitive_catalyst: '🧠',
                    heuristic_explorer: '🔭', diamond_age: '💎',
                  };
                  const emoji = EMOJI_MAP[tOption.id] || '🤖';
                  return (
                    <div 
                      key={tOption.id}
                      onClick={() => handleSelectTutor(tOption.id)}
                      className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-6 group relative overflow-hidden ${
                        isSelected 
                          ? 'bg-blue-600/10 border-blue-500/60 shadow-lg shadow-blue-500/5' 
                          : 'bg-slate-950/30 border-slate-800 hover:border-slate-700 hover:bg-slate-950/50'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                          isSelected ? 'bg-blue-600/20 scale-105' : 'bg-slate-900 group-hover:scale-105'
                        }`}>
                          {emoji}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-white tracking-wide flex items-center gap-2">
                            {localizedName}
                            {isSelected && (
                              <span className="px-2.5 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-[8px] font-black uppercase tracking-wider">
                                {t.active}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed max-w-md">
                            {localizedDesc}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                          : 'border-slate-800 group-hover:border-slate-750 text-transparent group-hover:text-slate-655'
                      }`}>
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-8 border-t border-slate-800 bg-slate-950/40 text-center">
                <p className="text-xs text-slate-500 font-semibold italic">
                  {t.tutor_modal_footer}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && showCoachPopover && coachAdvice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="w-[320px] bg-slate-900/95 border border-blue-500/30 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden flex flex-col gap-3 mr-2 mb-2 select-none"
          >
            {/* Ambient background glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <button
              onClick={handleDismissCoachPopover}
              className="absolute top-4 right-4 p-1 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800/40 transition-all cursor-pointer"
              title={t.coaching_dismiss}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-lg">
                {((): string => {
                  const EMOJI_MAP: Record<string, string> = {
                    socratic: '💬', direct: '⚡', gamified: '🚀', historical: '📚',
                    feynman: '💡', proof: '📐', engineer: '🔧', debater: '🗣️',
                    analogy_alchemist: '🧪', cognitive_catalyst: '🧠',
                    heuristic_explorer: '🔭', diamond_age: '💎',
                  };
                  return EMOJI_MAP[persona] || '🤖';
                })()}
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">
                  {lang.toUpperCase() === 'FR' ? 'Conseil du Tuteur' :
                   lang.toUpperCase() === 'ES' ? 'Consejo del Tutor' :
                   lang.toUpperCase() === 'DE' ? 'Tutor-Rat' :
                   lang.toUpperCase() === 'ZH' ? '导师建议' : 'Tutor Advice'}
                </p>
                <h4 className="text-xs font-black text-white leading-none">
                  {getPersonaName(persona)}
                </h4>
              </div>
            </div>

            <p className="text-xs text-slate-350 leading-relaxed font-medium pr-6 mt-1">
              {coachAdvice}
            </p>

            <button
              onClick={handleOpenChatFromCoach}
              className="w-full mt-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              {lang.toUpperCase() === 'FR' ? 'Discuter avec le tuteur' :
               lang.toUpperCase() === 'ES' ? 'Hablar con el tutor' :
               lang.toUpperCase() === 'DE' ? 'Mit Tutor sprechen' :
               lang.toUpperCase() === 'ZH' ? '与导师交流' : 'Discuss with tutor'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={handleTutorToggle}
        className={`w-16 h-16 rounded-full text-white flex items-center justify-center relative border group cursor-pointer transition-all duration-300 ${
          isGlowing 
            ? "bg-gradient-to-r from-violet-650 to-blue-600 border-violet-400/40 animate-pulse shadow-[0_0_50px_rgba(139,92,246,0.85),_0_0_20px_rgba(37,99,235,0.6)]" 
            : "bg-blue-600 border-white/10 shadow-[0_0_40px_rgba(37,99,235,0.4)]"
        }`}
      >
        {tutorEnabled ? (
          <Sparkles className={`w-7 h-7 group-hover:rotate-12 transition-transform ${isGlowing ? 'animate-bounce text-violet-200' : ''}`} />
        ) : (
          <Brain className={`w-7 h-7 group-hover:rotate-12 transition-transform ${isGlowing ? 'animate-bounce text-violet-200' : ''}`} />
        )}
        {/* Glowing Indicator Dot */}
        {isGlowing && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-full border-2 border-slate-900 shadow-md flex items-center justify-center animate-bounce">
            <span className="absolute inset-0 rounded-full bg-violet-400 animate-ping opacity-75" />
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </span>
        )}
      </motion.button>
    </div>
  );
};
export { STATIC_ACADEMIC_LEVELS, formatCourseLevel, UI_STRINGS, getLocalizedLabel } from '@/lib/translations';


// Helper to detect current visible section and element for diagnostic feedback
const getProbableLocationOnPage = (): string => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return '';
  }
  
  try {
    const viewportHeight = window.innerHeight;
    const article = document.querySelector('article');
    
    // 1. Get the current active heading
    const headings = article
      ? Array.from(article.querySelectorAll('h1, h2, h3, h4'))
      : Array.from(document.querySelectorAll('h1, h2, h3, h4'));
      
    let activeHeading = '';
    if (headings.length > 0) {
      const candidates = headings.map(h => ({
        element: h,
        top: h.getBoundingClientRect().top,
        text: h.textContent?.trim() || ''
      }));
      // Filter headings that are above 60% of the viewport height (meaning user scrolled past it)
      const aboveThreshold = candidates.filter(c => c.top <= viewportHeight * 0.6);
      if (aboveThreshold.length > 0) {
        activeHeading = aboveThreshold[aboveThreshold.length - 1].text;
      } else {
        activeHeading = candidates[0].text;
      }
    }
    
    // 2. Find the child block inside <article> with the largest visible area in the viewport
    let visibleElementInfo = '';
    if (article) {
      const children = Array.from(article.children);
      let maxVisibleHeight = 0;
      let mostVisibleElement: Element | null = null;
      
      children.forEach(child => {
        const rect = child.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          mostVisibleElement = child;
        }
      });
      
      if (mostVisibleElement) {
        const el = mostVisibleElement as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        
        if (tagName.startsWith('h') && tagName.length === 2) {
          visibleElementInfo = `heading "${el.textContent?.trim()}"`;
        } else if (tagName === 'p') {
          const text = el.textContent?.trim() || '';
          const preview = text.length > 60 ? text.substring(0, 60) + '...' : text;
          visibleElementInfo = `paragraph ("${preview}")`;
        } else if (tagName === 'blockquote') {
          const text = el.textContent?.trim() || '';
          const preview = text.length > 40 ? text.substring(0, 40) + '...' : text;
          visibleElementInfo = `blockquote ("${preview}")`;
        } else if (tagName === 'pre') {
          visibleElementInfo = 'code block';
        } else if (tagName === 'table') {
          visibleElementInfo = 'table/chart';
        } else {
          // Check for specific interactive widgets / components
          const textContent = el.textContent?.trim() || '';
          let componentType = '';
          
          if (el.className.includes('quiz') || el.querySelector('.quiz-container')) {
            componentType = 'Quiz';
          } else if (el.querySelector('svg') && textContent.includes('Mermaid')) {
            componentType = 'Mermaid Diagram';
          } else if (el.className.includes('custom-alert') || el.querySelector('.custom-alert')) {
            componentType = 'Alert/Note';
          } else {
            // Find uppercase/widest span as a label indicator
            const spans = Array.from(el.querySelectorAll('span'));
            const labelSpan = spans.find(s => s.className.includes('tracking-widest') || s.className.includes('uppercase'));
            if (labelSpan) {
              componentType = labelSpan.textContent?.trim() || '';
            }
          }
          
          if (componentType) {
            visibleElementInfo = `interactive block: ${componentType}`;
          } else {
            const preview = textContent.length > 50 ? textContent.substring(0, 50) + '...' : textContent;
            visibleElementInfo = `section block ("${preview}")`;
          }
        }
      }
    }
    
    let parts = [];
    if (activeHeading) {
      parts.push(`Active Section: "${activeHeading}"`);
    }
    if (visibleElementInfo) {
      parts.push(`Most Visible Element: ${visibleElementInfo}`);
    }
    
    return parts.length > 0 ? `[Probable Location: ${parts.join(' | ')}]` : '';
  } catch (e) {
    console.warn("Failed to detect probable viewport location:", e);
    return '';
  }
};

