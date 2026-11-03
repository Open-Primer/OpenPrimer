import { getAchievementTranslation } from './curriculumAuditHelpers';
import { formatCourseLevel } from '@/lib/translations';

const MD_STRINGS: Record<string, {
  title: string;
  welcome: string;
  aiSummary: string;
  stats: string;
  streak: (s: number) => string;
  pts: (p: number) => string;
  completed: (c: number) => string;
  prog: (p: number) => string;
  activeModules: string;
  activeItem: (t: string, s: string, l: string, p: number) => string;
  completedModules: string;
  completedItem: (t: string) => string;
  achievements: string;
}> = {
  FR: {
    title: "# Mon Cursus.\n\n",
    welcome: "Bienvenue dans votre espace d'apprentissage personnalisé OpenPrimer.\n\n",
    aiSummary: "## Résumé Pédagogique du Tuteur IA.\n\n",
    stats: "## Vos Statistiques d'Apprentissage.\n\n",
    streak: (s) => `Série d'étude actuelle : ${s} ${s === 1 ? 'jour' : 'jours'}.\n`,
    pts: (p) => `Points de maîtrise accumulés : ${p} points.\n`,
    completed: (c) => `Nombre de modules complétés : ${c}.\n`,
    prog: (p) => `Progression globale du cursus : ${p}%.\n\n`,
    activeModules: "## Vos Modules en Cours.\n\n",
    activeItem: (t, s, l, p) => `Module : ${t}. Catégorie : ${s}. Niveau : ${l}. Votre progression actuelle est de ${p}%.\n\n`,
    completedModules: "## Vos Modules Terminés.\n\n",
    completedItem: (t) => `Félicitations, vous avez entièrement complété le module : ${t}.\n\n`,
    achievements: "## Vos Trophées et Succès.\n\n"
  },
  EN: {
    title: "# My Curriculum.\n\n",
    welcome: "Welcome to your OpenPrimer personalized learning space.\n\n",
    aiSummary: "## AI Tutor Pedagogical Summary.\n\n",
    stats: "## Your Learning Statistics.\n\n",
    streak: (s) => `Current study streak: ${s} ${s === 1 ? 'day' : 'days'}.\n`,
    pts: (p) => `Accumulated mastery points: ${p} points.\n`,
    completed: (c) => `Completed modules: ${c}.\n`,
    prog: (p) => `Overall curriculum progress: ${p}%.\n\n`,
    activeModules: "## Your Active Modules.\n\n",
    activeItem: (t, s, l, p) => `Module: ${t}. Subject: ${s}. Level: ${l}. Your current progress is ${p}%.\n\n`,
    completedModules: "## Your Completed Modules.\n\n",
    completedItem: (t) => `Congratulations, you have fully completed the module: ${t}.\n\n`,
    achievements: "## Your Achievements and Badges.\n\n"
  },
  ES: {
    title: "# Mi Currículo.\n\n",
    welcome: "Bienvenido a su espacio de aprendizaje personalizado OpenPrimer.\n\n",
    aiSummary: "## Resumen Pedagógico del Tutor IA.\n\n",
    stats: "## Sus Estadísticas de Aprendizaje.\n\n",
    streak: (s) => `Racha de estudio actual: ${s} ${s === 1 ? 'día' : 'días'}.\n`,
    pts: (p) => `Puntos de maestría acumulados: ${p} puntos.\n`,
    completed: (c) => `Módulos completados: ${c}.\n`,
    prog: (p) => `Progression global del currículo: ${p}%.\n\n`,
    activeModules: "## Sus Módulos Activos.\n\n",
    activeItem: (t, s, l, p) => `Módulo: ${t}. Asignatura: ${s}. Nivel: ${l}. Su progreso actual es de ${p}%.\n\n`,
    completedModules: "## Sus Módulos Completados.\n\n",
    completedItem: (t) => `Felicitaciones, ha completado completamente el módulo: ${t}.\n\n`,
    achievements: "## Sus Logros y Medallas.\n\n"
  }
};

export function getCurriculumMarkdown(
  progress: any,
  t: any,
  courses: any[],
  achievements: any[],
  lang: string
): string {
  if (!progress) return "";
  const langKey = (lang || 'en').toUpperCase();
  const dict = MD_STRINGS[langKey] || MD_STRINGS.EN;

  let text = "";
  text += dict.title;
  text += dict.welcome;

  if (progress.aiSummary) {
    text += dict.aiSummary;
    text += `"${progress.aiSummary}"\n\n`;
  }

  text += dict.stats;
  const streak = progress.studyStreakDays ?? 0;
  const pts = progress.masteryPoints ?? 0;
  const completedCount = progress.completedCount ?? 0;
  const overallProgressVal = progress.overallProgress ?? 0;

  text += dict.streak(streak);
  text += dict.pts(pts);
  text += dict.completed(completedCount);
  text += dict.prog(overallProgressVal);

  const getLocalizedTitle = (c: any) => {
    return c[`title${langKey}`] || c.titleEN || c.title || '';
  };
  const getLocalizedSubject = (s: string) => {
    return t(`subject_${s.toLowerCase()}`) || s;
  };

  const active = progress.activeModules?.filter((m: any) => m.progress < 100) || [];
  if (active.length > 0) {
    text += dict.activeModules;
    active.forEach((m: any) => {
      const cd = courses.find((x: any) => x.id === m.id);
      const title = cd ? getLocalizedTitle(cd) : m.title;
      const sub = cd ? getLocalizedSubject(cd.subject) : '';
      const levelText = cd ? formatCourseLevel(cd.level, lang) : '';
      text += dict.activeItem(title, sub, levelText, m.progress);
    });
  }

  const completed = progress.activeModules?.filter((m: any) => m.progress === 100) || [];
  if (completed.length > 0) {
    text += dict.completedModules;
    completed.forEach((m: any) => {
      const cd = courses.find((x: any) => x.id === m.id);
      const title = cd ? getLocalizedTitle(cd) : m.title;
      text += dict.completedItem(title);
    });
  }

  const earnedIds = progress.achievements || [];
  const earnedAchs = achievements.filter(ach => earnedIds.includes(ach.id));
  if (earnedAchs.length > 0) {
    text += dict.achievements;
    earnedAchs.forEach((ach: any) => {
      const name = getAchievementTranslation(ach, 'name', lang);
      const desc = getAchievementTranslation(ach, 'description', lang);
      text += `${name} : ${desc}.\n\n`;
    });
  }

  return text;
}
