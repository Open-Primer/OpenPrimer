"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-8">
      <div className="fixed inset-0 bg-blue-600/5 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <OpenPrimerIcon className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Sign in to resume your academic journey.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <input placeholder="name@email.com" className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <input type="password" placeholder="••••••••" className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all" />
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 group">
            Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-900"></div></div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-slate-700"><span className="bg-slate-950 px-4">Or continue with</span></div>
          </div>

          <button className="w-full py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-800 flex items-center justify-center gap-3">
            <Github className="w-4 h-4" /> GitHub
          </button>
        </div>

        <p className="mt-10 text-center text-xs text-slate-600">
          Don't have an account? <Link href="/signup" className="text-blue-500 font-bold hover:underline">Create one for free</Link>
        </p>
      </motion.div>
    </div>
  );
}
