"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Check, FileText, Code, Copy, Loader2,
  ChevronRight, AlertTriangle, Terminal
} from 'lucide-react';

interface LivePreviewTabProps {
  selectedWidget: any;
  workshopTab: 'preview' | 'code' | 'props';
  setWorkshopTab: (v: 'preview' | 'code' | 'props') => void;
  setIsFullscreenOpen: (v: boolean) => void;
  activePresetIndex: number;
  setActivePresetIndex: (v: number) => void;
  randomProps: any;
  setRandomProps: (v: any) => void;
  diceRotation: number;
  setDiceRotation: (v: any) => void;
  generateRandomProps: (id: string) => any;
  SANDBOX_PRESETS: Record<string, any>;
  renderLiveComponent: (w: any, customProps?: any) => React.ReactNode;
  prompt: string;
  setPrompt: (v: string) => void;
  isExecuting: boolean;
  currentStep: number;
  handleRefineWithAI: () => void;
  handleValidateWidget: (id: string) => void;
  handleRollbackWidget: (id: string) => void;
  SUGGESTED_PROMPTS: Record<string, string[]>;
  errorDetails: string | null;
  t: any;
  tr: (key: string) => string;
  showToast?: (text: string, type?: 'success' | 'error' | 'info') => void;
  adminId?: string;
}

export const LivePreviewTab: React.FC<LivePreviewTabProps> = ({
  selectedWidget,
  workshopTab,
  randomProps,
  renderLiveComponent,
  prompt,
  setPrompt,
  isExecuting,
  currentStep,
  handleRefineWithAI,
  SUGGESTED_PROMPTS,
  errorDetails,
  tr,
  showToast,
  adminId
}) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. INTERACTIVE LIVE PREVIEW */}
      {workshopTab === 'preview' && (
        <div className="space-y-6">
          {renderLiveComponent(selectedWidget, randomProps)}
        </div>
      )}

      {/* 2. SOURCE CODE VIEWER */}
      {workshopTab === 'code' && (
        <div className="space-y-4">
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            {tr("Read-only inspection of the active TSX source code file. To edit or adjust logic, use the AI assistant console below.")}
          </p>
          <div className="relative group/code">
            <button
              onClick={() => {
                if (selectedWidget?.code) {
                  navigator.clipboard.writeText(selectedWidget.code);
                  setIsCopied(true);
                  if (showToast) showToast(tr("Source code copied to clipboard!"), 'success');
                  setTimeout(() => setIsCopied(false), 2000);
                }
              }}
              className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-300 hover:text-white flex items-center gap-1.5 transition-all opacity-0 group-hover/code:opacity-100 cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  {tr("Copied!")}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-teal-400" />
                  {tr("Copy")}
                </>
              )}
            </button>
            
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-6 max-h-[350px] overflow-y-auto font-mono text-[9px] text-slate-400 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
              <pre className="whitespace-pre-wrap">{selectedWidget?.code}</pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. PROPS & API SCHEMATIC */}
      {workshopTab === 'props' && (
        <div className="space-y-4">
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            {tr("Pedagogical parameters signature and React properties registered for this interactive simulator.")}
          </p>
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Declared Props</span>
              <div className="font-mono text-[10px] space-y-1">
                {selectedWidget?.propsSignature ? (
                  <pre className="text-teal-400 whitespace-pre-wrap">{selectedWidget.propsSignature}</pre>
                ) : (
                  <>
                    <div><span className="text-blue-400">interactive?</span>: <span className="text-orange-400">boolean</span>; <span className="text-slate-500">// Enable physics/canvas interaction</span></div>
                    <div><span className="text-blue-400">theme?</span>: <span className="text-teal-400">&apos;light&apos; | &apos;dark&apos;</span>;</div>
                    <div><span className="text-blue-400">showControls?</span>: <span className="text-orange-400">boolean</span>; <span className="text-slate-500">// Show interactive parameter bars</span></div>
                  </>
                )}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-900 text-slate-500 text-[9px]">
              MDX JSX Block: <code className="text-slate-350">{`<${selectedWidget?.id} showControls={true} />`}</code>
            </div>
          </div>
        </div>
      )}

      {/* AI REFINEMENT ASSISTANT PROMPT AREA */}
      <div className="pt-6 border-t border-slate-900 space-y-5">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            {tr("AI Prompt Refinement Console")}
          </h4>
          <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[7px] font-black text-cyan-400 uppercase tracking-widest">
            Gemini 2.5 Flash
          </span>
        </div>

        {/* SUGGESTED PRESET CHIPS */}
        <div className="flex flex-wrap gap-1.5">
          {(SUGGESTED_PROMPTS[selectedWidget?.id] || SUGGESTED_PROMPTS.General || []).map((p, i) => (
            <button
              key={i}
              onClick={() => setPrompt(p)}
              disabled={isExecuting || (selectedWidget?.lock !== null && selectedWidget?.lock?.adminId !== adminId && Date.now() < (selectedWidget?.lock?.expiresAt || 0))}
              className="px-3 py-1.5 border border-slate-800 bg-slate-950/30 text-[9px] font-bold text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900/20 rounded-xl transition-all cursor-pointer max-w-xs truncate disabled:opacity-40"
            >
              💡 {tr(p)}
            </button>
          ))}
        </div>

        {/* INPUT FIELD */}
        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isExecuting || (selectedWidget?.lock !== null && selectedWidget?.lock?.adminId !== adminId && Date.now() < (selectedWidget?.lock?.expiresAt || 0))}
            placeholder={tr("Instruct the AI to enhance, modify, or add features to \"{id}\"...").replace("{id}", selectedWidget?.id || '')}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs focus:outline-none focus:border-teal-500 text-white placeholder-slate-600 transition-colors resize-none pr-12 scrollbar-thin disabled:opacity-50"
          />
          
          <button
            onClick={handleRefineWithAI}
            disabled={!prompt.trim() || isExecuting || (selectedWidget?.lock !== null && selectedWidget?.lock?.adminId !== adminId && Date.now() < (selectedWidget?.lock?.expiresAt || 0))}
            className="absolute bottom-4 right-4 p-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:scale-100 shadow-lg shadow-teal-500/10"
          >
            {isExecuting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ChevronRight className="w-4 h-4 font-black" />
            )}
          </button>
        </div>

        {/* AI PROMPT WARNING ALERT */}
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
              {tr("Warning: Ephemeral Draft Preview")}
            </p>
            <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
              {tr("Submitting a prompt will generate a new version of the widget, which must then be approved or rejected. Once approved, the previous version is overwritten and modifications are immediately propagated to the entire site. Handle with care.")}
            </p>
          </div>
        </div>

        {/* RUNNING COMPILER LOADER STEP GRAPH */}
        <AnimatePresence>
          {isExecuting && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-teal-500 animate-spin shrink-0" />
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                  {tr("Compiling Sovereign Refinements...")}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-center">
                {[
                  { step: 1, label: tr("AI Synthesis"), icon: Sparkles },
                  { step: 2, label: tr("Backup FS"), icon: FileText },
                  { step: 3, label: tr("TSX Inject"), icon: Code },
                  { step: 4, label: tr("TSC Compile"), icon: Terminal }
                ].map((s) => {
                  const isDone = currentStep > s.step;
                  const isActive = currentStep === s.step;
                  return (
                    <div key={s.step} className="space-y-1.5">
                      <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-colors ${isDone ? 'bg-emerald-500/10 text-emerald-400' : isActive ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 animate-pulse' : 'bg-slate-900 text-slate-600'}`}>
                        {isDone ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                      </div>
                      <div className={`text-[8px] font-black uppercase tracking-wider ${isActive ? 'text-teal-400' : isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ERROR OUTPUT LOG DISPLAY */}
        <AnimatePresence>
          {errorDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-6 bg-red-950/10 border border-red-500/20 rounded-[24px] space-y-4 shadow-lg shadow-red-950/5 animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-red-400 uppercase tracking-widest">
                    {tr("TSX Compilation Log Rejected")}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-medium">
                    {tr("Build-breaking changes were safely discarded and the active component has been restored.")}
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-red-950/30 rounded-xl p-4 max-h-[220px] overflow-y-auto font-mono text-[9px] text-red-400 leading-relaxed scrollbar-thin scrollbar-thumb-red-950/30">
                <pre className="whitespace-pre-wrap">{errorDetails}</pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
