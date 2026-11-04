"use client";

import React from 'react';
import { TopNav, Footer, AITutorOverlay } from '@/components/RefinedUI';
import { UI_STRINGS } from '@/lib/translations';
import { AudioReader } from '@/components/AudioReader';
import { GraduationCap, Award, ChevronRight, ShieldCheck, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { EnrollmentModal } from '@/components/modals/EnrollmentModal';
import { dbService } from '@/lib/db';

import { getConflictDescription, getElectiveDescription } from './components/curriculumAuditHelpers';
import { getCurriculumMarkdown } from './components/curriculumMarkdownGenerator';
import { useProfileCurriculum } from './components/useProfileCurriculum';
import { StatsAndSummarySection } from './components/StatsAndSummarySection';
import { ActiveModulesSection } from './components/ActiveModulesSection';
import { RecommendedSection } from './components/RecommendedSection';
import { AchievementsGallerySection } from './components/AchievementsGallerySection';
import { CurriculumDrillDownModal } from './components/CurriculumDrillDownModal';
import { OptOutSafeguardModal } from './components/OptOutSafeguardModal';
import { TutorSelectorModal } from './components/TutorSelectorModal';
import { CourseReviewModal } from './components/CourseReviewModal';

const STREAK_7_TITLE: Record<string, string> = {
  FR: "Rythme Olympien", EN: "Olympian Pace", ES: "Ritmo Olímpico", DE: "Olympischer Rhythmus",
  ZH: "奥林匹克节奏", PT: "Ritmo Olímpico", AR: "إيقاع أولمبي", HI: "ओलंपियन गति", UR: "اولمپک رفتار"
};
const STREAK_3_TITLE: Record<string, string> = {
  FR: "Habitude Ancrée", EN: "Solid Habit", ES: "Hábito Sólido", DE: "Feste Gewohnheit",
  ZH: "良好习惯", PT: "Hábito Sólido", AR: "عادة راسخة", HI: "पक्की आदत", UR: "پختہ عادت"
};
const STREAK_0_TITLE: Record<string, string> = {
  FR: "Premier Pas", EN: "First Step", ES: "Primer Paso", DE: "Erster Schritt",
  ZH: "第一步", PT: "Primeiro Passo", AR: "الخطوة الأولى", HI: "पहला कदम", UR: "پہلا قدم"
};
const STUDY_600_TITLE: Record<string, string> = {
  FR: "Endurance Académique", EN: "Academic Endurance", ES: "Resistencia Académica", DE: "Akademische Ausdauer",
  ZH: "学术耐力", PT: "Resistência Acadêmica", AR: "قدرة أكاديمية", HI: "अकादमिक सहनशक्ति", UR: "تعلیمی استقامت"
};
const STUDY_120_TITLE: Record<string, string> = {
  FR: "Immersion Active", EN: "Active Immersion", ES: "Inmersión Activa", DE: "Aktive Vertiefung",
  ZH: "深度沉浸", PT: "Imersão Ativa", AR: "انغماس نشط", HI: "सक्रिय जुड़ाव", UR: "سرگرم شمولیت"
};
const STUDY_0_TITLE: Record<string, string> = {
  FR: "Découverte Initiale", EN: "Initial Discovery", ES: "Descubrimiento Inicial", DE: "Erste Erkundung",
  ZH: "初步探索", PT: "Descoberta Inicial", AR: "استكشاف أولي", HI: "आरंभिक खोज", UR: "ابتدائی دریافت"
};
const EARNED_BADGES_LABEL: Record<string, string> = {
  FR: "Badges obtenus sur ce cours", EN: "Badges earned in this course", ES: "Insignias obtenidas en este curso",
  DE: "In diesem Kurs erworbene Abzeichen", ZH: "本课程获得的徽章", PT: "Distintivos obtidos neste curso",
  AR: "الأوسمة المكتسبة في هذه الدورة", HI: "इस पाठ्यक्रम में अर्जित बैज", UR: "اس کورس میں حاصل کردہ بیجز"
};

const modeStyles = {
  dark: 'bg-slate-950 text-white',
  light: 'bg-slate-50 text-slate-900',
  sepia: 'bg-[#f8f5eb] text-[#433422]'
};

export default function CurriculumPage() {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const upperLang = (lang || 'EN').toUpperCase();

  const profileData = useProfileCurriculum({ lang });
  const {
    progress,
    courses,
    achievements,
    earnedIds,
    loading,
    readingMode,
    bookmarks,
    selectedEnrollCourse, setSelectedEnrollCourse,
    dismissedConflicts, setDismissedConflicts,
    keepChildCourses, setKeepChildCourses,
    enrollmentSuccess, setEnrollmentSuccess,
    selectedCurriculumForDrillDown, setSelectedCurriculumForDrillDown,
    abandonTarget, setAbandonTarget,
    showReviewModal, setShowReviewModal,
    selectedReviewCourse, setSelectedReviewCourse,
    isReviewReadOnly, setIsReviewReadOnly,
    courseFeedbacks, setCourseFeedbacks,
    submittingReview, setSubmittingReview,
    showTutorModal, setShowTutorModal,
    activeTutorId,
    tutors,
    versionConflicts,
    recommendations,
    handleDismissRecommendation,
    isCourseNew,
    getCoursePath,
    getLocalizedSubject,
    handleCourseClick,
    enrollInRecommended,
    getActiveTutorName,
    handleSelectTutor,
    getCourseEarnedAchievements,
    toggleBookmark,
    handleOptOut,
    getLocalizedTitle,
    getLocalizedCourseDescription
  } = profileData;

  const hasCoursesInOtherLangs = progress?.activeModules ? progress.activeModules.some((course: any) => {
    const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
    if (!courseDetails || !courseDetails.languages || courseDetails.languages.length === 0) return false;
    return !courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase());
  }) : false;

  return (
    <div className={`min-h-screen transition-colors duration-500 theme-${readingMode} ${modeStyles[readingMode as keyof typeof modeStyles] || modeStyles.dark}`}>
      <TopNav showReadingModeSelector={true} />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <header className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4">
              <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-blue-500" />
              {t.academic_profile}
            </h1>
            <div className="flex items-center gap-3">
              <AudioReader 
                title={t.academic_profile} 
                content={getCurriculumMarkdown(progress, t, courses, achievements, lang)} 
                lang={lang} 
              />
              <Link 
                href="/profile/bookmarks" 
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 font-black text-xs uppercase tracking-widest hover:border-amber-500/50 hover:bg-slate-800/80 transition-all cursor-pointer shadow-lg"
              >
                <Bookmark className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{t.saved_courses || "Mes Favoris"} ({bookmarks.length})</span>
              </Link>
            </div>
          </div>
          <p className="text-slate-400 text-lg">
            {t.profile_subtitle}
          </p>
        </header>

        {/* Global banner: courses in other languages alert */}
        {hasCoursesInOtherLangs && (
          <div className="mb-10 p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4 text-amber-300 animate-fade-in shadow-lg">
            <span className="text-xl">🌐</span>
            <div className="flex-1 text-xs">
              <span className="font-bold">{t.multilingual_notice_title || "Cours suivis en d'autres langues détectés"}</span>
              <p className="text-amber-400/80 mt-0.5">{t.multilingual_notice_desc || "Certains modules de votre parcours ont été commencés dans une langue différente de la langue actuelle d'affichage."}</p>
            </div>
          </div>
        )}

        {/* VERSION DIVERGENCE / CONFLICTS NOTICES */}
        {versionConflicts.length > 0 && versionConflicts.map((conflict: any) => (
          <motion.div 
            key={conflict.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-violet-950/40 via-slate-900/40 to-slate-950 border border-violet-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-widest text-violet-400">
                  {t.concordance_alert || "Alerte de Concordance Pédagogique"}
                </h4>
                <p className="text-xs text-slate-300">
                  {getConflictDescription(conflict, lang)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => setDismissedConflicts(prev => [...prev, conflict.id])}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
              >
                {t.dismiss || "Ignorer"}
              </button>
            </div>
          </motion.div>
        ))}

        {/* AI PEDAGOGICAL SUMMARY & STATS */}
        <StatsAndSummarySection
          progress={progress}
          t={t}
          lang={lang}
          getActiveTutorName={getActiveTutorName}
          setShowTutorModal={setShowTutorModal}
          STREAK_7_TITLE={STREAK_7_TITLE}
          STREAK_3_TITLE={STREAK_3_TITLE}
          STREAK_0_TITLE={STREAK_0_TITLE}
          STUDY_600_TITLE={STUDY_600_TITLE}
          STUDY_120_TITLE={STUDY_120_TITLE}
          STUDY_0_TITLE={STUDY_0_TITLE}
        />

        {/* ACTIVE & COMPLETED MODULES */}
        <ActiveModulesSection
          progress={progress}
          courses={courses}
          lang={lang}
          upperLang={upperLang}
          t={t}
          bookmarks={bookmarks}
          toggleBookmark={toggleBookmark}
          handleCourseClick={handleCourseClick}
          getLocalizedTitle={getLocalizedTitle}
          getLocalizedSubject={getLocalizedSubject}
          getLocalizedCourseDescription={getLocalizedCourseDescription}
          getCoursePath={getCoursePath}
          getCourseEarnedAchievements={getCourseEarnedAchievements}
          setSelectedCurriculumForDrillDown={setSelectedCurriculumForDrillDown}
          setAbandonTarget={setAbandonTarget}
          setSelectedEnrollCourse={setSelectedEnrollCourse}
          setSelectedReviewCourse={setSelectedReviewCourse}
          setIsReviewReadOnly={setIsReviewReadOnly}
          setShowReviewModal={setShowReviewModal}
          EARNED_BADGES_LABEL={EARNED_BADGES_LABEL}
        />

        {/* RECOMMENDED COURSES */}
        <RecommendedSection
          recommendations={recommendations}
          lang={lang}
          upperLang={upperLang}
          t={t}
          bookmarks={bookmarks}
          toggleBookmark={toggleBookmark}
          handleDismissRecommendation={handleDismissRecommendation}
          handleCourseClick={handleCourseClick}
          enrollInRecommended={enrollInRecommended}
          setSelectedEnrollCourse={setSelectedEnrollCourse}
          isCourseNew={isCourseNew}
          getLocalizedTitle={getLocalizedTitle}
          getLocalizedSubject={getLocalizedSubject}
          getLocalizedCourseDescription={getLocalizedCourseDescription}
          getCoursePath={getCoursePath}
        />

        {/* ACHIEVEMENTS GALLERY */}
        <AchievementsGallerySection
          achievements={achievements}
          earnedIds={earnedIds}
          lang={lang}
          t={t}
        />
      </div>

      <Footer />

      {/* CURRICULUM DRILL-DOWN MODAL */}
      <CurriculumDrillDownModal
        selectedCurriculum={selectedCurriculumForDrillDown}
        setSelectedCurriculum={setSelectedCurriculumForDrillDown}
        courses={courses}
        progress={progress}
        t={t}
        lang={lang}
        getLocalizedTitle={getLocalizedTitle}
        getLocalizedCourseDescription={getLocalizedCourseDescription}
        handleCourseClick={handleCourseClick}
        setAbandonTarget={setAbandonTarget}
      />

      {/* OPT-OUT SAFEGUARD MODAL */}
      <OptOutSafeguardModal
        abandonTarget={abandonTarget}
        setAbandonTarget={setAbandonTarget}
        keepChildCourses={keepChildCourses}
        setKeepChildCourses={setKeepChildCourses}
        handleOptOut={handleOptOut}
        courses={courses}
        t={t}
        lang={lang}
        getLocalizedTitle={getLocalizedTitle}
      />

      {/* TUTOR SELECTOR MODAL */}
      <TutorSelectorModal
        showTutorModal={showTutorModal}
        setShowTutorModal={setShowTutorModal}
        tutors={tutors}
        activeTutorId={activeTutorId}
        handleSelectTutor={handleSelectTutor}
        t={t}
      />

      {/* COURSE ENROLLMENT DRAWER */}
      {selectedEnrollCourse && (
        <EnrollmentModal 
          course={selectedEnrollCourse}
          onClose={() => setSelectedEnrollCourse(null)}
          lang={lang}
          isLoggedIn={true}
          enrolledIds={(progress?.activeModules || []).map((c: any) => c.id)}
          courses={courses}
          onEnroll={async () => {
            setSelectedEnrollCourse(null);
            setEnrollmentSuccess(true);
            setTimeout(() => setEnrollmentSuccess(false), 3000);
          }}
        />
      )}

      {/* COURSE REVIEW MODAL */}
      <CourseReviewModal
        showReviewModal={showReviewModal}
        setShowReviewModal={setShowReviewModal}
        selectedReviewCourse={selectedReviewCourse}
        setSelectedReviewCourse={setSelectedReviewCourse}
        isReviewReadOnly={isReviewReadOnly}
        courseFeedbacks={courseFeedbacks}
        setCourseFeedbacks={setCourseFeedbacks}
        submittingReview={submittingReview}
        setSubmittingReview={setSubmittingReview}
        dbService={dbService}
        t={t}
        lang={lang}
        getLocalizedTitle={getLocalizedTitle}
      />

      {/* AI Tutor Chat Overlay */}
      <AITutorOverlay courseTitle={t.academic_profile} />
    </div>
  );
}
