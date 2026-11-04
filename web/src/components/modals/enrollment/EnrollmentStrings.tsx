import React from 'react';
import { ChevronRight, Rocket } from 'lucide-react';

export interface EnrollmentModalProps {
  isOpen?: boolean;
  onEnrollSuccess?: () => void;
  course: any;
  onClose: () => void;
  lang: string;
  isLoggedIn: boolean;
  enrolledIds: number[];
  courses: any[];
  onEnroll?: (course?: any) => Promise<void>;
  onSelectCourse?: (course: any) => void;
  showEnrollActions?: boolean;
  bookmarks?: number[];
  onToggleBookmark?: (id: number, e: React.MouseEvent) => void;
}

export const LOCAL_DICTS: Record<string, Record<string, string>> = {
  EN: {
    back: 'Back',
    included_courses: 'Included Courses',
    study_modules: 'Study Modules',
    syllabus_details: 'Syllabus details',
    structure_loading: 'Course structure loading...',
    syllabus_coming_soon: 'Syllabus details coming soon...',
    courses_included_curriculum: 'Courses Included in the Curriculum',
    enrolled: 'Enrolled',
    recommended_next_steps: 'Recommended Next Steps',
    available: 'Available',
    curriculum_l2_format: 'L2 {subject} Curriculum'
  },
  FR: {
    back: 'Retour',
    included_courses: 'Cours inclus',
    study_modules: "Sujets d'étude",
    syllabus_details: 'Syllabus en cours',
    structure_loading: 'Structure en cours de chargement...',
    syllabus_coming_soon: 'Syllabus en cours de rédaction...',
    courses_included_curriculum: 'Cours Inclus dans le Curriculum',
    enrolled: 'Inscrit',
    recommended_next_steps: 'Poursuites Possibles',
    available: 'Disponible',
    curriculum_l2_format: 'Curriculum L2 {subject}'
  },
  ES: {
    back: 'Atrás',
    included_courses: 'Cursos incluidos',
    study_modules: 'Módulos de estudio',
    syllabus_details: 'Detalles del plan de estudios',
    structure_loading: 'Cargando estructura del curso...',
    syllabus_coming_soon: 'Detalles del plan de estudios próximamente...',
    courses_included_curriculum: 'Cursos incluidos en el plan de estudios',
    enrolled: 'Inscrito',
    recommended_next_steps: 'Próximos pasos recomendados',
    available: 'Disponible',
    curriculum_l2_format: 'Plan de estudios L2 {subject}'
  },
  DE: {
    back: 'Zurück',
    included_courses: 'Inbegriffene Kurse',
    study_modules: 'Studienmodule',
    syllabus_details: 'Lehrplan-Details',
    structure_loading: 'Kursstruktur wird geladen...',
    syllabus_coming_soon: 'Lehrplan-Details folgen in Kürze...',
    courses_included_curriculum: 'Im Lehrplan enthaltene Kurse',
    enrolled: 'Eingeschrieben',
    recommended_next_steps: 'Empfohlene nächste Schritte',
    available: 'Verfügbar',
    curriculum_l2_format: 'L2 {subject} Lehrplan'
  },
  ZH: {
    back: '返回',
    included_courses: '包含课程',
    study_modules: '学习模块',
    syllabus_details: '教学大纲详情',
    structure_loading: '课程结构加载中...',
    syllabus_coming_soon: '教学大纲详情即将推出...',
    courses_included_curriculum: '课程体系中包含的课程',
    enrolled: '已报名',
    recommended_next_steps: '推荐后续步骤',
    available: '可用',
    curriculum_l2_format: 'L2 {subject} 课程体系'
  },
  PT: {
    back: 'Voltar',
    included_courses: 'Cursos incluídos',
    study_modules: 'Módulos de estudo',
    syllabus_details: 'Detalhes do currículo',
    structure_loading: 'Carregando estrutura do curso...',
    syllabus_coming_soon: 'Detalhes do currículo em breve...',
    courses_included_curriculum: 'Cursos incluídos no currículo',
    enrolled: 'Inscrito',
    recommended_next_steps: 'Próximos passos recomendados',
    available: 'Disponível',
    curriculum_l2_format: 'Currículo L2 {subject}'
  },
  AR: {
    back: 'رجوع',
    included_courses: 'الدورات المشمولة',
    study_modules: 'وحدات الدراسة',
    syllabus_details: 'تفاصيل المنهج',
    structure_loading: 'جاري تحميل هيكل الدورة...',
    syllabus_coming_soon: 'تفاصيل المنهج قريباً...',
    courses_included_curriculum: 'الدورات المدرجة في المنهج الدراسي',
    enrolled: 'مسجل',
    recommended_next_steps: 'الخطوات التالية الموصى بها',
    available: 'متاح',
    curriculum_l2_format: 'منهج L2 {subject}'
  },
  HI: {
    back: 'पीछे',
    included_courses: 'शामिल पाठ्यक्रम',
    study_modules: 'अध्ययन मॉड्यूल',
    syllabus_details: 'पाठ्यक्रम विवरण',
    structure_loading: 'पाठ्यक्रम संरचना लोड हो रही है...',
    syllabus_coming_soon: 'पाठ्यक्रम विवरण जल्द ही आ रहा है...',
    courses_included_curriculum: 'पाठ्यक्रम में शामिल कोर्सेज',
    enrolled: 'नामांकित',
    recommended_next_steps: 'अनुशंसित अगले कदम',
    available: 'उपलब्ध',
    curriculum_l2_format: 'L2 {subject} पाठ्यक्रम'
  },
  UR: {
    back: 'واپس',
    included_courses: 'شامل کورسز',
    study_modules: 'مطالعاتی ماڈیولز',
    syllabus_details: 'نصاب کی تفصیلات',
    structure_loading: 'کورس کا ڈھانچہ لوڈ ہو رہا ہے...',
    syllabus_coming_soon: 'نصاب کی تفصیلات جلد آرہی ہیں...',
    courses_included_curriculum: 'نصاب میں شامل کورسز',
    enrolled: 'شامل ہو گیا',
    recommended_next_steps: 'تجویز کردہ اگلے اقدامات',
    available: 'دستیاب',
    curriculum_l2_format: 'L2 {subject} نصاب'
  }
};

export const getLocalString = (key: string, lang: string, subject?: string): string => {
  const langKey = lang.toUpperCase();
  const dict = LOCAL_DICTS[langKey] || LOCAL_DICTS.EN;
  const str = dict[key] || LOCAL_DICTS.EN[key] || '';
  if (subject && str.includes('{subject}')) {
    return str.replace('{subject}', subject);
  }
  return str;
};

export const CurriculumChildCoursesGrid = ({
  fetchedChildCourses,
  enrolledIds,
  lang,
  navigateToCourse,
  getLocalizedCourseTitle,
  getLocalizedCourseDescription
}: {
  fetchedChildCourses: any[];
  enrolledIds: number[];
  lang: string;
  navigateToCourse: (c: any) => void;
  getLocalizedCourseTitle: (c: any) => string;
  getLocalizedCourseDescription: (c: any) => string;
}) => (
  <div className="mb-8">
    <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider mb-3 text-left">
      {getLocalString('courses_included_curriculum', lang)}
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
      {fetchedChildCourses.map((child: any) => {
        const isChildEnrolled = enrolledIds.includes(child.id);
        return (
          <div
            key={child.id}
            onClick={() => navigateToCourse(child)}
            className="p-4 bg-slate-950/50 hover:bg-slate-900/80 border border-slate-800 hover:border-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md">
                  {child.level}
                </span>
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">
                  {child.ects || 6} ECTS
                </span>
              </div>
              <h4 className="text-xs font-black text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                {getLocalizedCourseTitle(child)}
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                {getLocalizedCourseDescription(child)}
              </p>
            </div>
            {isChildEnrolled && (
              <div className="mt-3 flex items-center justify-end">
                <span className="px-2 py-0.5 rounded text-[8px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  {getLocalString('enrolled', lang)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export const PrerequisitesAndNextSteps = ({
  prerequisites,
  nextSteps,
  enrolledIds,
  lang,
  t,
  matchCourse,
  navigateToCourse,
  getLocalizedCourseTitle
}: {
  prerequisites: string[];
  nextSteps: string[];
  enrolledIds: number[];
  lang: string;
  t: any;
  matchCourse: (text: string) => any;
  navigateToCourse: (c: any) => void;
  getLocalizedCourseTitle: (c: any) => string;
}) => (
  <>
    {prerequisites.length > 0 && (
      <div className="mb-8 p-5 bg-slate-950/30 border border-slate-800 rounded-2xl">
        <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider mb-3 text-left">
          {t.prerequisites || "Academic Prerequisites"}
        </p>
        <div className="flex flex-col gap-2 text-left">
          {prerequisites.map((pre: string, idx: number) => {
            const matchedCourse = matchCourse(pre);
            const isSatisfied = matchedCourse ? enrolledIds.includes(matchedCourse.id) : false;
            
            return (
              <div 
                key={idx} 
                onClick={matchedCourse ? () => navigateToCourse(matchedCourse) : undefined}
                title={matchedCourse ? `${t.prerequisite_view_prefix || "View details for: "}${getLocalizedCourseTitle(matchedCourse)}` : undefined}
                className={`flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 transition-all ${
                  matchedCourse 
                    ? 'hover:bg-slate-900/80 hover:border-blue-500/30 hover:scale-[1.01] cursor-pointer' 
                    : ''
                }`}
              >
                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5 font-sans">
                  {pre}
                  {matchedCourse && <ChevronRight className="w-3 h-3 text-slate-500" />}
                </span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  isSatisfied 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {isSatisfied 
                    ? (t.prerequisite_unlocked || "✓ Unlocked") 
                    : (t.prerequisite_required || "⚠️ Required")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {nextSteps.length > 0 && (
      <div className="mb-8 p-5 bg-gradient-to-br from-indigo-500/5 to-slate-950/20 border border-indigo-500/10 rounded-2xl">
        <p className="text-[9px] font-black uppercase text-indigo-400 tracking-wider mb-3 text-left flex items-center gap-2">
          <Rocket className="w-3.5 h-3.5 animate-pulse" />
          {getLocalString('recommended_next_steps', lang)}
        </p>
        <div className="flex flex-col gap-2 text-left">
          {nextSteps.map((nextItem: string, idx: number) => {
            const matchedCourse = matchCourse(nextItem);
            return (
              <div 
                key={idx} 
                onClick={matchedCourse ? () => navigateToCourse(matchedCourse) : undefined}
                title={matchedCourse ? `${t.prerequisite_view_prefix || "View details for: "}${getLocalizedCourseTitle(matchedCourse)}` : undefined}
                className={`flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 transition-all ${
                  matchedCourse 
                    ? 'hover:bg-slate-900/80 hover:border-indigo-500/30 hover:scale-[1.01] cursor-pointer' 
                    : ''
                }`}
              >
                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5 font-sans">
                  {nextItem}
                  {matchedCourse && <ChevronRight className="w-3 h-3 text-indigo-400" />}
                </span>
                {matchedCourse ? (
                  <span className="px-2 py-0.5 rounded text-[8px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                    {getLocalString('available', lang)}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    )}
  </>
);
