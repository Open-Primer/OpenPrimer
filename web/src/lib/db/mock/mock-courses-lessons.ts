import {
  DatabaseService,
  SystemParameter,
  TranslationEmailNotification,
  MockCourse,
  UserProfile,
  LanguageInfo,
  Achievement,
  SearchHistoryEntry,
  CourseFeedback,
  TranslationRequestEntry,
  RefusedCourseEntry,
  RefusedTranslationEntry,
  RefusedRevisionEntry,
  TutorPersonality,
  AgentMetric,
  ContactFeedback,
  UserRole,
  ReportCluster
} from '../types';
import {
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
  setLocalStorageItem,
  purgePipelineAndRequestsForCourseOrCurriculum,
  addCourseTombstone,
  removeCourseTombstone
} from '../state-store';
import {
  getLocalizedCourseTitleInternal,
  generatePedagogicalSummary,
  mockDatabaseProviderHash,
  getCanonicalCourseId
} from '../helpers';
import { progressService } from '../progress-service';
import { sanitizeString, detectPromptInjection, isSpam } from '../../security';
import { cleanPathSegment } from '../../translations';


export const mockCoursesLessonsMethods = {
  getSystemParameters: async () => {
    return { data: getSystemParametersList(), error: null };
  },

  saveSystemParameter: async (param: { key: string; value: string }) => {
    const list = [
      param,
      ...getSystemParametersList().filter(p => p.key !== param.key)
    ];
    setSystemParametersList(list);
    setLocalStorageItem('openprimer_system_parameters', list);
    return { data: param, error: null };
  },

  getLocalizedCourseTitle: (course: any, lang: string) => {
    return getLocalizedCourseTitleInternal(course, lang);
  },

  getAllCourseCompletions: async () => {
    return { data: getCourseCompletionsList(), error: null };
  },
  getTranslationEmails: async () => {
    return { data: getTranslationEmailsList(), error: null };
  },
  saveTranslationEmail: async (email: TranslationEmailNotification) => {
    const list = [email, ...getTranslationEmailsList().filter(e => e.id !== email.id)];
    setTranslationEmailsList(list);
    setLocalStorageItem('openprimer_translation_emails', list);
    return { data: email, error: null };
  },
  deleteTranslationEmail: async (id: string) => {
    const list = getTranslationEmailsList().filter(e => e.id !== id);
    setTranslationEmailsList(list);
    setLocalStorageItem('openprimer_translation_emails', list);
    return { data: null, error: null };
  },
  cleanupTranslationEmails: async (retentionDays: number) => {
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    const list = getTranslationEmailsList().filter(e => new Date(e.timestamp).getTime() >= cutoff);
    setTranslationEmailsList(list);
    setLocalStorageItem('openprimer_translation_emails', list);
    return { data: null, error: null };
  },
  getLesson: async (courseSlug: string, lessonSlug: string, lang: string) => {
    const fetchLesson = async () => {
      if ((courseSlug.toLowerCase() === 'droit_des_entreprises' || courseSlug.toLowerCase() === 'difficultes-procedures-collectives') && lessonSlug.toLowerCase() === 'difficultes-procedures-collectives') {
        return {
          data: {
            course_slug: courseSlug,
            lesson_slug: lessonSlug,
            lang: lang.toLowerCase(),
            title: "Les Difficultés et Procédures Collectives",
            content: `---
title: "Les Difficultés et Procédures Collectives"
subject: "Droit des Entreprises"
level: "L1"
module: "Droit des Affaires"
order: 10
---
# Les Difficultés et Procédures Collectives

<EssayEvaluation 
  prompt="Analysez les conditions d'ouverture de la procédure de sauvegarde par rapport au redressement judiciaire." 
  gradingSystem="0/20" 
  subject="Droit des Entreprises" 
/>
`
          },
          error: null
        };
      }
      if (courseSlug.toLowerCase() === 'classical_mechanics' && lessonSlug.toLowerCase() === 'newtons_laws_of_motion') {
        return {
          data: {
            course_slug: courseSlug,
            lesson_slug: lessonSlug,
            lang: lang.toLowerCase(),
            title: "Newton's Laws of Motion",
            content: `---
title: "Newton's Laws of Motion"
subject: "Physics"
level: "L1"
module: "Classical Mechanics"
---
Welcome to Newton's Laws of Motion!
This lesson covers:
- First law: Inertia
- Second law: F = ma
- Third law: Action and reaction
`
          },
          error: null
        };
      }
      if (courseSlug.toLowerCase() === 'test_widgets' && lessonSlug.toLowerCase() === 'evaluations_quiz') {
        return {
          data: {
            course_slug: courseSlug,
            lesson_slug: lessonSlug,
            lang: lang.toLowerCase(),
            title: "4. Évaluations, Quiz & Feedback Interactifs",
            content: `---
title: "4. Évaluations, Quiz & Feedback Interactifs"
subject: "Computer_Science"
level: "L1"
module: "Sandbox de Test"
order: 4
---
# 4. Évaluations, Quiz & Feedback Interactifs

<EssayEvaluation 
  prompt="Expliquez la différence fondamentale entre les protocoles de communication TCP et UDP, en détaillant la notion de connexion, de contrôle de flux et de congestion, ainsi que leurs cas d'usage respectifs." 
  gradingSystem="0/20" 
  subject="Réseaux Informatiques" 
/>
`
          },
          error: null
        };
      }
      if (courseSlug.toLowerCase() === 'geographie_physique_et_climatologie' && lessonSlug.toLowerCase() === 'evaluation-terminale') {
        return {
          data: {
            course_slug: courseSlug,
            lesson_slug: lessonSlug,
            lang: lang.toLowerCase(),
            title: "Évaluation Terminale",
            content: `---
title: "Évaluation Terminale"
subject: "Géographie physique et climatologie"
level: "L3"
module: "Évaluation Terminale"
order: 7
summative: true
---

<Quiz isFinal={true} durationLimit={300} limit={1}>
    <Question q="Quel est le principal objectif de la geographie physique?" explanation="La geographie physique se concentre sur l'etude des processus naturels et des formes de la surface terrestre, y compris le climat, les sols, la vegetation et les eaux.">
  <Option text="L'etude des populations humaines et de leurs cultures." correct={false} />
  <Option text="L'analyse des systèmes economiques mondiaux." correct={false} />
  <Option text="L'etude des processus naturels et des formes de la surface terrestre." correct={true} />
  <Option text="La cartographie des frontieres politiques." correct={false} />
</Question>
    <Question q="Lequel des éléments suivants NE fait PAS partie du système climatique terrestre?" explanation="Le système climatique terrestre comprend l'atmosphere, l'hydrosphere, la cryosphere, la lithosphere et la biosphere. Les satellites sont des outils d'observation, pas des composants intrinseques du système.">
  <Option text="L'atmosphere" correct={false} />
  <Option text="Les oceans (hydrosphere)" correct={false} />
  <Option text="Les satellites d'observation" correct={true} />
  <Option text="Les calottes glaciaires (cryosphere)" correct={false} />
</Question>
</Quiz>
`
          },
          error: null
        };
      }
      if (typeof window === 'undefined') {
        try {
          const fs = require('fs');
          const path = require('path');
          
          let contentDir = path.join(process.cwd(), 'content');
          if (!fs.existsSync(contentDir)) {
            contentDir = path.join(process.cwd(), 'web/content');
          }
          
          if (fs.existsSync(contentDir)) {
            const findCourseFolder = (dir: string): string | null => {
              const items = fs.readdirSync(/*turbopackIgnore: true*/ dir, { withFileTypes: true });
              for (const item of items) {
                const fullPath = path.join(dir, item.name);
                if (item.isDirectory()) {
                  if (item.name.toLowerCase() === courseSlug.toLowerCase()) {
                    return fullPath;
                  }
                  const sub = findCourseFolder(fullPath);
                  if (sub) return sub;
                }
              }
              return null;
            };
            
            const courseDir = findCourseFolder(contentDir);
            if (courseDir) {
              const fileName = `${lessonSlug}.${lang.toLowerCase()}.mdx`;
              const filePath = path.join(courseDir, fileName);
              if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf-8');
                let title = lessonSlug.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
                const fmMatch = fileContent.match(/title:\s*["']?(.*?)["']?\r?\n/);
                if (fmMatch && fmMatch[1]) {
                  title = fmMatch[1];
                }
                return {
                  data: {
                    course_slug: courseSlug,
                    lesson_slug: lessonSlug,
                    lang: lang.toLowerCase(),
                    title: title,
                    content: fileContent
                  },
                  error: null
                };
              }
            }
          }
        } catch (err) {
          console.error("Error reading lesson file from disk in mock-provider:", err);
        }
      } else {
        const stored = window.localStorage.getItem('openprimer_lessons');
        if (stored) {
          try {
            const lessons = JSON.parse(stored);
            const found = lessons.find((l: any) => 
              l.course_slug.toLowerCase() === courseSlug.toLowerCase() && 
              l.lesson_slug.toLowerCase() === lessonSlug.toLowerCase() && 
              l.lang.toLowerCase() === lang.toLowerCase()
            );
            if (found) {
              return { data: found, error: null };
            }
          } catch (e) {}
        }
      }
      return { data: null, error: new Error("Mock offline mode does not support dynamic lessons database fetching") };
    };

    const res = await fetchLesson();
    if (res.data) {
      const cleanSlug = (res.data.lesson_slug || lessonSlug || '').toLowerCase();
      const isSummative = cleanSlug === 'evaluation-terminale' || cleanSlug === 'final-evaluation' || cleanSlug === 'evaluation-finale';
      res.data = {
        ...res.data,
        evaluation_type: isSummative ? 'summative' : 'formative'
      };
    }
    return res;
  },

  getFirstLessonSlug: async (courseSlug: string, lang: string) => {
    if (courseSlug.toLowerCase() === 'droit_des_entreprises' || courseSlug.toLowerCase() === 'difficultes-procedures-collectives') {
      return { data: 'difficultes-procedures-collectives', error: null };
    }
    if (courseSlug.toLowerCase() === 'classical_mechanics') {
      return { data: 'newtons_laws_of_motion', error: null };
    }
    if (typeof window === 'undefined') {
      try {
        const fs = require('fs');
        const path = require('path');
        
        let contentDir = path.join(process.cwd(), 'content');
        if (!fs.existsSync(contentDir)) {
          contentDir = path.join(process.cwd(), 'web/content');
        }
        
        if (fs.existsSync(contentDir)) {
          const findCourseFolder = (dir: string): string | null => {
            const items = fs.readdirSync(/*turbopackIgnore: true*/ dir, { withFileTypes: true });
            for (const item of items) {
              const fullPath = path.join(dir, item.name);
              if (item.isDirectory()) {
                if (item.name.toLowerCase() === courseSlug.toLowerCase()) {
                  return fullPath;
                }
                const sub = findCourseFolder(fullPath);
                if (sub) return sub;
              }
            }
            return null;
          };
          
          const courseDir = findCourseFolder(contentDir);
          if (courseDir) {
            const files = fs.readdirSync(/*turbopackIgnore: true*/ courseDir);
            const matchingFiles = files.filter((f: string) => f.endsWith(`.${lang.toLowerCase()}.mdx`));
            
            if (matchingFiles.length > 0) {
              const lessons = matchingFiles.map((file: string) => {
                const fullPath = path.join(courseDir, file);
                const content = fs.readFileSync(/*turbopackIgnore: true*/ fullPath, 'utf-8');
                const slug = file.replace(/\.[a-z]{2}\.mdx$/i, '');
                let order = 999;
                const orderMatch = content.match(/order:\s*(\d+)/);
                if (orderMatch && orderMatch[1]) {
                  order = parseInt(orderMatch[1], 10);
                }
                return { slug, order };
              });
              
              lessons.sort((a: any, b: any) => a.order - b.order);
              return { data: lessons[0].slug, error: null };
            }
          }
        }
      } catch (err) {
        console.error("Error finding first lesson from disk in mock-provider:", err);
      }
    } else {
      const stored = window.localStorage.getItem('openprimer_lessons');
      if (stored) {
        try {
          const lessons = JSON.parse(stored);
          const courseLessons = lessons.filter((l: any) => 
            l.course_slug.toLowerCase() === courseSlug.toLowerCase() && 
            l.lang.toLowerCase() === lang.toLowerCase()
          );
          if (courseLessons.length > 0) {
            courseLessons.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            return { data: courseLessons[0].lesson_slug, error: null };
          }
        } catch (e) {}
      }
    }
    return { data: 'introduction', error: null };
  },

  saveLesson: async (lesson: { course_slug: string, lesson_slug: string, lang: string, title: string, content: string, order?: number }) => {
    if (lesson.title && lesson.title.length > 60) {
      return { data: null, error: new Error(`Lesson title cannot exceed 60 characters (provided title has ${lesson.title.length} characters).`) };
    }
    const cleanCourseSlug = cleanPathSegment(lesson.course_slug);
    const cleanLessonSlug = cleanPathSegment(lesson.lesson_slug);
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_lessons');
      const lessons = stored ? JSON.parse(stored) : [];
      const updated = [
        ...lessons.filter((l: any) => !(l.course_slug === cleanCourseSlug && l.lesson_slug === cleanLessonSlug && l.lang.toLowerCase() === lesson.lang.toLowerCase())),
        {
          ...lesson,
          course_slug: cleanCourseSlug,
          lesson_slug: cleanLessonSlug,
          lang: lesson.lang.toLowerCase()
        }
      ];
      window.localStorage.setItem('openprimer_lessons', JSON.stringify(updated));
      return { data: { ...lesson, course_slug: cleanCourseSlug, lesson_slug: cleanLessonSlug }, error: null };
    }
    return { data: null, error: new Error("Mock offline mode does not support dynamic lessons database saving") };
  },

  getSyllabus: async (id: string) => {
    let course = getMockCourses().find(c => c.slug.toLowerCase() === id.toLowerCase());
    if (!course && (id.toLowerCase() === 'droit_des_entreprises' || id.toLowerCase() === 'difficultes-procedures-collectives')) {
      course = {
        id: 9999,
        title: "Droit des Entreprises",
        slug: "droit_des_entreprises",
        level: "L1",
        subject: "droit_des_entreprises",
        archivingLevel: 0,
        is_active: true,
        isActive: true,
        languages: ['en', 'fr']
      } as any;
    }
    console.log(`[MOCK PROVIDER] getSyllabus called for id/slug: '${id}'. Found course:`, course ? { id: course.id, slug: course.slug, archivingLevel: course.archivingLevel } : null);
    if (course) {
      let mockLevels: Record<string, number> = {};
      if (typeof window === 'undefined') {
        try {
          const { cookies } = require('next/headers');
          const cookieStore = await cookies();
          const levelsCookie = cookieStore.get('op_mock_archiving_levels')?.value;
          console.log(`[MOCK PROVIDER] Server-side op_mock_archiving_levels cookie value:`, levelsCookie);
          if (levelsCookie) {
            mockLevels = JSON.parse(levelsCookie);
          }
        } catch (e: any) {
          console.error(`[MOCK PROVIDER] Server-side cookie retrieval failed:`, e.message);
        }
      } else {
        try {
          const match = document.cookie.match(/op_mock_archiving_levels=([^;]+)/);
          console.log(`[MOCK PROVIDER] Client-side op_mock_archiving_levels match:`, match);
          if (match) {
            mockLevels = JSON.parse(decodeURIComponent(match[1]));
          }
        } catch (e: any) {
          console.error(`[MOCK PROVIDER] Client-side cookie retrieval failed:`, e.message);
        }
      }

      const overrideLvl = mockLevels[String(course.id)];
      console.log(`[MOCK PROVIDER] parsed mockLevels:`, mockLevels, `overrideLvl for course.id ${course.id}:`, overrideLvl);
      if (typeof overrideLvl === 'number') {
        course = {
          ...course,
          archivingLevel: overrideLvl,
          is_active: overrideLvl < 2,
          isActive: overrideLvl < 2
        };
        console.log(`[MOCK PROVIDER] Overrode course archivingLevel to:`, overrideLvl);
      }
    }
    return { data: course || null, error: null };
  },
  
  getAllCourses: async () => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_courses');
      if (stored) {
        try {
          setMockCourses(JSON.parse(stored));
        } catch (e) {}
      }
    }

    let mockLevels: Record<string, number> = {};
    if (typeof window === 'undefined') {
      try {
        const { cookies } = require('next/headers');
        const cookieStore = await cookies();
        const levelsCookie = cookieStore.get('op_mock_archiving_levels')?.value;
        if (levelsCookie) {
          mockLevels = JSON.parse(levelsCookie);
        }
      } catch (e: any) {}
    } else {
      try {
        const match = document.cookie.match(/op_mock_archiving_levels=([^;]+)/);
        if (match) {
          mockLevels = JSON.parse(decodeURIComponent(match[1]));
        }
      } catch (e: any) {}
    }

    const computedCourses = getMockCourses()
      .filter(c => !/test/i.test(c.slug))
      .map(c => {
      const feedbacks = getCourseFeedbacks().filter(f => {
        const fId = String(f.courseId).toLowerCase();
        const currentSlug = c.slug.toLowerCase();
        return fId === currentSlug || fId.replace(/_(v\d+|version\d+)/g, '') === currentSlug;
      });
      
      const ratingCount = feedbacks.length;
      const averageRating = ratingCount > 0
        ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / ratingCount
        : 0;

      const courseCompletions = getCourseCompletionsList().filter(comp => {
        const compId = comp.courseId.toLowerCase();
        const currentSlug = c.slug.toLowerCase();
        const currentId = String(c.id).toLowerCase();
        const currentTitle = c.title.toLowerCase();
        return compId === currentId || compId === currentSlug || compId === currentTitle || compId.replace(/_(v\d+|version\d+)/g, '') === currentSlug;
      });
      const totalValidations = courseCompletions.length;

      let course = {
        ...c,
        credits: (c.ects || 6) * 100,
        validations: totalValidations > 0 ? totalValidations : (c.validations || 0),
        ratingCount,
        averageRating
      };

      const overrideLvl = mockLevels[String(course.id)];
      if (typeof overrideLvl === 'number') {
        course = {
          ...course,
          archivingLevel: overrideLvl,
          is_active: overrideLvl < 2,
          isActive: overrideLvl < 2
        };
      }

      return course;
    });

    if (!computedCourses.some(c => c.slug === 'droit_des_entreprises')) {
      computedCourses.push({
        id: 9999,
        title: "Droit des Entreprises",
        slug: "droit_des_entreprises",
        level: "L1",
        subject: "droit_des_entreprises",
        archivingLevel: 0,
        is_active: true,
        isActive: true,
        languages: ['en', 'fr'],
        credits: 600,
        validations: 10,
        ratingCount: 5,
        averageRating: 4.8
      } as any);
    }

    return { data: computedCourses, error: null };
  },

  getPipelineQueue: async () => {
    if (typeof window !== 'undefined') {
      const q = window.localStorage.getItem('openprimer_pipeline_queue');
      return { data: q ? JSON.parse(q) : [], error: null };
    }
    return { data: [], error: null };
  },

  savePipelineQueue: async (queue: any[]) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(queue));
    }
    return { data: queue, error: null };
  },

};
