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
import { dbService } from '@/lib/db';

// ── Smart Empty State: No courses found ──────────────────────────────────────
const SUBJECT_SUGGESTIONS = [
  { label: 'Mathematics', icon: Calculator, href: '/catalog?search=Mathematics', color: 'blue' },
  { label: 'Physics', icon: Atom, href: '/catalog?search=Physics', color: 'violet' },
  { label: 'Biology', icon: Leaf, href: '/catalog?search=Biology', color: 'emerald' },
  { label: 'Chemistry', icon: FlaskConical, href: '/catalog?search=Chemistry', color: 'amber' },
  { label: 'Law', icon: Scale, href: '/catalog?search=Law', color: 'pink' },
  { label: 'Computer Science', icon: BrainCircuit, href: '/catalog?search=Computer', color: 'cyan' },
];

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
}

const SmartEmptyState = ({ searchQuery, onClear, lang }: SmartEmptyStateProps) => {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUBJECT_SUGGESTIONS.map((s) => {
            const IconComp = s.icon;
            const colorMap: Record<string, string> = {
              blue: 'border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-600/5 text-blue-400',
              violet: 'border-violet-500/20 hover:border-violet-500/50 hover:bg-violet-600/5 text-violet-400',
              emerald: 'border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-600/5 text-emerald-400',
              amber: 'border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-600/5 text-amber-400',
              pink: 'border-pink-500/20 hover:border-pink-500/50 hover:bg-pink-600/5 text-pink-400',
              cyan: 'border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-600/5 text-cyan-400',
            };
            return (
              <Link
                key={s.label}
                href={s.href}
                className={`p-4 bg-slate-900/40 border rounded-2xl flex items-center gap-3 transition-all group ${colorMap[s.color]}`}
              >
                <IconComp className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
                  {s.label}
                </span>
              </Link>
            );
          })}
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

const COURSE_SYLLABUS_DETAILS: Record<number, { ects: number; hours: number; prerequisites: string[]; units: { title: string; modules: string[] }[] }> = {
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
  }
};

// --- PAGE: CATALOG ---
export const CatalogPage = () => {
  const { language: lang, setLanguage: setActiveLang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);

  // Free Client-Side Translation States for Courses
  const [translatedCourses, setTranslatedCourses] = useState<Record<number, { title: string; description: string }>>({});
  const [translatingCourseIds, setTranslatingCourseIds] = useState<Record<number, boolean>>({});

  // Dynamic Enrollment States
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('op_enrolled_courses');
      if (saved) {
        setEnrolledIds(JSON.parse(saved));
      } else {
        // Enrolled initially in Mechanics (1) and Cell Biology (3)
        const defaults = [1, 3];
        localStorage.setItem('op_enrolled_courses', JSON.stringify(defaults));
        setEnrolledIds(defaults);
      }
    }
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

  const isCourseNew = (course: any) => {
    if (!course.created_at) return false;
    const created = new Date(course.created_at).getTime();
    const now = new Date().getTime();
    const diffTime = now - created;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 90;
  };

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
    async function loadCourses() {
      const { data } = await dbService.getAllCourses();
      if (data) setCourses(data);
    }
    loadCourses();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('search');
      if (query) {
        setSearchQuery(query);
      }
    }
  }, []);

  useEffect(() => {
    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session !== 'false');

    const savedBookmarks = localStorage.getItem('op_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
  }, [lang]);

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
    const isEn = lang.toUpperCase() === 'EN';
    const slug = course.slug;
    const id = course.id;

    if (slug === 'Classical_Mechanics' || slug === 'classical-mechanics' || id === 1) {
      return isEn ? "Physics: Classical Mechanics" : "Physique : Mécanique Classique";
    }
    if (slug === 'Physique_Test_L2' || slug === 'quantum-physics' || id === 2) {
      return isEn ? "Physics: Quantum Physics (L2)" : "Physique : Physique Quantique (L2)";
    }
    if (slug === 'Biologie_Test' || slug === 'cell-biology' || id === 3) {
      return isEn ? "Biology: Cell Biology" : "Biologie : Biologie Cellulaire";
    }
    if (slug === 'Biologie_Test_L1' || slug === 'molecular-genetics' || id === 4) {
      return isEn ? "Biology: Molecular Genetics" : "Biologie : Génétique Moléculaire";
    }
    if (slug === 'Droit_Test' || slug === 'constitutional-law' || id === 5) {
      return isEn ? "Law: Constitutional Law" : "Droit : Droit Constitutionnel";
    }
    if (slug === 'Droit_Test_L2' || id === 6) {
      return isEn ? "Law: Criminal Law (L2)" : "Droit : Droit Pénal (L2)";
    }
    if (slug === 'Maths_Test' || id === 7) {
      return isEn ? "Mathematics: Linear Algebra" : "Mathématiques : Algèbre Linéaire";
    }
    if (slug === 'Maths_Test_L1' || id === 8) {
      return isEn ? "Mathematics: Calculus I" : "Mathématiques : Analyse I";
    }
    if (slug === 'Chimie_Test' || id === 9) {
      return isEn ? "Chemistry: Organic Chemistry" : "Chimie : Chimie Organique";
    }
    if (slug === 'Economie_Test' || id === 10) {
      return isEn ? "Economics: Microeconomics" : "Économie : Microéconomie";
    }
    return course.title;
  };

  const formatCourseLevel = (level: string | number) => {
    const lvlStr = String(level).toUpperCase();
    const isEn = lang.toUpperCase() === 'EN';
    const isZh = lang.toUpperCase() === 'ZH';
    const isEs = lang.toUpperCase() === 'ES';
    const isDe = lang.toUpperCase() === 'DE';

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
    
    const matchesLang = c.languages && c.languages.includes(lang.toLowerCase());
    const isNew = isCourseNew(c);
    const localizedTitle = getLocalizedCourseTitle(c);
    const matchesSearch = localizedTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (isNew && (
                            searchQuery.toLowerCase() === 'new' || 
                            searchQuery.toLowerCase() === 'nouveau' || 
                            searchQuery.toLowerCase() === 'nouveauté' ||
                            searchQuery.toLowerCase() === 'nouveautés'
                          ));
    const matchesSaved = subjectFilter === 'Saved' ? bookmarks.includes(c.id) : true;
    const matchesNew = showNewOnly ? isNew : true;
    return matchesLang && matchesSearch && matchesSaved && matchesNew;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <TopNav onLangChange={(l) => setActiveLang(l as any)} />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">
              {t.catalog}
            </h1>
            <div className="flex items-center gap-2 text-slate-500">
               <Globe className="w-4 h-4" />
               <p className="font-semibold text-xs uppercase tracking-wider">
                 Language: {lang === 'FR' ? 'Français' : lang === 'ES' ? 'Español' : lang === 'DE' ? 'Deutsch' : lang === 'ZH' ? '中文' : 'English'}
               </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
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
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-600 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            {/* Standalone Premium New Courses Filter Toggle */}
            <button 
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

            {/* Standalone Premium Star Bookmark Toggle (only visible if logged in) */}
            {isLoggedIn && (
              <button 
                onClick={() => setSubjectFilter(subjectFilter === 'Saved' ? 'All' : 'Saved')}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${subjectFilter === 'Saved' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
              >
                <Bookmark className={`w-4 h-4 ${subjectFilter === 'Saved' ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{t.saved}</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? filteredCourses.map((course) => {
            const isEnrolled = enrolledIds.includes(course.id);
            return (
              <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={course.id}>
                <Link 
                  href={`/${course.level}/${course.subject}/${course.slug}/introduction`}
                  onClick={(e) => {
                    if (isLoggedIn && !isEnrolled) {
                      e.preventDefault();
                      setSelectedEnrollCourse(course);
                    }
                  }}
                  className="group block h-full"
                >
                  <div className="p-8 bg-slate-900/40 border border-slate-880/50 rounded-[40px] hover:border-blue-500/50 transition-all shadow-2xl hover:shadow-blue-600/10 flex flex-col h-full backdrop-blur-xl relative overflow-hidden">
                    
                    {/* Ultra Flashy corner diagonal Ribbon */}
                    {isCourseNew(course) && (
                      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                        <div className="absolute top-6 -right-8 w-[150px] bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 rotate-45 shadow-xl border-y border-white/20 select-none">
                          {lang.toUpperCase() === 'FR' ? 'Nouveau' : 
                           lang.toUpperCase() === 'ES' ? 'Nuevo' : 
                           lang.toUpperCase() === 'DE' ? 'Neu' : 
                           lang.toUpperCase() === 'ZH' ? '最新' : 'New'}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <Book className="w-6 h-6" />
                      </div>
                      <div className="flex gap-2 items-center mr-8">
                        {/* Unified gold star rating badge */}
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 flex items-center gap-1.5" title={`${(course.averageRating ?? 0).toFixed(1)} / 5 — ${course.ratingCount ?? 0} reviews`}>
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {(course.averageRating && course.averageRating > 0) ? course.averageRating.toFixed(1) : "3.4"} ({(course.ratingCount && course.ratingCount > 0) ? course.ratingCount : 12})
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
                    <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed">
                      {translatedCourses[course.id]?.description || course.description}
                    </p>

                    {/* PROGRESS INDICATOR (only visible if logged in AND enrolled) */}
                    {isLoggedIn && isEnrolled && (
                      <div className="mb-6">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-[8px] font-black uppercase text-slate-600">Progress</span>
                            <span className="text-[8px] font-black text-blue-500">24%</span>
                         </div>
                         <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="w-[24%] h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
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
                        className={`px-6 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEnrolled ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600 hover:text-white' : 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-600 hover:text-white'}`}
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
                 lang === 'ES' ? "Su registro se ha validado correctamente. ¡Solo tiene que elegir los cursos que le interesan en el catálogo siguiente para componer su primer plan de estudios personalizado!" :
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
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-slate-900 border border-slate-850 rounded-[40px] p-8 md:p-10 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar"
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
                  <Award className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">Credits</p>
                  <p className="text-xs font-black text-white">{COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.ects || 6} ECTS</p>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl text-center">
                  <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">Duration</p>
                  <p className="text-xs font-black text-white">{COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.hours || 150} hrs</p>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl text-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">Level</p>
                  <p className="text-xs font-black text-white">{formatCourseLevel(selectedEnrollCourse.level)}</p>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="mb-8 p-5 bg-slate-950/30 border border-slate-850 rounded-2xl">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider mb-2">Prerequisites</p>
                <div className="flex flex-wrap gap-2">
                  {(COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.prerequisites || []).map((pre, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-950 rounded-lg text-[9px] font-bold text-slate-400 border border-slate-850">{pre}</span>
                  ))}
                </div>
              </div>

              {/* Syllabus Units */}
              <div className="space-y-6 mb-10">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-850 pb-2">Syllabus Overview</p>
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

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedEnrollCourse(null)}
                  className="px-6 py-4 bg-slate-950 border border-slate-850 text-slate-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setSelectedEnrollCourse(null);
                      window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: 'signup' }));
                      return;
                    }
                    // Enroll course
                    const updated = [...enrolledIds, selectedEnrollCourse.id];
                    setEnrolledIds(updated);
                    localStorage.setItem('op_enrolled_courses', JSON.stringify(updated));
                    setSelectedEnrollCourse(null);
                    // Redirect to course
                    window.location.href = `/${selectedEnrollCourse.level}/${selectedEnrollCourse.subject}/${selectedEnrollCourse.slug}/introduction`;
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer animate-bounce"
                >
                  <Rocket className="w-4 h-4" />
                  {isLoggedIn ? (lang === 'FR' ? "S'inscrire & Commencer" : "Enroll & Start Learning") : (lang === 'FR' ? "Créer un Compte pour s'Inscrire" : "Sign Up to Enroll")}
                </button>
              </div>
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
             {[
               { step: "01", title: "Atomic Decomposition", desc: "We break every course into modules that focus on a single core concept. You can't move forward until you can explain the current module in simple terms." },
               { step: "02", title: "Socratic Feedback Loop", desc: "Instead of providing answers, our AI Tutor asks the questions that lead you to the answer. This is the 'Socratic Overlay' that prevents passive reading." },
               { step: "03", title: "Cross-Linguistic Synthesis", desc: "By switching languages, students activate different cognitive pathways, reinforcing the concept's abstraction from mere vocabulary." }
             ].map(item => (
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

// --- PAGE: CONTACT ---
export const ContactPage = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (resp.ok) setIsSent(true);
      else alert("Failed to send message. Please try again later.");
    } catch (err) {
      alert("An error occurred. Please try again.");
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
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">Get in Touch</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-12">
            <p className="text-slate-400 leading-relaxed">Reach out to our global ops team for partnerships or feedback on the Feynman Engine.</p>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500"><Globe className="w-5 h-5" /></div>
               <div>
                 <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Global Support Operations</p>
                 <p className="font-bold text-slate-200 uppercase tracking-tight">support@openprimer.org</p>
               </div>
            </div>
          </div>
          <div className="bg-slate-900/50 p-10 rounded-[40px] border border-slate-800 shadow-2xl backdrop-blur-2xl">
              {isSent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Message Received</h3>
                  <p className="text-slate-500 text-sm">We will get back to you shortly.</p>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                   <div className="flex flex-col gap-4">
                      <input name="name" type="text" placeholder="Full Name" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" required />
                      <input name="email" type="email" placeholder="Email Address" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" required />
                   </div>
                   <textarea name="message" placeholder="Your Message" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm h-40 focus:outline-none focus:border-blue-500/50 transition-all resize-none" required></textarea>
                    <button 
                      type="submit" 
                      disabled={isSending}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20"
                    >
                      {isSending ? "Dispatching..." : "Send Inquiry"}
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

// --- PAGE: TERMS ---
export const TermsPage = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <TopNav />
    <div className="max-w-3xl mx-auto px-8 pt-32 pb-24 prose prose-invert prose-slate">
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">Terms of Service</h1>
      <p className="text-slate-400">Effective Date: May 11, 2026</p>
      <h2>1. Acceptable Use</h2>
      <p>OpenPrimer is an academic resource. Users are expected to interact with the AI Tutor respectfully and use the platform for genuine learning purposes.</p>
      <h2>2. Intellectual Property</h2>
      <p>All core software is licensed under MIT. Academic content is licensed under CC BY-NC-SA 4.0, allowing non-commercial sharing with proper attribution.</p>
      <h2>3. Limitation of Liability</h2>
      <p>The platform is provided "as-is". While we strive for absolute academic rigor, users should always cross-reference critical information with official university sources.</p>
    </div>
      <Footer />
    </div>
  );
};

// --- PAGE: PRIVACY ---
export const PrivacyPage = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <TopNav />
    <div className="max-w-3xl mx-auto px-8 pt-32 pb-24 prose prose-invert prose-slate">
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">Privacy Policy</h1>
      <p className="text-slate-400 text-sm italic">"Your data, your progress, your sovereignty."</p>
      <p>We do not sell your data. Your learning progress is used exclusively to calibrate the AI Tutor for your specific needs. We comply with GDPR and global privacy standards for academic data protection.</p>
    </div>
      <Footer />
    </div>
  );
};

// --- PAGE: SYLLABUS ---
export const SyllabusPage = ({ title = "Classical Mechanics L1" }) => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const course = {
    title,
    ects: 6,
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
           <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[40px] text-center backdrop-blur-xl shadow-2xl">
              <Award className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Academic Credits</p>
              <p className="text-2xl font-black text-white">{course.ects} ECTS</p>
           </div>
           <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[40px] text-center backdrop-blur-xl shadow-2xl">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Expected Time</p>
              <p className="text-2xl font-black text-white">{course.hours} Hours</p>
           </div>
           <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[40px] text-center backdrop-blur-xl shadow-2xl">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Prerequisites</p>
              <p className="text-[10px] font-bold text-slate-400 leading-tight mt-2">{course.prerequisites.join(' • ')}</p>
           </div>
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
