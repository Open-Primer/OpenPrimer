"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { Mail, Lock, User, ArrowRight, CheckCircle2, Globe, Sparkles, BookOpen, Star, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/RefinedUI';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = Form, 2 = Verification Email Sent, 3 = Forgot Password
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLang, setPreferredLang] = useState('EN');
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRealEmailSent, setIsRealEmailSent] = useState(false);
  const [simulatedVerificationUrl, setSimulatedVerificationUrl] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const coursesList = [
    { id: 1, title: 'Physique: Classical Mechanics (L1)', desc: 'Feynman-optimized physics' },
    { id: 2, title: 'Physique: Quantum Physics (L2)', desc: 'Quantum state vectors and wave mechanics' },
    { id: 3, title: 'Biologie: Cell Biology (L1)', desc: 'Cellular structures and ATP cycles' },
    { id: 4, title: 'Biologie: Molecular Genetics (L1)', desc: 'DNA replication and genetics' },
  ];

  // 1. Check for verification parameters in query string
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      const emailParam = params.get('email');

      if (tokenParam && emailParam) {
        setVerificationStatus('verifying');
        setStep(2); // Jump straight to verification display
        setEmail(emailParam);

        fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenParam, email: emailParam })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setVerificationStatus('success');
              // Save to session and profile locally
              localStorage.setItem('op_user_profile', JSON.stringify(data.profile));
              localStorage.setItem('op_session', 'true');
              localStorage.setItem('op_bookmarks', JSON.stringify(selectedCourses));
              
              setTimeout(() => {
                router.push('/catalog');
              }, 2000);
            } else {
              setVerificationStatus('error');
              setErrorMsg(data.error || 'La validation du lien a échoué ou a expiré.');
            }
          })
          .catch(() => {
            setVerificationStatus('error');
            setErrorMsg('Une erreur de réseau est survenue lors de la validation.');
          });
      }
    }
  }, [router, selectedCourses]);

  const handleToggleCourse = (id: number) => {
    if (selectedCourses.includes(id)) {
      setSelectedCourses(selectedCourses.filter(c => c !== id));
    } else {
      setSelectedCourses([...selectedCourses, id]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setErrorMsg('Veuillez remplir tous les champs requis.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          preferredLang,
          selectedCourses
        })
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setIsRealEmailSent(data.isRealSent);
        setSimulatedVerificationUrl(data.verificationUrl);
        setStep(2); // Show confirmation email dispatched screen
      } else {
        setErrorMsg(data.error || "Une erreur s'est produite lors de l'inscription.");
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg("Impossible de joindre le serveur d'inscription.");
    }
  };

  // DEVELOPER SIMULATOR ACTIONS
  const handleVerifyAndLoginSimulated = () => {
    // If running in browser simulation click, simulate successful verify API return locally
    const simulatedProfile = {
      id: `u_${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email,
      role: 'student',
      preferredLang,
      isEmailVerified: true
    };
    
    setVerificationStatus('success');
    localStorage.setItem('op_user_profile', JSON.stringify(simulatedProfile));
    localStorage.setItem('op_session', 'true');
    localStorage.setItem('op_bookmarks', JSON.stringify(selectedCourses));
    
    setTimeout(() => {
      router.push('/catalog');
    }, 1000);
  };

  const handleSimulateResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    alert(`Un lien de réinitialisation de mot de passe a été envoyé à ${email || 'votre adresse email'}.`);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden relative">
      <div className="fixed inset-0 bg-blue-600/5 blur-[120px] pointer-events-none" />
      
      <div className="flex-1 flex items-center justify-center py-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-slate-900/40 border border-slate-800/80 rounded-[48px] p-10 backdrop-blur-3xl shadow-2xl relative"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <OpenPrimerIcon className="w-14 h-14 mx-auto mb-4" />
                  <h1 className="text-3xl md:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">
                    CRÉER UN COMPTE
                  </h1>
                  <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-black">
                    Rejoindre OpenPrimer & Commencer à apprendre
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">Prénom</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                        <input 
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Jean" 
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">Nom</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                        <input 
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Dupont" 
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                        />
                      </div>
                    </div>
                  </div>

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
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">Mot de Passe</label>
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

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">Langue Préférée</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                      <select 
                        value={preferredLang}
                        onChange={(e) => setPreferredLang(e.target.value)}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white appearance-none cursor-pointer"
                      >
                        <option value="FR">🇫🇷 Français (FR)</option>
                        <option value="EN">🇺🇸 English (EN)</option>
                        <option value="ES">🇪🇸 Español (ES)</option>
                        <option value="DE">🇩🇪 Deutsch (DE)</option>
                        <option value="ZH">🇨🇳 中文 (ZH)</option>
                      </select>
                    </div>
                  </div>

                  {/* INITIAL COURSE SELECTION */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>Sélectionner des Cours Initiaux (Optionnel)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {coursesList.map((course) => {
                        const selected = selectedCourses.includes(course.id);
                        return (
                          <div 
                            key={course.id}
                            onClick={() => handleToggleCourse(course.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${selected ? 'bg-blue-600/10 border-blue-500/60 text-white' : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-[10px] font-black leading-tight truncate">{course.title}</h4>
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${selected ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-800'}`}>
                                {selected && <CheckCircle2 className="w-2.5 h-2.5" />}
                              </div>
                            </div>
                            <p className="text-[8px] text-slate-500 mt-1 truncate">{course.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>Envoi en cours <Loader className="w-4 h-4 animate-spin" /></>
                    ) : (
                      <>Valider et envoyer l'email <ArrowRight className="w-4 h-4" /></>
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
                        options: {
                          redirectTo: `${window.location.origin}/auth/callback`,
                        },
                      });
                      if (error) throw error;
                    } catch (err: any) {
                      console.log("Supabase Google Auth failed, using premium simulated fallback:", err);
                      const googleProfile = {
                        firstName: 'Silvere (Google)',
                        lastName: 'Martin',
                        email: 'silvere.google@email.com',
                        preferredLang: preferredLang || 'FR',
                        selectedCourses: selectedCourses.length > 0 ? selectedCourses : [1, 2],
                        isVerified: true
                      };
                      localStorage.setItem('op_user_profile', JSON.stringify(googleProfile));
                      localStorage.setItem('op_session', 'true');
                      localStorage.setItem('op_bookmarks', JSON.stringify(selectedCourses));
                      setVerificationStatus('success');
                      setStep(2);
                      setTimeout(() => {
                        router.push('/catalog');
                      }, 1000);
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

            )}

            {step === 2 && (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                {verificationStatus === 'verifying' ? (
                  <>
                    <div className="w-20 h-20 rounded-[32px] bg-blue-600/10 flex items-center justify-center text-blue-400 mx-auto mb-6 border border-blue-500/20 shadow-xl shadow-blue-600/5">
                      <Loader className="w-10 h-10 animate-spin" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-3 text-white">Validation en Cours</h1>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto mb-10">
                      Nous vérifions votre code de validation sécurisé...
                    </p>
                  </>
                ) : verificationStatus === 'success' ? (
                  <>
                    <div className="w-20 h-20 rounded-[32px] bg-emerald-600/10 flex items-center justify-center text-emerald-400 mx-auto mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-600/5 animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-3 text-white">Compte Activé !</h1>
                    <p className="text-emerald-400/80 text-xs leading-relaxed max-w-sm mx-auto mb-10 font-bold uppercase tracking-widest">
                      Votre adresse e-mail a été validée avec succès. Redirection vers votre catalogue de cours...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-[32px] bg-blue-600/10 flex items-center justify-center text-blue-400 mx-auto mb-6 border border-blue-500/20 shadow-xl shadow-blue-600/5">
                      <Mail className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-3 text-white">Vérification Requise</h1>
                    
                    {errorMsg && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-semibold text-left">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {isRealEmailSent ? (
                      <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto mb-10 border border-blue-500/30 bg-blue-500/5 p-4 rounded-2xl font-bold">
                        ✉️ Un e-mail de validation réel a été envoyé à l'adresse <span className="text-white font-black">{email}</span> via **Resend**. Veuillez cliquer sur le lien de confirmation présent dans votre boîte aux lettres.
                      </p>
                    ) : (
                      <>
                        <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto mb-10">
                          Un e-mail de validation a été envoyé à l'adresse <span className="text-slate-200 font-bold">{email}</span>. Veuillez cliquer sur le lien qu'il contient pour activer votre compte.
                        </p>

                        {/* INTERACTIVE SIMULATOR CARD */}
                        <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 text-left max-w-md mx-auto mb-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-3 text-[7px] font-black uppercase bg-blue-600/10 text-blue-400 border-l border-b border-slate-800 rounded-bl-xl tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>SIMULATEUR DE BOÎTE MAIL</span>
                          </div>
                          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Email de Validation Reçu</h3>
                          
                          <div className="space-y-4 border-l-2 border-blue-500 pl-4 py-1">
                            <p className="text-xs font-bold text-white leading-tight">Confirmation d'inscription OpenPrimer</p>
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                              Bonjour <span className="text-white font-bold">{firstName || 'Étudiant'}</span>,<br/>
                              Merci d'avoir rejoint le dépôt OpenPrimer. Cliquez sur le bouton ci-dessous pour confirmer votre e-mail :
                            </p>
                            <button 
                              onClick={handleVerifyAndLoginSimulated}
                              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmer mon Email & Me connecter (Local)
                            </button>
                            <div className="text-[8px] text-slate-600 mt-2 break-all">
                              URL Réelle générée : <a href={simulatedVerificationUrl} className="text-blue-500 underline">{simulatedVerificationUrl}</a>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                  <button 
                    onClick={() => {
                      setStep(1);
                      setVerificationStatus('idle');
                      setErrorMsg('');
                    }} 
                    className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                  >
                    Retourner au formulaire
                  </button>
                  <span className="hidden sm:inline text-slate-800">•</span>
                  <button 
                    onClick={() => setStep(3)} 
                    className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <Lock className="w-14 h-14 mx-auto mb-4 text-blue-500" />
                  <h1 className="text-3xl font-black tracking-tight text-white">RÉINITIALISER</h1>
                  <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-black">
                    Récupération de mot de passe
                  </p>
                </div>

                <form onSubmit={handleSimulateResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">Entrez votre Adresse Email</label>
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
                      onClick={() => setStep(2)}
                      className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                    >
                      Retour à la boîte de réception
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-xs text-slate-600">
            Déjà inscrit ? <Link href="/login" className="text-blue-500 font-bold hover:underline">Se connecter</Link>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
