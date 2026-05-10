"use client";

import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface QuizProps {
  children: React.ReactNode;
}

export const Quiz = ({ children }: QuizProps) => {
  return (
    <div className="my-8 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl">
      <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" /> Test de Connaissances
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
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const options = React.Children.toArray(children) as React.ReactElement[];

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null) return;
    setSelected(index);
    setIsCorrect(correct);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-slate-100">{q}</p>
      <div className="grid gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index, option.props.correct)}
            disabled={selected !== null}
            className={cn(
              "p-4 text-left rounded-xl border transition-all duration-200 group flex items-center justify-between",
              selected === null 
                ? "bg-slate-800/30 border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5"
                : index === selected 
                  ? isCorrect 
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/50 text-rose-400"
                  : option.props.correct && selected !== null
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                    : "bg-slate-800/30 border-slate-700 opacity-50"
            )}
          >
            <span>{option.props.text}</span>
            {selected === null ? (
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
            ) : index === selected ? (
              isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
            ) : option.props.correct ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};

export const Option = ({ text, correct = false }: { text: string; correct?: boolean }) => {
  return null; // Logic is handled in Question
};
