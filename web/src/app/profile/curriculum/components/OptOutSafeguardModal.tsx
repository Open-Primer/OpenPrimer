import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface OptOutSafeguardModalProps {
  abandonTarget: any;
  setAbandonTarget: (target: any) => void;
  keepChildCourses: boolean;
  setKeepChildCourses: React.Dispatch<React.SetStateAction<boolean>>;
  handleOptOut: (id: number, keep: boolean) => Promise<void>;
  courses: any[];
  t: any;
  lang: string;
  getLocalizedTitle: (c: any) => string;
}

export const OptOutSafeguardModal: React.FC<OptOutSafeguardModalProps> = ({
  abandonTarget,
  setAbandonTarget,
  keepChildCourses,
  setKeepChildCourses,
  handleOptOut,
  courses,
  t,
  lang,
  getLocalizedTitle
}) => {
  return (
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

  );
};
