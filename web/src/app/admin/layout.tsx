"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, AlertTriangle, Users, BookOpen, ChevronDown, CheckCircle, LogOut, ArrowLeft, Menu, X, User, GraduationCap, Brain, Settings, ShieldAlert, MessageSquare, Activity } from 'lucide-react';
import ServiceToast from '@/components/ServiceToast';
import { AdminFooter } from '@/components/RefinedUI';
import { OpenPrimerIcon } from '@/components/OpenPrimerIcon';
import { useLanguage } from '@/context/LanguageContext';
import { authService } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';

export const ADMIN_STRINGS = {
  EN: {
    dashboard: "Dashboard",
    reports: "Error Reports",
    users: "User Management",
    curriculum: "Curriculum Management",
    feedback: "Inquiries & Feedback",
    health: "Server Health",
    signout: "Sign Out",
    admin_panel: "OpenPrimer Admin Panel",
    cockpit: "Admin Cockpit",
    logged_as: "Logged in as",
    my_curriculum: "My Curriculum",
    catalog: "Browse Catalog",
    settings: "Account Settings",
    admin: "Admin Console",
    theme_default: "Default",
    theme_paper: "Paper",
    theme_focus: "Focus",
    verifying_access: "Verifying Administrative Access..."
  },
  FR: {
    dashboard: "Tableau de Bord",
    reports: "Rapports d'Erreurs",
    users: "Gestion des Utilisateurs",
    curriculum: "Gestion des Cursus",
    feedback: "Messages & Contact",
    health: "Santé des Serveurs",
    signout: "Déconnexion",
    admin_panel: "Panneau d'Administration",
    cockpit: "Cockpit Administrateur",
    logged_as: "Connecté en tant que",
    my_curriculum: "Mon Curriculum",
    catalog: "Parcourir le Catalogue",
    settings: "Paramètres",
    admin: "Console Admin",
    theme_default: "Défaut",
    theme_paper: "Papier",
    theme_focus: "Focus",
    verifying_access: "Vérification de l'accès administratif..."
  },
  ES: {
    dashboard: "Panel de Control",
    reports: "Reportes de Errores",
    users: "Gestión de Usuarios",
    curriculum: "Gestión del Plan de Estudios",
    feedback: "Consultas y Comentarios",
    health: "Salud del Servidor",
    signout: "Cerrar Sesión",
    admin_panel: "Panel de Administración",
    cockpit: "Cabina de Mando",
    logged_as: "Sesión iniciada como",
    my_curriculum: "Mi Currículo",
    catalog: "Explorar Catálogo",
    settings: "Ajustes de Cuenta",
    admin: "Consola Admin",
    theme_default: "Predeterminado",
    theme_paper: "Papel",
    theme_focus: "Enfoque",
    verifying_access: "Verificando acceso administrativo..."
  },
  DE: {
    dashboard: "Dashboard",
    reports: "Fehlerberichte",
    users: "Benutzerverwaltung",
    curriculum: "Lehrplanverwaltung",
    feedback: "Anfragen & Feedback",
    health: "Server-Gesundheit",
    signout: "Abmelden",
    admin_panel: "Admin-Panel",
    cockpit: "Admin-Cockpit",
    logged_as: "Angemeldet als",
    my_curriculum: "Mein Lehrplan",
    catalog: "Katalog durchsuchen",
    settings: "Kontoeinstellungen",
    admin: "Admin-Konsole",
    theme_default: "Standard",
    theme_paper: "Papier",
    theme_focus: "Fokus",
    verifying_access: "Administrative Zugriffsberechtigung wird überprüft..."
  },
  ZH: {
    dashboard: "仪表板",
    reports: "错误报告",
    users: "用户管理",
    curriculum: "课程管理",
    feedback: "咨询与反馈",
    health: "服务器健康",
    signout: "登出",
    admin_panel: "管理控制台",
    cockpit: "管理员座舱",
    logged_as: "已登录为",
    my_curriculum: "我的课程",
    catalog: "浏览课程目录",
    settings: "账户设置",
    admin: "管理控制台",
    theme_default: "默认",
    theme_paper: "纸张",
    theme_focus: "专注",
    verifying_access: "正在验证管理员访问权限..."
  },
  PT: {
    dashboard: "Painel de Controle",
    reports: "Relatórios de Erros",
    users: "Gerenciamento de Usuários",
    curriculum: "Gerenciamento de Currículo",
    feedback: "Consultas & Feedback",
    health: "Saúde do Servidor",
    signout: "Sair",
    admin_panel: "Painel Administrativo OpenPrimer",
    cockpit: "Cockpit do Administrador",
    logged_as: "Conectado como",
    my_curriculum: "Meu Currículo",
    catalog: "Navegar no Catálogo",
    settings: "Configurações da Conta",
    admin: "Console do Administrador",
    theme_default: "Padrão",
    theme_paper: "Papel",
    theme_focus: "Foco",
    verifying_access: "Verificando Acesso Administrativo..."
  },
  AR: {
    dashboard: "لوحة التحكم",
    reports: "تقارير الأخطاء",
    users: "إدارة المستخدمين",
    curriculum: "إدارة المناهج",
    feedback: "الاستفسارات والتعليقات",
    health: "حالة الخادم",
    signout: "تسجيل الخروج",
    admin_panel: "لوحة أدمن OpenPrimer",
    cockpit: "مقصورة المسؤول",
    logged_as: "مسجل الدخول باسم",
    my_curriculum: "منهجي الدراسي",
    catalog: "تصفح الكتالوج",
    settings: "إعدادات الحساب",
    admin: "لوحة التحكم للمسؤول",
    theme_default: "الافتراضي",
    theme_paper: "ورقي",
    theme_focus: "التركيز",
    verifying_access: "التحقق من صلاحيات المسؤول..."
  },
  HI: {
    dashboard: "डैशबोर्ड",
    reports: "त्रुटि रिपोर्ट",
    users: "उपयोगकर्ता प्रबंधन",
    curriculum: "पाठ्यक्रम प्रबंधन",
    feedback: "पूछताछ और प्रतिक्रिया",
    health: "सर्वर स्वास्थ्य",
    signout: "साइन आउट",
    admin_panel: "OpenPrimer व्यवस्थापक पैनल",
    cockpit: "व्यवस्थापक कॉकपिट",
    logged_as: "इस रूप में लॉग इन हैं",
    my_curriculum: "मेरा पाठ्यक्रम",
    catalog: "कैटलॉग ब्राउज़ करें",
    settings: "खाता सेटिंग",
    admin: "व्यवस्थापक कंसोल",
    theme_default: "डिफ़ॉल्ट",
    theme_paper: "पेपर",
    theme_focus: "फोकस",
    verifying_access: "व्यवस्थापक पहुंच सत्यापित की जा रही है..."
  },
  UR: {
    dashboard: "ڈیش بورڈ",
    reports: "غلطی کی رپورٹیں",
    users: "صارف کا انتظام",
    curriculum: "نصاب کا انتظام",
    feedback: "پوچھ گچھ اور تاثرات",
    health: "سرور کی صحت",
    signout: "سائن آؤٹ",
    admin_panel: "اوپن پرائمر ایڈمن پینل",
    cockpit: "ایڈمن کاک پٹ",
    logged_as: "بطور لاگ ان ہیں",
    my_curriculum: "میرا نصاب",
    catalog: "کیٹلاگ براؤز کریں",
    settings: "اکاؤنٹ کی ترتیبات",
    admin: "ایڈمن کنسول",
    theme_default: "ڈیفالٹ",
    theme_paper: "کاغذ",
    theme_focus: "فوکس",
    verifying_access: "انتظامی رسائی کی تصدیق کی جا رہی ہے..."
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<'lang' | 'user' | null>(null);
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);
  const [readingMode, setReadingMode] = React.useState('dark');
  const [dynamicEmail, setDynamicEmail] = React.useState('admin@openprimer.app');
  const [dynamicRole, setDynamicRole] = React.useState('Administrator');
  const [isDbConnected, setIsDbConnected] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const isDefaultKey = !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your-anon-key';
        if (isDefaultKey) {
          setIsDbConnected(false);
          return;
        }
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
          setIsDbConnected(false);
        } else {
          setIsDbConnected(true);
        }
      } catch {
        setIsDbConnected(false);
      }
    };
    checkConnection();
  }, []);
  
  const { language: lang, setLanguage: setLang } = useLanguage();
  const t = ADMIN_STRINGS[lang as keyof typeof ADMIN_STRINGS] || ADMIN_STRINGS.EN;

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
      setReadingMode(savedMode);
    }

    const handleGlobalModeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setReadingMode(customEvent.detail);
    };
    window.addEventListener('op_reading_mode_changed', handleGlobalModeChange);
    return () => {
      window.removeEventListener('op_reading_mode_changed', handleGlobalModeChange);
    };
  }, []);

  const handleThemeSelect = (modeKey: string) => {
    setReadingMode(modeKey);
    localStorage.setItem('op_reading_mode', modeKey);
    
    const profileStr = localStorage.getItem('op_user_profile');
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        profile.preferredTheme = modeKey;
        localStorage.setItem('op_user_profile', JSON.stringify(profile));
      } catch (e) {}
    }
    
    window.dispatchEvent(new CustomEvent('op_reading_mode_changed', { detail: modeKey }));
  };

  // Load dynamic user identity: Supabase session first, localStorage fallback
  React.useEffect(() => {
    const loadUserIdentity = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setDynamicEmail(user.email);
          
          // Query the user's role from the public profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profile && profile.role === 'admin') {
            setDynamicRole(user.email.toLowerCase() === 'vanguard.mysterious@gmail.com' ? 'Vanguard Admin' : 'Administrator');
            setIsAuthorized(true);
            return;
          } else if (profileError) {
            throw new Error("Database query failed, falling back to local storage profile");
          } else {
            setIsAuthorized(false);
            router.push('/catalog');
            return;
          }
        }
      } catch {
        // Supabase unavailable — fall through to localStorage
      }
      // Fallback: read from localStorage profile set at login
      const profileStr = localStorage.getItem('op_user_profile');
      if (profileStr) {
        try {
          const profile = JSON.parse(profileStr);
          if (profile.email) {
            if (profile.role === 'admin') {
              setDynamicEmail(profile.email);
              setDynamicRole('Administrator');
              setIsAuthorized(true);
              return;
            }
          }
        } catch {}
      }
      setIsAuthorized(false);
      router.push('/catalog');
    };

    const session = localStorage.getItem('op_session');
    if (session !== 'true') {
      router.push('/login');
    } else {
      loadUserIdentity();
    }
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-[10px] tracking-[0.3em] font-black uppercase">
        {t.verifying_access || 'Verifying Administrative Access...'}
      </div>
    );
  }

  const NAV_ITEMS = [
    { label: t.dashboard, href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: t.users, href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: t.curriculum, href: '/admin/curriculum', icon: <BookOpen className="w-4 h-4" /> },
    { label: t.feedback, href: '/admin/feedback', icon: <MessageSquare className="w-4 h-4" /> },
    { label: t.health, href: '/admin/health', icon: <Activity className="w-4 h-4" /> },
  ];

  const languages = [
    { code: 'EN', flag: '🇺🇸', label: 'English' },
    { code: 'FR', flag: '🇫🇷', label: 'Français' },
    { code: 'ES', flag: '🇪🇸', label: 'Español' },
    { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'ZH', flag: '🇨🇳', label: '中文' },
    { code: 'PT', flag: '🇧🇷', label: 'Português' },
    { code: 'AR', flag: '🇸🇦', label: 'العربية' },
    { code: 'HI', flag: '🇮🇳', label: 'हिन्दी' },
    { code: 'UR', flag: '🇵🇰', label: 'اردو' }
  ];

  // Sort languages alphabetically (by label) and put the currently active language at the top of the list
  const sortedLanguages = [...languages].sort((a, b) => {
    const aIsSelected = a.code.toUpperCase() === lang.toUpperCase();
    const bIsSelected = b.code.toUpperCase() === lang.toUpperCase();
    
    if (aIsSelected) return -1;
    if (bIsSelected) return 1;
    
    return a.label.localeCompare(b.label, lang.toLowerCase());
  });

  const handleLogout = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.auth.signOut();
    } catch {}
    // Purge all local session data
    localStorage.removeItem('op_session');
    localStorage.removeItem('op_user_profile');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500">
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
          fixed inset-y-0 left-0 z-[100] w-64 border-r border-slate-900 bg-background flex flex-col transition-transform duration-300
          md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}>
          <div className="p-8">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span className="font-sans text-lg font-black tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
            </Link>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-2 ml-6 italic">{t.cockpit}</p>
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

          {/* Removed redundant Sign Out button as requested */}
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background flex flex-col h-full">
          {/* Top Navbar */}
          <header className="h-20 border-b border-slate-900 bg-background/80 backdrop-blur-md px-12 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{t.admin_panel}</span>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Language Selector */}
              <div className="relative" onMouseEnter={() => setActiveDropdown('lang')} onMouseLeave={() => setActiveDropdown(null)}>
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                  <span className="text-lg">{languages.find(l => l.code === lang)?.flag}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{lang}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform ${activeDropdown === 'lang' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'lang' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 rtl:left-0 rtl:right-auto mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden p-1">
                      {sortedLanguages.map(l => (
                        <button key={l.code} onClick={() => setLang(l.code as any)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${lang === l.code ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
                          <span>{l.flag} {l.label}</span>
                          {lang === l.code && <CheckCircle className="w-3 h-3 text-blue-500" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
                {['Default', 'Paper', 'Focus'].map(mode => {
                  const modeKey = mode === 'Default' ? 'dark' : mode.toLowerCase();
                  const active = readingMode === modeKey;
                  const modeLabel = mode === 'Default' ? (t as any).theme_default || 'Default'
                    : mode === 'Paper' ? (t as any).theme_paper || 'Paper'
                    : (t as any).theme_focus || 'Focus';
                  return (
                    <button 
                      key={mode}
                      onClick={() => handleThemeSelect(modeKey)}
                      className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
                    >
                      {modeLabel}
                    </button>
                  );
                })}
              </div>

              <div className="w-px h-6 bg-slate-900" />

              {/* User Dropdown */}
              <div className="relative" onMouseEnter={() => setActiveDropdown('user')} onMouseLeave={() => setActiveDropdown(null)}>
                <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all overflow-hidden group">
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-400" />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'user' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 rtl:left-0 rtl:right-auto mt-2 w-64 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-[110] overflow-hidden p-2">
                      <div className="px-4 py-4 border-b border-slate-800/50 mb-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1 italic">{t.logged_as}</p>
                        <p className="text-xs font-bold text-white truncate">{dynamicEmail}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-blue-500 mt-1">{dynamicRole}</p>
                      </div>
                      <Link href="/profile/curriculum" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                        <GraduationCap className="w-4 h-4" /> {t.my_curriculum}
                      </Link>
                      <Link href="/catalog" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                        <Brain className="w-4 h-4" /> {t.catalog}
                      </Link>
                      <Link href="/profile/settings" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                        <Settings className="w-4 h-4" /> {t.settings}
                      </Link>
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        <ShieldAlert className="w-4 h-4" /> {t.admin}
                      </Link>
                      <div className="h-0.5 bg-slate-800/50 my-1" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                        <LogOut className="w-4 h-4" /> {t.signout}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          <main className="p-12 flex-1">
            {children}
          </main>
          <AdminFooter />
        </div>
      </div>
      {/* Global service degradation toast — discrete bottom-left banners */}
      <ServiceToast lang={lang} />
    </div>
  );
}
