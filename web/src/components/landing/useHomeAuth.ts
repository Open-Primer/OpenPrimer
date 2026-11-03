import React from 'react';
import { dbService } from '@/lib/db';
import { getLocalString } from '@/lib/translations';
import { getAuthStrings } from '../components/landing/landingStrings';

interface UseHomeAuthProps {
  lang: string;
  router: any;
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
  setErrorMsg: (v: string | null) => void;
  setSuccessMsg: (v: string | null) => void;
  setJustVerified: (v: boolean) => void;
  setIsLoggedIn: (v: boolean) => void;
  setAuthModal: (v: 'login' | 'signup' | 'forgot' | null) => void;
}

export function useHomeAuth({
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
}: UseHomeAuthProps) {
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !confirmPassword) {
      setErrorMsg(s.all_fields_required);
      return;
    }

    const fName = firstName.trim();
    const lName = lastName.trim();

    if (fName.length > 60 || lName.length > 60 || email.length > 60 || password.length > 60) {
      setErrorMsg(getLocalString('max_length_60', lang));
      return;
    }

    if (fName !== "" || lName !== "") {
      const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,60}$/;
      if ((fName !== "" && !nameRegex.test(fName)) || (lName !== "" && !nameRegex.test(lName))) {
        setErrorMsg(s.invalid_name);
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg(s.invalid_email);
      return;
    }

    const emailLower = email.trim().toLowerCase();
    const DEMO_EMAILS = [
      'vanguard.mysterious@gmail.com',
      'student1@openprimer.app',
      'student2@openprimer.app',
      'student3@openprimer.app',
      'silvere@openprimer.app'
    ];
    if (DEMO_EMAILS.includes(emailLower)) {
      setErrorMsg(getLocalString('email_already_registered', lang));
      return;
    }

    const storedProfileStr = localStorage.getItem('op_user_profile');
    if (storedProfileStr) {
      try {
        const storedProfile = JSON.parse(storedProfileStr);
        if (storedProfile && storedProfile.email && storedProfile.email.toLowerCase() === emailLower) {
          setErrorMsg(getLocalString('email_already_registered', lang));
          return;
        }
      } catch (err) {}
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=._\-\[\]{}()]).{12,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg(s.password_complexity_error);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(s.passwords_dont_match);
      return;
    }

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
      const redirectUrl = typeof window !== 'undefined' ? sessionStorage.getItem('op_auth_redirect') || undefined : undefined;
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: emailLower,
          password,
          preferredLang: lang,
          redirectUrl
        })
      });
      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || getLocalString('registration_failed', lang));
        return;
      }
      setAuthModal('verify');
    } catch (err: any) {
      setErrorMsg(getLocalString('server_connection_error', lang));
    }
  };

  const handleSimulateValidation = () => {
    const profile = {
      firstName,
      lastName,
      email,
      preferredLang: lang,
      isVerified: true,
      password: password
    };
    localStorage.setItem('op_user_profile', JSON.stringify(profile));
    localStorage.setItem('op_session', 'false');
    localStorage.setItem('op_registration_verified', 'true');
    setJustVerified(true);
    setErrorMsg('');
    setAuthModal('login');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(getLocalString('enter_credentials', lang));
      return;
    }

    const emailLower = email.toLowerCase().trim();

    if (isDatabaseConfigured) {
      try {
        const { supabase: sClient } = await import("@/lib/supabase");
        const { data: authData, error: authError } = await sClient.auth.signInWithPassword({
          email: emailLower,
          password: password
        });

        if (authError) {
          setErrorMsg(getLocalString('incorrect_credentials', lang));
          return;
        }

        const user = authData.user;
        if (user) {
          const { data: profileData } = await sClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileData) {
            const isVerified = localStorage.getItem('op_registration_verified') === 'true';
            const hasLoggedInBefore = localStorage.getItem('op_logged_in_before') === 'true';

            if (isVerified && !hasLoggedInBefore) {
              const redirectUrl = sessionStorage.getItem('op_auth_redirect');
              if (!redirectUrl) {
                localStorage.setItem('op_show_welcome_catalog_popup', 'true');
              }
              localStorage.setItem('op_logged_in_before', 'true');
            }

            const profile: Record<string, any> = {
              id: profileData.id,
              firstName: (profileData.name || '').split(' ')[0],
              lastName: (profileData.name || '').split(' ').slice(1).join(' '),
              email: profileData.email,
              preferredLang: profileData.preferred_lang || lang,
              role: profileData.role || 'student',
              isVerified: profileData.is_email_verified
            };

            const GUEST_KEYS = ['op_guest_audio_volume', 'op_guest_audio_rate', 'op_guest_audio_voice_id', 'op_guest_audio_read_course', 'op_guest_tts_enabled'] as const;
            const guestVolume    = sessionStorage.getItem('op_guest_audio_volume');
            const guestRate      = sessionStorage.getItem('op_guest_audio_rate');
            const guestVoiceId   = sessionStorage.getItem('op_guest_audio_voice_id');
            const guestReadCourse = sessionStorage.getItem('op_guest_audio_read_course');
            const guestTtsEnabled = sessionStorage.getItem('op_guest_tts_enabled');
            const hasGuestPrefs  = GUEST_KEYS.some(k => sessionStorage.getItem(k) !== null);

            if (hasGuestPrefs) {
              if (guestVolume !== null)    profile.audioVolume    = Number(guestVolume);
              if (guestRate !== null)      profile.audioRate      = Number(guestRate);
              if (guestVoiceId !== null)   profile.audioVoiceId   = guestVoiceId;
              if (guestReadCourse !== null) profile.audioReadCourse = guestReadCourse === 'true';
              if (guestTtsEnabled !== null) profile.ttsEnabled = guestTtsEnabled === 'true';
              profile.audioReadTutor = true;

              import('@/lib/db').then(async ({ dbService }) => {
                const settingsToSync: Record<string, any> = {};
                if (guestVolume !== null)    settingsToSync.audioVolume    = Number(guestVolume);
                if (guestRate !== null)      settingsToSync.audioRate      = Number(guestRate);
                if (guestVoiceId !== null)   settingsToSync.audioVoiceId   = guestVoiceId;
                if (guestReadCourse !== null) settingsToSync.audioReadCourse = guestReadCourse === 'true';
                if (guestTtsEnabled !== null) settingsToSync.ttsEnabled = guestTtsEnabled === 'true';
                await dbService.updateUserSettings(profile.id, settingsToSync);
              }).catch(e => console.warn('[Auth] Could not sync guest audio prefs to cloud:', e));

              GUEST_KEYS.forEach(k => sessionStorage.removeItem(k));
              sessionStorage.removeItem('op_guest_audio_read_tutor');
            }

            localStorage.setItem('op_user_profile', JSON.stringify(profile));
            localStorage.setItem('op_session', 'true');

            window.dispatchEvent(new CustomEvent('op_auth_state_change', { detail: { isLoggedIn: true } }));

            setIsLoggedIn(true);
            setAuthModal(null);

            const redirectUrl = sessionStorage.getItem('op_auth_redirect');
            if (redirectUrl) {
              sessionStorage.removeItem('op_auth_redirect');
              window.location.href = redirectUrl;
            } else {
              router.push(profile.role === 'admin' ? '/admin' : '/catalog');
            }
            return;
          }
        }
      } catch (err) {
        console.error("Direct Supabase login exception", err);
      }
      setErrorMsg(getLocalString('incorrect_credentials', lang));
      return;
    }

    try {
      const { data: userList } = await dbService.getUsers();
      const matchedUser = userList?.find((u: any) => u.email.toLowerCase() === emailLower) as any;

      if (matchedUser) {
        const inputHash = dbService.hashPassword(password);
        const expectedPassword = matchedUser.password || '832a760c15b462e3b6015fb4ffe6390e9df7d454a9185da8c77b3025a22c6d80';
        const isPasswordCorrect = expectedPassword === inputHash || expectedPassword === password;

        if (isPasswordCorrect) {
          const isVerified = localStorage.getItem('op_registration_verified') === 'true';
          const hasLoggedInBefore = localStorage.getItem('op_logged_in_before') === 'true';

          if (isVerified && !hasLoggedInBefore) {
            const redirectUrl = sessionStorage.getItem('op_auth_redirect');
            if (!redirectUrl) {
              localStorage.setItem('op_show_welcome_catalog_popup', 'true');
            }
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

          const GUEST_KEYS = ['op_guest_audio_volume', 'op_guest_audio_rate', 'op_guest_audio_voice_id', 'op_guest_audio_read_course', 'op_guest_tts_enabled'] as const;
          const guestVolume    = sessionStorage.getItem('op_guest_audio_volume');
          const guestRate      = sessionStorage.getItem('op_guest_audio_rate');
          const guestVoiceId   = sessionStorage.getItem('op_guest_audio_voice_id');
          const guestReadCourse = sessionStorage.getItem('op_guest_audio_read_course');
          const guestTtsEnabled = sessionStorage.getItem('op_guest_tts_enabled');
          const hasGuestPrefs  = GUEST_KEYS.some(k => sessionStorage.getItem(k) !== null);

          if (hasGuestPrefs) {
            if (guestVolume !== null)    profile.audioVolume    = Number(guestVolume);
            if (guestRate !== null)      profile.audioRate      = Number(guestRate);
            if (guestVoiceId !== null)   profile.audioVoiceId   = guestVoiceId;
            if (guestReadCourse !== null) profile.audioReadCourse = guestReadCourse === 'true';
            if (guestTtsEnabled !== null) profile.ttsEnabled = guestTtsEnabled === 'true';
            profile.audioReadTutor = true;

            GUEST_KEYS.forEach(k => sessionStorage.removeItem(k));
            sessionStorage.removeItem('op_guest_audio_read_tutor');
          }

          localStorage.setItem('op_user_profile', JSON.stringify(profile));
          localStorage.setItem('op_session', 'true');

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

    setErrorMsg(getLocalString('incorrect_credentials', lang));
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
      setErrorMsg(err?.message || getLocalString('google_signin_failed', lang));
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg(getLocalString('enter_email_reset', lang));
      return;
    }

    const emailLower = email.trim().toLowerCase();

    try {
      setErrorMsg('');
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',

  return {
    handleSignupSubmit,
    handleSimulateValidation,
    handleLoginSubmit,
    handleGoogleSignIn,
    handleForgotPasswordSubmit
  };
}
