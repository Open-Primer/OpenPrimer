import { cleanPathSegment } from '@/lib/translations';
import React, { useEffect } from 'react';
import { dbService, MockCourse } from '@/lib/db';
import { areTitlesTooSimilar, POTENTIAL_CURRICULA } from '../strings';

export interface UseProposalsEngineProps {
  loadData?: () => Promise<void>;
  historyList: any[];
  completions: any[];
  courses: MockCourse[];
  refusedCourses: any[];
  refusedTranslations: any[];
  queue: any[];
  availableLanguages: any[];
  validationsThreshold: number;
  reevaluationDays: number;
  backlogRetention: number;
  transValidationsThreshold: number;
  transReevaluationDays: number;
  transBacklogRetention: number;
  setProposals: React.Dispatch<React.SetStateAction<any[]>>;
  setTranslationRequests: React.Dispatch<React.SetStateAction<any[]>>;
}

export function useProposalsEngine({
  loadData = async () => {},
  historyList,
  completions,
  courses,
  refusedCourses,
  refusedTranslations,
  queue,
  availableLanguages,
  validationsThreshold,
  reevaluationDays,
  backlogRetention,
  transValidationsThreshold,
  transReevaluationDays,
  transBacklogRetention,
  setProposals,
  setTranslationRequests
}: UseProposalsEngineProps) {
  useEffect(() => {
    if (courses.length === 0) return;
    
    // Group failed searches within the log retention limit period
    const failed = historyList.filter(h => {
      if (h.wasSuccessful) return false;
      const elapsedDays = (Date.now() - new Date(h.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return elapsedDays <= backlogRetention;
    });

    const groups: Record<string, any> = {};
    failed.forEach(h => {
      const q = h.query;
      if (!groups[q.toLowerCase()]) {
        groups[q.toLowerCase()] = { query: q, count: 0, lang: h.userLanguage || 'EN' };
      }
      groups[q.toLowerCase()].count += 1;
    });

    // 15 days (reevaluationDays) re-evaluation check & clean
    const now = Date.now();
    const expiredRefused = refusedCourses.filter(rc => {
      const elapsedDays = (now - new Date(rc.timestamp || now).getTime()) / (1000 * 60 * 60 * 24);
      return elapsedDays >= reevaluationDays;
    });

    // Automatically purge expired refused courses immediately
    if (expiredRefused.length > 0) {
      Promise.all(expiredRefused.map(rc => dbService.deleteRefusedCourse(rc.id))).then(() => {
        loadData();
      });
      return;
    }

    // Reactive Log Retention Archiving check (automatic background purge of old failed search logs)
    const oldSearches = historyList.filter(h => {
      const ageDays = (now - new Date(h.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return ageDays > backlogRetention;
    });
    if (oldSearches.length > 0) {
      // Reactively trigger database cleaning for everything older than backlogRetention
      dbService.cleanupSearchHistory(backlogRetention);
      dbService.cleanupCourseFeedbacks(backlogRetention);
      dbService.cleanupTranslationRequests(backlogRetention).then(() => {
        loadData();
      });
      return;
    }

    const proposedList: any[] = [];

    // Process failed search queries as candidates
    Object.values(groups).forEach(g => {
      const title = g.query;
      const lowerTitle = title.toLowerCase();

      // Check if course already exists in catalog, refused backlog, or pipeline queue
      const isCourse = courses.some(c => c.title.toLowerCase() === lowerTitle || c.slug === cleanPathSegment(title));
      const isRefused = refusedCourses.some(rc => rc.name.toLowerCase() === lowerTitle);
      const isInQueue = queue.some(t => t.title.toLowerCase() === lowerTitle);

      if (!isCourse && !isRefused && !isInQueue) {
        const searchesScore = g.count;
        const priority = searchesScore >= 15 ? 'High' : 'Medium';
        proposedList.push({
          query: title,
          count: searchesScore,
          reason: "Search Demand",
          source: `Failed Searches: ${searchesScore}`,
          priority,
          score: searchesScore,
          level: 'L1'
        });
      }
    });

    // Process academic expansion suggestions (Sovereign Academic Expansion)
    courses.forEach(course => {
      // Count completions ONLY within the backlogRetention period (ignore older completions!)
      const courseCompletions = completions.filter(c => {
        const courseIdMatch = c.courseId.toLowerCase() === String(course.id).toLowerCase() || 
                              c.courseId.toLowerCase() === course.slug.toLowerCase() || 
                              c.courseId.toLowerCase() === course.title.toLowerCase();
        if (!courseIdMatch) return false;
        
        const elapsedDays = (Date.now() - new Date(c.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return elapsedDays <= backlogRetention;
      });

      const validationsCount = courseCompletions.length;

      if (validationsCount >= validationsThreshold) {
        let nextLevel = '';
        let nextTitlePrefix = '';
        if (course.level === 'L1') {
          nextLevel = 'L2';
          nextTitlePrefix = 'Advanced';
        } else if (course.level === 'L2') {
          nextLevel = 'L3';
          nextTitlePrefix = 'Masterclass';
        } else if (course.level === 'L3') {
          nextLevel = 'M1';
          nextTitlePrefix = 'Research';
        } else if (course.level === 'M1') {
          nextLevel = 'M2';
          nextTitlePrefix = 'Specialized';
        }
        
        if (nextLevel) {
          // Remove level prefixes to make cleaner progression course name
          const baseTitle = course.title.replace(/(L1|L2|L3|M1|M2|Advanced|Masterclass|Research|Specialized|Physique|Biologie|Droit|Maths|Test|\(.*\))/g, '').trim();
          const proposedTitle = `${nextTitlePrefix} ${baseTitle}`;
          const lowerProposed = proposedTitle.toLowerCase();
          
          const isCourse = courses.some(c => c.title.toLowerCase() === lowerProposed);
          const isInQueue = queue.some(t => t.title.toLowerCase() === lowerProposed);
          const isRefused = refusedCourses.some(rc => rc.name.toLowerCase() === lowerProposed);
          
          if (!isCourse && !isInQueue && !isRefused) {
            // Check if there are also failed searches for this proposed progression course
            const matchingSearchCount = groups[lowerProposed]?.count || 0;
            const score = validationsCount + matchingSearchCount;
            const priority = score >= 12 ? 'High' : 'Medium';

            // Avoid adding double proposals if already added via search demand
            const existingProposalIdx = proposedList.findIndex(p => p.query.toLowerCase() === lowerProposed);
            if (existingProposalIdx !== -1) {
              // Merge them
              proposedList[existingProposalIdx].reason = "Academic Expansion";
              proposedList[existingProposalIdx].source = `Validated Prereq: ${course.title} (${validationsCount} completions) + Failed Searches`;
              proposedList[existingProposalIdx].score = score;
              proposedList[existingProposalIdx].priority = priority;
            } else {
              proposedList.push({
                query: proposedTitle,
                count: score,
                reason: "Academic Expansion",
                source: `Next-Level Progression based on "${course.title}" (${validationsCount} recent completions)`,
                priority,
                score,
                level: nextLevel
              });
            }
          }
        }
      }
    });

    // Condition 3: Complete Core Curriculum Synthesis (Synthetic Curriculum Synthesis)
    POTENTIAL_CURRICULA.forEach(curr => {
      const exists = courses.some(c => c.isCurriculum && c.title.toLowerCase() === curr.title.toLowerCase()) ||
                     queue.some(t => t.isCurriculum && t.title.toLowerCase() === curr.title.toLowerCase());
      
      if (!exists) {
        // Check if all constituent childCourses exist in the system as active courses
        const allConstituentsExist = curr.childCourses.every(childId => 
          courses.some(c => c.id === childId)
        );
        
        if (allConstituentsExist) {
          proposedList.push({
            query: curr.title,
            count: 15,
            reason: "Curriculum Synthesis",
            source: `Condition 3: All constituent courses (${curr.childCourses.join(', ')}) exist in catalog.`,
            priority: "High",
            score: 15,
            isCurriculum: true,
            level: curr.level,
            subject: curr.subject,
            description: curr.description
          });
        }
      }
    });

    setProposals(proposedList);
  }, [historyList, completions, courses, refusedCourses, queue, validationsThreshold, reevaluationDays, backlogRetention]);

  // Compute Active Translation Proposals (Dynamic Scoring & Safeguards)
  useEffect(() => {
    if (courses.length === 0) return;

    // Filter failed search logs within transBacklogRetention to look for translation requests
    const failedSearches = historyList.filter(h => {
      if (h.wasSuccessful) return false;
      const elapsedDays = (Date.now() - new Date(h.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return elapsedDays <= transBacklogRetention;
    });

    const candidateMap: Record<string, any> = {};

    failedSearches.forEach(h => {
      const query = h.query.toLowerCase().trim();
      const targetLang = (h.userLanguage || 'FR').toUpperCase();

      // Find if this query corresponds to an existing course in another language
      const matchingCourse = courses.find(c => 
        c.title.toLowerCase() === query || 
        c.slug === cleanPathSegment(h.query)
      );

      if (matchingCourse) {
        const canonTitle = matchingCourse.title;
        const key = `${canonTitle}_${targetLang}`;
        
        // Enforce language verification: check if course does NOT already have this language
        const isAlreadyTranslated = (matchingCourse.languages || []).includes(targetLang.toLowerCase()) || 
                                    (matchingCourse.langs || []).includes(targetLang);
        
        if (!isAlreadyTranslated) {
          if (!candidateMap[key]) {
            candidateMap[key] = {
              courseTitle: canonTitle,
              targetLang,
              failedCount: 0,
              completionCount: 0,
              timestamp: h.timestamp
            };
          }
          candidateMap[key].failedCount += 1;
        }
      }
    });

    // Process popular courses for translation (completions >= transValidationsThreshold)
    courses.forEach(course => {
      // Get completions for this course within the transBacklogRetention limit
      const courseCompletions = completions.filter(c => {
        const courseIdMatch = c.courseId.toLowerCase() === String(course.id).toLowerCase() || 
                              c.courseId.toLowerCase() === course.slug.toLowerCase() || 
                              c.courseId.toLowerCase() === course.title.toLowerCase();
        if (!courseIdMatch) return false;
        
        const elapsedDays = (Date.now() - new Date(c.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return elapsedDays <= transBacklogRetention;
      });

      const completionsCount = courseCompletions.length;

      if (completionsCount >= transValidationsThreshold) {
        // Suggest translating this popular course into target languages not yet supported
        availableLanguages.forEach(langItem => {
          const targetLang = langItem.code.toUpperCase();
          const isSupported = (course.languages || []).includes(targetLang.toLowerCase()) || 
                              (course.langs || []).includes(targetLang);

          if (!isSupported) {
            const key = `${course.title}_${targetLang}`;
            if (!candidateMap[key]) {
              candidateMap[key] = {
                courseTitle: course.title,
                targetLang,
                failedCount: 0,
                completionCount: 0,
                timestamp: new Date().toISOString()
              };
            }
            candidateMap[key].completionCount = completionsCount;
          }
        });
      }
    });

    // 15 days (transReevaluationDays) translation re-evaluation check & clean
    const now = Date.now();
    const expiredRefusedTrans = refusedTranslations.filter(rt => {
      // Safely compute age of refused translation
      const elapsedDays = (now - new Date(rt.timestamp || now).getTime()) / (1000 * 60 * 60 * 24);
      return elapsedDays >= transReevaluationDays;
    });

    if (expiredRefusedTrans.length > 0) {
      Promise.all(expiredRefusedTrans.map(rt => dbService.deleteRefusedTranslation(rt.id))).then(() => {
        loadData();
      });
      return;
    }

    // Automatically clean translation emails older than 90 days
    dbService.cleanupTranslationEmails(90);

    // Process systemic revisions for translation parity (Condition 3)
    const completedRevisions = queue.filter(t => 
      (t.type === 'revision' || t.title.toLowerCase().includes('revise:')) &&
      (t.status === 'completed' || t.status === 'complete') &&
      t.isSystemic === true
    );

    completedRevisions.forEach(revTask => {
      let courseTitle = revTask.title;
      const splitIndex = revTask.title.indexOf(' - Revise: ');
      if (splitIndex !== -1) {
        courseTitle = revTask.title.substring(0, splitIndex).trim();
      } else {
        const splitIndex2 = revTask.title.indexOf(' - Revise ');
        if (splitIndex2 !== -1) {
          courseTitle = revTask.title.substring(0, splitIndex2).trim();
        }
      }

      const course = courses.find(c => 
        c.title.toLowerCase() === courseTitle.toLowerCase() || 
        c.slug === cleanPathSegment(courseTitle).toLowerCase() ||
        c.slug === courseTitle
      );

      if (course) {
        const sourceLang = (revTask.targetLang || 'EN').toUpperCase();
        availableLanguages.forEach(langItem => {
          const targetLang = langItem.code.toUpperCase();
          if (targetLang !== sourceLang) {
            // Check if there is a newer completed translation task for this course in targetLang to avoid duplicate triggers
            const newerTranslation = queue.some(qTask => 
              qTask.type === 'translation' && 
              qTask.title.toLowerCase().includes(course.title.toLowerCase()) &&
              qTask.targetLang?.toUpperCase() === targetLang &&
              (qTask.status === 'completed' || qTask.status === 'complete') &&
              new Date(qTask.completedAt || qTask.timestamp || 0).getTime() > new Date(revTask.completedAt || revTask.timestamp || 0).getTime()
            );

            if (!newerTranslation) {
              const key = `${course.title}_${targetLang}`;
              if (!candidateMap[key]) {
                candidateMap[key] = {
                  courseTitle: course.title,
                  targetLang,
                  failedCount: 0,
                  completionCount: 0,
                  timestamp: revTask.completedAt || revTask.timestamp || new Date().toISOString(),
                  isRevisionTriggered: true,
                  revisionReason: revTask.systemicReason || revTask.title
                };
              } else {
                candidateMap[key].isRevisionTriggered = true;
                candidateMap[key].revisionReason = revTask.systemicReason || revTask.title;
              }
            }
          }
        });
      }
    });

    const dynamicProposals: any[] = [];

    // Assemble proposals with dynamic composite scoring and duplicates check
    Object.values(candidateMap).forEach((cand: any) => {
      const lowerCourse = cand.courseTitle.toLowerCase();
      const lowerLang = cand.targetLang.toLowerCase();

      // Duplicates Check: Catalog vs Pipeline vs Refused Backlog
      const targetCourse = courses.find(c => c.title.toLowerCase() === lowerCourse);
      const isAlreadyTranslated = !cand.isRevisionTriggered && targetCourse && (
        (targetCourse.languages || []).includes(lowerLang) || 
        (targetCourse.langs || []).includes(cand.targetLang)
      );

      const isRefused = refusedTranslations.some(rt => 
        rt.name.toLowerCase() === lowerCourse && 
        rt.targetLang.toLowerCase() === lowerLang
      );

      const taskTitle = `${cand.courseTitle} (${cand.targetLang})`;
      const isInPipeline = queue.some(t => t.title.toLowerCase() === taskTitle.toLowerCase() && (t.status === 'queued' || t.status === 'running'));

      if (!isAlreadyTranslated && !isRefused && !isInPipeline) {
        const score = cand.failedCount + cand.completionCount;
        const priority = score >= 15 ? 'High' : 'Medium';

        dynamicProposals.push({
          id: `prop_t_${cand.courseTitle}_${cand.targetLang}`,
          courseTitle: cand.courseTitle,
          targetLang: cand.targetLang,
          count: cand.isRevisionTriggered ? 20 : score,
          failedCount: cand.failedCount,
          completionCount: cand.completionCount,
          isRevisionTriggered: !!cand.isRevisionTriggered,
          revisionReason: cand.revisionReason || "",
          priority: cand.isRevisionTriggered ? 'High' : priority,
          timestamp: cand.timestamp
        });
      }
    });

    setTranslationRequests(dynamicProposals);
  }, [historyList, completions, courses, refusedTranslations, queue, availableLanguages, transValidationsThreshold, transReevaluationDays, transBacklogRetention]);

}
