"use client";

import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { MermaidStrings } from './strings';

interface FullscreenModalProps {
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
  svg: string;
  t: MermaidStrings;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
  isFullscreen,
  setIsFullscreen,
  svg,
  t,
}) => {
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragMoveAmount = useRef(0);

  if (!isFullscreen || typeof document === 'undefined') return null;

  const resetPanZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    dragMoveAmount.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
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

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (dragMoveAmount.current >= 5) return;
    const target = e.target as HTMLElement;
    const isCanvasBg = target.classList.contains('canvas-bg') || target === e.currentTarget;
    const isRootSvg = target.tagName.toLowerCase() === 'svg';
    if (isCanvasBg || isRootSvg) {
      setIsFullscreen(false);
    }
  };

  return createPortal(
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
        title={t.closeEsc}
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
            {t.cognitiveMap}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            {t.dragHint}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.min(10, prev * 1.25));
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-all cursor-pointer border border-slate-700"
            title={t.zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.max(0.1, prev / 1.25));
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-all cursor-pointer border border-slate-700"
            title={t.zoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetPanZoom();
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-all cursor-pointer border border-slate-700"
            title={t.resetView}
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
    </div>,
    document.body
  );
};
