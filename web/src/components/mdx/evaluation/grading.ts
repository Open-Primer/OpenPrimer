export const GRADING_SYSTEM_LABELS: Record<string, Record<string, string>> = {
  '0/20': {
    EN: 'Score out of 20 (AI Tutor grading and personalized feedback)',
    FR: 'Note sur 20 (Correction et évaluation personnalisée par le Tuteur IA)',
    ES: 'Calificación sobre 20 (Corrección y evaluación personalizada por el Tutor IA)',
    DE: 'Bewertung auf einer Skala von 0 bis 20 (Korrektur und Feedback durch den KI-Tutor)',
    ZH: '20分制评分（由人工智能导师进行个性化批改与评估）',
    PT: 'Nota de 0 a 20 (Correção e avaliação personalizada pelo Tutor IA)',
    AR: 'درجة من 20 (تصحيح وتقييم مخصص بواسطة المعلم الذكي)',
    HI: '20 में से स्कोर (एआई ट्यूटर द्वारा ग्रेडिंग और व्यक्तिगत फीडबैक)',
    UR: '20 میں سے اسکور (اے آئی ٹیوٹر کے ذریعے پرسنلائزڈ فیڈ بیک)'
  },
  '0/10': {
    EN: 'Score out of 10 (AI Tutor grading and personalized feedback)',
    FR: 'Note sur 10 (Correction et évaluation personnalisée par le Tuteur IA)',
    ES: 'Calificación sobre 10 (Corrección y evaluación personalizada por el Tutor IA)',
    DE: 'Bewertung auf einer Skala von 0 bis 10 (Korrektur und Feedback durch den KI-Tutor)',
    ZH: '10分制评分（由人工智能导师进行个性化批改与评估）',
    PT: 'Nota de 0 a 10 (Correção e avaliação personalizada pelo Tutor IA)',
    AR: 'درجة من 10 (تصحيح وتقييم مخصص بواسطة المعلم الذكي)',
    HI: '10 में से स्कोर (एआई ट्यूटर द्वारा ग्रेडिंग और व्यक्तिगत फीडबैक)',
    UR: '10 میں سے اسکور (اے آئی ٹیوٹر کے ذریعے پرسنلائزڈ فیڈ بیک)'
  },
  'A-F': {
    EN: 'Letter grades A to F (AI Tutor grading and personalized feedback)',
    FR: 'Lettres de A à F (Correction et évaluation personnalisée par le Tuteur IA)',
    ES: 'Letras de A a F (Corrección y evaluación personalizada por el Tutor IA)',
    DE: 'Noten A bis F (Korrektur und Feedback durch den KI-Tutor)',
    ZH: 'A-F 等级制（由人工智能导师进行个性化批改与评估）',
    PT: 'Classificação por letras A a F (Correção e avaliação personalizada pelo Tutor IA)',
    AR: 'درجات الحروف من A إلى F (تصحيح وتقييم مخصص بواسطة المعلم الذكي)',
    HI: 'A से F तक ग्रेड (एआई ट्यूटर द्वारा ग्रेडिंग और व्यक्तिगत फीडबैक)',
    UR: 'A تا F گریڈز (اے آئی ٹیوٹر کے ذریعے پرسنلائزڈ فیڈ بیک)'
  },
  'pass-fail': {
    EN: 'Pass or Fail (AI Tutor grading and personalized feedback)',
    FR: 'Admis ou Ajourné (Correction et évaluation personnalisée par le Tuteur IA)',
    ES: 'Aprobado o Reprobado (Corrección y evaluación personalizada por el Tutor IA)',
    DE: 'Bestanden oder Nicht bestanden (Korrektur und Feedback durch den KI-Tutor)',
    ZH: '及格/不及格（由人工智能导师进行个性化批改与评估）',
    PT: 'Aprovado ou Reprovado (Correção e avaliação personalizada pelo Tutor IA)',
    AR: 'ناجح أو راسب (تصحيح وتقييم مخصص بواسطة المعلم الذكي)',
    HI: 'उत्तीर्ण या अनुत्तीर्ण (एआई ट्यूटर द्वारा ग्रेडिंग और व्यक्तिगत फीडबैक)',
    UR: 'پاس یا فیل (اے آئی ٹیوٹر کے ذریعے پرسنلائزڈ فیڈ بیک)'
  }
};

export const formatGradingSystem = (system: string, lang: string): string => {
  const lUpper = (lang || 'EN').toUpperCase();
  const sysMap = GRADING_SYSTEM_LABELS[system];
  if (!sysMap) return system;
  return sysMap[lUpper] || sysMap.EN || system;
};
