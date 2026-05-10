"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Folder, FileText, ChevronDown, ChevronRight, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavItem } from '@/lib/content';

interface SidebarProps {
  items: NavItem[];
}

export const Sidebar = ({ items }: SidebarProps) => {
  return (
    <aside className="w-80 h-screen overflow-y-auto bg-slate-950/50 backdrop-blur-3xl border-r border-slate-800 p-6 flex flex-col gap-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          OpenPrimer
        </h1>
      </div>

      <nav className="flex-1">
        <Tree items={items} />
      </nav>
      
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">AI Tutor</p>
        <p className="text-sm text-slate-400">Posez vos questions à tout moment.</p>
      </div>
    </aside>
  );
};

const Tree = ({ items, level = 0 }: { items: NavItem[]; level?: number }) => {
  return (
    <ul className="space-y-1">
      {items.map((item, idx) => (
        <TreeNode key={idx} item={item} level={level} />
      ))}
    </ul>
  );
};

const TreeNode = ({ item, level }: { item: NavItem; level: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const isActive = pathname === `/${item.path}`;

  if (item.type === 'folder') {
    return (
      <li>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all group"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <Folder className="w-4 h-4 text-blue-500/70" />
          <span className="text-sm font-medium">{item.name}</span>
        </button>
        <AnimatePresence>
          {isOpen && item.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Tree items={item.children} level={level + 1} />
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={`/${item.path}`}
        className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
          isActive 
            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
        }`}
        style={{ paddingLeft: `${level * 12 + 24}px` }}
      >
        <FileText className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-600'}`} />
        <span className="capitalize">{item.name}</span>
      </Link>
    </li>
  );
};
