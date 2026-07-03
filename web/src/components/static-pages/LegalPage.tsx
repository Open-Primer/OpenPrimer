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

export const LegalPage = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const LEGAL_STRINGS = {
    EN: {
      title: "Legal Notice & Liability Disclaimer",
      date: "Effective Date: May 11, 2026",
      compliance_t: "EU AI Act Compliance & Artificial Intelligence Disclosure",
      compliance_d: "All courses, academic explanations, and tutoring responses are generated autonomously by Artificial Intelligence models. They are provided solely for self-study and general educational assistance. They do not constitute certified scientific or academic facts, nor do they replace official curricula, teachers, professors, or professional advice. The publisher assumes no liability for any factual errors, omissions, or consequences arising from the use of synthetic materials generated on this platform.",
      sovereignty_t: "Academic & Data Sovereignty",
      sovereignty_d: "OpenPrimer is built on the principles of open educational access and localized academic control. In alignment with regional regulations including the European Union's General Data Protection Regulation (GDPR) and the EU AI Act, we ensure that students retain full ownership of their learning history and that all AI-generated curriculum is subject to public scrutiny and open attribution."
    },
    FR: {
      title: "Mentions Légales & Clause de Responsabilité",
      date: "Date d'effet : 11 mai 2026",
      compliance_t: "Conformité à l'EU AI Act & Divulgation de l'Intelligence Artificielle",
      compliance_d: "Les cours, explications académiques et réponses de tutorat d'OpenPrimer sont générés de manière autonome par des modèles d'Intelligence Artificielle. Ils sont fournis exclusivement à des fins d'auto-apprentissage et d'accompagnement pédagogique général. Ils ne constituent pas des vérités scientifiques certifiées et ne sauraient en aucun cas remplacer les programmes officiels, enseignants, professeurs ou avis de professionnels agréés. L'éditeur décline toute responsabilité quant aux éventuelles erreurs, omissions ou conséquences découlant de l'utilisation des contenus synthétiques de cette plateforme.",
      sovereignty_t: "Souveraineté Académique & des Données",
      sovereignty_d: "OpenPrimer est fondé sur les principes d'accès libre à l'éducation et de contrôle académique localisé. En conformité avec les réglementations régionales, notamment le Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne et l'EU AI Act, nous garantissons que les étudiants conservent la pleine propriété de leur historique d'apprentissage et que tous les programmes générés par IA sont soumis au contrôle public et à une attribution ouverte."
    },
    ES: {
      title: "Aviso Legal y Limitación de Responsabilidad",
      date: "Fecha de vigencia: 11 de mayo de 2026",
      compliance_t: "Cumplimiento de la Ley de IA de la UE y Divulgación de IA",
      compliance_d: "Todos los cursos, explicaciones y respuestas de tutoría se generan de forma autónoma mediante modelos de Inteligencia Artificial. Se proporcionan únicamente para el autoestudio y apoyo pedagógico general. No constituyen hechos científicos certificados ni sustituyen a docentes, profesores o asesores profesionales oficiales. El editor declina toda responsabilidad por errores fácticos u omisiones que puedan derivarse del uso de materiales sintéticos generados en esta plataforma.",
      sovereignty_t: "Soberanía Académica y de Datos",
      sovereignty_d: "OpenPrimer se basa en los principios de acceso abierto a la educación y control académico localizado. De acuerdo con las regulaciones regionales, incluido el Reglamento General de Protección de Datos (RGPD) de la Unión Europea y la Ley de IA de la UE, garantizamos que los estudiantes mantengan la propiedad total de su historial de aprendizaje y que todo el plan de estudios generado por IA esté sujeto al escrutinio público y atribución abierta."
    },
    DE: {
      title: "Rechtliche Hinweise & Haftungsausschluss",
      date: "Inkrafttreten: 11. Mai 2026",
      compliance_t: "Konformität mit dem EU-KI-Gesetz & KI-Offenlegung",
      compliance_d: "Alle Kurse, akademischen Erklärungen und Tutor-Antworten werden autonom von KI-Modellen generiert. Sie dienen ausschließlich dem Selbststudium und der allgemeinen pädagogischen Unterstützung. Sie stellen keine zertifizierten wissenschaftlichen Wahrheiten dar und ersetzen keine offiziellen Lehrpläne, Lehrer, Professoren oder Fachberatungen. Der Herausgeber übernimmt keine Haftung für sachliche Fehler oder Folgen aus der Nutzung dieser synthetischen Inhalte.",
      sovereignty_t: "Akademische & Datensouveränität",
      sovereignty_d: "OpenPrimer basiert auf den Prinzipien des freien Bildungszugangs und der lokalisierten akademischen Kontrolle. In Übereinstimmung mit regionalen Vorschriften, einschließlich der Datenschutz-Grundverordnung (DSGVO) der Europäischen Union und des EU-KI-Gesetzes, stellen wir sicher, dass Studierende das volle Eigentum an ihrem Lernverlauf behalten und alle KI-generierten Lehrpläne der öffentlichen Kontrolle und offenen Namensnennung unterliegen."
    },
    ZH: {
      title: "法律声明与免责声明",
      date: "生效日期：2026年5月11日",
      compliance_t: "符合欧盟人工智能法案（EU AI Act）与人工智能披露声明",
      compliance_d: "本平台的所有课程、学术解释和辅导回答均由人工智能模型自主生成。这些内容仅用于自学和一般性教学辅助，不构成经认证的科学或学术事实，也不能替代官方课程、教师、教授或专业意见。对于因使用本平台生成的合成材料而产生的任何事实错误、遗漏或后果，出版方不承担任何责任。",
      sovereignty_t: "学术与数据自主权",
      sovereignty_d: "OpenPrimer 建立在开放教育资源获取和本地化学术控制的原则之上。符合包括欧盟《通用数据保护条例》（GDPR）和《欧盟人工智能法案》在内的地区法规，我们确保学生保留其学习历史的完整所有权，并且所有人工智能生成的课程都接受公众监督和开放署名。"
    },
    PT: {
      title: "Aviso Legal e Isenção de Responsabilidade",
      date: "Data de vigência: 11 de maio de 2026",
      compliance_t: "Conformidade com a Lei de IA da UE e Divulgação de Inteligência Artificial",
      compliance_d: "Todos os cursos, explicações académicas e respostas de tutoria são gerados de forma autónoma por modelos de Inteligência Artificial. São fornecidos exclusivamente para autoestudo e assistência educacional geral. Não constituem factos científicos ou académicos certificados, nem substituem currículos oficiais, professores, docentes ou aconselhamento profissional. O editor não assume qualquer responsabilidade por eventuais erros factuais, omissões ou consequências decorrentes do uso de materiais sintéticos gerados nesta plataforma.",
      sovereignty_t: "Soberania Académica e de Dados",
      sovereignty_d: "O OpenPrimer baseia-se nos princípios de acesso aberto à educação e controle académico localizado. Em conformidade com os regulamentos regionais, incluindo o Regulamento Geral de Proteção de Dados (RGPD) da União Europeia e a Lei de IA da UE, garantimos que os estudantes mantêm a propriedade total do seu histórico de aprendizagem e que todo o currículo gerado por IA está sujeito ao escrutínio público e à atribuição aberta."
    },
    AR: {
      title: "إشعار قانوني وإخلاء مسؤولية",
      date: "تاريخ السريان: 11 مايو 2026",
      compliance_t: "الامتثال لقانون الذكاء الاصطناعي للاتحاد الأوروبي والإفصاح عن الذكاء الاصطناعي",
      compliance_d: "يتم توليد جميع الدورات التدريبية والتفسيرات الأكاديمية واستجابات التدريس الخصوصي بشكل مستقل بواسطة نماذج الذكاء الاصطناعي. وهي مقدمة فقط للدراسة الذاتية والمساعدة التعليمية العامة. ولا تشكل حقائق علمية أو أكاديمية معتمدة، كما أنها لا تحل محل المناهج الرسمية أو المعلمين أو الأساتذة أو الاستشارات المهنية. ولا يتحمل الناشر أي مسؤولية عن أي أخطاء واقعية أو سهو أو عواقب ناشئة عن استخدام المواد الاصطناعية التي يتم إنشاؤها على هذه المنصة.",
      sovereignty_t: "السيادة الأكاديمية وسيادة البيانات",
      sovereignty_d: "تم بناء OpenPrimer على مبادئ الوصول المفتوح إلى التعليم والرقابة الأكاديمية المحلية. وتماشياً مع اللوائح الإقليمية بما في ذلك اللائحة العامة لحماية البيانات (GDPR) للاتحاد الأوروبي وقانون الذكاء الاصطناعي للاتحاد الأوروبي، فإننا نضمن احتفاظ الطلاب بالملكية الكاملة لتاريخهم التعليمي وخضوع جميع المناهج الدراسية المنشأة بواسطة الذكاء الاصطناعي للتدقيق العام والنسب المفتوح."
    },
    HI: {
      title: "कानूनी नोटिस और दायित्व अस्वीकरण",
      date: "प्रभावी तिथि: 11 मई, 2026",
      compliance_t: "यूरोपीय संघ एआई अधिनियम अनुपालन और कृत्रिम बुद्धिमत्ता प्रकटीकरण",
      compliance_d: "सभी पाठ्यक्रम, शैक्षणिक स्पष्टीकरण और ट्यूशन प्रतिक्रियाएं कृत्रिम बुद्धिमत्ता (एआई) मॉडल द्वारा स्वायत्त रूप से उत्पन्न की जाती हैं। वे पूरी तरह से स्व-अध्ययन और सामान्य शैक्षिक सहायता के लिए प्रदान किए जाते हैं। वे प्रमाणित वैज्ञानिक या शैक्षणिक तथ्यों का गठन नहीं करते हैं, और न ही वे आधिकारिक पाठ्यक्रम, शिक्षकों, प्रोफेसरों या पेशेवर सलाह का स्थान लेते हैं। प्रकाशक इस प्लेटफॉर्म पर उत्पन्न सिंथेटिक सामग्री के उपयोग से उत्पन्न होने वाली किसी भी तथ्यात्मक त्रुटियों, चूक या परिणामों के लिए कोई दायित्व स्वीकार नहीं करता है।",
      sovereignty_t: "शैक्षणिक और डेटा संप्रभुता",
      sovereignty_d: "OpenPrimer खुले शैक्षिक पहुंच और स्थानीय शैक्षणिक नियंत्रण के सिद्धांतों पर बनाया गया है। यूरोपीय संघ के सामान्य डेटा संरक्षण विनियमन (GDPR) और यूरोपीय संघ एआई अधिनियम सहित क्षेत्रीय नियमों के संरेखण में, हम यह सुनिश्चित करते हैं कि छात्र अपने सीखने के इतिहास का पूर्ण स्वामित्व बनाए रखें और सभी एआई-जनित पाठ्यक्रम सार्वजनिक जांच और खुले श्रेय के अधीन हों।"
    },
    UR: {
      title: "قانونی نوٹس اور ذمہ داری کا اعلان",
      date: "نفاذ کی تاریخ: 11 مئی، 2026",
      compliance_t: "یورپی یونین اے آئی ایکٹ کی تعمیل اور آرٹیفیشل انٹیلیجنس کا انکشاف",
      compliance_d: "تمام کورسز، تعلیمی وضاحتیں، اور ٹیوٹر کے جوابات خود کار طریقے سے آرٹیفیشل انٹیلیجنس (اے آئی) ماڈلز کے ذریعے تیار کیے جاتے ہیں۔ یہ صرف ذاتی مطالعہ اور عام تعلیمی امداد کے لیے فراہم کیے جاتے ہیں۔ یہ تصدیق شدہ سائنسی یا تعلیمی حقائق پر مبنی نہیں ہیں، اور نہ ہی یہ سرکاری نصاب، اساتذہ، پروفیسرز، یا پیشہ ورانہ مشورے کا متبادل ہیں۔ پبلشر اس پلیٹ فارم پر تیار کردہ مصنوعی مواد کے استعمال سے پیدا ہونے والی کسی بھی قسم کی غلطیوں، کوتاہیوں، یا نتائج کے لیے کوئی ذمہ داری قبول نہیں کرتا ہے۔",
      sovereignty_t: "تعلیمی اور ڈیٹا کی خود مختاری",
      sovereignty_d: "OpenPrimer اوپن ایجوکیشنل رسائی اور مقامی تعلیمی کنٹرول کے اصولوں پر بنایا گیا ہے۔ یورپی یونین کے جنرل ڈیٹا پروٹیکشن ریگولیشن (GDPR) اور یورپی یونین اے آئی ایکٹ سمیت علاقائی قوانین کے تحت، ہم اس بات کو یقینی بناتے ہیں کہ طلباء اپنی سیکھنے کی تاریخ کی مکمل ملکیت برقرار رکھیں اور اے آئی کے ذریعے تیار کردہ تمام نصاب عوامی جانچ اور اوپن انتساب کے تابع ہوں۔"
    }
  };

  const c = LEGAL_STRINGS[lang.toUpperCase() as keyof typeof LEGAL_STRINGS] || LEGAL_STRINGS.EN;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <TopNav />
      <div className="max-w-3xl mx-auto px-8 pt-32 pb-24 prose prose-invert prose-slate">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{c.title}</h1>
        <p className="text-slate-400">{c.date}</p>
        <h2>{c.compliance_t}</h2>
        <p>{c.compliance_d}</p>
        <h2>{c.sovereignty_t}</h2>
        <p>{c.sovereignty_d}</p>
      </div>
      <Footer />
    </div>
  );
};
