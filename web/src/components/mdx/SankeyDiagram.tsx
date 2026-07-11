"use client";

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Layers, Sparkles, Move } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SankeyNode {
  id: string;
  labelFR: string;
  labelEN: string;
  color: string;
  column: number; // 0: Source, 1: Intermediary, 2: Destination
  yRatio: number; // custom relative Y position (0 to 1)
}

interface SankeyLink {
  source: string;
  target: string;
  value: number; // flow magnitude
}

const INITIAL_NODES: SankeyNode[] = [
  // Column 0: Sources
  { id: 'solar', labelFR: 'Solaire ☀️', labelEN: 'Solar ☀️', color: '#fbbf24', column: 0, yRatio: 0.15 },
  { id: 'grid_in', labelFR: 'Réseau Élec 🔌', labelEN: 'Grid Import 🔌', color: '#60a5fa', column: 0, yRatio: 0.50 },
  { id: 'wind', labelFR: 'Éolien 💨', labelEN: 'Wind 💨', color: '#34d399', column: 0, yRatio: 0.85 },

  // Column 1: Intermediaries
  { id: 'battery', labelFR: 'Batteries 🔋', labelEN: 'Battery Bank 🔋', color: '#f43f5e', column: 1, yRatio: 0.30 },
  { id: 'inverter', labelFR: 'Onduleur ⚡', labelEN: 'Inverter ⚡', color: '#a78bfa', column: 1, yRatio: 0.70 },

  // Column 2: Destinations
  { id: 'appliances', labelFR: 'Appareils 🖥️', labelEN: 'Appliances 🖥️', color: '#fb7185', column: 2, yRatio: 0.10 },
  { id: 'hvac', labelFR: 'Chauffage 🌡️', labelEN: 'HVAC 🌡️', color: '#f472b6', column: 2, yRatio: 0.40 },
  { id: 'ev', labelFR: 'Véhicule Élec 🚗', labelEN: 'EV Charger 🚗', color: '#2dd4bf', column: 2, yRatio: 0.70 },
  { id: 'grid_out', labelFR: 'Export Réseau 📤', labelEN: 'Grid Export 📤', color: '#fb923c', column: 2, yRatio: 0.95 }
];

const INITIAL_LINKS: SankeyLink[] = [
  { source: 'solar', target: 'battery', value: 70 },
  { source: 'solar', target: 'inverter', value: 50 },
  { source: 'grid_in', target: 'inverter', value: 40 },
  { source: 'wind', target: 'battery', value: 20 },
  { source: 'wind', target: 'inverter', value: 10 },

  { source: 'battery', target: 'appliances', value: 30 },
  { source: 'battery', target: 'hvac', value: 40 },
  { source: 'battery', target: 'ev', value: 20 },

  { source: 'inverter', target: 'appliances', value: 50 },
  { source: 'inverter', target: 'hvac', value: 30 },
  { source: 'inverter', target: 'ev', value: 10 },
  { source: 'inverter', target: 'grid_out', value: 20 }
];

export const SankeyDiagram = () => {
  const { language } = useLanguage();
  const isFR = language === 'FR';

  const [nodes, setNodes] = useState<SankeyNode[]>(INITIAL_NODES);
  const [links] = useState<SankeyLink[]>(INITIAL_LINKS);
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);

  const activeNodeDragRef = useRef<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // SVG Dimension mappings
  const width = 640;
  const height = 360;
  const nodeWidth = 24;

  const columnX = [45, width / 2, width - 45]; // X coordinates for Column 0, 1, 2

  // Compile totals to calculate height scaling
  const compiledNodesMap = useMemo(() => {
    const map: Record<string, { node: SankeyNode; inSum: number; outSum: number; x: number; y: number; height: number }> = {};
    
    // First initialize coordinates
    nodes.forEach(n => {
      map[n.id] = {
        node: n,
        inSum: 0,
        outSum: 0,
        x: columnX[n.column] - nodeWidth / 2,
        y: n.yRatio * (height - 80) + 40, // spread vertically within margins
        height: 0
      };
    });

    // Compute input/output flow weights
    links.forEach(l => {
      if (map[l.source]) map[l.source].outSum += l.value;
      if (map[l.target]) map[l.target].inSum += l.value;
    });

    // Determine actual node block height proportional to max flow weight
    nodes.forEach(n => {
      const flowWeight = Math.max(map[n.id].inSum, map[n.id].outSum, 15); // minimum placeholder height
      map[n.id].height = Math.max(12, flowWeight * 1.5); // scale height
    });

    return map;
  }, [nodes, links]);

  // Compute curved path trajectories
  const linkPaths = useMemo(() => {
    // Keep track of stacking offsets at source and target nodes to avoid path overlapping
    const sourceOffsets: Record<string, number> = {};
    const targetOffsets: Record<string, number> = {};

    return links.map((l) => {
      const srcNode = compiledNodesMap[l.source];
      const tgtNode = compiledNodesMap[l.target];

      if (!srcNode || !tgtNode) return null;

      // Current stacked offset
      const sYOffset = sourceOffsets[l.source] || 0;
      const tYOffset = targetOffsets[l.target] || 0;

      const pathHeight = l.value * 1.5; // matching scale

      // Bezier curve points
      const x0 = srcNode.x + nodeWidth;
      const y0 = srcNode.y + sYOffset + pathHeight / 2;
      const x1 = tgtNode.x;
      const y1 = tgtNode.y + tYOffset + pathHeight / 2;

      // Horizontal Bezier tension
      const cpx1 = x0 + (x1 - x0) * 0.45;
      const cpy1 = y0;
      const cpx2 = x1 - (x1 - x0) * 0.45;
      const cpy2 = y1;

      // Increment offsets for subsequent links on same node
      sourceOffsets[l.source] = sYOffset + pathHeight;
      targetOffsets[l.target] = tYOffset + pathHeight;

      const pathData = `M ${x0} ${y0} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x1} ${y1}`;

      return {
        id: `${l.source}->${l.target}`,
        sourceLabel: isFR ? srcNode.node.labelFR : srcNode.node.labelEN,
        targetLabel: isFR ? tgtNode.node.labelFR : tgtNode.node.labelEN,
        value: l.value,
        colorSrc: srcNode.node.color,
        colorTgt: tgtNode.node.color,
        thickness: pathHeight,
        pathData
      };
    }).filter(Boolean);
  }, [links, compiledNodesMap, isFR]);

  // Drag and drop event handlers
  const handleMouseDown = (nodeId: string) => {
    activeNodeDragRef.current = nodeId;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!activeNodeDragRef.current || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    // Convert pixels to relative Ratio
    const boundsY = height - 80;
    const clampedY = Math.max(0, Math.min(boundsY, mouseY - 40));
    const nextRatio = clampedY / boundsY;

    setNodes((prev) => 
      prev.map((n) => 
        n.id === activeNodeDragRef.current 
          ? { ...n, yRatio: nextRatio } 
          : n
      )
    );
  };

  const handleMouseUpOrLeave = () => {
    activeNodeDragRef.current = null;
  };

  const handleReset = () => {
    setNodes(INITIAL_NODES);
  };

  const hoveredLinkData = linkPaths.find(l => l?.id === hoveredLinkId);

  return (
    <div className="my-8 rounded-[40px] border border-slate-850 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -left-16 -top-16 w-36 h-36 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>{isFR ? 'Diagramme de Sankey Dynamique' : 'Interactive Sankey Flow Diagram'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {isFR 
              ? "Visualisez la distribution d'énergie. Glissez les blocs de haut en bas pour organiser les flux de manière optimale."
              : "Visualize smart eco-home energy distribution. Click and drag the node handles vertically to dynamically reorganize the Bezier flows."}
          </p>
        </div>

        {/* Reset Trigger */}
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>{isFR ? "Réinitialiser" : "Reset Positions"}</span>
        </button>
      </div>

      {/* Vector Sankey Render Workspace */}
      <div className="relative w-full flex flex-col items-center">
        
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Dynamic linear gradients for every flow path link */}
            {linkPaths.map((l) => {
              if (!l) return null;
              return (
                <linearGradient key={`grad-${l.id}`} id={`grad-${l.id}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={l.colorSrc} stopOpacity="0.45" />
                  <stop offset="100%" stopColor={l.colorTgt} stopOpacity="0.45" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Render Flow Links */}
          {linkPaths.map((l) => {
            if (!l) return null;
            const isHovered = hoveredLinkId === l.id;

            return (
              <path
                key={l.id}
                d={l.pathData}
                fill="none"
                stroke={`url(#grad-${l.id})`}
                strokeWidth={l.thickness}
                onMouseEnter={() => setHoveredLinkId(l.id)}
                onMouseLeave={() => setHoveredLinkId(null)}
                className="cursor-pointer transition-all duration-200 hover:opacity-100"
                style={{ 
                  opacity: hoveredLinkId === null ? 0.8 : isHovered ? 1.0 : 0.25,
                  strokeWidth: isHovered ? l.thickness + 2.5 : l.thickness
                }}
              />
            );
          })}

          {/* Render Nodes blocks */}
          {Object.entries(compiledNodesMap).map(([id, info]) => {
            const isTargetedDrag = activeNodeDragRef.current === id;

            return (
              <g 
                key={id}
                onMouseDown={() => handleMouseDown(id)}
                className="cursor-grab active:cursor-grabbing"
              >
                {/* Node Solid block */}
                <rect
                  x={info.x}
                  y={info.y}
                  width={nodeWidth}
                  height={info.height}
                  fill={info.node.color}
                  rx="4"
                  stroke="#ffffff"
                  strokeWidth={isTargetedDrag ? 2 : 0}
                  className="transition-shadow duration-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                />

                {/* Move helper arrow overlay */}
                <g transform={`translate(${info.x + nodeWidth/2 - 5}, ${info.y + info.height/2 - 5})`} className="opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                  <circle cx="5" cy="5" r="7" fill="#000000" fillOpacity="0.5" />
                  <path d="M5 2 L5 8 M3 4 L5 2 L7 4 M3 6 L5 8 L7 6" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                </g>

                {/* Text descriptors */}
                <text
                  x={info.node.column === 2 ? info.x - 8 : info.x + nodeWidth + 8}
                  y={info.y + info.height / 2 + 3.5}
                  fill="#f1f5f9"
                  fontSize="9.5"
                  fontWeight="bold"
                  textAnchor={info.node.column === 2 ? 'end' : 'start'}
                >
                  {isFR ? info.node.labelFR : info.node.labelEN}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live tooltips details overlay */}
        <AnimatePresence>
          {hoveredLinkId !== null && hoveredLinkData && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-4 pointer-events-none bg-slate-950/95 border border-slate-800/80 px-3.5 py-2.5 rounded-xl shadow-xl flex flex-col gap-0.5 z-20"
            >
              <span className="text-[9px] font-black uppercase text-indigo-400">
                {isFR ? "Flux d'énergie" : "Energy Transmission"}
              </span>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                <span>{hoveredLinkData.sourceLabel}</span>
                <span className="text-slate-500">→</span>
                <span>{hoveredLinkData.targetLabel}</span>
              </div>
              <span className="font-mono text-xs font-black text-indigo-300 mt-1">
                {hoveredLinkData.value} kW
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sankey Flow explanation footer info */}
        <div className="mt-4 p-3 bg-slate-900/60 border border-slate-850 rounded-2xl text-center select-none max-w-md">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isFR ? "Principe de Conservation" : "Conservation of Energy"}</span>
          </span>
          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
            {isFR 
              ? "Somme des entrées = Somme des sorties. Observez comment chaque kilowatt produit est conservé à chaque nœud d'onduleur."
              : "Total Inputs = Total Outputs. Observe how energy magnitude is preserved across each battery bank or power inverter node."}
          </p>
        </div>

      </div>
    </div>
  );
};
