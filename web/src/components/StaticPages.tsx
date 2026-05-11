import React from 'react';
import { TopNav } from '@/components/RefinedUI';
import { Shield, Target, Users, Mail, Phone, MapPin, Globe, Sparkles, BookOpen } from 'lucide-react';

const Footer = () => (
  <footer className="mt-32 pt-16 border-t border-slate-900 pb-12 px-8">
    <div className="max-w-5xl mx-auto text-center">
       <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">
         OpenPrimer Project • 2026 • AI-Generated Academic Repository
       </p>
    </div>
  </footer>
);

// --- PAGE: MISSION ---
export const MissionPage = () => (
  <div className="min-h-screen bg-slate-950 text-white font-sans">
    <TopNav />
    <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <Target className="w-8 h-8 text-blue-500" />
        <h1 className="text-4xl font-black tracking-tighter">Our Mission</h1>
      </div>
      <p className="text-xl text-slate-400 leading-relaxed mb-12">
        To democratize world-class academic knowledge by leveraging artificial intelligence and the Feynman method.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
          <h3 className="font-bold mb-4">Universal Access</h3>
          <p className="text-sm text-slate-500">Breaking the barriers of cost and geography to provide education to every human being.</p>
        </div>
        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
          <h3 className="font-bold mb-4">Academic Rigor</h3>
          <p className="text-sm text-slate-500">Not just summaries, but deep academic deep-dives following university standards.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

// --- PAGE: ABOUT ---
export const AboutPage = () => (
  <div className="min-h-screen bg-slate-950 text-white font-sans">
    <TopNav />
    <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-8 h-8 text-emerald-500" />
        <h1 className="text-4xl font-black tracking-tighter">Who Are We?</h1>
      </div>
      <p className="text-lg text-slate-500 leading-relaxed mb-8">
        OpenPrimer is an international consortium of educators, developers, and AI researchers dedicated to building the definitive repository of human knowledge.
      </p>
    </div>
    <Footer />
  </div>
);

// --- PAGE: CONTACT ---
export const ContactPage = () => (
  <div className="min-h-screen bg-slate-950 text-white font-sans">
    <TopNav />
    <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <Mail className="w-8 h-8 text-violet-500" />
        <h1 className="text-4xl font-black tracking-tighter">Get in Touch</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase">Email</p>
              <p className="font-bold">hello@openprimer.org</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
           <form className="space-y-4">
              <input type="text" placeholder="Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm" />
              <textarea placeholder="Message" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm h-32"></textarea>
              <button className="w-full bg-blue-600 font-bold py-4 rounded-xl">Send Message</button>
           </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

// --- PAGE: CATALOG ---
export const CatalogPage = () => (
  <div className="min-h-screen bg-slate-950 text-white font-sans">
    <TopNav />
    <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">Course Catalog</h1>
          <p className="text-slate-500">Explore our certified academic modules.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-slate-900 rounded-full border border-slate-800 text-[10px] font-black uppercase tracking-widest text-blue-400">Physics</span>
          <span className="px-4 py-2 bg-slate-900 rounded-full border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">Biology</span>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Course Card Example */}
        <Link href="/L1/Physics/Kinematics_1D/introduction" className="group">
          <div className="p-8 bg-slate-900/40 border border-slate-900 rounded-[40px] hover:border-blue-500/50 transition-all shadow-xl hover:shadow-blue-600/5">
             <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
               <BookOpen className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-black mb-2">Kinematics 1D</h3>
             <p className="text-sm text-slate-500 mb-6">Master the fundamental principles of motion in a single dimension.</p>
             <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">3 ECTS</span>
               <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-500" />
             </div>
          </div>
        </Link>
      </div>
    </div>
    <Footer />
  </div>
);
