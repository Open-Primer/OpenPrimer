import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScatterChartProps {
  normalized: any;
  selectedSeriesIdx: number;
  width: number;
  height: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingTop: number;
  paddingRight: number;
  hoveredScatterIdx: number | null;
  setHoveredScatterIdx: (idx: number | null) => void;
  tooltipPos: { x: number; y: number };
  setTooltipPos: (pos: { x: number; y: number }) => void;
  t: any;
}

export const ScatterChartRender: React.FC<ScatterChartProps> = ({
  normalized,
  selectedSeriesIdx,
  width,
  height,
  paddingLeft,
  paddingBottom,
  paddingTop,
  paddingRight,
  hoveredScatterIdx,
  setHoveredScatterIdx,
  tooltipPos,
  setTooltipPos,
  t
}) => {
    interface ScatterPoint {
      x: number;
      y: number;
      label: string;
      seriesIdx: number;
    }

    const points: ScatterPoint[] = [];

    if (normalized.isMultiSeries) {
      normalized.seriesData.forEach((series, sIdx) => {
        series.values.forEach((v) => {
          if (typeof v.x === 'number' && typeof v.y === 'number') {
            points.push({ x: v.x, y: v.y, label: `${series.label} (x: ${v.x})`, seriesIdx: sIdx });
          }
        });
      });
    } else {
      normalized.simpleData.forEach((d, idx) => {
        const xVal = parseFloat(d.label);
        const yVal = d.value;
        const xResolved = isNaN(xVal) ? idx : xVal;
        points.push({ x: xResolved, y: yVal, label: d.label, seriesIdx: 0 });
      });
    }

    if (points.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-slate-400">
          No numerical data available for scatter plot.
        </div>
      );
    }

    // Determine numerical bounds
    const xValuesList = points.map(p => p.x);
    const yValuesList = points.map(p => p.y);
    const minXRaw = Math.min(...xValuesList);
    const maxXRaw = Math.max(...xValuesList);
    const minYRaw = Math.min(...yValuesList);
    const maxYRaw = Math.max(...yValuesList);

    const xRange = maxXRaw - minXRaw || 1;
    const yRange = maxYRaw - minYRaw || 1;
    const minX = minXRaw - xRange * 0.1;
    const maxX = maxXRaw + xRange * 0.1;
    const minY = Math.max(0, minYRaw - yRange * 0.1);
    const maxY = maxYRaw + yRange * 0.1;

    // Linear Regression (Least Squares) for selected series (or all simple data)
    const regressionPoints = normalized.isMultiSeries
      ? points.filter(p => p.seriesIdx === selectedSeriesIdx)
      : points;

    let slope = 0;
    let intercept = 0;
    let rValue = 0;
    let rSquared = 0;
    const N = regressionPoints.length;

    if (N > 1) {
      let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
      regressionPoints.forEach(p => {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumXX += p.x * p.x;
        sumYY += p.y * p.y;
      });

      const num = N * sumXY - sumX * sumY;
      const denSlope = N * sumXX - sumX * sumX;
      slope = denSlope !== 0 ? num / denSlope : 0;
      intercept = (sumY - slope * sumX) / N;

      const denR = Math.sqrt((N * sumXX - sumX * sumX) * (N * sumYY - sumY * sumY));
      rValue = denR !== 0 ? num / denR : 0;
      rSquared = rValue * rValue;
    }

    // Coordinate converters
    const getX = (xVal: number) => paddingLeft + ((xVal - minX) / (maxX - minX)) * chartWidth;
    const getY = (yVal: number) => height - paddingBottom - ((yVal - minY) / (maxY - minY)) * chartHeight;

    // Regression line points
    const regLineX1 = Math.min(...regressionPoints.map(p => p.x));
    const regLineX2 = Math.max(...regressionPoints.map(p => p.x));
    const regLineY1 = slope * regLineX1 + intercept;
    const regLineY2 = slope * regLineX2 + intercept;

    return (
      <div className="relative w-full flex flex-col items-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <clipPath id="chart-clip-scatter">
              <rect x={paddingLeft - 2} y={paddingTop} width={chartWidth + 4} height={chartHeight} />
            </clipPath>
            <filter id="glow-scatter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const yVal = minY + (maxY - minY) * ratio;
            const y = getY(yVal);
            return (
              <g key={`y-grid-${i}`} className="opacity-40">
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
                <text x={paddingLeft - 10} y={y + 4} fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">{yVal.toFixed(1)}{unit}</text>
              </g>
            );
          })}

          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const xVal = minX + (maxX - minX) * ratio;
            const x = getX(xVal);
            return (
              <g key={`x-grid-${i}`} className="opacity-40">
                <line x1={x} y1={paddingTop} x2={x} y2={height - paddingBottom} stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
                <text x={x} y={height - paddingBottom + 14} fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">{xVal.toFixed(1)}</text>
              </g>
            );
          })}

          {/* Axes */}
          <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#475569" strokeWidth="1" />
          <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#475569" strokeWidth="1" />

          {/* Linear regression trendline */}
          {N > 1 && (
            <g clipPath="url(#chart-clip-scatter)">
              <motion.line
                x1={getX(regLineX1)}
                y1={getY(regLineY1)}
                x2={getX(regLineX2)}
                y2={getY(regLineY2)}
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeDasharray="6,4"
                filter="url(#glow-scatter)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </g>
          )}

          {/* Render individual points */}
          {points.map((p, idx) => {
            const cx = getX(p.x);
            const cy = getY(p.y);
            const color = LINE_COLORS[p.seriesIdx % LINE_COLORS.length];
            const isHovered = hoveredIdx === idx;

            return (
              <g key={idx}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 8 : 5}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2 : 1}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Analytics stats dashboard overlay */}
        {N > 1 && (
          <div className="mt-4 p-3 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl flex flex-col gap-1 w-full max-w-sm text-center">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              {langKey === 'FR' ? 'Analyse de Régression' : 'Regression Analysis'}
            </span>
            <div className="grid grid-cols-3 gap-2 mt-1 text-slate-300 text-xs">
              <div className="flex flex-col bg-slate-950/40 p-2 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Modèle (y=)</span>
                <span className="font-mono font-bold text-slate-200 mt-0.5">
                  {slope.toFixed(2)}x {intercept >= 0 ? '+' : '-'} {Math.abs(intercept).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col bg-slate-950/40 p-2 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Pearson R</span>
                <span className="font-mono font-bold text-emerald-400 mt-0.5">
                  {(rValue >= 0 ? '+' : '') + rValue.toFixed(3)}
                </span>
              </div>
              <div className="flex flex-col bg-slate-950/40 p-2 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">R² (Déterm.)</span>
                <span className="font-mono font-bold text-cyan-400 mt-0.5">{rSquared.toFixed(3)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tooltip detail panel */}
        <AnimatePresence>
          {hoveredIdx !== null && points[hoveredIdx] && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-4 pointer-events-none bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl shadow-xl flex flex-col gap-0.5 z-20"
            >
              <span className="text-[9px] font-black uppercase text-indigo-400">
                {normalized.isMultiSeries ? normalized.seriesData[points[hoveredIdx].seriesIdx].label : (langKey === 'FR' ? 'Point' : 'Point')}
              </span>
              <span className="text-xs font-bold text-slate-100">{points[hoveredIdx].label}</span>
              <div className="flex gap-3 text-xs mt-1 font-mono">
                <span className="text-slate-400">X: <strong className="text-slate-200">{points[hoveredIdx].x.toFixed(2)}</strong></span>
                <span className="text-slate-400">Y: <strong className="text-slate-200">{points[hoveredIdx].y.toFixed(2)}</strong></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

};
