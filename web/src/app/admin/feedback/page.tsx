"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Mail, ArrowRight, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService, ContactFeedback } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';

export const FEEDBACK_STRINGS = {
  EN: {
    title: "Inquiries & Feedback",
    subtitle: "Read-only log of submitted website contact form inquiries. Strict 90-day automatic retention policy.",
    refresh: "Refresh Feed",
    loading: "Loading feedback feed...",
    days_left: "days left",
    translating: "Translating...",
    show_original: "Show Original",
    translate: "Translate",
    reply: "Reply via Email",
    empty_title: "No inquiries found",
    empty_desc: "Your contact mailbox is currently clean and empty."
  },
  FR: {
    title: "Boîte de Réception des Messages",
    subtitle: "Consultez les messages envoyés depuis le formulaire de contact. Rétention automatique stricte de 90 jours.",
    refresh: "Rafraîchir",
    loading: "Chargement des messages...",
    days_left: "jours restants",
    translating: "Traduction...",
    show_original: "Voir Original",
    translate: "Traduire",
    reply: "Répondre par Email",
    empty_title: "Boîte vide",
    empty_desc: "Aucun message de contact n'est présent dans la boîte."
  },
  ES: {
    title: "Consultas y Comentarios",
    subtitle: "Registro de solo lectura de las consultas enviadas. Política de retención automática estricta de 90 días.",
    refresh: "Actualizar",
    loading: "Cargando comentarios...",
    days_left: "días restantes",
    translating: "Traduciendo...",
    show_original: "Ver Original",
    translate: "Traducir",
    reply: "Responder por Correo",
    empty_title: "No se encontraron consultas",
    empty_desc: "Su buzón de contacto está actualmente limpio y vacío."
  },
  DE: {
    title: "Anfragen & Feedback",
    subtitle: "Schreibgeschütztes Protokoll eingegangener Kontaktformularanfragen. Strikte automatische Aufbewahrungsfrist von 90 Tagen.",
    refresh: "Aktualisieren",
    loading: "Feedback-Feed wird geladen...",
    days_left: "Tage übrig",
    translating: "Wird übersetzt...",
    show_original: "Original anzeigen",
    translate: "Übersetzen",
    reply: "Per E-Mail antworten",
    empty_title: "Keine Anfragen gefunden",
    empty_desc: "Ihr Kontaktpostfach ist derzeit sauber und leer."
  },
  ZH: {
    title: "咨询与反馈",
    subtitle: "提交的网站联系表单咨询的只读日志。严格的90天自动保留政策。",
    refresh: "刷新列表",
    loading: "正在加载反馈列表...",
    days_left: "天剩余",
    translating: "正在翻译...",
    show_original: "显示原文",
    translate: "翻译",
    reply: "通过邮件回复",
    empty_title: "未找到咨询信息",
    empty_desc: "您的联系邮箱目前干净且空无一物。"
  }
};

export default function AdminFeedbackPage() {
  const { language: globalLang } = useLanguage();
  const lang = (globalLang || 'EN') as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH';
  const t = FEEDBACK_STRINGS[lang] || FEEDBACK_STRINGS.EN;

  const [contactFeedbacks, setContactFeedbacks] = useState<ContactFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Translation States
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({});

  const loadFeedbacks = async () => {
    setLoading(true);
    const { data } = await dbService.getContactFeedbacks();
    setContactFeedbacks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const translateFeedback = async (id: string, text: string) => {
    if (translatedMessages[id]) {
      // Toggle back to original by removing from translatedMessages
      setTranslatedMessages(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      return;
    }
    if (translatingIds[id]) return;

    setTranslatingIds(prev => ({ ...prev, [id]: true }));
    try {
      const targetLang = lang.toLowerCase();
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await res.json();
      const translated = data[0].map((x: any) => x[0]).join('');
      setTranslatedMessages(prev => ({ ...prev, [id]: translated }));
    } catch (error) {
      console.error("Translation failed", error);
    } finally {
      setTranslatingIds(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
            <MessageSquare className="w-8 h-8 text-rose-500" />
            {t.title}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {t.subtitle}
          </p>
        </div>

        <button 
          onClick={loadFeedbacks}
          className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-750 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-xl transition-all shadow-md cursor-pointer"
        >
          {t.refresh}
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono italic">{t.loading}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {contactFeedbacks.map((fb) => {
            // Calculate remaining retention limit days out of 90:
            const daysOld = Math.floor((Date.now() - new Date(fb.timestamp).getTime()) / (24 * 60 * 60 * 1000));
            const daysRemaining = Math.max(0, 90 - daysOld);

            const formattedDate = new Date(fb.timestamp).toLocaleDateString(lang === 'FR' ? 'fr-FR' : 'en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <motion.div 
                key={fb.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-slate-900/35 border border-slate-850/80 rounded-[36px] flex flex-col justify-between space-y-6 shadow-xl hover:border-rose-500/20 hover:bg-slate-900/50 transition-all group"
              >
                <div className="space-y-5">
                  {/* Header metadata row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-200">{fb.name}</h4>
                      <a 
                        href={`mailto:${fb.email}`}
                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-semibold font-mono underline block"
                      >
                        {fb.email}
                      </a>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="px-3 py-1 border border-rose-500/25 bg-rose-500/5 text-rose-400 text-[8px] font-black uppercase rounded-full tracking-wider animate-pulse">
                        {daysRemaining} {t.days_left}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono font-semibold">
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Message body blockquote */}
                  <div className="p-5 bg-slate-950/80 border border-slate-900 rounded-2xl relative overflow-hidden space-y-4">
                    <div className="absolute top-2 left-2 text-[28px] font-serif text-slate-900 leading-none shrink-0 pointer-events-none">“</div>
                    <p className="text-xs text-slate-350 leading-relaxed pl-4 py-1 italic whitespace-pre-wrap">
                      {translatedMessages[fb.id] || fb.message}
                    </p>

                    {/* Translate action button */}
                    <div className="flex justify-end pl-4">
                      <button
                        onClick={() => translateFeedback(fb.id, fb.message)}
                        disabled={translatingIds[fb.id]}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Globe className={`w-3.5 h-3.5 ${translatingIds[fb.id] ? 'animate-spin' : ''}`} />
                        <span>
                          {translatingIds[fb.id] ? t.translating : 
                           translatedMessages[fb.id] ? t.show_original :
                           t.translate}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reply mailbox CTA */}
                <div className="pt-4 border-t border-slate-900/70 flex justify-end">
                  <a
                    href={`mailto:${fb.email}?subject=Re: OpenPrimer Inquiry&body=Hi ${fb.name},%0A%0AThank you for reaching out to us. Regarding your message:%0D%0A%22${encodeURIComponent(fb.message.substring(0, 100))}${fb.message.length > 100 ? '...' : ''}%22%0A%0A`}
                    className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white text-[9.5px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-600/10 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {t.reply}
                  </a>
                </div>
              </motion.div>
            );
          })}

          {contactFeedbacks.length === 0 && (
            <div className="col-span-full p-24 border-2 border-dashed border-slate-900 rounded-[48px] text-center space-y-4">
              <MessageSquare className="w-12 h-12 text-slate-800 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-400">{t.empty_title}</p>
                <p className="text-xs text-slate-655 max-w-xs mx-auto">
                  {t.empty_desc}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
