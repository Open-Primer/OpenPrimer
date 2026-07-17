"use client";

import React from 'react';
import { Rocket } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface WhatsNextItem {
  title: string;
  slug: string;
  level?: string;
  subject?: string;
  description?: string;
}

interface WhatsNextProps {
  title?: string;
  items?: WhatsNextItem[];
  itemsBase64?: string;
  children?: React.ReactNode;
}

const isChildrenEmpty = (children: React.ReactNode): boolean => {
  if (children === null || children === undefined) return true;
  if (typeof children === 'string') return children.trim() === '';
  if (typeof children === 'number') return false;
  if (Array.isArray(children)) {
    if (children.length === 0) return true;
    return children.every(child => isChildrenEmpty(child));
  }
  if (React.isValidElement(children)) {
    const props = children.props as any;
    if (props && 'children' in props) {
      return isChildrenEmpty(props.children);
    }
    return false;
  }
  return false;
};

export const WhatsNext = ({ title, items, itemsBase64, children }: WhatsNextProps) => {
  const { language } = useLanguage();
  const defaultTitles: Record<string, string> = {
    fr: "Et après ?",
    en: "What's Next?",
    es: "¿Y ahora qué?",
    de: "Wie geht es weiter?",
    zh: "下一步是什么？"
  };
  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const displayTitle = title || defaultTitles[normalizedLang] || defaultTitles['en'];

  const [existsMap, setExistsMap] = React.useState<Record<string, boolean>>({});

  let resolvedItems: WhatsNextItem[] = items || [];
  if (itemsBase64) {
    try {
      const binary = typeof window !== 'undefined'
        ? window.atob(itemsBase64)
        : Buffer.from(itemsBase64, 'base64').toString('binary');
      const percentEncoded = binary.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('');
      const decoded = decodeURIComponent(percentEncoded);
      resolvedItems = JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to decode itemsBase64 in WhatsNext:", e);
    }
  }

  React.useEffect(() => {
    if (resolvedItems.length === 0) return;
    const slugs = resolvedItems.map(item => item.slug.toLowerCase()).filter(Boolean);
    if (slugs.length === 0) return;

    fetch(`/api/check-course?slug=${encodeURIComponent(slugs.join(','))}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.exists) {
          setExistsMap(data.exists);
        }
      })
      .catch(err => {
        console.error("Failed to check course existence:", err);
      });
  }, [resolvedItems]);

  const hasItems = resolvedItems.length > 0;
  const hasChildren = !isChildrenEmpty(children);

  if (!hasChildren && !hasItems) {
    return null;
  }

  const soonLabels: Record<string, string> = {
    fr: "Bientôt disponible",
    en: "Coming soon",
    es: "Próximamente",
    de: "Demnächst verfügbar",
    zh: "即将推出"
  };
  const soonLabel = soonLabels[normalizedLang] || soonLabels['en'];

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 border border-violet-500/20 rounded-3xl relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/5 rounded-full blur-2xl pointer-events-none select-none" />
      
      <div className="flex items-center gap-2.5 mb-3 select-none">
        <div className="p-1.5 rounded-xl bg-violet-500/10 text-violet-400">
          <Rocket className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-violet-400">
          {displayTitle}
        </span>
      </div>
      
      {hasChildren && (
        <div className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-350 font-medium pl-1 mb-4">
          {children}
        </div>
      )}

      {hasItems && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 select-none">
          {resolvedItems.map((item, idx) => {
            const cleanSlug = item.slug.toLowerCase();
            // Default to true during loading to prevent abrupt visual layout shift
            const exists = existsMap[cleanSlug] !== false; 
            const CardComponent = exists ? 'a' : 'div';
            const extraProps = exists ? { href: `/course/${item.slug}` } : {};

            return (
              <CardComponent
                key={idx}
                {...(extraProps as any)}
                className={`p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50 transition-all duration-300 flex flex-col justify-between group ${
                  exists 
                    ? 'hover:border-violet-500/35 hover:bg-slate-900/40 cursor-pointer' 
                    : 'opacity-65 cursor-default'
                }`}
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">
                    {item.subject || 'Course'}
                  </span>
                  <h4 className={`text-sm font-bold mt-1 transition-colors ${exists ? 'text-white group-hover:text-violet-300' : 'text-slate-500'}`}>
                    {item.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/30 text-[10px] font-bold text-slate-400">
                  <span>{item.level || 'All levels'}</span>
                  {exists ? (
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  ) : (
                    <span className="text-[9px] font-normal italic text-slate-500 select-none normal-case tracking-normal">
                      {soonLabel}
                    </span>
                  )}
                </div>
              </CardComponent>
            );
          })}
        </div>
      )}
    </div>
  );
};
