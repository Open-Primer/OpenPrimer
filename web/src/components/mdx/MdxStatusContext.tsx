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

export function MdxStatusProvider({ children }: { children: React.ReactNode }) {
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
  }, []);

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
