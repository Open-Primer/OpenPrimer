"use client";

import React, { useState, useRef } from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface Geometry2DProps {
  preset: 'triangle' | 'circle' | 'vector';
  title?: string;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

export const Geometry2D = ({ preset, title = "Sandbox de Géométrie 2D", gradeLevel }: Geometry2DProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [points, setPoints] = useState<Record<string, { x: number; y: number }>>(() => {
    if (preset === 'triangle') {
      return {
        A: { x: 200, y: 50 },
        B: { x: 100, y: 220 },
        C: { x: 300, y: 220 },
      } as Record<string, { x: number; y: number }>;
    } else if (preset === 'circle') {
      return {
        P: { x: 280, y: 150 }
      } as Record<string, { x: number; y: number }>;
    } else {
      return {
        O: { x: 200, y: 150 },
        V: { x: 280, y: 80 }
      } as Record<string, { x: number; y: number }>;
    }
  });

  const [draggedPoint, setDraggedPoint] = useState<string | null>(null);

  const handlePointerDown = (key: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as any).setPointerCapture(e.pointerId);
    setDraggedPoint(key);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedPoint || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * 400;
    const svgY = ((e.clientY - rect.top) / rect.height) * 300;

    let finalX = Math.max(10, Math.min(390, svgX));
    let finalY = Math.max(10, Math.min(290, svgY));

    if (preset === 'circle') {
      const dx = finalX - 200;
      const dy = finalY - 150;
      const angle = Math.atan2(dy, dx);
      finalX = 200 + Math.cos(angle) * 80;
      finalY = 150 + Math.sin(angle) * 80;
    }

    setPoints(prev => ({
      ...prev,
      [draggedPoint]: { x: finalX, y: finalY }
    }));
  };

  const handlePointerUp = () => {
    setDraggedPoint(null);
  };

  const getMetrics = () => {
    if (preset === 'triangle') {
      const { A, B, C } = points;
      const ab = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
      const bc = Math.sqrt((C.x - B.x) ** 2 + (C.y - B.y) ** 2);
      const ca = Math.sqrt((A.x - C.x) ** 2 + (A.y - C.y) ** 2);
      const perimeter = ab + bc + ca;
      const area = Math.abs(A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) / 2;
      return {
        ab: (ab / 20).toFixed(1),
        bc: (bc / 25).toFixed(1),
        ca: (ca / 20).toFixed(1),
        perimeter: (perimeter / 20).toFixed(1),
        area: (area / 400).toFixed(1),
      };
    } else if (preset === 'circle') {
      const { P } = points;
      const dx = (P.x - 200) / 80;
      const dy = -(P.y - 150) / 80;
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = ((angleRad >= 0 ? angleRad : 2 * Math.PI + angleRad) * 180 / Math.PI).toFixed(0);
      return {
        cos: dx.toFixed(2),
        sin: dy.toFixed(2),
        angleDeg,
      };
    } else {
      const { O, V } = points;
      const dx = (V.x - O.x) / 20;
      const dy = -(V.y - O.y) / 20;
      const magnitude = Math.sqrt(dx ** 2 + dy ** 2);
      return {
        dx: dx.toFixed(1),
        dy: dy.toFixed(1),
        magnitude: magnitude.toFixed(1),
      };
    }
  };

  const metrics = getMetrics();

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950/30 backdrop-blur-xl p-5 shadow-lg select-none">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Compass className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-350">
          {title}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-center">
        <div className="relative w-full max-w-[400px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
          <svg
            ref={svgRef}
            viewBox="0 0 400 300"
            className="w-full h-auto"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <g className="opacity-10" stroke="#94a3b8" strokeWidth="0.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`v-${i}`} x1={(i + 1) * 40} y1="0" x2={(i + 1) * 40} y2="300" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={(i + 1) * 40} x2="400" y2={(i + 1) * 40} />
              ))}
            </g>

            {preset === 'triangle' && (
              <>
                <polygon
                  points={`${points.A.x},${points.A.y} ${points.B.x},${points.B.y} ${points.C.x},${points.C.y}`}
                  fill="rgba(59, 130, 246, 0.1)"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />
                {['A', 'B', 'C'].map((k) => (
                  <g key={k}>
                    <circle
                      cx={points[k].x}
                      cy={points[k].y}
                      r={draggedPoint === k ? "9" : "7"}
                      fill={draggedPoint === k ? "#f59e0b" : "#60a5fa"}
                      stroke="#1e293b"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-150"
                      onPointerDown={handlePointerDown(k)}
                    />
                    <text x={points[k].x} y={points[k].y - 12} fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">{k}</text>
                  </g>
                ))}
              </>
            )}

            {preset === 'circle' && (
              <>
                <line x1="40" y1="150" x2="360" y2="150" stroke="#475569" strokeWidth="1" />
                <line x1="200" y1="40" x2="200" y2="260" stroke="#475569" strokeWidth="1" />
                <circle cx="200" cy="150" r="80" fill="none" stroke="#6366f1" strokeWidth="2" />
                <line x1={points.P.x} y1="150" x2={points.P.x} y2={points.P.y} stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="200" y1={points.P.y} x2={points.P.x} y2={points.P.y} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="200" y1="150" x2={points.P.x} y2={points.P.y} stroke="#c084fc" strokeWidth="2.5" />
                <circle
                  cx={points.P.x}
                  cy={points.P.y}
                  r="7"
                  fill="#c084fc"
                  stroke="#1e293b"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onPointerDown={handlePointerDown('P')}
                />
                <text x={points.P.x} y={points.P.y - 12} fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">P</text>
              </>
            )}

            {preset === 'vector' && (
              <>
                <line x1="200" y1="20" x2="200" y2="280" stroke="#334155" strokeWidth="1" />
                <line x1="20" y1="150" x2="380" y2="150" stroke="#334155" strokeWidth="1" />
                <line x1={points.O.x} y1={points.O.y} x2={points.V.x} y2={points.V.y} stroke="#f43f5e" strokeWidth="3" />
                <circle
                  cx={points.O.x}
                  cy={points.O.y}
                  r="6"
                  fill="#94a3b8"
                  stroke="#1e293b"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onPointerDown={handlePointerDown('O')}
                />
                <circle
                  cx={points.V.x}
                  cy={points.V.y}
                  r="8"
                  fill="#f43f5e"
                  stroke="#1e293b"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onPointerDown={handlePointerDown('V')}
                />
                <text x={points.V.x} y={points.V.y - 12} fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">V</text>
              </>
            )}
          </svg>
        </div>

        <div className="flex-1 w-full bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col justify-center gap-3">
          <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1 select-none">
            <Sparkles className="w-3.5 h-3.5" />
            Mesures en temps réel
          </span>

          <div className="space-y-2.5 text-xs text-slate-350">
            {preset === 'triangle' && (
              <>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Côté AB :</span>
                  <span className="font-mono font-bold text-slate-100">{metrics.ab} cm</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Côté BC :</span>
                  <span className="font-mono font-bold text-slate-100">{metrics.bc} cm</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Côté CA :</span>
                  <span className="font-mono font-bold text-slate-100">{metrics.ca} cm</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1 font-bold text-blue-400">
                  <span>Périmètre :</span>
                  <span className="font-mono">{metrics.perimeter} cm</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400">
                  <span>Aire :</span>
                  <span className="font-mono">{metrics.area} cm²</span>
                </div>
              </>
            )}

            {preset === 'circle' && (
              <>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Angle θ :</span>
                  <span className="font-mono font-bold text-slate-100">{metrics.angleDeg}°</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1 text-emerald-400 font-bold">
                  <span>Cosinus (X) :</span>
                  <span className="font-mono">{metrics.cos}</span>
                </div>
                <div className="flex justify-between text-rose-400 font-bold">
                  <span>Sinus (Y) :</span>
                  <span className="font-mono">{metrics.sin}</span>
                </div>
              </>
            )}

            {preset === 'vector' && (
              <>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Composante X :</span>
                  <span className="font-mono font-bold text-slate-100">{metrics.dx}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Composante Y :</span>
                  <span className="font-mono font-bold text-slate-100">{metrics.dy}</span>
                </div>
                <div className="flex justify-between text-rose-400 font-bold">
                  <span>Norme ||V|| :</span>
                  <span className="font-mono">{metrics.magnitude}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
