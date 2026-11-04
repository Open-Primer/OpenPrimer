import { cleanPathSegment } from '@/lib/translations';
import React, { useMemo } from 'react';
import { MockCourse } from '@/lib/db';

export interface UseCurriculumFiltersProps {
  feedbacks: any[];
  courses: MockCourse[];
  refusedRevisions: any[];
  proposals: any[];
  proposalSearch: string;
  proposalPage: number;
  CARD_LIMIT: number;
  refusedCourses: any[];
  refusedSearch: string;
  refusedPage: number;
  translationRequests: any[];
  transSearch: string;
  transPage: number;
  queue: any[];
  queueSearch: string;
  queuePage: number;
  QUEUE_LIMIT: number;
  queueSortField: string;
  queueSortDir: 'asc' | 'desc';
  refusedTranslations: any[];
  refusedArchivals: any[];
  archiveProposalSearch: string;
  archiveRefusedSearch: string;
  revisionProposalSearch: string;
  revisionRefusedSearch: string;
  translationRefusedSearch: string;
  revThreshold?: number;
  revMinVotes?: number;
  revMinReports?: number;
  archiveRatingThreshold?: number;
  archiveMinVotes?: number;
  archiveMinRevisions?: number;
}

export function useCurriculumFilters({
  feedbacks,
  courses,
  refusedRevisions,
  proposals,
  proposalSearch,
  proposalPage,
  CARD_LIMIT,
  refusedCourses,
  refusedSearch,
  refusedPage,
  translationRequests,
  transSearch,
  transPage,
  queue,
  queueSearch,
  queuePage,
  QUEUE_LIMIT,
  queueSortField,
  queueSortDir,
  refusedTranslations,
  refusedArchivals,
  archiveProposalSearch,
  archiveRefusedSearch,
  revisionProposalSearch,
  revisionRefusedSearch,
  translationRefusedSearch,
  revThreshold = 3,
  revMinVotes = 5,
  revMinReports = 2,
  archiveRatingThreshold = 2.5,
  archiveMinVotes = 10,
  archiveMinRevisions = 3
}: UseCurriculumFiltersProps) {
  const activeRevisionProposals = React.useMemo(() => {
    // 1. Group feedbacks by courseId and chapter (or parse chapter from comment)
    const parsedFeedbacks = feedbacks.map(f => {
      const commentLower = f.comment.toLowerCase();
      let chapter = "General Content";
      const chMatch = commentLower.match(/(?:chapter|chapitre|ch)\s*(\d+|\w+)/);
      if (chMatch && chMatch[1]) {
        chapter = `Chapter ${chMatch[1].toUpperCase()}`;
      } else if (commentLower.includes("lagrangian")) {
        chapter = "Chapter 2: Lagrangian Mechanics";
      } else if (commentLower.includes("coriolis")) {
        chapter = "Chapter 3: Coriolis Forces";
      } else if (commentLower.includes("hamiltonian")) {
        chapter = "Chapter 4: Hamiltonian Systems";
      } else if (commentLower.includes("atp") || commentLower.includes("cell")) {
        chapter = "Chapter 1: ATP Synthesis";
      } else if (commentLower.includes("transcription") || commentLower.includes("dna")) {
        chapter = "Chapter 2: Transcription";
      } else if (commentLower.includes("stereochemistry") || commentLower.includes("sn1")) {
        chapter = "Chapter 3: Stereochemistry";
      } else if (commentLower.includes("vector") || commentLower.includes("matrix")) {
        chapter = "Chapter 1: Linear Algebra";
      } else if (commentLower.includes("oligopoly")) {
        chapter = "Chapter 2: Oligopoly Markets";
      }
      return { ...f, chapter };
    });

    const groups: Record<string, {
      courseId: string;
      chapter: string;
      comments: string[];
      ratings: number[];
      newestFeedback: string;
      oldestTimestamp: string;
      count: number;
    }> = {};

    parsedFeedbacks.forEach(f => {
      // Skip already treated/resolved feedbacks
      if (f.isTreated || f.is_treated) {
        return;
      }

      // Find the corresponding course object to check Version Governance
      const course = courses.find(c => c.slug === cleanPathSegment(f.courseId) || String(c.id) === f.courseId || cleanPathSegment(c.title) === cleanPathSegment(f.courseId));
      if (course) {
        // Governance: If this feedback item was created BEFORE the last_revision_date, skip it!
        if (course.last_revision_date && new Date(f.timestamp).getTime() < new Date(course.last_revision_date).getTime()) {
          return;
        }
      }

      const key = `${f.courseId}-${f.chapter}`;
      if (!groups[key]) {
        groups[key] = {
          courseId: f.courseId,
          chapter: f.chapter,
          comments: [],
          ratings: [],
          newestFeedback: f.timestamp,
          oldestTimestamp: f.timestamp,
          count: 0
        };
      }
      groups[key].comments.push(f.comment);
      groups[key].ratings.push(f.rating);
      groups[key].count += 1;
      if (new Date(f.timestamp).getTime() > new Date(groups[key].newestFeedback).getTime()) {
        groups[key].newestFeedback = f.timestamp;
      }
      if (new Date(f.timestamp).getTime() < new Date(groups[key].oldestTimestamp).getTime()) {
        groups[key].oldestTimestamp = f.timestamp;
      }
    });

    // 2. Synthesize Revision Proposals based on Triggers
    const list: any[] = [];

    Object.values(groups).forEach(g => {
      const course = courses.find(c => c.slug === cleanPathSegment(g.courseId) || String(c.id) === g.courseId || cleanPathSegment(c.title) === cleanPathSegment(g.courseId));
      if (!course) return;

      // Check if this specific course + chapter proposal is already in the Refused Backlog
      const isRefused = refusedRevisions.some(r => r.course.toLowerCase() === course.title.toLowerCase() && r.issueSummary.includes(g.chapter));
      if (isRefused) return;

      // Check if it's already in the dynamic active queue
      const inQueue = queue.some(q => q.type === 'revision' && q.title.includes(course.title) && q.title.includes(g.chapter));
      if (inQueue) return;

      // Calculate overall ratings metrics for Trigger 1
      const courseFeedbacksList = feedbacks.filter(f => f.courseId === g.courseId);
      const overallVotes = courseFeedbacksList.length;
      const overallRating = overallVotes > 0
        ? courseFeedbacksList.reduce((sum, f) => sum + f.rating, 0) / overallVotes
        : 0;

      // Triggers Evaluation
      const condition1_LowRating = (overallRating > 0 && overallRating <= revThreshold && overallVotes >= revMinVotes);
      const condition2_Concordance = (g.count >= revMinReports);

      if (condition1_LowRating || condition2_Concordance) {
        // Compile synthesis comment: dedicated AI synthesis agent compiles it
        const cause = condition2_Concordance 
          ? `AI Synthesis: Concordant issues found in ${g.chapter} (${g.count} users reported similar bugs: "${g.comments[0]}" & "${g.comments[1] || ''}")`
          : `AI Synthesis: Poor global rating of ${overallRating.toFixed(1)}/5 stars on course "${course.title}" from ${overallVotes} reviews.`;

        // Calculate suggested composite priority score
        // Score = (5.0 - Average Rating) * Votes + Report Count * 3
        const score = Math.round((5.0 - overallRating) * overallVotes + g.count * 3);

        list.push({
          id: `rev_prop_${course.id}_${g.chapter.replace(/\s+/g, '_')}`,
          courseId: course.id,
          courseTitle: course.title,
          level: course.level,
          chapter: g.chapter,
          overallRating,
          overallVotes,
          reportCount: g.count,
          issueSummary: cause,
          comments: g.comments,
          reason: condition2_Concordance ? 'Concordant Reports' : 'Low Global Rating',
          score,
          version: course.version || 'v1.0.0',
          lastRevisionDate: course.last_revision_date || course.created_at || new Date().toISOString()
        });
      }
    });

    // Sort by suggested priority score descending
    return list.sort((a, b) => b.score - a.score);
  }, [feedbacks, courses, refusedRevisions, queue, revThreshold, revMinVotes, revMinReports]);

  // Cockpit Scale Computed Filtered Arrays
  const filteredProposals = proposals.filter(item => {
    const q = item.query || '';
    const r = item.reason || '';
    const searchLower = proposalSearch.toLowerCase();
    return q.toLowerCase().includes(searchLower) || r.toLowerCase().includes(searchLower);
  });
  const paginatedProposals = filteredProposals.slice(
    (proposalPage - 1) * CARD_LIMIT,
    proposalPage * CARD_LIMIT
  );
  const totalProposalPages = Math.ceil(filteredProposals.length / CARD_LIMIT) || 1;

  const filteredRefused = refusedCourses.filter(item => {
    const name = item.name || '';
    return name.toLowerCase().includes(refusedSearch.toLowerCase());
  });
  const totalRefusedPages = Math.ceil(filteredRefused.length / CARD_LIMIT) || 1;
  const paginatedRefused = filteredRefused.slice(
    (Math.min(refusedPage, totalRefusedPages) - 1) * CARD_LIMIT,
    Math.min(refusedPage, totalRefusedPages) * CARD_LIMIT
  );

  const filteredTrans = translationRequests.filter(item => {
    const title = item.courseTitle || '';
    const langVal = item.targetLang || '';
    const searchLower = transSearch.toLowerCase();
    return title.toLowerCase().includes(searchLower) || langVal.toLowerCase().includes(searchLower);
  });
  const totalTransPages = Math.ceil(filteredTrans.length / CARD_LIMIT) || 1;
  const paginatedTrans = filteredTrans.slice(
    (Math.min(transPage, totalTransPages) - 1) * CARD_LIMIT,
    Math.min(transPage, totalTransPages) * CARD_LIMIT
  );

  const filteredQueue = queue.filter(item => {
    const title = item.title || '';
    const type = item.type || '';
    const searchLower = queueSearch.toLowerCase();
    return title.toLowerCase().includes(searchLower) || type.toLowerCase().includes(searchLower);
  });
  // Sort filteredQueue in the computed section so paginatedQueue is correctly sorted+sliced
  const sortedQueue = [...filteredQueue].sort((a, b) => {
    // Put running tasks on top
    const isRunningA = a.status === 'running' ? 1 : 0;
    const isRunningB = b.status === 'running' ? 1 : 0;
    if (isRunningA !== isRunningB) {
      return isRunningB - isRunningA; // 1 (running) comes first
    }

    if (queueSortField === 'priority') {
      const pw: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      const wA = pw[a.priority || 'Medium'] || 0;
      const wB = pw[b.priority || 'Medium'] || 0;
      return queueSortDir === 'desc' ? wB - wA : wA - wB;
    }
    let valA: any = a[queueSortField] || '';
    let valB: any = b[queueSortField] || '';
    if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = String(valB).toLowerCase(); }
    if (valA < valB) return queueSortDir === 'asc' ? -1 : 1;
    if (valA > valB) return queueSortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const totalQueuePages = Math.ceil(filteredQueue.length / QUEUE_LIMIT) || 1;
  // Safe page indices — clamp to valid range so deleting items never leaves an empty page
  const safeProposalPage = Math.min(proposalPage, totalProposalPages);
  const safeRefusedPage  = Math.min(refusedPage,  totalRefusedPages);
  const safeTransPage    = Math.min(transPage,    totalTransPages);
  const safeQueuePage    = Math.min(queuePage,    totalQueuePages);
  const paginatedQueue   = sortedQueue.slice((safeQueuePage - 1) * QUEUE_LIMIT, safeQueuePage * QUEUE_LIMIT);

  // Active Archival Proposals
  const activeArchivalProposals = React.useMemo(() => {
    const list: any[] = [];
    courses.forEach(course => {
      const currentLevel = course.archivingLevel ?? course.archiving_level ?? 0;
      if (currentLevel >= 1) return;

      const isRefused = refusedArchivals.some(r => r.id === course.id);
      if (isRefused) return;

      const courseFeedbacksList = feedbacks.filter(f => 
        f.courseId === course.slug || 
        String(f.courseId) === String(course.id) || 
        f.courseId?.toLowerCase().replace(/ /g, '_') === course.title?.toLowerCase().replace(/ /g, '_')
      );
      const overallVotes = courseFeedbacksList.length;
      const overallRating = overallVotes > 0
        ? courseFeedbacksList.reduce((sum, f) => sum + f.rating, 0) / overallVotes
        : 0;

      let revisionCount = 1;
      if (course.version) {
        const numbers = course.version.match(/\d+/g);
        if (numbers && numbers.length > 1) {
          revisionCount = parseInt(numbers[1], 10);
        } else if (numbers && numbers.length > 0) {
          revisionCount = parseInt(numbers[0], 10);
        }
      } else {
        revisionCount = (course.id % 4) + 4;
      }

      const condition_Archivable = (
        overallRating > 0 && 
        overallRating <= archiveRatingThreshold && 
        overallVotes >= archiveMinVotes && 
        revisionCount >= archiveMinRevisions
      );

      if (condition_Archivable) {
        const score = Math.round((5.0 - overallRating) * overallVotes + revisionCount * 5);
        const reason = 'Combined Trigger: Low Rating After Minimum Revisions';
        const cause = `AI Synthesis: Course rating is ${overallRating.toFixed(1)}/5 stars (from ${overallVotes} reviews) after reaching ${revisionCount} revisions.`;

        list.push({
          id: course.id,
          title: course.title,
          slug: course.slug,
          level: course.level,
          subject: course.subject,
          overallRating,
          overallVotes,
          revisionCount,
          reason,
          description: cause,
          score,
          version: course.version || 'v1.0.0'
        });
      }
    });
    return list.sort((a, b) => b.score - a.score);
  }, [courses, feedbacks, refusedArchivals, archiveRatingThreshold, archiveMinVotes, archiveMinRevisions]);

  // Derived Filtered arrays for search bars
  const filteredActiveRevisionProposals = activeRevisionProposals.filter(item => {
    const s = revisionProposalSearch.toLowerCase();
    return item.courseTitle.toLowerCase().includes(s) || item.chapter.toLowerCase().includes(s) || item.issueSummary.toLowerCase().includes(s) || item.reason.toLowerCase().includes(s);
  });

  const filteredRefusedRevisions = refusedRevisions.filter(item => {
    const s = revisionRefusedSearch.toLowerCase();
    return item.course.toLowerCase().includes(s) || item.issueSummary.toLowerCase().includes(s);
  });

  const filteredRefusedTranslations = refusedTranslations.filter(item => {
    const s = translationRefusedSearch.toLowerCase();
    return item.name.toLowerCase().includes(s) || item.targetLang.toLowerCase().includes(s);
  });

  const filteredActiveArchivalProposals = activeArchivalProposals.filter(item => {
    const s = archiveProposalSearch.toLowerCase();
    return item.title.toLowerCase().includes(s) || item.subject.toLowerCase().includes(s) || item.reason.toLowerCase().includes(s);
  });

  const filteredRefusedArchivals = refusedArchivals.filter(item => {
    const s = archiveRefusedSearch.toLowerCase();
    return item.title.toLowerCase().includes(s) || item.subject.toLowerCase().includes(s);
  });



  return {
    activeRevisionProposals,
    filteredProposals,
    paginatedProposals,
    totalProposalPages,
    safeProposalPage,
    filteredRefused,
    paginatedRefused,
    totalRefusedPages,
    safeRefusedPage,
    filteredTrans,
    paginatedTrans,
    totalTransPages,
    safeTransPage,
    filteredQueue,
    sortedQueue,
    paginatedQueue,
    totalQueuePages,
    safeQueuePage,
    activeArchivalProposals,
    filteredActiveArchivalProposals,
    filteredRefusedRevisions,
    filteredRefusedTranslations,
    filteredRefusedArchivals
  };
}
