"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { getEvaluationStrings } from './strings';

interface EvaluationResultsProps {
  isReadOnly: boolean;
  grade: string | null;
  feedback: string;
  isOfflinePending: boolean;
  isFinal: boolean;
  isLoading: boolean;
  isTimeUp: boolean;
  onRetry: () => void;
  onSubmit: () => void;
  onEdit: () => void;
  t: {
    grade_label: string;
    feedback_title: string;
    retry: string;
    saved_local: string;
    eval_pending_title: string;
    eval_pending_desc: string;
    eval_pending_retry: string;
    evaluating: string;
  };
  lang?: string;
}

export const EvaluationResults: React.FC<EvaluationResultsProps> = ({
  isReadOnly,
  grade,
  feedback,
  isOfflinePending,
  isFinal,
  isLoading,
  isTimeUp,
  onRetry,
  onSubmit,
  onEdit,
  t,
  lang,
}) => {
  const es = getEvaluationStrings(lang);

  return (
    <>
      <AnimatePresence>
        {isReadOnly && grade && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 border-t border-slate-800/80 pt-6 space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-violet-600/10 border border-violet-500/20">
              <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-violet-600/20 border border-violet-500/30 text-center">
                <span className="text-[10px] font-black uppercase text-violet-400 tracking-wider leading-none mb-1">
                  {t.grade_label}
                </span>
                <span className="text-xl font-extrabold text-white leading-none">{grade}</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-white font-bold text-md mb-1">{t.feedback_title}</h4>
                <p className="text-slate-300 text-sm italic leading-relaxed">"{feedback}"</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {!isFinal ? (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t.retry}
                </button>
              ) : (
                <div />
              )}
              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.saved_local}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReadOnly && !grade && isOfflinePending && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 border-t border-slate-800/80 pt-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-slate-800/30 border border-slate-700/20">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-center text-amber-400">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-white font-bold text-sm mb-0.5">{t.eval_pending_title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{t.eval_pending_desc}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={onSubmit}
                disabled={isLoading}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 text-white rounded-xl transition-all text-xs font-bold flex items-center gap-2 cursor-pointer border border-violet-500/30 shadow-lg shadow-violet-600/10"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {t.evaluating}
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    {t.eval_pending_retry}
                  </>
                )}
              </button>

              {!isTimeUp && !isFinal && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-all text-xs font-bold cursor-pointer"
                >
                  {es.editResponse}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
