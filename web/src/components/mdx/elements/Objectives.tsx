"use client";

import React from 'react';
import { Target, BookOpen, Compass, Key } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import { isChildrenEmpty } from './Alert';

/**
 * @file Objectives.tsx
 * @description Pedagogical objectives card displaying Knowledge, Skills, and Attitudes.
 */

const Objective = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  return <div className="text-slate-300 font-medium text-sm leading-relaxed">{children}</div>;
};

const Knowledge = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase() as keyof typeof STATIC_UI_STRINGS;
  const t = STATIC_UI_STRINGS[langKey] || STATIC_UI_STRINGS.EN;

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-950/30 border border-slate-800/50 rounded-2xl">
      <div className="flex items-center gap-2 text-blue-400 mb-1 select-none">
        <BookOpen className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.obj_knowledge}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed prose-li:my-1 prose-ul:pl-4 prose-ul:list-disc">
        {children}
      </div>
    </div>
  );
};

const Skills = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase() as keyof typeof STATIC_UI_STRINGS;
  const t = STATIC_UI_STRINGS[langKey] || STATIC_UI_STRINGS.EN;

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-950/30 border border-slate-800/50 rounded-2xl">
      <div className="flex items-center gap-2 text-emerald-400 mb-1 select-none">
        <Key className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.obj_skills}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed prose-li:my-1 prose-ul:pl-4 prose-ul:list-disc">
        {children}
      </div>
    </div>
  );
};

const Attitudes = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase() as keyof typeof STATIC_UI_STRINGS;
  const t = STATIC_UI_STRINGS[langKey] || STATIC_UI_STRINGS.EN;

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-950/30 border border-slate-800/50 rounded-2xl">
      <div className="flex items-center gap-2 text-violet-400 mb-1 select-none">
        <Compass className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-wider">{t.obj_attitudes}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed prose-li:my-1 prose-ul:pl-4 prose-ul:list-disc">
        {children}
      </div>
    </div>
  );
};

Knowledge.displayName = 'Knowledge';
(Knowledge as any).isKnowledge = true;

Skills.displayName = 'Skills';
(Skills as any).isSkills = true;

Attitudes.displayName = 'Attitudes';
(Attitudes as any).isAttitudes = true;

const Objectives = ({ children }: { children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase() as keyof typeof STATIC_UI_STRINGS;
  const t = STATIC_UI_STRINGS[langKey] || STATIC_UI_STRINGS.EN;

  const isStructuredBox = (child: any): boolean => {
    if (!React.isValidElement(child)) return false;
    const type = child.type;
    if (!type) return false;
    if (type === Knowledge || type === Skills || type === Attitudes) return true;
    if (type === 'Knowledge' || type === 'Skills' || type === 'Attitudes') return true;
    if ((type as any).mdxType === 'Knowledge' || (type as any).mdxType === 'Skills' || (type as any).mdxType === 'Attitudes') return true;
    if ((child.props as any)?.mdxType === 'Knowledge' || (child.props as any)?.mdxType === 'Skills' || (child.props as any)?.mdxType === 'Attitudes') return true;
    if (typeof type === 'function') {
      if (type.name === 'Knowledge' || type.name === 'Skills' || type.name === 'Attitudes') return true;
      if ((type as any).isKnowledge || (type as any).isSkills || (type as any).isAttitudes) return true;
      if ((type as any).displayName === 'Knowledge' || (type as any).displayName === 'Skills' || (type as any).displayName === 'Attitudes') return true;
    }
    return false;
  };

  const childrenArray = React.Children.toArray(children);
  const hasStructuredBoxes = childrenArray.some(isStructuredBox);

  let renderedContent: React.ReactNode;

  if (hasStructuredBoxes) {
    // Ensure at least one structured box has visible, non-empty children
    const hasAnyContent = childrenArray.some(child => {
      if (React.isValidElement(child)) {
        if (isStructuredBox(child)) {
          return !isChildrenEmpty((child.props as any)?.children);
        }
        return !isChildrenEmpty(child);
      }
      return !isChildrenEmpty(child);
    });
    if (!hasAnyContent) return null;
    renderedContent = children;
  } else {
    // Distribute linear children into Knowledge, Skills, Attitudes boxes
    const extractLinearItems = (node: React.ReactNode): React.ReactNode[] => {
      if (!node) return [];
      if (Array.isArray(node)) {
        return node.flatMap(n => extractLinearItems(n));
      }
      if (React.isValidElement(node)) {
        const props = node.props as any;
        if (node.type === 'ul' || node.type === 'ol' || node.type === React.Fragment) {
          return extractLinearItems(props.children);
        }
        if (node.type === 'li' || node.type === 'p' || node.type === Objective) {
          return [node];
        }
        if (props && 'children' in props) {
          const subItems = extractLinearItems(props.children);
          if (subItems.length > 0) return subItems;
        }
      }
      if (typeof node === 'string' || typeof node === 'number') {
        return [node];
      }
      return [node];
    };

    const items = extractLinearItems(children).filter(item => !isChildrenEmpty(item));
    if (items.length === 0) return null;

    const knowledgeItems: React.ReactNode[] = [];
    const skillsItems: React.ReactNode[] = [];
    const attitudesItems: React.ReactNode[] = [];

    items.forEach((item, index) => {
      if (index % 3 === 0) {
        knowledgeItems.push(item);
      } else if (index % 3 === 1) {
        skillsItems.push(item);
      } else {
        attitudesItems.push(item);
      }
    });

    const getItemContent = (item: React.ReactNode): React.ReactNode => {
      if (React.isValidElement(item)) {
        const props = item.props as any;
        if ((item.type === 'li' || item.type === 'p' || item.type === Objective) && props && 'children' in props) {
          return props.children;
        }
      }
      return item;
    };

    renderedContent = (
      <>
        {knowledgeItems.length > 0 && (
          <Knowledge>
            <ul className="list-disc pl-4 space-y-1">
              {knowledgeItems.map((item, idx) => (
                <li key={idx}>{getItemContent(item)}</li>
              ))}
            </ul>
          </Knowledge>
        )}
        {skillsItems.length > 0 && (
          <Skills>
            <ul className="list-disc pl-4 space-y-1">
              {skillsItems.map((item, idx) => (
                <li key={idx}>{getItemContent(item)}</li>
              ))}
            </ul>
          </Skills>
        )}
        {attitudesItems.length > 0 && (
          <Attitudes>
            <ul className="list-disc pl-4 space-y-1">
              {attitudesItems.map((item, idx) => (
                <li key={idx}>{getItemContent(item)}</li>
              ))}
            </ul>
          </Attitudes>
        )}
      </>
    );
  }

  return (
    <div className="objectives-container my-8 p-6 md:p-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-600/5 rounded-full blur-[40px] pointer-events-none" />
      <div className="flex items-center gap-3 mb-6 select-none border-b border-slate-800/50 pb-4">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white leading-tight">{t.obj_title}</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{t.obj_subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderedContent}
      </div>
    </div>
  );
};

interface SummativeTranslation {
  select_subject: string;
  prerequisites: string;
  prep_advice: string;
  focus_advice: string;
  start: string;
  time_limit: string;
  time_remaining: string;
  time_expired: string;
  placeholder: string;
  words: string;
  words_target: string;
  submit: string;
  evaluating: string;
  grade: string;
  feedback_title: string;
  retry: string;
  saved_local: string;
  guest_alert: string;
  summative_eval: string;
  module_validation: string;
  selected_prompt: string;
  structured_resp: string;
  locked: string;
  min_words: string;
  conn_err: string;
  retry_confirm: string;
  no_prompts: string;
  assignment: string;
  deadline: string;
  submission_instructions: string;
  evaluation_criteria: string;
  final_project: string;
  format: string;
  instructions: string;
  final_quiz: string;
  formative_quiz: string;
  terminal_evaluation: string;
  lesson_end_evaluation: string;
  knowledge_validation: string;
}



export { Objectives, Objective, Knowledge, Skills, Attitudes };
export default Objectives;
