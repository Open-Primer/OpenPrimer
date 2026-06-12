"use client";

import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, BookOpen, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const ADVANCED_STRINGS = {
  EN: {
    summary_title: "Key Points to Remember",
    eval_pre_title: "Initial Self-Evaluation",
    eval_post_title: "Final Curriculum Review",
    eval_pre_desc: "Rate your initial level on \"{title}\" before starting.",
    eval_post_desc: "Well done! You have completed \"{title}\". Validate your acquired knowledge."
  },
  FR: {
    summary_title: "Points Clés à Retenir",
    eval_pre_title: "Auto-Évaluation de Départ",
    eval_post_title: "Bilan de Fin de Cursus",
    eval_pre_desc: "Évaluez votre niveau initial sur \"{title}\" avant de commencer.",
    eval_post_desc: "Bravo ! Vous avez terminé \"{title}\". Validez vos acquis."
  },
  ES: {
    summary_title: "Puntos Clave a Recordar",
    eval_pre_title: "Autoevaluación Inicial",
    eval_post_title: "Evaluación de Fin de Cursus",
    eval_pre_desc: "Califica tu nivel inicial en \"{title}\" antes de comenzar.",
    eval_post_desc: "¡Bien hecho! Has completado \"{title}\". Valida tus conocimientos adquiridos."
  },
  DE: {
    summary_title: "Wichtige Punkte zum Merken",
    eval_pre_title: "Ausgangs-Selbsteinschätzung",
    eval_post_title: "Abschluss-Bewertung",
    eval_pre_desc: "Bewerten Sie Ihr Einstiegsniveau zu \"{title}\", bevor Sie beginnen.",
    eval_post_desc: "Gut gemacht! Sie haben \"{title}\" abgeschlossen. Validieren Sie Ihr erworbenes Wissen."
  },
  ZH: {
    summary_title: "需要记住的关键点",
    eval_pre_title: "初始自我评估",
    eval_post_title: "课程终期评估",
    eval_pre_desc: "在开始之前，评估您对 “{title}” 的初始水平。",
    eval_post_desc: "做得好！您已完成了 “{title}”。验证您所学到的知识。"
  }
};

// Problème Résolu / Démonstration
export const SolvedProblem = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="my-10 rounded-[40px] overflow-hidden border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-3xl shadow-2xl">
      <div className="p-10 border-b border-emerald-500/10">
        <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" /> Academic Challenge: {title}
        </h4>
        <div className="text-slate-300 text-lg leading-relaxed prose-p:mb-6 last:prose-p:mb-0">
          {children}
        </div>
      </div>
      <button 
        onClick={() => setShowSolution(!showSolution)}
        className="w-full py-6 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 transition-all border-t border-emerald-500/10 cursor-pointer"
      >
        <div className={`w-2 h-2 rounded-full bg-emerald-500 ${showSolution ? 'animate-none' : 'animate-pulse'}`} />
        {showSolution ? "Hide Analytical Verification" : "Show Analytical Verification"}
        {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {showSolution && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-950/80 border-t border-emerald-500/10 p-10 text-slate-400 text-sm italic leading-relaxed"
          >
             <div className="flex items-start gap-4">
                <div className="mt-1 w-1 h-8 bg-emerald-500/30 rounded-full" />
                <p>The above derivation follows the first principles of Newtonian mechanics. Ensure all coordinate systems are inertial before applying the second-order differential operators.</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Résumé de Section
export const Summary = ({ items, itemsString }: { items?: string[]; itemsString?: string }) => {
  const { language } = useLanguage();
  const t = ADVANCED_STRINGS[language as keyof typeof ADVANCED_STRINGS] || ADVANCED_STRINGS.EN;
  
  let safeItems: string[] = [];
  if (itemsString) {
    safeItems = itemsString.split('|||').map(s => s.trim()).filter(Boolean);
  } else if (Array.isArray(items)) {
    safeItems = items;
  }

  return (
    <div className="my-12 p-10 rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl">
      <h3 className="text-white text-xl font-black mb-8 flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-blue-500" /> {t.summary_title}
      </h3>
      <ul className="space-y-4">
        {safeItems.map((item, i) => (
          <li key={i} className="flex items-start gap-4 text-slate-400 group">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-150 transition-transform" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const getProgressionStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('op_session');
  const loggedIn = session !== 'false' && session !== null;
  return loggedIn ? localStorage : sessionStorage;
};

const GuestFootnote = () => {
  const { language } = useLanguage();
  
  const handleAuthClick = (mode: 'login' | 'signup') => {
    window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: mode }));
  };

  const messages: Record<string, React.ReactNode> = {
    FR: (
      <>
        💡 En mode invité, votre progression est temporaire.{" "}
        <button onClick={() => handleAuthClick('signup')} className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer bg-transparent border-none p-0 inline">
          Créer un compte gratuit
        </button>{" "}
        ou{" "}
        <button onClick={() => handleAuthClick('login')} className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer bg-transparent border-none p-0 inline">
          se connecter
        </button>{" "}
        pour la sauvegarder définitivement et débloquer votre tuteur IA personnel !
      </>
    ),
    EN: (
      <>
        💡 In guest mode, progress is temporary.{" "}
        <button onClick={() => handleAuthClick('signup')} className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer bg-transparent border-none p-0 inline">
          Sign up for free
        </button>{" "}
        or{" "}
        <button onClick={() => handleAuthClick('login')} className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer bg-transparent border-none p-0 inline">
          log in
        </button>{" "}
        to save it permanently and unlock your personal AI tutor!
      </>
    ),
    ES: (
      <>
        💡 En modo invitado, tu progreso es temporal. ¡{" "}
        <button onClick={() => handleAuthClick('signup')} className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer bg-transparent border-none p-0 inline">
          Crea una cuenta gratis
        </button>{" "}
        o{" "}
        <button onClick={() => handleAuthClick('login')} className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer bg-transparent border-none p-0 inline">
          inicia sesión
        </button>{" "}
        para guardarlo permanentemente y desbloquear tu tutor personal de IA!
      </>
    ),
    DE: (
      <>
        💡 Im Gastmodus ist Ihr Fortschritt vorübergehend.{" "}
        <button onClick={() => handleAuthClick('signup')} className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer bg-transparent border-none p-0 inline">
          Registrieren Sie sich kostenlos
        </button>{" "}
        oder{" "}
        <button onClick={() => handleAuthClick('login')} className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer bg-transparent border-none p-0 inline">
          melden Sie sich an
        </button>{" "}
        um ihn dauerhaft zu sichern und Ihren persönlichen KI-Tutor freizuschalten!
      </>
    ),
    ZH: (
      <>
        💡 在游客模式下，您的学习进度是暂时的。{" "}
        <button onClick={() => handleAuthClick('signup')} className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer bg-transparent border-none p-0 inline">
          注册免费账户
        </button>{" "}
        或{" "}
        <button onClick={() => handleAuthClick('login')} className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer bg-transparent border-none p-0 inline">
          登录账户
        </button>{" "}
        以永久保存进度并解锁专属个人AI导师！
      </>
    )
  };

  return (
    <span className="text-[10px] font-medium text-slate-400 block w-full mt-4 border-t border-slate-800/40 pt-3 select-none leading-relaxed">
      {messages[language.toUpperCase()] || messages.EN}
    </span>
  );
};

// Auto-Évaluation (Pré/Post)
export const SelfEval = ({ title, type = "pre" }: { title: string, type?: "pre" | "post" }) => {
  const { language } = useLanguage();
  const t = ADVANCED_STRINGS[language as keyof typeof ADVANCED_STRINGS] || ADVANCED_STRINGS.EN;
  const [selected, setSelected] = React.useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isReadOnly, setIsReadOnly] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.isLoggedIn === 'boolean') {
        setIsLoggedIn(customEvent.detail.isLoggedIn);
      }
    };
    window.addEventListener('op_auth_state_change', handleAuthChange);

    const session = localStorage.getItem('op_session');
    const loggedIn = session === 'true';
    setIsLoggedIn(loggedIn);

    const storage = getProgressionStorage();
    if (storage) {
      const pathname = window.location.pathname;
      const savedLvl = storage.getItem(`op_selfeval_${type}_${pathname}`);
      if (savedLvl) {
        setSelected(parseInt(savedLvl, 10));
      }

      const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
      if (visited.includes(pathname)) {
        setIsReadOnly(true);
        if (!savedLvl) {
          setSelected(5); // Default to highly confident if completed but not rated
        }
      }
    }

    return () => {
      window.removeEventListener('op_auth_state_change', handleAuthChange);
    };
  }, [type]);

  const handleRate = (lvl: number) => {
    if (isReadOnly) return;
    setSelected(lvl);
    
    const storage = getProgressionStorage();
    if (storage) {
      const pathname = window.location.pathname;
      storage.setItem(`op_selfeval_${type}_${pathname}`, String(lvl));

      // Save progression locally for guest & logged-in users alike!
      const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
      if (!visited.includes(pathname)) {
        visited.push(pathname);
        storage.setItem('op_visited_pages', JSON.stringify(visited));
        window.dispatchEvent(new Event('op_progress_updated'));
      }
    }
  };

  return (
    <div className={`my-10 p-8 rounded-3xl bg-blue-600/10 border ${isReadOnly ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-blue-500/30'} transition-all`}>
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-blue-400" />
        <h4 className="text-white font-black uppercase text-xs tracking-widest">
          {type === "pre" ? t.eval_pre_title : t.eval_post_title}
        </h4>
      </div>
      <p className="text-slate-300 mb-6 italic text-sm">
        {type === "pre" 
          ? t.eval_pre_desc.replace("{title}", title)
          : t.eval_post_desc.replace("{title}", title)}
      </p>
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map(lvl => (
          <button 
            key={lvl} 
            onClick={() => handleRate(lvl)}
            disabled={isReadOnly}
            className={`flex-1 h-12 rounded-xl transition-all font-black border ${
              selected === lvl
                ? "bg-blue-600 border-blue-500 text-white cursor-default shadow-lg shadow-blue-600/20"
                : isReadOnly
                  ? "bg-slate-950/40 border-slate-900 text-slate-650 cursor-default opacity-40"
                  : "bg-slate-900 border-slate-800 hover:border-blue-500 text-slate-500 hover:text-white cursor-pointer"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {!isLoggedIn && !isReadOnly && <GuestFootnote />}
    </div>
  );
};

interface SelfAssessmentProps {
  question: string;
  options: string | string[];
  feedback: string | string[];
}

export const SelfAssessment = ({ question, options, feedback }: SelfAssessmentProps) => {
  const { language } = useLanguage();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const resolvedOptions = Array.isArray(options)
    ? options
    : typeof options === 'string'
      ? options.split('|||').map(s => s.trim())
      : [];

  const resolvedFeedback = Array.isArray(feedback)
    ? feedback
    : typeof feedback === 'string'
      ? feedback.split('|||').map(s => s.trim())
      : [];

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname;
    const saved = localStorage.getItem(`op_selfassess_${pathname}_${question.slice(0, 20)}`);
    if (saved !== null) {
      setSelectedIdx(parseInt(saved, 10));
    }
  }, [question]);

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      localStorage.setItem(`op_selfassess_${pathname}_${question.slice(0, 20)}`, String(idx));
    }
  };

  const badgeText = language === 'FR' ? 'Auto-Évaluation' : 'Self-Assessment';

  return (
    <div className="my-10 p-8 rounded-3xl bg-slate-900/40 border border-blue-500/20 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center gap-2 select-none">
        <span className="px-2.5 py-1 bg-blue-600/10 border border-blue-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-blue-400" />
          {badgeText}
        </span>
      </div>

      <div className="space-y-4">
        <p className="text-white text-base font-bold leading-relaxed">{question}</p>

        <div className="grid gap-3">
          {resolvedOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                selectedIdx === i
                  ? "bg-blue-600/25 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-blue-500/50 hover:text-white"
              }`}
            >
              <span>{opt}</span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                selectedIdx === i
                  ? "border-blue-400 bg-blue-500 text-white scale-110"
                  : "border-slate-700 bg-slate-900 group-hover:border-blue-400"
              }`}>
                {selectedIdx === i && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedIdx !== null && resolvedFeedback[selectedIdx] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-slate-300 text-xs md:text-sm leading-relaxed flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                {resolvedFeedback[selectedIdx]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
