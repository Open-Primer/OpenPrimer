"use client";

import React, { useState } from 'react';
import { RefreshCw, ShieldAlert, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCALIZED_POPUPS } from '../strings';
import { dbService } from '@/lib/db';
import { cleanPathSegment, formatCourseLevel } from '@/lib/translations';

const renderSortIndicator = (field: string, currentField: string, currentDir: 'asc' | 'desc') => {
  if (field !== currentField) return <span className="ml-1 text-slate-700 hover:text-slate-400 cursor-pointer">⇅</span>;
  return currentDir === 'asc' ? <span className="ml-1 text-cyan-400 cursor-pointer">▲</span> : <span className="ml-1 text-cyan-400 cursor-pointer">▼</span>;
};

const formatCourseLevelGlobal = (level: string | undefined | null, lang: string) => {
  if (!level) return 'N/A';
  return formatCourseLevel(level, lang);
};

interface QueueTabProps {
  lang: 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR' | 'PT' | 'AR' | 'HI' | 'UR';
  tr: (key: string) => string;
  courses: any[];
  queueAutoRetry: boolean;
  queueAutoRetryDelayHours: number;
  queueRetentionDays: number;
  maxParallelTasks: number;
  executeTasksInBrowser: boolean;
  updateParameter: (key: string, value: string) => Promise<void>;
  
  queue: any[];
  setQueue: React.Dispatch<React.SetStateAction<any[]>>;
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeTriggeredTaskId: (id: string) => void;
  isQueueLoaded?: boolean;
}

export const QueueTab: React.FC<QueueTabProps> = ({
  lang,
  tr,
  courses,
  queueAutoRetry,
  queueAutoRetryDelayHours,
  queueRetentionDays,
  maxParallelTasks,
  executeTasksInBrowser,
  updateParameter,
  queue,
  setQueue,
  loadData,
  showToast,
  removeTriggeredTaskId,
  isQueueLoaded = true
}) => {
  // Search & Pagination & Sort States
  const [queueSearch, setQueueSearch] = useState('');
  const [queuePage, setQueuePage] = useState(1);
  const [queueSortField, setQueueSortField] = useState('priority');
  const [queueSortDir, setQueueSortDir] = useState<'asc' | 'desc'>('desc');

  // Modals Targets
  const [cancelTaskTarget, setCancelTaskTarget] = useState<any | null>(null);
  const [errorDetailsTarget, setErrorDetailsTarget] = useState<any | null>(null);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  // Helper tasks outdated triggers
  const getTaskTargetInfo = (t: any) => {
    let courseTitle = t.title;
    let chapterTitle = '';
    const isRevision = t.type === 'revision' || t.title.includes(' - Revise');
    
    if (isRevision) {
      const splitIdx = t.title.indexOf(' - Revise');
      if (splitIdx !== -1) {
        courseTitle = t.title.substring(0, splitIdx).trim();
        const subStr = t.title.substring(splitIdx);
        const colonIdx = subStr.indexOf(':');
        if (colonIdx !== -1) {
          chapterTitle = subStr.substring(colonIdx + 1).trim();
        } else {
          chapterTitle = subStr.replace('- Revise', '').trim();
        }
      }
    }
    return { courseTitle, chapterTitle, isRevision };
  };

  const checkIsTaskOutdated = (t: any) => {
    const tInfo = getTaskTargetInfo(t);
    const tTime = new Date(t.timestamp).getTime();
    const cleanStr = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '').trim();
    
    return queue.some(other => {
      if (other.id === t.id) return false;
      
      const otherTime = new Date(other.timestamp).getTime();
      if (otherTime <= tTime) return false;
      
      if (other.status === 'failed' || other.status === 'canceled') return false;
      
      const otherInfo = getTaskTargetInfo(other);
      if (cleanStr(tInfo.courseTitle) !== cleanStr(otherInfo.courseTitle)) return false;
      
      if (other.type === 'generation') return true;
      if (!tInfo.isRevision) return true;
      
      if (tInfo.isRevision && otherInfo.isRevision) {
        return cleanStr(tInfo.chapterTitle) === cleanStr(otherInfo.chapterTitle);
      }
      
      return false;
    });
  };

  // Queue Handlers
  const handlePauseAll = async () => {
    if (isProcessingQueue) return;
    const activeStatuses = ['queued', 'running'];
    const activeTasks = queue.filter(t => activeStatuses.includes(t.status));
    if (activeTasks.length === 0) {
      showToast(tr("No active tasks to pause."), 'info');
      return;
    }
    setIsProcessingQueue(true);
    try {
      const updated = queue.map(t =>
        activeStatuses.includes(t.status) ? { ...t, status: 'paused' } : t
      );
      setQueue(updated);
      const res = await dbService.savePipelineQueue(updated);
      if (res && res.data) {
        setQueue(res.data);
      }
      showToast(`${tr("Paused")} ${activeTasks.length} ${tr("tasks.")}`, 'success');
      await loadData();
    } catch (err: any) {
      console.error("[PAUSE ALL ERROR]", err);
      showToast(`${tr("Failed to pause tasks:")} ${err.message || String(err)}`, 'error');
    } finally {
      setIsProcessingQueue(false);
    }
  };

  const handleResumeAll = async () => {
    if (isProcessingQueue) return;
    setIsProcessingQueue(true);
    showToast(tr("Reloading queue and resuming tasks..."), 'info');
    try {
      await loadData();
      setQueue(prev => {
        const updated = prev.map(t =>
          t.status === 'paused' ? { ...t, status: 'queued' } : t
        );
        dbService.savePipelineQueue(updated)
          .then(res => {
            if (res && res.data) setQueue(res.data);
          })
          .catch(e => console.error("[RESUME ALL] savePipelineQueue error:", e));
        return updated;
      });

      showToast(tr("Tasks resumed. Worker will pick them up by priority."), 'success');
      await loadData();
    } catch (err: any) {
      console.error("[RESUME ALL ERROR]", err);
      showToast(`${tr("Failed to resume tasks:")} ${err.message || String(err)}`, 'error');
    } finally {
      setIsProcessingQueue(false);
    }
  };

  const handleCancelTask = async (id: string, bypassConfirm = false) => {
    const taskToCancel = queue.find(t => t.id === id);
    if (!taskToCancel) return;

    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;

    if (taskToCancel.type === 'translation') {
      showToast(pStrings.translation_cancel_error, 'info');
      return;
    }

    const updated = queue.filter(t => t.id !== id);
    setQueue(updated);
    const res = await dbService.savePipelineQueue(updated);
    if (res && res.data) {
      setQueue(res.data);
    }
    
    if (taskToCancel.type === 'generation') {
      await dbService.addRefusedCourse({
        id: `ref_c_${Date.now()}`,
        name: taskToCancel.title,
        subject: 'Mathematics',
        searches: 5,
        priority: 'High',
        previouslyRefused: true
      });
    }
    await loadData();
  };

  const handleRetryTask = async (id: string) => {
    const updated = queue.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'queued',
          progress: t.progress || 0,
          logs: [...(t.logs || []), 'Retried task execution manually.']
        };
      }
      return t;
    });
    setQueue(updated);
    removeTriggeredTaskId(id);
    const res = await dbService.savePipelineQueue(updated);
    if (res && res.data) {
      setQueue(res.data);
    }
    await loadData();
    showToast(tr("Task queued for retry."), "success");
  };

  const handleTogglePauseTask = async (id: string) => {
    const updated = queue.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'paused' ? 'queued' : 'paused'
        };
      }
      return t;
    });
    setQueue(updated);
    const res = await dbService.savePipelineQueue(updated);
    if (res && res.data) {
      setQueue(res.data);
    }
    await loadData();
  };

  const handleForceResetTask = async (id: string) => {
    const updated = queue.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'failed',
          progress: t.progress || 0,
          completedAt: new Date().toISOString(),
          logs: [...(t.logs || []), `[${new Date().toISOString()}] 🔴 Reset: Task forced to failed state by Administrator.`]
        };
      }
      return t;
    });
    setQueue(updated);
    removeTriggeredTaskId(id);
    const res = await dbService.savePipelineQueue(updated);
    if (res && res.data) {
      setQueue(res.data);
    }
    await loadData();
    showToast(tr("Task forced to failed state."), "info");
  };

  const handleChangePriority = async (id: string, direction: 'up' | 'down') => {
    const priorityOrder = ['Low', 'Medium', 'High'];
    const updated = queue.map(t => {
      if (t.id === id) {
        const currentIndex = priorityOrder.indexOf(t.priority || 'Medium');
        let nextIndex = currentIndex;
        if (direction === 'up' && currentIndex < priorityOrder.length - 1) {
          nextIndex = currentIndex + 1;
        } else if (direction === 'down' && currentIndex > 0) {
          nextIndex = currentIndex - 1;
        }
        return {
          ...t,
          priority: priorityOrder[nextIndex]
        };
      }
      return t;
    });
    setQueue(updated);
    const res = await dbService.savePipelineQueue(updated);
    if (res && res.data) {
      setQueue(res.data);
    }
    await loadData();
  };

  const handleGoToRevision = async (task: any, matchedCourse: any) => {
    if (checkIsTaskOutdated(task)) {
      showToast(tr("This task is outdated because a newer task has been scheduled or processed for this course/chapter."), "error");
      return;
    }

    const safeSubject = cleanPathSegment(matchedCourse.subject || 'General');
    const safeLevel = cleanPathSegment(matchedCourse.level || 'L1');
    
    if (task.revisedSlugs && task.revisedSlugs.length > 0) {
      const url = `/${safeLevel}/${safeSubject}/${matchedCourse.slug}/${task.revisedSlugs[0]}`;
      window.open(url, '_blank');
      return;
    }
    
    let chapterPart = '';
    const splitIdx = task.title.indexOf(' - Revise');
    if (splitIdx !== -1) {
      const subStr = task.title.substring(splitIdx);
      const colonIdx = subStr.indexOf(':');
      if (colonIdx !== -1) {
        chapterPart = subStr.substring(colonIdx + 1).trim();
      } else {
        chapterPart = subStr.replace('- Revise', '').trim();
      }
    }
    
    if (!chapterPart) {
      const url = `/${safeLevel}/${safeSubject}/${matchedCourse.slug}/introduction`;
      window.open(url, '_blank');
      return;
    }
    
    const cleanStr = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '').trim();
    const cleanChapter = cleanStr(chapterPart);

    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: dbLessons } = await supabase
        .from('lessons')
        .select('lesson_slug, title')
        .eq('course_slug', matchedCourse.slug);
        
      if (dbLessons && dbLessons.length > 0) {
        let bestMatch = dbLessons.find((l: any) => cleanStr(l.title) === cleanChapter);
        if (!bestMatch) {
          bestMatch = dbLessons.find((l: any) => {
            const cleanL = cleanStr(l.title);
            return cleanL.includes(cleanChapter) || cleanChapter.includes(cleanL);
          });
        }
        if (bestMatch) {
          const url = `/${safeLevel}/${safeSubject}/${matchedCourse.slug}/${bestMatch.lesson_slug}`;
          window.open(url, '_blank');
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to find lesson slug from database, using fallback", err);
    }
    
    const fallbackSlug = chapterPart
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s_-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
      
    const url = `/${safeLevel}/${safeSubject}/${matchedCourse.slug}/${fallbackSlug}`;
    window.open(url, '_blank');
  };

  // Filter & Sort Tasks
  const filteredQueue = queue
    .filter(task => {
      const query = queueSearch.toLowerCase();
      return (
        task.title?.toLowerCase().includes(query) ||
        task.id?.toLowerCase().includes(query) ||
        task.status?.toLowerCase().includes(query) ||
        task.type?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let valA: any = a[queueSortField as keyof typeof a];
      let valB: any = b[queueSortField as keyof typeof b];

      if (queueSortField === 'priority') {
        const priorityWeights: Record<string, number> = { 'Low': 1, 'Medium': 2, 'High': 3 };
        valA = priorityWeights[a.priority] || 2;
        valB = priorityWeights[b.priority] || 2;
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (valA < valB) return queueSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return queueSortDir === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination Logic
  const itemsPerPage = 15;
  const totalQueuePages = Math.ceil(filteredQueue.length / itemsPerPage) || 1;
  const safeQueuePage = Math.min(queuePage, totalQueuePages);
  const paginatedQueue = filteredQueue.slice((safeQueuePage - 1) * itemsPerPage, safeQueuePage * itemsPerPage);

  const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;

  return (
    <div className="space-y-8">
      {/* Pipeline Queue Control Parameters */}
      <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-900/60">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white uppercase tracking-widest">{tr("Pipeline Queue Parameters")}</h3>
            <p className="text-xs text-slate-500">{tr("Configure global parameters and retry policies for the task pipeline.")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* 0. Auto-Retry Failed Tasks */}
          <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-855 rounded-3xl justify-between hover:border-slate-800 transition-all">
            <div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Retry Failed Tasks")}</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                {tr("Enable to automatically retry tasks that have failed due to database or agent errors.")}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
              <button 
                type="button"
                onClick={() => updateParameter('queueAutoRetry', String(!queueAutoRetry))}
                className={`w-10 h-5 rounded-full relative transition-all ${queueAutoRetry ? 'bg-cyan-600' : 'bg-slate-800'}`}
              >
                <motion.div animate={{ x: queueAutoRetry ? 20 : 4 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg" />
              </button>
              <span className="text-xs font-bold text-slate-300">{tr(queueAutoRetry ? 'ON' : 'OFF')}</span>
            </div>
          </div>

          {/* 1. Auto-Retry Interval */}
          <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-855 rounded-3xl justify-between hover:border-slate-800 transition-all">
            <div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Retry Interval")}</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                {tr("Cooldown delay in hours before a failed task is retried.")}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
              <input 
                type="number" 
                min="1"
                value={queueAutoRetryDelayHours} 
                onChange={(e) => updateParameter('queueAutoRetryDelayHours', String(Math.max(1, Number(e.target.value))))}
                className="bg-transparent border-none text-cyan-400 text-sm font-black focus:outline-none w-20 text-right"
              />
              <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Hours")}</span>
            </div>
          </div>

          {/* 2. Task Retention */}
          <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-855 rounded-3xl justify-between hover:border-slate-800 transition-all">
            <div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Task Retention")}</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                {tr("Retention period in days before completed or failed tasks are permanently purged.")}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
              <input 
                type="number" 
                min="1"
                value={queueRetentionDays} 
                onChange={(e) => updateParameter('queueRetentionDays', String(Math.max(1, Number(e.target.value))))}
                className="bg-transparent border-none text-cyan-400 text-sm font-black focus:outline-none w-20 text-right"
              />
              <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Days")}</span>
            </div>
          </div>

          {/* 3. Max Parallel Tasks */}
          <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-855 rounded-3xl justify-between hover:border-slate-800 transition-all">
            <div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Max Parallel Tasks")}</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                {tr("Maximum number of tasks running simultaneously. Increase with caution (Vertex AI quotas apply).")}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
              <input
                type="number"
                min="1"
                max="5"
                value={maxParallelTasks}
                onChange={(e) => updateParameter("maxParallelTasks", String(Math.max(1, Math.min(5, Number(e.target.value)))))}
                className="bg-transparent border-none text-cyan-400 text-sm font-black focus:outline-none w-20 text-right"
              />
              <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Tasks")}</span>
            </div>
          </div>

          {/* 4. Browser-Side Execution */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-855 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Browser Execution")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Execute queued tasks directly in the browser. Recommended: OFF if background CLI worker is active.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                <button 
                  type="button"
                  onClick={() => updateParameter('executeTasksInBrowser', String(!executeTasksInBrowser))}
                  className={`w-10 h-5 rounded-full relative transition-all ${executeTasksInBrowser ? 'bg-cyan-600' : 'bg-slate-800'}`}
                >
                  <motion.div animate={{ x: executeTasksInBrowser ? 20 : 4 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg" />
                </button>
                <span className="text-xs font-bold text-slate-300">{tr(executeTasksInBrowser ? 'ON' : 'OFF')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

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

        <div className="overflow-x-auto custom-scrollbar rounded-3xl border border-slate-850 bg-slate-900/20 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-850 text-slate-500 text-[9px] font-black uppercase tracking-widest bg-slate-950/40">
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
            <tbody className="divide-y divide-slate-850/50">
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
                    <td className="px-6 py-4 font-black uppercase text-[9px] text-slate-500 tracking-wider">{tr(task.type)}</td>
                    <td className="px-6 py-4">
                      <span className={"px-2.5 py-1 text-[8px] font-black rounded-full uppercase border " + statusColor}>
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
                                <span className="px-3 py-1.5 bg-slate-950 border border-slate-900 text-rose-500 rounded-xl text-[8px] font-black uppercase tracking-wider select-none cursor-not-allowed">
                                  {tr("Deleted course")}
                                </span>
                              );
                            }
                            const isOutdated = checkIsTaskOutdated(task);
                            if (isOutdated) {
                              return (
                                <span 
                                  className="px-3 py-1.5 bg-slate-950 border border-slate-900/50 text-amber-500/80 rounded-xl text-[8px] font-black uppercase tracking-wider select-none cursor-not-allowed flex items-center gap-1 shadow-lg shadow-amber-550/5"
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
                              <span className="px-3 py-1.5 bg-slate-950 border border-slate-900 text-slate-600 rounded-xl text-[8px] font-black uppercase tracking-wider select-none cursor-not-allowed">
                                {tr("Locked (Done)")}
                              </span>
                            );
                          })()
                        ) : task.status === 'failed' ? (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1.5 bg-red-950/20 border border-red-900/30 text-red-500 rounded-xl text-[8px] font-black uppercase tracking-wider select-none">
                              {tr('Failed')}
                            </span>
                            <button 
                              type="button"
                              onClick={() => setErrorDetailsTarget(task)}
                              className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-amber-500/20 text-slate-500 hover:text-amber-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                            >
                              {tr('Logs')}
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleRetryTask(task.id)}
                              className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-emerald-500/20 text-slate-500 hover:text-emerald-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                            >
                              {tr('Retry')}
                            </button>
                            <button 
                              type="button"
                              onClick={() => setCancelTaskTarget(task)}
                              className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-red-500/20 text-slate-500 hover:text-red-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
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
                                className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-amber-500/20 text-slate-500 hover:text-amber-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                              >{tr('Pause')}</button>
                            )}
                            
                            {(task.status === 'running' || task.status === 'processing') && (
                              <button 
                                type="button"
                                onClick={() => handleForceResetTask(task.id)}
                                className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-red-500/20 text-slate-500 hover:text-red-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
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
                                className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-red-500/20 text-slate-500 hover:text-red-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
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
            <button type="button" disabled={queuePage === 1} onClick={() => setQueuePage(p => Math.max(1, p - 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("◀ Prev")}</button>
            <span className="text-[10px] font-mono font-black text-slate-500">{safeQueuePage} / {totalQueuePages}</span>
            <button type="button" disabled={queuePage === totalQueuePages} onClick={() => setQueuePage(p => Math.min(totalQueuePages, p + 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("Next ▶")}</button>
          </div>
        )}
      </div>

      {/* CANCEL TASK CONFIRM MODAL */}
      <AnimatePresence>
        {cancelTaskTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelTaskTarget(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-850 bg-red-955/20 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">
                  {pStrings.cancel_task_title || "Cancel Task"}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed text-center">
                  {pStrings.task_cancel_confirm.replace("{title}", cancelTaskTarget.title)}
                </p>
                
                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => setCancelTaskTarget(null)}
                    className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    {pStrings.purge_badge_cancel_btn}
                  </button>
                  <button 
                    type="button"
                    onClick={async () => {
                      const targetId = cancelTaskTarget.id; 
                      setCancelTaskTarget(null); 
                      await handleCancelTask(targetId, true);
                    }}
                    className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl transition-all bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/10 cursor-pointer"
                  >
                    {pStrings.purge_badge_confirm_btn}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ERROR DETAILS POPUP MODAL */}
      <AnimatePresence>
        {errorDetailsTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setErrorDetailsTarget(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="relative z-10 w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-850 bg-amber-955/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-500 animate-pulse" />
                  <h3 className="text-lg font-black text-amber-400 uppercase tracking-widest">
                    {tr("Task Error Logs")}
                  </h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setErrorDetailsTarget(null)}
                  className="w-8 h-8 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>
              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">{tr("Task Title")}</h4>
                  <p className="text-sm font-semibold text-slate-200">{errorDetailsTarget.title}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">{tr("Error Stack & Logs")}</h4>
                  <div className="p-6 bg-slate-950 border border-slate-850 rounded-2xl font-mono text-[10px] text-red-400 max-h-60 overflow-y-auto custom-scrollbar leading-relaxed whitespace-pre-wrap">
                    {Array.isArray(errorDetailsTarget.logs) && errorDetailsTarget.logs.length > 0 
                      ? errorDetailsTarget.logs.join('\n') 
                      : errorDetailsTarget.logs || tr("No log information recorded.")}
                  </div>
                </div>
                
                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => setErrorDetailsTarget(null)}
                    className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    {tr("Close")}
                  </button>
                  <button 
                    type="button"
                    onClick={async () => {
                      const id = errorDetailsTarget.id;
                      setErrorDetailsTarget(null);
                      await handleRetryTask(id);
                    }}
                    className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl transition-all bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/10 cursor-pointer"
                  >
                    {tr("Retry Task")}
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
