import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, Info, ChevronDown, Check, ShieldAlert, Loader2 } from 'lucide-react';
import { ACADEMIC_LEVELS, getDisciplineLabel } from '../../strings';

interface EditWidgetModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (v: boolean) => void;
  selectedWidget: any;
  editNameFR: string;
  setEditNameFR: (v: string) => void;
  editNameEN: string;
  setEditNameEN: (v: string) => void;
  editLevelFR: string;
  setEditLevelFR: (v: string) => void;
  editLevelEN: string;
  setEditLevelEN: (v: string) => void;
  editDescFR: string;
  setEditDescFR: (v: string) => void;
  editDescEN: string;
  setEditDescEN: (v: string) => void;
  editDisciplines: string[];
  setEditDisciplines: (v: string[]) => void;
  isEditLevelDropdownOpen: boolean;
  setIsEditLevelDropdownOpen: (v: boolean) => void;
  isEditSubjectDropdownOpen: boolean;
  setIsEditSubjectDropdownOpen: (v: boolean) => void;
  toggleAcademicLevel: (val: string, state: 'edit' | 'new') => void;
  toggleDiscipline: (disc: string, state: 'edit' | 'new') => void;
  getDisciplinesSummary: (selected: string[]) => string;
  handleSaveParameters: () => void;
  isSavingMetadata: boolean;
  isEditFormInvalid: boolean;
  isFrancophoneLocale: boolean;
  lang: string;
  tr: (key: string) => string;
  DISCIPLINES_LIST: string[];
}

export const EditWidgetModal: React.FC<EditWidgetModalProps> = ({
  isEditModalOpen,
  setIsEditModalOpen,
  selectedWidget,
  editNameFR,
  setEditNameFR,
  editNameEN,
  setEditNameEN,
  editLevelFR,
  setEditLevelFR,
  editLevelEN,
  setEditLevelEN,
  editDescFR,
  setEditDescFR,
  editDescEN,
  setEditDescEN,
  editDisciplines,
  setEditDisciplines,
  isEditLevelDropdownOpen,
  setIsEditLevelDropdownOpen,
  isEditSubjectDropdownOpen,
  setIsEditSubjectDropdownOpen,
  toggleAcademicLevel,
  toggleDiscipline,
  getDisciplinesSummary,
  handleSaveParameters,
  isSavingMetadata,
  isEditFormInvalid,
  isFrancophoneLocale,
  lang,
  tr,
  DISCIPLINES_LIST
}) => {
  return (
    <AnimatePresence>
        {isEditModalOpen && (
          <div 
            onClick={() => setIsEditModalOpen(false)}
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
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-slate-950 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 shrink-0 border-b border-slate-800 pb-4 pr-12">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-teal-400" />
                  {tr("Edit parameters: {id}").replace(/[:：]\s*\{id\}/, "").trim()}
                </h3>
                <p className="text-[10px] text-slate-450">
                  {tr("Modify pedagogical metrics displayed to content authors within curriculum schedules.")}
                </p>
              </div>

              <div className="flex-grow overflow-y-auto py-6 pr-2 pb-24 scrollbar-thin space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isFrancophoneLocale ? (
                    <>
                      {/* Name FR */}
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Name")}
                        </label>
                        <input
                          type="text"
                          value={editNameFR}
                          onChange={(e) => setEditNameFR(e.target.value)}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 ${editNameFR.trim().length < 3 || editNameFR.trim().length > 50 ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800'}`}
                        />
                        {/* Display Name Tip Warning */}
                        <div className="mt-1.5 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-[9px] text-slate-450 leading-relaxed font-medium">
                            {tr("Modifying the display name does not alter the technical component ID ({id}), which remains fixed for system stability. Enter between 3 and 50 characters.").replace("{id}", selectedWidget?.id || '')}
                          </p>
                        </div>
                      </div>
                      {/* Academic Level FR (Interactive selector dropdown) */}
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Academic Level")}
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditLevelDropdownOpen(!isEditLevelDropdownOpen);
                              setIsEditSubjectDropdownOpen(false);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 flex items-center justify-between cursor-pointer"
                          >
                            <span className={!editLevelFR ? "text-slate-600" : ""}>
                              {editLevelFR || tr("Select academic levels...")}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isEditLevelDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isEditLevelDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 shadow-xl space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin"
                              >
                                {ACADEMIC_LEVELS.map(lvl => {
                                  const isChecked = editLevelFR.toLowerCase().split(' / ').map(s => s.trim()).includes(lvl.FR.toLowerCase());
                                  return (
                                    <button
                                      key={lvl.value}
                                      type="button"
                                      onClick={() => toggleAcademicLevel(lvl.value, 'edit')}
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
                      {/* Description FR */}
                      <div className="col-span-1 md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Description")}
                        </label>
                        <textarea
                          rows={2}
                          value={editDescFR}
                          onChange={(e) => setEditDescFR(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 resize-none"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Name EN */}
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Name")}
                        </label>
                        <input
                          type="text"
                          value={editNameEN}
                          onChange={(e) => setEditNameEN(e.target.value)}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 ${editNameEN.trim().length < 3 || editNameEN.trim().length > 50 ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800'}`}
                        />
                        {/* Display Name Tip Warning */}
                        <div className="mt-1.5 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-[9px] text-slate-450 leading-relaxed font-medium">
                            {tr("Modifying the display name does not alter the technical component ID ({id}), which remains fixed for system stability. Enter between 3 and 50 characters.").replace("{id}", selectedWidget?.id || '')}
                          </p>
                        </div>
                      </div>
                      {/* Academic Level EN */}
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Academic Level")}
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditLevelDropdownOpen(!isEditLevelDropdownOpen);
                              setIsEditSubjectDropdownOpen(false);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 flex items-center justify-between cursor-pointer"
                          >
                            <span className={!editLevelEN ? "text-slate-600" : ""}>
                              {editLevelEN || "Select academic levels..."}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isEditLevelDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isEditLevelDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 shadow-xl space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin"
                              >
                                {ACADEMIC_LEVELS.map(lvl => {
                                  const isChecked = editLevelEN.toLowerCase().split(' / ').map(s => s.trim()).includes(lvl.EN.toLowerCase());
                                  return (
                                    <button
                                      key={lvl.value}
                                      type="button"
                                      onClick={() => toggleAcademicLevel(lvl.value, 'edit')}
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
                      {/* Description EN */}
                      <div className="col-span-1 md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Description")}
                        </label>
                        <textarea
                          rows={2}
                          value={editDescEN}
                          onChange={(e) => setEditDescEN(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Compact Subjects Selector Dropdown */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">{tr("Target Subject Fields")}</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditSubjectDropdownOpen(!isEditSubjectDropdownOpen);
                          setIsEditLevelDropdownOpen(false);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 flex items-center justify-between cursor-pointer"
                      >
                        <span className={editDisciplines.length === 0 ? "text-slate-600" : ""}>
                          {getDisciplinesSummary(editDisciplines)}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isEditSubjectDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isEditSubjectDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-xl space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800"
                          >
                            <div className="grid grid-cols-2 gap-1.5">
                              {DISCIPLINES_LIST.map((disc) => {
                                const isChecked = editDisciplines.includes(disc);
                                return (
                                  <button
                                    key={disc}
                                    type="button"
                                    onClick={() => toggleDiscipline(disc, 'edit')}
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

                </div> {/* Closes <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}

                {/* PRODUCTION STABILITY WARNING ALERT */}
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 flex items-start gap-3 mt-6">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                      {tr("Production Stability Warning")}
                    </p>
                    <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                      {tr("Modifying a widget's technical interface or parameters risks breaking all courses in production that render this widget. Always ensure strict backwards compatibility by keeping old props optional and supplying default fallback values in the component's code.")}
                    </p>
                  </div>
                </div>
              </div> {/* Closes <div className="flex-grow overflow-y-auto..."> */}

              {/* Edit Modal Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {tr("Cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleSaveParameters}
                  disabled={isSavingMetadata || isEditFormInvalid}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 hover:scale-[1.01] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-teal-500/10 disabled:opacity-40 disabled:scale-100"
                >
                  {isSavingMetadata ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  )}
                  {tr("Save Changes")}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
  );
};
