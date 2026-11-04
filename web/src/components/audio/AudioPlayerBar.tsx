"use client";

import React from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Settings, ChevronRight, MessageSquare } from 'lucide-react';

export interface TooltipState {
  visible: boolean;
  text: string;
  category?: 'image' | 'video' | 'simulation' | 'graphic';
  x: number;
  y: number;
}

export interface AudioPlayerBarProps {
  utteranceRef?: React.RefObject<any>;
  speakTutorSentence?: (idx: number, sentences: string[], voice?: any) => void;
  speakSentence?: (idx: number, voice?: any) => void;
  isLoggedIn?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  tooltip: TooltipState;
  isPlaying: boolean;
  isPaused: boolean;
  isReadingTutor: boolean;
  currentSentenceIndex: number;
  currentTutorSentenceIndex: number;
  sentences: string[];
  tutorSentences: string[];
  volume: number;
  lastVolume: number;
  setVolume: (v: number) => void;
  setLastVolume: (v: number) => void;
  rate: number;
  handleRateChange: (v: number) => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (v: SpeechSynthesisVoice | null) => void;
  readCourse: boolean;
  setReadCourse: (v: boolean) => void;
  readTutor: boolean;
  setReadTutor: (v: boolean) => void;
  saveSettingsToCloud: (updates: { volume?: number; rate?: number; voiceId?: string; readCourse?: boolean; readTutor?: boolean }) => void;
  togglePlay: () => void;
  stop: () => void;
  nextSentence: () => void;
  prevSentence: () => void;
  lang?: string;
  t: any;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  containerRef,
  tooltip,
  isPlaying,
  isPaused,
  isReadingTutor,
  currentSentenceIndex,
  currentTutorSentenceIndex,
  sentences,
  tutorSentences,
  volume,
  lastVolume,
  setVolume,
  setLastVolume,
  rate,
  handleRateChange,
  voices,
  selectedVoice,
  setSelectedVoice,
  readCourse,
  setReadCourse,
  readTutor,
  setReadTutor,
  saveSettingsToCloud,
  togglePlay,
  stop,
  nextSentence,
  prevSentence,
  lang = "EN",
  t,
  isLoggedIn = true,
  utteranceRef,
  speakTutorSentence = () => {},
  speakSentence = () => {},
}) => {
  const [showVolumePopup, setShowVolumePopup] = React.useState(false);
  const [showSpeedPopup, setShowSpeedPopup] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !target.closest('select') &&
        !target.closest('option')
      ) {
        setShowVolumePopup(false);
        setShowSpeedPopup(false);
        setShowSettings(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [containerRef]);

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans w-[272px]">
      {/* Global CSS Style tag for highlighting the reading element */}
      <style>{`
        @keyframes highlight-pulse {
          0%, 100% { border-left-color: rgb(59, 130, 246); }
          50% { border-left-color: rgba(59, 130, 246, 0.4); }
        }
        @keyframes paper-highlight-pulse {
          0%, 100% { border-left-color: rgb(245, 158, 11); }
          50% { border-left-color: rgba(245, 158, 11, 0.4); }
        }
        @keyframes focus-highlight-pulse {
          0%, 100% { border-left-color: #ffffff; }
          50% { border-left-color: rgba(255, 255, 255, 0.3); }
        }
        .reading-highlight {
          background-color: rgba(59, 130, 246, 0.08) !important;
          border-left: 4px solid rgb(59, 130, 246) !important;
          padding-left: 12px !important;
          transition: all 0.3s ease !important;
          border-radius: 0 8px 8px 0 !important;
          animation: highlight-pulse 2s infinite ease-in-out;
        }
        .reading-highlight-text {
          background-color: rgba(59, 130, 246, 0.22) !important;
          color: #60a5fa !important;
          border-bottom: 2px solid rgba(59, 130, 246, 0.5) !important;
          border-radius: 4px !important;
          padding: 1px 3px !important;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.2) !important;
        }
        /* Direct backup block-level highlights for fallback or styling headings */
        .reading-highlight h1,
        .reading-highlight h2,
        .reading-highlight h3,
        .reading-highlight h4,
        .reading-highlight h5,
        .reading-highlight h6,
        .reading-highlight p,
        .reading-highlight li,
        .reading-highlight blockquote {
          color: #60a5fa !important;
        }

        /* --- Paper Theme Overrides --- */
        .theme-paper .reading-highlight {
          background-color: rgba(245, 158, 11, 0.04) !important;
          border-left: 4px solid rgb(245, 158, 11) !important;
          animation: paper-highlight-pulse 2s infinite ease-in-out;
        }
        .theme-paper .reading-highlight-text {
          background-color: rgba(245, 158, 11, 0.26) !important;
          color: #78350f !important;
          border-bottom: 2px solid rgba(245, 158, 11, 0.6) !important;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.15) !important;
        }
        .theme-paper .reading-highlight h1,
        .theme-paper .reading-highlight h2,
        .theme-paper .reading-highlight h3,
        .theme-paper .reading-highlight h4,
        .theme-paper .reading-highlight h5,
        .theme-paper .reading-highlight h6,
        .theme-paper .reading-highlight p,
        .theme-paper .reading-highlight li,
        .theme-paper .reading-highlight blockquote {
          color: #78350f !important;
        }

        /* --- Focus Theme Overrides --- */
        .theme-focus .reading-highlight {
          background-color: rgba(255, 255, 255, 0.03) !important;
          border-left: 4px solid #ffffff !important;
          animation: focus-highlight-pulse 2s infinite ease-in-out;
        }
        .theme-focus .reading-highlight-text {
          background-color: rgba(255, 255, 255, 0.15) !important;
          color: #ffffff !important;
          border-bottom: 2px solid rgba(255, 255, 255, 0.4) !important;
          box-shadow: none !important;
        }
        .theme-focus .reading-highlight h1,
        .theme-focus .reading-highlight h2,
        .theme-focus .reading-highlight h3,
        .theme-focus .reading-highlight h4,
        .theme-focus .reading-highlight h5,
        .theme-focus .reading-highlight h6,
        .theme-focus .reading-highlight p,
        .theme-focus .reading-highlight li,
        .theme-focus .reading-highlight blockquote {
          color: #ffffff !important;
        }
      `}</style>

      {/* Main glassmorphic player pill (strictly aligned to sidebar width) */}
      <div ref={containerRef} className="w-full flex items-center justify-between bg-slate-900/95 border border-slate-800/80 p-2.5 px-3 rounded-full shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700/80">
        
        {/* Center Part: Playback Controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={prevSentence}
            disabled={
              isReadingTutor 
                ? currentTutorSentenceIndex <= 0 
                : currentSentenceIndex <= 0
            }
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors shrink-0"
            title="Previous Sentence"
            aria-label="Previous sentence"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
            title={isPlaying && !isPaused ? "Pause (Alt+S)" : "Play / Resume (Alt+S)"}
            aria-label={isPlaying && !isPaused ? "Pause speech" : "Play or resume speech"}
          >
            {isPlaying && !isPaused ? (
              <Pause className="w-3 h-3 fill-white" />
            ) : (
              <Play className="w-3 h-3 fill-white ml-0.5" />
            )}
          </button>

          <button
            onClick={stop}
            disabled={!isPlaying}
            className={`w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center shrink-0 ${
              isPlaying
                ? 'bg-slate-800/80 text-slate-300 hover:text-slate-100 hover:bg-slate-700 border border-slate-700/80 shadow-lg cursor-pointer'
                : 'bg-slate-950/40 text-slate-600 border border-transparent opacity-30 cursor-not-allowed'
            }`}
            title="Stop (Alt+Q)"
            aria-label="Stop speech"
          >
            <Square className={`w-2.5 h-2.5 ${isPlaying ? 'fill-slate-300' : 'fill-slate-600'}`} />
          </button>

          <button
            onClick={nextSentence}
            disabled={
              isReadingTutor 
                ? currentTutorSentenceIndex >= tutorSentences.length - 1 
                : currentSentenceIndex >= sentences.length - 1
            }
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors shrink-0"
            title="Next Sentence"
            aria-label="Next sentence"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Part: Volume, Speed & Settings */}
        <div className="flex items-center gap-1.5">
          {/* Volume button with vertical slider pop-up */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setShowVolumePopup(!showVolumePopup);
                setShowSettings(false); // Close settings if open
                setShowSpeedPopup(false); // Close speed if open
              }}
              className={`p-1 rounded-lg text-slate-400 hover:text-white transition-colors ${showVolumePopup ? 'text-blue-400' : ''}`}
              title="Volume"
              aria-label="Volume control"
            >
              {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {showVolumePopup && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl shadow-2xl backdrop-blur-xl w-8 h-32 flex flex-col items-center justify-between z-50 animate-fade-in">
                <div className="h-20 w-full flex items-center justify-center relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    {...{ orient: "vertical" }}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolume(v);
                      if (isPlaying && !isPaused && utteranceRef?.current) {
                        (utteranceRef.current as any).volume = v;
                      }
                      saveSettingsToCloud({ volume: v });
                    }}
                    className="accent-blue-500 cursor-pointer focus:outline-none"
                    style={{
                      WebkitAppearance: 'slider-vertical',
                      width: '4px',
                      height: '70px',
                      background: '#1e293b',
                      borderRadius: '2px',
                      padding: 0,
                      margin: 0
                    }}
                    aria-label="Volume slider"
                  />
                </div>
                <button
                  onClick={() => {
                    let nextVolume = 0;
                    if (volume > 0) {
                      setLastVolume(volume);
                      setVolume(0);
                      nextVolume = 0;
                    } else {
                      const vol = lastVolume || 1.0;
                      setVolume(vol);
                      nextVolume = vol;
                    }
                    saveSettingsToCloud({ volume: nextVolume });
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Mute"
                >
                  {volume === 0 ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3" />}
                </button>
              </div>
            )}
          </div>

          {/* Reading Speed Slider Control */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setShowSpeedPopup(!showSpeedPopup);
                setShowVolumePopup(false);
                setShowSettings(false); // Close other popups
              }}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-slate-300 hover:text-white transition-colors cursor-pointer select-none ${
                showSpeedPopup ? 'text-blue-400' : ''
              }`}
              title="Reading Speed"
              aria-label="Reading speed control"
            >
              {rate.toFixed(1)}x
            </button>

            {showSpeedPopup && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl shadow-2xl backdrop-blur-xl w-8 h-32 flex flex-col items-center justify-between z-50 animate-fade-in">
                <div className="h-20 w-full flex items-center justify-center relative">
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={rate}
                    {...{ orient: "vertical" }}
                    onChange={(e) => {
                      const r = parseFloat(e.target.value);
                      handleRateChange(r);
                    }}
                    className="accent-blue-500 cursor-pointer focus:outline-none"
                    style={{
                      WebkitAppearance: 'slider-vertical',
                      width: '4px',
                      height: '70px',
                      background: '#1e293b',
                      borderRadius: '2px',
                      padding: 0,
                      margin: 0
                    }}
                    aria-label="Speed slider"
                  />
                </div>
                <span className="text-[8px] font-bold text-slate-400 select-none">{rate.toFixed(1)}x</span>
              </div>
            )}
          </div>

          {/* Cog settings button */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowVolumePopup(false); // Close volume if open
                setShowSpeedPopup(false); // Close speed if open
              }}
              className={`p-1 rounded-lg text-slate-400 hover:text-white transition-colors ${showSettings ? 'text-blue-400' : ''}`}
              title="Speech Settings"
              aria-label="Speech settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Settings dropdown */}
            {showSettings && (
              <div className="absolute bottom-10 right-0 bg-slate-900 border border-slate-800/80 p-3 rounded-2xl shadow-2xl backdrop-blur-xl w-48 text-[10px] z-50 text-slate-300 font-sans animate-fade-in">
                <p className="font-bold text-slate-100 uppercase tracking-widest text-[8px] mb-2">{t.voice_coach}</p>
                
                <div className="space-y-2">
                  <div>
                    <label htmlFor="voice-select" className="text-[8px] text-slate-500 font-bold block mb-1">{t.select_voice}</label>
                    <select
                      id="voice-select"
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const match = voices.find(v => v.name === e.target.value);
                        if (match) {
                          setSelectedVoice(match);
                          if (isPlaying && !isPaused) {
                            if (isReadingTutor) {
                              if (currentTutorSentenceIndex >= 0) {
                                speakTutorSentence(currentTutorSentenceIndex, tutorSentences, match);
                              }
                            } else {
                              if (currentSentenceIndex >= 0) {
                                speakSentence(currentSentenceIndex, match);
                              }
                            }
                          }
                          saveSettingsToCloud({ voiceId: match.name });
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-1.5 rounded-lg text-[9px] focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      {voices.map(v => (
                        <option key={v.name} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Read Course / Read Tutor Checkboxes */}
                  <div className="pt-1.5 border-t border-slate-800 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors text-[9px]">
                      <input
                        type="checkbox"
                        checked={readCourse}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setReadCourse(val);
                          saveSettingsToCloud({ readCourse: val });
                        }}
                        className="rounded border-slate-800 bg-slate-950 text-blue-500 focus:ring-0 focus:ring-offset-0 w-3 h-3 cursor-pointer"
                      />
                      <span>{lang.toUpperCase() === 'FR' ? 'Lire le cours' : 'Read course text'}</span>
                    </label>

                    <label className={`flex items-center gap-2 transition-colors text-[9px] ${
                      isLoggedIn ? 'cursor-pointer hover:text-white' : 'cursor-not-allowed text-slate-500 opacity-60'
                    }`}>
                      <input
                        type="checkbox"
                        checked={isLoggedIn ? readTutor : true}
                        disabled={!isLoggedIn}
                        onChange={(e) => {
                          if (!isLoggedIn) return;
                          const val = e.target.checked;
                          setReadTutor(val);
                          saveSettingsToCloud({ readTutor: val });
                        }}
                        className={`rounded border-slate-800 bg-slate-950 text-blue-500 focus:ring-0 focus:ring-offset-0 w-3 h-3 ${
                          isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        }`}
                      />
                      <span>{lang.toUpperCase() === 'FR' ? 'Lire le tuteur' : 'Read tutor answers'}</span>
                    </label>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800 text-[8px] text-slate-500 space-y-0.5">
                    <p>• Shortcuts:</p>
                    <p>  - Play: <kbd className="bg-slate-800 px-1 rounded text-slate-300">Alt+S</kbd></p>
                    <p>  - Stop: <kbd className="bg-slate-800 px-1 rounded text-slate-300">Alt+Q</kbd></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium glassmorphic tooltip layer */}
      {tooltip.visible && (
        <div
          className="fixed pointer-events-none z-[9999] max-w-[280px] p-4 bg-slate-950/95 border border-slate-800/80 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8),_0_0_15px_rgba(59,130,246,0.15)] backdrop-blur-xl transition-all duration-150 ease-out flex flex-col gap-2 font-sans"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
              tooltip.category === 'video'
                ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                : tooltip.category === 'simulation'
                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                  : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
            }`}>
              {tooltip.category === 'video' 
                ? (t.media_video || '🔍 Video')
                : tooltip.category === 'simulation'
                  ? (t.media_simulation || '🔍 Simulation')
                  : (t.media_illustration || '🔍 Illustration')
              }
            </span>
          </div>
          <p className="text-[11px] leading-relaxed font-bold text-slate-100 italic">
            {tooltip.text}
          </p>
        </div>
      )}
    </div>
  );
};
