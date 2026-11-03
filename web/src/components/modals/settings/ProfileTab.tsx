"use client";

import React from 'react';
import { User, Mail, GraduationCap, Lock, Eye, EyeOff, ShieldCheck, Check, X, Loader2 } from 'lucide-react';

export interface ProfileTabProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    studyLevel: string;
  };
  setUser: React.Dispatch<React.SetStateAction<any>>;
  saveProfile: (e: React.FormEvent) => void;
  t: any;
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (val: string) => void;
  showCurrentPassword: boolean;
  setShowCurrentPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showNewPassword: boolean;
  setShowNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmNewPassword: boolean;
  setShowConfirmNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isNewPasswordFocused: boolean;
  setIsNewPasswordFocused: (val: boolean) => void;
  pwdError: string | null;
  pwdSuccess: string | null;
  pwdLoading: boolean;
  handlePasswordChange: (e: React.FormEvent) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  setUser,
  saveProfile,
  t,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmNewPassword,
  setShowConfirmNewPassword,
  isNewPasswordFocused,
  setIsNewPasswordFocused,
  pwdError,
  pwdSuccess,
  pwdLoading,
  handlePasswordChange,
}) => {
  return (
    <div className="space-y-8">
                  {/* Personal info form */}
                  <form onSubmit={saveProfile} className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                      <User className="w-4 h-4 text-blue-400" /> {t.personal_info || "Informations Personnelles"}
                    </h3>
                    
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold tracking-wide flex items-center gap-3">
                        <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                          {t.first_name || "Pr├®nom"} <span className="text-[8px] text-slate-500 lowercase">({OPTIONAL_LABEL[lang.toUpperCase()] || OPTIONAL_LABEL.EN})</span>
                        </label>
                        <input 
                          type="text" 
                          value={user.firstName}
                          onChange={(e) => setUser({...user, firstName: e.target.value})}
                          placeholder={NOT_PROVIDED_PLACEHOLDER[lang.toUpperCase()] || NOT_PROVIDED_PLACEHOLDER.EN}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-650" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                          {t.last_name || "Nom"} <span className="text-[8px] text-slate-500 lowercase">({OPTIONAL_LABEL[lang.toUpperCase()] || OPTIONAL_LABEL.EN})</span>
                        </label>
                        <input 
                          type="text" 
                          value={user.lastName}
                          onChange={(e) => setUser({...user, lastName: e.target.value})}
                          placeholder={NOT_PROVIDED_PLACEHOLDER[lang.toUpperCase()] || NOT_PROVIDED_PLACEHOLDER.EN}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-650" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">{t.email_addr || "Adresse e-mail"}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                        <input 
                          type="email" 
                          value={user.email}
                          disabled
                          className="w-full bg-slate-950/30 border border-slate-900 rounded-2xl p-4 pl-12 text-sm text-slate-500 cursor-not-allowed" 
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button type="submit" className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 cursor-pointer">
                        <Save className="w-4 h-4" /> {t.save_changes || "Sauvegarder"}
                      </button>
                    </div>
                  </form>

                  <hr className="border-slate-800/60" />

                  {/* Change Password form */}
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    {/* Hidden username context for password managers to know which account's credentials are changing */}
                    <input 
                      type="text" 
                      name="username" 
                      value={user.email} 
                      autoComplete="username" 
                      className="hidden" 
                      readOnly 
                    />

                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                      <Lock className="w-4 h-4 text-violet-400" /> {PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.section_title || PWD_TRANSLATIONS.EN.section_title}
                    </h3>
                    
                    {pwdError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold tracking-wide flex items-center gap-3">
                        <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                        <span>{pwdError}</span>
                      </div>
                    )}

                    {pwdSuccess && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-semibold tracking-wide flex items-center gap-3">
                        <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>{pwdSuccess}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                        {PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.current_password || PWD_TRANSLATIONS.EN.current_password}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                        <input 
                          id="current-password-input"
                          type={showCurrentPassword ? "text" : "password"} 
                          autoComplete="current-password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder={PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.pwd_placeholder || PWD_TRANSLATIONS.EN.pwd_placeholder}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-700" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-4 text-slate-600 hover:text-slate-400 transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                          {PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.new_password || PWD_TRANSLATIONS.EN.new_password}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                          <input 
                            id="new-password-input"
                            type={showNewPassword ? "text" : "password"} 
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onFocus={() => setIsNewPasswordFocused(true)}
                            placeholder={PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.pwd_placeholder || PWD_TRANSLATIONS.EN.pwd_placeholder}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-700" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-4 text-slate-650 hover:text-slate-400 transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                          {PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.confirm_new_password || PWD_TRANSLATIONS.EN.confirm_new_password}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                          <input 
                            id="confirm-password-input"
                            type={showConfirmNewPassword ? "text" : "password"} 
                            autoComplete="new-password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder={PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.pwd_placeholder || PWD_TRANSLATIONS.EN.pwd_placeholder}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-700" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute right-4 top-4 text-slate-655 hover:text-slate-400 transition-colors"
                          >
                            {showConfirmNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {(isNewPasswordFocused || newPassword.length > 0) && (
                      <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-3xl mt-4">
                        <PasswordRequirements 
                          password={newPassword} 
                          confirmPassword={confirmNewPassword} 
                          lang={lang}
                        />
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button 
                        id="update-password-btn"
                        type="submit" 
                        disabled={pwdLoading}
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 cursor-pointer"
                      >
                        <Save className="w-4 h-4" /> 
                        {pwdLoading ? "..." : (PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.update_password || PWD_TRANSLATIONS.EN.update_password)}
                      </button>
                    </div>
                  </form>
                </div>
  );
};
