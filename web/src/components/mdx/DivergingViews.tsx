"use client";

import React, { useState } from 'react';
import { Swords, ChevronDown, ChevronUp, BookOpen, User, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DivergingViewsStrings {
  header: string;
  view_a_label: string;
  view_b_label: string;
  read_more: string;
  read_less: string;
  era: string;
  proponents: string;
  verdict: string;
}

const STRINGS: Record<string, DivergingViewsStrings> = {
  EN: {
    header: 'Opposing Views',
    view_a_label: 'First Perspective',
    view_b_label: 'Second Perspective',
    read_more: 'Read more',
    read_less: 'Read less',
    era: 'Period',
    proponents: 'Key proponents',
    verdict: 'Historical verdict',
  },
  FR: {
    header: 'Visions Opposées',
    view_a_label: 'Première Perspective',
    view_b_label: 'Seconde Perspective',
    read_more: 'Lire la suite',
    read_less: 'Réduire',
    era: 'Époque',
    proponents: 'Défenseurs clés',
    verdict: 'Verdict historique',
  },
  ES: {
    header: 'Visiones Opuestas',
    view_a_label: 'Primera Perspectiva',
    view_b_label: 'Segunda Perspectiva',
    read_more: 'Leer más',
    read_less: 'Leer menos',
    era: 'Período',
    proponents: 'Defensores clave',
    verdict: 'Veredicto histórico',
  },
  DE: {
    header: 'Gegensätzliche Ansichten',
    view_a_label: 'Erste Perspektive',
    view_b_label: 'Zweite Perspektive',
    read_more: 'Mehr lesen',
    read_less: 'Weniger lesen',
    era: 'Zeitraum',
    proponents: 'Wichtigste Vertreter',
    verdict: 'Historisches Urteil',
  },
  ZH: {
    header: '对立观点',
    view_a_label: '第一视角',
    view_b_label: '第二视角',
    read_more: '阅读更多',
    read_less: '收起',
    era: '时期',
    proponents: '主要代表人物',
    verdict: '历史裁决',
  },
};

interface ViewData {
  /** Name / label of the theory, doctrine, or position */
  label: string;
  /** Main thesis — 1-3 sentences */
  thesis: string;
  /** Optional detailed explanation shown on expansion */
  detail?: string;
  /** Historical era or date range (e.g. "1600s – 1850s") */
  era?: string;
  /** Comma-separated list of key defenders */
  proponents?: string;
  /** Optional color accent: 'blue' | 'rose' | 'amber' | 'emerald' | 'violet' | 'cyan' */
  color?: string;
}

interface DivergingViewsProps {
  /** Short topic title shown in the header (e.g. "Cause of Infectious Disease") */
  topic: string;
  /** First view object OR JSON string */
  viewA: ViewData | string;
  /** Second view object OR JSON string */
  viewB: ViewData | string;
  /** Optional resolution paragraph shown at the bottom */
  verdict?: string;
  /** Year / period of resolution (e.g. "1860s with Pasteur's germ theory") */
  verdictEra?: string;
}

type AccentKey = 'blue' | 'rose' | 'amber' | 'emerald' | 'violet' | 'cyan';

const ACCENT: Record<AccentKey, { border: string; bg: string; title: string; badge: string; icon: string }> = {
  blue:    { border: 'border-blue-500/40',    bg: 'bg-blue-500/5',    title: 'text-blue-300',   badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400',   icon: 'text-blue-400' },
  rose:    { border: 'border-rose-500/40',    bg: 'bg-rose-500/5',    title: 'text-rose-300',   badge: 'bg-rose-500/10 border-rose-500/20 text-rose-400',    icon: 'text-rose-400' },
  amber:   { border: 'border-amber-500/40',   bg: 'bg-amber-500/5',   title: 'text-amber-300',  badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400',  icon: 'text-amber-400' },
  emerald: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/5', title: 'text-emerald-300',badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',icon:'text-emerald-400' },
  violet:  { border: 'border-violet-500/40',  bg: 'bg-violet-500/5',  title: 'text-violet-300', badge: 'bg-violet-500/10 border-violet-500/20 text-violet-400', icon: 'text-violet-400' },
  cyan:    { border: 'border-cyan-500/40',    bg: 'bg-cyan-500/5',    title: 'text-cyan-300',   badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',    icon: 'text-cyan-400' },
};

function parseView(raw: ViewData | string): ViewData {
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return { label: raw, thesis: '' }; }
  }
  return raw;
}

function resolveAccent(color?: string, fallback: AccentKey = 'blue'): AccentKey {
  if (color && color in ACCENT) return color as AccentKey;
  return fallback;
}

interface ViewCardProps {
  view: ViewData;
  accentKey: AccentKey;
  t: DivergingViewsStrings;
  side: 'A' | 'B';
}

const ViewCard = ({ view, accentKey, t, side }: ViewCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const a = ACCENT[accentKey];

  return (
    <div
      className={`flex-1 min-w-0 rounded-3xl border ${a.border} ${a.bg} p-6 flex flex-col gap-4 transition-all duration-300 group/card relative overflow-hidden`}
    >
      {/* Decorative background glow */}
      <div className={`absolute -top-10 ${side === 'A' ? '-right-10' : '-left-10'} w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none bg-current ${a.icon}`} />

      {/* Header */}
      <div className="flex items-center gap-2.5 select-none">
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${a.badge} border`}>
          {side}
        </div>
        <h4 className={`text-sm font-black leading-tight ${a.title}`}>
          {view.label}
        </h4>
      </div>

      {/* Meta badges (era, proponents) */}
      {(view.era || view.proponents) && (
        <div className="flex flex-wrap gap-2 select-none">
          {view.era && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${a.badge}`}>
              <Calendar className="w-2.5 h-2.5" />
              {t.era} : {view.era}
            </span>
          )}
          {view.proponents && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${a.badge}`}>
              <User className="w-2.5 h-2.5" />
              {view.proponents}
            </span>
          )}
        </div>
      )}

      {/* Thesis */}
      <p className="text-[13px] text-slate-300 leading-relaxed font-medium flex-1">
        {view.thesis}
      </p>

      {/* Expandable detail */}
      {view.detail && (
        <>
          {expanded && (
            <p className="text-[12px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3 mt-1">
              {view.detail}
            </p>
          )}
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className={`self-start mt-auto flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer ${a.title} hover:opacity-80`}
          >
            {expanded ? (
              <><ChevronUp className="w-3 h-3" />{t.read_less}</>
            ) : (
              <><ChevronDown className="w-3 h-3" />{t.read_more}</>
            )}
          </button>
        </>
      )}
    </div>
  );
};

export const DivergingViews = ({
  topic,
  viewA: rawA,
  viewB: rawB,
  verdict,
  verdictEra,
}: DivergingViewsProps) => {
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase();
  const t = STRINGS[langKey] || STRINGS.EN;

  const viewA = parseView(rawA);
  const viewB = parseView(rawB);

  const accentA = resolveAccent(viewA.color, 'blue');
  const accentB = resolveAccent(viewB.color, 'rose');

  return (
    <div className="my-10 p-6 md:p-8 rounded-[40px] border border-slate-700/50 bg-slate-900/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px]">
        <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-blue-600/5 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-rose-600/5 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/60 select-none">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-rose-500/20 border border-slate-700/60 flex items-center justify-center">
          <Swords className="w-5 h-5 text-slate-300" />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">
            {t.header}
          </p>
          <h3 className="text-base font-black text-white leading-tight">
            {topic}
          </h3>
        </div>
      </div>

      {/* VS divider layout */}
      <div className="relative z-10 flex flex-col md:flex-row gap-4 items-stretch">
        <ViewCard view={viewA} accentKey={accentA} t={t} side="A" />

        {/* Central VS badge */}
        <div className="hidden md:flex flex-col items-center justify-center shrink-0 select-none">
          <div className="flex flex-col items-center gap-1">
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-slate-700 to-transparent" style={{ minHeight: 40 }} />
            <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-lg">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">VS</span>
            </div>
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-slate-700 to-transparent" style={{ minHeight: 40 }} />
          </div>
        </div>

        {/* Mobile VS separator */}
        <div className="flex md:hidden items-center gap-3 select-none">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-lg shrink-0">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">VS</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        <ViewCard view={viewB} accentKey={accentB} t={t} side="B" />
      </div>

      {/* Historical verdict */}
      {verdict && (
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/60">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-1 select-none">
                {t.verdict}{verdictEra ? ` — ${verdictEra}` : ''}
              </p>
              <p className="text-[13px] text-slate-300 leading-relaxed">{verdict}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
