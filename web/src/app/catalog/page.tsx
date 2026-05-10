"use client";

import React, { useState } from 'react';
import { TopNav } from '@/components/RefinedUI';
import { Search, Filter, BookOpen, GraduationCap, ChevronRight, Sparkles, Brain, Code, Scale, Microscope, Atom, Languages } from 'lucide-react';
import { motion } from 'framer-motion';

const CURRICULA = [
  { id: 'l1-bio', name: 'Biology L1', level: 'L1', modules: 12, students: '1.2k', duration: '120h', icon: <Microscope className="w-5 h-5" /> },
  { id: 'l1-cs', name: 'Computer Science L1', level: 'L1', modules: 8, students: '2.4k', duration: '90h', icon: <Code className="w-5 h-5" /> },
  { id: 'l1-law', name: 'Law L1', level: 'L1', modules: 10, students: '1.5k', duration: '110h', icon: <Scale className="w-5 h-5" /> },
  { id: 'l1-phys', name: 'Physics L1', level: 'L1', modules: 15, students: '900', duration: '150h', icon: <Atom className="w-5 h-5" /> },
];

const UV_CARDS = [
  { id: 'cell-bio', name: 'Cell Biology', subject: 'Biology', level: 'L1', lessons: 5, difficulty: 'Core', duration: '6h' },
  { id: 'genetics', name: 'Molecular Genetics', subject: 'Biology', level: 'L2', lessons: 8, difficulty: 'Intermediate', duration: '12h' },
  { id: 'python-intro', name: 'Python Fundamentals', subject: 'CS', level: 'L1', lessons: 10, difficulty: 'Core', duration: '15h' },
  { id: 'quantum-physics', name: 'Quantum Mechanics', subject: 'Physics', level: 'L3', lessons: 12, difficulty: 'Advanced', duration: '20h' },
  { id: 'const-law', name: 'Constitutional Law', subject: 'Law', level: 'L1', lessons: 6, difficulty: 'Core', duration: '10h' },
  { id: 'thermo', name: 'Thermodynamics', subject: 'Physics', level: 'L2', lessons: 7, difficulty: 'Intermediate', duration: '14h' },
];

export default function CatalogPage() {
  const [view, setView] = useState<'curricula' | 'uv'>('curricula');
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');

  const filteredUVs = UV_CARDS.filter(uv => 
    (filterSubject === 'All' || uv.subject === filterSubject) &&
    (uv.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 text-white">
      <TopNav toggleSidebar={() => {}} />

      <main className="max-w-7xl mx-auto px-8 pt-32">
        
        <header className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <h1 className="text-5xl font-black mb-4 tracking-tighter text-white">Academic Catalog</h1>
              <p className="text-slate-500 max-w-2xl text-sm leading-relaxed italic">
                "The curriculum is the menu, the individual units are the ingredients. Scale your knowledge."
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[32px] hidden lg:block">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Platform Scale</p>
               <div className="flex gap-8">
                  <div><p className="text-xl font-black text-blue-500">2.4k</p><p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Active UVs</p></div>
                  <div><p className="text-xl font-black text-emerald-500">12k+</p><p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Students</p></div>
               </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 justify-between items-end bg-slate-900/20 p-2 rounded-[32px] border border-slate-900/50">
            <div className="flex gap-2 p-1 bg-slate-900/50 rounded-2xl">
               <button 
                 onClick={() => setView('curricula')}
                 className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   view === 'curricula' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
                 }`}
               >
                 Full Curricula
               </button>
               <button 
                 onClick={() => setView('uv')}
                 className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   view === 'uv' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
                 }`}
               >
                 Individual UVs
               </button>
            </div>

            <div className="flex gap-4 w-full lg:w-auto p-1">
               <select 
                 value={filterSubject}
                 onChange={(e) => setFilterSubject(e.target.value)}
                 className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer"
               >
                 <option value="All">All Subjects</option>
                 <option value="Biology">Biology</option>
                 <option value="CS">Computer Science</option>
                 <option value="Law">Law</option>
                 <option value="Physics">Physics</option>
               </select>
               <div className="relative flex-1 lg:w-72">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                 <input 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Search library..." 
                   className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700" 
                 />
               </div>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {view === 'curricula' ? (
            CURRICULA.map((c) => (
              <motion.div 
                key={c.id} 
                whileHover={{ y: -8 }}
                className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/30 transition-all cursor-pointer group flex flex-col justify-between h-96 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] pointer-events-none" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl shadow-blue-900/10">
                    {c.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 leading-tight">{c.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-slate-800/50 text-[8px] font-black text-slate-500 uppercase tracking-widest border border-white/5">{c.level}</span>
                    <span className="px-3 py-1 rounded-full bg-slate-800/50 text-[8px] font-black text-slate-500 uppercase tracking-widest border border-white/5">{c.modules} Modules</span>
                    <span className="px-3 py-1 rounded-full bg-slate-800/50 text-[8px] font-black text-slate-500 uppercase tracking-widest border border-white/5">{c.duration}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{c.students} Enrolled</p>
                   <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                     <ChevronRight className="w-5 h-5" />
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            filteredUVs.map((uv) => (
              <motion.div 
                key={uv.id}
                whileHover={{ y: -5 }}
                className="p-6 rounded-[32px] bg-slate-900/30 border border-slate-800/40 hover:border-blue-500/30 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest border border-blue-500/20">{uv.difficulty}</span>
                </div>
                <h3 className="font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">{uv.name}</h3>
                <div className="flex items-center gap-3 mb-6">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{uv.subject}</p>
                   <div className="w-1 h-1 rounded-full bg-slate-800" />
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{uv.duration}</p>
                </div>
                <button className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-blue-600 text-[9px] font-black uppercase tracking-widest transition-all shadow-xl">Enroll UV</button>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
