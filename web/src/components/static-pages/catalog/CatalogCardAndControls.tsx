"use client";

import React from 'react';
import {
  Search, Sparkles, Book, Clock, Star, CheckCircle2, GraduationCap, X, Bookmark, Play, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCourseLevel } from '../../RefinedUI';
import { dbService, progressService } from '@/lib/db';

const ENROLL_SUCCESS_STRINGS: Record<string, string> = {
  EN: 'Enrollment Successful!',
  FR: 'Inscription Réussie !',
  ES: '¡Inscripción exitosa!',
  DE: 'Einschreibung erfolgreich!',
  ZH: '报名成功！',
  PT: 'Inscrição bem-sucedida!',
  AR: 'تم التسجيل بنجاح!',
  HI: 'नामांकन सफल!',
  UR: 'اندراج کامیاب!'
};

export const CatalogFilterControls = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  showNewOnly,
  setShowNewOnly,
  subjectFilter,
  setSubjectFilter,
  sortBy,
  setSortBy,
  lang,
  t
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterType: 'All' | 'Course' | 'Curriculum';
  setFilterType: (t: 'All' | 'Course' | 'Curriculum') => void;
  showNewOnly: boolean;
  setShowNewOnly: (v: boolean) => void;
  subjectFilter: string;
  setSubjectFilter: (s: string) => void;
  sortBy: 'popularity' | 'validations';
  setSortBy: (s: 'popularity' | 'validations') => void;
  lang: string;
  t: any;
}) => (
  <div className="flex flex-col gap-4 items-stretch md:items-end w-full md:w-auto mt-2">
    <div className="flex flex-wrap items-center gap-3 justify-start md:justify-end w-full">
      <div className="relative group w-full md:w-80">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.search} 
          className="bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-blue-500/50 transition-all w-full text-white" 
        />
        {searchQuery && (
          <button 
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-600 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title={t.clear_search}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl shrink-0">
        {[
          { key: 'All',        label: { EN: 'All',      FR: 'Tout',         ES: 'Todo',    DE: 'Alle',       ZH: '全部',   IT: 'Tutti',      PT: 'Tudo',        AR: 'الكل',    HI: 'सभी',       UR: 'تمام' } },
          { key: 'Course',     label: { EN: 'Courses',  FR: 'Cours',        ES: 'Cursos',  DE: 'Kurse',      ZH: '课程',   IT: 'Corsi',      PT: 'Cursos',      AR: 'الدورات',  HI: 'पाठ्यक्रम',  UR: 'کورسز' } },
          { key: 'Curriculum', label: { EN: 'Curricula',FR: 'Curriculums',  ES: 'Planes',  DE: 'Lehrpläne',  ZH: '课程体系', IT: 'Curriculum', PT: 'Currículos',  AR: 'المناهج',  HI: 'पाठ्यचर्या', UR: 'نصاب' } }
        ].map(opt => {
          const active = filterType === opt.key;
          const labelText = opt.label[lang.toUpperCase() as keyof typeof opt.label] || opt.label.EN;
          return (
            <button 
              key={opt.key}
              type="button"
              onClick={() => setFilterType(opt.key as any)}
              className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
            >
              {labelText}
            </button>
          );
        })}
      </div>
      
      <button 
        type="button"
        onClick={() => setShowNewOnly(!showNewOnly)}
        className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer ${showNewOnly ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
      >
        <Sparkles className={`w-4 h-4 ${showNewOnly ? 'animate-pulse text-white' : ''}`} />
        <span className="hidden sm:inline">
          {t.new_only || 'New Only'}
        </span>
      </button>
    </div>

    <div className="flex flex-wrap items-center gap-3 justify-start md:justify-end w-full">
      <button 
        type="button"
        onClick={() => setSubjectFilter(subjectFilter === 'Saved' ? 'All' : 'Saved')}
        className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer ${subjectFilter === 'Saved' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
      >
        <Bookmark className={`w-4 h-4 ${subjectFilter === 'Saved' ? 'fill-current' : ''}`} />
        <span className="hidden sm:inline">{t.saved}</span>
      </button>

      <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl shrink-0">
        {[
          { key: 'popularity',  label: { EN: 'Popularity', FR: 'Popularité',  ES: 'Popularidad', DE: 'Beliebtheit', ZH: '最热',  IT: 'Popolarità', PT: 'Popularidade', AR: 'الشعبية', HI: 'लोकप्रियता', UR: 'مقبولیت' } },
          { key: 'validations', label: { EN: 'Graduates',  FR: 'Diplômés',    ES: 'Graduados',   DE: 'Absolventen', ZH: '结业数', IT: 'Diplomati',    PT: 'Graduados',    AR: 'الخريجون', HI: 'स्नातक',      UR: 'فارغ التحصیل' } }
        ].map(opt => {
          const active = sortBy === opt.key;
          const labelText = opt.label[lang.toUpperCase() as keyof typeof opt.label] || opt.label.EN;
          return (
            <button 
              key={opt.key}
              type="button"
              onClick={() => setSortBy(opt.key as any)}
              className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${active ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
            >
              {labelText}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

export const CatalogCourseCard = ({
  course,
  sortedCourses,
  enrolledIds,
  userProgress,
  bookmarks,
  lang,
  t,
  isLoggedIn,
  isCourseNew,
  getLocalizedCourseTitle,
  getLocalizedCourseDescription,
  navigateToCourse,
  setSelectedEnrollCourse,
  toggleBookmark,
  setEnrolledIds,
  setEnrollmentSuccess,
  setActiveLang
}: {
  course: any;
  sortedCourses: any[];
  enrolledIds: number[];
  userProgress: any;
  bookmarks: number[];
  lang: string;
  t: any;
  isLoggedIn: boolean;
  isCourseNew: (c: any) => boolean;
  getLocalizedCourseTitle: (c: any) => string;
  getLocalizedCourseDescription: (c: any) => string;
  navigateToCourse: (c: any, redirectToSignup?: boolean) => void;
  setSelectedEnrollCourse: (c: any) => void;
  toggleBookmark: (id: number, e: React.MouseEvent) => void;
  setEnrolledIds: React.Dispatch<React.SetStateAction<number[]>>;
  setEnrollmentSuccess: (v: boolean) => void;
  setActiveLang: (l: any) => void;
}) => {
  const isEnrolled = enrolledIds.includes(course.id);
  const activeModule = userProgress?.activeModules?.find((m: any) => m.slug === course.slug || m.id === course.id || (m.title_key && course.title_key && m.title_key === course.title_key));
  
  const isBrowser = typeof window !== 'undefined';
  const localProgressMap = isBrowser ? (() => {
    try {
      return JSON.parse(localStorage.getItem('op_course_progress') || '{}');
    } catch (e) {
      return {};
    }
  })() : {};
  
  let progressPercent = 0;
  if (course.isCurriculum && course.childCourses && course.childCourses.length > 0) {
    let totalChildProgress = 0;
    let childCount = 0;
    course.childCourses.forEach((childId: number) => {
      const childCourse = sortedCourses.find(c => c.id === childId);
      if (childCourse) {
        const childActive = userProgress?.activeModules?.find((m: any) => m.slug === childCourse.slug || m.id === childCourse.id || (m.title_key && childCourse.title_key && m.title_key === childCourse.title_key));
        const childLocal = typeof localProgressMap[childCourse.slug] === 'number'
          ? localProgressMap[childCourse.slug]
          : (typeof localProgressMap[childCourse.id] === 'number' ? localProgressMap[childCourse.id] : 0);
        const childProgress = childActive ? childActive.progress : childLocal;
        totalChildProgress += childProgress;
        childCount++;
      }
    });
    progressPercent = childCount > 0 ? Math.round(totalChildProgress / childCount) : 0;
  } else {
    const localPercent = typeof localProgressMap[course.slug] === 'number' 
      ? localProgressMap[course.slug] 
      : (typeof localProgressMap[course.id] === 'number' ? localProgressMap[course.id] : 0);
    progressPercent = activeModule ? activeModule.progress : localPercent;
  }
  
  const hasStarted = course.isCurriculum ? isEnrolled : (isEnrolled || progressPercent > 0);
  const isNew = isCourseNew(course);
  const isRecentlyRevised = !isNew &&
    course.last_revision_date &&
    (Date.now() - new Date(course.last_revision_date).getTime()) < 30 * 24 * 60 * 60 * 1000;
  const ratingVal = course.averageRating ?? 0;
  const countVal = course.ratingCount ?? 0;

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div 
        onClick={() => navigateToCourse(course)}
        className="group block h-full cursor-pointer"
      >
        <div className="p-8 bg-slate-900/40 border border-slate-880/50 rounded-[40px] hover:border-blue-500/50 transition-all shadow-2xl hover:shadow-blue-600/10 flex flex-col h-full backdrop-blur-xl relative overflow-hidden">
          {isNew ? (
            <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
              <div className="absolute top-6 -left-8 w-[150px] bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 -rotate-45 shadow-xl border-y border-white/20 select-none">
                {t.new_badge || 'New'}
              </div>
            </div>
          ) : isRecentlyRevised ? (
            <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
              <div className="absolute top-6 -left-8 w-[150px] bg-gradient-to-r from-emerald-600 to-teal-400 text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 -rotate-45 shadow-xl border-y border-white/20 select-none">
                {t.revised_badge || 'Revised'}
              </div>
            </div>
          ) : null}

          <div className="flex justify-between items-start mb-6 w-full gap-4">
            {course.isCurriculum ? (
              <div className="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform flex-shrink-0" title={t.complete_curriculum || "Complete Curriculum"}>
                <GraduationCap className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0">
                <Book className="w-6 h-6" />
              </div>
            )}
            <div className="flex flex-col items-end gap-2 flex-1 mr-8">
              <div className="flex gap-2 items-center flex-wrap justify-end">
                {course.isCurriculum ? (
                  <span className="px-2.5 py-1 bg-violet-950/40 border border-violet-900/30 rounded-lg text-[8px] font-black uppercase text-violet-400 tracking-wider">
                    🎓 {t.curriculum || 'Curriculum'}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-900/30 rounded-lg text-[8px] font-black uppercase text-blue-400 tracking-wider">
                    📖 {t.course || 'Course'}
                  </span>
                )}
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 flex items-center gap-1.5" title={`${ratingVal.toFixed(1)} / 5 — ${countVal} ${t.reviews || 'reviews'}`}>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {ratingVal.toFixed(1)} ({countVal})
                </span>
                <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-900/30 rounded-lg text-[8px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1" title={(t.expected_learning_hours || '{hours} expected learning hours').replace('{hours}', String(course.hours || (course.ects ? course.ects * 25 : 150)))}>
                  <Clock className="w-3 h-3 text-blue-400" />
                  {course.hours || (course.ects ? course.ects * 25 : 150)}h
                </span>
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-750 rounded-lg text-[8px] font-black uppercase text-slate-400 tracking-wider">
                  {formatCourseLevel(course.level, lang)}
                </span>
              </div>
              
              <div className="flex gap-2 items-center mt-1">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedEnrollCourse(course);
                  }}
                  className="h-8 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[8px] font-black uppercase tracking-widest"
                  title={t.course_sheet || "Course Sheet"}
                >
                  <Book className="w-3 h-3" />
                  <span>{t.course_sheet || "Course Sheet"}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleBookmark(course.id, e);
                  }}
                  title={bookmarks.includes(course.id) ? (t.remove_favorites || 'Remove bookmark') : (t.save_course || 'Save this course')}
                  className={`w-8 h-8 border rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                    bookmarks.includes(course.id)
                      ? 'text-blue-400 bg-blue-400/10 border-blue-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Bookmark className={`w-3 h-3 ${bookmarks.includes(course.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-black mb-3 group-hover:text-blue-400 transition-colors">
            {getLocalizedCourseTitle(course)}
          </h3>
          <p className="text-sm text-slate-500 mb-4 flex-1 leading-relaxed line-clamp-3 overflow-hidden text-ellipsis">
            {getLocalizedCourseDescription(course)}
          </p>

          {hasStarted && (
            <div className="mb-6">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[8px] font-black uppercase text-slate-600">{t.progress || 'Progress'}</span>
                  <span className="text-[8px] font-black text-blue-500">{progressPercent}%</span>
               </div>
               <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" style={{ width: `${progressPercent}%` }} />
               </div>
               <div className="flex items-center justify-between text-[7px] font-bold text-slate-500 uppercase tracking-wider">
                 <span>{t.time_spent || 'Time spent:'} {progressService.getLessonTimeForCourse(course.slug)}m</span>
                 <span>{t.expected_time || 'Expected:'} {course.hours || (course.ects ? course.ects * 25 : 150)}h</span>
               </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-6 border-t border-slate-800/50 mt-auto w-full">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigateToCourse(course);
              }}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest text-center transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2"
            >
              <Play className="w-3 h-3 fill-current" />
              <span className="truncate">
                {course.isCurriculum 
                  ? (t.manage_curriculum || 'Gérer le Curriculum') 
                  : (hasStarted ? t.continue_course : t.start_learning)}
              </span>
            </button>

            {!isEnrolled && (
              <button 
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isLoggedIn) {
                    let userId = 'u1';
                    const savedProfile = localStorage.getItem('op_user_profile');
                    if (savedProfile) {
                      try {
                        const p = JSON.parse(savedProfile);
                        if (p.id) userId = p.id;
                      } catch (err) {}
                    }
                    await dbService.enrollInCourse(userId, course.id);
                    setEnrolledIds(prev => [...prev, course.id]);
                    
                    setEnrollmentSuccess(true);
                    const courseToOpen = course;
                    setSelectedEnrollCourse(null);
                    window.dispatchEvent(new Event('op_progress_updated'));
                    
                    if (courseToOpen.languages && courseToOpen.languages.length > 0) {
                      const currentLangLower = lang.toLowerCase();
                      const supportsCurrentLang = courseToOpen.languages.some((l: string) => l.toLowerCase() === currentLangLower);
                      if (!supportsCurrentLang) {
                        setActiveLang(courseToOpen.languages[0].toUpperCase());
                      }
                    }

                    setTimeout(() => {
                      setEnrollmentSuccess(false);
                      navigateToCourse(courseToOpen);
                    }, 2000);
                  } else {
                    navigateToCourse(course, true);
                  }
                }}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-770 text-white border border-emerald-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" />
                <span className="truncate">{t.enroll_label || 'Enroll'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CatalogPopups = ({
  showWelcomePopup,
  dismissWelcomePopup,
  enrollmentSuccess,
  lang,
  t
}: {
  showWelcomePopup: boolean;
  dismissWelcomePopup: () => void;
  enrollmentSuccess: boolean;
  lang: string;
  t: any;
}) => (
  <>
    <AnimatePresence>
      {showWelcomePopup && (
        <div 
          onClick={dismissWelcomePopup}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xl cursor-pointer"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden text-center cursor-default"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl" />

            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 flex items-center justify-center shadow-xl shadow-blue-500/5 mb-6">
              <GraduationCap className="w-8 h-8 text-blue-400" />
            </div>

            <h2 className="text-2xl font-black text-white mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
              {t.welcome_title || "Welcome to OpenPrimer!"}
            </h2>
            
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              {t.welcome_desc || "Your registration has been successfully validated. All that is left is to choose the courses that interest you in the catalog below to build your first personalized curriculum!"}
            </p>

            <button
              onClick={dismissWelcomePopup}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-blue-600/20 cursor-pointer"
            >
              {t.start_exploring || "Start Exploring"}
            </button>
          </motion.div>
        </div>
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
          <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-100 tracking-wide">
            {ENROLL_SUCCESS_STRINGS[lang.toUpperCase()] || ENROLL_SUCCESS_STRINGS.EN}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
