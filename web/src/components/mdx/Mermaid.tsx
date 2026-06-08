"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface MermaidProps {
  chart: string;
}

let mermaidInstance: any = null;

const sanitizeMermaidChart = (chartText: string): string => {
  let sanitized = chartText;

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
  const nodes = parseMermaidFallbackNodes(chartText);

  if (nodes.length === 0) {
    return (
      <div className="w-full p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3 backdrop-blur-xl my-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-branch"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
        </div>
        <h4 className="text-slate-200 text-sm font-black uppercase tracking-wider">Concept Graph</h4>
        <p className="text-slate-400 text-xs italic">Cognitive flow diagram is loaded. Double tap to expand details.</p>
      </div>
    );
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
          <h4 className="text-slate-200 text-xs font-black uppercase tracking-[0.2em]">Séquence d'Apprentissage</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cheminement logique des concepts clés</p>
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
                Concept {index + 1}
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

export const Mermaid = ({ chart }: MermaidProps) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'paper' | 'focus' | 'dark'>('dark');
  const containerId = useRef(`mermaid-${Math.floor(Math.random() * 1000000)}`);
  const elementRef = useRef<HTMLDivElement>(null);

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

        let currentThemeConfig = {
          theme: 'dark',
          themeVariables: {
            background: '#020617',
            primaryColor: '#1e293b',
            primaryTextColor: '#f8fafc',
            lineColor: '#475569',
            secondaryColor: '#0f172a',
            tertiaryColor: '#1e1b4b',
          }
        };

        if (theme === 'paper') {
          currentThemeConfig = {
            theme: 'default',
            themeVariables: {
              background: '#fcfaf2',
              primaryColor: '#f1f5f9',
              primaryTextColor: '#0f172a',
              lineColor: '#64748b',
              secondaryColor: '#f8fafc',
              tertiaryColor: '#e2e8f0',
            }
          };
        } else if (theme === 'focus') {
          currentThemeConfig = {
            theme: 'neutral',
            themeVariables: {
              background: '#000000',
              primaryColor: '#171717',
              primaryTextColor: '#e5e5e5',
              lineColor: '#737373',
              secondaryColor: '#0a0a0a',
              tertiaryColor: '#262626',
            }
          };
        }

        if (!mermaidInstance) {
          const mermaid = (await import('mermaid')).default;
          mermaidInstance = mermaid;
        }

        mermaidInstance.initialize({
          startOnLoad: false,
          theme: currentThemeConfig.theme as any,
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          themeVariables: {
            ...currentThemeConfig.themeVariables,
            fontSize: '13px',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }
        });

        if (!active) return;

        // Sanitize chart structure & quotes
        const cleanedChart = sanitizeMermaidChart(chart);

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
            setLoading(false);
          }
        } finally {
          tempDiv.remove();
        }
      } catch (err: any) {
        console.error("Mermaid compilation error:", err);
        if (active) {
          setError(err.message || "Failed to render flowchart. Check syntax.");
          setLoading(false);
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
  }, [chart, theme]);

  const getContainerClassName = () => {
    if (theme === 'paper') {
      return "my-6 p-6 border border-[#dbd5be] bg-[#faf8f0] rounded-2xl flex flex-col items-center justify-center overflow-x-auto select-none shadow-sm";
    }
    if (theme === 'focus') {
      return "my-6 p-6 border border-[#262626] bg-[#000000] rounded-2xl flex flex-col items-center justify-center overflow-x-auto select-none";
    }
    return "my-6 p-6 border border-slate-850 bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center overflow-x-auto select-none backdrop-blur-md shadow-inner";
  };

  if (loading) {
    return (
      <div className="my-6 w-full h-[200px] border border-slate-850 bg-slate-950/60 rounded-2xl flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Génération du schéma cognito-visuel...
        </span>
      </div>
    );
  }

  if (error) {
    return <MermaidFallbackTimeline chartText={chart} />;
  }

  return (
    <div className={getContainerClassName()}>
      <style dangerouslySetInnerHTML={{ __html: `
        #${containerId.current} {
          font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        }
        #${containerId.current} text,
        #${containerId.current} .node label,
        #${containerId.current} .node span {
          fill: ${theme === 'paper' ? '#0f172a' : theme === 'focus' ? '#e5e5e5' : '#f8fafc'} !important;
          color: ${theme === 'paper' ? '#0f172a' : theme === 'focus' ? '#e5e5e5' : '#f8fafc'} !important;
          font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
          font-size: 13px !important;
        }
        #${containerId.current} .node rect,
        #${containerId.current} .node circle,
        #${containerId.current} .node polygon,
        #${containerId.current} .node path {
          fill: ${theme === 'paper' ? '#f1f5f9' : theme === 'focus' ? '#171717' : '#1e293b'} !important;
          stroke: ${theme === 'paper' ? '#94a3b8' : theme === 'focus' ? '#404040' : '#475569'} !important;
        }
        #${containerId.current} .edgePath .path {
          stroke: ${theme === 'paper' ? '#64748b' : theme === 'focus' ? '#737373' : '#64748b'} !important;
        }
        #${containerId.current} .edgeLabel text,
        #${containerId.current} .edgeLabel span {
          fill: ${theme === 'paper' ? '#475569' : theme === 'focus' ? '#a3a3a3' : '#94a3b8'} !important;
          font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
          font-size: 11px !important;
        }
      ` }} />
      <div 
        ref={elementRef}
        className="w-full flex items-center justify-center overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
};
