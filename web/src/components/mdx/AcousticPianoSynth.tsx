"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Music, Radio, Sliders, Play, Volume2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

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
  const isFR = language === 'FR';

  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [activeNote, setActiveNote] = useState<string | null>(null);

  // ADSR Envelopes state
  const [attack, setAttack] = useState<number>(0.1); // seconds
  const [decay, setDecay] = useState<number>(0.2); // seconds
  const [sustain, setSustain] = useState<number>(0.6); // multiplier 0-1
  const [release, setRelease] = useState<number>(0.8); // seconds

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeOscillatorsRef = useRef<Record<string, { osc: OscillatorNode; gain: GainNode }>>({});

  // Initialize Audio Context on demand (safeguard for browser autoplays)
  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(ctx.destination);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;

    // Start oscilloscope render loop
    startOscilloscope();
  };

  // Oscilloscope Canvas drawing loop
  const startOscilloscope = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      // Clean canvas with a dark cyber grid gradient
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw horizontal reference guide
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Plot acoustic waveform curves
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#6366f1'; // Premium Indigo curve
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow
    };

    draw();
  };

  // Synthesize and play target sound frequency
  const playNote = (key: PianoKey) => {
    initAudio();
    const ctx = audioCtxRef.current;
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    // Resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop note if already playing to prevent stacking
    stopNote(key.note);

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(key.freq, ctx.currentTime);

    // Map ADSR Amplitude Envelope Node
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    
    // Attack phase: linear ramp from 0 to maximum volume
    gainNode.gain.linearRampToValueAtTime(0.35, now + attack);
    
    // Decay phase: exponential decay down to Sustain level
    gainNode.gain.exponentialRampToValueAtTime(0.35 * sustain, now + attack + decay);

    // Connect node pipeline: Oscillator -> ADSR Gain -> Analyser (Scope)
    osc.connect(gainNode);
    gainNode.connect(analyser);

    osc.start();
    setActiveNote(key.note);

    activeOscillatorsRef.current[key.note] = { osc, gain: gainNode };
  };

  // Release Phase triggered when mouse releases or key releases
  const stopNote = (note: string) => {
    const ctx = audioCtxRef.current;
    const active = activeOscillatorsRef.current[note];
    if (!ctx || !active) return;

    const now = ctx.currentTime;
    const gainNode = active.gain;
    const osc = active.osc;

    // Schedule the release ramp
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + release);

    osc.stop(now + release);

    delete activeOscillatorsRef.current[note];
    setActiveNote(null);
  };

  return (
    <div className="my-8 rounded-[40px] border border-slate-850 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>{isFR ? 'Clavier de Synthétiseur ADSR' : 'Interactive ADSR Piano Synthesizer'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {isFR 
              ? "Jouez des notes pour observer les ondes sonores en temps réel sur l'oscilloscope et réglez l'enveloppe temporelle (ADSR)."
              : "Play notes to analyze the physical acoustic wave patterns on the live oscilloscope while adjusting the ADSR amplitude envelope."}
          </p>
        </div>

        {/* Waves Form selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/40 border border-slate-850 p-1.5 rounded-2xl">
          {(['sine', 'triangle', 'square', 'sawtooth'] as OscillatorType[]).map((type) => (
            <button
              key={type}
              onClick={() => setWaveType(type)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold capitalize transition-all duration-300 cursor-pointer ${
                waveType === type 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main interface split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* White and Black Interactive Piano Keyboard Keys representation */}
        <div className="lg:col-span-8 flex flex-col justify-end">
          <div className="relative rounded-3xl overflow-hidden border border-slate-850/80 bg-slate-900/20 p-4 w-full">
            <div className="flex relative select-none" style={{ minHeight: '190px' }}>
              
              {/* White Piano keys render */}
              {PIANO_KEYS_DB.filter(k => !k.isBlack).map((key, idx) => {
                const isSelected = activeNote === key.note;
                return (
                  <button
                    key={key.note}
                    onMouseDown={() => playNote(key)}
                    onMouseUp={() => stopNote(key.note)}
                    onMouseLeave={() => stopNote(key.note)}
                    onTouchStart={() => playNote(key)}
                    onTouchEnd={() => stopNote(key.note)}
                    className={`flex-1 rounded-b-xl border border-slate-800 bg-gradient-to-b from-white to-slate-200 relative transition-all duration-150 cursor-pointer ${
                      isSelected 
                        ? 'translate-y-1.5 shadow-inner from-indigo-500 to-indigo-600' 
                        : 'hover:to-slate-100 shadow-md active:translate-y-1.5'
                    }`}
                    style={{ minHeight: '180px' }}
                  >
                    <span className={`absolute bottom-3 left-0 right-0 text-[10px] font-black text-center ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                      {key.note}
                    </span>
                  </button>
                );
              })}

              {/* Floating Black Piano keys render overlay */}
              <div className="absolute top-0 left-0 right-0 pointer-events-none flex" style={{ height: '110px' }}>
                {PIANO_KEYS_DB.map((key, idx) => {
                  if (!key.isBlack) return null;

                  // Find previous white key index to offset black keys correctly
                  const whiteKeysBefore = PIANO_KEYS_DB.slice(0, idx).filter(k => !k.isBlack).length;
                  const leftPercent = (whiteKeysBefore / 12) * 100 - 3.5; // (white_keys_count/total_white)*100 - adjustment

                  const isSelected = activeNote === key.note;

                  return (
                    <button
                      key={key.note}
                      onMouseDown={() => playNote(key)}
                      onMouseUp={() => stopNote(key.note)}
                      onMouseLeave={() => stopNote(key.note)}
                      onTouchStart={() => playNote(key)}
                      onTouchEnd={() => stopNote(key.note)}
                      className={`absolute w-7 rounded-b-lg bg-gradient-to-b from-slate-950 to-slate-800 border border-slate-900 transition-all duration-150 cursor-pointer pointer-events-auto shadow-lg z-20 ${
                        isSelected 
                          ? 'h-[104px] from-indigo-600 to-indigo-700 shadow-inner' 
                          : 'h-[110px] hover:from-slate-900 active:h-[104px]'
                      }`}
                      style={{ left: `${leftPercent}%` }}
                    >
                      <span className="absolute bottom-2 left-0 right-0 text-[8px] font-black text-center text-slate-400">
                        {key.note}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        {/* Right side: Oscilloscope Canvas & ADSR dials */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Real-time Oscilloscope */}
          <div className="rounded-3xl border border-slate-850 bg-slate-900/40 p-5 flex flex-col items-center">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-3.5 self-start">
              <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>{isFR ? "Aperçu Oscilloscope" : "Oscilloscope Waveform"}</span>
            </h4>
            <div className="w-full h-28 rounded-2xl overflow-hidden border border-slate-800 bg-[#020617]">
              <canvas 
                ref={canvasRef} 
                width={300} 
                height={110} 
                className="w-full h-full block"
              />
            </div>
          </div>

          {/* ADSR Sliders Panel */}
          <div className="rounded-3xl border border-slate-850 bg-slate-900/40 p-5 flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>{isFR ? "Modulateurs d'Amplitude ADSR" : "ADSR Amplitude Envelope"}</span>
            </h4>

            {/* Attack Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{isFR ? 'Attaque (A)' : 'Attack (A)'}</span>
                <span className="font-mono text-indigo-300">{attack.toFixed(2)}s</span>
              </div>
              <input 
                type="range" 
                min="0.01" 
                max="1.5" 
                step="0.05"
                value={attack}
                onChange={(e) => setAttack(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Decay Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{isFR ? 'Décroissance (D)' : 'Decay (D)'}</span>
                <span className="font-mono text-indigo-300">{decay.toFixed(2)}s</span>
              </div>
              <input 
                type="range" 
                min="0.05" 
                max="1.8" 
                step="0.05"
                value={decay}
                onChange={(e) => setDecay(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Sustain Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{isFR ? 'Maintien (S)' : 'Sustain (S)'}</span>
                <span className="font-mono text-indigo-300">{Math.round(sustain * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.05"
                value={sustain}
                onChange={(e) => setSustain(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Release Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{isFR ? 'Relâchement (R)' : 'Release (R)'}</span>
                <span className="font-mono text-indigo-300">{release.toFixed(2)}s</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="2.5" 
                step="0.05"
                value={release}
                onChange={(e) => setRelease(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
