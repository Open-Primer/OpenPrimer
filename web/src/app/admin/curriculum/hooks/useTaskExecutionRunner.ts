import React, { useEffect } from 'react';
import { dbService } from '@/lib/db';

export interface UseTaskExecutionRunnerProps {
  executeTasksInBrowser: boolean;
  isQueueLoaded: boolean;
  queue: any[];
  setQueue: React.Dispatch<React.SetStateAction<any[]>>;
  maxParallelTasks: number;
  lang: string;
  triggeredTaskIds: React.MutableRefObject<Set<string>>;
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export function useTaskExecutionRunner({
  executeTasksInBrowser,
  isQueueLoaded,
  queue,
  setQueue,
  maxParallelTasks,
  lang,
  triggeredTaskIds,
  loadData,
  showToast
}: UseTaskExecutionRunnerProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || !executeTasksInBrowser || !isQueueLoaded) return;

    const timer = setInterval(async () => {
      if (queue.length === 0) return;

      const runningTasks = queue.filter(t => t.status === 'running');
      const MAX_PARALLEL = maxParallelTasks;

      if (runningTasks.length > 0) {
        // Increment progress of all currently running tasks up to 90%
        let progressUpdated = false;
        const progressUpdatedQueue = queue.map(t => {
          if (t.status === 'running') {
            const nextProgress = Math.min(90, (t.progress || 0) + 10);
            if (nextProgress !== t.progress) {
              progressUpdated = true;
              return { ...t, progress: nextProgress };
            }
          }
          return t;
        });
        if (progressUpdated) {
          setQueue(progressUpdatedQueue);
          dbService.savePipelineQueue(progressUpdatedQueue);
        }

        // Trigger API Call only once per running task
        for (const runningTask of runningTasks) {
        if (!triggeredTaskIds.current.has(runningTask.id)) {
          triggeredTaskIds.current.add(runningTask.id);

          (async () => {
            let token: string | undefined;
            try {
              const { supabase } = await import("@/lib/supabase");
              const { data: { session } } = await supabase.auth.getSession();
              token = session?.access_token;
            } catch (err) {
              console.warn("[SCHEDULER] Failed to retrieve client auth session token:", err);
            }

            const taskLang = (runningTask.targetLang || lang || 'EN').toUpperCase();
            let correctedTitle = runningTask.title;
            try {
              if (runningTask.type === 'generation' || runningTask.type === 'curriculum') {
                const isCurriculum = runningTask.details?.includes('(CURRICULUM)') || runningTask.type === 'curriculum';
                const res = await fetch('/api/content/generate', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                  },
                  body: JSON.stringify({
                    type: 'generation',
                    name: runningTask.title,
                    level: runningTask.level || 'L1',
                    targetLang: taskLang.toLowerCase(),
                    isCurriculum,
                    taskId: runningTask.id
                  })
                });
                
                let data: any;
                try {
                  data = await res.json();
                } catch (e: any) {
                  const text = await res.clone().text().catch(() => '');
                  throw new Error(`Server returned non-JSON response. Status: ${res.status}. Error: ${e.message}. Snippet: "${text.slice(0, 150)}"`);
                }
                if (!res.ok || !data.success) {
                  throw new Error(data.error || 'Generation failed');
                }

                if (data.title) {
                  correctedTitle = data.title;
                }

                if (!isCurriculum) {
                  const isOpt = runningTask.courseType === 'optional' || runningTask.courseType === 'optionnel';
                  const childCourseId = (Date.now() % 10000000) + Math.floor(Math.random() * 1000);
                  const finalSlug = data.slug || (() => {
                    const asciiClean = correctedTitle
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()
                      .replace(/[^a-z0-9\s_-]/g, '')
                      .trim()
                      .replace(/\s+/g, '_');
                    return (asciiClean && asciiClean.replace(/_/g, '').length > 0)
                      ? asciiClean
                      : correctedTitle.toLowerCase().trim().replace(/\s+/g, '_');
                  })();

                  await dbService.saveCourse({
                    id: childCourseId,
                    title: correctedTitle,
                    slug: finalSlug,
                    subject: runningTask.subject || 'General',
                    description: runningTask.description || `Dynamic sovereign course on "${correctedTitle}". Self-contained academic curriculum synthesized autonomously by Episteme.`,
                    level: runningTask.level || 'L1',
                    archivingLevel: 0,
                    badge: 'badge_1',
                    modulesCount: 5,
                    lessonsCount: 20,
                    is_active: true,
                    languages: [taskLang.toLowerCase()],
                    langs: [taskLang],
                    translations: {
                      [taskLang]: {
                        title: correctedTitle,
                        description: runningTask.description || `Dynamic sovereign course on "${correctedTitle}". Self-contained academic curriculum synthesized autonomously by Episteme.`,
                        isOptional: isOpt,
                        volume: runningTask.volume || '30 hours'
                      }
                    }
                  });

                  if (runningTask.parentCurriculumSlug) {
                    const allCourses = await dbService.getAllCourses();
                    const parent = allCourses.data?.find(c => c.slug === runningTask.parentCurriculumSlug);
                    if (parent) {
                      const updatedChildren = Array.from(new Set([...(parent.childCourses || []), childCourseId]));
                      await dbService.saveCourse({
                        ...parent,
                        childCourses: updatedChildren
                      });
                    }
                  }
                }
              } else if (runningTask.type === 'translation') {
                const matches = runningTask.title.match(/(.*)\s*\(([^)]+)\)$/);
                if (matches && matches[1] && matches[2]) {
                  const cTitle = matches[1].trim();
                  const langCode = matches[2].trim().toUpperCase();
                  
                  const allCrs = await dbService.getAllCourses();
                  const foundCourse = allCrs.data?.find(c => c.title.toLowerCase() === cTitle.toLowerCase());
                  if (foundCourse) {
                    const res = await fetch('/api/content/generate', {
                      method: 'POST',
                      headers: { 
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                      },
                      body: JSON.stringify({
                        type: 'translation',
                        courseSlug: foundCourse.slug,
                        targetLang: langCode.toLowerCase(),
                        taskId: runningTask.id
                      })
                    });

                    let data: any;
                    try {
                      data = await res.json();
                    } catch (e: any) {
                      const text = await res.clone().text().catch(() => '');
                      throw new Error(`Server returned non-JSON response for translation. Status: ${res.status}. Error: ${e.message}. Snippet: "${text.slice(0, 150)}"`);
                    }
                    if (!res.ok || !data.success) {
                      throw new Error(data.error || 'Translation failed');
                    }

                    const updatedTranslations = { ...(foundCourse.translations || {}) };
                    updatedTranslations[langCode] = {
                      title: `${foundCourse.title} [${langCode}]`,
                      description: `${foundCourse.description} (Translated to ${langCode})`
                    };

                    const originalLanguages = foundCourse.languages || [];
                    const updatedLanguages = originalLanguages.includes(langCode.toLowerCase())
                      ? originalLanguages
                      : [...originalLanguages, langCode.toLowerCase()];

                    const originalLangsUpper = foundCourse.langs || [];
                    const updatedLangsUpper = originalLangsUpper.includes(langCode.toUpperCase())
                      ? originalLangsUpper
                      : [...originalLangsUpper, langCode.toUpperCase()];

                    await dbService.saveCourse({
                      ...foundCourse,
                      languages: updatedLanguages,
                      langs: updatedLangsUpper,
                      translations: updatedTranslations
                    });

                    const studentEmails = [
                      'student.gen@openprimer.app',
                      'researcher.transl@openprimer.app',
                      'learner.active@openprimer.edu'
                    ];
                    for (const email of studentEmails) {
                      await dbService.saveTranslationEmail({
                        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                        courseTitle: foundCourse.title,
                        targetLang: langCode,
                        email,
                        timestamp: new Date().toISOString()
                      });
                    }
                  }
                }
              }

              // Update state to completed
              setQueue(prevQueue => {
                const updated = prevQueue.map(t => {
                  if (t.id === runningTask.id) {
                    return {
                      ...t,
                      title: correctedTitle,
                      status: 'completed',
                      progress: 100,
                      completedAt: new Date().toISOString(),
                      logs: [...(t.logs || []), 'Successfully completed generation.']
                    };
                  }
                  return t;
                });
                dbService.savePipelineQueue(updated).then(() => loadData());
                return updated;
              });
              showToast("Course generated successfully!", "success");
            } catch (err: any) {
              console.error("Task failed:", err);
              setQueue(prevQueue => {
                const updated = prevQueue.map(t => {
                  if (t.id === runningTask.id) {
                    return {
                      ...t,
                      status: 'failed',
                      progress: t.progress || 0,
                      completedAt: new Date().toISOString(),
                      logs: [...(t.logs || []), `Error: ${err.message || String(err)}`]
                    };
                  }
                  return t;
                });
                dbService.savePipelineQueue(updated).then(() => loadData());
                return updated;
              });
              showToast(`Task execution failed: ${err.message || String(err)}`, "error");
            }
          })();
        }
        } // end for runningTasks
      }

      // Start new tasks up to MAX_PARALLEL slots
      const currentRunning = queue.filter(t => t.status === 'running').length;
      const slotsAvailable = MAX_PARALLEL - currentRunning;
      if (slotsAvailable > 0) {
        const queuedTasks = queue.filter(t => t.status === 'queued');
        if (queuedTasks.length > 0) {
          const priorityWeight = { High: 3, Medium: 2, Low: 1 };
          const sortedQueued = [...queuedTasks].sort((a, b) => {
            const weightA = priorityWeight[a.priority as keyof typeof priorityWeight] || 2;
            const weightB = priorityWeight[b.priority as keyof typeof priorityWeight] || 2;
            if (weightA !== weightB) return weightB - weightA;
            return new Date(a.timestamp || '').getTime() - new Date(b.timestamp || '').getTime();
          });

          const toStart = sortedQueued.slice(0, slotsAvailable);
          const updated = queue.map(t => {
            if (toStart.some(s => s.id === t.id)) {
              return { ...t, status: 'running', progress: t.progress || 0 };
            }
            return t;
          });
          setQueue(updated);
          dbService.savePipelineQueue(updated).then(() => loadData());
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [queue, executeTasksInBrowser, maxParallelTasks, lang, isQueueLoaded]);

}
