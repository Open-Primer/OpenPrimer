"use client";

import React, { useState, useEffect, useCallback, useId, useRef, createContext, useContext } from 'react';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INTERACTIVE_STRINGS } from '../interactive-strings';
import { getProgressionStorage } from './utils';
import { GuestFootnote } from './GuestFootnote';

import {
  type FillInBlanksContextType,
  FillInBlanksContext,
  extractAnswersFromChildren,
  FillInBlanksInput
} from './FillInBlanksInput';

export {
  type FillInBlanksContextType,
  FillInBlanksContext,
  extractAnswersFromChildren,
  FillInBlanksInput
};

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
    const safeQuestion = typeof question === 'string' ? question : (question ? String(question) : '');
    const safeSentence = typeof sentence === 'string' ? sentence : (sentence ? String(sentence) : '');
    const hashStr = (safeQuestion || safeSentence) + answersList.join('-');
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
    let allCorrect = true;

    sortedItems.forEach(item => {
      const correct = item.value.trim().toLowerCase() === item.answer.trim().toLowerCase();
      item.setCorrectness(correct);
      valuesArray.push(item.value);
      if (!correct) allCorrect = false;
    });

    setIsSubmitted(true);
    savedIsSubmittedRef.current = true;

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify({
        values: valuesArray,
        isSubmitted: true
      }));
    }

    // Dispatch Cognitive Bridge Event
    if (typeof window !== 'undefined') {
      const selectedStr = sortedItems.map(item => item.value).join(', ');
      const correctStr = sortedItems.map(item => item.answer).join(', ');
      
      const event = new CustomEvent('op_exercise_completed', {
        detail: {
          type: 'fill_in_blanks',
          success: allCorrect,
          question: t.fill_blanks_group,
          selectedAnswer: selectedStr,
          correctAnswer: correctStr,
          explanation: allCorrect ? t.blanks_correct : t.blanks_wrong
        }
      });
      window.dispatchEvent(event);
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
    let textToSplit = '';
    if (question && typeof question === 'string') {
      textToSplit = question;
    } else if (sentence && typeof sentence === 'string') {
      textToSplit = sentence;
    } else if (question) {
      textToSplit = String(question);
    } else if (sentence) {
      textToSplit = String(sentence);
    }

    if (!textToSplit || textToSplit === '[object Object]') {
      return [];
    }

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

    // Dispatch Cognitive Bridge Event
    if (typeof window !== 'undefined') {
      const isSuccess = correctness.every(Boolean);
      const safeQuestion = typeof question === 'string' ? question : (question ? String(question) : '');
      const safeSentence = typeof sentence === 'string' ? sentence : (sentence ? String(sentence) : '');
      const exerciseText = safeQuestion || safeSentence || 'Texte à trous';

      const event = new CustomEvent('op_exercise_completed', {
        detail: {
          type: 'fill_in_blanks',
          success: isSuccess,
          question: exerciseText,
          selectedAnswer: userInputs.join(', '),
          correctAnswer: answersList.join(', '),
          explanation: isSuccess ? t.words_correct : t.words_incorrect
        }
      });
      window.dispatchEvent(event);
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
                  {t.exercise_completed_label}
                </span>
              </div>
              
              {!isFinalExam && (
                <button
                  onClick={handleBlockRetry}
                  className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t.retry_exercise}
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
              {score === total ? t.validated : t.completed}
            </span>
          </div>
          
          {!isFinalExam && (
            <button
              onClick={handleRetry}
              className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t.retry_exercise}
            </button>
          )}
        </div>
      )}

      {isReadOnly && score < total && (
        <div className="mt-3 space-y-1.5 border-t border-slate-800/40 pt-2 text-xs">
          <p className="text-slate-400 font-medium">
            {t.correction}
          </p>
          {answersList.map((ans, idx) => {
            if (!inputCorrectness[idx]) {
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">#{idx + 1}:</span>
                  <span className="text-red-400 line-through">
                    {userInputs[idx] || t.empty}
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

FillInBlanks.Input = FillInBlanksInput;
