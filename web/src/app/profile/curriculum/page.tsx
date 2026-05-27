"use client";

import React, { useState, useEffect } from 'react';
import { TopNav, UI_STRINGS, Footer } from '@/components/RefinedUI';
import * as Icons from 'lucide-react';
import { GraduationCap, Book, Star, Clock, Award, ChevronRight, Brain, Sparkles, ShieldCheck, Bookmark, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { dbService, BADGE_LIBRARY, progressService } from '@/lib/db';


export default function CurriculumPage() {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const [progress, setProgress] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [earnedIds, setEarnedIds] = useState<number[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [curriculumRevision, setCurriculumRevision] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingMode, setReadingMode] = useState('dark');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [selectedCurriculumForDrillDown, setSelectedCurriculumForDrillDown] = useState<any | null>(null);
  const [abandonTarget, setAbandonTarget] = useState<any | null>(null);

  useEffect(() => {
    async function loadProgress() {
      const data = await dbService.getUserProgress('u1'); // Mock user
      setProgress(data);
      const { data: coursesData } = await dbService.getAllCourses();
      if (coursesData) setCourses(coursesData);
      
      const { data: achs } = await dbService.getAchievements();
      if (achs) setAchievements(achs);
      
      const earned = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('op_earned_achievements') || '[]') : [];
      setEarnedIds(earned);

      // Compute enrolled IDs + curriculum revision date
      const ids: number[] = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('op_enrolled_courses') || '[1, 3, 12]') : [1, 3, 12];
      setEnrolledIds(ids);
      const revDate = progressService.getCurriculumLastRevision(ids);
      setCurriculumRevision(revDate);

      setLoading(false);
    }
    loadProgress();

    // Load bookmarks
    const savedBookmarks = localStorage.getItem('op_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    // Load initial reading mode and define dynamic header buttons listener
    const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
    setReadingMode(savedMode);

    (window as any).setReadingMode = (mode: string) => {
      setReadingMode(mode);
      localStorage.setItem('op_reading_mode', mode);
    };
  }, []);


  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('op_bookmarks', JSON.stringify(newBookmarks));
  };

  const handleOptOut = (id: number) => {
    const updatedIds = enrolledIds.filter(cid => cid !== id);
    setEnrolledIds(updatedIds);
    localStorage.setItem('op_enrolled_courses', JSON.stringify(updatedIds));
    if (progress) {
      const updatedModules = progress.activeModules ? progress.activeModules.filter((m: any) => m.id !== id) : [];
      setProgress({
        ...progress,
        activeModules: updatedModules,
        inProgressCount: updatedModules.filter((m: any) => m.progress < 100).length,
        completedCount: updatedModules.filter((m: any) => m.progress === 100).length
      });
    }
  };

  if (loading || !progress) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const modeStyles = {
    dark: "bg-slate-950 text-white font-sans",
    default: "bg-slate-950 text-white font-sans",
    paper: "bg-[#fcfaf2] text-slate-900 font-serif",
    focus: "bg-black text-slate-400 font-sans"
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 theme-${readingMode} ${modeStyles[readingMode as keyof typeof modeStyles] || modeStyles.dark}`}>
      <TopNav showReadingModeSelector={true} />
      
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
           </div>
        </motion.section>

        {/* STATS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">

          {/* 🔥 Study Streak */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-orange-500/30 transition-all">
            <div className="text-3xl mb-4">🔥</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
              {lang === 'FR' ? 'Série d\'étude' : 'Study Streak'}
            </p>
            <p className="text-3xl font-black text-white">
              {progress.studyStreakDays ?? 0}
              <span className="text-base text-slate-500 font-bold ml-2">
                {lang === 'FR' ? 'jour' : 'day'}{(progress.studyStreakDays ?? 0) !== 1 ? 's' : ''}
              </span>
            </p>
            <p className="text-[9px] text-slate-600 mt-2 font-medium">
              {(progress.studyStreakDays ?? 0) >= 7
                ? (lang === 'FR' ? '🏆 Série impressionnante !' : '🏆 Impressive streak!')
                : (progress.studyStreakDays ?? 0) >= 3
                ? (lang === 'FR' ? '⚡ Continue comme ça !' : '⚡ Keep it up!')
                : (lang === 'FR' ? 'Reviens chaque jour pour une série !' : 'Come back daily to build a streak!')}
            </p>
          </div>

          {/* ⭐ Mastery Points — always grows */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-violet-500/30 transition-all">
            <Sparkles className="w-8 h-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
              {lang === 'FR' ? 'Points de Maîtrise' : 'Mastery Points'}
            </p>
            <p className="text-3xl font-black text-white">
              {progress.masteryPoints ?? 0}
              <span className="text-base text-slate-500 font-bold ml-2">pt{(progress.masteryPoints ?? 0) !== 1 ? 's' : ''}</span>
            </p>
            <p className="text-[9px] font-black uppercase tracking-wider mt-2 text-violet-400">
              {(progress.masteryPoints ?? 0) >= 50 ? (lang === 'FR' ? '🏆 Maître' : '🏆 Master')
                : (progress.masteryPoints ?? 0) >= 25 ? (lang === 'FR' ? '⭐ Expert' : '⭐ Expert')
                : (progress.masteryPoints ?? 0) >= 10 ? (lang === 'FR' ? '📚 Érudit' : '📚 Scholar')
                : (lang === 'FR' ? '🌱 Apprenti' : '🌱 Apprentice')}
            </p>
          </div>

          {/* ⏱ Total Study Hours */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-emerald-500/30 transition-all">
            <Clock className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{t.learning_time}</p>
            <p className="text-3xl font-black text-white">{progress.learningTime || "0h 0m"}</p>
            <p className="text-[9px] text-slate-600 mt-2 font-medium">
              {(progress.totalMinutes ?? 0) >= 600
                ? (lang === 'FR' ? '📖 Lecteur assidu' : '📖 Dedicated reader')
                : (progress.totalMinutes ?? 0) >= 120
                ? (lang === 'FR' ? '✨ Belle progression' : '✨ Great progress')
                : (lang === 'FR' ? 'Chaque minute compte !' : 'Every minute counts!')}
            </p>
          </div>

          {/* 📚 Courses Mastered */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-blue-500/30 transition-all">
            <GraduationCap className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
              {lang === 'FR' ? 'Cours Terminés' : 'Courses Mastered'}
            </p>
            <p className="text-3xl font-black text-white">{progress.completedCount ?? 0}</p>
            <p className="text-[9px] text-slate-500 mt-2 font-medium flex items-center gap-1">
              <span className="text-blue-400 font-black">{progress.inProgressCount ?? 0}</span>
              &nbsp;{lang === 'FR' ? 'en cours • sur' : 'in progress • of'}
              &nbsp;<span className="text-slate-400 font-black">{progress.activeModules?.length ?? 0}</span>
              &nbsp;{lang === 'FR' ? 'inscrits' : 'enrolled'}
            </p>
          </div>
        </div>

        {(() => {
          const activeCourses = progress.activeModules ? progress.activeModules.filter((c: any) => c.progress < 100) : [];
          const completedCourses = progress.activeModules ? progress.activeModules.filter((c: any) => c.progress === 100) : [];

          return (
            <>
              {activeCourses.length > 0 && (
                <section>
                   <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
                      <Book className="w-6 h-6 text-blue-500" /> {t.active_modules}
                   </h2>
                   <div className="grid md:grid-cols-2 gap-8">
                     {activeCourses.map((course: any) => {
                       const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
                       const ratingCount = courseDetails?.ratingCount || 0;
                       const averageRating = courseDetails?.averageRating || 0;
                       const isCurr = courseDetails?.isCurriculum || course.isCurriculum;
                       
                       const cardContent = (
                          <div className={`p-8 bg-slate-900/40 border ${isCurr ? 'border-violet-500/30 hover:border-violet-400/50 shadow-violet-500/5 bg-gradient-to-br from-violet-955/5 via-slate-900/40 to-slate-950/40' : 'border-slate-800 hover:border-blue-500/50'} rounded-[48px] transition-all shadow-2xl flex flex-col h-full relative overflow-hidden`}>
                              <div className="flex justify-between items-center mb-6 gap-2 w-full">
                                 <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 flex-shrink-0">
                                    {isCurr ? <GraduationCap className="w-6 h-6 text-violet-400" /> : <Book className="w-6 h-6" />}
                                 </div>
                                 <div className="flex gap-2 items-center flex-1 justify-end flex-wrap">
                                    {isCurr ? (
                                      <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 flex items-center gap-1">
                                        <Icons.Layers className="w-3 h-3 text-violet-400" />
                                        Curriculum
                                      </span>
                                    ) : (
                                      <>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} reviews`}>
                                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                          {averageRating > 0 ? averageRating.toFixed(1) : "3.4"} ({ratingCount > 0 ? ratingCount : 12})
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1">
                                          <Clock className="w-3.5 h-3.5" />
                                          {(courseDetails?.hours ?? 150)}H
                                        </span>
                                      </>
                                    )}
                                    <button
                                      onClick={(e) => toggleBookmark(course.id, e)}
                                      title={bookmarks.includes(course.id) ? 'Remove bookmark' : 'Save this course'}
                                      className={`p-2 rounded-xl transition-all ${bookmarks.includes(course.id) ? 'text-blue-400 bg-blue-400/10' : 'text-slate-700 hover:text-slate-400 hover:bg-slate-800'}`}
                                    >
                                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(course.id) ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setAbandonTarget(courseDetails || course);
                                      }}
                                      title={lang === 'FR' ? 'Abandonner' : 'Abandon'}
                                      className="p-2 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer flex items-center justify-center"
                                    >
                                      <Icons.Trash2 className="w-4 h-4" />
                                    </button>
                                    <span className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                      {course.level}
                                    </span>
                                 </div>
                              </div>
                              <h3 className="text-xl font-black mb-2 group-hover:text-blue-400 transition-colors">
                                {course.title}
                              </h3>
                              <p className="text-sm text-slate-500 mb-6">{course.subject}</p>
                              
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black uppercase text-slate-600">{t.progress}</span>
                                <span className={`text-[9px] font-black ${isCurr ? 'text-violet-400' : 'text-blue-500'}`}>{course.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${course.progress}%` }}
                                  className={`h-full ${isCurr ? 'bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]' : 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]'}`} 
                                />
                              </div>

                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider mb-6 w-full">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  {lang === 'FR' ? 'Temps passé :' : 'Time spent:'} <strong className="text-white">{progressService.getLessonTimeForCourse(course.slug)}m</strong>
                                </span>
                                <span>
                                  {lang === 'FR' ? 'Attendu :' : 'Expected:'} <strong className="text-slate-400">{(courseDetails?.hours ?? (isCurr ? 300 : 150))}h</strong>
                                </span>
                              </div>

                              <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center mt-auto">
                                 <span className={`text-[9px] font-black uppercase tracking-widest ${isCurr ? 'text-violet-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                                    {isCurr ? (lang === 'FR' ? 'Gérer le Curriculum' : 'Manage Curriculum') : (lang.toUpperCase() === 'FR' ? 'Continuer le cours' : 'Continue Course')}
                                 </span>
                                 <ChevronRight className={`w-4 h-4 ${isCurr ? 'text-violet-400' : 'text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1'} transition-all`} />
                              </div>
                          </div>
                       );

                       if (isCurr) {
                         return (
                           <div key={course.id} onClick={() => setSelectedCurriculumForDrillDown(courseDetails || course)} className="group cursor-pointer">
                             {cardContent}
                           </div>
                         );
                       }

                       return (
                         <Link key={course.id} href={`/course/${course.slug}`} className="group">
                           {cardContent}
                         </Link>
                       );
                     })}
                   </div>
                </section>
              )}

              {completedCourses.length > 0 && (
                <section className="mt-20">
                   <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-emerald-500">
                      <Award className="w-6 h-6 text-emerald-500 animate-pulse" /> {lang.toUpperCase() === 'FR' ? "Modules Complétés" : "Completed Courses"}
                   </h2>
                   <div className="grid md:grid-cols-2 gap-8">
                     {completedCourses.map((course: any) => {
                       const getCoursePath = (c: any) => {
                         const slug = c.slug;
                         if (slug === 'classical-mechanics' || slug === 'Classical_Mechanics' || c.id === 1) {
                           return '/L1/Physics/Classical_Mechanics/introduction';
                         }
                         if (slug === 'quantum-physics' || slug === 'Physique_Test_L2' || c.id === 2) {
                           return '/L2/Physics/Physique_Test_L2/introduction';
                         }
                         if (slug === 'cell-biology' || slug === 'Biologie_Test' || c.id === 3) {
                           return '/L1/Biology/Cell_Biology/introduction';
                         }
                         if (slug === 'molecular-genetics' || slug === 'Biologie_Test_L1' || c.id === 4) {
                           return '/L1/Biology/Biologie_Test_L1/introduction';
                         }
                         if (slug === 'constitutional-law' || slug === 'Droit_Test' || c.id === 5) {
                           return '/L1/Law/Droit_Test/introduction';
                         }
                         return '/catalog';
                       };

                       const formatCourseLevel = (level: string | number) => {
                         const lvlStr = String(level).toUpperCase();
                         return lvlStr;
                       };

                       const getLocalizedTitle = (c: any) => {
                         const isEn = lang.toUpperCase() === 'EN';
                         const slug = c.slug;
                         if (slug === 'classical-mechanics' || slug === 'Classical_Mechanics' || c.id === 1) {
                           return isEn ? "Physics: Classical Mechanics" : "Physique : Mécanique Classique";
                         }
                         if (slug === 'quantum-physics' || slug === 'Physique_Test_L2' || c.id === 2) {
                           return isEn ? "Physics: Quantum Physics (L2)" : "Physique : Physique Quantique (L2)";
                         }
                         if (slug === 'cell-biology' || slug === 'Biologie_Test' || c.id === 3) {
                           return isEn ? "Biology: Cell Biology" : "Biologie : Biologie Cellulaire";
                         }
                         if (slug === 'molecular-genetics' || slug === 'Biologie_Test_L1' || c.id === 4) {
                           return isEn ? "Biology: Molecular Genetics" : "Biologie : Génétique Moléculaire";
                         }
                         if (slug === 'constitutional-law' || slug === 'Droit_Test' || c.id === 5) {
                           return isEn ? "Law: Constitutional Law" : "Droit : Droit Constitutionnel";
                         }
                         return t[c.title_key as keyof typeof t] || c.title_key;
                       };

                       const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
                       const ratingCount = courseDetails?.ratingCount || 0;
                       const averageRating = courseDetails?.averageRating || 0;

                       return (
                         <Link key={course.id} href={getCoursePath(course)} className="group">
                           <div className="p-8 bg-slate-900/40 border border-emerald-500/20 rounded-[48px] hover:border-emerald-500/50 transition-all shadow-2xl flex flex-col h-full relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                                <div className="absolute top-6 -right-8 w-[150px] bg-gradient-to-r from-emerald-600 to-teal-400 text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 rotate-45 shadow-xl border-y border-white/20 select-none">
                                  {lang.toUpperCase() === 'FR' ? 'Complété' : 'Completed'}
                                </div>
                              </div>

                              <div className="flex justify-between items-center mb-6 gap-2 w-full">
                                 <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-400 flex-shrink-0">
                                    <Award className="w-6 h-6 animate-pulse" />
                                 </div>
                                 <div className="flex gap-2 items-center flex-1 justify-end flex-wrap mr-8">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} reviews`}>
                                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                      {averageRating > 0 ? averageRating.toFixed(1) : "3.4"} ({ratingCount > 0 ? ratingCount : 12})
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5" />
                                      {(courseDetails?.hours ?? 150)}H
                                    </span>
                                    <span className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                      {formatCourseLevel(course.level)}
                                    </span>
                                 </div>
                              </div>
                              <h3 className="text-xl font-black mb-2 text-emerald-100 group-hover:text-emerald-400 transition-colors">
                                {getLocalizedTitle(course)}
                              </h3>
                              <p className="text-sm text-slate-500 mb-6">{course.subject}</p>
                              
                              <div className="mt-auto">
                                 <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-black uppercase text-emerald-600">{lang.toUpperCase() === 'FR' ? 'Statut' : 'Status'}</span>
                                    <span className="text-[9px] font-black text-emerald-500">100% {lang.toUpperCase() === 'FR' ? 'Terminé' : 'Completed'}</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                                    <div className="h-full bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.6)]" style={{ width: '100%' }} />
                                 </div>

                                 {/* Time spent indicator card */}
                                 <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider mb-6 w-full">
                                   <span className="flex items-center gap-1">
                                     <Clock className="w-3.5 h-3.5 text-slate-500" />
                                     {lang === 'FR' ? 'Temps passé :' : 'Time spent:'} <strong className="text-white">{progressService.getLessonTimeForCourse(course.slug)}m</strong>
                                   </span>
                                   <span>
                                     {lang === 'FR' ? 'Prévu :' : 'Expected:'} <strong className="text-slate-400">{(courseDetails?.hours ?? 150)}h</strong>
                                   </span>
                                 </div>
                                 
                                 {/* Continue/Review button at bottom of completed module */}
                                 <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-550 group-hover:text-emerald-400 transition-colors">
                                       {lang.toUpperCase() === 'FR' ? 'Revoir le cours' : 'Review Course'}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                 </div>
                              </div>
                           </div>
                         </Link>
                       );
                     })}
                   </div>
                </section>
              )}

              {activeCourses.length === 0 && completedCourses.length === 0 && (
                <div className="p-16 border border-slate-850 rounded-[48px] bg-slate-900/10 text-center max-w-2xl mx-auto my-12 backdrop-blur-3xl shadow-xl">
                  <Book className="w-16 h-16 text-slate-650 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-white mb-3">
                    {lang === 'FR' ? 'Votre curriculum est vide' : 'Your curriculum is empty'}
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    {lang === 'FR' 
                      ? 'Parcourez notre catalogue premium et commencez votre premier parcours de formation auto-dirigé dès aujourd\'hui.'
                      : 'Explore our premium catalog and kick off your first self-directed learning quest today.'}
                  </p>
                  <Link href="/catalog" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg transition-all inline-block hover:scale-105 active:scale-95">
                    {lang === 'FR' ? 'Parcourir le catalogue' : 'Explore Catalog'}
                  </Link>
                </div>
              )}
            </>
          );
        })()}

        {/* ACHIEVEMENTS GALLERY */}
        <section className="mt-20">
           <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-amber-500">
              <Trophy className="w-6 h-6 text-amber-500 animate-bounce" /> {lang === 'FR' ? "Galerie des Succès" : "Achievements Gallery"}
           </h2>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
             {achievements.map((ach) => {
               const isEarned = earnedIds.includes(ach.id);
               const badge = BADGE_LIBRARY.find(b => b.id === ach.icon) || { iconName: 'Award', gradient: 'from-blue-500 to-indigo-500' };
               const IconComponent = (Icons as any)[badge.iconName] || Icons.Award;

               return (
                 <div 
                   key={ach.id}
                   className={`p-6 border rounded-[32px] flex flex-col items-center text-center transition-all ${
                     isEarned 
                       ? 'bg-slate-900/50 border-blue-500/30 shadow-xl shadow-blue-500/5' 
                       : 'bg-slate-950/20 border-slate-800/40 opacity-40 hover:opacity-60'
                   }`}
                 >
                   <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${isEarned ? badge.gradient : 'from-slate-800 to-slate-900'} flex items-center justify-center text-white mb-4 shadow-lg`}>
                     <IconComponent className="w-6 h-6" />
                   </div>
                   <h4 className="text-sm font-black text-slate-200 mb-1 line-clamp-1">{ach.name}</h4>
                   <p className="text-[10px] text-slate-500 mb-3 leading-tight line-clamp-2">{ach.description}</p>
                   <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                     isEarned 
                       ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                       : 'bg-slate-800/40 border-slate-700/30 text-slate-500'
                   }`}>
                     {isEarned ? (lang === 'FR' ? 'Déverrouillé' : 'Unlocked') : ach.threshold}
                   </span>
                 </div>
               );
             })}
           </div>
        </section>
      </div>

      {/* INTERMEDIATE CURRICULUM DRILL-DOWN MODAL */}
      <AnimatePresence>
        {selectedCurriculumForDrillDown && (() => {
          const childIds = selectedCurriculumForDrillDown.childCourses || [];
          const childDetails = childIds.map((cid: number) => {
            const matched = courses.find(c => c.id === cid) || {};
            const activeMod = progress?.activeModules?.find((m: any) => m.id === cid);
            const prog = activeMod ? activeMod.progress : (cid === 7 ? 80 : cid === 8 ? 25 : 0);
            return {
              id: cid,
              title: matched.title || `Course Module ${cid}`,
              subject: matched.subject || 'Mathematics',
              level: matched.level || 'L1',
              slug: matched.slug || '',
              progress: prog,
              hours: matched.ects ? matched.ects * 25 : 150
            };
          });

          const avgProgress = childDetails.length > 0
            ? Math.round(childDetails.reduce((sum: number, c: any) => sum + c.progress, 0) / childDetails.length)
            : 0;

          const getCoursePath = (c: any) => {
            const slug = c.slug;
            if (slug === 'classical-mechanics' || slug === 'Classical_Mechanics' || c.id === 1) {
              return '/L1/Physics/Classical_Mechanics/introduction';
            }
            if (slug === 'quantum-physics' || slug === 'Physique_Test_L2' || c.id === 2) {
              return '/L2/Physics/Physique_Test_L2/introduction';
            }
            if (slug === 'cell-biology' || slug === 'Biologie_Test' || c.id === 3) {
              return '/L1/Biology/Cell_Biology/introduction';
            }
            if (slug === 'molecular-genetics' || slug === 'Biologie_Test_L1' || c.id === 4) {
              return '/L1/Biology/Biologie_Test_L1/introduction';
            }
            if (slug === 'constitutional-law' || slug === 'Droit_Test' || c.id === 5) {
              return '/L1/Law/Droit_Test/introduction';
            }
            if (slug === 'Maths_Test' || c.id === 7) {
              return '/L1/Mathematics/Maths_Test/introduction';
            }
            if (slug === 'Maths_Test_L1' || c.id === 8) {
              return '/L1/Mathematics/Maths_Test_L1/introduction';
            }
            if (slug === 'Statistics' || c.id === 11) {
              return '/L1/Mathematics/Statistics/introduction';
            }
            return '/catalog';
          };

          return (
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                className="w-full max-w-3xl bg-slate-900 border border-violet-500/30 rounded-[40px] shadow-2xl overflow-hidden text-slate-200"
              >
                {/* Header */}
                <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-violet-950/20 via-slate-900 to-slate-950/40 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Icons.GraduationCap className="w-8 h-8 text-violet-400" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 block mb-1">
                        {lang === 'FR' ? 'CURRICULUM MULTI-COURS EN COURS' : 'ACTIVE MULTI-COURSE CURRICULUM'}
                      </span>
                      <h3 className="text-2xl font-black text-white leading-tight">
                        {selectedCurriculumForDrillDown.title}
                      </h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCurriculumForDrillDown(null)}
                    className="p-3 bg-slate-950 hover:bg-slate-800 text-slate-500 hover:text-white rounded-2xl border border-slate-800 cursor-pointer transition-colors"
                  >
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                  {/* Overview description */}
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {selectedCurriculumForDrillDown.description}
                  </p>

                  {/* Dynamic Progress Grid */}
                  <div className="p-8 bg-slate-950/40 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-center gap-8">
                    {/* Circle Progress */}
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" className="stroke-slate-800 fill-none" strokeWidth="6" />
                        <circle 
                          cx="48" 
                          cy="48" 
                          r="40" 
                          className="stroke-violet-500 fill-none" 
                          strokeWidth="6" 
                          strokeDasharray={251.2} 
                          strokeDashoffset={251.2 - (251.2 * avgProgress) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xl font-black text-white">{avgProgress}%</span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <h4 className="text-sm font-black text-slate-200">
                        {lang === 'FR' ? 'Progression Globale du Curriculum' : 'Global Curriculum Progression'}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {lang === 'FR'
                          ? `Ce parcours intègre ${childDetails.length} cours complémentaires. Vous validez l'ensemble du curriculum en terminant chaque étape.`
                          : `This roadmap integrates ${childDetails.length} academic courses. You complete the curriculum by mastering each milestone.`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Child Course List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {lang === 'FR' ? 'Modules et Étapes' : 'Milestones & Course Modules'}
                    </h4>

                    <div className="space-y-3">
                      {childDetails.map((cc: any, idx: number) => {
                        return (
                          <div 
                            key={cc.id} 
                            className="p-6 bg-slate-950/20 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-violet-500/20 transition-all"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-[8px] font-black text-slate-400 rounded">
                                  {cc.level}
                                </span>
                                <span className="px-2 py-0.5 bg-violet-955/30 border border-violet-500/10 text-[8px] font-black text-violet-400 rounded">
                                  {lang === 'FR' ? `Étape ${idx + 1}` : `Milestone ${idx + 1}`}
                                </span>
                              </div>
                              <h5 className="text-sm font-black text-white">{cc.title}</h5>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                {cc.subject} • {cc.hours}h expected
                              </p>
                            </div>

                            {/* Micro Progress and jump button */}
                            <div className="flex items-center gap-6 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                              <div className="text-right">
                                <span className="text-xs font-black text-violet-400 block mb-1">{cc.progress}%</span>
                                <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-violet-500" style={{ width: `${cc.progress}%` }} />
                                </div>
                              </div>

                              <Link 
                                href={getCoursePath(cc)}
                                onClick={() => setSelectedCurriculumForDrillDown(null)}
                                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/10 hover:scale-105"
                              >
                                {lang === 'FR' ? 'Accéder' : 'Jump In'}
                                <Icons.ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* 🔮 DOUBLE-SAFEGUARD GLASSMORPHIC OPT-OUT MODAL */}
      <AnimatePresence>
        {abandonTarget && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-red-500/30 rounded-[40px] shadow-2xl p-10 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-4 text-red-500 mb-6">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                  <Icons.AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 block mb-1">
                    {lang === 'FR' ? 'CONFIRMATION DE DÉSINSCRIPTION' : 'DISENROLLMENT CONFIRMATION'}
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {lang === 'FR' ? 'Abandonner le module ?' : 'Abandon Module?'}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                {lang === 'FR' 
                  ? `Êtes-vous absolument sûr de vouloir abandonner "${abandonTarget.title || (lang === 'FR' ? 'ce cours' : 'this course')}" ? Votre progression locale sur ce module sera réinitialisée, mais vos points de maîtrise globaux et succès restent pleinement préservés.`
                  : `Are you absolutely sure you want to abandon "${abandonTarget.title || (lang === 'FR' ? 'ce cours' : 'this course')}"? Your local progress on this module will be reset, but your global mastery points and achievements remain fully secure.`}
              </p>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setAbandonTarget(null)}
                  className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-800 transition-all cursor-pointer"
                >
                  {lang === 'FR' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleOptOut(abandonTarget.id);
                    setAbandonTarget(null);
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-900/30 hover:scale-102 transition-all cursor-pointer"
                >
                  {lang === 'FR' ? 'Confirmer' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

     <Footer />
   </div>
 );
}
