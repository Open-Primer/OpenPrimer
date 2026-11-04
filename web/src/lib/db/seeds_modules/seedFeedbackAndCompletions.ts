import {
  UserProfile, MockCourse, SyllabusNode, ReportCluster, UV,
  SearchHistoryItem, StyledBadgeImage, TranslationRequestEntry,
  RefusedCourseEntry, ContactFeedback, CourseCompletionEntry,
  TranslationEmailNotification, LanguageInfo, RefusedTranslationEntry,
  RefusedRevisionEntry, CourseFeedback, TutorPersonality, AgentMetric
} from '../types';

export const initialTranslationRequests: TranslationRequestEntry[] = [
  { id: 'tp1', courseTitle: "Constitutional Law", sourceLang: "en", targetLang: "es", timestamp: new Date(2026, 5, 21).toISOString(), count: 14 },
  { id: 'tp2', courseTitle: "Cell Biology", sourceLang: "en", targetLang: "de", timestamp: new Date(2026, 5, 21).toISOString(), count: 9 },
  { id: 'tp3', courseTitle: "Microeconomics", sourceLang: "en", targetLang: "zh", timestamp: new Date(2026, 5, 21).toISOString(), count: 5 }
];

export const initialRefusedCourses: RefusedCourseEntry[] = [
  { id: 'ref_c1', name: "Advanced Thermodynamics", subject: "Physics", searches: 1, priority: "Low", previouslyRefused: true, timestamp: new Date(2026, 5, 1).toISOString() }
];

export const initialContactFeedbacks: ContactFeedback[] = [
  { id: 'fb_1', name: 'Dr. Evelyn Carter', email: 'evelyn.carter@mit.edu', message: 'Hello! I noticed a typo in the Newtonian Dynamics module under Class 1. The discrete Laplacian is missing a negative coefficient in equation 4. Great app otherwise!', timestamp: new Date(2026, 5, 16).toISOString() },
  { id: 'fb_2', name: 'Jean-Pierre Laurent', email: 'jp.laurent@sorbonne.fr', message: 'Félicitations pour la qualité des cours ! Est-il possible d\'ajouter un module d\'électrostatique pour le niveau L2 ? Nos étudiants apprécieraient beaucoup.', timestamp: new Date(2026, 5, 7).toISOString() },
  { id: 'fb_3', name: 'Aleksei Volkov', email: 'avolkov@itmo.ru', message: 'Are you planning to release a mobile application? The responsive web UI is fantastic, but offline study is crucial for transit.', timestamp: new Date(2026, 5, 7).toISOString() }
];

export const generatePreseededCourseCompletions = (): CourseCompletionEntry[] => {
  const completions: CourseCompletionEntry[] = [];
  
  for (let i = 0; i < 10; i++) {
    completions.push({
      id: `comp_bio_rec_${i}`,
      courseId: 'Biologie_Test',
      timestamp: new Date(2026, 5, 19).toISOString()
    });
  }
  for (let i = 0; i < 5; i++) {
    completions.push({
      id: `comp_bio_old_${i}`,
      courseId: 'Biologie_Test',
      timestamp: new Date(2026, 4, 10).toISOString()
    });
  }

  for (let i = 0; i < 18; i++) {
    completions.push({
      id: `comp_math_rec_${i}`,
      courseId: 'Maths_Test',
      timestamp: new Date(2026, 5, 19).toISOString()
    });
  }
  for (let i = 0; i < 7; i++) {
    completions.push({
      id: `comp_math_old_${i}`,
      courseId: 'Maths_Test',
      timestamp: new Date(2026, 4, 10).toISOString()
    });
  }

  for (let i = 0; i < 22; i++) {
    completions.push({
      id: `comp_calc_rec_${i}`,
      courseId: 'Maths_Test_L1',
      timestamp: new Date(2026, 5, 19).toISOString()
    });
  }
  for (let i = 0; i < 10; i++) {
    completions.push({
      id: `comp_calc_old_${i}`,
      courseId: 'Maths_Test_L1',
      timestamp: new Date(2026, 4, 10).toISOString()
    });
  }

  return completions;
};

export const translationEmailsList: TranslationEmailNotification[] = [
  { id: 'em_1', courseTitle: 'Classical Mechanics', targetLang: 'es', email: 'physics_student@openprimer.app', timestamp: new Date(2026, 5, 16).toISOString() },
  { id: 'em_2', courseTitle: 'Cell Biology', targetLang: 'de', email: 'bio_scholar@openprimer.de', timestamp: new Date(2026, 2, 18).toISOString() }
];

export const initialLanguages: LanguageInfo[] = [
  { code: 'EN', flag: '🇺🇸', label: 'English' },
  { code: 'FR', flag: '🇫🇷', label: 'Français' },
  { code: 'ES', flag: '🇪🇸', label: 'Español' },
  { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'ZH', flag: '🇨🇳', label: '中文' },
  { code: 'PT', flag: '🇧🇷', label: 'Português' },
  { code: 'AR', flag: '🇸🇦', label: 'العربية' },
  { code: 'HI', flag: '🇮🇳', label: 'हिन्दी' },
  { code: 'UR', flag: '🇵🇰', label: 'اردو' }
];

export const initialRefusedTranslations: RefusedTranslationEntry[] = [
  { id: 'ref_t1', name: "Constitutional Law", sourceLang: "en", targetLang: "de", requests: 1, priority: "Low", previouslyRefused: true, timestamp: new Date(2026, 5, 1).toISOString() }
];

export const initialRefusedRevisions: RefusedRevisionEntry[] = [
  { id: 'ref_r1', course: "Quantum Physics", issueSummary: "Incorrect Bohr model details in chapter 2 quiz.", count: 1, status: "Pending", aiProposal: "Update quiz content and adjust Bohr constant calculations.", previouslyRefused: true, priority: "Low", timestamp: new Date(2026, 5, 1).toISOString() }
];

export const initialCourseFeedbacks: CourseFeedback[] = [
  { id: 'cf_1', courseId: 'Classical_Mechanics', rating: 2, comment: 'Lagrangian mechanics needs more derivations.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },
  { id: 'cf_2', courseId: 'Classical_Mechanics', rating: 3, comment: 'Clarify the kinetic energy proofs.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },
  { id: 'cf_3', courseId: 'Classical_Mechanics', rating: 2, comment: 'Add more practice exercises at the end.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },
  { id: 'cf_4', courseId: 'Classical_Mechanics', rating: 1, comment: 'The math explanation of Coriolis forces is very hard to follow.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },
  { id: 'cf_5', courseId: 'Classical_Mechanics', rating: 3, comment: 'The diagrams are good but the text has some typos.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },
  { id: 'cf_6', courseId: 'Classical_Mechanics', rating: 2, comment: 'Too much theory, need more practical physics examples.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },
  { id: 'cf_7', courseId: 'Classical_Mechanics', rating: 2, comment: 'Lagrangian derivation is too fast.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },
  { id: 'cf_8', courseId: 'Classical_Mechanics', rating: 3, comment: 'Please expand on Hamiltonian differences.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },
  { id: 'cf_9', courseId: 'Classical_Mechanics', rating: 2, comment: 'Helpful but could be structured better.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },
  { id: 'cf_10', courseId: 'Classical_Mechanics', rating: 3, comment: 'The exercises are too simple compared to the content.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },
  { id: 'cf_11', courseId: 'Classical_Mechanics', rating: 2, comment: 'Too fast paced.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },
  { id: 'cf_12', courseId: 'Classical_Mechanics', rating: 2, comment: 'Could use a review video link.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: false },

  { id: 'cf_pt2_1', courseId: 'Physique_Test_L2', rating: 4, comment: 'Great overview of quantum principles, very clear.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_pt2_2', courseId: 'Physique_Test_L2', rating: 5, comment: 'Excellent course structure, loved the lab sections.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_pt2_3', courseId: 'Physique_Test_L2', rating: 4, comment: 'Well-paced but could add a few more examples.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_pt2_4', courseId: 'Physique_Test_L2', rating: 3, comment: 'Some chapters are harder to follow without prerequisites.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_pt2_5', courseId: 'Physique_Test_L2', rating: 4, comment: 'Really enjoyed the problem sets in this course.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_pt2_6', courseId: 'Physique_Test_L2', rating: 5, comment: 'Thorough and well-explained wave mechanics chapter.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_pt2_7', courseId: 'Physique_Test_L2', rating: 4, comment: 'Good balance between theory and exercises.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },

  { id: 'cf_bt_1', courseId: 'Biologie_Test', rating: 5, comment: 'Fantastic explanations of the cell cycle!', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_bt_2', courseId: 'Biologie_Test', rating: 5, comment: 'The ATP synthesis section is the best I have seen.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_bt_3', courseId: 'Biologie_Test', rating: 4, comment: 'Really comprehensive, minor grammar issues.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_bt_4', courseId: 'Biologie_Test', rating: 5, comment: 'Loved the interactive diagrams.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_bt_5', courseId: 'Biologie_Test', rating: 5, comment: 'Could teach this to anyone after completing it.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_bt_6', courseId: 'Biologie_Test', rating: 4, comment: 'Very good, the lipid bilayer section is excellent.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },

  { id: 'cf_btl1_1', courseId: 'Biologie_Test_L1', rating: 4, comment: 'Great introduction to molecular genetics.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_btl1_2', courseId: 'Biologie_Test_L1', rating: 5, comment: 'DNA transcription section is very well done.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_btl1_3', courseId: 'Biologie_Test_L1', rating: 4, comment: 'Clear and concise for L1 level.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_btl1_4', courseId: 'Biologie_Test_L1', rating: 4, comment: 'Good course but could use more practice quizzes.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_btl1_5', courseId: 'Biologie_Test_L1', rating: 5, comment: 'Best L1 biology course I have taken online.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_btl1_6', courseId: 'Biologie_Test_L1', rating: 3, comment: 'Some replication diagrams are a bit small.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },

  { id: 'cf_dt_1', courseId: 'Droit_Test', rating: 4, comment: 'Good overview of constitutional principles.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_dt_2', courseId: 'Droit_Test', rating: 3, comment: 'Could be clearer on separation of powers.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_dt_3', courseId: 'Droit_Test', rating: 4, comment: 'Enjoyed the case studies section.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_dt_4', courseId: 'Droit_Test', rating: 3, comment: 'Some concepts need more real examples.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_dt_5', courseId: 'Droit_Test', rating: 4, comment: 'Well-structured and easy to follow.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_dt_6', courseId: 'Droit_Test', rating: 3, comment: 'Content is OK but exercises are too few.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_dt_7', courseId: 'Droit_Test', rating: 4, comment: 'Good coverage of sovereignty concepts.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },

  { id: 'cf_dtl2_1', courseId: 'Droit_Test_L2', rating: 4, comment: 'Good treatment of criminal liability concepts.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_dtl2_2', courseId: 'Droit_Test_L2', rating: 4, comment: 'Very relevant case examples for L2 students.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_dtl2_3', courseId: 'Droit_Test_L2', rating: 3, comment: 'The offense chapter needs more depth.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_dtl2_4', courseId: 'Droit_Test_L2', rating: 4, comment: 'Clear explanations of general principles.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_dtl2_5', courseId: 'Droit_Test_L2', rating: 5, comment: 'Exceptional course for criminal law introduction.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_dtl2_6', courseId: 'Droit_Test_L2', rating: 3, comment: 'A bit dry in places but solid content overall.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },

  { id: 'cf_mt_1', courseId: 'Maths_Test', rating: 5, comment: 'Best linear algebra content I have found.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_mt_2', courseId: 'Maths_Test', rating: 4, comment: 'Vector spaces chapter is excellent.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_mt_3', courseId: 'Maths_Test', rating: 5, comment: 'Matrix operations are explained very clearly.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_mt_4', courseId: 'Maths_Test', rating: 4, comment: 'Coordinate maps section could use more examples.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_mt_5', courseId: 'Maths_Test', rating: 4, comment: 'Very rigorous and academically accurate.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_mt_6', courseId: 'Maths_Test', rating: 5, comment: 'Loved the visual proofs for eigenvectors.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },

  { id: 'cf_mtl1_1', courseId: 'Maths_Test_L1', rating: 5, comment: 'Perfect introduction to calculus for L1.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_mtl1_2', courseId: 'Maths_Test_L1', rating: 5, comment: 'Derivatives explained better than my textbook.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_mtl1_3', courseId: 'Maths_Test_L1', rating: 5, comment: 'Limit calculations are crystal clear.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_mtl1_4', courseId: 'Maths_Test_L1', rating: 4, comment: 'Great course, would love an L2 continuation.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_mtl1_5', courseId: 'Maths_Test_L1', rating: 5, comment: 'Integral proofs are shown step by step - amazing.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_mtl1_6', courseId: 'Maths_Test_L1', rating: 5, comment: 'Highly recommend this to any first-year student.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },

  { id: 'cf_ct_1', courseId: 'organic-chemistry', rating: 3, comment: 'Stereochemistry is explained well but rushed.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_ct_2', courseId: 'organic-chemistry', rating: 3, comment: 'Reaction mechanisms need more visualizations.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_ct_3', courseId: 'organic-chemistry', rating: 4, comment: 'Good foundation for organic chemistry.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_ct_4', courseId: 'organic-chemistry', rating: 2, comment: 'The SN1/SN2 chapter is confusing without more examples.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_ct_5', courseId: 'organic-chemistry', rating: 4, comment: 'Nomenclature section is clear and helpful.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_ct_6', courseId: 'organic-chemistry', rating: 3, comment: 'Average course, content is correct but presentation dry.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_ct_7', courseId: 'organic-chemistry', rating: 3, comment: 'Wish there were more interactive exercises.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },

  { id: 'cf_et_1', courseId: 'Economie_Test', rating: 4, comment: 'Great introduction to oligopoly dynamics.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_et_2', courseId: 'Economie_Test', rating: 4, comment: 'Consumer choices chapter is very well done.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_et_3', courseId: 'Economie_Test', rating: 3, comment: 'Market competition section needs more real-world data.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_et_4', courseId: 'Economie_Test', rating: 4, comment: 'Enjoyed the game theory examples.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_et_5', courseId: 'Economie_Test', rating: 3, comment: 'Graphs could be more interactive.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_et_6', courseId: 'Economie_Test', rating: 4, comment: 'Solid fundamentals for L1 economics.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_et_7', courseId: 'Economie_Test', rating: 4, comment: 'Very relevant examples from current markets.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_et_8', courseId: 'Economie_Test', rating: 3, comment: 'Could use more exercises on price elasticity.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },

  { id: 'cf_st_1', courseId: 'Statistics', rating: 5, comment: 'Best statistics course available online at this level.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_st_2', courseId: 'Statistics', rating: 5, comment: 'Probability chapter is absolutely excellent.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_st_3', courseId: 'Statistics', rating: 4, comment: 'Inferential statistics is clear and well-structured.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_st_4', courseId: 'Statistics', rating: 5, comment: 'The descriptive stats section with real data is great.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_st_5', courseId: 'Statistics', rating: 4, comment: 'Very comprehensive and well-paced for L1.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_st_6', courseId: 'Statistics', rating: 5, comment: 'Hypothesis testing is explained so intuitively.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true },
  { id: 'cf_st_7', courseId: 'Statistics', rating: 4, comment: 'Would appreciate more worked examples in chapter 3.', timestamp: new Date(2026, 5, 21).toISOString(), isTreated: true }
];

