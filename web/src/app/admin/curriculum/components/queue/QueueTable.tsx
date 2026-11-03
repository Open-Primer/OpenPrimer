"use client";

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { formatCourseLevel } from '@/lib/translations';

const renderSortIndicator = (field: string, currentField: string, currentDir: 'asc' | 'desc') => {
  if (field !== currentField) return <span className="ml-1 text-slate-700 hover:text-slate-400 cursor-pointer">⇅</span>;
  return currentDir === 'asc' ? <span className="ml-1 text-cyan-400 cursor-pointer">▲</span> : <span className="ml-1 text-cyan-400 cursor-pointer">▼</span>;
};

const formatCourseLevelGlobal = (level: string | undefined | null, lang: string) => {
  if (!level) return 'N/A';
  return formatCourseLevel(level, lang);
};

export interface QueueTableProps {
  lang: string;
  tr: (key: string) => string;
  courses: any[];
  queue: any[];
  filteredQueue: any[];
  paginatedQueue: any[];
  queueSearch: string;
  setQueueSearch: React.Dispatch<React.SetStateAction<string>>;
  queuePage: number;
  setQueuePage: React.Dispatch<React.SetStateAction<number>>;
  safeQueuePage: number;
  totalQueuePages: number;
  queueSortField: string;
  setQueueSortField: React.Dispatch<React.SetStateAction<string>>;
  queueSortDir: 'asc' | 'desc';
  setQueueSortDir: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  isProcessingQueue: boolean;
  isQueueLoaded: boolean;
  handlePauseAll: () => Promise<void>;
  handleResumeAll: () => Promise<void>;
  handleChangePriority: (id: string, direction: 'up' | 'down') => Promise<void>;
  handleGoToRevision: (task: any, matchedCourse: any) => Promise<void>;
  handleRetryTask: (id: string) => Promise<void>;
  handleTogglePauseTask: (id: string) => Promise<void>;
  handleForceResetTask: (id: string) => Promise<void>;
  checkIsTaskOutdated: (t: any) => boolean;
  setCancelTaskTarget: React.Dispatch<React.SetStateAction<any | null>>;
  setErrorDetailsTarget: React.Dispatch<React.SetStateAction<any | null>>;
}

export const QueueTable: React.FC<QueueTableProps> = ({
  lang,
  tr,
  courses,
  queue,
  filteredQueue,
  paginatedQueue,
  queueSearch,
  setQueueSearch,
  queuePage,
  setQueuePage,
  safeQueuePage,
  totalQueuePages,
  queueSortField,
  setQueueSortField,
  queueSortDir,
  setQueueSortDir,
  isProcessingQueue,
  isQueueLoaded,
  handlePauseAll,
  handleResumeAll,
  handleChangePriority,
  handleGoToRevision,
  handleRetryTask,
  handleTogglePauseTask,
  handleForceResetTask,
  checkIsTaskOutdated,
  setCancelTaskTarget,
  setErrorDetailsTarget
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-black text-slate-200">{tr("Active Task Pipeline Queue")}</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={queueSearch}
            onChange={(e) => { setQueueSearch(e.target.value); setQueuePage(1); }}
            placeholder={`🔍 ${tr('Search tasks...')}`}
            className="bg-slate-950/80 border border-slate-900 rounded-2xl py-2 px-4 text-xs focus:border-cyan-500/50 outline-none text-white w-56"
          />
          <button
            type="button"
            disabled={isProcessingQueue}
            onClick={handlePauseAll}
            className={`flex items-center gap-2 px-4 py-2 border rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              isProcessingQueue
                ? 'bg-slate-950 border-slate-900 text-slate-600'
                : 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30'
            }`}
            title={tr("Pause all queued and running tasks")}
          >
            ⏸ {tr("Pause All")}
          </button>
          <button
            type="button"
            disabled={isProcessingQueue}
            onClick={handleResumeAll}
            className={`flex items-center gap-2 px-4 py-2 border rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              isProcessingQueue
                ? 'bg-slate-950 border-slate-900 text-slate-600'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500/30 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-500/20'
            }`}
            title={tr("Reload queue from DB and resume all paused tasks")}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessingQueue ? 'animate-spin' : ''}`} />
            {isProcessingQueue ? tr("Processing...") : tr("Resume All")}
          </button>
          {queue.length > 0 && (
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider shrink-0">
              {filteredQueue.length}/{queue.length}
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar rounded-3xl border border-slate-800 bg-slate-900/20 shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-[9px] font-black uppercase tracking-widest bg-slate-950/40">
              <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                if (queueSortField === 'id') {
                  setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setQueueSortField('id');
                  setQueueSortDir('asc');
                }
              }}>
                {tr("Task ID")} {renderSortIndicator('id', queueSortField, queueSortDir)}
              </th>
              <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                if (queueSortField === 'title') {
                  setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setQueueSortField('title');
                  setQueueSortDir('asc');
                }
              }}>
                {tr("Course/Topic")} {renderSortIndicator('title', queueSortField, queueSortDir)}
              </th>
              <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                if (queueSortField === 'level') {
                  setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setQueueSortField('level');
                  setQueueSortDir('asc');
                }
              }}>
                {tr("Level")} {renderSortIndicator('level', queueSortField, queueSortDir)}
              </th>
              <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                if (queueSortField === 'targetLang') {
                  setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setQueueSortField('targetLang');
                  setQueueSortDir('asc');
                }
              }}>
                {tr("Language")} {renderSortIndicator('targetLang', queueSortField, queueSortDir)}
              </th>
              <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                if (queueSortField === 'completedAt') {
                  setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setQueueSortField('completedAt');
                  setQueueSortDir('asc');
                }
              }}>
                {tr("Completed")} {renderSortIndicator('completedAt', queueSortField, queueSortDir)}
              </th>
              <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                if (queueSortField === 'type') {
                  setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setQueueSortField('type');
                  setQueueSortDir('asc');
                }
              }}>
                {tr("Task Type")} {renderSortIndicator('type', queueSortField, queueSortDir)}
              </th>
              <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                if (queueSortField === 'status') {
                  setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setQueueSortField('status');
                  setQueueSortDir('asc');
                }
              }}>
                {tr("Status")} {renderSortIndicator('status', queueSortField, queueSortDir)}
              </th>
              <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                if (queueSortField === 'priority') {
                  setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setQueueSortField('priority');
                  setQueueSortDir('desc');
                }
              }}>
                {tr("Priority")} {renderSortIndicator('priority', queueSortField, queueSortDir)}
              </th>
              <th className="px-6 py-4">{tr("Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {paginatedQueue.map(task => {
              const isPaused = task.status === 'paused';
              const isTranslation = task.type === 'translation';
              
              let statusColor = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
              if (task.status === 'paused') {
                statusColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
              } else if (task.status === 'queued') {
                statusColor = 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
              } else if (task.status === 'running' || task.status === 'executing' || task.status === 'completed') {
                statusColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
              }

              return (
                <tr key={task.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-[9px] text-slate-500">{task.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-200">{tr(task.title)}</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-400">{formatCourseLevelGlobal(task.level, lang)}</td>
                  <td className="px-6 py-4">
                    {task.targetLang ? (
                      <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black rounded-full uppercase">{task.targetLang}</span>
                    ) : <span className="text-slate-700 font-black">—</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-[9px] text-slate-500">
                    {task.completedAt ? new Date(task.completedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : <span className="text-slate-700">—</span>}
                  </td>
                  <td className="px-6 py-4 font-black uppercase text-[9px] text-slate-500 tracking-wider">{tr(String(task.type || '').toUpperCase())}</td>
                  <td className="px-6 py-4">
                    <span className={"px-2.5 py-1 text-[8px] font-black rounded-full uppercase border whitespace-nowrap " + statusColor}>
                      {tr(task.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400 min-w-[50px]">{tr(task.priority)}</span>
                      <div className="flex flex-col gap-0.5">
                        <button 
                          type="button"
                          onClick={() => handleChangePriority(task.id, 'up')}
                          className="text-[9px] hover:text-white text-slate-600 transition-colors px-1"
                          title={tr("Increase Priority")}
                        >
                          ▲
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleChangePriority(task.id, 'down')}
                          className="text-[9px] hover:text-white text-slate-600 transition-colors px-1"
                          title={tr("Decrease Priority")}
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {task.status === 'complete' || task.status === 'completed' ? (
                        (() => {
                          const cleanForCompare = (str: string): string => {
                            if (!str) return '';
                            return str
                              .toLowerCase()
                              .normalize('NFD')
                              .replace(/[\u0300-\u036f]/g, '')
                              .replace(/[^a-z0-9]/g, '')
                              .trim();
                          };
                          let taskTitleToMatch = task.title;
                          const isRevision = task.type === 'revision' || task.title.includes(' - Revise');
                          const isTranslation = task.type === 'translation';
                          if (isRevision) {
                            const splitIdx = task.title.indexOf(' - Revise');
                            if (splitIdx !== -1) {
                              taskTitleToMatch = task.title.substring(0, splitIdx).trim();
                            }
                          } else if (isTranslation) {
                            taskTitleToMatch = task.title.replace(/\s*\([A-Z]{2,3}\)\s*$/, '').trim();
                          }
                          const cleanTT = cleanForCompare(taskTitleToMatch);
                          const matched = courses.find(c => {
                            const cleanCT = cleanForCompare(c.title);
                            const cleanCS = cleanForCompare(c.slug);
                            const cleanTS = cleanForCompare(taskTitleToMatch.replace(/\s+/g, '_'));
                            return cleanCT === cleanTT || cleanCS === cleanTT || cleanCT === cleanTS || cleanCS === cleanTS;
                          });
                          if (!matched) {
                            return (
                              <span className="px-3 py-1.5 bg-slate-950 border border-slate-900 text-rose-500 rounded-xl text-[8px] font-black uppercase tracking-wider select-none cursor-not-allowed whitespace-nowrap">
                                {tr("Deleted course")}
                              </span>
                            );
                          }
                          const isOutdated = checkIsTaskOutdated(task);
                          if (isOutdated) {
                            return (
                              <span 
                                className="px-3 py-1.5 bg-slate-950 border border-slate-900/50 text-amber-500/80 rounded-xl text-[8px] font-black uppercase tracking-wider select-none cursor-not-allowed flex items-center gap-1 shadow-lg shadow-amber-550/5 whitespace-nowrap"
                                title={tr("This action is outdated by a newer pipeline task.")}
                              >
                                ⚠️ {tr("Outdated (Done)")}
                              </span>
                            );
                          }
                          const safeSubject = (matched.subject || 'General').replace(/\s+/g, '_');
                          if (isRevision) {
                            return (
                              <button 
                                type="button"
                                onClick={() => handleGoToRevision(task, matched)}
                                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-500 hover:to-teal-550 border border-emerald-500/30 text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25"
                              >
                                📖 {tr('Go to Chapter')}
                              </button>
                            );
                          } else if (task.type === 'generation' || task.type === 'translation') {
                            return (
                              <a 
                                href={`/${matched.level}/${safeSubject}/${matched.slug}/introduction`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 border border-blue-500/30 text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25"
                              >
                                🚀 {tr('Go to Course')}
                              </a>
                            );
                          }
                          return (
                            <span className="px-3 py-1.5 bg-slate-950 border border-slate-900 text-slate-600 rounded-xl text-[8px] font-black uppercase tracking-wider select-none cursor-not-allowed whitespace-nowrap">
                              {tr("Locked (Done)")}
                            </span>
                          );
                        })()
                      ) : task.status === 'failed' ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-red-950/20 border border-red-900/30 text-red-500 rounded-xl text-[8px] font-black uppercase tracking-wider select-none whitespace-nowrap">
                            {tr('Failed')}
                          </span>
                          <button 
                            type="button"
                            onClick={() => setErrorDetailsTarget(task)}
                            className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-amber-500/20 text-slate-500 hover:text-amber-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                          >
                            {tr('Logs')}
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleRetryTask(task.id)}
                            className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/20 text-slate-500 hover:text-emerald-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                          >
                            {tr('Retry')}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setCancelTaskTarget(task)}
                            className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-red-500/20 text-slate-500 hover:text-red-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                          >
                            {tr('Cancel')}
                          </button>
                        </div>
                      ) : (
                        <>
                          {isPaused ? (
                            <button 
                              type="button"
                              onClick={() => handleTogglePauseTask(task.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                            >{tr('Resume')}</button>
                          ) : (
                            <button 
                              type="button"
                              onClick={() => handleTogglePauseTask(task.id)}
                              className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-amber-500/20 text-slate-500 hover:text-amber-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                            >{tr('Pause')}</button>
                          )}
                          
                          {(task.status === 'running' || task.status === 'processing') && (
                            <button 
                              type="button"
                              onClick={() => handleForceResetTask(task.id)}
                              className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-red-500/20 text-slate-500 hover:text-red-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                            >{tr('Force Reset')}</button>
                          )}
                          
                          {isTranslation ? (
                            <button 
                              type="button"
                              disabled
                              title={tr("Language cancel tooltip")}
                              className="px-3 py-1.5 bg-slate-950/40 border border-slate-900 text-slate-700 cursor-not-allowed rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                            >{tr('Cancel')}</button>
                          ) : (
                            <button 
                              type="button"
                              onClick={() => setCancelTaskTarget(task)}
                              className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-red-500/20 text-slate-500 hover:text-red-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                            >{tr('Cancel')}</button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!isQueueLoaded ? (
              <tr>
                <td colSpan={9} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 rounded-full border-4 border-t-blue-500 border-r-transparent border-slate-800 animate-spin" />
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{tr("Synchronizing Task Queue...")}</p>
                  </div>
                </td>
              </tr>
            ) : filteredQueue.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center text-slate-655 italic">
                  <p className="mb-4 text-xs font-medium text-slate-500">{queueSearch ? tr('No tasks match your search.') : tr('No tasks currently executing in the sovereign loop queue.')}</p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {totalQueuePages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button type="button" disabled={queuePage === 1} onClick={() => setQueuePage(p => Math.max(1, p - 1))} className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("◀ Prev")}</button>
          <span className="text-[10px] font-mono font-black text-slate-500">{safeQueuePage} / {totalQueuePages}</span>
          <button type="button" disabled={queuePage === totalQueuePages} onClick={() => setQueuePage(p => Math.min(totalQueuePages, p + 1))} className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("Next ▶")}</button>
        </div>
      )}
    </div>
  );
};
