"use client";

import React from 'react';
import { Candlestick, DrawingMode, MinMaxRange, FibAnchor, ChartPadding } from './types';
import { getXCoord, getYCoord, getPriceFromY, getIndexFromX, getSvgPathString } from './math';

interface ChartSvgCanvasProps {
  history: Candlestick[];
  minMax: MinMaxRange;
  activeDrawing: DrawingMode;
  showIndicators: boolean;
  indicatorLines: {
    smaPoints: { x: number; y: number }[];
    upperBBPoints: { x: number; y: number }[];
    lowerBBPoints: { x: number; y: number }[];
  } | null;
  supportLineY: number;
  fibLowAnchor: FibAnchor;
  fibHighAnchor: FibAnchor;
  draggingElement: 'support' | 'fibLow' | 'fibHigh' | null;
  setDraggingDrawing: (val: 'support' | 'fibLow' | 'fibHigh' | null) => void;
  setSupportLineY: (price: number) => void;
  setFibLowAnchor: React.Dispatch<React.SetStateAction<FibAnchor>>;
  setFibHighAnchor: React.Dispatch<React.SetStateAction<FibAnchor>>;
  svgWidth: number;
  svgHeight: number;
  chartPadding: ChartPadding;
}

export const ChartSvgCanvas: React.FC<ChartSvgCanvasProps> = ({
  history,
  minMax,
  activeDrawing,
  showIndicators,
  indicatorLines,
  supportLineY,
  fibLowAnchor,
  fibHighAnchor,
  draggingElement,
  setDraggingDrawing,
  setSupportLineY,
  setFibLowAnchor,
  setFibHighAnchor,
  svgWidth,
  svgHeight,
  chartPadding,
}) => {
  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeDrawing === 'support') {
      const lineY = getYCoord(supportLineY, minMax, svgHeight, chartPadding);
      if (Math.abs(y - lineY) < 12) {
        setDraggingDrawing('support');
      }
    } else if (activeDrawing === 'fibonacci') {
      const lowY = getYCoord(fibLowAnchor.price, minMax, svgHeight, chartPadding);
      const lowX = getXCoord(fibLowAnchor.idx, history.length, svgWidth, chartPadding);
      const highY = getYCoord(fibHighAnchor.price, minMax, svgHeight, chartPadding);
      const highX = getXCoord(fibHighAnchor.idx, history.length, svgWidth, chartPadding);

      const dLow = Math.sqrt((x - lowX) ** 2 + (y - lowY) ** 2);
      const dHigh = Math.sqrt((x - highX) ** 2 + (y - highY) ** 2);

      if (dLow < 15) {
        setDraggingDrawing('fibLow');
      } else if (dHigh < 15) {
        setDraggingDrawing('fibHigh');
      }
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingElement) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const targetPrice = getPriceFromY(y, minMax, svgHeight, chartPadding);
    const targetIdx = getIndexFromX(x, history.length, svgWidth, chartPadding);

    if (draggingElement === 'support') {
      setSupportLineY(Math.max(minMax.min, Math.min(minMax.max, targetPrice)));
    } else if (draggingElement === 'fibLow') {
      setFibLowAnchor({
        idx: targetIdx,
        price: Math.max(minMax.min, Math.min(minMax.max, targetPrice))
      });
    } else if (draggingElement === 'fibHigh') {
      setFibHighAnchor({
        idx: targetIdx,
        price: Math.max(minMax.min, Math.min(minMax.max, targetPrice))
      });
    }
  };

  const handleSvgMouseUpOrLeave = () => {
    setDraggingDrawing(null);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#020617] p-2 w-full max-w-[560px]">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        onMouseDown={handleSvgMouseDown}
        onMouseMove={handleSvgMouseMove}
        onMouseUp={handleSvgMouseUpOrLeave}
        onMouseLeave={handleSvgMouseUpOrLeave}
        className="block"
      >
        {/* Horizontal Price Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((pct, idx) => {
          const p = minMax.min + pct * (minMax.max - minMax.min);
          const y = getYCoord(p, minMax, svgHeight, chartPadding);
          return (
            <g key={idx}>
              <line
                x1={chartPadding.left}
                y1={y}
                x2={svgWidth - chartPadding.right}
                y2={y}
                stroke="rgba(51, 65, 85, 0.15)"
                strokeWidth="1"
              />
              <text
                x={svgWidth - chartPadding.right + 8}
                y={y + 4}
                fill="rgba(148, 163, 184, 0.6)"
                fontSize="8.5"
                fontFamily="monospace"
              >
                {p.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Draw Candlesticks & Volume overlay bars */}
        {history.map((c, i) => {
          const x = getXCoord(i, history.length, svgWidth, chartPadding);
          const isBullish = c.close >= c.open;
          const candleColor = isBullish ? '#10b981' : '#f43f5e';

          const yOpen = getYCoord(c.open, minMax, svgHeight, chartPadding);
          const yClose = getYCoord(c.close, minMax, svgHeight, chartPadding);
          const yHigh = getYCoord(c.high, minMax, svgHeight, chartPadding);
          const yLow = getYCoord(c.low, minMax, svgHeight, chartPadding);

          const bodyY = Math.min(yOpen, yClose);
          const bodyH = Math.max(1.5, Math.abs(yOpen - yClose));

          const volH = (c.volume / 10000) * 35;
          const volY = svgHeight - chartPadding.bottom - volH;

          return (
            <g key={i}>
              <line
                x1={x}
                y1={yHigh}
                x2={x}
                y2={yLow}
                stroke={candleColor}
                strokeWidth="1.25"
              />
              <rect
                x={x - 4}
                y={bodyY}
                width="8"
                height={bodyH}
                fill={candleColor}
                rx="1"
              />
              <rect
                x={x - 3}
                y={volY}
                width="6"
                height={volH}
                fill={isBullish ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}
              />
            </g>
          );
        })}

        {/* Overlay Technical Indicators */}
        {showIndicators && indicatorLines && (
          <g>
            <path
              d={getSvgPathString(indicatorLines.upperBBPoints)}
              fill="none"
              stroke="rgba(56, 189, 248, 0.35)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <path
              d={getSvgPathString(indicatorLines.lowerBBPoints)}
              fill="none"
              stroke="rgba(56, 189, 248, 0.35)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <path
              d={getSvgPathString(indicatorLines.smaPoints)}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Interactive Support Line */}
        {activeDrawing === 'support' && (
          <g className="cursor-ns-resize">
            <line
              x1={chartPadding.left}
              y1={getYCoord(supportLineY, minMax, svgHeight, chartPadding)}
              x2={svgWidth - chartPadding.right}
              y2={getYCoord(supportLineY, minMax, svgHeight, chartPadding)}
              stroke="#ec4899"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <circle
              cx={svgWidth / 2}
              cy={getYCoord(supportLineY, minMax, svgHeight, chartPadding)}
              r="6"
              fill="#ec4899"
              className="hover:scale-125 transition-transform"
            />
            <rect
              x={chartPadding.left + 5}
              y={getYCoord(supportLineY, minMax, svgHeight, chartPadding) - 18}
              width="85"
              height="15"
              fill="rgba(236, 72, 153, 0.2)"
              rx="3"
            />
            <text
              x={chartPadding.left + 8}
              y={getYCoord(supportLineY, minMax, svgHeight, chartPadding) - 7}
              fill="#f472b6"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Support: {supportLineY.toFixed(2)}$
            </text>
          </g>
        )}

        {/* Interactive Fibonacci Retracements */}
        {activeDrawing === 'fibonacci' && (
          <g>
            {(() => {
              const startX = getXCoord(fibLowAnchor.idx, history.length, svgWidth, chartPadding);
              const startY = getYCoord(fibLowAnchor.price, minMax, svgHeight, chartPadding);
              const endX = getXCoord(fibHighAnchor.idx, history.length, svgWidth, chartPadding);
              const endY = getYCoord(fibHighAnchor.price, minMax, svgHeight, chartPadding);

              const diff = fibHighAnchor.price - fibLowAnchor.price;

              const ratios = [
                { pct: 0.0, label: '0.0%', color: '#38bdf8' },
                { pct: 0.236, label: '23.6%', color: '#94a3b8' },
                { pct: 0.382, label: '38.2%', color: '#94a3b8' },
                { pct: 0.5, label: '50.0%', color: '#fbbf24' },
                { pct: 0.618, label: '61.8% (Golden)', color: '#f59e0b' },
                { pct: 0.786, label: '78.6%', color: '#94a3b8' },
                { pct: 1.0, label: '100.0%', color: '#ec4899' }
              ];

              return ratios.map((ratio, rIdx) => {
                const levelPrice = fibLowAnchor.price + diff * (1 - ratio.pct);
                const levelY = getYCoord(levelPrice, minMax, svgHeight, chartPadding);

                return (
                  <g key={rIdx}>
                    <line
                      x1={startX}
                      y1={levelY}
                      x2={endX}
                      y2={levelY}
                      stroke={ratio.color}
                      strokeWidth="1"
                      strokeDasharray="3,3"
                    />
                    <text
                      x={startX + 4}
                      y={levelY - 4}
                      fill="rgba(255,255,255,0.45)"
                      fontSize="7.5"
                      fontFamily="monospace"
                    >
                      {ratio.label} - {levelPrice.toFixed(2)}
                    </text>
                  </g>
                );
              });
            })()}

            {/* Draggable Anchors */}
            <circle
              cx={getXCoord(fibLowAnchor.idx, history.length, svgWidth, chartPadding)}
              cy={getYCoord(fibLowAnchor.price, minMax, svgHeight, chartPadding)}
              r="7"
              fill="#38bdf8"
              className="cursor-move hover:scale-125 transition-transform"
            />
            <circle
              cx={getXCoord(fibHighAnchor.idx, history.length, svgWidth, chartPadding)}
              cy={getYCoord(fibHighAnchor.price, minMax, svgHeight, chartPadding)}
              r="7"
              fill="#f59e0b"
              className="cursor-move hover:scale-125 transition-transform"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
