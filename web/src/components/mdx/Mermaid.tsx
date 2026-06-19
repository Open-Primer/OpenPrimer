"use client";

import React, { useEffect, useRef, useState } from 'react';
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

  // Match ID followed by bracket/parentheses and a quoted or unquoted string
  const regex = /\b([a-zA-Z0-9_-]+)(?:\["|\[|\|"|\("|\()([^"\]\)\n\r]+)(?:"\]|\]|"\||"\)|\))/g;
  let match;
  while ((match = regex.exec(chartText)) !== null) {
    const id = match[1];
    const label = match[2].trim();
    if (!seenIds.has(id) && label && !['graph', 'flowchart', 'subgraph', 'end', 'click', 'style', 'classdef'].includes(id.toLowerCase())) {
      seenIds.add(id);
      nodes.push({ id, label });
    }
  }

  // If no nodes found, try to extract any quoted strings as labels
  if (nodes.length === 0) {
    const quoteRegex = /"([^"]+)"/g;
    let index = 0;
    while ((match = quoteRegex.exec(chartText)) !== null) {
      const label = match[1].trim();
      const id = `node-${index++}`;
      if (label && label.length > 1) {
        nodes.push({ id, label });
      }
    }
  }

  return nodes;
};

const MermaidFallbackTimeline = ({ chartText }: { chartText: string }) => {
  const { language } = useLanguage();
  const t = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const nodes = parseMermaidFallbackNodes(chartText);

  if (nodes.length === 0) {
    return null;
  }

  return (
    <div className="my-8 w-full p-8 rounded-[40px] bg-slate-950/40 border border-slate-900 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left">
      {/* Background Decorative Glow */}
      <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-10 border-b border-slate-900 pb-5">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-route"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
        </div>
        <div>
          <h4 className="text-slate-200 text-xs font-black uppercase tracking-[0.2em]">{t.learning_sequence}</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.logical_flow}</p>
        </div>
      </div>

      <div className="relative pl-8 space-y-8">
        {/* Connector Line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-0.5 border-l-2 border-dashed border-slate-800" />

        {nodes.map((node, index) => (
          <div key={node.id} className="relative group flex items-start gap-6 transition-all duration-300">
            {/* Dot Indicator */}
            <div className="absolute -left-[31px] mt-1 w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center z-10 group-hover:border-indigo-500/50 group-hover:bg-indigo-950/20 transition-all duration-300 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
            </div>

            {/* Content Card */}
            <div className="flex-1 p-5 rounded-2xl border border-slate-900/60 bg-slate-900/10 hover:bg-slate-900/30 hover:border-slate-800/80 transition-all duration-300 backdrop-blur-md">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1 select-none">
                {t.concept_step} {index + 1}
              </span>
              <h5 className="text-slate-200 font-bold text-sm group-hover:text-white transition-colors">
                {node.label}
              </h5>
            </div>
          </div>
        ))}
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
  const isFr = language.toLowerCase() === 'fr';
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
            {title || (isFr ? "Frise Chronologique" : "Timeline")}
          </h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            {isFr ? "Déroulement Historique" : "Historical Sequence"}
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
        const shape = node.querySelector('.label-container, rect, circle, ellipse, polygon, path');
        if (!shape) return;
        
        const style = window.getComputedStyle(shape);
        const fill = shape.getAttribute('style')?.match(/fill:\s*([^;]+)/)?.[1] || style.fill;
        
        if (fill && fill !== 'none' && fill !== 'transparent') {
          const rgb = parseToRgb(fill);
          if (rgb) {
            const opacity = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
            const luminance = opacity / 255;
            if (luminance > 0.6) {
              const labels = node.querySelectorAll('text, span, div, p, a');
              labels.forEach(label => {
                (label as HTMLElement).style.setProperty('color', '#0f172a', 'important');
                (label as HTMLElement).style.setProperty('fill', '#0f172a', 'important');
              });
            }
          }
        }
      });
    };

    adjustContrast();
    const timeout = setTimeout(adjustContrast, 50);
    return () => clearTimeout(timeout);
  }, [svg, loading, error]);

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
  const id  = containerId.current;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isFullscreen) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isFullscreen) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isFullscreen) return;
    e.preventDefault();
    const zoomFactor = 1.1;
    const nextScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    setScale(Math.max(0.1, Math.min(10, nextScale)));
  };

  const resetPanZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // Extracted and moved useEffects above early returns

  return (
    <div className={`${getContainerClassName()} relative group/mermaid`}>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Root SVG ── */
        #${id} { font-family: 'Inter', system-ui, sans-serif !important; }
        #${id} svg { background: transparent !important; }
 
        /* ── All shape fills — catch every Mermaid v10 node variant ── */
        #${id} .node rect,
        #${id} .node circle,
        #${id} .node ellipse,
        #${id} .node polygon,
        #${id} .node path,
        #${id} .node .label-container,
        #${id} .flowchart-label rect,
        #${id} .flowchart-label polygon,
        #${id} .flowchart-label ellipse,
        #${id} .nodeLabel rect,
        #${id} .cluster rect,
        #${id} .cluster polygon {
          fill:   ${nd}  !important;
          stroke: ${str} !important;
          stroke-width: 1.5px !important;
        }
 
        /* ── All text / labels ── */
        #${id} text,
        #${id} span,
        #${id} .node .nodeLabel,
        #${id} .nodeLabel,
        #${id} .label,
        #${id} .label span,
        #${id} .label div,
        #${id} .flowchart-label,
        #${id} foreignObject div,
        #${id} foreignObject p,
        #${id} foreignObject span {
          fill:       ${txt} !important;
          color:      ${txt} !important;
          font-family:'Inter', system-ui, sans-serif !important;
          font-size:  14px !important;
          font-weight:500 !important;
        }
 
        /* ── Edges / arrows ── */
        #${id} .edgePath path,
        #${id} .flowchart-link,
        #${id} path.path,
        #${id} .arrowhead path {
          stroke:       ${edg} !important;
          stroke-width: 1.5px !important;
          fill:         none !important;
        }
        #${id} marker path,
        #${id} .arrowheadPath {
          fill:   ${edg} !important;
          stroke: ${edg} !important;
        }
 
        /* ── Edge labels ── */
        #${id} .edgeLabel,
        #${id} .edgeLabel span,
        #${id} .edgeLabel text,
        #${id} .edgeLabel rect {
          fill:             ${eBg}  !important;
          color:            ${eTxt} !important;
          background-color: ${eBg}  !important;
          font-size: 12px !important;
        }
 
        /* ── Cluster / subgraph ── */
        #${id} .cluster-label text,
        #${id} .cluster-label span {
          fill:  ${txt} !important;
          color: ${txt} !important;
        }
      ` }} />
      
      <button
        onClick={() => {
          setIsFullscreen(true);
          resetPanZoom();
        }}
        className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all opacity-100 md:opacity-0 md:group-hover/mermaid:opacity-100 z-10 cursor-pointer shadow-md"
        title={language === 'FR' ? "Plein écran" : "Fullscreen"}
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      <div
        ref={elementRef}
        className="w-full flex items-center justify-center overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center select-none"
          onWheel={handleWheel}
        >
          {/* Top toolbar */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Move className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-white text-xs font-black uppercase tracking-wider">
                  {language === 'FR' ? "Explorateur de Carte Cognitive" : "Cognitive Map Explorer"}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  {language === 'FR' ? "Glissez pour déplacer • Molette pour zoomer" : "Drag to Pan • Scroll to Zoom"}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale(prev => Math.min(10, prev * 1.2))}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-750 transition-all cursor-pointer"
                title={language === 'FR' ? "Zoomer" : "Zoom In"}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setScale(prev => Math.max(0.1, prev / 1.2))}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-750 transition-all cursor-pointer"
                title={language === 'FR' ? "Dézoomer" : "Zoom Out"}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetPanZoom}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-750 transition-all cursor-pointer"
                title={language === 'FR' ? "Réinitialiser" : "Reset View"}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg border border-rose-500/30 transition-all cursor-pointer ml-4"
                title={language === 'FR' ? "Fermer" : "Close (Esc)"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Map canvas */}
          <div 
            className={`w-full h-full flex items-center justify-center overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                willChange: 'transform'
              }}
              className="max-w-[95vw] max-h-[90vh] flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
