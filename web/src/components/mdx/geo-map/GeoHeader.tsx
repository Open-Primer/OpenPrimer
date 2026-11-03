import React from 'react';
import { Globe, Map, Award, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface HeaderProps {
  t: any;
  mode: 'explore' | 'quiz';
  setMode: (m: 'explore' | 'quiz') => void;
  selectedLayer: 'political' | 'physical' | 'demographic' | 'economic';
  setSelectedLayer: (l: 'political' | 'physical' | 'demographic' | 'economic') => void;
  handleZoom: (d: 'in' | 'out') => void;
  handleReset: () => void;
  handlePan: (d: 'up' | 'down' | 'left' | 'right') => void;
}

export const GeoHeader: React.FC<HeaderProps> = ({
  t,
  mode,
  setMode,
  selectedLayer,
  setSelectedLayer,
  handleZoom,
  handleReset,
  handlePan
}) => {
  return (
    <>
      {/* Premium Glassmorphic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-white leading-none">
              {t.title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-xl font-medium leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
          <button
            onClick={() => { setMode('explore'); setQuizStarted(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'explore'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t.exploreMode}</span>
          </button>
          <button
            onClick={handleStartQuiz}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'quiz'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>{t.quizMode}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left GIS Screen Panel (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Layer Selector Header */}
          <div className="flex flex-wrap justify-between items-center gap-2 bg-slate-900/40 p-2 rounded-2xl border border-slate-900/60">
            <span className="text-[10px] font-black uppercase text-slate-400 pl-2">
              {t.layers.title} :
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'political', icon: <Globe className="w-3.5 h-3.5" />, label: t.layers.political },
                { id: 'physical', icon: <Map className="w-3.5 h-3.5" />, label: t.layers.physical },
                { id: 'demographic', icon: <Users className="w-3.5 h-3.5" />, label: t.layers.demographic },
                { id: 'economic', icon: <TrendingUp className="w-3.5 h-3.5" />, label: t.layers.economic }
              ].map((layer) => (
                <button
                  key={layer.id}
                  disabled={mode === 'quiz' && quizStarted}
                  onClick={() => setSelectedLayer(layer.id as any)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.25 text-[10px] font-black rounded-lg border transition-all ${
                    selectedLayer === layer.id
                      ? 'bg-slate-800 text-white border-slate-700 shadow-sm'
                      : 'text-slate-500 border-transparent hover:text-slate-350 disabled:opacity-40'
                  }`}
                >
                  {layer.icon}
                  <span>{layer.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Map Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 relative overflow-hidden flex flex-col items-center justify-center">
            
            {/* Compass / Navigation Floating UI */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              <button
                onClick={() => handleZoom('in')}
                className="p-1.5 bg-slate-900/90 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                title={t.controls.zoomIn}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="p-1.5 bg-slate-900/90 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                title={t.controls.zoomOut}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 bg-slate-900/90 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all shadow-sm mt-1"
                title={t.controls.reset}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* D-Pad Floating Controls */}
            <div className="absolute top-3 right-3 grid grid-cols-3 gap-0.5 z-10 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-sm">
              <div />
              <button 
                onClick={() => handlePan('up')} 
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title={t.controls.panUp}
              >
                ▲
              </button>
              <div />
              <button 
                onClick={() => handlePan('left')} 
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title={t.controls.panLeft}
              >
                ◀
              </button>
              <div />
              <button 
                onClick={() => handlePan('right')} 
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title={t.controls.panRight}
              >
                ▶
              </button>
              <div />
              <button 
                onClick={() => handlePan('down')} 
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title={t.controls.panDown}
              >
                ▼
              </button>
            </div>

            {/* Map Canvas Frame */}
            <div className="w-full relative" style={{ touchAction: "none" }}>

    </>
  );
};
