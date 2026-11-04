import { CompletedModulesSection } from './CompletedModulesSection';
import { motion } from 'framer-motion';
import { dbService, progressService } from '@/lib/db';
import {
  COURSE_LABEL,
  MANDATORY_LABEL,
  OPTIONAL_LABEL,
  NOT_AVAILABLE_IN_LANG,
  REMOVE_BOOKMARK_LABEL,
  SAVE_COURSE_LABEL,
  MANDATORY_CURRICULUM_COURSE_LABEL,
  COMPLETED_LABEL,
  STATUS_LABEL,
  VIEW_REVIEW_LABEL,
  REVIEW_COURSE_LABEL,
  getLocalizedLabel
} from './curriculumAuditHelpers';
import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Book, Star, Clock, Award, ChevronRight, GraduationCap, Globe, BookOpen, Bookmark, Trash2 } from 'lucide-react';
import { BADGE_LIBRARY } from '@/lib/db';
import { formatCourseLevel } from '@/lib/translations';
import { getAchievementTranslation } from './curriculumAuditHelpers';

interface ActiveModulesSectionProps {
  progress: any;
  courses: any[];
  lang: string;
  upperLang: string;
  t: any;
  bookmarks: number[];
  toggleBookmark: (id: number, e: React.MouseEvent) => void;
  handleCourseClick: (c: any) => void;
  getLocalizedTitle: (c: any, lang: string) => string;
  getLocalizedSubject: (subj: string) => string;
  getLocalizedCourseDescription: (c: any, lang: string) => string;
  getCoursePath: (c: any) => string;
  getCourseEarnedAchievements: (courseId: number, courseSlug: string) => any[];
  setSelectedCurriculumForDrillDown: (c: any) => void;
  setAbandonTarget: (t: any) => void;
  setSelectedEnrollCourse: (c: any) => void;
  setSelectedReviewCourse: (c: any) => void;
  setIsReviewReadOnly: (ro: boolean) => void;
  setShowReviewModal: (show: boolean) => void;
  EARNED_BADGES_LABEL: Record<string, string>;
  courseFeedbacks?: Record<number, any>;
  navigateToCourseDirect?: (c: any) => Promise<void>;
}

export const ActiveModulesSection: React.FC<ActiveModulesSectionProps> = ({
  progress,
  courses,
  lang,
  upperLang,
  t,
  bookmarks,
  toggleBookmark,
  handleCourseClick,
  getLocalizedTitle,
  getLocalizedSubject,
  getLocalizedCourseDescription,
  getCoursePath,
  getCourseEarnedAchievements,
  setSelectedCurriculumForDrillDown,
  setAbandonTarget,
  setSelectedEnrollCourse,
  setSelectedReviewCourse,
  setIsReviewReadOnly,
  setShowReviewModal,
  EARNED_BADGES_LABEL,
  courseFeedbacks = {},
  navigateToCourseDirect
}) => {
  const navigateToCourseDirectSafe = navigateToCourseDirect || (async (c: any) => handleCourseClick(c));
  return (
    <>
        {(() => {
          const activeCoursesAll = progress?.activeModules ? progress?.activeModules.filter((c: any) => c.progress < 100) : [];
          const completedCoursesAll = progress?.activeModules ? progress?.activeModules.filter((c: any) => c.progress === 100) : [];

          const enrolledCurricula = progress?.activeModules ? progress?.activeModules.filter((m: any) => {
            const cd = courses.find((x: any) => x.id === m.id);
            return cd?.isCurriculum || m.isCurriculum;
          }) : [];
          
          const enrolledCurriculaDetails = enrolledCurricula.map((curr: any) => courses.find((cd: any) => cd.id === curr.id)).filter(Boolean);
          const curriculumChildIds = new Set<number>();
          enrolledCurriculaDetails.forEach((curr: any) => {
            if (curr.childCourses && curr.childCourses.length > 0) {
              curr.childCourses.forEach((id: number) => curriculumChildIds.add(id));
            }
          });

          const activeCourses = activeCoursesAll.filter((course: any) => {
            const courseDetails = courses.find((cd: any) => cd.slug === course.slug || cd.id === course.id);
            const isCurr = courseDetails?.isCurriculum || course.isCurriculum;
            if (isCurr) return true;
            if (curriculumChildIds.has(course.id)) return false;
            return true;
          });

          const completedCourses = completedCoursesAll.filter((course: any) => {
            const courseDetails = courses.find((cd: any) => cd.slug === course.slug || cd.id === course.id);
            const isCurr = courseDetails?.isCurriculum || course.isCurriculum;
            if (isCurr) return true;
            if (curriculumChildIds.has(course.id)) return false;
            return true;
          });

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
                       const upperLang = lang.toUpperCase();
                       
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
                            className={`p-8 bg-slate-900/40 border ${isCurr ? 'border-violet-500/30 hover:border-violet-400/50 shadow-violet-500/5 bg-gradient-to-br from-violet-955/5 via-slate-900/40 to-slate-955/20' : 'border-blue-500/20 shadow-blue-500/5 bg-gradient-to-br from-blue-955/5 via-slate-900/40 to-slate-950/20'} rounded-[40px] shadow-2xl flex flex-col h-full group relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1`}
                          >
                              <div className="flex justify-between items-center mb-6 gap-2 w-full">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isCurr ? 'bg-violet-600/10 text-violet-400' : 'bg-blue-600/10 text-blue-400'}`}>
                                    {isCurr ? <GraduationCap className="w-6 h-6 text-violet-400" /> : <Book className="w-6 h-6" />}
                                 </div>
                                 <div className="flex gap-2 items-center flex-1 justify-end flex-wrap">
                                    {/* 1. Type Badge */}
                                    {isCurr ? (
                                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 flex items-center gap-1.5 select-none">
                                        <Icons.Layers className="w-3.5 h-3.5 text-violet-400" />
                                        Curriculum
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1.5 select-none">
                                        <Icons.BookOpen className="w-3.5 h-3.5 text-blue-400" />
                                        {COURSE_LABEL[upperLang] || COURSE_LABEL.EN}
                                      </span>
                                    )}

                                    {/* Mandatory vs Optional Status Badge */}
                                    {parentCurriculum && !isCurr && (
                                      isMandatoryChild ? (
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-500 flex items-center gap-1.5 select-none shadow-[0_0_15px_rgba(245,158,11,0.05)] animate-pulse">
                                          <Icons.Lock className="w-3.5 h-3.5 text-amber-500" />
                                          {MANDATORY_LABEL[upperLang] || MANDATORY_LABEL.EN}
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-400 flex items-center gap-1.5 select-none">
                                          <Icons.Unlock className="w-3.5 h-3.5 text-slate-400" />
                                          {OPTIONAL_LABEL[upperLang] || OPTIONAL_LABEL.EN}
                                        </span>
                                      )
                                    )}

                                    {/* Multilingual / translation mismatch badge */}
                                    {!isCurr && courseDetails?.languages && courseDetails.languages.length > 0 && !courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase()) && (
                                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-1" title={NOT_AVAILABLE_IN_LANG[upperLang] || NOT_AVAILABLE_IN_LANG.EN}>
                                        <Icons.Globe className="w-3.5 h-3.5 animate-pulse" />
                                        {courseDetails.languages.join(', ').toUpperCase()}
                                      </span>
                                    )}

                                    {/* 2. Stars Rating */}
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1.5 select-none" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} ${t.reviews}`}>
                                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                      {averageRating > 0 ? averageRating.toFixed(1) : (isCurr ? "4.8" : "3.4")} ({ratingCount > 0 ? ratingCount : (isCurr ? 24 : 12)})
                                    </span>

                                    {/* 3. Volume Horaire (Hours) */}
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1.5 select-none">
                                      <Clock className="w-3.5 h-3.5" />
                                      {totalHours}H
                                    </span>

                                    {/* 4. Level Badge */}
                                    <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">
                                      {formatCourseLevel(course.level, lang)}
                                    </span>

                                    {/* 5. Syllabus Link Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedEnrollCourse(courseDetails || course);
                                      }}
                                      title={t.course_sheet}
                                      className="px-3 py-1.5 bg-slate-950/40 border border-slate-800 hover:border-slate-700 text-blue-400 hover:text-blue-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
                                    >
                                      <Icons.BookOpen className="w-3.5 h-3.5" />
                                      {t.course_sheet}
                                    </button>

                                    {/* 6. Bookmark Toggle Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => toggleBookmark(course.id, e)}
                                      aria-pressed={bookmarks.includes(course.id)}
                                      title={bookmarks.includes(course.id) 
                                        ? (REMOVE_BOOKMARK_LABEL[upperLang] || REMOVE_BOOKMARK_LABEL.EN) 
                                        : (SAVE_COURSE_LABEL[upperLang] || SAVE_COURSE_LABEL.EN)}
                                      className={`p-2 border rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                                        bookmarks.includes(course.id) 
                                          ? 'text-blue-400 bg-blue-400/10 border-blue-500/20' 
                                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                      }`}
                                    >
                                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(course.id) ? 'fill-current' : ''}`} />
                                    </button>

                                    {/* 7. Trash / Abandon Icon Button */}
                                    {isMandatoryChild ? (
                                      <div
                                        title={MANDATORY_CURRICULUM_COURSE_LABEL[upperLang] || MANDATORY_CURRICULUM_COURSE_LABEL.EN}
                                        className="p-2 rounded-xl text-slate-655 bg-slate-950/30 border border-slate-800 flex items-center justify-center cursor-not-allowed"
                                      >
                                        <Icons.Lock className="w-4 h-4" />
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
                                        className="p-2 bg-slate-950/40 border border-slate-800 hover:border-red-500/30 text-red-500 hover:text-red-400 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                      >
                                        <Icons.Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                 </div>
                              </div>
                              <h3 className="text-xl font-black mb-2 group-hover:text-blue-400 transition-colors">
                                {getLocalizedTitle(courseDetails || course, lang)}{isMultilingualParent ? ` (${courseLang.toUpperCase()})` : ''}
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
                          <div 
                            key={course.id} 
                            onClick={async () => { 
                              handleCourseClick(courseDetails || course); 
                              await navigateToCourseDirectSafe(courseDetails || course); 
                            }} 
                            className="group cursor-pointer" 
                          >
                            {cardContent}
                          </div>
                       );
                     })}
                   </div>
                </section>
              )}

              <CompletedModulesSection
                completedCourses={completedCourses}
                courses={courses}
                progress={progress}
                courseFeedbacks={courseFeedbacks}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                getLocalizedLabel={getLocalizedLabel}
                getLocalizedSubject={getLocalizedSubject}
                formatCourseLevel={formatCourseLevel}
                setSelectedEnrollCourse={setSelectedEnrollCourse}
                setSelectedReviewCourse={setSelectedReviewCourse}
                setIsReviewReadOnly={setIsReviewReadOnly}
                setShowReviewModal={setShowReviewModal}
                setSelectedCurriculumForDrillDown={setSelectedCurriculumForDrillDown}
                handleCourseClick={handleCourseClick}
                navigateToCourseDirectSafe={navigateToCourseDirectSafe}
                getCourseEarnedAchievements={getCourseEarnedAchievements}
                lang={lang}
                upperLang={upperLang}
                t={t}
              />

              {activeCourses.length === 0 && completedCourses.length === 0 && (
                <div className="p-16 border border-slate-800 rounded-[48px] bg-slate-900/10 text-center max-w-2xl mx-auto my-12 backdrop-blur-3xl shadow-xl">
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


    </>
  );
};
