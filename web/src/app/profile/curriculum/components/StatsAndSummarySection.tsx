import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, ChevronRight, Clock, GraduationCap } from 'lucide-react';

interface StatsAndSummarySectionProps {
  progress: any;
  t: any;
  lang: string;
  getActiveTutorName: () => string;
  setShowTutorModal: (show: boolean) => void;
  STREAK_7_TITLE: Record<string, string>;
  STREAK_3_TITLE: Record<string, string>;
  STREAK_0_TITLE: Record<string, string>;
  STUDY_600_TITLE: Record<string, string>;
  STUDY_120_TITLE: Record<string, string>;
  STUDY_0_TITLE: Record<string, string>;
}

export const StatsAndSummarySection: React.FC<StatsAndSummarySectionProps> = ({
  progress,
  t,
  lang,
  getActiveTutorName,
  setShowTutorModal,
  STREAK_7_TITLE,
  STREAK_3_TITLE,
  STREAK_0_TITLE,
  STUDY_600_TITLE,
  STUDY_120_TITLE,
  STUDY_0_TITLE
}) => {
  if (!progress) return null;

  return (
    <>
      {/* AI PEDAGOGICAL SUMMARY */}
      {progress.activeModules && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 p-10 bg-gradient-to-br from-blue-600/10 via-slate-900/40 to-slate-950 border border-blue-500/20 rounded-[60px] relative overflow-hidden ai-summary-card"
        >
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Brain className="w-32 h-32 text-blue-400" />
           </div>
           <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-3">
                   <Sparkles className="w-4 h-4 animate-pulse" /> {t.tutor_summary}
                </h3>
                <button 
                  onClick={() => setShowTutorModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] z-20 self-start sm:self-auto"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>
                    {t.tutor}: {getActiveTutorName()}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-200 max-w-3xl italic">
                 "{progress.aiSummary}"
              </p>
           </div>
        </motion.section>
      )}

      {/* STATS GRID */}
      {progress.activeModules && progress.activeModules.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {/* Study Streak */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-orange-500/30 transition-all">
            <div className="text-3xl mb-4">🔥</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
              {t.study_streak}
            </p>
            <p className="text-3xl font-black text-white">
              {progress.studyStreakDays ?? 0}
              <span className="text-base text-slate-500 font-bold ml-2">
                {(progress.studyStreakDays ?? 0) === 1 ? t.day : t.days}
              </span>
            </p>
            <p className="text-[9px] text-slate-600 mt-2 font-medium">
              {(progress.studyStreakDays ?? 0) >= 7
                ? (STREAK_7_TITLE[lang] || STREAK_7_TITLE.EN)
                : (progress.studyStreakDays ?? 0) >= 3
                ? (STREAK_3_TITLE[lang] || STREAK_3_TITLE.EN)
                : (STREAK_0_TITLE[lang] || STREAK_0_TITLE.EN)}
            </p>
          </div>

          {/* Mastery Points */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-violet-500/30 transition-all">
            <Sparkles className="w-8 h-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
              {t.mastery_points}
            </p>
            <p className="text-3xl font-black text-white">
              {progress.masteryPoints ?? 0}
              <span className="text-base text-slate-500 font-bold ml-2">pt{(progress.masteryPoints ?? 0) !== 1 ? 's' : ''}</span>
            </p>
            <p className="text-[9px] font-black uppercase tracking-wider mt-2 text-violet-400">
              {(progress.masteryPoints ?? 0) >= 50 ? t.mastery_master : (progress.masteryPoints ?? 0) >= 25 ? t.mastery_expert : (progress.masteryPoints ?? 0) >= 10 ? t.mastery_scholar : t.mastery_apprentice}
            </p>
          </div>

          {/* Total Study Hours */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-emerald-500/30 transition-all">
            <Clock className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{t.learning_time}</p>
            <p className="text-3xl font-black text-white">{progress.learningTime || "0h 0m"}</p>
            <p className="text-[9px] text-slate-600 mt-2 font-medium">
              {(progress.totalMinutes ?? 0) >= 600
                ? (STUDY_600_TITLE[lang] || STUDY_600_TITLE.EN)
                : (progress.totalMinutes ?? 0) >= 120
                ? (STUDY_120_TITLE[lang] || STUDY_120_TITLE.EN)
                : (STUDY_0_TITLE[lang] || STUDY_0_TITLE.EN)}
            </p>
          </div>

          {/* Courses Mastered */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-blue-500/30 transition-all">
            <GraduationCap className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
              {t.courses_mastered}
            </p>
            <p className="text-3xl font-black text-white">{progress.completedCount ?? 0}</p>
            <p className="text-[9px] text-slate-555 mt-2 font-medium flex items-center gap-1">
              <span className="text-blue-400 font-black">{progress.inProgressCount ?? 0}</span>
              &nbsp;{t.in_progress_of}
              &nbsp;<span className="text-slate-400 font-black">{progress.activeModules?.length ?? 0}</span>
              &nbsp;{t.enrolled}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
