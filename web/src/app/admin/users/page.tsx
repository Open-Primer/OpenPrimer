"use client";
 
import React, { useState, useEffect } from 'react';
import { dbService, UserProfile, UserRole } from '@/lib/db';
import { Search, UserCog, Shield, ShieldCheck, Mail, Calendar, ChevronRight, Ban, Trash2, Check, X, AlertCircle, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const renderSortIndicator = (field: string, currentField: string, currentDir: 'asc' | 'desc') => {
  if (field !== currentField) return <span className="ml-1 text-slate-700 hover:text-slate-400 cursor-pointer">⇅</span>;
  return currentDir === 'asc' ? <span className="ml-1 text-blue-400 cursor-pointer">▲</span> : <span className="ml-1 text-blue-400 cursor-pointer">▼</span>;
};
 
export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSortField, setUserSortField] = useState<string>('name');
  const [userSortDir, setUserSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [confirmingAction, setConfirmingAction] = useState<{ type: 'delete' | 'block' | 'role', userId: string, extra?: any } | null>(null);
  
  // Visual Create User states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newLang, setNewLang] = useState('EN');
  const [newReadingMode, setNewReadingMode] = useState('default');
  const [newUserError, setNewUserError] = useState<string | null>(null);
 
  useEffect(() => {
    loadUsers();
  }, []);
 
  const loadUsers = async () => {
    const { data } = await dbService.getUsers();
    setUsers(data);
  };
 
  const handleAction = async () => {
    if (!confirmingAction) return;
    const { type, userId, extra } = confirmingAction;
 
    if (type === 'delete') await dbService.deleteUser(userId);
    if (type === 'block') await dbService.toggleBlockUser(userId);
    if (type === 'role') await dbService.updateUserRole(userId, extra);
 
    setConfirmingAction(null);
    loadUsers();
  };
 
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewUserError(null);
 
    if (!newName.trim() || !newEmail.trim()) {
      setNewUserError("Name and Email are strictly required fields.");
      return;
    }
 
    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      setNewUserError("Please supply a valid corporate or academic email address.");
      return;
    }
 
    const generatedId = 'u_' + Date.now() + Math.random().toString(36).substr(2, 5);
    await dbService.createUser({
      id: generatedId,
      name: newName,
      email: newEmail,
      role: newRole,
      preferredLang: newLang,
      readingMode: newReadingMode
    });
 
    setIsAddUserOpen(false);
    setNewName('');
    setNewEmail('');
    setNewRole('student');
    setNewLang('EN');
    setNewReadingMode('default');
    loadUsers();
  };
 
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA = a[userSortField as keyof typeof a];
    let valB = b[userSortField as keyof typeof b];
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = (valB as string).toLowerCase();
    }
    if (valA === undefined) return 1;
    if (valB === undefined) return -1;
    if (valA < valB) return userSortDir === 'asc' ? -1 : 1;
    if (valA > valB) return userSortDir === 'asc' ? 1 : -1;
    return 0;
  });
 
  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-white">Identity Control</h1>
          <p className="text-slate-500 text-sm font-medium">Manage platform security and administrative roles.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => setIsAddUserOpen(true)}
            id="add-student-btn"
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Add Student
          </button>
          <div className="relative w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search students..." 
               className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-medium" 
             />
          </div>
        </div>
      </header>
 
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none" onClick={() => {
                if (userSortField === 'name') {
                  setUserSortDir(userSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setUserSortField('name');
                  setUserSortDir('asc');
                }
              }}>
                Identity {renderSortIndicator('name', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none" onClick={() => {
                if (userSortField === 'role') {
                  setUserSortDir(userSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setUserSortField('role');
                  setUserSortDir('asc');
                }
              }}>
                Privileges {renderSortIndicator('role', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none" onClick={() => {
                if (userSortField === 'level') {
                  setUserSortDir(userSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setUserSortField('level');
                  setUserSortDir('asc');
                }
              }}>
                Progress {renderSortIndicator('level', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none" onClick={() => {
                if (userSortField === 'isBlocked') {
                  setUserSortDir(userSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setUserSortField('isBlocked');
                  setUserSortDir('asc');
                }
              }}>
                Status {renderSortIndicator('isBlocked', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Access Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {sortedUsers.map((user) => (
              <tr key={user.id} className={`group transition-colors ${user.isBlocked ? 'bg-red-500/5' : 'hover:bg-slate-800/30'}`} data-testid={`user-row-${user.id}`}>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-slate-500">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${user.isBlocked ? 'text-red-400' : 'text-slate-100'}`} data-testid={`user-name-${user.id}`}>{user.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-slate-600 font-medium">{user.email}</p>
                        <span className="text-[8px] bg-slate-800/60 text-slate-400 border border-slate-700/30 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">{user.preferredLang || 'EN'}</span>
                        <span className="text-[8px] bg-slate-800/60 text-slate-400 border border-slate-700/30 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">{user.readingMode || 'default'}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <button 
                    onClick={() => setConfirmingAction({ type: 'role', userId: user.id, extra: user.role === 'admin' ? 'student' : 'admin' })}
                    className="flex items-center gap-2"
                   >
                     {user.role === 'admin' ? (
                       <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border border-blue-500/20">
                         <ShieldCheck className="w-3 h-3" /> Admin
                       </span>
                     ) : (
                       <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-500 text-[8px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors">Student</span>
                     )}
                   </button>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <p className="text-xs font-black text-slate-300">Lvl {user.level}</p>
                    <p className="text-[10px] text-slate-600 font-bold">{user.kp.toLocaleString()} KP</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <button 
                    onClick={async () => {
                      await dbService.toggleBlockUser(user.id);
                      loadUsers();
                    }}
                    className="flex items-center gap-2 outline-none cursor-pointer block-user-toggle"
                    data-testid={`block-btn-${user.id}`}
                    title={user.isBlocked ? "Click to Activate" : "Click to Block"}
                   >
                     {user.isBlocked ? (
                        <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-red-500/20 transition-colors" data-testid={`status-label-${user.id}`}>
                          <Ban className="w-3 h-3" /> Blocked
                        </span>
                     ) : (
                        <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-emerald-500/20 transition-colors" data-testid={`status-label-${user.id}`}>
                          <Check className="w-3 h-3" /> Active
                        </span>
                     )}
                   </button>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-2">
                     <button 
                      onClick={() => setConfirmingAction({ type: 'delete', userId: user.id })}
                      className="p-2 rounded-xl bg-slate-800 text-slate-500 hover:text-white hover:bg-red-650 transition-all delete-user-btn"
                      data-testid={`delete-btn-${user.id}`}
                      title="Delete User"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* CONFIRMATION ACTION MODAL */}
      <AnimatePresence>
        {confirmingAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmingAction(null)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm p-8 rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black mb-2 text-center text-white">Confirm Action</h3>
              <p className="text-slate-500 text-center text-xs mb-8">
                Are you sure you want to {confirmingAction.type} this user? This action may be irreversible.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setConfirmingAction(null)} className="py-4 rounded-2xl bg-slate-800 text-slate-300 font-black text-[10px] uppercase tracking-widest cursor-pointer">Cancel</button>
                <button onClick={handleAction} id="confirm-execute-btn" className="py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-widest cursor-pointer">Execute</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* ADD STUDENT MODAL */}
      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddUserOpen(false)} className="absolute inset-0 bg-slate-955/75 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-8 rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black uppercase tracking-wider text-white">Add New Student</h3>
                <button onClick={() => setIsAddUserOpen(false)} className="text-slate-500 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
 
              <form onSubmit={handleCreateUser} className="space-y-6">
                {newUserError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{newUserError}</span>
                  </div>
                )}
 
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">Full Name <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text"
                    id="student-name-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Jean Dupont"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-semibold"
                  />
                </div>
 
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="email"
                    id="student-email-input"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. jean.dupont@openprimer.org"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">System Role</label>
                  <select 
                    id="student-role-select"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold cursor-pointer"
                  >
                    <option value="student" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🎓 Student Profile (Default)</option>
                    <option value="admin" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🛡️ Administrator privileges</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">Language Preference</label>
                    <select 
                      id="student-lang-select"
                      value={newLang}
                      onChange={(e) => setNewLang(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold cursor-pointer"
                    >
                      <option value="EN" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🇺🇸 English (EN)</option>
                      <option value="FR" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🇫🇷 Français (FR)</option>
                      <option value="ES" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🇪🇸 Español (ES)</option>
                      <option value="DE" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🇩🇪 Deutsch (DE)</option>
                      <option value="ZH" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🇨🇳 中文 (ZH)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">Visual Theme</label>
                    <select 
                      id="student-theme-select"
                      value={newReadingMode}
                      onChange={(e) => setNewReadingMode(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold cursor-pointer"
                    >
                      <option value="default" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>✨ Default (Dark)</option>
                      <option value="paper" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>📜 Paper (Sepia)</option>
                      <option value="focus" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>👁️ Focus (Black)</option>
                    </select>
                  </div>
                </div>
 
                <button 
                  type="submit"
                  id="submit-student-btn"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/10 cursor-pointer active:scale-95 transition-all mt-4"
                >
                  Create Student Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
