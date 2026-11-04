import {
  UserProfile, MockCourse, SyllabusNode, ReportCluster, UV,
  SearchHistoryItem, StyledBadgeImage, TranslationRequestEntry,
  RefusedCourseEntry, ContactFeedback, CourseCompletionEntry,
  TranslationEmailNotification, LanguageInfo, RefusedTranslationEntry,
  RefusedRevisionEntry, CourseFeedback, TutorPersonality, AgentMetric
} from '../types';

export const syllabi: SyllabusNode[] = [
  { id: 'syll-bio-l1', title: 'Biology L1 Core', level: 'L1', subject: 'Biology', units: ['cell-bio', 'molecular-genetics'] }
];

export const reportClusters: ReportCluster[] = [
  { 
    id: 'cl_1', 
    course: 'Cell Biology', 
    issueSummary: 'Mitochondria ATP count discrepancy reported by multiple users.', 
    count: 42, 
    status: 'Pending',
    aiProposal: 'Update ATP yield from 36 to 38 based on latest research.',
    priority: 'High'
  }
];

export const uvs: UV[] = [
  { 
    id: 'cell-bio', 
    name: 'Cell Biology', 
    subject: 'Biology', 
    level: 'L1', 
    lessonsCount: 5, 
    rating: 4.8,
    enrolledCount: 1250,
    successRate: 92,
    languages: ['en', 'fr'], 
    translationStatus: { 'en': 'complete', 'fr': 'ai-draft' } 
  },
  { 
    id: 'python-intro', 
    name: 'Python Fundamentals', 
    subject: 'CS', 
    level: 'L1', 
    lessonsCount: 10, 
    rating: 4.5,
    enrolledCount: 3400,
    successRate: 88,
    languages: ['en'], 
    translationStatus: { 'en': 'complete' } 
  }
];

export const generatePreseededSearchHistory = (): SearchHistoryEntry[] => {
  const history: SearchHistoryEntry[] = [];
  const now = new Date();
  
  // Pre-seed search failures from last 30 days
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const date = new Date();
    date.setDate(now.getDate() - daysAgo);
    history.push({
      id: `sh_at_${i}`,
      query: "Advanced Thermodynamics",
      timestamp: date.toISOString(),
      wasSuccessful: false,
      userId: "u2"
    });
  }

  for (let i = 0; i < 18; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const date = new Date();
    date.setDate(now.getDate() - daysAgo);
    history.push({
      id: `sh_lm_${i}`,
      query: "Lagrangian Mechanics",
      timestamp: date.toISOString(),
      wasSuccessful: false
    });
  }

  for (let i = 0; i < 12; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const date = new Date();
    date.setDate(now.getDate() - daysAgo);
    history.push({
      id: `sh_ocr_${i}`,
      query: "Organic Chemistry Reactions",
      timestamp: date.toISOString(),
      wasSuccessful: false
    });
  }

  for (let i = 0; i < 8; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const date = new Date();
    date.setDate(now.getDate() - daysAgo);
    history.push({
      id: `sh_mmf_${i}`,
      query: "Microeconomics Market Forms",
      timestamp: date.toISOString(),
      wasSuccessful: false
    });
  }

  for (let i = 0; i < 4; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const date = new Date();
    date.setDate(now.getDate() - daysAgo);
    history.push({
      id: `sh_mlf_${i}`,
      query: "Machine Learning Fundamentals",
      timestamp: date.toISOString(),
      wasSuccessful: false
    });
  }

  const successfulQueries = ["Cell Biology", "Quantum Physics", "Linear Algebra", "Calculus I"];
  successfulQueries.forEach((q, idx) => {
    for (let i = 0; i < 15; i++) {
      const daysAgo = Math.floor(Math.random() * 28);
      const date = new Date();
      date.setDate(now.getDate() - daysAgo);
      history.push({
        id: `sh_succ_${idx}_${i}`,
        query: q,
        timestamp: date.toISOString(),
        wasSuccessful: true
      });
    }
  });

  return history;
};

export const BADGE_LIBRARY: StyledBadgeImage[] = [
  { id: 'img_1', iconName: 'Award', gradient: 'from-violet-500 to-fuchsia-600', colorName: 'Purple' },
  { id: 'img_2', iconName: 'Zap', gradient: 'from-amber-400 to-orange-500', colorName: 'Amber' },
  { id: 'img_3', iconName: 'Star', gradient: 'from-yellow-400 to-amber-500', colorName: 'Gold' },
  { id: 'img_4', iconName: 'Flame', gradient: 'from-red-500 to-orange-500', colorName: 'Red' },
  { id: 'img_5', iconName: 'Trophy', gradient: 'from-yellow-300 to-yellow-500', colorName: 'Yellow' },
  { id: 'img_6', iconName: 'Clock', gradient: 'from-blue-400 to-cyan-500', colorName: 'Blue' },
  { id: 'img_7', iconName: 'Clock', gradient: 'from-indigo-400 to-purple-600', colorName: 'Indigo' },
  { id: 'img_8', iconName: 'Crown', gradient: 'from-yellow-500 to-amber-600', colorName: 'Crown Gold' },
  { id: 'img_9', iconName: 'Book', gradient: 'from-emerald-400 to-teal-500', colorName: 'Emerald' },
  { id: 'img_10', iconName: 'ShieldCheck', gradient: 'from-teal-400 to-cyan-500', colorName: 'Teal' },
  { id: 'img_11', iconName: 'Award', gradient: 'from-green-400 to-emerald-600', colorName: 'Green' },
  { id: 'img_12', iconName: 'Layers', gradient: 'from-pink-400 to-rose-600', colorName: 'Pink' },
  { id: 'img_13', iconName: 'CheckCircle', gradient: 'from-cyan-400 to-blue-500', colorName: 'Cyan' },
  { id: 'img_14', iconName: 'Trophy', gradient: 'from-slate-300 to-slate-500', colorName: 'Platinum' },
  { id: 'img_15', iconName: 'Activity', gradient: 'from-rose-500 to-red-600', colorName: 'Rose' },
  { id: 'img_16', iconName: 'Heart', gradient: 'from-pink-500 to-rose-500', colorName: 'Heart Rose' },
  { id: 'img_17', iconName: 'Compass', gradient: 'from-blue-500 to-indigo-500', colorName: 'Compass Blue' },
  { id: 'img_18', iconName: 'Map', gradient: 'from-amber-500 to-emerald-500', colorName: 'Map Green' },
  { id: 'img_19', iconName: 'GraduationCap', gradient: 'from-cyan-500 to-blue-600', colorName: 'Graduation Blue' },
  { id: 'img_20', iconName: 'Target', gradient: 'from-red-600 to-rose-600', colorName: 'Target Red' },
  { id: 'img_21', iconName: 'Cpu', gradient: 'from-slate-700 to-slate-900', colorName: 'Cpu Obsidian' },
  { id: 'img_22', iconName: 'Globe', gradient: 'from-sky-400 to-blue-500', colorName: 'Sky Blue' },
  { id: 'img_23', iconName: 'Key', gradient: 'from-yellow-600 to-amber-600', colorName: 'Bronze Key' },
  { id: 'img_24', iconName: 'Lock', gradient: 'from-red-500 to-rose-700', colorName: 'Lock Crimson' },
  { id: 'img_25', iconName: 'Lightbulb', gradient: 'from-amber-300 to-yellow-400', colorName: 'Bulb Yellow' },
  { id: 'img_26', iconName: 'Rocket', gradient: 'from-orange-500 to-red-650', colorName: 'Rocket Fire' },
  { id: 'img_27', iconName: 'Search', gradient: 'from-slate-400 to-slate-600', colorName: 'Search Silver' },
  { id: 'img_28', iconName: 'Sparkles', gradient: 'from-violet-400 to-indigo-600', colorName: 'Cosmic Indigo' },
  { id: 'img_29', iconName: 'Award', gradient: 'from-amber-500 to-yellow-600', colorName: 'Gold Award' },
  { id: 'img_30', iconName: 'Trophy', gradient: 'from-orange-400 to-pink-500', colorName: 'Sunset Gold' },
  { id: 'img_31', iconName: 'Zap', gradient: 'from-teal-400 to-emerald-500', colorName: 'Electric Mint' },
  { id: 'img_32', iconName: 'Flame', gradient: 'from-purple-500 to-pink-500', colorName: 'Magenta Fire' },
  { id: 'img_33', iconName: 'Book', gradient: 'from-blue-600 to-indigo-700', colorName: 'Ocean Book' },
  { id: 'img_34', iconName: 'ShieldCheck', gradient: 'from-slate-500 to-slate-700', colorName: 'Iron Shield' },
  { id: 'img_35', iconName: 'Crown', gradient: 'from-indigo-500 to-pink-500', colorName: 'Royal Pink' },
  { id: 'img_36', iconName: 'Heart', gradient: 'from-red-400 to-rose-600', colorName: 'Ruby Heart' },
  { id: 'img_37', iconName: 'Compass', gradient: 'from-teal-500 to-cyan-600', colorName: 'Ocean Compass' },
  { id: 'img_38', iconName: 'GraduationCap', gradient: 'from-purple-600 to-fuchsia-700', colorName: 'Master Purple' },
  { id: 'img_39', iconName: 'Target', gradient: 'from-orange-500 to-red-500', colorName: 'Neon Target' },
  { id: 'img_40', iconName: 'Cpu', gradient: 'from-emerald-500 to-green-600', colorName: 'Tech Green' },
  { id: 'img_41', iconName: 'Globe', gradient: 'from-blue-500 to-teal-500', colorName: 'Global Teal' },
  { id: 'img_42', iconName: 'Key', gradient: 'from-yellow-400 to-yellow-600', colorName: 'Golden Key' },
  { id: 'img_43', iconName: 'Lock', gradient: 'from-indigo-600 to-purple-800', colorName: 'Lock Dark' },
  { id: 'img_44', iconName: 'Lightbulb', gradient: 'from-lime-400 to-emerald-500', colorName: 'Lime Bulb' },
  { id: 'img_45', iconName: 'Rocket', gradient: 'from-cyan-400 to-blue-600', colorName: 'Star Rocket' },
  { id: 'img_46', iconName: 'Search', gradient: 'from-rose-400 to-pink-600', colorName: 'Rose Glass' },
  { id: 'img_47', iconName: 'Sparkles', gradient: 'from-yellow-300 to-pink-500', colorName: 'Pixie Sparkle' },
  { id: 'img_48', iconName: 'Activity', gradient: 'from-emerald-400 to-teal-600', colorName: 'Pulse Green' },
  { id: 'img_49', iconName: 'Layers', gradient: 'from-amber-400 to-yellow-600', colorName: 'Layers Gold' },
  { id: 'img_50', iconName: 'Award', gradient: 'from-red-400 to-orange-600', colorName: 'Flame Award' }
];

