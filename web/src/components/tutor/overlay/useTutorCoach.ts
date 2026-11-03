import { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';

interface UseTutorCoachProps {
  isCurriculumPage: boolean;
  isDashboardMode: boolean;
  segments: string[];
  lang: string;
  pathname: string | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function useTutorCoach({
  isCurriculumPage,
  isDashboardMode,
  segments,
  lang,
  pathname,
  isOpen,
  setIsOpen
}: UseTutorCoachProps) {
  const [selfEvalPre, setSelfEvalPre] = useState<number | null>(null);
  const [selfEvalPost, setSelfEvalPost] = useState<number | null>(null);
  const [coachAdvice, setCoachAdvice] = useState<string>('');
  const [showCoachPopover, setShowCoachPopover] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchAdvice() {
      if (!isCurriculumPage || isDashboardMode) return;
      const savedProfile = localStorage.getItem('op_user_profile');
      const loggedIn = localStorage.getItem('op_session') === 'true';
      let userId = 'u1';
      if (loggedIn && savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          if (p.id) userId = p.id;
        } catch (e) {}
      }

      try {
        const currentCourseSlug = segments[2];
        const { data: progressData } = await dbService.getUserProgress(userId, lang, currentCourseSlug);
        if (progressData && progressData.aiSummary && active) {
          const rawAdvice = progressData.aiSummary.trim();
          const isSubstantive = rawAdvice.length >= 30;
          const isGenericPlaceholder = /^(bienvenue|welcome|bonjour|hello|salut|démarrez|start|ready)/i.test(rawAdvice);

          if (isSubstantive && !isGenericPlaceholder) {
            setCoachAdvice(rawAdvice);
            const dismissed = sessionStorage.getItem('op_dismiss_resumption_coach_advice');
            if (!dismissed) {
              const timer = setTimeout(() => {
                setShowCoachPopover(true);
              }, 1500);
              return () => clearTimeout(timer);
            }
          }
        }
      } catch (e) {
        console.error("Error fetching coach advice in overlay:", e);
      }
    }
    fetchAdvice();
    return () => {
      active = false;
    };
  }, [lang, isCurriculumPage, pathname]);

  const handleDismissCoachPopover = () => {
    setShowCoachPopover(false);
    sessionStorage.setItem('op_dismiss_resumption_coach_advice', 'true');
  };

  const handleOpenChatFromCoach = () => {
    setShowCoachPopover(false);
    sessionStorage.setItem('op_dismiss_resumption_coach_advice', 'true');
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen && pathname) {
      const getSelfEvalScores = () => {
        if (typeof window === 'undefined') return { pre: null, post: null };
        const storages = [localStorage, sessionStorage];
        let preScore: number | null = null;
        let postScore: number | null = null;

        for (const storage of storages) {
          try {
            for (let i = 0; i < storage.length; i++) {
              const key = storage.key(i);
              if (key && key.startsWith('op_selfeval_')) {
                const val = Number(storage.getItem(key));
                if (!isNaN(val)) {
                  if (key.includes('pre') && preScore === null) preScore = val;
                  if (key.includes('post') && postScore === null) postScore = val;
                }
              }
            }
          } catch (e) {}
        }
        return { pre: preScore, post: postScore };
      };

      const { pre, post } = getSelfEvalScores();
      setSelfEvalPre(pre);
      setSelfEvalPost(post);
    }
  }, [isOpen, pathname]);

  return {
    selfEvalPre,
    selfEvalPost,
    coachAdvice,
    showCoachPopover,
    setShowCoachPopover,
    handleDismissCoachPopover,
    handleOpenChatFromCoach
  };
}
