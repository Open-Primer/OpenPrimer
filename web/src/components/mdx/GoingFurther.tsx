"use client";

import React from 'react';
import { Compass, ArrowUpRight, BookOpen, FileText, Globe, Play, Film } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ResourceItemProps {
  title: string;
  type: 'book' | 'article' | 'video' | 'website' | 'research' | 'movie' | 'film';
  url?: string;
  description: string;
  refNum?: number;
  author?: string;
  year?: string;
}

export const GoingFurtherItem = ({ title, type, url, description, refNum, author, year }: ResourceItemProps) => {
  const [isValid, setIsValid] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (!url) {
      setIsValid(true);
      return;
    }

    // Dynamic, on-the-fly check via server route to bypass CORS
    fetch(`/api/check-link?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.valid === false) {
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      })
      .catch(() => {
        // Fallback to true on network error so we don't aggressively hide items due to transient checker failures
        setIsValid(true);
      });
  }, [url]);

  const getIcon = () => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'article':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'video':
        return <Play className="w-4 h-4 text-rose-400 fill-rose-400/25" />;
      case 'movie':
      case 'film':
        return <Film className="w-4 h-4 text-rose-400" />;
      case 'website':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'research':
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <Compass className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBadgeText = (lang: string) => {
    const texts: Record<string, Record<string, string>> = {
      FR: { book: 'Livre', article: 'Article', video: 'Vidéo', website: 'Site Web', research: 'Recherche', movie: 'Film', film: 'Film' },
      EN: { book: 'Book', article: 'Article', video: 'Video', website: 'Website', research: 'Research', movie: 'Movie', film: 'Film' },
      ES: { book: 'Libro', article: 'Artículo', video: 'Video', website: 'Sitio Web', research: 'Investigación', movie: 'Película', film: 'Película' },
      DE: { book: 'Buch', article: 'Artikel', video: 'Video', website: 'Webseite', research: 'Forschung', movie: 'Film', film: 'Film' },
      ZH: { book: '书籍', article: '文章', video: '视频', website: '网站', research: '学术研究', movie: '电影', film: '电影' }
    };
    const l = lang.toUpperCase();
    return texts[l]?.[type] || texts.EN[type];
  };

  const { language } = useLanguage();

  const hasRealUrl = url && isValid !== false;
  const CardWrapper = (hasRealUrl || refNum) ? 'a' : 'div';
  const extraProps = hasRealUrl 
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' } 
    : (refNum ? { href: `#ref-${refNum}` } : {});

  return (
    <CardWrapper 
      id={refNum ? `cite-${refNum}` : undefined}
      {...(extraProps as any)}
      className={`group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-850 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-800 transition-all duration-300 ${(hasRealUrl || refNum) ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-xl bg-slate-950 border border-slate-850 shadow-inner group-hover:scale-110 transition-all duration-300">
          {getIcon()}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="text-[13px] font-bold text-slate-100 group-hover:text-blue-400 transition-colors duration-200 leading-snug">
              {title}
            </h5>
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-950 border border-slate-850 text-slate-400 select-none">
              {getBadgeText(language)}
            </span>
            {refNum && (
              <span 
                className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-900/50 text-indigo-400 select-none"
                title={language.toUpperCase() === 'FR' ? `Référence [${refNum}]` : `Reference [${refNum}]`}
              >
                [{refNum}]
              </span>
            )}
          </div>
          {(author || year) && (
            <p className="text-[10px] text-slate-400/80 font-medium italic">
              {author}{year ? ` (${year})` : ''}
            </p>
          )}
          <p className="text-[11px] leading-relaxed text-slate-400 group-hover:text-slate-350 transition-colors duration-200">
            {description}
          </p>
        </div>
      </div>
      {(hasRealUrl || refNum) && (
        <div className="self-end md:self-auto flex items-center justify-center w-8 h-8 rounded-xl bg-slate-950 border border-slate-850 text-slate-500 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </div>
      )}
    </CardWrapper>
  );
};

interface GoingFurtherProps {
  title?: string;
  children: React.ReactNode;
}

export const GoingFurther = ({ title, children }: GoingFurtherProps) => {
  const { language } = useLanguage();

  const getDefaultTitle = () => {
    switch (language.toUpperCase()) {
      case 'FR':
        return 'Pour Aller Plus Loin';
      case 'ES':
        return 'Para Ir Más Allá';
      case 'DE':
        return 'Weiterführende Ressourcen';
      case 'ZH':
        return '深入学习资源';
      default:
        return 'Going Further';
    }
  };

  return (
    <div className="my-12 p-8 md:p-10 rounded-[40px] border border-blue-500/20 bg-blue-500/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
      {/* Decorative gradient glowing orb */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none select-none" />
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-md">
            <Compass className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <h3 className="text-white text-lg font-black tracking-wide">
            {title || getDefaultTitle()}
          </h3>
        </div>

        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
