import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen skeleton-bg-page flex flex-col items-center justify-center relative select-none">
      {/* Top glowing loading line */}
      <div 
        className="fixed top-0 left-0 right-0 h-[3px] z-50 overflow-hidden"
        style={{ background: 'var(--skeleton-bg, rgba(0, 0, 0, 0.05))' }}
      >
        <div 
          className="h-full rounded-r"
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6, #3b82f6)',
            backgroundSize: '200% 100%',
            animation: 'top-bar-shimmer 2s infinite linear',
            transformOrigin: 'left'
          }}
        />
      </div>

      {/* Styled inline keyframes to avoid any external CSS dependency */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes top-bar-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes spin-loader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />

      {/* Centered Premium Brand Loader */}
      <div className="flex flex-col items-center gap-6" style={{ animation: 'subtle-pulse 2s infinite ease-in-out' }}>
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer glowing pulsing circle */}
          <div 
            className="absolute inset-0 rounded-full border border-blue-500/20"
            style={{
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)',
            }}
          />
          {/* Animated Spinner Track */}
          <div 
            className="absolute inset-0 rounded-full border-[2px] border-transparent"
            style={{
              borderTopColor: '#3b82f6',
              borderRightColor: '#6366f1',
              animation: 'spin-loader 1s infinite linear'
            }}
          />
          {/* Inner Brand Mark / Dot */}
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
        </div>
        
        {/* Subtle Text */}
        <div className="flex flex-col items-center gap-1.5">
          <span 
            className="text-[10px] font-black uppercase tracking-[0.25em] opacity-80"
            style={{
              background: 'linear-gradient(135deg, var(--foreground), #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            OpenPrimer
          </span>
          <span className="text-[10px] font-medium tracking-wider text-slate-455 dark:text-slate-500">
            Préparation du cours...
          </span>
        </div>
      </div>
    </div>
  );
}
