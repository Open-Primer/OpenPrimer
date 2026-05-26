"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, BookOpen, Globe, Sparkles, Cpu, ChevronRight, Zap, Star, ShieldCheck, Clock, CheckCircle2, GraduationCap, Mail, Lock, User, Sparkle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { TopNav, AITutorOverlay, Footer } from '@/components/RefinedUI';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { UI_STRINGS } from '@/components/RefinedUI';
import { dbService } from '@/lib/db';

export default function Home() {
  const router = useRouter();
  const { language: lang, setLanguage: setLang } = useLanguage();
  const s = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total_students: 0, active_curricula: 0, total_languages: 0, total_courses: 0 });

  const allSearchableModules = [
    { title: lang === 'FR' ? "Mécanique Classique" : "Classical Mechanics", category: s.physics || 'Physics' },
    { title: lang === 'FR' ? "Physique Quantique" : "Quantum Physics", category: s.physics || 'Physics' },
    { title: lang === 'FR' ? "Biologie Cellulaire" : "Cell Biology", category: s.biology || 'Biology' },
    { title: lang === 'FR' ? "Génétique Moléculaire" : "Molecular Genetics", category: s.biology || 'Biology' },
    { title: lang === 'FR' ? "Droit Constitutionnel" : "Constitutional Law", category: s.law || 'Law' },
    { title: lang === 'FR' ? "Droit Pénal" : "Criminal Law", category: s.law || 'Law' },
    { title: lang === 'FR' ? "Algèbre Linéaire" : "Linear Algebra", category: s.math || 'Mathematics' },
    { title: lang === 'FR' ? "Analyse I" : "Calculus I", category: s.math || 'Mathematics' },
  ];

  const popularCourses = [
    {
      id: 1,
      title: lang === 'FR' ? "Physique : Mécanique Classique" : "Physics: Classical Mechanics",
      searchQuery: lang === 'FR' ? "Mécanique Classique" : "Classical Mechanics",
      color: "from-blue-500/20 to-blue-600/5 hover:border-blue-500/50 text-blue-400"
    },
    {
      id: 2,
      title: lang === 'FR' ? "Physique : Physique Quantique" : "Physics: Quantum Physics",
      searchQuery: lang === 'FR' ? "Physique Quantique" : "Quantum Physics",
      color: "from-violet-500/20 to-violet-600/5 hover:border-violet-500/50 text-violet-400"
    },
    {
      id: 3,
      title: lang === 'FR' ? "Biologie : Biologie Cellulaire" : "Biology: Cell Biology",
      searchQuery: lang === 'FR' ? "Biologie Cellulaire" : "Cell Biology",
      color: "from-emerald-500/20 to-emerald-600/5 hover:border-emerald-500/50 text-emerald-400"
    }
  ];

  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = allSearchableModules.filter(m => 
      m.title.toLowerCase().includes(search.toLowerCase()) || 
      m.category.toLowerCase().includes(search.toLowerCase())
    );
    setSuggestions(filtered);
  }, [search, lang]);

  // Guest Registration State
  const [authState, setAuthState] = useState<'signup' | 'login' | 'verify'>('signup');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [justVerified, setJustVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const coursesList = [
    { id: 1, title: 'Physique: Classical Mechanics (L1)', desc: 'Feynman-optimized physics' },
    { id: 2, title: 'Physique: Quantum Physics (L2)', desc: 'Quantum state vectors and wave mechanics' },
    { id: 3, title: 'Biologie: Cell Biology (L1)', desc: 'Cellular structures and ATP cycles' },
    { id: 4, title: 'Biologie: Molecular Genetics (L1)', desc: 'DNA replication and genetics' },
  ];

  useEffect(() => {
    setMounted(true);
    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session === 'true');

    async function loadStats() {
      const { data } = await dbService.getSiteStats();
      if (data) setStats(data);
    }
    loadStats();

    const handleTriggerAuth = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === 'login') {
        setAuthState('login');
      } else if (customEvent.detail === 'signup') {
        setAuthState('signup');
      }
    };
    window.addEventListener('op_trigger_auth_state', handleTriggerAuth);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get('auth');
      if (authParam === 'login') {
        setAuthState('login');
      } else if (authParam === 'signup') {
        setAuthState('signup');
      }
    }

    return () => {
      window.removeEventListener('op_trigger_auth_state', handleTriggerAuth);
    };
  }, []);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMsg('Veuillez remplir tous les champs requis.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }
    setErrorMsg('');
    setAuthState('verify');
  };

  const handleSimulateValidation = () => {
    const profile = {
      firstName,
      lastName,
      email,
      preferredLang: lang,
      isVerified: true
    };
    localStorage.setItem('op_user_profile', JSON.stringify(profile));
    localStorage.setItem('op_session', 'false'); // Not logged in yet!
    localStorage.setItem('op_registration_verified', 'true');
    setJustVerified(true);
    setErrorMsg('');
    setAuthState('login'); // Switch to login form!
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Veuillez entrer vos identifiants.');
      return;
    }

    const isVerified = localStorage.getItem('op_registration_verified') === 'true';
    if (isVerified) {
      localStorage.setItem('op_show_welcome_catalog_popup', 'true');
    }

    const testProfile = {
      firstName: isVerified ? firstName : 'Silvere',
      lastName: isVerified ? lastName : 'Martin',
      email: email,
      preferredLang: lang,
      isVerified: true
    };
    localStorage.setItem('op_user_profile', JSON.stringify(testProfile));
    localStorage.setItem('op_session', 'true');
    setIsLoggedIn(true);
    router.push('/catalog');
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  // GUEST LANDING PAGE GATEWAY
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden flex flex-col justify-between">
        <TopNav />
        <div className="fixed inset-0 bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="flex-1 max-w-7xl mx-auto w-full px-8 pt-24 pb-16 grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Brand Storytelling & Premium Accolades */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkle className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>{lang === 'FR' ? "DÉPÔT D'EXCELLENCE ACADÉMIQUE" : "DEPOT OF ACADEMIC EXCELLENCE"}</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] text-white">
              {s.universal_knowledge} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">
                {s.finally_free}
              </span>
            </h1>

            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-lg">
              {s.summary}
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-900">
              <div>
                <h4 className="text-2xl font-black text-white">5+</h4>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                  {lang === 'FR' ? "Langues" : "Languages"}
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">100%</h4>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                  {lang === 'FR' ? "Libre" : "Free"}
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white">L1 - L3</h4>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                  {lang === 'FR' ? "Niveaux" : "Levels"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Interactive Auth Form */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-slate-900/40 border border-slate-800 rounded-[48px] p-8 md:p-10 backdrop-blur-3xl shadow-2xl relative"
            >
              <AnimatePresence mode="wait">
                {authState === 'signup' && (
                  <motion.div 
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-center mb-6">
                      <OpenPrimerIcon className="w-12 h-12 mx-auto mb-3" />
                      <h2 className="text-2xl font-black tracking-tight text-white uppercase">Créer un Compte</h2>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mt-1">Commencer votre parcours</p>
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
                          <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">Prénom</label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                            <input 
                              required
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="Jean"
                              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">Nom</label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                            <input 
                              required
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Dupont"
                              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">Adresse Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                          <input 
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@email.com"
                            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                          />
                        </div>
                      </div>
                                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">Mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                          <input 
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 focus:outline-none cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">Confirmer le mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                          <input 
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
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
                        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 animate-pulse"
                      >
                        Valider mon inscription <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-600">
                      Déjà un compte ? <button onClick={() => { setErrorMsg(''); setAuthState('login'); }} className="text-blue-500 font-bold hover:underline cursor-pointer">Se connecter</button>
                    </p>
                  </motion.div>
                )}

                {authState === 'login' && (
                  <motion.div 
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-center mb-6">
                      <OpenPrimerIcon className="w-12 h-12 mx-auto mb-3" />
                      <h2 className="text-2xl font-black tracking-tight text-white uppercase">Connexion</h2>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mt-1">Accéder au Dépôt</p>
                    </div>

                    {justVerified && (
                      <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-semibold flex items-start gap-3 shadow-lg shadow-emerald-500/5">
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-bold text-white uppercase text-[8px] tracking-wider">Compte validé avec succès !</p>
                          <p className="text-slate-400 leading-normal text-[10px] font-medium">Votre inscription est confirmée. Connectez-vous maintenant pour choisir vos cours et composer votre curriculum.</p>
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
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">Adresse Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                          <input 
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@email.com"
                            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3.5 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">Mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                          <input 
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3.5 pl-10 pr-10 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 focus:outline-none cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                      >
                        Se Connecter
                      </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-600">
                      Nouveau ? <button onClick={() => { setErrorMsg(''); setAuthState('signup'); }} className="text-blue-500 font-bold hover:underline cursor-pointer">Créer un compte</button>
                    </p>
                  </motion.div>
                )}

                {authState === 'verify' && (
                  <motion.div 
                    key="verify"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto mb-4 border border-blue-500/20">
                      <Mail className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Vérifier l'Email</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-2 mb-6">
                      Un lien de validation a été envoyé à <span className="text-slate-300 font-bold">{email}</span>. Veuillez confirmer votre email pour débloquer votre accès.
                    </p>

                    <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 text-left mb-6 text-xs relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-2 py-1 bg-blue-600/10 text-blue-400 border-l border-b border-slate-850 rounded-bl-lg text-[6px] font-black uppercase tracking-wider">
                        EMAIL SIMULÉ
                      </div>
                      <p className="font-bold text-white mb-2">Bienvenue sur OpenPrimer !</p>
                      <button 
                        onClick={handleSimulateValidation}
                        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-600/10 cursor-pointer"
                      >
                        Valider mon compte & Se Connecter
                      </button>
                    </div>

                    <button onClick={() => setAuthState('signup')} className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest cursor-pointer">
                      Retour
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // LOGGED-IN HOME DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 font-sans overflow-hidden text-white">
      <TopNav />
      <AITutorOverlay lang="EN" />
      
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 pt-32 pb-24 flex flex-col items-center">
        
        {/* Shiny Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12 relative"
        >
          <OpenPrimerIcon className="w-24 h-24" />
          <div className="absolute -top-2 -right-6 bg-blue-600 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg shadow-blue-600/40">
            {s.beta_tag}
          </div>
        </motion.div>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter leading-none text-white">
            {s.universal_knowledge} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">
              {s.finally_free}
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {s.summary}
          </p>
        </div>

        {/* Search Bar & Dynamic Suggestions */}
        <div className="w-full max-w-2xl mb-12 relative z-[60]">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/20 blur-2xl group-focus-within:bg-blue-600/40 transition-all opacity-0 group-focus-within:opacity-100" />
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (search.trim()) {
                  router.push(`/catalog?search=${encodeURIComponent(search.trim())}`);
                }
              }}
              className="relative flex items-center bg-slate-900/80 border border-slate-800 p-2 rounded-[32px] backdrop-blur-xl focus-within:border-blue-500/50 transition-all shadow-2xl"
            >
              <div className="pl-6 pr-4">
                <Search className="w-6 h-6 text-slate-600" />
              </div>
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={s.search}
                className="flex-1 bg-transparent border-none py-4 text-lg text-white focus:outline-none placeholder:text-slate-700 font-medium"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full transition-all shadow-lg shadow-blue-600/20 mr-2 flex items-center justify-center"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 top-full mt-3 bg-slate-900/90 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl z-[70] p-2 backdrop-blur-2xl"
                >
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => router.push(`/catalog?search=${encodeURIComponent(sug.title)}`)}
                      className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-slate-850 rounded-2xl transition-colors text-left"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{sug.title}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-0.5">{sug.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Popular Curricula */}
        <div className="w-full max-w-2xl mb-20 text-center relative z-50">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">
            {lang === 'FR' ? "CURRICULUMS POPULAIRES" : "POPULAR CURRICULA"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {popularCourses.map(course => (
              <button 
                key={course.id}
                onClick={() => router.push(`/catalog?search=${encodeURIComponent(course.searchQuery)}`)}
                className={`p-6 rounded-[28px] border border-slate-900/60 bg-gradient-to-b ${course.color} backdrop-blur-xl shadow-xl flex flex-col items-center justify-center text-center transition-all hover:scale-105 active:scale-95 hover:border-slate-800 group`}
              >
                <GraduationCap className="w-5 h-5 mb-3 text-slate-500 group-hover:text-current transition-colors" />
                <h4 className="text-xs font-black tracking-tight leading-tight group-hover:text-white transition-colors">{course.title}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
           <div className="space-y-4 p-8 bg-slate-900/20 border border-slate-900 rounded-[40px] hover:bg-slate-900/40 transition-all group">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
               <BookOpen className="w-6 h-6" />
             </div>
             <div className="flex items-center gap-2">
               <h3 className="font-bold text-slate-200 uppercase text-[10px] tracking-widest">{s.rigor}</h3>
               <div className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{s.elite_tag}</div>
             </div>
             <p className="text-sm text-slate-500 leading-relaxed">{s.rigor_desc}</p>
           </div>
           
           <div className="space-y-4 p-8 bg-slate-900/20 border border-slate-900 rounded-[40px] hover:bg-slate-900/40 transition-all group">
             <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
               <Cpu className="w-6 h-6" />
             </div>
             <div className="flex items-center gap-2">
               <h3 className="font-bold text-slate-200 uppercase text-[10px] tracking-widest">{s.tutor}</h3>
               <div className="bg-blue-500/20 text-blue-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{s.new_tag}</div>
             </div>
             <p className="text-sm text-slate-500 leading-relaxed">{s.tutor_desc}</p>
           </div>

           <div className="space-y-4 p-8 bg-slate-900/20 border border-slate-900 rounded-[40px] hover:bg-slate-900/40 transition-all group">
             <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
               <Globe className="w-6 h-6" />
             </div>
             <div className="flex items-center gap-2">
               <h3 className="font-bold text-slate-200 uppercase text-[10px] tracking-widest">{s.languages}</h3>
               <div className="bg-violet-500/20 text-violet-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{lang === 'ZH' ? '5 种语言' : `5 ${s.languages}`}</div>
             </div>
             <p className="text-sm text-slate-500 leading-relaxed">{s.multilingual_desc}</p>
           </div>
        </div>

        {/* MISSION SECTION */}
        <section className="w-full mt-40 grid md:grid-cols-2 gap-16 items-center">
           <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
                 <Globe className="w-4 h-4" /> {s.mission_sub}
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-white">{s.mission}</h2>
              <p className="text-slate-500 leading-relaxed italic">
                "{s.mission_desc}"
              </p>
              <Link href="/philosophy" className="flex items-center gap-2 text-blue-500 font-bold hover:gap-4 transition-all">
                {s.mission_link} <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
               <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] text-center hover:border-blue-500/30 transition-all duration-300 backdrop-blur-xl group">
                  <p className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500 group-hover:scale-105 transition-transform duration-300">
                    {stats.total_languages || 2}
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-2">{s.languages}</p>
               </div>
               <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] text-center hover:border-violet-500/30 transition-all duration-300 backdrop-blur-xl group sm:mt-6">
                  <p className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-violet-500 group-hover:scale-105 transition-transform duration-300">
                    {stats.active_curricula || 10}
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-2">
                    {lang === 'FR' ? "Cursus" : "Curricula"}
                  </p>
               </div>
               <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] text-center hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-xl group sm:mt-12">
                  <p className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-500 group-hover:scale-105 transition-transform duration-300">
                    {stats.total_courses || 25}
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-2">
                    {lang === 'FR' ? "Cours Totaux" : "Total Courses"}
                  </p>
               </div>
            </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
