"use client";

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import { Layers, Sliders, Globe, AlertTriangle, Thermometer, Compass, Droplets, CheckCircle } from 'lucide-react';


interface MapRegion {
  id: string;
  nameFR: string;
  nameEN: string;
  latitude: number;
  longitude: number;
  elevation: number; // in meters
  baseTemp: number; // Celsius
  basePrecip: number; // mm / year
  polygons: string; // SVG coordinates
  // Projected 2050 delta per scenario [RCP2.6, RCP4.5, RCP8.5]
  tempDelta: [number, number, number];
  precipDelta: [number, number, number]; // percent change
  ecologyFR: string;
  ecologyEN: string;
}

const REGIONS_DATABASE: MapRegion[] = [
  {
    id: "na",
    nameFR: "Amérique du Nord",
    nameEN: "North America",
    latitude: 45.0,
    longitude: -100.0,
    elevation: 850,
    baseTemp: 11.5,
    basePrecip: 750,
    polygons: "110,95 240,95 270,180 190,225 125,170",
    tempDelta: [1.2, 2.4, 4.2],
    precipDelta: [-5, -12, -22],
    ecologyFR: "Diminution importante du manteau neigeux de l'Ouest, pénuries d'eau critiques dans le Sud-Ouest et feux de forêt de grande intensité.",
    ecologyEN: "Significant Western snowpack decline, critical water shortages in the Southwest, and high-intensity forest megafires."
  },
  {
    id: "sa",
    nameFR: "Amérique du Sud",
    nameEN: "South America",
    latitude: -15.0,
    longitude: -60.0,
    elevation: 550,
    baseTemp: 21.8,
    basePrecip: 1650,
    polygons: "220,230 300,230 340,335 290,410 230,320",
    tempDelta: [1.1, 2.1, 3.8],
    precipDelta: [-10, -18, -35],
    ecologyFR: "Risque élevé de savannisation de la forêt amazonienne et perte de la biodiversité d'altitude par fonte des glaciers andins.",
    ecologyEN: "High risk of Amazon forest savannization and massive loss of alpine biodiversity due to Andean glacier retreat."
  },
  {
    id: "eu",
    nameFR: "Europe",
    nameEN: "Europe",
    latitude: 50.0,
    longitude: 15.0,
    elevation: 340,
    baseTemp: 9.2,
    basePrecip: 680,
    polygons: "350,90 460,90 470,165 400,185 360,145",
    tempDelta: [1.4, 2.8, 4.6],
    precipDelta: [4, -8, -18],
    ecologyFR: "Sécheresses sévères en zone méditerranéenne contrastant avec des crues fluviales catastrophiques en Europe du Nord et de l'Est.",
    ecologyEN: "Severe droughts in the Mediterranean contrasted with catastrophic river flooding in Northern and Eastern Europe."
  },
  {
    id: "af",
    nameFR: "Afrique",
    nameEN: "Africa",
    latitude: 2.0,
    longitude: 20.0,
    elevation: 620,
    baseTemp: 25.4,
    basePrecip: 900,
    polygons: "360,195 440,190 490,260 440,400 390,320 340,240",
    tempDelta: [1.3, 2.6, 4.5],
    precipDelta: [-12, -22, -42],
    ecologyFR: "Expansion accélérée de la désertification du Sahel, insécurité de l'agriculture pluviale et stress hydrique extrême pour 60% des populations.",
    ecologyEN: "Accelerated desertification of the Sahel, rain-fed crop failure, and extreme water stress affecting over 60% of regional communities."
  },
  {
    id: "as",
    nameFR: "Asie",
    nameEN: "Asia",
    latitude: 35.0,
    longitude: 95.0,
    elevation: 920,
    baseTemp: 12.8,
    basePrecip: 1100,
    polygons: "475,90 690,90 695,240 595,280 470,185",
    tempDelta: [1.5, 3.0, 5.2],
    precipDelta: [15, 25, 45],
    ecologyFR: "Fonte critique des glaciers de l'Himalaya perturbant l'alimentation des fleuves et submersion des deltas rizicoles par des moussons violentes.",
    ecologyEN: "Himalayan glacier retreat disrupting major river basins, alongside delta submersion due to erratic, high-intensity monsoons."
  },
  {
    id: "oc",
    nameFR: "Océanie",
    nameEN: "Oceania",
    latitude: -25.0,
    longitude: 135.0,
    elevation: 310,
    baseTemp: 21.0,
    basePrecip: 550,
    polygons: "605,290 710,290 715,390 610,390 580,310",
    tempDelta: [1.0, 2.0, 3.5],
    precipDelta: [-8, -15, -28],
    ecologyFR: "Destruction thermique irréversible de la Grande Barrière de Corail, méga-feux d'eucalyptus et submersion des îles coralliennes du Pacifique.",
    ecologyEN: "Irreversible bleaching of the Great Barrier Reef, massive eucalyptus bushfires, and rising sea-level submersion of low-lying Pacific islands."
  }
];

export const ClimateImpactMap = () => {
  const { language } = useLanguage();
  const t = (key: string) => {
    const dict = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
    return dict[key] || key;
  };

  // active selected region
  const [selectedId, setSelectedRegion] = useState<string>("eu");

  // Carbon scenario index: 0 = RCP 2.6 (Paris), 1 = RCP 4.5 (Moderate), 2 = RCP 8.5 (Business As Usual)
  const [scenarioIdx, setScenarioIndex] = useState<number>(1); 

  // active cartographic layer: 'temp' | 'precip' | 'vulnerability'
  const [activeLayer, setActiveLayer] = useState<'temp' | 'precip' | 'vulnerability'>('temp');

  const activeRegion = useMemo(() => {
    return REGIONS_DATABASE.find(r => r.id === selectedId) || REGIONS_DATABASE[0];
  }, [selectedId]);

  // Derived calculations based on selected Carbon Scenario
  const computedMetrics = useMemo(() => {
    const tRise = activeRegion.tempDelta[scenarioIdx];
    const precipShift = activeRegion.precipDelta[scenarioIdx];
    const finalTemp = activeRegion.baseTemp + tRise;
    const finalPrecip = activeRegion.basePrecip * (1 + precipShift / 100);

    return {
      tRise,
      precipShift,
      finalTemp,
      finalPrecip
    };
  }, [activeRegion, scenarioIdx]);

  return (
    <div className="my-8 rounded-[40px] border border-slate-850 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Lab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-indigo-400 animate-spin-slow" />
            <span>{t("climate_map_title")}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t("climate_map_subtitle")}
          </p>
        </div>

        {/* Layer Selectors */}
        <div className="flex items-center gap-1 bg-slate-900/40 border border-slate-850 p-1 rounded-xl">
          <button
            onClick={() => setActiveLayer('temp')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayer === 'temp' ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 border border-transparent'
            }`}
          >
            <Thermometer className="w-3 h-3 text-rose-400" />
            <span>{t("climate_map_temp_anomalies")}</span>
          </button>
          <button
            onClick={() => setActiveLayer('precip')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayer === 'precip' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 border border-transparent'
            }`}
          >
            <Droplets className="w-3 h-3 text-blue-400" />
            <span>{t("climate_map_rainfall_shifts")}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Interactive SVG GIS Map Canvas */}
        <div className="lg:col-span-7 bg-slate-950/60 rounded-3xl p-4 border border-slate-850 relative overflow-hidden">
          
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[9px] font-mono text-slate-400 flex items-center gap-1.5 z-20">
            <Compass className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>WGS 84 Mercator Projection Grid</span>
          </div>

          <svg 
            viewBox="0 0 800 450" 
            className="w-full h-auto select-none"
            style={{ filter: "drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.2))" }}
          >
            {/* Latitude & Longitude Orthogonal Grid lines */}
            <g stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1" strokeDasharray="3,3">
              <line x1="0" y1="75" x2="800" y2="75" />
              <line x1="0" y1="150" x2="800" y2="150" />
              <line x1="0" y1="225" x2="800" y2="225" /> {/* Equator */}
              <line x1="0" y1="300" x2="800" y2="300" />
              <line x1="0" y1="375" x2="800" y2="375" />
              
              <line x1="100" y1="0" x2="100" y2="450" />
              <line x1="200" y1="0" x2="200" y2="450" />
              <line x1="300" y1="0" x2="300" y2="450" />
              <line x1="400" y1="0" x2="400" y2="450" /> {/* Prime Meridian */}
              <line x1="500" y1="0" x2="500" y2="450" />
              <line x1="600" y1="0" x2="600" y2="450" />
              <line x1="700" y1="0" x2="700" y2="450" />
            </g>

            {/* Render Continents and Heatmap Layer Colorings */}
            {REGIONS_DATABASE.map((region) => {
              const isSelected = region.id === selectedId;
              
              // Resolve visual heat color based on active layer and carbon scenario indexes
              let fillGradient = 'rgba(148, 163, 184, 0.08)'; // normal
              if (activeLayer === 'temp') {
                const rise = region.tempDelta[scenarioIdx];
                if (rise > 4.5) fillGradient = 'rgba(239, 68, 68, 0.35)'; // Red critical heat
                else if (rise > 3.0) fillGradient = 'rgba(249, 115, 22, 0.28)'; // Orange
                else if (rise > 2.0) fillGradient = 'rgba(234, 179, 8, 0.20)'; // Yellow
                else fillGradient = 'rgba(16, 185, 129, 0.15)'; // Emerald mild
              } else if (activeLayer === 'precip') {
                const shift = region.precipDelta[scenarioIdx];
                if (shift < -30) fillGradient = 'rgba(120, 113, 108, 0.35)'; // Dry desert brown
                else if (shift < -15) fillGradient = 'rgba(217, 119, 6, 0.25)'; // Dry orange
                else if (shift > 20) fillGradient = 'rgba(59, 130, 246, 0.3)'; // Severe wet blue
                else fillGradient = 'rgba(96, 165, 250, 0.15)'; // Moderate wet
              }

              return (
                <polygon 
                  key={region.id}
                  points={region.polygons} 
                  fill={fillGradient}
                  stroke={isSelected ? '#6366f1' : 'rgba(148, 163, 184, 0.2)'}
                  strokeWidth={isSelected ? '2.5' : '1'}
                  className="transition-all duration-300 cursor-pointer hover:fill-indigo-500/20"
                  onClick={() => setSelectedRegion(region.id)}
                />
              );
            })}

            {/* Drag-to-Measure pin crosshair overlay on active region center point */}
            {activeRegion && (
              <g 
                className="pointer-events-none transition-all duration-500"
                transform={`translate(${
                  activeRegion.id === 'na' ? 175 :
                  activeRegion.id === 'sa' ? 275 :
                  activeRegion.id === 'eu' ? 415 :
                  activeRegion.id === 'af' ? 410 :
                  activeRegion.id === 'as' ? 575 : 640
                }, ${
                  activeRegion.id === 'na' ? 140 :
                  activeRegion.id === 'sa' ? 310 :
                  activeRegion.id === 'eu' ? 130 :
                  activeRegion.id === 'af' ? 270 :
                  activeRegion.id === 'as' ? 150 : 330
                })`}
              >
                {/* Pulse waves */}
                <circle r="22" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.3" className="animate-ping" style={{ animationDuration: '3s' }} />
                {/* Coordinate crosshair lines */}
                <line x1="-15" y1="0" x2="15" y2="0" stroke="#6366f1" strokeWidth="1.5" />
                <line x1="0" y1="-15" x2="0" y2="15" stroke="#6366f1" strokeWidth="1.5" />
                {/* Center dot pin */}
                <circle r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
              </g>
            )}

            {/* Continent Labels */}
            {REGIONS_DATABASE.map((region) => {
              const xX = region.id === 'na' ? 175 : region.id === 'sa' ? 275 : region.id === 'eu' ? 415 : region.id === 'af' ? 410 : region.id === 'as' ? 575 : 640;
              const yY = region.id === 'na' ? 140 : region.id === 'sa' ? 310 : region.id === 'eu' ? 130 : region.id === 'af' ? 270 : region.id === 'as' ? 150 : 330;
              return (
                <text
                  key={region.id}
                  x={xX}
                  y={yY - 26}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="bold"
                  className="pointer-events-none drop-shadow-md bg-slate-950/80 px-1"
                >
                  {t("climate_map_" + region.id + "_name")}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Right Side: Parameters Controls & Climate Metric Output */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Carbon Emission Scenario Pathway selection slider */}
          <div className="rounded-3xl border border-slate-850 bg-slate-900/40 p-5 flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>{t("climate_map_scenario_label")}</span>
            </h4>

            {/* Slider with steps: RCP 2.6 (0), RCP 4.5 (1), RCP 8.5 (2) */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span className="text-slate-500 font-mono text-[9px]">{t("climate_map_scenario_desc")}</span>
              </div>
              
              <input 
                type="range" 
                min="0" 
                max="2" 
                step="1"
                value={scenarioIdx} 
                onChange={(e) => setScenarioIndex(parseInt(e.target.value))} 
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
              />
              
              <div className="flex justify-between text-[10px] font-black font-mono pt-1.5">
                <span className={scenarioIdx === 0 ? 'text-emerald-400' : 'text-slate-600'}>RCP 2.6</span>
                <span className={scenarioIdx === 1 ? 'text-yellow-400' : 'text-slate-600'}>RCP 4.5</span>
                <span className={scenarioIdx === 2 ? 'text-rose-400 animate-pulse' : 'text-slate-600'}>RCP 8.5</span>
              </div>
            </div>
          </div>

          {/* Telemetry output for Sonde pin readings */}
          <div className="rounded-3xl border border-slate-850 bg-slate-900/40 p-5 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-2 mb-4">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>{t("climate_map_probe_stats")}</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 mb-5">
                
                {/* Longitude / Latitude */}
                <div className="bg-slate-950/40 border border-slate-850/80 p-3 rounded-2xl">
                  <span className="text-[8px] text-slate-500 font-black uppercase block">{t("climate_map_coordinates")}</span>
                  <span className="font-mono text-xs font-bold text-slate-200 mt-1 block">
                    {Math.abs(activeRegion.latitude).toFixed(1)}°{activeRegion.latitude >= 0 ? 'N' : 'S'}, {Math.abs(activeRegion.longitude).toFixed(1)}°{activeRegion.longitude >= 0 ? 'E' : 'W'}
                  </span>
                </div>

                {/* Elevation */}
                <div className="bg-slate-950/40 border border-slate-850/80 p-3 rounded-2xl">
                  <span className="text-[8px] text-slate-500 font-black uppercase block">{t("climate_map_elevation")}</span>
                  <span className="font-mono text-xs font-bold text-indigo-300 mt-1 block">
                    {activeRegion.elevation} m
                  </span>
                </div>

                {/* Base climate Temperature -> Projected Temperature */}
                <div className="bg-slate-950/40 border border-slate-850/80 p-3 rounded-2xl col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] text-slate-500 font-black uppercase block">{t("climate_map_mean_temp")}</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="font-mono text-slate-400 text-xs">{activeRegion.baseTemp.toFixed(1)}°C</span>
                      <span className="text-slate-600 text-xs">➔</span>
                      <span className={`font-mono text-base font-black ${
                        scenarioIdx === 0 ? 'text-emerald-300' : scenarioIdx === 1 ? 'text-yellow-300' : 'text-rose-400'
                      }`}>
                        {computedMetrics.finalTemp.toFixed(1)}°C
                      </span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1.5 rounded-lg font-mono text-[10px] font-black ${
                    scenarioIdx === 0 ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/20' :
                    scenarioIdx === 1 ? 'bg-yellow-950/30 text-yellow-300 border border-yellow-500/20' :
                    'bg-rose-950/40 text-rose-400 border border-rose-500/30 animate-pulse'
                  }`}>
                    +{computedMetrics.tRise.toFixed(1)}°C
                  </div>
                </div>

                {/* Precipitation shift */}
                <div className="bg-slate-950/40 border border-slate-850/80 p-3 rounded-2xl col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] text-slate-500 font-black uppercase block">{t("climate_map_annual_precip")}</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="font-mono text-slate-400 text-xs">{activeRegion.basePrecip.toFixed(0)} mm</span>
                      <span className="text-slate-600 text-xs">➔</span>
                      <span className="font-mono text-sm font-black text-blue-300">
                        {computedMetrics.finalPrecip.toFixed(0)} mm
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-md font-mono text-[9px] font-bold ${
                    computedMetrics.precipShift < 0 ? 'bg-amber-950/40 text-amber-400' : 'bg-blue-950/40 text-blue-400'
                  }`}>
                    {computedMetrics.precipShift > 0 ? '+' : ''}{computedMetrics.precipShift.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Bio-Ecological impacts panel details */}
              <div className="rounded-2xl border border-slate-850 bg-slate-950/40 p-4 relative overflow-hidden">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                    scenarioIdx === 2 ? 'text-rose-400 animate-bounce' : 'text-amber-400'
                  }`} />
                  <div>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block leading-none mb-1">
                      {t("climate_map_alert_title")}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                      {t("climate_map_" + activeRegion.id + "_ecology")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification marker bottom */}
            <div className="border-t border-slate-850/50 pt-4 mt-4 flex items-center gap-3 bg-slate-950/20 p-3 rounded-xl">
              <CheckCircle className="w-4 h-4 text-indigo-400" />
              <div className="text-[9.5px]">
                <span className="font-bold text-slate-200 block leading-tight">IPCC AR6 Calibration</span>
                <span className="text-slate-500 font-mono text-[8px]">Models synced with CMIP6 scenario pathways</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
