"use client";

import React, { useState, useEffect } from 'react';
import { TopNav, UI_STRINGS, Footer } from '@/components/RefinedUI';
import { GraduationCap, Book, Star, Clock, Award, ChevronRight, Brain, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { dbService } from '@/lib/db';

export default function CurriculumPage() {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      const data = await dbService.getUserProgress('u1'); // Mock user
      setProgress(data);
      setLoading(false);
    }
    loadProgress();
  }, []);

  if (loading || !progress) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TopNav />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <header className="mb-12">
          <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
             <GraduationCap className="w-4 h-4" /> {t.curriculum}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{t.my_curriculum}</h1>
          <p className="text-slate-500 mt-4 font-medium">{t.curriculum_overview}</p>
        </header>

        {/* AI PEDAGOGICAL SUMMARY */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 p-10 bg-gradient-to-br from-blue-600/10 via-slate-900/40 to-slate-950 border border-blue-500/20 rounded-[60px] relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Brain className="w-32 h-32 text-blue-400" />
           </div>
           <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-6 flex items-center gap-3">
                 <Sparkles className="w-4 h-4" /> {t.tutor_summary}
              </h3>
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-200 max-w-3xl italic">
                 "{progress.aiSummary}"
              </p>
              <div className="mt-8 pt-8 border-t border-slate-800/50 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white"><ShieldCheck className="w-6 h-6" /></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.tutor_feedback} • Institutional Consensus</span>
              </div>
           </div>
        </motion.section>

        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
           <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-yellow-500/30 transition-all">
              <Award className="w-8 h-8 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{t.total_credits}</p>
              <p className="text-3xl font-black text-white">{progress.credits} ECTS</p>
           </div>
           <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-blue-500/30 transition-all">
              <Star className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{t.knowledge_points}</p>
              <p className="text-3xl font-black text-white">{progress.kp.toLocaleString()} KP</p>
           </div>
           <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-emerald-500/30 transition-all">
              <Clock className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{t.learning_time}</p>
              <p className="text-3xl font-black text-white">{progress.learningTime}</p>
           </div>
        </div>

        <section>
           <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
              <Book className="w-6 h-6 text-blue-500" /> {t.active_modules}
           </h2>
           
           <div className="grid md:grid-cols-2 gap-8">
              {progress.activeModules.map((course: any) => (
                <Link key={course.id} href={`/catalog`} className="group">
                  <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[48px] hover:border-blue-500/50 transition-all shadow-2xl flex flex-col h-full relative overflow-hidden">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                           <Book className="w-6 h-6" />
                        </div>
                        <div className="flex gap-2">
                           <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-500">{course.level}</span>
                        </div>
                     </div>
                     <h3 className="text-xl font-black mb-2 group-hover:text-blue-400 transition-colors">{t[course.title_key as keyof typeof t] || course.title_key}</h3>
                     <p className="text-sm text-slate-500 mb-8">{t[course.subject_key as keyof typeof t] || course.subject_key}</p>
                     
                     <div className="mt-auto">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[9px] font-black uppercase text-slate-600">{t.progress}</span>
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
