"use client";

import { useState, useEffect } from 'react';
import { getElementReadableText } from './audio-extractor';
import { type TooltipState } from './AudioPlayerBar';

export const useAudioTooltip = () => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    text: '',
    category: 'graphic',
    x: 0,
    y: 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const graphic = target.closest('img, iframe, video, .video-container, .iframe-container, [role="img"]') as HTMLElement;
      if (!graphic) {
        setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
        return;
      }

      if (graphic.closest('a, button, input, select, option, textarea, [role="button"], [role="link"]')) {
        setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
        return;
      }

      const text = getElementReadableText(graphic);
      if (!text) {
        setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
        return;
      }

      let category: TooltipState['category'] = 'graphic';
      const tag = graphic.tagName.toUpperCase();
      if (tag === 'VIDEO' || graphic.classList.contains('video-container')) {
        category = 'video';
      } else if (tag === 'IFRAME' || graphic.classList.contains('iframe-container')) {
        const src = graphic.getAttribute('src') || '';
        if (src.includes('youtube') || src.includes('vimeo')) {
          category = 'video';
        } else {
          category = 'simulation';
        }
      }

      setTooltip({
        visible: true,
        text,
        category,
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!tooltip.visible) return;

      let x = e.clientX + 15;
      let y = e.clientY + 15;

      const tooltipWidth = 240;
      const tooltipHeight = 100;
      if (x + tooltipWidth > window.innerWidth) {
        x = e.clientX - tooltipWidth - 10;
      }
      if (y + tooltipHeight > window.innerHeight) {
        y = e.clientY - tooltipHeight - 10;
      }

      setTooltip(prev => prev.visible ? { ...prev, x, y } : prev);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const graphic = target.closest('img, iframe, video, .video-container, .iframe-container, [role="img"]');
      if (graphic) {
        setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
      }
    };

    const article = document.querySelector('article');
    if (article) {
      article.addEventListener('mouseover', handleMouseOver);
      article.addEventListener('mousemove', handleMouseMove);
      article.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      if (article) {
        article.removeEventListener('mouseover', handleMouseOver);
        article.removeEventListener('mousemove', handleMouseMove);
        article.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, [tooltip.visible]);

  return { tooltip, setTooltip };
};
