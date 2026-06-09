"use client";

import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Quiz, Question, Option } from './Quiz';
import { Glossary } from './Glossary';
import { Video } from './Video';
import { FillInBlanks, MetaNote, ExternalSandbox } from './Interactive';
import { SolvedProblem, Summary, SelfEval } from './AdvancedLearning';
import { HistoricalPerson, FictionalCharacter, Location, EntityLink } from './HistoricalPerson';
import { EssayEvaluation } from './EssayEvaluation';
import { Prerequisites } from './Prerequisites';
import { Epistemology } from './Epistemology';
import { DiagnosticQuiz } from './DiagnosticQuiz';
import { AudioPlayer } from './AudioPlayer';

// New Visual and Interactive Components
import { Mermaid } from './Mermaid';
import { FunctionPlotter } from './FunctionPlotter';
import { InteractiveDiagram } from './InteractiveDiagram';
import { ComparisonSlider } from './ComparisonSlider';
import { CodeSandbox } from './CodeSandbox';
import { SolvedExercise, UnsolvedExercise } from './InteractiveExercises';
import { DataChart } from './DataChart';
import { StructureViewer3D } from './StructureViewer3D';
import { DynamicSimulation } from './DynamicSimulation';
import { GoingFurther, GoingFurtherItem } from './GoingFurther';
import { FunctionManipulator } from './FunctionManipulator';
import { EquationManipulator } from './EquationManipulator';
import { AlertTriangle, Info, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';

const Alert = ({ type, children }: { type: string; children: React.ReactNode }) => {
  const t = (type || 'note').toLowerCase();
  
  let icon = <Info className="w-4 h-4 text-blue-400" />;
  let title = "Note";
  let borderClass = "border-l-blue-500 bg-blue-500/5 dark:bg-blue-500/[0.04] border-blue-500/20";
  let titleColor = "text-blue-500 dark:text-blue-400";

  if (t === 'warning') {
    icon = <AlertTriangle className="w-4 h-4 text-amber-500" />;
    title = "Warning";
    borderClass = "border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/[0.04] border-amber-500/20";
    titleColor = "text-amber-500 dark:text-amber-400";
  } else if (t === 'info') {
    icon = <Info className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
    title = "Info";
    borderClass = "border-l-blue-500 bg-blue-500/5 dark:bg-blue-500/[0.04] border-blue-500/20";
    titleColor = "text-blue-500 dark:text-blue-400";
  } else if (t === 'important') {
    icon = <ShieldAlert className="w-4 h-4 text-rose-500" />;
    title = "Important";
    borderClass = "border-l-rose-500 bg-rose-500/5 dark:bg-rose-500/[0.04] border-rose-500/20";
    titleColor = "text-rose-500 dark:text-rose-400";
  } else if (t === 'tip') {
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    title = "Tip";
    borderClass = "border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/[0.04] border-emerald-500/20";
    titleColor = "text-emerald-500 dark:text-emerald-400";
  } else if (t === 'caution') {
    icon = <AlertOctagon className="w-4 h-4 text-red-500" />;
    title = "Caution";
    borderClass = "border-l-red-500 bg-red-500/5 dark:bg-red-500/[0.04] border-red-500/20";
    titleColor = "text-red-500 dark:text-red-400";
  }

  return (
    <div className={`my-6 p-5 rounded-2xl border-l-4 ${borderClass} shadow-sm custom-alert alert-${t} transition-all duration-300`}>
      <div className="flex items-center gap-2 mb-2 select-none">
        <div className="flex items-center justify-center">
          {icon}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${titleColor}`}>
          {title}
        </span>
      </div>
      <div className="text-[13px] leading-relaxed font-medium text-slate-800 dark:text-slate-200 alert-content">
        {children}
      </div>
    </div>
  );
};

const PreCodeInterceptor = (props: any) => {
  const children = props.children;
  if (
    children &&
    React.isValidElement(children) &&
    (children.props as any).className === 'language-mermaid'
  ) {
    const codeContent = (children.props as any).children || '';
    return <Mermaid chart={String(codeContent).trim()} />;
  }
  return <pre {...props} />;
};

const CustomFigure = ({ src, alt, caption, fallbackText, fallbackUrl }: { src: string; alt: string; caption: string; fallbackText?: string; fallbackUrl?: string }) => {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onerror = () => setFailed(true);
    img.src = src;
  }, [src]);
  if (failed) return null;
  return (
    <div className="my-8 flex flex-col items-center justify-center gap-2 custom-figure transition-opacity duration-300">
      <img 
        src={src} 
        alt={alt} 
        className="rounded-2xl max-w-full h-auto shadow-md border border-slate-900/10 dark:border-slate-800/50" 
        onError={() => setFailed(true)} 
      />
      {caption && <p className="text-center text-xs md:text-sm text-slate-500 dark:text-slate-400 italic mt-2 max-w-2xl px-4 select-none">{caption}</p>}
      {fallbackText && fallbackUrl && (
        <p className="text-center text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors select-none">
          <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">{fallbackText}</a>
        </p>
      )}
    </div>
  );
};

const components = {
  Alert,
  CustomFigure,
  Quiz,
  Question,
  Option,
  Glossary,
  Video,
  AudioPlayer,
  Audio: AudioPlayer,
  FillInBlanks,
  MetaNote,
  SolvedProblem,
  Summary,
  SelfEval,
  HistoricalPerson,
  FictionalCharacter,
  Location,
  Place: Location, // alias for Place
  EntityLink,
  EssayEvaluation,
  Prerequisites,
  Epistemology,
  DiagnosticQuiz,
  ExternalSandbox,
  
  // Registering New Interactivity Widgets
  Mermaid,
  FunctionPlotter,
  InteractiveDiagram,
  ComparisonSlider,
  CodeSandbox,
  SolvedExercise,
  UnsolvedExercise,
  DataChart,
  StructureViewer3D,
  DynamicSimulation,
  GoingFurther,
  GoingFurtherItem,
  FunctionManipulator,
  EquationManipulator,
  pre: PreCodeInterceptor,
};

interface MdxContentProps {
  source: MDXRemoteSerializeResult;
}

export function MdxContent({ source }: MdxContentProps) {
  return <MDXRemote {...source} components={components as any} />;
}
