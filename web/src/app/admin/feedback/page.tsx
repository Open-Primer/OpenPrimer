"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Mail, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService, ContactFeedback } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminFeedbackPage() {
  const { language: lang } = useLanguage();
  const [contactFeedbacks, setContactFeedbacks] = useState<ContactFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadFeedbacks = async () => {
    setLoading(true);
    const { data } = await dbService.getContactFeedbacks();
    setContactFeedbacks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-900 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-white">
            <MessageSquare className="w-9 h-9 text-rose-500" />
            {lang === 'FR' ? 'Boîte de Réception des Messages' : 'Inquiries & Feedback'}
          </h1>
          <p className="text-xs text-slate-400">
            {lang === 'FR' 
              ? 'Consultez les messages envoyés depuis le formulaire de contact. Rétention automatique stricte de 90 jours.' 
              : 'Read-only log of submitted website contact form inquiries. Strict 90-day automatic retention policy.'}
          </p>
        </div>

        <button 
          onClick={loadFeedbacks}
          className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-750 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-xl transition-all shadow-md"
        >
          {lang === 'FR' ? 'Rafraîchir' : 'Refresh Feed'}
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono italic">Loading feedback feed...</p>
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
                        {daysRemaining} {lang === 'FR' ? 'jours restants' : 'days left'}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono font-semibold">
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Message body blockquote */}
                  <div className="p-5 bg-slate-950/80 border border-slate-900 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-2 left-2 text-[28px] font-serif text-slate-900 leading-none shrink-0 pointer-events-none">“</div>
                    <p className="text-xs text-slate-350 leading-relaxed pl-4 py-1 italic whitespace-pre-wrap">
                      {fb.message}
                    </p>
                  </div>
                </div>

                {/* Reply mailbox CTA */}
                <div className="pt-4 border-t border-slate-900/70 flex justify-end">
                  <a
                    href={`mailto:${fb.email}?subject=Re: OpenPrimer Inquiry&body=Hi ${fb.name},%0A%0AThank you for reaching out to us. Regarding your message:%0D%0A%22${encodeURIComponent(fb.message.substring(0, 100))}${fb.message.length > 100 ? '...' : ''}%22%0A%0A`}
                    className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white text-[9.5px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-600/10 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {lang === 'FR' ? 'Répondre par Email' : 'Reply via Email'}
                  </a>
                </div>
              </motion.div>
            );
          })}

          {contactFeedbacks.length === 0 && (
            <div className="col-span-full p-24 border-2 border-dashed border-slate-900 rounded-[48px] text-center space-y-4">
              <MessageSquare className="w-12 h-12 text-slate-800 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-400">{lang === 'FR' ? 'Boîte vide' : 'No inquiries found'}</p>
                <p className="text-xs text-slate-655 max-w-xs mx-auto">
                  {lang === 'FR' 
                    ? 'Aucun message de contact n\'est présent dans la boîte.' 
                    : 'Your contact mailbox is currently clean and empty.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
