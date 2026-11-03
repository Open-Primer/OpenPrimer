import React from 'react';
import { ChevronRight } from 'lucide-react';
import { getNavigationTree } from '@/lib/content';
import { STATIC_UI_STRINGS, formatCourseLevel } from '@/lib/translations';
import { CourseClientWrapper } from '@/components/CourseClientWrapper';
import { ErrorModal } from '@/components/modals/ErrorModal';
import { dbService } from '@/lib/db';

const CORE_MODULE_LABELS: Record<string, string> = {
  EN: "Core Module",
  FR: "Module Principal",
  ES: "Módulo Principal",
  DE: "Kernmodul",
  ZH: "核心模块",
  PT: "Módulo Principal",
  AR: "الوحدة الرئيسية",
  HI: "मुख्य मॉड्यूल",
  UR: "بنیادی ماڈیول"
};

const LEVEL_VALUE_MAP: Record<string, Record<string, string>> = {
  L1: { EN: '101', ZH: '大一 (101)', DEFAULT: 'L1 (101)' },
  L2: { EN: '201', ZH: '大二 (201)', DEFAULT: 'L2 (201)' },
  L3: { EN: '301', ZH: '大三 (301)', DEFAULT: 'L3 (301)' },
  M1: { EN: '501', ZH: '研一 (501)', DEFAULT: 'M1 (501)' },
  M2: { EN: '502', ZH: '研二 (502)', DEFAULT: 'M2 (502)' }
};

const GRADE_FORMAT_MAP: Record<string, string> = {
  ZH: '{num}年级',
  EN: 'Grade {num}',
  FR: 'Niveau {num}',
  ES: 'Grado {num}',
  DE: 'Klasse {num}',
  PT: 'Ano {num}',
  AR: 'الصف {num}',
  HI: 'कक्षा {num}',
  UR: 'کلاس {num}'
};

export const resolveModuleName = (rawModule: string | undefined, lang: string, t: any): string => {
  const moduleName = rawModule || t.overview || STATIC_UI_STRINGS.EN.overview;
  if (moduleName.toLowerCase() === 'core module') {
    const lUpper = lang.toUpperCase();
    return CORE_MODULE_LABELS[lUpper] || moduleName;
  }
  return moduleName;
};

export const getLocalizedCoreModule = (currentLang: string, lvl: string): string => {
  const lUpper = currentLang.toUpperCase();
  const moduleLabel = CORE_MODULE_LABELS[lUpper] || CORE_MODULE_LABELS.EN;

  const lvlStr = String(lvl).toUpperCase();
  let lvlVal = lvlStr;
  if (LEVEL_VALUE_MAP[lvlStr]) {
    lvlVal = LEVEL_VALUE_MAP[lvlStr][lUpper] || LEVEL_VALUE_MAP[lvlStr].DEFAULT;
  } else if (/^\d+$/.test(lvlStr)) {
    const num = parseInt(lvlStr, 10);
    const tpl = GRADE_FORMAT_MAP[lUpper] || GRADE_FORMAT_MAP.EN;
    lvlVal = tpl.replace('{num}', String(num));
  }

  return `${moduleLabel} • ${lvlVal}`;
};

const SUBJECT_DICTIONARY: Record<string, Record<string, string>> = {
  physics: {
    EN: "Physics", FR: "Physique", ES: "Física", DE: "Physik", ZH: "物理",
    IT: "Fisica", PT: "Física", AR: "الفيزياء", HI: "भौतिक विज्ञान", UR: "طبیعیات"
  },
  "classical mechanics": {
    EN: "Classical Mechanics", FR: "Mécanique Classique", ES: "Mecánica Clásica", DE: "Klassische Mechanik",
    ZH: "经典力学", IT: "Meccanica Classica", PT: "Mecânica Clásica", AR: "الميكانيكا الكلاسيكية",
    HI: "शास्त्रीय यांत्रिकी", UR: "کلاسیکی میکانکس"
  },
  biology: {
    EN: "Biology", FR: "Biologie", ES: "Biología", DE: "Biologie", ZH: "生物",
    IT: "Biologia", PT: "Biologia", AR: "علم الأحياء", HI: "जीव विज्ञान", UR: "حیاتیات"
  },
  chemistry: {
    EN: "Chemistry", FR: "Chimie", ES: "Química", DE: "Chemie", ZH: "化学",
    IT: "Chimica", PT: "Química", AR: "الكيمياء", HI: "रसायन विज्ञान", UR: "کیمسٹری"
  },
  law: {
    EN: "Law", FR: "Droit", ES: "Derecho", DE: "Recht", ZH: "法律",
    IT: "Diritto", PT: "Direito", AR: "القانون", HI: "कानून", UR: "قانون"
  },
  mathematics: {
    EN: "Mathematics", FR: "Mathématiques", ES: "Matemáticas", DE: "Mathematik", ZH: "数学",
    IT: "Matematica", PT: "Matemática", AR: "الرياضيات", HI: "गणित", UR: "ریاضی"
  },
  economics: {
    EN: "Economics", FR: "Économie", ES: "Economía", DE: "Wirtschaft", ZH: "经济学",
    IT: "Economia", PT: "Economia", AR: "الاقتصاد", HI: "अर्थशास्त्र", UR: "معاشیات"
  },
  "computer science": {
    EN: "Computer Science", FR: "Informatique", ES: "Informática", DE: "Informatik", ZH: "计算机科学",
    IT: "Informatica", PT: "Ciência da Computação", AR: "علوم الحاسوب", HI: "कंप्यूटर विज्ञान", UR: "کمپ्यूटर سائنس"
  },
  cs: {
    EN: "Computer Science", FR: "Informatique", ES: "Informática", DE: "Informatik", ZH: "计算机科学",
    IT: "Informatica", PT: "Ciência da Computação", AR: "علوم الحاسوب", HI: "कंप्यूटर विज्ञान", UR: "کمپ्यूटर سائنس"
  },
  history: {
    EN: "History", FR: "Histoire", ES: "Historia", DE: "Geschichte", ZH: "历史",
    IT: "Storia", PT: "História", AR: "التاريخ", HI: "इतिहास", UR: "تاریخ"
  }
};

export const getLocalizedSubject = (currentLang: string, sub: string): string => {
  const lUpper = currentLang.toUpperCase();
  const subLower = sub.toLowerCase().trim();

  const formatSubjectName = (str: string): string => {
    if (!str) return '';
    if (str.includes('_') || str === str.toUpperCase()) {
      return str
        .split('_')
        .map(word => {
          if (word.length <= 3 && !['ET', 'DE', 'LA', 'LE', 'UN', 'UNE', 'DU', 'AU', 'AUX', 'EN', 'SUR', 'DES'].includes(word.toUpperCase())) {
            return word.toUpperCase();
          }
          const lower = word.toLowerCase();
          if (['et', 'de', 'la', 'le', 'un', 'une', 'du', 'au', 'aux', 'en', 'sur', 'pour', 'des'].includes(lower)) {
            return lower;
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ')
        .replace(/^\w/, c => c.toUpperCase());
    }
    return str;
  };

  if (SUBJECT_DICTIONARY[subLower] && SUBJECT_DICTIONARY[subLower][lUpper]) {
    return SUBJECT_DICTIONARY[subLower][lUpper];
  }
  return formatSubjectName(sub);
};

export async function renderCourseErrorFallback(
  err: any,
  slug: string[],
  lang: string,
  pageData: any
) {
  let pagePath = 'Unknown Page';
  let courseSlug = 'general';
  try {
    pagePath = (slug && slug.length > 0) ? slug.join('/') : 'Unknown Page';
    courseSlug = (slug && slug[2]) || 'general';
    const errorMessage = err?.stack || err?.message || String(err);
    
    await dbService.submitReport(
      courseSlug,
      pagePath,
      `[CRITICAL RENDERING EXCEPTION] ${errorMessage}`
    );
    console.log(`[ERROR AUTO-REPORT] Logged rendering error for page ${pagePath}`);
  } catch (reportErr) {
    console.error("Failed to submit error report:", reportErr);
  }

  let navItems: any[] = [];
  let nextPage: any = null;
  let title = 'Error';
  let subject = 'Academic Content';
  let moduleName = 'Overview';
  
  try {
    const coursePath = slug.slice(0, 3).join('/');
    const rawNav = await getNavigationTree(coursePath, lang);
    const normalizedLangCode = (lang.toUpperCase().split('-')[0]) as keyof typeof STATIC_UI_STRINGS;
    const t = STATIC_UI_STRINGS[normalizedLangCode] || STATIC_UI_STRINGS.EN;
    
    const files = rawNav.filter(item => item.type === 'file');
    const folders = rawNav.filter(item => item.type === 'folder');
    
    navItems = [
      ...(files.length > 0 ? [{ name: t.overview || STATIC_UI_STRINGS.EN.overview, type: 'folder', children: files }] : []),
      ...folders
    ];

    const flatPages: any[] = [];
    navItems.forEach(folder => {
      folder.children?.forEach((p: any) => {
        flatPages.push(p);
      });
    });

    const currentPath = `/${slug.join('/')}`;
    const currentIndex = flatPages.findIndex(p => p.path === currentPath);
    nextPage = currentIndex !== -1 && currentIndex < flatPages.length - 1 ? flatPages[currentIndex + 1] : null;

    if (pageData) {
      title = pageData.meta.title || 'Untitled Module';
      subject = pageData.meta.subject || 'Academic Content';
      moduleName = pageData.meta.module || t.overview || STATIC_UI_STRINGS.EN.overview;
    }
  } catch (e) {
    console.warn("Failed to generate sidebar for error view fallback:", e);
  }

  if (navItems.length > 0) {
    return (
      <CourseClientWrapper 
        navItems={navItems} 
        pageContext={pageData?.content || ''}
        courseLevel={formatCourseLevel(pageData?.meta?.level || 'L1', lang)}
        courseTitle={title}
        courseSubject={subject}
        courseLang={lang}
      >
        <div className="max-w-4xl mx-auto py-16 px-12 pb-40 relative min-h-[600px]">
          <div className="filter blur-md opacity-30 select-none pointer-events-none">
            <div className="flex items-center justify-between gap-4 mb-12">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
                <span>{subject}</span>
                <ChevronRight className="w-3 h-3 text-slate-800" />
                <span>{moduleName}</span>
                <ChevronRight className="w-3 h-3 text-slate-800" />
                <span className="text-blue-500">{title}</span>
              </div>
            </div>
            <header className="mb-12">
              <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 leading-tight">
                {title}
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 rounded-full" />
            </header>
            <article className="prose prose-invert prose-slate max-w-none">
              <p>This course content could not be rendered due to a formatting anomaly in the module source. Please proceed using the navigation controls.</p>
            </article>
          </div>

          <ErrorModal 
            lang={lang} 
            subject={subject} 
            title={title} 
            nextPagePath={nextPage ? nextPage.path : null} 
          />
        </div>
      </CourseClientWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-slate-900/30 rounded-full blur-[100px] pointer-events-none" />

      <ErrorModal 
        lang={lang} 
        subject={subject} 
        title={title} 
        nextPagePath={nextPage ? nextPage.path : null} 
      />
    </div>
  );
}
