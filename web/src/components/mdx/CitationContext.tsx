"use client";

import { createContext, useContext } from 'react';

// Keep old exports for backward compatibility
export const CitationContext = createContext<boolean>(false);
export const useInsideCitation = () => useContext(CitationContext);

// New unnested/evaluation block overlay controller
export const NestingContext = createContext<{ disableOverlays?: boolean }>({ disableOverlays: false });
export const useNesting = () => useContext(NestingContext);
