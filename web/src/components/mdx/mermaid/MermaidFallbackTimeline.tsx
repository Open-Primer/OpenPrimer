"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';

export const MermaidFallbackTimeline = ({ chartText }: { chartText: string }) => {
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase();
  const t = STATIC_UI_STRINGS[langKey as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const statusT = STATUS_STRINGS[langKey] || STATUS_STRINGS.EN;
  const nodes = parseMermaidFallbackNodes(chartText);

  if (nodes.length === 0) {
    return null;
  }

  return (
    <div className="my-8 w-full p-8 rounded-[40px] bg-slate-950/40 border border-slate-900 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left select-none">
      {/* Background Decorative Glow */}
      <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-10 border-b border-slate-900 pb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-route"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
        </div>
        <div>
          <h4 className="text-slate-200 text-xs font-black uppercase tracking-[0.2em]">{t.learning_sequence}</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.logical_flow}</p>
        </div>
      </div>

      <div className="relative pl-8 space-y-8">
        {/* Connector Line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-0.5 border-l-2 border-dashed border-slate-800" />

        {nodes.map((node, index) => {
          // Parse title and parenthetical formula/subtitle if available
          const match = node.label.match(/^([^(]+)\s*\(([^)]+)\)$/);
          let title = node.label;
          let formula = '';
          if (match) {
            title = match[1].trim();
            formula = match[2].trim();
          }

          // Dynamic badge info
          let badgeText = statusT.transition;
          let badgeClass = "text-amber-400 bg-amber-500/5 border-amber-500/10";
          let dotClass = "bg-amber-400";

          if (index === 0) {
            badgeText = statusT.initial;
            badgeClass = "text-indigo-400 bg-indigo-500/5 border-indigo-500/10";
            dotClass = "bg-indigo-400";
          } else if (index === nodes.length - 1) {
            badgeText = statusT.target;
            badgeClass = "text-emerald-400 bg-emerald-500/5 border-emerald-500/10";
            dotClass = "bg-emerald-400";
          }

          return (
            <div key={node.id} className="relative group flex items-start gap-6 transition-all duration-300">
              {/* Dot Indicator */}
              <div className="absolute -left-[31px] mt-1 w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center z-10 group-hover:border-indigo-500/50 group-hover:bg-indigo-950/20 transition-all duration-300 shadow-md">
                <div className={`w-2.5 h-2.5 rounded-full ${dotClass} group-hover:scale-125 transition-transform`} />
              </div>

              {/* Content Card */}
              <div className="flex-1 p-6 rounded-3xl border border-slate-900/80 bg-slate-900/10 hover:bg-slate-950/40 hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-md relative group/card shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-lg group-hover/card:scale-y-110 transition-transform duration-300 ${index === 0 ? 'bg-indigo-500' : index === nodes.length - 1 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <div className="pl-4">
                  <span className="text-[10px] font-black text-slate-500 group-hover/card:text-indigo-400 uppercase tracking-widest block mb-1 select-none transition-colors">
                    {t.concept_step} {index + 1}
                  </span>
                  <h5 className="text-slate-200 font-extrabold text-base group-hover/card:text-white transition-colors leading-tight select-text">
                    {title}
                  </h5>
                  {formula && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/5 border border-indigo-500/10 group-hover/card:border-indigo-500/20 group-hover/card:bg-indigo-500/10 text-indigo-300 font-mono text-xs transition-all duration-300 shadow-sm select-text">
                      <span className="opacity-80">🧪</span>
                      <span className="font-semibold tracking-wide">{formula}</span>
                    </div>
                  )}
                </div>
                
                {/* Dynamic Status Badge */}
                <div className="shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border tracking-wide uppercase shadow-sm select-none ${badgeClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                    {badgeText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface TimelineItem {
  time?: string;
  section?: string;
  events: string[];
}

const parseMermaidTimeline = (chartText: string): { title?: string; items: TimelineItem[] } => {
  const lines = chartText.split(/\r?\n/);
  let title: string | undefined;
  const items: TimelineItem[] = [];
  let currentSection: string | undefined;

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('%%')) continue;

    if (line.toLowerCase() === 'timeline') continue;

    const titleMatch = line.match(/^title\s+(.+)$/i);
    if (titleMatch) {
      title = titleMatch[1].trim().replace(/^"+|"+$/g, '');
      continue;
    }

    const sectionMatch = line.match(/^section\s+(.+)$/i);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim().replace(/^"+|"+$/g, '');
      continue;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const time = line.substring(0, colonIndex).trim().replace(/^"+|"+$/g, '');
      const eventsStr = line.substring(colonIndex + 1).trim();
      
      const events: string[] = [];
      let currentEvent = '';
      let inQuotes = false;
      for (let i = 0; i < eventsStr.length; i++) {
        const char = eventsStr[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ':' && !inQuotes) {
          if (currentEvent.trim()) {
            events.push(currentEvent.trim().replace(/^"+|"+$/g, ''));
          }
          currentEvent = '';
        } else {
          currentEvent += char;
        }
      }
      if (currentEvent.trim()) {
        events.push(currentEvent.trim().replace(/^"+|"+$/g, ''));
      }

      items.push({
        time,
        section: currentSection,
        events
      });
    }
  }

  return { title, items };
};

const CustomTimeline = ({ chartText }: { chartText: string }) => {
  const { language } = useLanguage();
  const langKey = (language?.toUpperCase() || 'EN') as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR';

  const TIMELINE_STRINGS = {
    EN: { title: "Timeline", subtitle: "Historical Sequence" },
    FR: { title: "Frise Chronologique", subtitle: "Déroulement Historique" },
    ES: { title: "Línea de Tiempo", subtitle: "Secuencia Histórica" },
    DE: { title: "Zeitleiste", subtitle: "Historischer Ablauf" },
    ZH: { title: "时间线", subtitle: "历史顺序" },
    PT: { title: "Linha do Tempo", subtitle: "Sequência Histórica" },
    AR: { title: "الجدول الزمني", subtitle: "التسلسل التاريخي" },
    HI: { title: "समयरेखा", subtitle: "ऐतिहासिक अनुक्रम" },
    UR: { title: "ٹائم لائن", subtitle: "تاریخی ترتیب" }
  };

  const tStrings = TIMELINE_STRINGS[langKey] || TIMELINE_STRINGS.EN;
  const { title, items } = parseMermaidTimeline(chartText);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="my-8 w-full p-6 md:p-8 rounded-[40px] bg-slate-950/40 border border-slate-900 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left">
      <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      
      {/* Timeline Header */}
      <div className="flex items-center gap-3 mb-10 border-b border-slate-900 pb-5 select-none">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <h4 className="text-slate-200 text-xs font-black uppercase tracking-[0.2em]">
            {title || tStrings.title}
          </h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            {tStrings.subtitle}
          </p>
        </div>
      </div>

      <div className="relative pl-6 md:pl-8 space-y-8">
        {/* Connector Line */}
        <div className="absolute left-[13px] md:left-[15px] top-3 bottom-3 w-0.5 border-l-2 border-dashed border-slate-800" />

        {items.map((item, index) => (
          <div key={index} className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-6 group transition-all duration-300">
            {/* Dot Indicator */}
            <div className="absolute -left-[35px] md:-left-[31px] mt-1.5 w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center z-10 group-hover:border-indigo-500/50 group-hover:bg-indigo-950/20 transition-all duration-300 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
            </div>

            {/* Time / Year Badge */}
            {item.time && (
              <div className="md:w-48 shrink-0 select-none">
                <span className="inline-block px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-black uppercase tracking-wider shadow-sm">
                  {item.time}
                </span>
              </div>
            )}

            {/* Event Details Card */}
            <div className="flex-1 p-5 rounded-2xl border border-slate-900/60 bg-slate-900/10 hover:bg-slate-900/30 hover:border-slate-800/80 transition-all duration-300 backdrop-blur-md">
              {item.section && (
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1 select-none">
                  {item.section}
                </span>
              )}
              {item.events.map((event, evtIdx) => (
                <p key={evtIdx} className={`text-slate-200 text-sm leading-relaxed ${evtIdx > 0 ? 'mt-3 border-t border-slate-800/40 pt-3' : ''}`}>
                  {event}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const generateDeterministicId = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `mermaid-${Math.abs(hash)}`;
};

