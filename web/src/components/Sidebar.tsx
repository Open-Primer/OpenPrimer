"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Circle, Search } from 'lucide-react';
import { NavItem } from '@/lib/content';
import { dbService } from '@/lib/db';

interface SidebarProps {
  items: NavItem[];
  isOpen: boolean;
}

export const Sidebar = ({ items, isOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [progress, setProgress] = useState<number>(12); // Default fallback

  useEffect(() => {
    async function loadProgress() {
      const parts = pathname.split('/');
      const isLPage = parts.includes('L1') || parts.includes('L2') || parts.includes('L3');
      const activeSlug = isLPage ? parts[3] : null;
      if (!activeSlug) return;
      
      const { activeModules } = await dbService.getUserProgress('u1');
      const currentModule = activeModules.find((m: any) => 
        m.slug.toLowerCase().replace(/_/g, '-') === activeSlug.toLowerCase().replace(/_/g, '-')
      );
      if (currentModule) {
        setProgress(currentModule.progress);
      }
    }
    loadProgress();
  }, [pathname]);

  if (!isOpen) return null;

  // Flatten all child page items to map completion index-by-index
  const flatPages: any[] = [];
  items.forEach(module => {
    module.children?.forEach(page => {
      flatPages.push(page);
    });
  });
  
  const totalPages = flatPages.length;
  const completedCount = totalPages > 0 ? Math.round(totalPages * (progress / 100)) : 0;

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
                const pageIndex = flatPages.findIndex(p => p.path === page.path);
                const isCompleted = pageIndex !== -1 && pageIndex < completedCount;

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
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-500 animate-pulse" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-800 group-hover:text-slate-600" />
                    )}
                    <span className={`text-[11px] font-bold ${isActive ? 'tracking-tight text-slate-200' : isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
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
         <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
           Course Progress • <span className="text-blue-500 font-black">{progress}%</span>
         </div>
      </div>
    </aside>
  );
};
