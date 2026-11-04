"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INTERACTIVE_STRINGS } from '../interactive-strings';
import { getProgressionStorage } from './utils';
import { GuestFootnote } from './GuestFootnote';

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
          {t.fill_blanks_group}
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
              {isCorrect ? t.validated : t.completed}
            </span>
          </div>
          
          {!isFinalExam && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t.retry_exercise}
            </button>
          )}
        </div>
      )}

      {!isLoggedIn && !isReadOnly && <GuestFootnote />}
    </div>
  );
};

