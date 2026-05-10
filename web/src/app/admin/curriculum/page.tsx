"use client";

import React, { useState, useEffect } from 'react';
import { dbService, UV } from '@/lib/db';
import { BookOpen, Plus, MoreVertical, GripVertical, ChevronRight, Layers, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminCurriculum() {
  const [uvs, setUvs] = useState<UV[]>([]);
  const levels = ['L1 Foundation', 'L2 Intermediate', 'L3 Advanced'];

  useEffect(() => {
    dbService.getUVs().then(setUvs);
  }, []);

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-white">Curriculum Editor</h1>
          <p className="text-slate-500 text-sm font-medium">Design academic paths and organize units of value.</p>
        </div>
        <button className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" /> Create New UV
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {levels.map((level) => (
          <div key={level} className="space-y-6">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 ml-4">
               <GraduationCap className="w-4 h-4 text-blue-500" /> {level}
            </h2>
            <div className="min-h-[400px] p-4 rounded-[40px] bg-slate-900/20 border border-slate-900 border-dashed space-y-4">
               {uvs.filter(uv => level.includes(uv.level)).map(uv => (
                 <motion.div 
                    key={uv.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-5 rounded-[24px] bg-slate-900 border border-slate-800 shadow-xl flex items-center gap-4 group"
                 >
                    <div className="cursor-grab text-slate-700 group-hover:text-slate-500 transition-colors">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-200">{uv.name}</p>
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{uv.lessonsCount} Lessons</p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-700 hover:text-slate-300">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                 </motion.div>
               ))}
               <button className="w-full py-4 rounded-[24px] border border-dashed border-slate-800 text-[9px] font-black text-slate-700 uppercase tracking-widest hover:border-slate-700 hover:text-slate-500 transition-all">
                 + Add UV to {level.split(' ')[0]}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
