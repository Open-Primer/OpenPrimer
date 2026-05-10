"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, BookOpen, Globe, Sparkles, Cpu, ChevronRight } from 'lucide-react';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { TopNav } from '@/components/RefinedUI';
import { motion } from 'framer-motion';

export default function Home() {
  const [search, setSearch] = useState('');

  const examples = [
    { label: "Biology L1", query: "biology" },
    { label: "Introduction to Programming", query: "programming" },
    { label: "Constitutional Law", query: "law" },
    { label: "Point Mechanics", query: "physics" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 font-sans overflow-hidden text-white">
      <TopNav toggleSidebar={() => {}} />
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 pt-32 pb-24 flex flex-col items-center">
        
        {/* Shiny Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12"
        >
          <OpenPrimerIcon className="w-24 h-24" />
        </motion.div>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter leading-none text-white">
            Universal Knowledge. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">
              Finally Free.
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            OpenPrimer synthesizes the entirety of academic curricula from primary school to Bachelor's degree into a single, interactive, and AI-tutored experience.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/20 blur-2xl group-focus-within:bg-blue-600/40 transition-all opacity-0 group-focus-within:opacity-100" />
            <div className="relative flex items-center bg-slate-900/80 border border-slate-800 p-2 rounded-[32px] backdrop-blur-xl focus-within:border-blue-500/50 transition-all shadow-2xl">
              <div className="pl-6 pr-4">
                <Search className="w-6 h-6 text-slate-600" />
              </div>
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What do you want to learn today?"
                className="flex-1 bg-transparent border-none py-4 text-lg text-white focus:outline-none placeholder:text-slate-700 font-medium"
              />
              <Link 
                href={search ? `/L1/Biology/Cell_Biology/introduction_to_the_cell` : '#'} 
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full transition-all shadow-lg shadow-blue-600/20"
              >
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
          
          {/* Examples */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest mr-2">Try:</span>
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

        {/* Footer Concept */}
        <div className="grid md:grid-cols-3 gap-8 mt-12 text-center md:text-left">
           <div className="space-y-4 p-6">
             <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto md:mx-0">
               <BookOpen className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-slate-200">Structured Learning</h3>
             <p className="text-sm text-slate-500 leading-relaxed">Not just a search engine, but a real academic curriculum guided by university standards.</p>
           </div>
           <div className="space-y-4 p-6">
             <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto md:mx-0">
               <Cpu className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-slate-200">AI Tutoring</h3>
             <p className="text-sm text-slate-500 leading-relaxed">Ask questions directly in the manual. Our AI understands the context and helps you move forward.</p>
           </div>
           <div className="space-y-4 p-6">
             <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mx-auto md:mx-0">
               <Globe className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-slate-200">Open & Universal</h3>
             <p className="text-sm text-slate-500 leading-relaxed">Free access to all knowledge, in multiple languages, for everyone on the planet.</p>
           </div>
        </div>

        {/* Copyright / Footer */}
        <div className="mt-24 pt-8 border-t border-slate-900/50 w-full text-center">
           <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">
             OpenPrimer Project • 2026 • AI-Generated Academic Repository
           </p>
        </div>
      </div>
    </div>
  );
}
