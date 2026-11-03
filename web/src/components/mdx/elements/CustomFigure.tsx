"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * @file CustomFigure.tsx
 * @description Advanced zoomable image and pedagogical figure viewer with pan, zoom and attribution links.
 */

const isExistingArtwork = (src: string, label: string): boolean => {
  const text = `${src} ${label}`.toLowerCase();
  const decoded = decodeURIComponent(text);
  
  const keywords = [
    'peinture', 'painting', 'tableau', 'fresco', 'fresque', 'oil on canvas', 'huile sur toile', 'watercolor', 'aquarelle',
    'sculpture', 'statue', 'bust', 'buste', 'marble', 'marbre', 'bronze',
    'photo', 'photograph', 'photographie', 'daguerreotype',
    'mona lisa', 'joconde', 'starry night', 'nuit étoilée', 'nuit etoilee', 'ménines', 'menines', 'guernica', 
    'last supper', 'cène', 'cene', 'david', 'venus de milo', 'penseur', 'thinker', 'laocoon', 'nefertiti', 'scream', 'cri',
    'birth of venus', 'naissance de vénus', 'naissance de venus', 'girl with a pearl earring', 'jeune fille à la perle',
    'liberté guidant le peuple', 'liberty leading the people', 'le baiser', 'the kiss',
    'da vinci', 'leonardo da vinci', 'vincent van gogh', 'van gogh', 'michelangelo', 'michel-ange', 'picasso', 
    'velázquez', 'velazquez', 'rembrandt', 'vermeer', 'claude monet', 'monet', 'edouard manet', 'manet', 
    'auguste renoir', 'renoir', 'edgar degas', 'degas', 'salvador dali', 'dali', 'rene magritte', 'magritte', 
    'gustav klimt', 'klimt', 'edvard munch', 'munch', 'auguste rodin', 'rodin', 'botticelli'
  ];
  
  return keywords.some(kw => decoded.includes(kw));
};

const FIGURE_STRINGS: Record<string, string> = {
  EN: "Figure",
  FR: "Figure",
  ES: "Figura",
  DE: "Abbildung",
  ZH: "图",
  PT: "Figura",
  AR: "الشكل",
  HI: "चित्र",
  UR: "خاکہ"
};

const ZoomableImage = ({ 
  src, 
  alt, 
  className, 
  onError, 
  ...props 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  onError?: () => void;
  [key: string]: any;
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const { language } = useLanguage();

  const dragStart = React.useRef({ x: 0, y: 0 });
  const dragMoveAmount = React.useRef(0);

  React.useEffect(() => {
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
    if (isCanvasBg) {
      setIsFullscreen(false);
    }
  };

  const langKey = (language?.toUpperCase() || 'EN') as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR';
  const modalT = {
    EN: {
      close: "Close (Esc)",
      zoom_fig: "Figure Zoom",
      drag_pan: "Drag to Pan • Scroll to Zoom",
      zoom_in: "Zoom In",
      zoom_out: "Zoom Out",
      reset: "Reset View",
      maximize: "Maximize image"
    },
    FR: {
      close: "Fermer (Échap)",
      zoom_fig: "Zoom Figure",
      drag_pan: "Glisser pour déplacer • Molette pour zoomer",
      zoom_in: "Zoomer",
      zoom_out: "Dézoomer",
      reset: "Réinitialiser",
      maximize: "Agrandir l'image"
    },
    ES: {
      close: "Cerrar (Esc)",
      zoom_fig: "Zoom de Figura",
      drag_pan: "Arrastrar para desplazar • Rueda para hacer zoom",
      zoom_in: "Acercar",
      zoom_out: "Alejar",
      reset: "Restablecer",
      maximize: "Maximizar imagen"
    },
    DE: {
      close: "Schließen (Esc)",
      zoom_fig: "Bild-Zoom",
      drag_pan: "Ziehen zum Verschieben • Scrollen zum Zoomen",
      zoom_in: "Vergrößern",
      zoom_out: "Verkleinern",
      reset: "Ansicht zurücksetzen",
      maximize: "Bild maximieren"
    },
    ZH: {
      close: "关闭 (Esc)",
      zoom_fig: "图片缩放",
      drag_pan: "拖拽以平移 • 滚轮以缩放",
      zoom_in: "放大",
      zoom_out: "缩小",
      reset: "重置视图",
      maximize: "放大图片"
    },
    PT: {
      close: "Fechar (Esc)",
      zoom_fig: "Zoom da Imagem",
      drag_pan: "Arraste para mover • Roda para aproximar",
      zoom_in: "Aproximar",
      zoom_out: "Afastar",
      reset: "Repor Vista",
      maximize: "Maximizar imagem"
    },
    AR: {
      close: "إغلاق (Esc)",
      zoom_fig: "تكبير الصورة",
      drag_pan: "السحب للتحريك • التمرير للتكبير",
      zoom_in: "تكبير",
      zoom_out: "تصغير",
      reset: "إعادة ضبط",
      maximize: "تكبير الصورة"
    },
    HI: {
      close: "बंद करें (Esc)",
      zoom_fig: "चित्र ज़ूम",
      drag_pan: "स्थानांतरित करने के लिए खींचें • ज़ूम करने के लिए स्क्रॉल करें",
      zoom_in: "ज़ूम इन",
      zoom_out: "ज़ूम आउट",
      reset: "दृश्य रीसेट करें",
      maximize: "चित्र बड़ा करें"
    },
    UR: {
      close: "بند کریں (Esc)",
      zoom_fig: "تصویر زوم",
      drag_pan: "پین کرنے کے لیے گھسیٹیں • زوم کرنے کے لیے اسکرول کریں",
      zoom_in: "زوم ان",
      zoom_out: "زوم آؤٹ",
      reset: "ری سیٹ کریں",
      maximize: "تصویر بڑی کریں"
    }
  };
  const t = modalT[langKey] || modalT.EN;

  const modalPortal = isFullscreen && typeof document !== 'undefined' && createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center select-none"
      onWheel={handleWheel}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFullscreen(false);
        }}
        className="absolute top-6 right-6 p-3 rounded-full bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-30 shadow-2xl cursor-pointer"
        title={t.close}
      >
        <X className="w-5 h-5" />
      </button>
 
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-slate-900/90 border border-slate-800/85 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-5 z-20 select-none"
      >
        <div className="flex flex-col text-left border-r border-slate-800/80 pr-5">
          <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest">
            {t.zoom_fig}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            {t.drag_pan}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.min(10, prev * 1.25));
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-350 hover:text-white rounded-full transition-all cursor-pointer border border-slate-750"
            title={t.zoom_in}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setScale(prev => Math.max(0.1, prev / 1.25));
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-350 hover:text-white rounded-full transition-all cursor-pointer border border-slate-750"
            title={t.zoom_out}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetPanZoom();
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-350 hover:text-white rounded-full transition-all cursor-pointer border border-slate-750"
            title={t.reset}
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
        <img 
          src={src} 
          alt={alt}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            willChange: 'transform'
          }}
          className="max-w-[95vw] max-h-[90vh] object-contain pointer-events-auto shadow-2xl rounded-xl"
        />
      </div>
    </div>,
    document.body
  );

  return (
    <div className="relative group/zoomable w-full flex items-center justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFullscreen(true);
        }}
        className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-10 cursor-pointer shadow-md opacity-0 group-hover/zoomable:opacity-100 focus/zoomable:opacity-100 duration-200"
        title={t.maximize}
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      <img 
        src={src} 
        alt={alt} 
        className={className}
        onError={onError}
        onClick={() => setIsFullscreen(true)}
        style={{ cursor: 'zoom-in' }}
        {...props}
      />
      {modalPortal}
    </div>
  );
};

const unescapeQuotes = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\\"/g, '"')
    .replace(/&quot;/g, '"');
};

const renderCaptionWithLinks = (captionTextRaw: string, fallbackUrl?: string) => {
  const captionText = unescapeQuotes(captionTextRaw);
  const parts = captionText.split(/(\b(?:Source|Quelle|Fuente|Fonte)\s*[:：]\s*|(?:来源|مصدر|स्रोत)\s*[:：]\s*)/i);
  if (parts.length < 3) {
    return <span className="select-text">{captionText}</span>;
  }
  const mainText = parts.slice(0, parts.length - 2).join('');
  const sourcePrefix = parts[parts.length - 2];
  const sourceName = parts[parts.length - 1].trim();
  
  if (sourceName.includes('[') && sourceName.includes('](')) {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    
    while ((match = regex.exec(sourceName)) !== null) {
      const plainText = sourceName.slice(lastIndex, match.index);
      if (plainText) {
        elements.push(plainText);
      }
      const linkText = match[1];
      const linkUrl = match[2];
      elements.push(
        <a
          key={linkUrl + '-' + lastIndex}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 underline font-normal transition-colors cursor-pointer"
        >
          {linkText}
        </a>
      );
      lastIndex = regex.lastIndex;
    }
    
    const remainingText = sourceName.slice(lastIndex);
    if (remainingText) {
      elements.push(remainingText);
    }
    
    return (
      <span className="select-text">
        {mainText}
        {sourcePrefix}
        {elements}
      </span>
    );
  }

  let url = fallbackUrl || '';
  if (!url) {
    if (/wikimedia/i.test(sourceName)) {
      url = 'https://commons.wikimedia.org';
    } else if (/wikipedia/i.test(sourceName)) {
      url = 'https://www.wikipedia.org';
    }
  }

  const isLinkable = url && !/ai-generated|generated|pollinations|tuteur/i.test(sourceName);
  
  return (
    <span className="select-text">
      {mainText}
      {sourcePrefix}
      {isLinkable ? (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 underline font-normal transition-colors cursor-pointer"
        >
          {sourceName}
        </a>
      ) : (
        sourceName
      )}
    </span>
  );
};

const CustomFigure = ({ src, alt: rawAlt, caption: rawCaption, fallbackText, fallbackUrl, unresolved, isIllustration, ...rest }: { src: string; alt?: string; caption?: string; fallbackText?: string; fallbackUrl?: string; unresolved?: boolean; isIllustration?: boolean; [key: string]: any }) => {
  const description = rest.description || rest.legend || '';
  const alt = unescapeQuotes(rawAlt || description);
  const caption = unescapeQuotes(rawCaption || description);
  const [failed, setFailed] = React.useState(false);
  const { markDegraded, registerFigure, unregisterFigure, registeredFigures } = useMdxStatus();
  const { language } = useLanguage();

  const idRef = React.useRef<string | null>(null);
  if (!idRef.current) {
    idRef.current = Math.random().toString(36).substr(2, 9);
  }
  const id = idRef.current;
  
  const isBlocked = src && src.includes('pollinations.ai') && isExistingArtwork(src, alt || caption || '');

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  const isVisible = !unresolved && !isBlocked && !failed && !!src;

  React.useEffect(() => {
    // Illustrations are decorative — never register for figure numbering
    if (isVisible && !isIllustration) {
      console.log(`[MDX-FIGURE-REGISTRY] Registering Figure ID: ${id} (Caption: "${caption}")`);
      registerFigure(id);
    } else {
      console.log(`[MDX-FIGURE-REGISTRY] Unregistering Figure ID: ${id} (isVisible: ${isVisible}, isIllustration: ${isIllustration})`);
      unregisterFigure(id);
    }
    return () => {
      console.log(`[MDX-FIGURE-REGISTRY] Cleanup: Unregistering Figure ID: ${id}`);
      unregisterFigure(id);
    };
  }, [id, isVisible, isIllustration, registerFigure, unregisterFigure]);

  React.useEffect(() => {
    if (unresolved || isBlocked || failed) {
      markDegraded('image');
    }
  }, [unresolved, isBlocked, failed, markDegraded]);

  if (unresolved || isBlocked || failed || (!src?.trim() && !caption?.trim() && !alt?.trim())) {
    return null;
  }

  // ── Illustration mode (Unsplash/decorative) ─────────────────────────────
  // No "Figure N:" label, no numbering, aria-hidden so TTS skips it entirely.
  // Only a minimal attribution line is shown beneath the image.
  if (isIllustration) {
    return (
      <div
        className="my-6 flex flex-col items-center justify-center gap-1.5 custom-illustration transition-opacity duration-300"
        aria-hidden="true"
        role="presentation"
      >
        <img
          src={src}
          alt=""
          className="rounded-2xl max-w-full h-auto max-h-[360px] object-contain opacity-90"
          onError={() => setFailed(true)}
        />
        {caption && (
          <p className="text-center text-[10px] text-slate-600 dark:text-slate-500 mt-1 max-w-xl px-4 leading-relaxed">
            {renderCaptionWithLinks(caption, fallbackUrl)}
          </p>
        )}
      </div>
    );
  }

  // ── Standard figure mode (factual, numbered) ─────────────────────────────
  const langKey = (language || 'EN').toUpperCase();
  const figureLabel = FIGURE_STRINGS[langKey] || FIGURE_STRINGS.EN;

  const figureIndex = registeredFigures.indexOf(id);
  const figureNumber = figureIndex !== -1 ? figureIndex + 1 : null;
  console.log(`[MDX-FIGURE-REGISTRY] Figure ID: ${id} has index: ${figureIndex} -> Figure Number: ${figureNumber}`);

  const cleanCaption = caption ? caption.replace(/^(?:Figure|Abbildung|Figura|图|الشكل|चित्र|خاکہ)\s*\d*\s*[:\-\u2013\u2014]?\s*/i, '') : '';
  const finalCaption = figureNumber !== null ? `${figureLabel} ${figureNumber}: ${cleanCaption}` : caption;

  return (
    <div 
      id={figureNumber !== null ? `figure-${figureNumber}` : undefined}
      className="my-8 flex flex-col items-center justify-center gap-2 custom-figure transition-opacity duration-300 scroll-mt-24"
    >
      <ZoomableImage 
        src={src} 
        alt={alt} 
        className="rounded-2xl max-w-full h-auto max-h-[450px] object-contain shadow-md border border-slate-900/10 dark:border-slate-800/50" 
        onError={() => setFailed(true)} 
      />
      {finalCaption && (
        <p className="text-center text-xs md:text-sm text-slate-500 dark:text-slate-400 italic mt-2 max-w-2xl px-4">
          {renderCaptionWithLinks(finalCaption, fallbackUrl)}
        </p>
      )}
    </div>
  );
};



export { CustomFigure, ZoomableImage, isExistingArtwork, FIGURE_STRINGS };
export default CustomFigure;
