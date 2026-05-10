"use client";

import React, { useState, useEffect } from 'react';
import { dbService, UserProfile, UserRole } from '@/lib/db';
import { Search, UserCog, Shield, ShieldCheck, Mail, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dbService.getUsers().then(setUsers);
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: UserRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    await dbService.updateUserRole(userId, newRole);
    setUsers(await dbService.getUsers());
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-white">User Management</h1>
          <p className="text-slate-500 text-sm font-medium">Control access and roles across the platform.</p>
        </div>
        <div className="relative w-72">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
           <input 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Search by name or email..." 
             className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all" 
           />
        </div>
      </header>

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">User</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Level / KP</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Joined</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-xs font-black text-slate-400">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-100">{user.name}</p>
                      <p className="text-[10px] text-slate-600 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                     {user.role === 'admin' ? (
                       <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                         <ShieldCheck className="w-3 h-3" /> Admin
                       </span>
                     ) : (
                       <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-500 text-[8px] font-black uppercase tracking-widest">Student</span>
                     )}
                     {user.isEmailVerified ? (
                       <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Verified" />
                     ) : (
                       <span className="w-2 h-2 rounded-full bg-slate-700" title="Unverified" />
                     )}
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <p className="text-xs font-black text-slate-300">Lvl {user.level}</p>
                    <p className="text-[10px] text-slate-600 font-bold">{user.kp.toLocaleString()} KP</p>
                  </div>
                </td>
                <td className="px-8 py-6 text-xs text-slate-600 font-medium">
                  {user.joinedAt}
                </td>
                <td className="px-8 py-6 text-right">
                   <button 
                    onClick={() => handleRoleToggle(user.id, user.role)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                   >
                     <UserCog className="w-4 h-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
