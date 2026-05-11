"use client";

import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, BookOpen, CheckCircle2, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Problème Résolu / Démonstration
export const SolvedProblem = ({ title, problem, solution }: { title: string, problem: string, solution: string }) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="my-10 rounded-[32px] overflow-hidden border border-emerald-500/20 bg-emerald-500/5">
      <div className="p-8 border-b border-emerald-500/10">
        <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" /> Problème Résolu : {title}
        </h4>
        <div className="text-slate-200 text-lg leading-relaxed">{problem}</div>
      </div>
      <button 
        onClick={() => setShowSolution(!showSolution)}
        className="w-full p-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500/80 hover:bg-emerald-500/5 transition-colors"
      >
        {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {showSolution ? "Masquer la Solution" : "Afficher la Solution Détaillée"}
      </button>
      <AnimatePresence>
        {showSolution && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-8 bg-slate-950/50 border-t border-emerald-500/10 text-slate-300 italic"
          >
            {solution}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Résumé de Section
export const Summary = ({ items }: { items: string[] }) => (
  <div className="my-12 p-10 rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl">
    <h3 className="text-white text-xl font-black mb-8 flex items-center gap-3">
      <BookOpen className="w-6 h-6 text-blue-500" /> Points Clés à Retenir
    </h3>
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4 text-slate-400 group">
          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-150 transition-transform" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Auto-Évaluation (Pré/Post)
export const SelfEval = ({ title, type = "pre" }: { title: string, type?: "pre" | "post" }) => (
  <div className="my-10 p-8 rounded-3xl bg-blue-600/10 border border-blue-500/30">
    <div className="flex items-center gap-3 mb-6">
      <Target className="w-6 h-6 text-blue-400" />
      <h4 className="text-white font-black uppercase text-xs tracking-widest">
        {type === "pre" ? "Auto-Évaluation de Départ" : "Bilan de Fin de Cursus"}
      </h4>
    </div>
    <p className="text-slate-300 mb-6 italic text-sm">
      {type === "pre" 
        ? `Évaluez votre niveau initial sur "${title}" avant de commencer.` 
        : `Bravo ! Vous avez terminé "${title}". Validez vos acquis.`}
    </p>
    <div className="flex gap-4">
      {[1, 2, 3, 4, 5].map(lvl => (
        <button key={lvl} className="flex-1 h-12 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-500 hover:text-white font-black transition-all">
          {lvl}
        </button>
      ))}
    </div>
  </div>
);
