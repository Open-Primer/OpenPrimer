"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, Target, Users, Mail, Phone, MapPin, Globe, Sparkles, 
  BookOpen, ChevronRight, Search, Filter, Book, Award, Zap, Languages,
  ShieldCheck, Clock, Star, CheckCircle2, GraduationCap, X, Bell, Rocket,
  BrainCircuit, FlaskConical, Scale, Calculator, Atom, Leaf, Bookmark,
  Play, Plus, FileText
} from 'lucide-react';
import { TopNav, UI_STRINGS, Footer, formatCourseLevel, getLocalizedLabel } from '../RefinedUI';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { dbService, progressService, isDatabaseConfigured, syncLocalStorageToSupabase } from '@/lib/db';
import { CourseKiosk } from '../CourseKiosk';
import { EnrollmentModal } from '../modals/EnrollmentModal';
import { getLocalizedDiscipline, translateDisciplineQuery, cleanPathSegment } from '@/lib/translations';
import { validateEmail, detectPromptInjection, isSpam } from '@/lib/security';

export const ContactPage = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const CONTACT_STRINGS = {
    EN: {
      title: "Get in Touch",
      desc: "Reach out to our global ops team for partnerships or feedback on the Feynman Engine.",
      support: "Global Support Operations",
      success_title: "Message Received",
      success_desc: "We will get back to you shortly.",
      name_placeholder: "Full Name",
      email_placeholder: "Email Address",
      message_placeholder: "Your Message",
      btn_sending: "Dispatching...",
      btn_send: "Send Inquiry",
      alert_err: "An error occurred. Please try again.",
      alert_fail: "Failed to send message. Please try again later."
    },
    FR: {
      title: "Contactez-nous",
      desc: "Contactez notre équipe opérationnelle mondiale pour des partenariats ou des retours sur le moteur Feynman.",
      support: "Opérations de Support Mondial",
      success_title: "Message Reçu",
      success_desc: "Nous reviendrons vers vous très prochainement.",
      name_placeholder: "Nom Complet",
      email_placeholder: "Adresse Email",
      message_placeholder: "Votre Message",
      btn_sending: "Envoi en cours...",
      btn_send: "Envoyer ma demande",
      alert_err: "Une erreur est survenue. Veuillez réessayer.",
      alert_fail: "Échec de l'envoi. Veuillez réessayer plus tard."
    },
    ES: {
      title: "Ponerse en Contacto",
      desc: "Comuníquese con nuestro equipo de operaciones globales para asociaciones o comentarios sobre el Motor Feynman.",
      support: "Operaciones de Soporte Global",
      success_title: "Mensaje Recibido",
      success_desc: "Nos pondremos en contacto con usted en breve.",
      name_placeholder: "Nombre Completo",
      email_placeholder: "Correo Electrónico",
      message_placeholder: "Tu Mensaje",
      btn_sending: "Enviando...",
      btn_send: "Enviar Consulta",
      alert_err: "Ocurrió un error. Por favor, inténtelo de nuevo.",
      alert_fail: "Error al enviar el message. Por favor, inténtelo más tarde."
    },
    DE: {
      title: "Kontaktieren Sie uns",
      desc: "Wenden Sie sich an unser globales Betriebsteam für Partnerschaften oder Feedback zur Feynman-Engine.",
      support: "Globaler Supportbetrieb",
      success_title: "Nachricht empfangen",
      success_desc: "Wir werden uns in Kürze bei Ihnen melden.",
      name_placeholder: "Vollständiger Name",
      email_placeholder: "E-Mail-Adresse",
      message_placeholder: "Ihre Nachricht",
      btn_sending: "Wird gesendet...",
      btn_send: "Anfrage senden",
      alert_err: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      alert_fail: "Fehler beim Senden der Nachricht. Bitte versuchen Sie es später noch einmal."
    },
    IT: {
      title: "Contattaci",
      desc: "Contatta il nosso team operativo globale per partnership o feedback sul Feynman Engine.",
      support: "Operazioni di Supporto Globale",
      success_title: "Messaggio Ricevuto",
      success_desc: "Ti risponderemo al più presto.",
      name_placeholder: "Nome Completo",
      email_placeholder: "Indirizzo Email",
      message_placeholder: "Il Tuo Messaggio",
      btn_sending: "Invio in corso...",
      btn_send: "Invia Richiesta",
      alert_err: "Si è verificato un errore. Riprova.",
      alert_fail: "Impossibile inviare il messaggio. Riprova più tardi."
    },
    ZH: {
      title: "联系我们",
      desc: "联系我们的全球运营团队以获取合作机会或对费曼引擎的反馈。",
      support: "全球支持运营",
      success_title: "收到消息",
      success_desc: "我们将很快与您联系。",
      name_placeholder: "姓名",
      email_placeholder: "电子邮件地址",
      message_placeholder: "您的消息",
      btn_sending: "正在发送...",
      btn_send: "发送咨询",
      alert_err: "发生错误。请重试。",
      alert_fail: "发送消息失败。请稍后重试。"
    },
    PT: {
      title: "Entre em Contato",
      desc: "Entre em contato com nossa equipe operacional global para parcerias ou feedback sobre o Feynman Engine.",
      support: "Suporte Operacional Global",
      success_title: "Mensagem Recebida",
      success_desc: "Entraremos em contato em breve.",
      name_placeholder: "Nome Completo",
      email_placeholder: "Endereço de E-mail",
      message_placeholder: "Sua Mensagem",
      btn_sending: "Enviando...",
      btn_send: "Enviar Consulta",
      alert_err: "Ocorreu um erro. Por favor, tente novamente.",
      alert_fail: "Falha ao enviar a mensagem. Por favor, tente mais tarde."
    },
    AR: {
      title: "تواصل معنا",
      desc: "تواصل مع فريق عملياتنا العالمي للشراكات أو التعليقات حول محرك فاينمان.",
      support: "دعم العمليات العالمية",
      success_title: "تم استلام الرسالة",
      success_desc: "سنرد عليك في أقرب وقت.",
      name_placeholder: "الاسم الكامل",
      email_placeholder: "عنوان البريد الإلكتروني",
      message_placeholder: "رسالتك",
      btn_sending: "جاري الإرسال...",
      btn_send: "إرسال الاستفسار",
      alert_err: "حدث خطأ. يرجى المحاولة مرة أخرى.",
      alert_fail: "فشل إرسال الرسالة. يرجى المحاولة لاحقاً."
    },
    HI: {
      title: "संपर्क करें",
      desc: "साझेदारी या फेनमैन इंजन पर प्रतिक्रिया के लिए हमारी वैश्विक संचालन टीम से संपर्क करें।",
      support: "वैश्विक सहायता संचालन",
      success_title: "संदेश प्राप्त हुआ",
      success_desc: "हम जल्द ही आपसे संपर्क करेंगे।",
      name_placeholder: "पूरा नाम",
      email_placeholder: "ईमेल पता",
      message_placeholder: "आपका संदेश",
      btn_sending: "भेजा जा रहा है...",
      btn_send: "पूछताछ भेजें",
      alert_err: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
      alert_fail: "संदेश भेजने में विफल। कृपया बाद में पुनः प्रयास करें।"
    },
    UR: {
      title: "رابطہ کریں",
      desc: "شراکت داری یا فین مین انجن پر رائے کے لیے ہماری عالمی آپریشنز ٹیم سے رابطہ کریں۔",
      support: "عالمی سپورٹ آپریشنز",
      success_title: "پیغام موصول ہوا",
      success_desc: "ہم جلد ہی آپ سے رابطہ کریں گے۔",
      name_placeholder: "پورا نام",
      email_placeholder: "ای میل ایڈریس",
      message_placeholder: "آپ کا پیغام",
      btn_sending: "بھیجا جا رہا ہے...",
      btn_send: "انکوائری بھیجیں",
      alert_err: "ایک خرابی پیش آئی। براہ کرم دوبارہ کوشش کریں۔",
      alert_fail: "پیغام بھیجنے میں ناکامی۔ براہ کرم بعد میں دوبارہ کوشش کریں۔"
    }
  };

  const c = CONTACT_STRINGS[lang.toUpperCase() as keyof typeof CONTACT_STRINGS] || CONTACT_STRINGS.EN;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      website: formData.get('website'),
      lang: lang
    };

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (resp.ok) setIsSent(true);
      else alert(c.alert_fail);
    } catch (err) {
      alert(c.alert_err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <TopNav />
      <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <div className="flex items-center gap-3 mb-12 text-violet-500">
          <Mail className="w-8 h-8" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{c.title}</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-12">
            <p className="text-slate-400 leading-relaxed">{c.desc}</p>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500"><Globe className="w-5 h-5" /></div>
               <div>
                 <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{c.support}</p>
                 <p className="font-bold text-slate-200 uppercase tracking-tight">support@openprimer.app</p>
               </div>
            </div>
          </div>
          <div className="bg-slate-900/50 p-10 rounded-[40px] border border-slate-800 shadow-2xl backdrop-blur-2xl">
              {isSent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">{c.success_title}</h3>
                  <p className="text-slate-500 text-sm">{c.success_desc}</p>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                   <div className="flex flex-col gap-4">
                      {/* Honeypot field to trap spambots */}
                      <input name="website" type="text" className="hidden" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
                      <input name="name" type="text" placeholder={c.name_placeholder} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" required />
                      <input name="email" type="email" placeholder={c.email_placeholder} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" required />
                   </div>
                   <textarea name="message" placeholder={c.message_placeholder} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm h-40 focus:outline-none focus:border-blue-500/50 transition-all resize-none" required></textarea>
                    <button 
                      type="submit" 
                      disabled={isSending}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20"
                    >
                      {isSending ? c.btn_sending : c.btn_send}
                    </button>
                </form>
              )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
