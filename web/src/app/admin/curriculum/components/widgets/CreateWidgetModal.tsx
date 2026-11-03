import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Info, ChevronDown, Check, Sparkles, Loader2 } from 'lucide-react';
import { ACADEMIC_LEVELS, getDisciplineLabel } from '../../strings';

interface CreateWidgetModalProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
  newWidgetNameFR: string;
  setNewWidgetNameFR: (v: string) => void;
  newWidgetNameEN: string;
  setNewWidgetNameEN: (v: string) => void;
  newWidgetLevelFR: string;
  setNewWidgetLevelFR: (v: string) => void;
  newWidgetLevelEN: string;
  setNewWidgetLevelEN: (v: string) => void;
  newWidgetDescFR: string;
  setNewWidgetDescFR: (v: string) => void;
  newWidgetDescEN: string;
  setNewWidgetDescEN: (v: string) => void;
  newWidgetDisciplines: string[];
  setNewWidgetDisciplines: (v: string[]) => void;
  newWidgetPrompt: string;
  setNewWidgetPrompt: (v: string) => void;
  isCreateLevelDropdownOpen: boolean;
  setIsCreateLevelDropdownOpen: (v: boolean) => void;
  isCreateSubjectDropdownOpen: boolean;
  setIsCreateSubjectDropdownOpen: (v: boolean) => void;
  toggleAcademicLevel: (val: string, state: 'edit' | 'new') => void;
  toggleDiscipline: (disc: string, state: 'edit' | 'new') => void;
  getDisciplinesSummary: (selected: string[]) => string;
  handleCreateWidget: () => void;
  isExecuting: boolean;
  isCreateFormInvalid: boolean;
  namingCollisionError: string | null;
  isFrancophoneLocale: boolean;
  lang: string;
  tr: (key: string) => string;
  DISCIPLINES_LIST: string[];
}

export const CreateWidgetModal: React.FC<CreateWidgetModalProps> = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  newWidgetNameFR,
  setNewWidgetNameFR,
  newWidgetNameEN,
  setNewWidgetNameEN,
  newWidgetLevelFR,
  setNewWidgetLevelFR,
  newWidgetLevelEN,
  setNewWidgetLevelEN,
  newWidgetDescFR,
  setNewWidgetDescFR,
  newWidgetDescEN,
  setNewWidgetDescEN,
  newWidgetDisciplines,
  setNewWidgetDisciplines,
  newWidgetPrompt,
  setNewWidgetPrompt,
  isCreateLevelDropdownOpen,
  setIsCreateLevelDropdownOpen,
  isCreateSubjectDropdownOpen,
  setIsCreateSubjectDropdownOpen,
  toggleAcademicLevel,
  toggleDiscipline,
  getDisciplinesSummary,
  handleCreateWidget,
  isExecuting,
  isCreateFormInvalid,
  namingCollisionError,
  isFrancophoneLocale,
  lang,
  tr,
  DISCIPLINES_LIST
}) => {
  return (
    <AnimatePresence>
        {isCreateModalOpen && (
          <div 
            onClick={() => setIsCreateModalOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-[35px] max-w-2xl w-full p-8 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden cursor-default"
            >
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-slate-950 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 shrink-0 border-b border-slate-800 pb-4 pr-12">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-teal-400" />
                  {tr("Create Brand New Interactive Widget")}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {tr("The AI agent will generate, run a static check verify, and deploy a self-contained simulator block.")}
                </p>
              </div>

              <div className="flex-grow overflow-y-auto py-6 pr-2 pb-24 scrollbar-thin space-y-4">
                
                {/* Active-Language Only Inputs Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {isFrancophoneLocale ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Name")}</label>
                        <input
                          type="text"
                          value={newWidgetNameFR}
                          onChange={(e) => setNewWidgetNameFR(e.target.value)}
                          placeholder="Ex: Laboratoire Optique Lumineuse"
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 ${newWidgetNameFR.trim().length < 3 || newWidgetNameFR.trim().length > 50 || namingCollisionError ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800'}`}
                        />
                        {/* Naming Collision and Length Indicators */}
                        <div className="mt-1.5 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-[9px] text-slate-450 leading-relaxed font-medium">
                            {tr("Display name must be between 3 and 50 characters. It will automatically compile the technical component PascalCase ID.")}
                          </p>
                        </div>
                        {namingCollisionError && (
                          <p className="text-[9px] font-semibold text-rose-400 mt-1 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {namingCollisionError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Academic Level")}</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreateLevelDropdownOpen(!isCreateLevelDropdownOpen);
                              setIsCreateSubjectDropdownOpen(false);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-550 flex items-center justify-between cursor-pointer"
                          >
                            <span className={!newWidgetLevelFR ? "text-slate-600" : ""}>
                              {newWidgetLevelFR || tr("Select academic levels...")}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCreateLevelDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isCreateLevelDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 shadow-xl space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin"
                              >
                                {ACADEMIC_LEVELS.map(lvl => {
                                  const isChecked = newWidgetLevelFR.toLowerCase().split(' / ').map(s => s.trim()).includes(lvl.FR.toLowerCase());
                                  return (
                                    <button
                                      key={lvl.value}
                                      type="button"
                                      onClick={() => toggleAcademicLevel(lvl.value, 'new')}
                                      className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${isChecked ? 'bg-teal-500/10 text-teal-400 font-bold' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
                                    >
                                      <span>{lvl.FR}</span>
                                      {isChecked && <Check className="w-3.5 h-3.5 text-teal-400" />}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Description")}</label>
                        <textarea
                          rows={2}
                          value={newWidgetDescFR}
                          onChange={(e) => setNewWidgetDescFR(e.target.value)}
                          placeholder="Ex: Simulation physique de la réfraction de la lumière à travers des prismes."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 resize-none"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Name")}</label>
                        <input
                          type="text"
                          value={newWidgetNameEN}
                          onChange={(e) => setNewWidgetNameEN(e.target.value)}
                          placeholder="Ex: Light Optics Simulator"
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 ${newWidgetNameEN.trim().length < 3 || newWidgetNameEN.trim().length > 50 || namingCollisionError ? 'border-rose-500/50 focus:border-rose-555' : 'border-slate-800'}`}
                        />
                        {/* Naming Collision and Length Indicators */}
                        <div className="mt-1.5 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-[9px] text-slate-450 leading-relaxed font-medium">
                            {tr("Display name must be between 3 and 50 characters. It will automatically compile the technical component PascalCase ID.")}
                          </p>
                        </div>
                        {namingCollisionError && (
                          <p className="text-[9px] font-semibold text-rose-400 mt-1 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {namingCollisionError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Academic Level")}</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreateLevelDropdownOpen(!isCreateLevelDropdownOpen);
                              setIsCreateSubjectDropdownOpen(false);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-550 flex items-center justify-between cursor-pointer"
                          >
                            <span className={!newWidgetLevelEN ? "text-slate-600" : ""}>
                              {newWidgetLevelEN || tr("Select academic levels...")}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCreateLevelDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isCreateLevelDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 shadow-xl space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin"
                              >
                                {ACADEMIC_LEVELS.map(lvl => {
                                  const isChecked = newWidgetLevelEN.toLowerCase().split(' / ').map(s => s.trim()).includes(lvl.EN.toLowerCase());
                                  return (
                                    <button
                                      key={lvl.value}
                                      type="button"
                                      onClick={() => toggleAcademicLevel(lvl.value, 'new')}
                                      className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${isChecked ? 'bg-teal-500/10 text-teal-400 font-bold' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
                                    >
                                      <span>{lvl.EN}</span>
                                      {isChecked && <Check className="w-3.5 h-3.5 text-teal-400" />}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Description")}</label>
                        <textarea
                          rows={2}
                          value={newWidgetDescEN}
                          onChange={(e) => setNewWidgetDescEN(e.target.value)}
                          placeholder="Ex: Physics simulation of light refraction through interactive glass prisms."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Compact Disciplines Selector Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">{tr("Target Subject Fields")}</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreateSubjectDropdownOpen(!isCreateSubjectDropdownOpen);
                          setIsCreateLevelDropdownOpen(false);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-550 flex items-center justify-between cursor-pointer"
                      >
                        <span className={newWidgetDisciplines.length === 0 ? "text-slate-600" : ""}>
                          {getDisciplinesSummary(newWidgetDisciplines)}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCreateSubjectDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isCreateSubjectDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-xl space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800"
                          >
                            <div className="grid grid-cols-2 gap-1.5">
                              {DISCIPLINES_LIST.map((disc) => {
                                const isChecked = newWidgetDisciplines.includes(disc);
                                return (
                                  <button
                                    key={disc}
                                    type="button"
                                    onClick={() => toggleDiscipline(disc, 'new')}
                                    className={`px-2.5 py-2 border rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors text-left flex items-center justify-between cursor-pointer ${isChecked ? 'bg-teal-500 border-teal-400 text-slate-950' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-750 hover:text-white'}`}
                                  >
                                    <span className="truncate mr-1">{getDisciplineLabel(disc, lang)}</span>
                                    {isChecked && <Check className="w-3 h-3 text-slate-950 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* AI Prompt */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">{tr("Instructions for AI Generation (Prompt)")}</label>
                  <textarea
                    rows={4}
                    value={newWidgetPrompt}
                    onChange={(e) => setNewWidgetPrompt(e.target.value)}
                    placeholder="Ex: Crée un simulateur physique interactif de réfraction de la lumière. L'utilisateur peut déplacer un rayon lumineux sur un canevas 2D, ajouter des prismes de verre de différentes formes (triangle, rectangle) et ajuster l'indice de réfraction du verre avec un slider. Calcule les angles réels de réfraction."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs focus:outline-none focus:border-teal-555 text-white placeholder-slate-650 resize-none scrollbar-thin font-medium leading-relaxed"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {tr("Cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleCreateWidget}
                  disabled={isCreateFormInvalid}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 hover:scale-[1.01] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/10 disabled:opacity-40 disabled:scale-100"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                  {tr("Generate & Deploy")}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </AnimatePresence>
  );
};
