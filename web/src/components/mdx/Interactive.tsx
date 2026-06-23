"use client";

import React, { useState, useEffect, useCallback, useId, useRef, createContext, useContext } from 'react';
import { Info, CheckCircle2, XCircle, RefreshCw, Volume2, Sparkles, Loader2, Maximize2 } from 'lucide-react';
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

export interface FillInBlanksContextType {
  isSubmitted: boolean;
  registerInput: (
    id: string,
    answer: string,
    value: string,
    setValue: (val: string) => void,
    setCorrectness: (isCorrect: boolean | null) => void
  ) => () => void;
  updateValue: (id: string, value: string) => void;
}

export const FillInBlanksContext = createContext<FillInBlanksContextType | null>(null);

const extractAnswersFromChildren = (node: React.ReactNode): string[] => {
  if (!node) return [];
  if (Array.isArray(node)) {
    return node.flatMap(n => extractAnswersFromChildren(n));
  }
  if (React.isValidElement(node)) {
    const props = node.props as any;
    const typeName = (node.type as any)?.name || '';
    if (typeName === 'Input') {
      return [props.answer || ''];
    }
    if (props && 'children' in props) {
      return extractAnswersFromChildren(props.children);
    }
  }
  return [];
};

// Composant Texte à Trous (standalone, une seule question, ou block de questions inline)
export const FillInBlanks = ({
  sentence = '',
  answer = '',
  question = '',
  blanks = '',
  isFinal = false,
  children
}: {
  sentence?: string;
  answer?: string;
  question?: string;
  blanks?: string | string[];
  isFinal?: boolean;
  children?: React.ReactNode;
}) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;

  const isFinalExam = React.useMemo(() => {
    if (isFinal) return true;
    if (typeof window === 'undefined') return false;
    const pathname = window.location.pathname.toLowerCase();
    return pathname.includes('/evaluation') || pathname.includes('/exam') || pathname.includes('/final');
  }, [isFinal]);

  // Block/children mode states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registry, setRegistry] = useState<Record<string, {
    answer: string;
    value: string;
    setValue: (v: string) => void;
    setCorrectness: (c: boolean | null) => void;
    index: number;
  }>>({});

  const savedValuesRef = useRef<string[]>([]);
  const savedIsSubmittedRef = useRef<boolean>(false);
  const nextIndexRef = useRef<number>(0);

  // 1. Determine answers list (standalone mode)
  const answersList = React.useMemo(() => {
    if (blanks) {
      if (Array.isArray(blanks)) return blanks;
      try {
        const parsed = JSON.parse(blanks);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return blanks.split(/\|\|\||[,;]+/).map(s => s.trim());
      }
    }
    if (answer) {
      return answer.split('|||').map(s => s.trim());
    }
    return [];
  }, [blanks, answer]);

  // Block answers
  const blockAnswers = React.useMemo(() => {
    if (!children) return [];
    return extractAnswersFromChildren(children);
  }, [children]);

  // Build storage key
  const storageKey = React.useMemo(() => {
    if (typeof window === 'undefined') return '';
    if (children) {
      const hashStr = blockAnswers.join('-');
      const sentenceHash = hashStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return `op_fib_block_${window.location.pathname}_${sentenceHash}`;
    }
    const hashStr = (question || sentence) + answersList.join('-');
    const sentenceHash = hashStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return `op_fib_${window.location.pathname}_${sentenceHash}`;
  }, [question, sentence, answersList, children, blockAnswers]);

  // Load from localStorage for block-level on mount
  useEffect(() => {
    if (children && storageKey) {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
        if (saved && Array.isArray(saved.values)) {
          savedValuesRef.current = saved.values;
          if (saved.isSubmitted === true) {
            setIsSubmitted(true);
            savedIsSubmittedRef.current = true;
          }
        }
      } catch {}
    }
  }, [children, storageKey]);

  // Reset nextIndexRef when children/storageKey changes (e.g. on new render)
  useEffect(() => {
    nextIndexRef.current = 0;
  }, [children, storageKey]);

  const registerInput = useCallback((
    id: string,
    answer: string,
    value: string,
    setValue: (v: string) => void,
    setCorrectness: (c: boolean | null) => void
  ) => {
    const index = nextIndexRef.current++;
    
    // Initialize value and correctness if saved state exists
    let initialValue = value;
    if (savedValuesRef.current && savedValuesRef.current[index] !== undefined) {
      initialValue = savedValuesRef.current[index];
      setValue(initialValue);
      if (savedIsSubmittedRef.current) {
        const correct = initialValue.trim().toLowerCase() === answer.trim().toLowerCase();
        setCorrectness(correct);
      }
    }

    setRegistry(prev => ({
      ...prev,
      [id]: { answer, value: initialValue, setValue, setCorrectness, index }
    }));

    return () => {
      setRegistry(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    };
  }, []);

  const updateValue = useCallback((id: string, value: string) => {
    setRegistry(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], value }
      };
    });
  }, []);

  const checkBlock = () => {
    const sortedItems = Object.values(registry).sort((a, b) => a.index - b.index);
    const valuesArray: string[] = [];

    sortedItems.forEach(item => {
      const correct = item.value.trim().toLowerCase() === item.answer.trim().toLowerCase();
      item.setCorrectness(correct);
      valuesArray.push(item.value);
    });

    setIsSubmitted(true);
    savedIsSubmittedRef.current = true;

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify({
        values: valuesArray,
        isSubmitted: true
      }));
    }
  };

  const handleBlockRetry = () => {
    setIsSubmitted(false);
    savedIsSubmittedRef.current = false;
    savedValuesRef.current = [];
    
    Object.values(registry).forEach(item => {
      item.setValue('');
      item.setCorrectness(null);
    });

    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  const hasUnfilledBlock = React.useMemo(() => {
    return Object.values(registry).some(item => !item.value.trim());
  }, [registry]);

  // 2. Determine segments list (standalone mode)
  const segments = React.useMemo(() => {
    const textToSplit = question || sentence || '';
    if (!textToSplit) return [];
    const placeholderRegex = /_{2,}|-{2,}|\.{3,}|\[\.\.\.\]/g;
    return textToSplit.split(placeholderRegex);
  }, [question, sentence]);

  const numBlanks = Math.min(answersList.length, Math.max(0, segments.length - 1));

  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [inputCorrectness, setInputCorrectness] = useState<boolean[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    if (!children) {
      // Restore per-question saved state for standalone mode
      const storage = getProgressionStorage();
      if (storage && storageKey) {
        try {
          const saved = JSON.parse(storage.getItem(storageKey) || 'null');
          if (saved && Array.isArray(saved.userInputs)) {
            setUserInputs(saved.userInputs);
            if (Array.isArray(saved.inputCorrectness)) {
              setInputCorrectness(saved.inputCorrectness);
            }
            if (saved.isReadOnly === true) {
              setIsReadOnly(true);
            }
          }
        } catch {}
      }
    }

    return () => {
      window.removeEventListener('op_auth_state_change', handleAuthChange);
    };
  }, [storageKey, children]);

  const handleInputChange = (idx: number, val: string) => {
    if (isReadOnly) return;
    setUserInputs(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const check = () => {
    if (isReadOnly) return;
    const correctness = answersList.map((correctAnswer, idx) => {
      const val = (userInputs[idx] || '').trim().toLowerCase();
      const ans = correctAnswer.trim().toLowerCase();
      return val === ans;
    });

    setInputCorrectness(correctness);
    setIsReadOnly(true);

    const storage = getProgressionStorage();
    if (storage && storageKey) {
      storage.setItem(
        storageKey,
        JSON.stringify({
          userInputs,
          inputCorrectness: correctness,
          isReadOnly: true
        })
      );
    }

    const score = correctness.filter(Boolean).length;
    const total = answersList.length;
    if (score === total && storage) {
      const pathname = window.location.pathname;
      const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
      if (!visited.includes(pathname)) {
        visited.push(pathname);
        storage.setItem('op_visited_pages', JSON.stringify(visited));
        window.dispatchEvent(new Event('op_progress_updated'));
      }
    }
  };

  const handleRetry = () => {
    setUserInputs([]);
    setInputCorrectness([]);
    setIsReadOnly(false);
    const storage = getProgressionStorage();
    if (storage && storageKey) {
      storage.removeItem(storageKey);
    }
  };

  const hasUnfilled = React.useMemo(() => {
    for (let i = 0; i < numBlanks; i++) {
      if (!(userInputs[i] || '').trim()) return true;
    }
    return false;
  }, [userInputs, numBlanks]);

  // Block rendering
  if (children) {
    return (
      <FillInBlanksContext.Provider value={{ isSubmitted, registerInput, updateValue }}>
        <div className={`my-4 p-5 rounded-2xl border ${
          isSubmitted
            ? 'border-slate-800 bg-slate-900/10 opacity-90'
            : 'border-slate-800 bg-slate-900/30'
        } transition-all shadow-lg`}>
          <div className="text-slate-300 font-medium leading-relaxed">
            {children}
          </div>

          {!isSubmitted && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={checkBlock}
                disabled={hasUnfilledBlock}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
              >
                {t.validate}
              </button>
            </div>
          )}

          {isSubmitted && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 pt-3">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-xs font-semibold">
                  {language === 'FR' ? 'Exercice complété' : 'Exercise completed'}
                </span>
              </div>
              
              {!isFinalExam && (
                <button
                  onClick={handleBlockRetry}
                  className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {language === 'FR' ? 'Retenter l\'exercice' : 'Retry Exercise'}
                </button>
              )}
            </div>
          )}
          {!isLoggedIn && !isSubmitted && <GuestFootnote />}
        </div>
      </FillInBlanksContext.Provider>
    );
  }

  // Standalone mode rendering
  if (numBlanks === 0) return null;

  const score = inputCorrectness.filter(Boolean).length;
  const total = answersList.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className={`my-4 p-4 rounded-2xl border ${
      isReadOnly
        ? 'border-slate-800 bg-slate-900/10 opacity-90'
        : 'border-slate-800 bg-slate-900/30'
    } transition-all`}>
      <div className="flex flex-wrap items-center gap-y-2 leading-relaxed">
        {segments.map((seg, idx) => {
          if (idx < numBlanks) {
            return (
              <React.Fragment key={idx}>
                <span className="text-slate-300 font-medium">{seg}</span>
                <input
                  value={userInputs[idx] || ''}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  disabled={isReadOnly}
                  className={`bg-slate-950 border ${
                    isReadOnly
                      ? inputCorrectness[idx]
                        ? 'border-emerald-500 text-emerald-300'
                        : 'border-red-500 text-white'
                      : 'border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                  } rounded-lg px-2.5 py-0.5 outline-none transition-all disabled:opacity-75 text-sm mx-1.5 align-middle`}
                  style={{ width: `${Math.max(90, (answersList[idx] || '').length * 10 + 15)}px` }}
                  placeholder={t.placeholder_answer}
                />
              </React.Fragment>
            );
          }
          return <span key={idx} className="text-slate-300 font-medium">{seg}</span>;
        })}
      </div>

      {!isReadOnly && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={check}
            disabled={hasUnfilled}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
          >
            {t.validate}
          </button>
        </div>
      )}

      {isReadOnly && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 pt-3">
          <div className="flex items-center gap-3">
            <div className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider text-center flex items-center gap-1.5 ${
              score === total ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {score === total ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              Score: {score} / {total} ({percentage}%)
            </div>
            <span className="text-slate-400 text-xs font-semibold">
              {score === total 
                ? (language === 'FR' ? 'Validé' : 'Validated')
                : (language === 'FR' ? 'Complété' : 'Completed')}
            </span>
          </div>
          
          {!isFinalExam && (
            <button
              onClick={handleRetry}
              className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {language === 'FR' ? 'Retenter l\'exercice' : 'Retry Exercise'}
            </button>
          )}
        </div>
      )}

      {isReadOnly && score < total && (
        <div className="mt-3 space-y-1.5 border-t border-slate-800/40 pt-2 text-xs">
          <p className="text-slate-400 font-medium">
            {language === 'FR' ? 'Correction :' : 'Correction:'}
          </p>
          {answersList.map((ans, idx) => {
            if (!inputCorrectness[idx]) {
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">#{idx + 1}:</span>
                  <span className="text-red-400 line-through">
                    {userInputs[idx] || (language === 'FR' ? '(vide)' : '(empty)')}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="text-emerald-400 font-bold">{ans}</span>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {!isLoggedIn && !isReadOnly && <GuestFootnote />}
    </div>
  );
};

FillInBlanks.Input = ({ answer = '' }: { answer?: string }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  
  const id = useId();
  const context = useContext(FillInBlanksContext);

  const [val, setVal] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Register in Context on mount
  useEffect(() => {
    if (context) {
      return context.registerInput(id, answer, val, setVal, setIsCorrect);
    }
  }, [context, id, answer]);

  const validate = (v: string) => {
    if (!v.trim()) return;
    setIsCorrect(v.toLowerCase().trim() === answer.toLowerCase().trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (context) return; // Do nothing if in context/block mode
    if (e.key === 'Enter') validate(val);
  };

  const handleBlur = () => {
    if (context) return; // Do nothing if in context/block mode
    if (val.trim()) validate(val);
  };

  const isDisabled = context ? context.isSubmitted : (isCorrect === true);
  const showIncorrectCorrection = context ? (context.isSubmitted && isCorrect === false) : (isCorrect === false);

  const borderClass = context
    ? context.isSubmitted
      ? isCorrect === true
        ? 'border-emerald-500 text-emerald-400 font-semibold'
        : 'border-red-500 text-slate-300'
      : 'border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
    : isCorrect === true
      ? 'border-emerald-500 text-emerald-400 font-semibold'
      : isCorrect === false
        ? 'border-red-500 text-slate-300'
        : 'border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20';

  return (
    <span className="inline-flex flex-col items-start mx-1 align-middle">
      <input
        type="text"
        value={val}
        onChange={(e) => {
          const newVal = e.target.value;
          setVal(newVal);
          if (isCorrect !== null) setIsCorrect(null);
          if (context) {
            context.updateValue(id, newVal);
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={isDisabled}
        className={`bg-slate-950 border ${borderClass} rounded-lg px-2.5 py-0.5 text-sm outline-none transition-all`}
        style={{ width: `${Math.max(80, answer.length * 10 + 20)}px` }}
        placeholder={t.placeholder_answer}
      />
      {showIncorrectCorrection && (
        <span className="text-[10px] text-emerald-400 font-bold mt-0.5 pl-1">
          {language === 'FR' ? '→' : '→'} {answer}
        </span>
      )}
    </span>
  );
};

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

export const FeynmanBox = ({ concept, isFinal = false }: { concept: string; isFinal?: boolean }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const isFinalExam = React.useMemo(() => {
    if (isFinal) return true;
    if (typeof window === 'undefined') return false;
    const pathname = window.location.pathname.toLowerCase();
    return pathname.includes('/evaluation') || pathname.includes('/exam') || pathname.includes('/final');
  }, [isFinal]);

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
      setIsReadOnly(true);
      setIsLoading(false);
      
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
    }, 2000);
  };

  const feynmanDescMap: Record<string, string> = {
    FR: "La technique de Feynman nécessite un tuteur IA personnel pour analyser et valider activement votre rédaction. Un compte gratuit est disponible pour vous permettre de suivre le cursus, enregistrer votre progression et bénéficier de votre tuteur IA personnel !",
    EN: "The Feynman technique requires a personal AI tutor to analyze and validate your explanation. A free account is available to allow you to follow the curriculum, save your progress, and benefit from a personal AI tutor!",
    ES: "La técnica de Feynman requiere un tutor de IA personal para analizar y validar tu explicación. ¡Hay una cuenta gratuita disponible para permitirte seguir el plan de estudios, guardar tu progreso y beneficiarte de un tutor de IA personal!",
    DE: "Die Feynman-Methode erfordert einen persönlichen KI-Tutor, um Ihre Erklärung zu analysieren und zu validieren. Ein kostenloses Konto ist verfügbar, mit dem Sie dem Lehrplan folgen, Ihren Fortschritt speichern und von einem persönlichen KI-Tutor profitieren können!",
    ZH: "费曼学习法需要专属AI导师来分析 and 验证您的解释。我们提供免费账户，让您能够完整体验课程、记录 learning 进度，并享有专属个人AI导师！"
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
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-800/40 pt-3">
          <div className="flex items-center gap-1.5 select-none text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" /> {t.tutor_validated}
          </div>
          {!isFinalExam && (
            <button
              onClick={() => {
                setIsReadOnly(false);
                setText('');
                setFeedback('');
                const storage = getProgressionStorage();
                if (storage) {
                  const pathname = window.location.pathname;
                  const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
                  const filtered = visited.filter((p: string) => p !== pathname);
                  storage.setItem('op_visited_pages', JSON.stringify(filtered));
                  window.dispatchEvent(new Event('op_progress_updated'));
                }
              }}
              className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {language === 'FR' ? 'Retenter l\'exercice' : 'Retry Exercise'}
            </button>
          )}
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
export const PredictOutcome = ({ scenario, options, isFinal = false }: { scenario: string; options?: string[]; isFinal?: boolean }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const safeOptions = Array.isArray(options) ? options : [];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const isFinalExam = React.useMemo(() => {
    if (isFinal) return true;
    if (typeof window === 'undefined') return false;
    const pathname = window.location.pathname.toLowerCase();
    return pathname.includes('/evaluation') || pathname.includes('/exam') || pathname.includes('/final');
  }, [isFinal]);

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
    setIsReadOnly(true); // Lock to read-only after submission

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
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-6 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-200 text-sm"
          >
            <span className="font-bold uppercase text-[10px] block mb-2 tracking-widest">{t.predict_explanation}</span>
            {t.predict_exp_desc}
          </motion.div>
          {!isFinalExam && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setRevealed(false);
                  setSelected(null);
                  setIsReadOnly(false);
                  const storage = getProgressionStorage();
                  if (storage) {
                    const pathname = window.location.pathname;
                    const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
                    const filtered = visited.filter((p: string) => p !== pathname);
                    storage.setItem('op_visited_pages', JSON.stringify(filtered));
                    window.dispatchEvent(new Event('op_progress_updated'));
                  }
                }}
                className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {language === 'FR' ? 'Retenter l\'exercice' : 'Retry Exercise'}
              </button>
            </div>
          )}
        </div>
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

const PREFERRED_VOICES: Record<string, string[]> = {
  'fr': ['Hortense', 'Thomas', 'Microsoft Hortense Desktop', 'Amélie', 'Julie', 'Google français'],
  'en': ['Microsoft Zira Desktop', 'Zira', 'Microsoft David Desktop', 'David', 'Samantha', 'Karen', 'Alex', 'Daniel', 'Google US English', 'Google UK English Male', 'Google UK English Female'],
  'es': ['Microsoft Helena Desktop', 'Helena', 'Microsoft Sabina Desktop', 'Monica', 'Paulina', 'Google español', 'Google español de Estados Unidos'],
  'de': ['Microsoft Hedda Desktop', 'Hedda', 'Microsoft Stefan Desktop', 'Anna', 'Petra', 'Google Deutsch'],
  'zh': ['Microsoft Huihui Desktop', 'Huihui', 'Microsoft Kangkang Desktop', 'Microsoft Yaoyao Desktop', 'Ting-Ting', 'Sinji', 'Google 普通话（中国大陆）', 'Google 粤语（香港）'],
  'pt': ['Microsoft Maria Desktop', 'Maria', 'Microsoft Daniel Desktop', 'Daniel', 'Helia', 'Raissa', 'Google português'],
  'ar': ['Microsoft Naayf Desktop', 'Naayf', 'Hoda', 'Maged', 'Tarik', 'Google العربية'],
  'hi': ['Microsoft Hemant Desktop', 'Hemant', 'Kalpana', 'Google हिन्दी'],
  'ur': ['Microsoft Asif Desktop', 'Asif', 'Google اردو'],
};

// Bouton Speech (TTS Natif)
export const SpeechButton = ({ text }: { text: string }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;

  const speak = (voiceOverride?: SpeechSynthesisVoice | null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = (language || 'EN').toLowerCase();
    const availableVoices = window.speechSynthesis.getVoices();

    let matchedVoice = voiceOverride;
    if (!matchedVoice) {
      const preferred = PREFERRED_VOICES[targetLang] || [];

      // 1. Try preferred voices
      for (const name of preferred) {
        const found = availableVoices.find(v =>
          v.name.toLowerCase().includes(name.toLowerCase())
        );
        if (found) { matchedVoice = found; break; }
      }

      // 2. Try offline system voices
      if (!matchedVoice) {
        matchedVoice = availableVoices.find(v =>
          v.lang.toLowerCase().startsWith(targetLang) && v.localService
        );
      }

      // 3. Try non-Google offline voices
      if (!matchedVoice) {
        matchedVoice = availableVoices.find(v =>
          v.lang.toLowerCase().startsWith(targetLang) && !v.name.toLowerCase().includes('google')
        );
      }

      // 4. Try any voice matching the language
      if (!matchedVoice) {
        matchedVoice = availableVoices.find(v =>
          v.lang.toLowerCase().startsWith(targetLang)
        );
      }
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.error('SpeechButton Synthesis error:', e);
        const failedVoice = matchedVoice;
        if (failedVoice && (failedVoice.name.toLowerCase().includes('google') || !failedVoice.localService)) {
          const localFallback = availableVoices.find(v => 
            v.lang.toLowerCase().startsWith(targetLang) && 
            v.localService && 
            v.name !== failedVoice.name
          );
          if (localFallback) {
            console.log(`SpeechButton TTS Hot-swap: Switching from failed network voice '${failedVoice.name}' to offline voice '${localFallback.name}'`);
            setTimeout(() => {
              speak(localFallback);
            }, 100);
          }
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakClick = (e: React.MouseEvent) => {
    e.preventDefault();
    speak();
  };

  return (
    <button 
      onClick={handleSpeakClick}
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

export const FillInBlanksQuestion = ({ q = '', solutions = [], isFinal = false }: { q?: string; solutions?: string[]; isFinal?: boolean }) => {
  if (!q) return null;
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  
  const [inputs, setInputs] = useState<string[]>(() => Array(solutions.length).fill(''));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const isFinalExam = React.useMemo(() => {
    if (isFinal) return true;
    if (typeof window === 'undefined') return false;
    const pathname = window.location.pathname.toLowerCase();
    return pathname.includes('/evaluation') || pathname.includes('/exam') || pathname.includes('/final');
  }, [isFinal]);

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
          if (saved.isReadOnly === true || saved.isCorrect === true) {
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
    setIsReadOnly(true);

    const storage = getProgressionStorage();
    if (storage && storageKey) {
      storage.setItem(storageKey, JSON.stringify({ inputs, isCorrect: allCorrect, isReadOnly: true }));
    }

    if (allCorrect) {
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

  const handleRetry = () => {
    setInputs(Array(solutions.length).fill(''));
    setIsCorrect(null);
    setIsReadOnly(false);
    const storage = getProgressionStorage();
    if (storage && storageKey) {
      storage.removeItem(storageKey);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isReadOnly) check();
  };

  const handleInputChange = (val: string, idx: number) => {
    if (isReadOnly) return;
    const nextInputs = [...inputs];
    nextInputs[idx] = val;
    setInputs(nextInputs);
    if (isCorrect !== null) {
      setIsCorrect(null);
    }
  };

  const computedCorrectCount = inputs.filter((inp, idx) => inp.toLowerCase().trim() === (solutions[idx] || '').toLowerCase().trim()).length;
  const scorePercent = solutions.length > 0 ? Math.round((computedCorrectCount / solutions.length) * 100) : 0;

  return (
    <div className={`my-6 p-5 rounded-[24px] border ${
      isReadOnly
        ? 'border-slate-800 bg-slate-900/10 opacity-80'
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
          const singleCorrect = isReadOnly ? (val.toLowerCase().trim() === sol.toLowerCase().trim()) : null;
          
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
                    disabled={isReadOnly}
                    className={`bg-slate-950 border ${
                      isReadOnly
                        ? singleCorrect
                          ? 'border-emerald-500 text-emerald-300 font-semibold'
                          : 'border-red-500 text-white'
                        : 'border-slate-700 text-white'
                    } rounded-lg px-2 py-0.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-center`}
                    style={{ width: `${Math.max(90, sol.length * 10 + 20)}px` }}
                    placeholder={t.placeholder_answer}
                  />
                  {isReadOnly && !singleCorrect && (
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

      {!isReadOnly && (
        <div className="flex items-center justify-between gap-4 mt-2">
          <button
            onClick={check}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
          >
            {t.validate}
          </button>
        </div>
      )}

      {isReadOnly && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 pt-4">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-center flex items-center gap-1.5 ${
              isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              Score: {computedCorrectCount} / {solutions.length} ({scorePercent}%)
            </div>
            <span className="text-slate-400 text-xs font-semibold">
              {isCorrect 
                ? (language === 'FR' ? 'Validé' : 'Validated')
                : (language === 'FR' ? 'Complété' : 'Completed')}
            </span>
          </div>
          
          {!isFinalExam && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {language === 'FR' ? 'Retenter l\'exercice' : 'Retry Exercise'}
            </button>
          )}
        </div>
      )}

      {!isLoggedIn && !isReadOnly && <GuestFootnote />}
    </div>
  );
};

