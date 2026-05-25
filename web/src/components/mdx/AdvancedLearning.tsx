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
export const Summary = ({ items }: { items?: string[] }) => {
  const { language } = useLanguage();
  const t = ADVANCED_STRINGS[language as keyof typeof ADVANCED_STRINGS] || ADVANCED_STRINGS.EN;
  const safeItems = Array.isArray(items) ? items : [];

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

// Auto-Évaluation (Pré/Post)
export const SelfEval = ({ title, type = "pre" }: { title: string, type?: "pre" | "post" }) => {
  const { language } = useLanguage();
  const t = ADVANCED_STRINGS[language as keyof typeof ADVANCED_STRINGS] || ADVANCED_STRINGS.EN;

  return (
    <div className="my-10 p-8 rounded-3xl bg-blue-600/10 border border-blue-500/30">
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
          <button key={lvl} className="flex-1 h-12 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-500 hover:text-white font-black transition-all cursor-pointer">
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
};
