import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowUpRight, Sparkles, Edit, Layers, FileText, Code } from 'lucide-react';

interface WorkspaceHeaderPanelProps {
  selectedWidget: any;
  adminId: string;
  isSavingMetadata: boolean;
  openEditModal: () => void;
  workshopTab: 'preview' | 'code' | 'props';
  setWorkshopTab: (v: 'preview' | 'code' | 'props') => void;
  getWidgetName: (w: any) => string;
  getWidgetDesc: (w: any) => string;
  getWidgetLevel: (w: any) => string;
  t: any;
  tr: (key: string) => string;
}

export const WorkspaceHeaderPanel: React.FC<WorkspaceHeaderPanelProps> = ({
  selectedWidget,
  adminId,
  isSavingMetadata,
  openEditModal,
  workshopTab,
  setWorkshopTab,
  getWidgetName,
  getWidgetDesc,
  getWidgetLevel,
  t,
  tr
}) => {
  if (!selectedWidget) return null;

  return (
    <>
      {/* CONCURRENCY LOCK HEADER NOTIFICATION BANNER */}
      {selectedWidget.lock && selectedWidget.lock.adminId !== adminId && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-black text-amber-400 uppercase tracking-wider">
                {tr("Widget Currently Locked by Editor: {editor}").replace("{editor}", selectedWidget.lock.adminId)}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {tr("This component is currently being edited. Modifying it simultaneously may cause conflict errors.")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DRAFT NOTIFICATION BANNER */}
      {selectedWidget.hasBackup && (
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  {tr("Pending Unvalidated AI Draft")}
                </span>
                <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                  {tr("Draft Active")}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {tr("An AI revision was generated for this widget. Review the live preview below, then validate to deploy or discard to restore.")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE WIDGET TITLE & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span className="text-teal-400 font-mono">#{selectedWidget.id}</span>
              <span>—</span>
              <span>{getWidgetName(selectedWidget)}</span>
            </h3>
            {selectedWidget.hasBackup && (
              <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                {tr("Draft Active")}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl font-medium">
            {getWidgetDesc(selectedWidget)}
          </p>
          <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold pt-1">
            <span>{tr("Level: {level}").replace("{level}", getWidgetLevel(selectedWidget))}</span>
            <span>•</span>
            <span className="font-mono">{selectedWidget.linesCount} {tr("lines")}</span>
            <span>•</span>
            <span className="font-mono">{(selectedWidget.sizeBytes / 1024).toFixed(1)} KB</span>
          </div>
        </div>

        {/* EDIT PARAMETERS BUTTON */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openEditModal}
            className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-teal-400 hover:text-teal-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:border-teal-500/30"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>{tr("Parameters")}</span>
          </button>
        </div>
      </div>

      {/* TABS HEADER CONTROL */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWorkshopTab('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              workshopTab === 'preview'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{tr("Interactive Sandbox")}</span>
          </button>
          <button
            onClick={() => setWorkshopTab('props')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              workshopTab === 'props'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{tr("Properties & Info")}</span>
          </button>
          <button
            onClick={() => setWorkshopTab('code')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              workshopTab === 'code'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{tr("Source Code")}</span>
          </button>
        </div>
      </div>
    </>
  );
};
