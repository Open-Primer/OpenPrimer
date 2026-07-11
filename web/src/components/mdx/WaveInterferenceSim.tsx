"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Sliders, Sparkles, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const WaveInterferenceSim = () => {
  const { language } = useLanguage();
  const isFR = language === 'FR';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [frequency, setFrequency] = useState<number>(2.0); // Hz
  const [wavelength, setWavelength] = useState<number>(22); // px
  const [separation, setSeparation] = useState<number>(45); // distance between sources (px)

  // Point sources relative positions from center
  const [source1, setSource1] = useState<{ x: number; y: number }>({ x: 45, y: 60 });
  const [source2, setSource2] = useState<{ x: number; y: number }>({ x: 105, y: 60 });

  const isDraggingRef = useRef<'s1' | 's2' | null>(null);

  // Sync positions when separation parameter changes
  useEffect(() => {
    setSource1({ x: 75 - separation / 2, y: 60 });
    setSource2({ x: 75 + separation / 2, y: 60 });
  }, [separation]);

  // Wave rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0; // time parameter

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);

    const render = () => {
      const data = imgData.data;

      // k = 2 * pi / lambda
      const k = (2 * Math.PI) / wavelength;
      // omega = 2 * pi * f
      const omega = 2 * Math.PI * frequency * 0.04;

      // Loop through every pixel to calculate wave height sum
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;

          // Distance to sources
          const d1 = Math.sqrt((x - source1.x) ** 2 + (y - source1.y) ** 2);
          const d2 = Math.sqrt((x - source2.x) ** 2 + (y - source2.y) ** 2);

          // Wave equation: amplitude fading with distance (damping)
          const amp1 = 120 / (d1 * 0.12 + 2);
          const amp2 = 120 / (d2 * 0.12 + 2);

          const h1 = amp1 * Math.cos(k * d1 - t);
          const h2 = amp2 * Math.cos(k * d2 - t);

          // Net interference wave amplitude sum
          const netHeight = h1 + h2;

          // Map amplitude value (-128 to 128) to distinct color layers
          // Constructive peaks: neon blue, constructive troughs: indigo/cyan, destructive: dark navy
          let r = 10, g = 15, b = 30; // Ambient base dark

          if (netHeight >= 0) {
            // Positive peaks -> glowing cyan/teal
            r = Math.min(255, Math.floor(10 + netHeight * 1.5));
            g = Math.min(255, Math.floor(25 + netHeight * 2.2));
            b = Math.min(255, Math.floor(80 + netHeight * 2.5));
          } else {
            // Negative troughs -> glowing purple/pink
            const absH = Math.abs(netHeight);
            r = Math.min(255, Math.floor(10 + absH * 2.5));
            g = Math.min(255, Math.floor(20 + absH * 0.8));
            b = Math.min(255, Math.floor(80 + absH * 1.8));
          }

          data[idx] = r;     // Red
          data[idx + 1] = g; // Green
          data[idx + 2] = b; // Blue
          data[idx + 3] = 255; // Alpha
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Draw source handles overlay on top
      ctx.fillStyle = '#f43f5e'; // Red circle for Source 1
      ctx.beginPath();
      ctx.arc(source1.x, source1.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#06b6d4'; // Blue circle for Source 2
      ctx.beginPath();
      ctx.arc(source2.x, source2.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (isPlaying) {
        t += omega;
        if (t > Math.PI * 100) t = 0; // Prevent float overflow
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, frequency, wavelength, source1, source2]);

  // Handle Dragging of wave sources
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
    
    // Check hit radius
    const d1 = Math.sqrt((coords.x - source1.x) ** 2 + (coords.y - source1.y) ** 2);
    const d2 = Math.sqrt((coords.x - source2.x) ** 2 + (coords.y - source2.y) ** 2);

    if (d1 < 10) {
      isDraggingRef.current = 's1';
    } else if (d2 < 10) {
      isDraggingRef.current = 's2';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const coords = getCanvasCoords(e);

    // Keep sources within tank boundary limits
    const xClamped = Math.max(5, Math.min(145, coords.x));
    const yClamped = Math.max(5, Math.min(115, coords.y));

    if (isDraggingRef.current === 's1') {
      setSource1({ x: xClamped, y: yClamped });
    } else {
      setSource2({ x: xClamped, y: yClamped });
    }
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = null;
  };

  const handleResetSources = () => {
    setSeparation(45);
    setSource1({ x: 52.5, y: 60 });
    setSource2({ x: 97.5, y: 60 });
  };

  return (
    <div className="my-8 rounded-[40px] border border-slate-850 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -left-16 -top-16 w-36 h-36 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Header and description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{isFR ? "Cuve à Ondes & Interférences" : "Wave Interference Simulator"}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {isFR 
              ? "Observez les franges d'interférences de deux ondes circulaires cohérentes. Glissez les sources rouges/bleues sur l'écran pour modifier la figure d'onde."
              : "Observe interference fringes generated by two coherent circular waves. Drag the red and blue sources on screen to alter the wave geometries."}
          </p>
        </div>

        {/* Play/Pause switch */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all duration-300 ${
              isPlaying ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? (isFR ? "Pause" : "Pause") : (isFR ? "Animer" : "Simulate")}</span>
          </button>
          <button 
            onClick={handleResetSources}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
            title="Reset positions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left simulation screen: pixelated high-performance wave tank */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950 p-1 w-full max-w-[400px] aspect-[4/3]">
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
        </div>

        {/* Right side controls panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-850 bg-slate-900/40 p-6 flex flex-col gap-5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{isFR ? "Paramètres d'onde" : "Wave Parameters"}</span>
            </h4>

            {/* Frequency Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>{isFR ? "Fréquence (f)" : "Frequency (f)"}</span>
                <span className="font-mono text-indigo-300">{frequency.toFixed(2)} Hz</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="4.0" 
                step="0.1"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Wavelength Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>{isFR ? "Longueur d'onde (λ)" : "Wavelength (λ)"}</span>
                <span className="font-mono text-indigo-300">{wavelength} px</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="45" 
                value={wavelength}
                onChange={(e) => setWavelength(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Separation Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>{isFR ? "Séparation des sources" : "Source Separation"}</span>
                <span className="font-mono text-indigo-300">{separation} px</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="110" 
                value={separation}
                onChange={(e) => setSeparation(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Theoretical physics overlay banner */}
          <div className="rounded-3xl border border-slate-850 bg-slate-900/40 p-4 text-center select-none">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isFR ? "Franges d'Interférences" : "Constructive vs Destructive"}</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
              {isFR 
                ? "Franges lumineuses (peaks) : différence de marche δ = nλ.\nFranges sombres (destructive nodes) : δ = (n + 0.5)λ."
                : "Bright bands occur where wave peaks line up (δ = nλ). Destructive nodes emerge where peaks overlap troughs (δ = (n + 0.5)λ)."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
