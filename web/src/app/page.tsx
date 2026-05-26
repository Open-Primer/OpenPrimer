"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, BookOpen, Globe, Sparkles, Cpu, ChevronRight, Zap, Star, ShieldCheck, Clock, CheckCircle2, GraduationCap, Mail, Lock, User, Sparkle, AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { TopNav, AITutorOverlay, Footer } from '@/components/RefinedUI';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { UI_STRINGS } from '@/components/RefinedUI';
import { dbService } from '@/lib/db';

const AUTH_STRINGS: Record<string, Record<string, string>> = {
  EN: {
    create_account: "Create an Account",
    begin_journey: "Begin your journey",
    first_name: "First Name",
    last_name: "Last Name",
    email_address: "Email Address",
    password: "Password",
    confirm_password: "Confirm Password",
    validate_reg: "Validate Registration",
    already_registered: "Already registered?",
    login: "Log In",
    access_repo: "Access the Repository",
    verified_success: "Account validated successfully!",
    verified_desc: "Your registration is confirmed. Connect now to choose your courses and compose your curriculum.",
    new_to_op: "New to OpenPrimer?",
    create_an_account: "Create an Account",
    verify_email: "Verify Email",
    verify_sent: "A validation link has been sent to",
    verify_confirm: "Please confirm your email to unlock your access.",
    simulated_email: "SIMULATED EMAIL",
    welcome_to_op: "Welcome to OpenPrimer!",
    verify_and_login: "Verify Account & Log In",
    back: "Back",
    first_name_placeholder: "John",
    last_name_placeholder: "Doe"
  },
  FR: {
    create_account: "Créer un Compte",
    begin_journey: "Commencer votre parcours",
    first_name: "Prénom",
    last_name: "Nom",
    email_address: "Adresse Email",
    password: "Mot de passe",
    confirm_password: "Confirmer le mot de passe",
    validate_reg: "Valider mon inscription",
    already_registered: "Déjà un compte ?",
    login: "Se Connecter",
    access_repo: "Accéder au Dépôt",
    verified_success: "Compte validé avec succès !",
    verified_desc: "Votre inscription est confirmée. Connectez-vous maintenant pour choisir vos cours et composer votre curriculum.",
    new_to_op: "Nouveau ?",
    create_an_account: "Créer un compte",
    verify_email: "Vérifier l'Email",
    verify_sent: "Un lien de validation a été envoyé à",
    verify_confirm: "Veuillez confirmer votre email pour débloquer votre accès.",
    simulated_email: "EMAIL SIMULÉ",
    welcome_to_op: "Bienvenue sur OpenPrimer !",
    verify_and_login: "Valider mon compte & Se Connecter",
    back: "Retour",
    first_name_placeholder: "Jean",
    last_name_placeholder: "Dupont"
  },
  ES: {
    create_account: "Crear una Cuenta",
    begin_journey: "Comienza tu viaje",
    first_name: "Nombre",
    last_name: "Apellido",
    email_address: "Correo Electrónico",
    password: "Contraseña",
    confirm_password: "Confirmar Contraseña",
    validate_reg: "Validar Registro",
    already_registered: "¿Ya tienes cuenta?",
    login: "Iniciar Sesión",
    access_repo: "Acceder al Repositorio",
    verified_success: "¡Cuenta validada con éxito!",
    verified_desc: "Tu registro está confirmado. Conéctate ahora para elegir tus cursos y componer tu currículo.",
    new_to_op: "¿Nuevo en OpenPrimer?",
    create_an_account: "Crear una cuenta",
    verify_email: "Verificar Correo",
    verify_sent: "Se ha enviado un enlace de validación a",
    verify_confirm: "Por favor confirma tu correo para desbloquear tu acceso.",
    simulated_email: "CORREO SIMULADO",
    welcome_to_op: "¡Bienvenido a OpenPrimer!",
    verify_and_login: "Validar cuenta e Iniciar sesión",
    back: "Volver",
    first_name_placeholder: "Juan",
    last_name_placeholder: "Pérez"
  },
  DE: {
    create_account: "Konto erstellen",
    begin_journey: "Beginne deine Reise",
    first_name: "Vorname",
    last_name: "Nachname",
    email_address: "E-Mail-Adresse",
    password: "Passwort",
    confirm_password: "Passwort bestätigen",
    validate_reg: "Registrierung bestätigen",
    already_registered: "Bereits registriert?",
    login: "Einloggen",
    access_repo: "Repository betreten",
    verified_success: "Konto erfolgreich validiert!",
    verified_desc: "Ihre Registrierung ist bestätigt. Verbinden Sie sich jetzt, um Ihre Kurse auszuwählen und Ihren Lehrplan zu erstellen.",
    new_to_op: "Neu bei OpenPrimer?",
    create_an_account: "Konto erstellen",
    verify_email: "E-Mail verifizieren",
    verify_sent: "Ein Bestätigungslink wurde gesendet an",
    verify_confirm: "Bitte bestätigen Sie Ihre E-Mail, um Ihren Zugang freizuschalten.",
    simulated_email: "SIMULIERTE E-MAIL",
    welcome_to_op: "Willkommen bei OpenPrimer!",
    verify_and_login: "Konto verifizieren & Einloggen",
    back: "Zurück",
    first_name_placeholder: "Hans",
    last_name_placeholder: "Müller"
  },
  IT: {
    create_account: "Crea un Account",
    begin_journey: "Inizia il tuo viaggio",
    first_name: "Nome",
    last_name: "Cognome",
    email_address: "Indirizzo Email",
    password: "Password",
    confirm_password: "Conferma Password",
    validate_reg: "Conferma Registrazione",
    already_registered: "Sei già registrato?",
    login: "Accedi",
    access_repo: "Accedi al Repository",
    verified_success: "Account validato con successo!",
    verified_desc: "La tua registrazione è confermata. Connettiti ora per scegliere i tuoi corsi e comporre il tuo curriculum.",
    new_to_op: "Nuovo su OpenPrimer?",
    create_an_account: "Crea un Account",
    verify_email: "Verifica Email",
    verify_sent: "Un link di convalida è stato inviato a",
    verify_confirm: "Conferma la tua email per sbloccare l'accesso.",
    simulated_email: "EMAIL SIMULATA",
    welcome_to_op: "Benvenuto su OpenPrimer!",
    verify_and_login: "Convalida Account & Accedi",
    back: "Indietro",
    first_name_placeholder: "Mario",
    last_name_placeholder: "Rossi"
  },
  ZH: {
    create_account: "创建账户",
    begin_journey: "开始您的学术旅程",
    first_name: "名字",
    last_name: "姓氏",
    email_address: "电子邮件地址",
    password: "密码",
    confirm_password: "确认密码",
    validate_reg: "确认注册",
    already_registered: "已经注册？",
    login: "登录",
    access_repo: "访问学术仓库",
    verified_success: "账户验证成功！",
    verified_desc: "您的注册已确认。请立即登录以选择课程并制定您的专属学习计划。",
    new_to_op: "首次使用 OpenPrimer？",
    create_an_account: "创建账户",
    verify_email: "验证电子邮件",
    verify_sent: "验证链接已发送至",
    verify_confirm: "请确认您的电子邮件以解锁访问权限。",
    simulated_email: "模拟邮件",
    welcome_to_op: "欢迎来到 OpenPrimer！",
    verify_and_login: "验证账户并登录",
    back: "返回",
    first_name_placeholder: "三",
    last_name_placeholder: "张"
  }
};

export default function Home() {
  const router = useRouter();
  const { language: lang, setLanguage: setLang } = useLanguage();
  const s = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const a = AUTH_STRINGS[lang as keyof typeof AUTH_STRINGS] || AUTH_STRINGS.EN;
  
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
  const [authModal, setAuthModal] = useState<'signup' | 'login' | 'verify' | null>(null);
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
        setAuthModal('login');
      } else if (customEvent.detail === 'signup') {
        setAuthModal('signup');
      }
    };
    window.addEventListener('op_trigger_auth_state', handleTriggerAuth);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get('auth');
      if (authParam === 'login') {
        setAuthModal('login');
      } else if (authParam === 'signup') {
        setAuthModal('signup');
      }
    }

    return () => {
      window.removeEventListener('op_trigger_auth_state', handleTriggerAuth);
    };
  }, []);

  const handleCloseAuthModal = () => {
    setAuthModal(null);
    if (typeof window !== 'undefined') {
      const redirectUrl = sessionStorage.getItem('op_auth_redirect');
      if (redirectUrl) {
        sessionStorage.removeItem('op_auth_redirect');
        window.location.href = redirectUrl;
      }
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMsg(lang === 'FR' ? 'Veuillez remplir tous les champs requis.' : 'Please fill all required fields.');
      return;
    }

    // Advanced Password Complexity Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=._\-\[\]{}()]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg(
        lang === 'FR' 
          ? 'Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial.' 
          : 'Password must be at least 8 characters long, including an uppercase letter, a lowercase letter, a number, and a special character.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(lang === 'FR' ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }
    setErrorMsg('');
    setAuthModal('verify');
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
    setAuthModal('login'); // Switch to login form!
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(lang === 'FR' ? 'Veuillez entrer vos identifiants.' : 'Please enter your credentials.');
      return;
    }

    const isVerified = localStorage.getItem('op_registration_verified') === 'true';
    const hasLoggedInBefore = localStorage.getItem('op_logged_in_before') === 'true';

    if (isVerified && !hasLoggedInBefore) {
      localStorage.setItem('op_show_welcome_catalog_popup', 'true');
      localStorage.setItem('op_logged_in_before', 'true');
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
    setAuthModal(null);
    
    const redirectUrl = sessionStorage.getItem('op_auth_redirect');
    if (redirectUrl) {
      sessionStorage.removeItem('op_auth_redirect');
      window.location.href = redirectUrl;
    } else {
      if (hasLoggedInBefore) {
        router.push('/profile/curriculum');
      } else {
        router.push('/catalog');
      }
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-500/30 font-sans overflow-x-hidden transition-colors duration-300 relative">
      <TopNav />
      <AITutorOverlay lang={lang} />
      
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
          <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter leading-none text-foreground">
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
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full transition-all shadow-lg shadow-blue-600/20 mr-2 flex items-center justify-center cursor-pointer"
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
                      className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-slate-850 rounded-2xl transition-colors text-left cursor-pointer"
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
                className={`p-6 rounded-[28px] border border-slate-900/60 bg-gradient-to-b ${course.color} backdrop-blur-xl shadow-xl flex flex-col items-center justify-center text-center transition-all hover:scale-105 active:scale-95 hover:border-slate-800 group cursor-pointer`}
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
              <h2 className="text-4xl font-black tracking-tighter text-foreground">{s.mission}</h2>
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

      {/* Floating Auth Modal */}
      <AnimatePresence>
        {authModal && (
          <div 
            onClick={handleCloseAuthModal}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-[48px] p-8 md:p-10 backdrop-blur-3xl shadow-2xl relative cursor-default text-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button X */}
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
                            {a.first_name}
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                            <input 
                              required
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder={a.first_name_placeholder}
                              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                            {a.last_name}
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                            <input 
                              required
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder={a.last_name_placeholder}
                              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                          {a.email_address}
                        </label>
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
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                          {a.password}
                        </label>
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
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                          {a.confirm_password}
                        </label>
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
                        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {a.validate_reg} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>

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
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                          {a.password}
                        </label>
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
                        {a.login}
                      </button>
                    </form>

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

                    <div className="bg-slate-950/60 border border-slate-855 rounded-2xl p-4 text-left mb-6 text-xs relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-2 py-1 bg-blue-600/10 text-blue-400 border-l border-b border-slate-855 rounded-bl-lg text-[6px] font-black uppercase tracking-wider">
                        {a.simulated_email}
                      </div>
                      <p className="font-bold text-white mb-2">
                        {a.welcome_to_op}
                      </p>
                      <button 
                        onClick={handleSimulateValidation}
                        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-600/10 cursor-pointer"
                      >
                        {a.verify_and_login}
                      </button>
                    </div>

                    <button onClick={() => setAuthModal('signup')} className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest cursor-pointer">
                      {a.back}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
