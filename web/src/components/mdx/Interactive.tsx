"use client";

import React, { useState } from 'react';
import { Info, CheckCircle2, XCircle, Volume2, Bot, Download, Send, Zap } from 'lucide-react';
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

// Composant Feynman (Expliquez à l'IA)
export const FeynmanBox = ({ concept }: { concept: string }) => {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const analyze = async () => {
    setIsLoading(true);
    // Simulation d'une analyse locale par WebLLM
    setTimeout(() => {
      setFeedback(`Analyse du concept "${concept}" : Votre explication est correcte sur le fond, mais essayez d'utiliser moins de jargon technique.`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="my-8 p-8 rounded-[40px] bg-indigo-600/5 border border-indigo-600/20">
      <h4 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
        Technique de Feynman : {concept}
      </h4>
      <p className="text-slate-400 text-sm mb-4">Expliquez ce concept comme si vous parliez à un enfant de 10 ans.</p>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-all resize-none"
        placeholder="Écrivez votre explication ici..."
      />
      <button 
        onClick={analyze}
        disabled={isLoading}
        className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
      >
        {isLoading ? 'Analyse en cours...' : 'Soumettre mon explication'}
      </button>
      {feedback && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 text-indigo-200 text-sm italic"
        >
          {feedback}
        </motion.div>
      )}
    </div>
  );
};

// Composant Prédiction (Avant la théorie)
export const PredictOutcome = ({ scenario, options }: { scenario: string, options: string[] }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="my-10 p-8 rounded-[40px] bg-amber-600/5 border border-amber-600/20">
      <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
        Défi de Prédiction
      </h4>
      <p className="text-slate-200 text-lg font-medium mb-6">{scenario}</p>
      <div className="space-y-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full text-left p-4 rounded-2xl border transition-all ${selected === i ? 'bg-amber-600/20 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!revealed && selected !== null && (
        <button 
          onClick={() => setRevealed(true)}
          className="mt-6 w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
        >
          Révéler la réponse théorique
        </button>
      )}
      {revealed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-6 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-200 text-sm"
        >
          <span className="font-bold uppercase text-[10px] block mb-2 tracking-widest">Explication</span>
          La réponse dépend des principes de thermodynamique que nous allons explorer dans la section suivante...
        </motion.div>
      )}
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
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button 
      onClick={speak}
      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
    >
      <Volume2 className="w-4 h-4" /> Écouter
    </button>
  );
};
