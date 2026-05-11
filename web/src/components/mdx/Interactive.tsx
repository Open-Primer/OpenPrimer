"use client";

import React, { useState } from 'react';
import { Info, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Composant Texte à Trous
export const FillInBlanks = ({ sentence, answer }: { sentence: string, answer: string }) => {
  const [input, setInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const check = () => {
    if (input.toLowerCase().trim() === answer.toLowerCase().trim()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="my-8 p-6 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-wrap items-center gap-3">
      <span className="text-slate-300 font-medium">{sentence.split('[...]')[0]}</span>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={`bg-slate-950 border ${isCorrect === true ? 'border-emerald-500' : isCorrect === false ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-1 text-white outline-none transition-all`}
        placeholder="votre réponse..."
      />
      <span className="text-slate-300 font-medium">{sentence.split('[...]')[1]}</span>
      <button 
        onClick={check}
        className="px-4 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-colors"
      >
        Valider
      </button>
      {isCorrect === true && <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-pulse" />}
    </div>
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
