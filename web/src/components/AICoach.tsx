"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface AICoachProps {
  message: string;
  userName: string;
  lastVisited?: {
    title: string;
    path: string;
  };
}

export const AICoach = ({ message, userName, lastVisited }: AICoachProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-[40px] bg-blue-600 shadow-[0_20px_50px_rgba(37,99,235,0.3)] relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em]">AI Academic Coach</span>
        </div>
        
        <h2 className="text-3xl font-black text-white mb-4 leading-tight">
          {message}
        </h2>

        {lastVisited && (
          <motion.a
            href={lastVisited.path}
            whileHover={{ x: 5 }}
            className="inline-flex items-center gap-4 bg-white px-6 py-4 rounded-2xl text-blue-600 font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all mt-4"
          >
            Continue: {lastVisited.title}
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        )}
      </div>
      
      <div className="absolute bottom-4 right-8 opacity-10 text-white">
        <MessageSquare className="w-32 h-32 rotate-12" />
      </div>
    </motion.div>
  );
};
