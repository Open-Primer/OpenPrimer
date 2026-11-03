import { Achievement } from '../types';

export const DEFAULT_INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    name: "Fast Learner",
    description: "Completed a course in <= 3 days of enrollment",
    threshold: "3 days",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_2",
    translations: {
      fr: { name: "Apprenti Rapide", description: "Terminer un cours en moins de 3 jours" }
    }
  },
  {
    id: 2,
    name: "Socratic Companion",
    description: "Asked 50 questions to the Socratic Tutor",
    threshold: "50 questions",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_25",
    translations: {
      fr: { name: "Compagnon Socratique", description: "Poser 50 questions au Tuteur Socratique" }
    }
  },
  {
    id: 3,
    name: "Socratic Sage",
    description: "Asked 100 questions to the Socratic Tutor",
    threshold: "100 questions",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_28",
    translations: {
      fr: { name: "Sage Socratique", description: "Poser 100 questions au Tuteur Socratique" }
    }
  },
  {
    id: 4,
    name: "Persistent Student",
    description: "Maintained a 7-day streak",
    threshold: "7 day streak",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_4",
    translations: {
      fr: { name: "Étudiant Persistant", description: "Maintenir une série d'apprentissage de 7 jours" }
    }
  },
  {
    id: 5,
    name: "Perfect Score",
    description: "Scored 100% on any course assessment",
    threshold: "100% score",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_3",
    translations: {
      fr: { name: "Score Parfait", description: "Obtenir 100% de bonnes réponses à une évaluation" }
    }
  },
  {
    id: 6,
    name: "Nocturnal Scholar",
    description: "Completed 5 night sessions (22:00 to 05:00)",
    threshold: "5 night sessions",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_7",
    translations: {
      fr: { name: "Savant Nocturne", description: "Terminer 5 sessions d'apprentissage de nuit (22h à 5h)" }
    }
  },
  {
    id: 7,
    name: "Morning Owl",
    description: "Completed 5 morning sessions (05:00 to 08:00)",
    threshold: "5 morning sessions",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_6",
    translations: {
      fr: { name: "Hibou du Matin", description: "Terminer 5 sessions d'apprentissage le matin (5h à 8h)" }
    }
  },
  {
    id: 8,
    name: "Curriculum Architect",
    description: "Created 1 custom syllabus",
    threshold: "1 curriculum",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_49",
    translations: {
      fr: { name: "Architecte du Programme", description: "Créer un syllabus personnalisé" }
    }
  },
  {
    id: 9,
    name: "Feedback Contributor",
    description: "Submitted 1 course feedback",
    threshold: "1 feedback",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_11",
    translations: {
      fr: { name: "Contributeur de Retours", description: "Soumettre un retour d'expérience sur un cours" }
    }
  },
  {
    id: 10,
    name: "Sovereign Scholar",
    description: "Completed 5 courses successfully",
    threshold: "5 courses",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_8",
    translations: {
      fr: { name: "Savant Souverain", description: "Terminer 5 cours avec succès" }
    },
    evaluationRule: {
      logicalOperator: "and",
      conditions: [{ metric: "completed_courses_count", operator: ">=", value: 5 }]
    }
  },
  {
    id: 11,
    name: "Explorer of Minds",
    description: "Completed 3 courses successfully",
    threshold: "3 courses",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_17",
    translations: {
      fr: { name: "Explorateur d'Esprits", description: "Terminer 3 cours avec succès" }
    },
    evaluationRule: {
      logicalOperator: "and",
      conditions: [{ metric: "completed_courses_count", operator: ">=", value: 3 }]
    }
  },
  {
    id: 12,
    name: "Polyglot Academic",
    description: "Enrolled in at least 2 courses",
    threshold: "2 enrolled courses",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_22",
    translations: {
      fr: { name: "Polyglotte Académique", description: "S'inscrire à au moins 2 cours" }
    },
    evaluationRule: {
      logicalOperator: "and",
      conditions: [{ metric: "enrolled_courses_count", operator: ">=", value: 2 }]
    }
  },
  {
    id: 13,
    name: "Alchemist of Knowledge",
    description: "Completed at least 10 lessons",
    threshold: "10 lessons completed",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_40",
    translations: {
      fr: { name: "Alchimiste du Savoir", description: "Terminer au moins 10 leçons" }
    },
    evaluationRule: {
      logicalOperator: "and",
      conditions: [{ metric: "lessons_viewed_count", operator: ">=", value: 10 }]
    }
  },
  {
    id: 14,
    name: "Scientific Pioneer",
    description: "Completed your first course successfully",
    threshold: "1 completed course",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_45",
    translations: {
      fr: { name: "Pionnier Scientifique", description: "Terminer votre tout premier cours" }
    },
    evaluationRule: {
      logicalOperator: "and",
      conditions: [{ metric: "completed_courses_count", operator: ">=", value: 1 }]
    }
  },
  {
    id: 15,
    name: "Socratic Master",
    description: "Asked 200 questions to the Socratic Tutor",
    threshold: "200 questions",
    count: 0,
    status: "locked",
    startDate: null,
    endDate: null,
    icon: "img_47",
    translations: {
      fr: { name: "Maître Socratique", description: "Poser 200 questions au tuteur Socratique" }
    },
    evaluationRule: {
      logicalOperator: "and",
      conditions: [{ metric: "tutor_question_count", operator: ">=", value: 200 }]
    }
  }
];

export interface SystemParameter {
  key: string;
  value: string;
}

export const DEFAULT_SYSTEM_PARAMETERS: SystemParameter[] = [
  { key: 'autoApprove', value: 'false' },
  { key: 'threshold', value: '5' },
  { key: 'autoApproveDelayHours', value: '24' },
  { key: 'reevaluationDays', value: '15' },
  { key: 'validationsThreshold', value: '5' },
  { key: 'backlogRetention', value: '30' },
  { key: 'autoTranslate', value: 'false' },
  { key: 'transThreshold', value: '3' },
  { key: 'autoTranslateDelayHours', value: '24' },
  { key: 'transValidationsThreshold', value: '5' },
  { key: 'transReevaluationDays', value: '15' },
  { key: 'transBacklogRetention', value: '30' },
  { key: 'autoRevision', value: 'false' },
  { key: 'revThreshold', value: '2.5' },
  { key: 'revMinVotes', value: '5' },
  { key: 'revMinReports', value: '3' },
  { key: 'revRetentionDays', value: '30' },
  { key: 'autoRevisionDelayHours', value: '24' },
  { key: 'queueAutoRetry', value: 'false' },
  { key: 'queueAutoRetryDelayHours', value: '24' },
  { key: 'queueRetentionDays', value: '30' }
];

export const DEFAULT_PIPELINE_QUEUE = [
      {
        id: "task-biophysics-1",
        title: "Biophysique neuronale et modélisation neuro-computationnelle",
        type: "generation",
        status: "completed",
        priority: "high",
        progress: 100,
        timestamp: "2026-06-21T19:58:03.813Z",
        completedAt: "2026-06-21T19:58:33.813Z",
        targetLang: "FR",
        level: "advanced",
        details: "Syllabus generation and interactive lesson templates for neuronal biophysics.",
        logs: [
          "[SYSTEM] Initiating biophysics generation...",
          "[SYSTEM] Assembling semantic structures...",
          "[SYSTEM] Finished generating 8 pedagogical modules successfully."
        ]
      },
      {
        id: "task-translation-2",
        title: "Chimie Organique (FR)",
        type: "translation",
        status: "completed",
        priority: "medium",
        progress: 100,
        timestamp: "2026-06-21T21:00:00.000Z",
        completedAt: "2026-06-21T21:02:30.000Z",
        targetLang: "FR",
        level: "beginner",
        details: "Translating course structure from English to French.",
        logs: [
          "[SYSTEM] Translating modules...",
          "[SYSTEM] Translated Organic Chemistry to French successfully."
        ]
      },
      {
        id: "task-revision-3",
        title: "Histoire de l'art - Revise: La Renaissance",
        type: "revision",
        status: "failed",
        priority: "low",
        progress: 45,
        timestamp: "2026-06-21T22:30:00.000Z",
        completedAt: "2026-06-21T22:32:00.000Z",
        targetLang: "FR",
        level: "intermediate",
        details: "Pedagogical revision on lesson contents.",
        logs: [
          "[SYSTEM] Checking pedagogical alignment...",
          "[ERROR] Network connection timeout during AI evaluation."
        ]
      }
    ];
