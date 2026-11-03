"use client";

import React from 'react';
import { Sparkles, X, ChevronLeft, ChevronRight, Brain, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TutorPersonality } from '@/lib/db';
import { EMOJI_MAP, TUTOR_LOCAL_STRINGS } from './tutorStringsAndHelpers';

export const TutorFlashcardsPanel = ({
  flashcards,
  currentCardIndex,
  setCurrentCardIndex,
  isFlipped,
  setIsFlipped,
  cardMastery,
  handleRateCard,
  isCoachingDismissed,
  setIsCoachingDismissed,
  t
}: {
  flashcards: { term: string; definition: string }[];
  currentCardIndex: number;
  setCurrentCardIndex: React.Dispatch<React.SetStateAction<number>>;
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  cardMastery: Record<string, string>;
  handleRateCard: (rating: 'easy' | 'medium' | 'hard') => void;
  isCoachingDismissed: boolean;
  setIsCoachingDismissed: (v: boolean) => void;
  t: any;
}) => (
  <div className="flex-1 flex flex-col justify-between p-6 bg-slate-950/20 overflow-y-auto">
    <style>{`
      .perspective-1000 { perspective: 1000px; }
      .preserve-3d { transform-style: preserve-3d; }
      .backface-hidden { backface-visibility: hidden; }
      .rotateY-180 { transform: rotateY(180deg); }
    `}</style>
    <div className="space-y-4">
      <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest select-none">
        <span>{t.spaced_repetition}</span>
        <span>
          {flashcards.length > 0 ? `${currentCardIndex + 1} / ${flashcards.length}` : '0 / 0'}
        </span>
      </div>

      {flashcards.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs italic">
          {t.no_flashcards}
        </div>
      ) : (
        <div className="flex items-center gap-2 my-6 select-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
              setTimeout(() => {
                setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
              }, 150);
            }}
            className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all hover:bg-slate-800 focus:outline-none cursor-pointer shrink-0"
            aria-label={t.prev_card}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="perspective-1000 flex-1">
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full min-h-[220px] rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-xl relative preserve-3d"
            >
              {/* Card Front */}
              <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest mb-3">
                  {t.card_concept}
                </span>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {flashcards[currentCardIndex]?.term}
                </h3>
                {cardMastery[flashcards[currentCardIndex]?.term] && (
                  <span className={`mt-4 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                    cardMastery[flashcards[currentCardIndex]?.term] === 'easy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    cardMastery[flashcards[currentCardIndex]?.term] === 'medium' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {cardMastery[flashcards[currentCardIndex]?.term]}
                  </span>
                )}
                <p className="text-[9px] text-slate-500 mt-6 italic font-bold tracking-wider uppercase select-none">
                  {t.click_to_flip}
                </p>
              </div>

              {/* Card Back */}
              <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden transform rotateY-180 ${!isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest mb-3">
                  {t.card_definition}
                </span>
                <div className="overflow-y-auto max-h-[140px] px-2 custom-scrollbar my-2 text-center w-full">
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    {flashcards[currentCardIndex]?.definition}
                  </p>
                </div>
                <p className="text-[9px] text-slate-500 mt-4 italic font-bold tracking-wider uppercase select-none">
                  {t.click_to_flip}
                </p>
              </div>
            </motion.div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
              setTimeout(() => {
                setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
              }, 150);
            }}
            className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all hover:bg-slate-800 focus:outline-none cursor-pointer shrink-0"
            aria-label={t.next_card}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>

    {flashcards.length > 0 && (
      <div className="space-y-4 pt-4 border-t border-slate-800/40 shrink-0">
        {isFlipped ? (
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest text-center select-none">
              {t.rate_mastery}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRateCard('hard')}
                className="py-2 bg-rose-950/20 border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                🔴 {t.mastery_hard}
              </button>
              <button
                onClick={() => handleRateCard('medium')}
                className="py-2 bg-amber-950/20 border border-amber-500/30 hover:bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                🟡 {t.mastery_medium}
              </button>
              <button
                onClick={() => handleRateCard('easy')}
                className="py-2 bg-emerald-950/20 border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                🟢 {t.mastery_easy}
              </button>
            </div>
          </div>
        ) : null}

        {!isFlipped && !isCoachingDismissed && (
          <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-left relative overflow-hidden">
            <button
              onClick={() => {
                setIsCoachingDismissed(true);
                localStorage.setItem('op_dismiss_flashcard_coaching', 'true');
              }}
              className="absolute top-3 right-3 w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white flex items-center justify-center border border-slate-700 transition-all cursor-pointer z-10"
              title={t.coaching_dismiss}
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest flex items-center gap-1.5 mb-1.5 pr-8 select-none">
              <Sparkles className="w-3 h-3 animate-pulse" />
              {t.coaching_title}
            </p>
            <p className="text-[10px] text-slate-300 leading-relaxed font-medium pr-8">
              {t.coaching_desc}
            </p>
          </div>
        )}
      </div>
    )}
  </div>
);

export const TutorSelectorModal = ({
  showTutorModal,
  setShowTutorModal,
  personalities,
  persona,
  handleSelectTutor,
  lang,
  t
}: {
  showTutorModal: boolean;
  setShowTutorModal: (v: boolean) => void;
  personalities: TutorPersonality[];
  persona: string;
  handleSelectTutor: (id: string) => void;
  lang: string;
  t: any;
}) => (
  <AnimatePresence>
    {showTutorModal && (
      <div onClick={() => setShowTutorModal(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xl cursor-pointer">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] cursor-default"
        >
          <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  {t.select_ai_tutor}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {t.tutor_modal_desc}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowTutorModal(false)}
              className="p-3 text-slate-500 hover:text-white rounded-2xl hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-slate-900/50">
            {personalities.map(tOption => {
              const code = (lang || 'EN').toUpperCase();
              const translationsAny = tOption.translations as any;
              const localizedName = translationsAny?.[code]?.name || tOption.name;
              const localizedDesc = translationsAny?.[code]?.desc ||
                translationsAny?.[code]?.prompt?.slice(0, 120) + '...' ||
                tOption.prompt?.slice(0, 120) + '...';
              const isSelected = tOption.id === persona;
              const emoji = EMOJI_MAP[tOption.id] || '🤖';
              return (
                <div 
                  key={tOption.id}
                  onClick={() => handleSelectTutor(tOption.id)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-6 group relative overflow-hidden ${
                    isSelected 
                      ? 'bg-blue-600/10 border-blue-500/60 shadow-lg shadow-blue-500/5' 
                      : 'bg-slate-950/30 border-slate-800 hover:border-slate-700 hover:bg-slate-950/50'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                      isSelected ? 'bg-blue-600/20 scale-105' : 'bg-slate-900 group-hover:scale-105'
                    }`}>
                      {emoji}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white tracking-wide flex items-center gap-2">
                        {localizedName}
                        {isSelected && (
                          <span className="px-2.5 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-[8px] font-black uppercase tracking-wider">
                            {t.active}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed max-w-md">
                        {localizedDesc}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                      : 'border-slate-800 group-hover:border-slate-750 text-transparent group-hover:text-slate-655'
                  }`}>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-8 border-t border-slate-800 bg-slate-950/40 text-center">
            <p className="text-xs text-slate-500 font-semibold italic">
              {t.tutor_modal_footer}
            </p>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const TutorCoachPopover = ({
  isOpen,
  showCoachPopover,
  coachAdvice,
  handleDismissCoachPopover,
  handleOpenChatFromCoach,
  persona,
  getPersonaName,
  lang,
  t
}: {
  isOpen: boolean;
  showCoachPopover: boolean;
  coachAdvice: string;
  handleDismissCoachPopover: () => void;
  handleOpenChatFromCoach: () => void;
  persona: string;
  getPersonaName: (id: string) => string;
  lang: string;
  t: any;
}) => {
  const tls = TUTOR_LOCAL_STRINGS[lang.toUpperCase()] || TUTOR_LOCAL_STRINGS.EN;
  return (
    <AnimatePresence>
      {!isOpen && showCoachPopover && coachAdvice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="w-[320px] bg-slate-900/95 border border-blue-500/30 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden flex flex-col gap-3 mr-2 mb-2 select-none"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <button
            onClick={handleDismissCoachPopover}
            className="absolute top-4 right-4 p-1 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800/40 transition-all cursor-pointer"
            title={t.coaching_dismiss}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg">
              {EMOJI_MAP[persona] || '🤖'}
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">
                {tls.coachAdviceLabel}
              </p>
              <h4 className="text-xs font-black text-white leading-none">
                {getPersonaName(persona)}
              </h4>
            </div>
          </div>

          <p className="text-xs text-slate-350 leading-relaxed font-medium pr-6 mt-1">
            {coachAdvice}
          </p>

          <button
            onClick={handleOpenChatFromCoach}
            className="w-full mt-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {tls.discussWithTutor}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
