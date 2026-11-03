"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, CheckCircle, ShieldAlert, ShieldCheck, Activity } from 'lucide-react';
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
import { useCurriculumData } from './hooks/useCurriculumData';
import { useTaskExecutionRunner } from './hooks/useTaskExecutionRunner';
import { useProposalsEngine } from './hooks/useProposalsEngine';
import { useAutoApprovalEngine } from './hooks/useAutoApprovalEngine';
import { useGenerationAndTranslationHandlers } from './hooks/useGenerationAndTranslationHandlers';
import { useRevisionArchivalAndQueueHandlers } from './hooks/useRevisionArchivalAndQueueHandlers';
import { useCurriculumFilters } from './hooks/useCurriculumFilters';
import { getDynamicBadgeCount } from './hooks/badgeCountHelper';


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

  const getBadgeCount = (ach: any) => getDynamicBadgeCount(ach, courses, achievements, completions);


  // Data, system parameters & lifecycle
  const data = useCurriculumData({ lang });
  const {
    view, setView,
    historyList,
    proposals, setProposals,
    refusedCourses,
    refusedTranslations,
    refusedRevisions,
    translationRequests, setTranslationRequests,
    feedbacks,
    completions,
    courses,
    achievements,
    personalities,
    queue, setQueue,
    isQueueLoaded,
    isSandboxMode, setIsSandboxMode,
    autoApprove,
    threshold,
    autoApproveDelayHours,
    reevaluationDays,
    validationsThreshold,
    backlogRetention,
    autoTranslate,
    transThreshold,
    autoTranslateDelayHours,
    transValidationsThreshold,
    transReevaluationDays,
    transBacklogRetention,
    translationEmails,
    autoRevision,
    revThreshold,
    revMinVotes,
    revMinReports,
    revRetentionDays,
    autoRevisionDelayHours,
    autoArchiveCourses,
    archiveRatingThreshold,
    archiveMinVotes,
    archiveMinRevisions,
    archiveDelayHours,
    archiveRetentionDays,
    refusedArchivals, setRefusedArchivals,
    availableLanguages,
    disableInternalTutor,
    globalCourseCap,
    queueAutoRetry,
    queueAutoRetryDelayHours,
    queueRetentionDays,
    maxParallelTasks,
    executeTasksInBrowser,
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
    toastMessage,
    infoModal, setInfoModal,
    showToast,
    updateParameter,
    loadData,
    triggeredTaskIds
  } = data;

  // Background Task Runner
  useTaskExecutionRunner({
    executeTasksInBrowser,
    isQueueLoaded,
    queue,
    setQueue,
    maxParallelTasks,
    lang,
    triggeredTaskIds,
    loadData,
    showToast
  });

  // Proposals & Requests Engine
  useProposalsEngine({
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
  });

  // Auto-Approval & Safeguards Engine
  useAutoApprovalEngine({
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
  });

  // Generation & Translation Handlers
  const {
    handleDeployExpansion,
    handleApproveGen,
    handleEnforceGlobalCourseCap,
    handleRefuseGen,
    deleteRefused,
    handleApproveTrans,
    handleRefuseTrans
  } = useGenerationAndTranslationHandlers({
    queue,
    setQueue,
    courses,
    globalCourseCap,
    lang,
    loadData,
    showToast,
    t,
    tr
  });

  // Revision, Archival & Queue Handlers
  const {
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
  } = useRevisionArchivalAndQueueHandlers({
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
  });

  // Filtering, Searching & Pagination
  const CARD_LIMIT = 6;
  const QUEUE_LIMIT = 8;

  const {
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
  } = useCurriculumFilters({
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
    translationRefusedSearch
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
              <BookOpen className="w-8 h-8 text-blue-500" />
              {t.title}
            </h1>
          </div>
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
                 className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${view === tab.id ? `${tab.color} text-white shadow-lg` : 'bg-slate-900 text-slate-500 hover:text-white border border-slate-800'}`}
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
                 globalCourseCap={globalCourseCap}
                 onUpdateCourseCap={(cap) => updateParameter('globalCourseCap', String(cap))}
                 onEnforceCapAndPurge={handleEnforceGlobalCourseCap}
                 coursesCount={courses.length}
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
                 disableInternalTutor={disableInternalTutor}
                 onToggleDisableInternalTutor={(val) => updateParameter('disableInternalTutor', String(val))}
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
              <div className="p-8 border-b border-slate-800 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">{infoModal.title}</h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed text-center">{infoModal.message}</p>
                <button onClick={() => setInfoModal(null)} className="w-full py-4 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white font-black uppercase text-[10px] rounded-xl transition-all cursor-pointer">
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

