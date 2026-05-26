"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { Mail, Lock, ArrowRight, Globe, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/RefinedUI';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    // Check local storage for simulated account
    const storedProfileStr = localStorage.getItem('op_user_profile');
    let profile = null;
    
    if (storedProfileStr) {
      const storedProfile = JSON.parse(storedProfileStr);
      if (storedProfile.email.toLowerCase() === email.toLowerCase()) {
        profile = storedProfile;
      }
    }

    // If no profile exists, automatically instantiate a premium test profile for seamless testing!
    if (!profile) {
      profile = {
        firstName: 'Silvere',
        lastName: 'Martin',
        email: email,
        preferredLang: 'EN',
        selectedCourses: [1, 2],
        isVerified: true
      };
      localStorage.setItem('op_user_profile', JSON.stringify(profile));
    }

    localStorage.setItem('op_session', 'true');
    setSuccess(true);
    setErrorMsg('');

    setTimeout(() => {
      router.push('/catalog');
    }, 1000);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Un lien de réinitialisation simulé a été envoyé à : ${email || 'votre email'}`);
    setShowForgot(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden relative">
      <div className="fixed inset-0 bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center py-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 rounded-[48px] p-10 backdrop-blur-3xl shadow-2xl relative"
        >
          <AnimatePresence mode="wait">
            {!showForgot ? (
              <motion.div 
                key="login-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <OpenPrimerIcon className="w-14 h-14 mx-auto mb-4" />
                  <h1 className="text-3xl md:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">
                    SE CONNECTER
                  </h1>
                  <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-black">
                    Accéder au dépôt OpenPrimer
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-semibold">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Connexion réussie ! Redirection en cours...</span>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">Adresse Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jean.dupont@email.com" 
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-3">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mot de Passe</label>
                      <button 
                        type="button" 
                        onClick={() => setShowForgot(true)}
                        className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest"
                      >
                        Oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                      <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••" 
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 group"
                  >
                    Se Connecter <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="forgot-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <Lock className="w-14 h-14 mx-auto mb-4 text-blue-500" />
                  <h1 className="text-3xl font-black tracking-tight text-white">RÉCUPÉRATION</h1>
                  <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-black">
                    Mot de passe oublié
                  </p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">Votre Adresse Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jean.dupont@email.com" 
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20"
                  >
                    Envoyer le lien de réinitialisation
                  </button>

                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => setShowForgot(false)}
                      className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                    >
                      Retourner à la connexion
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-xs text-slate-600">
            Nouveau sur OpenPrimer ? <Link href="/signup" className="text-blue-500 font-bold hover:underline">Créer un compte</Link>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
