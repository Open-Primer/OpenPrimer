"use client";

import React from 'react';
import { MathRenderer } from '../../mdx/MathRenderer';
import { Mermaid } from '../../mdx/Mermaid';

export const renderInlineContent = (text: string): React.ReactNode[] => {
  const tokens: React.ReactNode[] = [];
  let currentIndex = 0;
  
  const inlineRegex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\*\*[^*]+?\*\*|\*[^*]+?\*)/g;
  let match;
  
  while ((match = inlineRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const matchedStr = match[0];
    
    if (matchIndex > currentIndex) {
      tokens.push(text.slice(currentIndex, matchIndex));
    }
    
    if (matchedStr.startsWith('$$') && matchedStr.endsWith('$$')) {
      const math = matchedStr.slice(2, -2);
      tokens.push(<MathRenderer key={matchIndex} inline={false} content={math} />);
    } else if (matchedStr.startsWith('$') && matchedStr.endsWith('$')) {
      const math = matchedStr.slice(1, -1);
      tokens.push(<MathRenderer key={matchIndex} inline={true} content={math} />);
    } else if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      const boldText = matchedStr.slice(2, -2);
      tokens.push(<strong key={matchIndex} className="font-extrabold text-white">{boldText}</strong>);
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
      const italicText = matchedStr.slice(1, -1);
      tokens.push(<em key={matchIndex} className="italic text-slate-300">{italicText}</em>);
    }
    
    currentIndex = inlineRegex.lastIndex;
  }
  
  if (currentIndex < text.length) {
    tokens.push(text.slice(currentIndex));
  }
  
  return tokens.length > 0 ? tokens : [text];
};

export interface TutorMessageContentProps {
  content: string;
}

export const parseMarkdownTableRow = (row: string): string[] => {
  let s = row.trim();
  if (s.startsWith('|')) {
    s = s.slice(1);
  }
  if (s.endsWith('|')) {
    s = s.slice(0, -1);
  }
  return s.split('|').map(cell => cell.trim());
};

export const TutorMessageContent = ({ content }: TutorMessageContentProps) => {
  if (!content) return null;
  if (content === '...') {
    return (
      <div className="flex items-center gap-1.5 py-1">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    );
  }

  const blocks: React.ReactNode[] = [];
  const lines = content.split('\n');
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      
      if (lang.toLowerCase() === 'mermaid') {
        blocks.push(
          <div key={`mermaid-${i}`} className="w-full my-3">
            <Mermaid chart={codeLines.join('\n')} />
          </div>
        );
      } else {
        blocks.push(
          <pre key={`code-${i}`} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/85 font-mono text-xs overflow-x-auto text-slate-200 my-3">
            {lang && <div className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1">{lang}</div>}
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
      }
      continue;
    }
    
    if (trimmed === '$$') {
      const mathLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '$$') {
        mathLines.push(lines[i]);
        i++;
      }
      i++;
      const math = mathLines.join('\n');
      blocks.push(
        <div key={`mathblk-${i}`} className="my-4 overflow-x-auto py-2 px-4 bg-slate-950/30 rounded-2xl border border-slate-800/20">
          <MathRenderer inline={false} content={math} />
        </div>
      );
      continue;
    }
    
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      const math = trimmed.slice(2, -2);
      blocks.push(
        <div key={`mathblk-single-${i}`} className="my-4 overflow-x-auto py-2 px-4 bg-slate-950/30 rounded-2xl border border-slate-800/20">
          <MathRenderer inline={false} content={math} />
        </div>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('|') && i + 1 < lines.length && lines[i+1].trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      
      if (tableLines.length >= 2) {
        const headerRow = tableLines[0];
        const headers = parseMarkdownTableRow(headerRow);
        const secondRow = tableLines[1];
        const isDivider = /^\|?[\s-:\\|]+$/.test(secondRow);
        const startBodyIdx = isDivider ? 2 : 1;
        const bodyRows = tableLines.slice(startBodyIdx).map(row => parseMarkdownTableRow(row));
        
        blocks.push(
          <div key={`table-${i}`} className="my-4 overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/20 shadow-lg">
            <table className="min-w-full text-xs text-left text-slate-300">
              {headers.length > 0 && (
                <thead className="bg-slate-950/60 font-black uppercase text-slate-400 border-b border-slate-800/80">
                  <tr>
                    {headers.map((h, idx) => (
                      <th key={idx} className="px-4 py-3 font-extrabold tracking-wider">{renderInlineContent(h)}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-slate-800/40">
                {bodyRows.map((cols, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-800/20 transition-colors">
                    {cols.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 font-medium">{renderInlineContent(col)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="list-disc pl-6 space-y-1.5 my-3 text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {renderInlineContent(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }
    
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        const itemTrim = lines[i].trim();
        const match = itemTrim.match(/^(\d+)\.\s(.*)/);
        if (match) {
          listItems.push(match[2]);
        } else {
          listItems.push(itemTrim);
        }
        i++;
      }
      blocks.push(
        <ol key={`ol-${i}`} className="list-decimal pl-6 space-y-1.5 my-3 text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {renderInlineContent(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const headingStyles = {
          1: "text-lg font-black text-white mt-4 mb-2",
          2: "text-base font-extrabold text-white mt-3 mb-1.5",
          3: "text-sm font-bold text-slate-200 mt-2.5 mb-1",
          4: "text-xs font-bold text-slate-300 mt-2 mb-1",
          5: "text-xs font-bold text-slate-400 mt-2 mb-1",
          6: "text-xs font-semibold text-slate-400 mt-2 mb-1",
        };
        const className = headingStyles[level as keyof typeof headingStyles] || headingStyles[3];
        blocks.push(
          <div key={`header-${i}`} className={className}>
            {renderInlineContent(text)}
          </div>
        );
        i++;
        continue;
      }
    }

    if (trimmed === '') {
      i++;
      continue;
    }
    
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && 
           !lines[i].trim().startsWith('```') && 
           !lines[i].trim().startsWith('- ') && 
           !lines[i].trim().startsWith('* ') && 
           !/^\d+\.\s/.test(lines[i].trim()) &&
           !lines[i].trim().startsWith('#') &&
           !lines[i].trim().startsWith('|') &&
           lines[i].trim() !== '$$') {
      paraLines.push(lines[i]);
      i++;
    }
    
    const paraText = paraLines.join('\n');
    blocks.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-slate-300 mb-3.5 last:mb-0">
        {renderInlineContent(paraText)}
      </p>
    );
  }
  
  return <div className="space-y-1">{blocks}</div>;
};
