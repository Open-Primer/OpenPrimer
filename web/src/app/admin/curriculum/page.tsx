"use client";

import React, { useState, useEffect } from 'react';
import { dbService, UV } from '@/lib/db';
import { BookOpen, Plus, MoreVertical, GripVertical, ChevronRight, Layers, GraduationCap, Sparkles, Globe, Trash2, Search, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCurriculum() {
  const [uvs, setUvs] = useState<UV[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const levels = ['L1 Foundation', 'L2 Intermediate', 'L3 Advanced'];

  useEffect(() => {
    dbService.getUVs().then(setUvs);
  }, []);

  const handleAIGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, this would refresh the list
    }, 3000);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-white">Academic Orchestrator</h1>
          <p className="text-slate-500 text-sm font-medium">Synthesize and scale knowledge paths with AI assistance.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleAIGenerate}
            disabled={isGenerating}
            className="px-6 py-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} /> 
            {isGenerating ? 'Synthesizing...' : 'AI Generate Curriculum'}
          </button>
          <button className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest hover:border-blue-500 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Manual Entry
          </button>
        </div>
      </header>

      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 ml-4">
           <Layers className="w-4 h-4 text-blue-500" /> Syllabus Blueprints
        </h2>
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-[40px] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-8 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Syllabus</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Level</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Translations</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
               {['Biology L1', 'Physics L1', 'CS L1'].map((name) => (
                 <tr key={name} className="group hover:bg-slate-800/20 transition-all">
                   <td className="px-8 py-4 text-xs font-bold text-slate-200">{name}</td>
                   <td className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase">L1 Bachelor</td>
                   <td className="px-8 py-4">
                      <div className="flex gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[8px] font-black border border-emerald-500/20" title="English: Complete">EN</span>
                        <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-[8px] font-black border border-blue-500/20" title="French: AI Draft">FR</span>
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-600 flex items-center justify-center text-[8px] font-black border border-white/5" title="Spanish: None">ES</span>
                      </div>
                   </td>
                   <td className="px-8 py-4 text-right">
                      <button className="p-2 rounded-lg bg-slate-800 text-slate-500 hover:text-blue-400 transition-all">
                        <Languages className="w-4 h-4" />
                      </button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {levels.map((level) => (
          <div key={level} className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                 <GraduationCap className="w-4 h-4 text-blue-500" /> {level}
              </h2>
              <span className="text-[9px] font-bold text-slate-700">{uvs.filter(uv => level.includes(uv.level)).length} Units</span>
            </div>
            
            <div className="min-h-[500px] p-6 rounded-[40px] bg-slate-900/20 border border-slate-800/50 border-dashed space-y-4">
               {uvs.filter(uv => level.includes(uv.level)).map(uv => (
                 <motion.div 
                    key={uv.id}
                    whileHover={{ y: -2 }}
                    className="p-5 rounded-[24px] bg-slate-900 border border-slate-800 shadow-xl flex items-center gap-4 group hover:border-blue-500/30 transition-all"
                 >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-600 group-hover:text-blue-400 transition-colors">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-200">{uv.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{uv.lessonsCount} Lessons</p>
                        <div className="flex gap-1">
                           {uv.languages.map(lang => (
                             <span key={lang} className="text-[7px] font-black text-blue-500/50 uppercase">{lang}</span>
                           ))}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </motion.div>
               ))}
               
               <button className="w-full py-6 rounded-[24px] border border-dashed border-slate-800 text-[9px] font-black text-slate-700 uppercase tracking-widest hover:border-blue-500/30 hover:text-blue-500/50 transition-all flex flex-col items-center gap-2">
                 <Plus className="w-4 h-4" /> Add to {level.split(' ')[0]}
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* SCRAPE & BUILD PANEL */}
      <section className="bg-gradient-to-br from-blue-600/10 to-transparent p-12 rounded-[40px] border border-blue-500/10">
         <div className="max-w-2xl">
           <h3 className="text-2xl font-black mb-4 flex items-center gap-3 text-white">
             <Zap className="w-6 h-6 text-blue-500" /> Scrape & Generate
           </h3>
           <p className="text-slate-500 text-sm mb-8 leading-relaxed">
             Provide a subject URL or a detailed topic description. Our AI will scrape the web, synthesize the content, and generate a complete MDX-ready unit of value for the catalog.
           </p>
           <div className="flex gap-4">
              <input placeholder="e.g. https://mit.edu/courses/quantum-physics" className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500/50 outline-none" />
              <button className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest transition-all">Orchestrate</button>
           </div>
         </div>
      </section>
    </div>
  );
}
