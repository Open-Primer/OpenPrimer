"use client";

import React from 'react';
import { PenTool, Square, Volume2, Mic, AlertCircle, RefreshCw } from 'lucide-react';
import { getEvaluationStrings } from '../evaluation/strings';

interface FileAttachment {
  name: string;
  type: string;
  size: number;
  base64: string;
}

interface EssayWorkspaceProps {
  submissionType: 'text' | 'file' | 'audio';
  setSubmissionType: (type: 'text' | 'file' | 'audio') => void;
  answer: string;
  setAnswer: (val: string) => void;
  fileAttachment: FileAttachment | null;
  setFileAttachment: (file: FileAttachment | null) => void;
  filePreview: string | null;
  setFilePreview: (url: string | null) => void;
  isRecording: boolean;
  recordingSeconds: number;
  audioUrl: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  isLoading: boolean;
  isReadOnly: boolean;
  isTimeUp: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  onSubmit: () => void;
  durationLimit?: number;
  t: {
    placeholder: string;
    evaluating: string;
    submit: string;
    eval_submit_early: string;
  };
  lang?: string;
}

export const EssayWorkspace: React.FC<EssayWorkspaceProps> = ({
  submissionType,
  setSubmissionType,
  answer,
  setAnswer,
  fileAttachment,
  setFileAttachment,
  filePreview,
  setFilePreview,
  isRecording,
  recordingSeconds,
  audioUrl,
  startRecording,
  stopRecording,
  isLoading,
  isReadOnly,
  isTimeUp,
  error,
  setError,
  onSubmit,
  durationLimit,
  t,
  lang,
}) => {
  const es = getEvaluationStrings(lang);

  const handleFileChange = (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError(es.fileLimitError);
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileAttachment({
        name: file.name,
        type: file.type,
        size: file.size,
        base64: reader.result as string,
      });
      if (file.type.startsWith('image/')) {
        setFilePreview(reader.result as string);
      } else {
        setFilePreview(null);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Tab controls */}
      {!isReadOnly && !isTimeUp && (
        <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl mb-4 max-w-md">
          <button
            onClick={() => setSubmissionType('text')}
            type="button"
            className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              submissionType === 'text'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {es.tabWrite}
          </button>
          <button
            onClick={() => setSubmissionType('file')}
            type="button"
            className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              submissionType === 'file'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {es.tabUpload}
          </button>
          <button
            onClick={() => setSubmissionType('audio')}
            type="button"
            className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              submissionType === 'audio'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {es.tabOral}
          </button>
        </div>
      )}

      {/* TEXT SUBMISSION TYPE */}
      {submissionType === 'text' && (
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isLoading || isReadOnly || isTimeUp}
          placeholder={t.placeholder}
          className="w-full h-44 bg-slate-950 border border-slate-800 focus:border-violet-500 outline-none rounded-2xl p-4 text-slate-100 text-sm leading-relaxed resize-none transition-all placeholder:text-slate-500 disabled:opacity-75 disabled:text-slate-300 font-sans"
        />
      )}

      {/* FILE SUBMISSION TYPE (WRITE MODE) */}
      {submissionType === 'file' && !isReadOnly && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange(e.dataTransfer.files?.[0]);
            }}
            className="w-full min-h-36 border-2 border-dashed border-slate-800 hover:border-violet-500 bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer relative group"
          >
            <input
              type="file"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              disabled={isLoading || isReadOnly || isTimeUp}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            {fileAttachment ? (
              <div className="space-y-2 z-10 pointer-events-none">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-20 mx-auto rounded-lg border border-slate-800 object-contain shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-violet-400 flex items-center justify-center mx-auto text-xs font-black">
                    {fileAttachment.name.split('.').pop()?.toUpperCase() || 'FILE'}
                  </div>
                )}
                <div>
                  <p className="text-slate-100 text-xs font-bold">{fileAttachment.name}</p>
                  <p className="text-slate-500 text-[10px]">
                    {(fileAttachment.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <PenTool className="w-4 h-4" />
                </div>
                <p className="text-slate-300 text-xs font-medium">{es.fileDropTitle}</p>
                <p className="text-slate-500 text-[9px]">{es.fileDropTypes}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">
              {es.notesLabel}
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={isLoading || isReadOnly || isTimeUp}
              placeholder={es.notesPlaceholderEssay}
              className="w-full h-20 bg-slate-950 border border-slate-800 focus:border-violet-500 outline-none rounded-2xl p-4 text-slate-100 text-xs resize-none transition-all disabled:opacity-75 disabled:text-slate-300"
            />
          </div>
        </div>
      )}

      {/* FILE SUBMISSION TYPE (READ-ONLY/GRADE MODE) */}
      {submissionType === 'file' && isReadOnly && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            {filePreview ? (
              <img
                src={filePreview}
                alt="Submitted File"
                className="w-14 h-14 rounded-lg border border-slate-800 object-contain bg-slate-900"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-violet-400 flex items-center justify-center text-xs font-black">
                {fileAttachment?.name.split('.').pop()?.toUpperCase() || 'FILE'}
              </div>
            )}
            <div>
              <p className="text-[10px] font-black uppercase text-violet-500 tracking-widest">
                {es.uploadedFileLabel}
              </p>
              <p className="text-slate-100 text-xs font-bold">{fileAttachment?.name}</p>
              <p className="text-slate-500 text-[10px]">
                {fileAttachment ? (fileAttachment.size / 1024).toFixed(1) : 0} KB
              </p>
            </div>
          </div>

          {answer.trim() && (
            <div className="border-t border-slate-800/60 pt-3">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">
                {es.notesLabel}
              </span>
              <p className="text-slate-300 text-xs leading-relaxed italic">"{answer}"</p>
            </div>
          )}
        </div>
      )}

      {/* AUDIO SUBMISSION TYPE (WRITE MODE) */}
      {submissionType === 'audio' && !isReadOnly && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center gap-4 min-h-[220px]">
          {isRecording ? (
            <div className="space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
                <button
                  onClick={stopRecording}
                  type="button"
                  className="w-16 h-16 rounded-full bg-red-600 border border-red-500 text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-500 transition-colors z-10"
                >
                  <Square className="w-6 h-6 fill-white" />
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-red-400 text-xs font-black uppercase tracking-wider">
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

          {!isRecording && (
            <div className="w-full text-left space-y-2 border-t border-slate-900 pt-4 mt-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">
                {es.complementaryNotesOptional}
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isLoading || isReadOnly || isTimeUp}
                placeholder={es.notesPlaceholderOral}
                className="w-full h-16 bg-slate-950 border border-slate-800 focus:border-violet-500 outline-none rounded-xl p-3 text-slate-200 text-xs resize-none transition-all disabled:opacity-75 disabled:text-slate-300"
              />
            </div>
          )}
        </div>
      )}

      {/* AUDIO SUBMISSION TYPE (READ-ONLY/GRADE MODE) */}
      {submissionType === 'audio' && isReadOnly && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-violet-400 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <div className="flex-1 w-full space-y-2">
              <div>
                <p className="text-[10px] font-black uppercase text-violet-500 tracking-widest">
                  {es.recordedOralLabel}
                </p>
                <p className="text-slate-500 text-[9px] font-medium leading-none mt-0.5">
                  {fileAttachment?.name || 'oral-submission.webm'}
                </p>
              </div>
              {audioUrl && (
                <audio
                  src={audioUrl}
                  controls
                  className="w-full max-w-xs accent-violet-600 bg-slate-900 border border-slate-800 rounded-xl h-9"
                />
              )}
            </div>
          </div>

          {answer.trim() && (
            <div className="border-t border-slate-800/60 pt-3">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">
                {es.notesLabel}
              </span>
              <p className="text-slate-300 text-xs leading-relaxed italic">"{answer}"</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {!isReadOnly && !isTimeUp && (
        <div className="space-y-2">
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-violet-600/10 active:scale-[0.99]"
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
          {!!durationLimit && durationLimit > 0 && !isTimeUp && !isReadOnly && !isLoading && (answer.trim().length >= 10 || fileAttachment) && (
            <p className="text-center text-[10px] text-slate-400 italic">
              {t.eval_submit_early}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
