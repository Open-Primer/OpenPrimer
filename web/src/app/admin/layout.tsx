"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, AlertTriangle, Users, BookOpen, Settings, ChevronRight, LogOut, ArrowLeft, Menu, X } from 'lucide-react';
import { TopNav, Footer } from '@/components/RefinedUI';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Error Report', href: '/admin/reports', icon: <AlertTriangle className="w-4 h-4" /> },
  { label: 'User Management', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
  { label: 'Curriculum Editor', href: '/admin/curriculum', icon: <BookOpen className="w-4 h-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans text-white">
      {/* Mobile Hamburger Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-[110]">
         <div className="flex items-center gap-2">
            <OpenPrimerIcon className="w-6 h-6" />
            <span className="font-black tracking-tighter">ADMIN</span>
         </div>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white transition-colors">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
         </button>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Admin Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-[100] w-64 border-r border-slate-900 bg-slate-950 flex flex-col transition-transform duration-300
          md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}>
          <div className="p-8">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span className="text-lg font-black tracking-tighter">OpenPrimer</span>
            </Link>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1 ml-6 italic">Admin Cockpit</p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
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
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950">
          <main className="p-12">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
