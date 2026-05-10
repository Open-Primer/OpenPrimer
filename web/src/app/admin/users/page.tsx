"use client";

import React, { useState, useEffect } from 'react';
import { dbService, UserProfile, UserRole } from '@/lib/db';
import { Search, UserCog, Shield, ShieldCheck, Mail, Calendar, ChevronRight, Ban, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [confirmingAction, setConfirmingAction] = useState<{ type: 'delete' | 'block' | 'role', userId: string, extra?: any } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await dbService.getUsers();
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

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-white">Identity Control</h1>
          <p className="text-slate-500 text-sm font-medium">Manage platform security and administrative roles.</p>
        </div>
        <div className="relative w-72">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
           <input 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Search students..." 
             className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all" 
           />
        </div>
      </header>

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Identity</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Privileges</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Progress</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Access Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {filteredUsers.map((user) => (
              <tr key={user.id} className={`group transition-colors ${user.isBlocked ? 'bg-red-500/5' : 'hover:bg-slate-800/30'}`}>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-slate-500">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${user.isBlocked ? 'text-red-400' : 'text-slate-100'}`}>{user.name}</p>
                      <p className="text-[10px] text-slate-600 font-medium">{user.email}</p>
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
                   <div className="flex items-center gap-2">
                     {user.isBlocked ? (
                        <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                          <Ban className="w-3 h-3" /> Blocked
                        </span>
                     ) : (
                        <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                     )}
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-2">
                     <button 
                      onClick={() => setConfirmingAction({ type: 'block', userId: user.id })}
                      className={`p-2 rounded-xl transition-all ${user.isBlocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-500/10'}`}
                      title={user.isBlocked ? "Unblock" : "Block"}
                     >
                       <Ban className="w-4 h-4" />
                     </button>
                     <button 
                      onClick={() => setConfirmingAction({ type: 'delete', userId: user.id })}
                      className="p-2 rounded-xl bg-slate-800 text-slate-500 hover:text-white hover:bg-red-600 transition-all"
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

      {/* CONFIRMATION MODAL */}
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
                <button onClick={() => setConfirmingAction(null)} className="py-4 rounded-2xl bg-slate-800 text-slate-300 font-black text-[10px] uppercase tracking-widest">Cancel</button>
                <button onClick={handleAction} className="py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-widest">Execute</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
