"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface MermaidProps {
  chart: string;
}

let mermaidInstance: any = null;

export const Mermaid = ({ chart }: MermaidProps) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const containerId = useRef(`mermaid-${Math.floor(Math.random() * 1000000)}`);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    const renderChart = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!mermaidInstance) {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            themeVariables: {
              background: '#020617',
              primaryColor: '#1e293b',
              primaryTextColor: '#f8fafc',
              lineColor: '#64748b',
              secondaryColor: '#0f172a',
              tertiaryColor: '#1e1b4b',
            }
          });
          mermaidInstance = mermaid;
        }

        if (!active) return;

        // Strip backticks if any
        const cleanedChart = chart.replace(/```mermaid/g, '').replace(/```/g, '').trim();

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
  }, [chart]);

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
          <span>Erreur de rendu du diagramme cognitive</span>
        </div>
        <pre className="text-[10px] text-red-300 bg-slate-950 p-4 rounded-xl overflow-x-auto font-mono max-h-[120px] leading-relaxed">
          {error}
        </pre>
      </div>
    );
  }

  return (
    <div 
      ref={elementRef}
      className="my-6 p-6 border border-slate-850 bg-slate-950/40 rounded-2xl flex items-center justify-center overflow-x-auto select-none backdrop-blur-md shadow-inner"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
