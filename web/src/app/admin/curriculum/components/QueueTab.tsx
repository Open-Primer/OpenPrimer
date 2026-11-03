"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LOCALIZED_POPUPS } from '../strings';
import { dbService } from '@/lib/db';
import { cleanPathSegment } from '@/lib/translations';
import { QueueTable, QueueTableProps } from './queue/QueueTable';
import { QueueModals, QueueModalsProps } from './queue/QueueModals';

export { QueueTable, QueueModals };
export type { QueueTableProps, QueueModalsProps };

export interface QueueTabProps {
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
  const [queueSearch, setQueueSearch] = useState('');
  const [queuePage, setQueuePage] = useState(1);
  const [queueSortField, setQueueSortField] = useState('priority');
  const [queueSortDir, setQueueSortDir] = useState<'asc' | 'desc'>('desc');

  const [cancelTaskTarget, setCancelTaskTarget] = useState<any | null>(null);
  const [errorDetailsTarget, setErrorDetailsTarget] = useState<any | null>(null);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

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

  const itemsPerPage = 15;
  const totalQueuePages = Math.ceil(filteredQueue.length / itemsPerPage) || 1;
  const safeQueuePage = Math.min(queuePage, totalQueuePages);
  const paginatedQueue = filteredQueue.slice((safeQueuePage - 1) * itemsPerPage, safeQueuePage * itemsPerPage);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* 3. Cloud Cron Worker Status */}
          <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-855 rounded-3xl justify-between hover:border-slate-800 transition-all">
            <div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Vercel Cloud Cron")}</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                {tr("Server-side execution schedule. Runs automatically without requiring an active browser or computer.")}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-full uppercase">
                {tr("Active (5 min)")}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">/api/content/cron</span>
            </div>
          </div>

          {/* 4. Max Parallel Tasks */}
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
                max="10"
                value={maxParallelTasks}
                onChange={(e) => updateParameter("maxParallelTasks", String(Math.max(1, Math.min(10, Number(e.target.value)))))}
                className="bg-transparent border-none text-cyan-400 text-sm font-black focus:outline-none w-20 text-right"
              />
              <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Tasks")}</span>
            </div>
          </div>

          {/* 5. Browser-Side Execution */}
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

      <QueueTable
        lang={lang}
        tr={tr}
        courses={courses}
        queue={queue}
        filteredQueue={filteredQueue}
        paginatedQueue={paginatedQueue}
        queueSearch={queueSearch}
        setQueueSearch={setQueueSearch}
        queuePage={queuePage}
        setQueuePage={setQueuePage}
        safeQueuePage={safeQueuePage}
        totalQueuePages={totalQueuePages}
        queueSortField={queueSortField}
        setQueueSortField={setQueueSortField}
        queueSortDir={queueSortDir}
        setQueueSortDir={setQueueSortDir}
        isProcessingQueue={isProcessingQueue}
        isQueueLoaded={isQueueLoaded}
        handlePauseAll={handlePauseAll}
        handleResumeAll={handleResumeAll}
        handleChangePriority={handleChangePriority}
        handleGoToRevision={handleGoToRevision}
        handleRetryTask={handleRetryTask}
        handleTogglePauseTask={handleTogglePauseTask}
        handleForceResetTask={handleForceResetTask}
        checkIsTaskOutdated={checkIsTaskOutdated}
        setCancelTaskTarget={setCancelTaskTarget}
        setErrorDetailsTarget={setErrorDetailsTarget}
      />

      <QueueModals
        lang={lang}
        tr={tr}
        cancelTaskTarget={cancelTaskTarget}
        setCancelTaskTarget={setCancelTaskTarget}
        errorDetailsTarget={errorDetailsTarget}
        setErrorDetailsTarget={setErrorDetailsTarget}
        handleCancelTask={handleCancelTask}
        handleRetryTask={handleRetryTask}
      />
    </div>
  );
};
