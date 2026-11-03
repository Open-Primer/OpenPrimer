"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { dbService } from '@/lib/db';

export interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  triggerToast: (msg: string) => void;
}

export const ReportIssueModal = ({
  isOpen,
  onClose,
  t,
  triggerToast
}: ReportIssueModalProps) => {
  const [reportComment, setReportComment] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const getProbableLocationOnPage = (): string => {
    if (typeof window === 'undefined') return '';
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
    const scrollY = window.scrollY;
    for (let i = headings.length - 1; i >= 0; i--) {
      const top = headings[i].getBoundingClientRect().top + scrollY;
      if (scrollY >= top - 200) {
        return `[Visible section: "${headings[i].textContent?.trim()}"]`;
      }
    }
    return '';
  };

  const handleSubmit = async () => {
    setSubmittingReport(true);
    const pathParts = window.location.pathname.split('/');
    const courseName = pathParts[3] ? pathParts[3].replace(/_/g, ' ') : "General";
    
    // Append visual location context if available
    const locationHint = getProbableLocationOnPage();
    const finalComment = locationHint 
      ? `${reportComment}\n\n${locationHint}` 
      : reportComment;
    
    await dbService.submitReport(courseName, window.location.pathname, finalComment);
    setSubmittingReport(false);
    onClose();
    setReportComment('');
    triggerToast(t.report_success);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-[11000] overflow-y-auto bg-slate-950/40 backdrop-blur-xl flex items-start justify-center p-4 md:p-8 cursor-pointer"
        >
          <motion.div 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden cursor-default my-auto"
          >
            <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
              <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-500" /> {t.report_issue}
              </h3>
              <button 
                onClick={onClose} 
                className="text-slate-600 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-10 space-y-6">
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {t.report_desc}
              </p>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                  {t.report_comment}
                </label>
                <textarea 
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  rows={4}
                  placeholder={t.report_placeholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none text-white placeholder:text-slate-700" 
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={onClose} 
                  className="flex-1 py-4 bg-slate-950 border border-slate-800 hover:bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={!reportComment.trim() || submittingReport}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white shadow-xl shadow-blue-500/20 cursor-pointer"
                >
                  {submittingReport ? t.sending : t.submit}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
