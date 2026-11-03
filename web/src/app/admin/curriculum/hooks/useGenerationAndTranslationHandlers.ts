import React from 'react';
import { dbService, MockCourse } from '@/lib/db';

export interface UseGenerationAndTranslationHandlersProps {
  queue: any[];
  setQueue: React.Dispatch<React.SetStateAction<any[]>>;
  courses: MockCourse[];
  globalCourseCap: number;
  lang: string;
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  t: any;
  tr: (key: string) => string;
}

export function useGenerationAndTranslationHandlers({
  queue,
  setQueue,
  courses,
  globalCourseCap,
  lang,
  loadData,
  showToast,
  t,
  tr
}: UseGenerationAndTranslationHandlersProps) {
  const handleDeployExpansion = (title: string, prerequisite: string, level: string, subject: string) => {
    const targetLvl = level || 'L1';
    const isTooSimilarCourse = courses.some(c => {
      const cLvl = c.level || 'L1';
      return cLvl.toLowerCase() === targetLvl.toLowerCase() && areTitlesTooSimilar(c.title, title);
    });
    const isTooSimilarInQueue = queue.some(t => {
      if (t.type !== 'generation') return false;
      const tLvl = t.level || 'L1';
      return tLvl.toLowerCase() === targetLvl.toLowerCase() && areTitlesTooSimilar(t.title, title);
    });

    if (isTooSimilarCourse || isTooSimilarInQueue) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      alert(pStrings.alert_progression_exists.replace('{title}', title));
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      type: 'generation',
      status: 'queued',
      progress: 0,
      priority: 'Medium',
      timestamp: new Date().toISOString(),
      details: `Sovereign Academic Expansion: L2 Progression on subject "${subject}". Prerequisite: ${prerequisite}`,
      targetLang: lang,
      level: normalizeLevel(level),
      subject: subject || 'General'
    };
    const updated = [...queue, newTask];
    setQueue(updated);
    dbService.savePipelineQueue(updated);
    loadData();
  };


  const handleApproveGen = (title: string, count: number, level?: string, subject?: string, isCurriculum?: boolean) => {
    const targetLvl = level || 'L1';
    const isTooSimilarCourse = courses.some(c => {
      const cLvl = c.level || 'L1';
      return cLvl.toLowerCase() === targetLvl.toLowerCase() && areTitlesTooSimilar(c.title, title);
    });
    const isTooSimilarInQueue = queue.some(t => {
      if (t.type !== 'generation' && t.type !== 'curriculum') return false;
      const tLvl = t.level || 'L1';
      return tLvl.toLowerCase() === targetLvl.toLowerCase() && areTitlesTooSimilar(t.title, title);
    });

    if (isTooSimilarCourse || isTooSimilarInQueue) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      showToast(pStrings.toast_catalog_similar_exists.replace('{title}', title), 'info');
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      type: isCurriculum ? 'curriculum' : 'generation',
      status: 'queued',
      progress: 0,
      priority: count >= 15 ? 'High' : 'Medium',
      timestamp: new Date().toISOString(),
      targetLang: lang,
      level: normalizeLevel(level || 'L1'),
      subject: subject || 'General',
      details: isCurriculum ? 'Curriculum Generation (CURRICULUM)' : undefined
    };
    const updated = [...queue, newTask];
    setQueue(updated);
    dbService.savePipelineQueue(updated);
    loadData();
  };

  const handleEnforceGlobalCourseCap = async () => {
    const currentCount = courses.length;
    if (currentCount <= globalCourseCap) {
      showToast(
        tr("Catalog is within the cap limit of {max} courses ({current} courses active).")
          .replace('{max}', globalCourseCap.toLocaleString())
          .replace('{current}', currentCount.toLocaleString()),
        'info'
      );
      return;
    }
    const excess = currentCount - globalCourseCap;
    // Sort by rating ascending (lowest performing first)
    const sortedByRating = [...courses].sort((a: any, b: any) => (Number(a.averageRating || a.rating || 0)) - (Number(b.averageRating || b.rating || 0)));
    const toPurge = sortedByRating.slice(0, excess);
    for (const c of toPurge) {
      await dbService.setCourseArchivingLevel(c.id, 3);
    }
    await loadData();
    showToast(
      tr("Course cap enforced: {count} lowest-performing course(s) successfully purged.")
        .replace('{count}', excess.toString()),
      'success'
    );
  };

  const handleRefuseGen = async (query: string) => {
    await dbService.addRefusedCourse({
      id: `ref_c_${Date.now()}`,
      name: query,
      subject: 'Mathematics',
      searches: 5,
      priority: 'High',
      previouslyRefused: true,
      timestamp: new Date().toISOString()
    });
    loadData();
  };

  const deleteRefused = async (id: string) => {
    await dbService.deleteRefusedCourse(id);
    loadData();
  };

  // Translation Handlers
  const handleApproveTrans = (courseTitle: string, targetLang: string) => {
    const taskTitle = `${courseTitle} (${targetLang.toUpperCase()})`;

    // Prevent duplicates in queue
    const isInQueue = queue.some(t => t.title.toLowerCase() === taskTitle.toLowerCase());
    if (isInQueue) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      showToast(pStrings.toast_translation_in_queue.replace('{lang}', targetLang.toUpperCase()), 'info');
      return;
    }

    // Prevent duplicate translation generation if course already has it
    const targetCourse = courses.find(c => c.title.toLowerCase() === courseTitle.toLowerCase());
    const alreadyTranslated = targetCourse && targetCourse.translations && targetCourse.translations[targetLang.toUpperCase()];
    if (alreadyTranslated) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      showToast(pStrings.toast_already_translated.replace('{lang}', targetLang.toUpperCase()), 'info');
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: taskTitle,
      type: 'translation',
      status: 'queued',
      progress: 0,
      priority: 'Medium',
      targetLang: targetLang.toUpperCase(),
      timestamp: new Date().toISOString()
    };
    const updated = [...queue, newTask];
    setQueue(updated);
    dbService.savePipelineQueue(updated);
  };

  const handleRefuseTrans = async (title: string, targetLang: string) => {
    await dbService.addRefusedTranslation({
      id: `ref_t_${Date.now()}`,
      name: title,
      sourceLang: 'en',
      targetLang,
      requests: 3,
      priority: 'Low',
      previouslyRefused: true,
      timestamp: new Date().toISOString()
    });
    loadData();
  };



  return {
    handleDeployExpansion,
    handleApproveGen,
    handleEnforceGlobalCourseCap,
    handleRefuseGen,
    deleteRefused,
    handleApproveTrans,
    handleRefuseTrans
  };
}
