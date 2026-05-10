import React from 'react';

export const OpenPrimerIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`relative ${className} group`}>
    {/* Outer Glow */}
    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-400/30 transition-all duration-500" />
    
    {/* Icon Shape */}
    <div className="relative w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center border border-white/20">
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className="w-2/3 h-2/3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
      
      {/* Shine effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-2xl mask-gradient-to-b" />
    </div>
  </div>
);
