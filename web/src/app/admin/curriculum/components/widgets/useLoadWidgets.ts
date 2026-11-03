import React from 'react';
import { Widget } from './widgetPresets';

interface UseLoadWidgetsProps {
  getAuthHeaders: () => Promise<Record<string, string>>;
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>;
  setSelectedWidget: React.Dispatch<React.SetStateAction<Widget | null>>;
  setLoading: (v: boolean) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  tr: (k: string) => string;
}

export function useLoadWidgets({
  getAuthHeaders,
  setWidgets,
  setSelectedWidget,
  setLoading,
  showToast,
  tr
}: UseLoadWidgetsProps) {
  const loadWidgets = async () => {
    try {
      setLoading(true);
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/admin/widgets', {
        headers: {
          ...authHeaders
        }
      });
      const data = await res.json();
      if (data.widgets) {
        setWidgets(data.widgets);
        setSelectedWidget((prev: any) => {
          if (!prev) return data.widgets[0] || null;
          const updated = data.widgets.find((w: any) => w.id === prev.id);
          return updated || data.widgets[0] || null;
        });
      }
    } catch (e) {
      console.error(e);
      showToast(tr("Failed to load interactive widgets."), 'error');
    } finally {
      setLoading(false);
    }
  };

  return { loadWidgets };
}
