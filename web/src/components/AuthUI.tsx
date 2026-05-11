"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Github, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthPage({ mode = 'login' }: { mode?: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 overflow-hidden relative text-white">
      {/* Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-[40px] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join the Future'}
            </h1>
            <p className="text-slate-500 text-sm">
              {mode === 'login' ? 'Continue your universal learning journey.' : 'Access the world\'s knowledge for free.'}
            </p>
          </div>

          <form className="space-y-6">
            {mode === 'signup' && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" placeholder="Full Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 group">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm mb-4">Or continue with</p>
            <button className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-white py-3 rounded-2xl flex items-center justify-center gap-3 transition-all">
              <Github className="w-5 h-5" /> GitHub
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href={mode === 'login' ? '/auth/signup' : '/auth/login'}
              className="text-sm font-bold text-slate-500 hover:text-blue-400 transition-colors"
            >
              {mode === 'login' ? 'Don\'t have an account? Sign up' : 'Already have an account? Sign in'}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
