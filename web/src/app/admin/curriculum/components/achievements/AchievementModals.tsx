import { EditAchievementModal } from './EditAchievementModal';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Award, Sparkles, Upload, AlertTriangle, Check, Loader2,
  Trash2, ChevronLeft, ChevronRight, Image as ImageIcon
} from 'lucide-react';
import type { Achievement } from '@/lib/db';

interface AchievementModalsProps {
  showAddAchievement: boolean;
  setShowAddAchievement: (v: boolean) => void;
  selectedAchievement: Achievement | null;
  setSelectedAchievement: (v: Achievement | null) => void;
  purgeTarget: Achievement | null;
  setPurgeTarget: (v: Achievement | null) => void;
  badgeError: string | null;
  setBadgeError: (v: string | null) => void;
  newAch: any;
  setNewAch: any;
  badgeIcon: string;
  setBadgeIcon: (v: string) => void;
  badgeStartDate: string;
  setBadgeStartDate: (v: string) => void;
  badgeEndDate: string;
  setBadgeEndDate: (v: string) => void;
  customBadgeImage: string | null;
  setCustomBadgeImage: (v: string | null) => void;
  creationGalleryPage: number;
  setCreationGalleryPage: (v: any) => void;
  isCreationDragging: boolean;
  setIsCreationDragging: (v: boolean) => void;
  isGeneratingBadges: boolean;
  generatedBadges: string[];
  handleGenerateBadges: (name: string, desc: string, isEdit?: boolean) => void;
  handleBadgeFileUpload: (file: File, isEdit?: boolean) => void;
  handleAddAchievement: () => void;
  editName: string;
  setEditName: (v: string) => void;
  editDesc: string;
  setEditDesc: (v: string) => void;
  editThreshold: string;
  setEditThreshold: (v: string) => void;
  editIcon: string;
  setEditIcon: (v: string) => void;
  editStartDate: string;
  setEditStartDate: (v: string) => void;
  editEndDate: string;
  setEditEndDate: (v: string) => void;
  editCustomBadgeImage: string | null;
  setEditCustomBadgeImage: (v: string | null) => void;
  editionGalleryPage: number;
  setEditionGalleryPage: (v: any) => void;
  isEditionDragging: boolean;
  setIsEditionDragging: (v: boolean) => void;
  isEditGeneratingBadges: boolean;
  editGeneratedBadges: string[];
  handleUpdateAchievement: () => void;
  handlePurgeAchievement: (target: Achievement) => void;
  getSuggestedBadges: (name: string, desc: string, achievements: any[], currentImg?: string) => any[];
  achievements: Achievement[];
  t: any;
  LUCIDE_ICONS: Record<string, any>;
}

export const AchievementModals: React.FC<AchievementModalsProps> = ({
  showAddAchievement,
  setShowAddAchievement,
  selectedAchievement,
  setSelectedAchievement,
  purgeTarget,
  setPurgeTarget,
  badgeError,
  setBadgeError,
  newAch,
  setNewAch,
  badgeIcon,
  setBadgeIcon,
  badgeStartDate,
  setBadgeStartDate,
  badgeEndDate,
  setBadgeEndDate,
  customBadgeImage,
  setCustomBadgeImage,
  creationGalleryPage,
  setCreationGalleryPage,
  isCreationDragging,
  setIsCreationDragging,
  isGeneratingBadges,
  generatedBadges,
  handleGenerateBadges,
  handleBadgeFileUpload,
  handleAddAchievement,
  editName,
  setEditName,
  editDesc,
  setEditDesc,
  editThreshold,
  setEditThreshold,
  editIcon,
  setEditIcon,
  editStartDate,
  setEditStartDate,
  editEndDate,
  setEditEndDate,
  editCustomBadgeImage,
  setEditCustomBadgeImage,
  editionGalleryPage,
  setEditionGalleryPage,
  isEditionDragging,
  setIsEditionDragging,
  isEditGeneratingBadges,
  editGeneratedBadges,
  handleUpdateAchievement,
  handlePurgeAchievement,
  getSuggestedBadges,
  achievements,
  t,
  LUCIDE_ICONS
}) => {
  return (
    <>
      <AnimatePresence>
        {showAddAchievement && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowAddAchievement(false); setBadgeError(null); }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden my-8 cursor-default max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Award className="w-6 h-6 text-violet-500" /> {tr("Create Achievement Badge")}
                </h3>
                <button type="button" onClick={() => { setShowAddAchievement(false); setBadgeError(null); }} className="text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleCreateAchievement} className="p-10 space-y-6 overflow-y-auto custom-scrollbar flex-1 pr-4">
                {badgeError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl">
                    {badgeError}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        {tr("Achievement Name")} <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder={tr("Fast Learner")} 
                        value={newAch.name} 
                        onChange={(e) => setNewAch({...newAch, name: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-violet-500/50" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        {tr("Description")} <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder={tr("record time")} 
                        value={newAch.description} 
                        onChange={(e) => setNewAch({...newAch, description: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        {tr("Trigger Parameter")} <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder={tr("3 days")} 
                        value={newAch.threshold} 
                        onChange={(e) => setNewAch({...newAch, threshold: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                          {tr("Start Date (Optional)")}
                        </label>
                        <input 
                          type="date"
                          value={badgeStartDate}
                          onChange={(e) => setBadgeStartDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                          {tr("End Date (Optional)")}
                        </label>
                        <input 
                          type="date"
                          value={badgeEndDate}
                          onChange={(e) => setBadgeEndDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-violet-600/10">
                      {tr("Create Achievement Badge")}
                    </button>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {((newAch.name && newAch.description) || isGeneratingBadges) && (
                      <div className="p-6 bg-violet-955/20 border border-violet-500/20 rounded-3xl space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 flex items-center gap-1.5 font-mono">
                            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                            {tr("AI Generated Badge Designs")}
                          </span>
                          {isGeneratingBadges && (
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest animate-pulse font-mono">
                              {tr("Generating...")}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {generatedBadges.map((url, idx) => {
                            const isSelected = badgeIcon === url;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setBadgeIcon(url)}
                                className={`p-3 bg-slate-950/60 border rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-800 hover:border-slate-800'}`}
                              >
                                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                                  <img src={url} alt={`AI Option ${idx + 1}`} className="w-full h-full object-contain p-1" />
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider font-mono">
                                  {tr("Badge Option")} {idx + 1}
                                </span>
                              </button>
                            );
                          })}
                          {!isGeneratingBadges && generatedBadges.length === 0 && (
                            <div className="col-span-3 text-center py-4 text-[9px] font-black uppercase tracking-widest text-slate-600 font-mono">
                              {tr("Type a Name & Description to trigger generator")}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between ml-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tr("Badge Library Catalog")}</label>
                      {(() => {
                        const usedActiveIcons = achievements.filter(a => a.status === 'active').map(a => a.icon);
                        const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                        const totalPages = Math.ceil((availableLibraryBadges.length + 1) / 9) || 1;
                        return (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={creationGalleryPage === 1}
                              onClick={() => setCreationGalleryPage(p => Math.max(1, p - 1))}
                              className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              {tr("◀ Prev (gallery)")}
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                              {creationGalleryPage} / {totalPages}
                            </span>
                            <button
                              type="button"
                              disabled={creationGalleryPage === totalPages}
                              onClick={() => setCreationGalleryPage(p => Math.min(totalPages, p + 1))}
                              className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              {tr("Next (gallery) →")}
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {(() => {
                      const usedActiveIcons = achievements.filter(a => a.status === 'active').map(a => a.icon);
                      const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                      const totalPages = Math.ceil((availableLibraryBadges.length + 1) / 9) || 1;
                      const curPage = Math.min(creationGalleryPage, totalPages) || 1;
                      
                      let currentPageBadges: StyledBadgeImage[] = [];
                      let showUpload = false;
                      if (curPage === 1) {
                        showUpload = true;
                        currentPageBadges = availableLibraryBadges.slice(0, 8);
                      } else {
                        showUpload = false;
                        const startIndex = (curPage - 1) * 9 - 1;
                        currentPageBadges = availableLibraryBadges.slice(startIndex, startIndex + 9);
                      }

                      return (
                        <div className="grid grid-cols-3 gap-4">
                          {showUpload && (
                            <div className={`p-4 border border-dashed rounded-3xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 group relative overflow-hidden cursor-pointer ${isCreationDragging ? 'border-violet-500 shadow-lg shadow-violet-500/20 bg-slate-900 scale-105' : 'bg-slate-950/60 border-violet-500/40 hover:border-violet-500'}`}>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleImageFile(e.target.files[0], false);
                                  }
                                }}
                                onDragEnter={() => setIsCreationDragging(true)}
                                onDragOver={(e) => { e.preventDefault(); setIsCreationDragging(true); }}
                                onDragLeave={() => setIsCreationDragging(false)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <div className="w-10 h-10 rounded-full bg-violet-650/10 text-violet-400 flex items-center justify-center shadow-md group-hover:bg-violet-600 group-hover:text-white transition-all">
                                <Upload className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] font-black text-violet-400 tracking-wider uppercase group-hover:text-white transition-colors">
                                {isCreationDragging ? tr("Drop here!") : tr("Upload / Drag & Drop")}
                              </span>
                            </div>
                          )}

                          {currentPageBadges.map((img) => {
                            const IconComp = LUCIDE_ICONS[img.iconName] || Award;
                            const isSelected = badgeIcon === img.id || badgeIcon === resolveBadgeIconToBase64Sync(img.id);
                            return (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => setBadgeIcon(img.id)}
                                className={`p-4 bg-slate-950/60 border rounded-3xl flex flex-col items-center gap-3 transition-all hover:scale-105 library-badge-btn ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-800 hover:border-slate-800'}`}
                              >
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${img.gradient} text-white flex items-center justify-center shadow-md`}>
                                  <IconComp className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase truncate max-w-[80px] text-center">
                                  {tr(img.iconName.toUpperCase())}
                                </span>
                                <span className="text-[8px] font-semibold text-slate-500 truncate max-w-[80px] text-center">
                                  {tr(img.colorName)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ACHIEVEMENT EDIT MODAL */}
      <EditAchievementModal
        selectedAchievement={selectedAchievement}
        setSelectedAchievement={setSelectedAchievement}
        badgeError={badgeError}
        setBadgeError={setBadgeError}
        editName={editName}
        setEditName={setEditName}
        editDesc={editDesc}
        setEditDesc={setEditDesc}
        editThreshold={editThreshold}
        setEditThreshold={setEditThreshold}
        editIcon={editIcon}
        setEditIcon={setEditIcon}
        editStartDate={editStartDate}
        setEditStartDate={setEditStartDate}
        editEndDate={editEndDate}
        setEditEndDate={setEditEndDate}
        editCustomBadgeImage={editCustomBadgeImage}
        setEditCustomBadgeImage={setEditCustomBadgeImage}
        editionGalleryPage={editionGalleryPage}
        setEditionGalleryPage={setEditionGalleryPage}
        isEditionDragging={isEditionDragging}
        setIsEditionDragging={setIsEditionDragging}
        isEditGeneratingBadges={isEditGeneratingBadges}
        editGeneratedBadges={editGeneratedBadges}
        handleGenerateBadges={handleGenerateBadges}
        handleBadgeFileUpload={handleBadgeFileUpload}
        handleUpdateAchievement={handleUpdateAchievement}
        setPurgeTarget={setPurgeTarget}
        getSuggestedBadges={getSuggestedBadges}
        achievements={achievements}
        t={t}
        LUCIDE_ICONS={LUCIDE_ICONS}
      />
        {purgeTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPurgeTarget(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-800 bg-red-955/20 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">
                  {pStrings.purge_badge_title}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed text-center">
                  {pStrings.purge_badge_desc.replace("{title}", purgeTarget.name)}
                </p>
                
                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => setPurgeTarget(null)}
                    className="flex-1 py-4 border border-slate-800 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900"
                  >
                    {pStrings.purge_badge_cancel_btn}
                  </button>
                  <button 
                    type="button"
                    onClick={handlePurgeExecute}
                    className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl transition-all bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/10"
                  >
                    {pStrings.purge_badge_confirm_btn}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

    </>
  );
};
