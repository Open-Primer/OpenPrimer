"use client";

import { toPascalCase, translateText, getWidgetName as formatWidgetName, getWidgetDesc as formatWidgetDesc, getWidgetLevel as formatWidgetLevel, getAcademicLevelText as formatAcademicLevelText } from './widgets/widgetFormatters';
import { toggleAcademicLevelHelper } from './widgets/academicLevelHelper';
import { getDisciplineColor, getDisciplinesSummary } from './widgets/disciplineHelpers';
import { useLoadWidgets } from './widgets/useLoadWidgets';
import { useWidgetCrud } from './widgets/useWidgetCrud';
import { useWidgetAIActions } from './widgets/useWidgetAIActions';
import { WorkspaceHeaderPanel } from './widgets/WorkspaceHeaderPanel';
import { renderLiveWidgetComponent } from './widgets/renderLiveWidgetComponent';
import { generateRandomProps } from './widgets/generateRandomProps';
import React, { useState, useEffect } from 'react';
import { 
  Wrench, Sparkles, Terminal, FileText, Play, CheckCircle2, AlertTriangle, 
  RefreshCw, Layers, ChevronRight, Search, Check, Cpu, Ban, Loader2, Code,
  Lock, Unlock, ShieldAlert, Maximize2, Minimize2, Edit, Plus, Globe, Tag, X, Info,
  Copy, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISCIPLINES, getDisciplineLabel, ACADEMIC_LEVELS } from '../strings';
import {
  Widget,
  WidgetsTabProps,
  SANDBOX_PRESETS,
  SUGGESTED_PROMPTS
} from './widgets/widgetPresets';
import { WidgetCatalogGrid } from './widgets/WidgetCatalogGrid';
import { LivePreviewTab } from './widgets/LivePreviewTab';
import { EditWidgetModal } from './widgets/EditWidgetModal';
import { CreateWidgetModal } from './widgets/CreateWidgetModal';
import { ShowCaseModals } from './widgets/ShowCaseModals';
import { useWidgetConcurrency } from './widgets/useWidgetConcurrency';

export type { Widget, WidgetsTabProps };

export const WidgetsTab: React.FC<WidgetsTabProps> = ({
  lang,
  t,
  tr: propTr,
  showToast: propShowToast
}) => {
  const tr = propTr || ((k: string) => k);
  const showToast = propShowToast || (() => {});
  const isEditFormInvalid = false;
  const isCreateFormInvalid = false;
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'alphabetical' | 'level' | 'discipline'>('alphabetical');
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [workshopTab, setWorkshopTab] = useState<'preview' | 'code' | 'props'>('preview');
  
  // Custom interactive preset selected for previewing
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Sandbox Parameter Randomizer overrides
  const [randomProps, setRandomProps] = useState<Record<string, any> | null>(null);
  const [diceRotation, setDiceRotation] = useState(0);

  // generateRandomProps imported from ./widgets/generateRandomProps
  const DISCIPLINES_LIST = React.useMemo(() => {
    const staticEn = DISCIPLINES.map(d => d.EN);
    let customList: string[] = [];
    if (typeof window !== 'undefined') {
      try {
        customList = JSON.parse(localStorage.getItem('op_custom_disciplines') || '[]');
      } catch (e) {}
    }
    const combined = Array.from(new Set([...staticEn, ...customList]));
    return combined;
  }, []);

  // toPascalCase imported from widgetFormatters

  // translateText imported from widgetFormatters

  const getWidgetName = (w: Widget) => formatWidgetName(w, lang, tr);
  const getWidgetDesc = (w: Widget) => formatWidgetDesc(w, lang, tr);
  const getWidgetLevel = (w: Widget) => formatWidgetLevel(w, lang, tr);
  const isFrancophoneLocale = String(lang).toUpperCase().startsWith('FR');
  const getAcademicLevelText = (lvl: any): string => formatAcademicLevelText(lvl, lang);

  // AI Generation workshop States
  const [prompt, setPrompt] = useState('');
  const [isExecuting, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Concurrency & Admin State
  const [adminId, setAdminId] = useState<string>('');
  const [isEditingAdminName, setIsEditingAdminName] = useState(false);

  // Modals Visibility
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [widgetToValidate, setWidgetToValidate] = useState<string | null>(null);

  // Parameter Edit States
  const [editNameFR, setEditNameFR] = useState('');
  const [editNameEN, setEditNameEN] = useState('');
  const [editDescFR, setEditDescFR] = useState('');
  const [editDescEN, setEditDescEN] = useState('');
  const [editLevelFR, setEditLevelFR] = useState('');
  const [editLevelEN, setEditLevelEN] = useState('');
  const [editDisciplines, setEditDisciplines] = useState<string[]>([]);
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);

  // Create New Widget States
  const [newWidgetId, setNewWidgetId] = useState('');
  const [newWidgetPrompt, setNewWidgetPrompt] = useState('');
  const [newWidgetNameFR, setNewWidgetNameFR] = useState('');
  const [newWidgetNameEN, setNewWidgetNameEN] = useState('');
  const [newWidgetDescFR, setNewWidgetDescFR] = useState('');
  const [newWidgetDescEN, setNewWidgetDescEN] = useState('');
  const [newWidgetLevelFR, setNewWidgetLevelFR] = useState('');
  const [newWidgetLevelEN, setNewWidgetLevelEN] = useState('');
  const [newWidgetDisciplines, setNewWidgetDisciplines] = useState<string[]>([]);

  // UX Enhancements & Validation States
  const [widgetVersionKey, setWidgetVersionKey] = useState(0);
  const [isEditLevelDropdownOpen, setIsEditLevelDropdownOpen] = useState(false);
  const [isEditSubjectDropdownOpen, setIsEditSubjectDropdownOpen] = useState(false);
  const [isCreateLevelDropdownOpen, setIsCreateLevelDropdownOpen] = useState(false);
  const [isCreateSubjectDropdownOpen, setIsCreateSubjectDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Toggle Academic Level utility keeping FR and EN perfectly synchronized
  const toggleAcademicLevel = (levelVal: string, state: 'edit' | 'new') => {
    toggleAcademicLevelHelper({
      levelVal,
      state,
      editLevelFR,
      setEditLevelFR,
      editLevelEN,
      setEditLevelEN,
      newWidgetLevelFR,
      setNewWidgetLevelFR,
      newWidgetLevelEN,
      setNewWidgetLevelEN
    });
  };

  const namingCollisionError = React.useMemo(() => {
    const inputName = (isFrancophoneLocale ? newWidgetNameFR : newWidgetNameEN).trim();
    if (!inputName) return null;

    const inputLower = inputName.toLowerCase();
    const computedPascal = toPascalCase(inputName).toLowerCase();

    for (const w of widgets) {
      if (
        w.nameFR.trim().toLowerCase() === inputLower ||
        w.nameEN.trim().toLowerCase() === inputLower
      ) {
        return tr("A widget with this exact name already exists!");
      }

      if (w.id.toLowerCase() === computedPascal) {
        return tr("This name is too similar to an existing widget and would cause an ID collision ({id}).").replace("{id}", w.id);
      }

      const existingNameFRPascal = toPascalCase(w.nameFR).toLowerCase();
      const existingNameENPascal = toPascalCase(w.nameEN).toLowerCase();
      if (existingNameFRPascal === computedPascal || existingNameENPascal === computedPascal) {
        return tr("This name is too similar to '{existing}' and would generate a duplicate ID ({id}).")
          .replace("{existing}", getWidgetName(w))
          .replace("{id}", w.id);
      }
    }
    return null;
  }, [newWidgetNameFR, newWidgetNameEN, lang, widgets]);

  // Retrieve/Initialize Admin Name
  useEffect(() => {
    let savedId = localStorage.getItem('op_widget_admin_id');
    if (!savedId) {
      savedId = `Admin_#${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem('op_widget_admin_id', savedId);
    }
    setAdminId(savedId);
  }, []);
  const {
    handleSaveAdminName,
    getAuthHeaders,
    acquireLock,
    releaseLock
  } = useWidgetConcurrency({
    adminId,
    setAdminId,
    showToast,
    tr
  });

  const { loadWidgets } = useLoadWidgets({
    getAuthHeaders,
    setWidgets,
    setSelectedWidget,
    setLoading,
    showToast,
    tr
  });

  useEffect(() => {
    loadWidgets();
  }, []);

  const {
    handleSaveParameters,
    handleValidateWidget,
    handleRollbackWidget,
    handleForceUnlock
  } = useWidgetCrud({
    adminId,
    selectedWidget,
    setSelectedWidget,
    getAuthHeaders,
    loadWidgets,
    setWidgetVersionKey,
    showToast,
    tr,
    translateText,
    editNameFR,
    editNameEN,
    editDescFR,
    editDescEN,
    editLevelFR,
    editLevelEN,
    editDisciplines,
    setIsEditModalOpen,
    setIsSavingMetadata,
    setLoading,
    lang,
    releaseLock
  });

  const openEditModal = () => {
    if (!selectedWidget) return;
    setEditNameFR(selectedWidget.nameFR);
    setEditNameEN(selectedWidget.nameEN);
    setEditDescFR(selectedWidget.descFR);
    setEditDescEN(selectedWidget.descEN);
    setEditLevelFR(selectedWidget.levelFR);
    setEditLevelEN(selectedWidget.levelEN);
    setEditDisciplines(selectedWidget.disciplines);
    setIsEditModalOpen(true);
  };
  const { handleCreateWidget, handleEnhanceWidget } = useWidgetAIActions({
    adminId,
    isFrancophoneLocale,
    newWidgetNameFR,
    newWidgetNameEN,
    newWidgetDescFR,
    newWidgetDescEN,
    newWidgetLevelFR,
    newWidgetLevelEN,
    newWidgetDisciplines,
    newWidgetPrompt,
    isExecuting,
    namingCollisionError,
    setIsCreateModalOpen,
    setIsGenerating,
    setErrorDetails,
    setCurrentStep,
    widgets,
    showToast,
    tr,
    getAuthHeaders,
    loadWidgets,
    translateText,
    selectedWidget,
    prompt,
    setPrompt
  });
  const toggleDiscipline = (disc: string, state: 'edit' | 'new') => {
    if (state === 'edit') {
      setEditDisciplines(prev => 
        prev.includes(disc) ? prev.filter(d => d !== disc) : [...prev, disc]
      );
    } else {
      setNewWidgetDisciplines(prev => 
        prev.includes(disc) ? prev.filter(d => d !== disc) : [...prev, disc]
      );
    }
  };

  const filteredWidgets = widgets.filter(w => {
    const term = searchQuery.toLowerCase();
    const idMatches = w.id.toLowerCase().includes(term);
    const nameMatches = getWidgetName(w).toLowerCase().includes(term);
    const descMatches = getWidgetDesc(w).toLowerCase().includes(term);
    const disciplineMatches = w.disciplines.some(d => d.toLowerCase().includes(term));
    return idMatches || nameMatches || descMatches || disciplineMatches;
  }).sort((a, b) => {
    if (sortBy === 'level') {
      const getLevelRank = (levelStr: string): number => {
        const cleanStr = levelStr.toLowerCase();
        let minRank = 999;
        ACADEMIC_LEVELS.forEach((lvl, idx) => {
          const val = lvl.value.toLowerCase();
          const en = lvl.EN.toLowerCase();
          const fr = lvl.FR.toLowerCase();
          if (
            cleanStr.includes(val) ||
            cleanStr.includes(en.split(' (')[0].toLowerCase()) ||
            cleanStr.includes(fr.split(' (')[0].toLowerCase()) ||
            (val === 'secondary_1' && cleanStr.includes('collège')) ||
            (val === 'preuni_1' && cleanStr.includes('lycée')) ||
            (val.startsWith('L') && cleanStr.includes('université'))
          ) {
            if (idx < minRank) minRank = idx;
          }
        });
        return minRank === 999 ? 100 : minRank;
      };
      const rankA = getLevelRank(getWidgetLevel(a));
      const rankB = getLevelRank(getWidgetLevel(b));
      if (rankA !== rankB) return rankA - rankB;
    } else if (sortBy === 'discipline') {
      const discA = a.disciplines[0] || '';
      const discB = b.disciplines[0] || '';
      if (discA !== discB) return discA.localeCompare(discB);
    }
    const nameA = getWidgetName(a);
    const nameB = getWidgetName(b);
    return nameA.localeCompare(nameB);
  });

  const renderLiveWidget = () => {
    const activePreset = SANDBOX_PRESETS[selectedWidget?.id || '']?.[activePresetIndex];
    return renderLiveWidgetComponent(
      selectedWidget,
      activePreset?.props,
      randomProps,
      widgetVersionKey,
      tr
    );
  };


  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* SECTION BANNER HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-950/40 p-6 rounded-[30px] border border-slate-900 shadow-lg">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <Wrench className="w-7 h-7 text-teal-500" />
            {tr("Pedagogical Widgets Workshop")}
          </h2>
          <p className="text-xs text-slate-450 leading-relaxed font-medium">
            {tr("Monitor, inspect, preview, and safely compile prompt-driven enhancements to interactive curriculum blocks.")}
          </p>
        </div>

        {/* ADMIN IDENTITY CONFIG & ACTIONS */}
        <div className="flex flex-wrap items-center gap-4">

          <button
            onClick={loadWidgets}
            disabled={loading || isExecuting}
            className="px-4 py-2.5 border border-slate-800 hover:border-teal-500/25 bg-slate-900/40 text-slate-400 hover:text-teal-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title={tr("Re-scan MDX directory to load physical disk changes")}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {tr("Refresh")}
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={loading || isExecuting}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 hover:scale-[1.02] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/10"
          >
            <Plus className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
            {tr("Create Widget")}
          </button>
        </div>
      </div>
      {/* TOP SECTION: FULL WIDTH SEARCH AND CATALOG GRID */}
      <WidgetCatalogGrid
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setIsCreateModalOpen={setIsCreateModalOpen}
        filteredWidgets={filteredWidgets}
        selectedWidget={selectedWidget}
        setSelectedWidget={setSelectedWidget}
        getWidgetName={getWidgetName}
        getWidgetDesc={getWidgetDesc}
        getWidgetLevel={getWidgetLevel}
        getDisciplineColor={getDisciplineColor}
        getDisciplineLabel={getDisciplineLabel}
        lang={lang}
        adminId={adminId}
        acquireLock={acquireLock}
        releaseLock={releaseLock}
        handleForceUnlock={handleForceUnlock}
        t={t}
        tr={tr}
      />
      {/* BOTTOM SECTION: FULL WIDTH WORKSPACE PANEL */}
      <div className="w-full">
        {selectedWidget ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-[35px] p-8 space-y-6 shadow-xl backdrop-blur-xl relative overflow-hidden">
            
      {/* WORKSPACE HEADER, BANNERS AND TABS */}
      <WorkspaceHeaderPanel
        selectedWidget={selectedWidget}
        adminId={adminId}
        isSavingMetadata={isSavingMetadata}
        openEditModal={openEditModal}
        workshopTab={workshopTab}
        setWorkshopTab={setWorkshopTab}
        getWidgetName={getWidgetName}
        getWidgetDesc={getWidgetDesc}
        getWidgetLevel={getWidgetLevel}
        t={t}
        tr={tr}
      />
              {/* FULLSCREEN PREVIEW TRIGGER */}
              {workshopTab === 'preview' && (
                <button
                  onClick={() => setIsFullscreenOpen(true)}
                  className="px-3 py-1.5 border border-slate-800 hover:border-teal-500/20 bg-slate-950/40 text-slate-400 hover:text-teal-400 rounded-lg text-[9px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3" />
                  {tr("Fullscreen Preview")}
                </button>
              )}

            {/* WORKSPACE BODY VIEW */}
            <div className="py-2">
              

          {/* 1. INTERACTIVE LIVE PREVIEW */}
          <LivePreviewTab
            selectedWidget={selectedWidget}
            workshopTab={workshopTab}
            setWorkshopTab={setWorkshopTab}
            setIsFullscreenOpen={setIsFullscreenOpen}
            activePresetIndex={activePresetIndex}
            setActivePresetIndex={setActivePresetIndex}
            randomProps={randomProps}
            setRandomProps={setRandomProps}
            diceRotation={diceRotation}
            setDiceRotation={setDiceRotation}
            generateRandomProps={generateRandomProps}
            SANDBOX_PRESETS={SANDBOX_PRESETS}
            renderLiveComponent={renderLiveWidget}
            prompt={prompt}
            setPrompt={setPrompt}
            isExecuting={isExecuting}
            currentStep={currentStep}
            handleRefineWithAI={handleEnhanceWidget}
            handleValidateWidget={handleValidateWidget}
            handleRollbackWidget={handleRollbackWidget}
            SUGGESTED_PROMPTS={SUGGESTED_PROMPTS}
            errorDetails={errorDetails}
            t={t}
            tr={tr}
            showToast={showToast}
            adminId={adminId}
          />
        </div>
      </div>
    ) : (
        <div className="flex flex-col items-center justify-center p-16 text-center h-96 bg-slate-900/10 border border-slate-800 border-dashed rounded-[35px] space-y-4">
          <div className="w-16 h-16 bg-slate-950/40 rounded-full flex items-center justify-center text-slate-500">
            <Wrench className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">
              {tr("No Widget Selected")}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              {tr("Select an interactive widget component from the catalog list to activate the preview sandbox workshop.")}
            </p>
          </div>
        </div>
      )}
    </div>

      {/* EDIT PARAMETERS METADATA MODAL */}
      <EditWidgetModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        selectedWidget={selectedWidget}
        editNameFR={editNameFR}
        setEditNameFR={setEditNameFR}
        editNameEN={editNameEN}
        setEditNameEN={setEditNameEN}
        editLevelFR={editLevelFR}
        setEditLevelFR={setEditLevelFR}
        editLevelEN={editLevelEN}
        setEditLevelEN={setEditLevelEN}
        editDescFR={editDescFR}
        setEditDescFR={setEditDescFR}
        editDescEN={editDescEN}
        setEditDescEN={setEditDescEN}
        editDisciplines={editDisciplines}
        setEditDisciplines={setEditDisciplines}
        isEditLevelDropdownOpen={isEditLevelDropdownOpen}
        setIsEditLevelDropdownOpen={setIsEditLevelDropdownOpen}
        isEditSubjectDropdownOpen={isEditSubjectDropdownOpen}
        setIsEditSubjectDropdownOpen={setIsEditSubjectDropdownOpen}
        toggleAcademicLevel={toggleAcademicLevel}
        toggleDiscipline={toggleDiscipline}
        getDisciplinesSummary={(sel: string[]) => getDisciplinesSummary(sel, lang, tr)}
        handleSaveParameters={handleSaveParameters}
        isSavingMetadata={isSavingMetadata}
        isEditFormInvalid={isEditFormInvalid}
        isFrancophoneLocale={isFrancophoneLocale}
        lang={lang}
        tr={tr}
        DISCIPLINES_LIST={DISCIPLINES_LIST}
      />

      {/* CREATE NEW WIDGET MODAL DIALOG */}
      <CreateWidgetModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        newWidgetNameFR={newWidgetNameFR}
        setNewWidgetNameFR={setNewWidgetNameFR}
        newWidgetNameEN={newWidgetNameEN}
        setNewWidgetNameEN={setNewWidgetNameEN}
        newWidgetLevelFR={newWidgetLevelFR}
        setNewWidgetLevelFR={setNewWidgetLevelFR}
        newWidgetLevelEN={newWidgetLevelEN}
        setNewWidgetLevelEN={setNewWidgetLevelEN}
        newWidgetDescFR={newWidgetDescFR}
        setNewWidgetDescFR={setNewWidgetDescFR}
        newWidgetDescEN={newWidgetDescEN}
        setNewWidgetDescEN={setNewWidgetDescEN}
        newWidgetDisciplines={newWidgetDisciplines}
        setNewWidgetDisciplines={setNewWidgetDisciplines}
        newWidgetPrompt={newWidgetPrompt}
        setNewWidgetPrompt={setNewWidgetPrompt}
        isCreateLevelDropdownOpen={isCreateLevelDropdownOpen}
        setIsCreateLevelDropdownOpen={setIsCreateLevelDropdownOpen}
        isCreateSubjectDropdownOpen={isCreateSubjectDropdownOpen}
        setIsCreateSubjectDropdownOpen={setIsCreateSubjectDropdownOpen}
        toggleAcademicLevel={toggleAcademicLevel}
        toggleDiscipline={toggleDiscipline}
        getDisciplinesSummary={(sel: string[]) => getDisciplinesSummary(sel, lang, tr)}
        handleCreateWidget={handleCreateWidget}
        isExecuting={isExecuting}
        isCreateFormInvalid={isCreateFormInvalid}
        namingCollisionError={namingCollisionError}
        isFrancophoneLocale={isFrancophoneLocale}
        lang={lang}
        tr={tr}
        DISCIPLINES_LIST={DISCIPLINES_LIST}
      />

      {/* FULL SCREEN SHOWCASE PREVIEW & CONFIRM VALIDATION MODALS */}
      <ShowCaseModals
        isFullscreenOpen={isFullscreenOpen}
        setIsFullscreenOpen={setIsFullscreenOpen}
        selectedWidget={selectedWidget}
        widgetToValidate={widgetToValidate}
        setWidgetToValidate={setWidgetToValidate}
        loading={loading}
        handleValidateWidget={handleValidateWidget}
        renderLiveWidget={renderLiveWidget}
        getWidgetName={getWidgetName}
        tr={tr}
      />
    </div>
  );
};
