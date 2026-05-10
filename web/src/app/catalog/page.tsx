"use client";

import React, { useState } from 'react';
import { TopNav } from '@/components/RefinedUI';
import { Search, Filter, BookOpen, GraduationCap, ChevronRight, Sparkles, Brain, Code, Scale, Microscope, Atom, Languages } from 'lucide-react';
import { motion } from 'framer-motion';

const CURRICULA = [
  { id: 'l1-bio', name: 'Biology L1', level: 'L1', modules: 12, students: '1.2k', icon: <Microscope className="w-5 h-5" /> },
  { id: 'l1-cs', name: 'Computer Science L1', level: 'L1', modules: 8, students: '2.4k', icon: <Code className="w-5 h-5" /> },
  { id: 'l1-law', name: 'Law L1', level: 'L1', modules: 10, students: '1.5k', icon: <Scale className="w-5 h-5" /> },
];

const UV_CARDS = [
  { id: 'cell-bio', name: 'Cell Biology', subject: 'Biology', level: 'L1', lessons: 5, tags: ['Essential'] },
  { id: 'genetics', name: 'Molecular Genetics', subject: 'Biology', level: 'L2', lessons: 8, tags: ['Intermediate'] },
  { id: 'python-intro', name: 'Python Fundamentals', subject: 'Computer Science', level: 'L1', lessons: 10, tags: ['Beginner'] },
  { id: 'quantum-physics', name: 'Quantum Mechanics', subject: 'Physics', level: 'L3', lessons: 12, tags: ['Advanced'] },
  { id: 'const-law', name: 'Constitutional Law', subject: 'Law', level: 'L1', lessons: 6, tags: ['Core'] },
];

export default function CatalogPage() {
  const [view, setView] = useState<'curricula' | 'uv'>('curricula');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 text-white">
      <TopNav toggleSidebar={() => {}} />

      <main className="max-w-6xl mx-auto px-8 pt-32">
        
        <header className="mb-16">
          <h1 className="text-4xl font-black mb-4 tracking-tight">Academic Catalog</h1>
          <p className="text-slate-500 max-w-2xl text-sm leading-relaxed mb-10 italic">
            "The curriculum is the menu, the individual units are the ingredients. Choose your path or follow our expert guidelines."
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
            <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
               <button 
                 onClick={() => setView('curricula')}
                 className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   view === 'curricula' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
                 }`}
               >
                 Full Curricula
               </button>
               <button 
                 onClick={() => setView('uv')}
                 className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   view === 'uv' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
                 }`}
               >
                 Units of Value (UV)
               </button>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                 <input placeholder="Filter courses..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-xs text-white focus:border-blue-500/50 outline-none" />
               </div>
               <button className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
                 <Filter className="w-5 h-5" />
               </button>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {view === 'curricula' ? (
            CURRICULA.map((c) => (
              <motion.div 
                key={c.id} 
                whileHover={{ y: -5 }}
                className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/30 transition-all cursor-pointer group flex flex-col justify-between h-80"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {c.icon}
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">{c.name}</h3>
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">{c.level}</span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">{c.modules} Modules</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                   <p className="text-[10px] font-bold text-slate-600">{c.students} Students</p>
                   <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-blue-500 transition-all" />
                </div>
              </motion.div>
            ))
          ) : (
            UV_CARDS.map((uv) => (
              <motion.div 
                key={uv.id}
                whileHover={{ y: -5 }}
                className="p-6 rounded-[32px] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/30 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1">
                    {uv.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>
                <h3 className="font-bold text-slate-100 mb-2">{uv.name}</h3>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">{uv.subject} • {uv.lessons} Lessons</p>
                <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-blue-600 text-[10px] font-black uppercase tracking-widest transition-all">Start Learning</button>
              </motion.div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
