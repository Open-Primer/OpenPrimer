import * as Icons from 'lucide-react';
import { Book } from 'lucide-react';
import { DISMISS_RECOMMENDATION_LABEL } from './curriculumAuditHelpers';
import React from 'react';
import Link from 'next/link';
import { Sparkles, Star, Clock, GraduationCap, ChevronRight, Bookmark, X, BookOpen } from 'lucide-react';
import { formatCourseLevel } from '@/lib/translations';

interface RecommendedSectionProps {
  progress?: any;
  getRecommendations?: () => any[];
  navigateToCourseDirect?: (c: any) => Promise<void>;
  recommendations: any[];
  lang: string;
  upperLang: string;
  t: any;
  bookmarks: number[];
  toggleBookmark: (id: number, e: React.MouseEvent) => void;
  handleDismissRecommendation: (id: number) => void;
  handleCourseClick: (c: any) => void;
  enrollInRecommended: (c: any) => void;
  setSelectedEnrollCourse: (c: any) => void;
  isCourseNew: (c: any) => boolean;
  getLocalizedTitle: (c: any, lang: string) => string;
  getLocalizedSubject: (subj: string) => string;
  getLocalizedCourseDescription: (c: any, lang: string) => string;
  getCoursePath: (c: any) => string;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  progress = {},
  getRecommendations = () => [],
  navigateToCourseDirect = async (c: any) => handleCourseClick(c),
  recommendations,
  lang,
  upperLang,
  t,
  bookmarks,
  toggleBookmark,
  handleDismissRecommendation,
  handleCourseClick,
  enrollInRecommended,
  setSelectedEnrollCourse,
  isCourseNew,
  getLocalizedTitle,
  getLocalizedSubject,
  getLocalizedCourseDescription,
  getCoursePath
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <>
          {/* RECOMMENDED NEXT STEPS (POURSUITES D'ÉTUDES) */}
          {progress?.activeModules && progress?.activeModules.length > 0 && (() => {
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
                            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-all cursor-pointer z-30"
                            title={DISMISS_RECOMMENDATION_LABEL[upperLang] || DISMISS_RECOMMENDATION_LABEL.EN}
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
                                      <span className="px-2.5 py-1 bg-slate-800 border border-slate-750 rounded-lg text-[8px] font-black uppercase text-slate-400 tracking-wider">
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
                              {getLocalizedTitle(recCourse, lang)}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4 flex-1 leading-relaxed line-clamp-3 overflow-hidden text-ellipsis">
                              {getLocalizedCourseDescription(recCourse, lang)}
                            </p>

                            <div className="flex items-center gap-2 pt-6 border-t border-slate-800/50 mt-auto w-full">
                              {/* 1. Main Action Button: Poursuivre / Continuer / Commencer */}
                              <button 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  await navigateToCourseDirect(recCourse);
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


    </>
  );
};
