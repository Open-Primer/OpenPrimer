"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { Mail, Lock, User, ArrowRight, CheckCircle2, Globe, Sparkles, BookOpen, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer, UI_STRINGS } from '@/components/RefinedUI';
import { useLanguage } from '@/context/LanguageContext';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=._\-\[\]{}()]).{12,}$/;
const MAX_NAME_LENGTH = 60;
const MAX_EMAIL_LENGTH = 60;
const MAX_PASSWORD_LENGTH = 60;
// Rate-limit: max 3 submit attempts per 120 seconds
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 120_000;;

export default function SignupPage() {
  const router = useRouter();
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preferredLang, setPreferredLang] = useState(lang || 'EN');
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRealEmailSent, setIsRealEmailSent] = useState(false);
  const [simulatedVerificationUrl, setSimulatedVerificationUrl] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  // Rate-limit: track submit timestamps client-side
  const submitTimestamps = useRef<number[]>([]);

  // Sync preferred lang with global lang context
  useEffect(() => { setPreferredLang(lang || 'EN'); }, [lang]);

  const coursesList = [
    { id: 1, title: lang === 'FR' ? 'Mécanique Classique (L1)' : 'Classical Mechanics (L1)', desc: lang === 'FR' ? 'Newton, cinématique et dynamique' : 'Newton, kinematics and dynamics' },
    { id: 3, title: lang === 'FR' ? 'Biologie Cellulaire (L1)' : 'Cell Biology (L1)', desc: lang === 'FR' ? 'Organites, ATP et cycles métaboliques' : 'Organelles, ATP cycles and metabolism' },
    { id: 8, title: lang === 'FR' ? 'Calcul Intégral (L1)' : 'Calculus I (L1)', desc: lang === 'FR' ? 'Limites, dérivées et intégrales' : 'Limits, derivatives and integrals' },
    { id: 11, title: lang === 'FR' ? 'Statistiques L1' : 'L1 Statistics', desc: lang === 'FR' ? 'Probabilités et inférence statistique' : 'Probability and statistical inference' },
  ];

  // Check for email verification link in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      const emailParam = params.get('email');
      if (tokenParam && emailParam) {
        setVerificationStatus('verifying');
        setStep(2);
        setEmail(emailParam);
        fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenParam, email: emailParam })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setVerificationStatus('success');
              localStorage.setItem('op_user_profile', JSON.stringify(data.profile));
              localStorage.setItem('op_session', 'true');
              localStorage.setItem('op_bookmarks', JSON.stringify(selectedCourses));
              setTimeout(() => router.push('/catalog'), 2000);
            } else {
              setVerificationStatus('error');
              setErrorMsg(data.error || t.verify_confirm);
            }
          })
          .catch(() => { setVerificationStatus('error'); setErrorMsg(t.verify_confirm); });
      }
    }
  }, [router, selectedCourses, t.verify_confirm]);

  const handleToggleCourse = (id: number) => {
    setSelectedCourses(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setErrorMsg(t.all_fields_required); return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setErrorMsg(t.password_complexity_error); return;
    }

    // Client-side rate-limit guard
    const now = Date.now();
    submitTimestamps.current = submitTimestamps.current.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    if (submitTimestamps.current.length >= RATE_LIMIT_MAX) {
      const waitSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - submitTimestamps.current[0])) / 1000);
      setErrorMsg(
        lang === 'FR' ? `Trop de tentatives. Réessayez dans ${waitSec} secondes.` :
        lang === 'ES' ? `Demasiados intentos. Inténtelo de nuevo en ${waitSec} segundos.` :
        lang === 'DE' ? `Zu viele Versuche. Bitte warten Sie ${waitSec} Sekunden.` :
        lang === 'ZH' ? `尝试次数过多，请在 ${waitSec} 秒后重试。` :
        `Too many attempts. Please wait ${waitSec} seconds.`
      );
      return;
    }
    submitTimestamps.current.push(now);

    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, preferredLang, selectedCourses })
      });
      const data = await res.json();
      setIsSubmitting(false);
      if (data.success) {
        setIsRealEmailSent(data.isRealSent);
        setSimulatedVerificationUrl(data.verificationUrl);
        setStep(2);
      } else {
        setErrorMsg(data.error || t.all_fields_required);
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg(t.all_fields_required);
    }
  };

  const handleSimulateResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    alert(`${t.send_reset_link}: ${email || 'email'}`);
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

            {/* STEP 1: Registration Form */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-8">
                  <OpenPrimerIcon className="w-14 h-14 mx-auto mb-4" />
                  <h1 className="text-3xl md:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">
                    {t.create_account?.toUpperCase() || 'CREATE ACCOUNT'}
                  </h1>
                  <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-black">
                    {t.begin_journey}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">{t.first_name}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                        <input required value={firstName} onChange={e => setFirstName(e.target.value.slice(0, MAX_NAME_LENGTH))}
                          maxLength={MAX_NAME_LENGTH}
                          placeholder={t.first_name_placeholder || 'John'}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">{t.last_name}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                        <input required value={lastName} onChange={e => setLastName(e.target.value.slice(0, MAX_NAME_LENGTH))}
                          maxLength={MAX_NAME_LENGTH}
                          placeholder={t.last_name_placeholder || 'Doe'}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">{t.email_addr}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value.slice(0, MAX_EMAIL_LENGTH))}
                        maxLength={MAX_EMAIL_LENGTH}
                        placeholder="jean.dupont@email.com"
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">{t.password}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                      <input type={showPassword ? 'text' : 'password'} required value={password}
                        onChange={e => setPassword(e.target.value.slice(0, MAX_PASSWORD_LENGTH))}
                        placeholder={t.password_placeholder || '••••••••••••'}
                        minLength={12}
                        maxLength={MAX_PASSWORD_LENGTH}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-12 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-600 ml-3 leading-relaxed">{t.password_complexity_error}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">{t.preferred_lang}</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                      <select value={preferredLang} onChange={e => setPreferredLang(e.target.value)}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white appearance-none cursor-pointer">
                        <option value="FR">🇫🇷 Français (FR)</option>
                        <option value="EN">🇺🇸 English (EN)</option>
                        <option value="ES">🇪🇸 Español (ES)</option>
                        <option value="DE">🇩🇪 Deutsch (DE)</option>
                        <option value="ZH">🇨🇳 中文 (ZH)</option>
                      </select>
                    </div>
                  </div>

                  {/* Course selection */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>{t.course_select_optional}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {coursesList.map(course => {
                        const selected = selectedCourses.includes(course.id);
                        return (
                          <div key={course.id} onClick={() => handleToggleCourse(course.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${selected ? 'bg-blue-600/10 border-blue-500/60 text-white' : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-[10px] font-black leading-tight">{course.title}</h4>
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${selected ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-800'}`}>
                                {selected && <CheckCircle2 className="w-2.5 h-2.5" />}
                              </div>
                            </div>
                            <p className="text-[8px] text-slate-500 mt-1">{course.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50">
                    {isSubmitting ? <><span>{t.verifying}</span><Loader className="w-4 h-4 animate-spin" /></> : <>{t.validate_reg}<ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800/80" /></div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-[9px]">
                    <span className="bg-slate-950 px-4 text-slate-600">{t.or_continue_with}</span>
                  </div>
                </div>

                <button onClick={async () => {
                  try {
                    const { supabase } = await import('@/lib/supabase');
                    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } });
                    if (error) throw error;
                  } catch {
                    const googleProfile = { firstName: 'User (Google)', lastName: '', email: 'google@email.com', preferredLang: preferredLang || 'FR', selectedCourses, isVerified: true };
                    localStorage.setItem('op_user_profile', JSON.stringify(googleProfile));
                    localStorage.setItem('op_session', 'true');
                    setVerificationStatus('success'); setStep(2);
                    setTimeout(() => router.push('/catalog'), 1000);
                  }
                }} className="w-full py-4 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-200 hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 hover:bg-slate-900/60">
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

            {/* STEP 2: Email verification sent / success */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                {verificationStatus === 'verifying' ? (
                  <>
                    <div className="w-20 h-20 rounded-[32px] bg-blue-600/10 flex items-center justify-center text-blue-400 mx-auto mb-6 border border-blue-500/20 shadow-xl shadow-blue-600/5">
                      <Loader className="w-10 h-10 animate-spin" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-3 text-white">{t.validation_in_progress}</h1>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto mb-10">{t.validation_verifying_desc}</p>
                  </>
                ) : verificationStatus === 'success' ? (
                  <>
                    <div className="w-20 h-20 rounded-[32px] bg-emerald-600/10 flex items-center justify-center text-emerald-400 mx-auto mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-600/5 animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-3 text-white">{t.active_account}</h1>
                    <p className="text-emerald-400/80 text-xs leading-relaxed max-w-sm mx-auto mb-10 font-bold uppercase tracking-widest">{t.activation_success}</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-[32px] bg-blue-600/10 flex items-center justify-center text-blue-400 mx-auto mb-6 border border-blue-500/20 shadow-xl shadow-blue-600/5">
                      <Mail className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-3 text-white">{t.verify_email}</h1>

                    {errorMsg && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-semibold text-left">
                        <AlertCircle className="w-4 h-4 shrink-0" /><span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 text-left max-w-md mx-auto mb-8">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {t.verify_sent} <span className="text-white font-bold">{email}</span>. {t.verify_confirm}
                      </p>
                      
                      {!isRealEmailSent && (
                        <div className="mt-6 pt-6 border-t border-slate-800/80">
                          <span className="text-[9px] font-black uppercase text-violet-400 tracking-wider flex items-center gap-1.5 mb-2 font-mono">
                            <Sparkles className="w-3.5 h-3.5" />
                            {lang === 'FR' ? "Lien d'activation sandbox" : "Sandbox activation link"}
                          </span>
                          <p className="text-[10px] text-slate-500 leading-normal mb-3">
                            {lang === 'FR' ? "L'envoi d'emails SMTP est désactivé sur cet environnement de test. Copiez ce lien de validation pour activer le compte :" : "SMTP email dispatch is disabled in this test environment. Copy this validation link to activate the account:"}
                          </p>
                          <div className="font-mono text-[9px] text-blue-400 break-all select-all p-3.5 bg-slate-950 rounded-2xl border border-slate-850 shadow-inner">
                            {simulatedVerificationUrl}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                  <button onClick={() => { setStep(1); setVerificationStatus('idle'); setErrorMsg(''); }}
                    className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                    {t.return_to_form}
                  </button>
                  <span className="hidden sm:inline text-slate-800">•</span>
                  <button onClick={() => setStep(3)}
                    className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors">
                    {t.forgot_password}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Forgot password */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-8">
                  <Lock className="w-14 h-14 mx-auto mb-4 text-blue-500" />
                  <h1 className="text-3xl font-black tracking-tight text-white">{t.reset_password?.toUpperCase()}</h1>
                  <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-black">{t.forgot_password}</p>
                </div>
                <form onSubmit={handleSimulateResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">{t.enter_email}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="jean.dupont@email.com"
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800" />
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20">
                    {t.send_reset_link}
                  </button>
                  <div className="text-center">
                    <button type="button" onClick={() => setStep(2)}
                      className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                      {t.back_to_login}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-xs text-slate-600">
            {t.already_registered} <Link href="/login" className="text-blue-500 font-bold hover:underline">{t.login}</Link>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
