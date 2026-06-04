"use client";

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, Play } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DiagnosticQuizProps {
  question: string;
  options?: string[] | string;
  correctIndex?: number | string;
  targetSectionId: string;
  sectionTitle: string;
}

const STRINGS = {
  EN: {
    badge: "Adaptive Diagnostic Check",
    prompt: "Test your knowledge to skip this section:",
    success: "🏆 Mastered! You scored 100% on this diagnostic check. You can safely skip this section.",
    fail: "❌ Recommended: We advise reading this section to build a solid foundation.",
    skip_btn: "Skip directly to",
    submit: "Check Answer",
    reset: "Retry Check"
  },
  FR: {
    badge: "Test Diagnostique Adaptatif",
    prompt: "Testez vos connaissances pour passer directement à la suite :",
    success: "🏆 Notion Maîtrisée ! Vous avez réussi le test diagnostique. Vous pouvez sauter cette section en toute sécurité.",
    fail: "❌ Recommandation : Nous vous conseillons de lire cette section pour acquérir les bases nécessaires.",
    skip_btn: "Passer directement à",
    submit: "Vérifier",
    reset: "Réessayer"
  },
  ES: {
    badge: "Prueba de Diagnóstico Adaptativa",
    prompt: "Pon a prueba tus conocimientos para omitir esta sección:",
    success: "🏆 ¡Dominado! Obtuviste un 100% en esta prueba de diagnóstico. Puedes omitir esta sección de manera segura.",
    fail: "❌ Recomendado: Te aconsejamos leer esta sección para construir una base sólida.",
    skip_btn: "Omitir e ir a",
    submit: "Comprobar",
    reset: "Reintentar"
  },
  DE: {
    badge: "Adaptiver Diagnosetest",
    prompt: "Testen Sie Ihr Wissen, um diesen Abschnitt zu überspringen:",
    success: "🏆 Meisterhaft! Sie haben 100 % in diesem Diagnosetest erreicht. Sie können diesen Abschnitt sicher überspringen.",
    fail: "❌ Empfohlen: Wir empfehlen Ihnen, diesen Abschnitt zu lesen, um eine solide Grundlage zu schaffen.",
    skip_btn: "Direkt springen zu",
    submit: "Prüfen",
    reset: "Wiederholen"
  },
  ZH: {
    badge: "自适应诊断测试",
    prompt: "测试您的知识以跳过此部分：",
    success: "🏆 已掌握！您在此诊断测试中获得了 100% 的分数。您可以安全地跳过此部分。",
    fail: "❌ 建议：我们建议您阅读此部分以建立坚实的基础。",
    skip_btn: "直接跳过至",
    submit: "检查答案",
    reset: "重试"
  }
};

export const DiagnosticQuiz = ({
  question,
  options,
  correctIndex,
  targetSectionId,
  sectionTitle
}: DiagnosticQuizProps) => {
  const { language } = useLanguage();
  const t = STRINGS[language as keyof typeof STRINGS] || STRINGS.EN;

  console.log("DiagnosticQuiz Received Props:", { question, options, correctIndex, targetSectionId, sectionTitle });

  const resolvedOptions = Array.isArray(options)
    ? options
    : typeof options === 'string' && options
      ? options.split('|||')
      : [];

  const resolvedCorrectIndex = typeof correctIndex === 'number'
    ? correctIndex
    : typeof correctIndex === 'string'
      ? parseInt(correctIndex, 10)
      : 0;

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    setIsCorrect(selectedIdx === resolvedCorrectIndex);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const handleSkip = () => {
    const el = document.getElementById(targetSectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback scroll to hash
      window.location.hash = targetSectionId;
    }
  };

  return (
    <div className="my-8 p-6 bg-slate-950/40 border border-violet-500/20 rounded-3xl backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 bg-violet-600/10 border border-violet-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-violet-400 flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          {t.badge}
        </span>
      </div>

      {!isSubmitted ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold">{t.prompt}</span>
            <p className="text-white text-sm font-bold leading-relaxed">{question}</p>
          </div>

          <div className="grid gap-2.5">
            {resolvedOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all duration-200 cursor-pointer ${
                  selectedIdx === i
                    ? "bg-violet-600/20 border-violet-500 text-white shadow-md shadow-violet-500/5"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedIdx === null}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {t.submit}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {isCorrect ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.success}</span>
              </div>
              <button
                onClick={handleSkip}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {t.skip_btn} "{sectionTitle}"
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>{t.fail}</span>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {t.reset}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
