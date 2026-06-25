"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Circle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NavItem } from '@/lib/content';
import { dbService, progressService, isDatabaseConfigured, isSandboxFallbackAllowed } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';
import { UI_STRINGS } from '@/components/RefinedUI';

interface SidebarProps {
  items: NavItem[];
  isOpen: boolean;
}

const highlightText = (text: string, query: string) => {
  if (!query || !query.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-blue-500/25 text-blue-300 px-0.5 rounded font-bold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export const Sidebar = ({ items, isOpen }: SidebarProps) => {
  const pathname = usePathname();
  const cleanPath = (p: string) => p ? p.replace(/\/+$/, '').toLowerCase() : '';
  const [progress, setProgress] = useState<number>(0); // Default fallback
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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
    if (typeof window !== 'undefined') {
      const pendingToast = localStorage.getItem('op_show_enrolled_toast');
      if (pendingToast) {
        localStorage.removeItem('op_show_enrolled_toast');
        const courseName = pendingToast;
        const msg = lang.toUpperCase() === 'FR' ? `🎉 Vous avez bien été inscrit au cours "${courseName}" !` :
                    lang.toUpperCase() === 'ES' ? `🎉 ¡Te has inscrito correctamente en el curso "${courseName}"!` :
                    lang.toUpperCase() === 'DE' ? `🎉 Sie haben sich erfolgreich für den Kurs "${courseName}" angemeldet!` :
                    lang.toUpperCase() === 'ZH' ? `🎉 您已成功注册课程 "${courseName}"！` :
                    `🎉 You have successfully enrolled in the course "${courseName}"!`;
        setToastMessage(msg);
        const timer = setTimeout(() => {
          setToastMessage(null);
        }, 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [lang]);

  useEffect(() => {
    let active = true;
    async function loadProgress() {
      const segments = pathname.split('/').filter(Boolean);
      const activeSlug = segments.length >= 3 && 
        !['profile', 'admin', 'api', 'catalog', 'login', 'signup'].includes(segments[0]) ? segments[2] : null;
      if (!activeSlug) return;
      
      const flatPages: any[] = [];
      items.forEach(item => {
        if (item.type === 'file') {
          flatPages.push(item);
        } else {
          item.children?.forEach(page => {
            flatPages.push(page);
          });
        }
      });

      const useSupabase = isDatabaseConfigured && !isSandboxFallbackAllowed();
      let dbProgress = 0;
      let dbVisited: string[] = [];
      let enrolled = false;

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
          const activeModule = progressData.activeModules?.find((m: any) => m.slug?.toLowerCase() === activeSlug.toLowerCase());
          if (activeModule) {
            dbProgress = activeModule.progress;
          }
          if (progressData.lessonProgress) {
            dbVisited = Object.keys(progressData.lessonProgress);
          }
          if (activeCourse) {
            enrolled = progressData.enrolled?.includes(activeCourse.id) || 
                       progressData.activeModules?.some((m: any) => m.id === activeCourse.id);
          }
        }
      } else {
        const storage = getProgressionStorage();
        if (storage) {
          const visited = JSON.parse(storage.getItem('op_visited_pages') || '[]');
          dbVisited = visited;

          const quizResults = JSON.parse(storage.getItem('op_quiz_results') || '{}');
          const quizzesRequired = JSON.parse(storage.getItem('op_quizzes_required') || '{}');

          const paths = flatPages.map(p => p.path).filter(Boolean);
          if (paths.length > 0) {
            const regularPages = paths.slice(0, -1);
            const finalPage = paths[paths.length - 1];

            let completedRegularCount = 0;
            regularPages.forEach(path => {
              const isVisited = visited.some((v: string) => cleanPath(v) === cleanPath(path));
              const requiresQuiz = !!quizzesRequired[path];
              const quizDone = !!quizResults[path];
              if (isVisited && (!requiresQuiz || quizDone)) {
                completedRegularCount++;
              }
            });

            const regularProgress = regularPages.length > 0 ? Math.round((completedRegularCount / regularPages.length) * 90) : 90;

            const evalStatus = progressService.checkFinalEvaluationStatus(activeSlug, finalPage);
            const finalTenPercent = (evalStatus.completed && evalStatus.passed) ? 10 : 0;

            dbProgress = Math.min(100, regularProgress + finalTenPercent);
          } else {
            dbProgress = 0;
          }

          const progressMap = JSON.parse(storage.getItem('op_course_progress') || '{}');
          progressMap[activeSlug.toLowerCase()] = dbProgress;
          storage.setItem('op_course_progress', JSON.stringify(progressMap));

          if (activeCourse) {
            const enrolledCourses = JSON.parse(storage.getItem('op_enrolled_courses') || '[]');
            enrolled = enrolledCourses.includes(activeCourse.id);
          }
        }
      }

      if (active) {
        setProgress(dbProgress);
        setVisitedPages(dbVisited);
        setIsEnrolled(enrolled);
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
  }, [pathname, items, lang, activeCourse]);

  if (!isOpen) return null;

  const flatPages: any[] = [];
  items.forEach(item => {
    if (item.type === 'file') {
      flatPages.push(item);
    } else {
      item.children?.forEach(page => {
        flatPages.push(page);
      });
    }
  });

  // Filter nav items based on search query
  const normalizeSearch = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const qNorm = normalizeSearch(searchQuery);
  const filteredItems = searchQuery.trim()
    ? items
        .map(item => {
          if (item.type === 'file') {
            return normalizeSearch(item.name).includes(qNorm) ? item : null;
          }
          return {
            ...item,
            children: (item.children || []).filter(page =>
              normalizeSearch(page.name).includes(qNorm)
            )
          };
        })
        .filter(item => {
          if (!item) return false;
          if (item.type === 'file') return true;
          return (item.children?.length ?? 0) > 0;
        }) as NavItem[]
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
              if (e.key === 'Enter') {
                e.preventDefault();
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

      {!isEnrolled && isLoggedIn && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] leading-relaxed space-y-3">
          <p className="font-bold">
            {lang.toUpperCase() === 'FR' ? '⚠️ Vous n’êtes pas inscrit à ce cours' :
             lang.toUpperCase() === 'ES' ? '⚠️ No estás inscrito en este curso' :
             lang.toUpperCase() === 'DE' ? '⚠️ Sie sind nicht für diesen Kurs angemeldet' :
             lang.toUpperCase() === 'ZH' ? '⚠️ 您未注册此课程' : '⚠️ You are not enrolled in this course'}
          </p>
          <p className="text-slate-400">
            {lang.toUpperCase() === 'FR' ? 'Les points ne seront pas comptabilisés, les badges non attribués et toutes les fonctionnalités interactives ne seront pas sauvegardées.' :
             lang.toUpperCase() === 'ES' ? 'Los puntos no se contabilizarán, los insignias no se otorgarán y todas las funciones interactivas no se guardarán.' :
             lang.toUpperCase() === 'DE' ? 'Punkte werden nicht gezählt, Abzeichen nicht vergeben und alle interaktiven Funktionen werden nicht gespeichert.' :
             lang.toUpperCase() === 'ZH' ? '积分将不予计算，徽章将不予授予，所有交互式功能将不会保存。' : 'Points will not be counted, badges not awarded, and all interactive features will not be saved.'}
          </p>
          <button
            onClick={async () => {
              if (activeCourse) {
                let userId = 'u1';
                const savedProfile = localStorage.getItem('op_user_profile');
                if (savedProfile) {
                  try {
                    const p = JSON.parse(savedProfile);
                    if (p.id) userId = p.id;
                  } catch (err) {}
                }
                await dbService.enrollInCourse(userId, activeCourse.id);
                localStorage.setItem('op_show_enrolled_toast', activeCourse.title || activeCourse.name || 'Course');
                window.dispatchEvent(new Event('op_progress_updated'));
                window.location.reload();
              }
            }}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-widest text-center transition-all cursor-pointer"
          >
            {lang.toUpperCase() === 'FR' ? 'S’inscrire' :
             lang.toUpperCase() === 'ES' ? 'Inscribirse' :
             lang.toUpperCase() === 'DE' ? 'Einschreiben' :
             lang.toUpperCase() === 'ZH' ? '注册课程' : 'Enroll'}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 flex flex-col gap-1.5">
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
                  const isActive = cleanPath(pathname) === cleanPath(result.path);
                  const isCompleted = visitedPages.some(vp => cleanPath(vp) === cleanPath(result.path));

                  return (
                    <Link
                      key={result.path}
                      href={result.path}
                      className={`flex flex-col gap-1 px-3 py-2.5 transition-all group ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5 rounded-r-xl rounded-l-none'
                          : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300 rounded-xl'
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
                        <span className={`text-[11px] font-bold ${isActive ? 'tracking-tight text-blue-400 font-extrabold' : isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                          {highlightText(result.name, searchQuery)}
                        </span>
                      </div>
                      {result.excerpt && (
                        <span className="pl-7 text-[10px] text-slate-600 group-hover:text-slate-500 transition-colors line-clamp-2 leading-relaxed italic">
                          {highlightText(result.excerpt, searchQuery)}
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
        ) : filteredItems.map((item) => {
          if (item.type === 'file') {
            const isActive = cleanPath(pathname) === cleanPath(item.path);
            const isCompleted = visitedPages.some(vp => cleanPath(vp) === cleanPath(item.path));
            return (
              <Link
                key={item.name}
                href={item.path || '#'}
                className={`flex items-center gap-3 px-3 py-2.5 transition-all group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5 rounded-r-xl rounded-l-none'
                    : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300 rounded-xl'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : isActive ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-500 animate-pulse flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-800 group-hover:text-slate-600 flex-shrink-0" />
                )}
                <span className={`text-[11px] font-bold ${isActive ? 'tracking-tight text-blue-400 font-extrabold' : isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.name}
                </span>
              </Link>
            );
          }

          // Otherwise it is a module with children
          return (
            <div key={item.name} className="mt-6 first:mt-0 flex flex-col gap-2.5">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">{item.name}</h4>
              <div className="flex flex-col gap-1">
                {item.children?.map((page) => {
                  const isActive = cleanPath(pathname) === cleanPath(page.path);
                  const isCompleted = visitedPages.some(vp => cleanPath(vp) === cleanPath(page.path));

                  return (
                    <Link
                      key={page.name}
                      href={page.path || '#'}
                      className={`flex items-center gap-3 px-3 py-2.5 transition-all group ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5 rounded-r-xl rounded-l-none'
                          : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300 rounded-xl'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : isActive ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-500 animate-pulse flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-800 group-hover:text-slate-600 flex-shrink-0" />
                      )}
                      <span className={`text-[11px] font-bold ${isActive ? 'tracking-tight text-blue-400 font-extrabold' : isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                        {page.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {isLoggedIn && isEnrolled && (
        <div className="mt-8 pt-6 border-t border-slate-900/50">
           <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
             {t.course_progress || "Course Progress"} • <span className="text-blue-500 font-black">{progress}%</span>
           </div>
        </div>
      )}

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-6 right-6 z-[9999] max-w-sm p-4 bg-slate-900/90 border border-emerald-500/30 text-white rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 text-xs font-bold leading-relaxed text-slate-200">
              {toastMessage}
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
