"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertTriangle, Loader2, Music4, Search } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  title: string;
  duration?: string; // e.g. "2 min" or "1:45"
}

type AudioStatus = 'checking' | 'ok' | 'unavailable';

export const AudioPlayer = ({ url, title, duration }: AudioPlayerProps) => {
  const [status, setStatus] = useState<AudioStatus>('checking');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parse long format warning
  const isLongAudio = (() => {
    if (!duration) return false;
    const clean = duration.toLowerCase().trim();
    if (clean.includes('h') || clean.includes('hour')) return true;
    const matchMin = clean.match(/(\d+)\s*(?:m|min|minute)/);
    if (matchMin && parseInt(matchMin[1], 10) > 3) return true;
    const matchCol = clean.match(/(\d+):(\d+)/);
    if (matchCol && parseInt(matchCol[1], 10) > 3) return true;
    return false;
  })();

  // Test URL reachability
  useEffect(() => {
    if (!url) {
      setStatus('unavailable');
      return;
    }

    let active = true;
    const testAudio = async () => {
      try {
        const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
        if (active) {
          setStatus('ok');
        }
      } catch (err) {
        if (active) {
          setStatus('unavailable');
        }
      }
    };

    testAudio();
    return () => { active = false; };
  }, [url]);

  // Sync state with HTML5 audio
  useEffect(() => {
    if (status !== 'ok') return;

    const audio = new Audio(url);
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setTotalDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
    };
  }, [status, url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.warn('Audio playback interrupted:', err));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const targetTime = parseFloat(e.target.value);
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (status === 'checking') {
    return (
      <div className="my-8 p-6 bg-slate-900 border border-slate-800 rounded-[24px] flex items-center justify-center gap-3">
        <Loader2 className="w-4 h-4 animate-spin text-slate-650" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Checking audio link...</span>
      </div>
    );
  }

  if (status === 'unavailable') {
    const searchQuery = `${title} audio`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    return (
      <div className="my-6 p-6 rounded-[24px] bg-slate-950/40 border border-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans distraction-free-hide">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 shrink-0">
            <VolumeX className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-550 mb-0.5">
              Resource Unavailable / Indisponible
            </p>
            <p className="text-xs text-slate-400 font-bold leading-normal">
              The audio track "{title}" is offline. You can find equivalent material on the web.
            </p>
          </div>
        </div>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-center bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer select-none"
        >
          <Search className="w-3.5 h-3.5" />
          Search on Google
        </a>
      </div>
    );
  }

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-[28px] shadow-xl flex flex-col md:flex-row md:items-center gap-5">
      {/* Visual Indicator */}
      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
        <Music4 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
      </div>

      {/* Title & Metadata */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
            Audio Resource
          </span>
          {duration && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold leading-none ${
              isLongAudio ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              {duration}
            </span>
          )}
          {isLongAudio && (
            <span className="text-[9px] text-amber-500/80 italic font-semibold leading-none">
              Attention limit warning
            </span>
          )}
        </div>
        <h4 className="text-sm font-bold text-slate-100 truncate">{title}</h4>
      </div>

      {/* Control Pane */}
      <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-all shadow-md active:scale-95 shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Scrub Bar */}
        <div className="flex flex-col gap-1 flex-1 md:w-48">
          <input
            type="range"
            min={0}
            max={totalDuration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[9px] font-medium text-slate-500 select-none">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        <button
          onClick={toggleMute}
          className="p-2 hover:bg-slate-850 rounded-xl text-slate-500 hover:text-slate-350 transition-colors shrink-0"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
