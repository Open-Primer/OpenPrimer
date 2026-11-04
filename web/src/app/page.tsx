"use client";

import { useHomeAuth } from '@/components/landing/useHomeAuth';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ChevronRight } from 'lucide-react';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { TopNav, AITutorOverlay, Footer } from '@/components/RefinedUI';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { UI_STRINGS, getCoursePath, getLocalizedDiscipline } from '@/lib/translations';
import { dbService, isDatabaseConfigured } from '@/lib/db';
import { CourseKiosk } from '@/components/CourseKiosk';
import { AUTH_STRINGS, getLocalString } from '@/components/landing/landingStrings';
import { HomeAuthModal } from '@/components/landing/HomeAuthModal';
import { FeaturesAndMissionSection } from '@/components/landing/LandingSections';

export default function Home() {
  const router = useRouter();
  const { language: lang } = useLanguage();
  const s = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const a = AUTH_STRINGS[lang as keyof typeof AUTH_STRINGS] || AUTH_STRINGS.EN;
  
  const [mounted, setMounted] = useState(false);
  const [, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState<any>(null);

  const [allSearchableModules, setAllSearchableModules] = useState<any[]>([]);
  const [, setPopularCourses] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data } = await dbService.getAllCourses();
      if (data && data.length > 0) {
        const mappedModules = data.map(c => ({
          title: dbService.getLocalizedCourseTitle(c, lang),
          category: getLocalizedDiscipline(c.subject || 'General', lang)
        }));
        setAllSearchableModules(mappedModules);

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const submitTimestamps = useRef<number[]>([]);

  useEffect(() => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMsg('');
  }, [authModal]);

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
      const redirectParam = params.get('redirect');
      if (redirectParam) {
        sessionStorage.setItem('op_auth_redirect', redirectParam);
      }
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

              localStorage.setItem('op_user_profile', JSON.stringify(verifiedProfile));
              localStorage.setItem('op_session', 'true');
              localStorage.setItem('op_registration_verified', 'true');
              localStorage.setItem('op_logged_in_before', 'true');
              
              setIsLoggedIn(true);
              setAuthModal(null);
              window.dispatchEvent(new CustomEvent('op_auth_state_change', { detail: { isLoggedIn: true } }));
              const redirectUrl = sessionStorage.getItem('op_auth_redirect');
              if (redirectUrl) {
                localStorage.removeItem('op_show_welcome_catalog_popup');
                sessionStorage.removeItem('op_auth_redirect');
                window.location.href = redirectUrl;
              } else {
                localStorage.setItem('op_show_welcome_catalog_popup', 'true');
                router.push('/catalog');
              }
            } else {
              setErrorMsg(data.error || getLocalString('email_validation_failed', lang));
            }
          })
          .catch(() => {
            setErrorMsg(getLocalString('email_validation_failed', lang));
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

  const {
    handleSignupSubmit,
    handleSimulateValidation,
    handleLoginSubmit,
    handleGoogleSignIn,
    handleForgotPasswordSubmit
  } = useHomeAuth({
    lang,
    router,
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
    setErrorMsg,
    setSuccessMsg,
    setJustVerified,
    setIsLoggedIn,
    setAuthModal
  });

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-500/30 font-sans overflow-x-hidden transition-colors duration-300 relative">
      <TopNav />
      <AITutorOverlay lang={lang} />
      
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-8 pt-32 pb-24 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12 relative"
        >
          <OpenPrimerIcon className="w-24 h-24" />
        </motion.div>

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
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={s.search}
                className="flex-1 bg-transparent border-none py-4 text-lg text-white focus:outline-none placeholder:text-slate-500 font-medium"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full transition-all shadow-lg shadow-blue-600/20 mr-2 flex items-center justify-center cursor-pointer"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>

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
                      className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-slate-800 rounded-2xl transition-colors text-left cursor-pointer"
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

          {(stats?.total_courses || 0) > 10000 && (
            <div className="flex items-center justify-center mt-3 text-xs font-medium text-slate-400">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/60 border border-slate-800/80 shadow-sm backdrop-blur-md text-slate-400 text-[11px] tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {getLocalString('courses_available_badge', lang).replace(
                  '{count}',
                  (stats?.total_courses || 0).toLocaleString()
                )}
              </span>
            </div>
          )}
        </div>

        {/* Popular Curricula Kiosk */}
        <div className="w-full max-w-4xl mb-20 relative z-50">
          <CourseKiosk 
            lang={lang} 
            title={s.popular_curricula}
            subtitle={getLocalString('hero_subtitle', lang)}
            onCourseClick={(course) => {
              const targetPath = getCoursePath(course.level, course.subject, course.slug, 'introduction', lang);
              console.log("[Client Navigation] Course clicked in kiosk. Navigating to:", targetPath);
              window.location.href = targetPath;
            }}
          />
        </div>

        <FeaturesAndMissionSection stats={stats} lang={lang} s={s} />

        <Footer />
      </div>

      <HomeAuthModal
        authModal={authModal}
        setAuthModal={setAuthModal}
        handleCloseAuthModal={handleCloseAuthModal}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        isPasswordFocused={isPasswordFocused}
        setIsPasswordFocused={setIsPasswordFocused}
        justVerified={justVerified}
        errorMsg={errorMsg || ''}
        setErrorMsg={setErrorMsg}
        successMsg={successMsg || ''}
        setSuccessMsg={setSuccessMsg}
        handleSignupSubmit={handleSignupSubmit}
        handleLoginSubmit={handleLoginSubmit}
        handleGoogleSignIn={handleGoogleSignIn}
        handleSimulateValidation={handleSimulateValidation}
        handleForgotPasswordSubmit={handleForgotPasswordSubmit}
        lang={lang}
        s={s}
        a={a}
      />
    </div>
  );
}
