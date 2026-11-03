"use client";

import React from 'react';
import { Info } from 'lucide-react';

import { INTERACTIVE_STRINGS } from './interactive-strings';
export { INTERACTIVE_STRINGS };

export { getProgressionStorage } from './interactive/utils';
export { GuestFootnote } from './interactive/GuestFootnote';
export {
  type FillInBlanksContextType,
  FillInBlanksContext,
  FillInBlanks
} from './interactive/FillInBlanks';
export { FillInBlanksQuestion } from './interactive/FillInBlanksQuestion';
export { FeynmanBox, PredictOutcome } from './interactive/PedagogyChallenges';
export {
  BilingualText,
  IframeWidget,
  SpeechButton,
  ExternalSandbox
} from './interactive/InteractiveMedia';

export const MetaNote = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="my-10 p-8 rounded-[40px] bg-blue-600/5 border border-blue-600/20 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Info className="w-12 h-12 text-blue-500" />
    </div>
    <h4 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {title}
    </h4>
    <div className="text-slate-300 italic text-lg leading-relaxed">
      {children}
    </div>
  </div>
);

