"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { OpenPrimerIcon } from './OpenPrimerIcon';

const BETA_CODE = "OP-BETA-2026";

export const Gatekeeper = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check auth on mount
    const auth = localStorage.getItem("op_beta_authorized");
    setIsAuthorized(auth === "true");
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "OP-BETA-2026") {
      localStorage.setItem("op_beta_authorized", "true");
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  // Prevent flash of content during hydration
  if (isAuthorized === null) return <div className="min-h-screen bg-slate-950" />;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 font-sans overflow-hidden">
        <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md p-10 rounded-[48px] bg-slate-900/50 border border-slate-800 backdrop-blur-3xl text-center"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-3xl mx-auto mb-8 flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Beta Access <span className="text-blue-500 italic">Locked</span></h1>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">Please enter your institutional access code to enter the OpenPrimer repository.</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <input 
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••••••••••"
              className={`w-full bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-4 px-6 text-center text-xl font-black tracking-[0.3em] text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800`}
            />
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20 transition-all active:scale-95">
              Authorize Access
            </button>
          </form>
          
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-center text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-3 h-3" /> Invalid Access Code
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-20 text-center">
             <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.3em]">
               System industrialization in progress • v18.0
             </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
