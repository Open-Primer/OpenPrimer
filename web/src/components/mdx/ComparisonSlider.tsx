"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ComparisonSliderProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
}

export const ComparisonSlider = ({
  beforeLabel = "Avant",
  afterLabel = "Après",
  beforeContent,
  afterContent
}: ComparisonSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="my-8 space-y-4">
      <div 
        ref={containerRef}
        className="relative aspect-video w-full rounded-[24px] border border-slate-800 bg-slate-950 overflow-hidden select-none shadow-2xl group cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* After Content (Bottom Layer) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {afterContent}
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-400">
            {afterLabel}
          </div>
        </div>

        {/* Before Content (Top Layer, clipped) */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ clipPath: `inset(0px ${100 - sliderPosition}% 0px 0px)` }}
        >
          {beforeContent}
          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-blue-400">
            {beforeLabel}
          </div>
        </div>

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
        👈 Glissez le curseur pour comparer les deux états 👉
      </p>
    </div>
  );
};
