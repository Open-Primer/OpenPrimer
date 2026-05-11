"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { OpenPrimerIcon } from './OpenPrimerIcon';

const BETA_CODE = "OP-BETA-2026";

export const Gatekeeper = ({ children }: { children: React.ReactNode }) => {
  const [code, setCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Bypassing for industrialization audit
    setIsAuthorized(true);
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.toUpperCase() === BETA_CODE) {
      localStorage.setItem("op_beta_access", "true");
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-slate-950" />;

  if (isAuthorized) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 selection:bg-blue-500/30">
      <div className="fixed inset-0 bg-blue-600/5 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <OpenPrimerIcon className="w-16 h-16 mx-auto mb-8" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <ShieldCheck className="w-3 h-3" /> Private Beta Access
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Entrance Secured</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            OpenPrimer is currently in invite-only industrialization phase. Please enter your access code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className={`absolute inset-0 bg-blue-600/20 blur-xl transition-opacity duration-500 ${error ? 'bg-red-600/40 opacity-100' : 'opacity-0 group-focus-within:opacity-100'}`} />
            <div className={`relative flex items-center bg-slate-900/80 border ${error ? 'border-red-500/50' : 'border-slate-800'} rounded-3xl p-2 backdrop-blur-xl focus-within:border-blue-500/50 transition-all shadow-2xl`}>
              <div className="pl-6 pr-4">
                <Lock className={`w-5 h-5 ${error ? 'text-red-500' : 'text-slate-700'}`} />
              </div>
              <input 
                autoFocus
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Beta Code..."
                className="flex-1 bg-transparent border-none py-4 text-white focus:outline-none placeholder:text-slate-700 font-bold tracking-widest"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-3 h-3" /> Invalid Access Code
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-20 text-center">
           <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.3em]">
             System industrialization in progress • v18.0
           </p>
        </div>
      </motion.div>
    </div>
  );
};
