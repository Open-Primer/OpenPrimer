import React, { useState, useEffect, useRef } from 'react';
import { dbService, Achievement, TutorPersonality, MockCourse } from '@/lib/db';
import { normalizeLevel, translateMetadataForLanguage } from '../strings';

export interface UseCurriculumDataProps {
  lang: string;
}

export function useCurriculumData({ lang }: UseCurriculumDataProps) {
  const [view, setView] = useState<'generation' | 'translation' | 'revision' | 'archiving' | 'queue' | 'widgets' | 'achievements' | 'personalities'>('generation');
  
// Database States
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [refusedCourses, setRefusedCourses] = useState<any[]>([]);
  const [refusedTranslations, setRefusedTranslations] = useState<any[]>([]);
  const [refusedRevisions, setRefusedRevisions] = useState<any[]>([]);
  const [translationRequests, setTranslationRequests] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);
  const [courses, setCourses] = useState<MockCourse[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [personalities, setPersonalities] = useState<TutorPersonality[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [isQueueLoaded, setIsQueueLoaded] = useState(false);
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSandboxMode(window.localStorage.getItem('op_allow_sandbox') === 'true');
    }
  }, []);


  // Autonomy settings
  const [autoApprove, setAutoApprove] = useState(false);
  const [threshold, setThreshold] = useState(5);
  const [autoApproveDelayHours, setAutoApproveDelayHours] = useState(24);
  const [reevaluationDays, setReevaluationDays] = useState(15);

  // Pipeline Queue settings
  const [queueAutoRetry, setQueueAutoRetry] = useState(false);
  const [queueAutoRetryDelayHours, setQueueAutoRetryDelayHours] = useState(24);
  const [queueRetentionDays, setQueueRetentionDays] = useState(30);
  const [maxParallelTasks, setMaxParallelTasks] = useState(1);
  const [executeTasksInBrowser, setExecuteTasksInBrowser] = useState(false);

  // Translation Autonomy settings
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [transThreshold, setTransThreshold] = useState(3);
  const [autoTranslateDelayHours, setAutoTranslateDelayHours] = useState(24);
  const [transValidationsThreshold, setTransValidationsThreshold] = useState(5);
  const [transReevaluationDays, setTransReevaluationDays] = useState(15);
  const [transBacklogRetention, setTransBacklogRetention] = useState(30);
  const [translationEmails, setTranslationEmails] = useState<any[]>([]);

  // Revision Autonomy settings
  const [autoRevision, setAutoRevision] = useState(false);
  const [revThreshold, setRevThreshold] = useState(2.5); // Rating Threshold (≤ Stars)
  const [revMinVotes, setRevMinVotes] = useState(5);      // Min Votes for Rating Trigger
  const [revMinReports, setRevMinReports] = useState(3);  // Min Reports for Error Concordance
  const [revRetentionDays, setRevRetentionDays] = useState(30); // Stale Log Cooldown (Days)
  const [autoRevisionDelayHours, setAutoRevisionDelayHours] = useState(24); // Auto-Approve Cooldown Delay

  // Course Archiving Search Filter
  const [archiveSearch, setArchiveSearch] = useState('');

  // Archiving Autonomy settings
  const [autoArchiveCourses, setAutoArchiveCourses] = useState(false);
  const [archiveRatingThreshold, setArchiveRatingThreshold] = useState(2.5);
  const [archiveMinVotes, setArchiveMinVotes] = useState(5);
  const [archiveMinRevisions, setArchiveMinRevisions] = useState(8);
  const [archiveDelayHours, setArchiveDelayHours] = useState(24);
  const [archiveRetentionDays, setArchiveRetentionDays] = useState(30);

  // Search filter inputs
  const [revisionProposalSearch, setRevisionProposalSearch] = useState('');
  const [revisionRefusedSearch, setRevisionRefusedSearch] = useState('');
  const [translationRefusedSearch, setTranslationRefusedSearch] = useState('');
  const [archiveProposalSearch, setArchiveProposalSearch] = useState('');
  const [archiveRefusedSearch, setArchiveRefusedSearch] = useState('');

  // Refused Archivals State
  const [refusedArchivals, setRefusedArchivals] = useState<any[]>([]);

  // Forms / Modal States
  // Modal states delegated to child tabs

  // Backlog Retention Days
  const [backlogRetention, setBacklogRetention] = useState(30);

  // Administrative Controls: Internal Tutor & Global Course Cap
  const [disableInternalTutor, setDisableInternalTutor] = useState(false);
  const [globalCourseCap, setGlobalCourseCap] = useState(100000);

  // Sorting States
  const [courseSortField, setCourseSortField] = useState<string>('title');
  const [courseSortDir, setCourseSortDir] = useState<'asc' | 'desc'>('asc');

  const [queueSortField, setQueueSortField] = useState<string>('priority');
  const [queueSortDir, setQueueSortDir] = useState<'asc' | 'desc'>('desc');

  const [langSortField, setLangSortField] = useState<string>('code');
  const [langSortDir, setLangSortDir] = useState<'asc' | 'desc'>('asc');

  // Cockpit Pagination & Search States
  const CARD_LIMIT = 6;
  const QUEUE_LIMIT = 10;
  const [proposalSearch, setProposalSearch] = useState('');
  const [proposalPage, setProposalPage] = useState(1);
  const [refusedSearch, setRefusedSearch] = useState('');
  const [refusedPage, setRefusedPage] = useState(1);
  const [transSearch, setTransSearch] = useState('');
  const [transPage, setTransPage] = useState(1);
  const [queueSearch, setQueueSearch] = useState('');
  const [queuePage, setQueuePage] = useState(1);

  // Double-Safeguard Target Modals
  
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [infoModal, setInfoModal] = useState<{ title: string; message: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Badge upload delegated to child tabs

  const getGradientColors = (gradient: string): [string, string] => {
    const map: Record<string, [string, string]> = {
      'from-violet-500 to-fuchsia-600': ['#8b5cf6', '#d946ef'],
      'from-amber-400 to-orange-500': ['#fbbf24', '#f97316'],
      'from-yellow-400 to-amber-500': ['#facc15', '#f59e0b'],
      'from-red-500 to-orange-500': ['#ef4444', '#f97316'],
      'from-yellow-300 to-yellow-500': ['#fde047', '#eab308'],
      'from-blue-400 to-cyan-500': ['#60a5fa', '#06b6d4'],
      'from-indigo-400 to-purple-600': ['#818cf8', '#9333ea'],
      'from-yellow-500 to-amber-600': ['#eab308', '#d97706'],
      'from-emerald-400 to-teal-500': ['#34d399', '#14b8a6'],
      'from-teal-400 to-cyan-500': ['#2dd4bf', '#06b6d4'],
      'from-green-400 to-emerald-600': ['#4ade80', '#059669'],
      'from-pink-400 to-rose-600': ['#f472b6', '#e11d48'],
      'from-cyan-400 to-blue-500': ['#22d3ee', '#3b82f6'],
      'from-slate-300 to-slate-500': ['#cbd5e1', '#64748b'],
      'from-rose-500 to-red-650': ['#f43f5e', '#dc2626'],
      'from-rose-500 to-red-600': ['#f43f5e', '#dc2626'],
      'from-pink-500 to-rose-500': ['#ec4899', '#f43f5e'],
      'from-blue-500 to-indigo-500': ['#3b82f6', '#6366f1'],
      'from-amber-500 to-emerald-500': ['#f59e0b', '#10b981'],
      'from-cyan-500 to-blue-600': ['#06b6d4', '#2563eb'],
      'from-red-600 to-rose-600': ['#dc2626', '#e11d48'],
      'from-slate-700 to-slate-900': ['#334155', '#0f172a'],
      'from-sky-400 to-blue-500': ['#38bdf8', '#3b82f6'],
      'from-yellow-600 to-amber-600': ['#ca8a04', '#d97706'],
      'from-red-500 to-rose-700': ['#ef4444', '#be123c'],
      'from-amber-300 to-yellow-400': ['#fcd34d', '#facc15'],
      'from-orange-500 to-red-655': ['#f97316', '#dc2626'],
      'from-orange-500 to-red-650': ['#f97316', '#dc2626'],
      'from-slate-400 to-slate-600': ['#94a3b8', '#475569'],
      'from-violet-400 to-indigo-600': ['#a78bfa', '#4f46e5'],
      'from-amber-500 to-yellow-600': ['#f59e0b', '#ca8a04'],
      'from-orange-400 to-pink-500': ['#fb923c', '#ec4899'],
      'from-teal-400 to-emerald-500': ['#2dd4bf', '#10b981'],
      'from-purple-500 to-pink-500': ['#a855f7', '#ec4899'],
      'from-blue-600 to-indigo-700': ['#2563eb', '#4338ca'],
      'from-slate-500 to-slate-700': ['#64748b', '#334155'],
      'from-indigo-500 to-pink-500': ['#6366f1', '#ec4899'],
      'from-red-400 to-rose-600': ['#f87171', '#e11d48'],
      'from-teal-500 to-cyan-600': ['#14b8a6', '#0891b2'],
      'from-purple-600 to-fuchsia-700': ['#9333ea', '#a21caf'],
      'from-orange-500 to-red-500': ['#f97316', '#ef4444'],
    };
    return map[gradient] || ['#8b5cf6', '#d946ef'];
  };

  const updateParameter = async (key: string, value: string) => {
    switch (key) {
      case 'autoApprove': setAutoApprove(value === 'true'); break;
      case 'threshold': setThreshold(Number(value) || 5); break;
      case 'autoApproveDelayHours': setAutoApproveDelayHours(Number(value) || 24); break;
      case 'reevaluationDays': setReevaluationDays(Number(value) || 15); break;
      case 'validationsThreshold': setValidationsThreshold(Number(value) || 5); break;
      case 'backlogRetention': setBacklogRetention(Number(value) || 30); break;

      case 'autoTranslate': setAutoTranslate(value === 'true'); break;
      case 'transThreshold': setTransThreshold(Number(value) || 3); break;
      case 'autoTranslateDelayHours': setAutoTranslateDelayHours(Number(value) || 24); break;
      case 'transValidationsThreshold': setTransValidationsThreshold(Number(value) || 5); break;
      case 'transReevaluationDays': setTransReevaluationDays(Number(value) || 15); break;
      case 'transBacklogRetention': setTransBacklogRetention(Number(value) || 30); break;

      case 'autoRevision': setAutoRevision(value === 'true'); break;
      case 'revThreshold': setRevThreshold(Number(value) || 2.5); break;
      case 'revMinVotes': setRevMinVotes(Number(value) || 5); break;
      case 'revMinReports': setRevMinReports(Number(value) || 3); break;
      case 'revRetentionDays': setRevRetentionDays(Number(value) || 30); break;
      case 'autoRevisionDelayHours': setAutoRevisionDelayHours(Number(value) || 24); break;

      case 'autoArchiveCourses': setAutoArchiveCourses(value === 'true'); break;
      case 'archiveRatingThreshold': setArchiveRatingThreshold(Number(value) || 2.5); break;
      case 'archiveMinVotes': setArchiveMinVotes(Number(value) || 5); break;
      case 'archiveMinRevisions':
      case 'archiveMaxRevisions': setArchiveMinRevisions(Number(value) || 8); break;
      case 'archiveDelayHours': setArchiveDelayHours(Number(value) || 24); break;
      case 'archiveRetentionDays': setArchiveRetentionDays(Number(value) || 30); break;

      case 'queueAutoRetry': setQueueAutoRetry(value === 'true'); break;
      case 'queueAutoRetryDelayHours': setQueueAutoRetryDelayHours(Number(value) || 24); break;
      case 'queueRetentionDays': setQueueRetentionDays(Number(value) || 30); break;
      case 'maxParallelTasks': setMaxParallelTasks(Math.max(1, Math.min(5, Number(value) || 1))); break;
      case 'executeTasksInBrowser':
        if (process.env.NODE_ENV === 'production') break;
        setExecuteTasksInBrowser(value === 'true');
        break;

      case 'disableInternalTutor': setDisableInternalTutor(value === 'true'); break;
      case 'globalCourseCap': setGlobalCourseCap(Number(value) || 100000); break;
    }
    try {
      await dbService.saveSystemParameter({ key, value });
    } catch (e) {
      console.error(`Failed to save parameter ${key}:`, e);
    }
  };

  const loadData = async () => {
    // Local loaded variables to solve async React state sync timing bugs inside loadData
    let loadedQueueAutoRetry = queueAutoRetry;
    let loadedQueueAutoRetryDelayHours = queueAutoRetryDelayHours;
    let loadedQueueRetentionDays = queueRetentionDays;
    let loadedMaxParallel = maxParallelTasks;
    let loadedExecuteTasksInBrowser = executeTasksInBrowser;

    if (typeof window !== 'undefined') {
      try {
        const emailRes = await dbService.getTranslationEmails();
        if (emailRes && emailRes.data) {
          setTranslationEmails(emailRes.data);
        }
      } catch (e) {
        console.error("Failed to load translation emails", e);
      }
    }

    // Load persistent system parameters
    try {
      const { data: params } = await dbService.getSystemParameters();
      if (params && params.length > 0) {
        params.forEach((param: any) => {
          const val = param.value;
          switch (param.key) {
            case 'autoApprove': setAutoApprove(val === 'true'); break;
            case 'threshold': setThreshold(Number(val) || 5); break;
            case 'autoApproveDelayHours': setAutoApproveDelayHours(Number(val) || 24); break;
            case 'reevaluationDays': setReevaluationDays(Number(val) || 15); break;
            case 'validationsThreshold': setValidationsThreshold(Number(val) || 5); break;
            case 'backlogRetention': setBacklogRetention(Number(val) || 30); break;

            case 'autoTranslate': setAutoTranslate(val === 'true'); break;
            case 'transThreshold': setTransThreshold(Number(val) || 3); break;
            case 'autoTranslateDelayHours': setAutoTranslateDelayHours(Number(val) || 24); break;
            case 'transValidationsThreshold': setTransValidationsThreshold(Number(val) || 5); break;
            case 'transReevaluationDays': setTransReevaluationDays(Number(val) || 15); break;
            case 'transBacklogRetention': setTransBacklogRetention(Number(val) || 30); break;

            case 'autoRevision': setAutoRevision(val === 'true'); break;
            case 'revThreshold': setRevThreshold(Number(val) || 2.5); break;
            case 'revMinVotes': setRevMinVotes(Number(val) || 5); break;
            case 'revMinReports': setRevMinReports(Number(val) || 3); break;
            case 'revRetentionDays': setRevRetentionDays(Number(val) || 30); break;
            case 'autoRevisionDelayHours': setAutoRevisionDelayHours(Number(val) || 24); break;

            case 'autoArchiveCourses': setAutoArchiveCourses(val === 'true'); break;
            case 'archiveRatingThreshold': setArchiveRatingThreshold(Number(val) || 2.5); break;
            case 'archiveMinVotes': setArchiveMinVotes(Number(val) || 5); break;
            case 'archiveMinRevisions':
            case 'archiveMaxRevisions': setArchiveMinRevisions(Number(val) || 8); break;
            case 'archiveDelayHours': setArchiveDelayHours(Number(val) || 24); break;
            case 'archiveRetentionDays': setArchiveRetentionDays(Number(val) || 30); break;

            case 'queueAutoRetry': 
              setQueueAutoRetry(val === 'true'); 
              loadedQueueAutoRetry = val === 'true';
              break;
            case 'queueAutoRetryDelayHours': 
              setQueueAutoRetryDelayHours(Number(val) || 24); 
              loadedQueueAutoRetryDelayHours = Number(val) || 24;
              break;
            case 'queueRetentionDays': 
              setQueueRetentionDays(Number(val) || 30); 
              loadedQueueRetentionDays = Number(val) || 30;
              break;
            case 'maxParallelTasks':
              setMaxParallelTasks(Math.max(1, Math.min(5, Number(val) || 1)));
              loadedMaxParallel = Math.max(1, Math.min(5, Number(val) || 1));
              break;
            case 'executeTasksInBrowser':
              if (process.env.NODE_ENV === 'production') {
                setExecuteTasksInBrowser(false);
                loadedExecuteTasksInBrowser = false;
              } else {
                setExecuteTasksInBrowser(val === 'true');
                loadedExecuteTasksInBrowser = val === 'true';
              }
              break;

            case 'disableInternalTutor':
              setDisableInternalTutor(val === 'true');
              break;
            case 'globalCourseCap':
              setGlobalCourseCap(Number(val) || 100000);
              break;
          }
        });
      }
    } catch (e) {
      console.error("Failed to load system parameters", e);
    }

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('openprimer_refused_archivals');
        if (stored) {
          setRefusedArchivals(JSON.parse(stored));
        } else {
          setRefusedArchivals([]);
        }
      } catch (e) {
        console.error("Failed to load refused archivals", e);
      }
    }

    // Fetch all database dependencies in parallel to avoid sequential blocking / race conditions
    const [
      histRes,
      refCRes,
      refTRes,
      refRRes,
      trRequestsRes,
      fdbRes,
      crsRes,
      achsRes,
      persRes,
      langsRes,
      compsRes,
      qRes
    ] = await Promise.all([
      dbService.getSearchHistory(),
      dbService.getRefusedCourses(),
      dbService.getRefusedTranslations(),
      dbService.getRefusedRevisions(),
      dbService.getTranslationRequests(),
      dbService.getCourseFeedbacks(),
      dbService.getAllCourses(),
      dbService.getAchievements(),
      dbService.getTutorPersonalities(),
      dbService.getLanguagesAdmin(),
      dbService.getAllCourseCompletions(),
      dbService.getPipelineQueue()
    ]);

    const hist = histRes?.data || [];
    const refC = refCRes?.data || [];
    const refT = refTRes?.data || [];
    const refR = refRRes?.data || [];
    const trRequests = trRequestsRes?.data || [];
    const fdb = fdbRes?.data || [];
    const crs = crsRes?.data || [];
    const achs = achsRes?.data || [];
    const pers = persRes?.data || [];
    const langs = langsRes?.data || [];
    const comps = compsRes?.data || [];

    setHistoryList(hist);
    setRefusedCourses(refC);
    setRefusedTranslations(refT);
    setRefusedRevisions(refR);
    setTranslationRequests(trRequests);
    setFeedbacks(fdb);
    setCompletions(comps);
    setCourses(crs);
    setPersonalities(pers);
    setAchievements(achs);
    setAvailableLanguages(langs);

    if (qRes && qRes.data) {
      const parsed = qRes.data;

      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        parsed.forEach((t: any) => {
          if (t.status === 'running') {
            triggeredTaskIds.current.add(t.id);
          }
        });
      }

      let migrated = parsed.map((t: any) => {
        const updates: any = {};
        if (t.status === 'complete') {
          updates.status = 'completed';
        }
        if ((t.status === 'complete' || t.status === 'completed') && !t.completedAt) {
          updates.completedAt = t.timestamp
            ? new Date(new Date(t.timestamp).getTime() + 30_000).toISOString()
            : new Date().toISOString();
        }
        if (!t.targetLang) {
          const m = (t.title || '').match(/\(([A-Z]{2,3})\)$/);
          if (m) {
            updates.targetLang = m[1];
          } else {
            const detailMatch = (t.details || '').match(/(?:Language|Target Language):\s*([A-Z]{2,3})/i);
            if (detailMatch) {
              updates.targetLang = detailMatch[1].toUpperCase();
            } else {
              updates.targetLang = 'EN';
            }
          }
        }
        if (t.level) {
          const normLvl = normalizeLevel(t.level);
          if (normLvl !== t.level) {
            updates.level = normLvl;
          }
        }
        return Object.keys(updates).length ? { ...t, ...updates } : t;
      });

      const now = Date.now();
      let changed = false;

      // 1. Process Auto-Retry for failed tasks
      if (loadedQueueAutoRetry) {
        migrated = migrated.map((t: any) => {
          if (t.status === 'failed') {
            const completedTime = t.completedAt ? new Date(t.completedAt).getTime() : 0;
            if (completedTime > 0 && (now - completedTime >= loadedQueueAutoRetryDelayHours * 60 * 60 * 1000)) {
              changed = true;
              return {
                ...t,
                status: 'queued',
                progress: t.progress || 0,
                logs: [...(t.logs || []), `[SYSTEM] Automatically retried task after ${loadedQueueAutoRetryDelayHours}h cooldown.`]
              };
            }
          }
          return t;
        });
      }

      // 2. Process Retention (delete finished tasks older than loadedQueueRetentionDays)
      migrated = migrated.filter((t: any) => {
        const isFinished = t.status === 'complete' || t.status === 'completed' || t.status === 'failed' || t.status === 'cancelled';
        if (isFinished) {
          const completedTime = t.completedAt ? new Date(t.completedAt).getTime() : new Date(t.created_at || t.timestamp || now).getTime();
          if (now - completedTime >= loadedQueueRetentionDays * 24 * 60 * 60 * 1000) {
            changed = true;
            return false;
          }
        }
        return true;
      });

      const needsSave = changed || migrated.some((t: any, i: number) => t !== parsed[i]);
      if (needsSave) {
        dbService.savePipelineQueue(migrated);
      }
      setQueue(migrated);
    } else {
      setQueue([]);
    }
    setIsQueueLoaded(true);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`op_lang_levels_${lang}`);
      if (!stored) {
        console.log(`[LOCALIZATION] Translating metadata on startup/change for lang "${lang}"`);
        translateMetadataForLanguage(lang).catch(err => {
          console.error("Failed to translate metadata for lang on mount:", err);
        });
      }
    }
  }, [lang]);



  return {
    view, setView,
    historyList, setHistoryList,
    proposals, setProposals,
    refusedCourses, setRefusedCourses,
    refusedTranslations, setRefusedTranslations,
    refusedRevisions, setRefusedRevisions,
    translationRequests, setTranslationRequests,
    feedbacks, setFeedbacks,
    completions, setCompletions,
    courses, setCourses,
    achievements, setAchievements,
    personalities, setPersonalities,
    queue, setQueue,
    isQueueLoaded, setIsQueueLoaded,
    isSandboxMode, setIsSandboxMode,
    autoApprove, setAutoApprove,
    threshold, setThreshold,
    autoApproveDelayHours, setAutoApproveDelayHours,
    reevaluationDays, setReevaluationDays,
    validationsThreshold, setValidationsThreshold,
    backlogRetention, setBacklogRetention,
    autoTranslate, setAutoTranslate,
    transThreshold, setTransThreshold,
    autoTranslateDelayHours, setAutoTranslateDelayHours,
    transValidationsThreshold, setTransValidationsThreshold,
    transReevaluationDays, setTransReevaluationDays,
    transBacklogRetention, setTransBacklogRetention,
    translationEmails, setTranslationEmails,
    autoRevision, setAutoRevision,
    revThreshold, setRevThreshold,
    revMinVotes, setRevMinVotes,
    revMinReports, setRevMinReports,
    revRetentionDays, setRevRetentionDays,
    autoRevisionDelayHours, setAutoRevisionDelayHours,
    autoArchiveCourses, setAutoArchiveCourses,
    archiveRatingThreshold, setArchiveRatingThreshold,
    archiveMinVotes, setArchiveMinVotes,
    archiveMinRevisions, setArchiveMinRevisions,
    archiveDelayHours, setArchiveDelayHours,
    archiveRetentionDays, setArchiveRetentionDays,
    refusedArchivals, setRefusedArchivals,
    availableLanguages, setAvailableLanguages,
    disableInternalTutor, setDisableInternalTutor,
    globalCourseCap, setGlobalCourseCap,
    queueAutoRetry, setQueueAutoRetry,
    queueAutoRetryDelayHours, setQueueAutoRetryDelayHours,
    queueRetentionDays, setQueueRetentionDays,
    maxParallelTasks, setMaxParallelTasks,
    executeTasksInBrowser, setExecuteTasksInBrowser,
    proposalSearch, setProposalSearch,
    proposalPage, setProposalPage,
    refusedSearch, setRefusedSearch,
    refusedPage, setRefusedPage,
    transSearch, setTransSearch,
    transPage, setTransPage,
    queueSearch, setQueueSearch,
    queuePage, setQueuePage,
    queueSortField, setQueueSortField,
    queueSortDir, setQueueSortDir,
    archiveProposalSearch, setArchiveProposalSearch,
    archiveRefusedSearch, setArchiveRefusedSearch,
    revisionProposalSearch, setRevisionProposalSearch,
    revisionRefusedSearch, setRevisionRefusedSearch,
    translationRefusedSearch, setTranslationRefusedSearch,
    toastMessage, setToastMessage,
    infoModal, setInfoModal,
    showToast,
    updateParameter,
    loadData,
    triggeredTaskIds
  };
}
