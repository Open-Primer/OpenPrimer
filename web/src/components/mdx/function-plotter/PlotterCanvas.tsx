"use client";

import React from 'react';
import { safeEvaluate } from './evaluator';

export interface PlotterCanvasProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  width: number;
  height: number;
  padding: number;
  isPaper: boolean;
  isFocus: boolean;
  gridStrokeColor: string;
  axisStrokeColor: string;
  isExpressionMode: boolean;
  resolvedMode: string;
  resolvedXLabel: string;
  resolvedYLabel: string;
  xMinVal: number;
  xMaxVal: number;
  yMinVal: number;
  yMaxVal: number;
  getSvgX: (mathX: number, maxX?: number, minX?: number) => number;
  getSvgY: (mathY: number, maxY?: number, minY?: number) => number;
  points: string;
  supplyPoints: string;
  demandPoints: string;
  expressionPoints: string;
  showOverlay: boolean;
  overlay2Points: string;
  overlay3Points: string;
  calculusMode: 'off' | 'tangent' | 'riemann';
  riemannRects: { x: number; y: number; w: number; h: number; positive: boolean }[];
  tangentX: number;
  tangentY: number;
  tangentSlope: number;
  tx1: number;
  ty1: number;
  tx2: number;
  ty2: number;
  isHovering: boolean;
  mouseCoords: { x: number; y: number } | null;
  getYValueForMode: (x: number) => number;
  plottedExpression: string;
  currentQD: number;
  currentQS: number;
  handleSvgMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleSvgMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleSvgMouseLeave: () => void;
  handleSvgTouchMove: (e: React.TouchEvent<SVGSVGElement>) => void;
}

export const PlotterCanvas: React.FC<PlotterCanvasProps> = ({
  svgRef,
  width,
  height,
  padding,
  isPaper,
  isFocus,
  gridStrokeColor,
  axisStrokeColor,
  isExpressionMode,
  resolvedMode,
  resolvedXLabel,
  resolvedYLabel,
  xMinVal,
  xMaxVal,
  yMinVal,
  yMaxVal,
  getSvgX,
  getSvgY,
  points,
  supplyPoints,
  demandPoints,
  expressionPoints,
  showOverlay,
  overlay2Points,
  overlay3Points,
  calculusMode,
  riemannRects,
  tangentX,
  tangentY,
  tangentSlope,
  tx1,
  ty1,
  tx2,
  ty2,
  isHovering,
  mouseCoords,
  getYValueForMode,
  plottedExpression,
  currentQD,
  currentQS,
  handleSvgMouseMove,
  handleSvgMouseDown,
  handleSvgMouseLeave,
  handleSvgTouchMove,
}) => {
  return (
    <div className={`col-span-1 md:col-span-7 rounded-2xl border p-4 flex flex-col items-center justify-center relative select-none overflow-hidden ${isPaper ? "bg-white border-[#dbd5be]" : isFocus ? "bg-[#000000] border-[#262626]" : "bg-slate-950/80 border-slate-800"}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleSvgMouseMove}
        onMouseDown={handleSvgMouseDown}
        onMouseLeave={handleSvgMouseLeave}
        onTouchMove={handleSvgTouchMove}
        className="w-full h-auto max-w-[360px] cursor-crosshair overflow-visible"
      >
        {/* Grid markings & subdivisions */}
        {!isExpressionMode && resolvedMode !== 'lennard-jones' ? (
          resolvedMode === 'linear' ? (
            <>
              {[-50, -25, 0, 25, 50].map((xVal) => {
                const sx = getSvgX(xVal, 50, -50);
                return (
                  <g key={`gx-${xVal}`} className="opacity-25">
                    <line x1={sx} y1={padding} x2={sx} y2={height - padding} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                    <text x={sx} y={height - padding + 12} fill={isPaper ? "#475569" : "#64748b"} fontSize="7" fontWeight="bold" textAnchor="middle">{xVal}</text>
                  </g>
                );
              })}
              {[-100, -50, 0, 50].map((yVal) => {
                const sy = getSvgY(yVal, 50, -100);
                return (
                  <g key={`gy-${yVal}`} className="opacity-25">
                    <line x1={padding} y1={sy} x2={width - padding} y2={sy} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                    <text x={padding - 6} y={sy + 3} fill={isPaper ? "#475569" : "#64748b"} fontSize="7" fontWeight="bold" textAnchor="end">{yVal}</text>
                  </g>
                );
              })}
            </>
          ) : (
            [0, 25, 50, 75, 100].map((val) => {
              const sx = getSvgX(val);
              const sy = getSvgY(val);
              return (
                <g key={val} className="opacity-30">
                  <line x1={sx} y1={padding} x2={sx} y2={height - padding} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                  <line x1={padding} y1={sy} x2={width - padding} y2={sy} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                </g>
              );
            })
          )
        ) : Array.from({ length: 5 }).map((_, i) => {
          const xVal = xMinVal + (i * (xMaxVal - xMinVal)) / 4;
          const yVal = yMinVal + (i * (yMaxVal - yMinVal)) / 4;
          const sx = getSvgX(xVal, xMaxVal, xMinVal);
          const sy = getSvgY(yVal, yMaxVal, yMinVal);
          return (
            <g key={i} className="opacity-25">
              <line x1={sx} y1={padding} x2={sx} y2={height - padding} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
              <line x1={padding} y1={sy} x2={width - padding} y2={sy} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
              <text x={sx} y={height - padding + 12} fill={isPaper ? "#475569" : "#64748b"} fontSize="7" fontWeight="bold" textAnchor="middle">{xVal.toFixed(2)}</text>
              <text x={padding - 6} y={sy + 3} fill={isPaper ? "#475569" : "#64748b"} fontSize="7" fontWeight="bold" textAnchor="end">{yVal.toFixed(2)}</text>
            </g>
          );
        })}

        {/* Coordinate Axes */}
        {!isExpressionMode && resolvedMode !== 'lennard-jones' ? (
          resolvedMode === 'linear' ? (
            <>
              {/* Centered Crossing Axes for Prospect Theory S-Curve */}
              <line x1={padding} y1={getSvgY(0, 50, -100)} x2={width - padding} y2={getSvgY(0, 50, -100)} stroke={axisStrokeColor} strokeWidth="1.5" />
              <line x1={getSvgX(0, 50, -50)} y1={padding} x2={getSvgX(0, 50, -50)} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
            </>
          ) : (
            <>
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
              <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
            </>
          )
        ) : (
          <>
            {yMinVal < 0 && yMaxVal > 0 && (
              <line x1={padding} y1={getSvgY(0, yMaxVal, yMinVal)} x2={width - padding} y2={getSvgY(0, yMaxVal, yMinVal)} stroke={axisStrokeColor} strokeWidth="1.5" />
            )}
            {xMinVal < 0 && xMaxVal > 0 && (
              <line x1={getSvgX(0, xMaxVal, xMinVal)} y1={padding} x2={getSvgX(0, xMaxVal, xMinVal)} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
            )}
          </>
        )}

        {/* Dynamic function curves */}
        {resolvedMode === 'supply-demand' ? (
          <>
            <polyline fill="none" stroke="#ef4444" strokeWidth="3" points={demandPoints} strokeLinecap="round" />
            <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={supplyPoints} strokeLinecap="round" />
          </>
        ) : resolvedMode === 'lennard-jones' ? (
          <>
            {/* Equilibrium line (r_m) */}
            <line
              x1={getSvgX(Math.pow(2, 1/6) * 1.0, xMaxVal, xMinVal)}
              y1={padding}
              x2={getSvgX(Math.pow(2, 1/6) * 1.0, xMaxVal, xMinVal)}
              y2={height - padding}
              stroke="#10b981"
              strokeWidth="1"
              strokeDasharray="4,4"
              className="opacity-60"
            />
            {/* Minimum potential energy line (-epsilon) */}
            <line
              x1={padding}
              y1={getSvgY(-1.0, yMaxVal, yMinVal)}
              x2={width - padding}
              y2={getSvgY(-1.0, yMaxVal, yMinVal)}
              stroke="#6366f1"
              strokeWidth="1"
              strokeDasharray="4,4"
              className="opacity-40"
            />
            <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={points} strokeLinecap="round" />
          </>
        ) : !isExpressionMode ? (
          <polyline fill="none" stroke={isPaper ? "#2563eb" : "#10b981"} strokeWidth="3" points={points} strokeLinecap="round" />
        ) : (
          <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={expressionPoints} strokeLinecap="round" />
        )}

        {/* ── Multi-function overlay polylines ── */}
        {isExpressionMode && showOverlay && overlay2Points && (
          <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,3" points={overlay2Points} strokeLinecap="round" />
        )}
        {isExpressionMode && showOverlay && overlay3Points && (
          <polyline fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3,4" points={overlay3Points} strokeLinecap="round" />
        )}

        {/* ── Calculus: Riemann rectangles ── */}
        {isExpressionMode && calculusMode === 'riemann' && riemannRects.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y={r.y}
            width={Math.max(0, r.w - 1)}
            height={r.h}
            fill={r.positive ? 'rgba(59,130,246,0.25)' : 'rgba(239,68,68,0.25)'}
            stroke={r.positive ? '#3b82f6' : '#ef4444'}
            strokeWidth="0.8"
          />
        ))}

        {/* ── Calculus: Tangent line ── */}
        {isExpressionMode && calculusMode === 'tangent' && !isNaN(tangentY) && (
          <>
            <line
              x1={getSvgX(tx1, xMaxVal, xMinVal)}
              y1={getSvgY(ty1, yMaxVal, yMinVal)}
              x2={getSvgX(tx2, xMaxVal, xMinVal)}
              y2={getSvgY(ty2, yMaxVal, yMinVal)}
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="5,3"
            />
            <circle
              cx={getSvgX(tangentX, xMaxVal, xMinVal)}
              cy={getSvgY(tangentY, yMaxVal, yMinVal)}
              r="4"
              fill="#06b6d4"
              stroke="#fff"
              strokeWidth="1.5"
            />
            <text
              x={getSvgX(tangentX, xMaxVal, xMinVal) + 8}
              y={getSvgY(tangentY, yMaxVal, yMinVal) - 8}
              fill="#06b6d4"
              fontSize="9"
              fontWeight="900"
              fontFamily="monospace"
            >
              f&apos;({tangentX.toFixed(2)}) ≈ {tangentSlope.toFixed(3)}
            </text>
          </>
        )}

        {/* Labels and Ticks */}
        <text x={width - padding} y={height - padding + 22} fill={isPaper ? "#1e293b" : "#94a3b8"} fontSize="9" fontWeight="900" textAnchor="end" className="uppercase tracking-widest">{resolvedXLabel}</text>
        <text x={padding - 10} y={padding - 12} fill={isPaper ? "#1e293b" : "#94a3b8"} fontSize="9" fontWeight="900" textAnchor="start" className="uppercase tracking-widest">{resolvedYLabel}</text>
        
        {/* Real-time Hover coordinates tooltip */}
        {isHovering && mouseCoords && (
          <g className="transition-opacity duration-150">
            <circle
              cx={isExpressionMode 
                ? getSvgX(mouseCoords.x, xMaxVal, xMinVal) 
                : (resolvedMode === 'lennard-jones'
                    ? getSvgX(mouseCoords.x, xMaxVal, xMinVal)
                    : (resolvedMode === 'linear' 
                        ? getSvgX(mouseCoords.x, 50, -50) 
                        : (resolvedMode === 'compound-interest' 
                            ? getSvgX(mouseCoords.x, 30, 0) 
                            : getSvgX(mouseCoords.x))))}
              cy={isExpressionMode 
                ? getSvgY(safeEvaluate(plottedExpression, mouseCoords.x), yMaxVal, yMinVal) 
                : (resolvedMode === 'lennard-jones'
                    ? getSvgY(getYValueForMode(mouseCoords.x), yMaxVal, yMinVal)
                    : (resolvedMode === 'linear' 
                        ? getSvgY(getYValueForMode(mouseCoords.x), 50, -100) 
                        : (resolvedMode === 'compound-interest' 
                            ? getSvgY(getYValueForMode(mouseCoords.x), 100 * Math.pow(1.15, 30), 0) 
                            : getSvgY(getYValueForMode(mouseCoords.x)))))}
              r="4.5"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>

      {/* Dynamic live coordinate readout */}
      {isHovering && mouseCoords && (
        <div className={`absolute bottom-3 left-4 px-3 py-1 rounded-md text-[10px] font-black font-mono shadow-sm border ${
          isPaper ? "bg-white border-[#dbd5be] text-slate-700" : "bg-slate-900/90 border-slate-800 text-emerald-400"
        }`}>
          {resolvedMode === 'lennard-jones' ? `r: ${mouseCoords.x.toFixed(2)} Å | V(r): ${getYValueForMode(mouseCoords.x).toFixed(3)} eV` : `x: ${mouseCoords.x.toFixed(2)} | y: ${
            isExpressionMode 
              ? (safeEvaluate(plottedExpression, mouseCoords.x) ? safeEvaluate(plottedExpression, mouseCoords.x).toFixed(2) : "NaN")
              : (resolvedMode === 'supply-demand' 
                  ? `QD: ${currentQD.toFixed(0)} QS: ${currentQS.toFixed(0)}` 
                  : getYValueForMode(mouseCoords.x).toFixed(2))
          }`}
        </div>
      )}
    </div>
  );
};
