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

export const PhilosophyPage = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const PHILOSOPHY_STEPS = {
    EN: [
      { step: '01', title: 'Atomic Decomposition', desc: "We break every course into modules that focus on a single core concept. You can't move forward until you can explain the current module in simple terms." },
      { step: '02', title: 'Socratic Feedback Loop', desc: "Instead of providing answers, our AI Tutor asks the questions that lead you to the answer. This is the 'Socratic Overlay' that prevents passive reading." },
      { step: '03', title: 'Cross-Linguistic Synthesis', desc: "By switching languages, students activate different cognitive pathways, reinforcing the concept's abstraction from mere vocabulary." }
    ],
    FR: [
      { step: '01', title: 'Décomposition Atomique', desc: "Nous divisons chaque cours en modules centrés sur un concept clé unique. Vous ne pouvez progresser que lorsque vous pouvez l'expliquer simplement." },
      { step: '02', title: 'Boucle Socratique', desc: "Au lieu de donner des réponses directes, notre tuteur IA pose des questions qui vous guident vers la solution pour éviter la lecture passive." },
      { step: '03', title: 'Synthèse Trans-Linguistique', desc: "En alternant les langues, l'étudiant active diverses voies cognitives, renforçant l'abstraction du concept au-delà du simple vocabulaire." }
    ],
    ES: [
      { step: '01', title: 'Descomposición Atómica', desc: "Dividimos cada curso en módulos centrados en un solo concepto clave. No puedes avanzar hasta que puedas explicar el módulo actual en términos simples." },
      { step: '02', title: 'Bucle de Retroalimentación Socrática', desc: "En lugar de proporcionar respuestas, nuestro Tutor de IA hace las preguntas que te guían hacia la respuesta para evitar la lectura pasiva." },
      { step: '03', title: 'Síntesis Translingüística', desc: "Al cambiar de idioma, los estudiantes activan diferentes vías cognitivas, reforzando la abstracción del concepto más allá del vocabulario." }
    ],
    DE: [
      { step: '01', title: 'Atomare Zerlegung', desc: "Wir zerlegen jeden Kurs in Module, die sich auf ein einzelnes Kernkonzept konzentrieren. Sie können erst fortfahren, wenn Sie das aktuelle Modul in einfachen Worten erklären können." },
      { step: '02', title: 'Sokratische Feedbackschleife', desc: "Anstatt Antworten zu geben, stellt unser KI-Tutor Fragen, die Sie zur Antwort führen, um passives Lesen zu verhindern." },
      { step: '03', title: 'Kognitive Sprachsynthese', desc: "Durch den Wechsel der Sprachen aktivieren die Lernenden unterschiedliche kognitive Pfade und vertiefen das Verständnis des Konzepts." }
    ],
    IT: [
      { step: '01', title: 'Decomposizione Atomica', desc: "Dividiamo ogni corso in moduli incentrati su un singolo concetto chiave. Non puoi andare avanti finché non sai spiegare il modulo corrente in termini semplici." },
      { step: '02', title: 'Ciclo di Feedback Socratico', desc: "Invece di fornire risposte, il nostro Tutor IA pone domande che ti guidano alla risposta, prevenendo la lettura passiva." },
      { step: '03', title: 'Sintesi Trans-Linguistica', desc: "Cambiando lingua, gli studenti attivano percorsi cognitivi diversi, rafforçando l'astrazione del concetto dal semplice vocabolario." }
    ],
    ZH: [
      { step: '01', title: '原子化分解', desc: "我们将每门课程拆分为专注于单一核心概念的模块。只有在你能用简单的语言解释当前模块时，才能继续前进。" },
      { step: '02', title: '苏格拉底式反馈闭环', desc: "我们的AI导师不会直接提供答案，而是通过提问引导你找到答案，防止被动阅读。" },
      { step: '03', title: '跨语言合成认知', desc: "通过切换语言，学生可以激活不同的认知途径，增强概念从单纯词汇中的学术抽象理解。" }
    ],
    PT: [
      { step: '01', title: 'Decomposição Atômica', desc: "Dividimos cada curso em módulos focados em um único conceito central. Você não pode avançar até conseguir explicar o módulo atual em termos simples." },
      { step: '02', title: 'Ciclo de Feedback Socrático', desc: "Em vez de fornecer respostas, o nosso Tutor de IA faz as perguntas que o guiam até a resposta. Esta é a 'Camada Socrática' que evita a leitura passiva." },
      { step: '03', title: 'Síntese Translinguística', desc: "Ao alternar entre idiomas, os alunos ativam diferentes caminhos cognitivos, reforçando a abstração do conceito além do mero vocabolário." }
    ],
    AR: [
      { step: '01', title: 'التفكيك الذري', desc: "نحن نقوم بتفكيك كل دورة إلى وحدات تركز على مفهوم أساسي واحد. لا يمكنك المضي قدمًا حتى تتمكن من شرح الوحدة الحالية بعبارات بسيطة." },
      { step: '02', title: 'حلقة التغذية الراجعة السقراطية', desc: "بدلاً من تقديم الإجابات، يطرح معلمنا الآلي الأسئلة التي تقودك إلى الإجابة. هذا هو 'التراكب السقراطي' الذي يمنع القراءة السلبية." },
      { step: '03', title: 'التركيب عابر اللغات', desc: "من خلال التبديل بين اللغات، ينشط الطلاب مسارات معرفية مختلفة، مما يعزز تجريد المفهوم من مجرد مفردات." }
    ],
    HI: [
      { step: '01', title: 'परमाणु अपघटन', desc: "हम प्रत्येक पाठ्यक्रम को ऐसे मॉड्यूल में विभाजित करते हैं जो एकल मुख्य अवधारणा पर ध्यान केंद्रित करते हैं। जब तक आप वर्तमान मॉड्यूल को सरल शब्दों में नहीं समझा सकते, तब तक आप आगे नहीं बढ़ सकते।" },
      { step: '02', title: 'सुकराती प्रतिक्रिया लूप', desc: "उत्तर प्रदान करने के बजाय, हमारा एआई ट्यूटर उन प्रश्नों को पूछता है जो आपको उत्तर की ओर ले जाते हैं। यह 'सुकराती ओवरले' है जो निष्क्रिय पढ़ने को रोकता है।" },
      { step: '03', title: 'क्रॉस-भाषाई संश्लेषण', desc: "भाषाओं को बदलकर, छात्र विभिन्न संज्ञानात्मक मार्गों को सक्रिय करते हैं, जिससे केवल शब्दावली से परे अवधारणा के अमूर्तीकरण को बल मिलता है।" }
    ],
    UR: [
      { step: '01', title: 'جوہری تحلیل', desc: "ہم ہر کورس کو ایسے ماڈیولز میں تقسیم کرتے ہیں جو ایک واحد بنیادی تصور پر مرکوز ہوتے ہیں۔ آپ اس وقت تک آگے نہیں بڑھ سکتے جب تک کہ آپ موجودہ ماڈیول کو آسان الفاظ میں بیان نہ کر سکیں۔" },
      { step: '02', title: 'سقراطی فیڈ بیک لوپ', desc: "جوابات فراہم کرنے کے بجائے، ہمارا AI ٹیوٹر وہ سوالات پوچھتا ہے جو آپ کو جواب کی طرف لے جاتے ہیں۔ یہ 'سقراطی اوورلے' ہے جو غیر فعال پڑھنے کو روکتا ہے۔" },
      { step: '03', title: 'بین اللسانی ترکیب', desc: "زبانیں تبدیل کرنے سے، طلباء مختلف علمی راستوں کو فعال کرتے ہیں، جس سے محض الفاظ سے بالاتر تصور کے تجرید کو تقویت ملتی ہے۔" }
    ]
  };

  const steps = PHILOSOPHY_STEPS[lang.toUpperCase() as keyof typeof PHILOSOPHY_STEPS] || PHILOSOPHY_STEPS.EN;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <TopNav />
      <div className="max-w-5xl mx-auto px-8 pt-32 pb-24">
        {/* SECTION 1: MISSION */}
        <header className="mb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            {t.mission_sub}
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-10 leading-[0.9] bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{t.mission}</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            {t.mission_desc}
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 mb-40">
           <div className="p-12 bg-slate-900/30 border border-slate-800 rounded-[60px] backdrop-blur-3xl group hover:border-blue-500/30 transition-all">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20"><Globe className="w-6 h-6" /></div>
                 {t.accessibility}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                 {t.accessibility_desc}
              </p>
           </div>
           <div className="p-12 bg-slate-900/30 border border-slate-800 rounded-[60px] backdrop-blur-3xl group hover:border-emerald-500/30 transition-all">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20"><Target className="w-6 h-6" /></div>
                 {t.quality}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                 {t.quality_desc}
              </p>
           </div>
        </div>

        {/* SECTION 2: METHODOLOGY */}
        <div className="mb-40">
          <div className="flex flex-col md:flex-row gap-20 items-start">
            <div className="md:w-1/3 sticky top-32">
              <h2 className="text-4xl font-black tracking-tighter mb-6">{t.methodology_desc}</h2>
              <p className="text-slate-500 leading-relaxed">
                {t.tutor} {t.placeholder.toLowerCase()}
              </p>
            </div>
            <div className="md:w-2/3 space-y-6">
               {steps.map(item => (
                 <div key={item.step} className="p-10 bg-slate-900/20 border border-slate-900 rounded-[40px] group hover:bg-slate-900/40 transition-all">
                    <div className="text-3xl font-black text-slate-800 group-hover:text-blue-500 transition-colors mb-4">{item.step}</div>
                    <h3 className="text-xl font-black mb-2 text-slate-200">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: OPEN SOURCE */}
        <div className="p-20 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-[80px] text-center">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white mx-auto mb-10 border border-slate-800 shadow-2xl">
             <Zap className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-6">{t.transparency}</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            {t.transparency_desc}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a 
              href="https://github.com/Open-Primer/OpenPrimer" 
              target="_blank" 
              className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all shadow-2xl"
            >
              {t.github_repository || "GitHub Repository"} <ChevronRight className="w-4 h-4" />
            </a>
            <Link href="/contact" className="text-blue-500 font-black uppercase tracking-widest text-[10px] hover:text-blue-400 transition-colors">
              {t.contact || "Contact Support"}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
