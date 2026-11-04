import { LOCALIZED_POPUPS } from '../strings';
import { cleanPathSegment } from '@/lib/translations';
import { isDatabaseConfigured } from '@/lib/db';
import { useState } from 'react';
import React from 'react';
import { dbService, MockCourse } from '@/lib/db';

export interface UseRevisionArchivalAndQueueHandlersProps {
  queue: any[];
  setQueue: React.Dispatch<React.SetStateAction<any[]>>;
  courses: MockCourse[];
  feedbacks: any[];
  refusedArchivals: any[];
  setRefusedArchivals: React.Dispatch<React.SetStateAction<any[]>>;
  triggeredTaskIds: React.MutableRefObject<Set<string>>;
  lang: string;
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  t: any;
  tr: (key: string) => string;
}

export function useRevisionArchivalAndQueueHandlers({
  queue,
  setQueue,
  courses,
  feedbacks,
  refusedArchivals,
  setRefusedArchivals,
  triggeredTaskIds,
  lang,
  loadData,
  showToast,
  t,
  tr
}: UseRevisionArchivalAndQueueHandlersProps) {
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
      
      if (other.type === 'generation' || other.type === 'curriculum') return true;
      if (!tInfo.isRevision) return true;
      
      if (tInfo.isRevision && otherInfo.isRevision) {
        return cleanStr(tInfo.chapterTitle) === cleanStr(otherInfo.chapterTitle);
      }
      
      return false;
    });
  };

  const handleGoToRevision = async (task: any, matchedCourse: any) => {
    if (checkIsTaskOutdated(task)) {
      showToast(tr("This task is outdated because a newer task has been scheduled or processed for this course/chapter."), "error");
      return;
    }

    const safeSubject = cleanPathSegment(matchedCourse.subject || 'General');
    const safeLevel = cleanPathSegment(matchedCourse.level || 'L1');
    
    // 1. If we have revisedSlugs stored on the task, navigate immediately
    if (task.revisedSlugs && task.revisedSlugs.length > 0) {
      const url = `/${safeLevel}/${safeSubject}/${matchedCourse.slug}/${task.revisedSlugs[0]}`;
      window.open(url, '_blank');
      return;
    }
    
    // 2. Parse chapter title from task title
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
    
    // Helper to clean strings for comparison
    const cleanStr = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '').trim();
    const cleanChapter = cleanStr(chapterPart);

    // 3. Attempt to fetch lessons from DB to find a matching title
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: dbLessons } = await supabase
        .from('lessons')
        .select('lesson_slug, title')
        .eq('course_slug', matchedCourse.slug);
        
      if (dbLessons && dbLessons.length > 0) {
        // Find best match
        let bestMatch = dbLessons.find((l: any) => cleanStr(l.title) === cleanChapter);
        
        if (!bestMatch) {
          // Try substring match
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
    
    // 4. Fallback slugify
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

  // Revision Handlers
  const handleApproveRevision = async (courseTitle: string, chapter: string, issue: string) => {
    const taskTitle = `${courseTitle} - Revise: ${chapter}`;
    const isInQueue = queue.some(t => t.title.toLowerCase() === taskTitle.toLowerCase());
    if (isInQueue) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      alert(pStrings.alert_revision_in_queue.replace('{chapter}', chapter));
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: taskTitle,
      type: 'revision',
      status: 'queued',
      progress: 0,
      priority: 'High',
      timestamp: new Date().toISOString()
    };
    const updatedQueue = [...queue, newTask];
    setQueue(updatedQueue);
    dbService.savePipelineQueue(updatedQueue);

    if (isDatabaseConfigured) {
      // Find course in courses state
      const targetCourse = courses.find((c: any) => c.title.toLowerCase() === courseTitle.toLowerCase());
      if (targetCourse) {
        const currentVersion = targetCourse.version || 'v1.0.0';
        let nextVersion = 'v1.0.1';
        const match = currentVersion.match(/v?(\d+)\.(\d+)\.(\d+)/);
        if (match) {
          const major = parseInt(match[1], 10);
          const minor = parseInt(match[2], 10);
          const patch = parseInt(match[3], 10) + 1;
          nextVersion = `v${major}.${minor}.${patch}`;
        }
        const updatedCourse = {
          ...targetCourse,
          version: nextVersion,
          last_revision_date: new Date().toISOString()
        };
        await dbService.saveCourse(updatedCourse);

        // Auto-treat matching feedbacks in Database
        const courseSlug = targetCourse.slug || '';
        const matchingFeedbacks = feedbacks.filter((f: any) => 
          f.courseId === courseSlug && 
          f.comment.toLowerCase().includes(chapter.toLowerCase().replace('chapter ', '')) &&
          !f.isTreated
        );
        await Promise.all(matchingFeedbacks.map(f => dbService.markFeedbackTreated(f.id)));
      }
    } else {
      // Increment version and update last_revision_date (Version Governance)
      const localCourses = JSON.parse(localStorage.getItem('openprimer_courses') || '[]');
      const updatedCourses = localCourses.map((c: any) => {
        if (c.title.toLowerCase() === courseTitle.toLowerCase()) {
          const currentVersion = c.version || 'v1.0.0';
          let nextVersion = 'v1.0.1';
          const match = currentVersion.match(/v?(\d+)\.(\d+)\.(\d+)/);
          if (match) {
            const major = parseInt(match[1], 10);
            const minor = parseInt(match[2], 10);
            const patch = parseInt(match[3], 10) + 1;
            nextVersion = `v${major}.${minor}.${patch}`;
          }
          return {
            ...c,
            version: nextVersion,
            last_revision_date: new Date().toISOString()
          };
        }
        return c;
      });
      localStorage.setItem('openprimer_courses', JSON.stringify(updatedCourses));
      
      // Auto-treat matching feedbacks
      const localFeedbacks = JSON.parse(localStorage.getItem('openprimer_course_feedbacks') || '[]');
      const targetCourse = localCourses.find((c: any) => c.title.toLowerCase() === courseTitle.toLowerCase());
      const courseSlug = targetCourse?.slug || '';
      const updatedFeedbacks = localFeedbacks.map((f: any) => {
        if (f.courseId === courseSlug && f.comment.toLowerCase().includes(chapter.toLowerCase().replace('chapter ', ''))) {
          return { ...f, isTreated: true };
        }
        return f;
      });
      localStorage.setItem('openprimer_course_feedbacks', JSON.stringify(updatedFeedbacks));
    }

    loadData();
    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
    alert(pStrings.alert_revision_scheduled);
  };

  const handleRefuseRevision = async (courseTitle: string, chapter: string, issue: string) => {
    await dbService.addRefusedRevision({
      id: `ref_r_${Date.now()}`,
      course: courseTitle,
      issueSummary: `${chapter}: ${issue}`,
      count: 2,
      status: 'Pending',
      aiProposal: 'Pedagogical refinement rejected by Curator.',
      previouslyRefused: true,
      priority: 'Low',
      timestamp: new Date().toISOString()
    });
    loadData();
  };

  const handleApproveArchival = async (courseId: number) => {
    try {
      const { error } = await dbService.setCourseArchivingLevel(courseId, 1);
      if (error) {
        showToast(error.message || String(error), 'error');
        return;
      }
      await loadData();
      showToast(tr("Course successfully soft-archived (Level 1)."), 'success');
    } catch (e) {
      console.error(e);
      showToast(tr("Failed to archive course."), 'error');
    }
  };

  const handleRefuseArchival = (courseId: number) => {
    const course = courses.find((c: any) => c.id === courseId);
    if (!course) return;
    const item = {
      id: course.id,
      title: course.title,
      level: course.level,
      subject: course.subject,
      timestamp: new Date().toISOString()
    };
    const updated = [...refusedArchivals, item];
    setRefusedArchivals(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('openprimer_refused_archivals', JSON.stringify(updated));
    }
    showToast(tr("Course archival refused and added to backlog."), 'info');
  };

  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

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

  // Resume All: re-reads fresh state from DB, re-applies latest priorities, then re-queues paused tasks and triggers the worker.
  const handleResumeAll = async () => {
    if (isProcessingQueue) return;
    setIsProcessingQueue(true);
    showToast(tr("Reloading queue and resuming tasks..."), 'info');
    try {
      // 1. Reload authoritative state from DB
      await loadData();

      // 2. Set all paused tasks back to queued (re-evaluates priority from current queue state)
      // Since loadData asynchronously updates queue state in the next render cycle,
      // we must get the absolute freshest queue before mapping.
      const freshQueueRes = await dbService.getPipelineQueue();
      const freshQueue = freshQueueRes?.data || [];

      const updated = freshQueue.map((t: any) =>
        t.status === 'paused' ? { ...t, status: 'queued' } : t
      );
      setQueue(updated);
      const res = await dbService.savePipelineQueue(updated);
      if (res && res.data) {
        setQueue(res.data);
      }

      showToast(tr("Tasks resumed. Worker will pick them up by priority."), 'success');
      await loadData();
    } catch (err: any) {
      console.error("[RESUME ALL ERROR]", err);
      showToast(`${tr("Failed to resume tasks:")} ${err.message || String(err)}`, 'error');
    } finally {
      setIsProcessingQueue(false);
    }
  };

  const handleDeleteRefusedArchival = (courseId: number) => {
    const updated = refusedArchivals.filter((item: any) => item.id !== courseId);
    setRefusedArchivals(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('openprimer_refused_archivals', JSON.stringify(updated));
    }
    showToast(tr("Removed course from archiving backlog."), 'info');
  };

  // Queue Cancel Handler
  const handleCancelTask = async (id: string, bypassConfirm = false) => {
    const taskToCancel = queue.find(t => t.id === id);
    if (!taskToCancel) return;

    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;

    if (taskToCancel.type === 'translation') {
      showToast(pStrings.translation_cancel_error, 'info');
      return;
    }

    // Modal confirmation handled by cancelTaskTarget state

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
  
  // Queue Retry Handler
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
    triggeredTaskIds.current.delete(id);
    const res = await dbService.savePipelineQueue(updated);
    if (res && res.data) {
      setQueue(res.data);
    }
    await loadData();
    showToast(tr("Task queued for retry."), "success");
  };

  // Queue Pause/Resume Handler
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

  // Queue Force Reset Handler
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
    triggeredTaskIds.current.delete(id);
    const res = await dbService.savePipelineQueue(updated);
    if (res && res.data) {
      setQueue(res.data);
    }
    await loadData();
    showToast(tr("Task forced to failed state."), "info");
  };

  // Change Priority Handler
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



  return {
    getTaskTargetInfo,
    checkIsTaskOutdated,
    handleGoToRevision,
    handleApproveRevision,
    handleRefuseRevision,
    handleApproveArchival,
    handleRefuseArchival,
    handlePauseAll,
    handleResumeAll,
    handleDeleteRefusedArchival,
    handleCancelTask,
    handleRetryTask,
    handleTogglePauseTask,
    handleForceResetTask,
    handleChangePriority
  };
}
