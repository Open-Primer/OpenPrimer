'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import {
  WifiOff, Activity, ArrowLeft, RefreshCw, Database, Mail, Cpu, Image,
  CheckCircle, AlertTriangle, XCircle, Clock, Zap, ArrowUpRight,
  ShieldCheck, ShieldAlert, Key, Eye, EyeOff, Save, Check, ExternalLink
} from 'lucide-react';
import type { HealthResponse, ServiceHealth } from '@/app/api/health/route';
import { useServiceStatus } from '@/lib/serviceStatus';
import { dbService } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';
import { HEALTH_STRINGS } from './components/healthStrings';
import { ServiceCard, StatusBadge } from './components/ServiceCard';
import { DowntimeHistoryPanel } from './components/DowntimeHistoryPanel';
import { HotSwapApiKeysPanel } from './components/HotSwapApiKeysPanel';

export default function ServerHealthPage() {
  const { language } = useLanguage();
  const lang = (language || 'EN') as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR';
  const t = (HEALTH_STRINGS[lang] || HEALTH_STRINGS.EN) as typeof HEALTH_STRINGS.EN;
  const { health, isChecking, refresh } = useServiceStatus(10_000);

  const [slaHistory, setSlaHistory] = useState<any[]>(() => []);
  const [slaSource, setSlaSource] = useState<'prng' | 'database'>('database');
  const [hoveredDay, setHoveredDay] = useState<any | null>(null);


  const getServiceStats = (id: 'db' | 'email' | 'ai' | 'images' | 'smithsonian' | 'unsplash') => {
    if (!slaHistory || slaHistory.length === 0) {
      return {
        avg: '0.00%',
        downtime: t.no_data || 'No data',
        incident: t.db_conn_req || 'Database connection required'
      };
    }
    const sum = slaHistory.reduce((acc, entry) => acc + (entry[id] ?? 100), 0);
    const avg = sum / slaHistory.length;

    const downtimeHours = slaHistory.reduce((acc, entry) => acc + (100 - (entry[id] ?? 100)) / 100 * 24, 0);

    let downtimeStr = '';
    if (downtimeHours === 0) {
      downtimeStr = t.no_downtime || 'No downtime';
    } else if (downtimeHours < 1) {
      const mins = Math.round(downtimeHours * 60);
      downtimeStr = (t.downtime_min || 'Downtime: {min}m').replace('{min}', String(mins));
    } else {
      const hrs = downtimeHours.toFixed(1);
      downtimeStr = (t.downtime_hour || 'Downtime: {hour}h').replace('{hour}', String(hrs));
    }

    let incident = t.no_major_incidents || 'No major incidents';
    if (avg < 100) {
      if (id === 'db') incident = t.inc_db_upgrade || 'Incident: Replica DB upgrade';
      if (id === 'email') incident = t.inc_rate_limit || 'Incident: Rate-limit tuning';
      if (id === 'ai') incident = t.inc_quota_scaling || 'Incident: LLM quota scaling';
      if (id === 'images') incident = t.inc_oom || 'Incident: Batch out-of-memory';
      if (id === 'smithsonian') incident = (t as any).inc_smithsonian || 'Incident: Smithsonian rate-limiting';
      if (id === 'unsplash') incident = (t as any).inc_unsplash || 'Incident: Unsplash credit exhaustion';
    }

    return {
      avg: `${avg.toFixed(2)}%`,
      downtime: downtimeStr,
      incident
    };
  };

  const overallAvg = (() => {
    if (!slaHistory || slaHistory.length === 0) return 0;
    let total = 0;
    slaHistory.forEach(day => {
      total += (day.db + day.email + day.ai + day.images + (day.smithsonian ?? 100) + (day.unsplash ?? 100)) / 6;
    });
    return total / slaHistory.length;
  })();

  const getDayStatus = (dayData: typeof slaHistory[0]) => {
    const vals = [dayData.db, dayData.email, dayData.ai, dayData.images, dayData.smithsonian ?? 100, dayData.unsplash ?? 100];
    const maxVal = Math.max(...vals);
    if (maxVal === 0) return 'no_data';
    
    const minVal = Math.min(...vals);
    if (minVal < 98) return 'outage';
    if (minVal < 100) return 'degraded';
    return 'nominal';
  };

  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [smithsonianApiKey, setSmithsonianApiKey] = useState('');
  const [unsplashApiKey, setUnsplashApiKey] = useState('');
  const [showSbKey, setShowSbKey] = useState(false);
  const [showResendKey, setShowResendKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showSmithsonianKey, setShowSmithsonianKey] = useState(false);
  const [showUnsplashKey, setShowUnsplashKey] = useState(false);
  const [notif, setNotif] = useState<string | null>(null);

  // Load hot-swap keys and SLA history on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabaseUrl(localStorage.getItem('op_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://supabase.io');
      setSupabaseAnonKey(localStorage.getItem('op_supabase_anon_key') || '');
      setResendApiKey(localStorage.getItem('op_resend_api_key') || '');
      setGeminiApiKey(localStorage.getItem('op_gemini_api_key') || '');
      
      const localSmithsonian = localStorage.getItem('op_smithsonian_api_key') || '';
      const localUnsplash = localStorage.getItem('op_unsplash_api_key') || '';
      setSmithsonianApiKey(localSmithsonian);
      setUnsplashApiKey(localUnsplash);

      // Fetch dynamic database SLA History and also load permanent keys from DB
      const loadDbSystemParametersAndSla = async () => {
        try {
          const adminSession = localStorage.getItem('op_session') || '';
          const headers: Record<string, string> = {};
          if (localStorage.getItem('op_supabase_url')) headers['x-supabase-url'] = localStorage.getItem('op_supabase_url') || '';
          if (localStorage.getItem('op_supabase_anon_key')) headers['x-supabase-anon-key'] = localStorage.getItem('op_supabase_anon_key') || '';
          if (adminSession === 'true') headers['x-admin-session'] = 'true';

          const res = await fetch('/api/health/sla', { headers });
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              setSlaHistory(json.data);
              setSlaSource(json.source);
            }
          }
        } catch (err) {
          console.warn("Failed to fetch database SLA history", err);
        }

        try {
          const { data: params } = await dbService.getSystemParameters();
          if (params && params.length > 0) {
            params.forEach((param: any) => {
              if (param.key === 'smithsonianApiKey' && param.value) {
                setSmithsonianApiKey(param.value);
                localStorage.setItem('op_smithsonian_api_key', param.value);
              }
              if (param.key === 'unsplashApiKey' && param.value) {
                setUnsplashApiKey(param.value);
                localStorage.setItem('op_unsplash_api_key', param.value);
              }
            });
          }
        } catch (err) {
          console.warn("Failed to load Smithsonian / Unsplash keys from DB", err);
        }
      };

      loadDbSystemParametersAndSla();
    }
  }, []);

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseUrl && supabaseUrl !== process.env.NEXT_PUBLIC_SUPABASE_URL) localStorage.setItem('op_supabase_url', supabaseUrl);
    else localStorage.removeItem('op_supabase_url');

    if (supabaseAnonKey) localStorage.setItem('op_supabase_anon_key', supabaseAnonKey);
    else localStorage.removeItem('op_supabase_anon_key');

    if (resendApiKey) localStorage.setItem('op_resend_api_key', resendApiKey);
    else localStorage.removeItem('op_resend_api_key');

    if (geminiApiKey) localStorage.setItem('op_gemini_api_key', geminiApiKey);
    else localStorage.removeItem('op_gemini_api_key');

    if (smithsonianApiKey) {
      localStorage.setItem('op_smithsonian_api_key', smithsonianApiKey);
      await dbService.saveSystemParameter({ key: 'smithsonianApiKey', value: smithsonianApiKey });
    } else {
      localStorage.removeItem('op_smithsonian_api_key');
      await dbService.saveSystemParameter({ key: 'smithsonianApiKey', value: '' });
    }

    if (unsplashApiKey) {
      localStorage.setItem('op_unsplash_api_key', unsplashApiKey);
      await dbService.saveSystemParameter({ key: 'unsplashApiKey', value: unsplashApiKey });
    } else {
      localStorage.removeItem('op_unsplash_api_key');
      await dbService.saveSystemParameter({ key: 'unsplashApiKey', value: '' });
    }

    setNotif(t.keys_applied || 'API Keys successfully hot-swapped!');
    setTimeout(() => setNotif(null), 4000);
    refresh();
  };

  const handleResetKeys = async () => {
    localStorage.removeItem('op_supabase_url');
    localStorage.removeItem('op_supabase_anon_key');
    localStorage.removeItem('op_resend_api_key');
    localStorage.removeItem('op_gemini_api_key');
    localStorage.removeItem('op_smithsonian_api_key');
    localStorage.removeItem('op_unsplash_api_key');
    
    await dbService.saveSystemParameter({ key: 'smithsonianApiKey', value: '' });
    await dbService.saveSystemParameter({ key: 'unsplashApiKey', value: '' });

    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://supabase.io');
    setSupabaseAnonKey('');
    setResendApiKey('');
    setGeminiApiKey('');
    setSmithsonianApiKey('');
    setUnsplashApiKey('');
    setNotif(t.keys_reset || 'Returned to default server keys.');
    setTimeout(() => setNotif(null), 4000);
    refresh();
  };

  const services = Object.values(health);
  const allOk = services.every((s: any) => s.status === 'ok');
  const anyOffline = services.some((s: any) => s.status === 'offline');

  const strings = {
    EN: {
      cfg_title: '🛠️ Hot-Swap API Keys Configurator',
      cfg_desc: 'Temporarily override server environment keys in this browser session. Securely passed in authenticated request headers.',
      lbl_sb_url: 'Supabase Project URL',
      lbl_sb_key: 'Supabase Anon Public Key',
      lbl_resend: 'Resend API Key',
      lbl_gemini: 'Gemini API Key or Service Account JSON',
      lbl_gemini_help: 'Paste a Gemini API key, a Service Account JSON object, or a JSON array of multiple Service Accounts to enable multi-project load-balancing.',
      lbl_smithsonian: 'Smithsonian API Key',
      lbl_unsplash: 'Unsplash Access Key',
      btn_apply: 'Apply Hot-Swap Keys',
      btn_reset: 'Reset to Defaults'
    },
    FR: {
      cfg_title: '🛠️ Configurateur de Clés API à Chaud',
      cfg_desc: 'Surcharger temporairement les clés serveurs pour cette session de navigateur. Transmis en toute sécurité via en-têtes requêtes.',
      lbl_sb_url: 'URL du Projet Supabase',
      lbl_sb_key: 'Clé Publique Anon Supabase',
      lbl_resend: 'Clé API Resend',
      lbl_gemini: 'Clé API Gemini ou Compte de Service JSON',
      lbl_gemini_help: 'Collez une clé API Gemini, un objet JSON de compte de service GCP, ou un tableau JSON de plusieurs comptes de service pour activer l\'équilibrage multi-projets.',
      lbl_smithsonian: 'Clé API Smithsonian',
      lbl_unsplash: "Clé d'Accès Unsplash",
      btn_apply: 'Appliquer les Clés',
      btn_reset: 'Réinitialiser aux Défauts'
    },
    ES: {
      cfg_title: '🛠️ Configurador de Claves API en Caliente',
      cfg_desc: 'Anule temporalmente las claves del servidor en esta sesión. Transmitido de forma segura a través de encabezados.',
      lbl_sb_url: 'URL del Proyecto Supabase',
      lbl_sb_key: 'Clave Pública Anon Supabase',
      lbl_resend: 'Clave API Resend',
      lbl_gemini: 'Clave API Gemini o Cuenta de Servicio JSON',
      lbl_gemini_help: 'Pegue una clave API de Gemini, un objeto JSON de cuenta de servicio de GCP o una matriz JSON de varias cuentas de servicio para habilitar el equilibrio de carga multiproyecto.',
      lbl_smithsonian: 'Clave API Smithsonian',
      lbl_unsplash: 'Clave de Acceso Unsplash',
      btn_apply: 'Aplicar Cambios',
      btn_reset: 'Restablecer Valores'
    },
    DE: {
      cfg_title: '🛠️ Hot-Swap API-Schlüssel Konfigurator',
      cfg_desc: 'Server-Umgebungsschlüssel in dieser Sitzung vorübergehend überschreiben. Sicher übertragen über Anfrage-Header.',
      lbl_sb_url: 'Supabase Projekt-URL',
      lbl_sb_key: 'Supabase Anon Public Key',
      lbl_resend: 'Resend API-Schlüssel',
      lbl_gemini: 'Gemini API-Schlüssel oder Service-Account-JSON',
      lbl_gemini_help: 'Fügen Sie einen Gemini-API-Schlüssel, ein Service-Account-JSON-Objekt oder ein JSON-Array mit mehreren Service-Accounts ein, um die Lastverteilung über plusieurs Projekte zu aktivieren.',
      lbl_smithsonian: 'Smithsonian API-Schlüssel',
      lbl_unsplash: 'Unsplash-Zugriffsschlüssel',
      btn_apply: 'Schlüssel anwenden',
      btn_reset: 'Auf Standard zurücksetzen'
    },
    ZH: {
      cfg_title: '🛠️ 热插拔 API 密钥配置器',
      cfg_desc: '在当前浏览器会话中临时覆盖服务器环境变量密钥。密钥通过安全请求头动态传输。',
      lbl_sb_url: 'Supabase 项目 URL',
      lbl_sb_key: 'Supabase Anon 公钥',
      lbl_resend: 'Resend 邮件 API 密钥',
      lbl_gemini: 'Gemini API 密钥或服务账号 JSON',
      lbl_gemini_help: '粘贴 Gemini API 密钥、GCP 服务账号 JSON 对象或包含多个服务账号的 JSON 数组，以启用多项目负载均衡。',
      lbl_smithsonian: 'Smithsonian API 密钥',
      lbl_unsplash: 'Unsplash 访问密钥',
      btn_apply: '应用热插拔密钥',
      btn_reset: '重置为默认值'
    },
    PT: {
      cfg_title: '🛠️ Configurador de Chaves API Hot-Swap',
      cfg_desc: 'Substituir temporariamente as chaves do ambiente do servidor nesta sessão do navegador. Passado com segurança em cabeçalhos de solicitação autenticados.',
      lbl_sb_url: 'URL do Projeto Supabase',
      lbl_sb_key: 'Chave Pública Anon do Supabase',
      lbl_resend: 'Chave API Resend',
      lbl_gemini: 'Chave API Gemini ou JSON da Conta de Serviço',
      lbl_gemini_help: 'Cole uma chave API Gemini, um objeto JSON de Conta de Serviço do GCP ou um array JSON de várias Contas de Serviço para ativar o equilíbrio de carga multiprojeto.',
      lbl_smithsonian: 'Chave API Smithsonian',
      lbl_unsplash: 'Chave de Acesso Unsplash',
      btn_apply: 'Aplicar Chaves Hot-Swap',
      btn_reset: 'Repor Padrões'
    },
    AR: {
      cfg_title: '🛠️ مكون مفاتيح واجهة برمجة التطبيقات الساخن (Hot-Swap)',
      cfg_desc: 'تجاوز مؤقت لمفاتيح بيئة الخادم في جلسة المتصفح هذه. يتم تمريرها بأمان في رؤوس الطلبات المصادق عليها.',
      lbl_sb_url: 'رابط مشروع Supabase',
      lbl_sb_key: 'المفتاح العام المجهول لـ Supabase',
      lbl_resend: 'مفتاح واجهة برمجة تطبيقات Resend',
      lbl_gemini: 'مفتاح واجهة Gemini أو ملف JSON لحساب الخدمة',
      lbl_gemini_help: 'ألصق مفتاح واجهة Gemini، أو كائن JSON لحساب خدمة GCP，أو مصفوفة JSON لحسابات خدمة متعددة لتمكين موازنة الحمل متعددة المشاريع.',
      lbl_smithsonian: 'مفتاح واجهة Smithsonian',
      lbl_unsplash: 'مفتاح وصول Unsplash',
      btn_apply: 'تطبيق مفاتيح الاستبدال الساخن',
      btn_reset: 'إعادة تعيين إلى الافتراضيات'
    },
    HI: {
      cfg_title: '🛠️ हॉट-स्वैप API कुंजियाँ कॉन्फ़िगरर',
      cfg_desc: 'इस ब्राउज़र सत्र में सर्वर पर्यावरण कुंजियों को अस्थायी रूप से ओवरराइड करें। प्रमाणित अनुरोध हेडर में सुरक्षित रूप से पारित किया गया।',
      lbl_sb_url: 'Supabase प्रोजेक्ट URL',
      lbl_sb_key: 'Supabase अनाम सार्वजनिक कुंजी',
      lbl_resend: 'Resend API कुंजी',
      lbl_gemini: 'Gemini API कुंजी या सेवा खाता JSON',
      lbl_gemini_help: 'मल्टी-प्रोजेक्ट लोड बैलेंसिंग सक्षम करने के लिए जेमिनी एपीआई कुंजी, जीसीपी सेवा खाता जेएसओएन ऑब्जेक्ट, या कई सेवा खातों की जेएसओएन सरणी पेस्ट करें।',
      lbl_smithsonian: 'Smithsonian API कुंजी',
      lbl_unsplash: 'Unsplash एक्सेस कुंजी',
      btn_apply: 'हॉट-स्वैप कुंजियाँ लागू करें',
      btn_reset: 'डिफ़ॉल्ट पर रीसेट करें'
    },
    UR: {
      cfg_title: '🛠️ ہاٹ-سوپ API کیز کنفیگرر',
      cfg_desc: 'اس براؤزر سیشن میں عارضی طور پر سرور کی ماحولیاتی کیز کو اوور رائیڈ کریں۔ تصدیق شدہ درخواست ہیڈرز میں محفوظ طریقے سے منتقل کیا جاتا ہے۔',
      lbl_sb_url: 'Supabase پروجیکٹ URL',
      lbl_sb_key: 'Supabase Anon پبلک کی',
      lbl_resend: 'Resend API کی',
      lbl_gemini: 'Gemini API کی یا سروس اکاؤنٹ JSON',
      lbl_gemini_help: 'ملٹی پروجیکٹ لوڈ بیلنسنگ کو فعال کرنے کے لیے جیمنی API کلید، GCP سروس اکاؤنٹ JSON آبجیکٹ، یا متعدد سروس اکاؤنٹس کی JSON صف پیسٹ کریں۔',
      lbl_smithsonian: 'Smithsonian API کی',
      lbl_unsplash: 'Unsplash ایکسیس کی',
      btn_apply: 'ہاٹ-سوپ کیز لاگو کریں',
      btn_reset: 'ڈیفالٹ پر ری سیٹ کریں'
    }
  };

  const currentCfg = strings[lang] || strings.EN;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
            <Activity className={`w-8 h-8 ${allOk ? 'text-emerald-500' : anyOffline ? 'text-red-500' : 'text-amber-500'}`} />
            {t.title}
          </h1>
          <p className="text-xs text-slate-400 font-medium">{t.subtitle}</p>
          <p className="text-slate-700 text-[10px] pt-1 flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <RefreshCw className="w-3 h-3 animate-pulse" /> {t.auto_refresh}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={refresh}
            disabled={isChecking}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? t.refreshing : t.refresh}
          </button>
        </div>
      </div>

      {/* Global status banner */}
      {allOk && (
        <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <p className="text-sm font-semibold text-emerald-300">{t.status_ok} — {(t as any).sys_all_nominal || 'All systems nominal'}</p>
        </div>
      )}
      {anyOffline && (
        <div className="flex items-center gap-3 px-6 py-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
          <WifiOff className="w-5 h-5 text-red-400" />
          <p className="text-sm font-semibold text-red-300">{t.status_offline} — {(t as any).sys_unreachable || 'One or more services are unreachable'}</p>
        </div>
      )}


        {/* SECTION: DOWNTIME OVER LAST 365 DAYS */}
        <DowntimeHistoryPanel
          t={t}
          days365={slaHistory}
          hoveredDay={hoveredDay}
          setHoveredDay={setHoveredDay}
          lang={lang}
          getServiceStats={getServiceStats}
          overallAvg={overallAvg}
          slaHistory={slaHistory}
          getDayStatus={getDayStatus}
        />

        {/* Hot-Swap API Keys Configurator Form */}
        <HotSwapApiKeysPanel
          t={t}
          currentCfg={currentCfg}
          notif={notif}
          supabaseUrl={supabaseUrl}
          setSupabaseUrl={setSupabaseUrl}
          supabaseAnonKey={supabaseAnonKey}
          setSupabaseAnonKey={setSupabaseAnonKey}
          resendApiKey={resendApiKey}
          setResendApiKey={setResendApiKey}
          geminiApiKey={geminiApiKey}
          setGeminiApiKey={setGeminiApiKey}
          smithsonianApiKey={smithsonianApiKey}
          setSmithsonianApiKey={setSmithsonianApiKey}
          unsplashApiKey={unsplashApiKey}
          setUnsplashApiKey={setUnsplashApiKey}
          showSbKey={showSbKey}
          setShowSbKey={setShowSbKey}
          showResendKey={showResendKey}
          setShowResendKey={setShowResendKey}
          showGeminiKey={showGeminiKey}
          setShowGeminiKey={setShowGeminiKey}
          showSmithsonianKey={showSmithsonianKey}
          setShowSmithsonianKey={setShowSmithsonianKey}
          showUnsplashKey={showUnsplashKey}
          setShowUnsplashKey={setShowUnsplashKey}
          handleSaveKeys={handleSaveKeys}
          handleResetKeys={handleResetKeys}
        />
        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((svc: any) => (
            <ServiceCard key={svc.id} svc={svc} t={t} lang={lang} />
          ))}
        </div>
    </div>
  );
}
