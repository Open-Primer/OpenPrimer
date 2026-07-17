"use client";

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Layers, Sparkles, Move, Sliders, AlertTriangle, HelpCircle, RefreshCw } from 'lucide-react';
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

export const SankeyDiagram = () => {
  const { language } = useLanguage();
  const isFR = language === 'FR';

  const svgRef = useRef<SVGSVGElement | null>(null);

  // State for components efficiencies (Thermodynamic Loss)
  const [batteryEfficiency, setBatteryEfficiency] = useState<number>(85); // %
  const [inverterEfficiency, setInverterEfficiency] = useState<number>(88); // %

  // State for user-adjustable load demand (Load Balancer)
  const [applianceDemand, setApplianceDemand] = useState<number>(60); // kW
  const [evDemand, setEvDemand] = useState<number>(45); // kW

  // State for renewable solar/wind generation levels
  const [solarGeneration, setSolarGeneration] = useState<number>(80); // kW
  const [windGeneration, setWindGeneration] = useState<number>(40); // kW

  // SVG Dimension mappings
  const width = 640;
  const height = 380;
  const nodeWidth = 24;

  const columnX = [45, width / 2, width - 45]; // X coordinates for Column 0, 1, 2

  // Dynamically resolve all flows and thermal losses based on conservation of energy (1st law)
  const resolvedSystem = useMemo(() => {
    // 1. Calculate source flows
    const solar = solarGeneration;
    const wind = windGeneration;

    // Total solar/wind power split:
    // - 60% of solar goes directly to battery, 40% directly to inverter
    const solarToBattery = solar * 0.6;
    const solarToInverter = solar * 0.4;
    // - 70% of wind goes to battery, 30% to inverter
    const windToBattery = wind * 0.7;
    const windToInverter = wind * 0.3;

    // Total power input to battery
    const batteryInRaw = solarToBattery + windToBattery;
    
    // Battery dissipation loss (1st law)
    const batteryLoss = batteryInRaw * (1 - batteryEfficiency / 100);
    const batteryPowerOut = batteryInRaw * (batteryEfficiency / 100);

    // Total raw power input to Inverter
    const inverterInRaw = solarToInverter + windToInverter + batteryPowerOut;

    // Inverter dissipation loss
    const inverterLoss = inverterInRaw * (1 - inverterEfficiency / 100);
    const inverterPowerOut = inverterInRaw * (inverterEfficiency / 100);

    // Total energy demand
    const totalDestinationDemand = applianceDemand + evDemand + 30; // HVAC is constant 30kW
    
    // Grid Balancer: If inverter output is less than demand, import the difference.
    // If output exceeds demand, export the remainder.
    let gridImport = 0;
    let gridExport = 0;
    const powerDeficitOrSurplus = inverterPowerOut - totalDestinationDemand;

    if (powerDeficitOrSurplus < 0) {
      gridImport = Math.abs(powerDeficitOrSurplus);
    } else {
      gridExport = powerDeficitOrSurplus;
    }

    // Accumulate total system losses
    const totalThermalLosses = batteryLoss + inverterLoss;

    // Return solved links weight and node states
    return {
      metrics: {
        solar,
        wind,
        gridImport,
        gridExport,
        batteryInRaw,
        batteryLoss,
        batteryPowerOut,
        inverterInRaw,
        inverterLoss,
        inverterPowerOut,
        applianceDemand,
        evDemand,
        totalThermalLosses,
        isOverloaded: inverterInRaw > 100 // Safe physical limit 100 kW
      },
      nodes: [
        // Column 0: Sources
        { id: 'solar', labelFR: 'Solaire ☀️', labelEN: 'Solar ☀️', color: '#fbbf24', column: 0, yRatio: 0.15 },
        { id: 'grid_in', labelFR: 'Import Réseau 🔌', labelEN: 'Grid Import 🔌', color: '#60a5fa', column: 0, yRatio: 0.50 },
        { id: 'wind', labelFR: 'Éolien 💨', labelEN: 'Wind 💨', color: '#34d399', column: 0, yRatio: 0.85 },

        // Column 1: Intermediaries
        { id: 'battery', labelFR: 'Batteries 🔋', labelEN: 'Battery 🔋', color: '#10b981', column: 1, yRatio: 0.35 },
        { id: 'inverter', labelFR: 'Onduleur ⚡', labelEN: 'Inverter ⚡', color: '#a78bfa', column: 1, yRatio: 0.70 },

        // Column 2: Destinations
        { id: 'appliances', labelFR: 'Appareils 🖥️', labelEN: 'Appliances 🖥️', color: '#fb7185', column: 2, yRatio: 0.15 },
        { id: 'hvac', labelFR: 'Chauffage 🌡️', labelEN: 'HVAC 🌡️', color: '#f472b6', column: 2, yRatio: 0.42 },
        { id: 'ev', labelFR: 'Véhicule 🚗', labelEN: 'EV Charger 🚗', color: '#2dd4bf', column: 2, yRatio: 0.70 },
        { id: 'grid_out', labelFR: 'Export Réseau 📤', labelEN: 'Grid Export 📤', color: '#fb923c', column: 2, yRatio: 0.95 },

        // Top right Thermal Sink node (Dissipation)
        { id: 'thermal_losses', labelFR: 'Pertes (Chaleur) ♨️', labelEN: 'Thermal Losses ♨️', color: '#f43f5e', column: 2, yRatio: 0.02 }
      ],
      links: [
        // Solar distribution
        { source: 'solar', target: 'battery', value: solarToBattery },
        { source: 'solar', target: 'inverter', value: solarToInverter },

        // Grid Input to inverter (if needed)
        { source: 'grid_in', target: 'inverter', value: gridImport },

        // Wind distribution
        { source: 'wind', target: 'battery', value: windToBattery },
        { source: 'wind', target: 'inverter', value: windToInverter },

        // Battery outputs
        { source: 'battery', target: 'inverter', value: batteryPowerOut },
        { source: 'battery', target: 'thermal_losses', value: batteryLoss }, // Thermodynamic Joule Heat

        // Inverter outputs
        { source: 'inverter', target: 'appliances', value: applianceDemand },
        { source: 'inverter', target: 'hvac', value: 30 }, // constant HVAC
        { source: 'inverter', target: 'ev', value: evDemand },
        { source: 'inverter', target: 'grid_out', value: gridExport },
        { source: 'inverter', target: 'thermal_losses', value: inverterLoss } // Inverter heating loss
      ]
    };
  }, [solarGeneration, windGeneration, batteryEfficiency, inverterEfficiency, applianceDemand, evDemand]);

  // Compute scale heights and layouts over the resolved system
  const compiledNodesMap = useMemo(() => {
    const map: Record<string, { node: SankeyNode; inSum: number; outSum: number; x: number; y: number; height: number }> = {};
    
    // First initialize coordinates
    resolvedSystem.nodes.forEach(n => {
      map[n.id] = {
        node: n,
        inSum: 0,
        outSum: 0,
        x: columnX[n.column] - nodeWidth / 2,
        y: n.yRatio * (height - 90) + 40, // spread vertically
        height: 0
      };
    });

    // Compute input/output flow weights
    resolvedSystem.links.forEach(l => {
      if (map[l.source]) map[l.source].outSum += l.value;
      if (map[l.target]) map[l.target].inSum += l.value;
    });

    // Determine actual node block height proportional to max flow weight (scaled down for neat packing)
    resolvedSystem.nodes.forEach(n => {
      const flowWeight = Math.max(map[n.id].inSum, map[n.id].outSum, 10);
      map[n.id].height = Math.max(10, flowWeight * 1.35); // scale height multiplier
    });

    return map;
  }, [resolvedSystem, columnX]);

  // Compute curved path trajectories with stacks to avoid overlapping
  const linkPaths = useMemo(() => {
    const sourceOffsets: Record<string, number> = {};
    const targetOffsets: Record<string, number> = {};

    return resolvedSystem.links.map((l) => {
      const srcNode = compiledNodesMap[l.source];
      const tgtNode = compiledNodesMap[l.target];

      if (!srcNode || !tgtNode || l.value <= 0.1) return null;

      // Current stacked offset
      const sYOffset = sourceOffsets[l.source] || 0;
      const tYOffset = targetOffsets[l.target] || 0;

      const pathHeight = l.value * 1.35; // matching scale

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
        pathData,
        isThermal: l.target === 'thermal_losses'
      };
    }).filter(Boolean);
  }, [resolvedSystem, compiledNodesMap, isFR]);

  // Reset to initial states
  const handleResetSystem = () => {
    setBatteryEfficiency(85);
    setInverterEfficiency(88);
    setApplianceDemand(60);
    setEvDemand(45);
    setSolarGeneration(80);
    setWindGeneration(40);
  };

  return (
    <div className="my-8 rounded-[40px] border border-slate-800 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -left-16 -top-16 w-36 h-36 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span>{isFR ? "Laboratoire Thermodynamique & Réseau Élec" : "Thermodynamic Loss & Load Grid Lab"}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {isFR 
              ? "Étudiez le premier principe de la thermodynamique (conservation d'énergie) : déterminez les pertes thermiques d'effet Joule et équilibrez la charge du réseau."
              : "Explore the first law of thermodynamics (conservation of energy): simulate component heat dissipation losses and perform grid load balancing."}
          </p>
        </div>

        {/* Reset button */}
        <button 
          onClick={handleResetSystem}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-300 cursor-pointer hover:bg-slate-700 hover:text-white flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3 h-3" />
          <span>{isFR ? "Réinitialiser" : "Reset Lab"}</span>
        </button>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Dynamic Sankey SVG Graph */}
        <div className="lg:col-span-8 flex justify-center items-center">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#020617] p-2 w-full max-w-[640px]">
            
            {/* Visual Overload Warning Overlay badge */}
            <AnimatePresence>
              {resolvedSystem.metrics.isOverloaded && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-4 left-4 right-4 bg-rose-950/90 border border-rose-500/50 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 z-30 shadow-lg shadow-rose-950/50 text-xs"
                >
                  <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce shrink-0" />
                  <div className="text-rose-200">
                    <span className="font-black uppercase tracking-wider text-[10px] block text-rose-400">
                      {isFR ? "Alerte : Surchage Thermique de l'Onduleur" : "Warning: Inverter Thermal Overload"}
                    </span>
                    <span className="text-[10.5px]">
                      {isFR 
                        ? `Le flux total de ${resolvedSystem.metrics.inverterInRaw.toFixed(1)} kW dépasse la capacité physique de 100 kW de l'onduleur !`
                        : `Total flux of ${resolvedSystem.metrics.inverterInRaw.toFixed(1)} kW exceeds the inverter's safe physical capacity limit of 100 kW!`}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${width} ${height}`}
              ref={svgRef}
              className="block"
            >
              {/* Render Flow Connections */}
              {linkPaths.map((p) => {
                if (!p) return null;
                
                // Color path gradient or distinct red for heat loss dissipation
                const pathColor = p.isThermal 
                  ? 'rgba(239, 68, 68, 0.4)' // Heat loss flow (Red)
                  : `rgba(99, 102, 241, 0.25)`; // Power flows (Indigo translucent)

                return (
                  <g key={p.id}>
                    <path
                      d={p.pathData}
                      fill="none"
                      stroke={pathColor}
                      strokeWidth={p.thickness}
                      className="transition-all hover:stroke-indigo-400/55 duration-200"
                    />
                    {/* Tiny glowing flow arrows indicating path direction */}
                    {!p.isThermal && (
                      <path
                        d={p.pathData}
                        fill="none"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1"
                        strokeDasharray="4, 18"
                        className="animate-flow-dash"
                        style={{
                          animation: 'dash 1.2s linear infinite'
                        }}
                      />
                    )}
                  </g>
                );
              })}

              {/* Render Node blocks */}
              {resolvedSystem.nodes.map((n) => {
                const nodeMetric = compiledNodesMap[n.id];
                if (!nodeMetric) return null;

                const isOverloadedNode = n.id === 'inverter' && resolvedSystem.metrics.isOverloaded;

                return (
                  <g key={n.id}>
                    {/* Node rectangle with pulsate animation on overloaded component */}
                    <rect
                      x={nodeMetric.x}
                      y={nodeMetric.y}
                      width={nodeWidth}
                      height={nodeMetric.height}
                      fill={isOverloadedNode ? '#ef4444' : n.color}
                      rx="3.5"
                      className={`stroke-slate-950 stroke-2 transition-all ${
                        isOverloadedNode ? 'animate-pulse' : ''
                      }`}
                    />

                    {/* Node Label tags */}
                    <text
                      x={n.column === 0 ? nodeMetric.x - 8 : n.column === 2 ? nodeMetric.x + nodeWidth + 8 : nodeMetric.x + nodeWidth / 2}
                      y={nodeMetric.y + nodeMetric.height / 2 + 3.5}
                      textAnchor={n.column === 0 ? 'end' : n.column === 2 ? 'start' : 'middle'}
                      fill="#e2e8f0"
                      fontSize="9.5"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {isFR ? n.labelFR : n.labelEN}
                    </text>

                    {/* Numeric Value tag overlay */}
                    <text
                      x={n.column === 0 ? nodeMetric.x - 8 : n.column === 2 ? nodeMetric.x + nodeWidth + 8 : nodeMetric.x + nodeWidth / 2}
                      y={nodeMetric.y + nodeMetric.height / 2 + 13.5}
                      textAnchor={n.column === 0 ? 'end' : n.column === 2 ? 'start' : 'middle'}
                      fill="rgba(148, 163, 184, 0.85)"
                      fontSize="8"
                      fontFamily="monospace"
                      className="pointer-events-none"
                    >
                      {(() => {
                        const totalFlow = Math.max(nodeMetric.inSum, nodeMetric.outSum);
                        return `${totalFlow.toFixed(1)} kW`;
                      })()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Parameters side columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Component Thermodynamic Efficiencies Sliders */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-rose-400" />
              <span>{isFR ? "Rendement Thermique (η)" : "Thermodynamic Efficiencies"}</span>
            </h4>

            {/* Battery Efficiency Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>Rendement Batteries (η)</span>
                <span className="font-mono text-emerald-300">{batteryEfficiency}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="100" 
                step="1"
                value={batteryEfficiency} 
                onChange={(e) => setBatteryEfficiency(parseInt(e.target.value))} 
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
              />
            </div>

            {/* Inverter Efficiency Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>Rendement Onduleur (η)</span>
                <span className="font-mono text-purple-300">{inverterEfficiency}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="100" 
                step="1"
                value={inverterEfficiency} 
                onChange={(e) => setInverterEfficiency(parseInt(e.target.value))} 
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" 
              />
            </div>
          </div>

          {/* Load Balancer Sliders */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>{isFR ? "Régulation des Charges" : "Grid Load Balance"}</span>
            </h4>

            {/* Appliance demand */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>Demande Appareils</span>
                <span className="font-mono text-teal-300">{applianceDemand} kW</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                value={applianceDemand} 
                onChange={(e) => setApplianceDemand(parseInt(e.target.value))} 
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500" 
              />
            </div>

            {/* EV Charger demand */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>Charge Voiture Élec</span>
                <span className="font-mono text-cyan-300">{evDemand} kW</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                value={evDemand} 
                onChange={(e) => setEvDemand(parseInt(e.target.value))} 
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
              />
            </div>
          </div>

          {/* Renewable Generation Levels */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>{isFR ? "Génération Renouvelable" : "Renewable Generation"}</span>
            </h4>

            {/* Solar slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>Génération Solaire</span>
                <span className="font-mono text-yellow-300">{solarGeneration} kW</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="120" 
                step="5"
                value={solarGeneration} 
                onChange={(e) => setSolarGeneration(parseInt(e.target.value))} 
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500" 
              />
            </div>
          </div>

          {/* Theoretical acoustics insight */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 text-center select-text">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>{isFR ? "Analyse Énergétique Quantitative" : "Quantitative Thermodynamics"}</span>
            </span>
            <p className="text-[10.5px] text-slate-400 mt-1.5 leading-relaxed">
              {isFR 
                ? "L'effet Joule convertit l'énergie électrique en pertes thermiques indésirables. Si vous baissez les rendements, les flux de chaleur rouge vif gonflent ! Si la charge dépasse 100 kW, l'onduleur surchauffe."
                : "Joule heating converts electricity into heat losses. Reducing efficiency swells the glowing red waste flows! Overloading the inverter past 100 kW triggers thermal stress warning states."}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
