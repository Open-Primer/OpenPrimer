import React, { useState, useEffect } from 'react';
import { DISCIPLINES, getDisciplineLabel, ACADEMIC_LEVELS } from '../../strings';

interface UseWidgetAdminStateProps {
  adminId: string;
  setAdminId: (v: string) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  tr: (k: string) => string;
}

export function useWidgetAdminConcurrency({ adminId, setAdminId, showToast, tr }: UseWidgetAdminStateProps) {
  useEffect(() => {
    let savedAdminId = '';
    if (typeof window !== 'undefined') {
      try {
        const profile = JSON.parse(localStorage.getItem('op_user_profile') || '{}');
        savedAdminId = profile.name || profile.email || localStorage.getItem('op_admin_editor_id') || '';
      } catch (e) {}
      if (!savedAdminId) {
        savedAdminId = localStorage.getItem('op_admin_editor_id') || '';
      }
      if (!savedAdminId) {
        savedAdminId = 'Admin_' + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem('op_admin_editor_id', savedAdminId);
      }
    }
    setAdminId(savedAdminId);
  }, []);

  const handleSaveAdminName = (name: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      setAdminId(trimmed);
      localStorage.setItem('op_admin_editor_id', trimmed);
    }
  };

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        return { Authorization: `Bearer ${session.access_token}` };
      }
    } catch (e) {}
    return {};
  };

  const acquireLock = async (widgetIdToLock: string): Promise<boolean> => {
    if (!adminId) return false;
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ action: 'lock', widgetId: widgetIdToLock, adminId })
      });
      const data = await res.json();
      return !!data.success;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const releaseLock = async (widgetIdToUnlock: string, force: boolean = false): Promise<boolean> => {
    if (!adminId && !force) return false;
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ action: 'unlock', widgetId: widgetIdToUnlock, adminId, force })
      });
      const data = await res.json();
      return !!data.success;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return {
    handleSaveAdminName,
    getAuthHeaders,
    acquireLock,
    releaseLock
  };
}

export const useWidgetConcurrency = useWidgetAdminConcurrency;
