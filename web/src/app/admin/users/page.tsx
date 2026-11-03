"use client";

import React, { useState, useEffect } from 'react';
import { dbService, UserProfile } from '@/lib/db';
import { Search, UserCog, ShieldCheck, Ban, Trash2, Check, PlusCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  USERS_STRINGS,
  VANGUARD_LOCK_TITLE,
  ACTIVATE_TITLE,
  BLOCK_TITLE,
  DELETE_USER_TITLE
} from './components/usersStrings';
import { UserModals } from './components/UserModals';

const renderSortIndicator = (field: string, currentField: string, currentDir: 'asc' | 'desc') => {
  if (field !== currentField) return <span className="ml-1 text-slate-700 hover:text-slate-400 cursor-pointer">⇅</span>;
  return currentDir === 'asc' ? <span className="ml-1 text-blue-400 cursor-pointer">▲</span> : <span className="ml-1 text-blue-400 cursor-pointer">▼</span>;
};

export default function AdminUsers() {
  const { language: globalLang } = useLanguage();
  const lang = (globalLang || 'EN') as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR';
  const t = USERS_STRINGS[lang] || USERS_STRINGS.EN;

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSortField, setUserSortField] = useState<string>('name');
  const [userSortDir, setUserSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [confirmingAction, setConfirmingAction] = useState<{ type: 'delete' | 'block' | 'role' | 'vanguard_locked'; userId: string; extra?: any } | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('op_user_profile');
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data } = await dbService.getUsers();
    setUsers(data || []);
  };

  const handleAction = async () => {
    if (!confirmingAction) return;
    const { type, userId, extra } = confirmingAction;

    if (type === 'delete') {
      await dbService.deleteUser(userId);
      if (currentUser && currentUser.id === userId) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('op_session');
          localStorage.removeItem('op_user_profile');
          window.location.href = '/';
          return;
        }
      }
    }
    if (type === 'block') await dbService.toggleBlockUser(userId);
    if (type === 'role') await dbService.updateUserRole(userId, extra);

    setConfirmingAction(null);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
            <UserCog className="w-8 h-8 text-blue-500" />
            {t.title}
          </h1>
          <p className="text-xs text-slate-400 font-medium">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => setIsAddUserOpen(true)}
            id="add-student-btn"
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> {t.add_student}
          </button>
          <div className="relative w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder={t.search_placeholder} 
               className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-medium" 
             />
          </div>
        </div>
      </div>

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
                {t.col_identity} {renderSortIndicator('name', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none" onClick={() => {
                if (userSortField === 'role') {
                  setUserSortDir(userSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setUserSortField('role');
                  setUserSortDir('asc');
                }
              }}>
                {t.col_privileges} {renderSortIndicator('role', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none" onClick={() => {
                if (userSortField === 'level') {
                  setUserSortDir(userSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setUserSortField('level');
                  setUserSortDir('asc');
                }
              }}>
                {t.col_progress} {renderSortIndicator('level', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none" onClick={() => {
                if (userSortField === 'isBlocked') {
                  setUserSortDir(userSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setUserSortField('isBlocked');
                  setUserSortDir('asc');
                }
              }}>
                {t.col_status} {renderSortIndicator('isBlocked', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">{t.col_access}</th>
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
                      <p className={`text-sm font-bold ${user.isBlocked ? 'text-red-400' : 'text-foreground'}`} data-testid={`user-name-${user.id}`}>{user.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-slate-600 font-medium">{user.email}</p>
                        <span className="text-[8px] bg-slate-800/60 text-slate-400 border border-slate-700/30 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">{user.preferredLang || 'EN'}</span>
                        {user.readingMode && user.readingMode !== 'default' && (
                          <span className="text-[8px] bg-slate-800/60 text-slate-400 border border-slate-700/30 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">{user.readingMode}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <button 
                    onClick={() => {
                      if (user.email?.toLowerCase() === 'vanguard.mysterious@gmail.com') {
                        setConfirmingAction({ type: 'vanguard_locked', userId: user.id });
                      } else {
                        setConfirmingAction({ type: 'role', userId: user.id, extra: user.role === 'admin' ? 'student' : 'admin' });
                      }
                    }}
                    className="flex items-center gap-2"
                   >
                     {user.role === 'admin' ? (
                       <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border border-blue-500/20">
                         <ShieldCheck className="w-3 h-3" /> {t.admin_role}
                       </span>
                     ) : (
                       <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-500 text-[8px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors">{t.student_role}</span>
                     )}
                   </button>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <p className="text-xs font-black text-slate-300">
                      {(() => {
                        const totalMins = Math.round(user.kp / 10);
                        const hrs = Math.floor(totalMins / 60);
                        const mins = totalMins % 60;
                        return `${hrs}h ${mins}m`;
                      })()}
                    </p>
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
                    title={user.isBlocked 
                      ? (ACTIVATE_TITLE[lang] || ACTIVATE_TITLE.EN)
                      : (BLOCK_TITLE[lang] || BLOCK_TITLE.EN)}
                   >
                     {user.isBlocked ? (
                        <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-red-500/20 transition-colors" data-testid={`status-label-${user.id}`}>
                          <Ban className="w-3 h-3" /> {t.status_blocked}
                        </span>
                     ) : (
                        <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-emerald-500/20 transition-colors" data-testid={`status-label-${user.id}`}>
                          <Check className="w-3 h-3" /> {t.status_active}
                        </span>
                     )}
                   </button>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-2">
                     {user.email?.toLowerCase() === 'vanguard.mysterious@gmail.com' ? (
                       <button 
                        onClick={() => setConfirmingAction({ type: 'vanguard_locked', userId: user.id })}
                        className="p-2 rounded-xl bg-slate-900 border border-red-500/20 text-red-500/40 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer flex items-center justify-center relative group"
                        title={VANGUARD_LOCK_TITLE[lang] || VANGUARD_LOCK_TITLE.EN}
                       >
                         <Trash2 className="w-4 h-4 opacity-50" />
                         <Ban className="w-2.5 h-2.5 absolute text-red-500 bg-slate-900 rounded-full" style={{ bottom: '2px', right: '2px' }} />
                       </button>
                     ) : (
                       <button 
                        onClick={() => setConfirmingAction({ type: 'delete', userId: user.id })}
                        className="p-2 rounded-xl bg-slate-800 text-slate-500 hover:text-white hover:bg-red-650 transition-all delete-user-btn cursor-pointer"
                        data-testid={`delete-btn-${user.id}`}
                        title={DELETE_USER_TITLE[lang] || DELETE_USER_TITLE.EN}
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserModals
        lang={lang}
        globalLang={globalLang}
        t={t}
        users={users}
        currentUser={currentUser}
        confirmingAction={confirmingAction}
        setConfirmingAction={setConfirmingAction}
        handleAction={handleAction}
        isAddUserOpen={isAddUserOpen}
        setIsAddUserOpen={setIsAddUserOpen}
        loadUsers={loadUsers}
      />
    </div>
  );
}
