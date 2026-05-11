"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Send, Sparkles, User, Bot, X, MessageSquare, AlertTriangle, Share2, 
  Bookmark, Menu, ChevronRight, CheckCircle, ChevronDown, LogOut, Trash2, Globe, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- INTERNATIONALIZATION DICTIONARY (UI ONLY) ---
export const UI_STRINGS = {
  EN: { tutor: "AI Tutor", placeholder: "Ask a question...", welcome: "Hello! I am your OpenPrimer tutor.", copy: "Link copied!", report: "Report", signout: "Sign Out", login: "Sign In", profile: "My Profile", delete: "Delete Account", catalog: "Catalog", langLabel: "Language" },
  FR: { tutor: "Tuteur IA", placeholder: "Posez une question...", welcome: "Bonjour ! Je suis votre tuteur OpenPrimer.", copy: "Lien copié !", report: "Signaler", signout: "Déconnexion", login: "Connexion", profile: "Mon Profil", delete: "Supprimer le compte", catalog: "Catalogue", langLabel: "Langue" },
  ES: { tutor: "Tutor IA", placeholder: "Hacer una pregunta...", welcome: "¡Hola! Soy tu tutor OpenPrimer.", copy: "¡Enlace copiado!", report: "Reportar", signout: "Cerrar sesión", login: "Entrar", profile: "Mi Perfil", delete: "Eliminar cuenta", catalog: "Catálogo", langLabel: "Idioma" },
  DE: { tutor: "KI-Tutor", placeholder: "Frage stellen...", welcome: "Hallo! Ich bin dein OpenPrimer Tutor.", copy: "Link kopiert!", report: "Melden", signout: "Abmelden", login: "Anmelden", profile: "Mein Profil", delete: "Konto löschen", catalog: "Katalog", langLabel: "Sprache" },
  ZH: { tutor: "AI 导师", placeholder: "提问...", welcome: "你好！我是你的 OpenPrimer 导师。", copy: "链接已复制！", report: "举报", signout: "登出", login: "登录", profile: "我的个人资料", delete: "删除账户", catalog: "目录", langLabel: "语言" }
};

// --- COMPONENT: AI TUTOR OVERLAY ---
export const AITutorOverlay = ({ pageContext, lang = 'EN' }: { pageContext?: string, lang?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [messages, setMessages] = useState([{ role: 'assistant', content: t.welcome }]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState('Pragmatic');

  const QUICK_ACTIONS = [
    { label: "Give Example", icon: <Sparkles className="w-3 h-3" />, prompt: "Give me a concrete real-world example of this concept." },
    { label: "Tell Story", icon: <Bookmark className="w-3 h-3" />, prompt: "Tell me a historical anecdote about this discovery." },
    { label: "Simplify", icon: <Globe className="w-3 h-3" />, prompt: "Explain this to me as if I were a complete beginner." },
    { label: "Test Me", icon: <CheckCircle className="w-3 h-3" />, prompt: "Give me a challenge question to test my understanding." }
  ];

  // Persist history
  useEffect(() => {
    const key = `op_tutor_hist_${pageContext || 'global'}_${lang}`;
    const saved = localStorage.getItem(key);
    if (saved) setMessages(JSON.parse(saved));
  }, [pageContext, lang]);

  useEffect(() => {
    if (messages.length > 1) {
      const key = `op_tutor_hist_${pageContext || 'global'}_${lang}`;
      localStorage.setItem(key, JSON.stringify(messages.slice(-10))); // Keep last 10
    }
  }, [messages, pageContext, lang]);

  const handleSend = (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content }]);
    if (!text) setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: lang === 'ZH' ? "正在进行学术分析..." : `[${persona} Mode] Academic analysis in progress...` }]);
    }, 1200);
  };

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
                   <select 
                     value={persona} 
                     onChange={(e) => setPersona(e.target.value)}
                     className="bg-transparent text-sm font-bold text-white focus:outline-none appearance-none cursor-pointer hover:text-blue-400 transition-colors"
                   >
                     <option value="Socratic">Socratic Method</option>
                     <option value="Pragmatic">Pragmatic Mode</option>
                     <option value="Academic">Rigorous Academic</option>
                   </select>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

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
                 <button key={qa.label} onClick={() => handleSend(qa.prompt)} className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition-all text-left">
                   {qa.icon} {qa.label}
                 </button>
               ))}
            </div>

            <div className="p-6 bg-slate-950/50 border-t border-slate-800/50">
              <div className="relative">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={t.placeholder} className="w-full bg-slate-800/40 border border-slate-700/30 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600" />
                <button onClick={() => handleSend()} className="absolute right-4 top-3 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center relative border border-white/10 group">
        <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </motion.button>
    </div>
  );
};

// --- COMPONENT: TOP NAVIGATION ---
export const TopNav = ({ toggleSidebar, isCoursePage = false, onLangChange }: { toggleSidebar?: () => void, isCoursePage?: boolean, onLangChange?: (lang: string) => void }) => {
  const [lang, setLang] = useState('EN');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showToast, setShowToast] = useState<string | null>(null);
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  useEffect(() => {
    const savedLang = localStorage.getItem('op_lang') || 'EN';
    setLang(savedLang);
  }, []);

  const changeLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('op_lang', newLang);
    if (onLangChange) onLangChange(newLang);
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast(t.copy);
  };

  const languages = [
    { code: 'EN', flag: '🇬🇧', label: 'English' },
    { code: 'FR', flag: '🇫🇷', label: 'Français' },
    { code: 'ES', flag: '🇪🇸', label: 'Español' },
    { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'ZH', flag: '🇨🇳', label: '中文' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-900 z-[100] px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
        </Link>
        <Link href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors ml-4 hidden md:block">
           {t.catalog}
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* Pentaglotte Language Selector */}
        <div className="relative group/lang">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
            <span className="text-lg">{languages.find(l => l.code === lang)?.flag}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{lang}</span>
            <ChevronDown className="w-3 h-3 text-slate-600 group-hover/lang:rotate-180 transition-transform" />
          </button>
          <div className="absolute top-full right-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 group-hover/lang:opacity-100 pointer-events-none group-hover/lang:pointer-events-auto transition-all translate-y-2 group-hover/lang:translate-y-0 z-[100] overflow-hidden p-1">
             {languages.map(l => (
               <button key={l.code} onClick={() => changeLang(l.code)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${lang === l.code ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
                 <span>{l.flag} {l.label}</span>
                 {lang === l.code && <CheckCircle className="w-3 h-3" />}
               </button>
             ))}
          </div>
        </div>

        <button onClick={shareLink} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all">
          <Share2 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-800 mx-2" />
        
        {isLoggedIn ? (
          <div className="relative group/user">
            <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all overflow-hidden group">
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 group-hover/user:opacity-100 pointer-events-none group-hover/user:pointer-events-auto transition-all translate-y-2 group-hover/user:translate-y-0 z-[100] overflow-hidden p-2">
               <div className="px-4 py-3 border-b border-slate-800/50 mb-1">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Identity</p>
                 <p className="text-xs font-bold text-white truncate">silvere@openprimer.org</p>
               </div>
               <Link href="/admin/curriculum" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-600/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 transition-colors">
                 <Settings className="w-4 h-4" /> Administration
               </Link>
               <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                 <User className="w-4 h-4" /> {t.profile}
               </Link>
               <button onClick={() => { setIsLoggedIn(false); triggerToast(t.signout); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                 <LogOut className="w-4 h-4" /> {t.signout}
               </button>
               <button onClick={() => { if(confirm("Permanently delete?")) { setIsLoggedIn(false); triggerToast(t.delete); } }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 transition-colors mt-1 border-t border-slate-800">
                 <Trash2 className="w-4 h-4" /> {t.delete}
               </button>
            </div>
          </div>
        ) : (
          <Link href="/auth/login" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            {t.login}
          </Link>
        )}
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 shadow-2xl flex items-center gap-3 z-[60]">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-100">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
