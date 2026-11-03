"use client";

import React from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import { dbService } from '@/lib/db';
import { DANGER_ZONE_TRANSLATIONS } from '../settings-strings';

export interface DangerZoneTabProps {
  t: any;
  lang: string;
  setShowDeleteConfirm: (val: boolean) => void;
}

export const DangerZoneTab: React.FC<DangerZoneTabProps> = ({
  t,
  lang,
  setShowDeleteConfirm,
}) => {
  return (
    <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-3">
                    <ShieldAlert className="w-4 h-4" /> {t.danger_zone || "Zone de Danger"}
                  </h3>
                  
                  {/* Reset Local Cache Card */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-red-500/5 border border-red-500/10 rounded-3xl">
                    <div>
                      <p className="font-black text-white uppercase tracking-widest text-xs">
                        {DANGER_ZONE_TRANSLATIONS[lang.toUpperCase() as keyof typeof DANGER_ZONE_TRANSLATIONS]?.flush_title || DANGER_ZONE_TRANSLATIONS.EN.flush_title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 italic">
                        {DANGER_ZONE_TRANSLATIONS[lang.toUpperCase() as keyof typeof DANGER_ZONE_TRANSLATIONS]?.flush_desc || DANGER_ZONE_TRANSLATIONS.EN.flush_desc}
                      </p>
                    </div>
                    <button 
                      onClick={async () => {
                        await dbService.flushLocalCaches();
                        if (typeof window !== 'undefined') {
                          window.location.reload();
                        }
                      }} 
                      className="flex items-center gap-3 px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> 
                      {DANGER_ZONE_TRANSLATIONS[lang.toUpperCase() as keyof typeof DANGER_ZONE_TRANSLATIONS]?.flush_btn || DANGER_ZONE_TRANSLATIONS.EN.flush_btn}
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-red-500/5 border border-red-500/10 rounded-3xl">
                    <div>
                      <p className="font-black text-white uppercase tracking-widest text-xs">{t.delete_account || "Supprimer le compte"}</p>
                      <p className="text-xs text-slate-500 mt-1 italic">{t.delete_desc || "Cette action est irr├®versible et supprimera toutes vos donn├®es."}</p>
                    </div>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)} 
                      className="flex items-center gap-3 px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> {t.delete_account || "Supprimer le compte"}
                    </button>
                  </div>
                </div>
  );
};
