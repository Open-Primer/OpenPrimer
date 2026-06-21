// Mocking and wrapper for Supabase/DB interface for the industrial prototype
import { supabase } from './supabase';
import * as seeds from './db/seeds';
import {
  UserProfile,
  MockCourse,
  SyllabusNode,
  ReportCluster,
  UV,
  SearchHistoryEntry,
  TranslationRequestEntry,
  RefusedCourseEntry,
  ContactFeedback,
  CourseCompletionEntry,
  TranslationEmailNotification,
  LanguageInfo,
  RefusedTranslationEntry,
  RefusedRevisionEntry,
  CourseFeedback,
  TutorPersonality,
  AgentMetric,
  Achievement,
  StyledBadgeImage,
  DatabaseProvider,
  SystemParameter,
  DatabaseService
} from './db/types';

export type {
  UserProfile,
  MockCourse,
  SyllabusNode,
  ReportCluster,
  UV,
  SearchHistoryEntry,
  TranslationRequestEntry,
  RefusedCourseEntry,
  ContactFeedback,
  CourseCompletionEntry,
  TranslationEmailNotification,
  LanguageInfo,
  RefusedTranslationEntry,
  RefusedRevisionEntry,
  CourseFeedback,
  TutorPersonality,
  AgentMetric,
  Achievement,
  StyledBadgeImage,
  DatabaseProvider,
  SystemParameter,
  DatabaseService
};

export type UserRole = 'admin' | 'student';


export const getCanonicalCourseId = (slugOrId: string | number): number => {
  if (typeof slugOrId === 'number') return slugOrId;
  const s = String(slugOrId).toLowerCase().replace(/_/g, '-');
  if (s === 'classical-mechanics' || s === '1') return 1;
  if (s === 'quantum-physics' || s === 'physique-test-l2' || s === '2') return 2;
  if (s === 'cell-biology' || s === 'biologie-test' || s === '3') return 3;
  if (s === 'molecular-genetics' || s === 'biologie-test-l1' || s === '4') return 4;
  if (s === 'constitutional-law' || s === 'droit-test' || s === '5') return 5;
  if (s === 'criminal-law' || s === 'droit-test-l2' || s === '6') return 6;
  if (s === 'linear-algebra' || s === 'maths-test' || s === '7') return 7;
  if (s === 'calculus-i' || s === 'maths-test-l1' || s === '8') return 8;
  if (s === 'organic-chemistry' || s === 'chimie-test' || s === '9') return 9;
  if (s === 'microeconomics' || s === 'economie-test' || s === '10') return 10;
  if (s === 'statistics' || s === 'statistics-l1' || s === '11') return 11;
  if (s === 'sovereign-ai-curriculum' || s === '12') return 12;
  if (s === 'biologie-cellulaire-l1' || s === 'biologie_cellulaire_l1' || s === '13') return 13;
  if (s === 'genetique-moleculaire-l1' || s === 'genetique_moleculaire_l1' || s === '14') return 14;
  if (s === 'biochimie-structurale-l1' || s === 'biochimie_structurale_l1' || s === '15') return 15;
  if (s === 'microbiologie-l1' || s === 'microbiologie_l1' || s === '16') return 16;
  if (s === 'ecologie-generale-l1' || s === 'ecologie_generale_l1' || s === '17') return 17;
  if (s === 'bio-l1-fondamentaux' || s === 'bio_l1_fondamentaux' || s === '18') return 18;
  if (s === 'sciences-l1-tronc-commun' || s === 'sciences_l1_tronc_commun' || s === '19') return 19;
  
  const parsed = parseInt(String(slugOrId));
  if (!isNaN(parsed)) return parsed;
  return 0;
};


import {
  isDatabaseConfigured,
  isProduction,
  isSandboxFallbackAllowed,
  isSandboxModeActive,
  isOffline,
  getLocalStorageItem,
  setLocalStorageItem,
  BADGE_LIBRARY,
  getMockCourses,
  setMockCourses,
  getUsers,
  setUsersList,
  getAchievementsList,
  setAchievementsList,
  getTutorPersonalitiesList,
  setTutorPersonalitiesList,
  getTranslationRequestsList,
  setTranslationRequestsList,
  getRefusedCoursesList,
  setRefusedCoursesList,
  getRefusedTranslationsList,
  setRefusedTranslationsList,
  getRefusedRevisionsList,
  setRefusedRevisionsList,
  getAgentMetricsList,
  setAgentMetricsList,
  getCourseFeedbacks,
  setCourseFeedbacks,
  getCourseCompletionsList,
  setCourseCompletionsList,
  getContactFeedbacksList,
  setContactFeedbacksList,
  getSearchHistoryList,
  setSearchHistoryList,
  getReportClusters,
  setReportClusters,
  getAvailableLanguagesList,
  setAvailableLanguagesList,
  getTranslationEmailsList,
  setTranslationEmailsList,
  getSystemParametersList,
  setSystemParametersList,
  users,
  mockCourses,
  syllabi,
  reportClusters,
  uvs,
  achievementsList,
  searchHistoryList,
  translationRequestsList,
  refusedCoursesList,
  refusedTranslationsList,
  refusedRevisionsList,
  courseFeedbacks,
  courseCompletionsList,
  contactFeedbacksList,
  tutorPersonalitiesList,
  agentMetricsList,
  availableLanguagesList,
  translationEmailsList,
  systemParametersList,
  isBrowser,
  dynamicOffline,
  setDynamicOffline,
  purgePipelineAndRequestsForCourseOrCurriculum,
  addCourseTombstone,
  removeCourseTombstone
} from './db/state-store';

export {
  isDatabaseConfigured,
  isProduction,
  isSandboxFallbackAllowed,
  isSandboxModeActive,
  isOffline,
  getLocalStorageItem,
  setLocalStorageItem,
  BADGE_LIBRARY,
  getMockCourses,
  setMockCourses,
  getUsers,
  setUsersList,
  getAchievementsList,
  setAchievementsList,
  getTutorPersonalitiesList,
  setTutorPersonalitiesList,
  getTranslationRequestsList,
  setTranslationRequestsList,
  getRefusedCoursesList,
  setRefusedCoursesList,
  getRefusedTranslationsList,
  setRefusedTranslationsList,
  getRefusedRevisionsList,
  setRefusedRevisionsList,
  getAgentMetricsList,
  setAgentMetricsList,
  getCourseFeedbacks,
  setCourseFeedbacks,
  getCourseCompletionsList,
  setCourseCompletionsList,
  getContactFeedbacksList,
  setContactFeedbacksList,
  getSearchHistoryList,
  setSearchHistoryList,
  getReportClusters,
  setReportClusters,
  getAvailableLanguagesList,
  setAvailableLanguagesList,
  getTranslationEmailsList,
  setTranslationEmailsList,
  getSystemParametersList,
  setSystemParametersList,
  dynamicOffline,
  setDynamicOffline,
  purgePipelineAndRequestsForCourseOrCurriculum,
  addCourseTombstone,
  removeCourseTombstone
};

export const isConnectionFailure = (error: any): boolean => {
  if (!error) return false;

  // If the error has a standard PostgREST / Postgres error code, it means we successfully contacted the database server
  // and received a structured SQL / PostgREST error.
  if (error.code) {
    const codeStr = String(error.code);
    if (codeStr.startsWith('PGRST') || /^[0-9A-Z]{5}$/.test(codeStr)) {
      return false;
    }
  }

  const errMsg = (error?.message || String(error)).toLowerCase();

  const isNetwork = 
    (typeof navigator !== 'undefined' && !navigator.onLine) ||
    errMsg.includes("fetch") || 
    errMsg.includes("network") || 
    errMsg.includes("timeout") || 
    errMsg.includes("offline") ||
    errMsg.includes("failed to fetch") ||
    errMsg.includes("load failed") ||
    errMsg.includes("connection refused") ||
    errMsg.includes("dns") ||
    error?.status === 0 ||
    error?.status === 502 ||
    error?.status === 503 ||
    error?.status === 504;

  return !!isNetwork;
};

export const handleDatabaseError = (error: any) => {
  if (error?.code === 'PGRST116') {
    return;
  }

  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalhost && isSandboxFallbackAllowed() && isConnectionFailure(error)) {
    console.warn("⚠️ [DATABASE FALLBACK] Supabase connection failed. Falling back to LocalStorage mock provider on localhost:", error);
    setDynamicOffline(true);
    return;
  }

  // Only log in the console when a real DB connection is expected (production/configured env)
  if (isDatabaseConfigured && !error?.code?.startsWith('PGRST') && error?.code !== 'PGRST116') {
    console.error("❌ [DATABASE CONNECTION FAILURE] Supabase query failed:", error);
  }
  if (typeof window !== 'undefined') {
    if (isConnectionFailure(error)) {
      window.dispatchEvent(new CustomEvent('op_database_connection_failure', {
        detail: { message: error?.message || String(error) }
      }));
    }
  }
};

export const authService = {
  getUser: () => users[0], 
  login: (email: string) => console.log(`Logging in ${email}...`),
  logout: () => console.log("Logging out..."),
  isAdmin: () => users[0].role === 'admin'
};

export function getLocalizedCourseTitleInternal(course: any, lang: string) {
  if (!course) return '';
  const code = (lang || 'EN').toUpperCase();
  if (course.translations && course.translations[code]) {
    const t = course.translations[code];
    return t.title || t.name || course.title || course.name || '';
  }
  if (course.translations && course.translations['EN']) {
    const t = course.translations['EN'];
    return t.title || t.name || course.title || course.name || '';
  }
  return course.title || course.name || '';
}

export function generatePedagogicalSummary(
  activeModules: any[], 
  masteryPoints: number, 
  studyStreakDays: number, 
  totalMinutes: number, 
  activeLang: string, 
  tutorId: string,
  quizResults?: any,
  currentCourseSlug?: string
): string {
  const isFr = activeLang === 'FR';
  const isEs = activeLang === 'ES';
  const isDe = activeLang === 'DE';
  const isZh = activeLang === 'ZH';

  // Condition 1: Empty Curriculum
  if (!activeModules || activeModules.length === 0) {
    if (tutorId === 'direct') {
      if (isFr) return `🎯 Votre cursus est actuellement vide. Pour démarrer, veuillez vous inscrire à un cours depuis le catalogue afin d'initier votre parcours d'apprentissage.`;
      if (isEs) return `🎯 Tu plan de estudios está vacío. Para comenzar, inscríbete en un curso desde el catálogo para iniciar tu aprendizaje.`;
      if (isDe) return `🎯 Ihr Lehrplan ist derzeit leer. Bitte melden Sie sich im Katalog für einen Kurs an, um Ihren Lernpfad zu beginnen.`;
      if (isZh) return `🎯 您的课程表目前为空。请在目录中选择并注册一门课程以开启学习之旅。`;
      return `🎯 Your curriculum is currently empty. Please enroll in a course from the catalog to start your learning path.`;
    }
    if (tutorId === 'gamified') {
      if (isFr) return `🚀 Bienvenue dans l'aventure OpenPrimer ! 🎮 Prêt à relever des défis et accumuler des points ? Allez vite sur le catalogue pour débloquer votre tout premier cours ! ⭐`;
      if (isEs) return `🚀 ¡Bienvenido a la aventura de OpenPrimer! 🎮 ¿Listo para asumir desafíos y acumular puntos? ¡Ve al catálogo para desbloquear tu primer curso! ⭐`;
      if (isDe) return `🚀 Willkommen beim OpenPrimer-Abenteuer! 🎮 Bereit, Herausforderungen anzunehmen und Punkte zu sammeln? Geh zum Katalog, um deinen ersten cours freizuschalten! ⭐`;
      if (isZh) return `🚀 欢迎来到 OpenPrimer 的探索冒险！🎮 准备好接受挑战并累积点数了吗？快去课程目录解锁你的第一门课程吧！⭐`;
      return `🚀 Welcome to the OpenPrimer adventure! 🎮 Ready to take on challenges and rack up points? Head over to the catalog to unlock your very first course! ⭐`;
    }
    if (tutorId === 'historical') {
      if (isFr) return `🏛️ Salutations, cher chercheur. Bienvenue dans ce temple du savoir. Votre table d'étude est encore vide. Je vous invite à explorer les chroniques de notre catalogue pour y inscrire votre premier sujet d'étude.`;
      if (isEs) return `🏛️ Saludos, estimado erudito. Bienvenido a este templo del saber. Tu mesa de estudio aún está vacía. Te invito a explorar las crónicas de nuestro catálogo para registrar tu primer tema de estudio.`;
      if (isDe) return `🏛️ Grüße, werter Gelehrter. Willkommen in diesem Tempel des Wissens. Ihr Studiertisch ist noch leer. Ich lade Sie ein, die Chroniken unseres Katalogs zu erkunden, um Ihr erstes Studienfach einzutragen.`;
      if (isZh) return `🏛️ 您好，学者。欢迎来到知识殿堂。您的书桌 intellectuelle 目前还是空的。请在课程目录中选择并注册您的第一个研究主题。`;
      return `🏛️ Greetings, fellow scholar. Welcome to this sanctuary of knowledge. Your study table is currently empty. I invite you to explore our catalog to select your first subject of study.`;
    }
    if (tutorId === 'feynman') {
      if (isFr) return `💡 Salut ! Bienvenue sur OpenPrimer ! Pour l'instant, vous n'avez aucun cours actif. Faisons simple : allez faire un tour sur le catalogue, choisissez un sujet qui vous passionne et on commencera à le déconstruire ensemble !`;
      if (isEs) return `💡 ¡Hola! ¡Bienvenido a OpenPrimer! Por ahora, no tienes ningún cours actif. Hagámoslo simple: date una vuelta por el catálogo, elige un tema que te apasione y ¡empezaremos a desglosarlo juntos!`;
      if (isDe) return `💡 Hallo! Willkommen bei OpenPrimer! Momentan haben Sie keine aktiven Kurse. Machen wir es einfach: Schauen Sie sich im Katalog um, wählen Sie ein Thema, das Sie fasziniert, und wir zerlegen es gemeinsam!`;
      if (isZh) return `💡 嗨！欢迎来到 OpenPrimer！目前你还没有任何活跃的课程。简单来说：去目录选一个你感兴趣的主题，我们一起开始把它拆解透彻！`;
      return `💡 Hey! Welcome to OpenPrimer! Right now, you don't have any active courses. Let's keep it simple: take a look at the catalog, choose a topic you are curious about, and we'll start breaking it down together!`;
    }
    if (tutorId === 'proof') {
      if (isFr) return `📐 Tuteur logique activé. Bienvenue sur OpenPrimer. État initial : aucun cours inscrit (ensemble vide). Pour initier le processus d'apprentissage, veuillez sélectionner un cours dans le catalogue.`;
      if (isEs) return `📐 Tutor lógico activado. Bienvenido a OpenPrimer. Estado inicial: ningún curso inscrito (conjunto vacío). Para iniciar el proceso de aprendizaje, selecciona un curso del catálogo.`;
      if (isDe) return `📐 Logik-Tutor aktiviert. Willkommen bei OpenPrimer. Anfangszustand: kein Kurs eingetragen (leere Menge). Um den Lernprozess zu initiieren, wählen Sie einen Kurs aus dem Katalog.`;
      if (isZh) return `📐 逻辑导师已启用。欢迎来到 OpenPrimer。初始状态：未注册任何课程（空集）。请从课程目录中选择一门课程开始。`;
      return `📐 Logic tutor activated. Welcome to OpenPrimer. Initial state: zero enrolled courses (empty set). To initiate the learning process, please select a course from the catalog.`;
    }
    // Default / Socratic
    if (isFr) return `💬 Bienvenue sur OpenPrimer. Je suis votre guide pédagogique. Pour l'instant, aucun cours ne figure dans votre cursus. Quel domaine de la connaissance éveille votre curiosité aujourd'hui ? Parcourez le catalogue pour commencer.`;
    if (isEs) return `💬 Bienvenido a OpenPrimer. Soy tu guía pedagógico. Por ahora, no hay ningún curso en tu plan de estudios. ¿Qué área del conocimiento despierta tu curiosidad hoy? Explora el catálogo para comenzar.`;
    if (isDe) return `💬 Willkommen bei OpenPrimer. Ich bin Ihr pédagogischer Wegbegleiter. Derzeit befindet sich kein Kurs in Ihrem Lehrplan. Welches Wissensgebiet weckt heute Ihre Neugier? Durchsuchen Sie den Katalog, um zu beginnen.`;
    if (isZh) return `💬 欢迎来到 OpenPrimer。我是你的学习向导。目前你的课表里还没有任何课程。今天有什么知识领域能唤醒你的好奇心呢？浏览课程目录以开始。`;
    return `💬 Welcome to OpenPrimer. I am your pedagogical guide. Currently, there are no courses in your curriculum. What domain of knowledge awakens your curiosity today? Browse the catalog to begin.`;
  }

  // Find focus module: most active/highest progress course that is not 100% yet
  let focusModule = activeModules.find((m: any) => !m.isCurriculum && m.progress > 0 && m.progress < 100);
  if (!focusModule) {
    focusModule = activeModules.find((m: any) => !m.isCurriculum && m.progress > 0);
  }
  if (!focusModule) {
    focusModule = activeModules.find((m: any) => !m.isCurriculum);
  }

  const moduleName = focusModule 
    ? getLocalizedCourseTitleInternal(focusModule, activeLang)
    : (isFr ? "Physique" 
       : isEs ? "Física" 
       : isDe ? "Physik" 
       : isZh ? "物理" 
       : "Physics");
  
  const progVal = focusModule ? focusModule.progress : 0;
  const streakVal = studyStreakDays || 0;

  // Let's analyze quizResults for difficulties
  let hasDifficulties = false;
  let lowestScoreQuiz: any = null;
  let lowestRatio = 1.0;

  if (quizResults) {
    if (currentCourseSlug) {
      for (const key in quizResults) {
        const q = quizResults[key];
        if (q && q.totalQuestions > 0 && q.slug === currentCourseSlug) {
          const ratio = q.correctAnswers / q.totalQuestions;
          if (ratio < 1.0 && ratio < lowestRatio) {
            lowestRatio = ratio;
            lowestScoreQuiz = q;
            hasDifficulties = true;
          }
        }
      }
    }
    if (!hasDifficulties) {
      for (const key in quizResults) {
        const q = quizResults[key];
        if (q && q.totalQuestions > 0) {
          const ratio = q.correctAnswers / q.totalQuestions;
          if (ratio < 1.0 && ratio < lowestRatio) {
            lowestRatio = ratio;
            lowestScoreQuiz = q;
            hasDifficulties = true;
          }
        }
      }
    }
  }

  // Condition 2: Quiz Difficulties (lowest correct ratio < 1.0)
  if (hasDifficulties && lowestScoreQuiz) {
    const correctAnswers = lowestScoreQuiz.correctAnswers;
    const totalQuestions = lowestScoreQuiz.totalQuestions;
    const courseTitle = lowestScoreQuiz.title || moduleName;

    if (tutorId === 'direct') {
      if (isFr) return `📈 Bilan : Difficultés détectées dans ${courseTitle} (${correctAnswers}/${totalQuestions} correctes). Cible : revoir le cours et refaire le quiz pour atteindre 100%.`;
      if (isEs) return `📈 Resumen: Dificultades en ${courseTitle} (${correctAnswers}/${totalQuestions} correctas). Objetivo: revisar el material y repetir el cuestionario al 100%.`;
      if (isDe) return `📈 Status: Schwierigkeiten in ${courseTitle} (${correctAnswers}/${totalQuestions} richtig). Ziel: Kurs wiederholen und Quiz auf 100% bringen.`;
      if (isZh) return `📈 报告：在《${courseTitle}》中遇到部分困难（答对 ${correctAnswers}/${totalQuestions}）。目标：重温课程并重新尝试测试以达到 100% 掌握。`;
      return `📈 Status: Difficulties detected in ${courseTitle} (${correctAnswers}/${totalQuestions} correct). Target: review the course material and retry the quiz to achieve 100% mastery.`;
    }
    if (tutorId === 'gamified') {
      if (isFr) return `🚀 Ne lâche rien ! Le quiz de ${courseTitle} t'a donné du fil à retordre (${correctAnswers}/${totalQuestions} correctes). Relis un coup les notions et va décrocher tous les points ! ⭐`;
      if (isEs) return `🚀 ¡No te rindas! El cuestionario de ${courseTitle} fue difícil (${correctAnswers}/${totalQuestions} correctas). ¡Repasa los conceptos y ve a ganar todos los points ! ⭐`;
      if (isDe) return `🚀 Bleib dran! Das Quiz in ${courseTitle} war knifflig (${correctAnswers}/${totalQuestions} richtig). Lies die Konzepte nochmal durch und hol dir die volle Punktzahl! ⭐`;
      if (isZh) return `🚀 不要气馁！《${courseTitle}》的测试有点挑战性（答对 ${correctAnswers}/${totalQuestions}）。重温一下概念，去赢取属于你的满分点数吧！⭐`;
      return `🚀 Don't give up! The quiz in ${courseTitle} was a bit tough (${correctAnswers}/${totalQuestions} correct). Review the concepts and go grab those points! ⭐`;
    }
    if (tutorId === 'historical') {
      if (isFr) return `🏛️ Cher chercheur, l'erreur fait partie du cheminement scientifique. Vos difficultés passées dans ${courseTitle} (${correctAnswers}/${totalQuestions} correctes) sont une invitation à approfondir vos lectures historiques pour mieux éclairer votre esprit.`;
      if (isEs) return `🏛️ Estimado erudito, el error es parte del camino científico. Tus dificultades en ${courseTitle} (${correctAnswers}/${totalQuestions} correctas) son una invitation a profundizar tus lecturas para iluminar tu mente.`;
      if (isDe) return `🏛️ Werter Gelehrter, Fehler sind Teil des wissenschaftlichen Weges. Ihre Schwierigkeiten in ${courseTitle} (${correctAnswers}/${totalQuestions} richtig) sind eine Einladung, Ihre Lektüre zu vertiefen.`;
      if (isZh) return `🏛️ 学者，错误是求知之路的必经阶段。您在《${courseTitle}》中的测试（答对 ${correctAnswers}/${totalQuestions}）正是加深阅读、解惑释疑的契机。`;
      return `🏛️ Fellow scholar, error is a natural step in the pursuit of truth. Your past challenges in ${courseTitle} (${correctAnswers}/${totalQuestions} correct) are an invitation to deepen your reading and illuminate your understanding.`;
    }
    if (tutorId === 'feynman') {
      if (isFr) return `💡 Aucun problème pour les erreurs sur ${courseTitle} (${correctAnswers}/${totalQuestions} correctes). C'est le moment d'identifier exactement ce qui cloche. Essayez d'expliquer ces concepts par écrit avec des mots simples, cela vous montrera ce qu'il faut retravailler !`;
      if (isEs) return `💡 No hay problema con los errores en ${courseTitle} (${correctAnswers}/${totalQuestions} correctas). Es el momento de ver qué falló. Intenta explicar estos concepts con palabras muy simples para notar qué necesitas repasar.`;
      if (isDe) return `💡 Kein Problem mit Fehlern in ${courseTitle} (${correctAnswers}/${totalQuestions} richtig). Jetzt können wir sehen, wo es hakt. Versuchen Sie, diese Konzepte mit einfachen Worten zu erklären, um Lücken zu finden!`;
      if (isZh) return `💡 在《${courseTitle}》的测试中答错没关系（答对 ${correctAnswers}/${totalQuestions}）。这正是查漏补缺的绝佳时机。试着用最通俗的话写下这些概念，您就会发现需要复习哪里！`;
      return `💡 No worries about the mistakes in ${courseTitle} (${correctAnswers}/${totalQuestions} correct). It's the perfect opportunity to pinpoint the gaps. Try explaining these concepts in simple terms to see what needs work!`;
    }
    if (tutorId === 'proof') {
      if (isFr) return `📐 Rigueur formelle. Incohérences détectées lors de la résolution de ${courseTitle} (${correctAnswers}/${totalQuestions} validées). Proposition : analyser les contre-exemples des questions erronées et ré-établir la démonstration.`;
      if (isEs) return `📐 Rigor formal. Inconsistencias detectadas en ${courseTitle} (${correctAnswers}/${totalQuestions} validadas). Propuesta: analizar las preguntas incorrectas y reconstruir la deducción.`;
      if (isDe) return `📐 Formale Strenge. Inkonsistenzen in ${courseTitle} festgestellt (${correctAnswers}/${totalQuestions} richtig). Vorschlag: Analysieren Sie die fehlerhaften Fragen und wiederholen Sie die Herleitung.`;
      if (isZh) return `📐 严格证明。在《${courseTitle}》的逻辑验证中检测到不一致性（答对 ${correctAnswers}/${totalQuestions}）。命题：分析答错题目的反例，并重新构建逻辑推导。`;
      return `📐 Formal rigor. Inconsistencies detected in ${courseTitle} (${correctAnswers}/${totalQuestions} validated). Proposition: analyze the counterexamples from the incorrect questions and re-establish the logical proof.`;
    }
    // Default / Socratic
    if (isFr) return `💬 Bon retour. Votre parcours dans ${courseTitle} a rencontré quelques obstacles sur les quiz (${correctAnswers}/${totalQuestions} correctes). Quelles notions vous ont semblé les moins évidentes lors de cette validation ? Commençons par les clarifier ensemble.`;
    if (isEs) return `💬 Bienvenido de nuevo. Tu estudio en ${courseTitle} tuvo algunos obstáculos (${correctAnswers}/${totalQuestions} correctas). ¿Qué conceptos te resultaron menos claros? Empecemos por aclararlos juntos.`;
    if (isDe) return `💬 Willkommen zurück. Ihr Studium in ${courseTitle} stieß auf einige Hindernisse (${correctAnswers}/${totalQuestions} richtig). Welche Konzepte erschienen Ihnen am unklarsten? Lassen Sie uns diese gemeinsam klären.`;
    if (isZh) return `💬 欢迎回来。您在《${courseTitle}》的学习中遇到了一些小障碍（测试答对 ${correctAnswers}/${totalQuestions}）。在这次验证中，哪些概念让您觉得最不容易理解？让我们一起先来澄清它们。`;
    return `💬 Welcome back. Your progress in ${courseTitle} encountered a few obstacles on the quizzes (${correctAnswers}/${totalQuestions} correct). Which concepts felt least clear during this validation? Let us begin by clarifying them together.`;
  }

  // Condition 3: Skipped Quizzes (progVal > 20 && masteryPoints === 0)
  if (progVal > 20 && masteryPoints === 0) {
    if (tutorId === 'direct') {
      if (isFr) return `🎯 Progression actuelle : ${progVal}% sur ${moduleName}, mais 0 Points de Maîtrise. Recommandation : effectuez les quiz de fin de chapitre pour valider vos acquis et acquérir vos points.`;
      if (isEs) return `🎯 Progreso: ${progVal}% en ${moduleName}, pero 0 Puntos de Maestría. Recomendación: realiza los cuestionarios de fin de capítulo para validar tus conocimientos.`;
      if (isDe) return `🎯 Fortschritt: ${progVal}% in ${moduleName}, aber 0 Meisterpunkte. Empfehlung: Absolvieren Sie die Quizzes am Kapitelende, um Ihr Wissen zu validieren.`;
      if (isZh) return `🎯 当前进度：《${moduleName}》已达 ${progVal}%，但掌握点数为 0。建议：完成章节末尾的测试以验证所学并获得点数。`;
      return `🎯 Current progress: ${progVal}% in ${moduleName}, but 0 Mastery Points. Recommendation: complete the chapter-end quizzes to validate your learning and earn points.`;
    }
    if (tutorId === 'gamified') {
      if (isFr) return `🚀 Super avancée sur ${moduleName} (${progVal}%) ! Mais ton compteur de Points de Maîtrise est encore à 0. Relève le défi des quiz pour débloquer tes premiers points ! ⭐`;
      if (isEs) return `🚀 ¡Gran avance en ${moduleName} (${progVal}%)! Pero tus Puntos de Maestría siguen en 0. ¡Acepta el desafío de los cuestionarios para ganar tus primeros puntos! ⭐`;
      if (isDe) return `🚀 Toller Fortschritt in ${moduleName} (${progVal}%)! Aber deine Meisterpunkte stehen noch bei 0. Stell dich den Quizzes, um deine ersten Punkte freizuschalten! ⭐`;
      if (isZh) return `🚀 在《${moduleName}》中的进度很棒（已达 ${progVal}%）！但你的掌握点数还是 0。快去接受测试挑战，解锁你的第一批掌握点数吧！⭐`;
      return `🚀 Great progress in ${moduleName} (${progVal}%)! However, your Mastery Points are still at 0. Take on the quizzes to unlock your very first points! ⭐`;
    }
    if (tutorId === 'historical') {
      if (isFr) return `🏛️ Vous avez beaucoup lu dans ${moduleName} (${progVal}% complété), mais votre savoir n'a pas encore été éprouvé par les quiz (0 Points de Maîtrise). Soumettez vos connaissances à l'épreuve des questionnaires historiques.`;
      if (isEs) return `🏛️ Has leído bastante en ${moduleName} (${progVal}% completado), pero tus conocimientos aún no han sido probados (0 Puntos de Maestría). Somete tu saber a la prueba de los cuestionarios.`;
      if (isDe) return `🏛️ Sie haben viel in ${moduleName} gelesen (${progVal}% abgeschlossen), aber Ihr Wissen wurde noch nicht geprüft (0 Meisterpunkte). Stellen Sie Ihr Wissen bei den Quizzes auf die Probe.`;
      if (isZh) return `🏛️ 您在《${moduleName}》中阅读了许多篇章（已完成 ${progVal}%），但您的知识尚未通过测试得到印证（掌握点数为 0）。请尝试进行章节测试以检验所学。`;
      return `🏛️ You have read extensively in ${moduleName} (${progVal}% completed), but your knowledge has not yet been verified by quizzes (0 Mastery Points). Put your understanding to the test.`;
    }
    if (tutorId === 'feynman') {
      if (isFr) return `💡 Vous avancez bien dans ${moduleName} (${progVal}%), mais vous avez sauté les quiz (0 points). Prenez quelques minutes pour les faire, c'est le meilleur moyen de vérifier si vous avez vraiment compris le fond du sujet !`;
      if (isEs) return `💡 Vas muy bien en ${moduleName} (${progVal}%), pero te saltaste los cuestionarios (0 puntos). ¡Hazlos ahora para comprobar si de verdad entendiste el tema a fondo!`;
      if (isDe) return `💡 Sie kommen in ${moduleName} gut voran (${progVal}%), haben aber die Quizzes übersprungen (0 Punkte). Nehmen Sie sich kurz Zeit dafür, um zu prüfen, ob Sie den Kern vraiment verstanden haben!`;
      if (isZh) return `💡 您在《${moduleName}》中进展顺利（已达 ${progVal}%），但跳过了测试（0 点数）。花几分钟做一下测试，这是检验您是否真正理解核心概念的最佳方式！`;
      return `💡 You are progressing nicely in ${moduleName} (${progVal}%), but you skipped the quizzes (0 points). Take a few minutes to complete them—it's the best way to verify if you've truly grasped the core ideas!`;
    }
    if (tutorId === 'proof') {
      if (isFr) return `📐 État de la base : Lecture effectuée à ${progVal}% pour ${moduleName}. Assertion non vérifiée (Mastery Points = 0). Nécessité d'exécuter les quiz pour valider formellement les propositions.`;
      if (isEs) return `📐 Estado: Lectura al ${progVal}% en ${moduleName}. Aseveración no verificada (Puntos de Maestría = 0). Necesidad de ejecutar los cuestionarios para validar formalmente las proposiciones.`;
      if (isDe) return `📐 Systemzustand: Lektüre zu ${progVal}% für ${moduleName} abgeschlossen. Aussage nicht verifiziert (Meisterpunkte = 0). Durchführung der Quizzes zur formalen Validierung erforderlich.`;
      if (isZh) return `📐 证明状态：已阅读《${moduleName}》的 ${progVal}%。命题尚未经验证（掌握点数为 0）。需要完成章节测试以进行形式化确认。`;
      return `📐 System state: Reading completed at ${progVal}% for ${moduleName}. Propositions unverified (Mastery Points = 0). Completion of quizzes is required to formally validate your understanding.`;
    }
    // Default / Socratic
    if (isFr) return `💬 Vous avez parcouru ${progVal}% de ${moduleName}. Pourtant, vos acquis n'ont pas encore été validés par les quiz (0 Points de Maîtrise). Souhaitez-vous évaluer votre compréhension actuelle en répondant à quelques questions ?`;
    if (isEs) return `💬 Has recorrido el ${progVal}% de ${moduleName}. Sin embargo, tus conocimientos no han sido validados por cuestionarios (0 Puntos de Maestría). ¿Deseas evaluar tu comprensión respondiendo algunas preguntas?`;
    if (isDe) return `💬 Sie haben ${progVal}% von ${moduleName} gelesen. Dennoch wurde Ihr Wissen nicht durch Quizzes validiert (0 Meisterpunkte). Möchten Sie Ihr Verständnis durch einige Fragen auf die Probe stellen?`;
    if (isZh) return `💬 您已经阅读了《${moduleName}》的 ${progVal}%。然而，您的学习成果尚未通过测试得到确认（掌握点数为 0）。您是否愿意通过回答几个问题 to 评估一下自己当前的理解？`;
    return `💬 You have covered ${progVal}% of ${moduleName}. However, your understanding has not yet been validated by quizzes (0 Mastery Points). Would you like to assess your current comprehension by answering a few questions?`;
  }

  // Condition 4: Study Streak (streakVal >= 3)
  if (streakVal >= 3) {
    if (tutorId === 'direct') {
      if (isFr) return `🎯 Performance : Série d'étude de ${streakVal} jours active. Continuez sur votre lancée dans ${moduleName} pour maintenir la régularité.`;
      if (isEs) return `🎯 Rendimiento: Racha de estudio de ${streakVal} días activa. Continúa con ${moduleName} para mantener la constancia.`;
      if (isDe) return `🎯 Leistung: Lernserie von ${streakVal} Tagen aktiv. Bleiben Sie in ${moduleName} dran, um die Regelmäßigkeit zu wahren.`;
      if (isZh) return `🎯 学习状态：已连续学习 ${streakVal} 天。继续保持在《${moduleName}》中的节奏以巩固这一习惯。`;
      return `🎯 Performance: ${streakVal}-day study streak active. Continue your progress in ${moduleName} to maintain consistency.`;
    }
    if (tutorId === 'gamified') {
      if (isFr) return `🚀 En feu ! 🔥 Déjà ${streakVal} jours de série consécutifs ! Ne t'arrête pas en si bon chemin sur ${moduleName}, tu gères grave ! ⭐`;
      if (isEs) return `🚀 ¡En racha! 🔥 ¡Llevas ${streakVal} días de estudio consecutivos! No te detengas ahora en ${moduleName}, ¡lo estás haciendo genial! ⭐`;
      if (isDe) return `🚀 Läuft bei dir! 🔥 Bereits ${streakVal} Tage in Folge gelernt! Mach weiter so in ${moduleName}, du bist auf einem super weg! ⭐`;
      if (isZh) return `🚀 势不可挡！🔥 已经连续学习 ${streakVal} 天了！在《${moduleName}》的学习中继续保持，你太棒了！⭐`;
      return `🚀 You are on fire! 🔥 ${streakVal} days of consecutive study streak! Keep up the amazing work in ${moduleName}! ⭐`;
    }
    if (tutorId === 'historical') {
      if (isFr) return `🏛️ Comme les grands érudits d'autrefois, vous faites preuve d'une assiduité remarquable avec ${streakVal} jours d'étude consécutifs. Poursuivez noblement votre quête du savoir dans ${moduleName}.`;
      if (isEs) return `🏛️ Al igual que los grandes eruditos del pasado, demuestras una constancia admirable con ${streakVal} días de estudio consecutivos. Continúa con nobleza tu búsqueda del saber en ${moduleName}.`;
      if (isDe) return `🏛️ Wie die großen Gelehrten vergangener Zeiten zeigen Sie mit ${streakVal} Studientagen in Folge eine bemerkenswerte Ausdauer. Setzen Sie Ihre Suche nach Wissen in ${moduleName} fort.`;
      if (isZh) return `🏛️ 如同昔日的学者一般，您展现出了非凡的毅力，已连续 learning ${streakVal} 天。继续在《${moduleName}》中前行，探索真理吧。`;
      return `🏛️ Like the great scholars of history, you show remarkable dedication with ${streakVal} consecutive days of study. Continue your noble quest for knowledge in ${moduleName}.`;
    }
    if (tutorId === 'feynman') {
      if (isFr) return `💡 Incroyable ! Une série de ${streakVal} jours d'apprentissage. Apprendre un peu tous les jours est le meilleur moyen d'ancrer les concepts. Continuez sur ${moduleName} !`;
      if (isEs) return `💡 ¡Increíble! Una racha de ${streakVal} jours de aprendizaje. Estudiar un poco todos los días es ideal para fijar los conceptos. ¡Sigue así en ${moduleName}!`;
      if (isDe) return `💡 Großartig! Eine Serie von ${streakVal} Lerntagen. Jeden Tag ein bisschen zu lernen ist der beste weg, um Konzepte zu verankern. Machen Sie weiter in ${moduleName}!`;
      if (isZh) return `💡 太棒了！连续学习了 ${streakVal} 天。每天学习一点点是巩固概念的最佳方式。在《${moduleName}》中继续保持吧！`;
      return `💡 Amazing! You have built a ${streakVal}-day study streak. Learning a little bit every day is the best way to make the concepts stick. Keep going with ${moduleName}!`;
    }
    if (tutorId === 'proof') {
      if (isFr) return `📐 Constante d'apprentissage validée : série de ${streakVal} jours de travail continu. Rigueur démontrée. Poursuite de la séquence ordonnée dans ${moduleName}.`;
      if (isEs) return `📐 Constante de aprendizaje validada: racha de ${streakVal} días de estudio continuo. Rigor demostrado. Continuación de la secuencia en ${moduleName}.`;
      if (isDe) return `📐 Lernkonstante verifiziert: Serie von ${streakVal} Tagen kontinuierlicher Arbeit. Ausdauer bewiesen. Fortsetzung der geordneten Sequenz in ${moduleName}.`;
      if (isZh) return `📐 学习常数验证：已连续学习 ${streakVal} 天。严谨度已获证实。在《${moduleName}》中继续按序推進。`;
      return `📐 Learning constant validated: streak of ${streakVal} consecutive days of study. Consistency proven. Continuing the ordered sequence in ${moduleName}.`;
    }
    // Default / Socratic
    if (isFr) return `💬 Vous montrez une belle régularité avec ${streakVal} jours d'activité constante. Comment ressentez-vous votre progression sur ${moduleName} à ce stade de votre réflexion ? Poursuivons sur cette voie.`;
    if (isEs) return `💬 Demuestras una constancia admirable con ${streakVal} días de actividad. ¿Cómo valoras tu progreso en ${moduleName} en esta etapa de tu reflexión? Sigamos por este camino.`;
    if (isDe) return `💬 Sie zeigen eine bemerkenswerte Regelmäßigkeit mit ${streakVal} Tagen Aktivität. Wie schätzen Sie Ihren Fortschritt in ${moduleName} an diesem Point ein? Lassen Sie uns diesen Weg fortsetzen.`;
    if (isZh) return `💬 您展现出了极佳的规律性，已连续学习 ${streakVal} 天。在现阶段 of 思考中，您如何感受自己在《${moduleName}》中的进展？让我们继续前行。`;
    return `💬 You have shown excellent consistency with ${streakVal} days of active learning. How do you feel about your progress in ${moduleName} at this stage of your study? Let us continue along this path.`;
  }

  // Condition 5: Return to session (progVal > 0 && progVal < 100)
  if (progVal > 0 && progVal < 100) {
    if (tutorId === 'direct') {
      if (isFr) return `🎯 Reprise : Cours "${moduleName}" en cours (${progVal}%). Objectif : finaliser les chapitres restants.`;
      if (isEs) return `🎯 Reanudación: Curso "${moduleName}" en progreso (${progVal}%). Objetivo: finalizar los capítulos restantes.`;
      if (isDe) return `🎯 Fortsetzung: Kurs "${moduleName}" läuft (${progVal}%). Ziel: Verbleibende Kapitel abschließen.`;
      if (isZh) return `🎯 课程恢复：正在学习《${moduleName}》（进度为 ${progVal}%）。目标：完成余下的章节。`;
      return `🎯 Resuming: Course "${moduleName}" is in progress (${progVal}%). Target: complete the remaining chapters.`;
    }
    if (tutorId === 'gamified') {
      if (isFr) return `🚀 Bon retour ! Prêt à continuer ${moduleName} ? Tu en étais à ${progVal}% de progression, c'est reparti ! ⭐`;
      if (isEs) return `🚀 ¡Bienvenido de nuevo! ¿Listo para continuar con ${moduleName}? Te quedaste en el ${progVal}%, ¡vamos! ⭐`;
      if (isDe) return `🚀 Schön, dass du wieder da bist! Bereit, ${moduleName} fortzusetzen? Du warst bei ${progVal}% Fortschritt, los geht's! ⭐`;
      if (isZh) return `🚀 欢迎回来！准备好继续学习《${moduleName}》了吗？你之前的进度是 ${progVal}%，让我们继续前进！⭐`;
      return `🚀 Welcome back! Ready to continue with ${moduleName}? You were at ${progVal}% progress, let's keep going! ⭐`;
    }
    if (tutorId === 'historical') {
      if (isFr) return `🏛️ Salutations. Poursuivons l'étude de "${moduleName}", dont vous avez déjà assimilé ${progVal}%. Le chemin de la connaissance vous attend.`;
      if (isEs) return `🏛️ Saludos. Continuemos con el estudio de "${moduleName}", del cual ya has asimilado el ${progVal}%. El camino del saber te espera.`;
      if (isDe) return `🏛️ Seien Sie gegrüßt. Setzen wir das Studium von "${moduleName}" fort, von dem Sie bereits ${progVal}% erlernt haben. Der Weg des Wissens erwartet Sie.`;
      if (isZh) return `🏛️ 您好。让我们继续学习《${moduleName}》，您此前已掌握了 ${progVal}%。求知之路在前方延伸。`;
      return `🏛️ Greetings. Let us resume the study of "${moduleName}", of which you have already assimilated ${progVal}%. The path of knowledge awaits you.`;
    }
    if (tutorId === 'feynman') {
      if (isFr) return `💡 Ravi de vous revoir ! On continue à décortiquer ${moduleName} ? Vous en étiez à ${progVal}%, allons-y !`;
      if (isEs) return `💡 ¡Qué bueno verte! ¿Seguimos desglosando ${moduleName}? Te quedaste en el ${progVal}%, ¡vamos allá!`;
      if (isDe) return `💡 Schön, Sie wiederzusehen! Wollen wir ${moduleName} weiter zerlegen? Sie waren bei ${progVal}%, packen wir es an!`;
      if (isZh) return `💡 很高兴再次见到您！我们继续拆解《${moduleName}》吧？您之前的进度是 ${progVal}%，让我们开始吧！`;
      return `💡 Good to see you again! Ready to break down more of ${moduleName}? You were at ${progVal}% progress, let's go!`;
    }
    if (tutorId === 'proof') {
      if (isFr) return `📐 État de la démonstration : progression à ${progVal}% pour "${moduleName}". Reprise de la séquence logique.`;
      if (isEs) return `📐 Estado de la prueba: progreso al ${progVal}% para "${moduleName}". Reanudación de la secuencia lógica.`;
      if (isDe) return `📐 Beweisstatus: Fortschritt bei ${progVal}% für "${moduleName}". Fortsetzung der logischen Sequenz.`;
      if (isZh) return `📐 证明状态：正在进行《${moduleName}》（完成度 ${progVal}%）。恢复逻辑序列。`;
      return `📐 Proof state: progression at ${progVal}% for "${moduleName}". Resuming the logical sequence.`;
    }
    // Default / Socratic
    if (isFr) return `💬 Bon retour. Prêt à poursuivre votre réflexion sur ${moduleName} ? Vous aviez validé ${progVal}% du parcours.`;
    if (isEs) return `💬 Bienvenido de nuevo. ¿Listo para continuar tu reflexión sobre ${moduleName}? Habías completado el ${progVal}% del camino.`;
    if (isDe) return `💬 Willkommen zurück. Bereit, Ihre Überlegungen zu ${moduleName} fortzusetzen? Sie hatten bereits ${progVal}% des Weges geschafft.`;
    if (isZh) return `💬 欢迎回来。准备好继续思考关于《${moduleName}》的内容了吗？您此前已完成了 ${progVal}% 的学习。`;
    return `💬 Welcome back. Ready to resume your study of ${moduleName}? You had completed ${progVal}% of the course.`;
  }

  // Otherwise, return empty string so no popover is displayed
  return '';
}





export function mockDatabaseProviderHash(password: string): string {
  if (!password) return '';
  const rightRotate = (value: number, amount: number): number => {
    return (value >>> amount) | (value << (32 - amount));
  };
  
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i: number, j: number;

  let result = '';

  const words: number[] = [];
  const hash: number[] = [];

  let primeCounter = 0;
  const isComposite: { [key: number]: number } = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = 1;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      primeCounter++;
    }
  }
  
  // Convert to UTF-8 bytes:
  const bytes: number[] = [];
  for (i = 0; i < password[lengthProperty]; i++) {
    let code = password.charCodeAt(i);
    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push((code >> 6) | 192);
      bytes.push((code & 63) | 128);
    } else if (
      (code & 0xF800) === 0xD800 &&
      i + 1 < password[lengthProperty] &&
      (password.charCodeAt(i + 1) & 0xFC00) === 0xDC00
    ) {
      code = 0x10000 + ((code & 0x3FF) << 10) + (password.charCodeAt(++i) & 0x3FF);
      bytes.push((code >> 18) | 240);
      bytes.push(((code >> 12) & 63) | 128);
      bytes.push(((code >> 6) & 63) | 128);
      bytes.push((code & 63) | 128);
    } else {
      bytes.push((code >> 12) | 224);
      bytes.push(((code >> 6) & 63) | 128);
      bytes.push((code & 63) | 128);
    }
  }

  const byteLength = bytes[lengthProperty];
  for (i = 0; i < byteLength; i++) {
    words[i >>> 2] |= (bytes[i] & 0xff) << (24 - (i % 4) * 8);
  }
  
  const bitLength = byteLength * 8;
  words[bitLength >>> 5] |= 0x80 << (24 - (bitLength % 32));
  
  words[((bitLength + 64 >>> 9) << 4) + 15] = bitLength;
  
  // Standard K constants (first 64 primes cube roots fractional parts)
  const k: number[] = [];
  primeCounter = 0;
  const isCompositeK: { [key: number]: number } = {};
  for (let candidateK = 2; primeCounter < 64; candidateK++) {
    if (!isCompositeK[candidateK]) {
      for (i = 0; i < 313; i += candidateK) {
        isCompositeK[i] = 1;
      }
      k[primeCounter] = (mathPow(candidateK, 1/3) * maxWord) | 0;
      primeCounter++;
    }
  }

  for (let blockStart = 0; blockStart < words[lengthProperty]; blockStart += 16) {
    const w: number[] = [];
    let working = hash.slice(0);
    for (i = 0; i < 64; i++) {
      if (i < 16) {
        w[i] = words[blockStart + i] || 0;
      } else {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      
      const a = working[0], b = working[1], c = working[2], d = working[3];
      const e = working[4], f = working[5], g = working[6], h = working[7];
      
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      
      const chVal = (e & f) ^ (~e & g);
      const majVal = (a & b) ^ (a & c) ^ (b & c);
      
      const temp1 = (h + S1 + chVal + k[i] + w[i]) | 0;
      const temp2 = (S0 + majVal) | 0;
      
      working = [(temp1 + temp2) | 0, a, b, c, (d + temp1) | 0, e, f, g];
    }
    
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + working[i]) | 0;
    }
  }
  
  for (i = 0; i < 8; i++) {
    const n = hash[i];
    for (j = 0; j < 4; j++) {
      const v = (n >>> (24 - j * 8)) & 0xff;
      result += (v < 16 ? '0' : '') + v.toString(16);
    }
  }
  return result;
}

import { mockDatabaseProvider } from './db/mock-provider';
import { supabaseDatabaseProvider } from './db/supabase-provider';

export const dbService: DatabaseService = new Proxy({} as DatabaseService, {
  get(target, prop, receiver) {
    const isProduction = process.env.NODE_ENV === 'production';
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const sandboxAllowed = isSandboxFallbackAllowed();
    const useSupabase = isProduction || (isDatabaseConfigured && !isOffline && !sandboxAllowed && (!isLocalhost || !dynamicOffline));
    const activeProvider = useSupabase ? supabaseDatabaseProvider : mockDatabaseProvider;

    if (typeof window !== 'undefined' && prop === 'getUserProgress') {
      console.log(`[DB PROXY] getUserProgress called. activeProvider: ${useSupabase ? 'Supabase' : 'Mock'}, isOffline: ${isOffline}, sandboxAllowed: ${sandboxAllowed}, isDatabaseConfigured: ${isDatabaseConfigured}`);
    }

    const value = Reflect.get(activeProvider, prop, receiver);

    if (typeof value === 'function') {
      const syncMethods = ['getLocalizedCourseTitle', 'hashPassword'];
      if (syncMethods.includes(String(prop))) {
        return value.bind(activeProvider);
      }
      return async function (...args: any[]) {
        const propStr = String(prop);
        const isWriteMethod = (name: string): boolean => {
          const n = name.toLowerCase();
          return n.startsWith('save') || 
                 n.startsWith('delete') || 
                 n.startsWith('toggle') || 
                 n.startsWith('purge') || 
                 n.startsWith('add') || 
                 n.startsWith('update') || 
                 n.startsWith('submit') || 
                 n.startsWith('register') || 
                 n.startsWith('mark') ||
                 n.startsWith('approve') ||
                 n.startsWith('autoapprove') ||
                 n.startsWith('enroll') ||
                 n.startsWith('abandon');
        };

        const blockFallback = isWriteMethod(propStr);

        let resolvedSandboxAllowed = isSandboxFallbackAllowed();
        if (typeof window === 'undefined') {
          try {
            const { cookies } = require('next/headers');
            const cookieStore = await cookies();
            if (cookieStore.get('op_mock_archiving_levels')?.value || cookieStore.get('op_allow_sandbox')?.value === 'true') {
              resolvedSandboxAllowed = true;
            }
          } catch (e) {}
        }

        const resolvedUseSupabase = isProduction || (isDatabaseConfigured && !isOffline && !resolvedSandboxAllowed && (!isLocalhost || !dynamicOffline));
        const resolvedProvider = resolvedUseSupabase ? supabaseDatabaseProvider : mockDatabaseProvider;
        const targetFn = Reflect.get(resolvedProvider, prop, receiver);

        if (typeof targetFn !== 'function') {
          throw new Error(`Method '${propStr}' does not exist on the resolved database provider.`);
        }

        try {
          const res = await targetFn.apply(resolvedProvider, args);
          if (typeof window !== 'undefined' && propStr === 'getUserProgress') {
            console.log(`[DB PROXY RES] getUserProgress resolved. Args: ${JSON.stringify(args)}. Result: ${JSON.stringify(res)}`);
          }
          if (resolvedUseSupabase && isLocalhost && resolvedSandboxAllowed && res && res.error && isConnectionFailure(res.error)) {
            if (blockFallback) {
              console.error(`[DATABASE] Authoritative write/mutation query '${propStr}' failed on remote database. Fallback is disabled to preserve data integrity.`, res.error);
              return res;
            }
            console.warn(`[DATABASE FALLBACK] Supabase query '${String(prop)}' failed on localhost due to connection failure. Falling back to Mock/LocalStorage provider.`, res.error);
            setDynamicOffline(true);
            const retryValue = Reflect.get(mockDatabaseProvider, prop, receiver);
            if (typeof retryValue === 'function') {
              return retryValue.apply(mockDatabaseProvider, args);
            }
          }
          return res;
        } catch (err) {
          if (resolvedUseSupabase && isLocalhost && resolvedSandboxAllowed && isConnectionFailure(err)) {
            if (blockFallback) {
              console.error(`[DATABASE] Authoritative write/mutation query '${propStr}' threw an error on remote database. Fallback is disabled to preserve data integrity.`, err);
              throw err;
            }
            console.warn(`[DATABASE FALLBACK] Supabase query '${String(prop)}' threw a connection error on localhost. Falling back to Mock/LocalStorage provider.`, err);
            setDynamicOffline(true);
            const retryValue = Reflect.get(mockDatabaseProvider, prop, receiver);
            if (typeof retryValue === 'function') {
              return retryValue.apply(mockDatabaseProvider, args);
            }
          }
          throw err;
        }
      };
    }

    return value;
  }
});

import {
  progressService as progressServiceImp,
  compileRuleLocally as compileRuleLocallyImp,
  resetEvaluationState as resetEvaluationStateImp,
  registerCoursesProvider
} from './db/progress-service';

// Register the courses provider to avoid circular dependencies
registerCoursesProvider(() => mockCourses);

export const progressService = progressServiceImp;
export const compileRuleLocally = compileRuleLocallyImp;
export const resetEvaluationState = resetEvaluationStateImp;


export async function syncLocalStorageToSupabase(userId: string): Promise<{ success: boolean; syncedCourses: number; syncedProgress: number; syncedTasks: number }> {
  if (typeof window === 'undefined') return { success: false, syncedCourses: 0, syncedProgress: 0, syncedTasks: 0 };
  
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isLocalhost || !isDatabaseConfigured || (dynamicOffline && isSandboxFallbackAllowed()) || isOffline) {
    return { success: false, syncedCourses: 0, syncedProgress: 0, syncedTasks: 0 };
  }

  console.log(`[SYNC] Beginning LocalStorage to Supabase synchronization for user ${userId}...`);

  let syncedCourses = 0;
  let syncedProgress = 0;
  let syncedTasks = 0;

  try {
    // 1. Sync Courses (Disabled: custom courses should never be auto-uploaded from client local storage to Supabase)
    const localCoursesStr = window.localStorage.getItem('openprimer_courses');

    // Fetch active courses from Supabase to prevent syncing deleted items and clean up local caches
    const { data: dbCourses, error: dbCoursesError } = await supabase.from('courses').select('id');
    const dbCourseIds = (!dbCoursesError && dbCourses) ? new Set(dbCourses.map((c: any) => c.id)) : null;

    if (dbCourseIds) {
      // Clean up deleted courses from localStorage 'openprimer_courses' cache
      if (localCoursesStr) {
        try {
          const localCourses = JSON.parse(localCoursesStr) as any[];
          const validLocalCourses = localCourses.filter(c => dbCourseIds.has(c.id));
          if (validLocalCourses.length !== localCourses.length) {
            window.localStorage.setItem('openprimer_courses', JSON.stringify(validLocalCourses));
            setMockCourses(validLocalCourses);
          }
        } catch (e) {}
      }

      // Clean up deleted courses from localStorage 'op_enrolled_courses' cache
      const enrolledStrTemp = window.localStorage.getItem('op_enrolled_courses');
      if (enrolledStrTemp) {
        try {
          const enrolledIds = JSON.parse(enrolledStrTemp) as number[];
          const validEnrolledIds = enrolledIds.filter(id => dbCourseIds.has(id));
          if (validEnrolledIds.length !== enrolledIds.length) {
            window.localStorage.setItem('op_enrolled_courses', JSON.stringify(validEnrolledIds));
          }
        } catch (e) {}
      }
    }

    // 2. Sync Enrolled Courses & Progress
    const enrolledStr = window.localStorage.getItem('op_enrolled_courses');
    if (enrolledStr && userId !== 'u1') {
      const enrolledIds = JSON.parse(enrolledStr) as number[];
      const progressMap = JSON.parse(window.localStorage.getItem('op_course_progress') || '{}') as Record<string, number>;
      const lessonProgress = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}') as Record<string, any>;
      const quizResults = JSON.parse(window.localStorage.getItem('op_quiz_results') || '{}') as Record<string, any>;

      // Get all current courses
      const localCoursesStrUpdated = window.localStorage.getItem('openprimer_courses');
      const localCourses = JSON.parse(localCoursesStrUpdated || '[]') as any[];

      for (const enrolledId of enrolledIds) {
        // Double check course exists in db
        if (dbCourseIds && !dbCourseIds.has(enrolledId)) continue;

        // Find the course in our local list to get its slug
        const course = localCourses.find(c => c.id === enrolledId);
        if (!course) continue;

        const slug = course.slug;
        const percentage = progressMap[slug] ?? progressMap[enrolledId.toString()] ?? 0;

        // Get course-specific lesson progress and quiz results
        const courseLessonProgress: Record<string, any> = {};
        for (const k in lessonProgress) {
          if (lessonProgress[k].slug === slug) {
            courseLessonProgress[k] = lessonProgress[k];
          }
        }

        const courseQuizResults: Record<string, any> = {};
        for (const k in quizResults) {
          if (quizResults[k].slug === slug) {
            courseQuizResults[k] = quizResults[k];
          }
        }

        const totalMinutes = progressService.getLessonTimeForCourse(slug);

        console.log(`[SYNC] Syncing progress for '${course.title}' to Supabase (${percentage}%)...`);
        
        const { error } = await supabase
          .from('progress')
          .upsert({
            user_id: userId,
            course_id: course.id,
            progress: percentage,
            lesson_progress: courseLessonProgress,
            quiz_results: courseQuizResults,
            total_minutes: totalMinutes,
            last_visited: new Date().toISOString()
          }, { onConflict: 'user_id,course_id' });

        if (error) {
          console.error(`[SYNC] Error syncing progress for ${slug}:`, error);
        } else {
          syncedProgress++;
        }
      }
    }

    // 3. Sync Pipeline Task Queue
    const pipelineStr = window.localStorage.getItem('openprimer_pipeline_queue');
    if (pipelineStr) {
      const localQueue = JSON.parse(pipelineStr) as any[];
      if (localQueue.length > 0) {
        // Check if the remote task queue is empty
        const { data: remoteQueue } = await supabase.from('task_queue').select('*');
        if (!remoteQueue || remoteQueue.length === 0) {
          console.log(`[SYNC] Remote task queue is empty. Syncing local pipeline queue of ${localQueue.length} tasks...`);
          await supabaseDatabaseProvider.savePipelineQueue(localQueue);
          syncedTasks = localQueue.length;
        }
      }
    }

    console.log(`[SYNC] Sync complete! Synced ${syncedCourses} courses, ${syncedProgress} progress records, and ${syncedTasks} tasks.`);
    return { success: true, syncedCourses, syncedProgress, syncedTasks };
  } catch (err) {
    console.error("[SYNC] Failure during LocalStorage to Supabase sync:", err);
    return { success: false, syncedCourses, syncedProgress, syncedTasks };
  }
}

// EXPOSE TO WINDOW FOR PLAYWRIGHT E2E TESTING
if (typeof window !== 'undefined') {
  (window as any).dbService = dbService;
  (window as any).progressService = progressService;
  (window as any).syncLocalStorageToSupabase = syncLocalStorageToSupabase;
}


