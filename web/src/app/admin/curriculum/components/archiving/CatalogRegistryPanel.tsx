"use client";

import React, { useState } from 'react';
import { Search, Layers, AlertCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LOCALIZED_POPUPS, 
  formatCourseLevelGlobal 
} from '../../strings';
import { dbService } from '@/lib/db';
import { ArchivingLevelButtons } from '../ArchivingLevelButtons';

const renderSortIndicator = (field: string, currentField: string, currentDir: 'asc' | 'desc') => {
  if (field !== currentField) return <span className="ml-1 text-slate-700 hover:text-slate-400 cursor-pointer">⇅</span>;
  return currentDir === 'asc' ? <span className="ml-1 text-emerald-400 cursor-pointer">▲</span> : <span className="ml-1 text-emerald-400 cursor-pointer">▼</span>;
};

export interface CatalogRegistryPanelProps {
  lang: 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR';
  tr: (key: string) => string;
  courses: any[];
  completions: any[];
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const CatalogRegistryPanel: React.FC<CatalogRegistryPanelProps> = ({
  lang,
  tr,
  courses,
  completions,
  loadData,
  showToast
}) => {
  const [archiveSearch, setArchiveSearch] = useState('');
  const [courseSortField, setCourseSortField] = useState('title');
  const [courseSortDir, setCourseSortDir] = useState<'asc' | 'desc'>('asc');

  const [courseArchiveTarget, setCourseArchiveTarget] = useState<any | null>(null);
  const [curriculumArchivalPending, setCurriculumArchivalPending] = useState<any | null>(null);
  const [curriculumCascadePending, setCurriculumCascadePending] = useState<any | null>(null);

  const allFilteredCourses = [...courses]
    .filter(c => c.title.toLowerCase().includes(archiveSearch.toLowerCase()) || c.subject.toLowerCase().includes(archiveSearch.toLowerCase()))
    .sort((a, b) => {
      let valA: any;
      let valB: any;

      if (courseSortField === 'isCurriculum') {
        valA = a.isCurriculum ? 1 : 0;
        valB = b.isCurriculum ? 1 : 0;
      } else if (courseSortField === 'averageRating') {
        valA = Number(a.averageRating || 0);
        valB = Number(b.averageRating || 0);
      } else if (courseSortField === 'completions') {
        valA = completions.filter(comp => 
          comp.courseId.toLowerCase() === String(a.id).toLowerCase() || 
          comp.courseId.toLowerCase() === a.slug.toLowerCase() || 
          comp.courseId.toLowerCase() === a.title.toLowerCase()
        ).length;
        valB = completions.filter(comp => 
          comp.courseId.toLowerCase() === String(b.id).toLowerCase() || 
          comp.courseId.toLowerCase() === b.slug.toLowerCase() || 
          comp.courseId.toLowerCase() === b.title.toLowerCase()
        ).length;
      } else if (courseSortField === 'versions') {
        valA = courses.filter(c => c.slug.replace(/_v\d+$/, '') === a.slug.replace(/_v\d+$/, '')).length;
        valB = courses.filter(c => c.slug.replace(/_v\d+$/, '') === b.slug.replace(/_v\d+$/, '')).length;
      } else if (courseSortField === 'languages') {
        valA = (a.languages || a.langs || []).length;
        valB = (b.languages || b.langs || []).length;
      } else {
        valA = a[courseSortField as keyof typeof a];
        valB = b[courseSortField as keyof typeof b];
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (valA < valB) return courseSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return courseSortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const displayedCourses = allFilteredCourses.slice(0, 30);
  const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;

  return (
    <>
      <div className="space-y-6 pt-6">
        <div className="h-px bg-slate-800/45" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-200">
              {tr("Curriculum Registry and Archival Control")}
              {allFilteredCourses.length > 30 && (
                <span className="text-xs font-semibold text-amber-500 ml-3 normal-case tracking-normal">
                  ({allFilteredCourses.length} results, displaying only 30)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">{tr("Search courses and archive/unarchive specific languages or entire courses instantly.")}</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input 
              type="text"
              placeholder={tr("Search courses...")}
              value={archiveSearch}
              onChange={(e) => setArchiveSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-pink-500/50 text-white placeholder-slate-655"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar rounded-3xl border border-slate-800 bg-slate-900/20 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[9px] font-black uppercase tracking-widest bg-slate-950/40">
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (courseSortField === 'title') {
                    setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setCourseSortField('title');
                    setCourseSortDir('asc');
                  }
                }}>
                  {tr("Title")} {renderSortIndicator('title', courseSortField, courseSortDir)}
                </th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (courseSortField === 'isCurriculum') {
                    setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setCourseSortField('isCurriculum');
                    setCourseSortDir('asc');
                  }
                }}>
                  {tr("Classification")} {renderSortIndicator('isCurriculum', courseSortField, courseSortDir)}
                </th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (courseSortField === 'averageRating') {
                    setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setCourseSortField('averageRating');
                    setCourseSortDir('asc');
                  }
                }}>
                  {tr("Note (Rating)")} {renderSortIndicator('averageRating', courseSortField, courseSortDir)}
                </th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (courseSortField === 'completions') {
                    setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setCourseSortField('completions');
                    setCourseSortDir('asc');
                  }
                }}>
                  {tr("Validations (Completions)")} {renderSortIndicator('completions', courseSortField, courseSortDir)}
                </th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (courseSortField === 'versions') {
                    setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setCourseSortField('versions');
                    setCourseSortDir('asc');
                  }
                }}>
                  {tr("Versions (Revisions)")} {renderSortIndicator('versions', courseSortField, courseSortDir)}
                </th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (courseSortField === 'languages') {
                    setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setCourseSortField('languages');
                    setCourseSortDir('asc');
                  }
                }}>
                  {tr("Languages")} {renderSortIndicator('languages', courseSortField, courseSortDir)}
                </th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (courseSortField === 'level') {
                    setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setCourseSortField('level');
                    setCourseSortDir('asc');
                  }
                }}>
                  {tr("Level")} {renderSortIndicator('level', courseSortField, courseSortDir)}
                </th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (courseSortField === 'archivingLevel') {
                    setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setCourseSortField('archivingLevel');
                    setCourseSortDir('asc');
                  }
                }}>
                  {tr("Archival Level Control")} {renderSortIndicator('archivingLevel', courseSortField, courseSortDir)}
                </th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (courseSortField === 'is_active') {
                    setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setCourseSortField('is_active');
                    setCourseSortDir('asc');
                  }
                }}>
                  {tr("Status")} {renderSortIndicator('is_active', courseSortField, courseSortDir)}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {displayedCourses.map(course => {
                const currentLevel = typeof course.archivingLevel === 'number' ? course.archivingLevel : 0;
                const isCurriculum = course.isCurriculum || false;
                const containingCurricula = courses.filter(c => c.isCurriculum && c.childCourses?.some((cid: any) => String(cid) === String(course.id)));
                const isInCurriculum = containingCurricula.length > 0;

                let statusLabel = tr('Active');
                let statusColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
                
                if (currentLevel === 1) {
                  statusLabel = tr('Partial');
                  statusColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
                } else if (currentLevel === 2) {
                  statusLabel = tr('Read-Only');
                  statusColor = 'bg-blue-500/10 border-blue-500/20 text-blue-400';
                } else if (currentLevel === 3) {
                  statusLabel = tr('Archived');
                  statusColor = 'bg-red-500/10 border-red-500/20 text-red-400';
                }

                return (
                  <tr key={course.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-200">
                      <div className="space-y-0.5">
                        <p className="text-sm">{course.title}</p>
                        <p className="text-[9.5px] text-slate-500 font-mono">ID: {course.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                      {isCurriculum ? (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-500 rounded-lg text-[9px] font-black uppercase text-white w-fit shadow-md shadow-violet-500/20">
                          {tr("Curriculum")}
                        </span>
                      ) : isInCurriculum ? (
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-[9px] font-black uppercase text-blue-400 w-fit">
                            {tr("In Curriculum")}
                          </span>
                          <p className="text-[9.5px] text-slate-400 font-medium leading-relaxed">
                            {containingCurricula.map(cc => cc.title).join(', ')}
                          </p>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-black uppercase text-slate-500 w-fit">
                          {tr("Standalone")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium font-mono text-center">
                      {course.averageRating ? `⭐ ${Number(course.averageRating).toFixed(1)}/5` : '⭐ N/A'}
                      {course.ratingCount ? ` (${course.ratingCount})` : ''}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium font-mono text-center">
                      {completions.filter(comp => 
                        comp.courseId.toLowerCase() === String(course.id).toLowerCase() || 
                        comp.courseId.toLowerCase() === course.slug.toLowerCase() || 
                        comp.courseId.toLowerCase() === course.title.toLowerCase()
                      ).length}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium font-mono text-center">
                      {courses.filter(c => c.slug.replace(/_v\d+$/, '') === course.slug.replace(/_v\d+$/, '')).length}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(course.languages || course.langs || []).map((l: string) => (
                          <span key={l} className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-lg text-[8px] font-black uppercase text-slate-400">{l}</span>
                        ))}
                        {!(course.languages || course.langs || []).length && <span className="text-slate-700 font-black">--</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono font-bold">
                      {formatCourseLevelGlobal(course.level, lang)}
                    </td>
                    <td className="px-6 py-4">
                      <ArchivingLevelButtons 
                        currentLevel={currentLevel}
                        lang={lang}
                        onChange={async (nextLvl) => {
                          if (isCurriculum) {
                            const targetChilds = courses.filter(c => course.childCourses?.some((cid: any) => String(cid) === String(c.id)) && (c.archivingLevel || 0) < nextLvl);
                            if (targetChilds.length > 0) {
                              setCurriculumCascadePending({ curriculum: course, nextLevel: nextLvl, childCourses: targetChilds });
                              return;
                            }
                          }

                          const activeParents = courses.filter(c => c.isCurriculum && c.childCourses?.some((cid: any) => String(cid) === String(course.id)) && (c.archivingLevel || 0) < nextLvl);
                          if (activeParents.length > 0) {
                            setCurriculumArchivalPending({ course, nextLevel: nextLvl, parentCurricula: activeParents });
                            return;
                          }

                          if (nextLvl === 3) { setCourseArchiveTarget({ course }); return; }
                          const { error } = await dbService.setCourseArchivingLevel(course.id, nextLvl);
                          if (error) {
                            showToast(error.message || String(error), 'error');
                          } else {
                            loadData();
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className={"px-2.5 py-1 border text-[8px] font-black rounded-full uppercase tracking-wider " + statusColor}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {allFilteredCourses.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-655 italic">{tr("No courses found matching your query.")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COURSE ARCHIVE LEVEL 3 CONFIRM MODAL */}
      <AnimatePresence>
        {courseArchiveTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCourseArchiveTarget(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-800 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">{tr("Confirm Archive")}</h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed text-center">
                  {pStrings.course_confirm.replace('{title}', courseArchiveTarget.course?.title || '')}
                </p>
                <div className="flex gap-4 pt-2">
                  <button onClick={() => setCourseArchiveTarget(null)} className="flex-1 py-4 border border-slate-800 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer">
                    {pStrings.purge_badge_cancel_btn}
                  </button>
                  <button onClick={async () => {
                    const { error } = await dbService.setCourseArchivingLevel(courseArchiveTarget.course.id, 3);
                    if (error) {
                      showToast(error.message || String(error), 'error');
                    } else {
                      showToast(tr("Course permanently purged successfully"), 'success');
                    }
                    setCourseArchiveTarget(null);
                    loadData();
                  }} className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/10 cursor-pointer">
                    {pStrings.purge_badge_confirm_btn}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CURRICULUM ARCHIVAL WARNING & CONFIRMATION MODAL */}
      <AnimatePresence>
        {curriculumArchivalPending && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCurriculumArchivalPending(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-800 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-amber-500 animate-pulse" />
                <h3 className="text-lg font-black text-amber-400 uppercase tracking-widest">
                  {tr("Active Dependency")}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pStrings.dependency_warning_1
                    .replace('{title}', curriculumArchivalPending.parentCurricula.map((c: any) => c.title).join(', '))
                    .replace('{level}', String(curriculumArchivalPending.nextLevel))}
                </p>
                <p className="text-xs text-amber-500 font-bold leading-relaxed">
                  {pStrings.dependency_warning_2
                    .replace('{level}', String(curriculumArchivalPending.nextLevel))}
                </p>
                <div className="flex gap-4 pt-2">
                  <button onClick={() => setCurriculumArchivalPending(null)} className="flex-1 py-4 border border-slate-800 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer">
                    {tr("Cancel")}
                  </button>
                  <button onClick={async () => {
                    const { course, nextLevel, parentCurricula } = curriculumArchivalPending;
                    for (const curr of parentCurricula) {
                      const { error } = await dbService.setCourseArchivingLevel(curr.id, nextLevel);
                      if (error) {
                        showToast(error.message || String(error), 'error');
                        return;
                      }
                    }
                    if (nextLevel === 3) {
                      setCurriculumArchivalPending(null);
                      setCourseArchiveTarget({ course });
                      return;
                    }
                    const { error } = await dbService.setCourseArchivingLevel(course.id, nextLevel);
                    if (error) {
                      showToast(error.message || String(error), 'error');
                      return;
                    }
                    setCurriculumArchivalPending(null);
                    showToast(
                      tr("Curriculum(s) and course successfully archived"), 
                      'success'
                    );
                    loadData();
                  }} className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/10 cursor-pointer">
                    {tr("Archive All")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CURRICULUM CASCADE (OPTIONAL) ARCHIVAL MODAL */}
      <AnimatePresence>
        {curriculumCascadePending && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCurriculumCascadePending(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-violet-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-800 flex items-center gap-3">
                <Layers className="w-6 h-6 text-violet-500 animate-pulse" />
                <h3 className="text-lg font-black text-violet-400 uppercase tracking-widest">
                  {tr("Cascade Option")}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pStrings.cascade_warning_1
                    .replace('{title}', curriculumCascadePending.curriculum.title)
                    .replace('{level}', String(curriculumCascadePending.nextLevel))}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  {pStrings.cascade_warning_2
                    .replace('{count}', String(curriculumCascadePending.childCourses.length))}
                </p>
                <div className="flex flex-col gap-3 pt-2">
                  <button onClick={async () => {
                    const { curriculum, nextLevel, childCourses } = curriculumCascadePending;
                    for (const child of childCourses) {
                      const { error } = await dbService.setCourseArchivingLevel(child.id, nextLevel);
                      if (error) {
                        showToast(error.message || String(error), 'error');
                        return;
                      }
                    }
                    if (nextLevel === 3) {
                      setCurriculumCascadePending(null);
                      setCourseArchiveTarget({ course: curriculum });
                      return;
                    }
                    const { error } = await dbService.setCourseArchivingLevel(curriculum.id, nextLevel);
                    if (error) {
                      showToast(error.message || String(error), 'error');
                      return;
                    }
                    setCurriculumCascadePending(null);
                    showToast(
                      tr("Curriculum and all child courses successfully archived"), 
                      'success'
                    );
                    loadData();
                  }} className="w-full py-4 text-white font-black uppercase text-[10px] rounded-xl bg-violet-600 hover:bg-violet-550 shadow-lg shadow-violet-600/10 cursor-pointer text-center">
                    {tr("Archive Curriculum & Courses")}
                  </button>
                  
                  <button onClick={async () => {
                    const { curriculum, nextLevel } = curriculumCascadePending;
                    if (nextLevel === 3) {
                      setCurriculumCascadePending(null);
                      setCourseArchiveTarget({ course: curriculum });
                      return;
                    }
                    const { error } = await dbService.setCourseArchivingLevel(curriculum.id, nextLevel);
                    if (error) {
                      showToast(error.message || String(error), 'error');
                      return;
                    }
                    setCurriculumCascadePending(null);
                    showToast(
                      tr("Curriculum archived only (courses remain active)"), 
                      'success'
                    );
                    loadData();
                  }} className="w-full py-4 text-slate-300 font-black uppercase text-[10px] rounded-xl border border-slate-880 bg-slate-900/50 hover:bg-slate-900 cursor-pointer text-center">
                    {tr("Archive Curriculum Only")}
                  </button>

                  <button onClick={() => setCurriculumCascadePending(null)} className="w-full py-4 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-950 border border-transparent cursor-pointer text-center">
                    {tr("Cancel")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
