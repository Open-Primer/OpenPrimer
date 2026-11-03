"use client";

import React from 'react';
import { Eye, Sliders, Volume2, Clock, Palette, CheckCircle } from 'lucide-react';
import { COLORBLIND_PALETTES } from '../settings-strings';

export interface AccessibilityTabProps {
  t: any;
  guide: any;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
  dyslexiaFriendly: boolean;
  setDyslexiaFriendly: (val: boolean) => void;
  fineVisualControls: boolean;
  setFineVisualControls: (val: boolean) => void;
  colorblindTheme: string;
  setColorblindTheme: (val: string) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (val: boolean) => void;
  extendAssessmentTime: boolean;
  setExtendAssessmentTime: (val: boolean) => void;
  syncAccessibilityToCloud: (updates: any) => Promise<void>;
}

export const AccessibilityTab: React.FC<AccessibilityTabProps> = ({
  t,
  guide,
  reduceMotion,
  setReduceMotion,
  dyslexiaFriendly,
  setDyslexiaFriendly,
  fineVisualControls,
  setFineVisualControls,
  colorblindTheme,
  setColorblindTheme,
  ttsEnabled,
  setTtsEnabled,
  extendAssessmentTime,
  setExtendAssessmentTime,
  syncAccessibilityToCloud,
}) => {
  return (
    <div className="space-y-8">
                  <div className="space-y-4">
                    {/* Reduce Motion */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-950/40 border border-slate-800 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.reduce_motion || ACC_TRANSLATIONS.EN.reduce_motion}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.reduce_motion_desc || ACC_TRANSLATIONS.EN.reduce_motion_desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !reduceMotion;
                          setReduceMotion(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.reduceMotion = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ reduceMotion: val });
                          }
                        }}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${reduceMotion ? 'bg-blue-600' : 'bg-slate-800 border border-slate-800'}`}
                        aria-checked={reduceMotion}
                        role="switch"
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${reduceMotion ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Dyslexia Layout */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-950/40 border border-slate-800 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.dyslexia || ACC_TRANSLATIONS.EN.dyslexia}
                        </span>
                        <p className="text-[11px] text-slate-550 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.dyslexia_desc || ACC_TRANSLATIONS.EN.dyslexia_desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !dyslexiaFriendly;
                          setDyslexiaFriendly(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.dyslexiaFriendly = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ dyslexiaFriendly: val });
                          }
                        }}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${dyslexiaFriendly ? 'bg-blue-600' : 'bg-slate-800 border border-slate-800'}`}
                        aria-checked={dyslexiaFriendly}
                        role="switch"
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${dyslexiaFriendly ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Fine Visual Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-955/40 border border-slate-800 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.visual_ctrl || ACC_TRANSLATIONS.EN.visual_ctrl}
                        </span>
                        <p className="text-[11px] text-slate-550 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.visual_ctrl_desc || ACC_TRANSLATIONS.EN.visual_ctrl_desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !fineVisualControls;
                          setFineVisualControls(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.fineVisualControls = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ fineVisualControls: val });
                          }
                        }}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${fineVisualControls ? 'bg-blue-600' : 'bg-slate-800 border border-slate-800'}`}
                        aria-checked={fineVisualControls}
                        role="switch"
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${fineVisualControls ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Enable Text-to-Speech (TTS) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-950/40 border border-slate-855 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.tts_toggle || ACC_TRANSLATIONS.EN.tts_toggle}
                        </span>
                        <p className="text-[11px] text-slate-550 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.tts_toggle_desc || ACC_TRANSLATIONS.EN.tts_toggle_desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !ttsEnabled;
                          setTtsEnabled(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.ttsEnabled = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ ttsEnabled: val });
                          }
                        }}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${ttsEnabled ? 'bg-blue-600' : 'bg-slate-800 border border-slate-800'}`}
                        aria-checked={ttsEnabled}
                        role="switch"
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${ttsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Extend Assessment Time Limits */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-950/40 border border-slate-800 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.extend_time || ACC_TRANSLATIONS.EN.extend_time}
                        </span>
                        <p className="text-[11px] text-slate-550 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.extend_time_desc || ACC_TRANSLATIONS.EN.extend_time_desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !extendAssessmentTime;
                          setExtendAssessmentTime(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.extendAssessmentTime = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ extendAssessmentTime: val });
                          }
                        }}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${extendAssessmentTime ? 'bg-blue-600' : 'bg-slate-800 border border-slate-800'}`}
                        aria-checked={extendAssessmentTime}
                        role="switch"
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${extendAssessmentTime ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Colorblind Filtering Themes */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-950/40 border border-slate-800 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.colorblind || ACC_TRANSLATIONS.EN.colorblind}
                        </span>
                        <p className="text-[11px] text-slate-550 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.colorblind_desc || ACC_TRANSLATIONS.EN.colorblind_desc}
                        </p>
                      </div>
                      <select
                        value={colorblindTheme}
                        onChange={(e) => {
                          const val = e.target.value;
                          setColorblindTheme(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.colorblindTheme = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ colorblindTheme: val });
                          }
                        }}
                        className="bg-slate-900 border border-slate-800 text-slate-200 py-2.5 px-4 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none min-w-[200px]"
                      >
                        <option value="none">{ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.cb_none || ACC_TRANSLATIONS.EN.cb_none}</option>
                        <option value="protanopia">{ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.cb_protanopia || ACC_TRANSLATIONS.EN.cb_protanopia}</option>
                        <option value="deuteranopia">{ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.cb_deuteranopia || ACC_TRANSLATIONS.EN.cb_deuteranopia}</option>
                        <option value="tritanopia">{ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.cb_tritanopia || ACC_TRANSLATIONS.EN.cb_tritanopia}</option>
                        <option value="achromatopsia">{ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.cb_achromatopsia || ACC_TRANSLATIONS.EN.cb_achromatopsia}</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-slate-800/60" />

                  {/* Accessibility Explanatory Guide */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" /> {guide.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 italic ml-6">{guide.subtitle}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-2">
                      <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200 flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5 text-violet-500" /> {guide.visual}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{guide.visual_desc}</p>
                      </div>

                      <div className="p-5 bg-slate-955/40 border border-slate-800 rounded-2xl space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200 flex items-center gap-2">
                          <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> {guide.auditory}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{guide.auditory_desc}</p>
                      </div>

                      <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200 flex items-center gap-2">
                          <Keyboard className="w-3.5 h-3.5 text-blue-500" /> {guide.keyboard}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed mb-2">{guide.keyboard_desc}</p>
                        <ul className="text-[9px] font-bold text-slate-300 space-y-1.5 list-none pl-1">
                          <li className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">Ôîÿ</span> {guide.key_home}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">Ôîÿ</span> {guide.key_catalog}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">Ôîÿ</span> {guide.key_settings}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">Ôîÿ</span> {guide.key_admin}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-900"><span className="text-amber-500 font-mono">Ôîÿ</span> {guide.key_theme}</li>
                        </ul>
                      </div>

                      <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200 flex items-center gap-2">
                          <BrainIcon className="w-3.5 h-3.5 text-amber-500" /> {guide.cognitive}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{guide.cognitive_desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
  );
};
