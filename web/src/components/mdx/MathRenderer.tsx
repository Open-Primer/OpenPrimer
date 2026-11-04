"use client";

import React from 'react';
import katex from 'katex';

/**
 * @file MathRenderer.tsx
 * @description Centralized, secure mathematical formula renderer using KaTeX.
 * Parses and renders inline ($...$) and block ($$...$$) mathematical expressions
 * while ensuring safe fallback, strict error handling, and recursive React node processing.
 */

/**
 * Parses a string segment containing inline or display math and renders KaTeX spans.
 *
 * @param text - The raw text containing potential LaTeX delimiters ($ or $$)
 * @returns An array of React nodes with rendered KaTeX spans or plain text
 */
export const renderTextSegmentWithMath = (text: string): React.ReactNode[] => {
  if (!text) return [];
  const mathRegex = /(\$\$[\s\S]+?\$\$|\$[^\n$]+?\$)/g;
  const parts = text.split(mathRegex);

  return parts.map((part, i) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const formula = part.slice(2, -2).trim();
      try {
        const html = katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false,
          trust: false
        });
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: html }}
            className="block my-3 overflow-x-auto text-center"
          />
        );
      } catch (e) {
        console.error("KaTeX render error (display mode):", e);
        return <code key={i} className="text-rose-400 font-mono text-xs">{part}</code>;
      }
    } else if (part.startsWith('$') && part.endsWith('$')) {
      const formula = part.slice(1, -1).trim();
      try {
        const html = katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false,
          trust: false
        });
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: html }}
            className="inline-block mx-0.5"
          />
        );
      } catch (e) {
        console.error("KaTeX render error (inline mode):", e);
        return <code key={i} className="text-rose-400 font-mono text-xs">{part}</code>;
      }
    }
    return <span key={i}>{part}</span>;
  });
};

/**
 * Renders multi-line text supporting markdown bold, italics, bullets, and mathematical formulas.
 *
 * @param text - Multi-line string with markdown and math
 * @param inParagraph - Whether rendering inside a block paragraph
 * @returns Rendered ReactNode hierarchy
 */
export const renderTextWithMathAndMarkdown = (text: string, inParagraph: boolean = false): React.ReactNode => {
  if (!text) return null;
  const lines = text.split(/\n/);

  const renderedLines = lines.map((line, li) => {
    const isBullet = /^(\*|-|\d+\.) /.test(line.trim());
    const content = line.replace(/^(\*|-|\d+\.) /, '');

    const parts = content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/);
    const rendered = parts.map((part, pi) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        return <strong key={pi}>{renderTextSegmentWithMath(part.slice(2, -2))}</strong>;
      }
      if (/^\*[^*]+\*$/.test(part)) {
        return <em key={pi}>{renderTextSegmentWithMath(part.slice(1, -1))}</em>;
      }
      return <React.Fragment key={pi}>{renderTextSegmentWithMath(part)}</React.Fragment>;
    });

    if (isBullet) {
      return (
        <li key={li} className="ml-6 list-disc mb-2 text-slate-300">
          {rendered}
        </li>
      );
    }
    if (!line.trim()) {
      return inParagraph ? <span key={li} className="block h-2" /> : <br key={li} />;
    }

    if (inParagraph) {
      return <span key={li} className="inline">{rendered}</span>;
    }

    return (
      <p key={li} className="mb-4 text-slate-300">
        {rendered}
      </p>
    );
  });

  return <>{renderedLines}</>;
};

/**
 * Recursively inspects a ReactNode and parses math formulas within its text leaves.
 *
 * @param node - The ReactNode to traverse
 * @param inParagraph - Whether currently inside a paragraph element
 * @returns The transformed ReactNode with KaTeX math spans
 */
export const renderNodeWithMath = (node: React.ReactNode, inParagraph = false): React.ReactNode => {
  if (node === null || node === undefined) return node;

  if (typeof node === 'string') {
    return renderTextWithMathAndMarkdown(node, inParagraph);
  }

  if (typeof node === 'number' || typeof node === 'boolean') {
    return node;
  }

  if (Array.isArray(node)) {
    return (
      <>
        {node.map((child, index) => (
          <React.Fragment key={index}>{renderNodeWithMath(child, inParagraph)}</React.Fragment>
        ))}
      </>
    );
  }

  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<any>;
    const isP = element.type === 'p';
    if (element.props && element.props.children) {
      const processedChildren = renderNodeWithMath(element.props.children, isP || inParagraph);
      return React.cloneElement(element, { ...element.props }, processedChildren);
    }
    return node;
  }

  return node;
};

export interface MathRendererProps {
  inline?: boolean;
  text?: string;
  content?: string;
  children?: React.ReactNode;
  inParagraph?: boolean;
  className?: string;
}

/**
 * Standalone MathRenderer component for JSX.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ text, content, children, inParagraph = false, className = '' }) => {
  const targetText = text || content || (typeof children === 'string' ? children : '') || '';
  return (
    <div className={`op-math-rendered ${className}`}>
      {renderTextWithMathAndMarkdown(targetText, inParagraph)}
    </div>
  );
};

export default MathRenderer;
