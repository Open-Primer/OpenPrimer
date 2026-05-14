"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, Target, Users, Mail, Phone, MapPin, Globe, Sparkles, 
  BookOpen, ChevronRight, Search, Filter, Book, Award, Zap, Languages,
  ShieldCheck, Clock, Star, CheckCircle2, GraduationCap
} from 'lucide-react';
import { TopNav, UI_STRINGS, Footer } from './RefinedUI';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { dbService } from '@/lib/db';

// --- PAGE: CATALOG ---
export const CatalogPage = () => {
  const { language: lang, setLanguage: setActiveLang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [courseLangFilter, setCourseLangFilter] = useState('EN');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    async function loadCourses() {
      const { data } = await dbService.getAllCourses();
      if (data) setCourses(data);
    }
    loadCourses();
  }, []);

  useEffect(() => {
    setCourseLangFilter(lang);
    
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


  const filteredCourses = courses.filter(c => 
    (subjectFilter === 'All' || c.subject === subjectFilter) &&
    (subjectFilter === 'Saved' ? bookmarks.includes(c.id) : true) &&
    (courseLangFilter === 'All' || (c.languages && c.languages.includes(courseLangFilter.toLowerCase()))) &&
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TopNav onLangChange={(l) => { setActiveLang(l); setCourseLangFilter(l); }} />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{t.catalog}</h1>
            <div className="flex items-center gap-2 text-slate-500">
               <Globe className="w-4 h-4" />
               <p className="font-medium">Discover courses in {courseLangFilter}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mb-12">
            {[
              { id: 'All', label: t.all },
              { id: 'Saved', label: t.saved },
              { id: 'Physics', label: t.physics },
              { id: 'Biology', label: t.biology },
              { id: 'Law', label: t.law },
              { id: 'Mathematics', label: t.math }
            ].map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setSubjectFilter(cat.id)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${subjectFilter === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-white'}`}
              >
                {cat.id === 'Saved' ? <span className="flex items-center gap-2"><Star className="w-3 h-3 fill-current" /> {cat.label}</span> : cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search} 
                className="bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-blue-500/50 transition-all w-full md:w-80" 
              />
            </div>
            
            {/* Lang Filter */}
            <div className="flex items-center gap-3 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
              {['EN', 'FR', 'ES', 'DE', 'ZH'].map(l => (
                <button 
                  key={l}
                  onClick={() => setCourseLangFilter(l)}
                  className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black transition-all ${courseLangFilter === l ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? filteredCourses.map((course) => (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={course.id}>
              <Link href={`/${course.level}/${course.subject}/${course.slug}/introduction`} className="group block h-full">
                <div className="p-8 bg-slate-900/40 border border-slate-800/50 rounded-[40px] hover:border-blue-500/50 transition-all shadow-2xl hover:shadow-blue-600/10 flex flex-col h-full backdrop-blur-xl">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Book className="w-6 h-6" />
                    </div>
                    <div className="flex gap-1 items-center">
                      <button 
                        onClick={(e) => toggleBookmark(course.id, e)}
                        className={`p-2 rounded-lg transition-all ${bookmarks.includes(course.id) ? 'text-blue-400 bg-blue-400/10' : 'text-slate-700 hover:text-slate-400 hover:bg-slate-800'}`}
                      >
                        <Star className={`w-4 h-4 ${bookmarks.includes(course.id) ? 'fill-current' : ''}`} />
                      </button>
                      <div className="flex gap-1 ml-2">
                        {course.langs.map(ln => (
                          <span key={ln} className={`w-2 h-2 rounded-full ${ln === courseLangFilter ? 'bg-blue-500' : 'bg-slate-800'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-black mb-3">{course.title}</h3>
                  <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed">Elite academic content certified in {course.langs.join(', ')}.</p>
                  
                  {/* PROGRESS INDICATOR (Mocked) */}
                  <div className="mb-6">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[8px] font-black uppercase text-slate-600">Progress</span>
                        <span className="text-[8px] font-black text-blue-500">32%</span>
                     </div>
                     <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="w-[32%] h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                    <button className="px-6 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                       Continue
                    </button>
                    <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )) : (
            <div className="col-span-full py-20 text-center">
               <Zap className="w-12 h-12 text-slate-800 mx-auto mb-4" />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No courses found for this filter.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

// --- PAGE: PHILOSOPHY ---
export const PhilosophyPage = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
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
    <div className="min-h-screen bg-slate-950 text-white font-sans">
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
    <div className="min-h-screen bg-slate-950 text-white font-sans">
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
    <div className="min-h-screen bg-slate-950 text-white font-sans">
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 font-sans overflow-hidden text-white">
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
