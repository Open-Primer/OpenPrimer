"use client";

import { useBadgeAIGenerators } from './achievements/useBadgeAIGenerators';
import { AchievementGrid } from './achievements/AchievementGrid';
import { getGradientColors, getLucideIconPath, resolveBadgeIconToBase64, resolveBadgeIconToBase64Sync, resizeAndStandardizeImage, getCompiledTranslations } from './achievements/badgeImageHelpers';
import { AchievementModals } from './achievements/AchievementModals';
import React, { useState, useEffect } from 'react';
import { 
  Award, Zap, Star, Flame, Trophy, Clock, Crown, Book, ShieldCheck, 
  Layers, Activity, CheckCircle, Heart, Compass, Map, GraduationCap, 
  Target, Cpu, Globe, Key, Lock, Lightbulb, Rocket, Search, Edit3, X, Upload, Sparkles, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCALIZED_POPUPS } from '../strings';
import { dbService, Achievement, BADGE_LIBRARY, StyledBadgeImage, compileRuleLocally } from '@/lib/db';
import { ArchivingLevelButtons } from './ArchivingLevelButtons';

const LUCIDE_ICONS: Record<string, any> = {
  Award, Zap, Star, Flame, Trophy, Clock, Crown, Book, ShieldCheck, Layers, Activity, CheckCircle, Heart,
  Compass, Map, GraduationCap, Target, Cpu, Globe, Key, Lock, Lightbulb, Rocket, Search
};

const getSuggestedBadges = (name: string, desc: string, achievements: any[], currentIcon?: string) => {
  const available = BADGE_LIBRARY.filter(img => 
    !achievements.some(a => a.icon === img.id && a.icon !== currentIcon)
  );

  if (!name && !desc) return [];

  const text = `${name} ${desc}`.toLowerCase();
  let matched = available;

  if (text.includes('streak') || text.includes('consecutive') || text.includes('day')) {
    matched = available.filter(img => ['Flame', 'Zap', 'Clock', 'Heart'].includes(img.iconName));
  } else if (text.includes('question') || text.includes('coach') || text.includes('ask') || text.includes('socratic') || text.includes('think')) {
    matched = available.filter(img => ['Lightbulb', 'Cpu', 'Key', 'Sparkles', 'Layers'].includes(img.iconName));
  } else if (text.includes('score') || text.includes('perfect') || text.includes('trophy') || text.includes('master') || text.includes('expert') || text.includes('sovereign')) {
    matched = available.filter(img => ['Trophy', 'Crown', 'Award', 'Star'].includes(img.iconName));
  } else if (text.includes('speed') || text.includes('time') || text.includes('fast') || text.includes('quick') || text.includes('hour')) {
    matched = available.filter(img => ['Rocket', 'Clock', 'Zap'].includes(img.iconName));
  } else if (text.includes('language') || text.includes('polyglot') || text.includes('globe') || text.includes('world') || text.includes('explore')) {
    matched = available.filter(img => ['Globe', 'Compass', 'Map', 'GraduationCap'].includes(img.iconName));
  }

  if (matched.length < 3) {
    const matchedIds = matched.map(m => m.id);
    const extras = available.filter(img => !matchedIds.includes(img.id));
    matched = [...matched, ...extras];
  }

  return matched.slice(0, 3);
};

interface AchievementsTabProps {
  lang: 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR' | 'PT' | 'AR' | 'HI' | 'UR';
  tr: (key: string) => string;
  achievements: Achievement[];
  completions: any[];
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({
  lang,
  tr,
  achievements,
  completions,
  loadData,
  showToast
}) => {
  // Modal toggle states
  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [purgeTarget, setPurgeTarget] = useState<Achievement | null>(null);
  const [badgeError, setBadgeError] = useState<string | null>(null);

  // Add Achievement form states
  const [newAch, setNewAch] = useState({ name: '', description: '', threshold: '', icon: 'Award' });
  const [badgeIcon, setBadgeIcon] = useState('Award');
  const [badgeStartDate, setBadgeStartDate] = useState('');
  const [badgeEndDate, setBadgeEndDate] = useState('');
  const [customBadgeImage, setCustomBadgeImage] = useState<string | null>(null);
  const [creationGalleryPage, setCreationGalleryPage] = useState(1);
  const [isCreationDragging, setIsCreationDragging] = useState(false);
  const [isGeneratingBadges, setIsGeneratingBadges] = useState(false);
  const [generatedBadges, setGeneratedBadges] = useState<string[]>([]);

  // Edit Achievement form states
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editThreshold, setEditThreshold] = useState('');
  const [editIcon, setEditIcon] = useState('Award');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editCustomBadgeImage, setEditCustomBadgeImage] = useState<string | null>(null);
  const [editionGalleryPage, setEditionGalleryPage] = useState(1);
  const [isEditionDragging, setIsEditionDragging] = useState(false);
  const [isEditGeneratingBadges, setIsEditGeneratingBadges] = useState(false);
  const [editGeneratedBadges, setEditGeneratedBadges] = useState<string[]>([]);

  // Helpers
  const getDynamicBadgeCount = (ach: any): number => {
    if (completions.length === 0 || achievements.length === 0) return 0;
    
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
  // Image and SVG badge helpers imported from ./achievements/badgeImageHelpers

  const handleImageFile = (file: File, isEdit?: boolean) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const resized = await resizeAndStandardizeImage(reader.result as string);
      if (isEdit) {
        setEditCustomBadgeImage(resized);
        setEditIcon(resized);
      } else {
        setCustomBadgeImage(resized);
        setBadgeIcon(resized);
      }
    };
    reader.readAsDataURL(file);
  };

  // Debounced AI badge generator hook
  useBadgeAIGenerators({
    showAddAchievement,
    newAch,
    setGeneratedBadges,
    setIsGeneratingBadges,
    selectedAchievement,
    editName,
    editDesc,
    setEditGeneratedBadges,
    setIsEditGeneratingBadges
  });
  const handleCreateAchievement = async (e?: React.FormEvent) => { if (e && e.preventDefault) e.preventDefault();
    setBadgeError(null);

    if (!newAch.name || !newAch.description || !newAch.threshold) {
      setBadgeError(tr("Strict Parameter Error: All fields are required!"));
      return;
    }

    const numeric = Number(newAch.threshold);
    const hasNumber = /\d+/.test(newAch.threshold);
    if ((hasNumber && numeric <= 0) || (newAch.threshold.startsWith('-'))) {
      setBadgeError(tr("Strict Validation Reject: Threshold must be positive!"));
      return;
    }

    let rule = null;
    let transMap: Record<string, { name: string; description: string }> = {};

    try {
      const compileRes = await fetch('/api/badges/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAch.name,
          description: newAch.description,
          threshold: newAch.threshold,
          sandbox: typeof window !== 'undefined' && window.localStorage.getItem('op_allow_sandbox') === 'true'
        })
      });
      if (compileRes.ok) {
        const compiled = await compileRes.json();
        rule = compiled.evaluationRule;
        if (compiled.translations && Object.keys(compiled.translations).length > 0) {
          transMap = compiled.translations;
        }
      }
    } catch (err) {
      console.warn("Vertex AI badge compiler failed/offline, utilizing offline fallback engine:", err);
    }

    if (!rule) {
      rule = compileRuleLocally(newAch.description, newAch.threshold);
    }
    if (Object.keys(transMap).length === 0) {
      const translationsList = getCompiledTranslations(newAch.name, newAch.description, newAch.threshold);
      translationsList.forEach(t => {
        transMap[t.code] = { name: t.name, description: t.desc };
      });
    }

    const finalIcon = await resolveBadgeIconToBase64(badgeIcon);
    const id = achievements.length > 0 ? Math.max(...achievements.map(a => a.id)) + 1 : 1;
    await dbService.saveAchievement({
      id,
      name: newAch.name,
      description: newAch.description,
      threshold: newAch.threshold.includes(' ') ? newAch.threshold : `${newAch.threshold} streak`,
      count: 0,
      status: 'active',
      startDate: badgeStartDate || null,
      endDate: badgeEndDate || null,
      icon: finalIcon,
      translations: transMap,
      evaluationRule: rule
    });

    setShowAddAchievement(false);
    setNewAch({ name: '', description: '', threshold: '', icon: 'Award' });
    setBadgeIcon('Award');
    setBadgeStartDate('');
    setBadgeEndDate('');
    setCustomBadgeImage(null);
    loadData();
  };

  const handleOpenEditAchievement = (ach: Achievement) => {
    setBadgeError(null);
    setSelectedAchievement(ach);
    const activeLang = (lang || 'EN').toUpperCase();
    const trans = ach.translations?.[activeLang] || ach.translations?.[activeLang.toLowerCase()];
    setEditName(trans?.name || ach.name);
    setEditDesc(trans?.description || ach.description);
    setEditThreshold(ach.threshold);
    setEditIcon(ach.icon);
    setEditStartDate(ach.startDate || '');
    setEditEndDate(ach.endDate || '');
    if (ach.icon && ach.icon.startsWith('data:image')) {
      setEditCustomBadgeImage(ach.icon);
    } else {
      setEditCustomBadgeImage(null);
    }
  };

  const handleUpdateAchievement = async () => {
    if (!selectedAchievement) return;
    setBadgeError(null);

    try {
      const activeLang = (lang || 'EN').toUpperCase();
      const isEnglish = activeLang === 'EN';

      if (!editName || !editDesc || !editThreshold) {
        setBadgeError(tr("Strict Parameter Error: All fields are required!"));
        return;
      }

      const numeric = Number(editThreshold);
      const hasNumber = /\d+/.test(editThreshold);
      if ((hasNumber && numeric <= 0) || (editThreshold.startsWith('-'))) {
        setBadgeError(tr("Strict Validation Reject: Threshold must be positive!"));
        return;
      }

      const formattedThreshold = editThreshold.includes(' ') ? editThreshold : `${editThreshold} streak`;

      // Define critical vs non-critical edits
      const isThresholdChanged = formattedThreshold !== selectedAchievement.threshold;
      const isEnglishTitleChanged = isEnglish && editName !== selectedAchievement.name;
      const isEnglishDescChanged = isEnglish && editDesc !== selectedAchievement.description;
      const isCriticalChange = isThresholdChanged || isEnglishTitleChanged || isEnglishDescChanged;

      // Update translation dictionary map
      const updatedTranslations = { ...(selectedAchievement.translations || {}) };
      if (isEnglish) {
        updatedTranslations['EN'] = { name: editName, description: editDesc };
        updatedTranslations['en'] = { name: editName, description: editDesc };
      } else {
        updatedTranslations[activeLang] = { name: editName, description: editDesc };
        updatedTranslations[activeLang.toLowerCase()] = { name: editName, description: editDesc };
      }

      const finalIcon = await resolveBadgeIconToBase64(editIcon);

      if (isCriticalChange) {
        // 1. SOFT-ARCHIVE the old badge version to Level 1
        // Previous earners keep the badge unlocked on their profiles, but no new students can earn it.
        await dbService.saveAchievement({
          ...selectedAchievement,
          status: 'archived',
          archivingLevel: 1
        });

        // 2. COMPILE the new rule based on the changed core fields
        let rule = selectedAchievement.evaluationRule;
        try {
          const compileRes = await fetch('/api/badges/compile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: isEnglish ? editName : selectedAchievement.name,
              description: isEnglish ? editDesc : selectedAchievement.description,
              threshold: formattedThreshold,
              sandbox: typeof window !== 'undefined' && window.localStorage.getItem('op_allow_sandbox') === 'true'
            })
          });
          if (compileRes.ok) {
            const compiled = await compileRes.json();
            rule = compiled.evaluationRule;
          }
        } catch (err) {
          console.warn("Vertex AI badge compiler failed/offline, utilizing offline fallback engine:", err);
        }

        if (!rule) {
          rule = compileRuleLocally(isEnglish ? editDesc : selectedAchievement.description, formattedThreshold);
        }

        // 3. REGISTER a brand new version of the badge with an incremented ID
        const newId = achievements.length > 0 ? Math.max(...achievements.map(a => a.id)) + 1 : 1;

        await dbService.saveAchievement({
          id: newId,
          name: isEnglish ? editName : selectedAchievement.name,
          description: isEnglish ? editDesc : selectedAchievement.description,
          icon: finalIcon,
          startDate: editStartDate || null,
          endDate: editEndDate || null,
          threshold: formattedThreshold,
          evaluationRule: rule,
          translations: updatedTranslations,
          status: 'active',
          archivingLevel: 0,
          count: 0
        });
      } else {
        // Non-critical change (editing localized translations, updating icon image, or start/end dates in-place)
        await dbService.saveAchievement({
          ...selectedAchievement,
          name: isEnglish ? editName : selectedAchievement.name,
          description: isEnglish ? editDesc : selectedAchievement.description,
          icon: finalIcon,
          startDate: editStartDate || null,
          endDate: editEndDate || null,
          translations: updatedTranslations
        });
      }

      setSelectedAchievement(null);
      setEditStartDate('');
      setEditEndDate('');
      setEditCustomBadgeImage(null);
      loadData();
    } catch (err: any) {
      console.error("Error updating achievement:", err);
      setBadgeError(tr("Error updating achievement: ") + err.message);
    }
  };

  const handleOpenPurge = (ach: Achievement) => {
    setPurgeTarget(ach);
  };

  const handlePurgeExecute = async () => {
    if (!purgeTarget) return;
    await dbService.deleteAchievement(purgeTarget.id);
    setPurgeTarget(null);
    loadData();
  };

  const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;

  const sortedAchievements = [...achievements]
    .filter(ach => ach.status !== 'inactive')
    .sort((a, b) => {
      const lvlA = a.archivingLevel || 0;
      const lvlB = b.archivingLevel || 0;
      if (lvlA === 0 && lvlB > 0) return -1;
      if (lvlA > 0 && lvlB === 0) return 1;
      return lvlA - lvlB;
    });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-200">{tr("Seeded Achievements badges")} ({achievements.filter(ach => ach.status !== 'inactive').length})</h3>
        <button 
          type="button"
          onClick={() => setShowAddAchievement(true)}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-violet-600/10 flex items-center gap-2"
        >
          + {tr("Register Achievement")}
        </button>
      </div>

      <AchievementGrid
        achievements={achievements}
        getDynamicBadgeCount={getDynamicBadgeCount}
        handleOpenEditAchievement={handleOpenEditAchievement}
        handleOpenPurge={handleOpenPurge}
        t={tr as any}
        LUCIDE_ICONS={LUCIDE_ICONS}
      />

      {/* ACHIEVEMENT ADD MODAL */}
      <AchievementModals
        showAddAchievement={showAddAchievement}
        setShowAddAchievement={setShowAddAchievement}
        selectedAchievement={selectedAchievement}
        setSelectedAchievement={setSelectedAchievement}
        purgeTarget={purgeTarget}
        setPurgeTarget={setPurgeTarget}
        badgeError={badgeError}
        setBadgeError={setBadgeError}
        newAch={newAch}
        setNewAch={setNewAch}
        badgeIcon={badgeIcon}
        setBadgeIcon={setBadgeIcon}
        badgeStartDate={badgeStartDate}
        setBadgeStartDate={setBadgeStartDate}
        badgeEndDate={badgeEndDate}
        setBadgeEndDate={setBadgeEndDate}
        customBadgeImage={customBadgeImage}
        setCustomBadgeImage={setCustomBadgeImage}
        creationGalleryPage={creationGalleryPage}
        setCreationGalleryPage={setCreationGalleryPage}
        isCreationDragging={isCreationDragging}
        setIsCreationDragging={setIsCreationDragging}
        isGeneratingBadges={isGeneratingBadges}
        generatedBadges={generatedBadges}
        handleGenerateBadges={() => {}}
        handleBadgeFileUpload={handleImageFile}
        handleAddAchievement={handleCreateAchievement}
        editName={editName}
        setEditName={setEditName}
        editDesc={editDesc}
        setEditDesc={setEditDesc}
        editThreshold={editThreshold}
        setEditThreshold={setEditThreshold}
        editIcon={editIcon}
        setEditIcon={setEditIcon}
        editStartDate={editStartDate}
        setEditStartDate={setEditStartDate}
        editEndDate={editEndDate}
        setEditEndDate={setEditEndDate}
        editCustomBadgeImage={editCustomBadgeImage}
        setEditCustomBadgeImage={setEditCustomBadgeImage}
        editionGalleryPage={editionGalleryPage}
        setEditionGalleryPage={setEditionGalleryPage}
        isEditionDragging={isEditionDragging}
        setIsEditionDragging={setIsEditionDragging}
        isEditGeneratingBadges={isEditGeneratingBadges}
        editGeneratedBadges={editGeneratedBadges}
        handleUpdateAchievement={handleUpdateAchievement}
        handlePurgeAchievement={handlePurgeExecute}
        getSuggestedBadges={getSuggestedBadges}
        achievements={achievements}
        t={tr as any}
        LUCIDE_ICONS={LUCIDE_ICONS}
      />
    </div>
  );
};
