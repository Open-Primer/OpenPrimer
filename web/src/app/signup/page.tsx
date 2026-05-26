"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { Mail, Lock, User, ArrowRight, CheckCircle2, Globe, Sparkles, BookOpen, Star, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/RefinedUI';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = Form, 2 = Verification Email Sent, 3 = Reset Password flow
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLang, setPreferredLang] = useState('EN');
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const coursesList = [
    { id: 1, title: 'Physique: Classical Mechanics (L1)', desc: 'Feynman-optimized physics' },
    { id: 2, title: 'Physique: Quantum Physics (L2)', desc: 'Quantum state vectors and wave mechanics' },
    { id: 3, title: 'Biologie: Cell Biology (L1)', desc: 'Cellular structures and ATP cycles' },
    { id: 4, title: 'Biologie: Molecular Genetics (L1)', desc: 'DNA replication and genetics' },
  ];

  const handleToggleCourse = (id: number) => {
    if (selectedCourses.includes(id)) {
      setSelectedCourses(selectedCourses.filter(c => c !== id));
    } else {
      setSelectedCourses([...selectedCourses, id]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setErrorMsg('Veuillez remplir tous les champs requis.');
      return;
    }
    setErrorMsg('');
    setStep(2); // Go to email validation screen
  };

  // MOCK VERIFICATION & LOGIN ACTION
  const handleVerifyAndLogin = () => {
    const userProfile = {
      firstName,
      lastName,
      email,
      preferredLang,
      selectedCourses,
      isVerified: true
    };
    
    // Save to local storage to simulate backend database insertion
    localStorage.setItem('op_user_profile', JSON.stringify(userProfile));
    localStorage.setItem('op_session', 'true');
    localStorage.setItem('op_bookmarks', JSON.stringify(selectedCourses));
    
    // Trigger redirect with custom delay for absolute premium feel
    setTimeout(() => {
      router.push('/catalog');
    }, 1000);
  };

  const handleSimulateResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    alert(`Un lien de réinitialisation de mot de passe simulé a été envoyé à ${email || 'votre email'}.`);
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
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3"
                  >
                    Valider et envoyer l'email <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
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
                <div className="w-20 h-20 rounded-[32px] bg-blue-600/10 flex items-center justify-center text-blue-400 mx-auto mb-6 border border-blue-500/20 shadow-xl shadow-blue-600/5">
                  <Mail className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black tracking-tight mb-3 text-white">Vérification Requise</h1>
                <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto mb-10">
                  Un email de validation a été envoyé à l'adresse <span className="text-slate-200 font-bold">{email}</span>. Veuillez cliquer sur le lien qu'il contient pour activer votre compte.
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
                      Bonjour <span className="text-white font-bold">{firstName}</span>,<br/>
                      Merci d'avoir rejoint le dépôt OpenPrimer. Cliquez sur le bouton ci-dessous pour confirmer votre email :
                    </p>
                    <button 
                      onClick={handleVerifyAndLogin}
                      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmer mon Email & Me connecter
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => setStep(1)} 
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
