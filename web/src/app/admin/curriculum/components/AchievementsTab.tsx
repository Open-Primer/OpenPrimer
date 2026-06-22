"use client";

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
      'from-rose-500 to-red-655': ['#f43f5e', '#dc2626'],
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

  const getLucideIconPath = (iconName: string): string => {
    try {
      const IconComp = LUCIDE_ICONS[iconName];
      if (!IconComp) return '';
      const element = React.createElement(IconComp, {}) as any;
      if (element && element.props && element.props.children) {
        const children = Array.isArray(element.props.children)
          ? element.props.children
          : [element.props.children];
        
        let svgContent = '';
        children.forEach((child: any) => {
          if (!child || !child.type) return;
          const tagName = child.type;
          const props = child.props || {};
          const attrString = Object.keys(props)
            .filter(key => key !== 'children')
            .map(key => {
              const svgKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
              return `${svgKey}="${props[key]}"`;
            })
            .join(' ');
          
          if (props.children) {
            svgContent += `<${tagName} ${attrString}>${props.children}</${tagName}>`;
          } else {
            svgContent += `<${tagName} ${attrString} />`;
          }
        });
        return svgContent;
      }
    } catch (e) {
      console.error("Failed to extract Lucide paths", e);
    }
    return '';
  };

  const resolveBadgeIconToBase64 = async (iconKey: string): Promise<string> => {
    if (iconKey.startsWith('data:image') || iconKey.startsWith('http')) {
      return await resizeAndStandardizeImage(iconKey);
    }
    
    const styled = BADGE_LIBRARY.find(b => b.id === iconKey);
    if (styled) {
      try {
        const svgContent = getLucideIconPath(styled.iconName);
        const [c1, c2] = getGradientColors(styled.gradient);
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#bgGrad)" />
  <g transform="translate(4, 4) scale(0.66)">
    ${svgContent}
  </g>
</svg>`;
        const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        return svgBase64;
      } catch (e) {
        console.error("Failed to generate Base64 for library icon", e);
      }
    }

    try {
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="0" y="0" width="24" height="24" rx="6" fill="#8b5cf6" />
  <circle cx="12" cy="12" r="5" stroke="white" stroke-width="2"/>
</svg>`;
      const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
      return svgBase64;
    } catch (e) {
      return iconKey;
    }
  };

  const resolveBadgeIconToBase64Sync = (iconKey: string): string => {
    if (!iconKey) return '';
    if (iconKey.startsWith('data:image') || iconKey.startsWith('http')) {
      return iconKey;
    }
    
    const styled = BADGE_LIBRARY.find(b => b.id === iconKey);
    if (styled) {
      try {
        const svgContent = getLucideIconPath(styled.iconName);
        const [c1, c2] = getGradientColors(styled.gradient);
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#bgGrad)" />
  <g transform="translate(4, 4) scale(0.66)">
    ${svgContent}
  </g>
</svg>`;
        const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        return svgBase64;
      } catch (e) {
        console.error("Failed to generate Base64 for library icon", e);
      }
    }

    try {
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="0" y="0" width="24" height="24" rx="6" fill="#8b5cf6" />
  <circle cx="12" cy="12" r="5" stroke="white" stroke-width="2"/>
</svg>`;
      const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
      return svgBase64;
    } catch (e) {
      return iconKey;
    }
  };

  const resizeAndStandardizeImage = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      if (imageSrc && (imageSrc.includes('image/svg+xml') || imageSrc.startsWith('<svg') || imageSrc.includes('.svg'))) {
        resolve(imageSrc);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(imageSrc);
            return;
          }
          canvas.width = 128;
          canvas.height = 128;
          ctx.clearRect(0, 0, 128, 128);
          ctx.drawImage(img, 0, 0, 128, 128);
          const resultBase64 = canvas.toDataURL('image/jpeg', 0.85);
          resolve(resultBase64);
        } catch (err) {
          console.warn("[IMAGE STANDARDIZATION] Canvas operation failed. Falling back to original source:", err);
          resolve(imageSrc);
        }
      };
      img.onerror = () => {
        resolve(imageSrc);
      };
      img.src = imageSrc;
    });
  };

  const getCompiledTranslations = (name: string, desc: string, threshold?: string) => {
    const isFr = lang === 'FR';
    const limit = threshold || '3';
    return [
      { code: 'EN', name: name, desc: desc },
      { code: 'FR', name: isFr ? name : `${name} (FR)`, desc: isFr ? desc : `${desc} (FR)` },
      { code: 'ES', name: `${name} (ES)`, desc: `${desc} (ES)` },
      { code: 'DE', name: `${name} (DE)`, desc: `${desc} (DE)` },
      { code: 'ZH', name: `${name} (ZH)`, desc: `${desc} (ZH)` }
    ];
  };

  const handleImageFile = (file: File, isEdit: boolean) => {
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

  // Debounced generators
  useEffect(() => {
    if (!showAddAchievement) {
      setGeneratedBadges([]);
      return;
    }
    if (!newAch.name || !newAch.description) {
      setGeneratedBadges([]);
      return;
    }

    if (typeof window !== 'undefined' && window.localStorage.getItem('op_allow_sandbox') === 'true') {
      const opt1 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzhiNWNmNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2VjNDg5OSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2cxKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTUwIDIyIEw1OSAzOCBMNzcgNDAgTDYzIDUyIEw2NyA3MCBMNTAgNjAgTDMzIDcwIEwzNyA1MiBMMjMgNDAgTDQxIDM4IFoiIGZpbGw9IiNmNTllMGIiLz48L3N2Zz4=';
      const opt2 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzNiODJmNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA2YjZkNCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2cyKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTUyIDIyIEwzNSA0OCBMNDggNDggTDQ0IDt0IEw2NSA0NCBMNTAgNDQgWiIgZmlsbD0iI2VhYjMwOCIvPjwvc3ZnPg==';
      const opt3 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2Y5NzMxNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2VhYjMwOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2czKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTM1IDMwIEw2NSAzMCBMNjUgNDIgQzY1IDUwIDU4IDU4IDUwIDU4IEM0MiA1OCAzNSA1MCAzNSA0MiBaIE01MCA1OCBMNTAgNjggTTQwIDY4IEw2MCA2OCIgc3Ryb2tlPSIjZjU5ZTBiIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==';
      setGeneratedBadges([opt1, opt2, opt3]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsGeneratingBadges(true);
      try {
        let token: string | undefined;
        try {
          const { supabase } = await import("@/lib/supabase");
          const { data: { session } } = await supabase.auth.getSession();
          token = session?.access_token;
        } catch (err) {
          console.warn("[BADGE GEN] Failed to retrieve client auth session token:", err);
        }

        const promises = [1, 2, 3].map(async (num) => {
          try {
            const res = await fetch('/api/badges/generate', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify({
                name: newAch.name,
                description: newAch.description,
                seed: Math.floor(Math.random() * 100000) + num * 1234
              })
            });
            const json = await res.json();
            if (json.success && json.dataUri) {
              return json.dataUri;
            }
            throw new Error(json.error || "Generation error");
          } catch (serverErr) {
            console.warn(`[BADGE GEN] Server-side generation failed for option ${num}, trying direct browser fetch fallback:`, serverErr);
            const seed = Math.floor(Math.random() * 100000) + num * 1234;
            const expandedPrompt = `a premium stylized flat vector achievement badge medallion for "${newAch.name}" - ${newAch.description}, glassmorphism, 3d render, dark neon backdrop, high resolution, clean icons, centered, no text, no words`;
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(expandedPrompt)}?width=256&height=256&nologo=true&seed=${seed}`;
            
            const clientRes = await fetch(url);
            if (!clientRes.ok) throw new Error("Client fetch failed");
            const blob = await clientRes.blob();
            
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          }
        });
        const results = await Promise.all(promises);
        setGeneratedBadges(results);
      } catch (err) {
        console.error("AI Badge Generation Error", err);
        const opt1 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzhiNWNmNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2VjNDg5OSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2cxKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTUwIDIyIEw1OSAzOCBMNzcgNDAgTDYzIDUyIEw2NyA3MCBMNTAgNjAgTDMzIDcwIEwzNyA1MiBMMjMgNDAgTDQxIDM4IFoiIGZpbGw9IiNmNTllMGIiLz48L3N2Zz4=';
        const opt2 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzNiODJmNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA2YjZkNCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2cyKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTUyIDIyIEwzNSA0OCBMNDggNDggTDQ0IDc0IEw2NSA0NCBMNTAgNDQgWiIgZmlsbD0iI2VhYjMwOCIvPjwvc3ZnPg==';
        const opt3 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2Y5NzMxNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2VhYjMwOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2czKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTM1IDMwIEw2NSAzMCBMNjUgNDIgQzY1IDUwIDU4IDU4IDUwIDU4IEM0MiA1OCAzNSA1MCAzNSA0MiBaIE01MCA1OCBMNTAgNjggTTQwIDY4IEw2MCA2OCIgc3Ryb2tlPSIjZjU5ZTBiIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==';
        setGeneratedBadges([opt1, opt2, opt3]);
      } finally {
        setIsGeneratingBadges(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [newAch.name, newAch.description, showAddAchievement]);

  useEffect(() => {
    if (!selectedAchievement) {
      setEditGeneratedBadges([]);
      return;
    }
    if (!editName || !editDesc) {
      setEditGeneratedBadges([]);
      return;
    }

    if (typeof window !== 'undefined' && window.localStorage.getItem('op_allow_sandbox') === 'true') {
      const opt1 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzhiNWNmNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2VjNDg5OSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2cxKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTUwIDIyIEw1OSAzOCBMNzcgNDAgTDYzIDUyIEw2NyA3MCBMNTAgNjAgTDMzIDcwIEwzNyA1MiBMMjMgNDAgTDQxIDM4IFoiIGZpbGw9IiNmNTllMGIiLz48L3N2Zz4=';
      const opt2 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzNiODJmNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA2YjZkNCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2cyKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTUyIDIyIEwzNSA0OCBMNDggNDggTDQ0IDc0IEw2NSA0NCBMNTAgNDQgWiIgZmlsbD0iI2VhYjMwOCIvPjwvc3ZnPg==';
      const opt3 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2Y5NzMxNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2VhYjMwOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2czKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTM1IDMwIEw2NSAzMCBMNjUgNDIgQzY1IDUwIDU4IDU4IDUwIDU4IEM0MiA1OCAzNSA1MCAzNSA0MiBaIE01MCA1OCBMNTAgNjggTTQwIDY4IEw2MCA2OCIgc3Ryb2tlPSIjZjU5ZTBiIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==';
      setEditGeneratedBadges([opt1, opt2, opt3]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsEditGeneratingBadges(true);
      try {
        let token: string | undefined;
        try {
          const { supabase } = await import("@/lib/supabase");
          const { data: { session } } = await supabase.auth.getSession();
          token = session?.access_token;
        } catch (err) {
          console.warn("[BADGE GEN] Failed to retrieve client auth session token:", err);
        }

        const promises = [1, 2, 3].map(async (num) => {
          try {
            const res = await fetch('/api/badges/generate', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify({
                name: editName,
                description: editDesc,
                seed: Math.floor(Math.random() * 100000) + num * 1234
              })
            });
            const json = await res.json();
            if (json.success && json.dataUri) {
              return json.dataUri;
            }
            throw new Error(json.error || "Generation error");
          } catch (serverErr) {
            console.warn(`[BADGE GEN] Server-side generation failed for edit option ${num}, trying direct browser fetch fallback:`, serverErr);
            const seed = Math.floor(Math.random() * 100000) + num * 1234;
            const expandedPrompt = `a premium stylized flat vector achievement badge medallion for "${editName}" - ${editDesc}, glassmorphism, 3d render, dark neon backdrop, high resolution, clean icons, centered, no text, no words`;
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(expandedPrompt)}?width=256&height=256&nologo=true&seed=${seed}`;
            
            const clientRes = await fetch(url);
            if (!clientRes.ok) throw new Error("Client fetch failed");
            const blob = await clientRes.blob();
            
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          }
        });
        const results = await Promise.all(promises);
        setEditGeneratedBadges(results);
      } catch (err) {
        console.error("AI Badge Generation Error", err);
        const opt1 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzhiNWNmNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2VjNDg5OSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2cxKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTUwIDIyIEw1OSAzOCBMNzcgNDAgTDYzIDUyIEw2NyA3MCBMNTAgNjAgTDMzIDcwIEwzNyA1MiBMMjMgNDAgTDQxIDM4IFoiIGZpbGw9IiNmNTllMGIiLz48L3N2Zz4=';
        const opt2 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzNiODJmNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA2YjZkNCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2cyKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTUyIDIyIEwzNSA0OCBMNDggNDggTDQ0IDc0IEw2NSA0NCBMNTAgNDQgWiIgZmlsbD0iI2VhYjMwOCIvPjwvc3ZnPg==';
        const opt3 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2Y5NzMxNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2VhYjMwOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2IiBmaWxsPSJ1cmwoI2czKSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTM1IDMwIEw2NSAzMCBMNjUgNDIgQzY1IDUwIDU4IDU4IDUwIDU4IEM0MiA1OCAzNSA1MCAzNSA0MiBaIE01MCA1OCBMNTAgNjggTTQwIDY4IEw2MCA2OCIgc3Ryb2tlPSIjZjU5ZTBiIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==';
        setEditGeneratedBadges([opt1, opt2, opt3]);
      } finally {
        setIsEditGeneratingBadges(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [editName, editDesc, selectedAchievement]);

  // Handlers
  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
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

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedAchievements.map(ach => {
          const styledBadge = BADGE_LIBRARY.find(b => b.id === ach.icon);
          const IconComp = styledBadge ? (LUCIDE_ICONS[styledBadge.iconName] || Award) : (LUCIDE_ICONS[ach.icon] || Award);
          const gradientClass = styledBadge ? styledBadge.gradient : 'from-violet-500 to-fuchsia-600';
          const isArchived = (ach.archivingLevel || 0) > 0;
          const isCustomImg = ach.icon && (ach.icon.startsWith('data:image') || ach.icon.startsWith('http'));
          
          return (
            <div key={ach.id} className={`p-8 border rounded-[40px] flex flex-col justify-between group hover:border-violet-500/30 transition-all shadow-xl relative overflow-hidden ${isArchived ? 'bg-slate-950/20 border-slate-900 opacity-75' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl ${isCustomImg ? 'bg-slate-950 border border-slate-880' : `bg-gradient-to-br ${gradientClass}`} text-white flex items-center justify-center shadow-lg shadow-violet-500/10 overflow-hidden`}>
                    {isCustomImg ? (
                      <img src={ach.icon} alt={ach.name} className="w-full h-full object-cover" />
                    ) : (
                      <IconComp className="w-7 h-7" />
                    )}
                  </div>
                  {isArchived && (
                    <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black rounded-full uppercase tracking-wider font-mono">
                      {tr("Level (label)")} {ach.archivingLevel}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black">{(ach.translations?.[lang.toUpperCase()]?.name || ach.translations?.[lang.toLowerCase()]?.name) || ach.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{(ach.translations?.[lang.toUpperCase()]?.description || ach.translations?.[lang.toLowerCase()]?.description) || ach.description}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-850 flex flex-col gap-4">
                <div className="flex items-center justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                  <div>
                    <p>{tr("Trigger Parameter")}: <span className="text-violet-400">{tr(ach.threshold)}</span></p>
                    <p className="mt-1">{getDynamicBadgeCount(ach)} {tr("Earned")}</p>
                  </div>
                  <div>
                    {ach.startDate && <p>{tr("From:")} <span className="text-slate-400">{ach.startDate}</span></p>}
                    {ach.endDate && <p className="mt-0.5">{tr("To:")} <span className="text-slate-400">{ach.endDate}</span></p>}
                  </div>
                </div>
                
                <div className="h-px bg-slate-850" />
                
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{tr("Archival Level:")}</span>
                  <ArchivingLevelButtons 
                    currentLevel={ach.archivingLevel || 0}
                    lang={lang}
                    onChange={async (nextLvl) => {
                      if (nextLvl === 3) {
                        handleOpenPurge(ach);
                      } else {
                        await dbService.saveAchievement({ 
                          ...ach, 
                          archivingLevel: nextLvl, 
                          status: nextLvl === 0 ? 'active' : 'archived' 
                        });
                        loadData();
                      }
                    }}
                  />
                </div>
                
                <button 
                  type="button"
                  title={tr("Edit")}
                  onClick={() => handleOpenEditAchievement(ach)}
                  className="w-full py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-500 hover:text-white transition-all text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {tr("Edit Details")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACHIEVEMENT ADD MODAL */}
      <AnimatePresence>
        {showAddAchievement && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowAddAchievement(false); setBadgeError(null); }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-4xl bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden my-8 cursor-default max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-slate-850 flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Award className="w-6 h-6 text-violet-500" /> {tr("Create Achievement Badge")}
                </h3>
                <button type="button" onClick={() => { setShowAddAchievement(false); setBadgeError(null); }} className="text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleCreateAchievement} className="p-10 space-y-6 overflow-y-auto custom-scrollbar flex-1 pr-4">
                {badgeError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl">
                    {badgeError}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        {tr("Achievement Name")} <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder={tr("Fast Learner")} 
                        value={newAch.name} 
                        onChange={(e) => setNewAch({...newAch, name: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-violet-500/50" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        {tr("Description")} <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder={tr("record time")} 
                        value={newAch.description} 
                        onChange={(e) => setNewAch({...newAch, description: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        {tr("Trigger Parameter")} <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder={tr("3 days")} 
                        value={newAch.threshold} 
                        onChange={(e) => setNewAch({...newAch, threshold: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                          {tr("Start Date (Optional)")}
                        </label>
                        <input 
                          type="date"
                          value={badgeStartDate}
                          onChange={(e) => setBadgeStartDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                          {tr("End Date (Optional)")}
                        </label>
                        <input 
                          type="date"
                          value={badgeEndDate}
                          onChange={(e) => setBadgeEndDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-violet-600/10">
                      {tr("Create Achievement Badge")}
                    </button>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {((newAch.name && newAch.description) || isGeneratingBadges) && (
                      <div className="p-6 bg-violet-955/20 border border-violet-500/20 rounded-3xl space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 flex items-center gap-1.5 font-mono">
                            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                            {tr("AI Generated Badge Designs")}
                          </span>
                          {isGeneratingBadges && (
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest animate-pulse font-mono">
                              {tr("Generating...")}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {generatedBadges.map((url, idx) => {
                            const isSelected = badgeIcon === url;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setBadgeIcon(url)}
                                className={`p-3 bg-slate-950/60 border rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-850 hover:border-slate-800'}`}
                              >
                                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                                  <img src={url} alt={`AI Option ${idx + 1}`} className="w-full h-full object-contain p-1" />
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider font-mono">
                                  {tr("Badge Option")} {idx + 1}
                                </span>
                              </button>
                            );
                          })}
                          {!isGeneratingBadges && generatedBadges.length === 0 && (
                            <div className="col-span-3 text-center py-4 text-[9px] font-black uppercase tracking-widest text-slate-600 font-mono">
                              {tr("Type a Name & Description to trigger generator")}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between ml-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tr("Badge Library Catalog")}</label>
                      {(() => {
                        const usedActiveIcons = achievements.filter(a => a.status === 'active').map(a => a.icon);
                        const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                        const totalPages = Math.ceil((availableLibraryBadges.length + 1) / 9) || 1;
                        return (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={creationGalleryPage === 1}
                              onClick={() => setCreationGalleryPage(p => Math.max(1, p - 1))}
                              className="px-2.5 py-1 bg-slate-950 border border-slate-850 hover:border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              {tr("◀ Prev (gallery)")}
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                              {creationGalleryPage} / {totalPages}
                            </span>
                            <button
                              type="button"
                              disabled={creationGalleryPage === totalPages}
                              onClick={() => setCreationGalleryPage(p => Math.min(totalPages, p + 1))}
                              className="px-2.5 py-1 bg-slate-950 border border-slate-850 hover:border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              {tr("Next (gallery) →")}
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {(() => {
                      const usedActiveIcons = achievements.filter(a => a.status === 'active').map(a => a.icon);
                      const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                      const totalPages = Math.ceil((availableLibraryBadges.length + 1) / 9) || 1;
                      const curPage = Math.min(creationGalleryPage, totalPages) || 1;
                      
                      let currentPageBadges: StyledBadgeImage[] = [];
                      let showUpload = false;
                      if (curPage === 1) {
                        showUpload = true;
                        currentPageBadges = availableLibraryBadges.slice(0, 8);
                      } else {
                        showUpload = false;
                        const startIndex = (curPage - 1) * 9 - 1;
                        currentPageBadges = availableLibraryBadges.slice(startIndex, startIndex + 9);
                      }

                      return (
                        <div className="grid grid-cols-3 gap-4">
                          {showUpload && (
                            <div className={`p-4 border border-dashed rounded-3xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 group relative overflow-hidden cursor-pointer ${isCreationDragging ? 'border-violet-500 shadow-lg shadow-violet-500/20 bg-slate-900 scale-105' : 'bg-slate-950/60 border-violet-500/40 hover:border-violet-500'}`}>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleImageFile(e.target.files[0], false);
                                  }
                                }}
                                onDragEnter={() => setIsCreationDragging(true)}
                                onDragOver={(e) => { e.preventDefault(); setIsCreationDragging(true); }}
                                onDragLeave={() => setIsCreationDragging(false)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <div className="w-10 h-10 rounded-full bg-violet-650/10 text-violet-400 flex items-center justify-center shadow-md group-hover:bg-violet-600 group-hover:text-white transition-all">
                                <Upload className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] font-black text-violet-400 tracking-wider uppercase group-hover:text-white transition-colors">
                                {isCreationDragging ? tr("Drop here!") : tr("Upload / Drag & Drop")}
                              </span>
                            </div>
                          )}

                          {currentPageBadges.map((img) => {
                            const IconComp = LUCIDE_ICONS[img.iconName] || Award;
                            const isSelected = badgeIcon === img.id || badgeIcon === resolveBadgeIconToBase64Sync(img.id);
                            return (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => setBadgeIcon(img.id)}
                                className={`p-4 bg-slate-950/60 border rounded-3xl flex flex-col items-center gap-3 transition-all hover:scale-105 library-badge-btn ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-850 hover:border-slate-800'}`}
                              >
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${img.gradient} text-white flex items-center justify-center shadow-md`}>
                                  <IconComp className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase truncate max-w-[80px] text-center">
                                  {tr(img.iconName.toUpperCase())}
                                </span>
                                <span className="text-[8px] font-semibold text-slate-500 truncate max-w-[80px] text-center">
                                  {tr(img.colorName)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ACHIEVEMENT EDIT MODAL */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedAchievement(null); setBadgeError(null); }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-4xl bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden my-8 cursor-default max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-slate-850 flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Award className="w-6 h-6 text-violet-500" /> {tr("Edit Achievement Badge")}
                </h3>
                <button type="button" onClick={() => { setSelectedAchievement(null); setBadgeError(null); }} className="text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <div className="p-10 space-y-6 overflow-y-auto custom-scrollbar flex-1 pr-4">
                {badgeError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl">
                    {badgeError}
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        {tr("Achievement Name")} <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-violet-500/50" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        {tr("Description")} <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={editDesc} 
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        {tr("Trigger Parameter")} <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={editThreshold} 
                        onChange={(e) => setEditThreshold(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{tr("Start Date (Optional)")}</label>
                        <input 
                          type="date"
                          value={editStartDate}
                          onChange={(e) => setEditStartDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{tr("End Date (Optional)")}</label>
                        <input 
                          type="date"
                          value={editEndDate}
                          onChange={(e) => setEditEndDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                        />
                      </div>
                    </div>

                    <button type="button" onClick={handleUpdateAchievement} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-violet-600/10">
                      {tr("Update Achievement Badge")}
                    </button>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {((editName && editDesc) || isEditGeneratingBadges) && (
                      <div className="p-6 bg-violet-955/20 border border-violet-500/20 rounded-3xl space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 flex items-center gap-1.5 font-mono">
                            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                            {tr("AI Generated Badge Designs")}
                          </span>
                          {isEditGeneratingBadges && (
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest animate-pulse font-mono">
                              {tr("Generating...")}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {editGeneratedBadges.map((url, idx) => {
                            const isSelected = editIcon === url;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setEditIcon(url)}
                                className={`p-3 bg-slate-950/60 border rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-850 hover:border-slate-800'}`}
                              >
                                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                                  <img src={url} alt={`AI Option ${idx + 1}`} className="w-full h-full object-contain p-1" />
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider font-mono">
                                  {tr("Badge Option")} {idx + 1}
                                </span>
                              </button>
                            );
                          })}
                          {!isEditGeneratingBadges && editGeneratedBadges.length === 0 && (
                            <div className="col-span-3 text-center py-4 text-[9px] font-black uppercase tracking-widest text-slate-600 font-mono">
                              {tr("Type a Name & Description to trigger generator")}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between ml-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tr("Badge Library Catalog")}</label>
                      {(() => {
                        const usedActiveIcons = achievements
                          .filter(a => a.status === 'active' && a.id !== selectedAchievement?.id)
                          .map(a => a.icon);
                        const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                        const totalPages = Math.ceil((availableLibraryBadges.length + 1) / 9) || 1;
                        return (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={editionGalleryPage === 1}
                              onClick={() => setEditionGalleryPage(p => Math.max(1, p - 1))}
                              className="px-2.5 py-1 bg-slate-950 border border-slate-850 hover:border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              {tr("◀ Prev (gallery)")}
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                              {editionGalleryPage} / {totalPages}
                            </span>
                            <button
                              type="button"
                              disabled={editionGalleryPage === totalPages}
                              onClick={() => setEditionGalleryPage(p => Math.min(totalPages, p + 1))}
                              className="px-2.5 py-1 bg-slate-950 border border-slate-850 hover:border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              {tr("Next (gallery) →")}
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {(() => {
                      const usedActiveIcons = achievements
                        .filter(a => a.status === 'active' && a.id !== selectedAchievement?.id)
                        .map(a => a.icon);
                      const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                      const totalPages = Math.ceil((availableLibraryBadges.length + 1) / 9) || 1;
                      const curPage = Math.min(editionGalleryPage, totalPages) || 1;
                      
                      let currentPageBadges: StyledBadgeImage[] = [];
                      let showUpload = false;
                      if (curPage === 1) {
                        showUpload = true;
                        currentPageBadges = availableLibraryBadges.slice(0, 8);
                      } else {
                        showUpload = false;
                        const startIndex = (curPage - 1) * 9 - 1;
                        currentPageBadges = availableLibraryBadges.slice(startIndex, startIndex + 9);
                      }

                      return (
                        <div className="grid grid-cols-3 gap-4">
                          {showUpload && (
                            <div className={`p-4 border border-dashed rounded-3xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 group relative overflow-hidden cursor-pointer ${isEditionDragging ? 'border-violet-500 shadow-lg shadow-violet-500/20 bg-slate-900 scale-105' : 'bg-slate-950/60 border-violet-500/40 hover:border-violet-500'}`}>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleImageFile(e.target.files[0], true);
                                  }
                                }}
                                onDragEnter={() => setIsEditionDragging(true)}
                                onDragOver={(e) => { e.preventDefault(); setIsEditionDragging(true); }}
                                onDragLeave={() => setIsEditionDragging(false)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <div className="w-10 h-10 rounded-full bg-violet-650/10 text-violet-400 flex items-center justify-center shadow-md group-hover:bg-violet-600 group-hover:text-white transition-all">
                                <Upload className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] font-black text-violet-400 tracking-wider uppercase group-hover:text-white transition-colors">
                                {isEditionDragging ? tr("Drop here!") : tr("Upload / Drag & Drop")}
                              </span>
                            </div>
                          )}

                          {currentPageBadges.map((img) => {
                            const IconComp = LUCIDE_ICONS[img.iconName] || Award;
                            const isSelected = editIcon === img.id || editIcon === resolveBadgeIconToBase64Sync(img.id);
                            return (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => setEditIcon(img.id)}
                                className={`p-4 bg-slate-950/60 border rounded-3xl flex flex-col items-center gap-3 transition-all hover:scale-105 library-badge-btn ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-850 hover:border-slate-800'}`}
                              >
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${img.gradient} text-white flex items-center justify-center shadow-md`}>
                                  <IconComp className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase truncate max-w-[80px] text-center">
                                  {tr(img.iconName.toUpperCase())}
                                </span>
                                <span className="text-[8px] font-semibold text-slate-500 truncate max-w-[80px] text-center">
                                  {tr(img.colorName)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DOUBLE-SAFEGUARD PURGE CONFIRM MODAL */}
      <AnimatePresence>
        {purgeTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPurgeTarget(null)}
              className="fixed inset-0 bg-slate-955/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-850 bg-red-955/20 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">
                  {pStrings.purge_badge_title}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed text-center">
                  {pStrings.purge_badge_desc.replace("{title}", purgeTarget.name)}
                </p>
                
                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => setPurgeTarget(null)}
                    className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900"
                  >
                    {pStrings.purge_badge_cancel_btn}
                  </button>
                  <button 
                    type="button"
                    onClick={handlePurgeExecute}
                    className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl transition-all bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/10"
                  >
                    {pStrings.purge_badge_confirm_btn}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
