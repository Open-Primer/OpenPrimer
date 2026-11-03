"use client";

/**
 * @file RefinedUI.tsx
 * @description Unified barrel module re-exporting institutional navigation, footer,
 * and AI tutor overlay components for backward compatibility.
 */

export { TopNav } from './navigation/TopNav';
export { Footer, AdminFooter } from './navigation/Footer';
export { AITutorOverlay, AI_ACT_DISCLAIMERS, TutorMessageContent } from './tutor/AITutorOverlay';

// Re-export translation helpers originally re-exported from here
export { 
  UI_STRINGS, 
  STATIC_UI_STRINGS, 
  formatCourseLevel, 
  getLocalizedLabel,
  getLocalizedLevelSlug,
  getCanonicalLevelFromSlug,
  getLocalizedSubjectSlug,
  getCanonicalSubjectFromSlug,
  getCoursePath
} from '@/lib/translations';
