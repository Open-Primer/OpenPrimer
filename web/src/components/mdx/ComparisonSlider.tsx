"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ComparisonSliderProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
  layout?: 'clip' | 'split';
}

const SLIDER_STRINGS = {
  EN: {
    before: "Before",
    after: "After",
    hint: "👈 Drag slider to compare both states 👉"
  },
  FR: {
    before: "Avant",
    after: "Après",
    hint: "👈 Glissez le curseur pour comparer les deux états 👉"
  },
  ES: {
    before: "Antes",
    after: "Después",
    hint: "👈 Deslice le curseur pour comparer les deux états 👉"
  },
  DE: {
    before: "Vorher",
    after: "Nachher",
    hint: "👈 Schieben Sie den Regler, um beide Zustände zu vergleichen 👉"
  },
  ZH: {
    before: "之前",
    after: "之后",
    hint: "👈 拖动滑块以对比两种状态 👉"
  }
};

export const ComparisonSlider = ({
  beforeLabel,
  afterLabel,
  beforeContent,
  afterContent,
  layout
}: ComparisonSliderProps) => {
  const { language } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof SLIDER_STRINGS;
  const t = SLIDER_STRINGS[activeLang] || SLIDER_STRINGS.EN;

  const finalBeforeLabel = beforeLabel || t.before;
  const finalAfterLabel = afterLabel || t.after;
  const finalHint = t.hint;

  const isSplit = layout === 'split' || (
    layout !== 'clip' &&
    typeof beforeContent === 'string' &&
    typeof afterContent === 'string'
  );

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const renderSliderContent = (content: React.ReactNode, isBefore: boolean) => {
    if (typeof content === 'string' || content === null || content === undefined) {
      const rawText = typeof content === 'string' ? content : '';
      const text = rawText.replace(/<[^>]+>/g, '').trim();
      const gradientClass = isBefore 
        ? "bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950" 
        : "bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950";
      const borderClass = isBefore ? "border-blue-500/20" : "border-emerald-500/20";
      
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center border ${borderClass} ${gradientClass} bg-slate-950 transition-all duration-300`}>
          <div className="max-w-md space-y-3">
            <div className="flex justify-center">
              {isBefore ? (
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/></svg>
                </div>
              )}
            </div>
            <p className="text-slate-200 text-xs md:text-sm font-semibold leading-relaxed font-sans px-2 overflow-y-auto max-h-[140px] custom-scrollbar">
              {text}
            </p>
          </div>
        </div>
      );
    }
    return <div className="w-full h-full">{content}</div>;
  };

  return (
    <div className="my-8 space-y-4">
      <div 
        ref={containerRef}
        className="relative aspect-video w-full rounded-[24px] border border-slate-800 bg-slate-950 overflow-hidden select-none shadow-2xl group cursor-ew-resize flex"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {isSplit ? (
          <>
            {/* Before Content (Left Side) */}
            <div 
              className="h-full relative overflow-hidden border-r border-slate-800/40"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="absolute inset-0 w-full h-full min-w-[120px]">
                {renderSliderContent(beforeContent, true)}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-blue-400 pointer-events-none">
                  {finalBeforeLabel}
                </div>
              </div>
            </div>

            {/* After Content (Right Side) */}
            <div 
              className="h-full relative overflow-hidden flex-1"
            >
              <div className="absolute inset-0 w-full h-full min-w-[120px]">
                {renderSliderContent(afterContent, false)}
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-400 pointer-events-none">
                  {finalAfterLabel}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* After Content (Bottom Layer) */}
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ clipPath: `inset(0px 0px 0px ${sliderPosition}%)` }}
            >
              {renderSliderContent(afterContent, false)}
              <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-400">
                {finalAfterLabel}
              </div>
            </div>

            {/* Before Content (Top Layer, clipped) */}
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              style={{ clipPath: `inset(0px ${100 - sliderPosition}% 0px 0px)` }}
            >
              {renderSliderContent(beforeContent, true)}
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-blue-400">
                {finalBeforeLabel}
              </div>
            </div>
          </>
        )}

        {/* Sliding Line Divider */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400/50 group-hover:bg-emerald-500/80 transition-colors z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Glass Slider Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full border border-slate-700/50 bg-slate-900/90 backdrop-blur-lg shadow-xl shadow-black/40 flex items-center justify-center cursor-ew-resize hover:scale-105 active:scale-95 transition-transform group-hover:border-emerald-500/30">
            <div className="flex items-center gap-1">
              <span className="block w-1.5 h-3 border-l-2 border-r-2 border-slate-400 group-hover:border-emerald-400"></span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-wider italic">
        {finalHint}
      </p>
    </div>
  );
};
