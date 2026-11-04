"use client";

import React, { useEffect, useRef } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { DegradedModeBanner } from './elements/DegradedModeBanner';
import { MdxStatusProvider } from './MdxStatusContext';
import { MdxErrorBoundary } from './MdxErrorBoundary';
import { components } from './content/componentsMap';
import { stripJsxAndRender } from './content/stripJsxAndRender';
import { useLanguage } from '@/context/LanguageContext';

export interface MdxContentProps {
  source?: MDXRemoteSerializeResult;
  rawContent?: string;
  rawMdx?: string;
  courseSlug?: string;
  lessonSlug?: string;
  className?: string;
  degradedMode?: boolean;
  degradedReason?: 'network' | 'offline' | 'error';
  enableLatexFix?: boolean;
}

export function MdxContent(props: MdxContentProps) {
  const { language } = useLanguage();
  const {
    source,
    rawContent,
    rawMdx,
    courseSlug,
    lessonSlug,
    className,
    degradedMode,
    degradedReason,
    enableLatexFix
  } = props;
  const effectiveRaw = rawContent || rawMdx;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const container = containerRef.current;
    const elementsToObserve = container.querySelectorAll(
      'p, h1, h2, h3, h4, h5, h6, blockquote, li, pre, .custom-alert'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const textSnippet = el.textContent?.trim().slice(0, 150) || '';
          const index = Array.from(elementsToObserve).indexOf(el);
          const total = elementsToObserve.length;

          const progressEvent = new CustomEvent('op_reading_progress', {
            detail: {
              textSnippet,
              index,
              total,
              tagName: el.tagName.toLowerCase(),
              courseSlug,
              lessonSlug
            }
          });
          window.dispatchEvent(progressEvent);
        }
      });
    }, {
      root: null,
      rootMargin: '-10% 0px -65% 0px',
      threshold: 0.1
    });

    elementsToObserve.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [source, effectiveRaw, courseSlug, lessonSlug]);

  // If degraded mode is requested, clean and flatten raw content
  if (degradedMode && effectiveRaw) {
    const textContent = stripJsxAndRender(effectiveRaw);
    return (
      <div className={`prose dark:prose-invert max-w-none text-slate-300 leading-relaxed font-sans ${className || ''}`}>
        <DegradedModeBanner reason={degradedReason} />
        <div className="whitespace-pre-line select-text">
          {textContent}
        </div>
      </div>
    );
  }

  if (!source) {
    return null;
  }

  return (
    <MdxStatusProvider courseSlug={courseSlug} lessonSlug={lessonSlug}>
      <div ref={containerRef} className="mdx-content-container">
        <DegradedModeBanner />
        <MdxErrorBoundary
          fallback={effectiveRaw ? stripJsxAndRender(effectiveRaw) : undefined}
          courseSlug={courseSlug}
          lessonSlug={lessonSlug}
          language={language}
          rawMdx={effectiveRaw}
          rawContent={effectiveRaw}
          className={className}
          enableLatexFix={enableLatexFix}
        >
          <div className={`prose dark:prose-invert max-w-none select-text ${className || ''}`}>
            <MDXRemote {...source} components={components as any} />
          </div>
        </MdxErrorBoundary>
      </div>
    </MdxStatusProvider>
  );
}

export default MdxContent;
export { components, stripJsxAndRender };
