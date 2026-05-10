"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, AlertTriangle, Users, BookOpen, Settings, ChevronRight, LogOut, ArrowLeft } from 'lucide-react';
import { TopNav } from '@/components/RefinedUI';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Error Reports', href: '/admin/reports', icon: <AlertTriangle className="w-4 h-4" /> },
  { label: 'User Management', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
  { label: 'Curriculum Editor', href: '/admin/curriculum', icon: <BookOpen className="w-4 h-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans text-white">
      {/* Admin Sidebar */}
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 border-r border-slate-900 bg-slate-950/50 flex flex-col">
          <div className="p-8">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span className="text-lg font-black tracking-tighter">OpenPrimer</span>
            </Link>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1 ml-6">Admin Console</p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-900">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950 p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
