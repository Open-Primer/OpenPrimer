"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ComparisonSliderProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
  layout?: 'clip' | 'split';
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

const SLIDER_STRINGS = {
  EN: {
    before: "Before",
    after: "After",
    hint: "👈 Drag slider to compare states 👉"
  },
  FR: {
    before: "Avant",
    after: "Après",
    hint: "👈 Glissez le curseur pour comparer 👉"
  },
  ES: {
    before: "Antes",
    after: "Después",
    hint: "👈 Arrastre el control deslizante para comparar 👉"
  },
  DE: {
    before: "Vorher",
    after: "Nachher",
    hint: "👈 Regler ziehen, um zu vergleichen 👉"
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
  layout,
  gradeLevel
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

  const isSplit = layout === 'split';

  const isImageUrl = (val: any): boolean => {
    if (typeof val !== 'string') return false;
    const s = val.trim();
    return (
      s.startsWith('/') ||
      s.startsWith('http://') ||
      s.startsWith('https://') ||
      /\.(png|jpe?g|gif|svg|webp)($|\?)/i.test(s)
    );
  };

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
    if (isImageUrl(content)) {
      return (
        <img 
          src={content as string} 
          alt="" 
          className="w-full h-full object-cover object-center pointer-events-none" 
        />
      );
    }

    if (typeof content === 'string' || content === null || content === undefined) {
      let rawText = typeof content === 'string' ? content : '';
      if (rawText.startsWith('!')) {
        rawText = rawText.substring(1);
      }
      const text = rawText.replace(/<[^>]+>/g, '').trim();
      const gradientClass = isBefore 
        ? "bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950" 
        : "bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950";
      const borderClass = isBefore ? "border-blue-500/20" : "border-emerald-500/20";
      
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center border ${borderClass} ${gradientClass} bg-slate-950 transition-all duration-300`}>
          <div className="max-w-md space-y-3">
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
