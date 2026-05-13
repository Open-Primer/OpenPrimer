"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, Target, Users, Mail, Phone, MapPin, Globe, Sparkles, 
  BookOpen, ChevronRight, Search, Filter, Book, Award, Zap, Languages,
  ShieldCheck, Clock, Star
} from 'lucide-react';
import { TopNav, UI_STRINGS, Footer } from './RefinedUI';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

// --- PAGE: CATALOG ---
export const CatalogPage = () => {
  const { language: activeLang, setLanguage: setActiveLang } = useLanguage();
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [courseLangFilter, setCourseLangFilter] = useState('EN');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    setCourseLangFilter(activeLang);
    
    const savedBookmarks = localStorage.getItem('op_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
  }, []);

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('op_bookmarks', JSON.stringify(newBookmarks));
  };

  const t = UI_STRINGS[activeLang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const courses = [
    { id: 1, title: "Kinematics 1D", level: "L1", subject: "Physics", langs: ["EN", "FR", "ZH"], slug: "kinematics-1d" },
    { id: 2, title: "Cell Structure", level: "L1", subject: "Biology", langs: ["EN", "ES", "ZH"], slug: "cell-structure" },
    { id: 3, title: "Constitutional Law", level: "L1", subject: "Law", langs: ["EN", "FR", "DE"], slug: "const-law" },
    { id: 4, title: "Linear Algebra", level: "L1", subject: "Mathematics", langs: ["EN", "PT", "ZH"], slug: "linear-algebra" },
    { id: 5, title: "Quantum Basics", level: "L2", subject: "Physics", langs: ["EN", "DE", "ZH"], slug: "quantum-basics" },
  ];

  const filteredCourses = courses.filter(c => 
    (subjectFilter === 'All' || c.subject === subjectFilter) &&
    (subjectFilter === 'Saved' ? bookmarks.includes(c.id) : true) &&
    (c.langs.includes(courseLangFilter)) &&
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TopNav onLangChange={(l) => { setActiveLang(l); setCourseLangFilter(l); }} />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-4">{t.catalog}</h1>
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
export const PhilosophyPage = () => (
  <div className="min-h-screen bg-slate-950 text-white font-sans">
    <TopNav />
    <div className="max-w-5xl mx-auto px-8 pt-32 pb-24">
      {/* SECTION 1: MISSION */}
      <header className="mb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
          Project Manifesto
        </div>
        <h1 className="text-7xl font-black tracking-tighter mb-10 leading-[0.9]">Universal Academic <br /><span className="text-blue-500 italic">Sovereignty</span></h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          OpenPrimer is built on the belief that elite education is a fundamental human right, not a localized privilege. 
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12 mb-40">
         <div className="p-12 bg-slate-900/30 border border-slate-800 rounded-[60px] backdrop-blur-3xl group hover:border-blue-500/30 transition-all">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20"><Globe className="w-6 h-6" /></div>
               Radical Accessibility
            </h3>
            <p className="text-slate-400 leading-relaxed">
               We eliminate linguistic barriers by providing all certified academic content in the 5 most spoken global languages. Using our proprietary <strong>Feynman Translation Engine</strong>, we ensure that technical rigor remains intact across cultural boundaries.
            </p>
         </div>
         <div className="p-12 bg-slate-900/30 border border-slate-800 rounded-[60px] backdrop-blur-3xl group hover:border-emerald-500/30 transition-all">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20"><Target className="w-6 h-6" /></div>
               Institutional Quality
            </h3>
            <p className="text-slate-400 leading-relaxed">
               Every module on OpenPrimer is aligned with international standards (ECTS, US Credits). Our objective is to provide a repository of knowledge that matches the rigor of the world's leading universities, freely available to anyone with a browser.
            </p>
         </div>
      </div>

      {/* SECTION 2: METHODOLOGY */}
      <div className="mb-40">
        <div className="flex flex-col md:flex-row gap-20 items-start">
          <div className="md:w-1/3 sticky top-32">
            <h2 className="text-4xl font-black tracking-tighter mb-6">The Feynman <br /><span className="text-blue-500">Methodology</span></h2>
            <p className="text-slate-500 leading-relaxed">
              Our AI Tutor is trained to detect "The Illusion of Knowledge" and help you break complex concepts into their atomic components.
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
        <h2 className="text-4xl font-black tracking-tighter mb-6">Radical Transparency</h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
          The logic of education should never be a black box. OpenPrimer is 100% Open Source. 
          Anyone can audit our syllabus generation algorithms or contribute to the curriculum.
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

// --- PAGE: CONTACT ---
export const ContactPage = () => (
  <div className="min-h-screen bg-slate-950 text-white font-sans">
    <TopNav />
    <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
      <div className="flex items-center gap-3 mb-12 text-violet-500">
        <Mail className="w-8 h-8" />
        <h1 className="text-4xl font-black tracking-tighter">Get in Touch</h1>
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
            <form className="space-y-6" onSubmit={(e) => {
               e.preventDefault();
               const email = (e.target as any).email.value;
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               if (!emailRegex.test(email)) {
                  alert("Please enter a valid email address.");
                  return;
               }
               alert("Message sent successfully!");
            }}>
               <div className="grid md:grid-cols-2 gap-4">
                  <input name="name" type="text" placeholder="Full Name" className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" required />
                  <input name="email" type="email" placeholder="Email Address" className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" required />
               </div>
               <textarea name="message" placeholder="Your Message" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm h-48 focus:outline-none focus:border-blue-500/50 transition-all resize-none" required></textarea>
                <button 
                  type="submit" 
                  onClick={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget.form;
                    if (!form) return;
                    const name = (form.name as any).value;
                    const email = (form.email as any).value;
                    const message = (form.message as any).value;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                       alert("Please enter a valid email address.");
                       return;
                    }
                    window.location.href = `mailto:support@openprimer.org?subject=Inquiry from ${name}&body=${message} (Reply to: ${email})`;
                    alert("Your mail client has been opened to send the message. Thank you!");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20"
                >
                  Send Inquiry
                </button>
            </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

// --- PAGE: TERMS ---
export const TermsPage = () => (
  <div className="min-h-screen bg-slate-950 text-white font-sans">
    <TopNav />
    <div className="max-w-3xl mx-auto px-8 pt-32 pb-24 prose prose-invert prose-slate">
      <h1 className="text-4xl font-black tracking-tighter mb-12">Terms of Service</h1>
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

// --- PAGE: PRIVACY ---
export const PrivacyPage = () => (
  <div className="min-h-screen bg-slate-950 text-white font-sans">
    <TopNav />
    <div className="max-w-3xl mx-auto px-8 pt-32 pb-24 prose prose-invert prose-slate">
      <h1 className="text-4xl font-black tracking-tighter mb-12">Privacy Policy</h1>
      <p className="text-slate-400 text-sm italic">"Your data, your progress, your sovereignty."</p>
      <p>We do not sell your data. Your learning progress is used exclusively to calibrate the AI Tutor for your specific needs. We comply with GDPR and global privacy standards for academic data protection.</p>
    </div>
    <Footer />
  </div>
);

// --- PAGE: SYLLABUS ---
export const SyllabusPage = ({ title = "Classical Mechanics L1" }) => {
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
          <h1 className="text-4xl font-black tracking-tighter">{course.title}</h1>
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
                       <a href="https://github.com/Open-Primer/OpenPrimer" target="_blank" className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-950 text-slate-600 hover:text-white transition-colors">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                       </a>
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
