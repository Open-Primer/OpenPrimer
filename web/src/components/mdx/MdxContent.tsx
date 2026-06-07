"use client";

import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Quiz, Question, Option } from './Quiz';
import { Glossary } from './Glossary';
import { Video } from './Video';
import { FillInBlanks, MetaNote, ExternalSandbox } from './Interactive';
import { SolvedProblem, Summary, SelfEval } from './AdvancedLearning';
import { HistoricalPerson } from './HistoricalPerson';
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

const components = {
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
  pre: PreCodeInterceptor,
};

interface MdxContentProps {
  source: MDXRemoteSerializeResult;
}

export function MdxContent({ source }: MdxContentProps) {
  return <MDXRemote {...source} components={components as any} />;
}
