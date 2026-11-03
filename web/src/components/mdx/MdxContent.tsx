import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { DegradedModeBanner } from './elements/DegradedModeBanner';
import { MdxStatusProvider } from './MdxStatusContext';
import { MdxErrorBoundary } from './MdxErrorBoundary';
import { components } from './content/componentsMap';
import { stripJsxAndRender } from './content/stripJsxAndRender';

export interface MdxContentProps {
  source?: MDXRemoteSerializeResult;
  rawContent?: string;
  className?: string;
  degradedMode?: boolean;
  degradedReason?: 'network' | 'offline' | 'error';
  enableLatexFix?: boolean;
}

export function MdxContent(props: MdxContentProps) {
  const { source, rawContent, className, degradedMode, degradedReason, enableLatexFix } = props;

  // If degraded mode is requested, clean and flatten raw content
  if (degradedMode && rawContent) {
    const textContent = stripJsxAndRender(rawContent);
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
    <MdxStatusProvider>
      <MdxErrorBoundary rawContent={rawContent} className={className} enableLatexFix={enableLatexFix}>
        <div className={`prose dark:prose-invert max-w-none select-text ${className || ''}`}>
          <MDXRemote {...source} components={components as any} />
        </div>
      </MdxErrorBoundary>
    </MdxStatusProvider>
  );
}

export default MdxContent;
export { components, stripJsxAndRender };
