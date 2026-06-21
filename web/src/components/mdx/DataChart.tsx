"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Table, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ChartDataItem {
  label: string;
  value: number;
  color?: string; // Optional custom color hex or name
}

interface DataChartProps {
  title?: string;
  type?: 'bar' | 'pie' | 'donut' | 'line';
  data?: any; // Can be array or JSON-serialized string from MDX
  dataBase64?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  unit?: string;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

const PRESET_GRADIENTS = [
  { id: 'grad-blue-purple', start: '#3b82f6', end: '#8b5cf6' },
  { id: 'grad-emerald-teal', start: '#10b981', end: '#14b8a6' },
  { id: 'grad-rose-orange', start: '#f43f5e', end: '#f97316' },
  { id: 'grad-amber-yellow', start: '#f59e0b', end: '#eab308' },
  { id: 'grad-cyan-indigo', start: '#06b6d4', end: '#6366f1' },
];

const LINE_COLORS = ['#3b82f6', '#f43f5e', '#10b981', '#f59e0b', '#a855f7'];

export const DataChart = ({
  title,
  type = 'bar',
  data: rawData,
  dataBase64,
  xAxisLabel,
  yAxisLabel,
  unit = '',
  gradeLevel
}: DataChartProps) => {
  const { language } = useLanguage();
  const isFr = (language || 'FR').toLowerCase() === 'fr';

  const labels = {
    bar: isFr ? "Barres" : "Bar",
    donut: isFr ? "Beignet" : "Donut",
    line: isFr ? "Courbe" : "Line",
    table: isFr ? "Tableau" : "Table",
    total: isFr ? "Total" : "Total",
    series: isFr ? "Série" : "Series",
    value: isFr ? "Valeur" : "Value",
    percentage: isFr ? "Pourcentage" : "Percentage",
    category: isFr ? "Catégorie" : "Category",
    xAxis: isFr ? "Axe X" : "X-Axis",
    segments: isFr ? "segments" : "segments",
    percentOfTotal: isFr ? "du total" : "of total",
    selectSeries: isFr ? "Choisir la série" : "Select series",
  };

  // Switch representation state
  const [activeRep, setActiveRep] = useState<'bar' | 'donut' | 'line' | 'table'>(
    type === 'pie' ? 'donut' : type
  );

  // Multi-series donut selector state
  const [selectedSeriesIdx, setSelectedSeriesIdx] = useState<number>(0);
  const [showSeriesDropdown, setShowSeriesDropdown] = useState<boolean>(false);

  // Parse data if it is a JSON string or Base64 from MDX
  const parsedData = React.useMemo(() => {
    let resolvedData = rawData;
    if (dataBase64) {
      try {
        const decoded = typeof window !== 'undefined'
          ? decodeURIComponent(escape(window.atob(dataBase64)))
          : Buffer.from(dataBase64, 'base64').toString('utf-8');
        resolvedData = JSON.parse(decoded);
      } catch (e) {
        console.error("Failed to decode dataBase64 in DataChart:", e);
      }
    }

    if (typeof resolvedData === 'string') {
      try {
        return JSON.parse(resolvedData);
      } catch (e) {
        console.error("Failed to parse DataChart JSON data:", e);
        return [];
      }
    }
    return (resolvedData as any) || [];
  }, [rawData, dataBase64]);

  // Data Normalization Layer
  const normalized = React.useMemo(() => {
    if (!parsedData || parsedData.length === 0) return null;

    const isMultiSeries = parsedData[0] && Array.isArray((parsedData[0] as any).values);

    if (isMultiSeries) {
      const seriesData = parsedData as { label: string; values: { x: number; y: number }[] }[];
      // Retrieve unique sorted numeric X values
      const allX = Array.from(new Set(seriesData.flatMap(s => s.values.map(v => v.x)))).sort((a, b) => a - b);
      
      // Map simpleData using the sums across all series for donut/bar fallbacks
      const simpleData = allX.map(x => {
        const sum = seriesData.reduce((acc, s) => {
          const pt = s.values.find(v => v.x === x);
          return acc + (pt ? pt.y : 0);
        }, 0);
        return { label: String(x), value: sum };
      });

      return {
        isMultiSeries: true,
        simpleData,
        seriesData,
        xValues: allX
      };
    } else {
      const simpleData = parsedData as { label: string; value: number; color?: string }[];
      const seriesData = [
        {
          label: title || (isFr ? "Valeurs" : "Values"),
          values: simpleData.map((d, idx) => ({ x: idx, y: d.value }))
        }
      ];
      return {
        isMultiSeries: false,
        simpleData,
        seriesData,
        xValues: simpleData.map(d => d.label)
      };
    }
  }, [parsedData, title, isFr]);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredXIdx, setHoveredXIdx] = useState<number | null>(null);

  // Skip rendering silently when data is invalid
  if (!normalized) {
    return null;
  }

  const maxValue = normalized.isMultiSeries
    ? Math.max(...normalized.seriesData.flatMap(s => s.values.map(v => v.y || 0)), 1)
    : Math.max(...normalized.simpleData.map(d => d.value || 0), 1);

  const totalValue = normalized.isMultiSeries
    ? normalized.seriesData[selectedSeriesIdx]?.values.reduce((acc, v) => acc + (v.y || 0), 0) || 1
    : normalized.simpleData.reduce((acc, curr) => acc + (curr.value || 0), 0) || 1;

  // Constants for vertical chart SVG layout
  const width = 500;
  const height = 300;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Helper coordinate getters
  const getXCoord = (val: any, idx: number) => {
    if (normalized.isMultiSeries) {
      const allX = normalized.xValues as number[];
      const minX = Math.min(...allX);
      const maxX = Math.max(...allX);
      const rangeX = maxX - minX || 1;
      return paddingLeft + (((val as number) - minX) / rangeX) * chartWidth;
    } else {
      const totalPoints = normalized.simpleData.length;
      if (totalPoints <= 1) return paddingLeft + chartWidth / 2;
      return paddingLeft + (idx / (totalPoints - 1)) * chartWidth;
    }
  };

  const getYCoord = (val: number) => {
    const minY = 0; // Align on 0 base
    const rangeY = maxValue - minY || 1;
    return height - paddingBottom - ((val - minY) / rangeY) * chartHeight;
  };

  // RENDER: Bar / Clustered Columns Chart
  const renderBarChart = () => {
    if (normalized.isMultiSeries) {
      // Clustered Grouped Bars
      const groupCount = normalized.xValues.length;
      const seriesCount = normalized.seriesData.length;
      
      const groupWidth = chartWidth / groupCount;
      const groupBarsWidth = groupWidth * 0.75;
      const barWidth = Math.min(25, groupBarsWidth / seriesCount);
      const innerGap = (groupBarsWidth - barWidth * seriesCount) / (seriesCount + 1 || 1);

      return (
        <div className="relative w-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            <defs>
              {PRESET_GRADIENTS.map((g) => (
                <linearGradient key={g.id} id={g.id} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={g.start} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={g.end} stopOpacity={0.9} />
                </linearGradient>
              ))}
              {PRESET_GRADIENTS.map((g) => (
                <linearGradient key={`glow-${g.id}`} id={`glow-${g.id}`} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={g.start} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={g.end} stopOpacity={1} />
                </linearGradient>
              ))}
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
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

            {/* X-Axis labels */}
            {normalized.xValues.map((xVal, gIdx) => {
              const xCenter = paddingLeft + gIdx * groupWidth + groupWidth / 2;
              return (
                <text key={gIdx} x={xCenter} y={height - paddingBottom + 16} fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {xVal}
                </text>
              );
            })}

            {/* Grouped Bars */}
            {normalized.xValues.map((xVal, gIdx) => {
              const xStart = paddingLeft + gIdx * groupWidth + (groupWidth - groupBarsWidth) / 2;
              
              return normalized.seriesData.map((series, sIdx) => {
                const pt = series.values.find(v => v.x === xVal);
                if (!pt) return null;

                const val = pt.y;
                const barHeight = (val / maxValue) * chartHeight;
                const barX = xStart + innerGap + sIdx * (barWidth + innerGap);
                const barY = height - paddingBottom - barHeight;
                const isHovered = hoveredIdx === gIdx && hoveredXIdx === sIdx;

                const grad = PRESET_GRADIENTS[sIdx % PRESET_GRADIENTS.length];
                const fillUrl = isHovered ? `url(#glow-${grad.id})` : `url(#${grad.id})`;

                return (
                  <g
                    key={`${gIdx}-${sIdx}`}
                    onMouseEnter={() => {
                      setHoveredIdx(gIdx);
                      setHoveredXIdx(sIdx);
                    }}
                    onMouseLeave={() => {
                      setHoveredIdx(null);
                      setHoveredXIdx(null);
                    }}
                    className="cursor-pointer"
                  >
                    <motion.rect
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={Math.max(barHeight, 2)}
                      rx="4"
                      ry="4"
                      fill={fillUrl}
                      stroke={grad.end}
                      strokeWidth={isHovered ? "2" : "1"}
                      filter={isHovered ? "url(#shadow)" : ""}
                      initial={{ scaleY: 0, y: height - paddingBottom }}
                      animate={{ scaleY: 1, y: barY }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: gIdx * 0.04 }}
                      style={{ transformOrigin: "bottom" }}
                    />
                  </g>
                );
              });
            })}
          </svg>

          {/* Interactive Tooltip Overlay */}
          <div className="absolute top-4 right-4 pointer-events-none min-w-[150px]">
            <AnimatePresence>
              {hoveredIdx !== null && hoveredXIdx !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-md shadow-2xl flex flex-col gap-1 text-[11px]"
                >
                  <span className="text-slate-400 uppercase font-black tracking-wider text-[9px]">
                    {normalized.seriesData[hoveredXIdx].label}
                  </span>
                  <span className="text-white font-extrabold text-sm flex items-baseline gap-1">
                    {normalized.seriesData[hoveredXIdx].values.find(v => v.x === normalized.xValues[hoveredIdx])?.y}
                    <span className="text-xs text-slate-400 font-medium">{unit}</span>
                  </span>
                  <span className="text-slate-400">
                    {labels.xAxis}: {normalized.xValues[hoveredIdx]}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    } else {
      // Single series standard bars
      const barWidth = Math.min(45, (chartWidth / normalized.simpleData.length) * 0.6);
      const gap = (chartWidth - barWidth * normalized.simpleData.length) / (normalized.simpleData.length + 1);

      return (
        <div className="relative w-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            <defs>
              {PRESET_GRADIENTS.map((g) => (
                <linearGradient key={g.id} id={g.id} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={g.start} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={g.end} stopOpacity={0.9} />
                </linearGradient>
              ))}
              {PRESET_GRADIENTS.map((g) => (
                <linearGradient key={`glow-${g.id}`} id={`glow-${g.id}`} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={g.start} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={g.end} stopOpacity={1} />
                </linearGradient>
              ))}
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
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

            {/* Bars */}
            {normalized.simpleData.map((item, idx) => {
              const x = paddingLeft + gap + idx * (barWidth + gap);
              const barHeight = (item.value / maxValue) * chartHeight;
              const y = height - paddingBottom - barHeight;
              const isHovered = hoveredIdx === idx;

              const grad = PRESET_GRADIENTS[idx % PRESET_GRADIENTS.length];
              const fillUrl = isHovered ? `url(#glow-${grad.id})` : `url(#${grad.id})`;

              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="cursor-pointer group"
                >
                  <motion.rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(barHeight, 2)}
                    rx="6"
                    ry="6"
                    fill={fillUrl}
                    stroke={grad.end}
                    strokeWidth={isHovered ? "2" : "1"}
                    filter={isHovered ? "url(#shadow)" : ""}
                    initial={{ scaleY: 0, y: height - paddingBottom }}
                    animate={{ scaleY: 1, y }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.05 }}
                    style={{ transformOrigin: "bottom" }}
                  />

                  {isHovered && (
                    <circle cx={x + barWidth / 2} cy={y} r="8" fill={grad.end} className="animate-ping opacity-30 pointer-events-none" />
                  )}

                  <text x={x + barWidth / 2} y={height - paddingBottom + 16} fill={isHovered ? "#3b82f6" : "#94a3b8"} fontSize="9" fontWeight="bold" textAnchor="middle">
                    {item.label.length > 8 ? `${item.label.slice(0, 6)}..` : item.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Overlay */}
          <div className="absolute top-4 right-4 pointer-events-none min-w-[140px]">
            <AnimatePresence>
              {hoveredIdx !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-md shadow-2xl flex flex-col gap-1 text-[11px]"
                >
                  <span className="text-slate-400 uppercase font-black tracking-wider text-[9px]">
                    {normalized.simpleData[hoveredIdx].label}
                  </span>
                  <span className="text-white font-extrabold text-sm flex items-baseline gap-1">
                    {normalized.simpleData[hoveredIdx].value}
                    <span className="text-xs text-slate-400 font-medium">{unit}</span>
                  </span>
                  <span className="text-blue-400 font-semibold">
                    {((normalized.simpleData[hoveredIdx].value / totalValue) * 100).toFixed(1)}% {labels.percentOfTotal}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    }
  };

  // RENDER: Donut Chart
  const renderDonutChart = () => {
    let accumulatedAngle = 0;

    const size = 260;
    const center = size / 2;
    const radius = 90;
    const strokeWidth = 24;

    // Use selected series values if multi-series is active
    const donutData = normalized.isMultiSeries
      ? normalized.seriesData[selectedSeriesIdx].values.map(v => ({ label: String(v.x), value: v.y }))
      : normalized.simpleData;

    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 py-4 w-full">
        {/* Dynamic drop-down picker for multi-series donuts */}
        {normalized.isMultiSeries && (
          <div className="absolute top-16 left-6 z-40 select-none">
            <button
              onClick={() => setShowSeriesDropdown(!showSeriesDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-200 font-bold hover:bg-slate-800 transition-colors"
            >
              <span>{normalized.seriesData[selectedSeriesIdx].label}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <AnimatePresence>
              {showSeriesDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 mt-1 w-[160px] max-h-[150px] overflow-y-auto rounded-xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col p-1.5"
                >
                  {normalized.seriesData.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedSeriesIdx(idx);
                        setShowSeriesDropdown(false);
                      }}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                        idx === selectedSeriesIdx
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none overflow-visible">
            <defs>
              <filter id="donut-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Base */}
            <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#1e293b" strokeWidth={strokeWidth} className="opacity-50" />

            {/* Arcs */}
            <g transform={`rotate(-90 ${center} ${center})`}>
              {donutData.map((item, idx) => {
                const percentage = item.value / totalValue;
                const angle = percentage * 360;
                const circumference = 2 * Math.PI * radius;
                const strokeDasharray = `${(percentage * circumference).toFixed(2)} ${circumference.toFixed(2)}`;
                const strokeDashoffset = -((accumulatedAngle / 360) * circumference).toFixed(2);

                accumulatedAngle += angle;

                const grad = PRESET_GRADIENTS[idx % PRESET_GRADIENTS.length];
                const isHovered = hoveredIdx === idx;

                return (
                  <motion.circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={grad.end}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="cursor-pointer transition-all duration-300"
                    style={{ transformOrigin: `${center}px ${center}px` }}
                    filter={isHovered ? "url(#donut-glow)" : ""}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray }}
                    transition={{ duration: 1, ease: "easeInOut", delay: idx * 0.08 }}
                  />
                );
              })}
            </g>
          </svg>

          {/* Readout overlay inside donut hole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              {hoveredIdx !== null ? (
                <motion.div
                  key={`hovered-${hoveredIdx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center flex flex-col items-center justify-center"
                >
                  <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400 max-w-[120px] truncate leading-none">
                    {donutData[hoveredIdx].label}
                  </div>
                  <div className="text-xl font-black text-white mt-1 leading-none">
                    {donutData[hoveredIdx].value}
                    <span className="text-xs text-slate-400 font-medium ml-0.5">{unit}</span>
                  </div>
                  <div className="text-[10px] text-blue-400 font-extrabold mt-1 leading-none">
                    {((donutData[hoveredIdx].value / totalValue) * 100).toFixed(1)}%
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="total"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center flex flex-col items-center justify-center"
                >
                  <div className="text-[9px] uppercase font-bold tracking-widest text-slate-500 leading-none">
                    {labels.total}
                  </div>
                  <div className="text-2xl font-black text-slate-100 mt-1 leading-none">
                    {totalValue}
                    <span className="text-xs text-slate-400 font-medium ml-0.5">{unit}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1 leading-none">
                    {donutData.length} {labels.segments}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Legend sidebar */}
        <div className="flex flex-col gap-2.5 min-w-[160px] max-w-[220px]">
          {donutData.map((item, idx) => {
            const grad = PRESET_GRADIENTS[idx % PRESET_GRADIENTS.length];
            const isHovered = hoveredIdx === idx;
            const percent = ((item.value / totalValue) * 100).toFixed(1);

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 cursor-pointer border ${
                  isHovered 
                    ? "bg-slate-900 border-slate-700/80 shadow-lg translate-x-1" 
                    : "bg-slate-950/20 border-transparent hover:bg-slate-950/40"
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${grad.start}, ${grad.end})`,
                    boxShadow: isHovered ? `0 0 10px ${grad.end}` : 'none'
                  }}
                />
                <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-200 truncate">{item.label}</span>
                  <span className="text-[10px] text-slate-400">
                    {item.value} {unit} ({percent}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // RENDER: Line Chart
  const renderLineChart = () => {
    return (
      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            {LINE_COLORS.map((color, idx) => (
              <linearGradient key={`line-grad-${idx}`} id={`line-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines (Y-axis) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
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
          {normalized.seriesData.map((series, idx) => {
            if (series.values.length === 0) return null;

            const areaPathPoints = series.values.map((p, pIdx) => {
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
          {normalized.seriesData.map((series, idx) => {
            if (series.values.length === 0) return null;

            const pathPoints = series.values.map((p, pIdx) => {
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
          {hoveredXIdx !== null && normalized.seriesData.map((series, idx) => {
            const activeX = normalized.xValues[hoveredXIdx];
            let pt;
            if (normalized.isMultiSeries) {
              pt = series.values.find(v => v.x === activeX);
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
          {normalized.xValues.map((x, idx) => {
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
          {!normalized.isMultiSeries && normalized.xValues.map((label, idx) => {
            const sx = getXCoord(label, idx);
            return (
              <text key={idx} x={sx} y={height - paddingBottom + 16} fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
                {String(label).length > 8 ? `${String(label).slice(0, 6)}..` : String(label)}
              </text>
            );
          })}

          {/* Multi series year ticks */}
          {normalized.isMultiSeries && normalized.xValues.map((x, idx) => {
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
                  {normalized.seriesData.map((series, idx) => {
                    const activeX = normalized.xValues[hoveredXIdx];
                    let pt;
                    if (normalized.isMultiSeries) {
                      pt = series.values.find(v => v.x === activeX);
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

  // RENDER: styled dark-theme Table Mode
  const renderTableMode = () => {
    if (normalized.isMultiSeries) {
      return (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs select-text">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-wider">{xAxisLabel || labels.xAxis}</th>
                {normalized.seriesData.map((series, idx) => (
                  <th key={idx} className="px-4 py-3 font-bold text-slate-300 uppercase tracking-wider">
                    <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: LINE_COLORS[idx % LINE_COLORS.length] }} />
                    {series.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {normalized.xValues.map((x, gIdx) => (
                <tr key={gIdx} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors">
                  <td className="px-4 py-3 text-slate-200 font-bold">{x}</td>
                  {normalized.seriesData.map((series, sIdx) => {
                    const pt = series.values.find(v => v.x === x);
                    return (
                      <td key={sIdx} className="px-4 py-3 text-slate-300 font-medium">
                        {pt ? `${pt.y} ${unit}` : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs select-text">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-wider">{xAxisLabel || labels.category}</th>
                <th className="px-4 py-3 font-bold text-slate-300 uppercase tracking-wider">{yAxisLabel || labels.value}</th>
                <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-wider">{labels.percentage}</th>
              </tr>
            </thead>
            <tbody>
              {normalized.simpleData.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors">
                  <td className="px-4 py-3 text-slate-200 font-bold">{item.label}</td>
                  <td className="px-4 py-3 text-slate-300 font-medium">{item.value} {unit}</td>
                  <td className="px-4 py-3 text-indigo-400 font-extrabold">{((item.value / totalValue) * 100).toFixed(1)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="my-8 rounded-[40px] overflow-visible border border-slate-850/80 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative">
      <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Top Header Selector Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850/80 pb-4 mb-6 relative z-10 select-none">
        {title && (
          <h4 className="text-xs font-black text-slate-200 uppercase tracking-[0.2em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>{title}</span>
          </h4>
        )}

        {/* Dynamic selector buttons */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-850/85">
          <button
            onClick={() => setActiveRep('bar')}
            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
              activeRep === 'bar' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={labels.bar}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveRep('donut')}
            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
              activeRep === 'donut' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={labels.donut}
          >
            <PieChart className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveRep('line')}
            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
              activeRep === 'line' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={labels.line}
          >
            <TrendingUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveRep('table')}
            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
              activeRep === 'table' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={labels.table}
          >
            <Table className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main visualization card body */}
      <div className="w-full flex justify-center relative min-h-[220px]">
        {activeRep === 'bar' && renderBarChart()}
        {activeRep === 'donut' && renderDonutChart()}
        {activeRep === 'line' && renderLineChart()}
        {activeRep === 'table' && renderTableMode()}
      </div>

      {/* Multi-series general legends in non-table views */}
      {normalized.isMultiSeries && activeRep !== 'table' && activeRep !== 'donut' && (
        <div className="flex flex-wrap justify-center gap-4 mt-6 border-t border-slate-850/60 pt-4 select-none">
          {normalized.seriesData.map((series, idx) => {
            const color = LINE_COLORS[idx % LINE_COLORS.length];
            return (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs font-bold text-slate-400">{series.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
