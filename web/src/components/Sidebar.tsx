"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Circle, Search } from 'lucide-react';
import { NavItem } from '@/lib/content';
import { dbService, progressService, isDatabaseConfigured, isSandboxFallbackAllowed } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';
import { UI_STRINGS } from '@/components/RefinedUI';

interface SidebarProps {
  items: NavItem[];
  isOpen: boolean;
}

export const Sidebar = ({ items, isOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [progress, setProgress] = useState<number>(0); // Default fallback
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [visitedPages, setVisitedPages] = useState<string[]>([]);
  const [activeCourse, setActiveCourse] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ path: string; name: string; excerpt: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const slug = parts[2];
      if (slug) {
        dbService.getAllCourses().then(({ data }) => {
          if (data) {
            const matched = data.find((c: any) => c.slug === slug || c.slug?.toLowerCase() === slug.toLowerCase());
            if (matched) {
              setActiveCourse(matched);
            }
          }
        });
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const parts = window.location.pathname.split('/').filter(Boolean);
        const courseSlug = parts[2];
        const level = parts[0];
        const subject = parts[1];

        if (courseSlug) {
          const res = await fetch(
            `/api/search-lessons?courseSlug=${encodeURIComponent(courseSlug)}&q=${encodeURIComponent(
              searchQuery.trim()
            )}&lang=${lang}&level=${encodeURIComponent(level || '')}&subject=${encodeURIComponent(
              subject || ''
            )}`
          );
          const data = await res.json();
          if (Array.isArray(data)) {
            setSearchResults(data);
          }
        }
      } catch (err) {
        console.error('Error searching lessons:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, lang]);

  useEffect(() => {
    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session === 'true');
  }, []);

  const getProgressionStorage = (): Storage | null => {
    if (typeof window === 'undefined') return null;
    const session = localStorage.getItem('op_session');
    const loggedIn = session === 'true';
    return loggedIn ? localStorage : sessionStorage;
  };

  useEffect(() => {
    let active = true;
    async function loadProgress() {
      const parts = pathname.split('/');
      const isLPage = parts.includes('L1') || parts.includes('L2') || parts.includes('L3');
      const activeSlug = isLPage ? parts[3] : null;
      if (!activeSlug) return;
      
      const flatPages: any[] = [];
      items.forEach(module => {
        module.children?.forEach(page => {
          flatPages.push(page);
        });
      });

      const useSupabase = isDatabaseConfigured && !isSandboxFallbackAllowed();
      let dbProgress = 0;
      let dbVisited: string[] = [];

      if (useSupabase) {
        let userId = 'u1';
        const savedProfile = localStorage.getItem('op_user_profile');
        if (savedProfile) {
          try {
            const p = JSON.parse(savedProfile);
            if (p.id) userId = p.id;
          } catch (e) {}
        }
        const { data: progressData } = await dbService.getUserProgress(userId, lang);
        if (progressData && active) {
          const activeModule = progressData.activeModules?.find((m: any) => m.slug === activeSlug);
          if (activeModule) {
            dbProgress = activeModule.progress;
          }
          if (progressData.lessonProgress) {
            dbVisited = Object.keys(progressData.lessonProgress);
          }
        }
      } else {
        const storage = getProgressionStorage();
        if (storage) {
          const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
          dbVisited = visited;
          const visitedCount = flatPages.filter(p => visited.includes(p.path)).length;
          const totalPages = flatPages.length;
          dbProgress = totalPages > 0 ? Math.round((visitedCount / totalPages) * 100) : 0;

          const progressMap = JSON.parse(storage.getItem('op_course_progress') || '{}');
          progressMap[activeSlug] = dbProgress;
          storage.setItem('op_course_progress', JSON.stringify(progressMap));
        }
      }

      if (active) {
        setProgress(dbProgress);
        setVisitedPages(dbVisited);
      }
    }

    loadProgress();

    const handleUpdate = () => {
      loadProgress();
    };
    window.addEventListener('op_progress_updated', handleUpdate);

    return () => {
      active = false;
      window.removeEventListener('op_progress_updated', handleUpdate);
    };
  }, [pathname, items, lang]);

  if (!isOpen) return null;

  const flatPages: any[] = [];
  items.forEach(module => {
    module.children?.forEach(page => {
      flatPages.push(page);
    });
  });

  // Filter nav items based on search query
  const normalizeSearch = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const qNorm = normalizeSearch(searchQuery);
  const filteredItems = searchQuery.trim()
    ? items
        .map(module => ({
          ...module,
          children: (module.children || []).filter(page =>
            normalizeSearch(page.name).includes(qNorm)
          )
        }))
        .filter(module => (module.children?.length ?? 0) > 0)
    : items;

  return (
    <aside className="w-80 h-full flex flex-col bg-slate-950/30 p-8 border-r border-slate-900/50">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 pointer-events-none" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                window.location.href = `/catalog?search=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
            placeholder={t.search_course || 'Search this course...'}
            className="w-full bg-slate-900/50 border border-slate-800/50 rounded-2xl py-3 pl-12 pr-10 text-xs text-slate-300 focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-700 font-bold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-600 hover:text-white transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>
        {searchQuery.trim() && (
          <p className="mt-1.5 text-[9px] text-slate-700 font-bold uppercase tracking-widest px-1">
            {lang.toUpperCase() === 'FR' ? '↵ Entrée pour chercher dans le catalogue' :
             lang.toUpperCase() === 'ES' ? '↵ Enter para buscar en el catálogo' :
             lang.toUpperCase() === 'DE' ? '↵ Enter um im Katalog zu suchen' :
             '↵ Enter to search catalog'}
          </p>
        )}
      </div>

      {activeCourse && (
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('op_trigger_course_sheet', { detail: activeCourse }));
          }}
          className="w-full mb-6 py-3.5 px-4 bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:text-white hover:border-blue-500/50 transition-all flex items-center justify-center gap-2.5 rounded-2xl cursor-pointer group text-[10px] font-black uppercase tracking-widest"
        >
          <svg className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-all duration-350" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>{t.course_sheet || "Course Sheet"}</span>
        </button>
      )}

      <div className="flex-1 space-y-10 overflow-y-auto custom-scrollbar pr-4">
        {searchQuery.trim() ? (
          isSearching ? (
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center py-4 animate-pulse">
              {lang.toUpperCase() === 'FR' ? 'Recherche en cours...' :
               lang.toUpperCase() === 'ES' ? 'Buscando...' :
               lang.toUpperCase() === 'DE' ? 'Suche läuft...' :
               lang.toUpperCase() === 'ZH' ? '正在搜索...' : 'Searching...'}
            </p>
          ) : searchResults.length === 0 ? (
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center py-4">
              {lang.toUpperCase() === 'FR' ? 'Aucun résultat' :
               lang.toUpperCase() === 'ES' ? 'Sin resultados' :
               lang.toUpperCase() === 'DE' ? 'Keine Ergebnisse' :
               lang.toUpperCase() === 'ZH' ? '无结果' : 'No results'}
            </p>
          ) : (
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">
                {lang.toUpperCase() === 'FR' ? 'Résultats de recherche' :
                 lang.toUpperCase() === 'ES' ? 'Resultados de búsqueda' :
                 lang.toUpperCase() === 'DE' ? 'Suchergebnisse' :
                 lang.toUpperCase() === 'ZH' ? '搜索结果' : 'Search Results'}
              </h4>
              <div className="space-y-2">
                {searchResults.map((result) => {
                  const isActive = pathname === result.path;
                  const isCompleted = visitedPages.includes(result.path);

                  return (
                    <Link
                      key={result.path}
                      href={result.path}
                      className={`flex flex-col gap-1 px-3 py-2.5 rounded-xl transition-all group ${
                        isActive
                          ? 'bg-blue-600/10 text-blue-400'
                          : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : isActive ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-500 animate-pulse flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-800 group-hover:text-slate-600 flex-shrink-0" />
                        )}
                        <span className={`text-[11px] font-bold ${isActive ? 'tracking-tight text-slate-200' : isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                          {result.name}
                        </span>
                      </div>
                      {result.excerpt && (
                        <span className="pl-7 text-[10px] text-slate-600 group-hover:text-slate-500 transition-colors line-clamp-2 leading-relaxed italic">
                          {result.excerpt}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )
        ) : filteredItems.length === 0 ? (
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center py-4">
            {lang.toUpperCase() === 'FR' ? 'Aucun résultat' :
             lang.toUpperCase() === 'ES' ? 'Sin resultados' :
             lang.toUpperCase() === 'DE' ? 'Keine Ergebnisse' :
             lang.toUpperCase() === 'ZH' ? '无结果' : 'No results'}
          </p>
        ) : filteredItems.map((module) => (
          <div key={module.name} className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">{module.name}</h4>
            <div className="space-y-1">
              {module.children?.map((page) => {
                const isActive = pathname === page.path;
                const isCompleted = visitedPages.includes(page.path);

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
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-500 animate-pulse flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-800 group-hover:text-slate-600 flex-shrink-0" />
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

      {isLoggedIn && (
        <div className="mt-8 pt-6 border-t border-slate-900/50">
           <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
             {t.course_progress || "Course Progress"} • <span className="text-blue-500 font-black">{progress}%</span>
           </div>
        </div>
      )}
    </aside>
  );
};
