import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface ShowCaseModalsProps {
  isFullscreenOpen: boolean;
  setIsFullscreenOpen: (v: boolean) => void;
  selectedWidget: any;
  widgetToValidate: string | null;
  setWidgetToValidate: (v: string | null) => void;
  loading: boolean;
  handleValidateWidget: (id: string) => void;
  renderLiveWidget: () => React.ReactNode;
  getWidgetName: (w: any) => string;
  tr: (key: string) => string;
}

export const ShowCaseModals: React.FC<ShowCaseModalsProps> = ({
  isFullscreenOpen,
  setIsFullscreenOpen,
  selectedWidget,
  widgetToValidate,
  setWidgetToValidate,
  loading,
  handleValidateWidget,
  renderLiveWidget,
  getWidgetName,
  tr
}) => {
  return (
    <>
      {/* FULL SCREEN SHOWCASE PREVIEW MODAL */}
      <AnimatePresence>
        {isFullscreenOpen && selectedWidget && (
          <div className="fixed inset-0 bg-slate-950 z-[999] flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 shrink-0">
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase bg-teal-500/10 border border-teal-500/20 text-teal-400 px-2 py-0.5 rounded-md font-mono">
                  {selectedWidget.id} Fullscreen Sandbox
                </span>
                <h3 className="text-md font-black text-white">
                  {getWidgetName(selectedWidget)}
                </h3>
              </div>
              <button 
                onClick={() => setIsFullscreenOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer border border-slate-800"
              >
                <Minimize2 className="w-4 h-4 text-teal-400" />
                {tr("Exit Fullscreen")}
              </button>
            </div>

            {/* Immersive Expanded Canvas */}
            <div className="flex-grow w-full overflow-hidden bg-slate-950/20 rounded-[30px] border border-slate-800/60 p-8 shadow-inner flex flex-col justify-center relative">
              <div className="w-full h-full">
                {renderLiveWidget()}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM VALIDATION MODAL */}
      <AnimatePresence>
        {widgetToValidate && (
          <div 
            onClick={() => setWidgetToValidate(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-[35px] max-w-md w-full p-8 shadow-2xl relative overflow-hidden cursor-default space-y-6 text-center"
            >
              <div className="mx-auto w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center animate-pulse">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  {tr("Confirm Promotion & Validation?")}
                </h4>
                <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                  {tr("Are you sure you want to validate this version? These changes will be applied instantly across the entire site. Once validated, there is no possibility of rollback or undo.")}
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWidgetToValidate(null)}
                  className="px-5 py-2.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {tr("Cancel")}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const id = widgetToValidate;
                    setWidgetToValidate(null);
                    await handleValidateWidget(id);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 hover:scale-[1.01] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-teal-500/10"
                >
                  {tr("Confirm Validation")}
                </button>
              </div>

    </>
  );
};
