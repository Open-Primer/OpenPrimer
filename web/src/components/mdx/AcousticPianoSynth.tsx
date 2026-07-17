"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Music, Radio, Sliders, Volume2, Sparkles, Layout, Eye } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';


interface PianoKey {
  note: string;
  freq: number;
  isBlack: boolean;
}

const PIANO_KEYS_DB: PianoKey[] = [
  { note: 'C4', freq: 261.63, isBlack: false },
  { note: 'C#4', freq: 277.18, isBlack: true },
  { note: 'D4', freq: 293.66, isBlack: false },
  { note: 'D#4', freq: 311.13, isBlack: true },
  { note: 'E4', freq: 329.63, isBlack: false },
  { note: 'F4', freq: 349.23, isBlack: false },
  { note: 'F#4', freq: 369.99, isBlack: true },
  { note: 'G4', freq: 392.00, isBlack: false },
  { note: 'G#4', freq: 415.30, isBlack: true },
  { note: 'A4', freq: 440.00, isBlack: false },
  { note: 'A#4', freq: 466.16, isBlack: true },
  { note: 'B4', freq: 493.88, isBlack: false },
  { note: 'C5', freq: 523.25, isBlack: false },
  { note: 'C#5', freq: 554.37, isBlack: true },
  { note: 'D5', freq: 587.33, isBlack: false },
  { note: 'D#5', freq: 622.25, isBlack: true },
  { note: 'E5', freq: 659.25, isBlack: false },
  { note: 'F5', freq: 698.46, isBlack: false },
  { note: 'F#5', freq: 739.99, isBlack: true },
  { note: 'G5', freq: 783.99, isBlack: false }
];

export const AcousticPianoSynth = () => {
  const { language } = useLanguage();
  const t = (key: string) => {
    const dict = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
    return dict[key] || key;
  };

  const isFR = language.toUpperCase() === 'FR';

  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [visualMode, setVisualMode] = useState<'oscilloscope' | 'spectrogram'>('spectrogram');

  // ADSR Envelopes
  const [attack, setAttack] = useState<number>(0.1); 
  const [decay, setDecay] = useState<number>(0.2); 
  const [sustain, setSustain] = useState<number>(0.6); 
  const [release, setRelease] = useState<number>(0.8); 

  // Fourier Harmonics Sliders: Fundamental, H2, H3, H4, H5
  const [h1, setH1] = useState<number>(1.0); // Fundamental
  const [h2, setH2] = useState<number>(0.0); 
  const [h3, setH3] = useState<number>(0.0); 
  const [h4, setH4] = useState<number>(0.0); 
  const [h5, setH5] = useState<number>(0.0); 

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Ref for active oscillators (each note can play up to 5 oscillators for additive overtones)
  const activeOscillatorsRef = useRef<Record<string, { oscNodes: OscillatorNode[]; gainNodes: GainNode[]; masterGain: GainNode }>>({});
  
  // Waterfall spectrogram buffer history
  const waterfallBufferRef = useRef<Uint8Array[]>([]);
  const maxWaterfallRows = 70;

  // Initialize Web Audio
  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const analyser = ctx.createAnalyser();
    
    // 512 size gives solid resolution for low frequencies
    analyser.fftSize = 512;
    analyser.connect(ctx.destination);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;

    // Start rendering canvas
    startVisualizationLoop();
  };

  // Live render loop combining Oscilloscope and scrolling 2D FFT spectrogram
  const startVisualizationLoop = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const timeDomainData = new Uint8Array(bufferLength);
    const frequencyData = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      if (visualMode === 'oscilloscope') {
        // OSCILLOSCOPE TIME-DOMAIN VIEW
        analyser.getByteTimeDomainData(timeDomainData);

        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, width, height);

        // Grid lines
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#6366f1'; // Glowing Indigo
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeDomainData[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

      } else {
        // FFT WATERFALL SPECTROGRAM VIEW
        analyser.getByteFrequencyData(frequencyData);

        // Store active frame into circular buffer history (scrolling down)
        const frame = new Uint8Array(frequencyData.slice(0, bufferLength / 1.5)); // Zoom low-mid frequencies
        waterfallBufferRef.current.unshift(frame);
        if (waterfallBufferRef.current.length > maxWaterfallRows) {
          waterfallBufferRef.current.pop();
        }

        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, width, height);

        const rows = waterfallBufferRef.current.length;
        if (rows === 0) return;

        const rowHeight = height / maxWaterfallRows;
        const cols = frame.length;
        const colWidth = width / cols;

        // Render rolling heat-map rows
        for (let r = 0; r < rows; r++) {
          const rowData = waterfallBufferRef.current[r];
          const y = r * rowHeight;

          for (let c = 0; r < rows && c < cols; c++) {
            const val = rowData[c];
            if (val === 0) continue;

            const x = c * colWidth;

            // Heat-map palette index calculation: Dark violet -> Indigo -> Neon Pink -> Yellow-White
            let fillCol = `rgba(15, 23, 42, 0)`;
            if (val > 15) {
              const rCol = Math.min(255, Math.floor(val * 1.1));
              const gCol = Math.min(255, Math.floor(val * 0.2 + (val > 150 ? (val - 150) * 1.5 : 0)));
              const bCol = Math.min(255, Math.floor(120 + val * 0.5));
              fillCol = `rgb(${rCol}, ${gCol}, ${bCol})`;
            }

            ctx.fillStyle = fillCol;
            ctx.fillRect(x, y, colWidth + 0.5, rowHeight + 0.5);
          }
        }

        // Draw scale tags
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '7px monospace';
        ctx.fillText('0 Hz', 4, height - 6);
        ctx.fillText('1000 Hz', width / 2 - 20, height - 6);
        ctx.fillText('2000 Hz', width - 40, height - 6);
      }
    };

    draw();
  };

  // Play Note implementing Fourier additive overtones (H1-H5 sliders)
  const playNote = (key: PianoKey) => {
    initAudio();
    const ctx = audioCtxRef.current;
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop note if playing
    stopNote(key.note);

    const now = ctx.currentTime;
    
    // Master Gain for ADSR
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.35, now + attack);
    masterGain.gain.exponentialRampToValueAtTime(0.35 * sustain, now + attack + decay);

    masterGain.connect(analyser);

    const oscNodes: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];

    // Define harmonics overtones list [Fundamental, H2, H3, H4, H5]
    const harmonics = [
      { multiplier: 1, weight: h1 },
      { multiplier: 2, weight: h2 },
      { multiplier: 3, weight: h3 },
      { multiplier: 4, weight: h4 },
      { multiplier: 5, weight: h5 }
    ];

    harmonics.forEach(({ multiplier, weight }) => {
      if (weight <= 0.01) return; // Skip zero overtones

      const osc = ctx.createOscillator();
      const overtoneGain = ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(key.freq * multiplier, now);

      // Map proportional overtone weight
      overtoneGain.gain.setValueAtTime(weight, now);

      osc.connect(overtoneGain);
      overtoneGain.connect(masterGain);

      osc.start();

      oscNodes.push(osc);
      gainNodes.push(overtoneGain);
    });

    setActiveNote(key.note);
    activeOscillatorsRef.current[key.note] = { oscNodes, gainNodes, masterGain };
  };

  const stopNote = (note: string) => {
    const ctx = audioCtxRef.current;
    const active = activeOscillatorsRef.current[note];
    if (!ctx || !active) return;

    const now = ctx.currentTime;
    const masterGain = active.masterGain;

    // Trigger ADSR Release phase
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + release);

    // Stop all additive oscillators scheduled after release
    active.oscNodes.forEach((osc) => {
      osc.stop(now + release);
    });

    delete activeOscillatorsRef.current[note];
    setActiveNote(null);
  };

  return (
    <div className="my-8 rounded-[40px] border border-slate-800 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>{t("piano_fourier_title")}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t("piano_fourier_desc")}
          </p>
        </div>

        {/* Action Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Visual Mode selector */}
          <div className="flex items-center gap-1 bg-slate-900/40 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setVisualMode('oscilloscope')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                visualMode === 'oscilloscope' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Oscilloscope
            </button>
            <button
              onClick={() => setVisualMode('spectrogram')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                visualMode === 'spectrogram' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              {isFR ? 'Spectrographe FFT' : 'FFT Spectrograph'}
            </button>
          </div>

          {/* Wave Types */}
          <div className="flex items-center gap-1 bg-slate-900/40 border border-slate-800 p-1 rounded-xl">
            {(['sine', 'triangle', 'sawtooth'] as OscillatorType[]).map((type) => (
              <button
                key={type}
                onClick={() => setWaveType(type)}
                className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black capitalize cursor-pointer ${
                  waveType === type ? 'bg-slate-800 text-indigo-300' : 'text-slate-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Octaves Board */}
        <div className="xl:col-span-8 flex flex-col justify-between gap-6">
          
          {/* Interactive Keyboard */}
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/10 p-5">
            <div className="flex relative select-none" style={{ minHeight: '190px' }}>
              
              {/* White keys */}
              {PIANO_KEYS_DB.filter(k => !k.isBlack).map((key) => {
                const isSelected = activeNote === key.note;
                return (
                  <button
                    key={key.note}
                    onMouseDown={() => playNote(key)}
                    onMouseUp={() => stopNote(key.note)}
                    onMouseLeave={() => stopNote(key.note)}
                    onTouchStart={() => playNote(key)}
                    onTouchEnd={() => stopNote(key.note)}
                    className={`flex-1 rounded-b-xl border border-slate-800 bg-gradient-to-b from-white to-slate-200 relative transition-all cursor-pointer ${
                      isSelected ? 'translate-y-1 shadow-inner from-indigo-500 to-indigo-600' : 'shadow-md active:translate-y-1'
                    }`}
                    style={{ minHeight: '180px' }}
                  >
                    <span className={`absolute bottom-3 left-0 right-0 text-[9px] font-black text-center ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                      {key.note}
                    </span>
                  </button>
                );
              })}

              {/* Black keys */}
              <div className="absolute top-0 left-0 right-0 pointer-events-none flex" style={{ height: '110px' }}>
                {PIANO_KEYS_DB.map((key, idx) => {
                  if (!key.isBlack) return null;

                  const whiteKeysBefore = PIANO_KEYS_DB.slice(0, idx).filter(k => !k.isBlack).length;
                  const leftPercent = (whiteKeysBefore / 12) * 100 - 3.5;
                  const isSelected = activeNote === key.note;

                  return (
                    <button
                      key={key.note}
                      onMouseDown={() => playNote(key)}
                      onMouseUp={() => stopNote(key.note)}
                      onMouseLeave={() => stopNote(key.note)}
                      onTouchStart={() => playNote(key)}
                      onTouchEnd={() => stopNote(key.note)}
                      className={`absolute w-7 rounded-b-lg bg-gradient-to-b from-slate-950 to-slate-800 border border-slate-900 transition-all cursor-pointer pointer-events-auto shadow-lg z-20 ${
                        isSelected ? 'h-[104px] from-indigo-600 to-indigo-700' : 'h-[110px] active:h-[104px]'
                      }`}
                      style={{ left: `${leftPercent}%` }}
                    >
                      <span className="absolute bottom-2 left-0 right-0 text-[8px] font-bold text-center text-slate-400">
                        {key.note}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Interactive Spectrogram / Oscilloscope screen rendering */}
          <div className="rounded-3xl border border-slate-800 bg-[#020617] p-4 flex flex-col items-center">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-400 self-start mb-2.5 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>
                {visualMode === 'oscilloscope' 
                  ? (isFR ? 'Oscilloscope (Amplitude Temporelle)' : 'Oscilloscope (Time-Domain)') 
                  : (isFR ? 'Spectrogramme FFT Cascade (Fréquence over Time)' : 'Waterfall FFT Spectrogram (Frequency over Time)')}
              </span>
            </h4>
            <div className="w-full h-36 rounded-2xl overflow-hidden border border-slate-900">
              <canvas ref={canvasRef} width={500} height={140} className="w-full h-full block" />
            </div>
          </div>

        </div>

        {/* Right Sliders Panel */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Fourier Mixer overtones */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>{t("piano_fourier_mixer")}</span>
            </h4>

            {/* H1 slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Fondamentale (1f₀)</span>
                <span className="font-mono text-indigo-300">{Math.round(h1 * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={h1} onChange={(e) => setH1(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>

            {/* H2 slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Harmonique 2 (2f₀)</span>
                <span className="font-mono text-indigo-300">{Math.round(h2 * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={h2} onChange={(e) => setH2(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>

            {/* H3 slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Harmonique 3 (3f₀)</span>
                <span className="font-mono text-indigo-300">{Math.round(h3 * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={h3} onChange={(e) => setH3(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>

            {/* H4 slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Harmonique 4 (4f₀)</span>
                <span className="font-mono text-indigo-300">{Math.round(h4 * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={h4} onChange={(e) => setH4(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>

            {/* H5 slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Harmonique 5 (5f₀)</span>
                <span className="font-mono text-indigo-300">{Math.round(h5 * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={h5} onChange={(e) => setH5(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>
          </div>

          {/* ADSR Envelope Modulator */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>{t("piano_fourier_adsr")}</span>
            </h4>

            {/* Attack Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{isFR ? 'Attaque (A)' : 'Attack (A)'}</span>
                <span className="font-mono text-indigo-300">{attack.toFixed(2)}s</span>
              </div>
              <input type="range" min="0.01" max="1.0" step="0.05" value={attack} onChange={(e) => setAttack(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>

            {/* Release Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{isFR ? 'Relâchement (R)' : 'Release (R)'}</span>
                <span className="font-mono text-indigo-300">{release.toFixed(2)}s</span>
              </div>
              <input type="range" min="0.1" max="2.0" step="0.05" value={release} onChange={(e) => setRelease(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>
          </div>

          {/* Theoretical acoustics insight */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 text-center select-text">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t("piano_fourier_insight_title")}</span>
            </span>
            <p className="text-[10.5px] text-slate-400 mt-1.5 leading-relaxed">
              {t("piano_fourier_insight_desc")}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
