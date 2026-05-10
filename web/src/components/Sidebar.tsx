"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Circle, Search, GraduationCap, Settings } from 'lucide-react';
import { NavItem } from '@/lib/content';

interface SidebarProps {
  items: NavItem[];
  isOpen: boolean;
}

export const Sidebar = ({ items, isOpen }: SidebarProps) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <aside className="w-80 h-full flex flex-col bg-slate-950/30 p-8 border-r border-slate-900/50">
      <div className="relative mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
        <input 
          placeholder="Search this course..."
          className="w-full bg-slate-900/50 border border-slate-800/50 rounded-2xl py-3 pl-12 pr-4 text-xs text-slate-300 focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-700 font-bold"
        />
      </div>

      <div className="flex-1 space-y-10 overflow-y-auto custom-scrollbar pr-4">
        {items.map((module) => (
          <div key={module.name} className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">{module.name}</h4>
            <div className="space-y-1">
              {module.children?.map((page) => {
                const isActive = pathname === page.path;
                return (
                  <Link
                    key={page.name}
                    href={page.path || '#'}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                      isActive 
                        ? 'bg-blue-600/10 text-blue-400' 
                        : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                    }`}
                  >
                    {isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-800 group-hover:text-slate-600" />
                    )}
                    <span className={`text-[11px] font-bold ${isActive ? 'tracking-tight' : 'tracking-normal'}`}>
                      {page.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-900/50">
         <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-slate-700 uppercase tracking-widest">
           Course Progress • 12%
         </div>
      </div>
    </aside>
  );
};
