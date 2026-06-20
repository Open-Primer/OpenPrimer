"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

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
  unit = ''
}: DataChartProps) => {
  // Parse data if it is a JSON string or Base64 from MDX
  const data: ChartDataItem[] = React.useMemo(() => {
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

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredXIdx, setHoveredXIdx] = useState<number | null>(null);

  // Silently skip rendering when data is missing or invalid – never show technical errors to learners.
  if (!data || data.length === 0) {
    return null;
  }

  const maxValue = type !== 'line' ? Math.max(...data.map(d => (d as any).value || 0), 1) : 1;
  const totalValue = type !== 'line' ? data.reduce((acc, curr) => acc + ((curr as any).value || 0), 0) : 0;

  // Constants for vertical bar chart SVG layout
  const width = 500;
  const height = 300;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Render Bar Chart
  const renderBarChart = () => {
    const barWidth = Math.min(45, (chartWidth / data.length) * 0.6);
    const gap = (chartWidth - barWidth * data.length) / (data.length + 1);

    return (
      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            {/* Define modern vibrant gradients */}
            {PRESET_GRADIENTS.map((g) => (
              <linearGradient key={g.id} id={g.id} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={g.start} stopOpacity={0.2} />
                <stop offset="100%" stopColor={g.end} stopOpacity={0.9} />
              </linearGradient>
            ))}
            {/* Hover glow gradients */}
            {PRESET_GRADIENTS.map((g) => (
              <linearGradient key={`glow-${g.id}`} id={`glow-${g.id}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={g.start} stopOpacity={0.4} />
                <stop offset="100%" stopColor={g.end} stopOpacity={1} />
              </linearGradient>
            ))}
            {/* Clean grid filter */}
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
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="end"
                >
                  {val}{unit}
                </text>
              </g>
            );
          })}

          {/* Axes lines */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={height - paddingBottom}
            stroke="#475569"
            strokeWidth="1"
          />
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#475569"
            strokeWidth="1"
          />

          {/* Y-Axis Label */}
          {yAxisLabel && (
            <text
              transform={`rotate(-90 ${15} ${height / 2})`}
              x={15}
              y={height / 2}
              fill="#64748b"
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
              className="uppercase tracking-wider"
            >
              {yAxisLabel}
            </text>
          )}

          {/* X-Axis Label */}
          {xAxisLabel && (
            <text
              x={paddingLeft + chartWidth / 2}
              y={height - 8}
              fill="#64748b"
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
              className="uppercase tracking-wider"
            >
              {xAxisLabel}
            </text>
          )}

          {/* Bars */}
          {data.map((item, idx) => {
            const x = paddingLeft + gap + idx * (barWidth + gap);
            const barHeight = (item.value / maxValue) * chartHeight;
            const y = height - paddingBottom - barHeight;
            const isHovered = hoveredIdx === idx;

            const grad = PRESET_GRADIENTS[idx % PRESET_GRADIENTS.length];
            const fillUrl = isHovered ? `url(#glow-${grad.id})` : `url(#${grad.id})`;
            const strokeColor = grad.end;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer group"
              >
                {/* Visual bar container with smooth layout */}
                <motion.rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  rx="6"
                  ry="6"
                  fill={fillUrl}
                  stroke={strokeColor}
                  strokeWidth={isHovered ? "2" : "1"}
                  className="transition-all duration-300"
                  filter={isHovered ? "url(#shadow)" : ""}
                  initial={{ scaleY: 0, y: height - paddingBottom }}
                  animate={{ scaleY: 1, y }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.05 }}
                  style={{ transformOrigin: "bottom" }}
                />

                {/* Light glow behind active bar */}
                {isHovered && (
                  <circle
                    cx={x + barWidth / 2}
                    cy={y}
                    r="8"
                    fill={strokeColor}
                    className="animate-ping opacity-30 pointer-events-none"
                  />
                )}

                {/* X Axis text label */}
                <text
                  x={x + barWidth / 2}
                  y={height - paddingBottom + 16}
                  fill={isHovered ? "#3b82f6" : "#94a3b8"}
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="transition-colors duration-200"
                >
                  {item.label.length > 8 ? `${item.label.slice(0, 6)}..` : item.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
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
                  {data[hoveredIdx].label}
                </span>
                <span className="text-white font-extrabold text-sm flex items-baseline gap-1">
                  {data[hoveredIdx].value}
                  <span className="text-xs text-slate-400 font-medium">{unit}</span>
                </span>
                <span className="text-blue-400 font-semibold">
                  {((data[hoveredIdx].value / totalValue) * 100).toFixed(1)}% of total
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // Render Pie/Donut Chart
  const renderDonutChart = () => {
    let accumulatedAngle = 0;

    const size = 280;
    const center = size / 2;
    const radius = 95;
    const strokeWidth = 26;

    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 py-4 w-full">
        {/* SVG Circle Graph */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none overflow-visible">
            <defs>
              <filter id="donut-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              className="opacity-50"
            />

            {/* Glowing active center overlay */}
            <g transform={`rotate(-90 ${center} ${center})`}>
              {data.map((item, idx) => {
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

          {/* Absolute Centered Readout Panel */}
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
                    {data[hoveredIdx].label}
                  </div>
                  <div className="text-xl font-black text-white mt-1 leading-none">
                    {data[hoveredIdx].value}
                    <span className="text-xs text-slate-400 font-medium ml-0.5">{unit}</span>
                  </div>
                  <div className="text-[10px] text-blue-400 font-extrabold mt-1 leading-none">
                    {((data[hoveredIdx].value / totalValue) * 100).toFixed(1)}%
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
                    Total
                  </div>
                  <div className="text-2xl font-black text-slate-100 mt-1 leading-none">
                    {totalValue}
                    <span className="text-xs text-slate-400 font-medium ml-0.5">{unit}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1 leading-none">
                    {data.length} segments
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Legend Display */}
        <div className="flex flex-col gap-2.5 min-w-[180px] max-w-[240px]">
          {data.map((item, idx) => {
            const grad = PRESET_GRADIENTS[idx % PRESET_GRADIENTS.length];
            const isHovered = hoveredIdx === idx;
            const percent = ((item.value / totalValue) * 100).toFixed(1);

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                  isHovered 
                    ? "bg-slate-900 border-slate-700/80 shadow-lg translate-x-1" 
                    : "bg-slate-950/20 border-transparent hover:bg-slate-950/40"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
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

  const renderLineChart = () => {
    const allX = data.flatMap((d: any) => d.values?.map((v: any) => v.x) || []);
    const allY = data.flatMap((d: any) => d.values?.map((v: any) => v.y) || []);
    
    if (allX.length === 0 || allY.length === 0) {
      return (
        <div className="text-slate-500 text-xs py-10">
          No data available
        </div>
      );
    }

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    const uniqueX = Array.from(new Set(allX)).sort((a, b) => (a as number) - (b as number)) as number[];

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
            const val = (minY + rangeY * ratio).toFixed(1);
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="end"
                >
                  {val}{unit}
                </text>
              </g>
            );
          })}

          {/* Axes lines */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={height - paddingBottom}
            stroke="#475569"
            strokeWidth="1"
          />
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#475569"
            strokeWidth="1"
          />

          {/* Y-Axis Label */}
          {yAxisLabel && (
            <text
              transform={`rotate(-90 ${15} ${height / 2})`}
              x={15}
              y={height / 2}
              fill="#64748b"
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
              className="uppercase tracking-wider"
            >
              {yAxisLabel}
            </text>
          )}

          {/* X-Axis Label */}
          {xAxisLabel && (
            <text
              x={paddingLeft + chartWidth / 2}
              y={height - 8}
              fill="#64748b"
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
              className="uppercase tracking-wider"
            >
              {xAxisLabel}
            </text>
          )}

          {/* Areas under the curves */}
          {data.map((series: any, idx: number) => {
            const sortedPoints = [...(series.values || [])].sort((a, b) => a.x - b.x);
            if (sortedPoints.length === 0) return null;

            const areaPathPoints = sortedPoints.map((p) => {
              const sx = paddingLeft + ((p.x - minX) / rangeX) * chartWidth;
              const sy = height - paddingBottom - ((p.y - minY) / rangeY) * chartHeight;
              return `${sx},${sy}`;
            });

            const firstX = paddingLeft + ((sortedPoints[0].x - minX) / rangeX) * chartWidth;
            const lastX = paddingLeft + ((sortedPoints[sortedPoints.length - 1].x - minX) / rangeX) * chartWidth;
            
            const zeroY = minY <= 0 && maxY >= 0
              ? height - paddingBottom - ((0 - minY) / rangeY) * chartHeight
              : height - paddingBottom;

            const pathString = `M ${firstX},${zeroY} L ${areaPathPoints.join(' L ')} L ${lastX},${zeroY} Z`;

            return (
              <path
                key={`area-${idx}`}
                d={pathString}
                fill={`url(#line-grad-${idx % LINE_COLORS.length})`}
                opacity="0.6"
                className="transition-all duration-300"
              />
            );
          })}

          {/* Lines */}
          {data.map((series: any, idx: number) => {
            const sortedPoints = [...(series.values || [])].sort((a, b) => a.x - b.x);
            if (sortedPoints.length === 0) return null;

            const pathPoints = sortedPoints.map((p, i) => {
              const sx = paddingLeft + ((p.x - minX) / rangeX) * chartWidth;
              const sy = height - paddingBottom - ((p.y - minY) / rangeY) * chartHeight;
              return `${i === 0 ? 'M' : 'L'} ${sx} ${sy}`;
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

          {/* Hover indicator vertical line */}
          {hoveredXIdx !== null && (
            <line
              x1={paddingLeft + ((uniqueX[hoveredXIdx] - minX) / rangeX) * chartWidth}
              y1={paddingTop}
              x2={paddingLeft + ((uniqueX[hoveredXIdx] - minX) / rangeX) * chartWidth}
              y2={height - paddingBottom}
              stroke="#64748b"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          )}

          {/* Interactive Highlight Circles */}
          {hoveredXIdx !== null && data.map((series: any, idx: number) => {
            const activeX = uniqueX[hoveredXIdx];
            const pt = series.values?.find((v: any) => v.x === activeX);
            if (!pt) return null;

            const sx = paddingLeft + ((pt.x - minX) / rangeX) * chartWidth;
            const sy = height - paddingBottom - ((pt.y - minY) / rangeY) * chartHeight;
            const color = LINE_COLORS[idx % LINE_COLORS.length];

            return (
              <g key={`highlight-${idx}`}>
                <circle
                  cx={sx}
                  cy={sy}
                  r="6"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="shadow-md"
                />
                <circle
                  cx={sx}
                  cy={sy}
                  r="12"
                  fill="transparent"
                  stroke={color}
                  strokeWidth="1.5"
                  className="animate-ping opacity-45"
                />
              </g>
            );
          })}

          {/* Hover Area Slices */}
          {uniqueX.map((x, idx) => {
            const sx = paddingLeft + ((x - minX) / rangeX) * chartWidth;
            const prevX = idx > 0 ? uniqueX[idx - 1] : x;
            const nextX = idx < uniqueX.length - 1 ? uniqueX[idx + 1] : x;
            
            const rectX = sx - (sx - (paddingLeft + ((prevX - minX) / rangeX) * chartWidth)) / 2;
            const rectWidth = ((paddingLeft + ((nextX - minX) / rangeX) * chartWidth) - sx) / 2 + (sx - rectX);

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
        </svg>

        {/* Hover Tooltip Overlay */}
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
                  {xAxisLabel || 'X'}: {uniqueX[hoveredXIdx]}
                </span>
                <div className="flex flex-col gap-1">
                  {data.map((series: any, idx: number) => {
                    const activeX = uniqueX[hoveredXIdx];
                    const pt = series.values?.find((v: any) => v.x === activeX);
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

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
      {/* Top Header Card Info */}
      {title && (
        <div className="flex items-center justify-between gap-4 border-b border-slate-850/80 pb-4 mb-6">
          <h4 className="text-sm font-extrabold text-slate-100 uppercase tracking-widest flex items-center gap-2">
            {type === 'bar' ? (
              <BarChart3 className="w-4 h-4 text-blue-400" />
            ) : type === 'line' ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <PieChart className="w-4 h-4 text-violet-400" />
            )}
            <span>{title}</span>
          </h4>
        </div>
      )}

      {/* Main Chart Rendering Container */}
      <div className="w-full flex flex-col justify-center">
        <div className="w-full flex justify-center">
          {type === 'bar'
            ? renderBarChart()
            : type === 'line'
              ? renderLineChart()
              : renderDonutChart()}
        </div>

        {/* Legend for Line Chart */}
        {type === 'line' && (
          <div className="flex flex-wrap justify-center gap-4 mt-6 border-t border-slate-800/60 pt-4">
            {data.map((series: any, idx: number) => {
              const color = LINE_COLORS[idx % LINE_COLORS.length];
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-1.5 rounded" style={{ backgroundColor: color }} />
                  <span className="text-xs font-bold text-slate-350">{series.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
