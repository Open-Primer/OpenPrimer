"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';
import { dbService } from '@/lib/db';
import { cleanPathSegment } from '@/lib/translations';

interface PrerequisiteItem {
  title: string;
  slug: string;
  level: string;
  subject: string;
}

interface PrerequisitesProps {
  items?: (PrerequisiteItem | string)[];
  itemsBase64?: string;
}

const TRANS = {
  EN: {
    header: "Indices de charge cognitive — Strict Prerequisites",
    desc: "To ensure proper understanding and manage cognitive load, the following prerequisite modules are recommended. If you haven't mastered them, we advise reviewing them first.",
    mastered: "Mastered",
    review: "Review Course",
    not_started: "Required",
    recommended: "Recommended"
  },
  FR: {
    header: "Indices de charge cognitive — Prérequis Stricts",
    desc: "Pour optimiser votre charge cognitive et assurer la bonne compréhension de cette leçon, les prérequis suivants sont recommandés. Si vous ne les maîtrisez pas, nous vous conseillons de les réviser.",
    mastered: "Maîtrisé",
    review: "Réviser le cours",
    not_started: "Requis",
    recommended: "Recommandé"
  },
  ES: {
    header: "Índices de carga cognitiva — Prerrequisitos Estrictos",
    desc: "Para garantizar una comprensión adecuada y gestionar la carga cognitiva, se recomiendan los siguientes módulos de prerrequisitos. Si no los dominas, te aconsejamos revisarlos primero.",
    mastered: "Dominado",
    review: "Revisar curso",
    not_started: "Requerido",
    recommended: "Recomendado"
  },
  DE: {
    header: "Kognitive Belastungsindizes — Strikte Voraussetzungen",
    desc: "Um ein angemessenes Verständnis zu gewährleisten und die kognitive Belastung zu steuern, werden die folgenden Voraussetzungsmodule empfohlen. Wenn Sie diese nicht beherrschen, empfehlen wir Ihnen, sie zuerst zu wiederholen.",
    mastered: "Meistert",
    review: "Kurs wiederholen",
    not_started: "Erforderlich",
    recommended: "Empfohlen"
  },
  ZH: {
    header: "认知负荷指标 — 严格先修课程",
    desc: "为了确保正确理解并管理认知负荷，建议先修以下模块。如果您尚未掌握，建议先进行复习。",
    mastered: "已掌握",
    review: "复习课程",
    not_started: "必修",
    recommended: "推荐"
  }
};

export const Prerequisites = ({ items, itemsBase64 }: PrerequisitesProps) => {
  const { language } = useLanguage();
  const t = TRANS[language as keyof typeof TRANS] || TRANS.EN;

  const pathname = usePathname();
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [existingSlugs, setExistingSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('op_course_progress');
      if (saved) {
        setProgressMap(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse course progress maps:", e);
    }
  }, []);

  useEffect(() => {
    let active = true;
    dbService.getAllCourses().then(({ data }) => {
      if (active && data) {
        const slugs = new Set(data.map((c: any) => (c.slug || '').toLowerCase()));
        setExistingSlugs(slugs);
      }
    }).catch(err => {
      console.warn("Failed to load courses for prerequisites validation:", err);
    });
    return () => {
      active = false;
    };
  }, []);

  const isIntroPage = pathname ? (pathname.toLowerCase().endsWith('/introduction') || pathname.toLowerCase().endsWith('/introduction/')) : false;
  if (!isIntroPage) return null;

  // Resolve items
  let resolvedItems = items || [];
  if (itemsBase64) {
    try {
      const binary = typeof window !== 'undefined'
        ? window.atob(itemsBase64)
        : Buffer.from(itemsBase64, 'base64').toString('binary');
      const percentEncoded = binary.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('');
      const decoded = decodeURIComponent(percentEncoded);
      resolvedItems = JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to decode itemsBase64 in Prerequisites:", e);
    }
  }

  if (!resolvedItems || resolvedItems.length === 0) return null;

  return (
    <div className="my-8 p-6 bg-slate-900/30 border border-slate-800/80 rounded-3xl backdrop-blur-xl shadow-xl">
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          {t.header}
        </h4>
        <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">{t.desc}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {resolvedItems.map((item, index) => {
          if (typeof item === 'string') {
            return (
              <div
                key={index}
                className="p-4 rounded-2xl border bg-slate-950/20 border-slate-850/60 flex flex-col justify-between gap-3 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest block mb-0.5">
                      {t.recommended}
                    </span>
                    <h5 className="text-xs font-bold text-slate-300 leading-relaxed">{item}</h5>
                  </div>
                </div>
              </div>
            );
          }

          const progress = progressMap[item.slug || ''] ?? 0;
          const isMastered = progress === 100;
          const subject = item.subject || 'General';
          const level = item.level || 'L1';
          const title = item.title || 'Untitled Course';

          // Format course link
          const path = `/${cleanPathSegment(level)}/${cleanPathSegment(subject)}/${item.slug || ''}/introduction`;
          const exists = existingSlugs.has((item.slug || '').toLowerCase());

          return (
            <div
              key={index}
              className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all duration-200 ${
                exists
                  ? isMastered
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-amber-500/5 border-amber-500/20"
                  : "bg-slate-950/20 border-slate-850/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-0.5">
                    {subject} • {level.replace('_', ' ')}
                  </span>
                  <h5 className="text-sm font-bold text-white">{title}</h5>
                </div>
                {exists ? (
                  isMastered ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {t.mastered}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {t.not_started}
                    </span>
                  )
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {t.recommended}
                  </span>
                )}
              </div>

              {exists && !isMastered && (
                <Link
                  href={path}
                  className="mt-1 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group self-start transition-colors"
                >
                  {t.review}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
