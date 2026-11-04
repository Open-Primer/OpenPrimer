import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LINE_COLORS, CHART_STRINGS } from './typesAndConstants';
import { useLanguage } from '@/context/LanguageContext';

interface LineChartProps {
  normalized: any;
  chartWidth: number;
  chartHeight: number;
  width: number;
  height: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingTop: number;
  paddingRight: number;
  getYCoord: (val: number) => number;
  hoveredItem: any;
  setHoveredItem: (item: any) => void;
  tooltipPos: { x: number; y: number };
  setTooltipPos: (pos: { x: number; y: number }) => void;
  unit: string;
  totalSum: number;
  t: any;
}

export const LineChartRender: React.FC<LineChartProps> = ({
  normalized,
  chartWidth,
  chartHeight,
  width,
  height,
  paddingLeft,
  paddingBottom,
  paddingTop,
  paddingRight,
  getYCoord,
  hoveredItem,
  setHoveredItem,
  tooltipPos,
  setTooltipPos,
  unit,
  totalSum,
  t
}) => {
  const { language } = useLanguage();
  const langKey = language.toUpperCase() as keyof typeof CHART_STRINGS;
  const labels = CHART_STRINGS[langKey] || CHART_STRINGS.EN;

  const [hoveredXIdx, setHoveredXIdx] = React.useState<number | null>(null);

  const maxValue = normalized.isMultiSeries
    ? Math.max(...normalized.seriesData.flatMap((s: any) => s.values.map((v: any) => v.y || 0)), 1)
    : Math.max(...(normalized.simpleData || []).map((d: any) => d.value || 0), 1);

  const getXCoord = (val: any, idx: number) => {
    if (normalized.isMultiSeries) {
      const allX = normalized.xValues as number[];
      const minX = Math.min(...allX);
      const maxX = Math.max(...allX);
      const rangeX = maxX - minX || 1;
      return paddingLeft + (((val as number) - minX) / rangeX) * chartWidth;
    } else {
      const totalPoints = (normalized.simpleData || []).length;
      if (totalPoints <= 1) return paddingLeft + chartWidth / 2;
      return paddingLeft + (idx / (totalPoints - 1)) * chartWidth;
    }
  };
  const xAxisLabel = (normalized as any).xAxisLabel || labels.xAxis;
    return (
      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            {LINE_COLORS.map((color: any, idx: number) => (
              <linearGradient key={`line-grad-${idx}`} id={`line-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines (Y-axis) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio: number, i: number) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = (maxValue * ratio).toFixed(0);
            return (
              <g key={i} className="opacity-40">
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
                <text x={paddingLeft - 10} y={y + 4} fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">{val}{unit}</text>
              </g>
            );
          })}

          {/* Axes */}
          <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#475569" strokeWidth="1" />
          <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#475569" strokeWidth="1" />

          {/* Dynamic filled area curves */}
          {normalized.seriesData.map((series: any, idx: number) => {
            if (series.values.length === 0) return null;

            const areaPathPoints = series.values.map((p: any, pIdx: number) => {
              const sx = getXCoord(p.x, pIdx);
              const sy = getYCoord(p.y);
              return `${sx},${sy}`;
            });

            const firstX = getXCoord(series.values[0].x, 0);
            const lastX = getXCoord(series.values[series.values.length - 1].x, series.values.length - 1);
            const zeroY = height - paddingBottom;

            const pathString = `M ${firstX},${zeroY} L ${areaPathPoints.join(' L ')} L ${lastX},${zeroY} Z`;

            return (
              <path
                key={`area-${idx}`}
                d={pathString}
                fill={`url(#line-grad-${idx % LINE_COLORS.length})`}
                opacity="0.5"
                className="transition-all duration-300"
              />
            );
          })}

          {/* Line Curves */}
          {normalized.seriesData.map((series: any, idx: number) => {
            if (series.values.length === 0) return null;

            const pathPoints = series.values.map((p: any, pIdx: number) => {
              const sx = getXCoord(p.x, pIdx);
              const sy = getYCoord(p.y);
              return `${pIdx === 0 ? 'M' : 'L'} ${sx} ${sy}`;
            }).join(' ');

            const color = LINE_COLORS[idx % LINE_COLORS.length];

            return (
              <motion.path
                key={`line-${idx}`}
                d={pathPoints}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
              />
            );
          })}

          {/* Vertical indicator slice grid line */}
          {hoveredXIdx !== null && (
            <line
              x1={getXCoord(normalized.xValues[hoveredXIdx], hoveredXIdx)}
              y1={paddingTop}
              x2={getXCoord(normalized.xValues[hoveredXIdx], hoveredXIdx)}
              y2={height - paddingBottom}
              stroke="#64748b"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          )}

          {/* High-quality responsive interactive highlight circles */}
          {hoveredXIdx !== null && normalized.seriesData.map((series: any, idx: number) => {
            const activeX = normalized.xValues[hoveredXIdx];
            let pt;
            if (normalized.isMultiSeries) {
              pt = series.values.find((v: any) => v.x === activeX);
            } else {
              pt = series.values[hoveredXIdx];
            }
            if (!pt) return null;

            const sx = getXCoord(pt.x, hoveredXIdx);
            const sy = getYCoord(pt.y);
            const color = LINE_COLORS[idx % LINE_COLORS.length];

            return (
              <g key={`highlight-${idx}`}>
                <circle cx={sx} cy={sy} r="6" fill={color} stroke="#ffffff" strokeWidth="1.5" className="shadow-md" />
                <circle cx={sx} cy={sy} r="12" fill="transparent" stroke={color} strokeWidth="1.5" className="animate-ping opacity-40 pointer-events-none" />
              </g>
            );
          })}

          {/* Invisible mouse hover slice bars */}
          {normalized.xValues.map((x: any, idx: number) => {
            const sx = getXCoord(x, idx);
            const prevX = idx > 0 ? getXCoord(normalized.xValues[idx - 1], idx - 1) : sx;
            const nextX = idx < normalized.xValues.length - 1 ? getXCoord(normalized.xValues[idx + 1], idx + 1) : sx;
            
            const rectX = sx - (sx - prevX) / 2;
            const rectWidth = (nextX - sx) / 2 + (sx - rectX);

            return (
              <rect
                key={`slice-${idx}`}
                x={idx === 0 ? paddingLeft : rectX}
                y={paddingTop}
                width={idx === 0 ? rectWidth + (rectX - paddingLeft) : rectWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredXIdx(idx)}
                onMouseLeave={() => setHoveredXIdx(null)}
              />
            );
          })}

          {/* Static category labels on Line Chart ticks */}
          {!normalized.isMultiSeries && normalized.xValues.map((label: any, idx: number) => {
            const sx = getXCoord(label, idx);
            return (
              <text key={idx} x={sx} y={height - paddingBottom + 16} fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
                {String(label).length > 8 ? `${String(label).slice(0, 6)}..` : String(label)}
              </text>
            );
          })}

          {/* Multi series year ticks */}
          {normalized.isMultiSeries && normalized.xValues.map((x: any, idx: number) => {
            const sx = getXCoord(x, idx);
            return (
              <text key={idx} x={sx} y={height - paddingBottom + 16} fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
                {x}
              </text>
            );
          })}
        </svg>

        {/* Hover slice tooltip overlay */}
        <div className="absolute top-4 right-4 pointer-events-none min-w-[160px]">
          <AnimatePresence>
            {hoveredXIdx !== null && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="p-3 rounded-xl bg-slate-950/95 border border-slate-800/80 backdrop-blur-md shadow-2xl flex flex-col gap-1.5 text-[11px]"
              >
                <span className="text-slate-400 uppercase font-black tracking-wider text-[9px]">
                  {normalized.isMultiSeries ? `${xAxisLabel || 'X'}: ${normalized.xValues[hoveredXIdx]}` : normalized.simpleData[hoveredXIdx].label}
                </span>
                <div className="flex flex-col gap-1">
                  {normalized.seriesData.map((series: any, idx: number) => {
                    const activeX = normalized.xValues[hoveredXIdx];
                    let pt;
                    if (normalized.isMultiSeries) {
                      pt = series.values.find((v: any) => v.x === activeX);
                    } else {
                      pt = series.values[hoveredXIdx];
                    }
                    if (!pt) return null;
                    const color = LINE_COLORS[idx % LINE_COLORS.length];
                    return (
                      <div key={idx} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-slate-350 font-medium">{series.label}</span>
                        </div>
                        <span className="text-white font-extrabold">
                          {pt.y}
                          <span className="text-[10px] text-slate-500 font-medium ml-0.5">{unit}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };
