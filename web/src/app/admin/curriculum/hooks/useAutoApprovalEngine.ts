import React, { useEffect } from 'react';
import { dbService, MockCourse } from '@/lib/db';

export interface UseAutoApprovalEngineProps {
  autoTranslate: boolean;
  translationRequests: any[];
  queue: any[];
  setQueue: React.Dispatch<React.SetStateAction<any[]>>;
  autoTranslateDelayHours: number;
  transThreshold: number;
  refusedTranslations: any[];
  autoApprove: boolean;
  proposals: any[];
  historyList: any[];
  threshold: number;
  autoApproveDelayHours: number;
  globalCourseCap: number;
  refusedCourses: any[];
  autoRevision: boolean;
  feedbacks: any[];
  courses: MockCourse[];
  revThreshold: number;
  revMinVotes: number;
  revMinReports: number;
  autoRevisionDelayHours: number;
  refusedRevisions: any[];
  revRetentionDays: number;
  loadData: () => Promise<void>;
}

export function useAutoApprovalEngine({
  autoTranslate,
  translationRequests,
  queue,
  setQueue,
  autoTranslateDelayHours,
  transThreshold,
  refusedTranslations,
  autoApprove,
  proposals,
  historyList,
  threshold,
  autoApproveDelayHours,
  globalCourseCap,
  refusedCourses,
  autoRevision,
  feedbacks,
  courses,
  revThreshold,
  revMinVotes,
  revMinReports,
  autoRevisionDelayHours,
  refusedRevisions,
  revRetentionDays,
  loadData
}: UseAutoApprovalEngineProps) {
  useEffect(() => {
    if (autoTranslate && translationRequests.length > 0) {
      let updatedQueue = [...queue];
      let promoted = false;

      translationRequests.forEach(p => {
        // Enforce delay period (at least autoTranslateDelayHours, min 24 hours) for translation auto-approval
        const elapsedHours = (Date.now() - new Date(p.timestamp).getTime()) / (1000 * 60 * 60);
        
        if (elapsedHours >= autoTranslateDelayHours || p.isRevisionTriggered) {
          const taskTitle = `${p.courseTitle} (${p.targetLang.toUpperCase()})`;
          const isInQueue = updatedQueue.some(t => t.title.toLowerCase() === taskTitle.toLowerCase() && (t.status === 'queued' || t.status === 'running'));

          if (!isInQueue) {
            const newTask = {
              id: `task_auto_t_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              title: taskTitle,
              type: 'translation',
              status: 'queued',
              progress: 0,
              priority: p.priority || 'Medium',
              targetLang: p.targetLang.toUpperCase(),
              timestamp: new Date().toISOString(),
              details: p.isRevisionTriggered 
                ? `Autonomous Auto-Translate: Condition 3 Triggered by systemic revision: "${p.revisionReason}".`
                : `Autonomous Auto-Translate: Spike score ${p.count} (Failed searches: ${p.failedCount}, Completions: ${p.completionCount}). Delayed ${Math.round(elapsedHours)}h.`
            };
            updatedQueue.push(newTask);
            promoted = true;
          }
        }
      });

      if (promoted) {
        setQueue(updatedQueue);
        dbService.savePipelineQueue(updatedQueue);
        loadData();
      }
    }
  }, [translationRequests, autoTranslate, autoTranslateDelayHours, queue]);


  // REACTIVE AUTONOMY ENGINE loop
  useEffect(() => {
    if (autoApprove && proposals.length > 0) {
      let updatedQueue = [...queue];
      let promoted = false;

      proposals.forEach(p => {
        // Enforce delay period (at least autoApproveDelayHours) for auto-approval
        let hoursElapsed = 0;
        if (p.reason === "Search Demand") {
          const matches = historyList.filter(h => h.query.toLowerCase() === p.query.toLowerCase() && !h.wasSuccessful);
          const oldest = matches.reduce((min, cur) => {
            const t = new Date(cur.timestamp).getTime();
            return t < min ? t : min;
          }, Date.now());
          hoursElapsed = (Date.now() - oldest) / (1000 * 60 * 60);
        } else if (p.reason === "Academic Expansion") {
          // Find prereq course
          const prereq = courses.find(c => p.source.includes(c.title));
          const createdTime = prereq?.created_at ? new Date(prereq.created_at).getTime() : (Date.now() - 30 * 24 * 60 * 60 * 1000);
          hoursElapsed = (Date.now() - createdTime) / (1000 * 60 * 60);
        }

        const isDelayedEnough = hoursElapsed >= autoApproveDelayHours;

        // Auto approve if threshold met AND delay period has passed
        const isCourse = courses.some(c => c.title.toLowerCase() === p.query.toLowerCase());
        const isInQueue = updatedQueue.some(t => t.title.toLowerCase() === p.query.toLowerCase());

        // Auto approve if threshold met AND delay period has passed AND course doesn't already exist
        if (p.count >= threshold && isDelayedEnough && !isCourse && !isInQueue) {
          updatedQueue.push({
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: p.query,
            type: 'generation',
            status: 'queued',
            progress: 0,
            priority: p.count >= 15 ? 'High' : 'Medium',
            timestamp: new Date().toISOString(),
            targetLang: lang,
            level: normalizeLevel(p.level || 'L1'),
            subject: p.subject || 'General'
          });
          promoted = true;
        }
      });

      if (promoted) {
        setQueue(updatedQueue);
        dbService.savePipelineQueue(updatedQueue);
        loadData();
      }
    }
  }, [proposals, autoApprove, threshold, autoApproveDelayHours, historyList, courses]);

  // REACTIVE AUTO-TRANSLATION LOOP
  useEffect(() => {
    if (autoTranslate && translationRequests.length > 0) {
      let updatedQueue = [...queue];
      let promoted = false;

      translationRequests.forEach(tr => {
        if (tr.count >= transThreshold || tr.isRevisionTriggered) {
          const taskTitle = `${tr.courseTitle} (${tr.targetLang.toUpperCase()})`;
          const isInQueue = updatedQueue.some(t => t.title.toLowerCase() === taskTitle.toLowerCase() && (t.status === 'queued' || t.status === 'running'));
          const isRefused = refusedTranslations.some(rt => rt.name.toLowerCase() === tr.courseTitle.toLowerCase() && rt.targetLang.toLowerCase() === tr.targetLang.toLowerCase());
          
          // Prevent duplicate translation generation unless revision-triggered
          const targetCourse = courses.find(c => c.title.toLowerCase() === tr.courseTitle.toLowerCase());
          const alreadyTranslated = !tr.isRevisionTriggered && targetCourse && targetCourse.translations && targetCourse.translations[tr.targetLang.toUpperCase()];

          if (!isInQueue && !isRefused && !alreadyTranslated) {
            updatedQueue.push({
              id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              title: taskTitle,
              type: 'translation',
              status: 'queued',
              progress: 0,
              priority: tr.priority || 'Medium',
              targetLang: tr.targetLang.toUpperCase(),
              timestamp: new Date().toISOString()
            });
            promoted = true;
          }
        }
      });

      if (promoted) {
        setQueue(updatedQueue);
        dbService.savePipelineQueue(updatedQueue);
        loadData();
      }
    }
  }, [translationRequests, autoTranslate, transThreshold, queue, refusedTranslations, courses]);

  // REACTIVE AUTO-REVISION LOOP
  useEffect(() => {
    if (autoRevision && feedbacks.length > 0) {
      let updatedQueue = [...queue];
      let promoted = false;

      // Group untreated feedbacks by courseId
      const courseFeedbacksMap: Record<string, any[]> = {};
      feedbacks.forEach(f => {
        // Skip treated feedbacks
        if (f.isTreated || f.is_treated) return;

        // Skip feedbacks older than last_revision_date (Version Governance)
        const course = courses.find(c => 
          c.slug === f.courseId || 
          String(c.id) === f.courseId || 
          c.title.toLowerCase().replace(/ /g, '_') === f.courseId.toLowerCase()
        );
        
        if (course) {
          if (course.last_revision_date && new Date(f.timestamp).getTime() < new Date(course.last_revision_date).getTime()) {
            return;
          }
        }

        const key = f.courseId;
        if (!courseFeedbacksMap[key]) {
          courseFeedbacksMap[key] = [];
        }
        courseFeedbacksMap[key].push(f);
      });

      Object.entries(courseFeedbacksMap).forEach(([courseId, list]) => {
        const course = courses.find(c => 
          c.slug === courseId || 
          String(c.id) === courseId || 
          c.title.toLowerCase().replace(/ /g, '_') === courseId.toLowerCase()
        );
        if (!course) return;

        // Get all feedbacks to compute average rating and total votes for the course
        const allCourseFeedbacks = feedbacks.filter(f => f.courseId === courseId);
        const overallVotes = allCourseFeedbacks.length;
        const overallRating = overallVotes > 0
          ? allCourseFeedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / overallVotes
          : 0;

        // Condition 1: Low average rating (overallRating <= revThreshold AND total votes >= revMinVotes)
        const condition1_LowRating = (overallRating > 0 && overallRating <= revThreshold && overallVotes >= revMinVotes);

        // Condition 2: Concordant reports (Untreated count >= revMinReports)
        const untreatedCount = list.length;
        const condition2_Concordance = (untreatedCount >= revMinReports);

        if (condition1_LowRating || condition2_Concordance) {
          const mainIssues = list.slice(0, 3).map(f => f.comment).join('; ');
          const taskTitle = `${course.title} - Revise: Batch revision for issues (${mainIssues})`;

          const isInQueue = updatedQueue.some(t => 
            t.type === 'revision' && 
            t.title.toLowerCase().startsWith(course.title.toLowerCase() + ' - revise')
          );
          const isRefused = refusedRevisions.some(r => r.course.toLowerCase() === course.title.toLowerCase());

          if (!isInQueue && !isRefused) {
            updatedQueue.push({
              id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              title: taskTitle,
              type: 'revision',
              status: 'queued',
              progress: 0,
              priority: condition1_LowRating ? 'High' : 'Medium',
              timestamp: new Date().toISOString()
            });
            promoted = true;
          }
        }
      });

      if (promoted) {
        setQueue(updatedQueue);
        dbService.savePipelineQueue(updatedQueue);
        loadData();
      }
    }
  }, [feedbacks, autoRevision, revThreshold, revMinVotes, revMinReports, queue, refusedRevisions, courses]);

  // REACTIVE REFUSED REVISIONS CLEANUP LOOP (Purges expired refused revisions based on revRetentionDays)
  useEffect(() => {
    const now = Date.now();
    const expiredRefusedRevisions = refusedRevisions.filter(rr => {
      const elapsedDays = (now - new Date(rr.timestamp || now).getTime()) / (1000 * 60 * 60 * 24);
      return elapsedDays >= revRetentionDays;
    });

    if (expiredRefusedRevisions.length > 0) {
      Promise.all(expiredRefusedRevisions.map(rr => dbService.deleteRefusedRevision(rr.id))).then(() => {
        loadData();
      });
    }
  }, [refusedRevisions, revRetentionDays]);


}
