"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, BookOpen, Globe, Sparkles, Cpu, ChevronRight, Zap, Star } from 'lucide-react';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { TopNav, AITutorOverlay } from '@/components/RefinedUI';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { UI_STRINGS } from '@/components/RefinedUI';
import { dbService } from '@/lib/db';

export default function Home() {
  const { language: lang } = useLanguage();
  const s = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total_students: 0, active_curricula: 0 });

  useEffect(() => {
    async function loadStats() {
      const { data } = await dbService.getSiteStats();
      if (data) setStats(data);
    }
    loadStats();
  }, []);
  
  const examples = [
    { label: "Physics L1", query: "physics" },
    { label: "Cell Biology", query: "biology" },
    { label: "Constitutional Law", query: "law" },
    { label: "Point Mechanics", query: "mechanics" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 font-sans overflow-hidden text-white">
      <TopNav />
      <AITutorOverlay lang="EN" />
      
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 pt-32 pb-24 flex flex-col items-center">
        
        {/* Shiny Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12 relative"
        >
          <OpenPrimerIcon className="w-24 h-24" />
          <div className="absolute -top-2 -right-6 bg-blue-600 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg shadow-blue-600/40">
            {s.beta_tag}
          </div>
        </motion.div>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter leading-none text-white">
            {s.universal_knowledge} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">
              {s.finally_free}
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {s.summary}
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-12 relative z-[60]">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/20 blur-2xl group-focus-within:bg-blue-600/40 transition-all opacity-0 group-focus-within:opacity-100" />
            <div className="relative flex items-center bg-slate-900/80 border border-slate-800 p-2 rounded-[32px] backdrop-blur-xl focus-within:border-blue-500/50 transition-all shadow-2xl">
              <div className="pl-6 pr-4">
                <Search className="w-6 h-6 text-slate-600" />
              </div>
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={s.search}
                className="flex-1 bg-transparent border-none py-4 text-lg text-white focus:outline-none placeholder:text-slate-700 font-medium"
              />
              <Link href="/catalog" className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full transition-all shadow-lg shadow-blue-600/20 mr-2">
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
          
          {/* Examples */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest mr-2">{s.try_label}</span>
            {examples.map((ex) => (
              <button 
                key={ex.label}
                onClick={() => setSearch(ex.label)}
                className="px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800/50 text-xs font-bold text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

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
               <div className="bg-violet-500/20 text-violet-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{lang === 'ZH' ? '5 种语言' : `5 ${s.languages}`}</div>
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
              <h2 className="text-4xl font-black tracking-tighter text-white">{s.mission}</h2>
              <p className="text-slate-500 leading-relaxed italic">
                "{s.mission_desc}"
              </p>
              <Link href="/philosophy" className="flex items-center gap-2 text-blue-500 font-bold hover:gap-4 transition-all">
                {s.mission_link} <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[32px] text-center">
                 <p className="text-3xl font-black text-white">{stats.total_students.toLocaleString() || '50+'}</p>
                 <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">{s.languages}</p>
              </div>
              <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[32px] text-center mt-8">
                 <p className="text-3xl font-black text-white">{stats.active_curricula || '12'}</p>
                 <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">{s.quality}</p>
              </div>
           </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
