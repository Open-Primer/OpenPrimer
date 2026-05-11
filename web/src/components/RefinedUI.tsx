"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, Sparkles, User, Bot, X, MessageSquare, AlertTriangle, Share2, Bookmark, Menu, ChevronRight, CheckCircle, ChevronDown, LogOut, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AITutorOverlay = ({ pageContext }: { pageContext?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Bonjour ! Je suis votre tuteur OpenPrimer. Posez-moi une question sur ce module." }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages([...messages, { role: 'user', content: userMsg }]);
    setInput('');
    
    // Simulation d'une réponse basée sur le contexte du cours
    setTimeout(() => {
      let response = "C'est une excellente question académique.";
      if (pageContext?.toLowerCase().includes("membrane")) {
        response = "D'après le cours, la membrane est semi-perméable, ce qui permet le transport sélectif des ions.";
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 font-sans text-slate-100">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-96 h-[500px] rounded-[32px] bg-slate-900/80 border border-slate-800/50 shadow-2xl backdrop-blur-3xl flex flex-col overflow-hidden glass"
          >
            <div className="p-5 border-b border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-xs uppercase tracking-widest opacity-80">Tutor</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'assistant' 
                      ? 'bg-slate-800/50 text-slate-300' 
                      : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-slate-950/30 border-t border-slate-800/50">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600"
                />
                <button onClick={handleSend} className="absolute right-3 top-2.5 p-1.5 text-blue-500 hover:text-blue-400 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/40 flex items-center justify-center relative group border border-white/10"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export const TopNav = ({ toggleSidebar, isCoursePage = false }: { toggleSidebar?: () => void, isCoursePage?: boolean }) => {
  const [showReport, setShowReport] = useState(false);
  const [reportInput, setReportInput] = useState('');
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isReportSent, setIsReportSent] = useState(false);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleSendReport = () => {
    if (!reportInput.trim()) return;
    setIsReportSent(true);
    setReportInput('');
    setTimeout(() => {
      setIsReportSent(false);
      setShowReport(false);
      triggerToast("Report sent to AI Review.");
    }, 2000);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-900 z-50 px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {isCoursePage && (
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-900 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-400" />
          </button>
        )}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
        </Link>
      </div>

      <div className="flex items-center gap-8">
        {/* Advanced Language Selector */}
        <div className="relative group/lang">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
            <span className="text-lg">🇫🇷</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">FR</span>
            <ChevronDown className="w-3 h-3 text-slate-600 group-hover/lang:rotate-180 transition-transform" />
          </button>
          <div className="absolute top-full right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 group-hover/lang:opacity-100 pointer-events-none group-hover/lang:pointer-events-auto transition-all translate-y-2 group-hover/lang:translate-y-0 z-[100] overflow-hidden">
             <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
               <span>🇬🇧</span> EN
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/5">
               <span>🇫🇷</span> FR
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
               <span>🇪🇸</span> ES
             </button>
          </div>
        </div>

        {isCoursePage && (
          <button 
            onClick={() => setShowReport(!showReport)} 
            className={`p-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${
              showReport ? 'bg-red-500/20 text-red-400' : 'hover:bg-red-500/10 text-slate-500 hover:text-red-400'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> <span className="hidden lg:inline">Report</span>
          </button>
        )}
        <button 
          onClick={() => { triggerToast("Link copied!"); }}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all"
        >
          <Share2 className="w-4 h-4" />
        </button>
        {isCoursePage && (
          <button 
            onClick={() => { triggerToast("Course bookmarked!"); }}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        )}
        <div className="w-px h-6 bg-slate-800 mx-2" />
        
        {/* Dynamic User Menu */}
        <div className="relative group/user">
          <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all overflow-hidden group">
            <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 group-hover/user:opacity-100 pointer-events-none group-hover/user:pointer-events-auto transition-all translate-y-2 group-hover/user:translate-y-0 z-[100] overflow-hidden">
             <div className="px-4 py-3 border-b border-slate-800">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Account</p>
               <p className="text-xs font-bold text-white truncate">student@openprimer.org</p>
             </div>
             <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
               <User className="w-4 h-4" /> Profile
             </Link>
             <button 
               onClick={() => { triggerToast("Logged out successfully"); }}
               className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
             >
               <LogOut className="w-4 h-4" /> Sign Out
             </button>
             <button 
               onClick={() => { triggerToast("Account deletion requested"); }}
               className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest text-red-500 transition-colors border-t border-slate-800"
             >
               <Trash2 className="w-4 h-4" /> Delete Account
             </button>
          </div>
        </div>
      </div>

      {/* TOP-ALIGNED REPORT INPUT */}
      <AnimatePresence>
        {showReport && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 right-6 w-full max-w-sm z-50"
          >
             <div className="relative group">
              <div className="absolute inset-0 bg-red-600/10 blur-xl opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-slate-900/90 border border-slate-800/50 p-1.5 rounded-2xl backdrop-blur-xl shadow-2xl focus-within:border-red-500/30 transition-all">
                <div className="pl-4 pr-2">
                  <AlertTriangle className={`w-4 h-4 ${isReportSent ? 'text-emerald-400' : 'text-slate-600'}`} />
                </div>
                <input 
                  autoFocus
                  value={reportInput}
                  onChange={(e) => setReportInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReport()}
                  placeholder={isReportSent ? "Thank you! Reviewed soon." : "Spotted an error? Tell us..."}
                  className={`flex-1 bg-transparent border-none py-2 text-xs text-white focus:outline-none placeholder:text-slate-700 font-medium ${isReportSent ? 'text-emerald-400' : ''}`}
                />
                <button 
                  onClick={handleSendReport}
                  className="bg-slate-800 hover:bg-red-600/20 text-slate-500 hover:text-red-400 p-2 rounded-xl transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 shadow-2xl flex items-center gap-3 z-[60]"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-100">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
