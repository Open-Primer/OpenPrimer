import React from 'react';

interface UseWidgetCrudProps {
  adminId: string;
  selectedWidget: any;
  setSelectedWidget: (w: any) => void;
  getAuthHeaders: () => Promise<Record<string, string>>;
  loadWidgets: () => Promise<void>;
  setWidgetVersionKey: React.Dispatch<React.SetStateAction<number>>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  tr: (key: string) => string;
  translateText: (text: string, fromLang: string, toLang: string) => Promise<string>;
  editNameFR: string;
  editNameEN: string;
  editDescFR: string;
  editDescEN: string;
  editLevelFR: string;
  editLevelEN: string;
  editDisciplines: string[];
  setIsEditModalOpen: (v: boolean) => void;
  setIsSavingMetadata: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  lang: string;
  releaseLock: (widgetId: string, force?: boolean) => Promise<boolean>;
}

export function useWidgetCrud({
  adminId,
  selectedWidget,
  setSelectedWidget,
  getAuthHeaders,
  loadWidgets,
  setWidgetVersionKey,
  showToast,
  tr,
  translateText,
  editNameFR,
  editNameEN,
  editDescFR,
  editDescEN,
  editLevelFR,
  editLevelEN,
  editDisciplines,
  setIsEditModalOpen,
  setIsSavingMetadata,
  setLoading,
  lang,
  releaseLock
}: UseWidgetCrudProps) {
  const handleSaveParameters = async () => {
    if (!selectedWidget || !adminId) return;
    setIsSavingMetadata(true);

    try {
      let finalNameFR = editNameFR;
      let finalNameEN = editNameEN;
      let finalDescFR = editDescFR;
      let finalDescEN = editDescEN;
      let finalLevelFR = editLevelFR;
      let finalLevelEN = editLevelEN;

    const langKey = lang.toUpperCase();
    return (widget as any)[`description${langKey}`] || widget.description || '';
          translateText(editLevelFR, 'FR', 'EN')
        ]);
        finalNameEN = tName;
        finalDescEN = tDesc;
        finalLevelEN = tLevel;
      } else {
        const [tName, tDesc, tLevel] = await Promise.all([
          translateText(editNameEN, 'EN', 'FR'),
          translateText(editDescEN, 'EN', 'FR'),
          translateText(editLevelEN, 'EN', 'FR')
        ]);
        finalNameFR = tName;
        finalDescFR = tDesc;
        finalLevelFR = tLevel;
      }

      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          widgetId: selectedWidget.id,
          adminId,
          metadata: {
            nameFR: finalNameFR,
            nameEN: finalNameEN,
            descFR: finalDescFR,
            descEN: finalDescEN,
            levelFR: finalLevelFR,
            levelEN: finalLevelEN,
            disciplines: editDisciplines
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          tr("Pedagogical parameters successfully updated!"),
          'success'
        );
        setIsEditModalOpen(false);
        await loadWidgets();
      } else {
        showToast(data.error || "Failed to update parameters", 'error');
      }
    } catch (e: any) {
      console.error(e);
      showToast("Network exception saving parameters.", 'error');
    } finally {
      setIsSavingMetadata(false);
    }
  };

  const handleValidateWidget = async (widgetId: string) => {
    if (!adminId) return;
    try {
      setLoading(true);
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          action: 'validate',
          widgetId,
          adminId
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(tr("Widget draft successfully promoted and validated! All translations updated."), 'success');
        setWidgetVersionKey(prev => prev + 1);
        await loadWidgets();
      } else {
        showToast(data.error || tr("Failed to validate widget."), 'error');
      }
    } catch (e) {
      console.error(e);
      showToast(tr("Error validating widget draft."), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRollbackWidget = async (widgetId: string) => {
    if (!adminId) return;
    try {
      setLoading(true);
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          action: 'rollback',
          widgetId,
          adminId
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(tr("Draft discarded and original widget version restored!"), 'success');
        setWidgetVersionKey(prev => prev + 1);
        await loadWidgets();
      } else {
        showToast(data.error || tr("Failed to restore original widget."), 'error');
      }
    } catch (e) {
      console.error(e);
      showToast(tr("Error restoring original widget."), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForceUnlock = async (widgetIdToUnlock: string) => {
    const success = await releaseLock(widgetIdToUnlock, true);
    if (success) {
      showToast(
        tr("Lock successfully broken. Widget is now free!"),
        'success'
      );
      await loadWidgets();
    } else {
      showToast("Failed to force unlock widget.", 'error');
    }
  };

  return {
    handleSaveParameters,
    handleValidateWidget,
    handleRollbackWidget,
    handleForceUnlock
  };
}
