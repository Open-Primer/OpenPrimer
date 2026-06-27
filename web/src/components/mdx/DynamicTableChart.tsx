"use client";

import React, { useState } from 'react';
import { Table, BarChart3, LineChart, ToggleLeft } from 'lucide-react';

interface DynamicTableChartProps {
  children: React.ReactNode;
  alt?: string;
  description?: string;
  caption?: string;
}

export const DynamicTableChart = ({ children, alt, description, caption }: DynamicTableChartProps) => {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const finalDescription = description || alt || caption;

  // Parses headers and rows from children (thead, tbody, tr, td, th)
  const parsedData = React.useMemo(() => {
    try {
      let headers: string[] = [];
      let rows: Array<{ label: string; values: number[] }> = [];

      const traverse = (node: any) => {
        if (!node) return;
        
        if (node.type === 'th') {
          headers.push(String(node.props.children || ''));
        }
        
        if (node.type === 'tr') {
          const cells = React.Children.toArray(node.props.children);
          if (cells.length > 0) {
            const isHeader = cells.every((c: any) => c.type === 'th');
            if (!isHeader) {
              const label = String((cells[0] as any)?.props?.children || '');
              const values = cells.slice(1).map((c: any) => {
                const text = String(c?.props?.children || '0');
                const val = parseFloat(text.replace(/[^0-9.-]/g, ''));
                return isNaN(val) ? 0 : val;
              });
              rows.push({ label, values });
            }
          }
        }

        if (node.props && node.props.children) {
          React.Children.forEach(node.props.children, traverse);
        }
      };

      traverse(children);
      return { headers, rows };
    } catch (e) {
      console.error("Error parsing table structure for chart converter:", e);
      return { headers: [], rows: [] };
    }
  }, [children]);

  const hasData = parsedData.rows.length > 0;

  const renderSVGChart = () => {
    const data = parsedData.rows;
    const maxVal = Math.max(...data.map(r => r.values[0] || 0), 1);
    
    const w = 500;
    const h = 220;
    const paddingL = 50;
    const paddingB = 30;
    const chartW = w - paddingL - 20;
    const chartH = h - paddingB - 10;
    
    const points = data.map((r, idx) => {
      const val = r.values[0] || 0;
      const x = paddingL + (idx * (chartW / (data.length || 1))) + (chartW / (data.length * 2 || 2));
      const y = h - paddingB - (val / maxVal) * chartH;
      return { x, y, label: r.label, val };
    });

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible select-none">
        {/* Y Axis Grid lines */}
        {[0, 0.5, 1].map((ratio, i) => {
          const y = h - paddingB - ratio * chartH;
          return (
            <g key={i} className="opacity-30">
              <line x1={paddingL} y1={y} x2={w - 20} y2={y} stroke="#475569" strokeWidth="0.5" strokeDasharray="3,3" />
              <text x={paddingL - 8} y={y + 3} fill="#94a3b8" fontSize="8" textAnchor="end">
                {(maxVal * ratio).toFixed(0)}
              </text>
            </g>
          );
        })}
        
        {/* Bars */}
        {chartType === 'bar' && points.map((p, idx) => {
          const barW = Math.min(25, (chartW / data.length) * 0.6);
          const barH = h - paddingB - p.y;
          return (
            <g key={idx}>
              <rect x={p.x - barW / 2} y={p.y} width={barW} height={Math.max(barH, 2)} rx="4" fill="#3b82f6" className="opacity-80 hover:opacity-100 transition-opacity" />
              <text x={p.x} y={p.y - 4} fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle">{p.val}</text>
            </g>
          );
        })}

        {/* Line Chart */}
        {chartType === 'line' && (
          <>
            <path
              d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2.5"
            />
            {points.map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="4" fill="#c084fc" stroke="#1e1b4b" strokeWidth="1" />
                <text x={p.x} y={p.y - 6} fill="#c084fc" fontSize="8" fontWeight="bold" textAnchor="middle">{p.val}</text>
              </g>
            ))}
          </>
        )}

        {/* X Axis Labels */}
        {points.map((p, idx) => (
          <text key={idx} x={p.x} y={h - paddingB + 14} fill="#94a3b8" fontSize="8" textAnchor="middle">
            {p.label.length > 8 ? `${p.label.slice(0, 6)}..` : p.label}
          </text>
        ))}
      </svg>
    );
  };

  return (
    <div 
      className="my-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900/10 p-5 shadow-lg relative"
      title={finalDescription}
      aria-label={finalDescription}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 select-none">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-350">
            Tableau Comparatif & Graphique
          </span>
        </div>

        {hasData && (
          <div className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-950/60 border border-slate-300/50 dark:border-slate-800/80 px-2.5 py-1 rounded-xl">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}
              className="text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <ToggleLeft className={`w-4 h-4 transition-transform ${viewMode === 'chart' ? 'text-blue-500 rotate-180' : 'text-slate-400'}`} />
              {viewMode === 'table' ? 'Graphique' : 'Tableau'}
            </button>

            {viewMode === 'chart' && (
              <div className="flex items-center gap-1.5 border-l border-slate-300 dark:border-slate-800 pl-2 ml-1">
                <button onClick={() => setChartType('bar')} className={`p-0.5 rounded ${chartType === 'bar' ? 'text-blue-500' : 'text-slate-400'}`}>
                  <BarChart3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setChartType('line')} className={`p-0.5 rounded ${chartType === 'line' ? 'text-purple-500' : 'text-slate-400'}`}>
                  <LineChart className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="overflow-x-auto select-text">
        {viewMode === 'table' ? (
          <div className="custom-markdown-table">
            {children}
          </div>
        ) : (
          <div className="w-full flex justify-center py-4 bg-slate-950/20 rounded-2xl border border-slate-800/50">
            {renderSVGChart()}
          </div>
        )}
      </div>

      {finalDescription && (
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 italic mt-4 max-w-2xl mx-auto px-4 select-text">
          {finalDescription}
        </p>
      )}
    </div>
  );
};
