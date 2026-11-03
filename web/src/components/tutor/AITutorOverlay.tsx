"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Sparkles, X, Bookmark, CheckCircle, Globe, GraduationCap, Brain, Lock, Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { dbService, TutorPersonality } from '@/lib/db';
import { decryptApiKey } from '@/lib/crypto';
import { UI_STRINGS } from '@/lib/translations';
import { usePathname } from 'next/navigation';
import { TutorMessageContent, renderInlineContent, parseMarkdownTableRow } from './overlay/TutorMessageContent';
import {
  AITutorOverlayProps,
  AI_ACT_DISCLAIMERS,
  TUTOR_LOCAL_STRINGS,
  extractFlashcardsFromContext,
  getProbableLocationOnPage
} from './overlay/tutorStringsAndHelpers';
import { useTutorVoiceInput } from './overlay/useTutorVoiceInput';
import { TutorFlashcardsPanel, TutorSelectorModal, TutorCoachPopover } from './overlay/TutorPanelsAndModals';

export type { AITutorOverlayProps };
export {
  TutorMessageContent,
  renderInlineContent,
  parseMarkdownTableRow,
  AI_ACT_DISCLAIMERS,
  TUTOR_LOCAL_STRINGS,
  extractFlashcardsFromContext,
  getProbableLocationOnPage,
  useTutorVoiceInput,
  TutorFlashcardsPanel,
  TutorSelectorModal,
  TutorCoachPopover
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

  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const tls = TUTOR_LOCAL_STRINGS[lang.toUpperCase()] || TUTOR_LOCAL_STRINGS.EN;

  const [isOpen, setIsOpen] = useState(false);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: t.welcome }]);

  const [isGlowing, setIsGlowing] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const glowTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  const [tutorEnabled, setTutorEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'flashcards'>('chat');
  const [flashcards, setFlashcards] = useState<{ term: string; definition: string }[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardMastery, setCardMastery] = useState<Record<string, string>>({});
  const [isCoachingDismissed, setIsCoachingDismissed] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { isListening, micActivity, toggleListening } = useTutorVoiceInput(
    lang,
    input,
    setInput,
    t.voice_not_supported
  );

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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

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

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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

  const DASHBOARD_QUICK_ACTIONS = [
    { 
      label: tls.dashboardDiscussLabel, 
      icon: <GraduationCap className="w-3 h-3" />, 
      prompt: tls.dashboardDiscussPrompt 
    },
    { 
      label: tls.dashboardPlanLabel, 
      icon: <Sparkles className="w-3 h-3" />, 
      prompt: tls.dashboardPlanPrompt 
    }
  ];

  const courseSlug = isDashboardMode ? 'curriculum_dashboard' : (isCurriculumPage ? segments[2] : 'global');
  const welcomeMessage = isDashboardMode ? tls.dashboardWelcome : t.welcome;

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
      localStorage.setItem(key, JSON.stringify(messages.slice(-10)));
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

    stopGeneration();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('op_stop_course_speech'));
    }
    
    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    if (!text) setInput('');

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
        setMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0 && updated[updated.length - 1].content === '...') {
            updated[updated.length - 1] = { role: 'assistant', content: tls.stopped };
          }
          return updated;
        });
      } else {
        console.error("Streaming error", err);
        setMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = { 
              role: 'assistant', 
              content: tls.connErr
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

  useEffect(() => {
    if (pageContext) {
      const cards = extractFlashcardsFromContext(pageContext);
      setFlashcards(cards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  }, [pageContext]);

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

  useEffect(() => {
    const handleExerciseCompleted = (e: Event) => {
      const customEvent = e as CustomEvent;
      const detail = customEvent.detail;
      if (!detail) return;

      const promptHeader = detail.success ? tls.exerciseSuccessHeader : tls.exerciseErrorHeader;
      const instructions = detail.success ? tls.exerciseSuccessInstr : tls.exerciseErrorInstr;

      const prompt = `${promptHeader}${tls.questionLabel}"${detail.question}"\n${tls.selectedLabel}"${detail.selectedAnswer}"\n${tls.correctLabel}"${detail.correctAnswer}"\n${detail.explanation ? `${tls.explLabel}"${detail.explanation}"\n` : ''}${instructions}`;

      if (isOpen) {
        setActiveTab('chat');
        handleSend(prompt);
      } else {
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
    
    window.dispatchEvent(new Event('op_active_tutor_changed'));
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  if (tutorAssistanceBlocked) return null;
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
                  <TutorFlashcardsPanel
                    flashcards={flashcards}
                    currentCardIndex={currentCardIndex}
                    setCurrentCardIndex={setCurrentCardIndex}
                    isFlipped={isFlipped}
                    setIsFlipped={setIsFlipped}
                    cardMastery={cardMastery}
                    handleRateCard={handleRateCard}
                    isCoachingDismissed={isCoachingDismissed}
                    setIsCoachingDismissed={setIsCoachingDismissed}
                    t={t}
                  />
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <TutorSelectorModal
        showTutorModal={showTutorModal}
        setShowTutorModal={setShowTutorModal}
        personalities={personalities}
        persona={persona}
        handleSelectTutor={handleSelectTutor}
        lang={lang}
        t={t}
      />

      <TutorCoachPopover
        isOpen={isOpen}
        showCoachPopover={showCoachPopover}
        coachAdvice={coachAdvice}
        handleDismissCoachPopover={handleDismissCoachPopover}
        handleOpenChatFromCoach={handleOpenChatFromCoach}
        persona={persona}
        getPersonaName={getPersonaName}
        lang={lang}
        t={t}
      />

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
