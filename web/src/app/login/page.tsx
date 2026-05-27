"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/RefinedUI';

// Keys to purge from localStorage on each successful login to prevent stale mock data
const STALE_CACHE_KEYS = [
  'openprimer_users',
  'openprimer_courses',
  'openprimer_completions',
  'openprimer_search_history',
  'openprimer_course_feedbacks',
  'openprimer_contact_feedbacks',
  'openprimer_reports',
  'openprimer_translation_requests',
  'openprimer_refused_courses',
  'openprimer_refused_translations',
  'openprimer_refused_revisions',
  'openprimer_pipeline_queue',
];

function purgeStaleLocalCache() {
  if (typeof window === 'undefined') return;
  STALE_CACHE_KEYS.forEach(key => localStorage.removeItem(key));
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [authMode, setAuthMode] = useState<'live' | 'demo' | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    // ── STEP 1: Attempt live Supabase authentication ──────────────────────────
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error && data?.user) {
        // SUCCESS: purge all stale localStorage mock data
        purgeStaleLocalCache();

        // Store minimal session marker with real email
        localStorage.setItem('op_session', 'true');
        localStorage.setItem('op_user_profile', JSON.stringify({
          email: data.user.email,
          id: data.user.id,
          firstName: data.user.user_metadata?.name?.split(' ')[0] || '',
          lastName: data.user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
          preferredLang: 'EN',
          isVerified: true,
          isLiveAuth: true
        }));

        setAuthMode('live');
        setSuccess(true);

        setTimeout(() => {
          // Redirect admin users to admin panel, others to catalog
          const adminEmails = ['vanguard.mysterious@gmail.com'];
          const dest = adminEmails.includes((data.user.email || '').toLowerCase()) ? '/admin' : '/catalog';
          router.push(dest);
        }, 1000);
        return;
      }
    } catch (supabaseErr) {
      console.warn('[Auth] Supabase unavailable, trying demo fallback:', supabaseErr);
    }

    // ── STEP 2: Demo/offline fallback (graceful degradation) ─────────────────
    const DEMO_ACCOUNTS: Record<string, { name: string; role: string }> = {
      'vanguard.mysterious@gmail.com': { name: 'Vanguard Admin', role: 'admin' },
      'student1@openprimer.org':       { name: 'Student One',    role: 'student' },
      'student2@openprimer.org':       { name: 'Student Two',    role: 'student' },
      'student3@openprimer.org':       { name: 'Student Three',  role: 'student' },
    };

    const demoAccount = DEMO_ACCOUNTS[email.toLowerCase()];
    if (demoAccount) {
      purgeStaleLocalCache();
      localStorage.setItem('op_session', 'true');
      localStorage.setItem('op_user_profile', JSON.stringify({
        email,
        firstName: demoAccount.name.split(' ')[0],
        lastName: demoAccount.name.split(' ').slice(1).join(' '),
        role: demoAccount.role,
        preferredLang: 'EN',
        isVerified: true,
        isLiveAuth: false
      }));

      setAuthMode('demo');
      setSuccess(true);

      setTimeout(() => {
        router.push(demoAccount.role === 'admin' ? '/admin' : '/catalog');
      }, 1200);
      setIsLoading(false);
      return;
    }

    setErrorMsg('Identifiants incorrects. Vérifiez votre email et mot de passe.');
    setIsLoading(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`
      });
      alert(`Un lien de réinitialisation a été envoyé à : ${email}`);
    } catch {
      alert(`Lien de réinitialisation simulé envoyé à : ${email}`);
    }
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
                    {authMode === 'live' ? <ShieldCheck className="w-4 h-4 shrink-0" /> : <Sparkles className="w-4 h-4 shrink-0" />}
                    <span>
                      {authMode === 'live'
                        ? 'Authentification sécurisée réussie ! Redirection...'
                        : 'Connexion démo réussie. Redirection...'
                      }
                    </span>
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
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 group"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Vérification...
                      </span>
                    ) : (
                      <>Se Connecter <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-800/80" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-[9px]">
                    <span className="bg-slate-950 px-4 text-slate-600">Ou continuer avec</span>
                  </div>
                </div>

                <button 
                  onClick={async () => {
                    try {
                      const { supabase } = await import('@/lib/supabase');
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: { redirectTo: `${window.location.origin}/auth/callback` },
                      });
                      if (error) throw error;
                    } catch (err) {
                      console.warn('[Auth] Google OAuth failed:', err);
                      setErrorMsg('Connexion Google indisponible. Utilisez votre email et mot de passe.');
                    }
                  }}
                  className="w-full py-4 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-200 hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 hover:bg-slate-900/60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

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


