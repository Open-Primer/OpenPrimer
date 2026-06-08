"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface MermaidProps {
  chart: string;
}

let mermaidInstance: any = null;

const sanitizeMermaidChart = (chartText: string): string => {
  let sanitized = chartText;

  // 1. Remove standard markdown blocks if any
  sanitized = sanitized.replace(/```mermaid/g, '').replace(/```/g, '').trim();

  // 2. Fix unquoted node labels with special characters to prevent Mermaid parser crashes.
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
          themeVariables: currentThemeConfig.themeVariables
        });

        if (!active) return;

        // Sanitize chart structure & quotes
        const cleanedChart = sanitizeMermaidChart(chart);

        // Render diagram
        const { svg: renderedSvg } = await mermaidInstance.render(containerId.current, cleanedChart);
        
        if (active) {
          setSvg(renderedSvg);
          setLoading(false);
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
    return (
      <div className="my-6 p-6 border border-red-500/20 bg-red-500/5 rounded-2xl text-left space-y-3">
        <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>Erreur de rendu du diagramme cognitif</span>
        </div>
        <pre className="text-[10px] text-red-300 bg-slate-950 p-4 rounded-xl overflow-x-auto font-mono max-h-[120px] leading-relaxed">
          {error}
        </pre>
      </div>
    );
  }

  return (
    <div className={getContainerClassName()}>
      <style dangerouslySetInnerHTML={{ __html: `
        #${containerId.current} text,
        #${containerId.current} .node label,
        #${containerId.current} .node span {
          fill: ${theme === 'paper' ? '#0f172a' : theme === 'focus' ? '#e5e5e5' : '#f8fafc'} !important;
          color: ${theme === 'paper' ? '#0f172a' : theme === 'focus' ? '#e5e5e5' : '#f8fafc'} !important;
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
        #${containerId.current} .edgeLabel text {
          fill: ${theme === 'paper' ? '#475569' : theme === 'focus' ? '#a3a3a3' : '#94a3b8'} !important;
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
