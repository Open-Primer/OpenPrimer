import React from 'react';
import { getBaseSlug } from './courseNavigationHelpers';

export function computeVersionConflicts(
  progress: any,
  courses: any[],
  dismissedConflicts: number[]
) {
  if (!progress?.activeModules || courses.length === 0) return [];

  const enrolledCurricula = progress.activeModules.filter((m: any) => {
    const cd = courses.find((x: any) => x.id === m.id);
    return cd?.isCurriculum || m.isCurriculum;
  });

  const enrolledCurriculaDetails = enrolledCurricula.map((curr: any) => courses.find((c: any) => c.id === curr.id) || curr);
  const standaloneEnrolled = progress.activeModules.filter((m: any) => {
    const cd = courses.find((x: any) => x.id === m.id);
    return !cd?.isCurriculum && !m.isCurriculum;
  });

  const conflicts: any[] = [];

  standaloneEnrolled.forEach((standalone: any) => {
    if (dismissedConflicts.includes(standalone.id)) return;
    const standaloneDetails = courses.find((cd: any) => cd.id === standalone.id);
    if (!standaloneDetails) return;

    const baseSlug = getBaseSlug(standaloneDetails.slug);

    enrolledCurriculaDetails.forEach((curr: any) => {
      const childIds = curr.childCourses || [];
      childIds.forEach((childId: number) => {
        const childDetails = courses.find((cd: any) => cd.id === childId);
        if (!childDetails) return;
        const childBaseSlug = getBaseSlug(childDetails.slug);

        if (baseSlug === childBaseSlug) {
          conflicts.push({
            id: standalone.id,
            standalone: standaloneDetails,
            curriculum: curr,
            curriculumChild: childDetails,
            isExactMatch: standaloneDetails.id === childDetails.id,
            type: standaloneDetails.id === childDetails.id ? 'duplicate_exact' : 'version_divergence'
          });
        }
      });
    });
  });

  return conflicts;
}

export function computeRecommendations(
  progress: any,
  courses: any[],
  dismissedRecIds: number[]
) {
  if (!progress?.activeModules || courses.length === 0) {
    return [];
  }
  const activeModSlugs = progress.activeModules.map((m: any) => m.slug) || [];
  const completedSlugs = progress.activeModules.filter((m: any) => m.progress === 100).map((m: any) => m.slug) || [];

  const candidates = courses.filter((c: any) => {
    return !activeModSlugs.includes(c.slug);
  });

  const matched = candidates.filter((c: any) => {
    if (c.slug === 'biophysique_moleculaire' || c.id === 8) {
      const hasCompletedPhysics = completedSlugs.some((slug: string) =>
        slug === 'ondes-mecaniques-et-son' || slug === 'mecanique-du-point' || slug === 'physique'
      );
      const hasCompletedBiology = completedSlugs.some((slug: string) =>
        slug === 'biologie-cellulaire' || slug === 'biochimie-structurale' || slug === 'biologie'
      );
      return hasCompletedPhysics || hasCompletedBiology;
    }
    if (c.slug === 'mecanique-quantique-avancee' || c.id === 9) {
      return completedSlugs.some((slug: string) =>
        slug === 'ondes-mecaniques-et-son' || slug === 'physique'
      );
    }
    return false;
  });

  if (matched.length === 0) {
    return [];
  }

  const baseRecommendations = matched.slice(0, 2);
  return baseRecommendations.filter(c => !dismissedRecIds.includes(c.id));
}
