"use client";

import React from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface VideoProps {
  id: string;
  title: string;
  provider?: 'YouTube' | 'Vimeo';
}

export const Video = ({ id, title, provider = 'YouTube' }: VideoProps) => {
  const url = provider === 'YouTube' 
    ? `https://www.youtube.com/embed/${id}` 
    : `https://player.vimeo.com/video/${id}`;

  return (
    <div className="my-12 rounded-[32px] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
      <div className="relative aspect-video">
        <iframe
          src={url}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-none grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
        />
      </div>
      <div className="p-5 flex items-center justify-between bg-slate-950/50 backdrop-blur-xl border-t border-slate-800/50">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center text-red-500">
             <Play className="w-4 h-4 fill-current" />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Academic Resource</p>
             <p className="text-xs font-bold text-slate-200">{title}</p>
           </div>
        </div>
        <a 
          href={provider === 'YouTube' ? `https://youtube.com/watch?v=${id}` : `https://vimeo.com/${id}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-600 hover:text-white transition-all"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
