"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type DegradedReason = 'image' | 'video' | 'audio' | 'quiz' | 'widget';

interface MdxStatusContextType {
  isDegraded: boolean;
  degradedReasons: Set<DegradedReason>;
  markDegraded: (reason: DegradedReason) => void;
}

const MdxStatusContext = createContext<MdxStatusContextType | undefined>(undefined);

export function MdxStatusProvider({ children }: { children: React.ReactNode }) {
  const [reasons, setReasons] = useState<Set<DegradedReason>>(new Set());

  const markDegraded = useCallback((reason: DegradedReason) => {
    setReasons((prev) => {
      if (prev.has(reason)) return prev;
      const next = new Set(prev);
      next.add(reason);
      return next;
    });
  }, []);

  const isDegraded = reasons.size > 0;

  const value = useMemo(() => ({
    isDegraded,
    degradedReasons: reasons,
    markDegraded,
  }), [isDegraded, reasons, markDegraded]);

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
    };
  }
  return context;
}
