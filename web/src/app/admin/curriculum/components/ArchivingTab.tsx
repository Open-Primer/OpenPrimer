"use client";

import React, { useState } from 'react';
import { Database, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { CatalogRegistryPanel, CatalogRegistryPanelProps } from './archiving/CatalogRegistryPanel';

export { CatalogRegistryPanel };
export type { CatalogRegistryPanelProps };

export interface ArchivingTabProps {
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
  const [archiveProposalSearch, setArchiveProposalSearch] = useState('');
  const [archiveRefusedSearch, setArchiveRefusedSearch] = useState('');

  const filteredActiveArchivalProposals = activeArchivalProposals.filter(p => 
    p.title.toLowerCase().includes(archiveProposalSearch.toLowerCase()) ||
    p.subject.toLowerCase().includes(archiveProposalSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(archiveProposalSearch.toLowerCase())
  );

  const filteredRefusedArchivals = refusedArchivals.filter(r => 
    r.title.toLowerCase().includes(archiveRefusedSearch.toLowerCase()) ||
    r.subject.toLowerCase().includes(archiveRefusedSearch.toLowerCase())
  );

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
      <CatalogRegistryPanel
        lang={lang}
        tr={tr}
        courses={courses}
        completions={completions}
        loadData={loadData}
        showToast={showToast}
      />
    </div>
  );
};
