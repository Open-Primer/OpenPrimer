"use client";

import React, { useState, useEffect } from 'react';
import { Play, ExternalLink, Loader2, VideoOff, Search } from 'lucide-react';
import { useMdxStatus } from './MdxStatusContext';

type VideoStatus = 'checking' | 'ok' | 'unavailable';

/** Detect provider from a raw URL (best-effort) */
function detectProvider(url: string): 'YouTube' | 'Vimeo' | 'generic' {
  if (/youtube\.com|youtu\.be/i.test(url)) return 'YouTube';
  if (/vimeo\.com|player\.vimeo\.com/i.test(url)) return 'Vimeo';
  return 'generic';
}

/** Extract YouTube video ID from a URL */
function extractYoutubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/i);
  return m ? m[1] : null;
}

/** Extract Vimeo video ID from a URL */
function extractVimeoId(url: string): string | null {
  // Matches player.vimeo.com/video/12345, vimeo.com/12345, vimeo.com/channels/staffpicks/12345, vimeo.com/groups/abc/videos/12345, etc.
  const m = url.match(/(?:vimeo\.com|player\.vimeo\.com)\/(?:video\/|channels\/(?:[^\/]+)\/|groups\/(?:[^\/]+)\/videos\/)?(\d+)/i);
  return m ? m[1] : null;
}

interface VideoProps {
  id?: string;
  title: string;
  provider?: string;
  url?: string;
  duration?: string; // e.g. "3 min" or "2:30"
  unresolved?: boolean;
}

export const Video = ({ id, title, provider: propProvider, url, duration, unresolved }: VideoProps) => {
  const { markDegraded } = useMdxStatus();

  useEffect(() => {
    if (unresolved) {
      markDegraded('video');
    }
  }, [unresolved, markDegraded]);

  const [status, setStatus] = useState<VideoStatus>('checking');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (!unresolved && status === 'unavailable') {
      markDegraded('video');
    }
  }, [unresolved, status, markDegraded]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_lang') || 'en';
      setLang(stored.toLowerCase());
    }
  }, []);

  if (unresolved) {
    return null;
  }

  const isFr = lang === 'fr';
  const t = {
    verifying: isFr ? 'Vérification de la ressource...' : 'Verifying resource...',
    unavailableTitle: isFr ? 'Ressource indisponible' : 'Resource Unavailable / Indisponible',
    unavailableDesc: isFr 
      ? `La vidéo "${title}" est hors ligne. Vous pouvez trouver du contenu équivalent sur le web.`
      : `The video "${title}" is offline. You can find equivalent material on the web.`,
    searchBtn: isFr ? 'Rechercher sur Google' : 'Search on Google',
    academicVideo: isFr ? 'Vidéo Académique' : 'Academic Video',
    focusTip: isFr ? 'Conseil concentration : Prenez une pause de 30s si nécessaire.' : 'Focus Tip: Take a 30s break if needed.'
  };

  // Normalize provider input
  let normalizedPropProvider: 'YouTube' | 'Vimeo' | 'generic' = 'generic';
  if (propProvider) {
    const lower = propProvider.toLowerCase();
    if (lower === 'youtube') normalizedPropProvider = 'YouTube';
    else if (lower === 'vimeo') normalizedPropProvider = 'Vimeo';
    else normalizedPropProvider = 'generic';
  }

  // Resolve provider, url and videoId
  let finalProvider: 'YouTube' | 'Vimeo' | 'generic' = normalizedPropProvider;
  let finalUrl = url || '';
  let videoId = id || '';

  if (url) {
    finalProvider = detectProvider(url);
    if (finalProvider === 'YouTube') {
      videoId = extractYoutubeId(url) || '';
    } else if (finalProvider === 'Vimeo') {
      videoId = extractVimeoId(url) || '';
    }
  } else if (id) {
    finalProvider = propProvider ? normalizedPropProvider : 'YouTube';
    finalUrl = finalProvider === 'YouTube'
      ? `https://youtube.com/watch?v=${id}`
      : `https://vimeo.com/${id}`;
  }

  useEffect(() => {
    if (!finalUrl && !videoId) {
      setStatus('unavailable');
      return;
    }

    let cancelled = false;
    const verifyVideo = async () => {
      try {
        let checkUrl = '';
        if (finalProvider === 'YouTube' && videoId) {
          checkUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
        } else if (finalProvider === 'Vimeo' && videoId) {
          checkUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${encodeURIComponent(videoId)}`;
        } else {
          checkUrl = finalUrl;
        }

        if (finalProvider === 'generic') {
          // Direct HEAD check
          await fetch(checkUrl, { method: 'HEAD', mode: 'no-cors' });
          if (!cancelled) setStatus('ok');
        } else {
          const res = await fetch(checkUrl, { method: 'GET', mode: 'cors' });
          if (!cancelled) {
            setStatus(res.ok ? 'ok' : 'unavailable');
          }
        }
      } catch {
        // Network or CORS block — fallback to ok
        if (!cancelled) setStatus('ok');
      }
    };

    verifyVideo();
    return () => { cancelled = true; };
  }, [videoId, finalUrl, finalProvider]);

  // Completely hidden while checking — no layout shift
  if (status === 'checking') {
    return (
      <div className="my-12 rounded-[32px] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="aspect-video flex flex-col items-center justify-center gap-4 text-slate-600">
          <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            {t.verifying}
          </span>
        </div>
      </div>
    );
  }

  // Graceful degradation: video not found / private / deleted
  if (status === 'unavailable') {
    return null;
  }

  const embedUrl = finalProvider === 'YouTube'
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
    : finalProvider === 'Vimeo'
    ? `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`
    : finalUrl;

  const watchUrl = finalProvider === 'YouTube'
    ? `https://youtube.com/watch?v=${videoId}`
    : finalProvider === 'Vimeo'
    ? `https://vimeo.com/${videoId}`
    : finalUrl;

  const providerColor = finalProvider === 'YouTube'
    ? 'bg-red-600/10 text-red-500'
    : finalProvider === 'Vimeo'
    ? 'bg-sky-600/10 text-sky-400'
    : 'bg-emerald-600/10 text-emerald-400';

  const isLongVideo = (() => {
    if (!duration) return false;
    const clean = duration.toLowerCase().trim();
    if (clean.includes('h') || clean.includes('hour')) return true;
    const matchMin = clean.match(/(\d+)\s*(?:m|min|minute)/);
    if (matchMin && parseInt(matchMin[1], 10) > 5) return true;
    const matchCol = clean.match(/(\d+):(\d+)/);
    if (matchCol && parseInt(matchCol[1], 10) > 5) return true;
    return false;
  })();

  return (
    <div className="my-12 rounded-[32px] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
      <div className="relative aspect-video">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-none grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
        />
      </div>
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/50 backdrop-blur-xl border-t border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${providerColor}`}>
            <Play className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                {finalProvider} • {t.academicVideo}
              </span>
              {duration && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  isLongVideo ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {duration}
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-200">{title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-end md:self-auto">
          {isLongVideo && (
            <span className="text-[9px] text-amber-500/80 italic font-medium max-w-[180px] text-right leading-tight">
              {t.focusTip}
            </span>
          )}
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-600 hover:text-white transition-all flex items-center justify-center"
            aria-label={`Watch ${title} on external player`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
