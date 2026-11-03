import { useState, useEffect, useRef } from 'react';
import { dbService, TutorPersonality } from '@/lib/db';

export function useTutorAuthAndPersona() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tutorEnabled, setTutorEnabled] = useState(true);
  const [personalities, setPersonalities] = useState<TutorPersonality[]>([]);
  const [persona, setPersona] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('op_active_tutor_personality') || 'socratic';
    }
    return 'socratic';
  });

  useEffect(() => {
    const updateAuth = () => {
      const session = localStorage.getItem('op_session');
      setIsLoggedIn(session === 'true');
    };
    updateAuth();
    window.addEventListener('storage', updateAuth);
    window.addEventListener('op_auth_state_changed', updateAuth);
    window.addEventListener('op_auth_state_change', updateAuth);
    return () => {
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('op_auth_state_changed', updateAuth);
      window.removeEventListener('op_auth_state_change', updateAuth);
    };
  }, []);

  useEffect(() => {
    const syncTutorEnabled = () => {
      const savedProfile = localStorage.getItem('op_user_profile');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          if (p.tutorEnabled !== undefined) {
            setTutorEnabled(p.tutorEnabled);
          } else if (p.tutor_enabled !== undefined) {
            setTutorEnabled(p.tutor_enabled);
          } else {
            setTutorEnabled(true);
          }
        } catch (e) {
          setTutorEnabled(true);
        }
      } else {
        setTutorEnabled(true);
      }
    };
    syncTutorEnabled();
    window.addEventListener('op_accessibility_preferences_changed', syncTutorEnabled);
    window.addEventListener('storage', syncTutorEnabled);
    return () => {
      window.removeEventListener('op_accessibility_preferences_changed', syncTutorEnabled);
      window.removeEventListener('storage', syncTutorEnabled);
    };
  }, []);

  useEffect(() => {
    async function loadPersonalities() {
      const { data } = await dbService.getTutorPersonalities();
      if (data && data.length > 0) {
        setPersonalities(data);
        const syncActiveTutor = () => {
          const storedId = localStorage.getItem('op_active_tutor_personality') || 'socratic';
          const active = data.find(p => p.id === storedId);
          if (active) {
            setPersona(active.id);
          } else {
            const defaultPers = data.find(p => p.isDefault) || data[0];
            if (defaultPers) {
              setPersona(defaultPers.id);
              localStorage.setItem('op_active_tutor_personality', defaultPers.id);
            }
          }
        };

        syncActiveTutor();
        window.addEventListener('op_active_tutor_changed', syncActiveTutor);
        window.addEventListener('storage', syncActiveTutor);
        return () => {
          window.removeEventListener('op_active_tutor_changed', syncActiveTutor);
          window.removeEventListener('storage', syncActiveTutor);
        };
      }
    }
    loadPersonalities();
  }, []);

  const getPersonaName = (pId: string) => {
    const selected = personalities.find(p => p.id === pId);
    if (selected) {
      return selected.name;
    }
    return pId;
  };

  const handleSelectTutor = async (id: string) => {
    setPersona(id);
    localStorage.setItem('op_active_tutor_personality', id);
    window.dispatchEvent(new Event('op_active_tutor_changed'));
  };

  return {
    isLoggedIn,
    tutorEnabled,
    personalities,
    persona,
    getPersonaName,
    handleSelectTutor
  };
}
