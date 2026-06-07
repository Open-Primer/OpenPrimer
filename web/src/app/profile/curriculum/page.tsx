"use client";

import React, { useState, useEffect } from 'react';
import { TopNav, UI_STRINGS, Footer, getLocalizedLabel, formatCourseLevel } from '@/components/RefinedUI';
import * as Icons from 'lucide-react';
import { GraduationCap, Book, Star, Clock, Award, ChevronRight, Brain, Sparkles, ShieldCheck, Bookmark, Trophy, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dbService, BADGE_LIBRARY, progressService } from '@/lib/db';
import { EnrollmentModal } from '@/components/modals/EnrollmentModal';

export default function CurriculumPage() {
  const router = useRouter();
  const { language: lang, setLanguage: setLang } = useLanguage();
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
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<any | null>(null);
  const [dismissedRecIds, setDismissedRecIds] = useState<number[]>([]);

  useEffect(() => {
    const dismissed = localStorage.getItem('op_dismissed_recommendations');
    if (dismissed) {
      try {
        setDismissedRecIds(JSON.parse(dismissed));
      } catch (e) {}
    }
  }, []);

  const handleDismissRecommendation = (id: number) => {
    const updated = [...dismissedRecIds, id];
    setDismissedRecIds(updated);
    localStorage.setItem('op_dismissed_recommendations', JSON.stringify(updated));
  };

  const getLocalizedCourseDescription = (c: any) => {
    if (!c) return '';
    const code = (lang || 'EN').toUpperCase();
    return c.translations?.[code]?.description || c.description || '';
  };

  const isCourseNew = (course: any) => progressService.isNewCourse(course.created_at);

  const handleCourseClick = (c: any) => {
    if (c && c.languages && c.languages.length > 0) {
      const currentLangLower = lang.toLowerCase();
      const supportsCurrentLang = c.languages.some((l: string) => l.toLowerCase() === currentLangLower);
      if (!supportsCurrentLang) {
        const newLang = c.languages[0].toUpperCase();
        setLang(newLang);
      }
    }
  };
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [selectedCurriculumForDrillDown, setSelectedCurriculumForDrillDown] = useState<any | null>(null);
  const [abandonTarget, setAbandonTarget] = useState<any | null>(null);

  const getCoursePath = (c: any) => {
    const slug = c.slug;
    if (!slug) return '/catalog';
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
    const cleanSubject = c.subject ? c.subject.replace(/\s+/g, '_') : 'General';
    return `/${c.level || 'L1'}/${cleanSubject}/${c.slug}/introduction`;
  };

  const getLocalizedTitle = (c: any) => {
    return dbService.getLocalizedCourseTitle(c, lang);
  };

  const getLocalizedSubject = (subj: string) => {
    if (!subj) return '';
    let key = subj.toLowerCase().replace(/\s+/g, '_');
    if (key === 'mathematics') key = 'math';
    return t[key] || subj;
  };

  const getRecommendations = () => {
    if (!progress?.activeModules || progress.activeModules.length === 0) {
      return [];
    }
    const activeModSlugs = progress.activeModules.map((m: any) => m.slug) || [];
    const completedSlugs = progress.activeModules.filter((m: any) => m.progress === 100).map((m: any) => m.slug) || [];

    // Collect unique languages of the user's current enrolled courses
    const activeLangs = new Set<string>();
    progress.activeModules.forEach((m: any) => {
      const cd = courses.find((c: any) => c.slug === m.slug || c.id === m.id);
      if (cd && cd.languages) {
        cd.languages.forEach((l: string) => activeLangs.add(l.toLowerCase()));
      }
    });

    // Candidates = all courses except already active/enrolled ones and dismissed ones
    const candidates = courses.filter((c: any) => {
      if (activeModSlugs.includes(c.slug)) return false;
      if (dismissedRecIds.includes(c.id)) return false;
      // Ensure the course supports at least one of the active languages (no fallback)
      if (!c.languages || c.languages.length === 0) return false;
      return c.languages.some((l: string) => activeLangs.has(l.toLowerCase()));
    });

    // Apply smart subject matching
    let result: any[] = [];
    if (completedSlugs.includes('Classical_Mechanics') || completedSlugs.includes('classical-mechanics')) {
      result = candidates.filter((c: any) => c.slug === 'quantum-physics' || c.slug === 'Physique_Test_L2' || c.slug === 'Calculus_I');
    } else if (completedSlugs.includes('Cell_Biology') || completedSlugs.includes('cell-biology') || completedSlugs.includes('Biologie_Test')) {
      result = candidates.filter((c: any) => c.slug === 'molecular-genetics' || c.slug === 'Biologie_Test_L1');
    }

    if (result.length === 0) {
      // Default to standard starting recommendations in the user's active languages
      result = candidates.filter((c: any) => 
        c.slug === 'Classical_Mechanics' || c.slug === 'classical-mechanics' || 
        c.slug === 'Biologie_Test' || c.slug === 'cell-biology' || 
        c.slug === 'Droit_Test' || c.slug === 'constitutional-law'
      );
    }

    // If still nothing, return the first few eligible candidates
    if (result.length === 0) {
      result = candidates;
    }

    return result.slice(0, 2);
  };

  const enrollInRecommended = async (course: any) => {
    const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('op_user_profile') : null;
    const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('op_session') === 'true' : false;
    let userId = 'u1';
    
    if (loggedIn && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (e) {}
    }

    await dbService.enrollInCourse(userId, course.id);
    
    // Reload user progress from database/cache
    const { data: progressData } = await dbService.getUserProgress(userId, lang);
    setProgress(progressData);

    // Update locally enrolledIds
    const newEnrolled = progressData?.activeModules ? progressData.activeModules.map((m: any) => m.id) : [];
    setEnrolledIds(newEnrolled);
    
    // Dispatch progress updated event
    window.dispatchEvent(new Event('op_progress_updated'));
  };

  const [showTutorModal, setShowTutorModal] = useState(false);
  const [activeTutorId, setActiveTutorId] = useState('socratic');
  const [tutors, setTutors] = useState<any[]>([]);


  const getActiveTutorName = () => {
    const code = (lang || 'EN').toUpperCase();
    const tMatch = tutors.find(t => t.id === activeTutorId);
    if (!tMatch) return 'Socratic Coach';
    return tMatch.translations?.[code]?.name || tMatch.name || activeTutorId;
  };

  const handleSelectTutor = async (id: string) => {
    localStorage.setItem('op_active_tutor_personality', id);
    setActiveTutorId(id);
    
    // Sync with database if connected
    const savedProfile = localStorage.getItem('op_user_profile');
    const loggedIn = localStorage.getItem('op_session') === 'true';
    let userId = 'u1';
    
    if (loggedIn && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (e) {}
    }

    if (loggedIn && savedProfile) {
      try {
        const { supabase } = await import('@/lib/supabase');
        if (userId && userId !== 'u1') {
          await supabase
            .from('profiles')
            .update({ tutor_choice: id })
            .eq('id', userId);
          console.log(`Tutor choice updated in Supabase: ${id}`);
        }
      } catch (e) {
        console.error("Error updating tutor choice in Supabase:", e);
      }
    }
    
    // Notify all components of the active tutor change
    window.dispatchEvent(new Event('op_active_tutor_changed'));
    
    // Reload user progress immediately to update the pedagogical summary card in real-time!
    const { data: progressData } = await dbService.getUserProgress(userId, lang);
    setProgress(progressData);
  };

  useEffect(() => {
    async function loadProgress() {
      const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('op_user_profile') : null;
      const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('op_session') === 'true' : false;
      
      if (!loggedIn) {
        router.push('/login');
        return;
      }

      let userId = 'u1';
      
      if (loggedIn && savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          if (profile.id) userId = profile.id;
        } catch (e) {
          console.error("Failed to parse user profile for curriculum dashboard:", e);
        }
      }

      const { data: progressData } = await dbService.getUserProgress(userId, lang);
      setProgress(progressData);
      const { data: coursesData } = await dbService.getAllCourses();
      if (coursesData) setCourses(coursesData);
      
      const { data: achs } = await dbService.getAchievements();
      if (achs) setAchievements(achs);

      // Load tutor personalities dynamically from DB / mock
      const { data: tutorData } = await dbService.getTutorPersonalities();
      if (tutorData && tutorData.length > 0) setTutors(tutorData);
      
      const earned = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('op_earned_achievements') || '[]') : [];
      setEarnedIds(earned);

      // Compute enrolled IDs + curriculum revision date from Supabase fetched activeModules
      const ids: number[] = progressData?.activeModules ? progressData.activeModules.map((m: any) => m.id) : [];
      setEnrolledIds(ids);
      const revDate = progressService.getCurriculumLastRevision(ids);
      setCurriculumRevision(revDate);

      setLoading(false);
    }
    loadProgress();

    // Load bookmarks
    const savedBookmarks = localStorage.getItem('op_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    // Load active tutor
    setActiveTutorId(localStorage.getItem('op_active_tutor_personality') || 'socratic');

    // Load initial reading mode and define dynamic header buttons listener
    const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
    setReadingMode(savedMode);

    (window as any).setReadingMode = (mode: string) => {
      setReadingMode(mode);
      localStorage.setItem('op_reading_mode', mode);
    };
  }, [lang]);


  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('op_bookmarks', JSON.stringify(newBookmarks));
  };

  const handleOptOut = async (id: number) => {
    const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('op_user_profile') : null;
    const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('op_session') === 'true' : false;
    let userId = 'u1';
    
    if (loggedIn && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (e) {}
    }

    await dbService.abandonCourse(userId, id);

    // Reload user progress from database/cache
    const { data: progressData } = await dbService.getUserProgress(userId, lang);
    setProgress(progressData);

    // Update locally enrolledIds
    const newEnrolled = progressData?.activeModules ? progressData.activeModules.map((m: any) => m.id) : [];
    setEnrolledIds(newEnrolled);

    // Dispatch progress updated event
    window.dispatchEvent(new Event('op_progress_updated'));
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

  const hasCoursesInOtherLangs = progress?.activeModules ? progress.activeModules.some((course: any) => {
    const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
    if (!courseDetails || !courseDetails.languages || courseDetails.languages.length === 0) return false;
    return !courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase());
  }) : false;

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

        {hasCoursesInOtherLangs && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-br from-amber-600/10 via-slate-900/40 to-slate-955 border border-amber-500/20 rounded-[32px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Globe className="w-24 h-24 text-amber-400" />
            </div>
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                <Globe className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                  {t.curriculum_lang_warning_title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {t.curriculum_lang_warning_desc.replace('{lang}', lang.toUpperCase())}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI PEDAGOGICAL SUMMARY */}
        {progress.activeModules && progress.activeModules.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-10 bg-gradient-to-br from-blue-600/10 via-slate-900/40 to-slate-950 border border-blue-500/20 rounded-[60px] relative overflow-hidden ai-summary-card"
          >
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Brain className="w-32 h-32 text-blue-400" />
             </div>
             <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-3">
                     <Sparkles className="w-4 h-4 animate-pulse" /> {t.tutor_summary}
                  </h3>
                  <button 
                    onClick={() => setShowTutorModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] z-20 self-start sm:self-auto"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>
                      {t.tutor}: {getActiveTutorName()}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
                <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-200 max-w-3xl italic">
                   "{progress.aiSummary}"
                </p>
             </div>
          </motion.section>
        )}

        {/* STATS GRID */}
        {progress.activeModules && progress.activeModules.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">

            {/* 🔥 Study Streak */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-orange-500/30 transition-all">
              <div className="text-3xl mb-4">🔥</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
                {t.study_streak}
              </p>
              <p className="text-3xl font-black text-white">
                {progress.studyStreakDays ?? 0}
                <span className="text-base text-slate-500 font-bold ml-2">
                  {(progress.studyStreakDays ?? 0) === 1 ? t.day : t.days}
                </span>
              </p>
              <p className="text-[9px] text-slate-600 mt-2 font-medium">
                {(progress.studyStreakDays ?? 0) >= 7
                  ? (lang === 'FR' ? '🏆 Série impressionnante !' : lang === 'ES' ? '🏆 ¡Racha impresionante!' : lang === 'DE' ? '🏆 Beeindruckende Serie!' : lang === 'ZH' ? '🏆 令人惊叹的连续学习天数！' : '🏆 Impressive streak!')
                  : (progress.studyStreakDays ?? 0) >= 3
                  ? (lang === 'FR' ? '⚡ Continue comme ça !' : lang === 'ES' ? '⚡ ¡Sigue así!' : lang === 'DE' ? '⚡ Weiter so!' : lang === 'ZH' ? '⚡ 继续保持！' : '⚡ Keep it up!')
                  : (lang === 'FR' ? 'Reviens chaque jour pour une série !' : lang === 'ES' ? '¡Vuelve a diario para crear una racha!' : lang === 'DE' ? 'Kommen Sie täglich wieder, um eine Serie aufzubauen!' : lang === 'ZH' ? '每天回来学习以保持连续天数！' : 'Come back daily to build a streak!')}
              </p>
            </div>

            {/* ⭐ Mastery Points — always grows */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-violet-500/30 transition-all">
              <Sparkles className="w-8 h-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
                {t.mastery_points}
              </p>
              <p className="text-3xl font-black text-white">
                {progress.masteryPoints ?? 0}
                <span className="text-base text-slate-500 font-bold ml-2">pt{(progress.masteryPoints ?? 0) !== 1 ? 's' : ''}</span>
              </p>
              <p className="text-[9px] font-black uppercase tracking-wider mt-2 text-violet-400">
                {(progress.masteryPoints ?? 0) >= 50 ? t.mastery_master : (progress.masteryPoints ?? 0) >= 25 ? t.mastery_expert : (progress.masteryPoints ?? 0) >= 10 ? t.mastery_scholar : t.mastery_apprentice}
              </p>
            </div>

            {/* ⏱ Total Study Hours */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-emerald-500/30 transition-all">
              <Clock className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{t.learning_time}</p>
              <p className="text-3xl font-black text-white">{progress.learningTime || "0h 0m"}</p>
              <p className="text-[9px] text-slate-600 mt-2 font-medium">
                {(progress.totalMinutes ?? 0) >= 600
                  ? (lang === 'FR' ? '📖 Lecteur assidu' : lang === 'ES' ? '📖 Lector dedicado' : lang === 'DE' ? '📖 Engagierter Leser' : lang === 'ZH' ? '📖 专心致志的读者' : '📖 Dedicated reader')
                  : (progress.totalMinutes ?? 0) >= 120
                  ? (lang === 'FR' ? '✨ Belle progression' : lang === 'ES' ? '✨ Gran progreso' : lang === 'DE' ? '✨ Toller Fortschritt' : lang === 'ZH' ? '✨ 极大进步' : '✨ Great progress')
                  : (lang === 'FR' ? 'Chaque minute compte !' : lang === 'ES' ? '¡Cada minute cuenta!' : lang === 'DE' ? 'Jede Minute zählt!' : lang === 'ZH' ? '每一分钟都至关重要！' : 'Every minute counts!')}
              </p>
            </div>

            {/* 📚 Courses Mastered */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-blue-500/30 transition-all">
              <GraduationCap className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
                {t.courses_mastered}
              </p>
              <p className="text-3xl font-black text-white">{progress.completedCount ?? 0}</p>
              <p className="text-[9px] text-slate-555 mt-2 font-medium flex items-center gap-1">
                <span className="text-blue-400 font-black">{progress.inProgressCount ?? 0}</span>
                &nbsp;{t.in_progress_of}
                &nbsp;<span className="text-slate-400 font-black">{progress.activeModules?.length ?? 0}</span>
                &nbsp;{t.enrolled}
              </p>
            </div>
          </div>
        )}

        {(() => {
          const activeCoursesAll = progress.activeModules ? progress.activeModules.filter((c: any) => c.progress < 100) : [];
          const completedCoursesAll = progress.activeModules ? progress.activeModules.filter((c: any) => c.progress === 100) : [];

          const activeCourses = activeCoursesAll;
          const completedCourses = completedCoursesAll;

          return (
            <>
              {activeCourses.length > 0 && (
                <section aria-label={t.active_modules}>
                   <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
                      <Book className="w-6 h-6 text-blue-500" /> {t.active_modules}
                   </h2>
                   <div className="grid md:grid-cols-2 gap-8" role="list">
                     {activeCourses.map((course: any) => {
                       const courseDetails = courses.find((cd: any) => cd.slug === course.slug || cd.id === course.id);
                       const isCurr = courseDetails?.isCurriculum || course.isCurriculum;
                       
                       let ratingCount = courseDetails?.ratingCount || 0;
                       let averageRating = courseDetails?.averageRating || 0;
                       let totalHours = courseDetails?.hours || 150;

                       if (isCurr && courseDetails?.childCourses && courseDetails.childCourses.length > 0) {
                         let sumHours = 0;
                         let sumWeightedRating = 0;
                         let sumRatingCount = 0;
                         courseDetails.childCourses.forEach((cId: number) => {
                           const child = courses.find((c: any) => c.id === cId);
                           if (child) {
                             const childHours = child.hours || 150;
                             const childRating = child.averageRating || 3.4;
                             sumHours += childHours;
                             sumWeightedRating += childRating * childHours;
                             sumRatingCount += child.ratingCount || 12;
                           }
                         });
                         totalHours = sumHours > 0 ? sumHours : totalHours;
                         averageRating = sumHours > 0 ? sumWeightedRating / sumHours : averageRating;
                         ratingCount = sumRatingCount > 0 ? sumRatingCount : ratingCount;
                       }
                       
                       // Check if this course is a child of any enrolled curriculum and if it is multilingual
                       const enrolledCurricula = activeCoursesAll.filter((c: any) => {
                         const cd = courses.find((x: any) => x.id === c.id);
                         return cd?.isCurriculum || c.isCurriculum;
                       }).map((c: any) => courses.find((x: any) => x.id === c.id)).filter(Boolean);

                       const parentCurriculum = enrolledCurricula.find((curr: any) => curr?.childCourses?.includes(course.id));
                       const isMultilingualParent = parentCurriculum && parentCurriculum.languages && parentCurriculum.languages.length > 1;
                       const isMandatoryChild = parentCurriculum && 
                         (!parentCurriculum.optionalCourses || !parentCurriculum.optionalCourses.includes(course.id));
                       const courseLang = courseDetails?.languages?.[0] || 'en';

                       const cardContent = (
                          <div 
                            role="listitem" 
                            aria-label={`${course.title}, ${getLocalizedSubject(course.subject)}, ${course.progress}% ${t.completed}`}
                            className={`p-8 bg-slate-900/40 border ${isCurr ? 'border-violet-500/30 hover:border-violet-400/50 shadow-violet-500/5 bg-gradient-to-br from-violet-955/5 via-slate-900/40 to-slate-950/40' : 'border-slate-800 hover:border-blue-500/50'} rounded-[48px] transition-all shadow-2xl flex flex-col h-full relative overflow-hidden`}
                          >
                              <div className="flex justify-between items-center mb-6 gap-2 w-full">
                                 <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 flex-shrink-0">
                                    {isCurr ? <GraduationCap className="w-6 h-6 text-violet-400" /> : <Book className="w-6 h-6" />}
                                 </div>
                                 <div className="flex gap-2 items-center flex-1 justify-end flex-wrap">
                                    {isCurr ? (
                                      <div className="flex gap-2 items-center flex-wrap">
                                        <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 flex items-center gap-1">
                                          <Icons.Layers className="w-3 h-3 text-violet-400" />
                                          Curriculum
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} reviews`}>
                                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                          {averageRating > 0 ? averageRating.toFixed(1) : "4.8"} ({ratingCount > 0 ? ratingCount : 12})
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1">
                                          <Clock className="w-3.5 h-3.5" />
                                          {totalHours}H
                                        </span>
                                      </div>
                                    ) : (
                                      <>
                                        {courseDetails?.languages && courseDetails.languages.length > 0 && !courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase()) && (
                                           <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-1">
                                             <Icons.Globe className="w-3 h-3" />
                                             {courseDetails.languages.join(', ').toUpperCase()}
                                           </span>
                                         )}
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
                                      aria-pressed={bookmarks.includes(course.id)}
                                      title={bookmarks.includes(course.id) 
                                        ? (lang === 'FR' ? 'Supprimer des favoris' 
                                           : lang === 'ES' ? 'Quitar de favoritos' 
                                           : lang === 'DE' ? 'Aus Lesezeichen entfernen' 
                                           : lang === 'ZH' ? '从收藏夹中移除' 
                                           : 'Remove bookmark') 
                                        : (lang === 'FR' ? 'Sauvegarder ce cours' 
                                           : lang === 'ES' ? 'Guardar este curso' 
                                           : lang === 'DE' ? 'Diesen Kurs speichern' 
                                           : lang === 'ZH' ? '收藏此课程' 
                                           : 'Save this course')}
                                      className={`p-2 rounded-xl transition-all ${bookmarks.includes(course.id) ? 'text-blue-400 bg-blue-400/10' : 'text-slate-700 hover:text-slate-400 hover:bg-slate-800'}`}
                                    >
                                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(course.id) ? 'fill-current' : ''}`} />
                                    </button>
                                    {!isCurr && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setSelectedEnrollCourse(courseDetails || course);
                                        }}
                                        title={t.presentation_sheet}
                                        className="p-2 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 transition-all cursor-pointer flex items-center justify-center"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                      </button>
                                    )}

                                    {isMandatoryChild ? (
                                      <div
                                        title={lang === 'FR' ? "Cours obligatoire du curriculum (abandon impossible)" : "Mandatory curriculum course (cannot disenroll)"}
                                        className="p-2 rounded-xl text-slate-500 bg-slate-950/30 border border-slate-800 flex items-center justify-center cursor-not-allowed group/tooltip relative"
                                      >
                                        <Icons.Lock className="w-4 h-4 text-slate-655" />
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setAbandonTarget(courseDetails || course);
                                        }}
                                        title={t.abandon}
                                        className="p-2 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer flex items-center justify-center"
                                      >
                                        <Icons.Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                    <span className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                       {formatCourseLevel(course.level, lang)}
                                    </span>
                                 </div>
                              </div>
                              <h3 className="text-xl font-black mb-2 group-hover:text-blue-400 transition-colors">
                                {getLocalizedTitle(courseDetails || course)}{isMultilingualParent ? ` (${courseLang.toUpperCase()})` : ''}
                              </h3>
                              <p className="text-sm text-slate-500 mb-6">{getLocalizedSubject(course.subject)}</p>
                              
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
                                  {t.time_spent} <strong className="text-white">{progressService.getLessonTimeForCourse(course.slug)}m</strong>
                                </span>
                                <span>
                                  {t.expected_time} <strong className="text-slate-400">{(courseDetails?.hours ?? (isCurr ? 300 : 150))}h</strong>
                                </span>
                              </div>

                              <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center mt-auto">
                                 <span className={`text-[9px] font-black uppercase tracking-widest ${isCurr ? 'text-violet-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                                    {isCurr ? t.manage_curriculum : t.continue_course}
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
                          <Link 
                            key={course.id} 
                            href={getCoursePath(courseDetails || course)} 
                            onClick={() => handleCourseClick(courseDetails || course)}
                            className="group"
                          >
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
                      <Award className="w-6 h-6 text-emerald-500 animate-pulse" /> {getLocalizedLabel('completed_modules', lang)}
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

                       // Check if this course is a child of any enrolled curriculum and if it is multilingual
                       const enrolledCurricula = (progress.activeModules || []).filter((c: any) => {
                         const cd = courses.find((x: any) => x.id === c.id);
                         return cd?.isCurriculum || c.isCurriculum;
                       }).map((c: any) => courses.find((x: any) => x.id === c.id)).filter(Boolean);

                       const parentCurriculum = enrolledCurricula.find((curr: any) => curr?.childCourses?.includes(course.id));
                       const isMultilingualParent = parentCurriculum && parentCurriculum.languages && parentCurriculum.languages.length > 1;
                       const courseLang = courseDetails?.languages?.[0] || 'en';

                       return (
                          <Link 
                            key={course.id} 
                            href={getCoursePath(course)} 
                            onClick={() => handleCourseClick(courseDetails || course)}
                            className="group"
                          >
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
                                    {courseDetails?.languages && courseDetails.languages.length > 0 && !courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase()) && (
                                       <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-1">
                                         <Icons.Globe className="w-3 h-3" />
                                         {courseDetails.languages.join(', ').toUpperCase()}
                                       </span>
                                     )}
                                     <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} reviews`}>
                                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                      {averageRating > 0 ? averageRating.toFixed(1) : "3.4"} ({ratingCount > 0 ? ratingCount : 12})
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5" />
                                      {(courseDetails?.hours ?? 150)}H
                                    </span>
                                    <button
                                       type="button"
                                       onClick={(e) => {
                                         e.preventDefault();
                                         e.stopPropagation();
                                         setSelectedEnrollCourse(courseDetails || course);
                                       }}
                                       title={t.presentation_sheet}
                                       className="p-2 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 transition-all cursor-pointer flex items-center justify-center mr-1"
                                     >
                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                     </button>

                                    <span className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                      {formatCourseLevel(course.level, lang)}
                                    </span>
                                 </div>
                              </div>
                              <h3 className="text-xl font-black mb-2 text-emerald-100 group-hover:text-emerald-400 transition-colors">
                                {getLocalizedTitle(courseDetails || course)}{isMultilingualParent ? ` (${courseLang.toUpperCase()})` : ''}
                              </h3>
                              <p className="text-sm text-slate-500 mb-6">{getLocalizedSubject(course.subject)}</p>
                              
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
                                     {t.time_spent} <strong className="text-white">{progressService.getLessonTimeForCourse(course.slug)}m</strong>
                                   </span>
                                   <span>
                                     {t.expected_time} <strong className="text-slate-400">{(courseDetails?.hours ?? 150)}h</strong>
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
                    {t.empty_curriculum_title}
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    {t.empty_curriculum_desc}
                  </p>
                  <Link href="/catalog" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg transition-all inline-block hover:scale-105 active:scale-95">
                    {t.empty_curriculum_btn}
                  </Link>
                </div>
              )}
            </>
          );
        })()}

          {/* RECOMMENDED NEXT STEPS (POURSUITES D'ÉTUDES) */}
          {progress.activeModules && progress.activeModules.length > 0 && (() => {
            const recommendations = getRecommendations();
            if (recommendations.length === 0) return null;
            
            return (
              <section className="mt-20 p-8 rounded-[48px] bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-slate-950/20 border border-blue-500/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-black flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                        <svg className="w-6 h-6 text-blue-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        {t.recommended_next_steps}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {t.recommended_next_steps_desc}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {recommendations.map((recCourse: any) => {
                      return (
                        <div 
                          key={recCourse.id}
                          className="group block h-full relative"
                        >
                          {/* Absolute positioned close/dismiss button on each card */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDismissRecommendation(recCourse.id);
                            }}
                            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-850 flex items-center justify-center transition-all cursor-pointer z-30"
                            title={lang === 'FR' ? "Masquer cette recommandation" : "Dismiss recommendation"}
                          >
                            <Icons.X className="w-4 h-4" />
                          </button>

                          <div 
                            onClick={() => setSelectedEnrollCourse(recCourse)}
                            className="p-8 bg-slate-900/40 border border-slate-880/50 rounded-[40px] hover:border-blue-500/50 transition-all shadow-2xl hover:shadow-blue-600/10 flex flex-col h-full backdrop-blur-xl relative overflow-hidden cursor-pointer"
                          >
                            
                            {/* Corner ribbon: NEW takes priority over REVISED */}
                            {(() => {
                              const isNew = isCourseNew(recCourse);
                              const isRecentlyRevised = !isNew &&
                                recCourse.last_revision_date &&
                                (Date.now() - new Date(recCourse.last_revision_date).getTime()) < 30 * 24 * 60 * 60 * 1000;
                              if (isNew) return (
                                <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                                  <div className="absolute top-6 -left-8 w-[150px] bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 -rotate-45 shadow-xl border-y border-white/20 select-none">
                                    {t.new_badge || 'New'}
                                  </div>
                                </div>
                              );
                              if (isRecentlyRevised) return (
                                <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                                  <div className="absolute top-6 -left-8 w-[150px] bg-gradient-to-r from-emerald-600 to-teal-400 text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 -rotate-45 shadow-xl border-y border-white/20 select-none">
                                    {t.revised_badge || 'Revised'}
                                  </div>
                                </div>
                              );
                              return null;
                            })()}

                            {(() => {
                              const ratingVal = recCourse.averageRating ?? 0;
                              const countVal = recCourse.ratingCount ?? 0;
                              return (
                                <div className="flex justify-between items-start mb-6 w-full gap-4">
                                  {recCourse.isCurriculum ? (
                                    <div className="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform flex-shrink-0" title={t.complete_curriculum || "Complete Curriculum"}>
                                      <GraduationCap className="w-6 h-6" />
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0">
                                      <Book className="w-6 h-6" />
                                    </div>
                                  )}
                                  <div className="flex flex-col items-end gap-2 flex-1 mr-8">
                                    {/* 1st row: badges */}
                                    <div className="flex gap-2 items-center flex-wrap justify-end">
                                      {/* Course / Curriculum Differentiating Badge */}
                                      {recCourse.isCurriculum ? (
                                        <span className="px-2.5 py-1 bg-violet-950/40 border border-violet-900/30 rounded-lg text-[8px] font-black uppercase text-violet-400 tracking-wider">
                                          🎓 {t.curriculum || 'Curriculum'}
                                        </span>
                                      ) : (
                                        <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-900/30 rounded-lg text-[8px] font-black uppercase text-blue-400 tracking-wider">
                                          📖 {t.course || 'Course'}
                                        </span>
                                      )}
                                      {/* Unified gold star rating badge */}
                                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 flex items-center gap-1.5" title={`${ratingVal.toFixed(1)} / 5 — ${countVal} ${t.reviews || 'reviews'}`}>
                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                        {ratingVal.toFixed(1)} ({countVal})
                                      </span>
                                      {/* Expected duration chip */}
                                      <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-900/30 rounded-lg text-[8px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1" title={(t.expected_learning_hours || '{hours} expected learning hours').replace('{hours}', String(recCourse.hours || (recCourse.ects ? recCourse.ects * 25 : 150)))}>
                                        <Clock className="w-3 h-3 text-blue-400" />
                                        {recCourse.hours || (recCourse.ects ? recCourse.ects * 25 : 150)}h
                                      </span>
                                      {/* Level badge */}
                                      <span className="px-2.5 py-1 bg-slate-850 border border-slate-750 rounded-lg text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                        {formatCourseLevel(recCourse.level, lang)}
                                      </span>
                                    </div>
                                    
                                    {/* 2nd row: action buttons (Course Sheet, Bookmark) */}
                                    <div className="flex gap-2 items-center mt-1">
                                      {/* Course Presentation Sheet (always visible) */}
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setSelectedEnrollCourse(recCourse);
                                        }}
                                        className="h-8 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[8px] font-black uppercase tracking-widest"
                                        title={t.course_sheet || "Course Sheet"}
                                      >
                                        <Book className="w-3 h-3" />
                                        <span>{t.course_sheet || "Course Sheet"}</span>
                                      </button>

                                      {/* Bookmark */}
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          toggleBookmark(recCourse.id, e);
                                        }}
                                        title={bookmarks.includes(recCourse.id) ? (t.remove_favorites || 'Remove bookmark') : (t.save_course || 'Save this course')}
                                        className={`w-8 h-8 border rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                                          bookmarks.includes(recCourse.id)
                                            ? 'text-blue-400 bg-blue-400/10 border-blue-500/20'
                                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                        }`}
                                      >
                                        <Bookmark className={`w-3 h-3 ${bookmarks.includes(recCourse.id) ? 'fill-current' : ''}`} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                            
                            <h3 className="text-xl font-black mb-3 group-hover:text-blue-400 transition-colors">
                              {getLocalizedTitle(recCourse)}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4 flex-1 leading-relaxed line-clamp-3 overflow-hidden text-ellipsis">
                              {getLocalizedCourseDescription(recCourse)}
                            </p>

                            <div className="flex items-center gap-2 pt-6 border-t border-slate-800/50 mt-auto w-full">
                              {/* 1. Main Action Button: Poursuivre / Continuer / Commencer */}
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  window.location.href = `/${recCourse.level}/${recCourse.subject}/${recCourse.slug}/introduction`;
                                }}
                                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest text-center transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Icons.Play className="w-3 h-3 fill-current" />
                                <span className="truncate">{t.start_learning || 'Start learning'}</span>
                              </button>

                              {/* 2. Enroll Button */}
                              <button 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  await enrollInRecommended(recCourse);
                                }}
                                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Icons.Plus className="w-3 h-3" />
                                <span className="truncate">{t.enroll_label || 'Enroll'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })()}

        {/* ACHIEVEMENTS GALLERY */}
        {(() => {
          const earnedAchievements = achievements.filter(ach => earnedIds.includes(ach.id));
          const filteredAchievements = earnedAchievements;

          if (earnedAchievements.length === 0) return null;

          return (
            <section className="mt-20">
               <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-amber-500">
                  <Trophy className="w-6 h-6 text-amber-500 animate-bounce" /> {t.achievements_gallery}
               </h2>
               {filteredAchievements.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                   {filteredAchievements.map((ach) => {
                     const badge = BADGE_LIBRARY.find(b => b.id === ach.icon) || { iconName: 'Award', gradient: 'from-blue-500 to-indigo-500' };
                     const IconComponent = (Icons as any)[badge.iconName] || Icons.Award;

                     return (
                       <div 
                         key={ach.id}
                         className="p-6 border rounded-[32px] flex flex-col items-center text-center transition-all bg-slate-900/50 border-blue-500/30 shadow-xl shadow-blue-500/5"
                       >
                         <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center text-white mb-4 shadow-lg`}>
                           <IconComponent className="w-6 h-6" />
                         </div>
                         <h4 className="text-sm font-black text-slate-200 mb-1 line-clamp-1">{ach.translations?.[lang.toUpperCase()]?.name || ach.name}</h4>
                         <p className="text-[10px] text-slate-500 mb-3 leading-tight line-clamp-2">{ach.translations?.[lang.toUpperCase()]?.description || ach.description}</p>
                         <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border bg-blue-500/10 border-blue-500/20 text-blue-400">
                           {t.unlocked}
                         </span>
                       </div>
                     );
                   })}
                 </div>
               ) : (
                 <div className="p-10 border rounded-[32px] flex flex-col items-center text-center bg-slate-900/25 border-blue-500/15 shadow-xl shadow-blue-500/5">
                   <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                     <Trophy className="w-8 h-8 opacity-30" />
                   </div>
                   <p className="text-xs font-semibold text-slate-400 max-w-md leading-relaxed">
                     {(t as any).no_achievements_earned}
                   </p>
                 </div>
               )}
            </section>
          );
        })()}
      </div>

      {/* INTERMEDIATE CURRICULUM DRILL-DOWN MODAL */}
      <AnimatePresence>
        {selectedCurriculumForDrillDown && (() => {
          const childIds = selectedCurriculumForDrillDown.childCourses || [];
          
          let ratingCount = selectedCurriculumForDrillDown.ratingCount || 0;
          let averageRating = selectedCurriculumForDrillDown.averageRating || 0;
          let totalHours = selectedCurriculumForDrillDown.hours || 0;
          const isMultilingualParent = selectedCurriculumForDrillDown.languages && selectedCurriculumForDrillDown.languages.length > 1;

          if (childIds.length > 0) {
            let sumHours = 0;
            let sumWeightedRating = 0;
            let sumRatingCount = 0;
            childIds.forEach((cId: number) => {
              const child = courses.find(c => c.id === cId);
              if (child) {
                const childHours = child.hours || 150;
                const childRating = child.averageRating || 3.4;
                sumHours += childHours;
                sumWeightedRating += childRating * childHours;
                sumRatingCount += child.ratingCount || 12;
              }
            });
            totalHours = sumHours > 0 ? sumHours : totalHours;
            averageRating = sumHours > 0 ? sumWeightedRating / sumHours : averageRating;
            ratingCount = sumRatingCount > 0 ? sumRatingCount : ratingCount;
          }

          const childDetails = childIds.map((cid: number) => {
            const matched = courses.find(c => c.id === cid) || {};
            const activeMod = progress?.activeModules?.find((m: any) => m.id === cid);
            const prog = activeMod ? activeMod.progress : 0;
            const isOptional = matched.isOptional || (selectedCurriculumForDrillDown.optionalCourses && selectedCurriculumForDrillDown.optionalCourses.includes(cid));
            const hours = matched.ects ? matched.ects * 25 : 150;
            const langCode = matched.languages?.[0] || 'en';
            return {
              id: cid,
              title: getLocalizedTitle(matched) || matched.title || `Course Module ${cid}`,
              subject: matched.subject || 'Mathematics',
              level: matched.level || 'L1',
              slug: matched.slug || '',
              progress: activeMod ? prog : 0,
              hours: hours,
              isOptional,
              isEnrolled: !!activeMod,
              langCode
            };
          });

          const optionalCoursesList = childDetails.filter((c: any) => c.isOptional);
          const enrolledOptionalCount = optionalCoursesList.filter((c: any) => c.isEnrolled).length;
          const minOptionalCount = selectedCurriculumForDrillDown.minOptionalCount || 0;
          const isCompliant = enrolledOptionalCount >= minOptionalCount;

          // Filter only mandatory courses plus enrolled optional ones to calculate average progress
          const coursesForProgress = childDetails.filter((c: any) => !c.isOptional || c.isEnrolled);
          const avgProgress = coursesForProgress.length > 0
            ? Math.round(coursesForProgress.reduce((sum: number, c: any) => sum + c.progress, 0) / coursesForProgress.length)
            : 0;

          const getCoursePath = (c: any) => {
            const slug = c.slug;
            if (!slug) return '/catalog';
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
            const cleanSubject = c.subject ? c.subject.replace(/\s+/g, '_') : 'General';
            return `/${c.level || 'L1'}/${cleanSubject}/${c.slug}/introduction`;
          };

          return (
            <div 
              onClick={() => setSelectedCurriculumForDrillDown(null)} 
              className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xl cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl bg-slate-900 border border-violet-500/30 rounded-[40px] shadow-2xl overflow-hidden text-slate-200 cursor-default"
              >
                {/* Header */}
                <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-violet-955/20 via-slate-900 to-slate-950/40 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Icons.GraduationCap className="w-8 h-8 text-violet-400" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 block mb-1">
                        {t.active_multi_course_curriculum}
                      </span>
                      <h3 className="text-2xl font-black text-white leading-tight">
                        {selectedCurriculumForDrillDown.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} reviews`}>
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {averageRating > 0 ? averageRating.toFixed(1) : "4.8"} ({ratingCount > 0 ? ratingCount : 12})
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {totalHours}H
                        </span>
                      </div>
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
                        {t.global_curriculum_progression}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {t.curriculum_integration_desc.replace('{count}', String(childDetails.length))}
                      </p>
                    </div>
                  </div>

                  {minOptionalCount > 0 && (
                    <div className={`p-6 border rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl ${
                      isCompliant 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${
                          isCompliant 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                        }`}>
                          {isCompliant ? <Icons.ShieldCheck className="w-5 h-5" /> : <Icons.AlertTriangle className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-black leading-tight text-white">
                            {lang === 'FR' ? 'Choix des options' : 'Elective Course Choices'}
                          </h4>
                          <p className="text-xs opacity-85 mt-1 font-semibold leading-normal">
                            {lang === 'FR' 
                              ? `${enrolledOptionalCount} sur ${minOptionalCount} cours optionnel(s) choisi(s) — ${isCompliant ? 'Conforme' : 'Sélection incomplète'}`
                              : `${enrolledOptionalCount} of ${minOptionalCount} optional course(s) chosen — ${isCompliant ? 'Compliant' : 'Selection required'}`}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border self-start sm:self-auto ${
                        isCompliant 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>
                        {isCompliant 
                          ? (lang === 'FR' ? 'Conforme' : 'Compliant') 
                          : (lang === 'FR' ? 'Requis' : 'Required')}
                      </span>
                    </div>
                  )}

                  {/* Child Course List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {t.milestones_and_modules}
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
                                  {t.milestone_step.replace('{step}', String(idx + 1))}
                                </span>
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                                  cc.isOptional 
                                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' 
                                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                                }`}>
                                  {cc.isOptional 
                                    ? (lang === 'FR' ? 'Optionnel' : 'Elective') 
                                    : (lang === 'FR' ? 'Obligatoire' : 'Mandatory')}
                                </span>
                              </div>
                              <h5 className="text-sm font-black text-white">
                                {cc.title}{isMultilingualParent && cc.langCode ? ` (${cc.langCode.toUpperCase()})` : ''}
                              </h5>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                {getLocalizedSubject(cc.subject)} • {cc.hours}h {lang === 'FR' ? 'prévues' : 'expected'}
                              </p>
                            </div>

                            {/* Micro Progress and jump button */}
                            <div className="flex items-center gap-6 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                              {cc.isEnrolled ? (
                                <div className="text-right">
                                  <span className="text-xs font-black text-violet-400 block mb-1">{cc.progress}%</span>
                                  <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-500" style={{ width: `${cc.progress}%` }} />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                  {lang === 'FR' ? 'Non inscrit' : 'Not enrolled'}
                                </span>
                              )}

                              <div className="flex items-center gap-2">
                                {cc.isOptional && (
                                  <button
                                    onClick={async () => {
                                      if (cc.isEnrolled) {
                                        await handleOptOut(cc.id);
                                      } else {
                                        await enrollInRecommended(cc);
                                      }
                                    }}
                                    className={`px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border cursor-pointer ${
                                      cc.isEnrolled 
                                        ? 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10' 
                                        : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
                                    }`}
                                  >
                                    {cc.isEnrolled 
                                      ? (lang === 'FR' ? 'Retirer' : 'Remove') 
                                      : (lang === 'FR' ? 'Choisir' : 'Choose')}
                                  </button>
                                )}

                                <button
                                  onClick={async () => {
                                    if (!cc.isEnrolled) {
                                      await enrollInRecommended(cc);
                                    }
                                    handleCourseClick(cc);
                                    setSelectedCurriculumForDrillDown(null);
                                    router.push(getCoursePath(cc));
                                  }}
                                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/10 hover:scale-105 cursor-pointer"
                                >
                                  {t.jump_in}
                                  <Icons.ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
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
          <div 
            onClick={() => setAbandonTarget(null)} 
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xl cursor-pointer"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl p-10 relative overflow-hidden cursor-default"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-4 text-red-500 mb-6">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                  <Icons.AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 block mb-1">
                    {t.disenroll_confirm_title_sub}
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {t.disenroll_confirm_title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                {t.disenroll_confirm_desc.replace('{title}', abandonTarget.title || (lang === 'FR' ? 'ce cours' : 'this course'))}
              </p>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setAbandonTarget(null)}
                  className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-800 transition-all cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleOptOut(abandonTarget.id);
                    setAbandonTarget(null);
                  }}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-900/30 hover:scale-102 transition-all cursor-pointer"
                >
                  {t.confirm}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TUTOR SELECTOR MODAL */}
      <AnimatePresence>
        {showTutorModal && (
          <div onClick={() => setShowTutorModal(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xl cursor-pointer">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] cursor-default"
            >
              <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <Brain className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">
                      {t.select_ai_tutor}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {t.tutor_modal_desc}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTutorModal(false)}
                  className="p-3 text-slate-500 hover:text-white rounded-2xl hover:bg-slate-850 transition-all cursor-pointer"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-slate-900/50">
                {tutors.map(tOption => {
                  const code = (lang || 'EN').toUpperCase();
                  const localizedName = tOption.translations?.[code]?.name || tOption.name;
                  const localizedDesc = tOption.translations?.[code]?.desc ||
                    tOption.translations?.[code]?.prompt?.slice(0, 120) + '...' ||
                    tOption.prompt?.slice(0, 120) + '...';
                  const isSelected = tOption.id === activeTutorId;
                  // Emoji fallback map
                  const EMOJI_MAP: Record<string, string> = {
                    socratic: '💬', direct: '⚡', gamified: '🚀', historical: '📚',
                    feynman: '💡', proof: '📐', engineer: '🔧', debater: '🗣️',
                    analogy_alchemist: '🧪', cognitive_catalyst: '🧠',
                    heuristic_explorer: '🔭', diamond_age: '💎',
                  };
                  const emoji = EMOJI_MAP[tOption.id] || '🤖';
                  return (
                    <div 
                      key={tOption.id}
                      onClick={() => handleSelectTutor(tOption.id)}
                      className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-6 group relative overflow-hidden ${
                        isSelected 
                          ? 'bg-blue-600/10 border-blue-500/60 shadow-lg shadow-blue-500/5' 
                          : 'bg-slate-950/30 border-slate-850 hover:border-slate-700 hover:bg-slate-950/50'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                          isSelected ? 'bg-blue-600/20 scale-105' : 'bg-slate-900 group-hover:scale-105'
                        }`}>
                          {emoji}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-white tracking-wide flex items-center gap-2">
                            {localizedName}
                            {isSelected && (
                              <span className="px-2.5 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-[8px] font-black uppercase tracking-wider">
                                {t.active}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed max-w-md">
                            {localizedDesc}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                          : 'border-slate-850 group-hover:border-slate-750 text-transparent group-hover:text-slate-655'
                      }`}>
                        <Icons.Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-8 border-t border-slate-800 bg-slate-950/40 text-center">
                <p className="text-xs text-slate-500 font-semibold italic">
                  {t.tutor_modal_footer}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Syllabus Enrollment Drawer Modal */}
      <AnimatePresence>
        {selectedEnrollCourse && (
          <EnrollmentModal
            course={selectedEnrollCourse}
            onClose={() => setSelectedEnrollCourse(null)}
            lang={lang}
            isLoggedIn={true}
            enrolledIds={enrolledIds}
            courses={courses}
            showEnrollActions={true}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
            onSelectCourse={(c) => setSelectedEnrollCourse(c)}
            onEnroll={async (activeC) => {
              const targetCourse = activeC || selectedEnrollCourse;
              let userId = 'u1';
              const savedProfile = localStorage.getItem('op_user_profile');
              if (savedProfile) {
                try {
                  const p = JSON.parse(savedProfile);
                  if (p.id) userId = p.id;
                } catch (err) {}
              }
              await dbService.enrollInCourse(userId, targetCourse.id);
              setEnrolledIds(prev => [...prev, targetCourse.id]);
              
              setEnrollmentSuccess(true);
              const courseToOpen = targetCourse;
              setSelectedEnrollCourse(null);
              window.dispatchEvent(new Event('op_progress_updated'));
              
              setTimeout(() => {
                setEnrollmentSuccess(false);
                window.location.href = `/${courseToOpen.level}/${courseToOpen.subject}/${courseToOpen.slug}/introduction`;
              }, 2000);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {enrollmentSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 px-6 py-3.5 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-2xl flex items-center gap-3 z-[12000] backdrop-blur-xl"
          >
            <Icons.CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-100 tracking-wide">
              {lang.toUpperCase() === 'FR' ? 'Inscription Réussie !' : 'Enrollment Successful!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

     <Footer />
   </div>
 );
}
