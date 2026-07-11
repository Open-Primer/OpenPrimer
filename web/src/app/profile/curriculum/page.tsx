"use client";

import React, { useState, useEffect } from 'react';
import { TopNav, Footer, AITutorOverlay } from '@/components/RefinedUI';
import { UI_STRINGS, getLocalizedLabel, formatCourseLevel } from '@/lib/translations';
import { AudioReader } from '@/components/AudioReader';
import * as Icons from 'lucide-react';
import { GraduationCap, Book, Star, Clock, Award, ChevronRight, Brain, Sparkles, ShieldCheck, Bookmark, Trophy, Globe, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dbService, BADGE_LIBRARY, progressService } from '@/lib/db';
import { EnrollmentModal } from '@/components/modals/EnrollmentModal';
import { cleanPathSegment, getCoursePath as getCoursePathHelper } from '@/lib/translations';

import { locale as arLocale } from '../../admin/curriculum/locales/ar';
import { locale as deLocale } from '../../admin/curriculum/locales/de';
import { locale as enLocale } from '../../admin/curriculum/locales/en';
import { locale as esLocale } from '../../admin/curriculum/locales/es';
import { locale as frLocale } from '../../admin/curriculum/locales/fr';
import { locale as hiLocale } from '../../admin/curriculum/locales/hi';
import { locale as ptLocale } from '../../admin/curriculum/locales/pt';
import { locale as urLocale } from '../../admin/curriculum/locales/ur';
import { locale as zhLocale } from '../../admin/curriculum/locales/zh';

const LOCALES: Record<string, Record<string, string>> = {
  AR: arLocale,
  DE: deLocale,
  EN: enLocale,
  ES: esLocale,
  FR: frLocale,
  HI: hiLocale,
  PT: ptLocale,
  UR: urLocale,
  ZH: zhLocale,
};

const MOBILE_OFFLINE_STRINGS: Record<string, Record<string, string>> = {
  FR: {
    offline_title: "Vous êtes hors-ligne",
    offline_subtitle: "Vérifiez votre connexion internet pour accéder à l'intégralité d'OpenPrimer.",
    section_title: "VOS COURS EN PROGRESSION (CACHE)",
    empty_title: "Aucun cours en cache pour le moment.",
    empty_subtitle: "Connectez-vous à internet et visitez votre tableau de bord Curriculum pour synchroniser vos cours automatiquement.",
    retry_button: "RÉESSAYER LA CONNEXION",
    progress_completed: "complété",
    course: "COURS",
    academic: "ACADÉMIQUE",
    loading_cache: "Chargement du cache..."
  },
  EN: {
    offline_title: "You are offline",
    offline_subtitle: "Check your internet connection to access the entirety of OpenPrimer.",
    section_title: "YOUR IN-PROGRESS COURSES (CACHED)",
    empty_title: "No cached courses at the moment.",
    empty_subtitle: "Connect to the internet and visit your Curriculum dashboard to sync your courses automatically.",
    retry_button: "RETRY CONNECTION",
    progress_completed: "completed",
    course: "COURSE",
    academic: "ACADEMIC",
    loading_cache: "Loading cache..."
  },
  ES: {
    offline_title: "Estás desconectado",
    offline_subtitle: "Verifica tu conexión a internet para acceder a todo OpenPrimer.",
    section_title: "TUS CURSOS EN PROGRESO (EN CACHÉ)",
    empty_title: "No hay cursos en caché por el momento.",
    empty_subtitle: "Conéctate a internet y visita tu panel de Curriculum para sincronizar tus cursos automáticamente.",
    retry_button: "REINTENTAR CONEXIÓN",
    progress_completed: "completado",
    course: "CURSO",
    academic: "ACADÉMICO",
    loading_cache: "Cargando caché..."
  },
  DE: {
    offline_title: "Sie sind offline",
    offline_subtitle: "Überprüfen Sie Ihre Internetverbindung, um auf ganz OpenPrimer zuzugreifen.",
    section_title: "IHRE LAUFENDEN KURSE (GECACHED)",
    empty_title: "Derzeit keine gecoachten Kurse.",
    empty_subtitle: "Verbinden Sie sich mit dem Internet und besuchen Sie Ihr Curriculum-Dashboard, um Ihre Kurse automatisch zu synchronisieren.",
    retry_button: "VERBINDUNG ERNEUT VERSUCHEN",
    progress_completed: "abgeschlossen",
    course: "KURS",
    academic: "AKADEMISCH",
    loading_cache: "Cache wird geladen..."
  },
  ZH: {
    offline_title: "您已离线",
    offline_subtitle: "检查您的互联网连接以访问 OpenPrimer 的全部内容。",
    section_title: "您的在学课程（已缓存）",
    empty_title: "目前没有缓存的课程。",
    empty_subtitle: "连接到互联网并访问您的课程仪表板以自动同步您的课程。",
    retry_button: "重试连接",
    progress_completed: "已完成",
    course: "课程",
    academic: "学术",
    loading_cache: "正在加载缓存..."
  },
  PT: {
    offline_title: "Você está offline",
    offline_subtitle: "Verifique sua conexão com a internet para acessar todo o OpenPrimer.",
    section_title: "SEUS CURSOS EM PROGRESSO (SALVOS)",
    empty_title: "Nenhum curso em cache no momento.",
    empty_subtitle: "Conecte-se à internet e visite o seu painel de Currículo para sincronizar seus cursos automaticamente.",
    retry_button: "TENTAR NOVAMENTE",
    progress_completed: "concluído",
    course: "CURSO",
    academic: "ACADÊMICO",
    loading_cache: "Carregando cache..."
  },
  AR: {
    offline_title: "أنت غير متصل بالإنترنت",
    offline_subtitle: "تحقق من اتصالك بالإنترنت للوصول إلى OpenPrimer بالكامل.",
    section_title: "دوراتك قيد التقدم (المخزنة مؤقتًا)",
    empty_title: "لا توجد دورات مخزنة مؤقتًا في الوقت الحالي.",
    empty_subtitle: "اتصل بالإنترنت وزر لوحة تحكم المنهج الدراسي لمزامنة دوراتك تلقائيًا.",
    retry_button: "إعادة محاولة الاتصال",
    progress_completed: "مكتمل",
    course: "دورة",
    academic: "أكاديمي",
    loading_cache: "جاري تحميل التخزين المؤقت..."
  },
  HI: {
    offline_title: "आप ऑफ़लाइन हैं",
    offline_subtitle: "OpenPrimer की संपूर्णता तक पहुँचने के लिए अपना इंटरनेट कनेक्शन जाँचें।",
    section_title: "आपके प्रगतिरत पाठ्यक्रम (कैश किए गए)",
    empty_title: "इस समय कोई कैश किया गया पाठ्यक्रम नहीं है।",
    empty_subtitle: "अपने पाठ्यक्रमों को स्वचालित रूप से सिंक करने के लिए इंटरनेट से कनेक्ट करें और अपने पाठ्यचर्या डैशबोर्ड पर जाएं।",
    retry_button: "कनेक्शन पुनः प्रयास करें",
    progress_completed: "पूरा हुआ",
    course: "कोर्स",
    academic: "अकादमिक",
    loading_cache: "कैश लोड हो रहा है..."
  },
  UR: {
    offline_title: "آپ آف لائن ہیں",
    offline_subtitle: "OpenPrimer تک رسائی حاصل کرنے کے لیے اپنا انٹرنیٹ کنکشن چیک کریں۔",
    section_title: "آپ کے جاری کورسز (کیش شدہ)",
    empty_title: "اس وقت کوئی کیش شدہ کورس نہیں ہے۔",
    empty_subtitle: "اپنے کورسز کو خودکار طور پر مطابقت پذیر کرنے کے لیے انٹرنیٹ سے جڑیں اور اپنے نصابی ڈیش بورڈ پر جائیں۔",
    retry_button: "دوبارہ کنکشن کی کوشش کریں",
    progress_completed: "مکمل",
    course: "کورس",
    academic: "تعلیمی",
    loading_cache: "کیش لوڈ ہو رہا है..."
  }
};


const STREAK_7_TITLE: Record<string, string> = {
  EN: "🏆 Impressive streak!",
  FR: "🏆 Série impressionnante !",
  ES: "🏆 ¡Racha impresionante!",
  DE: "🏆 Beeindruckende Serie!",
  ZH: "🏆 令人惊叹的连续学习天数！",
  PT: "🏆 Série impressionante!",
  AR: "🏆 سلسلة مذهلة!",
  HI: "🏆 प्रभावशाली सिलसिला!",
  UR: "🏆 متاثر کن سلسلہ!"
};

const STREAK_3_TITLE: Record<string, string> = {
  EN: "⚡ Keep it up!",
  FR: "⚡ Continue comme ça !",
  ES: "⚡ ¡Sigue así!",
  DE: "⚡ Weiter so!",
  ZH: "⚡ 继续保持！",
  PT: "⚡ Continue assim!",
  AR: "⚡ واصل العمل الرائع!",
  HI: "⚡ इसे जारी रखें!",
  UR: "⚡ اسے جاری رکھیں!"
};

const STREAK_0_TITLE: Record<string, string> = {
  EN: "Come back daily to build a streak!",
  FR: "Reviens chaque jour pour une série !",
  ES: "¡Vuelve a diario para crear una racha!",
  DE: "Kommen Sie täglich wieder, um eine Serie aufzubauen!",
  ZH: "每天回来学习以保持连续天数！",
  PT: "Volte diariamente para construir uma série!",
  AR: "عد يومياً لبناء سلسلة تعلم!",
  HI: "सिलसिला बनाने के लिए प्रतिदिन वापस आएं!",
  UR: "سلسلہ بنانے کے لیے روزانہ واپس آئیں!"
};

const STUDY_600_TITLE: Record<string, string> = {
  EN: "📖 Dedicated reader",
  FR: "📖 Lecteur assidu",
  ES: "📖 Lector dedicado",
  DE: "📖 Engagierter Leser",
  ZH: "📖 专心致志的读者",
  PT: "📖 Leitor dedicado",
  AR: "📖 قارئ مخلص",
  HI: "📖 समर्पित पाठक",
  UR: "📖 سرگرم قاری"
};

const STUDY_120_TITLE: Record<string, string> = {
  EN: "✨ Great progress",
  FR: "✨ Belle progression",
  ES: "✨ Gran progreso",
  DE: "✨ Toller Fortschritt",
  ZH: "✨ 极大进步",
  PT: "✨ Ótimo progresso",
  AR: "✨ تقدم رائع",
  HI: "✨ बेहतरीन प्रगति",
  UR: "✨ شاندار پیش رفت"
};

const STUDY_0_TITLE: Record<string, string> = {
  EN: "Every minute counts!",
  FR: "Chaque minute compte !",
  ES: "¡Cada minuto cuenta!",
  DE: "Jede Minute zählt!",
  ZH: "每一分钟都至关重要！",
  PT: "Cada minuto conta!",
  AR: "كل دقيقة تهم!",
  HI: "हर मिनट मायने रखता है!",
  UR: "हर min مهم ہے!"
};

const DISMISS_ALERT: Record<string, string> = {
  EN: "Dismiss conflict",
  FR: "Ignorer cette alerte",
  ES: "Descartar conflicto",
  DE: "Konflikt ausblenden",
  ZH: "忽略此冲突",
  PT: "Ignorar conflito",
  AR: "تجاهل التعارض",
  HI: "टकराव खारिज करें",
  UR: "تنازعہ کو مسترد کریں"
};

const VERSION_CONFLICT_TITLE: Record<string, string> = {
  EN: "Version Conflict Detected",
  FR: "Conflit de version détecté",
  ES: "Conflicto de versión detectado",
  DE: "Versionskonflikt erkannt",
  ZH: "检测到版本冲突",
  PT: "Conflito de versão detectado",
  AR: "تم اكتشاف تعارض في الإصدار",
  HI: "संस्करण संघर्ष का पता चला",
  UR: "ورژن کا تنازعہ پایا گیا"
};

const ABANDON_STANDALONE_COURSE: Record<string, string> = {
  EN: "Abandon Standalone Course",
  FR: "Abandonner le cours individuel",
  ES: "Abandonar curso independiente",
  DE: "Eigenständigen Kurs abbrechen",
  ZH: "放弃独立课程",
  PT: "Abandonar curso independente",
  AR: "التخلي عن الدورة التدريبية المستقلة",
  HI: "स्टैंडअलोन कोर्स छोड़ें",
  UR: "اکیلے کورس کو چھوڑیں"
};

const IGNORE_CONFLICT: Record<string, string> = {
  EN: "Ignore Conflict",
  FR: "Ignorer l'alerte",
  ES: "Ignorar conflicto",
  DE: "Konflikt ignorieren",
  ZH: "忽略冲突",
  PT: "Ignorar conflito",
  AR: "تجاهل التعارض",
  HI: "टकराव को अनदेखा करें",
  UR: "تنازعہ کو نظر انداز کریں"
};

function getConflictDescription(conflict: any, lang: string): string {
  const isFr = lang.toUpperCase() === 'FR';
  const isEs = lang.toUpperCase() === 'ES';
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

function getElectiveDescription(enrolled: number, min: number, isCompliant: boolean, lang: string): string {
  const l = lang.toUpperCase();
  if (l === 'FR') return `${enrolled} sur ${min} cours optionnel(s) choisi(s) — ${isCompliant ? 'Conforme' : 'Sélection incomplète'}`;
  if (l === 'ES') return `${enrolled} de ${min} curso(s) opcional(es) elegido(s) — ${isCompliant ? 'Conforme' : 'Selección requerida'}`;
  if (l === 'DE') return `${enrolled} von ${min} optionalen Kurs(en) gewählt — ${isCompliant ? 'Konform' : 'Auswahl erforderlich'}`;
  if (l === 'ZH') return `已选择 ${min} 个选修课程中的 ${enrolled} 个 — ${isCompliant ? '符合要求' : '需要选择'}`;
  if (l === 'PT') return `${enrolled} de ${min} curso(s) opcional(is) escolhido(s) — ${isCompliant ? 'Conforme' : 'Seleção necessária'}`;
  if (l === 'AR') return `تم اختيار ${enrolled} من أصل ${min} مقرر(ات) اختيارية — ${isCompliant ? 'متوافق' : 'الاختيار مطلوب'}`;
  if (l === 'HI') return `${min} वैकल्पिक पाठ्यक्रमों में से ${enrolled} चुने गए — ${isCompliant ? 'अनुरूप' : 'चयन आवश्यक'}`;
  if (l === 'UR') return `${min} اختیاری کورسز میں سے ${enrolled} منتخب کیے گئے — ${isCompliant ? 'مطابق' : 'انتخاب مطلوب'}`;
  return `${enrolled} of ${min} optional course(s) chosen — ${isCompliant ? 'Compliant' : 'Selection required'}`;
}

function getAchievementTranslation(ach: any, field: 'name' | 'description', lang: string): string {
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

export default function CurriculumPage() {
  const router = useRouter();
  const { language: lang, setLanguage: setLang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const upperLang = (lang || 'EN').toUpperCase();

  const [progress, setProgress] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [earnedIds, setEarnedIds] = useState<number[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [curriculumRevision, setCurriculumRevision] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingMode, setReadingMode] = useState('dark');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<any | null>(null);
  const [dismissedRecIds, setDismissedRecIds] = useState<number[]>([]);
  const [dismissedConflicts, setDismissedConflicts] = useState<number[]>([]);
  const [keepChildCourses, setKeepChildCourses] = useState<boolean>(true);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [selectedCurriculumForDrillDown, setSelectedCurriculumForDrillDown] = useState<any | null>(null);
  const [abandonTarget, setAbandonTarget] = useState<any | null>(null);


  // Helper to extract base slug for course version comparison
  const getBaseSlug = (slug: string) => {
    return (slug || '').toLowerCase()
      .replace(/[_-]v\d+[\d\.]*/g, '')
      .replace(/[_-]version\d+/g, '');
  };

  useEffect(() => {
    if (abandonTarget) {
      setKeepChildCourses(true);
    }
  }, [abandonTarget]);

  // States for course feedback review modals
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewCourse, setSelectedReviewCourse] = useState<any | null>(null);
  const [isReviewReadOnly, setIsReviewReadOnly] = useState(false);
  const [courseFeedbacks, setCourseFeedbacks] = useState<Record<number, any>>({});
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('op_dismissed_recommendations');
    if (dismissed) {
      try {
        setDismissedRecIds(JSON.parse(dismissed));
      } catch (e) {}
    }
  }, []);

  const handleDismissRecommendation = (id: number) => {
    const updated = [...dismissedRecIds, id];
    setDismissedRecIds(updated);
    localStorage.setItem('op_dismissed_recommendations', JSON.stringify(updated));
  };

  const getLocalizedCourseDescription = (c: any) => {
    if (!c) return '';
    const code = (lang || 'EN').toUpperCase();
    return c.translations?.[code]?.description || c.description || '';
  };

  const isCourseNew = (course: any) => progressService.isNewCourse(course.created_at);

  const handleCourseClick = (c: any) => {
    if (c && c.languages && c.languages.length > 0) {
      const currentLangLower = lang.toLowerCase();
      const supportsCurrentLang = c.languages.some((l: string) => l.toLowerCase() === currentLangLower);
      if (!supportsCurrentLang) {
        const newLang = c.languages[0].toUpperCase();
        setLang(newLang);
      }
    }
  };


  const navigateToCourseDirect = async (c: any) => {
    const slug = c.slug;
    if (!slug) {
      window.location.href = '/catalog';
      return;
    }
    
    // Check supported languages
    let targetLang = lang;
    if (c.languages && c.languages.length > 0) {
      const currentLangLower = lang.toLowerCase();
      const supportsCurrentLang = c.languages.some((l: string) => l.toLowerCase() === currentLangLower);
      if (!supportsCurrentLang) {
        const newLang = c.languages[0].toUpperCase();
        setLang(newLang);
        targetLang = newLang.toLowerCase();
      }
    }

    let resolvedSlug = 'introduction';
    try {
      const { data: firstLessonSlug } = await dbService.getFirstLessonSlug(c.slug, targetLang);
      if (firstLessonSlug) {
        resolvedSlug = firstLessonSlug;
      }
    } catch (err) {
      console.error("Error fetching first lesson slug:", err);
    }

    let level = c.level || 'L1';
    let subject = c.subject || 'General';
    let targetSlug = c.slug;

    if (slug === 'classical-mechanics' || slug === 'Classical_Mechanics' || c.id === 1) {
      level = 'L1'; subject = 'Physics'; targetSlug = 'Classical_Mechanics';
    } else if (slug === 'quantum-physics' || slug === 'Physique_Test_L2' || c.id === 2) {
      level = 'L2'; subject = 'Physics'; targetSlug = 'Physique_Test_L2';
    } else if (slug === 'cell-biology' || slug === 'Biologie_Test' || c.id === 3) {
      level = 'L1'; subject = 'Biology'; targetSlug = 'Cell_Biology';
    } else if (slug === 'molecular-genetics' || slug === 'Biologie_Test_L1' || c.id === 4) {
      level = 'L1'; subject = 'Biology'; targetSlug = 'Biologie_Test_L1';
    } else if (slug === 'constitutional-law' || slug === 'Droit_Test' || c.id === 5) {
      level = 'L1'; subject = 'Law'; targetSlug = 'Droit_Test';
    } else if (slug === 'Maths_Test' || c.id === 7) {
      level = 'L1'; subject = 'Mathematics'; targetSlug = 'Maths_Test';
    } else if (slug === 'Maths_Test_L1' || c.id === 8) {
      level = 'L1'; subject = 'Mathematics'; targetSlug = 'Maths_Test_L1';
    } else if (slug === 'Statistics' || c.id === 11) {
      level = 'L1'; subject = 'Mathematics'; targetSlug = 'Statistics';
    }

    window.location.href = getCoursePathHelper(level, subject, targetSlug, resolvedSlug, lang);
  };


  const getCoursePath = (c: any) => {
    const slug = c.slug;
    if (!slug) return '/catalog';
    if (slug === 'classical-mechanics' || slug === 'Classical_Mechanics' || c.id === 1) {
      return getCoursePathHelper('L1', 'Physics', 'Classical_Mechanics', 'introduction', lang);
    }
    if (slug === 'quantum-physics' || slug === 'Physique_Test_L2' || c.id === 2) {
      return getCoursePathHelper('L2', 'Physics', 'Physique_Test_L2', 'introduction', lang);
    }
    if (slug === 'cell-biology' || slug === 'Biologie_Test' || c.id === 3) {
      return getCoursePathHelper('L1', 'Biology', 'Cell_Biology', 'introduction', lang);
    }
    if (slug === 'molecular-genetics' || slug === 'Biologie_Test_L1' || c.id === 4) {
      return getCoursePathHelper('L1', 'Biology', 'Biologie_Test_L1', 'introduction', lang);
    }
    if (slug === 'constitutional-law' || slug === 'Droit_Test' || c.id === 5) {
      return getCoursePathHelper('L1', 'Law', 'Droit_Test', 'introduction', lang);
    }
    if (slug === 'Maths_Test' || c.id === 7) {
      return getCoursePathHelper('L1', 'Mathematics', 'Maths_Test', 'introduction', lang);
    }
    if (slug === 'Maths_Test_L1' || c.id === 8) {
      return getCoursePathHelper('L1', 'Mathematics', 'Maths_Test_L1', 'introduction', lang);
    }
    if (slug === 'Statistics' || c.id === 11) {
      return getCoursePathHelper('L1', 'Mathematics', 'Statistics', 'introduction', lang);
    }
    return getCoursePathHelper(c.level || 'L1', c.subject || 'General', c.slug, 'introduction', lang);
  };

  const getLocalizedTitle = (c: any) => {
    return dbService.getLocalizedCourseTitle(c, lang);
  };

  const getLocalizedSubject = (subj: string) => {
    if (!subj) return '';
    let key = subj.toLowerCase().replace(/\s+/g, '_');
    if (key === 'mathematics') key = 'math';
    return t[key] || subj;
  };

  const versionConflicts = React.useMemo(() => {
    if (!progress?.activeModules || courses.length === 0) return [];

    const enrolledCurricula = progress.activeModules.filter((m: any) => {
      const cd = courses.find((x: any) => x.id === m.id);
      return cd?.isCurriculum || m.isCurriculum;
    });

    const enrolledCurriculaDetails = enrolledCurricula.map((curr: any) => courses.find((cd: any) => cd.id === curr.id)).filter(Boolean);
    
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
        if (curr.childCourses && curr.childCourses.length > 0) {
          curr.childCourses.forEach((childId: number) => {
            const childDetails = courses.find((cd: any) => cd.id === childId);
            if (childDetails && childDetails.id !== standaloneDetails.id) {
              const childBaseSlug = getBaseSlug(childDetails.slug);
              if (childBaseSlug === baseSlug) {
                conflicts.push({
                  standalone: standaloneDetails,
                  curriculumChild: childDetails,
                  curriculum: curr
                });
              }
            }
          });
        }
      });
    });

    return conflicts;
  }, [progress, courses, dismissedConflicts]);

  const getRecommendations = () => {
    if (!progress?.activeModules || progress.activeModules.length === 0) {
      return [];
    }
    const activeModSlugs = progress.activeModules.map((m: any) => m.slug) || [];
    const completedSlugs = progress.activeModules.filter((m: any) => m.progress === 100).map((m: any) => m.slug) || [];

    // Candidates = all courses except already active/enrolled ones
    const candidates = courses.filter((c: any) => {
      return !activeModSlugs.includes(c.slug);
    });

    // Apply strict smart matching based only on completed curriculum slugs (no fallback to candidates or starters)
    let matched: any[] = [];
    
    const hasCompletedPhysics = completedSlugs.some((slug: string) => 
      slug === 'Classical_Mechanics' || slug === 'classical-mechanics' || slug === 'Maths_Test'
    );
    const hasCompletedBiology = completedSlugs.some((slug: string) => 
      slug === 'Cell_Biology' || slug === 'cell-biology' || slug === 'Biologie_Test'
    );

    if (hasCompletedPhysics) {
      matched = candidates.filter((c: any) => 
        c.slug === 'quantum-physics' || c.slug === 'Physique_Test_L2' || c.slug === 'Calculus_I' || c.slug === 'Maths_Test_L1'
      );
    } else if (hasCompletedBiology) {
      matched = candidates.filter((c: any) => 
        c.slug === 'molecular-genetics' || c.slug === 'Biologie_Test_L1'
      );
    }

    if (matched.length === 0) {
      return [];
    }

    // Slice to maximum 2 recommendations BEFORE filtering dismissed, so that dismissing does not pull subsequent candidate cards
    const baseRecommendations = matched.slice(0, 2);

    // Filter out dismissed ones from this fixed pair
    return baseRecommendations.filter(c => !dismissedRecIds.includes(c.id));
  };

  const enrollInRecommended = async (course: any) => {
    const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('op_user_profile') : null;
    const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('op_session') === 'true' : false;
    let userId = 'u1';
    
    if (loggedIn && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (e) {}
    }

    await dbService.enrollInCourse(userId, course.id);
    
    // Reload user progress from database/cache
    const { data: progressData } = await dbService.getUserProgress(userId, lang);
    setProgress(progressData);

    // Update locally enrolledIds
    const newEnrolled = progressData?.activeModules ? progressData.activeModules.map((m: any) => m.id) : [];
    setEnrolledIds(newEnrolled);
    
    // Dispatch progress updated event
    window.dispatchEvent(new Event('op_progress_updated'));
  };

  const [showTutorModal, setShowTutorModal] = useState(false);
  const [activeTutorId, setActiveTutorId] = useState('socratic');
  const [tutors, setTutors] = useState<any[]>([]);


  const getActiveTutorName = () => {
    const code = (lang || 'EN').toUpperCase();
    const tMatch = tutors.find(t => t.id === activeTutorId);
    if (!tMatch) return 'Socratic Coach';
    return tMatch.translations?.[code]?.name || tMatch.name || activeTutorId;
  };

  const handleSelectTutor = async (id: string) => {
    localStorage.setItem('op_active_tutor_personality', id);
    setActiveTutorId(id);
    
    // Sync with database if connected
    const savedProfile = localStorage.getItem('op_user_profile');
    const loggedIn = localStorage.getItem('op_session') === 'true';
    let userId = 'u1';
    
    if (loggedIn && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (e) {}
    }

    if (loggedIn && savedProfile) {
      try {
        const { supabase } = await import('@/lib/supabase');
        if (userId && userId !== 'u1') {
          await supabase
            .from('profiles')
            .update({ tutor_choice: id })
            .eq('id', userId);
          console.log(`Tutor choice updated in Supabase: ${id}`);
        }
      } catch (e) {
        console.error("Error updating tutor choice in Supabase:", e);
      }
    }
    
    // Notify all components of the active tutor change
    window.dispatchEvent(new Event('op_active_tutor_changed'));
    
    // Reload user progress immediately to update the pedagogical summary card in real-time!
    const { data: progressData } = await dbService.getUserProgress(userId, lang);
    setProgress(progressData);
  };

  useEffect(() => {
    async function loadProgress() {
      const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('op_user_profile') : null;
      const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('op_session') === 'true' : false;
      
      if (!loggedIn) {
        router.push('/login');
        return;
      }

      let userId = 'u1';
      
      if (loggedIn && savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          if (profile.id) userId = profile.id;
        } catch (e) {
          console.error("Failed to parse user profile for curriculum dashboard:", e);
        }
      }

      const { data: progressData } = await dbService.getUserProgress(userId, lang);
      setProgress(progressData);
      const { data: coursesData } = await dbService.getAllCourses();
      if (coursesData) setCourses(coursesData);
      
      const { data: achs } = await dbService.getAchievements();
      if (achs) setAchievements(achs);

      // Load tutor personalities dynamically from DB / mock
      const { data: tutorData } = await dbService.getTutorPersonalities();
      if (tutorData && tutorData.length > 0) setTutors(tutorData);
      
      const earned = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('op_earned_achievements') || '[]') : [];
      setEarnedIds(earned);

      // Compute enrolled IDs + curriculum revision date from Supabase fetched activeModules
      const ids: number[] = progressData?.activeModules ? progressData.activeModules.map((m: any) => m.id) : [];
      setEnrolledIds(ids);
      const revDate = progressService.getCurriculumLastRevision(ids);
      setCurriculumRevision(revDate);

      // Load user course feedbacks for all completed modules in parallel
      const completedModules = progressData?.activeModules?.filter((m: any) => m.progress === 100) || [];
      const feedbacksMap: Record<number, any> = {};
      await Promise.all(completedModules.map(async (m: any) => {
        try {
          const res = await dbService.getCourseFeedbacks(m.id.toString(), userId);
          if (res.data && res.data.length > 0) {
            feedbacksMap[m.id] = res.data.find((f: any) => f.user_id === userId || f.userId === userId);
          }
        } catch (err) {
          console.error("Error fetching feedback for course:", m.id, err);
        }
      }));
      setCourseFeedbacks(feedbacksMap);

      setLoading(false);
    }
    loadProgress();

    // Load bookmarks
    const savedBookmarks = localStorage.getItem('op_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    // Load active tutor
    setActiveTutorId(localStorage.getItem('op_active_tutor_personality') || 'socratic');

    // Load initial reading mode and define dynamic header buttons listener
    const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
    setReadingMode(savedMode);

    (window as any).setReadingMode = (mode: string) => {
      setReadingMode(mode);
      localStorage.setItem('op_reading_mode', mode);
    };
  }, [lang]);


  // Mobile app WebView synchronization
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView && progress && courses.length > 0) {
      try {
        const activeCoursesAll = progress.activeModules ? progress.activeModules.filter((c: any) => c.progress < 100) : [];
        const enrolledCurricula = progress.activeModules ? progress.activeModules.filter((m: any) => {
          const cd = courses.find((x: any) => x.id === m.id);
          return cd?.isCurriculum || m.isCurriculum;
        }) : [];
        
        const enrolledCurriculaDetails = enrolledCurricula.map((curr: any) => courses.find((cd: any) => cd.id === curr.id)).filter(Boolean);
        const curriculumChildIds = new Set<number>();
        enrolledCurriculaDetails.forEach((curr: any) => {
          if (curr.childCourses && curr.childCourses.length > 0) {
            curr.childCourses.forEach((id: number) => curriculumChildIds.add(id));
          }
        });

        const activeCourses = activeCoursesAll.filter((course: any) => {
          const courseDetails = courses.find((cd: any) => cd.slug === course.slug || cd.id === course.id);
          const isCurr = courseDetails?.isCurriculum || course.isCurriculum;
          if (isCurr) return true;
          if (curriculumChildIds.has(course.id)) return false;
          return true;
        });

        const syncData = {
          type: 'SYNC_CURRICULUM',
          lang: upperLang,
          labels: MOBILE_OFFLINE_STRINGS[upperLang] || MOBILE_OFFLINE_STRINGS.EN,
          payload: activeCourses.map((c: any) => {
            const cd = courses.find((x: any) => x.id === c.id);
            return {
              id: c.id,
              title: cd ? dbService.getLocalizedCourseTitle(cd, lang) : c.title,
              level: cd ? cd.level : c.level,
              subject: cd ? cd.subject : c.subject,
              slug: c.slug,
              progress: c.progress || 0,
              last_lesson_slug: c.last_lesson_slug || 'introduction'
            };
          })
        };

        console.log("[Mobile Sync] Posting progress to React Native WebView:", syncData);
        (window as any).ReactNativeWebView.postMessage(JSON.stringify(syncData));
      } catch (err) {
        console.error("Failed to sync progress with mobile app:", err);
      }
    }
  }, [progress, courses, lang]);


  const getCourseEarnedAchievements = (courseId: number, courseSlug: string) => {
    const courseEarned: any[] = [];
    const courseIdStr = courseId.toString();
    
    // 1. Fast Learner check
    const fastLearnerAch = achievements.find(a => a.threshold.toLowerCase().includes('3 days'));
    if (fastLearnerAch && earnedIds.includes(fastLearnerAch.id)) {
      const enrollDateStr = localStorage.getItem('op_enroll_date_' + courseIdStr) || localStorage.getItem('op_enroll_date_' + courseSlug);
      if (enrollDateStr) {
        const diffDays = (Date.now() - new Date(enrollDateStr).getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays <= 3) {
          courseEarned.push(fastLearnerAch);
        }
      } else {
        courseEarned.push(fastLearnerAch);
      }
    }
    
    // 2. Perfect Score check
    const perfectScoreAch = achievements.find(a => a.threshold.toLowerCase().includes('100% score'));
    if (perfectScoreAch && earnedIds.includes(perfectScoreAch.id)) {
      const quizResults = JSON.parse(localStorage.getItem('op_quiz_results') || '{}');
      const qr = quizResults[courseIdStr] || quizResults[courseSlug];
      if (qr && qr.correctAnswers === qr.totalQuestions && qr.totalQuestions > 0) {
        courseEarned.push(perfectScoreAch);
      }
    }
    
    // 3. Course completion milestones check (e.g., "completed 1 course", "completed 5 courses")
    const completedCount = Object.values(JSON.parse(localStorage.getItem('op_course_progress') || '{}')).filter(v => v === 100).length;
    achievements.forEach(a => {
      const th = a.threshold.toLowerCase();
      if (th.includes('course') && !th.includes('3 days')) {
        if (earnedIds.includes(a.id)) {
          const reqCount = parseInt(th.replace(/\D/g, '')) || 1;
          if (completedCount >= reqCount) {
            courseEarned.push(a);
          }
        }
      }
    });
    
    return Array.from(new Set(courseEarned));
  };

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('op_bookmarks', JSON.stringify(newBookmarks));
  };

  const handleOptOut = async (id: number, keepChildCoursesOpt?: boolean) => {
    const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('op_user_profile') : null;
    const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('op_session') === 'true' : false;
    let userId = 'u1';
    
    if (loggedIn && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (e) {}
    }

    await dbService.abandonCourse(userId, id);

    // If opting out of a curriculum and the user selected not to keep progress/enrolments of child courses
    if (abandonTarget && abandonTarget.isCurriculum && keepChildCoursesOpt === false) {
      if (abandonTarget.childCourses && abandonTarget.childCourses.length > 0) {
        for (const childId of abandonTarget.childCourses) {
          await dbService.abandonCourse(userId, childId);
        }
      }
    }

    // Reload user progress from database/cache
    const { data: progressData } = await dbService.getUserProgress(userId, lang);
    setProgress(progressData);

    // Update locally enrolledIds
    const newEnrolled = progressData?.activeModules ? progressData.activeModules.map((m: any) => m.id) : [];
    setEnrolledIds(newEnrolled);

    // Dispatch progress updated event
    window.dispatchEvent(new Event('op_progress_updated'));
  };

  if (loading || !progress) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const modeStyles = {
    dark: "bg-slate-950 text-white font-sans",
    default: "bg-slate-950 text-white font-sans",
    paper: "bg-[#fcfaf2] text-slate-900 font-serif",
    focus: "bg-black text-slate-400 font-sans"
  };

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

  const hasCoursesInOtherLangs = progress?.activeModules ? progress.activeModules.some((course: any) => {
    const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
    if (!courseDetails || !courseDetails.languages || courseDetails.languages.length === 0) return false;
    return !courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase());
  }) : false;

  return (
    <div className={`min-h-screen transition-colors duration-500 theme-${readingMode} ${modeStyles[readingMode as keyof typeof modeStyles] || modeStyles.dark}`}>
      <TopNav showReadingModeSelector={true} />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <header className="mb-12">
          <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
             <GraduationCap className="w-4 h-4" /> {t.curriculum}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{t.my_curriculum}</h1>
          <p className="text-slate-500 mt-4 font-medium">{t.curriculum_overview}</p>
        </header>

        {hasCoursesInOtherLangs && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-br from-amber-600/10 via-slate-900/40 to-slate-955 border border-amber-500/20 rounded-[32px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Globe className="w-24 h-24 text-amber-400" />
            </div>
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                <Globe className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                  {t.curriculum_lang_warning_title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {t.curriculum_lang_warning_desc.replace('{lang}', lang.toUpperCase())}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {versionConflicts.length > 0 && versionConflicts.map((conflict: any) => (
          <motion.div 
            key={`conflict-${conflict.standalone.id}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 p-6 bg-gradient-to-br from-red-600/10 via-slate-900/40 to-slate-950 border border-red-500/20 rounded-[32px] relative overflow-hidden animate-pulse"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Icons.AlertTriangle className="w-24 h-24 text-red-400" />
            </div>
            
            <button
              onClick={() => setDismissedConflicts(prev => [...prev, conflict.standalone.id])}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-850 flex items-center justify-center transition-all cursor-pointer z-30"
              title={DISMISS_ALERT[lang.toUpperCase()] || DISMISS_ALERT.EN}
            >
              <Icons.X className="w-4 h-4" />
            </button>

            <div className="flex gap-4 items-start relative z-10 mr-8">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
                <Icons.AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2 flex-1">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
                  {VERSION_CONFLICT_TITLE[lang.toUpperCase()] || VERSION_CONFLICT_TITLE.EN}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {getConflictDescription(conflict, lang)}
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setAbandonTarget(conflict.standalone);
                    }}
                    className="px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    {ABANDON_STANDALONE_COURSE[lang.toUpperCase()] || ABANDON_STANDALONE_COURSE.EN}
                  </button>
                  <button
                    onClick={() => setDismissedConflicts(prev => [...prev, conflict.standalone.id])}
                    className="px-3.5 py-1.5 bg-slate-950/45 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    {IGNORE_CONFLICT[lang.toUpperCase()] || IGNORE_CONFLICT.EN}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}


        {/* AI PEDAGOGICAL SUMMARY */}
        {progress.activeModules && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-10 bg-gradient-to-br from-blue-600/10 via-slate-900/40 to-slate-950 border border-blue-500/20 rounded-[60px] relative overflow-hidden ai-summary-card"
          >
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Brain className="w-32 h-32 text-blue-400" />
             </div>
             <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-3">
                     <Sparkles className="w-4 h-4 animate-pulse" /> {t.tutor_summary}
                  </h3>
                  <button 
                    onClick={() => setShowTutorModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] z-20 self-start sm:self-auto"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>
                      {t.tutor}: {getActiveTutorName()}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
                <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-200 max-w-3xl italic">
                   "{progress.aiSummary}"
                </p>
             </div>
          </motion.section>
        )}

        {/* STATS GRID */}
        {progress.activeModules && progress.activeModules.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">

            {/* 🔥 Study Streak */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-orange-500/30 transition-all">
              <div className="text-3xl mb-4">🔥</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
                {t.study_streak}
              </p>
              <p className="text-3xl font-black text-white">
                {progress.studyStreakDays ?? 0}
                <span className="text-base text-slate-500 font-bold ml-2">
                  {(progress.studyStreakDays ?? 0) === 1 ? t.day : t.days}
                </span>
              </p>
              <p className="text-[9px] text-slate-600 mt-2 font-medium">
                {(progress.studyStreakDays ?? 0) >= 7
                  ? (STREAK_7_TITLE[lang] || STREAK_7_TITLE.EN)
                  : (progress.studyStreakDays ?? 0) >= 3
                  ? (STREAK_3_TITLE[lang] || STREAK_3_TITLE.EN)
                  : (STREAK_0_TITLE[lang] || STREAK_0_TITLE.EN)}
              </p>
            </div>

            {/* ⭐ Mastery Points — always grows */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-violet-500/30 transition-all">
              <Sparkles className="w-8 h-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
                {t.mastery_points}
              </p>
              <p className="text-3xl font-black text-white">
                {progress.masteryPoints ?? 0}
                <span className="text-base text-slate-500 font-bold ml-2">pt{(progress.masteryPoints ?? 0) !== 1 ? 's' : ''}</span>
              </p>
              <p className="text-[9px] font-black uppercase tracking-wider mt-2 text-violet-400">
                {(progress.masteryPoints ?? 0) >= 50 ? t.mastery_master : (progress.masteryPoints ?? 0) >= 25 ? t.mastery_expert : (progress.masteryPoints ?? 0) >= 10 ? t.mastery_scholar : t.mastery_apprentice}
              </p>
            </div>

            {/* ⏱ Total Study Hours */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-emerald-500/30 transition-all">
              <Clock className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{t.learning_time}</p>
              <p className="text-3xl font-black text-white">{progress.learningTime || "0h 0m"}</p>
              <p className="text-[9px] text-slate-600 mt-2 font-medium">
                {(progress.totalMinutes ?? 0) >= 600
                  ? (STUDY_600_TITLE[lang] || STUDY_600_TITLE.EN)
                  : (progress.totalMinutes ?? 0) >= 120
                  ? (STUDY_120_TITLE[lang] || STUDY_120_TITLE.EN)
                  : (STUDY_0_TITLE[lang] || STUDY_0_TITLE.EN)}
              </p>
            </div>

            {/* 📚 Courses Mastered */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-blue-500/30 transition-all">
              <GraduationCap className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
                {t.courses_mastered}
              </p>
              <p className="text-3xl font-black text-white">{progress.completedCount ?? 0}</p>
              <p className="text-[9px] text-slate-555 mt-2 font-medium flex items-center gap-1">
                <span className="text-blue-400 font-black">{progress.inProgressCount ?? 0}</span>
                &nbsp;{t.in_progress_of}
                &nbsp;<span className="text-slate-400 font-black">{progress.activeModules?.length ?? 0}</span>
                &nbsp;{t.enrolled}
              </p>
            </div>
          </div>
        )}

        {(() => {
          const activeCoursesAll = progress.activeModules ? progress.activeModules.filter((c: any) => c.progress < 100) : [];
          const completedCoursesAll = progress.activeModules ? progress.activeModules.filter((c: any) => c.progress === 100) : [];

          const enrolledCurricula = progress.activeModules ? progress.activeModules.filter((m: any) => {
            const cd = courses.find((x: any) => x.id === m.id);
            return cd?.isCurriculum || m.isCurriculum;
          }) : [];
          
          const enrolledCurriculaDetails = enrolledCurricula.map((curr: any) => courses.find((cd: any) => cd.id === curr.id)).filter(Boolean);
          const curriculumChildIds = new Set<number>();
          enrolledCurriculaDetails.forEach((curr: any) => {
            if (curr.childCourses && curr.childCourses.length > 0) {
              curr.childCourses.forEach((id: number) => curriculumChildIds.add(id));
            }
          });

          const activeCourses = activeCoursesAll.filter((course: any) => {
            const courseDetails = courses.find((cd: any) => cd.slug === course.slug || cd.id === course.id);
            const isCurr = courseDetails?.isCurriculum || course.isCurriculum;
            if (isCurr) return true;
            if (curriculumChildIds.has(course.id)) return false;
            return true;
          });

          const completedCourses = completedCoursesAll.filter((course: any) => {
            const courseDetails = courses.find((cd: any) => cd.slug === course.slug || cd.id === course.id);
            const isCurr = courseDetails?.isCurriculum || course.isCurriculum;
            if (isCurr) return true;
            if (curriculumChildIds.has(course.id)) return false;
            return true;
          });

          return (
            <>
              {activeCourses.length > 0 && (
                <section aria-label={t.active_modules}>
                   <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
                      <Book className="w-6 h-6 text-blue-500" /> {t.active_modules}
                   </h2>
                   <div className="grid md:grid-cols-2 gap-8" role="list">
                     {activeCourses.map((course: any) => {
                       const courseDetails = courses.find((cd: any) => cd.slug === course.slug || cd.id === course.id);
                       const isCurr = courseDetails?.isCurriculum || course.isCurriculum;
                       const upperLang = lang.toUpperCase();
                       
                       let ratingCount = courseDetails?.ratingCount || 0;
                       let averageRating = courseDetails?.averageRating || 0;
                       let totalHours = courseDetails?.hours || 150;

                       if (isCurr && courseDetails?.childCourses && courseDetails.childCourses.length > 0) {
                         let sumHours = 0;
                         let sumWeightedRating = 0;
                         let sumRatingCount = 0;
                         courseDetails.childCourses.forEach((cId: number) => {
                           const child = courses.find((c: any) => c.id === cId);
                           if (child) {
                             const childHours = child.hours || 150;
                             const childRating = child.averageRating || 3.4;
                             sumHours += childHours;
                             sumWeightedRating += childRating * childHours;
                             sumRatingCount += child.ratingCount || 12;
                           }
                         });
                         totalHours = sumHours > 0 ? sumHours : totalHours;
                         averageRating = sumHours > 0 ? sumWeightedRating / sumHours : averageRating;
                         ratingCount = sumRatingCount > 0 ? sumRatingCount : ratingCount;
                       }
                       
                       // Check if this course is a child of any enrolled curriculum and if it is multilingual
                       const enrolledCurricula = activeCoursesAll.filter((c: any) => {
                         const cd = courses.find((x: any) => x.id === c.id);
                         return cd?.isCurriculum || c.isCurriculum;
                       }).map((c: any) => courses.find((x: any) => x.id === c.id)).filter(Boolean);

                       const parentCurriculum = enrolledCurricula.find((curr: any) => curr?.childCourses?.includes(course.id));
                       const isMultilingualParent = parentCurriculum && parentCurriculum.languages && parentCurriculum.languages.length > 1;
                       const isMandatoryChild = parentCurriculum && 
                         (!parentCurriculum.optionalCourses || !parentCurriculum.optionalCourses.includes(course.id));
                       const courseLang = courseDetails?.languages?.[0] || 'en';

                       const cardContent = (
                          <div 
                            role="listitem" 
                            aria-label={`${course.title}, ${getLocalizedSubject(course.subject)}, ${course.progress}% ${t.completed}`}
                            className={`p-8 bg-slate-900/40 border ${isCurr ? 'border-violet-500/30 hover:border-violet-400/50 shadow-violet-500/5 bg-gradient-to-br from-violet-955/5 via-slate-900/40 to-slate-955/20' : 'border-blue-500/20 shadow-blue-500/5 bg-gradient-to-br from-blue-955/5 via-slate-900/40 to-slate-950/20'} rounded-[40px] shadow-2xl flex flex-col h-full group relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1`}
                          >
                              <div className="flex justify-between items-center mb-6 gap-2 w-full">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isCurr ? 'bg-violet-600/10 text-violet-400' : 'bg-blue-600/10 text-blue-400'}`}>
                                    {isCurr ? <GraduationCap className="w-6 h-6 text-violet-400" /> : <Book className="w-6 h-6" />}
                                 </div>
                                 <div className="flex gap-2 items-center flex-1 justify-end flex-wrap">
                                    {/* 1. Type Badge */}
                                    {isCurr ? (
                                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 flex items-center gap-1.5 select-none">
                                        <Icons.Layers className="w-3.5 h-3.5 text-violet-400" />
                                        Curriculum
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1.5 select-none">
                                        <Icons.BookOpen className="w-3.5 h-3.5 text-blue-400" />
                                        {COURSE_LABEL[upperLang] || COURSE_LABEL.EN}
                                      </span>
                                    )}

                                    {/* Mandatory vs Optional Status Badge */}
                                    {parentCurriculum && !isCurr && (
                                      isMandatoryChild ? (
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-500 flex items-center gap-1.5 select-none shadow-[0_0_15px_rgba(245,158,11,0.05)] animate-pulse">
                                          <Icons.Lock className="w-3.5 h-3.5 text-amber-500" />
                                          {MANDATORY_LABEL[upperLang] || MANDATORY_LABEL.EN}
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-400 flex items-center gap-1.5 select-none">
                                          <Icons.Unlock className="w-3.5 h-3.5 text-slate-400" />
                                          {OPTIONAL_LABEL[upperLang] || OPTIONAL_LABEL.EN}
                                        </span>
                                      )
                                    )}

                                    {/* Multilingual / translation mismatch badge */}
                                    {!isCurr && courseDetails?.languages && courseDetails.languages.length > 0 && !courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase()) && (
                                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-1" title={NOT_AVAILABLE_IN_LANG[upperLang] || NOT_AVAILABLE_IN_LANG.EN}>
                                        <Icons.Globe className="w-3.5 h-3.5 animate-pulse" />
                                        {courseDetails.languages.join(', ').toUpperCase()}
                                      </span>
                                    )}

                                    {/* 2. Stars Rating */}
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1.5 select-none" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} reviews`}>
                                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                      {averageRating > 0 ? averageRating.toFixed(1) : (isCurr ? "4.8" : "3.4")} ({ratingCount > 0 ? ratingCount : (isCurr ? 24 : 12)})
                                    </span>

                                    {/* 3. Volume Horaire (Hours) */}
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1.5 select-none">
                                      <Clock className="w-3.5 h-3.5" />
                                      {totalHours}H
                                    </span>

                                    {/* 4. Level Badge */}
                                    <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">
                                      {formatCourseLevel(course.level, lang)}
                                    </span>

                                    {/* 5. Syllabus Link Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedEnrollCourse(courseDetails || course);
                                      }}
                                      title="Syllabus"
                                      className="px-3 py-1.5 bg-slate-950/40 border border-slate-800 hover:border-slate-700 text-blue-400 hover:text-blue-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
                                    >
                                      <Icons.BookOpen className="w-3.5 h-3.5" />
                                      Syllabus
                                    </button>

                                    {/* 6. Bookmark Toggle Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => toggleBookmark(course.id, e)}
                                      aria-pressed={bookmarks.includes(course.id)}
                                      title={bookmarks.includes(course.id) 
                                        ? (REMOVE_BOOKMARK_LABEL[upperLang] || REMOVE_BOOKMARK_LABEL.EN) 
                                        : (SAVE_COURSE_LABEL[upperLang] || SAVE_COURSE_LABEL.EN)}
                                      className={`p-2 border rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                                        bookmarks.includes(course.id) 
                                          ? 'text-blue-400 bg-blue-400/10 border-blue-500/20' 
                                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                      }`}
                                    >
                                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(course.id) ? 'fill-current' : ''}`} />
                                    </button>

                                    {/* 7. Trash / Abandon Icon Button */}
                                    {isMandatoryChild ? (
                                      <div
                                        title={MANDATORY_CURRICULUM_COURSE_LABEL[upperLang] || MANDATORY_CURRICULUM_COURSE_LABEL.EN}
                                        className="p-2 rounded-xl text-slate-655 bg-slate-950/30 border border-slate-850 flex items-center justify-center cursor-not-allowed"
                                      >
                                        <Icons.Lock className="w-4 h-4" />
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setAbandonTarget(courseDetails || course);
                                        }}
                                        title={t.abandon}
                                        className="p-2 bg-slate-950/40 border border-slate-800 hover:border-red-500/30 text-red-500 hover:text-red-400 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                      >
                                        <Icons.Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                 </div>
                              </div>
                              <h3 className="text-xl font-black mb-2 group-hover:text-blue-400 transition-colors">
                                {getLocalizedTitle(courseDetails || course)}{isMultilingualParent ? ` (${courseLang.toUpperCase()})` : ''}
                              </h3>
                              <p className="text-sm text-slate-500 mb-6">{getLocalizedSubject(course.subject)}</p>
                              
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black uppercase text-slate-600">{t.progress}</span>
                                <span className={`text-[9px] font-black ${isCurr ? 'text-violet-400' : 'text-blue-500'}`}>{course.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${course.progress}%` }}
                                  className={`h-full ${isCurr ? 'bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]' : 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]'}`} 
                                />
                              </div>

                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider mb-6 w-full">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  {t.time_spent} <strong className="text-white">{progressService.getLessonTimeForCourse(course.slug)}m</strong>
                                </span>
                                <span>
                                  {t.expected_time} <strong className="text-slate-400">{(courseDetails?.hours ?? (isCurr ? 300 : 150))}h</strong>
                                </span>
                              </div>

                              <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center mt-auto">
                                 <span className={`text-[9px] font-black uppercase tracking-widest ${isCurr ? 'text-violet-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                                    {isCurr ? t.manage_curriculum : t.continue_course}
                                 </span>
                                 <ChevronRight className={`w-4 h-4 ${isCurr ? 'text-violet-400' : 'text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1'} transition-all`} />
                              </div>
                          </div>
                       );

                       if (isCurr) {
                         return (
                           <div key={course.id} onClick={() => setSelectedCurriculumForDrillDown(courseDetails || course)} className="group cursor-pointer">
                             {cardContent}
                           </div>
                         );
                       }

                       return (
                          <div 
                            key={course.id} 
                            onClick={async () => { 
                              handleCourseClick(courseDetails || course); 
                              await navigateToCourseDirect(courseDetails || course); 
                            }} 
                            className="group cursor-pointer" 
                          >
                            {cardContent}
                          </div>
                       );
                     })}
                   </div>
                </section>
              )}

              {completedCourses.length > 0 && (
                <section className="mt-20">
                   <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-emerald-500">
                      <Award className="w-6 h-6 text-emerald-500 animate-pulse" /> {getLocalizedLabel('completed_modules', lang)}
                   </h2>
                   <div className="grid md:grid-cols-2 gap-8">
                     {completedCourses.map((course: any) => {
                        const getCoursePath = (c: any) => {
                          const slug = c.slug;
                          if (!slug) return '/catalog';
                          if (slug === 'classical-mechanics' || slug === 'Classical_Mechanics' || c.id === 1) {
                            return '/L1/Physics/Classical_Mechanics/introduction';
                          }
                          if (slug === 'quantum-physics' || slug === 'Physique_Test_L2' || c.id === 2) {
                            return '/L2/Physics/Physique_Test_L2/introduction';
                          }
                          if (slug === 'cell-biology' || slug === 'Biologie_Test' || c.id === 3) {
                            return '/L1/Biology/Cell_Biology/introduction';
                          }
                          if (slug === 'molecular-genetics' || slug === 'Biologie_Test_L1' || c.id === 4) {
                            return '/L1/Biology/Biologie_Test_L1/introduction';
                          }
                          if (slug === 'constitutional-law' || slug === 'Droit_Test' || c.id === 5) {
                            return '/L1/Law/Droit_Test/introduction';
                          }
                          if (slug === 'Maths_Test' || c.id === 7) {
                            return '/L1/Mathematics/Maths_Test/introduction';
                          }
                          if (slug === 'Maths_Test_L1' || c.id === 8) {
                            return '/L1/Mathematics/Maths_Test_L1/introduction';
                          }
                          if (slug === 'Statistics' || c.id === 11) {
                            return '/L1/Mathematics/Statistics/introduction';
                          }
                          const cleanSubject = c.subject ? c.subject.replace(/\s+/g, '_') : 'General';
                          return `/${c.level || 'L1'}/${cleanSubject}/${c.slug}/introduction`;
                        };

                        const getLocalizedTitle = (c: any) => {
                          return dbService.getLocalizedCourseTitle(c, lang);
                        };

                        const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
                        const isCurr = courseDetails?.isCurriculum || course.isCurriculum;
                        
                        let ratingCount = courseDetails?.ratingCount || 0;
                        let averageRating = courseDetails?.averageRating || 0;
                        let totalHours = courseDetails?.hours || 150;

                        if (isCurr && courseDetails?.childCourses && courseDetails.childCourses.length > 0) {
                          let sumHours = 0;
                          let sumWeightedRating = 0;
                          let sumRatingCount = 0;
                          courseDetails.childCourses.forEach((cId: number) => {
                            const child = courses.find((c: any) => c.id === cId);
                            if (child) {
                              const childHours = child.hours || 150;
                              const childRating = child.averageRating || 3.4;
                              sumHours += childHours;
                              sumWeightedRating += childRating * childHours;
                              sumRatingCount += child.ratingCount || 12;
                            }
                          });
                          totalHours = sumHours > 0 ? sumHours : totalHours;
                          averageRating = sumHours > 0 ? sumWeightedRating / sumHours : averageRating;
                          ratingCount = sumRatingCount > 0 ? sumRatingCount : ratingCount;
                        }

                        // Check if this course is a child of any enrolled curriculum and if it is multilingual
                        const enrolledCurricula = (progress.activeModules || []).filter((c: any) => {
                          const cd = courses.find((x: any) => x.id === c.id);
                          return cd?.isCurriculum || c.isCurriculum;
                        }).map((c: any) => courses.find((x: any) => x.id === c.id)).filter(Boolean);

                        const parentCurriculum = enrolledCurricula.find((curr: any) => curr?.childCourses?.includes(course.id));
                        const isMultilingualParent = parentCurriculum && parentCurriculum.languages && parentCurriculum.languages.length > 1;
                        const courseLang = courseDetails?.languages?.[0] || 'en';

                        const earnedBadges = getCourseEarnedAchievements(course.id, course.slug);
                        const feedback = courseFeedbacks[course.id];
                        const hasReview = feedback !== undefined;

                        const cardContent = (
                          <div 
                            role="listitem"
                            aria-label={`${course.title}, ${getLocalizedSubject(course.subject)}, 100% ${t.completed}`}
                            className={`p-8 bg-slate-900/40 border ${isCurr ? 'border-violet-500/30 shadow-violet-500/5 bg-gradient-to-br from-violet-955/5 via-slate-900/40 to-slate-950/20' : 'border-emerald-500/20 shadow-emerald-500/5 bg-gradient-to-br from-emerald-955/5 via-slate-900/40 to-slate-950/20'} rounded-[40px] shadow-2xl flex flex-col h-full relative overflow-hidden`}
                          >
                             {/* Corner Ribbon */}
                             <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                               <div className={`absolute top-6 -right-8 w-[150px] bg-gradient-to-r ${isCurr ? 'from-violet-600 to-fuchsia-400' : 'from-emerald-600 to-teal-400'} text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 rotate-45 shadow-xl border-y border-white/20 select-none`}>
                                 {COMPLETED_LABEL[upperLang] || COMPLETED_LABEL.EN}
                               </div>
                             </div>

                             <div className="flex justify-between items-center mb-6 gap-2 w-full">
                                <div className={`w-12 h-12 ${isCurr ? 'bg-violet-600/10 text-violet-400' : 'bg-emerald-600/10 text-emerald-400'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                                   {isCurr ? <GraduationCap className="w-6 h-6" /> : <Book className="w-6 h-6" />}
                                </div>
                                <div className="flex gap-2 items-center flex-1 justify-end flex-wrap mr-8">
                                   {/* 1. Type Badge */}
                                   {isCurr ? (
                                     <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 flex items-center gap-1.5 select-none">
                                       <Icons.Layers className="w-3.5 h-3.5 text-violet-400" />
                                       Curriculum
                                     </span>
                                   ) : (
                                     <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1.5 select-none">
                                       <Icons.BookOpen className="w-3.5 h-3.5 text-blue-400" />
                                        {COURSE_LABEL[upperLang] || COURSE_LABEL.EN}
                                     </span>
                                   )}

                                   {/* Multilingual / translation mismatch badge */}
                                   {!isCurr && courseDetails?.languages && courseDetails.languages.length > 0 && !courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase()) && (
                                     <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-1" title={NOT_AVAILABLE_IN_LANG[upperLang] || NOT_AVAILABLE_IN_LANG.EN}>
                                       <Icons.Globe className="w-3.5 h-3.5 animate-pulse" />
                                       {courseDetails.languages.join(', ').toUpperCase()}
                                     </span>
                                   )}

                                   {/* 2. Stars Rating */}
                                   <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1.5 select-none" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} reviews`}>
                                     <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                     {averageRating > 0 ? averageRating.toFixed(1) : (isCurr ? "4.8" : "3.4")} ({ratingCount > 0 ? ratingCount : (isCurr ? 24 : 12)})
                                   </span>

                                   {/* 3. Volume Horaire (Hours) */}
                                   <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1.5 select-none">
                                     <Clock className="w-3.5 h-3.5" />
                                     {totalHours}H
                                   </span>

                                   {/* 4. Level Badge */}
                                   <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">
                                     {formatCourseLevel(course.level, lang)}
                                   </span>

                                   {/* 5. Syllabus Link Button */}
                                   <button
                                     type="button"
                                     onClick={(e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       setSelectedEnrollCourse(courseDetails || course);
                                     }}
                                     title="Syllabus"
                                      className="px-3 py-1.5 bg-slate-950/40 border border-slate-800 hover:border-slate-700 text-blue-400 hover:text-blue-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
                                   >
                                      <Icons.BookOpen className="w-3.5 h-3.5" />
                                      Syllabus
                                   </button>

                                   {/* 6. Bookmark Toggle Button */}
                                   <button
                                     type="button"
                                     onClick={(e) => toggleBookmark(course.id, e)}
                                     aria-pressed={bookmarks.includes(course.id)}
                                     title={bookmarks.includes(course.id) 
                                       ? (REMOVE_BOOKMARK_LABEL[upperLang] || REMOVE_BOOKMARK_LABEL.EN) 
                                       : (SAVE_COURSE_LABEL[upperLang] || SAVE_COURSE_LABEL.EN)}
                                     className={`p-2 border rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                                       bookmarks.includes(course.id) 
                                         ? 'text-blue-400 bg-blue-400/10 border-blue-500/20' 
                                         : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                     }`}
                                   >
                                     <Bookmark className={`w-4 h-4 ${bookmarks.includes(course.id) ? 'fill-current' : ''}`} />
                                   </button>
                                </div>
                             </div>

                             <h3 className={`text-xl font-black mb-2 text-white group-hover:${isCurr ? 'text-violet-400' : 'text-emerald-400'} transition-colors`}>
                               {getLocalizedTitle(courseDetails || course)}{isMultilingualParent ? ` (${courseLang.toUpperCase()})` : ''}
                             </h3>
                             <p className="text-sm text-slate-500 mb-2">{getLocalizedSubject(course.subject)}</p>

                             {/* Dynamic miniature badge grid */}
                             {earnedBadges.length > 0 && (
                               <div className="flex gap-1.5 flex-wrap mb-4" role="group" aria-label={EARNED_BADGES_LABEL[upperLang] || EARNED_BADGES_LABEL.EN}>
                                 {earnedBadges.map((ach) => {
                                   const badge = BADGE_LIBRARY.find(b => b.id === ach.icon) || { iconName: 'Award', gradient: 'from-blue-500 to-indigo-500' };
                                   const IconComp = (Icons as any)[badge.iconName] || Icons.Award;
                                   return (
                                     <div
                                       key={ach.id}
                                       className={`w-6 h-6 rounded-lg bg-gradient-to-br ${badge.gradient} flex items-center justify-center text-white shrink-0 shadow-sm border border-white/10`}
                                       title={getAchievementTranslation(ach, 'name', lang)}
                                     >
                                       <IconComp className="w-3.5 h-3.5" />
                                     </div>
                                   );
                                 })}
                               </div>
                             )}
                             
                             <div className="mt-auto">
                                <div className="flex justify-between items-center mb-2">
                                   <span className="text-[9px] font-black uppercase text-slate-600">{STATUS_LABEL[upperLang] || STATUS_LABEL.EN}</span>
                                   <span className={`text-[9px] font-black ${isCurr ? 'text-violet-400' : 'text-emerald-400'}`}>100% {COMPLETED_LABEL[upperLang] || COMPLETED_LABEL.EN}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
                                   <div className={`h-full ${isCurr ? 'bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]' : 'bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.6)]'}`} style={{ width: '100%' }} />
                                </div>
                                
                                {/* Evaluation Popup Action trigger */}
                                <div 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedReviewCourse(courseDetails || course);
                                    setIsReviewReadOnly(hasReview);
                                    setShowReviewModal(true);
                                  }}
                                  className="pt-4 border-t border-slate-800/50 flex justify-between items-center cursor-pointer group/btn"
                                >
                                   <span className={`text-[9px] font-black uppercase tracking-widest text-slate-550 group-hover:${isCurr ? 'text-violet-400' : 'text-emerald-400'} transition-colors`}>
                                      {hasReview 
                                        ? (VIEW_REVIEW_LABEL[upperLang] || VIEW_REVIEW_LABEL.EN) 
                                        : (REVIEW_COURSE_LABEL[upperLang] || REVIEW_COURSE_LABEL.EN)}
                                   </span>
                                   <ChevronRight className={`w-4 h-4 text-slate-500 group-hover:${isCurr ? 'text-violet-400' : 'text-emerald-400'} group-hover:translate-x-1 transition-all`} />
                                </div>
                             </div>
                          </div>
                        );

                        if (isCurr) {
                          return (
                            <div key={course.id} onClick={() => setSelectedCurriculumForDrillDown(courseDetails || course)} className="group cursor-pointer">
                              {cardContent}
                            </div>
                          );
                        }

                        return (
                          <div 
                            key={course.id} 
                            onClick={async () => { 
                              handleCourseClick(courseDetails || course); 
                              await navigateToCourseDirect(courseDetails || course); 
                            }} 
                            className="group cursor-pointer" 
                          >
                            {cardContent}
                          </div>
                        );
                      })}
                   </div>
                </section>
              )}

              {activeCourses.length === 0 && completedCourses.length === 0 && (
                <div className="p-16 border border-slate-850 rounded-[48px] bg-slate-900/10 text-center max-w-2xl mx-auto my-12 backdrop-blur-3xl shadow-xl">
                  <Book className="w-16 h-16 text-slate-650 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-white mb-3">
                    {t.empty_curriculum_title}
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    {t.empty_curriculum_desc}
                  </p>
                  <Link href="/catalog" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg transition-all inline-block hover:scale-105 active:scale-95">
                    {t.empty_curriculum_btn}
                  </Link>
                </div>
              )}
            </>
          );
        })()}

          {/* RECOMMENDED NEXT STEPS (POURSUITES D'ÉTUDES) */}
          {progress.activeModules && progress.activeModules.length > 0 && (() => {
            const recommendations = getRecommendations();
            if (recommendations.length === 0) return null;
            
            return (
              <section className="mt-20 p-8 rounded-[48px] bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-slate-950/20 border border-blue-500/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-black flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                        <svg className="w-6 h-6 text-blue-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        {t.recommended_next_steps}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {t.recommended_next_steps_desc}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {recommendations.map((recCourse: any) => {
                      return (
                        <div 
                          key={recCourse.id}
                          className="group block h-full relative"
                        >
                          {/* Absolute positioned close/dismiss button on each card */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDismissRecommendation(recCourse.id);
                            }}
                            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-850 flex items-center justify-center transition-all cursor-pointer z-30"
                            title={DISMISS_RECOMMENDATION_LABEL[upperLang] || DISMISS_RECOMMENDATION_LABEL.EN}
                          >
                            <Icons.X className="w-4 h-4" />
                          </button>

                          <div 
                            onClick={() => setSelectedEnrollCourse(recCourse)}
                            className="p-8 bg-slate-900/40 border border-slate-880/50 rounded-[40px] hover:border-blue-500/50 transition-all shadow-2xl hover:shadow-blue-600/10 flex flex-col h-full backdrop-blur-xl relative overflow-hidden cursor-pointer"
                          >
                            
                            {/* Corner ribbon: NEW takes priority over REVISED */}
                            {(() => {
                              const isNew = isCourseNew(recCourse);
                              const isRecentlyRevised = !isNew &&
                                recCourse.last_revision_date &&
                                (Date.now() - new Date(recCourse.last_revision_date).getTime()) < 30 * 24 * 60 * 60 * 1000;
                              if (isNew) return (
                                <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                                  <div className="absolute top-6 -left-8 w-[150px] bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 -rotate-45 shadow-xl border-y border-white/20 select-none">
                                    {t.new_badge || 'New'}
                                  </div>
                                </div>
                              );
                              if (isRecentlyRevised) return (
                                <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                                  <div className="absolute top-6 -left-8 w-[150px] bg-gradient-to-r from-emerald-600 to-teal-400 text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 -rotate-45 shadow-xl border-y border-white/20 select-none">
                                    {t.revised_badge || 'Revised'}
                                  </div>
                                </div>
                              );
                              return null;
                            })()}

                            {(() => {
                              const ratingVal = recCourse.averageRating ?? 0;
                              const countVal = recCourse.ratingCount ?? 0;
                              return (
                                <div className="flex justify-between items-start mb-6 w-full gap-4">
                                  {recCourse.isCurriculum ? (
                                    <div className="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform flex-shrink-0" title={t.complete_curriculum || "Complete Curriculum"}>
                                      <GraduationCap className="w-6 h-6" />
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0">
                                      <Book className="w-6 h-6" />
                                    </div>
                                  )}
                                  <div className="flex flex-col items-end gap-2 flex-1 mr-8">
                                    {/* 1st row: badges */}
                                    <div className="flex gap-2 items-center flex-wrap justify-end">
                                      {/* Course / Curriculum Differentiating Badge */}
                                      {recCourse.isCurriculum ? (
                                        <span className="px-2.5 py-1 bg-violet-950/40 border border-violet-900/30 rounded-lg text-[8px] font-black uppercase text-violet-400 tracking-wider">
                                          🎓 {t.curriculum || 'Curriculum'}
                                        </span>
                                      ) : (
                                        <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-900/30 rounded-lg text-[8px] font-black uppercase text-blue-400 tracking-wider">
                                          📖 {t.course || 'Course'}
                                        </span>
                                      )}
                                      {/* Unified gold star rating badge */}
                                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 flex items-center gap-1.5" title={`${ratingVal.toFixed(1)} / 5 — ${countVal} ${t.reviews || 'reviews'}`}>
                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                        {ratingVal.toFixed(1)} ({countVal})
                                      </span>
                                      {/* Expected duration chip */}
                                      <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-900/30 rounded-lg text-[8px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1" title={(t.expected_learning_hours || '{hours} expected learning hours').replace('{hours}', String(recCourse.hours || (recCourse.ects ? recCourse.ects * 25 : 150)))}>
                                        <Clock className="w-3 h-3 text-blue-400" />
                                        {recCourse.hours || (recCourse.ects ? recCourse.ects * 25 : 150)}h
                                      </span>
                                      {/* Level badge */}
                                      <span className="px-2.5 py-1 bg-slate-850 border border-slate-750 rounded-lg text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                        {formatCourseLevel(recCourse.level, lang)}
                                      </span>
                                    </div>
                                    
                                    {/* 2nd row: action buttons (Course Sheet, Bookmark) */}
                                    <div className="flex gap-2 items-center mt-1">
                                      {/* Course Presentation Sheet (always visible) */}
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setSelectedEnrollCourse(recCourse);
                                        }}
                                        className="h-8 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[8px] font-black uppercase tracking-widest"
                                        title={t.course_sheet || "Course Sheet"}
                                      >
                                        <Book className="w-3 h-3" />
                                        <span>{t.course_sheet || "Course Sheet"}</span>
                                      </button>

                                      {/* Bookmark */}
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          toggleBookmark(recCourse.id, e);
                                        }}
                                        title={bookmarks.includes(recCourse.id) ? (t.remove_favorites || 'Remove bookmark') : (t.save_course || 'Save this course')}
                                        className={`w-8 h-8 border rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                                          bookmarks.includes(recCourse.id)
                                            ? 'text-blue-400 bg-blue-400/10 border-blue-500/20'
                                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                        }`}
                                      >
                                        <Bookmark className={`w-3 h-3 ${bookmarks.includes(recCourse.id) ? 'fill-current' : ''}`} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                            
                            <h3 className="text-xl font-black mb-3 group-hover:text-blue-400 transition-colors">
                              {getLocalizedTitle(recCourse)}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4 flex-1 leading-relaxed line-clamp-3 overflow-hidden text-ellipsis">
                              {getLocalizedCourseDescription(recCourse)}
                            </p>

                            <div className="flex items-center gap-2 pt-6 border-t border-slate-800/50 mt-auto w-full">
                              {/* 1. Main Action Button: Poursuivre / Continuer / Commencer */}
                              <button 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  await navigateToCourseDirect(recCourse);
                                }}
                                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest text-center transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Icons.Play className="w-3 h-3 fill-current" />
                                <span className="truncate">{t.start_learning || 'Start learning'}</span>
                              </button>

                              {/* 2. Enroll Button */}
                              <button 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  await enrollInRecommended(recCourse);
                                }}
                                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Icons.Plus className="w-3 h-3" />
                                <span className="truncate">{t.enroll_label || 'Enroll'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })()}

        {/* ACHIEVEMENTS GALLERY */}
        {(() => {
          const activeAchievements = achievements.filter(ach => ach.status !== 'inactive');

          if (activeAchievements.length === 0) return null;

          return (
            <section className="mt-20">
               <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-amber-500">
                  <Trophy className="w-6 h-6 text-amber-500 animate-bounce" /> {t.achievements_gallery}
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                 {activeAchievements.map((ach) => {
                   const isEarned = earnedIds.includes(ach.id);
                   const badge = BADGE_LIBRARY.find(b => b.id === ach.icon) || { iconName: 'Award', gradient: 'from-blue-500 to-indigo-500' };
                   const IconComponent = (Icons as any)[badge.iconName] || Icons.Award;
                   const name = ach.translations?.[lang.toUpperCase()]?.name || ach.translations?.[lang.toLowerCase()]?.name || ach.name;
                   const description = getAchievementTranslation(ach, 'description', lang);

                   return (
                     <div 
                       key={ach.id}
                       className={`p-6 border rounded-[32px] flex flex-col items-center text-center transition-all bg-slate-900/50 shadow-xl shadow-blue-500/5 ${
                         isEarned 
                           ? 'border-blue-500/30' 
                           : 'border-dashed border-slate-700/60 opacity-60'
                       }`}
                     >
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg ${
                         isEarned 
                           ? `bg-gradient-to-br ${badge.gradient}` 
                           : 'bg-slate-800 border border-slate-700/50 grayscale contrast-75 opacity-40'
                       }`}>
                         <IconComponent className="w-6 h-6" />
                       </div>
                       <h4 className={`text-sm font-black mb-1 line-clamp-1 ${
                         isEarned ? 'text-slate-200' : 'text-slate-500'
                       }`}>
                         {name}
                       </h4>
                       <p className="text-[10px] text-slate-500 mb-3 leading-tight line-clamp-2">
                         {description}
                       </p>
                       <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                         isEarned 
                           ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                           : 'bg-slate-800/20 border-slate-800/40 text-slate-600'
                       }`}>
                         {isEarned ? t.unlocked : (t.locked || "Locked")}
                       </span>
                     </div>
                   );
                 })}
               </div>
            </section>
          );
        })()}
      </div>

      {/* INTERMEDIATE CURRICULUM DRILL-DOWN MODAL */}
      <AnimatePresence>
        {selectedCurriculumForDrillDown && (() => {
          const childIds = selectedCurriculumForDrillDown.childCourses || [];
          
          let ratingCount = selectedCurriculumForDrillDown.ratingCount || 0;
          let averageRating = selectedCurriculumForDrillDown.averageRating || 0;
          let totalHours = selectedCurriculumForDrillDown.hours || 0;
          const isMultilingualParent = selectedCurriculumForDrillDown.languages && selectedCurriculumForDrillDown.languages.length > 1;

          if (childIds.length > 0) {
            let sumHours = 0;
            let sumWeightedRating = 0;
            let sumRatingCount = 0;
            childIds.forEach((cId: number) => {
              const child = courses.find(c => c.id === cId);
              if (child) {
                const childHours = child.hours || 150;
                const childRating = child.averageRating || 3.4;
                sumHours += childHours;
                sumWeightedRating += childRating * childHours;
                sumRatingCount += child.ratingCount || 12;
              }
            });
            totalHours = sumHours > 0 ? sumHours : totalHours;
            averageRating = sumHours > 0 ? sumWeightedRating / sumHours : averageRating;
            ratingCount = sumRatingCount > 0 ? sumRatingCount : ratingCount;
          }

          const childDetails = childIds.map((cid: number) => {
            const matched = courses.find(c => c.id === cid) || {};
            const activeMod = progress?.activeModules?.find((m: any) => m.id === cid);
            const prog = activeMod ? activeMod.progress : 0;
            const isOptional = matched.isOptional || (selectedCurriculumForDrillDown.optionalCourses && selectedCurriculumForDrillDown.optionalCourses.includes(cid));
            const hours = matched.ects ? matched.ects * 25 : 150;
            const langCode = matched.languages?.[0] || 'en';
            return {
              id: cid,
              title: getLocalizedTitle(matched) || matched.title || `Course Module ${cid}`,
              subject: matched.subject || 'Mathematics',
              level: matched.level || 'L1',
              slug: matched.slug || '',
              progress: activeMod ? prog : 0,
              hours: hours,
              isOptional,
              isEnrolled: !!activeMod,
              langCode,
              languages: matched.languages || []
            };
          });

          const optionalCoursesList = childDetails.filter((c: any) => c.isOptional);
          const enrolledOptionalCount = optionalCoursesList.filter((c: any) => c.isEnrolled).length;
          const minOptionalCount = selectedCurriculumForDrillDown.minOptionalCount || 0;
          const isCompliant = enrolledOptionalCount >= minOptionalCount;

          // Filter only mandatory courses plus enrolled optional ones to calculate average progress
          const coursesForProgress = childDetails.filter((c: any) => !c.isOptional || c.isEnrolled);
          const avgProgress = coursesForProgress.length > 0
            ? Math.round(coursesForProgress.reduce((sum: number, c: any) => sum + c.progress, 0) / coursesForProgress.length)
            : 0;

          const getCoursePath = (c: any) => {
            const slug = c.slug;
            if (!slug) return '/catalog';
            if (slug === 'classical-mechanics' || slug === 'Classical_Mechanics' || c.id === 1) {
              return '/L1/Physics/Classical_Mechanics/introduction';
            }
            if (slug === 'quantum-physics' || slug === 'Physique_Test_L2' || c.id === 2) {
              return '/L2/Physics/Physique_Test_L2/introduction';
            }
            if (slug === 'cell-biology' || slug === 'Biologie_Test' || c.id === 3) {
              return '/L1/Biology/Cell_Biology/introduction';
            }
            if (slug === 'molecular-genetics' || slug === 'Biologie_Test_L1' || c.id === 4) {
              return '/L1/Biology/Biologie_Test_L1/introduction';
            }
            if (slug === 'constitutional-law' || slug === 'Droit_Test' || c.id === 5) {
              return '/L1/Law/Droit_Test/introduction';
            }
            if (slug === 'Maths_Test' || c.id === 7) {
              return '/L1/Mathematics/Maths_Test/introduction';
            }
            if (slug === 'Maths_Test_L1' || c.id === 8) {
              return '/L1/Mathematics/Maths_Test_L1/introduction';
            }
            if (slug === 'Statistics' || c.id === 11) {
              return '/L1/Mathematics/Statistics/introduction';
            }
            const cleanSubject = c.subject ? c.subject.replace(/\s+/g, '_') : 'General';
            return `/${c.level || 'L1'}/${cleanSubject}/${c.slug}/introduction`;
          };

          return (
            <div 
              onClick={() => setSelectedCurriculumForDrillDown(null)} 
              className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xl cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl bg-slate-900 border border-violet-500/30 rounded-[40px] shadow-2xl overflow-hidden text-slate-200 cursor-default"
              >
                {/* Header */}
                <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-violet-955/20 via-slate-900 to-slate-950/40 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Icons.GraduationCap className="w-8 h-8 text-violet-400" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 block mb-1">
                        {t.active_multi_course_curriculum}
                      </span>
                      <h3 className="text-2xl font-black text-white leading-tight">
                        {selectedCurriculumForDrillDown.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} reviews`}>
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {averageRating > 0 ? averageRating.toFixed(1) : "4.8"} ({ratingCount > 0 ? ratingCount : 12})
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {totalHours}H
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCurriculumForDrillDown(null)}
                    className="p-3 bg-slate-950 hover:bg-slate-800 text-slate-500 hover:text-white rounded-2xl border border-slate-800 cursor-pointer transition-colors"
                  >
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                  {/* Overview description */}
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {selectedCurriculumForDrillDown.description}
                  </p>

                  {/* Dynamic Progress Grid */}
                  <div className="p-8 bg-slate-950/40 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-center gap-8">
                    {/* Circle Progress */}
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" className="stroke-slate-800 fill-none" strokeWidth="6" />
                        <circle 
                          cx="48" 
                          cy="48" 
                          r="40" 
                          className="stroke-violet-500 fill-none" 
                          strokeWidth="6" 
                          strokeDasharray={251.2} 
                          strokeDashoffset={251.2 - (251.2 * avgProgress) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xl font-black text-white">{avgProgress}%</span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <h4 className="text-sm font-black text-slate-200">
                        {t.global_curriculum_progression}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {t.curriculum_integration_desc.replace('{count}', String(childDetails.length))}
                      </p>
                    </div>
                  </div>

                  {minOptionalCount > 0 && (
                    <div className={`p-6 border rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl ${
                      isCompliant 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${
                          isCompliant 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                        }`}>
                          {isCompliant ? <Icons.ShieldCheck className="w-5 h-5" /> : <Icons.AlertTriangle className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-black leading-tight text-white">
                            {ELECTIVE_CHOICES_LABEL[upperLang] || ELECTIVE_CHOICES_LABEL.EN}
                          </h4>
                          <p className="text-xs opacity-85 mt-1 font-semibold leading-normal">
                            {getElectiveDescription(enrolledOptionalCount, minOptionalCount, isCompliant, lang)}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border self-start sm:self-auto ${
                        isCompliant 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>
                        {isCompliant 
                          ? (COMPLIANT_LABEL[upperLang] || COMPLIANT_LABEL.EN) 
                          : (REQUIRED_LABEL[upperLang] || REQUIRED_LABEL.EN)}
                      </span>
                    </div>
                  )}

                  {/* Child Course List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {t.milestones_and_modules}
                    </h4>

                    <div className="space-y-3">
                      {childDetails.map((cc: any, idx: number) => {
                        return (
                          <div 
                            key={cc.id} 
                            className="p-6 bg-slate-950/20 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-violet-500/20 transition-all"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-[8px] font-black text-slate-400 rounded">
                                  {cc.level}
                                </span>
                                <span className="px-2 py-0.5 bg-violet-955/30 border border-violet-500/10 text-[8px] font-black text-violet-400 rounded">
                                  {t.milestone_step.replace('{step}', String(idx + 1))}
                                </span>
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                                  cc.isOptional 
                                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' 
                                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                                }`}>
                                  {cc.isOptional 
                                    ? (ELECTIVE_LABEL[upperLang] || ELECTIVE_LABEL.EN) 
                                    : (MANDATORY_LABEL[upperLang] || MANDATORY_LABEL.EN)}
                                </span>
                              </div>
                              <h5 className="text-sm font-black text-white">
                                {cc.title}{isMultilingualParent && cc.langCode ? ` (${cc.langCode.toUpperCase()})` : ''}
                              </h5>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                {getLocalizedSubject(cc.subject)} • {cc.hours}h {EXPECTED_LABEL[upperLang] || EXPECTED_LABEL.EN}
                              </p>
                            </div>

                            {/* Micro Progress and jump button */}
                            <div className="flex items-center gap-6 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                              {cc.isEnrolled ? (
                                <div className="text-right">
                                  <span className="text-xs font-black text-violet-400 block mb-1">{cc.progress}%</span>
                                  <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-500" style={{ width: `${cc.progress}%` }} />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                  {NOT_ENROLLED_LABEL[upperLang] || NOT_ENROLLED_LABEL.EN}
                                </span>
                              )}

                              <div className="flex items-center gap-2">
                                {cc.isOptional && (
                                  <button
                                    onClick={async () => {
                                      if (cc.isEnrolled) {
                                        await handleOptOut(cc.id);
                                      } else {
                                        await enrollInRecommended(cc);
                                      }
                                    }}
                                    className={`px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border cursor-pointer ${
                                      cc.isEnrolled 
                                        ? 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10' 
                                        : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
                                    }`}
                                  >
                                    {cc.isEnrolled 
                                      ? (REMOVE_LABEL[upperLang] || REMOVE_LABEL.EN) 
                                      : (CHOOSE_LABEL[upperLang] || CHOOSE_LABEL.EN)}
                                  </button>
                                )}

                                <button
                                  onClick={async () => {
                                    if (!cc.isEnrolled) {
                                      await enrollInRecommended(cc);
                                    }
                                    handleCourseClick(cc);
                                    setSelectedCurriculumForDrillDown(null);
                                    await navigateToCourseDirect(cc);
                                  }}
                                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/10 hover:scale-105 cursor-pointer"
                                >
                                  {t.jump_in}
                                  <Icons.ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* 🔮 DOUBLE-SAFEGUARD GLASSMORPHIC OPT-OUT MODAL */}
      <AnimatePresence>
        {abandonTarget && (
          <div 
            onClick={() => setAbandonTarget(null)} 
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xl cursor-pointer"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl p-10 relative overflow-hidden cursor-default"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-4 text-red-500 mb-6">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                  <Icons.AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 block mb-1">
                    {t.disenroll_confirm_title_sub}
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {t.disenroll_confirm_title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                {t.disenroll_confirm_desc.replace('{title}', abandonTarget.title || (THIS_COURSE_LABEL[upperLang] || THIS_COURSE_LABEL.EN))}
              </p>

              {abandonTarget.isCurriculum && (
                <div className="mb-8 p-5 bg-slate-950/40 border border-slate-800 rounded-3xl flex items-start gap-4 hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    id="keepChildCourses"
                    checked={keepChildCourses}
                    onChange={(e) => setKeepChildCourses(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-800 text-red-600 focus:ring-red-500 bg-slate-950 cursor-pointer accent-red-600"
                  />
                  <label htmlFor="keepChildCourses" className="text-xs text-slate-300 font-medium leading-relaxed select-none cursor-pointer">
                    <span className="font-black text-white block mb-1">
                      {KEEP_ENROLLMENTS_LABEL[upperLang] || KEEP_ENROLLMENTS_LABEL.EN}
                    </span>
                    {KEEP_ENROLLMENTS_DESC_LABEL[upperLang] || KEEP_ENROLLMENTS_DESC_LABEL.EN}
                  </label>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setAbandonTarget(null)}
                  className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-800 transition-all cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleOptOut(abandonTarget.id, keepChildCourses);
                    setAbandonTarget(null);
                  }}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-900/30 hover:scale-102 transition-all cursor-pointer"
                >
                  {t.confirm}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TUTOR SELECTOR MODAL */}
      <AnimatePresence>
        {showTutorModal && (
          <div onClick={() => setShowTutorModal(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xl cursor-pointer">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] cursor-default"
            >
              <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <Brain className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">
                      {t.select_ai_tutor}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {t.tutor_modal_desc}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTutorModal(false)}
                  className="p-3 text-slate-500 hover:text-white rounded-2xl hover:bg-slate-850 transition-all cursor-pointer"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-slate-900/50">
                {tutors.map(tOption => {
                  const code = (lang || 'EN').toUpperCase();
                  const localizedName = tOption.translations?.[code]?.name || tOption.name;
                  const localizedDesc = tOption.translations?.[code]?.desc ||
                    tOption.translations?.[code]?.prompt?.slice(0, 120) + '...' ||
                    tOption.prompt?.slice(0, 120) + '...';
                  const isSelected = tOption.id === activeTutorId;
                  // Emoji fallback map
                  const EMOJI_MAP: Record<string, string> = {
                    socratic: '💬', direct: '⚡', gamified: '🚀', historical: '📚',
                    feynman: '💡', proof: '📐', engineer: '🔧', debater: '🗣️',
                    analogy_alchemist: '🧪', cognitive_catalyst: '🧠',
                    heuristic_explorer: '🔭', diamond_age: '💎',
                  };
                  const emoji = EMOJI_MAP[tOption.id] || '🤖';
                  return (
                    <div 
                      key={tOption.id}
                      onClick={() => handleSelectTutor(tOption.id)}
                      className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-6 group relative overflow-hidden ${
                        isSelected 
                          ? 'bg-blue-600/10 border-blue-500/60 shadow-lg shadow-blue-500/5' 
                          : 'bg-slate-950/30 border-slate-850 hover:border-slate-700 hover:bg-slate-950/50'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                          isSelected ? 'bg-blue-600/20 scale-105' : 'bg-slate-900 group-hover:scale-105'
                        }`}>
                          {emoji}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-white tracking-wide flex items-center gap-2">
                            {localizedName}
                            {isSelected && (
                              <span className="px-2.5 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-[8px] font-black uppercase tracking-wider">
                                {t.active}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed max-w-md">
                            {localizedDesc}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                          : 'border-slate-850 group-hover:border-slate-750 text-transparent group-hover:text-slate-655'
                      }`}>
                        <Icons.Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-8 border-t border-slate-800 bg-slate-950/40 text-center">
                <p className="text-xs text-slate-500 font-semibold italic">
                  {t.tutor_modal_footer}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Syllabus Enrollment Drawer Modal */}
      <AnimatePresence>
        {selectedEnrollCourse && (
          <EnrollmentModal
            course={selectedEnrollCourse}
            onClose={() => setSelectedEnrollCourse(null)}
            lang={lang}
            isLoggedIn={true}
            enrolledIds={enrolledIds}
            courses={courses}
            showEnrollActions={true}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
            onSelectCourse={(c) => setSelectedEnrollCourse(c)}
            onEnroll={async (activeC) => {
              const targetCourse = activeC || selectedEnrollCourse;
              let userId = 'u1';
              const savedProfile = localStorage.getItem('op_user_profile');
              if (savedProfile) {
                try {
                  const p = JSON.parse(savedProfile);
                  if (p.id) userId = p.id;
                } catch (err) {}
              }
              await dbService.enrollInCourse(userId, targetCourse.id);
              setEnrolledIds(prev => [...prev, targetCourse.id]);
              
              setEnrollmentSuccess(true);
              const courseToOpen = targetCourse;
              setSelectedEnrollCourse(null);
              window.dispatchEvent(new Event('op_progress_updated'));
              
              let resolvedSlug = 'introduction';
              try {
                const { data: firstLessonSlug } = await dbService.getFirstLessonSlug(courseToOpen.slug, lang);
                if (firstLessonSlug) {
                  resolvedSlug = firstLessonSlug;
                }
              } catch (err) {
                console.error("Error fetching first lesson slug:", err);
              }
              const targetPath = getCoursePathHelper(courseToOpen.level, courseToOpen.subject, courseToOpen.slug, resolvedSlug, lang);

              setTimeout(() => {
                setEnrollmentSuccess(false);
                window.location.href = targetPath;
              }, 2000);
            }}
          />
        )}
      </AnimatePresence>

      {/* 🌟 COMPLETED COURSE REVIEW MODAL (INTERACTIVE & READ-ONLY BLURRED POPUP) */}
      <AnimatePresence>
        {showReviewModal && selectedReviewCourse && (() => {
          const courseId = selectedReviewCourse.id.toString();
          const isReviewed = isReviewReadOnly;
          const fb = courseFeedbacks[selectedReviewCourse.id] || { rating: 0, comment: '' };
          
          // Local states inside the popup to allow interactive inputs
          const [localRating, setLocalRating] = useState(fb.rating || 0);
          const [localHoverRating, setLocalHoverRating] = useState(0);
          const [localComment, setLocalComment] = useState(fb.comment || '');
          const [localSubmitted, setLocalSubmitted] = useState(false);

          const handleLocalSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (localRating === 0) return;

            setSubmittingReview(true);
            try {
              await dbService.addCourseFeedback({
                courseId,
                rating: localRating,
                comment: localComment
              });

              // Update the courseFeedbacks map state in CurriculumPage
              setCourseFeedbacks(prev => ({
                ...prev,
                [selectedReviewCourse.id]: { rating: localRating, comment: localComment }
              }));
              
              setLocalSubmitted(true);
              setIsReviewReadOnly(true);
              setTimeout(() => {
                setShowReviewModal(false);
                setSelectedReviewCourse(null);
              }, 1800);
            } catch (err) {
              console.error("Error submitting review:", err);
            } finally {
              setSubmittingReview(false);
            }
          };

          return (
            <div 
              onClick={() => {
                setShowReviewModal(false);
                setSelectedReviewCourse(null);
              }} 
              className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl p-10 relative overflow-hidden cursor-default"
              >
                {/* Background ambient light */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Header ribbon if completed */}
                {isReviewed && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-600/10 text-emerald-400 border-l border-b border-emerald-500/20 rounded-bl-2xl text-[8px] font-black uppercase tracking-wider select-none animate-pulse">
                    {REVIEWED_READ_ONLY_LABEL[upperLang] || REVIEWED_READ_ONLY_LABEL.EN}
                  </div>
                )}

                {/* Close Button X */}
                <button 
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedReviewCourse(null);
                  }}
                  className="absolute top-6 right-6 p-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-500 hover:text-white rounded-xl cursor-pointer transition-colors"
                  title={CLOSE_LABEL[upperLang] || CLOSE_LABEL.EN}
                >
                  <Icons.X className="w-4 h-4" />
                </button>

                {/* Modal Title */}
                <div className="flex items-center gap-4 text-emerald-500 mb-6 mr-8">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Star className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 block mb-1">
                      {isReviewed 
                        ? (YOUR_SAVED_REVIEW_LABEL[upperLang] || YOUR_SAVED_REVIEW_LABEL.EN) 
                        : (SHARE_YOUR_EXPERIENCE_LABEL[upperLang] || SHARE_YOUR_EXPERIENCE_LABEL.EN)}
                    </span>
                    <h3 className="text-xl font-black text-white leading-tight">
                      {getLocalizedTitle(selectedReviewCourse)}
                    </h3>
                  </div>
                </div>

                {localSubmitted && (
                  <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl p-4 text-xs font-semibold flex items-center gap-3 border-l-4 border-l-emerald-500">
                    <Icons.CheckCircle className="w-5 h-5 shrink-0" />
                    <span>
                      {REVIEW_SAVED_LABEL[upperLang] || REVIEW_SAVED_LABEL.EN}
                    </span>
                  </div>
                )}

                <form onSubmit={handleLocalSubmit} className="space-y-6">
                  {/* Rating container with blurred/read-only mode */}
                  <div className={isReviewed ? "pointer-events-none opacity-70 filter blur-[0.4px] select-none space-y-6" : "space-y-6"}>
                    {/* Stars Selection */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        {RATE_THIS_COURSE_LABEL[upperLang] || RATE_THIS_COURSE_LABEL.EN} {!isReviewed && <span className="text-red-500">*</span>}
                      </span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            disabled={isReviewed}
                            onClick={() => setLocalRating(star)}
                            onMouseEnter={() => !isReviewed && setLocalHoverRating(star)}
                            onMouseLeave={() => !isReviewed && setLocalHoverRating(0)}
                            className={`p-1 transition-transform outline-none ${isReviewed ? 'cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}`}
                          >
                            <Star 
                              className={`w-8 h-8 transition-colors ${
                                star <= (localHoverRating || localRating) 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-slate-700'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Area */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        {COMMENTS_SUGGESTIONS_LABEL[upperLang] || COMMENTS_SUGGESTIONS_LABEL.EN}
                      </span>
                      <textarea
                        value={localComment}
                        onChange={(e) => setLocalComment(e.target.value)}
                        disabled={isReviewed}
                        placeholder={TEXTAREA_PLACEHOLDER_LABEL[upperLang] || TEXTAREA_PLACEHOLDER_LABEL.EN}
                        rows={4}
                        className={`w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none transition-all font-medium leading-relaxed ${isReviewed ? 'opacity-50 cursor-not-allowed border-slate-900' : 'focus:border-emerald-500/50'}`}
                      />
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex gap-4 pt-4 border-t border-slate-800/50">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewModal(false);
                        setSelectedReviewCourse(null);
                      }}
                      className="flex-1 py-4 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-800 transition-all cursor-pointer"
                    >
                      {CLOSE_LABEL[upperLang] || CLOSE_LABEL.EN}
                    </button>
                    {!isReviewed && (
                      <button
                        type="submit"
                        disabled={localRating === 0 || submittingReview}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl ${
                          localRating > 0 && !submittingReview
                            ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10 cursor-pointer active:scale-95' 
                            : 'bg-slate-850 text-slate-500 border border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        {SUBMIT_REVIEW_LABEL[upperLang] || SUBMIT_REVIEW_LABEL.EN}
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      <AnimatePresence>
        {enrollmentSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 px-6 py-3.5 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-2xl flex items-center gap-3 z-[12000] backdrop-blur-xl"
          >
            <Icons.CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-100 tracking-wide">
              {ENROLLMENT_SUCCESSFUL_LABEL[upperLang] || ENROLLMENT_SUCCESSFUL_LABEL.EN}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AudioReader content={getCurriculumMarkdown()} lang={lang} />
      <AITutorOverlay lang={lang} isDashboardMode={true} pageContext={getCurriculumMarkdown()} />

     <Footer />
   </div>
 );
}
