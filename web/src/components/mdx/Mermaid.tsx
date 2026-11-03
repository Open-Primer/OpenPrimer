"use client";

import React, { useEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import { useMdxStatus } from './MdxStatusContext';
import { decodeHtmlEntities, getTextFromChildren, sanitizeMermaidChart } from './mermaid/sanitizer';
import { getMermaidStrings } from './mermaid/strings';
import { FullscreenModal } from './mermaid/FullscreenModal';

export { decodeHtmlEntities, getTextFromChildren, sanitizeMermaidChart } from './mermaid/sanitizer';
export { getMermaidStrings, MERMAID_STRINGS } from './mermaid/strings';
import { MermaidFallbackTimeline } from './mermaid/MermaidFallbackTimeline';
import { adjustNodeContrast, parseToRgb } from './mermaid/contrast';

export { FullscreenModal } from './mermaid/FullscreenModal';
export { MermaidFallbackTimeline } from './mermaid/MermaidFallbackTimeline';
export { adjustNodeContrast, parseToRgb } from './mermaid/contrast';

interface MermaidProps {
  chart?: string;
  children?: React.ReactNode;
}

let mermaidInstance: any = null;

export const Mermaid = ({ chart, children }: MermaidProps) => {
  const { language } = useLanguage();
  const t = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const { markDegraded } = useMdxStatus();
  
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
  const reactId = useId();
  const containerId = "mermaid-" + reactId.replace(/:/g, '');
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
      // Fail-fast guard for empty chartText to prevent infinite loading spinners or crashes
      if (!chartText || !chartText.trim()) {
        if (active) {
          setError("Empty chart content provided.");
          setLoading(false);
          markDegraded('widget');
        }
        return;
      }

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

        // Render diagram safely using a sandbox temporary div with a timeout safeguard
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.visibility = 'hidden';
        document.body.appendChild(tempDiv);
        
        let timeoutId: any;
        try {
          const renderPromise = mermaidInstance.render(containerId, cleanedChart, tempDiv);
          const timeoutPromise = new Promise<{ svg: string }>((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error("Mermaid render timeout")), 3500);
          });

          const res = await Promise.race([renderPromise, timeoutPromise]);
          clearTimeout(timeoutId);

          if (active) {
            setSvg(res.svg);
            setLoading(false);
          }
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
          tempDiv.remove();
        }
      } catch (err: any) {
        console.error("Mermaid compilation error:", err);
        if (active) {
          setError(err.message || "Failed to render flowchart. Check syntax.");
          setLoading(false);
          markDegraded('widget');
        }
        
        // Reset mermaid's internal error state in DOM if possible
        const badge = document.getElementById(`d${containerId}`);
        if (badge) badge.remove();
      }
    };

    renderChart();

    return () => {
      active = false;
    };
  }, [chartText, theme, markDegraded]);

  const getContainerClassName = () => {
    if (theme === 'paper') {
      return "my-6 p-6 border border-[#dbd5be] bg-[#faf8f0] rounded-2xl flex flex-col items-center justify-center overflow-x-auto select-none shadow-sm";
    }
    if (theme === 'focus') {
      return "my-6 p-6 border border-[#262626] bg-[#000000] rounded-2xl flex flex-col items-center justify-center overflow-x-auto select-none";
    }
    return "my-6 p-6 border border-slate-800 bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center overflow-x-auto select-none backdrop-blur-md shadow-inner";
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
    
    const runContrast = () => adjustNodeContrast(elementRef.current, theme);
    runContrast();
    const timeout = setTimeout(runContrast, 50);
    return () => clearTimeout(timeout);
  }, [svg, loading, error, theme]);

  if (loading) {
    return (
      <div className="my-6 w-full h-[200px] border border-slate-800 bg-slate-950/60 rounded-2xl flex flex-col items-center justify-center gap-3">
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
  const cssId = containerId;

  const resetPanZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const modalContent = (
    <FullscreenModal
      isFullscreen={isFullscreen}
      setIsFullscreen={setIsFullscreen}
      svg={svg}
      t={ms}
    />
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
        title={ms.fullscreen}
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
