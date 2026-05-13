"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Send, Sparkles, User, Bot, X, MessageSquare, AlertTriangle, Share2, 
  Bookmark, Menu, ChevronRight, CheckCircle, ChevronDown, LogOut, Trash2, Globe, Settings, ShieldAlert, GraduationCap, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpenPrimerIcon } from './OpenPrimerIcon';

// --- INTERNATIONALIZATION DICTIONARY (UI ONLY) ---
export const UI_STRINGS = {
  EN: { 
    tutor: "AI Tutor", placeholder: "Ask a question...", welcome: "Hello! I am your OpenPrimer tutor.", 
    copy: "Link copied!", report: "Report", signout: "Sign Out", login: "Sign In", profile: "My Profile", 
    delete: "Delete Account", catalog: "Catalog", langLabel: "Language",
    foundation: "Foundation", curriculum: "Curriculum", legal: "Legal",
    philosophy: "Our Philosophy", contact: "Global Contact", opensource: "Open Source",
    progress: "My Progress", admin: "Academic Admin",
    terms: "Terms of Service", privacy: "Privacy Sovereignty",
    copyright: "© 2026 OpenPrimer Foundation • European Academic Consortium",
    all: "All", saved: "Saved", physics: "Physics", biology: "Biology", law: "Law", math: "Mathematics", search: "Search modules..."
  },
  FR: { 
    tutor: "Tuteur IA", placeholder: "Posez une question...", welcome: "Bonjour ! Je suis votre tuteur OpenPrimer.", 
    copy: "Lien copié !", report: "Signaler", signout: "Déconnexion", login: "Connexion", profile: "Mon Profil", 
    delete: "Supprimer le compte", catalog: "Catalogue", langLabel: "Langue",
    foundation: "Fondation", curriculum: "Curriculum", legal: "Légal",
    philosophy: "Notre Philosophie", contact: "Contact Global", opensource: "Open Source",
    progress: "Mon Progrès", admin: "Admin Académique",
    terms: "Conditions d'Utilisation", privacy: "Souveraineté des Données",
    copyright: "© 2026 Fondation OpenPrimer • Consortium Académique Européen",
    all: "Tous", saved: "Favoris", physics: "Physique", biology: "Biologie", law: "Droit", math: "Mathématiques", search: "Rechercher des modules..."
  },
  ES: { 
    tutor: "Tutor IA", placeholder: "Hacer una pregunta...", welcome: "¡Hola! Soy tu tutor OpenPrimer.", 
    copy: "¡Enlace copiado!", report: "Reportar", signout: "Cerrar sesión", login: "Entrar", profile: "Mi Perfil", 
    delete: "Eliminar cuenta", catalog: "Catálogo", langLabel: "Idioma",
    foundation: "Fundación", curriculum: "Currículo", legal: "Legal",
    philosophy: "Nuestra Filosofía", contact: "Contacto Global", opensource: "Código Abierto",
    progress: "Mi Progreso", admin: "Admin Académico",
    terms: "Términos de Servicio", privacy: "Soberanía de Privacidad",
    copyright: "© 2026 Fundación OpenPrimer • Consorcio Académico Europeo",
    all: "Todos", saved: "Guardados", physics: "Física", biology: "Biología", law: "Derecho", math: "Matemáticas", search: "Buscar módulos..."
  },
  DE: { 
    tutor: "KI-Tutor", placeholder: "Frage stellen...", welcome: "Hallo! Ich bin dein OpenPrimer Tutor.", 
    copy: "Link kopiert!", report: "Melden", signout: "Abmelden", login: "Anmelden", profile: "Mein Profil", 
    delete: "Konto löschen", catalog: "Katalog", langLabel: "Sprache",
    foundation: "Stiftung", curriculum: "Lehrplan", legal: "Rechtliches",
    philosophy: "Unsere Philosophie", contact: "Globaler Kontakt", opensource: "Open Source",
    progress: "Mein Fortschritt", admin: "Akademische Verwaltung",
    terms: "Nutzungsbedingungen", privacy: "Datenschutz-Souveränität",
    copyright: "© 2026 OpenPrimer Stiftung • Europäisches Akademisches Konsortium",
    all: "Alle", saved: "Gespeichert", physics: "Physik", biology: "Biologie", law: "Recht", math: "Mathematik", search: "Module suchen..."
  },
  ZH: { 
    tutor: "AI 导师", placeholder: "提问...", welcome: "你好！我是你的 OpenPrimer 导师。", 
    copy: "链接已复制！", report: "举报", signout: "登出", login: "登录", profile: "我的个人资料", 
    delete: "删除账户", catalog: "目录", langLabel: "语言",
    foundation: "基金会", curriculum: "课程", legal: "法律",
    philosophy: "我们的哲学", contact: "全球联系", opensource: "开源项目",
    progress: "我的进度", admin: "学术管理",
    terms: "服务条款", privacy: "隐私主权",
    copyright: "© 2026 OpenPrimer 基金会 • 欧洲学术联盟",
    all: "全部", saved: "已保存", physics: "物理", biology: "生物", law: "法律", math: "数学", search: "搜索模块..."
  }
};

import { usePathname } from 'next/navigation';

// --- COMPONENT: AI TUTOR OVERLAY ---
export const AITutorOverlay = ({ pageContext, lang = 'EN' }: { pageContext?: string, lang?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isCurriculumPage = pathname.includes('/L1/') || pathname.includes('/L2/') || pathname.includes('/L3/');

  if (!isCurriculumPage) return null;
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
  const [activeDropdown, setActiveDropdown] = useState<'lang' | 'user' | null>(null);
  
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  useEffect(() => {
    const savedLang = localStorage.getItem('op_lang') || 'EN';
    setLang(savedLang);
  }, []);

  const changeLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('op_lang', newLang);
    if (onLangChange) onLangChange(newLang);
    setActiveDropdown(null);
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
          <span className="font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
        </Link>
        <Link href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors ml-4 hidden md:block">
           {t.catalog}
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <div className="relative" onMouseEnter={() => setActiveDropdown('lang')} onMouseLeave={() => setActiveDropdown(null)}>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
            <span className="text-lg">{languages.find(l => l.code === lang)?.flag}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{lang}</span>
            <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform ${activeDropdown === 'lang' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {activeDropdown === 'lang' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden p-1">
                 {languages.map(l => (
                   <button key={l.code} onClick={() => changeLang(l.code)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${lang === l.code ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
                     <span>{l.flag} {l.label}</span>
                     {lang === l.code && <CheckCircle className="w-3 h-3" />}
                   </button>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isCoursePage && (
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl mr-2">
            {['Default', 'Paper', 'Focus'].map(mode => (
              <button 
                key={mode}
                onClick={() => (window as any).setReadingMode?.(mode.toLowerCase())}
                className="px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
              >
                {mode}
              </button>
            ))}
          </div>
        )}

        <button onClick={shareLink} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all">
          <Share2 className="w-4 h-4" />
        </button>

        <a href="https://github.com/Open-Primer/OpenPrimer" target="_blank" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-blue-500/50 transition-all">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </a>

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
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1 italic">Logged in as</p>
                     <p className="text-xs font-bold text-white truncate">silvere@openprimer.org</p>
                   </div>
                   
                   <Link href="/catalog" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-600/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 transition-colors">
                     <GraduationCap className="w-4 h-4" /> My Curriculum
                   </Link>
                   
                   <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                     <Settings className="w-4 h-4" /> Account Settings
                   </Link>
                   
                   <div className="h-px bg-slate-800/50 my-1" />
                   
                   <Link href="/admin/curriculum" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors">
                     <GraduationCap className="w-4 h-4" /> Curriculum Manager
                   </Link>
                   
                   <Link href="/admin/analytics" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-600/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 transition-colors">
                     <Brain className="w-4 h-4" /> Research Intelligence
                   </Link>
                   
                   <button onClick={() => { setIsLoggedIn(false); triggerToast(t.signout); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                     <LogOut className="w-4 h-4" /> {t.signout}
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <a href="https://github.com/Open-Primer/OpenPrimer" target="_blank" className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 transition-all">
            Join Project
          </a>
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
// --- COMPONENT: INSTITUTIONAL FOOTER ---
export const Footer = () => {
  const [lang, setLang] = useState('EN');
  useEffect(() => {
    setLang(localStorage.getItem('op_lang') || 'EN');
  }, []);
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-24 pb-12 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <OpenPrimerIcon className="w-10 h-10" />
              <span className="font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed italic">
              Universalizing elite academic knowledge through recursive AI-assisted pedagogy.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">{t.foundation}</p>
            <ul className="space-y-4">
              <li><Link href="/philosophy" className="text-sm text-slate-600 hover:text-white transition-colors">{t.philosophy}</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-600 hover:text-white transition-colors">{t.contact}</Link></li>
              <li><a href="https://github.com/Open-Primer/OpenPrimer" target="_blank" className="text-sm text-slate-600 hover:text-white transition-colors">{t.opensource}</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">{t.curriculum}</p>
            <ul className="space-y-4">
              <li><Link href="/catalog" className="text-sm text-slate-600 hover:text-blue-400 transition-colors">{t.catalog}</Link></li>
              <li><Link href="/profile" className="text-sm text-slate-600 hover:text-blue-400 transition-colors">{t.progress}</Link></li>
              <li><Link href="/admin/curriculum" className="text-sm text-slate-600 hover:text-blue-400 transition-colors">{t.admin}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">{t.legal}</p>
            <ul className="space-y-4">
              <li><Link href="/terms" className="text-sm text-slate-800 hover:text-slate-400 transition-colors">{t.terms}</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-800 hover:text-slate-400 transition-colors">{t.privacy}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">
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
