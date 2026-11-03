import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, RefreshCw } from 'lucide-react';

interface TutorInputAreaProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  isGenerating: boolean;
  input: string;
  setInput: (v: string) => void;
  handleSend: (t?: string) => void;
  isListening: boolean;
  micActivity: number;
  toggleListening: () => void;
  stopGeneration: () => void;
  t: any;
  tls: any;
}

export const TutorInputArea: React.FC<TutorInputAreaProps> = ({
  textareaRef,
  isGenerating,
  input,
  setInput,
  handleSend,
  isListening,
  micActivity,
  toggleListening,
  stopGeneration,
  t,
  tls
}) => {
  return (
    <div className="p-6 bg-slate-950/50 border-t border-slate-800/50">
      <div className="relative flex items-end">
        <textarea
          ref={textareaRef}
          disabled={isGenerating}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          placeholder={t.placeholder}
          className="w-full bg-slate-800/40 border border-slate-775 rounded-2xl py-3.5 pl-4 pr-28 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none transition-all disabled:opacity-50"
        />

        <div className="absolute right-16 bottom-3 flex items-center justify-center">
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-xl bg-blue-500/30 z-0"
                style={{
                  scale: 1 + (micActivity / 128) * 0.6,
                  opacity: 0.3 + (micActivity / 255) * 0.7,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
              <motion.div
                className="absolute inset-0 rounded-xl bg-indigo-500/20 z-0"
                style={{
                  scale: 1 + (micActivity / 128) * 0.3,
                  opacity: 0.2 + (micActivity / 255) * 0.5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.05 }}
              />
            </>
          )}
          <button
            type="button"
            disabled={isGenerating}
            onClick={toggleListening}
            className={`relative z-10 p-2 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-105 animate-pulse'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
            } disabled:opacity-40`}
            title={isListening ? tls.speech_listening : tls.speech_dictate}
          >
            {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isGenerating ? (
          <button
            type="button"
            onClick={stopGeneration}
            className="absolute right-3.5 bottom-3 p-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-xl transition-all border border-rose-500/30 flex items-center justify-center group"
            title={t.stop_generating || "Stop generation"}
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin group-hover:scale-110 transition-transform" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="absolute right-3.5 bottom-3 p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl disabled:opacity-30 disabled:scale-100 hover:scale-105 transition-all shadow-md shadow-blue-600/20"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="mt-3 text-[9px] text-slate-500/80 leading-normal text-center font-medium">
        {t.disclaimer}
      </div>
    </div>
  );
};
