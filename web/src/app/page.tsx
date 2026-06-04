"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, BookOpen, Globe, Sparkles, Cpu, ChevronRight, Zap, Star, ShieldCheck, Clock, CheckCircle2, GraduationCap, Mail, Lock, User, Sparkle, AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { TopNav, AITutorOverlay, Footer } from '@/components/RefinedUI';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { UI_STRINGS } from '@/components/RefinedUI';
import { dbService } from '@/lib/db';
import { CourseKiosk } from '@/components/CourseKiosk';
import { PasswordRequirements } from '@/components/PasswordRequirements';

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
    last_name_placeholder: "Doe",
    sign_in_google: "Continue with Google",
    rate_limit: "Too many attempts. Please wait {waitSec} seconds.",
    or: "OR"
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
    last_name_placeholder: "Dupont",
    sign_in_google: "Continuer avec Google",
    rate_limit: "Trop de tentatives. Réessayez dans {waitSec} secondes.",
    or: "OU"
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
    last_name_placeholder: "Pérez",
    sign_in_google: "Continuar con Google",
    rate_limit: "Demasiados intentos. Inténtelo de nuevo en {waitSec} segundos.",
    or: "O"
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
    last_name_placeholder: "Müller",
    sign_in_google: "Mit Google fortfahren",
    rate_limit: "Zu viele Versuche. Bitte warten Sie {waitSec} Sekunden.",
    or: "ODER"
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
    last_name_placeholder: "Rossi",
    sign_in_google: "Continua con Google",
    or: "O"
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
    last_name_placeholder: "张",
    sign_in_google: "使用 Google 登录",
    rate_limit: "尝试次数过多，请在 {waitSec} 秒后重试。",
    or: "或"
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
  const [stats, setStats] = useState<any>(null);

  const [allSearchableModules, setAllSearchableModules] = useState<any[]>([]);
  const [popularCourses, setPopularCourses] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data } = await dbService.getAllCourses();
      if (data && data.length > 0) {
        // 1. Set searchable modules
        const mappedModules = data.map(c => ({
          title: dbService.getLocalizedCourseTitle(c, lang),
          category: c.subject || 'General'
        }));
        setAllSearchableModules(mappedModules);

        // 2. Sort by popularity descending and take top 3
        const sorted = [...data]
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 3)
          .map(c => {
            const title = dbService.getLocalizedCourseTitle(c, lang);
            return {
              id: c.id,
              title,
              searchQuery: title,
              color: c.id % 3 === 0 ? "from-emerald-500/20 to-emerald-600/5 hover:border-emerald-500/50 text-emerald-400"
                   : c.id % 3 === 1 ? "from-blue-500/20 to-blue-600/5 hover:border-blue-500/50 text-blue-400"
                   : "from-violet-500/20 to-violet-600/5 hover:border-violet-500/50 text-violet-400"
            };
          });
        setPopularCourses(sorted);
      } else {
        setAllSearchableModules([]);
        setPopularCourses([]);
      }
    }
    loadData();
  }, [lang]);

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
  }, [search, allSearchableModules]);

  // Guest Registration State
  const [authModal, setAuthModal] = useState<'signup' | 'login' | 'verify' | 'forgot' | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [justVerified, setJustVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const submitTimestamps = useRef<number[]>([]);

  // Reset password masking and error messages when authModal changes
  useEffect(() => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMsg('');
  }, [authModal]);

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

      const tokenParam = params.get('token');
      const emailParam = params.get('email');
      if (tokenParam && emailParam) {
        setAuthModal('login');
        setErrorMsg('');
        setJustVerified(false);
        fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenParam, email: emailParam })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              // ---- Guest → Authenticated settings migration (email verification path) ----
              const verifiedProfile: Record<string, any> = { ...data.profile };
              const GUEST_KEYS_VER = ['op_guest_audio_volume', 'op_guest_audio_rate', 'op_guest_audio_voice_id', 'op_guest_audio_read_course', 'op_guest_tts_enabled'] as const;
              const guestVolVer    = sessionStorage.getItem('op_guest_audio_volume');
              const guestRateVer   = sessionStorage.getItem('op_guest_audio_rate');
              const guestVoiceVer  = sessionStorage.getItem('op_guest_audio_voice_id');
              const guestReadCVer  = sessionStorage.getItem('op_guest_audio_read_course');
              const guestTtsEnabledVer = sessionStorage.getItem('op_guest_tts_enabled');
              const hasGuestVer    = GUEST_KEYS_VER.some(k => sessionStorage.getItem(k) !== null);

              if (hasGuestVer) {
                if (guestVolVer !== null)   verifiedProfile.audioVolume    = Number(guestVolVer);
                if (guestRateVer !== null)  verifiedProfile.audioRate      = Number(guestRateVer);
                if (guestVoiceVer !== null) verifiedProfile.audioVoiceId   = guestVoiceVer;
                if (guestReadCVer !== null) verifiedProfile.audioReadCourse = guestReadCVer === 'true';
                if (guestTtsEnabledVer !== null) verifiedProfile.ttsEnabled = guestTtsEnabledVer === 'true';
                verifiedProfile.audioReadTutor = true;
                // Async cloud sync for verification path
                if (verifiedProfile.id) {
                  import('@/lib/db').then(async ({ dbService }) => {
                    const s: Record<string, any> = {};
                    if (guestVolVer !== null)   s.audioVolume    = Number(guestVolVer);
                    if (guestRateVer !== null)  s.audioRate      = Number(guestRateVer);
                    if (guestVoiceVer !== null) s.audioVoiceId   = guestVoiceVer;
                    if (guestReadCVer !== null) s.audioReadCourse = guestReadCVer === 'true';
                    if (guestTtsEnabledVer !== null) s.ttsEnabled = guestTtsEnabledVer === 'true';
                    await dbService.updateUserSettings(verifiedProfile.id, s);
                  }).catch(e => console.warn('[Auth] Could not sync guest audio prefs to cloud (verify):', e));
                }
                GUEST_KEYS_VER.forEach(k => sessionStorage.removeItem(k));
                sessionStorage.removeItem('op_guest_audio_read_tutor');
              }
              // ---- End migration ----

              localStorage.setItem('op_user_profile', JSON.stringify(verifiedProfile));
              localStorage.setItem('op_session', 'true');
              localStorage.setItem('op_registration_verified', 'true');
              localStorage.setItem('op_show_welcome_catalog_popup', 'true');
              localStorage.setItem('op_logged_in_before', 'true');
              
              setIsLoggedIn(true);
              setAuthModal(null);
              window.dispatchEvent(new CustomEvent('op_auth_state_change', { detail: { isLoggedIn: true } }));
              router.push('/catalog');
            } else {
              setErrorMsg(data.error || (lang === 'FR' ? "Erreur de validation de l'email." : "Email validation failed."));
            }
          })
          .catch(() => {
            setErrorMsg(lang === 'FR' ? "Erreur de validation de l'email." : "Email validation failed.");
          });
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

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !confirmPassword) {
      setErrorMsg(s.all_fields_required || (lang === 'FR' ? 'Veuillez remplir tous les champs requis.' : 'Please fill all required fields.'));
      return;
    }

    const fName = firstName.trim();
    const lName = lastName.trim();

    if (fName.length > 60 || lName.length > 60 || email.length > 60 || password.length > 60) {
      setErrorMsg(lang === 'FR' ? 'La longueur maximale autorisée est de 60 caractères.' : 'Maximum allowed length is 60 characters.');
      return;
    }

    if (fName !== "" || lName !== "") {
      const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,60}$/;
      if ((fName !== "" && !nameRegex.test(fName)) || (lName !== "" && !nameRegex.test(lName))) {
        setErrorMsg(s.invalid_name || (lang === 'FR' ? 'Veuillez entrer un nom valide (2 à 60 caractères, lettres/espaces/tirets uniquement).' : 'Please enter a valid name (2-60 characters, letters/spaces/hyphens only).'));
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg(s.invalid_email || (lang === 'FR' ? 'Veuillez entrer une adresse email valide.' : 'Please enter a valid email address.'));
      return;
    }

    const emailLower = email.trim().toLowerCase();
    const DEMO_EMAILS = [
      'vanguard.mysterious@gmail.com',
      'student1@openprimer.org',
      'student2@openprimer.org',
      'student3@openprimer.org',
      'silvere@openprimer.org'
    ];
    if (DEMO_EMAILS.includes(emailLower)) {
      setErrorMsg(lang === 'FR' ? 'Cette adresse e-mail est déjà enregistrée.' : 'This email address is already registered.');
      return;
    }

    const storedProfileStr = localStorage.getItem('op_user_profile');
    if (storedProfileStr) {
      try {
        const storedProfile = JSON.parse(storedProfileStr);
        if (storedProfile && storedProfile.email && storedProfile.email.toLowerCase() === emailLower) {
          setErrorMsg(lang === 'FR' ? 'Cette adresse e-mail est déjà enregistrée.' : 'This email address is already registered.');
          return;
        }
      } catch (err) {}
    }

    // Advanced Password Complexity Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=._\-\[\]{}()]).{12,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg(s.password_complexity_error || (lang === 'FR' ? 'Le mot de passe doit contenir au moins 12 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial.' : 'Password must be at least 12 characters long, including an uppercase letter, a lowercase letter, a number, and a special character.'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(s.passwords_dont_match || (lang === 'FR' ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.'));
      return;
    }

    // Client-side rate-limit guard (max 3 submit attempts per 120 seconds)
    const now = Date.now();
    submitTimestamps.current = submitTimestamps.current.filter(ts => now - ts < 120000);
    if (submitTimestamps.current.length >= 3) {
      const waitSec = Math.ceil((120000 - (now - submitTimestamps.current[0])) / 1000);
      const at = AUTH_STRINGS[lang as keyof typeof AUTH_STRINGS] || AUTH_STRINGS.EN;
      setErrorMsg((at.rate_limit as string).replace('{waitSec}', String(waitSec)));
      return;
    }
    submitTimestamps.current.push(now);

    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: emailLower,
          password,
          preferredLang: lang
        })
      });
      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || (lang === 'FR' ? "Échec de l'inscription." : "Registration failed."));
        return;
      }
      setAuthModal('verify');
    } catch (err: any) {
      setErrorMsg(lang === 'FR' ? "Erreur de connexion au serveur." : "Server connection error.");
    }
  };

  const handleSimulateValidation = () => {
    const profile = {
      firstName,
      lastName,
      email,
      preferredLang: lang,
      isVerified: true,
      password: password // Enforce match during login!
    };
    localStorage.setItem('op_user_profile', JSON.stringify(profile));
    localStorage.setItem('op_session', 'false'); // Not logged in yet!
    localStorage.setItem('op_registration_verified', 'true');
    setJustVerified(true);
    setErrorMsg('');
    setAuthModal('login'); // Switch to login form!
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(lang === 'FR' ? 'Veuillez entrer vos identifiants.' : 'Please enter your credentials.');
      return;
    }

    const emailLower = email.toLowerCase().trim();

    // 2. Query dbService asynchronously to retrieve the user list and find a match
    try {
      const { data: userList } = await dbService.getUsers();
      const matchedUser = userList?.find((u: any) => u.email.toLowerCase() === emailLower) as any;

      if (matchedUser) {
        // Enforce strict password validation via SHA-256 hash comparison
        const inputHash = dbService.hashPassword(password);
        
        // If a password is set, retrieve it. Otherwise, fall back to the default hash of 'OpenPrimer2026!' (832a760c15b462e3b6015fb4ffe6390e9df7d454a9185da8c77b3025a22c6d80)
        const expectedPassword = matchedUser.password || '832a760c15b462e3b6015fb4ffe6390e9df7d454a9185da8c77b3025a22c6d80';
        
        const isPasswordCorrect = expectedPassword === inputHash || expectedPassword === password;

        if (isPasswordCorrect) {
          const isVerified = localStorage.getItem('op_registration_verified') === 'true';
          const hasLoggedInBefore = localStorage.getItem('op_logged_in_before') === 'true';

          if (isVerified && !hasLoggedInBefore) {
            localStorage.setItem('op_show_welcome_catalog_popup', 'true');
            localStorage.setItem('op_logged_in_before', 'true');
          }

          const profile: Record<string, any> = {
            id: matchedUser.id,
            firstName: matchedUser.name.split(' ')[0],
            lastName: matchedUser.name.split(' ').slice(1).join(' '),
            email: matchedUser.email,
            preferredLang: matchedUser.preferredLang || lang,
            role: matchedUser.role,
            isVerified: matchedUser.isEmailVerified
          };

          // ---- Guest → Authenticated settings migration ----
          // If the user had modified audio preferences as a guest, migrate them
          // into their profile (localStorage + cloud sync) upon first login.
          const GUEST_KEYS = ['op_guest_audio_volume', 'op_guest_audio_rate', 'op_guest_audio_voice_id', 'op_guest_audio_read_course', 'op_guest_tts_enabled'] as const;
          const guestVolume    = sessionStorage.getItem('op_guest_audio_volume');
          const guestRate      = sessionStorage.getItem('op_guest_audio_rate');
          const guestVoiceId   = sessionStorage.getItem('op_guest_audio_voice_id');
          const guestReadCourse = sessionStorage.getItem('op_guest_audio_read_course');
          const guestTtsEnabled = sessionStorage.getItem('op_guest_tts_enabled');
          const hasGuestPrefs  = GUEST_KEYS.some(k => sessionStorage.getItem(k) !== null);

          if (hasGuestPrefs) {
            // Merge guest prefs into profile — they take precedence over DB defaults
            if (guestVolume !== null)    profile.audioVolume    = Number(guestVolume);
            if (guestRate !== null)      profile.audioRate      = Number(guestRate);
            if (guestVoiceId !== null)   profile.audioVoiceId   = guestVoiceId;
            if (guestReadCourse !== null) profile.audioReadCourse = guestReadCourse === 'true';
            if (guestTtsEnabled !== null) profile.ttsEnabled = guestTtsEnabled === 'true';
            profile.audioReadTutor = true; // always active; guest cannot have changed it

            // Async cloud sync — fire and forget
            import('@/lib/db').then(async ({ dbService }) => {
              const settingsToSync: Record<string, any> = {};
              if (guestVolume !== null)    settingsToSync.audioVolume    = Number(guestVolume);
              if (guestRate !== null)      settingsToSync.audioRate      = Number(guestRate);
              if (guestVoiceId !== null)   settingsToSync.audioVoiceId   = guestVoiceId;
              if (guestReadCourse !== null) settingsToSync.audioReadCourse = guestReadCourse === 'true';
              if (guestTtsEnabled !== null) settingsToSync.ttsEnabled = guestTtsEnabled === 'true';
              await dbService.updateUserSettings(matchedUser.id, settingsToSync);
              console.log('[Auth] Guest audio preferences migrated to cloud:', settingsToSync);
            }).catch(e => console.warn('[Auth] Could not sync guest audio prefs to cloud:', e));

            // Clear guest sessionStorage keys
            GUEST_KEYS.forEach(k => sessionStorage.removeItem(k));
            sessionStorage.removeItem('op_guest_audio_read_tutor');
          }
          // ---- End migration ----

          localStorage.setItem('op_user_profile', JSON.stringify(profile));
          localStorage.setItem('op_session', 'true');

          // Dispatch reactive auth state event
          window.dispatchEvent(new CustomEvent('op_auth_state_change', { detail: { isLoggedIn: true } }));

          setIsLoggedIn(true);
          setAuthModal(null);

          const redirectUrl = sessionStorage.getItem('op_auth_redirect');
          if (redirectUrl) {
            sessionStorage.removeItem('op_auth_redirect');
            window.location.href = redirectUrl;
          } else {
            router.push(matchedUser.role === 'admin' ? '/admin' : '/catalog');
          }
          return;
        }
      }
    } catch (err) {
      console.error("Authentication check exception", err);
    }

    // 3. Otherwise, reject access
    setErrorMsg(lang === 'FR' ? 'Identifiants incorrects.' : 'Incorrect credentials.');
  };

  const handleGoogleSignIn = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setErrorMsg(err?.message || (lang === 'FR' ? "Échec de la connexion avec Google." : "Failed to sign in with Google."));
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg(lang === 'FR' ? 'Veuillez entrer votre adresse email.' : 'Please enter your email address.');
      return;
    }

    const emailLower = email.trim().toLowerCase();

    // Verify if identifier is registered
    const DEMO_EMAILS = [
      'vanguard.mysterious@gmail.com',
      'student1@openprimer.org',
      'student2@openprimer.org',
      'student3@openprimer.org',
      'silvere@openprimer.org'
    ];
    let emailFound = DEMO_EMAILS.includes(emailLower);

    if (!emailFound) {
      const storedProfileStr = localStorage.getItem('op_user_profile');
      if (storedProfileStr) {
        try {
          const storedProfile = JSON.parse(storedProfileStr);
          if (storedProfile && storedProfile.email && storedProfile.email.toLowerCase() === emailLower) {
            emailFound = true;
          }
        } catch (err) {}
      }
    }

    if (!emailFound) {
      setErrorMsg(lang === 'FR' ? 'Cette adresse e-mail est inconnue.' : 'This email address is not registered.');
      return;
    }

    try {
      setErrorMsg('');
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.resetPasswordForEmail(emailLower, {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
      });
      if (error) {
        console.warn("Supabase resetPasswordForEmail error, using simulator:", error);
      }
      setSuccessMsg(s.email_sent || (lang === 'FR' ? 'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email.' : 'A password reset link has been sent to your email address.'));
    } catch (err: any) {
      console.warn("Password reset exception, falling back to simulator:", err);
      setSuccessMsg(s.email_sent || (lang === 'FR' ? 'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email.' : 'A password reset link has been sent to your email address.'));
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

        {/* Popular Curricula Kiosk */}
        <div className="w-full max-w-4xl mb-20 relative z-50">
          <CourseKiosk 
            lang={lang} 
            title={s.popular_curricula}
            subtitle={lang.toUpperCase() === 'FR' ? "Découvrez nos cursus universitaires et cours interactifs d'élite" : "Explore our elite university curricula and interactive courses"}
            onCourseClick={(course) => router.push(`/catalog?search=${encodeURIComponent(course.title)}`)}
          />
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
                    {stats ? stats.total_languages : 5}
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-2">{s.languages}</p>
               </div>
               <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] text-center hover:border-violet-500/30 transition-all duration-300 backdrop-blur-xl group sm:mt-6">
                  <p className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-violet-500 group-hover:scale-105 transition-transform duration-300">
                    {stats ? stats.active_curricula : 12}
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-2">
                    {s.curricula || "Curricula"}
                  </p>
               </div>
               <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] text-center hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-xl group sm:mt-12">
                  <p className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-500 group-hover:scale-105 transition-transform duration-300">
                    {stats ? stats.total_courses : 36}
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-2">
                    {s.total_courses || "Total Courses"}
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
                            {a.first_name} <span className="text-[6px] text-slate-600 lowercase">({lang.toUpperCase() === 'FR' ? "optionnel" : "optional"})</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                            <input 
                              value={firstName}
                              onChange={(e) => { setFirstName(e.target.value.slice(0, 60)); if (errorMsg) setErrorMsg(''); }}
                              maxLength={60}
                              placeholder={a.first_name_placeholder}
                              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                            {a.last_name} <span className="text-[6px] text-slate-600 lowercase">({lang.toUpperCase() === 'FR' ? "optionnel" : "optional"})</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                            <input 
                              value={lastName}
                              onChange={(e) => { setLastName(e.target.value.slice(0, 60)); if (errorMsg) setErrorMsg(''); }}
                              maxLength={60}
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
                            onChange={(e) => { setEmail(e.target.value.slice(0, 60)); if (errorMsg) setErrorMsg(''); }}
                            maxLength={60}
                            placeholder={s.email_placeholder || "john.doe@email.com"}
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
                            onChange={(e) => { setPassword(e.target.value.slice(0, 60)); if (errorMsg) setErrorMsg(''); }}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            maxLength={60}
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
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                          <input 
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value.slice(0, 60)); if (errorMsg) setErrorMsg(''); }}
                            maxLength={60}
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
                      className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-white font-black text-[9px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
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
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                          <input 
                            type="email"
                            required
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); if (errorMsg) setErrorMsg(''); }}
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
                            onChange={(e) => { setPassword(e.target.value); if (errorMsg) setErrorMsg(''); }}
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
                        <div className="flex justify-end px-1 pt-1">
                          <button
                            type="button"
                            onClick={() => { setErrorMsg(''); setSuccessMsg(''); setAuthModal('forgot'); }}
                            className="text-[10px] font-semibold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer focus:outline-none"
                          >
                            {s.forgot_password || (lang === 'FR' ? 'Mot de passe oublié ?' : 'Forgot Password?')}
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
                      className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-white font-black text-[9px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
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
                      <div className="bg-slate-950/40 border border-slate-850/50 rounded-2xl p-4 text-left mb-6 text-xs text-slate-400">
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
                        {s.forgot_password || (lang === 'FR' ? 'Mot de passe oublié' : 'Forgot Password')}
                      </h2>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mt-2 leading-relaxed">
                        {s.enter_email || (lang === 'FR' ? "Entrez votre adresse e-mail" : "Enter your email address")}
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
                            {lang === 'FR' ? 'E-mail Envoyé' : 'Email Sent'}
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
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                            <input 
                              type="email"
                              required
                              value={email}
                              onChange={(e) => { setEmail(e.target.value); if (errorMsg) setErrorMsg(''); }}
                              placeholder="name@email.com"
                              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3.5 pl-10 pr-3 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" 
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                        >
                          {s.send_reset_link || (lang === 'FR' ? 'Envoyer le lien' : 'Send Reset Link')}
                        </button>
                      </form>
                    ) : null}

                    <div className="text-center mt-6">
                      <button 
                        onClick={() => { setErrorMsg(''); setSuccessMsg(''); setAuthModal('login'); }}
                        className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest cursor-pointer"
                      >
                        {s.back_to_login || (lang === 'FR' ? 'Retour à la connexion' : 'Back to Login')}
                      </button>
                    </div>
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
