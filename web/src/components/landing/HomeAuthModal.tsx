"use client";

import React from 'react';
import { ArrowRight, CheckCircle2, Mail, Lock, User, AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { PasswordRequirements } from '@/components/PasswordRequirements';
import { getLocalString } from './landingStrings';

export interface HomeAuthModalProps {
  authModal: 'signup' | 'login' | 'verify' | 'forgot' | null;
  setAuthModal: (m: 'signup' | 'login' | 'verify' | 'forgot' | null) => void;
  handleCloseAuthModal: () => void;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  isPasswordFocused: boolean;
  setIsPasswordFocused: (v: boolean) => void;
  justVerified: boolean;
  errorMsg: string;
  setErrorMsg: (v: string) => void;
  successMsg: string;
  setSuccessMsg: (v: string) => void;
  handleSignupSubmit: (e: React.FormEvent) => void;
  handleLoginSubmit: (e: React.FormEvent) => void;
  handleGoogleSignIn: () => void;
  handleSimulateValidation: () => void;
  handleForgotPasswordSubmit: (e: React.FormEvent) => void;
  lang: string;
  s: any;
  a: any;
}

export const HomeAuthModal = ({
  authModal,
  setAuthModal,
  handleCloseAuthModal,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isPasswordFocused,
  setIsPasswordFocused,
  justVerified,
  errorMsg,
  setErrorMsg,
  successMsg,
  setSuccessMsg,
  handleSignupSubmit,
  handleLoginSubmit,
  handleGoogleSignIn,
  handleSimulateValidation,
  handleForgotPasswordSubmit,
  lang,
  s,
  a
}: HomeAuthModalProps) => (
  <AnimatePresence>
    {authModal && (
      <div 
        onClick={handleCloseAuthModal}
        className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xl cursor-pointer"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-[48px] p-8 md:p-10 backdrop-blur-3xl shadow-2xl relative cursor-default text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={handleCloseAuthModal} 
            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-pulse"
          >
            <X className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            {authModal === 'signup' && (
              <motion.div 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <OpenPrimerIcon className="w-12 h-12 mx-auto mb-3" />
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                    {a.create_account}
                  </h2>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mt-1">
                    {a.begin_journey}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-semibold flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                        {a.first_name} <span className="text-[6px] text-slate-600 lowercase">{getLocalString('optional_parentheses', lang)}</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                          value={firstName}
                          onChange={(e) => { setFirstName(e.target.value.slice(0, 60)); if (errorMsg) setErrorMsg(''); }}
                          maxLength={60}
                          placeholder={a.first_name_placeholder}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-500" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                        {a.last_name} <span className="text-[6px] text-slate-600 lowercase">{getLocalString('optional_parentheses', lang)}</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                          value={lastName}
                          onChange={(e) => { setLastName(e.target.value.slice(0, 60)); if (errorMsg) setErrorMsg(''); }}
                          maxLength={60}
                          placeholder={a.last_name_placeholder}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-500" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                      {a.email_address}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="email"
                        required
                        id="signup-email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value.slice(0, 60)); if (errorMsg) setErrorMsg(''); }}
                        maxLength={60}
                        placeholder={s.email_placeholder || "john.doe@email.com"}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-500" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                      {a.password}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        id="signup-password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value.slice(0, 60)); if (errorMsg) setErrorMsg(''); }}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        maxLength={60}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-500" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <PasswordRequirements 
                      password={password}
                      lang={lang}
                      isFocused={isPasswordFocused}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                      {a.confirm_password}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        id="signup-confirm-password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value.slice(0, 60)); if (errorMsg) setErrorMsg(''); }}
                        maxLength={60}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-500" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 focus:outline-none cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {a.validate_reg} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-slate-800/80"></div>
                  <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
                    {a.or || 'OR'}
                  </span>
                  <div className="flex-grow border-t border-slate-800/80"></div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-800 text-white font-black text-[9px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.13-1.14 2.19l3.07 2.38c1.8-1.66 2.83-4.1 2.83-6.42z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.07-2.38c-.9.6-2.05.96-3.26.96-2.5 0-4.61-1.69-5.36-3.97L5.13 18.06C7.15 21.6 10.83 24 12 24z"/>
                    <path fill="#FBBC05" d="M6.64 15.7c-.2-.6-.31-1.23-.31-1.9s.11-1.3.31-1.9L3.5 9.56C2.69 11.19 2.23 13.01 2.23 15s.46 3.81 1.27 5.44l3.14-2.74z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.83 0 4.15 2.4 2.23 5.94l3.14 2.74c.75-2.28 2.86-3.93 5.36-3.93z"/>
                  </svg>
                  <span>{a.sign_in_google}</span>
                </button>

                <p className="mt-6 text-center text-xs text-slate-600">
                  {a.already_registered} <button onClick={() => { setErrorMsg(''); setAuthModal('login'); }} className="text-blue-500 font-bold hover:underline cursor-pointer">{a.login}</button>
                </p>
              </motion.div>
            )}

            {authModal === 'login' && (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <OpenPrimerIcon className="w-12 h-12 mx-auto mb-3" />
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                    {a.login}
                  </h2>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mt-1">
                    {a.access_repo}
                  </p>
                </div>

                {justVerified && (
                  <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-semibold flex items-start gap-3 shadow-lg shadow-emerald-500/5">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-white uppercase text-[8px] tracking-wider">
                        {a.verified_success}
                      </p>
                      <p className="text-slate-400 leading-normal text-[10px] font-medium">
                        {a.verified_desc}
                      </p>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-semibold flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                      {a.email_address}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="email"
                        required
                        id="login-email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (errorMsg) setErrorMsg(''); }}
                        placeholder="name@email.com"
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3.5 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-500" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                      {a.password}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        id="login-password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); if (errorMsg) setErrorMsg(''); }}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3.5 pl-10 pr-10 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-500" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="flex justify-end px-1 pt-1">
                      <button
                        type="button"
                        onClick={() => { setErrorMsg(''); setSuccessMsg(''); setAuthModal('forgot'); }}
                        className="text-[10px] font-semibold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer focus:outline-none"
                      >
                        {s.forgot_password}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                  >
                    {a.login}
                  </button>
                </form>

                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-slate-800/80"></div>
                  <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
                    {a.or || 'OR'}
                  </span>
                  <div className="flex-grow border-t border-slate-800/80"></div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-800 text-white font-black text-[9px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.13-1.14 2.19l3.07 2.38c1.8-1.66 2.83-4.1 2.83-6.42z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.07-2.38c-.9.6-2.05.96-3.26.96-2.5 0-4.61-1.69-5.36-3.97L5.13 18.06C7.15 21.6 10.83 24 12 24z"/>
                    <path fill="#FBBC05" d="M6.64 15.7c-.2-.6-.31-1.23-.31-1.9s.11-1.3.31-1.9L3.5 9.56C2.69 11.19 2.23 13.01 2.23 15s.46 3.81 1.27 5.44l3.14-2.74z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.83 0 4.15 2.4 2.23 5.94l3.14 2.74c.75-2.28 2.86-3.93 5.36-3.93z"/>
                  </svg>
                  <span>{a.sign_in_google}</span>
                </button>

                <p className="mt-6 text-center text-xs text-slate-600">
                  {a.new_to_op} <button onClick={() => { setErrorMsg(''); setAuthModal('signup'); }} className="text-blue-500 font-bold hover:underline cursor-pointer">{a.create_an_account}</button>
                </p>
              </motion.div>
            )}

            {authModal === 'verify' && (
              <motion.div 
                key="verify"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto mb-4 border border-blue-500/20">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {a.verify_email}
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-2 mb-6">
                  {a.verify_sent} <span className="text-slate-300 font-bold">{email}</span>. {a.verify_confirm}
                </p>

                {process.env.NODE_ENV !== 'production' && (
                  <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 text-left mb-6 text-xs text-slate-400">
                    <div className="text-[8px] font-black uppercase tracking-wider text-amber-500 mb-1">
                      [DEV MODE] Local Verification Fallback
                    </div>
                    <p className="mb-2 text-[10px]">
                      Resend is not configured locally. Click below to verify instantly in your browser:
                    </p>
                    <button 
                      onClick={handleSimulateValidation}
                      className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-[9px] uppercase tracking-widest cursor-pointer"
                    >
                      Verify Instantly (Dev Only)
                    </button>
                  </div>
                )}

                <button onClick={() => setAuthModal('signup')} className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest cursor-pointer">
                  {a.back}
                </button>
              </motion.div>
            )}

            {authModal === 'forgot' && (
              <motion.div 
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto mb-4 border border-blue-500/20">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                    {s.forgot_password}
                  </h2>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mt-2 leading-relaxed">
                    {s.enter_email}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-semibold flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-semibold flex items-start gap-3 shadow-lg shadow-emerald-500/5">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-white uppercase text-[8px] tracking-wider">
                        {getLocalString('email_sent_title', lang)}
                      </p>
                      <p className="text-slate-400 leading-normal text-[10px] font-medium">
                        {successMsg}
                      </p>
                    </div>
                  </div>
                )}

                {!successMsg ? (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                        {a.email_address}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                          type="email"
                          required
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); if (errorMsg) setErrorMsg(''); }}
                          placeholder="name@email.com"
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3.5 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-500" 
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                    >
                      {s.send_reset_link}
                    </button>
                  </form>
                ) : null}

                <div className="text-center mt-6">
                  <button 
                    onClick={() => { setErrorMsg(''); setSuccessMsg(''); setAuthModal('login'); }}
                    className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest cursor-pointer"
                  >
                    {s.back_to_login}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
