import React from 'react';
import { toPascalCase } from './widgetPresets';

interface UseWidgetAIActionsProps {
  adminId: string;
  isFrancophoneLocale: boolean;
  newWidgetNameFR: string;
  newWidgetNameEN: string;
  newWidgetDescFR: string;
  newWidgetDescEN: string;
  newWidgetLevelFR: string;
  newWidgetLevelEN: string;
  newWidgetDisciplines: string[];
  newWidgetPrompt: string;
  isExecuting: boolean;
  namingCollisionError: string | null;
  setIsCreateModalOpen: (v: boolean) => void;
  setIsGenerating: (v: boolean) => void;
  setErrorDetails: (v: string | null) => void;
  setCurrentStep: (v: number) => void;
  widgets: any[];
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  tr: (k: string) => string;
  getAuthHeaders: () => Promise<Record<string, string>>;
  loadWidgets: () => Promise<void>;
  translateText: (text: string, fromLang: string, toLang: string) => Promise<string>;
  selectedWidget: any;
  prompt: string;
  setPrompt: (v: string) => void;
}

export function useWidgetAIActions({
  adminId,
  isFrancophoneLocale,
  newWidgetNameFR,
  newWidgetNameEN,
  newWidgetDescFR,
  newWidgetDescEN,
  newWidgetLevelFR,
  newWidgetLevelEN,
  newWidgetDisciplines,
  newWidgetPrompt,
  isExecuting,
  namingCollisionError,
  setIsCreateModalOpen,
  setIsGenerating,
  setErrorDetails,
  setCurrentStep,
  widgets,
  showToast,
  tr,
  getAuthHeaders,
  loadWidgets,
  translateText,
  selectedWidget,
  prompt,
  setPrompt
}: UseWidgetAIActionsProps) {
  const handleCreateWidget = async () => {
    const isFr = isFrancophoneLocale;
    const activeName = isFr ? newWidgetNameFR.trim() : newWidgetNameEN.trim();
    if (!activeName || !newWidgetPrompt.trim() || isExecuting || namingCollisionError) return;

    setIsCreateModalOpen(false);
    setIsGenerating(true);
    setErrorDetails(null);
    setCurrentStep(1);

    let finalNameFR = '';
    let finalNameEN = '';
    let finalDescFR = '';
    let finalDescEN = '';
    let finalLevelFR = '';
    let finalLevelEN = '';

    try {
      const stepTimer1 = setTimeout(() => setCurrentStep(2), 5000);
      const stepTimer2 = setTimeout(() => setCurrentStep(3), 8000);
      const stepTimer3 = setTimeout(() => setCurrentStep(4), 11000);

      if (isFr) {
        finalNameFR = newWidgetNameFR.trim();
        finalNameEN = await translateText(finalNameFR, 'FR', 'EN');
        
        const rawDesc = newWidgetDescFR.trim();
        finalDescFR = rawDesc || "Composant interactif personnalisé pour l'enrichissement pédagogique.";
        finalDescEN = rawDesc ? await translateText(rawDesc, 'FR', 'EN') : "Custom interactive component built for pedagogical curriculum enrichment.";

        const rawLevel = newWidgetLevelFR.trim();
        finalLevelFR = rawLevel || "Lycée / Université";
        finalLevelEN = rawLevel ? await translateText(rawLevel, 'FR', 'EN') : "High School / University";
      } else {
        finalNameEN = newWidgetNameEN.trim();
        finalNameFR = await translateText(finalNameEN, 'EN', 'FR');

        const rawDesc = newWidgetDescEN.trim();
        finalDescEN = rawDesc || "Custom interactive component built for pedagogical curriculum enrichment.";
        finalDescFR = rawDesc ? await translateText(rawDesc, 'EN', 'FR') : "Composant interactif personnalisé pour l'enrichissement pédagogique.";

        const rawLevel = newWidgetLevelEN.trim();
        finalLevelEN = rawLevel || "High School / University";
        finalLevelFR = rawLevel ? await translateText(rawLevel, 'EN', 'FR') : "Lycée / Université";
      }

      const computedId = toPascalCase(finalNameEN);
      const widgetIdClean = computedId || "CustomWidget" + Math.floor(Math.random() * 1000);

      if (widgets.some(w => w.id.toLowerCase() === widgetIdClean.toLowerCase())) {
        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);
        clearTimeout(stepTimer3);
        setIsGenerating(false);
        setCurrentStep(0);
        showToast(tr("A widget with this name already exists!"), 'error');
        return;
      }

      const authHeaders = await getAuthHeaders();
      const response = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          widgetId: widgetIdClean,
          prompt: newWidgetPrompt,
          adminId,
          metadata: {
            nameFR: finalNameFR,
            nameEN: finalNameEN,
            descFR: finalDescFR,
            descEN: finalDescEN,
            levelFR: finalLevelFR,
            levelEN: finalLevelEN,
            disciplines: newWidgetDisciplines.length > 0 ? newWidgetDisciplines : ["General"]
          }
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await response.json();
      if (data.success) {
        showToast(tr("Widget successfully generated and registered!"), 'success');
        setCurrentStep(0);
        setIsGenerating(false);
        await loadWidgets();
      } else {
        setIsGenerating(false);
        setCurrentStep(0);
        setErrorDetails(data.error || "Failed to generate widget");
        showToast(data.error || "Generation error", 'error');
      }
    } catch (e: any) {
      console.error(e);
      setIsGenerating(false);
      setCurrentStep(0);
      setErrorDetails(e.message || "Network error generating widget");
      showToast("Network exception during generation", 'error');
    }
  };

  const handleEnhanceWidget = async () => {
    if (!selectedWidget || !prompt.trim() || isExecuting || !adminId) return;
    setIsGenerating(true);
    setErrorDetails(null);
    setCurrentStep(1);

    try {
      const stepTimer1 = setTimeout(() => setCurrentStep(2), 4000);
      const stepTimer2 = setTimeout(() => setCurrentStep(3), 8000);
      const stepTimer3 = setTimeout(() => setCurrentStep(4), 12000);

      const authHeaders = await getAuthHeaders();
      const response = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          widgetId: selectedWidget.id,
          prompt,
          adminId
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await response.json();
      if (data.success) {
        showToast(tr("Widget draft successfully generated! Review before validating."), 'success');
        setPrompt('');
        setCurrentStep(0);
        setIsGenerating(false);
        await loadWidgets();
      } else {
        setIsGenerating(false);
        setCurrentStep(0);
        setErrorDetails(data.error || "Failed to update widget");
        showToast(data.error || "Refinement error", 'error');
      }
    } catch (e: any) {
      console.error(e);
      setIsGenerating(false);
      setCurrentStep(0);
      setErrorDetails(e.message || "Network error during compilation");
      showToast("Network error executing compilation", 'error');
    }
  };

  return {
    handleCreateWidget,
    handleEnhanceWidget
  };
}
