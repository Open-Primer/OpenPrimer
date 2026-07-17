"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type DegradedReason = 'image' | 'video' | 'audio' | 'quiz' | 'widget' | 'entity';

interface MdxStatusContextType {
  isDegraded: boolean;
  degradedReasons: Set<DegradedReason>;
  markDegraded: (reason: DegradedReason) => void;
  registerFigure: (id: string) => void;
  unregisterFigure: (id: string) => void;
  registeredFigures: string[];
  registerDiagram: (id: string) => void;
  unregisterDiagram: (id: string) => void;
  registeredDiagrams: string[];
}

const MdxStatusContext = createContext<MdxStatusContextType | undefined>(undefined);

export function MdxStatusProvider({ children, courseSlug, lessonSlug }: { children: React.ReactNode; courseSlug?: string; lessonSlug?: string }) {
  const [reasons, setReasons] = useState<Set<DegradedReason>>(new Set());
  const [registeredFigures, setRegisteredFigures] = useState<string[]>([]);
  const [registeredDiagrams, setRegisteredDiagrams] = useState<string[]>([]);

  const markDegraded = useCallback((reason: DegradedReason) => {
    setReasons((prev) => {
      if (prev.has(reason)) return prev;
      const next = new Set(prev);
      next.add(reason);
      return next;
    });

    // Automatically submit an incident report when degraded mode is marked!
    let resolvedCourse = courseSlug;
    let resolvedLesson = lessonSlug;
    if (typeof window !== 'undefined' && (!resolvedCourse || !resolvedLesson)) {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts.length >= 4) {
        if (!resolvedCourse) resolvedCourse = parts[2];
        if (!resolvedLesson) resolvedLesson = parts[3];
      }
    }
    const course = resolvedCourse || 'general';
    const page = resolvedLesson || 'unknown';

    import('@/lib/db').then(({ dbService }) => {
      dbService.submitReport(
        course,
        page,
        `MDX_RENDERING_FAILURE: Degraded mode triggered for asset type: ${reason}`
      ).then(({ error }) => {
        if (error) {
          console.error("Failed to submit degraded mode report:", error);
        } else {
          console.log(`[MDX Status] Auto-submitted incident report for degraded type: ${reason}`);
        }
      }).catch(err => {
        console.error("Exception submitting degraded mode report:", err);
      });
    });
  }, [courseSlug, lessonSlug]);

  const registerFigure = useCallback((id: string) => {
    setRegisteredFigures((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const unregisterFigure = useCallback((id: string) => {
    setRegisteredFigures((prev) => {
      if (!prev.includes(id)) return prev;
      return prev.filter((f) => f !== id);
    });
  }, []);

  const registerDiagram = useCallback((id: string) => {
    setRegisteredDiagrams((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const unregisterDiagram = useCallback((id: string) => {
    setRegisteredDiagrams((prev) => {
      if (!prev.includes(id)) return prev;
      return prev.filter((d) => d !== id);
    });
  }, []);

  const isDegraded = reasons.size > 0;

  const value = useMemo(() => ({
    isDegraded,
    degradedReasons: reasons,
    markDegraded,
    registerFigure,
    unregisterFigure,
    registeredFigures,
    registerDiagram,
    unregisterDiagram,
    registeredDiagrams
  }), [isDegraded, reasons, markDegraded, registerFigure, unregisterFigure, registeredFigures, registerDiagram, unregisterDiagram, registeredDiagrams]);

  return (
    <MdxStatusContext.Provider value={value}>
      {children}
    </MdxStatusContext.Provider>
  );
}

export function useMdxStatus() {
  const context = useContext(MdxStatusContext);
  if (context === undefined) {
    // Return a fallback so that components can be used outside of the provider safely
    return {
      isDegraded: false,
      degradedReasons: new Set<DegradedReason>(),
      markDegraded: () => {},
      registerFigure: () => {},
      unregisterFigure: () => {},
      registeredFigures: [],
      registerDiagram: () => {},
      unregisterDiagram: () => {},
      registeredDiagrams: []
    };
  }
  return context;
}
