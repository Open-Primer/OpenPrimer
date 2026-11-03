import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BarChartProps {
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

export const BarChartRender: React.FC<BarChartProps> = ({
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
              <clipPath id="chart-clip">
                <rect x={paddingLeft - 2} y={paddingTop} width={chartWidth + 4} height={chartHeight} />
              </clipPath>
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
                <text 
                  key={gIdx} 
                  x={xCenter} 
                  y={height - paddingBottom + 12} 
                  fill="#94a3b8" 
                  fontSize="8.5" 
                  fontWeight="bold" 
                  textAnchor="end"
                  transform={`rotate(-25, ${xCenter}, ${height - paddingBottom + 12})`}
                >
                  {String(xVal).length > 25 ? `${String(xVal).slice(0, 23)}..` : String(xVal)}
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
                      height={Math.max(barHeight + 10, 2)} /* Offset downwards to clip flat at the baseline */
                      clipPath="url(#chart-clip)"
                      rx="4"
                      ry="4"
                      fill={fillUrl}
                      stroke={grad.end}
                      strokeWidth={isHovered ? "2" : "1"}
                      filter={isHovered ? "url(#shadow)" : ""}
                      initial={{ height: 0, y: height - paddingBottom }}
                      animate={{ height: Math.max(barHeight + 10, 2), y: barY }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: gIdx * 0.04 }}
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
              <clipPath id="chart-clip-single">
                <rect x={paddingLeft - 2} y={paddingTop} width={chartWidth + 4} height={chartHeight} />
              </clipPath>
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
                    height={Math.max(barHeight + 10, 2)} /* Offset downwards to clip flat at the baseline */
                    clipPath="url(#chart-clip-single)"
                    rx="6"
                    ry="6"
                    fill={fillUrl}
                    stroke={grad.end}
                    strokeWidth={isHovered ? "2" : "1"}
                    filter={isHovered ? "url(#shadow)" : ""}
                    initial={{ height: 0, y: height - paddingBottom }}
                    animate={{ height: Math.max(barHeight + 10, 2), y }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.05 }}
                  />

                  {isHovered && (
                    <circle cx={x + barWidth / 2} cy={y} r="8" fill={grad.end} className="animate-ping opacity-30 pointer-events-none" />
                  )}

                  <text 
                    x={x + barWidth / 2} 
                    y={height - paddingBottom + 12} 
                    fill={isHovered ? "#3b82f6" : "#94a3b8"} 
                    fontSize="8.5" 
                    fontWeight="bold" 
                    textAnchor="end"
                    transform={`rotate(-25, ${x + barWidth / 2}, ${height - paddingBottom + 12})`}
                  >
                    {item.label.length > 25 ? `${item.label.slice(0, 23)}..` : item.label}
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

};
