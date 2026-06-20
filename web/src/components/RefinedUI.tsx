"use client";

import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import { Mermaid } from './mdx/Mermaid';
import Link from 'next/link';
import { 
  Send, Sparkles, User, Bot, X, MessageSquare, AlertTriangle, Share2, 
  Bookmark, Menu, ChevronLeft, ChevronRight, CheckCircle, ChevronDown, LogOut, Trash2, Globe, Settings, ShieldAlert, GraduationCap, Brain, Loader2, Lock, Mic, MicOff, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpenPrimerIcon } from './OpenPrimerIcon';
import { EnrollmentModal } from './modals/EnrollmentModal';
import { SettingsModal } from './modals/SettingsModal';
import { useLanguage } from '@/context/LanguageContext';
import { dbService, TutorPersonality, isDatabaseConfigured, isSandboxFallbackAllowed } from '@/lib/db';

// --- INTERNATIONALIZATION DICTIONARY (UI ONLY) ---
import { STATIC_UI_STRINGS } from '@/lib/translations';

// Clear legacy local storage translation caches to prevent stale overrides
if (typeof window !== 'undefined') {
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith('openprimer_ui_strings_')) {
        window.localStorage.removeItem(key);
      }
    }
  } catch (e) {}
}

export const UI_STRINGS = new Proxy(STATIC_UI_STRINGS, {
  get(target, prop) {
    if (typeof prop === 'string') {
      const upper = prop.toUpperCase();
      if (upper in target) {
        return target[upper as keyof typeof target];
      }
    }
    return Reflect.get(target, prop);
  }
}) as any;


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
      try {
        const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
        tokens.push(<span key={matchIndex} dangerouslySetInnerHTML={{ __html: html }} />);
      } catch (e) {
        tokens.push(<code key={matchIndex} className="text-rose-400 font-mono text-xs">{matchedStr}</code>);
      }
    } else if (matchedStr.startsWith('$') && matchedStr.endsWith('$')) {
      const math = matchedStr.slice(1, -1);
      try {
        const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
        tokens.push(<span key={matchIndex} className="inline-block" dangerouslySetInnerHTML={{ __html: html }} />);
      } catch (e) {
        tokens.push(<code key={matchIndex} className="text-rose-400 font-mono text-xs">{matchedStr}</code>);
      }
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
      try {
        const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
        blocks.push(
          <div key={`mathblk-${i}`} className="my-4 overflow-x-auto py-2 px-4 bg-slate-950/30 rounded-2xl border border-slate-800/20" dangerouslySetInnerHTML={{ __html: html }} />
        );
      } catch (e) {
        blocks.push(
          <pre key={`mathblk-err-${i}`} className="text-rose-400 text-xs font-mono p-2 bg-slate-950 rounded-xl my-2">
            {math}
          </pre>
        );
      }
      continue;
    }
    
    // Inline block math on its own line
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      const math = trimmed.slice(2, -2);
      try {
        const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
        blocks.push(
          <div key={`mathblk-single-${i}`} className="my-4 overflow-x-auto py-2 px-4 bg-slate-950/30 rounded-2xl border border-slate-800/20" dangerouslySetInnerHTML={{ __html: html }} />
        );
      } catch (e) {
        blocks.push(
          <pre key={`mathblk-single-err-${i}`} className="text-rose-400 text-xs font-mono p-2 bg-slate-950 rounded-xl my-2">
            {math}
          </pre>
        );
      }
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

interface AITutorOverlayProps {
  lang?: string;
  pageContext?: string;
  courseLevel?: string;
  courseTitle?: string;
  courseSubject?: string;
}

// --- COMPONENT: AI TUTOR OVERLAY ---
export const AITutorOverlay = ({ 
  lang: propLang, 
  pageContext,
  courseLevel,
  courseTitle,
  courseSubject
}: AITutorOverlayProps = {}) => {
  const { language: contextLang } = useLanguage();
  const lang = propLang || contextLang;
  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [isOpen, setIsOpen] = useState(false);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: t.welcome }]);
  const [input, setInput] = useState('');
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

  const [selfEvalPre, setSelfEvalPre] = useState<number | null>(null);
  const [selfEvalPost, setSelfEvalPost] = useState<number | null>(null);
  const [coachAdvice, setCoachAdvice] = useState<string>('');
  const [showCoachPopover, setShowCoachPopover] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchAdvice() {
      if (!isCurriculumPage) return;
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
        const { data: progressData } = await dbService.getUserProgress(userId, lang);
        if (progressData && progressData.aiSummary && active) {
          setCoachAdvice(progressData.aiSummary);
          
          const dismissed = sessionStorage.getItem('op_dismiss_resumption_coach_advice');
          if (!dismissed) {
            const timer = setTimeout(() => {
              setShowCoachPopover(true);
            }, 1500);
            return () => clearTimeout(timer);
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
  }, [lang, isCurriculumPage]);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = lang.toLowerCase() === 'fr' ? 'fr-FR' : 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(prev => prev ? prev + " " + transcript : transcript);
          }
        };

        rec.onerror = (e: any) => {
          console.error("Speech Recognition error:", e);
          setIsListening(false);
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
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const getPersonaName = (pId: string) => {
    const selected = personalities.find(p => p.id === pId || p.name === pId);
    if (selected) {
      if (selected.translations?.[lang.toUpperCase()]?.name) {
        return selected.translations[lang.toUpperCase()].name;
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

  const hasGlossaryInProp = pageContext && /<Glossary\s+term=/i.test(pageContext);

  const QUICK_ACTIONS = [
    { label: t.give_example, icon: <Sparkles className="w-3 h-3" />, prompt: t.give_example_prompt },
    { label: t.tell_story, icon: <Bookmark className="w-3 h-3" />, prompt: t.tell_story_prompt },
    { label: t.simplify, icon: <Globe className="w-3 h-3" />, prompt: t.simplify_prompt },
    { label: t.test_me, icon: <CheckCircle className="w-3 h-3" />, prompt: t.test_me_prompt }
  ];

  // Persist history based on course slug instead of specific page pathname
  const courseSlug = isCurriculumPage ? segments[2] : 'global';

  useEffect(() => {
    const key = `op_tutor_hist_${courseSlug}_${lang.toUpperCase()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'assistant', content: t.welcome }]);
    }
  }, [courseSlug, lang, t.welcome]);

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
              apiKey: p.personalTutorApiKey,
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
          personalTutor: personalTutorParam
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
            updated[updated.length - 1] = { role: 'assistant', content: lang === 'FR' ? "Génération interrompue." : "Generation stopped." };
          }
          return updated;
        });
      } else {
        console.error("Streaming error", err);
        const friendlyMsg = lang === 'FR' 
          ? "Désolé, je rencontre des difficultés pour me connecter. Veuillez vérifier votre connexion et réessayer." 
          : "Sorry, I'm having trouble connecting. Please check your connection and try again.";
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
    if (pageContext) {
      const cards: { term: string; definition: string }[] = [];
      const regex = /<Glossary\s+term=["']([^"']+)["']\s+definition=["']([^"']+)["']/g;
      let match;
      const seen = new Set<string>();
      while ((match = regex.exec(pageContext)) !== null) {
        const term = match[1];
        const definition = match[2];
        const key = `${term}::${definition}`;
        if (!seen.has(key)) {
          seen.add(key);
          cards.push({ term, definition });
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

  if (!isCurriculumPage || (!tutorEnabled && !hasGlossaryInProp)) return null;

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
                     title={lang === 'FR' ? 'Changer de tuteur' : 'Change tutor'}
                     className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-blue-300 transition-colors cursor-pointer group"
                   >
                     <span>{getPersonaName(persona)}</span>
                   </button>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {isLoggedIn && tutorEnabled && (
              <div className="flex border-b border-slate-800/50 bg-slate-950/40 text-[9px] font-black uppercase tracking-widest text-slate-500 shrink-0 select-none">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-3 text-center transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'chat' ? 'text-blue-400 border-blue-500 bg-blue-500/5' : 'border-transparent hover:text-slate-300'}`}
                >
                  <span>{lang === 'FR' ? 'Tuteur' : 'Tutor'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex-1 py-3 text-center transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'flashcards' ? 'text-blue-400 border-blue-500 bg-blue-500/5' : 'border-transparent hover:text-slate-300'}`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Flashcards ({flashcards.length})</span>
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
                    {lang === 'FR' 
                      ? "Un compte gratuit est disponible pour vous permettre de suivre l'intégralité du cursus, enregistrer durablement votre progression et bénéficier des fonctionnalités d'un tuteur IA personnel d'exception !" 
                      : "A free account is available to let you follow the full curriculum, save your progress permanently, and benefit from the features of an exceptional personal AI tutor!"}
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

                    <div className="px-6 py-4 grid grid-cols-2 gap-2 bg-slate-950/20 border-t border-slate-800/50">
                       {QUICK_ACTIONS.map(qa => (
                         <button key={qa.label} disabled={isGenerating} onClick={() => handleSend(qa.prompt)} className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed">
                           {qa.icon} {qa.label}
                         </button>
                       ))}
                    </div>

                    <div className="p-6 bg-slate-950/50 border-t border-slate-800/50">
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          disabled={isGenerating} 
                          value={input} 
                          onChange={(e) => setInput(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                          placeholder={t.placeholder} 
                          className="w-full bg-slate-800/40 border border-slate-775 rounded-2xl py-4 pl-6 pr-28 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed" 
                        />
                        
                        <button 
                          type="button"
                          disabled={isGenerating} 
                          onClick={toggleListening} 
                          className={`absolute right-16 top-3 p-2 rounded-xl border transition-all ${
                            isListening 
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.3)] animate-pulse' 
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                          title={isListening ? t.voice_stop : t.voice_enable}
                          aria-label="Active voice coaching input"
                        >
                          <Mic className="w-4 h-4" />
                        </button>

                        {isGenerating ? (
                          <button 
                            type="button"
                            onClick={stopGeneration} 
                            className="absolute right-4 top-3 p-2 bg-red-650 rounded-xl text-white hover:bg-red-650 transition-all cursor-pointer flex items-center justify-center border border-red-500/30"
                            title={lang === 'FR' ? "Arrêter la réflexion" : "Stop response"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                          </button>
                        ) : (
                          <button 
                            disabled={isGenerating} 
                            onClick={() => handleSend()} 
                            className="absolute right-4 top-3 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all disabled:bg-blue-600/30 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
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
                        <span>{lang === 'FR' ? 'Répétition Espacée' : 'Spaced Repetition'}</span>
                        <span>
                          {flashcards.length > 0 ? `${currentCardIndex + 1} / ${flashcards.length}` : '0 / 0'}
                        </span>
                      </div>

                      {flashcards.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 text-xs italic">
                          {lang === 'FR' 
                            ? 'Aucun terme de glossaire disponible dans cette leçon pour générer des flashcards.' 
                            : 'No glossary terms available in this lesson to generate flashcards.'}
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
                            className="p-3 bg-slate-900 border border-slate-850 text-slate-400 hover:text-white rounded-2xl transition-all hover:bg-slate-800 focus:outline-none cursor-pointer shrink-0"
                            aria-label={lang === 'FR' ? 'Carte précédente' : 'Previous card'}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <div className="perspective-1000 flex-1">
                            <motion.div
                              animate={{ rotateY: isFlipped ? 180 : 0 }}
                              transition={{ duration: 0.4 }}
                              onClick={() => setIsFlipped(!isFlipped)}
                              className="w-full min-h-[220px] rounded-3xl bg-slate-900 border border-slate-850 p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-xl relative preserve-3d"
                            >
                              {/* Card Front */}
                              <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest mb-3">
                                  {lang === 'FR' ? 'CONCEPT' : 'TERM'}
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
                                  {lang === 'FR' ? 'Cliquez pour retourner' : 'Click to flip'}
                                </p>
                              </div>

                              {/* Card Back */}
                              <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden transform rotateY-180 ${!isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest mb-3">
                                  {lang === 'FR' ? 'DÉFINITION' : 'DEFINITION'}
                                </span>
                                <div className="overflow-y-auto max-h-[140px] px-2 custom-scrollbar my-2 text-center w-full">
                                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                                    {flashcards[currentCardIndex]?.definition}
                                  </p>
                                </div>
                                <p className="text-[9px] text-slate-500 mt-4 italic font-bold tracking-wider uppercase select-none">
                                  {lang === 'FR' ? 'Cliquez pour retourner' : 'Click to flip'}
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
                            className="p-3 bg-slate-900 border border-slate-850 text-slate-400 hover:text-white rounded-2xl transition-all hover:bg-slate-800 focus:outline-none cursor-pointer shrink-0"
                            aria-label={lang === 'FR' ? 'Carte suivante' : 'Next card'}
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
                              {lang === 'FR' ? 'Évaluez votre maîtrise :' : 'Rate your mastery:'}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => handleRateCard('hard')}
                                className="py-2 bg-rose-950/20 border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                              >
                                🔴 {lang === 'FR' ? 'Difficile' : 'Hard'}
                              </button>
                              <button
                                onClick={() => handleRateCard('medium')}
                                className="py-2 bg-amber-950/20 border border-amber-500/30 hover:bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                              >
                                🟡 {lang === 'FR' ? 'Moyen' : 'Medium'}
                              </button>
                              <button
                                onClick={() => handleRateCard('easy')}
                                className="py-2 bg-emerald-950/20 border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                              >
                                🟢 {lang === 'FR' ? 'Facile' : 'Easy'}
                              </button>
                            </div>
                          </div>
                        ) : null}

                        <button
                          onClick={() => {
                            setIsFlipped(false);
                            setTimeout(() => {
                              setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
                            }, 200);
                          }}
                          className="w-full py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700/80 hover:text-white text-slate-300 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          ➡️ {lang === 'FR' ? 'Passer à la suivante' : 'Skip / Next Card'}
                        </button>

                        {!isFlipped && !isCoachingDismissed && (
                          <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-left relative overflow-hidden">
                            <button
                              onClick={() => {
                                setIsCoachingDismissed(true);
                                localStorage.setItem('op_dismiss_flashcard_coaching', 'true');
                              }}
                              className="absolute top-3 right-3 w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white flex items-center justify-center border border-slate-700 transition-all cursor-pointer z-10"
                              title={lang === 'FR' ? 'Masquer' : 'Dismiss'}
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest flex items-center gap-1.5 mb-1.5 pr-8 select-none">
                              <Sparkles className="w-3 h-3 animate-pulse" />
                              {lang === 'FR' ? 'Coaching Personnalisé IA & Sauvegarde Réelle' : 'AI Personalized Coaching & Real-time Sync'}
                            </p>
                            <p className="text-[10px] text-slate-300 leading-relaxed font-medium pr-8">
                              {lang === 'FR' 
                                ? "Chaque évaluation entraînant directement l'IA du Tuteur à personnaliser ses explications et questions d'après vos forces et faiblesses. Votre progression est sauvegardée en temps réel, vous pouvez basculer d'onglet ou faire une pause en toute sérénité !"
                                : "Each rating trains your AI Tutor to personalize its coaching based on your strengths and weaknesses. Your progress syncs in real-time, allowing you to switch tabs or pause seamlessly!"}
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
                  className="p-3 text-slate-500 hover:text-white rounded-2xl hover:bg-slate-850 transition-all cursor-pointer"
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
                          : 'bg-slate-950/30 border-slate-850 hover:border-slate-700 hover:bg-slate-950/50'
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
                          : 'border-slate-850 group-hover:border-slate-750 text-transparent group-hover:text-slate-655'
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
              title={lang.toUpperCase() === 'FR' ? 'Masquer' : 'Dismiss'}
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center relative border border-white/10 group cursor-pointer"
      >
        {tutorEnabled ? (
          <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        ) : (
          <Brain className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        )}
      </motion.button>
    </div>
  );
};
export { STATIC_ACADEMIC_LEVELS, formatCourseLevel } from '@/lib/translations';


export const getLocalizedLabel = (key: string, lang: string) => {
  const l = lang.toUpperCase();
  const labels: Record<string, Record<string, string>> = {
    mastery_weight: {
      EN: "Mastery Weight",
      FR: "Poids de maîtrise",
      ES: "Peso de maestría",
      DE: "Meisterungsgewicht",
      ZH: "掌握权重"
    },
    duration: {
      EN: "Duration",
      FR: "Durée",
      ES: "Duración",
      DE: "Dauer",
      ZH: "时长"
    },
    level: {
      EN: "Level",
      FR: "Niveau",
      ES: "Nivel",
      DE: "Stufe",
      ZH: "级别"
    },
    credits: {
      EN: "credits",
      FR: "crédits",
      ES: "créditos",
      DE: "Credits",
      ZH: "学分"
    },
    hours_unit: {
      EN: "hrs",
      FR: "h",
      ES: "hrs",
      DE: "Std.",
      ZH: "小时"
    },
    why_create_account: {
      EN: "Why create an account?",
      FR: "Pourquoi créer un compte ?",
      ES: "¿Por qué créer una cuenta?",
      DE: "Warum ein Konto erstellen?",
      ZH: "为什么要创建账户？"
    },
    account_benefits: {
      EN: "A free account allows you to save your progress permanently, accumulate your study credits, unlock certifications, and interact with your personal AI Tutor.",
      FR: "Un compte gratuit vous permet de sauvegarder durablement votre progression, d'accumuler vos crédits de formation, d'obtenir vos certifications, et d'activer le Tuteur IA personnel pour lever vos doutes.",
      ES: "Una cuenta gratuita le permite guardar su progreso permanentemente, acumular sus créditos de estudio, desbloquear certificaciones e interactuar con su tutor de IA personal.",
      DE: "Mit einem kostenlosen Konto können Sie Ihren Fortschritt dauerhaft speichern, Ihre Studienleistungen sammeln, Zertifikate freischalten und mit Ihrem persönlichen KI-Tutor interagieren.",
      ZH: "免费账户可以永久保存您的进度、累积您的学习学分、解锁认证并与您的个人 AI 导师互动。"
    },
    create_account: {
      EN: "Create an Account",
      FR: "Créer un Compte",
      ES: "Crear una Cuenta",
      DE: "Konto Erstellen",
      ZH: "创建账户"
    },
    log_in: {
      EN: "Log In",
      FR: "Se Connecter",
      ES: "Iniciar Sesión",
      DE: "Einloggen",
      ZH: "登录"
    },
    start_limited: {
      EN: "Start learning with limited features",
      FR: "Démarrer avec des fonctions limitées",
      ES: "Comenzar a aprender con functions limitadas",
      DE: "Mit eingeschränkten Funktionen lernen",
      ZH: "以有限的功能开始学习"
    },
    completed_modules: {
      EN: "Curriculum and Completed Courses",
      FR: "Cursus et modules complétés",
      ES: "Currículo y cursos completados",
      DE: "Lehrplan und abgeschlossene Kurse",
      ZH: "课程与已完成模块"
    }
  };
  return labels[key]?.[l] || labels[key]?.EN || '';
};

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

// --- COMPONENT: TOP NAVIGATION ---
export const TopNav = ({ toggleSidebar, isCoursePage = false, showReadingModeSelector = false, onLangChange }: { toggleSidebar?: () => void, isCoursePage?: boolean, showReadingModeSelector?: boolean, onLangChange?: (lang: string) => void }) => {
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCourseData, setActiveCourseData] = useState<any | null>(null);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<any | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('settings') === 'true') {
        setIsSettingsOpen(true);
        const url = new URL(window.location.href);
        url.searchParams.delete('settings');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

  useEffect(() => {
    const loadEnrollments = async () => {
      const isSandbox = isDatabaseConfigured ? isSandboxFallbackAllowed() : true;
      if (!isDatabaseConfigured || isSandbox) {
        const saved = localStorage.getItem('op_enrolled_courses');
        if (saved) {
          try {
            setEnrolledIds(JSON.parse(saved));
          } catch (e) {}
        }
      } else {
        const savedProfile = localStorage.getItem('op_user_profile');
        if (savedProfile) {
          try {
            const p = JSON.parse(savedProfile);
            if (p.id) {
              const { data: progressData } = await dbService.getUserProgress(p.id);
              if (progressData && progressData.activeModules) {
                setEnrolledIds(progressData.activeModules.map((m: any) => m.id));
              }
            }
          } catch (e) {}
        }
      }
    };

    loadEnrollments();

    dbService.getAllCourses().then(({ data }) => {
      if (data) {
        setCourses(data);
        if (typeof window !== 'undefined' && isCoursePage) {
          const parts = window.location.pathname.split('/').filter(Boolean);
          const slug = parts[2];
          if (slug) {
            const matched = data.find((c: any) => c.slug === slug || c.slug?.toLowerCase() === slug.toLowerCase());
            if (matched) {
              setActiveCourseData(matched);
            }
          }
        }
      }
    });
  }, [isCoursePage]);

  useEffect(() => {
    const handleTriggerCourseSheet = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setSelectedEnrollCourse(customEvent.detail);
      }
    };
    window.addEventListener('op_trigger_course_sheet', handleTriggerCourseSheet);
    return () => {
      window.removeEventListener('op_trigger_course_sheet', handleTriggerCourseSheet);
    };
  }, []);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<'lang' | 'user' | null>(null);
  const [userProfile, setUserProfile] = useState<{ email: string; firstName: string; lastName: string; role?: string; } | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportComment, setReportComment] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [readingMode, setReadingMode] = useState('dark');
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  // Static flag map for well-known language codes
  const LANG_FLAG_MAP: Record<string, { flag: string; label: string }> = {
    EN: { flag: '🇺🇸', label: 'English' },
    FR: { flag: '🇫🇷', label: 'Français' },
    ES: { flag: '🇪🇸', label: 'Español' },
    DE: { flag: '🇩🇪', label: 'Deutsch' },
    ZH: { flag: '🇨🇳', label: '中文' },
    PT: { flag: '🇧🇷', label: 'Português' },
    AR: { flag: '🇸🇦', label: 'العربية' },
    JA: { flag: '🇯🇵', label: '日本語' },
    KO: { flag: '🇰🇷', label: '한국어' },
    RU: { flag: '🇷🇺', label: 'Русский' },
  };

  const FALLBACK_LANGUAGES = [
    { code: 'EN', flag: '🇺🇸', label: 'English' },
    { code: 'FR', flag: '🇫🇷', label: 'Français' },
    { code: 'ES', flag: '🇪🇸', label: 'Español' },
    { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'ZH', flag: '🇨🇳', label: '中文' }
  ];

  const [languages, setLanguages] = useState(FALLBACK_LANGUAGES);
  
  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const handleAuthClick = (mode: 'login' | 'signup') => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: mode }));
      } else {
        sessionStorage.setItem('op_auth_redirect', window.location.pathname + window.location.search);
        window.location.href = `/?auth=${mode}`;
      }
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session === 'true');
    const profile = localStorage.getItem('op_user_profile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }

    // Load initial reading mode theme
    const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
    setReadingMode(savedMode);

    const handleGlobalModeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setReadingMode(customEvent.detail);
    };
    window.addEventListener('op_reading_mode_changed', handleGlobalModeChange);

    const handleGlobalTriggerAuth = (e: Event) => {
      const customEvent = e as CustomEvent;
      const mode = customEvent.detail || 'signup';
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/') {
          return;
        }
        sessionStorage.setItem('op_auth_redirect', window.location.pathname + window.location.search);
        window.location.href = `/?auth=${mode}`;
      }
    };
    window.addEventListener('op_trigger_auth_state', handleGlobalTriggerAuth);

    const handleAuthStateChange = () => {
      const session = localStorage.getItem('op_session');
      setIsLoggedIn(session === 'true');
      const profile = localStorage.getItem('op_user_profile');
      if (profile) {
        setUserProfile(JSON.parse(profile));
      } else {
        setUserProfile(null);
      }
    };
    window.addEventListener('op_auth_state_change', handleAuthStateChange);
    window.addEventListener('op_auth_state_changed', handleAuthStateChange);
    window.addEventListener('op_accessibility_preferences_changed', handleAuthStateChange);

    const fetchLanguages = () => {
      dbService.getAvailableLanguages().then(({ data }) => {
        if (data && data.length > 0) {
          setLanguages(data.map((l: any) => ({
            code: l.code.toUpperCase(),
            flag: LANG_FLAG_MAP[l.code.toUpperCase()]?.flag || l.flag || '🌐',
            label: LANG_FLAG_MAP[l.code.toUpperCase()]?.label || l.label || l.name || l.code.toUpperCase(),
          })));
        }
      }).catch(() => { /* keep fallback */ });
    };

    fetchLanguages();
    window.addEventListener('op_languages_changed', fetchLanguages);

    const handleTriggerSettings = () => {
      setIsSettingsOpen(true);
    };
    window.addEventListener('op_trigger_settings', handleTriggerSettings);

    return () => {
      window.removeEventListener('op_reading_mode_changed', handleGlobalModeChange);
      window.removeEventListener('op_trigger_auth_state', handleGlobalTriggerAuth);
      window.removeEventListener('op_auth_state_change', handleAuthStateChange);
      window.removeEventListener('op_auth_state_changed', handleAuthStateChange);
      window.removeEventListener('op_accessibility_preferences_changed', handleAuthStateChange);
      window.removeEventListener('op_languages_changed', fetchLanguages);
      window.removeEventListener('op_trigger_settings', handleTriggerSettings);
    };
  }, []);

  const handleThemeSelect = (modeKey: string) => {
    setReadingMode(modeKey);
    localStorage.setItem('op_reading_mode', modeKey);
    
    // Update op_user_profile inside localStorage
    const profileStr = localStorage.getItem('op_user_profile');
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        profile.preferredTheme = modeKey;
        localStorage.setItem('op_user_profile', JSON.stringify(profile));
      } catch (e) {}
    }
    
    // Call dynamic page setting if defined
    if ((window as any).setReadingMode) {
      (window as any).setReadingMode(modeKey);
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('op_reading_mode_changed', { detail: modeKey }));
  };

  const handleLanguageSelect = async (code: string) => {
    setLang(code as any);
    localStorage.setItem('openprimer_lang', code);
    document.cookie = `openprimer_lang=${code}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Update op_user_profile preferredLang inside localStorage
    const profileStr = localStorage.getItem('op_user_profile');
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        profile.preferredLang = code.toLowerCase();
        localStorage.setItem('op_user_profile', JSON.stringify(profile));
      } catch (e) {}
    }
    
    if (onLangChange) onLangChange(code);

    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const parts = pathname.split('/').filter(Boolean);
      const isCoursePath = parts.includes('L1') || parts.includes('L2') || parts.includes('L3') || parts.includes('M1') || parts.includes('M2');

      if (isCoursePath) {
        const langLower = code.toLowerCase();
        try {
          // Check if this course page is available in the target language
          const res = await fetch(`/api/content?slug=${parts.join(',')}&lang=${langLower}`);
          if (res.ok) {
            window.location.reload();
            return;
          }
        } catch (e) {
          console.error("Error verifying language availability:", e);
        }

        // If translation is missing:
        const session = localStorage.getItem('op_session');
        const loggedIn = session === 'true';

        if (loggedIn) {
          // Redirect to curriculum page
          window.location.href = '/profile/curriculum';
        } else {
          // Redirect to catalog page
          window.location.href = '/catalog';
        }
        return;
      }
    }
    
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleLogout = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.auth.signOut();
    } catch (e) {
      console.error("SignOut error:", e);
    }
    localStorage.removeItem('op_session');
    localStorage.removeItem('op_user_profile');
    setIsLoggedIn(false);
    triggerToast(t.signout);
    
    if (typeof window !== 'undefined') {
      const privilegedPaths = ['/profile', '/admin'];
      const isPrivileged = privilegedPaths.some(p => window.location.pathname.startsWith(p));
      if (isPrivileged) {
        window.location.href = '/';
      } else {
        window.location.reload();
      }
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast(t.copy);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-900 z-[1000] px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {isCoursePage && toggleSidebar && (
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 transition-all mr-2"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/" className="flex items-center gap-3 group">
          <OpenPrimerIcon className="w-9 h-9" />
          <span className="font-sans font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
        </Link>
        <Link href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-colors ml-4 hidden md:block">
           {t.catalog}
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <div className="relative" onMouseEnter={() => setActiveDropdown('lang')} onMouseLeave={() => setActiveDropdown(null)}>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
            <span className="text-lg">{languages.find(l => l.code.toUpperCase() === lang.toUpperCase())?.flag}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {languages.find(l => l.code.toUpperCase() === lang.toUpperCase())?.label || lang.toUpperCase()}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform ${activeDropdown === 'lang' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {activeDropdown === 'lang' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden p-1">
                 {languages.map(l => (
                   <button key={l.code} onClick={() => handleLanguageSelect(l.code)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${lang.toUpperCase() === l.code.toUpperCase() ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
                     <span>{l.flag} {l.label}</span>
                     {lang.toUpperCase() === l.code.toUpperCase() && <CheckCircle className="w-3 h-3" />}
                   </button>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl mr-2">
          {['Default', 'Paper', 'Focus'].map(mode => {
            const modeKey = mode === 'Default' ? 'dark' : mode.toLowerCase();
            const active = readingMode === modeKey || (modeKey === 'dark' && readingMode === 'default');
            const modeLabel = mode === 'Default' ? t.mode_default : mode === 'Paper' ? t.mode_paper : t.mode_focus;
            return (
              <button 
                key={mode}
                onClick={() => handleThemeSelect(modeKey)}
                className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
              >
                {modeLabel}
              </button>
            );
          })}
        </div>



        {isCoursePage && isLoggedIn && (
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="report-bug-btn p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-all flex items-center gap-2 group"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-widest hidden md:block">{t.report}</span>
          </button>
        )}

        <button onClick={shareLink} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all">
          <Share2 className="w-4 h-4" />
        </button>


        <div className="w-px h-6 bg-slate-800 mx-2" />
        
        {isLoggedIn ? (
          <div className="relative" onMouseEnter={() => setActiveDropdown('user')} onMouseLeave={() => setActiveDropdown(null)}>
            <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all overflow-hidden group">
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <AnimatePresence>
              {activeDropdown === 'user' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-[110] overflow-hidden p-2">
                   <div className="px-4 py-4 border-b border-slate-800/50 mb-1">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1 italic">{t.logged_in_as}</p>
                     <p className="text-xs font-bold text-white truncate">
                        {(() => {
                           if (!userProfile) return lang.toUpperCase() === 'FR' ? 'Non renseigné' : 'Not provided';
                           const profile = userProfile as any;
                           if (profile.name && typeof profile.name === 'string' && profile.name.trim()) {
                             return profile.name.trim();
                           }
                           const parts = [];
                           if (profile.firstName && typeof profile.firstName === 'string' && profile.firstName.trim()) {
                             parts.push(profile.firstName.trim());
                           }
                           if (profile.lastName && typeof profile.lastName === 'string' && profile.lastName.trim()) {
                             parts.push(profile.lastName.trim());
                           }
                           if (parts.length > 0) {
                             return parts.join(' ').trim();
                           }
                           return lang.toUpperCase() === 'FR' ? 'Non renseigné' : 'Not provided';
                         })()}
                     </p>
                     <p className="text-[10px] text-slate-500 truncate">
                       {userProfile ? userProfile.email : 'silvere@openprimer.org'}
                     </p>
                   </div>
                     <Link href="/profile/curriculum" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                      <GraduationCap className="w-4 h-4" /> {t.my_curriculum}
                    </Link>
                    
                    <Link href="/catalog" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                      <Brain className="w-4 h-4" /> {t.catalog}
                    </Link>
                    
                    <button 
                      onClick={() => {
                        setIsSettingsOpen(true);
                        setActiveDropdown(null);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-left ${
                        userProfile?.role === 'admin'
                          ? 'border-b border-slate-800/50' 
                          : ''
                      }`}
                    >
                      <Settings className="w-4 h-4" /> {t.settings}
                    </button>

                    {userProfile?.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        <ShieldAlert className="w-4 h-4" /> {t.admin}
                      </Link>
                    )}
                    
                    <div className="h-0.5 bg-slate-800/50 my-1" />
                    
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                      <LogOut className="w-4 h-4" /> {t.signout}
                    </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleAuthClick('login')} 
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              {t.login}
            </button>
            <button 
              onClick={() => handleAuthClick('signup')} 
              className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 transition-all cursor-pointer"
            >
              {t.signup || 'Sign In'}
            </button>
          </div>
        )}
      </div>
    </nav>

    <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 shadow-2xl flex items-center gap-3 z-[60]">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-100">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReportModalOpen && (
          <div 
            onClick={() => { setIsReportModalOpen(false); setReportComment(''); }}
            className="fixed inset-0 z-[11000] overflow-y-auto bg-slate-950/40 backdrop-blur-xl flex items-start justify-center p-4 md:p-8 cursor-pointer"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="w-full max-w-lg bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden cursor-default my-auto"
            >
              <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-500" /> {t.report_issue}
                </h3>
                <button 
                  onClick={() => { setIsReportModalOpen(false); setReportComment(''); }} 
                  className="text-slate-600 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {t.report_desc}
                </p>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                    {t.report_comment}
                  </label>
                  <textarea 
                    value={reportComment}
                    onChange={(e) => setReportComment(e.target.value)}
                    rows={4}
                    placeholder={t.report_placeholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none text-white placeholder:text-slate-700" 
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => { setIsReportModalOpen(false); setReportComment(''); }} 
                    className="flex-1 py-4 bg-slate-950 border border-slate-850 hover:bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    onClick={async () => {
                      setSubmittingReport(true);
                      const pathParts = window.location.pathname.split('/');
                      const courseName = pathParts[3] ? pathParts[3].replace(/_/g, ' ') : "General";
                      
                      // Append visual location context if available
                      const locationHint = getProbableLocationOnPage();
                      const finalComment = locationHint 
                        ? `${reportComment}\n\n${locationHint}` 
                        : reportComment;
                      
                      await dbService.submitReport(courseName, window.location.pathname, finalComment);
                      setSubmittingReport(false);
                      setIsReportModalOpen(false);
                      setReportComment('');
                      triggerToast(t.report_success);
                    }}
                    disabled={submittingReport}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 disabled:bg-slate-800 cursor-pointer"
                  >
                    {submittingReport 
                      ? t.report_sending
                      : t.report_submit}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedEnrollCourse && (
          <EnrollmentModal
            course={selectedEnrollCourse}
            onClose={() => setSelectedEnrollCourse(null)}
            lang={lang}
            isLoggedIn={isLoggedIn}
            enrolledIds={enrolledIds}
            courses={courses}
            showEnrollActions={true}
            onSelectCourse={(c) => setSelectedEnrollCourse(c)}
            onEnroll={async (activeC) => {
              const targetCourse = activeC || selectedEnrollCourse;
              if (!isLoggedIn) {
                window.location.href = `/signup?redirect=/${targetCourse.level}/${targetCourse.subject}/${targetCourse.slug}/introduction`;
                return;
              }
              let userId = 'u1';
              const savedProfile = localStorage.getItem('op_user_profile');
              if (savedProfile) {
                try {
                  const p = JSON.parse(savedProfile);
                  if (p.id) userId = p.id;
                } catch (err) {}
              }
              await dbService.enrollInCourse(userId, targetCourse.id);
              setEnrolledIds(prev => [...prev, targetCourse.id]);
              
              setEnrollmentSuccess(true);
              const courseToOpen = targetCourse;
              setSelectedEnrollCourse(null);
              window.dispatchEvent(new Event('op_progress_updated'));
              
              setTimeout(() => {
                setEnrollmentSuccess(false);
                window.location.href = `/${courseToOpen.level}/${courseToOpen.subject}/${courseToOpen.slug}/introduction`;
              }, 2000);
            }}
          />
        )}
      </AnimatePresence>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AnimatePresence>
        {enrollmentSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 px-6 py-3.5 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-2xl flex items-center gap-3 z-[12000] backdrop-blur-xl"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-100 tracking-wide">
              {lang.toUpperCase() === 'FR' ? 'Inscription Réussie !' : 'Enrollment Successful!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
// --- COMPONENT: INSTITUTIONAL FOOTER ---
export const Footer = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const [readingMode, setReadingMode] = React.useState('dark');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
      setReadingMode(savedMode);
    }

    const handleGlobalModeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setReadingMode(customEvent.detail);
    };
    window.addEventListener('op_reading_mode_changed', handleGlobalModeChange);
    return () => {
      window.removeEventListener('op_reading_mode_changed', handleGlobalModeChange);
    };
  }, []);

  const isPaper = readingMode === 'paper';
  const isFocus = readingMode === 'focus';
  
  const bgClass = isPaper 
    ? "bg-[#fcfaf2] border-t border-[#eae0cb]" 
    : isFocus 
      ? "bg-black border-t border-[#111111]" 
      : "bg-slate-950 border-t border-slate-900";
      
  const textTitleClass = isPaper 
    ? "text-[#8a7664]" 
    : isFocus 
      ? "text-[#555555]" 
      : "text-slate-400";
      
  const textDescClass = isPaper 
    ? "text-[#6c5c4e]" 
    : isFocus 
      ? "text-[#666666]" 
      : "text-slate-500";
      
  const textLinkClass = isPaper 
    ? "text-[#8a7664] hover:text-[#2d241e]" 
    : isFocus 
      ? "text-[#555555] hover:text-white" 
      : "text-slate-600 hover:text-white";
      
  const borderBottomClass = isPaper 
    ? "border-[#eae0cb]" 
    : isFocus 
      ? "border-[#111111]" 
      : "border-slate-900/50";
      
  const textCopyrightClass = isPaper 
    ? "text-[#8a7664]" 
    : isFocus 
      ? "text-[#444444]" 
      : "text-slate-800";

  return (
    <footer className={`${bgClass} pt-24 pb-12 px-8 overflow-hidden`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <OpenPrimerIcon className="w-10 h-10" />
              <span className="font-sans font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
            </Link>
            <p className={`text-sm ${textDescClass} leading-relaxed italic`}>
              {t.footer_desc}
            </p>
          </div>

          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textTitleClass} mb-8`}>{t.foundation}</p>
            <ul className="space-y-4">
              <li><Link href="/philosophy" className={`text-sm ${textLinkClass} transition-colors`}>{t.philosophy}</Link></li>
              <li><Link href="/contact" className={`text-sm ${textLinkClass} transition-colors`}>{t.contact}</Link></li>
            </ul>
          </div>

          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textTitleClass} mb-8`}>{t.curriculum}</p>
            <ul className="space-y-4">
              <li><Link href="/catalog" className={`text-sm ${textLinkClass} transition-colors`}>{t.catalog}</Link></li>
            </ul>
          </div>

          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textTitleClass} mb-8`}>{t.legal}</p>
            <ul className="space-y-4">
              <li><Link href="/terms" className={`text-sm ${textLinkClass} transition-colors`}>{t.terms}</Link></li>
              <li><Link href="/privacy" className={`text-sm ${textLinkClass} transition-colors`}>{t.privacy}</Link></li>
            </ul>
          </div>
        </div>

        <div className={`pt-12 border-t ${borderBottomClass} flex flex-col md:flex-row justify-between items-center gap-8`}>
          <div className={`text-[9px] font-black ${textCopyrightClass} uppercase tracking-[0.4em]`}>
            {t.copyright}
          </div>
          <div className="flex gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
             <span className="text-xs font-bold text-white">🇪🇺</span>
             <span className="text-xs font-bold text-white">🇨🇳</span>
             <span className="text-xs font-bold text-white">🇺🇸</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- COMPONENT: ADMIN CONSOLE FOOTER ---
export const AdminFooter = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">
          {t.copyright}
        </div>
        <div className="flex gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
           <span className="text-xs font-bold text-white">🇪🇺</span>
           <span className="text-xs font-bold text-white">🇨🇳</span>
           <span className="text-xs font-bold text-white">🇺🇸</span>
        </div>
      </div>
    </footer>
  );
};
