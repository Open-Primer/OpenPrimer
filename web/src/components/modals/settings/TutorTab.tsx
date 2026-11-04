"use client";

import React from 'react';
import { Bot, CheckCircle, Key, Cpu, Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ACC_TRANSLATIONS, PERSONAL_TUTOR_TRANSLATIONS } from '../settings-strings';

export interface TutorTabProps {
  t: any;
  tutorEnabled: boolean;
  setTutorEnabled: (val: boolean) => void;
  tutorType: 'internal' | 'personal';
  setTutorType: (val: 'internal' | 'personal') => void;
  personalTutorProvider: 'openai' | 'anthropic' | 'gemini' | 'groq' | 'mistral';
  setPersonalTutorProvider: (val: any) => void;
  personalTutorApiKey: string;
  setPersonalTutorApiKey: (val: string) => void;
  personalTutorModel: string;
  setPersonalTutorModel: (val: string) => void;
  testStatus: 'idle' | 'loading' | 'success' | 'error';
  setTestStatus: (val: 'idle' | 'loading' | 'success' | 'error') => void;
  testTutorConnection: () => Promise<void>;
  saveTutorSettings: () => void;
  syncAccessibilityToCloud: (updates: any) => Promise<void>;
}

export const TutorTab: React.FC<TutorTabProps> = ({
  t,
  tutorEnabled,
  setTutorEnabled,
  tutorType,
  setTutorType,
  personalTutorProvider,
  setPersonalTutorProvider,
  personalTutorApiKey,
  setPersonalTutorApiKey,
  personalTutorModel,
  setPersonalTutorModel,
  testStatus,
  setTestStatus,
  testTutorConnection,
  saveTutorSettings,
  syncAccessibilityToCloud,
}) => {
  const { language: lang } = useLanguage();
  return (
    <div className="space-y-6">
                  {/* Enable AI Tutor global toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-955/40 border border-slate-800 rounded-3xl">
                    <div className="space-y-1">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                        {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.tutor_toggle || ACC_TRANSLATIONS.EN.tutor_toggle}
                      </span>
                      <p className="text-[11px] text-slate-550 leading-normal">
                        {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.tutor_toggle_desc || ACC_TRANSLATIONS.EN.tutor_toggle_desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const val = !tutorEnabled;
                        setTutorEnabled(val);
                        const savedProfile = localStorage.getItem('op_user_profile');
                        if (savedProfile) {
                          const p = JSON.parse(savedProfile);
                          p.tutorEnabled = val;
                          localStorage.setItem('op_user_profile', JSON.stringify(p));
                          window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                          syncAccessibilityToCloud({ tutorEnabled: val });
                        }
                      }}
                      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${tutorEnabled ? 'bg-blue-600' : 'bg-slate-800 border border-slate-800'}`}
                      aria-checked={tutorEnabled}
                      role="switch"
                    >
                      <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${tutorEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {tutorEnabled && (
                    <div className="flex flex-col gap-6 p-5 bg-slate-950/20 border border-slate-800 rounded-3xl">
                      {/* Tutor details settings */}
                      <div className="space-y-2">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.title || PERSONAL_TUTOR_TRANSLATIONS.EN.title}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.desc || PERSONAL_TUTOR_TRANSLATIONS.EN.desc}
                        </p>
                      </div>

                      {/* Pros & Cons card */}
                      <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl text-[10px] space-y-1.5">
                        <p className="text-emerald-400 font-bold leading-normal">
                          Ô£ô {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.advantages || PERSONAL_TUTOR_TRANSLATIONS.EN.advantages}
                        </p>
                        <p className="text-amber-400 font-bold leading-normal">
                          ÔÜá {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.disadvantages || PERSONAL_TUTOR_TRANSLATIONS.EN.disadvantages}
                        </p>
                      </div>

                      {/* Tutor Engine choice radio buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="flex-1 flex items-center gap-3 p-4 bg-slate-950/50 border border-slate-855 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
                          <input
                            type="radio"
                            name="modalTutorType"
                            value="internal"
                            checked={tutorType === 'internal'}
                            onChange={() => {
                              setTutorType('internal');
                              const savedProfile = localStorage.getItem('op_user_profile');
                              if (savedProfile) {
                                const p = JSON.parse(savedProfile);
                                p.tutorType = 'internal';
                                localStorage.setItem('op_user_profile', JSON.stringify(p));
                                window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-800 bg-slate-900 cursor-pointer"
                          />
                          <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                            {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.type_internal || PERSONAL_TUTOR_TRANSLATIONS.EN.type_internal}
                          </span>
                        </label>

                        <label className="flex-1 flex items-center gap-3 p-4 bg-slate-955/50 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
                          <input
                            type="radio"
                            name="modalTutorType"
                            value="personal"
                            checked={tutorType === 'personal'}
                            onChange={() => {
                              setTutorType('personal');
                              const savedProfile = localStorage.getItem('op_user_profile');
                              if (savedProfile) {
                                const p = JSON.parse(savedProfile);
                                p.tutorType = 'personal';
                                localStorage.setItem('op_user_profile', JSON.stringify(p));
                                window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-800 bg-slate-900 cursor-pointer"
                          />
                          <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                            {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.type_personal || PERSONAL_TUTOR_TRANSLATIONS.EN.type_personal}
                          </span>
                        </label>
                      </div>

                      {/* Custom API Configuration Block */}
                      {tutorType === 'personal' && (
                        <div className="space-y-4 pt-4 border-t border-slate-900">
                          {/* Provider Selector */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.provider || PERSONAL_TUTOR_TRANSLATIONS.EN.provider}
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                              {(['openai', 'anthropic', 'gemini'] as const).map((prov) => (
                                <button
                                  key={prov}
                                  type="button"
                                  onClick={() => {
                                    setPersonalTutorProvider(prov);
                                    setTestStatus('idle');
                                    if (prov === 'openai') setPersonalTutorModel('gpt-4o-mini');
                                    if (prov === 'anthropic') setPersonalTutorModel('claude-3-5-haiku-20241022');
                                    if (prov === 'gemini') setPersonalTutorModel('gemini-3.5-flash-lite');
                                  }}
                                  className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${personalTutorProvider === prov ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                                >
                                  {prov === 'openai' ? 'OpenAI' : prov === 'anthropic' ? 'Anthropic' : 'Gemini'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Model Select */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.model || PERSONAL_TUTOR_TRANSLATIONS.EN.model}
                            </label>
                            <select
                              value={personalTutorModel}
                              onChange={(e) => {
                                setPersonalTutorModel(e.target.value);
                                setTestStatus('idle');
                              }}
                              className="bg-slate-900 border border-slate-800 text-slate-200 py-2.5 px-4 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none w-full"
                            >
                              {personalTutorProvider === 'openai' && (
                                <>
                                  <option value="gpt-4o-mini">GPT-4o Mini (Recommand├® - ├ëconomique)</option>
                                  <option value="gpt-4o">GPT-4o (Cr├®atif - Plus co├╗teux)</option>
                                </>
                              )}
                              {personalTutorProvider === 'anthropic' && (
                                <>
                                  <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Rapide & Pr├®cis)</option>
                                  <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Qualit├® maximale)</option>
                                </>
                              )}
                              {personalTutorProvider === 'gemini' && (
                                <>
                                  <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite (Recommand├® - ├ëconomique)</option>
                                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Raisonnement pouss├®)</option>
                                </>
                              )}
                            </select>
                          </div>

                          {/* API Key */}
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.api_key || PERSONAL_TUTOR_TRANSLATIONS.EN.api_key}
                              </label>
                              <div className="text-[10px] font-medium text-slate-550">
                                {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.get_key || PERSONAL_TUTOR_TRANSLATIONS.EN.get_key}{' '}
                                {personalTutorProvider === 'openai' && (
                                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.openai_platform || PERSONAL_TUTOR_TRANSLATIONS.EN.openai_platform} Ôåù
                                  </a>
                                )}
                                {personalTutorProvider === 'anthropic' && (
                                  <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.anthropic_console || PERSONAL_TUTOR_TRANSLATIONS.EN.anthropic_console} Ôåù
                                  </a>
                                )}
                                {personalTutorProvider === 'gemini' && (
                                  <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.gemini_studio || PERSONAL_TUTOR_TRANSLATIONS.EN.gemini_studio} Ôåù
                                  </a>
                                )}
                              </div>
                            </div>
                            <input
                              type="password"
                              value={personalTutorApiKey}
                              onChange={(e) => {
                                setPersonalTutorApiKey(e.target.value);
                                setTestStatus('idle');
                              }}
                              placeholder={PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.api_key_placeholder || PERSONAL_TUTOR_TRANSLATIONS.EN.api_key_placeholder}
                              className="bg-slate-900 border border-slate-800 text-slate-200 py-2.5 px-4 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none w-full"
                            />
                          </div>

                          {/* Test connection & Save keys */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                disabled={testStatus === 'loading' || !personalTutorApiKey}
                                onClick={async () => {
                                  setTestStatus('loading');
                                  try {
                                    let token: string | undefined;
                                    try {
                                      const { supabase } = await import("@/lib/supabase");
                                      const { data: { session } } = await supabase.auth.getSession();
                                      token = session?.access_token;
                                    } catch (err) {}

                                    const res = await fetch('/api/tutor/test-connection', {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                                      },
                                      body: JSON.stringify({
                                        provider: personalTutorProvider,
                                        apiKey: personalTutorApiKey,
                                        model: personalTutorModel
                                      })
                                    });
                                    const data = await res.json();
                                    if (res.ok && data.success) {
                                      setTestStatus('success');
                                    } else {
                                      setTestStatus('error');
                                    }
                                  } catch (e) {
                                    setTestStatus('error');
                                  }
                                }}
                                className={`py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${testStatus === 'loading' ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' : !personalTutorApiKey ? 'bg-slate-900 border-slate-800 text-slate-650 cursor-not-allowed' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white cursor-pointer'}`}
                              >
                                {testStatus === 'loading'
                                  ? (PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.test_loading || PERSONAL_TUTOR_TRANSLATIONS.EN.test_loading)
                                  : (PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.test_connection || PERSONAL_TUTOR_TRANSLATIONS.EN.test_connection)}
                              </button>

                              {testStatus === 'success' && (
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-fade-in">
                                  Ô£ô {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.test_success || PERSONAL_TUTOR_TRANSLATIONS.EN.test_success}
                                </span>
                              )}

                              {testStatus === 'error' && (
                                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 animate-fade-in">
                                  ÔÜá {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.test_error || PERSONAL_TUTOR_TRANSLATIONS.EN.test_error}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
  );
};
