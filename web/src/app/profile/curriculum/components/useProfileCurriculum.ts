import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dbService, progressService } from '@/lib/db';
import { cleanPathSegment, getLocalizedLabel } from '@/lib/translations';
import { 
  getBaseSlug, 
  getLocalizedCourseDescription, 
  getLocalizedTitle, 
  getLocalizedSubject as getLocalizedSubjectHelper, 
  getCoursePath as getCoursePathHelper 
} from './courseNavigationHelpers';
import { computeVersionConflicts, computeRecommendations } from './curriculumRecommendations';

export interface UseProfileCurriculumProps {
  lang: string;
}

export function useProfileCurriculum({ lang }: UseProfileCurriculumProps) {
  const router = useRouter();

  const [progress, setProgress] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [earnedIds, setEarnedIds] = useState<number[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [curriculumRevision, setCurriculumRevision] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingMode, setReadingMode] = useState('dark');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<any | null>(null);
  const [dismissedRecIds, setDismissedRecIds] = useState<number[]>([]);
  const [dismissedConflicts, setDismissedConflicts] = useState<number[]>([]);
  const [keepChildCourses, setKeepChildCourses] = useState<boolean>(true);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [selectedCurriculumForDrillDown, setSelectedCurriculumForDrillDown] = useState<any | null>(null);
  const [abandonTarget, setAbandonTarget] = useState<any | null>(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewCourse, setSelectedReviewCourse] = useState<any | null>(null);
  const [isReviewReadOnly, setIsReviewReadOnly] = useState(false);
  const [courseFeedbacks, setCourseFeedbacks] = useState<Record<number, any>>({});
  const [submittingReview, setSubmittingReview] = useState(false);

  const [showTutorModal, setShowTutorModal] = useState(false);
  const [activeTutorId, setActiveTutorId] = useState('socratic');
  const [tutors, setTutors] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTutor = localStorage.getItem('openprimer_active_tutor_id');
      if (savedTutor) setActiveTutorId(savedTutor);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('op_reading_mode');
      if (savedTheme) setReadingMode(savedTheme);
      const savedBookmarks = localStorage.getItem('op_bookmarked_courses');
      if (savedBookmarks) {
        try {
          setBookmarks(JSON.parse(savedBookmarks));
        } catch (e) {}
      }
    }
  }, []);

  const handleDismissRecommendation = (id: number) => {
    setDismissedRecIds(prev => [...prev, id]);
  };

  const isCourseNew = (course: any) => progressService.isNewCourse(course.created_at);

  const getCoursePath = (c: any) => getCoursePathHelper(c, lang);
  const getLocalizedSubject = (subj: string) => getLocalizedSubjectHelper(subj, lang, getLocalizedLabel);

  const handleCourseClick = (c: any) => {
    if (c.isCurriculum) {
      const fullCurriculum = courses.find((item: any) => item.id === c.id) || c;
      setSelectedCurriculumForDrillDown(fullCurriculum);
      return;
    }
    navigateToCourseDirect(c);
  };

  const navigateToCourseDirect = async (c: any) => {
    const slug = c.slug || cleanPathSegment(c.title || '');
    if (slug === 'Statistics' || c.id === 11) {
      router.push(`/L1/Mathematics/Statistics/introduction`);
      return;
    }

    const cleanSubject = c.subject ? c.subject.replace(/\s+/g, '_') : 'General';
    const cleanLevel = c.level || 'L1';
    const targetUrl = `/${cleanLevel}/${cleanSubject}/${slug}/introduction`;

    try {
      const res = await fetch(`/api/courses/resolve-first-lesson?courseSlug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(lang)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.lessonSlug) {
          router.push(`/${cleanLevel}/${cleanSubject}/${slug}/${data.lessonSlug}`);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not pre-resolve first lesson slug, falling back to static /introduction", e);
    }

    router.push(targetUrl);
  };

  const versionConflicts = React.useMemo(() => {
    return computeVersionConflicts(progress, courses, dismissedConflicts);
  }, [progress, courses, dismissedConflicts]);

  const recommendations = React.useMemo(() => {
    return computeRecommendations(progress, courses, dismissedRecIds);
  }, [progress, courses, dismissedRecIds]);

  const enrollInRecommended = async (course: any) => {
    const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('op_user_profile') : null;
    const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('op_session_token') : null;

    if (!savedProfile || !loggedIn) {
      setSelectedEnrollCourse(course);
      return;
    }

    const profile = JSON.parse(savedProfile);
    const userId = profile.id;

    await dbService.enrollCourse(userId, {
      id: course.id,
      title: course.title,
      slug: course.slug,
      subject: course.subject
    });

    const { data: progressData } = await dbService.getUserProgress(userId, lang);
    if (progressData) {
      setProgress(progressData);
    }
    const newEnrolled = progressData?.activeModules ? progressData.activeModules.map((m: any) => m.id) : [];
    setEnrolledIds(newEnrolled);
  };

  const getActiveTutorName = () => {
    const found = tutors.find(t => t.id === activeTutorId);
    return found ? found.name : 'Socratic Guide';
  };

  const handleSelectTutor = async (id: string) => {
    setActiveTutorId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('openprimer_active_tutor_id', id);
    }
    setShowTutorModal(false);
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [coursesRes, achRes, tutRes] = await Promise.all([
          dbService.getAllCourses(),
          dbService.getAchievements(),
          dbService.getTutorPersonalities()
        ]);
        if (coursesRes.data) setCourses(coursesRes.data);
        if (achRes.data) setAchievements(achRes.data);
        if (tutRes.data) setTutors(tutRes.data);

        const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('op_user_profile') : null;
        const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('op_session_token') : null;

        if (savedProfile && loggedIn) {
          const profile = JSON.parse(savedProfile);
          const userId = profile.id;
          const { data: progressData } = await dbService.getUserProgress(userId, lang);
          if (progressData) {
            setProgress(progressData);
          }
          const activeIds = progressData?.activeModules ? progressData.activeModules.map((m: any) => m.id) : [];
          setEnrolledIds(activeIds);
        } else {
          setProgress({
            studyStreakDays: 5,
            masteryPoints: 120,
            learningTime: "12h 45m",
            totalMinutes: 765,
            completedCount: 2,
            inProgressCount: 2,
            aiSummary: "Focalisé principalement sur la Mécanique Classique et les structures mathématiques fondamentales.",
            activeModules: [
              { id: 1, title: "Ondes et vibrations", slug: "ondes-et-vibrations", progress: 65, status: "in_progress", score: 85 },
              { id: 2, title: "Calcul Différentiel", slug: "calcul-differentiel", progress: 100, status: "completed", score: 92 },
              { id: 3, title: "Mécanique Quantique", slug: "mecanique-quantique", progress: 40, status: "in_progress", score: 78 },
              { id: 4, title: "Algèbre Linéaire", slug: "algebre-lineaire", progress: 100, status: "completed", score: 95 }
            ]
          });
          setEnrolledIds([1, 2, 3, 4]);
        }
      } catch (err) {
        console.error("Error loading curriculum profile data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [lang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEarned = localStorage.getItem('op_earned_achievements');
      if (savedEarned) {
        try {
          setEarnedIds(JSON.parse(savedEarned));
        } catch (e) {}
      }
    }
  }, []);

  const getCourseEarnedAchievements = (courseId: number, courseSlug: string) => {
    const activeAchievements = achievements.filter(ach => ach.status !== 'inactive');
    return activeAchievements.filter(ach => {
      const isEarned = earnedIds.includes(ach.id);
      if (!isEarned) return false;
      const th = (ach.threshold || '').toLowerCase();
      const slugMatch = courseSlug && th.includes(courseSlug.toLowerCase());
      const idMatch = th.includes(`course_${courseId}`) || th.includes(`course:${courseId}`);
      const generalAcademic = th.includes('100%') || th.includes('perfect') || th.includes('course');
      return slugMatch || idMatch || generalAcademic;
    });
  };

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => {
      const updated = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      if (typeof window !== 'undefined') {
        localStorage.setItem('op_bookmarked_courses', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleOptOut = async (id: number, keepChildCoursesOpt?: boolean) => {
    const shouldKeep = keepChildCoursesOpt !== undefined ? keepChildCoursesOpt : keepChildCourses;
    const targetCourse = courses.find((c: any) => c.id === id);
    const isCurriculum = targetCourse?.isCurriculum;

    if (isCurriculum) {
      const childIds = targetCourse.childCourses || [];
      if (shouldKeep) {
        setProgress((prev: any) => {
          if (!prev) return prev;
          const updated = prev.activeModules.filter((m: any) => m.id !== id);
          return { ...prev, activeModules: updated };
        });
      } else {
        setProgress((prev: any) => {
          if (!prev) return prev;
          const updated = prev.activeModules.filter((m: any) => m.id !== id && !childIds.includes(m.id));
          return { ...prev, activeModules: updated };
        });
      }
    } else {
      setProgress((prev: any) => {
        if (!prev) return prev;
        const updated = prev.activeModules.filter((m: any) => m.id !== id);
        return { ...prev, activeModules: updated };
      });
    }
    setAbandonTarget(null);
  };

  return {
    progress, setProgress,
    courses,
    achievements,
    earnedIds,
    enrolledIds,
    curriculumRevision,
    loading,
    readingMode, setReadingMode,
    bookmarks,
    selectedEnrollCourse, setSelectedEnrollCourse,
    dismissedRecIds,
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
    navigateToCourseDirect,
    enrollInRecommended,
    getActiveTutorName,
    handleSelectTutor,
    getCourseEarnedAchievements,
    toggleBookmark,
    handleOptOut,
    getLocalizedTitle: (c: any) => getLocalizedTitle(c, lang),
    getLocalizedCourseDescription: (c: any) => getLocalizedCourseDescription(c, lang)
  };
}
