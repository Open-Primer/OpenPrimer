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


