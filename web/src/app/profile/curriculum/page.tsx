"use client";

import React, { useState, useEffect } from 'react';
import { TopNav, UI_STRINGS, Footer } from '@/components/RefinedUI';
import { GraduationCap, Book, Star, Clock, Award, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function CurriculumPage() {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('op_bookmarks');
    if (saved) {
      // In a real app, we'd fetch the course details from DB using IDs
      // For now, we'll mock some data
      setBookmarks([
        { id: 1, title: "Classical Mechanics L1", subject: "Physics", level: "L1", slug: "classical-mechanics", progress: 32 },
        { id: 2, title: "Cell Biology", subject: "Biology", level: "L1", slug: "cell-biology", progress: 0 }
      ]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TopNav />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <header className="mb-16">
          <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
             <GraduationCap className="w-4 h-4" /> {t.curriculum}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{t.my_curriculum}</h1>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
           <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl">
              <Award className="w-8 h-8 text-yellow-500 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Total Credits</p>
              <p className="text-3xl font-black text-white">12 ECTS</p>
           </div>
           <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl">
              <Star className="w-8 h-8 text-blue-500 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Knowledge Points</p>
              <p className="text-3xl font-black text-white">4,250 KP</p>
           </div>
           <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl">
              <Clock className="w-8 h-8 text-emerald-500 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Learning Time</p>
              <p className="text-3xl font-black text-white">42h 15m</p>
           </div>
        </div>

        <section>
           <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
              <Book className="w-6 h-6 text-blue-500" /> Active Modules
           </h2>
           
           <div className="grid md:grid-cols-2 gap-8">
              {bookmarks.map(course => (
                <Link key={course.id} href={`/catalog`} className="group">
                  <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[48px] hover:border-blue-500/50 transition-all shadow-2xl flex flex-col h-full">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                           <Book className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-500">{course.level}</span>
                     </div>
                     <h3 className="text-xl font-black mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                     <p className="text-sm text-slate-500 mb-8">{course.subject}</p>
                     
                     <div className="mt-auto">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[9px] font-black uppercase text-slate-600">Progress</span>
                           <span className="text-[9px] font-black text-blue-500">{course.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${course.progress}%` }}
                             className="h-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]" 
                           />
                        </div>
                     </div>
                  </div>
                </Link>
              ))}
           </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
