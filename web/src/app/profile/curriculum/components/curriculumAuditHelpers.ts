import { LOCALES } from './profileLocales';
import { formatCourseLevel } from '@/lib/translations';

export function getConflictDescription(conflict: any, lang: string): string {
  const langKey = lang.toUpperCase();
  const isDe = lang.toUpperCase() === 'DE';
  const isZh = lang.toUpperCase() === 'ZH';
  const isPt = lang.toUpperCase() === 'PT';
  const isAr = lang.toUpperCase() === 'AR';
  const isHi = lang.toUpperCase() === 'HI';
  const isUr = lang.toUpperCase() === 'UR';

  if (isFr) {
    return `Vous êtes inscrit à la fois au cours individuel "${conflict.standalone.title}" et au cursus "${conflict.curriculum.title}" qui contient déjà le module "${conflict.curriculumChild.title}". Cela peut entraîner des doublons ou des incohérences de progression.`;
  }
  if (isEs) {
    return `Está inscrito tanto en el curso independiente "${conflict.standalone.title}" como en el plan de estudios "${conflict.curriculum.title}", que ya incluye el módulo "${conflict.curriculumChild.title}". Esto puede generar duplicados o conflictos de progreso.`;
  }
  if (isDe) {
    return `Sie sind sowohl für den eigenständigen Kurs "${conflict.standalone.title}" als auch für den Lehrplan "${conflict.curriculum.title}" angemeldet, der bereits das Modul "${conflict.curriculumChild.title}" enthält. Dies kann zu doppelten oder widersprüchlichen Fortschritten führen.`;
  }
  if (isZh) {
    return `您同时加入了独立课程 "${conflict.standalone.title}" 和学习项目 "${conflict.curriculum.title}"（其中已包含模块 "${conflict.curriculumChild.title}"）。这可能会导致重复或进度冲突。`;
  }
  if (isPt) {
    return `Você está inscrito tanto no curso independente "${conflict.standalone.title}" quanto no currículo "${conflict.curriculum.title}", que já inclui o módulo "${conflict.curriculumChild.title}". Isso pode levar a duplicatas ou conflitos de progresso.`;
  }
  if (isAr) {
    return `أنت مسجل في كل من الدورة التدريبية المستقلة "${conflict.standalone.title}" والمنهج الدراسي "${conflict.curriculum.title}"، والذي يتضمن بالفعل الوحدة "${conflict.curriculumChild.title}". قد يؤدي هذا إلى تكرار أو تعارض في التقدم.`;
  }
  if (isHi) {
    return `आप स्टैंडअलोन कोर्स "${conflict.standalone.title}" और पाठ्यक्रम "${conflict.curriculum.title}" दोनों में नामांकित हैं, जिसमें पहले से ही मॉड्यूल "${conflict.curriculumChild.title}" शामिल है। इससे प्रगति में दोहराव या विरोध हो सकता है।`;
  }
  if (isUr) {
    return `آپ اکیلے کورس "${conflict.standalone.title}" اور نصاب "${conflict.curriculum.title}" دونوں میں رجسٹرڈ ہیں، جس میں پہلے سے ہی ماڈیول "${conflict.curriculumChild.title}" شامل ہے۔ اس سے دہراؤ یا ترقی میں تنازعہ پیدا ہو سکتا ہے۔`;
  }
  return `You are enrolled in both the standalone course "${conflict.standalone.title}" and the curriculum "${conflict.curriculum.title}", which already includes the module "${conflict.curriculumChild.title}". This may lead to duplicate or conflicting progress.`;
}

const COURSE_LABEL: Record<string, string> = {
  EN: "Course",
  FR: "Cours",
  ES: "Curso",
  DE: "Kurs",
  ZH: "课程",
  PT: "Curso",
  AR: "دورة",
  HI: "कोर्स",
  UR: "کورس"
};

const MANDATORY_LABEL: Record<string, string> = {
  EN: "Mandatory",
  FR: "Obligatoire",
  ES: "Obligatorio",
  DE: "Pflicht",
  ZH: "必修",
  PT: "Obrigatório",
  AR: "إلزامي",
  HI: "अनिवार्य",
  UR: "لازمی"
};

const OPTIONAL_LABEL: Record<string, string> = {
  EN: "Optional",
  FR: "Optionnel",
  ES: "Opcional",
  DE: "Wahlfach",
  ZH: "选修",
  PT: "Opcional",
  AR: "اختياري",
  HI: "वैकल्पिक",
  UR: "اختیاری"
};

const NOT_AVAILABLE_IN_LANG: Record<string, string> = {
  EN: "Not available in your active language",
  FR: "Non disponible dans votre langue active",
  ES: "No disponible en tu idioma activo",
  DE: "In Ihrer aktiven Sprache nicht verfügbar",
  ZH: "在您的活动语言中不可用",
  PT: "Não disponível no seu idioma ativo",
  AR: "غير متوفر بلغتك النشطة",
  HI: "आपकी सक्रिय भाषा में उपलब्ध नहीं है",
  UR: "آپ کی فعال زبان में उपलब्ध नहीं है"
};

const REMOVE_BOOKMARK_LABEL: Record<string, string> = {
  EN: "Remove bookmark",
  FR: "Supprimer des favoris",
  ES: "Eliminar marcador",
  DE: "Lesezeichen entfernen",
  ZH: "删除书签",
  PT: "Remover marcador",
  AR: "إزالة الإشارة المرجع",
  HI: "बुकमार्क हटाएं",
  UR: "بک مارک ہٹائیں"
};

const SAVE_COURSE_LABEL: Record<string, string> = {
  EN: "Save this course",
  FR: "Sauvegarder ce cours",
  ES: "Guardar este curso",
  DE: "Kurs speichern",
  ZH: "保存此课程",
  PT: "Salvar este curso",
  AR: "حفظ هذه الدورة",
  HI: "इस कोर्स को सहेजें",
  UR: "اس کورس کو محفوظ کریں"
};

const MANDATORY_CURRICULUM_COURSE_LABEL: Record<string, string> = {
  EN: "Mandatory curriculum course (cannot disenroll)",
  FR: "Cours obligatoire du curriculum (abandon impossible)",
  ES: "Curso curricular obligatorio (no se puede dar de baja)",
  DE: "Pflichtlehrplankurs (Abmeldung nicht möglich)",
  ZH: "必修课程（无法退选）",
  PT: "Curso curricular obrigatório (não é possível cancelar a inscrição)",
  AR: "دورة منهجية إلزامية (لا يمكن إلغاء التسجيل)",
  HI: "अनिवार्य पाठ्यक्रम (नामांकन रद्द नहीं किया जा सकता)",
  UR: "لازمی نصابی کورس (رجسٹریشن منسوخ نہیں کی جا سکتی)"
};

const COMPLETED_LABEL: Record<string, string> = {
  EN: "Completed",
  FR: "Complété",
  ES: "Completado",
  DE: "Abgeschlossen",
  ZH: "已完成",
  PT: "Concluído",
  AR: "مكتمل",
  HI: "पूरा किया",
  UR: "مکمل"
};

const STATUS_LABEL: Record<string, string> = {
  EN: "Status",
  FR: "Statut",
  ES: "Estado",
  DE: "Status",
  ZH: "状态",
  PT: "Status",
  AR: "الحالة",
  HI: "स्थिति",
  UR: "حالت"
};

const EARNED_BADGES_LABEL: Record<string, string> = {
  EN: "Earned badges",
  FR: "Badges gagnés",
  ES: "Insignias ganadas",
  DE: "Verdienstliche Abzeichen",
  ZH: "获得的徽章",
  PT: "Medalhas ganhas",
  AR: "الشارات المكتسبة",
  HI: "अर्जित बैज",
  UR: "حاصل کردہ بیجز"
};

const VIEW_REVIEW_LABEL: Record<string, string> = {
  EN: "View Review",
  FR: "Voir l'évaluation",
  ES: "Ver evaluación",
  DE: "Bewertung ansehen",
  ZH: "查看评价",
  PT: "Ver avaliação",
  AR: "عرض التقييم",
  HI: "समीक्षा देखें",
  UR: "جائزہ دیکھیں"
};

const REVIEW_COURSE_LABEL: Record<string, string> = {
  EN: "Review Course",
  FR: "Revoir le cours",
  ES: "Revisar curso",
  DE: "Kurs bewerten",
  ZH: "评价课程",
  PT: "Avaliar curso",
  AR: "مراجعة الدورة",
  HI: "कोर्स की समीक्षा करें",
  UR: "کورس کا جائزہ لیں"
};

const DISMISS_RECOMMENDATION_LABEL: Record<string, string> = {
  EN: "Dismiss recommendation",
  FR: "Masquer cette recommandation",
  ES: "Descartar recomendación",
  DE: "Empfehlung ausblenden",
  ZH: "忽略推荐",
  PT: "Ignorar recomendação",
  AR: "تجاهل التوصية",
  HI: "सिफारिश खारिज करें",
  UR: "سفارش کو مسترد کریں"
};

const ELECTIVE_CHOICES_LABEL: Record<string, string> = {
  EN: "Elective Course Choices",
  FR: "Choix des options",
  ES: "Elección de asignaturas optativas",
  DE: "Wahlfachoptionen",
  ZH: "选修课程选择",
  PT: "Escolhas de cursos eletivos",
  AR: "خيارات المقررات الاختيارية",
  HI: "वैकल्पिक पाठ्यक्रम विकल्प",
  UR: "اختیاری کورس کے انتخاب"
};

const COMPLIANT_LABEL: Record<string, string> = {
  EN: "Compliant",
  FR: "Conforme",
  ES: "Conforme",
  DE: "Konform",
  ZH: "符合要求",
  PT: "Conforme",
  AR: "متوافق",
  HI: "अनुरूप",
  UR: "مطابق"
};

const REQUIRED_LABEL: Record<string, string> = {
  EN: "Required",
  FR: "Requis",
  ES: "Requerido",
  DE: "Erforderlich",
  ZH: "需要",
  PT: "Requerido",
  AR: "مطلوب",
  HI: "आवश्यक",
  UR: "مطلوبہ"
};

const ELECTIVE_LABEL: Record<string, string> = {
  EN: "Elective",
  FR: "Optionnel",
  ES: "Optativa",
  DE: "Wahlpflicht",
  ZH: "选修",
  PT: "Eletiva",
  AR: "اختياري",
  HI: "वैकल्पिक",
  UR: "اختیاری"
};

const EXPECTED_LABEL: Record<string, string> = {
  EN: "expected",
  FR: "prévues",
  ES: "previstas",
  DE: "erwartet",
  ZH: "预计",
  PT: "previstas",
  AR: "متوقعة",
  HI: "अपेक्षित",
  UR: "متوقع"
};

const NOT_ENROLLED_LABEL: Record<string, string> = {
  EN: "Not enrolled",
  FR: "Non inscrit",
  ES: "No inscrito",
  DE: "Nicht angemeldet",
  ZH: "未加入",
  PT: "Não inscrito",
  AR: "غير مسجل",
  HI: "नामांकित नहीं",
  UR: "رجسٹرڈ نہیں"
};

const REMOVE_LABEL: Record<string, string> = {
  EN: "Remove",
  FR: "Retirer",
  ES: "Quitar",
  DE: "Entfernen",
  ZH: "退选",
  PT: "Remover",
  AR: "إزالة",
  HI: "हटाएं",
  UR: "ہٹائیں"
};

const CHOOSE_LABEL: Record<string, string> = {
  EN: "Choose",
  FR: "Choisir",
  ES: "Elegir",
  DE: "Wählen",
  ZH: "选择",
  PT: "Escolher",
  AR: "اختر",
  HI: "चुनें",
  UR: "منتخب کریں"
};

const THIS_COURSE_LABEL: Record<string, string> = {
  EN: "this course",
  FR: "ce cours",
  ES: "este curso",
  DE: "dieser Kurs",
  ZH: "此课程",
  PT: "este curso",
  AR: "هذه الدورة",
  HI: "यह कोर्स",
  UR: "یہ کورس"
};

const KEEP_ENROLLMENTS_LABEL: Record<string, string> = {
  EN: "Keep course enrollments",
  FR: "Conserver l'inscription aux modules",
  ES: "Mantener inscripciones de cursos",
  DE: "Kursanmeldungen behalten",
  ZH: "保留课程加入状态",
  PT: "Manter inscrições nos cursos",
  AR: "الاحتفاظ بالتسجيل في الدورات",
  HI: "कोर्स नामांकन बनाए रखें",
  UR: "کورس की رجسٹریشن برقرار رکھیں"
};

const KEEP_ENROLLMENTS_DESC_LABEL: Record<string, string> = {
  EN: "Keep your individual progress and enrollment for the child courses. Uncheck to abandon all.",
  FR: "Conservez vos progrès et inscriptions individuelles pour les cours de ce cursus. Décochez pour tout abandonner.",
  ES: "Mantenga su progreso e inscripción individual para los cursos secundarios. Desmarque para abandonar todo.",
  DE: "Behalten Sie Ihren individuellen Fortschritt und Ihre Anmeldung für die untergeordneten Kurse. Deaktivieren Sie diese Option, um alle abzubrechen.",
  ZH: "保留子课程的个人进度和加入状态。取消勾选将全部放弃。",
  PT: "Mantenha o seu progresso individual e inscrição para os cursos filhos. Desmarque para cancelar todos.",
  AR: "الاحتفاظ بتقدمك الفردي وتسجيلك في المقررات الفرعية. قم بإلغاء التحديد للتخلي عن الجميع.",
  HI: "उप-पाठ्यक्रमों के लिए अपनी व्यक्तिगत प्रगति और नामांकन बनाए रखें। सभी को छोड़ने के लिए अनचेक करें।",
  UR: "ذیلی کورسز के लिए अपनी انفرادی پیشرفت اور رجسٹریشن برقرار رکھیں۔ سب کو چھوڑنے کے لیے ان چیک کریں۔"
};

const REVIEWED_READ_ONLY_LABEL: Record<string, string> = {
  EN: "REVIEWED • READ ONLY",
  FR: "ÉVALUÉ • LECTURE SEULE",
  ES: "EVALUADO • SOLO LECTURA",
  DE: "BEWERTET • NUR LESEN",
  ZH: "已评价 • 只读",
  PT: "AVALIADO • APENAS LEITURA",
  AR: "تم التقييم • للقراءة فقط",
  HI: "समीक्षित • केवल पढ़ने के लिए",
  UR: "جائزہ لیا گیا • صرف پڑھنے کے لیے"
};

const CLOSE_LABEL: Record<string, string> = {
  EN: "Close",
  FR: "Fermer",
  ES: "Cerrar",
  DE: "Schließen",
  ZH: "关闭",
  PT: "Fechar",
  AR: "إغلاق",
  HI: "बंद करें",
  UR: "بند کریں"
};

const YOUR_SAVED_REVIEW_LABEL: Record<string, string> = {
  EN: "YOUR SAVED REVIEW",
  FR: "VOTRE ÉVALUATION ENREGISTRÉE",
  ES: "TU EVALUACIÓN GUARDADA",
  DE: "IHRE GESPEICHERTE BEWERTUNG",
  ZH: "您保存的评价",
  PT: "SUA AVALIAÇÃO SALVA",
  AR: "تقييمك المحفوظ",
  HI: "आपकी सहेजी गई समीक्षा",
  UR: "آپ کا محفوظ کردہ جائزہ"
};

const SHARE_YOUR_EXPERIENCE_LABEL: Record<string, string> = {
  EN: "SHARE YOUR EXPERIENCE",
  FR: "PARTAGEZ VOTRE EXPÉRIENCE",
  ES: "COMPARTE TU EXPERIENCIA",
  DE: "TEILEN SIE IHRE ERFAHRUNG",
  ZH: "分享您的学习体验",
  PT: "COMPARTILHE SUA EXPERIÊNCIA",
  AR: "شارك تجربتك",
  HI: "अपना अनुभव साझा करें",
  UR: "اپنا تجربہ شیئر کریں"
};

const RATE_THIS_COURSE_LABEL: Record<string, string> = {
  EN: "Rate this course",
  FR: "Évaluez ce cours",
  ES: "Califica este curso",
  DE: "Diesen Kurs bewerten",
  ZH: "为此课程评分",
  PT: "Avalie este curso",
  AR: "قيم هذه الدورة",
  HI: "इस कोर्स को रेट करें",
  UR: "اس کورس کی درجہ بندی کریں"
};

const COMMENTS_SUGGESTIONS_LABEL: Record<string, string> = {
  EN: "Comments or Suggestions",
  FR: "Commentaires ou Suggestions",
  ES: "Comentarios o sugerencias",
  DE: "Kommentare oder Vorschläge",
  ZH: "意见或建议",
  PT: "Comentários ou sugestões",
  AR: "التعليقات أو الاقتراحات",
  HI: "टिप्पणियाँ या सुझाव",
  UR: "تبصرے یا تجاویز"
};

const SUBMIT_REVIEW_LABEL: Record<string, string> = {
  EN: "Submit Review",
  FR: "Soumettre l'évaluation",
  ES: "Enviar evaluación",
  DE: "Bewertung absenden",
  ZH: "提交评价",
  PT: "Enviar avaliação",
  AR: "إرسال التقييم",
  HI: "समीक्षा सबमिट करें",
  UR: "جائزہ جمع کروائیں"
};

const REVIEW_SAVED_LABEL: Record<string, string> = {
  EN: "Your rating has been successfully saved. Thank you for sharing your feedback!",
  FR: "Votre évaluation a été enregistrée avec succès. Merci d'avoir partagé votre avis !",
  ES: "Tu calificación ha sido guardada con éxito. ¡Gracias por compartir tus comentarios!",
  DE: "Ihre Bewertung wurde erfolgreich gespeichert. Vielen Dank für Ihr Feedback!",
  ZH: "您的评分已成功保存。感谢您分享您的反馈！",
  PT: "A sua avaliação foi salva com sucesso. Obrigado por partilhar o seu feedback!",
  AR: "تم حفظ تقييمك بنجاح. شكرًا لمشاركتك ملاحظاتك!",
  HI: "आपकी रेटिंग सफलतापूर्वक सहेज ली गई है। अपनी प्रतिक्रिया साझा करने के लिए धन्यवाद!",
  UR: "آپ کی درجہ بندی کامیابی کے ساتھ محفوظ کر لی گئی ہے۔ اپنی رائے دینے کا شکریہ!"
};

const TEXTAREA_PLACEHOLDER_LABEL: Record<string, string> = {
  EN: "What did you think of the pacing, clarity, or explanations? Suggest revisions...",
  FR: "Que pensez-vous du rythme, de la clarté ou des explications ? Suggérez des révisions...",
  ES: "¿Qué te pareció el ritmo, la claridad o las explicaciones? Sugiere revisiones...",
  DE: "Was halten Sie von Tempo, Klarheit oder Erklärungen? Schlagen Sie Überarbeitungen vor...",
  ZH: "您对课程进度、清晰度或解释有何看法？请提出修改建议...",
  PT: "O que achou do ritmo, clareza ou explicações? Sugira revisões...",
  AR: "ما رأيك في الوتيرة أو الوضوح أو الشروحات؟ اقترح مراجعات...",
  HI: "गति, स्पष्टता या स्पष्टीकरण के बारे में आपने क्या सोचा? संशोधन का सुझाव दें...",
  UR: "رفتار، وضاحت، یا وضاحتوں کے بارے में آپ کا کیا خیال ہے؟ نظرثانی تجویز کریں..."
};

const ENROLLMENT_SUCCESSFUL_LABEL: Record<string, string> = {
  EN: "Enrollment Successful!",
  FR: "Inscription Réussie !",
  ES: "¡Inscripción exitosa!",
  DE: "Anmeldung erfolgreich!",
  ZH: "加入成功！",
  PT: "Inscrição bem-sucedida!",
  AR: "تم التسجيل بنجاح!",
  HI: "नामांकन सफल!",
  UR: "رجسٹریشن کامیاب!"
};

const ELECTIVE_FORMATTERS: Record<string, (enrolled: number, min: number, isCompliant: boolean) => string> = {
  FR: (enrolled, min, isCompliant) => `${enrolled} sur ${min} cours optionnel(s) choisi(s) — ${isCompliant ? 'Conforme' : 'Sélection incomplète'}`,
  ES: (enrolled, min, isCompliant) => `${enrolled} de ${min} curso(s) opcional(es) elegido(s) — ${isCompliant ? 'Conforme' : 'Selección requerida'}`,
  DE: (enrolled, min, isCompliant) => `${enrolled} von ${min} optionalen Kurs(en) gewählt — ${isCompliant ? 'Konform' : 'Auswahl erforderlich'}`,
  ZH: (enrolled, min, isCompliant) => `已选择 ${min} 个选修课程中的 ${enrolled} 个 — ${isCompliant ? '符合要求' : '需要选择'}`,
  PT: (enrolled, min, isCompliant) => `${enrolled} de ${min} curso(s) opcional(is) escolhido(s) — ${isCompliant ? 'Conforme' : 'Seleção necessária'}`,
  AR: (enrolled, min, isCompliant) => `تم اختيار ${enrolled} من أصل ${min} مقرر(ات) اختيارية — ${isCompliant ? 'متوافق' : 'الاختيار مطلوب'}`,
  HI: (enrolled, min, isCompliant) => `${min} वैकल्पिक पाठ्यक्रमों में से ${enrolled} चुने गए — ${isCompliant ? 'अनुरूप' : 'चयन आवश्यक'}`,
  UR: (enrolled, min, isCompliant) => `${min} اختیاری کورسز میں سے ${enrolled} منتخب کیے گئے — ${isCompliant ? 'مطابق' : 'انتخاب مطلوب'}`,
  EN: (enrolled, min, isCompliant) => `${enrolled} of ${min} optional course(s) chosen — ${isCompliant ? 'Compliant' : 'Selection required'}`
};

export function getElectiveDescription(enrolled: number, min: number, isCompliant: boolean, lang: string): string {
  const l = (lang || 'en').toUpperCase();
  const fn = ELECTIVE_FORMATTERS[l] || ELECTIVE_FORMATTERS.EN;
  return fn(enrolled, min, isCompliant);
}

export function getAchievementTranslation(ach: any, field: 'name' | 'description', lang: string): string {
  const upperLang = (lang || 'EN').toUpperCase();
  const dynamicVal = ach.translations?.[upperLang]?.[field] || ach.translations?.[lang.toLowerCase()]?.[field];
  if (dynamicVal) return dynamicVal;
  
  const defaultVal = ach[field] || '';
  const localeDict = LOCALES[upperLang] || LOCALES.EN;
  if (localeDict && defaultVal) {
    const staticVal = localeDict[defaultVal];
    if (staticVal) return staticVal;
  }
  return defaultVal;
}


