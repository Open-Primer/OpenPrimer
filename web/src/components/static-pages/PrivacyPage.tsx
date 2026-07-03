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

export const PrivacyPage = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const PRIVACY_STRINGS = {
    EN: {
      title: "Privacy Policy",
      tagline: '"Your data, your progress, your sovereignty."',
      desc: "We do not sell your data. Your learning progress is used exclusively to calibrate the AI Tutor for your specific needs. We comply with GDPR and global privacy standards for academic data protection."
    },
    FR: {
      title: "Politique de confidentialité",
      tagline: '"Vos données, votre progression, votre souveraineté."',
      desc: "Nous ne vendons pas vos données. Votre progression d'apprentissage est exclusivement utilisée pour calibrer le tuteur IA selon vos besoins spécifiques. Nous respectons le RGPD et les normes mondiales de protection des données académiques."
    },
    ES: {
      title: "Política de Privacidad",
      tagline: '"Tus datos, tu progreso, tu soberanía."',
      desc: "No vendemos tus datos. Tu progreso de aprendizaje se utiliza exclusivamente para calibrar el Tutor de IA para tus necesidades específicas. Cumplimos con el RGPD y los estándares globales de privacidad para la proteção de dados acadêmicos."
    },
    DE: {
      title: "Datenschutz-Bestimmungen",
      tagline: '"Ihre Daten, Ihr Fortschritt, Ihre Souveränität."',
      desc: "Wir verkaufen Ihre Daten nicht. Ihr Lernfortschritt wird ausschließlich dazu verwendet, den KI-Tutor auf Ihre spezifischen Bedürfnisse abzustimmen. Wir halten uns an die DSGVO und globale Datenschutzstandards für akademische Daten."
    },
    IT: {
      title: "Informativa sulla Privacy",
      tagline: '"I tuoi dati, i tuoi progressi, la tua sovranità."',
      desc: "Non vendiamo i tuoi dati. I tuoi progressi di apprendimento sono utilizzati esclusivamente per calibrare il Tutor IA in base alle tue esigenze specifiche. Rispettiamo il GDPR e gli standard globali di privacy per la protezione dei dati accademici."
    },
    ZH: {
      title: "隐私政策",
      tagline: "“您的数据，您的进步，您的自主权。”",
      desc: "我们不出售您的数据。您的学习进度仅用于针对您的特定需求调整 AI 导师。我们遵守 GDPR 和全球学术数据保护隐私标准。"
    },
    PT: {
      title: "Política de Privacidade",
      tagline: '"Seus dados, seu progresso, sua soberania."',
      desc: "Não vendemos os seus dados. O seu progresso de aprendizagem é utilizado exclusivamente para calibrar o Tutor de IA para as suas necessidades específicas. Cumprimos com o RGPD e as normas globais de privacidade para a proteção de dados acadêmicos."
    },
    AR: {
      title: "سياسة الخصوصية",
      tagline: '"بياناتك، تقدمك، سيادتك."',
      desc: "نحن لا نبيع بياناتك. يتم استخدام تقدمك التعليمي حصريًا لمعايرة معلم الذكاء الاصطناعي وفقًا لاحتياجاتك الخاصة. نحن نلتزم باللائحة العامة لحماية البيانات (GDPR) والمعايير العالمية للخصوصية لحماية البيانات الأكاديمية."
    },
    HI: {
      title: "गोपनीयता नीति",
      tagline: '"आपका डेटा, आपकी प्रगति, आपकी संप्रभुता।"',
      desc: "हम आपका डेटा नहीं बेचते हैं। आपकी सीखने की प्रगति का उपयोग विशेष रूप से आपकी विशिष्ट आवश्यकताओं के लिए एआई ट्यूटर को कैलिब्रेट करने के लिए किया जाता है। हम शैक्षणिक डेटा सुरक्षा के लिए जीडीपीआर और वैश्विक गोपनीयता मानकों का पालन करते हैं।"
    },
    UR: {
      title: "رازداری की पॉलिसी",
      tagline: '"آپ کا ڈیٹا، آپ کی ترقی، آپ کی خودمختاری۔"',
      desc: "ہم آپ کا ڈیٹا فروخت نہیں کرتے ہیں۔ آپ کی سیکھنے کی پیشرفت کو خاص طور پر آپ کی مخصوص ضروریات کے مطابق AI ٹیوٹر کی رہنمائی کے لیے استعمال کیا جاتا ہے۔ ہم تعلیمی ڈیٹا کے تحفظ کے لیے GDPR اور عالمی رازداری کے معیارات کی تعمیل کرتے ہیں۔"
    }
  };

  const c = PRIVACY_STRINGS[lang.toUpperCase() as keyof typeof PRIVACY_STRINGS] || PRIVACY_STRINGS.EN;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <TopNav />
      <div className="max-w-3xl mx-auto px-8 pt-32 pb-24 prose prose-invert prose-slate">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{c.title}</h1>
        <p className="text-slate-400 text-sm italic">{c.tagline}</p>
        <p>{c.desc}</p>
      </div>
      <Footer />
    </div>
  );
};
