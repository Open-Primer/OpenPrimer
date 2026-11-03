"use client";

import React from 'react';
import { Info, AlertTriangle, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * @file Alert.tsx
 * @description Standard alert callout box used in MDX lessons (note, tip, warning, caution, important).
 */

const isChildrenEmpty = (children: React.ReactNode): boolean => {
  if (children === null || children === undefined) {
    return true;
  }
  if (typeof children === 'string') {
    return children.trim() === '';
  }
  if (typeof children === 'number') {
    return false;
  }
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



const ALERT_TITLES: Record<string, Record<string, string>> = {
  note: {
    EN: "Note",
    FR: "Note",
    ES: "Nota",
    DE: "Hinweis",
    ZH: "提示",
    PT: "Nota",
    AR: "ملاحظة",
    HI: "नोट",
    UR: "نوٹ"
  },
  warning: {
    EN: "Warning",
    FR: "Avertissement",
    ES: "Advertencia",
    DE: "Warnung",
    ZH: "警告",
    PT: "Aviso",
    AR: "تحذير",
    HI: "चेतावनी",
    UR: "انتباہ"
  },
  info: {
    EN: "Info",
    FR: "Info",
    ES: "Información",
    DE: "Info",
    ZH: "信息",
    PT: "Informação",
    AR: "معلومات",
    HI: "जानकारी",
    UR: "معلومات"
  },
  important: {
    EN: "Important",
    FR: "Important",
    ES: "Importante",
    DE: "Importante",
    ZH: "重要",
    PT: "Importante",
    AR: "هام",
    HI: "महत्वपूर्ण",
    UR: "اہم"
  },
  tip: {
    EN: "Tip",
    FR: "Conseil",
    ES: "Consejo",
    DE: "Tipp",
    ZH: "建议",
    PT: "Dica",
    AR: "نصيحة",
    HI: "सुझाव",
    UR: "مشورہ"
  },
  caution: {
    EN: "Caution",
    FR: "Attention",
    ES: "Precaución",
    DE: "Achtung",
    ZH: "注意",
    PT: "Atenção",
    AR: "تنبيه",
    HI: "सावधानी",
    UR: "احتیاط"
  }
};

const Alert = ({ type, children }: { type: string; children: React.ReactNode }) => {
  if (isChildrenEmpty(children)) return null;
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase();
  const t = (type || 'note').toLowerCase();
  
  let icon = <Info className="w-4 h-4 text-blue-400" />;
  let titleKey = "note";
  let borderClass = "border-l-blue-500 bg-blue-500/5 dark:bg-blue-500/[0.04] border-blue-500/20";
  let titleColor = "text-blue-500 dark:text-blue-400";

  if (t === 'warning') {
    icon = <AlertTriangle className="w-4 h-4 text-amber-500" />;
    titleKey = "warning";
    borderClass = "border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/[0.04] border-amber-500/20";
    titleColor = "text-amber-500 dark:text-amber-400";
  } else if (t === 'info') {
    icon = <Info className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
    titleKey = "info";
    borderClass = "border-l-blue-500 bg-blue-500/5 dark:bg-blue-500/[0.04] border-blue-500/20";
    titleColor = "text-blue-500 dark:text-blue-400";
  } else if (t === 'important') {
    icon = <ShieldAlert className="w-4 h-4 text-rose-500" />;
    titleKey = "important";
    borderClass = "border-l-rose-500 bg-rose-500/5 dark:bg-rose-500/[0.04] border-rose-500/20";
    titleColor = "text-rose-500 dark:text-rose-400";
  } else if (t === 'tip') {
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    titleKey = "tip";
    borderClass = "border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/[0.04] border-emerald-500/20";
    titleColor = "text-emerald-500 dark:text-emerald-400";
  } else if (t === 'caution') {
    icon = <AlertOctagon className="w-4 h-4 text-red-500" />;
    titleKey = "caution";
    borderClass = "border-l-red-500 bg-red-500/5 dark:bg-red-500/[0.04] border-red-500/20";
    titleColor = "text-red-500 dark:text-red-400";
  }

  const title = (ALERT_TITLES[titleKey] && ALERT_TITLES[titleKey][langKey]) || ALERT_TITLES[titleKey]?.EN || "Note";


  return (
    <div className={`my-6 p-5 rounded-2xl border-l-4 ${borderClass} shadow-sm custom-alert alert-${t} transition-all duration-300`}>
      <div className="flex items-center gap-2 mb-2 select-none">
        <div className="flex items-center justify-center">
          {icon}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${titleColor}`}>
          {title}
        </span>
      </div>
      <div className="text-[13px] leading-relaxed font-medium text-slate-800 dark:text-slate-200 alert-content">
        {children}
      </div>
    </div>
  );
};



export { Alert, isChildrenEmpty, ALERT_TITLES };
export default Alert;
