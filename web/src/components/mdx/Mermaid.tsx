"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Maximize2, Minimize2, ZoomIn, ZoomOut, Move, X, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';

interface MermaidProps {
  chart?: string;
  children?: React.ReactNode;
}

let mermaidInstance: any = null;

const decodeHtmlEntities = (text: any): string => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#123;/g, '{')
    .replace(/&#125;/g, '}')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&apos;/g, "'");
};

const getTextFromChildren = (children: React.ReactNode): string => {
  if (children === null || children === undefined) {
    return '';
  }
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join('');
  }
  if (React.isValidElement(children)) {
    const props = children.props as any;
    if (props && props.children !== undefined) {
      return getTextFromChildren(props.children);
    }
  }
  return '';
};

const sanitizeMermaidChart = (chartText: any): string => {
  let sanitized = typeof chartText === 'string' ? chartText : '';

  // Decode HTML entities
  sanitized = decodeHtmlEntities(sanitized);

  // 1. Remove standard markdown blocks if any
  sanitized = sanitized.replace(/```mermaid/g, '').replace(/```/g, '').trim();

  // 2. Clean corrupted sequence patterns such as &fl°°123¶ß or fl°°123¶ß and replace with standard brackets
  // Using exact Unicode escapes: \u00b0 is °, \u00b6 is ¶, \u00df is ß, plus symbol fallbacks for safety.
  const corruptedRegex = /([a-zA-Z0-9_-]+)(?:&?fl\u00b0\u00b0123\u00b6\u00df|&?fl[^\w\s]+123[^\w\s]+)(.*?)(?=\s*[-=]\.?>|\s*[-=]=|\n|\r|$)/g;
  sanitized = sanitized.replace(corruptedRegex, (match, id, label) => {
    return `${id}["${label.trim()}"]`;
  });
  sanitized = sanitized.replace(/&?fl\u00b0\u00b0123\u00b6\u00df|&?fl[^\w\s]+123[^\w\s]+/g, '["');

  // 3. Replace '+' with '&' when connecting nodes, but not inside double quotes
  let parts = sanitized.split(/("[^"]*")/g);
  parts = parts.map((part, index) => {
    if (!part) return '';
    if (index % 2 === 1) return part; // Inside quotes, do not replace
    return part.replace(/\+/g, '&');
  });
  sanitized = parts.join('');

  // 4. Fix unquoted node labels with special characters to prevent Mermaid parser crashes.
  // Match double brackets [[text]]
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\[\[([^"\r\n\]]+)\]\]/g, '$1[["$2"]]');
  // Match stadium shape ([text])
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\(\[([^"\r\n\]]+)\]\)/g, '$1(["$2"])');
  // Match cylindrical shape [(text)]
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\[\(([^"\r\n\)]+)\)\]/g, '$1[("$2")]');
  // Match circle shape ((text))
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\(\(([^"\r\n\)]+)\)\)/g, '$1(("$2"))');
  // Match normal brackets [text]
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\[([^"\r\n\]]+)\]/g, '$1["$2"]');
  // Match normal parentheses (text)
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\(([^"\r\n\)]+)\)/g, (match, id, label) => {
    // Avoid breaking subgraphs or direction/style keywords
    const lowerLabel = label.toLowerCase().trim();
    if (lowerLabel === 'td' || lowerLabel === 'lr' || lowerLabel === 'tb' || lowerLabel === 'bt' || lowerLabel === 'rl' || lowerLabel.startsWith('style') || lowerLabel.startsWith('class')) {
      return match;
    }
    return `${id}("${label}")`;
  });
  // Match rhombus {text}
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\{([^"\r\n\}]+)\}/g, '$1{"$2"}');

  return sanitized;
};

const parseMermaidFallbackNodes = (chartText: string): { id: string; label: string }[] => {
  const nodes: { id: string; label: string }[] = [];
  const seenIds = new Set<string>();

  const lines = chartText.split(/\r?\n/);
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('%%') || line.toLowerCase() === 'timeline' || line.toLowerCase().startsWith('graph') || line.toLowerCase().startsWith('flowchart')) {
      continue;
    }

    // Split line by connectors: -->, ---, ==>, -.->, ->, to
    const parts = line.split(/\s*(?:-->|---|==>|-\.-\s*>|->|to)\s*/);
    for (const part of parts) {
      const trimmedPart = part.trim();
      if (!trimmedPart) continue;

      // Skip connection labels like |text|
      if (trimmedPart.startsWith('|') && trimmedPart.endsWith('|')) {
        continue;
      }
      
      const idMatch = trimmedPart.match(/^([a-zA-Z0-9_-]+)/);
      if (!idMatch) continue;

      const id = idMatch[1];
      if (['graph', 'flowchart', 'subgraph', 'end', 'click', 'style', 'classdef', 'direction', 'tb', 'td', 'lr', 'rl', 'bt'].includes(id.toLowerCase())) {
        continue;
      }

      const rest = trimmedPart.substring(id.length).trim();
      if (!rest) {
        continue;
      }

      let label = '';
      // Look for brackets or quotes
      const quotedMatch = rest.match(/^[\[\({]+"(.*?)"[\]\)}]+/);
      if (quotedMatch) {
        label = quotedMatch[1].trim();
      } else {
        // Strip various Mermaid bracket shapes: ((...)), (text), [...], {...}, >...]
        if (rest.startsWith('((') && rest.endsWith('))')) {
          label = rest.substring(2, rest.length - 2).trim();
        } else if (rest.startsWith('([') && rest.endsWith('])')) {
          label = rest.substring(2, rest.length - 2).trim();
        } else if (rest.startsWith('[[') && rest.endsWith(']]')) {
          label = rest.substring(2, rest.length - 2).trim();
        } else if (rest.startsWith('[(') && rest.endsWith(')]')) {
          label = rest.substring(2, rest.length - 2).trim();
        } else if (rest.startsWith('[') && rest.endsWith(']')) {
          label = rest.substring(1, rest.length - 1).trim();
        } else if (rest.startsWith('(') && rest.endsWith(')')) {
          label = rest.substring(1, rest.length - 1).trim();
        } else if (rest.startsWith('{') && rest.endsWith('}')) {
          label = rest.substring(1, rest.length - 1).trim();
        } else {
          label = rest;
        }
      }

      if (label && !seenIds.has(id)) {
        seenIds.add(id);
        nodes.push({ id, label });
      }
    }
  }

  // If no nodes found, fallback to extracting anything inside quotes
  if (nodes.length === 0) {
    const quoteRegex = /"([^"]+)"/g;
    let index = 0;
    let match;
    while ((match = quoteRegex.exec(chartText)) !== null) {
      const label = match[1].trim();
      const id = `node-${index++}`;
      if (label && label.length > 1 && !seenIds.has(id)) {
        seenIds.add(id);
        nodes.push({ id, label });
      }
    }
  }

  return nodes;
};

const STATUS_STRINGS: Record<string, { initial: string; transition: string; target: string }> = {
  EN: { initial: "Initial State", transition: "Transition Step", target: "Target Milestone" },
  FR: { initial: "État Initial", transition: "Étape de Transition", target: "Objectif Final" },
  ES: { initial: "Estado Inicial", transition: "Paso de Transición", target: "Meta Final" },
  DE: { initial: "Ausgangszustand", transition: "Übergangsschritt", target: "Endziel" },
  ZH: { initial: "初始状态", transition: "过渡阶段", target: "最终目标" },
  PT: { initial: "Estado Inicial", transition: "Etapa de Transição", target: "Meta Final" },
  AR: { initial: "الحالة الأولية", transition: "خطوة انتقالية", target: "الهدف النهائي" },
  HI: { initial: "प्रारंभिक अवस्था", transition: "पारगमन चरण", target: "अंतिम मील का पत्थर" },
  UR: { initial: "ابتدائی حالت", transition: "عبوری مرحلہ", target: "آخری سنگ میل" }
};

const MermaidFallbackTimeline = ({ chartText }: { chartText: string }) => {
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

export const Mermaid = ({ chart, children }: MermaidProps) => {
  const { language } = useLanguage();
  const t = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  
  const chartText = chart || getTextFromChildren(children) || '';
  const isTimeline = chartText.trim().toLowerCase().startsWith('timeline') || 
                     /^timeline\b/i.test(chartText.trim());

  if (isTimeline) {
    return <CustomTimeline chartText={chartText} />;
  }

  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'paper' | 'focus' | 'dark'>('dark');
  const containerId = useRef(`mermaid-${Math.floor(Math.random() * 1000000)}`);
  const elementRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragMoveAmount = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme detector MutationObserver
  useEffect(() => {
    const checkTheme = () => {
      const isPaper = document.body.classList.contains('theme-paper') || 
                      document.documentElement.classList.contains('theme-paper') ||
                      !!document.querySelector('.theme-paper');
      const isFocus = document.body.classList.contains('theme-focus') || 
                      document.documentElement.classList.contains('theme-focus') ||
                      !!document.querySelector('.theme-focus');
      if (isPaper) {
        setTheme('paper');
      } else if (isFocus) {
        setTheme('focus');
      } else {
        setTheme('dark');
      }
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      observer.observe(mainEl, { attributes: true, attributeFilter: ['class'] });
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;

    const renderChart = async () => {
      try {
        setLoading(true);
        setError(null);

        // Per-theme palette — prevents Mermaid from using its default pink/lavender nodes
        const nodeBg       = theme === 'paper' ? '#e2e8f0' : theme === 'focus' ? '#171717' : '#1e293b';
        const nodeBorder   = theme === 'paper' ? '#94a3b8' : theme === 'focus' ? '#404040' : '#475569';
        const nodeText     = theme === 'paper' ? '#0f172a' : theme === 'focus' ? '#e5e5e5' : '#f8fafc';
        const edgeColor    = theme === 'paper' ? '#64748b' : theme === 'focus' ? '#737373' : '#64748b';
        const bgColor      = theme === 'paper' ? '#faf8f0' : theme === 'focus' ? '#000000' : 'transparent';
        const clusterBg    = theme === 'paper' ? '#f1f5f9' : theme === 'focus' ? '#0a0a0a' : '#0f172a';

        let currentThemeConfig = {
          theme: 'dark',
          themeVariables: {
            background:        bgColor,
            mainBkg:           nodeBg,
            nodeBorder:        nodeBorder,
            clusterBkg:        clusterBg,
            clusterBorder:     nodeBorder,
            primaryColor:      nodeBg,
            primaryTextColor:  nodeText,
            primaryBorderColor:nodeBorder,
            secondaryColor:    nodeBg,
            secondaryTextColor:nodeText,
            secondaryBorderColor:nodeBorder,
            tertiaryColor:     nodeBg,
            tertiaryTextColor: nodeText,
            tertiaryBorderColor:nodeBorder,
            lineColor:         edgeColor,
            edgeLabelBackground: theme === 'paper' ? '#faf8f0' : theme === 'focus' ? '#000000' : '#0f172a',
            fontFamily:        'Inter, system-ui, -apple-system, sans-serif',
          }
        };

        if (!mermaidInstance) {
          const mermaid = (await import('mermaid')).default;
          mermaidInstance = mermaid;
        }

        mermaidInstance.initialize({
          startOnLoad: false,
          theme: 'base' as any,
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            nodeSpacing: 50,
            rankSpacing: 60,
            wrappingWidth: 200,
            padding: 15,
          },
          themeVariables: {
            ...currentThemeConfig.themeVariables,
            fontSize: '16px',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }
        });

        if (!active) return;

        // Sanitize chart structure & quotes
        const cleanedChart = sanitizeMermaidChart(chartText);

        // Render diagram safely using a sandbox temporary div to prevent DOM query race conditions
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.visibility = 'hidden';
        document.body.appendChild(tempDiv);
        try {
          const { svg: renderedSvg } = await mermaidInstance.render(containerId.current, cleanedChart, tempDiv);
          if (active) {
            setSvg(renderedSvg);
            loading && setLoading(false);
          }
        } finally {
          tempDiv.remove();
        }
      } catch (err: any) {
        console.error("Mermaid compilation error:", err);
        if (active) {
          setError(err.message || "Failed to render flowchart. Check syntax.");
          loading && setLoading(false);
        }
        
        // Reset mermaid's internal error state in DOM if possible
        const badge = document.getElementById(`d${containerId.current}`);
        if (badge) badge.remove();
      }
    };

    renderChart();

    return () => {
      active = false;
    };
  }, [chartText, theme]);

  const getContainerClassName = () => {
    if (theme === 'paper') {
      return "my-6 p-6 border border-[#dbd5be] bg-[#faf8f0] rounded-2xl flex flex-col items-center justify-center overflow-x-auto select-none shadow-sm";
    }
    if (theme === 'focus') {
      return "my-6 p-6 border border-[#262626] bg-[#000000] rounded-2xl flex flex-col items-center justify-center overflow-x-auto select-none";
    }
    return "my-6 p-6 border border-slate-850 bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center overflow-x-auto select-none backdrop-blur-md shadow-inner";
  };

  // Move useEffect calls before early returns
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsFullscreen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (!elementRef.current || loading || error) return;
    
    const parseToRgb = (colorStr: string): { r: number; g: number; b: number } | null => {
      const s = colorStr.trim().toLowerCase();
      
      const rgbMatch = s.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
      if (rgbMatch) {
        return {
          r: parseInt(rgbMatch[1], 10),
          g: parseInt(rgbMatch[2], 10),
          b: parseInt(rgbMatch[3], 10)
        };
      }

      const rgbSpaceMatch = s.match(/^rgba?\((\d+)\s+(\d+)\s+(\d+)(?:\s*[\/\s\d.]+)?\)$/);
      if (rgbSpaceMatch) {
        return {
          r: parseInt(rgbSpaceMatch[1], 10),
          g: parseInt(rgbSpaceMatch[2], 10),
          b: parseInt(rgbSpaceMatch[3], 10)
        };
      }
      
      const hexMatch = s.match(/^#([a-f0-9]{3,8})$/);
      if (hexMatch) {
        let hex = hexMatch[1];
        if (hex.length === 3 || hex.length === 4) {
          hex = hex.split('').map(c => c + c).join('');
        }
        return {
          r: parseInt(hex.substring(0, 2), 16),
          g: parseInt(hex.substring(2, 4), 16),
          b: parseInt(hex.substring(4, 6), 16)
        };
      }

      const colors: Record<string, string> = {
        white: '#ffffff',
        black: '#000000',
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff',
        yellow: '#ffff00',
        orange: '#ffa500',
        purple: '#800080',
        pink: '#ffc0cb',
        cyan: '#00ffff',
        magenta: '#ff00ff',
        gray: '#808080',
        grey: '#808080',
        lightblue: '#add8e6',
        lightgreen: '#90ee90',
        lightyellow: '#ffffe0',
        lightpink: '#ffb6c1',
        lightcyan: '#e0ffff',
        lavender: '#e6e6fa'
      };

      if (colors[s]) {
        return parseToRgb(colors[s]);
      }
      
      return null;
    };

    const adjustContrast = () => {
      const nodes = elementRef.current?.querySelectorAll('.node');
      nodes?.forEach(node => {
        const shape = node.querySelector('.label-container, rect, circle, ellipse, polygon, path, [class*="label-container"]');
        if (!shape) return;
        
        const style = window.getComputedStyle(shape);
        let fill = shape.getAttribute('style')?.match(/fill:\s*([^;]+)/)?.[1] || 
                   shape.getAttribute('style')?.match(/background-color:\s*([^;]+)/)?.[1] ||
                   shape.getAttribute('style')?.match(/background:\s*([^;]+)/)?.[1];
        
        if (!fill || fill === 'none' || fill === 'transparent') {
          fill = (style.fill && style.fill !== 'none' && style.fill !== 'transparent') ? style.fill : style.backgroundColor;
        }
        
        if (fill && fill !== 'none' && fill !== 'transparent' && fill !== 'rgba(0, 0, 0, 0)') {
          const rgb = parseToRgb(fill);
          if (rgb) {
            const opacity = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
            const luminance = opacity / 255;
            const targetColor = luminance > 0.6 ? '#0f172a' : (theme === 'paper' ? '#0f172a' : '#f8fafc');
            const labels = node.querySelectorAll('text, span, div, p, a');
            labels.forEach(label => {
              (label as HTMLElement).style.setProperty('color', targetColor, 'important');
              (label as HTMLElement).style.setProperty('fill', targetColor, 'important');
            });
          }
        }
      });
    };

    adjustContrast();
    const timeout = setTimeout(adjustContrast, 50);
    return () => clearTimeout(timeout);
  }, [svg, loading, error, theme]);

  if (loading) {
    return (
      <div className="my-6 w-full h-[200px] border border-slate-850 bg-slate-950/60 rounded-2xl flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {t.generating_cognitive_map}
        </span>
      </div>
    );
  }

  if (error) {
    return <MermaidFallbackTimeline chartText={chartText} />;
  }

  const nd  = theme === 'paper' ? '#e2e8f0' : theme === 'focus' ? '#171717' : '#1e293b';
  const str = theme === 'paper' ? '#94a3b8' : theme === 'focus' ? '#404040' : '#475569';
  const txt = theme === 'paper' ? '#0f172a' : theme === 'focus' ? '#e5e5e5' : '#f8fafc';
  const edg = theme === 'paper' ? '#64748b' : theme === 'focus' ? '#525252' : '#64748b';
  const eTxt= theme === 'paper' ? '#475569' : theme === 'focus' ? '#a3a3a3' : '#94a3b8';
  const eBg = theme === 'paper' ? '#faf8f0' : theme === 'focus' ? '#000' : '#0f172a';
  const cssId = containerId.current;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isFullscreen) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    dragMoveAmount.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isFullscreen) return;
    if (isDragging) {
      const dx = (e.clientX - offset.x) - dragStart.current.x;
      const dy = (e.clientY - offset.y) - dragStart.current.y;
      dragMoveAmount.current += Math.sqrt(dx * dx + dy * dy);
      setOffset({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isFullscreen) return;
    e.preventDefault();
    
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    const zoomFactor = 1.15;
    const nextScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    const boundedScale = Math.max(0.1, Math.min(10, nextScale));
    
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    const nextOffsetX = offset.x + (clientX - cx - offset.x) * (1 - boundedScale / scale);
    const nextOffsetY = offset.y + (clientY - cy - offset.y) * (1 - boundedScale / scale);
    
    setScale(boundedScale);
    setOffset({ x: nextOffsetX, y: nextOffsetY });
  };

  const resetPanZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isFullscreen) return;
    if (dragMoveAmount.current >= 5) return;
    
    const target = e.target as HTMLElement;
    const isCanvasBg = target.classList.contains('canvas-bg') || target === e.currentTarget;
    const isRootSvg = target.tagName.toLowerCase() === 'svg';
    
    if (isCanvasBg || isRootSvg) {
      setIsFullscreen(false);
    }
  };

  // Extracted and moved useEffects above early returns

  const modalContent = isFullscreen && (
    <div 
      className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center select-none"
      onWheel={handleWheel}
    >
      {/* Sleek Floating Top Right Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFullscreen(false);
        }}
        className="absolute top-6 right-6 p-3 rounded-full bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-30 shadow-2xl cursor-pointer"
        title={language === 'FR' ? "Fermer (Échap)" : "Close (Esc)"}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Floating Controls (Bottom Center) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-slate-900/90 border border-slate-800/85 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-5 z-20 select-none"
      >
        <div className="flex flex-col text-left border-r border-slate-800/80 pr-5">
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
            {language === 'FR' ? "Carte Cognitive" : language === 'ES' ? "Mapa Cognitivo" : language === 'DE' ? "Kognitive Karte" : language === 'ZH' ? "认知地图" : language === 'PT' ? "Mapa Cognitivo" : language === 'AR' ? "خريطة معرفية" : language === 'HI' ? "संज्ञानात्मक मानचित्र" : language === 'UR' ? "معرفاتی نقشہ" : "Cognitive Map"}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            {language === 'FR' ? "Glisser pour déplacer • Molette pour zoomer" : language === 'ES' ? "Arrastrar para mover • Rueda para zoom" : language === 'DE' ? "Ziehen zum Verschieben • Scrollen zum Zoomen" : language === 'ZH' ? "拖动平移 • 滚动缩放" : language === 'PT' ? "Arraste para mover • Role para ampliar" : language === 'AR' ? "اسحب للتحريك • عجلة للتكبير" : language === 'HI' ? "खिंचें • स्क्रॉल करें" : language === 'UR' ? "ھیچیں ہلائیں • اسکرول کریں" : "Drag to Pan • Scroll to Zoom"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.min(10, prev * 1.25));
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-350 hover:text-white rounded-full transition-all cursor-pointer border border-slate-750"
            title={language === 'FR' ? "Zoomer" : language === 'ES' ? "Acercar" : language === 'DE' ? "Vergrößern" : language === 'ZH' ? "放大" : language === 'PT' ? "Ampliar" : language === 'AR' ? "تكبير" : language === 'HI' ? "ज़ूम इन" : language === 'UR' ? "زوم ان" : "Zoom In"}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.max(0.1, prev / 1.25));
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-350 hover:text-white rounded-full transition-all cursor-pointer border border-slate-750"
            title={language === 'FR' ? "Dézoomer" : language === 'ES' ? "Alejar" : language === 'DE' ? "Verkleinern" : language === 'ZH' ? "缩小" : language === 'PT' ? "Reduzir" : language === 'AR' ? "تصغير" : language === 'HI' ? "ज़ूम आउट" : language === 'UR' ? "زوم آؤٹ" : "Zoom Out"}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetPanZoom();
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-350 hover:text-white rounded-full transition-all cursor-pointer border border-slate-750"
            title={language === 'FR' ? "Réinitialiser" : language === 'ES' ? "Restablecer" : language === 'DE' ? "Zurücksetzen" : language === 'ZH' ? "重置视图" : language === 'PT' ? "Redefinir" : language === 'AR' ? "إعادة ضبط" : language === 'HI' ? "रीसेट" : language === 'UR' ? "ریسیٹ" : "Reset View"}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        className={`w-full h-full flex items-center justify-center overflow-hidden canvas-bg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        <div 
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            willChange: 'transform'
          }}
          className="max-w-[95vw] max-h-[90vh] flex items-center justify-center pointer-events-auto mermaid-fullscreen-svg-wrapper"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );

  return (
    <div className={`${getContainerClassName()} relative group/mermaid`}>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Root SVG ── */
        #${cssId} { font-family: 'Inter', system-ui, sans-serif !important; }
        #${cssId} svg { background: transparent !important; }
 
        /* ── All shape fills — catch every Mermaid v10 node variant ── */
        #${cssId} .node rect,
        #${cssId} .node circle,
        #${cssId} .node ellipse,
        #${cssId} .node polygon,
        #${cssId} .node path,
        #${cssId} .node .label-container,
        #${cssId} .label-container,
        #${cssId} div.label-container,
        #${cssId} .flowchart-label rect,
        #${cssId} .flowchart-label polygon,
        #${cssId} .flowchart-label ellipse,
        #${cssId} .nodeLabel rect,
        #${cssId} .cluster rect,
        #${cssId} .cluster polygon {
          fill:   ${nd}  !important;
          stroke: ${str} !important;
          stroke-width: 1.5px !important;
          ${theme !== 'dark' ? `background-color: ${nd} !important;` : ''}
        }
 
        /* ── All text / labels ── */
        #${cssId} text,
        #${cssId} span,
        #${cssId} .node .nodeLabel,
        #${cssId} .nodeLabel,
        #${cssId} .label,
        #${cssId} .label span,
        #${cssId} .label div,
        #${cssId} .flowchart-label,
        #${cssId} foreignObject div,
        #${cssId} foreignObject p,
        #${cssId} foreignObject span {
          fill:       ${txt} !important;
          color:      ${txt} !important;
          font-family:'Inter', system-ui, sans-serif !important;
          font-size:  14px !important;
          font-weight:500 !important;
        }
 
        /* ── Edges / arrows ── */
        #${cssId} .edgePath path,
        #${cssId} .flowchart-link,
        #${cssId} path.path,
        #${cssId} .arrowhead path {
          stroke:       ${edg} !important;
          stroke-width: 1.5px !important;
          fill:         none !important;
        }
        #${cssId} marker path,
        #${cssId} .arrowheadPath {
          fill:   ${edg} !important;
          stroke: ${edg} !important;
        }
 
        /* ── Edge labels ── */
        #${cssId} .edgeLabel,
        #${cssId} .edgeLabel span,
        #${cssId} .edgeLabel text,
        #${cssId} .edgeLabel rect {
          fill:             ${eBg}  !important;
          color:            ${eTxt} !important;
          background-color: ${eBg}  !important;
          font-size: 12px !important;
        }
 
        /* ── Cluster / subgraph ── */
        #${cssId} .cluster-label text,
        #${cssId} .cluster-label span {
          fill:  ${txt} !important;
          color: ${txt} !important;
        }

        /* ── Fullscreen fit-to-screen scaling ── */
        .mermaid-fullscreen-svg-wrapper #${cssId},
        .mermaid-fullscreen-svg-wrapper #${cssId} svg {
          width: 95vw !important;
          height: 90vh !important;
        }
      ` }} />
      
      <button
        onClick={() => {
          setIsFullscreen(true);
          resetPanZoom();
        }}
        className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-30 cursor-pointer shadow-md opacity-100"
        title={language === 'FR' ? "Plein écran" : language === 'ES' ? "Pantalla completa" : language === 'DE' ? "Vollbild" : language === 'ZH' ? "全屏" : language === 'PT' ? "Tela cheia" : language === 'AR' ? "شاشة كاملة" : language === 'HI' ? "पूर्ण स्क्रीन" : language === 'UR' ? "فل اسکرین" : "Fullscreen"}
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      <div
        ref={elementRef}
        className="w-full flex items-center justify-center overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {mounted && isFullscreen && typeof document !== 'undefined'
        ? createPortal(modalContent, document.body)
        : null}
    </div>
  );
};
