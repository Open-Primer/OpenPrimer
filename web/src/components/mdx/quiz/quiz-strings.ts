/**
 * OpenPrimer - Quiz UI Localized String Mappings & 9-Language Dictionaries
 */

export function getQuizStrings(dict: Record<string, any>) {
  return {
    title: dict.quiz_title,
    start: dict.quiz_start,
    desc: dict.quiz_desc,
    time_limit: dict.quiz_time_limit,
    time_remaining: dict.quiz_time_remaining,
    time_expired: dict.quiz_time_expired,
    completed: dict.quiz_completed,
    retry: dict.quiz_retry,
    next: dict.quiz_next,
    submit: dict.quiz_submit,
    final_score: dict.quiz_final_score,
    passed: dict.quiz_passed,
    failed: dict.quiz_failed,
    seconds: dict.quiz_seconds,
    minutes: dict.quiz_minutes,
    hours: dict.quiz_hours,
    tutor_feedback: dict.quiz_tutor_feedback,
    tutor_analyzing: dict.quiz_tutor_analyzing,
    rules_title: dict.quiz_rules_title,
    prep_advice: dict.quiz_prep_advice,
    speed_mode_title: dict.quiz_speed_mode_title,
    speed_mode_desc: dict.quiz_speed_mode_desc,
    summative_single_attempt_warning: dict.quiz_summative_single_attempt_warning || "Single attempt test.",
    eval_attempts_unlimited: dict.quiz_eval_attempts_unlimited || "Unlimited practice attempts."
  };
}

export interface QuizCoverLabels {
  questionsLabel: (n: number) => string;
  timerWarning: (pct: string, time: string) => string;
  rulesTitle: string;
  calculator: (allowed: boolean) => string;
  documents: (allowed: boolean) => string;
  webBrowsing: (allowed: boolean) => string;
  aiTutor: (allowed: boolean) => string;
  honorNote: string;
  formatExpected: string;
  scoring: (total: number) => string;
  duration: (dur: string) => string;
  prepAdvice: string;
  eliminationAlert: string;
  multipleAnswers: string;
  audioClip: string;
  validateAnswers: string;
  yourAnswer: string;
  noAnswer: string;
  correctAnswer: string;
  gradeLabel: string;
  hideAnswers: string;
  showAnswers: string;
  tutorFeedbackTitle: string;
  tutorAnalyzing: string;
  questionOf: (current: number, total: number) => string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  feedbackTimeout: string;
}

export const QUIZ_LOCALES: Record<string, QuizCoverLabels> = {
  EN: {
    timerWarning: (pct, time) => `⏳ Warning! Less than ${pct} of the allocated time is left (${time} remaining). Hurry up to answer!`,
    questionsLabel: (n) => `📝 ${n} multiple-choice question(s)`,
    rulesTitle: "📋 Rules & Assessment Materials",
    calculator: (a) => `Calculator ${a ? "Allowed" : "Prohibited"}`,
    documents: (a) => `Documents ${a ? "Allowed" : "Prohibited"}`,
    webBrowsing: (a) => `Web Browsing ${a ? "Allowed" : "Prohibited"}`,
    aiTutor: (a) => `AI Tutor ${a ? "Enabled" : "Disabled"}`,
    honorNote: "Note: Even without physical proctoring, you must respect these exam modalities.",
    formatExpected: "Expected answer format: Single choice or multiple choice",
    scoring: (tot) => `Grading: Score out of ${tot} (in %)`,
    duration: (d) => `Duration: ${d || 'Unlimited'}`,
    prepAdvice: "Make sure you have slightly more time than necessary to complete the questions.",
    eliminationAlert: "⚠️ Elimination of incorrect choices",
    multipleAnswers: "☑ Multiple answers possible",
    audioClip: "Audio Clip",
    validateAnswers: "Submit my answers",
    yourAnswer: "Your answer:",
    noAnswer: "No answer (time expired)",
    correctAnswer: "Correct answer:",
    gradeLabel: "GRADE",
    hideAnswers: "Hide Answers",
    showAnswers: "Show Answers",
    tutorFeedbackTitle: "Tutor Feedback",
    tutorAnalyzing: "The tutor is analyzing your results...",
    questionOf: (c, t) => `Question ${c} of ${t}`,
    feedbackCorrect: "✓ Correct!",
    feedbackIncorrect: "✖ Incorrect!",
    feedbackTimeout: "⏳ Time is up!"
  },
  FR: {
    timerWarning: (pct, time) => `⏳ Attention ! Il reste moins de ${pct} du temps imparti (${time} restants). Hâtez-vous de répondre !`,
    questionsLabel: (n) => `📝 ${n} question(s) à choix multiple`,
    rulesTitle: "📋 Consignes & Matériaux de l'épreuve",
    calculator: (a) => `Calculatrice ${a ? "Autorisée" : "Interdite"}`,
    documents: (a) => `Documents ${a ? "Autorisés" : "Interdits"}`,
    webBrowsing: (a) => `Navigation Web ${a ? "Autorisée" : "Interdite"}`,
    aiTutor: (a) => `Tuteur IA ${a ? "Actif" : "Désactivé"}`,
    honorNote: "Note : Même s'il n'y a pas de contrôle physique, vous devez respecter ces modalités d'examen.",
    formatExpected: "Format de réponse attendu : Choix unique ou choix multiple",
    scoring: (tot) => `Barème : Score sur ${tot} (en %)`,
    duration: (d) => `Durée : ${d || 'Illimitée'}`,
    prepAdvice: "Assurez-vous d'avoir un peu plus de temps que nécessaire pour répondre aux questions.",
    eliminationAlert: "⚠️ Élimination des fausses affirmations",
    multipleAnswers: "☑ Plusieurs réponses possibles",
    audioClip: "Extrait Audio",
    validateAnswers: "Valider mes réponses",
    yourAnswer: "Votre réponse :",
    noAnswer: "Aucune réponse (temps écoulé)",
    correctAnswer: "Bonne réponse :",
    gradeLabel: "NOTE",
    hideAnswers: "Masquer les réponses",
    showAnswers: "Voir les réponses",
    tutorFeedbackTitle: "Commentaire du Tuteur",
    tutorAnalyzing: "Le tuteur analyse vos résultats...",
    questionOf: (c, t) => `Question ${c} sur ${t}`,
    feedbackCorrect: "✓ Correct !",
    feedbackIncorrect: "✖ Incorrect !",
    feedbackTimeout: "⏳ Temps écoulé !"
  },
  ES: {
    timerWarning: (pct, time) => `⏳ ¡Atención! Queda menos del ${pct} del tiempo asignado (${time} restantes). ¡Dése prisa para responder!`,
    questionsLabel: (n) => `📝 ${n} pregunta(s) de opción múltiple`,
    rulesTitle: "📋 Instrucciones y materiales del examen",
    calculator: (a) => `Calculadora ${a ? "Permitida" : "Prohibida"}`,
    documents: (a) => `Documentos ${a ? "Permitidos" : "Prohibidos"}`,
    webBrowsing: (a) => `Navegación Web ${a ? "Permitida" : "Prohibida"}`,
    aiTutor: (a) => `Tutor IA ${a ? "Activo" : "Desactivado"}`,
    honorNote: "Nota: Aunque no haya supervisión física, debe respetar estas modalidades de examen.",
    formatExpected: "Formato de respuesta esperado: Selección única o múltiple",
    scoring: (tot) => `Calificación: Puntuación sobre ${tot} (en %)`,
    duration: (d) => `Duración: ${d || 'Ilimitada'}`,
    prepAdvice: "Asegúrese de tener un poco más de tiempo del necesario para responder a las preguntas.",
    eliminationAlert: "⚠️ Eliminación de afirmaciones falsas",
    multipleAnswers: "☑ Varias respuestas posibles",
    audioClip: "Clip de Audio",
    validateAnswers: "Validar mis respuestas",
    yourAnswer: "Su respuesta:",
    noAnswer: "Sin respuesta (tiempo agotado)",
    correctAnswer: "Respuesta correcta:",
    gradeLabel: "NOTA",
    hideAnswers: "Ocultar respuestas",
    showAnswers: "Mostrar respuestas",
    tutorFeedbackTitle: "Comentarios del tutor",
    tutorAnalyzing: "El tutor está analizando sus resultados...",
    questionOf: (c, t) => `Pregunta ${c} de ${t}`,
    feedbackCorrect: "✓ ¡Correcto!",
    feedbackIncorrect: "✖ ¡Incorrecto!",
    feedbackTimeout: "⏳ ¡Tiempo agotado!"
  },
  DE: {
    timerWarning: (pct, time) => `⏳ Achtung! Es verbleiben weniger als ${pct} der zugewiesenen Zeit (${time} übrig). Bitte beeilen Sie sich mit der Antwort!`,
    questionsLabel: (n) => `📝 ${n} Multiple-Choice-Frage(n)`,
    rulesTitle: "📋 Prüfungsregeln & Hilfsmittel",
    calculator: (a) => `Taschenrechner ${a ? "Erlaubt" : "Unzulässig"}`,
    documents: (a) => `Unterlagen ${a ? "Erlaubt" : "Unzulässig"}`,
    webBrowsing: (a) => `Web-Browsing ${a ? "Erlaubt" : "Unzulässig"}`,
    aiTutor: (a) => `KI-Tutor ${a ? "Aktiv" : "Deaktiviert"}`,
    honorNote: "Hinweis: Auch ohne physische Aufsicht müssen diese Prüfungsregeln eingehalten werden.",
    formatExpected: "Erwartetes Antwortformat: Einfach- oder Mehrfachauswahl",
    scoring: (tot) => `Bewertung: Ergebnis von ${tot} (in %)`,
    duration: (d) => `Dauer: ${d || 'Unbegrenzt'}`,
    prepAdvice: "Stellen Sie sicher, dass Sie etwas mehr Zeit als nötig haben, um die Fragen zu beantworten.",
    eliminationAlert: "⚠️ Ausschluss falscher Aussagen",
    multipleAnswers: "☑ Mehrere Antworten möglich",
    audioClip: "Audio-Ausschnitt",
    validateAnswers: "Antworten bestätigen",
    yourAnswer: "Ihre Antwort:",
    noAnswer: "Keine Antwort (Zeitüberschreitung)",
    correctAnswer: "Richtige Antwort:",
    gradeLabel: "NOTE",
    hideAnswers: "Antworten verbergen",
    showAnswers: "Antworten anzeigen",
    tutorFeedbackTitle: "Feedback des Tutors",
    tutorAnalyzing: "Der Tutor analysiert Ihre Ergebnisse...",
    questionOf: (c, t) => `Frage ${c} von ${t}`,
    feedbackCorrect: "✓ Richtig!",
    feedbackIncorrect: "✖ Falsch!",
    feedbackTimeout: "⏳ Zeit abgelaufen!"
  },
  ZH: {
    timerWarning: (pct, time) => `⏳ 注意！剩余时间已不足 ${pct}（还剩 ${time}）。请尽快答题！`,
    questionsLabel: (n) => `📝 ${n} 道选择题`,
    rulesTitle: "📋 考试说明与适用材料",
    calculator: (a) => `计算器 ${a ? "允许使用" : "禁止使用"}`,
    documents: (a) => `参考资料 ${a ? "允许使用" : "禁止使用"}`,
    webBrowsing: (a) => `网页浏览 ${a ? "允许" : "禁止"}`,
    aiTutor: (a) => `AI 导师 ${a ? "可用" : "禁用"}`,
    honorNote: "注：即使没有物理监考，您也必须遵守这些考试规则。",
    formatExpected: "期望的回答格式：单选或多选",
    scoring: (tot) => `评分：${tot} 分中的得分 (百分比)`,
    duration: (d) => `时长：${d || '无限制'}`,
    prepAdvice: "请确保您有比回答问题所需稍微多一点的时间。",
    eliminationAlert: "⚠️ 排除错误陈述",
    multipleAnswers: "☑ 可多选",
    audioClip: "音频片段",
    validateAnswers: "提交答案",
    yourAnswer: "您的回答：",
    noAnswer: "未作答 (超时)",
    correctAnswer: "正确答案：",
    gradeLabel: "成绩",
    hideAnswers: "隐藏答案",
    showAnswers: "显示答案",
    tutorFeedbackTitle: "导师反馈",
    tutorAnalyzing: "导师正在分析您的结果...",
    questionOf: (c, t) => `第 ${c} 题 / 共 ${t} 题`,
    feedbackCorrect: "✓ 正确！",
    feedbackIncorrect: "✖ 错误！",
    feedbackTimeout: "⏳ 时间到！"
  },
  PT: {
    timerWarning: (pct, time) => `⏳ Atenção! Resta menos de ${pct} do tempo previsto (${time} restantes). Responda com agilidade!`,
    questionsLabel: (n) => `📝 ${n} pergunta(s) de escolha múltipla`,
    rulesTitle: "📋 Instruções e Materiais do Exame",
    calculator: (a) => `Calculadora ${a ? "Permitida" : "Proibida"}`,
    documents: (a) => `Documentos ${a ? "Permitidos" : "Proibidos"}`,
    webBrowsing: (a) => `Navegação Web ${a ? "Permitida" : "Proibida"}`,
    aiTutor: (a) => `Tutor IA ${a ? "Ativo" : "Desativado"}`,
    honorNote: "Nota: Mesmo sem supervisão presencial, estas regras devem ser cumpridas.",
    formatExpected: "Formato esperado: Escolha única ou múltipla",
    scoring: (tot) => `Pontuação: Nota sobre ${tot} (em %)`,
    duration: (d) => `Duração: ${d || 'Ilimitada'}`,
    prepAdvice: "Certifique-se de dispor de tempo suficiente para responder às questões.",
    eliminationAlert: "⚠️ Eliminação de afirmações incorretas",
    multipleAnswers: "☑ Múltiplas respostas possíveis",
    audioClip: "Clipe de Áudio",
    validateAnswers: "Submeter respostas",
    yourAnswer: "Sua resposta:",
    noAnswer: "Sem resposta (tempo esgotado)",
    correctAnswer: "Resposta correta:",
    gradeLabel: "NOTA",
    hideAnswers: "Ocultar respostas",
    showAnswers: "Ver respostas",
    tutorFeedbackTitle: "Comentário do Tutor",
    tutorAnalyzing: "O tutor está analisando seus resultados...",
    questionOf: (c, t) => `Questão ${c} de ${t}`,
    feedbackCorrect: "✓ Correto!",
    feedbackIncorrect: "✖ Incorreto!",
    feedbackTimeout: "⏳ Tempo esgotado!"
  },
  AR: {
    timerWarning: (pct, time) => `⏳ تحذير! بقي أقل من ${pct} من الوقت المخصص (${time} متبقية). يرجى الإسراع بالإجابة!`,
    questionsLabel: (n) => `📝 ${n} سؤال من متعدد`,
    rulesTitle: "📋 تعليمات ومواد الاختبار",
    calculator: (a) => `الآلة الحاسبة ${a ? "مسموحة" : "ممنوعة"}`,
    documents: (a) => `المستندات ${a ? "مسموحة" : "ممنوعة"}`,
    webBrowsing: (a) => `تصفح الويب ${a ? "مسموح" : "ممنوع"}`,
    aiTutor: (a) => `المعلم الذكي ${a ? "مفعل" : "معطل"}`,
    honorNote: "ملاحظة: حتى بدون مراقبة حضورية، يجب احترام شروط الامتحان.",
    formatExpected: "تنسيق الإجابة المتوقع: اختيار واحد أو اختيارات متعددة",
    scoring: (tot) => `التقييم: الدرجة من ${tot} (بالنسبة المئوية)`,
    duration: (d) => `المدة: ${d || 'غير محددة'}`,
    prepAdvice: "تأكد من توفر وقت كافٍ للإجابة على الأسئلة.",
    eliminationAlert: "⚠️ استبعاد العبارات الخاطئة",
    multipleAnswers: "☑ يمكن اختيار أكثر من إجابة",
    audioClip: "مقطع صوتي",
    validateAnswers: "تأكيد الإجابات",
    yourAnswer: "إجابتك:",
    noAnswer: "لم تتم الإجابة (انتهى الوقت)",
    correctAnswer: "الإجابة الصحيحة:",
    gradeLabel: "الدرجة",
    hideAnswers: "إخفاء الإجابات",
    showAnswers: "عرض الإجابات",
    tutorFeedbackTitle: "ملاحظات المعلم",
    tutorAnalyzing: "المعلم يحلل نتائجك...",
    questionOf: (c, t) => `السؤال ${c} من ${t}`,
    feedbackCorrect: "✓ إجابة صحيحة!",
    feedbackIncorrect: "✖ إجابة خاطئة!",
    feedbackTimeout: "⏳ انتهى الوقت!"
  },
  HI: {
    timerWarning: (pct, time) => `⏳ ध्यान दें! निर्धारित समय का ${pct} से भी कम बचा है (${time} शेष)। शीघ्र उत्तर दें!`,
    questionsLabel: (n) => `📝 ${n} बहुविकल्पीय प्रश्न`,
    rulesTitle: "📋 परीक्षा निर्देश और सामग्री",
    calculator: (a) => `कैलकुलेटर ${a ? "अनुमति प्राप्त" : "निषिद्ध"}`,
    documents: (a) => `दस्तावेज़ ${a ? "अनुमति प्राप्त" : "निषिद्ध"}`,
    webBrowsing: (a) => `वेब ब्राउज़िंग ${a ? "अनुमति प्राप्त" : "निषिद्ध"}`,
    aiTutor: (a) => `एआई ट्यूटर ${a ? "सक्रिय" : "निष्क्रिय"}`,
    honorNote: "नोट: शारीरिक निगरानी न होने पर भी इन नियमों का पालन आवश्यक है।",
    formatExpected: "अपेक्षित प्रारूप: एकल या एकाधिक विकल्प",
    scoring: (tot) => `अंक: ${tot} में से स्कोर (% में)`,
    duration: (d) => `अवधि: ${d || 'असीमित'}`,
    prepAdvice: "सुनिश्चित करें कि आपके पास प्रश्नों के उत्तर देने के लिए पर्याप्त समय है।",
    eliminationAlert: "⚠️ गलत विकल्पों का उन्मूलन",
    multipleAnswers: "☑ कई उत्तर संभव हैं",
    audioClip: "ऑडियो क्लिप",
    validateAnswers: "उत्तर सबमिट करें",
    yourAnswer: "आपका उत्तर:",
    noAnswer: "कोई उत्तर नहीं (समय समाप्त)",
    correctAnswer: "सही उत्तर:",
    gradeLabel: "ग्रेड",
    hideAnswers: "उत्तर छुपाएं",
    showAnswers: "उत्तर दिखाएं",
    tutorFeedbackTitle: "ट्यूटर प्रतिक्रिया",
    tutorAnalyzing: "ट्यूटर आपके परिणामों का विश्लेषण कर रहा है...",
    questionOf: (c, t) => `प्रश्न ${c} / ${t}`,
    feedbackCorrect: "✓ सही!",
    feedbackIncorrect: "✖ गलत!",
    feedbackTimeout: "⏳ समय समाप्त!"
  },
  UR: {
    timerWarning: (pct, time) => `⏳ انتباہ! مختص وقت کا ${pct} سے بھی کم باقی ہے (${time} باقی)۔ جلد جواب دیں!`,
    questionsLabel: (n) => `📝 ${n} کثیر الانتخابی سوالات`,
    rulesTitle: "📋 امتحانی ہدایات اور مواد",
    calculator: (a) => `کیلکولیٹر ${a ? "مجاز" : "ممنوع"}`,
    documents: (a) => `دستاویزات ${a ? "مجاز" : "ممنوع"}`,
    webBrowsing: (a) => `ویب براؤزنگ ${a ? "مجاز" : "ممنوع"}`,
    aiTutor: (a) => `اے آئی ٹیوٹر ${a ? "فعال" : "غیر فعال"}`,
    honorNote: "نوٹ: فزیکل نگرانی کے بغیر بھی امتحانی قواعد کا احترام لازمی ہے۔",
    formatExpected: "متوقع جواب: واحد یا کثیر انتخاب",
    scoring: (tot) => `اسکور: ${tot} میں سے اسکور (فیصد میں)`,
    duration: (d) => `مدت: ${d || 'لامحدود'}`,
    prepAdvice: "یقینی بنائیں کہ سوالات حل کرنے کے لیے مناسب وقت میسر ہے۔",
    eliminationAlert: "⚠️ غلط بیانات کا اخراج",
    multipleAnswers: "☑ ایک سے زائد جوابات ممکن ہیں",
    audioClip: "آڈیو کلپ",
    validateAnswers: "جوابات جمع کرائیں",
    yourAnswer: "آپ کا جواب:",
    noAnswer: "کوئی جواب نہیں (وقت ختم)",
    correctAnswer: "صحیح جواب:",
    gradeLabel: "گریڈ",
    hideAnswers: "جوابات چھپائیں",
    showAnswers: "جوابات دیکھیں",
    tutorFeedbackTitle: "ٹیوٹر کا تبصرہ",
    tutorAnalyzing: "ٹیوٹر نتائج کا تجزیہ کر رہا ہے...",
    questionOf: (c, t) => `سوال ${c} از ${t}`,
    feedbackCorrect: "✓ درست!",
    feedbackIncorrect: "✖ غلط!",
    feedbackTimeout: "⏳ وقت ختم!"
  }
};

export const getQuizLocale = (lang?: string): QuizCoverLabels => {
  if (!lang) return QUIZ_LOCALES.EN;
  const key = lang.toUpperCase();
  return QUIZ_LOCALES[key] || QUIZ_LOCALES.EN;
};

