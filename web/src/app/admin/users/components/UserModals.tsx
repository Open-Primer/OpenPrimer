"use client";

import React, { useState } from 'react';
import { dbService, UserProfile, UserRole } from '@/lib/db';
import { Ban, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PasswordRequirements } from '@/components/PasswordRequirements';
import {
  VANGUARD_LOCK_MSG,
  VANGUARD_LOCK_TITLE,
  DELETE_OWN_WARN,
  getDeleteTitle
} from './usersStrings';

export interface UserModalsProps {
  lang: string;
  globalLang: any;
  t: any;
  users: UserProfile[];
  currentUser: UserProfile | null;
  confirmingAction: { type: 'delete' | 'block' | 'role' | 'vanguard_locked'; userId: string; extra?: any } | null;
  setConfirmingAction: React.Dispatch<React.SetStateAction<{ type: 'delete' | 'block' | 'role' | 'vanguard_locked'; userId: string; extra?: any } | null>>;
  handleAction: () => Promise<void>;
  isAddUserOpen: boolean;
  setIsAddUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadUsers: () => Promise<void>;
}

export const UserModals: React.FC<UserModalsProps> = ({
  lang,
  globalLang,
  t,
  users,
  currentUser,
  confirmingAction,
  setConfirmingAction,
  handleAction,
  isAddUserOpen,
  setIsAddUserOpen,
  loadUsers
}) => {
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newLang, setNewLang] = useState('EN');
  const [newReadingMode, setNewReadingMode] = useState('default');
  const [newUserError, setNewUserError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewUserError(null);

    if (!newFirstName.trim() || !newLastName.trim() || !newEmail.trim()) {
      setNewUserError(t.error_required);
      return;
    }

    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      setNewUserError(t.error_email);
      return;
    }

    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=._\-\[\]{}()]).{12,}$/;
    if (!newPassword || !PASSWORD_REGEX.test(newPassword)) {
      setNewUserError(t.error_password);
      return;
    }

    const fullName = `${newFirstName.trim()} ${newLastName.trim()}`;
    const generatedId = 'u_' + Date.now() + Math.random().toString(36).substr(2, 5);
    await dbService.createUser({
      id: generatedId,
      name: fullName,
      email: newEmail,
      role: newRole,
      preferredLang: newLang,
      readingMode: newReadingMode,
      password: newPassword
    });

    setIsAddUserOpen(false);
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewPassword('');
    setShowNewPassword(false);
    setNewRole('student');
    setNewLang('EN');
    setNewReadingMode('default');
    loadUsers();
  };

  return (
    <>
      {/* CONFIRMATION ACTION MODAL */}
      <AnimatePresence>
        {confirmingAction && (() => {
          const targetUser = users.find(u => u.id === confirmingAction.userId);
          const isOwnAccount = currentUser && currentUser.id === confirmingAction.userId;
          
          if (confirmingAction.type === 'vanguard_locked') {
            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmingAction(null)} className="absolute inset-0 modal-overlay" />
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="relative w-full max-w-sm p-8 rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 mx-auto">
                    <Ban className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black mb-2 text-center text-white">{VANGUARD_LOCK_TITLE[lang] || VANGUARD_LOCK_TITLE.EN}</h3>
                  <p className="text-slate-400 text-center text-xs mb-8 leading-relaxed">
                    {VANGUARD_LOCK_MSG[lang] || VANGUARD_LOCK_MSG.EN}
                  </p>
                  <div className="flex justify-center">
                    <button onClick={() => setConfirmingAction(null)} className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-black text-[10px] uppercase tracking-widest cursor-pointer">OK</button>
                  </div>
                </motion.div>
              </div>
            );
          }

          const title = confirmingAction.type === 'delete' && targetUser 
            ? getDeleteTitle(targetUser.name, lang) 
            : t.confirm_title;

          const message = confirmingAction.type === 'delete' && isOwnAccount
            ? (DELETE_OWN_WARN[lang] || DELETE_OWN_WARN.EN)
            : t.confirm_msg;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmingAction(null)} className="absolute inset-0 modal-overlay" />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-sm p-8 rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-2 text-center text-white">{title}</h3>
                <p className="text-slate-450 text-center text-xs mb-8 leading-relaxed">
                  {message}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setConfirmingAction(null)} className="py-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-350 font-black text-[10px] uppercase tracking-widest cursor-pointer">{t.cancel}</button>
                  <button onClick={handleAction} id="confirm-execute-btn" className="py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-widest cursor-pointer">{t.execute}</button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ADD STUDENT MODAL */}
      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddUserOpen(false)} className="absolute inset-0 modal-overlay" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-8 rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black uppercase tracking-wider text-white">{t.add_title}</h3>
                <button onClick={() => setIsAddUserOpen(false)} className="text-slate-500 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-6" autoComplete="off">
                {newUserError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{newUserError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.first_name} <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text"
                      id="student-firstname-input"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      placeholder="e.g. Jean"
                      autoComplete="new-name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.last_name} <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text"
                      id="student-lastname-input"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      placeholder="e.g. Dupont"
                      autoComplete="new-name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.email_address} <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="email"
                    id="student-email-input"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. jean.dupont@openprimer.app"
                    autoComplete="new-email"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.password} <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      required
                      type={showNewPassword ? 'text' : 'password'}
                      id="student-password-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setIsNewPasswordFocused(true)}
                      onBlur={() => setIsNewPasswordFocused(false)}
                      placeholder="••••••••••••"
                      autoComplete="new-password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pr-16 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white outline-none focus:outline-none cursor-pointer flex items-center justify-center"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <PasswordRequirements 
                    password={newPassword}
                    lang={globalLang}
                    isFocused={isNewPasswordFocused}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.system_role}</label>
                  <select 
                    id="student-role-select"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold cursor-pointer"
                  >
                    <option value="student">{t.student_opt}</option>
                    <option value="admin">{t.admin_opt}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.lang_pref}</label>
                    <select 
                      id="student-lang-select"
                      value={newLang}
                      onChange={(e) => setNewLang(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold cursor-pointer"
                    >
                      <option value="EN">🇺🇸 English (EN)</option>
                      <option value="FR">🇫🇷 Français (FR)</option>
                      <option value="ES">🇪🇸 Español (ES)</option>
                      <option value="DE">🇩🇪 Deutsch (DE)</option>
                      <option value="ZH">🇨🇳 中文 (ZH)</option>
                      <option value="PT">🇧🇷 Português (PT)</option>
                      <option value="AR">🇸🇦 العربية (AR)</option>
                      <option value="HI">🇮🇳 हिन्दी (HI)</option>
                      <option value="UR">🇵🇰 اردو (UR)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.visual_theme}</label>
                    <select 
                      id="student-theme-select"
                      value={newReadingMode}
                      onChange={(e) => setNewReadingMode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold cursor-pointer"
                    >
                      <option value="default">{t.theme_default}</option>
                      <option value="paper">{t.theme_paper}</option>
                      <option value="focus">{t.theme_focus}</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  id="submit-student-btn"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/10 cursor-pointer active:scale-95 transition-all mt-4"
                >
                  {t.create_profile}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
