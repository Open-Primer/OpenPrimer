"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, BookOpen, Calendar, ClipboardCheck, FileText, 
  HelpCircle, Lock, PenTool, Play, RefreshCw, Send, Timer 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { dbService } from '@/lib/db';
import { isChildrenEmpty } from './Alert';

/**
 * @file Evaluations.tsx
 * @description Summative and formative evaluation components, essay submission portal,
 * assignments, quizzes and grading widgets embedded in MDX lessons.
 */

import { SUMMATIVE_STRINGS, type SummativeTranslation } from './summative-strings';
import { SummativeEssayPortal } from './SummativeEssayPortal';

export { SUMMATIVE_STRINGS, type SummativeTranslation, SummativeEssayPortal };

const isStructuredEvalChild = (child: React.ReactNode): boolean => {
  if (!React.isValidElement(child)) return false;
  const type = child.type;
  const typeName = typeof type === 'string' ? type : ((type as any)?.displayName || (type as any)?.name || '');
  const props = (child.props as any) || {};
  return (
    type === Quiz ||
    typeName === 'Quiz' ||
    typeName.includes('Quiz') ||
    type === EssayEvaluation ||
    typeName === 'EssayEvaluation' ||
    typeName.includes('EssayEvaluation') ||
    type === OralEvaluation ||
    typeName === 'OralEvaluation' ||
    typeName === 'EvaluationOrale' ||
    typeName.includes('OralEvaluation') ||
    Array.isArray(props.questions) ||
    props.isFinal !== undefined
  );
};

const SummativeEvaluation = ({ children, durationLimit }: { children: React.ReactNode; durationLimit?: number }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;

  if (isChildrenEmpty(children)) return null;

  const childrenArray = React.Children.toArray(children);
  
  // Check if children contain any structured evaluation component
  const hasStructuredComponent = childrenArray.some(isStructuredEvalChild);

  const finalChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && isStructuredEvalChild(child)) {
      return React.cloneElement(child, { isFinal: true } as any);
    }
    return child;
  });

  if (hasStructuredComponent) {
    return (
      <div className="my-10 p-6 md:p-8 bg-slate-900/40 border border-amber-500/20 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />
        <div className="flex items-center gap-3 mb-6 select-none border-b border-slate-800/50 pb-4">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white leading-tight">{t.terminal_evaluation}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{t.module_validation}</p>
          </div>
        </div>
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          {finalChildren}
        </div>
      </div>
    );
  }

  return <SummativeEssayPortal childrenArray={childrenArray} durationLimit={durationLimit} />;
};

const FormativeEvaluation = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;

  if (isChildrenEmpty(children)) return null;

  const finalChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && isStructuredEvalChild(child)) {
      return React.cloneElement(child, { isFinal: false } as any);
    }
    return child;
  });

  return (
    <div className="my-10 p-6 md:p-8 bg-slate-900/20 border border-emerald-500/10 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />
      <div className="flex items-center gap-3 mb-6 select-none border-b border-slate-800/50 pb-4">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white leading-tight">{t.lesson_end_evaluation}</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{t.knowledge_validation}</p>
        </div>
      </div>
      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        {finalChildren}
      </div>
    </div>
  );
};

const EvaluationSection = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="space-y-4 border-t border-slate-800/30 pt-4 first:border-0 first:pt-0">{children}</div>;
};

const Assignment = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl">
      <div className="flex items-center gap-2 text-amber-400 mb-2 select-none">
        <FileText className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.assignment}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const Deadline = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold my-2 select-none">
      <Calendar className="w-3.5 h-3.5" />
      <span>{t.deadline} {children}</span>
    </div>
  );
};

const Submission = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-4 bg-slate-950/20 border border-dashed border-slate-800/80 rounded-2xl my-4">
      <div className="flex items-center gap-2 text-slate-400 mb-2 select-none">
        <Send className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.submission_instructions}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const Evaluation = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-4 bg-slate-950/20 border border-slate-800 rounded-2xl my-4">
      <div className="flex items-center gap-2 text-blue-400 mb-2 select-none">
        <Award className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.evaluation_criteria}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const FinalProject = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-5 bg-slate-950/50 border border-blue-500/25 rounded-2xl my-6">
      <div className="flex items-center gap-2 text-blue-400 mb-3 select-none">
        <Award className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.final_project}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const FinalWork = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="space-y-4">{children}</div>;
};

const Format = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="text-xs text-slate-400 border-l-2 border-slate-700 pl-3 my-2">
      <strong className="text-slate-300">{t.format} </strong>{children}
    </div>
  );
};

const Instructions = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="space-y-2 my-3">
      <span className="text-xs font-bold text-slate-400 select-none">{t.instructions}</span>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const FinalQuiz = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-5 bg-slate-950/30 border border-slate-800 rounded-2xl my-6">
      <div className="flex items-center gap-2 text-violet-400 mb-3 select-none">
        <HelpCircle className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.final_quiz}</span>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

const QuizQuestion = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="font-semibold text-slate-200 text-sm leading-relaxed mb-2">{children}</div>;
};

const Answer = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="text-slate-300 text-xs pl-4 my-1">• {children}</div>;
};

const Description = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="text-slate-400 text-xs mb-3 italic">{children}</div>;
};

const Title = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <h4 className="text-sm font-black text-white uppercase tracking-wider mb-2">{children}</h4>;
};

const FormativeQuiz = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const t = SUMMATIVE_STRINGS[language.toUpperCase() as keyof typeof SUMMATIVE_STRINGS] || SUMMATIVE_STRINGS.EN;
  if (isChildrenEmpty(children)) return null;
  return (
    <div className="p-5 bg-slate-950/30 border border-slate-800 rounded-2xl my-6">
      <div className="flex items-center gap-2 text-emerald-400 mb-3 select-none">
        <HelpCircle className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.formative_quiz}</span>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};



export { 
  SummativeEvaluation, FormativeEvaluation, SummativeEssayPortal,
  EvaluationSection, Assignment, Deadline, Submission, Evaluation, 
  FinalProject, FinalWork, Format, Instructions, FinalQuiz, 
  QuizQuestion, Answer, Description, Title, FormativeQuiz,
  SUMMATIVE_STRINGS, extractPrompts 
};
export default SummativeEvaluation;
