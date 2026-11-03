"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Globe, Cpu } from 'lucide-react';
import { getLocalString } from './landingStrings';

export const FeaturesAndMissionSection = ({
  stats,
  lang,
  s
}: {
  stats: any;
  lang: string;
  s: any;
}) => (
  <>
    {/* Features Grid */}
    <div className="grid md:grid-cols-3 gap-8 mt-12">
      <div className="space-y-4 p-8 bg-slate-900/20 border border-slate-900 rounded-[40px] hover:bg-slate-900/40 transition-all group">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-200 uppercase text-[10px] tracking-widest">{s.rigor}</h3>
          <div className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{s.elite_tag}</div>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">{s.rigor_desc}</p>
      </div>
      
      <div className="space-y-4 p-8 bg-slate-900/20 border border-slate-900 rounded-[40px] hover:bg-slate-900/40 transition-all group">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
          <Cpu className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-200 uppercase text-[10px] tracking-widest">{s.tutor}</h3>
          <div className="bg-blue-500/20 text-blue-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{s.new_tag}</div>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">{s.tutor_desc}</p>
      </div>

      <div className="space-y-4 p-8 bg-slate-900/20 border border-slate-900 rounded-[40px] hover:bg-slate-900/40 transition-all group">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
          <Globe className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-200 uppercase text-[10px] tracking-widest">{s.languages}</h3>
          <div className="bg-violet-500/20 text-violet-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
            {getLocalString('languages_formatted', lang).replace('{count}', String(stats?.total_languages || 9))}
          </div>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">{s.multilingual_desc}</p>
      </div>
    </div>

    {/* MISSION SECTION */}
    <section className="w-full mt-40 grid md:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
          <Globe className="w-4 h-4" /> {s.mission_sub}
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-foreground">{s.mission}</h2>
        <p className="text-slate-500 leading-relaxed italic">
          "{s.mission_desc}"
        </p>
        <Link href="/philosophy" className="flex items-center gap-2 text-blue-500 font-bold hover:gap-4 transition-all">
          {s.mission_link} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] text-center hover:border-blue-500/30 transition-all duration-300 backdrop-blur-xl group">
          <p className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500 group-hover:scale-105 transition-transform duration-300">
            {stats?.total_languages || 9}
          </p>
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-2">{s.languages}</p>
        </div>
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] text-center hover:border-violet-500/30 transition-all duration-300 backdrop-blur-xl group sm:mt-6">
          <p className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-violet-500 group-hover:scale-105 transition-transform duration-300">
            {stats ? stats.active_curricula : 12}
          </p>
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-2">
            {s.curricula || "Curricula"}
          </p>
        </div>
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] text-center hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-xl group sm:mt-12">
          <p className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-500 group-hover:scale-105 transition-transform duration-300">
            {stats ? stats.total_courses : 36}
          </p>
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-2">
            {s.total_courses || "Total Courses"}
          </p>
        </div>
      </div>
    </section>
  </>
);
