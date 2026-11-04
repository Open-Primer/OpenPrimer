import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Brain, ChevronRight } from 'lucide-react';

interface TutorSelectorModalProps {
  showTutorModal: boolean;
  setShowTutorModal: (show: boolean) => void;
  tutors: any[];
  activeTutorId: string;
  handleSelectTutor: (id: string) => Promise<void>;
  t: any;
  lang?: string;
}

export const TutorSelectorModal: React.FC<TutorSelectorModalProps> = ({
  showTutorModal,
  setShowTutorModal,
  tutors,
  activeTutorId,
  handleSelectTutor,
  t,
  lang = "EN"
}) => {
  return (
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
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-slate-900/50">
                {tutors.map(tOption => {
                  const code = (lang || 'EN').toUpperCase();
                  const localizedName = tOption.translations?.[code]?.name || tOption.name;
                  const localizedDesc = tOption.translations?.[code]?.desc ||
                    tOption.translations?.[code]?.prompt?.slice(0, 120) + '...' ||
                    tOption.prompt?.slice(0, 120) + '...';
                  const isSelected = tOption.id === activeTutorId;
                  // Emoji fallback map
                  const EMOJI_MAP: Record<string, string> = {
                    socratic: '💬', direct: '⚡', gamified: '🚀', historical: '📚',
                    feynman: '💡', proof: '📐', engineer: '🔧', debater: '🗣️',
                    analogy_alchemist: '🧪', cognitive_catalyst: '🧠',
                    heuristic_explorer: '🔭', diamond_age: '💎',
                  };
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
                        <Icons.Check className="w-4 h-4 stroke-[3]" />
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
};
