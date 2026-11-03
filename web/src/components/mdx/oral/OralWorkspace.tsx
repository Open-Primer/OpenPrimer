"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Volume2, AlertCircle, RefreshCw } from 'lucide-react';
import { getEvaluationStrings } from '../evaluation/strings';

interface OralWorkspaceProps {
  isRecording: boolean;
  recordingSeconds: number;
  audioUrl: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  answer: string;
  setAnswer: (val: string) => void;
  isLoading: boolean;
  isReadOnly: boolean;
  isTimeUp: boolean;
  error: string | null;
  onSubmit: () => void;
  actualDurationLimit?: number;
  t: {
    placeholder: string;
    evaluating: string;
    submit: string;
    eval_submit_early: string;
  };
  lang?: string;
}

export const OralWorkspace: React.FC<OralWorkspaceProps> = ({
  isRecording,
  recordingSeconds,
  audioUrl,
  startRecording,
  stopRecording,
  answer,
  setAnswer,
  isLoading,
  isReadOnly,
  isTimeUp,
  error,
  onSubmit,
  actualDurationLimit,
  t,
  lang,
}) => {
  const es = getEvaluationStrings(lang);

  return (
    <div className="space-y-4">
      {!isReadOnly && !isTimeUp && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center gap-4 min-h-[220px]">
          {isRecording ? (
            <div className="space-y-5 w-full flex flex-col items-center">
              {/* Visual Soundwave simulation */}
              <div className="flex items-center gap-1.5 justify-center h-10 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1].map((bar, idx) => (
                  <motion.div
                    key={idx}
                    className="w-1 bg-violet-500 rounded-full"
                    animate={{ height: [12, bar * 4, 12] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: idx * 0.04, ease: "easeInOut" }}
                  />
                ))}
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
                <button
                  onClick={stopRecording}
                  type="button"
                  className="w-16 h-16 rounded-full bg-red-600 border border-red-500 text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-500 transition-all z-10 hover:scale-95"
                >
                  <Square className="w-6 h-6 fill-white" />
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-red-400 text-xs font-black uppercase tracking-wider animate-pulse">
                  {es.recordingLive}
                </p>
                <p className="text-white text-lg font-mono font-bold">
                  {Math.floor(recordingSeconds / 60)}:
                  {(recordingSeconds % 60).toString().padStart(2, '0')} / 2:00
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {audioUrl ? (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <p className="text-slate-300 text-xs font-bold">{es.oralReady}</p>
                  <audio
                    src={audioUrl}
                    controls
                    className="mx-auto max-w-xs w-full accent-violet-600 bg-slate-900 border border-slate-800 rounded-xl"
                  />
                  <button
                    onClick={startRecording}
                    disabled={isLoading || isReadOnly || isTimeUp}
                    type="button"
                    className="px-4 py-2 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer bg-slate-900/60 disabled:opacity-50"
                  >
                    {es.recordAgain}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={startRecording}
                    disabled={isLoading || isReadOnly || isTimeUp}
                    type="button"
                    className="w-16 h-16 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/20 cursor-pointer transition-all hover:scale-105 mx-auto disabled:opacity-50"
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                  <div className="space-y-1">
                    <p className="text-slate-300 text-xs font-bold">{es.startOralRecording}</p>
                    <p className="text-slate-500 text-[10px] max-w-xs mx-auto leading-relaxed">
                      {es.oralRecordingHint}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Real-time speech transcription display box */}
      <div className="space-y-2 text-left">
        <label className="text-[10px] font-black uppercase text-violet-500 tracking-widest block">
          {es.realtimeTranscription}
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isLoading || isReadOnly || isTimeUp}
          placeholder={es.oralPlaceholder}
          className="w-full h-28 bg-slate-950 border border-slate-800 focus:border-violet-500 outline-none rounded-2xl p-4 text-slate-100 text-xs resize-none transition-all placeholder:text-slate-600 disabled:opacity-75 disabled:text-slate-300 font-sans leading-relaxed"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!isReadOnly && !isTimeUp && (
        <div className="space-y-2">
          <button
            onClick={onSubmit}
            disabled={isLoading || (!audioUrl && answer.trim().length < 5)}
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-lg shadow-violet-600/10 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                {t.evaluating}
              </>
            ) : (
              t.submit
            )}
          </button>
          {!!actualDurationLimit && !isTimeUp && !isReadOnly && !isLoading && (answer.trim().length >= 5 || audioUrl) && (
            <p className="text-center text-[10px] text-slate-400 italic">
              {t.eval_submit_early}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
