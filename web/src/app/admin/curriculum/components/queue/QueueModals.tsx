"use client";

import React from 'react';
import { ShieldAlert, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCALIZED_POPUPS } from '../../strings';

export interface QueueModalsProps {
  lang: string;
  tr: (key: string) => string;
  cancelTaskTarget: any | null;
  setCancelTaskTarget: React.Dispatch<React.SetStateAction<any | null>>;
  errorDetailsTarget: any | null;
  setErrorDetailsTarget: React.Dispatch<React.SetStateAction<any | null>>;
  handleCancelTask: (id: string, bypassConfirm?: boolean) => Promise<void>;
  handleRetryTask: (id: string) => Promise<void>;
}

export const QueueModals: React.FC<QueueModalsProps> = ({
  lang,
  tr,
  cancelTaskTarget,
  setCancelTaskTarget,
  errorDetailsTarget,
  setErrorDetailsTarget,
  handleCancelTask,
  handleRetryTask
}) => {
  const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;

  return (
    <>
      {/* CANCEL TASK CONFIRM MODAL */}
      <AnimatePresence>
        {cancelTaskTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelTaskTarget(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-800 bg-red-955/20 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">
                  {pStrings.cancel_task_title || "Cancel Task"}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed text-center">
                  {pStrings.task_cancel_confirm.replace("{title}", cancelTaskTarget.title)}
                </p>
                
                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => setCancelTaskTarget(null)}
                    className="flex-1 py-4 border border-slate-800 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    {pStrings.purge_badge_cancel_btn}
                  </button>
                  <button 
                    type="button"
                    onClick={async () => {
                      const targetId = cancelTaskTarget.id; 
                      setCancelTaskTarget(null); 
                      await handleCancelTask(targetId, true);
                    }}
                    className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl transition-all bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/10 cursor-pointer"
                  >
                    {pStrings.purge_badge_confirm_btn}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ERROR DETAILS POPUP MODAL */}
      <AnimatePresence>
        {errorDetailsTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setErrorDetailsTarget(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="relative z-10 w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-800 bg-amber-955/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-500 animate-pulse" />
                  <h3 className="text-lg font-black text-amber-400 uppercase tracking-widest">
                    {tr("Task Error Logs")}
                  </h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setErrorDetailsTarget(null)}
                  className="w-8 h-8 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>
              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">{tr("Task Title")}</h4>
                  <p className="text-sm font-semibold text-slate-200">{errorDetailsTarget.title}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">{tr("Error Stack & Logs")}</h4>
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-[10px] text-red-400 max-h-60 overflow-y-auto custom-scrollbar leading-relaxed whitespace-pre-wrap">
                    {Array.isArray(errorDetailsTarget.logs) && errorDetailsTarget.logs.length > 0 
                      ? errorDetailsTarget.logs.join('\n') 
                      : errorDetailsTarget.logs || tr("No log information recorded.")}
                  </div>
                </div>
                
                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => setErrorDetailsTarget(null)}
                    className="flex-1 py-4 border border-slate-800 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    {tr("Close")}
                  </button>
                  <button 
                    type="button"
                    onClick={async () => {
                      const id = errorDetailsTarget.id;
                      setErrorDetailsTarget(null);
                      await handleRetryTask(id);
                    }}
                    className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl transition-all bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/10 cursor-pointer"
                  >
                    {tr("Retry Task")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
