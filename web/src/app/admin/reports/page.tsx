"use client";

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { AlertTriangle, CheckCircle2, XCircle, Search, Eye, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    dbService.getReports().then(setReports);
  }, []);

  const handleAutoApprove = async () => {
    await dbService.autoApproveAll();
    dbService.getReports().then(setReports);
  };

  const handleApprove = async (id: string) => {
    await dbService.updateReportStatus(id, 'Fixed (AI)');
    dbService.getReports().then(setReports);
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-white">Error Reports</h1>
          <p className="text-slate-500 text-sm font-medium">Quality control queue for AI-generated academic content.</p>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={handleAutoApprove}
            className="px-6 py-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
           >
             <Sparkles className="w-4 h-4" /> Auto-Approve All
           </button>
           <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <input placeholder="Search reports..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-xs text-white" />
           </div>
        </div>
      </header>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="p-8 rounded-[32px] bg-slate-900/40 border border-slate-800/50 flex flex-col md:flex-row items-center gap-8 group hover:border-blue-500/20 transition-all">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{report.course}</span>
                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${report.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {report.status}
                </span>
              </div>
              <p className="text-sm text-slate-200 mb-2 leading-relaxed">"{report.issue}"</p>
              <div className="flex gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                <span>By {report.user}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"><Eye className="w-4 h-4" /></button>
              {report.status === 'Pending' && (
                <button 
                  onClick={() => handleApprove(report.id)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                >
                  Approve Fix
                </button>
              )}
              <button className="p-3 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-all"><XCircle className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
