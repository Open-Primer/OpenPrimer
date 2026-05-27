"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { progressService } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    <span className="text-[10px] font-medium text-slate-400 block w-full mt-2 border-t border-slate-800/40 pt-2 select-none leading-relaxed">
      {messages[language.toUpperCase()] || messages.EN}
    </span>
  );
};

interface QuizProps {
  children: React.ReactNode;
}

export const Quiz = ({ children }: QuizProps) => {
  return (
    <div className="my-8 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl">
      <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" /> Knowledge Check
      </h3>
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
};

interface QuestionProps {
  q: string;
  children: React.ReactNode;
}

export const Question = ({ q, children }: QuestionProps) => {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const options = React.Children.toArray(children) as React.ReactElement[];

  useEffect(() => {
    const session = localStorage.getItem('op_session');
    const loggedIn = session !== 'false' && session !== null;
    setIsLoggedIn(loggedIn);

    const storage = getProgressionStorage();
    if (storage) {
      const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
      if (visited.includes(window.location.pathname)) {
        setIsReadOnly(true);
        // Find the index of the correct option to show it as validated
        const correctIdx = options.findIndex((opt: any) => opt.props.correct === true);
        if (correctIdx !== -1) {
          setSelected(correctIdx);
          setIsCorrect(true);
        }
      }
    }
  }, [options]);

  const handleSelect = (index: number, correct: boolean) => {
    if (isReadOnly || selected !== null) return;
    setSelected(index);
    setIsCorrect(correct);

    const storage = getProgressionStorage();
    if (storage) {
      const pathname = window.location.pathname;
      const parts = pathname.split('/');
      const slug = parts[3] || 'Classical_Mechanics';
      
      const key = `op_quiz_attempts_${pathname}`;
      const attempts = JSON.parse(storage.getItem(key) || '{}');
      attempts[q] = correct;
      storage.setItem(key, JSON.stringify(attempts));

      const keys = Object.keys(attempts);
      const totalCorrect = keys.filter(k => attempts[k] === true).length;
      const totalAnswered = keys.length;

      // Note: progressService will log internally to connected DB, but locally we track attempts too
      progressService.recordQuizAnswer(slug, pathname, totalCorrect, totalAnswered);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-slate-100">{q}</p>
      <div className="grid gap-3">
        {options.map((option: any, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index, option.props.correct)}
            disabled={isReadOnly || selected !== null}
            className={cn(
              "p-4 text-left rounded-xl border transition-all duration-200 group flex items-center justify-between",
              isReadOnly || selected !== null
                ? index === selected 
                  ? isCorrect 
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 cursor-default" 
                    : "bg-rose-500/10 border-rose-500/50 text-rose-400 cursor-default"
                  : option.props.correct
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 cursor-default"
                    : "bg-slate-800/30 border-slate-700 opacity-50 cursor-default"
                : "bg-slate-800/30 border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer"
            )}
          >
            <span>{option.props.text}</span>
            {selected === null && !isReadOnly ? (
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
            ) : index === selected ? (
              isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
            ) : option.props.correct ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : null}
          </button>
        ))}
      </div>
      
      {!isLoggedIn && !isReadOnly && <GuestFootnote />}
    </div>
  );
};

export const Option = ({ text, correct = false }: { text: string; correct?: boolean }) => {
  return null; // Logic is handled in Question
};
