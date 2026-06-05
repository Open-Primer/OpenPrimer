"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Send, Sparkles, User, Bot, X, MessageSquare, AlertTriangle, Share2, 
  Bookmark, Menu, ChevronRight, CheckCircle, ChevronDown, LogOut, Trash2, Globe, Settings, ShieldAlert, GraduationCap, Brain, Loader2, Lock, Mic, MicOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpenPrimerIcon } from './OpenPrimerIcon';
import { EnrollmentModal } from './modals/EnrollmentModal';
import { COURSE_SYLLABUS_DETAILS } from './StaticPages';
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

interface AITutorOverlayProps {
  lang?: string;
  pageContext?: string;
}

// --- COMPONENT: AI TUTOR OVERLAY ---
export const AITutorOverlay = ({ lang: propLang, pageContext }: AITutorOverlayProps = {}) => {
  const { language: contextLang } = useLanguage();
  const lang = propLang || contextLang;
  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: t.welcome }]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('op_active_tutor_personality') || 'socratic';
    }
    return 'socratic';
  });
  const [personalities, setPersonalities] = useState<TutorPersonality[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const pathname = usePathname();
  const isCurriculumPage = pathname.includes('/L1/') || pathname.includes('/L2/') || pathname.includes('/L3/');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [tutorEnabled, setTutorEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'flashcards'>('chat');
  const [flashcards, setFlashcards] = useState<{ term: string; definition: string }[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardMastery, setCardMastery] = useState<Record<string, string>>({});
  const recognitionRef = useRef<any>(null);

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

  // Periodic health check with auto-reconnection loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    async function checkHealth() {
      try {
        if (isOffline) {
          setIsRetrying(true);
        }
        const res = await fetch('/api/tutor/health');
        if (!res.ok) {
          throw new Error('Tutor health degraded');
        }
        setIsOffline(false);
        setIsRetrying(false);
      } catch (err) {
        setIsOffline(true);
        setIsRetrying(true);
      }
    }

    if (isOpen) {
      checkHealth();
      timer = setInterval(checkHealth, 5000); // Check every 5 seconds for robust state synchronization
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, isOffline]);

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
  }, [isOpen]);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: mode }));
    }
  };

  if (!isCurriculumPage || !tutorEnabled) return null;

  const QUICK_ACTIONS = [
    { label: t.give_example, icon: <Sparkles className="w-3 h-3" />, prompt: t.give_example_prompt },
    { label: t.tell_story, icon: <Bookmark className="w-3 h-3" />, prompt: t.tell_story_prompt },
    { label: t.simplify, icon: <Globe className="w-3 h-3" />, prompt: t.simplify_prompt },
    { label: t.test_me, icon: <CheckCircle className="w-3 h-3" />, prompt: t.test_me_prompt }
  ];

  // Persist history based on course slug instead of specific page pathname
  const slugParts = pathname ? pathname.split('/') : [];
  const isLPage = slugParts.includes('L1') || slugParts.includes('L2') || slugParts.includes('L3');
  const courseSlug = isLPage ? slugParts[3] : 'global';

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

  const handleSend = async (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    if (!text) setInput('');

    // Append an assistant slot that we will stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);
    
    try {
      let token: string | undefined;
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token;
      } catch (err) {
        console.warn("[TUTOR CHAT] Failed to retrieve client auth session token:", err);
      }

      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          messages: newMessages,
          persona,
          pageContext: pageContext || '',
          language: lang
        })
      });

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
        window.dispatchEvent(new CustomEvent('op_read_tutor_response', { detail: { text: accumulatedText } }));
      }
    } catch (err) {
      console.error("Streaming error", err);
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1] = { 
            role: 'assistant', 
            content: t.tutor_error
          };
         }
         return updated;
       });
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
                     onClick={() => { window.location.href = '/profile/curriculum'; }}
                     title={lang === 'FR' ? 'Changer de tuteur' : 'Change tutor'}
                     className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-blue-300 transition-colors cursor-pointer group"
                   >
                     <span>{getPersonaName(persona)}</span>
                     <span className="text-[9px] font-black uppercase tracking-widest bg-blue-600/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-full group-hover:bg-blue-600/40 transition-colors">
                       {lang === 'FR' ? 'ACTIF' : 'ACTIVE'}
                     </span>
                   </button>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {isLoggedIn && (
              <div className="flex border-b border-slate-800/50 bg-slate-950/40 text-[9px] font-black uppercase tracking-widest text-slate-500 shrink-0 select-none">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-3 text-center transition-all border-b-2 cursor-pointer ${activeTab === 'chat' ? 'text-blue-400 border-blue-500 bg-blue-500/5' : 'border-transparent hover:text-slate-300'}`}
                >
                  {lang === 'FR' ? 'Tuteur' : 'Tutor'}
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
                {/* Offline Connection Loss banner */}
                <AnimatePresence>
                  {isOffline && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 py-3.5 bg-amber-500/10 border-b border-amber-500/25 text-amber-500 flex items-center justify-between text-[9px] font-black uppercase tracking-widest gap-3 shrink-0 overflow-hidden"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 shrink-0">
                          <Loader2 className="w-3 h-3 animate-spin stroke-[3]" />
                        </div>
                        <span className="leading-tight">
                          {t.connection_difficulties}
                        </span>
                      </div>
                      <div className="bg-amber-500/20 px-2.5 py-1 rounded-lg text-[7px] font-black uppercase animate-pulse shrink-0 text-amber-400 border border-amber-500/30">
                        {t.please_wait}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {activeTab === 'chat' ? (
                  <>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-slate-800/50 text-slate-300 rounded-tl-none' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 rounded-tr-none'}`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-6 py-4 grid grid-cols-2 gap-2 bg-slate-950/20 border-t border-slate-800/50">
                       {QUICK_ACTIONS.map(qa => (
                         <button key={qa.label} disabled={isOffline} onClick={() => handleSend(qa.prompt)} className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed">
                           {qa.icon} {qa.label}
                         </button>
                       ))}
                    </div>

                    <div className="p-6 bg-slate-950/50 border-t border-slate-800/50">
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          disabled={isOffline} 
                          value={input} 
                          onChange={(e) => setInput(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                          placeholder={isOffline ? t.offline_placeholder : t.placeholder} 
                          className="w-full bg-slate-800/40 border border-slate-775 rounded-2xl py-4 pl-6 pr-28 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed" 
                        />
                        
                        {isListening && (
                          <div className="absolute inset-0 bg-slate-900/95 border border-blue-500/40 rounded-2xl flex items-center justify-between px-6 backdrop-blur-xl animate-fade-in z-20">
                            <style>{`
                              @keyframes wave-oscillate {
                                0%, 100% { transform: scaleY(0.2); }
                                50% { transform: scaleY(1.0); }
                              }
                              .osc-bar {
                                transform-origin: center;
                                animation: wave-oscillate var(--d, 1s) ease-in-out infinite;
                              }
                            `}</style>
                            <div className="flex items-center gap-3">
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                {t.voice_active}
                              </span>
                            </div>
                            
                            {/* Premium SVG Oscilloscope */}
                            <div className="flex items-center gap-1.5 h-6">
                              <div className="w-[3px] bg-blue-500 rounded-full h-5 osc-bar" style={{ '--d': '0.7s' } as any} />
                              <div className="w-[3px] bg-indigo-500 rounded-full h-5 osc-bar" style={{ '--d': '0.5s' } as any} />
                              <div className="w-[3px] bg-violet-500 rounded-full h-5 osc-bar" style={{ '--d': '0.9s' } as any} />
                              <div className="w-[3px] bg-fuchsia-500 rounded-full h-5 osc-bar" style={{ '--d': '0.6s' } as any} />
                              <div className="w-[3px] bg-pink-500 rounded-full h-5 osc-bar" style={{ '--d': '0.8s' } as any} />
                              <div className="w-[3px] bg-rose-500 rounded-full h-5 osc-bar" style={{ '--d': '0.4s' } as any} />
                              <div className="w-[3px] bg-red-500 rounded-full h-5 osc-bar" style={{ '--d': '0.7s' } as any} />
                            </div>

                            <button 
                              type="button"
                              onClick={toggleListening}
                              className="px-4 py-2 bg-red-650 hover:bg-red-600 border border-red-500/40 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] text-white transition-all shadow-md cursor-pointer"
                            >
                              {t.voice_stop}
                            </button>
                          </div>
                        )}

                        <button 
                          type="button"
                          disabled={isOffline} 
                          onClick={toggleListening} 
                          className={`absolute right-16 top-3 p-2 rounded-xl border transition-all ${isListening ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'} disabled:opacity-40 disabled:cursor-not-allowed`}
                          title={t.voice_enable}
                          aria-label="Active voice coaching input"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                        <button 
                          disabled={isOffline} 
                          onClick={() => handleSend()} 
                          className="absolute right-4 top-3 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all disabled:bg-blue-600/30 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                        </button>
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
                        <div className="perspective-1000 my-6">
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
                              <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                                {flashcards[currentCardIndex]?.definition}
                              </p>
                              <p className="text-[9px] text-slate-500 mt-6 italic font-bold tracking-wider uppercase select-none">
                                {lang === 'FR' ? 'Cliquez pour retourner' : 'Click to flip'}
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </div>

                    {flashcards.length > 0 && isFlipped && (
                      <div className="space-y-3 pt-4 border-t border-slate-800/40">
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
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center relative border border-white/10 group cursor-pointer"
      >
        <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </motion.button>
    </div>
  );
};

export const formatCourseLevel = (level: string | number, lang: string) => {
  const lvlStr = String(level).toUpperCase();
  const isEn = lang.toUpperCase() === 'EN';
  const isZh = lang.toUpperCase() === 'ZH';
  const isEs = lang.toUpperCase() === 'ES';
  const isDe = lang.toUpperCase() === 'DE';
  const isFr = lang.toUpperCase() === 'FR';

  if (lvlStr === 'SECONDARY_1') {
    if (isFr) return 'Secondaire 1';
    if (isZh) return '高中一年级';
    if (isEs) return 'Secundaria 1';
    if (isDe) return 'Sekundarstufe 1';
    return 'Secondary 1';
  }
  if (lvlStr === 'SECONDARY_2') {
    if (isFr) return 'Secondaire 2';
    if (isZh) return '高中二年级';
    if (isEs) return 'Secundaria 2';
    if (isDe) return 'Sekundarstufe 2';
    return 'Secondary 2';
  }
  if (lvlStr === 'SECONDARY_3') {
    if (isFr) return 'Secondaire 3';
    if (isZh) return '高中三年级';
    if (isEs) return 'Secundaria 3';
    if (isDe) return 'Sekundarstufe 3';
    return 'Secondary 3';
  }
  if (lvlStr.startsWith('SECONDARY_')) {
    const num = lvlStr.split('_')[1];
    if (isFr) return `Secondaire ${num}`;
    if (isZh) return `高中${num}年级`;
    if (isEs) return `Secundaria ${num}`;
    if (isDe) return `Sekundarstufe ${num}`;
    return `Secondary ${num}`;
  }
  if (lvlStr.startsWith('PRIMARY_')) {
    const num = lvlStr.split('_')[1];
    if (isFr) return `Primaire ${num}`;
    if (isZh) return `小学${num}年级`;
    if (isEs) return `Primaria ${num}`;
    if (isDe) return `Primarstufe ${num}`;
    return `Primary ${num}`;
  }

  if (lvlStr === 'L1') {
    if (isEn) return '101';
    if (isZh) return '大一 (101)';
    if (isEs) return 'L1 (101)';
    if (isDe) return 'L1 (101)';
    return 'L1';
  }
  if (lvlStr === 'L2') {
    if (isEn) return '201';
    if (isZh) return '大二 (201)';
    if (isEs) return 'L2 (201)';
    if (isDe) return 'L2 (201)';
    return 'L2';
  }
  if (lvlStr === 'L3') {
    if (isEn) return '301';
    if (isZh) return '大三 (301)';
    if (isEs) return 'L3 (301)';
    if (isDe) return 'L3 (301)';
    return 'L3';
  }

  if (/^\d+$/.test(lvlStr)) {
    const num = parseInt(lvlStr, 10);
    if (isZh) return `${num}年级`;
    if (isEn) return `Grade ${num}`;
    if (lang.toUpperCase() === 'FR') return `Niveau ${num}`;
    if (isEs) return `Grado ${num}`;
    if (isDe) return `Klasse ${num}`;
  }
  return lvlStr;
};

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
      EN: "Completed Courses",
      FR: "Modules Complétés",
      ES: "Cursos Completados",
      DE: "Abgeschlossene Kurse",
      ZH: "已完成模块"
    }
  };
  return labels[key]?.[l] || labels[key]?.EN || '';
};

// --- COMPONENT: TOP NAVIGATION ---
export const TopNav = ({ toggleSidebar, isCoursePage = false, showReadingModeSelector = false, onLangChange }: { toggleSidebar?: () => void, isCoursePage?: boolean, showReadingModeSelector?: boolean, onLangChange?: (lang: string) => void }) => {
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCourseData, setActiveCourseData] = useState<any | null>(null);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<any | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);

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

    return () => {
      window.removeEventListener('op_reading_mode_changed', handleGlobalModeChange);
      window.removeEventListener('op_trigger_auth_state', handleGlobalTriggerAuth);
      window.removeEventListener('op_auth_state_change', handleAuthStateChange);
      window.removeEventListener('op_auth_state_changed', handleAuthStateChange);
      window.removeEventListener('op_accessibility_preferences_changed', handleAuthStateChange);
      window.removeEventListener('op_languages_changed', fetchLanguages);
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
      const isCoursePath = parts.includes('L1') || parts.includes('L2') || parts.includes('L3');

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



        {isCoursePage && (
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
                    
                    <Link 
                      href="/profile/settings" 
                      className={`flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all ${
                        (userProfile?.role === 'admin' || userProfile?.email === 'vanguard.mysterious@gmail.com') 
                          ? 'border-b border-slate-800/50' 
                          : ''
                      }`}
                    >
                      <Settings className="w-4 h-4" /> {t.settings}
                    </Link>

                    {(userProfile?.role === 'admin' || userProfile?.email === 'vanguard.mysterious@gmail.com') && (
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
                      await dbService.submitReport(courseName, window.location.pathname, reportComment);
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
            onEnroll={async () => {
              if (!isLoggedIn) {
                window.location.href = `/signup?redirect=/${selectedEnrollCourse.level}/${selectedEnrollCourse.subject}/${selectedEnrollCourse.slug}/introduction`;
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
              await dbService.enrollInCourse(userId, selectedEnrollCourse.id);
              setEnrolledIds(prev => [...prev, selectedEnrollCourse.id]);
              
              setEnrollmentSuccess(true);
              const courseToOpen = selectedEnrollCourse;
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
