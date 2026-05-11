"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, Target, Users, Mail, Phone, MapPin, Globe, Sparkles, 
  BookOpen, ChevronRight, Search, Filter, Book, Award, Zap, Languages
} from 'lucide-react';
import { TopNav, UI_STRINGS } from './RefinedUI';
import { motion } from 'framer-motion';

const Footer = () => (
  <footer className="mt-32 pt-16 border-t border-slate-900 pb-12 px-8">
    <div className="max-w-5xl mx-auto text-center">
       <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">
         OpenPrimer Project • 2026 • Global AI Academic Initiative
       </p>
    </div>
  </footer>
);

// --- PAGE: CATALOG ---
export const CatalogPage = () => {
  const [activeLang, setActiveLang] = useState('EN');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [courseLangFilter, setCourseLangFilter] = useState('EN');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('op_lang') || 'EN';
    setActiveLang(saved);
    setCourseLangFilter(saved);
  }, []);

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
          
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules..." 
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
                    <div className="flex gap-1">
                      {course.langs.map(ln => (
                        <span key={ln} className={`w-2 h-2 rounded-full ${ln === courseLangFilter ? 'bg-blue-500' : 'bg-slate-800'}`} />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-black mb-3">{course.title}</h3>
                  <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed">Elite academic content certified in {course.langs.join(', ')}.</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                    <div className="flex items-center gap-2">
                       <div className="flex gap-0.5">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-500 fill-current' : 'text-slate-800'}`} />
                         ))}
                       </div>
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{course.subject}</span>
                    </div>
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

// --- PAGE: MISSION ---
export const MissionPage = () => {
  const [lang, setLang] = useState('EN');
  useEffect(() => setLang(localStorage.getItem('op_lang') || 'EN'), []);
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TopNav onLangChange={setLang} />
      <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <div className="flex items-center gap-3 mb-8 text-blue-500">
          <Target className="w-8 h-8" />
          <h1 className="text-4xl font-black tracking-tighter">Our Global Mission</h1>
        </div>
        <p className="text-xl text-slate-400 leading-relaxed mb-12">
          OpenPrimer is committed to delivering world-class knowledge in the world's 5 major languages: English, French, Spanish, German, and Chinese.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
           <div className="p-10 bg-slate-900/30 border border-slate-800 rounded-[40px]">
              <h3 className="text-white font-black uppercase text-xs tracking-widest mb-4">Linguistic Equality</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Every certified module is pre-indexed and curated in 5 languages to ensure no student is left behind.</p>
           </div>
           <div className="p-10 bg-slate-900/30 border border-slate-800 rounded-[40px]">
              <h3 className="text-white font-black uppercase text-xs tracking-widest mb-4">The Feynman Engine</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Our AI translates not just words, but concepts, ensuring academic rigor across cultural boundaries.</p>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// --- PAGE: ABOUT ---
export const AboutPage = () => (
  <div className="min-h-screen bg-slate-950 text-white font-sans">
    <TopNav />
    <div className="max-w-4xl mx-auto px-8 pt-32 pb-24 text-center md:text-left">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
        <Users className="w-10 h-10 text-emerald-500" />
        <h1 className="text-5xl font-black tracking-tighter">Who Are We?</h1>
      </div>
      <p className="text-lg text-slate-400 leading-relaxed mb-16">
        We are a decentralized consortium of academic researchers and AI developers based in Europe and Asia. 
        Our focus is on creating a truly global repository of human knowledge.
      </p>
      <div className="flex flex-wrap gap-4 justify-center md:justify-start opacity-50">
         {['🇨🇳 ZH', '🇬🇧 EN', '🇫🇷 FR', '🇪🇸 ES', '🇩🇪 DE'].map(l => (
           <span key={l} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold">{l}</span>
         ))}
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
               <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Global Support</p>
               <p className="font-bold text-slate-200 uppercase">support@openprimer.org</p>
             </div>
          </div>
        </div>
        <div className="bg-slate-900/50 p-10 rounded-[40px] border border-slate-800 shadow-2xl backdrop-blur-2xl">
           <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Full Name" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
              <textarea placeholder="Your Message" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm h-40 focus:outline-none focus:border-blue-500/50 transition-all resize-none"></textarea>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20">Send Inquiry</button>
           </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
