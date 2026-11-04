import React from 'react';
import Link from 'next/link';
import { Award, Book, Star, Clock, Bookmark, ChevronRight, GraduationCap } from 'lucide-react';
import * as Icons from 'lucide-react';
import { dbService } from '@/lib/db';
import { BADGE_LIBRARY } from '@/lib/db';
import { getAchievementTranslation } from './curriculumAuditHelpers';
import {
  COMPLETED_LABEL,
  COURSE_LABEL,
  NOT_AVAILABLE_IN_LANG,
  REMOVE_BOOKMARK_LABEL,
  SAVE_COURSE_LABEL,
  EARNED_BADGES_LABEL,
  STATUS_LABEL,
  VIEW_REVIEW_LABEL,
  REVIEW_COURSE_LABEL
} from './curriculumAuditHelpers';

interface CompletedModulesSectionProps {
  completedCourses: any[];
  courses: any[];
  progress: any;
  courseFeedbacks: any;
  bookmarks: number[];
  toggleBookmark: (id: number, e: React.MouseEvent) => void;
  getLocalizedLabel: (dict: any, lang: string) => string;
  getLocalizedSubject: (s: string) => string;
  formatCourseLevel: (l: string, lang: string) => string;
  setSelectedEnrollCourse: (c: any) => void;
  setSelectedReviewCourse: (c: any) => void;
  setIsReviewReadOnly: (v: boolean) => void;
  setShowReviewModal: (v: boolean) => void;
  setSelectedCurriculumForDrillDown: (c: any) => void;
  handleCourseClick: (c: any) => void;
  navigateToCourseDirectSafe: (c: any) => Promise<void>;
  getCourseEarnedAchievements: (id: any, slug: any) => any[];
  lang: string;
  upperLang: string;
  t: any;
}

export const CompletedModulesSection: React.FC<CompletedModulesSectionProps> = ({
  completedCourses,
  courses,
  progress,
  courseFeedbacks,
  bookmarks,
  toggleBookmark,
  getLocalizedLabel,
  getLocalizedSubject,
  formatCourseLevel,
  setSelectedEnrollCourse,
  setSelectedReviewCourse,
  setIsReviewReadOnly,
  setShowReviewModal,
  setSelectedCurriculumForDrillDown,
  handleCourseClick,
  navigateToCourseDirectSafe,
  getCourseEarnedAchievements,
  lang,
  upperLang,
  t
}) => {
  if (completedCourses.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-emerald-500">
        <Award className="w-6 h-6 text-emerald-500 animate-pulse" /> {getLocalizedLabel(COMPLETED_LABEL, lang)}
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {completedCourses.map((course: any) => {
          const getLocalizedTitle = (c: any) => {
            return dbService.getLocalizedCourseTitle(c, lang);
          };

          const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
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

          const enrolledCurricula = (progress.activeModules || []).filter((c: any) => {
            const cd = courses.find((x: any) => x.id === c.id);
            return cd?.isCurriculum || c.isCurriculum;
          }).map((c: any) => courses.find((x: any) => x.id === c.id)).filter(Boolean);

          const parentCurriculum = enrolledCurricula.find((curr: any) => curr?.childCourses?.includes(course.id));
          const isMultilingualParent = parentCurriculum && parentCurriculum.languages && parentCurriculum.languages.length > 1;
          const courseLang = courseDetails?.languages?.[0] || 'en';

          const earnedBadges = getCourseEarnedAchievements(course.id, course.slug);
          const feedback = courseFeedbacks[course.id];
          const hasReview = feedback !== undefined;

          const cardContent = (
            <div 
              role="listitem"
              aria-label={`${course.title}, ${getLocalizedSubject(course.subject)}, 100% ${t.completed}`}
              className={`p-8 bg-slate-900/40 border ${isCurr ? 'border-violet-500/30 shadow-violet-500/5 bg-gradient-to-br from-violet-955/5 via-slate-900/40 to-slate-950/20' : 'border-emerald-500/20 shadow-emerald-500/5 bg-gradient-to-br from-emerald-955/5 via-slate-900/40 to-slate-950/20'} rounded-[40px] shadow-2xl flex flex-col h-full relative overflow-hidden`}
            >
              {/* Corner Ribbon */}
              <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                <div className={`absolute top-6 -right-8 w-[150px] bg-gradient-to-r ${isCurr ? 'from-violet-600 to-fuchsia-400' : 'from-emerald-600 to-teal-400'} text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 rotate-45 shadow-xl border-y border-white/20 select-none`}>
                  {(COMPLETED_LABEL as any)[upperLang] || COMPLETED_LABEL.EN}
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 gap-2 w-full">
                <div className={`w-12 h-12 ${isCurr ? 'bg-violet-600/10 text-violet-400' : 'bg-emerald-600/10 text-emerald-400'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  {isCurr ? <GraduationCap className="w-6 h-6" /> : <Book className="w-6 h-6" />}
                </div>
                <div className="flex gap-2 items-center flex-1 justify-end flex-wrap mr-8">
                  {isCurr ? (
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 flex items-center gap-1.5 select-none">
                      <Icons.Layers className="w-3.5 h-3.5 text-violet-400" />
                      Curriculum
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1.5 select-none">
                      <Icons.BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      {(COURSE_LABEL as any)[upperLang] || COURSE_LABEL.EN}
                    </span>
                  )}

                  {!isCurr && courseDetails?.languages && courseDetails.languages.length > 0 && !courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase()) && (
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-1" title={(NOT_AVAILABLE_IN_LANG as any)[upperLang] || NOT_AVAILABLE_IN_LANG.EN}>
                      <Icons.Globe className="w-3.5 h-3.5 animate-pulse" />
                      {courseDetails.languages.join(', ').toUpperCase()}
                    </span>
                  )}

                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1.5 select-none" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} ${t.reviews}`}>
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {averageRating > 0 ? averageRating.toFixed(1) : (isCurr ? "4.8" : "3.4")} ({ratingCount > 0 ? ratingCount : (isCurr ? 24 : 12)})
                  </span>

                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1.5 select-none">
                    <Clock className="w-3.5 h-3.5" />
                    {totalHours}H
                  </span>

                  <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">
                    {formatCourseLevel(course.level, lang)}
                  </span>

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

                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(course.id, e)}
                    aria-pressed={bookmarks.includes(course.id)}
                    title={bookmarks.includes(course.id) 
                      ? ((REMOVE_BOOKMARK_LABEL as any)[upperLang] || REMOVE_BOOKMARK_LABEL.EN) 
                      : ((SAVE_COURSE_LABEL as any)[upperLang] || SAVE_COURSE_LABEL.EN)}
                    className={`p-2 border rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                      bookmarks.includes(course.id) 
                        ? 'text-blue-400 bg-blue-400/10 border-blue-500/20' 
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarks.includes(course.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h3 className={`text-xl font-black mb-2 text-white group-hover:${isCurr ? 'text-violet-400' : 'text-emerald-400'} transition-colors`}>
                {getLocalizedTitle(courseDetails || course)}{isMultilingualParent ? ` (${courseLang.toUpperCase()})` : ''}
              </h3>
              <p className="text-sm text-slate-500 mb-2">{getLocalizedSubject(course.subject)}</p>

              {earnedBadges.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-4" role="group" aria-label={(EARNED_BADGES_LABEL as any)[upperLang] || EARNED_BADGES_LABEL.EN}>
                  {earnedBadges.map((ach) => {
                    const badge = BADGE_LIBRARY.find((b: any) => b.id === ach.icon) || { iconName: 'Award', gradient: 'from-blue-500 to-indigo-500' };
                    const IconComp = (Icons as any)[badge.iconName] || Icons.Award;
                    return (
                      <div
                        key={ach.id}
                        className={`w-6 h-6 rounded-lg bg-gradient-to-br ${badge.gradient} flex items-center justify-center text-white shrink-0 shadow-sm border border-white/10`}
                        title={getAchievementTranslation(ach, 'name', lang)}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black uppercase text-slate-600">{(STATUS_LABEL as any)[upperLang] || STATUS_LABEL.EN}</span>
                  <span className={`text-[9px] font-black ${isCurr ? 'text-violet-400' : 'text-emerald-400'}`}>100% {(COMPLETED_LABEL as any)[upperLang] || COMPLETED_LABEL.EN}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
                  <div className={`h-full ${isCurr ? 'bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]' : 'bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.6)]'}`} style={{ width: '100%' }} />
                </div>
                
                <div 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedReviewCourse(courseDetails || course);
                    setIsReviewReadOnly(hasReview);
                    setShowReviewModal(true);
                  }}
                  className="pt-4 border-t border-slate-800/50 flex justify-between items-center cursor-pointer group/btn"
                >
                  <span className={`text-[9px] font-black uppercase tracking-widest text-slate-550 group-hover:${isCurr ? 'text-violet-400' : 'text-emerald-400'} transition-colors`}>
                    {hasReview 
                      ? ((VIEW_REVIEW_LABEL as any)[upperLang] || VIEW_REVIEW_LABEL.EN) 
                      : ((REVIEW_COURSE_LABEL as any)[upperLang] || REVIEW_COURSE_LABEL.EN)}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-500 group-hover:${isCurr ? 'text-violet-400' : 'text-emerald-400'} group-hover:translate-x-1 transition-all`} />
                </div>
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
  );
};
