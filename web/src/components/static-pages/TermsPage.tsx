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

export const TermsPage = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const TERMS_STRINGS = {
    EN: {
      title: "Terms of Service",
      date: "Effective Date: May 11, 2026",
      sec1_t: "1. Acceptable Use",
      sec1_d: "OpenPrimer is an academic resource. Users are expected to interact with the AI Tutor respectfully and use the platform for genuine learning purposes.",
      sec2_t: "2. Intellectual Property",
      sec2_d: "All core software is licensed under MIT. Academic content is licensed under CC BY-NC-SA 4.0, allowing non-commercial sharing with proper attribution.",
      sec3_t: "3. Limitation of Liability",
      sec3_d: "The platform is provided 'as-is'. While we strive for absolute academic rigor, users should always cross-reference critical information with official university sources."
    ,
      sec4_t: "4. No Diploma, No Degree, No Accreditation",
      sec4_d: "OpenPrimer does not award diplomas, university degrees, professional certifications, or any officially recognized academic credential. It is not accredited by any national or international university, ministry of education, or professional regulatory body. Completion records and certificates issued by OpenPrimer carry no legal or academic standing, cannot be used for university admission, employment applications, or any form of official qualification. Users who misrepresent OpenPrimer credentials as official academic degrees may be in violation of applicable fraud laws."
    },
    FR: {
      title: "Conditions d'utilisation",
      date: "Date d'effet : 11 mai 2026",
      sec1_t: "1. Utilisation acceptable",
      sec1_d: "OpenPrimer est une ressource académique. Les utilisateurs doivent interagir respectueusement avec le tuteur IA et utiliser la plateforme à des fins d'apprentissage réel.",
      sec2_t: "2. Propriété intellectuelle",
      sec2_d: "Tous les logiciels de base sont sous licence MIT. Le contenu académique est sous licence CC BY-NC-SA 4.0, autorisant le partage non commercial avec attribution correcte.",
      sec3_t: "3. Limitation de responsabilité",
      sec3_d: "La plateforme est fournie 'en l'état'. Bien que nous visions une rigueur académique absolue, les utilisateurs doivent toujours recouper les informations critiques avec des sources universitaires officielles."
    ,
      sec4_t: "4. Aucun Diplôme, Aucun Grade, Aucune Accréditation",
      sec4_d: "OpenPrimer ne délivre aucun diplôme, grade universitaire ou certification professionnelle officiellement reconnu. Les attestations émises n'ont aucune valeur légale ou académique et ne peuvent être utilisées pour des admissions universitaires ou des qualifications officielles."
    },
    ES: {
      title: "Términos del Servicio",
      date: "Fecha de vigencia: 11 de mayo de 2026",
      sec1_t: "1. Uso Aceptable",
      sec1_d: "OpenPrimer es un recurso académico. Se espera que los usuarios interactúen con el Tutor de IA de manera respetuosa y utilicen la plataforma para fines de aprendizaje genuino.",
      sec2_t: "2. Propiedad Intelectual",
      sec2_d: "Todo el software principal tiene licencia MIT. El contenido académico tiene licencia CC BY-NC-SA 4.0, lo que permite compartirlo de manera no comercial con la atribución adecuada.",
      sec3_t: "3. Limitación de Responsabilidad",
      sec3_d: "La plataforma se proporciona 'tal cual'. Aunque nos esforzamos por lograr un rigor académico absoluto, los usuarios siempre deben contrastar la información crítica con fuentes universitarias oficiales."
    ,
      sec4_t: "4. Sin Diploma, Sin Título, Sin Acreditación",
      sec4_d: "OpenPrimer no otorga diplomas, títulos universitarios ni certificaciones profesionales reconocidas. Los certificados emitidos no tienen validez legal ni académica y no pueden utilizarse para admisiones universitarias ni cualificaciones oficiales."
    },
    DE: {
      title: "Nutzungsbedingungen",
      date: "Inkrafttreten: 11. Mai 2026",
      sec1_t: "1. Zulässige Nutzung",
      sec1_d: "OpenPrimer is eine akademische Ressource. Es wird erwartet, dass Benutzer respektvoll mit dem KI-Tutor interagieren und die Plattform für echte Lernzwecke nutzen.",
      sec2_t: "2. Geistiges Eigentum",
      sec2_d: "Die gesamte Kernsoftware ist unter MIT lizenziert. Akademische Inhalte sind unter CC BY-NC-SA 4.0 lizenziert, was die nicht-kommerzielle Weitergabe bei angemessener Nennung erlaubt.",
      sec3_t: "3. Haftungsbeschränkung",
      sec3_d: "Die pflichtbewusste Plattform wird ohne Mängelgewähr bereitgestellt. Obwohl wir uns um absolute akademische Genauigkeit bemühen, sollten Benutzer wichtige Informationen immer mit offiziellen Universitätsquellen abgleichen."
    ,
      sec4_t: "4. Kein Diplom, Kein Abschluss, Keine Akkreditierung",
      sec4_d: "OpenPrimer vergibt keine Diplome, Hochschulabschlüsse oder anerkannte Zertifizierungen. Ausgestellte Zertifikate haben keine rechtliche oder akademische Gültigkeit und können nicht für Universitätszulassungen oder offizielle Qualifikationen verwendet werden."
    },
    IT: {
      title: "Termini di Servizio",
      date: "Data di Decorrenza: 11 Maggio 2026",
      sec1_t: "1. Uso Consentito",
      sec1_d: "OpenPrimer è una risorsa accademica. Gli utenti sono tenuti a interagire con il Tutor IA in modo rispettoso e a utilizzare la piattaforma per scopi di apprendimento autentico.",
      sec2_t: "2. Proprietà Intellettuale",
      sec2_d: "Tutto il software principale è concesso in licenza MIT. Il contenuto accademico è concesso in licenza CC BY-NC-SA 4.0, consentendo la condivisione non commerciale con corretta attribuzione.",
      sec3_t: "3. Limitazione di Responsabilidade",
      sec3_d: "La piattaforma viene fornita 'così com'è'. Sebbene ci impegniamo per il massimo rigore accademico, gli utenti dovrebbero sempre verificare le informazioni critiche con fonti universitarie ufficiali."
    ,
      sec4_t: "4. Nessun Diploma, Nessuna Laurea, Nessuna Accreditazione",
      sec4_d: "OpenPrimer non rilascia diplomi, lauree universitarie o certificazioni professionali riconosciute ufficialmente. I certificati emessi non hanno valore legale o accademico e non possono essere utilizzati per ammissioni universitarie o qualifiche ufficiali."
    },
    ZH: {
      title: "服务条款",
      date: "生效日期：2026年5月11日",
      sec1_t: "1. 合理使用",
      sec1_d: "OpenPrimer 是一项学术资源。用户应尊重地与 AI 导师互动，并将该平台用于真正的学习目的。",
      sec2_t: "2. 知识产权",
      sec2_d: "所有核心软件均采用 MIT 许可。学术内容采用 CC BY-NC-SA 4.0 许可，允许在提供适当署名的前提下进行非商业性分享。",
      sec3_t: "3. 免责声明",
      sec3_d: "该平台按“原样”提供。虽然我们力求绝对的学术严谨性，但用户应始终将关键信息 with 官方大学来源进行交叉比对。"
    ,
      sec4_t: "4. 不颁发文凭、学位或认证",
      sec4_d: "OpenPrimer 不颁发任何文凭、大学学位或官方认可的专业认证。所颁发的证书不具备任何法律或学术效力，不能用于大学入学申请或任何形式官方资格认定。"
    },
    PT: {
      title: "Termos de Serviço",
      date: "Data de Vigência: 11 de maio de 2026",
      sec1_t: "1. Uso Aceitável",
      sec1_d: "O OpenPrimer é um recurso acadêmico. Espera-se que os usuários interajam com o Tutor de IA de forma respeitosa e utilizem a plataforma para fins de aprendizagem genuína.",
      sec2_t: "2. Propriedade Intelectual",
      sec2_d: "Todo o software principal é licenciado sob a licença MIT. O conteúdo acadêmico é licenciado sob CC BY-NC-SA 4.0, permitindo o compartilhamento não comercial com a atribuição adequada.",
      sec3_t: "3. Limitação de Responsabilidade",
      sec3_d: "A plataforma é fornecida 'como está'. Embora nos esforcemos pelo rigor acadêmico absoluto, os usuários devem sempre cruzar informações críticas com fontes universitárias oficiais."
    ,
      sec4_t: "4. Sem Diploma, Sem Grau, Sem Acreditação",
      sec4_d: "O OpenPrimer não concede diplomas, graus universitários ou certificações profissionais reconhecidas oficialmente. Os certificados emitidos não têm validade legal ou académica e não podem ser utilizados para admissões universitárias ou qualificações oficiais."
    },
    AR: {
      title: "شروط الخدمة",
      date: "تاريخ السريان: ١١ مايو ٢٠٢٦",
      sec1_t: "١. الاستخدام المقبول",
      sec1_d: "إن OpenPrimer هو مورد أكاديمي. يُتوقع من المستخدمين التفاعل مع معلم الذكاء الاصطناعي باحترام واستخدام المنصة لأغراض التعلم الحقيقية.",
      sec2_t: "٢. الملكية الفكرية",
      sec2_d: "جميع البرمجيات الأساسية مرخصة بموجب رخصة MIT. المحتوى الأكاديمي مرخص بموجب رخصة المشاع الإبداعي CC BY-NC-SA 4.0، مما يسمح بالمشاركة غير التجارية مع الإشارة المناسبة للمصدر.",
      sec3_t: "٣. تحديد المسؤولية",
      sec3_d: "يتم تقديم المنصة 'كما هي'. بينما نسعى جاهدين لتحقيق الدقة الأكاديمية المطلقة، يجب على المستخدمين دائمًا مقارنة المعلومات الهامة بالمرجعيات الجامعية الرسمية."
    ,
      sec4_t: "٤. لا دبلوم، لا درجة علمية، لا اعتماد",
      sec4_d: "لا تمنح OpenPrimer أي دبلوم أو درجة جامعية أو شهادة مهنية معترف بها رسمياً. شهادات الإتمام الصادرة لا قيمة قانونية أو أكاديمية لها ولا يمكن استخدامها للقبول الجامعي أو المؤهلات الرسمية."
    },
    HI: {
      title: "सेवा की शर्तें",
      date: "प्रभावी तिथि: 11 मई, 2026",
      sec1_t: "1. स्वीकार्य उपयोग",
      sec1_d: "OpenPrimer एक शैक्षणिक संसाधन है। उपयोगकर्ताओं से अपेक्षा की जाती है कि वे एआई ट्यूटर के साथ सम्मानपूर्वक बातचीत करें और वास्तविक सीखने के उद्देश्यों के लिए मंच का उपयोग करें।",
      sec2_t: "2. बौद्धिक संपदा",
      sec2_d: "सभी मुख्य सॉफ़्टवेयर MIT के तहत लाइसेंस प्राप्त हैं। शैक्षणिक सामग्री CC BY-NC-SA 4.0 के तहत लाइसेंस प्राप्त है, जो उचित श्रेय के साथ गैर-व्यावसायिक साझाकरण की अनुमति देती है।",
      sec3_t: "3. देयता की सीमा",
      sec3_d: "यह मंच 'जैसा है' वैसा ही प्रदान किया जाता है। हालांकि हम पूर्ण शैक्षणिक कठोरता के लिए प्रयास करते हैं, उपयोगकर्ताओं को हमेशा आधिकारिक विश्वविद्यालय स्रोतों के साथ महत्वपूर्ण जानकारी को सत्यापित करना चाहिए।"
    ,
      sec4_t: "4. कोई डिप्लोमा नहीं, कोई डिग्री नहीं, कोई मान्यता नहीं",
      sec4_d: "OpenPrimer कोई डिप्लोमा, विश्वविद्यालय डिग्री या आधिकारिक रूप से मान्यता प्राप्त शैक्षणिक प्रमाण-पत्र प्रदान नहीं करता। इस प्लेटफ़ॉर्म द्वारा जारी पूर्णता प्रमाणपत्रों का कोई कानूनी या शैक्षणिक महत्व नहीं है।"
    },
    UR: {
      title: "سروس کی شرائط",
      date: "مؤثر تاریخ: 11 مئی، 2026",
      sec1_t: "1. قابل قبول استعمال",
      sec1_d: "OpenPrimer ایک تعلیمی ذریعہ ہے۔ صارفین سے توقع کی جاتی ہے کہ وہ AI ٹیوٹر کے ساتھ احترام سے پیش آئیں اور پلیٹ فارم کو حقیقی سیکھنے کے مقاصد کے لیے استعمال کریں۔",
      sec2_t: "2. دانشورانہ ملکیت",
      sec2_d: "تمام بنیادی سافٹ ویئر MIT کے تحت لائسنس یافتہ ہیں۔ تعلیمی مواد CC BY-NC-SA 4.0 کے تحت لائسنس یافتہ ہے، جس سے مناسب انتساب کے ساتھ غیر تجارتی اشتراک کی اجازت ملتی ہے۔",
      sec3_t: "3. ذمہ داری کی حد",
      sec3_d: "یہ پلیٹ فارم 'جیسا ہے' ویسا ہی فراہم کیا جاتا ہے۔ اگرچہ ہم مقررہ تعلیمی درستی کے لیے کوشاں ہیں، صارفین کو ہمیشہ اہم معلومات کی تصدیق سرکاری یونیورسٹی کے ذرائع سے کرنی چاہیے۔"
    ,
      sec4_t: "4. کوئی ڈپلومہ نہیں, کوئی ڈگری نہیں, کوئی اعتماد نہیں",
      sec4_d: "OpenPrimer کوئی ڈپلومہ, یونیورسٹی ڈگری یا سرکاری طور پر تسلیم شدہ تعلیمی سند فراہم نہیں کرتا۔ اس پلیٹ فارم کے مکمل کرنے کے سرٹیفکیٹ کوئی قانونی یا تعلیمی حیثیت نہیں رکھتے۔"
    }
  };

  const c = TERMS_STRINGS[lang.toUpperCase() as keyof typeof TERMS_STRINGS] || TERMS_STRINGS.EN;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <TopNav />
      <div className="max-w-3xl mx-auto px-8 pt-32 pb-24 prose prose-invert prose-slate">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{c.title}</h1>
        <p className="text-slate-400">{c.date}</p>
        <h2>{c.sec1_t}</h2>
        <p>{c.sec1_d}</p>
        <h2>{c.sec2_t}</h2>
        <p>{c.sec2_d}</p>
        <h2>{c.sec3_t}</h2>
        <p>{c.sec3_d}</p>
        {c.sec4_t && (
          <>
            <h2>{c.sec4_t}</h2>
            <p>{c.sec4_d}</p>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};
