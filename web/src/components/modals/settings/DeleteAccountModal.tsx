"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { dbService } from '@/lib/db';

export interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  t,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl p-10 relative overflow-hidden text-slate-200"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 text-red-500 mb-6">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 block mb-1">
                  {t.delete_confirm_title_sub || "CONFIRMATION REQUISE"}
                </span>
                <h3 className="text-xl font-black text-white">
                  {t.delete_confirm_title || "Supprimer définitivement"}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              {t.delete_confirm_desc || "Êtes-vous sûr de vouloir supprimer votre compte ? Toutes vos progressions et récompenses seront définitivement effacées."}
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-800 transition-all cursor-pointer"
              >
                {t.cancel || "Annuler"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (typeof window !== 'undefined') {
                    const savedProfile = localStorage.getItem('op_user_profile');
                    if (savedProfile) {
                      try {
                        const p = JSON.parse(savedProfile);
                        const userId = p.id;
                        if (userId) {
                          await dbService.deleteUser(userId);
                        }
                      } catch (err) {
                        console.error("[Account Deletion] Error during database profile deletion:", err);
                      }
                    }
                    
                    try {
                      const { supabase } = await import('@/lib/supabase');
                      await supabase.auth.signOut();
                    } catch (signOutErr) {
                      console.error("[Account Deletion] Error during Supabase signOut:", signOutErr);
                    }

                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/';
                  }
                  onClose();
                }}
                className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-900/30 hover:scale-102 transition-all cursor-pointer"
              >
                {t.confirm || "Confirmer"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
