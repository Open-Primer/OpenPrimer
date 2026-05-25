"use client";

import React, { useState } from 'react';
import { Info, CheckCircle2, Volume2 } from 'lucide-react';
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
    listen: "Listen"
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
    listen: "Écouter"
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
    listen: "Escuchar"
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
    listen: "Hören"
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
    listen: "朗读"
  }
};

// Composant Texte à Trous
export const FillInBlanks = ({ sentence, answer }: { sentence: string, answer: string }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
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
        placeholder={t.placeholder_answer}
      />
      <span className="text-slate-300 font-medium">{sentence.split('[...]')[1]}</span>
      <button 
        onClick={check}
        className="px-4 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
      >
        {t.validate}
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
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const analyze = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setFeedback(`${t.feynman_feedback} "${concept}" : ${t.feynman_feedback_text}`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="my-8 p-8 rounded-[40px] bg-indigo-600/5 border border-indigo-600/20">
      <h4 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
        {t.feynman_title} {concept}
      </h4>
      <p className="text-slate-400 text-sm mb-4">{t.feynman_desc}</p>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-all resize-none text-white"
        placeholder={t.feynman_placeholder}
      />
      <button 
        onClick={analyze}
        disabled={isLoading}
        className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
      >
        {isLoading ? t.feynman_submitting : t.feynman_submit}
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
export const PredictOutcome = ({ scenario, options }: { scenario: string, options?: string[] }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className="my-10 p-8 rounded-[40px] bg-amber-600/5 border border-amber-600/20">
      <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
        {t.predict_title}
      </h4>
      <p className="text-slate-200 text-lg font-medium mb-6">{scenario}</p>
      <div className="space-y-3">
        {safeOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full text-left p-4 rounded-2xl border transition-all ${selected === i ? 'bg-amber-600/20 border-amber-500 text-amber-200 cursor-default' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 cursor-pointer'}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!revealed && selected !== null && (
        <button 
          onClick={() => setRevealed(true)}
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
