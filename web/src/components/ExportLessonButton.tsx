"use client";
import { getPremiumStyles } from '@/lib/export/export-styles';
import {
  type LessonExportOptions,
  exportRevisionSheet,
  exportRevisionHtml,
  exportMarkdown,
  exportJson,
  exportHtml,
  exportScorm,
  exportLtiCartridge
} from '@/lib/export/lesson-packagers';

import React, { useState } from 'react';
import { Download, ChevronDown, FileText, Code, Box, Printer, Brain, Link as LinkIcon, X } from 'lucide-react';

interface ExportLessonButtonProps {
  title: string;
  subject: string;
  level: string;
  content: string;
  lang: string;
  courseSlug?: string;
  version?: string;
}

// Translation dictionaries extracted to ./export/strings
import { MODAL_TRANSLATIONS, REVISION_TRANSLATIONS } from './export/strings';

export const ExportLessonButton = ({ title, subject, level, content, lang, courseSlug, version }: ExportLessonButtonProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const upperLang = (lang || 'en').toUpperCase().split('-')[0];
  const mt = MODAL_TRANSLATIONS[upperLang as keyof typeof MODAL_TRANSLATIONS] || MODAL_TRANSLATIONS.EN;
  const rt = REVISION_TRANSLATIONS[upperLang as keyof typeof REVISION_TRANSLATIONS] || REVISION_TRANSLATIONS.EN;

  const getExportFilename = (suffix: string, ext: string) => {
    const cleanLevel = level.toUpperCase().replace(/[^A-Z0-9]+/g, '');
    const cleanSubject = subject.replace(/[^a-zA-Z0-9]+/g, '_');
    const cleanCourse = (courseSlug || '').replace(/[^a-zA-Z0-9]+/g, '_');
    const cleanChapter = title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    
    let parts = [cleanLevel, cleanSubject];
    if (cleanCourse) parts.push(cleanCourse);
    parts.push(cleanChapter);
    
    if (version) {
      let cleanVer = version.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '');
      if (cleanVer.startsWith('v')) {
        cleanVer = cleanVer.substring(1);
      }
      cleanVer = cleanVer.replace(/\./g, '_');
      if (cleanVer) {
        parts.push(`v${cleanVer}`);
      }
    }
    
    if (suffix) {
      parts.push(suffix);
    }
    
    return `${parts.filter(Boolean).join('_')}.${ext}`;
  };

  const t = {
    export: mt.export,
    markdown: mt.rawBtnMd,
    json: mt.rawBtnJson,
    scorm: mt.staticBtnScorm,
    lti: mt.ltiBtn,
    print: mt.staticBtnHtml,
    revision: mt.staticBtnRevision
  };

  // getPremiumStyles extracted to @/lib/export/export-styles

  const exportOpts: LessonExportOptions = {
    content,
    title,
    courseSlug,
    lessonSlug,
    lang,
    level,
    subject,
    t,
    getPremiumStyles: () => getPremiumStyles(title, lang)
  };

  const handleExportRevisionSheet = () => exportRevisionSheet(exportOpts);
  const handleExportRevisionHtml = () => exportRevisionHtml(exportOpts);
  const handleExportMarkdown = () => exportMarkdown(exportOpts);
  const handleExportJson = () => exportJson(exportOpts);
  const handleExportHtml = () => exportHtml(exportOpts);
  const handleExportScorm = () => exportScorm(exportOpts);
  const handleExportLtiCartridge = () => exportLtiCartridge(exportOpts);


  return (
    <div className="relative inline-block text-left distraction-free-hide font-sans">
      <div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-all cursor-pointer shadow-md select-none"
          id="export-menu-button"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.export}</span>
        </button>
      </div>

      {modalOpen && (
        <div 
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col cursor-default"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-200 m-0">
                  {mt.title}
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-xl transition-all cursor-pointer border-0 bg-transparent flex items-center justify-center"
                aria-label={mt.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              
              {/* Option 1: LTI SaaS */}
              <div className="bg-slate-950/20 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-colors shrink-0">
                    <LinkIcon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                      {mt.ltiTitle}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed m-0">
                      <strong className="text-slate-400">{mt.what}</strong>
                      {mt.ltiWhat}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed m-0">
                      <strong className="text-emerald-400">{mt.advantage}</strong>
                      {mt.ltiAdvantage}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          handleExportLtiCartridge();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer shadow-md select-none border-0"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>{mt.ltiBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 2: Static Offline */}
              <div className="bg-slate-950/20 border border-slate-800/80 hover:border-violet-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-500/10 rounded-xl group-hover:bg-violet-500/20 transition-colors shrink-0">
                    <Box className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                      {mt.staticTitle}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed m-0">
                      <strong className="text-slate-400">{mt.what}</strong>
                      {mt.staticWhat}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed m-0">
                      <strong className="text-rose-400">{mt.limitation}</strong>
                      {mt.staticLimit}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => {
                          handleExportScorm();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <Box className="w-3.5 h-3.5 text-violet-400" />
                        <span>{mt.staticBtnScorm}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleExportHtml();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{mt.staticBtnHtml}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleExportRevisionSheet();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <Brain className="w-3.5 h-3.5 text-pink-400" />
                        <span>{mt.staticBtnRevision}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleExportRevisionHtml();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-indigo-800/40 hover:bg-indigo-700/60 border border-indigo-600/40 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <Printer className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{rt.sheetHtmlPdf}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 3: Raw Structured Data */}
              <div className="bg-slate-950/20 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors shrink-0">
                    <Code className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                      {mt.rawTitle}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed m-0">
                      <strong className="text-slate-400">{mt.what}</strong>
                      {mt.rawWhat}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => {
                          handleExportMarkdown();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>{mt.rawBtnMd}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleExportJson();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <Code className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{mt.rawBtnJson}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
