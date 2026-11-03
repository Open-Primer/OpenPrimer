"use client";

import React, { useState, useEffect, useRef } from 'react';

export interface UseAudioPreferencesProps {
  lang: string;
  synthRef: React.RefObject<SpeechSynthesis | null>;
  utteranceRef: React.RefObject<SpeechSynthesisUtterance | null>;
  isPlayingRef: React.RefObject<boolean>;
  isPausedRef: React.RefObject<boolean>;
  selectedVoiceRef: React.RefObject<SpeechSynthesisVoice | null>;
  rateRef: React.RefObject<number>;
  volumeRef: React.RefObject<number>;
  readCourseRef: React.RefObject<boolean>;
  readTutorRef: React.RefObject<boolean>;
  ttsEnabledRef: React.RefObject<boolean>;
}

export const useAudioPreferences = ({
  lang,
  synthRef,
  utteranceRef,
  isPlayingRef,
  isPausedRef,
  selectedVoiceRef,
  rateRef,
  volumeRef,
  readCourseRef,
  readTutorRef,
  ttsEnabledRef,
}: UseAudioPreferencesProps) => {
  const [rate, setRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [lastVolume, setLastVolume] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [readCourse, setReadCourse] = useState(true);
  const [readTutor, setReadTutor] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rateChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    saveSettingsToCloud({ rate: newRate });
    if (synthRef.current && isPlayingRef.current && !isPausedRef.current && utteranceRef.current) {
      if (rateChangeTimeoutRef.current) clearTimeout(rateChangeTimeoutRef.current);
      rateChangeTimeoutRef.current = setTimeout(() => {
        if (synthRef.current && utteranceRef.current) {
          try {
            synthRef.current.pause();
            utteranceRef.current.rate = newRate;
            synthRef.current.resume();
          } catch (e) {
            console.error("Failed to dynamically update utterance rate:", e);
          }
        }
      }, 150);
    }
  };

  const saveSettingsToCloud = (updates: { volume?: number; rate?: number; voiceId?: string; readCourse?: boolean; readTutor?: boolean; ttsEnabled?: boolean }) => {
    if (typeof window === 'undefined') return;
    const loggedIn = localStorage.getItem('op_session') === 'true';

    if (!loggedIn) {
      // Guest mode: save to sessionStorage
      try {
        if (updates.volume !== undefined) sessionStorage.setItem('op_guest_audio_volume', String(updates.volume));
        if (updates.rate !== undefined) sessionStorage.setItem('op_guest_audio_rate', String(updates.rate));
        if (updates.voiceId !== undefined) sessionStorage.setItem('op_guest_audio_voice_id', updates.voiceId);
        if (updates.readCourse !== undefined) sessionStorage.setItem('op_guest_audio_read_course', String(updates.readCourse));
        if (updates.ttsEnabled !== undefined) sessionStorage.setItem('op_guest_tts_enabled', String(updates.ttsEnabled));
        // Guest readTutor is always active by default and cannot be customized (disabled in settings)
        sessionStorage.setItem('op_guest_audio_read_tutor', 'true');
      } catch (e) {
        console.error("Error saving guest audio settings:", e);
      }
      return;
    }

    const savedProfile = localStorage.getItem('op_user_profile');
    // Always update local storage first so offline/anonymous users still have preferences saved
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        if (updates.volume !== undefined) p.audioVolume = updates.volume;
        if (updates.rate !== undefined) p.audioRate = updates.rate;
        if (updates.voiceId !== undefined) p.audioVoiceId = updates.voiceId;
        if (updates.readCourse !== undefined) p.audioReadCourse = updates.readCourse;
        if (updates.readTutor !== undefined) p.audioReadTutor = updates.readTutor;
        if (updates.ttsEnabled !== undefined) p.ttsEnabled = updates.ttsEnabled;
        localStorage.setItem('op_user_profile', JSON.stringify(p));
      } catch (e) {}
    }

    if (!savedProfile) return;

    try {
      const p = JSON.parse(savedProfile);
      const userId = p.id;
      if (!userId) return;

      // Debounce database sync
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(async () => {
        const { dbService } = await import('@/lib/db');
        const dbUpdates = {} as any;
        if (updates.volume !== undefined) dbUpdates.audioVolume = updates.volume;
        if (updates.rate !== undefined) dbUpdates.audioRate = updates.rate;
        if (updates.voiceId !== undefined) dbUpdates.audioVoiceId = updates.voiceId;
        if (updates.readCourse !== undefined) dbUpdates.audioReadCourse = updates.readCourse;
        if (updates.readTutor !== undefined) dbUpdates.audioReadTutor = updates.readTutor;
        if (updates.ttsEnabled !== undefined) dbUpdates.ttsEnabled = updates.ttsEnabled;

        const { error } = await dbService.updateUserSettings(userId, dbUpdates);
        if (error) {
          console.warn("[Cloud Sync] Failed to update audio settings:", error.message);
        } else {
          console.log("[Cloud Sync] Audio settings synchronized:", dbUpdates);
        }
      }, 1000);
    } catch (e) {
      console.error("[Cloud Sync] Error updating audio settings:", e);
    }
  };

  // Sync auth state and preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateAuthAndPreferences = () => {
      const session = localStorage.getItem('op_session');
      const loggedIn = session === 'true';
      setIsLoggedIn(loggedIn);

      let enabled = true;
      if (!loggedIn) {
        const val = sessionStorage.getItem('op_guest_tts_enabled');
        enabled = val !== 'false';
      } else {
        const savedProfile = localStorage.getItem('op_user_profile');
        if (savedProfile) {
          try {
            const p = JSON.parse(savedProfile);
            enabled = p.ttsEnabled !== false;
          } catch (e) {}
        }
      }
      setTtsEnabled(enabled);
    };
    updateAuthAndPreferences();
    window.addEventListener('storage', updateAuthAndPreferences);
    window.addEventListener('op_auth_state_changed', updateAuthAndPreferences);
    window.addEventListener('op_auth_state_change', updateAuthAndPreferences);
    window.addEventListener('op_accessibility_preferences_changed', updateAuthAndPreferences);
    return () => {
      window.removeEventListener('storage', updateAuthAndPreferences);
      window.removeEventListener('op_auth_state_changed', updateAuthAndPreferences);
      window.removeEventListener('op_auth_state_change', updateAuthAndPreferences);
      window.removeEventListener('op_accessibility_preferences_changed', updateAuthAndPreferences);
    };
  }, []);

  // 1. Check support, load preferences and load voices
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loggedIn = localStorage.getItem('op_session') === 'true';
    setIsLoggedIn(loggedIn);

    let loadedVolume = 1.0;
    let loadedRate = 1.0;
    let savedVoiceId: string | null = null;

    if (!loggedIn) {
      // Load guest preferences from sessionStorage
      try {
        const vol = sessionStorage.getItem('op_guest_audio_volume');
        if (vol !== null) {
          loadedVolume = Number(vol);
          setVolume(loadedVolume);
          setLastVolume(loadedVolume || 1.0);
        } else {
          setVolume(1.0);
          setLastVolume(1.0);
        }

        const rt = sessionStorage.getItem('op_guest_audio_rate');
        if (rt !== null) {
          loadedRate = Number(rt);
          setRate(loadedRate);
        } else {
          setRate(1.0);
        }

        const vId = sessionStorage.getItem('op_guest_audio_voice_id');
        if (vId) {
          savedVoiceId = vId;
        }

        const readC = sessionStorage.getItem('op_guest_audio_read_course');
        if (readC !== null) {
          setReadCourse(readC === 'true');
        } else {
          setReadCourse(true);
        }

        const ttsE = sessionStorage.getItem('op_guest_tts_enabled');
        if (ttsE !== null) {
          setTtsEnabled(ttsE === 'true');
        } else {
          setTtsEnabled(true);
        }

        // Guest mode: readTutor is always active by default and cannot be customized
        setReadTutor(true);
      } catch (err) {
        console.error("Error loading guest audio preferences:", err);
      }
    } else {
      // Load initial state from local storage first (prevent layout flash)
      const savedProfile = localStorage.getItem('op_user_profile');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          if (p.audioVolume !== undefined) {
            loadedVolume = Number(p.audioVolume);
            setVolume(loadedVolume);
            setLastVolume(loadedVolume || 1.0);
          }
          if (p.audioRate !== undefined) {
            loadedRate = Number(p.audioRate);
            setRate(loadedRate);
          }
          if (p.audioVoiceId) {
            savedVoiceId = p.audioVoiceId;
          }
          
          let needsSave = false;
          if (p.audioReadCourse !== undefined) {
            setReadCourse(p.audioReadCourse);
          } else {
            p.audioReadCourse = true;
            setReadCourse(true);
            needsSave = true;
          }
          if (p.audioReadTutor !== undefined) {
            setReadTutor(p.audioReadTutor);
          } else {
            p.audioReadTutor = true;
            setReadTutor(true);
            needsSave = true;
          }
          if (p.ttsEnabled !== undefined) {
            setTtsEnabled(p.ttsEnabled);
          } else {
            p.ttsEnabled = true;
            setTtsEnabled(true);
            needsSave = true;
          }
          
          if (needsSave) {
            localStorage.setItem('op_user_profile', JSON.stringify(p));
          }
        } catch (err) {}
      }

      // Try loading latest profile preferences from Supabase if connected
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          const userId = p.id;
          if (userId) {
            import('@/lib/db').then(async ({ dbService }) => {
              const { data, error } = await dbService.getUsers();
              if (data && !error) {
                const currentUser = data.find((u: any) => u.id === userId);
                if (currentUser) {
                  let updated = false;
                  if (currentUser.audioVolume !== undefined && currentUser.audioVolume !== null) {
                    const vol = Number(currentUser.audioVolume);
                    setVolume(vol);
                    setLastVolume(vol || 1.0);
                    p.audioVolume = vol;
                    loadedVolume = vol;
                    updated = true;
                  }
                  if (currentUser.audioRate !== undefined && currentUser.audioRate !== null) {
                    const r = Number(currentUser.audioRate);
                    setRate(r);
                    p.audioRate = r;
                    loadedRate = r;
                    updated = true;
                  }
                  if (currentUser.audioVoiceId) {
                    p.audioVoiceId = currentUser.audioVoiceId;
                    savedVoiceId = currentUser.audioVoiceId;
                    updated = true;
                  }
                  if (currentUser.audioReadCourse !== undefined && currentUser.audioReadCourse !== null) {
                    setReadCourse(currentUser.audioReadCourse);
                    p.audioReadCourse = currentUser.audioReadCourse;
                    updated = true;
                  }
                  if (currentUser.audioReadTutor !== undefined && currentUser.audioReadTutor !== null) {
                    setReadTutor(currentUser.audioReadTutor);
                    p.audioReadTutor = currentUser.audioReadTutor;
                    updated = true;
                  }
                  if (currentUser.ttsEnabled !== undefined && currentUser.ttsEnabled !== null) {
                    setTtsEnabled(currentUser.ttsEnabled);
                    p.ttsEnabled = currentUser.ttsEnabled;
                    updated = true;
                  }
                  if (updated) {
                    localStorage.setItem('op_user_profile', JSON.stringify(p));
                    // Try to match the voice now that it is resolved
                    if (synthRef.current) {
                      const availableVoices = window.speechSynthesis.getVoices();
                      const matched = availableVoices.find(v => v.name === savedVoiceId);
                      if (matched) {
                        setSelectedVoice(matched);
                      }
                    }
                  }
                }
              }
            }).catch(e => console.warn("[AudioReader] Offline fallback mode enabled for preferences:", e));
          }
        } catch (err) {}
      }
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      const PREFERRED_VOICES: Record<string, string[]> = {
        'fr': ['Google français', 'Hortense', 'Thomas', 'Microsoft Hortense Desktop', 'Amélie', 'Julie'],
        'en': ['Google US English', 'Google UK English Male', 'Google UK English Female', 'Microsoft Zira Desktop', 'Zira', 'Microsoft David Desktop', 'David', 'Samantha', 'Karen', 'Alex', 'Daniel'],
        'es': ['Google español', 'Google español de Estados Unidos', 'Microsoft Helena Desktop', 'Helena', 'Microsoft Sabina Desktop', 'Monica', 'Paulina'],
        'de': ['Google Deutsch', 'Microsoft Hedda Desktop', 'Hedda', 'Microsoft Stefan Desktop', 'Anna', 'Petra'],
        'zh': ['Google 普通话（中国大陆）', 'Google 粤语（香港）', 'Microsoft Huihui Desktop', 'Huihui', 'Microsoft Kangkang Desktop', 'Microsoft Yaoyao Desktop', 'Ting-Ting', 'Sinji'],
        'pt': ['Google português', 'Microsoft Maria Desktop', 'Maria', 'Microsoft Daniel Desktop', 'Daniel', 'Helia', 'Raissa'],
        'ar': ['Google العربية', 'Microsoft Naayf Desktop', 'Naayf', 'Hoda', 'Maged', 'Tarik'],
        'hi': ['Google हिन्दी', 'Microsoft Hemant Desktop', 'Hemant', 'Kalpana'],
        'ur': ['Google اردو', 'Microsoft Asif Desktop', 'Asif'],
      };

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // 1. Restore previously saved voice by exact name
        let matchedVoice = savedVoiceId
          ? availableVoices.find(v => v.name === savedVoiceId)
          : undefined;

        if (!matchedVoice) {
          const targetLang = (lang || 'EN').toLowerCase().split('-')[0];
          const preferred = PREFERRED_VOICES[targetLang] || [];

          // 2. Try preferred voice names for the language
          for (const name of preferred) {
            const found = availableVoices.find(v =>
              v.name.toLowerCase().includes(name.toLowerCase())
            );
            if (found) { matchedVoice = found; break; }
          }

          // 3. Fallback options prioritizing Google voices if available, then local/offline voices
          if (!matchedVoice) {
            matchedVoice = availableVoices.find(v =>
              v.lang.toLowerCase().startsWith(targetLang) && v.name.toLowerCase().includes('google')
            );
          }
          if (!matchedVoice) {
            matchedVoice = availableVoices.find(v =>
              v.lang.toLowerCase().startsWith(targetLang) && v.localService
            );
          }
          if (!matchedVoice) {
            matchedVoice = availableVoices.find(v =>
              v.lang.toLowerCase().startsWith(targetLang)
            );
          }

          // 4. Final fallback: first available voice
          if (!matchedVoice) matchedVoice = availableVoices[0];
        }
        setSelectedVoice(matchedVoice || null);
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (rateChangeTimeoutRef.current) {
        clearTimeout(rateChangeTimeoutRef.current);
      }
    };
  }, [lang, isLoggedIn]);


  return {
    rate,
    setRate,
    handleRateChange,
    volume,
    setVolume,
    lastVolume,
    setLastVolume,
    voices,
    setVoices,
    selectedVoice,
    setSelectedVoice,
    isSupported,
    setIsSupported,
    isLoggedIn,
    setIsLoggedIn,
    readCourse,
    setReadCourse,
    readTutor,
    setReadTutor,
    ttsEnabled,
    setTtsEnabled,
    saveSettingsToCloud
  };
};
