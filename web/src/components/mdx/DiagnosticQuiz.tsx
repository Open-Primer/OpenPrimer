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
    success: "🏆 Topic validated! You have mastered the prerequisites. You can continue reading or progress directly to the next section.",
    fail: "❌ Recommended: We advise reading this section to build a solid foundation.",
    skip_btn: "Skip directly to",
    submit: "Check Answer",
    reset: "Retry Check"
  },
  FR: {
    badge: "Test Diagnostique Adaptatif",
    prompt: "Testez vos connaissances pour passer directement à la suite :",
    success: "🏆 Notion validée ! Vous maîtrisez les prérequis de cette section. Vous pouvez continuer la lecture ou accéder directement à la section suivante.",
    fail: "❌ Recommandation : Nous vous conseillons de lire cette section pour acquérir les bases nécessaires.",
    skip_btn: "Passer directement à",
    submit: "Vérifier",
    reset: "Réessayer"
  },
  ES: {
    badge: "Prueba de Diagnóstico Adaptativa",
    prompt: "Pon a prueba tus conocimientos para omitir esta sección:",
    success: "🏆 ¡Tema validado! Dominas los prerrequisitos de esta sección. Puedes continuar leyendo o ir directamente a la siguiente sección.",
    fail: "❌ Recomendado: Te aconsejamos leer esta sección para construir una base sólida.",
    skip_btn: "Omitir e ir a",
    submit: "Comprobar",
    reset: "Reintentar"
  },
  DE: {
    badge: "Adaptiver Diagnosetest",
    prompt: "Testen Sie Ihr Wissen, um diesen Abschnitt zu überspringen:",
    success: "🏆 Thema bestätigt! Sie beherrschen die Voraussetzungen für diesen Abschnitt. Sie können weiterlesen oder direkt zum nächsten Abschnitt springen.",
    fail: "❌ Empfohlen: Wir empfehlen Ihnen, diesen Abschnitt zu lesen, um eine solide Grundlage zu schaffen.",
    skip_btn: "Direkt springen zu",
    submit: "Prüfen",
    reset: "Wiederholen"
  },
  ZH: {
    badge: "自适应诊断测试",
    prompt: "测试您的知识以跳过此部分：",
    success: "🏆 知识点已验证！您已掌握本节的先决条件。您可以继续阅读或直接跳过至下一节。",
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
  const isPlaceholder = (str: string) => {
    if (!str) return true;
    const s = str.toLowerCase().trim();
    return (
      s === "" ||
      s.includes('placeholder') ||
      s.includes('example') ||
      s.includes('dummy') ||
      s.includes('diagnostic question') ||
      s.includes('section-slug-to-skip-to') ||
      s.includes('section title to skip') ||
      s.includes('option a|||option b')
    );
  };

  const resolvedOptions = Array.isArray(options)
    ? options
    : typeof options === 'string' && options
      ? options.split('|||')
      : [];

  if (
    !question ||
    isPlaceholder(question) ||
    !resolvedOptions ||
    resolvedOptions.length === 0 ||
    resolvedOptions.some(opt => isPlaceholder(opt)) ||
    isPlaceholder(targetSectionId) ||
    isPlaceholder(sectionTitle)
  ) {
    return null;
  }

  const { language } = useLanguage();
  const t = STRINGS[language as keyof typeof STRINGS] || STRINGS.EN;

  console.log("DiagnosticQuiz Received Props:", { question, options, correctIndex, targetSectionId, sectionTitle });

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
    let el = document.getElementById(targetSectionId);
    if (!el) {
      // Search by id with heading slug fallback
      const slugify = (text: string) => {
        return text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      };
      const slug = slugify(sectionTitle);
      el = document.getElementById(slug);
      
      if (!el) {
        // Search headings by text content
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const normalizedTitle = sectionTitle.toLowerCase().trim();
        for (let i = 0; i < headings.length; i++) {
          const hText = headings[i].textContent?.toLowerCase().trim() || '';
          if (hText.includes(normalizedTitle) || normalizedTitle.includes(hText)) {
            el = headings[i] as HTMLElement;
            break;
          }
        }
      }
    }
    
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
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
