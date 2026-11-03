"use client";

import React from 'react';

export interface FunctionCanvasProps {
  width: number;
  height: number;
  padding: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  scaleMode: 'linear' | 'logarithmic';
  formulaString: string;
  curvePath: string;
  xTicks: number[];
  yTicks: number[];
  logSubGridLines: number[];
  mapX: (x: number) => number;
  mapY: (y: number) => number;
}

export const FunctionCanvas: React.FC<FunctionCanvasProps> = ({
  width,
  height,
  padding,
  xMin,
  xMax,
  yMin,
  yMax,
  scaleMode,
  formulaString,
  curvePath,
  xTicks,
  yTicks,
  logSubGridLines,
  mapX,
  mapY
}) => {
  return (
    <div className="xl:col-span-3 flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner relative overflow-hidden">
      <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-[12px] font-mono font-black text-blue-400 select-none shadow-md z-10">
        {formulaString}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-w-[600px] text-slate-500 select-none">
        {scaleMode === 'logarithmic' && logSubGridLines.map((xVal, idx) => {
          const px = mapX(xVal);
          return (
            <line
              key={`log-sub-${idx}`}
              x1={px} y1={padding}
              x2={px} y2={height - padding}
              stroke="currentColor"
              strokeOpacity="0.05"
              strokeWidth="1"
            />
          );
        })}
        {yTicks.map(tick => (
          <line
            key={`grid-y-${tick}`}
            x1={padding}
            y1={mapY(tick)}
            x2={width - padding}
            y2={mapY(tick)}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeDasharray="4 4"
          />
        ))}
        {xTicks.map(tick => (
          <line
            key={`grid-x-${tick}`}
            x1={mapX(tick)}
            y1={padding}
            x2={mapX(tick)}
            y2={height - padding}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeDasharray="4 4"
          />
        ))}
        {yMin <= 0 && yMax >= 0 && (
          <line
            x1={padding}
            y1={mapY(0)}
            x2={width - padding}
            y2={mapY(0)}
            stroke="#475569"
            strokeWidth="1.5"
          />
        )}
        {scaleMode === 'linear' && xMin <= 0 && xMax >= 0 && (
          <line
            x1={mapX(0)}
            y1={padding}
            x2={mapX(0)}
            y2={height - padding}
            stroke="#475569"
            strokeWidth="1.5"
          />
        )}
        {xTicks.map(tick => {
          const px = mapX(tick);
          const py = mapY(0);
          const isZero = tick === 0;
          if (isZero && scaleMode === 'linear') return null;
          return (
            <g key={`lbl-x-${tick}`}>
              <line x1={px} y1={py - 3} x2={px} y2={py + 3} stroke="#475569" strokeWidth="1.5" />
              <text
                x={px}
                y={py + 18}
                fill="#94a3b8"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                {tick}
              </text>
            </g>
          );
        })}
        {yTicks.map(tick => {
          const px = scaleMode === 'linear' ? mapX(0) : padding;
          const py = mapY(tick);
          return (
            <g key={`lbl-y-${tick}`}>
              <line x1={px - 3} y1={py} x2={px + 3} y2={py} stroke="#475569" strokeWidth="1.5" />
              <text
                x={px - 8}
                y={py + 3}
                fill="#94a3b8"
                fontSize="9"
                fontWeight="bold"
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          );
        })}
        {scaleMode === 'linear' && (
          <text
            x={mapX(0) - 10}
            y={mapY(0) + 14}
            fill="#64748b"
            fontSize="9"
            fontWeight="extrabold"
          >
            0
          </text>
        )}
        <text
          x={width - padding + 5}
          y={mapY(0) + 3}
          fill="#94a3b8"
          fontSize="9"
          fontWeight="extrabold"
          textAnchor="start"
        >
          X
        </text>
        <text
          x={scaleMode === 'linear' ? mapX(0) : padding}
          y={padding - 12}
          fill="#94a3b8"
          fontSize="9"
          fontWeight="extrabold"
          textAnchor="middle"
        >
          Y
        </text>
        {curvePath && (
          <path
            d={curvePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-150"
          />
        )}
      </svg>
    </div>
  );
};
