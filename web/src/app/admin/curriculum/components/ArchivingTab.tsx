"use client";

import React, { useState } from 'react';
import { Database, Check, X, Search, Layers, AlertCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LOCALIZED_POPUPS, 
  formatCourseLevelGlobal 
} from '../strings';
import { dbService } from '@/lib/db';
import { ArchivingLevelButtons } from './ArchivingLevelButtons';

const renderSortIndicator = (field: string, currentField: string, currentDir: 'asc' | 'desc') => {
  if (field !== currentField) return <span className="ml-1 text-slate-700 hover:text-slate-400 cursor-pointer">⇅</span>;
  return currentDir === 'asc' ? <span className="ml-1 text-emerald-400 cursor-pointer">▲</span> : <span className="ml-1 text-emerald-400 cursor-pointer">▼</span>;
};

interface ArchivingTabProps {
  lang: 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR' | 'PT' | 'AR' | 'HI' | 'UR';
  tr: (key: string) => string;
  courses: any[];
  completions: any[];
  autoArchiveCourses: boolean;
  archiveRatingThreshold: number;
  archiveMinVotes: number;
  archiveMinRevisions: number;
  archiveDelayHours: number;
  archiveRetentionDays: number;
  updateParameter: (key: string, value: string) => Promise<void>;
  
  activeArchivalProposals: any[];
  refusedArchivals: any[];
  handleApproveArchival: (id: any) => void;
  handleRefuseArchival: (id: any) => void;
  handleDeleteRefusedArchival: (id: any) => void;
  
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const ArchivingTab: React.FC<ArchivingTabProps> = ({
  lang,
  tr,
  courses,
  completions,
  autoArchiveCourses,
  archiveRatingThreshold,
  archiveMinVotes,
  archiveMinRevisions,
  archiveDelayHours,
  archiveRetentionDays,
  updateParameter,
  activeArchivalProposals,
  refusedArchivals,
  handleApproveArchival,
  handleRefuseArchival,
  handleDeleteRefusedArchival,
  loadData,
  showToast
}) => {
  // Search & Sorting States
  const [archiveSearch, setArchiveSearch] = useState('');
  const [courseSortField, setCourseSortField] = useState('title');
  const [courseSortDir, setCourseSortDir] = useState<'asc' | 'desc'>('asc');
  const [archiveProposalSearch, setArchiveProposalSearch] = useState('');
  const [archiveRefusedSearch, setArchiveRefusedSearch] = useState('');

  // Modals Pending Targets
  const [courseArchiveTarget, setCourseArchiveTarget] = useState<any | null>(null);
  const [curriculumArchivalPending, setCurriculumArchivalPending] = useState<any | null>(null);
  const [curriculumCascadePending, setCurriculumCascadePending] = useState<any | null>(null);

  // Filters & Calculations
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

  const filteredActiveArchivalProposals = activeArchivalProposals.filter(p => 
    p.title.toLowerCase().includes(archiveProposalSearch.toLowerCase()) ||
    p.subject.toLowerCase().includes(archiveProposalSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(archiveProposalSearch.toLowerCase())
  );

  const filteredRefusedArchivals = refusedArchivals.filter(r => 
    r.title.toLowerCase().includes(archiveRefusedSearch.toLowerCase()) ||
    r.subject.toLowerCase().includes(archiveRefusedSearch.toLowerCase())
  );

  const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;

  return (
    <div className="space-y-8">
      {/* Consolidated Glassmorphic Card */}
      <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-8 hover:border-slate-700/50 transition-all">
        {/* Header and Pedagogical Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-extrabold text-white">{tr("Pedagogical Archiving Engine Overview")}</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {tr("The Course Archiving Engine autonomously monitors course quality metrics to propose soft-archiving (Level 1) or complete archival based on a unified dynamic trigger checked in real-time:")}
          </p>
          
          {/* Dynamic Archiving Conditions */}
          <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" /> {tr("Combined Trigger: Low Rating After Minimum Revisions")}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                {tr("Triggers a course archival proposal if the average student rating drops below the Rating Threshold (≤ Stars), with a significant sample size (≥ Min Votes), and the course has undergone at least a minimum number of revisions (≥ Min Revisions).")}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-800/60" />

        {/* Archiving Control Parameters Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">{tr("Archiving Control Parameters")}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Auto-Approve Archivals */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-800 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Approve Archivals")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Enable to let the archiving engine automatically soft-archive qualified courses.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                <button 
                  type="button"
                  onClick={() => updateParameter('autoArchiveCourses', String(!autoArchiveCourses))}
                  className={`w-10 h-5 rounded-full relative transition-all ${autoArchiveCourses ? 'bg-pink-600' : 'bg-slate-800'}`}
                >
                  <motion.div animate={{ x: autoArchiveCourses ? 20 : 4 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg" />
                </button>
                <span className="text-xs font-bold text-slate-300">{tr(autoArchiveCourses ? 'ON' : 'OFF')}</span>
              </div>
            </div>

            {/* 2. Rating Threshold */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-800 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Rating Threshold")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Proposes archival if overall rating falls at or below this stars count.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={archiveRatingThreshold} 
                  onChange={(e) => updateParameter('archiveRatingThreshold', String(Number(e.target.value)))}
                  className="bg-transparent border-none text-pink-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Stars")}</span>
              </div>
            </div>

            {/* 3. Min Votes */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-800 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Min Votes")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Minimum reviews required to activate the low rating trigger.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  min="1"
                  value={archiveMinVotes} 
                  onChange={(e) => updateParameter('archiveMinVotes', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-pink-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Votes")}</span>
              </div>
            </div>

            {/* 4. Min Revisions */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-800 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Min Revisions")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Minimum revision/version count a course must undergo before being eligible for quality-based archiving.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  min="1"
                  value={archiveMinRevisions} 
                  onChange={(e) => updateParameter('archiveMinRevisions', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-pink-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Revisions")}</span>
              </div>
            </div>

            {/* 5. Auto-Approve Delay */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-800 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Approve Delay")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Cooldown delay in hours before an archival proposal is automatically approved.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  min="1"
                  value={archiveDelayHours} 
                  onChange={(e) => updateParameter('archiveDelayHours', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-pink-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Hours")}</span>
              </div>
            </div>

            {/* 6. Log Retention Cooldown */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-800 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Log Retention Cooldown")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Retention period in days for historical archiving logs and stale refused proposals.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  min="1"
                  value={archiveRetentionDays} 
                  onChange={(e) => updateParameter('archiveRetentionDays', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-pink-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Days")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Proposals & Backlog Lists */}
      <div className="space-y-8">
        {/* PROPOSED ARCHIVALS */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-black text-slate-200">{tr("Active Proposed Archivals")}</h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={archiveProposalSearch}
                onChange={(e) => setArchiveProposalSearch(e.target.value)}
                placeholder={"🔍 " + tr("Search proposals...")}
                className="bg-slate-950/80 border border-slate-900 rounded-2xl py-2 px-4 text-xs focus:border-pink-500/50 outline-none text-white w-56"
              />
              {activeArchivalProposals.length > 0 && (
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider shrink-0">
                  {filteredActiveArchivalProposals.length}/{activeArchivalProposals.length}
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredActiveArchivalProposals.map((item, idx) => (
              <div key={idx} className="p-6 bg-slate-900/40 border border-slate-855 hover:border-pink-500/30 rounded-[32px] flex justify-between items-start gap-4 transition-all relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-xl rounded-full pointer-events-none" />
                
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase border ${
                      item.reason === 'Excessive Cumulative Revisions'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-pink-500/10 border-pink-500/20 text-pink-400'
                    }`}>
                      {tr(item.reason)}
                    </span>
                    <span className="px-2 py-0.5 text-[8px] font-black rounded uppercase border bg-slate-950 border-slate-800 text-slate-400 font-mono">
                      Version: {item.version}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                      {item.title} 
                    </h4>
                    <p className="text-[11px] font-bold text-pink-500 mt-0.5">{item.subject}</p>
                  </div>

                  <p className="text-xs text-slate-400 leading-normal bg-slate-950/40 border border-slate-900 p-3 rounded-2xl italic">
                    "{item.description}"
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 border border-slate-800 rounded-xl text-[9px] font-mono font-bold text-slate-400">
                      <span>Rating:</span>
                      <span className="text-yellow-400 font-black">⭐ {Number(item.overallRating).toFixed(1)}/5</span>
                      <span className="text-slate-600">({item.overallVotes} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 border border-slate-800 rounded-xl text-[9px] font-mono font-bold text-slate-400">
                      <span>Revisions:</span>
                      <span className="text-blue-400 font-black">{item.revisionCount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 z-10">
                  <button 
                    type="button" 
                    title={tr("Approve & Archive")}
                    onClick={() => handleApproveArchival(item.id)} 
                    className="p-3 bg-pink-600 text-white rounded-xl hover:bg-pink-500 transition-all shadow-md shadow-pink-600/10"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    title={tr("Refuse & Backlog")}
                    onClick={() => handleRefuseArchival(item.id)} 
                    className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredActiveArchivalProposals.length === 0 && (
              <p className="col-span-2 text-sm text-slate-600 italic py-8 text-center bg-slate-950/20 border border-slate-900 rounded-[32px] w-full">
                {tr("No pending course archival proposals. Core curriculum stable.")}
              </p>
            )}
          </div>
        </div>

        {/* REFUSED ARCHIVALS BACKLOG */}
        <div className="pt-8 border-t border-slate-900 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest">{tr("Refused Archivals Backlog")}</h4>
              <p className="text-xs text-slate-500">{tr("Rejected proposals are temporarily stored here, preventing auto-triggering during cooldown period.")}</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={archiveRefusedSearch}
                onChange={(e) => setArchiveRefusedSearch(e.target.value)}
                placeholder={"🔍 " + tr("Search backlog...")}
                className="bg-slate-950/80 border border-slate-900 rounded-2xl py-2 px-4 text-xs focus:border-pink-500/50 outline-none text-white w-56"
              />
              {refusedArchivals.length > 0 && (
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider shrink-0">
                  {filteredRefusedArchivals.length}/{refusedArchivals.length}
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredRefusedArchivals.map((item) => (
              <div key={item.id} className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl flex justify-between items-center hover:border-slate-700/30 transition-all">
                <div>
                  <p className="text-xs font-bold text-slate-200">{item.title}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase truncate max-w-[200px] mt-1">{item.subject}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleDeleteRefusedArchival(item.id)} 
                  className="px-3 py-1.5 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-500 hover:text-white transition-all text-[8px] font-black uppercase text-center"
                >
                  {tr("Re-Propose")}
                </button>
              </div>
            ))}
            {filteredRefusedArchivals.length === 0 && (
              <p className="col-span-3 text-xs text-slate-600 italic py-4 text-center">{tr("No refused archivals in backlog.")}</p>
            )}
          </div>
        </div>
      </div>

      {/* RELOCATED CATALOG REGISTRY */}
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
          {/* Search Bar */}
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

                // Label and color definitions based on dynamic level
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
                          // 1. If it IS a curriculum, offer to optional cascade to child courses
                          if (isCurriculum) {
                            const targetChilds = courses.filter(c => course.childCourses?.some((cid: any) => String(cid) === String(c.id)) && (c.archivingLevel || 0) < nextLvl);
                            if (targetChilds.length > 0) {
                              setCurriculumCascadePending({ curriculum: course, nextLevel: nextLvl, childCourses: targetChilds });
                              return;
                            }
                          }

                          // 2. If it is NOT a curriculum, enforce standard parent validation
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
                    // First archive all parent curricula to nextLevel
                    for (const curr of parentCurricula) {
                      const { error } = await dbService.setCourseArchivingLevel(curr.id, nextLevel);
                      if (error) {
                        showToast(error.message || String(error), 'error');
                        return;
                      }
                    }
                    // Then archive the course itself
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
                    // Archive child courses
                    for (const child of childCourses) {
                      const { error } = await dbService.setCourseArchivingLevel(child.id, nextLevel);
                      if (error) {
                        showToast(error.message || String(error), 'error');
                        return;
                      }
                    }
                    // Archive curriculum itself
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
                    // Archive only curriculum
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
    </div>
  );
};
