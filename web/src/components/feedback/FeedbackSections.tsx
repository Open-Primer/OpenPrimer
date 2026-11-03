import React from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';

export interface CourseCompletionFeedbackProps {
  courseId: string;
  courseTitle: string;
  lang: string;
}

export const BADGE_LIBRARY = [
  { id: 'img_1', iconName: 'Award', gradient: 'from-violet-500 to-fuchsia-600' },
  { id: 'img_2', iconName: 'Zap', gradient: 'from-amber-400 to-orange-500' },
  { id: 'img_3', iconName: 'Star', gradient: 'from-yellow-400 to-amber-500' },
  { id: 'img_4', iconName: 'Flame', gradient: 'from-red-500 to-orange-500' },
  { id: 'img_5', iconName: 'Trophy', gradient: 'from-yellow-300 to-yellow-500' },
  { id: 'img_6', iconName: 'Clock', gradient: 'from-blue-400 to-cyan-500' },
  { id: 'img_7', iconName: 'Clock', gradient: 'from-indigo-400 to-purple-600' },
  { id: 'img_8', iconName: 'Crown', gradient: 'from-yellow-500 to-amber-600' },
  { id: 'img_9', iconName: 'Book', gradient: 'from-emerald-400 to-teal-500' },
  { id: 'img_10', iconName: 'ShieldCheck', gradient: 'from-teal-400 to-cyan-500' },
  { id: 'img_11', iconName: 'Award', gradient: 'from-green-400 to-emerald-600' },
  { id: 'img_12', iconName: 'Layers', gradient: 'from-pink-400 to-rose-600' },
  { id: 'img_13', iconName: 'CheckCircle', gradient: 'from-cyan-400 to-blue-500' },
  { id: 'img_14', iconName: 'Trophy', gradient: 'from-slate-300 to-slate-500' },
  { id: 'img_15', iconName: 'Activity', gradient: 'from-rose-500 to-red-600' },
  { id: 'img_16', iconName: 'Heart', gradient: 'from-pink-500 to-rose-500' },
  { id: 'img_17', iconName: 'Compass', gradient: 'from-blue-500 to-indigo-500' },
  { id: 'img_18', iconName: 'Map', gradient: 'from-amber-500 to-emerald-500' },
  { id: 'img_19', iconName: 'GraduationCap', gradient: 'from-cyan-500 to-blue-600' },
  { id: 'img_20', iconName: 'Target', gradient: 'from-red-600 to-rose-600' },
  { id: 'img_21', iconName: 'Cpu', gradient: 'from-slate-700 to-slate-900' },
  { id: 'img_22', iconName: 'Globe', gradient: 'from-sky-400 to-blue-500' },
  { id: 'img_23', iconName: 'Key', gradient: 'from-yellow-600 to-amber-600' },
  { id: 'img_24', iconName: 'Lock', gradient: 'from-red-500 to-rose-700' },
  { id: 'img_25', iconName: 'Lightbulb', gradient: 'from-amber-300 to-yellow-400' },
  { id: 'img_26', iconName: 'Rocket', gradient: 'from-orange-500 to-red-650' },
  { id: 'img_27', iconName: 'Search', gradient: 'from-slate-400 to-slate-600' },
  { id: 'img_28', iconName: 'Sparkles', gradient: 'from-violet-400 to-indigo-600' },
  { id: 'img_29', iconName: 'Award', gradient: 'from-amber-500 to-yellow-600' },
  { id: 'img_30', iconName: 'Trophy', gradient: 'from-orange-400 to-pink-500' }
];

export const SPAM_MESSAGES: Record<string, string> = {
  FR: "Votre commentaire contient du spam ou du contenu inapproprié.",
  EN: "Your comment contains spam or inappropriate content.",
  ES: "Su comentario contiene spam o contenido inapropiado.",
  DE: "Ihr Kommentar enthält Spam oder ungeeignete Inhalte.",
  ZH: "您的评论包含垃圾信息或不当内容。",
  PT: "O seu comentário contém spam ou conteúdo impróprio.",
  AR: "تعليقك يحتوي على محتوى غير لائق أو رسائل مزعجة.",
  HI: "आपकी टिप्पणी में स्पैम या अनुपयुक्त सामग्री है।",
  UR: "آپ کے تبصرے میں سپیم یا نامناسب مواد شامل ہے۔"
};

export const LOCKED_EVAL_TITLES: Record<string, string> = {
  FR: "Évaluation verrouillée",
  EN: "Evaluation Locked",
  ES: "Evaluación bloqueada",
  DE: "Bewertung gesperrt",
  ZH: "评价已锁定",
  PT: "Avaliação bloqueada",
  AR: "التقييم مقفل",
  HI: "मूल्यांकन लॉक है",
  UR: "تشخیص مقفل ہے"
};

export const LOCKED_EVAL_DESCS: Record<string, string> = {
  FR: "Vous devez réussir l'évaluation finale de ce cours (obtenir une note supérieure ou égale à la moyenne) pour débloquer l'évaluation du cours.",
  ES: "Debes aprobar la evaluación final de este curso con una calificación igual o superior al promedio para desbloquear la evaluación del curso.",
  DE: "Sie müssen die Abschlussprüfung auf dieser Seite mit einer Note über oder gleich dem Durchschnitt bestehen, um die Kursbewertung freizuschalten.",
  ZH: "您必须通过本页面的终期评估（成绩达到或超过平均分）才能解锁课程评价。",
  EN: "You must pass the final exam on this page with a grade above or equal to average to unlock course evaluation."
};

export const GuestFeedbackState = ({ t }: { t: any }) => (
  <div className="mt-32 pt-12 border-t border-slate-900 text-center space-y-6 animate-fade-in">
    <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
      <CheckCircle className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-black text-white uppercase tracking-wider">
      {t.courseCompleted}
    </h3>
    <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
      {t.courseCompletedDesc}
    </p>
    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link 
        href="/catalog" 
        className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20"
      >
        {t.browseCatalog} <ChevronRight className="w-4 h-4" />
      </Link>
      <button 
        onClick={() => window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: 'signup' }))}
        className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
      >
        {t.createAccount}
      </button>
    </div>
  </div>
);

export const UnenrolledFeedbackState = ({
  t,
  handleEnroll,
  enrollLoading
}: {
  t: any;
  handleEnroll: () => void;
  enrollLoading: boolean;
}) => (
  <div className="mt-32 pt-12 border-t border-slate-900 text-center space-y-6 animate-fade-in">
    <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
      <Icons.Bookmark className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-black text-white uppercase tracking-wider">
      {t.enrollTitle}
    </h3>
    <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
      {t.enrollDesc}
    </p>
    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
      <button 
        onClick={handleEnroll}
        disabled={enrollLoading}
        className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {enrollLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Icons.PlusCircle className="w-4 h-4" />
        )}
        {t.buttonEnroll}
      </button>
      <Link 
        href="/profile/curriculum" 
        className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
      >
        {t.buttonCurriculum}
      </Link>
    </div>
  </div>
);

export const NewlyEarnedBadgesSection = ({
  newBadgesForCourse,
  lang,
  t
}: {
  newBadgesForCourse: any[];
  lang: string;
  t: any;
}) => {
  if (newBadgesForCourse.length === 0) return null;
  return (
    <div className="bg-slate-900/10 border border-amber-500/20 rounded-[36px] p-8 md:p-10 space-y-6 backdrop-blur-md animate-fade-in">
      <div>
        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-1">
          {t.badgesEarned}
        </span>
        <h3 className="text-lg md:text-xl font-black text-white leading-tight">
          {t.achievementsTitle}
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {t.achievementsDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
        {newBadgesForCourse.map((ach) => {
          const badge = BADGE_LIBRARY.find(b => b.id === ach.icon) || { iconName: 'Award', gradient: 'from-blue-500 to-indigo-500' };
          const IconComponent = (Icons as any)[badge.iconName] || Icons.Award;
          return (
            <div
              key={ach.id}
              className="p-5 border rounded-[28px] flex items-center gap-4 transition-all bg-slate-950/40 border-amber-500/20 shadow-xl shadow-amber-500/5 hover:border-amber-500/40 animate-fade-in"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center text-white shadow-md shrink-0`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-200 line-clamp-1">
                  {ach.translations?.[lang.toUpperCase()]?.name || ach.translations?.[lang.toLowerCase()]?.name || ach.name}
                </h4>
                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                  {ach.translations?.[lang.toUpperCase()]?.description || ach.translations?.[lang.toLowerCase()]?.description || ach.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
