import { getAchievementTranslation } from './curriculumAuditHelpers';

export function getCurriculumMarkdown(
  progress: any,
  t: any,
  courses: any[],
  achievements: any[],
  lang: string
): string {
  const getCurriculumMarkdown = () => {
    if (!progress) return "";
    const isFr = lang.toUpperCase() === 'FR';
    
    let text = "";
    
    // Page Title & Overview
    if (isFr) {
      text += `# Mon Cursus.\n\n`;
      text += `Bienvenue dans votre espace d'apprentissage personnalisé OpenPrimer.\n\n`;
    } else {
      text += `# My Curriculum.\n\n`;
      text += `Welcome to your OpenPrimer personalized learning space.\n\n`;
    }
    
    // AI Summary
    if (progress.aiSummary) {
      text += isFr ? `## Résumé Pédagogique du Tuteur IA.\n\n` : `## AI Tutor Pedagogical Summary.\n\n`;
      text += `"${progress.aiSummary}"\n\n`;
    }
    
    // Stats
    text += isFr ? `## Vos Statistiques d'Apprentissage.\n\n` : `## Your Learning Statistics.\n\n`;
    
    const streak = progress.studyStreakDays ?? 0;
    const pts = progress.masteryPoints ?? 0;
    const completedCount = progress.completedCount ?? 0;
    const overallProgressVal = progress.overallProgress ?? 0;
    
    if (isFr) {
      text += `Série d'étude actuelle : ${streak} ${streak === 1 ? 'jour' : 'jours'}.\n`;
      text += `Points de maîtrise accumulés : ${pts} points.\n`;
      text += `Nombre de modules complétés : ${completedCount}.\n`;
      text += `Progression globale du cursus : ${overallProgressVal}%.\n\n`;
    } else {
      text += `Current study streak: ${streak} ${streak === 1 ? 'day' : 'days'}.\n`;
      text += `Accumulated mastery points: ${pts} points.\n`;
      text += `Completed modules: ${completedCount}.\n`;
      text += `Overall curriculum progress: ${overallProgressVal}%.\n\n`;
    }
    
    // Active Modules
    const active = progress.activeModules?.filter((m: any) => m.progress < 100) || [];
    if (active.length > 0) {
      text += isFr ? `## Vos Modules en Cours.\n\n` : `## Your Active Modules.\n\n`;
      active.forEach((m: any) => {
        const cd = courses.find((x: any) => x.id === m.id);
        const title = cd ? getLocalizedTitle(cd) : m.title;
        const sub = cd ? getLocalizedSubject(cd.subject) : '';
        const levelText = cd ? formatCourseLevel(cd.level, lang) : '';
        
        if (isFr) {
          text += `Module : ${title}. Catégorie : ${sub}. Niveau : ${levelText}. Votre progression actuelle est de ${m.progress}%.\n\n`;
        } else {
          text += `Module: ${title}. Subject: ${sub}. Level: ${levelText}. Your current progress is ${m.progress}%.\n\n`;
        }
      });
    }
    
    // Completed Modules
    const completed = progress.activeModules?.filter((m: any) => m.progress === 100) || [];
    if (completed.length > 0) {
      text += isFr ? `## Vos Modules Terminés.\n\n` : `## Your Completed Modules.\n\n`;
      completed.forEach((m: any) => {
        const cd = courses.find((x: any) => x.id === m.id);
        const title = cd ? getLocalizedTitle(cd) : m.title;
        
        if (isFr) {
          text += `Félicitations, vous avez entièrement complété le module : ${title}.\n\n`;
        } else {
          text += `Congratulations, you have fully completed the module: ${title}.\n\n`;
        }
      });
    }
    
    // Achievements
    const earnedAchs = achievements.filter(ach => earnedIds.includes(ach.id));
    if (earnedAchs.length > 0) {
      text += isFr ? `## Vos Trophées et Succès.\n\n` : `## Your Achievements and Badges.\n\n`;
      earnedAchs.forEach((ach: any) => {
        const name = getAchievementTranslation(ach, 'name', lang);
        const desc = getAchievementTranslation(ach, 'description', lang);
        text += `${name} : ${desc}.\n\n`;
      });
    }
    
    return text;
  };


  return content;
}
