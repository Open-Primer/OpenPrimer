"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, CheckCircle, ShieldAlert, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService, Achievement, TutorPersonality, MockCourse, isDatabaseConfigured } from '@/lib/db';
import { cleanPathSegment, formatCourseLevel } from '@/lib/translations';

// Tab imports
import { GenerationTab } from './components/GenerationTab';
import { TranslationTab } from './components/TranslationTab';
import { RevisionTab } from './components/RevisionTab';
import { ArchivingTab } from './components/ArchivingTab';
import { QueueTab } from './components/QueueTab';
import { AchievementsTab } from './components/AchievementsTab';
import { PersonalitiesTab } from './components/PersonalitiesTab';
import { WidgetsTab } from './components/WidgetsTab';

import { 
  CURRICULUM_STRINGS, COCKPIT_DICTIONARY, LOCALIZED_POPUPS, EXTRA_TOOLTIP_STRINGS,
  ACADEMIC_LEVELS, DISCIPLINES, normalizeLevel, formatCourseLevelGlobal, 
  getLevelLabel, getDisciplineLabel, translateMetadataForLanguage, 
  areTitlesTooSimilar, POTENTIAL_CURRICULA 
} from './strings';

export default function AdminCurriculumPage() {
  const { language: globalLang } = useLanguage();
  const lang = (globalLang || 'EN') as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR';
  const t = CURRICULUM_STRINGS[lang] || CURRICULUM_STRINGS.EN;
  const tr = (key: string): string => {
    const dict = (COCKPIT_DICTIONARY[lang] || COCKPIT_DICTIONARY.EN) as Record<string, string>;
    const extraDict = (EXTRA_TOOLTIP_STRINGS[lang] || EXTRA_TOOLTIP_STRINGS.EN) as Record<string, string>;
    return extraDict[key] || dict[key] || key;
  };

  const getDynamicBadgeCount = (ach: any): number => {
    if (courses.length === 0 || achievements.length === 0) return 0;
    
    let userEarned = false;
    if (typeof window !== 'undefined') {
      try {
        const earnedIds = JSON.parse(localStorage.getItem('op_earned_achievements') || '[]');
        if (Array.isArray(earnedIds) && earnedIds.includes(ach.id)) {
          userEarned = true;
        }
      } catch (e) {}
    }

    const th = (ach.threshold || '').toLowerCase();
    let count = 0;
    const totalCompletions = completions.length;

    if (th.includes('3 days')) {
      count = Math.round(totalCompletions * 0.15);
    } else if (th.includes('50 questions')) {
      count = Math.round(totalCompletions * 0.4);
    } else if (th.includes('100 questions')) {
      count = Math.round(totalCompletions * 0.2);
    } else if (th.includes('7 day streak') || th.includes('streak')) {
      const days = parseInt(th.replace(/\D/g, '')) || 7;
      if (days >= 10) {
        count = Math.round(totalCompletions * 0.1);
      } else {
        count = Math.round(totalCompletions * 0.25);
      }
    } else if (th.includes('100% score') || th.includes('perfect')) {
      count = Math.round(totalCompletions * 0.3);
    } else if (th.includes('courses')) {
      const requiredCourses = parseInt(th.replace(/\D/g, '')) || 1;
      if (requiredCourses === 1) {
        count = totalCompletions;
      } else {
        count = Math.max(0, Math.floor(totalCompletions / requiredCourses));
      }
    } else if (th.includes('night session')) {
      count = Math.round(totalCompletions * 0.12);
    } else if (th.includes('morning session')) {
      count = Math.round(totalCompletions * 0.08);
    } else if (th.includes('feedback')) {
      count = Math.round(totalCompletions * 0.18);
    } else if (th.includes('curriculum')) {
      count = Math.round(totalCompletions * 0.1);
    } else {
      count = Math.round(totalCompletions * 0.15);
    }

    if (userEarned && count === 0) {
      count = 1;
    }

    return count;
  };

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
  const [showAddPersonality, setShowAddPersonality] = useState(false);
  const [newPers, setNewPers] = useState({ name: '', prompt: '', isDefault: false });

  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [newAch, setNewAch] = useState({ name: '', description: '', threshold: '', icon: 'Award' });
  const [badgeIcon, setBadgeIcon] = useState('Award');
  const [badgeError, setBadgeError] = useState<string | null>(null);

  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editThreshold, setEditThreshold] = useState('');
  const [editIcon, setEditIcon] = useState('Award');

  const [purgeTarget, setPurgeTarget] = useState<Achievement | null>(null);
  const [purgeInput, setPurgeInput] = useState('');

  // Dynamic Languages
  const [availableLanguages, setAvailableLanguages] = useState<any[]>([]);
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangLabel, setNewLangLabel] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('');

  // Time-Limited Badges Dates
  const [badgeStartDate, setBadgeStartDate] = useState('');
  const [badgeEndDate, setBadgeEndDate] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  // Drag and Drop Base64 Custom Badges
  const [customBadgeImage, setCustomBadgeImage] = useState<string | null>(null);
  const [editCustomBadgeImage, setEditCustomBadgeImage] = useState<string | null>(null);

  // Backlog Retention Days
  const [backlogRetention, setBacklogRetention] = useState(30);

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
  const [cancelTaskTarget, setCancelTaskTarget] = useState<any | null>(null);
  const triggeredTaskIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);
  const [errorDetailsTarget, setErrorDetailsTarget] = useState<any | null>(null);
  const [purgeLanguageTarget, setPurgeLanguageTarget] = useState<any | null>(null);
  const [courseArchiveTarget, setCourseArchiveTarget] = useState<any | null>(null);
  const [curriculumArchivalPending, setCurriculumArchivalPending] = useState<{ course: any; nextLevel: number; parentCurricula: any[] } | null>(null);
  const [curriculumCascadePending, setCurriculumCascadePending] = useState<{ curriculum: any; nextLevel: number; childCourses: any[] } | null>(null);
  const [deleteTutorTarget, setDeleteTutorTarget] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [infoModal, setInfoModal] = useState<{ title: string; message: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Drag and Drop Badge Upload Dragging States
  const [isCreationDragging, setIsCreationDragging] = useState(false);
  const [isEditionDragging, setIsEditionDragging] = useState(false);

  // Paginated Gallery States
  const [creationGalleryPage, setCreationGalleryPage] = useState(1);
  const [editionGalleryPage, setEditionGalleryPage] = useState(1);
  const badgePageSize = 9;

  // Academic Suggestions validations threshold
  const [validationsThreshold, setValidationsThreshold] = useState(5);

  // Manual curriculum / course proposal form states
  const [manualTitle, setManualTitle] = useState('');
  const [manualType, setManualType] = useState<'curriculum' | 'course'>('course');
  const [manualLevel, setManualLevel] = useState('L1');
  const [manualSubject, setManualSubject] = useState('Physics');
  const [manualLang, setManualLang] = useState('EN');
  const [manualTutor, setManualTutor] = useState('socratic');
  const [manualPriority, setManualPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [showManualConfirm, setShowManualConfirm] = useState(false);
  const [disciplinesList, setDisciplinesList] = useState<string[]>(['Physics', 'Biology', 'Mathematics', 'Law', 'Humanities / Letters', 'Social Sciences', 'Computer Science', 'Medicine', 'Economics', 'Chemistry']);
  const [customDisciplineName, setCustomDisciplineName] = useState('');
  const [manualVolumePref, setManualVolumePref] = useState<'automatic' | 'explicit'>('automatic');
  const [manualVolumeHours, setManualVolumeHours] = useState<number>(30);

  // ─── AI Generated Badge States ─────────────────────────────────────────────
  const [generatedBadges, setGeneratedBadges] = useState<string[]>([]);
  const [isGeneratingBadges, setIsGeneratingBadges] = useState(false);
  const [editGeneratedBadges, setEditGeneratedBadges] = useState<string[]>([]);
  const [isEditGeneratingBadges, setIsEditGeneratingBadges] = useState(false);

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

  // Priority-Based Tasks execution scheduling loop (runs every 4 seconds)
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
              if (runningTask.type === 'generation') {
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
                      'student.gen@openprimer.org',
                      'researcher.transl@openprimer.org',
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
              showToast(tr("Course generated successfully!"), "success");
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

  // Compute Active Generation Proposals
  useEffect(() => {
    if (historyList.length === 0) return;
    
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
      const isCourse = courses.some(c => c.title.toLowerCase() === lowerTitle || c.slug.toLowerCase() === lowerTitle.replace(/ /g, '_'));
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
        c.slug.toLowerCase() === query.replace(/ /g, '_')
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

  // Reactive Translation Autonomy Auto-Approve loop (with minimum 24 hours delay)
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

  // Generation Handlers
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

  const handleCreateManualTask = async () => {
    if (!manualTitle.trim()) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      showToast(pStrings.toast_title_empty, 'error');
      return;
    }

    // --- Title Sanitization: translate to English, fix capitalization & typos ---
    let title = manualTitle.trim();
    try {
      const res = await fetch('/api/correct-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, targetLang: 'en', translateToTargetLang: true })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.corrected && data.corrected.length >= 3) {
          title = data.corrected;
        }
      }
    } catch (e) {
      console.warn('[Manual Task] Title correction API failed, using raw title.', e);
    }
    // -----------------------------------------------------------------------

    const targetLvl = manualLevel || 'L1';
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
      showToast(pStrings.toast_similar_exists.replace('{title}', title), 'info');
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title,
      type: 'generation',
      status: 'queued',
      progress: 0,
      priority: 'High',
      timestamp: new Date().toISOString(),
      details: `Manual Generation (${manualType.toUpperCase()}): Level ${manualLevel}, Subject "${manualSubject}", Language ${manualLang}, Tutor AI "Sovereign AI"`,
      targetLang: manualLang,
      level: normalizeLevel(manualLevel),
      subject: manualSubject === 'NEW_CUSTOM' ? customDisciplineName : manualSubject,
      courseType: manualType,
      volume: manualVolumePref === 'explicit' ? `${manualVolumeHours} hours` : 'Automatic'
    };

    const updated = [...queue, newTask];
    setQueue(updated);
    dbService.savePipelineQueue(updated);
    
    // Clear form
    setManualTitle('');
    setShowManualConfirm(false);
    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
    showToast(pStrings.toast_manual_success, 'success');
    loadData();
  };


  const handleApproveGen = (title: string, count: number, level?: string, subject?: string) => {
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
      showToast(pStrings.toast_catalog_similar_exists.replace('{title}', title), 'info');
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      type: 'generation',
      status: 'queued',
      progress: 0,
      priority: count >= 15 ? 'High' : 'Medium',
      timestamp: new Date().toISOString(),
      targetLang: lang,
      level: normalizeLevel(level || 'L1'),
      subject: subject || 'General'
    };
    const updated = [...queue, newTask];
    setQueue(updated);
    dbService.savePipelineQueue(updated);
    loadData();
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

    // Dynamic Chapter-Level Synthesis & Concordance Aggregation
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
      const course = courses.find(c => c.slug === f.courseId || String(c.id) === f.courseId || c.title.toLowerCase().replace(/ /g, '_') === f.courseId.toLowerCase());
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
      const course = courses.find(c => c.slug === g.courseId || String(c.id) === g.courseId || c.title.toLowerCase().replace(/ /g, '_') === g.courseId.toLowerCase());
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

  return (
    <div className="space-y-12 pb-20">
      {isSandboxMode && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_8px_32px_rgba(245,158,11,0.05)] backdrop-blur-xl animate-fade-in">
          <div className="space-y-2">
            <h4 className="text-amber-400 font-black text-xs uppercase tracking-widest flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              Mode Bac à sable Actif (Bypass Local Storage)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Votre navigateur utilise actuellement un stockage simulé en mémoire/local (<code className="text-amber-400/80 font-mono">op_allow_sandbox</code> hérité des tests Playwright E2E). C'est pourquoi la file d'attente réelle de Supabase s'affiche comme vide.
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('op_allow_sandbox');
              setIsSandboxMode(false);
              window.location.reload();
            }}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-amber-500/10 whitespace-nowrap cursor-pointer"
          >
            Se reconnecter à Supabase
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6">
        <div className="space-y-2 w-full">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
            <BookOpen className="w-8 h-8 text-blue-500" />
            {t.title}
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {t.subtitle}
          </p>
          
          {/* TABS GRID */}
          <div className="flex flex-wrap gap-2 pt-6">
             {[
               { id: 'generation', label: t.tab_generation, color: 'bg-blue-600' },
               { id: 'translation', label: t.tab_translation, color: 'bg-emerald-600' },
               { id: 'revision', label: t.tab_revision, color: 'bg-yellow-600' },
               { id: 'archiving', label: t.tab_archiving, color: 'bg-pink-600' },
               { id: 'queue', label: t.tab_queue, color: 'bg-cyan-600' },
               { id: 'widgets', label: t.tab_widgets, color: 'bg-teal-600' },
               { id: 'achievements', label: t.tab_achievements, color: 'bg-violet-600' },
               { id: 'personalities', label: t.tab_personalities, color: 'bg-fuchsia-600' }
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setView(tab.id as any)} 
                 className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${view === tab.id ? `${tab.color} text-white shadow-lg` : 'bg-slate-900 text-slate-500 hover:text-white border border-slate-850'}`}
               >
                  {tab.label}
               </button>
             ))}
          </div>
        </div>
      </div>

        {/* MAIN BODY AREA */}
        <div className="space-y-8">
             {view === 'generation' && (
               <GenerationTab 
                 lang={lang}
                 t={t}
                 tr={tr}
                 autoApprove={autoApprove}
                 autoApproveDelayHours={autoApproveDelayHours}
                 threshold={threshold}
                 validationsThreshold={validationsThreshold}
                 reevaluationDays={reevaluationDays}
                 backlogRetention={backlogRetention}
                 updateParameter={updateParameter}
                 proposals={proposals}
                 refusedCourses={refusedCourses}
                 handleApproveGen={handleApproveGen}
                 handleRefuseGen={handleRefuseGen}
                 deleteRefused={deleteRefused}
                 courses={courses}
                 queue={queue}
                 setQueue={setQueue}
                 loadData={loadData}
                 showToast={showToast}
                 isQueueLoaded={isQueueLoaded}
               />
             )}
             
             {view === 'translation' && (
               <TranslationTab 
                 lang={lang}
                 t={t}
                 tr={tr}
                 autoTranslate={autoTranslate}
                 transThreshold={transThreshold}
                 autoTranslateDelayHours={autoTranslateDelayHours}
                 transValidationsThreshold={transValidationsThreshold}
                 transReevaluationDays={transReevaluationDays}
                 transBacklogRetention={transBacklogRetention}
                 updateParameter={updateParameter}
                 translationRequests={translationRequests}
                 refusedTranslations={refusedTranslations}
                 availableLanguages={availableLanguages}
                 translationEmails={translationEmails}
                 handleApproveTrans={handleApproveTrans}
                 handleRefuseTrans={handleRefuseTrans}
                 loadData={loadData}
                 showToast={showToast}
               />
             )}
             
             {view === 'revision' && (
               <RevisionTab 
                 lang={lang}
                 tr={tr}
                 autoRevision={autoRevision}
                 revThreshold={revThreshold}
                 revMinVotes={revMinVotes}
                 revMinReports={revMinReports}
                 autoRevisionDelayHours={autoRevisionDelayHours}
                 revRetentionDays={revRetentionDays}
                 updateParameter={updateParameter}
                 activeRevisionProposals={activeRevisionProposals}
                 refusedRevisions={refusedRevisions}
                 handleApproveRevision={handleApproveRevision}
                 handleRefuseRevision={handleRefuseRevision}
                 loadData={loadData}
               />
             )}
             
             {view === 'archiving' && (
               <ArchivingTab 
                 lang={lang}
                 tr={tr}
                 courses={courses}
                 completions={completions}
                 autoArchiveCourses={autoArchiveCourses}
                 archiveRatingThreshold={archiveRatingThreshold}
                 archiveMinVotes={archiveMinVotes}
                 archiveMinRevisions={archiveMinRevisions}
                 archiveDelayHours={archiveDelayHours}
                 archiveRetentionDays={archiveRetentionDays}
                 updateParameter={updateParameter}
                 activeArchivalProposals={activeArchivalProposals}
                 refusedArchivals={refusedArchivals}
                 handleApproveArchival={handleApproveArchival}
                 handleRefuseArchival={handleRefuseArchival}
                 handleDeleteRefusedArchival={handleDeleteRefusedArchival}
                 loadData={loadData}
                 showToast={showToast}
               />
             )}
             
             {view === 'queue' && (
               <QueueTab 
                 lang={lang}
                 tr={tr}
                 courses={courses}
                 queueAutoRetry={queueAutoRetry}
                 queueAutoRetryDelayHours={queueAutoRetryDelayHours}
                 queueRetentionDays={queueRetentionDays}
                 maxParallelTasks={maxParallelTasks}
                 executeTasksInBrowser={executeTasksInBrowser}
                 updateParameter={updateParameter}
                 queue={queue}
                 setQueue={setQueue}
                 loadData={loadData}
                 showToast={showToast}
                 removeTriggeredTaskId={(id) => {
                   triggeredTaskIds.current.delete(id);
                 }}
                 isQueueLoaded={isQueueLoaded}
               />
             )}
             
             {view === 'widgets' && (
               <WidgetsTab 
                 lang={lang}
                 t={t}
                 tr={tr}
                 showToast={showToast}
               />
             )}

             {view === 'achievements' && (
               <AchievementsTab 
                 lang={lang}
                 tr={tr}
                 achievements={achievements}
                 completions={completions}
                 loadData={loadData}
                 showToast={showToast}
               />
             )}
             
             {view === 'personalities' && (
               <PersonalitiesTab 
                 lang={lang}
                 tr={tr}
                 t={t}
                 personalities={personalities}
                 loadData={loadData}
                 showToast={showToast}
               />
             )}
        </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className={`fixed bottom-8 right-8 z-[400] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold backdrop-blur-sm border ${
              toastMessage.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' :
              toastMessage.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-300' :
              'bg-slate-900/90 border-slate-700/50 text-slate-200'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'error' && <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />}
            {toastMessage.type === 'info' && <Activity className="w-5 h-5 text-blue-400 shrink-0" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INFO / ERROR MODAL */}
      <AnimatePresence>
        {infoModal && (
          <div className="fixed inset-0 z-[350] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoModal(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-850 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">{infoModal.title}</h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed text-center">{infoModal.message}</p>
                <button onClick={() => setInfoModal(null)} className="w-full py-4 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white font-black uppercase text-[10px] rounded-xl transition-all cursor-pointer">
                  {tr("Dismiss")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
