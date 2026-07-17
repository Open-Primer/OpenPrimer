"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Sliders, Sparkles, RefreshCw, Layers, Database, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';

interface LoggedMeasurement {
  id: number;
  obstacle: string;
  x: number;
  y: number;
  freq: number;
  waveLen: number;
  amplitude: number;
}

export const WaveInterferenceSim = () => {
  const { language } = useLanguage();

  const localFR: Record<string, string> = {
    "Optics & Young's Double-Slit Lab": "Laboratoire d'Optique & de Fentes de Young",
    "Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.": "Expérimentez la diffraction : insérez une double fente de Young, glissez la sonde verte d'oscilloscope pour mesurer les amplitudes locales et exportez vos mesures.",
    "Free Tank": "Cuve Libre",
    "Fente Simple": "Fente Simple",
    "Fentes de Young": "Fentes de Young",
    "Single Slit": "Fente Simple",
    "Double Slit": "Fentes de Young",
    "Virtual Oscilloscope Probe z(t)": "Sonde Oscilloscope Virtuelle z(t)",
    "Wave Controls": "Paramètres d'onde",
    "Frequency (f)": "Fréquence (f)",
    "Wavelength (λ)": "Longueur d'onde (λ)",
    "Experimental Data Registry": "Journal d'acquisition de données",
    "Clear": "Effacer",
    "No logged values yet": "Aucune donnée enregistrée",
    "Log Amplitude": "Consigner point",
    "Export CSV": "Exporter CSV",
    "Huygens-Fresnel Diffraction": "Interférences & Principe de Huygens",
    "According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.": "Selon Huygens, chaque fente se comporte comme une source d'ondes secondaires cohérentes. Glissez la sonde verte dans les zones sombres pour vérifier l'interférence destructive (amplitude minimale).",
    "Obstacle": "Obstacle",
    "Freq": "Fréq.",
    "Lambda": "λ",
    "Amplitude": "Amp.",
    "Free": "Libre",
    "Slits": "Fentes"
  };

  const t = (key: string) => {
    const globalT = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
    const translated = globalT?.[key];
    if (translated && translated !== key) return translated;
    if (language.toUpperCase() === 'FR' && localFR[key]) return localFR[key];
    return key;
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [frequency, setFrequency] = useState<number>(2.0); // Hz
  const [wavelength, setWavelength] = useState<number>(22); // px
  const [separation, setSeparation] = useState<number>(45); 

  // Physical obstacles: 'free' (two sources), 'single_slit' (single slit), 'double_slit' (Young's double slits)
  const [obstacleMode, setObstacleMode] = useState<'free' | 'single_slit' | 'double_slit'>('free');

  // Coherent point sources (primary)
  const [source1, setSource1] = useState<{ x: number; y: number }>({ x: 45, y: 60 });
  const [source2, setSource2] = useState<{ x: number; y: number }>({ x: 105, y: 60 });

  // Draggable green probe crosshair P(x, y)
  const [probe, setProbe] = useState<{ x: number; y: number }>({ x: 110, y: 60 });

  // Drag state trackers
  const activeDragRef = useRef<'s1' | 's2' | 'probe' | null>(null);

  // Experimental Journal
  const [dataLogs, setDataLogs] = useState<LoggedMeasurement[]>([]);

  // Sync positions when separation parameter changes
  useEffect(() => {
    setSource1({ x: 75 - separation / 2, y: 60 });
    setSource2({ x: 75 + separation / 2, y: 60 });
  }, [separation]);

  // Main wave engine and canvas visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0; // phase time parameter

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);

    const render = () => {
      const data = imgData.data;

      // k = 2 * pi / lambda
      const k = (2 * Math.PI) / wavelength;
      // omega = 2 * pi * f
      const omega = 2 * Math.PI * frequency * 0.04;

      // Middle dividing wall coordinate for single/double slit diffraction (x=75)
      const xObstacle = 75;

      // Loop through space coordinates to solve Huygens-Fresnel wave front sums
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;

          let netHeight = 0;

          // Draw physical partition walls in the pixel grid
          const isAtWall = x === xObstacle;
          let isBlocked = false;

          if (obstacleMode === 'single_slit' && isAtWall) {
            // Slit open area is y between 54 and 66 (width = 12px)
            if (y < 54 || y > 66) isBlocked = true;
          } else if (obstacleMode === 'double_slit' && isAtWall) {
            // Two slits open: y between 40-48 and 72-80
            const inSlit1 = y >= 40 && y <= 48;
            const inSlit2 = y >= 72 && y <= 80;
            if (!inSlit1 && !inSlit2) isBlocked = true;
          }

          if (isBlocked) {
            // Render physical steel gray wall pixel
            data[idx] = 71;     // R
            data[idx + 1] = 85; // G
            data[idx + 2] = 105; // B
            data[idx + 3] = 255;
            continue;
          }

          // Compute mathematical amplitudes based on wave front boundary zone
          if (obstacleMode === 'free' || x < xObstacle) {
            // WAVEFRONT ZONE 1: Normal propagation from primary sources S1 and S2
            const d1 = Math.sqrt((x - source1.x) ** 2 + (y - source1.y) ** 2);
            const d2 = Math.sqrt((x - source2.x) ** 2 + (y - source2.y) ** 2);

            const amp1 = 120 / (d1 * 0.12 + 2);
            const amp2 = 120 / (d2 * 0.12 + 2);

            const h1 = amp1 * Math.cos(k * d1 - t);
            const h2 = amp2 * Math.cos(k * d2 - t);

            netHeight = h1 + h2;

          } else {
            // WAVEFRONT ZONE 2 (x >= 75): Huygens-Fresnel Diffraction propagation
            // Secondary coherent wave front emitters are the slits apertures
            if (obstacleMode === 'single_slit') {
              // Single slit source is at (75, 60)
              const dSlit = Math.sqrt((x - xObstacle) ** 2 + (y - 60) ** 2);
              
              // Calculate amplitude at the slit mouth from the primary source (e.g. S1 at left)
              const dSourceToSlit = Math.sqrt((xObstacle - source1.x) ** 2 + (60 - source1.y) ** 2);
              const ampAtSlit = 110 / (dSourceToSlit * 0.12 + 2);

              // Secondary wave propagation
              const ampOut = (ampAtSlit * 1.5) / (dSlit * 0.12 + 2.5);
              netHeight = ampOut * Math.cos(k * dSlit - t);

            } else if (obstacleMode === 'double_slit') {
              // Double slit sources at (75, 44) and (75, 76)
              const dSlit1 = Math.sqrt((x - xObstacle) ** 2 + (y - 44) ** 2);
              const dSlit2 = Math.sqrt((x - xObstacle) ** 2 + (y - 76) ** 2);

              // Coherent source 1 to slit 1
              const dSourceToSlit1 = Math.sqrt((xObstacle - source1.x) ** 2 + (44 - source1.y) ** 2);
              const ampAtSlit1 = 100 / (dSourceToSlit1 * 0.12 + 2);

              // Coherent source 2 to slit 2
              const dSourceToSlit2 = Math.sqrt((xObstacle - source2.x) ** 2 + (76 - source2.y) ** 2);
              const ampAtSlit2 = 100 / (dSourceToSlit2 * 0.12 + 2);

              const hSlit1 = (ampAtSlit1 * 1.5) / (dSlit1 * 0.12 + 2.5) * Math.cos(k * dSlit1 - t);
              const hSlit2 = (ampAtSlit2 * 1.5) / (dSlit2 * 0.12 + 2.5) * Math.cos(k * dSlit2 - t);

              netHeight = hSlit1 + hSlit2;
            }
          }

          // Map net Height amplitude (-128 to 128) to high-fidelity plasma pixel colors
          let r = 10, g = 15, b = 30;

          if (netHeight >= 0) {
            r = Math.min(255, Math.floor(10 + netHeight * 1.5));
            g = Math.min(255, Math.floor(25 + netHeight * 2.2));
            b = Math.min(255, Math.floor(80 + netHeight * 2.5));
          } else {
            const absH = Math.abs(netHeight);
            r = Math.min(255, Math.floor(10 + absH * 2.5));
            g = Math.min(255, Math.floor(20 + absH * 0.8));
            b = Math.min(255, Math.floor(80 + absH * 1.8));
          }

          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Draw primary sources overlay if cuve is free or left of barrier
      if (obstacleMode === 'free') {
        ctx.fillStyle = '#f43f5e'; // S1 Source (Red)
        ctx.beginPath();
        ctx.arc(source1.x, source1.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#06b6d4'; // S2 Source (Blue)
        ctx.beginPath();
        ctx.arc(source2.x, source2.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // Draw single primary generator source (S1 at left)
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(source1.x, source1.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw active green draggable measurement probe target P(x, y)
      ctx.strokeStyle = '#22c55e'; // Neon Green
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Draw crosshair
      ctx.moveTo(probe.x - 6, probe.y);
      ctx.lineTo(probe.x + 6, probe.y);
      ctx.moveTo(probe.x, probe.y - 6);
      ctx.lineTo(probe.x, probe.y + 6);
      ctx.stroke();

      // Outer target ring
      ctx.beginPath();
      ctx.arc(probe.x, probe.y, 4, 0, Math.PI * 2);
      ctx.stroke();

      if (isPlaying) {
        t += omega;
        if (t > Math.PI * 100) t = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, frequency, wavelength, source1, source2, probe, obstacleMode]);

  // Secondary sub-loop rendering the real-time local Oscilloscope graph
  useEffect(() => {
    const canvas = scopeCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let localPhase = 0;

    const renderScope = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid guidelines
      ctx.strokeStyle = 'rgba(51,65,85,0.2)';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Calculate localized math amplitude at probe coordinate
      const xObstacle = 75;
      let amp = 0;
      const k = (2 * Math.PI) / wavelength;

      if (obstacleMode === 'free' || probe.x < xObstacle) {
        const d1 = Math.sqrt((probe.x - source1.x) ** 2 + (probe.y - source1.y) ** 2);
        const d2 = Math.sqrt((probe.x - source2.x) ** 2 + (probe.y - source2.y) ** 2);
        const amp1 = 120 / (d1 * 0.12 + 2);
        const amp2 = 120 / (d2 * 0.12 + 2);
        
        // Compute maximum constructive peak amplitude bounds
        amp = (amp1 + amp2) * 0.35;
      } else {
        if (obstacleMode === 'single_slit') {
          const dSlit = Math.sqrt((probe.x - xObstacle) ** 2 + (probe.y - 60) ** 2);
          const dSourceToSlit = Math.sqrt((xObstacle - source1.x) ** 2 + (60 - source1.y) ** 2);
          const ampAtSlit = 110 / (dSourceToSlit * 0.12 + 2);
          amp = ((ampAtSlit * 1.5) / (dSlit * 0.12 + 2.5)) * 0.45;
        } else {
          const dSlit1 = Math.sqrt((probe.x - xObstacle) ** 2 + (probe.y - 44) ** 2);
          const dSlit2 = Math.sqrt((probe.x - xObstacle) ** 2 + (probe.y - 76) ** 2);
          const dSourceToSlit1 = Math.sqrt((xObstacle - source1.x) ** 2 + (44 - source1.y) ** 2);
          const dSourceToSlit2 = Math.sqrt((xObstacle - source2.x) ** 2 + (76 - source2.y) ** 2);
          const ampAtSlit1 = 100 / (dSourceToSlit1 * 0.12 + 2);
          const ampAtSlit2 = 100 / (dSourceToSlit2 * 0.12 + 2);

          amp = (((ampAtSlit1 * 1.5) / (dSlit1 * 0.12 + 2.5)) + ((ampAtSlit2 * 1.5) / (dSlit2 * 0.12 + 2.5))) * 0.35;
        }
      }

      // Ensure bounds limit
      const clampedAmp = Math.min(canvas.height / 2 - 4, amp * 12);

      // Draw scrolling sine wave matching wavelength period
      ctx.strokeStyle = '#22c55e'; // Green
      ctx.lineWidth = 1.75;
      ctx.beginPath();

      const steps = canvas.width;
      for (let i = 0; i < steps; i++) {
        const x = i;
        // z = Amp * cos(kx - omega*t)
        const y = canvas.height / 2 + clampedAmp * Math.cos(i * 0.12 - localPhase);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (isPlaying) {
        localPhase += frequency * 0.1;
        if (localPhase > Math.PI * 100) localPhase = 0;
      }

      animId = requestAnimationFrame(renderScope);
    };

    renderScope();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, frequency, wavelength, source1, source2, probe, obstacleMode]);

  // Handle Dragging
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    
    const d1 = Math.sqrt((coords.x - source1.x) ** 2 + (coords.y - source1.y) ** 2);
    const d2 = Math.sqrt((coords.x - source2.x) ** 2 + (coords.y - source2.y) ** 2);
    const dP = Math.sqrt((coords.x - probe.x) ** 2 + (coords.y - probe.y) ** 2);

    if (dP < 12) {
      activeDragRef.current = 'probe';
    } else if (obstacleMode === 'free' && d1 < 10) {
      activeDragRef.current = 's1';
    } else if (obstacleMode === 'free' && d2 < 10) {
      activeDragRef.current = 's2';
    } else if (d1 < 10) {
      activeDragRef.current = 's1'; // single generator draggable
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeDragRef.current) return;
    const coords = getCanvasCoords(e);

    const xClamped = Math.max(5, Math.min(145, coords.x));
    const yClamped = Math.max(5, Math.min(115, coords.y));

    if (activeDragRef.current === 'probe') {
      setProbe({ x: xClamped, y: yClamped });
    } else if (activeDragRef.current === 's1') {
      // S1 generator must stay on the left of dividing wall (x < 75)
      const xGen = Math.min(70, xClamped);
      setSource1({ x: xGen, y: yClamped });
    } else if (activeDragRef.current === 's2') {
      const xGen = Math.min(70, xClamped);
      setSource2({ x: xGen, y: yClamped });
    }
  };

  const handleMouseUpOrLeave = () => {
    activeDragRef.current = null;
  };

  // Log currently measured local amplitude to experimental data database table
  const handleLogMeasurement = () => {
    // Proportional calculation for current probe amplitude
    const xObstacle = 75;
    let amp = 0;
    if (obstacleMode === 'free' || probe.x < xObstacle) {
      const d1 = Math.sqrt((probe.x - source1.x) ** 2 + (probe.y - source1.y) ** 2);
      const d2 = Math.sqrt((probe.x - source2.x) ** 2 + (probe.y - source2.y) ** 2);
      amp = (120 / (d1 * 0.12 + 2)) + (120 / (d2 * 0.12 + 2));
    } else {
      const dSlit = Math.sqrt((probe.x - xObstacle) ** 2 + (probe.y - 60) ** 2);
      amp = (150 / (dSlit * 0.12 + 2.5));
    }

    const newLog: LoggedMeasurement = {
      id: Date.now(),
      obstacle: obstacleMode.toUpperCase(),
      x: Math.round(probe.x),
      y: Math.round(probe.y),
      freq: frequency,
      waveLen: wavelength,
      amplitude: parseFloat((amp * 0.15).toFixed(2))
    };

    setDataLogs((prev) => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    setDataLogs([]);
  };

  // Export current list to standard CSV file format
  const handleExportCSV = () => {
    if (dataLogs.length === 0) return;
    const header = "ID,Obstacle,X,Y,Frequency(Hz),Wavelength(px),Amplitude(V)\n";
    const body = dataLogs.map((log, index) => 
      `${index + 1},${log.obstacle},${log.x},${log.y},${log.freq},${log.waveLen},${log.amplitude}`
    ).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(header + body);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `openprimer_diffraction_experiment_log.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetSources = () => {
    setSeparation(45);
    setSource1({ x: 52.5, y: 60 });
    setSource2({ x: 97.5, y: 60 });
    setProbe({ x: 110, y: 60 });
  };

  return (
    <div className="my-8 rounded-[40px] border border-slate-800 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -left-16 -top-16 w-36 h-36 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Header and Mode switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{t("Optics & Young's Double-Slit Lab")}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t("Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.")}
          </p>
        </div>

        {/* Barriers toggler */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900/40 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setObstacleMode('free'); setProbe({ x: 110, y: 60 }); }}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                obstacleMode === 'free' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              {t("Free Tank")}
            </button>
            <button
              onClick={() => { setObstacleMode('single_slit'); setProbe({ x: 110, y: 60 }); }}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                obstacleMode === 'single_slit' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              {t("Single Slit")}
            </button>
            <button
              onClick={() => { setObstacleMode('double_slit'); setProbe({ x: 110, y: 60 }); }}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                obstacleMode === 'double_slit' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              {t("Double Slit")}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg cursor-pointer ${isPlaying ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-300'}`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={handleResetSources}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
              title="Reset positions"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left simulation screen: pixelated high-performance wave tank */}
        <div className="lg:col-span-7 flex flex-col gap-5 justify-between">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#020617] p-1.5 aspect-[4/3] w-full max-w-[420px] mx-auto">
            <canvas
              ref={canvasRef}
              width={150}
              height={120}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="w-full h-full block cursor-crosshair rounded-2xl"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Local probe oscilloscope sub-panel */}
          <div className="rounded-3xl border border-slate-800 bg-[#020617] p-4 flex flex-col">
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>{t("Virtual Oscilloscope Probe z(t)")}</span>
            </span>
            <div className="w-full h-16 rounded-xl overflow-hidden border border-slate-900">
              <canvas ref={scopeCanvasRef} width={380} height={60} className="w-full h-full block" />
            </div>
          </div>
        </div>

        {/* Right side controls & experimental logger */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Sliders Panel */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{t("Wave Controls")}</span>
            </h4>

            {/* Frequency Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{t("Frequency (f)")}</span>
                <span className="font-mono text-indigo-300">{frequency.toFixed(2)} Hz</span>
              </div>
              <input type="range" min="0.5" max="4.0" step="0.1" value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>

            {/* Wavelength Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{t("Wavelength (λ)")}</span>
                <span className="font-mono text-indigo-300">{wavelength} px</span>
              </div>
              <input type="range" min="10" max="45" value={wavelength} onChange={(e) => setWavelength(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>
          </div>

          {/* Interactive experimental records logger */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-5 flex flex-col flex-1 justify-between gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>{t("Experimental Data Registry")}</span>
                </h4>
                {dataLogs.length > 0 && (
                  <button onClick={handleClearLogs} className="text-[8.5px] font-black text-rose-400 uppercase hover:underline cursor-pointer">
                    {t("Clear")}
                  </button>
                )}
              </div>

              {/* Data Rows display */}
              <div className="max-h-24 overflow-y-auto pr-1 select-text space-y-1.5 text-[10px] font-mono text-slate-400">
                {dataLogs.length === 0 ? (
                  <p className="italic text-slate-500 text-center py-4">{t("No logged values yet")}</p>
                ) : (
                  dataLogs.map((log, idx) => (
                    <div key={log.id} className="flex justify-between bg-slate-950/40 p-1.5 rounded-lg border border-slate-900">
                      <span>#{dataLogs.length - idx} [{t(log.obstacle)}]</span>
                      <span>X:{log.x} Y:{log.y}</span>
                      <span className="text-emerald-400 font-bold">{log.amplitude} V</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Logging actions */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={handleLogMeasurement}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-100 hover:bg-slate-700 transition-colors text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700/50"
              >
                <span>{t("Log Amplitude")}</span>
              </button>
              <button
                disabled={dataLogs.length === 0}
                onClick={handleExportCSV}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border ${
                  dataLogs.length > 0 
                    ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/30' 
                    : 'bg-slate-900/20 border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t("Export CSV")}</span>
              </button>
            </div>
          </div>

          {/* Theoretical physics insight */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 text-center select-text">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t("Huygens-Fresnel Diffraction")}</span>
            </span>
            <p className="text-[10.5px] text-slate-400 mt-1.5 leading-relaxed">
              {t("According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.")}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
