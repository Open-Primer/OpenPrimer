"use client";

import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Quiz, Question, Option } from './Quiz';
import { Glossary } from './Glossary';
import { Video } from './Video';
import { FillInBlanks, MetaNote } from './Interactive';
import { SolvedProblem, Summary, SelfEval } from './AdvancedLearning';

const components = {
  Quiz,
  Question,
  Option,
  Glossary,
  Video,
  FillInBlanks,
  MetaNote,
  SolvedProblem,
  Summary,
  SelfEval,
};

interface MdxContentProps {
  source: MDXRemoteSerializeResult;
}

export function MdxContent({ source }: MdxContentProps) {
  return <MDXRemote {...source} components={components as any} />;
}

