"use client";

import React, { useState, useEffect } from 'react';
import { Info, CheckCircle2, Volume2, Sparkles, Loader2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const INTERACTIVE_STRINGS = {
  EN: {
    placeholder_answer: "your answer...",
    validate: "Validate",
    feynman_title: "Feynman Technique :",
    feynman_desc: "Explain this concept as if you were speaking to a 10-year-old child.",
    feynman_placeholder: "Write your explanation here...",
    feynman_submitting: "Analyzing explanation...",
    feynman_submit: "Submit my explanation",
    feynman_feedback: "Concept analysis",
    feynman_feedback_text: "Your explanation is conceptually correct, but try to use less technical jargon.",
    predict_title: "Prediction Challenge",
    predict_reveal: "Reveal Theoretical Answer",
    predict_explanation: "Explanation",
    predict_exp_desc: "The answer depends on physical principles we will explore in the next section...",
    listen: "Listen",
    unlock_ai: "Unlock AI Analysis",
    validated: "Validated",
    tutor_validated: "Validation completed by AI Tutor",
    exercise_completed: "Exercise completed successfully during this session.",
    feynman_validated: "Feynman Technique: validated.",
    tutor_recommended: "AI Tutor Recommended",
    signup_free: "Sign up for free"
  },
  FR: {
    placeholder_answer: "votre réponse...",
    validate: "Valider",
    feynman_title: "Technique de Feynman :",
    feynman_desc: "Expliquez ce concept comme si vous parliez à un enfant de 10 ans.",
    feynman_placeholder: "Écrivez votre explication ici...",
    feynman_submitting: "Analyse en cours...",
    feynman_submit: "Soumettre mon explication",
    feynman_feedback: "Analyse du concept",
    feynman_feedback_text: "Votre explication est correcte sur le fond, mais essayez d'utiliser moins de jargon technique.",
    predict_title: "Défi de Prédiction",
    predict_reveal: "Révéler la réponse théorique",
    predict_explanation: "Explication",
    predict_exp_desc: "La réponse dépend des principes physiques que nous allons explorer dans la section suivante...",
    listen: "Écouter",
    unlock_ai: "Débloquer l'Analyse IA",
    validated: "Validé",
    tutor_validated: "Validation validée par le Tuteur IA",
    exercise_completed: "Exercice complété avec succès lors de la session.",
    feynman_validated: "Technique de Feynman : validée.",
    tutor_recommended: "Tuteur IA Recommandé",
    signup_free: "S'inscrire gratuitement"
  },
  ES: {
    placeholder_answer: "tu respuesta...",
    validate: "Validar",
    feynman_title: "Técnica de Feynman:",
    feynman_desc: "Explica este concepto como si estuvieras hablando con un niño de 10 años.",
    feynman_placeholder: "Escribe tu explicación aquí...",
    feynman_submitting: "Analizando...",
    feynman_submit: "Enviar mi explicación",
    feynman_feedback: "Análisis del concepto",
    feynman_feedback_text: "Tu explicación es correcta en el fondo, pero intenta usar menos jerga técnica.",
    predict_title: "Desafío de Predicción",
    predict_reveal: "Revelar Respuesta Teórica",
    predict_explanation: "Explicación",
    predict_exp_desc: "La respuesta depende de los principios físicos que exploraremos en la siguiente sección...",
    listen: "Escuchar",
    unlock_ai: "Desbloquear Análisis de IA",
    validated: "Validado",
    tutor_validated: "Validación completada por el Tutor de IA",
    exercise_completed: "Ejercicio completado con éxito durante esta sesión.",
    feynman_validated: "Técnica de Feynman: validada.",
    tutor_recommended: "Tutor de IA Recomendado",
    signup_free: "Registrarse gratis"
  },
  DE: {
    placeholder_answer: "Ihre Antwort...",
    validate: "Bestätigen",
    feynman_title: "Feynman-Methode:",
    feynman_desc: "Erklären Sie dieses Konzept so, als würden Sie mit einem 10-jährigen Kind sprechen.",
    feynman_placeholder: "Schreiben Sie Ihre Erklärung hier...",
    feynman_submitting: "Analysiere...",
    feynman_submit: "Erklärung einreichen",
    feynman_feedback: "Konzeptanalyse",
    feynman_feedback_text: "Ihre Erklärung ist im Wesentlichen korrekt, aber versuchen Sie, weniger Fachjargon zu verwenden.",
    predict_title: "Vorhersage-Herausforderung",
    predict_reveal: "Theoretische Antwort anzeigen",
    predict_explanation: "Erklärung",
    predict_exp_desc: "Die Antwort hängt von den physikalischen Prinzipien ab, die wir im nächsten Abschnitt untersuchen werden...",
    listen: "Hören",
    unlock_ai: "KI-Analyse freischalten",
    validated: "Validiert",
    tutor_validated: "Validierung durch KI-Tutor abgeschlossen",
    exercise_completed: "Übung in dieser Sitzung erfolgreich abgeschlossen.",
    feynman_validated: "Feynman-Methode: validiert.",
    tutor_recommended: "KI-Tutor empfohlen",
    signup_free: "Kostenlos registrieren"
  },
  ZH: {
    placeholder_answer: "你的回答...",
    validate: "验证",
    feynman_title: "费曼学习法：",
    feynman_desc: "用十岁孩子能听懂的话解释这个概念。",
    feynman_placeholder: "在这里写下你的解释...",
    feynman_submitting: "正在分析解释...",
    feynman_submit: "提交我的解释",
    feynman_feedback: "概念分析",
    feynman_feedback_text: "您的解释在概念上是正确的，但请尽量减少使用专业术语。",
    predict_title: "预测挑战",
    predict_reveal: "揭晓理论答案",
    predict_explanation: "解释",
    predict_exp_desc: "答案取决于我们将在下一节中探索的物理原理...",
    listen: "朗读",
    unlock_ai: "解锁 AI 分析",
    validated: "已验证",
    tutor_validated: "已由 AI 导师完成验证",
    exercise_completed: "此章节练习已成功完成。",
    feynman_validated: "费曼学习法：已验证。",
    tutor_recommended: "推荐 AI 导师",
    signup_free: "免费注册"
  }
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
    <span className="text-[10px] font-medium text-slate-400 block w-full mt-2 border-t border-slate-800/40 pt-2 select-none">
      {messages[language.toUpperCase()] || messages.EN}
    </span>
  );
};

// Composant Texte à Trous (standalone, une seule question)
export const FillInBlanks = ({ sentence = '', answer = '' }: { sentence?: string, answer?: string }) => {
  if (!sentence) return null;
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  const [input, setInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Build a per-question storage key using pathname + a hash of the sentence
  const storageKey = React.useMemo(() => {
    if (typeof window === 'undefined') return '';
    const sentenceHash = sentence.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return `op_fib_${window.location.pathname}_${sentenceHash}`;
  }, [sentence]);

  useEffect(() => {
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

    // Restore per-question saved state (input + correctness)
    const storage = getProgressionStorage();
    if (storage && storageKey) {
      try {
        const saved = JSON.parse(storage.getItem(storageKey) || 'null');
        if (saved && typeof saved.input === 'string') {
          setInput(saved.input);
          if (typeof saved.isCorrect === 'boolean') {
            setIsCorrect(saved.isCorrect);
          }
          // Only lock the field if the answer was correct
          if (saved.isCorrect === true) {
            setIsReadOnly(true);
          }
        }
      } catch {
        // Ignore malformed stored state
      }
    }

    return () => {
      window.removeEventListener('op_auth_state_change', handleAuthChange);
    };
  }, [storageKey]);

  const check = () => {
    if (isReadOnly) return;
    const correct = input.toLowerCase().trim() === answer.toLowerCase().trim();
    setIsCorrect(correct);

    // Persist the exact state (input + correctness) for this question
    const storage = getProgressionStorage();
    if (storage && storageKey) {
      storage.setItem(storageKey, JSON.stringify({ input, isCorrect: correct }));
    }

    // Mark page as visited only on first correct answer
    if (correct) {
      setIsReadOnly(true);
      if (storage) {
        const pathname = window.location.pathname;
        const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
        if (!visited.includes(pathname)) {
          visited.push(pathname);
          storage.setItem('op_visited_pages', JSON.stringify(visited));
          window.dispatchEvent(new Event('op_progress_updated'));
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isCorrect === null && !isReadOnly) check();
  };

  return (
    <div className={`my-4 p-4 rounded-2xl border ${
      isCorrect === true || isReadOnly
        ? 'border-emerald-500/30 bg-emerald-500/5'
        : isCorrect === false
          ? 'border-red-500/25 bg-red-500/5'
          : 'border-slate-800 bg-slate-900/30'
    } transition-all`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-300 font-medium">{sentence ? sentence.split('[...]')[0] : ''}</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`bg-slate-950 border ${
            isCorrect || isReadOnly
              ? 'border-emerald-500 text-emerald-300'
              : isCorrect === false
                ? 'border-red-500 text-white'
                : 'border-slate-700 text-white'
          } rounded-lg px-3 py-1 outline-none transition-all disabled:opacity-70 text-sm`}
          placeholder={t.placeholder_answer}
          disabled={isReadOnly || isCorrect !== null}
        />
        <span className="text-slate-300 font-medium">{sentence ? sentence.split('[...]')[1] : ''}</span>

        {isCorrect === null && !isReadOnly && (
          <button
            onClick={check}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
          >
            {t.validate}
          </button>
        )}

        {(isReadOnly && isCorrect === true) && (
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 flex items-center gap-1.5 select-none">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.validated || (language === 'FR' ? 'Validé' : 'Validated')}
          </span>
        )}
      </div>

      {/* On error only: show the correct answer, no score, no per-answer tutor comment */}
      {isCorrect === false && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-slate-400">{language === 'FR' ? 'Bonne réponse :' : 'Correct answer:'}</span>
          <span className="text-emerald-400 font-bold">{answer}</span>
        </div>
      )}

      {!isLoggedIn && !isReadOnly && <GuestFootnote />}
    </div>
  );
};

// Inline sub-component for paragraph fill-in-the-blanks
// On validation (Enter/blur): correct → green border + checkmark overlay; wrong → red border + show correct answer below
FillInBlanks.Input = ({ answer = '' }: { answer?: string }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  const [val, setVal] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const validate = (v: string) => {
    if (!v.trim()) return;
    setIsCorrect(v.toLowerCase().trim() === answer.toLowerCase().trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') validate(val);
  };

  const handleBlur = () => {
    if (val.trim()) validate(val);
  };

  return (
    <span className="inline-flex flex-col items-start mx-1 align-middle">
      <input
        type="text"
        value={val}
        onChange={(e) => { setVal(e.target.value); if (isCorrect !== null) setIsCorrect(null); }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={isCorrect === true}
        className={`bg-slate-950 border ${
          isCorrect === true
            ? 'border-emerald-500 text-emerald-400 font-semibold'
            : isCorrect === false
              ? 'border-red-500 text-slate-300'
              : 'border-slate-700 text-white'
        } rounded-lg px-2.5 py-0.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20`}
        style={{ width: `${Math.max(80, answer.length * 10 + 20)}px` }}
        placeholder={t.placeholder_answer}
      />
      {/* On error: show only the correct answer, not the wrong one */}
      {isCorrect === false && (
        <span className="text-[10px] text-emerald-400 font-bold mt-0.5 pl-1">
          {language === 'FR' ? '→' : '→'} {answer}
        </span>
      )}
    </span>
  );
};

// Composant Méta-Commentaire
export const MetaNote = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="my-10 p-8 rounded-[40px] bg-blue-600/5 border border-blue-600/20 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Info className="w-12 h-12 text-blue-500" />
    </div>
    <h4 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {title}
    </h4>
    <div className="text-slate-300 italic text-lg leading-relaxed">
      {children}
    </div>
  </div>
);

// Composant Feynman (Expliquez à l'IA)
export const FeynmanBox = ({ concept }: { concept: string }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
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
      const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
      if (visited.includes(window.location.pathname)) {
        setIsReadOnly(true);
        setText(t.exercise_completed);
        setFeedback(t.feynman_validated);
      }
    }

    return () => {
      window.removeEventListener('op_auth_state_change', handleAuthChange);
    };
  }, [language, t]);

  const analyze = async () => {
    if (isReadOnly) return;
    if (!isLoggedIn) {
      window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: 'signup' }));
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setFeedback(`${t.feynman_feedback} "${concept}" : ${t.feynman_feedback_text}`);
      setIsLoading(false);
    }, 2000);
  };

  const feynmanDescMap: Record<string, string> = {
    FR: "La technique de Feynman nécessite un tuteur IA personnel pour analyser et valider activement votre rédaction. Un compte gratuit est disponible pour vous permettre de suivre le cursus, enregistrer votre progression et bénéficier de votre tuteur IA personnel !",
    EN: "The Feynman technique requires a personal AI tutor to analyze and validate your explanation. A free account is available to allow you to follow the curriculum, save your progress, and benefit from a personal AI tutor!",
    ES: "La técnica de Feynman requiere un tutor de IA personal para analizar y validar tu explicación. ¡Hay una cuenta gratuita disponible para permitirte seguir el plan de estudios, guardar tu progreso y beneficiarte de un tutor de IA personal!",
    DE: "Die Feynman-Methode erfordert einen persönlichen KI-Tutor, um Ihre Erklärung zu analysieren und zu validieren. Ein kostenloses Konto ist verfügbar, mit dem Sie dem Lehrplan folgen, Ihren Fortschritt speichern und von einem persönlichen KI-Tutor profitieren können!",
    ZH: "费曼学习法需要专属AI导师来分析和验证您的解释。我们提供免费账户，让您能够完整体验课程、记录学习进度，并享有专属个人AI导师！"
  };

  const feynmanDesc = feynmanDescMap[language.toUpperCase()] || feynmanDescMap.EN;

  return (
    <div className={`my-8 p-8 rounded-[40px] bg-indigo-600/5 border ${isReadOnly ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-indigo-600/20'} relative overflow-hidden`}>
      <h4 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
        {t.feynman_title} {concept}
      </h4>
      <p className="text-slate-400 text-sm mb-4">{t.feynman_desc}</p>
      
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-all resize-none text-white disabled:opacity-60"
        placeholder={t.feynman_placeholder}
        disabled={!isLoggedIn || isReadOnly}
      />
      
      {!isReadOnly && (
        <button 
          onClick={analyze}
          disabled={isLoading}
          className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
        >
          {!isLoggedIn ? t.unlock_ai : isLoading ? t.feynman_submitting : t.feynman_submit}
        </button>
      )}

      {isReadOnly && (
        <div className="mt-4 flex items-center gap-1.5 select-none text-emerald-400 font-bold text-xs">
          <CheckCircle2 className="w-4 h-4" /> {t.tutor_validated}
        </div>
      )}

      {feedback && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 text-indigo-200 text-sm italic"
        >
          {feedback}
        </motion.div>
      )}

      {!isLoggedIn && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col justify-center items-center p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 animate-pulse">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div>
            <h5 className="text-sm font-black text-white">{t.tutor_recommended}</h5>
            <p className="text-[11px] text-slate-300 max-w-[320px] mt-2 leading-relaxed px-4">
              {feynmanDesc}
            </p>
          </div>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: 'signup' }))}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            {t.signup_free}
          </button>
        </div>
      )}
    </div>
  );
};

// Composant Prédiction (Avant la théorie)
export const PredictOutcome = ({ scenario, options }: { scenario: string, options?: string[] }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const safeOptions = Array.isArray(options) ? options : [];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
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
      const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
      if (visited.includes(window.location.pathname)) {
        setIsReadOnly(true);
        setSelected(0); // Mock first selected
        setRevealed(true);
      }
    }

    return () => {
      window.removeEventListener('op_auth_state_change', handleAuthChange);
    };
  }, []);

  const handleSelect = (idx: number) => {
    if (isReadOnly) return;
    setSelected(idx);
  };

  const revealPrediction = () => {
    if (isReadOnly) return;
    setRevealed(true);

    // Save progression in correct storage adapter
    const storage = getProgressionStorage();
    if (storage) {
      const pathname = window.location.pathname;
      const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
      if (!visited.includes(pathname)) {
        visited.push(pathname);
        storage.setItem('op_visited_pages', JSON.stringify(visited));
        window.dispatchEvent(new Event('op_progress_updated'));
      }
    }
  };

  return (
    <div className={`my-10 p-8 rounded-[40px] bg-amber-600/5 border ${isReadOnly ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-600/20'} relative overflow-hidden transition-all`}>
      <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
        {t.predict_title}
      </h4>
      <p className="text-slate-200 text-lg font-medium mb-6">{scenario}</p>
      <div className="space-y-3">
        {safeOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={isReadOnly}
            className={`w-full text-left p-4 rounded-2xl border transition-all ${selected === i ? 'bg-amber-600/20 border-amber-500 text-amber-200 cursor-default' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 cursor-pointer disabled:opacity-50'}`}
          >
            {opt}
          </button>
        ))}
      </div>
      
      {!revealed && selected !== null && (
        <button 
          onClick={revealPrediction}
          className="mt-6 w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
        >
          {t.predict_reveal}
        </button>
      )}
      
      {revealed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-6 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-200 text-sm"
        >
          <span className="font-bold uppercase text-[10px] block mb-2 tracking-widest">{t.predict_explanation}</span>
          {t.predict_exp_desc}
        </motion.div>
      )}

      {!isLoggedIn && !isReadOnly && <GuestFootnote />}
    </div>
  );
};

// Composant Texte Bilingue (Duolingo Style)
export const BilingualText = ({ source, target, lang }: { source: string, target: string, lang: string }) => {
  const [showTarget, setShowTarget] = useState(false);

  return (
    <div 
      onMouseEnter={() => setShowTarget(true)}
      onMouseLeave={() => setShowTarget(false)}
      className="my-4 p-4 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-blue-500/50 transition-all cursor-help relative group"
    >
      <p className="text-slate-200 text-lg leading-relaxed">{source}</p>
      <AnimatePresence>
        {showTarget && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 border-t border-slate-800 mt-2">
              <span className="text-[9px] font-black uppercase text-blue-500 tracking-tighter mr-2">{lang}</span>
              <span className="text-slate-500 italic">{target}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Widget Iframe (PhET, GeoGebra)
export const IframeWidget = ({ src, title }: { src: string, title: string }) => (
  <div className="my-10 overflow-hidden rounded-[40px] border border-slate-800 bg-slate-950">
    <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{title}</span>
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-500/20" />
        <div className="w-2 h-2 rounded-full bg-amber-500/20" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
      </div>
    </div>
    <iframe 
      src={src}
      className="w-full aspect-video"
      allowFullScreen
      loading="lazy"
    />
  </div>
);

// Bouton Speech (TTS Natif)
export const SpeechButton = ({ text }: { text: string }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button 
      onClick={speak}
      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer animate-none"
    >
      <Volume2 className="w-4 h-4" /> {t.listen}
    </button>
  );
};

interface ExternalSandboxProps {
  url: string;
  title: string;
  type?: 'phet' | 'codesandbox' | 'timeline' | 'generic';
}

export const ExternalSandbox = ({ url, title, type = 'generic' }: ExternalSandboxProps) => {
  const { language } = useLanguage();
  const [isReachable, setIsReachable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const testReachability = async () => {
      try {
        const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
        if (active) {
          setIsReachable(true);
        }
      } catch (err) {
        if (active) {
          setIsReachable(false);
        }
      }
    };
    testReachability();
    return () => {
      active = false;
    };
  }, [url]);

  if (isReachable === false) {
    return null;
  }

  const typeLabels = {
    phet: language === 'FR' ? 'Simulation Scientifique (PhET)' : 'Scientific Simulation (PhET)',
    codesandbox: language === 'FR' ? 'Bac à Sable (Sandbox de Code)' : 'Code Sandbox',
    timeline: language === 'FR' ? 'Frise Chronologique Interactive' : 'Interactive Timeline',
    generic: language === 'FR' ? 'Environnement Interactif' : 'Interactive Sandbox'
  };

  const currentLabel = typeLabels[type] || typeLabels.generic;

  return (
    <div className="my-10 p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/85 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
              {currentLabel}
            </span>
            <h4 className="text-sm font-bold text-slate-100">{title}</h4>
          </div>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-white transition-all text-slate-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          {language === 'FR' ? 'Plein écran' : 'Fullscreen'}
        </a>
      </div>

      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10 space-y-2">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            <span className="text-xs text-slate-400 font-medium">
              {language === 'FR' ? 'Chargement de la simulation...' : 'Loading simulation...'}
            </span>
          </div>
        )}
        <iframe 
          src={url}
          title={title}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

export const FillInBlanksQuestion = ({ q = '', solutions = [] }: { q?: string; solutions?: string[] }) => {
  if (!q) return null;
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  
  const [inputs, setInputs] = useState<string[]>(() => Array(solutions.length).fill(''));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const segments = React.useMemo(() => {
    return q.split(/_{3,}|\[\.\.\.\]/g);
  }, [q]);

  const storageKey = React.useMemo(() => {
    if (typeof window === 'undefined') return '';
    const qHash = q.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return `op_fibq_${window.location.pathname}_${qHash}`;
  }, [q]);

  useEffect(() => {
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
    if (storage && storageKey) {
      try {
        const saved = JSON.parse(storage.getItem(storageKey) || 'null');
        if (saved && Array.isArray(saved.inputs)) {
          setInputs(saved.inputs);
          if (typeof saved.isCorrect === 'boolean') {
            setIsCorrect(saved.isCorrect);
          }
          if (saved.isCorrect === true) {
            setIsReadOnly(true);
          }
        }
      } catch {
        // ignore
      }
    }

    return () => {
      window.removeEventListener('op_auth_state_change', handleAuthChange);
    };
  }, [storageKey]);

  const check = () => {
    if (isReadOnly) return;
    const results = inputs.map((inp, idx) => {
      const sol = solutions[idx] || '';
      return inp.toLowerCase().trim() === sol.toLowerCase().trim();
    });
    const allCorrect = results.every(r => r === true);
    setIsCorrect(allCorrect);

    const storage = getProgressionStorage();
    if (storage && storageKey) {
      storage.setItem(storageKey, JSON.stringify({ inputs, isCorrect: allCorrect }));
    }

    if (allCorrect) {
      setIsReadOnly(true);
      if (storage) {
        const pathname = window.location.pathname;
        const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
        if (!visited.includes(pathname)) {
          visited.push(pathname);
          storage.setItem('op_visited_pages', JSON.stringify(visited));
          window.dispatchEvent(new Event('op_progress_updated'));
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isCorrect !== true && !isReadOnly) check();
  };

  const handleInputChange = (val: string, idx: number) => {
    const nextInputs = [...inputs];
    nextInputs[idx] = val;
    setInputs(nextInputs);
    if (isCorrect !== null) {
      setIsCorrect(null);
    }
  };

  return (
    <div className={`my-6 p-5 rounded-[24px] border ${
      isCorrect === true || isReadOnly
        ? 'border-emerald-500/30 bg-emerald-500/5'
        : isCorrect === false
          ? 'border-red-500/25 bg-red-500/5'
          : 'border-slate-800 bg-slate-900/30'
    } transition-all duration-300`}>
      <div className="flex items-center gap-2 text-blue-400 mb-3 select-none">
        <Sparkles className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-black uppercase tracking-wider">
          {language === 'FR' ? 'Complétez les espaces vides' : 'Fill in the blanks'}
        </span>
      </div>
      
      <div className="text-slate-300 font-medium leading-relaxed mb-4">
        {segments.map((seg, idx) => {
          const showInput = idx < solutions.length;
          const sol = solutions[idx] || '';
          const val = inputs[idx] || '';
          const singleCorrect = isCorrect === null ? null : (val.toLowerCase().trim() === sol.toLowerCase().trim());
          
          return (
            <React.Fragment key={idx}>
              <span>{seg}</span>
              {showInput && (
                <span className="inline-flex flex-col items-center mx-1 align-middle relative group">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleInputChange(e.target.value, idx)}
                    onKeyDown={handleKeyDown}
                    disabled={isReadOnly || isCorrect === true}
                    className={`bg-slate-950 border ${
                      isCorrect === true || isReadOnly
                        ? 'border-emerald-500 text-emerald-300 font-semibold'
                        : singleCorrect === false
                          ? 'border-red-500 text-white'
                          : 'border-slate-700 text-white'
                    } rounded-lg px-2 py-0.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-center`}
                    style={{ width: `${Math.max(90, sol.length * 10 + 20)}px` }}
                    placeholder={t.placeholder_answer}
                  />
                  {singleCorrect === false && (
                    <span className="text-[10px] text-emerald-400 font-bold mt-0.5 animate-fade-in">
                      → {sol}
                    </span>
                  )}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4 mt-2">
        {isCorrect !== true && !isReadOnly ? (
          <button
            onClick={check}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
          >
            {t.validate}
          </button>
        ) : (
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 flex items-center gap-1.5 select-none">
            <CheckCircle2 className="w-4 h-4" />
            {t.validated || (language === 'FR' ? 'Validé' : 'Validated')}
          </span>
        )}
      </div>

      {!isLoggedIn && !isReadOnly && <GuestFootnote />}
    </div>
  );
};

