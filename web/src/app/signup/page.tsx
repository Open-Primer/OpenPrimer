"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopNav, Footer } from '@/components/RefinedUI';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-8">
      <div className="fixed inset-0 bg-blue-600/5 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-10">
                <OpenPrimerIcon className="w-16 h-16 mx-auto mb-6" />
                <h1 className="text-3xl font-black tracking-tight mb-2">Join OpenPrimer</h1>
                <p className="text-slate-500 text-sm">Start your journey to universal knowledge.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                    <input placeholder="Silvere Martin" className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                    <input 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com" 
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all" 
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-12">
               <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-8 shadow-2xl shadow-emerald-500/10 border border-emerald-500/20">
                 <Mail className="w-10 h-10" />
               </div>
               <h1 className="text-3xl font-black tracking-tight mb-4 text-white">Check your Inbox</h1>
               <p className="text-slate-500 text-sm leading-relaxed mb-10">
                 We've sent a magic link to <span className="text-slate-200 font-bold">{email}</span>. Click it to verify your account and start learning.
               </p>
               <button onClick={() => setStep(1)} className="text-xs font-black uppercase tracking-widest text-slate-700 hover:text-blue-500 transition-colors">Resend Email</button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-10 text-center text-xs text-slate-600">
          Already have an account? <Link href="/login" className="text-blue-500 font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
      <div className="fixed bottom-0 left-0 right-0 p-8">
        <Footer />
      </div>
    </div>
  );
}
