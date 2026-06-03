"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, Target, Users, Mail, Phone, MapPin, Globe, Sparkles, 
  BookOpen, ChevronRight, Search, Filter, Book, Award, Zap, Languages,
  ShieldCheck, Clock, Star, CheckCircle2, GraduationCap, X, Bell, Rocket,
  BrainCircuit, FlaskConical, Scale, Calculator, Atom, Leaf, Bookmark
} from 'lucide-react';
import { TopNav, UI_STRINGS, Footer } from './RefinedUI';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { dbService, progressService, isDatabaseConfigured } from '@/lib/db';
import { CourseKiosk } from './CourseKiosk';

// ── Smart Empty State: No courses found ───────────────────────────────────────────
const SUBJECT_SUGGESTIONS = [
  { label: 'Mathematics', icon: Calculator, href: '/catalog?search=Mathematics', color: 'blue' },
  { label: 'Physics', icon: Atom, href: '/catalog?search=Physics', color: 'violet' },
  { label: 'Biology', icon: Leaf, href: '/catalog?search=Biology', color: 'emerald' },
  { label: 'Chemistry', icon: FlaskConical, href: '/catalog?search=Chemistry', color: 'amber' },
  { label: 'Law', icon: Scale, href: '/catalog?search=Law', color: 'pink' },
  { label: 'Computer Science', icon: BrainCircuit, href: '/catalog?search=Computer', color: 'cyan' },
];

const SUGGESTIONS_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Mathematics': { EN: 'Mathematics', FR: 'Mathématiques', ES: 'Matemáticas', DE: 'Mathematik', ZH: '数学' },
  'Physics': { EN: 'Physics', FR: 'Physique', ES: 'Física', DE: 'Physik', ZH: '物理学' },
  'Biology': { EN: 'Biology', FR: 'Biologie', ES: 'Biología', DE: 'Biologie', ZH: '生物学' },
  'Chemistry': { EN: 'Chemistry', FR: 'Chimie', ES: 'Química', DE: 'Chemie', ZH: '化学' },
  'Law': { EN: 'Law', FR: 'Droit', ES: 'Derecho', DE: 'Rechtswissenschaften', ZH: '法学' },
  'Computer Science': { EN: 'Computer Science', FR: 'Informatique', ES: 'Informática', DE: 'Informatik', ZH: '计算机科学' },
};

const EMPTY_STATE_STRINGS = {
  EN: {
    title: "No courses found",
    subtitle_a: "This search is being tracked by our",
    subtitle_b: "AI Generation Engine.",
    freq_label: "Frequently searched — not yet generated",
    explain: "When enough students search for this topic, our sovereign AI curriculum engine automatically drafts and publishes a new course. You can leave your details below to be notified the moment it goes live.",
    email_placeholder: "Your email address",
    email_required: "Please enter a valid email address.",
    cta_notify: "Notify me when this course is live",
    success_title: "You're on the list!",
    success_desc: "We'll send you a notification as soon as this course is auto-generated and published.",
    alt_title: "Explore available courses",
    alt_sub: "Or try one of these popular subjects:",
    clear: "Clear search",
    privacy_note: "Your email address is securely retained for up to 90 days and will be automatically purged if the course is not generated within this period.",
  },
  FR: {
    title: "Aucun cours trouvé",
    subtitle_a: "Cette recherche est suivie par notre",
    subtitle_b: "Moteur de Génération IA.",
    freq_label: "Recherche fréquente — cours non encore généré",
    explain: "Lorsqu'un nombre suffisant d'étudiants recherchent ce sujet, notre moteur IA génère et publie automatiquement un nouveau cours. Laissez vos coordonnées ci-dessous pour être notifié dès sa mise en ligne.",
    email_placeholder: "Votre adresse e-mail",
    email_required: "Veuillez entrer une adresse e-mail valide.",
    cta_notify: "Me notifier à la mise en ligne du cours",
    success_title: "Vous êtes inscrit !",
    success_desc: "Nous vous enverrons une notification dès que ce cours sera généré et publié automatiquement.",
    alt_title: "Explorer les cours disponibles",
    alt_sub: "Ou essayez l'un de ces sujets populaires :",
    clear: "Effacer la recherche",
    privacy_note: "Votre adresse e-mail est conservée de manière sécurisée pendant 90 jours maximum et sera automatiquement supprimée si le cours n'est pas généré durant cette période.",
  },
  ES: {
    title: "No se encontraron cursos",
    subtitle_a: "Esta búsqueda es rastreada por nuestro",
    subtitle_b: "Motor de Generación IA.",
    freq_label: "Búsqueda frecuente — curso aún no generado",
    explain: "Cuando suficientes estudiantes buscan este tema, nuestro motor de IA genera y publica automáticamente un nuevo curso. Deja tus datos para recibir una notificación en cuanto esté disponible.",
    email_placeholder: "Tu dirección de correo",
    email_required: "Por favor, introduce un correo electrónico válido.",
    cta_notify: "Notificarme cuando el curso esté disponible",
    success_title: "¡Estás en la lista!",
    success_desc: "Te enviaremos una notificación en cuanto este curso sea generado y publicado.",
    alt_title: "Explorar cursos disponibles",
    alt_sub: "O prueba uno de estos temas populares:",
    clear: "Borrar búsqueda",
    privacy_note: "Su dirección de correo electrónico se conserva de forma segura durante un máximo de 90 días y se eliminará automáticamente si el curso no se genera durante este período.",
  },
  DE: {
    title: "Keine Kurse gefunden",
    subtitle_a: "Diese Suche wird von unserem",
    subtitle_b: "KI-Generierungs-Engine verfolgt.",
    freq_label: "Häufig gesucht — Kurs noch nicht generiert",
    explain: "Wenn genug Studierende dieses Thema suchen, erstellt und veröffentlicht unsere KI automatisch einen neuen Kurs. Hinterlasse deine Daten, um benachrichtigt zu werden, sobald er verfügbar ist.",
    email_placeholder: "Deine E-Mail-Adresse",
    email_required: "Bitte gib eine gültige E-Mail-Adresse ein.",
    cta_notify: "Benachrichtige mich, wenn der Kurs verfügbar ist",
    success_title: "Du bist auf der Liste!",
    success_desc: "Wir senden dir eine Benachrichtigung, sobald dieser Kurs automatisch generiert und veröffentlicht wurde.",
    alt_title: "Verfügbare Kurse erkunden",
    alt_sub: "Oder probiere eines dieser beliebten Themen:",
    clear: "Suche löschen",
    privacy_note: "Ihre E-Mail-Adresse wird bis zu 90 Tage lang sicher aufbewahrt und automatisch gelöscht, wenn der Kurs in diesem Zeitraum nicht erstellt wird.",
  },
  ZH: {
    title: "未找到课程",
    subtitle_a: "此搜索正由我们的",
    subtitle_b: "AI生成引擎追踪。",
    freq_label: "搜索频繁 — 课程尚未生成",
    explain: "当足够多的学生搜索此主题时，我们的 AI 主权课程引擎将自动起草并发布新课程。请在下方留下您的信息，以便在课程上线时第一时间收到通知。",
    email_placeholder: "您的电子邮件地址",
    email_required: "请输入有效的电子邮件地址。",
    cta_notify: "课程上线时通知我",
    success_title: "您已成功报名！",
    success_desc: "一旦此课程被自动生成并发布，我们将立即向您发送通知。",
    alt_title: "探索现有课程",
    alt_sub: "或者尝试这些热门主题：",
    clear: "清除搜索",
    privacy_note: "您的电子邮件地址将被安全保留最多90天，如果在此期间未生成课程，将被自动清除。",
  },
};

interface SmartEmptyStateProps {
  searchQuery: string;
  onClear: () => void;
  lang: string;
  onSelectSubject?: (subject: string) => void;
}

const SmartEmptyState = ({ searchQuery, onClear, lang, onSelectSubject }: SmartEmptyStateProps) => {
  const es = EMPTY_STATE_STRINGS[lang as keyof typeof EMPTY_STATE_STRINGS] || EMPTY_STATE_STRINGS.EN;
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(es.email_required); return; }
    // Persist notification request in localStorage (mock backend)
    if (typeof window !== 'undefined') {
      const key = 'op_course_notifications';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ query: searchQuery, email: email.trim(), timestamp: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    }
    setSubmitted(true);
  };

  return (
    <div className="col-span-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto py-12 space-y-8"
      >
        {/* Header section */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/20 flex items-center justify-center shadow-2xl shadow-violet-500/5">
            <Rocket className="w-9 h-9 text-violet-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">{es.title}</h2>
            {searchQuery && (
              <p className="text-sm text-slate-400 leading-relaxed">
                {es.subtitle_a}{' '}
                <span className="text-violet-400 font-bold">{es.subtitle_b}</span>
              </p>
            )}
          </div>
        </div>

        {/* Explanation card */}
        {searchQuery && (
          <div className="p-6 bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BrainCircuit className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{es.explain}</p>
            </div>
          </div>
        )}

        {/* Notification Form */}
        {searchQuery && (
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-center space-y-3"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-lg font-black text-emerald-400">{es.success_title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{es.success_desc}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-violet-600/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">{es.cta_notify}</span>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl">
                    {error}
                  </div>
                )}

                {/* Email field — blocking */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={es.email_placeholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-11 pr-5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>

                {/* Privacy Warning Sub-label */}
                <p className="text-[10px] text-slate-500 leading-relaxed text-center px-4 font-medium">
                  {es.privacy_note}
                </p>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-violet-600/20 flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  {es.cta_notify}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-800/60" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{es.alt_sub}</span>
          <div className="flex-1 h-px bg-slate-800/60" />
        </div>

        {/* Alternative subject suggestions */}
        <div className="w-full max-w-4xl mx-auto relative z-50">
          <CourseKiosk 
            lang={lang} 
            mode="disciplines"
            title={lang.toUpperCase() === 'FR' ? "Découvrez nos disciplines d'élite" : "Explore Our Elite Disciplines"}
            subtitle={lang.toUpperCase() === 'FR' ? "Sélectionnez une discipline pour relancer votre recherche" : "Select a discipline to restart your search"}
            onDisciplineClick={(subject) => onSelectSubject?.(subject)}
          />
        </div>

        {/* Clear search */}
        {searchQuery && (
          <div className="text-center">
            <button
              onClick={onClear}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> {es.clear}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const COURSE_SYLLABUS_DETAILS: Record<number, { ects: number; hours: number; prerequisites: string[]; units: { title: string; modules: string[] }[] }> = {
  1: {
    ects: 6,
    hours: 150,
    prerequisites: ["Mathematics L1 (Calculus)", "General Physics (Introduction)"],
    units: [
      { title: "Kinematics", modules: ["Position Vectors", "Polar Coordinates", "Frenet Frames"] },
      { title: "Dynamics", modules: ["Newton's Laws", "Differential Equations", "Momentum"] },
      { title: "Work & Energy", modules: ["Work-Energy Theorem", "Potential Energy", "Conservative Forces"] }
    ]
  },
  2: {
    ects: 8,
    hours: 200,
    prerequisites: ["Classical Mechanics L1", "Linear Algebra"],
    units: [
      { title: "Quantum States", modules: ["Wave-Particle Duality", "Schrödinger Equation", "State Vectors"] },
      { title: "Quantum Operators", modules: ["Hermitian Operators", "Eigenvalues", "Uncertainty Principle"] }
    ]
  },
  3: {
    ects: 6,
    hours: 150,
    prerequisites: ["General Chemistry", "Introduction to Biology"],
    units: [
      { title: "Cellular Structures", modules: ["Membrane Dynamics", "Organelles", "Cytoskeleton"] },
      { title: "Metabolism", modules: ["Glycolysis", "Krebs Cycle", "Oxidative Phosphorylation"] }
    ]
  },
  4: {
    ects: 6,
    hours: 150,
    prerequisites: ["Cell Biology L1"],
    units: [
      { title: "Genetic Code", modules: ["DNA Replication", "Transcription Factors", "Translation"] },
      { title: "Gene Regulation", modules: ["Operons", "Epigenetics", "Recombinant DNA"] }
    ]
  },
  5: {
    ects: 6,
    hours: 150,
    prerequisites: ["Introduction to Legal Studies"],
    units: [
      { title: "Constitutional Systems", modules: ["Separation of Powers", "Judicial Review", "Federalism"] },
      { title: "Fundamental Rights", modules: ["Due Process", "Equal Protection", "Freedom of Expression"] }
    ]
  },
  6: {
    ects: 6,
    hours: 150,
    prerequisites: ["Constitutional Law L1"],
    units: [
      { title: "General Principles", modules: ["Actus Reus", "Mens Rea", "Strict Liability"] },
      { title: "Specific Offenses", modules: ["Homicide", "Property Crimes", "Defenses"] }
    ]
  },
  7: {
    ects: 6,
    hours: 150,
    prerequisites: ["High School Algebra"],
    units: [
      { title: "Vector Spaces", modules: ["Linear Combinations", "Span & Basis", "Dimension"] },
      { title: "Linear Transformations", modules: ["Matrices", "Kernel & Image", "Determinants"] }
    ]
  },
  8: {
    ects: 6,
    hours: 150,
    prerequisites: ["High School Precalculus"],
    units: [
      { title: "Limits & Continuity", modules: ["Delta-Epsilon Definition", "Squeeze Theorem", "Asymptotes"] },
      { title: "Derivatives", modules: ["Chain Rule", "Implicit Differentiation", "Optimization"] }
    ]
  },
  9: {
    ects: 6,
    hours: 150,
    prerequisites: ["General Chemistry"],
    units: [
      { title: "Hydrocarbons", modules: ["Alkanes & Alkenes", "Stereochemistry", "Conformational Analysis"] },
      { title: "Reactions", modules: ["Nucleophilic Substitution", "Elimination Reactions", "Electrophilic Addition"] }
    ]
  },
  10: {
    ects: 6,
    hours: 150,
    prerequisites: ["Calculus I"],
    units: [
      { title: "Consumer Theory", modules: ["Preferences & Utility", "Budget Constraint", "Optimal Choice"] },
      { title: "Producer Theory", modules: ["Production Functions", "Cost Minimization", "Profit Maximization"] }
    ]
  },
  11: {
    ects: 6,
    hours: 150,
    prerequisites: ["High School Mathematics"],
    units: [
      { title: "Probability", modules: ["Combinatorics", "Bayes Theorem", "Random Variables"] },
      { title: "Statistical Inference", modules: ["Hypothesis Testing", "Confidence Intervals", "Regression"] }
    ]
  },
  12: {
    ects: 18,
    hours: 450,
    prerequisites: ["Linear Algebra", "Calculus I", "L1 Statistics"],
    units: [
      { title: "Foundations & Networks", modules: ["Neural Networks", "Gradient Descent", "Backpropagation"] },
      { title: "Sovereign Systems & LLMs", modules: ["Attention Mechanisms", "Model Sharding", "Distributed Inference"] }
    ]
  },
  18: {
    ects: 26,
    hours: 650,
    prerequisites: ["High School General Sciences"],
    units: [
      { title: "Structure & Genetics L1", modules: ["Cell Biology", "Molecular Genetics"] },
      { title: "Biochemistry & Microbiology L1", modules: ["Structural Biochemistry", "Microbiology", "General Ecology"] }
    ]
  }
};

// --- PAGE: CATALOG ---
export const CatalogPage = () => {
  const { language: lang, setLanguage: setActiveLang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const getLocalizedLabel = (key: string) => {
    const l = lang.toUpperCase();
    const labels: Record<string, Record<string, string>> = {
      mastery_weight: {
        EN: "Mastery Weight",
        FR: "Poids de maîtrise",
        ES: "Peso de maestría",
        DE: "Meisterungsgewicht",
        ZH: "掌握权重"
      },
      duration: {
        EN: "Duration",
        FR: "Durée",
        ES: "Duración",
        DE: "Dauer",
        ZH: "时长"
      },
      level: {
        EN: "Level",
        FR: "Niveau",
        ES: "Nivel",
        DE: "Stufe",
        ZH: "级别"
      },
      credits: {
        EN: "credits",
        FR: "crédits",
        ES: "créditos",
        DE: "Credits",
        ZH: "学分"
      },
      hours_unit: {
        EN: "hrs",
        FR: "h",
        ES: "hrs",
        DE: "Std.",
        ZH: "小时"
      },
      why_create_account: {
        EN: "Why create an account?",
        FR: "Pourquoi créer un compte ?",
        ES: "¿Por qué crear una cuenta?",
        DE: "Warum ein Konto erstellen?",
        ZH: "为什么要创建账户？"
      },
      account_benefits: {
        EN: "A free account allows you to save your progress permanently, accumulate your study credits, unlock certifications, and interact with your personal AI Tutor.",
        FR: "Un compte gratuit vous permet de sauvegarder durablement votre progression, d'accumuler vos crédits de formation, d'obtenir vos certifications, et d'activer le Tuteur IA personnel pour lever vos doutes.",
        ES: "Una cuenta gratuita le permite guardar su progreso permanentemente, acumular sus créditos de estudio, desbloquear certificaciones e interactuar con su tutor de IA personal.",
        DE: "Mit einem kostenlosen Konto können Sie Ihren Fortschritt dauerhaft speichern, Ihre Studienleistungen sammeln, Zertifikate freischalten und mit Ihrem persönlichen KI-Tutor interagieren.",
        ZH: "免费账户可以永久保存您的进度、累积您的学习学分、解锁认证并与您的个人 AI 导师互动。"
      },
      create_account: {
        EN: "Create an Account",
        FR: "Créer un Compte",
        ES: "Crear una Cuenta",
        DE: "Konto Erstellen",
        ZH: "创建账户"
      },
      log_in: {
        EN: "Log In",
        FR: "Se Connecter",
        ES: "Iniciar Sesión",
        DE: "Einloggen",
        ZH: "登录"
      },
      start_limited: {
        EN: "Start learning with limited features",
        FR: "Démarrer avec des fonctions limitées",
        ES: "Comenzar a aprender con funciones limitadas",
        DE: "Mit eingeschränkten Funktionen lernen",
        ZH: "以有限的功能开始学习"
      }
    };
    return labels[key]?.[l] || labels[key]?.EN || '';
  };
  const [subjectFilter, setSubjectFilter] = useState('All');
  // Initialize from URL immediately so ?search= params work on first render
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('search') || '';
    }
    return '';
  });

  // Synchronize searchQuery to URL search parameters in real-time
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (searchQuery) {
        url.searchParams.set('search', searchQuery);
      } else {
        url.searchParams.delete('search');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchQuery]);

  // Synchronize searchQuery with back/forward history events (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('search') || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamically translate active search queries when language changes
  useEffect(() => {
    if (!searchQuery) return;
    
    let foundKey: string | null = null;
    let foundLang: string | null = null;
    
    for (const [key, langMap] of Object.entries(SUGGESTIONS_TRANSLATIONS)) {
      for (const [l, val] of Object.entries(langMap)) {
        if (searchQuery.toLowerCase() === val.toLowerCase() || searchQuery.toLowerCase() === key.toLowerCase()) {
          foundKey = key;
          foundLang = l;
          break;
        }
      }
      if (foundKey) break;
    }
    
    if (foundKey) {
      const translated = SUGGESTIONS_TRANSLATIONS[foundKey]?.[lang.toUpperCase()] || foundKey;
      if (translated && translated.toLowerCase() !== searchQuery.toLowerCase()) {
        setSearchQuery(translated);
      }
    }
  }, [lang]);

  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  // isLoading starts true — stays true until the first DB response arrives.
  // This prevents the 'no courses found' flash on mount.
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [filterType, setFilterType] = useState<'All' | 'Course' | 'Curriculum'>('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'validations'>('popularity');

  // Free Client-Side Translation States for Courses
  const [translatedCourses, setTranslatedCourses] = useState<Record<number, { title: string; description: string }>>({});
  const [translatingCourseIds, setTranslatingCourseIds] = useState<Record<number, boolean>>({});

  // Dynamic Enrollment States
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<any | null>(null);
  const [userProgress, setUserProgress] = useState<any>(null);

  // enrolled IDs: loaded exclusively from Supabase in production;
  // only falls back to localStorage when explicitly in sandbox mode.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isSandbox = localStorage.getItem('op_sandbox_mode') === 'true';
    if (isSandbox) {
      const saved = localStorage.getItem('op_enrolled_courses');
      try {
        setEnrolledIds(saved ? JSON.parse(saved) : []);
      } catch { setEnrolledIds([]); }
    }
    // Production enrolled IDs come from loadCoursesAndProgress() via Supabase below
  }, []);

  const translateCourse = async (courseId: number, title: string, description: string) => {
    if (translatedCourses[courseId]) {
      // Toggle back to original
      setTranslatedCourses(prev => {
        const copy = { ...prev };
        delete copy[courseId];
        return copy;
      });
      return;
    }
    if (translatingCourseIds[courseId]) return;

    setTranslatingCourseIds(prev => ({ ...prev, [courseId]: true }));
    try {
      const targetLang = lang.toLowerCase();
      // Translate title
      const resTitle = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(title)}`);
      const dataTitle = await resTitle.json();
      const translatedTitle = dataTitle[0].map((x: any) => x[0]).join('');

      // Translate description
      const resDesc = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(description)}`);
      const dataDesc = await resDesc.json();
      const translatedDesc = dataDesc[0].map((x: any) => x[0]).join('');

      setTranslatedCourses(prev => ({
        ...prev,
        [courseId]: { title: translatedTitle, description: translatedDesc }
      }));
    } catch (error) {
      console.error("Course translation failed", error);
    } finally {
      setTranslatingCourseIds(prev => ({ ...prev, [courseId]: false }));
    }
  };

  // Delegates to the canonical 90-day rule in progressService
  const isCourseNew = (course: any) => progressService.isNewCourse(course.created_at);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const val = localStorage.getItem('op_show_welcome_catalog_popup');
      if (val === 'true') {
        setShowWelcomePopup(true);
      }
    }
  }, []);

  const dismissWelcomePopup = () => {
    localStorage.removeItem('op_show_welcome_catalog_popup');
    setShowWelcomePopup(false);
  };

  useEffect(() => {
    async function loadCoursesAndProgress() {
      setIsLoading(true);
      try {
        const { data } = await dbService.getAllCourses();
        if (data && data.length > 0) {
          setCourses(data);
        } else if (data) {
          // Empty array returned — still set it so filter can run
          setCourses(data);
        }
        // Only fetch progress in production (Supabase configured) and not sandbox
        const isSandbox = typeof window !== 'undefined' && localStorage.getItem('op_sandbox_mode') === 'true';
        if (isDatabaseConfigured && !isSandbox) {
          let userId = 'u1';
          if (typeof window !== 'undefined') {
            const savedProfile = window.localStorage.getItem('op_user_profile');
            if (savedProfile) {
              try {
                const p = JSON.parse(savedProfile);
                if (p.id) userId = p.id;
              } catch (e) {}
            }
          }
          const { data: progressData } = await dbService.getUserProgress(userId);
          if (progressData) {
            setUserProgress(progressData);
            if (progressData.activeModules) {
              // Supabase is authoritative — overwrite any sandbox enrolled IDs
              setEnrolledIds(progressData.activeModules.map((m: any) => m.id));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load courses/progress', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCoursesAndProgress();

    // Read URL search param on mount
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('search');
      if (query) setSearchQuery(query);
    }
  }, []);

  useEffect(() => {
    // Session state — read from localStorage (session flag is legitimately local)
    const session = typeof window !== 'undefined' ? localStorage.getItem('op_session') : null;
    setIsLoggedIn(session === 'true');

    // Bookmarks are a local preference — localStorage is appropriate here
    const savedBookmarks = typeof window !== 'undefined' ? localStorage.getItem('op_bookmarks') : null;
    if (savedBookmarks) {
      try { setBookmarks(JSON.parse(savedBookmarks)); } catch {}
    }
  }, [lang]);

  // Debounce search logging to database search history
  useEffect(() => {
    if (!searchQuery.trim()) return;

    const timer = setTimeout(async () => {
      const cleanSearch = searchQuery.trim().toLowerCase();
      // Calculate if the search matches any active courses in the database
      const matchingCount = courses.filter(c => {
        const currentLevel = typeof c.archivingLevel === 'number' ? c.archivingLevel : 0;
        if (currentLevel >= 2) return false;
        
        // Strip accents for robust comparison
        const stripAccents = (str: string) =>
          str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const localizedTitle = dbService.getLocalizedCourseTitle(c, lang) || c.title;
        const cleanTitle = stripAccents(localizedTitle).toLowerCase();
        const cleanOrigTitle = stripAccents(c.title).toLowerCase();
        const cleanSubject = stripAccents(c.subject || '').toLowerCase();
        const cleanDesc = stripAccents(c.description || '').toLowerCase();
        const queryClean = stripAccents(cleanSearch);

        return cleanTitle.includes(queryClean) || 
               cleanOrigTitle.includes(queryClean) || 
               cleanSubject.includes(queryClean) || 
               cleanDesc.includes(queryClean);
      }).length;

      const wasSuccessful = matchingCount > 0;
      let userId = 'u1';
      if (typeof window !== 'undefined') {
        const savedProfile = window.localStorage.getItem('op_user_profile');
        if (savedProfile) {
          try {
            const p = JSON.parse(savedProfile);
            if (p.id) userId = p.id;
          } catch (e) {}
        }
      }
      try {
        await dbService.addSearchHistoryEntry({
          query: searchQuery.trim(),
          wasSuccessful,
          userId,
          userLanguage: lang
        });
      } catch (err) {
        console.error("Failed to record search history entry", err);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchQuery, lang, courses]);

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('op_bookmarks', JSON.stringify(newBookmarks));
  };

  const getLocalizedCourseTitle = (course: any) => {
    return dbService.getLocalizedCourseTitle(course, lang);
  };

  const formatCourseLevel = (level: string | number) => {
    const lvlStr = String(level).toUpperCase();
    const isEn = lang.toUpperCase() === 'EN';
    const isZh = lang.toUpperCase() === 'ZH';
    const isEs = lang.toUpperCase() === 'ES';
    const isDe = lang.toUpperCase() === 'DE';
    const isFr = lang.toUpperCase() === 'FR';

    if (lvlStr === 'SECONDARY_1') {
      if (isFr) return 'Secondaire 1';
      if (isZh) return '高中一年级';
      if (isEs) return 'Secundaria 1';
      if (isDe) return 'Sekundarstufe 1';
      return 'Secondary 1';
    }
    if (lvlStr === 'SECONDARY_2') {
      if (isFr) return 'Secondaire 2';
      if (isZh) return '高中二年级';
      if (isEs) return 'Secundaria 2';
      if (isDe) return 'Sekundarstufe 2';
      return 'Secondary 2';
    }
    if (lvlStr === 'SECONDARY_3') {
      if (isFr) return 'Secondaire 3';
      if (isZh) return '高中三年级';
      if (isEs) return 'Secundaria 3';
      if (isDe) return 'Sekundarstufe 3';
      return 'Secondary 3';
    }
    if (lvlStr.startsWith('SECONDARY_')) {
      const num = lvlStr.split('_')[1];
      if (isFr) return `Secondaire ${num}`;
      if (isZh) return `高中${num}年级`;
      if (isEs) return `Secundaria ${num}`;
      if (isDe) return `Sekundarstufe ${num}`;
      return `Secondary ${num}`;
    }
    if (lvlStr.startsWith('PRIMARY_')) {
      const num = lvlStr.split('_')[1];
      if (isFr) return `Primaire ${num}`;
      if (isZh) return `小学${num}年级`;
      if (isEs) return `Primaria ${num}`;
      if (isDe) return `Primarstufe ${num}`;
      return `Primary ${num}`;
    }

    if (lvlStr === 'L1') {
      if (isEn) return '101';
      if (isZh) return '大一 (101)';
      if (isEs) return 'L1 (101)';
      if (isDe) return 'L1 (101)';
      return 'L1';
    }
    if (lvlStr === 'L2') {
      if (isEn) return '201';
      if (isZh) return '大二 (201)';
      if (isEs) return 'L2 (201)';
      if (isDe) return 'L2 (201)';
      return 'L2';
    }
    if (lvlStr === 'L3') {
      if (isEn) return '301';
      if (isZh) return '大三 (301)';
      if (isEs) return 'L3 (301)';
      if (isDe) return 'L3 (301)';
      return 'L3';
    }

    if (/^\d+$/.test(lvlStr)) {
      const num = parseInt(lvlStr, 10);
      if (isZh) return `${num}年级`;
      if (isEn) return `Grade ${num}`;
      if (lang.toUpperCase() === 'FR') return `Niveau ${num}`;
      if (isEs) return `Grado ${num}`;
      if (isDe) return `Klasse ${num}`;
    }
    return lvlStr;
  };

  const filteredCourses = courses.filter(c => {
    // Respect standardized archiving levels:
    // Level 0: Active, visible for all
    // Level 1: Invisible for new selection (can't select, doesn't appear unless already in bookmarks)
    // Level 2: Invisible for users that were using it (therefore invisible for all users)
    const currentLevel = typeof c.archivingLevel === 'number' ? c.archivingLevel : 0;
    if (currentLevel >= 2) return false;
    if (currentLevel === 1) {
      if (!bookmarks.includes(c.id)) {
        return false;
      }
    }
    if (c.is_active === false) return false;
    
    const matchesLang = !!(c.languages && c.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase()));
    const isNew = isCourseNew(c);
    const localizedTitle = getLocalizedCourseTitle(c);
    
    const stripAccents = (str: string) => {
      if (!str) return '';
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const queryClean = stripAccents(searchQuery);
    const matchesSearch = stripAccents(localizedTitle).includes(queryClean) || 
                          stripAccents(c.title).includes(queryClean) ||
                          stripAccents(c.subject).includes(queryClean) ||
                          stripAccents(c.description).includes(queryClean) ||
                          (isNew && (
                            queryClean === 'new' || 
                            queryClean === 'nouveau' || 
                            queryClean === 'nouveaute' ||
                            queryClean === 'nouveautes'
                          ));
    const matchesSaved = subjectFilter === 'Saved' ? bookmarks.includes(c.id) : true;
    const matchesNew = showNewOnly ? isNew : true;
    const matchesFilterType = filterType === 'All'
      ? true
      : filterType === 'Course'
        ? !c.isCurriculum
        : c.isCurriculum;
    return matchesLang && matchesSearch && matchesSaved && matchesNew && matchesFilterType;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'popularity') {
      return (b.popularity || 0) - (a.popularity || 0);
    } else {
      return (b.validations || 0) - (a.validations || 0);
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <TopNav onLangChange={(l) => setActiveLang(l as any)} />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight pb-2 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 leading-tight">
              {t.catalog}
            </h1>
            <div className="flex flex-col gap-1.5 mt-2">
               <div className="flex items-center gap-2 text-slate-500">
                  <Globe className="w-4 h-4" />
                  <p className="font-semibold text-xs uppercase tracking-wider">
                    {t.active_language}
                  </p>
               </div>
               {!isLoggedIn && (
                  <div className="translation-guide-banner mt-3 px-4 py-3 bg-gradient-to-r from-blue-950/60 via-blue-900/30 to-blue-950/60 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 rounded-2xl max-w-md text-[11px] leading-relaxed text-blue-400/90 font-medium flex items-start gap-3 shadow-lg shadow-blue-500/5">
                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                    <div>
                      <span className="font-bold text-white uppercase text-[8px] tracking-wider block mb-1">
                        {t.catalog_translation_guide}
                      </span>
                      {t.translation_guide_text}
                    </div>
                  </div>
               )}
            </div>
          </div>
          
          {/* Controls Column: Stack Row 1 & Row 2 vertically, aligned to the right */}
          <div className="flex flex-col gap-4 items-stretch md:items-end w-full md:w-auto mt-2">
            
            {/* ── Row 1: Search + Type filters + New Only ─────────────────────────── */}
            <div className="flex flex-wrap items-center gap-3 justify-start md:justify-end w-full">
              {/* Search Input */}
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.search} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-blue-500/50 transition-all w-full text-white" 
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-600 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Catalog Filter Mode (All / Courses / Curricula) */}
              <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl shrink-0">
                {[
                  { key: 'All',        label: { EN: 'All',      FR: 'Tout',         ES: 'Todo',    DE: 'Alle',       ZH: '全部',   IT: 'Tutti' } },
                  { key: 'Course',     label: { EN: 'Courses',  FR: 'Cours',        ES: 'Cursos',  DE: 'Kurse',      ZH: '课程',   IT: 'Corsi' } },
                  { key: 'Curriculum', label: { EN: 'Curricula',FR: 'Curriculums',  ES: 'Planes',  DE: 'Lehrpläne',  ZH: '课程体系', IT: 'Curriculum' } }
                ].map(opt => {
                  const active = filterType === opt.key;
                  const labelText = opt.label[lang.toUpperCase() as keyof typeof opt.label] || opt.label.EN;
                  return (
                    <button 
                      key={opt.key}
                      type="button"
                      onClick={() => setFilterType(opt.key as any)}
                      className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
                    >
                      {labelText}
                    </button>
                  );
                })}
              </div>
              
              {/* New Only toggle */}
              <button 
                type="button"
                onClick={() => setShowNewOnly(!showNewOnly)}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer ${showNewOnly ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
              >
                <Sparkles className={`w-4 h-4 ${showNewOnly ? 'animate-pulse text-white' : ''}`} />
                <span className="hidden sm:inline">
                  {lang.toUpperCase() === 'FR' ? 'Nouveautés' : 
                   lang.toUpperCase() === 'ES' ? 'Nuevos' : 
                   lang.toUpperCase() === 'DE' ? 'Neuheiten' : 
                   lang.toUpperCase() === 'ZH' ? '最新课程' : 'New Only'}
                </span>
              </button>
            </div>

            {/* ── Row 2: Sort + Saved — right-aligned under Row 1 ─────────── */}
            <div className="flex flex-wrap items-center gap-3 justify-start md:justify-end w-full">
              {/* Saved bookmark — only when logged in */}
              {isLoggedIn && (
                <button 
                  type="button"
                  onClick={() => setSubjectFilter(subjectFilter === 'Saved' ? 'All' : 'Saved')}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer ${subjectFilter === 'Saved' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
                >
                  <Bookmark className={`w-4 h-4 ${subjectFilter === 'Saved' ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{t.saved}</span>
                </button>
              )}

              {/* Sort — Popularity / Graduates */}
              <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl shrink-0">
                {[
                  { key: 'popularity',  label: { EN: 'Popularity', FR: 'Popularité',  ES: 'Popularidad', DE: 'Beliebtheit', ZH: '最热',  IT: 'Popolarità' } },
                  { key: 'validations', label: { EN: 'Graduates',  FR: 'Diplômés',    ES: 'Graduados',   DE: 'Absolventen', ZH: '结业数', IT: 'Diplomati' } }
                ].map(opt => {
                  const active = sortBy === opt.key;
                  const labelText = opt.label[lang.toUpperCase() as keyof typeof opt.label] || opt.label.EN;
                  return (
                    <button 
                      key={opt.key}
                      type="button"
                      onClick={() => setSortBy(opt.key as any)}
                      className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${active ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
                    >
                      {labelText}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading || (courses.length > 0 && filteredCourses.length === 0 && !searchQuery.trim() && subjectFilter === 'All' && !showNewOnly && filterType === 'All') ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                {lang === 'FR' ? 'Chargement des cours...' : 'Loading courses...'}
              </p>
            </div>
          ) : sortedCourses.length > 0 ? sortedCourses.map((course) => {
            const isEnrolled = enrolledIds.includes(course.id);
            const activeModule = userProgress?.activeModules?.find((m: any) => m.slug === course.slug || m.id === course.id || m.title_key === course.title_key);
            const progressPercent = activeModule ? activeModule.progress : 12;
            return (
              <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={course.id}>
                <Link 
                  href={`/${course.level}/${course.subject}/${course.slug}/introduction`}
                  onClick={async (e) => {
                    if (isLoggedIn && !isEnrolled) {
                      e.preventDefault();
                      e.stopPropagation();
                      let userId = 'u1';
                      const savedProfile = localStorage.getItem('op_user_profile');
                      if (savedProfile) {
                        try {
                          const p = JSON.parse(savedProfile);
                          if (p.id) userId = p.id;
                        } catch (err) {}
                      }
                      if (!course.isCurriculum) {
                        await dbService.enrollInCourse(userId, course.id);
                        setEnrolledIds(prev => [...prev, course.id]);
                        window.dispatchEvent(new Event('op_progress_updated'));
                        window.location.href = `/${course.level}/${course.subject}/${course.slug}/introduction`;
                      } else {
                        setSelectedEnrollCourse(course);
                      }
                    }
                  }}
                  className="group block h-full"
                >
                  <div className="p-8 bg-slate-900/40 border border-slate-880/50 rounded-[40px] hover:border-blue-500/50 transition-all shadow-2xl hover:shadow-blue-600/10 flex flex-col h-full backdrop-blur-xl relative overflow-hidden">
                    
                    {/* Corner ribbon: NEW takes priority over REVISED */}
                    {(() => {
                      const isNew = isCourseNew(course);
                      const isRecentlyRevised = !isNew &&
                        course.last_revision_date &&
                        (Date.now() - new Date(course.last_revision_date).getTime()) < 30 * 24 * 60 * 60 * 1000;
                      if (isNew) return (
                        <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                          <div className="absolute top-6 -left-8 w-[150px] bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 -rotate-45 shadow-xl border-y border-white/20 select-none">
                            {lang.toUpperCase() === 'FR' ? 'Nouveau' :
                             lang.toUpperCase() === 'ES' ? 'Nuevo' :
                             lang.toUpperCase() === 'DE' ? 'Neu' :
                             lang.toUpperCase() === 'ZH' ? '最新' : 'New'}
                          </div>
                        </div>
                      );
                      if (isRecentlyRevised) return (
                        <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                          <div className="absolute top-6 -left-8 w-[150px] bg-gradient-to-r from-emerald-600 to-teal-400 text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 -rotate-45 shadow-xl border-y border-white/20 select-none">
                            {lang.toUpperCase() === 'FR' ? 'Révisé' :
                             lang.toUpperCase() === 'ES' ? 'Revisado' :
                             lang.toUpperCase() === 'DE' ? 'Überarbeitet' :
                             lang.toUpperCase() === 'ZH' ? '已更新' : 'Revised'}
                          </div>
                        </div>
                      );
                      return null;
                    })()}

                    <div className="flex justify-between items-center mb-6 w-full gap-4">
                      {course.isCurriculum ? (
                        <div className="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform flex-shrink-0" title={lang === 'FR' ? "Curriculum complet" : "Complete Curriculum"}>
                          <GraduationCap className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0">
                          <Book className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex gap-2 items-center flex-1 justify-end flex-wrap mr-8">
                        {/* Course / Curriculum Differentiating Badge */}
                        {course.isCurriculum ? (
                          <span className="px-2.5 py-1 bg-violet-950/40 border border-violet-900/30 rounded-lg text-[8px] font-black uppercase text-violet-400 tracking-wider">
                            🎓 Curriculum
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-900/30 rounded-lg text-[8px] font-black uppercase text-blue-400 tracking-wider">
                            📖 Course
                          </span>
                        )}
                        {/* Unified gold star rating badge */}
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 flex items-center gap-1.5" title={`${(course.averageRating ?? 0).toFixed(1)} / 5 — ${course.ratingCount ?? 0} reviews`}>
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {(course.averageRating && course.averageRating > 0) ? course.averageRating.toFixed(1) : "3.4"} ({(course.ratingCount && course.ratingCount > 0) ? course.ratingCount : 12})
                        </span>
                        {/* Expected duration chip */}
                        <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-900/30 rounded-lg text-[8px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1" title={`${COURSE_SYLLABUS_DETAILS[course.id]?.hours || 150} expected learning hours`}>
                          <Clock className="w-3 h-3 text-blue-400" />
                          {COURSE_SYLLABUS_DETAILS[course.id]?.hours || 150}h
                        </span>
                        {/* Bookmark (logged-in only) */}
                        {isLoggedIn && (
                          <button
                            onClick={(e) => toggleBookmark(course.id, e)}
                            title={bookmarks.includes(course.id) ? 'Remove bookmark' : 'Save this course'}
                            className={`p-2 rounded-lg transition-all ${bookmarks.includes(course.id) ? 'text-blue-400 bg-blue-400/10' : 'text-slate-700 hover:text-slate-400 hover:bg-slate-800'}`}
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarks.includes(course.id) ? 'fill-current' : ''}`} />
                          </button>
                        )}
                        {/* Level badge */}
                        <span className="px-2.5 py-1 bg-slate-850 border border-slate-750 rounded-lg text-[8px] font-black uppercase text-slate-400 tracking-wider">
                          {formatCourseLevel(course.level)}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black mb-3 group-hover:text-blue-400 transition-colors">
                      {translatedCourses[course.id]?.title || getLocalizedCourseTitle(course)}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 flex-1 leading-relaxed">
                      {translatedCourses[course.id]?.description || course.description}
                    </p>


                    {/* PROGRESS INDICATOR (only visible if logged in AND enrolled) */}
                    {isLoggedIn && isEnrolled && (
                      <div className="mb-6">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-[8px] font-black uppercase text-slate-600">{lang === 'FR' ? 'Progression' : 'Progress'}</span>
                            <span className="text-[8px] font-black text-blue-500">{progressPercent}%</span>
                         </div>
                         <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" style={{ width: `${progressPercent}%` }} />
                         </div>
                         <div className="flex items-center justify-between text-[7px] font-bold text-slate-500 uppercase tracking-wider">
                           <span>{lang === 'FR' ? 'Temps passé :' : 'Time spent:'} {progressService.getLessonTimeForCourse(course.slug)}m</span>
                           <span>{lang === 'FR' ? 'Attendu :' : 'Expected:'} {COURSE_SYLLABUS_DETAILS[course.id]?.hours || 150}h</span>
                         </div>
                      </div>
                    )}


                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                      <button 
                        onClick={(e) => {
                          if (isLoggedIn && !isEnrolled) {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedEnrollCourse(course);
                          }
                        }}
                        className={`px-6 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600 hover:text-white`}
                      >
                         {!isLoggedIn ? (lang === 'FR' ? 'Commencer à apprendre' : 'Start learning') : isEnrolled ? (lang === 'FR' ? 'Continuer' : 'Continue') : (lang === 'FR' ? "S'inscrire" : 'Enroll')}
                      </button>
                      <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          }) : (
            <SmartEmptyState
              searchQuery={searchQuery}
              onClear={() => setSearchQuery('')}
              lang={lang}
              onSelectSubject={(subject) => {
                const translated = SUGGESTIONS_TRANSLATIONS[subject]?.[lang.toUpperCase()] || subject;
                setSearchQuery(translated);
              }}
            />
          )}
        </div>
      </div>
      <Footer />

      <AnimatePresence>
        {showWelcomePopup && (
          <div 
            onClick={dismissWelcomePopup}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-slate-900 border border-slate-850 rounded-[32px] p-8 shadow-2xl relative overflow-hidden text-center cursor-default"
            >
              {/* Decorative radial gradients */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl" />

              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 flex items-center justify-center shadow-xl shadow-blue-500/5 mb-6">
                <GraduationCap className="w-8 h-8 text-blue-400" />
              </div>

              <h2 className="text-2xl font-black text-white mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                {lang === 'FR' ? "Bienvenue sur OpenPrimer !" :
                 lang === 'ES' ? "¡Bienvenido a OpenPrimer!" :
                 lang === 'DE' ? "Willkommen bei OpenPrimer!" :
                 lang === 'ZH' ? "欢迎来到 OpenPrimer！" :
                 "Welcome to OpenPrimer!"}
              </h2>
              
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                {lang === 'FR' ? "Votre inscription a été validée avec succès. Il ne vous reste plus qu'à choisir les cours qui vous intéressent dans le catalogue ci-dessous pour composer votre premier curriculum personnalisé !" :
                 lang === 'ES' ? "Su registro se ha validado correctamente. ¡Solo tiene que elegir los cookies que le interesan en el catálogo siguiente para componer su primer plan de estudios personalizado!" :
                 lang === 'DE' ? "Ihre Registrierung wurde erfolgreich bestätigt. Wählen Sie nun einfach die Kurse, die Sie interessieren, aus dem untenstehenden Katalog aus, um Ihren ersten personalisierten Lehrplan zu erstellen!" :
                 lang === 'ZH' ? "您的注册已成功通过验证。现在，您只需从下方的目录中选择您感兴趣的课程，即可构建您的第一个个性化课程表！" :
                 "Your registration has been successfully validated. All that is left is to choose the courses that interest you in the catalog below to build your first personalized curriculum!"}
              </p>

              <button
                onClick={dismissWelcomePopup}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-blue-600/20 cursor-pointer"
              >
                {lang === 'FR' ? "Commencer à explorer" :
                 lang === 'ES' ? "Empezar a explorar" :
                 lang === 'DE' ? "Jetzt erkunden" :
                 lang === 'ZH' ? "开始探索" :
                 "Start Exploring"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Socratic Interactive Syllabus Enrollment Overlay Panel */}
      <AnimatePresence>
        {selectedEnrollCourse && (
          <div 
            onClick={() => setSelectedEnrollCourse(null)} 
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-slate-900 border border-slate-850 rounded-[40px] p-8 md:p-10 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar cursor-default"
            >
              <button 
                onClick={() => setSelectedEnrollCourse(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{selectedEnrollCourse.subject}</p>
                  <h2 className="text-2xl font-black text-white">{getLocalizedCourseTitle(selectedEnrollCourse)}</h2>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl text-center">
                  <Sparkles className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">{getLocalizedLabel('mastery_weight')}</p>
                  <p className="text-xs font-black text-white">{COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.ects ? COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id].ects * 100 : 600} {getLocalizedLabel('credits')}</p>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl text-center">
                  <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">{getLocalizedLabel('duration')}</p>
                  <p className="text-xs font-black text-white">{COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.hours || 150} {getLocalizedLabel('hours_unit')}</p>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl text-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">{getLocalizedLabel('level')}</p>
                  <p className="text-xs font-black text-white">{formatCourseLevel(selectedEnrollCourse.level)}</p>
                </div>
              </div>

              {/* Prerequisites */}
              {selectedEnrollCourse && COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.prerequisites && COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id].prerequisites.length > 0 && (
                <div className="mb-8 p-5 bg-slate-950/30 border border-slate-850 rounded-2xl">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider mb-3">
                    {t.prerequisites || "Academic Prerequisites"}
                  </p>
                  <div className="flex flex-col gap-2">
                    {COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id].prerequisites.map((pre, idx) => {
                      const matchedCourse = courses.find(c => c.title.toLowerCase().includes(pre.toLowerCase()) || pre.toLowerCase().includes(c.title.toLowerCase()));
                      const isSatisfied = matchedCourse ? enrolledIds.includes(matchedCourse.id) : false;
                      const clickable = !!matchedCourse;
                      
                      const handleClick = () => {
                        if (matchedCourse) {
                          setSelectedEnrollCourse(matchedCourse);
                        }
                      };

                      return (
                        <div 
                          key={idx} 
                          onClick={clickable ? handleClick : undefined}
                          title={clickable ? `${t.prerequisite_view_prefix || "View details for: "}${matchedCourse.title}` : undefined}
                          className={`flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-850/60 transition-all ${
                            clickable 
                              ? 'hover:bg-slate-900/80 hover:border-blue-500/30 hover:scale-[1.01] cursor-pointer' 
                              : ''
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                            {pre}
                            {clickable && <ChevronRight className="w-3 h-3 text-slate-500" />}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            isSatisfied 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {isSatisfied 
                              ? (t.prerequisite_unlocked || "✓ Unlocked") 
                              : (t.prerequisite_required || "⚠️ Required")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Syllabus Units */}
              <div className="space-y-6 mb-10">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-850 pb-2">{t.syllabus_overview}</p>
                {(COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.units || []).map((unit, uIdx) => (
                  <div key={uIdx} className="space-y-3">
                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-4 h-px bg-blue-500/30" /> {unit.title}
                    </h4>
                    <div className="grid gap-2 pl-6">
                      {unit.modules.map((mod, mIdx) => (
                        <div key={mIdx} className="px-4 py-2 bg-slate-950/20 border border-slate-850 rounded-xl text-xs text-slate-300">
                          {mod}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {!isLoggedIn ? (
                <div className="space-y-6 pt-4 border-t border-slate-850 w-full">
                  <div className="p-5 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
                    <h5 className="text-xs font-black text-blue-400 uppercase tracking-wider mb-2 font-sans">
                      {getLocalizedLabel('why_create_account')}
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {getLocalizedLabel('account_benefits')}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => {
                        setSelectedEnrollCourse(null);
                        window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: 'signup' }));
                      }}
                      className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black uppercase tracking-widest text-[9px] rounded-2xl transition-all shadow-xl shadow-blue-600/20 text-center cursor-pointer font-sans"
                    >
                      {getLocalizedLabel('create_account')}
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedEnrollCourse(null);
                        window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: 'login' }));
                      }}
                      className="flex-1 py-3.5 bg-slate-800 border border-slate-750 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl transition-all hover:text-white hover:border-slate-700 text-center cursor-pointer font-sans"
                    >
                      {getLocalizedLabel('log_in')}
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => {
                        setSelectedEnrollCourse(null);
                        window.location.href = `/${selectedEnrollCourse.level}/${selectedEnrollCourse.subject}/${selectedEnrollCourse.slug}/introduction`;
                      }}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-2 inline-flex items-center gap-1.5 font-sans"
                    >
                      <span>{getLocalizedLabel('start_limited')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 w-full">
                  <button 
                    onClick={() => setSelectedEnrollCourse(null)}
                    className="px-6 py-4 bg-slate-950 border border-slate-850 text-slate-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer font-sans"
                  >
                    {t.cancel || "Cancel"}
                  </button>
                  <button
                    onClick={async () => {
                      // Enroll course
                      let userId = 'u1';
                      const savedProfile = localStorage.getItem('op_user_profile');
                      if (savedProfile) {
                        try {
                          const p = JSON.parse(savedProfile);
                          if (p.id) userId = p.id;
                        } catch (err) {}
                      }
                      await dbService.enrollInCourse(userId, selectedEnrollCourse.id);
                      setEnrolledIds(prev => [...prev, selectedEnrollCourse.id]);
                      setSelectedEnrollCourse(null);
                      window.dispatchEvent(new Event('op_progress_updated'));
                      // Redirect to course
                      window.location.href = `/${selectedEnrollCourse.level}/${selectedEnrollCourse.subject}/${selectedEnrollCourse.slug}/introduction`;
                    }}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer font-sans"
                  >
                    <Rocket className="w-4 h-4" />
                    {lang === 'FR' ? "S'inscrire & Commencer" : "Enroll & Start Learning"}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- PAGE: PHILOSOPHY ---
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
      { step: '03', title: 'Sintesi Trans-Linguistica', desc: "Cambiando lingua, gli studenti attivano percorsi cognitivi diversi, rafforzando l'astrazione del concetto dal semplice vocabolario." }
    ],
    ZH: [
      { step: '01', title: '原子化分解', desc: "我们将每门课程拆分为专注于单一核心概念的模块。只有在你能用简单的语言解释当前模块时，才能继续前进。" },
      { step: '02', title: '苏格拉底式反馈闭环', desc: "我们的AI导师不会直接提供答案，而是通过提问引导你找到答案，防止被动阅读。" },
      { step: '03', title: '跨语言合成认知', desc: "通过切换语言，学生可以激活不同的认知途径，增强概念从单纯词汇中的学术抽象理解。" }
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
              GitHub Repository <ChevronRight className="w-4 h-4" />
            </a>
            <Link href="/contact" className="text-blue-500 font-black uppercase tracking-widest text-[10px] hover:text-blue-400 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

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
      desc: "Contatta il nostro team operativo globale per partnership o feedback sul Feynman Engine.",
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
    },
    IT: {
      title: "Termini di Servizio",
      date: "Data di Decorrenza: 11 Maggio 2026",
      sec1_t: "1. Uso Consentito",
      sec1_d: "OpenPrimer è una risorsa accademica. Gli utenti sono tenuti a interagire con il Tutor IA in modo rispettoso e a utilizzare la piattaforma per scopi di apprendimento autentico.",
      sec2_t: "2. Proprietà Intellettuale",
      sec2_d: "Tutto il software principale è concesso in licenza MIT. Il contenuto accademico è concesso in licenza CC BY-NC-SA 4.0, consentendo la condivisione non commerciale con corretta attribuzione.",
      sec3_t: "3. Limitazione di Responsabilità",
      sec3_d: "La piattaforma viene fornita 'così com'è'. Sebbene ci impegniamo per il massimo rigore accademico, gli utenti dovrebbero sempre verificare le informazioni critiche con fonti universitarie ufficiali."
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
      </div>
      <Footer />
    </div>
  );
};

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
      desc: "No vendemos tus datos. Tu progreso de aprendizaje se utiliza exclusivamente para calibrar el Tutor de IA para tus necesidades específicas. Cumplimos con el RGPD y los estándares globales de privacidad para la protección de datos académicos."
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
export const SyllabusPage = ({ title = "Classical Mechanics L1" }) => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const course = {
    title,
    ects: 600,
    hours: 150,
    prerequisites: ["Mathematics L1 (Calculus)", "General Physics (Introduction)"],
    content: [
      { unit: "Kinematics", modules: ["Position Vectors", "Polar Coordinates", "Frenet Frames"] },
      { unit: "Dynamics", modules: ["Newton's Laws", "Differential Equations", "Momentum"] },
      { unit: "Work & Energy", modules: ["Work-Energy Theorem", "Potential Energy", "Conservative Forces"] }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-blue-500/30 font-sans overflow-hidden">
      <TopNav />
      <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{course.title}</h1>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20">
             Start Course
          </button>
        </div>
        
        <div className={`grid grid-cols-1 ${course.prerequisites && course.prerequisites.length > 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-16`}>
           <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[40px] text-center backdrop-blur-xl shadow-2xl">
              <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Mastery Weight</p>
              <p className="text-2xl font-black text-white">{course.ects} <span className="text-sm text-slate-500">{lang === 'FR' ? 'crédits' : 'credits'}</span></p>
           </div>
           <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[40px] text-center backdrop-blur-xl shadow-2xl">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Expected Time</p>
              <p className="text-2xl font-black text-white">{course.hours} Hours</p>
           </div>
           {course.prerequisites && course.prerequisites.length > 0 && (
             <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[40px] text-center backdrop-blur-xl shadow-2xl">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Prerequisites</p>
                <p className="text-[10px] font-bold text-slate-400 leading-tight mt-2">{course.prerequisites.join(' • ')}</p>
             </div>
           )}
        </div>

        <div className="space-y-12">
          {course.content.map(unit => (
            <div key={unit.unit}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6 flex items-center gap-4">
                 <span className="w-8 h-px bg-blue-500/30" /> {unit.unit}
              </h3>
              <div className="grid gap-4">
                {unit.modules.map(mod => (
                  <div key={mod} className="flex items-center justify-between p-6 bg-slate-900/20 border border-slate-800 rounded-3xl group hover:border-blue-500/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{mod}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* NEW: ASSESSMENTS SECTION */}
          <div className="pt-12 border-t border-slate-900">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-8 flex items-center gap-4">
                <ShieldCheck className="w-4 h-4" /> Academic Assessments
             </h3>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[40px] relative overflow-hidden group hover:bg-emerald-500/10 transition-all">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <GraduationCap className="w-20 h-20" />
                   </div>
                   <h4 className="text-lg font-black text-white mb-2">Final Examination</h4>
                   <p className="text-xs text-slate-500 mb-6 leading-relaxed">Comprehensive evaluation covering all units. Required for certification.</p>
                   <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase">Not Started</div>
                   </div>
                </div>
                <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] opacity-50">
                   <h4 className="text-lg font-black text-slate-400 mb-2">Intermediate Quiz</h4>
                   <p className="text-xs text-slate-600 mb-6">Unit: Kinematics. (Unlocks after completing first 4 modules).</p>
                   <div className="w-full h-1 bg-slate-800 rounded-full">
                      <div className="w-[40%] h-full bg-slate-700" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

