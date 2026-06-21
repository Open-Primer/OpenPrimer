"use client";

import React, { useState } from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService } from '@/lib/db';

interface RevisionTabProps {
  lang: 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR' | 'PT' | 'AR' | 'HI' | 'UR';
  tr: (key: string) => string;
  autoRevision: boolean;
  revThreshold: number;
  revMinVotes: number;
  revMinReports: number;
  autoRevisionDelayHours: number;
  revRetentionDays: number;
  updateParameter: (key: string, value: string) => Promise<void>;
  
  activeRevisionProposals: any[];
  refusedRevisions: any[];
  handleApproveRevision: (courseTitle: string, chapter: string, issue: string) => void;
  handleRefuseRevision: (courseTitle: string, chapter: string, issue: string) => void;
  
  loadData: () => Promise<void>;
}

export const RevisionTab: React.FC<RevisionTabProps> = ({
  lang,
  tr,
  autoRevision,
  revThreshold,
  revMinVotes,
  revMinReports,
  autoRevisionDelayHours,
  revRetentionDays,
  updateParameter,
  activeRevisionProposals,
  refusedRevisions,
  handleApproveRevision,
  handleRefuseRevision,
  loadData
}) => {
  // Search States
  const [revisionProposalSearch, setRevisionProposalSearch] = useState('');
  const [revisionRefusedSearch, setRevisionRefusedSearch] = useState('');

  // Filtered Proposals
  const filteredActiveRevisionProposals = activeRevisionProposals.filter(p => 
    p.courseTitle.toLowerCase().includes(revisionProposalSearch.toLowerCase()) ||
    p.chapter.toLowerCase().includes(revisionProposalSearch.toLowerCase()) ||
    p.issueSummary.toLowerCase().includes(revisionProposalSearch.toLowerCase())
  );

  // Filtered Refused Backlog
  const filteredRefusedRevisions = refusedRevisions.filter(r => 
    r.course.toLowerCase().includes(revisionRefusedSearch.toLowerCase()) ||
    r.issueSummary.toLowerCase().includes(revisionRefusedSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Consolidated Explanation box & Parameters Card */}
      <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-8 hover:border-slate-700/50 transition-all">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-extrabold text-white">{tr("Pedagogical Revision Engine Overview")}</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {tr("The Revision Engine dynamically groups feedback reports and triggers proposed fixes at the course-chapter level. Two primary conditions are monitored in real-time by a dedicated AI Agent:")}
          </p>
          <div className="grid md:grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-3xl border border-slate-850">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> {tr("Trigger 1: Low Global Rating")}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                {tr("Triggers a general course revision if the average student rating drops below the Rating Threshold (≤ Stars) and has gathered a significant sample size (≥ Min Votes).")}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {tr("Trigger 2: Concordant Error Reports")}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                {tr("Triggers a target-chapter revision when multiple users (≥ Min Reports) submit matching complaints. The AI Agent synthesizes these concordant reports into a single, structured fix.")}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-850/60" />

        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">{tr("Engine Control Parameters")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {/* 0. Auto-Approve Revisions */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Approve Revisions")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Enable to let the pedagogical agent automatically apply qualified fixes directly to target chapters.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                <button 
                  type="button"
                  onClick={() => updateParameter('autoRevision', String(!autoRevision))}
                  className={`w-10 h-5 rounded-full relative transition-all ${autoRevision ? 'bg-yellow-600' : 'bg-slate-800'}`}
                >
                  <motion.div animate={{ x: autoRevision ? 20 : 4 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg" />
                </button>
                <span className="text-xs font-bold text-slate-300">{autoRevision ? 'ON' : 'OFF'}</span>
              </div>
            </div>

            {/* 1. Rating Threshold */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Rating Threshold")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Proposes revision if overall rating falls at or below this stars count.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={revThreshold} 
                  onChange={(e) => updateParameter('revThreshold', String(Math.max(1, Math.min(5, Number(e.target.value)))))}
                  className="bg-transparent border-none text-yellow-500 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Stars")}</span>
              </div>
            </div>

            {/* 2. Min Votes */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Min Votes")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Minimum reviews required to activate the low rating trigger.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={revMinVotes} 
                  onChange={(e) => updateParameter('revMinVotes', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-blue-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Reviews")}</span>
              </div>
            </div>

            {/* 3. Min Reports */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Min Reports")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Required concordant error reports to trigger a target chapter revision.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={revMinReports} 
                  onChange={(e) => updateParameter('revMinReports', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-emerald-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Reports")}</span>
              </div>
            </div>

            {/* 4. Auto-Approve Delay */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Approve Delay")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Cooldown delay in hours before a proposal is automatically approved and built.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={autoRevisionDelayHours} 
                  onChange={(e) => updateParameter('autoRevisionDelayHours', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-purple-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Hours")}</span>
              </div>
            </div>

            {/* 5. Re-evaluation Days */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Log Retention Cooldown")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Retention period in days for historical feedbacks and stale refused proposals.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={revRetentionDays} 
                  onChange={(e) => updateParameter('revRetentionDays', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-pink-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Days")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Revisions proposals list */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-black text-slate-200">{tr("Active Proposed Revisions")}</h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={revisionProposalSearch}
              onChange={(e) => setRevisionProposalSearch(e.target.value)}
              placeholder={"🔍 " + tr("Search proposals...")}
              className="bg-slate-950/80 border border-slate-900 rounded-2xl py-2 px-4 text-xs focus:border-blue-500/50 outline-none text-white w-56"
            />
            {activeRevisionProposals.length > 0 && (
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider shrink-0">
                {filteredActiveRevisionProposals.length}/{activeRevisionProposals.length}
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredActiveRevisionProposals.map((item, idx) => (
            <div key={idx} className="p-6 bg-slate-900/40 border border-slate-850 hover:border-yellow-500/30 rounded-[32px] flex justify-between items-start gap-4 transition-all relative overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-xl rounded-full pointer-events-none" />
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase border ${
                    item.reason === 'Low Global Rating'
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    {item.reason}
                  </span>
                  <span className="px-2 py-0.5 text-[8px] font-black rounded uppercase border bg-slate-950 border-slate-800 text-slate-400 font-mono">
                    Version: {item.version}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                    {item.courseTitle} 
                    <span className="text-[10px] font-semibold text-slate-500 font-mono">({item.level})</span>
                  </h4>
                  <p className="text-[11px] font-bold text-yellow-500 mt-0.5">{item.chapter}</p>
                </div>

                <p className="text-xs text-slate-400 leading-normal bg-slate-950/40 border border-slate-900 p-3 rounded-2xl italic">
                  "{item.issueSummary}"
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 border border-slate-850 rounded-xl text-[9px] font-mono font-bold text-slate-400">
                    <span>Rating:</span>
                    <span className="text-yellow-400 font-black">⭐ {item.overallRating.toFixed(1)}/5</span>
                    <span className="text-slate-600">({item.overallVotes} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 border border-slate-850 rounded-xl text-[9px] font-mono font-bold text-slate-400">
                    <span>Active Reports:</span>
                    <span className="text-blue-400 font-black">{item.reportCount}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 border border-slate-850 rounded-xl text-[9px] font-mono font-bold text-slate-400">
                    <span>Composite Score:</span>
                    <span className="text-emerald-400 font-extrabold">{item.score}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 shrink-0 z-10">
                <button 
                  type="button" 
                  title={tr("Approve & Revise")}
                  onClick={() => handleApproveRevision(item.courseTitle, item.chapter, item.issueSummary)} 
                  className="p-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-500 transition-all shadow-md shadow-yellow-600/10"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  title={tr("Refuse & Backlog")}
                  onClick={() => handleRefuseRevision(item.courseTitle, item.chapter, item.issueSummary)} 
                  className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredActiveRevisionProposals.length === 0 && (
            <p className="col-span-2 text-sm text-slate-600 italic py-8 text-center bg-slate-950/20 border border-slate-900 rounded-[32px] w-full">
              {tr("No pending pedagogical revision proposals. Core curriculum stable.")}
            </p>
          )}
        </div>
      </div>

      {/* Refused Revision Backlog */}
      <div className="pt-8 border-t border-slate-900 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest">{tr("Refused Revisions Backlog")}</h4>
            <p className="text-xs text-slate-500">{tr("Rejected proposals are temporarily stored here, preventing auto-triggering during cooldown period.")}</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={revisionRefusedSearch}
              onChange={(e) => setRevisionRefusedSearch(e.target.value)}
              placeholder={"🔍 " + tr("Search backlog...")}
              className="bg-slate-950/80 border border-slate-900 rounded-2xl py-2 px-4 text-xs focus:border-blue-500/50 outline-none text-white w-56"
            />
            {refusedRevisions.length > 0 && (
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider shrink-0">
                {filteredRefusedRevisions.length}/{refusedRevisions.length}
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filteredRefusedRevisions.map((item) => (
            <div key={item.id} className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl flex justify-between items-center hover:border-slate-700/30 transition-all">
              <div>
                <p className="text-xs font-bold text-slate-200">{item.course}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase truncate max-w-[200px] mt-1">{item.issueSummary}</p>
              </div>
              <button 
                type="button"
                onClick={() => dbService.deleteRefusedRevision(item.id).then(loadData)} 
                className="px-3 py-1.5 border border-slate-850 hover:border-slate-700 rounded-xl text-slate-500 hover:text-white transition-all text-[8px] font-black uppercase text-center"
              >
                {tr("Re-Propose")}
              </button>
            </div>
          ))}
          {filteredRefusedRevisions.length === 0 && (
            <p className="col-span-3 text-xs text-slate-600 italic py-4 text-center">{tr("No refused revisions in backlog.")}</p>
          )}
        </div>
      </div>
    </div>
  );
};
