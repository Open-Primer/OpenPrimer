"use client";

import React, { useEffect } from 'react';
import { progressService } from '@/lib/db';

export interface UseLessonProgressProps {
  pathname: string;
  isEnrolled: boolean;
  mainRef: React.RefObject<HTMLDivElement | null>;
  getProgressionStorage: () => Storage | null;
}

export const useLessonProgress = ({
  pathname,
  isEnrolled,
  mainRef,
  getProgressionStorage,
}: UseLessonProgressProps) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const segments = pathname.split('/').filter(Boolean);
    const slug = segments.length >= 4 && 
      !['profile', 'admin', 'api', 'catalog', 'login', 'signup'].includes(segments[0]) ? segments[2] : 'Classical_Mechanics';
    const loggedIn = localStorage.getItem('op_session') === 'true';
    
    // Start tracking this page visit
    if (!loggedIn || isEnrolled) {
      progressService.recordLessonEntry(slug, pathname);
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        if (!loggedIn || isEnrolled) {
          progressService.commitLessonTime(slug, pathname);
        }
      } else {
        if (!loggedIn || isEnrolled) {
          progressService.recordLessonEntry(slug, pathname);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    // Scroll progress persistent hook
    const el = mainRef.current;
    const storage = getProgressionStorage();
    const savedScrollKey = `op_scroll_pos_${slug}`;

    const syncCurriculumProgress = (updatedProgressMap: any) => {
      if (!storage) return;
      try {
        const coursesList = JSON.parse(storage.getItem('openprimer_courses') || '[]');
        if (coursesList.length > 0) {
          const currentCourse = coursesList.find((c: any) => c.slug === slug);
          if (currentCourse) {
            const currentCourseId = currentCourse.id;
            const containingCurricula = coursesList.filter((c: any) => c.isCurriculum && c.childCourses?.includes(currentCourseId));
            
            containingCurricula.forEach((curr: any) => {
              let totalChildProgress = 0;
              let childCount = 0;
              
              curr.childCourses.forEach((childId: number) => {
                const child = coursesList.find((c: any) => c.id === childId);
                if (child) {
                  const childProgressVal = updatedProgressMap[child.slug] ?? updatedProgressMap[child.id] ?? 0;
                  totalChildProgress += childProgressVal;
                  childCount++;
                }
              });

              if (childCount > 0) {
                const avgProgress = Math.round(totalChildProgress / childCount);
                updatedProgressMap[curr.slug] = avgProgress;
                updatedProgressMap[curr.id] = avgProgress;
                progressService.syncProgressToCloud(curr.slug, avgProgress);
              }
            });
          }
        }
      } catch (e) {
        console.error("Error updating curriculum parent progress:", e);
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (!el || !storage) return;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight - el.clientHeight;
        if (scrollHeight > 0) {
          const percentage = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));
          if (percentage > 85) {
            const visitedPages = JSON.parse(storage.getItem('op_visited_pages') || '[]');
            if (!visitedPages.includes(pathname)) {
              visitedPages.push(pathname);
              storage.setItem('op_visited_pages', JSON.stringify(visitedPages));
              
              // Recalculate progress for course
              const courseProgressMap = JSON.parse(storage.getItem('op_course_progress') || '{}');
              const courseVisited = visitedPages.filter((p: string) => p.includes(`/${slug}/`)).length;
              
              // Approximate typical course length as 10 lessons for calculation if metadata unavailable
              const courseProgress = Math.min(100, Math.round((courseVisited / 10) * 100));
              courseProgressMap[slug] = Math.max(courseProgressMap[slug] || 0, courseProgress);
              storage.setItem('op_course_progress', JSON.stringify(courseProgressMap));

              syncCurriculumProgress(courseProgressMap);
              progressService.syncProgressToCloud(slug, courseProgressMap[slug]);

              window.dispatchEvent(new Event('op_progress_updated'));
            }
          }
        }
      }, 150);
    };

    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (el) {
        el.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(scrollTimeout);
      if (!loggedIn || isEnrolled) {
        progressService.commitLessonTime(slug, pathname);
      }
    };
  }, [pathname, isEnrolled, mainRef, getProgressionStorage]);
};
